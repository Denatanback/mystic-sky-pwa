"use client";

import { useEffect, useState } from "react";

export type ParallaxOffset = { x: number; y: number };

export function useDeviceParallax(intensity = 10): ParallaxOffset {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onPointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * intensity;
      const y = (event.clientY / window.innerHeight - 0.5) * intensity;
      setOffset({ x, y });
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;
      setOffset({
        x: Math.max(-intensity, Math.min(intensity, gamma / 4)),
        y: Math.max(-intensity, Math.min(intensity, beta / 8))
      });
    };

    window.addEventListener("pointermove", onPointer);
    window.addEventListener("deviceorientation", onOrientation);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, [intensity]);

  return offset;
}
