const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {};
const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];

io.on('connection', (socket) => {
  console.log('ユーザ接続:', socket.id);

  // TODO: ユーザ情報を users オブジェクトに登録
  // - id: socket.id
  // - color: colors からランダムに選択
  // - position: { x: 0, y: 1.6, z: 0 }
  // - rotation: { x: 0, y: 0, z: 0 }

  // TODO: socket.emit('init', ...) で自分のIDと全ユーザ情報を送信

  // TODO: socket.broadcast.emit('user-joined', ...) で他ユーザに通知

  // TODO: 'move' イベント — 位置更新を受け取り、他ユーザに転送

  socket.on('disconnect', () => {
    console.log('ユーザ切断:', socket.id);
    // TODO: users から削除し、io.emit('user-left', socket.id) で通知
  });
});

server.listen(3000, () => {
  console.log('サーバ起動: http://localhost:3000');
});
