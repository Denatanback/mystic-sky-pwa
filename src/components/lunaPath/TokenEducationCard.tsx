"use client";

import { productFeatureFlags } from "@/lib/productFeatureFlags";
import { ComingSoonBadge, lunaCardStyle } from "./shared";

const tokenRows = [
  ["Open your daily card", "+10 tokens"],
  ["Write a reflection", "+25 tokens"],
  ["Check in with your mood", "+5 tokens"],
  ["Complete a practice", "+15 tokens"],
];

export function TokenEducationCard() {
  if (!productFeatureFlags.lunarTokensEnabled) {
    return (
      <section style={{ ...lunaCardStyle, padding: 16, background: "radial-gradient(circle at 82% 0%, rgba(216,168,95,.12), transparent 34%), rgba(12,8,28,.64)" }}>
        <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Lunar Tokens</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 7 }}>Future reward system</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 12 }}>A future reward system for consistent reflection and deeper Oracle access. We are preparing this carefully before release.</p>
        <ComingSoonBadge />
      </section>
    );
  }

  return (
    <section style={{ ...lunaCardStyle, padding: 16 }}>
      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Lunar Tokens</p>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 7 }}>How Lunar Tokens work</h2>
      <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 12 }}>Earn tokens by completing daily rituals. Spend them on Oracle answers and deeper practices. Moonlight shows your long-term progress; Lunar Tokens are your spendable balance.</p>
      <div style={{ display: "grid", gap: 7, marginBottom: 12 }}>
        {tokenRows.map(([label, reward]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 10, border: "1px solid rgba(216,168,95,.12)", borderRadius: 14, background: "rgba(255,255,255,.035)", padding: "9px 11px" }}>
            <span style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.35 }}>{label}</span>
            <span style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 900 }}>{reward}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
        <div style={{ border: "1px solid rgba(216,168,95,.14)", borderRadius: 14, background: "rgba(216,168,95,.06)", padding: 10 }}>
          <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 900, marginBottom: 3 }}>Moonlight</p>
          <p style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.45 }}>Long-term progress</p>
        </div>
        <div style={{ border: "1px solid rgba(141,85,214,.18)", borderRadius: 14, background: "rgba(141,85,214,.08)", padding: 10 }}>
          <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 900, marginBottom: 3 }}>Lunar Tokens</p>
          <p style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.45 }}>Spendable balance</p>
        </div>
      </div>
    </section>
  );
}
