export type DailyCard = {
  id: number;
  slug: string;
  name: string;
  meaning: string;
  action: string;
  reflectionQuestion: string;
  image: string;
  tags: string[];
};

export const dailyCards: DailyCard[] = 
[
  {
    "id": 1,
    "slug": "the-quiet-star",
    "name": "The Quiet Star",
    "meaning": "The clearest signal may arrive quietly, not loudly.",
    "action": "Pause before reacting.",
    "reflectionQuestion": "What did I know before I explained it?",
    "tags": [
      "intuition",
      "silence",
      "clarity"
    ],
    "image": "/assets/daily-cards/card-01-the-quiet-star.webp"
  },
  {
    "id": 2,
    "slug": "the-inner-mirror",
    "name": "The Inner Mirror",
    "meaning": "Something outside you is reflecting a truth within you.",
    "action": "Notice what triggered you today.",
    "reflectionQuestion": "What part of myself am I seeing through this situation?",
    "tags": [
      "self-awareness",
      "reflection",
      "truth"
    ],
    "image": "/assets/daily-cards/card-02-the-inner-mirror.webp"
  },
  {
    "id": 3,
    "slug": "the-open-gate",
    "name": "The Open Gate",
    "meaning": "A new path is available, but it asks for trust.",
    "action": "Take one small step toward change.",
    "reflectionQuestion": "What door am I ready to walk through?",
    "tags": [
      "choice",
      "transition",
      "trust"
    ],
    "image": "/assets/daily-cards/card-03-the-open-gate.webp"
  },
  {
    "id": 4,
    "slug": "the-golden-path",
    "name": "The Golden Path",
    "meaning": "Your next move does not need to be perfect; it needs to be honest.",
    "action": "Choose the option that feels most aligned.",
    "reflectionQuestion": "Where does my energy naturally want to go?",
    "tags": [
      "path",
      "alignment",
      "movement"
    ],
    "image": "/assets/daily-cards/card-04-the-golden-path.webp"
  },
  {
    "id": 5,
    "slug": "the-moonlit-tide",
    "name": "The Moonlit Tide",
    "meaning": "Your emotions are not obstacles; they are messages.",
    "action": "Let one feeling be felt without judgment.",
    "reflectionQuestion": "What emotion is asking for my attention today?",
    "tags": [
      "emotion",
      "moon",
      "water"
    ],
    "image": "/assets/daily-cards/card-05-the-moonlit-tide.webp"
  },
  {
    "id": 6,
    "slug": "the-hidden-flame",
    "name": "The Hidden Flame",
    "meaning": "Strength is returning in a quiet but powerful way.",
    "action": "Do one thing that restores your confidence.",
    "reflectionQuestion": "Where have I been stronger than I realized?",
    "tags": [
      "strength",
      "fire",
      "confidence"
    ],
    "image": "/assets/daily-cards/card-06-the-hidden-flame.webp"
  },
  {
    "id": 7,
    "slug": "the-sacred-pause",
    "name": "The Sacred Pause",
    "meaning": "Waiting can be part of the answer.",
    "action": "Delay one impulsive decision.",
    "reflectionQuestion": "What becomes clearer when I stop rushing?",
    "tags": [
      "pause",
      "time",
      "patience"
    ],
    "image": "/assets/daily-cards/card-07-the-sacred-pause.webp"
  },
  {
    "id": 8,
    "slug": "the-returning-bloom",
    "name": "The Returning Bloom",
    "meaning": "Something in you is ready to grow again.",
    "action": "Revisit one idea you abandoned too soon.",
    "reflectionQuestion": "What part of me is coming back to life?",
    "tags": [
      "growth",
      "renewal",
      "bloom"
    ],
    "image": "/assets/daily-cards/card-08-the-returning-bloom.webp"
  },
  {
    "id": 9,
    "slug": "the-shadow-lantern",
    "name": "The Shadow Lantern",
    "meaning": "What feels uncomfortable may be showing you what needs light.",
    "action": "Name one fear without fighting it.",
    "reflectionQuestion": "What truth have I been avoiding?",
    "tags": [
      "shadow",
      "truth",
      "light"
    ],
    "image": "/assets/daily-cards/card-09-the-shadow-lantern.webp"
  },
  {
    "id": 10,
    "slug": "the-soft-crown",
    "name": "The Soft Crown",
    "meaning": "Your worth does not need to be earned today.",
    "action": "Treat yourself with visible respect.",
    "reflectionQuestion": "Where am I asking for proof that I am enough?",
    "tags": [
      "worth",
      "respect",
      "crown"
    ],
    "image": "/assets/daily-cards/card-10-the-soft-crown.webp"
  },
  {
    "id": 11,
    "slug": "the-silver-thread",
    "name": "The Silver Thread",
    "meaning": "A meaningful connection may be closer than it appears.",
    "action": "Reach out, reply, or soften one wall.",
    "reflectionQuestion": "Who feels important in my energy today?",
    "tags": [
      "connection",
      "relationship",
      "thread"
    ],
    "image": "/assets/daily-cards/card-11-the-silver-thread.webp"
  },
  {
    "id": 12,
    "slug": "the-glass-lake",
    "name": "The Glass Lake",
    "meaning": "Stillness can reveal what noise has hidden.",
    "action": "Create five minutes of silence.",
    "reflectionQuestion": "What becomes visible when I stop performing?",
    "tags": [
      "stillness",
      "lake",
      "silence"
    ],
    "image": "/assets/daily-cards/card-12-the-glass-lake.webp"
  },
  {
    "id": 13,
    "slug": "the-first-spark",
    "name": "The First Spark",
    "meaning": "Inspiration is small at first, but it can become momentum.",
    "action": "Start before you feel fully ready.",
    "reflectionQuestion": "What tiny action could change the rhythm of my day?",
    "tags": [
      "spark",
      "inspiration",
      "start"
    ],
    "image": "/assets/daily-cards/card-13-the-first-spark.webp"
  },
  {
    "id": 14,
    "slug": "the-wise-river",
    "name": "The Wise River",
    "meaning": "Flow is not weakness; it is intelligent movement.",
    "action": "Adapt instead of forcing.",
    "reflectionQuestion": "Where am I resisting what is naturally changing?",
    "tags": [
      "flow",
      "change",
      "river"
    ],
    "image": "/assets/daily-cards/card-14-the-wise-river.webp"
  },
  {
    "id": 15,
    "slug": "the-ancient-tree",
    "name": "The Ancient Tree",
    "meaning": "Your roots are deeper than today’s uncertainty.",
    "action": "Ground yourself through routine or body awareness.",
    "reflectionQuestion": "What stable part of me can I return to?",
    "tags": [
      "roots",
      "grounding",
      "stability"
    ],
    "image": "/assets/daily-cards/card-15-the-ancient-tree.webp"
  },
  {
    "id": 16,
    "slug": "the-celestial-compass",
    "name": "The Celestial Compass",
    "meaning": "You already have a direction, even if the map is incomplete.",
    "action": "Follow the strongest inner signal.",
    "reflectionQuestion": "What choice feels quietly correct?",
    "tags": [
      "direction",
      "compass",
      "guidance"
    ],
    "image": "/assets/daily-cards/card-16-the-celestial-compass.webp"
  },
  {
    "id": 17,
    "slug": "the-closed-door",
    "name": "The Closed Door",
    "meaning": "Not every delay is rejection; some are protection.",
    "action": "Respect one boundary today.",
    "reflectionQuestion": "What am I being protected from?",
    "tags": [
      "boundary",
      "protection",
      "door"
    ],
    "image": "/assets/daily-cards/card-17-the-closed-door.webp"
  },
  {
    "id": 18,
    "slug": "the-healing-rain",
    "name": "The Healing Rain",
    "meaning": "Release is not loss; it is space returning to you.",
    "action": "Let go of one repeated thought.",
    "reflectionQuestion": "What am I ready to stop carrying?",
    "tags": [
      "release",
      "rain",
      "healing"
    ],
    "image": "/assets/daily-cards/card-18-the-healing-rain.webp"
  },
  {
    "id": 19,
    "slug": "the-dawn-stone",
    "name": "The Dawn Stone",
    "meaning": "A slow beginning is still a beginning.",
    "action": "Do the simplest useful thing first.",
    "reflectionQuestion": "What can I begin without pressure?",
    "tags": [
      "beginning",
      "dawn",
      "step"
    ],
    "image": "/assets/daily-cards/card-19-the-dawn-stone.webp"
  },
  {
    "id": 20,
    "slug": "the-violet-flame",
    "name": "The Violet Flame",
    "meaning": "Transformation may feel intense because something old is burning away.",
    "action": "Choose renewal over repetition.",
    "reflectionQuestion": "What old version of me is ending?",
    "tags": [
      "transformation",
      "flame",
      "renewal"
    ],
    "image": "/assets/daily-cards/card-20-the-violet-flame.webp"
  },
  {
    "id": 21,
    "slug": "the-hidden-garden",
    "name": "The Hidden Garden",
    "meaning": "Not everything valuable needs to be visible yet.",
    "action": "Protect one private dream.",
    "reflectionQuestion": "What part of my growth needs patience?",
    "tags": [
      "private-growth",
      "garden",
      "patience"
    ],
    "image": "/assets/daily-cards/card-21-the-hidden-garden.webp"
  },
  {
    "id": 22,
    "slug": "the-soul-bridge",
    "name": "The Soul Bridge",
    "meaning": "The distance between where you are and where you belong is closing.",
    "action": "Make one choice that connects your present to your future.",
    "reflectionQuestion": "What future version of me is trying to reach me?",
    "tags": [
      "future-self",
      "bridge",
      "belonging"
    ],
    "image": "/assets/daily-cards/card-22-the-soul-bridge.webp"
  },
  {
    "id": 23,
    "slug": "the-oracle-shell",
    "name": "The Oracle Shell",
    "meaning": "The answer may come through symbols, patterns, or repeated signs.",
    "action": "Notice one recurring detail today.",
    "reflectionQuestion": "What keeps appearing in my life right now?",
    "tags": [
      "symbols",
      "patterns",
      "oracle"
    ],
    "image": "/assets/daily-cards/card-23-the-oracle-shell.webp"
  },
  {
    "id": 24,
    "slug": "the-north-star-within",
    "name": "The North Star Within",
    "meaning": "Guidance is not only above you; it is inside you.",
    "action": "Trust one inner decision without asking everyone else.",
    "reflectionQuestion": "Where do I already know the way?",
    "tags": [
      "inner-guidance",
      "north-star",
      "trust"
    ],
    "image": "/assets/daily-cards/card-24-the-north-star-within.webp"
  }
]
;

