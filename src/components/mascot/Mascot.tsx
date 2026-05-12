/* TODO: Replace with final illustrated fox asset from designer.
   This SVG is the consistent placeholder — same proportions, same personality across all screens. */

export type MascotPose = "sitting" | "pointing" | "calm" | "small";

export function Mascot({ pose = "sitting", className = "" }: { pose?: MascotPose; className?: string }) {
  const isCalm = pose === "calm";
  const isPointing = pose === "pointing";
  const isSmall = pose === "small";

  return (
    <svg
      viewBox="0 0 100 132"
      width={isSmall ? 72 : 100}
      height={isSmall ? 95 : 132}
      fill="none"
      aria-label="Звездный лис-проводник"
      className={["mascot-fox", className].filter(Boolean).join(" ")}
    >
      {/* ── Tail (rendered behind body) ── */}
      <path
        d="M 65 120 Q 95 112 94 86 Q 93 64 76 74 Q 66 82 68 98 Q 68 110 65 120 Z"
        fill="#a85f28"
        stroke="#e7d5b5"
        strokeWidth="1.3"
      />
      <ellipse cx="90" cy="80" rx="7" ry="12" fill="#ddb882" stroke="#e7d5b5" strokeWidth="1"
        transform="rotate(-18 90 80)" opacity="0.85" />

      {/* ── Body ── */}
      <ellipse cx="48" cy="100" rx="25" ry="27" fill="#b86425" stroke="#e7d5b5" strokeWidth="1.4" />

      {/* ── Chest bib ── */}
      <ellipse cx="48" cy="95" rx="15" ry="17" fill="#d4a96c" opacity="0.88" />

      {/* ── Gold star charm ── */}
      <text x="42" y="101" fontSize="10" fill="#b98f4f" fontFamily="serif" opacity="0.9">✦</text>

      {/* ── Front paws ── */}
      <ellipse cx="35" cy="122" rx="10" ry="4.5" fill="#b86425" stroke="#e7d5b5" strokeWidth="1.1" />
      <ellipse cx="61" cy="122" rx="10" ry="4.5" fill="#b86425" stroke="#e7d5b5" strokeWidth="1.1" />

      {/* ── Extended paw for pointing pose ── */}
      {isPointing && (
        <path d="M 72 90 Q 88 84 96 78" stroke="#e7d5b5" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* ── Left ear ── */}
      <polygon points="28,48 19,11 44,42" fill="#b86425" stroke="#e7d5b5" strokeWidth="1.3" />
      <polygon points="30,46 23,17 41,42" fill="#e08c6e" opacity="0.8" />

      {/* ── Right ear ── */}
      <polygon points="68,48 77,11 52,42" fill="#b86425" stroke="#e7d5b5" strokeWidth="1.3" />
      <polygon points="66,46 73,17 55,42" fill="#e08c6e" opacity="0.8" />

      {/* ── Head ── */}
      <ellipse cx="48" cy="56" rx="26" ry="23" fill="#b86425" stroke="#e7d5b5" strokeWidth="1.4" />

      {/* ── Muzzle ── */}
      <ellipse cx="48" cy="65" rx="14" ry="11" fill="#c87840" />

      {/* ── Eyes (open or calm/closed) ── */}
      {isCalm ? (
        <>
          <path d="M 36 53 Q 39 50 42 53" stroke="#160b04" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 54 53 Q 57 50 60 53" stroke="#160b04" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="38" cy="53" r="3.5" fill="#0e0603" />
          <circle cx="58" cy="53" r="3.5" fill="#0e0603" />
          <circle cx="39.2" cy="51.8" r="1.1" fill="rgba(255,255,255,0.55)" />
          <circle cx="59.2" cy="51.8" r="1.1" fill="rgba(255,255,255,0.55)" />
        </>
      )}

      {/* ── Nose ── */}
      <ellipse cx="48" cy="62" rx="3.2" ry="2.2" fill="#0e0603" />

      {/* ── Mouth ── */}
      <path d="M 44.5 65.5 Q 48 68.5 51.5 65.5" stroke="#0e0603" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* ── Whisker lines ── */}
      <line x1="20" y1="63" x2="34" y2="64" stroke="#e7d5b5" strokeWidth="0.7" opacity="0.5" />
      <line x1="20" y1="66" x2="34" y2="66" stroke="#e7d5b5" strokeWidth="0.7" opacity="0.4" />
      <line x1="62" y1="64" x2="76" y2="63" stroke="#e7d5b5" strokeWidth="0.7" opacity="0.5" />
      <line x1="62" y1="66" x2="76" y2="66" stroke="#e7d5b5" strokeWidth="0.7" opacity="0.4" />
    </svg>
  );
}
