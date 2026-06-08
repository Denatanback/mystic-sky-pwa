"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { NodePage } from "@/components/sky/NodePage";
import { CooldownNodeMessage } from "@/components/sky/CooldownNodeMessage";
import { useLang } from "@/lib/i18n";
import { lifePathNumber, soulNumber, NUMBER_TRAITS } from "@/lib/numerologyCalc";
import { startNode, completeNode, getNodeState, isNodeLocked, isNodeCoolingDown } from "@/lib/nodeProgress";
import { getCurrentProfile, type CurrentProfile } from "@/lib/profile/currentProfile";

const TOTAL = 8;
const DISCIPLINE = "numerology";

const DESTINY_CODES: Record<number, { name: string; interpretation: string }> = {
  1: { name: "Leader", interpretation: "You are here to initiate, choose boldly, and move first when a path needs direction." },
  2: { name: "Diplomat", interpretation: "You are here to sense what others miss and create trust where people need connection." },
  3: { name: "Creator", interpretation: "You are here to express, uplift, and turn emotion into something others can feel." },
  4: { name: "Builder", interpretation: "You are here to make ideas real through structure, patience, and steady devotion." },
  5: { name: "Explorer", interpretation: "You are here to keep life moving, open new doors, and learn through freedom." },
  6: { name: "Protector", interpretation: "You are here to care deeply, restore harmony, and become a safe place for others." },
  7: { name: "Mystic", interpretation: "You are here to look beneath the surface and follow the quiet truth inside you." },
  8: { name: "Strategist", interpretation: "You are here to work with power, resources, and ambition in a conscious way." },
  9: { name: "Teacher", interpretation: "You are here to transform experience into wisdom that can help more than yourself." },
  11: { name: "Visionary", interpretation: "You are here to translate intuition into inspiration others can recognize and follow." },
  22: { name: "Master Builder", interpretation: "You are here to build something larger than personal success, with vision and discipline." },
  33: { name: "Healer", interpretation: "You are here to lead through compassion, service, and emotional truth." },
};

