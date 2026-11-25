/*
 * Componentes de interface reutilizáveis.
 */
(function () {
  'use strict';

  var Ui = {};
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  Ui.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; });
  };

  /** Texto do usuário -> HTML seguro com quebras de linha. */
  Ui.paras = function (s) {
    return Ui.esc(s).replace(/\n/g, '<br>');
  };

  Ui.strip = function (html) { return String(html).replace(/<[^>]*>/g, ''); };

  Ui.icon = function (n, cls) { return Icons.svg(n, cls); };

  Ui.$ = function (sel, root) { return (root || document).querySelector(sel); };
  Ui.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  Ui.go = function (hash) {
    if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
    else location.hash = hash;
  };

  Ui.reducedMotion = function () {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  Ui.toast = function (msg) {
    var region = document.getElementById('toasts');
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = Ui.icon('sparkle') + '<span>' + Ui.esc(msg) + '</span>';
    region.appendChild(t);
    setTimeout(function () { t.classList.add('is-leaving'); }, 2600);
    setTimeout(function () { t.remove(); }, 3100);
  };

  /** Pequena chuva de estrelas e brilhos ao redor de um elemento. */
  Ui.celebrate = function (el, amount) {
    var r = el ? el.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;
    var layer = document.createElement('div');
    layer.className = 'burst';
    layer.setAttribute('aria-hidden', 'true');
    var n = Ui.reducedMotion() ? 0 : (amount || 26);
    var colors = ['#c8a04a', '#9a82d4', '#5bbcae', '#f2b8cb', '#e6cd8e', '#b8bccb'];
    for (var i = 0; i < n; i++) {
      var p = document.createElement('span');
      p.className = 'burst__p' + (i % 3 === 0 ? ' is-star' : '');
      var ang = Math.random() * Math.PI * 2;
      var dist = (amount && amount < 15 ? 30 : 70) + Math.random() * (amount && amount < 15 ? 50 : 130);
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.setProperty('--dx', (Math.cos(ang) * dist) + 'px');
      p.style.setProperty('--dy', (Math.sin(ang) * dist - 30) + 'px');
      p.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
      p.style.setProperty('--c', colors[i % colors.length]);
      p.style.animationDelay = Math.round(Math.random() * 120) + 'ms';
      layer.appendChild(p);
    }
    document.body.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 1800);
  };

  /* ---------- Campos de registro (salvamento automático) ---------- */

  function fieldId(key) { return 'f-' + key.replace(/[^a-z0-9]/gi, '-'); }

  Ui.field = function (o) {
    var v = Store.get(o.key, '');
    var id = fieldId(o.key);
    var aria = o.label ? '' : ' aria-label="' + Ui.esc(o.aria || o.placeholder || 'Registro') + '"';
    return '<div class="field' + (o.cls ? ' ' + o.cls : '') + '">' +
      (o.label ? '<label class="field__label" for="' + id + '">' + o.label + '</label>' : '') +
      '<textarea id="' + id + '" class="field__input" data-bind="' + Ui.esc(o.key) + '" rows="' + (o.rows || 3) + '" placeholder="' + Ui.esc(o.placeholder || 'Se quiser, escreva aqui…') + '"' + aria + '>' + Ui.esc(v) + '</textarea>' +
      '<span class="field__saved" aria-hidden="true">' + Ui.icon('check') + 'guardado</span>' +
      '</div>';
  };

  Ui.input = function (o) {
    var v = Store.get(o.key, '');
    var id = fieldId(o.key);
    var aria = o.label ? '' : ' aria-label="' + Ui.esc(o.aria || o.placeholder || 'Registro') + '"';
    return '<div class="field field--line' + (o.cls ? ' ' + o.cls : '') + '">' +
      (o.label ? '<label class="field__label" for="' + id + '">' + o.label + '</label>' : '') +
      '<input id="' + id + '" class="field__input" type="text" maxlength="' + (o.max || 160) + '" data-bind="' + Ui.esc(o.key) + '" value="' + Ui.esc(v) + '" placeholder="' + Ui.esc(o.placeholder || '') + '"' + aria + '>' +
      '<span class="field__saved" aria-hidden="true">' + Ui.icon('check') + 'guardado</span>' +
      '</div>';
  };

  Ui.autosize = function (el) {
    if (!el || el.tagName !== 'TEXTAREA') return;
    if (!el.offsetParent) return; // escondido: ajusta quando aparecer
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight + 2) + 'px';
  };

  Ui.bindFields = function (root) {
    Ui.$$('[data-bind]', root).forEach(function (el) {
      if (el._bound) return;
      el._bound = true;
      var saved = el.parentElement.querySelector('.field__saved');
      var t = null;
      el.addEventListener('input', function () {
        Store.set(el.getAttribute('data-bind'), el.value);
        if (saved) {
          saved.classList.add('is-on');
          clearTimeout(t);
          t = setTimeout(function () { saved.classList.remove('is-on'); }, 1400);
        }
        Ui.autosize(el);
      });
      Ui.autosize(el);
    });
  };

  /* ---------- Reflexão (etapa "Conecte") ---------- */

  Ui.reflection = function (o) {
    var html = '<section class="reflect">' +
      '<div class="reflect__head">' + Icons.sticker(o.icon || 'pencil', o.tone || 'lilac', -6) +
      '<div><p class="eyebrow">Conecte</p><h2 class="reflect__title">' + o.title + '</h2>' +
      (o.prompt ? '<p class="reflect__prompt">' + o.prompt + '</p>' : '') + '</div></div>' +
      (o.before || '') +
      (o.starters ? '<div class="starters" role="group" aria-label="Ideias para começar"><span class="starters__label">Para começar, se ajudar:</span>' +
        o.starters.map(function (s) {
          return '<button type="button" class="chip chip--soft" data-starter="' + Ui.esc(s) + '">' + Ui.esc(s) + '</button>';
        }).join('') + '</div>' : '') +
      Ui.field({ key: o.key, rows: 5, placeholder: o.placeholder, aria: Ui.strip(o.title), cls: 'field--paper' }) +
      '<p class="note">' + Ui.icon('sparkle') + '<span>Escrever é opcional: vocês também podem só conversar. O que for escrito fica guardado apenas neste dispositivo.</span></p>' +
      '</section>';

    return {
      html: html,
      mount: function (root) {
        Ui.$$('[data-starter]', root).forEach(function (b) {
          b.addEventListener('click', function () {
            var ta = Ui.$('textarea[data-bind="' + o.key + '"]', root);
            var s = b.getAttribute('data-starter').replace(/…$/, '');
            ta.value = (ta.value ? ta.value.replace(/\s*$/, '') + '\n' : '') + s + ' ';
            ta.dispatchEvent(new Event('input'));
            ta.focus();
            ta.setSelectionRange(ta.value.length, ta.value.length);
          });
        });
        if (o.mount) o.mount(root);
      }
    };
  };

  /* ---------- Baralho de cartões (etapa "Entenda") ---------- */

  Ui.deck = function (id, cards, opts) {
    opts = opts || {};
    var key = id + '.deck';
    var html = '<div class="deck" data-deck="' + id + '">' +
      cards.map(function (c, i) {
        return '<article class="deck__card" data-i="' + i + '" hidden aria-labelledby="' + id + '-c' + i + '">' +
          '<header class="deck__head">' + (c.icon ? Icons.sticker(c.icon, c.tone || opts.tone || 'lilac', (i % 2 ? 6 : -6)) : '') +
          '<div><p class="deck__count">' + (i + 1) + ' de ' + cards.length + '</p>' +
          '<h2 class="deck__title" id="' + id + '-c' + i + '">' + c.title + '</h2></div></header>' +
          '<div class="deck__body">' + c.html + '</div></article>';
      }).join('') +
      '<div class="deck__nav">' +
      '<button type="button" class="btn btn--ghost" data-deck-prev>' + Ui.icon('arrowLeft') + '<span>Anterior</span></button>' +
      '<div class="deck__dots" role="group" aria-label="Cartões">' + cards.map(function (c, i) {
        return '<button type="button" class="deck__dot" data-deck-go="' + i + '" aria-label="Cartão ' + (i + 1) + ': ' + Ui.esc(Ui.strip(c.title)) + '"></button>';
      }).join('') + '</div>' +
      '<button type="button" class="btn btn--soft" data-deck-next><span>Próximo</span>' + Ui.icon('arrowRight') + '</button>' +
      '</div></div>';

    function mount(root, ctx) {
      var el = Ui.$('[data-deck="' + id + '"]', root);
      var items = Ui.$$('.deck__card', el);
      var dots = Ui.$$('.deck__dot', el);
      var prev = Ui.$('[data-deck-prev]', el);
      var next = Ui.$('[data-deck-next]', el);
      var cur = Math.min(Store.get(key, 0), cards.length - 1);

      function show(i, focus) {
        cur = i;
        Store.set(key, i);
        items.forEach(function (c, j) { c.hidden = j !== i; });
        dots.forEach(function (d, j) {
          d.classList.toggle('is-active', j === i);
          d.classList.toggle('is-seen', j < i);
          if (j === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
        });
        prev.disabled = i === 0;
        var last = i === cards.length - 1;
        next.querySelector('span').textContent = last ? (opts.endLabel || 'Continuar') : 'Próximo';
        next.classList.toggle('btn--primary', last);
        next.classList.toggle('btn--soft', !last);
        items[i].classList.remove('is-in');
        void items[i].offsetWidth;
        items[i].classList.add('is-in');
        Ui.$$('textarea', items[i]).forEach(Ui.autosize);
        if (focus) {
          var h = items[i].querySelector('.deck__title');
          h.setAttribute('tabindex', '-1');
          h.focus({ preventScroll: true });
          var top = el.getBoundingClientRect().top;
          if (top < 0) window.scrollTo({ top: window.scrollY + top - 90, behavior: Ui.reducedMotion() ? 'auto' : 'smooth' });
        }
      }

      prev.addEventListener('click', function () { if (cur > 0) show(cur - 1, true); });
      next.addEventListener('click', function () {
        if (cur < cards.length - 1) show(cur + 1, true);
        else if (opts.onEnd) opts.onEnd();
        else if (ctx && ctx.next) ctx.next();
      });
      dots.forEach(function (d, j) { d.addEventListener('click', function () { show(j, true); }); });
      cards.forEach(function (c, j) { if (c.mount) c.mount(items[j]); });
      show(cur, false);
    }

    return { html: html, mount: mount };
  };

  /* ---------- Lista ordenável (arrastar ou usar setas) ---------- */

  Ui.sortable = function (list, onChange) {
    var item = null;
    var lastY = 0;
    var offset = 0;
    var gap = parseFloat(getComputedStyle(list).rowGap) || 0;

    function order() {
      return Ui.$$('[data-id]', list).map(function (el) { return el.getAttribute('data-id'); });
    }

    list.addEventListener('pointerdown', function (e) {
      var h = e.target.closest('[data-handle]');
      if (!h || !list.contains(h)) return;
      item = h.closest('[data-id]');
      lastY = e.clientY;
      offset = 0;
      gap = parseFloat(getComputedStyle(list).rowGap) || 0;
      item.classList.add('is-dragging');
      h.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    list.addEventListener('pointermove', function (e) {
      if (!item) return;
      offset += e.clientY - lastY;
      lastY = e.clientY;
      var prev = item.previousElementSibling;
      var next = item.nextElementSibling;
      if (prev && offset < -(prev.offsetHeight / 2)) {
        list.insertBefore(item, prev);
        offset += prev.offsetHeight + gap;
      } else if (next && offset > next.offsetHeight / 2) {
        list.insertBefore(next, item);
        offset -= next.offsetHeight + gap;
      }
      item.style.transform = 'translateY(' + offset + 'px)';
    });

    function end() {
      if (!item) return;
      item.classList.remove('is-dragging');
      item.style.transform = '';
      item = null;
      onChange(order());
    }

    list.addEventListener('pointerup', end);
    list.addEventListener('pointercancel', end);

    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-move]');
      if (!b) return;
      var el = b.closest('[data-id]');
      if (b.getAttribute('data-move') === 'up' && el.previousElementSibling) list.insertBefore(el, el.previousElementSibling);
      else if (b.getAttribute('data-move') === 'down' && el.nextElementSibling) list.insertBefore(el.nextElementSibling, el);
      else return;
      onChange(order());
      b.focus();
    });
  };

  /* ---------- Salvar / imprimir ---------- */

  Ui.download = function (name, text, type) {
    var blob = new Blob(['﻿' + text], { type: (type || 'text/plain') + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  };

  Ui.print = function (html) {
    var root = document.getElementById('print-root');
    root.innerHTML = html;
    document.body.classList.add('is-printing');
    var done = function () {
      document.body.classList.remove('is-printing');
      root.innerHTML = '';
      window.removeEventListener('afterprint', done);
    };
    window.addEventListener('afterprint', done);
    setTimeout(function () { window.print(); }, 60);
  };

  Ui.today = function () {
    try { return new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }); }
    catch (e) { return ''; }
  };

  window.Ui = Ui;
})();
