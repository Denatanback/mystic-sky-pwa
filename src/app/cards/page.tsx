"use client";
import Link from "next/link";
import Image from "next/image";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { useLang } from "@/lib/i18n";

const glassCard: React.CSSProperties = { border: "1px solid rgba(216,168,95,.22)", background: "transparent", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", borderRadius: 20 };

export default function CardsPage() {
  const { t } = useLang();
  const SPREADS = [
    { href: "#", emblem: "/assets/sky-emblems/sky-astrology-emblem.png",  title: t.cards.oneSymbol,    sub: t.cards.oneSymbolSub,    meta: t.cards.min2 },
    { href: "#", emblem: "/assets/sky-emblems/sky-soulmate-emblem.png",   title: t.cards.relationships, sub: t.cards.relationshipsSub, meta: t.cards.min5 },
    { href: "#", emblem: "/assets/sky-emblems/sky-pastlife-emblem.png",   title: t.cards.threeCards,   sub: t.cards.threeCardsSub,   meta: t.cards.min7 },
    { href: "#", emblem: "/assets/sky-emblems/sky-numerology-emblem.png", title: t.cards.celticCross,  sub: t.cards.celticCrossSub,  meta: t.cards.min15 },
  ];
  const RECENT = [
    { name: t.cards.threshold, img: "/assets/main_screen/card-01.png",   day: t.cards.today },
    { name: t.cards.lotus,     img: "/assets/main_screen/lotus-01.png",  day: t.cards.yesterday },
    { name: t.cards.candle,    img: "/assets/main_screen/candle-01.png", day: t.cards.mon },
  ];
  return (
    <div className="app">
      <StarField />
      <div className="content">
        <header className="header">
          <div className="screen-title"><h1>{t.cards.title}</h1><p>{t.cards.subtitle}</p></div>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></button>
        </header>

        {/* Card of day hero */}
        <div style={{ ...glassCard, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", right: -10, top: -10, width: 160, height: 160, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(120,60,200,.22), transparent 65%)" }} />
          <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ flexShrink: 0, width: 88, height: 118, borderRadius: 14, border: "1px solid rgba(216,168,95,.4)", overflow: "hidden", position: "relative", background: "rgba(12,8,30,.6)", boxShadow: "0 8px 28px rgba(0,0,0,.4), 0 0 18px rgba(120,60,200,.2)" }}>
              <Image src="/assets/main_screen/card-01.png" alt="Card of the day" fill style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(10,5,30,.6))" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}><span>&#10022;</span> {t.cards.cardOfDay}</div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, lineHeight: 1.1, marginBottom: 8, color: "var(--text)" }}>{t.cards.threshold}</h2>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{t.cards.cardQuestion}</p>
            </div>
          </div>
          <div style={{ padding: "0 20px 18px" }}>
            <Link href="/journal" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 46, borderRadius: 999, background: "linear-gradient(135deg, #7030b0, #4a1880)", color: "#fff", fontSize: 14, fontWeight: 600, boxShadow: "0 6px 20px rgba(80,20,140,.4)", textDecoration: "none" }}>
              {t.cards.writeAnswer}
            </Link>
          </div>
        </div>

        {/* Recent */}
        <div style={{ marginTop: 22 }}>
          <div className="section-head"><h2>{t.cards.recent}</h2><span>{t.cards.sevenDays}</span></div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }} className="no-scrollbar">
            {RECENT.map(c => (
              <div key={c.name} style={{ flexShrink: 0, width: 72, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: 62, height: 84, borderRadius: 10, border: "1px solid rgba(216,168,95,.3)", overflow: "hidden", position: "relative", boxShadow: "0 4px 14px rgba(0,0,0,.35)" }}>
                  <Image src={c.img} alt={c.name} fill style={{ objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>{c.day}</span>
                <span style={{ fontSize: 11, color: "var(--text)", fontWeight: 500 }}>{c.name}</span>
              </div>
            ))}
            {[1,2,3,4].map(i => <div key={i} style={{ flexShrink: 0, width: 62, height: 84, borderRadius: 10, border: "1px dashed rgba(255,255,255,.1)", background: "rgba(255,255,255,.02)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "rgba(255,255,255,.15)", fontSize: 18 }}>+</span></div>)}
          </div>
        </div>

        {/* Spreads */}
        <div style={{ marginTop: 22 }}>
          <div className="section-head"><h2>{t.cards.spreads}</h2><Link href="#" style={{ color: "var(--gold)", fontSize: 13 }}>{t.cards.all}</Link></div>
          <div className="grid-2" style={{ gap: 12 }}>
            {SPREADS.map(s => (
              <Link key={s.title} href={s.href} style={{ ...glassCard, display: "flex", flexDirection: "column", padding: 14, textDecoration: "none", transition: "border-color 0.2s, transform 0.2s" }}>
                <div style={{ width: 48, height: 48, marginBottom: 10, position: "relative", flexShrink: 0, filter: "drop-shadow(0 0 8px rgba(216,168,95,.35))" }}>
                  <Image src={s.emblem} alt={s.title} fill style={{ objectFit: "contain" }} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "var(--text)" }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4, flex: 1 }}>{s.sub}</p>
                <div style={{ marginTop: 10, color: "var(--gold)", fontSize: 11, letterSpacing: "0.05em" }}>{s.meta}</div>
              </Link>
            ))}
          </div>
        </div>
        <div style={{ height: 20 }} />
      </div>
      <BottomNav />
    </div>
  );
}
