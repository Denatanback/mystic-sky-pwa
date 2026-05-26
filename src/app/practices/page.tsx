"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { FeatureInfoSheet, type FeatureInfoSheetProps } from "@/components/ui/FeatureInfoSheet";
import { PlanChip } from "@/components/subscription/PlanChip";
import { markDailyActionCompleted } from "@/lib/progress/dailyProgress";

type Tab = "today" | "my" | "library";
type DailyPracticeKey = "affirmationCompleted" | "reflectionCompleted" | "ritualCompleted";
type ActiveAffirmation = { id: string; category: string; text: string };
type Category = {
  id: string;
  title: string;
  description: string;
  affirmations: string[];
};

const ACTIVE_AFFIRMATIONS_KEY = "eluna:activeAffirmations";
const MAX_ACTIVE_AFFIRMATIONS = 3;

const categories: Category[] = [
  {
    id: "self-worth",
    title: "Self-worth & boundaries",
    description: "Magnetic self-respect, inner support, and energetic boundaries.",
    affirmations: [
      "I honor my energy and choose what supports me.",
      "My boundaries protect the life I am building.",
      "I do not chase what is not aligned with me.",
    ],
  },
  {
    id: "love",
    title: "Love & relationships",
    description: "Warmth, attraction, emotional clarity, and trust.",
    affirmations: [
      "I welcome love that feels calm, honest, and mutual.",
      "My heart opens without abandoning myself.",
      "I attract connection that respects my truth.",
    ],
  },
  {
    id: "money",
    title: "Money & abundance",
    description: "Permission to receive, stability, and resource flow.",
    affirmations: [
      "I allow support, resources, and opportunity to reach me.",
      "My energy is worthy of stable abundance.",
      "I build safety through clear choices.",
    ],
  },
  {
    id: "body",
    title: "Body & health",
    description: "Softness, care, grounding, and body trust.",
    affirmations: [
      "My body is not an obstacle; it is my home.",
      "I return to softness without losing strength.",
      "I listen to my body with patience.",
    ],
  },
  {
    id: "protection",
    title: "Protection & grounding",
    description: "Inner strength, energetic protection, and calm.",
    affirmations: [
      "My energy is clear, grounded, and protected.",
      "I release what does not belong to me.",
      "I am safe to move at my own rhythm.",
    ],
  },
];

const cardStyle: CSSProperties = {
  border: "1px solid rgba(216,168,95,.20)",
  borderRadius: 22,
  background: "rgba(12,8,28,.62)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 14px 34px rgba(0,0,0,.24)",
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 44,
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 800,
  fontFamily: "var(--font-ui)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 16px",
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 8px 24px rgba(90,32,144,.38), inset 0 1px 0 rgba(255,255,255,.12)",
};

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dailyKey(dayKey: string, key: DailyPracticeKey) {
  return `eluna:daily:${dayKey}:${key}`;
}

function readActiveAffirmations(): ActiveAffirmation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACTIVE_AFFIRMATIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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

