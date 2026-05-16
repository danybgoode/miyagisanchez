/* ── Miyagi Chat Widget ───────────────────────────────────────────────────── */
(function () {
  'use strict';

  var bubbleEl    = null;
  var panelEl     = null;
  var isOpen      = false;
  var widgetMoved = false;
  var isChatting  = false; /* user has clicked Start Conversation */

  /* ── Language helper ───────────────────────────────────────────────────── */

  var copy = {
    en: {
      greeting : 'Hey there! 👋',
      sub      : "I’m Miyagi. Ask me anything about Bonsai.",
      start    : 'Start Conversation',
      online   : 'Online — replies fast',
      end      : 'End chat',
    },
    es: {
      greeting : '¡Hola! 👋',
      sub      : 'Soy Miyagi. Pregúntame lo que quieras sobre Bonsai.',
      start    : 'Iniciar conversación',
      online   : 'En línea — respondo rápido',
      end      : 'Terminar chat',
    }
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
      '<div class="miyagi-panel-body">' +
        '<div class="miyagi-prechat" id="miyagi-prechat">' +
          '<div class="miyagi-prechat-inner">' +
            '<img class="miyagi-prechat-img" src="miyagilistening.png"' +
                 ' alt="" draggable="false">' +
            '<p class="miyagi-prechat-greeting">' + t('greeting') + '</p>' +
            '<p class="miyagi-prechat-sub">' + t('sub') + '</p>' +
            '<button class="miyagi-start-btn" id="miyagi-start">' +
              t('start') +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(el);
    el.querySelector('#miyagi-close').addEventListener('click', close);
    el.querySelector('#miyagi-end').addEventListener('click', endConversation);
    el.querySelector('#miyagi-start').addEventListener('click', startConversation);
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

  /* ── Pre-chat / conversation state ─────────────────────────────────────── */

  function showPrechat() {
    var pc     = document.getElementById('miyagi-prechat');
    var endBtn = document.getElementById('miyagi-end');
    if (pc)     pc.classList.remove('miyagi-prechat--gone');
    if (endBtn) endBtn.classList.remove('miyagi-end-btn--visible');
    isChatting = false;
  }

  function startConversation() {
    var pc     = document.getElementById('miyagi-prechat');
    var endBtn = document.getElementById('miyagi-end');
    if (pc)     pc.classList.add('miyagi-prechat--gone');
    if (endBtn) endBtn.classList.add('miyagi-end-btn--visible');
    isChatting = true;
    sessionStorage.setItem('miyagi_chatting', '1');
    if (window.$chatwoot) window.$chatwoot.toggle('open');
  }

  function endConversation() {
    sessionStorage.removeItem('miyagi_chatting');
    showPrechat();
    /* Attempt graceful Chatwoot reset */
    if (window.$chatwoot && typeof window.$chatwoot.reset === 'function') {
      window.$chatwoot.reset();
    } else {
      /* Fallback: clear Chatwoot localStorage and reload the iframe */
      Object.keys(localStorage).forEach(function (k) {
        if (/^cw_/.test(k)) localStorage.removeItem(k);
      });
      var old = document.getElementById('cw-widget-holder');
      if (old && old.parentNode) old.parentNode.removeChild(old);
      widgetMoved = false;
      if (window.chatwootSDK) {
        window.chatwootSDK.run({
          websiteToken: '1xQzZkDhjgc6z8B8DXosEXKF',
          baseUrl: 'https://chat.despachobonsai.com'
        });
        document.addEventListener('chatwoot:ready', function once() {
          relocateChatwootWidget();
          document.removeEventListener('chatwoot:ready', once);
        });
      }
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

    /* Restore conversation or show pre-chat */
    if (sessionStorage.getItem('miyagi_chatting')) {
      startConversation();
    } else {
      showPrechat();
    }
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
