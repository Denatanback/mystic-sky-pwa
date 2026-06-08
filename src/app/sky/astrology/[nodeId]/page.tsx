"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NodePage } from "@/components/sky/NodePage";
import { CooldownNodeMessage } from "@/components/sky/CooldownNodeMessage";
import { useLang } from "@/lib/i18n";
import { getSunSign, SUN_TRAITS, ZODIAC, ELEMENT_TRAITS } from "@/lib/astroCalc";
import { startNode, completeNode, getNodeState, isNodeLocked, isNodeCoolingDown } from "@/lib/nodeProgress";
import { getCurrentProfile, type CurrentProfile } from "@/lib/profile/currentProfile";
import { resolveUserZodiac } from "@/lib/astrology/resolveZodiac";

const TOTAL = 8;
const DISCIPLINE = "astrology";

type CosmicArchetype = {
  name: string;
  desc: string;
  signal: string;
};

const COSMIC_ARCHETYPES: Record<string, CosmicArchetype> = {
  "fire-cardinal": {
    name: "Inspirer",
    desc: "You are built to spark movement. Your fire starts quickly, and your cardinal rhythm helps you act before the path is fully visible.",
    signal: "cardinal fire",
  },
  "fire-fixed": {
    name: "Guardian",
    desc: "You protect what matters by standing in your own light. Your fire is steady, loyal, and strongest when your heart is fully involved.",
    signal: "fixed fire",
  },
  "fire-mutable": {
    name: "Explorer",
    desc: "You grow through movement, meaning, and possibility. Your fire needs horizons, truth, and room to keep expanding.",
    signal: "mutable fire",
  },
  "earth-cardinal": {
    name: "Strategist",
    desc: "You turn ambition into structure. Your earth gives you patience, while your cardinal rhythm knows when to begin building.",
    signal: "cardinal earth",
  },
  "earth-fixed": {
    name: "Guardian",
    desc: "You create safety through presence, loyalty, and consistency. Your power is quiet, durable, and hard to shake.",
    signal: "fixed earth",
  },
  "earth-mutable": {
    name: "Strategist",
    desc: "You notice what can be improved and make life work better. Your gift is practical insight that becomes real care.",
    signal: "mutable earth",
  },
  "air-cardinal": {
    name: "Diplomat",
    desc: "You read the space between people and know how to restore balance. Your mind naturally looks for fairness, beauty, and connection.",
    signal: "cardinal air",
  },
  "air-fixed": {
    name: "Visionary",
    desc: "You see patterns before they become obvious. Your fixed air signature gives you original ideas and a future-facing point of view.",
    signal: "fixed air",
  },
  "air-mutable": {
    name: "Inspirer",
    desc: "You move through ideas quickly and wake people up through language, curiosity, and unexpected connections.",
    signal: "mutable air",
  },
  "water-cardinal": {
    name: "Guardian",
    desc: "You lead through care. Your emotional instincts notice what needs protection, comfort, and belonging before anyone says it out loud.",
    signal: "cardinal water",
  },
  "water-fixed": {
    name: "Strategist",
    desc: "You understand hidden motives and emotional depth. Your power is focused, magnetic, and transformational.",
    signal: "fixed water",
  },
  "water-mutable": {
    name: "Visionary",
    desc: "You receive life through intuition, dreams, and subtle feeling. Your imagination turns sensitivity into guidance.",
    signal: "mutable water",
  },
};

// ── Shared card flip component ───────────────────────────────────────────────
function FlipCard({ front, back, flipped, onClick }: { front: string; back: string; flipped: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ cursor: "pointer", perspective: 600, height: 110 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform .5s ease" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 14, border: "1px solid rgba(216,168,95,.3)", background: "rgba(14,10,32,.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 14, textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gold-2)" }}>{front}</span>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 14, border: "1px solid rgba(140,70,220,.5)", background: "radial-gradient(circle at 40% 30%, rgba(120,50,200,.25), rgba(14,10,32,.95))", display: "flex", alignItems: "center", justifyContent: "center", padding: 14, textAlign: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5 }}>{back}</span>
        </div>
      </div>
    </div>
  );
}

