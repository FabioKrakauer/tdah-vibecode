/* =========================================================
   MISSÕES 5 a 8
   ========================================================= */

/* =================== MISSÃO 5 — SEMANA EM JOGO =================== */
const WD = () => { const d = D("semana"); d.place = d.place || {}; return d; };
const ensaioDay = () => (WD().twist ? M5.imprevisto.para : M5.imprevisto.de);
function dayItems(i) {
  const d = WD();
  const fixed = M5.fixos.map((f) => ({ ...f, d: f.id === "x1" ? ensaioDay() : f.d })).filter((f) => f.d === i);
  const tasks = M5.tarefas.filter((t) => d.place[t.id] === i);
  return { fixed, tasks, load: fixed.reduce((a, b) => a + b.sz, 0) + tasks.reduce((a, b) => a + b.sz, 0) };
}
function weekHTML() {
  const d = WD(); const bank = M5.tarefas.filter((t) => d.place[t.id] === undefined);
  const tok = (t, placed) => { const late = placed && t.ate !== null && d.place[t.id] > t.ate; return `<button class="tok ${d.sel === t.id ? "sel" : ""} ${late ? "late" : ""}" data-act="wkTok" data-id="${t.id}" aria-pressed="${d.sel === t.id}"><span><span>${t.t}</span><small>${t.rot}</small></span><span class="sz">${"■".repeat(t.sz)}</span></button>`; };
  return `<div class="stack">
    <div class="card tight stack"><div class="row between"><span class="label">Tarefas para encaixar</span><span class="label">${bank.length} restantes</span></div>
      ${bank.length ? `<div class="tok-bank">${bank.map((t) => tok(t, false)).join("")}</div>` : `<p class="muted small">Todas as tarefas estão na agenda. Você ainda pode tocar em uma tarefa da semana para mudá-la de dia.</p>`}
      <p class="small muted">${d.sel ? `<b style="color:var(--roxo-ink)">Tarefa selecionada.</b> Agora toque no dia em que quer fazê-la${d.place[d.sel] !== undefined ? `, ou <button class="btn btn-ghost btn-sm" data-act="wkUnplace">devolva para a lista</button>` : ""}.` : "Toque em uma tarefa para selecioná-la."} Cada ■ ocupa um bloco de energia.</p></div>
    <div class="week-scroll"><div class="week">${M5.dias.map((n, i) => { const it = dayItems(i); const over = it.load > M5.cap; return `<div class="day ${d.sel ? "target" : ""} ${over ? "over" : ""}" data-act="wkDay" data-i="${i}" role="button" aria-label="${n}: ${it.load} de ${M5.cap} blocos"><h4>${n}<span class="energy">${Array.from({ length: Math.max(M5.cap, it.load) }, (_, k) => `<i class="${k < it.load ? (k >= M5.cap ? "ovr" : "on") : ""}"></i>`).join("")}</span></h4>
      ${it.fixed.map((f) => `<div class="tok fixed"><span><span>${f.t}</span><small>Compromisso fixo</small></span><span class="sz">${"■".repeat(f.sz)}</span></div>`).join("")}${it.tasks.map((t) => tok(t, true)).join("")}${over ? `<span class="small" style="color:var(--coral-ink);font-weight:700">Dia acima da energia</span>` : ""}</div>`; }).join("")}</div></div>
  </div>`;
}
const wkRefresh = () => { const y = window.scrollY; $("#week").innerHTML = weekHTML(); window.scrollTo(0, y); };
A.wkTok = (el, e) => { e.stopPropagation(); const d = WD(); d.sel = d.sel === el.dataset.id ? null : el.dataset.id; save(); wkRefresh(); };
A.wkDay = (el) => { const d = WD(); if (!d.sel) return; d.place[d.sel] = +el.dataset.i; d.sel = null; save(); tone(587, 0.08, "sine", 0.07); wkRefresh(); };
A.wkUnplace = (el, e) => { e.stopPropagation(); const d = WD(); delete d.place[d.sel]; d.sel = null; save(); wkRefresh(); };
function simulate() {
  const d = WD(); const lines = []; const tally = { antes: 0, vespera: 0, depois: 0, fora: 0, pesados: 0 };
  M5.dias.forEach((n, i) => {
    const it = dayItems(i); const parts = []; let kind = "";
    it.fixed.forEach((f) => parts.push(f.t + (f.id === "x1" && d.twist ? " (remarcado)" : "") + "."));
    it.tasks.forEach((t) => {
      if (t.tipo === "descanso") { parts.push("Teve um tempo para recarregar."); kind = kind || "good"; return; }
      if (t.ate === null) { parts.push(t.t + ", sem pressa."); return; }
      if (i > t.ate) { parts.push(`${t.t} ficou para depois do prazo (${t.rot.toLowerCase()}).`); tally.depois++; kind = "warn"; }
      else if (i === t.ate) { parts.push(`${t.t} aconteceu no limite do prazo.`); tally.vespera++; }
      else { parts.push(`${t.t} foi feito com folga.`); tally.antes++; }
    });
    if (it.load > M5.cap) { parts.push("Dia acima da energia: é provável chegar cansada ao fim, e algo pode sair pela metade."); tally.pesados++; kind = "warn"; }
    if (i === 3) parts.push("Prova de Matemática de manhã.");
    if (i === 4) parts.push("Entrega do trabalho de História.");
    if (!parts.length) parts.push("Um dia mais livre.");
    lines.push({ n, t: parts.join(" "), kind });
  });
  M5.tarefas.forEach((t) => { if (d.place[t.id] === undefined && t.tipo !== "livre") tally.fora++; });
  const descanso = d.place.t7 !== undefined;
  return { lines, tally, descanso, fora: M5.tarefas.filter((t) => d.place[t.id] === undefined) };
}
function storyHTML() {
  const r = simulate();
  return `<div class="stack"><p class="muted">Veja como a semana se desenrolou com as suas escolhas. Não é uma avaliação: é um jeito de enxergar as trocas.</p>
    <div class="story">${r.lines.map((l, i) => `<div class="sd ${l.kind}" style="animation-delay:${i * 120}ms"><b>${l.n}</b><span>${l.t}</span></div>`).join("")}</div>
    <div class="card tight stack"><span class="label">Resumo da semana</span><div class="row" style="gap:6px"><span class="tag agua">Com folga: ${r.tally.antes}</span><span class="tag amarelo">No limite: ${r.tally.vespera}</span><span class="tag coral">Depois do prazo: ${r.tally.depois}</span><span class="tag line">Fora da agenda: ${r.fora.length}</span><span class="tag line">Dias acima da energia: ${r.tally.pesados}</span><span class="tag ${r.descanso ? "agua" : "line"}">Descanso: ${r.descanso ? "sim" : "não"}</span></div>
    ${r.fora.length ? `<p class="small muted">Ficaram fora da agenda: ${r.fora.map((t) => t.t.toLowerCase()).join(", ")}.</p>` : ""}</div>
    <div class="note lav">${icon("route", 18)}<span>Toda agenda tem trocas: adiantar uma tarefa pode deixar outro dia cheio; incluir descanso pode empurrar algo para depois. Perceber essas trocas é o que o planejamento faz.</span></div>
    <div class="grid g2">${talk("Se você pudesse refazer um dia dessa semana, qual seria? O que mudaria?")}${talk("Teve alguma escolha que você faria igual na vida real?")}</div>
    <div class="row"><button class="btn btn-ghost btn-sm" data-act="goStep" data-i="1">${icon("calendar", 14)} Voltar e mudar a agenda</button><a class="btn btn-ghost btn-sm" href="#estrategias">Organizar a semana real (missão 7)</a></div></div>`;
}
MREND.semana = [
  () => `<div id="week">${weekHTML()}</div>`,
  () => { const d = WD(); if (!d.twist) { d.twist = true; save(); } return `<div class="stack"><div class="card" style="background:var(--night);color:var(--on-night);border-color:var(--night)"><span class="label light">Imprevisto</span><h3 style="color:#fff;margin:6px 0">${M5.imprevisto.t}</h3><p>${M5.imprevisto.txt}</p></div>
      ${talk("O que você sente quando um plano muda assim, de repente?")}<p class="muted">A agenda abaixo já mostra o ensaio na quinta. Quer reorganizar alguma coisa? Se preferir, deixe como está.</p><div id="week">${weekHTML()}</div></div>`; },
  () => storyHTML(),
];
MSUM.semana = () => { if (!Object.keys(WD().place).length) return `<p class="small muted">A agenda ainda não foi montada.</p>`; const r = simulate(); return `<p class="small">Com folga: ${r.tally.antes} · No limite: ${r.tally.vespera} · Depois do prazo: ${r.tally.depois} · Dias acima da energia: ${r.tally.pesados} · Descanso: ${r.descanso ? "sim" : "não"}</p>`; };

