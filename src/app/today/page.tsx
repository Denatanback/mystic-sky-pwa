"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PremiumMoonPhase } from "@/components/astrology/PremiumMoonPhase";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { useLang } from "@/lib/i18n";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { FeatureInfoSheet, type FeatureInfoSheetProps } from "@/components/ui/FeatureInfoSheet";
import { PlanChip } from "@/components/subscription/PlanChip";
import { GuidedDailyPractice, type GuidedPracticeResult } from "@/components/practices/GuidedDailyPractice";
import { getTodayKey, getTodayPracticeReflection, getTodayProgress, markPracticeCompleted, type PracticeReflection } from "@/lib/progress/dailyProgress";
import { drawDailyCard, getTodayDailyCard, saveDailyCardReflection, type DailyCardState } from "@/lib/cards/dailyCardProgress";
import { getPrelandContext, getPrelandExperience, getPrelandKind, savePrelandContext, type PrelandContext, type PrelandExperience } from "@/lib/funnel/prelandContext";
import { getCurrentProfile } from "@/lib/profile/currentProfile";
import { resolveUserZodiac } from "@/lib/astrology/resolveZodiac";
import { ZODIAC } from "@/lib/astroCalc";
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

// в”Ђв”Ђ Energy bar в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function EnergyBar({ value, lang }: { value: number; lang: string }) {
  const label = lang === "ru" ? "Р­РЅРµСЂРіРёСЏ РґРЅСЏ" : "Day energy";
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

// в”Ђв”Ђ Discipline progress mini в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
const DISCIPLINES = [
  { key: "astrology",   labelRu: "РђСЃС‚СЂРѕР»РѕРіРёСЏ",        labelEn: "Astrology",         total: 8, emblem: "/assets/sky-emblems/sky-astrology-emblem.png" },
  { key: "numerology",  labelRu: "РќСѓРјРµСЂРѕР»РѕРіРёСЏ",        labelEn: "Numerology",        total: 8, emblem: "/assets/sky-emblems/sky-numerology-emblem.png" },
  { key: "humandesign", labelRu: "Р”РёР·Р°Р№РЅ С‡РµР»РѕРІРµРєР°",    labelEn: "Human Design",      total: 8, emblem: "/assets/sky-emblems/sky-humandesign-emblem.png" },
  { key: "pastlife",    labelRu: "РџСЂРѕС€Р»Р°СЏ Р¶РёР·РЅСЊ",      labelEn: "Past Life",         total: 7, emblem: "/assets/sky-emblems/sky-pastlife-emblem.png" },
  { key: "spiritual",   labelRu: "Р”СѓС…РѕРІРЅС‹Рµ РїСЂР°РєС‚РёРєРё",  labelEn: "Spiritual",         total: 7, emblem: "/assets/sky-emblems/sky-soulpractice-emblem.png" },
  { key: "soulmate",    labelRu: "Р РѕРґСЃС‚РІРµРЅРЅР°СЏ РґСѓС€Р°",   labelEn: "Soul Mate",         total: 7, emblem: "/assets/sky-emblems/sky-soulmate-emblem.png" },
];

function getDisciplineProgress(key: string, total: number): number {
  if (typeof window === "undefined") return 0;
  let done = 0;
  for (let i = 1; i <= total; i++) {
    if (getNodeState(key, i).status === "completed") done++;
  }
  return done;
}

