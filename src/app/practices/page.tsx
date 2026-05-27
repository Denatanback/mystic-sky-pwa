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
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { GuidedDailyPractice, type GuidedPracticeResult } from "@/components/practices/GuidedDailyPractice";
import {
  getTodayAffirmationRepeat,
  getTodayKey,
  getTodayPracticeReflection,
  getTodayProgress,
  isGroundingCompleted,
  markAffirmationRepeated,
  markGroundingCompleted,
  markPracticeCompleted,
  type AffirmationRepeat,
  type PracticeReflection,
} from "@/lib/progress/dailyProgress";
import { affirmationCategories, type AffirmationCategory, type AffirmationItem } from "@/lib/practices/affirmations";

type Tab = "today" | "my" | "library";
type PlanAccess = "free" | "trial" | "premium";
type ActiveAffirmation = { id: string; categoryId?: string; category: string; text: string };

const ACTIVE_AFFIRMATIONS_KEY = "eluna:activeAffirmations";

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

const secondaryButtonStyle: CSSProperties = {
  minHeight: 40,
  borderRadius: 999,
  border: "1px solid rgba(216,168,95,.28)",
  background: "rgba(216,168,95,.08)",
  color: "var(--gold-2)",
  fontSize: 12,
  fontWeight: 800,
  fontFamily: "var(--font-ui)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 14px",
  textDecoration: "none",
  cursor: "pointer",
};

function readPlan(): PlanAccess {
  if (typeof window === "undefined") return "free";
  const stored = localStorage.getItem("eluna:plan");
  if (stored === "trial") return "trial";
  if (stored === "premium") return "premium";
  return "free";
}

