/* =========================================================
   NÚCLEO — utilidades, estado, ícones, navegação, progresso
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const A = {}; // ações (event delegation)
const FRAMED = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

/* ---------- Estado (apenas nesta aba do navegador) ---------- */
const STORE_KEY = "psicoed-tdah-sessao-v1";
const DEFAULT_STATE = () => ({
  title: TITULO_PADRAO, done: {}, brainSel: null, efSeen: {}, flowIdx: 0, concept: null,
  chapter: 0, chaptersRead: {}, eqScene: "aula", quiz: { idx: 0, ans: {} },
  cards: { idx: 0, cat: "all", ans: {} }, games: {}, curGame: null,
  toolSit: "all", toolsSeen: {}, resTab: "todo", todo: [], plan: { goal: "", steps: [] }, board: [],
  manual: {}, persona: { icon: "mic", cor: "roxo" }, manualDone: false, sound: true, guiaTab: "inicio",
});
let S = load();
function load() {
  try { const raw = sessionStorage.getItem(STORE_KEY); if (raw) return Object.assign(DEFAULT_STATE(), JSON.parse(raw)); } catch (e) {}
  return DEFAULT_STATE();
}
function save() { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {} }

/* ---------- Ícones ---------- */
const ICONS = {
  brain: '<path d="M9.5 3.5a3 3 0 0 0-3 2.6A3 3 0 0 0 4 9.5a3 3 0 0 0 .6 4.6A3 3 0 0 0 7 18.5a2.8 2.8 0 0 0 5 1V5.2a2 2 0 0 0-2.5-1.7z"/><path d="M14.5 3.5a3 3 0 0 1 3 2.6A3 3 0 0 1 20 9.5a3 3 0 0 1-.6 4.6 3 3 0 0 1-2.4 4.4 2.8 2.8 0 0 1-5 1"/><path d="M8 9.5h2M14 12.5h2M8 14h1.5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20.5 20.5-4.8-4.8"/>',
  cards: '<rect x="3.5" y="6" width="11" height="15" rx="2"/><path d="M8 3.5h10.5a2 2 0 0 1 2 2V18"/>',
  spark: '<path d="M11 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z"/><path d="M19 15.5c.2 1.2.8 1.8 2 2-1.2.2-1.8.8-2 2-.2-1.2-.8-1.8-2-2 1.2-.2 1.8-.8 2-2z"/>',
  toolbox: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8.5 8V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V8M3 13h18M10 13v2h4v-2"/>',
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
  skate: '<path d="M5 3.5h5v8l6 .5a4 4 0 0 1 4 4V17H5z"/><path d="M10 7H8M10 9.5H8"/><circle cx="8" cy="20" r="1.8"/><circle cx="17" cy="20" r="1.8"/>',
  zap: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
  stairs: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
  desk: '<path d="M3 10h18M5 10v10M19 10v10M14 10v5h5M8 10V6h5v4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  coffee: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5V6M12 3.5V6"/>',
  bulb: '<path d="M9 17.5h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  wind: '<path d="M3 8h10.5A2.5 2.5 0 1 0 11 5.5M3 12h15.5a2.5 2.5 0 1 1-2.5 2.5M3 16h8"/>',
  thermo: '<path d="M14 14.8V4.5a2 2 0 0 0-4 0v10.3a4 4 0 1 0 4 0z"/><path d="M12 11v6"/>',
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
  up: '<path d="m6 15 6-6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  volume: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
  flag: '<path d="M5 21V4M5 4.5h11l-2 4 2 4H5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
};
function icon(name, size = 20, sw = 1.8) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}
function starFill(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2.5 2.9 6 6.6.9-4.8 4.5 1.2 6.6L12 17.3l-5.9 3.2 1.2-6.6-4.8-4.5 6.6-.9z"/></svg>`;
}
function starPts(cx, cy, R, r, n = 5, rot = -90) {
  const p = [];
  for (let i = 0; i < n * 2; i++) { const a = ((rot + (i * 180) / n) * Math.PI) / 180; const rad = i % 2 ? r : R; p.push((cx + rad * Math.cos(a)).toFixed(1) + "," + (cy + rad * Math.sin(a)).toFixed(1)); }
  return p.join(" ");
}

/* Símbolos coloridos usados nos jogos e na identidade */
const SYM_COLORS = { roxo: "#7656A8", lilas: "#B79BE0", agua: "#4FBFA8", coral: "#E3828F", amarelo: "#EDBF45", azul: "#78A9DA" };
const SYM_NOMES = { roxo: "roxo", lilas: "lilás", agua: "verde-água", coral: "coral", amarelo: "amarelo", azul: "azul" };
const SHAPE_NOMES = { star: "estrela", note: "nota musical", mic: "microfone", skate: "patins" };
const SHAPE_PLURAL = { star: "estrelas", note: "notas musicais", mic: "microfones", skate: "patins" };
function sym(shape, color, label) {
  const c = SYM_COLORS[color] || color;
  const t = label ? `<title>${esc(label)}</title>` : "";
  let body = "";
  if (shape === "star") body = `<polygon points="${starPts(20, 21, 18, 8)}" fill="${c}" stroke="rgba(39,31,59,.18)" stroke-width="1" stroke-linejoin="round"/>`;
  else if (shape === "note") body = `<g fill="${c}"><ellipse cx="13.5" cy="29.5" rx="7" ry="5.2" transform="rotate(-22 13.5 29.5)"/><rect x="18.4" y="5" width="3.4" height="25" rx="1.7"/><path d="M20 5c4.5 1 10 3.5 10 10-2.4-3.3-5.6-4.5-10-4.5z"/></g>`;
  else if (shape === "mic") body = `<g><path d="M14 21.5h12l-3 13.5a3 3 0 0 1-6 0z" fill="#3B2860"/><circle cx="20" cy="13" r="10" fill="${c}"/><path d="M12 10.5h16M11 14.5h18M15.5 5.5v15M20 3v20M24.5 5.5v15" stroke="#fff" stroke-opacity=".38" stroke-width="1.3"/><rect x="13.5" y="21" width="13" height="3.2" rx="1.6" fill="${c}"/></g>`;
  else if (shape === "skate") body = `<g><path d="M8 5h11v14l7.5 1.2a5 5 0 0 1 4.5 5V28H8z" fill="${c}"/><path d="M8 9.5h11" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><rect x="6" y="28" width="28" height="3.4" rx="1.7" fill="#3B2860"/><circle cx="12.5" cy="34.5" r="3.6" fill="#3B2860"/><circle cx="27.5" cy="34.5" r="3.6" fill="#3B2860"/><circle cx="12.5" cy="34.5" r="1.3" fill="#fff"/><circle cx="27.5" cy="34.5" r="1.3" fill="#fff"/></g>`;
  return `<svg viewBox="0 0 40 40" aria-hidden="${label ? "false" : "true"}" ${label ? 'role="img"' : ""}>${t}${body}</svg>`;
}

