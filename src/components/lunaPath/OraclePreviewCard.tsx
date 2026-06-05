"use client";

import { ComingSoonBadge, OracleFallbackBadge, lunaCardStyle } from "./shared";

export function OraclePreviewCard() {
  return (
    <section style={{ ...lunaCardStyle, padding: 16, background: "radial-gradient(circle at 82% 0%, rgba(141,85,214,.18), transparent 34%), rgba(12,8,28,.64)" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", overflow: "visible" }}>
        <OracleFallbackBadge size={56} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>Coming soon</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 7 }}>eLuna Oracle</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 13 }}>A future reflective guide for deeper symbolic questions. Continue your Luna Path to prepare for upcoming Oracle features.</p>
          <ComingSoonBadge />
        </div>
      </div>
    </section>
  );
}
