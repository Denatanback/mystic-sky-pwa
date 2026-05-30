export type DailyAction = "readingOpened" | "practiceCompleted" | "affirmationCompleted" | "cardOpened";

export type DailyProgress = Record<DailyAction, boolean> & {
  completedCount: number;
  totalCount: number;
};

export type DeepPathState = {
  unlocked: boolean;
  firstSignalUnlocked: boolean;
  todayComplete: boolean;
  completedCount: number;
  title: string;
  text: string;
  cta: string;
};

export type PracticeReflection = {
  signalName: string;
  responseAction: string;
};

export type FirstSignalState = {
  unlocked: boolean;
  integrated: boolean;
  reflection: string;
  signalName: string;
  responseAction: string;
};

export type AffirmationRepeat = {
  text: string;
  category: string;
};

export type WeeklyStreakDay = {
  dateKey: string;
  label: string;
  isToday: boolean;
  active: boolean;
};

const actions: DailyAction[] = ["readingOpened", "practiceCompleted", "affirmationCompleted", "cardOpened"];
export const DAILY_PROGRESS_UPDATED_EVENT = "eluna:daily-progress-updated";

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayKey(date = new Date()) {
  return getLocalDateKey(date);
}

export function getDailyActionKey(action: DailyAction, dayKey = getTodayKey()) {
  return `eluna:daily:${dayKey}:${action}`;
}

export function getPracticeReflectionKey(field: keyof PracticeReflection, dayKey = getTodayKey()) {
  return `eluna:daily:${dayKey}:${field === "signalName" ? "practiceSignalName" : "practiceResponseAction"}`;
}

export function getFirstSignalKey(field: "reflection" | "nextStepCompleted", dayKey = getTodayKey()) {
  return `eluna:daily:${dayKey}:${field === "reflection" ? "firstSignalReflection" : "firstSignalNextStepCompleted"}`;
}

export function getAffirmationRepeatKey(field: keyof AffirmationRepeat, dayKey = getTodayKey()) {
  return `eluna:daily:${dayKey}:${field === "text" ? "affirmationText" : "affirmationCategory"}`;
}

export function getGroundingCompletedKey(dayKey = getTodayKey()) {
  return `eluna:daily:${dayKey}:groundingCompleted`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function notifyDailyProgressUpdated() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(DAILY_PROGRESS_UPDATED_EVENT));
}

function isTrueLike(value: string | null) {
  if (!value) return false;
  return ["true", "1", "yes", "completed"].includes(value.toLowerCase());
}

function readAction(action: DailyAction, dayKey: string) {
  if (!isBrowser()) return false;
  if (isTrueLike(localStorage.getItem(getDailyActionKey(action, dayKey)))) return true;

  if (action === "practiceCompleted") {
    return (
      isTrueLike(localStorage.getItem(`eluna:daily:${dayKey}:reflectionCompleted`)) ||
      isTrueLike(localStorage.getItem(`eluna:daily-practice:${dayKey}`))
    );
  }

  return false;
}

export function getTodayProgress(dayKey = getTodayKey()): DailyProgress {
  const progress = {
    readingOpened: readAction("readingOpened", dayKey),
    practiceCompleted: readAction("practiceCompleted", dayKey),
    affirmationCompleted: readAction("affirmationCompleted", dayKey),
    cardOpened: readAction("cardOpened", dayKey),
  };
  return {
    ...progress,
    completedCount: actions.filter((action) => progress[action]).length,
    totalCount: actions.length,
  };
}

export function markDailyActionCompleted(action: DailyAction, dayKey = getTodayKey()) {
  if (!isBrowser()) return getTodayProgress(dayKey);

  localStorage.setItem(getDailyActionKey(action, dayKey), "true");

  if (action === "practiceCompleted") {
    localStorage.setItem(`eluna:daily:${dayKey}:reflectionCompleted`, "true");
    localStorage.setItem(`eluna:daily-practice:${dayKey}`, "completed");
  }

  const progress = getTodayProgress(dayKey);
  notifyDailyProgressUpdated();
  return progress;
}

export function markPracticeCompleted(input: Partial<PracticeReflection> = {}, dayKey = getTodayKey()) {
  if (!isBrowser()) return getTodayProgress(dayKey);
  const signalName = input.signalName?.trim();
  const responseAction = input.responseAction?.trim();
  if (signalName) localStorage.setItem(getPracticeReflectionKey("signalName", dayKey), signalName);
  if (responseAction) localStorage.setItem(getPracticeReflectionKey("responseAction", dayKey), responseAction);
  return markDailyActionCompleted("practiceCompleted", dayKey);
}

export function markAffirmationRepeated(input: Partial<AffirmationRepeat> = {}, dayKey = getTodayKey()) {
  if (!isBrowser()) return getTodayProgress(dayKey);
  const text = input.text?.trim();
  const category = input.category?.trim();
  if (text) localStorage.setItem(getAffirmationRepeatKey("text", dayKey), text);
  if (category) localStorage.setItem(getAffirmationRepeatKey("category", dayKey), category);
  return markDailyActionCompleted("affirmationCompleted", dayKey);
}