/* Medalhas de conquista */
const MEDAL_COLORS = { lilas: ["#7656A8", "#9E83CE"], azul: ["#4F7FB3", "#8FB6DE"], coral: ["#C0606C", "#E9A4AD"], amarelo: ["#B98E1E", "#F2D47E"], agua: ["#2E8F7B", "#91D8C9"] };
function medalSVG(st, on = true, size = 64) {
  const [c1, c2] = on ? MEDAL_COLORS[st.cor] || MEDAL_COLORS.lilas : ["#B9B2C8", "#DDD8E6"];
  const id = "mg" + st.id + (on ? 1 : 0) + size;
  const ic = ICONS[st.medal] || ICONS.star;
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs>
    <path d="M22 44 16 61l7-3 4 6 5-16z" fill="${on ? "#E9A4AD" : "#D6D0E0"}"/><path d="M42 44l6 17-7-3-4 6-5-16z" fill="${on ? "#91D8C9" : "#D6D0E0"}"/>
    <circle cx="32" cy="28" r="24" fill="url(#${id})"/><circle cx="32" cy="28" r="19.5" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.5" stroke-dasharray="2 3"/>
    <g transform="translate(20 16)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic}</g>
    ${on ? `<polygon points="${starPts(52, 9, 5, 2.2)}" fill="#F2D47E"/>` : ""}</svg>`;
}

/* ---------- Áudio (sons suaves dos jogos e do temporizador) ---------- */
let AC = null;
function tone(freq = 440, dur = 0.25, type = "sine", vol = 0.18, when = 0) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    const t = AC.currentTime + when, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + dur + 0.05);
  } catch (e) {}
}
const chime = () => { tone(523, 0.3, "sine", 0.16); tone(659, 0.3, "sine", 0.16, 0.12); tone(784, 0.5, "sine", 0.16, 0.24); };
const softNo = () => tone(220, 0.22, "triangle", 0.1);

/* ---------- Progresso e conquistas ---------- */
const doneCount = () => STAGES.filter((s) => S.done[s.id]).length;
const allDone = () => doneCount() === STAGES.length;
let badgeQueue = [];
function checkStages() {
  const rules = {
    cerebro: () => Object.keys(S.efSeen).length >= EF_CARDS.length,
    tdah: () => Object.keys(S.quiz.ans).length >= QUIZ.length,
    comigo: () => Object.keys(S.cards.ans).length >= 10,
    desafios: () => Object.keys(S.games).length >= 3,
    ferramentas: () => Object.keys(S.toolsSeen).length >= 3,
    manual: () => S.manualDone,
  };
  STAGES.forEach((st) => { if (!S.done[st.id] && rules[st.id]()) completeStage(st.id, true); });
}
function completeStage(id, auto = false) {
  if (S.done[id]) return;
  S.done[id] = true; save(); badgeQueue.push(id); updateNav();
  if (!$("#modal-root").innerHTML) showNextBadge();
}
function showNextBadge() {
  const id = badgeQueue.shift(); if (!id) return;
  const st = STAGES.find((s) => s.id === id);
  const fim = allDone();
  burst();
  chime();
  openModal(`<div class="modal-body" style="text-align:center;padding-top:34px;align-items:center">
    <div class="badge-medal">${medalSVG(st, true, 120)}</div>
    <span class="eyebrow">${starFill(14)} Conquista desbloqueada</span>
    <h2>${st.badge}</h2>
    <p class="muted" style="max-width:36ch">${st.badgeMsg}. ${fim ? "Você completou todas as etapas do percurso!" : `Mais uma estrela no seu percurso: ${doneCount()} de ${STAGES.length}.`}</p>
    <div class="row" style="justify-content:center;margin-top:6px">
      ${fim ? `<a class="btn btn-primary" href="#final" data-act="closeModal">${icon("star")} Ver encerramento</a>` : `<button class="btn btn-primary" data-act="closeModal">Continuar</button>`}
      <a class="btn btn-ghost" href="#inicio" data-act="closeModal">Ver meu percurso</a>
    </div></div>`);
  updateNav();
  if ((location.hash || "#inicio") === "#inicio") positionSkater();
}
function burst() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const b = document.createElement("div"); b.className = "burst";
  const cols = ["#F2D47E", "#91D8C9", "#C6B2E8", "#E9A4AD", "#A9C9E9", "#7656A8"];
  for (let i = 0; i < 36; i++) {
    const s = document.createElement("i"); const size = 8 + Math.random() * 14;
    s.style.left = Math.random() * 100 + "vw"; s.style.animationDuration = 1.8 + Math.random() * 1.8 + "s"; s.style.animationDelay = Math.random() * 0.4 + "s";
    s.innerHTML = Math.random() > 0.35 ? `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><polygon points="${starPts(12, 12, 11, 4.6)}" fill="${pick(cols)}"/></svg>` : `<svg width="${size}" height="${size}" viewBox="0 0 40 40" style="color:${pick(cols)}"><g fill="currentColor"><ellipse cx="13.5" cy="29.5" rx="7" ry="5.2"/><rect x="18.4" y="5" width="3.4" height="25"/></g></svg>`;
    b.appendChild(s);
  }
  document.body.appendChild(b); setTimeout(() => b.remove(), 4200);
}

/* ---------- Modal e toast ---------- */
let lastFocus = null;
function openModal(html, opts = {}) {
  const root = $("#modal-root"); lastFocus = document.activeElement;
  root.innerHTML = `<div class="modal-bg" data-act="modalBg"><div class="modal ${opts.wide ? "wide" : ""}" role="dialog" aria-modal="true" aria-label="${esc(opts.label || "Janela")}"><button class="modal-close" data-act="closeModal" aria-label="Fechar">${icon("x")}</button>${html}</div></div>`;
  setTimeout(() => { const f = root.querySelector(".modal .btn, .modal-close"); f && f.focus(); }, 30);
}
function closeModal() {
  $("#modal-root").innerHTML = "";
  if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  if (badgeQueue.length) setTimeout(showNextBadge, 250);
}
A.closeModal = () => closeModal();
A.modalBg = (el, e) => { if (e.target === el) closeModal(); };
function toast(msg) {
  const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2800);
}

/* ---------- Impressão ---------- */
function printButtons(label = "Imprimir") {
  if (FRAMED) return `<div class="note lav no-print">${icon("info")}<span>Para imprimir ou salvar em PDF, baixe o arquivo <b>index.html</b> e abra no navegador do computador. Esta janela de visualização não permite impressão.</span></div>`;
  return `<button class="btn btn-roxo" data-act="print">${icon("printer")} ${label}</button><button class="btn btn-ghost" data-act="printPdf">${icon("share")} Salvar em PDF</button>`;
}
A.print = () => window.print();
A.printPdf = () => { toast("Na janela de impressão, escolha “Salvar como PDF” como destino."); setTimeout(() => window.print(), 600); };

/* ---------- Estrutura (menu) ---------- */
function renderShell() {
  document.getElementById("root").innerHTML = `
  <div class="topbar no-print">
    <button class="btn btn-soft btn-icon" data-act="openNav" aria-label="Abrir menu">${icon("menu")}</button>
    <span class="brand-title" id="tb-title">${esc(S.title)}</span>
    <span class="tb-prog" id="tb-prog" aria-hidden="true"></span>
  </div>
  <div class="scrim no-print" data-act="closeNav"></div>
  <div class="app">
    <aside class="sidebar no-print" id="sidebar" aria-label="Menu principal">
      <a class="brand" href="#inicio">
        <span class="brand-mark">${icon("mic", 22, 2)}</span>
        <span><span class="brand-title" id="side-title">${esc(S.title)}</span><br><span class="brand-sub">Seu mundo, seu ritmo, sua mente</span></span>
      </a>
      <div class="mini-progress" id="mini-progress"></div>
      <nav class="nav" id="nav"></nav>
      <div class="side-foot">
        <a href="#familia" data-nav="familia">${icon("users", 18)} Guia para a família</a>
        <a href="#referencias" data-nav="referencias">${icon("bookopen", 18)} Referências</a>
        <a href="#guia" data-nav="guia">${icon("clipboard", 18)} Guia da sessão</a>
        <button data-act="askReset">${icon("refresh", 18)} Reiniciar a jornada</button>
      </div>
    </aside>
    <main id="main"><div id="view"></div></main>
  </div>
  <div id="modal-root"></div>`;
  updateNav();
}
function updateNav() {
  const cur = (location.hash || "#inicio").slice(1);
  const nav = $("#nav"); if (!nav) return;
  nav.innerHTML = `<a href="#inicio" class="${cur === "inicio" ? "active" : ""}"><span class="ni">${icon("home", 18)}</span>Início</a>
    <div class="nav-label">Etapas da jornada</div>
    ${STAGES.map((s) => `<a href="#${s.id}" class="${cur === s.id || (s.id === "manual" && cur === "resumo") ? "active" : ""}"><span class="ni">${icon(s.icon, 18)}</span><span><span class="nnum">Etapa ${s.n}</span><br>${s.nome}</span><span class="nstate ${S.done[s.id] ? "done" : ""}" title="${S.done[s.id] ? "Concluída" : "A explorar"}">${S.done[s.id] ? starFill(16) : icon("star", 16)}</span></a>`).join("")}`;
  const n = doneCount();
  $("#mini-progress").innerHTML = `<div class="row" style="justify-content:space-between;gap:6px"><b style="font-size:.85rem;color:var(--roxo-900)">Seu percurso</b><span style="font-size:.8rem;color:var(--muted);font-weight:700">${n} de ${STAGES.length}</span></div>
    <div class="bar"><span style="width:${(n / STAGES.length) * 100}%"></span></div>
    <div class="stars">${STAGES.map((s) => `<span class="${S.done[s.id] ? "on" : ""}" title="${s.badge}">${starFill(15)}</span>`).join("")}</div>`;
  $("#tb-prog").innerHTML = STAGES.map((s) => `<span class="${S.done[s.id] ? "on" : ""}">${starFill(13)}</span>`).join("");
  $$(".side-foot a").forEach((a) => a.classList.toggle("active", a.dataset.nav === cur || (a.dataset.nav === "familia" && cur === "familia-compartilhar")));
  $("#side-title").textContent = S.title; $("#tb-title").textContent = S.title;
}
A.openNav = () => { $("#sidebar").classList.add("open"); $(".scrim").classList.add("open"); };
A.closeNav = () => { $("#sidebar").classList.remove("open"); $(".scrim").classList.remove("open"); };

A.askReset = () => {
  openModal(`<div class="modal-head"><div class="icon-blob b-coral">${icon("refresh", 24)}</div><div><h2>Reiniciar a jornada?</h2><p class="muted" style="margin-top:6px">Todas as respostas, anotações e conquistas desta sessão serão apagadas deste navegador. Essa ação não pode ser desfeita.</p></div></div>
  <div class="modal-body"><div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-roxo" data-act="doReset">${icon("refresh", 18)} Reiniciar</button></div></div>`, { label: "Reiniciar" });
};
A.doReset = () => {
  const title = S.title; stopAllGames(); stopTimer(true);
  S = DEFAULT_STATE(); S.title = title; save(); badgeQueue = [];
  closeModal(); location.hash = "#inicio"; route(); toast("Jornada reiniciada.");
};

