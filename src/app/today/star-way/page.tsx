import Link from "next/link";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";

// Constellation nodes for "Астрология" deep path
// Arranged like a necklace/constellation around center
const NODES = [
  { id: "sun",     num: 1, label: "Солнце",      sub: "Начало пути",      x: 50,  y: 85, current: true,  done: false },
  { id: "moon",    num: 2, label: "Луна",         sub: "Эмоции",           x: 18,  y: 65, current: false, done: false },
  { id: "aspects1",num: 3, label: "Аспекты",      sub: "Гармония",         x: 82,  y: 58, current: false, done: false },
  { id: "house",   num: 4, label: "Дом",          sub: "Среда жизни",      x: 12,  y: 35, current: false, done: false },
  { id: "planets", num: 5, label: "Планеты",      sub: "Энергии",          x: 50,  y: 22, current: false, done: false },
  { id: "transit", num: 6, label: "Транзиты",     sub: "Синхронизация",    x: 82,  y: 34, current: false, done: false },
  { id: "aspects2",num: 7, label: "Аспекты",      sub: "Структура",        x: 22,  y: 14, current: false, done: false },
  { id: "cycle",   num: 8, label: "Цикличность",  sub: "Целостность",      x: 72,  y: 10, current: false, done: false },
];

// Line connections (pairs of node indices)
const LINES = [[0,1],[0,2],[1,3],[2,5],[3,4],[4,6],[5,7],[4,7],[1,2],[3,6]];

export default function StarWayPage() {
  return (
    <div className="app sky-page">
      <StarField orbits={false} />
      <div className="content">

        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Link href="/today" className="icon-btn" aria-label="Назад">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m0 0 7 7m-7-7 7-7"/>
            </svg>
          </Link>
          <div>
            <p style={{ fontSize: 11, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1.2 }}>
              Астрология · приближённое созвездие
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, lineHeight: 1.1 }}>
              Глубокий путь
            </h1>
          </div>
        </header>

        {/* Constellation canvas */}
        <div style={{
          position: "relative", height: 380, borderRadius: 24,
          border: "1px solid rgba(216,168,95,.18)",
          background: `
            radial-gradient(ellipse 70% 55% at 50% 45%, rgba(80,40,160,.3), transparent),
            radial-gradient(ellipse 50% 40% at 20% 70%, rgba(50,60,200,.15), transparent),
            radial-gradient(ellipse 45% 40% at 80% 25%, rgba(160,60,130,.15), transparent),
            #080618`,
          overflow: "hidden",
          boxShadow: "inset 0 0 60px rgba(0,0,0,.5), 0 20px 50px rgba(0,0,0,.4)",
          marginBottom: 14,
        }}>
          {/* Micro star bg */}
          <div style={{
            position: "absolute", inset: "-10%", pointerEvents: "none",
            backgroundImage: `
              radial-gradient(circle, rgba(255,230,140,.9) 0 1px, transparent 1.5px),
              radial-gradient(circle, rgba(160,200,220,.8) 0 .8px, transparent 1.3px)`,
            backgroundSize: "52px 68px, 91px 107px",
            backgroundPosition: "8px 6px, 24px 38px",
            opacity: .45,
          }} />

          {/* Nebula */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", filter: "blur(20px)", opacity: .6 }}>
            <div style={{ position: "absolute", width: 180, height: 90, left: -20, top: 160, background: "rgba(60,80,180,.22)", transform: "rotate(-18deg)", borderRadius: "999px" }} />
            <div style={{ position: "absolute", width: 200, height: 90, right: -40, top: 120, background: "rgba(160,60,120,.18)", transform: "rotate(18deg)", borderRadius: "999px" }} />
          </div>

          {/* SVG lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2 }} viewBox="0 0 100 100" preserveAspectRatio="none">
            {LINES.map(([a, b], i) => {
              const na = NODES[a], nb = NODES[b];
              const isActive = na.current || nb.current;
              return (
                <g key={i}>
                  {isActive && (
                    <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                      stroke="rgba(216,168,95,.2)" strokeWidth={6} style={{ filter: "blur(4px)" }} />
                  )}
                  <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke={isActive ? "rgba(216,168,95,.45)" : "rgba(120,110,180,.3)"}
                    strokeWidth={isActive ? 1.4 : 1}
                    fill="none" />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {NODES.map(n => (
            <div
              key={n.id}
              style={{
                position: "absolute",
                left: `${n.x}%`, top: `${n.y}%`,
                transform: "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                zIndex: 3,
              }}
            >
              {/* Node circle */}
              <div style={{
                width: n.current ? 56 : 44, height: n.current ? 56 : 44,
                borderRadius: "50%",
                border: `2px solid ${n.current ? "rgba(216,168,95,.85)" : "rgba(160,130,220,.4)"}`,
                background: n.current
                  ? "radial-gradient(circle at 40% 35%, rgba(216,168,95,.2), rgba(80,40,160,.8))"
                  : "radial-gradient(circle at 40% 35%, rgba(255,255,255,.05), rgba(10,8,30,.9))",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: n.current
                  ? "0 0 0 8px rgba(216,168,95,.1), 0 0 20px rgba(216,168,95,.35)"
                  : "0 4px 12px rgba(0,0,0,.3)",
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "var(--font-serif)", fontSize: n.current ? 18 : 14,
                  color: n.current ? "var(--gold-2)" : "rgba(200,180,240,.7)", fontWeight: 400,
                }}>
                  {n.num}
                </span>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 600, letterSpacing: .04,
                color: n.current ? "var(--gold-2)" : "var(--muted)",
                textShadow: n.current ? "0 0 8px rgba(216,168,95,.6)" : "none",
                whiteSpace: "nowrap",
              }}>
                {n.label}
              </span>
              <span style={{ fontSize: 8, color: "var(--muted-2)" }}>{n.sub}</span>
            </div>
          ))}
        </div>

        {/* Current node panel */}
        <div style={{
          borderRadius: 20, border: "1px solid rgba(216,168,95,.2)",
          background: "rgba(12,10,30,.9)", padding: 16, marginBottom: 12,
        }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--gold)", marginBottom: 8 }}>Текущий узел</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "radial-gradient(circle at 40% 40%, rgba(120,60,200,.5), rgba(40,20,80,.8))",
              border: "1px solid rgba(216,168,95,.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(120,60,200,.4)",
            }}>
              <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="var(--gold-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a7 7 0 1 0 11.5 11.5Z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 400 }}>Луна</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>Эмоции, интуиция, внутренний мир</p>
            </div>
            <Link href="/today/node" className="btn primary" style={{ width: "auto", padding: "0 18px", height: 40, fontSize: 13 }}>
              Открыть узел
            </Link>
          </div>
        </div>

        {/* Next node */}
        <div style={{
          borderRadius: 18, border: "1px solid rgba(255,255,255,.08)",
          background: "rgba(10,8,28,.6)", padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 16,
        }}>
          <div>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)", marginBottom: 4 }}>Следующий узел</p>
            <p style={{ fontSize: 15, color: "var(--text)" }}>Планеты</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Символы энергий и планет</p>
          </div>
          <span style={{ fontSize: 12, color: "var(--muted-2)" }}>→</span>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Прогресс пути</span>
          <div className="progress-bar" style={{ flex: 1 }}>
            <span style={{ width: "25%" }} />
          </div>
          <span style={{ fontSize: 12, color: "var(--gold-2)", fontWeight: 600 }}>2 из 8 узлов</span>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
