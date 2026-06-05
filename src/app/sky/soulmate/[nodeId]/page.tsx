"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { SkyNodeEntitlementGate } from "@/components/sky/SkyNodeEntitlementGate";
import { useLang } from "@/lib/i18n";
import { getMockUser } from "@/lib/mockAuth";
import { getVenusSign, ZODIAC } from "@/lib/astroCalc";
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
const NODE_TITLES: Record<string, { en: string; ru: string; sub: { en: string; ru: string } }> = {
  "1": { en: "Venus",       ru: "Venera",         sub: { en: "Love nature", ru: "Priroda lyubvi" } },
  "2": { en: "Heart Line",  ru: "Liniya serdtsa",   sub: { en: "Connection",  ru: "Svyaz" } },
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
      </NodePage>
    </SkyNodeEntitlementGate>
  );
}