function hasFullAccess(plan: PlanAccess) {
  return plan === "trial" || plan === "premium";
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

function writeActiveAffirmations(items: ActiveAffirmation[]) {
  localStorage.setItem(ACTIVE_AFFIRMATIONS_KEY, JSON.stringify(items));
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

function isAffirmationRepeatedToday(item: ActiveAffirmation, repeat: AffirmationRepeat, completed: boolean) {
  if (!completed) return false;
  return repeat.text ? repeat.text === item.text : true;
}

function canOpenCategory(category: AffirmationCategory, plan: PlanAccess) {
  if (hasFullAccess(plan)) return true;
  return category.freeAccess !== "locked";
}

function canActivateAffirmation(category: AffirmationCategory, affirmation: AffirmationItem, plan: PlanAccess, index: number) {
  if (hasFullAccess(plan)) return true;
  if (category.freeAccess === "full") return true;
  if (category.freeAccess === "preview") return index < 2;
  return false;
}

export default function PracticesPage() {
  const todayKey = useMemo(() => getTodayKey(), []);
  const [tab, setTab] = useState<Tab>("today");
  const [plan, setPlan] = useState<PlanAccess>("free");
  const [affirmationCompleted, setAffirmationCompleted] = useState(false);
  const [reflectionCompleted, setReflectionCompleted] = useState(false);
  const [groundingCompleted, setGroundingCompleted] = useState(false);
  const [affirmationRepeat, setAffirmationRepeat] = useState<AffirmationRepeat>({ text: "", category: "" });
  const [activeAffirmations, setActiveAffirmations] = useState<ActiveAffirmation[]>([]);
  const [practiceReflection, setPracticeReflection] = useState<PracticeReflection>({ signalName: "", responseAction: "" });
  const [selectedCategory, setSelectedCategory] = useState<AffirmationCategory | null>(null);
  const [featureInfo, setFeatureInfo] = useState<Omit<FeatureInfoSheetProps, "onClose"> | null>(null);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);

  const activeLimit = hasFullAccess(plan) ? 3 : 1;
  const firstActiveAffirmation = activeAffirmations[0] ?? null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get("tab");
    if (initialTab === "my" || initialTab === "library" || initialTab === "today") setTab(initialTab);
    const currentProgress = getTodayProgress(todayKey);
    setPlan(readPlan());
    setAffirmationCompleted(currentProgress.affirmationCompleted);
    setReflectionCompleted(currentProgress.practiceCompleted);
    setGroundingCompleted(isGroundingCompleted(todayKey));
    setAffirmationRepeat(getTodayAffirmationRepeat(todayKey));
    setPracticeReflection(getTodayPracticeReflection(todayKey));
    setActiveAffirmations(readActiveAffirmations());
  }, [todayKey]);

  function refreshDailyState() {
    const currentProgress = getTodayProgress(todayKey);
    setAffirmationCompleted(currentProgress.affirmationCompleted);
    setReflectionCompleted(currentProgress.practiceCompleted);
    setGroundingCompleted(isGroundingCompleted(todayKey));
    setAffirmationRepeat(getTodayAffirmationRepeat(todayKey));
    setPracticeReflection(getTodayPracticeReflection(todayKey));
  }

  function openSubscription() {
    setSelectedCategory(null);
    setSubscriptionOpen(true);
  }

  function repeatAffirmation(item: ActiveAffirmation) {
    markAffirmationRepeated({ text: item.text, category: item.category }, todayKey);
    refreshDailyState();
    setFeatureInfo({
      title: "Affirmation repeated",
      description: "Your path moved forward today.",
      statusLabel: "Repeated today",
      primaryActionLabel: "Got it",
    });
  }

  function completeReflectionPractice(result: GuidedPracticeResult) {
    markPracticeCompleted(result, todayKey);
    refreshDailyState();
  }

  function completeGroundingRitual() {
    markGroundingCompleted(todayKey);
    setGroundingCompleted(true);
    setFeatureInfo({
      title: "Grounding ritual completed",
      description: "You returned to your body and cleared space for the rest of your day.",
      statusLabel: "Completed",
      primaryActionLabel: "Got it",
    });
  }

  function activateAffirmation(category: AffirmationCategory, affirmation: AffirmationItem, index: number) {
    if (!canActivateAffirmation(category, affirmation, plan, index)) {
      openSubscription();
      return;
    }

    const nextAffirmation: ActiveAffirmation = {
      id: affirmation.id,
      categoryId: category.id,
      category: category.title,
      text: affirmation.text,
    };
    const current = readActiveAffirmations();

    if (current.some((item) => item.id === nextAffirmation.id || item.text === nextAffirmation.text)) {
      setFeatureInfo({
        title: "Already active",
        description: "This affirmation is already part of your active practice set.",
        primaryActionLabel: "Got it",
      });
      return;
    }

    if (current.length >= activeLimit) {
      if (!hasFullAccess(plan)) {
        setSubscriptionOpen(true);
        return;
      }
      setFeatureInfo({
        title: "Active practice limit",
        description: "You can keep up to 3 active affirmations at a time so your daily path stays focused.",
        statusLabel: "Limit reached",
        primaryActionLabel: "Got it",
      });
      return;
    }

    const next = [...current, nextAffirmation];
    writeActiveAffirmations(next);
    setActiveAffirmations(next);
    setFeatureInfo({
      title: "Affirmation activated",
      description: "This affirmation now appears in My practices and on your daily path.",
      statusLabel: "Active",
      primaryActionLabel: "View my practices",
      primaryHref: "/practices?tab=my",
    });
  }

  function renderInfoBlock(title: string, text: string) {
    return (
      <div style={{ border: "1px solid rgba(216,168,95,.14)", borderRadius: 16, background: "rgba(255,255,255,.035)", padding: 12 }}>
        <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>{title}</p>
        <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.55 }}>{text}</p>
      </div>
    );
  }

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
            <IconSpark /> Active: {activeAffirmations.length} / {activeLimit}
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
            <section style={{ ...cardStyle, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(216,168,95,.30)", background: "rgba(216,168,95,.08)", color: "var(--gold-2)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <IconSpark />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 23, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 6 }}>Today's affirmation</h2>
                  {firstActiveAffirmation ? (
                    <>
                      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>{firstActiveAffirmation.category}</p>
                      <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.55, marginBottom: 12 }}>{firstActiveAffirmation.text}</p>
                      <button type="button" disabled={affirmationCompleted} onClick={() => repeatAffirmation(firstActiveAffirmation)} style={{ ...primaryButtonStyle, minHeight: 40, opacity: affirmationCompleted ? .75 : 1, cursor: affirmationCompleted ? "default" : "pointer" }}>
                        {affirmationCompleted ? "Repeated today" : "Repeat today"}
                      </button>
                      {affirmationCompleted && <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 700, marginTop: 9 }}>Your path moved forward today.</p>}
                    </>
                  ) : (
                    <>
                      <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 12 }}>Choose your first affirmation to anchor your energy for today.</p>
                      <button type="button" onClick={() => setTab("library")} style={{ ...primaryButtonStyle, minHeight: 40 }}>Open library</button>
                    </>
                  )}
                </div>
              </div>
            </section>

            <GuidedDailyPractice
              completed={reflectionCompleted}
              initialSignalName={practiceReflection.signalName}
              initialResponseAction={practiceReflection.responseAction}
              onComplete={completeReflectionPractice}
              variant="practices"
            />

            <section style={{ ...cardStyle, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(216,168,95,.30)", background: "rgba(216,168,95,.08)", color: "var(--gold-2)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <IconSpark />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 23, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 4 }}>Grounding ritual</h2>
                  <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>2 minutes</p>
                  <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                    {["Place both feet on the floor.", "Name three things you can see.", "Breathe out what does not belong to you."].map((step, index) => (
                      <p key={step} style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45 }}><span style={{ color: "var(--gold-2)", fontWeight: 900 }}>Step {index + 1}.</span> {step}</p>
                    ))}
                  </div>
                  <button type="button" disabled={groundingCompleted} onClick={completeGroundingRitual} style={{ ...primaryButtonStyle, minHeight: 40, opacity: groundingCompleted ? .75 : 1, cursor: groundingCompleted ? "default" : "pointer" }}>
                    {groundingCompleted ? "Completed" : "Begin ritual"}
                  </button>
                </div>
              </div>
            </section>
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
                {activeAffirmations.map((item) => {
                  const repeated = isAffirmationRepeatedToday(item, affirmationRepeat, affirmationCompleted);
                  return (
                    <div key={item.id} style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.04)", padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", marginBottom: 7 }}>
                        <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{item.category}</p>
                        <span style={{ color: repeated ? "var(--gold-2)" : "var(--muted-2)", fontSize: 11, fontWeight: 800 }}>{repeated ? "Repeated today" : "Active"}</span>
                      </div>
                      <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.55, marginBottom: 12 }}>{item.text}</p>
                      <button type="button" disabled={repeated} onClick={() => repeatAffirmation(item)} style={{ ...secondaryButtonStyle, opacity: repeated ? .75 : 1, cursor: repeated ? "default" : "pointer" }}>
                        {repeated ? "Done" : "Repeat today"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {tab === "library" && (
          <div style={{ display: "grid", gap: 12 }}>
            {affirmationCategories.map((category) => {
              const locked = !canOpenCategory(category, plan);
              const preview = !hasFullAccess(plan) && category.freeAccess === "preview";
              return (
                <button key={category.id} type="button" onClick={() => setSelectedCategory(category)} style={{ ...cardStyle, padding: 16, textAlign: "left", cursor: "pointer", fontFamily: "var(--font-ui)", opacity: locked ? .82 : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 7 }}>
                    <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{category.tag}</p>
                    <span style={{ border: "1px solid rgba(216,168,95,.24)", borderRadius: 999, color: category.premium || preview ? "var(--gold-2)" : "var(--muted-2)", background: "rgba(216,168,95,.07)", padding: "4px 8px", fontSize: 10, fontWeight: 900 }}>{locked ? "Premium" : preview ? "Preview" : "Free"}</span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 23, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 6 }}>{category.title}</h2>
                  <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>{category.description}</p>
                </button>
              );
            })}
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
          <section role="dialog" aria-modal="true" aria-labelledby="affirmation-category-title" style={{ position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "min(100vw, 430px)", maxHeight: "88dvh", overflowY: "auto", zIndex: 221, borderRadius: "24px 24px 0 0", border: "1px solid rgba(216,168,95,.24)", borderBottom: "none", background: "rgba(10,6,28,.97)", boxShadow: "0 -12px 46px rgba(0,0,0,.58)", padding: "18px 20px calc(92px + env(safe-area-inset-bottom))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>{selectedCategory.premium ? "Premium practice" : selectedCategory.freeAccess === "preview" && !hasFullAccess(plan) ? "Preview practice" : "Affirmation practice"}</p>
                <h2 id="affirmation-category-title" style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1 }}>{selectedCategory.title}</h2>
              </div>
              <button type="button" aria-label="Close" onClick={() => setSelectedCategory(null)} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.06)", color: "var(--muted-2)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>x</button>
            </div>

            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{selectedCategory.description}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginBottom: 10 }}>
              <span style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 999, color: "var(--gold-2)", background: "rgba(216,168,95,.07)", padding: "6px 10px", fontSize: 11, fontWeight: 800 }}>{selectedCategory.theme}</span>
              <span style={{ border: "1px solid rgba(160,130,220,.22)", borderRadius: 999, color: selectedCategory.premium ? "var(--gold-2)" : "var(--muted)", background: "rgba(160,100,240,.07)", padding: "6px 10px", fontSize: 11, fontWeight: 800 }}>{selectedCategory.premium ? "Premium" : "Practice"}</span>
            </div>

            <div style={{ display: "grid", gap: 9, marginBottom: 12 }}>
              {renderInfoBlock("When to use", selectedCategory.whenToUse)}
              {renderInfoBlock("Emotional benefit", selectedCategory.emotionalBenefit)}
              {(!selectedCategory.premium || hasFullAccess(plan)) && renderInfoBlock("Morning practice", selectedCategory.morningInstruction)}
              {(!selectedCategory.premium || hasFullAccess(plan)) && renderInfoBlock("Evening reflection", selectedCategory.eveningInstruction)}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase" }}>Affirmations</p>
              {selectedCategory.affirmations.map((affirmation, index) => {
                const allowed = canActivateAffirmation(selectedCategory, affirmation, plan, index);
                const active = activeAffirmations.some((item) => item.id === affirmation.id || item.text === affirmation.text);
                const repeated = activeAffirmations.some((item) => item.text === affirmation.text) && isAffirmationRepeatedToday({ id: affirmation.id, category: selectedCategory.title, text: affirmation.text }, affirmationRepeat, affirmationCompleted);
                const locked = !allowed;
                const showLockedPreview = selectedCategory.freeAccess === "locked" && index < 2;
                return (
                  <div key={affirmation.id} style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: locked ? "rgba(255,255,255,.025)" : "rgba(255,255,255,.04)", padding: 14, opacity: locked ? .72 : 1 }}>
                    <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.55, marginBottom: 12 }}>{locked && !showLockedPreview ? "Locked affirmation" : affirmation.text}</p>
                    {locked ? (
                      <button type="button" onClick={openSubscription} style={{ ...secondaryButtonStyle, width: "100%" }}>Unlock full practice library</button>
                    ) : (
                      <button type="button" disabled={active} onClick={() => activateAffirmation(selectedCategory, affirmation, index)} style={{ ...primaryButtonStyle, minHeight: 38, opacity: active ? .75 : 1, cursor: active ? "default" : "pointer" }}>
                        {repeated ? "Repeated today" : active ? "Active" : "Activate"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 12 }}>
              {renderInfoBlock("Reflection question", selectedCategory.reflectionQuestion)}
            </div>

            {!hasFullAccess(plan) && selectedCategory.freeAccess !== "full" && (
              <button type="button" onClick={openSubscription} style={{ ...primaryButtonStyle, width: "100%", marginTop: 14 }}>
                Unlock full practice library
              </button>
            )}
          </section>
        </>
      )}

      {featureInfo && <FeatureInfoSheet {...featureInfo} onClose={() => setFeatureInfo(null)} />}
      <SubscriptionModal isOpen={subscriptionOpen} onClose={() => setSubscriptionOpen(false)} contextTitle="Unlock full practice library" />
    </div>
  );
}
