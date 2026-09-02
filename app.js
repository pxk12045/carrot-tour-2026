
const H=window.HORSES, V=window.VENUES, VE=window.VIDEO_EVAL||{}, FD=window.FAMILY_DATA||{}, SD=window.SURGERY_DATA||{}, TE=window.TOUR_EXTRA||{horses:{},cohortAverageBySex:{}}, RD=window.REFERENCE_DATA||{};

const FACTOR_ORDER=['体高','胸囲','管囲','募集時体重','募集価格','生月日補正','想定FR','性別'];

const FACTOR_SCALE={
  reg:Math.max(...H.flatMap(h=>FACTOR_ORDER.map(n=>Math.abs(h.factors?.[n]?.reg||0))),1e-9),
  cls:Math.max(...H.flatMap(h=>FACTOR_ORDER.map(n=>Math.abs(h.factors?.[n]?.cls||0))),1e-9)
};
const byNo=Object.fromEntries(H.map(h=>[h.no,h]));
let venue=V[0].id, current=null, view='map', factorMode='reg', listMode='venueList';
const $=id=>document.getElementById(id);
const stateKey=no=>'carrot2026_'+no;
function loadState(no){try{return JSON.parse(localStorage.getItem(stateKey(no))||'{}')}catch(e){return {}}}
function saveState(no,s){localStorage.setItem(stateKey(no),JSON.stringify(s))}

function extra(no){return (TE.horses||{})[String(no)]||{}}
function refData(no){return RD[String(no)]||{}}
function damLink(h){
 const r=refData(h.no), url=r.damDirectUrl||r.damSearchUrl;
 if(!url)return safeText(h.dam);
 const title=r.damDirectUrl?'netkeiba 母馬ページ':'netkeiba検索（直リンク未取得）';
 return `${safeText(h.dam)} <a class="nk-link" href="${safeText(url)}" target="_blank" rel="noopener" title="${title}">netkeiba</a>`;
}
function trainerStat(h){
 if(/門別|大井|川崎|船橋|地方/.test(h.trainer))return 'JRA3年集計対象外';
 const t=(refData(h.no).trainer||{});
 if(t.status==='ok' && t.wins!=null)return `23–25計 ${t.wins}勝・${t.rank!=null?t.rank+'位':'—位'}`;
 if(t.status==='not_found')return '23–25計 0勝・—位';
 return '23–25成績 取得前';
}

