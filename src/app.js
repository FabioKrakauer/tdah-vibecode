/* =========================================================
   NÚCLEO
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const toggleIn = (arr, v) => { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); return arr; };
const A = {}, INPUTS = {}, FORMS = {};
const KEY = "seu-mundo-v3", PKEY = "seu-mundo-prefs-v1";
const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const lsDel = (k) => { try { localStorage.removeItem(k); } catch (e) {} };
const DEF = () => ({ m: {}, fin: { q: {}, cards: {}, tools: [], goals: [{ t: "", passo: "" }, { t: "", passo: "" }, { t: "", passo: "" }], carta: { para: "daqui a um ano", texto: "" }, step: 0, seen: { 0: 1 }, done: false }, unlockAll: false });
function load() { const r = lsGet(KEY); if (r) { try { const o = JSON.parse(r); const d = DEF(); return Object.assign(d, o, { fin: Object.assign(d.fin, o.fin || {}) }); } catch (e) {} } return DEF(); }
let S = load();
const save = () => lsSet(KEY, JSON.stringify(S));
let P = (() => { try { return JSON.parse(lsGet(PKEY)) || {}; } catch (e) { return {}; } })();
const savePrefs = () => lsSet(PKEY, JSON.stringify(P));
function applyPrefs() { const r = document.documentElement; r.dataset.palette = P.palette || "lavanda"; if (P.theme) r.dataset.theme = P.theme; }
applyPrefs();
const isDark = () => { const t = document.documentElement.dataset.theme; if (t) return t === "dark"; return !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches); };

function M(id) { if (!S.m[id]) S.m[id] = { step: 0, seen: { 0: 1 }, done: false, at: null, d: {} }; return S.m[id]; }
const D = (id) => M(id).d;
const mis = (id) => MISSIONS.find((x) => x.id === id);
const ORDER = ["mente", "acao", "emocoes", "caminho"];
const isDone = (id) => (id === "caminho" ? !!S.fin.done : !!(S.m[id] && S.m[id].done));
const isLocked = (id) => { if (S.unlockAll) return false; const i = ORDER.indexOf(id); return i > 0 && !isDone(ORDER[i - 1]); };
const started = (id) => { if (id === "caminho") return !S.fin.done && Object.keys(S.fin.seen || {}).length > 1; const m = S.m[id]; return !!(m && !m.done && Object.keys(m.seen || {}).length > 1); };
const status = (id) => (isDone(id) ? "done" : isLocked(id) ? "locked" : started(id) ? "part" : "open");
const STATUS_TXT = { done: "Concluída", locked: "Bloqueada", part: "Em andamento", open: "Disponível" };
const doneCount = () => ORDER.filter(isDone).length;

/* ---------- Ícones ---------- */
const ICONS = {
  map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.6 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  refresh: '<path d="M20 11.5A8 8 0 1 1 17.7 6M20 4v5h-5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.5"/>',
  spot: '<path d="M8 3h8l-1.5 5h-5z"/><path d="M9.5 8 4 21h16L14.5 8"/>',
  pause: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  spark: '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z"/>',
  note: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
  stairs: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>',
  board: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
  route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H16a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h7.5"/>',
  hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5M14 10.5v-5a1.5 1.5 0 0 1 3 0V13M17 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1.2a6 6 0 0 1-4.6-2.2L4 14.5a1.5 1.5 0 0 1 2.3-1.9L8 14.5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
  chat: '<path d="M20.5 12a8 8 0 0 1-11.8 7l-4.2 1.2 1.2-4A8 8 0 1 1 20.5 12z"/>',
  wave: '<path d="M2 15c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-6 5-6 2.5 3 5 3"/><path d="M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" opacity=".5"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>', up: '<path d="m6 15 6-6 6 6"/>', left: '<path d="m15 6-6 6 6 6"/>', right: '<path d="m9 6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  grip: '<circle cx="9" cy="6" r="1.3"/><circle cx="15" cy="6" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="18" r="1.3"/><circle cx="15" cy="18" r="1.3"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
  book: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5c-3.5-.5-6.5 0-8.5 1.5zM12 6.5V20"/>',
  toolbox: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8.5 8V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V8M3 13h18"/>',
  flag: '<path d="M5 21V4M5 4.5h11l-2 4 2 4H5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
  mic: '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
  skate: '<path d="M5 3.5h5v8l6 .5a4 4 0 0 1 4 4V17H5z"/><circle cx="8" cy="20" r="1.8"/><circle cx="17" cy="20" r="1.8"/>',
};
const icon = (n, s = 20, sw = 1.8) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;
function starPts(cx, cy, R, r, n = 5) { const p = []; for (let i = 0; i < n * 2; i++) { const a = ((-90 + (i * 180) / n) * Math.PI) / 180; const rad = i % 2 ? r : R; p.push((cx + rad * Math.cos(a)).toFixed(1) + "," + (cy + rad * Math.sin(a)).toFixed(1)); } return p.join(" "); }
const sparkPath = (cx, cy, r) => { const k = r * 0.16; return `M${cx} ${cy - r}C${cx + k} ${cy - k} ${cx + k} ${cy - k} ${cx + r} ${cy}C${cx + k} ${cy + k} ${cx + k} ${cy + k} ${cx} ${cy + r}C${cx - k} ${cy + k} ${cx - k} ${cy + k} ${cx - r} ${cy}C${cx - k} ${cy - k} ${cx - k} ${cy - k} ${cx} ${cy - r}Z`; };

