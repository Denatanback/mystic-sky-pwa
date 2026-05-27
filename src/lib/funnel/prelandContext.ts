import { getExperienceForPreland, normalizePrelandResult, type PrelandExperience, type PrelandKind } from "./prelandExperiences";

export type { PrelandExperience } from "./prelandExperiences";

export const PRELAND_CONTEXT_STORAGE_KEY = "eluna:prelandContext";

export const PRELAND_CONTEXT_KEYS = [
  "source",
  "funnel",
  "result",
  "gender",
  "animal",
  "archetype",
  "element",
  "answer",
  "utm_source",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "ad_id",
  "campaign_id",
] as const;

export type PrelandContextKey = typeof PRELAND_CONTEXT_KEYS[number];
export type PrelandContext = Partial<Record<PrelandContextKey, string>> & {
  createdAt?: string;
};

function hasPrelandValues(context: PrelandContext) {
  return PRELAND_CONTEXT_KEYS.some((key) => Boolean(context[key]));
}

function cleanValue(value: string | null | undefined) {
  const clean = value?.trim();
  return clean ? clean.slice(0, 180) : undefined;
}

export function parsePrelandContext(searchParams: URLSearchParams | Record<string, string | null | undefined>): PrelandContext {
  const getValue = (key: PrelandContextKey) => searchParams instanceof URLSearchParams ? searchParams.get(key) : searchParams[key];
  const context = PRELAND_CONTEXT_KEYS.reduce<PrelandContext>((acc, key) => {
    const value = cleanValue(getValue(key));
    if (value) acc[key] = value;
    return acc;
  }, {});

  if (hasPrelandValues(context)) context.createdAt = new Date().toISOString();
  return context;
}

export function savePrelandContext(context: PrelandContext) {
  if (typeof window === "undefined" || !hasPrelandValues(context)) return context;
  const existing = getPrelandContext();
  const next: PrelandContext = {
    ...existing,
    ...context,
    createdAt: existing.createdAt ?? context.createdAt ?? new Date().toISOString(),
  };
  localStorage.setItem(PRELAND_CONTEXT_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getPrelandContext(): PrelandContext {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PRELAND_CONTEXT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PrelandContext) : {};
  } catch {
    return {};
  }
}

export function clearPrelandContext() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PRELAND_CONTEXT_STORAGE_KEY);
}

export function getPrelandKind(context?: PrelandContext | null): PrelandKind | null {
  const source = normalizePrelandResult(context?.source);
  const funnel = normalizePrelandResult(context?.funnel);
  const values = [source, funnel];
  if (values.some((value) => value === "pastlife" || value === "past_life")) return "pastlife";
  if (values.some((value) => value === "soulmate" || value === "soul_mate")) return "soulmate";
  if (values.some((value) => value === "tarot" || value === "dailycard" || value === "daily_card")) return "tarot";
  return hasPrelandValues(context ?? {}) ? "generic" : null;
}

export function getPrelandExperience(context?: PrelandContext | null): PrelandExperience | null {
  const kind = getPrelandKind(context);
  const result = context?.result ?? context?.archetype ?? context?.answer;
  return getExperienceForPreland(kind, result);
}

export function isPastLifePrelandContext(context?: PrelandContext | null) {
  return getPrelandKind(context) === "pastlife";
}

export function isSoulmatePrelandContext(context?: PrelandContext | null) {
  return getPrelandKind(context) === "soulmate";
}
