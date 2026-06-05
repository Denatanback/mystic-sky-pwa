"use client";

import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { SkyNodeEntitlementGate } from "@/components/sky/SkyNodeEntitlementGate";
import { useLang } from "@/lib/i18n";
import { startNode, completeNode, getNodeState, isNodeLocked } from "@/lib/nodeProgress";

const TOTAL = 8;
const DISCIPLINE = "pastlife";

// ── Soul Age Types ────────────────────────────────────────────────────────────
type SoulAge = "infant" | "baby" | "young" | "mature" | "old";
const SOUL_AGES: Record<SoulAge, {
  en: string; ru: string;
  desc: { en: string; ru: string };
  traits: { en: string[]; ru: string[] };
  color: string;
  emoji: string;
}> = {
  infant: {
    en: "Infant Soul", ru: "Mladencheskaya dusha",
    desc: { en: "A soul in its earliest incarnations, experiencing physicality for the first time. Everything is raw and instinctual.", ru: "Dusha v pervykh voploscheniyakh, vpervye perezhivayuschaya fizicheskoe suschestvovanie. Vse syroe i instinktivnoe." },
    traits: { en: ["Instinctual", "Tribal", "Survival-focused"], ru: ["Instinktivnaya", "Plemennaya", "Orientirovannaya na vyzhivanie"] },
    color: "#8090a0", emoji: "&#127758;",
  },
  baby: {
    en: "Baby Soul", ru: "Detskaya dusha",
    desc: { en: "Building structure, rules and community. Comfort comes from belonging to traditions and clear hierarchies.", ru: "Stroit strukturu, pravila i soobschestvo. Komfort — v prinadlezhnosti k traditsiyam i chetkim ierarkhiyam." },
    traits: { en: ["Traditional", "Rule-following", "Community-oriented"], ru: ["Traditsionnaya", "Sleduyuschaya pravilam", "Orientirovannaya na soobschestvo"] },
    color: "#7090c0", emoji: "&#127751;",
  },
  young: {
    en: "Young Soul", ru: "Molodaya dusha",
    desc: { en: "Driven by achievement, ambition and making a mark on the world. External success is the primary teacher.", ru: "Dvizhima dostizheniyami, ambitsiyami i zhelaniem ostavit sled. Vneshniy uspekh — glavnyy uchitel." },
    traits: { en: ["Achievement-driven", "Competitive", "Independent"], ru: ["Orientirovannaya na dostizheniya", "Konkurentnaya", "Nezavisimaya"] },
    color: "#d8a85f", emoji: "&#9733;",
  },
  mature: {
    en: "Mature Soul", ru: "Zrelaya dusha",
    desc: { en: "Seeking depth, authentic relationships and emotional truth. The inner world becomes as important as outer success.", ru: "Ischet glubiny, podlinnykh otnosheniy i emotsionalnoy pravdy. Vnutrenniy mir stanovitsya tak zhe vazhen, kak vneshniy uspekh." },
    traits: { en: ["Empathetic", "Relationship-focused", "Self-reflective"], ru: ["Empatichnaya", "Orientirovannaya na otnosheniya", "Samorefleksiruyuschaya"] },
    color: "#9070d8", emoji: "&#9670;",
  },
  old: {
    en: "Old Soul", ru: "Staraya dusha",
    desc: { en: "Carrying wisdom from many lifetimes. Values simplicity, spiritual growth and service over worldly achievement.", ru: "Neset mudrost mnogikh zhizney. Tsenit prostotu, dukhovnyy rost i sluzhenie prevyshe mirskikh dostizheniy." },
    traits: { en: ["Wise", "Non-attached", "Service-oriented"], ru: ["Mudraya", "Neprivyazannaya", "Orientirovannaya na sluzhenie"] },
    color: "#c0a0d8", emoji: "&#10025;",
  },
};

