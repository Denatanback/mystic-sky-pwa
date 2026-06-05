import type { LunaPathState } from "./types";

export const LUNA_PATH_STORAGE_KEY = "eluna_luna_path_state";

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
  return {
    ...fallback,
    ...value,
    moonlightTotal: Number.isFinite(value?.moonlightTotal) ? Number(value?.moonlightTotal) : fallback.moonlightTotal,
    tokenBalance: Number.isFinite(value?.tokenBalance) ? Number(value?.tokenBalance) : fallback.tokenBalance,
    lifetimeTokensEarned: Number.isFinite(value?.lifetimeTokensEarned) ? Number(value?.lifetimeTokensEarned) : fallback.lifetimeTokensEarned,
    lifetimeTokensSpent: Number.isFinite(value?.lifetimeTokensSpent) ? Number(value?.lifetimeTokensSpent) : fallback.lifetimeTokensSpent,
    streakDays: Number.isFinite(value?.streakDays) ? Number(value?.streakDays) : fallback.streakDays,
    oracleFreeQuestionAvailable: value?.oracleFreeQuestionAvailable ?? fallback.oracleFreeQuestionAvailable,
    dailyProgress: value?.dailyProgress ?? fallback.dailyProgress,
    ledger: Array.isArray(value?.ledger) ? value.ledger : fallback.ledger,
    oracleSessions: Array.isArray(value?.oracleSessions) ? value.oracleSessions : fallback.oracleSessions,
  };
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
  return state;
}