/* Ilustrações (SVG inline) */
const ART = {
  mic: (c = "f-pri") => `<g><rect x="36" y="58" width="12" height="34" rx="5" class="f-gold" opacity=".8"/><path d="M28 54h28l-4 10H32z" class="f-gold"/><circle cx="42" cy="36" r="22" class="${c}"/><path d="M27 30h30M25 38h34M28 46h28" stroke="rgba(255,255,255,.35)" stroke-width="2" fill="none"/><path d="M30 100h24" stroke-width="5" stroke-linecap="round" class="s-line" fill="none"/></g>`,
  skate: (c = "f-acc") => `<g><path d="M18 18h28v36l22 4c8 1.4 12 7 12 13v6H18z" class="${c}"/><path d="M18 30h28M18 42h28" stroke="rgba(255,255,255,.4)" stroke-width="2.5" fill="none"/><rect x="12" y="77" width="74" height="7" rx="3.5" class="f-gold" opacity=".8"/><circle cx="28" cy="92" r="8" class="f-gold"/><circle cx="70" cy="92" r="8" class="f-gold"/><circle cx="28" cy="92" r="3" class="f-surface"/><circle cx="70" cy="92" r="3" class="f-surface"/></g>`,
  star: (c = "f-gold") => `<g><polygon points="${starPts(50, 52, 40, 17)}" class="${c}"/><path d="${sparkPath(86, 18, 9)}" class="f-pri twinkle"/><path d="${sparkPath(14, 86, 7)}" class="f-acc twinkle" style="animation-delay:-2s"/></g>`,
  book: () => `<g><path d="M50 26C40 18 26 16 10 18v62c16-2 30 0 40 8 10-8 24-10 40-8V18c-16-2-30 0-40 8z" class="f-warm"/><path d="M50 26v62" stroke="rgba(255,255,255,.5)" stroke-width="2.5"/><path d="M20 34c8-1 15 0 21 3M20 46c8-1 15 0 21 3M59 37c6-3 13-4 21-3M59 49c6-3 13-4 21-3" stroke="rgba(255,255,255,.55)" stroke-width="2" fill="none" stroke-linecap="round"/><path d="${sparkPath(86, 12, 8)}" class="f-gold twinkle"/></g>`,
};
const artSVG = (name, cls = "", vb = "0 0 100 104") => `<svg class="${cls}" viewBox="${vb}" aria-hidden="true">${ART[name]()}</svg>`;
function sky(n = 26, seed = 3, w = 1000, h = 400) { let s = ""; for (let i = 0; i < n; i++) { const x = (i * 97 + seed * 31) % w, y = (i * 53 + seed * 17) % h, r = 1 + ((i * 7) % 3); s += i % 5 === 0 ? `<path d="${sparkPath(x, y, r * 4)}" class="f-gold twinkle" style="animation-delay:${-(i * 0.37).toFixed(2)}s"/>` : `<circle cx="${x}" cy="${y}" r="${r * 0.8}" class="f-onhero twinkle" opacity=".7" style="animation-delay:${-(i * 0.29).toFixed(2)}s"/>`; } return s; }
function heroArt() {
  return `<svg viewBox="0 0 460 340" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Ilustração com microfone, patins e estrelas">
    ${sky(22, 2, 460, 340)}
    <path d="M-10 290 C90 210 160 320 250 250 S390 150 480 200" fill="none" class="s-gold" stroke-width="1.6" stroke-dasharray="1 8" stroke-linecap="round"/>
    <g transform="translate(250 60) rotate(-12) scale(1.35)"><g class="float">${ART.mic("f-pri")}</g></g>
    <g transform="translate(110 170) rotate(8) scale(1.2)"><g class="float" style="animation-delay:-2s">${ART.skate("f-acc")}</g></g>
    <g transform="translate(360 210) scale(.7)">${ART.star()}</g>
    <path d="${sparkPath(70, 70, 14)}" class="f-gold twinkle"/>
  </svg>`;
}
function badgeSVG(id, off) {
  const m = mis(id) || FINAL; const a = m.art;
  return `<svg class="badge ${off ? "off" : ""}" viewBox="0 0 160 160" role="img" aria-label="Selo ${esc(m.selo || m.titulo)}">
    <polygon points="${starPts(80, 80, 76, 64, 12)}" class="f-gold"/><circle cx="80" cy="80" r="56" class="f-hero"/>
    <g transform="translate(36 34) scale(.88)">${ART[a]()}</g>
    <path d="${sparkPath(126, 30, 9)}" class="f-pri twinkle"/></svg>`;
}