const SOUL_AGE_Q: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; scores: Partial<Record<SoulAge, number>> }[] }[] = [
  {
    q: { en: "When you look at the world, what do you feel most?", ru: "Glyadya na mir, chto ty chasche vsego chuvstvuesh?" },
    opts: [
      { label: { en: "Safety — I stick close to my group and traditions", ru: "Bezopasnost — derzhus ryadom so svoey gruppoy i traditsiyami" }, scores: { baby: 2 } },
      { label: { en: "Opportunity — I want to achieve and succeed", ru: "Vozmozhnosti — khochu dostigat i dobivatsya uspekha" }, scores: { young: 2 } },
      { label: { en: "Complexity — relationships and feelings are everything", ru: "Slozhnost — otnosheniya i chuvstva — eto vse" }, scores: { mature: 2 } },
      { label: { en: "Impermanence — I'm drawn to simplicity and essence", ru: "Nepostoyanstvo — menya vlechet prostota i sut" }, scores: { old: 2 } },
    ],
  },
  {
    q: { en: "What gives your life most meaning?", ru: "Chto pridaet tvoey zhizni naibolshiy smysl?" },
    opts: [
      { label: { en: "Belonging to something bigger — family, faith, community", ru: "Prinadlezhnost k chemu-to bolshemu — semya, vera, soobschestvo" }, scores: { baby: 2, infant: 1 } },
      { label: { en: "Building something — career, legacy, recognition", ru: "Sozdanie chego-to — karera, nasledie, priznanie" }, scores: { young: 2 } },
      { label: { en: "Deep authentic connections and emotional growth", ru: "Glubokie podlinnye svyazi i emotsionalnyy rost" }, scores: { mature: 2 } },
      { label: { en: "Inner peace, wisdom and being of service", ru: "Vnutrenniy pokoy, mudrost i sluzhenie" }, scores: { old: 2 } },
    ],
  },
  {
    q: { en: "How do you typically relate to authority / rules?", ru: "Kak ty obychno otnosishsya k avtoritetam / pravilam?" },
    opts: [
      { label: { en: "I respect and follow them — they create order", ru: "Uvazhayu i sleduyu im — oni sozdayut poryadok" }, scores: { baby: 2 } },
      { label: { en: "I work within them when useful but push against limits", ru: "Rabotayu v ikh ramkakh, kogda polezno, no davlyu na ogranicheniya" }, scores: { young: 2 } },
      { label: { en: "I question them — especially when they hurt people", ru: "Podvergayu somneniyu — osobenno kogda oni vredyat lyudyam" }, scores: { mature: 2 } },
      { label: { en: "I've mostly transcended needing them", ru: "Ya v osnovnom vyshel za predely potrebnosti v nikh" }, scores: { old: 2 } },
    ],
  },
  {
    q: { en: "What does success look like to you?", ru: "Kak vyglyadit uspekh dlya tebya?" },
    opts: [
      { label: { en: "Being respected and part of a stable community", ru: "Byt uvazhaemym i chastyu stabilnogo soobschestva" }, scores: { baby: 2 } },
      { label: { en: "Achieving big goals and leaving a visible mark", ru: "Dostigat bolshikh tseley i ostavit vidimyy sled" }, scores: { young: 2 } },
      { label: { en: "Having genuine, loving relationships and emotional truth", ru: "Imet iskrennie, lyubyaschie otnosheniya i emotsionalnuyu pravdu" }, scores: { mature: 2 } },
      { label: { en: "Feeling at peace and being helpful to others' growth", ru: "Chuvstvovat mir i pomogat rostu drugikh" }, scores: { old: 2 } },
    ],
  },
  {
    q: { en: "What do you find most exhausting?", ru: "Chto tebya bolshe vsego utomlyaet?" },
    opts: [
      { label: { en: "Chaos, instability or people breaking the rules", ru: "Khaos, nestabilnost ili narushenie pravil" }, scores: { baby: 2, infant: 1 } },
      { label: { en: "Not achieving — being stuck or not progressing", ru: "Ne dostigat — zastrevat ili ne dvigatsya vpered" }, scores: { young: 2 } },
      { label: { en: "Shallow relationships and emotional dishonesty", ru: "Poverkhnostnye otnosheniya i emotsionalnaya nechestnost" }, scores: { mature: 2 } },
      { label: { en: "Drama, ego battles and unnecessary complexity", ru: "Drama, ego-bitvy i nenuzhnaya slozhnost" }, scores: { old: 2 } },
    ],
  },
];

