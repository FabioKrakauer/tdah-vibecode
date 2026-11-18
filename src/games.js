/* =========================================================
   ABA 4 — DESAFIO CEREBRAL (5 jogos)
   Experiências educativas: não medem atenção, memória
   ou funções executivas, e não geram pontuação.
   ========================================================= */
let G = { timers: [], keyHandler: null };
function gLater(fn, ms) { const t = setTimeout(fn, ms); G.timers.push(t); return t; }
function stopAllGames() {
  G.timers.forEach(clearTimeout); G.timers = [];
  if (G.keyHandler) document.removeEventListener("keydown", G.keyHandler); G.keyHandler = null;
  G.running = false;
}
const gameArea = () => $("#game-area");
function gameHeader(g, extra = "") {
  return `<div class="game-head"><div class="row" style="gap:12px"><span class="icon-blob b-${g.cor}">${icon(g.icon, 24)}</span><div><span class="eyebrow">${g.hab}</span><h2>${g.nome}</h2></div></div>
  <div class="row" style="gap:8px">${extra}<button class="btn btn-soft btn-icon btn-sm" data-act="toggleSound" aria-label="${S.sound ? "Desligar som" : "Ligar som"}" title="${S.sound ? "Som ligado" : "Som desligado"}">${icon(S.sound ? "volume" : "mute", 18)}</button><button class="btn btn-ghost btn-sm" data-act="gameEnd">${icon("flag", 16)} Encerrar</button></div></div>`;
}
A.toggleSound = (el) => { S.sound = !S.sound; save(); el.innerHTML = icon(S.sound ? "volume" : "mute", 18); el.setAttribute("aria-label", S.sound ? "Desligar som" : "Ligar som"); };
function gamesGrid() {
  return GAMES.map((g) => `<button class="game-tile ${S.curGame === g.id ? "on" : ""}" data-act="gameOpen" data-id="${g.id}"><div class="gt-top"><span class="icon-blob b-${g.cor}">${icon(g.icon, 24)}</span>${S.games[g.id] ? `<span class="tag amarelo">${starFill(12)} Experimentado</span>` : ""}</div><span class="eyebrow" style="letter-spacing:.08em">${g.hab}</span><h3>${g.nome}</h3><p>${g.desc}</p></button>`).join("");
}
A.gameOpen = (el) => { stopAllGames(); S.curGame = el.dataset.id; save(); $("#games-grid").innerHTML = gamesGrid(); startGame(S.curGame); gameArea().scrollIntoView({ behavior: "smooth", block: "start" }); };
function startGame(id) { const area = gameArea(); area.hidden = false; ({ atencao: attStart, memoria: memStart, inibicao: inhStart, planejamento: planStart, flexibilidade: flexStart })[id](); }
A.gameEnd = () => finishGame(S.curGame);
function finishGame(id) {
  stopAllGames(); const g = GAMES.find((x) => x.id === id); if (!g) return;
  S.games[id] = true; save(); chime();
  gameArea().innerHTML = `${gameHeader(g).replace(/<button class="btn btn-ghost btn-sm" data-act="gameEnd">.*?<\/button>/, "")}
  <div class="game-end"><div class="row" style="gap:10px"><span class="tag agua">${icon("check", 14, 2.4)} Desafio experimentado</span></div>
  <div class="kv"><span class="k">A habilidade por trás do jogo</span><p>${g.explica}</p></div>
  ${reflectBox(g.pergunta, "Pergunta para reflexão")}
  <div class="note">${icon("info")}<span>Este jogo é uma experiência educativa. Ele não mede atenção, memória ou inteligência, e o desempenho em um jogo não diz quem você é.</span></div>
  <div class="row"><button class="btn btn-primary" data-act="gameOpen" data-id="${g.id}">${icon("refresh", 18)} Jogar de novo</button><button class="btn btn-ghost" data-act="scrollTo" data-target="games-top">Escolher outro desafio</button></div></div>`;
  $("#games-grid").innerHTML = gamesGrid();
  afterProgress("desafios");
}

