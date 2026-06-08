"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { SkyNodeEntitlementGate } from "@/components/sky/SkyNodeEntitlementGate";
import { useLang } from "@/lib/i18n";
import { startNode, completeNode, getNodeState, isNodeLocked } from "@/lib/nodeProgress";

const TOTAL = 8;
const DISCIPLINE = "soulmate";

// ── Venus love styles ─────────────────────────────────────────────────────────
const VENUS_LOVE: Record<string, { title: { en: string; ru: string }; style: { en: string; ru: string }; needs: { en: string; ru: string }; gift: { en: string; ru: string } }> = {
  aries:       { title: { en: "Bold Lover", ru: "Strastnyy vlyublennyy" }, style: { en: "Direct, passionate and immediate — you love fiercely and without games.", ru: "Pryamoy, strastnyy, neposredstvennyy — lyubish yarostno i bez igr." }, needs: { en: "Excitement, spontaneity, a partner who matches your fire.", ru: "Volnenie, spontannost, partner pod stat tvoemu ognyu." }, gift: { en: "You make love feel like a grand adventure.", ru: "Ty delaesh lyubov pokhozhey na grandioznoe priklyuchenie." } },
  taurus:      { title: { en: "Sensual Devotee", ru: "Chuvstvennyy predannyy" }, style: { en: "Slow, steady and deeply loyal. You love through presence, touch and constancy.", ru: "Medlennyy, ustoychivyy, gluboko predannyy. Lyubish cherez prisutstvie, prikosnovenie, postoyanstvo." }, needs: { en: "Stability, physical affection, security and comfort.", ru: "Stabilnost, fizicheskaya blizost, bezopasnost i komfort." }, gift: { en: "Your love is a sanctuary that others long for.", ru: "Tvoya lyubov — ubezhische, po kotoromu toskuyut drugie." } },
  gemini:      { title: { en: "Playful Connector", ru: "Igrivyy soedinitel" }, style: { en: "Witty, curious and light. Love flows through conversation and shared discovery.", ru: "Ostroumnyy, lyubopytnyy, legkiy. Lyubov techet cherez razgovor i sovmestnoe otkrytie." }, needs: { en: "Mental stimulation, variety and a partner who surprises you.", ru: "Mentalnaya stimulyatsiya, raznoobrazie, partner, kotoryy udivlyaet." }, gift: { en: "You keep love fresh, curious and ever-evolving.", ru: "Ty derzhish lyubov svezhey, lyubopytnoy i postoyanno razvivayuscheysya." } },
  cancer:      { title: { en: "Nurturing Heart", ru: "Zabotlivoe serdtse" }, style: { en: "Deeply caring and protective. You love by creating emotional safety and home.", ru: "Gluboko zabotlivyy i zaschischayuschiy. Lyubish cherez sozdanie emotsionalnoy bezopasnosti i doma." }, needs: { en: "Emotional depth, security and a partner who truly sees you.", ru: "Emotsionalnaya glubina, bezopasnost, partner, kotoryy vidit tebya po-nastoyaschemu." }, gift: { en: "Your love nourishes and heals at the deepest levels.", ru: "Tvoya lyubov pitaet i istselyaet na samom glubokom urovne." } },
  leo:         { title: { en: "Radiant Beloved", ru: "Siyayuschiy vozlyublennyy" }, style: { en: "Grand, generous and warm. You love with drama and full-hearted devotion.", ru: "Grandioznyy, schedryy, teplyy. Lyubish s dramoy i iskrenney predannostyu." }, needs: { en: "Admiration, loyalty and celebrations of love.", ru: "Voskhischenie, vernost i prazdniki lyubvi." }, gift: { en: "Your love makes people feel like royalty.", ru: "Tvoya lyubov zastavlyaet lyudey chuvstvovat sebya korolyami." } },
  virgo:       { title: { en: "Devoted Caretaker", ru: "Predannyy opekun" }, style: { en: "Quiet, practical and profoundly loyal. Love is in the details and the acts of service.", ru: "Tikhiy, praktichnyy, gluboko vernyy. Lyubov — v detalyakh i aktakh sluzheniya." }, needs: { en: "Reliability, growth and a partner who appreciates the effort.", ru: "Nadezhnost, rost, partner, tsenyaschiy usiliya." }, gift: { en: "Your love improves everything it touches.", ru: "Tvoya lyubov uluchshaet vse, chego kasaetsya." } },
  libra:       { title: { en: "Romantic Idealist", ru: "Romanticheskiy idealist" }, style: { en: "Graceful, charming and deeply committed to harmony. You love beautifully.", ru: "Izyaschnyy, obayatelnyy, gluboko predannyy garmonii. Ty lyubish krasivo." }, needs: { en: "Balance, beauty and a partnership of equals.", ru: "Balans, krasota, partnerstvo ravnykh." }, gift: { en: "You bring art and elegance to every relationship.", ru: "Ty prinosish iskusstvo i elegantnost v kazhdye otnosheniya." } },
  scorpio:     { title: { en: "Magnetic Transformer", ru: "Magneticheskiy preobrazovatel" }, style: { en: "Intense, all-or-nothing and deeply transforming. Love is a sacred merging.", ru: "Intensivnyy, vse ili nichego, gluboko preobrazuyuschiy. Lyubov — svyaschennoe sliyanie." }, needs: { en: "Depth, trust, honesty and total emotional commitment.", ru: "Glubina, doverie, chestnost i polnaya emotsionalnaya predannost." }, gift: { en: "You transform your partner through the alchemy of love.", ru: "Ty preobrazhaesh partnera cherez alkhimiyu lyubvi." } },
  sagittarius: { title: { en: "Open-Hearted Lover", ru: "Otkrytyy vlyublennyy" }, style: { en: "Adventurous, philosophical and expansive. Love is a journey of shared growth.", ru: "Priklyuchencheskiy, filosofskiy, rasshiryayuschiy. Lyubov — puteshestvie sovmestnogo rosta." }, needs: { en: "Autonomy, shared adventures and intellectual connection.", ru: "Avtonomiya, obschie priklyucheniya i intellektualnaya svyaz." }, gift: { en: "You open your partner's world and inspire them to grow.", ru: "Ty otkryvaesh mir partnera i vdokhnovlyaesh ego rasti." } },
  capricorn:   { title: { en: "Steadfast Partner", ru: "Vernyy partner" }, style: { en: "Patient, responsible and building love for the long term.", ru: "Terpelivyy, otvetstvennyy, stroit lyubov na dolgiy srok." }, needs: { en: "Commitment, respect and a shared vision for the future.", ru: "Obyazatelstvo, uvazhenie i obschee videnie buduschego." }, gift: { en: "Your love is a foundation that lasts a lifetime.", ru: "Tvoya lyubov — fundament, kotoryy dlitsya vsyu zhizn." } },
  aquarius:    { title: { en: "Unconventional Bond", ru: "Netraditsionnaya svyaz" }, style: { en: "Unique, intellectual and outside the norm. You love as a meeting of minds and souls.", ru: "Unikalnyy, intellektualnyy, vne normy. Lyubish kak vstrechu umov i dush." }, needs: { en: "Independence, mental connection and space to be yourself.", ru: "Nezavisimost, mentalnaya svyaz, prostranstvo byt soboy." }, gift: { en: "Your love is a friendship first — the deepest kind.", ru: "Tvoya lyubov prezhde vsego druzhba — samogo glubokogo roda." } },
  pisces:      { title: { en: "Mystical Devotion", ru: "Misticheskaya predannost" }, style: { en: "Transcendent, empathic and profoundly romantic. Love is a spiritual experience.", ru: "Transtsendentnyy, empatichnyy, gluboko romantichnyy. Lyubov — dukhovnyy opyt." }, needs: { en: "Emotional safety, a soulful connection and someone who sees your depth.", ru: "Emotsionalnaya bezopasnost, dushevnaya svyaz, kto vidit tvoyu glubinu." }, gift: { en: "Your love dissolves barriers and heals old wounds.", ru: "Tvoya lyubov rastvoryaet barery i istselyaet starye rany." } },
};