function calcSoulAge(answers: number[]): SoulAge {
  const scores: Record<SoulAge, number> = { infant: 0, baby: 0, young: 0, mature: 0, old: 0 };
  answers.forEach((a, qi) => {
    const opts = SOUL_AGE_Q[qi]?.opts[a];
    if (opts) Object.entries(opts.scores).forEach(([k, v]) => { scores[k as SoulAge] += v ?? 0; });
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as SoulAge;
}

// ── Karma types ───────────────────────────────────────────────────────────────
type KarmaTheme = "worth" | "trust" | "voice" | "freedom" | "love" | "power" | "surrender";
const KARMA_THEMES: Record<KarmaTheme, { en: string; ru: string; lesson: { en: string; ru: string }; gift: { en: string; ru: string }; color: string }> = {
  worth:    { en: "Self-Worth",    ru: "Samotsennost",   lesson: { en: "Learning to value yourself without external validation.", ru: "Uchitsya tsenit sebya bez vneshnego podtverzhdeniya." }, gift: { en: "You have deep empathy for others' struggles with self-acceptance.", ru: "U tebya glubokaya empatiya k chuzhoy borbe s samoprinyatiem." }, color: "#d8a85f" },
  trust:    { en: "Trust",        ru: "Doverie",        lesson: { en: "Opening to trust — in others, in life, in the universe.", ru: "Otkrytsya doveriyu — k drugim, k zhizni, k Vselennoy." }, gift: { en: "Hard-won discernment — you know authentic safety when you find it.", ru: "Vystradannaya pronitsatelnost — ty uznaesh podlinnuyu bezopasnost." }, color: "#7ab8d8" },
  voice:    { en: "Self-Expression", ru: "Samovyrazhenie", lesson: { en: "Claiming the right to speak your truth fully.", ru: "Zayavit pravo govorit svoyu pravdu polnostyu." }, gift: { en: "You understand the power of words and choose them carefully.", ru: "Ty ponimaesh silu slov i tschatelno ikh vybiraesh." }, color: "#9070d8" },
  freedom:  { en: "Freedom",       ru: "Svoboda",        lesson: { en: "Releasing control and learning to flow with life.", ru: "Otpustit kontrol i nauchitsya tech s zhiznyu." }, gift: { en: "When you trust the flow, you move with remarkable grace.", ru: "Kogda doveryaesh potoku, ty dvizheshsya s zamechatelnoy gratsiey." }, color: "#7ab04a" },
  love:     { en: "Love",          ru: "Lyubov",         lesson: { en: "Learning to love without losing yourself in the other.", ru: "Uchitsya lyubit, ne rastvoryayas v drugom." }, gift: { en: "Your capacity for love, once balanced, is extraordinary.", ru: "Tvoya sposobnost lyubit, buduchi sbalansirovannoy, neobychayna." }, color: "#e06090" },
  power:    { en: "Power",         ru: "Sila",           lesson: { en: "Owning your power without dominating — or diminishing yourself.", ru: "Prinyat svoyu silu bez dominirovaniya i bez samounichizheniya." }, gift: { en: "You can lead with both strength and humility.", ru: "Ty mozhesh vesti s siloy i smireniem odnovremenno." }, color: "#e05050" },
  surrender: { en: "Surrender",   ru: "Prinyatie",       lesson: { en: "Releasing the need to control outcomes and trusting the divine.", ru: "Otpustit potrebnost kontrolirovat iskhody i doveritsya vysshemu." }, gift: { en: "You develop extraordinary peace and acceptance.", ru: "Ty razvivaesh neobychaynyy pokoy i prinyatie." }, color: "#c0a0d8" },
};

const KARMA_Q: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; score: KarmaTheme }[] }[] = [
  {
    q: { en: "Which pattern shows up most in your relationships?", ru: "Kakoy pattern chasche vsego proyavlyaetsya v tvoikh otnosheniyakh?" },
    opts: [
      { label: { en: "I give too much and lose myself", ru: "Otdayu slishkom mnogo i teryayu sebya" }, score: "love" },
      { label: { en: "I hold back, afraid to be hurt", ru: "Sderzhivayus, boyas byt zadetym" }, score: "trust" },
      { label: { en: "I struggle to set limits and say no", ru: "Mne slozhno ustanavlivat granitsy i govorit «net»" }, score: "worth" },
      { label: { en: "I need to be in control of what happens", ru: "Mne nuzhno kontrolirovat to, chto proiskhodit" }, score: "surrender" },
    ],
  },
  {
    q: { en: "What do you find hardest to do?", ru: "Chto tebe slozhnee vsego delat?" },
    opts: [
      { label: { en: "Speak up for myself when it matters", ru: "Govorit za sebya, kogda eto vazhno" }, score: "voice" },
      { label: { en: "Let things go and stop worrying", ru: "Otpuskat veschi i perestat bespokoitsya" }, score: "freedom" },
      { label: { en: "Ask for help without feeling weak", ru: "Prosit o pomoschi, ne chuvstvuya slabosti" }, score: "worth" },
      { label: { en: "Trust that things will work out", ru: "Doveryat, chto vse naladitsya" }, score: "trust" },
    ],
  },
  {
    q: { en: "Which of these fears feels most familiar?", ru: "Kakoy iz etikh strakhov kazhetsya naibolee znakomym?" },
    opts: [
      { label: { en: "Fear of abandonment / not being lovable", ru: "Strakh byt pokinutym / nelyubimym" }, score: "love" },
      { label: { en: "Fear of losing control or being trapped", ru: "Strakh poteryat kontrol ili byt v lovushke" }, score: "freedom" },
      { label: { en: "Fear of being too much or too little", ru: "Strakh byt slishkom mnogo ili slishkom malo" }, score: "worth" },
      { label: { en: "Fear of being silenced or not heard", ru: "Strakh byt zaglushennym ili neuslyshannym" }, score: "voice" },
    ],
  },
];

