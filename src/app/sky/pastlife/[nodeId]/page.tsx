"use client";

import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { CooldownNodeMessage } from "@/components/sky/CooldownNodeMessage";
import { SkyNodeEntitlementGate } from "@/components/sky/SkyNodeEntitlementGate";
import { useLang } from "@/lib/i18n";
import { startNode, completeNode, getNodeState, isNodeLocked, isNodeCoolingDown } from "@/lib/nodeProgress";

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

type PastLifeRole = "healer" | "warrior" | "priestess" | "scientist" | "artist" | "explorer" | "teacher" | "ruler";

const PAST_LIFE_ROLES: Record<PastLifeRole, {
  en: string;
  desc: string;
  gifts: string[];
  lesson: string;
  color: string;
  emoji: string;
}> = {
  healer: { en: "Healer", desc: "Your answers point to a past-life role centered on repair, comfort, and restoring what was wounded.", gifts: ["Calming presence", "Emotional repair", "Deep compassion"], lesson: "This role may reflect a recurring pattern of helping others without forgetting your own needs.", color: "#7ab04a", emoji: "&#10045;" },
  warrior: { en: "Warrior", desc: "Your answers point to a past-life role shaped by courage, protection, and decisive action under pressure.", gifts: ["Courage", "Protection", "Endurance"], lesson: "This role may reflect a pattern of learning when to fight, when to soften, and when to trust peace.", color: "#e05050", emoji: "&#9876;" },
  priestess: { en: "Priest / Priestess", desc: "Your answers point to a past-life role devoted to ritual, intuition, and carrying meaning for others.", gifts: ["Intuition", "Ritual", "Spiritual devotion"], lesson: "This role may reflect a recurring pattern of trusting inner knowing without isolating yourself from ordinary life.", color: "#9070d8", emoji: "&#9789;" },
  scientist: { en: "Scientist", desc: "Your answers point to a past-life role that studied patterns, solved problems, and searched for hidden laws.", gifts: ["Analysis", "Discovery", "Precision"], lesson: "This role may reflect a pattern of balancing the mind's certainty with the soul's mystery.", color: "#7ab8d8", emoji: "&#9883;" },
  artist: { en: "Artist", desc: "Your answers point to a past-life role that transformed emotion, beauty, and longing into visible form.", gifts: ["Expression", "Beauty", "Emotional truth"], lesson: "This role may reflect a pattern of letting yourself be seen instead of hiding your sensitivity.", color: "#e06090", emoji: "&#10022;" },
  explorer: { en: "Explorer", desc: "Your answers point to a past-life role drawn toward movement, foreign horizons, and unknown paths.", gifts: ["Freedom", "Curiosity", "Adaptability"], lesson: "This role may reflect a recurring pattern of seeking freedom while learning where you truly belong.", color: "#d8a85f", emoji: "&#10023;" },
  teacher: { en: "Teacher", desc: "Your answers point to a past-life role that carried knowledge, guided others, and translated experience into wisdom.", gifts: ["Guidance", "Patience", "Wisdom"], lesson: "This role may reflect a pattern of sharing wisdom without needing to carry everyone's path for them.", color: "#c0a0d8", emoji: "&#10021;" },
  ruler: { en: "Ruler", desc: "Your answers point to a past-life role of leadership, responsibility, and decisions that affected many lives.", gifts: ["Leadership", "Responsibility", "Command"], lesson: "This role may reflect a recurring pattern of using power with humility instead of control.", color: "#d8a85f", emoji: "&#9812;" },
};

