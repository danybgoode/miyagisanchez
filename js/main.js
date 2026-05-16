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

  // ── Liquid-Glass Nav (iOS 26 HIG) ──────────────────────────────────────── //
  // The drip strip below the nav deforms like molten glass as content
  // scrolls under it. A 9-point wave polygon is driven by scroll velocity
  // and settles back to flat via spring physics.
  const header = document.querySelector('.main-header');
  const drip   = document.querySelector('.lg-nav-drip');

  if (header) {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  if (header && drip) {
    let prevY       = window.scrollY;
    let rafId       = null;
    let dripTimer   = null;

    // 9 control points evenly spaced along the top edge of the drip strip.
    // Each value is Y% within the strip (0 = top / flush with nav, 100 = bottom).
    const N  = 9;
    const PX = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
    const cur = new Array(N).fill(0);   // current interpolated positions
    const tgt = new Array(N).fill(0);   // spring targets

    const buildPolygon = () =>
      'polygon(' + cur.map((v, i) => `${PX[i]}% ${v.toFixed(2)}%`).join(',') + ',100% 100%,0% 100%)';

    // Spring step — runs via rAF until all points are settled
    const springStep = () => {
      let settled = true;
      for (let i = 0; i < N; i++) {
        const d = tgt[i] - cur[i];
        if (Math.abs(d) > 0.05) { cur[i] += d * 0.13; settled = false; }
        else cur[i] = tgt[i];
      }
      drip.style.clipPath = buildPolygon();
      rafId = settled ? null : requestAnimationFrame(springStep);
    };

    // Generate a sinusoidal wave whose amplitude is proportional to velocity.
    // A Gaussian envelope tapers the wave to zero at both side edges so the
    // left and right corners stay sharp (no liquid "bleed" off-screen).
    const triggerWave = (velocity) => {
      const speed = Math.min(Math.abs(velocity), 24);
      const dir   = velocity > 0 ? 0 : Math.PI;         // phase: down vs up scroll
      const amp   = speed * 3.8;                         // max ~91 % at speed 24

      for (let i = 0; i < N; i++) {
        const t   = i / (N - 1);                         // 0 → 1
        const env = Math.sin(t * Math.PI);               // tapers to 0 at edges
        tgt[i] = Math.max(0, Math.min(90,
          env * amp * (0.5 + 0.5 * Math.sin(t * Math.PI * 2.4 + dir))
        ));
      }

      drip.classList.add('is-active');
      if (!rafId) rafId = requestAnimationFrame(springStep);

      clearTimeout(dripTimer);
      dripTimer = setTimeout(() => {
        tgt.fill(0);                                    // return to flat
        if (!rafId) rafId = requestAnimationFrame(springStep);
        setTimeout(() => drip.classList.remove('is-active'), 560);
      }, 190);
    };

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const v = y - prevY;
      prevY = y;

      header.classList.toggle('is-scrolled', y > 12);
      if (Math.abs(v) > 1.5) triggerWave(v);
    }, { passive: true });
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
