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
    reason: "Открыта карта дня",
  },
  reflectionCompleted: {
    moonlight: 30,
    tokens: 25,
    reason: "Сохранена осознанная рефлексия",
  },
  moodChecked: {
    moonlight: 10,
    tokens: 5,
    reason: "Отмечено состояние",
  },
  practiceCompleted: {
    moonlight: 20,
    tokens: 15,
    reason: "Завершена практика",
  },
};

export const oracleModeCosts: Record<Exclude<OracleMode, "free">, number> = {
  quick: 150,
  deep: 400,
  "three-card": 600,
};

export const oracleModeLabels: Record<OracleMode, string> = {
  free: "Первый вопрос",
  quick: "Быстрый вопрос",
  deep: "Глубокий ответ",
  "three-card": "Расклад 3 карт",
};
