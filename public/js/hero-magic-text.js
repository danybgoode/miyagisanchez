// Magic card FX: one WebGL2 canvas behind the card text.
//
// Two programs, both instanced:
//   · fields  — per-word shader regions: fire (domain-warped fbm flames), smoke (advected fbm wisps), glows.
//   · sprites — CPU-simulated particles drawn as soft discs, star glints and glowing segments (embers, bolts, arcs).
// The words themselves stay real DOM text styled in CSS (globals.css .magic-word-*); this layer only lights them.
// Word rects are cached and re-measured on resize, font load and i18n swaps, never per frame. The loop pauses
// offscreen and in background tabs; reduced motion gets a single still frame. GPU budget: the effects are soft
// light, so they render at 1x pixel density and 30 fps, and the front layer is skipped while it has nothing to draw.
(() => {
  const cards = document.querySelectorAll('.hero-magic-card');
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rand = (a, b) => a + Math.random() * (b - a);

  const NOISE = `
    float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
      for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
      return v;
    }`;

  // ── fields ────────────────────────────────────────────────────────────────
  const FIELD_VS = `#version 300 es
    layout(location = 0) in vec2 a_corner;
    layout(location = 1) in vec4 i_rect;    // region x0, y0, x1, y1 (CSS px)
    layout(location = 2) in vec4 i_params;  // kind, seed, intensity, word height (px)
    layout(location = 3) in vec4 i_word;    // word rect relative to the region: x0, y0, x1, y1 (px)
    uniform vec2 u_res;
    out vec2 v_px; out vec2 v_size; flat out vec4 v_params; flat out vec4 v_word;
    void main() {
      vec2 pos = mix(i_rect.xy, i_rect.zw, a_corner);
      v_size = i_rect.zw - i_rect.xy;
      v_px = a_corner * v_size;
      v_params = i_params; v_word = i_word;
      vec2 clip = pos / u_res * 2.0 - 1.0;
      gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    }`;

  const FIELD_FS = `#version 300 es
    precision highp float;
    in vec2 v_px; in vec2 v_size; flat in vec4 v_params; flat in vec4 v_word;
    uniform float u_time;
    out vec4 o;
    ${NOISE}
    vec3 fireRamp(float f) {
      vec3 c = mix(vec3(0.45, 0.04, 0.0), vec3(1.0, 0.36, 0.04), smoothstep(0.05, 0.45, f));
      c = mix(c, vec3(1.0, 0.78, 0.32), smoothstep(0.45, 0.8, f));
      return mix(c, vec3(1.0, 0.97, 0.86), smoothstep(0.8, 1.0, f));
    }
    void main() {
      int kind = int(v_params.x + 0.5);
      float seed = v_params.y, I = v_params.z, h = v_params.w;
      // Word-height units: y up from the word's bottom edge, x from the word's left edge.
      float x = (v_px.x - v_word.x) / h;
      float y = (v_word.w - v_px.y) / h;
      float ww = (v_word.z - v_word.x) / h;
      float t = u_time;

      if (kind == 0) {            // fire: flame tongues licking up from the word
        vec2 q = vec2(x * 1.7, y * 1.25 - t * 2.1) + seed;
        float w = fbm(q * 0.85 + vec2(0.0, t * 0.35));
        float n = fbm(q + vec2(w * 1.1, -w * 0.4));
        float side = smoothstep(-0.25, 0.25, x) * smoothstep(-0.25, 0.25, ww - x);
        float f = (n - 0.17) * 2.7 - y * 0.62;
        f *= side * smoothstep(-0.1, 0.35, y);
        f = clamp(f, 0.0, 1.0);
        f *= mix(0.4, 1.0, smoothstep(0.6, 1.1, y));   // calmer behind the glyphs, freer above them
        o = vec4(fireRamp(f) * pow(f, 1.15) * 1.6 * I, 0.0);
      } else if (kind == 1) {     // smoke: slow advected wisps drifting up and right
        float ts = t * 0.32;
        vec2 p = vec2(x - y * 0.18, y);
        vec2 warp = vec2(fbm(p * 0.9 + vec2(seed, -ts)), fbm(p * 0.9 + vec2(seed + 5.2, -ts * 1.2)));
        float d = fbm(p * vec2(1.5, 0.95) + warp * 1.7 + vec2(-ts * 0.4, -ts * 1.6));
        float src = smoothstep(0.3, 0.9, y) * (1.0 - smoothstep(1.1, 2.9, y));
        float side = smoothstep(-0.2, 0.5, x - y * 0.15) * smoothstep(-0.4, 0.4, ww - x + y * 0.45);
        float strands = pow(1.0 - abs(d * 2.0 - 1.0), 5.0);   // ridged noise: thin curling filaments
        float a = (smoothstep(0.38, 0.72, d) * 0.45 + strands * 0.75) * src * side;
        vec3 col = mix(vec3(0.84, 0.7, 0.98), vec3(0.62, 0.56, 0.72), clamp((y - 1.0) / 1.6, 0.0, 1.0));
        a *= 0.7 * I;
        o = vec4(col * a, a);
      } else {                    // glows: soft elliptical light pools under each word
        vec2 c = (v_px / v_size - 0.5) * 2.0;
        float g = exp(-dot(c, c) * 2.6);
        vec3 col = kind == 2 ? vec3(1.0, 0.42, 0.1) : kind == 3 ? vec3(1.0, 0.76, 0.32)
                 : kind == 4 ? vec3(0.42, 0.62, 1.0) : vec3(0.6, 0.42, 0.85);
        o = vec4(col * g * I, 0.0);
      }
    }`;

  // ── sprites ───────────────────────────────────────────────────────────────
  const SPRITE_VS = `#version 300 es
    layout(location = 0) in vec2 a_corner;  // -1..1
    layout(location = 1) in vec4 i_pts;     // p0.xy, p1.xy
    layout(location = 2) in vec4 i_color;   // premultiplied rgb, a (0 = additive)
    layout(location = 3) in vec4 i_shape;   // radius or width, kind, white-hot core, unused
    uniform vec2 u_res;
    out vec2 v_local; flat out vec4 v_color; flat out vec4 v_shape; flat out float v_half;
    void main() {
      int kind = int(i_shape.y + 0.5);
      float r = i_shape.x;
      vec2 pos;
      v_half = 0.0;
      if (kind == 2) {                       // segment or streak: oriented box around p0 → p1
        vec2 d = i_pts.zw - i_pts.xy;
        float len = length(d);
        vec2 dir = len > 0.001 ? d / len : vec2(1.0, 0.0);
        vec2 nrm = vec2(-dir.y, dir.x);
        float ext = r * 5.0;
        v_half = len * 0.5;
        v_local = vec2(a_corner.x * (v_half + ext), a_corner.y * ext);
        pos = (i_pts.xy + i_pts.zw) * 0.5 + dir * v_local.x + nrm * v_local.y;
      } else {                               // disc or star around p0
        float ext = r * (kind == 1 ? 9.0 : 4.0);
        v_local = a_corner * ext;
        pos = i_pts.xy + v_local;
      }
      v_color = i_color; v_shape = i_shape;
      vec2 clip = pos / u_res * 2.0 - 1.0;
      gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    }`;

  const SPRITE_FS = `#version 300 es
    precision highp float;
    in vec2 v_local; flat in vec4 v_color; flat in vec4 v_shape; flat in float v_half;
    out vec4 o;
    void main() {
      int kind = int(v_shape.y + 0.5);
      float r = v_shape.x, core = v_shape.z;
      float a, hot;
      if (kind == 0) {                       // soft disc with a hot centre
        float d = length(v_local) / r;
        a = exp(-d * d * 1.6) + exp(-d * 1.4) * 0.25;
        hot = exp(-d * d * 5.0);
      } else if (kind == 1) {                // four-point star glint
        vec2 q = abs(v_local) / r;
        a = exp(-dot(q, q) * 2.2) + (exp(-q.y * 7.0) * exp(-q.x * 0.42) + exp(-q.x * 7.0) * exp(-q.y * 0.42)) * 0.7;
        hot = exp(-dot(q, q) * 6.0);
      } else {                               // glowing segment: white core, coloured halo
        float along = max(abs(v_local.x) - v_half, 0.0);
        float d = length(vec2(along, v_local.y)) / r;
        a = exp(-d * 0.95) * 0.55;
        hot = exp(-d * d * 3.0);
      }
      o = vec4(v_color.rgb * a + vec3(hot * core), v_color.a * a);
    }`;

  // ── composite ─────────────────────────────────────────────────────────────
  // Light is accumulated additively (alpha 0) in an offscreen HDR buffer, which a browser compositor would drop
  // as invalid premultiplied colour. This pass tone-maps it (soft highlight roll-off instead of hard clipping)
  // and derives a valid alpha from the light itself.
  const COMPOSITE_VS = `#version 300 es
    out vec2 v_uv;
    void main() {
      vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
      v_uv = p;
      gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
    }`;

  const COMPOSITE_FS = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    uniform sampler2D u_tex;
    out vec4 o;
    void main() {
      vec4 c = texture(u_tex, v_uv);
      vec3 m = 1.0 - exp(-c.rgb * 1.2);
      o = vec4(m, max(c.a, max(m.r, max(m.g, m.b))));
    }`;

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  function program(gl, vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  // A unit quad (attribute 0) plus an instance buffer split into `vec4s` vec4 attributes (1..n).
  function instancedVao(gl, corners, vec4s) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const inst = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, inst);
    for (let i = 0; i < vec4s; i++) {
      gl.enableVertexAttribArray(1 + i);
      gl.vertexAttribPointer(1 + i, 4, gl.FLOAT, false, vec4s * 16, i * 16);
      gl.vertexAttribDivisor(1 + i, 1);
    }
    gl.bindVertexArray(null);
    return { vao, inst };
  }

  const FIELD_KIND = { fire: 0, smoke: 1 };
  const GLOW_KIND = { fire: 2, gold: 3, lightning: 4, smoke: 5 };
  const GLOW = { fire: 0.42, gold: 0.14, lightning: 0.16, smoke: 0.1 };
  const MAX_FIELDS = 64;
  const MAX_SPRITES = 900;
  // Sprites drawn in front of the text: highlights that catch the letters, plus each bolt's impact flash.
  // Everything else, bolt channels included, stays behind the text so no line is ever covered.
  const FRONT = new Set(['glint', 'spark']);
  const MAX_DPR = 1;
  const FRAME_MS = 1000 / 30;

  // One WebGL2 canvas with its programs and HDR target. A card has two: behind the text and in front of it.
  function Layer(canvas) {
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return null;
    let fieldProg, spriteProg, compositeProg;
    try {
      fieldProg = program(gl, FIELD_VS, FIELD_FS);
      spriteProg = program(gl, SPRITE_VS, SPRITE_FS);
      compositeProg = program(gl, COMPOSITE_VS, COMPOSITE_FS);
    } catch (err) {
      console.warn('[magic-card] shader setup failed', err);
      return null;
    }
    const fieldVao = instancedVao(gl, [0, 0, 1, 0, 0, 1, 1, 1], 3);
    const spriteVao = instancedVao(gl, [-1, -1, 1, -1, -1, 1, 1, 1], 3);
    const uField = { res: gl.getUniformLocation(fieldProg, 'u_res'), time: gl.getUniformLocation(fieldProg, 'u_time') };
    const uSprite = { res: gl.getUniformLocation(spriteProg, 'u_res') };
    const emptyVao = gl.createVertexArray();

    // HDR target when the GPU can render to half floats, plain RGBA8 otherwise.
    const hdr = !!gl.getExtension('EXT_color_buffer_float');
    const target = gl.createTexture();
    const fbo = gl.createFramebuffer();
    let width = 1, height = 1;

    return {
      canvas,
      resize(w, h, dpr) {
        width = w;
        height = h;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        gl.bindTexture(gl.TEXTURE_2D, target);
        gl.texImage2D(gl.TEXTURE_2D, 0, hdr ? gl.RGBA16F : gl.RGBA8, canvas.width, canvas.height, 0,
          gl.RGBA, hdr ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      },
      render(time, fields, n, sprites, m) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        if (n) {
          gl.useProgram(fieldProg);
          gl.uniform2f(uField.res, width, height);
          gl.uniform1f(uField.time, time);
          gl.bindVertexArray(fieldVao.vao);
          gl.bindBuffer(gl.ARRAY_BUFFER, fieldVao.inst);
          gl.bufferData(gl.ARRAY_BUFFER, fields.subarray(0, n * 12), gl.DYNAMIC_DRAW);
          gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n);
        }
        if (m) {
          gl.useProgram(spriteProg);
          gl.uniform2f(uSprite.res, width, height);
          gl.bindVertexArray(spriteVao.vao);
          gl.bindBuffer(gl.ARRAY_BUFFER, spriteVao.inst);
          gl.bufferData(gl.ARRAY_BUFFER, sprites.subarray(0, m * 12), gl.DYNAMIC_DRAW);
          gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, m);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.disable(gl.BLEND);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(compositeProg);
        gl.bindTexture(gl.TEXTURE_2D, target);
        gl.bindVertexArray(emptyVao);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindVertexArray(null);
      },
    };
  }

  function MagicCard(card) {
    const canvas = card.querySelector('[data-hero-magic-canvas]');
    const text = card.querySelector('[data-hero-magic-text]');
    if (!canvas || !text) return;

    const back = Layer(canvas);
    if (!back) { canvas.remove(); return; }
    const frontCanvas = canvas.cloneNode(false);
    frontCanvas.classList.add('hero-magic-canvas-front');
    frontCanvas.removeAttribute('data-hero-magic-canvas');
    card.appendChild(frontCanvas);
    const front = Layer(frontCanvas);
    if (!front) frontCanvas.remove();

    const fieldData = new Float32Array(MAX_FIELDS * 12);
    const backData = new Float32Array(MAX_SPRITES * 12);
    const frontData = new Float32Array(MAX_SPRITES * 12);

    let words = [];        // { fx, el, x0, y0, x1, y1, w, h, seed } relative to the card
    const particles = [];
    const bolts = [];      // { segs: [[x0, y0, x1, y1, width]], life, ttl, word, arc, endX, endY }
    const timers = new Map();
    let visible = true;
    let rafId = 0;
    let last = performance.now();
    let frontDrawn = true;   // whether the front canvas holds pixels that still need clearing
    const t0 = last;
    const running = () => rafId !== 0;
    const still = () => draw(1.7);

    function resize() {
      const rect = card.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
      back.resize(w, h, dpr);
      if (front) front.resize(w, h, dpr);
      measure();
    }

    function measure() {
      const cardRect = card.getBoundingClientRect();
      const next = [];
      text.querySelectorAll('[data-fx]').forEach((el, idx) => {
        let line = 0;
        for (const r of el.getClientRects()) {
          if (r.width < 1 || r.height < 1) continue;
          // Trim the line box's leading so flames and smoke start at the letters, not the gap above them.
          const pad = r.height * 0.12;
          next.push({
            fx: el.dataset.fx, el,
            x0: r.left - cardRect.left, x1: r.right - cardRect.left,
            y0: r.top - cardRect.top + pad, y1: r.bottom - cardRect.top - pad * 0.6,
            w: r.width, h: r.height - pad * 1.6,
            seed: idx * 17.3 + line++ * 5.1,
          });
        }
      });
      words = next;
      if (!running()) still();
    }

    function every(key, min, max, now) {
      const at = timers.get(key);
      if (at === undefined) { timers.set(key, now + rand(min, max) * 0.4); return false; }
      if (now < at) return false;
      timers.set(key, now + rand(min, max));
      return true;
    }

    // ── emitters: rates are per second, scaled by dt ──────────────────────
    function emit(word, dt, now) {
      const { x0, x1, y0, y1, w, h } = word;
      switch (word.fx) {
        case 'fire': {
          for (let n = (w / h) * 7 * dt; n > 0; n -= 1) {
            if (Math.random() >= n) continue;
            const hot = Math.random() < 0.25;
            particles.push({
              k: 'ember', x: rand(x0 + w * 0.05, x1 - w * 0.05), y: rand(y0 + h * 0.2, y1 - h * 0.1),
              vx: rand(-14, 14), vy: rand(-90, -45) * (h / 30), life: 0, ttl: rand(0.7, 1.5),
              size: rand(1.0, 1.7) * (hot ? 1.3 : 1), hot, phase: rand(0, 6.28),
            });
          }
          break;
        }
        case 'gold':
          // Glints catch on the upper curves of the letters, where a top light would hit polished metal.
          if (Math.random() < 2.6 * dt) {
            particles.push({ k: 'glint', x: rand(x0 + w * 0.04, x1 - w * 0.04), y: rand(y0 + h * 0.08, y0 + h * 0.5), life: 0, ttl: rand(0.5, 0.95), size: rand(0.9, 1.6) * (h / 32) });
          }
          if (Math.random() < 0.9 * dt) {
            particles.push({ k: 'mote', x: rand(x0, x1), y: rand(y0 + h * 0.4, y1), vx: rand(-4, 4), vy: rand(-16, -8), life: 0, ttl: rand(2.2, 3.4), size: rand(0.7, 1.1) });
          }
          break;
        case 'lightning':
          if (Math.random() < 6 * dt) {
            particles.push({ k: 'spark', x: rand(x0, x1), y: rand(y0, y1), vx: rand(-60, 60), vy: rand(-60, 60), life: 0, ttl: rand(0.12, 0.3), size: rand(0.5, 1.0) });
          }
          if (every('arc' + word.seed, 0.7, 1.8, now)) {
            const ax = rand(x0, x0 + w * 0.6), bx = Math.min(x1, ax + rand(w * 0.15, w * 0.4));
            bolts.push({ segs: boltPath(ax, rand(y0, y1), bx, rand(y0, y1), 0.35, 4, 0.8, []), life: 0, ttl: 0.16, word, arc: true });
          }
          if (every('bolt' + word.seed, 2.2, 4.2, now)) strike(word);
          break;
        default:
          break;
      }
    }

    // Midpoint-displacement bolt: jagged at every scale, like the real thing.
    function boltPath(ax, ay, bx, by, rough, depth, width, out) {
      if (depth === 0) { out.push([ax, ay, bx, by, width]); return out; }
      const len = Math.hypot(bx - ax, by - ay);
      const mx = (ax + bx) / 2 + rand(-1, 1) * len * rough * 0.5;
      const my = (ay + by) / 2 + rand(-1, 1) * len * rough * 0.25;
      boltPath(ax, ay, mx, my, rough, depth - 1, width, out);
      boltPath(mx, my, bx, by, rough, depth - 1, width, out);
      return out;
    }

    function strike(word) {
      const { x0, w, y0, h } = word;
      const endX = rand(x0 + w * 0.15, x0 + w * 0.85);
      const endY = y0 + h * rand(0.1, 0.4);
      const startX = endX + rand(-w * 0.35, w * 0.35);
      const startY = Math.max(-10, y0 - rand(90, 170));
      const segs = boltPath(startX, startY, endX, endY, 0.42, 6, 1.15, []);
      // Forks peel off the upper part of the main channel.
      const main = segs.length;
      for (let i = 1 + Math.floor(Math.random() * 3); i > 0; i--) {
        const s = segs[Math.floor(rand(4, main * 0.6))];
        boltPath(s[2], s[3], s[2] + rand(-60, 60), s[3] + rand(14, 60), 0.5, 4, 0.65, segs);
      }
      bolts.push({ segs, life: 0, ttl: 0.42, word, endX, endY });
      for (let i = 0; i < 10; i++) {
        const a = rand(Math.PI * 1.05, Math.PI * 1.95), v = rand(60, 200);
        particles.push({ k: 'spark', x: endX, y: endY, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, ttl: rand(0.15, 0.35), size: rand(0.6, 1.1) });
      }
    }

    // Return strokes: real lightning flickers a few times before it fades.
    function boltEnvelope(t) {
      if (t < 0.08) return 1;
      if (t < 0.14) return 0.25;
      if (t < 0.24) return 0.9;
      if (t < 0.3) return 0.3;
      if (t < 0.42) return 0.65 * (1 - (t - 0.3) / 0.12);
      return 0;
    }

    function step(dt, now) {
      words.forEach(word => emit(word, dt, now));
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.ttl) { particles.splice(i, 1); continue; }
        switch (p.k) {
          case 'ember':   // buoyant, turbulent, slowing as it cools
            p.vx += Math.sin(p.life * 9 + p.phase) * 60 * dt;
            p.vy *= 1 - 0.6 * dt;
            p.vy -= 18 * dt;
            break;
          case 'mote':
            p.vx += Math.sin(p.life * 2 + p.x) * 3 * dt;
            break;
          case 'spark':
            p.vx *= 1 - 5 * dt;
            p.vy *= 1 - 5 * dt;
            break;
          default:
            break;
        }
        if (p.vx !== undefined) { p.x += p.vx * dt; p.y += p.vy * dt; }
      }
      if (particles.length > MAX_SPRITES - 200) particles.splice(0, particles.length - (MAX_SPRITES - 200));
      for (let i = bolts.length - 1; i >= 0; i--) {
        bolts[i].life += dt;
        if (bolts[i].life >= bolts[i].ttl) bolts.splice(i, 1);
      }
    }

    // ── draw ───────────────────────────────────────────────────────────────
    function draw(time) {
      // Lightning flash per word, from its live bolts. Also drives the word's own CSS glow.
      const zap = new Map();
      bolts.forEach(b => {
        if (!b.arc) zap.set(b.word, Math.max(zap.get(b.word) || 0, boltEnvelope(b.life)));
      });

      // Fields, in paint order: glows, then smoke (normal blend), then fire (additive).
      let n = 0;
      const pushField = (kind, x0, y0, x1, y1, intensity, word) => {
        if (n >= MAX_FIELDS) return;
        fieldData.set([x0, y0, x1, y1, kind, word.seed, intensity, word.h,
          word.x0 - x0, word.y0 - y0, word.x1 - x0, word.y1 - y0], n++ * 12);
      };
      words.forEach(word => {
        const { x0, x1, y0, y1, w, h, fx } = word;
        let glow = GLOW[fx] || 0;
        if (fx === 'fire') glow *= 0.85 + 0.15 * Math.sin(time * 11 + word.seed) * Math.sin(time * 4.3);
        if (fx === 'lightning') glow += (zap.get(word) || 0) * 0.55;
        if (!glow) return;
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 + (fx === 'fire' ? h * 0.35 : 0);
        const rx = w * 0.75 + h, ry = h * 1.5;
        pushField(GLOW_KIND[fx], cx - rx, cy - ry, cx + rx, cy + ry, glow, word);
      });
      words.forEach(word => {
        if (word.fx === 'smoke') pushField(FIELD_KIND.smoke, word.x0 - word.h * 0.5, word.y0 - word.h * 2.0, word.x1 + word.h * 1.4, word.y1, 1, word);
      });
      words.forEach(word => {
        if (word.fx === 'fire') pushField(FIELD_KIND.fire, word.x0 - word.h * 0.3, word.y0 - word.h * 1.25, word.x1 + word.h * 0.3, word.y1 + word.h * 0.1, 1, word);
      });

      // Sprites, all additive (alpha 0), split between the two layers.
      let mb = 0, mf = 0;
      const pushSprite = (layer, x0, y0, x1, y1, r, g, b, size, kind, core) => {
        const toFront = layer && front;
        const data = toFront ? frontData : backData;
        const i = toFront ? mf : mb;
        if (i >= MAX_SPRITES) return;
        data.set([x0, y0, x1, y1, r, g, b, 0, size, kind, core, 0], i * 12);
        if (toFront) mf++; else mb++;
      };
      particles.forEach(p => {
        const t = p.life / p.ttl;
        const layer = FRONT.has(p.k);
        switch (p.k) {
          case 'ember': {
            // Blackbody cooling: white-yellow → orange → deep red, streaked along its velocity.
            const heat = 1 - t;
            const k = Math.min(1, t * 8) * (1 - t * t) * (p.hot ? 1.7 : 1.3);
            pushSprite(layer, p.x, p.y, p.x - p.vx * 0.035, p.y - p.vy * 0.035,
              k, (0.25 + 0.6 * heat * heat) * k, (0.05 + 0.35 * heat ** 4) * k, p.size, 2, 0.9 * k * heat);
            break;
          }
          case 'glint': {
            // Fast rise, slow fall: a highlight flashes on and lingers.
            const a = t < 0.2 ? t / 0.2 : Math.pow(1 - (t - 0.2) / 0.8, 1.6);
            pushSprite(layer, p.x, p.y, 0, 0, a, 0.86 * a, 0.56 * a, p.size, 1, 1.1 * a);
            break;
          }
          case 'mote': {
            const a = Math.sin(t * Math.PI) * 0.5;
            pushSprite(layer, p.x, p.y, 0, 0, a, 0.78 * a, 0.4 * a, p.size, 0, 0.4 * a);
            break;
          }
          case 'spark': {
            const a = 1 - t;
            pushSprite(layer, p.x, p.y, p.x - p.vx * 0.02, p.y - p.vy * 0.02, 0.55 * a, 0.75 * a, a, p.size, 2, 0.9 * a);
            break;
          }
          default:
            break;
        }
      });
      bolts.forEach(b => {
        const e = b.arc ? (1 - b.life / b.ttl) * (Math.random() < 0.7 ? 1 : 0.4) : boltEnvelope(b.life);
        if (e <= 0) return;
        b.segs.forEach(s => {
          const k = e * (s[4] < 1 ? 0.7 : 1);
          pushSprite(false, s[0], s[1], s[2], s[3], 0.38 * k, 0.58 * k, k, s[4], 2, 1.1 * k);
        });
        if (!b.arc) pushSprite(true, b.endX, b.endY, 0, 0, 0.5 * e, 0.7 * e, e, 6, 0, 0.8 * e);
      });

      back.render(time, fieldData, n, backData, mb);
      if (front && (mf || frontDrawn)) front.render(time, fieldData, 0, frontData, mf);
      frontDrawn = mf > 0;

      // Let the lightning word itself flare with its bolt.
      words.forEach(word => {
        if (word.fx !== 'lightning') return;
        const z = (zap.get(word) || 0).toFixed(2);
        if (word.el.style.getPropertyValue('--zap') !== z) word.el.style.setProperty('--zap', z);
      });
    }

    // ── loop ───────────────────────────────────────────────────────────────
    function frame(now) {
      rafId = requestAnimationFrame(frame);
      if (now - last < FRAME_MS - 2) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt, now / 1000);
      draw((now - t0) / 1000);
    }

    function sync() {
      const shouldRun = visible && !document.hidden && !reduceMotion.matches;
      if (shouldRun && !running()) {
        last = performance.now();
        rafId = requestAnimationFrame(frame);
      } else if (!shouldRun && running()) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        if (reduceMotion.matches) {
          particles.length = 0;
          bolts.length = 0;
          still();
        }
      }
    }

    new ResizeObserver(resize).observe(card);
    new IntersectionObserver(entries => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    }, { rootMargin: '80px' }).observe(card);
    // i18n swaps the blockquote's innerHTML: new spans, new rects.
    new MutationObserver(() => {
      particles.length = 0;
      bolts.length = 0;
      measure();
    }).observe(text, { childList: true, subtree: true, characterData: true });
    if (document.fonts) {
      document.fonts.ready.then(measure);
      document.fonts.addEventListener('loadingdone', measure);
    }
    document.addEventListener('visibilitychange', sync);
    reduceMotion.addEventListener('change', sync);
    [canvas, frontCanvas].forEach(c => c.addEventListener('webglcontextlost', e => {
      e.preventDefault();
      cancelAnimationFrame(rafId);
      rafId = 0;
    }));

    resize();
    sync();
  }

  cards.forEach(MagicCard);
})();
