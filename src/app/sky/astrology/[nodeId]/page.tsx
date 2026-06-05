"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NodePage } from "@/components/sky/NodePage";
import { useLang } from "@/lib/i18n";
import { getSunSign, SUN_TRAITS, ZODIAC, ELEMENT_TRAITS } from "@/lib/astroCalc";
import { startNode, completeNode, getNodeState, isNodeLocked } from "@/lib/nodeProgress";
import { getCurrentProfile, type CurrentProfile } from "@/lib/profile/currentProfile";
import { resolveUserZodiac } from "@/lib/astrology/resolveZodiac";

const TOTAL = 8;
const DISCIPLINE = "astrology";

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
      {step === 0 && sign && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 120, height: 120, margin: "0 auto 16px", borderRadius: "50%", background: `radial-gradient(circle at 38% 32%, ${sign.color}33, rgba(14,10,32,.95))`, border: `2px solid ${sign.color}88`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${sign.color}44` }}>
              <span style={{ fontSize: 56 }}>{sign.symbol}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 36, color: "var(--text)", marginBottom: 4 }}>{sign.en}</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>{false ? "Tvoy znak Solntsa" : "Your Sun sign"}</p>
            <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: `${ELEMENT_COLOR[sign.element]}22`, border: `1px solid ${ELEMENT_COLOR[sign.element]}66`, color: ELEMENT_COLOR[sign.element] }}>{sign.element}</span>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(216,168,95,.1)", border: "1px solid rgba(216,168,95,.3)", color: "var(--gold-2)" }}>{sign.quality}</span>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(160,130,220,.1)", border: "1px solid rgba(160,130,220,.3)", color: "rgba(180,150,240,1)" }}>{false ? "Upravitel: " : "Ruler: "}{sign.ruling}</span>
            </div>
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
            {false ? "Izuchit cherty kharaktera →" : "Explore your traits →"}
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
      {step === 2 && sign && (
        <div>
          <div style={{ border: "1px solid rgba(216,168,95,.25)", borderRadius: 18, padding: "20px 16px", background: "rgba(14,10,32,.6)", marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>&#9733;</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>
              {false ? "Otrazhenie" : "Reflection"}
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 0 }}>
              {`You are ${sign.en}. Which trait you just uncovered resonates with you most strongly?`}
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
const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "The Sun", ru: "Solntse", sub: { en: "Beginning of path", ru: "Nachalo puti" } },
  "2": { en: "The Moon", ru: "Luna", sub: { en: "Emotions & intuition", ru: "Emotsii i intuitsiya" } },
};

const NODE_CONTEXT: Record<string, { en: string; ru: string }> = {
  "1": {
    en: "Your Sun sign is the first visible point of your chart. It shows the energy you naturally return to when choosing, creating, and seeking meaning.",
    ru: "Tvoy znak Solntsa — pervaya vidimaya tochka karty. On pokazyvaet energiyu, k kotoroy ty vozvraschaeshsya v vybore, tvorchestve i poiske smysla.",
  },
  "2": {
    en: "Your Moon sign shows the emotional rhythm underneath your reactions, needs, and private inner world.",
    ru: "Znak Luny pokazyvaet emotsionalnyy ritm pod tvoimi reaktsiyami, potrebnostyami i vnutrennim mirom.",
  },
};

export default function AstrologyNodePage() {
  const params = useParams();
  const nodeId = String(params?.nodeId ?? "1");
  const { lang } = useLang();
  const router = useRouter();

  const locked = typeof window !== "undefined" ? isNodeLocked(DISCIPLINE, parseInt(nodeId)) : false;
  const state = typeof window !== "undefined" ? getNodeState(DISCIPLINE, parseInt(nodeId)) : { status: "locked" };

  const meta = NODE_TITLES[nodeId];
  if (!meta) { router.push("/sky/astrology"); return null; }

  if (locked) return (
    <NodePage title={meta.en} subtitle={meta.sub.en} nodeNum={parseInt(nodeId)} totalNodes={TOTAL} backHref="/sky/astrology">
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>{false ? "Zavershite predyduschiy uzel, chtoby otkryt etot" : "Complete the previous node to unlock this one"}</p>
      </div>
    </NodePage>
  );

  return (
    <NodePage
      title={meta.en}
      subtitle={meta.sub.en}
      nodeNum={parseInt(nodeId)}
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
