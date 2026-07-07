const fs = require('fs');

const players = JSON.parse(fs.readFileSync('players.json', 'utf-8'));
const list = Object.values(players);

// 集計する（for文で1人ずつ処理する）
let names = [];
let colorCounts = {};

for (let i = 0; i < list.length; i++) {
  const p = list[i];
  names.push(p.name);

  if (colorCounts[p.color] === undefined) {
    colorCounts[p.color] = 1;
  } else {
    colorCounts[p.color] = colorCounts[p.color] + 1;
  }
}

const stats = {
  count: list.length,
  names: names,
  colorCounts: colorCounts
};

console.log('=== 集計結果 ===');
console.log(JSON.stringify(stats, null, 2));

// 集計結果もJSONファイルとして保存しておく（1.6と同じ考え方）
fs.writeFileSync('stats.json', JSON.stringify(stats, null, 2));
