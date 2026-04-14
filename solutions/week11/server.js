const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {};
const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];

const objects = {
  'obj-1': { color: '#E74C3C' },
  'obj-2': { color: '#3498DB' },
  'obj-3': { color: '#2ECC71' },
  'obj-4': { color: '#F39C12' },
  'obj-5': { color: '#9B59B6' }
};

io.on('connection', (socket) => {
  console.log('ユーザ接続:', socket.id);

  users[socket.id] = {
    id: socket.id,
    color: colors[Math.floor(Math.random() * colors.length)],
    position: { x: 0, y: 1.6, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  };

  socket.emit('init', { id: socket.id, users, objects });
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
    if (objects[data.id]) {
      objects[data.id].color = data.color;
    }
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
