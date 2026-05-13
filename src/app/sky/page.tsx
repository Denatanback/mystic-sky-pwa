"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { getMockUser } from "@/lib/mockAuth";
import { useLang } from "@/lib/i18n";

type NodeStatus = "active" | "available" | "premium";
interface SkyNode { id: string; num: number; status: NodeStatus; emblem: string; deg: number; }

const NODES: SkyNode[] = [
  { id: "astro",       num: 1, status: "active",    emblem: "/assets/sky-emblems/sky-astrology-emblem.png",     deg: 0 },
  { id: "numerology",  num: 2, status: "available", emblem: "/assets/sky-emblems/sky-numerology-emblem.png",    deg: 300 },
  { id: "humandesign", num: 3, status: "available", emblem: "/assets/sky-emblems/sky-humandesign-emblem-2.png", deg: 60 },
  { id: "pastlife",    num: 4, status: "premium",   emblem: "/assets/sky-emblems/sky-pastlife-emblem.png",      deg: 240 },
  { id: "spiritual",   num: 5, status: "available", emblem: "/assets/sky-emblems/sky-soulpractice-emblem.png",  deg: 180 },
  { id: "soulmate",    num: 6, status: "premium",   emblem: "/assets/sky-emblems/sky-soulmate-emblem.png",      deg: 120 },
];
const NODE_PATH: Record<string, string> = {
  astro: "/sky/astrology",
  numerology: "/sky/numerology",
  humandesign: "/sky/humandesign",
  pastlife: "/sky/pastlife",
  spiritual: "/sky/spiritual",
  soulmate: "/sky/soulmate",
};
const CW = 390, CH = 460, CX = 195, CY = 230, ORB = 132;
function polar(deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: ((CX + ORB * Math.cos(rad)) / CW) * 100, y: ((CY + ORB * Math.sin(rad)) / CH) * 100 };
}
const OCX = (CX / CW) * 100, OCY = (CY / CH) * 100;
const ORX = (ORB / CW) * 100, ORY = (ORB / CH) * 100;