/* ---------- Modal, toast, cópia ---------- */
function openModal(html) { $("#modal-root").innerHTML = `<div class="modal-bg" data-act="modalBg"><div class="modal" role="dialog" aria-modal="true"><button class="modal-close" data-act="closeModal" aria-label="Fechar">${icon("x")}</button>${html}</div></div>`; setTimeout(() => { const b = $(".modal .btn"); b && b.focus(); }, 30); }
function closeModal() { $("#modal-root").innerHTML = ""; }
A.closeModal = () => closeModal();
A.modalBg = (el, e) => { if (e.target === el) closeModal(); };
function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2800); }
function copyText(txt, fallbackEl) {
  const fb = () => { if (fallbackEl) { fallbackEl.focus(); fallbackEl.select && fallbackEl.select(); } toast("Não deu para copiar automaticamente. O texto foi selecionado: use Ctrl+C ou segure para copiar."); };
  try { navigator.clipboard.writeText(txt).then(() => toast("Texto copiado."), fb); } catch (e) { fb(); }
}

/* ---------- Componentes ---------- */
const talk = (q) => `<div class="talk"><span class="ti">${icon("chat", 18)}</span><div><div class="label acc">Para conversar</div><div class="tq">${q}</div></div></div>`;
const chips = (list, sel, mid, key, cls = "") => list.map((x) => `<button class="chip ${cls} ${sel.includes(x) ? "on" : ""}" data-act="chip" data-m="${mid}" data-k="${key}" data-v="${esc(x)}" aria-pressed="${sel.includes(x)}">${esc(x)}</button>`).join("");
A.chip = (el) => { const d = D(el.dataset.m); const k = el.dataset.k; d[k] = toggleIn(d[k] || [], el.dataset.v); save(); const on = d[k].includes(el.dataset.v); el.classList.toggle("on", on); el.setAttribute("aria-pressed", on); if (el.dataset.re) rerender(); };
function deepBlocks(mid, blocos) {
  const d = D(mid); d.lidos = d.lidos || {};
  const n = Object.keys(d.lidos).length;
  return `<div class="stack-sm"><div class="row between"><span class="label">Toque para abrir cada bloco</span><span class="small muted count" id="lidos-${mid}">${n} de ${blocos.length} abertos</span></div>
  <div class="deep-list">${blocos.map((b, i) => `<details class="deep ${d.lidos[i] ? "read" : ""}" data-m="${mid}" data-i="${i}"><summary><span class="dic">${icon(b.art, 22)}</span><span><b>${b.t}</b><span class="dsub">${b.resumo}</span></span><span class="chev">${icon("down", 20)}</span></summary>
    <div class="deep-body"><div class="dsec pr"><span class="k">${b.kPratica || "Na prática fica assim"}</span><ul>${b.pratica.map((p) => `<li>${p}</li>`).join("")}</ul></div>
    <div class="dsec"><span class="k">${b.kPorque || "Por que acontece"}</span><p>${b.porque}</p></div>
    ${b.ajuda ? `<div class="dsec ac"><span class="k">O que ajuda e por quê</span><p>${b.ajuda}</p></div>` : ""}</div></details>`).join("")}</div></div>`;
}
document.addEventListener("toggle", (e) => { const t = e.target; if (!t.matches || !t.matches("details.deep") || !t.open) return; const d = D(t.dataset.m); d.lidos = d.lidos || {}; d.lidos[t.dataset.i] = 1; save(); t.classList.add("read"); const c = $("#lidos-" + t.dataset.m); if (c) c.textContent = `${Object.keys(d.lidos).length} de ${$$(`details.deep[data-m="${t.dataset.m}"]`).length} abertos`; }, true);

