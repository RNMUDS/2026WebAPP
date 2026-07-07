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

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
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

function addMessage(name, text) {
  db.prepare('INSERT INTO messages (name, text) VALUES (?, ?)').run(name, text);
}

function getRecentMessages(limit = 20) {
  return db.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT ?').all(limit).reverse();
}

module.exports = { getAllObjects, upsertObject, updateObjectColor, addMessage, getRecentMessages };
