CARROT TOUR 2026 v29 最終結果 空欄修正版
========================================

症状
----
「第1次募集 最終結果」の見出しは出るが、中身が空欄になる。

v29の修正
---------
・最終結果パネルの描画処理を作り直し
・innerHTML中心の描画をやめ、DOM要素を直接生成
・final-application-results.js を app.js / interim-scope.js の後に読み込む
・馬名変更のMutationObserverに加え、クリック直後にも再描画
・詳細画面が開いている間は馬名変更を補助監視
・描画エラー時は空欄ではなくエラーメッセージを表示

表示内容
--------
母馬優先対象：
  母馬優先枠
    最優先×2 / ×1 / ×なし / 一般
  母馬優先枠以外
    最優先×2 / ×1 / ×なし / 一般
  公式ランク / 1.5次募集

母馬優先非対象：
  母馬優先枠以外の4区分
  公式ランク / 1.5次募集

No.56 / No.62：
  募集取り下げ

反映ファイル
------------
index.html
sw.js
application-status.js
interim-scope.js
final-application-results.js

反映後
------
https://pxk12045.github.io/carrot-tour-2026/?v=29
をオンラインで一度開いてください。
