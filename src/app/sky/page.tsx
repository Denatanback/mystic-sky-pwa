"use client";
import { useState } from "react";
import Link from "next/link";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";

const TABS = ["Все", "Активные", "Доступные"];

// Canvas: 394 x 440px (approx), center at (197, 220), orbit radius 140px
// Node angle: 0 = top, clockwise
const CW = 394, CH = 440, CX = 197, CY = 220, ORB = 140;
function polar(deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return {
    x: ((CX + ORB * Math.cos(rad)) / CW) * 100,
    y: ((CY + ORB * Math.sin(rad)) / CH) * 100,
  };
}
// SVG ellipse params for orbit ring (viewBox 0 0 100 100, preserveAspectRatio=none)
const ORX = (ORB / CW) * 100;
const ORY = (ORB / CH) * 100;
const OCX = (CX / CW) * 100;
const OCY = (CY / CH) * 100;

// Node icon SVGs (40x40 viewBox)
function IcoConstellation() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
      <circle cx="20" cy="6" r="2.2" fill="#f0c87b"/>
      <circle cx="9" cy="18" r="1.6" fill="#d8a85f" opacity={0.85}/>
      <circle cx="31" cy="20" r="1.6" fill="#d8a85f" opacity={0.85}/>
      <circle cx="14" cy="32" r="1.4" fill="#d8a85f" opacity={0.7}/>
      <circle cx="28" cy="31" r="1.4" fill="#d8a85f" opacity={0.7}/>
      <circle cx="22" cy="22" r="1" fill="#d8a85f" opacity={0.6}/>
      <line x1="20" y1="6" x2="9" y2="18" stroke="#d8a85f" strokeWidth={0.7} opacity={0.7}/>
      <line x1="20" y1="6" x2="31" y2="20" stroke="#d8a85f" strokeWidth={0.7} opacity={0.7}/>
      <line x1="9" y1="18" x2="22" y2="22" stroke="#d8a85f" strokeWidth={0.7} opacity={0.5}/>
      <line x1="31" y1="20" x2="22" y2="22" stroke="#d8a85f" strokeWidth={0.7} opacity={0.5}/>
      <line x1="14" y1="32" x2="22" y2="22" stroke="#d8a85f" strokeWidth={0.7} opacity={0.5}/>
      <line x1="28" y1="31" x2="22" y2="22" stroke="#d8a85f" strokeWidth={0.7} opacity={0.5}/>
    </svg>
  );
}
function IcoNumerology() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
      <text x="7" y="17" fontSize="11" fill="#aaa1b4" fontFamily="Georgia,serif">7</text>
      <text x="22" y="17" fontSize="11" fill="#aaa1b4" fontFamily="Georgia,serif">9</text>
      <text x="7" y="32" fontSize="11" fill="#aaa1b4" fontFamily="Georgia,serif">2</text>
      <text x="22" y="32" fontSize="11" fill="#aaa1b4" fontFamily="Georgia,serif">4</text>
      <line x1="19" y1="5" x2="19" y2="38" stroke="#2b2f4b" strokeWidth={0.8}/>
      <line x1="4" y1="21" x2="37" y2="21" stroke="#2b2f4b" strokeWidth={0.8}/>
    </svg>
  );
}
function IcoHumanDesign() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
      <polygon points="20,5 34,32 6,32" stroke="#aaa1b4" strokeWidth={1} fill="none" opacity={0.7}/>
      <circle cx="20" cy="5" r="2" fill="#7e7890" opacity={0.8}/>
      <circle cx="34" cy="32" r="2" fill="#7e7890" opacity={0.8}/>
      <circle cx="6" cy="32" r="2" fill="#7e7890" opacity={0.8}/>
      <circle cx="20" cy="20" r="1.5" fill="#aaa1b4" opacity={0.6}/>
      <line x1="20" y1="5" x2="20" y2="32" stroke="#aaa1b4" strokeWidth={0.5} opacity={0.4}/>
    </svg>
  );
}
function IcoPastLife() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
      <path d="M20 8 A 10 10 0 0 1 30 18" stroke="#7e7890" strokeWidth={1.2} fill="none" opacity={0.8}/>
      <path d="M20 8 A 10 10 0 0 0 10 18" stroke="#7e7890" strokeWidth={1.2} fill="none" opacity={0.8}/>
      <rect x="12" y="18" width="16" height="14" rx="2" stroke="#7e7890" strokeWidth={1} fill="none" opacity={0.6}/>
      <path d="M17 32 L17 26 Q20 23 23 26 L23 32" stroke="#7e7890" strokeWidth={0.8} fill="none" opacity={0.5}/>
    </svg>
  );
}
function IcoSpirit() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
      <circle cx="20" cy="8" r="3" stroke="#7e7890" strokeWidth={1} fill="none" opacity={0.7}/>
      <path d="M14 18 Q20 14 26 18 L24 28 Q20 32 16 28 Z" stroke="#7e7890" strokeWidth={1} fill="none" opacity={0.6}/>
      <line x1="20" y1="28" x2="20" y2="35" stroke="#7e7890" strokeWidth={1} opacity={0.5}/>
      <line x1="14" y1="22" x2="10" y2="26" stroke="#7e7890" strokeWidth={1} opacity={0.5}/>
      <line x1="26" y1="22" x2="30" y2="26" stroke="#7e7890" strokeWidth={1} opacity={0.5}/>
    </svg>
  );
}
function IcoSoul() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
      <path d="M20 32 C 20 32 8 22 8 15 A 6 6 0 0 1 20 12 A 6 6 0 0 1 32 15 C 32 22 20 32 20 32 Z" stroke="#7e7890" strokeWidth={1} fill="none" opacity={0.6}/>
      <circle cx="13" cy="12" r="1.5" fill="#7e7890" opacity={0.7}/>
      <circle cx="27" cy="12" r="1.5" fill="#7e7890" opacity={0.7}/>
      <circle cx="20" cy="23" r="1.5" fill="#7e7890" opacity={0.5}/>
      <line x1="13" y1="12" x2="20" y2="23" stroke="#7e7890" strokeWidth={0.6} opacity={0.5}/>
      <line x1="27" y1="12" x2="20" y2="23" stroke="#7e7890" strokeWidth={0.6} opacity={0.5}/>
    </svg>
  );
}

function IcoLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

interface SkyNode {
  id: string;
  num: number;
  label: string;
  sub: string;
  pos: { x: number; y: number };
  active: boolean;
  locked: boolean;
  premium: boolean;
  icon: React.ReactNode;
  href: string;
}

const NODES: SkyNode[] = [
  { id: "astro",    num: 1, label: "Астрология",       sub: "Текущий путь",  pos: polar(0),   active: true,  locked: false, premium: false, icon: <IcoConstellation />, href: "/today" },
  { id: "num",      num: 2, label: "Нумерология",      sub: "Доступно",      pos: polar(300), active: false, locked: false, premium: false, icon: <IcoNumerology />,    href: "#" },
  { id: "hd",       num: 3, label: "Дизайн человека",  sub: "Доступно",      pos: polar(60),  active: false, locked: false, premium: false, icon: <IcoHumanDesign />,   href: "#" },
  { id: "past",     num: 4, label: "Прошлая жизнь",    sub: "Премиум",       pos: polar(240), active: false, locked: true,  premium: true,  icon: <IcoPastLife />,      href: "#" },
  { id: "spirit",   num: 5, label: "Духовные\nпрактики", sub: "Доступно",    pos: polar(180), active: false, locked: false, premium: false, icon: <IcoSpirit />,        href: "#" },
  { id: "soul",     num: 6, label: "Родственная\nдуша", sub: "Премиум",      pos: polar(120), active: false, locked: true,  premium: true,  icon: <IcoSoul />,          href: "#" },
];

