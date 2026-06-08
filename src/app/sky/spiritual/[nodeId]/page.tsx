"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { SkyNodeEntitlementGate } from "@/components/sky/SkyNodeEntitlementGate";
import { useLang } from "@/lib/i18n";
import { startNode, completeNode, getNodeState, isNodeLocked } from "@/lib/nodeProgress";

const TOTAL = 8;
const DISCIPLINE = "spiritual";

type SpiritualPath = "seeker" | "mystic" | "guide" | "healer" | "guardian" | "creator";

const SPIRITUAL_PATHS: Record<SpiritualPath, {
  en: string;
  desc: string;
  strength: string;
  practice: string;
  reminder: string;
  color: string;
}> = {
  seeker: { en: "Seeker", desc: "Your answers point to a path of questions, discovery, and honest inner searching.", strength: "You keep moving toward truth, even when the next step is not fully clear.", practice: "Try a three-minute morning intention: ask one real question and carry it gently through the day.", reminder: "This path may reflect curiosity as devotion. You do not need every answer before you begin.", color: "#d8a85f" },
  mystic: { en: "Mystic", desc: "Your answers point to a path of intuition, symbols, dreams, and unseen patterns.", strength: "You can sense meaning beneath ordinary moments and notice what others overlook.", practice: "Keep a dream or synchronicity note for seven days, writing only the image or feeling that stays with you.", reminder: "This path may reflect deep sensitivity. Ground the mystery in simple daily rituals.", color: "#9070d8" },
  guide: { en: "Guide", desc: "Your answers point to a path of perspective, listening, and helping others find their own direction.", strength: "You can hold space without forcing answers, and people often trust your calm perspective.", practice: "Before giving advice, place one hand on your heart and ask: what is mine to say, and what is theirs to discover?", reminder: "This path may reflect wisdom in relationship. Guide without carrying everyone else's journey.", color: "#7ab8d8" },
  healer: { en: "Healer", desc: "Your answers point to a path of restoration, compassion, and emotional repair.", strength: "You notice pain gently and can help make space for what needs care.", practice: "Use a five-breath body scan: inhale into the tense place, exhale the need to fix it immediately.", reminder: "This path may reflect a gift for repair. Healing includes receiving, resting, and having boundaries.", color: "#7ab04a" },
  guardian: { en: "Guardian", desc: "Your answers point to a path of protection, steadiness, and devotion to what is sacred.", strength: "You create safety through consistency, loyalty, and a strong inner code.", practice: "Choose one small boundary today and honor it as a sacred practice, not a wall.", reminder: "This path may reflect protective power. Let devotion stay warm, not rigid.", color: "#c0a0d8" },
  creator: { en: "Creator", desc: "Your answers point to a path where spirit moves through beauty, expression, and making.", strength: "You can turn feeling into form and make invisible meaning easier to touch.", practice: "Make one small offering with your hands: a sketch, note, sound, altar, meal, or arrangement of objects.", reminder: "This path may reflect creativity as prayer. Let the act matter before the outcome.", color: "#e06090" },
};

