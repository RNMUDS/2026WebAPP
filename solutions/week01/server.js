const express = require('express');
const app = express();
const PORT = 3000;

// 静的ファイルの配信（publicフォルダ）
app.use(express.static('public'));

// /about ルート
app.get('/about', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>About</title>
      <style>
        body { font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px; }
        a { color: #0066cc; }
      </style>
    </head>
    <body>
      <h1>自己紹介</h1>
      <p>名前: 山田太郎</p>
      <p>学年: 3年</p>
      <a href="/">トップに戻る</a>
    </body>
    </html>
  `);
});

// /api/profile ルート
app.get('/api/profile', (req, res) => {
  res.json({
    name: '山田太郎',
    grade: 3,
    interests: ['Web', '3D', 'ゲーム']
  });
});

// サーバ起動
app.listen(PORT, () => {
  console.log(`サーバ起動: http://localhost:${PORT}`);
});
