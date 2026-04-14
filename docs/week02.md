# 第2回: サーバサイドWebプログラミング基礎

## 今回のゴール

- HTTPリクエストのメソッド（GET/POST）の違いを理解する
- Express.jsでフォームデータを受け取る方法を習得する
- 静的ファイル配信とサーバサイドレンダリングの違いを理解する
- リクエストパラメータ（query, body）を扱えるようになる

## キーワード

| 用語 | 説明 |
|------|------|
| GET リクエスト | URLにデータを含めて送信（検索など） |
| POST リクエスト | リクエスト本文にデータを含めて送信（フォームなど） |
| クエリパラメータ | URLの `?key=value` 部分 |
| リクエストボディ | POSTリクエストに含まれるデータ |
| ミドルウェア | リクエスト処理の途中に挟む機能 |
| `express.urlencoded()` | フォームデータを解析するミドルウェア |
| `express.json()` | JSONデータを解析するミドルウェア |

---

## 解説

### 1. GETとPOSTの違い

```
GET /search?q=nodejs
→ データがURLに含まれる（ブックマーク可能）

POST /login
Content-Type: application/x-www-form-urlencoded
Body: username=taro&password=1234
→ データがリクエスト本文に含まれる（URLに見えない）
```

| 比較 | GET | POST |
|------|-----|------|
| データの場所 | URL | リクエスト本文 |
| データ量 | 小さい（URL長制限） | 大きくてもOK |
| 用途 | データの取得 | データの送信・作成 |
| ブックマーク | できる | できない |

### 2. フォームデータの受け取り

HTMLフォームからデータを送信し、サーバで受け取る流れ：

**HTMLフォーム（クライアント側）:**
```html
<form action="/submit" method="POST">
  <input type="text" name="username" placeholder="名前">
  <input type="text" name="hobby" placeholder="趣味">
  <button type="submit">送信</button>
</form>
```

**Express.js（サーバ側）:**
```javascript
// フォームデータを解析するミドルウェアを有効化
app.use(express.urlencoded({ extended: false }));

// POSTリクエストを処理
app.post('/submit', (req, res) => {
  const { username, hobby } = req.body;
  res.send(`<h1>${username}さんの趣味: ${hobby}</h1>`);
});
```

### 3. クエリパラメータの受け取り

URLの `?` 以降のパラメータを読み取る：

```javascript
// /search?q=nodejs&page=1 にアクセスした場合
app.get('/search', (req, res) => {
  const keyword = req.query.q;    // "nodejs"
  const page = req.query.page;    // "1"
  res.json({ keyword, page });
});
```

### 4. ミドルウェアとは

リクエストとレスポンスの間に挟まる処理。順番に実行される。

```javascript
// ログを出力するミドルウェア
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // 次のミドルウェアまたはルートへ
});

// 静的ファイル配信（これもミドルウェア）
app.use(express.static('public'));

// フォームデータ解析（これもミドルウェア）
app.use(express.urlencoded({ extended: false }));
```

### 5. レスポンスの種類

```javascript
// テキスト/HTMLを返す
res.send('<h1>Hello</h1>');

// JSONを返す
res.json({ message: 'OK' });

// ステータスコードを指定
res.status(404).send('ページが見つかりません');

// リダイレクト
res.redirect('/');
```

---

## 演習課題

### 課題: 「自己紹介カードジェネレータ」を作ろう

フォームに情報を入力すると、見た目の良い自己紹介カードが生成されるWebアプリを作成する。

### ステップ1: プロジェクトのセットアップ

```bash
cd week02
npm install
```

### ステップ2: フォームページを作成（public/index.html）

以下の入力項目を含むフォームを作成：
- 名前（テキスト）
- 学年（数値）
- 好きなもの（テキスト、3つ）
- 一言コメント（テキストエリア）
- テーマカラー（select: 赤/青/緑）

フォームの送信先は `POST /generate`。

### ステップ3: サーバでカード生成（server.js）

`POST /generate` を受け取り、入力データを使って自己紹介カードのHTMLを動的に生成して返す。

カードには以下を含める：
- 名前（大きく表示）
- 学年
- 好きなもの（リスト形式）
- 一言コメント
- 選択したテーマカラーを背景色に反映

### ステップ4: スタイルの追加（public/style.css）

フォームページの見た目を整える。

### 提出物

- `server.js`
- `public/index.html`
- `public/style.css`
- 生成されたカードのスクリーンショット

### 評価ポイント

| 項目 | 配点 |
|------|------|
| フォームが正しく動作する | 30% |
| POSTデータを正しく受け取れている | 30% |
| カードの見た目が整っている | 20% |
| テーマカラーが反映されている | 20% |
