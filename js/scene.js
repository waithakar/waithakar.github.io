/*
  Crane bay drawing. Builds the shop elevation (wall, columns, bridge girder,
  trolley, hook block, and one machine per station) as an SVG string.
  Machine drawings use local coordinates: x is centered on the station,
  y = 0 is the floor, negative y is up. "top" is the highest point, used to
  land the hook just above the machine.
*/
(function () {
  'use strict';

  var M = {
    gantry: { top: -112, svg:
      '<path d="M-46 0V-104M46 0V-104M-54 0h16M38 0h16"/>' +
      '<rect class="s" x="-54" y="-112" width="108" height="10"/>' +
      '<rect class="s" x="-8" y="-102" width="16" height="10"/>' +
      '<path d="M0 -92V-70"/>' +
      '<rect class="s" x="-26" y="-70" width="52" height="62"/>' +
      '<path d="M-26 -49H26M-26 -29H26M-9 -70V-8M9 -70V-8"/>' },

    hook: { top: -110, svg:
      '<rect class="s" x="-44" y="-10" width="88" height="10"/>' +
      '<path d="M-34 -10V-110H24V-98"/>' +
      '<rect class="s" x="16" y="-98" width="16" height="12"/>' +
      '<path class="thick" d="M24 -86v8a13 13 0 1 1 -13 13"/>' +
      '<path d="M17 -53V-40"/>' +
      '<rect class="s" x="2" y="-40" width="30" height="30"/>' },

    gearbox: { top: -100, svg:
      '<rect class="s" x="-48" y="-10" width="96" height="10"/>' +
      '<rect class="s" x="-40" y="-76" width="80" height="66" rx="5"/>' +
      '<rect class="s" x="-14" y="-100" width="28" height="24" rx="3"/>' +
      '<path d="M-14 -92H14M-14 -84H14"/>' +
      '<circle cx="0" cy="-43" r="24" stroke-dasharray="3.5 2.5" stroke-width="3"/>' +
      '<g class="spin"><circle cx="0" cy="-43" r="6"/>' +
      '<circle cx="0" cy="-57" r="7" stroke-dasharray="2.5 2"/>' +
      '<circle cx="12.1" cy="-36" r="7" stroke-dasharray="2.5 2"/>' +
      '<circle cx="-12.1" cy="-36" r="7" stroke-dasharray="2.5 2"/></g>' },

    mill: { top: -124, svg:
      '<rect class="s" x="-40" y="-10" width="80" height="10"/>' +
      '<rect class="s" x="8" y="-110" width="22" height="100"/>' +
      '<path d="M-26 -34V-10M4 -34V-10"/>' +
      '<rect class="s" x="-30" y="-54" width="38" height="20"/>' +
      '<rect class="s" x="-46" y="-62" width="72" height="8"/>' +
      '<rect class="s" x="-26" y="-74" width="20" height="12"/>' +
      '<rect class="s" x="-28" y="-124" width="58" height="26" rx="3"/>' +
      '<path class="thick" d="M-16 -98V-80"/>' },

    printer: { top: -96, svg:
      '<rect class="s" x="-40" y="-10" width="80" height="10"/>' +
      '<rect class="s" x="-36" y="-92" width="72" height="82" rx="3"/>' +
      '<path d="M-36 -74H36M-28 -18H28"/>' +
      '<rect class="s" x="-8" y="-80" width="16" height="12"/>' +
      '<path d="M0 -68V-62"/>' +
      '<rect class="s" x="-14" y="-30" width="28" height="12"/>' +
      '<path d="M58 0V-58M50 0H66"/>' +
      '<circle class="s" cx="58" cy="-64" r="6"/>' +
      '<path class="wave" d="M46 -72a10 10 0 0 0 0 16M41 -77a17 17 0 0 0 0 26"/>' },

    flume: { top: -82, svg:
      '<path d="M-50 0V-40M50 0V-40M-50 -20H50"/>' +
      '<rect class="s" x="-62" y="-82" width="124" height="42"/>' +
      '<path d="M-62 -70C-47 -74 -37 -66 -22 -70S3 -74 18 -70S43 -66 62 -70"/>' +
      '<path d="M-6 -40a12 12 0 0 1 24 0"/>' +
      '<path class="wave" d="M-58 -56C-32 -58 -12 -62 4 -60S38 -52 58 -54" stroke-dasharray="4 3"/>' },

    bench: { top: -92, svg:
      '<rect class="s" x="-52" y="-50" width="104" height="6"/>' +
      '<path d="M-46 -44V0M46 -44V0M-46 -16H46"/>' +
      '<rect class="s" x="-36" y="-88" width="14" height="28" rx="2"/>' +
      '<circle class="s" cx="-29" cy="-55" r="5"/>' +
      '<path d="M-29 -88V-92"/>' +
      '<g class="spin"><circle cx="18" cy="-72" r="16"/><path d="M18 -88V-56M2 -72H34"/></g>' +
      '<path d="M18 -56V-50"/>' },

    desk: { top: -92, svg:
      '<rect class="s" x="-48" y="-44" width="96" height="6"/>' +
      '<path d="M-42 -38V0M42 -38V0"/>' +
      '<rect class="s" x="-30" y="-58" width="46" height="14"/>' +
      '<rect class="s" x="-26" y="-70" width="40" height="12"/>' +
      '<path class="s" d="M-30 -80L-6 -90L18 -80L-6 -70Z"/>' +
      '<path d="M14 -81V-68"/>' },

    toolboard: { top: -122, svg:
      '<rect class="s" x="-50" y="-122" width="100" height="80"/>' +
      '<circle cx="-34" cy="-108" r="5"/><path class="thick" d="M-30 -104L-14 -84"/>' +
      '<path d="M-2 -112V-58M-2 -112H12M-2 -100H8"/>' +
      '<rect class="s" x="22" y="-114" width="8" height="16" rx="2"/><path d="M26 -98V-70"/>' +
      '<rect class="s" x="-50" y="-38" width="100" height="6"/>' +
      '<path d="M-44 -32V0M44 -32V0"/>' },

    locker: { top: -112, svg:
      '<rect class="s" x="-46" y="-112" width="40" height="112"/>' +
      '<path d="M-38 -104h24M-38 -98h24M-38 -92h24M-12 -64v12"/>' +
      '<rect class="s" x="8" y="-100" width="32" height="24" rx="2"/>' +
      '<path d="M24 -94v12M18 -88h12"/>' +
      '<path d="M6 -26h40M10 -26V0M42 -26V0"/>' +
      '<rect class="s" x="12" y="-60" width="28" height="34" rx="2"/>' +
      '<rect class="s" x="20" y="-63" width="12" height="6" rx="2"/>' +
      '<path d="M17 -48h18M17 -42h18M17 -36h11"/>' },

    door: { top: -124, svg:
      '<path d="M-52 0V-124H52V0"/>' +
      '<rect class="glow" x="-46" y="-40" width="92" height="40"/>' +
      '<rect class="s" x="-46" y="-120" width="92" height="80"/>' +
      '<path d="M-46 -108H46M-46 -96H46M-46 -84H46M-46 -72H46M-46 -60H46M-46 -48H46M-10 -44h20"/>' },

    crate: { top: -70, svg:
      '<rect class="s" x="-36" y="-70" width="72" height="70"/>' +
      '<path d="M-36 -62H36M-36 -8H36M-30 -62L30 -8"/>' }
  };

  function machine(name) { return M[name] || M.crate; }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function build(stations) {
    var S = 150, PAD = 130, H = 440, F = 368, n = stations.length;
    var xs = stations.map(function (_, i) { return PAD + i * S; });
    var W = PAD * 2 + (n - 1) * S;
    var tops = stations.map(function (s) { return machine(s.machine).top; });
    var x0 = 24, x1 = W - 24, gy = 54, gh = 26;

    var wall = '';
    for (var x = 12; x < W; x += 24) wall += 'M' + x + ' ' + (gy - 4) + 'V' + F;

    var cols = '';
    for (var c = 1; c < n; c += 2) {
      var cx = PAD - S / 2 + c * S;
      cols += '<path d="M' + (cx - 7) + ' 26V' + F + 'M' + (cx + 7) + ' 26V' + F + 'M' + (cx - 11) + ' 26H' + (cx + 11) + '"/>' +
        '<rect x="' + (cx - 15) + '" y="' + (F - 6) + '" width="30" height="6"/>';
    }

    var truss = 'M' + (x0 + 40) + ' ' + (gy + gh - 2);
    for (var t = x0 + 40; t < x1 - 66; t += 26) truss += 'L' + (t + 13) + ' ' + (gy + 2) + 'L' + (t + 26) + ' ' + (gy + gh - 2);

    function ibeam(cx) {
      return '<path class="ibeam" d="M' + (cx - 16) + ' 30h32v5h-13v12h13v5h-32v-5h13v-12h-13z"/>';
    }

    var machines = stations.map(function (s, i) {
      var m = machine(s.machine);
      return '<g class="mach" data-i="' + i + '" tabindex="0" role="button" aria-label="Station ' + (i + 1) + ', ' + esc(s.station) + '. Lower the hook here" transform="translate(' + xs[i] + ' ' + F + ')">' +
        '<rect class="hit" x="-68" y="' + (m.top - 14) + '" width="136" height="' + (-m.top + 72) + '" rx="6"/>' +
        m.svg +
        '<text class="st-name" x="0" y="34" text-anchor="middle">' + esc(s.station) + '</text>' +
        (s.tag ? '<text class="st-tag" x="0" y="53" text-anchor="middle">' + esc(s.tag) + '</text>' : '') +
        '</g>';
    }).join('');

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Machine shop elevation with an overhead crane above ' + n + ' stations">' +
      '<defs><pattern id="haz" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect width="6" height="12" class="haz-a"/><rect x="6" width="6" height="12" class="haz-b"/></pattern></defs>' +
      '<path class="wall" d="' + wall + '"/>' +
      '<g class="cols">' + cols + '</g>' +
      '<polygon id="cone" class="cone" points="0,0 0,0 0,0"/>' +
      '<ellipse id="pool" class="cone" cx="0" cy="' + F + '" rx="92" ry="7"/>' +
      '<line class="floor" x1="0" y1="' + F + '" x2="' + W + '" y2="' + F + '"/>' +
      '<line class="aisle" x1="0" y1="' + (F + 7) + '" x2="' + W + '" y2="' + (F + 7) + '"/>' +
      machines +
      '<g class="crane">' +
      ibeam(x0 + 18) + ibeam(x1 - 18) +
      '<rect class="s" x="' + x0 + '" y="' + gy + '" width="' + (x1 - x0) + '" height="' + gh + '"/>' +
      '<path class="truss" d="' + truss + '"/>' +
      '<rect x="' + x0 + '" y="' + gy + '" width="36" height="' + gh + '" fill="url(#haz)"/>' +
      '<rect x="' + (x1 - 36) + '" y="' + gy + '" width="36" height="' + gh + '" fill="url(#haz)"/>' +
      '<g id="trolley">' +
      '<circle class="s" cx="-30" cy="85" r="5"/><circle class="s" cx="22" cy="85" r="5"/>' +
      '<rect class="paint" x="-46" y="90" width="80" height="26" rx="2"/>' +
      '<rect class="s" x="-42" y="94" width="16" height="18"/>' +
      '<path d="M-42 99h16M-42 103h16M-42 107h16"/>' +
      '<rect class="s" x="-24" y="96" width="10" height="14"/>' +
      '<circle id="drum" class="s drum" cx="2" cy="103" r="10"/>' +
      '<path id="rope" class="rope" d=""/>' +
      '<g id="hookblk">' +
      '<rect class="paint" x="-12" y="0" width="28" height="24" rx="3"/>' +
      '<circle class="s" cx="2" cy="10" r="7"/>' +
      '<path d="M2 24V34"/>' +
      '<path class="thick" d="M2 34v8a13 13 0 1 1 -13 13"/>' +
      '</g></g></g></svg>';

    return { svg: svg, W: W, H: H, F: F, S: S, xs: xs, tops: tops };
  }

  window.Bay = { build: build, machine: machine };
})();
