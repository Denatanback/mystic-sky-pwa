"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { FeatureInfoSheet, type FeatureInfoSheetProps } from "@/components/ui/FeatureInfoSheet";
import { PlanChip } from "@/components/subscription/PlanChip";
import { ProductAccessGate } from "@/components/subscription/ProductAccessGate";
import { cleanLaunchContext, isPastLifeContext, loadLaunchContext, type LaunchContext } from "@/lib/launch/launchContext";
import { getPrelandContext, getPrelandExperience, getPrelandKind, parsePrelandContext, savePrelandContext, type PrelandContext, type PrelandExperience } from "@/lib/funnel/prelandContext";
import { DAILY_PROGRESS_UPDATED_EVENT, getCurrentStreak, getDailyActionKey, getFirstSignalState, getTodayKey, getTodayPracticeReflection, getTodayProgress, getWeeklyStreakState, isDailyActive, markAffirmationRepeated, markDailyActionCompleted, notifyDailyProgressUpdated, type DailyAction, type DailyProgress, type FirstSignalState, type PracticeReflection, type WeeklyStreakDay } from "@/lib/progress/dailyProgress";
import { getCurrentProfile } from "@/lib/profile/currentProfile";
import { getTodayDailyCard, isDailyCardRevealed, readDailyCardReflection, revealDailyCard, type DailyCard } from "@/lib/dailyCards";

type ActiveAffirmation = { id: string; categoryId?: string; category: string; text: string };
type DailyCardState = { drawn: boolean; card: DailyCard | null; reflection: string };

const cardStyle: CSSProperties = {
  border: "1px solid rgba(216,168,95,.20)",
  borderRadius: 22,
  background: "rgba(12,8,28,.62)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 14px 34px rgba(0,0,0,.24)",
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 46,
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff",
  fontSize: 14,
  fontWeight: 800,
  fontFamily: "var(--font-ui)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 18px",
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 10px 28px rgba(90,32,144,.40), inset 0 1px 0 rgba(255,255,255,.12)",
};

const homeCardIllustrationStyle: CSSProperties = {
  width: "min(100%, 124px)",
  height: 104,
  objectFit: "contain",
  alignSelf: "center",
  margin: "-4px auto 8px",
  filter: "drop-shadow(0 14px 22px rgba(90,32,144,.30)) drop-shadow(0 0 14px rgba(216,168,95,.12))",
  pointerEvents: "none",
};

const dailyCardFlipShellStyle: CSSProperties = {
  ...cardStyle,
  padding: 0,
  minHeight: 228,
  display: "block",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "var(--font-ui)",
  overflow: "hidden",
  textDecoration: "none",
  perspective: 900,
};

const dailyCardFaceStyle: CSSProperties = {
  minHeight: 228,
  padding: 14,
  display: "flex",
  flexDirection: "column",
  transformStyle: "preserve-3d",
  transition: "transform 620ms cubic-bezier(.2,.75,.2,1)",
};

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function deterministicEnergy(dayKey: string) {
  const values = ["Harmonious", "Reflective", "Focused"] as const;
  const seed = dayKey.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return values[seed % values.length];
}

function IconSpark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="m6.2 6.2 2.1 2.1" />
      <path d="m15.7 15.7 2.1 2.1" />
      <path d="m17.8 6.2-2.1 2.1" />
      <path d="m8.3 15.7-2.1 2.1" />
    </svg>
  );
}

