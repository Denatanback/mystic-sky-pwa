"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { useLang } from "@/lib/i18n";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { FeatureInfoSheet, type FeatureInfoSheetProps } from "@/components/ui/FeatureInfoSheet";
import { getCurrentUser } from "@/lib/auth/authAdapter";
import { getSunSign } from "@/lib/astroCalc";
import { lifePathNumber } from "@/lib/numerologyCalc";
import {
  getMoonPhaseInfo, getTodayMoonSign, getPlanetaryDay,
  getPersonalDayNumber, getDailyForecast, MOON_IN_SIGN, PERSONAL_DAY,
  MoonPhaseInfo,
} from "@/lib/dailyCalc";
import { ZodiacSign } from "@/lib/astroCalc";
import { getNodeState } from "@/lib/nodeProgress";

function toIsoDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [day, month, year] = value.split(".");
  return day && month && year ? `${year}-${month}-${day}` : value;
}

function toDottedDate(value: string) {
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return value;
  const [year, month, day] = value.split("-");
  return day && month && year ? `${day}.${month}.${year}` : value;
}

// ── Moon SVG visual ───────────────────────────────────────────────────────────
function MoonVisual({ phase }: { phase: number }) {
  // phase 0 = new, 0.5 = full
  // We draw a circle with a dynamic crescent/full shape
  const isWaxing = phase < 0.5;
  const phasePct = phase < 0.5 ? phase * 2 : (1 - phase) * 2; // 0-1 within half
  const cx = 60, cy = 60, r = 46;
  // The "cover" disc shifts from fully covering (new) to uncovering (full)
  const coverX = isWaxing
    ? cx - r + phasePct * r * 2
    : cx - r + phasePct * r * 2;
  const coverRx = r * Math.abs(1 - phasePct * 2 + 0.01);

  const glowOpacity = 0.15 + phase * (phase < 0.5 ? phase : 1 - phase) * 0.8;

  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      <defs>
        <radialGradient id="moonGrad" cx="38%" cy="32%" r="60%">
          <stop offset="0%" stopColor="rgba(220,190,130,.9)" />
          <stop offset="60%" stopColor="rgba(160,120,80,.7)" />
          <stop offset="100%" stopColor="rgba(60,30,100,.8)" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(216,168,95,.35)" />
          <stop offset="100%" stopColor="rgba(216,168,95,0)" />
        </radialGradient>
        <clipPath id="moonClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {/* Glow */}
      <circle cx={cx} cy={cy} r={r + 18} fill="url(#glowGrad)" opacity={glowOpacity} />
      {/* Moon body */}
      <circle cx={cx} cy={cy} r={r} fill="url(#moonGrad)" />
      {/* Shadow overlay for crescent */}
      <g clipPath="url(#moonClip)">
        <ellipse
          cx={coverX}
          cy={cy}
          rx={Math.max(coverRx, 0.5)}
          ry={r}
          fill="rgba(8,4,22,.9)"
        />
      </g>
      {/* Subtle crater dots */}
      {[{x:52,y:48,r:4},{x:68,y:62,r:2.5},{x:44,y:66,r:3}].map((c,i) => (
        <circle key={i} cx={c.x} cy={c.y} r={c.r} fill="rgba(0,0,0,.18)" clipPath="url(#moonClip)" />
      ))}
    </svg>
  );
}