/* =================== MISSÃO 6 — VOLUME DAS EMOÇÕES =================== */
const ED = () => { const d = D("emocoes"); d.s = d.s || {}; d.sit = d.sit || M6.situacoes[0].id; return d; };
const ES = (id) => { const d = ED(); if (!d.s[id]) d.s[id] = { temp: 5, emo: [], corpo: [], seen: [], path: null, quero: [] }; return d.s[id]; };
function emoHTML() {
  const d = ED(); const sit = M6.situacoes.find((x) => x.id === d.sit); const s = ES(sit.id); const p = s.path !== null ? sit.paths[s.path] : null;
  return `<div class="stack"><div class="sit-tabs">${M6.situacoes.map((x) => `<button class="chip ${d.sit === x.id ? "on" : ""}" data-act="emoSit" data-id="${x.id}">${d.s[x.id] && d.s[x.id].seen.length ? icon("check", 12, 3) : ""}${x.t}</button>`).join("")}</div>
    <div class="scene"><div class="sc-top"><span class="sc-time">${sit.t}</span><p style="font-weight:650;font-size:1.08rem">${sit.s}</p></div>
    <div class="sc-body">
      <div class="grid g2" style="align-items:start"><div class="thermo"><span class="label">Intensidade, de 0 a 10</span><div class="row" style="gap:14px;flex-wrap:nowrap"><span class="tv" id="tv">${s.temp}</span><input type="range" min="0" max="10" value="${s.temp}" data-input="temp" aria-label="Intensidade da emoção"></div><div class="row between small muted"><span>calma</span><span>no limite</span></div></div>
      <div class="stack" style="gap:8px"><span class="label">O que você sentiria?</span><div class="row" style="gap:6px">${chipsHTML(M6.emocoes, s.emo, "emoE", "", "coral")}</div></div></div>
      <div class="stack" style="gap:8px"><span class="label">Onde isso aparece no corpo?</span><div class="row" style="gap:6px">${chipsHTML(M6.corpo, s.corpo, "emoC")}</div></div>
    </div></div>
    <div class="stack"><span class="label">E agora? Explore os caminhos. Vale abrir mais de um.</span>
      <div class="paths">${sit.paths.map((x, i) => `<button class="path ${s.path === i ? "on" : ""} ${s.seen.includes(i) ? "seen" : ""}" data-act="emoPath" data-i="${i}">${s.seen.includes(i) ? `<span class="seenmark">explorado</span>` : ""}${x.l}</button>`).join("")}</div>
      ${p ? `<div class="conseq"><div class="cq a"><b>Logo depois</b>${p.logo}</div><div class="cq b"><b>Mais tarde</b>${p.depois}</div><div class="cq c"><b>O que essa reação tenta resolver</b>${p.tenta}</div></div>` : ""}
    </div>
    ${s.seen.length ? `<div class="note lav">${icon("sliders", 18)}<span>${M6.explica}</span></div>
      <div class="stack" style="gap:8px"><span class="label">Nessa situação, o que você gostaria de tentar?</span><div class="row" style="gap:6px">${chipsHTML(M6.ajuda, s.quero, "emoQ", "", "agua")}</div></div>
      ${talk(s.seen.length > 1 ? "Comparando os caminhos que você abriu, qual parece mais com o que você costuma fazer?" : "Esse caminho parece com algo que você já fez? O que aconteceu?")}` : ""}
  </div>`;
}
const emoRefresh = () => { const y = window.scrollY; $("#emo").innerHTML = emoHTML(); window.scrollTo(0, y); };
A.emoSit = (el) => { ED().sit = el.dataset.id; save(); emoRefresh(); };
A.emoE = (el) => { toggleIn(ES(ED().sit).emo, el.dataset.v); save(); el.classList.toggle("on"); };
A.emoC = (el) => { toggleIn(ES(ED().sit).corpo, el.dataset.v); save(); el.classList.toggle("on"); };
A.emoQ = (el) => { toggleIn(ES(ED().sit).quero, el.dataset.v); save(); el.classList.toggle("on"); };
A.emoPath = (el) => { const s = ES(ED().sit); const i = +el.dataset.i; s.path = i; if (!s.seen.includes(i)) s.seen.push(i); save(); tone(523, 0.1, "sine", 0.07); emoRefresh(); };
INPUTS.temp = (el) => { ES(ED().sit).temp = +el.value; save(); $("#tv").textContent = el.value; };
function regraHTML() {
  const d = ED(); d.regra = d.regra || { sinal: "", nivel: 6, acao: "" };
  const corpo = [...new Set(Object.values(d.s).flatMap((x) => x.corpo))]; const quero = [...new Set(Object.values(d.s).flatMap((x) => x.quero))];
  return `<div class="grid g2" style="align-items:start"><div class="card stack"><p class="muted">Uma frase curta para lembrar quando a emoção subir. Use as sugestões ou escreva do seu jeito.</p>
      <label class="label" for="rg-s">Quando eu perceber...</label><input id="rg-s" class="field" data-input="regra" data-k="sinal" value="${esc(d.regra.sinal)}" placeholder="ex.: meu rosto esquentando" maxlength="80">
      ${corpo.length ? `<div class="sugs">${corpo.map((c) => `<button data-act="rgSug" data-k="sinal" data-v="${esc(c.toLowerCase())}">+ ${esc(c)}</button>`).join("")}</div>` : ""}
      <label class="label" for="rg-n">...e o termômetro estiver perto de</label><div class="row" style="flex-wrap:nowrap;gap:12px"><span class="tv" style="font-family:var(--f-display);font-weight:750;font-size:1.8rem" id="rg-nv">${d.regra.nivel}</span><input id="rg-n" type="range" min="1" max="10" value="${d.regra.nivel}" data-input="regra" data-k="nivel"></div>
      <label class="label" for="rg-a">...eu posso</label><input id="rg-a" class="field" data-input="regra" data-k="acao" value="${esc(d.regra.acao)}" placeholder="ex.: sair um pouco e respirar antes de responder" maxlength="100">
      <div class="sugs">${(quero.length ? quero : M6.ajuda).map((c) => `<button data-act="rgSug" data-k="acao" data-v="${esc(c.toLowerCase())}">+ ${esc(c)}</button>`).join("")}</div></div>
    <div class="stack"><span class="label">Sua regra de bolso</span><div id="rg-card">${regraCard()}</div>${talk("Em que situação real essa regra poderia ser útil nesta semana?")}</div></div>`;
}
function regraCard() { const r = ED().regra; return `<div class="ticket big"><div class="tk-main"><span class="label light">Regra de bolso</span><h4 style="font-size:1.15rem;line-height:1.35">Quando eu perceber ${esc(r.sinal || "...")} e o termômetro estiver perto de ${r.nivel}, eu posso ${esc(r.acao || "...")}.</h4></div><div class="tk-stub"><span class="n">${r.nivel}</span><small>de 10</small></div></div>`; }
INPUTS.regra = (el) => { const r = ED().regra; r[el.dataset.k] = el.dataset.k === "nivel" ? +el.value : el.value; save(); if (el.dataset.k === "nivel") $("#rg-nv").textContent = el.value; $("#rg-card").innerHTML = regraCard(); };
A.rgSug = (el) => { const r = ED().regra; const k = el.dataset.k; r[k] = r[k] ? r[k].replace(/[.,;]?\s*$/, "") + (k === "sinal" ? " ou " : " e ") + el.dataset.v : el.dataset.v; save(); $("#rg-" + (k === "sinal" ? "s" : "a")).value = r[k]; $("#rg-card").innerHTML = regraCard(); };
MREND.emocoes = [() => `<div id="emo">${emoHTML()}</div>`, () => regraHTML()];
MSUM.emocoes = () => { const d = ED(); const ex = M6.situacoes.filter((x) => d.s[x.id] && d.s[x.id].seen.length); return (ex.length ? `<ul class="dots small">${ex.map((x) => { const s = d.s[x.id]; return `<li><b>${x.t}</b> · intensidade ${s.temp}${s.emo.length ? " · " + s.emo.join(", ") : ""} · ${s.seen.length} caminho(s)${s.quero.length ? ` · <span style="color:var(--agua-ink)">quero tentar: ${s.quero.join(", ")}</span>` : ""}</li>`; }).join("")}</ul>` : `<p class="small muted">Nenhuma situação explorada ainda.</p>`) + (d.regra && d.regra.acao ? regraCard() : ""); };