export default function SkyPage() {
  const { t } = useLang();
  const TABS = [t.sky.all, t.sky.active, t.sky.available] as const;
  const [tab, setTab] = useState(0);
  const [gender, setGender] = useState<"female"|"male">("female");
  useEffect(() => { const u = getMockUser(); if (u?.gender === "male") setGender("male"); }, []);

  const nodeLabel = (id: string) => ({ astro: t.sky.astrology, numerology: t.sky.numerology, humandesign: t.sky.humanDesign, pastlife: t.sky.pastLife, spiritual: t.sky.spiritual, soulmate: t.sky.soulmate }[id] ?? id);
  const nodeSub   = (n: SkyNode) => n.status === "active" ? t.sky.currentPath : n.status === "premium" ? t.sky.premium : t.sky.availableLabel;

  const bgImage = gender === "male" ? "/assets/sky-background/sky-backroung-man.png" : "/assets/sky-background/sky-background-woman.png";
  const activeNode = NODES.find(n => n.status === "active")!;
  const nextLocked = NODES.find(n => n.status === "premium")!;

  function nodeVisible(n: SkyNode) {
    if (tab === 0) return true;
    if (tab === 1) return n.status === "active";
    if (tab === 2) return n.status === "available";
    return true;
  }

  return (
    <div className="app sky-page">
      <StarField orbits={false} />
      <div className="content" style={{ paddingBottom: 100 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: "var(--text)", fontWeight: 400, letterSpacing: ".05em" }}>Eluna<sup style={{ color: "var(--gold-2)", fontSize: 16, verticalAlign: "super" }}>&#10022;</sup></span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg></button>
            <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"/></svg></button>
          </div>
        </header>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 38, fontWeight: 400, color: "var(--text)", marginBottom: 4, lineHeight: 1.1 }}>{t.sky.title}</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 18 }}>{t.sky.subtitle}</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {TABS.map((tab_label, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ flex: 1, padding: "10px 0", borderRadius: 999, border: `1px solid ${tab === i ? "transparent" : "rgba(255,255,255,.12)"}`, background: tab === i ? "linear-gradient(135deg, #7030b0, #4a1880)" : "rgba(255,255,255,.04)", color: tab === i ? "#fff" : "var(--muted)", fontSize: 13, fontWeight: tab === i ? 600 : 400, fontFamily: "var(--font-sans)", cursor: "pointer", boxShadow: tab === i ? "0 4px 14px rgba(80,20,130,.4)" : "none", transition: "all .2s" }}>{tab_label}</button>
          ))}
        </div>

        {/* Orbital map */}
        <div style={{ position: "relative", height: 460, borderRadius: 24, overflow: "hidden", border: "1px solid rgba(216,168,95,.15)", background: "#06040f", marginBottom: 16 }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", filter: "blur(28px)", opacity: .5 }}>
            <div style={{ position: "absolute", width: 240, height: 130, left: "50%", top: "35%", transform: "translate(-50%,-50%)", background: "rgba(90,40,180,.3)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", width: 160, height: 100, left: "20%", top: "65%", background: "rgba(50,70,200,.18)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", width: 160, height: 100, right: "10%", top: "25%", background: "rgba(160,40,120,.16)", borderRadius: "50%" }} />
          </div>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 268, height: 268, borderRadius: "50%", overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
            <Image src={bgImage} alt="Figure" fill style={{ objectFit: "cover", objectPosition: "center center" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 28%, rgba(6,4,15,.7) 65%, rgba(6,4,15,.97) 100%)" }} />
          </div>
          {[286,246,206].map((s,i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: s, height: s, borderRadius: "50%", border: `1px solid rgba(216,168,95,${0.05+i*0.03})`, pointerEvents: "none", zIndex: 2 }} />)}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 3 }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx={OCX} cy={OCY} rx={ORX} ry={ORY} fill="none" stroke="rgba(216,168,95,.28)" strokeWidth={.35} strokeDasharray="1.2 1.2" />
            {NODES.map(n => { const p = polar(n.deg); const dim = !nodeVisible(n); return <line key={n.id} x1={OCX} y1={OCY} x2={p.x} y2={p.y} stroke={dim ? "rgba(120,100,180,.1)" : "rgba(216,168,95,.18)"} strokeWidth={.4} />; })}
            {NODES.map(n => { const p = polar(n.deg); const dim = !nodeVisible(n); return <circle key={n.id+"-d"} cx={p.x} cy={p.y} r={.7} fill={dim ? "rgba(120,100,180,.25)" : "rgba(216,168,95,.5)"} />; })}
            {[30,90,150,210,270,330].map(deg => { const rad=(deg-90)*Math.PI/180; return <circle key={"m"+deg} r={.4} cx={OCX+ORX*Math.cos(rad)} cy={OCY+ORY*Math.sin(rad)} fill="rgba(216,168,95,.25)" />; })}
          </svg>
          {NODES.map(n => {
            const pos = polar(n.deg);
            const isActive = n.status === "active", isPremium = n.status === "premium";
            const dim = !nodeVisible(n); const size = isActive ? 84 : 72;
            const nodePath = NODE_PATH[n.id];
            const Inner = () => <>
              <div style={{ width: size, height: size, borderRadius: "50%", border: `${isActive?2:1.5}px solid ${isActive?"rgba(216,168,95,.85)":isPremium?"rgba(160,130,220,.3)":"rgba(216,168,95,.4)"}`, background: isActive?"radial-gradient(circle at 40% 35%, rgba(216,168,95,.15), rgba(80,40,160,.85))":isPremium?"radial-gradient(circle at 40% 35%, rgba(255,255,255,.04), rgba(20,10,40,.92))":"radial-gradient(circle at 40% 35%, rgba(255,255,255,.06), rgba(15,8,32,.88))", boxShadow: isActive?"0 0 0 8px rgba(216,168,95,.08), 0 0 24px rgba(216,168,95,.35)":"0 4px 14px rgba(0,0,0,.3)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                <Image src={n.emblem} alt={nodeLabel(n.id)} fill style={{ objectFit: "contain", padding: isActive?10:8, opacity: isPremium?.5:1 }} />
                {isActive && <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #d8a85f, #8040c0)", border: "1.5px solid rgba(216,168,95,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, zIndex: 5, boxShadow: "0 0 8px rgba(216,168,95,.5)" }}>&#9733;</div>}
                {isPremium && <div style={{ position: "absolute", bottom: 6, right: 6, zIndex: 5, lineHeight: 0, filter: "drop-shadow(0 1px 3px rgba(0,0,0,.8))" }}><Image src="/assets/icons/icon-lock.png" alt="Locked" width={30} height={30} style={{ objectFit: "contain" }} /></div>}
              </div>
              <div style={{ textAlign: "center", lineHeight: 1.25 }}>
                <div style={{ fontSize: isActive?12:10.5, fontWeight: isActive?600:500, color: isActive?"var(--gold-2)":isPremium?"var(--muted-2)":"var(--text)", textShadow: isActive?"0 0 8px rgba(216,168,95,.5)":"none", whiteSpace: "nowrap" }}>{n.num}. {nodeLabel(n.id)}</div>
                <div style={{ fontSize: 9.5, color: isActive?"rgba(216,168,95,.75)":isPremium?"rgba(160,130,200,.45)":"var(--muted)" }}>{nodeSub(n)}</div>
              </div>
            </>;
            return (
              <div key={n.id} style={{ position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: dim?.2:1, transition: "opacity .25s" }}>
                {nodePath ? <Link href={nodePath} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><Inner /></Link> : <Inner />}
              </div>
            );
          })}
        </div>

        {/* Bottom info panel */}
        <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 22, background: "rgba(10,8,22,.85)", backdropFilter: "blur(12px)", padding: "16px 16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", marginBottom: 10 }}>{t.sky.currentPoint}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", flexShrink: 0, background: "radial-gradient(circle at 40% 35%, rgba(120,60,200,.5), rgba(40,20,80,.85))", border: "1.5px solid rgba(216,168,95,.45)", position: "relative", overflow: "hidden", boxShadow: "0 0 16px rgba(120,60,200,.35)" }}>
                <Image src={activeNode.emblem} alt={nodeLabel(activeNode.id)} fill style={{ objectFit: "contain", padding: 6 }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 400, color: "var(--text)", lineHeight: 1.1, marginBottom: 2 }}>{nodeLabel(activeNode.id)}</p>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>{t.sky.moonInScorpio}</p>
              </div>
              <Link href="/today/star-way" style={{ display: "flex", alignItems: "center", gap: 5, border: "1px solid rgba(216,168,95,.35)", borderRadius: 999, padding: "8px 14px", fontSize: 12, color: "var(--gold-2)", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                <span style={{ fontSize: 10 }}>&#10022;</span> {t.sky.currentPathBtn}
              </Link>
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,.07)" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--muted)", marginBottom: 8 }}>{t.sky.nextUnlock}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ lineHeight: 0, flexShrink: 0, filter: "drop-shadow(0 1px 4px rgba(0,0,0,.7))" }}><Image src="/assets/icons/icon-lock.png" alt="Locked" width={42} height={42} style={{ objectFit: "contain" }} /></div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text)", fontWeight: 500, lineHeight: 1.2 }}>{nodeLabel(nextLocked.id)}</p>
                  <p style={{ fontSize: 10, color: "var(--muted-2)", marginTop: 1 }}>{t.sky.unlocksAt}</p>
                </div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--muted)", marginBottom: 8 }}>{t.sky.pathProgress}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{ color: "var(--gold-2)", fontSize: 12 }}>&#10022;</span>
                <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,.08)", overflow: "hidden" }}><div style={{ height: "100%", width: "60%", borderRadius: 99, background: "linear-gradient(90deg, #8040c0, #d8a85f)" }} /></div>
                <span style={{ fontSize: 11, color: "var(--gold-2)", fontWeight: 600 }}>60%</span>
              </div>
              <p style={{ fontSize: 10, color: "var(--muted-2)" }}>{t.sky.level}</p>
            </div>
          </div>
          <Link href="/today/star-way" style={{ display: "block", textAlign: "center", height: 52, lineHeight: "52px", borderRadius: 999, background: "linear-gradient(135deg, #8040c0 0%, #c04060 100%)", color: "#fff", fontSize: 16, fontWeight: 600, fontFamily: "var(--font-serif)", letterSpacing: ".04em", textDecoration: "none", boxShadow: "0 8px 28px rgba(120,30,80,.4), inset 0 1px 0 rgba(255,255,255,.12)" }}>{t.sky.diveIn}</Link>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
