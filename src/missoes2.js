/* =========================================================
   MISSÃO 3 — ENTRE PENSAMENTOS E EMOÇÕES
   ========================================================= */
function triSVG(sel) {
  const V = { pens: [190, 48], emo: [62, 262], comp: [318, 262] };
  const col = { pens: "f-pri", emo: "f-warm", comp: "f-acc" };
  const arrow = (a, b) => { const [x1, y1] = V[a], [x2, y2] = V[b]; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L; return `<line x1="${x1 + ux * 52}" y1="${y1 + uy * 52}" x2="${x2 - ux * 52}" y2="${y2 - uy * 52}" class="s-line" stroke-width="2.5" marker-end="url(#ah)" marker-start="url(#ah2)"/>`; };
  return `<svg class="tri" viewBox="0 0 380 320" role="group" aria-label="Triângulo: pensamento, emoção e comportamento"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" class="f-ink" opacity=".5"/></marker><marker id="ah2" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10 0 0 5 10 10z" class="f-ink" opacity=".5"/></marker></defs>
    ${arrow("pens", "emo")}${arrow("emo", "comp")}${arrow("comp", "pens")}
    ${Object.entries(V).map(([k, [x, y]]) => `<g class="vx ${sel === k ? "on" : ""}" data-act="triSel" data-k="${k}" tabindex="0" role="button" aria-label="${M3.tri[k].t}"><circle cx="${x}" cy="${y}" r="44" class="${col[k]}"/><text x="${x}" y="${y + 5}" text-anchor="middle" style="fill:var(--on-pri)">${M3.tri[k].t}</text></g>`).join("")}
    <path d="${sparkPath(190, 180, 10)}" class="f-gold twinkle"/></svg>`;
}
function triPanel(k) { if (!k) return `<div class="card stack-sm"><span class="label">Toque em cada parte</span><p class="muted">As três se influenciam o tempo todo, nos dois sentidos. Mudar uma delas costuma mexer nas outras.</p></div>`; const t = M3.tri[k]; return `<div class="card stack-sm" aria-live="polite"><span class="label">${t.t}</span><p>${t.txt}</p><div class="note small">${icon("chat", 16)}<span>Exemplo: ${t.ex}</span></div></div>`; }
A.triSel = (el) => { const d = D("emocoes"); d.tri = el.dataset.k; save(); $("#tri").innerHTML = `${triSVG(d.tri)}`; $("#trip").innerHTML = triPanel(d.tri); };
MREND.emocoes = [
  () => { const d = D("emocoes"); return `<div class="stack-lg">${introHTML(M3.intro, `<div class="note">${icon("heart", 20)}<span>Nenhuma emoção é errada. A ideia aqui é entender o que acontece por dentro, para ter mais escolhas por fora.</span></div>`)}
    <section class="tri-wrap"><div id="tri">${triSVG(d.tri)}</div><div id="trip">${triPanel(d.tri)}</div></section>${deepBlocks("emocoes", M3.blocos)}</div>`; },
  () => `<div id="story">${storyHTML()}</div>`,
  () => m3Conecte(),
  () => conquistaHTML("emocoes", { sub: "Você explorou como pensamentos, emoções e reações se conectam, e montou estratégias para os momentos difíceis.", label: "O que essa frase quer dizer para você?", ph: "Escreva do seu jeito...", top: `<div class="phrase"><svg class="sky" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true">${sky(18, 5)}</svg><span class="label on-hero" style="position:relative">Para levar</span><p style="margin-top:8px">${M3.frase}</p></div>`, bottom: m3Quero() }),
];
/* História interativa */
function SD() { const d = D("emocoes"); d.st = d.st || { sit: "s1", th: null, re: null, stage: "pens", emo: [], int: 5, own: "", ownR: "", ownLogo: "", ownDepois: "", explored: {} }; return d.st; }
function storyHTML() {
  const h = SD(); const sit = M3.situacoes.find((s) => s.id === h.sit); const th = h.th === "own" ? { t: h.own, emo: [], reac: null } : h.th !== null ? sit.pens[h.th] : null;
  if (!th && h.stage !== "pens") h.stage = "pens";
  const total = M3.situacoes.reduce((a, s) => a + s.pens.reduce((b, p) => b + p.reac.length, 0), 0); const exp = Object.keys(h.explored).length;
  const stages = [["pens", "Pensamento"], ["emo", "Emoção"], ["reac", "Reação"], ["cons", "Consequência"]]; const si = stages.findIndex((s) => s[0] === h.stage);
  const bc = `<div class="trail-bc" aria-label="Caminho"><span class="done">Acontecimento</span>${stages.map(([k, l], i) => `<span class="${i < si ? "done" : i === si ? "cur" : ""}">${l}</span>`).join("")}</div>`;
  let body = "";
  if (h.stage === "pens") body = `<p><b>Que pensamento poderia aparecer na cabeça?</b> Escolha um. Depois dá para voltar e testar outros.</p><div class="stack-sm">${sit.pens.map((p, i) => { const n = p.reac.filter((_, r) => h.explored[`${sit.id}:${i}:${r}`]).length; return `<button class="choice" data-act="stTh" data-i="${i}"><span class="thought">“${p.t}”</span>${n ? `<span class="tag acc seen">${n}/${p.reac.length} caminhos</span>` : ""}</button>`; }).join("")}</div>
    <form class="add-row" data-form="stOwn"><label class="sr-only" for="st-own">Outro pensamento</label><input id="st-own" class="field" placeholder="Ou escreva outro pensamento possível..." maxlength="120" autocomplete="off"><button class="btn btn-ghost" type="submit">Usar este</button></form>`;
  else if (h.stage === "emo") body = `<div class="card soft"><span class="thought">“${esc(th.t)}”</span></div><p><b>Com esse pensamento, que emoções poderiam aparecer?</b> Marque quantas quiser.</p>${th.emo.length ? `<p class="small muted">As tracejadas costumam aparecer com esse pensamento, mas cada pessoa sente de um jeito.</p>` : ""}
    <div class="chips">${[...new Set([...th.emo, ...M3.emocoesTodas])].map((e) => `<button class="chip warm ${th.emo.includes(e) ? "sug" : ""} ${h.emo.includes(e) ? "on" : ""}" data-act="stEmo" data-v="${esc(e)}">${e}</button>`).join("")}</div>
    <div class="stack-sm"><label for="st-int" class="label">Intensidade: <span id="st-intv" class="count">${h.int}</span> de 10</label><input id="st-int" type="range" min="0" max="10" value="${h.int}" data-input="stInt"><div class="row between small muted"><span>fraquinha</span><span>no limite</span></div></div>
    <div class="row"><button class="btn btn-pri" data-act="stGo" data-s="reac">Avançar: Reação ${icon("arrowR", 16)}</button></div>`;
  else if (h.stage === "reac") body = `<div class="card soft stack-sm"><span class="thought">“${esc(th.t)}”</span>${h.emo.length ? `<span class="small">Emoções: ${esc(h.emo.join(", "))} · intensidade ${h.int}</span>` : ""}</div><p><b>E o que você poderia fazer?</b></p>
    ${th.reac ? `<div class="stack-sm">${th.reac.map((r, i) => `<button class="choice" data-act="stRe" data-i="${i}">${icon("arrowR", 18)}<span>${r.t}</span>${h.explored[`${sit.id}:${h.th}:${i}`] ? `<span class="tag acc seen">${icon("check", 12, 3)} explorado</span>` : ""}</button>`).join("")}</div>`
      : `<form class="stack-sm" data-form="stOwnR"><label class="sr-only" for="st-ownr">Sua reação</label><input id="st-ownr" class="field" value="${esc(h.ownR)}" placeholder="Escreva uma reação possível..." maxlength="120"><button class="btn btn-pri" type="submit" style="align-self:flex-start">Ver as consequências</button></form>`}`;
  else if (h.stage === "cons") { const r = th.reac ? th.reac[h.re] : null;
    body = `<div class="card soft stack-sm"><span class="thought">“${esc(th.t)}”</span><span class="small">${h.emo.length ? "Emoções: " + esc(h.emo.join(", ")) + " · " : ""}reação: <b>${esc(r ? r.t : h.ownR)}</b></span></div>
    ${r ? `<div class="conseq"><div class="cq1"><b>Logo depois</b>${r.logo}</div><div class="cq2"><b>Mais tarde</b>${r.depois}</div></div>`
      : `<div class="grid g2"><div class="stack-sm"><label class="label" for="st-ol">O que poderia acontecer logo depois?</label><textarea id="st-ol" class="field" data-input="stOL" style="min-height:70px">${esc(h.ownLogo)}</textarea></div><div class="stack-sm"><label class="label" for="st-od">E mais tarde?</label><textarea id="st-od" class="field" data-input="stOD" style="min-height:70px">${esc(h.ownDepois)}</textarea></div></div>`}
    <div class="note acc">${icon("route", 20)}<span>Nenhum caminho é o certo. Cada um mostra uma conexão diferente entre o que se pensa, o que se sente e o que acontece depois. Toda reação tenta resolver alguma coisa: se proteger, ser ouvida, aliviar a dor.</span></div>
    ${talk(r ? "Esse caminho parece com algo que você já viveu? O que aconteceu?" : "O que você aprendeu imaginando esse caminho?")}
    <div class="row">${th.reac ? `<button class="btn btn-ghost" data-act="stGo" data-s="reac">${icon("refresh", 16)} Testar outra reação</button>` : ""}<button class="btn btn-ghost" data-act="stGo" data-s="pens">${icon("chat", 16)} Testar outro pensamento</button><button class="btn btn-pri" data-act="stNextSit">Outra situação ${icon("arrowR", 16)}</button></div>`; }
  return `<div class="stack"><div class="row between"><div><span class="label">História interativa</span><h2 style="margin-top:4px">O que acontece depois?</h2></div><span class="small muted count">${exp} de ${total} caminhos explorados</span></div>
    <div class="chips">${M3.situacoes.map((s) => `<button class="chip ${h.sit === s.id ? "on" : ""}" data-act="stSit" data-id="${s.id}">${s.titulo}</button>`).join("")}</div>
    <div class="scene"><div class="sc-top"><span style="color:var(--pri-ink)">${icon("spark", 22)}</span><p style="font-weight:650;font-size:1.06rem">${sit.cena}</p></div><div class="sc-body">${bc}${body}</div></div></div>`;
}
const stRefresh = () => { const y = window.scrollY; $("#story").innerHTML = storyHTML(); window.scrollTo(0, y); };
A.stSit = (el) => { const h = SD(); h.sit = el.dataset.id; h.th = null; h.re = null; h.stage = "pens"; h.emo = []; h.int = 5; save(); stRefresh(); };
A.stTh = (el) => { const h = SD(); h.th = +el.dataset.i; h.stage = "emo"; h.emo = []; h.int = 5; save(); stRefresh(); };
FORMS.stOwn = () => { const v = $("#st-own").value.trim(); if (!v) return; const h = SD(); h.own = v; h.th = "own"; h.stage = "emo"; h.emo = []; h.ownR = ""; h.ownLogo = ""; h.ownDepois = ""; save(); stRefresh(); };
A.stEmo = (el) => { toggleIn(SD().emo, el.dataset.v); save(); el.classList.toggle("on"); };
INPUTS.stInt = (el) => { SD().int = +el.value; save(); $("#st-intv").textContent = el.value; };
A.stGo = (el) => { const h = SD(); h.stage = el.dataset.s; if (h.stage === "pens") { h.th = null; h.emo = []; } save(); stRefresh(); };
A.stRe = (el) => { const h = SD(); h.re = +el.dataset.i; h.stage = "cons"; h.explored[`${h.sit}:${h.th}:${h.re}`] = 1; save(); stRefresh(); };
FORMS.stOwnR = () => { const v = $("#st-ownr").value.trim(); if (!v) return; const h = SD(); h.ownR = v; h.stage = "cons"; save(); stRefresh(); };
INPUTS.stOL = (el) => { SD().ownLogo = el.value; save(); };
INPUTS.stOD = (el) => { SD().ownDepois = el.value; save(); };
A.stNextSit = () => { const h = SD(); const i = M3.situacoes.findIndex((s) => s.id === h.sit); A.stSit({ dataset: { id: M3.situacoes[(i + 1) % M3.situacoes.length].id } }); $("#story").scrollIntoView({ behavior: "smooth", block: "start" }); };
/* Conecte: emoções e estratégias */
const BR = { iv: null, to: null, n: 0 };
function m3Conecte() {
  const d = D("emocoes"); d.quero = d.quero || []; d.det = d.det || {}; const e = M3.emocoes.find((x) => x.n === d.emoSel);
  return `<div class="stack-lg"><section class="stack"><h2>Reconhecer o que sinto</h2><p class="muted prose">Toque em uma emoção para ver o aviso que ela costuma trazer e onde ela aparece no corpo.</p>
    <div class="emo-grid">${M3.emocoes.map((x) => `<button class="emo-btn ${d.emoSel === x.n ? "on" : ""}" data-act="emoSel" data-v="${x.n}">${x.n}</button>`).join("")}</div>
    <div id="emo-panel">${e ? emoPanel(e) : ""}</div></section>
    <section class="stack"><h2>Para os momentos difíceis</h2><p class="muted prose">Estratégias diferentes servem para momentos diferentes. Experimente algumas agora e marque as que quer testar na vida real.</p>
    <div class="strat-grid">${M3.estrategias.map((s) => { const w = d.quero.includes(s.n); return `<div class="strat ${w ? "want" : ""}"><h3>${s.n}</h3><p><b style="color:var(--acc-ink)">Por que funciona:</b> ${s.pq}</p>${s.how ? `<p class="small muted">Como: ${s.how}</p>` : ""}
      <div class="row" style="margin-top:auto">${s.tryit ? `<button class="btn btn-soft btn-sm" data-act="tryIt" data-k="${s.tryit}">${icon("play", 14)} Experimentar agora</button>` : ""}<button class="btn ${w ? "btn-acc" : "btn-ghost"} btn-sm" data-act="chip" data-m="emocoes" data-k="quero" data-v="${esc(s.n)}" data-re="1">${w ? icon("check", 14, 2.6) + " Quero testar" : icon("plus", 14) + " Quero testar"}</button></div></div>`; }).join("")}</div>
    <div id="tryit" style="scroll-margin-top:90px"></div>
    <div class="note warm">${icon("heart", 20)}<span>Se uma emoção difícil fica muito pesada ou dura muitos dias, conversar com a psicóloga ou com um adulto de confiança também é uma estratégia, e uma das mais importantes.</span></div></section></div>`;
}
const emoPanel = (e) => `<div class="grid g2" style="animation:pop .3s ease both"><div class="card soft stack-sm"><span class="label">O que a ${e.n.toLowerCase()} costuma avisar</span><p>${e.avisa}</p></div><div class="card acc stack-sm"><span class="label acc">Sinais no corpo</span><p>${e.corpo}</p></div></div>`;
A.emoSel = (el) => { const d = D("emocoes"); d.emoSel = el.dataset.v; save(); $$(".emo-btn").forEach((b) => b.classList.toggle("on", b.dataset.v === d.emoSel)); $("#emo-panel").innerHTML = emoPanel(M3.emocoes.find((x) => x.n === d.emoSel)); };
A.tryIt = (el) => { cleanup(); const k = el.dataset.k; const box = $("#tryit"); const d = D("emocoes");
  if (k === "breath") box.innerHTML = `<div class="card stack" style="align-items:center;text-align:center"><span class="label">Respiração lenta</span><p class="muted">Puxe o ar enquanto o círculo cresce (4 segundos) e solte devagar enquanto ele diminui (6 segundos). Seis ciclos bastam.</p><div class="breath"><div class="orb" id="orb"></div><span class="bl" id="bl">Pronta?</span></div><div class="row"><button class="btn btn-pri" data-act="brStart">${icon("play", 16)} Começar</button><button class="btn btn-ghost" data-act="brStop">Parar</button></div></div>`;
  else if (k === "ground") { d.gi = 0; save(); box.innerHTML = groundHTML(); }
  else box.innerHTML = detHTML();
  box.scrollIntoView({ behavior: "smooth", block: "start" }); };