/* ---------- Roteador ---------- */
const VIEWS = {};
function route() {
  const h = (location.hash || "#inicio").slice(1);
  const key = VIEWS[h] ? h : "inicio";
  document.body.classList.toggle("standalone", key === "familia-compartilhar");
  if (key !== "desafios") stopAllGames();
  const v = $("#view");
  v.innerHTML = `<div class="view" id="v-${key}">${VIEWS[key].render()}</div>`;
  VIEWS[key].mount && VIEWS[key].mount();
  updateNav(); A.closeNav();
  window.scrollTo(0, 0);
  const h1 = v.querySelector("h1"); if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
}

/* ---------- Partes comuns de seção ---------- */
function secHead(id, title, lead) {
  const st = STAGES.find((s) => s.id === id);
  return `<header class="sec-head"><div><span class="eyebrow">${icon(st.icon, 16)} Etapa ${st.n} de ${STAGES.length}</span><h1 style="margin-top:8px">${title}</h1><p class="lead">${lead}</p></div>
  <div class="stage-badge ${S.done[id] ? "done" : ""}" id="sb-${id}">${medalSVG(st, !!S.done[id], 36)}<span>${S.done[id] ? "Conquista: " + st.badge : "A conquistar: " + st.badge}</span></div></header>`;
}
function stageFoot(id) {
  const st = STAGES.find((s) => s.id === id); const i = STAGES.indexOf(st); const next = STAGES[i + 1]; const done = !!S.done[id];
  const nextBtn = next ? `<a class="btn btn-primary" href="#${next.id}">Próxima: ${next.nome} ${icon("arrowR", 18)}</a>` : `<a class="btn btn-primary" href="#${allDone() ? "final" : "inicio"}">${allDone() ? "Ver encerramento" : "Ver meu percurso"} ${icon("arrowR", 18)}</a>`;
  return `<section class="stage-foot no-print" id="foot-${id}"><div><h3>${done ? "Etapa concluída!" : "Terminou de explorar esta etapa?"}</h3><p class="muted">${done ? `A estrela <b>${st.badge}</b> já brilha no seu percurso.` : `Ao concluir, você recebe a conquista <b>${st.badge}</b> e pode voltar a esta etapa quando quiser.`}</p></div>
  <div class="row">${done ? "" : `<button class="btn btn-roxo" data-act="completeStage" data-id="${id}">${starFill(16)} Concluir esta etapa</button>`}${nextBtn}</div></section>`;
}
A.completeStage = (el) => { completeStage(el.dataset.id); refreshStageChrome(el.dataset.id); };
function refreshStageChrome(id) {
  const f = $("#foot-" + id); if (f) f.outerHTML = stageFoot(id);
  const sb = $("#sb-" + id); if (sb) { const st = STAGES.find((s) => s.id === id); sb.className = "stage-badge done"; sb.innerHTML = `${medalSVG(st, true, 36)}<span>Conquista: ${st.badge}</span>`; }
}
function afterProgress(id) { const before = !!S.done[id]; checkStages(); if (!before && S.done[id]) refreshStageChrome(id); }
function sectionTitle(t, ic) { return `<div class="sec-title">${ic ? `<span class="icon-blob b-lilas" style="width:40px;height:40px;border-radius:12px">${icon(ic, 20)}</span>` : ""}<h2>${t}</h2><span class="ln"></span></div>`; }
function reflectBox(q, label = "Para conversar") { return `<div class="reflect"><span style="color:var(--amarelo-800)">${icon("chat", 22)}</span><div><div class="rl">${label}</div><div class="rq">${q}</div></div></div>`; }

/* =========================================================
   ILUSTRAÇÕES
   ========================================================= */
