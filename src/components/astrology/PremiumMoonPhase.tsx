"use client";

import Image from "next/image";
import { getMoonPhaseAsset } from "@/lib/astrology/moonPhaseAssets";

type PremiumMoonPhaseProps = {
  phaseName?: string;
  illumination?: number;
  waxing?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: 72,
  md: 112,
  lg: 148,
};

export function PremiumMoonPhase({
  phaseName,
  illumination,
  waxing,
  size = "md",
  className,
}: PremiumMoonPhaseProps) {
  const dimension = sizes[size];
  const asset = getMoonPhaseAsset({ phaseName, illumination, waxing });
  const alt = phaseName || "Moon phase";

  return (
    <div
      className={className}
      style={{
        width: dimension,
        height: dimension,
        borderRadius: "50%",
        position: "relative",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        background: "radial-gradient(circle, rgba(216,168,95,.12), rgba(128,64,192,.10) 48%, rgba(10,6,28,0) 72%)",
        filter: "drop-shadow(0 0 18px rgba(216,168,95,.20)) drop-shadow(0 0 28px rgba(128,64,192,.16))",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "10%",
          borderRadius: "50%",
          boxShadow: "0 0 28px rgba(216,168,95,.20), inset 0 0 18px rgba(255,255,255,.04)",
          pointerEvents: "none",
        }}
      />
      <Image
        src={asset}
        alt={alt}
        width={dimension}
        height={dimension}
        sizes={`${dimension}px`}
        priority={false}
        unoptimized
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}
