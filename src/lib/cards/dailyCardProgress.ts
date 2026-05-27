import { getDailyActionKey, getTodayKey, markDailyActionCompleted } from "@/lib/progress/dailyProgress";
import { dailyCards, getDailyCardById, type DailyCard } from "./dailyCards";

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

function pickCardId(dayKey: string) {
  const seed = dayKey.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return dailyCards[seed % dailyCards.length].id;
}

export function isDailyCardDrawnToday(dayKey = getTodayKey()) {
  if (!isBrowser()) return false;
  return localStorage.getItem(getDailyActionKey("cardOpened", dayKey)) === "true" && Boolean(localStorage.getItem(getTodayCardKey("id", dayKey)));
}

export function getTodayDailyCard(dayKey = getTodayKey()): DailyCardState {
  if (!isBrowser()) return { drawn: false, card: null, reflection: "" };
  const cardId = localStorage.getItem(getTodayCardKey("id", dayKey));
  const card = getDailyCardById(cardId);
  return {
    drawn: Boolean(cardId && card && localStorage.getItem(getDailyActionKey("cardOpened", dayKey)) === "true"),
    card,
    reflection: localStorage.getItem(getTodayCardKey("reflection", dayKey)) ?? "",
  };
}

export function drawDailyCard(dayKey = getTodayKey()) {
  if (!isBrowser()) return { drawn: false, card: null, reflection: "" };

  const existing = getTodayDailyCard(dayKey);
  if (existing.drawn && existing.card) return existing;

  const cardId = localStorage.getItem(getTodayCardKey("id", dayKey)) ?? pickCardId(dayKey);
  localStorage.setItem(getTodayCardKey("id", dayKey), cardId);
  markDailyActionCompleted("cardOpened", dayKey);
  return getTodayDailyCard(dayKey);
}

export function saveDailyCardReflection(text: string, dayKey = getTodayKey()) {
  if (!isBrowser()) return "";
  const value = text.trim();
  if (value) localStorage.setItem(getTodayCardKey("reflection", dayKey), value);
  return value;
}

export function getDailyCardReflection(dayKey = getTodayKey()) {
  if (!isBrowser()) return "";
  return localStorage.getItem(getTodayCardKey("reflection", dayKey)) ?? "";
}
