/* =========================================================
   NÚCLEO — utilidades, estado, ícones, navegação, missões
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const pad2 = (n) => String(n).padStart(2, "0");
const A = {};
const FRAMED = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

/* ---------- Estado (apenas nesta aba do navegador) ---------- */
const STORE_KEY = "psicoed-tdah-v2";
const DEFAULT_STATE = () => ({ title: TITULO_PADRAO, m: {}, sound: true, guiaTab: "bastidores", todo: [], plan: { goal: "", steps: [] }, board: [], persona: { icon: "mic", cor: "roxo" } });
let S = load();
function load() { try { const r = sessionStorage.getItem(STORE_KEY); if (r) return Object.assign(DEFAULT_STATE(), JSON.parse(r)); } catch (e) {} return DEFAULT_STATE(); }
function save() { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {} }
function M(id) { if (!S.m[id]) S.m[id] = { step: 0, seen: { 0: true }, done: false, at: null, nota: "", d: {} }; return S.m[id]; }
const D = (id) => M(id).d;
const missionOf = (id) => MISSIONS.find((x) => x.id === id);
const MDATA = () => ({ bastidores: M1, grupo: M2, comigo: M3, laboratorio: M4, semana: M5, emocoes: M6, estrategias: M7, rider: M8 });
const doneCount = () => MISSIONS.filter((x) => S.m[x.id] && S.m[x.id].done).length;
const allDone = () => doneCount() === MISSIONS.length;
const started = (id) => !!(S.m[id] && !S.m[id].done && Object.keys(S.m[id].seen || {}).length > 1);

