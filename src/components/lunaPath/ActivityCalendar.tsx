"use client";

import { getLastThirtyDays } from "@/lib/lunaPath/progress";
import type { LunaPathState } from "@/lib/lunaPath/types";
import { lunaCardStyle } from "./shared";

type Props = {
  state: LunaPathState;
};

export function ActivityCalendar({ state }: Props) {
  const days = getLastThirtyDays(state);

  return (
    <section style={{ ...lunaCardStyle, padding: 16 }}>
      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>Last 30 days</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, minmax(0, 1fr))", gap: 6, marginBottom: 12 }}>
        {days.map((day) => (
          <div key={day.dateKey} title={day.dateKey} style={{ aspectRatio: "1 / 1", borderRadius: 9, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 800, color: day.isToday || day.isActive ? "var(--gold-2)" : "var(--muted-2)", border: `1px solid ${day.isToday ? "rgba(247,217,139,.62)" : day.isActive ? "rgba(216,168,95,.30)" : "rgba(255,255,255,.07)"}`, background: day.isToday ? "rgba(216,168,95,.13)" : day.isActive ? "rgba(141,85,214,.18)" : "rgba(255,255,255,.025)" }}>
            {day.dayLabel}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, color: "var(--muted)", fontSize: 11, fontWeight: 800 }}>
        <span>Active</span>
        <span style={{ color: "var(--gold-2)" }}>Today</span>
        <span style={{ color: "var(--muted-2)" }}>Missed</span>
      </div>
    </section>
  );
}
