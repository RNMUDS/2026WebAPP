const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// TODO: db.js をインポート
// const { getAllObjects, upsertObject, updateObjectColor } = require('./db');

// TODO: 初期データの投入（DBが空なら）
// const existing = getAllObjects();
// if (existing.length === 0) {
//   upsertObject('obj-1', '#E74C3C', -4, 1, -4);
//   upsertObject('obj-2', '#3498DB', -2, 1, -4);
//   upsertObject('obj-3', '#2ECC71', 0, 1, -4);
//   upsertObject('obj-4', '#F39C12', 2, 1, -4);
//   upsertObject('obj-5', '#9B59B6', 4, 1, -4);
// }

const users = {};
const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];

io.on('connection', (socket) => {
  console.log('ユーザ接続:', socket.id);

  users[socket.id] = {
    id: socket.id,
    color: colors[Math.floor(Math.random() * colors.length)],
    position: { x: 0, y: 1.6, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  };

  // TODO: getAllObjects() でDBから状態を読み込んで送信
  socket.emit('init', { id: socket.id, users, objects: [] });
  socket.broadcast.emit('user-joined', users[socket.id]);

  socket.on('move', (data) => {
    if (users[socket.id]) {
      users[socket.id].position = data.position;
      users[socket.id].rotation = data.rotation;
      socket.broadcast.emit('user-moved', {
        id: socket.id,
        position: data.position,
        rotation: data.rotation
      });
    }
  });

  socket.on('object-click', (data) => {
    // TODO: updateObjectColor() でDBに保存
    io.emit('object-update', data);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user-left', socket.id);
  });
});

server.listen(3000, () => {
  console.log('サーバ起動: http://localhost:3000');
});
