/* =========================================================
   MISSÕES 1 a 4
   ========================================================= */
let G = { timers: [], keyHandler: null };
function gLater(fn, ms) { const t = setTimeout(fn, ms); G.timers.push(t); return t; }
function stopAllGames() { G.timers.forEach(clearTimeout); G.timers = []; if (G.keyHandler) document.removeEventListener("keydown", G.keyHandler); G.keyHandler = null; G.running = false; }

/* Fader vertical reutilizável */
function fader(id, label, val, input, extra = "") {
  return `<div class="fader"><div class="track"><div class="fill" style="height:${val * 10}%"></div><input type="range" min="0" max="10" step="1" value="${val}" data-input="${input}" data-id="${id}" ${extra} aria-label="${esc(label)}"></div><span>${esc(label)}</span></div>`;
}
function paintFader(el) { const f = el.parentElement.querySelector(".fill"); if (f) f.style.height = el.value * 10 + "%"; }

/* =================== MISSÃO 1 — BASTIDORES =================== */
const LOBE_PATHS = {
  frontal: "M70,175 C40,140 45,85 95,55 C125,38 160,30 197,30 C197,70 192,98 182,118 C160,128 140,140 128,160 C110,178 88,185 70,175 Z",
  parietal: "M197,30 C245,28 295,45 322,75 C315,95 300,108 285,115 C255,118 215,118 182,118 C192,98 197,70 197,30 Z",
  occipital: "M322,75 C350,100 360,140 347,172 C330,176 312,170 300,160 C298,140 292,125 285,115 C300,108 315,95 322,75 Z",
  temporal: "M128,160 C140,140 160,128 182,118 C215,118 255,118 285,115 C292,125 298,140 300,160 C285,185 250,200 210,202 C170,204 140,190 128,160 Z",
  cerebelo: "M290,178 C310,170 335,172 349,178 C353,200 330,222 300,220 C280,218 270,200 290,178 Z",
};
const LOBE_LABELS = { frontal: [112, 108, "Frontal"], parietal: [252, 74, "Parietal"], occipital: [324, 138, "Occip."], temporal: [236, 182, "Temporal"], cerebelo: [318, 202, "Cerebelo"] };
function brainSVG() {
  const d = D("bastidores"); const sel = d.sel;
  return `<svg class="brain-svg ${sel ? "has-sel" : ""}" viewBox="30 18 340 262" role="group" aria-label="Mapa interativo do cérebro">
    <path d="M238,196 C246,204 258,204 266,198 L272,262 C264,272 248,272 240,262 Z" fill="#3A2E5C"/>
    ${M1.regioes.map((r) => `<path class="lobe ${sel === r.id ? "sel" : ""}" d="${LOBE_PATHS[r.id]}" fill="${r.cor}" tabindex="0" role="button" aria-label="${r.nome}" data-act="brainSel" data-id="${r.id}"><title>${r.nome}</title></path>`).join("")}
    ${M1.regioes.map((r) => { const [x, y, t] = LOBE_LABELS[r.id]; return `<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`; }).join("")}
    ${M1.profundas.map((p) => `<g class="deep" tabindex="0" role="button" aria-label="${p.nome}" data-act="brainSel" data-id="${p.id}"><title>${p.nome}</title><circle class="pulse" cx="${p.x}" cy="${p.y}" r="7" fill="#fff"/><circle cx="${p.x}" cy="${p.y}" r="${sel === p.id ? 10 : 7}" fill="#211936" stroke="#fff" stroke-width="2.5"/></g>`).join("")}
  </svg>`;
}
function regionPanel() {
  const d = D("bastidores"); const all = M1.regioes.concat(M1.profundas); const r = all.find((x) => x.id === d.sel); const seen = Object.keys(d.regions || {}).length;
  const list = `<div class="row" style="gap:6px">${all.map((x) => `<button class="chip ${d.sel === x.id ? "on" : ""}" data-act="brainSel" data-id="${x.id}">${(d.regions || {})[x.id] ? icon("check", 12, 3) : ""}${x.nome}</button>`).join("")}</div>`;
  if (!r) return `<div class="card stack"><span class="label">${seen} de ${all.length} exploradas</span><h3>Toque em uma região</h3><p class="muted">As cores mostram as grandes regiões do cérebro, os lobos. Os pontos brancos indicam estruturas que ficam na parte interna.</p>${list}</div>`;
  return `<div class="card stack" aria-live="polite"><span class="label">${r.apelido}</span><h3>${r.nome}</h3><p>${r.texto}</p><div class="note lav small">${icon("mic", 16)}<span>${r.exemplo}</span></div><span class="label" style="margin-top:4px">${seen} de ${all.length} exploradas</span>${list}</div>`;
}
A.brainSel = (el) => { const d = D("bastidores"); d.sel = el.dataset.id; d.regions = d.regions || {}; d.regions[d.sel] = true; save(); $("#brain").innerHTML = brainSVG(); $("#region").innerHTML = regionPanel(); };
function passHTML(c) {
  const d = D("bastidores"); const f = (d.flip || {})[c.id];
  return `<button class="pass ${f ? "flip" : ""}" data-act="passFlip" data-id="${c.id}" aria-pressed="${!!f}" aria-label="${c.nome}: ${c.apelido}"><div class="inner">
    <div class="face front"><span class="hole"></span><span class="label light">Credencial · ${c.nome}</span><h3>${c.apelido}</h3><p class="role">${c.papel}</p><span style="margin-top:auto;color:var(--agua);display:flex;gap:6px;align-items:center;font-size:.84rem;font-weight:700">${icon(c.icon, 16)} Toque para virar</span></div>
    <div class="face back"><div><b>O que faz</b>${c.faz}</div><div><b>No cérebro</b>${c.onde}</div><div><b>No dia a dia</b>${c.ex}</div></div>
  </div></button>`;
}
A.passFlip = (el) => { const d = D("bastidores"); d.flip = d.flip || {}; d.flip[el.dataset.id] = !d.flip[el.dataset.id]; save(); el.classList.toggle("flip"); };
function diaHTML() {
  const d = D("bastidores"); d.dia = d.dia || 0; d.pick = d.pick || {}; d.rev = d.rev || {};
  const i = d.dia; const sc = M1.dia[i]; const picked = d.pick[i] || []; const rev = !!d.rev[i];
  return `<div class="stack"><div class="timeline" role="tablist" aria-label="Momentos do dia">${M1.dia.map((x, k) => `<button class="${k === i ? "on" : ""} ${d.rev[k] ? "done" : ""}" data-act="diaGo" data-i="${k}">${x.t}</button>`).join("")}</div>
    <div class="scene"><div class="sc-top"><span class="sc-time">${sc.t}</span><p style="font-weight:650;font-size:1.06rem">${sc.s}</p></div>
    <div class="sc-body"><span class="label">Quem da equipe precisa entrar em cena? Escolha quantas quiser.</span>
      <div class="crew-pick">${M1.equipe.map((c) => `<button class="${picked.includes(c.id) ? "on" : ""} ${rev && sc.eq.includes(c.id) ? "hit" : ""}" data-act="crewPick" data-id="${c.id}" aria-pressed="${picked.includes(c.id)}">${icon(c.icon, 16)} ${c.apelido}</button>`).join("")}</div>
      ${rev ? `<div class="note agua">${icon("eye", 18)}<span><b>Nos bastidores:</b> ${sc.nota} As integrantes destacadas costumam participar dessa cena, mas outras também podem ajudar.</span></div>${talk(sc.q)}`
        : `<div><button class="btn btn-dark" data-act="diaReveal" ${picked.length ? "" : "disabled"}>${icon("eye", 16)} Ver os bastidores</button></div>`}
    </div></div>
    ${rev && i < M1.dia.length - 1 ? `<div><button class="btn btn-primary" data-act="diaGo" data-i="${i + 1}">Próximo momento: ${M1.dia[i + 1].t} ${icon("arrowR", 16)}</button></div>` : ""}
    ${rev && i === M1.dia.length - 1 ? `<div class="note lav">${icon("flag", 18)}<span>O dia terminou. Repare que quase todos os momentos chamaram mais de uma integrante: as funções executivas trabalham em equipe.</span></div>` : ""}
  </div>`;
}
A.crewPick = (el) => { const d = D("bastidores"); const i = d.dia; d.pick[i] = toggleIn(d.pick[i] || [], el.dataset.id); save(); $("#dia").innerHTML = diaHTML(); };
A.diaReveal = () => { const d = D("bastidores"); d.rev[d.dia] = true; save(); tone(660, 0.15); $("#dia").innerHTML = diaHTML(); };
A.diaGo = (el) => { const d = D("bastidores"); d.dia = +el.dataset.i; save(); $("#dia").innerHTML = diaHTML(); };
MREND.bastidores = [
  () => `<div class="brain-wrap"><div class="brain-stage" id="brain">${brainSVG()}</div><div id="region">${regionPanel()}</div></div><p class="muted small" style="margin-top:10px">Vista lateral simplificada, com a testa à esquerda.</p>`,
  () => `<div class="stack"><p class="prose">${M1.equipeNota}</p><div class="passes">${M1.equipe.map(passHTML).join("")}</div></div>`,
  () => `<div id="dia">${diaHTML()}</div>`,
];
MSUM.bastidores = () => {
  const d = D("bastidores"); d.team = d.team || {};
  return `<p class="muted small">Como está cada integrante da sua equipe ultimamente? Arraste para cima ou para baixo. Não é medida: é como você percebe hoje.</p>
    <div class="mixer">${M1.equipe.map((c) => fader(c.id, c.apelido.replace(/^(A|O) /, ""), d.team[c.id] ?? 5, "team")).join("")}</div>
    <div class="row between small muted"><span>embaixo: precisa de reforço</span><span>em cima: trabalha bem</span></div>`;
};
INPUTS.team = (el) => { const d = D("bastidores"); d.team = d.team || {}; d.team[el.dataset.id] = +el.value; save(); paintFader(el); };