/* ---------- 1. Holofote (atenção) ---------- */
const ATT_ROUNDS = [
  { cols: 5, target: ["star", "amarelo"], n: 5, pool: () => [pick(["note", "mic", "skate"]), pick(Object.keys(SYM_COLORS))] },
  { cols: 6, target: ["note", "agua"], n: 6, pool: () => (Math.random() < 0.5 ? ["note", pick(["roxo", "coral", "azul", "amarelo", "lilas"])] : [pick(["star", "mic", "skate"]), Math.random() < 0.5 ? "agua" : pick(Object.keys(SYM_COLORS))]) },
  { cols: 6, target: ["skate", "roxo"], n: 6, distract: true, pool: () => (Math.random() < 0.45 ? ["skate", pick(["lilas", "azul", "coral"])] : [pick(["star", "mic", "note"]), Math.random() < 0.6 ? "roxo" : pick(Object.keys(SYM_COLORS))]) },
];
function attStart() { G.att = { round: 0 }; attRound(); }
function attRound() {
  const R = ATT_ROUNDS[G.att.round]; const total = R.cols * R.cols;
  const pos = new Set(shuffle([...Array(total).keys()]).slice(0, R.n));
  const cells = [...Array(total)].map((_, i) => {
    if (pos.has(i)) return { s: R.target[0], c: R.target[1], t: true };
    let d; do { d = R.pool(); } while (d[0] === R.target[0] && d[1] === R.target[1]);
    return { s: d[0], c: d[1], t: false };
  });
  G.att.cells = cells; G.att.found = 0; G.att.n = R.n;
  const g = GAMES[0]; const tName = ["estrelas amarelas", "notas musicais verde-água", "patins roxos"][G.att.round];
  gameArea().innerHTML = `${gameHeader(g)}
  <div class="row" style="justify-content:space-between;margin-bottom:14px"><p class="game-instr">Rodada ${G.att.round + 1} de ${ATT_ROUNDS.length}: encontre todos os <span class="target-pill">${sym(R.target[0], R.target[1])} ${tName}</span></p><span class="gstatus" id="att-status" aria-live="polite">Encontrados: 0 de ${R.n}</span></div>
  ${R.distract ? `<p class="muted" style="font-size:.9rem;margin-bottom:10px">Atenção: nesta rodada, algumas coisas vão passar flutuando pela tela. Tente manter o foco no seu alvo.</p>` : ""}
  <div class="att-grid" id="att-grid" style="grid-template-columns:repeat(${R.cols},minmax(0,1fr))">${cells.map((c, i) => `<button class="att-cell" data-act="attCell" data-i="${i}" aria-label="${SHAPE_NOMES[c.s]} ${SYM_NOMES[c.c]}">${sym(c.s, c.c)}</button>`).join("")}${R.distract ? `<div class="distract-layer" id="distract"></div>` : ""}</div>
  <div id="att-next" style="margin-top:16px;text-align:center"></div>`;
  if (R.distract) attDistract();
}
function attDistract() {
  const layer = $("#distract"); if (!layer || !G.att) return;
  const sp = document.createElement("span"); const size = 26 + Math.random() * 26;
  sp.style.left = Math.random() * 85 + "%"; sp.style.top = 40 + Math.random() * 55 + "%"; sp.style.width = size + "px"; sp.style.height = size + "px";
  sp.innerHTML = sym(pick(["note", "star"]), pick(["amarelo", "coral", "agua"])); layer.appendChild(sp);
  setTimeout(() => sp.remove(), 5000); gLater(attDistract, 700);
}
A.attCell = (el) => {
  const c = G.att.cells[+el.dataset.i]; if (el.classList.contains("found")) return;
  if (c.t) {
    el.classList.add("found"); G.att.found++; tone(660 + G.att.found * 40, 0.15, "sine", 0.12);
    $("#att-status").textContent = `Encontrados: ${G.att.found} de ${G.att.n}`;
    if (G.att.found === G.att.n) {
      chime(); G.timers.forEach(clearTimeout); G.timers = [];
      const last = G.att.round === ATT_ROUNDS.length - 1;
      $("#att-next").innerHTML = `<div class="note agua" style="justify-content:center;margin-bottom:12px">${starFill(18)}<span>Você encontrou todos! ${last ? "Essa era a última rodada." : "A próxima rodada é um pouco mais desafiadora."}</span></div>${last ? `<button class="btn btn-primary" data-act="gameEnd">Ver o que esse jogo mostra ${icon("arrowR", 18)}</button>` : `<button class="btn btn-primary" data-act="attNext">Próxima rodada ${icon("arrowR", 18)}</button>`}`;
    }
  } else { el.classList.remove("nope"); void el.offsetWidth; el.classList.add("nope"); softNo(); }
};
A.attNext = () => { G.att.round++; attRound(); };