const PAST_LIFE_ROLE_Q: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; scores: Partial<Record<PastLifeRole, number>> }[] }[] = [
  {
    q: { en: "Which scene feels strangely familiar?", ru: "Kakaya stsena kazhetsya stranno znakomoy?" },
    opts: [
      { label: { en: "A quiet room where people came to be comforted", ru: "Tikhaya komnata, kuda lyudi prikhodili za utesheniem" }, scores: { healer: 2 } },
      { label: { en: "A threshold I had to defend", ru: "Porog, kotoryy nuzhno bylo zaschischat" }, scores: { warrior: 2 } },
      { label: { en: "A candlelit temple or sacred circle", ru: "Khram pri svechakh ili svyaschennyy krug" }, scores: { priestess: 2 } },
      { label: { en: "A table covered with notes, tools, or maps", ru: "Stol s zapisyami, instrumentami ili kartami" }, scores: { scientist: 2, explorer: 1 } },
    ],
  },
  {
    q: { en: "What kind of responsibility do you naturally take on?", ru: "Kakuyu otvetstvennost ty estestvenno beresh na sebya?" },
    opts: [
      { label: { en: "Helping someone feel safe enough to heal", ru: "Pomoch komu-to pochuvstvovat bezopasnost dlya istseleniya" }, scores: { healer: 2, teacher: 1 } },
      { label: { en: "Making the hard decision others avoid", ru: "Prinyat slozhnoe reshenie, kotorogo drugie izbegayut" }, scores: { ruler: 2, warrior: 1 } },
      { label: { en: "Turning emotion into something beautiful", ru: "Prevratit emotsiyu vo chto-to krasivoe" }, scores: { artist: 2 } },
      { label: { en: "Finding the truth underneath the obvious answer", ru: "Nayti istinu pod ochevidnym otvetom" }, scores: { scientist: 2, priestess: 1 } },
    ],
  },
  {
    q: { en: "What gift do people often seek from you?", ru: "Kakoy dar lyudi chasto ischut v tebe?" },
    opts: [
      { label: { en: "Guidance, patience, and perspective", ru: "Nastavlenie, terpenie i perspektivu" }, scores: { teacher: 2 } },
      { label: { en: "Courage when something must be faced", ru: "Smelost, kogda s chem-to nuzhno vstretitsya" }, scores: { warrior: 2 } },
      { label: { en: "Permission to dream, create, or feel", ru: "Razreshenie mechtat, tvorit ili chuvstvovat" }, scores: { artist: 2 } },
      { label: { en: "A way forward into unknown territory", ru: "Put vpered na neizvestnuyu territoriyu" }, scores: { explorer: 2 } },
    ],
  },
  {
    q: { en: "Which pattern feels most familiar in this life?", ru: "Kakoy pattern kazhetsya naibolee znakomym v etoy zhizni?" },
    opts: [
      { label: { en: "Carrying too much for other people", ru: "Nesti slishkom mnogo za drugikh" }, scores: { healer: 2, ruler: 1 } },
      { label: { en: "Feeling called to lead, even when it is lonely", ru: "Chuvstvovat prizvanie vesti, dazhe kogda odinoko" }, scores: { ruler: 2 } },
      { label: { en: "Knowing things without knowing how I know", ru: "Znat veschi, ne ponimaya otkuda eto znanie" }, scores: { priestess: 2 } },
      { label: { en: "Needing freedom more than approval", ru: "Nuzhdatsya v svobode bolshe, chem v odobrenii" }, scores: { explorer: 2 } },
    ],
  },
];

