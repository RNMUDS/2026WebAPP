# 第4回: Webにおける3D表現入門

## 今回のゴール

- A-Frameとは何かを理解する
- エンティティ・コンポーネントの考え方を理解する
- 3D座標系（x, y, z）を理解する
- 基本的な3Dジオメトリ（箱、球、円柱、平面）を配置できる

## キーワード

| 用語 | 説明 |
|------|------|
| A-Frame | WebブラウザでVR/3Dコンテンツを作るフレームワーク |
| エンティティ | 3Dシーン内のオブジェクト（`<a-entity>`） |
| コンポーネント | エンティティに付与する属性（position, color等） |
| シーン | 3D空間全体（`<a-scene>`） |
| ジオメトリ | オブジェクトの形状（box, sphere, cylinder等） |
| position | オブジェクトの位置（x, y, z） |
| rotation | オブジェクトの回転（x, y, z）度数法 |
| scale | オブジェクトの拡大縮小 |

---

## 解説

### 1. A-Frameとは

A-FrameはHTMLタグを書くだけで3Dシーンが作れるフレームワーク。Three.jsをベースにしている。

- HTMLの知識があれば始められる
- CDNから読み込むだけで使える（インストール不要）
- VRヘッドセットにも対応

### 2. 最初の3Dシーン

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
</head>
<body>
  <a-scene>
    <!-- 赤い箱 -->
    <a-box position="0 1 -3" color="red"></a-box>

    <!-- 地面 -->
    <a-plane position="0 0 -3" rotation="-90 0 0"
             width="10" height="10" color="#7BC8A4"></a-plane>

    <!-- 空（背景） -->
    <a-sky color="#ECECEC"></a-sky>
  </a-scene>
</body>
</html>
```

ブラウザで開くだけで3Dシーンが表示される。マウスドラッグで視点回転、WASDキーで移動。

### 3. 座標系

A-Frameは右手座標系を使用：

```
    y（上）
    |
    |
    +------ x（右）
   /
  z（手前）
```

- **x**: 右がプラス、左がマイナス
- **y**: 上がプラス、下がマイナス
- **z**: 手前がプラス、奥がマイナス

**ポイント:** カメラのデフォルト位置は `(0, 1.6, 0)`（立っている人の目の高さ）

### 4. 基本プリミティブ

| タグ | 形状 | 主な属性 |
|------|------|----------|
| `<a-box>` | 箱 | width, height, depth |
| `<a-sphere>` | 球 | radius |
| `<a-cylinder>` | 円柱 | radius, height |
| `<a-plane>` | 平面 | width, height |
| `<a-cone>` | 円錐 | radius-bottom, height |
| `<a-torus>` | ドーナツ | radius, radius-tubular |

### 5. position, rotation, scale

```html
<!-- 位置: x=2, y=1, z=-5 -->
<a-box position="2 1 -5"></a-box>

<!-- 回転: x軸45度 -->
<a-box rotation="45 0 0"></a-box>

<!-- 拡大: 2倍 -->
<a-box scale="2 2 2"></a-box>

<!-- 組み合わせ -->
<a-box position="0 2 -3" rotation="0 45 0" scale="1 2 1"
       color="blue"></a-box>
```

### 6. 入れ子構造（親子関係）

```html
<!-- 机（親） -->
<a-entity position="0 0 -3">
  <!-- 天板 -->
  <a-box position="0 0.75 0" width="1.2" height="0.05" depth="0.6"
         color="#8B4513"></a-box>
  <!-- 脚（4本） -->
  <a-cylinder position="-0.5 0.375 -0.25" radius="0.03" height="0.75"
              color="#8B4513"></a-cylinder>
  <a-cylinder position="0.5 0.375 -0.25" radius="0.03" height="0.75"
              color="#8B4513"></a-cylinder>
  <a-cylinder position="-0.5 0.375 0.25" radius="0.03" height="0.75"
              color="#8B4513"></a-cylinder>
  <a-cylinder position="0.5 0.375 0.25" radius="0.03" height="0.75"
              color="#8B4513"></a-cylinder>
</a-entity>
```

子要素の position は親を基準にした相対座標になる。

---

## 演習課題

### 課題: 3Dの「自分の部屋」を基本図形で構築しよう

基本プリミティブ（box, sphere, cylinder, plane）を組み合わせて、3D空間に「自分の部屋」を作る。

### ステップ1: 基本構造を作成

- 床（plane）を配置
- 背景（sky）を設定

### ステップ2: 家具を配置

以下の家具を最低3つ作成する：
- 机（boxの天板 + cylinderの脚）
- 椅子（boxの座面 + boxの背もたれ + cylinderの脚）
- 本棚（box を積み重ねる）
- ベッド（boxのフレーム + boxのマットレス）
- その他、自由に追加

### ステップ3: 配置を調整

- position で適切な場所に配置
- rotation で向きを調整
- scale で大きさを調整
- 入れ子構造（a-entity）で家具をグループ化

### 提出物

- `index.html`
- スクリーンショット（2つ以上の角度から）

### 評価ポイント

| 項目 | 配点 |
|------|------|
| 床と背景が設定されている | 15% |
| 3つ以上の家具が配置されている | 35% |
| 入れ子構造で家具がグループ化されている | 20% |
| 位置・回転・スケールが適切 | 15% |
| 独自の工夫がある | 15% |
