"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NodePage } from "@/components/sky/NodePage";
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
    en: "Infant Soul", ru: "Младенческая душа",
    desc: { en: "A soul in its earliest incarnations, experiencing physicality for the first time. Everything is raw and instinctual.", ru: "Душа в первых воплощениях, впервые переживающая физическое существование. Всё сырое и инстинктивное." },
    traits: { en: ["Instinctual", "Tribal", "Survival-focused"], ru: ["Инстинктивная", "Племенная", "Ориентированная на выживание"] },
    color: "#8090a0", emoji: "&#127758;",
  },
  baby: {
    en: "Baby Soul", ru: "Детская душа",
    desc: { en: "Building structure, rules and community. Comfort comes from belonging to traditions and clear hierarchies.", ru: "Строит структуру, правила и сообщество. Комфорт — в принадлежности к традициям и чётким иерархиям." },
    traits: { en: ["Traditional", "Rule-following", "Community-oriented"], ru: ["Традиционная", "Следующая правилам", "Ориентированная на сообщество"] },
    color: "#7090c0", emoji: "&#127751;",
  },
  young: {
    en: "Young Soul", ru: "Молодая душа",
    desc: { en: "Driven by achievement, ambition and making a mark on the world. External success is the primary teacher.", ru: "Движима достижениями, амбициями и желанием оставить след. Внешний успех — главный учитель." },
    traits: { en: ["Achievement-driven", "Competitive", "Independent"], ru: ["Ориентированная на достижения", "Конкурентная", "Независимая"] },
    color: "#d8a85f", emoji: "&#9733;",
  },
  mature: {
    en: "Mature Soul", ru: "Зрелая душа",
    desc: { en: "Seeking depth, authentic relationships and emotional truth. The inner world becomes as important as outer success.", ru: "Ищет глубины, подлинных отношений и эмоциональной правды. Внутренний мир становится так же важен, как внешний успех." },
    traits: { en: ["Empathetic", "Relationship-focused", "Self-reflective"], ru: ["Эмпатичная", "Ориентированная на отношения", "Саморефлексирующая"] },
    color: "#9070d8", emoji: "&#9670;",
  },
  old: {
    en: "Old Soul", ru: "Старая душа",
    desc: { en: "Carrying wisdom from many lifetimes. Values simplicity, spiritual growth and service over worldly achievement.", ru: "Несёт мудрость многих жизней. Ценит простоту, духовный рост и служение превыше мирских достижений." },
    traits: { en: ["Wise", "Non-attached", "Service-oriented"], ru: ["Мудрая", "Непривязанная", "Ориентированная на служение"] },
    color: "#c0a0d8", emoji: "&#10025;",
  },
};