/* ---------- Ícones ---------- */
const ICONS = {
  brain: '<path d="M9.5 3.5a3 3 0 0 0-3 2.6A3 3 0 0 0 4 9.5a3 3 0 0 0 .6 4.6A3 3 0 0 0 7 18.5a2.8 2.8 0 0 0 5 1V5.2a2 2 0 0 0-2.5-1.7z"/><path d="M14.5 3.5a3 3 0 0 1 3 2.6A3 3 0 0 1 20 9.5a3 3 0 0 1-.6 4.6 3 3 0 0 1-2.4 4.4 2.8 2.8 0 0 1-5 1"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20.5 20.5-4.8-4.8"/>',
  cards: '<rect x="3.5" y="6" width="11" height="15" rx="2"/><path d="M8 3.5h10.5a2 2 0 0 1 2 2V18"/>',
  spark: '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z"/>',
  toolbox: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8.5 8V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V8M3 13h18"/>',
  mic: '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  trophy: '<path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z"/><path d="M7.5 6h-3a3 3 0 0 0 3 4M16.5 6h3a3 3 0 0 1-3 4M12 13.5V17M9.5 17h5v3.5h-5z"/>',
  note: '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  home: '<path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
  clipboard: '<rect x="5" y="4.5" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM8.5 11h7M8.5 15h5"/>',
  book: '<path d="M4 19V5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5 2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  bookopen: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5c-3.5-.5-6.5 0-8.5 1.5zM12 6.5V20"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
  chat: '<path d="M20.5 12a8 8 0 0 1-11.8 7l-4.2 1.2 1.2-4A8 8 0 1 1 20.5 12z"/>',
  spot: '<path d="M8 3h8l-1.5 5h-5z"/><path d="M9.5 8 4 21h16L14.5 8"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  pause: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
  shuffle: '<path d="M3 7h3.5c4.5 0 6.5 10 11 10H21M18 14l3 3-3 3M3 17h3.5c1.6 0 2.8-1.2 3.8-2.8M14 9.2C14.9 7.9 16 7 17.5 7H21M18 4l3 3-3 3"/>',
  timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V10M9.5 2.5h5M12 2.5V6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  sliders: '<path d="M6 3v6M6 13v8M12 3v10M12 17v4M18 3v3M18 10v11"/><circle cx="6" cy="11" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="18" cy="8" r="2"/>',
  skate: '<path d="M5 3.5h5v8l6 .5a4 4 0 0 1 4 4V17H5z"/><circle cx="8" cy="20" r="1.8"/><circle cx="17" cy="20" r="1.8"/>',
  stairs: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
  desk: '<path d="M3 10h18M5 10v10M19 10v10M14 10v5h5M8 10V6h5v4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  coffee: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5V6M12 3.5V6"/>',
  bulb: '<path d="M9 17.5h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  wind: '<path d="M3 8h10.5A2.5 2.5 0 1 0 11 5.5M3 12h15.5a2.5 2.5 0 1 1-2.5 2.5M3 16h8"/>',
  route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H16a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h7.5"/>',
  parking: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M9.5 17V7H13a3 3 0 0 1 0 6H9.5"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  cloud: '<path d="M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.5a4.5 4.5 0 0 1-.5 10z"/>',
  hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5M14 10.5v-5a1.5 1.5 0 0 1 3 0V13M17 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1.2a6 6 0 0 1-4.6-2.2L4 14.5a1.5 1.5 0 0 1 2.3-1.9L8 14.5"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6z"/>',
  arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  refresh: '<path d="M20 11.5A8 8 0 1 1 17.7 6M20 4v5h-5"/>',
  printer: '<path d="M7 8.5v-5h10v5M7 17H4.5v-7A1.5 1.5 0 0 1 6 8.5h12a1.5 1.5 0 0 1 1.5 1.5v7H17"/><rect x="7" y="14" width="10" height="7"/>',
  share: '<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 13v6a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  up: '<path d="m6 15 6-6 6 6"/>', down: '<path d="m6 9 6 6 6-6"/>', left: '<path d="m15 6-6 6 6 6"/>', right: '<path d="m9 6 6 6-6 6"/>',
  volume: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
  flag: '<path d="M5 21V4M5 4.5h11l-2 4 2 4H5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M15 6v12" stroke-dasharray="2 2"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
};
function icon(name, size = 20, sw = 1.8) { return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`; }
function starPts(cx, cy, R, r, n = 5, rot = -90) { const p = []; for (let i = 0; i < n * 2; i++) { const a = ((rot + (i * 180) / n) * Math.PI) / 180; const rad = i % 2 ? r : R; p.push((cx + rad * Math.cos(a)).toFixed(1) + "," + (cy + rad * Math.sin(a)).toFixed(1)); } return p.join(" "); }
const sparkPath = (cx, cy, r) => { const k = r * 0.14; return `M${cx} ${cy - r}C${cx + k} ${cy - k} ${cx + k} ${cy - k} ${cx + r} ${cy}C${cx + k} ${cy + k} ${cx + k} ${cy + k} ${cx} ${cy + r}C${cx - k} ${cy + k} ${cx - k} ${cy + k} ${cx - r} ${cy}C${cx - k} ${cy - k} ${cx - k} ${cy - k} ${cx} ${cy - r}Z`; };

/* Símbolos dos jogos (geométricos, sem enfeites) */
const SYM_COLORS = { roxo: "#7656A8", lilas: "#B79BE0", agua: "#4FBFA8", coral: "#E3828F", amarelo: "#EDBF45", azul: "#78A9DA" };
const SYM_NOMES = { roxo: "roxo", lilas: "lilás", agua: "verde-água", coral: "coral", amarelo: "amarelo", azul: "azul" };
const SHAPE_NOMES = { star: "estrela", note: "nota musical", mic: "microfone", skate: "patins" };
function sym(shape, color) {
  const c = SYM_COLORS[color] || color; let b = "";
  if (shape === "star") b = `<polygon points="${starPts(20, 21, 18, 8)}" fill="${c}"/>`;
  else if (shape === "note") b = `<g fill="${c}"><ellipse cx="13.5" cy="29.5" rx="7" ry="5.2" transform="rotate(-22 13.5 29.5)"/><rect x="18.4" y="5" width="3.4" height="25" rx="1.7"/><path d="M20 5c4.5 1 10 3.5 10 10-2.4-3.3-5.6-4.5-10-4.5z"/></g>`;
  else if (shape === "mic") b = `<path d="M14.5 21.5h11l-3 13a2.5 2.5 0 0 1-5 0z" fill="#211936"/><circle cx="20" cy="12.5" r="10" fill="${c}"/>`;
  else if (shape === "skate") b = `<path d="M8 5h11v14l7.5 1.2a5 5 0 0 1 4.5 5V28H8z" fill="${c}"/><rect x="6" y="28" width="28" height="3.4" rx="1.7" fill="#211936"/><circle cx="12.5" cy="34.5" r="3.6" fill="#211936"/><circle cx="27.5" cy="34.5" r="3.6" fill="#211936"/>`;
  return `<svg viewBox="0 0 40 40" aria-hidden="true">${b}</svg>`;
}

/* ---------- Áudio ---------- */
let AC = null;
function tone(freq = 440, dur = 0.25, type = "sine", vol = 0.16, when = 0) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume();
    const t = AC.currentTime + when, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + dur + 0.05);
  } catch (e) {}
}
const chime = () => { tone(523, 0.3, "sine", 0.14); tone(659, 0.3, "sine", 0.14, 0.1); tone(784, 0.45, "sine", 0.14, 0.2); };
const softNo = () => tone(220, 0.2, "triangle", 0.09);

/* ---------- Modal / toast / impressão ---------- */
let lastFocus = null;
function openModal(html, opts = {}) {
  const root = $("#modal-root"); lastFocus = document.activeElement;
  root.innerHTML = `<div class="modal-bg" data-act="modalBg"><div class="modal ${opts.wide ? "wide" : ""}" role="dialog" aria-modal="true" aria-label="${esc(opts.label || "Janela")}"><button class="modal-close" data-act="closeModal" aria-label="Fechar">${icon("x")}</button>${html}</div></div>`;
  setTimeout(() => { const f = root.querySelector(".modal .btn, .modal-close"); f && f.focus(); }, 30);
}
function closeModal() { $("#modal-root").innerHTML = ""; if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
A.closeModal = () => closeModal();
A.modalBg = (el, e) => { if (e.target === el) closeModal(); };
function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2800); }
function printButtons(label = "Imprimir") {
  if (FRAMED) return `<div class="note lav no-print">${icon("info")}<span>Para imprimir ou salvar em PDF, abra o arquivo <b>index.html</b> no navegador do computador. Esta janela de visualização não permite impressão.</span></div>`;
  return `<button class="btn btn-dark" data-act="print">${icon("printer", 18)} ${label}</button><button class="btn btn-ghost" data-act="printPdf">${icon("share", 18)} Salvar em PDF</button>`;
}
A.print = () => window.print();
A.printPdf = () => { toast("Na janela de impressão, escolha “Salvar como PDF” como destino."); setTimeout(() => window.print(), 600); };

/* ---------- Componentes comuns ---------- */
function talk(q, label = "Para conversar") { return `<div class="talk"><span class="ti">${icon("chat", 18)}</span><div><div class="label">${label}</div><div class="tq">${q}</div></div></div>`; }
function secTitle(t, sub) { return `<div class="sec-title"><h2>${t}</h2><span class="ln"></span>${sub ? `<span class="label">${sub}</span>` : ""}</div>`; }
function chipsHTML(list, sel, act, extra = "", cls = "") { return list.map((x) => `<button class="chip ${cls} ${sel.includes(x) ? "on" : ""}" data-act="${act}" data-v="${esc(x)}" ${extra} aria-pressed="${sel.includes(x)}">${esc(x)}</button>`).join(""); }
function toggleIn(arr, v) { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); return arr; }
function wave(color = "#91D8C9", seed = 1) {
  let d = "M0 40"; for (let x = 0; x <= 1200; x += 12) { const y = 40 + Math.sin(x / (60 + seed * 7)) * 12 * Math.sin(x / 300 + seed) + Math.sin(x / 23) * 3; d += ` L${x} ${y.toFixed(1)}`; }
  return `<svg class="wave" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="${color}" stroke-width="1.5"/></svg>`;
}

/* ---------- Estrutura (menu) ---------- */
function renderShell() {
  document.getElementById("root").innerHTML = `
  <div class="topbar no-print"><button class="btn btn-light btn-icon" data-act="openNav" aria-label="Abrir menu">${icon("menu")}</button><span class="brand-title" id="tb-title"></span><span class="segs" id="tb-segs" aria-hidden="true"></span></div>
  <div class="scrim no-print" data-act="closeNav"></div>
  <div class="app">
    <aside class="sidebar no-print" id="sidebar" aria-label="Menu principal">
      <a class="brand" href="#inicio"><span class="brand-mark">${icon("mic", 20, 2)}</span><span><span class="brand-title" id="side-title"></span><br><span class="brand-sub">Seu mundo, seu ritmo, sua mente</span></span></a>
      <div class="prog" id="prog"></div>
      <nav class="nav" id="nav"></nav>
      <div class="side-foot">
        <a href="#familia" data-nav="familia">${icon("users", 18)} Guia para a família</a>
        <a href="#guia" data-nav="guia">${icon("clipboard", 18)} Guia da sessão</a>
        <a href="#referencias" data-nav="referencias">${icon("bookopen", 18)} Referências</a>
        <button data-act="askReset">${icon("refresh", 18)} Reiniciar</button>
      </div>
    </aside>
    <main id="main"><div id="view"></div></main>
  </div>
  <div id="modal-root"></div>`;
  updateNav();
}
function navState(id) { return S.m[id] && S.m[id].done ? "done" : started(id) ? "part" : ""; }
function updateNav() {
  const cur = (location.hash || "#inicio").slice(1); const nav = $("#nav"); if (!nav) return;
  nav.innerHTML = `<a href="#inicio" class="${cur === "inicio" ? "active" : ""}"><span class="nn">${icon("home", 16)}</span>Início<span></span></a>
    <div class="nav-label label light">Missões</div>
    ${MISSIONS.map((m) => `<a href="#${m.id}" class="${cur === m.id ? "active" : ""}"><span class="nn">${pad2(m.n)}</span>${m.titulo}<span class="st ${navState(m.id)}">${navState(m.id) === "done" ? icon("check", 12, 3) : ""}</span></a>`).join("")}`;
  const n = doneCount();
  $("#prog").innerHTML = `<div class="row between"><span class="label light">Percurso</span><span style="font-family:var(--f-mono);font-size:.78rem;color:var(--on-night-2)">${n}/${MISSIONS.length}</span></div><div class="segs">${MISSIONS.map((m) => `<i class="${navState(m.id) === "done" ? "on" : navState(m.id) === "part" ? "part" : ""}" title="${m.titulo}"></i>`).join("")}</div>`;
  $("#tb-segs").innerHTML = MISSIONS.map((m) => `<i class="${navState(m.id) === "done" ? "on" : ""}"></i>`).join("");
  $$(".side-foot a").forEach((a) => a.classList.toggle("active", a.dataset.nav === cur || (a.dataset.nav === "familia" && cur === "familia-compartilhar")));
  $("#side-title").textContent = S.title; $("#tb-title").textContent = S.title;
}
A.openNav = () => { $("#sidebar").classList.add("open"); $(".scrim").classList.add("open"); };
A.closeNav = () => { const s = $("#sidebar"); if (s) { s.classList.remove("open"); $(".scrim").classList.remove("open"); } };
A.askReset = () => openModal(`<div class="modal-head"><span class="ib i-coral">${icon("refresh", 22)}</span><div><h2>Reiniciar tudo?</h2><p class="muted" style="margin-top:6px">Todas as respostas, escolhas e ingressos desta sessão serão apagados deste navegador. Essa ação não pode ser desfeita.</p></div></div>
  <div class="modal-body"><div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-dark" data-act="doReset">Reiniciar</button></div></div>`, { label: "Reiniciar" });
A.doReset = () => { const t = S.title; stopAllGames(); stopTimer(true); S = DEFAULT_STATE(); S.title = t; save(); closeModal(); location.hash = "#inicio"; route(); toast("Tudo foi reiniciado."); };

/* ---------- Roteador ---------- */
const VIEWS = {};
function route() {
  const h = (location.hash || "#inicio").slice(1); const key = VIEWS[h] ? h : "inicio";
  document.body.classList.toggle("standalone", key === "familia-compartilhar");
  stopAllGames(); CUR = null;
  $("#view").innerHTML = `<div class="view" id="v-${key}">${VIEWS[key].render()}</div>`;
  VIEWS[key].mount && VIEWS[key].mount();
  updateNav(); A.closeNav(); window.scrollTo(0, 0);
  const h1 = $("#view h1"); if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
}

/* =========================================================
   INÍCIO
   ========================================================= */
function heroArt() {
  const bars = Array.from({ length: 22 }, (_, i) => { const h = 40 + ((i * 37) % 120); const x = 30 + i * 18; return `<rect class="eqbar" x="${x}" y="${300 - h}" width="9" height="${h}" rx="4.5" fill="${i % 5 === 2 ? "#91D8C9" : "#C6B2E8"}" opacity="${(0.35 + (i % 3) * 0.2).toFixed(2)}" style="animation-delay:${-(i * 0.17).toFixed(2)}s;animation-duration:${(2 + (i % 4) * 0.4).toFixed(1)}s"/>`; }).join("");
  return `<svg viewBox="0 0 460 340" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Equalizador animado e uma linha de pista">
    <path id="pista" d="M-10 250 C80 170 150 300 240 220 S380 120 470 170" fill="none" stroke="#91D8C9" stroke-width="1.5" stroke-dasharray="1 7" stroke-linecap="round"/>
    ${bars}
    <circle r="6" fill="#91D8C9"><animateMotion dur="9s" repeatCount="indefinite"><mpath href="#pista"/></animateMotion></circle>
    <path class="spark" d="${sparkPath(380, 70, 16)}" fill="#F2D47E"/>
    <path class="spark" d="${sparkPath(90, 80, 8)}" fill="#C6B2E8" style="animation-delay:-1.5s"/>
    <path class="spark" d="${sparkPath(300, 40, 6)}" fill="#91D8C9" style="animation-delay:-2.6s"/>
  </svg>`;
}
function statusPill(id) {
  const m = S.m[id];
  if (m && m.done) return `<span class="stp done">${icon("check", 13, 2.6)} Concluída${m.at ? " · " + m.at : ""}</span>`;
  if (started(id)) return `<span class="stp part">Em andamento</span>`;
  return `<span class="stp">Nova</span>`;
}
function ticketHTML(m, big = false) {
  const st = S.m[m.id] || {}; const on = !!st.done;
  const nota = st.nota ? "“" + esc(st.nota.length > 110 ? st.nota.slice(0, 110) + "…" : st.nota) + "”" : m.tema;
  return `<div class="ticket ${on ? "" : "off"} ${big ? "big stamp" : ""}"><div class="tk-main"><span class="label ${on ? "light" : ""}">Missão ${pad2(m.n)} · ${on ? "Selo " + m.selo : "A conquistar"}</span><h4>${m.titulo}</h4><p>${on ? nota : m.tema}</p></div><div class="tk-stub"><span class="n">${pad2(m.n)}</span><small>${on ? st.at || "" : "—"}</small></div></div>`;
}
VIEWS.inicio = {
  render() {
    const n = doneCount(); const next = MISSIONS.find((m) => !(S.m[m.id] && S.m[m.id].done));
    return `<section class="hero">
      <div class="hero-text"><span class="title-slot" title="Título editável no Guia da sessão">${esc(S.title)}</span>
        <h1>Seu mundo, seu ritmo, <em>sua mente.</em></h1>
        <p class="sub">Cada pessoa tem seu próprio jeito de pensar, sentir, aprender e enxergar o mundo. Que tal descobrir um pouco mais sobre o seu?</p>
        <div class="row" style="margin-top:6px"><a class="btn btn-primary" href="#${next ? next.id : "final"}">${icon("play", 16)} ${n === 0 ? "Começar minha jornada" : next ? "Continuar: " + next.titulo : "Ver encerramento"}</a><button class="btn btn-light" data-act="scrollTo" data-target="setlist">Ver as missões</button></div>
      </div>
      <div class="hero-art">${heroArt()}</div>
    </section>
    <section style="margin-top:30px" class="stack">
      <span class="label">Como funciona</span>
      <div class="how">
        ${[["01", "Escolham a missão", "Uma missão por encontro, na ordem que fizer sentido."], ["02", "Joguem juntas", "Cada missão é um jogo diferente, com escolhas suas."], ["03", "Conversem", "As escolhas abrem conversas. Não existem respostas certas."], ["04", "Guarde o ingresso", "Ao concluir, a missão vira um ingresso no seu percurso."]].map(([k, t, p]) => `<div class="hs"><span class="label">${k}</span><b>${t}</b><p>${p}</p></div>`).join("")}
      </div>
    </section>
    <section style="margin-top:38px;scroll-margin-top:70px" id="setlist">
      ${secTitle("Setlist", n + " de " + MISSIONS.length + " concluídas")}
      <div class="setlist">${MISSIONS.map((m) => `<a class="track-row ${S.m[m.id] && S.m[m.id].done ? "done" : ""}" href="#${m.id}"><span class="num">${pad2(m.n)}</span><span><h3>${m.titulo}</h3><span class="meta">${m.tema}</span></span><span class="dur">${m.dur}</span>${statusPill(m.id)}</a>`).join("")}</div>
    </section>
    <section style="margin-top:38px">
      ${secTitle("Ingressos", "Seu percurso")}
      <div class="tickets">${MISSIONS.map((m) => ticketHTML(m)).join("")}</div>
      <p class="muted small" style="margin-top:12px">Os ingressos registram as missões vividas. Não há notas, acertos ou pontuações.</p>
    </section>`;
  },
};
A.scrollTo = (el) => { const t = document.getElementById(el.dataset.target); t && t.scrollIntoView({ behavior: "smooth", block: "start" }); };

/* =========================================================
   ESTRUTURA DAS MISSÕES
   MREND[id]  = funções dos passos intermediários (sem briefing/fechamento)
   MMOUNT[id] = { [índice do passo]: função } (opcional)
   MSUM[id]   = resumo das escolhas, exibido no fechamento (opcional)
   ========================================================= */
const MREND = {}, MMOUNT = {}, MSUM = {};
let CUR = null;
function missionView(id) {
  return {
    render() {
      CUR = id; const m = missionOf(id); const st = M(id); save();
      return `<header class="mhead"><span class="bignum" aria-hidden="true">${pad2(m.n)}</span>${wave("#91D8C9", m.n)}
        <div class="tools no-print"><button class="btn btn-light btn-sm" data-act="mediacao">${icon("clipboard", 16)} Notas para a mediação</button></div>
        <span class="label light">Missão ${pad2(m.n)} de ${pad2(MISSIONS.length)} · ${m.tema}</span>
        <h1>${m.titulo}</h1><p class="hook">${m.hook}</p>
        <div class="meta"><span>${m.dur}</span><span>Selo: ${m.selo}</span>${st.done ? `<span class="done">Concluída em ${st.at}</span>` : ""}</div>
      </header>
      <nav class="stepper no-print" id="stepper" aria-label="Etapas da missão"></nav>
      <section id="mstep"></section>
      <div class="stepnav no-print" id="stepnav"></div>`;
    },
    mount() { CUR = id; renderStep(); },
  };
}
function renderStep() {
  const id = CUR; const m = missionOf(id); const st = M(id); const last = m.steps.length - 1;
  st.step = Math.max(0, Math.min(last, st.step || 0)); st.seen[st.step] = true; save();
  $("#stepper").innerHTML = m.steps.map((s, i) => `<button class="${i === st.step ? "on" : ""} ${st.seen[i] ? "seen" : ""}" data-act="goStep" data-i="${i}" aria-current="${i === st.step}"><span class="sn">${pad2(i + 1)}</span><span class="sl">${s}</span></button>`).join("");
  let html;
  if (st.step === 0) html = briefHTML(m);
  else if (st.step === last) html = closingHTML(m);
  else html = MREND[id][st.step - 1]();
  $("#mstep").innerHTML = `<div style="animation:viewIn .35s ease both">${html}</div>`;
  const mt = MMOUNT[id] && MMOUNT[id][st.step]; mt && mt();
  $("#stepnav").innerHTML = `${st.step > 0 ? `<button class="btn btn-ghost" data-act="stepBy" data-d="-1">${icon("arrowL", 16)} ${m.steps[st.step - 1]}</button>` : `<a class="btn btn-ghost" href="#inicio">${icon("arrowL", 16)} Setlist</a>`}
    ${st.step < last ? `<button class="btn btn-dark" data-act="stepBy" data-d="1">${m.steps[st.step + 1]} ${icon("arrowR", 16)}</button>` : ""}`;
  updateNav();
}
function rerender() { if (CUR) { const y = window.scrollY; renderStep(); window.scrollTo(0, y); } }
A.goStep = (el) => { stopAllGames(); M(CUR).step = +el.dataset.i; renderStep(); };
A.stepBy = (el) => { stopAllGames(); const st = M(CUR); st.step = st.step + +el.dataset.d; renderStep(); const s = $("#stepper"); s && window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); };
function briefHTML(m) {
  const X = MDATA()[m.id];
  return `<div class="brief"><div class="stack"><span class="label">Briefing</span><p class="lead">${X.brief}</p>
    <div class="row" style="margin-top:6px"><button class="btn btn-primary" data-act="stepBy" data-d="1">${icon("play", 16)} Começar a missão</button></div></div>
    <div class="card goal"><span class="label">O que vamos fazer</span><ol class="flow-mini" style="padding:0;margin:0">${X.passos.map((p) => `<li>${p}</li>`).join("")}</ol>
    <div class="note lav small">${icon("info", 18)}<span>Dá para pausar, voltar e pular etapas a qualquer momento. O ritmo é de vocês.</span></div></div></div>`;
}
function closingHTML(m) {
  const X = MDATA()[m.id]; const st = M(m.id); const nx = nextMission(m);
  return `<div class="closing"><div class="stack"><span class="label">Fechamento</span><h2>O que fica desta missão</h2><p class="muted">${CLOSING_DEFAULT}</p>
      ${X.fechamento.map((q) => talk(q)).join("")}
      ${MSUM[m.id] ? `<div class="card tight stack"><span class="label">O que você explorou</span>${MSUM[m.id]()}</div>` : ""}</div>
    <div class="stack"><div class="card stack"><label for="nota" class="label">Uma frase para levar (opcional)</label><textarea id="nota" class="field" data-input="nota" maxlength="300" placeholder="Algo que você percebeu, uma pergunta nova, algo para observar...">${esc(st.nota)}</textarea><p class="muted small">Essa frase aparece no seu ingresso.</p></div>
      ${st.done ? `${ticketHTML(m)}<div class="row"><a class="btn btn-primary" href="#${nx ? nx.id : "final"}">${nx ? "Próxima missão" : "Ver encerramento"} ${icon("arrowR", 16)}</a><button class="btn btn-ghost" data-act="finish">Atualizar ingresso</button></div>`
        : `<button class="btn btn-primary" data-act="finish" style="padding:15px 22px;font-size:1rem">${icon("ticket", 18)} Concluir missão e receber o ingresso</button>`}
    </div></div>`;
}
function nextMission(m) { return MISSIONS.find((x) => x.n > m.n && !(S.m[x.id] && S.m[x.id].done)) || MISSIONS.find((x) => x.id !== m.id && !(S.m[x.id] && S.m[x.id].done)); }
A.finish = () => {
  const m = missionOf(CUR); const st = M(CUR); const was = st.done;
  st.done = true; st.at = st.at || new Date().toLocaleDateString("pt-BR"); save(); chime(); updateNav();
  const nx = nextMission(m); const fim = allDone();
  openModal(`<div class="modal-body" style="padding-top:30px"><span class="label">${was ? "Ingresso atualizado" : "Missão concluída"}</span><h2>${m.titulo}</h2>${ticketHTML(m, true)}
    <p class="muted">${fim ? "Todas as missões do percurso foram concluídas." : `${doneCount()} de ${MISSIONS.length} missões concluídas. Vocês podem voltar a esta missão sempre que quiserem.`}</p>
    <div class="row">${fim ? `<a class="btn btn-primary" href="#final" data-act="closeModal">Ver encerramento ${icon("arrowR", 16)}</a>` : nx ? `<a class="btn btn-primary" href="#${nx.id}" data-act="closeModal">Próxima: ${nx.titulo} ${icon("arrowR", 16)}</a>` : ""}<a class="btn btn-ghost" href="#inicio" data-act="closeModal">Ver o percurso</a></div></div>`, { label: "Missão concluída" });
  renderStep();
};
A.mediacao = () => {
  const g = GUIA[CUR]; const m = missionOf(CUR);
  openModal(`<div class="modal-head"><span class="ib i-night">${icon("clipboard", 22)}</span><div><span class="label">Notas para a mediação</span><h2>${m.titulo}</h2></div></div>
  <div class="modal-body"><div class="kv"><span class="k">Objetivo terapêutico</span><p>${g.obj}</p></div>
  <div class="kv"><span class="k">Perguntas que podem ajudar</span><ul class="dots">${g.perguntas.map((p) => `<li>${p}</li>`).join("")}</ul></div>
  <div class="kv"><span class="k">Cuidados</span><ul class="dots">${g.cuidados.map((p) => `<li>${p}</li>`).join("")}</ul></div>
  <a class="btn btn-ghost btn-sm" href="#guia" data-act="closeModal" style="align-self:flex-start">Abrir o guia completo</a></div>`, { label: "Notas para a mediação", wide: true });
};

