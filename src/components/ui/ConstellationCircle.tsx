/* Astronomical star-chart circle for the welcome screen.
   Uses a seeded pseudo-random so it renders identically on server & client. */

function seededRandom(seed: number) {
  let v = seed;
  return () => { v = (v * 9301 + 49297) % 233280; return v / 233280; };
}

const rand = seededRandom(42);

function mkStars(n: number, cx: number, cy: number, r: number) {
  return Array.from({ length: n }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const dist  = (rand() * 0.88 + 0.08) * r;
    return {
      id: i,
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      sz: 0.7 + rand() * 2,
      op: 0.25 + rand() * 0.7,
    };
  });
}

/* Fixed constellation lines — a few connected groups */
const constelLines = [
  [[135,96],[148,108],[162,100],[170,120],[155,132]],
  [[90,150],[106,138],[120,152],[110,168]],
  [[200,80],[215,92],[230,84],[242,100]],
  [[168,180],[180,196],[196,188],[210,202],[222,188]],
  [[98,200],[108,218],[120,208],[132,224]],
  [[228,150],[240,162],[254,150],[246,170]],
];

export function ConstellationCircle({ size = 280 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 4;
  const stars = mkStars(55, cx, cy, r);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="ccBg" cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stopColor="#0e1e2e" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#030509" stopOpacity="0.98" />
        </radialGradient>
        <clipPath id="ccClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Background fill */}
      <circle cx={cx} cy={cy} r={r} fill="url(#ccBg)" />

      {/* Clipped content */}
      <g clipPath="url(#ccClip)">
        {/* Stars */}
        {stars.map((s) => (
          <circle key={s.id} cx={s.x} cy={s.y} r={s.sz} fill="#f0e0c8" opacity={s.op} />
        ))}

        {/* Constellation lines */}
        {constelLines.map((poly, pi) => (
          <polyline
            key={pi}
            points={poly.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="rgba(185,143,79,0.35)"
            strokeWidth="0.7"
          />
        ))}

        {/* Constellation dot markers */}
        {constelLines.flat().map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="rgba(240,224,200,0.75)" />
        ))}

        {/* Subtle inner rings */}
        <circle cx={cx} cy={cy} r={r * 0.62} fill="none" stroke="rgba(185,143,79,0.12)" strokeWidth="0.6" />
        <circle cx={cx} cy={cy} r={r * 0.35} fill="none" stroke="rgba(185,143,79,0.08)" strokeWidth="0.5" />

        {/* Cardinal tick marks */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={cx + Math.cos(rad) * (r - 14)}
              y1={cy + Math.sin(rad) * (r - 14)}
              x2={cx + Math.cos(rad) * (r - 4)}
              y2={cy + Math.sin(rad) * (r - 4)}
              stroke="rgba(185,143,79,0.5)"
              strokeWidth="1"
            />
          );
        })}

        {/* Center star */}
        <circle cx={cx} cy={cy} r="2.5" fill="rgba(185,143,79,0.9)" />
        <circle cx={cx} cy={cy} r="5"   fill="none" stroke="rgba(185,143,79,0.3)" strokeWidth="0.6" />
      </g>

      {/* Outer border ring */}
      <circle cx={cx} cy={cy} r={r}      fill="none" stroke="rgba(185,143,79,0.55)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r + 4}  fill="none" stroke="rgba(185,143,79,0.18)" strokeWidth="0.5" />
    </svg>
  );
}