/* =================== MISSÃO 2 — GRUPO DA TURMA =================== */
function chatInit() { const d = D("grupo"); if (!d.log) { d.log = []; d.ti = 0; d.files = {}; d.ch = {}; pushThread(d); save(); } return d; }
function pushThread(d) { const th = M2.threads[d.ti]; if (th) d.log.push({ k: "them", who: th.who, key: th.key, t: th.msg }); }
function bubble(m, delay) {
  const st = delay ? `style="animation-delay:${delay}ms"` : "";
  if (m.k === "me") return `<div class="msg me" ${st}>${esc(m.t)}</div>`;
  if (m.k === "sys") return `<div class="msg sys" ${st}>${esc(m.t)}</div>`;
  return `<div class="msg them" ${st}><b style="color:${M2.pessoas[m.key]}">${esc(m.who)}</b>${esc(m.t)}</div>`;
}
let chatNew = 0;
function chatHTML() {
  const d = chatInit(); const th = M2.threads[d.ti]; const fresh = d.log.length - chatNew;
  const msgs = d.log.map((m, i) => bubble(m, i >= fresh && chatNew ? (i - fresh) * 650 : 0)).join("");
  chatNew = 0;
  const actions = th ? `<span class="label">Como você quer responder?</span>${th.opts.map((o, k) => `<button class="opt" data-act="chatOpt" data-k="${k}">${o.l}${o.me ? `<small>“${esc(o.me)}”</small>` : `<small>(sem mensagem)</small>`}</button>`).join("")}
      <form class="add-row" onsubmit="event.preventDefault();A.chatOwn()"><label class="sr-only" for="own">Escrever minha resposta</label><input id="own" placeholder="Ou escreva a sua resposta..." maxlength="200" autocomplete="off"><button class="btn btn-dark" type="submit">Enviar</button></form>`
    : `<div class="note agua">${icon("check", 18)}<span>A conversa terminou e todos os arquivos foram liberados.</span></div><div class="row"><button class="btn btn-ghost btn-sm" data-act="chatReset">${icon("refresh", 14)} Recomeçar a conversa</button><button class="btn btn-primary btn-sm" data-act="stepBy" data-d="1">Ir para a mesa de som ${icon("arrowR", 14)}</button></div>`;
  return `<div class="chat-wrap"><div class="phone"><div class="phone-top"><span class="av">8º</span><div><b>8º ano B</b><small>Lucas, Bia, Theo, Mari e você</small></div></div>
      <div class="chat" id="chat" aria-live="polite">${msgs}</div><div class="chat-actions">${actions}</div></div>
    <aside class="stack"><div class="row between"><span class="label">Dossiê</span><span class="label">${Object.keys(d.files).length}/${M2.threads.length}</span></div><div class="dossier">${M2.threads.map((t, i) => d.files[i] ? `<div class="file ${d.lastFile === i ? "new" : ""}"><h4>${icon("file", 16)} ${t.file.t}</h4><p>${t.file.txt}</p><div class="src">${t.file.src}</div></div>` : `<div class="file locked small">${icon("lock", 14)} Arquivo ${pad2(i + 1)} bloqueado</div>`).join("")}</div></aside></div>`;
}
function chatAdvance(d, meText, reply) {
  const th = M2.threads[d.ti]; const before = d.log.length;
  if (meText) d.log.push({ k: "me", t: meText });
  d.log.push({ k: "them", who: reply.who, key: reply.key, t: reply.t });
  d.log.push({ k: "sys", t: "Arquivo liberado: " + th.file.t });
  d.files[d.ti] = true; d.lastFile = d.ti; d.ti++; pushThread(d);
  chatNew = d.log.length - before; save(); tone(587, 0.1, "sine", 0.08);
  $("#chatbox").innerHTML = chatHTML(); const c = $("#chat"); c.scrollTop = c.scrollHeight;
}
A.chatOpt = (el) => { const d = D("grupo"); const o = M2.threads[d.ti].opts[+el.dataset.k]; d.ch[d.ti] = o.l; chatAdvance(d, o.me, o.r); };
A.chatOwn = () => { const v = $("#own").value.trim(); if (!v) return; const d = D("grupo"); const th = M2.threads[d.ti]; d.ch[d.ti] = "Resposta própria: " + v; chatAdvance(d, v, th.opts[0].r); };
A.chatReset = () => { const d = D("grupo"); delete d.log; save(); $("#chatbox").innerHTML = chatHTML(); };
function mesaHTML() {
  const d = D("grupo"); d.mix = d.mix || {}; d.cena = d.cena || "aula"; const mix = d.mix[d.cena] || {};
  const cenaNome = (c) => (c.id === "livre" && d.livre ? d.livre : c.nome);
  return `<div class="stack"><p class="prose">${M2.mesa.intro}</p>
    <div class="row">${M2.mesa.cenas.map((c) => `<button class="chip ${d.cena === c.id ? "on" : ""}" data-act="cena" data-id="${c.id}">${esc(cenaNome(c))}</button>`).join("")}</div>
    ${d.cena === "livre" ? `<input class="field" data-input="livre" placeholder="Qual situação? (ex.: patinando com as amigas)" value="${esc(d.livre || "")}" maxlength="60" aria-label="Situação escolhida">` : ""}
    <div class="mixer">${M2.mesa.canais.map((c) => fader(c.id, c.n, mix[c.id] ?? 5, "mix")).join("")}</div>
    <div class="card tight stack"><span class="label">Comparando as cenas</span><div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:.84rem;min-width:520px;width:100%"><thead><tr><th style="text-align:left;padding:6px">Cena</th>${M2.mesa.canais.map((c) => `<th style="padding:6px;font-weight:600;color:var(--ink-2)">${c.n}</th>`).join("")}</tr></thead><tbody>
      ${M2.mesa.cenas.filter((c) => d.mix[c.id]).map((c) => `<tr><td style="padding:6px;font-weight:650">${esc(cenaNome(c))}</td>${M2.mesa.canais.map((k) => { const v = d.mix[c.id][k.id] ?? 5; return `<td style="padding:6px"><div style="height:8px;border-radius:4px;background:var(--line);overflow:hidden"><div style="height:100%;width:${v * 10}%;background:var(--roxo)"></div></div></td>`; }).join("")}</tr>`).join("") || `<tr><td colspan="7" class="muted" style="padding:8px">Ajuste os canais de uma cena para começar a comparar.</td></tr>`}
    </tbody></table></div></div>
    <div class="note lav">${icon("sliders", 18)}<span>${M2.mesa.leitura}</span></div></div>`;
}
A.cena = (el) => { D("grupo").cena = el.dataset.id; save(); $("#mesa").innerHTML = mesaHTML(); };
INPUTS.mix = (el) => { const d = D("grupo"); d.mix[d.cena] = d.mix[d.cena] || {}; d.mix[d.cena][el.dataset.id] = +el.value; save(); paintFader(el); clearTimeout(INPUTS._mt); INPUTS._mt = setTimeout(() => { const y = window.scrollY; $("#mesa").innerHTML = mesaHTML(); window.scrollTo(0, y); }, 600); };
INPUTS.livre = (el) => { D("grupo").livre = el.value; save(); };
MREND.grupo = [() => `<div id="chatbox">${chatHTML()}</div>`, () => `<div id="mesa">${mesaHTML()}</div>`];
MMOUNT.grupo = { 1: () => { const c = $("#chat"); if (c) c.scrollTop = c.scrollHeight; } };
MSUM.grupo = () => { const d = D("grupo"); const ch = d.ch || {}; const n = Object.keys(d.files || {}).length; return `<p class="small">${n} de ${M2.threads.length} arquivos liberados.</p>${Object.keys(ch).length ? `<ul class="dots small">${Object.entries(ch).map(([i, v]) => `<li><b>${esc(M2.threads[i].who)}:</b> ${esc(v)}</li>`).join("")}</ul>` : ""}`; };

