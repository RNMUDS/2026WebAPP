// TODO: メッセージ一覧を取得して表示する関数
// async function loadMessages() {
//   1. fetch('/api/messages') でGETリクエスト
//   2. レスポンスを .json() でパース
//   3. renderMessages() で画面に表示
// }


// TODO: メッセージを画面に描画する関数
// function renderMessages(messages) {
//   1. #message-list 要素を取得
//   2. innerHTML をクリア
//   3. messages を forEach で回し、各メッセージのHTMLを作成して追加
// }


// TODO: 投稿ボタンのクリックイベント
// document.getElementById('post-btn').addEventListener('click', async () => {
//   1. #name-input と #text-input の値を取得
//   2. fetch('/api/messages', { method: 'POST', ... }) でPOSTリクエスト
//   3. 投稿成功後、loadMessages() で一覧を再読み込み
//   4. 入力欄をクリア
// });


// TODO: ページ読み込み時にメッセージを取得
// loadMessages();
