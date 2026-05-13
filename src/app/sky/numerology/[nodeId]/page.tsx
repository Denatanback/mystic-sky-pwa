"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { useLang } from "@/lib/i18n";
import { getMockUser } from "@/lib/mockAuth";
import { lifePathNumber, soulNumber, NUMBER_TRAITS } from "@/lib/numerologyCalc";
import { startNode, completeNode, getNodeState, isNodeLocked } from "@/lib/nodeProgress";

const TOTAL = 8;
const DISCIPLINE = "numerology";

// ── Node 1: Life Path Number ─────────────────────────────────────────────────
function NumNode1() {
  const { lang } = useLang();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [animIdx, setAnimIdx] = useState(-1);

  const user = typeof window !== "undefined" ? getMockUser() : null;
  const calc = user?.birthDate ? lifePathNumber(user.birthDate) : null;
  const traits = calc ? (NUMBER_TRAITS[calc.result] ?? null) : null;

  useEffect(() => { startNode(DISCIPLINE, 1); }, []);

  // Animate steps one by one
  const startAnim = () => {
    setStep(1);
    setAnimIdx(0);
    let i = 0;
    const total = calc ? calc.steps.length : 0;
    const id = setInterval(() => {
      i++;
      if (i >= total) { clearInterval(id); setTimeout(() => setStep(2), 600); }
      else setAnimIdx(i);
    }, 700);
  };

  const handleComplete = () => {
    completeNode(DISCIPLINE, 1, { lifePathNumber: calc?.result });
    router.push("/sky/numerology");
  };

  if (!user?.birthDate) return (
    <div style={{ textAlign: "center", padding: "40px 16px" }}>
      <p style={{ color: "var(--muted)", marginBottom: 16 }}>{lang === "ru" ? "Укажи дату рождения в профиле" : "Add your birth date in profile"}</p>
      <button onClick={() => router.push("/profile")} style={{ padding: "12px 28px", borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{lang === "ru" ? "Открыть профиль" : "Open profile"}</button>
    </div>
  );

  if (!calc) return null;

  return (
    <div>
      {step === 0 && (
        <div>
          <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.5)", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{lang === "ru" ? "ТВОЯ ДАТА РОЖДЕНИЯ" : "YOUR BIRTH DATE"}</p>
            <p style={{ fontSize: 22, color: "var(--text)", fontFamily: "var(--font-serif)", letterSpacing: ".06em" }}>
              {new Date(user.birthDate).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.45)", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {lang === "ru"
                ? "Число Жизненного Пути — главное число в нумерологии. Оно вычисляется из даты рождения и раскрывает основную вибрацию твоего пути на Земле."
                : "The Life Path Number is the most important in numerology. Calculated from your birth date, it reveals the core vibration of your path on Earth."}
            </p>
          </div>
          <button onClick={startAnim} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ru" ? "Начать расчёт →" : "Start calculation →"}
          </button>
        </div>
      )}

      {step === 1 && calc && (
        <div>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginBottom: 16 }}>{lang === "ru" ? "Разбиваем дату по шагам..." : "Breaking down your date..."}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {calc.steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: `1px solid ${i <= animIdx ? "rgba(216,168,95,.4)" : "rgba(255,255,255,.06)"}`, background: i <= animIdx ? "rgba(216,168,95,.06)" : "rgba(14,10,32,.4)", transition: "all .3s", opacity: i <= animIdx ? 1 : 0.2 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: i <= animIdx ? "rgba(216,168,95,.2)" : "rgba(255,255,255,.05)", border: `1px solid ${i <= animIdx ? "rgba(216,168,95,.5)" : "rgba(255,255,255,.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: "var(--gold-2)" }}>{i + 1}</div>
                <span style={{ fontSize: 14, color: i <= animIdx ? "var(--text)" : "var(--muted-2)", fontFamily: "var(--font-serif)", letterSpacing: ".03em" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && calc && traits && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 110, height: 110, margin: "0 auto 14px", borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, rgba(216,168,95,.25), rgba(80,30,160,.9))", border: "2px solid rgba(216,168,95,.7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(216,168,95,.35)" }}>
              <span style={{ fontSize: 52, fontFamily: "var(--font-serif)", color: "var(--gold)", fontWeight: 400 }}>{calc.result}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 30, color: "var(--text)", marginBottom: 4 }}>
              {lang === "ru" ? traits.name.ru : traits.name.en}
            </h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{lang === "ru" ? `Число пути: ${calc.result}` : `Life Path: ${calc.result}`}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {traits.traits.map((tr, i) => (
              <div key={i} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(160,130,220,.25)", background: "rgba(14,10,32,.55)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--gold-2)", marginBottom: 6 }}>{lang === "ru" ? tr.title.ru : tr.title.en}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{lang === "ru" ? tr.body.ru : tr.body.en}</p>
              </div>
            ))}
          </div>

          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {lang === "ru" ? "Завершить узел ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Node 2: Soul Number ──────────────────────────────────────────────────────
function NumNode2() {
  const { lang } = useLang();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const user = typeof window !== "undefined" ? getMockUser() : null;
  const firstName = user?.name?.split(" ")[0] ?? "";
  const calc = firstName ? soulNumber(firstName) : null;
  const traits = calc ? (NUMBER_TRAITS[calc.result] ?? null) : null;

  useEffect(() => { startNode(DISCIPLINE, 2); }, []);

  const animateVowels = () => {
    setStep(1);
    let i = 0;
    const id = setInterval(() => {
      setHighlightIdx(i);
      i++;
      if (!calc || i >= calc.vowels.length) {
        clearInterval(id);
        setTimeout(() => setStep(2), 800);
      }
    }, 450);
  };

  const handleComplete = () => {
    completeNode(DISCIPLINE, 2, { soulNumber: calc?.result });
    router.push("/sky/numerology");
  };

  const PYTH_MAP: Record<string, number> = { A:1,E:5,I:9,O:6,U:3,Y:7 };
  const VOWELS_SET = new Set(["A","E","I","O","U","Y"]);

  if (!user?.name) return (
    <div style={{ textAlign: "center", padding: "40px 16px" }}>
      <p style={{ color: "var(--muted)" }}>{lang === "ru" ? "Укажи имя в профиле" : "Add your name in profile"}</p>
    </div>
  );

  return (
    <div>
      {step === 0 && (
        <div>
          <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.5)", marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{lang === "ru" ? "ИМЯ ДЛЯ РАСЧЁТА" : "NAME FOR CALCULATION"}</p>
            <p style={{ fontSize: 24, color: "var(--text)", fontFamily: "var(--font-serif)", letterSpacing: ".06em" }}>{firstName}</p>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.45)", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {lang === "ru"
                ? "Число Души (Желание Сердца) вычисляется из гласных твоего имени. Оно раскрывает глубинные желания и то, что по-настоящему движет тобой изнутри."
                : "The Soul Number (Heart's Desire) is calculated from the vowels in your name. It reveals your deepest desires and what truly drives you from within."}
            </p>
          </div>
          <button onClick={animateVowels} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ru" ? "Найти гласные →" : "Find vowels →"}
          </button>
        </div>
      )}

      {(step === 1 || step === 2) && calc && (
        <div>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginBottom: 16 }}>
            {lang === "ru" ? "Подсвечиваем гласные буквы..." : "Highlighting vowel letters..."}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {firstName.toUpperCase().split("").map((ch, i) => {
              const isVowel = VOWELS_SET.has(ch);
              const vIdx = calc.vowels.findIndex((v, vi) => {
                let count = 0;
                for (let j = 0; j <= i; j++) if (VOWELS_SET.has(firstName[j].toUpperCase())) count++;
                return vi === count - 1 && isVowel;
              });
              const lit = isVowel && vIdx <= highlightIdx;
              return (
                <div key={i} style={{ width: 40, height: 52, borderRadius: 10, border: `1.5px solid ${lit ? "rgba(216,168,95,.7)" : "rgba(255,255,255,.12)"}`, background: lit ? "rgba(216,168,95,.12)" : "rgba(14,10,32,.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all .3s" }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: lit ? "var(--gold)" : "var(--muted-2)" }}>{ch}</span>
                  {isVowel && lit && <span style={{ fontSize: 9, color: "var(--gold-2)" }}>{PYTH_MAP[ch] ?? ""}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && calc && traits && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{lang === "ru" ? calc.steps[0] : calc.steps[0]}</div>
            <div style={{ width: 100, height: 100, margin: "0 auto 12px", borderRadius: "50%", background: "radial-gradient(circle, rgba(140,70,220,.3), rgba(14,10,32,.95))", border: "2px solid rgba(140,70,220,.5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(140,70,220,.35)" }}>
              <span style={{ fontSize: 46, fontFamily: "var(--font-serif)", color: "#c080f0" }}>{calc.result}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{lang === "ru" ? traits.name.ru : traits.name.en}</h2>
            <p style={{ fontSize: 12, color: "rgba(180,140,250,1)" }}>{lang === "ru" ? `Число души: ${calc.result}` : `Soul number: ${calc.result}`}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {traits.traits.map((tr, i) => (
              <div key={i} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(140,70,220,.3)", background: "rgba(14,10,32,.55)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(180,140,250,1)", marginBottom: 6 }}>{lang === "ru" ? tr.title.ru : tr.title.en}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{lang === "ru" ? tr.body.ru : tr.body.en}</p>
              </div>
            ))}
          </div>

          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {lang === "ru" ? "Завершить узел ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Router ───────────────────────────────────────────────────────────────────
const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Life Path",   ru: "Число пути",  sub: { en: "Foundation", ru: "Основа" } },
  "2": { en: "Soul Number", ru: "Число души",  sub: { en: "Inner world", ru: "Внутренний мир" } },
};

export default function NumerologyNodePage() {
  const params = useParams();
  const nodeId = String(params?.nodeId ?? "1");
  const { lang } = useLang();
  const router = useRouter();

  const locked = typeof window !== "undefined" ? isNodeLocked(DISCIPLINE, parseInt(nodeId)) : false;
  const state = typeof window !== "undefined" ? getNodeState(DISCIPLINE, parseInt(nodeId)) : { status: "locked" };

  const meta = NODE_TITLES[nodeId];
  if (!meta) { router.push("/sky/numerology"); return null; }

  if (locked) return (
    <NodePage title={lang === "ru" ? meta.ru : meta.en} subtitle={lang === "ru" ? meta.sub.ru : meta.sub.en} nodeNum={parseInt(nodeId)} totalNodes={TOTAL} backHref="/sky/numerology">
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
        <p style={{ color: "var(--muted)" }}>{lang === "ru" ? "Завершите предыдущий узел" : "Complete the previous node first"}</p>
      </div>
    </NodePage>
  );

  return (
    <NodePage
      title={lang === "ru" ? meta.ru : meta.en}
      subtitle={lang === "ru" ? meta.sub.ru : meta.sub.en}
      nodeNum={parseInt(nodeId)}
      totalNodes={TOTAL}
      backHref="/sky/numerology"
      badge={state.status === "completed" ? "completed" : undefined}
    >
      {nodeId === "1" && <NumNode1 />}
      {nodeId === "2" && <NumNode2 />}
    </NodePage>
  );
}
