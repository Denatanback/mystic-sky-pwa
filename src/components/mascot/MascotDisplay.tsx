/**
 * MascotDisplay
 *
 * Renders the fox mascot at any requested size using the SVG Mascot component.
 * The SVG is scaled to fit the bounding box; at small sizes (< 90px) the view
 * is clipped to `size` height so only the fox head / upper body shows.
 *
 * When PNG artwork is ready:
 *   1. Place four files in /src/assets/mascot/ (calm/happy/sad/curious).
 *   2. Restore the PNG imports and getMascotImage call in mascotAssets.ts.
 *   3. Flip MASCOT_IMAGES_READY = true in mascotAssets.ts.
 *      Replace this component's body with a next/image render.
 *
 * Props:
 *   mood  — drives which SVG pose to show.
 *   size  — square bounding box in px (default 80).
 *           Recommended values:
 *             40  — icon button (head / upper body)
 *             72  — tutorial card
 *             90  — sheet header (full fox)
 */
"use client";
import { Mascot } from "./Mascot";
import { MOOD_OPACITY, MOOD_TO_POSE, type MascotMood } from "./mascotAssets";

interface MascotDisplayProps {
  mood: MascotMood;
  /** Square bounding box in px. Default 80. */
  size?: number;
}

export function MascotDisplay({ mood, size = 80 }: MascotDisplayProps) {
  const pose    = MOOD_TO_POSE[mood];
  const opacity = MOOD_OPACITY[mood];

  // The Mascot SVG has an intrinsic viewBox of 0 0 100 132.
  // Scale so the SVG width matches `size`; clip height to `size` for small
  // icons so the head stays visible, give full body room for larger sizes.
  const scale      = size / 100;
  const clipHeight = size < 90 ? size : Math.round(size * 1.32);

  return (
    <div
      aria-hidden="true"
      style={{
        width:          size,
        height:         clipHeight,
        overflow:       "hidden",
        display:        "flex",
        alignItems:     "flex-start",
        justifyContent: "center",
        flexShrink:     0,
        opacity,
      }}
    >
      <div
        style={{
          transform:       `scale(${scale})`,
          transformOrigin: "top center",
          display:         "flex",
          flexShrink:      0,
          lineHeight:      0,
        }}
      >
        <Mascot pose={pose} />
      </div>
    </div>
  );
}
