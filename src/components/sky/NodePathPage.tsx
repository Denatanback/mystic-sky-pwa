"use client";
import Link from "next/link";
import Image from "next/image";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { useLang } from "@/lib/i18n";

export type NodeStatus = "done" | "current" | "locked";
export interface PathNode {
  num: number;
  label: string;
  sub: string;
  desc: string;
  status: NodeStatus;
  emblem: string;
  x: number;
  y: number;
}

interface Props {
  discipline: string;
  disciplineKey?: string;
  nodes: PathNode[];
  lines: [number, number][];
  nextNodeIndex?: number;
}

const MAP_H = 510;

export function NodePathPage({ discipline, disciplineKey, nodes, lines, nextNodeIndex }: Props) {
  const { t } = useLang();
  const currentNode = nodes.find(n => n.status === "current");
  const nextNode = nextNodeIndex !== undefined ? nodes[nextNodeIndex] : nodes.find(n => n.status === "locked");
  const doneCount = nodes.filter(n => n.status !== "locked").length;

  return (
    <div className="app">
      <StarField orbits={false} />
      <div className="content" style={{ paddingBottom: 100 }}>

        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <Link href="/sky" style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(216,168,95,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", textDecoration: "none", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 400, lineHeight: 1.05, color: "var(--text)" }}>{t.nodePath.title}</h1>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{discipline} &middot; {t.nodePath.subtitle}</p>
          </div>
        </header>

        {/* Constellation map */}
        <div style={{ position: "relative", height: MAP_H, marginBottom: 20 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
            <defs>
              <linearGradient id="lg1" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="rgba(216,168,95,.8)"/>
                <stop offset="100%" stopColor="rgba(140,70,220,.55)"/>
              </linearGradient>
            </defs>
            {lines.map(([i, j], idx) => (
              <line key={idx} x1={nodes[i].x} y1={nodes[i].y} x2={nodes[j].x} y2={nodes[j].y} stroke="url(#lg1)" strokeWidth="0.5" strokeDasharray="2 1.5" strokeLinecap="round"/>
            ))}
            {lines.map(([i, j], idx) => {
              const mx = (nodes[i].x + nodes[j].x) / 2, my = (nodes[i].y + nodes[j].y) / 2;
              return (
                <g key={`sp-${idx}`} transform={`translate(${mx},${my})`}>
                  <line x1="-0.9" y1="0" x2="0.9" y2="0" stroke="rgba(216,168,95,.7)" strokeWidth="0.35"/>
                  <line x1="0" y1="-0.9" x2="0" y2="0.9" stroke="rgba(216,168,95,.7)" strokeWidth="0.35"/>
                </g>
              );
            })}
            {nodes.map((n, i) => <circle key={`nc-${i}`} cx={n.x} cy={n.y} r="0.55" fill="rgba(216,168,95,.5)"/>)}
          </svg>

          {nodes.map((n) => {
            const isDone = n.status === "done", isCurrent = n.status === "current", isLocked = n.status === "locked";
            const nodeSize = 72;
            return (
              <div key={n.num} style={{ position: "absolute", left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ position: "relative", width: 88, height: 88, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isCurrent && <div style={{ position: "absolute", inset: 3, borderRadius: "50%", zIndex: 0, boxShadow: "0 0 0 5px rgba(216,168,95,.1), 0 0 20px rgba(216,168,95,.4)" }}/>}
                  <div style={{ width: nodeSize, height: nodeSize, borderRadius: "50%", border: `${isCurrent?"2px":"1.5px"} solid ${isCurrent?"rgba(216,168,95,.95)":isDone?"rgba(216,168,95,.6)":"rgba(160,130,220,.4)"}`, background: isCurrent?"radial-gradient(circle at 38% 32%, rgba(216,168,95,.2), rgba(80,30,160,.9))":isDone?"radial-gradient(circle at 38% 32%, rgba(216,168,95,.12), rgba(30,14,80,.92))":"radial-gradient(circle at 38% 32%, rgba(255,255,255,.05), rgba(10,5,26,.94))", boxShadow: isCurrent?"0 0 0 5px rgba(216,168,95,.08), 0 0 18px rgba(216,168,95,.38), inset 0 0 12px rgba(216,168,95,.06)":isDone?"0 0 10px rgba(216,168,95,.18)":"0 4px 12px rgba(0,0,0,.45)", overflow: "hidden", position: "relative", zIndex: 1, opacity: isLocked?0.78:1 }}>
                    <Image src={n.emblem} alt={n.label} fill style={{ objectFit: "contain", padding: 9, opacity: isLocked?0.55:1 }}/>
                  </div>
                  {isCurrent && <div style={{ position: "absolute", top: 5, right: 5, zIndex: 3, width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #d8a85f, #8040c0)", border: "1.5px solid rgba(216,168,95,.85)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", boxShadow: "0 0 10px rgba(216,168,95,.75)" }}>&#9733;</div>}
                  {isLocked && <div style={{ position: "absolute", bottom: 4, right: 4, zIndex: 3, lineHeight: 0, filter: "drop-shadow(0 1px 4px rgba(0,0,0,.9))" }}><Image src="/assets/icons/icon-lock.png" alt="locked" width={22} height={22} style={{ objectFit: "contain" }}/></div>}
                </div>
                <div style={{ textAlign: "center", lineHeight: 1.3, marginTop: -2, maxWidth: 82 }}>
                  <div style={{ fontSize: 11.5, fontWeight: isCurrent?700:500, color: isCurrent?"var(--text)":isDone?"rgba(216,168,95,.85)":"var(--muted-2)", whiteSpace: "nowrap" }}>{n.num}. {n.label}</div>
                  <div style={{ fontSize: 10, color: "var(--muted-2)", marginTop: 1 }}>{n.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current node card */}
        {currentNode && (
          <div style={{ border: "1px solid rgba(216,168,95,.28)", borderRadius: 20, marginBottom: 10, overflow: "hidden", background: "rgba(14,10,32,.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", gap: 16, padding: "18px 16px 14px" }}>
              <div style={{ width: 76, height: 76, borderRadius: 18, flexShrink: 0, border: "1px solid rgba(216,168,95,.5)", overflow: "hidden", position: "relative", background: "radial-gradient(circle at 40% 35%, rgba(216,168,95,.16), rgba(50,22,100,.92))", boxShadow: "0 0 20px rgba(216,168,95,.22)" }}>
                <Image src={currentNode.emblem} alt={currentNode.label} fill style={{ objectFit: "contain", padding: 8 }}/>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: "0.09em", marginBottom: 5 }}>{t.nodePath.currentNode}</p>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 400, lineHeight: 1.05, marginBottom: 5 }}>{currentNode.label}</h2>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{currentNode.desc}</p>
              </div>
            </div>
            <div style={{ padding: "0 16px 16px" }}>
              <Link href={disciplineKey && currentNode ? `/sky/${disciplineKey}/${currentNode.num}` : "#"} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, height: 48, borderRadius: 999, background: "linear-gradient(135deg, #7030b0 0%, #b03060 100%)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 6px 22px rgba(110,30,130,.4)" }}>
                {t.nodePath.openNode} <span style={{ opacity: 0.8 }}>&#8594;</span>
              </Link>
            </div>
          </div>
        )}

        {/* Next node card */}
        {nextNode && (
          <div style={{ border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, marginBottom: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, background: "rgba(12,8,28,.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, flexShrink: 0, border: "1px solid rgba(160,130,220,.3)", overflow: "hidden", position: "relative", background: "rgba(20,10,42,.8)" }}>
              <Image src={nextNode.emblem} alt={nextNode.label} fill style={{ objectFit: "contain", padding: 7, opacity: 0.7 }}/>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: "var(--muted-2)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 3 }}>{t.nodePath.nextNode}</p>
              <p style={{ fontSize: 17, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>{nextNode.label}</p>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{nextNode.desc}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-2)", flexShrink: 0 }}><path d="m9 18 6-6-6-6"/></svg>
          </div>
        )}

        {/* Progress bar */}
        <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "14px 16px", background: "rgba(12,8,28,.45)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: "0.09em" }}>{t.nodePath.progressTitle}</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>{doneCount} {t.nodePath.of} {nodes.length} {t.nodePath.nodes}</p>
          </div>
          <div style={{ position: "relative", height: 22, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, borderRadius: 99, background: "rgba(255,255,255,.1)" }}/>
            <div style={{ position: "absolute", left: 0, height: 2, borderRadius: 99, width: `${((doneCount-1)/(nodes.length-1))*100}%`, background: "linear-gradient(90deg, #8040c0, #d8a85f)" }}/>
            {nodes.map((n, i) => {
              const pct = (i/(nodes.length-1))*100, active = n.status !== "locked";
              return (
                <div key={i} style={{ position: "absolute", left: `${pct}%`, transform: "translateX(-50%)", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i === 0
                    ? <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0 L8.7 7.3 L16 8 L8.7 8.7 L8 16 L7.3 8.7 L0 8 L7.3 7.3 Z" fill={active?"rgba(216,168,95,.9)":"rgba(255,255,255,.2)"}/></svg>
                    : <svg width="8" height="8" viewBox="0 0 8 8"><path d="M4 0 L4.5 3.5 L8 4 L4.5 4.5 L4 8 L3.5 4.5 L0 4 L3.5 3.5 Z" fill={active?"rgba(216,168,95,.8)":"rgba(255,255,255,.18)"}/></svg>
                  }
                </div>
              );
            })}
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