/* ---------- 2. Sequência musical (memória de trabalho) ---------- */
const PADS = [
  { s: "star", c: "amarelo", f: 523.25, bg: "#FBF0CF" },
  { s: "note", c: "agua", f: 392.0, bg: "#DDF4EF" },
  { s: "mic", c: "roxo", f: 329.63, bg: "#ECE4F8" },
  { s: "skate", c: "coral", f: 261.63, bg: "#FBE5E8" },
];
function memStart() {
  G.mem = { seq: [], pos: 0, phase: "idle" };
  gameArea().innerHTML = `${gameHeader(GAMES[1])}
  <p class="game-instr" style="text-align:center">Observe a sequência de luzes e sons. Depois, toque nos símbolos na mesma ordem. A cada acerto, a sequência ganha mais um elemento.</p>
  <div class="simon" id="simon">${PADS.map((p, i) => `<button class="pad" data-act="memPad" data-i="${i}" style="background:${p.bg};color:${SYM_COLORS[p.c]}" aria-label="${SHAPE_NOMES[p.s]}" disabled>${sym(p.s, p.c)}</button>`).join("")}</div>
  <p id="mem-status" class="gstatus" style="text-align:center;min-height:1.6em" aria-live="polite">Pronta? Aperte começar.</p>
  <div id="mem-ctrl" class="row" style="justify-content:center;margin-top:8px"><button class="btn btn-primary" data-act="memGo">${icon("play", 18)} Começar</button></div>
  <p class="muted" style="text-align:center;font-size:.88rem;margin-top:14px">Dica: experimente dar nomes, cantar a sequência ou imaginar uma coreografia.</p>`;
}
function memLight(i, dur = 420) {
  const b = $$("#simon .pad")[i]; if (!b) return;
  b.classList.add("lit"); tone(PADS[i].f, dur / 1000, "sine", 0.2); setTimeout(() => b.classList.remove("lit"), dur);
}
function memSetPads(on) { $$("#simon .pad").forEach((b) => (b.disabled = !on)); }
A.memGo = () => { G.mem.seq = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]; memPlay(); };
function memPlay() {
  G.mem.phase = "watch"; G.mem.pos = 0; memSetPads(false);
  $("#mem-ctrl").innerHTML = ""; $("#mem-status").textContent = `Observe... (sequência de ${G.mem.seq.length})`;
  G.mem.seq.forEach((v, k) => gLater(() => memLight(v), 700 + k * 720));
  gLater(() => { G.mem.phase = "play"; memSetPads(true); $("#mem-status").textContent = "Sua vez!"; }, 700 + G.mem.seq.length * 720);
}
A.memPad = (el) => {
  if (G.mem.phase !== "play") return; const i = +el.dataset.i; memLight(i, 260);
  if (i === G.mem.seq[G.mem.pos]) {
    G.mem.pos++;
    if (G.mem.pos === G.mem.seq.length) {
      G.mem.phase = "watch"; memSetPads(false);
      $("#mem-status").textContent = pick(["Isso! Lá vem uma sequência maior.", "Mandou bem! Mais um elemento.", "Boa! Prepare-se."]);
      G.mem.seq.push(Math.floor(Math.random() * 4)); gLater(memPlay, 1300);
    }
  } else {
    G.mem.phase = "idle"; memSetPads(false); softNo();
    $("#mem-status").innerHTML = `A sequência era: <span style="display:inline-flex;gap:4px;vertical-align:middle">${G.mem.seq.map((v) => `<span style="width:26px;height:26px;display:inline-block">${sym(PADS[v].s, PADS[v].c)}</span>`).join("")}</span>`;
    $("#mem-ctrl").innerHTML = `<button class="btn btn-primary" data-act="memRetry">${icon("refresh", 18)} Tentar de novo</button><button class="btn btn-ghost" data-act="gameEnd">Terminar</button>`;
  }
};
A.memRetry = () => memPlay();