// ── Node 1: Life Path Number ─────────────────────────────────────────────────
function NumNode1() {
  const { lang } = useLang();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [animIdx, setAnimIdx] = useState(-1);
  const [user, setUser] = useState<CurrentProfile | null>(null);

  const calc = user?.birthDate ? lifePathNumber(user.birthDate) : null;
  const traits = calc ? (NUMBER_TRAITS[calc.result] ?? null) : null;
  const destiny = calc ? DESTINY_CODES[calc.result] : null;

  useEffect(() => {
    startNode(DISCIPLINE, 1);
    void getCurrentProfile().then(setUser);
  }, []);

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
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", marginBottom: 8 }}>{false ? "Zavershi personalnuyu nastroyku" : "Complete your personal setup"}</h2>
      <p style={{ color: "var(--muted)", marginBottom: 16 }}>{false ? "Data rozhdeniya nuzhna, chtoby rasschitat etu chast puti." : "Your birth date is needed to calculate this part of your path."}</p>
      <button onClick={() => router.push("/onboarding?step=birth")} style={{ padding: "12px 28px", borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{false ? "Prodolzhit nastroyku" : "Continue setup"}</button>
    </div>
  );

  if (!calc) return null;

  return (
    <div>
      {step === 0 && (
        <div>
          <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.5)", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{false ? "TVOYa DATA ROZhDENIYa" : "YOUR BIRTH DATE"}</p>
            <p style={{ fontSize: 22, color: "var(--text)", fontFamily: "var(--font-serif)", letterSpacing: ".06em" }}>
              {new Date(user.birthDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.45)", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {false
                ? "Chislo Zhiznennogo Puti — glavnoe chislo v numerologii. Ono vychislyaetsya iz daty rozhdeniya i raskryvaet osnovnuyu vibratsiyu tvoego puti na Zemle."
                : "Your Destiny Code is calculated from your birth date. It turns your Life Path number into a clear archetype for the way you naturally move through life."}
            </p>
          </div>
          <button onClick={startAnim} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Nachat raschet →" : "Start calculation →"}
          </button>
        </div>
      )}

      {step === 1 && calc && (
        <div>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginBottom: 16 }}>{false ? "Razbivaem datu po shagam..." : "Breaking down your date..."}</p>
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

      {step === 2 && calc && traits && destiny && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
              Your Destiny Code
            </p>
            <div style={{ width: 110, height: 110, margin: "0 auto 14px", borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, rgba(216,168,95,.25), rgba(80,30,160,.9))", border: "2px solid rgba(216,168,95,.7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(216,168,95,.35)" }}>
              <span style={{ fontSize: 52, fontFamily: "var(--font-serif)", color: "var(--gold)", fontWeight: 400 }}>{calc.result}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 30, color: "var(--text)", marginBottom: 4 }}>
              {destiny.name}
            </h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{`Number ${calc.result} - ${traits.name.en}`}</p>
          </div>

          <div style={{ border: "1px solid rgba(216,168,95,.25)", borderRadius: 16, padding: "16px", background: "rgba(216,168,95,.06)", marginBottom: 14 }}>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.65 }}>{destiny.interpretation}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {traits.traits.map((tr, i) => (
              <div key={i} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(160,130,220,.25)", background: "rgba(14,10,32,.55)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--gold-2)", marginBottom: 6 }}>{tr.title.en}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{tr.body.en}</p>
              </div>
            ))}
          </div>

          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {false ? "Zavershit uzel ✓" : "Complete node ✓"}
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
  const [user, setUser] = useState<CurrentProfile | null>(null);

  const firstName = user?.fullName?.split(" ")[0] ?? "";
  const calc = firstName ? soulNumber(firstName) : null;
  const traits = calc ? (NUMBER_TRAITS[calc.result] ?? null) : null;

  useEffect(() => {
    startNode(DISCIPLINE, 2);
    void getCurrentProfile().then(setUser);
  }, []);

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

  if (!user?.fullName) return (
    <div style={{ textAlign: "center", padding: "40px 16px" }}>
      <p style={{ color: "var(--muted)" }}>{false ? "Ukazhi imya v profile" : "Add your name in profile"}</p>
    </div>
  );

  return (
    <div>
      {step === 0 && (
        <div>
          <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.5)", marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{false ? "IMYa DLYa RASChETA" : "NAME FOR CALCULATION"}</p>
            <p style={{ fontSize: 24, color: "var(--text)", fontFamily: "var(--font-serif)", letterSpacing: ".06em" }}>{firstName}</p>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.45)", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {false
                ? "Chislo Dushi (Zhelanie Serdtsa) vychislyaetsya iz glasnykh tvoego imeni. Ono raskryvaet glubinnye zhelaniya i to, chto po-nastoyaschemu dvizhet toboy iznutri."
                : "The Soul Number (Heart's Desire) is calculated from the vowels in your name. It reveals your deepest desires and what truly drives you from within."}
            </p>
          </div>
          <button onClick={animateVowels} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Nayti glasnye →" : "Find vowels →"}
          </button>
        </div>
      )}

      {(step === 1 || step === 2) && calc && (
        <div>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginBottom: 16 }}>
            {false ? "Podsvechivaem glasnye bukvy..." : "Highlighting vowel letters..."}
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
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{calc.steps[0]}</div>
            <div style={{ width: 100, height: 100, margin: "0 auto 12px", borderRadius: "50%", background: "radial-gradient(circle, rgba(140,70,220,.3), rgba(14,10,32,.95))", border: "2px solid rgba(140,70,220,.5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(140,70,220,.35)" }}>
              <span style={{ fontSize: 46, fontFamily: "var(--font-serif)", color: "#c080f0" }}>{calc.result}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{traits.name.en}</h2>
            <p style={{ fontSize: 12, color: "rgba(180,140,250,1)" }}>{`Soul number: ${calc.result}`}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {traits.traits.map((tr, i) => (
              <div key={i} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(140,70,220,.3)", background: "rgba(14,10,32,.55)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(180,140,250,1)", marginBottom: 6 }}>{tr.title.en}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{tr.body.en}</p>
              </div>
            ))}
          </div>

          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {false ? "Zavershit uzel ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Router ───────────────────────────────────────────────────────────────────
type NumMvpResult = {
  key: string;
  title: string;
  number: string;
  desc: string;
  gift: string;
  reflection: string;
  color: string;
};

type NumMvpConfig = {
  nodeId: number;
  resultKey: "personalityNumber" | "expressionNumber" | "personalYear" | "karmicLesson" | "masterNumberSignal";
  eyebrow: string;
  title: string;
  intro: string;
  startLabel: string;
  question: string;
  results: Record<string, NumMvpResult>;
};

const NUM_MVP_CONFIGS: Record<string, NumMvpConfig> = {
  "3": {
    nodeId: 3,
    resultKey: "personalityNumber",
    eyebrow: "Your Personality Number",
    title: "Discover Your Personality Number",
    intro: "This MVP uses a short reflection instead of a full name calculation. Your answers point to the energy people may first notice in you.",
    startLabel: "Find my personality pattern",
    question: "What do people usually seem to notice first about you?",
    results: {
      warm: { key: "warm", title: "The Harmonizer", number: "6", desc: "Your answers point to a visible warmth that helps people feel cared for and included.", gift: "You make connection feel safer.", reflection: "Where can you let warmth include your own needs too?", color: "#e06090" },
      bright: { key: "bright", title: "The Expressive One", number: "3", desc: "Your answers point to a visible spark of humor, language, creativity, or emotional brightness.", gift: "You help others feel lighter and more open.", reflection: "What wants to be expressed before it becomes overedited?", color: "#d8a85f" },
      steady: { key: "steady", title: "The Reliable One", number: "4", desc: "Your answers point to a visible steadiness that makes people trust your presence.", gift: "You bring shape and calm to scattered situations.", reflection: "Where can consistency support you without becoming pressure?", color: "#7ab04a" },
    },
  },
  "4": {
    nodeId: 4,
    resultKey: "expressionNumber",
    eyebrow: "Your Expression Code",
    title: "Discover Your Expression / Destiny Number",
    intro: "This MVP does not run a full legal-name calculation yet. Your answers point to how your gifts may want to be expressed.",
    startLabel: "Find my expression code",
    question: "When you are at your best, what are you usually doing?",
    results: {
      lead: { key: "lead", title: "The Initiator", number: "1", desc: "Your answers point to an expression pattern that begins, directs, and chooses with courage.", gift: "You can make a path visible by taking the first step.", reflection: "What decision would become simpler if you trusted your own direction?", color: "#d8a85f" },
      teach: { key: "teach", title: "The Teacher", number: "9", desc: "Your answers point to an expression pattern that turns experience into meaning others can use.", gift: "You can transform lived truth into guidance.", reflection: "What lesson are you ready to share more honestly?", color: "#9070d8" },
      build: { key: "build", title: "The Builder", number: "4", desc: "Your answers point to an expression pattern that makes ideas stable, practical, and repeatable.", gift: "You can turn inspiration into a reliable structure.", reflection: "What deserves a real system instead of more intention?", color: "#7ab04a" },
    },
  },
  "5": {
    nodeId: 5,
    resultKey: "personalYear",
    eyebrow: "Your Personal Year",
    title: "Discover Your Personal Year",
    intro: "This MVP uses a reflection prompt for your current cycle. A fuller version can calculate the exact personal year from birth date and calendar year.",
    startLabel: "Find my current cycle",
    question: "What has this year been asking you to practice?",
    results: {
      begin: { key: "begin", title: "Year of Beginning", number: "1", desc: "Your answers point to a cycle of fresh starts, identity, initiative, and new direction.", gift: "You may be ready to choose before every detail is settled.", reflection: "What clean beginning is already asking for your attention?", color: "#d8a85f" },
      change: { key: "change", title: "Year of Change", number: "5", desc: "Your answers point to a cycle of movement, flexibility, experimentation, and release from stale patterns.", gift: "You can learn quickly when you let life move.", reflection: "What wants more freedom without losing your center?", color: "#7ab8d8" },
      integrate: { key: "integrate", title: "Year of Integration", number: "9", desc: "Your answers point to a cycle of closure, wisdom, compassion, and making meaning from what has passed.", gift: "You can bless an ending without shrinking your future.", reflection: "What completion would make space for a truer chapter?", color: "#9070d8" },
    },
  },
  "6": {
    nodeId: 6,
    resultKey: "karmicLesson",
    eyebrow: "Your Karmic Lesson",
    title: "Discover Your Karmic Lesson",
    intro: "This MVP is reflective, not a full karmic-number calculation. Your answers point to a recurring growth pattern that may be ready for attention.",
    startLabel: "Find my lesson",
    question: "Which pattern has been returning most often?",
    results: {
      voice: { key: "voice", title: "The Voice Lesson", number: "3", desc: "Your answers point to a lesson around speaking, creating, and letting your feelings have form.", gift: "Your expression can become medicine when it is honest.", reflection: "Where are you waiting for permission to say what is real?", color: "#d8a85f" },
      boundary: { key: "boundary", title: "The Boundary Lesson", number: "6", desc: "Your answers point to a lesson around care, responsibility, and not confusing love with overgiving.", gift: "You can protect love by giving it clearer edges.", reflection: "What responsibility is not truly yours to carry?", color: "#e06090" },
      trust: { key: "trust", title: "The Trust Lesson", number: "7", desc: "Your answers point to a lesson around inner knowing, solitude, doubt, and trusting quiet truth.", gift: "You can hear yourself more clearly when noise settles.", reflection: "What do you already know but keep asking others to confirm?", color: "#9070d8" },
    },
  },
  "7": {
    nodeId: 7,
    resultKey: "masterNumberSignal",
    eyebrow: "Your Master Number Signal",
    title: "Discover Your Master Number Signal",
    intro: "This MVP does not claim a fixed master number unless calculated elsewhere. Your answers point to the kind of amplified signal you may recognize.",
    startLabel: "Find my signal",
    question: "When life feels intense, what kind of signal usually appears?",
    results: {
      intuition: { key: "intuition", title: "11 Signal", number: "11", desc: "Your answers point to heightened intuition, inspiration, sensitivity, and flashes of inner knowing.", gift: "You can translate subtle perception into useful guidance.", reflection: "What helps your sensitivity become grounded instead of overwhelming?", color: "#9070d8" },
      structure: { key: "structure", title: "22 Signal", number: "22", desc: "Your answers point to a builder signal: vision that wants structure, patience, and real-world form.", gift: "You can hold a large vision without abandoning practical steps.", reflection: "What big idea needs its first simple foundation?", color: "#7ab04a" },
      compassion: { key: "compassion", title: "33 Signal", number: "33", desc: "Your answers point to a service signal: compassion, teaching, emotional repair, and responsibility to the heart.", gift: "You can lead through care when you also care for yourself.", reflection: "Where can service stay loving without becoming self-erasure?", color: "#e06090" },
    },
  },
};

function getSavedString(nodeId: number, key: string) {
  const value = getNodeState(DISCIPLINE, nodeId).result?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function NumMvpNode({ config }: { config: NumMvpConfig }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<NumMvpResult | null>(null);

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
    router.push("/sky/numerology");
  };

  return (
    <div>
      {!started && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>#</div>
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
            <div style={{ width: 104, height: 104, margin: "0 auto 12px", borderRadius: "50%", background: `radial-gradient(circle, ${result.color}33, rgba(14,10,32,.95))`, border: `2px solid ${result.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${result.color}44` }}>
              <span style={{ fontSize: 48, fontFamily: "var(--font-serif)", color: "var(--gold)" }}>{result.number}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>{result.title}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>Your answers point to this number pattern</p>
          </div>
          {[{ label: "INTERPRETATION", body: result.desc }, { label: "GIFT", body: result.gift }, { label: "REFLECTION", body: result.reflection }].map((item) => (
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

function NumNode8() {
  const router = useRouter();
  const [saved, setSaved] = useState<Array<{ title: string; value: string }>>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const state = getNodeState(DISCIPLINE, 8);
    setCompleted(state.status === "completed");
    if (state.status !== "completed") startNode(DISCIPLINE, 8);
    setSaved([
      { title: "Destiny Code", value: getSavedString(1, "lifePathNumber") },
      { title: "Soul Number", value: getSavedString(2, "soulNumber") },
      { title: "Personality Number", value: getSavedString(3, "personalityNumber") },
      { title: "Expression / Destiny Number", value: getSavedString(4, "expressionNumber") },
      { title: "Personal Year", value: getSavedString(5, "personalYear") },
      { title: "Karmic Lesson", value: getSavedString(6, "karmicLesson") },
      { title: "Master Number Signal", value: getSavedString(7, "masterNumberSignal") },
    ].filter((item) => item.value));
  }, []);

  const handleComplete = () => {
    completeNode(DISCIPLINE, 8, { personalCodeSynthesis: saved.map((item) => item.value).join("|") || "partial" });
    setCompleted(true);
    router.push("/sky/numerology");
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>#</div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "var(--text)", marginBottom: 10 }}>Your Personal Code Synthesis</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>This gathers the numerology results available so far. If some results are missing, your synthesis remains partial and can deepen as earlier nodes are completed.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {saved.length ? saved.map((item) => (
          <div key={item.title} style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "13px 15px", background: "rgba(14,10,32,.55)" }}>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".09em", marginBottom: 5 }}>{item.title.toUpperCase()}</p>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.45 }}>{item.value}</p>
          </div>
        )) : (
          <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.55)" }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>Complete earlier numerology nodes to add more detail to this synthesis.</p>
          </div>
        )}
      </div>
      <div style={{ border: "1px solid rgba(160,130,220,.25)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.55)", marginBottom: 18 }}>
        <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>REFLECTION</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>Which number pattern feels most visible in your choices right now?</p>
      </div>
      <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>{completed ? "Complete again" : "Complete node"}</button>
    </div>
  );
}