function calcKarma(answers: number[]): KarmaTheme {
  const scores: Record<KarmaTheme, number> = { worth: 0, trust: 0, voice: 0, freedom: 0, love: 0, power: 0, surrender: 0 };
  answers.forEach((a, qi) => {
    const opt = KARMA_Q[qi]?.opts[a];
    if (opt) scores[opt.score]++;
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as KarmaTheme;
}

// ── Quiz component ────────────────────────────────────────────────────────────
function Quiz<T extends string>({ questions, calcResult, renderResult, lang }: {
  questions: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string } }[] }[];
  calcResult: (a: number[]) => T;
  renderResult: (r: T) => ReactNode;
  lang: string;
}) {
  const [qIdx, setQIdx] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<T | null>(null);

  const answer = (i: number) => {
    const next = [...answers, i];
    setAnswers(next);
    if (next.length >= questions.length) { setResult(calcResult(next)); setQIdx(questions.length); }
    else setQIdx(qIdx + 1);
  };

  const q = qIdx >= 0 && qIdx < questions.length ? questions[qIdx] : null;

  if (qIdx === -1) return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20, lineHeight: 1.6 }}>
        {false ? `${questions.length} voprosov · ~2 minuty` : `${questions.length} questions · ~2 minutes`}
      </p>
      <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
        {false ? "Nachat →" : "Begin →"}
      </button>
    </div>
  );

  if (q) return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {questions.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= qIdx ? "var(--gold)" : "rgba(255,255,255,.1)" }} />)}
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{false ? `${qIdx + 1} / ${questions.length}` : `${qIdx + 1} / ${questions.length}`}</p>
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
  );

  return result ? renderResult(result) : null;
}

