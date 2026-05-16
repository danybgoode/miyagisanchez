// build.js — Bonsai brand asset builder.
// Tile data + SVG builder functions, shared by run_script (to generate
// the static SVG/PNG files) and by the showcase (for live rendering).

(function (root) {
  const PALETTE = {
    // canopy greens — bright to dark
    GREEN_BRIGHT: "#3eb37c",
    GREEN_MED:    "#2a8c5f",
    GREEN_DEEP:   "#1a5e3f",
    GREEN_DARK:   "#0e3422",
    // trunk
    TRUNK_LIGHT:  "#5a3e2a",
    TRUNK_DARK:   "#2a1810",
    // pot — terracotta-ish
    POT_LIGHT:    "#6b4a32",
    POT_DARK:     "#3e2918",
    // brand tokens
    FOREST:       "#173f35",
    INK:          "#101410",
    CREAM:        "#f4f6f2",
  };

  // Each tile: {r: row, c: column, col: PALETTE key}
  // Primary — wilder, asymmetric, traditional bonsai silhouette
  const TILES_PRIMARY = [
    // canopy
    { r: 0, c: 3, col: "GREEN_MED" },
    { r: 1, c: 2, col: "GREEN_BRIGHT" }, { r: 1, c: 3, col: "GREEN_BRIGHT" }, { r: 1, c: 4, col: "GREEN_MED" },
    { r: 2, c: 1, col: "GREEN_DEEP" }, { r: 2, c: 2, col: "GREEN_BRIGHT" }, { r: 2, c: 3, col: "GREEN_MED" }, { r: 2, c: 4, col: "GREEN_BRIGHT" }, { r: 2, c: 5, col: "GREEN_MED" },
    { r: 3, c: 0, col: "GREEN_DEEP" }, { r: 3, c: 1, col: "GREEN_MED" }, { r: 3, c: 2, col: "GREEN_DEEP" }, { r: 3, c: 3, col: "GREEN_BRIGHT" }, { r: 3, c: 4, col: "GREEN_DEEP" }, { r: 3, c: 5, col: "GREEN_MED" }, { r: 3, c: 6, col: "GREEN_DEEP" },
    { r: 4, c: 0, col: "GREEN_DARK" }, { r: 4, c: 1, col: "GREEN_DEEP" }, { r: 4, c: 2, col: "GREEN_MED" }, { r: 4, c: 4, col: "GREEN_MED" }, { r: 4, c: 5, col: "GREEN_DEEP" }, { r: 4, c: 6, col: "GREEN_DARK" },
    { r: 5, c: 1, col: "GREEN_DEEP" }, { r: 5, c: 2, col: "GREEN_DARK" }, { r: 5, c: 4, col: "GREEN_DARK" }, { r: 5, c: 5, col: "GREEN_DEEP" },
    // trunk (centered, 2 tall)
    { r: 5, c: 3, col: "TRUNK_DARK" },
    { r: 6, c: 3, col: "TRUNK_DARK" },
    // pot — 5 tiles wide
    { r: 7, c: 1, col: "POT_LIGHT" }, { r: 7, c: 2, col: "POT_LIGHT" }, { r: 7, c: 3, col: "POT_LIGHT" }, { r: 7, c: 4, col: "POT_DARK" }, { r: 7, c: 5, col: "POT_DARK" },
  ];

  // Variation — tighter, more symmetric, "formal upright" style bonsai
  const TILES_VARIATION = [
    { r: 0, c: 2, col: "GREEN_MED" }, { r: 0, c: 3, col: "GREEN_BRIGHT" }, { r: 0, c: 4, col: "GREEN_MED" },
    { r: 1, c: 1, col: "GREEN_BRIGHT" }, { r: 1, c: 2, col: "GREEN_MED" }, { r: 1, c: 3, col: "GREEN_BRIGHT" }, { r: 1, c: 4, col: "GREEN_MED" }, { r: 1, c: 5, col: "GREEN_BRIGHT" },
    { r: 2, c: 1, col: "GREEN_DEEP" }, { r: 2, c: 2, col: "GREEN_BRIGHT" }, { r: 2, c: 3, col: "GREEN_MED" }, { r: 2, c: 4, col: "GREEN_BRIGHT" }, { r: 2, c: 5, col: "GREEN_DEEP" },
    { r: 3, c: 2, col: "GREEN_DEEP" }, { r: 3, c: 3, col: "GREEN_DARK" }, { r: 3, c: 4, col: "GREEN_DEEP" },
    // trunk
    { r: 4, c: 3, col: "TRUNK_DARK" },
    // pot — 5 wide, tapered
    { r: 5, c: 1, col: "POT_LIGHT" }, { r: 5, c: 2, col: "POT_LIGHT" }, { r: 5, c: 3, col: "POT_LIGHT" }, { r: 5, c: 4, col: "POT_DARK" }, { r: 5, c: 5, col: "POT_DARK" },
  ];

  // Simplified — for favicons / very small sizes (≤32px). ~11 tiles total.
  const TILES_SIMPLE = [
    // canopy 2 rows
    { r: 0, c: 1, col: "GREEN_BRIGHT" }, { r: 0, c: 2, col: "GREEN_MED" },
    { r: 1, c: 0, col: "GREEN_DEEP" }, { r: 1, c: 1, col: "GREEN_BRIGHT" }, { r: 1, c: 2, col: "GREEN_MED" }, { r: 1, c: 3, col: "GREEN_DEEP" },
    // trunk
    { r: 2, c: 1, col: "TRUNK_DARK" }, { r: 2, c: 2, col: "TRUNK_DARK" },
    // pot
    { r: 3, c: 0, col: "POT_LIGHT" }, { r: 3, c: 1, col: "POT_LIGHT" }, { r: 3, c: 2, col: "POT_DARK" }, { r: 3, c: 3, col: "POT_DARK" },
  ];

  // ----- 3D tile renderer -----
  // Each tile gets:
  //   1) cast drop shadow (offset down)
  //   2) base rounded rect
  //   3) inner gradient overlay (top-left light, bottom-right shadow)
  //   4) top-left highlight ridge (bevel)
  //   5) bottom-right shadow ridge (bevel)
  //   6) specular glint
  function tileMarkup(x, y, t, color, opts) {
    opts = opts || {};
    const r = t * 0.2;             // corner radius
    const hi = opts.hi !== false;  // include highlights
    const dim = opts.dim;          // mono (no highlights) mode for ink/white

    if (dim) {
      // simple flat tile for mono variants — keeps the shape readable
      return `<rect x="${x}" y="${y}" width="${t}" height="${t}" rx="${r}" fill="${color}"/>`;
    }

    return [
      // 1. drop shadow
      `<rect x="${(x + 0.5).toFixed(2)}" y="${(y + t * 0.08).toFixed(2)}" width="${(t - 1).toFixed(2)}" height="${t.toFixed(2)}" rx="${r.toFixed(2)}" fill="rgba(8,15,12,0.32)"/>`,
      // 2. base
      `<rect x="${x}" y="${y}" width="${t}" height="${t}" rx="${r.toFixed(2)}" fill="${color}"/>`,
      // 3. inner gradient overlay — done as two paths for SVG-portability (no gradient defs per tile)
      // top-left highlight ridge
      `<path d="M ${(x + t * 0.12).toFixed(2)} ${(y + t * 0.12).toFixed(2)} L ${(x + t * 0.88).toFixed(2)} ${(y + t * 0.12).toFixed(2)} L ${(x + t * 0.76).toFixed(2)} ${(y + t * 0.24).toFixed(2)} L ${(x + t * 0.24).toFixed(2)} ${(y + t * 0.24).toFixed(2)} L ${(x + t * 0.24).toFixed(2)} ${(y + t * 0.76).toFixed(2)} L ${(x + t * 0.12).toFixed(2)} ${(y + t * 0.88).toFixed(2)} Z" fill="rgba(255,255,255,0.45)"/>`,
      // bottom-right shadow ridge
      `<path d="M ${(x + t * 0.88).toFixed(2)} ${(y + t * 0.12).toFixed(2)} L ${(x + t * 0.88).toFixed(2)} ${(y + t * 0.88).toFixed(2)} L ${(x + t * 0.12).toFixed(2)} ${(y + t * 0.88).toFixed(2)} L ${(x + t * 0.24).toFixed(2)} ${(y + t * 0.76).toFixed(2)} L ${(x + t * 0.76).toFixed(2)} ${(y + t * 0.76).toFixed(2)} L ${(x + t * 0.76).toFixed(2)} ${(y + t * 0.24).toFixed(2)} Z" fill="rgba(0,0,0,0.28)"/>`,
      // 4. specular glint — diagonal oval at upper-left of tile face
      `<ellipse cx="${(x + t * 0.32).toFixed(2)}" cy="${(y + t * 0.22).toFixed(2)}" rx="${(t * 0.18).toFixed(2)}" ry="${(t * 0.06).toFixed(2)}" fill="rgba(255,255,255,0.7)" transform="rotate(-35 ${(x + t * 0.32).toFixed(2)} ${(y + t * 0.22).toFixed(2)})"/>`,
    ].join("");
  }

  // Returns { width, height, tiles: [{x,y,size,color,key}] } so the animated
  // component can position the same tiles.
  function layoutTiles(tiles, opts) {
    opts = opts || {};
    const tileSize = opts.tileSize != null ? opts.tileSize : 30;
    const gap = opts.gap != null ? opts.gap : 2;
    const padding = opts.padding != null ? opts.padding : 12;
    const mono = opts.mono;

    let maxR = 0, maxC = 0;
    tiles.forEach((t) => { if (t.r > maxR) maxR = t.r; if (t.c > maxC) maxC = t.c; });
    const cols = maxC + 1, rows = maxR + 1;
    const w = cols * (tileSize + gap) - gap + padding * 2;
    const h = rows * (tileSize + gap) - gap + padding * 2;

    const out = tiles.map((t, i) => ({
      key: i,
      x: padding + t.c * (tileSize + gap),
      y: padding + t.r * (tileSize + gap),
      size: tileSize,
      color: mono || PALETTE[t.col],
      group: t.col.startsWith("GREEN") ? "canopy" : t.col.startsWith("TRUNK") ? "trunk" : "pot",
      row: t.r,
      col: t.c,
    }));

    return { width: w, height: h, tiles: out };
  }

  function buildMark(tiles, opts) {
    const layout = layoutTiles(tiles, opts);
    const body = layout.tiles.map((t) => tileMarkup(t.x, t.y, t.size, t.color, { dim: !!(opts && opts.mono) && opts.flat })).join("");
    return { width: layout.width, height: layout.height, body, layout };
  }

  function buildMarkSVG(variant, opts) {
    opts = opts || {};
    const tiles = variant === "variation" ? TILES_VARIATION : variant === "simple" ? TILES_SIMPLE : TILES_PRIMARY;
    const mark = buildMark(tiles, opts);
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mark.width} ${mark.height}" width="${mark.width}" height="${mark.height}">${mark.body}</svg>`;
  }

  function buildWordmarkSVG(opts) {
    opts = opts || {};
    const color = opts.color || PALETTE.FOREST;
    const fs = opts.fontSize || 120;
    const text = "bonsai";
    const w = fs * 3.05;
    const h = fs * 1.05;
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs><style>@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&amp;display=swap');.wm{font-family:'Archivo Black','Inter',sans-serif;font-weight:900;font-size:${fs}px;letter-spacing:-${(fs * 0.04).toFixed(2)}px;}</style></defs>
  <text class="wm" x="0" y="${(fs * 0.85).toFixed(2)}" fill="${color}">${text}</text>
</svg>`;
  }

  function buildLockupSVG(layout, opts) {
    opts = opts || {};
    const variant = opts.variant || "primary";
    const tiles = variant === "variation" ? TILES_VARIATION : variant === "simple" ? TILES_SIMPLE : TILES_PRIMARY;
    const wordColor = opts.wordColor || PALETTE.FOREST;
    const markMono = opts.markMono;
    const markTileSize = layout === "horizontal" ? 24 : 30;
    const mark = buildMark(tiles, { tileSize: markTileSize, gap: 1.5, padding: 0, mono: markMono });
    const fs = layout === "horizontal" ? mark.height * 0.55 : mark.height * 0.4;
    const wordW = fs * 3.05, wordH = fs * 1.05;

    if (layout === "horizontal") {
      const gap = 28;
      const w = mark.width + gap + wordW;
      const h = Math.max(mark.height, wordH);
      const markY = (h - mark.height) / 2;
      const wordY = h / 2 + fs * 0.32;
      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs><style>@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&amp;display=swap');.wm{font-family:'Archivo Black','Inter',sans-serif;font-weight:900;font-size:${fs.toFixed(2)}px;letter-spacing:-${(fs * 0.04).toFixed(2)}px;}</style></defs>
  <g transform="translate(0 ${markY.toFixed(2)})">${mark.body}</g>
  <text class="wm" x="${(mark.width + gap).toFixed(2)}" y="${wordY.toFixed(2)}" fill="${wordColor}">bonsai</text>
</svg>`;
    }
    // stacked
    const gap = 18;
    const w = Math.max(mark.width, wordW);
    const h = mark.height + gap + wordH;
    const markX = (w - mark.width) / 2;
    const wordY = mark.height + gap + fs * 0.85;
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs><style>@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&amp;display=swap');.wm{font-family:'Archivo Black','Inter',sans-serif;font-weight:900;font-size:${fs.toFixed(2)}px;letter-spacing:-${(fs * 0.04).toFixed(2)}px;text-anchor:middle;}</style></defs>
  <g transform="translate(${markX.toFixed(2)} 0)">${mark.body}</g>
  <text class="wm" x="${(w / 2).toFixed(2)}" y="${wordY.toFixed(2)}" fill="${wordColor}">bonsai</text>
</svg>`;
  }

  root.BonsaiBrand = {
    PALETTE,
    TILES_PRIMARY, TILES_VARIATION, TILES_SIMPLE,
    layoutTiles, tileMarkup,
    buildMark, buildMarkSVG, buildWordmarkSVG, buildLockupSVG,
  };
})(typeof window !== "undefined" ? window : globalThis);
