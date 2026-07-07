const fs = require('fs');
const FILE = 'players.json';

// ファイルがあれば読み込み、無ければ空オブジェクトから始める
let players = {};
if (fs.existsSync(FILE)) {
  players = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}
console.log('=== 起動時に読み込んだデータ ===');
console.log(players);

// ログインしてきた新しいプレイヤーを追加
const id = 'player-' + Object.keys(players).length;
players[id] = { name: 'ゲスト', color: '#4FC3F7' };

// JSONファイルに書き戻す
fs.writeFileSync(FILE, JSON.stringify(players, null, 2));
console.log('=== 追加後のデータ ===');
console.log(players);
console.log('現在の人数:', Object.keys(players).length);
