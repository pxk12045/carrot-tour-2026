
const H=window.HORSES, V=window.VENUES, VE=window.VIDEO_EVAL||{};
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
 const vals=Object.entries(current.factors).map(([n,v])=>[n,v[factorMode]]).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));
 const mx=Math.max(...vals.map(x=>Math.abs(x[1])),.0001);$('factors').innerHTML='';
 vals.forEach(([n,val])=>{const pct=Math.min(50,Math.abs(val)/mx*50),left=val>=0?50:50-pct;const r=document.createElement('div');r.className='frow';r.innerHTML=`<div class="fname">${n}</div><div class="track"><div class="mid"></div><div class="bar ${val>=0?'pos':'neg'}" style="left:${left}%;width:${pct}%"></div></div><div class="fval">${val>=0?'+':''}${val.toFixed(3)}</div>`;$('factors').appendChild(r)})
}
function renderVideo(no){
 const d=VE[String(no)]||{};$('videoGrid').innerHTML='';
 ['前進気勢','首差','うねり','歩様'].forEach(k=>{const v=d[k];const box=document.createElement('div');box.className='video-item';box.innerHTML=`<div class="video-l">${k}</div><div class="video-v">${v===null||v===undefined||v===''?'未登録':v}</div>`;$('videoGrid').appendChild(box)})
}
function openHorse(no){
 const h=byNo[no];current=h;$('stitle').textContent=`No.${h.no} ${h.name}`;$('smeta').textContent=`${h.sex} / ${h.trainer} / ${h.birthday}`;
 $('psire').textContent=h.sire;$('pdam').textContent=h.dam;$('pbms').textContent=h.bms;
 $('mrank').textContent='#'+h.rank;$('mscore').textContent=h.score.toFixed(1);$('mprice').textContent=Math.round(h.price).toLocaleString()+'万';
 $('mweight').textContent=Math.round(h.weight)+'kg';$('mfr').textContent=Math.round(h.predFR)+'kg';$('mgain').textContent=(h.gain>=0?'+':'')+Math.round(h.gain)+'kg';
 $('measure').innerHTML=`体高 <b>${h.height.toFixed(1)}</b>cm　胸囲 <b>${h.chest.toFixed(1)}</b>cm　管囲 <b>${h.cannon.toFixed(1)}</b>cm`;
 $('earnIndex').textContent=h.earnIndex.toFixed(1);$('earnRank').textContent=`94頭中 ${h.earnRank}位相当`;
 $('winIndex').textContent=h.winIndex.toFixed(1);$('winRank').textContent=`94頭中 ${h.winRank}位相当`;
 const s=loadState(no);$('star').textContent=s.star?'★':'☆';$('star').classList.toggle('on',!!s.star);$('memo').value=s.memo||'';
 factorMode='reg';$('freg').classList.add('active');$('fcls').classList.remove('active');renderFactors();renderVideo(no);
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
