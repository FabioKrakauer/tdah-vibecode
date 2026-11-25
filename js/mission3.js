/*
 * Missão 03 — Entre pensamentos e emoções (eixo: compreender e construir)
 */
(function () {
  'use strict';

  var I = Ui.icon;
  var esc = Ui.esc;

  var EMO = {
    alegria: { n: 'Alegria', body: 'Corpo leve, vontade de sorrir, de se mexer, de contar para alguém.', says: 'Algo bom ou importante está acontecendo.' },
    tristeza: { n: 'Tristeza', body: 'Peito apertado, cansaço, vontade de chorar ou de ficar quieta.', says: 'Perdi algo ou algo não saiu como eu queria. Talvez eu precise de cuidado.' },
    raiva: { n: 'Raiva', body: 'Calor no rosto, mãos ou mandíbula tensas, coração acelerado.', says: 'Algo parece injusto ou passou de um limite meu.' },
    medo: { n: 'Medo', body: 'Coração rápido, frio na barriga, vontade de fugir ou de travar.', says: 'Pode haver um perigo, real ou imaginado, e eu quero me proteger.' },
    ansiedade: { n: 'Ansiedade', body: 'Inquietação, pensamentos acelerados, aperto no estômago, dificuldade para relaxar.', says: 'Estou preocupada com algo que ainda vai acontecer.' },
    vergonha: { n: 'Vergonha', body: 'Rosto quente, vontade de se esconder, olhar para baixo.', says: 'Tenho medo de como os outros vão me ver.' },
    frustracao: { n: 'Frustração', body: 'Tensão, suspiros, vontade de largar tudo.', says: 'Eu me esforcei e não saiu como eu esperava.' },
    calma: { n: 'Calma', body: 'Respiração tranquila, ombros soltos, pensamento mais devagar.', says: 'Agora está tudo bem o suficiente.' },
    decepcao: { n: 'Decepção' },
    culpa: { n: 'Culpa' },
    esperanca: { n: 'Esperança' },
    alivio: { n: 'Alívio' },
    empolgacao: { n: 'Empolgação' }
  };
  var GRID = ['alegria', 'tristeza', 'raiva', 'medo', 'ansiedade', 'vergonha', 'frustracao', 'calma'];
  var CHIPS = ['alegria', 'tristeza', 'raiva', 'medo', 'ansiedade', 'vergonha', 'frustracao', 'decepcao', 'culpa', 'esperanca', 'alivio', 'empolgacao', 'calma'];

  /* ---------------- Entenda ---------------- */

  var TRI = {
    pensar: { t: 'Pensamento', i: 'thought', d: 'O que passa pela cabeça: frases, interpretações, imagens.', ex: '“Ninguém vai gostar da minha apresentação.”' },
    sentir: { t: 'Emoção', i: 'heart', d: 'O que sentimos, e que muitas vezes aparece no corpo.', ex: 'Frio na barriga, coração acelerado, nervosismo.' },
    agir: { t: 'Comportamento', i: 'feet', d: 'O que fazemos (ou deixamos de fazer).', ex: 'Evitar apresentar, ou falar muito rápido para acabar logo.' }
  };

  var LENSES = [
    { th: 'Ela está brava comigo.', em: 'ansiedade, tristeza', ac: 'Manda várias mensagens seguidas ou se afasta.' },
    { th: 'Ela deve estar ocupada.', em: 'calma', ac: 'Espera e segue o dia.' },
    { th: 'Será que aconteceu alguma coisa com ela?', em: 'preocupação, cuidado', ac: 'Mais tarde, pergunta se está tudo bem.' }
  ];

  var STRATS = [
    { i: 'chat', t: 'Dar nome ao que sente', d: '“Estou com raiva” já ajuda a emoção a baixar um pouco.' },
    { i: 'wind', t: 'Respirar devagar', d: 'Soltar o ar mais devagar do que puxa acalma o corpo.' },
    { i: 'feet', t: 'Mexer o corpo', d: 'Andar, alongar, patinar, dançar: o corpo também ajuda a emoção a passar.' },
    { i: 'heart', t: 'Conversar com alguém de confiança', d: 'Dividir o que sente deixa o peso mais leve.' },
    { i: 'pencil', t: 'Escrever ou gravar um áudio para si', d: 'Tirar da cabeça ajuda a enxergar melhor.' },
    { i: 'music', t: 'Ouvir ou cantar uma música', d: 'A música pode acalmar, animar ou ajudar a sentir.' },
    { i: 'question', t: 'Perguntar: existe outro jeito de ver isso?', d: 'Pensamentos são possibilidades, não fatos.' },
    { i: 'moon', t: 'Voltar ao assunto depois', d: 'Algumas conversas ficam melhores com a cabeça mais calma.' }
  ];

  var cards = [
    {
      title: 'Pensar, sentir, agir',
      icon: 'orbit',
      tone: 'rose',
      html:
        '<p class="lead">O que pensamos, o que sentimos e o que fazemos estão ligados. Um influencia o outro, nos dois sentidos.</p>' +
        '<div class="tri" data-tri>' +
        '<svg class="tri__lines" viewBox="0 0 300 220" aria-hidden="true"><path d="M150 46 L52 176 M150 46 L248 176 M60 186 H240" stroke="#c9b8ef" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round" fill="none"/></svg>' +
        Object.keys(TRI).map(function (k) {
          return '<button type="button" class="tri__node tri__node--' + k + '" data-tri-k="' + k + '" aria-pressed="false">' + I(TRI[k].i) + '<span>' + TRI[k].t + '</span></button>';
        }).join('') +
        '</div>' +
        '<div class="tri__info" data-tri-info aria-live="polite"><p class="hint">Toque em cada ponto do triângulo.</p></div>' +
        '<div class="callout callout--rose">' + I('sparkle') + '<p>Exemplo: pensar “vou errar” traz nervosismo, e o nervosismo pode fazer a gente evitar a situação. Evitar, por sua vez, reforça o pensamento de que “não dou conta”.</p></div>'
    },
    {
      title: 'A mesma situação, óculos diferentes',
      icon: 'eye',
      tone: 'rose',
      html:
        '<p class="lead">Você manda uma mensagem para uma amiga. Ela <strong>visualiza, mas não responde</strong>.</p>' +
        '<p>Experimente olhar a situação com óculos diferentes:</p>' +
        '<div class="seg seg--wrap" role="group" aria-label="Óculos">' + LENSES.map(function (l, i) {
          return '<button type="button" class="seg__btn" data-lens="' + i + '" aria-pressed="' + (i === 0) + '">Óculos ' + (i + 1) + '</button>';
        }).join('') + '</div>' +
        '<div class="chain" data-lens-view aria-live="polite"></div>' +
        '<div class="callout callout--rose">' + I('compass') + '<p><strong>Pensamentos não são fatos:</strong> são explicações possíveis. Nem sempre dá para saber qual é a verdadeira, mas lembrar que existem outras já muda como nos sentimos.</p></div>'
    },
    {
      title: 'O que estou sentindo?',
      icon: 'heart',
      tone: 'rose',
      html:
        '<p class="lead">Reconhecer uma emoção é o primeiro passo para cuidar dela. Muitas vezes, o corpo avisa antes da cabeça.</p>' +
        '<div class="emogrid" role="group" aria-label="Emoções">' + GRID.map(function (k) {
          return '<button type="button" class="emo emo--' + k + '" data-emo="' + k + '" aria-pressed="false">' + EMO[k].n + '</button>';
        }).join('') + '</div>' +
        '<div class="emo__info" data-emo-info aria-live="polite"><p class="hint">Toque em uma emoção para ver como ela pode aparecer.</p></div>' +
        '<div class="callout callout--rose">' + I('heart') + '<p>Todas as emoções são válidas e têm uma função. Às vezes sentimos várias ao mesmo tempo, ou só percebemos depois, e tudo bem. O que podemos aprender é <strong>o que fazer com elas</strong>.</p></div>'
    },
    {
      title: 'Uma pausa entre o que acontece e o que eu faço',
      icon: 'pause',
      tone: 'rose',
      html:
        '<p class="lead">Entre o acontecimento e a reação existe um espacinho. Quanto mais a gente percebe esse espaço, mais escolhas aparecem.</p>' +
        '<ol class="pausesteps">' +
        '<li>' + I('eye') + '<strong>Perceber</strong><span>“Estou sentindo algo forte.”</span></li>' +
        '<li>' + I('wind') + '<strong>Pausar</strong><span>Respirar, sair um pouco, contar até dez.</span></li>' +
        '<li>' + I('route') + '<strong>Pensar nas opções</strong><span>“O que eu poderia fazer agora?”</span></li>' +
        '<li>' + I('check') + '<strong>Escolher</strong><span>A resposta que combina com o que eu quero.</span></li>' +
        '</ol>' +
        '<div class="breath" data-breath>' +
        '<div class="breath__circle" data-breath-circle><span data-breath-label>Pronta?</span></div>' +
        '<button type="button" class="btn btn--soft btn--sm" data-breath-btn>' + I('wind') + '<span>Experimentar respirar junto</span></button>' +
        '<p class="hint">Sem pressa e sem tempo certo: só acompanhar o círculo, se quiser.</p>' +
        '</div>'
    },
    {
      title: 'Estratégias para momentos difíceis',
      icon: 'toolbox',
      tone: 'rose',
      html:
        '<p class="lead">Algumas ideias para quando a emoção fica grande:</p>' +
        '<div class="strats">' + STRATS.map(function (s) {
          return '<div class="strat">' + I(s.i) + '<h3>' + esc(s.t) + '</h3><p>' + esc(s.d) + '</p></div>';
        }).join('') + '</div>' +
        '<div class="callout callout--rose">' + I('compass') + '<p>Nem toda estratégia funciona para todo mundo, nem em toda situação. Vale experimentar e descobrir as suas.</p></div>'
    }
  ];

  cards[0].mount = function (card) {
    var info = Ui.$('[data-tri-info]', card);
    var nodes = Ui.$$('[data-tri-k]', card);
    nodes.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-tri-k');
        nodes.forEach(function (n) { n.setAttribute('aria-pressed', String(n === b)); });
        info.innerHTML = '<p class="tri__t">' + I(TRI[k].i) + TRI[k].t + '</p><p>' + TRI[k].d + '</p><p class="tri__ex">' + TRI[k].ex + '</p>';
      });
    });
  };

  cards[1].mount = function (card) {
    var view = Ui.$('[data-lens-view]', card);
    var btns = Ui.$$('[data-lens]', card);
    function show(i) {
      var l = LENSES[i];
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-lens') === i)); });
      view.innerHTML =
        '<div class="chain__item chain__item--t">' + I('thought') + '<p class="chain__k">Pensamento</p><p>“' + esc(l.th) + '”</p></div>' + I('arrowRight', 'chain__arrow') +
        '<div class="chain__item chain__item--e">' + I('heart') + '<p class="chain__k">Emoção</p><p>' + esc(l.em) + '</p></div>' + I('arrowRight', 'chain__arrow') +
        '<div class="chain__item chain__item--a">' + I('feet') + '<p class="chain__k">Reação</p><p>' + esc(l.ac) + '</p></div>';
      view.classList.remove('is-in'); void view.offsetWidth; view.classList.add('is-in');
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { show(+b.getAttribute('data-lens')); }); });
    show(0);
  };

  cards[2].mount = function (card) {
    var info = Ui.$('[data-emo-info]', card);
    var btns = Ui.$$('[data-emo]', card);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-emo');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        info.className = 'emo__info emo__info--' + k;
        info.innerHTML = '<p class="emo__name">' + EMO[k].n + '</p>' +
          '<p><span class="mini-title">' + I('feet') + 'No corpo</span>' + esc(EMO[k].body) + '</p>' +
          '<p><span class="mini-title">' + I('chat') + 'O que ela pode estar dizendo</span>' + esc(EMO[k].says) + '</p>';
      });
    });
  };

  cards[3].mount = function (card) {
    var circle = Ui.$('[data-breath-circle]', card);
    var label = Ui.$('[data-breath-label]', card);
    var btn = Ui.$('[data-breath-btn]', card);
    var running = false;
    var t = null;
    function cycle(inhale) {
      if (!running || !card.isConnected) return stop();
      circle.classList.toggle('is-in', inhale);
      label.textContent = inhale ? 'Puxa o ar devagar…' : 'Solta o ar bem devagar…';
      t = setTimeout(function () { cycle(!inhale); }, inhale ? 4000 : 6000);
    }
    function stop() {
      running = false;
      clearTimeout(t);
      circle.classList.remove('is-in');
      label.textContent = 'Pronta?';
      btn.lastChild.textContent = 'Experimentar respirar junto';
    }
    btn.addEventListener('click', function () {
      if (running) return stop();
      running = true;
      btn.lastChild.textContent = 'Parar';
      cycle(true);
    });
  };

  /* ---------------- Experimente: E se eu tentasse de outro jeito? ---------------- */

  var SCENES = [
    {
      id: 'nota', name: 'A nota', icon: 'book',
      event: 'Ela estudou para a prova de matemática. Hoje a professora entregou as notas, e a dela ficou abaixo do que esperava.',
      thoughts: [
        { t: 'Eu sou burra, não adianta estudar.', e: ['tristeza', 'frustracao', 'vergonha'], f: 'Esse pensamento é bem duro com ela mesma. Ele aparece muito quando estamos frustradas, mas uma nota fala sobre uma prova, não sobre quem a pessoa é.' },
        { t: 'Eu estudei, mas talvez não do jeito que funciona para mim.', e: ['frustracao', 'esperanca'], f: 'Esse pensamento olha para o que aconteceu sem se atacar, e abre espaço para tentar diferente.' },
        { t: 'A professora não gosta de mim.', e: ['raiva', 'tristeza'], f: 'Pode ser que algo tenha parecido injusto. Vale checar: o que mais pode ter acontecido?' }
      ],
      reactions: [
        { t: 'Guardar a prova no fundo da mochila e não olhar mais.', c: 'Na hora, traz alívio. Mas as dúvidas continuam lá, e a próxima prova pode trazer o mesmo sentimento.' },
        { t: 'Olhar as questões que errou para entender o que aconteceu.', c: 'Pode ser desconfortável, mas ajuda a descobrir se foi distração, falta de tempo ou um conteúdo que ainda não ficou claro.' },
        { t: 'Conversar com a professora ou com alguém de casa.', c: 'Dividir o peso alivia, e a outra pessoa pode ajudar a pensar num jeito diferente de estudar.' },
        { t: 'Desabafar com uma amiga e, depois, decidir o que fazer.', c: 'Acolher o que sente primeiro pode deixar a cabeça mais tranquila para decidir depois.' }
      ]
    },
    {
      id: 'foto', name: 'A foto no grupo', icon: 'phone',
      event: 'No grupo da turma, alguém manda uma foto de um passeio no fim de semana. Ela não foi chamada.',
      thoughts: [
        { t: 'Ninguém gosta de mim.', e: ['tristeza', 'vergonha'], f: 'Quando nos sentimos de fora, a mente costuma generalizar: “ninguém”, “nunca”, “sempre”. Vale perguntar: isso é verdade sobre todo mundo?' },
        { t: 'Fiquei chateada. Queria ter sido chamada.', e: ['tristeza', 'decepcao'], f: 'Esse pensamento reconhece o sentimento sem tirar conclusões sobre o que os outros pensam.' },
        { t: 'Fizeram isso de propósito para me excluir.', e: ['raiva', 'tristeza'], f: 'Pode ter acontecido, ou não. Às vezes o passeio foi combinado entre poucas pessoas, sem intenção de excluir ninguém.' }
      ],
      reactions: [
        { t: 'Mandar uma mensagem irritada no grupo.', c: 'A raiva encontra uma saída na hora. Depois, a conversa pode virar briga, e ela pode se sentir ainda pior.' },
        { t: 'Sair do grupo e se afastar de todo mundo.', c: 'Protege do incômodo agora, mas pode aumentar a sensação de ficar de fora.' },
        { t: 'Conversar em particular com uma amiga próxima sobre como se sentiu.', c: 'Falar com calma, com quem confia, aumenta a chance de ser entendida.' },
        { t: 'Dar um tempo do celular e fazer algo de que gosta.', c: 'Ajuda a emoção a baixar. Depois, ela pode decidir se quer conversar sobre isso.' }
      ]
    },
    {
      id: 'trabalho', name: 'O trabalho esquecido', icon: 'note',
      event: 'A professora pediu os trabalhos. Ela tinha esquecido completamente que era para hoje, e a professora comentou isso na frente da turma.',
      thoughts: [
        { t: 'Todo mundo deve estar me achando irresponsável.', e: ['vergonha', 'ansiedade'], f: 'A vergonha faz parecer que todo mundo está olhando. Na maioria das vezes, as pessoas esquecem rápido o que aconteceu.' },
        { t: 'Eu esqueci. Acontece. O que posso fazer agora?', e: ['frustracao', 'esperanca'], f: 'Esse pensamento reconhece o erro e já procura um caminho, sem se atacar.' },
        { t: 'Eu sempre estrago tudo.', e: ['culpa', 'tristeza'], f: '“Sempre” e “tudo” são palavras gigantes. Esqueci um trabalho, e isso é diferente de estragar tudo.' }
      ],
      reactions: [
        { t: 'Fingir que não se importa e fazer piada.', c: 'Disfarça a vergonha na hora, mas o problema do trabalho continua sem solução.' },
        { t: 'Conversar com a professora no fim da aula e perguntar se pode entregar depois.', c: 'Mostra responsabilidade e abre uma possibilidade, mesmo que a resposta seja não.' },
        { t: 'Passar o resto do dia remoendo o erro.', c: 'A mente fica presa no que deu errado e sobra pouca energia para o resto do dia.' },
        { t: 'Criar um lembrete para não esquecer da próxima vez.', c: 'Transforma o erro em informação: o que me ajudaria a lembrar da próxima vez?' }
      ]
    },
    {
      id: 'palco', name: 'Antes de subir ao palco', icon: 'mic',
      event: 'Vai ter uma apresentação de música na escola e ela vai cantar. Faltam poucos minutos, e ela está segurando o microfone.',
      thoughts: [
        { t: 'Vou errar e todo mundo vai rir.', e: ['medo', 'ansiedade'], f: 'A mente tenta prever o pior para nos proteger. Mas uma previsão não é o que vai acontecer de fato.' },
        { t: 'Estou nervosa porque isso é importante para mim.', e: ['ansiedade', 'empolgacao'], f: 'Frio na barriga e empolgação aparecem no corpo de um jeito muito parecido. Às vezes, o nervosismo é sinal de que algo importa.' },
        { t: 'Se não for perfeito, não vale a pena.', e: ['ansiedade', 'medo'], f: 'Esperar perfeição deixa tudo mais pesado. Uma apresentação pode ser bonita mesmo com pequenos erros.' }
      ],
      reactions: [
        { t: 'Desistir de última hora.', c: 'O alívio é imediato, mas a vontade de cantar fica guardada, e a próxima vez pode parecer ainda mais difícil.' },
        { t: 'Respirar devagar algumas vezes e lembrar do ensaio.', c: 'O nervosismo não some, mas fica mais fácil de carregar. Ele pode até virar energia para a apresentação.' },
        { t: 'Contar para alguém próximo que está nervosa.', c: 'Ouvir “eu também fico assim” ou “você ensaiou” pode trazer segurança.' },
        { t: 'Cantar mesmo nervosa, aceitando que pode sair diferente do ensaio.', c: 'Coragem não é não sentir medo: é fazer o que importa mesmo com ele.' }
      ]
    }
  ];

  var PH = [
    { t: 'Acontecimento', i: 'sun' },
    { t: 'Pensamentos', i: 'thought' },
    { t: 'Emoções', i: 'heart' },
    { t: 'Reações', i: 'feet' },
    { t: 'Consequências', i: 'route' }
  ];

  function story() {
    var KEY = 'm3.story';
    function fresh() { return { scene: 0, phase: 0, t: null, emo: [], r: null, paths: {} }; }

    return {
      html:
        '<section class="story" data-story>' +
        '<div class="story__scenes" role="group" aria-label="Situações" data-story-scenes></div>' +
        '<ol class="phases phases--story" data-story-phases></ol>' +
        '<div class="story__card" data-story-body aria-live="polite"></div>' +
        '<div class="story__paths" data-story-paths></div>' +
        '<p class="note">' + I('compass') + '<span>Não existe um único caminho certo. Alguns trazem alívio rápido, outros ajudam mais com o tempo, e o que funciona depende da pessoa e do momento.</span></p>' +
        '</section>',
      mount: function (root, ctx) {
        var el = Ui.$('[data-story]', root);
        var body = Ui.$('[data-story-body]', el);

        function st() { return Store.get(KEY, fresh()); }
        function save(s) { Store.set(KEY, s); }

        function setPhase(n) { var s = st(); s.phase = n; save(s); render(true); }

        function render(scroll) {
          var s = st();
          var sc = SCENES[s.scene];
          var paths = s.paths[sc.id] || [];

          Ui.$('[data-story-scenes]', el).innerHTML = SCENES.map(function (x, i) {
            var n = (s.paths[x.id] || []).length;
            return '<button type="button" class="scenetab' + (i === s.scene ? ' is-current' : '') + '" data-scene="' + i + '"' + (i === s.scene ? ' aria-current="true"' : '') + '>' +
              I(x.icon) + '<span><small>Situação ' + (i + 1) + '</small>' + x.name + '</span>' + (n ? '<em class="scenetab__n" aria-label="' + n + ' caminhos explorados">' + n + '</em>' : '') + '</button>';
          }).join('');
          Ui.$$('[data-scene]', el).forEach(function (b) {
            b.addEventListener('click', function () {
              var s2 = st(); s2.scene = +b.getAttribute('data-scene'); s2.phase = 0; s2.t = null; s2.emo = []; s2.r = null; save(s2); render();
            });
          });

          var maxPhase = s.r != null ? 4 : s.t != null ? 3 : 1;
          Ui.$('[data-story-phases]', el).innerHTML = PH.map(function (p, i) {
            var reach = i <= maxPhase;
            return '<li class="phases__item' + (i === s.phase ? ' is-current' : i < s.phase ? ' is-done' : '') + '"><button type="button" data-ph="' + i + '"' + (reach ? '' : ' disabled') + (i === s.phase ? ' aria-current="step"' : '') + '>' + I(p.i) + '<span>' + p.t + '</span></button></li>';
          }).join('');
          Ui.$$('[data-ph]', el).forEach(function (b) { b.addEventListener('click', function () { setPhase(+b.getAttribute('data-ph')); }); });

          [ph0, ph1, ph2, ph3, ph4][s.phase](s, sc);

          Ui.$('[data-story-paths]', el).innerHTML = paths.length ?
            '<p class="mini-title">' + I('route') + 'Caminhos explorados nesta situação</p><ul class="pathlist">' + paths.map(function (p, i) {
              return '<li><button type="button" class="pathchip" data-path="' + i + '"><span>' + esc(sc.thoughts[p.t].t) + '</span>' + I('arrowRight') + '<span>' + esc(sc.reactions[p.r].t) + '</span></button></li>';
            }).join('') + '</ul>' : '';
          Ui.$$('[data-path]', el).forEach(function (b) {
            b.addEventListener('click', function () {
              var s2 = st(); var p = s2.paths[sc.id][+b.getAttribute('data-path')];
              s2.t = p.t; s2.r = p.r; s2.emo = p.e.slice(); s2.phase = 4; save(s2); render(true);
            });
          });

          if (scroll) {
            var top = el.getBoundingClientRect().top;
            if (top < 0) window.scrollTo({ top: window.scrollY + top - 90, behavior: Ui.reducedMotion() ? 'auto' : 'smooth' });
          }
          body.classList.remove('is-in'); void body.offsetWidth; body.classList.add('is-in');
        }

        function ph0(s, sc) {
          body.innerHTML =
            '<div class="scene">' + Icons.sticker(sc.icon, 'rose', -6) +
            '<div><p class="eyebrow">Acontecimento</p><p class="scene__event">' + esc(sc.event) + '</p></div></div>' +
            '<div class="story__nav"><span></span><button type="button" class="btn btn--primary" data-go="1">O que pode passar pela cabeça dela?' + I('arrowRight') + '</button></div>';
          bindGo();
        }

        function ph1(s, sc) {
          var ownKey = 'm3.own.' + sc.id;
          body.innerHTML =
            '<p class="eyebrow">' + I('thought') + 'Pensamentos possíveis</p>' +
            '<p class="story__q">Diante disso, o que pode passar pela cabeça dela? Escolha um para explorar.</p>' +
            '<div class="thoughts">' + sc.thoughts.map(function (t, i) {
              return '<button type="button" class="thoughtb' + (s.t === i ? ' is-on' : '') + '" data-t="' + i + '" aria-pressed="' + (s.t === i) + '">' + esc(t.t) + '</button>';
            }).join('') + '</div>' +
            (s.t != null ? '<p class="story__fb">' + I('sparkle') + '<span>' + esc(sc.thoughts[s.t].f) + '</span></p>' : '') +
            Ui.input({ key: ownKey, label: 'Algum outro pensamento possível? (opcional)', placeholder: 'Escreva aqui, se quiser…' }) +
            '<div class="story__nav"><button type="button" class="btn btn--ghost" data-go="0">' + I('arrowLeft') + 'Acontecimento</button>' +
            '<button type="button" class="btn btn--primary" data-go="2"' + (s.t == null ? ' disabled' : '') + '>E o que ela pode sentir?' + I('arrowRight') + '</button></div>';
          Ui.$$('[data-t]', body).forEach(function (b) {
            b.addEventListener('click', function () {
              var s2 = st(); var i = +b.getAttribute('data-t');
              if (s2.t !== i) { s2.t = i; s2.emo = sc.thoughts[i].e.slice(); s2.r = null; }
              save(s2); render();
            });
          });
          Ui.bindFields(body);
          bindGo();
        }

        function ph2(s, sc) {
          var th = sc.thoughts[s.t];
          body.innerHTML =
            '<p class="eyebrow">' + I('heart') + 'Emoções</p>' +
            '<p class="story__quote">' + I('thought') + '“' + esc(th.t) + '”</p>' +
            '<p class="story__q">Com esse pensamento, estas emoções podem aparecer. Você mudaria alguma? Toque para marcar ou desmarcar.</p>' +
            '<div class="chips chips--emo">' + CHIPS.map(function (k) {
              var on = s.emo.indexOf(k) >= 0;
              return '<button type="button" class="chip chip--emo emo--' + k + '" data-e="' + k + '" aria-pressed="' + on + '">' + EMO[k].n + '</button>';
            }).join('') + '</div>' +
            '<div class="story__nav"><button type="button" class="btn btn--ghost" data-go="1">' + I('arrowLeft') + 'Pensamentos</button>' +
            '<button type="button" class="btn btn--primary" data-go="3">Como ela pode reagir?' + I('arrowRight') + '</button></div>';
          Ui.$$('[data-e]', body).forEach(function (b) {
            b.addEventListener('click', function () {
              var s2 = st(); var k = b.getAttribute('data-e'); var i = s2.emo.indexOf(k);
              if (i >= 0) s2.emo.splice(i, 1); else s2.emo.push(k);
              save(s2);
              b.setAttribute('aria-pressed', String(i < 0));
            });
          });
          bindGo();
        }

        function ph3(s, sc) {
          body.innerHTML =
            '<p class="eyebrow">' + I('feet') + 'Reações</p>' +
            '<p class="story__quote">' + I('thought') + '“' + esc(sc.thoughts[s.t].t) + '”' + (s.emo.length ? '<span class="story__emos">' + s.emo.map(function (k) { return '<span class="chip chip--static chip--emo emo--' + k + '">' + EMO[k].n + '</span>'; }).join('') + '</span>' : '') + '</p>' +
            '<p class="story__q">O que ela poderia fazer? Escolha uma possibilidade para ver aonde ela leva.</p>' +
            '<div class="reactions">' + sc.reactions.map(function (r, i) {
              return '<button type="button" class="reactb' + (s.r === i ? ' is-on' : '') + '" data-r="' + i + '">' + I('feet') + '<span>' + esc(r.t) + '</span></button>';
            }).join('') + '</div>' +
            '<div class="story__nav"><button type="button" class="btn btn--ghost" data-go="2">' + I('arrowLeft') + 'Emoções</button><span></span></div>';
          Ui.$$('[data-r]', body).forEach(function (b) {
            b.addEventListener('click', function () {
              var s2 = st(); s2.r = +b.getAttribute('data-r'); s2.phase = 4;
              var list = s2.paths[sc.id] || [];
              var exists = list.some(function (p) { return p.t === s2.t && p.r === s2.r; });
              if (!exists) list.push({ t: s2.t, r: s2.r, e: s2.emo.slice() });
              s2.paths[sc.id] = list;
              save(s2);
              render(true);
            });
          });
          bindGo();
        }

        function ph4(s, sc) {
          var th = sc.thoughts[s.t];
          var re = sc.reactions[s.r];
          var last = s.scene === SCENES.length - 1;
          body.innerHTML =
            '<p class="eyebrow">' + I('route') + 'Aonde esse caminho pode levar</p>' +
            '<div class="flow">' +
            '<div class="flow__step"><p class="chain__k">Acontecimento</p><p>' + esc(sc.event) + '</p></div>' +
            '<div class="flow__step flow__step--t"><p class="chain__k">' + I('thought') + 'Pensamento</p><p>“' + esc(th.t) + '”</p></div>' +
            '<div class="flow__step flow__step--e"><p class="chain__k">' + I('heart') + 'Emoções</p><p>' + (s.emo.length ? s.emo.map(function (k) { return EMO[k].n; }).join(', ') : 'Nenhuma marcada') + '</p></div>' +
            '<div class="flow__step flow__step--a"><p class="chain__k">' + I('feet') + 'Reação</p><p>' + esc(re.t) + '</p></div>' +
            '<div class="flow__step flow__step--c"><p class="chain__k">' + I('route') + 'O que pode acontecer</p><p>' + esc(re.c) + '</p></div>' +
            '</div>' +
            '<p class="story__q">E se ela tentasse de outro jeito?</p>' +
            '<div class="story__again">' +
            '<button type="button" class="btn btn--soft" data-again="r">' + I('feet') + 'Testar outra reação</button>' +
            '<button type="button" class="btn btn--soft" data-again="t">' + I('thought') + 'Testar outro pensamento</button>' +
            (last ? '<button type="button" class="btn btn--primary" data-next-step>Seguir para Conecte' + I('arrowRight') + '</button>'
              : '<button type="button" class="btn btn--primary" data-next-scene>Próxima situação' + I('arrowRight') + '</button>') +
            '</div>';
          Ui.$$('[data-again]', body).forEach(function (b) {
            b.addEventListener('click', function () {
              var s2 = st();
              if (b.getAttribute('data-again') === 'r') { s2.r = null; s2.phase = 3; }
              else { s2.t = null; s2.r = null; s2.emo = []; s2.phase = 1; }
              save(s2); render(true);
            });
          });
          var ns = Ui.$('[data-next-scene]', body);
          if (ns) ns.addEventListener('click', function () { var s2 = st(); s2.scene += 1; s2.phase = 0; s2.t = null; s2.r = null; s2.emo = []; save(s2); render(true); });
          var nx = Ui.$('[data-next-step]', body);
          if (nx) nx.addEventListener('click', function () { ctx.next(); });
        }

        function bindGo() {
          Ui.$$('[data-go]', body).forEach(function (b) { b.addEventListener('click', function () { setPhase(+b.getAttribute('data-go')); }); });
        }

        render();
      }
    };
  }

  /* ---------------- Missão ---------------- */

  var deck = Ui.deck('m3', cards, { endLabel: 'Ir para a atividade', tone: 'rose' });

  window.Missions = window.Missions || {};
  window.Missions.m3 = {
    id: 'm3',
    num: '03',
    eixo: 'Compreender e construir',
    title: 'Entre pensamentos e emoções',
    question: 'Como aquilo que penso e sinto influencia a maneira como ajo?',
    desc: 'Pensamentos, emoções, reações e outros caminhos possíveis.',
    icon: 'mic',
    accent: 'rose',
    sticker: 'mic',
    stickerName: 'Microfone',
    reflectionTitle: 'Nem sempre posso escolher o que acontece, mas posso aprender novas maneiras de lidar com isso.',
    conquest: {
      lead: 'Você explorou como pensamentos, emoções e reações se conectam, e testou outros caminhos possíveis.',
      items: ['Pensamentos são possibilidades, não fatos', 'O corpo avisa o que estou sentindo', 'Entre o que acontece e o que eu faço, existe uma pausa']
    },
    steps: [
      { key: 'entenda', label: 'Entenda', icon: 'book', intro: 'Como pensamentos, emoções e ações se conectam.', render: function () { return deck; } },
      { key: 'experimente', label: 'Experimente', icon: 'sparkles', intro: 'E se eu tentasse de outro jeito? Uma história com vários caminhos.', render: story },
      {
        key: 'conecte', label: 'Conecte', icon: 'pencil', intro: 'Uma reflexão breve, se fizer sentido.',
        render: function () {
          return Ui.reflection({
            key: 'm3.reflection',
            title: 'Nem sempre posso escolher o que acontece, mas posso aprender novas maneiras de lidar com isso.',
            prompt: 'Pensando nas situações que exploramos, o que você gostaria de lembrar?',
            starters: ['Percebi que…', 'Um pensamento que eu poderia questionar é…', 'Quando eu sentir… posso tentar…'],
            icon: 'mic',
            tone: 'rose'
          });
        }
      },
      { key: 'conquista', label: 'Conquista', icon: 'star', intro: '' }
    ]
  };
})();