/* ---------- 3. Hora do aplauso (controle inibitório) ---------- */
const INH_PHASES = [
  { regra: "Toque em <b>Aplaudir</b> (ou aperte a barra de espaço) quando aparecer o <b>microfone</b>. Quando aparecer a placa de <b>silêncio</b>, segure o aplauso.", n: 20,
    gen: () => (Math.random() < 0.7 ? { k: "mic", go: true } : { k: "shh", go: false }) },
  { regra: "Agora a regra ficou mais difícil: aplauda <b>só</b> quando o microfone aparecer <b>com o holofote aceso</b>. Microfone no escuro ou placa de silêncio: segure.", n: 20,
    gen: () => { const r = Math.random(); return r < 0.5 ? { k: "mic", spot: true, go: true } : r < 0.8 ? { k: "mic", spot: false, go: false } : { k: "shh", spot: Math.random() < 0.5, go: false }; } },
];
const SHH_SVG = `<svg viewBox="0 0 120 120" width="120" height="120" aria-label="Placa de silêncio" role="img"><rect x="10" y="22" width="100" height="62" rx="16" fill="#E9A4AD" stroke="#fff" stroke-width="4"/><text x="60" y="62" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="700" font-size="19" fill="#5E1F29">SILÊNCIO</text><rect x="54" y="84" width="12" height="30" rx="4" fill="#fff" opacity=".85"/></svg>`;
const MIC_BIG = () => sym("mic", "amarelo").replace("<svg", '<svg width="120" height="120"');
function inhStart() { G.inh = { phase: 0 }; inhIntro(); }
function inhIntro() {
  const P = INH_PHASES[G.inh.phase];
  gameArea().innerHTML = `${gameHeader(GAMES[2])}
  <div class="stack" style="align-items:center;text-align:center"><span class="tag coral">Parte ${G.inh.phase + 1} de ${INH_PHASES.length}</span><p class="game-instr prose">${P.regra}</p>
  <div class="row" style="justify-content:center;gap:24px"><div class="stack" style="align-items:center;gap:4px"><div style="width:80px;height:80px">${sym("mic", "amarelo")}</div><span class="tag agua">${G.inh.phase ? "com holofote: aplauda" : "aplauda"}</span></div><div class="stack" style="align-items:center;gap:4px"><div style="width:80px;height:80px;display:grid;place-items:center">${SHH_SVG.replace('width="120" height="120"', 'width="80" height="80"')}</div><span class="tag coral">segure</span></div></div>
  <button class="btn btn-primary" data-act="inhGo">${icon("play", 18)} Começar</button></div>`;
}
A.inhGo = () => {
  const P = INH_PHASES[G.inh.phase]; G.inh.trials = Array.from({ length: P.n }, P.gen); G.inh.t = -1; G.running = true;
  gameArea().innerHTML = `${gameHeader(GAMES[2])}
  <p class="game-instr" style="text-align:center">${P.regra}</p>
  <div class="stage-box" id="inh-stage"><div class="spot" id="inh-spot"></div><div id="inh-stim"></div><div class="stage-floor"></div><div class="flash" id="inh-flash" aria-live="polite"></div></div>
  <div style="text-align:center"><button class="btn btn-roxo clap-btn" data-act="inhClap">${icon("hand", 22)} Aplaudir</button></div>`;
  G.keyHandler = (e) => { if (e.code === "Space" && G.running) { e.preventDefault(); A.inhClap(); } };
  document.addEventListener("keydown", G.keyHandler);
  gLater(inhNext, 900);
};
function inhNext() {
  G.inh.t++; const stim = $("#inh-stim"); if (!stim) return;
  if (G.inh.t >= G.inh.trials.length) {
    G.running = false;
    if (G.inh.phase < INH_PHASES.length - 1) {
      gameArea().querySelector(".stage-box").insertAdjacentHTML("afterend", `<div class="stack" style="align-items:center;text-align:center"><div class="note agua">${starFill(18)}<span>Parte ${G.inh.phase + 1} concluída! Pronta para uma regra nova?</span></div><button class="btn btn-primary" data-act="inhPhase2">Próxima parte ${icon("arrowR", 18)}</button></div>`);
      gameArea().querySelector(".clap-btn").parentElement.remove();
    } else finishGame("inibicao");
    return;
  }
  const tr = G.inh.trials[G.inh.t]; tr.clapped = false;
  $("#inh-spot").classList.toggle("on", G.inh.phase === 0 ? tr.k === "mic" : !!tr.spot);
  stim.className = "stim"; stim.innerHTML = tr.k === "mic" ? MIC_BIG() : SHH_SVG; $("#inh-flash").textContent = "";
  gLater(() => { if (!$("#inh-stim")) return; stim.innerHTML = ""; $("#inh-spot").classList.remove("on"); gLater(inhNext, 550 + Math.random() * 300); }, 1050);
}
A.inhClap = () => {
  if (!G.running || !G.inh || G.inh.t < 0) return; const tr = G.inh.trials[G.inh.t]; if (!tr || tr.clapped || !$("#inh-stim").innerHTML) return;
  tr.clapped = true; const fl = $("#inh-flash");
  if (tr.go) { tone(880, 0.1, "triangle", 0.12); tone(1175, 0.12, "triangle", 0.1, 0.06); fl.textContent = pick(["Aplausos!", "Isso!", "No tempo certo!"]); }
  else { softNo(); fl.textContent = "Ops, era hora de segurar. Tudo bem, segue o show!"; }
};
A.inhPhase2 = () => { G.inh.phase = 1; inhIntro(); };