// ── Node 1 ────────────────────────────────────────────────────────────────────
function PLNode1() {
  const { lang } = useLang();
  const router = useRouter();
  useEffect(() => { startNode(DISCIPLINE, 1); }, []);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>&#9790;</div>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          {false
            ? "Vozrast dushi — uroven evolyutsionnogo razvitiya, nakoplennogo cherez mnogie voploscheniya."
            : "Soul age is the level of evolutionary development accumulated across many incarnations."}
        </p>
      </div>
      <Quiz
        questions={SOUL_AGE_Q}
        calcResult={calcSoulAge}
        lang={lang}
        renderResult={(r: SoulAge) => {
          const data = SOUL_AGES[r];
          return (
            <div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 56, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: data.emoji }} />
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>{data.en}</h2>
              </div>
              <div style={{ border: `1px solid ${data.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{data.desc.en}</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {(data.traits.en).map((t, i) => (
                  <span key={i} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 999, background: `${data.color}18`, border: `1px solid ${data.color}44`, color: "var(--text)" }}>{t}</span>
                ))}
              </div>
              <button onClick={() => { completeNode(DISCIPLINE, 1, { soulAge: r }); router.push("/sky/pastlife"); }} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
                {false ? "Zavershit uzel ✓" : "Complete node ✓"}
              </button>
            </div>
          );
        }}
      />
    </div>
  );
}

// ── Node 2 ────────────────────────────────────────────────────────────────────
function PLNode2() {
  const { lang } = useLang();
  const router = useRouter();
  useEffect(() => { startNode(DISCIPLINE, 2); }, []);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>&#9775;</div>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          {false
            ? "Karmicheskie uroki — povtoryayuschiesya temy, kotorye tvoya dusha prishla istselit i transformirovat v etoy zhizni."
            : "Karmic lessons are recurring themes your soul came to heal and transform in this lifetime."}
        </p>
      </div>
      <Quiz
        questions={KARMA_Q}
        calcResult={calcKarma}
        lang={lang}
        renderResult={(r: KarmaTheme) => {
          const data = KARMA_THEMES[r];
          return (
            <div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 90, height: 90, margin: "0 auto 12px", borderRadius: "50%", background: `radial-gradient(circle, ${data.color}33, rgba(14,10,32,.95))`, border: `2px solid ${data.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${data.color}44` }}>
                  <span style={{ fontSize: 36 }}>&#9775;</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{data.en}</h2>
                <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{false ? "Tvoy karmicheskiy urok" : "Your karmic lesson"}</p>
              </div>
              <div style={{ border: `1px solid ${data.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 10 }}>
                <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{false ? "UROK" : "LESSON"}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{data.lesson.en}</p>
              </div>
              <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 14, padding: "14px 16px", background: "rgba(216,168,95,.05)", marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{false ? "SKRYTYY DAR" : "HIDDEN GIFT"}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{data.gift.en}</p>
              </div>
              <button onClick={() => { completeNode(DISCIPLINE, 2, { karma: r }); router.push("/sky/pastlife"); }} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                {false ? "Zavershit uzel ✓" : "Complete node ✓"}
              </button>
            </div>
          );
        }}
      />
    </div>
  );
}

// ── Router ─────────────────────────────────────────────────────────────────────
const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Soul Age",  ru: "Vozrast dushi", sub: { en: "Beginning",  ru: "Nachalo" } },
  "2": { en: "Karma",     ru: "Karma",        sub: { en: "Patterns",   ru: "Patterny" } },
};

export default function PastLifeNodePage() {
  const params = useParams();
  const nodeId = String(params?.nodeId ?? "1");
  const { lang } = useLang();
  const router = useRouter();

  const locked = typeof window !== "undefined" ? isNodeLocked(DISCIPLINE, parseInt(nodeId)) : false;
  const state = typeof window !== "undefined" ? getNodeState(DISCIPLINE, parseInt(nodeId)) : { status: "locked" };
  const meta = NODE_TITLES[nodeId];
  if (!meta) { router.push("/sky/pastlife"); return null; }
  const nodeNum = parseInt(nodeId);
  const title = meta.en;
  const subtitle = meta.sub.en;

  if (locked) return (
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/pastlife">
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/pastlife">
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
          <p style={{ color: "var(--muted)" }}>Complete the previous node first</p>
        </div>
      </NodePage>
    </SkyNodeEntitlementGate>
  );

  return (
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/pastlife">
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/pastlife" badge={state.status === "completed" ? "completed" : undefined}>
        {nodeId === "1" && <PLNode1 />}
        {nodeId === "2" && <PLNode2 />}
      </NodePage>
    </SkyNodeEntitlementGate>
  );
}
