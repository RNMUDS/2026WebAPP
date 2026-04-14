const socket = io();

function sendMessage() {
  const nicknameInput = document.getElementById('nickname');
  const msgInput = document.getElementById('msg-input');

  const name = nicknameInput.value.trim() || '名無し';
  const text = msgInput.value.trim();

  if (!text) return;

  socket.emit('chat', { name, text });
  msgInput.value = '';
  msgInput.focus();
}

document.getElementById('send-btn').addEventListener('click', sendMessage);

document.getElementById('msg-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

socket.on('chat', (data) => {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = `
    <div class="meta">
      <span class="name">${data.name}</span>
      <span class="time">${data.time}</span>
    </div>
    <div class="text">${data.text}</div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('user-count', (count) => {
  document.getElementById('user-count').textContent = `接続中: ${count}人`;
});
