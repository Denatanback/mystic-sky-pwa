"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { CooldownNodeMessage } from "@/components/sky/CooldownNodeMessage";
import { SkyNodeEntitlementGate } from "@/components/sky/SkyNodeEntitlementGate";
import { useLang } from "@/lib/i18n";
import { startNode, completeNode, getNodeState, isNodeLocked, isNodeCoolingDown } from "@/lib/nodeProgress";

const TOTAL = 8;
const DISCIPLINE = "humandesign";

type HDType = "Generator" | "ManifestingGenerator" | "Projector" | "Manifestor" | "Reflector";

const HD_TYPES: Record<HDType, {
  en: string; ru: string;
  strategy: { en: string; ru: string };
  signature: { en: string; ru: string };
  notSelf: { en: string; ru: string };
  desc: { en: string; ru: string };
  color: string;
}> = {
  Generator: {
    en: "Generator", ru: "Generator",
    strategy: { en: "Wait to Respond", ru: "Zhdi i reagiruy" },
    signature: { en: "Satisfaction", ru: "Udovletvorenie" },
    notSelf: { en: "Frustration", ru: "Frustratsiya" },
    desc: { en: "You are the life force of humanity -- a sustainable source of energy when you respond to what truly lights you up.", ru: "Ty -- zhiznennaya sila chelovechestva. Istochnik ustoychivoy energii, kogda reagiruesh na to, chto po-nastoyaschemu zazhigaet tebya." },
    color: "#d8a85f",
  },
  ManifestingGenerator: {
    en: "Manifesting Generator", ru: "Manifestiruyuschiy Generator",
    strategy: { en: "Wait to Respond, then Inform", ru: "Zhdi otklika, zatem soobschi" },
    signature: { en: "Satisfaction & Peace", ru: "Udovletvorenie i mir" },
    notSelf: { en: "Frustration & Anger", ru: "Frustratsiya i zlost" },
    desc: { en: "You are a multi-passionate powerhouse -- fast, efficient, and built for doing many things at once when guided by your response.", ru: "Ty -- mnogotselevoy istochnik sily: bystryy, effektivnyy, sozdan delat mnogo veschey odnovremenno." },
    color: "#e89040",
  },
  Projector: {
    en: "Projector", ru: "Proektor",
    strategy: { en: "Wait for the Invitation", ru: "Zhdi priglasheniya" },
    signature: { en: "Success", ru: "Uspekh" },
    notSelf: { en: "Bitterness", ru: "Gorech" },
    desc: { en: "You are the natural guide of humanity -- here to see deeply and direct others when recognized and invited.", ru: "Ty -- prirodnyy provodnik chelovechestva. Vidish gluboko i napravlyaesh energiyu drugikh, kogda tebya priznayut i priglashayut." },
    color: "#7ab0d8",
  },
  Manifestor: {
    en: "Manifestor", ru: "Manifestor",
    strategy: { en: "Inform before acting", ru: "Informiruy pered deystviem" },
    signature: { en: "Peace", ru: "Mir" },
    notSelf: { en: "Anger", ru: "Zlost" },
    desc: { en: "You are the initiator -- the rare type who can act without waiting. Your power lies in informing others before you move.", ru: "Ty -- initsiator, redkiy tip, sposobnyy deystvovat bez ozhidaniya. Tvoya sila -- informirovat drugikh pered dvizheniem." },
    color: "#e05050",
  },
  Reflector: {
    en: "Reflector", ru: "Reflektor",
    strategy: { en: "Wait a Lunar Cycle", ru: "Zhdi lunnyy tsikl" },
    signature: { en: "Surprise & Delight", ru: "Udivlenie i radost" },
    notSelf: { en: "Disappointment", ru: "Razocharovanie" },
    desc: { en: "You are the mirror of your community -- deeply sensitive to your environment. You reflect the health of those around you.", ru: "Ty -- zerkalo svoego okruzheniya, chuvstvitelnyy k srede. Ty otrazhaesh zdorove tekh, kto ryadom." },
    color: "#9070d8",
  },
};

const TYPE_QUESTIONS: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; score: Partial<Record<HDType, number>> }[] }[] = [
  {
    q: { en: "How do you make decisions best?", ru: "Kak ty prinimaesh resheniya luchshe vsego?" },
    opts: [
      { label: { en: "When something genuinely excites me / I feel it in my gut", ru: "Kogda chto-to iskrenne raduet / chuvstvuyu nutrom" }, score: { Generator: 2, ManifestingGenerator: 1 } },
      { label: { en: "When I am specifically asked for my input", ru: "Kogda menya spetsialno priglashayut vyskazatsya" }, score: { Projector: 2 } },
      { label: { en: "I just know what to do and act on it", ru: "Ya prosto znayu chto delat i deystvuyu" }, score: { Manifestor: 2 } },
      { label: { en: "I need a full lunar cycle (28+ days) to feel sure", ru: "Mne nuzhen polnyy lunnyy tsikl (28+ dney)" }, score: { Reflector: 2 } },
    ],
  },
  {
    q: { en: "Which describes your energy levels?", ru: "Chto luchshe opisyvaet tvoy uroven energii?" },
    opts: [
      { label: { en: "Consistent and sustainable -- I can work for long stretches", ru: "Stabilnaya, ustoychivaya -- mogu rabotat dolgo" }, score: { Generator: 2 } },
      { label: { en: "Bursting and variable -- I sprint then need to rest", ru: "Vzryvnaya i peremennaya -- ryvki i zatem otdykh" }, score: { ManifestingGenerator: 2 } },
      { label: { en: "Non-consistent -- I need to manage it carefully", ru: "Nepostoyannaya -- nuzhno berech ee" }, score: { Projector: 1, Reflector: 1 } },
      { label: { en: "I create waves of energy that impact others around me", ru: "Ya sozdayu volny energii, vliyayuschie na okruzhayuschikh" }, score: { Manifestor: 2 } },
    ],
  },
  {
    q: { en: "In social situations, you tend to...", ru: "V sotsialnykh situatsiyakh ty obychno..." },
    opts: [
      { label: { en: "Wait until someone talks to me, then engage fully", ru: "Zhdu poka ko mne obratyatsya, zatem vklyuchayus" }, score: { Generator: 1, Projector: 1 } },
      { label: { en: "Read the room deeply -- absorb everyone's energy", ru: "Gluboko schityvayu atmosferu -- vpityvayu chuzhuyu energiyu" }, score: { Reflector: 2, Projector: 1 } },
      { label: { en: "Naturally take the lead and initiate conversations", ru: "Estestvenno beru initsiativu i nachinayu razgovor" }, score: { Manifestor: 2, ManifestingGenerator: 1 } },
      { label: { en: "Guide and advise -- people come to me for direction", ru: "Napravlyayu i sovetuyu -- lyudi idut ko mne za rukovodstvom" }, score: { Projector: 2 } },
    ],
  },
  {
    q: { en: "When something goes wrong, you most often feel...", ru: "Kogda chto-to idet ne tak, ty chasche vsego chuvstvuesh..." },
    opts: [
      { label: { en: "Frustrated that things aren't flowing", ru: "Frustratsiyu, chto vse ne idet kak nado" }, score: { Generator: 2, ManifestingGenerator: 1 } },
      { label: { en: "Bitter that your wisdom wasn't recognised", ru: "Gorech, chto tvoyu mudrost ne priznali" }, score: { Projector: 2 } },
      { label: { en: "Angry that things are being resisted", ru: "Zlost, chto chto-to tebe soprotivlyaetsya" }, score: { Manifestor: 2 } },
      { label: { en: "Disappointed in those around me and the environment", ru: "Razocharovanie v okruzhayuschikh i obstanovke" }, score: { Reflector: 2 } },
    ],
  },
  {
    q: { en: "Which phrase resonates most?", ru: "Kakaya fraza rezoniruet bolshe vsego?" },
    opts: [
      { label: { en: "I love doing things and mastering them", ru: "Ya lyublyu delat veschi i osvaivat ikh" }, score: { Generator: 2 } },
      { label: { en: "I can see things others miss and love guiding", ru: "Ya vizhu to, chto drugie ne zamechayut, i lyublyu napravlyat" }, score: { Projector: 2 } },
      { label: { en: "I just make things happen -- I don't need permission", ru: "Ya prosto delayu veschi -- mne ne nuzhno razreshenie" }, score: { Manifestor: 2 } },
      { label: { en: "I do many things fast and change direction easily", ru: "Delayu mnogo vsego bystro i legko menyayu napravlenie" }, score: { ManifestingGenerator: 2 } },
    ],
  },
];

