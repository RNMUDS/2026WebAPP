// アバタのデータを1つ作る
const avatar = {
  id: 'player-1',
  position: { x: 0, y: 1, z: 0 },
  rotation: { x: 0, y: 0, z: 0 }
};

console.log('=== 元のオブジェクト ===');
console.log(avatar);
console.log('型:', typeof avatar);

// オブジェクト → JSON文字列
const json = JSON.stringify(avatar);
console.log('=== JSON文字列に変換 ===');
console.log(json);
console.log('型:', typeof json);

// JSON文字列 → オブジェクトに復元
const restored = JSON.parse(json);
console.log('=== 復元したオブジェクト ===');
console.log(restored);
console.log('position.x:', restored.position.x);

// 新しいフィールドを追加してもう一度変換
avatar.color = '#76B900';
console.log('=== colorを追加して再変換 ===');
console.log(JSON.stringify(avatar));
