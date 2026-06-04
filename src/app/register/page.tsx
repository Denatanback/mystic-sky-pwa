"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { LangToggle } from "@/components/app-shell/LangToggle";
import { PolicyFooterLinks } from "@/components/legal/PolicyFooterLinks";
import { existingAccountErrorMessage, register, signInWithOAuth, type OAuthProvider } from "@/lib/auth/authAdapter";
import { cleanLaunchContext, saveLaunchContext } from "@/lib/launch/launchContext";
import { parsePrelandContext, savePrelandContext, type PrelandContext } from "@/lib/funnel/prelandContext";
import { getCurrentProfile } from "@/lib/profile/currentProfile";

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

const btnPrimary: React.CSSProperties = {
  height: 52,
  borderRadius: 999,
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
  fontFamily: "var(--font-ui)",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 8px 28px rgba(90,32,144,.45), inset 0 1px 0 rgba(255,255,255,.12)",
};

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [launchContext, setLaunchContext] = useState(() => cleanLaunchContext({}));
  const [prelandContext, setPrelandContext] = useState<PrelandContext>({});
  const [legalReturnTo, setLegalReturnTo] = useState("/register");
  const [oauthReturnTo, setOauthReturnTo] = useState("/onboarding");
  const [socialLoading, setSocialLoading] = useState<OAuthProvider | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setLegalReturnTo(`${window.location.pathname}${window.location.search}`);
    const returnTo = params.get("returnTo");
    if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//") && !returnTo.includes("http://") && !returnTo.includes("https://")) {
      setOauthReturnTo(returnTo);
    }
    const context = cleanLaunchContext({
      source: params.get("source"),
      funnel: params.get("funnel"),
      result: params.get("result"),
      gender: params.get("gender"),
      animal: params.get("animal"),
      archetype: params.get("archetype"),
      element: params.get("element"),
      answer: params.get("answer"),
      utm_source: params.get("utm_source"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_medium: params.get("utm_medium"),
      ad_id: params.get("ad_id"),
      campaign_id: params.get("campaign_id"),
    });
    const preland = parsePrelandContext(params);
    setLaunchContext(context);
    setPrelandContext(preland);
    saveLaunchContext(context);
    savePrelandContext(preland);

    void getCurrentProfile().then((profile) => {
      if (!profile) return;
      router.replace(profile.onboardingCompleted ? "/home" : "/onboarding");
    });
  }, [router]);

  async function submit() {
    setError("");
    if (!name.trim()) return setError("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email.");
    if (password.length < 8) return setError("Use at least 8 characters for password.");

    setLoading(true);
    savePrelandContext(prelandContext);
    const result = await register({ name, email, password, launchContext });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    saveLaunchContext(launchContext);
    savePrelandContext(prelandContext);
    router.push("/onboarding");
    router.refresh();
  }

  function legalHref(path: string) {
    return `${path}?returnTo=${encodeURIComponent(legalReturnTo)}`;
  }

  async function handleSocialSignUp(provider: OAuthProvider) {
    setError("");
    setSocialLoading(provider);
    saveLaunchContext(launchContext);
    savePrelandContext(prelandContext);
    const result = await signInWithOAuth(provider, oauthReturnTo);
    if (result.error) {
      setError(result.error);
      setSocialLoading(null);
    }
  }

  return (
    <main className="app welcome-bg no-nav" style={{ padding: "0 18px 40px" }}>
      <StarField />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18 }}>
          <Link href="/welcome" aria-label="Back" style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", display: "grid", placeItems: "center", color: "var(--text)" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m0 0 7 7m-7-7 7-7" /></svg>
          </Link>
          <LangToggle />
        </div>

        <div className="auth-brand"><Logo variant="auth" /></div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Create your account</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 22 }}>Start with email. Your birth data and focus areas come next.</p>

        <div style={{ background: "rgba(12,10,32,.82)", border: "1px solid rgba(216,168,95,.18)", borderRadius: 24, backdropFilter: "blur(12px)", padding: "22px 20px", display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "var(--muted)" }}>
            Name
            <div style={inputRow}><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputBase} /></div>
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "var(--muted)" }}>
            Email
            <div style={inputRow}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={inputBase} /></div>
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "var(--muted)" }}>
            Password
            <div style={inputRow}>
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" style={inputBase} />
              <button type="button" onClick={() => setShowPass((value) => !value)} aria-label={showPass ? "Hide password" : "Show password"} style={{ border: "none", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}><EyeIcon open={showPass} /></button>
            </div>
          </label>

          <button type="button" onClick={submit} disabled={loading} style={{ ...btnPrimary, opacity: loading ? .7 : 1 }}>{loading ? "Creating..." : "Create account"}</button>

          {error && (
            <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
              <p style={{ color: "var(--danger)", fontSize: 12, lineHeight: 1.45, textAlign: "center", margin: 0 }}>{error}</p>
              {error === existingAccountErrorMessage && (
                <Link href="/login" style={{ color: "var(--gold-2)", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
                  Sign in
                </Link>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => handleSocialSignUp("google")}
            disabled={socialLoading !== null}
            style={{
              height: 44,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.12)",
              background: "rgba(255,255,255,.04)",
              color: "var(--text)",
              fontSize: 14,
              fontWeight: 700,
              cursor: socialLoading ? "default" : "pointer",
            }}
          >
            {socialLoading === "google" ? "Connecting..." : "Sign up with Google"}
          </button>
          <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.5, textAlign: "center" }}>
            By creating an account, you agree to eLuna&apos;s{" "}
            <Link href={legalHref("/terms")} style={{ color: "var(--gold-2)", fontWeight: 800, textDecoration: "none" }}>Terms of Use</Link>
            {" "}and acknowledge the{" "}
            <Link href={legalHref("/privacy")} style={{ color: "var(--gold-2)", fontWeight: 800, textDecoration: "none" }}>Privacy Policy</Link>
            .
          </p>
          <PolicyFooterLinks returnTo={legalReturnTo} />
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted-2)", marginTop: 20 }}>
          Already have an account? <Link href="/login" style={{ color: "var(--gold-2)", fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </main>
  );
}
