const socket = io();
let myId = null;

// TODO: 'init' イベント — 自分のIDを保存し、既存ユーザのアバタを生成
// socket.on('init', (data) => {
//   myId = data.id;
//   Object.values(data.users).forEach(user => {
//     if (user.id !== myId) createAvatar(user);
//   });
// });

// TODO: 'user-joined' イベント — 新規ユーザのアバ���を生成
// socket.on('user-joined', (user) => { createAvatar(user); });

// TODO: 'user-moved' イベント — アバタの位置を更新
// socket.on('user-moved', (data) => { updateAvatar(data.id, data.position, data.rotation); });

// TODO: 'user-left' イベント — アバタを削除
// socket.on('user-left', (id) => { removeAvatar(id); });

// TODO: createAvatar(user) 関数
// - a-entity を作成し、id を "avatar-{user.id}" に設定
// - 中に a-box（体）と a-sphere（頭）を user.color で作成
// - scene に追加

// TODO: updateAvatar(id, position, rotation) 関数
// - id からアバタ要素を取得
// - position と rotation を更新

// TODO: removeAvatar(id) 関数
// - id からアバタ要素を取得して削除

// TODO: setInterval で自分のカメラ位置を100ms間隔で送信
// setInterval(() => {
//   const camera = document.querySelector('[camera]');
//   if (camera) {
//     const position = camera.getAttribute('position');
//     const rotation = camera.getAttribute('rotation');
//     socket.emit('move', { position, rotation });
//   }
// }, 100);
