"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { SkyNodeEntitlementGate } from "@/components/sky/SkyNodeEntitlementGate";
import { useLang } from "@/lib/i18n";
import { startNode, completeNode, getNodeState, isNodeLocked } from "@/lib/nodeProgress";

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

const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Energy Type",      ru: "Tip",       sub: { en: "Foundation",       ru: "Osnova" } },
  "2": { en: "Authority", ru: "Avtoritet", sub: { en: "Decision making", ru: "Prinyatie resheniy" } },
};

export default function HDNodePage() {
  const params = useParams();
  const nodeId = String(params?.nodeId ?? "1");
  const { lang } = useLang();
  const router = useRouter();

  const locked = typeof window !== "undefined" ? isNodeLocked(DISCIPLINE, parseInt(nodeId)) : false;
  const state = typeof window !== "undefined" ? getNodeState(DISCIPLINE, parseInt(nodeId)) : { status: "locked" };

  const meta = NODE_TITLES[nodeId];
  if (!meta) { router.push("/sky/humandesign"); return null; }
  const nodeNum = parseInt(nodeId);
  const title = meta.en;
  const subtitle = meta.sub.en;

  if (locked) return (
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/humandesign">
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/humandesign">
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
          <p style={{ color: "var(--muted)" }}>Complete the previous node first</p>
        </div>
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
      </NodePage>
    </SkyNodeEntitlementGate>
  );
}
