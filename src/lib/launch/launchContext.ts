export const LAUNCH_CONTEXT_KEYS = [
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

export type LaunchContextKey = typeof LAUNCH_CONTEXT_KEYS[number];
export type LaunchContext = Partial<Record<LaunchContextKey, string>>;

export const LAUNCH_CONTEXT_STORAGE_KEY = "eluna:launch-context:v1";

export function cleanLaunchContext(input: Record<string, string | null | undefined>): LaunchContext {
  return LAUNCH_CONTEXT_KEYS.reduce<LaunchContext>((acc, key) => {
    const value = input[key]?.trim();
    if (value) acc[key] = value.slice(0, 160);
    return acc;
  }, {});
}

export function isPastLifeContext(context?: LaunchContext | null) {
  const source = context?.source?.toLowerCase() ?? "";
  const funnel = context?.funnel?.toLowerCase() ?? "";
  return source === "pastlife" || funnel === "pastlife" || source === "past-life" || funnel === "past-life";
}

export function saveLaunchContext(context: LaunchContext) {
  if (typeof window === "undefined" || Object.keys(context).length === 0) return;
  localStorage.setItem(LAUNCH_CONTEXT_STORAGE_KEY, JSON.stringify(context));
}

export function loadLaunchContext(): LaunchContext {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LAUNCH_CONTEXT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LaunchContext) : {};
  } catch {
    return {};
  }
}
