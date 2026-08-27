2017 netkeiba collector v3 — 10頭pilot残件補正
================================================

v2 pilot結果:
rows 10 / mapped 8 / priced 7 / performance_ok 8 / qc 3

確認できた残件:
501 アディクティドの17
  正: サクセッション
  netkeiba ID: 2017105181
  募集総額: 5000万円

503 元seed「ベルレンケッテの2017 / ピクチャーポーズ」
  元データ誤対応。
  正: ペルレンケッテの17 → バンデアミール
  netkeiba ID: 2017105543
  募集総額: 4000万円
  seed自体も修正済み。

504 ローガンサファイアの17 → エルサフィーロ
  netkeiba ID: 2017105657
  horse mappingは成功済み。
  netkeiba現行ページに募集情報がないため、
  キャロット公式2018カタログの4400万円をfallback。

使い方:
GitHub root の
- collect_2017_netkeiba.py
- carrot2017_seed.csv
をこのv3で上書き。

workflowは変更不要。
Actions → Collect 2017 netkeiba
limit=10 / delay=1.5 で再実行。

目標:
mapped 10/10
priced 10/10
performance_ok 10/10
