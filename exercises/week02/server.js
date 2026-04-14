const express = require('express');
const app = express();
const PORT = 3000;

// 静的ファイル配信
app.use(express.static('public'));

// TODO: フォームデータを解析するミドルウェアを追加
// ヒント: express.urlencoded({ extended: false })


// TODO: POST /generate ルートを作成
// - req.body から name, grade, likes1, likes2, likes3, comment, color を取得
// - 自己紹介カードのHTMLを動的に生成して返す
// - テーマカラーを背景色に反映する


// サーバ起動
app.listen(PORT, () => {
  console.log(`サーバ起動: http://localhost:${PORT}`);
});
