import type { DailyRitualKey, OracleMode } from "./types";

export type RitualReward = {
  moonlight: number;
  tokens: number;
  reason: string;
};

export const ritualRewards: Record<DailyRitualKey, RitualReward> = {
  cardOpened: {
    moonlight: 15,
    tokens: 10,
    reason: "Opened daily card",
  },
  reflectionCompleted: {
    moonlight: 30,
    tokens: 25,
    reason: "Completed mindful reflection",
  },
  moodChecked: {
    moonlight: 10,
    tokens: 5,
    reason: "Checked in with mood",
  },
  practiceCompleted: {
    moonlight: 20,
    tokens: 15,
    reason: "Completed a practice",
  },
};

export const oracleModeCosts: Record<Exclude<OracleMode, "free">, number> = {
  quick: 150,
  deep: 400,
  "three-card": 600,
};

export const oracleModeLabels: Record<OracleMode, string> = {
  free: "First Question",
  quick: "Quick Question",
  deep: "Deep Reflection",
  "three-card": "3-Card Reading",
};

export const oracleModeDescriptions: Record<Exclude<OracleMode, "free">, string> = {
  quick: "A short reflective answer for a single question.",
  deep: "A deeper answer with emotional patterns and one suggested next step.",
  "three-card": "A symbolic 3-card reading: what is behind you, what is present, and what is emerging.",
};
