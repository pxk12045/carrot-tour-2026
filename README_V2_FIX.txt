2017 netkeiba collector v2 — mapping fix
========================================

初版10頭テスト:
rows=10 / mapped=0 / priced=0 / performance_ok=0
全件 no_candidate。

修正:
1. netkeiba classic DB の日本語検索語を EUC-JP でURLエンコード。
2. まず競走馬名で検索。
3. 検索結果を「2017年 + 母 + 父」で厳密照合。
4. 馬名検索で取れない場合、母馬を検索し、
   netkeiba母馬産駒ページから「2017年 + 父」で逆引き。
5. carrot1124.xlsx の legacy競走馬名が重複/誤対応でも母系から復旧可能。

再テスト:
GitHub root の collect_2017_netkeiba.py だけこの版で上書き。
Actions → Collect 2017 netkeiba → Run workflow
limit=10
delay=1.5

既存 data_2017_netkeiba は次回実行で上書きされます。
成功したら summary.json と qc.csv を再確認し、その後 limit=0。
