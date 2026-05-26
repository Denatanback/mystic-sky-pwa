"use client";
import { useGuide } from "./GuideProvider";

export function GuideTopBarButton() {
  const { openHelp } = useGuide();

  return (
    <button
      className="icon-btn"
      onClick={openHelp}
      aria-label="Open help"
      title="Help"
      style={{
        borderColor: "rgba(247, 217, 139, 0.42)",
        background:  "radial-gradient(circle at 35% 25%, rgba(247,217,139,.16), rgba(128,64,192,.18) 58%, rgba(20,12,40,.76))",
        boxShadow:   "0 0 18px rgba(128,64,192,.16), inset 0 1px 0 rgba(255,255,255,.08)",
        color:       "var(--gold-2)",
        fontFamily:  "var(--font-ui)",
        fontSize:    18,
        fontWeight:  800,
        lineHeight:  1,
        position:    "relative",
      }}
    >
      ?
    </button>
  );
}