/* =================== MISSÃO 3 — ISSO TEM A VER COMIGO? =================== */
function deckInit() { const d = D("comigo"); if (!d.order) { d.order = shuffle(M3.cartas.map((c) => c.id)); d.sorted = {}; d.star = []; d.ctx = {}; d.hist = []; save(); } return d; }
const cardById = (id) => M3.cartas.find((c) => c.id === id);
function sortHTML() {
  const d = deckInit(); const left = d.order.filter((id) => !d.sorted[id]); const cur = left[0], nxt = left[1]; const n = M3.cartas.length - left.length;
  const card = (id, under) => { const c = cardById(id); return `<div class="scard ${c.cat === "forte" ? "forte" : ""} ${under ? "under" : ""}" ${under ? "" : `id="scard" tabindex="0"`}><span class="label ${c.cat === "forte" ? "light" : ""}">${M3.cats[c.cat]}</span><p class="sit">${c.t}</p><span class="small" style="opacity:.7">${under ? "" : "Arraste até uma pilha ou toque em um botão"}</span></div>`; };
  return `<div class="sort-wrap"><div class="note lav small">${icon("info", 18)}<span>${M3.aviso}</span></div>
    <div class="row between"><span class="label">${n} de ${M3.cartas.length} separadas</span><div class="row" style="gap:6px"><button class="btn btn-ghost btn-sm" data-act="cardUndo" ${d.hist.length ? "" : "disabled"}>${icon("arrowL", 14)} Desfazer</button>${cur ? `<button class="btn btn-ghost btn-sm" data-act="cardSkip">Pular</button>` : ""}</div></div>
    ${cur ? `<div class="deck-zone" id="deckzone">${nxt ? card(nxt, true) : ""}${card(cur)}</div>
      <div class="piles" id="piles">${M3.pilhas.map((p) => `<button class="pile" data-act="cardTo" data-p="${p.id}"><span class="dot" style="background:${p.cor}"></span>${p.nome}<span class="pc">${Object.values(d.sorted).filter((v) => v === p.id).length}</span></button>`).join("")}</div>`
    : `<div class="card stack" style="text-align:center;align-items:center;padding:34px"><span class="ib i-agua">${icon("check", 22)}</span><h3>Todas as cartas foram separadas</h3><p class="muted">Agora dá para ver o seu mapa e escolher o que conversar.</p><button class="btn btn-primary" data-act="stepBy" data-d="1">Ver meu mapa ${icon("arrowR", 16)}</button></div>`}
  </div>`;
}
function sortCard(p, animate) {
  const d = D("comigo"); const id = d.order.find((x) => !d.sorted[x]); if (!id) return;
  const go = () => { d.sorted[id] = p; d.hist.push(id); save(); tone(523 + Object.keys(d.sorted).length * 10, 0.1, "sine", 0.07); $("#sort").innerHTML = sortHTML(); bindDeck(); };
  const el = $("#scard");
  if (animate && el) { const pile = $(`.pile[data-p="${p}"]`); const r = pile.getBoundingClientRect(), c = el.getBoundingClientRect(); el.classList.add("fly"); el.style.transform = `translate(${r.left + r.width / 2 - (c.left + c.width / 2)}px,${r.top - c.top}px) scale(.3) rotate(${(Math.random() - 0.5) * 30}deg)`; el.style.opacity = "0"; setTimeout(go, 300); }
  else go();
}
A.cardTo = (el) => sortCard(el.dataset.p, true);
A.cardSkip = () => { const d = D("comigo"); const id = d.order.find((x) => !d.sorted[x]); d.order = d.order.filter((x) => x !== id).concat(id); save(); $("#sort").innerHTML = sortHTML(); bindDeck(); };
A.cardUndo = () => { const d = D("comigo"); const id = d.hist.pop(); if (!id) return; delete d.sorted[id]; d.order = [id].concat(d.order.filter((x) => x !== id)); save(); $("#sort").innerHTML = sortHTML(); bindDeck(); };
function bindDeck() {
  const el = $("#scard"); if (!el) return; let sx = 0, sy = 0, drag = false;
  const piles = () => $$("#piles .pile");
  const over = (x, y) => piles().find((p) => { const r = p.getBoundingClientRect(); return x >= r.left - 10 && x <= r.right + 10 && y >= r.top - 40 && y <= r.bottom + 10; });
  el.addEventListener("pointerdown", (e) => { drag = true; sx = e.clientX; sy = e.clientY; el.setPointerCapture(e.pointerId); el.classList.add("dragging"); });
  el.addEventListener("pointermove", (e) => { if (!drag) return; const dx = e.clientX - sx, dy = e.clientY - sy; el.style.transform = `translate(${dx}px,${dy}px) rotate(${dx / 18}deg)`; const h = over(e.clientX, e.clientY); piles().forEach((p) => p.classList.toggle("hot", p === h)); });
  const end = (e) => { if (!drag) return; drag = false; el.classList.remove("dragging"); const h = over(e.clientX, e.clientY); piles().forEach((p) => p.classList.remove("hot")); if (h) { el.style.transform = ""; sortCard(h.dataset.p, false); } else { el.classList.add("fly"); el.style.transform = ""; setTimeout(() => el.classList.remove("fly"), 350); } };
  el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
  el.addEventListener("keydown", (e) => { const k = { 1: "muito", 2: "asvezes", 3: "pouco", 4: "depende" }[e.key]; if (k) sortCard(k, true); });
}
function mapHTML() {
  const d = deckInit(); const left = M3.cartas.filter((c) => !d.sorted[c.id]).length; const sel = d.sel ? cardById(d.sel) : null;
  return `<div class="stack">${left ? `<div class="note amarelo">${icon("cards", 18)}<span>Ainda faltam ${left} cartas para separar. <button class="btn btn-ghost btn-sm" data-act="goStep" data-i="1">Voltar ao baralho</button></span></div>` : ""}
    <p class="muted">Toque em uma carta para mudar de pilha, marcar onde acontece ou escolhê-la para conversar. Você pode escolher até três.</p>
    <div class="board-map">${M3.pilhas.map((p) => { const cs = M3.cartas.filter((c) => d.sorted[c.id] === p.id); return `<div class="bcol"><h4><span class="dot" style="width:10px;height:10px;border-radius:3px;background:${p.cor}"></span>${p.nome}<span class="label" style="margin-left:auto">${cs.length}</span></h4>${cs.map((c) => `<button class="mcard ${c.cat === "forte" ? "forte" : ""} ${d.star.includes(c.id) ? "star" : ""}" data-act="mapSel" data-id="${c.id}">${d.star.includes(c.id) ? icon("chat", 14) : ""}<span>${c.t}</span></button>`).join("") || `<span class="muted small">Nenhuma carta</span>`}</div>`; }).join("")}</div>
    ${sel ? deepHTML(sel) : ""}</div>`;
}
function deepHTML(c) {
  const d = D("comigo"); const qs = c.cat === "forte" ? M3.aprofundar.forte : M3.aprofundar.dif; const ctx = d.ctx[c.id] || []; const starred = d.star.includes(c.id);
  return `<div class="deep stack" id="deep"><div class="row between"><span class="label">${M3.cats[c.cat]}</span><button class="btn btn-ghost btn-sm" data-act="mapSel" data-id="">${icon("x", 14)} Fechar</button></div><h3>${c.t}</h3>
    <div class="row" style="gap:6px"><span class="small muted">Pilha:</span>${M3.pilhas.map((p) => `<button class="chip ${d.sorted[c.id] === p.id ? "on" : ""}" data-act="mapMove" data-p="${p.id}">${p.nome}</button>`).join("")}</div>
    <div class="row" style="gap:6px"><span class="small muted">Onde acontece:</span>${chipsHTML(M3.contextos, ctx, "mapCtx", "", "agua")}</div>
    <div><button class="btn ${starred ? "btn-dark" : "btn-primary"} btn-sm" data-act="mapStar" ${!starred && d.star.length >= 3 ? "disabled" : ""}>${icon("chat", 14)} ${starred ? "Escolhida para conversar" : d.star.length >= 3 ? "Já há três escolhidas" : "Escolher para conversar"}</button></div>
    ${starred ? `<div class="grid g2">${qs.map((q) => talk(q)).join("")}</div>` : ""}</div>`;
}
const mapRefresh = () => { $("#map").innerHTML = mapHTML(); const dp = $("#deep"); dp && dp.scrollIntoView({ behavior: "smooth", block: "nearest" }); };
A.mapSel = (el) => { D("comigo").sel = el.dataset.id || null; save(); mapRefresh(); };
A.mapMove = (el) => { const d = D("comigo"); d.sorted[d.sel] = el.dataset.p; save(); mapRefresh(); };
A.mapCtx = (el) => { const d = D("comigo"); d.ctx[d.sel] = toggleIn(d.ctx[d.sel] || [], el.dataset.v); save(); mapRefresh(); };
A.mapStar = () => { const d = D("comigo"); if (d.star.includes(d.sel)) d.star = d.star.filter((x) => x !== d.sel); else if (d.star.length < 3) d.star.push(d.sel); save(); mapRefresh(); };
MREND.comigo = [() => `<div id="sort">${sortHTML()}</div>`, () => `<div id="map">${mapHTML()}</div>`];
MMOUNT.comigo = { 1: bindDeck };
MSUM.comigo = () => { const d = deckInit(); return `<div class="row" style="gap:6px">${M3.pilhas.map((p) => `<span class="tag line">${p.nome}: ${Object.values(d.sorted).filter((v) => v === p.id).length}</span>`).join("")}</div>${d.star.length ? `<span class="small muted">Escolhidas para conversar:</span><ul class="dots small">${d.star.map((id) => `<li>${cardById(id).t}${(d.ctx[id] || []).length ? ` <span class="muted">(${d.ctx[id].join(", ")})</span>` : ""}</li>`).join("")}</ul>` : ""}`; };

