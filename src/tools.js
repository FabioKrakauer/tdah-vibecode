/* =========================================================
   ABA 5 — MINHA CAIXA DE FERRAMENTAS
   ========================================================= */
function sitRow() { return `<button class="chip ${S.toolSit === "all" ? "on" : ""}" data-act="toolSit" data-id="all">Todas as ferramentas</button>${SITUACOES.map((s) => `<button class="chip ${S.toolSit === s.id ? "on" : ""}" data-act="toolSit" data-id="${s.id}" aria-pressed="${S.toolSit === s.id}">Quando ${s.nome.charAt(0).toLowerCase() + s.nome.slice(1)}</button>`).join("")}`; }
function toolGrid() {
  const list = S.toolSit === "all" ? TOOLS : TOOLS.filter((t) => t.sit.includes(S.toolSit));
  return list.map((t) => `<button class="tool-card" data-act="toolOpen" data-id="${t.id}"><span class="seen">${S.toolsSeen[t.id] ? starFill(16) : ""}</span><span class="icon-blob b-${t.cor}">${icon(t.icon, 24)}</span><h3>${t.nome}</h3><p>${t.situacao}</p><div class="row" style="gap:6px">${t.sit.slice(0, 3).map((s) => `<span class="tag">${SITUACOES.find((x) => x.id === s).nome}</span>`).join("")}</div></button>`).join("");
}
A.toolSit = (el) => { S.toolSit = el.dataset.id; save(); $("#sit-row").innerHTML = sitRow(); $("#tool-grid").innerHTML = toolGrid(); };
const RES_LINK = { etapas: "steps", pomodoro: "timer", timer: "timer", listas: "todo", semanal: "board" };
A.toolOpen = (el) => {
  const t = TOOLS.find((x) => x.id === el.dataset.id); S.toolsSeen[t.id] = true; save();
  const res = RES_LINK[t.id];
  openModal(`<div class="modal-head"><span class="icon-blob b-${t.cor}">${icon(t.icon, 26)}</span><div><span class="eyebrow">Ferramenta</span><h2>${t.nome}</h2></div></div>
  <div class="modal-body">
    <div class="kv"><span class="k">1. Para qual situação</span><p>${t.situacao}</p></div>
    <div class="kv"><span class="k">2. Como funciona</span><p>${t.como}</p></div>
    <div class="kv"><span class="k">3. Como usar</span><ol class="tool-steps">${t.usar.map((u) => `<li>${u}</li>`).join("")}</ol></div>
    <div class="kv"><span class="k">4. Exemplo</span><p>${t.exemplo}</p></div>
    <div class="reflect"><span style="color:var(--amarelo-800)">${icon("star", 22)}</span><div><div class="rl">5. Desafio para experimentar</div><div class="rq">${t.desafio}</div></div></div>
    <div class="note">${icon("info")}<span>Nenhuma estratégia funciona igual para todo mundo. Experimente, observe e ajuste do seu jeito.</span></div>
    ${res ? `<div class="row"><button class="btn btn-primary" data-act="goRes" data-tab="${res}">Experimentar agora ${icon("arrowR", 18)}</button></div>` : ""}
  </div>`, { label: t.nome });
  $("#tool-grid").innerHTML = toolGrid(); afterProgress("ferramentas");
};
A.goRes = (el) => { closeModal(); S.resTab = el.dataset.tab; save(); renderRes(); $("#recursos").scrollIntoView({ behavior: "smooth", block: "start" }); };

/* ---------- Recursos interativos ---------- */
const RES_TABS = [
  { id: "todo", nome: "Lista de tarefas", icon: "list" },
  { id: "timer", nome: "Temporizador", icon: "timer" },
  { id: "steps", nome: "Planejador de pequenas etapas", icon: "stairs" },
  { id: "board", nome: "Organizador visual", icon: "calendar" },
];
function renderRes() {
  $("#res-tabs").innerHTML = RES_TABS.map((t) => `<button class="chip ${S.resTab === t.id ? "on" : ""}" data-act="resTab" data-id="${t.id}" aria-pressed="${S.resTab === t.id}">${icon(t.icon, 16)} ${t.nome}</button>`).join("");
  $("#res-box").innerHTML = ({ todo: todoHTML, timer: timerHTML, steps: stepsHTML, board: boardHTML })[S.resTab]();
  if (S.resTab === "timer") timerPaint();
  if (S.resTab === "board") boardDnD();
}
A.resTab = (el) => { S.resTab = el.dataset.id; save(); renderRes(); };
function addOnEnter(inputId, act) { const i = $("#" + inputId); i && i.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); A[act](); } }); }

