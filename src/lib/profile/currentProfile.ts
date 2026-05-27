import { getCurrentUser, isSupabaseAuthEnabled, upsertProfile } from "@/lib/auth/authAdapter";
import { getMockUser, saveMockUser } from "@/lib/mockAuth";
import { supabase } from "@/lib/supabase/client";
import type { LaunchContext } from "@/lib/launch/launchContext";

export type CurrentProfile = {
  id?: string;
  email: string;
  fullName: string;
  gender: "female" | "male" | "";
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  focusAreas: string[];
  practicePreferences: string[];
  onboardingCompleted: boolean;
  source?: string;
  funnel?: string;
  utm: {
    source?: string;
    campaign?: string;
    content?: string;
  };
  launchContext?: LaunchContext;
};

export type OnboardingInput = {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  focusAreas: string[];
  practicePreferences: string[];
};

const BIRTH_DATA_KEY = "eluna:birthData";
const FOCUS_AREAS_KEY = "eluna:focusAreas";
const PRACTICE_PREFERENCES_KEY = "eluna:practicePreferences";
const ONBOARDING_COMPLETED_KEY = "eluna:onboardingCompleted";

function parseJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function firstString(...values: unknown[]) {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0)?.trim() ?? "";
}

function normalizeArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function isCompleted(input: { birthDate: string; birthPlace: string; focusAreas: string[]; practicePreferences: string[]; explicit?: boolean }) {
  return Boolean(input.explicit || (input.birthDate && input.birthPlace && (input.focusAreas.length > 0 || input.practicePreferences.length > 0)));
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  let metadata: Record<string, unknown> = {};
  if (isSupabaseAuthEnabled() && supabase) {
    const { data } = await supabase.auth.getUser();
    metadata = data.user?.user_metadata ?? {};
  }

  const birthData = parseJson<{ birthDate?: string; birth_date?: string; dateOfBirth?: string; date_of_birth?: string; birthTime?: string; birth_time?: string; birthPlace?: string; birth_place?: string }>(BIRTH_DATA_KEY, {});
  const focusAreas = normalizeArray(metadata.focus_areas).length ? normalizeArray(metadata.focus_areas) : normalizeArray(metadata.focusAreas).length ? normalizeArray(metadata.focusAreas) : parseJson<string[]>(FOCUS_AREAS_KEY, []);
  const practicePreferences = normalizeArray(metadata.practice_preferences).length ? normalizeArray(metadata.practice_preferences) : normalizeArray(metadata.practicePreferences).length ? normalizeArray(metadata.practicePreferences) : parseJson<string[]>(PRACTICE_PREFERENCES_KEY, []);
  const onboardingCompleted = typeof window !== "undefined" && localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true";
  const launchContext = user.launchContext ?? {};

  const birthDate = firstString(user.birthDate, metadata.birth_date, metadata.birthDate, metadata.dateOfBirth, metadata.date_of_birth, birthData.birthDate, birthData.birth_date, birthData.dateOfBirth, birthData.date_of_birth);
  const birthTime = firstString(user.birthTime, metadata.birth_time, metadata.birthTime, birthData.birthTime, birthData.birth_time);
  const birthPlace = firstString(user.birthPlace, metadata.birth_place, metadata.birthPlace, birthData.birthPlace, birthData.birth_place);

  return {
    id: user.id,
    email: user.email,
    fullName: user.name,
    gender: user.gender,
    birthDate,
    birthTime,
    birthPlace,
    focusAreas,
    practicePreferences,
    onboardingCompleted: isCompleted({ birthDate, birthPlace, focusAreas, practicePreferences, explicit: onboardingCompleted || metadata.onboarding_completed === true || metadata.onboardingCompleted === true }),
    source: launchContext.source,
    funnel: launchContext.funnel,
    utm: {
      source: launchContext.utm_source,
      campaign: launchContext.utm_campaign,
      content: launchContext.utm_content,
    },
    launchContext,
  };
}

export async function saveOnboardingData(input: OnboardingInput): Promise<{ error?: string }> {
  if (typeof window !== "undefined") {
    localStorage.setItem(BIRTH_DATA_KEY, JSON.stringify({
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      birthPlace: input.birthPlace,
    }));
    localStorage.setItem(FOCUS_AREAS_KEY, JSON.stringify(input.focusAreas));
    localStorage.setItem(PRACTICE_PREFERENCES_KEY, JSON.stringify(input.practicePreferences));
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");

    const mockUser = getMockUser();
    if (mockUser) {
      saveMockUser({
        ...mockUser,
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        birthPlace: input.birthPlace,
      });
    }
  }

  if (isSupabaseAuthEnabled() && supabase) {
    const { data } = await supabase.auth.getUser();
    const metadata = data.user?.user_metadata ?? {};
    const { error } = await supabase.auth.updateUser({
      data: {
        ...metadata,
        birth_date: input.birthDate,
        birthDate: input.birthDate,
        birth_time: input.birthTime,
        birthTime: input.birthTime,
        birth_place: input.birthPlace,
        birthPlace: input.birthPlace,
        focus_areas: input.focusAreas,
        focusAreas: input.focusAreas,
        practice_preferences: input.practicePreferences,
        practicePreferences: input.practicePreferences,
        onboarding_completed: true,
        onboardingCompleted: true,
      },
    });
    if (error) return { error: "We saved your setup locally, but could not sync it to your account yet." };

    if (data.user) {
      await upsertProfile({
        id: data.user.id,
        email: data.user.email ?? "",
        fullName: firstString(metadata.full_name),
      });
    }
  }

  return {};
}

export function getOnboardingStorageKeys() {
  return {
    onboardingCompleted: ONBOARDING_COMPLETED_KEY,
    birthData: BIRTH_DATA_KEY,
    focusAreas: FOCUS_AREAS_KEY,
    practicePreferences: PRACTICE_PREFERENCES_KEY,
  };
}
