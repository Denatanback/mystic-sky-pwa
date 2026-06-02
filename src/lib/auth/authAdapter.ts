import {
  clearMockAuth,
  getMockUser,
  saveMockUser,
  setMockAuthenticated,
  setMockUser,
  type MockUserProfile,
} from "@/lib/mockAuth";
import type { LaunchContext } from "@/lib/launch/launchContext";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

export type AuthUserProfile = MockUserProfile & {
  id?: string;
  avatarUrl?: string | null;
  provider: "mock" | "supabase";
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  gender?: MockUserProfile["gender"];
  birthDate?: string;
  birthTime?: string;
  birthTimeUnknown?: boolean;
  birthPlace?: string;
  launchContext?: LaunchContext;
};

export type LoginInput = {
  email: string;
  password: string;
};

type AuthResult = {
  user: AuthUserProfile | null;
  error?: string;
};

const genericAuthError = "We could not sign you in. Check your email and password.";
const genericRegisterError = "We could not create your account. Please try again.";
const genericResetError = "We could not send a reset link. Please try again.";
const genericUpdatePasswordError = "We could not update your password. Please try again.";
export const resetPasswordSuccessMessage = "If an account exists for this email, we’ll send a reset link.";

function friendlyError(message: string | undefined, fallback: string) {
  if (!message) return fallback;
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "Incorrect email or password.";
  if (normalized.includes("user already registered")) return "An account with this email already exists.";
  if (normalized.includes("password")) return "Check your password: it must meet the security requirements.";
  if (normalized.includes("email")) return "Check your email and try again.";
  return fallback;
}

function mapMockUser(user: MockUserProfile | null): AuthUserProfile | null {
  if (!user) return null;
  return { ...user, provider: "mock" };
}

function mapSupabaseProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}, profile?: { full_name?: string | null; avatar_url?: string | null } | null): AuthUserProfile {
  const metadataName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
  const metadata = user.user_metadata ?? {};
  const launchContext = typeof metadata.launch_context === "object" && metadata.launch_context !== null
    ? metadata.launch_context as LaunchContext
    : {
        source: typeof metadata.source === "string" ? metadata.source : undefined,
        funnel: typeof metadata.funnel === "string" ? metadata.funnel : undefined,
        result: typeof metadata.result === "string" ? metadata.result : undefined,
        gender: typeof metadata.gender === "string" ? metadata.gender : undefined,
        animal: typeof metadata.animal === "string" ? metadata.animal : undefined,
        archetype: typeof metadata.archetype === "string" ? metadata.archetype : undefined,
        element: typeof metadata.element === "string" ? metadata.element : undefined,
        answer: typeof metadata.answer === "string" ? metadata.answer : undefined,
        utm_source: typeof metadata.utm_source === "string" ? metadata.utm_source : undefined,
        utm_campaign: typeof metadata.utm_campaign === "string" ? metadata.utm_campaign : undefined,
        utm_content: typeof metadata.utm_content === "string" ? metadata.utm_content : undefined,
        utm_medium: typeof metadata.utm_medium === "string" ? metadata.utm_medium : undefined,
        ad_id: typeof metadata.ad_id === "string" ? metadata.ad_id : undefined,
        campaign_id: typeof metadata.campaign_id === "string" ? metadata.campaign_id : undefined,
      };
  return {
    id: user.id,
    name: profile?.full_name || metadataName || "Traveler",
    email: user.email ?? "",
    gender: typeof metadata.gender === "string" && (metadata.gender === "female" || metadata.gender === "male") ? metadata.gender : "",
    birthDate: typeof metadata.birth_date === "string" ? metadata.birth_date : typeof metadata.birthDate === "string" ? metadata.birthDate : typeof metadata.dateOfBirth === "string" ? metadata.dateOfBirth : typeof metadata.date_of_birth === "string" ? metadata.date_of_birth : "",
    birthTime: typeof metadata.birth_time === "string" ? metadata.birth_time : typeof metadata.birthTime === "string" ? metadata.birthTime : "",
    birthTimeUnknown: Boolean(metadata.birth_time_unknown),
    birthPlace: typeof metadata.birth_place === "string" ? metadata.birth_place : typeof metadata.birthPlace === "string" ? metadata.birthPlace : "",
    createdAt: new Date().toISOString(),
    avatarUrl: profile?.avatar_url ?? null,
    launchContext,
    provider: "supabase",
  };
}

