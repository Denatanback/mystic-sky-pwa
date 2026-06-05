import { oracleModeCosts, oracleModeLabels, ritualRewards } from "./rewards";
import { createDefaultLunaPathState, writeLunaPathState } from "./storage";
import type { DailyMood, DailyRitualKey, LunaPathDailyProgress, LunaPathState, OracleMode } from "./types";

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

function getQuestionTheme(question: string) {
  const normalized = question.toLowerCase();
  if (/\b(ex|breakup|relationship|partner|love|dating|marriage)\b/.test(normalized)) {
    return "attachment, unfinished emotional loops, boundaries, and self-respect";
  }
  if (/\b(work|career|job|money|business|client|salary)\b/.test(normalized)) {
    return "direction, responsibility, self-worth, and the pressure to decide before you feel clear";
  }
  if (/\b(family|mother|father|parent|child|home)\b/.test(normalized)) {
    return "belonging, old roles, emotional responsibility, and the need for gentler boundaries";
  }
  if (/\b(anxious|anxiety|fear|scared|panic|worry|stress)\b/.test(normalized)) {
    return "nervous-system signals, uncertainty, and the part of you trying to feel safe";
  }
  if (/\b(stuck|lost|confused|unclear|choice|decision)\b/.test(normalized)) {
    return "inner conflict, timing, and the difference between urgency and true readiness";
  }
  return "the emotional pattern inside your question and the next small honest step";
}

function getRecentActivitySummary(state: LunaPathState) {
  const today = getDailyProgress(state);
  const completed = countCompletedRituals(today);
  const mood = today.mood ? ` Your latest mood check-in was ${today.mood}.` : "";
  return `You have ${state.moonlightTotal} Moonlight, ${state.tokenBalance} Lunar Tokens, and a ${state.streakDays}-day streak. Today, ${completed} rituals are complete.${mood}`;
}

export function generateOracleAnswer({
  question,
  mode,
  lunaPathState,
}: {
  question: string;
  mode: OracleMode;
  lunaPathState: LunaPathState;
}) {
  const theme = getQuestionTheme(question);
  const activity = getRecentActivitySummary(lunaPathState);
  const quotedQuestion = question.length > 140 ? `${question.slice(0, 137).trim()}...` : question;

  if (mode === "quick" || mode === "free") {
    return `Preview response\n\nYour question about “${quotedQuestion}” seems to circle around ${theme}. ${activity} For today, do not force a final answer. Choose one small action that protects your peace: pause, name what you feel, and respond from self-respect rather than urgency.`;
  }

  if (mode === "deep") {
    return `Preview response\n\nWhat your question may be pointing to\n“${quotedQuestion}” may be showing you ${theme}. The important signal is not only the situation itself, but the emotion that keeps returning when you imagine the next step.\n\nPattern to notice\n${activity} Notice whether you are trying to solve discomfort quickly, or whether a quieter part of you is asking for clarity, boundaries, or grief to be acknowledged first.\n\nA gentle next step\nWrite one sentence that begins with: “The truth I am avoiding is...” Then choose one grounded action that does not require certainty, only honesty.`;
  }

  return `Preview response\n\nCard 1 — What is behind you\nYour question about “${quotedQuestion}” carries traces of ${theme}. Something old may still be asking to be witnessed, not repeated.\n\nCard 2 — What is present\n${activity} The present card points to a pause: the space between emotional reaction and self-respecting response. This is where your agency returns.\n\nCard 3 — What is emerging\nWhat is emerging is not a fixed prediction. It is a possible next rhythm: clearer boundaries, a softer inner voice, and one choice made from alignment rather than pressure.`;
}

export function askOracle(currentState: LunaPathState, params: { mode: OracleMode; question: string; dateKey?: string }) {
  const dateKey = params.dateKey ?? getLocalDateKey();
  const question = params.question.trim();
  const mode = currentState.oracleFreeQuestionAvailable ? "free" : params.mode;
  const cost = mode === "free" ? 0 : oracleModeCosts[mode];

  if (!question) {
    return { state: currentState, session: null, error: "Write a question first." };
  }

  if (cost > currentState.tokenBalance) {
    return { state: currentState, session: null, error: "Not enough Lunar Tokens for this mode. Complete rituals in Luna Path or choose a lower-cost mode." };
  }

  // TODO: Replace this mock answer with server-side OpenAI oracle generation.
  const session = {
    id: makeId("oracle"),
    date: dateKey,
    mode,
    question,
    answer: generateOracleAnswer({ question, mode, lunaPathState: currentState }),
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
            reason: `${oracleModeLabels[mode]} with eLuna Oracle`,
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
