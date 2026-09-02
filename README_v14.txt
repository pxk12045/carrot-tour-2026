CARROT TOUR v14

変更点
1. iPhone表示縮尺を固定
   - viewport: minimum/maximum-scale=1, user-scalable=no
   - input/textarea/selectを16px以上にし、フォーカス時のSafari自動ズームを防止
   - touch-action: manipulation

2. 全体の文字を拡大
   - 上段/下段ボタン、一覧、詳細シート、血統、指標、兄姉、動画、メモ、Exportを見やすく調整

3. 全94頭 + 配置図
   - 配置図ボタンを無効化しない
   - 全94頭を選択して「配置図」を押すと、全94頭の募集番号順一覧を表示
   - 各会場を選択して「配置図」を押すと、従来どおりその会場の配置図を表示

4. v13/v12機能維持
   - 左端募集番号の指数順位ヒートマップ
   - ★は募集番号の前
   - 基本は募集番号順、会場順位だけ指数順
   - CSV/JSON Export
   - localStorageキー carrot2026_ は変更なし

GitHubで上書き: app.js / index.html / style.css / sw.js
確認URL: https://pxk12045.github.io/carrot-tour-2026/?v=14
