/* =========================================================
   MISSÃO 1 — ENTENDENDO MINHA MENTE
   ========================================================= */
MREND.mente = [
  () => `<div class="stack-lg">${introHTML(M1.intro, `<div class="note gold">${icon("eye", 20)}<span><b>Um lembrete importante.</b> ${M1.investigacao}</span></div>`)}${deepBlocks("mente", M1.blocos)}${talk("Qual desses blocos mais parece com você? E qual não tem nada a ver?")}</div>`,
  () => `<div id="myth">${mythHTML()}</div>`,
  () => m1Conecte(),
  () => conquistaHTML("mente", { sub: "Você conheceu melhor o jeito da sua mente: atenção, impulsos, começo e fim das tarefas, interesse e os dias que mudam.", label: "Uma descoberta que levo comigo", ph: "Algo que você percebeu, uma pergunta nova, algo para observar nos próximos dias...", top: m1Resumo() }),
];
function mythHTML() {
  const d = D("mente"); d.myth = d.myth || { i: 0, ans: {} }; const st = d.myth; const L = M1.mitos;
  const dots = `<div class="mdots" aria-hidden="true">${L.map((_, k) => `<i class="${k === st.i && st.i < L.length ? "cur" : st.ans[k] ? "on" : ""}"></i>`).join("")}</div>`;
  if (st.i >= L.length) return `<div class="myth">${dots}<div class="mcard"><span class="label">Síntese</span><h2>O que fica dos mitos</h2><ul class="stack-sm" style="margin:0;padding-left:20px">${M1.sintese.map((s) => `<li>${s}</li>`).join("")}</ul>${talk("Qual dessas ideias você gostaria que mais gente soubesse?")}<div class="row"><button class="btn btn-pri" data-act="stepBy" data-d="1">Avançar: Conecte ${icon("arrowR", 16)}</button><button class="btn btn-ghost" data-act="mythAll">${icon("list", 16)} Rever todas as afirmações</button><button class="btn btn-ghost btn-sm" data-act="mythRestart">${icon("refresh", 14)} Jogar de novo</button></div><div id="mythall"></div></div></div>`;
  const it = L[st.i]; const a = st.ans[st.i];
  const VT = { mito: "É mito", verdade: "É verdade", depende: "Depende" };
  return `<div class="myth"><div class="row between"><div><span class="label">Desvendando os mitos</span><h2 style="margin-top:4px">Verdade ou mito?</h2></div><span class="small muted count">Afirmação ${st.i + 1} de ${L.length}</span></div>${dots}
    <div class="mcard" ${a ? "" : 'style="animation:pop .35s ease both"'}><p class="stmt">“${it.t}”</p>
      <div class="mopts">${[["verdade", "Verdade"], ["mito", "Mito"], ["nsei", "Não tenho certeza"]].map(([k, l]) => `<button class="mopt ${a === k ? "mine" : ""}" data-act="mythAns" data-v="${k}" ${a ? "disabled" : ""}>${l}</button>`).join("")}</div>
      ${a ? `<div class="reveal"><span class="verdict ${it.v}">${VT[it.v]}</span><p>${it.exp}</p><p class="small muted">Você marcou: ${a === "nsei" ? "não tenho certeza" : a}. Não existe placar aqui: o que importa é a conversa.</p></div>
      <div class="row"><button class="btn btn-pri" data-act="mythNext">${st.i === L.length - 1 ? "Ver a síntese" : "Próxima afirmação"} ${icon("arrowR", 16)}</button></div>` : `<p class="small muted">Escolha uma opção para ver a explicação.</p>`}</div>
    <p class="small muted">Dica: antes de abrir, conte em voz alta por que escolheu essa resposta.</p></div>`;
}
const mythRefresh = () => { $("#myth").innerHTML = mythHTML(); };
A.mythAns = (el) => { const st = D("mente").myth; st.ans[st.i] = el.dataset.v; save(); mythRefresh(); };
A.mythNext = () => { const st = D("mente").myth; st.i++; save(); mythRefresh(); $("#myth").scrollIntoView({ behavior: "smooth", block: "start" }); };
A.mythRestart = () => { D("mente").myth = { i: 0, ans: {} }; save(); mythRefresh(); };
A.mythAll = () => { const VT = { mito: "Mito", verdade: "Verdade", depende: "Depende" }; $("#mythall").innerHTML = `<div class="stack-sm">${M1.mitos.map((m) => `<details class="deep"><summary><span class="dic">${icon("chat", 20)}</span><span><b style="font-size:.98rem">${m.t}</b><span class="dsub">${VT[m.v]}</span></span><span class="chev">${icon("down")}</span></summary><div class="deep-body"><div class="dsec"><p>${m.exp}</p></div></div></details>`).join("")}</div>`; };
function m1Conecte() {
  const d = D("mente"); d.facil = d.facil || []; d.dificil = d.dificil || []; d.facilOwn = d.facilOwn || []; d.dificilOwn = d.dificilOwn || []; d.foco = d.foco || {};
  const col = (k, title, ic, cls) => `<div class="card stack"><h3 class="row" style="gap:8px"><span style="color:var(--${cls}-ink)">${icon(ic, 20)}</span>${title}</h3><div class="chips">${chips([...M1[k], ...d[k + "Own"]], d[k], "mente", k, cls)}</div>
    <form class="add-row" data-form="addOwn" data-m="mente" data-k="${k}"><label class="sr-only" for="own-${k}">Outra situação</label><input id="own-${k}" class="field" placeholder="Outra situação..." maxlength="50" autocomplete="off"><button class="btn btn-ghost btn-sm" type="submit">${icon("plus", 14)} Incluir</button></form></div>`;
  return `<div class="stack-lg"><section class="stack"><h2>Meus dias mais fáceis e mais difíceis</h2><p class="muted prose">Marque o que costuma acontecer com você. São pistas, não respostas: servem para se observar e para conversar.</p>
    <div class="grid g2">${col("facil", "Minha atenção fica mais fácil quando...", "spark", "acc")}${col("dificil", "Minha atenção fica mais difícil quando...", "wave", "warm")}</div></section>
    <section class="stack"><h2>Interessante ou tedioso?</h2><p class="muted prose">Quanto foco você costuma ter em cada atividade? Arraste cada barra.</p>
      <div class="card stack">${M1.ativ.map((a, i) => { const v = d.foco[i] ?? 5; return `<div class="stack-sm" style="gap:4px"><div class="row between"><label for="foco-${i}" style="font-weight:700">${a}</label><span class="small muted count" id="fv-${i}">${focoTxt(v)}</span></div><input id="foco-${i}" type="range" min="0" max="10" value="${v}" data-input="foco" data-i="${i}"></div>`; }).join("")}
      <div class="row between small muted"><span>quase nenhum foco</span><span>foco total</span></div></div>
      <div class="note acc">${icon("info", 20)}<span>Repare como o foco muda de uma atividade para outra. Isso acontece com todo mundo. O tamanho da diferença e o que faz o foco subir são pistas sobre como a sua mente funciona.</span></div></section>
    <div class="grid g2">${talk("O que os seus dias mais fáceis têm em comum?")}${talk("Dá para levar alguma coisa das atividades com mais foco para as com menos?")}</div></div>`;
}
const focoTxt = (v) => (v <= 2 ? "quase nenhum" : v <= 4 ? "pouco" : v <= 6 ? "médio" : v <= 8 ? "bastante" : "total");
INPUTS.foco = (el) => { D("mente").foco[el.dataset.i] = +el.value; save(); $("#fv-" + el.dataset.i).textContent = focoTxt(+el.value); };
FORMS.addOwn = (f) => { const inp = f.querySelector("input"); const v = inp.value.trim(); if (!v) return; const d = D(f.dataset.m); const k = f.dataset.k; d[k + "Own"] = d[k + "Own"] || []; if (!d[k + "Own"].includes(v)) d[k + "Own"].push(v); d[k] = d[k] || []; if (!d[k].includes(v)) d[k].push(v); save(); rerender(); };
function m1Resumo() {
  const d = D("mente"); const f = d.facil || [], g = d.dificil || [];
  if (!f.length && !g.length) return "";
  return `<div class="card soft stack-sm"><span class="label">O que você observou</span>${f.length ? `<p><b>Mais fácil quando:</b> ${esc(f.join(", ").toLowerCase())}.</p>` : ""}${g.length ? `<p><b>Mais difícil quando:</b> ${esc(g.join(", ").toLowerCase())}.</p>` : ""}</div>`;
}

