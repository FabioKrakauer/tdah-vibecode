/*
 * Armazenamento local do progresso e dos registros.
 * Tudo fica apenas no navegador (localStorage). Nada é enviado para fora.
 */
(function () {
  'use strict';

  var KEY = 'jornada-descobertas:v2';
  var ORDER = ['m1', 'm2', 'm3', 'final'];

  function fresh() {
    return {
      missions: {
        m1: { status: 'available', step: 0 },
        m2: { status: 'locked', step: 0 },
        m3: { status: 'locked', step: 0 },
        final: { status: 'locked', step: 0 }
      },
      unlockAll: false,
      data: {}
    };
  }

  var persistent = true;

  function load() {
    var base = fresh();
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return base;
      var saved = JSON.parse(raw);
      ORDER.forEach(function (id) {
        if (saved.missions && saved.missions[id]) {
          base.missions[id] = Object.assign(base.missions[id], saved.missions[id]);
        }
      });
      base.unlockAll = !!saved.unlockAll;
      base.data = saved.data && typeof saved.data === 'object' ? saved.data : {};
    } catch (e) {
      persistent = false;
    }
    return base;
  }

  var state = load();
  var timer = null;

  function writeNow() {
    clearTimeout(timer);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
      persistent = true;
    } catch (e) {
      persistent = false;
    }
  }

  function persist() {
    clearTimeout(timer);
    timer = setTimeout(writeNow, 120);
  }

  window.addEventListener('pagehide', writeNow);
  window.addEventListener('beforeunload', writeNow);

  var Store = {
    ORDER: ORDER,

    isPersistent: function () { return persistent; },

    get: function (key, fallback) {
      return Object.prototype.hasOwnProperty.call(state.data, key) ? state.data[key] : fallback;
    },

    set: function (key, value) {
      state.data[key] = value;
      persist();
    },

    /** Remove a chave e todas as que começam com "prefixo." */
    remove: function (prefix) {
      Object.keys(state.data).forEach(function (k) {
        if (k === prefix || k.indexOf(prefix + '.') === 0) delete state.data[k];
      });
      persist();
    },

    status: function (id) {
      var s = state.missions[id].status;
      return s === 'locked' && state.unlockAll ? 'available' : s;
    },

    isOpen: function (id) { return this.status(id) !== 'locked'; },

    step: function (id) { return state.missions[id].step || 0; },

    visit: function (id, step) {
      var m = state.missions[id];
      m.step = step;
      if (m.status !== 'done' && this.isOpen(id)) m.status = 'progress';
      persist();
    },

    complete: function (id) {
      state.missions[id].status = 'done';
      var next = ORDER[ORDER.indexOf(id) + 1];
      if (next && state.missions[next].status === 'locked') state.missions[next].status = 'available';
      writeNow();
    },

    anyStarted: function () {
      return ORDER.some(function (id) {
        var s = state.missions[id].status;
        return s === 'progress' || s === 'done';
      });
    },

    unlockAll: function () { return state.unlockAll; },

    setUnlockAll: function (value) {
      state.unlockAll = !!value;
      writeNow();
    },

    reset: function () {
      state = fresh();
      writeNow();
    }
  };

  window.Store = Store;
})();