/* =================== MISSÃO 7 — ESTRATÉGIAS =================== */
const TD = () => { const d = D("estrategias"); d.bag = d.bag || []; d.exps = d.exps || []; d.draft = d.draft || {}; return d; };
const chalName = () => { const d = TD(); return d.chal === "own" ? d.chalOwn || "Desafio próprio" : (SITUACOES.find((s) => s.id === d.chal) || {}).nome; };
function chalHTML() {
  const d = TD();
  return `<div class="stack"><p class="muted">Escolha um desafio que aparece na sua vida agora. Pode ser pequeno.</p>
    <div class="chal-grid">${SITUACOES.map((s) => `<button class="chal ${d.chal === s.id ? "on" : ""}" data-act="chal" data-id="${s.id}">${s.nome}</button>`).join("")}<button class="chal ${d.chal === "own" ? "on" : ""}" data-act="chal" data-id="own">Outro desafio...</button></div>
    ${d.chal === "own" ? `<input class="field" data-input="chalOwn" value="${esc(d.chalOwn || "")}" placeholder="Descreva o desafio com suas palavras" maxlength="100" aria-label="Desafio próprio">` : ""}
    ${d.chal ? `<div class="grid g2">${talk("Quando isso aconteceu pela última vez? Como foi?")}${talk("O que já ajudou, mesmo que um pouco?")}</div><div><button class="btn btn-primary" data-act="stepBy" data-d="1">Ver ferramentas ${icon("arrowR", 16)}</button></div>` : ""}</div>`;
}
A.chal = (el) => { TD().chal = el.dataset.id; save(); $("#chal").innerHTML = chalHTML(); };
INPUTS.chalOwn = (el) => { TD().chalOwn = el.value; save(); };
function toolsHTML() {
  const d = TD(); const list = d.all || !d.chal || d.chal === "own" ? TOOLS : TOOLS.filter((t) => t.sit.includes(d.chal));
  return `<div class="stack"><div class="bag">${icon("bag", 18)}<b>Mochila</b>${d.bag.length ? d.bag.map((id) => `<span class="tag">${TOOLS.find((t) => t.id === id).nome}</span>`).join("") : `<span class="small" style="opacity:.75">vazia: escolha até três ferramentas</span>`}<span class="label light" style="margin-left:auto">${d.bag.length}/3</span></div>
    <div class="row between"><span class="label">${d.chal ? "Desafio: " + esc(chalName()) : "Todas as ferramentas"}</span>${d.chal && d.chal !== "own" ? `<button class="btn btn-ghost btn-sm" data-act="toolsAll">${d.all ? "Ver só as do desafio" : "Ver todas"}</button>` : ""}</div>
    <div class="tool-grid">${list.map((t) => { const inb = d.bag.includes(t.id); return `<div class="tool ${inb ? "inbag" : ""}"><div class="row" style="gap:10px"><span class="ib sm i-lilas">${icon(t.icon, 18)}</span><h4>${t.nome}</h4></div><p>${t.como}</p>
      <details><summary>Como usar e exemplo</summary><ol>${t.usar.map((u) => `<li>${u}</li>`).join("")}</ol><p class="small muted" style="margin-top:8px">Exemplo: ${t.ex}</p></details>
      <div class="row" style="margin-top:auto"><button class="btn ${inb ? "btn-dark" : "btn-soft"} btn-sm" data-act="bagT" data-id="${t.id}" ${!inb && d.bag.length >= 3 ? "disabled" : ""}>${inb ? icon("check", 14, 2.6) + " Na mochila" : icon("plus", 14) + " Colocar na mochila"}</button>${t.res ? `<button class="btn btn-ghost btn-sm" data-act="tryRes" data-tab="${t.res}">Testar agora</button>` : ""}</div></div>`; }).join("")}</div></div>`;
}
const toolsRefresh = () => { const y = window.scrollY; $("#tools").innerHTML = toolsHTML(); window.scrollTo(0, y); };
A.toolsAll = () => { TD().all = !TD().all; save(); toolsRefresh(); };
A.bagT = (el) => { const d = TD(); const id = el.dataset.id; if (d.bag.includes(id)) d.bag = d.bag.filter((x) => x !== id); else if (d.bag.length < 3) d.bag.push(id); save(); toolsRefresh(); };
A.tryRes = (el) => { S.resTab = el.dataset.tab; save(); M("estrategias").step = 4; renderStep(); };
function expHTML() {
  const d = TD(); const f = d.draft; const opts = (d.bag.length ? d.bag : TOOLS.map((t) => t.id));
  const field = (k, l, ph) => `<label class="label" for="ex-${k}">${l}</label><input id="ex-${k}" class="field" data-input="draft" data-k="${k}" value="${esc(f[k] || "")}" placeholder="${ph}" maxlength="140">`;
  return `<div class="grid g2" style="align-items:start"><div class="card stack"><span class="label">Novo experimento</span><p class="small muted">Desafio: <b>${esc(chalName() || "escolha na etapa anterior")}</b></p>
      <label class="label" for="ex-tool">Ferramenta que vou testar</label><select id="ex-tool" class="field" data-input="draft" data-k="tool"><option value="">Escolha...</option>${opts.map((id) => { const t = TOOLS.find((x) => x.id === id); return `<option value="${id}" ${f.tool === id ? "selected" : ""}>${t.nome}</option>`; }).join("")}</select>
      ${field("quando", "Quando vou testar", "ex.: terça e quinta, ao chegar da escola")}${field("como", "Como vou fazer", "ex.: timer de 15 minutos antes de abrir o celular")}${field("sinal", "Como vou saber se ajudou", "ex.: se eu começar a tarefa antes das 16h")}${field("obst", "O que pode atrapalhar, e o plano B", "ex.: se esquecer, colocar um alarme com nome")}
      <button class="btn btn-primary" data-act="expSave" ${f.tool ? "" : "disabled"} id="exsave">${icon("flag", 16)} Salvar experimento</button></div>
    <div class="stack"><span class="label">Meus experimentos</span>${d.exps.length ? d.exps.map((x, i) => `<div class="expcard"><div class="row between"><span class="label">Experimento ${pad2(i + 1)}</span><button class="btn btn-ghost btn-sm" data-act="expDel" data-i="${i}" aria-label="Apagar experimento">${icon("trash", 14)}</button></div>
        <dl><dt>Desafio</dt><dd>${esc(x.chal)}</dd><dt>Ferramenta</dt><dd>${esc(TOOLS.find((t) => t.id === x.tool).nome)}</dd>${x.quando ? `<dt>Quando</dt><dd>${esc(x.quando)}</dd>` : ""}${x.como ? `<dt>Como</dt><dd>${esc(x.como)}</dd>` : ""}${x.sinal ? `<dt>Sinal de que ajudou</dt><dd>${esc(x.sinal)}</dd>` : ""}${x.obst ? `<dt>Plano B</dt><dd>${esc(x.obst)}</dd>` : ""}</dl>
        <span class="label">Na próxima sessão: como foi?</span><div class="row" style="gap:6px">${M7.resultados.map((r) => `<button class="chip agua ${x.res === r ? "on" : ""}" data-act="expRes" data-i="${i}" data-v="${r}">${r}</button>`).join("")}</div>
        <textarea class="field" data-input="expNote" data-i="${i}" placeholder="O que você percebeu?" style="min-height:60px">${esc(x.notas || "")}</textarea></div>`).join("") : `<div class="empty">Seu primeiro experimento aparece aqui.</div>`}</div></div>`;
}
INPUTS.draft = (el) => { TD().draft[el.dataset.k] = el.value; save(); const b = $("#exsave"); if (b) b.disabled = !TD().draft.tool; };
A.expSave = () => { const d = TD(); d.exps.push({ ...d.draft, chal: chalName() || "Sem desafio definido", res: null, notas: "" }); d.draft = {}; save(); chime(); $("#exp").innerHTML = expHTML(); };
A.expDel = (el) => { TD().exps.splice(+el.dataset.i, 1); save(); $("#exp").innerHTML = expHTML(); };
A.expRes = (el) => { const x = TD().exps[+el.dataset.i]; x.res = x.res === el.dataset.v ? null : el.dataset.v; save(); $("#exp").innerHTML = expHTML(); };
INPUTS.expNote = (el) => { TD().exps[+el.dataset.i].notas = el.value; save(); };