/* ---------- Cabeçalho ---------- */
const PALS = [
  { id: "lavanda", nome: "Lavanda e sálvia", desc: "serena e delicada", sw: ["#6E5A9A", "#CFC4E6", "#7E9A7A", "#DCE6D6", "#B8924A"] },
  { id: "quente", nome: "Pastel quente", desc: "aconchegante, tipo diário", sw: ["#C0705A", "#F6DCCF", "#C98A9A", "#E7C77B", "#3F6B73"] },
  { id: "noite", nome: "Noite estrelada", desc: "céu, lilás e dourado", sw: ["#1B1F3A", "#5A4FA8", "#B9A6E8", "#A8C6E0", "#E6C77A"] },
];
function renderTop() {
  $("#top").innerHTML = `<div class="top-in"><a class="brand" href="#inicio" aria-label="Seu mundo, seu ritmo: início"><span class="brand-mark"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="${sparkPath(12, 12, 9)}" class="f-gold"/></svg></span><span class="brand-t">Seu mundo, seu ritmo</span></a>
    <nav class="top-act" aria-label="Atalhos"><a class="tbtn" href="#inicio">${icon("map", 18)}<span class="tlbl">Mapa</span></a><span class="prog-pill" id="pp" title="Etapas concluídas"></span>
    <button class="tbtn" data-act="palToggle" aria-label="Trocar as cores" aria-expanded="false" id="palbtn">${icon("palette", 18)}<span class="tlbl">Cores</span></button>
    <button class="tbtn" data-act="themeToggle" id="themebtn"></button>
    <button class="tbtn" data-act="askReset" aria-label="Reiniciar tudo" title="Reiniciar tudo">${icon("refresh", 18)}</button></nav></div>
    <div class="palpop" id="palpop" hidden><span class="label">Cores do site</span>${PALS.map((p) => `<button class="palopt" data-act="palSet" data-id="${p.id}"><span class="sw">${p.sw.map((c) => `<i style="background:${c}"></i>`).join("")}</span><span><b>${p.nome}</b><small>${p.desc}</small></span></button>`).join("")}<span class="small muted">O claro e o escuro ficam no botão ao lado.</span></div>`;
  updateTop();
}
function updateTop() {
  const pp = $("#pp"); if (pp) pp.textContent = `${doneCount()}/4`;
  const tb = $("#themebtn"); if (tb) { const dk = isDark(); tb.innerHTML = icon(dk ? "sun" : "moon", 18); tb.setAttribute("aria-label", dk ? "Usar tema claro" : "Usar tema escuro"); tb.title = dk ? "Tema claro" : "Tema escuro"; }
  $$(".palopt").forEach((b) => b.classList.toggle("on", b.dataset.id === (P.palette || "lavanda")));
}
A.palToggle = () => { const p = $("#palpop"); p.hidden = !p.hidden; $("#palbtn").setAttribute("aria-expanded", String(!p.hidden)); updateTop(); };
A.palSet = (el) => { P.palette = el.dataset.id; savePrefs(); applyPrefs(); updateTop(); $("#palpop").hidden = true; toast("Cores: " + PALS.find((p) => p.id === P.palette).nome); };
A.themeToggle = () => { P.theme = isDark() ? "light" : "dark"; savePrefs(); applyPrefs(); updateTop(); };
document.addEventListener("click", (e) => { const p = $("#palpop"); if (p && !p.hidden && !e.target.closest("#palpop") && !e.target.closest("#palbtn")) { p.hidden = true; } }, true);
A.askReset = () => openModal(`<h2>Reiniciar tudo?</h2><p class="muted">Todas as respostas, escolhas, registros e a carta guardados neste navegador serão apagados. Isso não pode ser desfeito. As cores escolhidas continuam.</p><div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-pri" data-act="doReset">Apagar e reiniciar</button></div>`);
A.doReset = () => { S = DEF(); save(); closeModal(); location.hash = "#inicio"; route(); toast("Tudo foi reiniciado."); };

