"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { FeatureInfoSheet, type FeatureInfoSheetProps } from "@/components/ui/FeatureInfoSheet";
import { getCurrentUser } from "@/lib/auth/authAdapter";
import { formatToday } from "@/lib/date/formatToday";
import { cleanLaunchContext, isPastLifeContext, loadLaunchContext, type LaunchContext } from "@/lib/launch/launchContext";

const cardStyle: CSSProperties = {
  border: "1px solid rgba(216,168,95,.22)",
  borderRadius: 22,
  background: "rgba(12,8,28,.58)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 16px 38px rgba(0,0,0,.28)",
};

const primaryCtaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 22px",
  borderRadius: 999,
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff",
  fontSize: 14,
  fontWeight: 800,
  fontFamily: "var(--font-ui)",
  textDecoration: "none",
  boxShadow: "0 10px 28px rgba(90,32,144,.42), inset 0 1px 0 rgba(255,255,255,.12)",
};

export default function HomePage() {
  const todayLabel = formatToday("en-US");
  const [featureInfo, setFeatureInfo] = useState<Omit<FeatureInfoSheetProps, "onClose"> | null>(null);
  const [launchContext, setLaunchContext] = useState<LaunchContext>({});
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const practiceKey = `eluna:daily-practice:${new Date().toISOString().slice(0, 10)}`;

  const openMoonMode = () => setFeatureInfo({
    title: "Moon Mode",
    description: "Soon you’ll be able to switch between daily rhythm, night focus, and reflection modes.",
    statusLabel: "Coming soon",
    primaryActionLabel: "Got it",
  });
  const openReminders = () => setFeatureInfo({
    title: "Soul reminders",
    description: "Daily reading reminders and practice notifications will appear here.",
    statusLabel: "Coming soon",
    primaryActionLabel: "Got it",
  });

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const urlContext = cleanLaunchContext({
      source: params.get("source"),
      funnel: params.get("funnel"),
      result: params.get("result"),
      gender: params.get("gender"),
      animal: params.get("animal"),
      utm_source: params.get("utm_source"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
    });
    const storedContext = { ...loadLaunchContext(), ...urlContext };
    setLaunchContext(storedContext);
    setPracticeCompleted(localStorage.getItem(practiceKey) === "completed");
    void getCurrentUser().then((user) => {
      if (!cancelled && user?.launchContext) {
        setLaunchContext({ ...storedContext, ...user.launchContext });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [practiceKey]);

  const showPastLifeBlock = isPastLifeContext(launchContext);

  return (
    <div className="app">
      <StarField />
      <div className="content">
        <header className="app-topbar">
          <div className="app-topbar__logo"><Logo variant="header" /></div>
          <div className="app-topbar__actions">
            <GuideTopBarButton />
            <button className="icon-btn" aria-label="Moon Mode" title="Moon Mode" onClick={openMoonMode}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"/></svg>
            </button>
            <button className="icon-btn" aria-label="Soul reminders" title="Soul reminders" onClick={openReminders}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
            </button>
            <Link data-tour="profile-button" href="/profile" aria-label="Open profile" title="Profile" style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid rgba(216,168,95,.45)", display: "grid", placeItems: "center", background: "radial-gradient(circle at 40% 35%, rgba(120,60,200,.5), rgba(40,20,80,.8))", flexShrink: 0, textDecoration: "none" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--muted)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </header>

        <section data-tour="home-today-card" style={{ ...cardStyle, position: "relative", overflow: "hidden", padding: "26px 22px", marginTop: 12, background: "linear-gradient(145deg, rgba(20,12,52,.92), rgba(9,6,24,.82))" }}>
          <div aria-hidden="true" style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", right: -58, top: -70, background: "radial-gradient(circle, rgba(216,168,95,.18), rgba(128,64,192,.14) 48%, transparent 70%)" }} />
          <p style={{ color: "var(--gold)", fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>Start here</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>Your eLuna path is ready</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65, maxWidth: 320, marginBottom: 18 }}>Start with today’s personal reading, then unlock deeper insights as your path unfolds.</p>
          <Link href="/today" style={primaryCtaStyle}>Start today’s reading</Link>
          <p style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 12 }}>3 minutes · personalized daily insight</p>
        </section>

        {showPastLifeBlock && (
          <section style={{ ...cardStyle, padding: "16px 18px", marginTop: 14, borderColor: "rgba(216,168,95,.32)", background: "rgba(60,20,100,.24)" }}>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Ready for you</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 6 }}>Your Past Life reading is ready</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginBottom: 14 }}>We’ve prepared your first soul pattern from your answers.</p>
            <Link href="/today" style={{ ...primaryCtaStyle, minHeight: 42, fontSize: 13 }}>Open my reading</Link>
          </section>
        )}

        <section style={{ ...cardStyle, padding: 18, marginTop: 14 }}>
          <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Today’s focus</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 600, color: "var(--text)", lineHeight: 1.12, marginBottom: 8 }}>Notice what pulls your attention</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>Your reading for {todayLabel} points toward one clear signal: where your energy keeps returning, your next answer is already forming.</p>
          <Link href="/today" style={{ color: "var(--gold-2)", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>Open today’s reading →</Link>
        </section>

        <section data-tour="home-recommendations" style={{ ...cardStyle, padding: 18, marginTop: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid rgba(216,168,95,.32)", color: "var(--gold-2)", background: "rgba(216,168,95,.08)", marginBottom: 12 }}>✦</div>
          <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>Your next step</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 600, color: "var(--text)", lineHeight: 1.12, marginBottom: 8 }}>Complete one short reflection today to begin your path.</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>{practiceCompleted ? "Practice completed. Come back tomorrow to reveal your next signal." : "This is the first simple action that turns your reading into a path."}</p>
          <Link href="/today" style={primaryCtaStyle}>{practiceCompleted ? "View today’s reading" : "Begin reflection"}</Link>
        </section>

        <section style={{ ...cardStyle, marginTop: 14, padding: 16 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--gold)", fontWeight: 800, marginBottom: 12 }}>Your next unlocks</p>
          {[
            ["Day 2", "Personal card pattern"],
            ["Day 3", "Past-life signal"],
            ["Day 5", "Relationship insight"],
            ["Day 7", "Weekly soul report"],
          ].map(([day, label]) => (
            <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: day === "Day 2" ? "none" : "1px solid rgba(255,255,255,.06)" }}>
              <span style={{ minWidth: 50, fontSize: 11, color: "var(--gold-2)", fontWeight: 800 }}>{day}</span>
              <span style={{ flex: 1, fontSize: 13, color: "var(--text)" }}>{label}</span>
              <span style={{ fontSize: 11, color: "var(--muted-2)" }}>Unlocks later</span>
            </div>
          ))}
        </section>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted-2)", marginTop: 16 }}>Your path begins today</p>
      </div>
      <BottomNav />
      {featureInfo && <FeatureInfoSheet {...featureInfo} onClose={() => setFeatureInfo(null)} />}
    </div>
  );
}