/* =================== MISSÃO 4 — LABORATÓRIO =================== */
const LD = () => { const d = D("laboratorio"); d.played = d.played || {}; d.j = d.j || {}; return d; };
const gameArea = () => $("#game-area");
function gameHeader(g) {
  return `<div class="game-head"><div class="row" style="gap:12px"><span class="ib i-night">${icon(g.icon, 22)}</span><div><span class="label">${g.hab}</span><h3>${g.nome}</h3></div></div>
  <div class="row" style="gap:8px"><button class="btn btn-soft btn-icon btn-sm" data-act="toggleSound" aria-label="${S.sound ? "Desligar som" : "Ligar som"}">${icon(S.sound ? "volume" : "mute", 18)}</button><button class="btn btn-ghost btn-sm" data-act="gameEnd">${icon("flag", 14)} Encerrar e registrar</button></div></div>`;
}
A.toggleSound = (el) => { S.sound = !S.sound; save(); el.innerHTML = icon(S.sound ? "volume" : "mute", 18); };
function labGrid() { const d = LD(); return GAMES.map((g) => `<button class="exp ${d.cur === g.id ? "on" : ""}" data-act="gameOpen" data-id="${g.id}"><div class="row between"><span class="ib sm i-lilas">${icon(g.icon, 18)}</span>${d.played[g.id] ? `<span class="tag agua">${icon("check", 11, 3)} Registrado</span>` : ""}</div><span class="label">${g.hab}</span><h4>${g.nome}</h4><p>${g.desc}</p></button>`).join(""); }
A.gameOpen = (el) => { stopAllGames(); LD().cur = el.dataset.id; save(); $("#lab-grid").innerHTML = labGrid(); startGame(el.dataset.id); gameArea().scrollIntoView({ behavior: "smooth", block: "start" }); };
function startGame(id) { gameArea().hidden = false; ({ atencao: attStart, memoria: memStart, inibicao: inhStart, planejamento: planStart, flexibilidade: flexStart })[id](); }
A.gameEnd = () => finishGame(LD().cur);
function journalHTML(g) {
  const j = LD().j[g.id] || { p: [], e: [] };
  return `<div class="journal"><span class="label">Diário do experimento</span><div><p class="small" style="font-weight:700;margin-bottom:6px">O que aconteceu com você?</p><div class="row" style="gap:6px">${chipsHTML(M4.percepcoes, j.p, "jP")}</div></div>
    <div><p class="small" style="font-weight:700;margin-bottom:6px">Que estratégia você usou?</p><div class="row" style="gap:6px">${chipsHTML(M4.estrategias, j.e, "jE", "", "agua")}</div></div></div>`;
}
function finishGame(id) {
  stopAllGames(); const g = GAMES.find((x) => x.id === id); if (!g) return; const d = LD(); d.played[id] = true; d.j[id] = d.j[id] || { p: [], e: [] }; save(); chime();
  gameArea().innerHTML = `<div class="game-head"><div class="row" style="gap:12px"><span class="ib i-agua">${icon("check", 22)}</span><div><span class="label">${g.hab}</span><h3>${g.nome}</h3></div></div></div>
    <div class="stack">${journalHTML(g)}<div class="kv"><span class="k">A habilidade por trás do jogo</span><p>${g.explica}</p></div>${talk(g.pergunta)}
    <div class="row"><button class="btn btn-ghost" data-act="gameOpen" data-id="${g.id}">${icon("refresh", 16)} Jogar de novo</button><button class="btn btn-dark" data-act="scrollTo" data-target="lab-grid">Escolher outro experimento</button></div></div>`;
  $("#lab-grid").innerHTML = labGrid();
}
A.jP = (el) => { const d = LD(); const j = d.j[d.cur]; toggleIn(j.p, el.dataset.v); save(); el.classList.toggle("on"); };
A.jE = (el) => { const d = LD(); const j = d.j[d.cur]; toggleIn(j.e, el.dataset.v); save(); el.classList.toggle("on"); };

