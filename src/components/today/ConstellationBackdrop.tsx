/* Faint constellation map overlay — sits between celestial-bg and content.
   Decorative only. */

const GOLD = "rgba(185, 143, 79, 0.22)";
const STAR = "rgba(240, 224, 200, 0.55)";

/* A handful of small constellation polylines scattered around the edges */
const LINES = [
  { points: "30,40 55,52 78,44 96,62 118,55", side: "left-top" },
  { points: "350,30 380,46 405,34 430,58 415,80", side: "right-top" },
  { points: "20,180 38,210 70,200", side: "left-mid" },
  { points: "395,200 420,220 445,205", side: "right-mid" },
  { points: "40,560 62,584 90,575 115,600", side: "left-bot" },
  { points: "335,580 365,602 395,590", side: "right-bot" },
];

const STARS_POS: [number, number, number][] = [
  // [x, y, size]
  [30, 40, 1.5], [55, 52, 1.2], [78, 44, 1.0], [96, 62, 1.3], [118, 55, 1.0],
  [350, 30, 1.4], [380, 46, 1.0], [405, 34, 1.2], [430, 58, 1.0], [415, 80, 1.3],
  [20, 180, 1.2], [38, 210, 1.0], [70, 200, 1.3],
  [395, 200, 1.2], [420, 220, 1.0], [445, 205, 1.3],
  [40, 560, 1.4], [62, 584, 1.1], [90, 575, 1.2], [115, 600, 1.0],
  [335, 580, 1.3], [365, 602, 1.1], [395, 590, 1.2],
  // Scatter
  [200, 100, 0.9], [240, 130, 0.7], [180, 350, 0.8], [260, 380, 0.7],
  [100, 280, 0.7], [330, 260, 0.8], [50, 420, 0.6], [400, 440, 0.7],
];

export function ConstellationBackdrop() {
  return (
    <svg
      viewBox="0 0 460 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.85,
      }}
    >
      {LINES.map((l, i) => (
        <polyline
          key={i}
          points={l.points}
          fill="none"
          stroke={GOLD}
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      ))}
      {STARS_POS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={STAR} />
      ))}
    </svg>
  );
}
