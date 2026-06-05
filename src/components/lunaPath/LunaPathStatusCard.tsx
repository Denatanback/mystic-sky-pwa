"use client";

import { getLevelProgress } from "@/lib/lunaPath/levels";
import type { LunaPathState } from "@/lib/lunaPath/types";
import { productFeatureFlags } from "@/lib/productFeatureFlags";
import { lunaCardStyle } from "./shared";

type Props = {
  state: LunaPathState;
};

export function LunaPathStatusCard({ state }: Props) {
  const progress = getLevelProgress(state.moonlightTotal);
  const tokensEnabled = productFeatureFlags.lunarTokensEnabled;

  return (
    <section style={{ ...lunaCardStyle, padding: "22px 20px", background: "radial-gradient(circle at 18% 0%, rgba(216,168,95,.14), transparent 34%), linear-gradient(145deg, rgba(22,13,54,.84), rgba(10,6,28,.70))" }}>
      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Luna Path</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>Luna Path</h1>
      <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>Each day, small rituals strengthen your connection with yourself through cards, practices, and mindful observation.</p>

      <div style={{ border: "1px solid rgba(216,168,95,.18)", borderRadius: 18, background: "rgba(255,255,255,.04)", padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <div>
            <p style={{ color: "var(--muted-2)", fontSize: 11, fontWeight: 800, marginBottom: 4 }}>Current level</p>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--gold-2)", fontSize: 27, fontWeight: 600, lineHeight: 1.1 }}>{progress.currentLevel.title}</h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "var(--muted-2)", fontSize: 11, fontWeight: 800, marginBottom: 4 }}>Streak</p>
            <p style={{ color: "var(--text)", fontSize: 22, fontWeight: 900 }}>{state.streakDays}</p>
          </div>
        </div>

        <div style={{ height: 9, borderRadius: 999, background: "rgba(255,255,255,.08)", overflow: "hidden", marginBottom: 9 }}>
          <div style={{ width: `${progress.progressPercent}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, rgba(216,168,95,.92), rgba(141,85,214,.82))" }} />
        </div>
        <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45 }}>
          {progress.nextLevel ? `${progress.remainingMoonlight} Moonlight until “${progress.nextLevel.title}”.` : "All MVP levels are open."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: tokensEnabled ? "repeat(2, minmax(0, 1fr))" : "1fr", gap: 9, marginBottom: 12 }}>
        <div style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 16, background: "rgba(216,168,95,.07)", padding: 12 }}>
          <p style={{ color: "var(--muted-2)", fontSize: 10, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>Moonlight</p>
          <p style={{ color: "var(--gold-2)", fontSize: 24, fontWeight: 900 }}>{state.moonlightTotal}</p>
        </div>
        {tokensEnabled && (
          <div style={{ border: "1px solid rgba(160,130,220,.18)", borderRadius: 16, background: "rgba(141,85,214,.09)", padding: 12 }}>
            <p style={{ color: "var(--muted-2)", fontSize: 10, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>Lunar Tokens</p>
            <p style={{ color: "var(--text)", fontSize: 24, fontWeight: 900 }}>{state.tokenBalance}</p>
          </div>
        )}
      </div>

      <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.55 }}>
        {tokensEnabled ? "Moonlight shows your long-term progress. Lunar Tokens are your spendable balance for deeper practices and Oracle answers." : "Moonlight shows your long-term progress through steady reflection and daily rituals."}
      </p>
    </section>
  );
}