/* 1. Holofote */
const ATT_ROUNDS = [
  { cols: 5, target: ["star", "amarelo"], label: "estrelas amarelas", n: 5, pool: () => [pick(["note", "mic", "skate"]), pick(Object.keys(SYM_COLORS))] },
  { cols: 6, target: ["note", "agua"], label: "notas musicais verde-água", n: 6, pool: () => (Math.random() < 0.5 ? ["note", pick(["roxo", "coral", "azul", "amarelo", "lilas"])] : [pick(["star", "mic", "skate"]), Math.random() < 0.5 ? "agua" : pick(Object.keys(SYM_COLORS))]) },
  { cols: 6, target: ["skate", "roxo"], label: "patins roxos", n: 6, distract: true, pool: () => (Math.random() < 0.45 ? ["skate", pick(["lilas", "azul", "coral"])] : [pick(["star", "mic", "note"]), Math.random() < 0.6 ? "roxo" : pick(Object.keys(SYM_COLORS))]) },
];
function attStart() { G.att = { round: 0 }; attRound(); }
function attRound() {
  const R = ATT_ROUNDS[G.att.round]; const total = R.cols * R.cols; const pos = new Set(shuffle([...Array(total).keys()]).slice(0, R.n));
  const cells = [...Array(total)].map((_, i) => { if (pos.has(i)) return { s: R.target[0], c: R.target[1], t: true }; let x; do { x = R.pool(); } while (x[0] === R.target[0] && x[1] === R.target[1]); return { s: x[0], c: x[1], t: false }; });
  G.att.cells = cells; G.att.found = 0; G.att.n = R.n;
  gameArea().innerHTML = `${gameHeader(GAMES[0])}
  <div class="row between" style="margin-bottom:12px"><p>Rodada ${G.att.round + 1} de ${ATT_ROUNDS.length}: encontre todos os <span class="target-pill">${sym(R.target[0], R.target[1])} ${R.label}</span></p><span class="gstatus" id="att-status" aria-live="polite">0/${R.n}</span></div>
  ${R.distract ? `<p class="muted small" style="margin-bottom:10px">Nesta rodada, alguns elementos vão atravessar a tela. Procure manter o foco no alvo.</p>` : ""}
  <div class="att-grid" style="grid-template-columns:repeat(${R.cols},minmax(0,1fr))">${cells.map((c, i) => `<button class="att-cell" data-act="attCell" data-i="${i}" aria-label="${SHAPE_NOMES[c.s]} ${SYM_NOMES[c.c]}">${sym(c.s, c.c)}</button>`).join("")}${R.distract ? `<div class="distract-layer" id="distract"></div>` : ""}</div>
  <div id="att-next" style="margin-top:14px;text-align:center"></div>`;
  if (R.distract) attDistract();
}
function attDistract() { const layer = $("#distract"); if (!layer) return; const sp = document.createElement("span"); const size = 26 + Math.random() * 26; sp.style.left = Math.random() * 85 + "%"; sp.style.top = 40 + Math.random() * 55 + "%"; sp.style.width = size + "px"; sp.style.height = size + "px"; sp.innerHTML = sym(pick(["note", "star"]), pick(["amarelo", "coral", "agua"])); layer.appendChild(sp); setTimeout(() => sp.remove(), 5000); gLater(attDistract, 700); }
A.attCell = (el) => {
  const c = G.att.cells[+el.dataset.i]; if (el.classList.contains("found")) return;
  if (c.t) {
    el.classList.add("found"); G.att.found++; tone(660 + G.att.found * 40, 0.15, "sine", 0.1); $("#att-status").textContent = `${G.att.found}/${G.att.n}`;
    if (G.att.found === G.att.n) { chime(); G.timers.forEach(clearTimeout); G.timers = []; const last = G.att.round === ATT_ROUNDS.length - 1;
      $("#att-next").innerHTML = `<p class="muted" style="margin-bottom:10px">Todos os alvos encontrados. ${last ? "Esta era a última rodada." : "A próxima rodada é um pouco mais desafiadora."}</p>${last ? `<button class="btn btn-primary" data-act="gameEnd">Registrar no diário ${icon("arrowR", 16)}</button>` : `<button class="btn btn-dark" data-act="attNext">Próxima rodada ${icon("arrowR", 16)}</button>`}`; }
  } else { el.classList.remove("nope"); void el.offsetWidth; el.classList.add("nope"); softNo(); }
};
A.attNext = () => { G.att.round++; attRound(); };

