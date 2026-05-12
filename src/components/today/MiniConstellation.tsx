/* Mini constellation illustrations — one per sky path.
   Each ~44px wide, distinctive shape, glowing in path color. */

import type { PathId } from "@/lib/types";

type Props = { pathId: PathId; color: string; size?: number };

export function MiniConstellation({ pathId, color, size = 44 }: Props) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      style={{ filter: `drop-shadow(0 0 5px ${color}80)` }}
      aria-hidden="true"
    >
      {pathId === "astrology"           && <Astro    color={color} />}
      {pathId === "numerology"          && <Numbers  color={color} />}
      {pathId === "human-design"        && <Human    color={color} />}
      {pathId === "past-life"           && <Past     color={color} />}
      {pathId === "spiritual-practices" && <Spirit   color={color} />}
    </svg>
  );
}

/* ── Astrology — radiating star burst ── */
function Astro({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth="0.7" fill={color} fillOpacity="0.85">
      {/* Center 5-pointed star */}
      <polygon
        points="20,8 22,16 30,16 24,21 26,29 20,24 14,29 16,21 10,16 18,16"
        fillOpacity="0.85"
      />
      {/* Surrounding small stars */}
      <circle cx="6"  cy="10" r="0.9" />
      <circle cx="34" cy="14" r="0.7" />
      <circle cx="33" cy="32" r="0.9" />
      <circle cx="6"  cy="30" r="0.8" />
      <circle cx="20" cy="3"  r="0.6" />
      {/* Very faint connecting rays */}
      <line x1="20" y1="18" x2="6"  y2="10" strokeOpacity="0.3" strokeWidth="0.3" />
      <line x1="20" y1="18" x2="34" y2="14" strokeOpacity="0.3" strokeWidth="0.3" />
      <line x1="20" y1="22" x2="33" y2="32" strokeOpacity="0.3" strokeWidth="0.3" />
      <line x1="20" y1="22" x2="6"  y2="30" strokeOpacity="0.3" strokeWidth="0.3" />
    </g>
  );
}

/* ── Numerology — connected hex with center dot ── */
function Numbers({ color }: { color: string }) {
  const verts: [number, number][] = [[20, 6], [30, 12], [30, 24], [20, 30], [10, 24], [10, 12]];
  return (
    <g stroke={color} strokeWidth="0.7" fill="none">
      {/* Hexagon */}
      <polygon points={verts.map(([x, y]) => `${x},${y}`).join(" ")} strokeOpacity="0.6" />
      {/* Internal triangulation */}
      <line x1="20" y1="6"  x2="20" y2="30" strokeOpacity="0.35" />
      <line x1="10" y1="12" x2="30" y2="24" strokeOpacity="0.35" />
      <line x1="30" y1="12" x2="10" y2="24" strokeOpacity="0.35" />
      {/* Vertex dots */}
      {verts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill={color} />
      ))}
      {/* Center brightest */}
      <circle cx="20" cy="18" r="2.4" fill={color} fillOpacity="0.9" />
    </g>
  );
}

/* ── Human Design — triangle/pyramid with inner triangle ── */
function Human({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth="0.8" fill="none">
      {/* Outer triangle */}
      <polygon points="20,4 33,30 7,30" />
      {/* Inner triangle */}
      <polygon points="20,14 27,28 13,28" fill={color} fillOpacity="0.25" />
      {/* Inner dot */}
      <circle cx="20" cy="22" r="2" fill={color} />
      {/* Vertex dots */}
      <circle cx="20" cy="4"  r="1.4" fill={color} />
      <circle cx="33" cy="30" r="1.2" fill={color} />
      <circle cx="7"  cy="30" r="1.2" fill={color} />
      {/* Lines from apex to internal points */}
      <line x1="20" y1="4" x2="20" y2="22" strokeOpacity="0.35" />
    </g>
  );
}

/* ── Past Life — concentric spiral arcs ── */
function Past({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth="0.8" fill="none">
      {/* Concentric arcs forming spiral feel */}
      <circle cx="20" cy="20" r="3"  fill={color} fillOpacity="0.5" />
      <circle cx="20" cy="20" r="6"  strokeOpacity="0.7" />
      <circle cx="20" cy="20" r="10" strokeOpacity="0.45" strokeDasharray="2 1.5" />
      <circle cx="20" cy="20" r="14" strokeOpacity="0.25" strokeDasharray="1 2" />
      {/* Tiny stars on outer ring */}
      <circle cx="20" cy="6"  r="0.9" fill={color} />
      <circle cx="34" cy="20" r="0.9" fill={color} />
      <circle cx="20" cy="34" r="0.9" fill={color} />
      <circle cx="6"  cy="20" r="0.9" fill={color} />
      {/* Center cross */}
      <line x1="20" y1="17" x2="20" y2="23" strokeOpacity="0.6" />
      <line x1="17" y1="20" x2="23" y2="20" strokeOpacity="0.6" />
    </g>
  );
}

/* ── Spiritual Practices — lotus / petal flower ── */
function Spirit({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth="0.8" fill="none">
      {/* 6 petals via rotated ellipses */}
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <ellipse
          key={a}
          cx="20"
          cy="20"
          rx="3"
          ry="11"
          transform={`rotate(${a} 20 20)`}
          strokeOpacity="0.55"
          fill={color}
          fillOpacity="0.08"
        />
      ))}
      {/* Center */}
      <circle cx="20" cy="20" r="2.5" fill={color} fillOpacity="0.9" />
      <circle cx="20" cy="20" r="4.5" strokeOpacity="0.4" />
    </g>
  );
}
