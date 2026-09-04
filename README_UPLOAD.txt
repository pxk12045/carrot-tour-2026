CARROT TOUR 2026 v27 表示崩れ修正版
===================================

今回の修正点
------------
添付画面で「最優先 71%」が詳細画面上部へ飛び出していた原因を修正しました。

原因：
application-status.js で当選率に付けていた
  mid / hard / safe / na
という汎用CSSクラス名が、既存アプリ側のCSSクラスと衝突していました。

修正：
申込状況パネルのクラスをすべて専用名へ変更しました。
例：
  mid  -> application-status-rate-mid
  hard -> application-status-rate-hard

さらに、
・当選率カード
・KPIの値/ラベル
にも専用クラスを付け、既存CSSの position / writing-mode / transform 等を
!important で打ち消す防御を追加しています。

v26の機能は維持
---------------
・「全94頭」の右に「中間発表」
・中間発表43頭
・募集番号順
・現在申込数
・最終申込数推定（25.3% → ×3.95）
・概算当選率
・詳細パネル表示

GitHubへ反映するファイル
------------------------
1. index.html               上書き
2. sw.js                    上書き
3. application-status.js    上書き
4. interim-scope.js         上書き

反映後
------
https://pxk12045.github.io/carrot-tour-2026/?v=27

をオンラインで一度開いてください。
