import { getZodiacSign, getZodiacSignByKey, type ZodiacSignInfo, type ZodiacSignKey } from "@/lib/astrology/zodiac";

export type ResolvedZodiac = ZodiacSignInfo & {
  source: "manual" | "birthDate" | "unknown";
};

type ProfileLike = {
  birthDate?: string | null;
  zodiacOverride?: boolean | null;
  zodiacSign?: ZodiacSignInfo | ZodiacSignKey | string | null;
};

const ZODIAC_SIGN_KEY = "eluna:zodiacSign";
const ZODIAC_OVERRIDE_KEY = "eluna:zodiacOverride";

function readStorage(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

function readStorageBoolean(key: string) {
  return readStorage(key) === "true";
}

function normalizeSignKey(value: ProfileLike["zodiacSign"]): ZodiacSignKey | "" {
  if (!value) return "";
  const key = typeof value === "string" ? value : value.key;
  const sign = getZodiacSignByKey(key);
  return sign.key === "unknown" ? "" : sign.key;
}

export function resolveUserZodiac(profile?: ProfileLike | null): ResolvedZodiac {
  const profileSignKey = normalizeSignKey(profile?.zodiacSign);
  if (profile?.zodiacOverride && profileSignKey) {
    return { ...getZodiacSignByKey(profileSignKey), source: "manual" };
  }

  const storedSignKey = normalizeSignKey(readStorage(ZODIAC_SIGN_KEY));
  if (readStorageBoolean(ZODIAC_OVERRIDE_KEY) && storedSignKey) {
    return { ...getZodiacSignByKey(storedSignKey), source: "manual" };
  }

  const calculated = getZodiacSign(profile?.birthDate);
  return {
    ...calculated,
    source: calculated.key === "unknown" ? "unknown" : "birthDate",
  };
}