/* =========================================================
   ENCERRAMENTO E REFERÊNCIAS
   ========================================================= */
VIEWS.final = {
  render() {
    const fim = allDone();
    return `<section class="hero" style="grid-template-columns:1fr;min-height:0"><div class="hero-text" style="padding:44px">
      <span class="label light">${fim ? "Percurso concluído" : "Encerramento"}</span>
      <h1>${fim ? "Meu cérebro, minhas <em>descobertas.</em>" : "Ainda há <em>missões</em> pela frente"}</h1>
      ${fim ? FINAL_TXT.map((p) => `<p class="sub" style="max-width:60ch">${p}</p>`).join("") : `<p class="sub">Você já concluiu ${doneCount()} de ${MISSIONS.length} missões. Quando todas estiverem concluídas, esta tela estará esperando por você.</p>`}
      <div class="row"><a class="btn btn-primary" href="#rider">${icon("mic", 16)} Ver meu rider</a><a class="btn btn-light" href="#inicio">Voltar ao início</a></div></div></section>
      <section style="margin-top:30px">${secTitle("Ingressos", doneCount() + "/" + MISSIONS.length)}<div class="tickets">${MISSIONS.map((m) => ticketHTML(m)).join("")}</div></section>`;
  },
};
VIEWS.referencias = {
  render() {
    return `<header class="stack" style="margin-bottom:22px"><span class="label">Fundamentação científica</span><h1>Referências</h1><p class="muted prose">O conteúdo foi elaborado com base em manuais diagnósticos, diretrizes clínicas e literatura científica sobre TDAH, neurodesenvolvimento, funções executivas e intervenções psicossociais.</p></header>
    <div class="stack"><div class="note lav">${icon("info")}<span>Este é um material de psicoeducação. Ele não substitui avaliação, diagnóstico ou tratamento realizados por profissionais habilitados. Recomenda-se conferir as edições mais recentes das diretrizes antes de citá-las.</span></div>
    <div class="card"><ol class="ref-list">${REFERENCIAS.map((r) => `<li>${r}</li>`).join("")}</ol></div></div>`;
  },
};

