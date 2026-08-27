# Carrot 2017 netkeiba collector

目的
----
carrot1124.xlsx の2017年産80頭について、
1) netkeiba馬IDを母名＋2017年＋父名で照合
2) 募集価格を horse TOP の「1口×口数」から取得
3) 2022-08-23までの戦績を race result table から集計
4) 2勝以上判定・想定FR・価格percentileを作成
5) 要手動確認を QC CSV に分離

最初の実行
----------
1. リポジトリ直下に
   - carrot2017_seed.csv
   - collect_2017_netkeiba.py
   をアップロード。
2. `collect-2017-netkeiba.yml` は
   `.github/workflows/collect-2017-netkeiba.yml`
   として登録。
3. Actions → Collect 2017 netkeiba → Run workflow
4. 初回は limit=10, delay=1.5 を推奨。
5. 成功後、`data_2017_netkeiba/2017_netkeiba_qc.csv` を確認。
6. 問題なければ limit=0 で80頭全件。

出力
----
- data_2017_netkeiba/2017_netkeiba_collected.csv
- data_2017_netkeiba/2017_netkeiba_qc.csv
- data_2017_netkeiba/2017_netkeiba_details.json
- data_2017_netkeiba/2017_netkeiba_summary.json

重要
----
- price_pct は80頭全価格が揃った場合のみ `final_80`。
  pilotや価格欠測時は `price_pct_provisional` のみ。
- 戦績は2022-08-23以前のみ。
- 1～5着なのに賞金欄が空白のレースはQCへ出す。
  海外レース等の賞金がnetkeiba行に載らないケースを見逃さないため。
- legacy_racehorse_nameは信用しすぎず、母名＋父名で照合する。
  carrot1124.xlsxでは競走馬名重複があるため。
