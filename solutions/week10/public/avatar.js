const socket = io();
let myId = null;

socket.on('init', (data) => {
  myId = data.id;
  Object.values(data.users).forEach(user => {
    if (user.id !== myId) createAvatar(user);
  });
});

socket.on('user-joined', (user) => {
  createAvatar(user);
});

socket.on('user-moved', (data) => {
  updateAvatar(data.id, data.position, data.rotation);
});

socket.on('user-left', (id) => {
  removeAvatar(id);
});

socket.on('user-count', (count) => {
  document.getElementById('user-count').textContent = `接続中: ${count}人`;
});

function createAvatar(user) {
  const scene = document.querySelector('a-scene');
  const avatar = document.createElement('a-entity');
  avatar.id = `avatar-${user.id}`;
  avatar.innerHTML = `
    <a-box width="0.4" height="0.8" depth="0.3"
           color="${user.color}" position="0 0.4 0"></a-box>
    <a-sphere radius="0.2" color="${user.color}"
              position="0 1 0"></a-sphere>
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
