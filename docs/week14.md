# 第14回: 総合制作(2) 実装

## 今回のゴール

- 設計書に基づいてマルチユーザ3D Webアプリケーションを実装する
- デバッグ手法を活用して問題を解決できる
- 期限内に��くプロトタイプを完成させる

---

## 実装のヒント

### 1. プロジェクトの始め方

```bash
mkdir final-project
cd final-project
npm init -y
npm install express socket.io better-sqlite3
mkdir public
```

### 2. 推奨ファイル構成

```
final-project/
├── server.js          # メインサーバ
├── db.js              # データベース操作
├── package.json
├── public/
│   ├── index.html     # メインページ（3Dシーン + UI）
│   ├── app.js         # クライアン��メインロジック
│   ├── avatar.js      # アバタ管理（第10回ベース）
│   └── style.css      # UIスタイル
└── app.db             # SQLiteデータベース（自動生成）
```

### 3. server.js のテンプレート

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());

// --- ユ��ザ管理 ---
const users = {};

// --- Socket.IO ---
io.on('connection', (socket) => {
  console.log('接続:', socket.id);

  // ここに各イベントハンドラを追加

  socket.on('disconnect', () => {
    console.log('切断:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('http://localhost:3000');
});
```

### 4. よくあるエラーと対処法

| エラー | 原因 | 対処 |
|--------|------|------|
| `Cannot find module` | パ��ケージ未インス��ール | `npm install` を実行 |
| `EADDRINUSE` | ポートが使用中 | 前のサーバを `Ctrl+C` で停止 |
| 3Dオブジェクトが見えない | position が画面外 | z値をマイナスに（カメラの前方） |
| Socket.IOが接続しない | サーバ側の設定漏れ | `http.createServer` を使っているか確認 |
| アバタが消えない | disconnect処理の漏れ | `user-left` イベントで `remove()` |
| DBエラ��� | テーブル未作成 | `CREATE TABLE IF NOT EXISTS` を確認 |
| クリックが効かない | cursor未設置 | `<a-cursor>` をカメラ内に設置 |

### 5. デバッグの基本

**サーバ側:**
```javascript
// console.log でデータの中身を確認
socket.on('some-event', (data) => {
  console.log('受信データ:', JSON.stringify(data, null, 2));
});
```

**クライアント側:**
- ブラウザの開発者ツール（F12）→ Console タブ
- `console.log()` で変数の中身を確認
- Network タブで通信を確認

**A-Frame Inspector:**
- 3Dシーン上で `Ctrl + Alt + I` でインスペ��タが開く
- オブジェクトの位置・属性をリアルタイムに確認・調整できる

### 6. 段階的に実装する

1. **まず最小限を動かす** — 3D空間 + アバタ同期だけ
2. **核心機能を追加** — 設���書の「必須」機能
3. **見た目を調整** — 色、ライト、UI
4. **追加機���** — 時間があれば「あれば」機能

---

## 演習課題

### 課題: 設計書に基づいて実装を進める

### 今日の目標

最低限、以下が動作するプロトタイプを完成させる：
- 3D空間が表示される
- 複数ユーザが接続・アバタ表示される
- 核心機能が1つ以上動作する

### チェックリスト

- [ ] `npm install` でパッケージインストール
- [ ] `node server.js` でサーバ起動
- [ ] ブラウザで3D空間が表示される
- [ ] 2つのタブで接続し、アバタが表示される
- [ ] 設計書の「必須」機能が1つ以上動作する
- [ ] サーバのコンソールにエラー��出ていない
- [ ] ブラウザのコ���ソールにエラーが出ていない

### 提出物

- プロジェクト一式（server.js, db.js, public/）
- 現時点の動作確認スクリーンショット

### 評価ポイント

| 項目 | 配点 |
|------|------|
| サーバが起動し、3D空間が表示される | 25% |
| マルチユーザ接続が動作する | 25% |
| 設計書の機能が実装に反映されている | 25% |
| コードが整理されている | 15% |
| デバッグに取り組んだ形跡がある | 10% |
