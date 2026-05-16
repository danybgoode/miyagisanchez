// animated-mark.jsx — staggered "tiles cascade in" animation of the mosaic mark.
// Reuses BonsaiBrand.layoutTiles for positions, renders each tile as a <g>
// with CSS animation delay.

function Tile({ x, y, t, color, mono, delay = 0 }) {
  const r = t * 0.2;
  if (mono) {
    return (
      <g className="anim-tile" style={{ animationDelay: `${delay}ms` }}>
        <rect x={x} y={y} width={t} height={t} rx={r} fill={color} />
      </g>
    );
  }
  return (
    <g className="anim-tile" style={{ animationDelay: `${delay}ms` }}>
      <rect x={x + 0.5} y={y + t * 0.08} width={t - 1} height={t} rx={r} fill="rgba(8,15,12,0.32)" />
      <rect x={x} y={y} width={t} height={t} rx={r} fill={color} />
      <path
        d={`M ${x + t * 0.12} ${y + t * 0.12} L ${x + t * 0.88} ${y + t * 0.12} L ${x + t * 0.76} ${y + t * 0.24} L ${x + t * 0.24} ${y + t * 0.24} L ${x + t * 0.24} ${y + t * 0.76} L ${x + t * 0.12} ${y + t * 0.88} Z`}
        fill="rgba(255,255,255,0.45)"
      />
      <path
        d={`M ${x + t * 0.88} ${y + t * 0.12} L ${x + t * 0.88} ${y + t * 0.88} L ${x + t * 0.12} ${y + t * 0.88} L ${x + t * 0.24} ${y + t * 0.76} L ${x + t * 0.76} ${y + t * 0.76} L ${x + t * 0.76} ${y + t * 0.24} Z`}
        fill="rgba(0,0,0,0.28)"
      />
      <ellipse
        cx={x + t * 0.32}
        cy={y + t * 0.22}
        rx={t * 0.18}
        ry={t * 0.06}
        fill="rgba(255,255,255,0.7)"
        transform={`rotate(-35 ${x + t * 0.32} ${y + t * 0.22})`}
      />
    </g>
  );
}

function StaticMark({ variant = "primary", size = 360, mono = null }) {
  const BB = window.BonsaiBrand;
  const tiles =
    variant === "variation" ? BB.TILES_VARIATION
    : variant === "simple" ? BB.TILES_SIMPLE
    : BB.TILES_PRIMARY;
  const layout = BB.layoutTiles(tiles, { tileSize: 30, gap: 2, padding: 12, mono });
  const aspect = layout.width / layout.height;
  const h = size / aspect;
  return (
    <svg viewBox={`0 0 ${layout.width} ${layout.height}`} width={size} height={h} style={{ overflow: "visible" }}>
      {layout.tiles.map((t) => (
        <Tile key={t.key} x={t.x} y={t.y} t={t.size} color={t.color} mono={!!mono} delay={-1} />
      ))}
    </svg>
  );
}

function AnimatedMark({ variant = "primary", size = 360, replayKey = 0 }) {
  const BB = window.BonsaiBrand;
  const tiles =
    variant === "variation" ? BB.TILES_VARIATION
    : variant === "simple" ? BB.TILES_SIMPLE
    : BB.TILES_PRIMARY;
  const layout = BB.layoutTiles(tiles, { tileSize: 30, gap: 2, padding: 12 });
  const maxR = Math.max(...layout.tiles.map((t) => t.row));

  const aspect = layout.width / layout.height;
  const h = size / aspect;

  return (
    <svg
      key={replayKey}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      width={size}
      height={h}
      style={{ overflow: "visible" }}
    >
      {layout.tiles.map((t) => {
        let delay;
        if (t.group === "pot") {
          delay = Math.abs(t.col - 3) * 50;
        } else if (t.group === "trunk") {
          delay = 220 + (maxR - 1 - t.row) * 80;
        } else {
          const fromBottom = maxR - 1 - t.row;
          delay = 300 + fromBottom * 110 + Math.abs(t.col - 3) * 35;
        }
        return <Tile key={t.key} x={t.x} y={t.y} t={t.size} color={t.color} delay={delay} />;
      })}
    </svg>
  );
}

function AnimatedMarkPlayer({ variant = "primary", size = 360 }) {
  const [version, setVersion] = React.useState(0);
  // Auto-loop after a beat
  React.useEffect(() => {
    const id = setTimeout(() => setVersion((v) => v + 1), 5200);
    return () => clearTimeout(id);
  }, [version]);
  return (
    <div className="amp">
      <AnimatedMark variant={variant} size={size} replayKey={version} />
      <button className="amp-replay" onClick={() => setVersion((v) => v + 1)} aria-label="Replay animation">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v6h6" />
        </svg>
        Replay
      </button>
    </div>
  );
}

window.AnimatedMark = AnimatedMark;
window.AnimatedMarkPlayer = AnimatedMarkPlayer;
window.StaticMark = StaticMark;
window.BonsaiTile = Tile;
