import Link from "next/link";
import Image from "next/image";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { HomeGreeting } from "./HomeGreeting";

/* ─── Data ──────────────────────────────────────────────── */
const today = {
  date: "24 мая 2024",
  moon: "Луна в Скорпионе",
  tags: ["Интуиция", "Глубина", "Превращение"],
  text: "Луна в Скорпионе усиливает интуицию. Доверяй внутреннему голосу — сегодня ты увидишь то, что скрыто от других.",
};
const energy = {
  pct: 78, level: "Высокая",
  desc: "Энергия для действий и реализации целей",
  note: "Хороший день для важных решений",
};
const dayCard = {
  title: "Луна в Скорпионе",
  traits: "Глубина · Интуиция · Превращение",
};
const recs = [
  { key: "card",     eyebrow: "Карта дня",     img: "/assets/main_screen/card-01.png",       label: "Получи послание от Вселенной",  btn: "Открыть",      href: "/cards",   color: "#8040c0" },
  { key: "ritual",   eyebrow: "Ритуал дня",    img: "/assets/main_screen/candle-01.png",      label: "Ритуал благодарности\n10 минут", btn: "Начать",      href: "/today",   color: "#c07818" },
  { key: "practice", eyebrow: "Практика",      img: "/assets/main_screen/meditation-01.png", label: "Дыхание и центрирование\n7 минут",btn: "Практиковать", href: "/today",   color: "#1a6b6b" },
];
const streak = { days: 12, title: "12 дней серии", sub: "Держишь ритм. Продолжай!" };

/* ─── Energy ring ───────────────────────────────────────── */
function EnergyRing({ pct }: { pct: number }) {
  const r = 34, circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div style={{ position: "relative", width: 84, height: 84, flexShrink: 0 }}>
      <svg viewBox="0 0 84 84" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8040c0" />
            <stop offset="100%" stopColor="#f0c87b" />
          </linearGradient>
        </defs>
        <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={9} />
        <circle cx="42" cy="42" r={r} fill="none" stroke="url(#ringG)" strokeWidth={9}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--gold-2)", lineHeight: 1, fontWeight: 400 }}>{pct}%</span>
        <span style={{ fontSize: 9, color: "var(--muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: ".08em" }}>{energy.level}</span>
      </div>
    </div>
  );
}