A.brStart = () => { cleanup(); const orb = $("#orb"), bl = $("#bl"); BR.n = 0; const cycle = () => { if (!$("#orb")) return cleanup(); BR.n++; if (BR.n > 6) { cleanup(); orb.className = "orb"; bl.textContent = "Pronto. Como o corpo está agora?"; return; } orb.className = "orb in"; bl.textContent = `Puxe o ar... (${BR.n} de 6)`; BR.to = setTimeout(() => { orb.className = "orb out"; bl.textContent = `Solte devagar... (${BR.n} de 6)`; }, 4000); }; cycle(); BR.iv = setInterval(cycle, 10000); };
A.brStop = () => { cleanup(); const o = $("#orb"); if (o) o.className = "orb"; const b = $("#bl"); if (b) b.textContent = "Pausado."; };
const GROUND = [["5", "coisas que você consegue ver"], ["4", "coisas que você pode tocar"], ["3", "sons que você ouve"], ["2", "cheiros que percebe (ou de que gosta)"], ["1", "coisa boa sobre este momento"]];
function groundHTML() { const i = D("emocoes").gi || 0; if (i >= GROUND.length) return `<div class="card stack" style="text-align:center;align-items:center"><span class="label">5 · 4 · 3 · 2 · 1</span><h3>Você voltou para o agora.</h3><p class="muted">Repare se a cabeça está um pouco mais calma do que antes.</p><button class="btn btn-ghost btn-sm" data-act="tryIt" data-k="ground">${icon("refresh", 14)} Fazer de novo</button></div>`; const [n, t] = GROUND[i]; return `<div class="card stack" style="text-align:center;align-items:center"><span class="label">5 · 4 · 3 · 2 · 1</span><span style="font-family:var(--f-display);font-size:4rem;font-weight:800;line-height:1;color:var(--pri)">${n}</span><p style="font-size:1.15rem;font-weight:700">Encontre ${n} ${t}.</p><p class="small muted">Sem pressa. Pode falar em voz alta ou só pensar.</p><button class="btn btn-pri" data-act="gNext">${i < 4 ? "Próximo" : "Terminar"} ${icon("arrowR", 16)}</button></div>`; }
A.gNext = () => { const d = D("emocoes"); d.gi = (d.gi || 0) + 1; save(); $("#tryit").innerHTML = groundHTML(); };
const DETQ = [["pens", "Qual é o pensamento?", "ex.: todo mundo riu de mim"], ["fato", "Isso é um fato ou uma interpretação? Que provas eu tenho?", ""], ["outra", "Que outra explicação poderia existir?", ""], ["amiga", "O que eu diria para uma amiga que pensasse isso?", ""], ["justo", "Um pensamento mais justo seria...", ""]];
function detHTML() { const det = D("emocoes").det || {}; return `<div class="card stack"><span class="label">Detetive do pensamento</span><p class="muted small">Pense numa situação real ou em uma das histórias. Responda só o que fizer sentido.</p>${DETQ.map(([k, q, ph]) => `<div class="stack-sm"><label for="det-${k}" style="font-weight:700">${q}</label><textarea id="det-${k}" class="field" style="min-height:60px" data-input="det" data-k="${k}" placeholder="${ph}" maxlength="300">${esc(det[k] || "")}</textarea></div>`).join("")}</div>`; }
INPUTS.det = (el) => { const d = D("emocoes"); d.det = d.det || {}; d.det[el.dataset.k] = el.value; save(); };
function m3Quero() { const q = D("emocoes").quero || []; return q.length ? `<div class="card acc stack-sm"><span class="label acc">Estratégias que você quer testar</span><div class="chips">${q.map((x) => `<span class="tag acc">${esc(x)}</span>`).join("")}</div></div>` : ""; }

