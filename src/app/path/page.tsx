"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { PlanChip } from "@/components/subscription/PlanChip";
import { getDeepPathState, type DeepPathState } from "@/lib/progress/dailyProgress";

const cardStyle: CSSProperties = {
  border: "1px solid rgba(216,168,95,.22)",
  borderRadius: 22,
  background: "rgba(12,8,28,.62)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 14px 34px rgba(0,0,0,.24)",
};

const ctaStyle: CSSProperties = {
  minHeight: 46,
  borderRadius: 999,
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff",
  fontSize: 14,
  fontWeight: 800,
  fontFamily: "var(--font-ui)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 18px",
  textDecoration: "none",
  boxShadow: "0 10px 28px rgba(90,32,144,.40), inset 0 1px 0 rgba(255,255,255,.12)",
};

export default function PathPage() {
  const [deepPathState, setDeepPathState] = useState<DeepPathState>(() => getDeepPathState());

  useEffect(() => {
    setDeepPathState(getDeepPathState());
  }, []);

  const unlocked = deepPathState.firstSignalUnlocked;

  return (
    <div className="app">
      <StarField />
      <div className="content">
        <header className="app-topbar">
          <div className="app-topbar__logo"><Logo variant="header" /></div>
          <div className="app-topbar__actions">
            <GuideTopBarButton />
            <PlanChip />
          </div>
        </header>

        {unlocked ? (
          <>
            <section style={{ ...cardStyle, padding: "22px 20px", marginTop: 10, background: "linear-gradient(145deg, rgba(22,13,54,.82), rgba(10,6,28,.70))" }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Unlocked today</p>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>Your first signal</h1>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>Today’s completed practice opened the first point of your path. Notice what repeated in your thoughts, choices, or emotions today.</p>
            </section>

            <section style={{ ...cardStyle, padding: 18, marginTop: 14 }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Signal: Attention</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 8 }}>What repeatedly pulls your attention may be pointing to the next part of your map.</h2>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>Look for the theme that returned more than once today. A repeated thought, feeling, desire, or hesitation is the first thread.</p>
              <Link href="/sky" style={{ ...ctaStyle, width: "100%" }}>Continue to Sky Map</Link>
            </section>
          </>
        ) : (
          <section style={{ ...cardStyle, padding: "22px 20px", marginTop: 10 }}>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Locked</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>Your path is preparing</h1>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>Complete one daily practice to open your first signal.</p>
            <Link href="/today" style={{ ...ctaStyle, width: "100%" }}>Go to today’s practice</Link>
          </section>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