function StreakChip({ streakDays, todayActive }: { streakDays: number; todayActive: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const popoverId = "home-streak-popover";

  const dayLabel = streakDays === 1 ? "day" : "days";
  const compactLabel = `${streakDays}d`;
  const title = "Your streak";
  const intro = streakDays === 0
    ? "Complete at least one daily action to start your streak."
    : "Complete at least one daily action to keep your streak active.";
  const status = `Current streak: ${streakDays} ${dayLabel}`;
  const hint = todayActive
    ? "Today is active. Your streak is safe."
    : "Start your streak by completing today’s practice.";

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        aria-label={`${title}: ${streakDays} ${dayLabel}`}
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen((value) => !value)}
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        style={{ height: 30, borderRadius: 999, border: "1px solid rgba(216,168,95,.26)", background: todayActive ? "rgba(216,168,95,.12)" : "rgba(255,255,255,.05)", color: "var(--gold-2)", display: "inline-flex", alignItems: "center", gap: 5, padding: "0 9px", fontSize: 11, fontWeight: 800, fontFamily: "var(--font-ui)", cursor: "pointer" }}
      >
        <IconSpark /> {compactLabel}
      </button>
      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-label={title}
          onMouseLeave={() => setOpen(false)}
          style={{ position: "absolute", right: 0, top: 38, width: 260, zIndex: 30, border: "1px solid rgba(216,168,95,.30)", borderRadius: 18, background: "rgba(10,6,28,.98)", boxShadow: "0 18px 46px rgba(0,0,0,.48), 0 0 22px rgba(128,64,192,.18)", padding: 14, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <p style={{ color: "var(--gold-2)", fontSize: 14, fontWeight: 900, marginBottom: 6 }}>{title}</p>
          <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 9 }}>{intro}</p>
          <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 800, marginBottom: 5 }}>{status}</p>
          <p style={{ color: todayActive ? "var(--gold-2)" : "var(--muted-2)", fontSize: 12, lineHeight: 1.45 }}>{hint}</p>
          <button type="button" onClick={() => setOpen(false)} style={{ marginTop: 11, height: 34, borderRadius: 999, border: "1px solid rgba(216,168,95,.28)", background: "rgba(216,168,95,.08)", color: "var(--gold-2)", padding: "0 14px", fontSize: 12, fontWeight: 900, fontFamily: "var(--font-ui)", cursor: "pointer" }}>Got it</button>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const todayKey = getTodayKey(today);
  const todayTitle = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(today);
  const [featureInfo, setFeatureInfo] = useState<Omit<FeatureInfoSheetProps, "onClose"> | null>(null);
  const [launchContext, setLaunchContext] = useState<LaunchContext>({});
  const [prelandContext, setPrelandContext] = useState<PrelandContext>({});
  const [prelandExperience, setPrelandExperience] = useState<PrelandExperience | null>(null);
  const [dailyState, setDailyState] = useState<DailyProgress>({ readingOpened: false, practiceCompleted: false, cardOpened: false, affirmationCompleted: false, completedCount: 0, totalCount: 4 });
  const [practiceReflection, setPracticeReflection] = useState<PracticeReflection>({ signalName: "", responseAction: "" });
  const [firstSignalState, setFirstSignalState] = useState<FirstSignalState>({ unlocked: false, integrated: false, reflection: "", signalName: "Attention", responseAction: "" });
  const [activeAffirmation, setActiveAffirmation] = useState<ActiveAffirmation | null>(null);
  const [dailyCardState, setDailyCardState] = useState<DailyCardState>({ drawn: false, card: null, reflection: "" });
  const [dailyCardRevealing, setDailyCardRevealing] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [profileResolved, setProfileResolved] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayActive, setTodayActive] = useState(false);
  const [weeklyStreak, setWeeklyStreak] = useState<WeeklyStreakDay[]>([]);

  const completedCount = dailyState.completedCount;
  const energy = deterministicEnergy(todayKey);
  const prelandKind = getPrelandKind(prelandContext);
  const showPrelandBlock = Boolean(prelandExperience) || isPastLifeContext(launchContext);
  const continuationTitle = prelandExperience?.title ?? "Your Past Life reading is ready";
  const continuationText = prelandExperience?.shortText ?? "We’ve prepared your first soul pattern from your quiz answers.";
  const continuationLabel = prelandExperience?.label ?? "Past-life archetype: The Hidden Pattern";
  const continuationContext = prelandKind && prelandKind !== "generic" ? prelandKind : isPastLifeContext(launchContext) ? "pastlife" : "personal";

  const calendarDays = useMemo(() => Array.from({ length: 5 }, (_, index) => addDays(today, index - 1)), [today]);

  function loadDailyCardState(seedUserId = userId): DailyCardState {
    const card = getTodayDailyCard(seedUserId, today);
    return {
      drawn: isDailyCardRevealed(card, today),
      card,
      reflection: readDailyCardReflection(todayKey),
    };
  }

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const urlContext = cleanLaunchContext({
      source: params.get("source"),
      funnel: params.get("funnel"),
      result: params.get("result"),
      gender: params.get("gender"),
      animal: params.get("animal"),
      archetype: params.get("archetype"),
      element: params.get("element"),
      answer: params.get("answer"),
      utm_source: params.get("utm_source"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_medium: params.get("utm_medium"),
      ad_id: params.get("ad_id"),
      campaign_id: params.get("campaign_id"),
    });
    const urlPreland = parsePrelandContext(params);
    const storedPreland = Object.keys(urlPreland).length > 0 ? savePrelandContext(urlPreland) : getPrelandContext();
    const storedContext = { ...loadLaunchContext(), ...urlContext };
    setLaunchContext(storedContext);
    setPrelandContext(storedPreland);
    setPrelandExperience(getPrelandExperience(storedPreland));
    function refreshProgressState() {
      setDailyState(getTodayProgress(todayKey));
      setPracticeReflection(getTodayPracticeReflection(todayKey));
      setFirstSignalState(getFirstSignalState(todayKey));
      if (profileResolved) setDailyCardState(loadDailyCardState(userId));
      setTodayActive(isDailyActive(todayKey));
      setCurrentStreak(getCurrentStreak(today));
      setWeeklyStreak(getWeeklyStreakState(today));
    }

    refreshProgressState();
    window.addEventListener(DAILY_PROGRESS_UPDATED_EVENT, refreshProgressState);
    window.addEventListener("storage", refreshProgressState);
    try {
      const activeAffirmations = JSON.parse(localStorage.getItem("eluna:activeAffirmations") || "[]");
      if (Array.isArray(activeAffirmations) && activeAffirmations[0]?.category && activeAffirmations[0]?.text) setActiveAffirmation(activeAffirmations[0]);
    } catch {
      setActiveAffirmation(null);
    }
    void getCurrentProfile().then((user) => {
      if (!cancelled) {
        const nextUserId = user?.id;
        setUserId(nextUserId);
        setProfileResolved(true);
        setDailyCardState(loadDailyCardState(nextUserId));
      }
      if (!cancelled && user && !user.onboardingCompleted) {
        router.replace("/onboarding");
        return;
      }
      if (!cancelled && user?.launchContext) {
        setLaunchContext({ ...storedContext, ...user.launchContext });
      }
    });
    return () => {
      cancelled = true;
      window.removeEventListener(DAILY_PROGRESS_UPDATED_EVENT, refreshProgressState);
      window.removeEventListener("storage", refreshProgressState);
    };
  }, [todayKey, today, router, userId, profileResolved]);

  function setDailyField(field: DailyAction, value = true) {
    if (value) {
      setDailyState(markDailyActionCompleted(field, todayKey));
    } else {
      localStorage.setItem(getDailyActionKey(field, todayKey), "false");
      setDailyState(getTodayProgress(todayKey));
      notifyDailyProgressUpdated();
    }
  }

  function repeatActiveAffirmation() {
    if (!activeAffirmation) {
      router.push("/practices?tab=library");
      return;
    }
    setDailyState(markAffirmationRepeated({ text: activeAffirmation.text, category: activeAffirmation.category }, todayKey));
    setFeatureInfo({
      title: "Affirmation repeated",
      description: "Your path moved forward today.",
      statusLabel: "Repeated today",
      primaryActionLabel: "Got it",
    });
  }

  const openComingSoon = (title: string, description: string, primaryActionLabel = "Got it") => setFeatureInfo({
    title,
    description,
    statusLabel: "Coming soon",
    primaryActionLabel,
  });

  function drawDailyCard() {
    const card = dailyCardState.card ?? getTodayDailyCard(userId, today);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) setDailyCardRevealing(true);

    window.setTimeout(() => {
      revealDailyCard(card, today);
      const cardState = loadDailyCardState(userId);
      setDailyCardState(cardState);
      setDailyCardRevealing(false);
      if (!dailyState.cardOpened) setDailyState(markDailyActionCompleted("cardOpened", todayKey));
      else setDailyState(getTodayProgress(todayKey));
    }, prefersReducedMotion ? 0 : 360);
  }

  const nextAction = !dailyState.readingOpened
    ? { label: "Open today’s reading", type: "link" as const, href: "/today", field: "readingOpened" as const }
    : !dailyState.practiceCompleted
      ? { label: "Start practice", type: "link" as const, href: "/today#practice" }
      : !dailyState.affirmationCompleted
        ? { label: "Repeat affirmation", type: "link" as const, href: "/practices?tab=today" }
      : !dailyState.cardOpened
        ? { label: "Draw daily card", type: "button" as const, action: drawDailyCard }
        : { label: "Open first signal", type: "link" as const, href: "/path" };

  return (
    <ProductAccessGate featureName="Home" description="Choose 3-day intro access or a subscription to use Home, daily progress, readings, and path actions.">
      <div className="app">
        <StarField />
        <div className="content">
        <header style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", alignItems: "center", gap: 10, minHeight: 64, padding: "18px 0 10px" }}>
          <button className="icon-btn" type="button" aria-label="Open menu" title="Menu" onClick={() => openComingSoon("eLuna menu", "This section is being prepared for the full release. For alpha, use the bottom navigation to move through your path.")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>
          </button>
          <div style={{ display: "flex", justifyContent: "center", minWidth: 0 }}>
            <Logo variant="header" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <GuideTopBarButton />
            <StreakChip streakDays={currentStreak} todayActive={todayActive} />
            <PlanChip />
            <Link href="/profile" aria-label="Open profile" title="Profile" style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(216,168,95,.36)", display: "grid", placeItems: "center", background: "rgba(255,255,255,.05)", color: "var(--gold-2)", flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </header>

        <section style={{ ...cardStyle, padding: 14, marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>Your streak</p>
              <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{todayActive ? "Today is active" : "Complete one daily action to count today"}</p>
            </div>
            <span style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800 }}>{currentStreak > 0 ? `${currentStreak} ${currentStreak === 1 ? "day" : "days"}` : "Start today"}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
            {weeklyStreak.map((day) => {
              return (
                <div key={day.dateKey} style={{ textAlign: "center", minWidth: 0 }}>
                  <p style={{ fontSize: 10, color: day.isToday ? "var(--gold-2)" : "var(--muted-2)", fontWeight: day.isToday ? 800 : 600, marginBottom: 6 }}>{day.label}</p>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", margin: "0 auto", display: "block", border: `1px solid ${day.isToday ? "rgba(216,168,95,.85)" : "rgba(255,255,255,.16)"}`, background: day.active ? "var(--gold-2)" : day.isToday ? "rgba(216,168,95,.14)" : "rgba(255,255,255,.04)", boxShadow: day.isToday ? "0 0 0 4px rgba(216,168,95,.08)" : "none" }} />
                </div>
              );
            })}
          </div>
        </section>

        {showPrelandBlock && (
          <section style={{ ...cardStyle, padding: 16, marginTop: 12, borderColor: "rgba(216,168,95,.32)", background: "rgba(60,20,100,.24)" }}>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Ready for you</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 23, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 6 }}>{continuationTitle}</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginBottom: 10 }}>{continuationText}</p>
            <div style={{ border: "1px solid rgba(216,168,95,.20)", borderRadius: 16, background: "rgba(216,168,95,.07)", padding: 12, marginBottom: 12 }}>
              <p style={{ color: "var(--gold-2)", fontSize: 12, lineHeight: 1.45, fontWeight: 900 }}>{continuationLabel}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 9 }}>
              <Link href={`/today?context=${continuationContext}`} onClick={() => setDailyField("readingOpened")} style={{ ...primaryButtonStyle, minHeight: 40, fontSize: 13 }}>{prelandKind === "soulmate" ? "Open my signal" : prelandKind === "generic" ? "Open today’s reading" : "Open my reading"}</Link>
              <Link href="/today" onClick={() => setDailyField("readingOpened")} style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800, textAlign: "center", textDecoration: "none" }}>Continue today’s path</Link>
            </div>
          </section>
        )}

        <section data-tour="home-today-card" style={{ ...cardStyle, padding: 18, marginTop: 12, borderColor: "rgba(216,168,95,.30)", background: "linear-gradient(145deg, rgba(22,13,54,.82), rgba(10,6,28,.70))" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>Guidance for today</p>
            <span style={{ fontSize: 11, color: "var(--muted-2)" }}>{todayTitle}</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--text)", lineHeight: 1.08, marginBottom: 8 }}>Notice what pulls your attention</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 14 }}>The signal that repeats today may point to your next step.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
            {["Moon phase", "Daily focus", "Energy"].map((tag) => (
              <span key={tag} style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 999, color: "var(--gold-2)", background: "rgba(216,168,95,.07)", padding: "5px 9px", fontSize: 11, fontWeight: 700 }}>{tag}</span>
            ))}
          </div>
          <Link href="/today" onClick={() => setDailyField("readingOpened")} style={{ ...primaryButtonStyle, width: "100%" }}>Open today’s reading</Link>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          <Link href="/today" onClick={() => setDailyField("readingOpened")} style={{ ...cardStyle, padding: 14, minHeight: 228, display: "flex", flexDirection: "column", textDecoration: "none", overflow: "hidden" }}>
            <img src="/assets/home/eluna-todays-reading-icon.png" alt="Today’s reading illustration" style={homeCardIllustrationStyle} draggable={false} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 21, color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>Today’s reading</h2>
            <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.45, flex: 1 }}>Open your personal insight.</p>
            <span style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800 }}>{dailyState.readingOpened ? "Opened" : "Open"}</span>
          </Link>
          {dailyCardState.drawn ? (
            <Link href="/daily-card" style={dailyCardFlipShellStyle} aria-label={`View today’s daily card: ${dailyCardState.card?.name ?? "Daily card"}`}>
              <div style={{ ...dailyCardFaceStyle, transform: "rotateY(0deg)" }}>
                <img src={dailyCardState.card?.image ?? "/assets/home/eluna-daily-card-icon.png"} alt={dailyCardState.card ? `${dailyCardState.card.name} card` : "Daily card illustration"} style={{ ...homeCardIllustrationStyle, width: "min(100%, 118px)", height: 112, filter: "drop-shadow(0 16px 24px rgba(90,32,144,.34)) drop-shadow(0 0 16px rgba(216,168,95,.16))" }} draggable={false} />
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 21, color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>Daily card</h2>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.45, flex: 1 }}>
                  {dailyCardState.card ? `${dailyCardState.card.name} · ${dailyCardState.card.tags[0]?.replace(/-/g, " ") ?? "symbol"}` : "Today’s symbol is open."}
                </p>
                <span style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800 }}>View card</span>
              </div>
            </Link>
          ) : (
            <button type="button" disabled={dailyCardRevealing} onClick={drawDailyCard} style={{ ...dailyCardFlipShellStyle, width: "100%", color: "inherit", opacity: dailyCardRevealing ? .9 : 1 }} aria-label="Reveal today’s daily card">
              <div style={{ ...dailyCardFaceStyle, transform: dailyCardRevealing ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                <img src="/assets/home/eluna-daily-card-icon.png" alt="Daily card illustration" style={{ ...homeCardIllustrationStyle, width: "min(100%, 118px)", height: 112, filter: "drop-shadow(0 16px 24px rgba(90,32,144,.34)) drop-shadow(0 0 16px rgba(216,168,95,.16))" }} draggable={false} />
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 21, color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>Daily card</h2>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.45, flex: 1 }}>Tap to reveal today’s card.</p>
                <span style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800 }}>Reveal card</span>
              </div>
            </button>
          )}
        </section>

        <section style={{ ...cardStyle, padding: 16, marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(216,168,95,.30)", background: "rgba(216,168,95,.08)", color: "var(--gold-2)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <IconSpark />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Repeat affirmation</p>
            <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 800, marginBottom: 2 }}>{dailyState.affirmationCompleted ? "Completed" : "Ready"}</p>
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.4 }}>
              {activeAffirmation ? `Active affirmation: ${activeAffirmation.category}` : "Choose your first affirmation"}
            </p>
            {activeAffirmation && <p style={{ color: "var(--text)", fontSize: 12, lineHeight: 1.45, marginTop: 5 }}>{activeAffirmation.text}</p>}
          </div>
          {activeAffirmation ? (
            <button type="button" disabled={dailyState.affirmationCompleted} onClick={repeatActiveAffirmation} style={{ ...primaryButtonStyle, minHeight: 38, fontSize: 12, padding: "0 14px", opacity: dailyState.affirmationCompleted ? .75 : 1, cursor: dailyState.affirmationCompleted ? "default" : "pointer" }}>
              {dailyState.affirmationCompleted ? "Done" : "Repeat"}
            </button>
          ) : (
            <Link href="/practices?tab=library" style={{ ...primaryButtonStyle, minHeight: 38, fontSize: 12, padding: "0 14px" }}>
              Open practices
            </Link>
          )}
        </section>

        <section style={{ marginTop: 14, overflow: "hidden" }}>
          <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
            {calendarDays.map((day) => {
              const key = getTodayKey(day);
              const isToday = key === todayKey;
              const isFuture = day > today;
              const completed = getTodayProgress(key).practiceCompleted;
              return (
                <div key={key} style={{ minWidth: 66, borderRadius: 18, border: `1px solid ${isToday ? "rgba(216,168,95,.70)" : "rgba(255,255,255,.10)"}`, background: isToday ? "rgba(216,168,95,.10)" : "rgba(255,255,255,.04)", padding: "10px 8px", textAlign: "center", opacity: isFuture ? .62 : 1 }}>
                  <p style={{ fontSize: 11, color: isToday ? "var(--gold-2)" : "var(--muted)", fontWeight: 800 }}>{new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(day)}</p>
                  <p style={{ fontSize: 18, color: "var(--text)", fontWeight: 800, marginTop: 2 }}>{new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(day)}</p>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", display: "block", margin: "6px auto 0", background: completed ? "var(--gold-2)" : "transparent" }} />
                </div>
              );
            })}
          </div>
        </section>

        <section data-tour="home-recommendations" style={{ ...cardStyle, padding: 18, marginTop: 14 }}>
          <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>{todayTitle}</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, marginBottom: 4 }}>Energy of the day</h2>
          <p style={{ color: "var(--gold-2)", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{energy}</p>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>Your first step is simple: complete one short reflection.</p>
          {dailyState.practiceCompleted ? (
            <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 16, background: "rgba(216,168,95,.08)", padding: 13 }}>
              <p style={{ color: "var(--gold-2)", fontSize: 14, fontWeight: 800 }}>{firstSignalState.integrated ? "First signal integrated" : "First signal unlocked"}</p>
              <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>Your completed practice opened the first point of your path.</p>
              {practiceReflection.signalName && <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800, marginTop: 7 }}>Signal: {practiceReflection.signalName}</p>}
              <Link href="/path" style={{ display: "inline-flex", marginTop: 10, color: "var(--gold-2)", fontSize: 12, fontWeight: 800, textDecoration: "none" }}>{firstSignalState.integrated ? "View your path →" : "Open first signal →"}</Link>
            </div>
          ) : (
            <Link href="/today#practice" style={{ ...primaryButtonStyle, width: "100%" }}>Start practice</Link>
          )}
        </section>

        <section style={{ ...cardStyle, padding: 16, marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 4 }}>Today’s progress</p>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>{completedCount}/4 completed today</p>
            </div>
            <span style={{ color: "var(--gold-2)", fontSize: 24, fontWeight: 800 }}>{completedCount}</span>
          </div>
          {[
            ["Reading", dailyState.readingOpened ? "Opened" : "Ready"],
            ["Practice", dailyState.practiceCompleted ? "Completed" : "Not started"],
            ["Affirmation", dailyState.affirmationCompleted ? "Completed" : "Ready"],
            ["Daily card", dailyState.cardOpened ? "Drawn" : "Ready"],
          ].map(([label, status]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: label === "Reading" ? "none" : "1px solid rgba(255,255,255,.06)" }}>
              <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 700 }}>{label}</span>
              <span style={{ color: status === "Not started" ? "var(--muted-2)" : "var(--gold-2)", fontSize: 12, fontWeight: 800 }}>{status}</span>
            </div>
          ))}
          {dailyState.practiceCompleted && practiceReflection.signalName && (
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>Signal: <span style={{ color: "var(--gold-2)", fontWeight: 800 }}>{practiceReflection.signalName}</span></p>
          )}
          {nextAction.type === "link" ? (
            <Link href={nextAction.href} onClick={() => { if ("field" in nextAction && nextAction.field) setDailyField(nextAction.field); }} style={{ ...primaryButtonStyle, width: "100%", marginTop: 12 }}>{nextAction.label}</Link>
          ) : (
            <button type="button" onClick={nextAction.action} style={{ ...primaryButtonStyle, width: "100%", marginTop: 12 }}>{nextAction.label}</button>
          )}
          {completedCount === 4 && (
            <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginTop: 10 }}>Today is complete. Your first path signal is unlocked.</p>
          )}
        </section>

        <section style={{ ...cardStyle, marginTop: 14, padding: 16 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--gold)", fontWeight: 800, marginBottom: 6 }}>Next unlocks</p>
          <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>Return daily to reveal more of your map.</p>
          {prelandKind === "pastlife" && (
            <p style={{ color: "var(--gold-2)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>Your first Past Life signal is open today. A deeper layer unlocks on Day 3.</p>
          )}
          {[
            ["Day 1", "First signal", firstSignalState.integrated ? "Integrated" : dailyState.practiceCompleted ? "Unlocked" : "Locked"],
            ["Day 2", "Personal card pattern", "Opens tomorrow"],
            ["Day 3", prelandKind === "pastlife" ? "Deeper past-life signal" : "Past-life signal", "Locked"],
            ["Day 5", "Relationship insight", "Locked"],
            ["Day 7", "Weekly soul report", "Locked"],
          ].map(([day, label, status]) => (
            <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: day === "Day 1" ? "none" : "1px solid rgba(255,255,255,.06)" }}>
              <span style={{ minWidth: 50, fontSize: 11, color: "var(--gold-2)", fontWeight: 800 }}>{day}</span>
              <span style={{ flex: 1, fontSize: 13, color: "var(--text)" }}>{label}</span>
              <span style={{ fontSize: 11, color: status === "Unlocked" || status === "Integrated" ? "var(--gold-2)" : "var(--muted-2)" }}>{status}</span>
            </div>
          ))}
        </section>
      </div>
        <BottomNav />
        {featureInfo && <FeatureInfoSheet {...featureInfo} onClose={() => setFeatureInfo(null)} />}
      </div>
    </ProductAccessGate>
  );
}