/* =========================================================
   CAPÍTULO FINAL — MEU CAMINHO DAQUI PRA FRENTE
   ========================================================= */
const F = () => S.fin;
function finSugTools() {
  const s = []; const a = S.m.acao && S.m.acao.d; const e = S.m.emocoes && S.m.emocoes.d;
  ((a && a.pick) || []).forEach((x) => s.push(x)); ((e && e.quero) || []).forEach((x) => s.push(x));
  if (a && a.t) M2.tools.forEach((x) => { if (a.t.tried[x.id]) s.push(x.nome); });
  return [...new Set(s)].filter((x) => !F().tools.some((t) => t.t === x));
}
const FIN_R = [
  () => { const prev = MISSIONS.map((m) => [m, S.m[m.id] && S.m[m.id].d.refl]).filter(([, r]) => r && r.trim());
    return `<h2>Olhando o caminho</h2><p class="hand">Antes de pensar no que vem, vale olhar para trás com calma.</p>
    ${prev.length ? `<div class="card stack-sm" style="background:var(--surface)"><span class="label">O que você deixou pelo caminho</span>${prev.map(([m, r]) => `<p><b>${m.titulo}:</b> <span style="font-family:var(--f-hand);font-size:1.3rem">${esc(r)}</span></p>`).join("")}</div>` : ""}
    <div class="note gold small">${icon("info", 18)}<span>Pode responder “não sei”, pode deixar em branco. Todas as respostas cabem aqui, inclusive as que não são tão boas.</span></div>
    ${FIM.perguntas.map((q) => `<div class="stack-sm"><label for="fq-${q.id}" style="font-weight:700">${q.t}</label><textarea id="fq-${q.id}" class="field" data-input="finQ" data-k="${q.id}" maxlength="800">${esc(F().q[q.id] || "")}</textarea></div>`).join("")}`; },
  () => `<h2>Três cartões</h2><p class="hand">Três lugares para guardar o que ficou de mais importante.</p><div class="trio">${FIM.cartoes.map((c) => `<div class="tcardx ${c.cls}"><h3>${c.t}</h3><label for="fc-${c.id}" class="small">${c.q}</label><textarea id="fc-${c.id}" class="field" data-input="finC" data-k="${c.id}" maxlength="400" style="min-height:130px">${esc(F().cards[c.id] || "")}</textarea></div>`).join("")}</div>`,
  () => { const sug = finSugTools(); return `<h2>Minha caixa de ferramentas</h2><p class="hand">O que eu levo comigo para os dias difíceis e para os dias comuns.</p>
    ${sug.length ? `<div class="stack-sm"><span class="label">Sugestões das suas missões</span><div class="chips">${sug.map((x) => `<button class="chip sug" data-act="finToolAdd" data-v="${esc(x)}">${icon("plus", 13)} ${esc(x)}</button>`).join("")}</div></div>` : ""}
    <form class="add-row" data-form="finTool"><label class="sr-only" for="ft-in">Nova ferramenta</label><input id="ft-in" class="field" placeholder="Outra ferramenta, pessoa, música, lugar..." maxlength="80" autocomplete="off"><button class="btn btn-pri" type="submit">${icon("plus", 16)} Guardar</button></form>
    <div class="tbx"><div class="row" style="gap:10px"><span style="color:var(--gold)">${icon("toolbox", 24)}</span><b style="font-family:var(--f-display);font-size:1.1rem">Minha caixa</b></div>${F().tools.length ? F().tools.map((t, k) => `<div class="tbx-item"><b>${esc(t.t)}</b><button class="mini" data-act="finToolDel" data-k="${k}" aria-label="Tirar da caixa">${icon("x", 14)}</button><label class="sr-only" for="ftq-${k}">Quando usar</label><input id="ftq-${k}" data-input="finToolQ" data-k="${k}" value="${esc(t.q || "")}" placeholder="Quando eu uso: ..." maxlength="100"></div>`).join("") : `<p style="color:var(--on-hero-2)">A caixa está vazia. Guarde aqui o que te ajuda.</p>`}</div>`; },
  () => `<h2>Mural de objetivos</h2><p class="hand">Até três coisas que eu gostaria de cuidar daqui pra frente.</p><div class="note small">${icon("heart", 18)}<span>Não é obrigação. Pode deixar um, dois ou nenhum, e objetivos podem mudar com o tempo.</span></div>
    <div class="postits">${F().goals.map((g, k) => `<div class="postit"><label class="label" for="fg-${k}">Objetivo ${k + 1}</label><textarea id="fg-${k}" rows="3" data-input="finG" data-k="${k}" data-f="t" maxlength="140" placeholder="Eu quero...">${esc(g.t)}</textarea><label class="small muted" for="fgp-${k}">Um primeiro passo (opcional)</label><input id="fgp-${k}" data-input="finG" data-k="${k}" data-f="passo" value="${esc(g.passo)}" maxlength="100" placeholder="ex.: falar com..."></div>`).join("")}</div>`,
  () => { const c = F().carta; return `<h2>Carta para o meu eu do futuro</h2><div class="row" style="gap:8px"><label for="fl-para" class="hand">Para mim, </label><select id="fl-para" class="field" style="width:auto" data-input="finPara">${["daqui a seis meses", "daqui a um ano", "quando eu precisar lembrar"].map((o) => `<option ${c.para === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
    <label for="fl-txt" class="sr-only">Texto da carta</label><textarea id="fl-txt" class="field hand-in" data-input="finTxt" maxlength="4000" placeholder="Querida eu do futuro, ...">${esc(c.texto)}</textarea>
    <div class="row"><button class="btn btn-pri btn-sm" data-act="finCopy">${icon("copy", 14)} Copiar a carta</button><span class="small muted">${icon("lock", 13)} A carta fica salva automaticamente neste navegador.</span></div>
    <p class="small muted">Para guardar em outro lugar, copie e cole num documento, num e-mail para você mesma ou num caderno de notas. Também dá para imprimir a partir desse documento.</p>`; },
];
VIEWS.caminho = {
  render() {
    if (isLocked("caminho")) return lockedHTML(FINAL);
    const f = F(); f.step = Math.max(0, Math.min(4, f.step || 0)); f.seen = f.seen || {}; f.seen[f.step] = 1; save();
    return `<div class="diary"><header class="stack-sm" style="text-align:center;align-items:center;margin-bottom:8px">${artSVG("book", "", "0 0 100 104").replace("<svg", '<svg style="width:84px;height:84px"')}<span class="label">Capítulo final</span><h1>${FINAL.titulo}</h1><p class="muted prose">Um espaço só seu, sem jogo, sem pontos e sem pressa. Escreva o que quiser, do jeito que quiser.</p></header>
      <nav class="moments" aria-label="Momentos do capítulo">${FIM.momentos.map((m, i) => `<button class="${i === f.step ? "on" : ""} ${f.seen[i] ? "seen" : ""}" data-act="finGo" data-i="${i}" aria-label="Momento ${i + 1}: ${m}" title="${m}">${i + 1}</button>`).join("")}</nav>
      <p class="small muted" style="text-align:center;margin-bottom:12px">Momento ${f.step + 1} de 5 · ${FIM.momentos[f.step]}</p>
      <article class="paper stack" id="paper">${FIN_R[f.step]()}</article>
      <div class="stepnav">${f.step > 0 ? `<button class="btn btn-ghost" data-act="finBy" data-d="-1">${icon("arrowL", 16)} ${FIM.momentos[f.step - 1]}</button>` : `<a class="btn btn-ghost" href="#inicio">${icon("arrowL", 16)} Mapa da jornada</a>`}
      ${f.step < 4 ? `<button class="btn btn-pri" data-act="finBy" data-d="1">${FIM.momentos[f.step + 1]} ${icon("arrowR", 16)}</button>` : `<button class="btn btn-pri" data-act="finEnd">${icon("star", 16)} Fechar o diário</button>`}</div></div>`;
  },
};
const finRefresh = () => { const y = window.scrollY; $("#paper").innerHTML = FIN_R[F().step](); window.scrollTo(0, y); };
A.finGo = (el) => { F().step = +el.dataset.i; save(); route(); };
A.finBy = (el) => { F().step += +el.dataset.d; save(); route(); };
A.finEnd = () => { F().done = true; F().at = new Date().toLocaleDateString("pt-BR"); save(); location.hash = "#fim"; };
INPUTS.finQ = (el) => { F().q[el.dataset.k] = el.value; save(); };
INPUTS.finC = (el) => { F().cards[el.dataset.k] = el.value; save(); };
A.finToolAdd = (el) => { F().tools.push({ t: el.dataset.v, q: "" }); save(); finRefresh(); };
FORMS.finTool = () => { const v = $("#ft-in").value.trim(); if (!v) return; F().tools.push({ t: v, q: "" }); save(); finRefresh(); $("#ft-in").focus(); };
A.finToolDel = (el) => { F().tools.splice(+el.dataset.k, 1); save(); finRefresh(); };
INPUTS.finToolQ = (el) => { F().tools[+el.dataset.k].q = el.value; save(); };
INPUTS.finG = (el) => { F().goals[+el.dataset.k][el.dataset.f] = el.value; save(); };
INPUTS.finPara = (el) => { F().carta.para = el.value; save(); };
INPUTS.finTxt = (el) => { F().carta.texto = el.value; save(); };
A.finCopy = () => { const c = F().carta; copyText(`Para mim, ${c.para}\n\n${c.texto}`, $("#fl-txt")); };

VIEWS.fim = {
  render() {
    const f = F(); const cards = FIM.cartoes.filter((c) => (f.cards[c.id] || "").trim()); const goals = f.goals.filter((g) => g.t.trim());
    return `<section class="ending"><svg class="sky" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${sky(40, 7)}</svg>
      <div style="position:relative;display:grid;place-items:center;margin-bottom:12px"><svg viewBox="0 0 120 60" style="width:180px;height:auto" aria-hidden="true"><g transform="translate(2 0) scale(.5)">${ART.mic("f-pri")}</g><g transform="translate(64 6) scale(.5)">${ART.skate("f-acc")}</g></svg></div>
      <h1>Toda jornada deixa descobertas.</h1><p>Você olhou para a sua mente, para as suas atitudes e para as suas emoções com curiosidade. O que você descobriu continua com você, e pode crescer, mudar e ganhar novas páginas.</p>
      <div class="row" style="justify-content:center;margin-top:22px;position:relative"><a class="btn btn-hero" href="#inicio">${icon("map", 16)} Voltar ao mapa</a><a class="btn btn-hero-ghost" href="#caminho">${icon("book", 16)} Reler o meu diário</a></div></section>
      ${cards.length || goals.length ? `<section class="stack" style="margin-top:30px">${cards.length ? `<div class="trio">${cards.map((c) => `<div class="tcardx ${c.cls}"><h3>${c.t}</h3><p style="font-family:var(--f-hand);font-size:1.35rem;line-height:1.25;overflow-wrap:anywhere">${esc(f.cards[c.id])}</p></div>`).join("")}</div>` : ""}
      ${goals.length ? `<div class="postits">${goals.map((g) => `<div class="postit"><span class="label">Objetivo</span><p style="font-family:var(--f-hand);font-size:1.35rem;line-height:1.2;overflow-wrap:anywhere">${esc(g.t)}</p>${g.passo ? `<p class="small">Primeiro passo: ${esc(g.passo)}</p>` : ""}</div>`).join("")}</div>` : ""}</section>` : ""}`;
  },
};

