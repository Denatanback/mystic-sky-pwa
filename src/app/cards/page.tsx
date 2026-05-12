import Link from "next/link";
import Image from "next/image";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";

const SPREADS = [
  { href: "#", icon: "⭐", title: "Один символ",    sub: "Быстрый вопрос на сегодня.",          meta: "2 мин" },
  { href: "#", icon: "♥",  title: "Отношения",      sub: "Что происходит между вами.",           meta: "5 мин" },
  { href: "#", icon: "✦",  title: "Три карты",      sub: "Прошлое · настоящее · будущее.",       meta: "7 мин" },
  { href: "#", icon: "◈",  title: "Кельтский крест", sub: "Глубокий расклад на ситуацию.",        meta: "15 мин" },
];

export default function CardsPage() {
  return (
    <div className="app">
      <StarField />
      <div className="content">

        {/* Header */}
        <header className="header">
          <div className="screen-title">
            <h1>Карты</h1>
            <p>Ассоциативные образы для вопросов, чувств и решений.</p>
          </div>
          <button className="icon-btn" aria-label="Информация">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
          </button>
        </header>

        {/* Card of the day — big reveal */}
        <div style={{
          borderRadius: 24, overflow: "hidden", position: "relative",
          border: "1px solid rgba(216,168,95,.28)",
          background: "linear-gradient(160deg, #0f0826 0%, #1c0a40 55%, #0d0c28 100%)",
          boxShadow: "0 24px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)",
        }}>
          {/* Glow orb */}
          <div style={{
            position: "absolute", right: 20, top: 16, width: 130, height: 130,
            borderRadius: "50%", pointerEvents: "none",
            background: "radial-gradient(circle, rgba(120,60,200,.4), transparent 65%)",
          }} />

          <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "flex-start", gap: 16 }}>
            {/* Card image */}
            <div style={{
              flexShrink: 0, width: 88, height: 118, borderRadius: 14,
              border: "1px solid rgba(216,168,95,.45)",
              background: "linear-gradient(160deg, rgba(120,60,200,.35), rgba(30,12,70,.9))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 28px rgba(0,0,0,.5), 0 0 20px rgba(120,60,200,.25)",
              overflow: "hidden", position: "relative",
            }}>
              <Image src="/assets/main_screen/card-01.png" alt="Карта дня"
                fill style={{ objectFit: "cover" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 40%, rgba(10,5,30,.7))",
              }} />
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}><span>✦</span> Карта дня</div>
              <h2 style={{
                fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400,
                lineHeight: 1.1, marginBottom: 8, color: "var(--text)",
              }}>
                Порог
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                Образ перехода. Что ты уже перерос/ла, но продолжаешь держать рядом из привычки?
              </p>
            </div>
          </div>

          <div style={{ padding: "0 20px 18px" }}>
            <Link href="/journal" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              height: 46, borderRadius: 999,
              background: "linear-gradient(135deg, #7030b0, #4a1880)",
              color: "#fff", fontSize: 14, fontWeight: 600,
              boxShadow: "0 6px 20px rgba(80,20,140,.45)",
              textDecoration: "none",
            }}>
              Записать ответ <span>→</span>
            </Link>
          </div>
        </div>

        {/* Recent cards row */}
        <div style={{ marginTop: 20 }}>
          <div className="section-head">
            <h2>Недавние карты</h2>
            <span>7 дней</span>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }} className="no-scrollbar">
            {[
              { name: "Порог",   img: "/assets/main_screen/card-01.png",  day: "Сег" },
              { name: "Луна",    img: "/assets/main_screen/lotus-01.png", day: "Вчера" },
              { name: "Звезда",  img: "/assets/main_screen/card-01.png",  day: "ПН" },
            ].map(c => (
              <div key={c.name} style={{
                flexShrink: 0, width: 72, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <div style={{
                  width: 62, height: 84, borderRadius: 10,
                  border: "1px solid rgba(216,168,95,.3)",
                  overflow: "hidden", position: "relative",
                  background: "rgba(12,10,32,.8)",
                  boxShadow: "0 4px 16px rgba(0,0,0,.4)",
                }}>
                  <Image src={c.img} alt={c.name} fill style={{ objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>{c.day}</span>
                <span style={{ fontSize: 11, color: "var(--text)", fontWeight: 500 }}>{c.name}</span>
              </div>
            ))}
            {/* Placeholder */}
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                flexShrink: 0, width: 62, height: 84, borderRadius: 10,
                border: "1px dashed rgba(255,255,255,.1)",
                background: "rgba(255,255,255,.02)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "rgba(255,255,255,.15)", fontSize: 18 }}>+</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spreads */}
        <div style={{ marginTop: 20 }}>
          <div className="section-head">
            <h2>Расклады</h2>
            <Link href="#">Все</Link>
          </div>
          <div className="grid-2">
            {SPREADS.map(s => (
              <Link key={s.title} href={s.href} className="tile" style={{ textDecoration: "none" }}>
                <div style={{ fontSize: 26, marginBottom: 8, lineHeight: 1 }}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.sub}</p>
                <div className="meta">{s.meta}</div>
              </Link>
            ))}
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