export const DAY_MS = 24 * 60 * 60 * 1000;

export type DailyCardReflection = {
  date: string;
  cardId: number;
  cardSlug: string;
  reflection: string;
  savedAt: string;
};

export const DAILY_CARD_REFLECTIONS_KEY = "eluna_daily_card_reflections";

export type DailyCardReflectionEntry = {
  id: string;
  date: string;
  dayKey: string;
  cardId: number;
  cardSlug: string;
  cardName: string;
  cardImage: string;
  cardTags: string[];
  meaning: string;
  action: string;
  reflectionQuestion: string;
  reflection: string;
  savedAt: string;
  updatedAt: string;
};

export function getLocalDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getOrCreateVisitorId() {
  if (typeof window === "undefined") return "server";
  const key = "eluna_visitor_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `visitor_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(key, id);
  return id;
}

export function getTodayDailyCard(userId?: string, date = new Date()) {
  const seed = userId || getOrCreateVisitorId();
  const dayKey = getLocalDayKey(date);
  const daysSinceEpoch = Math.floor(new Date(`${dayKey}T00:00:00`).getTime() / DAY_MS);
  const offset = hashString(seed) % dailyCards.length;
  const index = (daysSinceEpoch + offset) % dailyCards.length;
  return dailyCards[index];
}

