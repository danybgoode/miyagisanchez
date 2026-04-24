(() => {
  function renderSharedShell() {
    const body = document.body;
    if (!body) return;

    const headerTarget = document.querySelector('[data-shared-header]');
    const footerTarget = document.querySelector('[data-shared-footer]');
    const shellNav = body.dataset.shellNav || 'marketing';

    const logo = `
      <a href="index.html" class="logo-link" aria-label="Bonsai home">
        <div class="logo">
          <img src="bonsai-logo-white-assets/bonsai-logo-white.svg" class="logo-mark" alt="Bonsai">
        </div>
      </a>
    `;

    const languageSwitcher = `
      <div class="lang-switcher" style="display:flex; gap: 0; margin-left: auto; margin-right: 10px;">
        <button class="btn-secondary lang-btn" onclick="setLanguage('en')" style="padding: 6px 10px; font-size: 12px; border-radius: 12px 0 0 12px; min-width: 40px; height: 32px;">EN</button>
        <button class="btn-secondary lang-btn" onclick="setLanguage('es')" style="padding: 6px 10px; font-size: 12px; border-radius: 0 12px 12px 0; min-width: 40px; height: 32px; border-left: 0;">ES</button>
      </div>
    `;

    const navSets = {
      home: `
        <a href="#features" data-i18n="nav_features">Features</a>
        <a href="#pricing" data-i18n="nav_pricing">Pricing</a>
      `,
      marketing: `
        <a href="#features" data-i18n="nav_features">Features</a>
        <a href="#how-it-works" data-i18n="nav_how_it_works">How It Works</a>
        <a href="#pricing" data-i18n="nav_pricing">Pricing</a>
      `,
      legal: `
        <a href="index.html#features" data-i18n="nav_features">Features</a>
        <a href="index.html#pricing" data-i18n="nav_pricing">Pricing</a>
      `
    };

    if (headerTarget) {
      headerTarget.innerHTML = `
        <div class="shared-header-shell">
          <header class="main-header" id="nav">
            <div class="container nav-container">
              ${logo}
              ${languageSwitcher}
              <button class="btn-secondary mobile-menu-btn" data-i18n-aria-label="nav_menu" aria-label="Menu">
                <span class="hamburger-lines" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
              <nav class="nav-links">
                ${(navSets[shellNav] || navSets.marketing).trim()}
                <a href="https://dashboard.despachobonsai.com/sign-up?plan=pro" class="btn-primary" data-i18n="nav_get_started">Get Started</a>
              </nav>
            </div>
          </header>
        </div>
      `;
    }

    if (footerTarget) {
      footerTarget.innerHTML = `
        <footer class="main-footer">
          <div class="container">
            ${logo}
            <div class="footer-links">
              <a href="privacy.html" class="text-muted" data-i18n="footer_privacy">Privacy Policy</a>
              <a href="terms.html" class="text-muted" data-i18n="footer_terms">Terms of Service</a>
              <a href="cookies.html" class="text-muted" data-i18n="footer_cookies">Cookie Policy</a>
            </div>
            <p class="footer-text text-secondary" data-i18n="footer_copy">&copy; 2025 Despacho Bonsai. All rights reserved.</p>
          </div>
        </footer>
      `;
    }
  }

  window.renderSharedShell = renderSharedShell;
})();
