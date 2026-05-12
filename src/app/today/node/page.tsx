"use client";
import { useState } from "react";
import Link from "next/link";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";

const TOTAL_Q = 7;

const QUESTIONS = [
  {
    q: "Что ты чувствуешь, когда человек становится холоднее, что происходит внутри первым?",
    options: [
      "Я начинаю искать скрытый смысл в его словах",
      "Замыкаюсь в себе, жалею за то, что открылся/ась",
      "Хочу сразу всё прояснить и вернуть ощущение контроля",
      "Делаю вид, что всё нормально, хотя внутри уже тревожно",
    ],
  },
  {
    q: "Что чаще всего возвращает тебе чувство безопасности?",
    options: [
      "Постоянство и предсказуемость",
      "Эмоциональная близость и искренность",
      "Личное пространство и тишина",
      "Ощущение, что я держу ситуацию под контролем",
    ],
  },
];

export default function NodePage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const progress = Math.round(((currentQ) / TOTAL_Q) * 100);
  const q = QUESTIONS[Math.min(currentQ, QUESTIONS.length - 1)];

  function handleNext() {
    if (selected === null) return;
    setAnswers(prev => [...prev, selected]);
    setSelected(null);
    if (currentQ < TOTAL_Q - 1) setCurrentQ(c => c + 1);
  }

  return (
    <div className="app">
      {/* Atmospheric background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 80% 55% at 50% 0%, rgba(120,50,200,.4), transparent),
          radial-gradient(ellipse 60% 50% at 80% 25%, rgba(160,60,130,.3), transparent),
          #07050f`,
      }} />
      <StarField orbits={false} />

      {/* Large moon image top-right */}
      <div style={{
        position: "absolute", right: -30, top: -20, width: 220, height: 220,
        borderRadius: "50%", zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(circle at 38% 38%, rgba(140,80,220,.55), rgba(60,20,100,.4) 50%, transparent 70%)",
        boxShadow: "0 0 60px rgba(120,50,200,.35)",
      }} />

      <div className="content">
        {/* Breadcrumbs */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 11, color: "var(--muted)" }}>
          <Link href="/today" style={{ color: "var(--muted)" }}>Астрология</Link>
          <span>›</span>
          <Link href="/today/star-way" style={{ color: "var(--muted)" }}>Глубокий путь</Link>
          <span>›</span>
          <span style={{ color: "var(--gold)" }}>Луна</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 52, fontWeight: 300, lineHeight: 1, marginBottom: 4, color: "var(--text)" }}>
          Луна
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 6 }}>
          Эмоции, интуиция, внутренний мир
        </p>
        <p style={{ fontSize: 13, color: "rgba(220,210,200,.65)", lineHeight: 1.6, marginBottom: 20, maxWidth: 340 }}>
          Это узел не для правильных ответов. Он позволяет тебе наблюдать за собой — честно, без осуждения.
        </p>

        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)" }}>
              Путь исследования
            </p>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>Вопрос: {currentQ + 1} из {TOTAL_Q}</span>
          </div>
          <div className="progress-bar">
            <span style={{ width: `${progress}%`, transition: "width .4s ease" }} />
          </div>
        </div>

        {/* Question card */}
        <div style={{
          borderRadius: 20, border: "1px solid rgba(216,168,95,.18)",
          background: "rgba(12,10,30,.85)", padding: 18, marginBottom: 14,
          backdropFilter: "blur(10px)",
        }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", marginBottom: 12 }}>
            Исследуй свою луну
          </p>
          <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.55, marginBottom: 16 }}>
            {currentQ + 1}. {q.q}
          </p>
          <div style={{ display: "grid", gap: 8 }}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 14, textAlign: "left",
                  border: `1px solid ${selected === i ? "rgba(160,100,240,.6)" : "rgba(255,255,255,.08)"}`,
                  background: selected === i ? "rgba(120,60,200,.18)" : "rgba(255,255,255,.03)",
                  color: "var(--text)", fontSize: 13, lineHeight: 1.4,
                  cursor: "pointer", transition: "all .2s",
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${selected === i ? "rgba(160,100,240,.8)" : "rgba(255,255,255,.2)"}`,
                  background: selected === i ? "linear-gradient(135deg, #8040c0, #5a1a90)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selected === i && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p style={{ fontSize: 12, color: "var(--muted-2)", textAlign: "center", lineHeight: 1.4, marginBottom: 14 }}>
          Интерпретация откроется после последнего вопроса
        </p>

        {/* Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
          <button className="btn secondary">Сохранить прогресс</button>
          <button
            className="btn primary"
            onClick={handleNext}
            style={{ opacity: selected === null ? .5 : 1 }}
            disabled={selected === null}
          >
            Следующий вопрос <span>→</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
