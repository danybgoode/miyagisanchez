/* ── Miyagi Chat Widget ───────────────────────────────────────────────────── */
(function () {
  'use strict';

  var bubbleEl    = null;
  var panelEl     = null;
  var isOpen      = false;
  var widgetMoved = false;

  /* ── Language helper ───────────────────────────────────────────────────── */

  var copy = {
    en: { online: 'Online — replies fast', end: 'End chat' },
    es: { online: 'En línea — respondo rápido', end: 'Terminar chat' }
  };

  function t(key) {
    var lang = localStorage.getItem('selected_language') ||
               document.documentElement.lang || 'en';
    return (copy[lang] || copy.en)[key] || copy.en[key];
  }

  /* ── Build DOM ─────────────────────────────────────────────────────────── */

  function buildBubble() {
    var btn = document.createElement('button');
    btn.className = 'miyagi-bubble';
    btn.setAttribute('aria-label', 'Open chat');
    btn.innerHTML =
      '<span class="miyagi-mascot-wrap" aria-hidden="true">' +
        '<img class="miyagi-mascot miyagi-mascot--idle"' +
             ' src="miyagisticker.png" alt="" draggable="false">' +
        '<img class="miyagi-mascot miyagi-mascot--listening"' +
             ' src="miyagilistening.png" alt="" draggable="false">' +
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
          '<span class="miyagi-avatar miyagi-avatar--sm" aria-hidden="true">' +
            '<img src="miyagi.png" alt="">' +
          '</span>' +
          '<div>' +
            '<span class="bm-event-title">Miyagi</span>' +
            '<span class="bm-event-sub">' +
              '<span class="miyagi-status-dot" aria-hidden="true">&#x25cf;</span>' +
              '&ensp;' + t('online') +
            '</span>' +
          '</div>' +
        '</div>' +
        '<div class="miyagi-header-actions">' +
          '<button class="miyagi-end-btn" id="miyagi-end"' +
                  ' aria-label="End conversation">' + t('end') + '</button>' +
          '<button class="bm-close-btn" id="miyagi-close"' +
                  ' aria-label="Close chat">&#x2715;</button>' +
        '</div>' +
      '</div>' +
      '<div class="miyagi-panel-body"></div>';

    document.body.appendChild(el);
    el.querySelector('#miyagi-close').addEventListener('click', close);
    el.querySelector('#miyagi-end').addEventListener('click', endConversation);
    return el;
  }

  /* ── Relocate Chatwoot's SDK widget into our panel ─────────────────────── */

  function relocateChatwootWidget() {
    if (widgetMoved) return;
    var holder = document.getElementById('cw-widget-holder');
    var body   = panelEl.querySelector('.miyagi-panel-body');
    if (!holder || !body) return;
    body.appendChild(holder);
    widgetMoved = true;
  }

  /* ── End conversation — reset Chatwoot iframe to home screen ───────────── */

  function endConversation() {
    /* Clear Chatwoot's stored conversation so iframe resets to home */
    Object.keys(localStorage).forEach(function (k) {
      if (/^cw_/.test(k)) localStorage.removeItem(k);
    });

    /* Reload the iframe — drops back to Chatwoot's native home/pre-chat */
    var iframe = document.getElementById('chatwoot_live_chat_widget');
    if (iframe) {
      var src = iframe.src;
      iframe.src = '';
      setTimeout(function () { iframe.src = src; }, 30);
    }
  }

  /* ── Open / close ──────────────────────────────────────────────────────── */

  function open() {
    if (isOpen) return;
    isOpen = true;
    bubbleEl.classList.add('miyagi-bubble--open');

    relocateChatwootWidget();

    panelEl.style.animation = '';
    panelEl.classList.add('miyagi-panel--open');

    if (window.$chatwoot) window.$chatwoot.toggle('open');
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    bubbleEl.classList.remove('miyagi-bubble--open');

    if (window.$chatwoot) window.$chatwoot.toggle('close');

    var isMobile = window.innerWidth < 640;
    panelEl.style.animation = isMobile
      ? 'miyagi-slide-down 260ms cubic-bezier(0.4,0,1,0.6) both'
      : 'lg-collapse 260ms ease both';

    setTimeout(function () {
      panelEl.classList.remove('miyagi-panel--open');
      panelEl.style.animation = '';
    }, 240);
  }

  function toggle() { if (isOpen) close(); else open(); }

  /* ── Keyboard ──────────────────────────────────────────────────────────── */

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  /* ── Init ──────────────────────────────────────────────────────────────── */

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
