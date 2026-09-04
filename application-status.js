// CARROT TOUR 2026 - application status & lottery estimate panel v26
// Source: 2026年度1歳募集馬・申込み状況の中間発表2回目（2026-09-04 17:00）
// Projection assumption: current applications = 25.3% of final applications.
// IMPORTANT: winning rates are coarse estimates. They do not model ×2/×1/×なし or payment-delay ranks.
(() => {
  'use strict';

  const STATUS = {"4":{"motherPriority":true,"total":258,"motherPriorityFirst":31,"motherPriorityGeneral":34,"firstPriority":66,"newThisUpdate":true},"5":{"motherPriority":true,"total":263,"motherPriorityFirst":27,"motherPriorityGeneral":25,"firstPriority":60,"newThisUpdate":true},"6":{"motherPriority":true,"total":255,"motherPriorityFirst":66,"motherPriorityGeneral":32,"firstPriority":39,"newThisUpdate":true},"8":{"motherPriority":true,"total":346,"motherPriorityFirst":126,"motherPriorityGeneral":8,"firstPriority":78,"newThisUpdate":false},"13":{"motherPriority":true,"total":248,"motherPriorityFirst":36,"motherPriorityGeneral":16,"firstPriority":72,"newThisUpdate":true},"14":{"motherPriority":true,"total":350,"motherPriorityFirst":84,"motherPriorityGeneral":30,"firstPriority":79,"newThisUpdate":false},"15":{"motherPriority":true,"total":329,"motherPriorityFirst":136,"motherPriorityGeneral":25,"firstPriority":95,"newThisUpdate":false},"18":{"motherPriority":true,"total":247,"motherPriorityFirst":17,"motherPriorityGeneral":57,"firstPriority":23,"newThisUpdate":true},"23":{"motherPriority":true,"total":225,"motherPriorityFirst":10,"motherPriorityGeneral":38,"firstPriority":14,"newThisUpdate":true},"27":{"motherPriority":true,"total":361,"motherPriorityFirst":20,"motherPriorityGeneral":25,"firstPriority":87,"newThisUpdate":false},"33":{"motherPriority":true,"total":398,"motherPriorityFirst":81,"motherPriorityGeneral":7,"firstPriority":131,"newThisUpdate":false},"36":{"motherPriority":true,"total":342,"motherPriorityFirst":44,"motherPriorityGeneral":59,"firstPriority":46,"newThisUpdate":false},"40":{"motherPriority":true,"total":217,"motherPriorityFirst":10,"motherPriorityGeneral":49,"firstPriority":23,"newThisUpdate":true},"47":{"motherPriority":true,"total":239,"motherPriorityFirst":28,"motherPriorityGeneral":5,"firstPriority":90,"newThisUpdate":true},"48":{"motherPriority":true,"total":615,"motherPriorityFirst":15,"motherPriorityGeneral":17,"firstPriority":274,"newThisUpdate":false},"49":{"motherPriority":true,"total":449,"motherPriorityFirst":116,"motherPriorityGeneral":27,"firstPriority":130,"newThisUpdate":false},"50":{"motherPriority":true,"total":410,"motherPriorityFirst":80,"motherPriorityGeneral":17,"firstPriority":156,"newThisUpdate":false},"51":{"motherPriority":true,"total":441,"motherPriorityFirst":116,"motherPriorityGeneral":7,"firstPriority":205,"newThisUpdate":false},"54":{"motherPriority":true,"total":279,"motherPriorityFirst":52,"motherPriorityGeneral":35,"firstPriority":67,"newThisUpdate":true},"57":{"motherPriority":true,"total":214,"motherPriorityFirst":61,"motherPriorityGeneral":26,"firstPriority":31,"newThisUpdate":true},"58":{"motherPriority":true,"total":299,"motherPriorityFirst":55,"motherPriorityGeneral":50,"firstPriority":56,"newThisUpdate":true},"65":{"motherPriority":true,"total":390,"motherPriorityFirst":51,"motherPriorityGeneral":37,"firstPriority":112,"newThisUpdate":false},"69":{"motherPriority":true,"total":388,"motherPriorityFirst":25,"motherPriorityGeneral":75,"firstPriority":50,"newThisUpdate":false},"70":{"motherPriority":true,"total":372,"motherPriorityFirst":29,"motherPriorityGeneral":30,"firstPriority":70,"newThisUpdate":false},"71":{"motherPriority":true,"total":300,"motherPriorityFirst":12,"motherPriorityGeneral":24,"firstPriority":98,"newThisUpdate":true},"73":{"motherPriority":true,"total":318,"motherPriorityFirst":9,"motherPriorityGeneral":35,"firstPriority":54,"newThisUpdate":true},"75":{"motherPriority":true,"total":289,"motherPriorityFirst":28,"motherPriorityGeneral":30,"firstPriority":66,"newThisUpdate":true},"76":{"motherPriority":true,"total":256,"motherPriorityFirst":53,"motherPriorityGeneral":82,"firstPriority":24,"newThisUpdate":true},"81":{"motherPriority":true,"total":561,"motherPriorityFirst":111,"motherPriorityGeneral":28,"firstPriority":214,"newThisUpdate":false},"83":{"motherPriority":true,"total":243,"motherPriorityFirst":55,"motherPriorityGeneral":7,"firstPriority":55,"newThisUpdate":true},"84":{"motherPriority":true,"total":317,"motherPriorityFirst":21,"motherPriorityGeneral":22,"firstPriority":60,"newThisUpdate":true},"85":{"motherPriority":true,"total":231,"motherPriorityFirst":9,"motherPriorityGeneral":26,"firstPriority":39,"newThisUpdate":true},"3":{"motherPriority":false,"total":288,"firstPriority":142,"newThisUpdate":false},"16":{"motherPriority":false,"total":302,"firstPriority":75,"newThisUpdate":true},"21":{"motherPriority":false,"total":320,"firstPriority":142,"newThisUpdate":false},"42":{"motherPriority":false,"total":291,"firstPriority":81,"newThisUpdate":true},"45":{"motherPriority":false,"total":236,"firstPriority":106,"newThisUpdate":true},"52":{"motherPriority":false,"total":242,"firstPriority":119,"newThisUpdate":true},"53":{"motherPriority":false,"total":329,"firstPriority":204,"newThisUpdate":false},"59":{"motherPriority":false,"total":313,"firstPriority":78,"newThisUpdate":false},"60":{"motherPriority":false,"total":302,"firstPriority":86,"newThisUpdate":true},"63":{"motherPriority":false,"total":299,"firstPriority":69,"newThisUpdate":true},"78":{"motherPriority":false,"total":390,"firstPriority":92,"newThisUpdate":false}};
  window.APPLICATION_STATUS_20260904 = STATUS;

  const PROGRESS = 0.253;
  const FINAL_MULTIPLIER = 1 / PROGRESS; // 3.952569...
  const TOTAL_SHARES = 400;
  const MOTHER_POOL = 200;

  const META = {
    label: '申込状況・最終見込',
    round: '中間発表②',
    asOf: '9/4 17時',
    progress: '前年比約25.3%時点',
    threshold: '掲載基準：総申込200口以上（地方入厩予定馬は50口以上）'
  };

  const clamp01 = x => Math.max(0, Math.min(1, x));
  const est = x => Math.round(Number(x || 0) * FINAL_MULTIPLIER);
  const pct = x => {
    if (x == null || !Number.isFinite(x)) return '—';
    if (x >= 0.9995) return '100%';
    if (x <= 0.0005) return '0%';
    return (x * 100).toFixed(x < 0.1 ? 1 : 0) + '%';
  };

  // Coarse category-average simulation of the official 400-share / mother-priority max-200 framework.
  // Within-category ×2 / ×1 / ×なし and delay-history ranks are unknown in the intermediate release,
  // so each coarse category is treated proportionally at the point where a lottery is required.
  function estimateLottery(d) {
    const total = est(d.total);
    const first = est(d.firstPriority);
    if (!d.motherPriority) {
      const general = Math.max(0, total - first);
      const firstP = first > 0 ? clamp01(TOTAL_SHARES / first) : 1;
      const firstWinners = Math.min(TOTAL_SHARES, first);
      const remain = Math.max(0, TOTAL_SHARES - firstWinners);
      const generalP = general > 0 ? clamp01(remain / general) : 1;
      return {
        finalTotal: total,
        projected: { first, general },
        rates: { first: firstP, general: generalP, mpFirst: null, mpGeneral: null }
      };
    }

    const mpFirst = est(d.motherPriorityFirst);
    const mpGeneral = est(d.motherPriorityGeneral);
    const general = Math.max(0, total - mpFirst - mpGeneral - first);

    // Stage 1: mother-priority pool (max 200).
    const mpFirstP1 = mpFirst > 0 ? clamp01(MOTHER_POOL / mpFirst) : 1;
    const mpFirstWinners = Math.min(MOTHER_POOL, mpFirst);
    const motherRemain = Math.max(0, MOTHER_POOL - mpFirstWinners);
    const mpGeneralP1 = mpGeneral > 0 ? clamp01(motherRemain / mpGeneral) : 1;
    const mpGeneralWinners = Math.min(motherRemain, mpGeneral);
    const motherWinners = mpFirstWinners + mpGeneralWinners;

    // Mother-priority losers return to the normal priority ladder.
    const mpFirstLosers = Math.max(0, mpFirst - mpFirstWinners);
    const mpGeneralLosers = Math.max(0, mpGeneral - mpGeneralWinners);
    const regularSeats = Math.max(0, TOTAL_SHARES - motherWinners);

    // Stage 2a: first-priority applicants (ordinary + mother-priority first losers).
    const firstCandidates = first + mpFirstLosers;
    const firstP2 = firstCandidates > 0 ? clamp01(regularSeats / firstCandidates) : 1;
    const firstWinners = Math.min(regularSeats, firstCandidates);
    const afterFirst = Math.max(0, regularSeats - firstWinners);

    // Stage 2b: general applicants (ordinary + mother-priority general losers).
    const generalCandidates = general + mpGeneralLosers;
    const generalP2 = generalCandidates > 0 ? clamp01(afterFirst / generalCandidates) : 1;

    // Eventual chance for a mother-priority applicant includes the fallback stage.
    const mpFirstFinal = mpFirstP1 + (1 - mpFirstP1) * firstP2;
    const mpGeneralFinal = mpGeneralP1 + (1 - mpGeneralP1) * generalP2;

    return {
      finalTotal: total,
      projected: { first, general, mpFirst, mpGeneral },
      rates: {
        first: firstP2,
        general: generalP2,
        mpFirst: clamp01(mpFirstFinal),
        mpGeneral: clamp01(mpGeneralFinal)
      }
    };
  }

  function injectStyle() {
    if (document.getElementById('applicationStatusStyle')) return;
    const style = document.createElement('style');
    style.id = 'applicationStatusStyle';
    style.textContent = `
      .application-status{margin:0 11px 9px;background:#fff8ee;border:1px solid #ead7bc;border-radius:12px;padding:9px 10px}
      .application-status-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:7px}
      .application-status-title{font-size:12px;font-weight:950;color:#563a15}
      .application-status-date{font-size:10px;font-weight:850;color:#8c704b;white-space:nowrap}
      .application-status-badges{display:flex;flex-wrap:wrap;gap:5px;margin:-1px 0 7px}
      .application-status-badge{display:inline-block;border-radius:999px;padding:3px 7px;font-size:10px;font-weight:900;background:#f2eadf;color:#6d5636}
      .application-status-badge.new{background:#fff0f0;color:#c22b2b;border:1px solid #f1baba}
      .application-status-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
      .application-status-kpi{background:#fff;border:1px solid #eadfce;border-radius:10px;padding:7px 5px;text-align:center;min-width:0}
      .application-status-kpi .v{font-size:20px;font-weight:950;line-height:1.05;font-variant-numeric:tabular-nums;color:#2c241a}
      .application-status-kpi .l{font-size:9px;color:#786b5b;margin-top:3px;line-height:1.25}
      .application-status-subtitle{font-size:10px;font-weight:950;color:#6a4b23;margin:10px 0 6px}
      .application-status-projection{display:flex;align-items:baseline;justify-content:space-between;gap:8px;background:#fff3dc;border:1px solid #ebc98a;border-radius:10px;padding:8px 9px;margin-top:7px}
      .application-status-projection-label{font-size:10px;font-weight:900;color:#765b2b}
      .application-status-projection-value{font-size:23px;font-weight:1000;line-height:1;color:#8a4d00;font-variant-numeric:tabular-nums}
      .application-status-projection-unit{font-size:10px;font-weight:900;margin-left:2px}
      .lottery-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
      .lottery-card{background:#fff;border:1px solid #e4ded4;border-radius:10px;padding:7px 6px;min-width:0}
      .application-status-lottery-name{font-size:9px;font-weight:900;line-height:1.25;color:#665c50;min-height:22px}
      .application-status-lottery-rate{font-size:21px;font-weight:1000;line-height:1.05;margin-top:2px;font-variant-numeric:tabular-nums}
      .application-status-lottery-count{font-size:8px;color:#948777;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .application-status-lottery-name,.application-status-lottery-rate,.application-status-lottery-count{position:static!important;float:none!important;transform:none!important;writing-mode:horizontal-tb!important;white-space:normal}
      .lottery-card.safe .application-status-lottery-rate{color:#19713a}
      .lottery-card.mid .application-status-lottery-rate{color:#a36500}
      .lottery-card.hard .application-status-lottery-rate{color:#bb2929}
      .lottery-card.na .application-status-lottery-rate{color:#9b9389}
      .application-status-note{font-size:9px;line-height:1.45;color:#81725e;margin-top:7px}
      .application-status-warning{font-size:9px;line-height:1.45;color:#9a5a12;background:#fff6e7;border-radius:8px;padding:6px 7px;margin-top:7px}
      .application-status-unlisted{background:#fff;border:1px dashed #d8cbb9;border-radius:10px;padding:9px;font-size:11px;font-weight:850;color:#6c6256;line-height:1.5}
      @media(min-width:650px){.application-status-kpi .v{font-size:21px}}
    `;
    document.head.appendChild(style);
  }

  function injectPanel() {
    if (document.getElementById('applicationStatus')) return;
    const family = document.querySelector('#sheet .family');
    if (!family) return;
    const panel = document.createElement('div');
    panel.id = 'applicationStatus';
    panel.className = 'application-status';
    panel.innerHTML = `
      <div class="application-status-head">
        <div class="application-status-title">${META.label}</div>
        <div class="application-status-date">${META.round} / ${META.asOf}</div>
      </div>
      <div id="applicationStatusBody"></div>
    `;
    family.insertAdjacentElement('afterend', panel);
  }

  function currentHorseNo() {
    const title = document.getElementById('stitle');
    const horses = window.HORSES || [];
    if (!title || !horses.length) return null;
    const name = title.textContent.trim().replace(/^●/, '').trim();
    const horse = horses.find(h => String(h.name).trim() === name);
    return horse ? String(horse.no) : null;
  }

  function kpi(value, label) {
    return `<div class="application-status-kpi"><div class="v">${value}</div><div class="l">${label}</div></div>`;
  }

  function rateClass(p) {
    if (p == null) return 'na';
    if (p >= 0.8) return 'safe';
    if (p >= 0.4) return 'mid';
    return 'hard';
  }

  function lotteryCard(name, p, countText) {
    return `<div class="lottery-card ${rateClass(p)}">
      <div class="application-status-lottery-name">${name}</div>
      <div class="application-status-lottery-rate">${pct(p)}</div>
      <div class="application-status-lottery-count">${countText || ''}</div>
    </div>`;
  }

  function render() {
    const body = document.getElementById('applicationStatusBody');
    if (!body) return;
    const no = currentHorseNo();
    if (!no) {
      body.innerHTML = '';
      return;
    }
    const d = STATUS[no];

    if (!d) {
      body.innerHTML = `
        <div class="application-status-badges">
          <span class="application-status-badge">中間発表 掲載対象外</span>
        </div>
        <div class="application-status-unlisted">
          この中間発表には掲載されていないため、現時点の実数から最終申込数・当選率を計算できません。
        </div>
        <div class="application-status-note">${META.progress} ／ ${META.threshold}</div>
      `;
      return;
    }

    const e = estimateLottery(d);
    const badges = [
      `<span class="application-status-badge">${d.motherPriority ? '母馬優先対象' : '母馬優先非対象'}</span>`,
      d.newThisUpdate ? `<span class="application-status-badge new">今回ランクイン</span>` : ''
    ].join('');

    let grid = kpi(d.total, '現在 総申込');
    grid += kpi(d.firstPriority, '現在 最優先');
    if (d.motherPriority) {
      grid += kpi(d.motherPriorityFirst, '現在 母優先＋最優先');
      grid += kpi(d.motherPriorityGeneral, '現在 母優先＋一般');
    }

    let lottery = '';
    if (d.motherPriority) {
      lottery += lotteryCard('母優先＋最優先', e.rates.mpFirst, `最終見込 ${e.projected.mpFirst}口`);
      lottery += lotteryCard('母優先＋一般', e.rates.mpGeneral, `最終見込 ${e.projected.mpGeneral}口`);
      lottery += lotteryCard('最優先', e.rates.first, `最終見込 ${e.projected.first}口`);
      lottery += lotteryCard('一般', e.rates.general, `最終見込 ${e.projected.general}口`);
    } else {
      lottery += lotteryCard('最優先', e.rates.first, `最終見込 ${e.projected.first}口`);
      lottery += lotteryCard('一般', e.rates.general, `最終見込 ${e.projected.general}口`);
    }

    body.innerHTML = `
      <div class="application-status-badges">${badges}</div>
      <div class="application-status-grid">${grid}</div>

      <div class="application-status-projection">
        <div class="application-status-projection-label">25.3% → 最終申込見込<br><span style="font-weight:700;font-size:9px">現在 × ${FINAL_MULTIPLIER.toFixed(2)}</span></div>
        <div><span class="application-status-projection-value">${e.finalTotal.toLocaleString('ja-JP')}</span><span class="application-status-projection-unit">口</span></div>
      </div>

      <div class="application-status-subtitle">概算当選率</div>
      <div class="lottery-grid">${lottery}</div>

      <div class="application-status-warning">
        当選率は「現時点の構成比が最終まで同じ」と仮定した概算です。
        ×2・×1・×なし、支払遅延歴による優先順位の内訳は中間発表では不明なため反映していません。
        母馬優先は最大200口、全体400口の優先順を粗いカテゴリ単位で計算しています。
      </div>
      <div class="application-status-note">${META.progress} ／ 赤表示は今回ランクイン ／ ${META.threshold}</div>
    `;
  }

  function init() {
    injectStyle();
    injectPanel();
    render();

    const title = document.getElementById('stitle');
    if (title) {
      new MutationObserver(render).observe(title, {childList:true, subtree:true, characterData:true});
    }
    const sheet = document.getElementById('sheet');
    if (sheet) {
      new MutationObserver(() => {
        if (sheet.classList.contains('open')) render();
      }).observe(sheet, {attributes:true, attributeFilter:['class']});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
