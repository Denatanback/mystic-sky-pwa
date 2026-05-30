"use client";

import Link from "next/link";
import { useState } from "react";

type PlanId = "free" | "trial_3_day_1_usd" | "premium_monthly_2999" | "premium_3_month_5999" | "premium_6_month_8999";

const SUPPORT_EMAIL = "support@myeluna.com";
const SUPPORT_MAILTO = "mailto:support@myeluna.com?subject=eLuna%20Billing%20Question";

export type SubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  contextTitle?: string;
  contextDescription?: string;
  trialCtaLabel?: string;
};

const unlocks = [
  ["Full daily reading", "Go beyond the preview with meaning, action, reflection, and tomorrow’s signal."],
  ["Deeper Sky Map nodes", "Open premium path points like Past Life, Soulmate, and advanced chart insights."],
  ["Full practice library", "Use advanced affirmations, rituals, and multi-day practice sequences."],
  ["Saved progress", "Keep your readings, reflections, daily cards, and path signals in one place."],
  ["Reports", "Unlock weekly soul reports and monthly pattern previews."],
];

const freePreview = ["Basic daily guidance preview", "1 daily card per day", "1 active affirmation", "Starter Sky Map preview"];
const trialUnlocks = ["Full daily readings", "Premium Sky Map nodes", "Full affirmation and practice library", "Past-life and relationship insights", "Weekly and monthly report previews", "Saved progress and history"];

const premiumPreviews = [
  ["Past-life signal", "See the repeating emotional pattern your path keeps returning to."],
  ["Weekly soul report", "At the end of your first week, eLuna summarizes your recurring signs, practices, and emotional themes."],
  ["Monthly soul pattern", "Your monthly report connects your readings, reflections, cards, and Sky Map progress."],
];

const plans: Array<{
  id: PlanId;
  label: string;
  badge?: string;
  price: string;
  equivalent?: string;
  valueLabel?: string;
  savingsText?: string;
  comparison?: { monthly: string; price: string; savings: string };
  billingNote?: string;
  trustNote?: string;
  description: string;
  includes: string[];
  cta: string;
}> = [
  {
    id: "trial_3_day_1_usd",
    label: "3-day trial",
    badge: "Best start",
    price: "$1.00 today",
    billingNote: "Full access for 3 days. Then $29.99/month unless canceled. Cancel anytime before day 3.",
    trustNote: "No hidden charges before your trial ends.",
    description: "Try the full eLuna experience and unlock your first deeper readings.",
    includes: ["Full daily readings", "Daily card and symbols", "Past-life signal preview", "Practices and affirmations", "Sky Map progression", "Weekly soul report preview"],
    cta: "Start 3-day trial",
  },
  {
    id: "premium_6_month_8999",
    label: "6-Month Premium",
    badge: "Maximum savings",
    price: "$89.99 every 6 months",
    equivalent: "$14.99/month equivalent",
    valueLabel: "Save 50%",
    savingsText: "Save $89.95 vs monthly",
    comparison: { monthly: "$179.94", price: "$89.99", savings: "$89.95" },
    description: "Deep transformation plan.",
    includes: ["Full daily readings", "Full practice library", "Personal chart insights", "Past-life insights", "Relationship insights", "Weekly soul reports", "Monthly soul pattern report", "Saved history and progress"],
    cta: "Choose 6 Months",
  },
  {
    id: "premium_3_month_5999",
    label: "3-Month Premium",
    badge: "Best value",
    price: "$59.99 every 3 months",
    equivalent: "$19.99/month equivalent",
    valueLabel: "Save 33%",
    savingsText: "Save $29.98 vs monthly",
    comparison: { monthly: "$89.97", price: "$59.99", savings: "$29.98" },
    description: "Best value for starting your path.",
    includes: ["Full daily readings", "Full practice library", "Personal chart insights", "Past-life insights", "Relationship insights", "Weekly soul reports", "Monthly soul pattern report", "Saved history and progress"],
    cta: "Choose 3 Months",
  },
  {
    id: "premium_monthly_2999",
    label: "Monthly Premium",
    price: "$29.99/month",
    equivalent: "Flexible monthly access",
    description: "Continue your path with deeper insights and monthly reports.",
    includes: ["Unlimited daily readings", "Full practice library", "Personal chart insights", "Past-life and relationship insights", "Weekly soul reports", "Monthly soul pattern report", "Saved history and progress"],
    cta: "Choose Monthly",
  },
  {
    id: "free",
    label: "Free",
    price: "$0",
    description: "Stay with the preview experience and keep basic daily guidance.",
    includes: ["Basic daily guidance preview", "1 daily card per day", "1 active affirmation", "Starter Sky Map preview"],
    cta: "Current plan",
  },
];

