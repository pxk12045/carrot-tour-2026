CARROT TOUR v20 — Primary v3.1 + unified red-white-blue heat

1) 配置図・リスト募集番号
- ヒートマップを詳細パネルと同じ 赤 -> 白 -> 青 に統一
- 上位ほど赤、中位が白、下位ほど青
- 白付近は文字を黒へ切り替え
- ★表示、募集番号バッジの動画リンクは維持

2) Primary v3.1
- 2019–2021年産270頭で学習済みv3係数を固定
- 募集時体重の寄与を75%
- 想定FRの寄与を75%
- その他の寄与は100%
- 賞金raw / 2勝rawを94頭内で再順位化
- v3.1総合指数 = 賞金順位indexと2勝indexの平均
- 同点総合指数はv3.1正本に合わせ、同順位を下側順位で表示
  （例: No.33 / No.51 はともに4位）

PWAでv3.1へ切替わるもの:
- 会場順位
- 配置図の指数色
- リスト募集番号の指数色
- 詳細「指数」パネル
- 賞金順位index / 2勝index
- v3.1指数の内訳（募集時体重・想定FR寄与も75%）
- CSV Exportのv3.1順位 / v3.1指数

既存localStorage:
- carrot2026_<No> は変更なし
- ★ / 特記事項 / テンプレ / 引き手評価 / 動画評価は維持

GitHubで上書き:
app.js
index.html
style.css
sw.js

確認:
https://pxk12045.github.io/carrot-tour-2026/?v=20