const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Destiny Code",   ru: "Chislo puti",  sub: { en: "Foundation", ru: "Osnova" } },
  "2": { en: "Soul Number", ru: "Chislo dushi",  sub: { en: "Inner world", ru: "Vnutrenniy mir" } },
  "3": { en: "Personality Number", ru: "Chislo lichnosti", sub: { en: "Outer signal", ru: "Vneshniy signal" } },
  "4": { en: "Expression / Destiny Number", ru: "Chislo vyrazheniya", sub: { en: "Gifts", ru: "Dary" } },
  "5": { en: "Personal Year", ru: "Lichnyy god", sub: { en: "Current cycle", ru: "Tekuschiy tsikl" } },
  "6": { en: "Karmic Lesson", ru: "Karmicheskiy urok", sub: { en: "Growth pattern", ru: "Pattern rosta" } },
  "7": { en: "Master Number Signal", ru: "Signal master-chisla", sub: { en: "Amplified energy", ru: "Usilennaya energiya" } },
  "8": { en: "Personal Code Synthesis", ru: "Sintez lichnogo koda", sub: { en: "Wholeness", ru: "Tselostnost" } },
};

const NODE_CONTEXT: Record<string, { en: string; ru: string }> = {
  "1": {
    en: "Your Destiny Code turns your Life Path number into a clear archetype for your choices, challenges, and recurring direction.",
    ru: "Chislo zhiznennogo puti pokazyvaet ritm tvoikh vyborov, vyzovov i povtoryayuschegosya napravleniya.",
  },
  "2": {
    en: "Your Soul Number points to the inner desire underneath your choices and emotional direction.",
    ru: "Chislo dushi ukazyvaet na vnutrennee zhelanie pod tvoimi vyborami i emotsionalnym napravleniem.",
  },
  "3": { en: "Your Personality Number reflects the energy people may notice first in your presence.", ru: "Chislo lichnosti otrazhaet energiyu, kotoruyu drugie mogut zametit pervoy." },
  "4": { en: "Your Expression / Destiny Number points to how your gifts may want to become visible.", ru: "Chislo vyrazheniya ukazyvaet, kak tvoi dary mogut proyavlyatsya." },
  "5": { en: "Your Personal Year reflects the kind of cycle or lesson that may be active right now.", ru: "Lichnyy god otrazhaet tekuschiy tsikl ili urok." },
  "6": { en: "Your Karmic Lesson points to a recurring growth pattern asking for care and awareness.", ru: "Karmicheskiy urok ukazyvaet na povtoryayuschiysya pattern rosta." },
  "7": { en: "Your Master Number Signal explores the amplified energy you may recognize under intensity.", ru: "Signal master-chisla issleduet usilennuyu energiyu." },
  "8": { en: "Your Personal Code Synthesis gathers your available numerology results into one reflection.", ru: "Sintez lichnogo koda sobiraet dostupnye numerologicheskie rezultaty." },
};