/* Lista de tarefas */
function todoHTML() {
  return `<div class="row" style="justify-content:space-between;margin-bottom:12px"><div><h3>Lista de tarefas</h3><p class="muted" style="font-size:.9rem">Tire as tarefas da cabeça e coloque aqui. Marque quando terminar.</p></div>${S.todo.some((t) => t.done) ? `<button class="btn btn-ghost btn-sm" data-act="todoClear">${icon("trash", 16)} Limpar concluídas</button>` : ""}</div>
  <form class="add-row" onsubmit="event.preventDefault();A.todoAdd()"><label class="sr-only" for="todo-in">Nova tarefa</label><input id="todo-in" placeholder="Ex.: separar o material de inglês" maxlength="120" autocomplete="off"><button class="btn btn-primary" type="submit">${icon("plus", 18)} Adicionar</button></form>
  <div class="todo-list">${S.todo.length ? S.todo.map((t) => `<div class="todo ${t.done ? "done" : ""}"><label><input type="checkbox" data-act="todoToggle" data-id="${t.id}" ${t.done ? "checked" : ""}><span>${esc(t.t)}</span></label><button class="btn btn-soft btn-icon btn-sm" data-act="todoDel" data-id="${t.id}" aria-label="Remover tarefa">${icon("x", 16)}</button></div>`).join("") : `<div class="empty">Nenhuma tarefa ainda. Que tal começar com uma coisa pequena para hoje?</div>`}</div>
  ${S.todo.length ? `<p class="muted" style="margin-top:10px;font-size:.88rem">${S.todo.filter((t) => t.done).length} de ${S.todo.length} concluídas</p>` : ""}`;
}
A.todoAdd = () => { const i = $("#todo-in"); const v = i.value.trim(); if (!v) return; S.todo.push({ id: uid(), t: v, done: false }); save(); renderRes(); $("#todo-in").focus(); };
A.todoToggle = (el) => { const t = S.todo.find((x) => x.id === el.dataset.id); t.done = el.checked; save(); if (t.done) tone(784, 0.15, "sine", 0.1); renderRes(); };
A.todoDel = (el) => { S.todo = S.todo.filter((x) => x.id !== el.dataset.id); save(); renderRes(); };
A.todoClear = () => { S.todo = S.todo.filter((x) => !x.done); save(); renderRes(); };

