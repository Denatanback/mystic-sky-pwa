"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StarField } from "@/components/app-shell/StarField";
import { saveMockUser, setMockAuthenticated } from "@/lib/mockAuth";

const STEPS = 4;

const DIRECTIONS = [
  { id: "astro",    emoji: "🌙", label: "Астрология",       sub: "карта, транзиты, ежедневный день" },
  { id: "soul",     emoji: "💫", label: "Родственная душа",  sub: "любовь, совместимость, притяжение" },
  { id: "practice", emoji: "🕯",  label: "Практики",         sub: "ритуалы, дыхание, внимание" },
  { id: "cards",    emoji: "✦",  label: "МАК-карты",         sub: "образы, вопросы, инсайты" },
];

const STEP_LABELS = ["Аккаунт", "Рождение", "Интересы", "Старт"];

function FieldWrap({ children, label, hint }: { children: React.ReactNode; label: string; hint?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label style={{ fontSize: 12, color: "var(--muted)", letterSpacing: ".04em" }}>{label}</label>
        {hint && <span style={{ fontSize: 12, color: "var(--gold)", opacity: .8, cursor: "pointer" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10,
  background: "rgba(255,255,255,.05)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-sm)",
  padding: "12px 14px",
};

const inputBase: React.CSSProperties = {
  flex: 1, background: "transparent", border: "none", outline: "none",
  color: "var(--text)", fontSize: 14, fontFamily: "var(--font-sans)",
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [selected, setSelected] = useState<string[]>(["astro", "practice"]);

  function toggleDir(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  }

  function finish() {
    saveMockUser({ name, email, birthDate, birthTime, birthTimeUnknown: timeUnknown, birthPlace, createdAt: new Date().toISOString() });
    setMockAuthenticated();
    router.push("/home");
  }

  const pageStyle: React.CSSProperties = {
    width: "min(100vw, 430px)", minHeight: "100dvh",
    position: "relative", overflow: "hidden",
    background: `
      radial-gradient(ellipse 90% 55% at 50% 0%, rgba(120,50,200,.45), transparent),
      radial-gradient(ellipse 60% 45% at 85% 30%, rgba(160,50,130,.25), transparent),
      #07050f`,
    padding: "0 18px 40px",
  };

  return (
    <main style={pageStyle}>
      <StarField />
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* nav bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18 }}>
          {step === 1 ? (
            <Link href="/welcome" style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)",
            }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
              </svg>
            </Link>
          ) : (
            <button onClick={() => setStep(s => s - 1)} style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", cursor: "pointer",
            }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
              </svg>
            </button>
          )}
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", letterSpacing: ".05em" }}>
            Eluna<span style={{ color: "var(--gold-2)" }}>✦</span>
          </span>
          <span style={{ width: 42 }} />
        </div>

        {/* stepper */}
        <div style={{ display: "flex", gap: 6, marginTop: 20, marginBottom: 32 }}>
          {STEP_LABELS.map((lbl, i) => {
            const done = i + 1 < step;
            const active = i + 1 === step;
            return (
              <div key={lbl} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{
                  height: 3, borderRadius: 99,
                  background: done || active ? "var(--gold)" : "rgba(255,255,255,.1)",
                  opacity: done ? .6 : active ? 1 : 1,
                }} />
                <span style={{
                  fontSize: 10, color: active ? "var(--gold)" : "var(--muted-2)",
                  fontWeight: active ? 600 : 400, letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}>{lbl}</span>
              </div>
            );
          })}
        </div>

        {/* === STEP 1 === */}
        {step === 1 && (
          <>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>
              Создай аккаунт
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
              Сохраним твой прогресс, карту и личные заметки.
            </p>
            <div style={{
              background: "rgba(12,10,32,.82)", border: "1px solid rgba(216,168,95,.18)",
              borderRadius: 24, backdropFilter: "blur(12px)", padding: "22px 20px",
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              <FieldWrap label="Имя">
                <div style={inputRow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Как к тебе обращаться?" style={inputBase} />
                </div>
              </FieldWrap>
              <FieldWrap label="Email">
                <div style={inputRow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                  </svg>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" style={inputBase} />
                </div>
              </FieldWrap>
              <FieldWrap label="Пароль">
                <div style={inputRow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 8 символов" style={inputBase} />
                </div>
              </FieldWrap>
              <button
                onClick={() => setStep(2)}
                style={{
                  height: 52, borderRadius: 999, marginTop: 4,
                  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
                  color: "#fff", fontSize: 16, fontWeight: 600,
                  fontFamily: "var(--font-serif)", letterSpacing: ".03em",
                  border: "none", cursor: "pointer",
                  boxShadow: "0 8px 28px rgba(90,32,144,.45), inset 0 1px 0 rgba(255,255,255,.12)",
                }}
              >
                Продолжить →
              </button>
            </div>
            <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted-2)", marginTop: 20 }}>
              Уже есть аккаунт?{" "}
              <Link href="/login" style={{ color: "var(--gold-2)", fontWeight: 500 }}>Войти</Link>
            </p>
          </>
        )}

        {/* === STEP 2 === */}
        {step === 2 && (
          <>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>
              Данные рождения
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
              Это основа для персональной карты и ежедневных подсказок.
            </p>
            <div style={{
              background: "rgba(12,10,32,.82)", border: "1px solid rgba(216,168,95,.18)",
              borderRadius: 24, backdropFilter: "blur(12px)", padding: "22px 20px",
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              <FieldWrap label="Дата рождения">
                <div style={inputRow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v4M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" />
                  </svg>
                  <input value={birthDate} onChange={e => setBirthDate(e.target.value)} placeholder="ДД.ММ.ГГГГ" style={inputBase} />
                </div>
              </FieldWrap>
              <FieldWrap label="Время рождения" hint={timeUnknown ? undefined : "Не знаю"}>
                <div style={{ ...inputRow, opacity: timeUnknown ? .45 : 1 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                  <input
                    value={birthTime} onChange={e => setBirthTime(e.target.value)}
                    placeholder="Например, 14:30" disabled={timeUnknown} style={inputBase}
                  />
                  <button
                    type="button"
                    onClick={() => setTimeUnknown(v => !v)}
                    style={{
                      flexShrink: 0, background: "none", border: "none", cursor: "pointer",
                      fontSize: 11, color: timeUnknown ? "var(--gold)" : "var(--muted-2)",
                      fontFamily: "var(--font-sans)", padding: 0,
                    }}
                  >
                    {timeUnknown ? "✓ Не знаю" : "Не знаю"}
                  </button>
                </div>
              </FieldWrap>
              <FieldWrap label="Место рождения">
                <div style={inputRow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" /><circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <input value={birthPlace} onChange={e => setBirthPlace(e.target.value)} placeholder="Город, страна" style={inputBase} />
                </div>
              </FieldWrap>
              <button
                onClick={() => setStep(3)}
                style={{
                  height: 52, borderRadius: 999, marginTop: 4,
                  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
                  color: "#fff", fontSize: 16, fontWeight: 600,
                  fontFamily: "var(--font-serif)", letterSpacing: ".03em",
                  border: "none", cursor: "pointer",
                  boxShadow: "0 8px 28px rgba(90,32,144,.45), inset 0 1px 0 rgba(255,255,255,.12)",
                }}
              >
                Продолжить →
              </button>
            </div>
          </>
        )}

        {/* === STEP 3 === */}
        {step === 3 && (
          <>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>
              Что тебе ближе?
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
              Выбери 1–2 направления. Это настроит твой первый путь.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DIRECTIONS.map(d => {
                const active = selected.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleDir(d.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "16px 18px",
                      background: active ? "rgba(128,64,192,.20)" : "rgba(255,255,255,.04)",
                      border: `1px solid ${active ? "rgba(128,64,192,.60)" : "rgba(255,255,255,.1)"}`,
                      borderRadius: "var(--radius-lg)",
                      cursor: "pointer", transition: "all .18s",
                      textAlign: "left",
                      fontFamily: "var(--font-sans)",
                      boxShadow: active ? "0 0 20px rgba(128,64,192,.15)" : "none",
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                      background: active ? "rgba(128,64,192,.25)" : "rgba(255,255,255,.05)",
                      border: `1px solid ${active ? "rgba(216,168,95,.40)" : "rgba(255,255,255,.1)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20,
                      transition: "all .18s",
                    }}>
                      {d.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: active ? "var(--text)" : "var(--muted)", marginBottom: 2 }}>{d.label}</div>
                      <div style={{ fontSize: 12, color: "var(--muted-2)" }}>{d.sub}</div>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${active ? "var(--gold)" : "rgba(255,255,255,.2)"}`,
                      background: active ? "var(--gold)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all .18s",
                    }}>
                      {active && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#07050f" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(4)}
              style={{
                width: "100%", height: 52, borderRadius: 999, marginTop: 20,
                background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
                color: "#fff", fontSize: 16, fontWeight: 600,
                fontFamily: "var(--font-serif)", letterSpacing: ".03em",
                border: "none", cursor: "pointer",
                boxShadow: "0 8px 28px rgba(90,32,144,.45), inset 0 1px 0 rgba(255,255,255,.12)",
              }}
            >
              Продолжить →
            </button>
          </>
        )}

        {/* === STEP 4 === */}
        {step === 4 && (
          <>
            {/* moon visual */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 160, position: "relative" }}>
              {[160, 120, 84].map((s, i) => (
                <div key={i} style={{
                  position: "absolute", width: s, height: s, borderRadius: "50%",
                  border: `1px solid rgba(216,168,95,${0.06 + i * 0.05})`,
                  animation: `twinkle ${3 + i}s ease-in-out infinite`,
                }} />
              ))}
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "radial-gradient(circle at 38% 36%, rgba(180,130,255,.45), rgba(80,40,160,.65) 55%, rgba(20,10,50,.95))",
                border: "2px solid rgba(216,168,95,.45)",
                boxShadow: "0 0 0 12px rgba(216,168,95,.05), 0 0 40px rgba(140,70,220,.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, color: "var(--gold-2)",
              }}>
                ✦
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>
                Твой путь готов
              </h1>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, maxWidth: 300, margin: "0 auto" }}>
                Мы собрали стартовую карту. Первый день начнётся с короткого прогноза и мягкой практики.
              </p>
            </div>

            <div style={{
              background: "rgba(12,10,32,.82)", border: "1px solid rgba(216,168,95,.18)",
              borderRadius: 24, backdropFilter: "blur(12px)", padding: "20px 20px",
              display: "flex", flexDirection: "column", gap: 12, marginBottom: 16,
            }}>
              {[
                { icon: "🌙", title: "Стартовая карта",      sub: "Создана по введённым данным" },
                { icon: "✦",  title: "Первый путь",           sub: "Интуиция и личный ритм" },
                { icon: "📓", title: "Журнал наблюдений",     sub: "Готов для первых записей" },
              ].map(item => (
                <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(216,168,95,.10)",
                    border: "1px solid rgba(216,168,95,.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 1 }}>{item.sub}</div>
                  </div>
                  <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              ))}
            </div>

            <button
              onClick={finish}
              style={{
                width: "100%", height: 56, borderRadius: 999,
                background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
                color: "#fff", fontSize: 17, fontWeight: 600,
                fontFamily: "var(--font-serif)", letterSpacing: ".04em",
                border: "none", cursor: "pointer",
                boxShadow: "0 10px 32px rgba(90,32,144,.5), inset 0 1px 0 rgba(255,255,255,.15)",
              }}
            >
              Перейти в Eluna →
            </button>
          </>
        )}

      </div>
    </main>
  );
}