// ── Attachment quiz ───────────────────────────────────────────────────────────
type AttachType = "secure" | "anxious" | "avoidant" | "disorganised";
const ATTACH_TYPES: Record<AttachType, { en: string; ru: string; desc: { en: string; ru: string }; growth: { en: string; ru: string }; color: string }> = {
  secure:       { en: "Secure",       ru: "Nadezhnyy",      desc: { en: "You feel comfortable with closeness and independence. Relationships feel safe and trusting.", ru: "Tebe komfortna i blizost, i nezavisimost. Otnosheniya oschuschayutsya bezopasnymi." }, growth: { en: "Continue modelling healthy love for others.", ru: "Prodolzhay modelirovat zdorovuyu lyubov dlya drugikh." }, color: "#7ab04a" },
  anxious:      { en: "Anxious",      ru: "Trevozhnyy",     desc: { en: "You crave closeness but fear abandonment. Reassurance is key — and working on self-soothing.", ru: "Ty zhazhdesh blizosti, no boishsya byt pokinutym. Klyuch — samouspokoenie." }, growth: { en: "Practice self-soothing and build trust in your own worth.", ru: "Praktikuy samouspokoenie i stroy doverie k svoey tsennosti." }, color: "#d8a85f" },
  avoidant:     { en: "Avoidant",     ru: "Izbegayuschiy",    desc: { en: "You value independence and can withdraw from closeness. Vulnerability feels risky.", ru: "Ty tsenish nezavisimost i mozhesh izbegat blizosti. Uyazvimost oschuschaetsya riskovannoy." }, growth: { en: "Practise letting people in — vulnerability is strength.", ru: "Praktikuy vpuskanie lyudey — uyazvimost — eto sila." }, color: "#7ab8d8" },
  disorganised: { en: "Disorganised", ru: "Dezorganizovannyy", desc: { en: "You both crave and fear closeness. This can reflect early relationship patterns and invites gentle self-reflection.", ru: "Ty i zhazhdesh, i boishsya blizosti. Eto mozhet otrazhat rannie patterny otnosheniy i priglashat k myagkoy samorefleksii." }, growth: { en: "Self-compassion and qualified professional support can be helpful tools for you.", ru: "Samosostradanie i kvalifitsirovannaya professionalnaya podderzhka mogut byt poleznymi instrumentami dlya tebya." }, color: "#9070d8" },
};

