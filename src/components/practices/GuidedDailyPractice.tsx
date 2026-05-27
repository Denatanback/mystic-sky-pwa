"use client";

import { useState } from "react";
import Link from "next/link";

export type GuidedPracticeResult = {
  signalName: string;
  responseAction: string;
};

export function GuidedDailyPractice({
  completed,
  onComplete,
  initialSignalName = "",
  initialResponseAction = "",
  variant = "today",
}: {
  completed: boolean;
  onComplete: (result: GuidedPracticeResult) => void;
  initialSignalName?: string;
  initialResponseAction?: string;
  variant?: "today" | "practices";
}) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [signalName, setSignalName] = useState(initialSignalName);
  const [responseAction, setResponseAction] = useState(initialResponseAction);

  const cardStyle: React.CSSProperties = {
    border: "1px solid rgba(216,168,95,.24)",
    borderRadius: 22,
    background: "rgba(12,8,28,.70)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    padding: variant === "today" ? 18 : 16,
    boxShadow: "0 16px 38px rgba(0,0,0,.24)",
  };
  const buttonStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 46,
    border: "none",
    borderRadius: 999,
    background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "var(--font-ui)",
    cursor: "pointer",
    boxShadow: "0 10px 28px rgba(90,32,144,.42), inset 0 1px 0 rgba(255,255,255,.12)",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 44,
    borderRadius: 14,
    border: "1px solid rgba(216,168,95,.20)",
    background: "rgba(255,255,255,.05)",
    color: "var(--text)",
    fontFamily: "var(--font-ui)",
    fontSize: 13,
    padding: "0 12px",
    outline: "none",
  };

  if (completed) {
    return (
      <div id="practice" style={{ ...cardStyle, background: "rgba(216,168,95,.08)" }}>
        <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Today’s practice</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 8 }}>Practice completed</h2>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12 }}>Your first path signal is unlocked.</p>
        {initialSignalName && <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Signal: {initialSignalName}</p>}
        {initialResponseAction && <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>Your response: {initialResponseAction}</p>}
        <Link href="/path" style={{ ...buttonStyle, display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Open first signal</Link>
        <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.5, textAlign: "center", marginTop: 10 }}>Come back tomorrow to reveal your next signal.</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div id="practice" style={cardStyle}>
        <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Today’s practice</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 8 }}>Notice the signal that appears most often</h2>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 13 }}>Take 3 minutes to notice what keeps returning in your thoughts, emotions, or choices.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 15 }}>
          {["3 min", "Counts toward your path", "Unlocks first signal"].map((item) => (
            <span key={item} style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 999, color: "var(--gold-2)", background: "rgba(216,168,95,.07)", padding: "5px 9px", fontSize: 11, fontWeight: 800 }}>{item}</span>
          ))}
        </div>
        <button type="button" onClick={() => setStarted(true)} style={buttonStyle}>Start practice</button>
      </div>
    );
  }

  const steps = {
    1: {
      title: "Step 1 · Notice",
      text: "Pause for one breath. What feeling, thought, image, or situation has repeated today?",
    },
    2: {
      title: "Step 2 · Name the signal",
      text: "Give the repeating pattern a simple name. It can be one word: attention, fear, desire, clarity, distance, warmth.",
    },
    3: {
      title: "Step 3 · Choose one response",
      text: "Choose one small action that respects this signal instead of ignoring it.",
    },
  }[step];

  return (
    <div id="practice" style={cardStyle}>
      <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Guided practice · {step}/3</p>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 8 }}>{steps.title}</h2>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 14 }}>{steps.text}</p>
      {step === 2 && (
        <input value={signalName} onChange={(event) => setSignalName(event.target.value)} placeholder="Name your signal" style={{ ...inputStyle, marginBottom: 12 }} />
      )}
      {step === 3 && (
        <>
          <input value={responseAction} onChange={(event) => setResponseAction(event.target.value)} placeholder="One small action" style={{ ...inputStyle, marginBottom: 12 }} />
          <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>Reflection question: What kept asking for your attention today?</p>
        </>
      )}
      {step < 3 ? (
        <button type="button" onClick={() => setStep((current) => (current + 1) as 2 | 3)} style={buttonStyle}>Continue</button>
      ) : (
        <button type="button" onClick={() => onComplete({ signalName, responseAction })} style={buttonStyle}>Complete practice</button>
      )}
    </div>
  );
}