/* =========================================================
   MISSÃO 2 — DA VONTADE À AÇÃO
   ========================================================= */
function bridgeSVG() {
  return `<svg viewBox="0 0 360 150" style="width:100%;max-width:420px;height:auto" role="img" aria-label="Uma ponte entre saber e fazer, apoiada por lembretes, listas, etapas e rotina">
    <rect x="6" y="70" width="70" height="70" rx="10" class="f-soft"/><rect x="284" y="70" width="70" height="70" rx="10" class="f-soft"/>
    <text x="41" y="110" text-anchor="middle" class="f-ink" style="font:800 14px var(--f-body)">Saber</text><text x="319" y="110" text-anchor="middle" class="f-ink" style="font:800 14px var(--f-body)">Fazer</text>
    <path d="M76 78 Q180 30 284 78" fill="none" class="s-pri" stroke-width="4"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => { const x = 92 + i * 30; const y = 78 - Math.sin(((x - 76) / 208) * Math.PI) * 24; return `<rect x="${x - 10}" y="${y - 3}" width="20" height="9" rx="2" class="f-gold"/>`; }).join("")}
    ${["lembretes", "listas", "etapas", "rotina"].map((t, i) => `<g transform="translate(${100 + i * 45} 120)"><path d="M0 -28 v24" class="s-acc" stroke-width="3"/><text x="0" y="12" text-anchor="middle" class="f-ink" style="font:700 10px var(--f-body)">${t}</text></g>`).join("")}
    <path d="${sparkPath(180, 18, 8)}" class="f-gold twinkle"/></svg>`;
}
MREND.acao = [
  () => `<div class="stack-lg">${introHTML(M2.intro, `<div class="card stack" style="align-items:center">${bridgeSVG()}<p class="small muted" style="text-align:center">As tábuas são as estratégias que deixam a travessia mais firme.</p></div>`)}<div class="note">${icon("hand", 20)}<span>${M2.chave}</span></div>${deepBlocks("acao", M2.blocos)}${talk("Em qual dessas partes a sua ponte costuma balançar mais?")}</div>`,
  () => `<div id="caos">${caosHTML()}</div>`,
  () => toolsHTML(),
  () => conquistaHTML("acao", { sub: "Você entendeu a distância entre saber e fazer e experimentou ferramentas para atravessá-la.", label: "Como vou usar essa ferramenta", help: "Quando, onde, e o que pode atrapalhar.", ph: "ex.: vou usar a lista de conferência toda noite antes de dormir, colada na porta do quarto...", top: m2Pick() }),
];
MMOUNT.acao = { 1: bindDrag };

