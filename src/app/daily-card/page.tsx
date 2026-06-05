"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { StarField } from "@/components/app-shell/StarField";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { PlanChip } from "@/components/subscription/PlanChip";
import { getTodayKey, markDailyActionCompleted } from "@/lib/progress/dailyProgress";
import { getCurrentProfile } from "@/lib/profile/currentProfile";
import { getTodayDailyCard, saveDailyCardReflection, type DailyCardState } from "@/lib/cards/dailyCardProgress";

const cardStyle = {
  border: "1px solid rgba(216,168,95,.20)",
  borderRadius: 22,
  background: "rgba(12,8,28,.64)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 14px 34px rgba(0,0,0,.24)",
} as const;

const primaryButtonStyle = {
  minHeight: 46,
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff",
  fontSize: 14,
  fontWeight: 900,
  fontFamily: "var(--font-ui)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 18px",
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 10px 28px rgba(90,32,144,.40), inset 0 1px 0 rgba(255,255,255,.12)",
} as const;

function SectionBlock({ title, text }: { title: string; text: string }) {
  return (
    <section style={{ ...cardStyle, padding: 16 }}>
      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>{title}</p>
      <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.6 }}>{text}</p>
    </section>
  );
}

export default function DailyCardPage() {
  const todayKey = getTodayKey();
  const [state, setState] = useState<DailyCardState>({ drawn: false, card: null, reflection: "" });
  const [reflectionText, setReflectionText] = useState("");
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    markDailyActionCompleted("cardOpened", todayKey);
    const initial = getTodayDailyCard(todayKey);
    setState(initial);
    setReflectionText(initial.reflection);
    void getCurrentProfile().then((user) => {
      if (!user?.id) return;
      setUserId(user.id);
      const personalized = getTodayDailyCard(todayKey, user.id);
      setState(personalized);
      setReflectionText(personalized.reflection);
    });
  }, [todayKey]);

  function saveReflection() {
    const value = saveDailyCardReflection(reflectionText, todayKey, userId);
    const nextState = getTodayDailyCard(todayKey, userId);
    setState(nextState);
    setReflectionText(value);
    setSaved(true);
  }

  const card = state.card;

  return (
    <div className="app">
      <StarField />
      <div className="content" style={{ paddingBottom: "calc(132px + env(safe-area-inset-bottom))" }}>
        <header className="app-topbar">
          <Link href="/home" aria-label="Back home" className="icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div className="app-topbar__logo"><Logo variant="header" /></div>
          <div className="app-topbar__actions">
            <GuideTopBarButton />
            <PlanChip />
          </div>
        </header>

        {card ? (
          <div style={{ display: "grid", gap: 14, marginTop: 10 }}>
            <section style={{ ...cardStyle, padding: "20px 18px 18px", textAlign: "center", background: "radial-gradient(circle at 50% 0%, rgba(216,168,95,.13), transparent 34%), rgba(12,8,28,.68)" }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Today’s card</p>
              <img src={card.image} alt={`${card.title} card artwork`} style={{ width: "min(76vw, 260px)", maxHeight: 360, objectFit: "contain", margin: "0 auto 16px", display: "block", filter: "drop-shadow(0 24px 34px rgba(0,0,0,.36)) drop-shadow(0 0 22px rgba(216,168,95,.15))" }} draggable={false} />
              <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 34, fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>{card.title}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 7 }}>
                {card.tags.map((tag) => (
                  <span key={tag} style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 999, color: "var(--gold-2)", background: "rgba(216,168,95,.07)", padding: "5px 9px", fontSize: 11, fontWeight: 800 }}>{tag.replace(/-/g, " ")}</span>
                ))}
              </div>
            </section>

            <SectionBlock title="Meaning" text={card.meaning} />
            <SectionBlock title="Action" text={card.action} />
            <SectionBlock title="Reflection question" text={card.reflection} />

            <section style={{ ...cardStyle, padding: 16 }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Your reflection</p>
              <textarea
                value={reflectionText}
                onChange={(event) => {
                  setReflectionText(event.target.value);
                  setSaved(false);
                }}
                placeholder="What did this card mirror today?"
                style={{ width: "100%", minHeight: 120, borderRadius: 16, border: "1px solid rgba(216,168,95,.20)", background: "rgba(255,255,255,.05)", color: "var(--text)", fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.5, padding: 12, resize: "vertical", outline: "none", marginBottom: 12 }}
              />
              <button type="button" onClick={saveReflection} style={{ ...primaryButtonStyle, width: "100%" }}>Save reflection</button>
              {(saved || state.reflection) && <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800, marginTop: 10 }}>Reflection saved for today.</p>}
            </section>

            <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, textAlign: "center" }}>Daily cards offer symbolic guidance for self-reflection and entertainment. They are not guaranteed predictions or professional advice.</p>
          </div>
        ) : (
          <section style={{ ...cardStyle, padding: "22px 20px", marginTop: 10 }}>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Daily card</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>Preparing today’s card...</h1>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>Your card will appear in a moment.</p>
          </section>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