/* ---------- Roteador ---------- */
const VIEWS = {}; let CUR = null;
function cleanup() { if (BR.iv) { clearInterval(BR.iv); clearTimeout(BR.to); BR.iv = null; } }
function route() {
  const h = (location.hash || "#inicio").slice(1); const key = VIEWS[h] ? h : "inicio";
  cleanup(); CUR = null; closeModal(); const pp = $("#palpop"); if (pp) pp.hidden = true;
  $("#view").innerHTML = `<div class="view">${VIEWS[key].render()}</div>`;
  VIEWS[key].mount && VIEWS[key].mount();
  updateTop(); window.scrollTo(0, 0);
  const h1 = $("#view h1"); if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
}
function rerender() { if (CUR) { const y = window.scrollY; renderStep(); window.scrollTo(0, y); } }

/* =========================================================
   INÍCIO — MAPA DA JORNADA
   ========================================================= */
function stationHTML(item, idx) {
  const st = status(item.id); const href = st === "locked" ? "#" + item.id : "#" + item.id;
  const node = st === "locked" ? icon("lock", 26) : st === "done" ? artSVG(item.art) : artSVG(item.art);
  return `<a class="station ${st}" href="${href}" aria-label="${esc(item.titulo)}: ${STATUS_TXT[st]}"><span class="node">${node}</span><span class="st-body stack-sm" style="gap:4px"><span class="kicker">${idx < 3 ? "Missão 0" + (idx + 1) : "Capítulo final"}</span><h3>${item.titulo}</h3><p>${item.sub}</p></span><span class="st-pill ${st}">${st === "done" ? icon("check", 13, 2.6) : st === "locked" ? icon("lock", 13) : ""} ${STATUS_TXT[st]}</span></a>`;
}
VIEWS.inicio = {
  render() {
    const items = [...MISSIONS, FINAL]; const next = items.find((x) => !isDone(x.id) && !isLocked(x.id)); const n = doneCount();
    return `<section class="hero"><div class="hero-text"><span class="label on-hero">Uma jornada em quatro paradas</span>
        <h1>Seu mundo, seu ritmo, <em>sua mente.</em></h1>
        <p class="sub">Cada pessoa tem um jeito próprio de pensar, sentir e fazer as coisas acontecerem. Este é um espaço para descobrir mais sobre o seu, no seu tempo.</p>
        <div class="row">${next ? `<a class="btn btn-hero" href="#${next.id}">${icon("play", 16)} ${n === 0 ? "Começar a jornada" : "Continuar: " + next.titulo}</a>` : `<a class="btn btn-hero" href="#fim">${icon("star", 16)} Ver o fim da jornada</a>`}</div></div>
      <div class="hero-art">${heroArt()}</div></section>
    <section class="stack" style="margin-top:34px"><div class="sec-h"><h2>Mapa da jornada</h2><span class="ln"></span><span class="label">${n} de 4 concluídas</span></div>
      <p class="muted prose">Cada parada se abre quando a anterior termina. Dá para voltar a qualquer parada já aberta sempre que quiser.</p>
      <div class="trail"><svg class="trail-line" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M60 30 C200 -10 300 70 420 30 S640 -10 760 30 S900 60 960 30" fill="none" class="s-gold" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round"/></svg>${items.map(stationHTML).join("")}</div></section>
    <section class="stack" style="margin-top:34px"><span class="label">Como cada missão funciona</span>
      <div class="how">${STEPS.map(([t, s], i) => `<div class="hs"><span class="label acc">Etapa ${i + 1}</span><b>${t}</b><p>${["Blocos curtos para abrir e explorar, com exemplos do dia a dia.", "Um jogo para viver a ideia na prática. Sem placar.", "Ligar o que aprendeu com a sua vida e testar ferramentas.", "Uma reflexão opcional e um selo no mapa."][i]}</p></div>`).join("")}</div>
      <p class="small muted">${icon("lock", 14)} Tudo o que você escreve fica só neste navegador. Nada é enviado para lugar nenhum.</p></section>`;
  },
};

