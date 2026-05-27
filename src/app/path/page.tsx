"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { PlanChip } from "@/components/subscription/PlanChip";
import { getDeepPathState, getFirstSignalState, markFirstSignalNextStepCompleted, saveFirstSignalReflection, type DeepPathState, type FirstSignalState } from "@/lib/progress/dailyProgress";
import { getPrelandContext, getPrelandExperience, getPrelandKind, savePrelandContext, type PrelandContext, type PrelandExperience } from "@/lib/funnel/prelandContext";

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
  const [firstSignal, setFirstSignal] = useState<FirstSignalState>(() => getFirstSignalState());
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [prelandContext, setPrelandContext] = useState<PrelandContext>({});
  const [prelandExperience, setPrelandExperience] = useState<PrelandExperience | null>(null);

  useEffect(() => {
    setDeepPathState(getDeepPathState());
    const state = getFirstSignalState();
    setFirstSignal(state);
    setReflectionText(state.reflection);
    const params = new URLSearchParams(window.location.search);
    const contextParam = params.get("context");
    const storedPreland = getPrelandContext();
    const effectivePreland = contextParam ? savePrelandContext({ ...storedPreland, source: contextParam, funnel: contextParam }) : storedPreland;
    setPrelandContext(effectivePreland);
    setPrelandExperience(getPrelandExperience(effectivePreland));
  }, []);

  const unlocked = deepPathState.firstSignalUnlocked;
  const prelandKind = getPrelandKind(prelandContext);
  const isContextualSignal = Boolean(prelandExperience);
  const signalName = isContextualSignal ? prelandExperience?.pathSignal ?? firstSignal.signalName ?? "Attention" : firstSignal.signalName || "Attention";
  const pageTitle = prelandKind === "pastlife" ? "Your Past Life signal" : prelandKind === "soulmate" ? "Your Soulmate signal" : "Your first signal";
  const pageSubtitle = prelandKind === "pastlife" ? "Opened from your quiz and today’s practice" : prelandKind === "soulmate" ? "Opened from your quiz and today’s practice" : "Opened from today’s practice";
  const heroText = prelandKind === "pastlife"
    ? "Today’s practice opened the first bridge between your quiz result and your daily path."
    : prelandKind === "soulmate"
      ? "Today’s practice opened the first relationship signal from your quiz and current path."
      : "Today’s completed practice opened the first point of your path. Notice what repeated in your thoughts, choices, or emotions today.";
  const meaningText = prelandExperience?.pathMeaning ?? "This signal is not a prediction. It is a mirror. It shows where your energy keeps returning, even when your mind tries to move past it.";
  const whereText = prelandExperience?.pathWhere ?? (firstSignal.signalName ? `Look for moments today where ${signalName} appeared in your thoughts, emotions, choices, or conversations.` : "Look for the moment that repeated emotionally, even if the outside situation changed.");
  const nextStepText = prelandExperience?.pathNext ?? (firstSignal.responseAction ? "Follow the response you chose today. Keep it small enough that you can actually do it." : "Choose one small action that respects what you noticed.");

  function completeNextStep() {
    markFirstSignalNextStepCompleted();
    setFirstSignal(getFirstSignalState());
    setDeepPathState(getDeepPathState());
  }

  function saveReflection() {
    saveFirstSignalReflection(reflectionText);
    setFirstSignal(getFirstSignalState());
    setReflectionSaved(true);
  }

  const block = (title: string, text: ReactNode) => (
    <section style={{ ...cardStyle, padding: 16, marginTop: 12 }}>
      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>{title}</p>
      <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{text}</div>
    </section>
  );

  return (
    <div className="app">
      <StarField />
      <div className="content">
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

        {unlocked ? (
          <>
            <section style={{ ...cardStyle, padding: "22px 20px", marginTop: 10, background: "linear-gradient(145deg, rgba(22,13,54,.82), rgba(10,6,28,.70))" }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>{firstSignal.integrated ? "Integrated today" : pageSubtitle}</p>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>{pageTitle}</h1>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{heroText}</p>
            </section>

            <section style={{ ...cardStyle, padding: 18, marginTop: 14, borderColor: "rgba(216,168,95,.34)", background: "radial-gradient(circle at 25% 0%, rgba(216,168,95,.14), rgba(12,8,28,.68) 58%)" }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Signal</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 34, color: "var(--text)", fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>{signalName}</h2>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{isContextualSignal ? meaningText : "What repeatedly pulled your attention today may be pointing to the first visible part of your path."}</p>
            </section>

            <section style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 10, marginTop: 12, border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.035)", padding: 12 }}>
              <span style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 900 }}>Day 1 · First signal</span>
              <span style={{ color: firstSignal.integrated ? "var(--gold-2)" : "var(--muted)", fontSize: 11, fontWeight: 800 }}>{firstSignal.integrated ? "Integrated" : "Open"}</span>
            </section>

            {block(isContextualSignal ? "What this pattern means" : "What this signal means", meaningText)}

            {block(isContextualSignal ? "Where it may appear today" : "Where it appeared today", whereText)}

            <section style={{ ...cardStyle, padding: 16, marginTop: 12 }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>Your next step</p>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{nextStepText}</p>
              {firstSignal.responseAction ? (
                <div style={{ border: "1px solid rgba(216,168,95,.18)", borderRadius: 16, background: "rgba(216,168,95,.07)", padding: 13, marginBottom: 12 }}>
                  <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800, marginBottom: 5 }}>Your chosen response</p>
                  <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.55 }}>{firstSignal.responseAction}</p>
                </div>
              ) : (
                <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>Your next response is simple: notice the pattern once more before reacting.</p>
              )}
              <button type="button" onClick={completeNextStep} disabled={firstSignal.integrated} style={{ ...ctaStyle, width: "100%", border: "none", opacity: firstSignal.integrated ? .72 : 1, cursor: firstSignal.integrated ? "default" : "pointer" }}>{firstSignal.integrated ? "Next step completed" : "Complete next step"}</button>
            </section>

            <section style={{ ...cardStyle, padding: 16, marginTop: 12 }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>Save a reflection</p>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>What did this signal ask you to notice?</p>
              <textarea value={reflectionText} onChange={(event) => { setReflectionText(event.target.value); setReflectionSaved(false); }} placeholder="Write one sentence..." style={{ width: "100%", minHeight: 92, borderRadius: 16, border: "1px solid rgba(216,168,95,.20)", background: "rgba(255,255,255,.05)", color: "var(--text)", fontFamily: "var(--font-ui)", fontSize: 13, lineHeight: 1.5, padding: 12, resize: "vertical", outline: "none", marginBottom: 10 }} />
              <button type="button" onClick={saveReflection} style={{ border: "1px solid rgba(216,168,95,.28)", borderRadius: 999, background: "rgba(216,168,95,.08)", color: "var(--gold-2)", minHeight: 38, padding: "0 14px", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>{reflectionSaved || firstSignal.reflection ? "Reflection saved" : "Save reflection"}</button>
            </section>

            {block("Tomorrow’s signal", "Come back tomorrow to see whether this pattern fades, repeats, or opens the next point of your path.")}

            <section style={{ ...cardStyle, padding: 16, marginTop: 12, marginBottom: 8 }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>Next unlock</p>
              <p style={{ color: "var(--text)", fontSize: 14, fontWeight: 900, marginBottom: 4 }}>Day 2 · Personal card pattern</p>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 14 }}>Complete tomorrow’s daily path to open the next signal.</p>
              <Link href="/home" style={{ ...ctaStyle, width: "100%" }}>Return home</Link>
            </section>
          </>
        ) : (
          <section style={{ ...cardStyle, padding: "22px 20px", marginTop: 10 }}>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Locked</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>Your path is preparing</h1>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>Complete one daily practice to open your first signal.</p>
            <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.5, marginBottom: 18 }}>Your first signal opens after you notice what repeats in your day.</p>
            <Link href="/today#practice" style={{ ...ctaStyle, width: "100%" }}>Go to today’s practice</Link>
          </section>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
