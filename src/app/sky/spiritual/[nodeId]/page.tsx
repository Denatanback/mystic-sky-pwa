"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { useLang } from "@/lib/i18n";
import { startNode, completeNode, getNodeState, isNodeLocked } from "@/lib/nodeProgress";

const TOTAL = 8;
const DISCIPLINE = "spiritual";

// ── Node 1: Meditation Timer ──────────────────────────────────────────────────
const DURATIONS = [
  { min: 3, label: { en: "3 min", ru: "3 мин" } },
  { min: 5, label: { en: "5 min", ru: "5 мин" } },
  { min: 10, label: { en: "10 min", ru: "10 мин" } },
];

function SpiritNode1() {
  const { lang } = useLang();
  const router = useRouter();
  const [phase, setPhase] = useState<"choose" | "active" | "done">("choose");
  const [chosen, setChosen] = useState(3);
  const [remaining, setRemaining] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"in" | "hold" | "out">("in");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { startNode(DISCIPLINE, 1); }, []);

  const startMeditation = useCallback(() => {
    const secs = chosen * 60;
    setRemaining(secs);
    setPhase("active");
    setBreathPhase("in");

    // Breath cycle: 4s in → 4s hold → 6s out = 14s total
    const CYCLE = [{ p: "in" as const, d: 4000 }, { p: "hold" as const, d: 4000 }, { p: "out" as const, d: 6000 }];
    let ci = 0;
    const nextBreath = () => {
      setBreathPhase(CYCLE[ci].p);
      breathRef.current = setTimeout(() => {
        ci = (ci + 1) % CYCLE.length;
        nextBreath();
      }, CYCLE[ci].d);
    };
    nextBreath();

    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          if (breathRef.current) clearTimeout(breathRef.current);
          setPhase("done");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }, [chosen]);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (breathRef.current) clearTimeout(breathRef.current);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pct = remaining / (chosen * 60);

  const BREATH_SCALE = { in: 1.25, hold: 1.25, out: 0.8 };
  const BREATH_LABEL = {
    in:   { en: "Inhale", ru: "Вдох" },
    hold: { en: "Hold",   ru: "Задержка" },
    out:  { en: "Exhale", ru: "Выдох" },
  };

  const handleComplete = () => {
    completeNode(DISCIPLINE, 1, { meditationMin: chosen });
    router.push("/sky/spiritual");
  };

  return (
    <div>
      {phase === "choose" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>&#129497;</div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {lang === "ru"
                ? "Медитация — основа духовной практики. Даже несколько минут в тишине меняют качество всего дня."
                : "Meditation is the foundation of spiritual practice. Even a few minutes of stillness transform the quality of your entire day."}
            </p>
          </div>
          <p style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", textAlign: "center", marginBottom: 14 }}>
            {lang === "ru" ? "ВЫБЕРИ ДЛИТЕЛЬНОСТЬ" : "CHOOSE DURATION"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
            {DURATIONS.map(d => (
              <button key={d.min} onClick={() => setChosen(d.min)} style={{ padding: "16px 8px", borderRadius: 14, border: `1.5px solid ${chosen === d.min ? "rgba(216,168,95,.7)" : "rgba(255,255,255,.12)"}`, background: chosen === d.min ? "rgba(216,168,95,.12)" : "rgba(14,10,32,.4)", cursor: "pointer", fontFamily: "var(--font-serif)", fontSize: 22, color: chosen === d.min ? "var(--gold)" : "var(--muted)" }}>
                {lang === "ru" ? d.label.ru : d.label.en}
              </button>
            ))}
          </div>
          <button onClick={startMeditation} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ru" ? "Начать медитацию →" : "Begin meditation →"}
          </button>
        </div>
      )}

      {phase === "active" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".08em", marginBottom: 30 }}>
            {lang === "ru" ? "КОНЦЕНТРИРУЙСЯ НА ДЫХАНИИ" : "FOCUS ON YOUR BREATH"}
          </p>

          {/* Breathing orb */}
          <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto 30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Outer glow */}
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(120,50,200,.08)", filter: "blur(20px)", transform: `scale(${BREATH_SCALE[breathPhase]})`, transition: `transform ${breathPhase === "in" ? 4 : breathPhase === "hold" ? 0.1 : 6}s ease-in-out` }} />
            {/* Main orb */}
            <div style={{ width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, rgba(180,120,255,.4), rgba(40,20,80,.9))", border: "1.5px solid rgba(160,100,240,.6)", boxShadow: "0 0 40px rgba(140,60,220,.5), inset 0 0 30px rgba(100,40,180,.3)", transform: `scale(${BREATH_SCALE[breathPhase]})`, transition: `transform ${breathPhase === "in" ? 4 : breathPhase === "hold" ? 0.1 : 6}s ease-in-out`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: "rgba(220,190,255,.9)", fontWeight: 600, letterSpacing: ".1em" }}>
                {lang === "ru" ? BREATH_LABEL[breathPhase].ru : BREATH_LABEL[breathPhase].en}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 48, color: "var(--gold-2)", marginBottom: 8, letterSpacing: ".06em" }}>{fmt(remaining)}</div>
          <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,.08)", overflow: "hidden", marginBottom: 24 }}>
            <div style={{ height: "100%", width: `${(1 - pct) * 100}%`, borderRadius: 99, background: "linear-gradient(90deg, #8040c0, #d8a85f)", transition: "width 1s linear" }} />
          </div>

          <button onClick={() => { clearInterval(intervalRef.current!); if (breathRef.current) clearTimeout(breathRef.current); setPhase("done"); }}
            style={{ padding: "10px 24px", borderRadius: 999, border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.04)", color: "var(--muted)", fontSize: 13, cursor: "pointer" }}>
            {lang === "ru" ? "Остановить" : "Stop"}
          </button>
        </div>
      )}

      {phase === "done" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 14 }}>&#10024;</div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 10 }}>
            {lang === "ru" ? "Отлично сделано" : "Well done"}
          </h3>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
            {lang === "ru"
              ? `Ты медитировал ${chosen} минут. Заметь, как ты себя чувствуешь прямо сейчас — это и есть твоя практика.`
              : `You meditated for ${chosen} minutes. Notice how you feel right now — this is your practice.`}
          </p>
          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {lang === "ru" ? "Завершить узел ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Node 2: Breathwork ────────────────────────────────────────────────────────
type BreathTech = "478" | "box" | "energising";
const BREATH_TECHS: Record<BreathTech, {
  name: { en: string; ru: string };
  desc: { en: string; ru: string };
  phases: { label: { en: string; ru: string }; duration: number }[];
  cycles: number;
}> = {
  "478": {
    name: { en: "4-7-8 Breathing", ru: "Дыхание 4-7-8" },
    desc: { en: "A calming technique that activates your parasympathetic system. Excellent for stress and sleep.", ru: "Успокаивающая техника, активирует парасимпатическую нервную систему. Отлично при стрессе и для сна." },
    phases: [
      { label: { en: "Inhale", ru: "Вдох" }, duration: 4 },
      { label: { en: "Hold", ru: "Задержка" }, duration: 7 },
      { label: { en: "Exhale", ru: "Выдох" }, duration: 8 },
    ],
    cycles: 4,
  },
  box: {
    name: { en: "Box Breathing", ru: "Квадратное дыхание" },
    desc: { en: "Used by Navy SEALs and athletes. Balances the nervous system and sharpens focus.", ru: "Используется спецназом и спортсменами. Балансирует нервную систему и обостряет фокус." },
    phases: [
      { label: { en: "Inhale", ru: "Вдох" }, duration: 4 },
      { label: { en: "Hold", ru: "Задержка" }, duration: 4 },
      { label: { en: "Exhale", ru: "Выдох" }, duration: 4 },
      { label: { en: "Hold", ru: "Задержка" }, duration: 4 },
    ],
    cycles: 4,
  },
  energising: {
    name: { en: "Energising Breath", ru: "Заряжающее дыхание" },
    desc: { en: "Quick inhales with extended exhale to increase oxygen and energy. Morning practice.", ru: "Быстрые вдохи с удлинённым выдохом. Увеличивает кислород и энергию. Утренняя практика." },
    phases: [
      { label: { en: "Quick Inhale", ru: "Быстрый вдох" }, duration: 2 },
      { label: { en: "Quick Inhale", ru: "Быстрый вдох" }, duration: 2 },
      { label: { en: "Long Exhale", ru: "Длинный выдох" }, duration: 6 },
    ],
    cycles: 5,
  },
};

function SpiritNode2() {
  const { lang } = useLang();
  const router = useRouter();
  const [chosen, setChosen] = useState<BreathTech>("box");
  const [phase, setPhase] = useState<"choose" | "active" | "done">("choose");
  const [cycleNum, setCycleNum] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { startNode(DISCIPLINE, 2); }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const startBreath = useCallback(() => {
    const tech = BREATH_TECHS[chosen];
    setPhase("active");
    setCycleNum(1);
    setPhaseIdx(0);
    setCountdown(tech.phases[0].duration);

    let ci = 1, pi = 0, cd = tech.phases[0].duration;
    timerRef.current = setInterval(() => {
      cd--;
      if (cd <= 0) {
        pi++;
        if (pi >= tech.phases.length) {
          pi = 0;
          ci++;
          if (ci > tech.cycles) {
            clearInterval(timerRef.current!);
            setPhase("done");
            return;
          }
          setCycleNum(ci);
        }
        setPhaseIdx(pi);
        cd = tech.phases[pi].duration;
      }
      setCountdown(cd);
    }, 1000);
  }, [chosen]);

  const handleComplete = () => {
    completeNode(DISCIPLINE, 2, { breathTech: chosen });
    router.push("/sky/spiritual");
  };

  const tech = BREATH_TECHS[chosen];
  const currentPhase = tech.phases[phaseIdx];
  const totalCycles = tech.cycles;
  const phasePct = currentPhase ? 1 - countdown / currentPhase.duration : 0;
  const PHASE_COLORS = ["#7090d8", "#d8a85f", "#7ab04a", "#c080f0"];

  return (
    <div>
      {phase === "choose" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>&#128065;</div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {lang === "ru"
                ? "Дыхание — самый быстрый способ изменить состояние. Каждая техника создаёт разный эффект."
                : "Breathing is the fastest way to change your state. Each technique creates a different effect."}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {(Object.keys(BREATH_TECHS) as BreathTech[]).map(k => (
              <button key={k} onClick={() => setChosen(k)} style={{ textAlign: "left", padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${chosen === k ? "rgba(216,168,95,.6)" : "rgba(255,255,255,.1)"}`, background: chosen === k ? "rgba(216,168,95,.08)" : "rgba(14,10,32,.4)", cursor: "pointer" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: chosen === k ? "var(--gold-2)" : "var(--text)", marginBottom: 4 }}>{lang === "ru" ? BREATH_TECHS[k].name.ru : BREATH_TECHS[k].name.en}</p>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.45 }}>{lang === "ru" ? BREATH_TECHS[k].desc.ru : BREATH_TECHS[k].desc.en}</p>
              </button>
            ))}
          </div>
          <button onClick={startBreath} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ru" ? "Начать практику →" : "Begin practice →"}
          </button>
        </div>
      )}

      {phase === "active" && currentPhase && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".1em", marginBottom: 4 }}>
            {lang === "ru" ? tech.name.ru : tech.name.en}
          </p>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 24 }}>
            {lang === "ru" ? `Цикл ${cycleNum} из ${totalCycles}` : `Cycle ${cycleNum} of ${totalCycles}`}
          </p>

          {/* Breathing circle */}
          <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="180" height="180" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
              <circle cx="90" cy="90" r="82" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6" />
              <circle cx="90" cy="90" r="82" fill="none" stroke={PHASE_COLORS[phaseIdx % PHASE_COLORS.length]} strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 82}`}
                strokeDashoffset={`${2 * Math.PI * 82 * (1 - phasePct)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 42, fontFamily: "var(--font-serif)", color: "var(--gold)", fontWeight: 400 }}>{countdown}</span>
              <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>
                {lang === "ru" ? currentPhase.label.ru : currentPhase.label.en}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
            {tech.phases.map((p, i) => (
              <div key={i} style={{ padding: "4px 12px", borderRadius: 999, fontSize: 11, background: i === phaseIdx ? `${PHASE_COLORS[i % PHASE_COLORS.length]}22` : "rgba(255,255,255,.04)", border: `1px solid ${i === phaseIdx ? PHASE_COLORS[i % PHASE_COLORS.length] : "rgba(255,255,255,.08)"}`, color: i === phaseIdx ? PHASE_COLORS[i % PHASE_COLORS.length] : "var(--muted-2)" }}>
                {lang === "ru" ? p.label.ru : p.label.en} {p.duration}s
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 14 }}>&#10024;</div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 10 }}>
            {lang === "ru" ? "Практика завершена" : "Practice complete"}
          </h3>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
            {lang === "ru"
              ? `${totalCycles} циклов ${lang === "ru" ? tech.name.ru : tech.name.en} завершено. Как твоё тело чувствует себя сейчас?`
              : `${totalCycles} cycles of ${tech.name.en} complete. How does your body feel right now?`}
          </p>
          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {lang === "ru" ? "Завершить узел ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Meditation",  ru: "Медитация", sub: { en: "Foundation",  ru: "Основа" } },
  "2": { en: "Breathwork",  ru: "Дыхание",   sub: { en: "Energy",      ru: "Энергия" } },
};

export default function SpiritualNodePage() {
  const params = useParams();
  const nodeId = String(params?.nodeId ?? "1");
  const { lang } = useLang();
  const router = useRouter();

  const locked = typeof window !== "undefined" ? isNodeLocked(DISCIPLINE, parseInt(nodeId)) : false;
  const state = typeof window !== "undefined" ? getNodeState(DISCIPLINE, parseInt(nodeId)) : { status: "locked" };

  const meta = NODE_TITLES[nodeId];
  if (!meta) { router.push("/sky/spiritual"); return null; }

  if (locked) return (
    <NodePage title={lang === "ru" ? meta.ru : meta.en} subtitle={lang === "ru" ? meta.sub.ru : meta.sub.en} nodeNum={parseInt(nodeId)} totalNodes={TOTAL} backHref="/sky/spiritual">
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
      backHref="/sky/spiritual"
      badge={state.status === "completed" ? "completed" : undefined}
    >
      {nodeId === "1" && <SpiritNode1 />}
      {nodeId === "2" && <SpiritNode2 />}
    </NodePage>
  );
}