// ── Energy bar ────────────────────────────────────────────────────────────────
function EnergyBar({ value, lang }: { value: number; lang: string }) {
  const label = lang === "ru" ? "Энергия дня" : "Day energy";
  const color = value > 80 ? "#d8a85f" : value > 55 ? "#8040c0" : "#4a6080";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)" }}>
        <span>{label}</span>
        <span style={{ color: "var(--gold-2)", fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: value + "%", background: color, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

// ── Discipline progress mini ──────────────────────────────────────────────────
const DISCIPLINES = [
  { key: "astrology",   labelRu: "Астрология",        labelEn: "Astrology",         total: 8, emblem: "/assets/sky-emblems/sky-astrology-emblem.png" },
  { key: "numerology",  labelRu: "Нумерология",        labelEn: "Numerology",        total: 8, emblem: "/assets/sky-emblems/sky-numerology-emblem.png" },
  { key: "humandesign", labelRu: "Дизайн человека",    labelEn: "Human Design",      total: 8, emblem: "/assets/sky-emblems/sky-humandesign-emblem.png" },
  { key: "pastlife",    labelRu: "Прошлая жизнь",      labelEn: "Past Life",         total: 7, emblem: "/assets/sky-emblems/sky-pastlife-emblem.png" },
  { key: "spiritual",   labelRu: "Духовные практики",  labelEn: "Spiritual",         total: 7, emblem: "/assets/sky-emblems/sky-soulpractice-emblem.png" },
  { key: "soulmate",    labelRu: "Родственная душа",   labelEn: "Soul Mate",         total: 7, emblem: "/assets/sky-emblems/sky-soulmate-emblem.png" },
];

function getDisciplineProgress(key: string, total: number): number {
  if (typeof window === "undefined") return 0;
  let done = 0;
  for (let i = 1; i <= total; i++) {
    if (getNodeState(key, i).status === "completed") done++;
  }
  return done;
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TodayPage() {
  const { lang } = useLang();
  const ru = lang === "ru";

  const [moonInfo, setMoonInfo]         = useState<MoonPhaseInfo | null>(null);
  const [moonSign, setMoonSign]         = useState<ZodiacSign | null>(null);
  const [sunSign, setSunSign]           = useState<ZodiacSign | null>(null);
  const [forecast, setForecast]         = useState<string>("");
  const [personalDay, setPersonalDay]   = useState<number>(1);
  const [planetDay, setPlanetDay]       = useState<{ en: string; ru: string; symbol: string } | null>(null);
  const [userName, setUserName]         = useState<string>("");
  const [lifePathNum, setLifePathNum]   = useState<number | null>(null);
  const [discProgress, setDiscProgress] = useState<Record<string, number>>({});
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [featureInfo, setFeatureInfo] = useState<Omit<FeatureInfoSheetProps, "onClose"> | null>(null);
  const practiceKey = `eluna:daily-practice:${new Date().toISOString().slice(0, 10)}`;

  useEffect(() => {
    const now = new Date();
    const mi   = getMoonPhaseInfo(now);
    const ms   = getTodayMoonSign(now);
    const pd   = getPlanetaryDay(now);
    setMoonInfo(mi);
    setMoonSign(ms);
    setPlanetDay({ en: pd.en, ru: pd.ru, symbol: pd.symbol });

    void getCurrentUser().then((user) => {
    if (user?.name) setUserName(user.name.split(" ")[0]);

    if (user?.birthDate) {
      const birthISO = toIsoDate(user.birthDate);
      const ss = getSunSign(birthISO);
      if (ss) {
        setSunSign(ss);
        setForecast(getDailyForecast(ss, mi, ms, lang));
        const pdn = getPersonalDayNumber(now, toDottedDate(user.birthDate));
        setPersonalDay(pdn);
        const lp = lifePathNumber(birthISO);
        setLifePathNum(lp.result);
      }
    } else {
      setForecast(getDailyForecast(
        { key: "pisces", en: "Pisces", ru: "Рыбы", symbol: "♓", element: "water", quality: "mutable", ruling: "Neptune", color: "#6070c8" },
        mi, ms, lang
      ));
    }
    });

    // discipline progress
    const prog: Record<string, number> = {};
    for (const d of DISCIPLINES) prog[d.key] = getDisciplineProgress(d.key, d.total);
    setDiscProgress(prog);
    setPracticeCompleted(localStorage.getItem(practiceKey) === "completed");
  }, [lang, practiceKey]);

  function completePractice() {
    localStorage.setItem(practiceKey, "completed");
    setPracticeCompleted(true);
  }

  function openPreparingNode() {
    setFeatureInfo({
      title: "Your next node is preparing",
      description: "Complete a few daily practices to unlock deeper questions. Your next guided node will appear as your path gathers more signals.",
      statusLabel: "Preparing",
      primaryActionLabel: "Got it",
    });
  }

  const today = new Date();
  const dateLabel = today.toLocaleDateString(ru ? "ru-RU" : "en-US", { weekday: "long", day: "numeric", month: "long" });

  const moonSignDesc = moonSign ? (MOON_IN_SIGN[moonSign.key]?.[lang] ?? "") : "";
  const personalDayInfo = PERSONAL_DAY[personalDay] ?? PERSONAL_DAY[1];

  // Total progress across all disciplines
  const totalNodes = DISCIPLINES.reduce((s, d) => s + d.total, 0);
  const totalDone  = Object.values(discProgress).reduce((s, v) => s + v, 0);
  const overallPct = totalNodes > 0 ? Math.round((totalDone / totalNodes) * 100) : 0;

  return (
    <div className="app">
      <StarField />
      <div className="content">

        {/* Header */}
        <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 12, color: "var(--muted)", textTransform: "capitalize", marginBottom: 2 }}>{dateLabel}</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: "var(--text)", lineHeight: 1.1 }}>
              {ru ? "Чтение дня" : "Today’s reading"}
            </h1>
            {planetDay && (
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                <span style={{ color: "var(--gold)", marginRight: 6 }}>{planetDay.symbol}</span>
                {userName ? (ru ? `${userName}, ` : `${userName}, `) : ""}{ru ? `тема дня · ${planetDay.ru}` : `daily theme · ${planetDay.en}`}
              </p>
            )}
          </div>
          <GuideTopBarButton />
        </header>

        {/* Moon hero card */}
        <div data-tour="today-moon-card" style={{ border: "1px solid rgba(216,168,95,.25)", borderRadius: 24, background: "rgba(12,8,28,.65)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", padding: "20px 20px 18px", marginBottom: 14, overflow: "hidden", position: "relative" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ flexShrink: 0 }}>
              {moonInfo && <MoonVisual phase={moonInfo.phase} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>
                {ru ? "Луна сегодня" : "Moon today"}
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)", lineHeight: 1.15, marginBottom: 4 }}>
                {moonInfo?.name[lang] ?? ""}{" "}
                {moonSign && <span style={{ color: "var(--gold-2)" }}>{moonSign.symbol}</span>}
              </p>
              {moonSign && (
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10 }}>
                  {ru ? `Луна в ${moonSign.ru} — ` : `Moon in ${moonSign.en} — `}
                  {moonSignDesc}
                </p>
              )}
              {moonInfo && <EnergyBar value={moonInfo.energy} lang={lang} />}
            </div>
          </div>

          {moonInfo && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", gap: 16 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "var(--muted-2)", marginBottom: 3 }}>{ru ? "Освещение" : "Illumination"}</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: "var(--gold-2)" }}>{moonInfo.illumination}%</p>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,.08)" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "var(--muted-2)", marginBottom: 3 }}>{ru ? "Фаза" : "Phase"}</p>
                <p style={{ fontSize: 22 }}>{moonInfo.emoji}</p>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,.08)" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "var(--muted-2)", marginBottom: 3 }}>{ru ? "Число дня" : "Day number"}</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: "var(--gold-2)" }}>{personalDay}</p>
              </div>
            </div>
          )}
        </div>

        {/* Personal forecast */}
        {forecast && (
          <div style={{ border: "1px solid rgba(160,130,220,.25)", borderRadius: 20, background: "rgba(60,20,100,.18)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", padding: "16px 18px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              {sunSign && (
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: sunSign.color + "33", border: "1px solid " + sunSign.color + "66", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {sunSign.symbol}
                </div>
              )}
              <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
                {sunSign
                  ? (ru ? `Прогноз · ${sunSign.ru}` : `Forecast · ${sunSign.en}`)
                  : (ru ? "Прогноз дня" : "Daily forecast")}
              </p>
            </div>
            {forecast.split("\n").map((line, i) => (
              <p key={i} style={{ fontSize: i === 0 ? 13 : 14, color: i === 0 ? "var(--muted)" : "var(--text)", lineHeight: 1.6, marginBottom: i === 0 ? 6 : 0, fontStyle: i === 0 ? "normal" : "normal" }}>
                {line}
              </p>
            ))}
          </div>
        )}

        <div data-tour="today-recommended-actions" style={{ border: "1px solid rgba(216,168,95,.26)", borderRadius: 22, background: "rgba(12,8,28,.70)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", padding: "18px 18px", marginBottom: 14, boxShadow: "0 16px 38px rgba(0,0,0,.28)" }}>
          <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>
            {ru ? "Практика дня" : "Today’s practice"}
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 8 }}>
            {ru ? "Заметь главный сигнал дня" : "Notice the signal that appears most often"}
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>
            {ru ? "Удели 3 минуты тому, какой образ, чувство или повторяющаяся мысль чаще всего возвращается сегодня." : "Take 3 minutes to reflect on the signal that appears most often in your day."}
          </p>
          {practiceCompleted ? (
            <div style={{ border: "1px solid rgba(216,168,95,.20)", borderRadius: 18, background: "rgba(216,168,95,.08)", padding: 14 }}>
              <p style={{ fontSize: 14, color: "var(--gold-2)", fontWeight: 800, marginBottom: 4 }}>{ru ? "Практика завершена" : "Practice completed"}</p>
              <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55 }}>{ru ? "Возвращайся завтра, чтобы раскрыть следующий сигнал." : "Come back tomorrow to reveal your next signal."}</p>
              <button type="button" onClick={openPreparingNode} style={{ marginTop: 12, border: "1px solid rgba(255,255,255,.14)", borderRadius: 999, background: "rgba(255,255,255,.05)", color: "var(--text)", height: 40, padding: "0 16px", fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {ru ? "Что дальше?" : "What’s next?"}
              </button>
            </div>
          ) : (
            <button type="button" onClick={completePractice} style={{ width: "100%", height: 50, border: "none", borderRadius: 999, background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 14, fontWeight: 800, fontFamily: "var(--font-ui)", cursor: "pointer", boxShadow: "0 10px 28px rgba(90,32,144,.42), inset 0 1px 0 rgba(255,255,255,.12)" }}>
              {ru ? "Завершить практику дня" : "Complete today’s practice"}
            </button>
          )}
        </div>

        {/* Personal day number */}
        <div style={{ border: "1px solid rgba(216,168,95,.18)", borderRadius: 20, background: "rgba(14,10,32,.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, rgba(216,168,95,.25), rgba(80,30,160,.6))", border: "1px solid rgba(216,168,95,.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 18px rgba(216,168,95,.2)" }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 26, fontWeight: 800, color: "var(--gold-2)" }}>{personalDay}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>
              {ru ? "Личное число дня" : "Personal day number"}
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{personalDayInfo.theme[lang]}</p>
            <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{personalDayInfo.tip[lang]}</p>
          </div>
          {lifePathNum && (
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontSize: 9, color: "var(--muted-2)", marginBottom: 2 }}>{ru ? "Путь" : "Path"}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--muted)" }}>{lifePathNum}</p>
            </div>
          )}
        </div>

        {/* Overall path progress */}
        <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, background: "rgba(12,8,28,.5)", backdropFilter: "blur(8px)", padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase" }}>
              {ru ? "Карта неба — прогресс" : "Sky map progress"}
            </p>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gold-2)" }}>{overallPct}%</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DISCIPLINES.map(d => {
              const done  = discProgress[d.key] ?? 0;
              const total = d.total;
              const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
              const label = ru ? d.labelRu : d.labelEn;
              return (
                <Link key={d.key} href={"/sky/" + d.key} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, position: "relative", background: "rgba(216,168,95,.08)", border: "1px solid rgba(216,168,95,.2)" }}>
                    <Image src={d.emblem} alt={label} fill style={{ objectFit: "contain", padding: 4 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: done > 0 ? "var(--text)" : "var(--muted)" }}>{label}</span>
                      <span style={{ fontSize: 11, color: "var(--muted-2)" }}>{done}/{total}</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,.08)" }}>
                      <div style={{ height: "100%", width: pct + "%", borderRadius: 99, background: done === 0 ? "rgba(255,255,255,.15)" : "linear-gradient(90deg,#8040c0,#d8a85f)", transition: "width .8s ease" }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <Link href="/sky" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 46, borderRadius: 999, border: "1px solid rgba(216,168,95,.26)", background: "rgba(255,255,255,.04)", color: "var(--gold-2)", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-ui)", letterSpacing: ".02em", textDecoration: "none", marginBottom: 4 }}>
          {ru ? "Открыть карту неба" : "Open sky map"} &#8594;
        </Link>

      </div>
      <BottomNav />
      {featureInfo && <FeatureInfoSheet {...featureInfo} onClose={() => setFeatureInfo(null)} />}
    </div>
  );
}