const ATTACH_Q: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; score: AttachType }[] }[] = [
  {
    q: { en: "In relationships, I most often feel...", ru: "V otnosheniyakh ya chasche vsego chuvstvuyu..." },
    opts: [
      { label: { en: "Safe and comfortable — closeness is natural", ru: "Bezopasnost i komfort — blizost estestvenna" }, score: "secure" },
      { label: { en: "Anxious — I worry about being left or not enough", ru: "Trevogu — perezhivayu, chto menya ostavyat ili ya nedostatochen" }, score: "anxious" },
      { label: { en: "The urge to pull back when things get too close", ru: "Zhelanie otstupit, kogda vse stanovitsya slishkom blizkim" }, score: "avoidant" },
      { label: { en: "Confused — I want closeness but get overwhelmed by it", ru: "Zameshatelstvo — khochu blizosti, no eyu overwhelmed" }, score: "disorganised" },
    ],
  },
  {
    q: { en: "When a partner needs space, I tend to...", ru: "Kogda partner prosit prostranstva, ya obychno..." },
    opts: [
      { label: { en: "Feel fine — I trust them and give space easily", ru: "Chuvstvuyu sebya normalno — doveryayu i legko dayu prostranstvo" }, score: "secure" },
      { label: { en: "Worry they're losing interest or pulling away", ru: "Perezhivayu, chto oni teryayut interes ili otdalyayutsya" }, score: "anxious" },
      { label: { en: "Feel relieved — I appreciate the distance too", ru: "Chuvstvuyu oblegchenie — ya tozhe tsenyu distantsiyu" }, score: "avoidant" },
      { label: { en: "Feel both relieved and panicked at the same time", ru: "Chuvstvuyu odnovremenno oblegchenie i paniku" }, score: "disorganised" },
    ],
  },
  {
    q: { en: "Showing vulnerability to a partner feels...", ru: "Proyavit uyazvimost pered partnerom mne kazhetsya..." },
    opts: [
      { label: { en: "Natural and important — it deepens connection", ru: "Estestvennym i vazhnym — eto uglublyaet svyaz" }, score: "secure" },
      { label: { en: "Scary but I do it, hoping they won't leave", ru: "Strashnym, no delayu, nadeyas, chto ne uydut" }, score: "anxious" },
      { label: { en: "Uncomfortable — I prefer to handle things alone", ru: "Nekomfortnym — predpochitayu spravlyatsya samomu" }, score: "avoidant" },
      { label: { en: "Both tempting and terrifying", ru: "I soblaznitelnym, i uzhasayuschim odnovremenno" }, score: "disorganised" },
    ],
  },
  {
    q: { en: "After a conflict in a relationship, I usually...", ru: "Posle konflikta v otnosheniyakh ya obychno..." },
    opts: [
      { label: { en: "Talk it through calmly and resolve it", ru: "Spokoyno obsuzhdayu i razreshayu ego" }, score: "secure" },
      { label: { en: "Seek reassurance that everything is okay", ru: "Ischu zavereniy, chto vse v poryadke" }, score: "anxious" },
      { label: { en: "Need time alone to decompress first", ru: "Mne nuzhno vremya v odinochestve, chtoby priyti v sebya" }, score: "avoidant" },
      { label: { en: "Oscillate between wanting to fix it and withdrawing", ru: "Koleblyus mezhdu zhelaniem ispravit i zhelaniem otdalitsya" }, score: "disorganised" },
    ],
  },
];

function calcAttach(answers: number[]): AttachType {
  const scores: Record<AttachType, number> = { secure: 0, anxious: 0, avoidant: 0, disorganised: 0 };
  answers.forEach((a, qi) => { const opt = ATTACH_Q[qi]?.opts[a]; if (opt) scores[opt.score]++; });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as AttachType;
}

type SoulmateType = "protector" | "adventurer" | "mystic" | "creator" | "intellectual" | "healer";

