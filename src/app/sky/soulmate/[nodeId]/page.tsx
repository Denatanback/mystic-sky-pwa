"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { useLang } from "@/lib/i18n";
import { getMockUser } from "@/lib/mockAuth";
import { getVenusSign, ZODIAC } from "@/lib/astroCalc";
import { startNode, completeNode, getNodeState, isNodeLocked } from "@/lib/nodeProgress";

const TOTAL = 8;
const DISCIPLINE = "soulmate";

// ── Venus love styles ─────────────────────────────────────────────────────────
const VENUS_LOVE: Record<string, { title: { en: string; ru: string }; style: { en: string; ru: string }; needs: { en: string; ru: string }; gift: { en: string; ru: string } }> = {
  aries:       { title: { en: "Bold Lover", ru: "Страстный влюблённый" }, style: { en: "Direct, passionate and immediate — you love fiercely and without games.", ru: "Прямой, страстный, непосредственный — любишь яростно и без игр." }, needs: { en: "Excitement, spontaneity, a partner who matches your fire.", ru: "Волнение, спонтанность, партнёр под стать твоему огню." }, gift: { en: "You make love feel like a grand adventure.", ru: "Ты делаешь любовь похожей на грандиозное приключение." } },
  taurus:      { title: { en: "Sensual Devotee", ru: "Чувственный преданный" }, style: { en: "Slow, steady and deeply loyal. You love through presence, touch and constancy.", ru: "Медленный, устойчивый, глубоко преданный. Любишь через присутствие, прикосновение, постоянство." }, needs: { en: "Stability, physical affection, security and comfort.", ru: "Стабильность, физическая близость, безопасность и комфорт." }, gift: { en: "Your love is a sanctuary that others long for.", ru: "Твоя любовь — убежище, по которому тоскуют другие." } },
  gemini:      { title: { en: "Playful Connector", ru: "Игривый соединитель" }, style: { en: "Witty, curious and light. Love flows through conversation and shared discovery.", ru: "Остроумный, любопытный, лёгкий. Любовь течёт через разговор и совместное открытие." }, needs: { en: "Mental stimulation, variety and a partner who surprises you.", ru: "Ментальная стимуляция, разнообразие, партнёр, который удивляет." }, gift: { en: "You keep love fresh, curious and ever-evolving.", ru: "Ты держишь любовь свежей, любопытной и постоянно развивающейся." } },
  cancer:      { title: { en: "Nurturing Heart", ru: "Заботливое сердце" }, style: { en: "Deeply caring and protective. You love by creating emotional safety and home.", ru: "Глубоко заботливый и защищающий. Любишь через создание эмоциональной безопасности и дома." }, needs: { en: "Emotional depth, security and a partner who truly sees you.", ru: "Эмоциональная глубина, безопасность, партнёр, который видит тебя по-настоящему." }, gift: { en: "Your love nourishes and heals at the deepest levels.", ru: "Твоя любовь питает и исцеляет на самом глубоком уровне." } },
  leo:         { title: { en: "Radiant Beloved", ru: "Сияющий возлюбленный" }, style: { en: "Grand, generous and warm. You love with drama and full-hearted devotion.", ru: "Грандиозный, щедрый, тёплый. Любишь с драмой и искренней преданностью." }, needs: { en: "Admiration, loyalty and celebrations of love.", ru: "Восхищение, верность и праздники любви." }, gift: { en: "Your love makes people feel like royalty.", ru: "Твоя любовь заставляет людей чувствовать себя королями." } },
  virgo:       { title: { en: "Devoted Caretaker", ru: "Преданный опекун" }, style: { en: "Quiet, practical and profoundly loyal. Love is in the details and the acts of service.", ru: "Тихий, практичный, глубоко верный. Любовь — в деталях и актах служения." }, needs: { en: "Reliability, growth and a partner who appreciates the effort.", ru: "Надёжность, рост, партнёр, ценящий усилия." }, gift: { en: "Your love improves everything it touches.", ru: "Твоя любовь улучшает всё, чего касается." } },
  libra:       { title: { en: "Romantic Idealist", ru: "Романтический идеалист" }, style: { en: "Graceful, charming and deeply committed to harmony. You love beautifully.", ru: "Изящный, обаятельный, глубоко преданный гармонии. Ты любишь красиво." }, needs: { en: "Balance, beauty and a partnership of equals.", ru: "Баланс, красота, партнёрство равных." }, gift: { en: "You bring art and elegance to every relationship.", ru: "Ты приносишь искусство и элегантность в каждые отношения." } },
  scorpio:     { title: { en: "Magnetic Transformer", ru: "Магнетический преобразователь" }, style: { en: "Intense, all-or-nothing and deeply transforming. Love is a sacred merging.", ru: "Интенсивный, всё или ничего, глубоко преобразующий. Любовь — священное слияние." }, needs: { en: "Depth, trust, honesty and total emotional commitment.", ru: "Глубина, доверие, честность и полная эмоциональная преданность." }, gift: { en: "You transform your partner through the alchemy of love.", ru: "Ты преображаешь партнёра через алхимию любви." } },
  sagittarius: { title: { en: "Free-Spirited Lover", ru: "Свободолюбивый влюблённый" }, style: { en: "Adventurous, philosophical and expansive. Love is a journey of shared growth.", ru: "Приключенческий, философский, расширяющий. Любовь — путешествие совместного роста." }, needs: { en: "Freedom, shared adventures and intellectual connection.", ru: "Свобода, общие приключения и интеллектуальная связь." }, gift: { en: "You open your partner's world and inspire them to grow.", ru: "Ты открываешь мир партнёра и вдохновляешь его расти." } },
  capricorn:   { title: { en: "Steadfast Partner", ru: "Верный партнёр" }, style: { en: "Patient, responsible and building love for the long term.", ru: "Терпеливый, ответственный, строит любовь на долгий срок." }, needs: { en: "Commitment, respect and a shared vision for the future.", ru: "Обязательство, уважение и общее видение будущего." }, gift: { en: "Your love is a foundation that lasts a lifetime.", ru: "Твоя любовь — фундамент, который длится всю жизнь." } },
  aquarius:    { title: { en: "Unconventional Bond", ru: "Нетрадиционная связь" }, style: { en: "Unique, intellectual and outside the norm. You love as a meeting of minds and souls.", ru: "Уникальный, интеллектуальный, вне нормы. Любишь как встречу умов и душ." }, needs: { en: "Independence, mental connection and space to be yourself.", ru: "Независимость, ментальная связь, пространство быть собой." }, gift: { en: "Your love is a friendship first — the deepest kind.", ru: "Твоя любовь прежде всего дружба — самого глубокого рода." } },
  pisces:      { title: { en: "Mystical Devotion", ru: "Мистическая преданность" }, style: { en: "Transcendent, empathic and profoundly romantic. Love is a spiritual experience.", ru: "Трансцендентный, эмпатичный, глубоко романтичный. Любовь — духовный опыт." }, needs: { en: "Emotional safety, a soulful connection and someone who sees your depth.", ru: "Эмоциональная безопасность, душевная связь, кто видит твою глубину." }, gift: { en: "Your love dissolves barriers and heals old wounds.", ru: "Твоя любовь растворяет барьеры и исцеляет старые раны." } },
};