export function getDailyCardById(id: number | string | null | undefined) {
  const numericId = typeof id === "string" ? Number(id) : id;
  return dailyCards.find((card) => card.id === numericId) ?? null;
}

export function getDailyCardBySlug(slug: string | null | undefined) {
  return dailyCards.find((card) => card.slug === slug) ?? null;
}

export function getDailyCardReflectionKey(dateKey = getLocalDayKey()) {
  return `eluna_daily_card_reflection_${dateKey}`;
}

function normalizeReflectionEntry(value: Partial<DailyCardReflectionEntry>): DailyCardReflectionEntry | null {
  if (!value.dayKey || !value.cardId || !value.cardSlug || typeof value.reflection !== "string") return null;
  const card = getDailyCardById(value.cardId) ?? getDailyCardBySlug(value.cardSlug);
  return {
    id: value.id ?? `daily_card_reflection_${value.dayKey}`,
    date: value.date ?? value.dayKey,
    dayKey: value.dayKey,
    cardId: value.cardId,
    cardSlug: value.cardSlug,
    cardName: value.cardName ?? card?.name ?? value.cardSlug,
    cardImage: value.cardImage ?? card?.image ?? "",
    cardTags: Array.isArray(value.cardTags) ? value.cardTags : card?.tags ?? [],
    meaning: value.meaning ?? card?.meaning ?? "",
    action: value.action ?? card?.action ?? "",
    reflectionQuestion: value.reflectionQuestion ?? card?.reflectionQuestion ?? "",
    reflection: value.reflection,
    savedAt: value.savedAt ?? new Date().toISOString(),
    updatedAt: value.updatedAt ?? value.savedAt ?? new Date().toISOString(),
  };
}

