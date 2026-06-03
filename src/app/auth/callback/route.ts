import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

type ProfileRow = Record<string, unknown>;

function validateReturnTo(value: string | null) {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("http://") || value.includes("https://")) return null;
  return value;
}

function firstString(...values: unknown[]) {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0)?.trim() ?? "";
}

function readBoolean(value: unknown) {
  return value === true || value === "true";
}

function isMissingProfileColumnError(message: string | undefined) {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("schema cache") ||
    normalized.includes("could not find") ||
    (normalized.includes("column") && normalized.includes("does not exist"))
  );
}

function getProfileName(user: User, profile?: ProfileRow | null) {
  const metadata = user.user_metadata ?? {};
  const fromProfile = firstString(profile?.full_name);
  if (fromProfile) return fromProfile;
  const fromMetadata = firstString(metadata.full_name, metadata.name);
  if (fromMetadata) return fromMetadata;
  const emailName = firstString(user.email).split("@")[0]?.replace(/[._-]/g, " ");
  return emailName || "Traveler";
}

function isProfileComplete(profile: ProfileRow | null, metadata: Record<string, unknown>) {
  const birthDate = firstString(profile?.birth_date, profile?.birthDate, metadata.birth_date, metadata.birthDate, metadata.dateOfBirth, metadata.date_of_birth);
  const birthPlace = firstString(profile?.birth_place, profile?.birthPlace, metadata.birth_place, metadata.birthPlace);
  const birthTime = firstString(profile?.birth_time, profile?.birthTime, metadata.birth_time, metadata.birthTime);
  const birthTimeUnknown = readBoolean(profile?.birth_time_unknown) || readBoolean(profile?.birthTimeUnknown) || readBoolean(metadata.birth_time_unknown) || readBoolean(metadata.birthTimeUnknown);
  return Boolean(birthDate && birthPlace && (birthTime || birthTimeUnknown));
}

async function selectProfile(supabase: SupabaseClient, userId: string) {
  const extendedSelect = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, language, onboarding_completed, birth_date, birth_place, birth_time, birth_time_unknown")
    .eq("id", userId)
    .maybeSingle();

  if (!extendedSelect.error) return extendedSelect.data as ProfileRow | null;

  if (!isMissingProfileColumnError(extendedSelect.error.message)) {
    return null;
  }

  const fallbackSelect = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  return (fallbackSelect.data as ProfileRow | null) ?? null;
}

async function updateAuthMetadataLanguage(supabase: SupabaseClient, user: User, complete: boolean) {
  const metadata = user.user_metadata ?? {};
  await supabase.auth.updateUser({
    data: {
      ...metadata,
      language: "en",
      ...(complete ? { onboarding_completed: true, onboardingCompleted: true } : {}),
    },
  });
}

async function upsertOAuthProfile(supabase: SupabaseClient, user: User, complete: boolean) {
  const metadata = user.user_metadata ?? {};
  const baseProfile = {
    id: user.id,
    email: user.email ?? "",
    full_name: getProfileName(user),
    updated_at: new Date().toISOString(),
  };
  const extendedProfile = {
    ...baseProfile,
    language: "en",
    onboarding_completed: complete,
    birth_date: firstString(metadata.birth_date, metadata.birthDate, metadata.dateOfBirth, metadata.date_of_birth) || null,
    birth_place: firstString(metadata.birth_place, metadata.birthPlace) || null,
    birth_time: firstString(metadata.birth_time, metadata.birthTime) || null,
    birth_time_unknown: readBoolean(metadata.birth_time_unknown) || readBoolean(metadata.birthTimeUnknown),
  };

  const result = await supabase.from("profiles").upsert(extendedProfile);
  if (result.error && isMissingProfileColumnError(result.error.message)) {
    await supabase.from("profiles").upsert(baseProfile);
  }
}

async function updateOAuthProfile(supabase: SupabaseClient, user: User, complete: boolean, profile: ProfileRow | null) {
  const metadata = user.user_metadata ?? {};
  const baseProfile = {
    email: user.email ?? "",
    full_name: getProfileName(user, profile),
    updated_at: new Date().toISOString(),
  };
  const extendedProfile = {
    ...baseProfile,
    language: "en",
    ...(complete ? { onboarding_completed: true } : {}),
    birth_date: firstString(metadata.birth_date, metadata.birthDate, metadata.dateOfBirth, metadata.date_of_birth) || undefined,
    birth_place: firstString(metadata.birth_place, metadata.birthPlace) || undefined,
    birth_time: firstString(metadata.birth_time, metadata.birthTime) || undefined,
    birth_time_unknown: readBoolean(metadata.birth_time_unknown) || readBoolean(metadata.birthTimeUnknown) || undefined,
  };

  const result = await supabase.from("profiles").update(extendedProfile).eq("id", user.id);
  if (result.error && isMissingProfileColumnError(result.error.message)) {
    await supabase.from("profiles").update(baseProfile).eq("id", user.id);
  }
}

function getPostAuthReturnTo(returnTo: string, complete: boolean) {
  if (!complete) return "/onboarding";
  return returnTo === "/onboarding" ? "/home" : returnTo;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const authError = requestUrl.searchParams.get("error");
  const returnTo = validateReturnTo(requestUrl.searchParams.get("returnTo")) ?? "/home";

  if (authError) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
  }

  if (code) {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data.user) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }

    const profile = await selectProfile(supabase, data.user.id);
    const complete = isProfileComplete(profile, data.user.user_metadata ?? {});

    await updateAuthMetadataLanguage(supabase, data.user, complete);
    if (profile) {
      await updateOAuthProfile(supabase, data.user, complete, profile);
    } else {
      await upsertOAuthProfile(supabase, data.user, false);
    }

    return NextResponse.redirect(new URL(getPostAuthReturnTo(returnTo, Boolean(profile && complete)), request.url));
  }

  return NextResponse.redirect(new URL(returnTo, request.url));
}