// ── Attachment quiz ───────────────────────────────────────────────────────────
type AttachType = "secure" | "anxious" | "avoidant" | "disorganised";
const ATTACH_TYPES: Record<AttachType, { en: string; ru: string; desc: { en: string; ru: string }; growth: { en: string; ru: string }; color: string }> = {
  secure:       { en: "Secure",       ru: "Надёжный",      desc: { en: "You feel comfortable with closeness and independence. Relationships feel safe and trusting.", ru: "Тебе комфортна и близость, и независимость. Отношения ощущаются безопасными." }, growth: { en: "Continue modelling healthy love for others.", ru: "Продолжай моделировать здоровую любовь для других." }, color: "#7ab04a" },
  anxious:      { en: "Anxious",      ru: "Тревожный",     desc: { en: "You crave closeness but fear abandonment. Reassurance is key — and working on self-soothing.", ru: "Ты жаждешь близости, но боишься быть покинутым. Ключ — самоуспокоение." }, growth: { en: "Practice self-soothing and build trust in your own worth.", ru: "Практикуй самоуспокоение и строй доверие к своей ценности." }, color: "#d8a85f" },
  avoidant:     { en: "Avoidant",     ru: "Избегающий",    desc: { en: "You value independence and can withdraw from closeness. Vulnerability feels risky.", ru: "Ты ценишь независимость и можешь избегать близости. Уязвимость ощущается рискованной." }, growth: { en: "Practise letting people in — vulnerability is strength.", ru: "Практикуй впускание людей — уязвимость — это сила." }, color: "#7ab8d8" },
  disorganised: { en: "Disorganised", ru: "Дезорганизованный", desc: { en: "You both crave and fear closeness. This often stems from early experiences — healing is possible.", ru: "Ты и жаждешь, и боишься близости. Часто из ранних опытов — исцеление возможно." }, growth: { en: "Therapy and self-compassion are powerful tools for you.", ru: "Терапия и самосострадание — мощные инструменты для тебя." }, color: "#9070d8" },
};

