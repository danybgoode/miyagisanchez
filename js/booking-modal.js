/* ── Liquid Glass Booking Modal + Cal.com Embed ──────────────────────────── */
(function () {
  'use strict';

  // ── Cal.com embed shim (official format) ─────────────────────────────────
  (function (C, A, L) {
    var p = function (a, ar) { a.q.push(ar); };
    var d = C.document;
    C.Cal = C.Cal || function () {
      var cal = C.Cal;
      var ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        var s = d.createElement('script');
        s.src = A;
        s.async = true;
        d.head.appendChild(s);
        cal.loaded = true;
      }
      if (ar[0] === L) {
        var api = function () { p(api, arguments); };
        var namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
        } else {
          p(cal, ar);
        }
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  // Init the namespace — embed.js will process the queue on load
  Cal('init', 'bonsaitalk', { origin: 'https://cal.com' });

  // Request light theme globally (processed once embed.js loads)
  Cal('ui', { theme: 'light', styles: { branding: { brandColor: '#173f35' } } });

  // ── Modal state ──────────────────────────────────────────────────────────
  var calInited = false;
  var modalEl = null;

  function initCalInline() {
    if (calInited) return;
    calInited = true;
    Cal.ns.bonsaitalk('inline', {
      elementOrSelector: '#cal-inline',
      calLink: 'miyagisan/bonsaitalk',
      layout: 'month_view'
    });
  }

  // ── Build modal DOM ──────────────────────────────────────────────────────
  function buildModal() {
    var el = document.createElement('div');
    el.className = 'lg-overlay';
    el.id = 'booking-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Schedule a call');
    el.innerHTML =
      '<div class="lg-panel">' +
        '<button class="lg-close" id="lg-close-btn" aria-label="Close">' +
          '<span aria-hidden="true">&#x2715;</span>' +
        '</button>' +
        '<div class="lg-cal-wrap">' +
          '<div id="cal-inline"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target === el) closeModal();
    });
    return el;
  }

  // ── Open ─────────────────────────────────────────────────────────────────
  function openModal() {
    if (!modalEl) modalEl = buildModal();
    document.body.classList.add('modal-open');
    modalEl.getBoundingClientRect();
    modalEl.classList.add('is-open');
    initCalInline();
  }

  // ── Close ────────────────────────────────────────────────────────────────
  function closeModal() {
    if (modalEl) modalEl.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  // ── Event listeners ──────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && (t.id === 'lg-close-btn' || (t.closest && t.closest('#lg-close-btn')))) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // ── Public API ───────────────────────────────────────────────────────────
  window.openBookingModal = openModal;
  window.closeBookingModal = closeModal;
})();
