"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { StarField } from "@/components/app-shell/StarField";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { PlanChip } from "@/components/subscription/PlanChip";
import { ProductAccessGate } from "@/components/subscription/ProductAccessGate";
import { useEntitlements } from "@/lib/subscription/entitlements";
import { getTodayKey, markDailyActionCompleted } from "@/lib/progress/dailyProgress";
import { getCurrentProfile } from "@/lib/profile/currentProfile";
import {
  deleteDailyCardReflection,
  getDailyCardReflectionEntries,
  getTodayDailyCard,
  getTodayDailyCardReflection,
  readDailyCardReflection,
  saveDailyCardReflection,
  type DailyCard,
  type DailyCardReflectionEntry,
} from "@/lib/dailyCards";

const cardStyle = {
  border: "1px solid rgba(216,168,95,.20)",
  borderRadius: 22,
  background: "rgba(12,8,28,.64)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 14px 34px rgba(0,0,0,.24)",
} as const;

const primaryButtonStyle = {
  minHeight: 46,
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff",
  fontSize: 14,
  fontWeight: 900,
  fontFamily: "var(--font-ui)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 18px",
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 10px 28px rgba(90,32,144,.40), inset 0 1px 0 rgba(255,255,255,.12)",
} as const;

function SectionBlock({ title, text }: { title: string; text: string }) {
  return (
    <section style={{ ...cardStyle, padding: 16 }}>
      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>{title}</p>
      <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.6 }}>{text}</p>
    </section>
  );
}

function getDateFromDayKey(dayKey: string) {
  return new Date(`${dayKey}T12:00:00`);
}