function heroArt(variant = "hero") {
  const st = (x, y, R, cls, col) => `<polygon class="twinkle ${cls}" points="${starPts(x, y, R, R * 0.44)}" fill="${col}"/>`;
  const nt = (x, y, s, col, cls = "") => `<g class="floaty ${cls}" transform="translate(${x} ${y}) scale(${s})"><g fill="${col}"><ellipse cx="13.5" cy="29.5" rx="7" ry="5.2" transform="rotate(-22 13.5 29.5)"/><rect x="18.4" y="5" width="3.4" height="25" rx="1.7"/><path d="M20 5c4.5 1 10 3.5 10 10-2.4-3.3-5.6-4.5-10-4.5z"/></g></g>`;
  return `<svg viewBox="0 0 520 440" role="img" aria-label="Ilustração de um palco com holofotes, um patins, um microfone, estrelas e notas musicais" preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="beamG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D47E" stop-opacity=".55"/><stop offset="1" stop-color="#F2D47E" stop-opacity="0"/></linearGradient>
    <linearGradient id="beamG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#91D8C9" stop-opacity=".5"/><stop offset="1" stop-color="#91D8C9" stop-opacity="0"/></linearGradient>
    <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="curt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5C4290"/><stop offset="1" stop-color="#8C6CC0"/></linearGradient>
    <clipPath id="micClip"><circle cx="0" cy="0" r="40"/></clipPath>
  </defs>
  <polygon class="beam" points="120,-10 150,-10 300,420 40,420" fill="url(#beamG)"/>
  <polygon class="beam b2" points="390,-10 420,-10 480,420 230,420" fill="url(#beamG2)"/>
  <circle cx="270" cy="250" r="190" fill="url(#glow)"/>
  <ellipse cx="270" cy="404" rx="230" ry="30" fill="#E2D7F4"/>
  <ellipse cx="270" cy="400" rx="170" ry="18" fill="#C6B2E8" opacity=".6"/>
  ${variant === "hero" ? `<path d="M520 0v300c-30-40-40-120-30-190C498 60 505 25 520 0z" fill="url(#curt)" opacity=".9"/><path d="M500 30c-6 60-4 140 14 220" stroke="#fff" stroke-opacity=".18" stroke-width="3" fill="none"/>` : ""}
  <path d="M30 352c60-30 140-26 210 4s170 20 250-16" stroke="#91D8C9" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round" fill="none"/>
  <g class="roll" transform="translate(70 214)">
    <path d="M30 10Q30 0 40 0h48q10 0 10 10l2 52q50 4 68 26 6 8 6 16v8H30z" fill="#fff" stroke="#3B2860" stroke-width="4" stroke-linejoin="round"/>
    <rect x="32" y="14" width="66" height="12" rx="4" fill="#C6B2E8"/>
    <path d="M66 36h30M66 47h32M68 58h32" stroke="#7656A8" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M40 84q50-12 92 6" stroke="#E9A4AD" stroke-width="7" stroke-linecap="round" fill="none"/>
    <rect x="24" y="110" width="158" height="13" rx="6.5" fill="#3B2860"/>
    <rect x="176" y="108" width="18" height="22" rx="7" fill="#E9A4AD" stroke="#3B2860" stroke-width="3"/>
    <circle cx="54" cy="138" r="18" fill="#91D8C9" stroke="#3B2860" stroke-width="4"/><circle cx="54" cy="138" r="6" fill="#fff"/>
    <circle cx="150" cy="138" r="18" fill="#91D8C9" stroke="#3B2860" stroke-width="4"/><circle cx="150" cy="138" r="6" fill="#fff"/>
  </g>
  <g transform="translate(355 118) rotate(20)">
    <path d="M-24 48h48l-12 128q-12 12-24 0z" fill="#3B2860"/>
    <rect x="-16" y="104" width="32" height="8" rx="3" fill="#91D8C9"/>
    <circle cx="0" cy="0" r="42" fill="#7656A8"/>
    <g clip-path="url(#micClip)" stroke="#fff" stroke-opacity=".35" stroke-width="2.5"><path d="M-50 -20h100M-50 -6h100M-50 8h100M-50 22h100M-24 -50v100M-8 -50v100M8 -50v100M24 -50v100"/></g>
    <ellipse cx="-14" cy="-18" rx="12" ry="7" fill="#fff" opacity=".35" transform="rotate(-30 -14 -18)"/>
    <rect x="-30" y="36" width="60" height="16" rx="6" fill="#F2D47E"/>
  </g>
  <path d="M418 74q22 20 6 48M436 58q34 32 10 80" stroke="#7656A8" stroke-width="4" stroke-linecap="round" fill="none" opacity=".45"/>
  ${nt(220, 70, 1.3, "#7656A8")}${nt(300, 260, 1, "#91D8C9", "f2")}${nt(60, 120, 0.9, "#E9A4AD", "f2")}${nt(455, 210, 0.8, "#A9C9E9")}
  ${st(190, 168, 16, "", "#F2D47E")}${st(470, 40, 12, "t2", "#F2D47E")}${st(90, 60, 10, "t3", "#91D8C9")}${st(262, 40, 8, "t2", "#E9A4AD")}${st(36, 260, 9, "", "#C6B2E8")}${st(470, 320, 11, "t3", "#F2D47E")}${st(330, 340, 7, "", "#7656A8")}
  </svg>`;
}

/* =========================================================
   INÍCIO
   ========================================================= */
VIEWS.inicio = {
  render() {
    const n = doneCount();
    const firstOpen = STAGES.find((s) => !S.done[s.id]);
    const cta = n === 0 ? "Começar minha jornada" : allDone() ? "Ver encerramento" : "Continuar minha jornada";
    const ctaHref = allDone() ? "#final" : "#" + (firstOpen ? firstOpen.id : "cerebro");
    return `
    <section class="hero">
      <div class="hero-text">
        <div class="hero-title-slot e-in" title="Título do projeto (editável no Guia da sessão)">${starFill(14)} ${esc(S.title)}</div>
        <h1 class="e-in d1">Seu mundo, seu ritmo,<span class="accent">sua mente.</span></h1>
        <p class="sub e-in d2">Cada pessoa tem seu próprio jeito de pensar, sentir, aprender e enxergar o mundo. Que tal descobrir um pouco mais sobre o seu?</p>
        <div class="cta e-in d3"><a class="btn btn-primary" href="${ctaHref}" style="font-size:1.05rem;padding:15px 26px">${icon("play", 18)} ${cta}</a><button class="btn btn-ghost" data-act="scrollTo" data-target="percurso">Ver as etapas</button></div>
      </div>
      <div class="hero-art e-in d2">${heroArt()}</div>
    </section>

    <section class="stack" style="margin-top:36px" id="percurso">
      <div class="row" style="justify-content:space-between"><div><span class="eyebrow">${icon("skate", 16)} Seu percurso</span><h2 style="margin-top:6px">Uma pista com seis paradas</h2></div><span class="tag ${n ? "amarelo" : ""}">${starFill(13)} ${n} de ${STAGES.length} estrelas</span></div>
      <p class="muted prose">Cada etapa é uma parada na pista. Você pode seguir a ordem ou escolher por onde começar. A cada etapa concluída, uma estrela se acende e você recebe uma conquista.</p>
      <div class="track">${trackSVG()}<div class="track-legend">${STAGES.map((s) => `<a href="#${s.id}" class="${S.done[s.id] ? "done" : ""}">${s.curto}<small>${S.done[s.id] ? s.badge : "Etapa " + s.n}</small></a>`).join("")}</div></div>
    </section>

    <section class="steps-grid" style="margin-top:22px">
      ${STAGES.map((s) => `<a class="step-card ${S.done[s.id] ? "done" : ""}" href="#${s.id}"><div class="st"><span class="icon-blob b-${s.cor}">${icon(s.icon, 24)}</span><span class="sn">0${s.n}</span></div><h3>${s.nome}</h3><p>${s.resumo}</p><span class="badge-line">${S.done[s.id] ? starFill(14) : icon("star", 14)} ${S.done[s.id] ? "Conquista: " + s.badge : "Conquista: " + s.badge}</span></a>`).join("")}
    </section>

    <section class="stack" style="margin-top:40px">
      ${sectionTitle("Suas conquistas", "trophy")}
      <div class="badges-row">${STAGES.map((s) => `<div class="bdg ${S.done[s.id] ? "" : "off"}">${medalSVG(s, !!S.done[s.id], 64)}<b>${s.badge}</b><small>${s.badgeMsg}</small></div>`).join("")}</div>
      <p class="muted" style="font-size:.9rem">As conquistas valorizam a exploração e a curiosidade. Aqui não há notas, acertos ou pontuações.</p>
    </section>`;
  },
  mount() { positionSkater(); },
};
A.scrollTo = (el) => { const t = document.getElementById(el.dataset.target); t && t.scrollIntoView({ behavior: "smooth", block: "start" }); };

const TRACK_D = "M30,120 C120,30 200,30 260,90 S380,160 450,100 S580,20 650,80 S780,150 840,90 S940,40 975,60";
function trackSVG() {
  return `<svg class="track-svg" viewBox="0 0 1000 170" role="img" aria-label="Pista de patinação com seis paradas: ${doneCount()} concluídas">
    <path d="${TRACK_D}" fill="none" stroke="#F0EAFA" stroke-width="30" stroke-linecap="round"/>
    <path id="trackPath" d="${TRACK_D}" fill="none" stroke="#C6B2E8" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/>
    <path id="trackDone" d="${TRACK_D}" fill="none" stroke="#91D8C9" stroke-width="6" stroke-linecap="round" stroke-dasharray="0 9999"/>
    <g id="trackStops"></g>
    <g id="skater" class="skater"><g transform="translate(-22 -58)"><circle cx="22" cy="30" r="26" fill="#fff" opacity=".9"/><g transform="translate(4 8) scale(.9)">${sym("skate", "roxo").replace("<svg", '<svg width="40" height="40"')}</g></g></g>
  </svg>`;
}
function positionSkater() {
  const p = $("#trackPath"); if (!p) return;
  const L = p.getTotalLength(); const stops = STAGES.map((s, i) => (L * (i + 0.6)) / (STAGES.length + 0.2));
  $("#trackStops").innerHTML = STAGES.map((s, i) => {
    const pt = p.getPointAtLength(stops[i]); const on = !!S.done[s.id];
    return `<a href="#${s.id}" aria-label="${s.nome}"><g transform="translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})"><circle r="21" fill="${on ? "#F2D47E" : "#fff"}" stroke="${on ? "#D9B44A" : "#C6B2E8"}" stroke-width="3"/>${on ? `<polygon points="${starPts(0, 1, 12, 5.2)}" fill="#fff"/>` : `<text y="6" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="700" font-size="17" fill="#7656A8">${s.n}</text>`}</g></a>`;
  }).join("");
  const n = doneCount(); const at = n === 0 ? 0 : stops[Math.min(n, STAGES.length) - 1];
  const pt = p.getPointAtLength(at);
  $("#skater").setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
  $("#trackDone").setAttribute("stroke-dasharray", `${at} 9999`);
}

