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

  // ── Liquid-Glass Nav scroll state ─────────────────────────────────────── //
  const header = document.querySelector('.main-header');

  if (header) {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });
  }

  // ── Footer Aquarium — Oil/Paint Physics ────────────────────────────────── //
  // Social icons float in a thick viscous liquid. Scroll velocity imparts an
  // upward impulse (liquid displaced downward, icons ride up), then the slow
  // spring drags them back. Each icon has a unique mass/phase offset so they
  // settle at different rates — natural buoyancy variance.
  const floatIcons = Array.from(document.querySelectorAll('.main-footer .social-icon-link'));

  if (floatIcons.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Per-icon physics state
    const state = floatIcons.map((_, i) => ({
      y: 0,      // current vertical offset px (positive = down)
      vel: 0,    // current velocity px/frame
      mass: 0.9 + i * 0.07,   // heavier icons lag more
      phase: i * 0.31,         // sin phase for idle bob
    }));

    let prevScrollY = window.scrollY;
    let scrollImpulse = 0;
    let oilRaf = null;

    const STIFFNESS = 0.009;   // very slow spring — oil weight
    const DAMPING   = 0.955;   // high damping — viscous, not bouncy
    const MAX_DISP  = 10;      // px — icons don't travel far

    const oilStep = (t) => {
      let allSettled = true;
      floatIcons.forEach((el, i) => {
        const s = state[i];
        // idle bob: tiny sinusoidal float even at rest
        const bob = Math.sin(t * 0.0006 + s.phase) * 1.4;
        const target = bob;
        const spring = (target - s.y) * STIFFNESS / s.mass;
        s.vel = s.vel * DAMPING + spring + (scrollImpulse / s.mass) * 0.28;
        s.y   = Math.max(-MAX_DISP, Math.min(MAX_DISP, s.y + s.vel));
        el.style.setProperty('--fy', s.y.toFixed(2));
        if (Math.abs(s.vel) > 0.01 || Math.abs(s.y - target) > 0.05) allSettled = false;
      });
      scrollImpulse *= 0.78;  // impulse decays quickly
      oilRaf = requestAnimationFrame(oilStep);
    };

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const v = y - prevScrollY;
      prevScrollY = y;
      // Downward scroll → positive impulse pushes icons up (negative Y = up)
      scrollImpulse += -v * 0.55;
      scrollImpulse = Math.max(-18, Math.min(18, scrollImpulse));
    }, { passive: true });

    oilRaf = requestAnimationFrame(oilStep);
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Touch-first press feedback so buttons feel tactile on mobile too.
  const tactileButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-purple, .glass-button, .trust-channel-key');
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
