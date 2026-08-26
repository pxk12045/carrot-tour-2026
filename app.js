
const H=window.HORSES, V=window.VENUES, VE=window.VIDEO_EVAL||{}, FD=window.FAMILY_DATA||{}, SD=window.SURGERY_DATA||{};

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
function venueObj(){return V.find(v=>v.id===venue)}
function currentVenueHorses(){return H.filter(h=>h.venue===venue)}
function tierClass(h){return h.tier}
function renderVenueTabs(){
 $('venueTabs').innerHTML='';
 V.forEach(v=>{const b=document.createElement('button');b.className='venue-tab'+(v.id===venue?' active':'');b.textContent=v.label;b.onclick=()=>{venue=v.id;renderAll()};$('venueTabs').appendChild(b)})
}
function renderHeader(){const v=venueObj();$('venueTitle').textContent=v.title;$('venueTime').textContent=v.time}
function renderMap(){
 const v=venueObj(), hs=currentVenueHorses();
 $('mapImg').src=v.image;$('mapStage').querySelectorAll('.marker').forEach(x=>x.remove());
 hs.forEach(h=>{const b=document.createElement('button');b.className='marker '+tierClass(h);b.style.left=h.x+'%';b.style.top=h.y+'%';b.innerHTML=`<span class="mn">${h.no}</span><span class="mr">#${h.rank}</span>`;b.onclick=()=>openHorse(h.no);$('mapStage').appendChild(b)});
 $('topPicks').innerHTML='';
 [...hs].sort((a,b)=>a.rank-b.rank).slice(0,5).forEach((h,i)=>{const b=document.createElement('button');b.className='pick';b.textContent=`会場${i+1}位 No.${h.no} / 全体${h.rank}位`;b.onclick=()=>openHorse(h.no);$('topPicks').appendChild(b)})
}
function buildList(mode){
 listMode=mode; $('list').innerHTML=''; $('search').value='';
 let hs=mode==='allList'?H:mode==='stars'?H.filter(h=>loadState(h.no).star):currentVenueHorses();
 hs=[...hs].sort((a,b)=>a.rank-b.rank); hs.forEach(h=>appendCard(h))
}
function appendCard(h){
 const c=document.createElement('div');c.className='list-card';c.dataset.search=`${h.no} ${h.name} ${h.sire} ${h.dam} ${h.bms} ${h.trainer}`.toLowerCase();
 c.innerHTML=`<div class="rankbadge ${tierClass(h)}">#${h.rank}</div><div><div class="lname">No.${h.no} ${h.name}</div><div class="lsub">${h.sire} / 母 ${h.dam} / ${h.trainer}</div></div><div class="lright">v3 ${h.score.toFixed(1)}<br>FR ${Math.round(h.predFR)}kg</div>`;
 c.onclick=()=>openHorse(h.no);$('list').appendChild(c)
}
function setView(mode){
 view=mode;document.querySelectorAll('.viewbtn').forEach(b=>b.classList.toggle('active',b.dataset.view===mode));
 if(mode==='map'){$('mapView').classList.remove('hidden');$('listView').classList.add('hidden')}
 else{$('mapView').classList.add('hidden');$('listView').classList.remove('hidden');buildList(mode)}
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
 const d=VE[String(no)]||{};$('videoGrid').innerHTML='';
 ['前進気勢','首差','うねり','歩様'].forEach(k=>{const v=d[k];const box=document.createElement('div');box.className='video-item';box.innerHTML=`<div class="video-l">${k}</div><div class="video-v">${v===null||v===undefined||v===''?'未登録':v}</div>`;$('videoGrid').appendChild(box)})
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
 const h=byNo[no];current=h;$('stitle').textContent=`No.${h.no} ${h.name}`;$('smeta').textContent=`${h.sex} / ${h.trainer} / ${h.birthday}`;
 $('psire').textContent=h.sire;$('pdam').textContent=h.dam;$('pbms').textContent=h.bms;
 $('mrank').textContent='#'+h.rank;$('mscore').textContent=h.score.toFixed(1);$('mprice').textContent=Math.round(h.price).toLocaleString()+'万';
 $('mweight').textContent=Math.round(h.weight)+'kg';$('mfr').textContent=Math.round(h.predFR)+'kg';$('mgain').textContent=(h.gain>=0?'+':'')+Math.round(h.gain)+'kg';
 $('measure').innerHTML=`体高 <b>${h.height.toFixed(1)}</b>cm　胸囲 <b>${h.chest.toFixed(1)}</b>cm　管囲 <b>${h.cannon.toFixed(1)}</b>cm`;renderSurgery(no);
 $('earnIndex').textContent=h.earnIndex.toFixed(1);$('earnRank').textContent=`94頭中 ${h.earnRank}位相当`;
 $('winIndex').textContent=h.winIndex.toFixed(1);$('winRank').textContent=`94頭中 ${h.winRank}位相当`;
 const s=loadState(no);$('star').textContent=s.star?'★':'☆';$('star').classList.toggle('on',!!s.star);$('memo').value=s.memo||'';
 factorMode='reg';$('freg').classList.add('active');$('fcls').classList.remove('active');renderFactors();renderFamily(no);renderVideo(no);
 $('sheet').classList.add('open');$('sheetbg').classList.add('open')
}
$('freg').onclick=()=>{factorMode='reg';$('freg').classList.add('active');$('fcls').classList.remove('active');renderFactors()}
$('fcls').onclick=()=>{factorMode='cls';$('fcls').classList.add('active');$('freg').classList.remove('active');renderFactors()}
$('star').onclick=()=>{const s=loadState(current.no);s.star=!s.star;saveState(current.no,s);$('star').textContent=s.star?'★':'☆';$('star').classList.toggle('on',!!s.star)}
$('memo').oninput=e=>{if(!current)return;const s=loadState(current.no);s.memo=e.target.value;saveState(current.no,s)}
function closeSheet(){$('sheet').classList.remove('open');$('sheetbg').classList.remove('open')}
$('close').onclick=closeSheet;$('sheetbg').onclick=closeSheet;
function renderAll(){renderVenueTabs();renderHeader();renderMap();if(view!=='map')buildList(view)}
window.addEventListener('offline',()=>$('net').classList.add('show'));window.addEventListener('online',()=>$('net').classList.remove('show'));
if(!navigator.onLine)$('net').classList.add('show');
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
renderAll();
