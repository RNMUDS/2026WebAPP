# 第5回: 3D Web表現基礎(1) カラー・マテリアル・テクスチャ

## 今回のゴール

- color属性で色を指定できる
- materialコンポーネントのプロパティを理解する
- テクスチャ（画像）をオブジェクトに貼り付けられる
- a-assetsを使ったアセット管理を理解する

## キーワード

| 用語 | 説明 |
|------|------|
| color | オブジェクトの色（CSS色名 or HEXコード） |
| material | 質感を制御するコンポーネント |
| テクスチャ | オブジェクトの表面に貼る画像 |
| a-assets | アセット（画像・動画等）を事前読み込みする仕組み |
| opacity | 透明度（0=完全透明、1=不透明） |
| metalness | 金属感（0=非金属、1=金属） |
| roughness | 粗さ（0=ツルツル、1=ザラザラ） |

---

## 解説

### 1. 色の指定方法

```html
<!-- CSS色名 -->
<a-box color="tomato"></a-box>
<a-box color="skyblue"></a-box>

<!-- HEXカラーコード -->
<a-box color="#FF6347"></a-box>
<a-box color="#2c3e50"></a-box>
```

よく使う色：

| 色名 | HEX | 用途例 |
|------|-----|--------|
| `#8B4513` | 茶色 | 木材 |
| `#ECF0F1` | 薄灰 | 壁・布 |
| `#2c3e50` | 紺 | 金属 |
| `#27AE60` | 緑 | 草・植物 |
| `#F1C40F` | 黄 | 照明 |

### 2. materialコンポーネント

```html
<!-- 基本: color だけ -->
<a-box color="red"></a-box>

<!-- material で詳細設定 -->
<a-box material="color: red; metalness: 0.8; roughness: 0.2"></a-box>
```

主なプロパティ：

| プロパティ | 値の範囲 | 効果 |
|-----------|---------|------|
| `color` | 色 | 基本色 |
| `opacity` | 0〜1 | 透明度 |
| `transparent` | true/false | 透明を有効化 |
| `metalness` | 0〜1 | 金属感 |
| `roughness` | 0〜1 | 表面の粗さ |
| `side` | front/back/double | 描画する面 |

```html
<!-- 半透明のガラス -->
<a-box material="color: #88ccff; opacity: 0.3; transparent: true;
                  metalness: 0.1; roughness: 0"></a-box>

<!-- ツルツルの金属 -->
<a-sphere material="color: #silver; metalness: 1; roughness: 0.1"></a-sphere>

<!-- マットな壁 -->
<a-plane material="color: #FAEBD7; roughness: 1; metalness: 0"></a-plane>
```

### 3. テクスチャの使い方

画像をオブジェクトの表面に貼り付ける：

```html
<a-scene>
  <!-- アセットの事前読み込み -->
  <a-assets>
    <img id="wood-texture" src="textures/wood.jpg">
    <img id="brick-texture" src="textures/brick.jpg">
  </a-assets>

  <!-- テクスチャを適用 -->
  <a-box src="#wood-texture" position="0 1 -3"></a-box>
  <a-plane src="#brick-texture" position="0 2 -4"
           width="8" height="4"></a-plane>
</a-scene>
```

**a-assetsを使う理由:**
- 画像を事前に読み込む → 表示が速い
- 同じ画像を複数のオブジェクトで共有できる
- IDで参照するのでコードが読みやすい

### 4. テクスチャの繰り返し

大きな面にテクスチャを貼ると引き伸ばされる。repeatで繰り返す：

```html
<a-plane src="#brick-texture"
         material="repeat: 4 4"
         width="8" height="4"></a-plane>
```

### 5. フリーテクスチャの入手先

授業では以下のサイトからテクスチャを取得できる（CC0 / フリー素材）：
- Poly Haven (https://polyhaven.com/textures)
- ambientCG (https://ambientcg.com/)

画像を `public/textures/` フォルダに保存して使う。

---

## 演習課題

### 課題: 第4回の部屋に色・テクスチャを適用して「居心地の良い部屋」に仕上げよう

### ステップ1: テクスチャ画像の準備

以下の用途でテクスチャ画像を2つ以上用意する：
- 木目（床・机）
- レンガ・壁紙（壁）
- 布・カーペット（ベッドなど）

画像は `public/textures/` に保存する。

### ステップ2: a-assetsで読み込み

```html
<a-assets>
  <img id="floor-tex" src="textures/wood.jpg">
  <img id="wall-tex" src="textures/wall.jpg">
</a-assets>
```

### ステップ3: 色・マテリアル・テクスチャの適用

- 全てのオブジェクトに色を設定（color か テクスチャ）
- 少なくとも2つのオブジェクトにテクスチャを適用
- materialプロパティ（metalness, roughness）を1つ以上使用

### ステップ4: 質感の表現

以下のいずれかを含める（1つ以上）：
- 半透明なオブジェクト（ガラス窓、コップなど）
- 金属的なオブジェクト（ランプ、ドアノブなど）
- マットな質感のオブジェクト（壁、布など）

### 提出物

- `index.html`
- `textures/` フォルダ（使用した画像）
- スクリーンショット

### 評価ポイント

| 項目 | 配点 |
|------|------|
| 全オブジェクトに色が設定されている | 20% |
| テクスチャが2つ以上使われている | 25% |
| a-assetsで正しくアセット管理されている | 20% |
| materialプロパティが使われている | 20% |
| 全体の見た目が調和している | 15% |
