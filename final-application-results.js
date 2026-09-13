// CARROT TOUR 2026 - official first-round final results panel v29
// Source: 2026年度1歳馬第1次募集最終集計結果（2026-09-10現在）
// v29: renderer rebuilt to avoid the blank-body issue seen in v28.
(() => {
  'use strict';

  const DATA = {"1":{"name":"ブランノワールの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"2":{"name":"カリプソⅡの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"3":{"name":"ジェイウォークの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"C","secondary15":"－"},"4":{"name":"ミリッサの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"4-C","secondary15":"－"},"5":{"name":"エールデュレーヴの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"5-C","secondary15":"－"},"6":{"name":"フィリアプーラの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"4-C","secondary15":"－"},"7":{"name":"トレジャーステイトの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"8":{"name":"スルーセブンシーズの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"regularPool":{"x2":"当選","x1":"抽選","x0":"×","general":"×"},"officialRank":"3-B","secondary15":"－"},"9":{"name":"ライラックスアンドレースの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"10":{"name":"アールブリュットの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"11":{"name":"シーリアの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"5-C","secondary15":"－"},"12":{"name":"プレシャライジングの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"13":{"name":"ハープスターの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"14":{"name":"コルコバードの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"4-C","secondary15":"－"},"15":{"name":"ファーストフォリオの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"regularPool":{"x2":"当選","x1":"抽選","x0":"×","general":"×"},"officialRank":"3-B","secondary15":"－"},"16":{"name":"アトミカオロの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"17":{"name":"レッドティーの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"18":{"name":"エルカスティージョの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"4-D","secondary15":"－"},"19":{"name":"プルメリアスターの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"5-E","secondary15":"○"},"20":{"name":"マハーバーラタの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"21":{"name":"アーデルハイトの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"C","secondary15":"－"},"22":{"name":"リカビトスの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"23":{"name":"ゴールドティアの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"24":{"name":"パドゥヴァルスの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"5-E","secondary15":"○"},"25":{"name":"アンフィトリテの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"26":{"name":"ショウナンパンドラの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"27":{"name":"ブロンディーヴァの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"5-C","secondary15":"－"},"28":{"name":"グリューヴァインの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"5-E","secondary15":"○"},"29":{"name":"モンペルデュの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"30":{"name":"ゴールデンプルーフの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"31":{"name":"サンクテュエールの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"5-E","secondary15":"○"},"32":{"name":"デイトユアドリームの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"33":{"name":"クルミナルの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"抽選","x0":"×","general":"×"},"officialRank":"5-B","secondary15":"－"},"34":{"name":"メルヴィルの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"5-E","secondary15":"○"},"35":{"name":"ナンシーフロムナイロビの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"36":{"name":"シーズンズギフトの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"4-C","secondary15":"－"},"37":{"name":"バイラオーラの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"5-E","secondary15":"○"},"38":{"name":"シャトンアンジュの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"39":{"name":"セレナズヴォイスの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"40":{"name":"ジェムフェザーの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"41":{"name":"シャイントレイルの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"42":{"name":"パストフォリアの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"43":{"name":"外）ビディデュークの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"44":{"name":"プロスペラスヴォヤージの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"45":{"name":"フォトコールの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"46":{"name":"レシステンシアの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"47":{"name":"リスグラシューの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"5-C","secondary15":"－"},"48":{"name":"カイゼリンの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"5-C","secondary15":"－"},"49":{"name":"ライティアの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"regularPool":{"x2":"当選","x1":"抽選","x0":"×","general":"×"},"officialRank":"3-B","secondary15":"－"},"50":{"name":"シンハライトの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"抽選","x0":"×","general":"×"},"officialRank":"4-B","secondary15":"－"},"51":{"name":"エスティタートの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"抽選","x1":"×","x0":"×","general":"×"},"officialRank":"5-A","secondary15":"－"},"52":{"name":"スウィッチインタイムの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"C","secondary15":"－"},"53":{"name":"ファハンムーラの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"C","secondary15":"－"},"54":{"name":"ストゥーティの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"4-C","secondary15":"－"},"55":{"name":"ウィンターパワーの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"57":{"name":"レイパパレの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"4-D","secondary15":"－"},"58":{"name":"ククナの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"4-C","secondary15":"－"},"59":{"name":"コンセッションズの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"60":{"name":"マラコスタムブラダの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"61":{"name":"エクシードリミッツの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"63":{"name":"イリュミナンスの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"64":{"name":"アヴェンチュラの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"65":{"name":"ブルーメンクローネの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"抽選","x0":"×","general":"×"},"officialRank":"4-B","secondary15":"－"},"66":{"name":"ブリンクの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"67":{"name":"メサルティムの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"68":{"name":"コンダクトレスの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"69":{"name":"ラクスバラディーの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"4-C","secondary15":"－"},"70":{"name":"フィニフティの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"4-C","secondary15":"－"},"71":{"name":"リュラの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"5-C","secondary15":"－"},"72":{"name":"サンブルエミューズの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"73":{"name":"ヴィルデローゼの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"5-C","secondary15":"－"},"74":{"name":"ダイアナブライトの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"5-E","secondary15":"○"},"75":{"name":"クロワドフェールの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"4-C","secondary15":"－"},"76":{"name":"ヴァルキュリアの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"4-D","secondary15":"－"},"77":{"name":"スピードリッパーの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"78":{"name":"キズナⅡの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"79":{"name":"ベデザンジュの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"80":{"name":"エリスライトの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"81":{"name":"クルークハイトの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"regularPool":{"x2":"当選","x1":"抽選","x0":"×","general":"×"},"officialRank":"3-B","secondary15":"－"},"82":{"name":"チカレンヌの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"83":{"name":"リラヴァティの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"5-C","secondary15":"－"},"84":{"name":"ローズノーブルの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"抽選","general":"×"},"officialRank":"5-C","secondary15":"－"},"85":{"name":"バウンスシャッセの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"86":{"name":"ヴィータアレグリアの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"87":{"name":"アドヴェントスの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"88":{"name":"アーズローヴァーの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"5-D","secondary15":"－"},"89":{"name":"ターシャズスターの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"抽選"},"officialRank":"D","secondary15":"－"},"90":{"name":"ブランシェクールの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"5-E","secondary15":"○"},"91":{"name":"ジュールヒートの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"92":{"name":"ペルレンケッテの25","motherPriority":true,"motherPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"5-E","secondary15":"○"},"93":{"name":"グラッブユアコートの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"94":{"name":"エレガントマナーの25","motherPriority":false,"motherPool":{"x2":"ー","x1":"ー","x0":"ー","general":"ー"},"regularPool":{"x2":"当選","x1":"当選","x0":"当選","general":"当選"},"officialRank":"E","secondary15":"○"},"56":{"withdrawn":true,"name":"マルシュロレーヌの25"},"62":{"withdrawn":true,"name":"（募集取り下げ）"}};
  window.FINAL_APPLICATION_RESULTS_20260910 = DATA;

  function injectStyle() {
    if (document.getElementById('carrotFinalResultStyle')) return;
    const s = document.createElement('style');
    s.id = 'carrotFinalResultStyle';
    s.textContent = `
      .carrot-final-result{margin:0 11px 9px;background:#f7fbf7;border:1px solid #cfe0cf;border-radius:12px;padding:9px 10px}
      .carrot-final-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:8px}
      .carrot-final-title{font-size:12px;font-weight:950;color:#234b2d}
      .carrot-final-date{font-size:10px;font-weight:850;color:#607565;white-space:nowrap}
      .carrot-final-badges{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px}
      .carrot-final-badge{display:inline-block;border-radius:999px;padding:3px 7px;font-size:10px;font-weight:900;background:#e9f2e9;color:#315238;border:1px solid #d2e2d2}
      .carrot-final-badge-rank{background:#edf3ff;color:#31517b;border-color:#d3def0}
      .carrot-final-badge-secondary{background:#fff3d6;color:#7d5a0a;border-color:#ecd69f}
      .carrot-final-group{margin-top:8px}
      .carrot-final-group-title{font-size:10px;font-weight:950;color:#4e6252;margin:0 0 5px}
      .carrot-final-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}
      .carrot-final-cell{background:#fff;border:1px solid #dfe6df;border-radius:9px;padding:6px 3px;text-align:center;min-width:0}
      .carrot-final-cell-label{font-size:8px;line-height:1.25;color:#7a827b;min-height:20px;display:flex;align-items:center;justify-content:center}
      .carrot-final-cell-value{font-size:14px;font-weight:1000;line-height:1.15;margin-top:3px;white-space:nowrap}
      .carrot-final-win{color:#19703a}
      .carrot-final-lottery{color:#a26500}
      .carrot-final-fail{color:#bd2a2a}
      .carrot-final-none{color:#999}
      .carrot-final-note{font-size:9px;line-height:1.45;color:#7e887f;margin-top:7px}
      .carrot-final-withdrawn{background:#fff0f0;border:1px solid #e8c4c4;border-radius:9px;padding:10px;text-align:center;font-size:13px;font-weight:950;color:#a42b2b}
      .carrot-final-error{background:#fff0f0;border:1px solid #e8c4c4;border-radius:9px;padding:8px;color:#a42b2b;font-size:10px;line-height:1.4}
      .carrot-final-result *{box-sizing:border-box!important;position:static!important;float:none!important;transform:none!important;writing-mode:horizontal-tb!important;text-orientation:mixed!important}
    `;
    document.head.appendChild(s);
  }

  function injectPanel() {
    let panel = document.getElementById('carrotFinalApplicationResult');
    if (panel) return panel;

    const anchor = document.getElementById('applicationStatus');
    if (!anchor) return null;

    panel = document.createElement('div');
    panel.id = 'carrotFinalApplicationResult';
    panel.className = 'carrot-final-result';

    const head = document.createElement('div');
    head.className = 'carrot-final-head';

    const title = document.createElement('div');
    title.className = 'carrot-final-title';
    title.textContent = '第1次募集 最終結果';

    const date = document.createElement('div');
    date.className = 'carrot-final-date';
    date.textContent = '9/10現在';

    head.append(title, date);

    const body = document.createElement('div');
    body.id = 'carrotFinalApplicationResultBody';

    panel.append(head, body);
    anchor.insertAdjacentElement('afterend', panel);
    return panel;
  }

  function currentHorseNo() {
    const title = document.getElementById('stitle');
    const horses = window.HORSES || [];
    if (!title || !horses.length) return null;

    const shown = title.textContent.trim().replace(/^●\s*/, '').trim();
    const horse = horses.find(h => String(h.name || '').trim() === shown);
    return horse ? String(horse.no) : null;
  }

  function valueClass(v) {
    if (v === '当選') return 'carrot-final-win';
    if (v === '抽選') return 'carrot-final-lottery';
    if (v === '×') return 'carrot-final-fail';
    return 'carrot-final-none';
  }

  function makeBadge(text, extraClass) {
    const el = document.createElement('span');
    el.className = `carrot-final-badge ${extraClass || ''}`;
    el.textContent = text;
    return el;
  }

  function makeCell(label, value) {
    const cell = document.createElement('div');
    cell.className = 'carrot-final-cell';

    const lab = document.createElement('div');
    lab.className = 'carrot-final-cell-label';
    lab.textContent = label;

    const val = document.createElement('div');
    val.className = `carrot-final-cell-value ${valueClass(value)}`;
    val.textContent = value;

    cell.append(lab, val);
    return cell;
  }

  function makeGroup(titleText, g) {
    const box = document.createElement('div');
    box.className = 'carrot-final-group';

    const title = document.createElement('div');
    title.className = 'carrot-final-group-title';
    title.textContent = titleText;

    const grid = document.createElement('div');
    grid.className = 'carrot-final-grid';
    grid.append(
      makeCell('最優先 ×2', g.x2),
      makeCell('最優先 ×1', g.x1),
      makeCell('最優先 ×なし', g.x0),
      makeCell('一般', g.general)
    );

    box.append(title, grid);
    return box;
  }

  function renderForNo(no) {
    const panel = injectPanel();
    if (!panel) return false;

    const body = document.getElementById('carrotFinalApplicationResultBody');
    if (!body) return false;

    body.replaceChildren();

    if (!no) {
      return false;
    }

    const d = DATA[String(no)];
    if (!d) {
      const note = document.createElement('div');
      note.className = 'carrot-final-note';
      note.textContent = '最終集計データなし';
      body.appendChild(note);
      return true;
    }

    if (d.withdrawn) {
      const wd = document.createElement('div');
      wd.className = 'carrot-final-withdrawn';
      wd.textContent = '募集取り下げ';

      const note = document.createElement('div');
      note.className = 'carrot-final-note';
      note.textContent = '公式最終集計では No.56、No.62 は募集取り下げ。';

      body.append(wd, note);
      return true;
    }

    const badges = document.createElement('div');
    badges.className = 'carrot-final-badges';
    badges.append(
      makeBadge(`公式ランク ${d.officialRank}`, 'carrot-final-badge-rank'),
      makeBadge(`1.5次募集 ${d.secondary15}`, 'carrot-final-badge-secondary')
    );
    body.appendChild(badges);

    if (d.motherPriority) {
      body.appendChild(makeGroup('母馬優先枠（募集総口数の半数が最大）', d.motherPool));
    }
    body.appendChild(makeGroup('母馬優先枠以外', d.regularPool));

    const note = document.createElement('div');
    note.className = 'carrot-final-note';
    note.textContent = '公式発表の「当選／抽選／×」をそのまま表示しています。';
    body.appendChild(note);

    return true;
  }

  function renderCurrent() {
    try {
      return renderForNo(currentHorseNo());
    } catch (err) {
      console.error('final application result render failed', err);
      const panel = injectPanel();
      const body = document.getElementById('carrotFinalApplicationResultBody');
      if (panel && body) {
        body.replaceChildren();
        const e = document.createElement('div');
        e.className = 'carrot-final-error';
        e.textContent = '最終結果の表示に失敗しました。ページを再読み込みしてください。';
        body.appendChild(e);
      }
      return false;
    }
  }

  function scheduleRender() {
    requestAnimationFrame(() => {
      renderCurrent();
      setTimeout(renderCurrent, 30);
    });
  }

  function init() {
    injectStyle();
    injectPanel();
    renderCurrent();

    const title = document.getElementById('stitle');
    if (title) {
      new MutationObserver(scheduleRender).observe(title, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    const sheet = document.getElementById('sheet');
    if (sheet) {
      new MutationObserver(() => {
        if (sheet.classList.contains('open')) scheduleRender();
      }).observe(sheet, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    // Extra fallback: horse cards/markers trigger openHorse() in app.js.
    // Re-render just after any click so the panel cannot remain header-only.
    document.addEventListener('click', () => {
      if (sheet && sheet.classList.contains('open')) scheduleRender();
    }, true);

    // Last-resort sync while the detail sheet is open.
    let lastTitle = '';
    setInterval(() => {
      if (!sheet || !sheet.classList.contains('open')) return;
      const now = document.getElementById('stitle')?.textContent || '';
      if (now !== lastTitle) {
        lastTitle = now;
        renderCurrent();
      }
    }, 350);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