// в”Ђв”Ђ Main page в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
export default function TodayPage() {
  const { lang } = useLang();
  const router = useRouter();
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
  const [practiceReflection, setPracticeReflection] = useState<PracticeReflection>({ signalName: "", responseAction: "" });
  const [dailyCardState, setDailyCardState] = useState<DailyCardState>({ drawn: false, card: null, reflection: "" });
  const [cardReflectionText, setCardReflectionText] = useState("");
  const [cardReflectionSaved, setCardReflectionSaved] = useState(false);
  const [prelandContext, setPrelandContext] = useState<PrelandContext>({});
  const [prelandExperience, setPrelandExperience] = useState<PrelandExperience | null>(null);
  const [featureInfo, setFeatureInfo] = useState<Omit<FeatureInfoSheetProps, "onClose"> | null>(null);
  const todayKey = getTodayKey();

  useEffect(() => {
    const now = new Date();
    const mi   = getMoonPhaseInfo(now);
    const ms   = getTodayMoonSign(now);
    const pd   = getPlanetaryDay(now);
    setMoonInfo(mi);
    setMoonSign(ms);
    setPlanetDay({ en: pd.en, ru: pd.ru, symbol: pd.symbol });
    const params = new URLSearchParams(window.location.search);
    const contextParam = params.get("context");
    const storedPreland = getPrelandContext();
    const effectivePreland = contextParam ? savePrelandContext({ ...storedPreland, source: contextParam, funnel: contextParam }) : storedPreland;
    setPrelandContext(effectivePreland);
    setPrelandExperience(getPrelandExperience(effectivePreland));

    void getCurrentProfile().then((user) => {
    if (user && !user.onboardingCompleted) {
      router.replace("/onboarding");
      return;
    }
    if (user?.fullName) setUserName(user.fullName.split(" ")[0]);

    if (user?.birthDate) {
      const birthISO = toIsoDate(user.birthDate);
      const resolvedZodiac = resolveUserZodiac(user);
      const ss = ZODIAC.find((sign) => sign.key === resolvedZodiac.key) ?? null;
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
        { key: "pisces", en: "Pisces", ru: "Р С‹Р±С‹", symbol: "в™“", element: "water", quality: "mutable", ruling: "Neptune", color: "#6070c8" },
        mi, ms, lang
      ));
    }
    });

    // discipline progress
    const prog: Record<string, number> = {};
    for (const d of DISCIPLINES) prog[d.key] = getDisciplineProgress(d.key, d.total);
    setDiscProgress(prog);
    setPracticeCompleted(getTodayProgress(todayKey).practiceCompleted);
    setPracticeReflection(getTodayPracticeReflection(todayKey));
    const cardState = getTodayDailyCard(todayKey);
    setDailyCardState(cardState);
    setCardReflectionText(cardState.reflection);
  }, [lang, todayKey, router]);

  function completePractice(result: GuidedPracticeResult) {
    markPracticeCompleted(result, todayKey);
    setPracticeCompleted(true);
    setPracticeReflection(getTodayPracticeReflection(todayKey));
  }

  function openPreparingNode() {
    setFeatureInfo({
      title: "Your next node is preparing",
      description: "Complete a few daily practices to unlock deeper questions. Your next guided node will appear as your path gathers more signals.",
      statusLabel: "Preparing",
      primaryActionLabel: "Got it",
    });
  }

  function drawTodayCard() {
    const cardState = drawDailyCard(todayKey);
    setDailyCardState(cardState);
    setCardReflectionText(cardState.reflection);
  }

  function saveCardReflection() {
    const value = saveDailyCardReflection(cardReflectionText, todayKey);
    setDailyCardState(getTodayDailyCard(todayKey));
    setCardReflectionText(value);
    setCardReflectionSaved(Boolean(value));
  }

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });

  const moonSignDesc = moonSign ? (MOON_IN_SIGN[moonSign.key]?.[lang] ?? "") : "";
  const personalDayInfo = PERSONAL_DAY[personalDay] ?? PERSONAL_DAY[1];
  const prelandKind = getPrelandKind(prelandContext);
  const showPrelandBlock = Boolean(prelandExperience);

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
              {ru ? "Р§С‚РµРЅРёРµ РґРЅСЏ" : "TodayвЂ™s reading"}
            </h1>
            {planetDay && (
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                <span style={{ color: "var(--gold)", marginRight: 6 }}>{planetDay.symbol}</span>
                {userName ? (ru ? `${userName}, ` : `${userName}, `) : ""}{ru ? `С‚РµРјР° РґРЅСЏ В· ${planetDay.ru}` : `daily theme В· ${planetDay.en}`}
              </p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GuideTopBarButton />
            <PlanChip />
          </div>
        </header>

        {/* Moon hero card */}
        <div data-tour="today-moon-card" style={{ border: "1px solid rgba(216,168,95,.25)", borderRadius: 24, background: "rgba(12,8,28,.65)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", padding: "20px 20px 18px", marginBottom: 14, overflow: "hidden", position: "relative" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ flexShrink: 0 }}>
              {moonInfo && (
                <PremiumMoonPhase
                  phaseName={moonInfo.name.en}
                  illumination={moonInfo.illumination}
                  waxing={moonInfo.phase < 0.5}
                  size="lg"
                />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>
                {ru ? "Р›СѓРЅР° СЃРµРіРѕРґРЅСЏ" : "Moon today"}
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)", lineHeight: 1.15, marginBottom: 4 }}>
                {moonInfo?.name[lang] ?? ""}{" "}
                {moonSign && <span style={{ color: "var(--gold-2)" }}>{moonSign.symbol}</span>}
              </p>
              {moonSign && (
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10 }}>
                  {ru ? `Р›СѓРЅР° РІ ${moonSign.ru} вЂ” ` : `Moon in ${moonSign.en} вЂ” `}
                  {moonSignDesc}
                </p>
              )}
              {moonInfo && <EnergyBar value={moonInfo.energy} lang={lang} />}
            </div>
          </div>

          {moonInfo && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", gap: 16 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "var(--muted-2)", marginBottom: 3 }}>{ru ? "РћСЃРІРµС‰РµРЅРёРµ" : "Illumination"}</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: "var(--gold-2)" }}>{moonInfo.illumination}%</p>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,.08)" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "var(--muted-2)", marginBottom: 3 }}>{ru ? "Р¤Р°Р·Р°" : "Phase"}</p>
                <p style={{ fontSize: 22 }}>{moonInfo.emoji}</p>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,.08)" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "var(--muted-2)", marginBottom: 3 }}>{ru ? "Р§РёСЃР»Рѕ РґРЅСЏ" : "Day number"}</p>
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
                  ? (ru ? `РџСЂРѕРіРЅРѕР· В· ${sunSign.ru}` : `Forecast В· ${sunSign.en}`)
                  : (ru ? "РџСЂРѕРіРЅРѕР· РґРЅСЏ" : "Daily forecast")}
              </p>
            </div>
            {forecast.split("\n").map((line, i) => (
              <p key={i} style={{ fontSize: i === 0 ? 13 : 14, color: i === 0 ? "var(--muted)" : "var(--text)", lineHeight: 1.6, marginBottom: i === 0 ? 6 : 0, fontStyle: i === 0 ? "normal" : "normal" }}>
                {line}
              </p>
            ))}
          </div>
        )}

        {showPrelandBlock && (
          <section style={{ border: "1px solid rgba(216,168,95,.24)", borderRadius: 22, background: "rgba(60,20,100,.20)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", padding: 16, marginBottom: 14 }}>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>{prelandKind === "soulmate" ? "Soulmate signal" : prelandKind === "pastlife" ? "Past-life signal" : "Personal signal"}</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 8 }}>{prelandExperience?.label}</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
              {prelandKind === "soulmate"
                ? "Your relationship pattern may appear today through attraction, memory, longing, or emotional repetition."
                : prelandKind === "pastlife"
                  ? "Your result points to a repeating emotional pattern. Today, notice where this pattern appears in your reactions, attachments, or choices."
                  : "Your quiz answers are now part of todayвЂ™s reading. Notice what repeats in your choices, emotions, and attention."}
            </p>
            <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.55, marginBottom: 13 }}>{prelandExperience?.todayText}</p>
            {practiceCompleted ? (
              <Link href={`/path?context=${prelandKind ?? "personal"}`} style={{ minHeight: 42, borderRadius: 999, background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-ui)", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 16px", textDecoration: "none", boxShadow: "0 8px 24px rgba(90,32,144,.36)" }}>
                Open first signal
              </Link>
            ) : (
              <a href="#practice" style={{ minHeight: 42, borderRadius: 999, background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-ui)", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 16px", textDecoration: "none", boxShadow: "0 8px 24px rgba(90,32,144,.36)" }}>
                Complete todayвЂ™s practice to open this signal
              </a>
            )}
          </section>
        )}

        <div id="practice" data-tour="today-recommended-actions" style={{ marginBottom: 14 }}>
          <GuidedDailyPractice
            completed={practiceCompleted}
            initialSignalName={practiceReflection.signalName}
            initialResponseAction={practiceReflection.responseAction}
            onComplete={completePractice}
          />
        </div>

        <section id="daily-card" style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 24, background: "linear-gradient(145deg, rgba(22,13,54,.78), rgba(10,6,28,.66))", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: 18, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>{ru ? "РљР°СЂС‚Р° РґРЅСЏ" : "TodayвЂ™s card"}</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--text)", fontWeight: 600, lineHeight: 1.08 }}>{dailyCardState.card?.title ?? (ru ? "Р’С‹С‚СЏРЅРё РєР°СЂС‚Сѓ РґРЅСЏ" : "Draw todayвЂ™s card")}</h2>
            </div>
            <div style={{ width: 46, height: 46, borderRadius: "50%", border: "1px solid rgba(216,168,95,.34)", background: "radial-gradient(circle at 35% 30%, rgba(247,217,139,.18), rgba(128,64,192,.22) 58%, rgba(10,6,28,.82))", color: "var(--gold-2)", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 21 }}>✦</div>
          </div>
          {!dailyCardState.drawn ? (
            <button
              type="button"
              onClick={drawTodayCard}
              style={{ width: "100%", minHeight: 46, borderRadius: 999, background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 14, fontWeight: 800, fontFamily: "var(--font-ui)", border: "none", cursor: "pointer", boxShadow: "0 8px 24px rgba(90,32,144,.36)", marginBottom: 0 }}
            >
              {ru ? "Р’С‹С‚СЏРЅСѓС‚СЊ РєР°СЂС‚Сѓ" : "Draw a card"}
            </button>
          ) : (
            <div>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
                Reveal today’s symbol.
              </p>
              <textarea
                value={cardReflectionText}
                onChange={(e) => setCardReflectionText(e.target.value)}
                placeholder={ru ? "РќР°РїРёС€Рё СЃРІРѕС‘ РЅР°Р±Р»СЋРґРµРЅРёРµ..." : "Write your reflection..."}
                style={{ width: "100%", minHeight: 80, background: "rgba(255,255,255,.05)", border: "1px solid rgba(216,168,95,.22)", borderRadius: 14, color: "var(--text)", fontSize: 13, fontFamily: "var(--font-ui)", padding: "10px 14px", resize: "vertical", marginBottom: 10, boxSizing: "border-box" }}
              />
              <button
                type="button"
                onClick={saveCardReflection}
                disabled={!cardReflectionText.trim() || dailyCardState.reflection === cardReflectionText.trim()}
                style={{ width: "100%", minHeight: 42, borderRadius: 999, background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-ui)", border: "none", cursor: "pointer", opacity: !cardReflectionText.trim() || dailyCardState.reflection === cardReflectionText.trim() ? .5 : 1 }}
              >
                {ru ? "РЎРѕС…СЂР°РЅРёС‚СЊ РЅР°Р±Р»СЋРґРµРЅРёРµ" : "Save reflection"}
              </button>
            </div>
          )}
        </section>

      </div>

      <BottomNav />
      {featureInfo && <FeatureInfoSheet {...featureInfo} onClose={() => setFeatureInfo(null)} />}
    </div>
  );
}
