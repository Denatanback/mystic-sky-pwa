import type { LunaPathState, OracleHistoryItem, OracleSession } from "./types";

export const LUNA_PATH_STORAGE_KEY = "eluna_luna_path_state";
export const ORACLE_HISTORY_STORAGE_KEY = "eluna_oracle_history";
export const ORACLE_FREE_QUESTION_USED_STORAGE_KEY = "eluna_oracle_free_question_used";

export function createDefaultLunaPathState(): LunaPathState {
  return {
    moonlightTotal: 0,
    tokenBalance: 0,
    lifetimeTokensEarned: 0,
    lifetimeTokensSpent: 0,
    streakDays: 0,
    lastActiveDate: null,
    oracleFreeQuestionAvailable: true,
    dailyProgress: {},
    ledger: [],
    oracleSessions: [],
  };
}

function normalizeState(value: Partial<LunaPathState> | null | undefined): LunaPathState {
  const fallback = createDefaultLunaPathState();
  const legacyOracleSessions = Array.isArray(value?.oracleSessions) ? value.oracleSessions : fallback.oracleSessions;
  return {
    ...fallback,
    ...value,
    moonlightTotal: Number.isFinite(value?.moonlightTotal) ? Number(value?.moonlightTotal) : fallback.moonlightTotal,
    tokenBalance: Number.isFinite(value?.tokenBalance) ? Number(value?.tokenBalance) : fallback.tokenBalance,
    lifetimeTokensEarned: Number.isFinite(value?.lifetimeTokensEarned) ? Number(value?.lifetimeTokensEarned) : fallback.lifetimeTokensEarned,
    lifetimeTokensSpent: Number.isFinite(value?.lifetimeTokensSpent) ? Number(value?.lifetimeTokensSpent) : fallback.lifetimeTokensSpent,
    streakDays: Number.isFinite(value?.streakDays) ? Number(value?.streakDays) : fallback.streakDays,
    oracleFreeQuestionAvailable: getOracleFreeQuestionAvailable(value?.oracleFreeQuestionAvailable ?? fallback.oracleFreeQuestionAvailable),
    dailyProgress: value?.dailyProgress ?? fallback.dailyProgress,
    ledger: Array.isArray(value?.ledger) ? value.ledger : fallback.ledger,
    oracleSessions: readOracleHistory(legacyOracleSessions),
  };
}

function normalizeOracleSession(session: Partial<OracleSession>, index: number): OracleHistoryItem | null {
  if (!session.question || !session.answer || !session.mode) return null;
  const createdAt = session.createdAt ?? `${session.date ?? "unknown"}T00:00:00.000`;
  const cost = Number.isFinite(session.cost) ? Number(session.cost) : Number(session.tokenCost ?? 0);
  return {
    id: session.id ?? `oracle_legacy_${index}`,
    date: session.date ?? createdAt.slice(0, 10),
    createdAt,
    mode: session.mode,
    question: String(session.question),
    answer: String(session.answer),
    cost,
    tokenCost: Number.isFinite(session.tokenCost) ? Number(session.tokenCost) : cost,
    deletedAt: session.deletedAt ?? null,
  };
}

export function readOracleHistory(legacySessions: OracleSession[] = []): OracleHistoryItem[] {
  if (typeof window === "undefined") {
    return legacySessions.map((session, index) => normalizeOracleSession(session, index)).filter(Boolean) as OracleHistoryItem[];
  }

  try {
    const raw = window.localStorage.getItem(ORACLE_HISTORY_STORAGE_KEY);
    const source = raw ? JSON.parse(raw) : legacySessions;
    if (!Array.isArray(source)) return [];
    const history = source.map((session, index) => normalizeOracleSession(session as Partial<OracleSession>, index)).filter(Boolean) as OracleHistoryItem[];
    if (!raw && history.length > 0) {
      window.localStorage.setItem(ORACLE_HISTORY_STORAGE_KEY, JSON.stringify(history));
    }
    return history;
  } catch {
    return legacySessions.map((session, index) => normalizeOracleSession(session, index)).filter(Boolean) as OracleHistoryItem[];
  }
}

export function writeOracleHistory(history: OracleHistoryItem[]) {
  if (typeof window === "undefined") return history;
  window.localStorage.setItem(ORACLE_HISTORY_STORAGE_KEY, JSON.stringify(history));
  return history;
}

export function deleteOracleHistoryItem(id: string) {
  const history = readOracleHistory();
  const nextHistory = history.map((item) => item.id === id ? { ...item, deletedAt: new Date().toISOString() } : item);
  return writeOracleHistory(nextHistory);
}

export function getVisibleOracleHistory(history: OracleSession[]) {
  return history
    .map((item, index) => normalizeOracleSession(item, index))
    .filter((item): item is OracleHistoryItem => item !== null)
    .filter((item) => !item.deletedAt);
}

export function readOracleFreeQuestionUsed(fallbackAvailable = true) {
  if (typeof window === "undefined") return !fallbackAvailable;
  const raw = window.localStorage.getItem(ORACLE_FREE_QUESTION_USED_STORAGE_KEY);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return !fallbackAvailable;
}

export function writeOracleFreeQuestionUsed(used: boolean) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ORACLE_FREE_QUESTION_USED_STORAGE_KEY, String(used));
  }
  return used;
}

export function getOracleFreeQuestionAvailable(fallbackAvailable = true) {
  return !readOracleFreeQuestionUsed(fallbackAvailable);
}

export function readLunaPathState(): LunaPathState {
  if (typeof window === "undefined") return createDefaultLunaPathState();

  try {
    const raw = window.localStorage.getItem(LUNA_PATH_STORAGE_KEY);
    if (!raw) return createDefaultLunaPathState();
    return normalizeState(JSON.parse(raw) as Partial<LunaPathState>);
  } catch {
    return createDefaultLunaPathState();
  }
}

export function writeLunaPathState(state: LunaPathState) {
  if (typeof window === "undefined") return state;
  window.localStorage.setItem(LUNA_PATH_STORAGE_KEY, JSON.stringify(state));
  writeOracleHistory(state.oracleSessions.map((session, index) => normalizeOracleSession(session, index)).filter(Boolean) as OracleHistoryItem[]);
  writeOracleFreeQuestionUsed(!state.oracleFreeQuestionAvailable);
  return state;
}
