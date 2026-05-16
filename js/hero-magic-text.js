(() => {
  const card = document.querySelector('.hero-magic-card');
  const canvas = document.querySelector('[data-hero-magic-canvas]');
  const text = document.querySelector('[data-hero-magic-text]');

  if (!card || !canvas || !text) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const particles = [];
  const MAX_PARTICLES = 520;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let last = performance.now();
  let rafId = null;

  const rand = (min, max) => min + Math.random() * (max - min);
  const lerp = (a, b, t) => a + (b - a) * t;

  function resizeCanvas() {
    const rect = card.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getMagicRects() {
    const cardRect = card.getBoundingClientRect();
    const rects = [];

    text.querySelectorAll('[data-fx]').forEach(span => {
      for (const r of span.getClientRects()) {
        if (r.width < 1 || r.height < 1) continue;
        rects.push({
          fx: span.dataset.fx,
          left: r.left - cardRect.left,
          top: r.top - cardRect.top,
          right: r.right - cardRect.left,
          bottom: r.bottom - cardRect.top,
          width: r.width,
          height: r.height,
        });
      }
    });

    return rects;
  }

  let lastBoltAt = 0;
  let nextBoltDelay = 1500;

  function spawnLightning(rect, now) {
    if (Math.random() < 0.36) {
      particles.push({
        type: 'lspark',
        x: rect.left + Math.random() * rect.width,
        y: rect.top + Math.random() * rect.height,
        vx: rand(-0.62, 0.62),
        vy: rand(-0.56, 0.56),
        life: 0,
        ttl: rand(160, 360),
        size: rand(0.45, 1.1),
      });
    }

    if (now - lastBoltAt <= nextBoltDelay) return;

    lastBoltAt = now;
    nextBoltDelay = rand(1800, 3400);

    const startX = rect.left + rand(rect.width * 0.18, rect.width * 0.82);
    const startY = rect.top - rand(16, 34);
    const endX = startX + rand(-70, 70);
    const endY = rect.top + rect.height * rand(0.15, 0.55);
    const path = makeBoltPath(startX, startY, endX, endY, 7, 10, 7);
    const branches = [];

    if (path.length > 4 && Math.random() < 0.8) {
      const root = path[2 + Math.floor(Math.random() * (path.length - 4))];
      branches.push(makeBoltPath(root.x, root.y, root.x + rand(-44, 44), root.y + rand(-34, 26), 4, 8, 6));
    }

    particles.push({ type: 'bolt', path, branches, life: 0, ttl: 360 });
  }

  function spawnJade(rect) {
    if (Math.random() > 0.14) return;

    particles.push({
      type: 'jadeCaustic',
      x: rect.left + rand(rect.width * 0.15, rect.width * 0.85),
      y: rect.top + rand(rect.height * 0.18, rect.height * 0.78),
      life: 0,
      ttl: rand(1300, 2200),
      radius: rect.height * rand(0.22, 0.48),
    });
  }

  function makeBoltPath(x1, y1, x2, y2, segments, jitterX, jitterY) {
    const points = [{ x: x1, y: y1 }];
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      points.push({
        x: lerp(x1, x2, t) + rand(-jitterX, jitterX),
        y: lerp(y1, y2, t) + rand(-jitterY, jitterY),
      });
    }
    points.push({ x: x2, y: y2 });
    return points;
  }

  function emit(rects, now) {
    if (reduceMotion.matches) return;

    rects.forEach(rect => {
      if (rect.bottom < -40 || rect.top > canvas.clientHeight + 40) return;

      switch (rect.fx) {
        case 'lightning':
          spawnLightning(rect, now);
          break;
        case 'jade':
          spawnJade(rect);
          break;
        default:
          break;
      }
    });
  }

  function update(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += dt;

      if (p.life >= p.ttl) {
        particles.splice(i, 1);
        continue;
      }

      switch (p.type) {
        case 'lspark':
          p.x += p.vx;
          p.y += p.vy;
          break;
        default:
          break;
      }
    }

    if (particles.length > MAX_PARTICLES) {
      particles.splice(0, particles.length - MAX_PARTICLES);
    }
  }

  function renderAuras(rects) {
    rects.forEach(rect => {
      switch (rect.fx) {
        case 'fire':
          auraFire(rect);
          break;
        case 'lightning':
          auraLightning(rect);
          break;
        case 'gold':
          auraChrome(rect);
          break;
        case 'jade':
          auraJade(rect);
          break;
        default:
          break;
      }
    });
  }

  function auraFire(rect) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.bottom - rect.height * 0.05;
    const rx = Math.max(rect.width * 0.88, rect.height * 1.4);
    const ry = rect.height * 0.95;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    gradient.addColorStop(0, 'rgba(255, 170, 70, 0.24)');
    gradient.addColorStop(0.42, 'rgba(255, 85, 28, 0.12)');
    gradient.addColorStop(1, 'rgba(255, 70, 20, 0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function auraLightning(rect) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = Math.max(rect.width * 0.95, rect.height * 2.4);
    const ry = rect.height * 1.6;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    gradient.addColorStop(0, 'rgba(160, 210, 255, 0.18)');
    gradient.addColorStop(0.55, 'rgba(80, 145, 255, 0.07)');
    gradient.addColorStop(1, 'rgba(80, 145, 255, 0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function auraChrome(rect) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, rect.width * 0.78);
    gradient.addColorStop(0, 'rgba(230, 238, 248, 0.08)');
    gradient.addColorStop(0.72, 'rgba(178, 196, 220, 0.035)');
    gradient.addColorStop(1, 'rgba(178, 196, 220, 0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rect.width * 0.82, rect.height * 0.95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function auraJade(rect) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, rect.width * 0.9);
    gradient.addColorStop(0, 'rgba(148, 235, 188, 0.14)');
    gradient.addColorStop(0.58, 'rgba(56, 180, 118, 0.07)');
    gradient.addColorStop(1, 'rgba(20, 92, 70, 0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rect.width * 0.92, rect.height * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function renderParticles() {
    ctx.globalCompositeOperation = 'lighter';

    particles.forEach(p => {
      const t = p.life / p.ttl;

      switch (p.type) {
        case 'lspark': {
          const alpha = 1 - t;
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4.4);
          gradient.addColorStop(0, `rgba(245, 250, 255, ${alpha})`);
          gradient.addColorStop(1, 'rgba(120, 178, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4.4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'bolt': {
          const alpha = Math.max(0, 1 - t * 1.45);
          drawBolt(p.path, alpha);
          p.branches.forEach(path => drawBolt(path, alpha * 0.68));
          break;
        }
        case 'jadeCaustic': {
          const alpha = Math.sin(t * Math.PI) * 0.22;
          ctx.strokeStyle = `rgba(188, 255, 222, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.radius * (0.6 + t), p.radius * (0.22 + t * 0.2), -0.25, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }
        default:
          break;
      }
    });

    ctx.globalCompositeOperation = 'source-over';
  }

  function drawBolt(path, alpha) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    strokePath(path, `rgba(112, 174, 255, ${alpha * 0.28})`, 8);
    strokePath(path, `rgba(186, 221, 255, ${alpha * 0.64})`, 2.7);
    strokePath(path, `rgba(250, 253, 255, ${alpha})`, 1.15);
  }

  function strokePath(path, style, width) {
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.beginPath();
    path.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }

  function frame(now) {
    const dt = Math.min(64, now - last);
    last = now;

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    if (!reduceMotion.matches) {
      const rects = getMagicRects();
      emit(rects, now);
      update(dt);
      renderParticles();
      rafId = requestAnimationFrame(frame);
      return;
    }

    particles.length = 0;
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    resizeCanvas();
    if (rafId) cancelAnimationFrame(rafId);
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  const resizeObserver = new ResizeObserver(start);
  resizeObserver.observe(card);

  const mutationObserver = new MutationObserver(() => {
    particles.length = 0;
    resizeCanvas();
  });
  mutationObserver.observe(text, { childList: true, subtree: true, characterData: true });

  window.addEventListener('resize', resizeCanvas, { passive: true });
  reduceMotion.addEventListener('change', start);

  start();
})();