const SPIRITUAL_PATH_Q: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; score: Partial<Record<SpiritualPath, number>> }[] }[] = [
  { q: { en: "What most often pulls you back toward yourself?", ru: "Chto chasche vsego vozvraschaet tebya k sebe?" }, opts: [
    { label: { en: "A question I cannot stop following", ru: "Vopros, za kotorym ya ne mogu ne idti" }, score: { seeker: 2 } },
    { label: { en: "A dream, sign, or subtle feeling", ru: "Son, znak ili tonkoe chuvstvo" }, score: { mystic: 2 } },
    { label: { en: "Someone needing calm, care, or repair", ru: "Kto-to, komu nuzhny spokoystvie, zabota ili vosstanovlenie" }, score: { healer: 2, guide: 1 } },
    { label: { en: "The need to make something meaningful", ru: "Potrebnost sozdat chto-to osmyslennoe" }, score: { creator: 2 } },
  ] },
  { q: { en: "Where does your spiritual strength feel most natural?", ru: "Gde tvoya dukhovnaya sila chuvstvuetsya estestvennee vsego?" }, opts: [
    { label: { en: "Protecting what matters and staying devoted", ru: "Zaschischat vazhnoe i ostavatsya predannym" }, score: { guardian: 2 } },
    { label: { en: "Listening deeply and reflecting truth back", ru: "Gluboko slushat i otrazhat pravdu" }, score: { guide: 2 } },
    { label: { en: "Feeling energy, symbols, and hidden connections", ru: "Chuvstvovat energiyu, simvoly i skrytye svyazi" }, score: { mystic: 2 } },
    { label: { en: "Learning, exploring, and testing what is true", ru: "Uchitsya, issledovat i proveriyat, chto istinno" }, score: { seeker: 2 } },
  ] },
  { q: { en: "Which practice sounds most nourishing today?", ru: "Kakaya praktika segodnya zvuchit samoy pitayuschey?" }, opts: [
    { label: { en: "Journaling one honest question", ru: "Zapisat odin chestnyy vopros" }, score: { seeker: 2 } },
    { label: { en: "A quiet ritual with candle, card, or symbol", ru: "Tikhiy ritual so svechoy, kartoy ili simvolom" }, score: { mystic: 2 } },
    { label: { en: "A grounding boundary or protective prayer", ru: "Zazemlyayuschaya granitsa ili zaschitnaya molitva" }, score: { guardian: 2 } },
    { label: { en: "Creating something with my hands", ru: "Sozdat chto-to svoimi rukami" }, score: { creator: 2 } },
  ] },
  { q: { en: "What growth edge feels most familiar?", ru: "Kakaya tochka rosta kazhetsya samoy znakomoy?" }, opts: [
    { label: { en: "I help others before checking my own energy", ru: "Ya pomogayu drugim prezhde chem proveryayu svoyu energiyu" }, score: { healer: 2, guide: 1 } },
    { label: { en: "I know things intuitively but struggle to ground them", ru: "Ya znayu veschi intuitivno, no mne trudno ikh zazemlit" }, score: { mystic: 2 } },
    { label: { en: "I can become rigid when I am trying to protect peace", ru: "Ya mogu stanovitsya zhestkim, kogda pytayus zaschitit mir" }, score: { guardian: 2 } },
    { label: { en: "I wait for perfection before sharing what wants to move through me", ru: "Ya zhdu sovershenstva prezhde chem delitsya tem, chto khochet proyti cherez menya" }, score: { creator: 2 } },
  ] },
];