/* =========================================================
   ABA 1 — MEU CÉREBRO
   ========================================================= */
const LOBE_PATHS = {
  frontal: "M70,175 C40,140 45,85 95,55 C125,38 160,30 197,30 C197,70 192,98 182,118 C160,128 140,140 128,160 C110,178 88,185 70,175 Z",
  parietal: "M197,30 C245,28 295,45 322,75 C315,95 300,108 285,115 C255,118 215,118 182,118 C192,98 197,70 197,30 Z",
  occipital: "M322,75 C350,100 360,140 347,172 C330,176 312,170 300,160 C298,140 292,125 285,115 C300,108 315,95 322,75 Z",
  temporal: "M128,160 C140,140 160,128 182,118 C215,118 255,118 285,115 C292,125 298,140 300,160 C285,185 250,200 210,202 C170,204 140,190 128,160 Z",
  cerebelo: "M290,178 C310,170 335,172 349,178 C353,200 330,222 300,220 C280,218 270,200 290,178 Z",
};
const LOBE_LABELS = { frontal: [112, 110, "Frontal"], parietal: [252, 76, "Parietal"], occipital: [322, 140, "Occip."], temporal: [222, 175, "Temporal"], cerebelo: [316, 202, "Cerebelo"] };
function brainSVG() {
  const sel = S.brainSel;
  return `<svg class="brain-svg ${sel ? "has-sel" : ""}" viewBox="20 10 360 270" role="group" aria-label="Mapa interativo do cérebro">
    <path d="M238,196 C246,204 258,204 266,198 L272,262 C264,272 248,272 240,262 Z" fill="#DDD3EE" stroke="#fff" stroke-width="3"/>
    ${BRAIN_REGIONS.map((r) => `<path class="lobe ${sel === r.id ? "sel" : ""}" d="${LOBE_PATHS[r.id]}" fill="${r.cor}" tabindex="0" role="button" aria-label="${r.nome}" data-act="brainSel" data-id="${r.id}"><title>${r.nome}</title></path>`).join("")}
    <g fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.2" stroke-linecap="round" pointer-events="none">
      <path d="M95,92 C115,86 128,98 150,92"/><path d="M80,135 C100,128 112,140 135,132"/><path d="M150,55 C160,70 175,70 182,85"/>
      <path d="M225,52 C238,66 255,64 270,80"/><path d="M290,62 C292,80 305,88 312,98"/><path d="M160,160 C190,152 225,162 262,150"/><path d="M325,110 C335,125 332,140 340,152"/><path d="M296,196 C312,190 328,194 342,190"/><path d="M290,207 C308,204 322,210 336,204"/>
    </g>
    ${BRAIN_REGIONS.map((r) => { const [x, y, t] = LOBE_LABELS[r.id]; return `<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`; }).join("")}
    ${BRAIN_DEEP.map((d) => `<g class="deep ${sel === d.id ? "sel" : ""}" tabindex="0" role="button" aria-label="${d.nome}" data-act="brainSel" data-id="${d.id}"><title>${d.nome}</title><circle class="pulse" cx="${d.x}" cy="${d.y}" r="8" fill="${d.cor}"/><circle class="core" cx="${d.x}" cy="${d.y}" r="8" fill="${d.cor}" stroke="#3B2860" stroke-width="2"/></g>`).join("")}
  </svg>`;
}
function regionPanel() {
  const all = BRAIN_REGIONS.concat(BRAIN_DEEP); const r = all.find((x) => x.id === S.brainSel);
  if (!r) return `<div class="card region-panel" style="justify-content:center"><span class="icon-blob b-lilas">${icon("brain", 26)}</span><h3>Toque em uma região do cérebro</h3><p class="muted">As cores indicam as grandes regiões, chamadas <b>lobos</b>. Os pontos pulsantes indicam estruturas localizadas na parte interna do cérebro.</p><div class="brain-legend">${all.map((x) => `<button class="chip" data-act="brainSel" data-id="${x.id}"><span style="width:10px;height:10px;border-radius:50%;background:${x.cor}"></span>${x.nome.split(" (")[0].replace("Núcleos da base e sistema de recompensa", "Núcleos da base")}</button>`).join("")}</div></div>`;
  return `<div class="card region-panel" aria-live="polite"><div class="row" style="gap:12px;align-items:flex-start;flex-wrap:nowrap"><span class="icon-blob" style="background:${r.cor}33;color:var(--roxo-900)"><span style="width:20px;height:20px;border-radius:50%;background:${r.cor}"></span></span><div><span class="hand">${r.apelido}</span><h3 style="margin-top:2px">${r.nome}</h3></div></div>
    <p>${r.texto}</p>
    <div class="rp-fn">${r.fn.map((f) => `<span class="tag agua">${f}</span>`).join("")}</div>
    <div class="note lav">${icon("music" in ICONS ? "music" : "note")}<span><b>No dia a dia:</b> ${r.exemplo}</span></div>
    <div class="row"><button class="btn btn-ghost btn-sm" data-act="brainSel" data-id="">${icon("arrowL", 16)} Ver todas as regiões</button></div></div>`;
}
A.brainSel = (el) => { S.brainSel = el.dataset.id || null; save(); $("#brain-svg-wrap").innerHTML = brainSVG(); $("#region-panel").innerHTML = regionPanel(); };
function flowDetail() {
  const f = BRAIN_FLOW[S.flowIdx];
  return `<div class="card flat lav flow-detail" aria-live="polite"><div class="row" style="justify-content:space-between"><h3>${S.flowIdx + 1}. ${f.nome} <span class="muted" style="font-weight:500;font-size:.95rem">· ${f.sub}</span></h3><div class="row" style="gap:6px"><button class="btn btn-ghost btn-icon btn-sm" data-act="flowStep" data-d="-1" aria-label="Passo anterior" ${S.flowIdx === 0 ? "disabled" : ""}>${icon("left")}</button><button class="btn btn-ghost btn-icon btn-sm" data-act="flowStep" data-d="1" aria-label="Próximo passo" ${S.flowIdx === BRAIN_FLOW.length - 1 ? "disabled" : ""}>${icon("right")}</button></div></div><p style="margin-top:8px">${f.texto}</p></div>`;
}
function flowButtons() { return BRAIN_FLOW.map((f, i) => `<button class="${i === S.flowIdx ? "on" : ""}" data-act="flowSel" data-i="${i}" aria-pressed="${i === S.flowIdx}"><span class="fi">${icon(f.icon, 22)}</span>${f.nome}<small>${f.sub}</small></button>`).join(""); }
A.flowSel = (el) => { S.flowIdx = +el.dataset.i; save(); $("#flow").innerHTML = flowButtons(); $("#flow-detail").innerHTML = flowDetail(); };
A.flowStep = (el) => { S.flowIdx = Math.max(0, Math.min(BRAIN_FLOW.length - 1, S.flowIdx + +el.dataset.d)); save(); $("#flow").innerHTML = flowButtons(); $("#flow-detail").innerHTML = flowDetail(); };
function conceptArea() {
  const c = BRAIN_CONCEPTS.find((x) => x.nome === S.concept);
  return `<div class="concepts">${BRAIN_CONCEPTS.map((x) => `<button class="chip agua ${S.concept === x.nome ? "on" : ""}" data-act="concept" data-n="${x.nome}" aria-pressed="${S.concept === x.nome}">${x.nome}</button>`).join("")}</div>
  ${c ? `<div class="note agua" style="margin-top:12px" aria-live="polite">${icon("bulb")}<span><b>${c.nome}:</b> ${c.texto}</span></div>` : `<p class="muted" style="margin-top:10px;font-size:.92rem">Toque em uma palavra para ver o que ela significa.</p>`}`;
}
A.concept = (el) => { S.concept = S.concept === el.dataset.n ? null : el.dataset.n; save(); $("#concepts").innerHTML = conceptArea(); };
function efGrid() {
  return EF_CARDS.map((c, i) => `<button class="ef-card" data-act="efOpen" data-id="${c.id}"><span class="seen" title="${S.efSeen[c.id] ? "Já explorado" : ""}">${S.efSeen[c.id] ? starFill(18) : ""}</span><span class="icon-blob b-${c.cor}">${icon(c.icon, 24)}</span><span class="ef-nick">${c.apelido}</span><h3>${i + 1}. ${c.titulo}</h3><span class="open-hint">${S.efSeen[c.id] ? "Ver de novo" : "Abrir card"} ${icon("arrowR", 16)}</span></button>`).join("");
}
A.efOpen = (el) => {
  const c = EF_CARDS.find((x) => x.id === el.dataset.id);
  S.efSeen[c.id] = true; save();
  openModal(`<div class="modal-head"><span class="icon-blob b-${c.cor}">${icon(c.icon, 26)}</span><div><span class="hand">${c.apelido}</span><h2>${c.titulo}</h2></div></div>
  <div class="modal-body">
    <div class="kv"><span class="k">O que é</span><p>${c.explicacao}</p></div>
    <div class="kv"><span class="k">No cérebro</span><p>${c.cerebro}</p></div>
    <div class="kv"><span class="k">No dia a dia</span><p>${c.exemplo}</p></div>
    ${reflectBox(c.pergunta, "Pergunta para reflexão")}
    <div class="row" style="justify-content:space-between"><span class="muted" style="font-size:.88rem">${Object.keys(S.efSeen).length} de ${EF_CARDS.length} cards explorados</span>${nextEfButton(c.id)}</div>
  </div>`, { label: c.titulo });
  $("#ef-grid").innerHTML = efGrid();
  afterProgress("cerebro");
};
function nextEfButton(id) {
  const i = EF_CARDS.findIndex((x) => x.id === id); const nx = EF_CARDS[i + 1];
  return nx ? `<button class="btn btn-primary btn-sm" data-act="efNext" data-id="${nx.id}">Próximo: ${nx.titulo} ${icon("arrowR", 16)}</button>` : `<button class="btn btn-primary btn-sm" data-act="closeModal">Fechar</button>`;
}
A.efNext = (el) => { $("#modal-root").innerHTML = ""; A.efOpen(el); };

