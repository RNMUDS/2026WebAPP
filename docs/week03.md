# 第3回: クライアント–サーバ通信

## 今回のゴール

- fetch APIを使ってクライアントからサーバにデータを送受信できる
- JSONデータの設計と扱い方を理解する
- REST APIの基本的な考え方を理解する
- ページ遷移なしでデータを更新する方法を習得する

## キーワード

| 用語 | 説明 |
|------|------|
| fetch API | JavaScriptからHTTPリクエストを送る標準API |
| JSON | JavaScript Object Notation。データ交換フォーマット |
| REST API | URLとHTTPメソッドでリソースを操作する設計パターン |
| 非同期処理 | 処理の完了を待たずに次へ進む仕組み |
| async/await | 非同期処理を読みやすく書くための構文 |
| Content-Type | リクエスト/レスポンスのデータ形式を示すヘッダ |

---

## 解説

### 1. これまでとの違い

**第2回まで:** フォーム送信 → ページ全体が切り替わる
**第3回から:** fetch API → ページはそのまま、データだけやり取り

```
第2回: form送信 → サーバ → 新しいHTMLページが返る（画面が白く切り替わる）
第3回: fetch    → サーバ → JSONが返る → JavaScriptで画面を更新（シームレス）
```

### 2. サーバ側: JSON APIの作り方

```javascript
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json()); // JSONリクエストの解析

// データの保管場所（メモリ内）
const messages = [];

// データ取得 API
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// データ追加 API
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
```

### 3. クライアント側: fetch APIの使い方

**データを取得する（GET）:**
```javascript
async function loadMessages() {
  const response = await fetch('/api/messages');
  const messages = await response.json();
  console.log(messages);
}
```

**データを送信する（POST）:**
```javascript
async function postMessage(name, text) {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, text })
  });
  const newMessage = await response.json();
  console.log('投稿成功:', newMessage);
}
```

### 4. async / await とは

`fetch` は結果がすぐに返らない（サーバとの通信に時間がかかる）。
`await` を使うと「結果が返るまで待つ」ことができる。

```javascript
// await を使わない場合（Promise）
fetch('/api/messages')
  .then(response => response.json())
  .then(data => console.log(data));

// await を使う場合（読みやすい）
async function load() {
  const response = await fetch('/api/messages');
  const data = await response.json();
  console.log(data);
}
```

`async` は「この関数の中で `await` を使います」という宣言。

### 5. REST APIの設計

URLとHTTPメソッドの組み合わせで「何をするか」を表現する：

| メソッド | URL | 意味 |
|---------|-----|------|
| GET | /api/messages | 一覧取得 |
| POST | /api/messages | 新規作成 |
| GET | /api/messages/1 | 1件取得 |
| DELETE | /api/messages/1 | 削除 |

### 6. 画面の動的更新

取得したデータをJavaScriptでHTMLに反映する：

```javascript
function renderMessages(messages) {
  const list = document.getElementById('message-list');
  list.innerHTML = '';

  messages.forEach(msg => {
    const div = document.createElement('div');
    div.textContent = `${msg.name}: ${msg.text}`;
    list.appendChild(div);
  });
}
```

---

## 演習課題

### 課題:「ひとこと掲示板」を作ろう

ページ遷移なしでメッセージの投稿・表示ができる掲示板アプリを作成する。

### ステップ0: プロジェクトのセットアップ

第2回と同じ流れで、新しいプロジェクトフォルダを準備する。

```bash
mkdir week03
cd week03
npm init -y
npm install express@4
mkdir public
```

> **補足:** Express は最新版（v5 系）もありますが、本授業では古い Node.js 環境でも動作する **v4 系**を使用します。`npm install express`（バージョン指定なし）だと v5 が入ってしまうため、必ず `express@4` のように `@4` を付けてください。

`npm init -y` で `package.json` が生成され、`npm install express@4` で Express がインストールされます。`node_modules/` フォルダと `package-lock.json` が自動で作られます（手動で編集しない）。

### ステップ1: サーバのAPI作成（server.js）

以下の2つのAPIエンドポイントを実装：

| メソッド | URL | 機能 |
|---------|-----|------|
| GET | `/api/messages` | 全メッセージをJSON配列で返す |
| POST | `/api/messages` | 新しいメッセージを追加し、追加したメッセージを返す |

メッセージのデータ形式：
```json
{
  "id": 1712345678901,
  "name": "太郎",
  "text": "こんにちは！",
  "createdAt": "2026-04-12T10:00:00.000Z"
}
```

### ステップ2: フロントエンドの作成（public/index.html, public/app.js）

- 名前とメッセージの入力フォーム
- 「投稿」ボタン — fetch で POST リクエスト
- メッセージ一覧の表示エリア — fetch で GET し、画面に描画
- ページ読み込み時に自動で一覧を取得・表示

### ステップ3: 機能の追加

以下のいずれかを追加実装する（1つ以上）：
- 投稿後に入力欄をクリアする
- メッセージの投稿日時を表示する
- メッセージが新しい順に表示されるようにする

### 提出物

- `server.js`
- `public/index.html`
- `public/app.js`
- 動作確認のスクリーンショット（投稿前・投稿後）

### 評価ポイント

| 項目 | 配点 |
|------|------|
| GET APIが正しく動作する | 20% |
| POST APIが正しく動作する | 20% |
| fetchで通信し、ページ遷移なしで表示が更新される | 30% |
| 追加機能が実装されている | 15% |
| コードが整理されている | 15% |