export default function PracticesPage() {
  const todayKey = useMemo(() => dateKey(new Date()), []);
  const [tab, setTab] = useState<Tab>("today");
  const [completed, setCompleted] = useState<Record<DailyPracticeKey, boolean>>({
    affirmationCompleted: false,
    reflectionCompleted: false,
    ritualCompleted: false,
  });
  const [activeAffirmations, setActiveAffirmations] = useState<ActiveAffirmation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [featureInfo, setFeatureInfo] = useState<Omit<FeatureInfoSheetProps, "onClose"> | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get("tab");
    if (initialTab === "my" || initialTab === "library" || initialTab === "today") setTab(initialTab);
    setCompleted({
      affirmationCompleted: localStorage.getItem(dailyKey(todayKey, "affirmationCompleted")) === "true",
      reflectionCompleted: localStorage.getItem(dailyKey(todayKey, "reflectionCompleted")) === "true",
      ritualCompleted: localStorage.getItem(dailyKey(todayKey, "ritualCompleted")) === "true",
    });
    setActiveAffirmations(readActiveAffirmations());
  }, [todayKey]);

  const activeCount = Number(completed.affirmationCompleted) + Number(completed.reflectionCompleted) + Number(completed.ritualCompleted);

  function completePractice(key: DailyPracticeKey) {
    localStorage.setItem(dailyKey(todayKey, key), "true");
    if (key === "reflectionCompleted") {
      markDailyActionCompleted("practiceCompleted", todayKey);
    }
    if (key === "affirmationCompleted") {
      markDailyActionCompleted("affirmationCompleted", todayKey);
    }
    setCompleted((current) => ({ ...current, [key]: true }));
  }

  function activateAffirmation(category: Category, text: string) {
    const nextAffirmation = { id: `${category.id}:${text}`, category: category.title, text };
    const current = readActiveAffirmations();
    if (current.some((item) => item.id === nextAffirmation.id)) {
      setFeatureInfo({
        title: "Already active",
        description: "This affirmation is already part of your active practice set.",
        primaryActionLabel: "Got it",
      });
      return;
    }
    if (current.length >= MAX_ACTIVE_AFFIRMATIONS) {
      setFeatureInfo({
        title: "Active practice limit",
        description: "You can keep up to 3 active affirmations at a time so your daily path stays focused.",
        statusLabel: "Limit reached",
        primaryActionLabel: "Got it",
      });
      return;
    }
    const next = [...current, nextAffirmation];
    localStorage.setItem(ACTIVE_AFFIRMATIONS_KEY, JSON.stringify(next));
    setActiveAffirmations(next);
    setFeatureInfo({
      title: "Affirmation activated",
      description: "This affirmation now appears in My practices.",
      statusLabel: "Active",
      primaryActionLabel: "View my practices",
      primaryHref: "/practices?tab=my",
    });
  }

  const todayCards = [
    {
      key: "affirmationCompleted" as const,
      title: "Today’s affirmation",
      text: "Repeat one phrase that anchors your energy for today.",
      cta: "Repeat affirmation",
    },
    {
      key: "reflectionCompleted" as const,
      title: "Reflection practice",
      text: "Take 3 minutes to notice the signal repeating in your day.",
      cta: "Start reflection",
    },
    {
      key: "ritualCompleted" as const,
      title: "Grounding ritual",
      text: "Return to your body before the day pulls you away.",
      cta: "Begin ritual",
    },
  ];

  return (
    <div className="app">
      <StarField />
      <div className="content">
        <header className="app-topbar">
          <div className="app-topbar__logo"><Logo variant="header" /></div>
          <div className="app-topbar__actions">
            <GuideTopBarButton />
            <PlanChip />
            <Link href="/profile" aria-label="Open profile" title="Profile" className="icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </header>

        <section style={{ marginBottom: 16 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 6 }}>Practices</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>Small daily actions that keep your path active.</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(216,168,95,.24)", borderRadius: 999, background: "rgba(216,168,95,.08)", color: "var(--gold-2)", padding: "7px 12px", fontSize: 12, fontWeight: 800, marginTop: 12 }}>
            <IconSpark /> Active: {activeCount} / 3
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
          {(["today", "my", "library"] as Tab[]).map((item) => (
            <button key={item} type="button" onClick={() => setTab(item)} style={{ height: 40, borderRadius: 999, border: `1px solid ${tab === item ? "rgba(216,168,95,.45)" : "rgba(255,255,255,.10)"}`, background: tab === item ? "rgba(216,168,95,.12)" : "rgba(255,255,255,.04)", color: tab === item ? "var(--gold-2)" : "var(--muted)", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-ui)", cursor: "pointer", textTransform: "capitalize" }}>
              {item}
            </button>
          ))}
        </div>

        {tab === "today" && (
          <div style={{ display: "grid", gap: 12 }}>
            {todayCards.map((card) => {
              const isDone = completed[card.key];
              return (
                <section key={card.key} style={{ ...cardStyle, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(216,168,95,.30)", background: "rgba(216,168,95,.08)", color: "var(--gold-2)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <IconSpark />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 23, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 6 }}>{card.title}</h2>
                      <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 12 }}>{card.text}</p>
                      <button type="button" disabled={isDone} onClick={() => completePractice(card.key)} style={{ ...primaryButtonStyle, minHeight: 40, opacity: isDone ? .75 : 1, cursor: isDone ? "default" : "pointer" }}>
                        {isDone ? "Completed" : card.cta}
                      </button>
                      {isDone && <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 700, marginTop: 9 }}>Your path moved forward today.</p>}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {tab === "my" && (
          <section style={{ ...cardStyle, padding: 18 }}>
            {activeAffirmations.length === 0 ? (
              <>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 600, color: "var(--text)", lineHeight: 1.12, marginBottom: 8 }}>Your active practices will appear here.</h2>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>Choose one affirmation from the library to begin building a focused practice set.</p>
                <button type="button" onClick={() => setTab("library")} style={primaryButtonStyle}>Open library</button>
              </>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {activeAffirmations.map((item) => (
                  <div key={item.id} style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.04)", padding: 14 }}>
                    <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>{item.category}</p>
                    <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.55 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "library" && (
          <div style={{ display: "grid", gap: 12 }}>
            {categories.map((category) => (
              <button key={category.id} type="button" onClick={() => setSelectedCategory(category)} style={{ ...cardStyle, padding: 16, textAlign: "left", cursor: "pointer", fontFamily: "var(--font-ui)" }}>
                <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Affirmation library</p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 23, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 6 }}>{category.title}</h2>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>{category.description}</p>
              </button>
            ))}
          </div>
        )}

        <section style={{ ...cardStyle, marginTop: 14, padding: 16 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--gold)", fontWeight: 800, marginBottom: 6 }}>Unlock more practices</p>
          {[
            ["Day 2", "Personal card pattern"],
            ["Day 3", "Past-life affirmation"],
            ["Day 5", "Relationship ritual"],
            ["Day 7", "Weekly soul report"],
          ].map(([day, label]) => (
            <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: day === "Day 2" ? "none" : "1px solid rgba(255,255,255,.06)" }}>
              <span style={{ minWidth: 50, fontSize: 11, color: "var(--gold-2)", fontWeight: 800 }}>{day}</span>
              <span style={{ flex: 1, fontSize: 13, color: "var(--text)" }}>{label}</span>
              <span style={{ fontSize: 11, color: "var(--muted-2)" }}>Upcoming</span>
            </div>
          ))}
        </section>
      </div>

      <BottomNav />

      {selectedCategory && (
        <>
          <div onClick={() => setSelectedCategory(null)} style={{ position: "fixed", inset: 0, background: "rgba(4,2,14,.62)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", zIndex: 220 }} />
          <section role="dialog" aria-modal="true" aria-labelledby="affirmation-category-title" style={{ position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "min(100vw, 430px)", zIndex: 221, borderRadius: "24px 24px 0 0", border: "1px solid rgba(216,168,95,.24)", borderBottom: "none", background: "rgba(10,6,28,.97)", boxShadow: "0 -12px 46px rgba(0,0,0,.58)", padding: "18px 20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Choose affirmation</p>
                <h2 id="affirmation-category-title" style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1 }}>{selectedCategory.title}</h2>
              </div>
              <button type="button" aria-label="Close" onClick={() => setSelectedCategory(null)} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.06)", color: "var(--muted-2)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>×</button>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {selectedCategory.affirmations.map((text) => (
                <div key={text} style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.04)", padding: 14 }}>
                  <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.55, marginBottom: 12 }}>{text}</p>
                  <button type="button" onClick={() => activateAffirmation(selectedCategory, text)} style={{ ...primaryButtonStyle, minHeight: 38 }}>Activate</button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {featureInfo && <FeatureInfoSheet {...featureInfo} onClose={() => setFeatureInfo(null)} />}
    </div>
  );
}
