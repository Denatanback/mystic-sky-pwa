import Link from "next/link";
import Image from "next/image";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";

const PATH_STEPS = [
  { num: 1, key: "sun",     label: "Солнце",  done: true,  current: false },
  { num: 2, key: "moon",    label: "Луна",     done: false, current: true },
  { num: 3, key: "planets", label: "Планеты",  done: false, current: false },
  { num: 4, key: "aspects", label: "Аспекты",  done: false, current: false },
];

const DAILY = [
  { key: "card",     eyebrow: "Карта дня",    img: "/assets/main_screen/card-01.png",       label: "Послание от\nВселенной",       btn: "Открыть",      href: "/cards",  color: "linear-gradient(135deg,#7030b0,#4a1880)" },
  { key: "practice", eyebrow: "Практика",     img: "/assets/main_screen/meditation-01.png", label: "Медитация\n7 минут",            btn: "Начать",       href: "/today",  color: "linear-gradient(135deg,#1a6b6b,#0d4040)" },
  { key: "ritual",   eyebrow: "Ритуал",       img: "/assets/main_screen/candle-01.png",      label: "Ритуал\nблагодарности",        btn: "Начать",       href: "/today",  color: "linear-gradient(135deg,#b07820,#7a5010)" },
];

const glassCard: React.CSSProperties = {
  border: "1px solid rgba(216,168,95,.2)",
  borderRadius: 20,
  background: "transparent",
  backdropFilter: "blur(6px)",
};