export function getTodayAffirmationRepeat(dayKey = getTodayKey()): AffirmationRepeat {
  if (!isBrowser()) return { text: "", category: "" };
  return {
    text: localStorage.getItem(getAffirmationRepeatKey("text", dayKey)) ?? "",
    category: localStorage.getItem(getAffirmationRepeatKey("category", dayKey)) ?? "",
  };
}

export function markGroundingCompleted(dayKey = getTodayKey()) {
  if (!isBrowser()) return false;
  localStorage.setItem(getGroundingCompletedKey(dayKey), "true");
  notifyDailyProgressUpdated();
  return true;
}

export function isGroundingCompleted(dayKey = getTodayKey()) {
  return isBrowser() && isTrueLike(localStorage.getItem(getGroundingCompletedKey(dayKey)));
}

export function getTodayPracticeReflection(dayKey = getTodayKey()): PracticeReflection {
  if (!isBrowser()) return { signalName: "", responseAction: "" };
  return {
    signalName: localStorage.getItem(getPracticeReflectionKey("signalName", dayKey)) ?? "",
    responseAction: localStorage.getItem(getPracticeReflectionKey("responseAction", dayKey)) ?? "",
  };
}

export function saveFirstSignalReflection(text: string, dayKey = getTodayKey()) {
  if (!isBrowser()) return "";
  const value = text.trim();
  if (value) localStorage.setItem(getFirstSignalKey("reflection", dayKey), value);
  return value;
}

export function markFirstSignalNextStepCompleted(dayKey = getTodayKey()) {
  if (!isBrowser()) return false;
  localStorage.setItem(getFirstSignalKey("nextStepCompleted", dayKey), "true");
  notifyDailyProgressUpdated();
  return true;
}

export function isFirstSignalIntegrated(dayKey = getTodayKey()) {
  return isBrowser() && isTrueLike(localStorage.getItem(getFirstSignalKey("nextStepCompleted", dayKey)));
}

export function getFirstSignalState(dayKey = getTodayKey()): FirstSignalState {
  const practice = getTodayPracticeReflection(dayKey);
  const unlocked = isTodayPracticeCompleted(dayKey);
  return {
    unlocked,
    integrated: isFirstSignalIntegrated(dayKey),
    reflection: isBrowser() ? localStorage.getItem(getFirstSignalKey("reflection", dayKey)) ?? "" : "",
    signalName: practice.signalName || "Attention",
    responseAction: practice.responseAction,
  };
}

export function isTodayPracticeCompleted(dayKey = getTodayKey()) {
  return getTodayProgress(dayKey).practiceCompleted;
}

export function getCompletedCount(dayKey = getTodayKey()) {
  return getTodayProgress(dayKey).completedCount;
}

export function isTodayComplete(dayKey = getTodayKey()) {
  const progress = getTodayProgress(dayKey);
  return progress.completedCount === progress.totalCount;
}

export function getDeepPathState(dayKey = getTodayKey()): DeepPathState {
  const progress = getTodayProgress(dayKey);
  const firstSignalUnlocked = progress.practiceCompleted;
  const firstSignalIntegrated = isFirstSignalIntegrated(dayKey);
  const unlocked = firstSignalUnlocked || progress.completedCount >= 1;
  const todayComplete = progress.completedCount === progress.totalCount;

  if (firstSignalIntegrated) {
    return {
      unlocked,
      firstSignalUnlocked,
      todayComplete,
      completedCount: progress.completedCount,
      title: "Deep Path",
      text: "Your first signal is integrated. Your path continues tomorrow.",
      cta: "View first signal",
    };
  }

  if (todayComplete) {
    return {
      unlocked,
      firstSignalUnlocked,
      todayComplete,
      completedCount: progress.completedCount,
      title: "Deep Path",
      text: "Today is complete. Your path continues tomorrow.",
      cta: "Open first signal",
    };
  }

  if (firstSignalUnlocked) {
    return {
      unlocked,
      firstSignalUnlocked,
      todayComplete,
      completedCount: progress.completedCount,
      title: "Deep Path",
      text: "Your first signal is open.",
      cta: "Open first signal",
    };
  }

  return {
    unlocked,
    firstSignalUnlocked,
    todayComplete,
    completedCount: progress.completedCount,
    title: "Deep Path",
    text: "Complete one daily practice to open your first signal.",
    cta: "Locked",
  };
}

export function isDailyActive(dayKey = getTodayKey()) {
  if (!isBrowser()) return false;
  return (
    readAction("practiceCompleted", dayKey) ||
    readAction("affirmationCompleted", dayKey) ||
    readAction("cardOpened", dayKey) ||
    isGroundingCompleted(dayKey) ||
    isFirstSignalIntegrated(dayKey)
  );
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function getCurrentStreak(date = new Date()) {
  if (!isBrowser()) return 0;
  if (!isDailyActive(getLocalDateKey(date))) return 0;

  let streak = 0;
  let cursor = new Date(date);

  while (isDailyActive(getLocalDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function getWeeklyStreakState(date = new Date()): WeeklyStreakDay[] {
  const todayKey = getLocalDateKey(date);

  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(date, index - 6);
    const dateKey = getLocalDateKey(day);
    return {
      dateKey,
      label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(day),
      isToday: dateKey === todayKey,
      active: isDailyActive(dateKey),
    };
  });
}