export default function SkyPage() {
  const [tab, setTab] = useState(0);

  const visible = NODES.filter(n => {
    if (tab === 0) return true;
    if (tab === 1) return n.active;
    if (tab === 2) return !n.locked && !n.active;
    return true;
  });

  return (
    <div className="app sky-page">
      <StarField orbits={false} />
      <div className="content">

        {/* Header */}
        <header className="header">
          <div className="screen-title">
            <h1>Карта неба</h1>
            <p>Выбери направление и продолжи путь.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="icon-btn" aria-label="Уведомления">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button className="icon-btn" aria-label="Режим">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a7 7 0 1 0 11.5 11.5Z"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              style={{
                flex: 1, height: 40, borderRadius: 999,
                border: `1px solid ${tab === i ? "transparent" : "rgba(255,255,255,.12)"}`,
                background: tab === i
                  ? "linear-gradient(135deg, rgba(120,50,200,.85), rgba(180,60,140,.7))"
                  : "rgba(255,255,255,.04)",
                color: tab === i ? "#fff" : "var(--muted)",
                fontSize: 13, fontWeight: tab === i ? 600 : 400,
                cursor: "pointer", transition: "all .2s",
                fontFamily: "var(--font-sans)",
                boxShadow: tab === i ? "0 4px 16px rgba(120,50,200,.35)" : "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Constellation canvas */}
        <div style={{
          position: "relative",
          height: 440,
          borderRadius: 24,
          border: "1px solid rgba(216,168,95,.14)",
          background: `
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(80,40,160,.35), transparent),
            radial-gradient(ellipse 50% 40% at 20% 70%, rgba(50,60,200,.18), transparent),
            radial-gradient(ellipse 45% 40% at 80% 25%, rgba(160,60,130,.15), transparent),
            #070615`,
          overflow: "hidden",
          marginBottom: 14,
          boxShadow: "inset 0 0 80px rgba(0,0,0,.6), 0 20px 50px rgba(0,0,0,.4)",
        }}>
          {/* Star field bg */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `
              radial-gradient(circle, rgba(255,240,180,.9) 0 1px, transparent 1.5px),
              radial-gradient(circle, rgba(180,210,230,.7) 0 .7px, transparent 1.2px),
              radial-gradient(circle, rgba(255,200,220,.6) 0 .6px, transparent 1px)`,
            backgroundSize: "63px 71px, 97px 113px, 41px 53px",
            backgroundPosition: "12px 8px, 38px 51px, 5px 29px",
            opacity: .55,
          }} />

          {/* Nebula blobs */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", filter: "blur(24px)", opacity: .5 }}>
            <div style={{ position: "absolute", width: 200, height: 100, left: -30, top: 180, background: "rgba(60,80,200,.25)", transform: "rotate(-15deg)", borderRadius: 999 }} />
            <div style={{ position: "absolute", width: 220, height: 100, right: -50, top: 140, background: "rgba(180,60,130,.2)", transform: "rotate(20deg)", borderRadius: 999 }} />
          </div>

          {/* SVG layer: orbit ring + glow */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2 }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="orbGlow">
                <feGaussianBlur stdDeviation="0.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* outer glow */}
            <ellipse cx={OCX} cy={OCY} rx={ORX + 0.8} ry={ORY + 0.8}
              fill="none" stroke="rgba(216,168,95,.08)" strokeWidth={2.5}/>
            {/* main orbit ring */}
            <ellipse cx={OCX} cy={OCY} rx={ORX} ry={ORY}
              fill="none" stroke="rgba(216,168,95,.28)" strokeWidth={0.6}
              strokeDasharray="2 1.5" filter="url(#orbGlow)"/>
            {/* orbit connectors at each node position */}
            {NODES.map(n => (
              <circle key={n.id}
                cx={n.pos.x} cy={n.pos.y * (440/440)}
                r={0.9} fill="rgba(216,168,95,.55)"/>
            ))}
          </svg>

          {/* Human silhouette (centered) */}
          <div style={{
            position: "absolute",
            left: "50%", top: `${(OCY / 100) * 100}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 3, pointerEvents: "none",
          }}>
            {/* Outer aura rings */}
            {[100, 76, 54].map((s, i) => (
              <div key={i} style={{
                position: "absolute",
                left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
                width: s, height: s * 1.55,
                borderRadius: "50%",
                border: `1px solid rgba(160,100,255,${0.07 - i * 0.015})`,
              }}/>
            ))}
            {/* Body glow */}
            <div style={{
              width: 38, height: 90,
              background: `
                radial-gradient(ellipse at 50% 20%, rgba(200,150,255,.50), transparent 55%),
                radial-gradient(ellipse at 50% 60%, rgba(140,80,240,.30), transparent 60%)`,
              borderRadius: "40% 40% 30% 30%",
              boxShadow: "0 0 50px rgba(160,80,255,.45), 0 0 20px rgba(180,120,255,.25)",
              animation: "figureGlow 3s ease-in-out infinite",
            }}/>
            {/* Head circle */}
            <div style={{
              position: "absolute",
              top: -16, left: "50%", transform: "translateX(-50%)",
              width: 18, height: 18, borderRadius: "50%",
              background: "radial-gradient(circle at 40% 35%, rgba(220,170,255,.6), rgba(140,80,240,.4))",
              boxShadow: "0 0 12px rgba(180,120,255,.5)",
            }}/>
            {/* Central star */}
            <div style={{
              position: "absolute", left: "50%", top: "32%",
              transform: "translate(-50%,-50%)",
              color: "rgba(240,200,120,.8)", fontSize: 10,
              textShadow: "0 0 6px rgba(216,168,95,.8)",
            }}>✦</div>
          </div>

          {/* Nodes */}
          {visible.map(n => {
            const size = n.active ? 80 : 70;
            return (
              <Link
                key={n.id}
                href={n.href}
                style={{
                  position: "absolute",
                  left: `${n.pos.x}%`,
                  top: `${n.pos.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 5, textDecoration: "none",
                }}
              >
                {/* Node circle */}
                <div style={{
                  width: size, height: size, borderRadius: "50%",
                  border: `${n.active ? 2 : 1.5}px solid ${n.active ? "rgba(216,168,95,.85)" : n.locked ? "rgba(100,80,160,.5)" : "rgba(160,130,220,.45)"}`,
                  background: n.active
                    ? "radial-gradient(circle at 40% 35%, rgba(216,168,95,.18), rgba(80,40,160,.85))"
                    : n.locked
                    ? "radial-gradient(circle at 40% 35%, rgba(40,30,80,.8), rgba(20,15,50,.95))"
                    : "radial-gradient(circle at 40% 35%, rgba(60,40,120,.5), rgba(15,10,40,.9))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                  boxShadow: n.active
                    ? "0 0 0 6px rgba(216,168,95,.10), 0 0 24px rgba(216,168,95,.40)"
                    : n.locked
                    ? "0 4px 16px rgba(0,0,0,.5)"
                    : "0 4px 14px rgba(0,0,0,.4)",
                  opacity: n.locked ? 0.75 : 1,
                  transition: "transform .2s",
                }}>
                  {n.icon}

                  {/* Star badge for active */}
                  {n.active && (
                    <div style={{
                      position: "absolute", top: -8, right: -8,
                      width: 20, height: 20, borderRadius: "50%",
                      background: "linear-gradient(135deg, #f0c87b, #d8a85f)",
                      border: "2px solid #07050f",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: "#07050f", fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(216,168,95,.5)",
                    }}>✦</div>
                  )}

                  {/* Lock badge */}
                  {n.locked && (
                    <div style={{
                      position: "absolute", bottom: -6, right: -6,
                      width: 20, height: 20, borderRadius: "50%",
                      background: "rgba(20,15,50,.9)",
                      border: "1.5px solid rgba(160,130,220,.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--muted-2)",
                    }}>
                      <IcoLock />
                    </div>
                  )}
                </div>

                {/* Label */}
                <div style={{ textAlign: "center", lineHeight: 1.25 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 600,
                    color: n.active ? "var(--gold-2)" : n.locked ? "var(--muted-2)" : "var(--muted)",
                    whiteSpace: "pre-line",
                    textShadow: n.active ? "0 0 8px rgba(216,168,95,.5)" : "none",
                  }}>
                    {n.num}. {n.label}
                  </div>
                  <div style={{ fontSize: 9, color: n.active ? "rgba(216,168,95,.7)" : "var(--muted-2)" }}>
                    {n.sub}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom info panel */}
        <div style={{
          background: "rgba(10,8,28,.92)",
          border: "1px solid rgba(216,168,95,.15)",
          borderRadius: 22,
          padding: "16px 16px 14px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 50px rgba(0,0,0,.4)",
        }}>
          {/* Current topic row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: "radial-gradient(circle at 40% 35%, rgba(216,168,95,.25), rgba(80,40,160,.8))",
              border: "1px solid rgba(216,168,95,.45)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(216,168,95,.3)",
            }}>
              <IcoConstellation />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.3, color: "var(--gold)", marginBottom: 2 }}>Текущая точка</p>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 400, color: "var(--text)" }}>Астрология</h3>
              <p style={{ fontSize: 12, color: "var(--muted)" }}>Луна в Скорпионе</p>
            </div>
            <Link href="/today" style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(216,168,95,.12)",
              border: "1px solid rgba(216,168,95,.30)",
              borderRadius: 999, padding: "7px 14px",
              fontSize: 12, fontWeight: 600, color: "var(--gold-2)",
              textDecoration: "none", whiteSpace: "nowrap",
            }}>
              ✦ Текущий путь
            </Link>
          </div>

          {/* Two-col: next unlock + progress */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            {/* Next unlock */}
            <div>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--muted-2)", marginBottom: 6 }}>Следующее открытие</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--muted-2)",
                }}>
                  <IcoLock />
                </div>
                <div>
                  <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>Прошлая жизнь</p>
                  <p style={{ fontSize: 10, color: "var(--muted-2)", marginTop: 1 }}>Откроется на уровне 3</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--muted-2)", marginBottom: 6 }}>Прогресс пути</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "var(--gold-2)", fontWeight: 700 }}>✦</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    height: 4, borderRadius: 99, overflow: "hidden",
                    background: "rgba(255,255,255,.08)", marginBottom: 4,
                  }}>
                    <div style={{
                      width: "20%", height: "100%", borderRadius: 99,
                      background: "linear-gradient(90deg, #8040c0, #d8a85f)",
                    }}/>
                  </div>
                  <p style={{ fontSize: 10, color: "var(--muted-2)" }}>Уровень 2 из 10</p>
                </div>
                <span style={{ fontSize: 12, color: "var(--gold-2)", fontWeight: 700 }}>20%</span>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <Link href="/today" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 52, borderRadius: 999,
            background: "linear-gradient(135deg, #8040c0 0%, #c04080 100%)",
            color: "#fff", fontSize: 16, fontWeight: 600,
            fontFamily: "var(--font-serif)", letterSpacing: ".03em",
            textDecoration: "none",
            boxShadow: "0 8px 28px rgba(120,40,140,.45), inset 0 1px 0 rgba(255,255,255,.15)",
          }}>
            Погрузиться
          </Link>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
