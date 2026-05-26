"use client";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LangToggle } from "@/components/app-shell/LangToggle";
import { useLang } from "@/lib/i18n";

export default function WelcomePage() {
  const { t } = useLang();
  const w = t.welcome;

  const stats = [
    { n: "5", label: w.directions },
    { n: "7", label: w.minDay },
    { n: "\u221e", label: w.personalPath },
  ];

  return (
    <main className="app welcome-bg no-nav" style={{ padding: "0 18px 40px" }}>
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* Top bar: lang toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16 }}>
          <LangToggle />
        </div>

        {/* Logo — normal flow, centered, fully visible */}
        <div className="auth-brand">
          <Logo variant="hero" priority />
        </div>

        {/* Tagline */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 400,
            lineHeight: 1.15, color: "var(--text)", marginBottom: 12,
            whiteSpace: "pre-line",
          }}>
            {w.tagline}
          </h1>
          <p style={{
            fontSize: 14, color: "var(--muted)", lineHeight: 1.65,
            maxWidth: 300, margin: "0 auto",
          }}>
            {w.subtitle}
          </p>
        </div>

        {/* CTA */}
        <div style={{
          borderRadius: 24, border: "1px solid rgba(216,168,95,.2)",
          background: "rgba(12,10,32,.8)", backdropFilter: "blur(12px)",
          padding: "22px 20px", display: "flex", flexDirection: "column", gap: 12,
          boxShadow: "0 20px 50px rgba(0,0,0,.4)",
        }}>
          <Link href="/register" style={{
            height: 52, borderRadius: 999, display: "flex",
            alignItems: "center", justifyContent: "center", gap: 10,
            background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
            color: "#fff", fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500,
            letterSpacing: ".03em",
            boxShadow: "0 8px 28px rgba(90,32,144,.5), inset 0 1px 0 rgba(255,255,255,.12)",
            textDecoration: "none",
          }}>
            {w.createAccount} <span>&#8594;</span>
          </Link>
          <Link href="/login" style={{
            height: 48, borderRadius: 999, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "transparent", color: "var(--gold-2)",
            border: "1px solid rgba(216,168,95,.35)",
            fontSize: 15, fontWeight: 500,
            textDecoration: "none",
          }}>
            {w.haveAccount}
          </Link>
          <p style={{
            textAlign: "center", color: "var(--muted-2)",
            fontSize: 12, lineHeight: 1.4, whiteSpace: "pre-line",
          }}>
            {w.guestNote}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              padding: "13px 8px", borderRadius: 16, textAlign: "center",
              border: "1px solid rgba(216,168,95,.12)",
              background: "rgba(12,10,30,.6)",
            }}>
              <strong style={{
                display: "block", color: "var(--gold-2)", fontSize: 22,
                fontFamily: "var(--font-serif)", fontWeight: 400,
              }}>{s.n}</strong>
              <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, display: "block" }}>{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