/* ---------- Organizando o caos ---------- */
function caos() { const d = D("acao"); if (!d.caos) d.caos = { phase: "plan", list: M2.caos.base.slice(), col: {}, sel: null, split: [] }; return d.caos; }
const CC = (id) => M2.caos.cards[id];
const fmtH = (h) => { const m = Math.round(h * 60); return m < 60 ? m + " min" : (m % 60 ? Math.floor(m / 60) + "h" + String(m % 60).padStart(2, "0") : m / 60 + "h"); };
const capOf = (c) => (c.phase === "plan" ? 6 : 3);
const hoursIn = (c, col) => c.list.filter((id) => c.col[id] === col).reduce((a, id) => a + CC(id).h, 0);
function tcardHTML(c, id) {
  const k = CC(id); const sel = c.sel === id;
  return `<div class="tcard ${sel ? "sel" : ""} ${k.of ? "child" : ""}" data-act="caosSel" data-id="${id}" role="button" tabindex="0" aria-pressed="${sel}"><span class="grip" data-grip="${id}" aria-hidden="true" title="Arrastar">${icon("grip", 16)}</span><span class="tt">${k.t}</span>
    <span class="tm"><span>${icon("clock", 13)} ${fmtH(k.h)}</span><span class="${k.urg ? "urg" : ""}">prazo: ${k.prazo}</span></span>
    ${k.split && c.phase !== "done" ? `<span class="tact"><button class="linkbtn" data-act="caosSplit" data-id="${id}">${icon("stairs", 13)} Dividir em etapas</button></span>` : ""}</div>`;
}
function caosHTML() {
  const c = caos(); const cap = capOf(c); const bank = c.list.filter((id) => !c.col[id]); const used = hoursIn(c, "hoje");
  const colHTML = (col) => { const ids = c.list.filter((id) => c.col[id] === col.id); const over = col.id === "hoje" && used > cap;
    return `<div class="ccol ${col.id} ${c.sel ? "target" : ""} ${over ? "over" : ""}" data-col="${col.id}"><div class="ccol-h"><div class="row between"><b>${col.t}</b><span class="small muted count">${ids.length}</span></div>
      ${col.id === "hoje" ? `<div class="bar" aria-label="Tempo usado"><i style="width:${Math.min(100, (used / cap) * 100)}%;background:${over ? "var(--warm-ink)" : "var(--acc)"}"></i></div><span class="small ${over ? "" : "muted"}" style="${over ? "color:var(--warm-ink);font-weight:750" : ""}">${fmtH(used)} de ${cap}h${over ? " · passou do tempo da tarde" : ""}</span>` : ""}</div>
      ${c.sel && c.col[c.sel] !== col.id ? `<button class="drop-here" data-act="caosMove" data-col="${col.id}">Mover para cá</button>` : ""}
      ${ids.map((id) => tcardHTML(c, id)).join("")}</div>`; };
  const head = c.phase === "plan" ? `<div class="note">${icon("calendar", 20)}<span>${M2.caos.cena}</span></div>`
    : `<div class="twist"><span style="color:var(--gold)">${icon("bell", 26)}</span><div class="stack-sm"><h3>${M2.caos.twist.t}</h3><p>${M2.caos.twist.txt}</p></div></div>`;
  const how = `<p class="small muted">${icon("grip", 14)} Arraste pela alça, ou toque num cartão e depois em “Mover para cá”.</p>`;
  const actions = c.phase === "plan" ? `<button class="btn btn-pri" data-act="caosNext" ${bank.length ? "disabled" : ""}>${icon("check", 16)} Fechar o plano da tarde</button>${bank.length ? `<span class="small muted">Organize todos os cartões para continuar.</span>` : ""}`
    : c.phase === "twist" ? `<button class="btn btn-pri" data-act="caosNext">${icon("eye", 16)} Ver como ficou</button>` : "";
  return `<div class="caos"><div class="row between"><div><span class="label">Organizando o caos</span><h2 style="margin-top:4px">Uma tarde, muitas coisas</h2></div><button class="btn btn-ghost btn-sm" data-act="caosReset">${icon("refresh", 14)} Recomeçar o jogo</button></div>
    ${head}${c.phase === "done" ? caosResult() : `${how}
    ${bank.length ? `<div class="bank ${c.sel ? "" : ""}" data-col=""><div class="bank-h row between"><b>Para organizar</b><span class="small muted count">${bank.length} cartões</span></div>${c.sel && c.col[c.sel] ? `<button class="drop-here" data-act="caosMove" data-col="">Devolver para cá</button>` : ""}${bank.map((id) => tcardHTML(c, id)).join("")}</div>` : ""}
    <div class="caos-cols">${M2.caos.cols.map(colHTML).join("")}</div><div class="row">${actions}</div>`}</div>`;
}
function caosResult() {
  const c = caos(); const cap = capOf(c); const used = hoursIn(c, "hoje"); const T = (col) => c.list.filter((id) => c.col[id] === col).map((id) => CC(id));
  const urgFora = c.list.filter((id) => CC(id).urg && c.col[id] !== "hoje").map(CC); const descanso = c.col.c8 === "hoje"; const div = c.split.map((id) => CC(id).t.toLowerCase());
  const obs = [];
  obs.push(used > cap ? `A tarde ficou com ${fmtH(used)} de tarefas para ${cap}h. Na vida real, algo provavelmente ficaria pela metade ou atrasaria o aniversário. O que você tiraria?` : `A tarde ficou com ${fmtH(used)} de tarefas para ${cap}h. ${cap - used >= 0.5 ? "Sobrou uma folga, que ajuda quando algo demora mais do que o previsto." : "Ficou bem justa."}`);
  if (urgFora.length) obs.push(`Algumas coisas com prazo curto ficaram fora de hoje: ${urgFora.map((k) => k.t.toLowerCase()).join(", ")}. Dá para fazer em outro momento, como de manhã cedo, ou combinar um novo prazo?`);
  else obs.push("As coisas com prazo para hoje ou amanhã cedo ficaram na tarde. Isso costuma evitar correria depois.");
  obs.push(descanso ? "Você incluiu descanso na tarde. Descansar também é parte do plano: um cérebro cansado rende menos." : "O descanso ficou de fora da tarde. Tudo bem, mas vale pensar quando ele vai acontecer.");
  if (div.length) obs.push(`Você dividiu ${div.join(" e ")} em etapas. Assim dá para fazer uma parte hoje e o resto depois, sem precisar de um bloco enorme de tempo.`);
  return `<div class="grid g2" style="align-items:start"><div class="stack">${M2.caos.cols.map((col) => `<div class="card stack-sm"><b>${col.t}</b>${T(col.id).length ? `<ul style="margin:0;padding-left:18px">${T(col.id).map((k) => `<li>${k.t} <span class="small muted">(${fmtH(k.h)})</span></li>`).join("")}</ul>` : `<span class="small muted">Nada aqui.</span>`}</div>`).join("")}</div>
    <div class="stack"><div class="card soft stack-sm"><span class="label">O que dá para perceber</span>${obs.map((o) => `<p>${o}</p>`).join("")}<p class="small muted">Isso não é nota nem avaliação. Toda escolha tem trocas.</p></div>
      <div class="card stack-sm"><span class="label acc">Por que priorizar ajuda</span><p>Priorizar não é conseguir fazer tudo. É escolher, de propósito, o que fica de fora. Duas perguntas ajudam: <b>o que vence primeiro?</b> e <b>o que é importante de verdade?</b> O que é urgente e importante vem primeiro; o que não é nenhum dos dois pode esperar sem culpa.</p><p>E quando aparece um imprevisto, o plano não falhou: ele só precisa mudar. Reorganizar faz parte de planejar.</p></div>
      ${talk("O que você moveu quando o imprevisto apareceu? Por quê?")}${talk("Na sua semana real, o que costuma ficar de fora quando o tempo aperta?")}
      <div class="row"><button class="btn btn-ghost btn-sm" data-act="caosBack">${icon("arrowL", 14)} Voltar e mexer no plano</button></div></div></div>`;
}
const caosRefresh = () => { const y = window.scrollY; $("#caos").innerHTML = caosHTML(); window.scrollTo(0, y); };
A.caosSel = (el) => { if (DRAG.justDropped) return; const c = caos(); if (c.phase === "done") return; c.sel = c.sel === el.dataset.id ? null : el.dataset.id; save(); caosRefresh(); };
A.caosMove = (el) => { const c = caos(); if (!c.sel) return; moveCard(c.sel, el.dataset.col); };
function moveCard(id, col) { const c = caos(); if (col) c.col[id] = col; else delete c.col[id]; c.sel = null; save(); caosRefresh(); }
A.caosSplit = (el, e) => { e.stopPropagation(); const c = caos(); const id = el.dataset.id; const k = CC(id); const i = c.list.indexOf(id); const col = c.col[id]; c.list.splice(i, 1, ...k.split); k.split.forEach((s) => { if (col) c.col[s] = col; }); delete c.col[id]; c.split.push(id); c.sel = null; save(); caosRefresh(); toast("Tarefa dividida em " + k.split.length + " etapas."); };
A.caosNext = () => { const c = caos(); c.phase = c.phase === "plan" ? "twist" : "done"; c.sel = null; save(); caosRefresh(); $("#caos").scrollIntoView({ behavior: "smooth", block: "start" }); };
A.caosBack = () => { caos().phase = "twist"; save(); caosRefresh(); };
A.caosReset = () => { D("acao").caos = null; save(); caosRefresh(); };
const DRAG = { id: null, ghost: null, sx: 0, sy: 0, moved: false, justDropped: false };
function bindDrag() {}
document.addEventListener("pointerdown", (e) => { const g = e.target.closest("[data-grip]"); if (!g) return; e.preventDefault(); DRAG.id = g.dataset.grip; DRAG.sx = e.clientX; DRAG.sy = e.clientY; DRAG.moved = false; DRAG.src = g.closest(".tcard"); });
document.addEventListener("pointermove", (e) => {
  if (!DRAG.id) return; const dx = e.clientX - DRAG.sx, dy = e.clientY - DRAG.sy;
  if (!DRAG.moved && Math.hypot(dx, dy) < 5) return;
  if (!DRAG.moved) { DRAG.moved = true; const gh = DRAG.src.cloneNode(true); gh.classList.add("ghost"); document.body.appendChild(gh); DRAG.ghost = gh; DRAG.src.style.opacity = ".35"; $$("[data-col]").forEach((c) => c.classList.add("target")); }
  DRAG.ghost.style.left = e.clientX - 30 + "px"; DRAG.ghost.style.top = e.clientY - 20 + "px";
});
document.addEventListener("pointerup", (e) => {
  if (!DRAG.id) return; const id = DRAG.id; DRAG.id = null;
  if (!DRAG.moved) { const c = caos(); c.sel = c.sel === id ? null : id; save(); caosRefresh(); DRAG.justDropped = true; setTimeout(() => (DRAG.justDropped = false), 50); return; }
  DRAG.ghost && DRAG.ghost.remove(); DRAG.ghost = null; DRAG.justDropped = true; setTimeout(() => (DRAG.justDropped = false), 50);
  const under = document.elementFromPoint(e.clientX, e.clientY); const col = under && under.closest("[data-col]");
  if (col) moveCard(id, col.dataset.col); else caosRefresh();
});
document.addEventListener("pointercancel", () => { if (DRAG.ghost) DRAG.ghost.remove(); DRAG.id = null; DRAG.ghost = null; if ($("#caos")) caosRefresh(); });

