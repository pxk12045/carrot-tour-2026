// CARROT TOUR 2026 - 中間発表 scope tab v24
// Adds "中間発表" next to "全94頭" and limits the list to horses
// included in APPLICATION_STATUS_20260904.
(() => {
  'use strict';

  const STATUS = window.APPLICATION_STATUS_20260904 || {};
  const PROGRESS = 0.253;

  // Keep original card rendering for every scope except 中間発表.
  const baseAppendCard = appendCard;

  // In this patch, both "全94頭" and "中間発表" are list-only scopes.
  isAllScope = function(){
    return venue === 'all' || venue === 'interim';
  };

  venueObj = function(){
    return isAllScope() ? null : V.find(v => v.id === venue);
  };

  currentVenueHorses = function(){
    if (venue === 'all') return H;
    if (venue === 'interim') {
      return H
    .filter(h => Object.prototype.hasOwnProperty.call(STATUS, String(h.no)))
    .sort((a, b) => Number(a.no) - Number(b.no));
    }
    return H.filter(h => h.venue === venue);
  };

  renderVenueTabs = function(){
    $('venueTabs').innerHTML = '';
    const scopes = [
      ...V.map(v => ({id:v.id, label:v.label})),
      {id:'all', label:'全94頭'},
      {id:'interim', label:'中間発表'}
    ];

    scopes.forEach(s => {
      const b = document.createElement('button');
      b.className = 'venue-tab' + (s.id === venue ? ' active' : '');
      b.textContent = s.label;
      b.onclick = () => {
        venue = s.id;
        // 中間発表は最初からリスト表示にする。
        if (s.id === 'interim') view = 'venueList';
        renderAll();
      };
      $('venueTabs').appendChild(b);
    });

    // 右端の「中間発表」が選択時に見えるようにスクロール。
    if (venue === 'interim') {
      const active = $('venueTabs').querySelector('.venue-tab.active');
      if (active && active.scrollIntoView) {
        active.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
      }
    }
  };

  renderHeader = function(){
    if (venue === 'all') {
      $('venueTitle').textContent = '全94頭';
      $('venueTime').textContent = '全会場';
    } else if (venue === 'interim') {
      const n = currentVenueHorses().length;
      $('venueTitle').textContent = '中間発表';
      $('venueTime').textContent = `9/4 17時 / ${n}頭`;
    } else {
      const v = venueObj();
      $('venueTitle').textContent = v.title;
      $('venueTime').textContent = v.time;
    }
  };

  appendCard = function(h){
    if (venue !== 'interim') {
      baseAppendCard(h);
      return;
    }

    const d = STATUS[String(h.no)];
    if (!d) return;

    const c = document.createElement('div');
    c.className = 'list-card';
    c.dataset.search = `${h.no} ${h.name} ${h.sire} ${h.dam} ${h.bms} ${h.trainer}`.toLowerCase();

    const starred = !!loadState(h.no).star;
    const url = extra(h.no).videoUrl;
    const badgeInner = `${starred?'<span class="list-star">★</span>':''}<span>${h.no}</span>`;
    const badgeTitle = url
      ? `募集No.${h.no} / 総合${h.rank}位 / タップで公式動画`
      : `募集No.${h.no} / 総合${h.rank}位`;
    const badgeAria = url
      ? `${starred?'★':''}募集No.${h.no} 総合${h.rank}位 公式動画を開く`
      : `${starred?'★':''}募集No.${h.no} 総合${h.rank}位`;

    const badge = url
      ? `<a class="rankbadge noheat video-badge${starred?' starred-no':''}" style="background:${rankHeatColor(h)};color:${rankHeatTextColor(h)};text-shadow:${rankHeatTextShadow(h)}" href="${safeText(url)}" target="_blank" rel="noopener" title="${safeText(badgeTitle)}" aria-label="${safeText(badgeAria)}">${badgeInner}</a>`
      : `<div class="rankbadge noheat${starred?' starred-no':''}" style="background:${rankHeatColor(h)};color:${rankHeatTextColor(h)};text-shadow:${rankHeatTextShadow(h)}" title="${safeText(badgeTitle)}" aria-label="${safeText(badgeAria)}">${badgeInner}</div>`;

    const projected = Math.round(Number(d.total || 0) / PROGRESS);

    c.innerHTML = `${badge}
      <div>
        <div class="lname">${safeText(displayName(h))}</div>
        <div class="lsub">${safeText(h.sire)} / 母 ${safeText(h.dam)} / ${safeText(h.trainer)}</div>
      </div>
      <div class="lright">
        申込 ${Number(d.total).toLocaleString('ja-JP')}<br>
        最終≈${projected.toLocaleString('ja-JP')}
      </div>`;

    const videoBadge = c.querySelector('.video-badge');
    if (videoBadge) videoBadge.onclick = e => e.stopPropagation();
    c.onclick = () => openHorse(h.no);
    $('list').appendChild(c);
  };

  // Refresh once after replacing the scope functions.
  renderAll();
})();
