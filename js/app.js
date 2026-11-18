/*
  Builds the page from content.js and runs the crane.
  Pendant: West and East travel between stations, Lower opens the station under the hook,
  Raise goes back to the crane, Stop turns animation off. Arrow keys left and right also travel.
*/
(function () {
  'use strict';
  var D = window.SITE;
  if (!D || !window.Bay) return;

  var ST = D.stations.map(function (s, i) {
    if (!s.id) s.id = String(s.station || s.title || 'station' + i).toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (!s.station) s.station = s.title;
    return s;
  });
  var N = ST.length;
  var root = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var attr = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); };
  var clampI = function (i) { return Math.max(0, Math.min(N - 1, i)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* motion: respects the system setting, and the pendant Stop button */
  var rmq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var motion = !rmq.matches;
  root.dataset.motion = motion ? 'on' : 'off';

  /* lights */
  var lights = $('#lights');
  function setTheme(t) {
    root.dataset.theme = t;
    lights.setAttribute('aria-pressed', String(t === 'light'));
    var m = $('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'light' ? '#e7ebe9' : '#1a2129');
    try { localStorage.setItem('bay-theme', t); } catch (e) {}
  }
  setTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
  lights.addEventListener('click', function () { setTheme(root.dataset.theme === 'light' ? 'dark' : 'light'); });

  /* nameplate band */
  var btns = ['<a class="btn btn-main" href="mailto:' + attr(D.email) + '">Email me</a>'];
  (D.links || []).forEach(function (l) { btns.push('<a class="btn" href="' + attr(l.url) + '" rel="me">' + l.label + '</a>'); });
  if (D.resume) btns.push('<a class="btn" href="' + attr(D.resume) + '">Resume (PDF)</a>');
  $('#plate').innerHTML =
    '<div class="wrap plate-grid">' +
      '<div class="nameplate"><span class="rivet r1"></span><span class="rivet r2"></span><span class="rivet r3"></span><span class="rivet r4"></span>' +
        '<h1>' + D.name + '</h1>' +
        '<p class="role">' + (D.role || '') + '</p>' +
        (D.intro ? '<p class="intro">' + D.intro + '</p>' : '') +
        (D.goal ? '<p class="goal">' + D.goal + '</p>' : '') +
        '<div class="actions">' + btns.join('') + '</div>' +
      '</div>' +
      (D.facts && D.facts.length ? '<dl class="titleblock" aria-label="Summary">' + D.facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('') + '</dl>' : '') +
    '</div>';

  /* station sheets */
  function list(items) { return items && items.length ? '<ul>' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : ''; }
  function specTable(rows, label) {
    return rows && rows.length ? '<table class="spec" aria-label="' + attr(label) + '"><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table>' : '';
  }
  function figure(f) {
    var cap = f.caption ? '<figcaption>' + f.caption + '</figcaption>' : '';
    if (f.images) {
      return '<figure><div class="mat strip">' + f.images.map(function (im) {
        return '<img src="' + attr(im.src) + '" alt="' + attr(im.alt) + '" loading="lazy">';
      }).join('') + '</div>' + cap + '</figure>';
    }
    return '<figure' + (f.half ? ' class="half"' : '') + '><div class="mat"><img src="' + attr(f.src) + '" alt="' + attr(f.alt) + '" loading="lazy"></div>' + cap + '</figure>';
  }
  function mini(name) {
    var m = window.Bay.machine(name);
    return '<svg viewBox="-72 ' + (m.top - 8) + ' 144 ' + (-m.top + 16) + '" aria-hidden="true" focusable="false"><g class="mach">' + m.svg + '</g></svg>';
  }
  function scopeHTML() {
    return '<div class="scope" data-scope>' +
      '<div class="seg" role="group" aria-label="Infill setting">' +
        '<button type="button" data-mix="15" aria-pressed="true">15% infill</button>' +
        '<button type="button" data-mix="80" aria-pressed="false">80% infill</button>' +
      '</div>' +
      '<canvas aria-hidden="true"></canvas>' +
      '<p class="scope-read" aria-live="polite">Strongest bands: 80 to 125 Hz</p>' +
      '<p class="scope-note">An illustration of the finding, drawn from the band levels in the report. Not the raw recording.</p>' +
    '</div>';
  }

  function station(s, i) {
    var figs = s.figures && s.figures.length;
    var copy = (s.text || []).map(function (p) { return '<p>' + p + '</p>'; }).join('') +
      (s.listTitle ? '<h3>' + s.listTitle + '</h3>' : '') + list(s.list) +
      (s.note ? '<p class="note">' + s.note + '</p>' : '') +
      (figs ? specTable(s.specs, s.title + ', key numbers') : '');
    var side = (s.scope ? scopeHTML() : '') +
      (figs ? '<div class="figs">' + s.figures.map(figure).join('') + '</div>' : specTable(s.specs, s.title + ', key numbers')) +
      (s.placeholder ? '<p class="slot">' + s.placeholder + '</p>' : '');
    var body = (copy || side)
      ? '<div class="st-body' + (copy && side ? '' : ' solo') + '">' + (copy ? '<div class="copy">' + copy + '</div>' : '') + (side ? '<div class="side">' + side + '</div>' : '') + '</div>'
      : '';
    var extras = '';
    if (s.cards) {
      extras += '<div class="cards">' + s.cards.map(function (c) {
        return '<article class="card">' + (c.status ? '<p class="status">' + c.status + '</p>' : '') +
          (c.tag ? '<p class="tag">' + c.tag + '</p>' : '') + '<h3>' + c.title + '</h3>' + (c.text ? '<p>' + c.text + '</p>' : '') + list(c.list) + '</article>';
      }).join('') + '</div>';
    }
    if (s.entries) {
      extras += '<div class="entries">' + s.entries.map(function (e) {
        return '<div class="entry"><p class="when">' + (e.when || '') + '</p><div><h3>' + e.title + '</h3>' +
          (e.org ? '<p class="org">' + e.org + '</p>' : '') + (e.text ? '<p>' + e.text + '</p>' : '') + list(e.list) + '</div></div>';
      }).join('') + '</div>';
    }
    if (s.groups) {
      extras += '<div class="groups">' + s.groups.map(function (g) {
        return '<div class="group"><h3>' + g.title + '</h3><p>' + g.text + '</p></div>';
      }).join('') + '</div>';
    }
    if (s.contact) {
      extras += '<div class="contact"><a class="contact-mail" href="mailto:' + attr(D.email) + '">' + D.email + '</a>' +
        '<div class="contact-links">' + (D.links || []).map(function (l) { return '<a class="btn" href="' + attr(l.url) + '" rel="me">' + l.label + '</a>'; }).join('') +
        (D.resume ? '<a class="btn" href="' + attr(D.resume) + '">Resume (PDF)</a>' : '') + '</div></div>';
    }
    return '<section class="station" id="' + attr(s.id) + '" data-i="' + i + '" aria-labelledby="' + attr(s.id) + 'H">' +
      '<div class="wrap st-grid">' +
        '<div class="st-plate"><div class="st-mini">' + mini(s.machine) + '</div>' +
          '<p class="st-num">Station ' + (i + 1) + '</p>' +
          (s.tag ? '<p class="st-tag-p">' + s.tag + '</p>' : '') +
          (s.status ? '<p class="status">' + s.status + '</p>' : '') +
        '</div>' +
        '<div class="st-main"><h2 id="' + attr(s.id) + 'H" tabindex="-1">' + s.title + '</h2>' +
          (s.meta ? '<p class="st-meta">' + s.meta + '</p>' : '') +
          (s.tiles && s.tiles.length ? '<div class="tiles">' + s.tiles.map(function (t) { return '<div class="tile"><b>' + t[0] + '</b><span>' + t[1] + '</span></div>'; }).join('') + '</div>' : '') +
          body + extras +
        '</div>' +
      '</div></section>';
  }
  $('#stations').innerHTML = ST.map(station).join('');
  var secs = $$('#stations > .station');

  /* footer title block */
  $('#foot').innerHTML = '<div class="wrap"><dl class="foot-block" aria-label="Drawing title block">' +
    '<div><dt>Drawing</dt><dd>' + D.name + ', portfolio</dd></div>' +
    '<div><dt>Revision</dt><dd>' + (D.revision || 'A') + '</dd></div>' +
    '<div><dt>Scale</dt><dd>Not to scale</dd></div>' +
    '<div><dt>Sheet</dt><dd>1 of 1</dd></div></dl>' +
    (D.footnote ? '<p class="foot-note">' + D.footnote + '</p>' : '') + '</div>';

  /* header rail */
  var groups = [];
  ST.forEach(function (s, i) {
    var g = s.group || s.station, last = groups[groups.length - 1];
    if (!last || last.name !== g) groups.push({ name: g, start: i, end: i }); else last.end = i;
  });
  $('#railTrack').innerHTML =
    groups.map(function (g) {
      return '<button type="button" class="rt-group" data-i="' + g.start + '" style="left:' + (g.start / N * 100) + '%;width:' + ((g.end - g.start + 1) / N * 100) + '%">' + g.name + '</button>';
    }).join('') +
    '<div class="rt-girder" aria-hidden="true"></div>' +
    ST.map(function (s, i) {
      return '<button type="button" class="rt-tick" data-i="' + i + '" style="left:' + ((i + 0.5) / N * 100) + '%" aria-label="Station ' + (i + 1) + ', ' + attr(s.station) + '" title="' + attr(s.station) + '"></button>';
    }).join('') +
    '<div class="rt-trolley" aria-hidden="true"><span class="rt-rope"></span><span class="rt-hook"></span></div>';
  var rtTrolley = $('.rt-trolley'), rtRope = $('.rt-rope'), rtHook = $('.rt-hook'), rtGroups = $$('.rt-group');
  $$('.rt-group, .rt-tick').forEach(function (b) {
    b.addEventListener('click', function () { travelTo(+b.dataset.i, true); });
  });

  /* the bay */
  var B = window.Bay.build(ST);
  var bay = $('#bay'), stage = $('#bayStage');
  stage.innerHTML = B.svg;
  var svg = $('svg', stage), trolley = $('#trolley', stage), hookblk = $('#hookblk', stage), rope = $('#rope', stage),
      drum = $('#drum', stage), cone = $('#cone', stage), pool = $('#pool', stage), machs = $$('.mach', stage);
  var UP = 124;
  var downY = function (i) { return B.F + B.tops[i] - 74; };
  var M_PER = 50; // drawing units per metre for the readout

  var startHash = location.hash && ST.some(function (s) { return '#' + s.id === location.hash; });
  var cx = motion && !startHash ? -160 : B.xs[0], hy = UP, ti = 0, th = UP;
  var pend = !startHash, pick = false, lock = 0, reading = false;

  function go(i, lowerAfter, pickAfter) {
    ti = clampI(i); th = UP; pend = !!lowerAfter; pick = !!pickAfter;
  }
  function lowerHook(pickAfter) {
    pick = !!pickAfter;
    if (cx === B.xs[ti]) th = downY(ti); else pend = true;
  }
  function raiseHook() { th = UP; pend = false; pick = false; }

  function scrollToStation(i, focus) {
    var sec = secs[clampI(i)];
    if (!sec) return;
    lock = performance.now() + 1100;
    sec.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'start' });
    if (focus) { var h = $('h2', sec); if (h) h.focus({ preventScroll: true }); }
  }
  function travelTo(i, focus) {
    i = clampI(i);
    if (reading) { go(i, true, false); scrollToStation(i, focus); }
    else go(i, true, true);
  }

  machs.forEach(function (g) {
    var i = +g.dataset.i;
    g.addEventListener('click', function () { go(i, true, true); });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i, true, true); }
    });
  });

  /* pendant */
  var pendant = $('#pendant');
  $('#pdW').addEventListener('click', function () { travelTo(ti - 1); });
  $('#pdE').addEventListener('click', function () { travelTo(ti + 1); });
  $('#pdD').addEventListener('click', function () {
    if (reading) scrollToStation(ti, true); else lowerHook(true);
  });
  $('#pdU').addEventListener('click', function () {
    raiseHook();
    if (reading) { lock = performance.now() + 1100; bay.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'center' }); }
  });
  var stopBtn = $('#pdS');
  function stopUI() {
    root.dataset.motion = motion ? 'on' : 'off';
    stopBtn.setAttribute('aria-pressed', String(!motion));
    $('.t', stopBtn).textContent = motion ? 'Stop' : 'Reset';
    stopBtn.setAttribute('aria-label', motion ? 'Emergency stop, turns animation off' : 'Reset, turns animation back on');
  }
  stopUI();
  stopBtn.addEventListener('click', function () {
    motion = !motion;
    stopUI();
    if (scopes) scopes.forEach(function (sc) { sc.kick(); });
  });
  var tuck = $('#pdT');
  tuck.addEventListener('click', function () {
    var t = pendant.classList.toggle('tucked');
    document.body.classList.toggle('pd-tucked', t);
    tuck.setAttribute('aria-expanded', String(!t));
    tuck.textContent = t ? 'Show pendant' : 'Hide pendant';
  });

  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); travelTo(ti - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); travelTo(ti + 1); }
  });

  /* scroll keeps the crane over the section you are reading */
  function activeIndex() {
    var line = window.innerHeight * 0.4, a = -1;
    for (var i = 0; i < secs.length; i++) { if (secs[i].getBoundingClientRect().top <= line) a = i; }
    if (a >= 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) a = N - 1;
    return a;
  }
  var ticking = false;
  function syncScroll() {
    ticking = false;
    var a = activeIndex();
    reading = a >= 0;
    if (a >= 0 && performance.now() > lock && !pick && a !== ti) go(a, true, false);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(syncScroll); } }, { passive: true });

  /* camera keeps the trolley in view when the bay is wider than the screen */
  var scale = 1, bw = 0, sw = 0, bayVisible = true;
  function measure() {
    scale = bay.clientHeight / B.H; bw = bay.clientWidth; sw = B.W * scale;
    svg.style.width = sw + 'px';
  }
  measure();
  window.addEventListener('resize', measure);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { bayVisible = en[0].isIntersecting; }).observe(bay);
  }

  /* readouts */
  var pdNum = $('#pdNum'), pdName = $('#pdName'), pdState = $('#pdState'), bayRead = $('#bayRead');
  var shownI = -1, shownState = '', shownGroup = -1;

  function frame(ts) {
    var k = motion ? 0.11 : 1;
    if (Math.abs(th - hy) > 0.4) hy += (th - hy) * Math.min(1, k * 1.25); else hy = th;
    var tx = B.xs[ti];
    if (hy <= UP + 3) { if (Math.abs(tx - cx) > 0.5) cx += (tx - cx) * Math.min(1, k * 0.85); else cx = tx; }
    if (pend && cx === tx && hy <= UP + 3) { th = downY(ti); pend = false; }
    var landed = cx === tx && Math.abs(hy - downY(ti)) < 1;
    if (pick && landed) {
      pick = false;
      var target = ti;
      setTimeout(function () { scrollToStation(target, true); }, motion ? 260 : 0);
    }

    if (bayVisible) {
      trolley.setAttribute('transform', 'translate(' + cx.toFixed(1) + ' 0)');
      hookblk.setAttribute('transform', 'translate(0 ' + hy.toFixed(1) + ')');
      rope.setAttribute('d', 'M-2 113V' + (hy + 3).toFixed(1) + 'M6 113V' + (hy + 3).toFixed(1));
      drum.style.strokeDashoffset = (hy * 0.7).toFixed(1);
      cone.setAttribute('points', (cx - 6) + ',116 ' + (cx + 10) + ',116 ' + (cx + 96) + ',' + B.F + ' ' + (cx - 92) + ',' + B.F);
      pool.setAttribute('cx', cx + 2);
      for (var m = 0; m < machs.length; m++) machs[m].classList.toggle('on', m === ti && landed);
      var off = sw <= bw ? (bw - sw) / 2 : Math.max(bw - sw, Math.min(0, bw / 2 - cx * scale));
      svg.style.transform = 'translate3d(' + off.toFixed(1) + 'px,0,0)';
      if (bayRead) bayRead.textContent = 'Bridge ' + Math.max(0, cx / M_PER).toFixed(1) + ' m   Hook ' + Math.max(0, (hy - UP) / M_PER).toFixed(1) + ' m';
    }

    var p = (cx - B.xs[0]) / B.S;
    rtTrolley.style.left = Math.max(0, Math.min(100, (p + 0.5) / N * 100)) + '%';
    var drop = Math.max(0, Math.min(1, (hy - UP) / (downY(ti) - UP)));
    rtRope.style.height = (3 + drop * 9).toFixed(1) + 'px';
    rtHook.style.top = (9 + drop * 9).toFixed(1) + 'px';

    var state = cx !== tx ? 'Traveling' : (Math.abs(hy - th) > 1 ? (th > hy ? 'Lowering' : 'Raising') : (landed ? 'Hook down' : 'Hook up'));
    if (shownI !== ti) {
      shownI = ti;
      pdNum.textContent = 'Station ' + pad(ti + 1) + '/' + pad(N);
      pdName.textContent = ST[ti].station;
      var gi = -1;
      groups.forEach(function (g, j) { if (ti >= g.start && ti <= g.end) gi = j; });
      if (gi !== shownGroup) { shownGroup = gi; rtGroups.forEach(function (b, j) { b.classList.toggle('on', j === gi); }); }
    }
    if (state !== shownState) { shownState = state; pdState.textContent = state; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  syncScroll();

  /* scope: an illustration of the acoustic finding */
  var scopes = $$('[data-scope]').map(function (el) {
    var cv = $('canvas', el), ctx = cv.getContext('2d'), read = $('.scope-read', el), btn = $$('button', el);
    var FREQ = [100, 125, 315];
    var MIX = { 15: [1, 0.85, 0.22], 80: [0.72, 0.62, 1.15] };
    var READ = { 15: 'Strongest bands: 80 to 125 Hz', 80: 'Strongest band: 315 Hz' };
    var target = MIX[15].slice(), amp = target.slice(), visible = false, running = false, w = 0, h = 0;
    function size() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(ts) {
      if (!w) size();
      var settle = true;
      for (var j = 0; j < 3; j++) {
        var d = target[j] - amp[j];
        amp[j] += motion ? d * 0.08 : d;
        if (Math.abs(d) > 0.004) settle = false;
      }
      ctx.clearRect(0, 0, w, h);
      var plotW = w * 0.7, mid = h / 2;
      ctx.strokeStyle = 'rgba(201,210,216,0.09)'; ctx.lineWidth = 1;
      for (var gx = 0; gx <= 10; gx++) { var x = Math.round(gx * plotW / 10) + 0.5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (var gy = 0; gy <= 4; gy++) { var y = Math.round(gy * h / 4) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(plotW, y); ctx.stroke(); }
      var shift = motion ? (ts || 0) * 0.000012 : 0;
      ctx.strokeStyle = '#f2c230'; ctx.lineWidth = 1.6; ctx.beginPath();
      for (var px = 0; px <= plotW; px++) {
        var t = px / plotW * 0.04 + shift, v = 0;
        for (var f = 0; f < 3; f++) v += amp[f] * Math.sin(2 * Math.PI * FREQ[f] * t + f * 1.3);
        var yy = mid - v * h * 0.16;
        if (px === 0) ctx.moveTo(px, yy); else ctx.lineTo(px, yy);
      }
      ctx.stroke();
      var area = w - plotW - 24, bwid = area / 3 * 0.55, base = h - 22;
      ctx.font = '11px "B612 Mono", monospace'; ctx.textAlign = 'center';
      for (var b = 0; b < 3; b++) {
        var bx = plotW + 24 + area / 3 * b + (area / 3 - bwid) / 2, bh = amp[b] / 1.2 * (base - 8);
        ctx.fillStyle = b === 2 ? '#f2c230' : '#5d6b76';
        ctx.fillRect(bx, base - bh, bwid, bh);
        ctx.fillStyle = '#8e9aa4';
        ctx.fillText(FREQ[b], bx + bwid / 2, h - 6);
      }
      if (visible && (motion || !settle)) requestAnimationFrame(draw); else running = false;
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(draw); } }
    btn.forEach(function (b) {
      b.addEventListener('click', function () {
        var mx = b.dataset.mix;
        btn.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        target = MIX[mx].slice(); read.textContent = READ[mx]; kick();
      });
    });
    window.addEventListener('resize', function () { size(); kick(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }).observe(el);
    } else { visible = true; kick(); }
    return { kick: kick };
  });
})();
