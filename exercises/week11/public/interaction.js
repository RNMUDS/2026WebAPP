const socket = io();
let myId = null;
const randomColors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#C0392B'];

// TODO: click-handler カスタムコンポーネントを登録
// AFRAME.registerComponent('click-handler', {
//   init: function () {
//     this.el.addEventListener('click', () => {
//       const id = this.el.id;
//       const newColor = randomColors[Math.floor(Math.random() * randomColors.length)];
//       socket.emit('object-click', { id, color: newColor });
//     });
//   }
// });

// TODO: 'init' イベント — 初期状態の復元 + アバタ生成

// TODO: 'object-update' イベント — オブジェクトの色を更新

// TODO: アバタ関連イベント（user-joined, user-moved, user-left）

// TODO: createAvatar, updateAvatar, removeAvatar 関数（第10回と同じ）

// TODO: setInterval で自分の位置を送信