/* =========================================================
   GUIA PARA A FAMÍLIA
   ========================================================= */
function familiaBody(standalone) {
  const F = FAMILIA;
  const toc = [...F.secoes.map((s) => [s.id, s.titulo]), ["f-poss", "Possibilidades no dia a dia"], ["f-com", "Comunicação"], ["f-ref", "Para refletir em família"]];
  return `<div class="fam-layout"><nav class="toc no-print" aria-label="Sumário">${toc.map(([id, t]) => `<button type="button" data-act="scrollTo" data-target="${id}">${t}</button>`).join("")}</nav>
  <div class="stack-lg">
    ${F.secoes.map((s) => `<section class="fam-sec" id="${s.id}"><h2>${s.titulo}</h2><div class="prose">${s.html}</div></section>`).join("")}
    <section class="fam-sec" id="f-poss"><h2>Possibilidades no dia a dia</h2><p class="muted prose">${F.possibilidades.intro}</p>
      <div class="consider">${F.possibilidades.itens.map((p) => `<div class="card"><div class="row" style="gap:10px;margin-bottom:8px"><span class="ib sm i-lilas">${icon(p.icon, 18)}</span><h4>${p.t}</h4></div><p>${p.p}</p></div>`).join("")}</div></section>
    <section class="fam-sec" id="f-com"><h2>Comunicação</h2><p class="muted prose">${F.comunicacao.intro}</p>
      <div class="row small" style="gap:10px"><span class="tag coral">No calor do momento</span><span class="tag agua">Uma alternativa possível</span></div>
      <div class="stack" style="gap:10px">${F.comunicacao.pares.map(([a, b, w]) => `<div class="swap"><div class="from">“${a}”</div><div class="to">“${b}”</div><div class="why">${w}</div></div>`).join("")}</div></section>
    <section class="fam-sec" id="f-ref"><h2>Para refletir em família</h2><p class="muted prose">Perguntas para pensar individualmente ou levar para uma conversa com a psicóloga.</p>
      <div class="grid g2">${F.reflexoes.map((q) => talk(q, "Reflexão")).join("")}</div></section>
    <div class="note">${icon("info")}<span>${F.fecho}</span></div>
    <p class="muted small">Material de psicoeducação baseado em evidências científicas (DSM-5-TR, CID-11, diretrizes clínicas e literatura sobre TDAH e funções executivas). ${standalone ? "" : `Veja as <a href="#referencias">referências</a>.`}</p>
  </div></div>`;
}
VIEWS.familia = {
  render() {
    return `<section class="fam-hero"><div class="stack"><span class="label">Área para a família</span><h1>Guia para a família</h1><p class="prose">${FAMILIA.intro}</p></div>
      <div class="stack no-print"><a class="btn btn-dark" href="#familia-compartilhar">${icon("share", 16)} Versão para compartilhar</a><p class="muted small">Abre apenas este guia, sem o menu e sem nenhuma resposta da adolescente.</p></div></section>
      <div style="margin-top:30px">${familiaBody(false)}</div>`;
  },
};
VIEWS["familia-compartilhar"] = {
  render() {
    return `<div class="share-banner no-print"><span class="row" style="gap:10px">${icon("users")}<span>Guia para a família · versão para leitura e impressão</span></span><div class="row">${printButtons("Imprimir guia")}<a class="btn btn-ghost btn-sm" href="#familia">${icon("arrowL", 16)} Voltar</a></div></div>
      <section class="fam-hero"><div class="stack"><span class="label">${esc(S.title)}</span><h1>Guia para a família</h1><p class="prose">${FAMILIA.intro}</p></div></section>
      <div style="margin-top:30px">${familiaBody(true)}</div>`;
  },
};

