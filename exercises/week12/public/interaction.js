// 第11回の interaction.js をベースに使用
// DB連携はサーバ側の変更のみ。クライアントは第11回と同じ。

const socket = io();
let myId = null;
const randomColors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#C0392B'];

AFRAME.registerComponent('click-handler', {
  init: function () {
    this.el.addEventListener('click', () => {
      const id = this.el.id;
      const newColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      socket.emit('object-click', { id, color: newColor });
    });
  }
});

socket.on('init', (data) => {
  myId = data.id;

  // TODO: DBから取得したオブジェクト状態を復元
  // data.objects は配列形式 [{id, color, position_x, ...}, ...]
  // data.objects.forEach(obj => {
  //   const el = document.getElementById(obj.id);
  //   if (el) el.setAttribute('color', obj.color);
  // });

  Object.values(data.users).forEach(user => {
    if (user.id !== myId) createAvatar(user);
  });
});

socket.on('object-update', (data) => {
  const obj = document.getElementById(data.id);
  if (obj) {
    obj.setAttribute('color', data.color);
    const pos = obj.getAttribute('position');
    obj.setAttribute('animation__bounce', {
      property: 'position',
      from: `${pos.x} ${pos.y} ${pos.z}`,
      to: `${pos.x} ${pos.y + 1} ${pos.z}`,
      dur: 200, dir: 'alternate', easing: 'easeOutQuad', loop: 1
    });
  }
});

socket.on('user-joined', (user) => { createAvatar(user); });
socket.on('user-moved', (data) => { updateAvatar(data.id, data.position, data.rotation); });
socket.on('user-left', (id) => { removeAvatar(id); });

function createAvatar(user) {
  const scene = document.querySelector('a-scene');
  const avatar = document.createElement('a-entity');
  avatar.id = `avatar-${user.id}`;
  avatar.innerHTML = `
    <a-box width="0.4" height="0.8" depth="0.3" color="${user.color}" position="0 0.4 0"></a-box>
    <a-sphere radius="0.2" color="${user.color}" position="0 1 0"></a-sphere>
  `;
  avatar.setAttribute('position',
    `${user.position.x} ${user.position.y - 1.6} ${user.position.z}`);
  scene.appendChild(avatar);
}

function updateAvatar(id, position, rotation) {
  const avatar = document.getElementById(`avatar-${id}`);
  if (avatar) {
    avatar.setAttribute('position',
      `${position.x} ${position.y - 1.6} ${position.z}`);
    avatar.setAttribute('rotation', `0 ${rotation.y} 0`);
  }
}

function removeAvatar(id) {
  const avatar = document.getElementById(`avatar-${id}`);
  if (avatar) avatar.remove();
}

setInterval(() => {
  const camera = document.querySelector('[camera]');
  if (camera) {
    const position = camera.getAttribute('position');
    const rotation = camera.getAttribute('rotation');
    socket.emit('move', { position, rotation });
  }
}, 100);
