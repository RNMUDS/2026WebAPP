const socket = io();

// TODO: 送信ボタンのクリックイベント
// document.getElementById('send-btn').addEventListener('click', () => {
//   1. #nickname と #msg-input の値を取��
//   2. 空チェック
//   3. socket.emit('chat', { name, text }) で送信
//   4. 入力欄をクリア
// });

// TODO: Enterキーでも送信できるようにする
// document.getElementById('msg-input').addEventListener('keydown', (e) => {
//   if (e.key === 'Enter') { ... }
// });

// TODO: 'chat' イベントを受信してメッセージを表示
// socket.on('chat', (data) => {
//   1. #messages 要素��取得
//   2. div.message を作成
//   3. data.name と data.text を表示
//   4. #messages に追加
//   5. 自動スクロール: messages.scrollTop = messages.scrollHeight
// });
