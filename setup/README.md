# 環境構築ガイド

## 必要なソフトウェア

### 1. Node.js のインストール

Node.js は JavaScript をサーバ側で実行するためのランタイムです。

**Windows:**
1. [https://nodejs.org/](https://nodejs.org/) にアクセス
2. **LTS版**（推奨版）をダウンロード
3. インストーラの指示に従いインストール

**macOS:**
1. [https://nodejs.org/](https://nodejs.org/) にアクセス
2. **LTS版**（推奨版）をダウンロード
3. インストーラの指示に従いインストール

### 2. インストール確認

ターミナル（Windows: コマンドプロンプト / macOS: ターミナル）で以下を実行：

```bash
node -v
```

バージョン番号（例: `v22.x.x`）が表示されればOK。

```bash
npm -v
```

npm のバージョンも確認。

### 3. テキストエディタ

**Visual Studio Code（推奨）**
- [https://code.visualstudio.com/](https://code.visualstudio.com/)

推奨拡張機能:
- **Live Server** — HTMLファイルのプレビュー
- **ES7+ React/Redux/React-Native snippets** — コードスニペット
- **Prettier** — コード整形

### 4. ブラウザ

**Google Chrome（推奨）**
- 開発者ツール（F12）が使いやすい
- A-Frame（3D表現）との相性が良い

---

## プロジェクトの始め方

毎回の演習では、以下の手順でプロジェクトを開始します。

### 手順1: フォルダを作成
```bash
mkdir week01
cd week01
```

### 手順2: package.json を作成
```bash
npm init -y
```

### 手順3: 必要なパッケージをインストール
```bash
npm install express@4
```

> **補足:** Express は最新版（v5系）もありますが、本授業では古い Node.js 環境でも動作する **v4系** を使用します。`express@4` のように `@4` を付けてインストールしてください。

### 手順4: サーバを起動
```bash
node server.js
```

### 手順5: ブラウザで確認
```
http://localhost:3000
```

---

## よくあるトラブル

| 症状 | 原因 | 対処法 |
|------|------|--------|
| `node` コマンドが見つからない | Node.js 未インストール or PATH未設定 | Node.js を再インストール |
| `npm install` でエラー | ネットワーク接続の問題 | Wi-Fi接続を確認 |
| `EADDRINUSE` エラー | ポートが既に使用中 | 前のサーバを停止（Ctrl+C）してから再起動 |
| ブラウザに表示されない | サーバが起動していない | ターミナルでエラーを確認 |
| `Cannot find module` | パッケージ未インストール | `npm install` を実行 |

---

## 授業で使用するパッケージ一覧

| 回 | パッケージ | 用途 |
|----|-----------|------|
| 第1-3回 | `express` | Webサーバ・ルーティング |
| 第9-12回 | `socket.io` | リアルタイム通信 |
| 第12回 | `better-sqlite3` | SQLiteデータベース |
