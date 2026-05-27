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

const actions: DailyAction[] = ["readingOpened", "practiceCompleted", "affirmationCompleted", "cardOpened"];

export function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getDailyActionKey(action: DailyAction, dayKey = getTodayKey()) {
  return `eluna:daily:${dayKey}:${action}`;
}

export function getPracticeReflectionKey(field: keyof PracticeReflection, dayKey = getTodayKey()) {
  return `eluna:daily:${dayKey}:${field === "signalName" ? "practiceSignalName" : "practiceResponseAction"}`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function readAction(action: DailyAction, dayKey: string) {
  if (!isBrowser()) return false;
  if (localStorage.getItem(getDailyActionKey(action, dayKey)) === "true") return true;

  if (action === "practiceCompleted") {
    return (
      localStorage.getItem(`eluna:daily:${dayKey}:reflectionCompleted`) === "true" ||
      localStorage.getItem(`eluna:daily-practice:${dayKey}`) === "completed"
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

  return getTodayProgress(dayKey);
}

export function markPracticeCompleted(input: Partial<PracticeReflection> = {}, dayKey = getTodayKey()) {
  if (!isBrowser()) return getTodayProgress(dayKey);
  const signalName = input.signalName?.trim();
  const responseAction = input.responseAction?.trim();
  if (signalName) localStorage.setItem(getPracticeReflectionKey("signalName", dayKey), signalName);
  if (responseAction) localStorage.setItem(getPracticeReflectionKey("responseAction", dayKey), responseAction);
  return markDailyActionCompleted("practiceCompleted", dayKey);
}

export function getTodayPracticeReflection(dayKey = getTodayKey()): PracticeReflection {
  if (!isBrowser()) return { signalName: "", responseAction: "" };
  return {
    signalName: localStorage.getItem(getPracticeReflectionKey("signalName", dayKey)) ?? "",
    responseAction: localStorage.getItem(getPracticeReflectionKey("responseAction", dayKey)) ?? "",
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
  const unlocked = firstSignalUnlocked || progress.completedCount >= 1;
  const todayComplete = progress.completedCount === progress.totalCount;

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
