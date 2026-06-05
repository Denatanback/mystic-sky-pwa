"use client";

import { useEffect, useState } from "react";
import { askOracle } from "@/lib/lunaPath/progress";
import { oracleModeCosts, oracleModeLabels } from "@/lib/lunaPath/rewards";
import { readLunaPathState } from "@/lib/lunaPath/storage";
import type { LunaPathState, OracleMode } from "@/lib/lunaPath/types";
import { lunaCardStyle, lunaInputStyle, lunaPrimaryButtonStyle, lunaSecondaryButtonStyle, LunaGlyph } from "./shared";

const paidModes: Array<Exclude<OracleMode, "free">> = ["quick", "deep", "three-card"];

export function OraclePracticeCard() {
  const [state, setState] = useState<LunaPathState>(() => readLunaPathState());
  const [mode, setMode] = useState<Exclude<OracleMode, "free">>("quick");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setState(readLunaPathState());
  }, []);

  function submitQuestion() {
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

  const isFree = state.oracleFreeQuestionAvailable;
  const selectedCost = oracleModeCosts[mode];

  return (
    <section id="oracle" style={{ ...lunaCardStyle, scrollMarginTop: 18, padding: 16, background: "radial-gradient(circle at 20% 0%, rgba(216,168,95,.12), transparent 30%), radial-gradient(circle at 84% 18%, rgba(141,85,214,.22), transparent 38%), rgba(12,8,28,.70)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
        <LunaGlyph />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>Premium practice</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", fontWeight: 600, lineHeight: 1.08, marginBottom: 7 }}>Оракул eLuna</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>Задай вопрос и получи мягкий персональный разбор на основе твоих карт, состояния и Лунного пути.</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", border: "1px solid rgba(216,168,95,.16)", borderRadius: 16, background: "rgba(216,168,95,.07)", padding: 12, marginBottom: 12 }}>
        <span style={{ color: "var(--muted)", fontSize: 12, fontWeight: 800 }}>Баланс Лунных токенов</span>
        <span style={{ color: "var(--gold-2)", fontSize: 20, fontWeight: 900 }}>{state.tokenBalance}</span>
      </div>

      {isFree ? (
        <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 900, marginBottom: 10 }}>Первый вопрос Оракулу доступен бесплатно.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 7, marginBottom: 12 }}>
          {paidModes.map((item) => {
            const active = mode === item;
            return (
              <button key={item} type="button" onClick={() => setMode(item)} style={{ minHeight: 58, borderRadius: 16, border: `1px solid ${active ? "rgba(216,168,95,.44)" : "rgba(255,255,255,.09)"}`, background: active ? "rgba(216,168,95,.10)" : "rgba(255,255,255,.035)", color: active ? "var(--gold-2)" : "var(--muted)", fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 900, lineHeight: 1.2, padding: 8, cursor: "pointer" }}>
                {oracleModeLabels[item]}<br />
                <span style={{ color: active ? "var(--text)" : "var(--muted-2)", fontWeight: 800 }}>{oracleModeCosts[item]} токенов</span>
              </button>
            );
          })}
        </div>
      )}

      <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Спроси о внутреннем сигнале, выборе или повторяющемся паттерне..." style={{ ...lunaInputStyle, minHeight: 104, marginBottom: 10 }} />

      <button type="button" onClick={submitQuestion} style={{ ...lunaPrimaryButtonStyle, width: "100%" }}>
        {isFree ? "Задать первый вопрос" : `Задать вопрос · ${selectedCost} токенов`}
      </button>

      {message && (
        <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 16, background: "rgba(216,168,95,.07)", padding: 12, marginTop: 12 }}>
          <p style={{ color: "var(--gold-2)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{message}</p>
          <button type="button" disabled style={{ ...lunaSecondaryButtonStyle, width: "100%", opacity: .62, cursor: "default" }}>Открыть Оракула</button>
          <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 8 }}>Скоро здесь появится быстрый доступ через оплату.</p>
        </div>
      )}

      {answer && (
        <div style={{ border: "1px solid rgba(216,168,95,.20)", borderRadius: 18, background: "rgba(255,255,255,.045)", padding: 14, marginTop: 12 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Ответ Оракула</p>
          <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.6 }}>{answer}</p>
        </div>
      )}

      {state.oracleSessions.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Последние вопросы</p>
          <div style={{ display: "grid", gap: 8 }}>
            {state.oracleSessions.slice(0, 3).map((session) => (
              <div key={session.id} style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, background: "rgba(255,255,255,.03)", padding: 12 }}>
                <p style={{ color: "var(--gold-2)", fontSize: 11, fontWeight: 900, marginBottom: 5 }}>{oracleModeLabels[session.mode]} · {session.cost === 0 ? "free" : `${session.cost} токенов`}</p>
                <p style={{ color: "var(--text)", fontSize: 12, lineHeight: 1.45, marginBottom: 6 }}>{session.question}</p>
                <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>{session.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 12 }}>Оракул не предсказывает будущее. Он помогает мягко заметить символы, состояния и внутренние паттерны.</p>
      {/* TODO: Add Stripe token packages when paid token access is ready. */}
      {/* TODO: Add anti-fraud reward validation before server-side token spending. */}
    </section>
  );
}