function calcPastLifeRole(answers: number[]): PastLifeRole {
  const scores: Record<PastLifeRole, number> = { healer: 0, warrior: 0, priestess: 0, scientist: 0, artist: 0, explorer: 0, teacher: 0, ruler: 0 };
  answers.forEach((a, qi) => {
    const opts = PAST_LIFE_ROLE_Q[qi]?.opts[a];
    if (opts) Object.entries(opts.scores).forEach(([k, v]) => { scores[k as PastLifeRole] += v ?? 0; });
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as PastLifeRole;
}

function normalizePastLifeRole(value: unknown): PastLifeRole | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  if (normalized === "priest") return "priestess";
  return normalized in PAST_LIFE_ROLES ? normalized as PastLifeRole : null;
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
  const [restoredRole, setRestoredRole] = useState<PastLifeRole | null>(null);

  useEffect(() => {
    const saved = getNodeState(DISCIPLINE, 1);
    const role = normalizePastLifeRole(saved.result?.pastLifeRole ?? saved.result?.soulAge);
    if (saved.status === "completed" && role) {
      setRestoredRole(role);
      return;
    }
    startNode(DISCIPLINE, 1);
  }, []);

  if (restoredRole) {
    const data = PAST_LIFE_ROLES[restoredRole];
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
            Your Past Life Role
          </p>
          <div style={{ fontSize: 56, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: data.emoji }} />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>{data.en}</h2>
          <p style={{ fontSize: 12, color: "var(--gold-2)" }}>Your saved result</p>
        </div>
        <div style={{ border: `1px solid ${data.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{data.desc}</p>
        </div>
        <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 14, padding: "14px 16px", background: "rgba(216,168,95,.05)", marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 8 }}>GIFTS CARRIED INTO THIS LIFE</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {data.gifts.map((t, i) => (
              <span key={i} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 999, background: `${data.color}18`, border: `1px solid ${data.color}44`, color: "var(--text)" }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ border: `1px solid ${data.color}33`, borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.45)", marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>RECURRING LESSON</p>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{data.lesson}</p>
        </div>
        <button onClick={() => router.push("/sky/pastlife")} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>&#9790;</div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>
          Your Past Life Role
        </h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          {false
            ? "Vozrast dushi — uroven evolyutsionnogo razvitiya, nakoplennogo cherez mnogie voploscheniya."
            : "Answer a few intuitive questions. Your result does not claim certainty; it points to a symbolic role that may reflect old gifts and recurring patterns."}
        </p>
      </div>
      <Quiz
        questions={PAST_LIFE_ROLE_Q}
        calcResult={calcPastLifeRole}
        lang={lang}
        renderResult={(r: PastLifeRole) => {
          const data = PAST_LIFE_ROLES[r];
          return (
            <div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
                  Your Past Life Role
                </p>
                <div style={{ fontSize: 56, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: data.emoji }} />
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>{data.en}</h2>
                <p style={{ fontSize: 12, color: "var(--gold-2)" }}>Your answers point to this role</p>
              </div>
              <div style={{ border: `1px solid ${data.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{data.desc}</p>
              </div>
              <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 14, padding: "14px 16px", background: "rgba(216,168,95,.05)", marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 8 }}>GIFTS CARRIED INTO THIS LIFE</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {data.gifts.map((t, i) => (
                  <span key={i} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 999, background: `${data.color}18`, border: `1px solid ${data.color}44`, color: "var(--text)" }}>{t}</span>
                ))}
                </div>
              </div>
              <div style={{ border: `1px solid ${data.color}33`, borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.45)", marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>RECURRING LESSON</p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{data.lesson}</p>
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
type PastLifeMvpResult = {
  key: string;
  title: string;
  desc: string;
  gift: string;
  reflection: string;
  color: string;
};

type PastLifeMvpConfig = {
  nodeId: number;
  resultKey: "pastLifeTheme" | "emotionalMemory" | "relationshipKarma" | "hiddenTalents" | "repeatingLifeLesson";
  eyebrow: string;
  title: string;
  intro: string;
  startLabel: string;
  question: string;
  results: Record<string, PastLifeMvpResult>;
};

const PAST_LIFE_MVP_CONFIGS: Record<string, PastLifeMvpConfig> = {
  "3": {
    nodeId: 3,
    resultKey: "pastLifeTheme",
    eyebrow: "Your Past Life Theme",
    title: "Discover Your Past Life Theme",
    intro: "This is a symbolic reflection, not a claim of certainty. Your answers point to a theme that may echo through old stories and current patterns.",
    startLabel: "Find my past life theme",
    question: "Which old feeling seems to follow you into new chapters?",
    results: {
      devotion: { key: "devotion", title: "Devotion and Service", desc: "Your answers point to a theme of serving something larger than yourself, sometimes at the cost of your own needs.", gift: "You may carry a deep instinct for loyalty, prayer, care, or sacred responsibility.", reflection: "Where can devotion become mutual instead of self-erasing?", color: "#9070d8" },
      exile: { key: "exile", title: "Exile and Belonging", desc: "Your answers point to a theme of searching for home, tribe, or a place where your full self can be received.", gift: "You may carry sensitivity to outsiders and a gift for making others feel less alone.", reflection: "What helps you belong without hiding your difference?", color: "#7ab8d8" },
      sovereignty: { key: "sovereignty", title: "Power and Sovereignty", desc: "Your answers point to a theme of power, visibility, and learning how to lead without hardening.", gift: "You may carry courage, presence, and the ability to make difficult choices.", reflection: "How can power move through you without becoming control?", color: "#d8a85f" },
    },
  },
  "4": {
    nodeId: 4,
    resultKey: "emotionalMemory",
    eyebrow: "Your Emotional Memory",
    title: "Discover Your Emotional Memory",
    intro: "This MVP explores an emotional imprint through reflection. This pattern can suggest what your nervous system remembers symbolically.",
    startLabel: "Find my emotional memory",
    question: "Which emotional atmosphere feels strangely familiar?",
    results: {
      longing: { key: "longing", title: "The Longing Memory", desc: "Your answers point to an old emotional memory of distance, waiting, or reaching for what felt unavailable.", gift: "This may reflect a heart that can sense meaning across distance and time.", reflection: "What desire can you honor without abandoning the present?", color: "#e06090" },
      vigilance: { key: "vigilance", title: "The Vigilance Memory", desc: "Your answers point to an old emotional memory of watching carefully, staying alert, and anticipating change.", gift: "This may reflect discernment, protection, and sharp emotional perception.", reflection: "Where is your body safe enough to stop scanning?", color: "#d8a85f" },
      silence: { key: "silence", title: "The Silence Memory", desc: "Your answers point to an old emotional memory of withheld truth, quiet endurance, or words left unsaid.", gift: "This may reflect depth, restraint, and a powerful inner voice waiting for space.", reflection: "What truth can be spoken gently now?", color: "#9070d8" },
    },
  },
  "5": {
    nodeId: 5,
    resultKey: "relationshipKarma",
    eyebrow: "Your Relationship Karma",
    title: "Discover Your Relationship Karma",
    intro: "This node reflects relationship patterns symbolically. Your answers point to the kind of bond lesson that may repeat until it is met with awareness.",
    startLabel: "Find my relationship karma",
    question: "What relationship pattern has repeated most often?",
    results: {
      rescuer: { key: "rescuer", title: "The Rescuer Pattern", desc: "Your answers point to relationships where love can become saving, fixing, or carrying more than your share.", gift: "You may carry compassion and emotional endurance that helps others heal.", reflection: "Where can love remain caring without becoming rescue?", color: "#7ab04a" },
      mirror: { key: "mirror", title: "The Mirror Pattern", desc: "Your answers point to relationships that reflect hidden parts of you with unusual intensity.", gift: "You may carry the ability to transform through honest emotional reflection.", reflection: "What is the mirror showing without requiring you to merge with it?", color: "#9070d8" },
      oath: { key: "oath", title: "The Old Oath Pattern", desc: "Your answers point to relationships shaped by loyalty, obligation, or promises that feel older than this life.", gift: "You may carry devotion and a powerful respect for commitment.", reflection: "Which promises still feel alive, and which can be released?", color: "#d8a85f" },
    },
  },
  "6": {
    nodeId: 6,
    resultKey: "hiddenTalents",
    eyebrow: "Your Hidden Talents",
    title: "Discover Your Hidden Talents",
    intro: "This is not a fixed past-life claim. Your answers point to talents that may feel old, natural, or strangely familiar.",
    startLabel: "Find my hidden talent",
    question: "Which ability feels natural even when you have not practiced it much?",
    results: {
      healing: { key: "healing", title: "Restorative Talent", desc: "Your answers point to a talent for calming, repairing, and noticing where energy or emotion needs care.", gift: "You may sense what helps people feel safe enough to soften.", reflection: "How can this gift include your own restoration?", color: "#7ab04a" },
      seeing: { key: "seeing", title: "Pattern-Seeing Talent", desc: "Your answers point to a talent for reading symbols, motives, timing, or subtle connections.", gift: "You may understand situations before the full story is spoken.", reflection: "What helps your insight stay grounded and useful?", color: "#7ab8d8" },
      making: { key: "making", title: "Sacred Making Talent", desc: "Your answers point to a talent for turning feeling into form through art, ritual, craft, words, or beauty.", gift: "You may make invisible meaning easier to touch.", reflection: "What wants to be made without waiting for perfection?", color: "#e06090" },
    },
  },
  "7": {
    nodeId: 7,
    resultKey: "repeatingLifeLesson",
    eyebrow: "Your Repeating Life Lesson",
    title: "Discover Your Repeating Life Lesson",
    intro: "This MVP identifies a recurring growth theme. Your answers point to a lesson that may be asking for a new response in this life.",
    startLabel: "Find my repeating lesson",
    question: "Which lesson keeps returning in different forms?",
    results: {
      receive: { key: "receive", title: "Learning to Receive", desc: "Your answers point to a lesson around letting support, love, and resources reach you without needing to earn them first.", gift: "This may reflect a generous soul learning reciprocity.", reflection: "What would change if receiving became a practice?", color: "#e06090" },
      choose: { key: "choose", title: "Learning to Choose", desc: "Your answers point to a lesson around making decisions from your own truth rather than fear, duty, or old expectation.", gift: "This may reflect a soul reclaiming direction.", reflection: "What choice would honor the current you?", color: "#d8a85f" },
      release: { key: "release", title: "Learning to Release", desc: "Your answers point to a lesson around endings, forgiveness, and freeing energy from stories that have already served their purpose.", gift: "This may reflect a soul that can transform grief into wisdom.", reflection: "What can be blessed and set down now?", color: "#9070d8" },
    },
  },
};

function getSavedString(nodeId: number, key: string) {
  const value = getNodeState(DISCIPLINE, nodeId).result?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function PastLifeMvpNode({ config }: { config: PastLifeMvpConfig }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<PastLifeMvpResult | null>(null);

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
    router.push("/sky/pastlife");
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
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>Your answers point to this pattern</p>
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

function PLNode8() {
  const router = useRouter();
  const [saved, setSaved] = useState<Array<{ title: string; value: string }>>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const state = getNodeState(DISCIPLINE, 8);
    setCompleted(state.status === "completed");
    if (state.status !== "completed") startNode(DISCIPLINE, 8);
    setSaved([
      { title: "Past Life Role", value: getSavedString(1, "soulAge") },
      { title: "Karma", value: getSavedString(2, "karma") },
      { title: "Past Life Theme", value: getSavedString(3, "pastLifeTheme") },
      { title: "Emotional Memory", value: getSavedString(4, "emotionalMemory") },
      { title: "Relationship Karma", value: getSavedString(5, "relationshipKarma") },
      { title: "Hidden Talents", value: getSavedString(6, "hiddenTalents") },
      { title: "Repeating Life Lesson", value: getSavedString(7, "repeatingLifeLesson") },
    ].filter((item) => item.value));
  }, []);

  const handleComplete = () => {
    completeNode(DISCIPLINE, 8, { pastLifeIntegration: saved.map((item) => item.value).join("|") || "partial" });
    setCompleted(true);
    router.push("/sky/pastlife");
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>*</div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "var(--text)", marginBottom: 10 }}>Your Past Life Integration</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>This gathers the past-life reflections available so far. If some results are missing, the integration stays partial and can deepen as earlier nodes are completed.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {saved.length ? saved.map((item) => (
          <div key={item.title} style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "13px 15px", background: "rgba(14,10,32,.55)" }}>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".09em", marginBottom: 5 }}>{item.title.toUpperCase()}</p>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.45 }}>{item.value}</p>
          </div>
        )) : (
          <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.55)" }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>Complete earlier past-life nodes to add more detail to this integration.</p>
          </div>
        )}
      </div>
      <div style={{ border: "1px solid rgba(160,130,220,.25)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.55)", marginBottom: 18 }}>
        <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>REFLECTION</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>Which old pattern feels ready to become wisdom instead of repetition?</p>
      </div>
      <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>{completed ? "Complete again" : "Complete node"}</button>
    </div>
  );
}

