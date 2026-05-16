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
          <img src="assets/brand/bonsai-mark.svg" class="logo-mark" alt="">
          <span class="logo-wordmark">bonsai</span>
        </div>
      </a>
    `;

    const languageSwitcher = `
      <div class="lang-switcher" style="display:flex; gap: 0; margin-left: auto; margin-right: 10px;">
        <button class="btn-secondary lang-btn" onclick="setLanguage('en')" style="padding: 6px 10px; font-size: 12px; border-radius: 12px 0 0 12px; min-width: 40px; height: 32px;">EN</button>
        <button class="btn-secondary lang-btn" onclick="setLanguage('es')" style="padding: 6px 10px; font-size: 12px; border-radius: 0 12px 12px 0; min-width: 40px; height: 32px; border-left: 0;">ES</button>
      </div>
    `;

    const socialIcons = `
      <div class="social-icons">
        <a href="https://www.facebook.com/people/Despacho-Bonsai/61572082478661/" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="Facebook">
          <img src="assets/social/icons8-facebook-64.png" alt="Facebook" class="social-icon-img">
        </a>
        <a href="https://www.instagram.com/miyagi_sanchez" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="Instagram">
          <img src="assets/social/icons8-instagram-64.png" alt="Instagram" class="social-icon-img">
        </a>
        <a href="https://www.tiktok.com/@miyagi_sanchez" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="TikTok">
          <img src="assets/social/icons8-tiktok-64.png" alt="TikTok" class="social-icon-img">
        </a>
        <a href="https://x.com/miyagi_sanchez" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="Twitter">
          <img src="assets/social/icons8-twitter-bird-64.png" alt="Twitter" class="social-icon-img">
        </a>
        <a href="https://wa.me/525599629166?text=Hola%2C%20me%20podr%C3%ADan%20dar%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20servicio%20de%20Despacho%20Bonsai%3F" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="WhatsApp">
          <img src="assets/social/icons8-whatsapp-64.png" alt="WhatsApp" class="social-icon-img">
        </a>
      </div>
    `;

    const navSets = {
      bonsai: `
        <a href="bonsai-academy.html">Bonsai Academy</a>
        <a href="bonsai-commerce.html">Bonsai Commerce</a>
      `,
      home: `
        <a href="bonsai-academy.html">Bonsai Academy</a>
        <a href="bonsai-commerce.html">Bonsai Commerce</a>
      `,
      commerce: `
        <a href="bonsai-academy.html">Bonsai Academy</a>
        <a href="bonsai-commerce.html">Bonsai Commerce</a>
      `,
      marketing: `
        <a href="bonsai-academy.html">Bonsai Academy</a>
        <a href="bonsai-commerce.html">Bonsai Commerce</a>
      `,
      legal: `
        <a href="bonsai-academy.html">Bonsai Academy</a>
        <a href="bonsai-commerce.html">Bonsai Commerce</a>
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
                <button class="glass-button" onclick="openBookingModal()" data-i18n="nav_get_started">Book a call</button>
              </nav>
            </div>
          </header>
          <div class="lg-nav-drip" aria-hidden="true"></div>
        </div>
      `;
    }

    if (footerTarget) {
      footerTarget.innerHTML = `
        <footer class="main-footer">
          <div class="container">
            ${logo}
            ${socialIcons}
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