VIEWS.cerebro = {
  render() {
    return `${secHead("cerebro", "Meu cérebro", "Antes de falar sobre o TDAH, é importante conhecer o órgão onde tudo acontece. Explore o mapa, acompanhe o caminho da informação e descubra as habilidades que ajudam você a alcançar seus objetivos.")}
    <div class="stack-lg">
      <section class="grid g2" style="align-items:stretch">
        <div class="card stack"><span class="eyebrow">${icon("brain", 16)} O que é o cérebro?</span>${BRAIN_INTRO.map((p) => `<p>${p}</p>`).join("")}</div>
        <div class="panel stack" style="background:linear-gradient(140deg,var(--lilas-100),var(--agua-100))"><span class="hand" style="font-size:1.7rem">Uma banda afinada</span><p>Em um show, há quem cante, quem toque guitarra, quem cuide das luzes e quem controle o som. Se alguém entra fora do tempo, todos percebem. O cérebro funciona de forma parecida: nenhuma região trabalha sozinha, e todas precisam se comunicar e se coordenar.</p><div class="row" style="gap:6px">${["Neurônios", "Sinapses", "Neurotransmissores", "Redes"].map((t) => `<span class="tag">${t}</span>`).join("")}</div></div>
      </section>

      <section>
        ${sectionTitle("Explore o mapa do cérebro", "eye")}
        <div class="brain-wrap"><div class="brain-stage"><div id="brain-svg-wrap">${brainSVG()}</div><p class="muted" style="font-size:.82rem;text-align:center;margin-top:4px">Vista lateral do cérebro, com a testa à esquerda. Ilustração simplificada.</p></div><div id="region-panel">${regionPanel()}</div></div>
      </section>

      <section>
        ${sectionTitle("Como a informação viaja", "route")}
        <p class="muted prose" style="margin-bottom:14px">Imagine que a professora explica a coreografia nova. Do momento em que você ouve até o momento em que executa o passo, a informação percorre um caminho. Toque em cada etapa:</p>
        <div class="flow" id="flow">${flowButtons()}</div>
        <div id="flow-detail">${flowDetail()}</div>
      </section>

      <section>
        ${sectionTitle("Palavras importantes", "bulb")}
        <div id="concepts">${conceptArea()}</div>
      </section>

      <section>
        ${sectionTitle("As funções executivas", "sliders")}
        <div class="grid g2" style="margin-bottom:18px;align-items:center"><p class="prose">${EF_INTRO}</p><div class="note amarelo">${icon("star")}<span>Abra os <b>seis cards</b> abaixo. Cada um apresenta uma habilidade, um exemplo do dia a dia e uma pergunta para reflexão.</span></div></div>
        <div class="ef-grid" id="ef-grid">${efGrid()}</div>
      </section>
    </div>
    ${stageFoot("cerebro")}`;
  },
  mount() {
    $("#v-cerebro").addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-act=brainSel]")) { e.preventDefault(); A.brainSel(e.target.closest("[data-act]")); } });
  },
};

/* =========================================================
   ABA 2 — DESVENDANDO O TDAH
   ========================================================= */
function chapterBody() {
  const c = TDAH_CHAPTERS[S.chapter]; S.chaptersRead[c.id] = true; save();
  let extra = "";
  if (c.trio) extra = `<p>Os sinais do TDAH costumam ser descritos em três grupos. Cada pessoa pode ter mais sinais de um grupo do que de outro.</p><div class="trio">${TDAH_TRIO.map((t) => `<div class="card flat" style="background:var(--${t.cor}-100);border-color:transparent"><div class="row" style="gap:10px;margin-bottom:10px"><span class="icon-blob b-${t.cor}" style="background:#fff">${icon(t.icon, 22)}</span><h3>${t.nome}</h3></div><ul class="ticks">${t.itens.map((i) => `<li>${i}</li>`).join("")}</ul></div>`).join("")}</div>`;
  if (c.impactos) extra = `<p>O TDAH pode influenciar diferentes áreas da vida. Isso varia muito de pessoa para pessoa e também depende do apoio e das estratégias disponíveis.</p><div class="grid g2">${TDAH_IMPACTOS.map((t) => `<div class="card flat"><div class="row" style="gap:10px;margin-bottom:8px"><span class="icon-blob b-lilas" style="width:42px;height:42px">${icon(t.icon, 20)}</span><h3>${t.nome}</h3></div><p>${t.texto}</p></div>`).join("")}</div>`;
  return `<article class="card chapter stack" aria-live="polite"><span class="eyebrow">Capítulo ${S.chapter + 1} de ${TDAH_CHAPTERS.length}</span><h2>${c.titulo}</h2><div class="prose stack">${c.html}</div>${extra}
    <div class="note lav">${icon("star")}<span>${c.destaque}</span></div>
    <div class="q-nav"><button class="btn btn-ghost btn-sm" data-act="chapStep" data-d="-1" ${S.chapter === 0 ? "disabled" : ""}>${icon("arrowL", 16)} Anterior</button>${S.chapter < TDAH_CHAPTERS.length - 1 ? `<button class="btn btn-primary btn-sm" data-act="chapStep" data-d="1">Próximo capítulo ${icon("arrowR", 16)}</button>` : `<button class="btn btn-primary btn-sm" data-act="scrollTo" data-target="quiz">Ir para o quiz ${icon("arrowR", 16)}</button>`}</div></article>`;
}
function chapterNav() { return TDAH_CHAPTERS.map((c, i) => `<button class="${i === S.chapter ? "on" : ""} ${S.chaptersRead[c.id] ? "read" : ""}" data-act="chapSel" data-i="${i}" aria-current="${i === S.chapter}"><span class="cn">${S.chaptersRead[c.id] && i !== S.chapter ? icon("check", 14, 2.4) : i + 1}</span>${c.titulo}</button>`).join(""); }
function renderChapters() { $("#chap-body").innerHTML = chapterBody(); $("#chap-nav").innerHTML = chapterNav(); }
A.chapSel = (el) => { S.chapter = +el.dataset.i; renderChapters(); };
A.chapStep = (el) => { S.chapter = Math.max(0, Math.min(TDAH_CHAPTERS.length - 1, S.chapter + +el.dataset.d)); renderChapters(); $("#chap-body").scrollIntoView({ behavior: "smooth", block: "nearest" }); };

