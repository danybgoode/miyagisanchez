// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const syncHeaderOffset = () => {
    const shell = document.querySelector('.shared-header-shell');
    if (!shell) return;
    document.body.style.setProperty('--header-offset', `${shell.offsetHeight}px`);
  };

  const currentUrl = new URL(window.location.href);
  currentUrl.hash = '';

  document.querySelectorAll('[data-dynamic-canonical]').forEach(link => {
    link.setAttribute('href', currentUrl.toString());
  });

  document.querySelectorAll('[data-dynamic-og-url]').forEach(meta => {
    meta.setAttribute('content', currentUrl.toString());
  });

  syncHeaderOffset();
  window.addEventListener('resize', syncHeaderOffset);

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Touch-first press feedback so buttons feel tactile on mobile too.
  const tactileButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .trust-channel-key');
  const clearPressedState = button => {
    button.classList.remove('is-pressed');
  };

  tactileButtons.forEach(button => {
    button.addEventListener('pointerdown', () => {
      button.classList.add('is-pressed');
    });

    ['pointerup', 'pointercancel', 'pointerleave', 'dragstart'].forEach(eventName => {
      button.addEventListener(eventName, () => clearPressedState(button));
    });
  });

  const trustKeys = Array.from(document.querySelectorAll('[data-trust-key]'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animateTrustKeys = (keys, stepMs = 70) => {
    keys.forEach((key, index) => {
      key.classList.remove('is-popping');
      key.style.setProperty('--pop-delay', `${index * stepMs}ms`);
      window.setTimeout(() => {
        key.classList.add('is-popping');
      }, 16);
      window.setTimeout(() => {
        key.classList.remove('is-popping');
        key.style.removeProperty('--pop-delay');
      }, 680 + (index * stepMs));
    });
  };

  const triggerTrustKeyCascade = sourceKey => {
    if (trustKeys.length < 2 || prefersReducedMotion.matches) return;

    const availableKeys = trustKeys.filter(key => key !== sourceKey);
    const popCount = Math.min(availableKeys.length, window.innerWidth < 768 ? 2 : 3);
    const selectedKeys = availableKeys
      .sort(() => Math.random() - 0.5)
      .slice(0, popCount);

    animateTrustKeys(selectedKeys, 70);
  };

  trustKeys.forEach(key => {
    key.addEventListener('click', () => {
      triggerTrustKeyCascade(key);
    });
  });

  let trustIntroHasPlayed = false;
  const playTrustKeyIntro = () => {
    if (trustIntroHasPlayed || trustKeys.length === 0 || prefersReducedMotion.matches) return;
    trustIntroHasPlayed = true;
    animateTrustKeys(trustKeys, 65);
  };

  if (document.visibilityState === 'visible') {
    window.setTimeout(playTrustKeyIntro, 900);
  } else {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        window.setTimeout(playTrustKeyIntro, 300);
      }
    }, { once: true });
  }

  // Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }

        window.scrollTo({
          top: targetElement.offsetTop - 44, // Account for sticky header
          behavior: 'smooth'
        });
      }
    });
  });

});