export default function TodayPage() {
  return (
    <div className="app">
      <StarField />
      <div className="content">

        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", marginBottom: 2 }}>
              ✦ Твой путь
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 400, color: "var(--text)", lineHeight: 1 }}>
              Астрология
            </h1>
          </div>
          <button className="icon-btn" aria-label="Режим">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a7 7 0 1 0 11.5 11.5Z"/>
            </svg>
          </button>
        </header>

        {/* Hero — current path */}
        <div style={{
          borderRadius: 22, overflow: "hidden",
          border: "1px solid rgba(216,168,95,.2)",
          background: "linear-gradient(135deg, #0f0826 0%, #1a0a3a 60%, #0d0820 100%)",
          padding: "18px 18px 16px", position: "relative",
          boxShadow: "0 20px 50px rgba(0,0,0,.45)",
          marginBottom: 14,
        }}>
          {/* Emblem top-right */}
          <div style={{
            position: "absolute", right: 12, top: 12,
            width: 90, height: 90, opacity: .55,
          }}>
            <Image src="/assets/sky-emblems/sky-astrology-emblem.png" alt="Астрология"
              fill style={{ objectFit: "contain" }} />
          </div>

          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
            {["Интуиция", "Циклы", "Самопознание"].map(t => (
              <span key={t} style={{
                fontSize: 10, fontWeight: 600, letterSpacing: .5,
                padding: "3px 10px", borderRadius: 999,
                background: "rgba(120,60,200,.25)",
                border: "1px solid rgba(160,100,240,.35)",
                color: "rgba(200,170,255,.85)",
              }}>{t}</span>
            ))}
          </div>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 6, maxWidth: "68%" }}>
            Понимай себя через звёздный код
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, maxWidth: "70%", marginBottom: 16 }}>
            Полюби свои циклы и принимай осознанные решения.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Прогресс</span>
            <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "20%", background: "linear-gradient(90deg, #8040c0, #d8a85f)", borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--gold-2)", fontWeight: 600 }}>20%</span>
          </div>
        </div>

        {/* Path steps */}
        <div style={{ ...glassCard, padding: "16px 14px", marginBottom: 14 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", marginBottom: 14 }}>
            Путь · Узлы астрологии
          </p>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {PATH_STEPS.map((s, i) => (
              <div key={s.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  {/* Left connector */}
                  {i > 0 && (
                    <div style={{
                      flex: 1, height: 2, borderRadius: 99,
                      background: s.done
                        ? "var(--gold)"
                        : s.current
                        ? "linear-gradient(90deg, var(--gold) 0%, rgba(255,255,255,.1) 100%)"
                        : "rgba(255,255,255,.08)",
                    }} />
                  )}
                  {/* Circle */}
                  <div style={{
                    width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${s.current ? "rgba(216,168,95,.9)" : s.done ? "rgba(216,168,95,.55)" : "rgba(255,255,255,.12)"}`,
                    background: s.done
                      ? "rgba(216,168,95,.15)"
                      : s.current
                      ? "radial-gradient(circle at 40% 40%, rgba(120,60,200,.4), rgba(40,20,80,.7))"
                      : "rgba(255,255,255,.03)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 400,
                    color: s.done || s.current ? "var(--gold-2)" : "var(--muted-2)",
                    boxShadow: s.current ? "0 0 0 6px rgba(216,168,95,.1), 0 0 16px rgba(216,168,95,.3)" : "none",
                    position: "relative", zIndex: 1,
                    transition: "all .2s",
                  }}>
                    {s.done
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-2)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      : s.num
                    }
                  </div>
                  {/* Right connector */}
                  {i < PATH_STEPS.length - 1 && (
                    <div style={{
                      flex: 1, height: 2, borderRadius: 99,
                      background: s.done ? "var(--gold)" : "rgba(255,255,255,.08)",
                    }} />
                  )}
                </div>
                <span style={{
                  fontSize: 10, marginTop: 7, textAlign: "center",
                  color: s.current ? "var(--gold-2)" : s.done ? "var(--gold)" : "var(--muted-2)",
                  fontWeight: s.current ? 600 : 400,
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current + Next node */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {/* Current node */}
          <div style={{ ...glassCard, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: 1.1, color: "var(--gold)" }}>
              Текущий узел
            </p>
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
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--text)", lineHeight: 1.2 }}>Луна</p>
            <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4, flex: 1 }}>Глубина, интуиция и понимание себя</p>
            <Link href="/today/node" style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 12, color: "var(--gold-2)", fontWeight: 600,
              textDecoration: "none",
            }}>
              Продолжить <span>→</span>
            </Link>
          </div>

          {/* Next node */}
          <div style={{ ...glassCard, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8, opacity: .7 }}>
            <p style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: 1.1, color: "var(--muted)" }}>
              Следующий узел
            </p>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8a2 2 0 0 1 0 4m0 4h.01"/>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--text)", lineHeight: 1.2 }}>Планеты</p>
            <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4, flex: 1 }}>Понимай энергии и их влияние</p>
            <span style={{ fontSize: 12, color: "var(--muted-2)" }}>Скоро</span>
          </div>
        </div>

        {/* Daily section */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1.1, display: "flex", alignItems: "center", gap: 6 }}>
              <span>✦</span> На сегодня
            </p>
            <Link href="/cards" style={{ fontSize: 12, color: "var(--gold)", textDecoration: "none" }}>Все →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {DAILY.map(d => (
              <Link key={d.key} href={d.href} style={{
                ...glassCard,
                padding: "10px 7px 10px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                textDecoration: "none",
              }}>
                <p style={{ fontSize: 8.5, textTransform: "uppercase", letterSpacing: 1, color: "var(--gold)", textAlign: "center" }}>
                  ✦ {d.eyebrow}
                </p>
                <div style={{ width: "100%", aspectRatio: "1/1", position: "relative" }}>
                  <Image src={d.img} alt={d.eyebrow} fill style={{ objectFit: "contain" }} />
                </div>
                <p style={{ fontSize: 11, color: "var(--text)", textAlign: "center", lineHeight: 1.35, whiteSpace: "pre-line", flex: 1 }}>
                  {d.label}
                </p>
                <span style={{
                  display: "block", textAlign: "center", width: "100%",
                  background: d.color, borderRadius: 999,
                  color: "#fff", fontSize: 11, fontWeight: 600, padding: "6px 0",
                }}>
                  {d.btn}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ ...glassCard, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              Прогресс пути · Уровень 2 из 10
            </p>
            <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "20%", background: "linear-gradient(90deg, #8040c0, #d8a85f)", borderRadius: 99 }} />
            </div>
          </div>
          <span style={{ fontSize: 13, color: "var(--gold-2)", fontWeight: 600 }}>20%</span>
        </div>

        <Link href="/today/star-way" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          height: 52, borderRadius: 999,
          background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
          color: "#fff", fontSize: 15, fontWeight: 600,
          fontFamily: "var(--font-serif)", letterSpacing: ".03em",
          textDecoration: "none",
          boxShadow: "0 8px 28px rgba(90,32,144,.4), inset 0 1px 0 rgba(255,255,255,.12)",
        }}>
          Продолжить путь <span>→</span>
        </Link>

      </div>
      <BottomNav />
    </div>
  );
}
