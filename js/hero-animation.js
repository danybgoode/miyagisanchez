/* js/hero-animation.js */

document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".hero-animation-wrapper");
    const scaler = document.querySelector(".hero-animation-scaler");

    if (!wrapper || !scaler || typeof gsap === 'undefined') return;

    // Responsive Scaling Logic
    const TARGET_WIDTH = 500; // The fixed coordinate space width

    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            const wrapperWidth = entry.contentRect.width;
            const scaleFactor = wrapperWidth / TARGET_WIDTH;
            scaler.style.setProperty('--scale-factor', scaleFactor);
        }
    });

    resizeObserver.observe(wrapper);

    /* ─────────────────────────────────────────────
       Config
    ───────────────────────────────────────────── */
    const BUBBLES = [
      { id: '#b-wa',    chaosX:  22, chaosY: -35 },
      { id: '#b-ig',    chaosX: -18, chaosY:  28 },
      { id: '#b-fb',    chaosX:  30, chaosY: -50 },
      { id: '#b-email', chaosX: -10, chaosY:  18 },
      { id: '#b-tg',    chaosX:  14, chaosY:  42 },
    ];
    const CARDS = ['#c-sale', '#c-support', '#c-meeting'];

    const CLAY_SHADOW_NORMAL =
      '10px 10px 24px rgba(109,40,217,0.28),' +
      '-7px -7px 14px rgba(255,255,255,0.92),' +
      'inset 7px 7px 16px rgba(255,255,255,0.52),' +
      'inset -7px -7px 16px rgba(109,40,217,0.22)';

    const CLAY_SHADOW_GLOW =
      '0 0 55px rgba(167,139,250,0.9),' +
      '0 0 110px rgba(167,139,250,0.45),' +
      '10px 10px 24px rgba(109,40,217,0.28),' +
      '-7px -7px 14px rgba(255,255,255,0.92),' +
      'inset 7px 7px 16px rgba(255,255,255,0.52),' +
      'inset -7px -7px 16px rgba(109,40,217,0.22)';

    /* ─────────────────────────────────────────────
       Always-on ambient animations
    ───────────────────────────────────────────── */
    // Pulse rings
    gsap.to('#pr1', { scale: 1.7, opacity: 0, duration: 2.3, repeat: -1, ease: 'power2.out' });
    gsap.to('#pr2', { scale: 2.0, opacity: 0, duration: 3.0, delay: 0.8, repeat: -1, ease: 'power2.out' });

    // Sphere gentle bob
    gsap.to('#sphere-wrap', {
      y: -11,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    /* ─────────────────────────────────────────────
       Helpers
    ───────────────────────────────────────────── */
    function center(el) {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function glowSphere() {
      gsap.timeline()
        .to('#sphere', {
          boxShadow: CLAY_SHADOW_GLOW,
          scale: 1.11,
          duration: 0.16,
          ease: 'power2.out',
        })
        .to('#sphere', {
          boxShadow: CLAY_SHADOW_NORMAL,
          scale: 1,
          duration: 0.45,
          ease: 'elastic.out(1, 0.4)',
        });
    }

    /* ─────────────────────────────────────────────
       Main animation loop
    ───────────────────────────────────────────── */
    function runLoop() {
      const sphereEl = document.querySelector('#sphere');

      // ── Reset ──
      BUBBLES.forEach(b => gsap.set(b.id, { y: -600, x: 0, opacity: 0, scale: 0.7 }));
      CARDS.forEach(c => gsap.set(c, { opacity: 0, y: 70, x: 0, scale: 0.88 }));
      gsap.set('#sphere', { boxShadow: CLAY_SHADOW_NORMAL, scale: 1 });

      const tl = gsap.timeline({
        onComplete: () => gsap.delayedCall(0.6, runLoop),
      });

      /* ── Phase 1: Chaotic entry from left ── */
      BUBBLES.forEach((b, i) => {
        tl.to(b.id, {
          x: b.chaosX,
          y: b.chaosY,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'elastic.out(1, 0.55)',
        }, i * 0.14);
      });

      /* ── Phase 2: Suck into sphere one by one ── */
      tl.addLabel('suck', '+=0.45');

      BUBBLES.forEach((b, i) => {
        tl.add(() => {
          const el   = document.querySelector(b.id);
          const bc   = center(el);
          const sc   = center(sphereEl);
          const dx   = sc.x - bc.x;
          const dy   = sc.y - bc.y;
          const curX = gsap.getProperty(el, 'x');
          const curY = gsap.getProperty(el, 'y');

          gsap.to(b.id, {
            x: curX + dx,
            y: curY + dy,
            scale: 0,
            opacity: 0,
            duration: 0.52,
            ease: 'power3.in',
            onComplete: glowSphere,
          });
        }, `suck+=${i * 0.52}`);
      });

      /* ── Phase 3: Cards slide out from sphere bottom ── */
      const cardsAt = `suck+=${BUBBLES.length * 0.52 + 0.35}`;
      tl.addLabel('cards', cardsAt);

      CARDS.forEach((c, i) => {
        tl.to(c, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'back.out(1.6)',
        }, `cards+=${i * 0.24}`);
      });

      /* ── Hold then clear ── */
      const clearAt = `cards+=${CARDS.length * 0.24 + 2.2}`;
      tl.to(CARDS, {
        opacity: 0,
        y: 60,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.in',
      }, clearAt);
    }

    // Kick off after layout settles
    gsap.delayedCall(0.25, runLoop);
});