const ATTACH_Q: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; score: AttachType }[] }[] = [
  {
    q: { en: "In relationships, I most often feel...", ru: "В отношениях я чаще всего чувствую..." },
    opts: [
      { label: { en: "Safe and comfortable — closeness is natural", ru: "Безопасность и комфорт — близость естественна" }, score: "secure" },
      { label: { en: "Anxious — I worry about being left or not enough", ru: "Тревогу — переживаю, что меня оставят или я недостаточен" }, score: "anxious" },
      { label: { en: "The urge to pull back when things get too close", ru: "Желание отступить, когда всё становится слишком близким" }, score: "avoidant" },
      { label: { en: "Confused — I want closeness but get overwhelmed by it", ru: "Замешательство — хочу близости, но ею overwhelmed" }, score: "disorganised" },
    ],
  },
  {
    q: { en: "When a partner needs space, I tend to...", ru: "Когда партнёр просит пространства, я обычно..." },
    opts: [
      { label: { en: "Feel fine — I trust them and give space easily", ru: "Чувствую себя нормально — доверяю и легко даю пространство" }, score: "secure" },
      { label: { en: "Worry they're losing interest or pulling away", ru: "Переживаю, что они теряют интерес или отдаляются" }, score: "anxious" },
      { label: { en: "Feel relieved — I appreciate the distance too", ru: "Чувствую облегчение — я тоже ценю дистанцию" }, score: "avoidant" },
      { label: { en: "Feel both relieved and panicked at the same time", ru: "Чувствую одновременно облегчение и панику" }, score: "disorganised" },
    ],
  },
  {
    q: { en: "Showing vulnerability to a partner feels...", ru: "Проявить уязвимость перед партнёром мне кажется..." },
    opts: [
      { label: { en: "Natural and important — it deepens connection", ru: "Естественным и важным — это углубляет связь" }, score: "secure" },
      { label: { en: "Scary but I do it, hoping they won't leave", ru: "Страшным, но делаю, надеясь, что не уйдут" }, score: "anxious" },
      { label: { en: "Uncomfortable — I prefer to handle things alone", ru: "Некомфортным — предпочитаю справляться самому" }, score: "avoidant" },
      { label: { en: "Both tempting and terrifying", ru: "И соблазнительным, и ужасающим одновременно" }, score: "disorganised" },
    ],
  },
  {
    q: { en: "After a conflict in a relationship, I usually...", ru: "После конфликта в отношениях я обычно..." },
    opts: [
      { label: { en: "Talk it through calmly and resolve it", ru: "Спокойно обсуждаю и разрешаю его" }, score: "secure" },
      { label: { en: "Seek reassurance that everything is okay", ru: "Ищу заверений, что всё в порядке" }, score: "anxious" },
      { label: { en: "Need time alone to decompress first", ru: "Мне нужно время в одиночестве, чтобы прийти в себя" }, score: "avoidant" },
      { label: { en: "Oscillate between wanting to fix it and withdrawing", ru: "Колеблюсь между желанием исправить и желанием отдалиться" }, score: "disorganised" },
    ],
  },
];

