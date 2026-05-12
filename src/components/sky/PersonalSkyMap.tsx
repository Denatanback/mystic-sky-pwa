"use client";

import { useMemo } from "react";
import { skyPaths } from "@/data/paths";

/* Seeded random for background stars */
function seededRandom(seed: number) {
  let v = seed;
  return () => { v = (v * 9301 + 49297) % 233280; return v / 233280; };
}

function bgStars(count: number) {
  const rand = seededRandom(77);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand() * 420,
    y: rand() * 580,
    r: 0.5 + rand() * 1.5,
    op: 0.2 + rand() * 0.65,
  }));
}

/* Constellation shapes — each is a list of {x,y} nodes + edge pairs [i,j] */
const constellations = [
  { // Astrology — top center
    cx: 210, cy: 82,
    nodes: [[-22,-26],[14,-18],[28,8],[10,28],[-16,22],[-4,-6],[8,42]],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[5,1],[3,6]],
  },
  { // Numerology — right
    cx: 368, cy: 222,
    nodes: [[-6,-28],[20,-10],[26,18],[4,32],[-20,20],[-24,-4]],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]],
  },
  { // Human Design — bottom right
    cx: 328, cy: 452,
    nodes: [[0,-26],[22,-12],[20,16],[-2,30],[-22,12],[-20,-16]],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]],
  },
  { // Spiritual Practices — bottom left
    cx: 92, cy: 452,
    nodes: [[0,-26],[20,-10],[22,18],[-1,30],[-22,14],[-24,-12]],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[2,5]],
  },
  { // Past Life — left
    cx: 52, cy: 222,
    nodes: [[4,-28],[24,-6],[22,22],[0,32],[-22,20],[-22,-8]],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3]],
  },
];

/* Label positions for each path (outside the constellation cluster) */
const labelPositions = [
  { x: 210, y: 30,  anchor: "middle" }, // top
  { x: 400, y: 198, anchor: "start"  }, // right
  { x: 368, y: 500, anchor: "start"  }, // bottom right
  { x: 52,  y: 500, anchor: "end"    }, // bottom left
  { x: 18,  y: 198, anchor: "end"    }, // left
];

export function PersonalSkyMap() {
  const stars = useMemo(() => bgStars(180), []);

  return (
    <section aria-label="Личное небо" style={{ width: "100%", position: "relative" }}>
      <svg
        viewBox="0 0 420 580"
        width="100%"
        style={{ display: "block", maxHeight: "70dvh" }}
        aria-hidden="true"
      >
        <defs>
          {/* Glow filters per path color */}
          {skyPaths.map((p) => (
            <filter key={p.id} id={`glow-${p.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
          <filter id="glow-silhouette" x="-40%" y="-20%" width="180%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="silhouette-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#9bbce0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4a7ab5" stopOpacity="0.18" />
          </radialGradient>
        </defs>

        {/* ── Background stars ── */}
        {stars.map((s) => (
          <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill="#f0e0c8" opacity={s.op} />
        ))}

        {/* ── Faint orbit rings around center ── */}
        <circle cx="210" cy="280" r="145" fill="none" stroke="rgba(185,143,79,0.1)" strokeWidth="0.8" />
        <circle cx="210" cy="280" r="200" fill="none" stroke="rgba(185,143,79,0.07)" strokeWidth="0.5" />

        {/* ── Connecting lines from center to each constellation ── */}
        {constellations.map((c, i) => (
          <line
            key={i}
            x1="210" y1="280"
            x2={c.cx} y2={c.cy}
            stroke="rgba(185,143,79,0.12)"
            strokeWidth="0.6"
            strokeDasharray="3 6"
          />
        ))}

        {/* ── Human silhouette ── */}
        <g filter="url(#glow-silhouette)" opacity="0.8">
          {/* Head */}
          <ellipse cx="210" cy="218" rx="18" ry="20" fill="url(#silhouette-grad)" />
          {/* Body */}
          <path
            d="M 210 236 C 230 240 240 258 238 276 L 232 332 L 228 370 L 192 370 L 188 332 L 182 276 C 180 258 190 240 210 236 Z"
            fill="url(#silhouette-grad)"
          />
        </g>

        {/* ── Constellations ── */}
        {skyPaths.map((path, i) => {
          const c = constellations[i];
          const color = path.color as string;

          const absNodes = c.nodes.map(([dx, dy]) => ({
            x: c.cx + dx,
            y: c.cy + dy,
          }));

          return (
            <g key={path.id} filter={`url(#glow-${path.id})`}>
              {/* Constellation lines */}
              {c.edges.map(([a, b], ei) => (
                <line
                  key={ei}
                  x1={absNodes[a].x} y1={absNodes[a].y}
                  x2={absNodes[b].x} y2={absNodes[b].y}
                  stroke={color}
                  strokeWidth="0.7"
                  opacity="0.5"
                />
              ))}
              {/* Constellation dots */}
              {absNodes.map((n, ni) => (
                <circle
                  key={ni}
                  cx={n.x} cy={n.y}
                  r={ni === 0 ? 3.5 : 2.2}
                  fill={color}
                  opacity={ni === 0 ? 1 : 0.75}
                />
              ))}
              {/* Center glow dot */}
              <circle cx={c.cx} cy={c.cy} r="5" fill={color} opacity="0.18" />
            </g>
          );
        })}

        {/* ── Path labels ── */}
        {skyPaths.map((path, i) => {
          const lp = labelPositions[i];
          const color = path.color as string;
          return (
            <text
              key={path.id}
              x={lp.x} y={lp.y}
              textAnchor={lp.anchor as "middle" | "start" | "end"}
              fill={color}
              fontSize="13"
              fontFamily="var(--font-serif)"
              opacity="0.9"
            >
              {path.title}
            </text>
          );
        })}

        {/* ── Progress arcs under each label ── */}
        {skyPaths.map((path, i) => {
          const lp = labelPositions[i];
          const color = path.color as string;
          const barW = 48;
          const barX = lp.anchor === "end" ? lp.x - barW
                     : lp.anchor === "start" ? lp.x
                     : lp.x - barW / 2;
          return (
            <g key={`prog-${path.id}`} opacity="0.7">
              <rect x={barX} y={lp.y + 5} width={barW} height="2" rx="1" fill="rgba(255,255,255,0.12)" />
              <rect x={barX} y={lp.y + 5} width={barW * (path.progress / 100)} height="2" rx="1" fill={color} />
            </g>
          );
        })}
      </svg>
    </section>
  );
}
