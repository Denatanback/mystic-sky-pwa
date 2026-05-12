"use client";

import { useMemo } from "react";
import { useDeviceParallax } from "@/hooks/useDeviceParallax";
import "./celestial-background.css";

function seededRandom(seed: number) {
  let v = seed;
  return () => {
    v = (v * 9301 + 49297) % 233280;
    return v / 233280;
  };
}

function makeStars(count: number, seed: number) {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: rand() * 100,
    top: rand() * 100,
    size: 0.8 + rand() * 2.2,
    delay: rand() * 8,
    duration: 4 + rand() * 5,
    opacity: 0.2 + rand() * 0.75,
  }));
}

export function CelestialBackground() {
  const deep  = useMemo(() => makeStars(160, 7),  []);
  const mid   = useMemo(() => makeStars(100, 31), []);
  const near  = useMemo(() => makeStars(55,  53), []);
  const offset = useDeviceParallax(8);

  return (
    <div className="celestial-bg" aria-hidden="true">
      {/* Deep background layer — barely moves */}
      <div className="star-layer" style={{ transform: `translate3d(${offset.x * -0.3}px, ${offset.y * -0.3}px, 0)` }}>
        {deep.map((s) => (
          <span
            key={s.id}
            className="twinkle-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity * 0.7,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Mid layer */}
      <div className="star-layer" style={{ transform: `translate3d(${offset.x * -0.6}px, ${offset.y * -0.6}px, 0)` }}>
        {mid.map((s) => (
          <span
            key={s.id}
            className="twinkle-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Near bright stars — most parallax */}
      <div className="star-layer" style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}>
        {near.map((s) => (
          <span
            key={s.id}
            className="twinkle-star bright"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size + 0.8,
              height: s.size + 0.8,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration + 1}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle nebula glows */}
      <div className="nebula nebula-blue" />
      <div className="nebula nebula-purple" />
    </div>
  );
}
