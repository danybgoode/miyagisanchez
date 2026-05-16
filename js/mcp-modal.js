/* ── MCP Setup Modal ─────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var MCP_URL = 'https://bonsaios-mcp.vercel.app/api/mcp';
  var modalEl = null;
  var panelEl = null;

  function buildModal() {
    var el = document.createElement('div');
    el.className = 'lg-overlay';
    el.id = 'mcp-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Run Bonsai OS in Claude');
    el.innerHTML = '<div class="lg-panel" id="mm-panel"></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) { if (e.target === el) closeModal(); });
    return el;
  }

  function render() {
    panelEl = document.getElementById('mm-panel');
    if (!panelEl) return;
    panelEl.innerHTML = buildContent();
    bindEvents();
  }

  function buildContent() {
    return '<div class="bm-content">' +
      '<div class="bm-header">' +
        '<div>' +
          '<span class="bm-event-title">Run Bonsai OS in Claude</span>' +
          '<span class="bm-event-sub">Connects in 2 minutes &mdash; no subscription required</span>' +
        '</div>' +
        '<button class="bm-close-btn" id="mm-close-btn" aria-label="Close">&#x2715;</button>' +
      '</div>' +
      '<div class="bm-body">' +
        '<p class="bm-intro">Connect the Bonsai OS MCP server to Claude and run the full methodology as a native Claude experience.</p>' +
        '<ol class="mm-step-list">' +
          '<li>' +
            '<span class="mm-step-num">1</span>' +
            '<span>Go to <a class="mm-link" href="https://claude.ai/customize/connectors?modal=add-custom-connector" target="_blank" rel="noopener noreferrer">Claude connector settings</a></span>' +
          '</li>' +
          '<li>' +
            '<span class="mm-step-num">2</span>' +
            '<span>Enter a name (e.g. &ldquo;Bonsai&rdquo;) and paste the MCP URL below</span>' +
          '</li>' +
          '<li>' +
            '<span class="mm-step-num">3</span>' +
            '<span>Ask Claude: <em class="mm-em">&ldquo;hi claude i just connected the bonsai connector, what can we do together?&rdquo;</em></span>' +
          '</li>' +
          '<li>' +
            '<span class="mm-step-num">4</span>' +
            '<span>That&rsquo;s it.</span>' +
          '</li>' +
        '</ol>' +
        '<div class="mm-url-row">' +
          '<code class="mm-url-code">' + MCP_URL + '</code>' +
        '</div>' +
        '<button class="bm-submit" id="mm-copy-btn">Copy MCP URL</button>' +
      '</div>' +
    '</div>';
  }

  function bindEvents() {
    var p = panelEl;
    if (!p) return;

    var closeBtn = p.querySelector('#mm-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    var copyBtn = p.querySelector('#mm-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var btn = this;
        navigator.clipboard.writeText(MCP_URL).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy MCP URL'; }, 2000);
        });
      });
    }
  }

  function openModal() {
    if (!modalEl) modalEl = buildModal();
    document.body.classList.add('modal-open');
    modalEl.getBoundingClientRect();
    modalEl.classList.add('is-open');
    render();
  }

  function closeModal() {
    if (!modalEl) return;
    var p = document.getElementById('mm-panel');
    var isMobile = window.innerWidth < 640;
    var anim = isMobile ? 'lg-slide-down 260ms cubic-bezier(0.4,0,1,0.6) both'
                        : 'lg-collapse 260ms ease both';
    if (p) p.style.animation = anim;
    document.body.classList.remove('modal-open');
    setTimeout(function () {
      modalEl.classList.remove('is-open');
      if (p) p.style.animation = '';
    }, 240);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalEl && modalEl.classList.contains('is-open')) closeModal();
  });

  window.openMcpModal  = openModal;
  window.closeMcpModal = closeModal;
})();