function calcSpiritualPath(answers: number[]): SpiritualPath {
  const scores: Record<SpiritualPath, number> = { seeker: 0, mystic: 0, guide: 0, healer: 0, guardian: 0, creator: 0 };
  answers.forEach((a, qi) => {
    const opt = SPIRITUAL_PATH_Q[qi]?.opts[a];
    if (opt) Object.entries(opt.score).forEach(([k, v]) => { scores[k as SpiritualPath] += v ?? 0; });
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as SpiritualPath;
}

// ── Node 1: Meditation Timer ──────────────────────────────────────────────────
const DURATIONS = [
  { min: 3, label: { en: "3 min", ru: "3 min" } },
  { min: 5, label: { en: "5 min", ru: "5 min" } },
  { min: 10, label: { en: "10 min", ru: "10 min" } },
];

function SpiritNode1MeditationLegacy() {
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
    in:   { en: "Inhale", ru: "Vdokh" },
    hold: { en: "Hold",   ru: "Zaderzhka" },
    out:  { en: "Exhale", ru: "Vydokh" },
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
              {false
                ? "Meditatsiya — osnova dukhovnoy praktiki. Dazhe neskolko minut v tishine menyayut kachestvo vsego dnya."
                : "Meditation is the foundation of spiritual practice. Even a few minutes of stillness transform the quality of your entire day."}
            </p>
          </div>
          <p style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", textAlign: "center", marginBottom: 14 }}>
            {false ? "VYBERI DLITELNOST" : "CHOOSE DURATION"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
            {DURATIONS.map(d => (
              <button key={d.min} onClick={() => setChosen(d.min)} style={{ padding: "16px 8px", borderRadius: 14, border: `1.5px solid ${chosen === d.min ? "rgba(216,168,95,.7)" : "rgba(255,255,255,.12)"}`, background: chosen === d.min ? "rgba(216,168,95,.12)" : "rgba(14,10,32,.4)", cursor: "pointer", fontFamily: "var(--font-serif)", fontSize: 22, color: chosen === d.min ? "var(--gold)" : "var(--muted)" }}>
                {d.label.en}
              </button>
            ))}
          </div>
          <button onClick={startMeditation} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Nachat meditatsiyu →" : "Begin meditation →"}
          </button>
        </div>
      )}

      {phase === "active" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".08em", marginBottom: 30 }}>
            {false ? "KONTsENTRIRUYSYa NA DYKhANII" : "FOCUS ON YOUR BREATH"}
          </p>

          {/* Breathing orb */}
          <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto 30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Outer glow */}
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(120,50,200,.08)", filter: "blur(20px)", transform: `scale(${BREATH_SCALE[breathPhase]})`, transition: `transform ${breathPhase === "in" ? 4 : breathPhase === "hold" ? 0.1 : 6}s ease-in-out` }} />
            {/* Main orb */}
            <div style={{ width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, rgba(180,120,255,.4), rgba(40,20,80,.9))", border: "1.5px solid rgba(160,100,240,.6)", boxShadow: "0 0 40px rgba(140,60,220,.5), inset 0 0 30px rgba(100,40,180,.3)", transform: `scale(${BREATH_SCALE[breathPhase]})`, transition: `transform ${breathPhase === "in" ? 4 : breathPhase === "hold" ? 0.1 : 6}s ease-in-out`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: "rgba(220,190,255,.9)", fontWeight: 600, letterSpacing: ".1em" }}>
                {BREATH_LABEL[breathPhase].en}
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
            {false ? "Ostanovit" : "Stop"}
          </button>
        </div>
      )}

      {phase === "done" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 14 }}>&#10024;</div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 10 }}>
            {false ? "Otlichno sdelano" : "Well done"}
          </h3>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
            {false
              ? `Ty meditiroval ${chosen} minut. Zamet, kak ty sebya chuvstvuesh pryamo seychas — eto i est tvoya praktika.`
              : `You meditated for ${chosen} minutes. Notice how you feel right now — this is your practice.`}
          </p>
          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {false ? "Zavershit uzel ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Node 2: Breathwork ────────────────────────────────────────────────────────
function SpiritNode1() {
  const router = useRouter();
  const [qIdx, setQIdx] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<SpiritualPath | null>(null);

  useEffect(() => { startNode(DISCIPLINE, 1); }, []);

  const answer = (i: number) => {
    const next = [...answers, i];
    setAnswers(next);
    if (next.length >= SPIRITUAL_PATH_Q.length) {
      setResult(calcSpiritualPath(next));
      setQIdx(SPIRITUAL_PATH_Q.length);
    } else {
      setQIdx(qIdx + 1);
    }
  };

  const q = qIdx >= 0 && qIdx < SPIRITUAL_PATH_Q.length ? SPIRITUAL_PATH_Q[qIdx] : null;
  const data = result ? SPIRITUAL_PATHS[result] : null;

  return (
    <div>
      {qIdx === -1 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>&#10024;</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>
              Your Spiritual Path
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              Answer a few questions to reveal the kind of spiritual path you naturally resonate with. Your answers point to a practical way your inner life wants to move.
            </p>
          </div>
          <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Proyti test в†’" : "Take the quiz в†’"}
          </button>
        </div>
      )}

      {q && (
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {SPIRITUAL_PATH_Q.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= qIdx ? "var(--gold)" : "rgba(255,255,255,.1)" }} />)}
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{qIdx + 1} / {SPIRITUAL_PATH_Q.length}</p>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--text)", marginBottom: 20, lineHeight: 1.35 }}>
            {q.q.en}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => answer(i)} style={{ textAlign: "left", padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(216,168,95,.25)", background: "rgba(14,10,32,.55)", color: "var(--text)", fontSize: 14, lineHeight: 1.45, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                {opt.label.en}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && data && qIdx === SPIRITUAL_PATH_Q.length && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
              Your Spiritual Path
            </p>
            <div style={{ width: 100, height: 100, margin: "0 auto 12px", borderRadius: "50%", background: `radial-gradient(circle, ${data.color}33, rgba(14,10,32,.95))`, border: `2px solid ${data.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${data.color}44` }}>
              <span style={{ fontSize: 46 }}>&#10024;</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>{data.en}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>Your answers point to this path</p>
          </div>

          {[
            { label: "PATH DESCRIPTION", body: data.desc },
            { label: "NATURAL STRENGTH", body: data.strength },
            { label: "GROUNDING PRACTICE", body: data.practice },
            { label: "GROWTH REMINDER", body: data.reminder },
          ].map((item) => (
            <div key={item.label} style={{ border: `1px solid ${data.color}44`, borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.55)", marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{item.label}</p>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{item.body}</p>
            </div>
          ))}

          <div style={{ marginBottom: 20 }} />
          <button onClick={() => { completeNode(DISCIPLINE, 1, { meditationMin: 0 }); router.push("/sky/spiritual"); }} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {false ? "Zavershit uzel вњ“" : "Complete node вњ“"}
          </button>
        </div>
      )}
    </div>
  );
}

