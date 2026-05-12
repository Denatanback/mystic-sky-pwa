/* Small round engraved medallion — sits in panel header.
   3 variants: sun, cup, compass. All ~36px round, antique etching style. */

type Variant = "sun" | "cup" | "compass";

const STROKE = "rgba(85, 42, 8, 0.85)";
const FILL_BG = "rgba(255, 246, 220, 0.35)";

export function PanelMedallion({ variant, size = 36 }: { variant: Variant; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 30% 25%, rgba(255,245,210,0.6) 0%, transparent 55%), " +
          "linear-gradient(160deg, rgba(255,235,190,0.5), rgba(180,125,60,0.3))",
        border: "1px solid rgba(115, 60, 12, 0.55)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,245,200,0.25), " +
          "inset 0 0 6px rgba(135, 78, 18, 0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox="0 0 40 40" width={size - 4} height={size - 4} fill="none">
        {variant === "sun"     && <SunIcon />}
        {variant === "cup"     && <CupIcon />}
        {variant === "compass" && <CompassIcon />}
      </svg>
    </div>
  );
}

/* ── Sun face ── */
function SunIcon() {
  return (
    <g stroke={STROKE} strokeWidth="0.9" fill="none">
      {/* Outer faint ring */}
      <circle cx="20" cy="20" r="14" opacity="0.35" />
      {/* Sun body */}
      <circle cx="20" cy="20" r="6.5" fill={FILL_BG} />
      {/* Rays */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const x1 = 20 + Math.cos(a) * 9;
        const y1 = 20 + Math.sin(a) * 9;
        const x2 = 20 + Math.cos(a) * (i % 2 === 0 ? 13 : 11);
        const y2 = 20 + Math.sin(a) * (i % 2 === 0 ? 13 : 11);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      {/* Face */}
      <circle cx="17.5" cy="19" r="0.7" fill={STROKE} />
      <circle cx="22.5" cy="19" r="0.7" fill={STROKE} />
      <path d="M 17.5 22 Q 20 23.5 22.5 22" strokeWidth="0.7" />
    </g>
  );
}

/* ── Tea cup (used for "available today" header) ── */
function CupIcon() {
  return (
    <g stroke={STROKE} strokeWidth="0.9" fill="none" strokeLinecap="round">
      {/* Steam */}
      <path d="M 16 11 Q 17 9 16 7 Q 15 5 16 3" opacity="0.65" />
      <path d="M 20 11 Q 21 9 20 7 Q 19 5 20 3" opacity="0.65" />
      <path d="M 24 11 Q 25 9 24 7 Q 23 5 24 3" opacity="0.65" />
      {/* Cup body */}
      <path d="M 11 14 L 11 24 Q 11 28 15 28 L 23 28 Q 27 28 27 24 L 27 14 Z" fill={FILL_BG} />
      {/* Inner rim */}
      <ellipse cx="19" cy="14" rx="8" ry="1.5" />
      {/* Handle */}
      <path d="M 27 17 Q 32 17 32 21 Q 32 25 27 25" />
      {/* Saucer */}
      <ellipse cx="19" cy="30" rx="11" ry="2" />
      {/* Star on cup */}
      <text x="19" y="22" fontSize="5" fill={STROKE} stroke="none" textAnchor="middle" fontFamily="serif">✦</text>
    </g>
  );
}

/* ── Compass rose ── */
function CompassIcon() {
  return (
    <g stroke={STROKE} strokeWidth="0.9" fill="none">
      <circle cx="20" cy="20" r="14" opacity="0.35" />
      <circle cx="20" cy="20" r="11" fill={FILL_BG} />
      {/* 4-point star (vertical larger) */}
      <polygon points="20,7 22,18 20,29 18,18" fill={STROKE} stroke="none" opacity="0.8" />
      <polygon points="7,20 18,18 29,20 18,22" fill={STROKE} stroke="none" opacity="0.5" />
      {/* Diagonals */}
      <polygon points="11,11 19,19 11,11" />
      <line x1="11" y1="11" x2="14.5" y2="14.5" strokeWidth="0.6" />
      <line x1="29" y1="11" x2="25.5" y2="14.5" strokeWidth="0.6" />
      <line x1="11" y1="29" x2="14.5" y2="25.5" strokeWidth="0.6" />
      <line x1="29" y1="29" x2="25.5" y2="25.5" strokeWidth="0.6" />
      {/* Center dot */}
      <circle cx="20" cy="20" r="1.5" fill={STROKE} />
    </g>
  );
}
