const PROFILE_KEY = "mysticSky.userProfile";
const AUTH_KEY    = "mysticSky.isAuthenticated";

export type MockUserProfile = {
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthTimeUnknown: boolean;
  birthPlace: string;
  createdAt: string;
};

export function saveMockUser(profile: MockUserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getMockUser(): MockUserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as MockUserProfile; } catch { return null; }
}

export function setMockAuthenticated(): void {
  localStorage.setItem(AUTH_KEY, "true");
}

export function isMockAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function clearMockAuth(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

export function setMockUser(partial: { name: string; email: string }): void {
  const profile: MockUserProfile = {
    name: partial.name,
    email: partial.email,
    birthDate: "",
    birthTime: "",
    birthTimeUnknown: false,
    birthPlace: "",
    createdAt: new Date().toISOString(),
  };
  saveMockUser(profile);
  setMockAuthenticated();
}
