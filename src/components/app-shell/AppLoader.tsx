"use client";
import { useEffect, useState } from "react";

interface Props {
  /** Set to true when the host page has finished its initial data load */
  ready: boolean;
}

// Six stars evenly spaced around the orbit ring.
// Each star's animation-delay is offset so it glows exactly when the comet passes.
// Orbit duration = 2 s → one star every 2/6 ≈ 0.333 s.
const STARS = [0, 60, 120, 180, 240, 300] as const;
const ORBIT_R = 60; // px — matches .eluna-loader__scene size / 2
const ORBIT_DURATION = 2; // s

export function AppLoader({ ready }: Props) {
  const [hiding, setHiding] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!ready) return;
    // Ensure the loader is visible for at least 500 ms so it never flashes.
    const minDelay = 500;
    const t1 = setTimeout(() => setHiding(true), minDelay);
    const t2 = setTimeout(() => setVisible(false), minDelay + 450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ready]);

  if (!visible) return null;

  return (
    <div className={`eluna-loader${hiding ? " eluna-loader--out" : ""}`} aria-hidden="true">
      <div className="eluna-loader__scene">
        {/* Static orbital ring */}
        <div className="eluna-loader__ring" />

        {/* Rotating arm + comet dot */}
        <div className="eluna-loader__orbit">
          <div className="eluna-loader__comet" />
        </div>

        {/* Six star dots, staggered so each glows as the comet passes */}
        {STARS.map((deg, i) => {
          const rad = (deg - 90) * (Math.PI / 180);
          const x = ORBIT_R * Math.cos(rad);
          const y = ORBIT_R * Math.sin(rad);
          const delay = -(i * (ORBIT_DURATION / STARS.length));
          return (
            <div
              key={deg}
              className="eluna-loader__star"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}

        {/* Centre symbol */}
        <div className="eluna-loader__center">✦</div>
      </div>
    </div>
  );
}
