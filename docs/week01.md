# 第1回: Webアプリケーション全体構造の整理

## 今回のゴール

- Webの仕組み（HTTP通信）を説明できる
- クライアント・サーバモデルを理解する
- Node.js + Express.js でサーバを起動できる
- ルーティングの基本を理解する

## キーワード

| 用語 | 説明 |
|------|------|
| HTTP | Webブラウザとサーバ間の通信プロトコル |
| クライアント | サービスを要求する側（ブラウザ） |
| サーバ | サービスを提供する側（Node.js） |
| リクエスト | クライアントからサーバへの要求 |
| レスポンス | サーバからクライアントへの応答 |
| ルーティング | URLに応じて処理を振り分けること |
| Express.js | Node.js用のWebフレームワーク |

---

## 解説

### 1. Webの仕組み

普段ブラウザでWebサイトを見るとき、裏側では次のことが起きている：

```
ブラウザ（クライアント）            サーバ
    |                               |
    |  ① HTTPリクエスト（GET /）     |
    | -----------------------------> |
    |                               |
    |  ② HTTPレスポンス（HTML）      |
    | <----------------------------- |
    |                               |
    |  ③ ブラウザがHTMLを表示        |
```

**HTTPリクエスト**には主に以下のメソッドがある：

| メソッド | 用途 | 例 |
|---------|------|-----|
| GET | データの取得 | ページを開く |
| POST | データの送信 | フォームの送信 |
| PUT | データの更新 | 情報の書き換え |
| DELETE | データの削除 | 投稿の削除 |

### 2. Node.js とは

- JavaScriptをブラウザの外（サーバ側）で動かすためのランタイム
- Google ChromeのV8エンジンがベース
- npmというパッケージマネージャで拡張できる

### 3. Express.js とは

Node.jsだけでもサーバは作れるが、Express.jsを使うと:
- ルーティングが簡単に書ける
- 静的ファイルの配信が1行でできる
- ミドルウェアで機能を追加できる

### 4. 最初のサーバを作ろう

**手順1: プロジェクト作成**
```bash
mkdir week01
cd week01
npm init -y
npm install express@4
```

> **補足:** Express は v5 系もありますが、本授業では古い Node.js 環境でも動作する **v4 系** を使用します。必ず `express@4` のように `@4` を付けてインストールしてください。

**手順2: server.js を作成**
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// ルート "/" にアクセスしたとき
app.get('/', (req, res) => {
  res.send('<h1>Hello, Web Programming!</h1>');
});

// サーバ起動
app.listen(PORT, () => {
  console.log(`サーバ起動: http://localhost:${PORT}`);
});
```

**手順3: 起動と確認**
```bash
node server.js
```
ブラウザで `http://localhost:3000` にアクセス。

### 5. ルーティングの基本

複数のURLに対応させる：

```javascript
// トップページ
app.get('/', (req, res) => {
  res.send('<h1>トップページ</h1>');
});

// アバウトページ
app.get('/about', (req, res) => {
  res.send('<h1>このサイトについて</h1>');
});

// JSON APIの例
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello!', timestamp: new Date() });
});
```

### 6. 静的ファイルの配信

HTMLやCSS、画像などのファイルを配信する：

```javascript
// publicフォルダ内のファイルを自動配信
app.use(express.static('public'));
```

`public/index.html` を作れば、`http://localhost:3000/` で表示される。

---

## 演習課題

### 課題: 「自分のプロフィールサーバ」を作ろう

Express.jsを使って、3つのページを持つサーバを作成する。

### ステップ1: プロジェクトのセットアップ

```bash
mkdir week01
cd week01
npm init -y
npm install express@4
mkdir public
```

### ステップ2: server.js を作成

以下の3つのルートを持つサーバを作成せよ：

| URL | 内容 |
|-----|------|
| `/` | `public/index.html` を表示（静的ファイル配信） |
| `/about` | 自分の名前と学年を含むHTMLを返す |
| `/api/profile` | 自分の情報をJSON形式で返す |

`/api/profile` のレスポンス例：
```json
{
  "name": "山田太郎",
  "grade": 3,
  "interests": ["Web", "3D", "ゲーム"]
}
```

### ステップ3: public/index.html を作成

- 自分の名前を表示
- `/about` と `/api/profile` へのリンクを含める

### ステップ4: 動作確認

1. `node server.js` でサーバを起動
2. ブラウザで3つのURLを確認
3. `/api/profile` がJSON形式で返ることを確認

### 提出物

- `server.js`
- `public/index.html`
- 動作確認のスクリーンショット（3ページ分）

### 評価ポイント

| 項目 | 配点 |
|------|------|
| サーバが正常に起動する | 30% |
| 3つのルートが正しく動作する | 40% |
| HTMLページにリンクがある | 15% |
| JSONレスポンスの形式が正しい | 15% |
