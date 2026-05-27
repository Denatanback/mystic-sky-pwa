"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import type { PlaceSuggestion } from "@/lib/locations/worldCitySearch";
import { getCurrentProfile, saveOnboardingData } from "@/lib/profile/currentProfile";

const focusOptions = ["Love & relationships", "Past life", "Money & abundance", "Purpose", "Intuition", "Body & energy", "Protection & grounding"];
const practiceOptions = ["Daily readings", "Affirmations", "Rituals", "Cards", "Reflection journal"];

const inputRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "rgba(255,255,255,.05)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-sm)",
  padding: "12px 14px",
};

const inputBase: React.CSSProperties = {
  flex: 1,
  background: "transparent",
  border: "none",
  outline: "none",
  color: "var(--text)",
  fontSize: 14,
  fontFamily: "var(--font-ui)",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(12,10,32,.82)",
  border: "1px solid rgba(216,168,95,.18)",
  borderRadius: 24,
  backdropFilter: "blur(12px)",
  padding: "20px",
};

function formatBirthDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + "." + digits.slice(2);
  return digits.slice(0, 2) + "." + digits.slice(2, 4) + "." + digits.slice(4);
}

function formatBirthTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + ":" + digits.slice(2);
}

function toIsoDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [day, month, year] = value.split(".");
  return day && month && year ? `${year}-${month}-${day}` : value;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [practicePreferences, setPracticePreferences] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<PlaceSuggestion[]>([]);
  const [cityLoading, setCityLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("mode") === "edit" ? "edit" : "new");
    if (params.get("step") === "birth") setStep(1);

    void getCurrentProfile().then((profile) => {
      if (!profile) {
        router.replace("/register");
        return;
      }
      if (profile.birthDate) setBirthDate(profile.birthDate.includes("-") ? profile.birthDate.split("-").reverse().join(".") : profile.birthDate);
      if (profile.birthTime) setBirthTime(profile.birthTime);
      if (profile.birthPlace) setBirthPlace(profile.birthPlace);
      setFocusAreas(profile.focusAreas);
      setPracticePreferences(profile.practicePreferences);
      if (profile.onboardingCompleted && params.get("mode") !== "edit") router.replace("/home");
    });
  }, [router]);

  useEffect(() => {
    const query = birthPlace.trim();
    if (!cityOpen || query.length < 2) {
      setCitySuggestions([]);
      setCityLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setCityLoading(true);
      try {
        const response = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        setCitySuggestions(response.ok ? ((await response.json()) as PlaceSuggestion[]) : []);
      } catch {
        setCitySuggestions([]);
      } finally {
        if (!controller.signal.aborted) setCityLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [birthPlace, cityOpen]);

  function toggleLimited(value: string, setter: (value: string[]) => void, current: string[], max: number) {
    if (current.includes(value)) setter(current.filter((item) => item !== value));
    else if (current.length < max) setter([...current, value]);
  }

  function validateBirth() {
    if (!birthDate || birthDate.length < 10) return "Enter date of birth.";
    if (!birthPlace.trim()) return "Enter place of birth.";
    return "";
  }

  async function finish() {
    const birthError = validateBirth();
    if (birthError) {
      setStep(1);
      setError(birthError);
      return;
    }
    if (focusAreas.length === 0) {
      setStep(2);
      setError("Choose at least one focus area.");
      return;
    }
    if (practicePreferences.length === 0) {
      setStep(3);
      setError("Choose at least one practice style.");
      return;
    }

    setSaving(true);
    const result = await saveOnboardingData({
      birthDate: toIsoDate(birthDate),
      birthTime,
      birthPlace,
      focusAreas,
      practicePreferences,
    });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/home");
    router.refresh();
  }

  return (
    <main className="app welcome-bg no-nav" style={{ padding: "0 18px 40px" }}>
      <StarField />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18 }}>
          <Link href={mode === "edit" ? "/profile" : "/register"} aria-label="Back" className="icon-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m0 0 7 7m-7-7 7-7" /></svg>
          </Link>
          <span style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800 }}>Step {step}/3</span>
        </div>
        <div className="auth-brand"><Logo variant="auth" /></div>

        {step === 1 && (
          <>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 31, color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>Build your personal chart</h1>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Your birth data powers your Sky Map, profile sign, and daily calculations.</p>
            <div style={{ ...cardStyle, display: "grid", gap: 14 }}>
              <label style={{ display: "grid", gap: 6, color: "var(--muted)", fontSize: 12 }}>Date of birth
                <div style={inputRow}><input value={birthDate} onChange={(e) => setBirthDate(formatBirthDateInput(e.target.value))} placeholder="DD.MM.YYYY" maxLength={10} inputMode="numeric" style={inputBase} /></div>
              </label>
              <label style={{ display: "grid", gap: 6, color: "var(--muted)", fontSize: 12 }}>Time of birth
                <div style={inputRow}><input value={birthTime} onChange={(e) => setBirthTime(formatBirthTimeInput(e.target.value))} placeholder="14:30" maxLength={5} inputMode="numeric" style={inputBase} /></div>
              </label>
              <label style={{ display: "grid", gap: 6, color: "var(--muted)", fontSize: 12 }}>Place of birth
                <div style={{ position: "relative" }}>
                  <div style={inputRow}><input value={birthPlace} onFocus={() => setCityOpen(true)} onChange={(e) => { setBirthPlace(e.target.value); setCityOpen(true); }} placeholder="New York, United States" style={inputBase} /></div>
                  {cityOpen && birthPlace.trim().length >= 2 && (
                    <div style={{ marginTop: 6, maxHeight: 220, overflowY: "auto", borderRadius: "var(--radius-sm)", border: "1px solid rgba(216,168,95,.24)", background: "rgba(10,8,28,.98)", padding: 6 }}>
                      {cityLoading && <div style={{ padding: 12, color: "var(--muted)", fontSize: 13 }}>Searching cities...</div>}
                      {!cityLoading && citySuggestions.map((place, index) => (
                        <button key={`${place.label}-${index}`} type="button" onClick={() => { setBirthPlace(place.label); setCityOpen(false); }} style={{ width: "100%", minHeight: 48, border: "none", borderRadius: 10, background: "transparent", color: "var(--text)", textAlign: "left", padding: "7px 11px", fontFamily: "var(--font-ui)" }}>
                          <span style={{ display: "block", fontWeight: 700 }}>{place.city}</span>
                          <span style={{ color: "var(--muted-2)", fontSize: 12 }}>{[place.region, place.country].filter(Boolean).join(", ")}</span>
                        </button>
                      ))}
                      {!cityLoading && citySuggestions.length === 0 && <div style={{ padding: 12, color: "var(--muted)", fontSize: 13 }}>Keep typing or enter your city manually</div>}
                    </div>
                  )}
                </div>
              </label>
              <button type="button" onClick={() => { const message = validateBirth(); if (message) setError(message); else { setError(""); setStep(2); } }} className="btn primary">Continue</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 31, color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>What are you here to explore?</h1>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Choose 1–3 focus areas.</p>
            <div style={{ display: "grid", gap: 10 }}>
              {focusOptions.map((option) => {
                const active = focusAreas.includes(option);
                return <button key={option} type="button" onClick={() => toggleLimited(option, setFocusAreas, focusAreas, 3)} style={{ ...cardStyle, minHeight: 58, color: active ? "var(--gold-2)" : "var(--text)", textAlign: "left", fontFamily: "var(--font-ui)", fontWeight: 800, background: active ? "rgba(216,168,95,.10)" : cardStyle.background }}>{option}</button>;
              })}
            </div>
            <button type="button" onClick={() => focusAreas.length ? (setError(""), setStep(3)) : setError("Choose at least one focus area.")} className="btn primary" style={{ marginTop: 16 }}>Continue</button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 31, color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>Choose your first practice style</h1>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Pick the rituals you want eLuna to start with.</p>
            <div style={{ display: "grid", gap: 10 }}>
              {practiceOptions.map((option) => {
                const active = practicePreferences.includes(option);
                return <button key={option} type="button" onClick={() => toggleLimited(option, setPracticePreferences, practicePreferences, 3)} style={{ ...cardStyle, minHeight: 58, color: active ? "var(--gold-2)" : "var(--text)", textAlign: "left", fontFamily: "var(--font-ui)", fontWeight: 800, background: active ? "rgba(216,168,95,.10)" : cardStyle.background }}>{option}</button>;
              })}
            </div>
            <button type="button" onClick={finish} disabled={saving} className="btn primary" style={{ marginTop: 16 }}>{saving ? "Saving..." : "Enter eLuna"}</button>
          </>
        )}

        {error && <p style={{ color: "var(--danger)", fontSize: 12, lineHeight: 1.5, textAlign: "center", marginTop: 12 }}>{error}</p>}
      </div>
    </main>
  );
}