export function getDailyCardReflectionEntries() {
  if (typeof window === "undefined") return [] as DailyCardReflectionEntry[];
  try {
    const raw = window.localStorage.getItem(DAILY_CARD_REFLECTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => normalizeReflectionEntry(entry as Partial<DailyCardReflectionEntry>))
      .filter((entry): entry is DailyCardReflectionEntry => entry !== null)
      .sort((a, b) => b.dayKey.localeCompare(a.dayKey) || b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

function writeDailyCardReflectionEntries(entries: DailyCardReflectionEntry[]) {
  if (typeof window === "undefined") return entries;
  window.localStorage.setItem(DAILY_CARD_REFLECTIONS_KEY, JSON.stringify(entries));
  return entries;
}

export function getTodayDailyCardReflection(dayKey = getLocalDayKey()) {
  return getDailyCardReflectionEntries().find((entry) => entry.dayKey === dayKey) ?? null;
}

export function readDailyCardReflection(dateKey = getLocalDayKey()) {
  if (typeof window === "undefined") return "";
  const entry = getTodayDailyCardReflection(dateKey);
  if (entry) return entry.reflection;
  try {
    const raw = window.localStorage.getItem(getDailyCardReflectionKey(dateKey));
    if (!raw) return "";
    const parsed = JSON.parse(raw) as Partial<DailyCardReflection>;
    return typeof parsed.reflection === "string" ? parsed.reflection : "";
  } catch {
    return "";
  }
}

export function saveDailyCardReflection(card: DailyCard, reflection: string, dateKey = getLocalDayKey()) {
  if (typeof window === "undefined") return null;
  const value = reflection.trim();
  const entries = getDailyCardReflectionEntries();
  const now = new Date().toISOString();
  const existing = entries.find((entry) => entry.dayKey === dateKey);
  const entry: DailyCardReflectionEntry = {
    id: existing?.id ?? `daily_card_reflection_${dateKey}`,
    date: dateKey,
    dayKey: dateKey,
    cardId: card.id,
    cardSlug: card.slug,
    cardName: card.name,
    cardImage: card.image,
    cardTags: card.tags,
    meaning: card.meaning,
    action: card.action,
    reflectionQuestion: card.reflectionQuestion,
    reflection: value,
    savedAt: existing?.savedAt ?? now,
    updatedAt: now,
  };
  writeDailyCardReflectionEntries([entry, ...entries.filter((item) => item.dayKey !== dateKey)]);
  const payload: DailyCardReflection = {
    date: dateKey,
    cardId: card.id,
    cardSlug: card.slug,
    reflection: value,
    savedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(getDailyCardReflectionKey(dateKey), JSON.stringify(payload));
  return entry;
}

export function deleteDailyCardReflection(entryId: string) {
  const entries = getDailyCardReflectionEntries();
  const entry = entries.find((item) => item.id === entryId);
  const nextEntries = entries.filter((item) => item.id !== entryId);
  writeDailyCardReflectionEntries(nextEntries);
  if (entry && typeof window !== "undefined") {
    window.localStorage.removeItem(getDailyCardReflectionKey(entry.dayKey));
  }
  return nextEntries;
}
