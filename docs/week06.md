# 第6回: 3D Web表現基礎(2) ライティング・カメラ

## 今回のゴール

- ライトの種類と効果を理解する
- 影の設定方法を理解する
- カメラの位置・視点を制御できる
- JavaScriptでライトのプロパティを動的に変更できる

## キーワード

| 用語 | 説明 |
|------|------|
| ambient light | 環境光。シーン全体を均一に照らす |
| directional light | 平行光源。太陽光のように一方向から照らす |
| point light | 点光源。電球のように全方向に照らす |
| spot light | スポットライト。円錐状に照らす |
| shadow | オブジェクトが落とす影 |
| camera | 視点（カメラ）の位置と向き |
| look-controls | マウスで視点を回転させるコンポーネント |
| wasd-controls | WASDキーで移動するコンポーネント |

---

## 解説

### 1. ライトの種類

A-Frameのデフォルトでは環境光と平行光が自動で設定される。カスタムライトを追加すると、デフォルトは無効になる。

```html
<!-- 環境光（全体を柔らかく照らす） -->
<a-light type="ambient" color="#BBB" intensity="0.5"></a-light>

<!-- 平行光源（太陽のような光） -->
<a-light type="directional" color="#FFF" intensity="0.8"
         position="-1 2 1"></a-light>

<!-- 点光源（電球のような光） -->
<a-light type="point" color="#FF0" intensity="1"
         distance="10" position="0 3 -3"></a-light>

<!-- スポットライト -->
<a-light type="spot" color="#FFF" intensity="1"
         angle="45" penumbra="0.2"
         position="0 4 -3" target="#spotlight-target"></a-light>
<a-entity id="spotlight-target" position="0 0 -3"></a-entity>
```

### 2. ライトのプロパティ

| プロパティ | 説明 | 対応ライト |
|-----------|------|-----------|
| `color` | 光の色 | 全て |
| `intensity` | 光の強さ | 全て |
| `distance` | 光が届く距離（0=無限） | point, spot |
| `angle` | スポットの広がり角度 | spot |
| `penumbra` | スポットの縁のぼかし | spot |
| `decay` | 距離による減衰率 | point, spot |

### 3. 影の設定

影を有効にするには、ライトとオブジェクトの両方に設定が必要：

```html
<!-- シーンで影を有効化 -->
<a-scene shadow="type: pcfsoft">

  <!-- ライトに影を生成させる -->
  <a-light type="directional" position="-1 3 1" intensity="0.8"
           castShadow="true"
           shadow="mapSize: 1024 1024"></a-light>

  <!-- オブジェクトに影を生成・受けさせる -->
  <a-box position="0 1 -3" color="red"
         shadow="cast: true; receive: true"></a-box>

  <!-- 床は影を受ける -->
  <a-plane position="0 0 -3" rotation="-90 0 0" width="10" height="10"
           color="#ccc"
           shadow="receive: true"></a-plane>

</a-scene>
```

### 4. カメラの制御

```html
<!-- デフォルトカメラを無効にして、カスタムカメラを使う -->
<a-entity id="rig" position="0 1.6 2">
  <a-camera look-controls wasd-controls></a-camera>
</a-entity>

<!-- 固定カメラ（操作不可） -->
<a-camera position="3 3 3" look-controls="enabled: false"
          rotation="-30 40 0"></a-camera>
```

### 5. JavaScriptでライトを動的に制御

```html
<a-light id="room-light" type="point" color="#FFF"
         intensity="1" position="0 3 -3"></a-light>

<script>
  function setDaytime() {
    const light = document.getElementById('room-light');
    light.setAttribute('light', { color: '#FFF', intensity: 1 });

    const sky = document.querySelector('a-sky');
    sky.setAttribute('color', '#87CEEB');
  }

  function setNighttime() {
    const light = document.getElementById('room-light');
    light.setAttribute('light', { color: '#FFD700', intensity: 0.4 });

    const sky = document.querySelector('a-sky');
    sky.setAttribute('color', '#1a1a2e');
  }
</script>
```

### 6. HTML UIとの組み合わせ

3Dシーンの上にHTMLのボタンを重ねる：

```html
<div style="position: fixed; top: 10px; left: 10px; z-index: 999;">
  <button onclick="setDaytime()">昼</button>
  <button onclick="setNighttime()">夜</button>
</div>

<a-scene>
  <!-- ... -->
</a-scene>
```

---

## 演習課題

### 課題: 昼→夜の照明切り替えが可能な3Dシーンを作ろう

### ステップ1: ライトの設定

以下のライトを配置：
- 環境光（ambient）
- 太陽光用の平行光（directional）
- 室内照明用の点光源（point）を1つ以上

### ステップ2: 影を有効化

- 平行光に `castShadow="true"` を設定
- 主要なオブジェクトに `shadow="cast: true; receive: true"` を設定
- 床に `shadow="receive: true"` を設定

### ステップ3: 昼夜切り替えボタン

HTMLボタン（2つ）を3Dシーンの上に配置し、JavaScriptで：

**昼モード:**
- 環境光: 明るめ（intensity: 0.6）
- 平行光: 白く強い（color: #FFF, intensity: 1）
- 点光源: 消灯（intensity: 0）
- 空: 水色（#87CEEB）

**夜モード:**
- 環境光: 暗め（intensity: 0.1）
- 平行光: 消灯（intensity: 0）
- 点光源: 暖色で弱い（color: #FFD700, intensity: 0.8）
- 空: 暗い紺（#0d1b2a）

### 提出物

- `index.html`
- 昼モードと夜モードのスクリーンショット

### 評価ポイント

| 項目 | 配点 |
|------|------|
| 3種類のライトが設定されている | 25% |
| 影が正しく表示されている | 20% |
| 昼夜切り替えが動作する | 30% |
| 空の色も切り替わる | 10% |
| シーンの完成度 | 15% |
