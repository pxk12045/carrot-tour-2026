CARROT TOUR v7 更新パック
=========================

GitHubリポジトリ直下へアップロード

上書き:
- app.js
- style.css
- index.html
- sw.js
- video-evaluation.js

追加:
- tour-extra-data.js

上書きしない:
- family-data.js
- horses.js
- surgery-data.js
- scrape_families.py

変更内容
--------
1. 動画評価
   添付 bosyuba-list-20260818.csv から固定表示。
   前進気勢 / 首差し / 力強さ / うねり・柔らかさ / 足捌き
   1=◎, 0=○, -1=△
   No.56 マルシュロレーヌの25 は元CSVが空欄のため「—」。

2. 母馬優先
   CSVの「●」を募集馬名の直前へ表示。
   対象 57頭。

3. 動画リンク
   募集馬名の直後に「▶動画」。
   キャロットクラブ公式の各募集馬ページへ遷移。
   URL形式: https://carrotclub.net/sp/horse/bosyuba.asp?id=25XXX

4. 将来体高・将来胸囲
   scale = (想定FR / 募集時体重)^(1/3)
   将来体高 = 現在体高 × scale
   将来胸囲 = 現在胸囲 × scale

   94頭平均:
   将来体高 157.6 cm
   将来胸囲 178.3 cm

   平均より小さい側を青、平均付近をグレー、大きい側を赤。
   色尺度は94頭全体の標準偏差を使い±2SDで固定。

注意:
将来体高・胸囲は実測縦断データによる学習モデルではなく、
体重変化を相似則で線寸法へ変換した参考推定です。

確認URL:
https://pxk12045.github.io/carrot-tour-2026/?v=7
