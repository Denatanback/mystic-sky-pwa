"use client";

import type { LunaPathState } from "@/lib/lunaPath/types";
import { productFeatureFlags } from "@/lib/productFeatureFlags";
import { lunaCardStyle } from "./shared";

type Props = {
  state: LunaPathState;
};

export function TokenLedgerPreview({ state }: Props) {
  if (!productFeatureFlags.lunarTokensEnabled) return null;

  const entries = state.ledger.slice(0, 5);

  return (
    <section style={{ ...lunaCardStyle, padding: 16 }}>
      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>Tokens</p>
      {entries.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>Your first token entries will appear after today’s rituals.</p>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {entries.map((entry) => (
            <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 8 }}>
              <span style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.4 }}>{entry.reason}</span>
              <span style={{ color: entry.type === "earn" ? "var(--gold-2)" : "var(--muted-2)", fontSize: 12, fontWeight: 900 }}>{entry.type === "earn" ? "+" : "-"}{entry.amount}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
