"use client";
import Link from "next/link";
import { StarField } from "@/components/app-shell/StarField";
import { LangToggle } from "@/components/app-shell/LangToggle";

export default function WelcomePage() {
  return (
    <main className="app welcome-bg no-nav" style={{ padding: "0 18px 40px" }}>
      <StarField />

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* Top bar: lang toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16 }}>
          <LangToggle />
        </div>

        {/* Logo */}
        <div style={{ paddingTop: 24, textAlign: "center" }}>
          <div style={{
            fontFamily: "var(--font-serif)", fontSize: 44,
            fontWeight: 400, color: "var(--text)", letterSpacing: ".06em",
            lineHeight: 1,
          }}>
            Eluna<span style={{ color: "var(--gold-2)" }}>✦</span>
          </div>
        </div>

        {/* Moon visual */}
        <div style={{ position: "relative", height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Outer rings */}
          {[200, 160, 120].map((s, i) => (
            <div key={i} style={{
              position: "absolute", width: s, height: s, borderRadius: "50%",
              border: `1px solid rgba(216,168,95,${0.06 + i * 0.04})`,
            }} />
          ))}
          {/* Moon */}
          <div style={{
            width: 90, height: 90, borderRadius: "50%", position: "relative",
            background: "radial-gradient(circle at 38% 36%, rgba(180,130,255,.4), rgba(80,40,160,.6) 55%, rgba(20,10,50,.9))",
            border: "1px solid rgba(216,168,95,.45)",
            boxShadow: "0 0 0 14px rgba(216,168,95,.05), 0 0 0 30px rgba(131,184,207,.03), 0 0 40px rgba(140,70,220,.35)",
          }}>
            {/* Crescent overlay */}
            <div style={{
              position: "absolute", width: 72, height: 72, borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, rgba(60,20,100,.7), #07050f 70%)",
              right: -8, top: 6,
            }} />
            {/* Star on moon */}
            <div style={{
              position: "absolute", top: "28%", left: "22%",
              color: "var(--gold-2)", fontSize: 14,
              textShadow: "0 0 8px rgba(216,168,95,.8)",
            }}>✦</div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 400,
            lineHeight: 1.15, color: "var(--text)", marginBottom: 12,
          }}>
            Твой личный<br />звёздный путь
          </h1>
          <p style={{
            fontSize: 14, color: "var(--muted)", lineHeight: 1.65,
            maxWidth: 300, margin: "0 auto",
          }}>
            Ежедневные подсказки, карта неба, практики,
            ассоциативные карты и журнал наблюдений в одном пространстве.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          borderRadius: 24, border: "1px solid rgba(216,168,95,.2)",
          background: "rgba(12,10,32,.8)", backdropFilter: "blur(12px)",
          padding: "22px 20px", display: "flex", flexDirection: "column", gap: 12,
          boxShadow: "0 20px 50px rgba(0,0,0,.4)",
        }}>
          <Link href="/register" style={{
            height: 52, borderRadius: 999, display: "flex",
            alignItems: "center", justifyContent: "center", gap: 10,
            background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
            color: "#fff", fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500,
            letterSpacing: ".03em",
            boxShadow: "0 8px 28px rgba(90,32,144,.5), inset 0 1px 0 rgba(255,255,255,.12)",
            textDecoration: "none",
          }}>
            Создать аккаунт <span>→</span>
          </Link>
          <Link href="/login" style={{
            height: 48, borderRadius: 999, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "transparent", color: "var(--gold-2)",
            border: "1px solid rgba(216,168,95,.35)",
            fontSize: 15, fontWeight: 500,
            textDecoration: "none", transition: "background .2s",
          }}>
            У меня уже есть аккаунт
          </Link>
          <p style={{
            textAlign: "center", color: "var(--muted-2)",
            fontSize: 12, lineHeight: 1.4,
          }}>
            Можно продолжить как гость, но прогресс пути<br />и личные записи не будут сохранены.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16,
        }}>
          {[
            { n: "5",    label: "направлений" },
            { n: "7",    label: "минут в день" },
            { n: "∞",   label: "личный путь" },
          ].map(s => (
            <div key={s.label} style={{
              padding: "13px 8px", borderRadius: 16, textAlign: "center",
              border: "1px solid rgba(216,168,95,.12)",
              background: "rgba(12,10,30,.6)",
            }}>
              <strong style={{
                display: "block", color: "var(--gold-2)", fontSize: 22,
                fontFamily: "var(--font-serif)", fontWeight: 400,
              }}>{s.n}</strong>
              <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, display: "block" }}>{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
