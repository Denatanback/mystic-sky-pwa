"use client";
import Link from "next/link";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { useLang, type Lang } from "@/lib/i18n";

function IconChevron() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}
function IconGlobe() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function IconBell() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
function IconShield() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}

export default function SettingsPage() {
  const { t, lang, setLang } = useLang();
  const iconCircle: React.CSSProperties = {
    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
    background: "rgba(216,168,95,.10)", border: "1px solid rgba(216,168,95,.20)",
    display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)",
  };
  return (
    <div className="app">
      <StarField />
      <div className="content">
        <header className="header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/profile" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(216,168,95,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", textDecoration: "none", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <div className="screen-title">
              <h1>{t.settings.title}</h1>
              <p>{t.settings.subtitle}</p>
            </div>
          </div>
        </header>

        {/* Language */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>{t.settings.language}</p>
          <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: "1px solid var(--line-soft)" }}>
              <div style={iconCircle}><IconGlobe /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t.settings.language}</div>
                <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2 }}>{t.settings.languageSub}</div>
              </div>
            </div>
            <div style={{ display: "flex", padding: "12px 16px", gap: 10 }}>
              {(["en", "ru"] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  flex: 1, padding: "12px 0", borderRadius: "var(--radius-md)", cursor: "pointer",
                  fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: lang === l ? 700 : 500,
                  border: `1.5px solid ${lang === l ? "rgba(216,168,95,.7)" : "rgba(255,255,255,.1)"}`,
                  background: lang === l ? "rgba(216,168,95,.12)" : "rgba(255,255,255,.03)",
                  color: lang === l ? "var(--gold)" : "var(--muted)",
                  transition: "all .2s",
                  boxShadow: lang === l ? "0 0 12px rgba(216,168,95,.2)" : "none",
                }}>
                  {l === "en" ? t.settings.english : t.settings.russian}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>{t.settings.notifications}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "transparent", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-md)" }}>
            <div style={iconCircle}><IconBell /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t.settings.notifications}</div>
              <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2 }}>{t.settings.notificationsSub}</div>
            </div>
            <span style={{ color: "var(--muted-2)" }}><IconChevron /></span>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>{t.settings.privacy}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "transparent", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-md)" }}>
            <div style={iconCircle}><IconShield /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t.settings.privacy}</div>
              <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2 }}>{t.settings.privacySub}</div>
            </div>
            <span style={{ color: "var(--muted-2)" }}><IconChevron /></span>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