/* 2. Sequência musical */
const PADS = [{ s: "star", c: "amarelo", f: 523.25, bg: "#FBF3D9" }, { s: "note", c: "agua", f: 392.0, bg: "#E2F4EF" }, { s: "mic", c: "roxo", f: 329.63, bg: "#EFE9F9" }, { s: "skate", c: "coral", f: 261.63, bg: "#FBEAEC" }];
function memStart() {
  G.mem = { seq: [], pos: 0, phase: "idle" };
  gameArea().innerHTML = `${gameHeader(GAMES[1])}<p style="text-align:center" class="prose" >Observe a sequência de luzes e sons. Depois, toque nos símbolos na mesma ordem. A cada acerto, a sequência ganha mais um elemento.</p>
  <div class="simon" id="simon">${PADS.map((p, i) => `<button class="pad" data-act="memPad" data-i="${i}" style="background:${p.bg};color:${SYM_COLORS[p.c]}" aria-label="${SHAPE_NOMES[p.s]}" disabled>${sym(p.s, p.c)}</button>`).join("")}</div>
  <p id="mem-status" class="gstatus" style="text-align:center;min-height:1.6em" aria-live="polite">Quando estiver pronta, toque em Começar.</p>
  <div id="mem-ctrl" class="row" style="justify-content:center;margin-top:8px"><button class="btn btn-primary" data-act="memGo">${icon("play", 16)} Começar</button></div>`;
}
function memLight(i, dur = 420) { const b = $$("#simon .pad")[i]; if (!b) return; b.classList.add("lit"); tone(PADS[i].f, dur / 1000, "sine", 0.18); setTimeout(() => b.classList.remove("lit"), dur); }
const memPads = (on) => $$("#simon .pad").forEach((b) => (b.disabled = !on));
A.memGo = () => { G.mem.seq = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]; memPlay(); };
function memPlay() {
  G.mem.phase = "watch"; G.mem.pos = 0; memPads(false); $("#mem-ctrl").innerHTML = ""; $("#mem-status").textContent = `Observe a sequência de ${G.mem.seq.length}`;
  G.mem.seq.forEach((v, k) => gLater(() => memLight(v), 700 + k * 720));
  gLater(() => { G.mem.phase = "play"; memPads(true); $("#mem-status").textContent = "Sua vez"; }, 700 + G.mem.seq.length * 720);
}
A.memPad = (el) => {
  if (G.mem.phase !== "play") return; const i = +el.dataset.i; memLight(i, 260);
  if (i === G.mem.seq[G.mem.pos]) { G.mem.pos++; if (G.mem.pos === G.mem.seq.length) { G.mem.phase = "watch"; memPads(false); $("#mem-status").textContent = "Certo. A próxima sequência terá mais um elemento."; G.mem.seq.push(Math.floor(Math.random() * 4)); gLater(memPlay, 1300); } }
  else { G.mem.phase = "idle"; memPads(false); softNo();
    $("#mem-status").innerHTML = `A sequência era: <span style="display:inline-flex;gap:4px;vertical-align:middle">${G.mem.seq.map((v) => `<span style="width:24px;height:24px;display:inline-block">${sym(PADS[v].s, PADS[v].c)}</span>`).join("")}</span>`;
    $("#mem-ctrl").innerHTML = `<button class="btn btn-dark" data-act="memRetry">${icon("refresh", 16)} Tentar de novo</button><button class="btn btn-primary" data-act="gameEnd">Registrar no diário</button>`; }
};
A.memRetry = () => memPlay();