/* ---------- 4. Rumo ao show (planejamento) ---------- */
function planStart(scId) {
  const sc = PLAN_SCENARIOS.find((s) => s.id === scId) || PLAN_SCENARIOS[0];
  G.plan = { sc, bank: shuffle(sc.steps.map((s) => s.id)), plan: [], checked: false, bad: [] };
  planRender();
}
function planRender() {
  const { sc, bank, plan, bad } = G.plan; const step = (id) => sc.steps.find((s) => s.id === id);
  gameArea().innerHTML = `${gameHeader(GAMES[3])}
  <div class="row" style="margin-bottom:14px">${PLAN_SCENARIOS.map((s) => `<button class="chip ${s.id === sc.id ? "on" : ""}" data-act="planSc" data-id="${s.id}">${icon(s.icon, 15)} ${s.nome}</button>`).join("")}</div>
  <p class="game-instr">Objetivo: <b>${sc.nome}</b>. Toque nas etapas para montar o seu plano na ordem em que você faria. Use as setas para trocar de lugar.</p>
  <div class="plan-cols" style="margin-top:14px">
    <div><h4 style="margin-bottom:8px">Etapas disponíveis</h4><div class="plan-list" style="background:var(--surface);border-style:solid;border-color:var(--line)">${bank.length ? bank.map((id) => `<button class="plan-item bank" data-act="planAdd" data-id="${id}">${icon("plus", 16)}<span class="grow">${step(id).t}</span></button>`).join("") : `<p class="muted" style="text-align:center;padding:20px 0">Todas as etapas estão no plano.</p>`}</div></div>
    <div><h4 style="margin-bottom:8px">Meu plano</h4><div class="plan-list">${plan.length ? plan.map((id, i) => `<div class="plan-item ${bad.includes(id) ? "warn" : ""}"><span class="pn">${i + 1}</span><span class="grow">${step(id).t}</span><button class="mini" data-act="planMove" data-i="${i}" data-d="-1" aria-label="Subir">${icon("up", 16)}</button><button class="mini" data-act="planMove" data-i="${i}" data-d="1" aria-label="Descer">${icon("down", 16)}</button><button class="mini" data-act="planDel" data-i="${i}" aria-label="Remover">${icon("x", 16)}</button></div>`).join("") : `<p class="muted" style="text-align:center;padding:20px 0">Seu plano aparece aqui.</p>`}</div></div>
  </div>
  <div id="plan-fb" style="margin-top:16px" aria-live="polite">${G.plan.fb || ""}</div>
  <div class="row" style="margin-top:14px"><button class="btn btn-primary" data-act="planCheck" ${bank.length ? "disabled" : ""}>${icon("check", 18)} Conferir meu plano</button><button class="btn btn-ghost" data-act="planSc" data-id="${sc.id}">${icon("refresh", 18)} Recomeçar</button></div>`;
}
A.planSc = (el) => planStart(el.dataset.id);
A.planAdd = (el) => { const id = el.dataset.id; G.plan.bank = G.plan.bank.filter((x) => x !== id); G.plan.plan.push(id); G.plan.bad = []; G.plan.fb = ""; tone(587, 0.08, "sine", 0.08); planRender(); };
A.planDel = (el) => { const id = G.plan.plan.splice(+el.dataset.i, 1)[0]; G.plan.bank.push(id); G.plan.bad = []; G.plan.fb = ""; planRender(); };
A.planMove = (el) => { const i = +el.dataset.i, j = i + +el.dataset.d; const p = G.plan.plan; if (j < 0 || j >= p.length) return; [p[i], p[j]] = [p[j], p[i]]; G.plan.bad = []; G.plan.fb = ""; planRender(); };
A.planCheck = () => {
  const { sc, plan } = G.plan; const pos = Object.fromEntries(plan.map((id, i) => [id, i])); const issues = [];
  plan.forEach((id) => { const s = sc.steps.find((x) => x.id === id); s.dep.forEach((d) => { if (pos[d] > pos[id]) issues.push([id, d]); }); });
  G.plan.bad = [...new Set(issues.map((x) => x[0]))];
  if (!issues.length) {
    G.plan.fb = `<div class="note agua">${starFill(18)}<span><b>Seu plano funciona!</b> Cada etapa vem depois daquilo de que ela precisa. Repare que algumas etapas poderiam estar em outra ordem e o plano continuaria funcionando: quase sempre existe mais de um bom caminho.</span></div><div class="row" style="margin-top:12px"><button class="btn btn-roxo" data-act="gameEnd">Ver o que esse jogo mostra ${icon("arrowR", 18)}</button></div>`;
    chime(); planRender(); S.games.planejamento = true; save(); $("#games-grid").innerHTML = gamesGrid(); afterProgress("desafios");
  } else {
    const nm = (id) => sc.steps.find((x) => x.id === id).t;
    G.plan.fb = `<div class="note amarelo">${icon("bulb")}<span>Quase lá! Algumas etapas precisam de outras antes delas:<ul style="margin:6px 0 0;padding-left:18px">${issues.map(([a, b]) => `<li>“${nm(a)}” precisa vir depois de “${nm(b)}”.</li>`).join("")}</ul>Use as setas para reorganizar e confira de novo.</span></div>`;
    softNo(); planRender();
  }
};

