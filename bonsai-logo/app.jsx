// app.jsx — Bonsai brand showcase composition.

function Section({ title, kicker, children, dark = false, className = "" }) {
  return (
    <section className={`sec ${dark ? "sec-dark" : ""} ${className}`}>
      <div className="sec-inner">
        {kicker && <div className="kicker">{kicker}</div>}
        {title && <h2 className="sec-title">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

function Plate({ children, dark = false, label, sub, className = "" }) {
  return (
    <div className={`plate ${dark ? "plate-dark" : ""} ${className}`}>
      <div className="plate-stage">{children}</div>
      {(label || sub) && (
        <div className="plate-meta">
          {label && <div className="plate-label">{label}</div>}
          {sub && <div className="plate-sub">{sub}</div>}
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="hdr">
      <div className="hdr-inner">
        <div className="hdr-mark"><StaticMark variant="simple" size={44} /></div>
        <div>
          <div className="hdr-kicker">Brand · Bonsai</div>
          <div className="hdr-title">Mosaic Tree — final asset pack</div>
        </div>
        <a className="hdr-cta" href="files/" download>Download all files</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-inner">
        <div className="hero-mark">
          <AnimatedMarkPlayer variant="primary" size={420} />
        </div>
        <div className="hero-copy">
          <div className="kicker">Grow intentionally</div>
          <h1>bonsai.</h1>
          <p>
            Hand-laid mosaic tiles forming a small bonsai. Each tile is a
            beveled, glossy ceramic chip — designed to feel like an object
            you could pick up. The mark animates as the tree grows.
          </p>
          <div className="hero-stats">
            <div><b>33</b><span>tiles</span></div>
            <div><b>8</b><span>palette stops</span></div>
            <div><b>1.4s</b><span>animation</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VariationCompare() {
  return (
    <Section
      kicker="Two silhouettes"
      title="Primary mark & alternate"
    >
      <p className="sec-lead">
        The primary leans into <b>traditional bonsai asymmetry</b> — wider on
        the right, a more characterful canopy. The alternate is a <b>formal
        upright</b> — symmetric, tighter, more architectural. Same tile system,
        same palette. Use the alternate where the layout wants a centered
        composition.
      </p>
      <div className="row-2">
        <Plate label="Primary · wilder, asymmetric" sub="33 tiles · for hero and headline use">
          <StaticMark variant="primary" size={320} />
        </Plate>
        <Plate label="Alternate · formal, symmetric" sub="21 tiles · for centered layouts, app icons">
          <StaticMark variant="variation" size={320} />
        </Plate>
      </div>
    </Section>
  );
}

function ColorModes() {
  return (
    <Section kicker="Color modes" title="Four guaranteed reads">
      <p className="sec-lead">
        Full color is the default. Mono variants exist for places where the
        full color would compete with another element (a busy photo, a single-
        color print, a watermark).
      </p>
      <div className="row-4">
        <Plate label="Full color · on light">
          <StaticMark variant="primary" size={210} />
        </Plate>
        <Plate dark label="Full color · on dark">
          <StaticMark variant="primary" size={210} />
        </Plate>
        <Plate label="Mono ink · on light">
          <StaticMark variant="primary" size={210} mono="#101410" />
        </Plate>
        <Plate dark label="Mono white · on dark">
          <StaticMark variant="primary" size={210} mono="#ffffff" />
        </Plate>
      </div>
      <div className="row-3" style={{ marginTop: 22 }}>
        <Plate label="Mono forest · on cream">
          <StaticMark variant="primary" size={180} mono="#173f35" />
        </Plate>
        <Plate label="Mono ink · on mint">
          <div style={{
            display: "grid", placeItems: "center",
            background: "linear-gradient(135deg, #b7d7ce, #dff0e7)",
            padding: 24, borderRadius: 20, width: "100%",
          }}>
            <StaticMark variant="primary" size={180} mono="#101410" />
          </div>
        </Plate>
        <Plate label="Mono white · on forest">
          <div style={{
            display: "grid", placeItems: "center",
            background: "linear-gradient(135deg, #173f35, #0a1f1a)",
            padding: 24, borderRadius: 20, width: "100%",
          }}>
            <StaticMark variant="primary" size={180} mono="#ffffff" />
          </div>
        </Plate>
      </div>
    </Section>
  );
}

function Lockups() {
  return (
    <Section kicker="Lockups" title="Mark with the word — and without">
      <p className="sec-lead">
        Use the <b>horizontal lockup</b> in headers, footers, and any wide
        chrome surface. Use the <b>stacked lockup</b> for square thumbnails,
        social profile photos, and centered title slides. Use the <b>mark
        alone</b> when the word "bonsai" is already on the page. Use the
        <b> wordmark alone</b> when the mark would compete with surrounding
        imagery.
      </p>

      <div className="row-2">
        <Plate label="Horizontal · light">
          <Lockup layout="horizontal" />
        </Plate>
        <Plate dark label="Horizontal · dark">
          <Lockup layout="horizontal" dark />
        </Plate>
      </div>

      <div className="row-2" style={{ marginTop: 22 }}>
        <Plate label="Stacked · light">
          <Lockup layout="stacked" />
        </Plate>
        <Plate dark label="Stacked · dark">
          <Lockup layout="stacked" dark />
        </Plate>
      </div>

      <div className="row-2" style={{ marginTop: 22 }}>
        <Plate label="Wordmark only · Archivo Black">
          <div className="wm-specimen wm-light">bonsai</div>
        </Plate>
        <Plate dark label="Wordmark only · reverse">
          <div className="wm-specimen wm-dark">bonsai</div>
        </Plate>
      </div>
    </Section>
  );
}

function Lockup({ layout, dark = false }) {
  const wordColor = dark ? "#f7fff7" : "#173f35";
  if (layout === "horizontal") {
    return (
      <div className="lockup-h">
        <StaticMark variant="primary" size={120} />
        <div className="lockup-word" style={{ color: wordColor }}>bonsai</div>
      </div>
    );
  }
  return (
    <div className="lockup-v">
      <StaticMark variant="primary" size={170} />
      <div className="lockup-word lockup-word-stacked" style={{ color: wordColor }}>bonsai</div>
    </div>
  );
}

function ScaleDemo() {
  const sizes = [
    { v: "primary", px: 256, label: "256" },
    { v: "primary", px: 128, label: "128" },
    { v: "primary", px: 64, label: "64" },
    { v: "simple", px: 48, label: "48 · switch to simplified" },
    { v: "simple", px: 32, label: "32" },
    { v: "simple", px: 16, label: "16" },
  ];
  return (
    <Section kicker="Scaling" title="How small can it go?">
      <p className="sec-lead">
        Above ~48px, use the <b>full primary mark</b>. Below that, switch
        to the <b>simplified mark</b> (12 tiles instead of 33) — it stays
        legible all the way down to a 16px favicon.
      </p>
      <div className="scale-row">
        {sizes.map((s) => (
          <div className="scale-cell" key={s.label}>
            <div className="scale-mark" style={{ height: s.px + 8 }}>
              <StaticMark variant={s.v} size={s.px} />
            </div>
            <div className="scale-label">{s.label}px</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FaviconMockup() {
  return (
    <Section kicker="In context" title="Browser & device">
      <div className="row-2">
        <Plate label="Browser tab — favicon">
          <div className="browser">
            <div className="browser-bar">
              <div className="browser-dot r" /><div className="browser-dot y" /><div className="browser-dot g" />
              <div className="browser-tabs">
                <div className="browser-tab active">
                  <img src="files/favicon-32.png" alt="" />
                  <span>bonsai · Atlas OS</span>
                  <span className="x">×</span>
                </div>
                <div className="browser-tab">
                  <div className="fake-fav" />
                  <span>Methodology</span>
                  <span className="x">×</span>
                </div>
                <div className="browser-tab">
                  <div className="fake-fav" />
                  <span>Notion</span>
                  <span className="x">×</span>
                </div>
                <div className="browser-tab-add">+</div>
              </div>
            </div>
            <div className="browser-url">
              <span className="lock">🔒</span>despachobonsai.com
            </div>
            <div className="browser-body" />
          </div>
        </Plate>
        <Plate dark label="iOS home screen — apple-touch-icon">
          <div className="ios-screen">
            <div className="ios-time">9:41</div>
            <div className="ios-grid">
              <div className="ios-app"><img src="files/apple-touch-icon-180.png" alt="" /><span>bonsai</span></div>
              <div className="ios-app"><div className="ios-fake i1" /><span>Notion</span></div>
              <div className="ios-app"><div className="ios-fake i2" /><span>Slack</span></div>
              <div className="ios-app"><div className="ios-fake i3" /><span>Linear</span></div>
              <div className="ios-app"><div className="ios-fake i4" /><span>Calendar</span></div>
              <div className="ios-app"><div className="ios-fake i5" /><span>Mail</span></div>
              <div className="ios-app"><div className="ios-fake i6" /><span>Cal.com</span></div>
              <div className="ios-app"><div className="ios-fake i7" /><span>Claude</span></div>
            </div>
            <div className="ios-dock">
              <div className="ios-fake i8" />
              <div className="ios-fake i9" />
              <div className="ios-fake i0" />
              <img className="ios-dock-bonsai" src="files/apple-touch-icon-180.png" alt="" />
            </div>
            <div className="ios-bar" />
          </div>
        </Plate>
      </div>
    </Section>
  );
}

function AnimationShowcase() {
  return (
    <Section kicker="Motion" title="Tiles cascade in like the tree growing" dark>
      <p className="sec-lead-dark">
        Use the animated version on first-load hero, install moments, splash
        screens. Pot lays first, then trunk, then canopy bottom-up — a literal
        animation of growing. Total run: ~1.4s. Auto-loops every 5s.
      </p>
      <div className="row-1">
        <Plate dark>
          <AnimatedMarkPlayer variant="primary" size={460} />
        </Plate>
      </div>
    </Section>
  );
}

function FilesList() {
  const sections = [
    {
      title: "Marks (SVG · vector)",
      files: [
        ["mark-primary.svg", "Primary 3D mosaic — full color"],
        ["mark-variation.svg", "Alternate — formal upright"],
        ["mark-simple.svg", "Simplified — for ≤48px"],
        ["mark-mono-forest.svg", "Mono · forest green"],
        ["mark-mono-ink.svg", "Mono · ink"],
        ["mark-mono-white.svg", "Mono · white (for dark bg)"],
      ],
    },
    {
      title: "Wordmarks (SVG)",
      files: [
        ["wordmark.svg", "Forest green · default"],
        ["wordmark-ink.svg", "Ink · for very light bg"],
        ["wordmark-white.svg", "White · for dark bg"],
      ],
    },
    {
      title: "Lockups (SVG)",
      files: [
        ["lockup-horizontal.svg", "Mark + word, horizontal"],
        ["lockup-horizontal-dark.svg", "Horizontal · dark version"],
        ["lockup-stacked.svg", "Mark above word"],
        ["lockup-stacked-dark.svg", "Stacked · dark version"],
      ],
    },
    {
      title: "Favicons (PNG · raster)",
      files: [
        ["favicon.svg", "Master favicon SVG"],
        ["favicon-16.png", "16 × 16"],
        ["favicon-32.png", "32 × 32"],
        ["favicon-48.png", "48 × 48"],
      ],
    },
    {
      title: "App icons (PNG)",
      files: [
        ["apple-touch-icon-180.png", "iOS home screen · 180px"],
        ["app-icon-512.png", "App icon · 512px · light"],
        ["app-icon-1024.png", "App icon · 1024px master · light"],
        ["app-icon-512-dark.png", "App icon · 512px · dark"],
        ["app-icon-1024-dark.png", "App icon · 1024px · dark"],
      ],
    },
    {
      title: "Social / OG",
      files: [
        ["og-image-1200x630.png", "Open Graph share card · 1200×630"],
      ],
    },
  ];
  return (
    <Section kicker="Files" title="Everything in /bonsai-logo/files/">
      <p className="sec-lead">
        Right-click → "Save image as" on any preview, or click the filename
        to open it. All raster PNGs are rendered from the SVG masters above
        so they stay in sync.
      </p>
      {sections.map((sec) => (
        <div className="files-group" key={sec.title}>
          <h3 className="files-group-h">{sec.title}</h3>
          <div className="files-grid">
            {sec.files.map(([f, desc]) => (
              <a className="file-card" key={f} href={`files/${f}`} download target="_blank" rel="noopener">
                <div className="file-thumb">
                  {f.endsWith(".svg")
                    ? <img src={`files/${f}`} alt="" />
                    : <img src={`files/${f}`} alt="" style={{ background: f.includes("dark") ? "#0e1612" : "#f4f6f2" }} />}
                </div>
                <div className="file-meta">
                  <div className="file-name">{f}</div>
                  <div className="file-desc">{desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
}

function Footnotes() {
  return (
    <Section kicker="Notes for the designer / dev" title="Working with these files">
      <div className="notes-grid">
        <div className="note">
          <div className="note-h">SVG wordmark fonts</div>
          <p>The wordmark SVGs use a live <code>@import</code> of <b>Archivo Black</b> from Google Fonts. They render correctly in browsers. If you open them in Figma or Illustrator and the font doesn't appear, install Archivo Black system-wide, or convert the <code>&lt;text&gt;</code> elements to outlines (Type → Convert to Outlines).</p>
        </div>
        <div className="note">
          <div className="note-h">When to switch to the simplified mark</div>
          <p>The full mosaic has 33 tiles; below ~48×48 they start to fuse. Use <code>mark-simple.svg</code> (12 tiles) for favicons, sidebar avatars, and any 16–32px placement. The simplified mark is the source for all favicon PNGs.</p>
        </div>
        <div className="note">
          <div className="note-h">Backgrounds</div>
          <p>The mark wants a calm, non-busy background. Cream, mint wash, deep forest, ink. Avoid red, hot pink, saturated photography. If you must place it on a photo, use the mono-white or mono-ink version, or add a glass plate behind it.</p>
        </div>
        <div className="note">
          <div className="note-h">Animation in code</div>
          <p>The CSS animation is a single <code>@keyframes tile-in</code> with a stagger calculated from row × column. To use in production: copy <code>animated-mark.jsx</code> + the <code>.anim-tile</code> keyframes from this page's CSS. No JS framework required for the animation itself.</p>
        </div>
        <div className="note">
          <div className="note-h">Production-grade upgrade path</div>
          <p>These are <b>vector SVG</b> approximations of the chunky-3D look. To go fully premium: ship a real <b>3D pass in Spline / Cinema 4D</b> using these tile positions as the layout reference. Material would be glossy ceramic with a glass topcoat. Animation could be physics-based.</p>
        </div>
        <div className="note">
          <div className="note-h">Don't</div>
          <p>Don't recolor individual tiles. Don't add a stroke/outline. Don't drop-shadow the entire mark (each tile already has its own shadow). Don't rotate or skew. Don't stretch — uniform scale only. Don't use the wordmark in any weight other than Archivo Black.</p>
        </div>
      </div>
    </Section>
  );
}

function App() {
  return (
    <main>
      <Header />
      <Hero />
      <VariationCompare />
      <ColorModes />
      <Lockups />
      <ScaleDemo />
      <FaviconMockup />
      <AnimationShowcase />
      <FilesList />
      <Footnotes />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