const SOULMATE_TYPES: Record<SoulmateType, { en: string; draws: string; feel: string; challenge: string; color: string }> = {
  protector: { en: "Protector", draws: "They are drawn to your tenderness, loyalty, and the way you make love feel emotionally real.", feel: "The connection may feel steady, safe, and deeply reassuring, like someone finally choosing to stay.", challenge: "The mirror is learning not to confuse protection with control, or safety with predictability.", color: "#7ab04a" },
  adventurer: { en: "Adventurer", draws: "They are drawn to your curiosity, spark, and the parts of you that still want life to surprise you.", feel: "The connection may feel alive, playful, and expansive, like a door opening into a bigger world.", challenge: "The mirror is learning how to keep freedom and commitment in the same room.", color: "#d8a85f" },
  mystic: { en: "Mystic", draws: "They are drawn to your intuition, emotional depth, and the quiet mystery you do not explain to everyone.", feel: "The connection may feel fated, dreamlike, and strangely familiar before it fully makes sense.", challenge: "The mirror is learning to ground the magic instead of disappearing into fantasy or silence.", color: "#9070d8" },
  creator: { en: "Creator", draws: "They are drawn to your expressiveness, imagination, and the way your feelings become beauty.", feel: "The connection may feel inspiring, romantic, and creatively charged, as if you bring out each other's color.", challenge: "The mirror is learning to be seen clearly, not only admired or idealized.", color: "#e06090" },
  intellectual: { en: "Intellectual", draws: "They are drawn to your mind, your questions, and the way conversation can become intimacy for you.", feel: "The connection may feel mentally electric, honest, and full of discovery.", challenge: "The mirror is learning to let the heart speak before the mind explains everything away.", color: "#7ab8d8" },
  healer: { en: "Healer", draws: "They are drawn to your softness, empathy, and the part of you that understands pain without judging it.", feel: "The connection may feel gentle, restorative, and emotionally cleansing.", challenge: "The mirror is learning to receive care without turning love into a rescue mission.", color: "#c0a0d8" },
};

const SOULMATE_TYPE_Q: { q: { en: string; ru: string }; opts: { label: { en: string; ru: string }; score: Partial<Record<SoulmateType, number>> }[] }[] = [
  { q: { en: "What kind of presence makes you feel most magnetized?", ru: "Kakoe prisutstvie silnee vsego tebya prityagivaet?" }, opts: [
    { label: { en: "Steady, loyal, and emotionally safe", ru: "Ustoychivoe, vernoe i emotsionalno bezopasnoe" }, score: { protector: 2 } },
    { label: { en: "Free, bold, and always moving toward life", ru: "Svobodnoe, smeloe i iduschee navstrechu zhizni" }, score: { adventurer: 2 } },
    { label: { en: "Deep, intuitive, and hard to fully explain", ru: "Glubokoe, intuitivnoe i trudno obyasnimoe" }, score: { mystic: 2 } },
    { label: { en: "Bright, expressive, and full of imagination", ru: "Yarkoe, vyrazitelnoe i polnoe voobrazheniya" }, score: { creator: 2 } },
  ] },
  { q: { en: "What do people often notice in you first?", ru: "Chto lyudi chasto zamechayut v tebe pervym?" }, opts: [
    { label: { en: "My sensitivity and emotional honesty", ru: "Moyu chuvstvitelnost i emotsionalnuyu chestnost" }, score: { healer: 2, protector: 1 } },
    { label: { en: "My curiosity and mental quickness", ru: "Moe lyubopytstvo i bystryy um" }, score: { intellectual: 2 } },
    { label: { en: "My creativity and unusual way of seeing things", ru: "Moyu kreativnost i neobychnyy vzglyad" }, score: { creator: 2 } },
    { label: { en: "My independence and hunger for experience", ru: "Moyu nezavisimost i zhazhdu opyta" }, score: { adventurer: 2 } },
  ] },
  { q: { en: "What kind of connection do you keep returning to?", ru: "K kakoy svyazi ty snova i snova vozvraschaeshsya?" }, opts: [
    { label: { en: "A bond that feels safe enough to soften in", ru: "Svyaz, v kotoroy bezopasno myagchet" }, score: { protector: 2, healer: 1 } },
    { label: { en: "A bond that feels like a shared quest", ru: "Svyaz, pokhozhaya na obschiy poisk" }, score: { adventurer: 2 } },
    { label: { en: "A bond that feels soulful or almost psychic", ru: "Svyaz, kotoraya chuvstvuetsya dushevnoy ili pochti telepaticheskoy" }, score: { mystic: 2 } },
    { label: { en: "A bond built on endless conversation", ru: "Svyaz, postroennaya na beskonechnom razgovore" }, score: { intellectual: 2 } },
  ] },
  { q: { en: "Which mirror would help you grow most in love?", ru: "Kakoe zerkalo silnee pomozhet tebe rasti v lyubvi?" }, opts: [
    { label: { en: "Someone who helps me receive care", ru: "Kto-to, kto pomozhet mne prinimat zabotu" }, score: { healer: 2 } },
    { label: { en: "Someone who helps me feel secure without shrinking", ru: "Kto-to, kto dast bezopasnost bez szhatiya" }, score: { protector: 2 } },
    { label: { en: "Someone who helps me speak from the heart, not only the mind", ru: "Kto-to, kto pomozhet govorit iz serdtsa, a ne tolko iz uma" }, score: { intellectual: 2 } },
    { label: { en: "Someone who helps me make the invisible real", ru: "Kto-to, kto pomozhet sdelat nevidimoe realnym" }, score: { mystic: 1, creator: 2 } },
  ] },
];