/* ---------- 5. Troca de ritmo (flexibilidade cognitiva) ---------- */
const FLEX_TARGETS = [{ s: "star", c: "roxo", n: 1 }, { s: "note", c: "agua", n: 2 }, { s: "mic", c: "coral", n: 3 }];
const FLEX_PHASES = [
  { regra: "cor", n: 6, txt: "Separe cada carta pela <b>COR</b>: coloque na pilha que tem a mesma cor." },
  { regra: "forma", n: 6, txt: "A regra mudou! Agora separe pela <b>FORMA</b>: coloque na pilha que tem o mesmo símbolo." },
  { regra: "misto", n: 8, txt: "Regra final: olhe a <b>borda</b> da carta. Borda <b>dourada contínua</b> = separe pela COR. Borda <b>roxa tracejada</b> = separe pela FORMA." },
];
function flexCard() {
  let s, c; do { s = Math.floor(Math.random() * 3); c = Math.floor(Math.random() * 3); } while (s === c);
  return { s: FLEX_TARGETS[s].s, si: s, c: FLEX_TARGETS[c].c, ci: c, n: 1 + Math.floor(Math.random() * 3), rule: Math.random() < 0.5 ? "cor" : "forma" };
}
function fcardHTML(card, big = false, cls = "") { return `<div class="fcard ${big ? "big" : ""} ${cls}">${Array.from({ length: card.n }, () => sym(card.s, card.c)).join("")}</div>`; }
function flexStart() { G.flex = { phase: 0, k: 0 }; flexIntro(true); }
function flexIntro(first) {
  const P = FLEX_PHASES[G.flex.phase];
  gameArea().innerHTML = `${gameHeader(GAMES[4])}
  <div class="stack" style="align-items:center;text-align:center"><span class="rule-banner ${first ? "" : "changed"}">${icon("shuffle", 18)} ${first ? "Primeira regra" : "A regra mudou!"}</span><p class="game-instr prose">${P.txt}</p>
  ${P.regra === "misto" ? `<div class="row" style="justify-content:center;gap:20px"><div class="stack" style="align-items:center;gap:6px">${fcardHTML({ s: "note", c: "coral", n: 1 }, false, "rule-cor")}<span class="tag amarelo">pela COR</span></div><div class="stack" style="align-items:center;gap:6px">${fcardHTML({ s: "note", c: "coral", n: 1 }, false, "rule-forma")}<span class="tag">pela FORMA</span></div></div>` : ""}
  <button class="btn btn-primary" data-act="flexGo">${icon("play", 18)} ${first ? "Começar" : "Continuar"}</button></div>`;
}
A.flexGo = () => { G.flex.k = 0; flexDeal(); };
function flexDeal() {
  const P = FLEX_PHASES[G.flex.phase]; G.flex.card = flexCard(); const card = G.flex.card;
  const rule = P.regra === "misto" ? card.rule : P.regra;
  const ruleTxt = P.regra === "misto" ? "Olhe a borda da carta" : rule === "cor" ? "Regra: COR" : "Regra: FORMA";
  gameArea().innerHTML = `${gameHeader(GAMES[4])}
  <div class="row" style="justify-content:space-between;margin-bottom:10px"><span class="rule-banner">${icon("shuffle", 18)} ${ruleTxt}</span><span class="gstatus">Parte ${G.flex.phase + 1} de 3 · carta ${G.flex.k + 1} de ${P.n}</span></div>
  <div style="display:grid;place-items:center;margin:8px 0 6px">${fcardHTML(card, true, P.regra === "misto" ? (card.rule === "cor" ? "rule-cor" : "rule-forma") : "")}</div>
  <p class="muted" style="text-align:center;font-size:.9rem">Em qual pilha essa carta vai?</p>
  <div class="flex-table">${FLEX_TARGETS.map((t, i) => `<button class="bin" data-act="flexPick" data-i="${i}" aria-label="Pilha ${i + 1}: ${t.n} ${SHAPE_NOMES[t.s]} ${SYM_NOMES[t.c]}">${fcardHTML(t)}</button>`).join("")}</div>
  <p id="flex-fb" class="gstatus" style="text-align:center;margin-top:12px;min-height:1.6em" aria-live="polite"></p>`;
}
A.flexPick = (el) => {
  if (G.flex.lock) return; const P = FLEX_PHASES[G.flex.phase]; const card = G.flex.card;
  const rule = P.regra === "misto" ? card.rule : P.regra; const right = rule === "cor" ? card.ci : card.si; const i = +el.dataset.i;
  G.flex.lock = true;
  if (i === right) { el.classList.add("good"); tone(698, 0.14, "sine", 0.12); $("#flex-fb").textContent = pick(["Isso!", "Boa!", "Certinho!"]); }
  else { el.classList.add("bad"); $$(".bin")[right].classList.add("good"); softNo(); $("#flex-fb").textContent = `Pela regra de agora (${rule === "cor" ? "cor" : "forma"}), ela vai na pilha destacada.`; }
  gLater(() => {
    G.flex.lock = false; G.flex.k++;
    if (G.flex.k >= P.n) { if (G.flex.phase < FLEX_PHASES.length - 1) { G.flex.phase++; flexIntro(false); } else finishGame("flexibilidade"); }
    else flexDeal();
  }, i === right ? 650 : 1500);
};

VIEWS.desafios = {
  render() {
    return `${secHead("desafios", "Desafio cerebral", "Cinco jogos para experimentar, na prática, algumas habilidades do cérebro. Escolha um desafio, jogue no seu ritmo e, no final, descubra qual habilidade estava em ação.")}
    <div class="stack" id="games-top" style="scroll-margin-top:80px">
      <div class="note">${icon("info")}<span>Estes jogos são experiências educativas. Eles <b>não medem</b> atenção, memória, inteligência ou funções executivas, e não existe ranking ou comparação. Experimente pelo menos <b>três</b> para ganhar a conquista.</span></div>
      <div class="games-grid" id="games-grid">${gamesGrid()}</div>
      <section class="game-area" id="game-area" ${S.curGame ? "" : "hidden"} style="scroll-margin-top:80px"></section>
    </div>
    ${stageFoot("desafios")}`;
  },
  mount() { if (S.curGame) startGame(S.curGame); },
};
