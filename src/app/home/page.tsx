import Link from "next/link";
import Image from "next/image";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { HomeGreeting } from "./HomeGreeting";

/* Data */
const today = {
  date: "24 мая 2024",
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
  { key: "card",     eyebrow: "Карта дня",            img: "/assets/main_screen/card-01.png",       label: "Получи послание от Вселенной",    btn: "Открыть",      href: "/cards", btnColor: "linear-gradient(135deg,#7030b0,#4a1880)" },
  { key: "ritual",   eyebrow: "Ритуал дня",            img: "/assets/main_screen/candle-01.png",      label: "Ритуал благодарности\n10 минут",  btn: "Начать",       href: "/today", btnColor: "linear-gradient(135deg,#b07820,#7a5010)" },
  { key: "practice", eyebrow: "Практика\nосознанности", img: "/assets/main_screen/meditation-01.png", label: "Дыхание и центрирование\n7 минут", btn: "Практиковать", href: "/today", btnColor: "linear-gradient(135deg,#1a6b6b,#0d4040)" },
];
const streak = { days: 12, title: "12 дней серии", sub: "Держишь ритм. Продолжай!" };

/* Energy ring */
function EnergyRing({ pct }: { pct: number }) {
  const r = 36, circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
      <svg viewBox="0 0 90 90" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8040c0" />
            <stop offset="100%" stopColor="#f0c87b" />
          </linearGradient>
        </defs>
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={9} />
        <circle cx="45" cy="45" r={r} fill="none" stroke="url(#ringG)" strokeWidth={9}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 19, color: "var(--gold-2)", lineHeight: 1, fontWeight: 400 }}>{pct}%</span>
        <span style={{ fontSize: 9, color: "var(--muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: ".08em" }}>Высокая</span>
      </div>
    </div>
  );
}

/* Streak ring */
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

/* Shared transparent card */
const glassCard: React.CSSProperties = {
  border: "1px solid rgba(216,168,95,.22)",
  borderRadius: "var(--radius-lg)",
  background: "transparent",
  backdropFilter: "blur(6px)",
};