/* =========================================================
   ESTRUTURA DAS MISSÕES
   ========================================================= */
const MREND = {}, MMOUNT = {};
function lockedHTML(item) {
  const i = ORDER.indexOf(item.id); const prev = ORDER[i - 1]; const pt = prev === "caminho" ? FINAL.titulo : mis(prev).titulo;
  return `<div class="card stack" style="max-width:620px;margin:30px auto;text-align:center;align-items:center;padding:34px"><span style="width:64px;height:64px;border-radius:50%;background:var(--surface-2);display:grid;place-items:center;color:var(--ink-2)">${icon("lock", 28)}</span><h1 style="font-size:1.8rem">${item.titulo}</h1><p class="muted">Esta parada se abre quando <b>${pt}</b> for concluída.</p><div class="row" style="justify-content:center"><a class="btn btn-pri" href="#${prev}">Ir para ${pt}</a><a class="btn btn-ghost" href="#inicio">Ver o mapa</a></div></div>`;
}
function missionView(id) {
  return {
    render() {
      const m = mis(id); if (isLocked(id)) return lockedHTML(m);
      CUR = id; const st = M(id); save();
      return `<header class="mhead"><div><span class="label on-hero">Missão 0${m.n} de 03${st.done ? " · concluída" : ""}</span><h1>${m.titulo}</h1><p class="hook">${m.hook}</p></div>${artSVG(m.art, "art")}</header>
        <nav class="stepper" id="stepper" aria-label="Etapas da missão"></nav><section id="mstep"></section><div class="stepnav" id="stepnav"></div>`;
    },
    mount() { if (!isLocked(id)) renderStep(); },
  };
}
function renderStep() {
  const id = CUR; const st = M(id); st.step = Math.max(0, Math.min(3, st.step || 0)); st.seen[st.step] = 1; save();
  $("#stepper").innerHTML = STEPS.map(([t, s], i) => `<button class="${i === st.step ? "on" : ""} ${st.seen[i] ? "seen" : ""}" data-act="goStep" data-i="${i}" aria-current="${i === st.step ? "step" : "false"}"><span class="sn">Etapa ${i + 1}</span><span class="sl">${t}</span><span class="sd">${s}</span></button>`).join("");
  $("#mstep").innerHTML = `<div class="view">${MREND[id][st.step]()}</div>`;
  const mt = MMOUNT[id] && MMOUNT[id][st.step]; mt && mt();
  const nx = nextOf(id);
  $("#stepnav").innerHTML = `${st.step > 0 ? `<button class="btn btn-ghost" data-act="stepBy" data-d="-1">${icon("arrowL", 16)} Voltar: ${STEPS[st.step - 1][0]}</button>` : `<a class="btn btn-ghost" href="#inicio">${icon("arrowL", 16)} Mapa da jornada</a>`}
    ${st.step < 3 ? `<button class="btn btn-pri" data-act="stepBy" data-d="1">Avançar: ${STEPS[st.step + 1][0]} ${icon("arrowR", 16)}</button>` : st.done && nx ? `<a class="btn btn-pri" href="#${nx.id}">Próxima parada ${icon("arrowR", 16)}</a>` : ""}`;
  updateTop();
}
const nextOf = (id) => { const i = ORDER.indexOf(id); const n = ORDER[i + 1]; return n ? (n === "caminho" ? FINAL : mis(n)) : null; };
A.goStep = (el) => { M(CUR).step = +el.dataset.i; renderStep(); scrollToStepper(); };
A.stepBy = (el) => { const st = M(CUR); st.step += +el.dataset.d; renderStep(); scrollToStepper(); };
function scrollToStepper() { cleanup(); const s = $("#stepper"); if (s) window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }
function introHTML(lead, side) { return `<div class="intro"><div class="stack"><span class="label">Para começar</span><p class="lead">${lead}</p></div>${side}</div>`; }

