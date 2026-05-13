"use client";
import Link from "next/link";
import Image from "next/image";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { useLang } from "@/lib/i18n";

const glassCard: React.CSSProperties = { border: "1px solid rgba(216,168,95,.2)", borderRadius: 20, background: "transparent", backdropFilter: "blur(6px)" };

export default function TodayPage() {
  const { t } = useLang();
  const PATH_STEPS = [
    { num: 1, label: t.today.sun,     done: true,  current: false },
    { num: 2, label: t.today.moon,    done: false, current: true  },
    { num: 3, label: t.today.planets, done: false, current: false },
    { num: 4, label: t.today.aspects, done: false, current: false },
  ];
  const DAILY = [
    { key: "card",     eyebrow: t.today.cardOfDay, img: "/assets/main_screen/card-01.png",       label: t.today.universeMsg, btn: t.today.open,  href: "/cards", color: "linear-gradient(135deg,#7030b0,#4a1880)" },
    { key: "practice", eyebrow: t.today.practice,  img: "/assets/main_screen/meditation-01.png", label: t.today.meditation,  btn: t.today.start, href: "/today", color: "linear-gradient(135deg,#1a6b6b,#0d4040)" },
    { key: "ritual",   eyebrow: t.today.ritual,    img: "/assets/main_screen/candle-01.png",      label: t.today.gratitude,   btn: t.today.start, href: "/today", color: "linear-gradient(135deg,#b07820,#7a5010)" },
  ];
  return (
    <div className="app">
      <StarField />
      <div className="content">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", marginBottom: 2 }}>{t.today.yourPath}</p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 400, color: "var(--text)", lineHeight: 1 }}>{t.today.astrology}</h1>
          </div>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a7 7 0 1 0 11.5 11.5Z"/></svg></button>
        </header>

        {/* Hero */}
        <div style={{ borderRadius: 22, overflow: "hidden", border: "1px solid rgba(216,168,95,.2)", background: "linear-gradient(135deg, #0f0826 0%, #1a0a3a 60%, #0d0820 100%)", padding: "18px 18px 16px", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,.45)", marginBottom: 14 }}>
          <div style={{ position: "absolute", right: 12, top: 12, width: 90, height: 90, opacity: .55 }}>
            <Image src="/assets/sky-emblems/sky-astrology-emblem.png" alt="Astrology" fill style={{ objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
            {[t.today.intuition, t.today.cycles, t.today.selfKnowledge].map(tag => (
              <span key={tag} style={{ fontSize: 10, fontWeight: 600, letterSpacing: .5, padding: "3px 10px", borderRadius: 999, background: "rgba(120,60,200,.25)", border: "1px solid rgba(160,100,240,.35)", color: "rgba(200,170,255,.85)" }}>{tag}</span>
            ))}
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 6, maxWidth: "68%" }}>{t.today.understandYourself}</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, maxWidth: "70%", marginBottom: 16 }}>{t.today.embraceCycles}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{t.today.progress}</span>
            <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,.08)", overflow: "hidden" }}><div style={{ height: "100%", width: "20%", background: "linear-gradient(90deg, #8040c0, #d8a85f)", borderRadius: 99 }} /></div>
            <span style={{ fontSize: 12, color: "var(--gold-2)", fontWeight: 600 }}>20%</span>
          </div>
        </div>

        {/* Path steps */}
        <div style={{ ...glassCard, padding: "16px 14px", marginBottom: 14 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", marginBottom: 14 }}>{t.today.pathNodes}</p>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {PATH_STEPS.map((step, i) => (
              <div key={step.num} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                {i < PATH_STEPS.length - 1 && <div style={{ position: "absolute", top: 16, left: "50%", right: "-50%", height: 1.5, background: step.done ? "linear-gradient(90deg, var(--gold), rgba(216,168,95,.3))" : "rgba(255,255,255,.08)", zIndex: 0 }} />}
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${step.current ? "rgba(216,168,95,.9)" : step.done ? "rgba(216,168,95,.45)" : "rgba(255,255,255,.12)"}`, background: step.current ? "radial-gradient(circle at 38% 32%, rgba(216,168,95,.2), rgba(80,30,160,.8))" : step.done ? "radial-gradient(circle, rgba(216,168,95,.15), rgba(50,20,100,.7))" : "rgba(10,6,22,.8)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, boxShadow: step.current ? "0 0 12px rgba(216,168,95,.35)" : "none" }}>
                  {step.done && !step.current ? <span style={{ color: "var(--gold-2)", fontSize: 11 }}>&#10003;</span> : <span style={{ fontSize: 10, color: step.current ? "var(--text)" : "var(--muted-2)", fontWeight: step.current ? 700 : 400 }}>{step.num}</span>}
                </div>
                <p style={{ fontSize: 9.5, color: step.current ? "var(--gold-2)" : step.done ? "rgba(216,168,95,.7)" : "var(--muted-2)", marginTop: 6, textAlign: "center", fontWeight: step.current ? 600 : 400, lineHeight: 1.2 }}>{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current + Next node */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ ...glassCard, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: 1.1, color: "var(--gold)" }}>{t.today.currentNode}</p>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, rgba(120,60,200,.45), rgba(60,20,100,.6))", border: "1px solid rgba(216,168,95,.45)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(120,60,200,.35)" }}>
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--gold-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a7 7 0 1 0 11.5 11.5Z"/></svg>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--text)", lineHeight: 1.2 }}>{t.today.moonNode}</p>
            <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4, flex: 1 }}>{t.today.moonDesc}</p>
            <Link href="/today/node" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--gold-2)", fontWeight: 600, textDecoration: "none" }}>{t.today.continueLink}</Link>
          </div>
          <div style={{ ...glassCard, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8, opacity: .7 }}>
            <p style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: 1.1, color: "var(--muted)" }}>{t.today.nextNode}</p>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8a2 2 0 0 1 0 4m0 4h.01"/></svg>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--text)", lineHeight: 1.2 }}>{t.today.planetsNode}</p>
            <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4, flex: 1 }}>{t.today.planetsDesc}</p>
            <span style={{ fontSize: 12, color: "var(--muted-2)" }}>{t.today.comingSoon}</span>
          </div>
        </div>

        {/* Daily */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1.1, display: "flex", alignItems: "center", gap: 6 }}>{t.today.forToday}</p>
            <Link href="/cards" style={{ fontSize: 12, color: "var(--gold)", textDecoration: "none" }}>{t.today.seeAll}</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {DAILY.map(d => (
              <Link key={d.key} href={d.href} style={{ ...glassCard, padding: "10px 7px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none" }}>
                <p style={{ fontSize: 8.5, textTransform: "uppercase", letterSpacing: 1, color: "var(--gold)", textAlign: "center" }}>&#10022; {d.eyebrow}</p>
                <div style={{ width: "100%", aspectRatio: "1/1", position: "relative" }}><Image src={d.img} alt={d.eyebrow} fill style={{ objectFit: "contain" }} /></div>
                <p style={{ fontSize: 11, color: "var(--text)", textAlign: "center", lineHeight: 1.35, whiteSpace: "pre-line", flex: 1 }}>{d.label}</p>
                <span style={{ display: "block", textAlign: "center", width: "100%", background: d.color, borderRadius: 999, color: "#fff", fontSize: 11, fontWeight: 600, padding: "6px 0" }}>{d.btn}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ ...glassCard, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t.today.pathProgress}</p>
            <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,.08)", overflow: "hidden" }}><div style={{ height: "100%", width: "20%", background: "linear-gradient(90deg, #8040c0, #d8a85f)", borderRadius: 99 }} /></div>
          </div>
          <span style={{ fontSize: 13, color: "var(--gold-2)", fontWeight: 600 }}>20%</span>
        </div>
        <Link href="/today/star-way" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 999, background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "var(--font-serif)", letterSpacing: ".03em", textDecoration: "none", boxShadow: "0 8px 28px rgba(90,32,144,.4), inset 0 1px 0 rgba(255,255,255,.12)" }}>{t.today.continuePath}</Link>
      </div>
      <BottomNav />
    </div>
  );
}