function calcAttach(answers: number[]): AttachType {
  const scores: Record<AttachType, number> = { secure: 0, anxious: 0, avoidant: 0, disorganised: 0 };
  answers.forEach((a, qi) => { const opt = ATTACH_Q[qi]?.opts[a]; if (opt) scores[opt.score]++; });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as AttachType;
}

// ── Node 1: Venus Sign ────────────────────────────────────────────────────────
function SMNode1() {
  const { lang } = useLang();
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const user = typeof window !== "undefined" ? getMockUser() : null;
  const venusSign = user?.birthDate ? getVenusSign(user.birthDate) : null;
  const loveData = venusSign ? VENUS_LOVE[venusSign.key] : null;
  const ELEM_COLOR: Record<string, string> = { fire: "#e84040", earth: "#7ab04a", air: "#d8a85f", water: "#4090c0" };

  useEffect(() => { startNode(DISCIPLINE, 1); }, []);

  if (!user?.birthDate) return (
    <div style={{ textAlign: "center", padding: "40px 16px" }}>
      <p style={{ color: "var(--muted)", marginBottom: 16 }}>{lang === "ru" ? "Укажи дату рождения в профиле" : "Add birth date in profile"}</p>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          {lang === "ru" ? "Венера в твоей карте раскрывает твою природу любви — как ты привлекаешь, отдаёшь и принимаешь любовь." : "Venus in your chart reveals your nature in love — how you attract, give and receive love."}
        </p>
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ width: "100%", height: 120, borderRadius: 20, background: "radial-gradient(circle at 40% 35%, rgba(180,80,140,.3), rgba(14,10,32,.95))", border: "1.5px solid rgba(216,168,95,.4)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 42 }}>&#9792;</span>
          <span style={{ fontSize: 14, color: "var(--gold-2)", fontWeight: 600 }}>{lang === "ru" ? "Раскрыть знак Венеры" : "Reveal Venus sign"}</span>
        </button>
      ) : venusSign && loveData ? (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 100, height: 100, margin: "0 auto 12px", borderRadius: "50%", background: `radial-gradient(circle, ${venusSign.color}33, rgba(14,10,32,.95))`, border: `2px solid ${venusSign.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${venusSign.color}44` }}>
              <span style={{ fontSize: 44 }}>{venusSign.symbol}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, marginBottom: 4 }}>{lang === "ru" ? loveData.title.ru : loveData.title.en}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{lang === "ru" ? `Венера в ${venusSign.ru}` : `Venus in ${venusSign.en}`}</p>
          </div>

          {[
            { key: "style", label: { en: "LOVE STYLE", ru: "СТИЛЬ ЛЮБВИ" } },
            { key: "needs", label: { en: "WHAT YOU NEED", ru: "ЧТО ТЕБЕ НУЖНО" } },
            { key: "gift",  label: { en: "YOUR GIFT IN LOVE", ru: "ТВОЙ ДАР В ЛЮБВИ" } },
          ].map(({ key, label }) => (
            <div key={key} style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.5)", marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{lang === "ru" ? label.ru : label.en}</p>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{lang === "ru" ? (loveData as Record<string, { en: string; ru: string }>)[key].ru : (loveData as Record<string, { en: string; ru: string }>)[key].en}</p>
            </div>
          ))}

          <div style={{ marginBottom: 20 }} />
          <button onClick={() => { completeNode(DISCIPLINE, 1, { venusSign: venusSign.key }); router.push("/sky/soulmate"); }} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ru" ? "Завершить узел ✓" : "Complete node ✓"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ── Node 2: Attachment Style ──────────────────────────────────────────────────
