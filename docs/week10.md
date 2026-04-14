# 第10回: リアルタイムWebプログラミング(2)

## 今回のゴール

- 3D空間にアバタ（ユーザの分身）を表示できる
- 複数ユーザの位置・回転情報をリアルタイムに同期できる
- ユーザの接続・切断に応じてアバタを追加・削除できる

## キーワード

| 用語 | 説明 |
|------|------|
| アバタ | 3D空間内のユーザの分身 |
| position同期 | ユーザの位置情報をリアルタイムに共有すること |
| rotation同期 | ユーザの視点方向を共有すること |
| ユーザ管理 | 接続中のユーザ一覧を管理する仕組み |
| socket.id | 各接続に割り当てられるユニークなID |
| setInterval | 一定間隔で処理を繰り返すタイマー |

---

## 解説

### 1. マルチユーザ3D空間の仕組み

```
ユーザA（ブラウザ）          サーバ          ユーザB（ブラウザ）
    |                        |                    |
    | position送信 →          |                    |
    |                        | → positionを転送    |
    |                        |                    | Aのアバタを更新
    |                        |                    |
    |                        | ← position送信      |
    | Bのアバタを更新  ←      |                    |
```

### 2. サーバ側: ユーザ管理

```javascript
const users = {};

io.on('connection', (socket) => {
  // 新しいユーザをランダムな色で登録
  const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];
  users[socket.id] = {
    id: socket.id,
    color: colors[Math.floor(Math.random() * colors.length)],
    position: { x: 0, y: 1.6, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  };

  // 現在の全ユーザ情報を新規ユーザに送信
  socket.emit('init', { id: socket.id, users });

  // 他のユーザに新規参加を通知
  socket.broadcast.emit('user-joined', users[socket.id]);

  // 位置・回転の更新
  socket.on('move', (data) => {
    if (users[socket.id]) {
      users[socket.id].position = data.position;
      users[socket.id].rotation = data.rotation;
      socket.broadcast.emit('user-moved', {
        id: socket.id,
        position: data.position,
        rotation: data.rotation
      });
    }
  });

  // 切断
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user-left', socket.id);
  });
});
```

### 3. クライアント側: アバタの生成と更新

```javascript
const socket = io();
let myId = null;

// 初期化: 既存ユーザのアバタを生成
socket.on('init', (data) => {
  myId = data.id;
  Object.values(data.users).forEach(user => {
    if (user.id !== myId) {
      createAvatar(user);
    }
  });
});

// 新規ユーザのアバタを生成
socket.on('user-joined', (user) => {
  createAvatar(user);
});

// ユーザの位置更新
socket.on('user-moved', (data) => {
  updateAvatar(data.id, data.position, data.rotation);
});

// ユーザ切断時にアバタを削除
socket.on('user-left', (id) => {
  removeAvatar(id);
});
```

### 4. A-Frameでアバタを動的に生成

```javascript
function createAvatar(user) {
  const scene = document.querySelector('a-scene');
  const avatar = document.createElement('a-entity');
  avatar.id = `avatar-${user.id}`;

  // 体（箱）
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
```

### 5. 自分の位置を定期送信

```javascript
setInterval(() => {
  const camera = document.querySelector('[camera]');
  if (camera) {
    const position = camera.getAttribute('position');
    const rotation = camera.getAttribute('rotation');
    socket.emit('move', { position, rotation });
  }
}, 100); // 100ms = 秒間10回
```

---

## 演習課題

### 課題: マルチユーザ3D空間を作ろう

複数のブラウザタブで同じ3D空間に入り、互いのアバタがリアルタイムに動く仕組みを作る。

### ステップ1: サーバの実装（server.js）

- ユーザ管理オブジェクト（users）を実装
- `connection` でユーザ登録 + 既存ユーザ情報の送信
- `move` で位置情報の転送
- `disconnect` でユーザ削除

### ステップ2: 3Dシーン（public/index.html）

- A-Frame + Socket.IO を読み込み
- 床・背景・ライトを設定
- WASDで移動可能なカメラを設置

### ステップ3: アバタの同期（public/avatar.js）

- `createAvatar()` — 他ユーザのアバタを生成
- `updateAvatar()` — 位置・回転を更新
- `removeAvatar()` — 切断時にアバタを削除
- `setInterval` で自分の位置を定期送信

### ステップ4: 動作確認

- ブラウザタブを2つ以上開く
- 片方で移動すると、もう片方にアバタが表示・移動されることを確認

### 提出物

- `server.js`
- `public/index.html`
- `public/avatar.js`
- 動作確認のスクリーンショット

### 評価ポイント

| 項目 | 配点 |
|------|------|
| 接続時に他ユーザのアバタが表示される | 25% |
| 位置・回転がリアルタイムに同期される | 30% |
| 切断時にアバタが削除される | 20% |
| アバタの見た目が区別できる（色分け等） | 15% |
| コードが整理されている | 10% |