/* 3. Hora do aplauso */
const INH_PHASES = [
  { regra: "Toque em <b>Aplaudir</b> (ou aperte a barra de espaço) quando aparecer o <b>microfone</b>. Quando aparecer a placa de <b>silêncio</b>, segure o aplauso.", n: 20, gen: () => (Math.random() < 0.7 ? { k: "mic", go: true } : { k: "shh", go: false }) },
  { regra: "Nova regra: aplauda <b>só</b> quando o microfone aparecer <b>com o holofote aceso</b>. Microfone no escuro ou placa de silêncio: segure.", n: 20, gen: () => { const r = Math.random(); return r < 0.5 ? { k: "mic", spot: true, go: true } : r < 0.8 ? { k: "mic", spot: false, go: false } : { k: "shh", spot: Math.random() < 0.5, go: false }; } },
];
const SHH_SVG = `<svg viewBox="0 0 120 120" width="110" height="110" aria-label="Placa de silêncio" role="img"><rect x="10" y="26" width="100" height="56" rx="12" fill="#E9A4AD"/><text x="60" y="61" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700" font-size="15" fill="#211936" letter-spacing="2">SILÊNCIO</text><rect x="55" y="82" width="10" height="30" rx="3" fill="#C6B2E8"/></svg>`;
const MIC_BIG = () => sym("mic", "amarelo").replace("<svg", '<svg width="110" height="110"');
function inhStart() { G.inh = { phase: 0 }; inhIntro(); }
function inhIntro() {
  const P = INH_PHASES[G.inh.phase];
  gameArea().innerHTML = `${gameHeader(GAMES[2])}<div class="stack" style="align-items:center;text-align:center"><span class="tag coral">Parte ${G.inh.phase + 1} de ${INH_PHASES.length}</span><p class="prose">${P.regra}</p><button class="btn btn-primary" data-act="inhGo">${icon("play", 16)} Começar</button></div>`;
}
A.inhGo = () => {
  const P = INH_PHASES[G.inh.phase]; G.inh.trials = Array.from({ length: P.n }, P.gen); G.inh.t = -1; G.running = true;
  gameArea().innerHTML = `${gameHeader(GAMES[2])}<p style="text-align:center" class="small">${P.regra}</p>
  <div class="stage-box"><div class="spot" id="inh-spot"></div><div id="inh-stim"></div><div class="flash" id="inh-flash" aria-live="polite"></div></div>
  <div style="text-align:center" id="inh-ctrl"><button class="btn btn-dark" style="padding:15px 30px;font-size:1.05rem" data-act="inhClap">${icon("hand", 20)} Aplaudir</button></div>`;
  G.keyHandler = (e) => { if (e.code === "Space" && G.running) { e.preventDefault(); A.inhClap(); } }; document.addEventListener("keydown", G.keyHandler);
  gLater(inhNext, 900);
};
function inhNext() {
  G.inh.t++; const stim = $("#inh-stim"); if (!stim) return;
  if (G.inh.t >= G.inh.trials.length) { G.running = false;
    if (G.inh.phase < INH_PHASES.length - 1) $("#inh-ctrl").innerHTML = `<p class="muted" style="margin-bottom:10px">Parte ${G.inh.phase + 1} concluída. Na próxima, a regra muda.</p><button class="btn btn-primary" data-act="inhPhase2">Próxima parte ${icon("arrowR", 16)}</button>`;
    else finishGame("inibicao"); return; }
  const tr = G.inh.trials[G.inh.t]; tr.clapped = false;
  $("#inh-spot").classList.toggle("on", G.inh.phase === 0 ? tr.k === "mic" : !!tr.spot);
  stim.className = "stim"; stim.innerHTML = tr.k === "mic" ? MIC_BIG() : SHH_SVG; $("#inh-flash").textContent = "";
  gLater(() => { if (!$("#inh-stim")) return; stim.innerHTML = ""; $("#inh-spot").classList.remove("on"); gLater(inhNext, 550 + Math.random() * 300); }, 1050);
}
A.inhClap = () => {
  if (!G.running || !G.inh || G.inh.t < 0) return; const tr = G.inh.trials[G.inh.t]; if (!tr || tr.clapped || !$("#inh-stim").innerHTML) return;
  tr.clapped = true; const fl = $("#inh-flash");
  if (tr.go) { tone(880, 0.1, "triangle", 0.1); tone(1175, 0.12, "triangle", 0.08, 0.06); fl.textContent = "No tempo certo"; } else { softNo(); fl.textContent = "Era o momento de segurar. Continue."; }
};
A.inhPhase2 = () => { G.inh.phase = 1; inhIntro(); };

/* 4. Rumo ao show */
function planStart(scId) { const sc = PLAN_SCENARIOS.find((s) => s.id === scId) || PLAN_SCENARIOS[0]; G.plan = { sc, bank: shuffle(sc.steps.map((s) => s.id)), plan: [], bad: [], fb: "" }; planRender(); }
function planRender() {
  const { sc, bank, plan, bad } = G.plan; const step = (id) => sc.steps.find((s) => s.id === id);
  gameArea().innerHTML = `${gameHeader(GAMES[3])}
  <div class="row" style="margin-bottom:12px">${PLAN_SCENARIOS.map((s) => `<button class="chip ${s.id === sc.id ? "on" : ""}" data-act="planSc" data-id="${s.id}">${icon(s.icon, 14)} ${s.nome}</button>`).join("")}</div>
  <p>Objetivo: <b>${sc.nome}</b>. Toque nas etapas para montar o plano na ordem em que você faria. Use as setas para trocar de lugar.</p>
  <div class="plan-cols" style="margin-top:12px"><div><h4 style="margin-bottom:8px">Etapas disponíveis</h4><div class="plan-list" style="background:var(--surface)">${bank.length ? bank.map((id) => `<button class="plan-item" data-act="planAdd" data-id="${id}">${icon("plus", 15)}<span class="grow">${step(id).t}</span></button>`).join("") : `<p class="muted small" style="text-align:center;padding:16px 0">Todas as etapas estão no plano.</p>`}</div></div>
  <div><h4 style="margin-bottom:8px">Meu plano</h4><div class="plan-list">${plan.length ? plan.map((id, i) => `<div class="plan-item ${bad.includes(id) ? "warn" : ""}"><span class="pn">${i + 1}</span><span class="grow">${step(id).t}</span><button class="mini" data-act="planMove" data-i="${i}" data-d="-1" aria-label="Subir">${icon("up", 15)}</button><button class="mini" data-act="planMove" data-i="${i}" data-d="1" aria-label="Descer">${icon("down", 15)}</button><button class="mini" data-act="planDel" data-i="${i}" aria-label="Remover">${icon("x", 15)}</button></div>`).join("") : `<p class="muted small" style="text-align:center;padding:16px 0">Seu plano aparece aqui.</p>`}</div></div></div>
  <div style="margin-top:14px" aria-live="polite">${G.plan.fb}</div>
  <div class="row" style="margin-top:12px"><button class="btn btn-dark" data-act="planCheck" ${bank.length ? "disabled" : ""}>${icon("check", 16)} Conferir o plano</button><button class="btn btn-ghost" data-act="planSc" data-id="${sc.id}">${icon("refresh", 16)} Recomeçar</button></div>`;
}
A.planSc = (el) => planStart(el.dataset.id);
A.planAdd = (el) => { G.plan.bank = G.plan.bank.filter((x) => x !== el.dataset.id); G.plan.plan.push(el.dataset.id); G.plan.bad = []; G.plan.fb = ""; tone(587, 0.08, "sine", 0.07); planRender(); };
A.planDel = (el) => { G.plan.bank.push(G.plan.plan.splice(+el.dataset.i, 1)[0]); G.plan.bad = []; G.plan.fb = ""; planRender(); };
A.planMove = (el) => { const i = +el.dataset.i, j = i + +el.dataset.d, p = G.plan.plan; if (j < 0 || j >= p.length) return; [p[i], p[j]] = [p[j], p[i]]; G.plan.bad = []; G.plan.fb = ""; planRender(); };
A.planCheck = () => {
  const { sc, plan } = G.plan; const pos = Object.fromEntries(plan.map((id, i) => [id, i])); const issues = [];
  plan.forEach((id) => sc.steps.find((x) => x.id === id).dep.forEach((dd) => { if (pos[dd] > pos[id]) issues.push([id, dd]); }));
  G.plan.bad = [...new Set(issues.map((x) => x[0]))]; const nm = (id) => sc.steps.find((x) => x.id === id).t;
  if (!issues.length) { G.plan.fb = `<div class="note agua">${icon("check", 18)}<span><b>Seu plano funciona.</b> Cada etapa aparece depois das etapas de que depende. Algumas poderiam estar em outra ordem e o plano continuaria funcionando: quase sempre existe mais de um bom caminho.</span></div><div class="row" style="margin-top:10px"><button class="btn btn-primary" data-act="gameEnd">Registrar no diário ${icon("arrowR", 16)}</button></div>`; chime(); }
  else { G.plan.fb = `<div class="note amarelo">${icon("bulb", 18)}<span>Algumas etapas dependem de outras que precisam vir antes:<ul style="margin:6px 0 0;padding-left:18px">${issues.map(([a, b]) => `<li>“${nm(a)}” depende de “${nm(b)}”.</li>`).join("")}</ul></span></div>`; softNo(); }
  planRender();
};