function calcSoulmateType(answers: number[]): SoulmateType {
  const scores: Record<SoulmateType, number> = { protector: 0, adventurer: 0, mystic: 0, creator: 0, intellectual: 0, healer: 0 };
  answers.forEach((a, qi) => {
    const opt = SOULMATE_TYPE_Q[qi]?.opts[a];
    if (opt) Object.entries(opt.score).forEach(([k, v]) => { scores[k as SoulmateType] += v ?? 0; });
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as SoulmateType;
}

// ── Node 1: Venus Sign ────────────────────────────────────────────────────────
function SMNode1Legacy() {
  const { lang } = useLang();
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const user = undefined as unknown as { birthDate?: string } | null;
  const venusSign = undefined as unknown as { key: string; en: string; color: string; symbol: string; element: "fire" | "earth" | "air" | "water" } | null;
  const loveData = venusSign ? VENUS_LOVE[venusSign.key] : null;
  const ELEM_COLOR: Record<string, string> = { fire: "#e84040", earth: "#7ab04a", air: "#d8a85f", water: "#4090c0" };

  useEffect(() => { startNode(DISCIPLINE, 1); }, []);

  if (!user?.birthDate) return (
    <div style={{ textAlign: "center", padding: "40px 16px" }}>
      <p style={{ color: "var(--muted)", marginBottom: 16 }}>{false ? "Ukazhi datu rozhdeniya v profile" : "Add birth date in profile"}</p>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          {false ? "Venera v tvoey karte raskryvaet tvoyu prirodu lyubvi — kak ty privlekaesh, otdaesh i prinimaesh lyubov." : "Venus in your chart reveals your nature in love — how you attract, give and receive love."}
        </p>
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ width: "100%", height: 120, borderRadius: 20, background: "radial-gradient(circle at 40% 35%, rgba(180,80,140,.3), rgba(14,10,32,.95))", border: "1.5px solid rgba(216,168,95,.4)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 42 }}>&#9792;</span>
          <span style={{ fontSize: 14, color: "var(--gold-2)", fontWeight: 600 }}>{false ? "Raskryt znak Venery" : "Reveal Venus sign"}</span>
        </button>
      ) : venusSign && loveData ? (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 100, height: 100, margin: "0 auto 12px", borderRadius: "50%", background: `radial-gradient(circle, ${venusSign.color}33, rgba(14,10,32,.95))`, border: `2px solid ${venusSign.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${venusSign.color}44` }}>
              <span style={{ fontSize: 44 }}>{venusSign.symbol}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, marginBottom: 4 }}>{loveData.title.en}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{`Venus in ${venusSign.en}`}</p>
          </div>

          {[
            { key: "style", label: { en: "LOVE STYLE", ru: "STIL LYuBVI" } },
            { key: "needs", label: { en: "WHAT YOU NEED", ru: "ChTO TEBE NUZhNO" } },
            { key: "gift",  label: { en: "YOUR GIFT IN LOVE", ru: "TVOY DAR V LYuBVI" } },
          ].map(({ key, label }) => (
            <div key={key} style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.5)", marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{label.en}</p>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{false ? (loveData as Record<string, { en: string; ru: string }>)[key].ru : (loveData as Record<string, { en: string; ru: string }>)[key].en}</p>
            </div>
          ))}

          <div style={{ marginBottom: 20 }} />
          <button onClick={() => { completeNode(DISCIPLINE, 1, { venusSign: venusSign.key }); router.push("/sky/soulmate"); }} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Zavershit uzel ✓" : "Complete node ✓"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ── Node 2: Attachment Style ──────────────────────────────────────────────────
