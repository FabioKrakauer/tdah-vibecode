/*
 * Missão 02 — Da vontade à ação (eixo: desenvolver)
 */
(function () {
  'use strict';

  var I = Ui.icon;
  var esc = Ui.esc;

  /* ---------------- Entenda ---------------- */

  var WALL_STEPS = ['Abrir o caderno', 'Ler a proposta do trabalho', 'Escrever três ideias soltas', 'Escolher uma ideia', 'Escrever o primeiro parágrafo'];
  var BOARD_START = ['Levar o livro de inglês', 'Responder a professora', 'Comprar cartolina'];
  var BOARD_NEW = ['Devolver o casaco da amiga', 'Carregar o fone', 'Pedir a autorização do passeio', 'Separar a roupa da educação física'];
  var SPLIT = ['Ver quais conteúdos vão cair', 'Separar o material', 'Ler o capítulo 1 e marcar o principal', 'Fazer um resumo curtinho', 'Fazer os exercícios', 'Anotar dúvidas e perguntar à professora'];

  var cards = [
    {
      title: 'Querer não é o mesmo que começar',
      icon: 'steps',
      tone: 'aqua',
      html:
        '<p class="lead">Saber o que precisa ser feito e querer fazer é uma parte. <strong>Conseguir começar</strong> é outra! Entre a vontade e a ação existe uma ponte: pensar no primeiro passo, ter o material à mão, decidir a hora.</p>' +
        '<p>Quando essa ponte está confusa, a tarefa parece um muro enorme.</p>' +
        '<div class="wall" data-wall>' +
        '<div class="seg" role="group" aria-label="Como olhar para a tarefa">' +
        '<button type="button" class="seg__btn" data-wall-mode="wall" aria-pressed="true">' + I('wall') + 'Ver como muro</button>' +
        '<button type="button" class="seg__btn" data-wall-mode="steps" aria-pressed="false">' + I('steps') + 'Ver como escada</button>' +
        '</div>' +
        '<div class="wall__view" data-wall-view="wall"><div class="wall__block">' + I('wall') + '<span>Fazer o trabalho de história</span></div></div>' +
        '<ol class="wall__view wall__stairs" data-wall-view="steps" hidden>' +
        WALL_STEPS.map(function (s, i) { return '<li style="--i:' + i + '"><span>' + (i + 1) + '</span>' + esc(s) + '</li>'; }).join('') +
        '</ol></div>' +
        '<div class="callout callout--aqua">' + I('bulb') + '<p>Começar fica mais fácil quando o <strong>primeiro passo é pequeno e claro</strong>. “Abrir o caderno” é muito mais fácil de começar do que “fazer o trabalho”.</p></div>'
    },
    {
      title: 'Por que a gente esquece?',
      icon: 'note',
      tone: 'aqua',
      html:
        '<p class="lead">É como ter um <strong>quadro branco na cabeça</strong>: ele guarda uma informação enquanto fazemos outra coisa. Só que ele é pequeno e apaga rápido, principalmente quando chega algo novo.</p>' +
        '<div class="board" data-board>' +
        '<div class="board__mind"><p class="board__label">' + I('thought') + 'Quadro da cabeça</p><ul class="board__list" data-board-mind></ul></div>' +
        '<div class="board__paper"><p class="board__label">' + I('note') + 'No papel</p><ul class="board__list" data-board-paper><li class="board__empty">Nada anotado ainda</li></ul></div>' +
        '<div class="board__actions">' +
        '<button type="button" class="btn btn--soft btn--sm" data-board-new>' + I('bell') + 'Chegou algo novo</button>' +
        '<button type="button" class="btn btn--soft btn--sm" data-board-write>' + I('pencil') + 'Anotar no papel</button>' +
        '<button type="button" class="btn btn--ghost btn--sm" data-board-reset>' + I('refresh') + 'Recomeçar</button>' +
        '</div></div>' +
        '<div class="callout callout--aqua">' + I('sparkle') + '<p>Por isso vale <strong>tirar as coisas da cabeça</strong>: anotar, colocar um lembrete, deixar à vista. O papel não apaga.</p></div>'
    },
    {
      title: 'Distrações e interrupções',
      icon: 'phone',
      tone: 'aqua',
      html:
        '<p class="lead">O cérebro adora novidade, e o celular, a conversa ao lado e as ideias que surgem são novidades o tempo todo. Não dá para eliminar todas as distrações, mas dá para facilitar:</p>' +
        '<ul class="tips">' +
        '<li>' + I('phone') + '<span>Deixar o celular em outro lugar, ou no modo foco, durante um tempo combinado.</span></li>' +
        '<li>' + I('folder') + '<span>Ter em cima da mesa só o material daquela tarefa.</span></li>' +
        '<li>' + I('note') + '<span>Ter um “estacionamento de ideias”: anotar o que aparece na cabeça para ver depois.</span></li>' +
        '<li>' + I('pause') + '<span>Combinar pausas curtas, antes de o cansaço chegar.</span></li>' +
        '<li>' + I('flag') + '<span>Quando for interrompida, anotar onde parou. Fica mais fácil voltar.</span></li>' +
        '</ul>'
    },
    {
      title: 'Dividir para conseguir',
      icon: 'list',
      tone: 'aqua',
      html:
        '<p class="lead">Uma tarefa grande assusta. Dividida em partes, ela cabe no dia.</p>' +
        '<div class="split" data-split>' +
        '<div class="split__big">' + I('book') + '<span>Estudar para a prova de ciências</span></div>' +
        '<ol class="split__parts" data-split-list></ol>' +
        '<div class="split__actions"><button type="button" class="btn btn--primary btn--sm" data-split-go>' + I('shuffle') + 'Dividir em partes</button>' +
        '<button type="button" class="btn btn--ghost btn--sm" data-split-reset hidden>' + I('refresh') + 'Juntar de novo</button></div>' +
        '</div>' +
        '<div class="callout callout--aqua">' + I('star') + '<p>Cada parte pode caber num pedaço do dia. E <strong>terminar uma parte já é avanço</strong>, mesmo que falte o resto.</p></div>'
    },
    {
      title: 'O que vem primeiro?',
      icon: 'target',
      tone: 'aqua',
      html:
        '<p class="lead">Quando tem muita coisa, duas perguntas ajudam: <strong>tem prazo perto?</strong> e <strong>é importante?</strong></p>' +
        '<div class="quad">' +
        '<div class="quad__cell quad__cell--1"><p class="quad__tag">Prazo perto + importante</p><p class="quad__do">Fazer primeiro</p><p class="quad__ex">Trabalho para amanhã</p></div>' +
        '<div class="quad__cell quad__cell--2"><p class="quad__tag">Importante, sem pressa</p><p class="quad__do">Planejar quando fazer</p><p class="quad__ex">Estudar para a prova da semana que vem</p></div>' +
        '<div class="quad__cell quad__cell--3"><p class="quad__tag">Prazo perto, menos importante</p><p class="quad__do">Resolver rápido ou pedir ajuda</p><p class="quad__ex">Responder o horário do grupo</p></div>' +
        '<div class="quad__cell quad__cell--4"><p class="quad__tag">Sem pressa, menos importante</p><p class="quad__do">Pode esperar</p><p class="quad__ex">Ver os vídeos novos</p></div>' +
        '</div>' +
        '<p class="hint">“Pode esperar” não é “proibido”: muitas vezes, isso vira a pausa ou a recompensa depois de uma etapa.</p>'
    },
    {
      title: 'Parar um pouquinho e mudar de caminho',
      icon: 'route',
      tone: 'aqua',
      html:
        '<p class="lead">Duas habilidades que ajudam muito no dia a dia:</p>' +
        '<div class="duo">' +
        '<div class="duo__item">' + I('pause') + '<h3>Parar um pouquinho antes de agir</h3><p>Antes de largar a tarefa pelo celular, ou de responder no impulso: respirar e perguntar “é isso que eu quero fazer agora?”.</p></div>' +
        '<div class="duo__item">' + I('route') + '<h3>Encontrar outro caminho quando algo muda</h3><p>A aula mudou de sala, o grupo desmarcou, o plano não deu certo. Ajustar no meio do caminho também é saber se organizar.</p></div>' +
        '</div>' +
        '<div class="callout callout--aqua">' + I('sparkle') + '<p>Ninguém nasce sabendo fazer isso. São habilidades que se desenvolvem com o tempo, com prática e com ferramentas.</p></div>'
    }
  ];

  cards[0].mount = function (card) {
    var btns = Ui.$$('[data-wall-mode]', card);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var mode = b.getAttribute('data-wall-mode');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        Ui.$$('[data-wall-view]', card).forEach(function (v) { v.hidden = v.getAttribute('data-wall-view') !== mode; });
      });
    });
  };

  cards[1].mount = function (card) {
    var mind = Ui.$('[data-board-mind]', card);
    var paper = Ui.$('[data-board-paper]', card);
    var items, paperItems, nextNew;
    function reset() { items = BOARD_START.slice(); paperItems = []; nextNew = 0; draw(); }
    function draw(fading) {
      mind.innerHTML = items.length ? items.map(function (t, i) {
        return '<li class="' + (fading && i === 0 ? 'is-fading' : '') + '">' + esc(t) + '</li>';
      }).join('') : '<li class="board__empty">Quadro livre</li>';
      paper.innerHTML = paperItems.length ? paperItems.map(function (t) { return '<li>' + I('check') + esc(t) + '</li>'; }).join('') : '<li class="board__empty">Nada anotado ainda</li>';
    }
    Ui.$('[data-board-new]', card).addEventListener('click', function () {
      var t = BOARD_NEW[nextNew % BOARD_NEW.length];
      nextNew++;
      items.push(t);
      if (items.length > 3) {
        draw(true);
        setTimeout(function () { items.shift(); draw(); }, Ui.reducedMotion() ? 0 : 650);
      } else draw();
    });
    Ui.$('[data-board-write]', card).addEventListener('click', function () {
      items.forEach(function (t) { if (paperItems.indexOf(t) < 0) paperItems.push(t); });
      items = [];
      draw();
    });
    Ui.$('[data-board-reset]', card).addEventListener('click', reset);
    reset();
  };

  cards[3].mount = function (card) {
    var list = Ui.$('[data-split-list]', card);
    var go = Ui.$('[data-split-go]', card);
    var rs = Ui.$('[data-split-reset]', card);
    var n = 0;
    function draw() {
      list.innerHTML = SPLIT.slice(0, n).map(function (s, i) { return '<li class="is-in"><span>' + (i + 1) + '</span>' + esc(s) + '</li>'; }).join('');
      go.hidden = n >= SPLIT.length;
      rs.hidden = n === 0;
      go.lastChild.textContent = n === 0 ? 'Dividir em partes' : 'Mais uma parte';
    }
    go.addEventListener('click', function () {
      n = n === 0 ? 2 : n + 1;
      if (n > SPLIT.length) n = SPLIT.length;
      draw();
      if (n >= SPLIT.length) Ui.celebrate(list, 12);
    });
    rs.addEventListener('click', function () { n = 0; draw(); });
    draw();
  };

  /* ---------------- Experimente: Organizando o caos ---------------- */

  var CAOS = [
    { id: 'tema', t: 'Escolher o tema com o grupo', need: true, r: -4 },
    { id: 'video', t: 'Assistir ao vídeo novo que saiu', need: false, r: 3 },
    { id: 'pesquisar', t: 'Pesquisar as informações', need: true, r: 2 },
    { id: 'roupa', t: 'Escolher a roupa da festa de sábado', need: false, r: -2 },
    { id: 'slides', t: 'Montar os slides', need: true, r: 5 },
    { id: 'dividir', t: 'Combinar quem faz cada parte', need: true, r: -3 },
    { id: 'meme', t: 'Responder o meme no grupo da turma', need: false, r: 4 },
    { id: 'ensaiar', t: 'Ensaiar a apresentação', need: true, r: -5 },
    { id: 'galeria', t: 'Organizar as fotos do celular', need: false, r: 2 },
    { id: 'material', t: 'Salvar os slides no pen drive e levar', need: true, r: -2 }
  ];
  var BY_ID = {};
  CAOS.forEach(function (c) { BY_ID[c.id] = c; });

  var DEPS = [
    ['tema', 'pesquisar', 'Pesquisar antes de escolher o tema pode ficar difícil: pesquisar sobre o quê?'],
    ['dividir', 'pesquisar', 'Combinar quem faz cada parte antes de pesquisar evita que duas pessoas façam a mesma coisa.'],
    ['pesquisar', 'slides', 'Montar os slides fica mais fácil quando a pesquisa já está pronta.'],
    ['slides', 'ensaiar', 'Para ensaiar, ajuda ter os slides prontos (ou quase).'],
    ['slides', 'material', 'Só dá para salvar no pen drive depois que os slides existirem.']
  ];

  var TWIST = [
    { id: 'essencial', t: 'Ver o que ainda falta e separar o essencial', r: 'Revisar a lista e separar o essencial do “seria legal ter”. Talvez os slides fiquem mais simples, e tudo bem.', help: true },
    { id: 'grupo', t: 'Conversar com o grupo e redividir as partes', r: 'Combinar de novo evita que alguém fique sobrecarregado, e todo mundo sabe o que fazer.', help: true },
    { id: 'prof', t: 'Perguntar à professora o que é mais importante', r: 'Saber o que mais importa ajuda a decidir onde colocar energia. Perguntar também é uma ferramenta!', help: true },
    { id: 'madrugada', t: 'Fazer tudo sozinha de madrugada', r: 'Pode até funcionar uma vez, mas cansa muito, atrapalha o sono (que ajuda a atenção) e deixa o grupo de fora. Que tal dividir?', help: false },
    { id: 'desistir', t: 'Desistir, porque o plano não serve mais', r: 'Dá vontade, né? Quando o plano muda, parece que tudo desmorona. Mas um plano é um rascunho: dá para ajustar em vez de começar do zero.', help: false }
  ];

  var PHASES = [
    { t: 'Esvaziar a cabeça', i: 'thought' },
    { t: 'Colocar em ordem', i: 'list' },
    { t: 'Imprevisto!', i: 'bell' },
    { t: 'Meu plano', i: 'flag' }
  ];

  function caos() {
    var KEY = 'm2.caos';
    function fresh() { return { phase: 0, sort: {}, order: [], twist: [], checked: false }; }

    return {
      html:
        '<section class="caos" data-caos>' +
        '<div class="caos__brief">' + Icons.sticker('mic', 'aqua', -8) +
        '<div><p class="eyebrow">Organizando o caos</p><p class="caos__situation">Na sexta-feira tem <strong>apresentação de um trabalho em grupo</strong>. Só que, na cabeça, está tudo misturado com outras coisas.</p>' +
        '<span class="pill pill--gold">' + I('calendar') + 'Prazo: sexta-feira</span></div></div>' +
        '<ol class="phases" data-caos-phases></ol>' +
        '<div class="caos__body" data-caos-body aria-live="polite"></div>' +
        '</section>',
      mount: function (root, ctx) {
        var el = Ui.$('[data-caos]', root);
        var body = Ui.$('[data-caos-body]', el);
        var phasesEl = Ui.$('[data-caos-phases]', el);
        var settled = false;

        function st() { return Store.get(KEY, fresh()); }
        function save(s) { Store.set(KEY, s); }

        function needIds(s) { return CAOS.filter(function (c) { return s.sort[c.id] === 'need'; }).map(function (c) { return c.id; }); }
        function syncOrder(s) {
          var need = needIds(s);
          s.order = s.order.filter(function (id) { return need.indexOf(id) >= 0; });
          need.forEach(function (id) { if (s.order.indexOf(id) < 0) s.order.push(id); });
        }

        function drawPhases(s) {
          phasesEl.innerHTML = PHASES.map(function (p, i) {
            return '<li class="phases__item' + (i === s.phase ? ' is-current' : i < s.phase ? ' is-done' : '') + '">' +
              '<button type="button" data-phase="' + i + '"' + (i === s.phase ? ' aria-current="step"' : '') + '>' + I(i < s.phase ? 'check' : p.i) + '<span>' + p.t + '</span></button></li>';
          }).join('');
          Ui.$$('[data-phase]', phasesEl).forEach(function (b) {
            b.addEventListener('click', function () { var s2 = st(); s2.phase = +b.getAttribute('data-phase'); save(s2); render(); });
          });
        }

        function goPhase(n) { var s = st(); s.phase = n; save(s); render(); el.scrollIntoView({ block: 'start', behavior: Ui.reducedMotion() ? 'auto' : 'smooth' }); }

        function render() {
          var s = st();
          drawPhases(s);
          [phase0, phase1, phase2, phase3][s.phase](s);
        }

        /* Fase 1 — Esvaziar a cabeça */
        function phase0(s) {
          var desk = CAOS.filter(function (c) { return !s.sort[c.id]; });
          var need = CAOS.filter(function (c) { return s.sort[c.id] === 'need'; });
          var later = CAOS.filter(function (c) { return s.sort[c.id] === 'later'; });
          function trayItem(c, where) {
            var hint = '';
            if (where === 'need' && !c.need) hint = 'Isso não ajuda na apresentação, mas pode virar uma pausa ou recompensa depois de uma etapa.';
            if (where === 'later' && c.need) hint = 'Isso faz parte da apresentação. Se ficar para depois, pode faltar na hora. Quer rever?';
            return '<li class="tray__item">' + '<span>' + esc(c.t) + '</span>' +
              '<button type="button" class="icon-btn icon-btn--sm" data-unsort="' + c.id + '" aria-label="Voltar para a mesa: ' + esc(c.t) + '">' + I('close') + '</button>' +
              (hint ? '<p class="tray__hint">' + I('sparkle') + esc(hint) + '</p>' : '') + '</li>';
          }
          body.innerHTML =
            '<p class="caos__instr">Tudo isso está passando pela cabeça ao mesmo tempo. Para cada cartão: <strong>é para a apresentação</strong> ou <strong>pode ficar para outra hora</strong>?</p>' +
            (desk.length ?
              '<div class="desk' + (settled ? ' desk--still' : '') + '">' + desk.map(function (c) {
                return '<div class="postit" style="--r:' + c.r + 'deg"><p>' + esc(c.t) + '</p>' +
                  '<div class="postit__btns"><button type="button" class="btn btn--xs btn--aqua" data-sort="' + c.id + '" data-to="need">Para a apresentação</button>' +
                  '<button type="button" class="btn btn--xs btn--ghost" data-sort="' + c.id + '" data-to="later">Outra hora</button></div></div>';
              }).join('') + '</div>'
              : '<div class="banner">' + I('sparkles') + '<div><p><strong>Mesa limpa!</strong> Agora a cabeça tem mais espaço. Separar o que é para agora do que pode esperar já é organizar.</p></div></div>') +
            '<div class="trays">' +
            '<div class="tray tray--need"><p class="tray__title">' + I('mic') + 'Para a apresentação <span class="tray__count">' + need.length + '</span></p><ul>' + need.map(function (c) { return trayItem(c, 'need'); }).join('') + '</ul></div>' +
            '<div class="tray tray--later"><p class="tray__title">' + I('moon') + 'Fica para outra hora <span class="tray__count">' + later.length + '</span></p><ul>' + later.map(function (c) { return trayItem(c, 'later'); }).join('') + '</ul></div>' +
            '</div>' +
            '<div class="caos__nav"><button type="button" class="btn btn--ghost" data-caos-reset>' + I('refresh') + 'Recomeçar o jogo</button>' +
            '<button type="button" class="btn btn--primary" data-caos-next' + (need.length ? '' : ' disabled') + '>Colocar em ordem' + I('arrowRight') + '</button></div>';

          settled = true;
          Ui.$$('[data-sort]', body).forEach(function (b) {
            b.addEventListener('click', function () {
              var s2 = st();
              s2.sort[b.getAttribute('data-sort')] = b.getAttribute('data-to');
              syncOrder(s2);
              save(s2);
              render();
            });
          });
          Ui.$$('[data-unsort]', body).forEach(function (b) {
            b.addEventListener('click', function () {
              var s2 = st();
              delete s2.sort[b.getAttribute('data-unsort')];
              syncOrder(s2);
              save(s2);
              render();
            });
          });
          bindCommon();
        }

        /* Fase 2 — Colocar em ordem */
        function phase1(s) {
          syncOrder(s);
          save(s);
          if (!s.order.length) {
            body.innerHTML = '<div class="banner">' + I('thought') + '<p>Primeiro, separe na mesa o que é para a apresentação.</p></div>' +
              '<div class="caos__nav"><button type="button" class="btn btn--primary" data-goto="0">' + I('arrowLeft') + 'Voltar para a mesa</button></div>';
            bindCommon();
            return;
          }
          body.innerHTML =
            '<p class="caos__instr">Em que ordem dá para fazer? <strong>Arraste</strong> pelos pontinhos ou use as <strong>setas</strong>. Há mais de uma ordem possível.</p>' +
            '<ol class="sortlist" data-sortlist>' + s.order.map(function (id) {
              var c = BY_ID[id];
              return '<li class="sortlist__item" data-id="' + id + '">' +
                '<span class="sortlist__handle" data-handle aria-hidden="true">' + I('grip') + '</span>' +
                '<span class="sortlist__num"></span><span class="sortlist__text">' + esc(c.t) + '</span>' +
                '<span class="sortlist__moves"><button type="button" class="icon-btn icon-btn--sm" data-move="up" aria-label="Subir: ' + esc(c.t) + '">' + I('up') + '</button>' +
                '<button type="button" class="icon-btn icon-btn--sm" data-move="down" aria-label="Descer: ' + esc(c.t) + '">' + I('down') + '</button></span></li>';
            }).join('') + '</ol>' +
            '<div class="feedback" data-feedback' + (s.checked ? '' : ' hidden') + '></div>' +
            '<div class="caos__nav"><button type="button" class="btn btn--soft" data-check>' + I('eye') + 'Olhar a sequência juntas</button>' +
            '<button type="button" class="btn btn--primary" data-caos-next>Seguir' + I('arrowRight') + '</button></div>';

          var list = Ui.$('[data-sortlist]', body);
          Ui.sortable(list, function (order) {
            var s2 = st(); s2.order = order; save(s2);
            if (s2.checked) drawFeedback();
          });
          Ui.$('[data-check]', body).addEventListener('click', function () {
            var s2 = st(); s2.checked = true; save(s2); drawFeedback();
          });
          if (s.checked) drawFeedback();
          bindCommon();
        }

        function drawFeedback() {
          var s = st();
          var fb = Ui.$('[data-feedback]', body);
          var pos = {};
          s.order.forEach(function (id, i) { pos[id] = i; });
          var issues = DEPS.filter(function (d) { return pos[d[0]] != null && pos[d[1]] != null && pos[d[0]] > pos[d[1]]; });
          fb.hidden = false;
          fb.innerHTML = issues.length
            ? '<p class="feedback__title">' + I('thought') + 'Algumas coisas para pensar</p><ul>' + issues.map(function (d) { return '<li>' + esc(d[2]) + '</li>'; }).join('') + '</ul><p class="hint">Quer mudar alguma coisa? Também dá para seguir assim e conversar sobre isso.</p>'
            : '<p class="feedback__title">' + I('sparkles') + 'A sequência faz sentido!</p><p>Cada passo prepara o próximo. Não existe só uma ordem certa: o importante é que o plano funcione para você e para o grupo.</p>';
          if (!issues.length) Ui.celebrate(fb, 12);
        }

        /* Fase 3 — Imprevisto */
        function phase2(s) {
          body.innerHTML =
            '<div class="twist">' + I('bell') + '<div><p class="twist__title">Mudança de planos!</p>' +
            '<p>A professora avisou que a apresentação foi <strong>antecipada para quinta</strong>. E uma pessoa do grupo faltou hoje.</p></div></div>' +
            '<p class="caos__instr">E agora? Explore as possibilidades. Toque em quantas quiser para ver o que pode acontecer.</p>' +
            '<div class="options">' + TWIST.map(function (o) {
              var open = s.twist.indexOf(o.id) >= 0;
              return '<div class="option' + (open ? ' is-open' : '') + (o.help ? ' is-help' : ' is-hard') + '">' +
                '<button type="button" class="option__btn" data-twist="' + o.id + '" aria-expanded="' + open + '">' + I(open ? 'check' : 'route') + '<span>' + esc(o.t) + '</span></button>' +
                '<p class="option__result"' + (open ? '' : ' hidden') + '>' + esc(o.r) + '</p></div>';
            }).join('') + '</div>' +
            '<div class="caos__nav"><button type="button" class="btn btn--ghost" data-goto="1">' + I('arrowLeft') + 'Voltar à sequência</button>' +
            '<button type="button" class="btn btn--primary" data-caos-next>Montar meu plano' + I('arrowRight') + '</button></div>';
          Ui.$$('[data-twist]', body).forEach(function (b) {
            b.addEventListener('click', function () {
              var s2 = st();
              var id = b.getAttribute('data-twist');
              var i = s2.twist.indexOf(id);
              if (i >= 0) s2.twist.splice(i, 1); else s2.twist.push(id);
              save(s2);
              render();
            });
          });
          bindCommon();
        }

        /* Fase 4 — Meu plano */
        function phase3(s) {
          syncOrder(s);
          var helps = TWIST.filter(function (o) { return o.help && s.twist.indexOf(o.id) >= 0; });
          if (!helps.length) helps = TWIST.filter(function (o) { return o.help; });
          body.innerHTML =
            '<div class="plan">' +
            '<div class="plan__paper"><p class="plan__title">' + I('flag') + 'Meu plano para a apresentação</p>' +
            (s.order.length ? '<ol class="plan__list">' + s.order.map(function (id) { return '<li>' + esc(BY_ID[id].t) + '</li>'; }).join('') + '</ol>' : '<p class="hint">Ainda não há passos. Volte à mesa para separar as tarefas.</p>') +
            '<p class="plan__sub">Se algo mudar, eu posso:</p><ul class="plan__if">' + helps.map(function (o) { return '<li>' + I('sparkle') + esc(o.t) + '</li>'; }).join('') + '</ul></div>' +
            '<div class="lessons">' +
            '<div class="lesson">' + I('thought') + '<h3>Tirar da cabeça</h3><p>Ver tudo “fora da cabeça” ajuda a separar o que é para agora.</p></div>' +
            '<div class="lesson">' + I('list') + '<h3>Colocar em ordem</h3><p>Pensar no que vem antes deixa cada passo mais fácil.</p></div>' +
            '<div class="lesson">' + I('route') + '<h3>Ajustar quando muda</h3><p>Um plano é um rascunho. Mudar no meio não é falhar.</p></div>' +
            '</div></div>' +
            '<div class="caos__nav"><button type="button" class="btn btn--ghost" data-caos-reset>' + I('refresh') + 'Jogar de novo</button>' +
            '<button type="button" class="btn btn--primary" data-caos-done>Conhecer as ferramentas de autonomia' + I('arrowRight') + '</button></div>';
          bindCommon();
          var done = Ui.$('[data-caos-done]', body);
          done.addEventListener('click', function () { ctx.next(); });
        }

        function bindCommon() {
          var next = Ui.$('[data-caos-next]', body);
          if (next) next.addEventListener('click', function () { goPhase(Math.min(3, st().phase + 1)); });
          Ui.$$('[data-goto]', body).forEach(function (b) { b.addEventListener('click', function () { goPhase(+b.getAttribute('data-goto')); }); });
          var reset = Ui.$('[data-caos-reset]', body);
          if (reset) reset.addEventListener('click', function () { save(fresh()); render(); });
        }

        render();
      }
    };
  }

  /* ---------------- Autonomia no cotidiano ---------------- */

  var TOOLS = [
    { id: 'agenda', name: 'Agenda e calendário', icon: 'calendar', how: 'Mostra a semana inteira de uma vez, para decidir quando fazer cada coisa.' },
    { id: 'lembretes', name: 'Lembretes', icon: 'bell', how: 'Lembram por você, na hora certa. O quadro da cabeça fica livre.' },
    { id: 'lista', name: 'Listas de tarefas', icon: 'list', how: 'Tiram as tarefas da cabeça e mostram o que já foi feito.' },
    { id: 'visual', name: 'Organização visual', icon: 'folder', how: 'Cores e lugares fixos fazem as coisas serem encontradas mais rápido.' },
    { id: 'etapas', name: 'Pequenas etapas', icon: 'steps', how: 'Transformam uma tarefa enorme em um próximo passo possível.' },
    { id: 'rotina', name: 'Planejar a rotina', icon: 'route', how: 'Um mapa do dia, com espaço para o que precisa e para o que você gosta.' },
    { id: 'ajuda', name: 'Pedir ajuda', icon: 'chat', how: 'Saber o que você precisa e ir atrás também é ser autônoma.' }
  ];

  var DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  var EVENTS = [
    { id: 'trab', t: 'Entregar trabalho de história', d: 1 },
    { id: 'dent', t: 'Consulta no dentista', d: 2 },
    { id: 'prova', t: 'Prova de matemática', d: 3 },
    { id: 'aniv', t: 'Aniversário de uma amiga', d: 4 },
    { id: 'gosto', t: 'Algo que eu adoro fazer', d: 5 }
  ];
  var SUBJECTS = ['Matemática', 'Português', 'Ciências', 'Inglês', 'História'];
  var COLORS = [
    { n: 'lilás', c: '#c9b8ef' }, { n: 'verde-água', c: '#a3ddd4' }, { n: 'rosa', c: '#f6cfdc' },
    { n: 'pêssego', c: '#f9d9c6' }, { n: 'dourado', c: '#e6cd8e' }, { n: 'prata', c: '#d6d9e2' }
  ];
  var BLOCKS = ['Escola', 'Almoço', 'Descanso', 'Tarefas da escola', 'Algo que eu gosto', 'Tempo com a família', 'Tempo de tela', 'Banho', 'Jantar', 'Preparar a mochila', 'Dormir'];
  var HELP_WHO = ['professora', 'alguém da família', 'uma colega', 'psicóloga'];
  var HELP_NEED = ['me explicar de novo', 'me mostrar um exemplo', 'me ajudar a organizar os passos', 'combinar mais tempo', 'só conversar sobre isso'];

  function toolDemo(id) {
    var K = 'm2.t.' + id;
    switch (id) {
      case 'agenda':
        return {
          html:
            '<div class="agenda">' +
            '<div class="agenda__loose"><p class="mini-title">' + I('thought') + 'Soltos na cabeça</p><ul data-ag-loose></ul></div>' +
            '<div class="agenda__week" data-ag-week></div>' +
            '</div>' +
            '<form class="inline-form" data-ag-form><label class="visually-hidden" for="ag-t">Novo compromisso</label><input id="ag-t" type="text" maxlength="60" placeholder="Adicionar um compromisso…">' +
            '<label class="visually-hidden" for="ag-d">Dia</label><select id="ag-d">' + DAYS.map(function (d, i) { return '<option value="' + i + '">' + d + '</option>'; }).join('') + '</select>' +
            '<button type="submit" class="btn btn--soft btn--sm">' + I('plus') + 'Adicionar</button></form>' +
            '<div class="insight" data-ag-insight hidden>' + I('bulb') + '<p>Com tudo à vista, dá para perceber o que a cabeça sozinha não mostra: a prova é na <strong>quinta</strong>, mas a <strong>quarta</strong> já tem dentista. Então vale estudar um pouco na <strong>segunda</strong> e na <strong>terça</strong>. Planejar é olhar o todo para decidir quando fazer cada coisa.</p></div>',
          mount: function (p) {
            var loose = Ui.$('[data-ag-loose]', p);
            var week = Ui.$('[data-ag-week]', p);
            function st() { return Store.get(K, { placed: [], custom: [] }); }
            function draw() {
              var s = st();
              var rest = EVENTS.filter(function (e) { return s.placed.indexOf(e.id) < 0; });
              loose.innerHTML = rest.length ? rest.map(function (e) {
                return '<li><span>' + esc(e.t) + '</span><button type="button" class="btn btn--xs btn--aqua" data-ag-place="' + e.id + '">' + I('calendar') + 'Pôr na agenda</button></li>';
              }).join('') : '<li class="board__empty">Tudo na agenda!</li>';
              week.innerHTML = DAYS.map(function (d, i) {
                var evs = EVENTS.filter(function (e) { return e.d === i && s.placed.indexOf(e.id) >= 0; }).map(function (e) { return '<li class="ev">' + esc(e.t) + '</li>'; });
                s.custom.forEach(function (c, j) { if (+c.d === i) evs.push('<li class="ev ev--mine">' + esc(c.t) + '<button type="button" class="icon-btn icon-btn--xs" data-ag-del="' + j + '" aria-label="Remover ' + esc(c.t) + '">' + I('close') + '</button></li>'); });
                return '<div class="day"><p class="day__name">' + d + '</p><ul>' + evs.join('') + '</ul></div>';
              }).join('');
              Ui.$('[data-ag-insight]', p).hidden = rest.length > 0;
              Ui.$$('[data-ag-place]', p).forEach(function (b) {
                b.addEventListener('click', function () { var s2 = st(); s2.placed.push(b.getAttribute('data-ag-place')); Store.set(K, s2); draw(); });
              });
              Ui.$$('[data-ag-del]', p).forEach(function (b) {
                b.addEventListener('click', function () { var s2 = st(); s2.custom.splice(+b.getAttribute('data-ag-del'), 1); Store.set(K, s2); draw(); });
              });
            }
            Ui.$('[data-ag-form]', p).addEventListener('submit', function (e) {
              e.preventDefault();
              var t = Ui.$('#ag-t', p).value.trim();
              if (!t) return;
              var s2 = st(); s2.custom.push({ t: t, d: Ui.$('#ag-d', p).value }); Store.set(K, s2);
              Ui.$('#ag-t', p).value = '';
              draw();
            });
            draw();
          },
          tip: 'Uma cor por tipo de compromisso (escola, casa, lazer) deixa a semana ainda mais fácil de ler.'
        };

      case 'lembretes':
        return {
          html:
            '<div class="remind">' +
            '<form class="remind__form" data-rm-form>' +
            '<label class="field__label" for="rm-t">O que você quer lembrar?</label>' +
            '<input id="rm-t" type="text" maxlength="70" placeholder="Ex.: colocar a cartolina na mochila">' +
            '<label class="field__label" for="rm-d">Quando? (simulação)</label>' +
            '<select id="rm-d"><option value="5">daqui a 5 segundos</option><option value="10">daqui a 10 segundos</option><option value="20">daqui a 20 segundos</option></select>' +
            '<button type="submit" class="btn btn--primary btn--sm">' + I('bell') + 'Criar lembrete</button>' +
            '<p class="hint" data-rm-status>Crie um lembrete e continue conversando: ele vai aparecer sozinho.</p>' +
            '</form>' +
            '<div class="phone" aria-label="Celular de exemplo"><div class="phone__screen"><p class="phone__time" data-rm-clock></p>' +
            '<div class="phone__notif" data-rm-notif hidden role="status"><span class="phone__app">' + I('bell') + 'Lembrete</span><p data-rm-text></p><button type="button" class="btn btn--xs btn--aqua" data-rm-ok>Feito!</button></div>' +
            '<p class="phone__wall">' + I('sparkle') + '</p></div></div>' +
            '</div>',
          mount: function (p) {
            var clock = Ui.$('[data-rm-clock]', p);
            function tick() { var d = new Date(); clock.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
            tick();
            Ui.$('[data-rm-form]', p).addEventListener('submit', function (e) {
              e.preventDefault();
              var t = Ui.$('#rm-t', p).value.trim() || 'Colocar a cartolina na mochila';
              var secs = +Ui.$('#rm-d', p).value;
              var status = Ui.$('[data-rm-status]', p);
              status.textContent = 'Lembrete criado. Agora a cabeça pode pensar em outra coisa…';
              setTimeout(function () {
                if (!p.isConnected) return;
                tick();
                Ui.$('[data-rm-text]', p).textContent = t;
                var n = Ui.$('[data-rm-notif]', p);
                n.hidden = false;
                n.classList.remove('is-in'); void n.offsetWidth; n.classList.add('is-in');
                status.textContent = 'Olha ele aí! O lembrete fez o trabalho de lembrar por você.';
              }, secs * 1000);
            });
            Ui.$('[data-rm-ok]', p).addEventListener('click', function (e) {
              Ui.celebrate(e.currentTarget, 10);
              Ui.$('[data-rm-notif]', p).hidden = true;
            });
          },
          tip: 'Lembrete bom é específico e chega na hora em que dá para agir: “Colocar a cartolina na mochila”, na hora de arrumar a mochila, funciona melhor que “trabalho”.'
        };

      case 'lista':
        return {
          html:
            '<div class="todo"><ul class="todo__list" data-td-list></ul>' +
            '<form class="inline-form" data-td-form><label class="visually-hidden" for="td-t">Nova tarefa</label><input id="td-t" type="text" maxlength="70" placeholder="Adicionar uma tarefa…"><button type="submit" class="btn btn--soft btn--sm">' + I('plus') + 'Adicionar</button></form>' +
            '<p class="todo__count" data-td-count></p></div>',
          mount: function (p) {
            var list = Ui.$('[data-td-list]', p);
            function st() { return Store.get(K, [{ t: 'Separar o livro de inglês', d: false }, { t: 'Responder a mensagem da professora', d: false }, { t: 'Lavar a garrafinha', d: false }]); }
            function draw() {
              var s = st();
              list.innerHTML = s.map(function (it, i) {
                return '<li class="todo__item' + (it.d ? ' is-done' : '') + '"><label><input type="checkbox" data-td-i="' + i + '"' + (it.d ? ' checked' : '') + '><span class="todo__box">' + I('check') + '</span><span class="todo__t">' + esc(it.t) + '</span></label>' +
                  '<button type="button" class="icon-btn icon-btn--xs" data-td-del="' + i + '" aria-label="Remover ' + esc(it.t) + '">' + I('close') + '</button></li>';
              }).join('') || '<li class="board__empty">Lista vazia</li>';
              var done = s.filter(function (x) { return x.d; }).length;
              Ui.$('[data-td-count]', p).textContent = s.length ? done + ' de ' + s.length + ' feitas' + (done && done === s.length ? '. Lista concluída!' : '') : '';
              Ui.$$('[data-td-i]', list).forEach(function (c) {
                c.addEventListener('change', function () {
                  var s2 = st(); var i = +c.getAttribute('data-td-i'); s2[i].d = c.checked; Store.set(K, s2);
                  if (c.checked) Ui.celebrate(c.closest('li'), 10);
                  draw();
                });
              });
              Ui.$$('[data-td-del]', list).forEach(function (b) {
                b.addEventListener('click', function () { var s2 = st(); s2.splice(+b.getAttribute('data-td-del'), 1); Store.set(K, s2); draw(); });
              });
            }
            Ui.$('[data-td-form]', p).addEventListener('submit', function (e) {
              e.preventDefault();
              var t = Ui.$('#td-t', p).value.trim(); if (!t) return;
              var s2 = st(); s2.push({ t: t, d: false }); Store.set(K, s2); Ui.$('#td-t', p).value = ''; draw();
            });
            draw();
          },
          tip: 'Uma lista boa é curta (o que cabe hoje) e começa com algo rápido, para pegar ritmo.'
        };

      case 'visual':
        return {
          html:
            '<div class="seg" role="group" aria-label="Antes e depois"><button type="button" class="seg__btn" data-vs="0" aria-pressed="true">Antes</button><button type="button" class="seg__btn" data-vs="1" aria-pressed="false">Depois</button></div>' +
            '<div class="mess" data-vs-view="0">' + SUBJECTS.concat(['Estojo', 'Carregador', 'Bilhete da escola']).map(function (s, i) {
              return '<span class="mess__item" style="--r:' + ((i * 37) % 30 - 15) + 'deg;--x:' + ((i * 53) % 70 + 5) + '%;--y:' + ((i * 29) % 60 + 10) + '%">' + esc(s) + '</span>';
            }).join('') + '<p class="mess__caption">Onde está o caderno de ciências?</p></div>' +
            '<div class="shelf" data-vs-view="1" hidden><p class="hint">Toque numa pasta para trocar a cor.</p><div class="shelf__row" data-vs-shelf></div></div>',
          mount: function (p) {
            var btns = Ui.$$('[data-vs]', p);
            btns.forEach(function (b) {
              b.addEventListener('click', function () {
                btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
                Ui.$$('[data-vs-view]', p).forEach(function (v) { v.hidden = v.getAttribute('data-vs-view') !== b.getAttribute('data-vs'); });
              });
            });
            var shelf = Ui.$('[data-vs-shelf]', p);
            function st() { return Store.get(K, [0, 1, 2, 3, 4]); }
            function draw() {
              var s = st();
              shelf.innerHTML = SUBJECTS.map(function (sub, i) {
                var c = COLORS[s[i] % COLORS.length];
                return '<button type="button" class="folder" style="--c:' + c.c + '" data-vs-i="' + i + '" aria-label="' + esc(sub) + ', pasta ' + c.n + '. Trocar cor">' + I('folder') + '<span>' + esc(sub) + '</span></button>';
              }).join('');
              Ui.$$('[data-vs-i]', shelf).forEach(function (b) {
                b.addEventListener('click', function () { var s2 = st(); var i = +b.getAttribute('data-vs-i'); s2[i] = (s2[i] + 1) % COLORS.length; Store.set(K, s2); draw(); Ui.$('[data-vs-i="' + i + '"]', shelf).focus(); });
              });
            }
            draw();
          },
          tip: 'Use a mesma cor da pasta na agenda e no caderno. E tenha um lugar fixo para o que sempre some: chave, fone, carregador.'
        };

      case 'etapas':
        return {
          html:
            '<div class="stepsdemo">' + Ui.input({ key: K + '.task', label: 'Uma tarefa que parece grande', placeholder: 'Ex.: arrumar meu quarto' }) +
            '<ol class="stepsdemo__list" data-st-list></ol>' +
            '<form class="inline-form" data-st-form><label class="visually-hidden" for="st-t">Nova etapa</label><input id="st-t" type="text" maxlength="70" placeholder="Adicionar uma etapa pequena…"><button type="submit" class="btn btn--soft btn--sm">' + I('plus') + 'Adicionar</button></form>' +
            '<p class="stepsdemo__now" data-st-now></p></div>',
          mount: function (p) {
            var list = Ui.$('[data-st-list]', p);
            if (!Store.get(K + '.task', '')) Store.set(K + '.task', 'Arrumar meu quarto');
            Ui.$('input[data-bind]', p).value = Store.get(K + '.task', '');
            function st() { return Store.get(K + '.steps', [{ t: 'Recolher as roupas do chão', d: false }, { t: 'Guardar o material da escola', d: false }, { t: 'Arrumar a cama', d: false }]); }
            function draw() {
              var s = st();
              var firstOpen = -1;
              s.forEach(function (x, i) { if (firstOpen < 0 && !x.d) firstOpen = i; });
              list.innerHTML = s.map(function (it, i) {
                return '<li class="todo__item' + (it.d ? ' is-done' : '') + (i === firstOpen ? ' is-now' : '') + '"><label><input type="checkbox" data-st-i="' + i + '"' + (it.d ? ' checked' : '') + '><span class="todo__box">' + I('check') + '</span><span class="todo__t">' + esc(it.t) + '</span></label>' +
                  (i === firstOpen ? '<span class="pill pill--gold pill--xs">agora</span>' : '') +
                  '<button type="button" class="icon-btn icon-btn--xs" data-st-del="' + i + '" aria-label="Remover ' + esc(it.t) + '">' + I('close') + '</button></li>';
              }).join('');
              Ui.$('[data-st-now]', p).innerHTML = firstOpen >= 0
                ? I('sparkle') + '<span>Não precisa pensar em tudo. <strong>Só no próximo passo:</strong> ' + esc(s[firstOpen].t) + '.</span>'
                : (s.length ? I('star') + '<span>Todas as etapas feitas!</span>' : '');
              Ui.$$('[data-st-i]', list).forEach(function (c) {
                c.addEventListener('change', function () { var s2 = st(); s2[+c.getAttribute('data-st-i')].d = c.checked; Store.set(K + '.steps', s2); if (c.checked) Ui.celebrate(c.closest('li'), 10); draw(); });
              });
              Ui.$$('[data-st-del]', list).forEach(function (b) {
                b.addEventListener('click', function () { var s2 = st(); s2.splice(+b.getAttribute('data-st-del'), 1); Store.set(K + '.steps', s2); draw(); });
              });
            }
            Ui.$('[data-st-form]', p).addEventListener('submit', function (e) {
              e.preventDefault();
              var t = Ui.$('#st-t', p).value.trim(); if (!t) return;
              var s2 = st(); s2.push({ t: t, d: false }); Store.set(K + '.steps', s2); Ui.$('#st-t', p).value = ''; draw();
            });
            draw();
          },
          tip: 'Uma boa etapa começa com um verbo e dá para fazer em poucos minutos: “separar”, “abrir”, “escrever uma frase”.'
        };

      case 'rotina':
        return {
          html:
            '<div class="routine"><div class="routine__pool"><p class="mini-title">' + I('plus') + 'Blocos para o dia</p><div class="routine__chips" data-rt-pool></div></div>' +
            '<div class="routine__day"><p class="mini-title">' + I('sun') + 'Meu dia</p><ol class="sortlist sortlist--compact" data-rt-list></ol></div></div>' +
            '<p class="insight" data-rt-tip hidden></p>',
          mount: function (p) {
            var pool = Ui.$('[data-rt-pool]', p);
            var list = Ui.$('[data-rt-list]', p);
            var DEF = ['Escola', 'Almoço', 'Descanso', 'Tarefas da escola', 'Algo que eu gosto', 'Jantar', 'Preparar a mochila', 'Dormir'];
            function st() { return Store.get(K, DEF.slice()); }
            function draw() {
              var s = st();
              pool.innerHTML = BLOCKS.map(function (b) { return '<button type="button" class="chip" data-rt-add="' + esc(b) + '">' + I('plus') + esc(b) + '</button>'; }).join('');
              list.innerHTML = s.map(function (b, i) {
                return '<li class="sortlist__item" data-id="' + i + '"><span class="sortlist__handle" data-handle aria-hidden="true">' + I('grip') + '</span><span class="sortlist__text">' + esc(b) + '</span>' +
                  '<span class="sortlist__moves"><button type="button" class="icon-btn icon-btn--sm" data-move="up" aria-label="Subir: ' + esc(b) + '">' + I('up') + '</button><button type="button" class="icon-btn icon-btn--sm" data-move="down" aria-label="Descer: ' + esc(b) + '">' + I('down') + '</button>' +
                  '<button type="button" class="icon-btn icon-btn--sm" data-rt-del="' + i + '" aria-label="Remover: ' + esc(b) + '">' + I('close') + '</button></span></li>';
              }).join('');
              var tip = Ui.$('[data-rt-tip]', p);
              var hasRest = s.some(function (b) { return b === 'Descanso' || b === 'Algo que eu gosto'; });
              tip.hidden = false;
              tip.innerHTML = hasRest
                ? I('bulb') + '<span>Uma rotina é um mapa do dia, não uma prisão: tem espaço para descanso, para o que você gosta e para ajustes quando algo muda.</span>'
                : I('heart') + '<span>Que tal incluir uma pausa ou algo de que você gosta? Descansar também faz parte do plano.</span>';
              Ui.$$('[data-rt-add]', pool).forEach(function (b) {
                b.addEventListener('click', function () { var s2 = st(); s2.push(b.getAttribute('data-rt-add')); Store.set(K, s2); draw(); });
              });
              Ui.$$('[data-rt-del]', list).forEach(function (b) {
                b.addEventListener('click', function () { var s2 = st(); s2.splice(+b.getAttribute('data-rt-del'), 1); Store.set(K, s2); draw(); });
              });
            }
            Ui.sortable(list, function (order) {
              var s = st();
              Store.set(K, order.map(function (i) { return s[+i]; }));
              draw();
            });
            draw();
          },
          tip: 'Rotinas funcionam melhor quando são realistas. Se algo nunca acontece no horário planejado, o plano é que precisa mudar, não você.'
        };

      case 'ajuda':
        return {
          html:
            '<div class="helpb">' +
            '<div class="helpb__form">' +
            '<p class="field__label">Com quem?</p><div class="chips" data-hp-who>' + HELP_WHO.map(function (w) { return '<button type="button" class="chip" data-v="' + esc(w) + '" aria-pressed="false">' + esc(w) + '</button>'; }).join('') + '</div>' +
            Ui.input({ key: K + '.task', label: 'O que eu estava fazendo', placeholder: 'Ex.: os exercícios de frações' }) +
            Ui.input({ key: K + '.tried', label: 'O que eu já tentei', placeholder: 'Ex.: reler a explicação do livro' }) +
            Ui.input({ key: K + '.stuck', label: 'Onde eu travei', placeholder: 'Ex.: na parte de somar frações diferentes' }) +
            '<p class="field__label">O que eu preciso</p><div class="chips" data-hp-need>' + HELP_NEED.map(function (w) { return '<button type="button" class="chip" data-v="' + esc(w) + '" aria-pressed="false">' + esc(w) + '</button>'; }).join('') + '</div>' +
            '</div>' +
            '<div class="helpb__preview"><p class="mini-title">' + I('chat') + 'Como pode ficar</p><div class="bubble" data-hp-msg aria-live="polite"></div></div>' +
            '</div>',
          mount: function (p) {
            function st() { return Store.get(K + '.sel', { who: '', need: '' }); }
            function draw() {
              var s = st();
              Ui.$$('[data-hp-who] .chip', p).forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-v') === s.who)); });
              Ui.$$('[data-hp-need] .chip', p).forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-v') === s.need)); });
              function v(k, ph) { var x = Store.get(K + '.' + k, '').trim(); return x ? '<strong>' + esc(x) + '</strong>' : '<span class="ph">' + ph + '</span>'; }
              var who = s.who ? '<strong>' + esc(s.who) + '</strong>' : '<span class="ph">…</span>';
              var need = s.need ? '<strong>' + esc(s.need) + '</strong>' : '<span class="ph">…</span>';
              Ui.$('[data-hp-msg]', p).innerHTML = 'Oi, ' + who + '! Eu estava fazendo ' + v('task', 'a tarefa') + ' e já tentei ' + v('tried', 'algumas coisas') + ', mas travei ' + v('stuck', 'em uma parte') + '. Você poderia ' + need + '?';
            }
            ['who', 'need'].forEach(function (k) {
              Ui.$$('[data-hp-' + k + '] .chip', p).forEach(function (c) {
                c.addEventListener('click', function () { var s = st(); s[k] = s[k] === c.getAttribute('data-v') ? '' : c.getAttribute('data-v'); Store.set(K + '.sel', s); draw(); });
              });
            });
            Ui.$$('input[data-bind]', p).forEach(function (i) { i.addEventListener('input', function () { setTimeout(draw, 0); }); });
            draw();
          },
          tip: 'Quando você conta o que já tentou e onde travou, a outra pessoa entende rápido como ajudar, e você continua no comando da sua tarefa.'
        };
    }
    return { html: '', mount: function () {} };
  }

  function autonomy() {
    var KEY = 'm2.tool';
    return {
      html:
        '<section class="auto">' +
        '<div class="quote">' + Icons.sticker('skate', 'aqua', -8) +
        '<blockquote><p>Ser independente não significa fazer tudo sozinha. Significa aprender a encontrar maneiras de conduzir suas próprias atividades, utilizando os recursos e apoios de que precisa.</p></blockquote></div>' +
        '<p class="auto__lead">Autonomia é conduzir as próprias atividades: reconhecer responsabilidades, desenvolver recursos e <strong>pedir ajuda quando precisar</strong>. Cada ferramenta abaixo pode ser testada aqui mesmo. Toque e experimente.</p>' +
        '<div class="toolbar" role="tablist" aria-label="Ferramentas">' + TOOLS.map(function (t) {
          return '<button type="button" role="tab" class="tooltab" id="tab-' + t.id + '" data-tool="' + t.id + '" aria-selected="false" aria-controls="tool-panel">' + I(t.icon) + '<span>' + t.name + '</span></button>';
        }).join('') + '</div>' +
        '<div class="toolpanel" id="tool-panel" role="tabpanel" data-tool-panel></div>' +
        '</section>',
      mount: function (root, ctx) {
        var panel = Ui.$('[data-tool-panel]', root);
        var tabs = Ui.$$('[data-tool]', root);
        function open(id, focus) {
          Store.set(KEY, id);
          var seen = Store.get('m2.toolsSeen', []);
          if (seen.indexOf(id) < 0) { seen.push(id); Store.set('m2.toolsSeen', seen); }
          tabs.forEach(function (t) {
            var on = t.getAttribute('data-tool') === id;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            t.classList.toggle('is-seen', seen.indexOf(t.getAttribute('data-tool')) >= 0);
          });
          var tool = TOOLS.filter(function (t) { return t.id === id; })[0];
          var demo = toolDemo(id);
          panel.setAttribute('aria-labelledby', 'tab-' + id);
          panel.innerHTML =
            '<header class="toolpanel__head">' + Icons.sticker(tool.icon, 'aqua', 0) + '<div><h2 class="toolpanel__title">' + tool.name + '</h2><p class="toolpanel__how">' + tool.how + '</p></div></header>' +
            '<div class="toolpanel__demo">' + demo.html + '</div>' +
            (demo.tip ? '<p class="tip">' + I('bulb') + '<span><strong>Dica:</strong> ' + demo.tip + '</span></p>' : '') +
            '<div class="toolpanel__foot">' + nextToolBtn(id) + '</div>';
          Ui.bindFields(panel);
          demo.mount(panel);
          var nb = Ui.$('[data-next-tool]', panel);
          if (nb) nb.addEventListener('click', function () { open(nb.getAttribute('data-next-tool'), true); panel.scrollIntoView({ block: 'nearest' }); });
          var go = Ui.$('[data-auto-done]', panel);
          if (go) go.addEventListener('click', function () { ctx.next(); });
          if (focus) Ui.$('#tab-' + id, root).focus();
        }
        function nextToolBtn(id) {
          var i = TOOLS.map(function (t) { return t.id; }).indexOf(id);
          return i < TOOLS.length - 1
            ? '<button type="button" class="btn btn--soft btn--sm" data-next-tool="' + TOOLS[i + 1].id + '">Próxima ferramenta: ' + TOOLS[i + 1].name + I('arrowRight') + '</button>'
            : '<button type="button" class="btn btn--primary btn--sm" data-auto-done>Seguir para Conecte' + I('arrowRight') + '</button>';
        }
        tabs.forEach(function (t, i) {
          t.addEventListener('click', function () { open(t.getAttribute('data-tool')); });
          t.addEventListener('keydown', function (e) {
            var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
            if (!d) return;
            e.preventDefault();
            open(TOOLS[(i + d + TOOLS.length) % TOOLS.length].id, true);
          });
        });
        open(Store.get(KEY, 'agenda'));
      }
    };
  }

  /* ---------------- Conecte ---------------- */

  function connect() {
    var KEY = 'm2.toolPick';
    return Ui.reflection({
      key: 'm2.reflection',
      title: 'Uma ferramenta que posso levar para o meu dia',
      prompt: 'Tem alguma estratégia que você gostaria de experimentar ou continuar usando? Se quiser, marque e conte como poderia ser.',
      starters: ['Vou testar…', 'Um momento em que isso pode ajudar é…', 'Para lembrar disso, posso…'],
      icon: 'toolbox',
      tone: 'aqua',
      before: '<div class="chips chips--tools" role="group" aria-label="Ferramentas">' + TOOLS.map(function (t) {
        return '<button type="button" class="chip chip--tool" data-pick="' + t.id + '" aria-pressed="false">' + I(t.icon) + t.name + '</button>';
      }).join('') + '</div>',
      mount: function (root) {
        function draw() {
          var s = Store.get(KEY, []);
          Ui.$$('[data-pick]', root).forEach(function (c) { c.setAttribute('aria-pressed', String(s.indexOf(c.getAttribute('data-pick')) >= 0)); });
        }
        Ui.$$('[data-pick]', root).forEach(function (c) {
          c.addEventListener('click', function () {
            var s = Store.get(KEY, []);
            var id = c.getAttribute('data-pick');
            var i = s.indexOf(id);
            if (i >= 0) s.splice(i, 1); else s.push(id);
            Store.set(KEY, s);
            draw();
          });
        });
        draw();
      }
    });
  }

  /* ---------------- Missão ---------------- */

  var deck = Ui.deck('m2', cards, { endLabel: 'Ir para a atividade', tone: 'aqua' });

  window.M2Tools = TOOLS;
  window.Missions = window.Missions || {};
  window.Missions.m2 = {
    id: 'm2',
    num: '02',
    eixo: 'Desenvolver',
    title: 'Da vontade à ação',
    question: 'Por que às vezes eu sei o que preciso fazer, quero fazer, mas não consigo começar?',
    desc: 'Começar, lembrar, organizar e dividir tarefas, e ferramentas de autonomia.',
    icon: 'skate',
    accent: 'aqua',
    sticker: 'skate',
    stickerName: 'Patins',
    reflectionTitle: 'Uma ferramenta que posso levar para o meu dia',
    conquest: {
      lead: 'Você organizou o caos, lidou com um imprevisto e testou ferramentas que podem ajudar no dia a dia.',
      items: ['Primeiro passo pequeno e claro', 'Tirar da cabeça, colocar em ordem, ajustar quando muda', 'Autonomia também é saber pedir apoio']
    },
    steps: [
      { key: 'entenda', label: 'Entenda', icon: 'book', intro: 'Por que começar, lembrar e organizar às vezes é tão difícil?', render: function () { return deck; } },
      { key: 'experimente', label: 'Experimente', icon: 'sparkles', intro: 'Um pequeno jogo de organização. Não existe jeito perfeito de jogar.', render: caos },
      { key: 'autonomia', label: 'Autonomia', icon: 'toolbox', intro: 'Ferramentas para testar, na prática.', render: autonomy },
      { key: 'conecte', label: 'Conecte', icon: 'pencil', intro: 'O que dessa missão pode ir com você?', render: connect },
      { key: 'conquista', label: 'Conquista', icon: 'star', intro: '' }
    ]
  };
})();
