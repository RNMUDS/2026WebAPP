async function loadMessages() {
  const response = await fetch('/api/messages');
  const messages = await response.json();
  renderMessages(messages);
}

function renderMessages(messages) {
  const list = document.getElementById('message-list');
  list.innerHTML = '';

  const sorted = [...messages].reverse();

  sorted.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message';

    const date = new Date(msg.createdAt);
    const timeStr = date.toLocaleString('ja-JP');

    div.innerHTML = `
      <span class="name">${msg.name}</span>
      <span class="time">${timeStr}</span>
      <p>${msg.text}</p>
    `;
    list.appendChild(div);
  });
}

document.getElementById('post-btn').addEventListener('click', async () => {
  const nameInput = document.getElementById('name-input');
  const textInput = document.getElementById('text-input');

  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) {
    alert('名前とメッセージを入力してください');
    return;
  }

  await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, text })
  });

  nameInput.value = '';
  textInput.value = '';

  await loadMessages();
});

loadMessages();