function SMNode2() {
  const { lang } = useLang();
  const router = useRouter();
  const [qIdx, setQIdx] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AttachType | null>(null);

  useEffect(() => { startNode(DISCIPLINE, 2); }, []);

  const answer = (i: number) => {
    const next = [...answers, i];
    setAnswers(next);
    if (next.length >= ATTACH_Q.length) { setResult(calcAttach(next)); setQIdx(ATTACH_Q.length); }
    else setQIdx(qIdx + 1);
  };

  const q = qIdx >= 0 && qIdx < ATTACH_Q.length ? ATTACH_Q[qIdx] : null;
  const attachData = result ? ATTACH_TYPES[result] : null;

  return (
    <div>
      {qIdx === -1 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>&#10084;</div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {lang === "ru"
                ? "Стиль привязанности формируется в детстве и влияет на все романтические отношения. Понять его — значит изменить паттерны."
                : "Attachment style forms in childhood and shapes all romantic relationships. Understanding yours is the first step to changing patterns."}
            </p>
          </div>
          <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ru" ? "Пройти тест →" : "Take the quiz →"}
          </button>
        </div>
      )}

      {q && (
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {ATTACH_Q.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= qIdx ? "var(--gold)" : "rgba(255,255,255,.1)" }} />)}
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{qIdx + 1} / {ATTACH_Q.length}</p>
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

      {result && attachData && qIdx === ATTACH_Q.length && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 100, height: 100, margin: "0 auto 12px", borderRadius: "50%", background: `radial-gradient(circle, ${attachData.color}33, rgba(14,10,32,.95))`, border: `2px solid ${attachData.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${attachData.color}44` }}>
              <span style={{ fontSize: 48 }}>&#10084;</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{lang === "ru" ? attachData.ru : attachData.en}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{lang === "ru" ? "Твой стиль привязанности" : "Your attachment style"}</p>
          </div>

          <div style={{ border: `1px solid ${attachData.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 10 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{lang === "ru" ? attachData.desc.ru : attachData.desc.en}</p>
          </div>
          <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 14, padding: "14px 16px", background: "rgba(216,168,95,.05)", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{lang === "ru" ? "ПУТЬ РОСТА" : "GROWTH PATH"}</p>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{lang === "ru" ? attachData.growth.ru : attachData.growth.en}</p>
          </div>

          <button onClick={() => { completeNode(DISCIPLINE, 2, { attachment: result }); router.push("/sky/soulmate"); }} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ru" ? "Завершить узел ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Venus",       ru: "Венера",         sub: { en: "Love nature", ru: "Природа любви" } },
  "2": { en: "Heart Line",  ru: "Линия сердца",   sub: { en: "Connection",  ru: "Связь" } },
};

export default function SoulmateNodePage() {
  const params = useParams();
  const nodeId = String(params?.nodeId ?? "1");
  const { lang } = useLang();
  const router = useRouter();

  const locked = typeof window !== "undefined" ? isNodeLocked(DISCIPLINE, parseInt(nodeId)) : false;
  const state = typeof window !== "undefined" ? getNodeState(DISCIPLINE, parseInt(nodeId)) : { status: "locked" };
  const meta = NODE_TITLES[nodeId];
  if (!meta) { router.push("/sky/soulmate"); return null; }

  if (locked) return (
    <NodePage title={lang === "ru" ? meta.ru : meta.en} subtitle={lang === "ru" ? meta.sub.ru : meta.sub.en} nodeNum={parseInt(nodeId)} totalNodes={TOTAL} backHref="/sky/soulmate">
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
        <p style={{ color: "var(--muted)" }}>{lang === "ru" ? "Завершите предыдущий узел" : "Complete the previous node first"}</p>
      </div>
    </NodePage>
  );

  return (
    <NodePage title={lang === "ru" ? meta.ru : meta.en} subtitle={lang === "ru" ? meta.sub.ru : meta.sub.en} nodeNum={parseInt(nodeId)} totalNodes={TOTAL} backHref="/sky/soulmate" badge={state.status === "completed" ? "completed" : undefined}>
      {nodeId === "1" && <SMNode1 />}
      {nodeId === "2" && <SMNode2 />}
    </NodePage>
  );
}
