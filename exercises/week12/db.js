const Database = require('better-sqlite3');
const db = new Database('app.db');

// テーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS objects (
    id TEXT PRIMARY KEY,
    color TEXT NOT NULL,
    position_x REAL DEFAULT 0,
    position_y REAL DEFAULT 0,
    position_z REAL DEFAULT 0
  )
`);

// TODO: getAllObjects() — 全オブジェクトを取得
// function getAllObjects() {
//   return db.prepare('SELECT * FROM objects').all();
// }

// TODO: upsertObject(id, color, x, y, z) — オブジェクトを追加または更新
// function upsertObject(id, color, x, y, z) {
//   db.prepare(
//     'INSERT OR REPLACE INTO objects (id, color, position_x, position_y, position_z) VALUES (?, ?, ?, ?, ?)'
//   ).run(id, color, x, y, z);
// }

// TODO: updateObjectColor(id, color) — 色だけ更新
// function updateObjectColor(id, color) {
//   db.prepare('UPDATE objects SET color = ? WHERE id = ?').run(color, id);
// }

// module.exports = { getAllObjects, upsertObject, updateObjectColor };
