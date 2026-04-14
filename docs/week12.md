# 第12回: リアルタイムWebプログラミング(4)

## 今回のゴール

- データの永続化（サーバ再起動後もデータが残る）の必要性を理解する
- SQLiteの基本操作（CREATE, INSERT, SELECT, UPDATE）を習得する
- 3D空間のオブジェクト状態をデータベースに保存・復元できる
- リアルタイム通信とデータベースを組み合わせたアプリを構築できる

## キーワード

| 用語 | 説明 |
|------|------|
| 永続化 | データをファイルやDBに保存し、再起動後も残すこと |
| SQLite | ファイルベースの軽量データベース |
| better-sqlite3 | Node.js用のSQLiteライブラリ |
| CREATE TABLE | テーブル（データの入れ物）を作成するSQL |
| INSERT | データを追加するSQL |
| SELECT | データを取得するSQL |
| UPDATE | データを更新するSQL |

---

## 解説

### 1. なぜデータベースが必要か

これまでのコード：
```javascript
const messages = []; // メモリ内に保存
```

**問題:** サーバを再起動すると全データが消える。

**解決:** データベースに保存すれば、再起動しても残る。

### 2. SQLiteとは

- ファイル1つで動くデータベース（インストール不要）
- 軽量で高速
- 授業環境に最適（MySQL/PostgreSQLのようなサーバ不要）

### 3. better-sqlite3の導入

```bash
npm install better-sqlite3
```

### 4. データベースの基本操作

```javascript
const Database = require('better-sqlite3');
const db = new Database('app.db');

// テーブル作成（初回のみ実行される）
db.exec(`
  CREATE TABLE IF NOT EXISTS objects (
    id TEXT PRIMARY KEY,
    color TEXT NOT NULL,
    position_x REAL DEFAULT 0,
    position_y REAL DEFAULT 0,
    position_z REAL DEFAULT 0
  )
`);
```

### 5. CRUD操作

```javascript
// INSERT: データ追加
const insert = db.prepare(
  'INSERT OR REPLACE INTO objects (id, color, position_x, position_y, position_z) VALUES (?, ?, ?, ?, ?)'
);
insert.run('obj-1', '#E74C3C', -2, 1, -4);

// SELECT: 全件取得
const selectAll = db.prepare('SELECT * FROM objects');
const allObjects = selectAll.all();

// SELECT: 1件取得
const selectOne = db.prepare('SELECT * FROM objects WHERE id = ?');
const obj = selectOne.get('obj-1');

// UPDATE: 色を更新
const updateColor = db.prepare('UPDATE objects SET color = ? WHERE id = ?');
updateColor.run('#3498DB', 'obj-1');
```

### 6. db.jsにデータベース操作をまとめる

```javascript
// db.js
const Database = require('better-sqlite3');
const db = new Database('app.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS objects (
    id TEXT PRIMARY KEY,
    color TEXT NOT NULL,
    position_x REAL DEFAULT 0,
    position_y REAL DEFAULT 0,
    position_z REAL DEFAULT 0
  )
`);

function getAllObjects() {
  return db.prepare('SELECT * FROM objects').all();
}

function upsertObject(id, color, x, y, z) {
  db.prepare(
    'INSERT OR REPLACE INTO objects (id, color, position_x, position_y, position_z) VALUES (?, ?, ?, ?, ?)'
  ).run(id, color, x, y, z);
}

function updateObjectColor(id, color) {
  db.prepare('UPDATE objects SET color = ? WHERE id = ?').run(color, id);
}

module.exports = { getAllObjects, upsertObject, updateObjectColor };
```

### 7. サーバでの使い方

```javascript
const { getAllObjects, upsertObject, updateObjectColor } = require('./db');

// 初期データの投入（テーブルが空なら）
const existing = getAllObjects();
if (existing.length === 0) {
  upsertObject('obj-1', '#E74C3C', -2, 1, -4);
  upsertObject('obj-2', '#3498DB', 0, 1, -4);
  upsertObject('obj-3', '#2ECC71', 2, 1, -4);
}

io.on('connection', (socket) => {
  // DBから現在の状態を読み込んで送信
  const objects = getAllObjects();
  socket.emit('init-objects', objects);

  socket.on('object-click', (data) => {
    // DBに保存
    updateObjectColor(data.id, data.color);
    // 全員に通知
    io.emit('object-update', data);
  });
});
```

---

## 演習課題

### 課題: 永続化付きインタラクティブ3D空間を作ろう

第11回のプロジェクトにSQLiteを追加し、オブジェクトの状態がサーバ再起動後も保持されるようにする。

### ステップ1: データベースモジュール作成（db.js）

- better-sqlite3 でデータベースを初期化
- objects テーブルを作成
- `getAllObjects()`, `upsertObject()`, `updateObjectColor()` を実装

### ステップ2: サーバの修正（server.js）

- db.js をインポート
- 接続時に getAllObjects() でDBからオブジェクト状態を取得して送信
- object-click 時に updateObjectColor() でDBに保存

### ステップ3: 動作確認（永続化の確認）

1. `node server.js` でサーバ起動
2. ブラウザでオブジェクトの色を変更
3. サーバを **Ctrl+C で停止**
4. 再度 `node server.js` で起動
5. ブラウザで確認 → 変更した色が保持されていることを確認

### ステップ4: チャットログの保存（追加課題）

- messages テーブルを追加
- チャットメッセージもDBに保存
- 新規接続時に過去メッセージを送信（最新20件）

### 提出物

- `server.js`
- `db.js`
- `public/index.html`
- `public/interaction.js`
- 永続化の動作確認スクリーンショット（再起動前後）

### 評価ポイント

| 項目 | 配点 |
|------|------|
| SQLiteでオブジェクト状態が保存される | 30% |
| サーバ再起動後も状態が復元される | 25% |
| db.js にDB操作がまとめられている | 20% |
| リアルタイム同期も引き続き動作する | 15% |
| コードが整理されている | 10% |
