export type PrelandKind = "pastlife" | "soulmate" | "tarot" | "generic";

export type PrelandExperience = {
  title: string;
  label: string;
  shortText: string;
  todayText: string;
  pathSignal: string;
  pathMeaning: string;
  pathWhere: string;
  pathNext: string;
  paywallTitle: string;
  paywallDescription: string;
};

export function normalizePrelandResult(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export const pastlifeExperiences: Record<string, PrelandExperience> = {
  guardian: {
    title: "Your Past Life reading is ready",
    label: "Past-life archetype: The Guardian",
    shortText: "We’ve prepared your first soul pattern from your quiz answers.",
    todayText: "Guardian pattern: you may protect others before listening to your own needs.",
    pathSignal: "Protection",
    pathMeaning: "Your first signal is protection. You may notice yourself guarding others, guarding your heart, or guarding an old version of yourself.",
    pathWhere: "Look for moments where you moved into protection before asking what you needed.",
    pathNext: "Choose one small response that protects your energy without closing your heart.",
    paywallTitle: "Unlock your Past Life reading",
    paywallDescription: "Start 3-day introductory access for $1 to open the deeper pattern behind your quiz result, daily practices, and Sky Map.",
  },
  healer: {
    title: "Your Past Life reading is ready",
    label: "Past-life archetype: The Healer",
    shortText: "We’ve prepared your first soul pattern from your quiz answers.",
    todayText: "Healer pattern: you may absorb emotions that were never yours to carry.",
    pathSignal: "Release",
    pathMeaning: "Your first signal is release. You may notice where you carry emotions that are not yours.",
    pathWhere: "Look for moments where someone else’s feeling stayed in your body after the moment passed.",
    pathNext: "Release one feeling that does not belong to you before choosing your response.",
    paywallTitle: "Unlock your Past Life reading",
    paywallDescription: "Start 3-day introductory access for $1 to open the deeper pattern behind your quiz result, daily practices, and Sky Map.",
  },
  wanderer: {
    title: "Your Past Life reading is ready",
    label: "Past-life archetype: The Wanderer",
    shortText: "We’ve prepared your first soul pattern from your quiz answers.",
    todayText: "Wanderer pattern: you may feel pulled toward change before knowing why.",
    pathSignal: "Restlessness",
    pathMeaning: "Your first signal is movement. You may notice the urge to leave, change, or search before the deeper need is named.",
    pathWhere: "Look for moments where change felt urgent, even when the next step was still forming.",
    pathNext: "Name what you are moving toward before you move away from what is here.",
    paywallTitle: "Unlock your Past Life reading",
    paywallDescription: "Start 3-day introductory access for $1 to open the deeper pattern behind your quiz result, daily practices, and Sky Map.",
  },
  mystic: {
    title: "Your Past Life reading is ready",
    label: "Past-life archetype: The Mystic",
    shortText: "We’ve prepared your first soul pattern from your quiz answers.",
    todayText: "Mystic pattern: you may sense meaning before you can explain it.",
    pathSignal: "Inner knowing",
    pathMeaning: "Your first signal is inner knowing. You may notice meaning arriving quietly before your mind can explain it.",
    pathWhere: "Look for moments where your body knew something before your thoughts caught up.",
    pathNext: "Give one quiet signal enough space to become clear before you act.",
    paywallTitle: "Unlock your Past Life reading",
    paywallDescription: "Start 3-day introductory access for $1 to open the deeper pattern behind your quiz result, daily practices, and Sky Map.",
  },
  warrior: {
    title: "Your Past Life reading is ready",
    label: "Past-life archetype: The Warrior",
    shortText: "We’ve prepared your first soul pattern from your quiz answers.",
    todayText: "Warrior pattern: you may react with strength when softness would reveal more.",
    pathSignal: "Soft strength",
    pathMeaning: "Your first signal is strength. You may notice where your power protects you, and where softness could reveal the truth underneath.",
    pathWhere: "Look for moments where you braced, defended, or pushed through before checking what you felt.",
    pathNext: "Let strength become steadiness instead of reaction in one small moment today.",
    paywallTitle: "Unlock your Past Life reading",
    paywallDescription: "Start 3-day introductory access for $1 to open the deeper pattern behind your quiz result, daily practices, and Sky Map.",
  },
  hidden: {
    title: "Your Past Life reading is ready",
    label: "Past-life archetype: The Hidden Pattern",
    shortText: "We’ve prepared your first soul pattern from your quiz answers.",
    todayText: "Your result points to a repeating emotional pattern. Today, notice where this pattern appears in your reactions, attachments, or choices.",
    pathSignal: "Repetition",
    pathMeaning: "Your first signal is repetition. What keeps returning may be older than the current situation.",
    pathWhere: "Look for the emotional theme that repeated today, even if the outer situation changed.",
    pathNext: "Choose one small response that belongs to the present, not to the old pattern.",
    paywallTitle: "Unlock your Past Life reading",
    paywallDescription: "Start 3-day introductory access for $1 to open the deeper pattern behind your quiz result, daily practices, and Sky Map.",
  },
};

export const soulmateExperiences: Record<string, PrelandExperience> = {
  mirror_bond: {
    title: "Your Soulmate signal is ready",
    label: "Connection pattern: Mirror Bond",
    shortText: "We’ve prepared your first relationship pattern from your quiz answers.",
    todayText: "Mirror Bond pattern: notice whether this connection reflects peace, pressure, clarity, or confusion back to you.",
    pathSignal: "Connection",
    pathMeaning: "Your first signal is connection. Notice whether today’s attraction brings peace, pressure, clarity, or confusion.",
    pathWhere: "Look for the person, memory, or feeling you kept returning to today.",
    pathNext: "Choose one response that keeps you honest with yourself inside the connection.",
    paywallTitle: "Unlock your Soulmate insight",
    paywallDescription: "Start 3-day introductory access for $1 to reveal deeper relationship patterns, connection signals, and your evolving path.",
  },
  slow_flame: {
    title: "Your Soulmate signal is ready",
    label: "Connection pattern: Slow Flame",
    shortText: "We’ve prepared your first relationship pattern from your quiz answers.",
    todayText: "Slow Flame pattern: the connection may reveal itself through calm consistency rather than intensity.",
    pathSignal: "Slow flame",
    pathMeaning: "Your first signal is slow flame. Notice where connection feels steady enough to trust without forcing intensity.",
    pathWhere: "Look for signs of calm care, steady attention, or the absence of pressure.",
    pathNext: "Let one connection move at a pace your body can actually trust.",
    paywallTitle: "Unlock your Soulmate insight",
    paywallDescription: "Start 3-day introductory access for $1 to reveal deeper relationship patterns, connection signals, and your evolving path.",
  },
  twin_signal: {
    title: "Your Soulmate signal is ready",
    label: "Connection pattern: Twin Signal",
    shortText: "We’ve prepared your first relationship pattern from your quiz answers.",
    todayText: "Twin Signal pattern: attraction may feel intense, but your path asks you to notice what it mirrors.",
    pathSignal: "Mirror",
    pathMeaning: "Your first signal is mirror. Notice what this connection reveals about your needs, fears, and truth.",
    pathWhere: "Look for moments where someone else’s presence made your own pattern easier to see.",
    pathNext: "Separate the signal from the fantasy by naming one grounded fact.",
    paywallTitle: "Unlock your Soulmate insight",
    paywallDescription: "Start 3-day introductory access for $1 to reveal deeper relationship patterns, connection signals, and your evolving path.",
  },
  unfinished_thread: {
    title: "Your Soulmate signal is ready",
    label: "Connection pattern: Unfinished Thread",
    shortText: "We’ve prepared your first relationship pattern from your quiz answers.",
    todayText: "Unfinished Thread pattern: a memory, longing, or unanswered feeling may be asking for honest attention.",
    pathSignal: "Unfinished thread",
    pathMeaning: "Your first signal is unfinished thread. Notice what keeps pulling you back because it still needs clarity.",
    pathWhere: "Look for repeated thoughts, old conversations, or emotional loops that returned today.",
    pathNext: "Give the unfinished feeling one honest sentence without making it your whole direction.",
    paywallTitle: "Unlock your Soulmate insight",
    paywallDescription: "Start 3-day introductory access for $1 to reveal deeper relationship patterns, connection signals, and your evolving path.",
  },
  hidden: {
    title: "Your Soulmate signal is ready",
    label: "Connection pattern: Hidden Signal",
    shortText: "We’ve prepared your first relationship pattern from your quiz answers.",
    todayText: "Your relationship pattern may appear today through attraction, memory, longing, or emotional repetition.",
    pathSignal: "Connection",
    pathMeaning: "Your first signal is connection. Notice whether today’s attraction brings peace, pressure, clarity, or confusion.",
    pathWhere: "Look for the emotional pattern that repeated around love, memory, or longing today.",
    pathNext: "Choose one response that honors both your heart and your stability.",
    paywallTitle: "Unlock your Soulmate insight",
    paywallDescription: "Start 3-day introductory access for $1 to reveal deeper relationship patterns, connection signals, and your evolving path.",
  },
};

export const genericPrelandExperience: PrelandExperience = {
  title: "Your personal insight is ready",
  label: "Personal insight saved",
  shortText: "Your quiz answers have been saved to personalize your first reading.",
  todayText: "Your answers are now part of today’s reading. Notice what repeats in your choices, emotions, and attention.",
  pathSignal: "Attention",
  pathMeaning: "Your first signal is attention. What keeps returning may be showing you the first visible part of your path.",
  pathWhere: "Look for the moment that repeated emotionally, even if the outside situation changed.",
  pathNext: "Choose one small action that respects what you noticed.",
  paywallTitle: "Unlock your full eLuna path",
  paywallDescription: "Start 3-day introductory access for $1 to open deeper readings, premium practices, and the parts of your Sky Map that stay locked on Free.",
};

export function getExperienceForPreland(kind: PrelandKind | null, result?: string | null): PrelandExperience | null {
  const normalized = normalizePrelandResult(result);
  if (kind === "pastlife") return pastlifeExperiences[normalized] ?? pastlifeExperiences.hidden;
  if (kind === "soulmate") return soulmateExperiences[normalized] ?? soulmateExperiences.hidden;
  if (kind === "tarot" || kind === "generic") return genericPrelandExperience;
  return null;
}