/* ---------- Autonomia no cotidiano ---------- */
function TD() { const d = D("acao"); d.t = d.t || { tab: "agenda", tried: {}, agenda: {}, lembretes: [], lista: [], etapas: { goal: "", steps: [], mini: false }, visual: [], rotina: { tipo: "manha", blocks: null, saida: "07:10" }, ajuda: { quem: "", oque: "", precisa: [] } }; return d.t; }
const tried = (k) => { TD().tried[k] = 1; };
function toolsHTML() {
  const t = TD(); const tool = M2.tools.find((x) => x.id === t.tab);
  return `<div class="stack-lg"><div class="stack"><span class="label">Autonomia no cotidiano</span><h2>Ferramentas para experimentar de verdade</h2><p class="muted prose">Escolha uma ferramenta e use com algo real da sua semana. Experimente quantas quiser: cada pessoa se dá melhor com umas do que com outras.</p>
    <div class="note acc">${icon("hand", 20)}<span><b>Ser independente não significa fazer tudo sozinha.</b> Significa conhecer o que te ajuda, inclusive saber quando e a quem pedir apoio. Usar lembrete, lista ou pedir ajuda é um jeito de cuidar das suas coisas.</span></div></div>
    <div class="tooltabs" role="tablist">${M2.tools.map((x) => `<button class="chip ${t.tab === x.id ? "on" : ""}" data-act="toolTab" data-id="${x.id}" role="tab" aria-selected="${t.tab === x.id}">${t.tried[x.id] ? icon("check", 14, 2.6) : icon(x.icon, 15)} ${x.nome}</button>`).join("")}</div>
    <div class="toolbox-panel" id="toolp"><div class="row" style="gap:12px"><span class="ib" style="width:44px;height:44px;border-radius:13px;background:var(--pri-soft);color:var(--pri-ink);display:grid;place-items:center">${icon(tool.icon, 22)}</span><h3>${tool.nome}</h3></div>
      <div class="why">${icon("spark", 18)}<span><b>Por que funciona:</b> ${tool.pq}</span></div>${TOOLR[t.tab]()}</div></div>`;
}
const toolRefresh = () => { const y = window.scrollY; $("#mstep").innerHTML = `<div>${toolsHTML()}</div>`; window.scrollTo(0, y); };
A.toolTab = (el) => { TD().tab = el.dataset.id; save(); toolRefresh(); };
const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const TOOLR = {
  agenda: () => { const a = TD().agenda; return `<p class="small muted">Anote compromissos e prazos reais. Depois, espalhe as tarefas grandes em mais de um dia.</p><div class="week-grid">${DIAS.map((n, i) => `<div class="wday"><h4>${n}</h4>${(a[i] || []).map((x, k) => `<div class="witem"><span>${esc(x)}</span><button class="mini" style="width:22px;height:22px" data-act="agDel" data-i="${i}" data-k="${k}" aria-label="Remover">${icon("x", 12)}</button></div>`).join("")}<form data-form="agAdd" data-i="${i}"><label class="sr-only" for="ag-${i}">Adicionar em ${n}</label><input id="ag-${i}" placeholder="+ adicionar" maxlength="60" autocomplete="off"></form></div>`).join("")}</div>`; },
  lembretes: () => { const L = TD().lembretes; return `<div class="grid g2" style="align-items:start"><form class="card stack-sm" data-form="lemAdd"><label class="label" for="lem-t">O que fazer, exatamente</label><input id="lem-t" class="field" placeholder="ex.: separar o material de inglês na mochila" maxlength="80" autocomplete="off"><div class="row" style="flex-wrap:nowrap"><div class="stack-sm" style="flex:1;gap:4px"><label class="label" for="lem-d">Dia</label><select id="lem-d" class="field">${["Todo dia", ...DIAS].map((x) => `<option>${x}</option>`).join("")}</select></div><div class="stack-sm" style="flex:1;gap:4px"><label class="label" for="lem-h">Hora</label><input id="lem-h" type="time" class="field" value="19:00"></div></div><button class="btn btn-pri" type="submit">${icon("bell", 16)} Criar lembrete</button><div id="lem-tip"></div></form>
    <div class="stack-sm"><span class="label">Compare</span><div class="notif" style="opacity:.6"><span class="ni">${icon("bell", 18)}</span><span><b>Lembrete</b><small>vago: o que era mesmo?</small></span><span></span></div><div class="notif"><span class="ni">${icon("bell", 18)}</span><span><b>Colocar a apostila de Ciências na mochila</b><small>claro: dá para fazer na hora</small></span><span></span></div>
    <span class="label" style="margin-top:8px">Meus lembretes</span>${L.length ? L.map((l, k) => `<div class="notif"><span class="ni">${icon("bell", 18)}</span><span><b>${esc(l.t)}</b><small>${esc(l.d)} · ${esc(l.h)}</small></span><button class="mini" data-act="lemDel" data-k="${k}" aria-label="Remover">${icon("x", 14)}</button></div>`).join("") : `<div class="empty">Crie um lembrete de verdade para esta semana. Depois, se quiser, copie para o seu celular.</div>`}</div></div>`; },
  lista: () => { const L = TD().lista; return `<div class="row" style="gap:6px"><span class="small muted">Começar com um modelo:</span>${Object.keys(M2.listas).map((k) => `<button class="chip sug" data-act="listaTpl" data-k="${esc(k)}">${icon("plus", 13)} ${k}</button>`).join("")}</div>
    <form class="add-row" data-form="listaAdd"><label class="sr-only" for="lista-in">Novo item</label><input id="lista-in" class="field" placeholder="Novo item da lista" maxlength="80" autocomplete="off"><button class="btn btn-pri" type="submit">${icon("plus", 16)} Incluir</button></form>
    ${L.length ? `<div class="stack-sm">${L.map((x, k) => `<div class="check-item ${x.ok ? "done" : ""}"><label><input type="checkbox" data-act="listaTog" data-k="${k}" ${x.ok ? "checked" : ""}><span>${esc(x.t)}</span></label><button class="mini" data-act="listaDel" data-k="${k}" aria-label="Remover">${icon("x", 14)}</button></div>`).join("")}</div><div class="row"><span class="small muted count">${L.filter((x) => x.ok).length} de ${L.length} conferidos</span><button class="btn btn-ghost btn-sm" data-act="listaClear">${icon("refresh", 14)} Desmarcar tudo</button></div>` : `<div class="empty">Sua lista aparece aqui.</div>`}`; },
  etapas: () => { const E = TD().etapas; const done = E.steps.filter((s) => s.ok).length; return `<div class="stack-sm"><label class="label" for="et-goal">Uma tarefa grande da sua semana</label><input id="et-goal" class="field" data-input="etGoal" value="${esc(E.goal)}" placeholder="ex.: apresentação de Ciências na sexta" maxlength="100"></div>
    <form class="add-row" data-form="etAdd"><label class="sr-only" for="et-in">Próximo passo</label><input id="et-in" class="field" placeholder="Próximo passo pequeno e concreto" maxlength="100" autocomplete="off"><button class="btn btn-pri" type="submit">${icon("plus", 16)} Passo</button></form>
    ${E.steps.length ? `<div class="bar"><i style="width:${(done / E.steps.length) * 100}%"></i></div><span class="small muted count">${done} de ${E.steps.length} passos</span><div class="stack-sm">${E.steps.map((s, k) => `<div class="check-item ${s.ok ? "done" : ""}"><label><input type="checkbox" data-act="etTog" data-k="${k}" ${s.ok ? "checked" : ""}><span><b>${k + 1}.</b> ${esc(s.t)}</span></label><button class="mini" data-act="etMove" data-k="${k}" data-d="-1" aria-label="Subir">${icon("up", 14)}</button><button class="mini" data-act="etDel" data-k="${k}" aria-label="Remover">${icon("x", 14)}</button></div>`).join("")}</div>
      <label class="check-item" style="cursor:pointer"><input type="checkbox" data-act="etMini" ${E.mini ? "checked" : ""}><span>O primeiro passo cabe em dois minutos?</span></label>${E.mini ? "" : `<p class="small muted">Se não cabe, tente dividir o primeiro passo em um ainda menor. É ele que tira a tarefa do lugar.</p>`}` : `<div class="empty">Dica: o primeiro passo deve ser tão pequeno que dê para fazer agora mesmo.</div>`}`; },
  visual: () => { const V = TD().visual; const C = ["A fazer", "Fazendo", "Pronto"]; return `<form class="add-row" data-form="visAdd"><label class="sr-only" for="vis-in">Nova tarefa</label><input id="vis-in" class="field" placeholder="Tarefa da semana" maxlength="80" autocomplete="off"><button class="btn btn-pri" type="submit">${icon("plus", 16)} Incluir</button></form>
    <div class="kanban">${C.map((n, ci) => { const it = V.filter((x) => x.c === ci); return `<div class="kcol"><div class="row between"><b>${n}</b><span class="tag line">${it.length}</span></div>${it.map((x) => `<div class="kitem" style="border-left-color:var(--${["pri", "gold", "acc"][ci]})"><span>${esc(x.t)}</span><div class="kact">${ci > 0 ? `<button class="mini" data-act="visMove" data-id="${x.id}" data-d="-1" aria-label="Voltar coluna">${icon("left", 14)}</button>` : ""}${ci < 2 ? `<button class="mini" data-act="visMove" data-id="${x.id}" data-d="1" aria-label="Avançar coluna">${icon("right", 14)}</button>` : ""}<button class="mini" data-act="visDel" data-id="${x.id}" aria-label="Remover">${icon("x", 14)}</button></div></div>`).join("") || `<span class="small muted">vazio</span>`}</div>`; }).join("")}</div>`; },
  rotina: () => { const R = TD().rotina; if (!R.blocks) R.blocks = M2.rotinas[R.tipo].map(([t, m]) => ({ t, m })); const tot = R.blocks.reduce((a, b) => a + (+b.m || 0), 0); const [hh, mm] = (R.saida || "07:10").split(":").map(Number); const ini = new Date(2000, 0, 1, hh, mm - tot); const iniTxt = String(ini.getHours()).padStart(2, "0") + ":" + String(ini.getMinutes()).padStart(2, "0");
    return `<div class="row"><button class="chip ${R.tipo === "manha" ? "on" : ""}" data-act="rotTipo" data-v="manha">Rotina da manhã</button><button class="chip ${R.tipo === "noite" ? "on" : ""}" data-act="rotTipo" data-v="noite">Rotina da noite</button></div>
    <div class="routine">${R.blocks.map((b, k) => `<div class="rblock"><label class="sr-only" for="rb-t-${k}">Etapa</label><input id="rb-t-${k}" class="field" style="padding:6px 9px" data-input="rotT" data-k="${k}" value="${esc(b.t)}" maxlength="50"><label class="sr-only" for="rb-m-${k}">Minutos</label><input id="rb-m-${k}" class="field" style="padding:6px 9px" type="number" min="1" max="120" data-input="rotM" data-k="${k}" value="${b.m}"><span class="small muted">min</span><button class="mini" data-act="rotMove" data-k="${k}" aria-label="Subir">${icon("up", 14)}</button><button class="mini" data-act="rotDel" data-k="${k}" aria-label="Remover">${icon("x", 14)}</button></div>`).join("")}</div>
    <div class="row"><button class="btn btn-ghost btn-sm" data-act="rotAdd">${icon("plus", 14)} Incluir etapa</button></div>
    <div class="rtime" aria-hidden="true">${R.blocks.map((b) => `<i style="flex:${+b.m || 1}" title="${esc(b.t)}"></i>`).join("")}</div>
    <div class="card soft row between"><div class="row" style="gap:8px"><label for="rot-saida" class="small" style="font-weight:700">${R.tipo === "manha" ? "Preciso sair às" : "Quero dormir às"}</label><input id="rot-saida" type="time" class="field" style="width:auto" data-input="rotSaida" value="${R.saida}"></div><p id="rot-res"><b>${tot} minutos</b> no total. Comece às <b>${iniTxt}</b>.</p></div>`; },
  ajuda: () => { const H = TD().ajuda; const msg = ajudaMsg(); return `<div class="grid g2" style="align-items:start"><div class="stack"><div class="stack-sm"><span class="label">Para quem?</span><div class="chips">${M2.quem.map((q) => `<button class="chip ${H.quem === q ? "on" : ""}" data-act="ajQuem" data-v="${esc(q)}">${q}</button>`).join("")}</div></div>
    <div class="stack-sm"><label class="label" for="aj-o">O que está difícil?</label><input id="aj-o" class="field" data-input="ajO" value="${esc(H.oque)}" placeholder="ex.: começar o trabalho de História" maxlength="100"></div>
    <div class="stack-sm"><span class="label">Do que eu preciso?</span><div class="chips">${M2.precisa.map((q) => `<button class="chip acc ${H.precisa.includes(q) ? "on" : ""}" data-act="ajPrec" data-v="${esc(q)}">${q}</button>`).join("")}</div></div></div>
    <div class="stack"><span class="label">Sua mensagem</span><div class="msgprev" id="aj-msg">${esc(msg)}</div><label class="sr-only" for="aj-copy">Texto da mensagem</label><textarea id="aj-copy" class="field" readonly style="min-height:0;height:1px;opacity:0;position:absolute;pointer-events:none">${esc(msg)}</textarea><div class="row"><button class="btn btn-pri btn-sm" data-act="ajCopy">${icon("copy", 14)} Copiar mensagem</button></div>
    <p class="small muted">Pedidos claros funcionam melhor: dizem o que está difícil e o que exatamente ajudaria. E dá para pedir antes de virar emergência.</p></div></div>`; },
};
function ajudaMsg() { const H = TD().ajuda; const q = H.quem ? (H.quem === "A psicóloga" ? "" : "") : ""; const nome = H.quem ? H.quem.replace(/^Minha |^Meu |^Uma |^A /, "").toLowerCase() : "___"; const p = H.precisa.length ? H.precisa.join(" e ") : "___"; return `Oi${H.quem ? ", " + nome : ""}! Tô com dificuldade para ${H.oque || "___"}. Você poderia ${p}? Ia me ajudar muito.`; }
const tRef = () => { save(); toolRefresh(); };
FORMS.agAdd = (f) => { const v = f.querySelector("input").value.trim(); if (!v) return; const a = TD().agenda; const i = f.dataset.i; (a[i] = a[i] || []).push(v); tried("agenda"); tRef(); const n = $("#ag-" + i); n && n.focus(); };
A.agDel = (el) => { TD().agenda[el.dataset.i].splice(+el.dataset.k, 1); tRef(); };
FORMS.lemAdd = () => { const t = $("#lem-t").value.trim(); if (!t) return; if (t.split(/\s+/).length < 3 || /^(lembrete|estudar|tarefa|coisas?|escola|li[cç][aã]o)$/i.test(t)) { $("#lem-tip").innerHTML = `<div class="note warm small">${icon("info", 16)}<span>Tente dizer exatamente a ação: em vez de “estudar”, algo como “abrir o livro de História na página 42”. Quanto mais claro, mais fácil agir quando o lembrete tocar.</span></div>`; return; } TD().lembretes.push({ t, d: $("#lem-d").value, h: $("#lem-h").value || "—" }); tried("lembretes"); tRef(); };
A.lemDel = (el) => { TD().lembretes.splice(+el.dataset.k, 1); tRef(); };
A.listaTpl = (el) => { const L = TD().lista; M2.listas[el.dataset.k].forEach((t) => { if (!L.some((x) => x.t === t)) L.push({ t, ok: false }); }); tried("lista"); tRef(); };
FORMS.listaAdd = () => { const v = $("#lista-in").value.trim(); if (!v) return; TD().lista.push({ t: v, ok: false }); tried("lista"); tRef(); $("#lista-in").focus(); };
A.listaTog = (el) => { TD().lista[+el.dataset.k].ok = el.checked; tried("lista"); tRef(); };
A.listaDel = (el) => { TD().lista.splice(+el.dataset.k, 1); tRef(); };
A.listaClear = () => { TD().lista.forEach((x) => (x.ok = false)); tRef(); };
INPUTS.etGoal = (el) => { TD().etapas.goal = el.value; save(); };
FORMS.etAdd = () => { const v = $("#et-in").value.trim(); if (!v) return; TD().etapas.steps.push({ t: v, ok: false }); tried("etapas"); tRef(); $("#et-in").focus(); };
A.etTog = (el) => { TD().etapas.steps[+el.dataset.k].ok = el.checked; tRef(); };
A.etDel = (el) => { TD().etapas.steps.splice(+el.dataset.k, 1); tRef(); };
A.etMove = (el) => { const a = TD().etapas.steps; const i = +el.dataset.k; if (i < 1) return; [a[i - 1], a[i]] = [a[i], a[i - 1]]; tRef(); };
A.etMini = (el) => { TD().etapas.mini = el.checked; tRef(); };
FORMS.visAdd = () => { const v = $("#vis-in").value.trim(); if (!v) return; TD().visual.push({ id: uid(), t: v, c: 0 }); tried("visual"); tRef(); $("#vis-in").focus(); };
A.visMove = (el) => { const x = TD().visual.find((y) => y.id === el.dataset.id); x.c = Math.max(0, Math.min(2, x.c + +el.dataset.d)); tRef(); };
A.visDel = (el) => { const V = TD().visual; V.splice(V.findIndex((y) => y.id === el.dataset.id), 1); tRef(); };
A.rotTipo = (el) => { const R = TD().rotina; R.tipo = el.dataset.v; R.blocks = M2.rotinas[R.tipo].map(([t, m]) => ({ t, m })); R.saida = R.tipo === "manha" ? "07:10" : "22:30"; tried("rotina"); tRef(); };
INPUTS.rotT = (el) => { TD().rotina.blocks[+el.dataset.k].t = el.value; tried("rotina"); save(); };
INPUTS.rotM = (el) => { TD().rotina.blocks[+el.dataset.k].m = Math.max(1, Math.min(120, +el.value || 1)); tried("rotina"); save(); clearTimeout(INPUTS._rt); INPUTS._rt = setTimeout(() => { const f = document.activeElement && document.activeElement.id; toolRefresh(); if (f && $("#" + f)) $("#" + f).focus(); }, 700); };
INPUTS.rotSaida = (el) => { TD().rotina.saida = el.value || "07:10"; tried("rotina"); save(); clearTimeout(INPUTS._rs); INPUTS._rs = setTimeout(() => { toolRefresh(); }, 700); };
A.rotMove = (el) => { const a = TD().rotina.blocks; const i = +el.dataset.k; if (i < 1) return; [a[i - 1], a[i]] = [a[i], a[i - 1]]; tried("rotina"); tRef(); };
A.rotDel = (el) => { TD().rotina.blocks.splice(+el.dataset.k, 1); tRef(); };
A.rotAdd = () => { TD().rotina.blocks.push({ t: "Nova etapa", m: 5 }); tried("rotina"); tRef(); };
A.ajQuem = (el) => { const H = TD().ajuda; H.quem = H.quem === el.dataset.v ? "" : el.dataset.v; tried("ajuda"); tRef(); };
A.ajPrec = (el) => { toggleIn(TD().ajuda.precisa, el.dataset.v); tried("ajuda"); tRef(); };
INPUTS.ajO = (el) => { TD().ajuda.oque = el.value; tried("ajuda"); save(); const m = ajudaMsg(); $("#aj-msg").textContent = m; $("#aj-copy").value = m; };
A.ajCopy = () => copyText(ajudaMsg(), $("#aj-copy"));
function m2Pick() {
  const d = D("acao"); d.pick = d.pick || []; const t = TD();
  return `<div class="card stack"><span class="label">Uma ferramenta que posso levar para o meu dia</span><p class="small muted">Escolha uma ou mais. As que você experimentou estão marcadas.</p><div class="chips">${M2.tools.map((x) => `<button class="chip acc ${d.pick.includes(x.nome) ? "on" : ""}" data-act="chip" data-m="acao" data-k="pick" data-v="${esc(x.nome)}">${t.tried[x.id] ? icon("check", 13, 2.6) : ""} ${x.nome}</button>`).join("")}</div></div>`;
}