/* Page */
export default function HomePage() {
  return (
    <div className="app">
      <StarField />
      <div className="content">

        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: "var(--text)", fontWeight: 400, letterSpacing: ".05em" }}>
            Eluna<sup style={{ color: "var(--gold-2)", fontSize: 16, verticalAlign: "super" }}>✦</sup>
          </span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="icon-btn" aria-label="Режим">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"/>
              </svg>
            </button>
            <button className="icon-btn" aria-label="Уведомления" style={{ position: "relative" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>
              </svg>
              <span style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#c060a0", border: "1.5px solid var(--bg)" }} />
            </button>
            <Link href="/profile" style={{
              width: 38, height: 38, borderRadius: "50%",
              border: "2px solid rgba(216,168,95,.45)",
              overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
              background: "radial-gradient(circle at 40% 35%, rgba(120,60,200,.5), rgba(40,20,80,.8))",
              flexShrink: 0, textDecoration: "none",
            }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--muted)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          </div>
        </header>

        {/* Greeting */}
        <HomeGreeting />

        {/* Hero card */}
        <div style={{
          position: "relative", borderRadius: 22, overflow: "hidden",
          border: "1px solid rgba(216,168,95,.22)", marginTop: 16,
          background: "linear-gradient(135deg, #0f0a2e 0%, #1a0a3a 50%, #0d0820 100%)",
          minHeight: 210,
          boxShadow: "0 20px 50px rgba(0,0,0,.5)",
        }}>
          {/* Moon image fills right half */}
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "58%", pointerEvents: "none" }}>
            <Image src="/assets/main_screen/background-main.png" alt="Луна" fill
              style={{ objectFit: "cover", objectPosition: "left center" }} priority />
          </div>
          {/* Gradient fade */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, #0f0a2e 38%, rgba(10,6,28,.85) 55%, transparent 80%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", padding: "20px 20px 20px", maxWidth: "60%" }}>
            <div className="eyebrow"><span>✦</span> СЕГОДНЯ</div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", fontWeight: 400, lineHeight: 1.2, marginBottom: 8 }}>
              {today.date}
            </p>
            <p style={{ fontSize: 13, color: "rgba(220,210,200,.75)", lineHeight: 1.5, marginBottom: 16 }}>
              {today.text}
            </p>
            <Link href="/today" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #7030b0, #4a1880)",
              color: "#fff", borderRadius: 999, padding: "10px 20px",
              fontSize: 13, fontWeight: 600,
              boxShadow: "0 6px 18px rgba(80,20,130,.5)",
              textDecoration: "none",
            }}>
              Читать прогноз <span>→</span>
            </Link>
          </div>
        </div>

        {/* Energy + Card of day */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>

          {/* Energy card */}
          <div style={{ ...glassCard, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.3, color: "var(--gold)", fontWeight: 600 }}>
              Энергия дня
            </p>
            {/* Ring + text row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <EnergyRing pct={energy.pct} />
              <p style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.45 }}>{energy.desc}</p>
            </div>
            {/* Note */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
              <span style={{ color: "var(--gold-2)", fontSize: 10, marginTop: 1, flexShrink: 0 }}>✦</span>
              <span style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{energy.note}</span>
            </div>
            <Link href="/today" style={{ fontSize: 12, color: "var(--gold)", marginTop: "auto", textDecoration: "none" }}>Подробнее</Link>
          </div>

          {/* Card of day — horizontal: image left, text right */}
          <div style={{ ...glassCard, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.3, color: "var(--gold)", fontWeight: 600 }}>
              Твоя карта сегодня
            </p>
            {/* Image + title row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Lotus in a dark circle */}
              <div style={{
                width: 62, height: 62, borderRadius: "50%", flexShrink: 0,
                background: "radial-gradient(circle at 40% 35%, rgba(90,40,160,.5), rgba(20,10,50,.9))",
                border: "1px solid rgba(216,168,95,.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", position: "relative",
              }}>
                <Image src="/assets/main_screen/lotus-01.png" alt="Карта" fill style={{ objectFit: "contain", padding: 6 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: 15, color: "var(--text)", lineHeight: 1.2, marginBottom: 4 }}>{dayCard.title}</p>
                <p style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.4 }}>{dayCard.traits}</p>
              </div>
            </div>
            {/* Button full width */}
            <Link href="/cards" style={{
              display: "block", textAlign: "center", marginTop: "auto",
              background: "linear-gradient(135deg, #7030b0, #4a1880)",
              color: "#fff", borderRadius: 999, padding: "9px 0",
              fontSize: 12, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 4px 14px rgba(80,20,130,.4)",
            }}>
              Открыть карту
            </Link>
          </div>
        </div>

        {/* Recommended */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1.2, display: "flex", alignItems: "center", gap: 6 }}>
              <span>✦</span> Рекомендовано на сегодня
            </p>
            <Link href="/today" style={{ fontSize: 12, color: "var(--gold)", textDecoration: "none" }}>Смотреть все →</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {recs.map(rec => (
              <Link key={rec.key} href={rec.href} style={{
                ...glassCard,
                padding: "10px 7px 10px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                textDecoration: "none",
              }}>
                {/* Eyebrow */}
                <p style={{
                  fontSize: 8.5, textTransform: "uppercase", letterSpacing: 1,
                  color: "var(--gold)", textAlign: "center", lineHeight: 1.3,
                  whiteSpace: "pre-line", display: "flex", alignItems: "flex-start", gap: 3,
                }}>
                  <span style={{ flexShrink: 0 }}>✦</span>{rec.eyebrow}
                </p>
                {/* Image */}
                <div style={{ width: "100%", aspectRatio: "1/1", position: "relative", flexShrink: 0 }}>
                  <Image src={rec.img} alt={rec.eyebrow} fill style={{ objectFit: "contain" }} />
                </div>
                {/* Label */}
                <p style={{ fontSize: 11, color: "var(--text)", textAlign: "center", lineHeight: 1.35, whiteSpace: "pre-line", flex: 1 }}>
                  {rec.label}
                </p>
                {/* Button */}
                <span style={{
                  display: "block", textAlign: "center", width: "100%",
                  background: rec.btnColor, borderRadius: 999,
                  color: "#fff", fontSize: 11, fontWeight: 600, padding: "7px 0",
                }}>
                  {rec.btn}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Streak */}
        <div style={{ ...glassCard, display: "flex", alignItems: "center", gap: 14, marginTop: 14, padding: 16 }}>
          <StreakRing days={streak.days} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--gold)", marginBottom: 3 }}>Твой путь</p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--text)", fontWeight: 400 }}>{streak.title}</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{streak.sub}</p>
            {/* Diamond line */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 10, position: "relative" }}>
              <div style={{
                position: "absolute", left: 0, right: 0, top: "50%", height: 1,
                background: "linear-gradient(90deg, var(--gold) 62%, rgba(216,168,95,.15) 100%)",
                transform: "translateY(-50%)",
              }} />
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
                  {i < 4 ? (
                    <span style={{
                      display: "block", width: 8, height: 8,
                      transform: "rotate(45deg)",
                      background: i < 3 ? "var(--gold-2)" : "rgba(255,255,255,.1)",
                      boxShadow: i < 3 ? "0 0 5px rgba(216,168,95,.5)" : "none",
                    }} />
                  ) : (
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%",
                      background: "var(--gold-2)",
                      boxShadow: "0 0 8px rgba(216,168,95,.6)",
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Link href="/today" style={{
            fontSize: 12, color: "var(--text)", whiteSpace: "nowrap",
            border: "1px solid rgba(255,255,255,.15)",
            borderRadius: 999, padding: "8px 14px",
            textDecoration: "none",
          }}>
            Смотреть путь
          </Link>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