// ── Node 1: Sun Sign ─────────────────────────────────────────────────────────
function AstroNode1() {
  const { lang } = useLang();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);
  const [allFlipped, setAllFlipped] = useState(false);
  const [user, setUser] = useState<CurrentProfile | null>(null);

  const sign = user?.birthDate
    ? ZODIAC.find((item) => item.key === resolveUserZodiac(user).key) ?? getSunSign(user.birthDate)
    : null;
  const traits = sign ? (SUN_TRAITS[sign.key] ?? []) : [];
  const elementTraits = sign ? (ELEMENT_TRAITS[sign.element] ?? null) : null;
  const cosmicArchetype = sign ? COSMIC_ARCHETYPES[`${sign.element}-${sign.quality}`] : null;

  useEffect(() => {
    startNode(DISCIPLINE, 1);
    void getCurrentProfile().then(setUser);
  }, []);

  const flip = (i: number) => {
    const next = flipped.map((v, idx) => idx === i ? true : v);
    setFlipped(next);
    if (next.every(Boolean)) setAllFlipped(true);
  };

  const handleComplete = () => {
    completeNode(DISCIPLINE, 1, { sign: sign?.key });
    router.push("/sky/astrology");
  };

  const ELEMENT_COLOR: Record<string, string> = { fire: "#e84040", earth: "#7ab04a", air: "#d8a85f", water: "#4090c0" };

  if (!user?.birthDate) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", marginBottom: 8 }}>{false ? "Zavershi personalnuyu nastroyku" : "Complete your personal setup"}</h2>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>{false ? "Data rozhdeniya nuzhna, chtoby rasschitat etu chast puti." : "Your birth date is needed to calculate this part of your path."}</p>
      <button onClick={() => router.push("/onboarding?step=birth")} style={{ padding: "12px 28px", borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{false ? "Prodolzhit nastroyku" : "Continue setup"}</button>
    </div>
  );

  return (
    <div>
      {/* Step 0: Intro + sign reveal */}
      {step === 0 && sign && cosmicArchetype && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
              Your Cosmic Archetype
            </p>
            <div style={{ width: 120, height: 120, margin: "0 auto 16px", borderRadius: "50%", background: `radial-gradient(circle at 38% 32%, ${sign.color}33, rgba(14,10,32,.95))`, border: `2px solid ${sign.color}88`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${sign.color}44` }}>
              <span style={{ fontSize: 56 }}>{sign.symbol}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 36, color: "var(--text)", marginBottom: 4 }}>{cosmicArchetype.name}</h2>
            <p style={{ fontSize: 13, color: "var(--gold-2)", marginBottom: 8 }}>{`Sun in ${sign.en} - ${cosmicArchetype.signal}`}</p>
            <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: `${ELEMENT_COLOR[sign.element]}22`, border: `1px solid ${ELEMENT_COLOR[sign.element]}66`, color: ELEMENT_COLOR[sign.element] }}>{sign.element}</span>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(216,168,95,.1)", border: "1px solid rgba(216,168,95,.3)", color: "var(--gold-2)" }}>{sign.quality}</span>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(160,130,220,.1)", border: "1px solid rgba(160,130,220,.3)", color: "rgba(180,150,240,1)" }}>{false ? "Upravitel: " : "Ruler: "}{sign.ruling}</span>
            </div>
          </div>

          <div style={{ border: "1px solid rgba(216,168,95,.25)", borderRadius: 16, padding: "16px", background: "rgba(216,168,95,.06)", marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.65 }}>{cosmicArchetype.desc}</p>
          </div>

          <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 16, padding: "14px 16px", background: "rgba(14,10,32,.5)", marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, fontWeight: 600, letterSpacing: ".08em" }}>{false ? "STIKhIYa" : "ELEMENT"} — {sign.element.toUpperCase()}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(elementTraits ? (elementTraits.en) : []).map((tr, i) => (
                <span key={i} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 999, background: `${ELEMENT_COLOR[sign.element]}18`, border: `1px solid ${ELEMENT_COLOR[sign.element]}44`, color: "var(--text)" }}>{tr}</span>
              ))}
            </div>
          </div>

          <button onClick={() => setStep(1)} style={{ width: "100%", height: 48, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 6px 20px rgba(110,30,130,.4)" }}>
            {false ? "Izuchit cherty kharaktera →" : "Explore your cosmic traits →"}
          </button>
        </div>
      )}

      {/* Step 1: Trait cards */}
      {step === 1 && sign && (
        <div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, textAlign: "center" }}>
            {false ? "Nazhmi na kartochku, chtoby perevernut" : "Tap a card to flip it"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {traits.map((tr, i) => (
              <FlipCard
                key={i}
                front={tr.title.en}
                back={tr.body.en}
                flipped={flipped[i] ?? false}
                onClick={() => flip(i)}
              />
            ))}
          </div>
          {allFlipped && (
            <button onClick={() => setStep(2)} style={{ width: "100%", height: 48, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              {false ? "Prodolzhit →" : "Continue →"}
            </button>
          )}
          {!allFlipped && <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted-2)" }}>{false ? `Otkroy vse kartochki (${flipped.filter(Boolean).length}/${traits.length})` : `Open all cards (${flipped.filter(Boolean).length}/${traits.length})`}</p>}
        </div>
      )}

      {/* Step 2: Reflection + complete */}
      {step === 2 && sign && cosmicArchetype && (
        <div>
          <div style={{ border: "1px solid rgba(216,168,95,.25)", borderRadius: 18, padding: "20px 16px", background: "rgba(14,10,32,.6)", marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>&#9733;</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>
              {false ? "Otrazhenie" : "Reflection"}
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 0 }}>
              {`You are the ${cosmicArchetype.name}. Which trait you just uncovered resonates with you most strongly?`}
            </p>
          </div>
          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {false ? "Zavershit uzel ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Node 2: Moon Sign ────────────────────────────────────────────────────────
const MOON_ARCHETYPE: Record<string, { en: string; ru: string; desc: { en: string; ru: string } }> = {
  aries:       { en: "The Warrior Moon",   ru: "Luna Voina",       desc: { en: "Your emotions ignite like a spark — fast, intense, and honest. You need freedom to feel.", ru: "Tvoi emotsii vspykhivayut kak iskra — bystro, intensivno, chestno. Tebe nuzhna svoboda chuvstvovat." } },
  taurus:      { en: "The Comfort Moon",   ru: "Luna Pokoya",       desc: { en: "You find emotional safety in beauty, routine and sensory pleasure. Stability feeds your soul.", ru: "Ty nakhodish emotsionalnuyu bezopasnost v krasote, rutine i chuvstvennykh radostyakh." } },
  gemini:      { en: "The Curious Moon",   ru: "Luna Lyubopytstva", desc: { en: "Your emotions are like conversation — always moving, always connecting new thoughts.", ru: "Tvoi emotsii kak razgovor — vsegda v dvizhenii, vsegda soedinyayut novye mysli." } },
  cancer:      { en: "The Nurturing Moon", ru: "Luna Zaboty",      desc: { en: "You feel everything deeply. Home, family and belonging are your emotional bedrock.", ru: "Ty chuvstvuesh vse gluboko. Dom, semya i prinadlezhnost — tvoya emotsionalnaya osnova." } },
  leo:         { en: "The Royal Moon",     ru: "Luna Tsarya",        desc: { en: "Your emotions are vivid and expressive. You need to be seen, celebrated and loved fully.", ru: "Tvoi emotsii yarkie i vyrazitelnye. Tebe nuzhno byt uvidennym, celebrated i lyubimym." } },
  virgo:       { en: "The Healing Moon",   ru: "Luna Tselitelya",    desc: { en: "You process feelings through analysis and service. Being useful calms your inner world.", ru: "Ty pererabatyvaesh chuvstva cherez analiz i sluzhenie. Byt poleznym uspokaivaet." } },
  libra:       { en: "The Harmony Moon",   ru: "Luna Garmonii",    desc: { en: "You seek emotional balance through beauty and connection. Conflict genuinely disturbs you.", ru: "Ty ischesh emotsionalnyy balans cherez krasotu i svyaz. Konflikt realno bespokoit tebya." } },
  scorpio:     { en: "The Deep Moon",      ru: "Luna Glubiny",     desc: { en: "Your emotional world is an ocean with no bottom. You feel with volcanic intensity.", ru: "Tvoy emotsionalnyy mir — okean bez dna. Ty chuvstvuesh s vulkanicheskoy intensivnostyu." } },
  sagittarius: { en: "The Open-Sky Moon",  ru: "Luna Otkrytogo Neba", desc: { en: "You process emotions through adventure, philosophy and humour. You need open skies.", ru: "Ty pererabatyvaesh emotsii cherez priklyucheniya, filosofiyu i yumor. Tebe nuzhno otkrytoe nebo." } },
  capricorn:   { en: "The Mountain Moon",  ru: "Luna Gory",        desc: { en: "You manage emotions with discipline and patience. Inner calm is your greatest strength.", ru: "Ty upravlyaesh emotsiyami s distsiplinoy i terpeniem. Vnutrenniy pokoy — tvoya sila." } },
  aquarius:    { en: "The Electric Moon",  ru: "Luna Molnii",      desc: { en: "You experience emotions from a slight distance, processing them intellectually first.", ru: "Ty perezhivaesh emotsii s nekotoroy distantsii, snachala obrabatyvaya ikh intellektualno." } },
  pisces:      { en: "The Ocean Moon",     ru: "Luna Okeana",      desc: { en: "You absorb emotions like a sponge — yours and everyone else's. Boundaries are vital.", ru: "Ty vpityvaesh emotsii kak gubka — svoi i chuzhie. Granitsy zhiznenno vazhny." } },
};

function AstroNode2() {
  const { lang } = useLang();
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const [user, setUser] = useState<CurrentProfile | null>(null);

  // Approximate moon sign: moon cycles ~27.3 days, use day-of-year offset
  const moonSign = (() => {
    if (!user?.birthDate) return null;
    const d = new Date(user.birthDate);
    const epoch = new Date(2000, 0, 1).getTime();
    const days = Math.floor((d.getTime() - epoch) / 86400000);
    const moonCycle = 27.3;
    const idx = Math.floor(((days % moonCycle) / moonCycle) * 12 + 4) % 12; // offset so aries=0
    return ZODIAC[idx];
  })();

  const archetype = moonSign ? MOON_ARCHETYPE[moonSign.key] : null;

  useEffect(() => {
    startNode(DISCIPLINE, 2);
    void getCurrentProfile().then(setUser);
  }, []);

  const handleComplete = () => {
    completeNode(DISCIPLINE, 2, { moonSign: moonSign?.key });
    router.push("/sky/astrology");
  };

  const ELEMENT_COLOR: Record<string, string> = { fire: "#e84040", earth: "#7ab04a", air: "#d8a85f", water: "#4090c0" };

  if (!user?.birthDate) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", marginBottom: 8 }}>{false ? "Zavershi personalnuyu nastroyku" : "Complete your personal setup"}</h2>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>{false ? "Data rozhdeniya nuzhna, chtoby rasschitat etu chast puti." : "Your birth date is needed to calculate this part of your path."}</p>
      <button onClick={() => router.push("/onboarding?step=birth")} style={{ padding: "12px 28px", borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{false ? "Prodolzhit nastroyku" : "Continue setup"}</button>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          {false
            ? "Luna v natalnoy karte otrazhaet tvoy emotsionalnyy mir, instinkty i vnutrennie potrebnosti."
            : "The Moon in your natal chart reflects your emotional world, instincts and inner needs."}
        </p>
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ width: "100%", height: 120, borderRadius: 20, background: "radial-gradient(circle at 40% 35%, rgba(120,50,200,.3), rgba(14,10,32,.95))", border: "1.5px solid rgba(216,168,95,.4)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 42 }}>&#9790;</span>
          <span style={{ fontSize: 14, color: "var(--gold-2)", fontWeight: 600 }}>{false ? "Raskryt znak Luny" : "Reveal Moon sign"}</span>
        </button>
      ) : moonSign && archetype ? (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 100, height: 100, margin: "0 auto 12px", borderRadius: "50%", background: `radial-gradient(circle, ${moonSign.color}33, rgba(14,10,32,.95))`, border: `2px solid ${moonSign.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${moonSign.color}44` }}>
              <span style={{ fontSize: 44 }}>{moonSign.symbol}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, marginBottom: 4 }}>{archetype.en}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)", marginBottom: 4 }}>{`Moon in ${moonSign.en}`}</p>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: `${ELEMENT_COLOR[moonSign.element]}22`, border: `1px solid ${ELEMENT_COLOR[moonSign.element]}55`, color: ELEMENT_COLOR[moonSign.element] }}>{moonSign.element}</span>
          </div>

          <div style={{ border: "1px solid rgba(160,130,220,.3)", borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.65 }}>
              {archetype.desc.en}
            </p>
          </div>

          <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.45)", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 8 }}>{false ? "LUNA I TVOI EMOTsII" : "MOON & YOUR EMOTIONS"}</p>
            <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
              {false
                ? "Znak Luny pokazyvaet ne to, kem ty khochesh byt, a to, kak ty chuvstvuesh. Eto tvoya vnutrennyaya priroda — ta, chto proyavlyaetsya v blizkikh otnosheniyakh i naedine s soboy."
                : "Your Moon sign doesn't show who you want to be — it shows how you feel. It's your inner nature, revealed in close relationships and private moments."}
            </p>
          </div>

          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {false ? "Zavershit uzel ✓" : "Complete node ✓"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ── Router ───────────────────────────────────────────────────────────────────
type AstroMvpResult = {
  key: string;
  title: string;
  desc: string;
  gift: string;
  practice: string;
  color: string;
};

type AstroMvpConfig = {
  nodeId: number;
  resultKey: "risingPattern" | "venusSignature" | "marsDrive" | "housesFocus" | "transitTheme";
  eyebrow: string;
  title: string;
  intro: string;
  startLabel: string;
  question: string;
  results: Record<string, AstroMvpResult>;
};

const ASTRO_MVP_CONFIGS: Record<string, AstroMvpConfig> = {
  "3": {
    nodeId: 3,
    resultKey: "risingPattern",
    eyebrow: "Your Rising Pattern",
    title: "Discover Your Rising Pattern",
    intro: "This MVP does not calculate an exact rising sign yet. Your answers point to how you may meet new spaces, people, and beginnings.",
    startLabel: "Find my rising pattern",
    question: "When you enter a new room, what feels most natural?",
    results: {
      initiator: { key: "initiator", title: "The Initiator", desc: "Your answers point to a presence that opens doors quickly and brings motion into quiet spaces.", gift: "You can give people permission to begin.", practice: "Pause before acting and ask what wants to be started with care.", color: "#d8a85f" },
      observer: { key: "observer", title: "The Observer", desc: "Your answers point to a presence that studies the field first and notices what others miss.", gift: "You read the room before choosing where to place your energy.", practice: "Let your quiet perception become a clear first step.", color: "#9070d8" },
      connector: { key: "connector", title: "The Connector", desc: "Your answers point to a presence that softens distance and helps people feel seen.", gift: "You create bridges through warmth, language, and subtle attention.", practice: "Let connection include your own needs too.", color: "#7ab8d8" },
    },
  },
  "4": {
    nodeId: 4,
    resultKey: "venusSignature",
    eyebrow: "Your Venus Signature",
    title: "Discover Your Venus Signature",
    intro: "This MVP does not calculate natal Venus yet. Your answers point to what may open your heart, attraction, and sense of harmony.",
    startLabel: "Find my Venus signature",
    question: "What makes love or beauty feel most alive to you?",
    results: {
      devoted: { key: "devoted", title: "The Devoted Heart", desc: "Your answers point to attraction through loyalty, tenderness, and a feeling of being emotionally safe.", gift: "You make love feel steady and real.", practice: "Notice where devotion is mutual, not only offered.", color: "#e06090" },
      magnetic: { key: "magnetic", title: "The Magnetic Heart", desc: "Your answers point to attraction through intensity, mystery, and honest emotional presence.", gift: "You draw depth by being fully present.", practice: "Let attraction breathe before turning it into certainty.", color: "#b03060" },
      playful: { key: "playful", title: "The Playful Heart", desc: "Your answers point to attraction through humor, curiosity, beauty, and shared delight.", gift: "You remind love to stay alive and expressive.", practice: "Ask for joy without apologizing for wanting it.", color: "#d8a85f" },
    },
  },
  "5": {
    nodeId: 5,
    resultKey: "marsDrive",
    eyebrow: "Your Mars Drive",
    title: "Discover Your Mars Drive",
    intro: "This MVP does not calculate natal Mars yet. Your answers point to how motivation, courage, and desire may move through you.",
    startLabel: "Find my Mars drive",
    question: "When you really want something, what usually moves you?",
    results: {
      builder: { key: "builder", title: "The Steady Builder", desc: "Your answers point to a drive that grows stronger through structure, rhythm, and visible progress.", gift: "You can turn desire into a plan people can trust.", practice: "Choose the next repeatable action instead of waiting for a perfect mood.", color: "#7ab04a" },
      spark: { key: "spark", title: "The First Spark", desc: "Your answers point to a drive that acts fast when inspiration, truth, or urgency arrives.", gift: "You can break inertia and bring courage into the room.", practice: "Give your fire a simple container so it does not burn out quickly.", color: "#e84040" },
      protector: { key: "protector", title: "The Protector", desc: "Your answers point to a drive that rises when something meaningful needs defense, care, or commitment.", gift: "Your courage becomes strongest when your heart is involved.", practice: "Protect your own energy with the same devotion.", color: "#c0a0d8" },
    },
  },
  "6": {
    nodeId: 6,
    resultKey: "housesFocus",
    eyebrow: "Your Houses Focus",
    title: "Discover Your Houses Focus",
    intro: "This MVP does not calculate birth-chart houses yet. Your answers point to a life area asking for more attention right now.",
    startLabel: "Find my focus area",
    question: "Which part of life has been asking for the most honest attention?",
    results: {
      self: { key: "self", title: "Self and Identity", desc: "Your answers point to a season of returning to your own voice, body, choices, and direction.", gift: "You are being invited to choose yourself more clearly.", practice: "Take one action today that makes your yes or no easier to feel.", color: "#d8a85f" },
      love: { key: "love", title: "Love and Belonging", desc: "Your answers point to a season of repairing how you connect, receive care, and let yourself be known.", gift: "Your relationships can become mirrors without becoming prisons.", practice: "Name one need gently before it becomes resentment.", color: "#e06090" },
      work: { key: "work", title: "Work and Devotion", desc: "Your answers point to a season of refining your service, rhythm, responsibility, and daily craft.", gift: "You can make meaning practical.", practice: "Choose one small structure that protects your energy this week.", color: "#7ab04a" },
    },
  },
  "7": {
    nodeId: 7,
    resultKey: "transitTheme",
    eyebrow: "Your Transit Theme",
    title: "Discover Your Transit Theme",
    intro: "This MVP is a symbolic reflection, not a live transit calculation. Your answers point to the energetic season you may be moving through.",
    startLabel: "Find my transit theme",
    question: "What has life been asking from you lately?",
    results: {
      release: { key: "release", title: "Release and Clearing", desc: "Your answers point to a season where old weight may be ready to leave your field.", gift: "You can make space without knowing exactly what fills it next.", practice: "Choose one small ending and honor it without drama.", color: "#9070d8" },
      growth: { key: "growth", title: "Growth and Expansion", desc: "Your answers point to a season of learning, visibility, and stretching beyond old limits.", gift: "You are allowed to outgrow a smaller version of yourself.", practice: "Say yes to one opportunity that feels expansive and grounded.", color: "#d8a85f" },
      focus: { key: "focus", title: "Focus and Refinement", desc: "Your answers point to a season of simplifying, choosing, and strengthening what already matters.", gift: "Your clarity grows when you stop feeding every possibility.", practice: "Remove one distraction from the path you already know is important.", color: "#7ab04a" },
    },
  },
};

function getSavedString(nodeId: number, key: string) {
  const value = getNodeState(DISCIPLINE, nodeId).result?.[key];
  return typeof value === "string" ? value : "";
}

function AstroMvpNode({ config }: { config: AstroMvpConfig }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<AstroMvpResult | null>(null);

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
    router.push("/sky/astrology");
  };

  return (
    <div>
      {!started && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>*</div>
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
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>Your answers point to this pattern</p>
          </div>
          {[{ label: "INTERPRETATION", body: result.desc }, { label: "GIFT", body: result.gift }, { label: "REFLECTION", body: result.practice }].map((item) => (
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

function AstroNode8() {
  const router = useRouter();
  const [saved, setSaved] = useState<Array<{ title: string; value: string }>>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const state = getNodeState(DISCIPLINE, 8);
    setCompleted(state.status === "completed");
    if (state.status !== "completed") startNode(DISCIPLINE, 8);
    setSaved([
      { title: "Cosmic Archetype", value: getSavedString(1, "sign") },
      { title: "Moon", value: getSavedString(2, "moonSign") },
      { title: "Rising Pattern", value: getSavedString(3, "risingPattern") },
      { title: "Venus Signature", value: getSavedString(4, "venusSignature") },
      { title: "Mars Drive", value: getSavedString(5, "marsDrive") },
      { title: "Houses Focus", value: getSavedString(6, "housesFocus") },
      { title: "Transit Theme", value: getSavedString(7, "transitTheme") },
    ].filter((item) => item.value));
  }, []);

  const handleComplete = () => {
    completeNode(DISCIPLINE, 8, { cosmicSynthesis: saved.map((item) => item.value).join("|") || "partial" });
    setCompleted(true);
    router.push("/sky/astrology");
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>*</div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "var(--text)", marginBottom: 10 }}>Your Cosmic Synthesis</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>This gathers the astrology results available so far. If some pieces are missing, the synthesis stays partial and can deepen as earlier nodes are completed.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {saved.length ? saved.map((item) => (
          <div key={item.title} style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "13px 15px", background: "rgba(14,10,32,.55)" }}>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".09em", marginBottom: 5 }}>{item.title.toUpperCase()}</p>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.45 }}>{item.value}</p>
          </div>
        )) : (
          <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.55)" }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>Complete earlier astrology nodes to add more detail to this synthesis.</p>
          </div>
        )}
      </div>
      <div style={{ border: "1px solid rgba(160,130,220,.25)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.55)", marginBottom: 18 }}>
        <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>REFLECTION</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>Which part of your cosmic pattern feels most active in your life right now?</p>
      </div>
      <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>{completed ? "Complete again" : "Complete node"}</button>
    </div>
  );
}

const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Cosmic Archetype", ru: "Solntse", sub: { en: "Beginning of path", ru: "Nachalo puti" } },
  "2": { en: "The Moon", ru: "Luna", sub: { en: "Emotions & intuition", ru: "Emotsii i intuitsiya" } },
  "3": { en: "Rising Pattern", ru: "Voskhodyaschiy pattern", sub: { en: "First impression", ru: "Pervoe vpechatlenie" } },
  "4": { en: "Venus Signature", ru: "Podpis Venery", sub: { en: "Love and attraction", ru: "Lyubov i prityazhenie" } },
  "5": { en: "Mars Drive", ru: "Impuls Marsa", sub: { en: "Action and desire", ru: "Deystvie i zhelanie" } },
  "6": { en: "Houses Focus", ru: "Fokus domov", sub: { en: "Life area", ru: "Sfera zhizni" } },
  "7": { en: "Transit Theme", ru: "Tema tranzita", sub: { en: "Current season", ru: "Tekuschiy sezon" } },
  "8": { en: "Cosmic Synthesis", ru: "Kosmicheskiy sintez", sub: { en: "Wholeness", ru: "Tselostnost" } },
};

const NODE_CONTEXT: Record<string, { en: string; ru: string }> = {
  "1": {
    en: "Your Cosmic Archetype layers your Sun sign, element, and quality into a fast view of the energy you naturally return to.",
    ru: "Tvoy znak Solntsa — pervaya vidimaya tochka karty. On pokazyvaet energiyu, k kotoroy ty vozvraschaeshsya v vybore, tvorchestve i poiske smysla.",
  },
  "2": {
    en: "Your Moon sign shows the emotional rhythm underneath your reactions, needs, and private inner world.",
    ru: "Znak Luny pokazyvaet emotsionalnyy ritm pod tvoimi reaktsiyami, potrebnostyami i vnutrennim mirom.",
  },
  "3": { en: "Your Rising Pattern is a reflection of how you meet new spaces, people, and beginnings.", ru: "Voskhodyaschiy pattern pokazivaet, kak ty vkhodish v novye prostranstva." },
  "4": { en: "Your Venus Signature explores attraction, pleasure, harmony, and what helps the heart open.", ru: "Podpis Venery issleduet prityazhenie, garmoniyu i serdtse." },
  "5": { en: "Your Mars Drive reflects how motivation, courage, and desire may move through you.", ru: "Impuls Marsa otrazhaet motivatsiyu, smelost i zhelanie." },
  "6": { en: "Your Houses Focus points to the life area asking for more attention right now.", ru: "Fokus domov ukazyvaet na sferu zhizni, kotoraya prosit vnimaniya." },
  "7": { en: "Your Transit Theme is a symbolic snapshot of the season your energy may be moving through.", ru: "Tema tranzita simvolicheski pokazivaet tekuschiy sezon energii." },
  "8": { en: "Cosmic Synthesis gathers your available astrology results into one practical reflection.", ru: "Kosmicheskiy sintez sobiraet dostupnye astrologicheskie rezultaty." },
};

export default function AstrologyNodePage() {
  const params = useParams();
  const nodeId = String(params?.nodeId ?? "1");
  const { lang } = useLang();
  const router = useRouter();

  const nodeNum = parseInt(nodeId);
  const locked = typeof window !== "undefined" ? isNodeLocked(DISCIPLINE, nodeNum) : false;
  const coolingDown = typeof window !== "undefined" ? isNodeCoolingDown(DISCIPLINE, nodeNum) : false;
  const state = typeof window !== "undefined" ? getNodeState(DISCIPLINE, nodeNum) : { status: "locked" };

  const meta = NODE_TITLES[nodeId];
  if (!meta) { router.push("/sky/astrology"); return null; }

  if (locked) return (
    <NodePage title={meta.en} subtitle={meta.sub.en} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/astrology">
      {coolingDown ? <CooldownNodeMessage /> : (
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>{false ? "Zavershite predyduschiy uzel, chtoby otkryt etot" : "Complete the previous node to unlock this one"}</p>
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
      backHref="/sky/astrology"
      badge={state.status === "completed" ? "completed" : undefined}
    >
      <div style={{ border: "1px solid rgba(216,168,95,.18)", borderRadius: 16, background: "rgba(12,8,28,.48)", padding: 14, marginBottom: 16 }}>
        <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>{false ? "Chast Sky Map" : "Part of your Sky Map"}</p>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 22, fontWeight: 600, lineHeight: 1.1, marginBottom: 6 }}>{false ? "Pochemu etot uzel vazhen" : "Why this node matters"}</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{NODE_CONTEXT[nodeId].en}</p>
      </div>
      {nodeId === "1" && <AstroNode1 />}
      {nodeId === "2" && <AstroNode2 />}
      {ASTRO_MVP_CONFIGS[nodeId] && <AstroMvpNode config={ASTRO_MVP_CONFIGS[nodeId]} />}
      {nodeId === "8" && <AstroNode8 />}
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