/* Temporizador */
const TM = { total: 15 * 60, left: 15 * 60, running: false, iv: null, label: "Foco", ended: false };
function fmt(s) { const m = Math.floor(s / 60), r = s % 60; return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`; }
function timerHTML() {
  const presets = [[5, "5 min"], [10, "10 min"], [15, "15 min"], [25, "25 min"]];
  return `<div class="timer-wrap"><div class="vinyl ${TM.running ? "spin" : ""}" id="vinyl">
    <svg viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="114" fill="none" stroke="#F0EAFA" stroke-width="10"/><circle id="tm-ring" cx="120" cy="120" r="114" fill="none" stroke="#91D8C9" stroke-width="10" stroke-linecap="round" transform="rotate(-90 120 120)" stroke-dasharray="716.3" stroke-dashoffset="0"/>
    <g class="disc"><circle cx="120" cy="120" r="100" fill="#3B2860"/><circle cx="120" cy="120" r="88" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/><circle cx="120" cy="120" r="76" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/><circle cx="120" cy="120" r="64" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/><path d="M60 80a72 72 0 0 1 40-26" stroke="#fff" stroke-opacity=".25" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="120" cy="120" r="40" fill="#C6B2E8"/><polygon points="${starPts(120, 96, 9, 4)}" fill="#F2D47E"/><circle cx="120" cy="120" r="4" fill="#3B2860"/></g></svg>
    <div class="time"><span id="tm-time">${fmt(TM.left)}</span></div></div>
    <div class="stack"><div><h3>Temporizador</h3><p class="muted" style="font-size:.92rem">Escolha um tempo que pareça possível. O disco gira enquanto o tempo corre e o anel mostra quanto falta.</p></div>
      <div class="row" style="gap:8px">${presets.map(([m, l]) => `<button class="chip ${TM.total === m * 60 ? "on" : ""}" data-act="tmSet" data-m="${m}">${l}</button>`).join("")}<button class="chip agua ${TM.total === 300 && TM.label === "Pausa" ? "on" : ""}" data-act="tmPause">Pausa de 5 min</button></div>
      <div class="row" style="gap:8px"><button class="btn btn-soft btn-sm" data-act="tmAdj" data-d="-1" ${TM.running ? "disabled" : ""}>− 1 min</button><button class="btn btn-soft btn-sm" data-act="tmAdj" data-d="1" ${TM.running ? "disabled" : ""}>+ 1 min</button><span class="tag ${TM.label === "Pausa" ? "agua" : ""}">${TM.label === "Pausa" ? "Modo pausa" : "Modo foco"}</span></div>
      <div class="row"><button class="btn ${TM.running ? "btn-ghost" : "btn-primary"}" data-act="tmToggle">${TM.running ? icon("pause", 18) + " Pausar" : icon("play", 18) + (TM.left < TM.total && TM.left > 0 ? " Continuar" : " Iniciar")}</button><button class="btn btn-ghost" data-act="tmReset">${icon("refresh", 18)} Zerar</button></div>
      <div id="tm-msg" aria-live="polite">${TM.ended ? `<div class="note agua">${starFill(18)}<span>${TM.label === "Pausa" ? "Fim da pausa! Hora de voltar com calma." : "Tempo concluído! Que tal uma pausa curta antes do próximo ciclo?"}</span></div>` : ""}</div>
    </div></div>`;
}
function timerPaint() {
  const t = $("#tm-time"); if (t) t.textContent = fmt(TM.left);
  const r = $("#tm-ring"); if (r) r.setAttribute("stroke-dashoffset", (716.3 * (1 - TM.left / TM.total)).toFixed(1));
}
function stopTimer(reset) { clearInterval(TM.iv); TM.iv = null; TM.running = false; if (reset) { TM.left = TM.total; TM.ended = false; } }
A.tmSet = (el) => { stopTimer(); TM.total = TM.left = +el.dataset.m * 60; TM.label = "Foco"; TM.ended = false; renderRes(); };
A.tmPause = () => { stopTimer(); TM.total = TM.left = 300; TM.label = "Pausa"; TM.ended = false; renderRes(); };
A.tmAdj = (el) => { const m = Math.max(1, Math.min(90, Math.round(TM.total / 60) + +el.dataset.d)); TM.total = TM.left = m * 60; TM.ended = false; renderRes(); };
A.tmReset = () => { stopTimer(true); renderRes(); };
A.tmToggle = () => {
  if (TM.running) { stopTimer(); renderRes(); return; }
  if (TM.left <= 0) TM.left = TM.total; TM.ended = false; TM.running = true;
  tone(523, 0.1, "sine", 0.08);
  TM.iv = setInterval(() => {
    TM.left--; timerPaint();
    if (TM.left <= 0) { stopTimer(); TM.left = 0; TM.ended = true; chime(); setTimeout(chime, 900); if ($("#vinyl")) renderRes(); else toast(TM.label === "Pausa" ? "Fim da pausa!" : "Tempo do temporizador concluído!"); }
  }, 1000);
  renderRes();
};

/* Planejador de pequenas etapas */
function stepsHTML() {
  const P = S.plan; const done = P.steps.filter((s) => s.done).length;
  return `<div class="steps-plan stack"><div><h3>Planejador de pequenas etapas</h3><p class="muted" style="font-size:.92rem">Escreva uma tarefa grande e quebre em passos pequenos e concretos. Cada passo concluído acende uma estrela.</p></div>
    <div><label for="goal-in" class="eyebrow" style="display:block;margin-bottom:6px">Minha tarefa grande</label><input id="goal-in" class="field" style="width:100%" placeholder="Ex.: apresentação de Ciências na sexta" value="${esc(P.goal)}" maxlength="120" data-input="goal"></div>
    <form class="add-row" onsubmit="event.preventDefault();A.stepAdd()"><label class="sr-only" for="step-in">Novo passo</label><input id="step-in" placeholder="Próximo passo pequeno (ex.: escolher o tema)" maxlength="120" autocomplete="off"><button class="btn btn-primary" type="submit">${icon("plus", 18)} Passo</button></form>
    ${P.steps.length ? `<div class="star-meter" aria-label="${done} de ${P.steps.length} passos concluídos">${P.steps.map((s) => `<span class="${s.done ? "on" : ""}">${starFill(24)}</span>`).join("")}</div>` : ""}
    <div class="stack" style="gap:8px">${P.steps.length ? P.steps.map((s, i) => `<div class="plan-item" style="${s.done ? "background:var(--agua-100)" : ""}"><span class="pn" style="${s.done ? "background:var(--agua-600)" : ""}">${i + 1}</span><label class="grow" style="display:flex;gap:10px;align-items:center;cursor:pointer"><input type="checkbox" data-act="stepToggle" data-id="${s.id}" ${s.done ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--agua-600)"><span style="${s.done ? "text-decoration:line-through;color:var(--muted)" : ""};overflow-wrap:anywhere">${esc(s.t)}</span></label><button class="mini" data-act="stepMove" data-i="${i}" data-d="-1" aria-label="Subir">${icon("up", 16)}</button><button class="mini" data-act="stepMove" data-i="${i}" data-d="1" aria-label="Descer">${icon("down", 16)}</button><button class="mini" data-act="stepDel" data-id="${s.id}" aria-label="Remover">${icon("x", 16)}</button></div>`).join("") : `<div class="empty">Dica: o primeiro passo deve ser tão pequeno que dê para fazer em poucos minutos.</div>`}</div>
    ${P.steps.length && done === P.steps.length ? `<div class="note agua">${starFill(18)}<span>Todos os passos concluídos! Repare como uma tarefa grande virou uma sequência de coisas possíveis.</span></div>` : ""}
    ${P.steps.length || P.goal ? `<div><button class="btn btn-ghost btn-sm" data-act="stepClear">${icon("trash", 16)} Começar um plano novo</button></div>` : ""}</div>`;
}
A.stepAdd = () => { const i = $("#step-in"); const v = i.value.trim(); if (!v) return; S.plan.steps.push({ id: uid(), t: v, done: false }); save(); renderRes(); $("#step-in").focus(); };
A.stepToggle = (el) => { const s = S.plan.steps.find((x) => x.id === el.dataset.id); s.done = el.checked; save(); if (s.done) tone(784, 0.15, "sine", 0.1); renderRes(); };
A.stepDel = (el) => { S.plan.steps = S.plan.steps.filter((x) => x.id !== el.dataset.id); save(); renderRes(); };
A.stepMove = (el) => { const i = +el.dataset.i, j = i + +el.dataset.d, a = S.plan.steps; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; save(); renderRes(); };
A.stepClear = () => { S.plan = { goal: "", steps: [] }; save(); renderRes(); };

/* Organizador visual (quadro) */
const COLS = ["Para fazer", "Fazendo", "Feito!"];
const BCOLORS = ["lilas", "agua", "coral", "amarelo", "azul"];
let boardColor = "lilas";
function boardHTML() {
  return `<div class="stack"><div><h3>Organizador visual</h3><p class="muted" style="font-size:.92rem">Coloque tarefas no quadro e mova conforme avança. Use cores para separar por assunto (por exemplo: escola, casa, patins, música).</p></div>
  <form class="add-row" onsubmit="event.preventDefault();A.boardAdd()" style="flex-wrap:wrap"><label class="sr-only" for="board-in">Nova tarefa no quadro</label><input id="board-in" placeholder="Ex.: estudar para a prova de História" maxlength="100" autocomplete="off"><div class="swatches" role="group" aria-label="Cor da tarefa">${BCOLORS.map((c) => `<button type="button" class="${boardColor === c ? "on" : ""}" data-act="boardColor" data-c="${c}" style="background:var(--${c === "lilas" ? "lilas" : c})" aria-label="Cor ${SYM_NOMES[c]}" aria-pressed="${boardColor === c}"></button>`).join("")}</div><button class="btn btn-primary" type="submit">${icon("plus", 18)} Adicionar</button></form>
  <div class="kanban">${COLS.map((name, ci) => { const items = S.board.filter((b) => b.col === ci); return `<div class="kcol c${ci}" data-col="${ci}"><h4>${name}<span class="tag">${items.length}</span></h4>${items.length ? items.map((b) => `<div class="kitem" draggable="true" data-id="${b.id}" style="border-left:6px solid var(--${b.cor === "lilas" ? "lilas" : b.cor})"><span>${esc(b.t)}</span><div class="kact">${ci > 0 ? `<button class="mini btn-soft btn-icon btn-sm btn" style="width:30px;height:30px" data-act="boardMove" data-id="${b.id}" data-d="-1" aria-label="Mover para ${COLS[ci - 1]}">${icon("left", 16)}</button>` : ""}${ci < 2 ? `<button class="btn btn-soft btn-icon btn-sm" style="width:30px;height:30px" data-act="boardMove" data-id="${b.id}" data-d="1" aria-label="Mover para ${COLS[ci + 1]}">${icon("right", 16)}</button>` : ""}<button class="btn btn-soft btn-icon btn-sm" style="width:30px;height:30px" data-act="boardDel" data-id="${b.id}" aria-label="Remover">${icon("x", 16)}</button></div></div>`).join("") : `<p class="muted" style="font-size:.85rem;text-align:center;padding:14px 0">${ci === 0 ? "Adicione uma tarefa" : "Arraste ou use as setas"}</p>`}</div>`; }).join("")}</div></div>`;
}
A.boardColor = (el) => { boardColor = el.dataset.c; const v = $("#board-in").value; renderRes(); $("#board-in").value = v; };
A.boardAdd = () => { const i = $("#board-in"); const v = i.value.trim(); if (!v) return; S.board.push({ id: uid(), t: v, col: 0, cor: boardColor }); save(); renderRes(); $("#board-in").focus(); };
A.boardMove = (el) => { const b = S.board.find((x) => x.id === el.dataset.id); b.col = Math.max(0, Math.min(2, b.col + +el.dataset.d)); save(); if (b.col === 2) tone(784, 0.15, "sine", 0.1); renderRes(); };
A.boardDel = (el) => { S.board = S.board.filter((x) => x.id !== el.dataset.id); save(); renderRes(); };
function boardDnD() {
  $$(".kitem").forEach((it) => { it.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", it.dataset.id); it.classList.add("dragging"); }); it.addEventListener("dragend", () => it.classList.remove("dragging")); });
  $$(".kcol").forEach((col) => {
    col.addEventListener("dragover", (e) => { e.preventDefault(); col.classList.add("over"); });
    col.addEventListener("dragleave", () => col.classList.remove("over"));
    col.addEventListener("drop", (e) => { e.preventDefault(); const b = S.board.find((x) => x.id === e.dataTransfer.getData("text/plain")); if (b) { b.col = +col.dataset.col; save(); if (b.col === 2) tone(784, 0.15, "sine", 0.1); renderRes(); } });
  });
}

VIEWS.ferramentas = {
  render() {
    return `${secHead("ferramentas", "Minha caixa de ferramentas", "Estratégias práticas para os desafios do dia a dia. Escolha uma situação, abra as ferramentas e experimente as que combinam com você. Logo abaixo, há recursos para usar de verdade.")}
    <div class="stack-lg">
      <section><h3 style="margin-bottom:12px">Que situação você quer resolver?</h3><div class="sit-row" id="sit-row">${sitRow()}</div><div class="tool-grid" id="tool-grid">${toolGrid()}</div>
      <p class="muted" style="margin-top:14px;font-size:.9rem">Abra pelo menos três ferramentas para ganhar a conquista. As que você já abriu ganham uma estrela.</p></section>
      <section id="recursos" style="scroll-margin-top:80px">${sectionTitle("Recursos para usar agora", "toolbox")}
        <div class="res-tabs" id="res-tabs"></div><div class="res-box" id="res-box"></div>
        <p class="muted" style="margin-top:10px;font-size:.85rem">${icon("lock", 14)} O que você escreve aqui fica apenas neste navegador, durante esta sessão.</p>
      </section>
    </div>
    ${stageFoot("ferramentas")}`;
  },
  mount() { renderRes(); },
};
document.addEventListener("input", (e) => {
  const k = e.target.dataset && e.target.dataset.input;
  if (k === "goal") { S.plan.goal = e.target.value; save(); }
  if (k === "manual") { S.manual[e.target.dataset.id] = e.target.value; save(); }
});

/* =========================================================
   ABA 6 — MEU MANUAL DE FUNCIONAMENTO
   ========================================================= */
const PERSONA_COLORS = { roxo: ["#7656A8", "#A88BD6"], agua: ["#3E9F8B", "#91D8C9"], coral: ["#C86A78", "#E9A4AD"], azul: ["#5487BC", "#A9C9E9"] };
function personaArea() {
  return `<div class="grid g2"><div class="stack" style="gap:8px"><span class="eyebrow">Escolha o símbolo do seu manual</span><div class="persona">${["mic", "skate", "star", "note"].map((s) => `<button class="${S.persona.icon === s ? "on" : ""}" data-act="persona" data-k="icon" data-v="${s}" aria-label="${SHAPE_NOMES[s]}" aria-pressed="${S.persona.icon === s}">${sym(s, "roxo").replace("<svg", '<svg width="38" height="38"')}</button>`).join("")}</div></div>
  <div class="stack" style="gap:8px"><span class="eyebrow">Escolha a cor</span><div class="swatches">${Object.entries(PERSONA_COLORS).map(([k, v]) => `<button class="${S.persona.cor === k ? "on" : ""}" data-act="persona" data-k="cor" data-v="${k}" style="background:linear-gradient(135deg,${v[1]},${v[0]})" aria-label="Cor ${SYM_NOMES[k]}" aria-pressed="${S.persona.cor === k}"></button>`).join("")}</div></div></div>`;
}
A.persona = (el) => { S.persona[el.dataset.k] = el.dataset.v; save(); $("#persona").innerHTML = personaArea(); };
A.manSug = (el) => {
  const id = el.dataset.id; const ta = $("#ta-" + id); const cur = ta.value.trim();
  ta.value = cur ? cur.replace(/[.,;]?$/, "") + ", " + el.dataset.v.charAt(0).toLowerCase() + el.dataset.v.slice(1) : el.dataset.v;
  S.manual[id] = ta.value; save(); ta.focus();
};
A.manualView = () => {
  const any = MANUAL_QS.some((q) => (S.manual[q.id] || "").trim());
  if (!any) { toast("Escreva pelo menos uma resposta para montar o seu manual."); return; }
  S.manualDone = true; save(); location.hash = "#resumo"; setTimeout(() => checkStages(), 400);
};
A.manualAskClear = () => openModal(`<div class="modal-head"><div class="icon-blob b-coral">${icon("trash", 24)}</div><div><h2>Apagar as respostas do manual?</h2><p class="muted" style="margin-top:6px">Os textos escritos nas nove perguntas serão apagados. As conquistas continuam.</p></div></div><div class="modal-body"><div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-roxo" data-act="manualClear">Apagar respostas</button></div></div>`);
A.manualClear = () => { S.manual = {}; save(); closeModal(); route(); toast("Respostas do manual apagadas."); };

VIEWS.manual = {
  render() {
    return `${secHead("manual", "Meu manual de funcionamento", "Todo equipamento importante vem com um manual. Este é o seu: um lugar para reunir o que você descobriu, o que faz bem e o que ajuda você. Escreva do seu jeito, com as suas palavras.")}
    <div class="stack-lg">
      <div class="card" id="persona">${personaArea()}</div>
      <div class="man-grid">${MANUAL_QS.map((q, i) => `<div class="card man-q"><label for="ta-${q.id}"><span class="qn">${i + 1}</span>${q.q}</label><textarea id="ta-${q.id}" data-input="manual" data-id="${q.id}" placeholder="Escreva aqui..." maxlength="1200">${esc(S.manual[q.id] || "")}</textarea>${q.sugs.length ? `<div class="sugs"><span class="muted" style="font-size:.78rem;align-self:center">Ideias (opcional):</span>${q.sugs.map((s) => `<button type="button" data-act="manSug" data-id="${q.id}" data-v="${esc(s)}">+ ${s}</button>`).join("")}</div>` : ""}</div>`).join("")}</div>
      <div class="row" style="justify-content:space-between"><button class="btn btn-ghost" data-act="manualAskClear">${icon("trash", 18)} Apagar respostas</button><button class="btn btn-roxo" data-act="manualView" style="font-size:1.05rem;padding:15px 26px">${icon("book", 20)} Ver meu manual pronto</button></div>
      <div class="note">${icon("lock")}<span>Suas respostas ficam apenas neste navegador, durante esta sessão. Ninguém além de quem está aqui consegue ver.</span></div>
    </div>
    ${stageFoot("manual")}`;
  },
};

VIEWS.resumo = {
  render() {
    const [c1, c2] = PERSONA_COLORS[S.persona.cor] || PERSONA_COLORS.roxo;
    const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const earned = STAGES.filter((s) => S.done[s.id]);
    const full = ["m1", "m8"];
    return `<div class="row no-print" style="justify-content:space-between;margin-bottom:18px"><a class="btn btn-ghost" href="#manual">${icon("edit", 18)} Editar respostas</a><div class="row">${printButtons("Imprimir")}</div></div>
    <article class="doc" id="doc">
      <header class="doc-head" style="background:linear-gradient(130deg,${c1},${c2})">
        <svg class="deco" width="220" height="180" viewBox="0 0 220 180" aria-hidden="true"><polygon points="${starPts(170, 50, 26, 11)}" fill="#F2D47E"/><polygon points="${starPts(120, 120, 12, 5)}" fill="#fff" opacity=".7"/><polygon points="${starPts(200, 140, 9, 4)}" fill="#fff" opacity=".6"/><g transform="translate(60 18) scale(2)" opacity=".35">${sym(S.persona.icon, "lilas").replace(/<\/?svg[^>]*>/g, "").replace(/#3B2860/g, "#fff")}</g></svg>
        <div style="position:relative;max-width:520px"><span class="hand">Meu manual de funcionamento</span><h1 style="margin-top:6px">Meu cérebro, minhas descobertas.</h1><p style="margin-top:10px;opacity:.9">${esc(S.title)} · ${hoje}</p></div>
      </header>
      <div class="doc-body">
        ${MANUAL_QS.map((q) => { const v = (S.manual[q.id] || "").trim(); return `<div class="doc-item ${full.includes(q.id) ? "full" : ""}"><h4><span style="color:var(--roxo)">${icon(q.icon, 18)}</span>${q.q}</h4>${v ? `<p>${esc(v)}</p>` : `<p class="blank">Ainda não respondido.</p>`}</div>`; }).join("")}
        ${earned.length ? `<div class="doc-item full" style="background:#fff"><h4><span style="color:var(--amarelo-800)">${starFill(18)}</span>Conquistas da jornada</h4><div class="row" style="gap:8px">${earned.map((s) => `<span class="tag amarelo">${starFill(12)} ${s.badge}</span>`).join("")}</div></div>` : ""}
      </div>
      <footer class="doc-foot"><span>Este manual reúne as palavras de quem o escreveu. Ele não é um laudo, uma avaliação ou um diagnóstico.</span><span>Seu mundo, seu ritmo, sua mente.</span></footer>
    </article>
    <div class="row no-print" style="justify-content:center;margin-top:22px">${allDone() ? `<a class="btn btn-primary" href="#final">${starFill(16)} Ver encerramento</a>` : `<a class="btn btn-primary" href="#inicio">Ver meu percurso ${icon("arrowR", 18)}</a>`}</div>`;
  },
};

/* =========================================================
   ABA 7 — GUIA PARA A FAMÍLIA
   ========================================================= */
function familiaBody(standalone) {
  return `<div class="fam-layout"><nav class="toc no-print" aria-label="Sumário">${FAMILIA.secoes.map((s) => `<button type="button" data-act="scrollTo" data-target="${s.id}">${s.titulo}</button>`).join("")}<button type="button" data-act="scrollTo" data-target="f-praticas">Orientações práticas</button><button type="button" data-act="scrollTo" data-target="f-com">Comunicação no dia a dia</button></nav>
  <div class="stack-lg">
    <div class="note lav">${icon("heart")}<span>${FAMILIA.intro}</span></div>
    ${FAMILIA.secoes.map((s) => `<section class="fam-sec prose" id="${s.id}" style="max-width:none"><h2>${s.titulo}</h2><div class="stack" style="max-width:72ch">${s.html}</div></section>`).join("")}
    <section class="fam-sec" id="f-praticas"><h2>Orientações práticas</h2><p class="muted" style="margin-bottom:16px">Sugestões para adaptar à realidade da família. Comece por uma ou duas mudanças pequenas.</p>
      <div class="grid g3">${FAMILIA.praticas.map((p) => `<div class="card flat stack" style="gap:10px"><div class="row" style="gap:10px"><span class="icon-blob b-lilas" style="width:42px;height:42px">${icon(p.icon, 20)}</span><h3 style="font-size:1.05rem">${p.titulo}</h3></div><ul class="ticks" style="font-size:.94rem">${p.itens.map((i) => `<li>${i}</li>`).join("")}</ul></div>`).join("")}</div></section>
    <section class="fam-sec" id="f-com"><h2>Comunicação no dia a dia</h2><p class="muted" style="margin-bottom:16px">Frases ditas no calor do momento podem soar como críticas à pessoa. Pequenas mudanças ajudam a manter a conversa no comportamento e na solução.</p>
      <div class="row" style="margin-bottom:10px;gap:20px"><span class="tag coral">Em vez de...</span><span class="tag agua">Experimente...</span></div>
      <div class="stack" style="gap:10px">${FAMILIA.comunicacao.map(([a, b]) => `<div class="swap"><div class="from">“${a}”</div><div class="arrow">${icon("arrowR", 22)}</div><div class="to">“${b}”</div></div>`).join("")}</div></section>
    <div class="note">${icon("info")}<span>${FAMILIA.fecho}</span></div>
    <p class="muted" style="font-size:.85rem">Material de psicoeducação baseado em evidências científicas (DSM-5-TR, CID-11, diretrizes clínicas e literatura sobre TDAH e funções executivas). ${standalone ? "" : `Veja as <a href="#referencias">referências</a>.`}</p>
  </div></div>`;
}
VIEWS.familia = {
  render() {
    return `<header class="sec-head"><div><span class="eyebrow">${icon("users", 16)} Área para a família</span><h1 style="margin-top:8px">Guia para a família</h1><p class="lead">Informações e orientações para apoiar uma adolescente com TDAH no dia a dia, com compreensão, limites claros e incentivo à autonomia.</p></div></header>
    <div class="share-banner no-print"><span style="display:flex;gap:10px;align-items:center">${icon("share")}<span><b>Versão para compartilhar:</b> abre apenas este guia, sem o menu e sem nenhuma resposta da adolescente.</span></span><a class="btn btn-primary btn-sm" href="#familia-compartilhar">Abrir versão para a família</a></div>
    ${familiaBody(false)}`;
  },
};
VIEWS["familia-compartilhar"] = {
  render() {
    return `<div class="share-banner no-print"><span style="display:flex;gap:10px;align-items:center">${icon("users")}<span>Guia para a família · versão para leitura e impressão</span></span><div class="row">${printButtons("Imprimir guia")}<a class="btn btn-ghost btn-sm" href="#familia">${icon("arrowL", 16)} Voltar</a></div></div>
    <header style="margin-bottom:28px;display:flex;gap:16px;align-items:center"><span class="brand-mark" style="width:56px;height:56px">${icon("heart", 26, 2)}</span><div><span class="eyebrow">${esc(S.title)}</span><h1 style="margin-top:4px">Guia para a família</h1><p class="muted" style="margin-top:6px">Compreendendo o TDAH na adolescência</p></div></header>
    ${familiaBody(true)}`;
  },
};

/* =========================================================
   GUIA DA SESSÃO (psicóloga)
   ========================================================= */
function guiaTabBody() {
  const g = GUIA_ETAPAS[S.guiaTab];
  const block = (t, ic, arr, cls) => `<div class="card flat stack" style="gap:10px"><div class="row" style="gap:10px"><span class="icon-blob ${cls}" style="width:40px;height:40px">${icon(ic, 20)}</span><h3 style="font-size:1.05rem">${t}</h3></div><ul class="ticks" style="font-size:.94rem">${arr.map((i) => `<li>${i}</li>`).join("")}</ul></div>`;
  return `<div class="grid g2">${block("Objetivos clínicos", "flag", g.objetivos, "b-lilas")}${block("Perguntas complementares", "chat", g.perguntas, "b-amarelo")}${block("Para aprofundar respostas", "search", g.aprofundar, "b-azul")}${block("Intervenções psicoeducativas", "bulb", g.intervencoes, "b-agua")}${block("Manejo da atividade", "sliders", g.manejo, "b-coral")}${block("Adaptações", "shuffle", g.adaptacoes, "b-lilas")}</div>`;
}
A.guiaTab = (el) => { S.guiaTab = el.dataset.id; save(); $("#guia-tabs").innerHTML = guiaTabs(); $("#guia-body").innerHTML = guiaTabBody(); };
function guiaTabs() { return Object.entries(GUIA_ETAPAS).map(([k, v]) => `<button class="chip ${S.guiaTab === k ? "on" : ""}" data-act="guiaTab" data-id="${k}" aria-pressed="${S.guiaTab === k}">${v.nome}</button>`).join(""); }
A.saveTitle = () => { const v = $("#title-in").value.trim(); S.title = v || TITULO_PADRAO; save(); updateNav(); toast("Título atualizado."); };
A.toggleStage = (el) => { const id = el.dataset.id; if (S.done[id]) { delete S.done[id]; save(); updateNav(); $("#guia-stages").innerHTML = guiaStages(); } else { completeStage(id); $("#guia-stages").innerHTML = guiaStages(); } };
function guiaStages() { return STAGES.map((s) => `<div class="todo"><span style="flex:1;display:flex;gap:10px;align-items:center">${medalSVG(s, !!S.done[s.id], 30)}<span><b>${s.nome}</b><br><span class="muted" style="font-size:.82rem">${S.done[s.id] ? "Concluída · " + s.badge : "Não concluída"}</span></span></span><button class="btn btn-ghost btn-sm" data-act="toggleStage" data-id="${s.id}">${S.done[s.id] ? "Desmarcar" : "Marcar como concluída"}</button></div>`).join(""); }
function guiaRespostas() {
  const ans = Object.entries(S.cards.ans);
  const quizN = Object.keys(S.quiz.ans).length; const games = GAMES.filter((g) => S.games[g.id]).map((g) => g.nome);
  const tools = TOOLS.filter((t) => S.toolsSeen[t.id]).map((t) => t.nome);
  return `<div class="stack" style="gap:12px">
    <p class="muted" style="font-size:.9rem">Registro apenas para apoiar a conversa. Não há pontuação nem interpretação automática.</p>
    <div><h4 style="margin-bottom:8px">Cartas “Isso acontece comigo?” (${ans.length} de ${CARDS.length})</h4>${ans.length ? `<div class="stack" style="gap:6px">${CARD_CATS.map((cat) => { const items = CARDS.filter((c) => c.cat === cat.id && S.cards.ans[c.id]); return items.length ? `<div><span class="tag" style="margin-bottom:4px">${cat.nome}</span><ul class="ticks" style="font-size:.9rem;margin-top:6px">${items.map((c) => `<li>${c.sit} <b style="color:var(--roxo)">· ${RESPOSTAS.find((r) => r.id === S.cards.ans[c.id]).nome}</b></li>`).join("")}</ul></div>` : ""; }).join("")}</div>` : `<p class="muted">Nenhuma carta respondida ainda.</p>`}</div>
    <div class="grid g3"><div class="note lav">${icon("search")}<span>Quiz: ${quizN} de ${QUIZ.length} afirmações exploradas</span></div><div class="note lav">${icon("spark")}<span>Jogos: ${games.length ? games.join(", ") : "nenhum ainda"}</span></div><div class="note lav">${icon("toolbox")}<span>Ferramentas abertas: ${tools.length ? tools.join(", ") : "nenhuma ainda"}</span></div></div>
  </div>`;
}
VIEWS.guia = {
  render() {
    return `<header class="sec-head"><div><span class="eyebrow">${icon("clipboard", 16)} Uso profissional</span><h1 style="margin-top:8px">Guia da sessão</h1><p class="lead">Apoio para a condução clínica: objetivos, perguntas, intervenções e adaptações para cada etapa. Esta área não aparece na jornada da adolescente, apenas no rodapé do menu.</p></div></header>
    <div class="stack-lg">
      <section class="grid g2">
        <div class="card stack"><h3>Postura sugerida</h3><ul class="ticks">${GUIA_GERAL.postura.map((p) => `<li>${p}</li>`).join("")}</ul></div>
        <div class="stack">
          <div class="card stack"><h3>Título do projeto</h3><p class="muted" style="font-size:.9rem">O título aparece no menu, na tela inicial e no manual impresso. Pode ser trocado a qualquer momento.</p><form class="add-row" onsubmit="event.preventDefault();A.saveTitle()"><label class="sr-only" for="title-in">Título</label><input id="title-in" value="${esc(S.title)}" maxlength="60"><button class="btn btn-primary" type="submit">Salvar</button></form><p class="muted" style="font-size:.8rem">Para fixar um título permanente, altere <code>TITULO_PADRAO</code> no início do arquivo.</p></div>
          <div class="note agua">${icon("lock")}<span>${GUIA_GERAL.privacidade}</span></div>
          <button class="btn btn-ghost" data-act="askReset" style="align-self:flex-start">${icon("refresh", 18)} Reiniciar a jornada</button>
        </div>
      </section>
      <section>${sectionTitle("Orientações por etapa", "flag")}<div class="guide-tabs" id="guia-tabs">${guiaTabs()}</div><div id="guia-body">${guiaTabBody()}</div></section>
      <section class="grid g2" style="align-items:start">
        <div>${sectionTitle("Etapas e conquistas", "trophy")}<p class="muted" style="font-size:.9rem;margin-bottom:10px">As etapas são concluídas automaticamente pela exploração ou pelo botão no fim de cada aba. Aqui é possível ajustar manualmente.</p><div class="stack" style="gap:8px" id="guia-stages">${guiaStages()}</div></div>
        <div>${sectionTitle("Registros desta sessão", "list")}${guiaRespostas()}</div>
      </section>
    </div>`;
  },
};