/* ---------- Recursos interativos ---------- */
const RES_TABS = [{ id: "todo", nome: "Lista de tarefas", icon: "list" }, { id: "timer", nome: "Temporizador", icon: "timer" }, { id: "steps", nome: "Pequenas etapas", icon: "stairs" }, { id: "board", nome: "Quadro da semana", icon: "calendar" }];
function resHTML() { S.resTab = S.resTab || "todo"; return `<div class="res-tabs" id="res-tabs"></div><div class="res-box" id="res-box"></div><p class="muted small" style="margin-top:10px">${icon("lock", 14)} O que você escreve aqui fica apenas neste navegador, durante esta sessão.</p>`; }
function renderRes() {
  if (!$("#res-box")) return;
  $("#res-tabs").innerHTML = RES_TABS.map((t) => `<button class="chip ${S.resTab === t.id ? "on" : ""}" data-act="resTab" data-id="${t.id}">${icon(t.icon, 15)} ${t.nome}</button>`).join("");
  $("#res-box").innerHTML = ({ todo: todoHTML, timer: timerHTML, steps: stepsHTML, board: boardHTML })[S.resTab]();
  if (S.resTab === "timer") timerPaint(); if (S.resTab === "board") boardDnD();
}
A.resTab = (el) => { S.resTab = el.dataset.id; save(); renderRes(); };
function todoHTML() {
  return `<div class="row between" style="margin-bottom:10px"><div><h3>Lista de tarefas</h3><p class="muted small">Registre aqui o que precisa fazer e marque quando terminar.</p></div>${S.todo.some((t) => t.done) ? `<button class="btn btn-ghost btn-sm" data-act="todoClear">${icon("trash", 14)} Limpar concluídas</button>` : ""}</div>
  <form class="add-row" onsubmit="event.preventDefault();A.todoAdd()"><label class="sr-only" for="todo-in">Nova tarefa</label><input id="todo-in" placeholder="ex.: separar o material de inglês" maxlength="120" autocomplete="off"><button class="btn btn-dark" type="submit">${icon("plus", 16)} Adicionar</button></form>
  <div class="todo-list">${S.todo.length ? S.todo.map((t) => `<div class="todo ${t.done ? "done" : ""}"><label><input type="checkbox" data-act="todoToggle" data-id="${t.id}" ${t.done ? "checked" : ""}><span>${esc(t.t)}</span></label><button class="mini" data-act="todoDel" data-id="${t.id}" aria-label="Remover tarefa">${icon("x", 14)}</button></div>`).join("") : `<div class="empty">Nenhuma tarefa ainda. Que tal começar por algo pequeno para hoje?</div>`}</div>`;
}
A.todoAdd = () => { const v = $("#todo-in").value.trim(); if (!v) return; S.todo.push({ id: uid(), t: v, done: false }); save(); renderRes(); $("#todo-in").focus(); };
A.todoToggle = (el) => { const t = S.todo.find((x) => x.id === el.dataset.id); t.done = el.checked; save(); if (t.done) tone(784, 0.15, "sine", 0.08); renderRes(); };
A.todoDel = (el) => { S.todo = S.todo.filter((x) => x.id !== el.dataset.id); save(); renderRes(); };
A.todoClear = () => { S.todo = S.todo.filter((x) => !x.done); save(); renderRes(); };
const TM = { total: 15 * 60, left: 15 * 60, running: false, iv: null, label: "Foco", ended: false };
const fmt = (s) => `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
function timerHTML() {
  return `<div class="timer-wrap"><div class="vinyl ${TM.running ? "spin" : ""}" id="vinyl"><svg viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="114" fill="none" stroke="#EFE9F9" stroke-width="8"/><circle id="tm-ring" cx="120" cy="120" r="114" fill="none" stroke="#91D8C9" stroke-width="8" stroke-linecap="round" transform="rotate(-90 120 120)" stroke-dasharray="716.3" stroke-dashoffset="0"/>
    <g class="disc"><circle cx="120" cy="120" r="100" fill="#211936"/><circle cx="120" cy="120" r="86" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="2"/><circle cx="120" cy="120" r="72" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="2"/><path d="M62 82a70 70 0 0 1 38-26" stroke="#fff" stroke-opacity=".2" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="120" cy="120" r="38" fill="#C6B2E8"/><path d="${sparkPath(120, 100, 8)}" fill="#211936"/><circle cx="120" cy="120" r="4" fill="#211936"/></g></svg><div class="time"><span id="tm-time">${fmt(TM.left)}</span></div></div>
    <div class="stack"><div><h3>Temporizador</h3><p class="muted small">Escolha uma duração viável. O disco gira enquanto o tempo passa, e o anel mostra quanto falta.</p></div>
      <div class="row" style="gap:6px">${[5, 10, 15, 25].map((m) => `<button class="chip ${TM.total === m * 60 && TM.label === "Foco" ? "on" : ""}" data-act="tmSet" data-m="${m}">${m} min</button>`).join("")}<button class="chip agua ${TM.label === "Pausa" ? "on" : ""}" data-act="tmPause">Pausa de 5 min</button></div>
      <div class="row" style="gap:6px"><button class="btn btn-soft btn-sm" data-act="tmAdj" data-d="-1" ${TM.running ? "disabled" : ""}>− 1 min</button><button class="btn btn-soft btn-sm" data-act="tmAdj" data-d="1" ${TM.running ? "disabled" : ""}>+ 1 min</button><span class="tag ${TM.label === "Pausa" ? "agua" : ""}">${TM.label === "Pausa" ? "Modo pausa" : "Modo foco"}</span></div>
      <div class="row"><button class="btn ${TM.running ? "btn-ghost" : "btn-primary"}" data-act="tmToggle">${TM.running ? icon("pause", 16) + " Pausar" : icon("play", 16) + (TM.left < TM.total && TM.left > 0 ? " Continuar" : " Iniciar")}</button><button class="btn btn-ghost" data-act="tmReset">${icon("refresh", 16)} Zerar</button></div>
      <div aria-live="polite">${TM.ended ? `<div class="note agua">${icon("check", 18)}<span>${TM.label === "Pausa" ? "Fim da pausa. Retome a tarefa com calma." : "Tempo concluído. Faça uma pausa curta antes do próximo ciclo."}</span></div>` : ""}</div></div></div>`;
}
function timerPaint() { const t = $("#tm-time"); if (t) t.textContent = fmt(TM.left); const r = $("#tm-ring"); if (r) r.setAttribute("stroke-dashoffset", (716.3 * (1 - TM.left / TM.total)).toFixed(1)); }
function stopTimer(reset) { clearInterval(TM.iv); TM.iv = null; TM.running = false; if (reset) { TM.left = TM.total; TM.ended = false; } }
A.tmSet = (el) => { stopTimer(); TM.total = TM.left = +el.dataset.m * 60; TM.label = "Foco"; TM.ended = false; renderRes(); };
A.tmPause = () => { stopTimer(); TM.total = TM.left = 300; TM.label = "Pausa"; TM.ended = false; renderRes(); };
A.tmAdj = (el) => { const m = Math.max(1, Math.min(90, Math.round(TM.total / 60) + +el.dataset.d)); TM.total = TM.left = m * 60; TM.ended = false; renderRes(); };
A.tmReset = () => { stopTimer(true); renderRes(); };
A.tmToggle = () => {
  if (TM.running) { stopTimer(); renderRes(); return; }
  if (TM.left <= 0) TM.left = TM.total; TM.ended = false; TM.running = true; tone(523, 0.1, "sine", 0.07);
  TM.iv = setInterval(() => { TM.left--; timerPaint(); if (TM.left <= 0) { stopTimer(); TM.left = 0; TM.ended = true; chime(); setTimeout(chime, 900); if ($("#vinyl")) renderRes(); else toast(TM.label === "Pausa" ? "Fim da pausa." : "Tempo concluído."); } }, 1000);
  renderRes();
};
function stepsHTML() {
  const P = S.plan; const done = P.steps.filter((s) => s.done).length;
  return `<div class="stack"><div><h3>Pequenas etapas</h3><p class="muted small">Escreva uma tarefa grande e divida-a em passos pequenos e concretos.</p></div>
    <div><label for="goal-in" class="label" style="display:block;margin-bottom:6px">Minha tarefa grande</label><input id="goal-in" class="field" placeholder="ex.: apresentação de Ciências na sexta" value="${esc(P.goal)}" maxlength="120" data-input="goal"></div>
    <form class="add-row" onsubmit="event.preventDefault();A.stepAdd()"><label class="sr-only" for="step-in">Novo passo</label><input id="step-in" placeholder="Próximo passo pequeno (ex.: escolher o tema)" maxlength="120" autocomplete="off"><button class="btn btn-dark" type="submit">${icon("plus", 16)} Passo</button></form>
    ${P.steps.length ? `<div style="height:8px;border-radius:4px;background:var(--line);overflow:hidden"><div style="height:100%;width:${(done / P.steps.length) * 100}%;background:var(--agua);transition:width .4s"></div></div><span class="label">${done} de ${P.steps.length} passos</span>` : ""}
    <div class="stack" style="gap:8px">${P.steps.length ? P.steps.map((s, i) => `<div class="plan-item" style="${s.done ? "background:var(--agua-soft)" : ""}"><span class="pn">${i + 1}</span><label class="grow" style="display:flex;gap:10px;align-items:center;cursor:pointer"><input type="checkbox" data-act="stepToggle" data-id="${s.id}" ${s.done ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--agua-ink)"><span style="${s.done ? "text-decoration:line-through;color:var(--ink-2)" : ""}">${esc(s.t)}</span></label><button class="mini" data-act="stepMove" data-i="${i}" data-d="-1" aria-label="Subir">${icon("up", 15)}</button><button class="mini" data-act="stepMove" data-i="${i}" data-d="1" aria-label="Descer">${icon("down", 15)}</button><button class="mini" data-act="stepDel" data-id="${s.id}" aria-label="Remover">${icon("x", 15)}</button></div>`).join("") : `<div class="empty">Dica: o primeiro passo deve ser tão pequeno que dê para fazer em poucos minutos.</div>`}</div>
    ${P.steps.length || P.goal ? `<div><button class="btn btn-ghost btn-sm" data-act="stepClear">${icon("trash", 14)} Começar um plano novo</button></div>` : ""}</div>`;
}
INPUTS.goal = (el) => { S.plan.goal = el.value; save(); };
A.stepAdd = () => { const v = $("#step-in").value.trim(); if (!v) return; S.plan.steps.push({ id: uid(), t: v, done: false }); save(); renderRes(); $("#step-in").focus(); };
A.stepToggle = (el) => { const s = S.plan.steps.find((x) => x.id === el.dataset.id); s.done = el.checked; save(); if (s.done) tone(784, 0.15, "sine", 0.08); renderRes(); };
A.stepDel = (el) => { S.plan.steps = S.plan.steps.filter((x) => x.id !== el.dataset.id); save(); renderRes(); };
A.stepMove = (el) => { const i = +el.dataset.i, j = i + +el.dataset.d, a = S.plan.steps; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; save(); renderRes(); };
A.stepClear = () => { S.plan = { goal: "", steps: [] }; save(); renderRes(); };
const COLS = ["A fazer", "Em andamento", "Concluído"]; const BCOLORS = ["lilas", "agua", "coral", "amarelo", "azul"]; let boardColor = "lilas";
function boardHTML() {
  return `<div class="stack"><div><h3>Quadro da semana</h3><p class="muted small">Adicione tarefas e mova-as conforme avança. Use cores para separar por assunto.</p></div>
  <form class="add-row" onsubmit="event.preventDefault();A.boardAdd()" style="flex-wrap:wrap"><label class="sr-only" for="board-in">Nova tarefa</label><input id="board-in" placeholder="ex.: estudar para a prova de História" maxlength="100" autocomplete="off" style="flex:1 1 220px"><div class="swatches" role="group" aria-label="Cor da tarefa">${BCOLORS.map((c) => `<button type="button" class="${boardColor === c ? "on" : ""}" data-act="boardColor" data-c="${c}" style="background:var(--${c})" aria-label="Cor ${SYM_NOMES[c]}"></button>`).join("")}</div><button class="btn btn-dark" type="submit">${icon("plus", 16)} Adicionar</button></form>
  <div class="kanban">${COLS.map((name, ci) => { const items = S.board.filter((b) => b.col === ci); return `<div class="kcol" data-col="${ci}"><h4>${name}<span class="tag">${items.length}</span></h4>${items.map((b) => `<div class="kitem" draggable="true" data-id="${b.id}" style="border-left:5px solid var(--${b.cor})"><span>${esc(b.t)}</span><div class="kact">${ci > 0 ? `<button class="mini" data-act="boardMove" data-id="${b.id}" data-d="-1" aria-label="Mover para ${COLS[ci - 1]}">${icon("left", 15)}</button>` : ""}${ci < 2 ? `<button class="mini" data-act="boardMove" data-id="${b.id}" data-d="1" aria-label="Mover para ${COLS[ci + 1]}">${icon("right", 15)}</button>` : ""}<button class="mini" data-act="boardDel" data-id="${b.id}" aria-label="Remover">${icon("x", 15)}</button></div></div>`).join("") || `<p class="muted small" style="text-align:center;padding:12px 0">${ci === 0 ? "Adicione uma tarefa" : "Arraste ou use as setas"}</p>`}</div>`; }).join("")}</div></div>`;
}
A.boardColor = (el) => { boardColor = el.dataset.c; const v = $("#board-in").value; renderRes(); $("#board-in").value = v; };
A.boardAdd = () => { const v = $("#board-in").value.trim(); if (!v) return; S.board.push({ id: uid(), t: v, col: 0, cor: boardColor }); save(); renderRes(); $("#board-in").focus(); };
A.boardMove = (el) => { const b = S.board.find((x) => x.id === el.dataset.id); b.col = Math.max(0, Math.min(2, b.col + +el.dataset.d)); save(); renderRes(); };
A.boardDel = (el) => { S.board = S.board.filter((x) => x.id !== el.dataset.id); save(); renderRes(); };
function boardDnD() {
  $$(".kitem").forEach((it) => { it.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", it.dataset.id); it.classList.add("dragging"); }); it.addEventListener("dragend", () => it.classList.remove("dragging")); });
  $$(".kcol").forEach((col) => { col.addEventListener("dragover", (e) => { e.preventDefault(); col.classList.add("over"); }); col.addEventListener("dragleave", () => col.classList.remove("over")); col.addEventListener("drop", (e) => { e.preventDefault(); const b = S.board.find((x) => x.id === e.dataTransfer.getData("text/plain")); if (b) { b.col = +col.dataset.col; save(); renderRes(); } }); });
}
MREND.estrategias = [() => `<div id="chal">${chalHTML()}</div>`, () => `<div id="tools">${toolsHTML()}</div>`, () => `<div id="exp">${expHTML()}</div>`, () => resHTML()];
MMOUNT.estrategias = { 4: renderRes };
MSUM.estrategias = () => { const d = TD(); return `<p class="small">Desafio: <b>${esc(chalName() || "não definido")}</b></p>${d.bag.length ? `<div class="row" style="gap:6px">${d.bag.map((id) => `<span class="tag agua">${TOOLS.find((t) => t.id === id).nome}</span>`).join("")}</div>` : ""}<p class="small muted">${d.exps.length} experimento(s) planejado(s).</p>`; };

/* =================== MISSÃO 8 — RIDER =================== */
const PERSONA_COLORS = { roxo: "#7656A8", agua: "#3E9F8B", coral: "#C86A78", azul: "#5487BC" };
const RD = () => { const d = D("rider"); d.r = d.r || {}; return d; };
function riderSugs(fonte) {
  const c3 = S.m.comigo ? S.m.comigo.d : {}; const sorted = c3.sorted || {};
  switch (fonte) {
    case "cerebro": { const team = (S.m.bastidores && S.m.bastidores.d.team) || {}; const fortes = M1.equipe.filter((c) => (team[c.id] ?? 0) >= 7).map((c) => "Minha equipe forte: " + c.apelido.toLowerCase()); return M8.cerebro.concat(fortes); }
    case "dificeis": return M3.cartas.filter((c) => c.cat !== "forte" && sorted[c.id] === "muito").map((c) => c.t);
    case "fortes": return M3.cartas.filter((c) => c.cat === "forte" && (sorted[c.id] === "muito" || sorted[c.id] === "asvezes")).map((c) => c.t);
    case "habil": return M8.habil;
    case "ajuda": { const lab = S.m.laboratorio ? Object.values(S.m.laboratorio.d.j || {}).flatMap((j) => j.e).filter((x) => x !== "Não usei estratégia") : []; const emo = S.m.emocoes ? Object.values(S.m.emocoes.d.s || {}).flatMap((s) => s.quero) : []; const bag = S.m.estrategias ? (S.m.estrategias.d.bag || []).map((id) => TOOLS.find((t) => t.id === id).nome) : []; return [...new Set([...bag, ...emo, ...lab])]; }
    case "exp": { const e = S.m.estrategias ? S.m.estrategias.d : {}; return [...new Set([...(e.exps || []).map((x) => TOOLS.find((t) => t.id === x.tool).nome + (x.quando ? ", " + x.quando : "")), ...(e.bag || []).map((id) => TOOLS.find((t) => t.id === id).nome)])]; }
    case "pedir": return M8.pedir;
    default: return [];
  }
}
function riderHTML() {
  const d = RD();
  return `<div class="stack"><div class="card tight row between"><div class="row" style="gap:14px"><span class="label">Símbolo</span><div class="persona">${["mic", "skate", "star", "note"].map((s) => `<button class="${S.persona.icon === s ? "on" : ""}" data-act="persona" data-k="icon" data-v="${s}" aria-label="${SHAPE_NOMES[s]}">${sym(s, "roxo")}</button>`).join("")}</div></div>
      <div class="row" style="gap:14px"><span class="label">Cor</span><div class="swatches">${Object.entries(PERSONA_COLORS).map(([k, v]) => `<button class="${S.persona.cor === k ? "on" : ""}" data-act="persona" data-k="cor" data-v="${k}" style="background:${v}" aria-label="Cor ${SYM_NOMES[k]}"></button>`).join("")}</div></div></div>
    <div class="rider-grid">${M8.perguntas.map((q, i) => { const sugs = riderSugs(q.fonte); return `<div class="card rq"><label for="rq-${q.id}"><span class="qn">${pad2(i + 1)}</span>${q.q}</label><textarea id="rq-${q.id}" class="field" data-input="rider" data-id="${q.id}" placeholder="Escreva com as suas palavras..." maxlength="900">${esc(d.r[q.id] || "")}</textarea>${sugs.length ? `<div class="sugs"><span class="small muted" style="align-self:center">Das suas missões:</span>${sugs.slice(0, 8).map((s) => `<button type="button" data-act="rSug" data-id="${q.id}" data-v="${esc(s)}">+ ${esc(s)}</button>`).join("")}</div>` : ""}</div>`; }).join("")}</div>
    <div class="row between"><button class="btn btn-ghost" data-act="riderAskClear">${icon("trash", 16)} Apagar respostas</button><button class="btn btn-primary" data-act="stepBy" data-d="1">Ver meu pôster ${icon("arrowR", 16)}</button></div></div>`;
}
INPUTS.rider = (el) => { RD().r[el.dataset.id] = el.value; save(); };
A.rSug = (el) => { const d = RD(); const id = el.dataset.id; const ta = $("#rq-" + id); const cur = ta.value.trim(); ta.value = cur ? cur.replace(/[.,;]?$/, "") + "; " + el.dataset.v.charAt(0).toLowerCase() + el.dataset.v.slice(1) : el.dataset.v; d.r[id] = ta.value; save(); ta.focus(); };
A.persona = (el) => { S.persona[el.dataset.k] = el.dataset.v; save(); rerender(); };
A.riderAskClear = () => openModal(`<div class="modal-head"><span class="ib i-coral">${icon("trash", 22)}</span><div><h2>Apagar as respostas do rider?</h2><p class="muted" style="margin-top:6px">Os textos das nove perguntas serão apagados. Os ingressos continuam.</p></div></div><div class="modal-body"><div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-dark" data-act="riderClear">Apagar</button></div></div>`);
A.riderClear = () => { RD().r = {}; save(); closeModal(); rerender(); toast("Respostas apagadas."); };
function posterHTML() {
  const d = RD(); const c = PERSONA_COLORS[S.persona.cor] || PERSONA_COLORS.roxo; const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const earned = MISSIONS.filter((m) => S.m[m.id] && S.m[m.id].done); const full = ["r1", "r8"];
  const symInner = sym(S.persona.icon, "#ffffff").replace(/<\/?svg[^>]*>/g, "").replace(/#211936/g, "rgba(255,255,255,.55)");
  return `<div class="row no-print" style="justify-content:space-between;margin-bottom:16px"><button class="btn btn-ghost" data-act="goStep" data-i="1">${icon("edit", 16)} Editar respostas</button><div class="row">${printButtons("Imprimir pôster")}</div></div>
  <article class="poster"><header class="poster-head" style="background:linear-gradient(120deg,#211936 30%,${c})">
    <svg class="deco" viewBox="0 0 300 220" preserveAspectRatio="xMaxYMid slice" aria-hidden="true"><g transform="translate(150 30) scale(3.4)" opacity=".35">${symInner}</g><path d="${sparkPath(250, 46, 16)}" fill="#F2D47E"/><path d="${sparkPath(120, 170, 7)}" fill="#91D8C9"/><path d="M0 190 C70 140 130 220 200 170 S290 120 320 150" fill="none" stroke="#91D8C9" stroke-width="1.5" stroke-dasharray="1 7" stroke-linecap="round"/></svg>
    <div style="position:relative;max-width:560px" class="stack"><span class="k">Meu rider · ${esc(S.title)}</span><h1>Meu cérebro, minhas descobertas.</h1><span class="k">${hoje}</span></div></header>
    <div class="poster-body">${M8.perguntas.map((q) => { const v = (d.r[q.id] || "").trim(); return `<div class="pitem ${full.includes(q.id) ? "full" : ""}"><span class="k">${q.q}</span>${v ? `<p>${esc(v)}</p>` : `<p class="blank">Ainda não respondido.</p>`}</div>`; }).join("")}
      ${earned.length ? `<div class="pitem full" style="background:#fff"><span class="k">Missões vividas</span><div class="row" style="gap:6px">${earned.map((m) => `<span class="tag">${pad2(m.n)} · ${m.titulo}</span>`).join("")}</div></div>` : ""}</div>
    <footer class="poster-foot"><span>Este documento reúne as palavras de quem o escreveu. Não é um laudo, uma avaliação ou um diagnóstico.</span><span>Seu mundo, seu ritmo, sua mente.</span></footer></article>`;
}
MREND.rider = [() => riderHTML(), () => posterHTML()];
MSUM.rider = () => { const n = M8.perguntas.filter((q) => (RD().r[q.id] || "").trim()).length; return `<p class="small">${n} de ${M8.perguntas.length} perguntas respondidas. <button class="btn btn-ghost btn-sm" data-act="goStep" data-i="2">Ver pôster</button></p>`; };
