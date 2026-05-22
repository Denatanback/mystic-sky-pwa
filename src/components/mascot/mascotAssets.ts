/**
 * mascotAssets.ts
 *
 * PNG artwork is not yet available. The SVG Mascot component is used as the
 * visible fallback everywhere (MASCOT_IMAGES_READY = false).
 *
 * To ship the real fox artwork:
 *   1. Place four files in /src/assets/mascot/:
 *        eluna-fox-calm.png
 *        eluna-fox-happy.png
 *        eluna-fox-sad.png
 *        eluna-fox-curious.png
 *   2. Uncomment the PNG imports and mascotImages map below.
 *   3. Flip  MASCOT_IMAGES_READY = true.
 *      All MascotDisplay instances will switch to PNG automatically.
 */

// ── Types ─────────────────────────────────────────────────────────────────────
export type MascotMood = "calm" | "happy" | "sad" | "curious";

import type { MascotPose } from "./Mascot";

/** Maps mood to the SVG Mascot pose used while MASCOT_IMAGES_READY is false. */
export const MOOD_TO_POSE: Record<MascotMood, MascotPose> = {
  calm:    "calm",
  curious: "sitting",
  happy:   "pointing",
  sad:     "calm",
};

/** Opacity applied to the fox for "sad" state. */
export const MOOD_OPACITY: Record<MascotMood, number> = {
  calm:    1,
  curious: 1,
  happy:   1,
  sad:     0.65,
};

/**
 * Flip to `true` once the real PNG artwork is placed in /src/assets/mascot/.
 * While false, MascotDisplay renders the SVG Mascot as a visible dev fallback.
 */
export const MASCOT_IMAGES_READY = false;
