# 第9回: リアルタイムWebプログラミング(1)

## 今回のゴール

- WebSocketの概念とHTTPとの違いを理解する
- Socket.IOの導入と基本的な使い方を習得する
- イベントの送受信（emit / on）を理解する
- テキストチャットアプリを実装できる

## キーワード

| 用語 | 説明 |
|------|------|
| WebSocket | サーバとクライアント間の双方向リアルタイム通信 |
| Socket.IO | WebSocketを簡単に扱えるライ���ラリ |
| emit | イベントを送信する |
| on | イベントを受信（待ち受け）する |
| broadcast | 送信者以外の全員にイベントを送る |
| io.emit | 全員にイベントを送る |
| connection / disconnect | 接続・切断イベント |

---

## 解説

### 1. HTTPとWebSocketの違い

```
【HTTP】リクエスト・レスポンス型（一問一答）
クライアント → リクエスト → サーバ
クライアント ← レスポンス ← サーバ
（通信終了。次のデータが欲しければ再度リクエスト）

【WebSocket】双方向・常時接続
クライアント ←→ サーバ
（接続が維持され、どちらからでもデータを送れる）
```

| 比較 | HTTP | WebSocket |
|------|------|-----------|
| 通信方向 | クライアント→サーバ | 双方向 |
| 接続 | 都度接続・切断 | 常時接続 |
| リアルタイム性 | 低い | 高い |
| 用途 | ページ取得、API | チャット、ゲーム、通知 |

### 2. Socket.IOの導入

**サーバ側のセットアップ:**
```bash
npm install express socket.io
```

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('ユーザ接続:', socket.id);

  socket.on('disconnect', () => {
    console.log('ユーザ切断:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('サーバ起動: http://localhost:3000');
});
```

**クライアント側:**
```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();

  socket.on('connect', () => {
    console.log('サーバに接続しました:', socket.id);
  });
</script>
```

`/socket.io/socket.io.js` はSocket.IOサーバが自動で提供する。

### 3. イベントの送受信

```
クライアント                    サーバ
    |                            |
    |  emit('chat', data)  →     |  on('chat', callback)
    |                            |
    |  on('chat', callback) ←    |  io.emit('chat', data)
    |                            |
```

**クライアント → サーバ:**
```javascript
// クライアント側: 送信
socket.emit('chat', { name: '太郎', text: 'こんにちは' });

// サーバ側: 受信
socket.on('chat', (data) => {
  console.log(data.name + ': ' + data.text);
});
```

**サーバ → 全クライアント:**
```javascript
// サーバ側: 全員に送信
io.emit('chat', { name: '太郎', text: 'こんにちは' });

// サーバ側: 送信者以外に送信
socket.broadcast.emit('chat', { name: '太郎', text: 'こんにちは' });
```

### 4. チャットの仕組み

```
1. ユーザAがメッセージを入力して送信
2. クライアントA → emit('chat', data) → サーバ
3. サーバ → io.emit('chat', data) → 全クライアント
4. クライアントA, B, C... の画面にメッセージ表示
```

### 5. 接続人数の管理

```javascript
// サーバ側
let userCount = 0;

io.on('connection', (socket) => {
  userCount++;
  io.emit('user-count', userCount);

  socket.on('disconnect', () => {
    userCount--;
    io.emit('user-count', userCount);
  });
});
```

---

## 演習課題

### 課題: テキストチャットアプリを作ろう

複数のブラウザタブを開いて、リアルタイムにメッセージをやり取りできるチャットアプリを作成する。

### ステップ1: プロジェクトのセットアップ

```bash
cd week09
npm install
```

### ス��ップ2: サーバの実装（server.js）

- Express + Socket.IO でサーバを起動
- `connection` イベントでユーザの接続を検知
- `chat` イベントでメッセージを受け取り、全クライアントに転送
- `disconnect` イベントでユーザの切断を検知

### ステップ3: クライアントの実装（public/index.html, public/chat.js）

- ニックネーム入力欄
- メッセージ入力欄 + 送信ボタン
- メッセージ一覧の表示エリア
- `socket.emit('chat', ...)` でメッセージ送信
- `socket.on('chat', ...)` でメッセージ受信・表示

### ステップ4: 動作確認

- ブラウザタブを2つ以上開く
- 片方でメッセージを送信 → もう片方に表示されることを確認

### 提出物

- `server.js`
- `public/index.html`
- `public/chat.js`
- 動作確認のスクリーンショット（2つのタブでチャット）

### 評価ポイント

| 項目 | 配�� |
|------|------|
| Socket.IOの接続が正しく動作する | 25% |
| メッセージの送受信ができる | 30% |
| ニックネームが表示される | 15% |
| 複数タブで同期される | 20% |
| UIが整っている | 10% |