function formatJournalDate(entry: DailyCardReflectionEntry) {
  const date = new Date(entry.updatedAt);
  if (Number.isNaN(date.getTime())) return entry.dayKey;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getReflectionPreview(reflection: string) {
  if (!reflection.trim()) return "Saved reflection";
  return reflection.length > 82 ? `${reflection.slice(0, 79).trim()}...` : reflection;
}

export default function DailyCardPage() {
  const todayKey = getTodayKey();
  const todayDate = useMemo(() => getDateFromDayKey(todayKey), [todayKey]);
  const { entitlements, loading } = useEntitlements();
  const [card, setCard] = useState<DailyCard | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [saved, setSaved] = useState(false);
  const [journalEntries, setJournalEntries] = useState<DailyCardReflectionEntry[]>([]);

  function loadJournal() {
    setJournalEntries(getDailyCardReflectionEntries());
  }

  useEffect(() => {
    if (loading || !entitlements.hasFullAccess) return;
    markDailyActionCompleted("cardOpened", todayKey);
    void getCurrentProfile().then((user) => {
      const nextUserId = user?.id;
      const todayCard = getTodayDailyCard(nextUserId, todayDate);
      setCard(todayCard);
      setReflectionText(readDailyCardReflection(todayKey));
      loadJournal();
    });
  }, [entitlements.hasFullAccess, loading, todayDate, todayKey]);

  function saveReflection() {
    if (!card) return;
    const entry = saveDailyCardReflection(card, reflectionText, todayKey);
    if (entry) {
      setReflectionText(entry.reflection);
    }
    loadJournal();
    setSaved(true);
  }

  function deleteReflection(entryId: string) {
    if (!window.confirm("Delete this saved reflection? This will remove it from your journal, but it will not change today’s card.")) return;
    const entry = journalEntries.find((item) => item.id === entryId);
    const nextEntries = deleteDailyCardReflection(entryId);
    setJournalEntries(nextEntries);
    if (entry?.dayKey === todayKey) {
      setReflectionText("");
      setSaved(false);
    }
  }

  const todayReflection = getTodayDailyCardReflection(todayKey);

  return (
    <ProductAccessGate featureName="Daily Card" description="Choose 3-day intro access or a subscription to reveal daily cards, save reflections, and use journal actions.">
      <div className="app">
        <StarField />
        <div className="content" style={{ paddingBottom: "calc(132px + env(safe-area-inset-bottom))" }}>
        <header className="app-topbar">
          <Link href="/home" aria-label="Back home" className="icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div className="app-topbar__logo"><Logo variant="header" /></div>
          <div className="app-topbar__actions">
            <GuideTopBarButton />
            <PlanChip />
          </div>
        </header>

        {card ? (
          <div style={{ display: "grid", gap: 14, marginTop: 10 }}>
            <section style={{ ...cardStyle, padding: "20px 18px 18px", textAlign: "center", background: "radial-gradient(circle at 50% 0%, rgba(216,168,95,.13), transparent 34%), rgba(12,8,28,.68)" }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Today’s card</p>
              <img src={card.image} alt={`${card.name} card`} style={{ width: "min(76vw, 260px)", maxHeight: 360, objectFit: "contain", margin: "0 auto 16px", display: "block", filter: "drop-shadow(0 24px 34px rgba(0,0,0,.36)) drop-shadow(0 0 22px rgba(216,168,95,.15))" }} draggable={false} />
              <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 34, fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>{card.name}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 7 }}>
                {card.tags.map((tag) => (
                  <span key={tag} style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 999, color: "var(--gold-2)", background: "rgba(216,168,95,.07)", padding: "5px 9px", fontSize: 11, fontWeight: 800 }}>{tag.replace(/-/g, " ")}</span>
                ))}
              </div>
            </section>

            <SectionBlock title="Meaning" text={card.meaning} />
            <SectionBlock title="Action" text={card.action} />
            <SectionBlock title="Reflection question" text={card.reflectionQuestion} />

            <section style={{ ...cardStyle, padding: 16 }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Your reflection</p>
              <textarea
                value={reflectionText}
                onChange={(event) => {
                  setReflectionText(event.target.value);
                  setSaved(false);
                }}
                placeholder="What did this card mirror today?"
                style={{ width: "100%", minHeight: 120, borderRadius: 16, border: "1px solid rgba(216,168,95,.20)", background: "rgba(255,255,255,.05)", color: "var(--text)", fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.5, padding: 12, resize: "vertical", outline: "none", marginBottom: 12 }}
              />
              <button type="button" onClick={saveReflection} style={{ ...primaryButtonStyle, width: "100%" }}>Save reflection</button>
              {(saved || todayReflection) && <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800, marginTop: 10 }}>Reflection saved for today.</p>}
            </section>

            <section style={{ ...cardStyle, padding: 16 }}>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Daily Card Journal</p>
              {journalEntries.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>Your saved card reflections will appear here after you save them.</p>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {journalEntries.map((entry) => (
                    <details key={entry.id} style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, background: "rgba(255,255,255,.03)", overflow: "hidden" }}>
                      <summary style={{ listStyle: "none", cursor: "pointer", padding: 12, display: "grid", gap: 7 }}>
                        <span style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                          <span style={{ color: "var(--gold-2)", fontSize: 11, fontWeight: 900 }}>{entry.dayKey} · {entry.cardTags[0]?.replace(/-/g, " ") ?? "daily card"}</span>
                          <span aria-hidden="true" style={{ color: "var(--muted-2)", fontSize: 15, lineHeight: 1 }}>v</span>
                        </span>
                        <span style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.35 }}>{entry.cardName}</span>
                        <span style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45 }}>{getReflectionPreview(entry.reflection)}</span>
                      </summary>
                      <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", padding: 12, display: "grid", gap: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "76px 1fr", gap: 12, alignItems: "center" }}>
                          <img src={entry.cardImage} alt={`${entry.cardName} card`} style={{ width: 76, height: 104, objectFit: "contain", filter: "drop-shadow(0 12px 18px rgba(0,0,0,.32))" }} draggable={false} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ color: "var(--text)", fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.1, fontWeight: 600, marginBottom: 7 }}>{entry.cardName}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {entry.cardTags.map((tag) => (
                                <span key={tag} style={{ border: "1px solid rgba(216,168,95,.18)", borderRadius: 999, color: "var(--gold-2)", background: "rgba(216,168,95,.06)", padding: "4px 8px", fontSize: 10, fontWeight: 800 }}>{tag.replace(/-/g, " ")}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <SectionBlock title="Meaning" text={entry.meaning} />
                        <SectionBlock title="Action" text={entry.action} />
                        <SectionBlock title="Reflection question" text={entry.reflectionQuestion} />
                        <div style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 16, background: "rgba(216,168,95,.055)", padding: 12 }}>
                          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Saved reflection</p>
                          <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{entry.reflection}</p>
                          <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 8 }}>Updated {formatJournalDate(entry)}</p>
                        </div>
                        <button type="button" onClick={() => deleteReflection(entry.id)} style={{ justifySelf: "start", border: "1px solid rgba(216,168,95,.20)", borderRadius: 999, background: "rgba(216,168,95,.06)", color: "var(--muted)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 800, padding: "8px 12px", cursor: "pointer" }}>
                          Delete reflection
                        </button>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </section>

            <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, textAlign: "center" }}>Daily cards offer symbolic guidance for self-reflection and entertainment. They are not guaranteed predictions or professional advice.</p>
          </div>
        ) : (
          <section style={{ ...cardStyle, padding: "22px 20px", marginTop: 10 }}>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Daily card</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>Preparing today’s card...</h1>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>Your card will appear in a moment.</p>
          </section>
        )}
      </div>
        <BottomNav />
      </div>
    </ProductAccessGate>
  );
}
