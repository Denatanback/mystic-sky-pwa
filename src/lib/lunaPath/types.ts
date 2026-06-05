export type LunaPathLevelKey =
  | "spark"
  | "observer"
  | "seeker"
  | "keeper"
  | "guide"
  | "mirror"
  | "oracle";

export type LunaPathLevel = {
  key: LunaPathLevelKey;
  title: string;
  requiredMoonlight: number;
  description: string;
};

export type DailyRitualKey =
  | "cardOpened"
  | "reflectionCompleted"
  | "moodChecked"
  | "practiceCompleted";

export type DailyMood =
  | "Calm"
  | "Anxious"
  | "Joyful"
  | "Tired"
  | "Clear"
  | "Uncertain";

export type LunaPathDailyProgress = {
  cardOpened: boolean;
  reflectionCompleted: boolean;
  moodChecked: boolean;
  practiceCompleted: boolean;
  reflectionText?: string;
  mood?: DailyMood;
};

export type LunaPathLedgerEntry = {
  id: string;
  date: string;
  type: "earn" | "spend";
  amount: number;
  reason: string;
};

export type OracleMode = "free" | "quick" | "deep" | "three-card";

export type OracleSession = {
  id: string;
  date: string;
  mode: OracleMode;
  question: string;
  answer: string;
  cost: number;
};

export type LunaPathState = {
  moonlightTotal: number;
  tokenBalance: number;
  lifetimeTokensEarned: number;
  lifetimeTokensSpent: number;
  streakDays: number;
  lastActiveDate: string | null;
  oracleFreeQuestionAvailable: boolean;
  dailyProgress: Record<string, LunaPathDailyProgress>;
  ledger: LunaPathLedgerEntry[];
  oracleSessions: OracleSession[];
};
