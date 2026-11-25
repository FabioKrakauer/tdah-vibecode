/*
 * Ícones e ilustrações em SVG desenhados para o projeto.
 * Traço fino, cantos arredondados, sem dependências externas.
 */
(function () {
  'use strict';

  var P = {
    star: '<path d="M12 3.2l2.5 5.3 5.8.7-4.3 4 1.1 5.8L12 16.2 6.9 19l1.1-5.8-4.3-4 5.8-.7z"/>',
    sparkle: '<path d="M12 3c.7 4.9 3.1 7.3 8 8-4.9.7-7.3 3.1-8 8-.7-4.9-3.1-7.3-8-8 4.9-.7 7.3-3.1 8-8z"/>',
    sparkles: '<path d="M10 4c.6 4.1 2.6 6.1 6.7 6.7-4.1.6-6.1 2.6-6.7 6.7-.6-4.1-2.6-6.1-6.7-6.7C7.4 10.1 9.4 8.1 10 4z"/><path d="M18 14.5c.3 1.9 1.2 2.8 3 3-1.8.3-2.7 1.2-3 3-.3-1.8-1.2-2.7-3-3 1.8-.2 2.7-1.1 3-3z"/>',
    mic: '<circle cx="12" cy="7" r="4.3"/><path d="M8.2 5.6h7.6M7.9 8.3h8.2M10.3 3.1v7.8M13.7 3.1v7.8"/><path d="M9.6 11.4h4.8l-.9 9.1a1.5 1.5 0 0 1-3 0z"/>',
    skate: '<path d="M5.2 4.6A1.6 1.6 0 0 1 6.8 3H10v6.4c3.6.3 6.9 1.8 8.6 3.7.9 1 .5 2.7-.9 2.7H6.2a1 1 0 0 1-1-1z"/><path d="M7.4 6h2.6M7.4 8.6h2.6"/><path d="M4.6 17.8h14.6"/><circle cx="7.6" cy="20" r="1.6"/><circle cx="16.4" cy="20" r="1.6"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    map: '<path d="M3.5 6.5l5.5-2.5 6 2.5 5.5-2.5v13.5L15 20l-6-2.5-5.5 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
    bulb: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    orbit: '<circle cx="12" cy="12" r="2.6"/><ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(-25 12 12)"/>',
    list: '<path d="M10 6.5h10M10 12h10M10 17.5h10"/><path d="M3.8 6.5l1.3 1.3 2.2-2.4M3.8 12l1.3 1.3 2.2-2.4M3.8 17.5l1.3 1.3 2.2-2.4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    steps: '<path d="M3.5 19.5h5v-5h5v-5h5v-5h2"/>',
    route: '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8"/>',
    folder: '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4l2 2h8a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18z"/>',
    chat: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A1.5 1.5 0 0 1 4 14.5z"/><path d="M12 13s-3-1.8-3-3.6a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8C15 11.2 12 13 12 13z"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    pause: '<circle cx="12" cy="12" r="8.5"/><path d="M10 9v6M14 9v6"/>',
    wind: '<path d="M3 9h10a3 3 0 1 0-3-3M3 15h14a3 3 0 1 1-3 3M3 12h7"/>',
    toolbox: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2M3 13h18M10.5 13v2h3v-2"/>',
    envelope: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    pencil: '<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/>',
    check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    refresh: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1L19.5 9M19.5 4.5V9H15"/><path d="M19.5 12a7.5 7.5 0 0 1-13 5.1L4.5 15M4.5 19.5V15H9"/>',
    print: '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14h10v6.5H7z"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M4.5 20h15"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    flag: '<path d="M5 21V4M5 4.5h11l-2 3.5 2 3.5H5"/>',
    eye: '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="3"/>',
    cloud: '<path d="M7.5 17.5a4.5 4.5 0 0 1-.7-8.95 5.5 5.5 0 0 1 10.6 1.1 3.9 3.9 0 0 1-.4 7.85z"/>',
    thought: '<path d="M8 14.5a3.8 3.8 0 0 1-.6-7.55A4.8 4.8 0 0 1 16.6 7.8a3.4 3.4 0 0 1-.3 6.7z"/><circle cx="7" cy="18" r="1.3"/><circle cx="4.6" cy="20.6" r=".8"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
    note: '<path d="M4.5 4.5h15v10l-5 5h-10z"/><path d="M19.5 14.5h-5v5"/>',
    phone: '<rect x="7" y="2.8" width="10" height="18.4" rx="2.2"/><path d="M11 18h2"/>',
    wall: '<rect x="3.5" y="5" width="17" height="14" rx="1.5"/><path d="M3.5 9.7h17M3.5 14.3h17M9 5v4.7M15 5v4.7M6 9.7v4.6M12 9.7v4.6M18 9.7v4.6M9 14.3V19M15 14.3V19"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
    music: '<path d="M9 18V5.5l10-2v12.5"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    feet: '<path d="M7.5 3.5c1.7 0 2.6 1.9 2.6 4.3 0 2.6-1 4.2-2.6 4.2S4.9 10.4 4.9 7.8c0-2.4.9-4.3 2.6-4.3z"/><path d="M5.6 14.5h3.8v1.8a1.9 1.9 0 0 1-3.8 0z"/><path d="M16.5 7.5c1.7 0 2.6 1.9 2.6 4.3 0 2.6-1 4.2-2.6 4.2s-2.6-1.6-2.6-4.2c0-2.4.9-4.3 2.6-4.3z"/><path d="M14.6 18.5h3.8v1.8a1.9 1.9 0 0 1-3.8 0z"/>',
    question: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 0 1 4.9.6c0 1.7-2.5 2.2-2.5 3.9"/><path d="M12 16.8h.01" stroke-width="2.2"/>',
    feather: '<path d="M20 4c-6 0-11 3.5-12.5 10L5 20"/><path d="M20 4c0 7-4 11.5-11 11.5"/><path d="M9 15.5l4-4"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11"/><path d="M12 9c-2-.2-4-1.3-4-3a1.7 1.7 0 0 1 3-1c.8.8 1 2.4 1 4 0-1.6.2-3.2 1-4a1.7 1.7 0 0 1 3 1c0 1.7-2 2.8-4 3z"/>',
    shuffle: '<path d="M4 7h3.5c3.5 0 5.5 10 9 10H20M17 14l3 3-3 3"/><path d="M4 17h3.5c1.2 0 2.2-1.1 3-2.6M13.6 9.6C14.4 8.1 15.4 7 16.5 7H20M17 4l3 3-3 3"/>'
  };

  var TONES = {
    lilac: { bg: '#efe8fc', ink: '#6a4fa3' },
    aqua: { bg: '#e0f4f0', ink: '#2f8a7e' },
    rose: { bg: '#fce9ef', ink: '#a8577a' },
    peach: { bg: '#fdeee3', ink: '#a8673f' },
    gold: { bg: '#f8efd8', ink: '#9b7a2c' },
    silver: { bg: '#eef0f4', ink: '#7d8295' }
  };

  function svg(name, cls) {
    var p = P[name] || P.sparkle;
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + '</svg>';
  }

  function inner(name, x, y, size, color, sw) {
    return '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.5) + '" stroke-linecap="round" stroke-linejoin="round">' + P[name] + '</svg>';
  }

  function sticker(name, tone, rot, cls) {
    return '<span class="sticker sticker--' + (tone || 'lilac') + (cls ? ' ' + cls : '') + '" style="--r:' + (rot || 0) + 'deg">' + svg(name) + '</span>';
  }

  /* --- Ilustrações --- */

  var SPARK_D = 'M0 -10C.7-3.5 3.5-.7 10 0 3.5.7.7 3.5 0 10-.7 3.5-3.5.7-10 0-3.5-.7-.7-3.5 0-10z';

  function spark(x, y, s, color, delay) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path class="twinkle" style="animation-delay:' + (delay || 0) + 's" d="' + SPARK_D + '" fill="' + color + '"/></g>';
  }

  function badge(name, x, y, r, tone, rot, delay) {
    var t = TONES[tone];
    var s = r * 1.08;
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><g class="float" style="animation-delay:' + (delay || 0) + 's">' +
      '<circle r="' + (r + 3) + '" fill="#fff" opacity=".9"/>' +
      '<circle r="' + r + '" fill="' + t.bg + '"/>' +
      '<circle r="' + (r - 6) + '" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 5"/>' +
      inner(name, -s / 2, -s / 2, s, t.ink, 1.4) + '</g></g>';
  }

  function node(x, y, label) {
    return '<g><circle cx="' + x + '" cy="' + y + '" r="20" fill="#fff" stroke="#8266bf" stroke-width="2"/>' +
      '<text x="' + x + '" y="' + (y + 6) + '" text-anchor="middle" font-size="16" font-weight="700" fill="#6a4fa3" font-family="system-ui, Segoe UI, sans-serif">' + label + '</text></g>';
  }

  function hero() {
    return '<svg class="art art--hero" viewBox="0 0 480 440" role="img" aria-label="Ilustração de um caminho com estrelas, um microfone e patins">' +
      '<defs><linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efe7fd"/><stop offset="1" stop-color="#ddf3ee"/></linearGradient></defs>' +
      '<path fill="url(#hg1)" d="M246 28c96-4 196 52 206 156 10 102-56 214-178 232C152 434 36 372 28 254 20 140 150 32 246 28z"/>' +
      '<circle cx="392" cy="356" r="52" fill="#fce9ef" opacity=".85"/>' +
      '<circle cx="70" cy="96" r="30" fill="#fdeee3" opacity=".9"/>' +
      '<path class="art-path" d="M74 362 C 160 340 112 262 204 246 S 336 214 300 146 S 352 66 418 72" fill="none" stroke="#9a82d4" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 11"/>' +
      node(74, 362, '1') + node(204, 246, '2') + node(300, 146, '3') +
      '<g transform="translate(418 72)"><circle r="24" fill="#fff" stroke="#c8a04a" stroke-width="2"/>' + inner('envelope', -12, -12, 24, '#9b7a2c', 1.6) + '</g>' +
      badge('mic', 392, 246, 44, 'aqua', 12, 0.4) +
      badge('skate', 120, 160, 42, 'lilac', -10, 1.2) +
      badge('star', 238, 362, 30, 'gold', 8, 2) +
      spark(160, 70, 1.3, '#c8a04a', 0) + spark(440, 170, 0.9, '#c8a04a', 1.1) + spark(56, 260, 0.8, '#b8bccb', 0.6) +
      spark(330, 330, 0.7, '#9a82d4', 1.8) + spark(260, 60, 0.6, '#b8bccb', 2.4) + spark(450, 300, 0.6, '#5bbcae', 0.9) +
      '<circle cx="356" cy="112" r="3" fill="#b8bccb"/><circle cx="150" cy="300" r="2.5" fill="#c8a04a"/><circle cx="200" cy="120" r="2" fill="#9a82d4"/>' +
      '</svg>';
  }

  function toolbox() {
    return '<svg class="art art--toolbox" viewBox="0 0 320 210" role="img" aria-label="Ilustração de uma caixa de ferramentas aberta">' +
      '<path d="M40 196h240" stroke="#e2d8f8" stroke-width="6" stroke-linecap="round"/>' +
      // itens saindo da caixa
      '<g transform="translate(92 34) rotate(-14)"><rect width="16" height="88" rx="3" fill="#f9d9c6"/><path d="M0 74h16" stroke="#fff" stroke-width="2"/><path d="M2 0l6-14 6 14z" fill="#a8673f" opacity=".6"/></g>' +
      '<g transform="translate(182 30) rotate(10)"><rect width="56" height="70" rx="6" fill="#fff" stroke="#9a82d4" stroke-width="2"/><path d="M10 18h36M10 30h36M10 42h24" stroke="#c9b8ef" stroke-width="3" stroke-linecap="round"/><path d="M0 8h56" stroke="#9a82d4" stroke-width="2"/></g>' +
      '<g transform="translate(140 18)"><path d="' + SPARK_D + '" transform="translate(10 10) scale(1.3)" fill="#c8a04a"/></g>' +
      '<g transform="translate(232 70) rotate(18)">' + inner('bell', 0, 0, 36, '#2f8a7e', 1.6) + '</g>' +
      // caixa
      '<rect x="56" y="96" width="208" height="96" rx="16" fill="#9a82d4"/>' +
      '<rect x="56" y="96" width="208" height="30" rx="12" fill="#8266bf"/>' +
      '<path d="M128 96V80a10 10 0 0 1 10-10h44a10 10 0 0 1 10 10v16" fill="none" stroke="#6a4fa3" stroke-width="7" stroke-linecap="round"/>' +
      '<rect x="146" y="118" width="28" height="18" rx="4" fill="#e6cd8e"/>' +
      '<circle cx="90" cy="160" r="12" fill="#a3ddd4" opacity=".9"/><circle cx="232" cy="164" r="8" fill="#f6cfdc"/>' +
      '<path d="' + SPARK_D + '" transform="translate(206 152) scale(.8)" fill="#fff" opacity=".8"/>' +
      '</svg>';
  }

  function constellation(done) {
    // done: [m1, m2, m3, final] booleans
    var pts = [[60, 150], [170, 70], [290, 120], [400, 50]];
    var icons = ['star', 'skate', 'mic', 'envelope'];
    var tones = ['lilac', 'aqua', 'rose', 'gold'];
    var lines = '';
    for (var i = 0; i < pts.length - 1; i++) {
      lines += '<line x1="' + pts[i][0] + '" y1="' + pts[i][1] + '" x2="' + pts[i + 1][0] + '" y2="' + pts[i + 1][1] + '" stroke="' + (done[i] && done[i + 1] ? '#c8a04a' : '#d9d2e8') + '" stroke-width="2" stroke-dasharray="' + (done[i] && done[i + 1] ? '0' : '3 7') + '" stroke-linecap="round"/>';
    }
    var nodes = pts.map(function (p, i) {
      return done[i] ? badge(icons[i], p[0], p[1], 30, tones[i], (i % 2 ? 8 : -8), i * 0.5)
        : '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><circle r="26" fill="none" stroke="#b8bccb" stroke-width="1.6" stroke-dasharray="3 5"/>' + inner(icons[i], -12, -12, 24, '#b8bccb', 1.4) + '</g>';
    }).join('');
    return '<svg class="art art--constellation" viewBox="0 0 460 200" role="img" aria-label="Constelação com os adesivos conquistados na jornada">' +
      lines + nodes +
      spark(120, 160, 0.7, '#c8a04a', 0.3) + spark(240, 40, 0.8, '#b8bccb', 1.2) + spark(350, 170, 0.6, '#9a82d4', 2) + spark(440, 130, 0.6, '#c8a04a', 0.8) +
      '</svg>';
  }

  function bigSticker(name, tone) {
    var t = TONES[tone] || TONES.lilac;
    return '<svg class="art art--sticker" viewBox="0 0 200 200" aria-hidden="true">' +
      '<g transform="translate(100 100)">' +
      '<circle r="86" fill="#fff"/>' +
      '<circle r="78" fill="' + t.bg + '"/>' +
      '<circle r="66" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="3 8"/>' +
      inner(name, -46, -46, 92, t.ink, 1.3) + '</g>' +
      spark(36, 40, 1.2, '#c8a04a', 0) + spark(170, 160, 0.9, '#c8a04a', 0.8) + spark(172, 34, 0.6, '#b8bccb', 1.6) +
      '</svg>';
  }

  window.Icons = {
    svg: svg,
    sticker: sticker,
    has: function (n) { return !!P[n]; }
  };

  window.Art = {
    hero: hero,
    toolbox: toolbox,
    constellation: constellation,
    bigSticker: bigSticker,
    spark: spark,
    SPARK_D: SPARK_D
  };
})();
