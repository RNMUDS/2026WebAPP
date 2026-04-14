const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const messages = [];

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { name, text } = req.body;
  const message = {
    id: Date.now(),
    name,
    text,
    createdAt: new Date().toISOString()
  };
  messages.push(message);
  res.status(201).json(message);
});

app.listen(PORT, () => {
  console.log(`サーバ起動: http://localhost:${PORT}`);
});
