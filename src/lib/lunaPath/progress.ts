import { oracleModeCosts, oracleModeLabels, ritualRewards } from "./rewards";
import { createDefaultLunaPathState, writeLunaPathState } from "./storage";
import type { DailyMood, DailyRitualKey, LunaPathDailyProgress, LunaPathState, OracleMode } from "./types";

const oracleAnswer = "Я вижу, что сейчас тебе важно не искать резкое решение, а мягко заметить повторяющийся внутренний сигнал. Начни с одного честного вопроса к себе: что я пытаюсь не чувствовать?";

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function defaultDailyProgress(): LunaPathDailyProgress {
  return {
    cardOpened: false,
    reflectionCompleted: false,
    moodChecked: false,
    practiceCompleted: false,
  };
}

export function getDailyProgress(state: LunaPathState, dateKey = getLocalDateKey()) {
  return state.dailyProgress[dateKey] ?? defaultDailyProgress();
}

export function countCompletedRituals(day: LunaPathDailyProgress) {
  return [day.cardOpened, day.reflectionCompleted, day.moodChecked, day.practiceCompleted].filter(Boolean).length;
}

function withActiveDayStreak(state: LunaPathState, dateKey: string) {
  if (state.lastActiveDate === dateKey) return state;

  const yesterdayKey = getLocalDateKey(addDays(new Date(`${dateKey}T12:00:00`), -1));
  const streakDays = state.lastActiveDate === yesterdayKey ? state.streakDays + 1 : 1;
  return {
    ...state,
    streakDays,
    lastActiveDate: dateKey,
  };
}

function maybeActivateDay(state: LunaPathState, dateKey: string) {
  const day = getDailyProgress(state, dateKey);
  return countCompletedRituals(day) >= 2 ? withActiveDayStreak(state, dateKey) : state;
}

export function getLastThirtyDays(state: LunaPathState, todayKey = getLocalDateKey()) {
  const today = new Date(`${todayKey}T12:00:00`);
  return Array.from({ length: 30 }, (_, index) => {
    const date = addDays(today, index - 29);
    const dateKey = getLocalDateKey(date);
    const progress = getDailyProgress(state, dateKey);
    return {
      dateKey,
      dayLabel: String(date.getDate()),
      isToday: dateKey === todayKey,
      isActive: countCompletedRituals(progress) >= 2,
    };
  });
}

export function completeDailyRitual(
  currentState: LunaPathState,
  ritualKey: DailyRitualKey,
  options: { dateKey?: string; reflectionText?: string; mood?: DailyMood } = {}
) {
  const dateKey = options.dateKey ?? getLocalDateKey();
  const day = getDailyProgress(currentState, dateKey);

  if (day[ritualKey]) {
    return { state: currentState, changed: false };
  }

  const reward = ritualRewards[ritualKey];
  const nextDay: LunaPathDailyProgress = {
    ...day,
    [ritualKey]: true,
    reflectionText: options.reflectionText ?? day.reflectionText,
    mood: options.mood ?? day.mood,
  };

  let nextState: LunaPathState = {
    ...currentState,
    moonlightTotal: currentState.moonlightTotal + reward.moonlight,
    tokenBalance: currentState.tokenBalance + reward.tokens,
    lifetimeTokensEarned: currentState.lifetimeTokensEarned + reward.tokens,
    dailyProgress: {
      ...currentState.dailyProgress,
      [dateKey]: nextDay,
    },
    ledger: [
      {
        id: makeId("earn"),
        date: dateKey,
        type: "earn",
        amount: reward.tokens,
        reason: reward.reason,
      },
      ...currentState.ledger,
    ],
  };

  nextState = maybeActivateDay(nextState, dateKey);
  return { state: writeLunaPathState(nextState), changed: true };
}

export function askOracle(currentState: LunaPathState, params: { mode: OracleMode; question: string; dateKey?: string }) {
  const dateKey = params.dateKey ?? getLocalDateKey();
  const question = params.question.trim();
  const mode = currentState.oracleFreeQuestionAvailable ? "free" : params.mode;
  const cost = mode === "free" ? 0 : oracleModeCosts[mode];

  if (!question) {
    return { state: currentState, session: null, error: "Напиши вопрос, чтобы Оракул смог ответить мягко и точно." };
  }

  if (cost > currentState.tokenBalance) {
    return { state: currentState, session: null, error: "Недостаточно Лунных токенов. Продолжай ежедневные ритуалы или открой Оракула сразу." };
  }

  // TODO: Replace this mock answer with server-side OpenAI oracle generation.
  const session = {
    id: makeId("oracle"),
    date: dateKey,
    mode,
    question,
    answer: oracleAnswer,
    cost,
  };

  // TODO: Move spend validation and ledger writes to a server-side token ledger.
  const nextState: LunaPathState = {
    ...currentState,
    tokenBalance: Math.max(0, currentState.tokenBalance - cost),
    lifetimeTokensSpent: currentState.lifetimeTokensSpent + cost,
    oracleFreeQuestionAvailable: mode === "free" ? false : currentState.oracleFreeQuestionAvailable,
    oracleSessions: [session, ...currentState.oracleSessions],
    ledger: cost > 0
      ? [
          {
            id: makeId("spend"),
            date: dateKey,
            type: "spend",
            amount: cost,
            reason: `${oracleModeLabels[mode]} Оракула eLuna`,
          },
          ...currentState.ledger,
        ]
      : currentState.ledger,
  };

  return { state: writeLunaPathState(nextState), session, error: null };
}

export function resetLunaPathForTests() {
  return createDefaultLunaPathState();
}
