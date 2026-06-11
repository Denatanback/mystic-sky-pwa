"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import type { PlaceSuggestion } from "@/lib/locations/worldCitySearch";
import { getPrelandContext, getPrelandExperience, isPastLifePrelandContext, type PrelandExperience } from "@/lib/funnel/prelandContext";
import { getCurrentProfile, saveOnboardingData } from "@/lib/profile/currentProfile";
import { getZodiacSign, getZodiacSignByKey, ZODIAC_SIGNS, type ZodiacSignKey } from "@/lib/astrology/zodiac";

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

function getAgeFromBirthDate(value: string) {
  const isoDate = toIsoDate(value);
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) age -= 1;
  return age;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false);
  const [birthPlace, setBirthPlace] = useState("");
  const [showZodiacSelector, setShowZodiacSelector] = useState(false);
  const [zodiacOverride, setZodiacOverride] = useState(false);
  const [manualZodiac, setManualZodiac] = useState<ZodiacSignKey | "">("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [practicePreferences, setPracticePreferences] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<PlaceSuggestion[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [prelandExperience, setPrelandExperience] = useState<PrelandExperience | null>(null);
  const [isPastLifePreland, setIsPastLifePreland] = useState(false);
  const autoZodiac = birthDate.length === 10 ? getZodiacSign(birthDate) : getZodiacSign(null);
  const selectedZodiac = zodiacOverride && manualZodiac ? getZodiacSignByKey(manualZodiac) : autoZodiac;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("mode") === "edit" ? "edit" : "new");
    if (params.get("step") === "birth") setStep(1);
    const prelandContext = getPrelandContext();
    setPrelandExperience(getPrelandExperience(prelandContext));
    setIsPastLifePreland(isPastLifePrelandContext(prelandContext));

    void getCurrentProfile().then((profile) => {
      if (!profile) {
        router.replace("/register");
        return;
      }
      if (profile.birthDate) setBirthDate(profile.birthDate.includes("-") ? profile.birthDate.split("-").reverse().join(".") : profile.birthDate);
      if (profile.birthTime) setBirthTime(profile.birthTime);
      setBirthTimeUnknown(profile.birthTimeUnknown);
      if (profile.birthPlace) setBirthPlace(profile.birthPlace);
      if (profile.zodiacOverride && profile.zodiacSign.key !== "unknown") {
        setZodiacOverride(true);
        setShowZodiacSelector(true);
        setManualZodiac(profile.zodiacSign.key);
      }
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
    if (getZodiacSign(birthDate).key === "unknown") return "Enter a valid date to reveal your sign.";
    const age = getAgeFromBirthDate(birthDate);
    if (age === null || age < 0) return "Enter a valid date of birth.";
    if (age < 18) return "eLuna paid features are intended for adults. You must be at least 18 years old to continue.";
    if (!birthTimeUnknown && !birthTime.trim()) return "Add your birth time or choose 'I don’t know'.";
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
      birthTime: birthTimeUnknown ? null : birthTime,
      birthTimeUnknown,
      birthPlace,
      zodiacSign: zodiacOverride ? manualZodiac : "",
      zodiacOverride,
      focusAreas,
      practicePreferences,
    });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    // After profile setup, go to paywall if not yet paid; home if already active.
    try {
      const accessRes = await fetch("/api/access/status");
      if (accessRes.ok) {
        const accessJson = await accessRes.json() as { active: boolean; pendingClaim: { id: string } | null };
        if (accessJson.active) {
          router.push("/home");
          return;
        }
        router.push(accessJson.pendingClaim ? "/claim/paywall" : "/paywall");
        return;
      }
    } catch {
      // fail open
    }
    router.push("/paywall");
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
            {isPastLifePreland && (
              <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 18, background: "rgba(216,168,95,.08)", padding: "12px 14px", marginBottom: 14 }}>
                <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 5 }}>Quiz result saved</p>
                <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{prelandExperience?.label ?? "Past-life archetype: The Hidden Pattern"}</p>
                <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>Your Past Life result will be prepared after setup.</p>
              </div>
            )}
            <div style={{ ...cardStyle, display: "grid", gap: 14 }}>
              <label style={{ display: "grid", gap: 6, color: "var(--muted)", fontSize: 12 }}>Date of birth
                <div style={inputRow}><input value={birthDate} onChange={(e) => setBirthDate(formatBirthDateInput(e.target.value))} placeholder="DD.MM.YYYY" maxLength={10} inputMode="numeric" style={inputBase} /></div>
              </label>
              {birthDate.length === 10 && autoZodiac.key !== "unknown" && (
                <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 18, background: "linear-gradient(135deg, rgba(216,168,95,.10), rgba(128,64,192,.14))", padding: "13px 14px", display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--gold-2)", fontSize: 32, background: "rgba(216,168,95,.10)", border: "1px solid rgba(216,168,95,.30)", boxShadow: "0 0 18px rgba(128,64,192,.18)" }}>{selectedZodiac.glyph}</div>
                    <div>
                      <div style={{ color: "var(--muted-2)", fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>{zodiacOverride ? "Your selected sun sign" : "Your sun sign"}</div>
                      <div style={{ color: "var(--text)", fontSize: 17, fontWeight: 800, marginTop: 2 }}>{selectedZodiac.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: 12 }}>{zodiacOverride ? "Selected manually" : selectedZodiac.dateRange}</div>
                    </div>
                  </div>
                  <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.5, margin: 0 }}>{zodiacOverride ? "Your birth date stays saved for numerology and life path calculations." : "Based on your birth date"}</p>
                  <button type="button" onClick={() => setShowZodiacSelector((value) => !value)} style={{ justifySelf: "start", border: "none", background: "transparent", color: "var(--gold-2)", fontSize: 12, fontWeight: 800, padding: 0, fontFamily: "var(--font-ui)", cursor: "pointer" }}>
                    This isn’t my zodiac sign
                  </button>
                  <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, margin: 0 }}>Born near a zodiac transition? You can choose your sign manually.</p>
                  {showZodiacSelector && (
                    <label style={{ display: "grid", gap: 7, color: "var(--muted)", fontSize: 12 }}>Choose your zodiac sign manually
                      <select
                        value={manualZodiac}
                        onChange={(event) => {
                          const value = event.target.value as ZodiacSignKey;
                          setManualZodiac(value);
                          setZodiacOverride(Boolean(value));
                        }}
                        style={{ height: 46, borderRadius: 14, border: "1px solid rgba(216,168,95,.28)", background: "rgba(10,8,28,.95)", color: "var(--text)", padding: "0 12px", fontFamily: "var(--font-ui)", fontWeight: 700 }}
                      >
                        <option value="">Use calculated sign</option>
                        {ZODIAC_SIGNS.map((sign) => (
                          <option key={sign.key} value={sign.key}>{sign.glyph} {sign.name}</option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
              )}
              {birthDate.length === 10 && autoZodiac.key === "unknown" && (
                <p style={{ color: "var(--danger)", fontSize: 12, lineHeight: 1.45, margin: 0 }}>Enter a valid date to reveal your sign.</p>
              )}
              <label style={{ display: "grid", gap: 6, color: "var(--muted)", fontSize: 12 }}>Time of birth
                <div style={{ display: "grid", gap: 9 }}>
                  <div style={{ ...inputRow, opacity: birthTimeUnknown ? .55 : 1 }}>
                    <input value={birthTime} onChange={(e) => setBirthTime(formatBirthTimeInput(e.target.value))} disabled={birthTimeUnknown} placeholder="14:30" maxLength={5} inputMode="numeric" style={inputBase} />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBirthTimeUnknown((value) => {
                        if (!value) setBirthTime("");
                        return !value;
                      });
                    }}
                    style={{ justifySelf: "start", display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(216,168,95,.24)", borderRadius: 999, background: birthTimeUnknown ? "rgba(216,168,95,.14)" : "rgba(255,255,255,.04)", color: birthTimeUnknown ? "var(--gold-2)" : "var(--muted)", padding: "7px 11px", fontSize: 12, fontWeight: 800, fontFamily: "var(--font-ui)", cursor: "pointer" }}
                    aria-pressed={birthTimeUnknown}
                  >
                    <span style={{ width: 14, height: 14, borderRadius: 4, border: "1px solid rgba(216,168,95,.42)", display: "grid", placeItems: "center", fontSize: 10 }}>{birthTimeUnknown ? "✓" : ""}</span>
                    I don’t know my birth time
                  </button>
                  <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, margin: 0 }}>Optional. If you don’t remember it, we’ll still build your basic chart.</p>
                </div>
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
