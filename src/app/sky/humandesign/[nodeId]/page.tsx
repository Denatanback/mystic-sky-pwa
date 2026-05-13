"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NodePage } from "@/components/sky/NodePage";
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
    en: "Generator", ru: "Генератор",
    strategy: { en: "Wait to Respond", ru: "Жди и реагируй" },
    signature: { en: "Satisfaction", ru: "Удовлетворение" },
    notSelf: { en: "Frustration", ru: "Фрустрация" },
    desc: { en: "You are the life force of humanity -- a sustainable source of energy when you respond to what truly lights you up.", ru: "Ты -- жизненная сила человечества. Источник устойчивой энергии, когда реагируешь на то, что по-настоящему зажигает тебя." },
    color: "#d8a85f",
  },
  ManifestingGenerator: {
    en: "Manifesting Generator", ru: "Манифестирующий Генератор",
    strategy: { en: "Wait to Respond, then Inform", ru: "Жди отклика, затем сообщи" },
    signature: { en: "Satisfaction & Peace", ru: "Удовлетворение и мир" },
    notSelf: { en: "Frustration & Anger", ru: "Фрустрация и злость" },
    desc: { en: "You are a multi-passionate powerhouse -- fast, efficient, and built for doing many things at once when guided by your response.", ru: "Ты -- многоцелевой источник силы: быстрый, эффективный, создан делать много вещей одновременно." },
    color: "#e89040",
  },
  Projector: {
    en: "Projector", ru: "Проектор",
    strategy: { en: "Wait for the Invitation", ru: "Жди приглашения" },
    signature: { en: "Success", ru: "Успех" },
    notSelf: { en: "Bitterness", ru: "Горечь" },
    desc: { en: "You are the natural guide of humanity -- here to see deeply and direct others when recognized and invited.", ru: "Ты -- природный проводник человечества. Видишь глубоко и направляешь энергию других, когда тебя признают и приглашают." },
    color: "#7ab0d8",
  },
  Manifestor: {
    en: "Manifestor", ru: "Манифестор",
    strategy: { en: "Inform before acting", ru: "Информируй перед действием" },
    signature: { en: "Peace", ru: "Мир" },
    notSelf: { en: "Anger", ru: "Злость" },
    desc: { en: "You are the initiator -- the rare type who can act without waiting. Your power lies in informing others before you move.", ru: "Ты -- инициатор, редкий тип, способный действовать без ожидания. Твоя сила -- информировать других перед движением." },
    color: "#e05050",
  },
  Reflector: {
    en: "Reflector", ru: "Рефлектор",
    strategy: { en: "Wait a Lunar Cycle", ru: "Жди лунный цикл" },
    signature: { en: "Surprise & Delight", ru: "Удивление и радость" },
    notSelf: { en: "Disappointment", ru: "Разочарование" },
    desc: { en: "You are the mirror of your community -- deeply sensitive to your environment. You reflect the health of those around you.", ru: "Ты -- зеркало своего окружения, чувствительный к среде. Ты отражаешь здоровье тех, кто рядом." },
    color: "#9070d8",
  },
};

