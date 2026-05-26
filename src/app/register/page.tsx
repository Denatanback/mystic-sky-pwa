"use client";
import { Logo } from "@/components/Logo";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StarField } from "@/components/app-shell/StarField";
import { register } from "@/lib/auth/authAdapter";
import { LangToggle } from "@/components/app-shell/LangToggle";
import { clearProgress } from "@/lib/nodeProgress";
import { useLang } from "@/lib/i18n";
import type { PlaceSuggestion } from "@/lib/locations/worldCitySearch";

// ─── Masking helpers ─────────────────────────────────────────────────

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

function generateSecurePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "@#!%*?&";
  const all = upper + lower + digits + special;
  const arr = new Uint8Array(14);
  crypto.getRandomValues(arr);
  const mandatory = [
    upper[arr[0] % upper.length],
    lower[arr[1] % lower.length],
    digits[arr[2] % digits.length],
    special[arr[3] % special.length],
  ];
  const rest = Array.from(arr.slice(4)).map(b => all[b % all.length]);
  const combined = [...mandatory, ...rest];
  const shuffle = new Uint8Array(combined.length);
  crypto.getRandomValues(shuffle);
  for (let i = combined.length - 1; i > 0; i--) {
    const j = shuffle[i] % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join("");
}

// ─── Sub-components ──────────────────────────────────────────────────

