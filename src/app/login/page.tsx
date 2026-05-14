"use client";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StarField } from "@/components/app-shell/StarField";
import { createClient } from "@/lib/supabase/client";
import { LangToggle } from "@/components/app-shell/LangToggle";
import { useLang } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLang();
  const l = t.login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      router.push("/home");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
<main className="app welcome-bg no-nav" style={{ padding: "0 18px 40px" }}>
      <StarField />
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* back + brand */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18 }}>
          <Link href="/welcome" style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text)",
          }} aria-label="Назад">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
            </svg>
          </Link>
<Logo variant="auth" />
          <LangToggle />
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
            fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 400,
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
                    color: "var(--text)", fontSize: 14, fontFamily: "var(--font-sans)",
                  }}
                />
              </div>
            </div>

            {/* password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 12, color: "var(--muted)", letterSpacing: ".04em" }}>{l.passwordLabel}</label>
                <a href="#" style={{ fontSize: 12, color: "var(--gold)", opacity: .8 }}>{l.forgotPassword}</a>
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
                    color: "var(--text)", fontSize: 14, fontFamily: "var(--font-sans)",
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
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 52, borderRadius: 999,
                background: loading ? "rgba(128,64,192,.5)" : "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
                color: "#fff", fontSize: 16, fontWeight: 600,
                fontFamily: "var(--font-serif)", letterSpacing: ".03em",
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {["Google", "Apple"].map(s => (
                <button
                  key={s}
                  type="button"
                  style={{
                    height: 46, borderRadius: 999,
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid rgba(255,255,255,.12)",
                    color: "var(--muted)", fontSize: 14, fontWeight: 500,
                    cursor: "pointer", transition: "background .2s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}