const TYPE_QUESTIONS: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; score: Partial<Record<HDType, number>> }[] }[] = [
  {
    q: { en: "How do you make decisions best?", ru: "Как ты принимаешь решения лучше всего?" },
    opts: [
      { label: { en: "When something genuinely excites me / I feel it in my gut", ru: "Когда что-то искренне радует / чувствую нутром" }, score: { Generator: 2, ManifestingGenerator: 1 } },
      { label: { en: "When I am specifically asked for my input", ru: "Когда меня специально приглашают высказаться" }, score: { Projector: 2 } },
      { label: { en: "I just know what to do and act on it", ru: "Я просто знаю что делать и действую" }, score: { Manifestor: 2 } },
      { label: { en: "I need a full lunar cycle (28+ days) to feel sure", ru: "Мне нужен полный лунный цикл (28+ дней)" }, score: { Reflector: 2 } },
    ],
  },
  {
    q: { en: "Which describes your energy levels?", ru: "Что лучше описывает твой уровень энергии?" },
    opts: [
      { label: { en: "Consistent and sustainable -- I can work for long stretches", ru: "Стабильная, устойчивая -- могу работать долго" }, score: { Generator: 2 } },
      { label: { en: "Bursting and variable -- I sprint then need to rest", ru: "Взрывная и переменная -- рывки и затем отдых" }, score: { ManifestingGenerator: 2 } },
      { label: { en: "Non-consistent -- I need to manage it carefully", ru: "Непостоянная -- нужно беречь её" }, score: { Projector: 1, Reflector: 1 } },
      { label: { en: "I create waves of energy that impact others around me", ru: "Я создаю волны энергии, влияющие на окружающих" }, score: { Manifestor: 2 } },
    ],
  },
  {
    q: { en: "In social situations, you tend to...", ru: "В социальных ситуациях ты обычно..." },
    opts: [
      { label: { en: "Wait until someone talks to me, then engage fully", ru: "Жду пока ко мне обратятся, затем включаюсь" }, score: { Generator: 1, Projector: 1 } },
      { label: { en: "Read the room deeply -- absorb everyone's energy", ru: "Глубоко считываю атмосферу -- впитываю чужую энергию" }, score: { Reflector: 2, Projector: 1 } },
      { label: { en: "Naturally take the lead and initiate conversations", ru: "Естественно беру инициативу и начинаю разговор" }, score: { Manifestor: 2, ManifestingGenerator: 1 } },
      { label: { en: "Guide and advise -- people come to me for direction", ru: "Направляю и советую -- люди идут ко мне за руководством" }, score: { Projector: 2 } },
    ],
  },
  {
    q: { en: "When something goes wrong, you most often feel...", ru: "Когда что-то идёт не так, ты чаще всего чувствуешь..." },
    opts: [
      { label: { en: "Frustrated that things aren't flowing", ru: "Фрустрацию, что всё не идёт как надо" }, score: { Generator: 2, ManifestingGenerator: 1 } },
      { label: { en: "Bitter that your wisdom wasn't recognised", ru: "Горечь, что твою мудрость не признали" }, score: { Projector: 2 } },
      { label: { en: "Angry that things are being resisted", ru: "Злость, что что-то тебе сопротивляется" }, score: { Manifestor: 2 } },
      { label: { en: "Disappointed in those around me and the environment", ru: "Разочарование в окружающих и обстановке" }, score: { Reflector: 2 } },
    ],
  },
  {
    q: { en: "Which phrase resonates most?", ru: "Какая фраза резонирует больше всего?" },
    opts: [
      { label: { en: "I love doing things and mastering them", ru: "Я люблю делать вещи и осваивать их" }, score: { Generator: 2 } },
      { label: { en: "I can see things others miss and love guiding", ru: "Я вижу то, что другие не замечают, и люблю направлять" }, score: { Projector: 2 } },
      { label: { en: "I just make things happen -- I don't need permission", ru: "Я просто делаю вещи -- мне не нужно разрешение" }, score: { Manifestor: 2 } },
      { label: { en: "I do many things fast and change direction easily", ru: "Делаю много всего быстро и легко меняю направление" }, score: { ManifestingGenerator: 2 } },
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

function HDNode1() {
  const { lang } = useLang();
  const router = useRouter();
  const [qIdx, setQIdx] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<HDType | null>(null);

  useEffect(() => { startNode(DISCIPLINE, 1); }, []);

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
              {lang === "ru" ? "Узнай свой Тип" : "Discover Your Type"}
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {lang === "ru"
                ? "В Human Design есть 5 Типов. Твой тип -- основа стратегии жизни. Ответь на 5 вопросов."
                : "Human Design has 5 energy Types. Your type is the foundation of your life strategy. Answer 5 questions to discover yours."}
            </p>
          </div>
          <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ru" ? "Начать →" : "Start →"}
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
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{lang === "ru" ? `Вопрос ${qIdx + 1} из ${TYPE_QUESTIONS.length}` : `Question ${qIdx + 1} of ${TYPE_QUESTIONS.length}`}</p>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--text)", marginBottom: 20, lineHeight: 1.35 }}>
            {lang === "ru" ? q.q.ru : q.q.en}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => answer(i)} style={{ textAlign: "left", padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(216,168,95,.25)", background: "rgba(14,10,32,.55)", color: "var(--text)", fontSize: 14, lineHeight: 1.45, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                {lang === "ru" ? opt.label.ru : opt.label.en}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && typeData && qIdx === TYPE_QUESTIONS.length && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 110, height: 110, margin: "0 auto 14px", borderRadius: "50%", background: `radial-gradient(circle at 38% 32%, ${typeData.color}33, rgba(14,10,32,.95))`, border: `2px solid ${typeData.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${typeData.color}44` }}>
              <span style={{ fontSize: 46 }}>&#9651;</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>{lang === "ru" ? typeData.ru : typeData.en}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{lang === "ru" ? "Твой Тип Human Design" : "Your Human Design Type"}</p>
          </div>
          <div style={{ border: `1px solid ${typeData.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{lang === "ru" ? typeData.desc.ru : typeData.desc.en}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: "12px", borderRadius: 12, border: "1px solid rgba(100,200,100,.3)", background: "rgba(20,50,20,.4)", textAlign: "center" }}>
              <p style={{ fontSize: 10, color: "rgba(100,220,100,.8)", letterSpacing: ".08em", fontWeight: 700, marginBottom: 4 }}>{lang === "ru" ? "СТРАТЕГИЯ" : "STRATEGY"}</p>
              <p style={{ fontSize: 12, color: "var(--text)" }}>{lang === "ru" ? typeData.strategy.ru : typeData.strategy.en}</p>
            </div>
            <div style={{ padding: "12px", borderRadius: 12, border: "1px solid rgba(216,168,95,.3)", background: "rgba(40,30,0,.4)", textAlign: "center" }}>
              <p style={{ fontSize: 10, color: "var(--gold-2)", letterSpacing: ".08em", fontWeight: 700, marginBottom: 4 }}>{lang === "ru" ? "СИГНАТУРА" : "SIGNATURE"}</p>
              <p style={{ fontSize: 12, color: "var(--text)" }}>{lang === "ru" ? typeData.signature.ru : typeData.signature.en}</p>
            </div>
          </div>
          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {lang === "ru" ? "Завершить узел ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

type HDAuthority = "Sacral" | "Emotional" | "Splenic" | "Ego" | "Self" | "Mental" | "Lunar";
const AUTHORITIES: Record<HDAuthority, { en: string; ru: string; desc: { en: string; ru: string }; how: { en: string; ru: string }; color: string }> = {
  Sacral:    { en: "Sacral Authority",    ru: "Сакральный авторитет",    desc: { en: "Your gut knows instantly -- yes/no sounds are your oracle.", ru: "Твоё нутро знает мгновенно -- звуки «угу/неа» твой оракул." }, how: { en: "Trust the gut sound, not the mind.", ru: "Доверяй звуку нутра, а не уму." }, color: "#d8a85f" },
  Emotional: { en: "Emotional Authority", ru: "Эмоциональный авторитет", desc: { en: "Your truth emerges over time through emotional waves. Never decide in the moment.", ru: "Твоя истина появляется со временем через эмоциональные волны. Никогда не решай в моменте." }, how: { en: "Sleep on it. Decide only when emotionally clear.", ru: "Переспи с этим. Решай только в эмоциональной ясности." }, color: "#7ab8d8" },
  Splenic:   { en: "Splenic Authority",   ru: "Селезёночный авторитет",  desc: { en: "Spontaneous survival-based intuition -- a quiet whisper in the moment.", ru: "Спонтанная интуиция выживания -- тихий шёпот в моменте." }, how: { en: "Listen to that first quiet instinct. It won't repeat.", ru: "Слушай первый тихий инстинкт. Он не повторится." }, color: "#7ab04a" },
  Ego:       { en: "Ego Authority",       ru: "Эго-авторитет",           desc: { en: "Your heart and willpower guide you -- what you want to commit to, or not.", ru: "Твоё сердце и сила воли ведут тебя -- готов ли ты взять обязательство или нет." }, how: { en: "Ask: does my heart really want this?", ru: "Спроси: моё сердце действительно этого хочет?" }, color: "#e05050" },
  Self:      { en: "Self-Projected",      ru: "Авторитет Самости",       desc: { en: "You need to talk it through to hear your own truth -- a trusted listener is key.", ru: "Тебе нужно проговорить вслух, чтобы услышать свою истину -- нужен доверенный слушатель." }, how: { en: "Talk it out with someone you trust. Listen to yourself speak.", ru: "Проговори с тем, кому доверяешь. Слушай, что сам говоришь." }, color: "#c0a0d8" },
  Mental:    { en: "Mental Authority",    ru: "Ментальный авторитет",    desc: { en: "You need to think out loud over time -- with different trusted people.", ru: "Тебе нужно думать вслух со временем -- с разными доверенными людьми." }, how: { en: "Get multiple trusted perspectives before deciding.", ru: "Получи несколько доверенных точек зрения перед решением." }, color: "#9070d8" },
  Lunar:     { en: "Lunar Authority",     ru: "Лунный авторитет",     desc: { en: "As a Reflector, your clarity comes through a full 28-day lunar cycle.", ru: "Как Рефлектор, твоя ясность приходит через полный 28-дневный лунный цикл." }, how: { en: "Track the full lunar cycle. Your truth reveals itself.", ru: "Отслеживай полный лунный цикл. Истина проявится." }, color: "#9070d8" },
};

const AUTH_QUESTIONS: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; score: Partial<Record<HDAuthority, number>> }[] }[] = [
  {
    q: { en: "When you make a big decision, what feels most reliable?", ru: "Когда принимаешь важное решение, чему больше всего доверяешь?" },
    opts: [
      { label: { en: "An instant gut feeling -- almost physical", ru: "Мгновенное чувство нутра -- почти физическое" }, score: { Sacral: 2, Splenic: 1 } },
      { label: { en: "My emotions -- I need to feel into it over days", ru: "Мои эмоции -- нужно прочувствовать за несколько дней" }, score: { Emotional: 2 } },
      { label: { en: "Talking it through with someone -- hearing myself", ru: "Проговаривая это -- слышу себя" }, score: { Self: 2, Mental: 1 } },
      { label: { en: "My heart / willpower -- what I'm willing to commit to", ru: "Сердце / сила воли -- готовность взять обязательство" }, score: { Ego: 2 } },
    ],
  },
  {
    q: { en: "How quickly do you know if something is right for you?", ru: "Как быстро ты понимаешь, подходит ли тебе что-то?" },
    opts: [
      { label: { en: "Instantly -- there's a clear yes/no in my body", ru: "Мгновенно -- в теле чёткое «да» или «нет»" }, score: { Sacral: 2, Splenic: 1 } },
      { label: { en: "It takes time -- I need to let it settle emotionally", ru: "Нужно время -- пусть эмоционально устоится" }, score: { Emotional: 2 } },
      { label: { en: "When I've talked about it enough with the right person", ru: "Когда достаточно проговорил с нужным человеком" }, score: { Self: 2, Mental: 1 } },
      { label: { en: "Very slowly -- over a 28+ day period", ru: "Очень медленно -- за период 28+ дней" }, score: { Lunar: 2 } },
    ],
  },
  {
    q: { en: "What happens when you decide too quickly?", ru: "Что происходит, когда решаешь слишком быстро?" },
    opts: [
      { label: { en: "I often regret it -- my emotions weren't clear", ru: "Часто сожалею -- эмоции не были ясны" }, score: { Emotional: 2 } },
      { label: { en: "Things go wrong -- I ignored my first instinct", ru: "Всё идёт не так -- проигнорировал первый инстинкт" }, score: { Splenic: 2 } },
      { label: { en: "I realise later when talking I felt different inside", ru: "Позже при разговоре понимаю, что чувствовал иначе" }, score: { Self: 2, Mental: 1 } },
      { label: { en: "I didn't check if my heart was truly in it", ru: "Не проверил, было ли сердце в этом" }, score: { Ego: 2 } },
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

function HDNode2() {
  const { lang } = useLang();
  const router = useRouter();
  const [qIdx, setQIdx] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<HDAuthority | null>(null);

  useEffect(() => { startNode(DISCIPLINE, 2); }, []);

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
              {lang === "ru" ? "Твой Авторитет" : "Your Authority"}
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {lang === "ru"
                ? "Авторитет -- твой внутренний механизм принятия решений. Не ум, не логика -- нечто более древнее и надёжное."
                : "Your Authority is your inner decision-making mechanism. Not the mind, not logic -- something older and more reliable."}
            </p>
          </div>
          <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ru" ? "Узнать авторитет →" : "Find my authority →"}
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
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{lang === "ru" ? `Вопрос ${qIdx + 1} из ${AUTH_QUESTIONS.length}` : `Question ${qIdx + 1} of ${AUTH_QUESTIONS.length}`}</p>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--text)", marginBottom: 20, lineHeight: 1.35 }}>
            {lang === "ru" ? q.q.ru : q.q.en}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => answer(i)} style={{ textAlign: "left", padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(216,168,95,.25)", background: "rgba(14,10,32,.55)", color: "var(--text)", fontSize: 14, lineHeight: 1.45, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                {lang === "ru" ? opt.label.ru : opt.label.en}
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
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{lang === "ru" ? authData.ru : authData.en}</h2>
          </div>
          <div style={{ border: `1px solid ${authData.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{lang === "ru" ? authData.desc.ru : authData.desc.en}</p>
          </div>
          <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 12, padding: "12px 16px", background: "rgba(216,168,95,.06)", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 4 }}>{lang === "ru" ? "КАК ИСПОЛЬЗОВАТЬ" : "HOW TO USE IT"}</p>
            <p style={{ fontSize: 13, color: "var(--text)" }}>{lang === "ru" ? authData.how.ru : authData.how.en}</p>
          </div>
          <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            {lang === "ru" ? "Завершить узел ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Type",      ru: "Тип",       sub: { en: "Foundation",       ru: "Основа" } },
  "2": { en: "Authority", ru: "Авторитет", sub: { en: "Decision making", ru: "Принятие решений" } },
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

  if (locked) return (
    <NodePage title={lang === "ru" ? meta.ru : meta.en} subtitle={lang === "ru" ? meta.sub.ru : meta.sub.en} nodeNum={parseInt(nodeId)} totalNodes={TOTAL} backHref="/sky/humandesign">
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
      backHref="/sky/humandesign"
      badge={state.status === "completed" ? "completed" : undefined}
    >
      {nodeId === "1" && <HDNode1 />}
      {nodeId === "2" && <HDNode2 />}
    </NodePage>
  );
}