function SMNode1() {
  const router = useRouter();
  const [qIdx, setQIdx] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<SoulmateType | null>(null);

  useEffect(() => { startNode(DISCIPLINE, 1); }, []);

  const answer = (i: number) => {
    const next = [...answers, i];
    setAnswers(next);
    if (next.length >= SOULMATE_TYPE_Q.length) {
      setResult(calcSoulmateType(next));
      setQIdx(SOULMATE_TYPE_Q.length);
    } else {
      setQIdx(qIdx + 1);
    }
  };

  const q = qIdx >= 0 && qIdx < SOULMATE_TYPE_Q.length ? SOULMATE_TYPE_Q[qIdx] : null;
  const data = result ? SOULMATE_TYPES[result] : null;

  return (
    <div>
      {qIdx === -1 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>&#10084;</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>
              Your Soulmate Type
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              This is not your own archetype. It points to the type of soulmate or person your energy is most likely to attract.
            </p>
          </div>
          <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Proyti test в†’" : "Take the quiz в†’"}
          </button>
        </div>
      )}

      {q && (
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {SOULMATE_TYPE_Q.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= qIdx ? "var(--gold)" : "rgba(255,255,255,.1)" }} />)}
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{qIdx + 1} / {SOULMATE_TYPE_Q.length}</p>
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

      {result && data && qIdx === SOULMATE_TYPE_Q.length && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
              Your Soulmate Type
            </p>
            <div style={{ width: 100, height: 100, margin: "0 auto 12px", borderRadius: "50%", background: `radial-gradient(circle, ${data.color}33, rgba(14,10,32,.95))`, border: `2px solid ${data.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${data.color}44` }}>
              <span style={{ fontSize: 48 }}>&#10084;</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{data.en}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{`You are most likely to attract a ${data.en}`}</p>
          </div>

          {[
            { label: "WHAT DRAWS THEM TO YOU", body: data.draws },
            { label: "WHAT THE CONNECTION MAY FEEL LIKE", body: data.feel },
            { label: "POTENTIAL CHALLENGE / MIRROR", body: data.challenge },
          ].map((item) => (
            <div key={item.label} style={{ border: `1px solid ${data.color}44`, borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.55)", marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{item.label}</p>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{item.body}</p>
            </div>
          ))}

          <div style={{ marginBottom: 20 }} />
          <button onClick={() => { completeNode(DISCIPLINE, 1, { venusSign: result }); router.push("/sky/soulmate"); }} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Zavershit uzel вњ“" : "Complete node вњ“"}
          </button>
        </div>
      )}
    </div>
  );
}

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
              {false
                ? "Stil privyazannosti formiruetsya v detstve i vliyaet na vse romanticheskie otnosheniya. Ponyat ego — znachit izmenit patterny."
                : "Attachment style forms in childhood and shapes all romantic relationships. Understanding yours is the first step to changing patterns."}
            </p>
          </div>
          <button onClick={() => setQIdx(0)} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Proyti test →" : "Take the quiz →"}
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

      {result && attachData && qIdx === ATTACH_Q.length && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 100, height: 100, margin: "0 auto 12px", borderRadius: "50%", background: `radial-gradient(circle, ${attachData.color}33, rgba(14,10,32,.95))`, border: `2px solid ${attachData.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${attachData.color}44` }}>
              <span style={{ fontSize: 48 }}>&#10084;</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{attachData.en}</h2>
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>{false ? "Tvoy stil privyazannosti" : "Your attachment style"}</p>
          </div>

          <div style={{ border: `1px solid ${attachData.color}44`, borderRadius: 16, padding: "16px", background: "rgba(14,10,32,.55)", marginBottom: 10 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{attachData.desc.en}</p>
          </div>
          <div style={{ border: "1px solid rgba(216,168,95,.2)", borderRadius: 14, padding: "14px 16px", background: "rgba(216,168,95,.05)", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>{false ? "PUT ROSTA" : "GROWTH PATH"}</p>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{attachData.growth.en}</p>
          </div>

          <button onClick={() => { completeNode(DISCIPLINE, 2, { attachment: result }); router.push("/sky/soulmate"); }} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {false ? "Zavershit uzel ✓" : "Complete node ✓"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
type SoulmateMvpResult = {
  key: string;
  title: string;
  desc: string;
  signal: string;
  reflection: string;
  color: string;
};

type SoulmateMvpConfig = {
  nodeId: number;
  resultKey: "attractionPattern" | "relationshipMirror" | "compatibilitySignals" | "soulContractTheme" | "loveBlocks";
  eyebrow: string;
  title: string;
  intro: string;
  startLabel: string;
  question: string;
  results: Record<string, SoulmateMvpResult>;
};

const SOULMATE_MVP_CONFIGS: Record<string, SoulmateMvpConfig> = {
  "3": {
    nodeId: 3,
    resultKey: "attractionPattern",
    eyebrow: "Your Attraction Pattern",
    title: "Discover Your Attraction Pattern",
    intro: "This MVP does not predict a person. Your answers point to the emotional pattern that may shape who feels magnetic to you.",
    startLabel: "Find my attraction pattern",
    question: "What tends to make someone feel magnetic to you first?",
    results: {
      safety: { key: "safety", title: "Safety Magnetism", desc: "Your answers point to attraction through steadiness, loyalty, and the feeling that your heart can exhale.", signal: "You may be drawn to people who make love feel consistent and emotionally real.", reflection: "Where can safety stay alive without becoming control?", color: "#7ab04a" },
      mystery: { key: "mystery", title: "Mystery Magnetism", desc: "Your answers point to attraction through depth, intensity, subtle signals, and the feeling of a hidden story.", signal: "You may be drawn to people who awaken curiosity, intuition, and emotional risk.", reflection: "What helps mystery become intimacy instead of confusion?", color: "#9070d8" },
      spark: { key: "spark", title: "Spark Magnetism", desc: "Your answers point to attraction through play, chemistry, movement, and a sense of possibility.", signal: "You may be drawn to people who make life feel wider, brighter, and less predictable.", reflection: "How can excitement include patience and presence?", color: "#d8a85f" },
    },
  },
  "4": {
    nodeId: 4,
    resultKey: "relationshipMirror",
    eyebrow: "Your Relationship Mirror",
    title: "Discover Your Relationship Mirror",
    intro: "This node reflects what relationships may show you about yourself. This pattern can suggest a mirror, not a fixed fate.",
    startLabel: "Find my relationship mirror",
    question: "What do close relationships usually reveal in you?",
    results: {
      worth: { key: "worth", title: "The Worth Mirror", desc: "Your answers point to relationships that mirror how deeply you believe you can be chosen without proving yourself.", signal: "Partners may reflect where self-worth is ready to become steadier.", reflection: "What would love feel like if you did not have to audition for it?", color: "#e06090" },
      voice: { key: "voice", title: "The Voice Mirror", desc: "Your answers point to relationships that mirror how clearly you speak needs, boundaries, and desire.", signal: "Partners may reflect where honesty wants to become kinder and more direct.", reflection: "What truth can be spoken before resentment gathers?", color: "#7ab8d8" },
      trust: { key: "trust", title: "The Trust Mirror", desc: "Your answers point to relationships that mirror your balance between closeness, space, and emotional risk.", signal: "Partners may reflect where trust is ready to become embodied, not only hoped for.", reflection: "What helps your body recognize safe connection?", color: "#7ab04a" },
    },
  },
  "5": {
    nodeId: 5,
    resultKey: "compatibilitySignals",
    eyebrow: "Your Compatibility Signals",
    title: "Discover Your Compatibility Signals",
    intro: "This MVP highlights relationship signals to notice. It does not score or guarantee compatibility.",
    startLabel: "Find my compatibility signals",
    question: "Which signal matters most for love to feel possible?",
    results: {
      rhythm: { key: "rhythm", title: "Rhythm Compatibility", desc: "Your answers point to compatibility through shared pacing, daily rhythm, and nervous-system ease.", signal: "Notice whether the connection feels sustainable after the first wave of chemistry.", reflection: "Does this bond support your actual life, not only your fantasy?", color: "#7ab04a" },
      language: { key: "language", title: "Language Compatibility", desc: "Your answers point to compatibility through communication, humor, curiosity, and repair after misunderstanding.", signal: "Notice whether conversation helps you feel clearer instead of smaller.", reflection: "Can both people stay present when truth is inconvenient?", color: "#7ab8d8" },
      values: { key: "values", title: "Values Compatibility", desc: "Your answers point to compatibility through shared ethics, direction, and what each person protects.", signal: "Notice whether attraction is supported by choices that actually align.", reflection: "What value needs to match for your heart to relax?", color: "#d8a85f" },
    },
  },
  "6": {
    nodeId: 6,
    resultKey: "soulContractTheme",
    eyebrow: "Your Soul Contract Theme",
    title: "Discover Your Soul Contract Theme",
    intro: "This is symbolic language for relationship growth. Your answers point to a theme that may feel like a deeper lesson in love.",
    startLabel: "Find my contract theme",
    question: "What deeper lesson does love seem to keep bringing you?",
    results: {
      freedom: { key: "freedom", title: "Freedom and Commitment", desc: "Your answers point to a soul-contract theme around keeping your spirit free while allowing real devotion.", signal: "This pattern can suggest partners who teach you that closeness does not have to become a cage.", reflection: "Where can commitment protect freedom instead of threatening it?", color: "#d8a85f" },
      healing: { key: "healing", title: "Healing and Receiving", desc: "Your answers point to a soul-contract theme around letting love restore rather than only demand.", signal: "This pattern can suggest partners who reveal where care must become mutual.", reflection: "How can you receive without turning it into debt?", color: "#e06090" },
      truth: { key: "truth", title: "Truth and Visibility", desc: "Your answers point to a soul-contract theme around being seen honestly and choosing love without hiding.", signal: "This pattern can suggest partners who draw your real self to the surface.", reflection: "What part of you is ready to be loved in daylight?", color: "#9070d8" },
    },
  },
  "7": {
    nodeId: 7,
    resultKey: "loveBlocks",
    eyebrow: "Your Love Blocks",
    title: "Discover Your Love Blocks",
    intro: "This MVP names a possible block with care. Your answers point to a protective pattern that may be ready to soften.",
    startLabel: "Find my love block",
    question: "What most often gets between you and the love you want?",
    results: {
      guarding: { key: "guarding", title: "The Guarded Heart", desc: "Your answers point to protection that may keep pain out, but can also keep tenderness at a distance.", signal: "This may reflect a heart that needs safety before it opens.", reflection: "What kind of openness would still respect your boundaries?", color: "#7ab8d8" },
      idealizing: { key: "idealizing", title: "The Idealized Bond", desc: "Your answers point to a pattern of loving potential, fantasy, or intensity before reality has had time to speak.", signal: "This may reflect a heart that sees beauty quickly and needs grounding slowly.", reflection: "What facts need to stand beside the feeling?", color: "#9070d8" },
      overgiving: { key: "overgiving", title: "The Overgiving Loop", desc: "Your answers point to a pattern of earning love through effort, care, or emotional labor.", signal: "This may reflect a generous heart learning reciprocity.", reflection: "Where can you let love meet you halfway?", color: "#e06090" },
    },
  },
};

function getSavedString(nodeId: number, key: string) {
  const value = getNodeState(DISCIPLINE, nodeId).result?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function SoulmateMvpNode({ config }: { config: SoulmateMvpConfig }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<SoulmateMvpResult | null>(null);

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
    router.push("/sky/soulmate");
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
            <p style={{ fontSize: 12, color: "var(--gold-2)" }}>Your answers point to this relationship pattern</p>
          </div>
          {[{ label: "INTERPRETATION", body: result.desc }, { label: "SIGNAL TO NOTICE", body: result.signal }, { label: "REFLECTION", body: result.reflection }].map((item) => (
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

function SMNode8() {
  const router = useRouter();
  const [saved, setSaved] = useState<Array<{ title: string; value: string }>>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const state = getNodeState(DISCIPLINE, 8);
    setCompleted(state.status === "completed");
    if (state.status !== "completed") startNode(DISCIPLINE, 8);
    setSaved([
      { title: "Soulmate Type", value: getSavedString(1, "venusSign") },
      { title: "Heart Line", value: getSavedString(2, "attachment") },
      { title: "Attraction Pattern", value: getSavedString(3, "attractionPattern") },
      { title: "Relationship Mirror", value: getSavedString(4, "relationshipMirror") },
      { title: "Compatibility Signals", value: getSavedString(5, "compatibilitySignals") },
      { title: "Soul Contract Theme", value: getSavedString(6, "soulContractTheme") },
      { title: "Love Blocks", value: getSavedString(7, "loveBlocks") },
    ].filter((item) => item.value));
  }, []);

  const handleComplete = () => {
    completeNode(DISCIPLINE, 8, { soulmatePatternSynthesis: saved.map((item) => item.value).join("|") || "partial" });
    setCompleted(true);
    router.push("/sky/soulmate");
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>*</div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "var(--text)", marginBottom: 10 }}>Your Soulmate Pattern Synthesis</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>This gathers the soulmate-pattern reflections available so far. If some pieces are missing, the synthesis stays partial and can deepen as earlier nodes are completed.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {saved.length ? saved.map((item) => (
          <div key={item.title} style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "13px 15px", background: "rgba(14,10,32,.55)" }}>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".09em", marginBottom: 5 }}>{item.title.toUpperCase()}</p>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.45 }}>{item.value}</p>
          </div>
        )) : (
          <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, padding: "14px 16px", background: "rgba(14,10,32,.55)" }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>Complete earlier soulmate nodes to add more detail to this synthesis.</p>
          </div>
        )}
      </div>
      <div style={{ border: "1px solid rgba(160,130,220,.25)", borderRadius: 14, padding: "14px 16px", background: "rgba(12,8,28,.55)", marginBottom: 18 }}>
        <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", marginBottom: 6 }}>REFLECTION</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>What pattern would help you recognize aligned love without abandoning yourself?</p>
      </div>
      <button onClick={handleComplete} style={{ width: "100%", height: 52, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>{completed ? "Complete again" : "Complete node"}</button>
    </div>
  );
}

const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Soulmate Type",       ru: "Venera",         sub: { en: "Love nature", ru: "Priroda lyubvi" } },
  "2": { en: "Heart Line",  ru: "Liniya serdtsa",   sub: { en: "Connection",  ru: "Svyaz" } },
  "3": { en: "Attraction Pattern", ru: "Pattern prityazheniya", sub: { en: "Magnetism", ru: "Magnetizm" } },
  "4": { en: "Relationship Mirror", ru: "Zerkalo otnosheniy", sub: { en: "Reflection", ru: "Otrazhenie" } },
  "5": { en: "Compatibility Signals", ru: "Signaly sovmestimosti", sub: { en: "Alignment", ru: "Soglasovanie" } },
  "6": { en: "Soul Contract Theme", ru: "Tema dushevnogo kontrakta", sub: { en: "Lesson", ru: "Urok" } },
  "7": { en: "Love Blocks", ru: "Bloki lyubvi", sub: { en: "Softening", ru: "Smyagchenie" } },
  "8": { en: "Soulmate Pattern Synthesis", ru: "Sintez patterna soulmate", sub: { en: "Synthesis", ru: "Sintez" } },
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
  const nodeNum = parseInt(nodeId);
  const title = meta.en;
  const subtitle = meta.sub.en;

  if (locked) return (
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/soulmate">
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/soulmate">
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
          <p style={{ color: "var(--muted)" }}>Complete the previous node first</p>
        </div>
      </NodePage>
    </SkyNodeEntitlementGate>
  );

  return (
    <SkyNodeEntitlementGate discipline={DISCIPLINE} nodeId={nodeNum} title={title} subtitle={subtitle} totalNodes={TOTAL} backHref="/sky/soulmate">
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeNum} totalNodes={TOTAL} backHref="/sky/soulmate" badge={state.status === "completed" ? "completed" : undefined}>
        {nodeId === "1" && <SMNode1 />}
        {nodeId === "2" && <SMNode2 />}
        {SOULMATE_MVP_CONFIGS[nodeId] && <SoulmateMvpNode config={SOULMATE_MVP_CONFIGS[nodeId]} />}
        {nodeId === "8" && <SMNode8 />}
      </NodePage>
    </SkyNodeEntitlementGate>
  );
}
