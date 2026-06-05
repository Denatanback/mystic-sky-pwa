"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { askOracle } from "@/lib/lunaPath/progress";
import { oracleModeCosts, oracleModeDescriptions, oracleModeLabels } from "@/lib/lunaPath/rewards";
import { readLunaPathState } from "@/lib/lunaPath/storage";
import type { LunaPathState, OracleMode } from "@/lib/lunaPath/types";
import { lunaCardStyle, lunaInputStyle, lunaPrimaryButtonStyle, lunaSecondaryButtonStyle, LunaGlyph } from "./shared";

const paidModes: Array<Exclude<OracleMode, "free">> = ["quick", "deep", "three-card"];

const oracleInfo = "The Oracle is not a fortune-telling tool. It helps you reflect on symbols, emotional patterns, and possible next steps. Your answer is shaped by your question and your eLuna activity.";
const tokenInfo = "Lunar Tokens are earned by completing daily rituals: opening your card, writing a reflection, checking in with your mood, and finishing practices. You can spend them on deeper Oracle answers.";

function InfoButton({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onToggle} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(216,168,95,.24)", background: "rgba(216,168,95,.08)", color: "var(--gold-2)", display: "inline-grid", placeItems: "center", fontSize: 12, fontWeight: 900, cursor: "pointer", flexShrink: 0 }}>
      {open ? "x" : "i"}
    </button>
  );
}