export function isSupabaseAuthEnabled() {
  return isSupabaseConfigured && Boolean(supabase);
}

export async function signIn(input: LoginInput): Promise<AuthResult> {
  const email = input.email.trim();

  if (!isSupabaseAuthEnabled() || !supabase) {
    const rawName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    setMockUser({ name: rawName || "Traveler", email });
    return { user: mapMockUser(getMockUser()) };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error || !data.user) {
    return { user: null, error: friendlyError(error?.message, genericAuthError) };
  }

  return { user: await getCurrentUser() };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const email = input.email.trim();
  const name = input.name.trim();

  if (!isSupabaseAuthEnabled() || !supabase) {
    saveMockUser({
      name,
      email,
      gender: input.gender ?? "",
      birthDate: input.birthDate ?? "",
      birthTime: input.birthTimeUnknown ? "" : input.birthTime ?? "",
      birthTimeUnknown: Boolean(input.birthTimeUnknown),
      birthPlace: input.birthPlace?.trim() ?? "",
      createdAt: new Date().toISOString(),
      launchContext: input.launchContext,
    });
    setMockAuthenticated();
    return { user: mapMockUser(getMockUser()) };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: name,
        gender: input.gender ?? "",
        birth_date: input.birthDate ?? "",
        birth_time: input.birthTimeUnknown ? "" : input.birthTime ?? "",
        birth_time_unknown: Boolean(input.birthTimeUnknown),
        birth_place: input.birthPlace?.trim() ?? "",
        source: input.launchContext?.source ?? null,
        funnel: input.launchContext?.funnel ?? null,
        result: input.launchContext?.result ?? null,
        animal: input.launchContext?.animal ?? null,
        archetype: input.launchContext?.archetype ?? null,
        element: input.launchContext?.element ?? null,
        answer: input.launchContext?.answer ?? null,
        utm_source: input.launchContext?.utm_source ?? null,
        utm_campaign: input.launchContext?.utm_campaign ?? null,
        utm_content: input.launchContext?.utm_content ?? null,
        utm_medium: input.launchContext?.utm_medium ?? null,
        ad_id: input.launchContext?.ad_id ?? null,
        campaign_id: input.launchContext?.campaign_id ?? null,
        launch_context: input.launchContext ?? {},
      },
    },
  });

  if (error || !data.user) {
    return { user: null, error: friendlyError(error?.message, genericRegisterError) };
  }

  const profileResult = await upsertProfile({
    id: data.user.id,
    email,
    fullName: name,
  });

  if (profileResult.error) {
    return { user: null, error: profileResult.error };
  }

  return { user: await getCurrentUser() };
}

export async function getCurrentUser(): Promise<AuthUserProfile | null> {
  if (!isSupabaseAuthEnabled() || !supabase) {
    return mapMockUser(getMockUser());
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", data.user.id)
    .maybeSingle();

  return mapSupabaseProfile(data.user, profile);
}

export async function signOut() {
  if (isSupabaseAuthEnabled() && supabase) {
    await supabase.auth.signOut();
  }
  clearMockAuth();
}

export async function sendPasswordReset(input: {
  email: string;
  redirectTo?: string;
}): Promise<{ message?: string; error?: string }> {
  const email = input.email.trim();

  if (!email) {
    return { error: "Enter your email." };
  }

  if (!isSupabaseAuthEnabled() || !supabase) {
    return { message: resetPasswordSuccessMessage };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: input.redirectTo,
  });

  if (error) {
    return { error: friendlyError(error.message, genericResetError) };
  }

  return { message: resetPasswordSuccessMessage };
}

export async function updatePassword(password: string): Promise<{ error?: string }> {
  if (!password || password.length < 8) {
    return { error: "Use at least 8 characters." };
  }

  if (!isSupabaseAuthEnabled() || !supabase) {
    return {};
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: friendlyError(error.message, genericUpdatePasswordError) };

  return {};
}

export async function upsertProfile(input: {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string | null;
}): Promise<{ error?: string }> {
  if (!isSupabaseAuthEnabled() || !supabase) return {};

  const { error } = await supabase.from("profiles").upsert({
    id: input.id,
    email: input.email,
    full_name: input.fullName ?? null,
    avatar_url: input.avatarUrl ?? null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { error: "Account created, but we could not save your profile. Please try signing in again." };
  }

  return {};
}
