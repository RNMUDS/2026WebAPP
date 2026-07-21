// ============================================================
// server.js — マルチプレイ3D空間のサーバ
// ============================================================
// やること:
//   1. public/ の中身（3D空間・ダッシュボード）を配信
//   2. Socket.IO で全員のアバタ位置を同期
//   3. 入退室・移動・クリック・チャットを db.js で記録
//   4. ダッシュボード用に集計結果を REST API で返す
//   5. 起動時に「クラスメイトに伝えるIPアドレス」を表示

const express = require('express');
const socketIo = require('socket.io');
const os = require('os');
const db = require('./db');   // ← 行動データの記録・集計は db.js に任せる

const app = express();
app.use(express.static('public'));

// ---- ダッシュボード用の REST API ----
// ブラウザから fetch('/api/summary') のように呼ぶと JSON が返る
app.get('/api/summary', (req, res) => res.json(db.getSummary()));
app.get('/api/users',   (req, res) => res.json(db.getUsers()));
app.get('/api/objects', (req, res) => res.json(db.getObjects()));
app.get('/api/events',  (req, res) => res.json(db.getRecent(100)));
app.get('/api/paths',   (req, res) => res.json(db.getPaths()));

const server = app.listen(3000, () => {
  console.log('========================================');
  console.log(' マルチプレイ空間 起動しました');
  console.log('  自分:        http://localhost:3000');
  console.log('  ダッシュボード: http://localhost:3000/dashboard.html');
  console.log('');
  console.log(' クラスメイトに伝えるアドレス（同じWi-Fiのとき）:');
  printLanAddresses();          // ← LAN内のIPを表示
  console.log('========================================');
});

const io = socketIo(server);

// 接続中ユーザーの色と名前を覚えておく（サーバのメモリ上）
const colors = ['#EF2D5E', '#4CC3D9', '#FFC65D', '#7BC8A4', '#A24CD9', '#FF9F1C'];
const users = {};   // { socketId: { name, color } }

io.on('connection', (socket) => {
  const color = colors[Math.floor(Math.random() * colors.length)];
  users[socket.id] = { name: '名無し', color };
  console.log('接続:', socket.id);

  // --- 入室（名前が決まったら呼ばれる） ---
  socket.on('join', (data) => {
    users[socket.id].name = data.name || '名無し';
    db.record({ user_id: socket.id, name: users[socket.id].name, type: 'join' });
  });

  // --- 移動: 位置を他の全員へ転送する（同期の中心） ---
  socket.on('move', (data) => {
    socket.broadcast.emit('moved', {
      id: socket.id,
      color: users[socket.id].color,
      name: users[socket.id].name,
      position: data.position
    });
  });

  // --- 移動サンプル: 数秒ごとに位置を記録（あとで移動量を出すため） ---
  socket.on('move-sample', (data) => {
    db.record({
      user_id: socket.id, name: users[socket.id].name, type: 'move',
      x: data.position.x, y: data.position.y, z: data.position.z
    });
  });

  // --- クリック: 空間内の物をクリックした ---
  socket.on('click', (data) => {
    db.record({
      user_id: socket.id, name: users[socket.id].name, type: 'click',
      x: data.position?.x, y: data.position?.y, z: data.position?.z,
      detail: data.target
    });
  });

  // --- ゴール到達: 迷路などで目的地に着いた ---
  socket.on('goal', (data) => {
    db.record({
      user_id: socket.id, name: users[socket.id].name, type: 'goal',
      x: data.position?.x, y: data.position?.y, z: data.position?.z
    });
  });

  // --- チャット: 全員へ配信し、記録もする ---
  socket.on('chat', (data) => {
    const name = users[socket.id].name;
    io.emit('chat', { name, text: data.text });
    db.record({ user_id: socket.id, name, type: 'chat', detail: data.text });
  });

  // --- 切断: アバタを全員から消して、退室を記録 ---
  socket.on('disconnect', () => {
    db.record({ user_id: socket.id, name: users[socket.id].name, type: 'leave' });
    socket.broadcast.emit('userLeft', { id: socket.id });
    delete users[socket.id];
    console.log('切断:', socket.id);
  });
});

// PCが持っているLAN内のIPv4アドレスを表示する
function printLanAddresses() {
  const nets = os.networkInterfaces();
  let found = false;
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`   http://${net.address}:3000`);
        found = true;
      }
    }
  }
  if (!found) console.log('   （ネットワーク未接続のようです）');
}