export default function NumerologyNodePage() {
  const params = useParams();
  const nodeId = String(params?.nodeId ?? "1");
  const { lang } = useLang();
  const router = useRouter();

  const nodeNum = parseInt(nodeId);
  const locked = typeof window !== "undefined" ? isNodeLocked(DISCIPLINE, nodeNum) : false;
  const coolingDown = typeof window !== "undefined" ? isNodeCoolingDown(DISCIPLINE, nodeNum) : false;
  const state = typeof window !== "undefined" ? getNodeState(DISCIPLINE, nodeNum) : { status: "locked" };

  const meta = NODE_TITLES[nodeId];
  if (!meta) { router.push("/sky/numerology"); return null; }

  if (locked) return (
    <NodePage title={meta.en} subtitle={meta.sub.en} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/numerology">
      {coolingDown ? <CooldownNodeMessage /> : (
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
          <p style={{ color: "var(--muted)" }}>{false ? "Zavershite predyduschiy uzel" : "Complete the previous node first"}</p>
        </div>
      )}
    </NodePage>
  );

  return (
    <NodePage
      title={meta.en}
      subtitle={meta.sub.en}
      nodeNum={nodeNum}
      totalNodes={TOTAL}
      backHref="/sky/numerology"
      badge={state.status === "completed" ? "completed" : undefined}
    >
      <div style={{ border: "1px solid rgba(216,168,95,.18)", borderRadius: 16, background: "rgba(12,8,28,.48)", padding: 14, marginBottom: 16 }}>
        <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>{false ? "Chast Sky Map" : "Part of your Sky Map"}</p>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 22, fontWeight: 600, lineHeight: 1.1, marginBottom: 6 }}>{false ? "Pochemu etot uzel vazhen" : "Why this node matters"}</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{NODE_CONTEXT[nodeId].en}</p>
      </div>
      {nodeId === "1" && <NumNode1 />}
      {nodeId === "2" && <NumNode2 />}
      {NUM_MVP_CONFIGS[nodeId] && <NumMvpNode config={NUM_MVP_CONFIGS[nodeId]} />}
      {nodeId === "8" && <NumNode8 />}
      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        <Link href="/sky" style={{ height: 46, borderRadius: 999, border: "1px solid rgba(216,168,95,.28)", background: "rgba(216,168,95,.08)", color: "var(--gold-2)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-ui)" }}>
          {false ? "Vernutsya k Sky Map" : "Return to Sky Map"}
        </Link>
        <Link href="/today" style={{ height: 48, borderRadius: 999, border: "none", background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 14, fontWeight: 800, fontFamily: "var(--font-ui)", boxShadow: "0 8px 24px rgba(110,30,130,.40)" }}>
          {false ? "Prodolzhit segodnyashniy put" : "Continue today’s path"}
        </Link>
      </div>
    </NodePage>
  );
}