/* Conquista genérica */
function conquistaHTML(id, opts) {
  const m = mis(id); const st = M(id); const d = st.d; const nx = nextOf(id);
  return `<div class="stack-lg"><div class="badge-wrap">${badgeSVG(id, !st.done)}<div class="stack-sm"><span class="label">${st.done ? "Selo conquistado em " + st.at : "Selo desta missão"}</span><h2>${m.selo}</h2><p class="muted">${opts.sub}</p></div></div>
    ${opts.top || ""}
    <div class="card stack"><label class="label" for="refl-${id}">${opts.label}</label>${opts.help ? `<p class="small muted">${opts.help}</p>` : ""}<textarea id="refl-${id}" class="field" data-input="refl" data-m="${id}" maxlength="600" placeholder="${opts.ph}">${esc(d.refl || "")}</textarea><p class="small muted">Opcional. Fica guardado só neste navegador.</p></div>
    ${opts.bottom || ""}
    <div class="row">${st.done ? `${nx && !isLocked(nx.id) ? `<a class="btn btn-pri" href="#${nx.id}">Ir para ${nx.titulo} ${icon("arrowR", 16)}</a>` : ""}<a class="btn btn-ghost" href="#inicio">${icon("map", 16)} Ver o mapa</a>` : `<button class="btn btn-pri" data-act="finish" style="padding:14px 22px">${icon("star", 18)} Concluir a missão</button>`}<button class="btn btn-ghost btn-sm" data-act="askRestartMission">${icon("refresh", 14)} Recomeçar esta missão</button></div></div>`;
}
INPUTS.refl = (el) => { D(el.dataset.m).refl = el.value; save(); };
A.finish = () => {
  const st = M(CUR); st.done = true; st.at = st.at || new Date().toLocaleDateString("pt-BR"); save(); const m = mis(CUR); const nx = nextOf(CUR);
  openModal(`<div style="display:grid;place-items:center">${badgeSVG(CUR)}</div><span class="label" style="text-align:center">Missão concluída</span><h2 style="text-align:center">${m.selo}</h2><p class="muted" style="text-align:center">${nx ? `<b>${nx.titulo}</b> foi desbloqueada no mapa.` : ""} Você pode voltar a esta missão sempre que quiser.</p><div class="row" style="justify-content:center">${nx ? `<a class="btn btn-pri" href="#${nx.id}">Ir para a próxima parada ${icon("arrowR", 16)}</a>` : ""}<a class="btn btn-ghost" href="#inicio">Ver o mapa</a></div>`);
  renderStep();
};
A.askRestartMission = () => openModal(`<h2>Recomeçar esta missão?</h2><p class="muted">As escolhas e textos desta missão serão apagados. As outras missões continuam como estão.</p><div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-pri" data-act="restartMission">Recomeçar</button></div>`);
A.restartMission = () => { delete S.m[CUR]; save(); closeModal(); route(); };

/* =========================================================
   GUIA PARA A FAMÍLIA
   ========================================================= */
VIEWS.familia = {
  render() {
    const F = FAMILIA;
    return `<header class="card soft stack" style="padding:28px"><span class="label">Área para a família</span><h1>Guia para a família</h1><p class="prose">${F.intro}</p><p class="small muted">Esta página não mostra nenhuma resposta da adolescente.</p></header>
    <div class="stack-lg" style="margin-top:28px">${F.secoes.map((s) => `<section class="stack-sm"><h2>${s.t}</h2>${s.p.map((p) => `<p class="prose">${p}</p>`).join("")}</section>`).join("")}
      <section class="stack"><h2>Possibilidades no dia a dia</h2><p class="muted prose">Não são regras: funcionam melhor quando adaptadas à rotina de cada família e construídas junto com a adolescente.</p><div class="grid g3">${F.possibilidades.map(([t, p]) => `<div class="card stack-sm"><h4>${t}</h4><p class="small">${p}</p></div>`).join("")}</div></section>
      <section class="stack"><h2>Comunicação</h2><p class="muted prose">Pequenas mudanças na forma de dizer deslocam a conversa da culpa para a solução.</p>${F.pares.map(([a, b]) => `<div class="grid g2" style="gap:8px"><div class="note warm"><span>“${a}”</span></div><div class="note acc"><span>“${b}”</span></div></div>`).join("")}</section>
      <div class="note">${icon("info", 20)}<span>${F.fecho}</span></div></div>`;
  },
};

