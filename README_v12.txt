CARROT TOUR v12 — Data Export

変更点
- v11の配置図（募集番号のみ、★を番号前、v3順位ヒートマップ）を維持。旧Top10/25凡例も上位→下位のヒートマップ凡例へ修正。
- 「データ保存 / Export」ボタンを追加。
- CSV: 全94頭を1行ずつ出力。No、募集馬名、会場、v3順位、v3指数、★、コメント、動画評価5項目、変更項目を保存。UTF-8 BOM付き。
- JSON: carrot2026_<No> のlocalStorage内容をstateとして保存し、現在有効な動画評価も併記。
- iPhone/iOSではWeb Share API対応時に共有シートを開き、「ファイルに保存」等を選択可能。非対応環境では通常ダウンロード。
- 既存localStorageキーは変更しないため、これまでの★・コメント・動画評価はそのまま。

GitHub rootで app.js / index.html / style.css / sw.js を上書き。
確認URL: https://pxk12045.github.io/carrot-tour-2026/?v=12

重要: アプリ削除やSafariサイトデータ削除の前に、まずJSONバックアップを保存すること。