function eqArea() {
  const sc = TDAH_EQ.cenas.find((c) => c.id === S.eqScene) || TDAH_EQ.cenas[0];
  const bars = (v, k) => Array.from({ length: 5 }, (_, i) => { const h = Math.max(8, Math.min(100, v * 10 + [-14, -4, 6, -8, 2][(i + k) % 5])); return `<i style="height:${h}%"></i>`; }).join("");
  return `<div class="row" style="gap:8px;margin-bottom:14px">${TDAH_EQ.cenas.map((c) => `<button class="chip ${c.id === sc.id ? "on" : ""}" data-act="eqScene" data-id="${c.id}" aria-pressed="${c.id === sc.id}">${c.nome}</button>`).join("")}</div>
  <div class="grid g2" style="align-items:center"><div class="eq" role="img" aria-label="Mesa de som: ${TDAH_EQ.canais.map((n, i) => n + " " + sc.canais[i] + " de 10").join(", ")}">${TDAH_EQ.canais.map((n, i) => `<div class="ch"><div class="bars">${bars(sc.canais[i], i)}</div><span>${n}</span></div>`).join("")}</div>
  <div class="stack"><p style="font-weight:600">${sc.texto}</p><p class="muted" style="font-size:.9rem">${TDAH_EQ.rodape}</p></div></div>`;
}
A.eqScene = (el) => { S.eqScene = el.dataset.id; save(); $("#eq-area").innerHTML = eqArea(); };

function quizBody() {
  const total = QUIZ.length, answered = Object.keys(S.quiz.ans).length;
  const dots = `<div class="q-dots" role="tablist" aria-label="Afirmações">${QUIZ.map((q, i) => `<button class="${i === S.quiz.idx ? "cur" : S.quiz.ans[i] ? "ans" : ""}" data-act="quizGo" data-i="${i}" aria-label="Afirmação ${i + 1}">${i + 1}</button>`).join("")}</div>`;
  if (S.quiz.idx >= total) {
    return `${dots}<div class="q-card"><div class="badge-medal" style="width:90px;height:90px">${medalSVG(STAGES[1], true, 90)}</div><h2 style="margin-top:12px">Você explorou as ${total} afirmações!</h2><p class="muted" style="max-width:46ch;margin:10px auto 18px">Mitos sobre o TDAH são muito comuns. Conhecer informações corretas ajuda você a compreender melhor a si mesma.</p>${reflectBox("Qual dessas afirmações mais surpreendeu você? Alguma você já tinha ouvido de alguém?")}<div class="row" style="justify-content:center;margin-top:18px"><button class="btn btn-ghost" data-act="quizRestart">${icon("refresh", 18)} Recomeçar o quiz</button></div></div>`;
  }
  const q = QUIZ[S.quiz.idx], a = S.quiz.ans[S.quiz.idx];
  let fb = "";
  if (a) {
    const hit = a === q.r;
    const verdict = q.r === "mito" ? "esta afirmação é um mito" : "esta afirmação é verdadeira";
    const head = hit ? `Correto: ${verdict}.` : q.r === "mito" ? "Esta afirmação é um mito, embora seja uma ideia comum." : "Esta afirmação é verdadeira.";
    fb = `<div class="q-feedback"><div class="q-verdict ${q.r}">${q.r === "mito" ? icon("x", 22, 2.4) : icon("check", 22, 2.4)} ${head}</div><p>${q.e}</p></div>`;
  }
  return `${dots}<div class="q-card"><span class="tag">Afirmação ${S.quiz.idx + 1} de ${total}</span><p class="q-text">“${q.q}”</p>
    <div class="q-opts"><button class="q-opt mito ${a === "mito" ? "picked" : ""}" data-act="quizAns" data-v="mito" ${a ? "disabled" : ""}>${icon("x", 26, 2.2)} Mito</button><button class="q-opt verdade ${a === "verdade" ? "picked" : ""}" data-act="quizAns" data-v="verdade" ${a ? "disabled" : ""}>${icon("check", 26, 2.2)} Verdade</button></div>
    ${fb}
    <div class="q-nav"><button class="btn btn-ghost btn-sm" data-act="quizStep" data-d="-1" ${S.quiz.idx === 0 ? "disabled" : ""}>${icon("arrowL", 16)} Anterior</button><span class="muted" style="font-size:.85rem;align-self:center">${answered} de ${total} exploradas</span><button class="btn ${a ? "btn-primary" : "btn-ghost"} btn-sm" data-act="quizStep" data-d="1">${S.quiz.idx === total - 1 ? "Concluir" : "Próxima"} ${icon("arrowR", 16)}</button></div></div>`;
}
function renderQuiz() { $("#quiz-body").innerHTML = quizBody(); }
A.quizAns = (el) => { S.quiz.ans[S.quiz.idx] = el.dataset.v; save(); if (el.dataset.v === QUIZ[S.quiz.idx].r) tone(660, 0.18, "sine", 0.12); renderQuiz(); afterProgress("tdah"); };
A.quizStep = (el) => {
  const d = +el.dataset.d; let i = S.quiz.idx + d;
  if (d > 0 && S.quiz.idx === QUIZ.length - 1) { const firstOpen = QUIZ.findIndex((q, k) => !S.quiz.ans[k]); i = firstOpen === -1 ? QUIZ.length : firstOpen; }
  S.quiz.idx = Math.max(0, Math.min(QUIZ.length, i)); save(); renderQuiz();
};
A.quizGo = (el) => { S.quiz.idx = +el.dataset.i; save(); renderQuiz(); };
A.quizRestart = () => { S.quiz = { idx: 0, ans: {} }; save(); renderQuiz(); };

VIEWS.tdah = {
  render() {
    return `${secHead("tdah", "Desvendando o TDAH", "Informações científicas sobre o TDAH, apresentadas de forma clara. Leia os capítulos no seu ritmo e, depois, explore o quiz de mito ou verdade.")}
    <div class="stack-lg">
      <section class="chapters"><nav class="chapter-nav" id="chap-nav" aria-label="Capítulos">${chapterNav()}</nav><div id="chap-body">${chapterBody()}</div></section>
      <section>
        ${sectionTitle("A mesa de som da atenção", "sliders")}
        <p class="muted prose" style="margin-bottom:14px">${TDAH_EQ.intro}</p>
        <div class="card" id="eq-area">${eqArea()}</div>
      </section>
      <section id="quiz" style="scroll-margin-top:80px">
        ${sectionTitle("Quiz: mito ou verdade?", "search")}
        <p class="muted prose" style="margin-bottom:18px">Leia cada afirmação e indique se é mito ou verdade. Após cada resposta, aparece uma explicação. Não há nota: o objetivo é aprender e conversar.</p>
        <div class="quiz" id="quiz-body">${quizBody()}</div>
      </section>
    </div>
    ${stageFoot("tdah")}`;
  },
};