/* =========================================================
   PARA A PSICÓLOGA
   ========================================================= */
VIEWS.guia = {
  render() {
    const items = [...MISSIONS, FINAL];
    return `<header class="stack" style="margin-bottom:24px"><span class="label">Uso profissional</span><h1>Para a psicóloga</h1><p class="muted prose">Objetivos e cuidados de cada parada, controle de desbloqueio e informações de privacidade.</p></header>
    <div class="stack-lg"><section class="grid g2">${items.map((m) => { const g = GUIA[m.id]; return `<div class="card stack-sm"><div class="row between"><h3>${m.titulo}</h3><span class="st-pill ${status(m.id)}" style="margin-top:0">${STATUS_TXT[status(m.id)]}</span></div><p>${g.obj}</p><ul style="margin:0;padding-left:18px" class="small">${g.cuidados.map((c) => `<li>${c}</li>`).join("")}</ul><a class="btn btn-ghost btn-sm" style="align-self:flex-start" href="#${m.id}">Abrir ${icon("arrowR", 14)}</a></div>`; }).join("")}</section>
    <section class="grid g2" style="align-items:start"><div class="card stack"><h3>Desbloqueio</h3><p class="small muted">Por padrão, cada parada abre quando a anterior é concluída. Para pular ou revisitar fora de ordem numa sessão, libere todas.</p><label class="check-item" style="cursor:pointer"><input type="checkbox" data-act="unlockAll" ${S.unlockAll ? "checked" : ""}><span>Liberar todas as paradas</span></label></div>
      <div class="card stack"><h3>Privacidade</h3><p class="small">Nada é enviado para servidores. Progresso, respostas e a carta ficam apenas no armazenamento deste navegador, neste aparelho, e continuam lá ao fechar a página. Em aparelhos compartilhados, reinicie ao final da sessão.</p><button class="btn btn-ghost btn-sm" style="align-self:flex-start" data-act="askReset">${icon("refresh", 14)} Reiniciar tudo</button></div></section>
    <section class="stack"><h3>Referências</h3><p class="small muted">Conteúdo baseado no DSM-5-TR, na CID-11, em consensos internacionais e na literatura sobre funções executivas, regulação emocional e terapia cognitivo-comportamental.</p><ol class="ref-list">${REFERENCIAS.map((r) => `<li>${r}</li>`).join("")}</ol></section></div>`;
  },
};
A.unlockAll = (el) => { S.unlockAll = el.checked; save(); toast(S.unlockAll ? "Todas as paradas liberadas." : "Desbloqueio progressivo ativado."); };

/* =========================================================
   EVENTOS
   ========================================================= */
document.addEventListener("click", (e) => { const t = e.target.closest("[data-act]"); if (!t) return; const fn = A[t.dataset.act]; if (!fn) return; if (t.tagName === "A" && t.closest(".modal")) { closeModal(); return; } fn(t, e); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeModal(); const p = $("#palpop"); if (p) p.hidden = true; }
  if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches('[role="button"][data-act]:not(button)')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
});
document.addEventListener("input", (e) => { const k = e.target.dataset && e.target.dataset.input; if (k && INPUTS[k]) INPUTS[k](e.target); });
document.addEventListener("change", (e) => { const k = e.target.dataset && e.target.dataset.input; if (k && e.target.tagName === "SELECT" && INPUTS[k]) INPUTS[k](e.target); });
document.addEventListener("submit", (e) => { e.preventDefault(); const f = e.target; const fn = FORMS[f.dataset.form]; if (fn) fn(f); });
window.addEventListener("hashchange", route);
if (window.matchMedia) { try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTop); } catch (e) {} }
function boot() { MISSIONS.forEach((m) => (VIEWS[m.id] = missionView(m.id))); renderTop(); route(); }
