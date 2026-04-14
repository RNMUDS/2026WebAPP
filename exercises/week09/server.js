const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('ユーザ接続:', socket.id);

  // TODO: 'chat' イベントを受信し、全クライアントに転送
  // socket.on('chat', (data) => {
  //   io.emit('chat', data);
  // });

  socket.on('disconnect', () => {
    console.log('ユーザ切断:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('サーバ起動: http://localhost:3000');
});
