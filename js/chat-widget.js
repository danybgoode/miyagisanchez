/* ── Miyagi Chat Widget — custom bubble + liquid-glass panel ─────────────── */
(function () {
  'use strict';

  var WIDGET_URL = 'https://chat.despachobonsai.com/widget?website_token=1xQzZkDhjgc6z8B8DXosEXKF';
  var bubbleEl = null;
  var panelEl  = null;
  var isOpen   = false;
  var iframeLoaded = false;

  /* ── Build DOM ─────────────────────────────────────────────────────────── */

  function buildBubble() {
    var btn = document.createElement('button');
    btn.className   = 'miyagi-bubble';
    btn.setAttribute('aria-label', 'Open chat');
    btn.innerHTML   =
      '<span class="miyagi-avatar" aria-hidden="true">' +
        '<img src="miyagi.png" alt="" draggable="false">' +
      '</span>' +
      '<span class="miyagi-pulse" aria-hidden="true"></span>';
    document.body.appendChild(btn);
    btn.addEventListener('click', toggle);
    return btn;
  }

  function buildPanel() {
    var el = document.createElement('div');
    el.className = 'miyagi-panel';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'false');
    el.setAttribute('aria-label', 'Chat with Miyagi');
    el.innerHTML =
      '<div class="miyagi-panel-header">' +
        '<div class="miyagi-panel-identity">' +
          '<span class="miyagi-avatar miyagi-avatar--sm" aria-hidden="true"><img src="miyagi.png" alt=""></span>' +
          '<div>' +
            '<span class="bm-event-title">Miyagi</span>' +
            '<span class="bm-event-sub">&#x25cf;&ensp;Online &mdash; replies fast</span>' +
          '</div>' +
        '</div>' +
        '<button class="bm-close-btn" id="miyagi-close" aria-label="Close chat">&#x2715;</button>' +
      '</div>' +
      '<div class="miyagi-panel-body">' +
        '<iframe class="miyagi-iframe" title="Chat" allow="microphone; camera" loading="lazy"></iframe>' +
      '</div>';
    document.body.appendChild(el);
    el.querySelector('#miyagi-close').addEventListener('click', close);
    return el;
  }

  /* ── Open / close ──────────────────────────────────────────────────────── */

  function open() {
    if (isOpen) return;
    isOpen = true;
    bubbleEl.classList.add('miyagi-bubble--open');

    /* Lazy-load the iframe on first open */
    if (!iframeLoaded) {
      panelEl.querySelector('.miyagi-iframe').src = WIDGET_URL;
      iframeLoaded = true;
    }

    panelEl.style.animation = '';
    panelEl.classList.add('miyagi-panel--open');
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    bubbleEl.classList.remove('miyagi-bubble--open');

    var isMobile = window.innerWidth < 640;
    panelEl.style.animation = isMobile
      ? 'miyagi-slide-down 260ms cubic-bezier(0.4,0,1,0.6) both'
      : 'lg-collapse 260ms ease both';

    setTimeout(function () {
      panelEl.classList.remove('miyagi-panel--open');
      panelEl.style.animation = '';
    }, 240);
  }

  function toggle() {
    if (isOpen) close(); else open();
  }

  /* ── Keyboard ──────────────────────────────────────────────────────────── */

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  /* ── Init after DOM ready ──────────────────────────────────────────────── */

  function init() {
    bubbleEl = buildBubble();
    panelEl  = buildPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.openMiyagiChat  = open;
  window.closeMiyagiChat = close;
})();
