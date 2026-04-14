const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.post('/generate', (req, res) => {
  const { name, grade, likes1, likes2, likes3, comment, color } = req.body;

  const colorMap = {
    red: { bg: '#fee', accent: '#c0392b' },
    blue: { bg: '#eef', accent: '#2980b9' },
    green: { bg: '#efe', accent: '#27ae60' }
  };
  const theme = colorMap[color] || colorMap.blue;

  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${name}の自己紹介カード</title>
      <style>
        body {
          font-family: sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: #f0f0f0;
        }
        .card {
          background: ${theme.bg};
          border: 3px solid ${theme.accent};
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .card h1 {
          color: ${theme.accent};
          margin: 0 0 8px 0;
          font-size: 28px;
        }
        .card .grade {
          color: #666;
          margin-bottom: 16px;
        }
        .card h2 {
          color: ${theme.accent};
          font-size: 16px;
          margin: 16px 0 8px 0;
        }
        .card ul {
          margin: 0;
          padding-left: 20px;
        }
        .card .comment {
          background: #fff;
          padding: 12px;
          border-radius: 8px;
          margin-top: 16px;
          font-style: italic;
          color: #555;
        }
        .back {
          display: block;
          text-align: center;
          margin-top: 16px;
          color: ${theme.accent};
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>${name}</h1>
        <p class="grade">${grade}年生</p>
        <h2>好きなもの</h2>
        <ul>
          <li>${likes1}</li>
          <li>${likes2}</li>
          <li>${likes3}</li>
        </ul>
        <div class="comment">${comment}</div>
        <a class="back" href="/">もう一度作る</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`サーバ起動: http://localhost:${PORT}`);
});