/* ─── Streak ring ───────────────────────────────────────── */
function StreakRing({ days }: { days: number }) {
  const progress = (days % 30) / 30;
  const r = 28, circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  return (
    <div style={{ position: "relative", width: 68, height: 68, flexShrink: 0 }}>
      <svg viewBox="0 0 68 68" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={7} />
        <circle cx="34" cy="34" r={r} fill="none" stroke="var(--gold)" strokeWidth={7}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--gold-2)", fontWeight: 400 }}>{days}</span>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="app">
      <StarField />
      <div className="content">

        {/* ── Header ─────────────────────────────────────── */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: "var(--text)", fontWeight: 400, letterSpacing: ".05em" }}>
            Eluna<sup style={{ color: "var(--gold-2)", fontSize: 16, verticalAlign: "super" }}>✦</sup>
          </span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="icon-btn" aria-label="Уведомления">
              <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
            </button>
            <Link href="/profile" className="icon-btn" aria-label="Профиль">
              <svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </header>

        {/* ── Greeting ───────────────────────────────────── */}
        <HomeGreeting />

        {/* ── Hero card ──────────────────────────────────── */}
        <div style={{
          position: "relative", borderRadius: 22, overflow: "hidden",
          border: "1px solid rgba(216,168,95,.22)", marginTop: 16,
          background: "linear-gradient(135deg, #0f0a2e 0%, #1a0a3a 50%, #0d0820 100%)",
          minHeight: 180,
          boxShadow: "0 20px 50px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)",
        }}>
          {/* Moon image */}
          <div style={{ position: "absolute", right: -10, top: -10, width: 190, height: 190, pointerEvents: "none" }}>
            <Image src="/assets/main_screen/background-main.png" alt="Луна" fill style={{ objectFit: "cover", objectPosition: "left center" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(8,5,25,.95) 45%, transparent 85%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", padding: "20px 20px 20px", maxWidth: "65%" }}>
            <div className="eyebrow"><span>✦</span> СЕГОДНЯ</div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", fontWeight: 400, lineHeight: 1.2, marginBottom: 8 }}>
              {today.date}
            </p>
            <p style={{ fontSize: 13, color: "rgba(220,210,200,.75)", lineHeight: 1.5, marginBottom: 14 }}>
              {today.text}
            </p>
            <Link href="/today" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #7030b0, #4a1880)",
              color: "#fff", borderRadius: 999, padding: "9px 18px",
              fontSize: 13, fontWeight: 600,
              boxShadow: "0 6px 18px rgba(80,20,130,.5)",
            }}>
              Читать прогноз <span>→</span>
            </Link>
          </div>
        </div>

        {/* ── Energy + Card of day ───────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>

          {/* Energy */}
          <div className="card pad" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", fontWeight: 600 }}>Энергия дня</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <EnergyRing pct={energy.pct} />
              <div>
                <p style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.4 }}>{energy.desc}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <span style={{ color: "var(--gold-2)", fontSize: 10 }}>✦</span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>{energy.note}</span>
            </div>
            <Link href="/today" style={{ fontSize: 12, color: "var(--gold)", marginTop: 2 }}>Подробнее</Link>
          </div>

          {/* Card of day */}
          <div className="card pad" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", fontWeight: 600 }}>Твоя карта сегодня</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image src="/assets/main_screen/lotus-01.png" alt="Карта" width={60} height={60} style={{ objectFit: "contain" }} />
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--text)", textAlign: "center" }}>{dayCard.title}</p>
            <p style={{ fontSize: 10, color: "var(--muted)", textAlign: "center", lineHeight: 1.4 }}>{dayCard.traits}</p>
            <Link href="/cards" style={{
              display: "block", textAlign: "center",
              background: "linear-gradient(135deg, #7030b0, #4a1880)",
              color: "#fff", borderRadius: 999, padding: "7px 0",
              fontSize: 12, fontWeight: 600, marginTop: "auto",
            }}>
              Открыть карту
            </Link>
          </div>
        </div>

        {/* ── Recommended ───────────────────────────────── */}
        <div style={{ marginTop: 20 }}>
          <div className="section-head">
            <h2>Рекомендовано на сегодня</h2>
            <Link href="/today">Смотреть все →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {recs.map(rec => (
              <Link key={rec.key} href={rec.href} style={{
                borderRadius: 18, border: "1px solid rgba(216,168,95,.15)",
                background: "rgba(14,12,32,.85)", padding: "12px 8px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                cursor: "pointer", transition: "border-color .2s",
                textDecoration: "none",
              }}>
                <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--gold)", display: "flex", alignItems: "center", gap: 4 }}>
                  <span>✦</span>{rec.eyebrow}
                </p>
                <div style={{ width: 64, height: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image src={rec.img} alt={rec.eyebrow} width={60} height={68} style={{ objectFit: "contain" }} />
                </div>
                <p style={{ fontSize: 11, color: "var(--text)", textAlign: "center", lineHeight: 1.35, whiteSpace: "pre-line" }}>
                  {rec.label}
                </p>
                <span style={{
                  display: "block", textAlign: "center", width: "100%",
                  background: rec.color, borderRadius: 999,
                  color: "#fff", fontSize: 11, fontWeight: 600, padding: "5px 0",
                  marginTop: 2,
                }}>
                  {rec.btn}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Streak ────────────────────────────────────── */}
        <div className="card pad" style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
          <StreakRing days={streak.days} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--gold)", marginBottom: 3 }}>Свой путь</p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--text)", fontWeight: 400 }}>{streak.title}</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{streak.sub}</p>
            {/* Diamond progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              {[0,1,2,3,4].map(i => (
                <span key={i} style={{
                  width: 8, height: 8, transform: "rotate(45deg)",
                  background: i < 3 ? "var(--gold-2)" : "rgba(255,255,255,.1)",
                  boxShadow: i < 3 ? "0 0 5px rgba(216,168,95,.5)" : "none",
                }} />
              ))}
            </div>
          </div>
          <Link href="/today" style={{ fontSize: 12, color: "var(--gold)", whiteSpace: "nowrap" }}>
            Смотреть путь
          </Link>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
