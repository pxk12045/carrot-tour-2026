CARROT TOUR v8 更新パック
=========================

GitHubリポジトリ直下へ上書き/追加:
- app.js
- style.css
- index.html
- sw.js
- tour-extra-data.js
- video-evaluation.js
- reference-data.js
- update_reference_data.py

Workflow:
update-reference-data.yml の中身を
.github/workflows/update-reference-data.yml
として登録してください。

その後:
Actions → Update reference data → Run workflow

変更内容
1. 動画評価は ◎ / 〇 / △ の選択式。変更値はiPhone/ブラウザ内localStorageへ保存。
   1,0,-1の数字は非表示。
2. 母名の後ろにnetkeibaリンク。
   Action後は母馬の直接ページ。取得前/失敗時だけ検索リンクへfallback。
3. 厩舎名後ろに「23–25計 XXX勝・YY位」。
   2023–2025 JRA年間リーディングの勝数を合算し、3年合計勝数で順位を再計算。
   地方予定馬は「JRA3年集計対象外」。
4. 体高 / 胸囲 / 管囲も他の測尺と同じカード表示。
5. 募集額はカンマなし（4000万）。
6. 将来体高/胸囲の比較・ヒートマップを牡牝別へ修正。
   想定FRそのものも元から牡牝別Huberモデル。

同性別の将来推定平均:
牡 n=48: 体高 158.9cm / 胸囲 179.0cm
牝 n=46: 体高 156.3cm / 胸囲 177.6cm

確認:
https://pxk12045.github.io/carrot-tour-2026/?v=8

注意:
family-data.js は上書きしないでください。
surgery-data.js / horses.js も上書き不要です。