const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Past Life Role",  ru: "Vozrast dushi", sub: { en: "Beginning",  ru: "Nachalo" } },
  "2": { en: "Karma",     ru: "Karma",        sub: { en: "Patterns",   ru: "Patterny" } },
  "3": { en: "Past Life Theme", ru: "Tema proshloy zhizni", sub: { en: "Core echo", ru: "Glavnoe ekho" } },
  "4": { en: "Emotional Memory", ru: "Emotsionalnaya pamyat", sub: { en: "Inner imprint", ru: "Vnutrenniy otpechatok" } },
  "5": { en: "Relationship Karma", ru: "Karma otnosheniy", sub: { en: "Bond pattern", ru: "Pattern svyazi" } },
  "6": { en: "Hidden Talents", ru: "Skrytye talanty", sub: { en: "Old gifts", ru: "Starye dary" } },
  "7": { en: "Repeating Life Lesson", ru: "Povtoryayuschiysya urok", sub: { en: "Growth loop", ru: "Petlya rosta" } },
  "8": { en: "Integration", ru: "Integratsiya", sub: { en: "Synthesis", ru: "Sintez" } },
};

export default function PastLifeNodePage() {
  const params = useParams();
  const nodeId = String(params?.nodeId ?? "1");
  const { lang } = useLang();
  const router = useRouter();

  const nodeNum = parseInt(nodeId);
  const locked = typeof window !== "undefined" ? isNodeLocked(DISCIPLINE, nodeNum) : false;
  const coolingDown = typeof window !== "undefined" ? isNodeCoolingDown(DISCIPLINE, nodeNum) : false;
  const state = typeof window !== "undefined" ? getNodeState(DISCIPLINE, nodeNum) : { status: "locked" };
  const meta = NODE_TITLES[nodeId];
  if (!meta) { router.push("/sky/pastlife"); return null; }
  const title = meta.en;
  const subtitle = meta.sub.en;

  if (locked) return (
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/pastlife">
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/pastlife">
        {coolingDown ? <CooldownNodeMessage /> : (
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
            <p style={{ color: "var(--muted)" }}>Complete the previous node first</p>
          </div>
        )}
      </NodePage>
    </SkyNodeEntitlementGate>
  );

  return (
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/pastlife">
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/pastlife" badge={state.status === "completed" ? "completed" : undefined}>
        {nodeId === "1" && <PLNode1 />}
        {nodeId === "2" && <PLNode2 />}
        {PAST_LIFE_MVP_CONFIGS[nodeId] && <PastLifeMvpNode config={PAST_LIFE_MVP_CONFIGS[nodeId]} />}
        {nodeId === "8" && <PLNode8 />}
      </NodePage>
    </SkyNodeEntitlementGate>
  );
}
