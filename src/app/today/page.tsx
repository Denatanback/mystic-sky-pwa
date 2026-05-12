import Link from "next/link";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";

const PATH_STEPS = [
  { num: 1, key: "sun",     label: "Солнце",   done: true  },
  { num: 2, key: "moon",    label: "Луна",      done: false, current: true },
  { num: 3, key: "planets", label: "Планеты",   done: false },
  { num: 4, key: "aspects", label: "Аспекты",   done: false },
];

const RECS = [
  { href: "/cards",  img: "🃏", title: "Карта дня",  sub: "Послание от Вселенной и настройка на день.",  btn: "Открыть" },
  { href: "/today",  img: "🕯", title: "Практика",   sub: "Медитация на интуицию — 7 минут тишины.",     btn: "Начать" },
];

export default function TodayPage() {
  return (
    <div className="app">
      <StarField />
      <div className="content">

        {/* Header */}
        <header className="header">
          <div className="screen-title">
            <h1>Путь</h1>
            <p style={{ color: "var(--gold)", fontSize: 13 }}>Обзор направления: Астрология</p>
          </div>
          <button className="icon-btn" aria-label="Режим">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a7 7 0 1 0 11.5 11.5Z"/>
            </svg>
          </button>
        </header>

        {/* Current path hero */}
        <div style={{
          borderRadius: 22, overflow: "hidden",
          border: "1px solid rgba(216,168,95,.2)",
          background: "linear-gradient(135deg, #0f0826 0%, #1a0a3a 60%, #0d0820 100%)",
          padding: "20px 18px", position: "relative",
          boxShadow: "0 20px 50px rgba(0,0,0,.45)",
        }}>
          {/* Moon glow */}
          <div style={{
            position: "absolute", right: 16, top: 12, width: 80, height: 80, borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, rgba(120,60,200,.5), rgba(60,20,100,.3))",
            boxShadow: "0 0 30px rgba(120,60,200,.4)",
          }} />

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {["Интуиция", "Циклы", "Самопознание"].map(t => (
              <span key={t} className="pill purple" style={{ fontSize: 11 }}>{t}</span>
            ))}
          </div>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, marginBottom: 6, maxWidth: "70%" }}>
            Астрология
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, maxWidth: "72%", marginBottom: 14 }}>
            Пойми свой звёздный код и самою. Полюби свои циклы и примени осознанные решения.
          </p>

          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Прогресс пути</span>
            <div className="progress-bar" style={{ flex: 1 }}>
              <span style={{ width: "20%" }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--gold-2)", fontWeight: 600 }}>20%</span>
          </div>
        </div>

        {/* Path steps */}
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.6, color: "var(--gold)", marginBottom: 12 }}>Путь астрологии</p>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {PATH_STEPS.map((s, i) => (
              <div key={s.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Connector line */}
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  {i > 0 && <div style={{ flex: 1, height: 1, background: s.done ? "var(--gold-2)" : "rgba(255,255,255,.1)" }} />}
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    border: `2px solid ${s.current ? "var(--gold-2)" : s.done ? "var(--gold)" : "rgba(255,255,255,.15)"}`,
                    background: s.done ? "rgba(216,168,95,.15)" : s.current ? "rgba(216,168,95,.08)" : "rgba(255,255,255,.03)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: s.done || s.current ? "var(--gold-2)" : "var(--muted-2)",
                    fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 400,
                    boxShadow: s.current ? "0 0 0 6px rgba(216,168,95,.1), 0 0 12px rgba(216,168,95,.25)" : "none",
                    flexShrink: 0,
                    position: "relative", zIndex: 1,
                  }}>
                    {s.num}
                  </div>
                  {i < PATH_STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: s.done ? "var(--gold)" : "rgba(255,255,255,.1)" }} />}
                </div>
                <span style={{ fontSize: 10, color: s.current ? "var(--gold-2)" : "var(--muted)", marginTop: 6, fontWeight: s.current ? 600 : 400 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current + Next node */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
          {/* Current */}
          <div className="card pad" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--gold)" }}>Текущий узел</p>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "radial-gradient(circle at 40% 40%, rgba(120,60,200,.45), rgba(60,20,100,.6))",
              border: "1px solid rgba(216,168,95,.45)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(120,60,200,.35)",
            }}>
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--gold-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a7 7 0 1 0 11.5 11.5Z"/>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--text)" }}>Луна</p>
            <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>Глубина, интуиция и понимание себя</p>
            <Link href="/today/star-way" style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 13, color: "var(--gold-2)", fontWeight: 600, marginTop: "auto",
            }}>
              Продолжить <span>→</span>
            </Link>
          </div>

          {/* Next */}
          <div className="card pad" style={{ display: "flex", flexDirection: "column", gap: 8, opacity: .8 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--muted)" }}>Следующий узел</p>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3s4 4 4 8a4 4 0 0 1-8 0c0-4 4-8 4-8Z"/><path d="M6 21h12"/><path d="M8 17h8"/>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--text)" }}>Планеты</p>
            <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>Понимай связи между планетами и их влияние</p>
            <Link href="#" style={{ fontSize: 13, color: "var(--muted)", marginTop: "auto" }}>
              Узнать больше
            </Link>
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ marginTop: 20 }}>
          <div className="section-head">
            <h2>Рекомендуем</h2>
          </div>
          <div className="grid-2">
            {RECS.map(r => (
              <Link key={r.title} href={r.href} className="tile">
                <div style={{ fontSize: 28, marginBottom: 8 }}>{r.img}</div>
                <h3>{r.title}</h3>
                <p>{r.sub}</p>
                <div style={{
                  marginTop: 12, display: "inline-block",
                  background: "linear-gradient(135deg, #7030b0, #4a1880)",
                  color: "#fff", borderRadius: 999, padding: "5px 14px",
                  fontSize: 12, fontWeight: 600,
                }}>
                  {r.btn}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress + CTA */}
        <div style={{
          marginTop: 20, padding: "14px 16px",
          border: "1px solid rgba(216,168,95,.2)",
          borderRadius: 18, background: "rgba(12,10,30,.8)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>Прогресс пути · Уровень 2 из 10</p>
            <div className="progress-bar" style={{ marginTop: 8 }}>
              <span style={{ width: "20%" }} />
            </div>
          </div>
        </div>
        <Link href="/today/star-way" className="btn primary" style={{ marginTop: 12 }}>
          Продолжить путь <span>→</span>
        </Link>

      </div>
      <BottomNav />
    </div>
  );
}
