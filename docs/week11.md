# 第11回: リアルタイムWebプログラミング(3)

## 今回のゴール

- 3D空間内のオブジェクトに対するユーザ操作を全員に同期できる
- クリックイベントをSocket.IOで転送する仕組みを理解する
- アニメーションの同期方法を理解する
- インタラクティブなマルチユーザ体験を構築できる

## キーワード

| 用語 | 説明 |
|------|------|
| クリック同期 | あるユーザのクリックを全員に反映する |
| イベント転送 | クライアントのイベントをサーバ経由で他クライアントに送る |
| 状態同期 | オブジェクトの状態（色、位置等）を全員で共有する |
| cursor | A-Frameのクリック検知コンポーネント |
| setAttribute | A-Frameでオブジェクトの属性を動的に変更する |

---

## 解説

### 1. インタラクション同期の流れ

```
ユーザAがオブジェクトをクリック
  → クライアントA: socket.emit('object-click', { id, color })
  → サーバ: io.emit('object-update', { id, color })
  → 全クライアント: オブジェクトの色を変更
```

### 2. サーバ側: イベントの中継

```javascript
// オブジェクトの状態を保持
const objects = {
  'obj-1': { color: '#E74C3C' },
  'obj-2': { color: '#3498DB' },
  'obj-3': { color: '#2ECC71' }
};

io.on('connection', (socket) => {
  // 現在のオブジェクト状態を送信
  socket.emit('init-objects', objects);

  // オ��ジェクトクリックイベント
  socket.on('object-click', (data) => {
    // 状態を更新
    if (objects[data.id]) {
      objects[data.id].color = data.color;
    }
    // 全員に通知
    io.emit('object-update', data);
  });
});
```

### 3. クライアント側: クリック検知と送信

```javascript
// A-Frameコ���ポーネントとしてクリックリスナーを登録
AFRAME.registerComponent('click-handler', {
  init: function () {
    this.el.addEventListener('click', () => {
      const id = this.el.id;
      // ランダムな色に変更
      const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6'];
      const newColor = colors[Math.floor(Math.random() * colors.length)];
      socket.emit('object-click', { id, color: newColor });
    });
  }
});
```

```html
<!-- カーソルの設置 -->
<a-camera>
  <a-cursor color="#FF0" fuse="false"></a-cursor>
</a-camera>

<!-- クリック可能なオブジェクト -->
<a-box id="obj-1" position="-2 1 -4" color="#E74C3C"
       click-handler></a-box>
<a-box id="obj-2" position="0 1 -4" color="#3498DB"
       click-handler></a-box>
<a-box id="obj-3" position="2 1 -4" color="#2ECC71"
       click-handler></a-box>
```

### 4. オブジェクト状態の同期受信

```javascript
// サーバからの更新を反映
socket.on('object-update', (data) => {
  const obj = document.getElementById(data.id);
  if (obj) {
    obj.setAttribute('color', data.color);
  }
});

// 初期状態の復元
socket.on('init-objects', (objects) => {
  Object.entries(objects).forEach(([id, state]) => {
    const obj = document.getElementById(id);
    if (obj) {
      obj.setAttribute('color', state.color);
    }
  });
});
```

### 5. アニメーションの同期

クリック時にアニメーションも全員に再生する：

```javascript
socket.on('object-update', (data) => {
  const obj = document.getElementById(data.id);
  if (obj) {
    obj.setAttribute('color', data.color);
    // バウンドアニメーション
    obj.setAttribute('animation__bounce', {
      property: 'position',
      to: `${obj.getAttribute('position').x} 2 ${obj.getAttribute('position').z}`,
      dur: 300,
      dir: 'alternate',
      easing: 'easeOutQuad',
      loop: 1
    });
  }
});
```

---

## 演習課題

### 課題: インタラクティブな共有3D空間を作ろう

複数ユーザが同じ3D空間で、オブジェクトをクリックすると全員に反映されるインタラクティブな空間を作成する。

### ステップ1: サーバの実装（server.js）

第10回のコードをベースに、以下を追加：
- オブジェクトの状態管理（objects オブジェクト）
- `object-click` イベントの処理
- `init-objects` で新規接続ユーザに状態を送信

### ステップ2: クリック可能なオブジェクト配置

- 3D空間に5つ以上のクリック可能なオブジェクトを配置
- `<a-cursor>` を設置
- A-Frameカスタムコンポーネント `click-handler` を実装

### ステップ3: クリック時の演出

クリック時に以下を全員に同期：
- オブジェクトの色がランダムに変わる
- バウンドアニメーションが再生される

### ステップ4: アバタも統合

第10回のアバタ同期も組み合わせ、「誰がどこにいるか」も見える状態にする。

### 提出物

- `server.js`
- `public/index.html`
- `public/interaction.js`
- 動作確認のスクリーンショット

### 評価ポイント

| 項目 | 配点 |
|------|------|
| クリックが全ユーザに同期される | 30% |
| 5つ以上のオブジェクトが操作可能 | 20% |
| アニメーション演出がある | 20% |
| 新規接続時に現在の状態が復元される | 15% |
| アバタ同期も動作している | 15% |
