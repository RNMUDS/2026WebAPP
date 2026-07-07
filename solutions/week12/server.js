const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'players.json');

const avatarColors = ['#76B900', '#4FC3F7', '#FFB800', '#E040FB', '#FF6E40', '#93D500'];
const objectColorCycle = ['#FF5252', '#4FC3F7', '#76B900', '#FFB800', '#E040FB', '#FF6E40'];

// players: 過去にログインした全員の記録（蓄積・サーバ再起動をまたいで残る）
// objects: 共有オブジェクト（obj-1〜3）の色・拡大状態
let data = {
  players: {},
  objects: {
    'obj-1': { color: '#FF5252', big: false },
    'obj-2': { color: '#4FC3F7', big: false },
    'obj-3': { color: '#76B900', big: false }
  }
};

if (fs.existsSync(DATA_FILE)) {
  data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log('players.json を読み込みました:', Object.keys(data.players).length, '件');
}

function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// liveUsers: 現在接続中のユーザ（アバタ表示・移動同期用。再起動でリセットされる）
const liveUsers = {};

io.on('connection', (socket) => {
  console.log('接続:', socket.id);

  socket.on('login', (payload) => {
    const name = (payload && payload.name ? String(payload.name) : '').trim();
    if (!name) return;

    const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    // 蓄積データに追加して保存（1.6・1.7）
    data.players[socket.id] = {
      name: name,
      color: color,
      loggedInAt: new Date().toISOString()
    };
    save();

    liveUsers[socket.id] = {
      id: socket.id,
      name: name,
      color: color,
      position: { x: 0, y: 1.6, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    };

    socket.emit('initState', {
      id: socket.id,
      users: liveUsers,
      objects: data.objects
    });
    socket.broadcast.emit('userJoined', liveUsers[socket.id]);
  });

  socket.on('move', (payload) => {
    if (liveUsers[socket.id]) {
      liveUsers[socket.id].position = payload.position;
      liveUsers[socket.id].rotation = payload.rotation;
      socket.broadcast.emit('userMoved', {
        id: socket.id,
        position: payload.position,
        rotation: payload.rotation
      });
    }
  });

  // インタラクション: 共有オブジェクトをクリック → 色を巡回 + 拡大状態を反転
  socket.on('objectClick', (payload) => {
    const obj = data.objects[payload.id];
    if (!obj) return;

    const currentIndex = objectColorCycle.indexOf(obj.color);
    obj.color = objectColorCycle[(currentIndex + 1) % objectColorCycle.length];
    obj.big = !obj.big;
    save(); // インタラクションが変化したので保存（1.6）

    const scale = obj.big ? '1.5 1.5 1.5' : '1 1 1';
    io.emit('objectUpdated', { id: payload.id, color: obj.color, scale: scale });
    io.emit('playAnimation', { id: payload.id });
  });

  socket.on('disconnect', () => {
    console.log('切断:', socket.id);
    delete liveUsers[socket.id];
    io.emit('userLeft', socket.id);
  });
});

// ダッシュボードAPI: players.json を集計してJSONで返す（1.8）
app.get('/api/stats', (req, res) => {
  const list = Object.values(data.players);

  let names = [];
  let colorCounts = {};

  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    names.push(p.name);

    if (colorCounts[p.color] === undefined) {
      colorCounts[p.color] = 1;
    } else {
      colorCounts[p.color] = colorCounts[p.color] + 1;
    }
  }

  names.sort();

  let mostPopularColor = null;
  let mostPopularCount = 0;
  for (const color in colorCounts) {
    if (colorCounts[color] > mostPopularCount) {
      mostPopularCount = colorCounts[color];
      mostPopularColor = color;
    }
  }

  res.json({
    count: list.length,
    names: names,
    colorCounts: colorCounts,
    mostPopularColor: mostPopularColor
  });
});

server.listen(3000, () => {
  console.log('サーバ起動: http://localhost:3000');
});
