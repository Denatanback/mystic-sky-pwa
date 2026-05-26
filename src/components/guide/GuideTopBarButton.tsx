"use client";
import { useGuide } from "./GuideProvider";

export function GuideTopBarButton() {
  const { openHelp } = useGuide();

  return (
    <button
      className="icon-btn"
      onClick={openHelp}
      aria-label="Open guide"
      style={{
        borderColor: "rgba(255, 214, 130, 0.36)",
        background:  "rgba(20, 12, 40, 0.72)",
        position:    "relative",
      }}
    >
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="m5.6 5.6 2.8 2.8" />
        <path d="m15.6 15.6 2.8 2.8" />
        <path d="m18.4 5.6-2.8 2.8" />
        <path d="m8.4 15.6-2.8 2.8" />
      </svg>
    </button>
  );
}
