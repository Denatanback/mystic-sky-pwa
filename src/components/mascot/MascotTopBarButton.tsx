/**
 * MascotTopBarButton
 *
 * Drop-in `icon-btn`-sized (40×40 px) mascot button for page top-bar headers.
 * Add it to any page's action area:
 *
 *   import { MascotTopBarButton } from "@/components/mascot/MascotTopBarButton";
 *   // inside header jsx:
 *   <div className="app-topbar__actions">
 *     ...existing buttons...
 *     <MascotTopBarButton />
 *   </div>
 *
 * Requires MascotProvider to be an ancestor (already wired in layout.tsx).
 * Does NOT accept props — it reads section and opens help via useMascot().
 */
"use client";
import { useMascot } from "./MascotProvider";
import { MascotDisplay } from "./MascotDisplay";

export function MascotTopBarButton() {
  const { openHelp, currentMood } = useMascot();

  return (
    <button
      className="icon-btn"
      onClick={openHelp}
      aria-label="Open guide"
      style={{
        // Override icon-btn default to give it a slightly warmer gold tint
        // matching the mascot brand. All sizing/shape comes from icon-btn CSS.
        borderColor: "rgba(255, 214, 130, 0.36)",
        background:  "rgba(20, 12, 40, 0.72)",
        overflow:    "hidden",
        padding:     0,
        position:    "relative",
      }}
    >
      {/* Fox head visible inside 40×40 button — top-cropped SVG or PNG */}
      <MascotDisplay mood={currentMood} size={40} />
    </button>
  );
}
