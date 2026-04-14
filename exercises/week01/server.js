const express = require('express');
const app = express();
const PORT = 3000;

// 静的ファイルの配信（publicフォルダ）
app.use(express.static('public'));

// TODO: /about ルートを作成
// - 自分の名前と学年を含むHTMLを返す
// - res.send() を使う


// TODO: /api/profile ルートを作成
// - 自分の情報をJSON形式で返す
// - res.json() を使う
// - name, grade, interests の3つのフィールドを含める


// サーバ起動
app.listen(PORT, () => {
  console.log(`サーバ起動: http://localhost:${PORT}`);
});
