import {
  clearMockAuth,
  getMockUser,
  saveMockUser,
  setMockAuthenticated,
  setMockUser,
  type MockUserProfile,
} from "@/lib/mockAuth";
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
  birthDate: string;
  birthTime: string;
  birthTimeUnknown: boolean;
  birthPlace: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

type AuthResult = {
  user: AuthUserProfile | null;
  error?: string;
};

const genericAuthError = "Не удалось выполнить вход. Проверь email и пароль.";
const genericRegisterError = "Не удалось создать аккаунт. Попробуй ещё раз.";

function friendlyError(message: string | undefined, fallback: string) {
  if (!message) return fallback;
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "Неверный email или пароль.";
  if (normalized.includes("user already registered")) return "Аккаунт с этим email уже существует.";
  if (normalized.includes("password")) return "Проверь пароль: он должен соответствовать требованиям безопасности.";
  if (normalized.includes("email")) return "Проверь email и попробуй снова.";
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
  return {
    id: user.id,
    name: profile?.full_name || metadataName || "Путник",
    email: user.email ?? "",
    gender: "",
    birthDate: "",
    birthTime: "",
    birthTimeUnknown: false,
    birthPlace: "",
    createdAt: new Date().toISOString(),
    avatarUrl: profile?.avatar_url ?? null,
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
    setMockUser({ name: rawName || "Путник", email });
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
      birthDate: input.birthDate,
      birthTime: input.birthTimeUnknown ? "" : input.birthTime,
      birthTimeUnknown: input.birthTimeUnknown,
      birthPlace: input.birthPlace.trim(),
      createdAt: new Date().toISOString(),
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
        birth_date: input.birthDate,
        birth_time: input.birthTimeUnknown ? "" : input.birthTime,
        birth_time_unknown: input.birthTimeUnknown,
        birth_place: input.birthPlace.trim(),
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
    return { error: "Аккаунт создан, но профиль не удалось сохранить. Попробуй войти ещё раз." };
  }

  return {};
}
