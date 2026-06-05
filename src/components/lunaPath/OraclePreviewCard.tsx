"use client";

import Link from "next/link";
import { lunaCardStyle, lunaPrimaryButtonStyle } from "./shared";

export function OraclePreviewCard() {
  return (
    <section style={{ ...lunaCardStyle, padding: 16, background: "radial-gradient(circle at 82% 0%, rgba(141,85,214,.18), transparent 34%), rgba(12,8,28,.64)" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <img
          src="/assets/practice-icons/eluna-oracle-icon.png"
          alt="eLuna Oracle illustration"
          style={{ width: "clamp(92px, 26vw, 118px)", height: "clamp(82px, 22vw, 108px)", objectFit: "contain", flexShrink: 0, filter: "drop-shadow(0 14px 22px rgba(74,32,124,.22)) drop-shadow(0 0 16px rgba(216,168,95,.09))" }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>Preview</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 7 }}>eLuna Oracle</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 13 }}>The Oracle is available in Practices. Continue Luna Path to earn tokens for deeper reflective answers.</p>
          <Link href="/practices#oracle" style={{ ...lunaPrimaryButtonStyle, minHeight: 40 }}>Go to Oracle</Link>
        </div>
      </div>
    </section>
  );
}
