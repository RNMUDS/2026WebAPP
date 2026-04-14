# 第7回: 3D Web表現基礎(3) アニメーション

## 今回のゴール

- animation属性を使ってオブジェクトを動かせる
- アニメーションの主要プロパティを理解する
- 複数のアニメーションを組み合わせられる
- イベントをトリガーにしたアニメーションを実装できる

## キーワード

| 用語 | 説明 |
|------|------|
| animation | A-Frameのアニメーションコンポーネント |
| property | アニメーションさせる属性（position, rotation等） |
| from / to | アニメーションの開始値と終了値 |
| dur | アニメーションの持続時間（ミリ秒） |
| loop | 繰り返し（true=無限、数字=回数） |
| easing | イージング関数（加速・減速の仕方） |
| startEvents | アニメーション開始のトリガーイベント |

---

## 解説

### 1. 基本のアニメーション

```html
<!-- 上下に浮遊 -->
<a-box position="0 1 -3" color="red"
       animation="property: position; to: 0 2 -3; dur: 2000;
                  dir: alternate; loop: true">
</a-box>
```

### 2. 主要プロパティ

| プロパティ | 説明 | 例 |
|-----------|------|-----|
| `property` | 動かす属性 | position, rotation, scale, material.color |
| `from` | 開始値（省略時は現在値） | 0 1 -3 |
| `to` | 終了値 | 0 2 -3 |
| `dur` | 持続時間(ms) | 2000 |
| `delay` | 開始までの遅延(ms) | 500 |
| `dir` | 方向 | normal, reverse, alternate |
| `loop` | 繰り返し | true, 3 |
| `easing` | イージング | easeInOutQuad |
| `startEvents` | 開始イベント | click, mouseenter |

### 3. さまざまなアニメーション例

```html
<!-- 回転し続ける -->
<a-box position="0 1 -3" color="blue"
       animation="property: rotation; to: 0 360 0;
                  dur: 3000; loop: true; easing: linear">
</a-box>

<!-- 色が変わる -->
<a-sphere position="2 1 -3" color="red"
          animation="property: material.color; from: red; to: blue;
                     dur: 2000; dir: alternate; loop: true">
</a-sphere>

<!-- 大きくなって小さくなる -->
<a-box position="-2 1 -3" color="green"
       animation="property: scale; from: 1 1 1; to: 1.5 1.5 1.5;
                  dur: 1000; dir: alternate; loop: true">
</a-box>
```

### 4. イージング

動きの緩急を制御する。主なイージング：

| イージング | 効果 |
|-----------|------|
| `linear` | 一定速度 |
| `easeInQuad` | ゆっくり始まる |
| `easeOutQuad` | ゆっくり終わる |
| `easeInOutQuad` | ゆっくり始まり、ゆっくり終わる |
| `easeInOutElastic` | 弾むような動き |
| `easeOutBounce` | バウンドして止まる |

```html
<a-box animation="property: position; to: 3 1 -3;
                   dur: 2000; easing: easeOutBounce">
</a-box>
```

### 5. 複数アニメーションの組み合わせ

`animation__名前` で複数のアニメーションを同時に設定できる：

```html
<a-box position="0 1 -3" color="orange"
       animation__rotate="property: rotation; to: 0 360 0;
                          dur: 4000; loop: true; easing: linear"
       animation__float="property: position; from: 0 1 -3; to: 0 2 -3;
                         dur: 2000; dir: alternate; loop: true"
       animation__color="property: material.color; from: orange; to: purple;
                         dur: 3000; dir: alternate; loop: true">
</a-box>
```

### 6. イベントトリガーのアニメーション

クリックやマウスオーバーでアニメーションを開始する：

```html
<!-- カーソルを設定（クリック・ホバー検知に必要） -->
<a-camera>
  <a-cursor color="#FF0"></a-cursor>
</a-camera>

<!-- クリックで回転 -->
<a-box position="0 1 -3" color="red"
       animation="property: rotation; to: 0 360 0;
                  dur: 1000; startEvents: click">
</a-box>

<!-- マウスオーバーで拡大、マウスアウトで戻る -->
<a-sphere position="2 1 -3" color="blue" scale="1 1 1"
          animation__grow="property: scale; to: 1.3 1.3 1.3;
                           dur: 300; startEvents: mouseenter"
          animation__shrink="property: scale; to: 1 1 1;
                             dur: 300; startEvents: mouseleave">
</a-sphere>
```

---

## 演習課題

### 課題:「動くギャラリー」を作ろう

3D空間内に展示物を配置し、それぞれにアニメーションを付けたギャラリーを作成する。

### ステップ1: ギャラリー空間の作成

- 床と背景を設定
- 展示台（box）を3つ以上配置

### ステップ2: 展示物のアニメーション（3つ以上）

以下のアニメーションをそれぞれ異なるオブジェクトに適用：

1. **回転アニメーション** — 常に回転し続ける展示物
2. **浮遊アニメーション** — 上下にゆっくり浮き沈みする展示物
3. **色変化アニメーション** — 色が徐々に変化する展示物

### ステップ3: イベント連動アニメーション

- カーソル（`<a-cursor>`）を設置
- 展示物をクリックすると何かが起きるアニメーションを1つ以上追加
  （例: クリックで拡大、クリックで跳ねる）

### ステップ4: 複数アニメーションの組み合わせ

- 1つのオブジェクトに2つ以上のアニメーションを同時適用

### 提出物

- `index.html`
- スクリーンショット / 画面録画

### 評価ポイント

| 項目 | 配点 |
|------|------|
| 3つ以上の異なるアニメーションがある | 30% |
| イベントトリガーのアニメーションがある | 25% |
| 複数アニメーションの組み合わせがある | 20% |
| イージングが適切に使われている | 10% |
| ギャラリーとしての見た目 | 15% |
