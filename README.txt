GitHub cache fix
================

GitHubのリポジトリ直下に、以下2ファイルを上書きアップロードしてください。
- index.html
- sw.js

その後:
1. Pagesのデプロイ完了を待つ
2. iPhone Chromeで
   https://pxk12045.github.io/carrot-tour-2026/?v=4
   を開く
3. 新画面を確認
4. ホーム画面版を使っている場合は一度終了して再起動

この修正では:
- HTML/JS/CSS/family-data は network-first
- ファイルURLにversionを付与
- 古いService Worker cacheをactivate時に削除