function safeText(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function displayName(h){return `${extra(h.no).motherPriority?'●':''}${h.name}`}
function videoLink(h,label='▶動画'){
 const url=extra(h.no).videoUrl;
 if(!url)return '';
 return `<a class="video-link" href="${safeText(url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${label}</a>`;
}
function signed(v){return `${v>=0?'+':''}${Number(v).toFixed(1)}`}


function effectiveVideoRating(no,key){
 const defaults=VE[String(no)]||{};
 const s=loadState(no), saved=s.videoEval||{};
 return Object.prototype.hasOwnProperty.call(saved,key)?saved[key]:defaults[key];
}

function isAllScope(){return venue==='all'}
function venueObj(){return isAllScope()?null:V.find(v=>v.id===venue)}
function currentVenueHorses(){return isAllScope()?H:H.filter(h=>h.venue===venue)}
function tierClass(h){return h.tier}
function rankHeatColor(h){
 const n=Math.max(2,H.length);
 const t=Math.max(0,Math.min(1,(Number(h.rank)-1)/(n-1)));
 // 指数順位: 1位=赤 → 下位=青。順位そのものは配置図には表示しない。
 const hue=220*t;
 return `hsl(${hue.toFixed(0)} 78% 42%)`;
}
function renderVenueTabs(){
 $('venueTabs').innerHTML='';
 const scopes=[...V.map(v=>({id:v.id,label:v.label})),{id:'all',label:'全94頭'}];
 scopes.forEach(s=>{
   const b=document.createElement('button');
   b.className='venue-tab'+(s.id===venue?' active':'');
   b.textContent=s.label;
   b.onclick=()=>{
     venue=s.id;
     if(isAllScope() && view==='map') view='venueList';
     renderAll();
   };
   $('venueTabs').appendChild(b);
 });
}
function renderHeader(){
 if(isAllScope()){
   $('venueTitle').textContent='全94頭';
   $('venueTime').textContent='全会場';
 }else{
   const v=venueObj();$('venueTitle').textContent=v.title;$('venueTime').textContent=v.time;
 }
}
function renderMap(){
 if(isAllScope()) return;
 const v=venueObj(), hs=currentVenueHorses();
 $('mapImg').src=v.image;$('mapStage').querySelectorAll('.marker').forEach(x=>x.remove());
 hs.forEach(h=>{
  const starred=!!loadState(h.no).star;
  const b=document.createElement('button');
  b.className='marker map-rank'+(starred?' starred':'');
  b.style.left=h.x+'%';b.style.top=h.y+'%';b.style.background=rankHeatColor(h);
  b.innerHTML=`${starred?'<span class="map-star">★</span>':''}<span class="mn">${h.no}</span>`;
  b.setAttribute('aria-label',`${starred?'★':''}募集No.${h.no} 総合${h.rank}位`);
  b.title=`${starred?'★ ':''}No.${h.no} / 総合${h.rank}位`;
  b.onclick=()=>openHorse(h.no);$('mapStage').appendChild(b)
 });
 $('topPicks').innerHTML='';
 [...hs].sort((a,b)=>a.rank-b.rank).slice(0,5).forEach((h,i)=>{const b=document.createElement('button');b.className='pick';b.textContent=`会場${i+1}位 No.${h.no} / 全体${h.rank}位`;b.onclick=()=>openHorse(h.no);$('topPicks').appendChild(b)})
}
function buildList(mode){
 listMode=mode; $('list').innerHTML=''; $('search').value='';
 const scope=currentVenueHorses();
 let hs=
   mode==='stars'?scope.filter(h=>loadState(h.no).star):
   mode==='waveSoftGood'?scope.filter(h=>effectiveVideoRating(h.no,'うねり・柔らかさ')===1):
   scope;
 hs=[...hs].sort((a,b)=>a.rank-b.rank);
 hs.forEach(h=>appendCard(h));
}
function appendCard(h){
 const c=document.createElement('div');c.className='list-card';c.dataset.search=`${h.no} ${h.name} ${h.sire} ${h.dam} ${h.bms} ${h.trainer}`.toLowerCase();
 c.innerHTML=`<div class="rankbadge ${tierClass(h)}">#${h.rank}</div><div><div class="lname">No.${h.no} ${safeText(displayName(h))} ${videoLink(h)}</div><div class="lsub">${safeText(h.sire)} / 母 ${safeText(h.dam)} / ${safeText(h.trainer)}</div></div><div class="lright">v3 ${h.score.toFixed(1)}<br>FR ${Math.round(h.predFR)}kg</div>`;
 c.onclick=()=>openHorse(h.no);$('list').appendChild(c)
}
function syncViewButtons(){
 const mapBtn=document.querySelector('.viewbtn[data-view="map"]');
 if(mapBtn){
   mapBtn.disabled=isAllScope();
   mapBtn.classList.toggle('disabled',isAllScope());
 }
 document.querySelectorAll('.viewbtn').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
}
function setView(mode){
 if(mode==='map' && isAllScope()) return;
 view=mode;
 syncViewButtons();
 if(mode==='map'){
   $('mapView').classList.remove('hidden');$('listView').classList.add('hidden');renderMap();
 }else{
   $('mapView').classList.add('hidden');$('listView').classList.remove('hidden');buildList(mode);
 }
}
document.querySelectorAll('.viewbtn').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('search').oninput=e=>{const q=e.target.value.trim().toLowerCase();document.querySelectorAll('.list-card').forEach(c=>c.classList.toggle('hidden',q && !c.dataset.search.includes(q)))}
$('zoom').onclick=()=>{$('mapStage').classList.toggle('zoomed');$('zoom').textContent=$('mapStage').classList.contains('zoomed')?'縮小':'拡大'}
function renderFactors(){
 const scale=FACTOR_SCALE[factorMode];
 $('factors').innerHTML='';
 FACTOR_ORDER.forEach(n=>{
   const val=current.factors?.[n]?.[factorMode]||0;
   const idx=Math.max(-100,Math.min(100,val/scale*100));
   const pct=Math.abs(idx)/2;
   const left=idx>=0?50:50-pct;
   const r=document.createElement('div');
   r.className='frow';
   r.innerHTML=`<div class="fname">${n}</div>
     <div class="track"><div class="mid"></div><div class="bar ${idx>=0?'pos':'neg'}" style="left:${left}%;width:${pct}%"></div></div>
     <div class="fval">${idx>=0?'+':''}${Math.round(idx)}</div>`;
   $('factors').appendChild(r);
 });
}
function renderVideo(no){
 const defaults=VE[String(no)]||{}, s=loadState(no), saved=s.videoEval||{};
 $('videoGrid').innerHTML='';
 ['前進気勢','首差し','力強さ','うねり・柔らかさ','足捌き'].forEach(k=>{
   const v=Object.prototype.hasOwnProperty.call(saved,k)?saved[k]:defaults[k];
   const box=document.createElement('div'); box.className='video-item';
   const sel=document.createElement('select'); sel.className='video-select'; sel.setAttribute('aria-label',k);
   [['','—'],['1','◎'],['0','〇'],['-1','△']].forEach(([val,lab])=>{
     const o=document.createElement('option');o.value=val;o.textContent=lab;
     if((v===null||v===undefined?'':String(v))===val)o.selected=true;
     sel.appendChild(o);
   });
   sel.onchange=()=>{
     const st=loadState(no); st.videoEval=st.videoEval||{};
     st.videoEval[k]=sel.value===''?null:Number(sel.value); saveState(no,st);
     sel.dataset.rating=sel.value;
     if(k==='うねり・柔らかさ' && view==='waveSoftGood') buildList('waveSoftGood');
   };
   sel.dataset.rating=(v===null||v===undefined?'':String(v));
   box.innerHTML=`<div class="video-l">${k}</div>`; box.appendChild(sel); $('videoGrid').appendChild(box);
 });
}
function yenMan(y){
 if(y===null||y===undefined)return '—';
 const man=y/10000;
 return (man>=1000?Math.round(man).toLocaleString():Math.round(man*10)/10)+'万円';
}
function renderFamily(no){
 const d=FD[String(no)]||{};
 $('damAge').textContent=d.damFoalingAge!=null?d.damFoalingAge+'歳':'—';
 $('foalOrder').textContent=d.foalOrder!=null?'第'+d.foalOrder+'仔':'—';
 const sibs=Array.isArray(d.siblings)?d.siblings:[];
 const started=sibs.filter(x=>(x.jraStarts||0)>0||(x.narStarts||0)>0||(x.foreignStarts||0)>0).length;
 const winners=sibs.filter(x=>(x.jraWins||0)>0||(x.narWins||0)>0||(x.foreignWins||0)>0).length;
 const jraW=sibs.map(x=>x.jraWins).filter(x=>x!=null), earn=sibs.map(x=>x.jraEarningsYen).filter(x=>x!=null);
 let summary=`兄姉 ${sibs.length}頭`;
 if(sibs.length) summary+=` ／ 出走 ${started}頭 ／ 勝ち馬 ${winners}頭`;
 if(jraW.length) summary+=` ／ 中央最高 ${Math.max(...jraW)}勝`;
 if(earn.length) summary+=` ／ 中央最高賞金 ${yenMan(Math.max(...earn))}`;
 if(d.status==='pending') summary='兄姉データ：収集前（GitHub Action実行後に表示）';
 if(d.status==='error') summary='兄姉データ：取得エラー';
 if(d.status==='no_table') summary='兄姉データ：産駒表なし';
 $('familySummary').textContent=summary;
 $('siblingsSummary').textContent=sibs.length?`兄姉 ${sibs.length}頭を見る`:'兄姉データなし';
 $('siblingsDetails').open=false;
 $('siblingsList').innerHTML='';
 sibs.forEach(x=>{
   const c=document.createElement('div');c.className='sib';
   const results=[];
   if(x.jraStarts!=null){results.push(`中央 ${x.jraWins??0}勝 / 本賞金 ${yenMan(x.jraEarningsYen)}`)}
   if(x.narStarts!=null){results.push(`地方 ${x.narWins??0}勝 / 賞金 ${yenMan(x.narEarningsYen)}`)}
   if(x.foreignWins!=null){results.push(`海外 ${x.foreignWins}勝`)}
   if(x.unraced&&!results.length){results.push('未出走')}
   c.innerHTML=`<div class="sib-head"><div class="sib-name">${x.name}${x.sex?' '+x.sex:''}</div><div class="sib-year">${x.year||''}</div></div><div class="sib-sire">父：${x.sire||'—'}</div><div class="sib-result ${x.unraced?'sib-unraced':''}">${results.join('<br>')||'成績 —'}</div>`;
   $('siblingsList').appendChild(c);
 });
 $('familySourceNote').textContent=d.source?'兄姉成績：へっぽこ軍団公開データ（取得時点）。中央・地方は分けて表示。':'母年齢・産駒順：募集馬基礎データ。';
}
function renderFutureBody(no){
 const e=extra(no), h=byNo[no], avg=(TE.cohortAverageBySex||{})[h.sex]||{};
 if(e.futureHeight==null||e.futureChest==null){
   $('futureBody').classList.add('hidden');return;
 }
 $('futureHeight').textContent=`${e.futureHeight.toFixed(1)}cm (${signed(e.futureHeightDiff)})`;
 $('futureChest').textContent=`${e.futureChest.toFixed(1)}cm (${signed(e.futureChestDiff)})`;
 $('futureHeight').style.color=e.futureHeightColor||'';
 $('futureChest').style.color=e.futureChestColor||'';
 $('futureAvg').textContent=`${h.sex}平均：体高 ${Number(avg.futureHeight).toFixed(1)}cm / 胸囲 ${Number(avg.futureChest).toFixed(1)}cm`;
 $('futureBody').classList.remove('hidden');
}
function renderSurgery(no){
 const text=SD[String(no)];
 const box=$('surgery');
 if(!text){
   box.classList.add('hidden');
   $('surgeryText').textContent='';
   return;
 }
 $('surgeryText').textContent=text;
 box.classList.remove('hidden');
}
function openHorse(no){
 const h=byNo[no];current=h;$('stitle').innerHTML=`No.${h.no} ${safeText(displayName(h))} ${videoLink(h)}`;$('smeta').innerHTML=`${safeText(h.sex)} / ${safeText(h.trainer)} <span class="trainer-stat">${safeText(trainerStat(h))}</span> / ${safeText(h.birthday)}`;
 $('psire').textContent=h.sire;$('pdam').innerHTML=damLink(h);$('pbms').textContent=h.bms;
 $('mrank').textContent='#'+h.rank;$('mscore').textContent=h.score.toFixed(1);$('mprice').textContent=Math.round(h.price)+'万';
 $('mweight').textContent=Math.round(h.weight)+'kg';$('mfr').textContent=Math.round(h.predFR)+'kg';$('mgain').textContent=(h.gain>=0?'+':'')+Math.round(h.gain)+'kg';
 $('mheight').textContent=h.height.toFixed(1)+'cm';$('mchest').textContent=h.chest.toFixed(1)+'cm';$('mcannon').textContent=h.cannon.toFixed(1)+'cm';renderFutureBody(no);renderSurgery(no);
 $('earnIndex').textContent=h.earnIndex.toFixed(1);$('earnRank').textContent=`94頭中 ${h.earnRank}位相当`;
 $('winIndex').textContent=h.winIndex.toFixed(1);$('winRank').textContent=`94頭中 ${h.winRank}位相当`;
 const s=loadState(no);$('star').textContent=s.star?'★':'☆';$('star').classList.toggle('on',!!s.star);$('memo').value=s.memo||'';
 factorMode='reg';$('freg').classList.add('active');$('fcls').classList.remove('active');renderFactors();renderFamily(no);renderVideo(no);
 $('sheet').classList.add('open');$('sheetbg').classList.add('open')
}
$('freg').onclick=()=>{factorMode='reg';$('freg').classList.add('active');$('fcls').classList.remove('active');renderFactors()}
$('fcls').onclick=()=>{factorMode='cls';$('fcls').classList.add('active');$('freg').classList.remove('active');renderFactors()}
$('star').onclick=()=>{
 const s=loadState(current.no);s.star=!s.star;saveState(current.no,s);
 $('star').textContent=s.star?'★':'☆';$('star').classList.toggle('on',!!s.star);
 if(view==='stars') buildList('stars');
 if(view==='map') renderMap();
}
$('memo').oninput=e=>{if(!current)return;const s=loadState(current.no);s.memo=e.target.value;saveState(current.no,s)}
function closeSheet(){$('sheet').classList.remove('open');$('sheetbg').classList.remove('open')}
$('close').onclick=closeSheet;$('sheetbg').onclick=closeSheet;

const EXPORT_VIDEO_KEYS=['前進気勢','首差し','力強さ','うねり・柔らかさ','足捌き'];
function ratingLabel(v){return v===1?'◎':v===0?'〇':v===-1?'△':'—'}
function savedStateEntries(){
 return H.map(h=>({horse:h,state:loadState(h.no)}));
}
function exportCounts(){
 let memo=0,star=0,videoChanged=0,any=0;
 savedStateEntries().forEach(({state})=>{
   const hasMemo=String(state.memo||'').trim().length>0;
   const hasStar=!!state.star;
   const ve=state.videoEval||{};
   const hasVideo=Object.keys(ve).some(k=>Object.prototype.hasOwnProperty.call(ve,k));
   if(hasMemo)memo++;
   if(hasStar)star++;
   if(hasVideo)videoChanged++;
   if(hasMemo||hasStar||hasVideo)any++;
 });
 return {memo,star,videoChanged,any};
}
function updateExportSummary(){
 const c=exportCounts();
 $('exportSummary').textContent=`保存あり ${c.any}頭 ／ コメント ${c.memo}頭 ／ ★ ${c.star}頭 ／ 動画評価変更 ${c.videoChanged}頭`;
}
function openExport(){
 updateExportSummary();
 $('exportStatus').textContent='';
 $('exportPanel').classList.add('open');
 $('exportBg').classList.add('open');
}
function closeExport(){
 $('exportPanel').classList.remove('open');
 $('exportBg').classList.remove('open');
}
function csvCell(v){
 const s=String(v??'');
 return /[",\n\r]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;
}
function exportCsvText(){
 const headers=['No','募集馬名','会場','v3順位','v3指数','★','コメント',...EXPORT_VIDEO_KEYS,'動画評価変更項目'];
 const lines=[headers.map(csvCell).join(',')];
 [...H].sort((a,b)=>Number(a.no)-Number(b.no)).forEach(h=>{
   const st=loadState(h.no), saved=st.videoEval||{};
   const changed=EXPORT_VIDEO_KEYS.filter(k=>Object.prototype.hasOwnProperty.call(saved,k)).join(' / ');
   const vals=[
     h.no,h.name,(V.find(v=>v.id===h.venue)||{}).label||h.venue,h.rank,h.score.toFixed(1),
     st.star?'★':'',st.memo||'',
     ...EXPORT_VIDEO_KEYS.map(k=>ratingLabel(effectiveVideoRating(h.no,k))),
     changed
   ];
   lines.push(vals.map(csvCell).join(','));
 });
 return '\ufeff'+lines.join('\r\n');
}
function exportJsonObject(){
 const states={};
 [...H].sort((a,b)=>Number(a.no)-Number(b.no)).forEach(h=>{
   const raw=loadState(h.no);
   states[String(h.no)]={
     name:h.name,
     state:raw,
     effectiveVideoEval:Object.fromEntries(EXPORT_VIDEO_KEYS.map(k=>[k,effectiveVideoRating(h.no,k)]))
   };
 });
 return {
   format:'carrot-tour-local-backup',
   version:12,
   season:2026,
   stateKeyPrefix:'carrot2026_',
   exportedAt:new Date().toISOString(),
   horseCount:H.length,
   counts:exportCounts(),
   states
 };
}
function fileStamp(){
 const d=new Date(), p=n=>String(n).padStart(2,'0');
 return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
}
async function shareOrDownload(filename,mime,text){
 const file=new File([text],filename,{type:mime});
 try{
   if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
     await navigator.share({files:[file],title:filename});
     return '共有シートを開きました。「ファイルに保存」などを選べます。';
   }
 }catch(e){
   if(e && e.name==='AbortError') return '共有をキャンセルしました。';
 }
 const blob=new Blob([text],{type:mime});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),30000);
 return 'ファイルを書き出しました。';
}
$('exportOpen').onclick=openExport;
$('exportClose').onclick=closeExport;
$('exportCloseX').onclick=closeExport;
$('exportBg').onclick=closeExport;
$('exportCsv').onclick=async()=>{
 $('exportStatus').textContent='CSVを準備中…';
 const msg=await shareOrDownload(`carrot-tour-2026_${fileStamp()}.csv`,'text/csv;charset=utf-8',exportCsvText());
 $('exportStatus').textContent=msg;
};
$('exportJson').onclick=async()=>{
 $('exportStatus').textContent='JSONバックアップを準備中…';
 const text=JSON.stringify(exportJsonObject(),null,2);
 const msg=await shareOrDownload(`carrot-tour-2026_backup_${fileStamp()}.json`,'application/json;charset=utf-8',text);
 $('exportStatus').textContent=msg;
};

function renderAll(){
 if(isAllScope() && view==='map') view='venueList';
 renderVenueTabs();renderHeader();syncViewButtons();
 if(view==='map'){
   $('mapView').classList.remove('hidden');$('listView').classList.add('hidden');renderMap();
 }else{
   $('mapView').classList.add('hidden');$('listView').classList.remove('hidden');buildList(view);
 }
}
window.addEventListener('offline',()=>$('net').classList.add('show'));window.addEventListener('online',()=>$('net').classList.remove('show'));
if(!navigator.onLine)$('net').classList.add('show');
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
renderAll();
