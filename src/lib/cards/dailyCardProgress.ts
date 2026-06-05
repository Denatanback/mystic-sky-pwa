import { getDailyActionKey, getTodayKey, markDailyActionCompleted } from "@/lib/progress/dailyProgress";
import {
  getLocalDayKey,
  getTodayDailyCard as selectTodayDailyCard,
  readDailyCardReflection,
  saveDailyCardReflection as persistDailyCardReflection,
} from "@/lib/dailyCards";
import { getDailyCardById, type DailyCard } from "./dailyCards";

export type DailyCardState = {
  drawn: boolean;
  card: DailyCard | null;
  reflection: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getTodayCardKey(field: "id" | "reflection", dayKey = getTodayKey()) {
  return `eluna:daily:${dayKey}:${field === "id" ? "dailyCardId" : "dailyCardReflection"}`;
}

export function isDailyCardDrawnToday(dayKey = getTodayKey()) {
  if (!isBrowser()) return false;
  return localStorage.getItem(getDailyActionKey("cardOpened", dayKey)) === "true";
}

export function getTodayDailyCard(dayKey = getTodayKey(), userId?: string): DailyCardState {
  if (!isBrowser()) return { drawn: false, card: null, reflection: "" };
  const date = new Date(`${dayKey}T12:00:00`);
  const selected = selectTodayDailyCard(userId, date);
  localStorage.setItem(getTodayCardKey("id", dayKey), String(selected.id));
  const card = getDailyCardById(selected.id);
  return {
    drawn: localStorage.getItem(getDailyActionKey("cardOpened", dayKey)) === "true",
    card,
    reflection: readDailyCardReflection(getLocalDayKey(date)),
  };
}

export function drawDailyCard(dayKey = getTodayKey(), userId?: string) {
  if (!isBrowser()) return { drawn: false, card: null, reflection: "" };
  const state = getTodayDailyCard(dayKey, userId);
  if (state.card) localStorage.setItem(getTodayCardKey("id", dayKey), String(state.card.id));
  markDailyActionCompleted("cardOpened", dayKey);
  return getTodayDailyCard(dayKey, userId);
}

export function saveDailyCardReflection(text: string, dayKey = getTodayKey(), userId?: string) {
  if (!isBrowser()) return "";
  const state = getTodayDailyCard(dayKey, userId);
  if (!state.card) return "";
  return persistDailyCardReflection(state.card, text, dayKey)?.reflection ?? "";
}

export function getDailyCardReflection(dayKey = getTodayKey()) {
  if (!isBrowser()) return "";
  return readDailyCardReflection(dayKey);
}
