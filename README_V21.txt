CARROT TOUR v21 — 端末間データ共有

追加:
- 「データ共有 / 保存」パネル
- 「JSONを共有 / 保存」
- 「JSONを読み込む」

共有されるlocalStorageデータ:
- ★
- 現場コメントテンプレ
- 引き手評価
- 特記事項
- 動画評価変更

使い方:
1. 元端末で「データ共有 / 保存」→「JSONを共有 / 保存」
2. AirDrop / iCloud Drive / メール等で別端末へJSONを渡す
3. 別端末で同じPWAを開く
4. 「データ共有 / 保存」→「JSONを読み込む」
5. JSONファイルを選択して確認

読み込み仕様:
- 2026年のCarrot Tourバックアップ形式のみ受け付ける
- 既知の募集馬Noのみ復元
- 同じ馬の端末側データはバックアップ側を優先して上書き
- v12以降の同形式JSONを概ね読み込み可能
- アプリ本体のv3.1指数データはJSONではなくPWA側のものを使用

GitHubで上書き:
app.js / index.html / style.css / sw.js

確認URL:
https://pxk12045.github.io/carrot-tour-2026/?v=21