/* 5. Troca de ritmo */
const FLEX_TARGETS = [{ s: "star", c: "roxo", n: 1 }, { s: "note", c: "agua", n: 2 }, { s: "mic", c: "coral", n: 3 }];
const FLEX_PHASES = [
  { regra: "cor", n: 6, txt: "Separe cada carta pela <b>cor</b>: coloque na pilha que tem a mesma cor." },
  { regra: "forma", n: 6, txt: "A regra mudou. Agora separe pela <b>forma</b>: coloque na pilha que tem o mesmo símbolo." },
  { regra: "misto", n: 8, txt: "Regra final: observe a <b>borda</b> da carta. Borda <b>amarela contínua</b>: separe pela cor. Borda <b>roxa tracejada</b>: separe pela forma." },
];
function flexCard() { let s, c; do { s = Math.floor(Math.random() * 3); c = Math.floor(Math.random() * 3); } while (s === c); return { s: FLEX_TARGETS[s].s, si: s, c: FLEX_TARGETS[c].c, ci: c, n: 1 + Math.floor(Math.random() * 3), rule: Math.random() < 0.5 ? "cor" : "forma" }; }
const fcardHTML = (card, big = false, cls = "") => `<div class="fcard ${big ? "big" : ""} ${cls}">${Array.from({ length: card.n }, () => sym(card.s, card.c)).join("")}</div>`;
function flexStart() { G.flex = { phase: 0, k: 0 }; flexIntro(true); }
function flexIntro(first) {
  const P = FLEX_PHASES[G.flex.phase];
  gameArea().innerHTML = `${gameHeader(GAMES[4])}<div class="stack" style="align-items:center;text-align:center"><span class="rule-banner ${first ? "" : "changed"}">${icon("shuffle", 16)} ${first ? "Primeira regra" : "A regra mudou"}</span><p class="prose">${P.txt}</p>
  ${P.regra === "misto" ? `<div class="row" style="justify-content:center;gap:20px"><div class="stack" style="align-items:center;gap:6px">${fcardHTML({ s: "note", c: "coral", n: 1 }, false, "rule-cor")}<span class="tag amarelo">pela cor</span></div><div class="stack" style="align-items:center;gap:6px">${fcardHTML({ s: "note", c: "coral", n: 1 }, false, "rule-forma")}<span class="tag">pela forma</span></div></div>` : ""}
  <button class="btn btn-primary" data-act="flexGo">${icon("play", 16)} ${first ? "Começar" : "Continuar"}</button></div>`;
}
A.flexGo = () => { G.flex.k = 0; flexDeal(); };
function flexDeal() {
  const P = FLEX_PHASES[G.flex.phase]; G.flex.card = flexCard(); const card = G.flex.card; const rule = P.regra === "misto" ? card.rule : P.regra;
  gameArea().innerHTML = `${gameHeader(GAMES[4])}<div class="row between" style="margin-bottom:10px"><span class="rule-banner">${icon("shuffle", 16)} ${P.regra === "misto" ? "Observe a borda" : rule === "cor" ? "Regra: cor" : "Regra: forma"}</span><span class="gstatus">parte ${G.flex.phase + 1}/3 · carta ${G.flex.k + 1}/${P.n}</span></div>
  <div style="display:grid;place-items:center;margin:8px 0">${fcardHTML(card, true, P.regra === "misto" ? (card.rule === "cor" ? "rule-cor" : "rule-forma") : "")}</div>
  <div class="flex-table">${FLEX_TARGETS.map((t, i) => `<button class="bin" data-act="flexPick" data-i="${i}" aria-label="Pilha ${i + 1}: ${t.n} ${SHAPE_NOMES[t.s]} ${SYM_NOMES[t.c]}">${fcardHTML(t)}</button>`).join("")}</div>
  <p id="flex-fb" class="gstatus" style="text-align:center;margin-top:12px;min-height:1.6em" aria-live="polite"></p>`;
}
A.flexPick = (el) => {
  if (G.flex.lock) return; const P = FLEX_PHASES[G.flex.phase]; const card = G.flex.card; const rule = P.regra === "misto" ? card.rule : P.regra; const right = rule === "cor" ? card.ci : card.si; const i = +el.dataset.i; G.flex.lock = true;
  if (i === right) { el.classList.add("good"); tone(698, 0.14, "sine", 0.1); $("#flex-fb").textContent = "Certo"; }
  else { el.classList.add("bad"); $$(".bin")[right].classList.add("good"); softNo(); $("#flex-fb").textContent = `Pela regra atual (${rule}), ela vai na pilha destacada.`; }
  gLater(() => { G.flex.lock = false; G.flex.k++; if (G.flex.k >= P.n) { if (G.flex.phase < FLEX_PHASES.length - 1) { G.flex.phase++; flexIntro(false); } else finishGame("flexibilidade"); } else flexDeal(); }, i === right ? 650 : 1500);
};

MREND.laboratorio = [() => `<div class="stack"><div class="note small">${icon("info", 18)}<span>Os experimentos não medem atenção, memória ou inteligência. Experimente quantos quiser; não é necessário fazer todos.</span></div><div class="lab-grid" id="lab-grid" style="scroll-margin-top:80px">${labGrid()}</div><section class="game-area" id="game-area" hidden style="scroll-margin-top:80px"></section></div>`];
MMOUNT.laboratorio = { 1: () => { const d = LD(); if (d.cur && d.played[d.cur]) finishGame(d.cur); } };
MSUM.laboratorio = () => { const d = LD(); const pl = GAMES.filter((g) => d.played[g.id]); return pl.length ? `<ul class="dots small">${pl.map((g) => { const j = d.j[g.id] || { p: [], e: [] }; return `<li><b>${g.nome}</b>${j.p.length ? " · " + j.p.join(", ") : ""}${j.e.length ? ` · <span style="color:var(--agua-ink)">${j.e.join(", ")}</span>` : ""}</li>`; }).join("")}</ul>` : `<p class="small muted">Nenhum experimento registrado ainda.</p>`; };
