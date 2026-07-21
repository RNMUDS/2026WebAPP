// ============================================================
// db.js — 行動データを SQLite に記録・集計するモジュール
// ============================================================
// このファイルは「データベースまわり」だけを担当する。
// server.js からは record() と集計関数を呼ぶだけでよい。

const Database = require('better-sqlite3');

// space.db を開く（なければ自動で作られる）
const db = new Database('space.db');

// 行動データを 1 件 = 1 行として貯める events テーブル
//   type   … 行動の種類 ('join' | 'leave' | 'move' | 'click' | 'chat')
//   x,y,z  … そのときの3D座標（クリック・移動で使う。無いときは NULL）
//   detail … 補足（クリックした物の名前、チャット本文など）
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    TEXT NOT NULL,
    name       TEXT NOT NULL,
    type       TEXT NOT NULL,
    x          REAL,
    y          REAL,
    z          REAL,
    detail     TEXT,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

// 行動を1件記録する。server.js からはこの関数だけ呼べばよい。
const insert = db.prepare(`
  INSERT INTO events (user_id, name, type, x, y, z, detail)
  VALUES (@user_id, @name, @type, @x, @y, @z, @detail)
`);

function record(event) {
  insert.run({
    user_id: event.user_id,
    name: event.name || '名無し',
    type: event.type,
    x: event.x ?? null,
    y: event.y ?? null,
    z: event.z ?? null,
    detail: event.detail ?? null
  });
}

// ---- 集計①: 全体のまとめ（ダッシュボードの上部カード用） ----
function getSummary() {
  const users = db.prepare(
    'SELECT COUNT(DISTINCT user_id) AS n FROM events'
  ).get().n;
  const total = db.prepare('SELECT COUNT(*) AS n FROM events').get().n;
  const byType = db.prepare(
    'SELECT type, COUNT(*) AS n FROM events GROUP BY type'
  ).all();
  return { users, total, byType };
}

// ---- 集計②: ユーザごとの活動量 ----
// 滞在時間・チャット数・クリック数、そして移動サンプルから移動距離を出す。
function getUsers() {
  const rows = db.prepare(`
    SELECT
      user_id,
      MAX(name)                                       AS name,
      MIN(created_at)                                 AS first_seen,
      MAX(created_at)                                 AS last_seen,
      SUM(CASE WHEN type = 'chat'  THEN 1 ELSE 0 END) AS chats,
      SUM(CASE WHEN type = 'click' THEN 1 ELSE 0 END) AS clicks,
      SUM(CASE WHEN type = 'move'  THEN 1 ELSE 0 END) AS moves
    FROM events
    GROUP BY user_id
    ORDER BY last_seen DESC
  `).all();

  // 移動距離は「連続する move サンプル」の直線距離を足して求める
  const moveStmt = db.prepare(
    `SELECT x, y, z FROM events
     WHERE user_id = ? AND type = 'move'
     ORDER BY id`
  );

  return rows.map((u) => {
    const points = moveStmt.all(u.user_id);
    let distance = 0;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      distance += Math.hypot(b.x - a.x, b.z - a.z); // 床の上の移動なので x と z だけ
    }
    return { ...u, distance: Math.round(distance * 10) / 10 };
  });
}

// ---- 集計③: よくクリックされた物ランキング ----
function getObjects() {
  return db.prepare(`
    SELECT detail AS name, COUNT(*) AS n
    FROM events
    WHERE type = 'click' AND detail IS NOT NULL
    GROUP BY detail
    ORDER BY n DESC
  `).all();
}

// ---- 集計④: 最近の行動ログ（生データ表示用） ----
function getRecent(limit = 100) {
  return db.prepare(
    'SELECT * FROM events ORDER BY id DESC LIMIT ?'
  ).all(limit);
}

// ---- 集計⑤: ユーザごとの移動の軌跡（上から見た経路の比較用） ----
// 迷路のようなテーマで「誰がどの道を通ったか」を見比べるためのデータ。
function getPaths() {
  const users = db.prepare(
    `SELECT user_id, MAX(name) AS name FROM events
     WHERE type = 'move' GROUP BY user_id`
  ).all();
  const pointStmt = db.prepare(
    `SELECT x, z FROM events
     WHERE user_id = ? AND type = 'move' ORDER BY id`
  );
  const goalStmt = db.prepare(
    `SELECT COUNT(*) AS n FROM events WHERE user_id = ? AND type = 'goal'`
  );
  return users.map((u) => ({
    user_id: u.user_id,
    name: u.name,
    reached_goal: goalStmt.get(u.user_id).n > 0,
    points: pointStmt.all(u.user_id)
  }));
}

module.exports = { record, getSummary, getUsers, getObjects, getRecent, getPaths };
