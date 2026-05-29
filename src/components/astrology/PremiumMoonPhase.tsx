"use client";

import Image from "next/image";
import { getMoonPhaseAssetKey, moonPhaseAssets } from "@/lib/astrology/moonPhaseAssets";

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
  const assetKey = getMoonPhaseAssetKey({ phaseName, illumination, waxing });
  const asset = moonPhaseAssets[assetKey];
  const alt = phaseName || "Moon phase";

  if (process.env.NODE_ENV === "development") {
    console.debug("[PremiumMoonPhase]", {
      phaseName,
      illumination,
      waxing,
      assetKey,
    });
  }

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
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "8%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(216,168,95,.16), rgba(128,64,192,.12) 46%, rgba(10,6,28,0) 72%)",
          filter: "blur(10px)",
          boxShadow: "0 0 30px rgba(216,168,95,.20), 0 0 42px rgba(128,64,192,.18)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: Math.round(dimension * 0.9),
          height: Math.round(dimension * 0.9),
          borderRadius: "50%",
          overflow: "hidden",
          clipPath: "circle(45% at 50% 50%)",
          position: "relative",
          zIndex: 1,
          display: "grid",
          placeItems: "center",
          background: "transparent",
          boxShadow: "0 0 22px rgba(216,168,95,.16)",
        }}
      >
        <Image
          src={asset}
          alt={alt}
          width={dimension}
          height={dimension}
          sizes={`${dimension}px`}
          priority={false}
          unoptimized
          style={{
            width: "128%",
            height: "128%",
            objectFit: "cover",
            transform: "scale(1.04)",
            position: "relative",
          }}
        />
      </div>
    </div>
  );
}
