/*
 * Capítulo final — Meu caminho daqui pra frente
 * Espaço de conversa e fechamento: sem pontuação, sem tempo, sem desafios.
 */
(function () {
  'use strict';

  var I = Ui.icon;
  var esc = Ui.esc;

  var Q_PATH = [
    'Quando penso em como eu estava no começo do ano, o que me vem à cabeça?',
    'O que mudou na minha maneira de enxergar algumas situações?',
    'Teve alguma coisa que descobri sobre mim durante esse período?',
    'Qual momento das nossas conversas ou atividades ficou marcado para mim?',
    'Existe algo que hoje consigo compreender melhor do que antes?'
  ];
  var Q_SPACE = [
    'Como foi para mim estar nesse espaço durante este ano?',
    'O que me ajudou nas nossas conversas?',
    'Existiu algo de que eu não gostei ou que foi difícil?',
    'Tem alguma coisa que eu gostaria que fosse diferente no próximo ano?',
    'Existe algo que eu gostaria de conversar e que ainda não tivemos oportunidade?'
  ];

  var DISCOVER = [
    { k: 'mente', t: 'Minha mente', i: 'orbit', tone: 'lilac', q: 'O que aprendi sobre meu jeito de prestar atenção, pensar, aprender e realizar tarefas?', from: 'm1.reflection', fromLabel: 'Na Missão 01 você guardou' },
    { k: 'atitudes', t: 'Minhas atitudes', i: 'skate', tone: 'aqua', q: 'O que descobri sobre organização, autonomia e maneiras de enfrentar minhas responsabilidades?', from: 'm2.reflection', fromLabel: 'Na Missão 02 você guardou' },
    { k: 'emocoes', t: 'Minhas emoções', i: 'mic', tone: 'rose', q: 'O que aprendi sobre meus sentimentos, pensamentos e minhas reações?', from: 'm3.reflection', fromLabel: 'Na Missão 03 você guardou' }
  ];

  var TOOLS = [
    { id: 'agenda', t: 'Agenda e calendário', i: 'calendar' },
    { id: 'lembretes', t: 'Lembretes', i: 'bell' },
    { id: 'listas', t: 'Listas de tarefas', i: 'list' },
    { id: 'etapas', t: 'Dividir em etapas', i: 'steps' },
    { id: 'visual', t: 'Organização visual', i: 'folder' },
    { id: 'pausas', t: 'Pausas', i: 'pause' },
    { id: 'emocoes', t: 'Estratégias para lidar com emoções', i: 'heart' },
    { id: 'ajuda', t: 'Pedir ajuda quando necessário', i: 'chat' }
  ];
  var TAGS = [
    { id: 'ajuda', t: 'pode me ajudar' },
    { id: 'funcionou', t: 'já experimentei e funcionou' },
    { id: 'aprender', t: 'quero aprender a usar' }
  ];
  var TOOL_Q = [
    'Qual dessas ferramentas pode me ajudar no dia a dia?',
    'O que já experimentei e funcionou?',
    'O que ainda quero aprender a utilizar?',
    'Quando posso precisar de ajuda?'
  ];

  var GOAL_Q = [
    'O que gostaria de aprender ou desenvolver?',
    'Existe alguma dificuldade que gostaria de enfrentar de uma maneira diferente?',
    'Em que aspecto gostaria de ter mais autonomia?',
    'O que gostaria de fazer mais por conta própria?',
    'Que tipo de apoio acredito que pode me ajudar nesse caminho?'
  ];

  var LETTER = [
    'Uma coisa que quero lembrar sobre mim é…',
    'Quando eu encontrar uma dificuldade, quero tentar…',
    'No próximo ano, espero…',
    'Quero me lembrar de que…',
    'Uma coisa que tenho orgulho de ter vivido ou conquistado é…'
  ];

  var PAGES = [
    { t: 'Abertura', i: 'book' },
    { t: 'Olhando para o caminho que percorri', i: 'route', n: '01' },
    { t: 'O que descobri sobre mim?', i: 'sparkles', n: '02' },
    { t: 'Minha caixa de ferramentas', i: 'toolbox', n: '03' },
    { t: 'O que quero construir no próximo ano?', i: 'flag', n: '04' },
    { t: 'Uma mensagem para o meu eu do futuro', i: 'envelope', n: '05' },
    { t: 'Toda jornada deixa descobertas', i: 'star' }
  ];

  /* ---------------- Páginas ---------------- */

  function opening() {
    return {
      html:
        '<div class="fc-open">' +
        '<div class="fc-open__art">' + Art.constellation(doneFlags()) + '</div>' +
        '<p class="fc-eyebrow">Capítulo final</p>' +
        '<h1 class="fc-title">Meu caminho daqui pra frente</h1>' +
        '<div class="fc-letter">' +
        '<p>Chegamos ao final da nossa jornada por aqui! Durante esse caminho, descobrimos algumas coisas sobre como sua mente funciona, conversamos sobre desafios, conhecemos estratégias e exploramos diferentes maneiras de lidar com situações do cotidiano.</p>' +
        '<p>Agora é hora de olhar para tudo isso, perceber o que ficou e pensar nos caminhos que você ainda quer construir.</p>' +
        '<p>Não precisamos ter todas as respostas. O importante é reconhecer que sempre podemos aprender algo novo sobre nós mesmos.</p>' +
        '</div>' +
        '<button type="button" class="btn btn--paper btn--lg" data-fc-next>' + I('book') + 'Abrir o caderno</button>' +
        '</div>'
    };
  }

  function qCard(group, i, q) {
    var base = 'final.m1.' + group + i;
    var talked = Store.get(base + '.talked', false);
    var note = Store.get(base + '.note', '');
    return '<li class="qcard' + (talked ? ' is-talked' : '') + '" style="--r:' + ((i % 2 ? 1 : -1) * (0.4 + i * 0.15)) + 'deg">' +
      '<p class="qcard__q">' + esc(q) + '</p>' +
      '<div class="qcard__actions">' +
      '<button type="button" class="qbtn" data-talk="' + base + '" aria-pressed="' + talked + '">' + I('star') + '<span>' + (talked ? 'Conversamos sobre isso' : 'Marcar como conversada') + '</span></button>' +
      '<button type="button" class="qbtn" data-note="' + base + '" aria-expanded="' + (!!note) + '">' + I('pencil') + '<span>Anotar</span></button>' +
      '</div>' +
      '<div class="qcard__note"' + (note ? '' : ' hidden') + '>' + Ui.field({ key: base + '.note', rows: 2, placeholder: 'Uma anotação, se quiser…', aria: 'Anotação: ' + q }) + '</div>' +
      '</li>';
  }

  function moment1() {
    return {
      html:
        intro('01', 'Olhando para o caminho que percorri', 'Escolham as perguntas que fizerem sentido para hoje. Não é preciso responder todas, e qualquer resposta é bem-vinda: o que foi bom, o que foi difícil, o que incomodou e o que ainda falta.') +
        '<section class="fc-group"><h2 class="fc-h2">' + I('route') + 'Meu percurso</h2><ul class="qcards">' + Q_PATH.map(function (q, i) { return qCard('p', i, q); }).join('') + '</ul></section>' +
        '<section class="fc-group"><h2 class="fc-h2">' + I('chat') + 'O nosso espaço</h2><p class="fc-small">Aqui vale falar com sinceridade. Saber o que ajudou e o que não ajudou faz o próximo ano ser melhor.</p><ul class="qcards">' + Q_SPACE.map(function (q, i) { return qCard('s', i, q); }).join('') + '</ul></section>',
      mount: function (root) {
        Ui.$$('[data-talk]', root).forEach(function (b) {
          b.addEventListener('click', function () {
            var k = b.getAttribute('data-talk') + '.talked';
            var on = !Store.get(k, false);
            Store.set(k, on);
            b.setAttribute('aria-pressed', String(on));
            b.querySelector('span').textContent = on ? 'Conversamos sobre isso' : 'Marcar como conversada';
            b.closest('.qcard').classList.toggle('is-talked', on);
            if (on) Ui.celebrate(b, 8);
          });
        });
        Ui.$$('[data-note]', root).forEach(function (b) {
          b.addEventListener('click', function () {
            var box = b.closest('.qcard').querySelector('.qcard__note');
            box.hidden = !box.hidden;
            b.setAttribute('aria-expanded', String(!box.hidden));
            if (!box.hidden) { var ta = box.querySelector('textarea'); Ui.autosize(ta); ta.focus(); }
          });
        });
      }
    };
  }

  function moment2() {
    return {
      html:
        intro('02', 'O que descobri sobre mim?', 'Três cartões para retomar o que ficou das missões. Escreva do seu jeito, com suas palavras.') +
        '<div class="discover">' + DISCOVER.map(function (d) {
          var prev = Store.get(d.from, '').trim();
          return '<article class="dcard dcard--' + d.tone + '">' +
            '<header class="dcard__head">' + Icons.sticker(d.i, d.tone, -5) + '<h2 class="dcard__title">' + d.t + '</h2></header>' +
            '<p class="dcard__q">' + d.q + '</p>' +
            (prev ? '<details class="dcard__prev"><summary>' + I('sparkle') + d.fromLabel + '</summary><p>' + Ui.paras(prev) + '</p></details>' : '') +
            Ui.field({ key: 'final.m2.' + d.k, rows: 4, placeholder: 'Minhas descobertas…', aria: d.t, cls: 'field--lined' }) +
            '</article>';
        }).join('') + '</div>'
    };
  }

  function moment3() {
    return {
      html:
        intro('03', 'Minha caixa de ferramentas', 'Um repertório pessoal de possibilidades, não uma lista de obrigações. Marque o que fizer sentido.') +
        '<div class="tbox">' +
        '<div class="tbox__art">' + Art.toolbox() + '</div>' +
        '<ul class="tools">' + TOOLS.map(function (t) { return toolItem(t, false); }).join('') + '</ul>' +
        '<ul class="tools" data-custom-tools></ul>' +
        '<form class="inline-form inline-form--paper" data-add-tool><label class="visually-hidden" for="new-tool">Uma ferramenta minha</label><input id="new-tool" type="text" maxlength="60" placeholder="Uma ferramenta que é só minha…"><button type="submit" class="btn btn--paper btn--sm">' + I('plus') + 'Adicionar</button></form>' +
        '</div>' +
        '<section class="fc-group"><h2 class="fc-h2">' + I('pencil') + 'Para conversar</h2><div class="fc-fields">' +
        TOOL_Q.map(function (q, i) { return Ui.field({ key: 'final.m3.q' + i, label: q, rows: 2, cls: 'field--lined' }); }).join('') +
        '</div></section>',
      mount: function (root) {
        function tags() { return Store.get('final.m3.tags', {}); }
        function bindTags(scope) {
          Ui.$$('[data-tag]', scope).forEach(function (b) {
            b.addEventListener('click', function () {
              var all = tags();
              var tool = b.getAttribute('data-tool');
              var tag = b.getAttribute('data-tag');
              var list = all[tool] || [];
              var i = list.indexOf(tag);
              if (i >= 0) list.splice(i, 1); else list.push(tag);
              all[tool] = list;
              Store.set('final.m3.tags', all);
              b.setAttribute('aria-pressed', String(i < 0));
              b.closest('.tool').classList.toggle('is-picked', list.length > 0);
            });
          });
        }
        var custom = Ui.$('[data-custom-tools]', root);
        function drawCustom() {
          var list = Store.get('final.m3.custom', []);
          custom.innerHTML = list.map(function (t, i) { return toolItem({ id: 'c' + i, t: t, i: 'sparkle' }, true); }).join('');
          bindTags(custom);
          Ui.$$('[data-del-tool]', custom).forEach(function (b) {
            b.addEventListener('click', function () {
              var l = Store.get('final.m3.custom', []);
              var idx = +b.getAttribute('data-del-tool');
              l.splice(idx, 1);
              Store.set('final.m3.custom', l);
              // reindexa as marcações das ferramentas próprias
              var all = tags();
              var next = {};
              Object.keys(all).forEach(function (k) {
                if (k.charAt(0) !== 'c') { next[k] = all[k]; return; }
                var n = +k.slice(1);
                if (n < idx) next[k] = all[k];
                else if (n > idx) next['c' + (n - 1)] = all[k];
              });
              Store.set('final.m3.tags', next);
              drawCustom();
            });
          });
        }
        bindTags(Ui.$('.tools', root));
        drawCustom();
        Ui.$('[data-add-tool]', root).addEventListener('submit', function (e) {
          e.preventDefault();
          var inp = Ui.$('#new-tool', root);
          var v = inp.value.trim();
          if (!v) return;
          var l = Store.get('final.m3.custom', []);
          l.push(v);
          Store.set('final.m3.custom', l);
          inp.value = '';
          drawCustom();
        });
      }
    };
  }

  function toolItem(t, custom) {
    var on = Store.get('final.m3.tags', {})[t.id] || [];
    return '<li class="tool' + (on.length ? ' is-picked' : '') + '">' +
      '<p class="tool__name">' + I(t.i) + '<span>' + esc(t.t) + '</span>' +
      (custom ? '<button type="button" class="icon-btn icon-btn--xs" data-del-tool="' + t.id.slice(1) + '" aria-label="Remover ' + esc(t.t) + '">' + I('close') + '</button>' : '') + '</p>' +
      '<div class="tool__tags" role="group" aria-label="' + esc(t.t) + '">' + TAGS.map(function (g) {
        return '<button type="button" class="tagbtn" data-tool="' + t.id + '" data-tag="' + g.id + '" aria-pressed="' + (on.indexOf(g.id) >= 0) + '">' + g.t + '</button>';
      }).join('') + '</div></li>';
  }

  function moment4() {
    var count = Math.max(1, Store.get('final.m4.count', 1));
    return {
      html:
        intro('04', 'O que quero construir no próximo ano?', 'Um mural de direções possíveis. Não são metas obrigatórias nem compromissos: elas podem mudar no caminho, e tudo bem.') +
        '<details class="fc-prompts" open><summary>' + I('question') + 'Perguntas para pensar</summary><ul>' + GOAL_Q.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul></details>' +
        '<div class="mural">' + [0, 1, 2].map(function (i) {
          return '<article class="pin pin--' + i + '" data-goal="' + i + '"' + (i < count ? '' : ' hidden') + '>' +
            '<span class="pin__dot" aria-hidden="true"></span>' +
            '<p class="pin__n">Direção ' + (i + 1) + '</p>' +
            Ui.field({ key: 'final.m4.g' + i + '.text', rows: 3, placeholder: 'O que eu gostaria de construir…', aria: 'Direção ' + (i + 1) }) +
            Ui.field({ key: 'final.m4.g' + i + '.support', rows: 2, label: 'Um apoio que pode me ajudar', placeholder: 'Pessoas, ferramentas, combinados…', cls: 'field--small' }) +
            '</article>';
        }).join('') +
        '<button type="button" class="pin pin--add" data-add-goal' + (count >= 3 ? ' hidden' : '') + '>' + I('plus') + '<span>Adicionar outra direção</span></button>' +
        '</div>',
      mount: function (root) {
        var add = Ui.$('[data-add-goal]', root);
        add.addEventListener('click', function () {
          var c = Math.min(3, Math.max(1, Store.get('final.m4.count', 1)) + 1);
          Store.set('final.m4.count', c);
          var el = Ui.$('[data-goal="' + (c - 1) + '"]', root);
          el.hidden = false;
          Ui.$$('textarea', el).forEach(Ui.autosize);
          el.querySelector('textarea').focus();
          add.hidden = c >= 3;
        });
      }
    };
  }

  function moment5() {
    return {
      html:
        intro('05', 'Uma mensagem para o meu eu do futuro', 'Uma carta para guardar. Complete as frases que quiser, ou escreva livremente.') +
        '<article class="letter" data-letter>' +
        '<p class="letter__date">' + esc(Ui.today()) + '</p>' +
        '<p class="letter__hello">Para mim, no futuro,</p>' +
        LETTER.map(function (s, i) {
          return '<div class="letter__line"><p class="letter__start" id="lt-' + i + '">' + esc(s) + '</p>' +
            Ui.field({ key: 'final.m5.s' + i, rows: 1, placeholder: '…', aria: s, cls: 'field--letter' }) + '</div>';
        }).join('') +
        '<div class="letter__line"><p class="letter__start">E também quero dizer…</p>' + Ui.field({ key: 'final.m5.free', rows: 3, placeholder: 'Escreva livremente…', aria: 'Escrita livre', cls: 'field--letter' }) + '</div>' +
        '<p class="letter__sign">Com carinho, <span>eu</span> ' + I('heart') + '</p>' +
        '</article>' +
        '<div class="fc-actions">' +
        '<button type="button" class="btn btn--paper" data-print-letter>' + I('print') + 'Imprimir ou salvar em PDF</button>' +
        '<button type="button" class="btn btn--ghost" data-save-letter>' + I('download') + 'Baixar a carta (.txt)</button>' +
        '</div>',
      mount: function (root) {
        Ui.$('[data-print-letter]', root).addEventListener('click', function () { Ui.print(letterHtml()); });
        Ui.$('[data-save-letter]', root).addEventListener('click', function () { Ui.download('carta-para-o-meu-eu-do-futuro.txt', letterText()); });
      }
    };
  }

  function closing() {
    return {
      html:
        '<div class="fc-end">' +
        '<div class="fc-end__art">' + Art.constellation(doneFlags(true)) + '</div>' +
        '<h1 class="fc-title fc-title--end">Toda jornada deixa descobertas.</h1>' +
        '<div class="fc-end__msg">' +
        '<p>Conhecer a si mesma é um processo que continua. Algumas coisas levam tempo, outras mudam, mas sempre existem novos caminhos para experimentar.</p>' +
        '<p>Leve com você o que fez sentido, respeite seu próprio ritmo e lembre-se: não existe um jeito certo de ser, aprender ou crescer. Existe a sua história, com tudo o que faz parte dela.</p>' +
        '<p class="fc-end__last">E é muito especial construir um pedacinho dessa história com você. 💜</p>' +
        '</div>' +
        '<div class="fc-actions fc-actions--center">' +
        '<a class="btn btn--paper" href="#/registros">' + I('book') + 'Ver todos os registros</a>' +
        '<a class="btn btn--ghost" href="#/mapa">' + I('map') + 'Voltar ao mapa</a>' +
        '</div></div>',
      mount: function (root) {
        if (Store.status('final') !== 'done') {
          Store.complete('final');
          setTimeout(function () { var a = Ui.$('.fc-end__art', root); if (a && a.isConnected) Ui.celebrate(a, 30); }, 500);
        }
      }
    };
  }

  function intro(n, title, text) {
    return '<header class="fc-intro"><p class="fc-eyebrow">Momento ' + n + '</p><h1 class="fc-title">' + title + '</h1><p class="fc-lead">' + text + '</p></header>';
  }

  function doneFlags(finalDone) {
    return ['m1', 'm2', 'm3', 'final'].map(function (id) { return Store.status(id) === 'done' || (id === 'final' && !!finalDone); });
  }

  /* ---------------- Carta: impressão e texto ---------------- */

  function letterText() {
    var out = ['CARTA PARA O MEU EU DO FUTURO', Ui.today(), '', 'Para mim, no futuro,', ''];
    LETTER.forEach(function (s, i) {
      var v = Store.get('final.m5.s' + i, '').trim();
      if (v) out.push(s.replace(/…$/, '') + ' ' + v, '');
    });
    var free = Store.get('final.m5.free', '').trim();
    if (free) out.push(free, '');
    out.push('Com carinho, eu.');
    return out.join('\r\n');
  }

  function letterHtml() {
    var lines = LETTER.map(function (s, i) {
      var v = Store.get('final.m5.s' + i, '').trim();
      return v ? '<p><em>' + esc(s.replace(/…$/, '')) + '</em> ' + Ui.paras(v) + '</p>' : '';
    }).join('');
    var free = Store.get('final.m5.free', '').trim();
    return '<article class="print-letter"><p class="print-date">' + esc(Ui.today()) + '</p><h1>Para mim, no futuro,</h1>' + lines +
      (free ? '<p>' + Ui.paras(free) + '</p>' : '') +
      (!lines && !free ? '<p class="print-empty">(A carta ainda está em branco. Ela pode ser escrita quando fizer sentido.)</p>' : '') +
      '<p class="print-sign">Com carinho, eu.</p></article>';
  }

  /* ---------------- Coleta para a página de registros ---------------- */

  function collect() {
    var S = [];
    var m1 = [];
    Q_PATH.forEach(function (q, i) { m1.push({ label: q, key: 'final.m1.p' + i + '.note', talked: Store.get('final.m1.p' + i + '.talked', false) }); });
    Q_SPACE.forEach(function (q, i) { m1.push({ label: q, key: 'final.m1.s' + i + '.note', talked: Store.get('final.m1.s' + i + '.talked', false) }); });
    S.push({ title: 'Momento 01 · Olhando para o caminho que percorri', items: m1, page: 1 });

    S.push({ title: 'Momento 02 · O que descobri sobre mim?', page: 2, items: DISCOVER.map(function (d) { return { label: d.t + ': ' + d.q, key: 'final.m2.' + d.k }; }) });

    var tags = Store.get('final.m3.tags', {});
    var custom = Store.get('final.m3.custom', []);
    var all = TOOLS.map(function (t) { return { id: t.id, t: t.t }; }).concat(custom.map(function (t, i) { return { id: 'c' + i, t: t }; }));
    var toolLines = all.filter(function (t) { return (tags[t.id] || []).length; }).map(function (t) {
      return t.t + ' (' + tags[t.id].map(function (g) { return TAGS.filter(function (x) { return x.id === g; })[0].t; }).join('; ') + ')';
    });
    var m3 = [{ label: 'Ferramentas que fizeram sentido', value: toolLines.join('\n') }];
    TOOL_Q.forEach(function (q, i) { m3.push({ label: q, key: 'final.m3.q' + i }); });
    S.push({ title: 'Momento 03 · Minha caixa de ferramentas', items: m3, page: 3 });

    var m4 = [];
    [0, 1, 2].forEach(function (i) {
      m4.push({ label: 'Direção ' + (i + 1), key: 'final.m4.g' + i + '.text' });
      m4.push({ label: 'Apoio para a direção ' + (i + 1), key: 'final.m4.g' + i + '.support' });
    });
    S.push({ title: 'Momento 04 · O que quero construir no próximo ano?', items: m4, page: 4 });

    var m5 = LETTER.map(function (s, i) { return { label: s, key: 'final.m5.s' + i }; });
    m5.push({ label: 'Escrita livre', key: 'final.m5.free' });
    S.push({ title: 'Momento 05 · Uma mensagem para o meu eu do futuro', items: m5, page: 5 });
    return S;
  }

  /* ---------------- View ---------------- */

  var RENDER = [opening, moment1, moment2, moment3, moment4, moment5, closing];

  function view(step) {
    if (!Store.isOpen('final')) return Pages.locked(FinalChapter.meta);
    if (isNaN(step)) step = Store.step('final');
    step = Math.max(0, Math.min(PAGES.length - 1, step));
    Store.visit('final', step);
    var content = RENDER[step]();
    var html =
      '<div class="fc">' +
      '<a class="back-link back-link--paper" href="#/mapa">' + I('arrowLeft') + 'Mapa da jornada</a>' +
      '<div class="fc__layout">' +
      '<nav class="fc__index" aria-label="Índice do caderno"><p class="fc__index-title">' + I('book') + 'Caderno</p><ol>' +
      PAGES.map(function (p, i) {
        return '<li><a href="#/final/' + i + '" class="' + (i === step ? 'is-current' : '') + '"' + (i === step ? ' aria-current="page"' : '') + '>' +
          '<span class="fc__index-n">' + (p.n || I(p.i)) + '</span><span>' + p.t + '</span></a></li>';
      }).join('') + '</ol></nav>' +
      '<article class="fc__page fc__page--' + step + '">' + content.html + '</article>' +
      '</div>' +
      (step > 0 ? '<nav class="fc__nav" aria-label="Navegação do caderno">' +
        '<a class="btn btn--ghost" href="#/final/' + (step - 1) + '">' + I('arrowLeft') + '<span>' + (step === 1 ? 'Abertura' : 'Voltar') + '</span></a>' +
        '<span class="fc__where">' + (step < PAGES.length - 1 ? 'Página ' + step + ' de ' + (PAGES.length - 2) : '') + '</span>' +
        (step < PAGES.length - 1 ? '<a class="btn btn--paper" href="#/final/' + (step + 1) + '"><span>' + (step === PAGES.length - 2 ? 'Fechar o caderno' : 'Seguir') + '</span>' + I('arrowRight') + '</a>' : '<span></span>') +
        '</nav>' : '') +
      '</div>';
    return {
      html: html,
      theme: 'theme-final',
      title: PAGES[step].t,
      mount: function (root) {
        var nx = Ui.$('[data-fc-next]', root);
        if (nx) nx.addEventListener('click', function () { Ui.go('#/final/1'); });
        if (content.mount) content.mount(root);
      }
    };
  }

  window.FinalChapter = {
    meta: {
      id: 'final',
      num: '',
      title: 'Meu caminho daqui pra frente',
      desc: 'Um capítulo especial para olhar o caminho, conversar e pensar nos próximos passos.',
      icon: 'envelope',
      accent: 'gold',
      sticker: 'envelope',
      stickerName: 'Carta'
    },
    view: view,
    collect: collect
  };
})();
