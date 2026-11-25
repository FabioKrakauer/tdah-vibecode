/*
 * Missão 01 — Entendendo minha mente (eixo: conhecer)
 */
(function () {
  'use strict';

  var I = Ui.icon;
  var esc = Ui.esc;

  /* ---------------- Entenda ---------------- */

  var SPOT_ITEMS = [
    { t: 'Lição de casa', x: 50, y: 52, main: true },
    { t: '3 mensagens novas', x: 18, y: 22 },
    { t: 'Barulho lá fora', x: 82, y: 20 },
    { t: 'Uma ideia de música', x: 16, y: 80 },
    { t: 'O que vou comer depois?', x: 80, y: 82 }
  ];

  var FLIPS = [
    { f: 'Começo a ler e, quando vejo, já estou pensando em outra coisa.', b: 'A atenção escapou. Acontece com todo mundo às vezes; no TDAH, costuma acontecer com mais frequência e em vários lugares.' },
    { f: 'Quero responder antes de a pessoa terminar de falar.', b: 'Vontade de agir rápido. O “freio” ainda está chegando quando a resposta já quer sair.' },
    { f: 'Começo várias coisas e é difícil terminar.', b: 'O começo é novidade e chama atenção. O meio do caminho pede mais energia para continuar.' },
    { f: 'Esperar na fila parece durar uma eternidade.', b: 'Esperar pede o freio e a atenção ao mesmo tempo. Pode ser bem cansativo.' },
    { f: 'Esqueço o que ia fazer quando mudo de lugar.', b: 'Manter uma informação na cabeça enquanto fazemos outra coisa pode ser difícil. Anotar ajuda muito.' },
    { f: 'Qualquer notificação me tira do que eu estava fazendo.', b: 'O holofote da atenção é puxado para o que aparece de novo. Diminuir as novidades por perto ajuda.' }
  ];

  var cards = [
    {
      title: 'Uma mente, muitos jeitos de funcionar',
      icon: 'orbit',
      html:
        '<p class="lead">Cada cérebro tem seu jeito de prestar atenção, se organizar e reagir. O <strong>TDAH</strong> (Transtorno de Déficit de Atenção e Hiperatividade) é o nome dado a um desses jeitos: uma forma de funcionamento do cérebro que influencia a <strong>atenção</strong>, a <strong>agitação</strong> e a maneira de lidar com <strong>impulsos</strong>.</p>' +
        '<div class="facts">' +
        '<div class="fact">' + I('sparkle') + '<p>Começa a aparecer ainda na infância e tem relação com o desenvolvimento do cérebro.</p></div>' +
        '<div class="fact">' + I('heart') + '<p>Não é preguiça, falta de caráter nem falta de inteligência.</p></div>' +
        '<div class="fact">' + I('orbit') + '<p>Aparece de um jeito diferente em cada pessoa.</p></div>' +
        '</div>' +
        '<div class="callout">' + I('compass') + '<div><p><strong>Conhecer não é se rotular.</strong> Entender o TDAH ajuda a entender alguns jeitos da mente, e isso vale para qualquer pessoa curiosa sobre si mesma.</p>' +
        '<p>Uma avaliação acontece com calma, feita por profissionais, olhando para muitas coisas. O sono, as emoções, o momento da vida e o ambiente também mexem muito com a atenção.</p></div></div>'
    },
    {
      title: 'A atenção é como um holofote',
      icon: 'eye',
      html:
        '<p class="lead">Prestar atenção é escolher para onde apontar a luz e conseguir mantê-la lá. Em algumas pessoas, esse holofote <strong>escapa com mais facilidade</strong>, principalmente em tarefas longas ou pouco interessantes.</p>' +
        '<div class="spot" data-spot>' +
        '<div class="spot__stage">' +
        SPOT_ITEMS.map(function (s, i) {
          return '<span class="spot__item' + (s.main ? ' is-main' : '') + '" style="left:' + s.x + '%;top:' + s.y + '%">' + esc(s.t) + '</span>';
        }).join('') +
        '<div class="spot__shade" aria-hidden="true"></div>' +
        '</div>' +
        '<div class="spot__controls" role="group" aria-label="Apontar o holofote para">' +
        SPOT_ITEMS.map(function (s, i) { return '<button type="button" class="chip" data-spot-go="' + i + '">' + esc(s.t) + '</button>'; }).join('') +
        '</div>' +
        '<p class="hint">Mova o holofote com o dedo ou o mouse, ou toque nos nomes. Perceba: quando uma coisa fica iluminada, as outras ficam no escuro.</p>' +
        '</div>' +
        '<div class="callout callout--aqua">' + I('sparkles') + '<p>E às vezes acontece o contrário: a luz fica <strong>presa</strong> em algo muito interessante e fica difícil tirá-la de lá. Isso tem nome: <strong>hiperfoco</strong>. Ou seja, o desafio não é “não ter atenção”, e sim <strong>regular</strong> para onde ela vai.</p></div>'
    },
    {
      title: 'O freio dos patins',
      icon: 'skate',
      tone: 'aqua',
      html:
        '<p class="lead">Quando estamos de patins, o freio existe, mas usar no momento certo exige prática. O cérebro também tem um tipo de freio: a capacidade de fazer <strong>uma pequena pausa antes de agir</strong>, falar ou responder.</p>' +
        '<p>Para algumas pessoas, esse freio demora um pouquinho mais para entrar em ação. Por isso pode ser difícil esperar a vez, não interromper ou não responder no impulso.</p>' +
        '<div class="brake" data-brake>' +
        '<p class="brake__scene">' + I('chat') + '<span>Alguém faz um comentário que incomoda.</span></p>' +
        '<div class="seg" role="group" aria-label="Escolha um caminho">' +
        '<button type="button" class="seg__btn" data-brake-opt="0" aria-pressed="false">Sem pausa</button>' +
        '<button type="button" class="seg__btn" data-brake-opt="1" aria-pressed="false">Com uma pausa</button>' +
        '</div>' +
        '<div class="brake__path" data-brake-out="0" hidden>' +
        '<span class="pill pill--rose">Responde na hora, no calor da raiva</span>' + I('arrowRight') +
        '<span class="pill">A conversa esquenta e depois bate o arrependimento</span></div>' +
        '<div class="brake__path" data-brake-out="1" hidden>' +
        '<span class="pill pill--aqua">Respira, percebe o incômodo</span>' + I('arrowRight') +
        '<span class="pill">Escolhe o que dizer, ou decide falar depois, com calma</span></div>' +
        '</div>' +
        '<div class="callout">' + I('pause') + '<p>Às vezes, temos vontade de responder ou agir imediatamente. Aprender a fazer uma pequena pausa antes de agir pode nos ajudar a escolher como queremos responder. O freio pode ser treinado, como nos patins.</p></div>'
    },
    {
      title: 'Por que algumas tarefas pesam mais?',
      icon: 'steps',
      html:
        '<p class="lead">O cérebro se engaja com mais facilidade no que é <strong>interessante, novo, urgente</strong> ou dá <strong>resultado rápido</strong>. Tarefas longas, repetitivas ou com resultado só lá na frente pedem mais energia para começar e para continuar.</p>' +
        '<div class="scale">' +
        '<div class="scale__side scale__side--light"><p class="scale__label">' + I('sparkle') + 'Mais leve para o cérebro</p>' +
        '<span class="chip chip--static">algo que eu adoro</span><span class="chip chip--static">uma novidade</span><span class="chip chip--static">o prazo é amanhã!</span><span class="chip chip--static">resultado na hora</span></div>' +
        '<div class="scale__side scale__side--heavy"><p class="scale__label">' + I('wall') + 'Mais pesado para o cérebro</p>' +
        '<span class="chip chip--static">tarefa longa</span><span class="chip chip--static">repetitiva</span><span class="chip chip--static">sem prazo claro</span><span class="chip chip--static">resultado distante</span></div>' +
        '</div>' +
        '<p>Para quem tem TDAH, essa diferença costuma ser ainda maior. Não é falta de vontade: é o jeito como o cérebro distribui energia e interesse.</p>' +
        '<div class="callout callout--aqua">' + I('bulb') + '<p>Saber disso abre espaço para truques: deixar a tarefa <strong>menor</strong>, mais <strong>clara</strong> ou mais <strong>interessante</strong>. Vamos explorar isso na Missão 02.</p></div>'
    },
    {
      title: 'Como isso pode aparecer no dia a dia',
      icon: 'sun',
      tone: 'peach',
      html:
        '<p class="lead">Toque nos cartões para virar.</p>' +
        '<div class="flips">' +
        FLIPS.map(function (f) {
          return '<button type="button" class="flip" aria-pressed="false">' +
            '<span class="flip__inner"><span class="flip__face flip__front">' + I('thought') + '<span>' + esc(f.f) + '</span></span>' +
            '<span class="flip__face flip__back">' + I('sparkle') + '<span>' + esc(f.b) + '</span></span></span></button>';
        }).join('') +
        '</div>' +
        '<div class="callout">' + I('compass') + '<p>Viver algumas dessas situações <strong>não significa ter TDAH</strong>: todo mundo passa por elas às vezes. O que os profissionais observam é a frequência, a intensidade, há quanto tempo acontece e o quanto atrapalha a vida, em diferentes lugares.</p></div>'
    },
    {
      title: 'Ninguém é só uma lista de dificuldades',
      icon: 'star',
      tone: 'gold',
      html:
        '<p class="lead">Cada pessoa é muito mais do que qualquer nome ou diagnóstico: tem gostos, talentos, uma história e um jeito único de ver o mundo.</p>' +
        '<div class="constel">' +
        ['gostos', 'talentos', 'história', 'jeito de pensar', 'sonhos', 'desafios', 'pessoas importantes'].map(function (w, i) {
          return '<span class="constel__star" style="--i:' + i + '">' + I('star') + esc(w) + '</span>';
        }).join('') +
        '</div>' +
        '<p>Duas pessoas com TDAH podem ser bem diferentes entre si. E muitas dificuldades ficam mais leves com estratégias, apoio e um ambiente que ajuda.</p>'
    }
  ];

  cards[1].mount = function (card) {
    var spot = Ui.$('[data-spot]', card);
    var stage = Ui.$('.spot__stage', spot);
    function point(px, py) {
      stage.style.setProperty('--x', px + '%');
      stage.style.setProperty('--y', py + '%');
    }
    point(SPOT_ITEMS[0].x, SPOT_ITEMS[0].y);
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      point(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
    });
    stage.addEventListener('pointerdown', function (e) {
      var r = stage.getBoundingClientRect();
      point(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
    });
    Ui.$$('[data-spot-go]', spot).forEach(function (b) {
      b.addEventListener('click', function () {
        var s = SPOT_ITEMS[+b.getAttribute('data-spot-go')];
        point(s.x, s.y);
      });
    });
  };

  cards[2].mount = function (card) {
    var btns = Ui.$$('[data-brake-opt]', card);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-brake-opt');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        Ui.$$('[data-brake-out]', card).forEach(function (o) { o.hidden = o.getAttribute('data-brake-out') !== v; });
      });
    });
  };

  cards[4].mount = function (card) {
    Ui.$$('.flip', card).forEach(function (f) {
      f.addEventListener('click', function () {
        var on = f.getAttribute('aria-pressed') !== 'true';
        f.setAttribute('aria-pressed', String(on));
        f.classList.toggle('is-flipped', on);
      });
    });
  };

  /* ---------------- Experimente: Desvendando os mitos ---------------- */

  function chips(list) {
    return '<div class="viz-chips">' + list.map(function (c) { return '<span class="chip chip--static">' + esc(c) + '</span>'; }).join('') + '</div>';
  }

  var MYTHS = [
    {
      s: 'Toda pessoa com TDAH é hiperativa.', a: false,
      t: 'Nem sempre. Algumas pessoas têm mais dificuldade com a atenção, outras com a agitação e os impulsos, e outras com as duas coisas. A agitação também pode ser “por dentro”: a mente acelerada, mesmo com o corpo parado.',
      v: chips(['mais na atenção', 'mais na agitação e nos impulsos', 'as duas coisas'])
    },
    {
      s: 'Quem tem TDAH não consegue prestar atenção em nada.', a: false,
      t: 'A questão não é falta de atenção, e sim regular para onde ela vai. Em tarefas longas ou pouco interessantes, ela escapa mais. Em algo muito interessante, pode acontecer o contrário: ficar tão concentrada que é difícil parar.',
      v: '<div class="viz-meter"><span>tarefa longa e pouco interessante</span><i style="--w:28%"></i><span>algo que eu adoro</span><i style="--w:96%"></i></div>'
    },
    {
      s: 'O TDAH pode influenciar a organização e o planejamento.', a: true,
      t: 'Sim. Organizar materiais, lembrar de prazos e dividir uma tarefa em etapas podem pedir mais esforço. Ferramentas como agenda, listas e lembretes ajudam bastante, e vamos experimentar isso na Missão 02.',
      v: chips(['agenda', 'listas', 'lembretes', 'dividir em etapas'])
    },
    {
      s: 'O TDAH é só falta de disciplina ou de força de vontade.', a: false,
      t: 'Não. O TDAH tem relação com o desenvolvimento e o funcionamento do cérebro. Esforço ajuda, mas o que mais faz diferença são estratégias e apoios que combinem com o jeito de cada pessoa.'
    },
    {
      s: 'Duas pessoas com TDAH podem ter dificuldades bem diferentes.', a: true,
      t: 'Sim! Cada pessoa tem sua história, seus gostos, seus pontos fortes e seus desafios. Uma pode se distrair muito; outra pode ter mais dificuldade para esperar.'
    },
    {
      s: 'Quem se distrai de vez em quando tem TDAH.', a: false,
      t: 'Todo mundo se distrai às vezes, principalmente com sono, cansaço, preocupação ou quando algo é chato. Uma avaliação olha para muitas coisas: quanto acontece, há quanto tempo, em quais lugares e o quanto atrapalha. Por isso ela é feita com calma, por profissionais.'
    },
    {
      s: 'O TDAH só existe na infância.', a: false,
      t: 'Ele começa na infância, mas pode continuar na adolescência e na vida adulta. Muitas vezes muda de forma: a agitação do corpo pode diminuir e as dificuldades de organização aparecerem mais.'
    },
    {
      s: 'Ter TDAH tem a ver com ser menos inteligente.', a: false,
      t: 'Não tem. Inteligência e TDAH são coisas diferentes. Pessoas com TDAH podem ser muito criativas, curiosas e talentosas.'
    },
    {
      s: 'Estratégias e apoio podem fazer diferença no dia a dia.', a: true,
      t: 'Sim. Conhecer o próprio jeito de funcionar e testar ferramentas, como dividir tarefas, usar lembretes e fazer pausas, pode deixar o dia a dia mais leve. Nem toda estratégia serve para todo mundo, por isso vale experimentar.'
    }
  ];

  var SYNTHESIS = [
    'O TDAH é um jeito de o cérebro funcionar, não preguiça nem falta de inteligência.',
    'Ele aparece de formas diferentes em cada pessoa.',
    'A atenção pode escapar ou ficar presa: o desafio é regular para onde ela vai.',
    'Distrair-se às vezes é humano. Uma avaliação olha para muito mais do que isso.',
    'Estratégias e apoio fazem diferença, e cada pessoa descobre as suas.'
  ];

  function myths() {
    var KEY = 'm1.myths';
    return {
      html: '<section class="myths" data-myths aria-live="polite"></section>',
      mount: function (root, ctx) {
        var box = Ui.$('[data-myths]', root);

        function state() { return Store.get(KEY, { i: 0, answers: {} }); }

        function render() {
          var st = state();
          if (st.i >= MYTHS.length) return renderEnd();
          var m = MYTHS[st.i];
          var ans = st.answers[st.i];
          var answered = ans === true || ans === false;
          box.innerHTML =
            '<div class="myths__top"><p class="eyebrow">' + I('sparkles') + 'Desvendando os mitos</p>' +
            '<div class="myths__dots" aria-label="Afirmação ' + (st.i + 1) + ' de ' + MYTHS.length + '">' +
            MYTHS.map(function (x, j) { return '<span class="' + (j < st.i ? 'is-seen' : j === st.i ? 'is-current' : '') + '"></span>'; }).join('') +
            '</div></div>' +
            '<article class="myth' + (answered ? ' is-answered' : '') + '">' +
            '<p class="myth__count">Afirmação ' + (st.i + 1) + ' de ' + MYTHS.length + '</p>' +
            '<p class="myth__statement">“' + esc(m.s) + '”</p>' +
            (answered ? reveal(m, ans) :
              '<p class="myth__ask">O que você acha?</p>' +
              '<div class="myth__choices">' +
              '<button type="button" class="choice choice--true" data-ans="1">' + I('check') + 'Verdade</button>' +
              '<button type="button" class="choice choice--false" data-ans="0">' + I('close') + 'Mito</button>' +
              '</div>') +
            '</article>' +
            '<div class="myths__nav">' +
            '<button type="button" class="btn btn--ghost" data-myth-prev' + (st.i === 0 ? ' disabled' : '') + '>' + I('arrowLeft') + 'Anterior</button>' +
            (answered ? '<button type="button" class="btn btn--primary" data-myth-next>' + (st.i === MYTHS.length - 1 ? 'Ver o que descobrimos' : 'Próxima afirmação') + I('arrowRight') + '</button>'
              : '<button type="button" class="btn btn--ghost" data-myth-skip>Pular por enquanto' + I('arrowRight') + '</button>') +
            '</div>';

          Ui.$$('[data-ans]', box).forEach(function (b) {
            b.addEventListener('click', function () {
              var s = state();
              s.answers[s.i] = b.getAttribute('data-ans') === '1';
              Store.set(KEY, s);
              render();
              var r = Ui.$('.myth__reveal', box);
              if (r) Ui.celebrate(r.querySelector('.myth__verdict'), 10);
            });
          });
          var prev = Ui.$('[data-myth-prev]', box);
          if (prev) prev.addEventListener('click', function () { var s = state(); s.i = Math.max(0, s.i - 1); Store.set(KEY, s); render(); });
          var next = Ui.$('[data-myth-next]', box) || Ui.$('[data-myth-skip]', box);
          next.addEventListener('click', function () { var s = state(); s.i += 1; Store.set(KEY, s); render(); });
        }

        function reveal(m, ans) {
          var match = ans === m.a;
          return '<div class="myth__reveal">' +
            '<p class="myth__verdict ' + (m.a ? 'is-true' : 'is-false') + '">' + I(m.a ? 'check' : 'close') + (m.a ? 'É verdade' : 'É mito') + '</p>' +
            '<p class="myth__you">' + (match ? 'Você percebeu isso.' : 'Muita gente pensa assim. Vale conversar sobre isso!') + '</p>' +
            '<p class="myth__text">' + esc(m.t) + '</p>' + (m.v || '') + '</div>';
        }

        function renderEnd() {
          var st = state();
          box.innerHTML =
            '<div class="myths__end">' +
            '<p class="eyebrow">' + I('sparkles') + 'O que descobrimos</p>' +
            '<h3 class="myths__end-title">Algumas ideias para levar</h3>' +
            '<ul class="synth">' + SYNTHESIS.map(function (s) { return '<li>' + I('star') + '<span>' + esc(s) + '</span></li>'; }).join('') + '</ul>' +
            '<details class="review"><summary>Rever todas as afirmações</summary><ul class="review__list">' +
            MYTHS.map(function (m, j) {
              return '<li><span class="tag ' + (m.a ? 'tag--true' : 'tag--false') + '">' + (m.a ? 'Verdade' : 'Mito') + '</span>' + esc(m.s) + '</li>';
            }).join('') + '</ul></details>' +
            '<div class="myths__nav">' +
            '<button type="button" class="btn btn--ghost" data-myth-restart>' + I('refresh') + 'Jogar de novo</button>' +
            '<button type="button" class="btn btn--primary" data-myth-go>Seguir para Conecte' + I('arrowRight') + '</button>' +
            '</div></div>';
          Ui.$('[data-myth-restart]', box).addEventListener('click', function () { Store.set(KEY, { i: 0, answers: {} }); render(); });
          Ui.$('[data-myth-go]', box).addEventListener('click', function () { ctx.next(); });
        }

        render();
      }
    };
  }

  /* ---------------- Missão ---------------- */

  var deck = Ui.deck('m1', cards, { endLabel: 'Ir para a atividade' });

  window.Missions = window.Missions || {};
  window.Missions.m1 = {
    id: 'm1',
    num: '01',
    eixo: 'Conhecer',
    title: 'Entendendo minha mente',
    question: 'Por que minha mente funciona desse jeito?',
    desc: 'Atenção, pausas, impulsos e o que é mito ou verdade sobre o TDAH.',
    icon: 'orbit',
    accent: 'lilac',
    sticker: 'star',
    stickerName: 'Estrela',
    reflectionTitle: 'Uma descoberta que levo comigo',
    conquest: {
      lead: 'Você explorou como a atenção, o freio e o interesse funcionam, e desvendou alguns mitos.',
      items: ['A atenção funciona como um holofote', 'O freio dos patins: uma pausa antes de agir', 'Mitos e verdades sobre o TDAH']
    },
    steps: [
      { key: 'entenda', label: 'Entenda', icon: 'book', intro: 'Alguns cartões para conversar. Vão no ritmo de vocês.', render: function () { return deck; } },
      { key: 'experimente', label: 'Experimente', icon: 'sparkles', intro: 'Verdade ou mito? Não é uma prova: é uma conversa.', render: myths },
      {
        key: 'conecte', label: 'Conecte', icon: 'pencil', intro: 'Um momento para guardar o que fez sentido.',
        render: function () {
          return Ui.reflection({
            key: 'm1.reflection',
            title: 'Uma descoberta que levo comigo',
            prompt: 'Teve alguma ideia, frase ou exemplo que chamou sua atenção hoje?',
            starters: ['Eu não sabia que…', 'Me identifiquei quando…', 'Fiquei pensando sobre…', 'Quero lembrar que…'],
            icon: 'star',
            tone: 'lilac'
          });
        }
      },
      { key: 'conquista', label: 'Conquista', icon: 'star', intro: '' }
    ]
  };
})();