type BreathTech = "478" | "box" | "energising";
const BREATH_TECHS: Record<BreathTech, {
  name: { en: string; ru: string };
  desc: { en: string; ru: string };
  phases: { label: { en: string; ru: string }; duration: number }[];
  cycles: number;
}> = {
  "478": {
    name: { en: "4-7-8 Breathing", ru: "Dykhanie 4-7-8" },
    desc: { en: "A calming technique that activates your parasympathetic system. Excellent for stress and sleep.", ru: "Uspokaivayuschaya tekhnika, aktiviruet parasimpaticheskuyu nervnuyu sistemu. Otlichno pri stresse i dlya sna." },
    phases: [
      { label: { en: "Inhale", ru: "Vdokh" }, duration: 4 },
      { label: { en: "Hold", ru: "Zaderzhka" }, duration: 7 },
      { label: { en: "Exhale", ru: "Vydokh" }, duration: 8 },
    ],
    cycles: 4,
  },
  box: {
    name: { en: "Box Breathing", ru: "Kvadratnoe dykhanie" },
    desc: { en: "Used by Navy SEALs and athletes. Balances the nervous system and sharpens focus.", ru: "Ispolzuetsya spetsnazom i sportsmenami. Balansiruet nervnuyu sistemu i obostryaet fokus." },
    phases: [
      { label: { en: "Inhale", ru: "Vdokh" }, duration: 4 },
      { label: { en: "Hold", ru: "Zaderzhka" }, duration: 4 },
      { label: { en: "Exhale", ru: "Vydokh" }, duration: 4 },
      { label: { en: "Hold", ru: "Zaderzhka" }, duration: 4 },
    ],
    cycles: 4,
  },
  energising: {
    name: { en: "Energising Breath", ru: "Zaryazhayuschee dykhanie" },
    desc: { en: "Quick inhales with extended exhale to increase oxygen and energy. Morning practice.", ru: "Bystrye vdokhi s udlinennym vydokhom. Uvelichivaet kislorod i energiyu. Utrennyaya praktika." },
    phases: [
      { label: { en: "Quick Inhale", ru: "Bystryy vdokh" }, duration: 2 },
      { label: { en: "Quick Inhale", ru: "Bystryy vdokh" }, duration: 2 },
      { label: { en: "Long Exhale", ru: "Dlinnyy vydokh" }, duration: 6 },
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
              {false
                ? "Dykhanie — samyy bystryy sposob izmenit sostoyanie. Kazhdaya tekhnika sozdaet raznyy effekt."
                : "Breathing is the fastest way to change your state. Each technique creates a different effect."}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {(Object.keys(BREATH_TECHS) as BreathTech[]).map(k => (
              <button key={k} onClick={() => setChosen(k)} style={{ textAlign: "left", padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${chosen === k ? "rgba(216,168,95,.6)" : "rgba(255,255,255,.1)"}`, background: chosen === k ? "rgba(216,168,95,.08)" : "rgba(14,10,32,.4)", cursor: "pointer" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: chosen === k ? "var(--gold-2)" : "var(--text)", marginBottom: 4 }}>{BREATH_TECHS[k].name.en}</p>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.45 }}>{BREATH_TECHS[k].desc.en}</p>
              </button>
            ))}
          </div>
          <button onClick={startBreath} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Nachat praktiku →" : "Begin practice →"}
          </button>
        </div>
      )}

      {phase === "active" && currentPhase && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".1em", marginBottom: 4 }}>
            {tech.name.en}
          </p>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 24 }}>
            {false ? `Tsikl ${cycleNum} iz ${totalCycles}` : `Cycle ${cycleNum} of ${totalCycles}`}
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
                {currentPhase.label.en}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
            {tech.phases.map((p, i) => (
              <div key={i} style={{ padding: "4px 12px", borderRadius: 999, fontSize: 11, background: i === phaseIdx ? `${PHASE_COLORS[i % PHASE_COLORS.length]}22` : "rgba(255,255,255,.04)", border: `1px solid ${i === phaseIdx ? PHASE_COLORS[i % PHASE_COLORS.length] : "rgba(255,255,255,.08)"}`, color: i === phaseIdx ? PHASE_COLORS[i % PHASE_COLORS.length] : "var(--muted-2)" }}>
                {p.label.en} {p.duration}s
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 14 }}>&#10024;</div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 10 }}>
            {false ? "Praktika zavershena" : "Practice complete"}
          </h3>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
            {false
              ? `${totalCycles} tsiklov ${tech.name.en} zaversheno. Kak tvoe telo chuvstvuet sebya seychas?`
              : `${totalCycles} cycles of ${tech.name.en} complete. How does your body feel right now?`}
          </p>
          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {false ? "Zavershit uzel ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
type SpiritMvpResult = {
  key: string;
  title: string;
  desc: string;
  practice: string;
  reminder: string;
  color: string;
};

type SpiritMvpConfig = {
  nodeId: number;
  resultKey: "spiritualBreathwork" | "spiritualMeditation" | "spiritualVisualization" | "spiritualEnergyBody" | "spiritualShadow";
  eyebrow: string;
  title: string;
  intro: string;
  startLabel: string;
  question: string;
  results: Record<string, SpiritMvpResult>;
};

const SPIRIT_MVP_CONFIGS: Record<string, SpiritMvpConfig> = {
  "3": {
    nodeId: 3,
    resultKey: "spiritualBreathwork",
    eyebrow: "Your Breathwork Pattern",
    title: "Discover Your Breathwork",
    intro: "This node is a quick matching result, separate from the timed breath practice. Your answers point to the breath style your system may need today.",
    startLabel: "Find my breathwork",
    question: "What does your body seem to need most right now?",
    results: {
      calming: { key: "calming", title: "Calming Breath", desc: "Your answers point to a practice that softens urgency and helps the nervous system settle.", practice: "Try a 4-count inhale and 6-count exhale for three quiet rounds.", reminder: "This may reflect a need to slow the pace before choosing the next action.", color: "#7ab8d8" },
      clearing: { key: "clearing", title: "Clearing Breath", desc: "Your answers point to a practice that moves stale energy and brings more space into the body.", practice: "Take three full inhales through the nose, then sigh out through the mouth.", reminder: "This may reflect emotion that wants movement, not analysis.", color: "#d8a85f" },
      grounding: { key: "grounding", title: "Grounding Breath", desc: "Your answers point to a practice that returns attention to the body, weight, and present moment.", practice: "Place both feet down and breathe into the lower belly for five breaths.", reminder: "This may reflect a need for safety before insight.", color: "#7ab04a" },
    },
  },
  "4": {
    nodeId: 4,
    resultKey: "spiritualMeditation",
    eyebrow: "Your Meditation Style",
    title: "Discover Your Meditation",
    intro: "This MVP helps choose a meditation doorway. Your answers point to the style of stillness that may feel most natural.",
    startLabel: "Find my meditation style",
    question: "What kind of stillness feels most possible?",
    results: {
      body: { key: "body", title: "Body Meditation", desc: "Your answers point to stillness through sensation, grounding, and gentle body awareness.", practice: "Scan from feet to head and name one sensation without changing it.", reminder: "This may reflect a path where the body becomes the doorway.", color: "#7ab04a" },
      mantra: { key: "mantra", title: "Mantra Meditation", desc: "Your answers point to stillness through repetition, sound, and a phrase that gathers the mind.", practice: "Repeat a simple phrase like I return for twelve slow breaths.", reminder: "This may reflect a mind that calms through rhythm.", color: "#9070d8" },
      witness: { key: "witness", title: "Witness Meditation", desc: "Your answers point to stillness through observing thoughts without chasing every one.", practice: "Watch thoughts pass for two minutes and gently say thinking when one appears.", reminder: "This may reflect a need to create space around the inner weather.", color: "#d8a85f" },
    },
  },
  "5": {
    nodeId: 5,
    resultKey: "spiritualVisualization",
    eyebrow: "Your Visualization Gateway",
    title: "Discover Your Visualization",
    intro: "This MVP identifies the image style that may help your intuition focus without forcing it.",
    startLabel: "Find my visualization",
    question: "Which image feels easiest to enter?",
    results: {
      light: { key: "light", title: "Light Gateway", desc: "Your answers point to visualization through light, warmth, color, and gentle radiance.", practice: "Imagine a soft light at the heart expanding one breath at a time.", reminder: "This may reflect an intuitive system that responds to brightness and warmth.", color: "#d8a85f" },
      path: { key: "path", title: "Path Gateway", desc: "Your answers point to visualization through roads, doors, thresholds, and forward movement.", practice: "Imagine a quiet path and notice the next symbol that appears.", reminder: "This may reflect a need for direction without overplanning.", color: "#7ab8d8" },
      temple: { key: "temple", title: "Inner Temple", desc: "Your answers point to visualization through sacred space, protection, and inner sanctuary.", practice: "Imagine a room that belongs only to your spirit and notice what is inside.", reminder: "This may reflect a need for privacy, reverence, and energetic shelter.", color: "#9070d8" },
    },
  },
  "6": {
    nodeId: 6,
    resultKey: "spiritualEnergyBody",
    eyebrow: "Your Energy Body",
    title: "Discover Your Energy Body",
    intro: "This MVP does not diagnose energy centers. Your answers point to the part of your subtle body that may want gentle attention.",
    startLabel: "Find my energy focus",
    question: "Where does your energy most often feel loud or blocked?",
    results: {
      heart: { key: "heart", title: "Heart Field", desc: "Your answers point to sensitivity around care, grief, connection, or receiving love.", practice: "Place a hand over the chest and breathe as if making more room around the heart.", reminder: "This may reflect a need to receive without earning it.", color: "#e06090" },
      voice: { key: "voice", title: "Voice Field", desc: "Your answers point to sensitivity around expression, truth, timing, and being heard.", practice: "Hum softly for five breaths before writing one honest sentence.", reminder: "This may reflect a truth that wants a gentle channel.", color: "#7ab8d8" },
      root: { key: "root", title: "Root Field", desc: "Your answers point to sensitivity around safety, stability, money, body, or belonging.", practice: "Press your feet into the floor and name three things supporting you right now.", reminder: "This may reflect a need to make spirit practical and embodied.", color: "#7ab04a" },
    },
  },
  "7": {
    nodeId: 7,
    resultKey: "spiritualShadow",
    eyebrow: "Your Shadow Reflection",
    title: "Discover Your Shadow Reflection",
    intro: "This MVP offers a careful reflection prompt. Your answers point to a pattern that may need compassion and honesty.",
    startLabel: "Find my reflection",
    question: "Which inner pattern feels ready to be met more honestly?",
    results: {
      control: { key: "control", title: "The Control Mirror", desc: "Your answers point to a pattern of trying to stay safe by managing outcomes too tightly.", practice: "Ask what is mine to guide and what life must be allowed to reveal.", reminder: "This may reflect fear asking for steadiness, not judgment.", color: "#d8a85f" },
      hiding: { key: "hiding", title: "The Hiding Mirror", desc: "Your answers point to a pattern of staying unseen when your truth or creativity wants more air.", practice: "Share one small true thing in a place that feels safe enough.", reminder: "This may reflect protection that is ready to soften.", color: "#9070d8" },
      overgiving: { key: "overgiving", title: "The Overgiving Mirror", desc: "Your answers point to a pattern of offering care before checking your own capacity.", practice: "Before saying yes, pause and ask whether the yes includes you.", reminder: "This may reflect love learning boundaries.", color: "#e06090" },
    },
  },
};

function getSavedString(nodeId: number, key: string) {
  const value = getNodeState(DISCIPLINE, nodeId).result?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function SpiritMvpNode({ config }: { config: SpiritMvpConfig }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<SpiritMvpResult | null>(null);

  useEffect(() => {
    const saved = getSavedString(config.nodeId, config.resultKey);
    if (saved && config.results[saved]) {
      setResult(config.results[saved]);
      setStarted(true);
      return;
    }
    startNode(DISCIPLINE, config.nodeId);
  }, [config]);

  const handleComplete = () => {
    if (!result) return;
    completeNode(DISCIPLINE, config.nodeId, { [config.resultKey]: result.key });
    router.push("/sky/spiritual");
  };

  return (
    <div>
      {!started && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>*</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>{config.title}</h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{config.intro}</p>
          </div>
          <button onClick={() => setStarted(true)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>{config.startLabel}</button>
        </div>
      )}
      {started && !result && (
        <div>
          <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>{config.eyebrow}</p>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 21, color: "var(--text)", marginBottom: 18, lineHeight: 1.35 }}>{config.question}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.values(config.results).map((option) => (
              <button key={option.key} onClick={() => setResult(option)} style={{ textAlign: "left", padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(216,168,95,.25)", background: "rgba(14,10,32,.55)", color: "var(--text)", cursor: "pointer" }}>
                <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--gold-2)", marginBottom: 5 }}>{option.title}</span>
                <span style={{ display: "block", fontSize: 12, color: "var(--muted)", lineHeight: 1.45 }}>{option.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {result && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>{config.eyebrow}</p>
            <div style={{ width: 100, height: 100, margin: "0 auto 12px", borderRadius: "50%", background: `radial-gradient(circle, ${result.color}33, rgba(14,10,32,.95))`, border: `2px solid ${result.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${result.color}44` }}><span style={{ fontSize: 44 }}>*</span></div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>{result.title}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>Your answers point to this practice pattern</p>
          </div>
          {[{ label: "INTERPRETATION", body: result.desc }, { label: "PRACTICE", body: result.practice }, { label: "GROWTH REMINDER", body: result.reminder }].map((item) => (
            <div key={item.label} style={{ border: `1px solid ${result.color}44`, borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.55)", marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{item.label}</p>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{item.body}</p>
            </div>
          ))}
          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)", marginTop: 10 }}>Complete node</button>
        </div>
      )}
    </div>
  );
}

function SpiritNode8() {
  const router = useRouter();
  const [saved, setSaved] = useState<Array<{ title: string; value: string }>>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const state = getNodeState(DISCIPLINE, 8);
    setCompleted(state.status === "completed");
    if (state.status !== "completed") startNode(DISCIPLINE, 8);
    setSaved([
      { title: "Spiritual Path", value: getSavedString(1, "spiritualPath") || getSavedString(1, "meditationMin") },
      { title: "Breathwork Practice", value: getSavedString(2, "breathTech") },
      { title: "Breathwork", value: getSavedString(3, "spiritualBreathwork") },
      { title: "Meditation", value: getSavedString(4, "spiritualMeditation") },
      { title: "Visualization", value: getSavedString(5, "spiritualVisualization") },
      { title: "Energy Body", value: getSavedString(6, "spiritualEnergyBody") },
      { title: "Shadow Reflection", value: getSavedString(7, "spiritualShadow") },
    ].filter((item) => item.value));
  }, []);

  const handleComplete = () => {
    completeNode(DISCIPLINE, 8, { spiritualPracticeSystem: saved.map((item) => item.value).join("|") || "partial" });
    setCompleted(true);
    router.push("/sky/spiritual");
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>*</div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "var(--text)", marginBottom: 10 }}>Your Personal Practice System</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>This gathers the practice results available so far into a simple spiritual routine. If some results are missing, your system stays partial and can deepen later.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {saved.length ? saved.map((item) => (
          <div key={item.title} style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "13px 15px", background: "rgba(14,10,32,.55)" }}>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".09em", marginBottom: 5 }}>{item.title.toUpperCase()}</p>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.45 }}>{item.value}</p>
          </div>
        )) : (
          <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.55)" }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>Complete earlier spiritual practice nodes to add more detail to this system.</p>
          </div>
        )}
      </div>
      <div style={{ border: "1px solid rgba(160,130,220,.25)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.55)", marginBottom: 18 }}>
        <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>REFLECTION</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>What is the smallest practice you can repeat without forcing yourself?</p>
      </div>
      <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>{completed ? "Complete again" : "Complete node"}</button>
    </div>
  );
}

const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Spiritual Path",  ru: "Meditatsiya", sub: { en: "Foundation",  ru: "Osnova" } },
  "2": { en: "Breathwork",  ru: "Dykhanie",   sub: { en: "Energy",      ru: "Energiya" } },
  "3": { en: "Breathwork", ru: "Dykhanie", sub: { en: "Pattern", ru: "Pattern" } },
  "4": { en: "Meditation", ru: "Meditatsiya", sub: { en: "Stillness", ru: "Tishina" } },
  "5": { en: "Visualization", ru: "Vizualizatsiya", sub: { en: "Inner image", ru: "Vnutrenniy obraz" } },
  "6": { en: "Energy Body", ru: "Energeticheskoe telo", sub: { en: "Subtle focus", ru: "Tonkiy fokus" } },
  "7": { en: "Shadow Reflection", ru: "Tenevoe otrazhenie", sub: { en: "Integration", ru: "Integratsiya" } },
  "8": { en: "Personal Practice System", ru: "Lichnaya sistema praktik", sub: { en: "Synthesis", ru: "Sintez" } },
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
  const nodeNum = parseInt(nodeId);
  const title = meta.en;
  const subtitle = meta.sub.en;

  if (locked) return (
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/spiritual">
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/spiritual">
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
          <p style={{ color: "var(--muted)" }}>Complete the previous node first</p>
        </div>
      </NodePage>
    </SkyNodeEntitlementGate>
  );

  return (
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/spiritual">
      <NodePage
        title={title}
        subtitle={subtitle}
        nodeNum={nodeNum}
        totalNodes={TOTAL}
        backHref="/sky/spiritual"
        badge={state.status === "completed" ? "completed" : undefined}
      >
        {nodeId === "1" && <SpiritNode1 />}
        {nodeId === "2" && <SpiritNode2 />}
        {SPIRIT_MVP_CONFIGS[nodeId] && <SpiritMvpNode config={SPIRIT_MVP_CONFIGS[nodeId]} />}
        {nodeId === "8" && <SpiritNode8 />}
      </NodePage>
    </SkyNodeEntitlementGate>
  );
}