function FieldWrap({ children, label, hint, error }: {
  children: React.ReactNode; label: string; hint?: string; error?: string | null;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label style={{ fontSize: 12, color: "var(--muted)", letterSpacing: ".04em" }}>{label}</label>
        {hint && <span style={{ fontSize: 12, color: "var(--gold)", opacity: .8 }}>{hint}</span>}
      </div>
      {children}
      {error && (
        <span style={{ fontSize: 11, color: "var(--danger)", marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

const inputRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10,
  background: "rgba(255,255,255,.05)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-sm)",
  padding: "12px 14px",
  transition: "border-color .2s",
};

const inputBase: React.CSSProperties = {
  flex: 1, background: "transparent", border: "none", outline: "none",
  color: "var(--text)", fontSize: 14, fontFamily: "var(--font-ui)",
};

const btnPrimary: React.CSSProperties = {
  height: 52, borderRadius: 999, marginTop: 4,
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff", fontSize: 16, fontWeight: 600,
  fontFamily: "var(--font-ui)", letterSpacing: ".02em",
  border: "none", cursor: "pointer",
  boxShadow: "0 8px 28px rgba(90,32,144,.45), inset 0 1px 0 rgba(255,255,255,.12)",
};

// ─── Page ────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLang();
  const r = t.register;

  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"female" | "male" | "">("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  // Step 2
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [birthTimeError, setBirthTimeError] = useState<string | null>(null);
  const [birthPlaceError, setBirthPlaceError] = useState<string | null>(null);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [citySuggestions, setCitySuggestions] = useState<PlaceSuggestion[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityQuerySearched, setCityQuerySearched] = useState(false);

  // Step 3
  const [selected, setSelected] = useState<string[]>(["astro", "practice"]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  function validateBirthDate(val: string): string | null {
    if (!val) return r.birthDateRequired;
    if (val.length < 10) return r.birthDateFull;
    const parts = val.split(".");
    if (parts.length !== 3) return r.birthDateFormat;
    const day = parseInt(parts[0], 10);
    const mon = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    const now = new Date().getFullYear();
    if (mon < 1 || mon > 12) return r.birthMonthRange;
    if (day < 1 || day > 31) return r.birthDayRange;
    if (year < 1900 || year > now) return `${r.birthYearRange} ${now}`;
    const d = new Date(year, mon - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== mon - 1 || d.getDate() !== day)
      return r.birthDateInvalid;
    return null;
  }

  function validateBirthTime(val: string): string | null {
    if (!val) return null;
    if (val.length < 5) return r.birthTimeFormat;
    const parts = val.split(":");
    if (parts.length !== 2) return r.birthTimeFormatHint;
    const hh = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10);
    if (hh < 0 || hh > 23) return r.birthHourRange;
    if (mm < 0 || mm > 59) return r.birthMinuteRange;
    return null;
  }

  function toggleDir(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  }

  function validateStep1(): boolean {
    let ok = true;
    if (!name.trim()) { setNameError(r.nameRequired); ok = false; } else setNameError(null);
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError(r.emailRequired); ok = false; } else setEmailError(null);
    if (password.length < 8) { setPassError(r.passwordMin); ok = false; } else setPassError(null);
    return ok;
  }

  function validateStep2(): boolean {
    let ok = true;
    const de = validateBirthDate(birthDate);
    if (de) { setBirthDateError(de); ok = false; } else setBirthDateError(null);
    if (!timeUnknown) {
      const te = validateBirthTime(birthTime);
      if (te) { setBirthTimeError(te); ok = false; } else setBirthTimeError(null);
    } else {
      setBirthTimeError(null);
    }
    if (!birthPlace.trim()) { setBirthPlaceError(r.birthPlaceRequired); ok = false; } else setBirthPlaceError(null);
    return ok;
  }

  function goStep2() { if (validateStep1()) setStep(2); }
  function goStep3() { if (validateStep2()) setStep(3); }

  function handleGeneratePassword() {
    const p = generateSecurePassword();
    setPassword(p);
    setShowPass(true);
    setPassError(null);
  }

  useEffect(() => {
    const query = birthPlace.trim();

    if (!cityDropdownOpen || query.length < 2) {
      setCitySuggestions([]);
      setCityLoading(false);
      setCityQuerySearched(false);
      setActiveCityIndex(0);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setCityLoading(true);
      setCityQuerySearched(false);

      try {
        const response = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const places = response.ok ? ((await response.json()) as PlaceSuggestion[]) : [];
        setCitySuggestions(places);
        setActiveCityIndex(0);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setCitySuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCityLoading(false);
          setCityQuerySearched(true);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [birthPlace, cityDropdownOpen]);

  function selectBirthCity(place: PlaceSuggestion) {
    setBirthPlace(place.label);
    setBirthPlaceError(null);
    setCityDropdownOpen(false);
    setActiveCityIndex(0);
  }

  async function finish() {
    clearProgress(); // fresh start for new account

    const [day, month, year] = birthDate.split(".");
    const birthDateIso = day && month && year ? `${year}-${month}-${day}` : "";

    setLoading(true);
    setAuthError("");
    const result = await register({
      name,
      email,
      password,
      gender,
      birthDate: birthDateIso || birthDate,
      birthTime,
      birthTimeUnknown: timeUnknown,
      birthPlace,
    });
    setLoading(false);
    if (result.error) {
      setAuthError(result.error);
      return;
    }
    router.push("/home");
    router.refresh();
  }

  const pageStyle: React.CSSProperties = {
    padding: "0 18px 40px",
  };

  const errBorder = "1px solid rgba(206,116,109,.55)";
  const glassCard: React.CSSProperties = {
    background: "rgba(12,10,32,.82)", border: "1px solid rgba(216,168,95,.18)",
    borderRadius: 24, backdropFilter: "blur(12px)", padding: "22px 20px",
    display: "flex", flexDirection: "column", gap: 14,
  };

  return (
    <main className="app welcome-bg no-nav" style={pageStyle}>
      <StarField />
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* Nav bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18 }}>
          {step === 1 ? (
            <Link href="/welcome" style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)",
            }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
              </svg>
            </Link>
          ) : (
            <button onClick={() => setStep(s => s - 1)} style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", cursor: "pointer",
            }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
              </svg>
            </button>
          )}
          <LangToggle />
        </div>

        {/* Logo — normal flow, centered, fully visible */}
        <div className="auth-brand">
          <Logo variant="auth" />
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", gap: 6, marginTop: 20, marginBottom: 32 }}>
          {r.stepLabels.map((lbl, i) => {
            const done = i + 1 < step;
            const active = i + 1 === step;
            return (
              <div key={lbl} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{
                  height: 3, borderRadius: 99,
                  background: done || active ? "var(--gold)" : "rgba(255,255,255,.1)",
                  opacity: done ? .6 : 1,
                }} />
                <span style={{
                  fontSize: 10, color: active ? "var(--gold)" : "var(--muted-2)",
                  fontWeight: active ? 600 : 400, letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}>{lbl}</span>
              </div>
            );
          })}
        </div>

        {/* === STEP 1 === */}
        {step === 1 && (
          <>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
              {r.step1Title}
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
              {r.step1Sub}
            </p>
            <div style={glassCard}>
              <FieldWrap label={r.nameLabel} error={nameError}>
                <div style={{ ...inputRow, ...(nameError ? { border: errBorder } : {}) }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    value={name}
                    onChange={e => { setName(e.target.value); if (nameError) setNameError(null); }}
                    onBlur={() => { if (!name.trim()) setNameError(r.nameRequired); }}
                    placeholder={r.namePlaceholder}
                    style={inputBase}
                  />
                </div>
              </FieldWrap>

              {/* Gender toggle */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, color: "var(--muted)", letterSpacing: ".04em" }}>{r.genderLabel}</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {(["female", "male"] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      style={{
                        padding: "11px 0", borderRadius: "var(--radius-sm)",
                        border: `1px solid ${gender === g ? "rgba(216,168,95,.55)" : "var(--line-soft)"}`,
                        background: gender === g ? "rgba(216,168,95,.12)" : "rgba(255,255,255,.04)",
                        color: gender === g ? "var(--gold-2)" : "var(--muted)",
                        fontSize: 13, fontWeight: gender === g ? 600 : 400,
                        fontFamily: "var(--font-ui)", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                        transition: "all .18s",
                      }}
                    >
                      {g === "female" ? r.female : r.male}
                    </button>
                  ))}
                </div>
              </div>

              <FieldWrap label="Email" error={emailError}>
                <div style={{ ...inputRow, ...(emailError ? { border: errBorder } : {}) }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                    onBlur={() => { if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setEmailError(r.emailRequired); }}
                    placeholder="you@email.com"
                    style={inputBase}
                  />
                </div>
              </FieldWrap>

              <FieldWrap label={r.passwordLabel} error={passError}>
                <div style={{ ...inputRow, ...(passError ? { border: errBorder } : {}), gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); if (passError) setPassError(null); }}
                    onBlur={() => { if (password.length > 0 && password.length < 8) setPassError(r.passwordMin); }}
                    placeholder={r.passwordPlaceholder}
                    style={{ ...inputBase, letterSpacing: showPass ? "normal" : password ? ".12em" : "normal" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", flexShrink: 0, display: "flex", alignItems: "center" }}
                    aria-label={showPass ? r.hidePassword : r.showPassword}
                  >
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  style={{
                    alignSelf: "flex-start", background: "none",
                    border: "1px solid rgba(216,168,95,.3)", borderRadius: 999,
                    cursor: "pointer", padding: "5px 12px",
                    color: "var(--gold)", fontSize: 11, fontFamily: "var(--font-ui)",
                    display: "flex", alignItems: "center", gap: 5, marginTop: 2,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  {r.generatePassword}
                </button>
              </FieldWrap>

              <button onClick={goStep2} style={{ ...btnPrimary, width: "100%" }}>
                {r.continue}
              </button>
            </div>
            <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted-2)", marginTop: 20 }}>
              {r.haveAccount}{" "}
              <Link href="/login" style={{ color: "var(--gold-2)", fontWeight: 500 }}>{r.signIn}</Link>
            </p>
          </>
        )}

        {/* === STEP 2 === */}
        {step === 2 && (
          <>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
              {r.step2Title}
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
              {r.step2Sub}
            </p>
            <div style={glassCard}>
              <FieldWrap label={r.birthDateLabel} error={birthDateError}>
                <div style={{ ...inputRow, ...(birthDateError ? { border: errBorder } : {}) }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v4M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" />
                  </svg>
                  <input
                    value={birthDate}
                    onChange={e => { const fmt = formatBirthDateInput(e.target.value); setBirthDate(fmt); if (birthDateError) setBirthDateError(null); }}
                    onBlur={() => setBirthDateError(validateBirthDate(birthDate))}
                    placeholder={r.birthDatePlaceholder}
                    inputMode="numeric"
                    style={inputBase}
                    maxLength={10}
                  />
                </div>
              </FieldWrap>

              <FieldWrap label={r.birthTimeLabel} error={birthTimeError}>
                <div style={{ ...inputRow, ...(birthTimeError ? { border: errBorder } : {}), opacity: timeUnknown ? .45 : 1 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                  <input
                    value={birthTime}
                    onChange={e => { const fmt = formatBirthTimeInput(e.target.value); setBirthTime(fmt); if (birthTimeError) setBirthTimeError(null); }}
                    onBlur={() => { if (!timeUnknown) setBirthTimeError(validateBirthTime(birthTime)); }}
                    placeholder={r.birthTimePlaceholder}
                    inputMode="numeric"
                    disabled={timeUnknown}
                    style={inputBase}
                    maxLength={5}
                  />
                  <button
                    type="button"
                    onClick={() => { setTimeUnknown(v => !v); setBirthTimeError(null); }}
                    style={{
                      flexShrink: 0, background: "none", border: "none", cursor: "pointer",
                      fontSize: 11, color: timeUnknown ? "var(--gold)" : "var(--muted-2)",
                      fontFamily: "var(--font-ui)", padding: 0, opacity: 1,
                    }}
                  >
                    {timeUnknown ? r.birthTimeUnknownActive : r.birthTimeUnknown}
                  </button>
                </div>
                {!birthTimeError && !timeUnknown && (
                  <span style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 1 }}>
                    {r.birthTimeNote}
                  </span>
                )}
              </FieldWrap>

              <FieldWrap label={r.birthPlaceLabel} error={birthPlaceError}>
                <div style={{ position: "relative" }}>
                  <div style={{ ...inputRow, ...(birthPlaceError ? { border: errBorder } : {}) }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" /><circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <input
                      value={birthPlace}
                      onChange={e => {
                        setBirthPlace(e.target.value);
                        setCityDropdownOpen(true);
                        setActiveCityIndex(0);
                        if (birthPlaceError) setBirthPlaceError(null);
                      }}
                      onFocus={() => setCityDropdownOpen(true)}
                      onBlur={() => {
                        window.setTimeout(() => setCityDropdownOpen(false), 120);
                        if (!birthPlace.trim()) setBirthPlaceError(r.birthPlaceRequired);
                      }}
                      onKeyDown={(e) => {
                        if (!cityDropdownOpen) return;
                        if (e.key === "Escape") {
                          setCityDropdownOpen(false);
                          return;
                        }
                        if (!citySuggestions.length) return;
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setActiveCityIndex((idx) => (idx + 1) % citySuggestions.length);
                        }
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setActiveCityIndex((idx) => (idx - 1 + citySuggestions.length) % citySuggestions.length);
                        }
                        if (e.key === "Enter") {
                          e.preventDefault();
                          selectBirthCity(citySuggestions[activeCityIndex]);
                        }
                      }}
                      placeholder={r.birthPlacePlaceholder}
                      style={inputBase}
                      role="combobox"
                      aria-expanded={cityDropdownOpen}
                      aria-autocomplete="list"
                    />
                  </div>
                  {cityDropdownOpen && birthPlace.trim().length >= 2 && (
                    <div
                      style={{
                        position: "relative", marginTop: 6,
                        maxHeight: 220, overflowY: "auto", zIndex: 40,
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid rgba(216,168,95,.24)",
                        background: "rgba(10,8,28,.98)",
                        boxShadow: "0 18px 40px rgba(0,0,0,.42)",
                        padding: 6,
                      }}
                      role="listbox"
                    >
                      {cityLoading && (
                        <div style={{ minHeight: 42, display: "flex", alignItems: "center", padding: "0 11px", color: "var(--muted)", fontSize: 13 }}>
                          Searching cities...
                        </div>
                      )}
                      {!cityLoading && citySuggestions.map((place, index) => (
                        <button
                          key={`${place.label}-${place.countryCode}-${index}`}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectBirthCity(place)}
                          style={{
                            width: "100%", minHeight: 50, border: "none", borderRadius: 10,
                            background: index === activeCityIndex ? "rgba(216,168,95,.12)" : "transparent",
                            color: index === activeCityIndex ? "var(--gold-2)" : "var(--text)",
                            display: "flex", flexDirection: "column", justifyContent: "center",
                            alignItems: "flex-start", padding: "7px 11px",
                            fontSize: 14, fontWeight: 600, textAlign: "left",
                            fontFamily: "var(--font-ui)", cursor: "pointer",
                          }}
                          role="option"
                          aria-selected={index === activeCityIndex}
                        >
                          <span>{place.city}</span>
                          <span style={{ color: "var(--muted-2)", fontSize: 12, fontWeight: 500, marginTop: 2 }}>
                            {[place.region, place.country].filter(Boolean).join(", ")}
                          </span>
                        </button>
                      ))}
                      {!cityLoading && cityQuerySearched && citySuggestions.length === 0 && (
                        <div style={{ minHeight: 46, display: "flex", alignItems: "center", padding: "0 11px", color: "var(--muted)", fontSize: 13, lineHeight: 1.4 }}>
                          Keep typing or enter your city manually
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {!birthPlaceError && (
                  <span style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 1 }}>
                    {r.birthPlaceNote}
                  </span>
                )}
              </FieldWrap>

              <button onClick={goStep3} style={{ ...btnPrimary, width: "100%" }}>
                {r.continue}
              </button>
            </div>
          </>
        )}

        {/* === STEP 3 === */}
        {step === 3 && (
          <>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
              {r.step3Title}
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
              {r.step3Sub}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {r.directions.map(d => {
                const active = selected.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleDir(d.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "18px 20px",
                      minHeight: 96,
                      background: active ? "rgba(14,8,32,.85)" : "rgba(14,8,32,.62)",
                      border: `1px solid ${active ? "rgba(128,64,192,.60)" : "rgba(255,214,130,.18)"}`,
                      borderRadius: 24,
                      cursor: "pointer", transition: "all .18s",
                      textAlign: "left", fontFamily: "var(--font-ui)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      boxShadow: active ? "0 0 20px rgba(128,64,192,.15)" : "none",
                      overflow: "visible",
                      width: "100%",
                    }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: 18, flexShrink: 0,
                      background: active ? "rgba(128,64,192,.25)" : "rgba(255,255,255,.06)",
                      border: `1px solid ${active ? "rgba(216,168,95,.40)" : "rgba(255,255,255,.1)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26, transition: "all .18s",
                    }}>
                      {d.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: active ? "var(--text)" : "var(--muted)", marginBottom: 2 }}>{d.label}</div>
                      <div style={{ fontSize: 12, color: "var(--muted-2)" }}>{d.sub}</div>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${active ? "var(--gold)" : "rgba(255,255,255,.2)"}`,
                      background: active ? "var(--gold)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all .18s",
                    }}>
                      {active && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#07050f" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setStep(4)} style={{ ...btnPrimary, width: "100%", marginTop: 20 }}>
              {r.continue}
            </button>
          </>
        )}

        {/* === STEP 4 === */}
        {step === 4 && (
          <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 80, position: "relative" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "radial-gradient(circle at 38% 36%, rgba(180,130,255,.45), rgba(80,40,160,.65) 55%, rgba(20,10,50,.95))",
                border: "2px solid rgba(216,168,95,.45)",
                boxShadow: "0 0 40px rgba(140,70,220,.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, color: "var(--gold-2)",
              }}>
                ✦
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                {r.step4Title}
              </h1>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, maxWidth: 300, margin: "0 auto" }}>
                {r.step4Sub}
              </p>
            </div>

            <div style={{
              background: "rgba(12,10,32,.82)", border: "1px solid rgba(216,168,95,.18)",
              borderRadius: 24, backdropFilter: "blur(12px)", padding: "20px",
              display: "flex", flexDirection: "column", gap: 12, marginBottom: 16,
            }}>
              {[
                { icon: "🌙", title: r.startMap,            sub: r.startMapSub },
                { icon: "✦",  title: r.firstPath,           sub: r.firstPathSub },
                { icon: "📓", title: r.observationJournal,  sub: r.observationJournalSub },
              ].map(item => (
                <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(216,168,95,.10)", border: "1px solid rgba(216,168,95,.22)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 1 }}>{item.sub}</div>
                  </div>
                  <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              ))}
            </div>

            <button
              onClick={finish}
              disabled={loading}
              style={{
                width: "100%", height: 56, borderRadius: 999,
                background: loading ? "rgba(128,64,192,.5)" : "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
                color: "#fff", fontSize: 17, fontWeight: 600,
                fontFamily: "var(--font-ui)", letterSpacing: ".02em",
                border: "none", cursor: loading ? "default" : "pointer",
                boxShadow: "0 10px 32px rgba(90,32,144,.5), inset 0 1px 0 rgba(255,255,255,.15)",
              }}
            >
              {r.enterEluna}
            </button>
            {authError && (
              <p style={{ color: "var(--danger)", fontSize: 12, lineHeight: 1.45, marginTop: 10, textAlign: "center" }}>
                {authError}
              </p>
            )}
          </>
        )}

      </div>
    </main>
  );
}
