"use client";

import { useState } from "react";
import { completeDailyRitual, getLocalDateKey } from "@/lib/lunaPath/progress";
import { ritualRewards } from "@/lib/lunaPath/rewards";
import type { DailyMood, DailyRitualKey, LunaPathState } from "@/lib/lunaPath/types";
import { productFeatureFlags } from "@/lib/productFeatureFlags";
import { lunaCardStyle, lunaInputStyle, lunaPrimaryButtonStyle, lunaSecondaryButtonStyle } from "./shared";

type Props = {
  state: LunaPathState;
  onStateChange: (state: LunaPathState) => void;
};

const moods: DailyMood[] = ["Calm", "Anxious", "Joyful", "Tired", "Clear", "Uncertain"];

function RewardLabel({ ritualKey }: { ritualKey: DailyRitualKey }) {
  const reward = ritualRewards[ritualKey];
  return (
    <span style={{ color: "var(--muted-2)", fontSize: 11, fontWeight: 800 }}>
      +{reward.moonlight} Moonlight{productFeatureFlags.lunarTokensEnabled ? ` · +${reward.tokens} tokens` : ""}
    </span>
  );
}

export function DailyRituals({ state, onStateChange }: Props) {
  const todayKey = getLocalDateKey();
  const today = state.dailyProgress[todayKey] ?? {
    cardOpened: false,
    reflectionCompleted: false,
    moodChecked: false,
    practiceCompleted: false,
  };
  const [reflectionText, setReflectionText] = useState(today.reflectionText ?? "");
  const [reflectionHint, setReflectionHint] = useState("");

  function complete(ritualKey: DailyRitualKey, options: { reflectionText?: string; mood?: DailyMood } = {}) {
    const result = completeDailyRitual(state, ritualKey, { dateKey: todayKey, ...options });
    onStateChange(result.state);
  }

  function completeReflection() {
    if (reflectionText.trim().length < 80) {
      setReflectionHint("Write a little more so eLuna can save this as a mindful reflection.");
      return;
    }
    setReflectionHint("");
    complete("reflectionCompleted", { reflectionText: reflectionText.trim() });
  }

  return (
    <section style={{ ...lunaCardStyle, padding: 16 }}>
      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>Today’s rituals</p>
      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.035)", padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
            <h3 style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>Open your daily card</h3>
            <RewardLabel ritualKey="cardOpened" />
          </div>
          <button type="button" disabled={today.cardOpened} onClick={() => complete("cardOpened")} style={{ ...lunaSecondaryButtonStyle, opacity: today.cardOpened ? .68 : 1, cursor: today.cardOpened ? "default" : "pointer" }}>
            {today.cardOpened ? "Completed" : "Open card"}
          </button>
        </div>

        <div style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.035)", padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
            <h3 style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>Write a reflection</h3>
            <RewardLabel ritualKey="reflectionCompleted" />
          </div>
          <textarea disabled={today.reflectionCompleted} value={reflectionText} onChange={(event) => setReflectionText(event.target.value)} placeholder="Describe what keeps repeating inside you today..." style={{ ...lunaInputStyle, minHeight: 96, opacity: today.reflectionCompleted ? .72 : 1, marginBottom: 9 }} />
          {reflectionHint && <p style={{ color: "var(--gold-2)", fontSize: 12, lineHeight: 1.45, marginBottom: 9 }}>{reflectionHint}</p>}
          <button type="button" disabled={today.reflectionCompleted} onClick={completeReflection} style={{ ...lunaPrimaryButtonStyle, minHeight: 40, opacity: today.reflectionCompleted ? .68 : 1, cursor: today.reflectionCompleted ? "default" : "pointer" }}>
            {today.reflectionCompleted ? "Reflection saved" : "Save reflection"}
          </button>
        </div>

        <div style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.035)", padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 9 }}>
            <h3 style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>Check in with your mood</h3>
            <RewardLabel ritualKey="moodChecked" />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {moods.map((mood) => {
              const selected = today.mood === mood;
              return (
                <button key={mood} type="button" disabled={today.moodChecked} onClick={() => complete("moodChecked", { mood })} style={{ border: `1px solid ${selected ? "rgba(216,168,95,.48)" : "rgba(216,168,95,.18)"}`, borderRadius: 999, background: selected ? "rgba(216,168,95,.12)" : "rgba(255,255,255,.04)", color: selected ? "var(--gold-2)" : "var(--muted)", minHeight: 34, padding: "0 11px", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 800, cursor: today.moodChecked ? "default" : "pointer", opacity: today.moodChecked && !selected ? .55 : 1 }}>
                  {mood}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.035)", padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
            <h3 style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>Complete a practice</h3>
            <RewardLabel ritualKey="practiceCompleted" />
          </div>
          <button type="button" disabled={today.practiceCompleted} onClick={() => complete("practiceCompleted")} style={{ ...lunaSecondaryButtonStyle, opacity: today.practiceCompleted ? .68 : 1, cursor: today.practiceCompleted ? "default" : "pointer" }}>
            {today.practiceCompleted ? "Practice completed" : "Complete practice"}
          </button>
        </div>
      </div>
    </section>
  );
}
