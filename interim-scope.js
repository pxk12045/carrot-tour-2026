// CARROT TOUR 2026 - 中間発表 scope tab v26
// Fix: 中間発表 is always sorted by recruitment No., independent of view mode.
(() => {
  'use strict';

  const STATUS = window.APPLICATION_STATUS_20260904 || {};
  const PROGRESS = 0.253;

  function installInterimStyle(){
    if (document.getElementById('interimScopeStyle')) return;
    const s = document.createElement('style');
    s.id = 'interimScopeStyle';
    s.textContent = `
      .venue-tabs{grid-template-columns:repeat(7,max-content)}
      .interim-list-note{
        margin:0 9px 7px;padding:7px 9px;border-radius:10px;
        background:#fff7e8;border:1px solid #ead4aa;
        color:#755522;font-size:10px;font-weight:850;line-height:1.4
      }
    `;
    document.head.appendChild(s);
  }

  // "interim" behaves like "all" for map availability: there is no single venue map.
  isAllScope = function(){
    return venue === 'all' || venue === 'interim';
  };

  venueObj = function(){
    return isAllScope() ? null : V.find(v => v.id === venue);
  };

  currentVenueHorses = function(){
    if (venue === 'all') return H;
    if (venue === 'interim') {
      return H.filter(h =>
        Object.prototype.hasOwnProperty.call(STATUS, String(h.no))
      );
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
        if (s.id === 'interim') view = 'venueList';
        renderAll();

        if (s.id === 'interim') {
          requestAnimationFrame(() => {
            const active = $('venueTabs').querySelector('.venue-tab.active');
            if (active && active.scrollIntoView) {
              active.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
            }
          });
        }
      };
      $('venueTabs').appendChild(b);
    });
  };

  renderHeader = function(){
    if (venue === 'all') {
      $('venueTitle').textContent = '全94頭';
      $('venueTime').textContent = '全会場';
      return;
    }
    if (venue === 'interim') {
      const n = currentVenueHorses().length;
      $('venueTitle').textContent = '中間発表';
      $('venueTime').textContent = `9/4 17時 / ${n}頭 / 募集番号順`;
      return;
    }
    const v = venueObj();
    $('venueTitle').textContent = v.title;
    $('venueTime').textContent = v.time;
  };

  // IMPORTANT:
  // app.js itself sorts "venueList" by v3.1 rank.
  // That is why sorting currentVenueHorses() alone did not work.
  // We replace buildList and make interim an explicit exception.
  buildList = function(mode){
    listMode = mode;
    $('list').innerHTML = '';
    $('search').value = '';

    const scope = currentVenueHorses();
    let hs =
      mode === 'stars'
        ? scope.filter(h => loadState(h.no).star)
        : mode === 'waveSoftGood'
          ? scope.filter(h => effectiveVideoRating(h.no, 'うねり・柔らかさ') === 1)
          : scope;

    if (venue === 'interim') {
      // Always recruitment-number order in the interim scope.
      hs = [...hs].sort((a,b) => Number(a.no) - Number(b.no));
    } else if (mode === 'venueList') {
      // Existing behavior for normal venues: v3.1 ranking order.
      hs = [...hs].sort((a,b) => a.rank - b.rank);
    } else {
      // Existing behavior elsewhere: recruitment-number order.
      hs = [...hs].sort((a,b) => Number(a.no) - Number(b.no));
    }

    hs.forEach(h => appendCard(h));
  };

  // Keep the custom middle-announcement card used in v24.
  const baseAppendCard = appendCard;
  appendCard = function(h){
    if (venue !== 'interim') {
      baseAppendCard(h);
      return;
    }

    const d = STATUS[String(h.no)];
    if (!d) return;

    const c = document.createElement('div');
    c.className = 'list-card';
    c.dataset.search =
      `${h.no} ${h.name} ${h.sire} ${h.dam} ${h.bms} ${h.trainer}`.toLowerCase();

    const starred = !!loadState(h.no).star;
    const url = extra(h.no).videoUrl;
    const badgeInner =
      `${starred?'<span class="list-star">★</span>':''}<span>${h.no}</span>`;
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

  installInterimStyle();
  renderAll();
})();
