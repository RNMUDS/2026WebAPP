const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let userCount = 0;

io.on('connection', (socket) => {
  console.log('ユーザ接続:', socket.id);
  userCount++;
  io.emit('user-count', userCount);

  socket.on('chat', (data) => {
    io.emit('chat', {
      name: data.name,
      text: data.text,
      time: new Date().toLocaleTimeString('ja-JP')
    });
  });

  socket.on('disconnect', () => {
    console.log('ユーザ切断:', socket.id);
    userCount--;
    io.emit('user-count', userCount);
  });
});

server.listen(3000, () => {
  console.log('サーバ起動: http://localhost:3000');
});