const SOUL_AGE_Q: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; scores: Partial<Record<SoulAge, number>> }[] }[] = [
  {
    q: { en: "When you look at the world, what do you feel most?", ru: "Глядя на мир, что ты чаще всего чувствуешь?" },
    opts: [
      { label: { en: "Safety — I stick close to my group and traditions", ru: "Безопасность — держусь рядом со своей группой и традициями" }, scores: { baby: 2 } },
      { label: { en: "Opportunity — I want to achieve and succeed", ru: "Возможности — хочу достигать и добиваться успеха" }, scores: { young: 2 } },
      { label: { en: "Complexity — relationships and feelings are everything", ru: "Сложность — отношения и чувства — это всё" }, scores: { mature: 2 } },
      { label: { en: "Impermanence — I'm drawn to simplicity and essence", ru: "Непостоянство — меня влечёт простота и суть" }, scores: { old: 2 } },
    ],
  },
  {
    q: { en: "What gives your life most meaning?", ru: "Что придаёт твоей жизни наибольший смысл?" },
    opts: [
      { label: { en: "Belonging to something bigger — family, faith, community", ru: "Принадлежность к чему-то большему — семья, вера, сообщество" }, scores: { baby: 2, infant: 1 } },
      { label: { en: "Building something — career, legacy, recognition", ru: "Создание чего-то — карьера, наследие, признание" }, scores: { young: 2 } },
      { label: { en: "Deep authentic connections and emotional growth", ru: "Глубокие подлинные связи и эмоциональный рост" }, scores: { mature: 2 } },
      { label: { en: "Inner peace, wisdom and being of service", ru: "Внутренний покой, мудрость и служение" }, scores: { old: 2 } },
    ],
  },
  {
    q: { en: "How do you typically relate to authority / rules?", ru: "Как ты обычно относишься к авторитетам / правилам?" },
    opts: [
      { label: { en: "I respect and follow them — they create order", ru: "Уважаю и следую им — они создают порядок" }, scores: { baby: 2 } },
      { label: { en: "I work within them when useful but push against limits", ru: "Работаю в их рамках, когда полезно, но давлю на ограничения" }, scores: { young: 2 } },
      { label: { en: "I question them — especially when they hurt people", ru: "Подвергаю сомнению — особенно когда они вредят людям" }, scores: { mature: 2 } },
      { label: { en: "I've mostly transcended needing them", ru: "Я в основном вышел за пределы потребности в них" }, scores: { old: 2 } },
    ],
  },
  {
    q: { en: "What does success look like to you?", ru: "Как выглядит успех для тебя?" },
    opts: [
      { label: { en: "Being respected and part of a stable community", ru: "Быть уважаемым и частью стабильного сообщества" }, scores: { baby: 2 } },
      { label: { en: "Achieving big goals and leaving a visible mark", ru: "Достигать больших целей и оставить видимый след" }, scores: { young: 2 } },
      { label: { en: "Having genuine, loving relationships and emotional truth", ru: "Иметь искренние, любящие отношения и эмоциональную правду" }, scores: { mature: 2 } },
      { label: { en: "Feeling at peace and being helpful to others' growth", ru: "Чувствовать мир и помогать росту других" }, scores: { old: 2 } },
    ],
  },
  {
    q: { en: "What do you find most exhausting?", ru: "Что тебя больше всего утомляет?" },
    opts: [
      { label: { en: "Chaos, instability or people breaking the rules", ru: "Хаос, нестабильность или нарушение правил" }, scores: { baby: 2, infant: 1 } },
      { label: { en: "Not achieving — being stuck or not progressing", ru: "Не достигать — застревать или не двигаться вперёд" }, scores: { young: 2 } },
      { label: { en: "Shallow relationships and emotional dishonesty", ru: "Поверхностные отношения и эмоциональная нечестность" }, scores: { mature: 2 } },
      { label: { en: "Drama, ego battles and unnecessary complexity", ru: "Драма, эго-битвы и ненужная сложность" }, scores: { old: 2 } },
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
  worth:    { en: "Self-Worth",    ru: "Самоценность",   lesson: { en: "Learning to value yourself without external validation.", ru: "Учиться ценить себя без внешнего подтверждения." }, gift: { en: "You have deep empathy for others' struggles with self-acceptance.", ru: "У тебя глубокая эмпатия к чужой борьбе с самопринятием." }, color: "#d8a85f" },
  trust:    { en: "Trust",        ru: "Доверие",        lesson: { en: "Opening to trust — in others, in life, in the universe.", ru: "Открыться доверию — к другим, к жизни, к Вселенной." }, gift: { en: "Hard-won discernment — you know authentic safety when you find it.", ru: "Выстраданная проницательность — ты узнаёшь подлинную безопасность." }, color: "#7ab8d8" },
  voice:    { en: "Self-Expression", ru: "Самовыражение", lesson: { en: "Claiming the right to speak your truth fully.", ru: "Заявить право говорить свою правду полностью." }, gift: { en: "You understand the power of words and choose them carefully.", ru: "Ты понимаешь силу слов и тщательно их выбираешь." }, color: "#9070d8" },
  freedom:  { en: "Freedom",       ru: "Свобода",        lesson: { en: "Releasing control and learning to flow with life.", ru: "Отпустить контроль и научиться течь с жизнью." }, gift: { en: "When you trust the flow, you move with remarkable grace.", ru: "Когда доверяешь потоку, ты движешься с замечательной грацией." }, color: "#7ab04a" },
  love:     { en: "Love",          ru: "Любовь",         lesson: { en: "Learning to love without losing yourself in the other.", ru: "Учиться любить, не растворяясь в другом." }, gift: { en: "Your capacity for love, once balanced, is extraordinary.", ru: "Твоя способность любить, будучи сбалансированной, необычайна." }, color: "#e06090" },
  power:    { en: "Power",         ru: "Сила",           lesson: { en: "Owning your power without dominating — or diminishing yourself.", ru: "Принять свою силу без доминирования и без самоуничижения." }, gift: { en: "You can lead with both strength and humility.", ru: "Ты можешь вести с силой и смирением одновременно." }, color: "#e05050" },
  surrender: { en: "Surrender",   ru: "Принятие",       lesson: { en: "Releasing the need to control outcomes and trusting the divine.", ru: "Отпустить потребность контролировать исходы и довериться высшему." }, gift: { en: "You develop extraordinary peace and acceptance.", ru: "Ты развиваешь необычайный покой и принятие." }, color: "#c0a0d8" },
};

const KARMA_Q: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; score: KarmaTheme }[] }[] = [
  {
    q: { en: "Which pattern shows up most in your relationships?", ru: "Какой паттерн чаще всего проявляется в твоих отношениях?" },
    opts: [
      { label: { en: "I give too much and lose myself", ru: "Отдаю слишком много и теряю себя" }, score: "love" },
      { label: { en: "I hold back, afraid to be hurt", ru: "Сдерживаюсь, боясь быть задетым" }, score: "trust" },
      { label: { en: "I struggle to set limits and say no", ru: "Мне сложно устанавливать границы и говорить «нет»" }, score: "worth" },
      { label: { en: "I need to be in control of what happens", ru: "Мне нужно контролировать то, что происходит" }, score: "surrender" },
    ],
  },
  {
    q: { en: "What do you find hardest to do?", ru: "Что тебе сложнее всего делать?" },
    opts: [
      { label: { en: "Speak up for myself when it matters", ru: "Говорить за себя, когда это важно" }, score: "voice" },
      { label: { en: "Let things go and stop worrying", ru: "Отпускать вещи и перестать беспокоиться" }, score: "freedom" },
      { label: { en: "Ask for help without feeling weak", ru: "Просить о помощи, не чувствуя слабости" }, score: "worth" },
      { label: { en: "Trust that things will work out", ru: "Доверять, что всё наладится" }, score: "trust" },
    ],
  },
  {
    q: { en: "Which of these fears feels most familiar?", ru: "Какой из этих страхов кажется наиболее знакомым?" },
    opts: [
      { label: { en: "Fear of abandonment / not being lovable", ru: "Страх быть покинутым / нелюбимым" }, score: "love" },
      { label: { en: "Fear of losing control or being trapped", ru: "Страх потерять контроль или быть в ловушке" }, score: "freedom" },
      { label: { en: "Fear of being too much or too little", ru: "Страх быть слишком много или слишком мало" }, score: "worth" },
      { label: { en: "Fear of being silenced or not heard", ru: "Страх быть заглушённым или неуслышанным" }, score: "voice" },
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
  renderResult: (r: T) => JSX.Element;
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
        {lang === "ru" ? `${questions.length} вопросов · ~2 минуты` : `${questions.length} questions · ~2 minutes`}
      </p>
      <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
        {lang === "ru" ? "Начать →" : "Begin →"}
      </button>
    </div>
  );

  if (q) return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {questions.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= qIdx ? "var(--gold)" : "rgba(255,255,255,.1)" }} />)}
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{lang === "ru" ? `${qIdx + 1} / ${questions.length}` : `${qIdx + 1} / ${questions.length}`}</p>
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
          {lang === "ru"
            ? "Возраст души — уровень эволюционного развития, накопленного через многие воплощения."
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
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>{lang === "ru" ? data.ru : data.en}</h2>
              </div>
              <div style={{ border: `1px solid ${data.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{lang === "ru" ? data.desc.ru : data.desc.en}</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {(lang === "ru" ? data.traits.ru : data.traits.en).map((t, i) => (
                  <span key={i} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 999, background: `${data.color}18`, border: `1px solid ${data.color}44`, color: "var(--text)" }}>{t}</span>
                ))}
              </div>
              <button onClick={() => { completeNode(DISCIPLINE, 1, { soulAge: r }); router.push("/sky/pastlife"); }} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
                {lang === "ru" ? "Завершить узел ✓" : "Complete node ✓"}
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
          {lang === "ru"
            ? "Кармические уроки — повторяющиеся темы, которые твоя душа пришла исцелить и трансформировать в этой жизни."
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
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{lang === "ru" ? data.ru : data.en}</h2>
                <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{lang === "ru" ? "Твой кармический урок" : "Your karmic lesson"}</p>
              </div>
              <div style={{ border: `1px solid ${data.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 10 }}>
                <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{lang === "ru" ? "УРОК" : "LESSON"}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{lang === "ru" ? data.lesson.ru : data.lesson.en}</p>
              </div>
              <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 14, padding: "14px 16px", background: "rgba(216,168,95,.05)", marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{lang === "ru" ? "СКРЫТЫЙ ДАР" : "HIDDEN GIFT"}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{lang === "ru" ? data.gift.ru : data.gift.en}</p>
              </div>
              <button onClick={() => { completeNode(DISCIPLINE, 2, { karma: r }); router.push("/sky/pastlife"); }} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                {lang === "ru" ? "Завершить узел ✓" : "Complete node ✓"}
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
  "1": { en: "Soul Age",  ru: "Возраст души", sub: { en: "Beginning",  ru: "Начало" } },
  "2": { en: "Karma",     ru: "Карма",        sub: { en: "Patterns",   ru: "Паттерны" } },
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

  if (locked) return (
    <NodePage title={lang === "ru" ? meta.ru : meta.en} subtitle={lang === "ru" ? meta.sub.ru : meta.sub.en} nodeNum={parseInt(nodeId)} totalNodes={TOTAL} backHref="/sky/pastlife">
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
        <p style={{ color: "var(--muted)" }}>{lang === "ru" ? "Завершите предыдущий узел" : "Complete the previous node first"}</p>
      </div>
    </NodePage>
  );

  return (
    <NodePage title={lang === "ru" ? meta.ru : meta.en} subtitle={lang === "ru" ? meta.sub.ru : meta.sub.en} nodeNum={parseInt(nodeId)} totalNodes={TOTAL} backHref="/sky/pastlife" badge={state.status === "completed" ? "completed" : undefined}>
      {nodeId === "1" && <PLNode1 />}
      {nodeId === "2" && <PLNode2 />}
    </NodePage>
  );
}