function readPlan() {
  if (typeof window === "undefined") return "free";
  const plan = localStorage.getItem("eluna:plan");
  return plan === "trial" || plan === "premium" ? plan : "free";
}

export function SubscriptionModal({ isOpen, onClose, contextTitle, contextDescription, trialCtaLabel }: SubscriptionModalProps) {
  const [notice, setNotice] = useState<"free" | "checkout-unavailable" | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const currentPlan = readPlan();
  const hasPaidAccess = currentPlan === "trial" || currentPlan === "premium";

  if (!isOpen) return null;

  function choosePlan(planId: PlanId) {
    setSelectedPlanId(planId);
    if (planId === "free") {
      localStorage.setItem("eluna:plan", "free");
      setNotice("free");
      return;
    }
    setNotice("checkout-unavailable");
  }

  const sectionStyle = {
    border: "1px solid rgba(216,168,95,.14)",
    borderRadius: 20,
    background: "rgba(255,255,255,.035)",
    padding: 14,
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(4,2,14,.68)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", zIndex: 240 }} />
      <section role="dialog" aria-modal="true" aria-labelledby="subscription-title" style={{ position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "min(100vw, 430px)", maxHeight: "92dvh", overflowY: "auto", zIndex: 241, borderRadius: "26px 26px 0 0", border: "1px solid rgba(216,168,95,.26)", borderBottom: "none", background: "rgba(10,6,28,.98)", boxShadow: "0 -16px 54px rgba(0,0,0,.62), 0 0 32px rgba(128,64,192,.16)", padding: "10px 18px calc(96px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,255,255,.12)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, marginBottom: 14 }}>
          <div>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>{contextTitle ?? "Subscription"}</p>
            <h2 id="subscription-title" style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 8 }}>{contextTitle ?? "Unlock your full eLuna path"}</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>
              {contextDescription ?? "Start with 3 days of full access for $1. Open deeper readings, premium practices, and the parts of your Sky Map that stay locked on Free."}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.06)", color: "var(--muted-2)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>×</button>
        </div>

        {notice === "free" && (
          <div style={{ border: "1px solid rgba(216,168,95,.24)", borderRadius: 18, background: "rgba(216,168,95,.08)", padding: 13, marginBottom: 12 }}>
            <p style={{ color: "var(--gold-2)", fontSize: 13, fontWeight: 800 }}>You’re staying on the Free plan.</p>
          </div>
        )}

        {notice === "checkout-unavailable" && (
          <div style={{ border: "1px solid rgba(216,168,95,.24)", borderRadius: 18, background: "rgba(216,168,95,.08)", padding: 13, marginBottom: 12 }}>
            <p style={{ color: "var(--gold-2)", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>Secure checkout is being prepared</p>
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>Payment checkout needs to be connected before this plan can be purchased.</p>
            {selectedPlanId && <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 6 }}>Selected plan: {selectedPlanId}</p>}
          </div>
        )}

        <section style={{ ...sectionStyle, marginBottom: 12 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>What you unlock today</p>
          <div style={{ display: "grid", gap: 8 }}>
            {unlocks.map(([title, text]) => (
              <div key={title} style={{ border: "1px solid rgba(216,168,95,.12)", borderRadius: 14, background: "rgba(255,255,255,.03)", padding: 10 }}>
                <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 900, marginBottom: 3 }}>{title}</p>
                <p style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.45 }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Free preview includes</p>
              {freePreview.map((item) => <p key={item} style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.45, marginTop: 5 }}>• {item}</p>)}
            </div>
            <div>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Trial unlocks</p>
              {trialUnlocks.map((item) => <p key={item} style={{ color: "var(--text)", fontSize: 11, lineHeight: 1.45, marginTop: 5 }}>• {item}</p>)}
            </div>
          </div>
        </section>

        <div style={{ display: "grid", gap: 12 }}>
          {plans.map((plan, index) => {
            const isTrial = plan.id === "trial_3_day_1_usd";
            const isFree = plan.id === "free";
            const compact = index > 0 && !isFree;
            const isSixMonth = plan.id === "premium_6_month_8999";
            const isLongPlan = plan.id === "premium_6_month_8999" || plan.id === "premium_3_month_5999";
            const borderColor = isTrial ? "rgba(216,168,95,.56)" : isSixMonth ? "rgba(247,217,139,.62)" : isLongPlan ? "rgba(216,168,95,.42)" : "rgba(216,168,95,.18)";
            const background = isTrial
              ? "linear-gradient(135deg, rgba(60,20,100,.40), rgba(216,168,95,.10))"
              : isSixMonth
                ? "linear-gradient(145deg, rgba(216,168,95,.15), rgba(80,30,140,.25), rgba(255,255,255,.04))"
                : isLongPlan
                  ? "linear-gradient(145deg, rgba(216,168,95,.10), rgba(255,255,255,.04))"
                  : "rgba(255,255,255,.04)";

            return (
              <div key={plan.id} style={{ display: "grid", gap: 8 }}>
                {index === 0 && <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", margin: "2px 0 0" }}>All plans</p>}
                {index === 1 && <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", margin: "4px 0 0" }}>Continue after trial</p>}
                <article style={{ border: `1px solid ${borderColor}`, borderRadius: isTrial || isLongPlan ? 22 : 18, background, padding: compact ? 13 : 15, boxShadow: isSixMonth ? "0 0 22px rgba(216,168,95,.14)" : isLongPlan || isTrial ? "0 0 16px rgba(216,168,95,.08)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                    <div>
                      {plan.valueLabel && <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 5 }}>{plan.valueLabel}</p>}
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: compact ? 21 : 24, fontWeight: 600, color: "var(--text)", lineHeight: 1.1 }}>{plan.label}</h3>
                      <p style={{ color: "var(--gold-2)", fontSize: compact ? 14 : 16, fontWeight: 800, marginTop: 3 }}>{plan.price}</p>
                      {plan.equivalent && <p style={{ color: "var(--muted-2)", fontSize: 12, fontWeight: 700, marginTop: 2 }}>{plan.equivalent}</p>}
                    </div>
                    {plan.badge && <span style={{ border: "1px solid rgba(216,168,95,.40)", borderRadius: 999, color: "var(--gold-2)", background: isLongPlan || isTrial ? "rgba(216,168,95,.16)" : "rgba(216,168,95,.08)", padding: "5px 9px", fontSize: 10, fontWeight: 900, boxShadow: isLongPlan ? "0 0 12px rgba(216,168,95,.16)" : "none" }}>{plan.badge}</span>}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{plan.description}</p>
                  {plan.savingsText && <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 900, marginBottom: 9 }}>{plan.savingsText}</p>}
                  {plan.comparison && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, border: "1px solid rgba(216,168,95,.18)", borderRadius: 14, background: "rgba(8,6,22,.34)", padding: "9px 8px", marginBottom: 10 }}>
                      {[
                        ["Monthly price", plan.comparison.monthly],
                        ["Your price", plan.comparison.price],
                        ["Savings", plan.comparison.savings],
                      ].map(([label, value]) => (
                        <div key={label} style={{ minWidth: 0 }}>
                          <p style={{ color: "var(--muted-2)", fontSize: 9, lineHeight: 1.2 }}>{label}</p>
                          <p style={{ color: label === "Savings" ? "var(--gold-2)" : "var(--text)", fontSize: 11, fontWeight: 900, marginTop: 3 }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {plan.billingNote && <p style={{ color: "var(--gold-2)", fontSize: 11, lineHeight: 1.45, fontWeight: 800, marginBottom: 7 }}>{plan.billingNote}</p>}
                  {plan.trustNote && <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.4, marginBottom: 10 }}>{plan.trustNote}</p>}
                  <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                    {(compact ? plan.includes.slice(0, 4) : plan.includes).map((item) => (
                      <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--text)", fontSize: 12, lineHeight: 1.35 }}>
                        <span style={{ color: "var(--gold-2)", flexShrink: 0 }}>✦</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => choosePlan(plan.id)} style={{ width: "100%", height: 44, borderRadius: 999, border: isFree ? "1px solid rgba(216,168,95,.30)" : "none", background: isFree ? "rgba(255,255,255,.05)" : "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: isFree ? "var(--gold-2)" : "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-ui)", cursor: "pointer", boxShadow: isFree ? "none" : "0 8px 24px rgba(90,32,144,.38)" }}>
                    {isFree && currentPlan === "free" ? "Current plan" : isTrial && trialCtaLabel ? trialCtaLabel : plan.cta}
                  </button>
                  {isTrial && (
                    <p style={{ color: "var(--muted-2)", fontSize: 10.5, lineHeight: 1.45, textAlign: "center", marginTop: 8 }}>
                      Trial and subscription terms are governed by{" "}
                      <Link href="/billing" target="_blank" style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none" }}>
                        Billing Terms
                      </Link>
                      .
                    </p>
                  )}
                </article>
              </div>
            );
          })}
        </div>

        <section style={{ ...sectionStyle, marginTop: 14 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>Premium previews</p>
          <div style={{ display: "grid", gap: 8 }}>
            {premiumPreviews.map(([title, text]) => (
              <div key={title} style={{ border: "1px solid rgba(216,168,95,.12)", borderRadius: 16, background: "rgba(255,255,255,.03)", padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", marginBottom: 5 }}>
                  <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 900 }}>{title}</p>
                  <span style={{ color: hasPaidAccess ? "var(--gold-2)" : "var(--muted-2)", fontSize: 10, fontWeight: 900 }}>{hasPaidAccess ? "Included" : "Locked"}</span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>
          {!hasPaidAccess && (
            <button type="button" onClick={() => choosePlan("trial_3_day_1_usd")} style={{ width: "100%", height: 42, borderRadius: 999, border: "1px solid rgba(216,168,95,.30)", background: "rgba(216,168,95,.08)", color: "var(--gold-2)", fontSize: 13, fontWeight: 900, fontFamily: "var(--font-ui)", cursor: "pointer", marginTop: 12 }}>
              Unlock with 3-day trial
            </button>
          )}
        </section>

        <section style={{ ...sectionStyle, marginTop: 14 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Why continue?</p>
          {["New daily guidance every day", "Unlock deeper parts of your Sky Map", "Build your practice streak", "Receive weekly and monthly soul reports"].map((item) => (
            <p key={item} style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45, marginTop: 5 }}>• {item}</p>
          ))}
          <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 12 }}>Your plan can be managed from your account settings.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            {[
              ["Terms of Use", "/terms"],
              ["Billing Terms", "/billing"],
              ["Money-Back Policy", "/money-back"],
              ["Privacy Policy", "/privacy"],
            ].map(([label, href]) => (
              <Link key={label} href={href} target="_blank" style={{ color: "var(--gold-2)", fontSize: 11, fontWeight: 800, textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
          <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 12 }}>
            Contact support:{" "}
            <a href={SUPPORT_MAILTO} style={{ color: "var(--gold-2)", fontWeight: 800, textDecoration: "none" }}>
              {SUPPORT_EMAIL}
            </a>
          </p>
        </section>
      </section>
    </>
  );
}
