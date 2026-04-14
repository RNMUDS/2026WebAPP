# 第8回: 3Dアセットの活用

## 今回のゴール

- glTF形式の3Dモデルを理解する
- A-Frameで外部3Dモデルを読み込み・配置できる
- モデルのスケール・位置・回転を調整できる
- 複数モデルを組み合わせたシーンを構築できる

## キーワード

| 用語 | 説明 |
|------|------|
| glTF | 3Dモデルの標準フォーマット（Web向け） |
| .glb | glTFのバイナリ版（1ファイルで完結） |
| a-gltf-model | A-FrameでglTFモデルを表示するタグ |
| a-assets | モデルを事前読み込みする仕組み |
| scale | モデルの大きさ調整 |
| Sketchfab | 3Dモデルの共有サイト |

---

## 解説

### 1. glTF形式とは

glTF（GL Transmission Format）はWeb用の3Dモデル標準。

| 形式 | 拡張子 | 特徴 |
|------|--------|------|
| glTF | .gltf + .bin + 画像 | 複数ファイル |
| glTF Binary | .glb | 1ファイルに全て含む（推奨） |

**.glb を使う理由:**
- 1ファイルで管理が楽
- テクスチャも内蔵
- ファイルサイズが小さい

### 2. モデルの読み込み

```html
<a-scene>
  <a-assets>
    <a-asset-item id="tree-model" src="models/tree.glb"></a-asset-item>
    <a-asset-item id="chair-model" src="models/chair.glb"></a-asset-item>
  </a-assets>

  <!-- モデルを配置 -->
  <a-gltf-model src="#tree-model" position="2 0 -3"></a-gltf-model>
  <a-gltf-model src="#chair-model" position="-1 0 -2"
                 scale="0.5 0.5 0.5"></a-gltf-model>
</a-scene>
```

### 3. モデルの調整

3Dモデルは作者によってサイズや向きがバラバラ。読み込んだら調整が必要：

```html
<!-- 大きすぎるモデルを縮小 -->
<a-gltf-model src="#model" scale="0.01 0.01 0.01"></a-gltf-model>

<!-- 向きが違うモデルを回転 -->
<a-gltf-model src="#model" rotation="0 90 0"></a-gltf-model>

<!-- 地面に接地させる（y位置の調整） -->
<a-gltf-model src="#model" position="0 0.5 -3"></a-gltf-model>
```

**調整のコツ:**
1. まずデフォルトで配置して大きさを確認
2. scale で適切なサイズに調整（3軸同じ値で均等縮小）
3. position の y 値で地面に接地させる
4. rotation で向きを調整

### 4. 無料3Dモデルの入手先

| サイト | URL | 特徴 |
|--------|-----|------|
| Sketchfab | sketchfab.com | 最大手。glTFダウンロード可 |
| Poly Pizza | poly.pizza | シンプルなローポリモデル |
| Kenney | kenney.nl | ゲーム向けアセット集 |
| glTF Sample Models | github.com/KhronosGroup/glTF-Sample-Models | 公式サンプル |

**ダウンロード手順（Sketchfab）:**
1. サイトでモデルを検索
2. 「Download 3D Model」→ glTF形式を選択
3. `.glb` ファイルを `public/models/` に保存
4. ライセンスを確認（CC-BY が多い）

### 5. モデルにアニメーションを付ける

読み込んだモデルにもA-Frameのアニメーションが使える：

```html
<a-gltf-model src="#tree-model" position="2 0 -3"
              animation="property: rotation; to: 0 360 0;
                         dur: 10000; loop: true; easing: linear">
</a-gltf-model>
```

### 6. glTF内蔵アニメーションの再生

一部の3Dモデルにはアニメーションが内蔵されている：

```html
<a-gltf-model src="#character-model"
              animation-mixer="clip: Walk; loop: repeat">
</a-gltf-model>
```

※ `animation-mixer` は A-Frame Extras が必要：
```html
<script src="https://cdn.jsdelivr.net/gh/c-frame/aframe-extras@7.5.0/dist/aframe-extras.min.js"></script>
```

---

## 演習課題

### 課題:「ミニ展示館」を作ろう

無料の3Dモデルを活用して、テーマのある展示空間を作成する。

### ステップ1: テーマを決める

以下から1つ選ぶ（または自由テーマ）：
- 自然（木、花、動物）
- 街並み（建物、車、信号機）
- 宇宙（惑星、ロケット、宇宙飛行士）
- ファンタジー（城、ドラゴン、宝箱）

### ステップ2: 3Dモデルのダウンロード

- 3つ以上の .glb モデルをダウンロード
- `public/models/` フォルダに保存
- ライセンスを確認しメモする

### ステップ3: 展示空間の構築

- 床・背景を設定
- 3つ以上の3Dモデルを適切な位置・サイズで配置
- 展示台やライティングで展示館らしくする

### ステップ4: インタラクションの追加

以下のいずれかを1つ以上追加：
- モデルのアニメーション（回転、浮遊など）
- クリックで何かが起きる
- 説明テキスト（`<a-text>`）を表示

### 提出物

- `index.html`
- `models/` フォルダ（使用した .glb ファイル）
- 使用したモデルのライセンス情報メモ
- スクリーンショット

### 評価ポイント

| 項目 | 配点 |
|------|------|
| 3つ以上のglTFモデルが配置されている | 30% |
| スケール・位置が適切に調整されている | 20% |
| テーマに沿った空間構成 | 20% |
| アニメーションやインタラクションがある | 15% |
| ライセンス情報が記録されている | 15% |
