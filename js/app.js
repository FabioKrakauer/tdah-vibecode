/*
 * Roteador e estrutura das missões.
 */
(function () {
  'use strict';

  var I = Ui.icon;
  var main = document.getElementById('main');

  /* ---------------- Missão ---------------- */

  function entryHref(id) { return id === 'final' ? '#/final/0' : '#/missao/' + id + '/0'; }

  function stepper(m, step, visited) {
    return '<ol class="stepper" aria-label="Etapas da missão">' + m.steps.map(function (s, i) {
      var seen = visited.indexOf(i) >= 0;
      var cls = i === step ? 'is-current' : seen ? 'is-visited' : '';
      return '<li class="stepper__item ' + cls + '"><a href="#/missao/' + m.id + '/' + i + '"' + (i === step ? ' aria-current="step"' : '') + '>' +
        '<span class="stepper__num">' + (seen && i !== step ? I('check') : (i + 1)) + '</span>' +
        '<span class="stepper__label">' + s.label + '</span></a></li>';
    }).join('') + '</ol>';
  }

  function conquest(m) {
    var done = Store.status(m.id) === 'done';
    var refl = Store.get(m.id + '.reflection', '').trim();
    var nextId = Store.ORDER[Store.ORDER.indexOf(m.id) + 1];
    var nextName = nextId === 'final' ? 'o capítulo final' : 'a próxima missão';
    return {
      html:
        '<div class="conquest' + (done ? ' is-done' : '') + '">' +
        '<div class="conquest__sticker">' + Art.bigSticker(m.sticker, m.accent) + '</div>' +
        '<p class="eyebrow">' + I('star') + 'Conquista</p>' +
        '<h2 class="conquest__title">' + (done ? 'Missão ' + m.num + ' concluída' : 'Você chegou ao fim da Missão ' + m.num) + '</h2>' +
        '<p class="conquest__lead">' + m.conquest.lead + '</p>' +
        '<ul class="conquest__list">' + m.conquest.items.map(function (t) { return '<li>' + I('sparkle') + '<span>' + t + '</span></li>'; }).join('') + '</ul>' +
        (refl ? '<blockquote class="conquest__quote"><p class="conquest__qlabel">' + m.reflectionTitle + '</p><p>' + Ui.paras(refl) + '</p></blockquote>' : '') +
        '<div class="conquest__actions">' +
        (done ? '' : '<button type="button" class="btn btn--primary btn--lg" data-complete>' + I('star') + 'Colar o adesivo no meu diário</button>') +
        '<div class="conquest__after"' + (done ? '' : ' hidden') + '>' +
        '<p class="conquest__msg">' + I('check') + '<span>Adesivo “' + m.stickerName + '” guardado no diário.' + (nextId ? ' O caminho para ' + nextName + ' está aberto.' : '') + '</span></p>' +
        '<div class="conquest__btns"><a class="btn btn--soft" href="#/mapa">' + I('map') + 'Ver o mapa</a>' +
        (nextId ? '<a class="btn btn--primary" href="' + entryHref(nextId) + '">' + (nextId === 'final' ? 'Abrir o capítulo final' : 'Ir para a próxima missão') + I('arrowRight') + '</a>' : '') +
        '</div></div></div></div>',
      mount: function (root) {
        var b = Ui.$('[data-complete]', root);
        if (!b) return;
        b.addEventListener('click', function () {
          Store.complete(m.id);
          var c = Ui.$('.conquest', root);
          c.classList.add('is-done');
          Ui.celebrate(Ui.$('.conquest__sticker', root), 34);
          Ui.$('.conquest__title', root).textContent = 'Missão ' + m.num + ' concluída';
          b.remove();
          var after = Ui.$('.conquest__after', root);
          after.hidden = false;
          after.querySelector('a').focus();
        });
      }
    };
  }

  function missionView(id, step) {
    var m = Missions[id];
    if (!Store.isOpen(id)) return Pages.locked(m);
    if (isNaN(step)) step = Store.step(id);
    step = Math.max(0, Math.min(m.steps.length - 1, step));
    Store.visit(id, step);

    var vKey = id + '.visited';
    var visited = Store.get(vKey, []);
    if (visited.indexOf(step) < 0) { visited.push(step); Store.set(vKey, visited); }

    var s = m.steps[step];
    var last = step === m.steps.length - 1;
    var ctx = {
      mission: m,
      step: step,
      next: function () { Ui.go(last ? '#/mapa' : '#/missao/' + id + '/' + (step + 1)); }
    };
    var content = s.key === 'conquista' ? conquest(m) : s.render(ctx);

    var html =
      '<div class="mission mission--' + m.accent + '">' +
      '<header class="mission__head">' +
      '<a class="back-link" href="#/mapa">' + I('arrowLeft') + 'Mapa da jornada</a>' +
      '<div class="mission__title-row">' + Icons.sticker(m.icon, m.accent, -6, 'sticker--lg') +
      '<div><p class="eyebrow">Missão ' + m.num + ' · ' + m.eixo + '</p><h1 class="mission__title">' + m.title + '</h1></div></div>' +
      '<p class="mission__question">' + I('sparkle') + '<span>' + m.question + '</span></p>' +
      stepper(m, step, visited) +
      '</header>' +
      (s.intro ? '<p class="step__intro"><span class="step__badge">' + I(s.icon) + s.label + '</span><span>' + s.intro + '</span></p>' : '') +
      '<section class="step step--' + s.key + '" data-step>' + content.html + '</section>' +
      '<nav class="step-nav" aria-label="Navegação da missão">' +
      (step === 0
        ? '<a class="btn btn--ghost" href="#/mapa">' + I('arrowLeft') + '<span>Mapa</span></a>'
        : '<a class="btn btn--ghost" href="#/missao/' + id + '/' + (step - 1) + '">' + I('arrowLeft') + '<span>' + m.steps[step - 1].label + '</span></a>') +
      '<span class="step-nav__where">Etapa ' + (step + 1) + ' de ' + m.steps.length + '</span>' +
      (last
        ? '<a class="btn btn--soft" href="#/mapa"><span>Mapa</span>' + I('map') + '</a>'
        : '<a class="btn btn--soft" href="#/missao/' + id + '/' + (step + 1) + '"><span>' + m.steps[step + 1].label + '</span>' + I('arrowRight') + '</a>') +
      '</nav>' +
      '</div>';

    return {
      title: m.title,
      html: html,
      mount: function (root) {
        if (content.mount) content.mount(Ui.$('[data-step]', root), ctx);
      }
    };
  }

  /* ---------------- Roteador ---------------- */

  function render() {
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var view;
    try {
      switch (parts[0]) {
        case undefined: view = Pages.home(); break;
        case 'mapa': view = Pages.map(); break;
        case 'missao':
          view = Missions[parts[1]] ? missionView(parts[1], parts[2] == null ? NaN : parseInt(parts[2], 10)) : Pages.map();
          break;
        case 'final': view = FinalChapter.view(parts[1] == null ? NaN : parseInt(parts[1], 10)); break;
        case 'registros': view = Pages.records(); break;
        default: view = Pages.home();
      }
    } catch (e) {
      if (window.console) console.error(e);
      view = { html: '<section class="empty"><h1>Algo não carregou direito.</h1><p>Vamos voltar ao mapa e tentar de novo.</p><a class="btn btn--primary" href="#/mapa">Voltar ao mapa</a></section>' };
    }

    document.body.classList.toggle('theme-final', view.theme === 'theme-final');
    main.innerHTML = '<div class="view">' + view.html + '</div>';
    if (view.mount) view.mount(main);
    Ui.bindFields(main);
    document.title = (view.title ? view.title + ' · ' : '') + 'Jornada de descobertas';

    window.scrollTo(0, 0);

    var h = main.querySelector('h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }

    Ui.$$('.topbar [data-nav]').forEach(function (a) {
      var on = a.getAttribute('data-nav') === parts[0];
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------------- Estrutura fixa ---------------- */

  function chrome() {
    Ui.$('#brand-mark').innerHTML = I('sparkle');
    Ui.$('#nav-map').innerHTML = I('map') + '<span>Mapa</span>';
    Ui.$('#nav-notes').innerHTML = I('book') + '<span>Registros</span>';
    var sb = Ui.$('#open-settings');
    sb.innerHTML = I('sliders') + '<span class="visually-hidden">Ajustes para a psicóloga</span>';
    sb.title = 'Ajustes para a psicóloga';
    Ui.$('#close-settings').innerHTML = I('close');

    var dlg = Ui.$('#settings');
    var unlock = Ui.$('#unlock-all');
    sb.addEventListener('click', function () {
      unlock.checked = Store.unlockAll();
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    });
    unlock.addEventListener('change', function () {
      Store.setUnlockAll(unlock.checked);
      Ui.toast(unlock.checked ? 'Todas as etapas foram liberadas.' : 'As etapas voltam a abrir em sequência.');
      render();
    });
    Ui.$('#settings-notes').addEventListener('click', function () { dlg.close(); });
    Ui.$('#reset-all').addEventListener('click', function () {
      if (!window.confirm('Isso apaga o progresso e todos os registros guardados neste dispositivo. Deseja continuar?')) return;
      Store.reset();
      dlg.close();
      Ui.toast('A jornada recomeçou.');
      Ui.go('#/');
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

    // céu de brilhos ao fundo
    var sky = Ui.$('.sky');
    var spots = [[6, 14, .9], [18, 72, .6], [30, 30, .5], [44, 88, .7], [58, 12, .6], [70, 64, .8], [84, 24, .7], [92, 80, .5], [12, 46, .5], [78, 44, .45], [50, 50, .4], [36, 6, .5]];
    sky.innerHTML = spots.map(function (s, i) {
      return '<span class="sky__star" style="left:' + s[0] + '%;top:' + s[1] + '%;--s:' + s[2] + ';animation-delay:' + (i * 0.7) + 's">' + I(i % 3 ? 'sparkle' : 'star') + '</span>';
    }).join('');
  }

  chrome();
  window.addEventListener('hashchange', render);
  render();
})();