/* =========================================================
   ABA 3 — ISSO ACONTECE COMIGO?
   ========================================================= */
const deckCards = () => (S.cards.cat === "all" ? CARDS : CARDS.filter((c) => c.cat === S.cards.cat));
let deckDir = 1;
function deckBody() {
  const list = deckCards(); if (S.cards.idx >= list.length) S.cards.idx = 0;
  const c = list[S.cards.idx]; const cat = CARD_CATS.find((x) => x.id === c.cat); const a = S.cards.ans[c.id];
  const resp = RESPOSTAS.find((r) => r.id === a);
  return `<div class="pcard ${deckDir < 0 ? "back" : ""}" aria-live="polite">
    <div class="pc-deco">${sym(pick(["star", "note", "mic", "skate"]), "lilas").replace("<svg", '<svg width="140" height="140"')}</div>
    <div class="pc-top"><span class="tag ${cat.cor === "lilas" ? "" : cat.cor}">${icon(cat.icon, 14)} ${cat.nome}</span><span class="deck-count">Carta ${S.cards.idx + 1} de ${list.length}</span></div>
    <p class="pc-sit">${c.sit}</p>
    <p class="muted">Isso acontece com você?</p>
    <div class="resp-grid" role="group" aria-label="Respostas">${RESPOSTAS.map((r) => `<button class="resp ${a === r.id ? "picked" : ""}" data-act="cardAns" data-v="${r.id}" aria-pressed="${a === r.id}"><span class="rdot" style="background:${r.cor}"></span>${r.nome}</button>`).join("")}</div>
    ${resp ? `<div class="follow stack">${reflectBox(resp.follow[0], "Para conversar")}${resp.follow[1] ? reflectBox(resp.follow[1], "Outra pergunta") : ""}${reflectBox(c.extra, "Para aprofundar")}</div>` : ""}
  </div>
  <div class="deck-nav"><button class="btn btn-ghost" data-act="cardStep" data-d="-1" ${S.cards.idx === 0 ? "disabled" : ""}>${icon("arrowL", 18)} Anterior</button><span class="deck-count">${Object.keys(S.cards.ans).length} de ${CARDS.length} cartas exploradas</span><button class="btn ${a ? "btn-primary" : "btn-ghost"}" data-act="cardStep" data-d="1" ${S.cards.idx >= list.length - 1 ? "disabled" : ""}>Próxima ${icon("arrowR", 18)}</button></div>`;
}
function catRow() { return `<button class="chip ${S.cards.cat === "all" ? "on" : ""}" data-act="cardCat" data-c="all">Todas</button>${CARD_CATS.map((c) => `<button class="chip ${S.cards.cat === c.id ? "on" : ""}" data-act="cardCat" data-c="${c.id}">${icon(c.icon, 15)} ${c.nome}</button>`).join("")}`; }
function renderDeck() { $("#deck").innerHTML = deckBody(); $("#cat-row").innerHTML = catRow(); }
A.cardAns = (el) => { const c = deckCards()[S.cards.idx]; S.cards.ans[c.id] = el.dataset.v; save(); tone(523, 0.12, "sine", 0.08); deckDir = 1; renderDeck(); afterProgress("comigo"); };
A.cardStep = (el) => { deckDir = +el.dataset.d; S.cards.idx = Math.max(0, Math.min(deckCards().length - 1, S.cards.idx + deckDir)); save(); renderDeck(); };
A.cardCat = (el) => { S.cards.cat = el.dataset.c; S.cards.idx = 0; deckDir = 1; save(); renderDeck(); };

VIEWS.comigo = {
  render() {
    return `${secHead("comigo", "Isso acontece comigo?", "Cada carta apresenta uma situação do dia a dia. Leia, reflita se ela se aplica a você e escolha uma resposta. Em seguida, aparece uma pergunta para conversar.")}
    <div class="stack">
      <div class="grid g2">
        <div class="note lav">${icon("heart")}<span>Não existem respostas certas ou erradas. Todas as situações podem acontecer com qualquer pessoa, em algum momento.</span></div>
        <div class="note">${icon("info")}<span>As cartas não geram pontuação nem diagnóstico, e uma situação isolada não confirma nenhum sintoma. Elas servem para você se conhecer melhor.</span></div>
      </div>
      <div class="deck-wrap" style="margin-top:14px"><div class="cat-row" id="cat-row">${catRow()}</div><div class="deck" id="deck">${deckBody()}</div></div>
    </div>
    ${stageFoot("comigo")}`;
  },
};

/* =========================================================
   ENCERRAMENTO, REFERÊNCIAS
   ========================================================= */
VIEWS.final = {
  render() {
    const fim = allDone();
    return `<section class="final stack">
      <div class="final-art">${heroArt("final")}</div>
      ${fim ? `<span class="eyebrow" style="justify-content:center">${starFill(14)} Encerramento</span><h1>Jornada concluída</h1>
      <p class="big">Você descobriu novas maneiras de entender seu cérebro, reconheceu algumas das suas habilidades e conheceu ferramentas que podem ajudar no seu dia a dia.</p>
      <p class="big">Lembre-se: cada pessoa tem seu próprio ritmo, suas habilidades e seus desafios. Conhecer melhor a si mesma é uma maneira de descobrir novos caminhos.</p>
      <p class="hand" style="font-size:1.8rem;margin-top:6px">Seu mundo, seu ritmo, sua mente.</p>`
      : `<span class="eyebrow" style="justify-content:center">${icon("skate", 16)} Encerramento</span><h1>Ainda há etapas pela frente</h1><p class="big">Você já conquistou ${doneCount()} de ${STAGES.length} estrelas. Ao concluir todas as etapas, a mensagem de encerramento será exibida aqui.</p>`}
      <div class="badges-row" style="margin-top:18px;text-align:left">${STAGES.map((s) => `<div class="bdg ${S.done[s.id] ? "" : "off"}">${medalSVG(s, !!S.done[s.id], 64)}<b>${s.badge}</b><small>${s.badgeMsg}</small></div>`).join("")}</div>
      <div class="row" style="justify-content:center;margin-top:20px"><a class="btn btn-primary" href="#resumo">${icon("book", 18)} Ver meu manual</a><a class="btn btn-ghost" href="#inicio">${icon("home", 18)} Voltar ao início</a></div>
    </section>`;
  },
  mount() { if (allDone()) burst(); },
};

VIEWS.referencias = {
  render() {
    return `<header class="sec-head"><div><span class="eyebrow">${icon("bookopen", 16)} Fundamentação científica</span><h1 style="margin-top:8px">Referências</h1><p class="lead">O conteúdo deste material foi elaborado com base em manuais diagnósticos, diretrizes clínicas e literatura científica sobre TDAH, neurodesenvolvimento, funções executivas e intervenções psicossociais.</p></div></header>
    <div class="stack">
      <div class="note lav">${icon("info")}<span>Este é um material de <b>psicoeducação</b>. Ele não substitui avaliação, diagnóstico ou tratamento realizados por profissionais habilitados. Recomenda-se conferir as edições mais recentes das diretrizes antes de citá-las.</span></div>
      <div class="card"><ol class="ref-list">${REFERENCIAS.map((r) => `<li>${r}</li>`).join("")}</ol></div>
    </div>`;
  },
};

/* =========================================================
   Eventos globais e inicialização
   ========================================================= */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]"); if (!t) return;
  const fn = A[t.dataset.act]; if (!fn) return;
  if (t.tagName === "A" && t.dataset.act === "closeModal") { $("#modal-root").innerHTML = ""; if (badgeQueue.length) setTimeout(showNextBadge, 300); return; }
  fn(t, e);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if ($("#modal-root") && $("#modal-root").innerHTML) closeModal(); else A.closeNav(); } });
window.addEventListener("hashchange", route);
function boot() { renderShell(); route(); }