/* =========================================================
   GUIA DA SESSÃO
   ========================================================= */
function guiaBody() {
  const g = GUIA[S.guiaTab]; const m = missionOf(S.guiaTab);
  return `<div class="grid g2"><div class="card stack"><span class="label">Missão ${pad2(m.n)} · ${m.dur}</span><h3>${m.titulo}</h3><p>${g.obj}</p><a class="btn btn-ghost btn-sm" href="#${m.id}" style="align-self:flex-start">Abrir a missão ${icon("arrowR", 14)}</a></div>
    <div class="card stack"><span class="label">Perguntas que podem ajudar</span><ul class="dots">${g.perguntas.map((p) => `<li>${p}</li>`).join("")}</ul><span class="label" style="margin-top:6px">Cuidados</span><ul class="dots">${g.cuidados.map((p) => `<li>${p}</li>`).join("")}</ul></div></div>`;
}
A.guiaTab = (el) => { S.guiaTab = el.dataset.id; save(); $("#guia-tabs").innerHTML = guiaTabs(); $("#guia-body").innerHTML = guiaBody(); };
const guiaTabs = () => MISSIONS.map((m) => `<button class="chip ${S.guiaTab === m.id ? "on" : ""}" data-act="guiaTab" data-id="${m.id}">${pad2(m.n)} · ${m.titulo}</button>`).join("");
A.saveTitle = () => { S.title = $("#title-in").value.trim() || TITULO_PADRAO; save(); updateNav(); toast("Título atualizado."); };
A.toggleDone = (el) => { const st = M(el.dataset.id); st.done = !st.done; if (st.done && !st.at) st.at = new Date().toLocaleDateString("pt-BR"); save(); updateNav(); $("#guia-st").innerHTML = guiaStatus(); };
const guiaStatus = () => MISSIONS.map((m) => `<div class="todo"><span style="flex:1"><b>${pad2(m.n)} · ${m.titulo}</b><br><span class="muted small">${S.m[m.id] && S.m[m.id].done ? "Concluída em " + S.m[m.id].at : started(m.id) ? "Em andamento" : "Não iniciada"}</span></span><button class="btn btn-ghost btn-sm" data-act="toggleDone" data-id="${m.id}">${S.m[m.id] && S.m[m.id].done ? "Desmarcar" : "Marcar como concluída"}</button></div>`).join("");
VIEWS.guia = {
  render() {
    return `<header class="stack" style="margin-bottom:24px"><span class="label">Uso profissional</span><h1>Guia da sessão</h1><p class="muted prose">Apoio para conduzir cada missão. As mesmas notas aparecem dentro de cada missão, no botão “Notas para a mediação”.</p></header>
    <div class="stack-lg">
      <section class="grid g2"><div class="card stack"><h3>Dinâmica sugerida</h3><ol class="flow-mini" style="padding:0;margin:0">${GUIA_GERAL.dinamica.map((p) => `<li>${p}</li>`).join("")}</ol></div>
        <div class="card stack"><h3>Postura</h3><ul class="dots">${GUIA_GERAL.postura.map((p) => `<li>${p}</li>`).join("")}</ul></div></section>
      <section>${secTitle("Por missão")}<div class="guide-tabs" id="guia-tabs">${guiaTabs()}</div><div id="guia-body">${guiaBody()}</div></section>
      <section class="grid g2" style="align-items:start">
        <div class="stack"><h3>Título do projeto</h3><p class="muted small">Aparece no menu, na tela inicial e no pôster. Para fixar, altere <code>TITULO_PADRAO</code> em <code>src/content.js</code>.</p><form class="add-row" onsubmit="event.preventDefault();A.saveTitle()"><label class="sr-only" for="title-in">Título</label><input id="title-in" value="${esc(S.title)}" maxlength="60"><button class="btn btn-dark" type="submit">Salvar</button></form>
          <div class="note agua">${icon("lock")}<span>${GUIA_GERAL.privacidade}</span></div><button class="btn btn-ghost" data-act="askReset" style="align-self:flex-start">${icon("refresh", 16)} Reiniciar</button></div>
        <div class="stack"><h3>Andamento das missões</h3><div class="stack" style="gap:8px" id="guia-st">${guiaStatus()}</div></div>
      </section>
    </div>`;
  },
};

/* =========================================================
   Eventos globais
   ========================================================= */
const INPUTS = {};
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]"); if (!t) return; const fn = A[t.dataset.act]; if (!fn) return;
  if (t.tagName === "A" && t.dataset.act === "closeModal") { $("#modal-root").innerHTML = ""; return; }
  fn(t, e);
});
document.addEventListener("input", (e) => {
  const k = e.target.dataset && e.target.dataset.input; if (!k) return;
  if (k === "nota") { M(CUR).nota = e.target.value; save(); }
  else if (INPUTS[k]) INPUTS[k](e.target);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if ($("#modal-root") && $("#modal-root").innerHTML) closeModal(); else A.closeNav(); } });
window.addEventListener("hashchange", route);
function boot() { MISSIONS.forEach((m) => (VIEWS[m.id] = missionView(m.id))); renderShell(); route(); }