function calcHDType(answers: number[]): HDType {
  const scores: Record<HDType, number> = { Generator: 0, ManifestingGenerator: 0, Projector: 0, Manifestor: 0, Reflector: 0 };
  answers.forEach((a, qi) => {
    const opts = TYPE_QUESTIONS[qi]?.opts[a];
    if (opts) Object.entries(opts.score).forEach(([k, v]) => { scores[k as HDType] = (scores[k as HDType] ?? 0) + (v ?? 0); });
  });
  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as HDType;
}

function isHDType(value: unknown): value is HDType {
  return typeof value === "string" && value in HD_TYPES;
}

function HDNode1() {
  const { lang } = useLang();
  const router = useRouter();
  const [qIdx, setQIdx] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<HDType | null>(null);

  useEffect(() => {
    const saved = getNodeState(DISCIPLINE, 1);
    if (saved.status === "completed" && isHDType(saved.result?.hdType)) {
      setResult(saved.result.hdType);
      setQIdx(TYPE_QUESTIONS.length);
      return;
    }
    startNode(DISCIPLINE, 1);
  }, []);

  const answer = (optIdx: number) => {
    const next = [...answers, optIdx];
    setAnswers(next);
    if (next.length >= TYPE_QUESTIONS.length) {
      setResult(calcHDType(next));
      setQIdx(TYPE_QUESTIONS.length);
    } else {
      setQIdx(qIdx + 1);
    }
  };

  const handleComplete = () => {
    completeNode(DISCIPLINE, 1, { hdType: result });
    router.push("/sky/humandesign");
  };

  const q = qIdx >= 0 && qIdx < TYPE_QUESTIONS.length ? TYPE_QUESTIONS[qIdx] : null;
  const typeData = result ? HD_TYPES[result] : null;

  return (
    <div>
      {qIdx === -1 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>&#9650;</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>
              {false ? "Uznay svoy Tip" : "Discover Your Energy Type"}
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {false
                ? "V Human Design est 5 Tipov. Tvoy tip -- osnova strategii zhizni. Otvet na 5 voprosov."
                : "Human Design has 5 Energy Types. Answer 5 questions to reveal how your energy naturally moves through the world."}
            </p>
          </div>
          <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Nachat →" : "Start →"}
          </button>
        </div>
      )}

      {q && (
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {TYPE_QUESTIONS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= qIdx ? "var(--gold)" : "rgba(255,255,255,.1)" }} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{false ? `Vopros ${qIdx + 1} iz ${TYPE_QUESTIONS.length}` : `Question ${qIdx + 1} of ${TYPE_QUESTIONS.length}`}</p>
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

      {result && typeData && qIdx === TYPE_QUESTIONS.length && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
              Your Energy Type
            </p>
            <div style={{ width: 110, height: 110, margin: "0 auto 14px", borderRadius: "50%", background: `radial-gradient(circle at 38% 32%, ${typeData.color}33, rgba(14,10,32,.95))`, border: `2px solid ${typeData.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${typeData.color}44` }}>
              <span style={{ fontSize: 46 }}>&#9651;</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>{typeData.en}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{false ? "Tvoy Tip Human Design" : "Human Design Energy Type"}</p>
          </div>
          <div style={{ border: `1px solid ${typeData.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{typeData.desc.en}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: "12px", borderRadius: 12, border: "1px solid rgba(100,200,100,.3)", background: "rgba(20,50,20,.4)", textAlign: "center" }}>
              <p style={{ fontSize: 10, color: "rgba(100,220,100,.8)", letterSpacing: ".08em", fontWeight: 700, marginBottom: 4 }}>{false ? "STRATEGIYa" : "STRATEGY"}</p>
              <p style={{ fontSize: 12, color: "var(--text)" }}>{typeData.strategy.en}</p>
            </div>
            <div style={{ padding: "12px", borderRadius: 12, border: "1px solid rgba(216,168,95,.3)", background: "rgba(40,30,0,.4)", textAlign: "center" }}>
              <p style={{ fontSize: 10, color: "var(--gold-2)", letterSpacing: ".08em", fontWeight: 700, marginBottom: 4 }}>{false ? "SIGNATURA" : "SIGNATURE"}</p>
              <p style={{ fontSize: 12, color: "var(--text)" }}>{typeData.signature.en}</p>
            </div>
          </div>
          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {false ? "Zavershit uzel ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

type HDAuthority = "Sacral" | "Emotional" | "Splenic" | "Ego" | "Self" | "Mental" | "Lunar";
const AUTHORITIES: Record<HDAuthority, { en: string; ru: string; desc: { en: string; ru: string }; how: { en: string; ru: string }; color: string }> = {
  Sacral:    { en: "Sacral Authority",    ru: "Sakralnyy avtoritet",    desc: { en: "Your gut knows instantly -- yes/no sounds are your oracle.", ru: "Tvoe nutro znaet mgnovenno -- zvuki «ugu/nea» tvoy orakul." }, how: { en: "Trust the gut sound, not the mind.", ru: "Doveryay zvuku nutra, a ne umu." }, color: "#d8a85f" },
  Emotional: { en: "Emotional Authority", ru: "Emotsionalnyy avtoritet", desc: { en: "Your truth emerges over time through emotional waves. Never decide in the moment.", ru: "Tvoya istina poyavlyaetsya so vremenem cherez emotsionalnye volny. Nikogda ne reshay v momente." }, how: { en: "Sleep on it. Decide only when emotionally clear.", ru: "Perespi s etim. Reshay tolko v emotsionalnoy yasnosti." }, color: "#7ab8d8" },
  Splenic:   { en: "Splenic Authority",   ru: "Selezenochnyy avtoritet",  desc: { en: "Spontaneous survival-based intuition -- a quiet whisper in the moment.", ru: "Spontannaya intuitsiya vyzhivaniya -- tikhiy shepot v momente." }, how: { en: "Listen to that first quiet instinct. It won't repeat.", ru: "Slushay pervyy tikhiy instinkt. On ne povtoritsya." }, color: "#7ab04a" },
  Ego:       { en: "Ego Authority",       ru: "Ego-avtoritet",           desc: { en: "Your heart and willpower guide you -- what you want to commit to, or not.", ru: "Tvoe serdtse i sila voli vedut tebya -- gotov li ty vzyat obyazatelstvo ili net." }, how: { en: "Ask: does my heart really want this?", ru: "Sprosi: moe serdtse deystvitelno etogo khochet?" }, color: "#e05050" },
  Self:      { en: "Self-Projected",      ru: "Avtoritet Samosti",       desc: { en: "You need to talk it through to hear your own truth -- a trusted listener is key.", ru: "Tebe nuzhno progovorit vslukh, chtoby uslyshat svoyu istinu -- nuzhen doverennyy slushatel." }, how: { en: "Talk it out with someone you trust. Listen to yourself speak.", ru: "Progovori s tem, komu doveryaesh. Slushay, chto sam govorish." }, color: "#c0a0d8" },
  Mental:    { en: "Mental Authority",    ru: "Mentalnyy avtoritet",    desc: { en: "You need to think out loud over time -- with different trusted people.", ru: "Tebe nuzhno dumat vslukh so vremenem -- s raznymi doverennymi lyudmi." }, how: { en: "Get multiple trusted perspectives before deciding.", ru: "Poluchi neskolko doverennykh tochek zreniya pered resheniem." }, color: "#9070d8" },
  Lunar:     { en: "Lunar Authority",     ru: "Lunnyy avtoritet",     desc: { en: "As a Reflector, your clarity comes through a full 28-day lunar cycle.", ru: "Kak Reflektor, tvoya yasnost prikhodit cherez polnyy 28-dnevnyy lunnyy tsikl." }, how: { en: "Track the full lunar cycle. Your truth reveals itself.", ru: "Otslezhivay polnyy lunnyy tsikl. Istina proyavitsya." }, color: "#9070d8" },
};

const AUTH_QUESTIONS: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; score: Partial<Record<HDAuthority, number>> }[] }[] = [
  {
    q: { en: "When you make a big decision, what feels most reliable?", ru: "Kogda prinimaesh vazhnoe reshenie, chemu bolshe vsego doveryaesh?" },
    opts: [
      { label: { en: "An instant gut feeling -- almost physical", ru: "Mgnovennoe chuvstvo nutra -- pochti fizicheskoe" }, score: { Sacral: 2, Splenic: 1 } },
      { label: { en: "My emotions -- I need to feel into it over days", ru: "Moi emotsii -- nuzhno prochuvstvovat za neskolko dney" }, score: { Emotional: 2 } },
      { label: { en: "Talking it through with someone -- hearing myself", ru: "Progovarivaya eto -- slyshu sebya" }, score: { Self: 2, Mental: 1 } },
      { label: { en: "My heart / willpower -- what I'm willing to commit to", ru: "Serdtse / sila voli -- gotovnost vzyat obyazatelstvo" }, score: { Ego: 2 } },
    ],
  },
  {
    q: { en: "How quickly do you know if something is right for you?", ru: "Kak bystro ty ponimaesh, podkhodit li tebe chto-to?" },
    opts: [
      { label: { en: "Instantly -- there's a clear yes/no in my body", ru: "Mgnovenno -- v tele chetkoe «da» ili «net»" }, score: { Sacral: 2, Splenic: 1 } },
      { label: { en: "It takes time -- I need to let it settle emotionally", ru: "Nuzhno vremya -- pust emotsionalno ustoitsya" }, score: { Emotional: 2 } },
      { label: { en: "When I've talked about it enough with the right person", ru: "Kogda dostatochno progovoril s nuzhnym chelovekom" }, score: { Self: 2, Mental: 1 } },
      { label: { en: "Very slowly -- over a 28+ day period", ru: "Ochen medlenno -- za period 28+ dney" }, score: { Lunar: 2 } },
    ],
  },
  {
    q: { en: "What happens when you decide too quickly?", ru: "Chto proiskhodit, kogda reshaesh slishkom bystro?" },
    opts: [
      { label: { en: "I often regret it -- my emotions weren't clear", ru: "Chasto sozhaleyu -- emotsii ne byli yasny" }, score: { Emotional: 2 } },
      { label: { en: "Things go wrong -- I ignored my first instinct", ru: "Vse idet ne tak -- proignoriroval pervyy instinkt" }, score: { Splenic: 2 } },
      { label: { en: "I realise later when talking I felt different inside", ru: "Pozzhe pri razgovore ponimayu, chto chuvstvoval inache" }, score: { Self: 2, Mental: 1 } },
      { label: { en: "I didn't check if my heart was truly in it", ru: "Ne proveril, bylo li serdtse v etom" }, score: { Ego: 2 } },
    ],
  },
];

function calcAuthority(answers: number[]): HDAuthority {
  const scores: Record<string, number> = {};
  answers.forEach((a, qi) => {
    const opts = AUTH_QUESTIONS[qi]?.opts[a];
    if (opts) Object.entries(opts.score).forEach(([k, v]) => { scores[k] = (scores[k] ?? 0) + (v ?? 0); });
  });
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return (sorted[0]?.[0] ?? "Sacral") as HDAuthority;
}

function isHDAuthority(value: unknown): value is HDAuthority {
  return typeof value === "string" && value in AUTHORITIES;
}

function HDNode2() {
  const { lang } = useLang();
  const router = useRouter();
  const [qIdx, setQIdx] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<HDAuthority | null>(null);

  useEffect(() => {
    const saved = getNodeState(DISCIPLINE, 2);
    if (saved.status === "completed" && isHDAuthority(saved.result?.hdAuthority)) {
      setResult(saved.result.hdAuthority);
      setQIdx(AUTH_QUESTIONS.length);
      return;
    }
    startNode(DISCIPLINE, 2);
  }, []);

  const answer = (optIdx: number) => {
    const next = [...answers, optIdx];
    setAnswers(next);
    if (next.length >= AUTH_QUESTIONS.length) {
      setResult(calcAuthority(next));
      setQIdx(AUTH_QUESTIONS.length);
    } else {
      setQIdx(qIdx + 1);
    }
  };

  const handleComplete = () => {
    completeNode(DISCIPLINE, 2, { hdAuthority: result });
    router.push("/sky/humandesign");
  };

  const q = qIdx >= 0 && qIdx < AUTH_QUESTIONS.length ? AUTH_QUESTIONS[qIdx] : null;
  const authData = result ? AUTHORITIES[result] : null;

  return (
    <div>
      {qIdx === -1 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>&#10025;</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>
              {false ? "Tvoy Avtoritet" : "Your Authority"}
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {false
                ? "Avtoritet -- tvoy vnutrenniy mekhanizm prinyatiya resheniy. Ne um, ne logika -- nechto bolee drevnee i nadezhnoe."
                : "Your Authority is your inner decision-making mechanism. Not the mind, not logic -- something older and more reliable."}
            </p>
          </div>
          <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Uznat avtoritet →" : "Find my authority →"}
          </button>
        </div>
      )}

      {q && (
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {AUTH_QUESTIONS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= qIdx ? "var(--gold)" : "rgba(255,255,255,.1)" }} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{false ? `Vopros ${qIdx + 1} iz ${AUTH_QUESTIONS.length}` : `Question ${qIdx + 1} of ${AUTH_QUESTIONS.length}`}</p>
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

      {result && authData && qIdx === AUTH_QUESTIONS.length && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 110, height: 110, margin: "0 auto 14px", borderRadius: "50%", background: `radial-gradient(circle, ${authData.color}33, rgba(14,10,32,.95))`, border: `2px solid ${authData.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${authData.color}44` }}>
              <span style={{ fontSize: 48 }}>&#9675;</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{authData.en}</h2>
          </div>
          <div style={{ border: `1px solid ${authData.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{authData.desc.en}</p>
          </div>
          <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 12, padding: "12px 16px", background: "rgba(216,168,95,.06)", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 4 }}>{false ? "KAK ISPOLZOVAT" : "HOW TO USE IT"}</p>
            <p style={{ fontSize: 13, color: "var(--text)" }}>{authData.how.en}</p>
          </div>
          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {false ? "Zavershit uzel ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

type HDMvpResult = {
  key: string;
  title: string;
  desc: string;
  strength: string;
  reflection: string;
  color: string;
};

type HDMvpQuestion = {
  q: string;
  opts: Array<{ label: string; score: Record<string, number> }>;
};

type HDMvpConfig = {
  nodeId: number;
  resultKey: "hdProfile" | "hdCenters" | "hdChannels" | "hdGates" | "hdCycles";
  eyebrow: string;
  title: string;
  intro: string;
  startLabel: string;
  results: Record<string, HDMvpResult>;
  questions: HDMvpQuestion[];
  sections: {
    pattern: string;
    practice: string;
    next: string;
  };
};

const PROFILE_RESULTS: Record<string, HDMvpResult> = {
  guide: { key: "guide", title: "The Guide", desc: "Your answers point to a role that naturally notices direction, timing, and what others may be missing.", strength: "You may help people find clarity by naming the path in simple terms.", reflection: "Where do people already come to you for perspective or direction?", color: "#7ab0d8" },
  experimenter: { key: "experimenter", title: "The Experimenter", desc: "This pattern may reflect someone who learns by trying, adjusting, and letting life become the teacher.", strength: "You bring movement, curiosity, and permission to test new ways of being.", reflection: "What recent experiment taught you more than planning could have?", color: "#e89040" },
  stabilizer: { key: "stabilizer", title: "The Stabilizer", desc: "Your answers point to a steady life-role pattern: grounding people, plans, and energy when things scatter.", strength: "You may be trusted because you make the next step feel practical.", reflection: "Where does your calm help others feel safer?", color: "#d8a85f" },
  mirror: { key: "mirror", title: "The Mirror", desc: "This pattern may reflect a sensitive role that reveals what is true in the room without forcing it.", strength: "You notice subtle shifts and help people see themselves more honestly.", reflection: "What environment brings out your clearest reflection?", color: "#9070d8" },
  catalyst: { key: "catalyst", title: "The Catalyst", desc: "Your answers point to a role that wakes up movement, change, and honest action around you.", strength: "You may activate what has been waiting beneath the surface.", reflection: "Where do you create change simply by being direct?", color: "#e05050" },
};

const CENTERS_RESULTS: Record<string, HDMvpResult> = {
  openMind: { key: "openMind", title: "Open Mind Pattern", desc: "Your answers point to a mind that receives many perspectives and can become wise through discernment.", strength: "You may be gifted at seeing several angles before choosing what is yours.", reflection: "Which thoughts feel truly yours, and which feel absorbed from others?", color: "#9070d8" },
  definedHeart: { key: "definedHeart", title: "Defined Heart Pattern", desc: "This pattern may reflect consistent will, devotion, and a need to commit only where the heart is real.", strength: "You can bring courage and follow-through when the promise matters.", reflection: "What commitment currently deserves your full heart?", color: "#e05050" },
  emotionalReceiver: { key: "emotionalReceiver", title: "Emotional Receiver", desc: "Your answers point to sensitivity around emotional atmosphere and relational waves.", strength: "You may understand what others feel before they can explain it.", reflection: "Which emotions belong to you, and which did you pick up today?", color: "#7ab8d8" },
  groundedBuilder: { key: "groundedBuilder", title: "Grounded Builder", desc: "This pattern may reflect consistent body-based energy for building when your rhythm is respected.", strength: "You turn ideas into something real through repetition and patience.", reflection: "What becomes easier when you stop rushing your pace?", color: "#d8a85f" },
  adaptiveChannel: { key: "adaptiveChannel", title: "Adaptive Channel", desc: "Your answers point to flexible energy that changes with people, place, and purpose.", strength: "You may adapt quickly and sense which part of you is needed now.", reflection: "Which environments make your energy feel most like yourself?", color: "#7ab04a" },
};

const CHANNELS_RESULTS: Record<string, HDMvpResult> = {
  creative: { key: "creative", title: "Creative Flow", desc: "Your energy may move through expression, making, and turning impressions into visible form.", strength: "You bring life to ideas by shaping them into something others can feel.", reflection: "What wants to be made through you this week?", color: "#e89040" },
  protective: { key: "protective", title: "Protective Flow", desc: "Your answers point to energy that moves toward care, boundaries, and keeping what matters safe.", strength: "You notice what needs protection before others do.", reflection: "Where is a clean boundary actually an act of care?", color: "#e05050" },
  insight: { key: "insight", title: "Insight Flow", desc: "This pattern may reflect energy that moves through observation, pattern recognition, and clear naming.", strength: "You can translate complexity into a useful insight.", reflection: "What pattern keeps repeating around you?", color: "#7ab0d8" },
  emotional: { key: "emotional", title: "Emotional Flow", desc: "Your energy may move in waves, revealing truth through feeling rather than force.", strength: "You bring depth and emotional honesty when you allow time.", reflection: "What feels clearer after you let the wave pass?", color: "#7ab8d8" },
  grounding: { key: "grounding", title: "Grounding Flow", desc: "Your answers point to energy that stabilizes, organizes, and brings people back into the body.", strength: "You can make a situation feel workable again.", reflection: "What simple action would ground your next step?", color: "#d8a85f" },
};

const GATES_RESULTS: Record<string, HDMvpResult> = {
  insight: { key: "insight", title: "Gate of Insight", desc: "Your recurring signal may be the moment when something hidden becomes obvious.", strength: "You notice the small clue that changes the whole picture.", reflection: "What quiet insight have you been dismissing?", color: "#7ab0d8" },
  direction: { key: "direction", title: "Gate of Direction", desc: "Your answers point to sensitivity around path, purpose, and where energy wants to go next.", strength: "You may feel when a direction is aligned before proof appears.", reflection: "Which direction feels calm, even if it is not loud?", color: "#d8a85f" },
  expression: { key: "expression", title: "Gate of Expression", desc: "This pattern may reflect a recurring need to speak, create, or show the truth plainly.", strength: "You turn inner pressure into language, art, or action.", reflection: "What truth wants a cleaner expression?", color: "#e89040" },
  devotion: { key: "devotion", title: "Gate of Devotion", desc: "Your recurring signal may be loyalty: noticing what deserves your care and what no longer does.", strength: "You can stay with what matters when the devotion is real.", reflection: "Where is your devotion nourishing you, and where is it draining you?", color: "#e05050" },
  change: { key: "change", title: "Gate of Change", desc: "Your answers point to a sensitivity for transition, restlessness, and the moment a cycle is complete.", strength: "You may know when a pattern is ready to evolve.", reflection: "What change has already begun inside you?", color: "#9070d8" },
};

const CYCLES_RESULTS: Record<string, HDMvpResult> = {
  fastInitiator: { key: "fastInitiator", title: "Fast Initiator", desc: "Your timing pattern may move in sparks: quick starts, clear impulses, and momentum that needs room.", strength: "You can activate a new chapter before others are ready to name it.", reflection: "Which impulse deserves action, and which needs one breath first?", color: "#e05050" },
  slowIntegrator: { key: "slowIntegrator", title: "Slow Integrator", desc: "Your answers point to timing that deepens through patience, digestion, and lived experience.", strength: "You make better choices when you let truth settle into the body.", reflection: "What are you still integrating?", color: "#7ab0d8" },
  seasonalMover: { key: "seasonalMover", title: "Seasonal Mover", desc: "This pattern may reflect life in seasons: build, pause, release, and begin again.", strength: "You may thrive when you stop expecting every season to have the same pace.", reflection: "Which season are you in right now?", color: "#7ab04a" },
  emotionalWave: { key: "emotionalWave", title: "Emotional Wave", desc: "Your timing may clarify through feeling waves rather than instant certainty.", strength: "You can make emotionally honest decisions when you allow time.", reflection: "What choice needs emotional clarity before action?", color: "#7ab8d8" },
  quietBuilder: { key: "quietBuilder", title: "Quiet Builder", desc: "Your answers point to steady, private accumulation: small actions becoming a durable path.", strength: "You build trust with yourself through repeatable steps.", reflection: "What small step would matter if repeated for seven days?", color: "#d8a85f" },
};

const HD_MVP_CONFIGS: Record<string, HDMvpConfig> = {
  "3": {
    nodeId: 3,
    resultKey: "hdProfile",
    eyebrow: "Your Profile Pattern",
    title: "Discover Your Profile",
    intro: "This is not a calculated Human Design profile yet. Your answers point to the role pattern you may naturally play in life and relationships.",
    startLabel: "Find my profile pattern",
    results: PROFILE_RESULTS,
    questions: [
      { q: "When people ask for your help, what do they usually need?", opts: [
        { label: "Direction and a clearer next step", score: { guide: 2 } },
        { label: "Permission to try something new", score: { experimenter: 2 } },
        { label: "Calm, structure and consistency", score: { stabilizer: 2 } },
        { label: "An honest reflection of what is happening", score: { mirror: 2 } },
        { label: "A push to finally move or change", score: { catalyst: 2 } },
      ] },
      { q: "Which role feels most familiar in a group?", opts: [
        { label: "I quietly notice the path forward", score: { guide: 2 } },
        { label: "I test ideas by doing", score: { experimenter: 2 } },
        { label: "I hold the center when things scatter", score: { stabilizer: 2 } },
        { label: "I sense the emotional truth in the room", score: { mirror: 2 } },
        { label: "I activate momentum", score: { catalyst: 2 } },
      ] },
      { q: "What kind of growth has shaped you most?", opts: [
        { label: "Learning to trust my perspective", score: { guide: 1, mirror: 1 } },
        { label: "Learning through trial, error and repair", score: { experimenter: 2 } },
        { label: "Learning to be dependable without carrying everyone", score: { stabilizer: 2 } },
        { label: "Learning to reflect without absorbing", score: { mirror: 2 } },
        { label: "Learning to create change without burning out", score: { catalyst: 2 } },
      ] },
    ],
    sections: {
      pattern: "This pattern may describe how your role is felt by others before you explain it.",
      practice: "Use it as a reflection tool: notice when this role feels natural versus when it becomes pressure.",
      next: "Next, Centers explores where your energy feels consistent or influenced by others.",
    },
  },
  "4": {
    nodeId: 4,
    resultKey: "hdCenters",
    eyebrow: "Your Center Pattern",
    title: "Discover Your Centers Pattern",
    intro: "This MVP does not calculate defined or open centers. Your answers point to where you may feel consistent, influenced, or amplified.",
    startLabel: "Find my center pattern",
    results: CENTERS_RESULTS,
    questions: [
      { q: "Where do you most often feel outside influence?", opts: [
        { label: "In my thoughts and mental pressure", score: { openMind: 2 } },
        { label: "In my confidence or promises", score: { definedHeart: 2 } },
        { label: "In the emotions around me", score: { emotionalReceiver: 2 } },
        { label: "In my pace and work rhythm", score: { groundedBuilder: 2 } },
        { label: "It changes depending on the room", score: { adaptiveChannel: 2 } },
      ] },
      { q: "What feels most consistent when you are well?", opts: [
        { label: "Seeing many perspectives", score: { openMind: 1, adaptiveChannel: 1 } },
        { label: "Commitment when my heart is in it", score: { definedHeart: 2 } },
        { label: "Reading emotional atmosphere", score: { emotionalReceiver: 2 } },
        { label: "Building steadily", score: { groundedBuilder: 2 } },
        { label: "Adapting to what is needed", score: { adaptiveChannel: 2 } },
      ] },
      { q: "What do you need more of?", opts: [
        { label: "Mental quiet", score: { openMind: 2 } },
        { label: "Cleaner commitments", score: { definedHeart: 2 } },
        { label: "Emotional boundaries", score: { emotionalReceiver: 2 } },
        { label: "A grounded routine", score: { groundedBuilder: 2 } },
        { label: "The right environment", score: { adaptiveChannel: 2 } },
      ] },
    ],
    sections: {
      pattern: "This pattern may reflect where your system is most stable and where it is most porous.",
      practice: "Before deciding, ask whether the pressure is yours or something you are amplifying from the room.",
      next: "Next, Channels looks at how energy moves through you once it is activated.",
    },
  },
  "5": {
    nodeId: 5,
    resultKey: "hdChannels",
    eyebrow: "Your Energy Flow",
    title: "Discover Your Channels Flow",
    intro: "This quiz reflects the way energy may move through you. It is not a precise bodygraph channel calculation yet.",
    startLabel: "Find my flow",
    results: CHANNELS_RESULTS,
    questions: [
      { q: "When energy is moving well, what happens?", opts: [
        { label: "I create, write, design or make something", score: { creative: 2 } },
        { label: "I protect what matters", score: { protective: 2 } },
        { label: "I see a pattern clearly", score: { insight: 2 } },
        { label: "I feel deeply and understand the emotional current", score: { emotional: 2 } },
        { label: "I organize the next practical step", score: { grounding: 2 } },
      ] },
      { q: "What blocks your flow fastest?", opts: [
        { label: "No room for expression", score: { creative: 2 } },
        { label: "Weak boundaries", score: { protective: 2 } },
        { label: "Noise that hides the signal", score: { insight: 2 } },
        { label: "Being rushed through feelings", score: { emotional: 2 } },
        { label: "Too much chaos", score: { grounding: 2 } },
      ] },
      { q: "What do others often receive from you?", opts: [
        { label: "Ideas and expression", score: { creative: 2 } },
        { label: "Protection and loyalty", score: { protective: 2 } },
        { label: "Clarity and perspective", score: { insight: 2 } },
        { label: "Depth and empathy", score: { emotional: 2 } },
        { label: "Calm and structure", score: { grounding: 2 } },
      ] },
    ],
    sections: {
      pattern: "This flow may be the path your energy prefers when it is not being forced.",
      practice: "Notice what kind of task makes your body soften instead of brace.",
      next: "Next, Gates explores a more specific signal that may keep repeating in your life.",
    },
  },
  "6": {
    nodeId: 6,
    resultKey: "hdGates",
    eyebrow: "Your Recurring Signal",
    title: "Discover Your Gates Pattern",
    intro: "This MVP uses reflection questions to identify a recurring signal. It does not calculate official Human Design gates yet.",
    startLabel: "Find my recurring signal",
    results: GATES_RESULTS,
    questions: [
      { q: "What signal repeats most in your life lately?", opts: [
        { label: "A sudden insight I cannot ignore", score: { insight: 2 } },
        { label: "A pull toward a clearer direction", score: { direction: 2 } },
        { label: "Pressure to say or create something", score: { expression: 2 } },
        { label: "Questions of loyalty and devotion", score: { devotion: 2 } },
        { label: "A need to change a pattern", score: { change: 2 } },
      ] },
      { q: "Where do you feel most sensitive?", opts: [
        { label: "Hidden patterns", score: { insight: 2 } },
        { label: "Being on the wrong path", score: { direction: 2 } },
        { label: "Not expressing the truth", score: { expression: 2 } },
        { label: "Giving too much to the wrong thing", score: { devotion: 2 } },
        { label: "Staying too long after something is complete", score: { change: 2 } },
      ] },
      { q: "What would support you now?", opts: [
        { label: "Trusting the quiet clue", score: { insight: 2 } },
        { label: "Choosing the calmer direction", score: { direction: 2 } },
        { label: "Speaking plainly", score: { expression: 2 } },
        { label: "Recommitting or releasing", score: { devotion: 2 } },
        { label: "Letting the old cycle end", score: { change: 2 } },
      ] },
    ],
    sections: {
      pattern: "This gate-like signal may be a recurring sensitivity that asks for attention before action.",
      practice: "Track when this signal appears for three days without immediately fixing it.",
      next: "Next, Cycles explores how your energy changes across time and seasons.",
    },
  },
  "7": {
    nodeId: 7,
    resultKey: "hdCycles",
    eyebrow: "Your Timing Pattern",
    title: "Discover Your Cycles Pattern",
    intro: "Your answers point to how you may move through timing, energy seasons, and change.",
    startLabel: "Find my timing pattern",
    results: CYCLES_RESULTS,
    questions: [
      { q: "How do new chapters usually begin for you?", opts: [
        { label: "Quickly, with a spark", score: { fastInitiator: 2 } },
        { label: "Slowly, after integration", score: { slowIntegrator: 2 } },
        { label: "In clear seasons", score: { seasonalMover: 2 } },
        { label: "Through emotional waves", score: { emotionalWave: 2 } },
        { label: "Through small repeated steps", score: { quietBuilder: 2 } },
      ] },
      { q: "What kind of timing mistake do you make most?", opts: [
        { label: "Moving before I pause", score: { fastInitiator: 2 } },
        { label: "Forcing clarity too soon", score: { slowIntegrator: 2 } },
        { label: "Expecting every season to be productive", score: { seasonalMover: 2 } },
        { label: "Deciding inside an emotional high or low", score: { emotionalWave: 2 } },
        { label: "Undervaluing small progress", score: { quietBuilder: 2 } },
      ] },
      { q: "What does your body want right now?", opts: [
        { label: "A clean start", score: { fastInitiator: 2 } },
        { label: "More time to digest", score: { slowIntegrator: 2 } },
        { label: "Permission to honor the season", score: { seasonalMover: 2 } },
        { label: "Emotional space", score: { emotionalWave: 2 } },
        { label: "One repeatable action", score: { quietBuilder: 2 } },
      ] },
    ],
    sections: {
      pattern: "This timing pattern may show how your energy prefers to begin, pause, and complete cycles.",
      practice: "Choose one decision and ask what timing would make it feel less forced.",
      next: "Next, Living Design brings your saved Human Design results together.",
    },
  },
};

function calcMvpResult(config: HDMvpConfig, answers: number[]) {
  const scores: Record<string, number> = {};
  answers.forEach((answerIdx, questionIdx) => {
    const option = config.questions[questionIdx]?.opts[answerIdx];
    if (!option) return;
    Object.entries(option.score).forEach(([key, value]) => {
      scores[key] = (scores[key] ?? 0) + value;
    });
  });
  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
  return winner && config.results[winner] ? config.results[winner] : Object.values(config.results)[0];
}

function getSavedString(nodeId: number, key: string) {
  const value = getNodeState(DISCIPLINE, nodeId).result?.[key];
  return typeof value === "string" ? value : "";
}

function HDMvpQuizNode({ config }: { config: HDMvpConfig }) {
  const router = useRouter();
  const [qIdx, setQIdx] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<HDMvpResult | null>(null);

  useEffect(() => {
    const saved = getSavedString(config.nodeId, config.resultKey);
    if (saved && config.results[saved]) {
      setResult(config.results[saved]);
      setQIdx(config.questions.length);
      return;
    }
    startNode(DISCIPLINE, config.nodeId);
  }, [config]);

  const answer = (optIdx: number) => {
    const next = [...answers, optIdx];
    setAnswers(next);
    if (next.length >= config.questions.length) {
      setResult(calcMvpResult(config, next));
      setQIdx(config.questions.length);
    } else {
      setQIdx(qIdx + 1);
    }
  };

  const handleComplete = () => {
    if (!result) return;
    completeNode(DISCIPLINE, config.nodeId, { [config.resultKey]: result.key });
    router.push("/sky/humandesign");
  };

  const q = qIdx >= 0 && qIdx < config.questions.length ? config.questions[qIdx] : null;

  return (
    <div>
      {qIdx === -1 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>&#10022;</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>{config.title}</h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{config.intro}</p>
          </div>
          <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {config.startLabel} &#8594;
          </button>
        </div>
      )}

      {q && (
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {config.questions.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= qIdx ? "var(--gold)" : "rgba(255,255,255,.1)" }} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>Question {qIdx + 1} of {config.questions.length}</p>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--text)", marginBottom: 20, lineHeight: 1.35 }}>{q.q}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => answer(i)} style={{ textAlign: "left", padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(216,168,95,.25)", background: "rgba(14,10,32,.55)", color: "var(--text)", fontSize: 14, lineHeight: 1.45, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && qIdx === config.questions.length && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>{config.eyebrow}</p>
            <div style={{ width: 104, height: 104, margin: "0 auto 14px", borderRadius: "50%", background: `radial-gradient(circle at 38% 32%, ${result.color}33, rgba(14,10,32,.95))`, border: `2px solid ${result.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 34px ${result.color}3f` }}>
              <span style={{ fontSize: 42 }}>&#10022;</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 27, color: "var(--text)", marginBottom: 6 }}>{result.title}</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>Your answers point to this Human Design reflection pattern.</p>
          </div>

          <div style={{ border: `1px solid ${result.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{result.desc}</p>
          </div>
          <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "14px 16px", background: "rgba(216,168,95,.06)", marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 750, letterSpacing: ".09em", marginBottom: 5 }}>PATTERN</p>
            <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55 }}>{config.sections.pattern}</p>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.5)", marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 750, letterSpacing: ".09em", marginBottom: 5 }}>NATURAL STRENGTH</p>
            <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55 }}>{result.strength}</p>
          </div>
          <div style={{ border: "1px solid rgba(160,130,220,.22)", borderRadius: 14, padding: "14px 16px", background: "rgba(80,40,130,.12)", marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 750, letterSpacing: ".09em", marginBottom: 5 }}>REFLECTION</p>
            <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55 }}>{result.reflection}</p>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.45)", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--muted-2)", fontWeight: 750, letterSpacing: ".09em", marginBottom: 5 }}>NEXT</p>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{config.sections.next}</p>
          </div>

          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            Complete node &#10003;
          </button>
        </div>
      )}
    </div>
  );
}

const SYNTHESIS_LABELS: Record<string, { nodeId: number; key: string; title: string; lookup?: Record<string, HDMvpResult> }> = {
  hdType: { nodeId: 1, key: "hdType", title: "Energy Type" },
  hdAuthority: { nodeId: 2, key: "hdAuthority", title: "Authority" },
  hdProfile: { nodeId: 3, key: "hdProfile", title: "Profile", lookup: PROFILE_RESULTS },
  hdCenters: { nodeId: 4, key: "hdCenters", title: "Centers", lookup: CENTERS_RESULTS },
  hdChannels: { nodeId: 5, key: "hdChannels", title: "Channels", lookup: CHANNELS_RESULTS },
  hdGates: { nodeId: 6, key: "hdGates", title: "Gates", lookup: GATES_RESULTS },
  hdCycles: { nodeId: 7, key: "hdCycles", title: "Cycles", lookup: CYCLES_RESULTS },
};

function formatSavedResult(item: { nodeId: number; key: string; lookup?: Record<string, HDMvpResult> }) {
  const raw = getSavedString(item.nodeId, item.key);
  if (!raw) return "";
  if (item.lookup?.[raw]) return item.lookup[raw].title;
  if (raw === "ManifestingGenerator") return "Manifesting Generator";
  return raw;
}

function HDNode8() {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [saved, setSaved] = useState<Array<{ title: string; value: string }>>([]);
  const [savedLivingDesign, setSavedLivingDesign] = useState("");

  useEffect(() => {
    const state = getNodeState(DISCIPLINE, 8);
    setCompleted(state.status === "completed");
    if (typeof state.result?.hdLivingDesign === "string") setSavedLivingDesign(state.result.hdLivingDesign);
    if (state.status !== "completed") startNode(DISCIPLINE, 8);

    const values = Object.values(SYNTHESIS_LABELS)
      .map((item) => ({ title: item.title, value: formatSavedResult(item) }))
      .filter((item) => item.value);
    setSaved(values);
  }, []);

  const missingCount = Object.keys(SYNTHESIS_LABELS).length - saved.length;
  const livingDesign = savedLivingDesign || (saved.length >= 5 ? "Integrated Path" : saved.length >= 3 ? "Emerging Design" : "Partial Design");

  const handleComplete = () => {
    completeNode(DISCIPLINE, 8, { hdLivingDesign: livingDesign });
    setCompleted(true);
    router.push("/sky/humandesign");
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>Your Living Design</p>
        <div style={{ width: 110, height: 110, margin: "0 auto 14px", borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, rgba(216,168,95,.28), rgba(80,30,160,.92))", border: "2px solid rgba(216,168,95,.62)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 38px rgba(216,168,95,.32)" }}>
          <span style={{ fontSize: 46 }}>&#10040;</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginBottom: 6 }}>{livingDesign}</h2>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          This synthesis uses the Human Design reflections saved in your path. It is a practical MVP summary, not a calculated bodygraph reading.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {saved.map((item) => (
          <div key={item.title} style={{ display: "flex", justifyContent: "space-between", gap: 14, border: "1px solid rgba(216,168,95,.18)", borderRadius: 14, padding: "12px 14px", background: "rgba(14,10,32,.52)" }}>
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{item.title}</span>
            <span style={{ fontSize: 13, color: "var(--text)", textAlign: "right" }}>{item.value}</span>
          </div>
        ))}
      </div>

      {missingCount > 0 && (
        <div style={{ border: "1px solid rgba(216,168,95,.24)", borderRadius: 14, padding: "14px 16px", background: "rgba(216,168,95,.06)", marginBottom: 14 }}>
          <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 750, letterSpacing: ".09em", marginBottom: 5 }}>PARTIAL SYNTHESIS</p>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
            {missingCount} earlier result{missingCount === 1 ? " is" : "s are"} still missing. You can complete this node now, or return later after finishing more Human Design nodes for a fuller synthesis.
          </p>
        </div>
      )}

      <div style={{ border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.5)", marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 750, letterSpacing: ".09em", marginBottom: 5 }}>HOW IT WORKS TOGETHER</p>
        <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55 }}>
          Your Energy Type points to how your energy engages. Authority points to how you choose. The later nodes describe role, sensitivity, flow, signals, and timing. Together, they become a simple experiment: move in the way your energy can sustain.
        </p>
      </div>
      <div style={{ border: "1px solid rgba(160,130,220,.22)", borderRadius: 14, padding: "14px 16px", background: "rgba(80,40,130,.12)", marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 750, letterSpacing: ".09em", marginBottom: 5 }}>REFLECTION</p>
        <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55 }}>What would change this week if you trusted your energy, timing, and decision rhythm a little more?</p>
      </div>

      <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
        {completed ? "Update synthesis" : "Complete node"} &#10003;
      </button>
    </div>
  );
}

const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Energy Type",      ru: "Tip",       sub: { en: "Foundation",       ru: "Osnova" } },
  "2": { en: "Authority", ru: "Avtoritet", sub: { en: "Decision making", ru: "Prinyatie resheniy" } },
  "3": { en: "Profile", ru: "Profil", sub: { en: "Life role", ru: "Rol" } },
  "4": { en: "Centers", ru: "Tsentry", sub: { en: "Consistency and influence", ru: "Energiya" } },
  "5": { en: "Channels", ru: "Kanaly", sub: { en: "Energy flow", ru: "Potok" } },
  "6": { en: "Gates", ru: "Vrata", sub: { en: "Recurring signals", ru: "Temy" } },
  "7": { en: "Cycles", ru: "Tsikly", sub: { en: "Timing pattern", ru: "Vremya" } },
  "8": { en: "Living Design", ru: "Zhizn po Dizaynu", sub: { en: "Synthesis", ru: "Tselostnost" } },
};

export default function HDNodePage() {
  const params = useParams();
  const nodeId = String(params?.nodeId ?? "1");
  const { lang } = useLang();
  const router = useRouter();

  const nodeNum = parseInt(nodeId);
  const locked = typeof window !== "undefined" ? isNodeLocked(DISCIPLINE, nodeNum) : false;
  const coolingDown = typeof window !== "undefined" ? isNodeCoolingDown(DISCIPLINE, nodeNum) : false;
  const state = typeof window !== "undefined" ? getNodeState(DISCIPLINE, nodeNum) : { status: "locked" };

  const meta = NODE_TITLES[nodeId];
  if (!meta) { router.push("/sky/humandesign"); return null; }
  const title = meta.en;
  const subtitle = meta.sub.en;

  if (locked) return (
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/humandesign">
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/humandesign">
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
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/humandesign">
      <NodePage
        title={title}
        subtitle={subtitle}
        nodeNum={nodeNum}
        totalNodes={TOTAL}
        backHref="/sky/humandesign"
        badge={state.status === "completed" ? "completed" : undefined}
      >
        {nodeId === "1" && <HDNode1 />}
        {nodeId === "2" && <HDNode2 />}
        {HD_MVP_CONFIGS[nodeId] && <HDMvpQuizNode config={HD_MVP_CONFIGS[nodeId]} />}
        {nodeId === "8" && <HDNode8 />}
      </NodePage>
    </SkyNodeEntitlementGate>
  );
}
