"use client";

import { getLevelProgress, lunaPathLevels } from "@/lib/lunaPath/levels";
import type { LunaPathState } from "@/lib/lunaPath/types";
import { lunaCardStyle } from "./shared";

type Props = {
  state: LunaPathState;
};

export function LunaPathLevels({ state }: Props) {
  const progress = getLevelProgress(state.moonlightTotal);

  return (
    <section style={{ ...lunaCardStyle, padding: 16 }}>
      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>Уровни пути</p>
      <div style={{ display: "grid", gap: 9 }}>
        {lunaPathLevels.map((level) => {
          const completed = state.moonlightTotal >= level.requiredMoonlight && level.key !== progress.currentLevel.key;
          const current = level.key === progress.currentLevel.key;
          const locked = state.moonlightTotal < level.requiredMoonlight;
          return (
            <div key={level.key} style={{ border: `1px solid ${current ? "rgba(216,168,95,.42)" : completed ? "rgba(216,168,95,.22)" : "rgba(255,255,255,.09)"}`, borderRadius: 16, background: current ? "rgba(216,168,95,.09)" : completed ? "rgba(255,255,255,.045)" : "rgba(255,255,255,.025)", padding: 12, opacity: locked ? .72 : 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 5 }}>
                <h3 style={{ color: current ? "var(--gold-2)" : "var(--text)", fontSize: 14, fontWeight: 900 }}>{level.title}</h3>
                <span style={{ color: current ? "var(--gold-2)" : completed ? "var(--muted)" : "var(--muted-2)", fontSize: 10, fontWeight: 900 }}>{current ? "Текущий" : completed ? "Открыт" : `${level.requiredMoonlight} света`}</span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>{level.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