export function OraclePracticeCard() {
  const [state, setState] = useState<LunaPathState>(() => readLunaPathState());
  const [mode, setMode] = useState<Exclude<OracleMode, "free">>("quick");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [oracleInfoOpen, setOracleInfoOpen] = useState(false);
  const [tokenInfoOpen, setTokenInfoOpen] = useState(false);

  useEffect(() => {
    setState(readLunaPathState());
  }, []);

  const isFree = state.oracleFreeQuestionAvailable;
  const selectedCost = oracleModeCosts[mode];
  const canAffordSelectedMode = isFree || state.tokenBalance >= selectedCost;

  function submitQuestion() {
    if (!canAffordSelectedMode) {
      setMessage("Not enough Lunar Tokens for this mode. Complete rituals in Luna Path or choose a lower-cost mode.");
      setAnswer("");
      return;
    }

    const result = askOracle(state, { mode, question });
    setState(result.state);
    if (result.error) {
      setMessage(result.error);
      setAnswer("");
      return;
    }
    setQuestion("");
    setMessage("");
    setAnswer(result.session?.answer ?? "");
  }

  const buttonLabel = isFree
    ? "Ask your first question"
    : canAffordSelectedMode
      ? `Ask the Oracle · ${selectedCost} tokens`
      : "Earn tokens first";

  return (
    <section id="oracle" style={{ ...lunaCardStyle, scrollMarginTop: 18, padding: 16, background: "radial-gradient(circle at 16% 0%, rgba(216,168,95,.10), transparent 30%), rgba(12,8,28,.70)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
        <LunaGlyph />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>Premium Practice</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", fontWeight: 600, lineHeight: 1.08, marginBottom: 7 }}>eLuna Oracle</h2>
            </div>
            <InfoButton label="What is the eLuna Oracle?" open={oracleInfoOpen} onToggle={() => setOracleInfoOpen((value) => !value)} />
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>Ask a personal question and receive a reflective AI-guided answer based on your current state, daily cards, and Luna Path.</p>
        </div>
      </div>

      {oracleInfoOpen && (
        <div role="note" style={{ border: "1px solid rgba(216,168,95,.18)", borderRadius: 16, background: "rgba(216,168,95,.07)", color: "var(--muted)", fontSize: 12, lineHeight: 1.5, padding: 12, marginBottom: 12 }}>
          {oracleInfo}
        </div>
      )}

      <div style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.035)", padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 8 }}>
          <span style={{ color: "var(--muted)", fontSize: 12, fontWeight: 900 }}>Lunar Tokens</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--gold-2)", fontSize: 20, fontWeight: 900 }}>{state.tokenBalance}</span>
            <InfoButton label="What are Lunar Tokens?" open={tokenInfoOpen} onToggle={() => setTokenInfoOpen((value) => !value)} />
          </div>
        </div>
        {tokenInfoOpen && (
          <div style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>
            <p style={{ marginBottom: 10 }}>{tokenInfo}</p>
            <Link href="/path" style={{ ...lunaSecondaryButtonStyle, minHeight: 36 }}>Earn tokens in Luna Path</Link>
          </div>
        )}
        {state.tokenBalance === 0 && (
          <div style={{ border: "1px solid rgba(216,168,95,.14)", borderRadius: 14, background: "rgba(216,168,95,.055)", padding: 10 }}>
            <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 900, marginBottom: 4 }}>No Lunar Tokens yet</p>
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45, marginBottom: 9 }}>
              {isFree ? "Your first question is free — try the Oracle once before spending tokens." : "Complete small rituals in Luna Path to earn tokens. You can use them for deeper Oracle answers."}
            </p>
            <Link href="/path" style={{ ...lunaSecondaryButtonStyle, minHeight: 34 }}>Go to Luna Path</Link>
          </div>
        )}
      </div>

      {isFree ? (
        <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 16, background: "rgba(216,168,95,.08)", padding: 12, marginBottom: 12 }}>
          <p style={{ color: "var(--gold-2)", fontSize: 13, fontWeight: 900, marginBottom: 4 }}>Your first Oracle question is free.</p>
          <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45 }}>Use it to see how the Oracle reflects your question and recent eLuna activity.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          {paidModes.map((item) => {
            const active = mode === item;
            const affordable = state.tokenBalance >= oracleModeCosts[item];
            return (
              <button key={item} type="button" disabled={!affordable} onClick={() => setMode(item)} style={{ borderRadius: 17, border: `1px solid ${active ? "rgba(216,168,95,.48)" : "rgba(255,255,255,.09)"}`, background: active ? "rgba(216,168,95,.10)" : "rgba(255,255,255,.035)", color: active ? "var(--gold-2)" : "var(--muted)", fontFamily: "var(--font-ui)", textAlign: "left", padding: 12, cursor: affordable ? "pointer" : "default", opacity: affordable ? 1 : .58 }}>
                <span style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 5 }}>
                  <strong style={{ color: active ? "var(--gold-2)" : "var(--text)", fontSize: 13 }}>{oracleModeLabels[item]}</strong>
                  <span style={{ color: affordable ? "var(--gold-2)" : "var(--muted-2)", fontSize: 11, fontWeight: 900 }}>{oracleModeCosts[item]} tokens</span>
                </span>
                <span style={{ display: "block", color: "var(--muted)", fontSize: 12, lineHeight: 1.45 }}>{oracleModeDescriptions[item]}</span>
                {!affordable && <span style={{ display: "block", color: "var(--muted-2)", fontSize: 11, fontWeight: 800, marginTop: 6 }}>Earn more tokens in Luna Path.</span>}
              </button>
            );
          })}
        </div>
      )}

      <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a feeling, choice, relationship pattern, or inner signal..." style={{ ...lunaInputStyle, minHeight: 104, marginBottom: 10 }} />

      <button type="button" onClick={canAffordSelectedMode ? submitQuestion : undefined} style={{ ...lunaPrimaryButtonStyle, width: "100%", opacity: canAffordSelectedMode ? 1 : .74, cursor: canAffordSelectedMode ? "pointer" : "default" }}>
        {buttonLabel}
      </button>

      {message && (
        <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 16, background: "rgba(216,168,95,.07)", padding: 12, marginTop: 12 }}>
          <p style={{ color: "var(--gold-2)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{message}</p>
          <Link href="/path" style={{ ...lunaSecondaryButtonStyle, minHeight: 36 }}>Earn tokens in Luna Path</Link>
        </div>
      )}

      {answer && (
        <div style={{ border: "1px solid rgba(216,168,95,.20)", borderRadius: 18, background: "rgba(255,255,255,.045)", padding: 14, marginTop: 12 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Oracle Answer</p>
          <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{answer}</p>
        </div>
      )}

      {state.oracleSessions.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Recent Oracle Questions</p>
          <div style={{ display: "grid", gap: 8 }}>
            {state.oracleSessions.slice(0, 3).map((session) => (
              <div key={session.id} style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, background: "rgba(255,255,255,.03)", padding: 12 }}>
                <p style={{ color: "var(--gold-2)", fontSize: 11, fontWeight: 900, marginBottom: 5 }}>{oracleModeLabels[session.mode]} · {session.cost === 0 ? "free" : `${session.cost} tokens`}</p>
                <p style={{ color: "var(--text)", fontSize: 12, lineHeight: 1.45, marginBottom: 6 }}>{session.question}</p>
                <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{session.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 12 }}>The Oracle offers reflective guidance, not guaranteed predictions or professional advice.</p>
      {/* TODO: Add Stripe token packages when paid token access is ready. */}
      {/* TODO: Add anti-fraud reward validation before server-side token spending. */}
    </section>
  );
}
