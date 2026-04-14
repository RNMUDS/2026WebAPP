const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// メッセージの保管場所（メモリ内）
const messages = [];

// TODO: GET /api/messages
// - messages 配列をJSON形式で返す


// TODO: POST /api/messages
// - req.body から name と text を取得
// - id（Date.now()）と createdAt（new Date().toISOString()）を追加
// - messages 配列に追加
// - ステータス201で、追加したメッセージをJSONで返す


app.listen(PORT, () => {
  console.log(`サーバ起動: http://localhost:${PORT}`);
});
