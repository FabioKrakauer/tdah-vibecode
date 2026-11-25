/*
 * Páginas: início, mapa da jornada, registros e etapa bloqueada.
 */
(function () {
  'use strict';

  var I = Ui.icon;
  var esc = Ui.esc;
  var STATUS = { locked: 'Bloqueada', available: 'Disponível', progress: 'Em andamento', done: 'Concluída' };

  function meta(id) { return id === 'final' ? FinalChapter.meta : Missions[id]; }
  function href(id, step) { return id === 'final' ? '#/final/' + (step || 0) : '#/missao/' + id + '/' + (step || 0); }

  /* ---------------- Início ---------------- */

  function home() {
    var started = Store.anyStarted();
    var route = Store.ORDER.map(function (id, i) {
      var m = meta(id);
      return '<li class="route-pill route-pill--' + m.accent + '">' + I(m.icon) + '<span>' + (m.num ? '<b>' + m.num + '</b>' : '') + m.title + '</span></li>';
    }).join('');
    return {
      title: 'Início',
      html:
        '<section class="hero">' +
        '<div class="hero__text">' +
        '<p class="eyebrow">' + I('sparkle') + 'Diário de descobertas</p>' +
        '<h1 class="hero__title">Uma jornada para descobrir mais <em>sobre mim</em></h1>' +
        '<p class="hero__sub">Um caminho de descobertas sobre como penso, sinto, aprendo e encontro minhas próprias maneiras de fazer as coisas.</p>' +
        '<div class="hero__actions"><a class="btn btn--primary btn--lg" href="#/mapa">' + (started ? 'Continuar minha jornada' : 'Começar minha jornada') + I('arrowRight') + '</a></div>' +
        '<ol class="hero__route" aria-label="O caminho">' + route + '</ol>' +
        '</div>' +
        '<div class="hero__art">' + Art.hero() + '</div>' +
        '</section>'
    };
  }

  /* ---------------- Mapa ---------------- */

  function stop(id, i) {
    var m = meta(id);
    var st = Store.status(id);
    var isFinal = id === 'final';
    var action;
    if (st === 'locked') {
      action = '<p class="stop__locked">' + I('lock') + '<span>Abre quando a etapa anterior for concluída</span></p>';
    } else {
      var label = st === 'done' ? 'Rever' : st === 'progress' ? 'Continuar' : (isFinal ? 'Abrir' : 'Começar');
      action = '<a class="btn ' + (st === 'done' ? 'btn--ghost' : isFinal ? 'btn--paper' : 'btn--primary') + ' btn--sm" href="' + href(id, st === 'progress' ? Store.step(id) : 0) + '">' + label + I('arrowRight') + '</a>';
    }
    return '<li class="stop stop--' + st + ' stop--' + m.accent + (isFinal ? ' stop--final' : '') + '" style="--i:' + i + '">' +
      '<div class="stop__medal">' + I(m.icon) + (st === 'done' ? '<span class="stop__check">' + I('check') + '</span>' : '') + '</div>' +
      '<p class="stop__num">' + (isFinal ? 'Capítulo final' : 'Missão ' + m.num) + '</p>' +
      '<h2 class="stop__title">' + m.title + '</h2>' +
      '<p class="stop__desc">' + m.desc + '</p>' +
      '<p class="stop__status"><span class="status status--' + st + '">' + STATUS[st] + '</span></p>' +
      action + '</li>';
  }

  function map() {
    var stickers = Store.ORDER.map(function (id) {
      var m = meta(id);
      var done = Store.status(id) === 'done';
      return '<li class="dsticker' + (done ? ' is-done' : '') + '">' +
        (done ? Icons.sticker(m.sticker, m.accent, (id === 'm2' ? 8 : -6), 'sticker--lg') : '<span class="sticker sticker--empty sticker--lg">' + I(m.sticker) + '</span>') +
        '<span class="dsticker__name">' + (done ? m.stickerName : 'ainda por vir') + '</span></li>';
    }).join('');
    return {
      title: 'Mapa da jornada',
      html:
        '<section class="map">' +
        '<header class="page-head"><p class="eyebrow">' + I('map') + 'Mapa da jornada</p>' +
        '<h1>Meu caminho de descobertas</h1>' +
        '<p class="lead">Cada missão é uma parada do caminho. Não tem pressa, nem pontuação: o importante é o que descobrimos em cada uma.</p></header>' +
        '<div class="trail">' +
        '<svg class="trail__line" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true"><path d="M125 70 C 230 70 270 160 375 160 S 520 70 625 70 S 770 160 875 160" fill="none" stroke="#c9b8ef" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>' +
        '<ol class="trail__stops">' + Store.ORDER.map(stop).join('') + '</ol>' +
        '</div>' +
        '<section class="diary" aria-labelledby="diary-title"><h2 id="diary-title" class="diary__title">' + I('book') + 'Meu diário de adesivos</h2>' +
        '<p class="diary__sub">Cada etapa concluída deixa um adesivo aqui.</p><ul class="diary__row">' + stickers + '</ul></section>' +
        '</section>'
    };
  }

  /* ---------------- Bloqueada ---------------- */

  function locked(m) {
    return {
      title: m.title,
      html:
        '<section class="empty">' + Icons.sticker('lock', 'silver', -4, 'sticker--lg') +
        '<h1>' + m.title + '</h1>' +
        '<p>Esta etapa abre quando a anterior for concluída. Se quiser seguir outra ordem, a psicóloga pode liberar todas as etapas nos ajustes.</p>' +
        '<a class="btn btn--primary" href="#/mapa">' + I('map') + 'Voltar ao mapa</a></section>'
    };
  }

  /* ---------------- Registros ---------------- */

  function sections() {
    var picks = Store.get('m2.toolPick', []).map(function (id) {
      var t = (window.M2Tools || []).filter(function (x) { return x.id === id; })[0];
      return t ? t.name : '';
    }).filter(Boolean);
    var storyPaths = Store.get('m3.story', { paths: {} }).paths || {};
    var nPaths = Object.keys(storyPaths).reduce(function (a, k) { return a + storyPaths[k].length; }, 0);
    var caos = Store.get('m2.caos', null);
    var plan = '';
    if (caos && caos.order && caos.order.length) {
      plan = caos.order.map(function (id, i) {
        var el = { tema: 'Escolher o tema com o grupo', dividir: 'Combinar quem faz cada parte', pesquisar: 'Pesquisar as informações', slides: 'Montar os slides', ensaiar: 'Ensaiar a apresentação', material: 'Salvar os slides no pen drive e levar', video: 'Assistir ao vídeo novo que saiu', galeria: 'Organizar as fotos do celular', meme: 'Responder o meme no grupo da turma', roupa: 'Escolher a roupa da festa de sábado' }[id];
        return (i + 1) + '. ' + el;
      }).join('\n');
    }
    var S = [
      { title: 'Missão 01 · Entendendo minha mente', mission: 'm1', items: [{ label: 'Uma descoberta que levo comigo', key: 'm1.reflection' }] },
      {
        title: 'Missão 02 · Da vontade à ação', mission: 'm2', items: [
          { label: 'Plano do jogo “Organizando o caos”', value: plan },
          { label: 'Ferramentas que quero experimentar', value: picks.join(', ') },
          { label: 'Uma ferramenta que posso levar para o meu dia', key: 'm2.reflection' }
        ]
      },
      {
        title: 'Missão 03 · Entre pensamentos e emoções', mission: 'm3', items: [
          { label: 'Caminhos explorados na história', value: nPaths ? String(nPaths) : '' },
          { label: 'Nem sempre posso escolher o que acontece, mas posso aprender novas maneiras de lidar com isso.', key: 'm3.reflection' }
        ]
      }
    ];
    FinalChapter.collect().forEach(function (s) { s.final = true; S.push(s); });
    return S;
  }

  function valueOf(it) { return (it.key ? Store.get(it.key, '') : it.value || '').trim(); }

  function exportText() {
    var out = ['JORNADA DE DESCOBERTAS — REGISTROS', Ui.today(), ''];
    sections().forEach(function (s) {
      var lines = [];
      s.items.forEach(function (it) {
        var v = valueOf(it);
        if (v || it.talked) lines.push('• ' + it.label + (it.talked ? ' [conversamos sobre isso]' : ''), v ? '  ' + v.replace(/\n/g, '\n  ') : '', '');
      });
      if (lines.length) out.push('== ' + s.title + ' ==', '', lines.join('\r\n'));
    });
    if (out.length === 3) out.push('Ainda não há registros.');
    return out.join('\r\n');
  }

  function exportHtml() {
    var body = sections().map(function (s) {
      var items = s.items.map(function (it) {
        var v = valueOf(it);
        if (!v && !it.talked) return '';
        return '<div class="print-item"><p class="print-label">' + esc(it.label) + (it.talked ? ' <span class="print-tag">conversamos sobre isso</span>' : '') + '</p>' + (v ? '<p>' + Ui.paras(v) + '</p>' : '') + '</div>';
      }).join('');
      return items ? '<section><h2>' + esc(s.title) + '</h2>' + items + '</section>' : '';
    }).join('');
    return '<article class="print-notes"><h1>Jornada de descobertas</h1><p class="print-date">' + esc(Ui.today()) + '</p>' + (body || '<p class="print-empty">Ainda não há registros.</p>') + '</article>';
  }

  function records() {
    var S = sections();
    var html =
      '<section class="records">' +
      '<header class="page-head"><p class="eyebrow">' + I('book') + 'Registros</p><h1>Meu caderno de registros</h1>' +
      '<p class="lead">Tudo o que foi escrito durante a jornada, num lugar só. Dá para revisar e editar aqui mesmo.</p>' +
      '<p class="privacy">' + I('lock') + '<span>Os registros ficam guardados apenas neste navegador. Nada é enviado para a internet.' + (Store.isPersistent() ? '' : ' <strong>Atenção: este navegador não está permitindo guardar os dados. Eles podem se perder ao fechar a página.</strong>') + '</span></p>' +
      '<div class="records__actions">' +
      '<button type="button" class="btn btn--soft btn--sm" data-rec-print>' + I('print') + 'Imprimir ou salvar em PDF</button>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-rec-txt>' + I('download') + 'Baixar (.txt)</button></div>' +
      '</header>' +
      S.map(function (s) {
        var editLink = s.final ? '#/final/' + s.page : '#/missao/' + s.mission + '/0';
        var open = s.final ? Store.isOpen('final') : Store.isOpen(s.mission);
        return '<section class="rec' + (s.final ? ' rec--final' : '') + '"><header class="rec__head"><h2>' + esc(s.title) + '</h2>' +
          (open ? '<a class="rec__link" href="' + editLink + '">' + (s.final ? 'Abrir no caderno' : 'Abrir missão') + I('arrowRight') + '</a>' : '') + '</header>' +
          s.items.map(function (it) {
            if (it.key) return Ui.field({ key: it.key, label: esc(it.label) + (it.talked ? ' <span class="tag tag--true">conversamos sobre isso</span>' : ''), rows: 2, cls: 'field--rec' });
            var v = (it.value || '').trim();
            return '<div class="rec__ro"><p class="field__label">' + esc(it.label) + '</p><p class="rec__val">' + (v ? Ui.paras(v) : '<span class="ph">Nada por aqui ainda.</span>') + '</p></div>';
          }).join('') + '</section>';
      }).join('') +
      '</section>';
    return {
      title: 'Registros',
      html: html,
      mount: function (root) {
        Ui.$('[data-rec-print]', root).addEventListener('click', function () { Ui.print(exportHtml()); });
        Ui.$('[data-rec-txt]', root).addEventListener('click', function () { Ui.download('jornada-registros.txt', exportText()); });
      }
    };
  }

  window.Pages = { home: home, map: map, locked: locked, records: records };
})();
