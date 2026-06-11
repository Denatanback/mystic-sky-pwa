"use client";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sendPasswordReset, signIn, signInWithOAuth, type OAuthProvider } from "@/lib/auth/authAdapter";
import { syncPendingClaimToServer } from "@/lib/claims/claimFlow";
import { LangToggle } from "@/components/app-shell/LangToggle";
import { PolicyFooterLinks } from "@/components/legal/PolicyFooterLinks";
import { useLang } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLang();
  const l = t.login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [returnTo, setReturnTo] = useState("/home");
  const [legalReturnTo, setLegalReturnTo] = useState("/login");
  const [socialLoading, setSocialLoading] = useState<OAuthProvider | null>(null);

  useEffect(() => {
    setLegalReturnTo(`${window.location.pathname}${window.location.search}`);
    const params = new URLSearchParams(window.location.search);
    const value = params.get("returnTo");
    if (value && value.startsWith("/") && !value.startsWith("//") && !value.includes("http://") && !value.includes("https://")) {
      setReturnTo(value);
    }

    const error = params.get("error");
    if (error === "oauth_failed") setAuthError("Could not start Google sign-in. Please try again.");
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setAuthError("");
    const result = await signIn({ email, password });
    setLoading(false);
    if (result.error) {
      setAuthError(result.error);
      return;
    }
    // Persist any pending preland claim from localStorage to the server
    await syncPendingClaimToServer();
    router.push(returnTo);
  }

  async function handleSocialSignIn(provider: OAuthProvider) {
    setAuthError("");
    setSocialLoading(provider);
    const result = await signInWithOAuth(provider, returnTo);
    if (result.error) {
      setAuthError(result.error);
      setSocialLoading(null);
    }
  }

  function openResetForm() {
    setResetEmail(email.trim());
    setResetError("");
    setResetSuccess("");
    setResetOpen(true);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    setResetError("");
    setResetSuccess("");

    const result = await sendPasswordReset({
      email: resetEmail,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setResetLoading(false);
    if (result.error) {
      setResetError(result.error);
      return;
    }
    setResetSuccess(result.message ?? "If an account exists for this email, we’ll send a reset link.");
  }

  return (
<main className="app welcome-bg no-nav" style={{ padding: "0 18px 40px" }}>
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* Top controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18 }}>
          <Link href="/welcome" style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text)",
          }} aria-label="Nazad">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
            </svg>
          </Link>
          <LangToggle />
        </div>

        {/* Logo — normal flow, centered, fully visible */}
        <div className="auth-brand">
          <Logo variant="auth" priority />
        </div>

        {/* moon visual */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 160, position: "relative" }}>
          {[160, 124, 90].map((s, i) => (
            <div key={i} style={{
              position: "absolute", width: s, height: s, borderRadius: "50%",
              border: `1px solid rgba(216,168,95,${0.05 + i * 0.04})`,
            }} />
          ))}
          <div style={{
            width: 64, height: 64, borderRadius: "50%", position: "relative",
            background: "radial-gradient(circle at 38% 36%, rgba(180,130,255,.4), rgba(80,40,160,.6) 55%, rgba(20,10,50,.9))",
            border: "1px solid rgba(216,168,95,.4)",
            boxShadow: "0 0 0 10px rgba(216,168,95,.04), 0 0 30px rgba(140,70,220,.35)",
          }}>
            <div style={{
              position: "absolute", width: 52, height: 52, borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, rgba(60,20,100,.7), #07050f 70%)",
              right: -6, top: 4,
            }} />
            <div style={{
              position: "absolute", top: "28%", left: "20%",
              color: "var(--gold-2)", fontSize: 11,
              textShadow: "0 0 6px rgba(216,168,95,.8)",
            }}>✦</div>
          </div>
        </div>

        {/* title */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600,
            color: "var(--text)", lineHeight: 1.15, marginBottom: 8,
          }}>{l.title}</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
            {l.subtitle}
          </p>
        </div>

        {/* form card */}
        <div style={{
          background: "rgba(12,10,32,.82)",
          border: "1px solid rgba(216,168,95,.18)",
          borderRadius: 24, backdropFilter: "blur(12px)",
          padding: "22px 20px",
          boxShadow: "0 20px 50px rgba(0,0,0,.4)",
        }}>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* email */}
            <div>
              <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 6, letterSpacing: ".04em" }}>Email</label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,.05)",
                border: "1px solid var(--line-soft)",
                borderRadius: "var(--radius-sm)",
                padding: "12px 14px",
                transition: "border-color .2s",
              }}
              onFocus={() => {}} >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "var(--text)", fontSize: 14, fontFamily: "var(--font-ui)",
                  }}
                />
              </div>
            </div>

            {/* password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 12, color: "var(--muted)", letterSpacing: ".04em" }}>{l.passwordLabel}</label>
                <button
                  type="button"
                  onClick={openResetForm}
                  style={{
                    background: "transparent", border: "none", padding: "0 2px",
                    fontSize: 12, color: "var(--gold)", opacity: .86, cursor: "pointer",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  {l.forgotPassword}
                </button>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,.05)",
                border: "1px solid var(--line-soft)",
                borderRadius: "var(--radius-sm)",
                padding: "12px 14px",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "var(--text)", fontSize: 14, fontFamily: "var(--font-ui)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ background: "none", border: "none", color: "var(--muted-2)", cursor: "pointer", padding: 0 }}
                  aria-label={showPass ? t.register.hidePassword : t.register.showPassword}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* submit */}
            {authError && (
              <p style={{ color: "var(--danger)", fontSize: 12, lineHeight: 1.4, margin: 0 }}>
                {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 52, borderRadius: 999,
                background: loading ? "rgba(128,64,192,.5)" : "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
                color: "#fff", fontSize: 16, fontWeight: 600,
                fontFamily: "var(--font-ui)", letterSpacing: ".02em",
                border: "none", cursor: loading ? "default" : "pointer",
                boxShadow: loading ? "none" : "0 8px 28px rgba(90,32,144,.45), inset 0 1px 0 rgba(255,255,255,.12)",
                transition: "all .2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading ? l.submitting : <>{l.submit} <span>→</span></>}
            </button>

            {/* divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--muted-2)", fontSize: 12 }}>
              <span style={{ height: 1, background: "var(--line)", flex: 1 }} />
              {l.orSignInWith}
              <span style={{ height: 1, background: "var(--line)", flex: 1 }} />
            </div>

            {/* social */}
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={socialLoading !== null}
              style={{
                height: 46,
                borderRadius: 999,
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.12)",
                color: "var(--text)",
                fontSize: 14,
                fontWeight: 700,
                cursor: socialLoading ? "default" : "pointer",
                transition: "background .2s",
              }}
            >
              {socialLoading === "google" ? "Connecting..." : "Continue with Google"}
            </button>

          </form>
          {resetOpen && (
            <form
              onSubmit={handleResetPassword}
              style={{
                marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(216,168,95,.14)",
                display: "flex", flexDirection: "column", gap: 12,
              }}
            >
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                  Reset password
                </h2>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                  Enter your email and we’ll send a secure reset link.
                </p>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 6, letterSpacing: ".04em" }}>Email</label>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid var(--line-soft)",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 14px",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                  </svg>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    style={{
                      flex: 1, background: "transparent", border: "none", outline: "none",
                      color: "var(--text)", fontSize: 14, fontFamily: "var(--font-ui)",
                    }}
                  />
                </div>
              </div>
              {resetError && <p style={{ color: "var(--danger)", fontSize: 12, lineHeight: 1.4, margin: 0 }}>{resetError}</p>}
              {resetSuccess && <p style={{ color: "var(--gold-2)", fontSize: 12, lineHeight: 1.45, margin: 0 }}>{resetSuccess}</p>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                <button
                  type="submit"
                  disabled={resetLoading}
                  style={{
                    height: 46, borderRadius: 999, border: "none",
                    background: resetLoading ? "rgba(128,64,192,.5)" : "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
                    color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-ui)",
                    cursor: resetLoading ? "default" : "pointer",
                  }}
                >
                  {resetLoading ? "Sending..." : "Send reset link"}
                </button>
                <button
                  type="button"
                  onClick={() => setResetOpen(false)}
                  style={{
                    height: 46, borderRadius: 999, padding: "0 16px",
                    border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)",
                    color: "var(--muted)", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-ui)",
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          )}
        </div>
        <PolicyFooterLinks returnTo={legalReturnTo} />

      </div>
    </main>
  );
}
