"use client";

import { useState } from "react";

type PlanId = "free" | "trial_3_day_1_usd" | "premium_monthly_2999" | "premium_3_month_5999" | "premium_6_month_8999";

const SUPPORT_EMAIL = "support@myeluna.com";
const SUPPORT_MAILTO = "mailto:support@myeluna.com?subject=eLuna%20Support%20Request";

export type SubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  contextTitle?: string;
};

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
  description: string;
  includes: string[];
  cta: string;
}> = [
  {
    id: "trial_3_day_1_usd",
    label: "3-day trial",
    badge: "Best start",
    price: "$1.00 today",
    billingNote: "Full access for 3 days. Then $29.99/month unless canceled.",
    description: "Try the full eLuna experience and unlock your first deeper readings.",
    includes: ["Full daily readings", "Daily card and symbols", "Past-life signal preview", "Practices and affirmations", "Sky Map progression", "Weekly soul report preview"],
    cta: "Start 3-day trial",
  },
  {
    id: "premium_6_month_8999",
    label: "6-Month Premium",
    badge: "Save 50%",
    price: "$89.99 every 6 months",
    equivalent: "$14.99/month equivalent",
    valueLabel: "Maximum savings",
    savingsText: "You save $89.95 vs monthly",
    comparison: { monthly: "$179.94", price: "$89.99", savings: "$89.95" },
    description: "Deep transformation plan.",
    includes: ["Full daily readings", "Full practice library", "Personal chart insights", "Past-life insights", "Relationship insights", "Weekly soul reports", "Monthly soul pattern report", "Saved history and progress"],
    cta: "Choose 6 Months",
  },
  {
    id: "premium_3_month_5999",
    label: "3-Month Premium",
    badge: "Save 33%",
    price: "$59.99 every 3 months",
    equivalent: "$19.99/month equivalent",
    valueLabel: "Best value",
    savingsText: "You save $29.98 vs monthly",
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
    cta: "Continue with Premium",
  },
  {
    id: "free",
    label: "Free",
    price: "$0",
    description: "Start your path and explore basic daily guidance.",
    includes: ["Basic daily guidance", "1 daily card preview", "Limited practices", "Basic Sky Map preview"],
    cta: "Current plan",
  },
];

export function SubscriptionModal({ isOpen, onClose, contextTitle }: SubscriptionModalProps) {
  const [notice, setNotice] = useState<"free" | "checkout-unavailable" | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
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

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(4,2,14,.68)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", zIndex: 240 }} />
      <section role="dialog" aria-modal="true" aria-labelledby="subscription-title" style={{ position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "min(100vw, 430px)", maxHeight: "92dvh", overflowY: "auto", zIndex: 241, borderRadius: "26px 26px 0 0", border: "1px solid rgba(216,168,95,.26)", borderBottom: "none", background: "rgba(10,6,28,.98)", boxShadow: "0 -16px 54px rgba(0,0,0,.62), 0 0 32px rgba(128,64,192,.16)", padding: "10px 18px calc(92px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,255,255,.12)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, marginBottom: 14 }}>
          <div>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>{contextTitle ?? "Subscription"}</p>
            <h2 id="subscription-title" style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 8 }}>Choose your eLuna plan</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>Unlock deeper readings, daily practices, and your evolving soul map.</p>
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
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>Payment provider must be connected before purchase.</p>
            {selectedPlanId && <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 6 }}>Selected plan: {selectedPlanId}</p>}
          </div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {plans.map((plan, index) => {
            const isTrial = plan.id === "trial_3_day_1_usd";
            const isFree = plan.id === "free";
            const compact = index > 0 && !isFree;
            const isSixMonth = plan.id === "premium_6_month_8999";
            const isLongPlan = plan.id === "premium_6_month_8999" || plan.id === "premium_3_month_5999";
            const borderColor = isTrial ? "rgba(216,168,95,.50)" : isSixMonth ? "rgba(247,217,139,.62)" : isLongPlan ? "rgba(216,168,95,.42)" : "rgba(216,168,95,.18)";
            const background = isTrial
              ? "linear-gradient(135deg, rgba(60,20,100,.38), rgba(216,168,95,.08))"
              : isSixMonth
                ? "linear-gradient(145deg, rgba(216,168,95,.15), rgba(80,30,140,.25), rgba(255,255,255,.04))"
                : isLongPlan
                  ? "linear-gradient(145deg, rgba(216,168,95,.10), rgba(255,255,255,.04))"
                  : "rgba(255,255,255,.04)";
            return (
            <div key={plan.id} style={{ display: "grid", gap: 8 }}>
            {index === 1 && <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", margin: "4px 0 0" }}>Choose your plan</p>}
            <article key={plan.id} style={{ border: `1px solid ${borderColor}`, borderRadius: isTrial || isLongPlan ? 22 : 18, background, padding: compact ? 13 : 15, boxShadow: isSixMonth ? "0 0 22px rgba(216,168,95,.14)" : isLongPlan ? "0 0 16px rgba(216,168,95,.08)" : "none" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <div>
                  {plan.valueLabel && <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 5 }}>{isSixMonth ? "✦ " : ""}{plan.valueLabel}</p>}
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: compact ? 21 : 24, fontWeight: 600, color: "var(--text)", lineHeight: 1.1 }}>{plan.label}</h3>
                  <p style={{ color: "var(--gold-2)", fontSize: compact ? 14 : 16, fontWeight: 800, marginTop: 3 }}>{plan.price}</p>
                  {plan.equivalent && <p style={{ color: "var(--muted-2)", fontSize: 12, fontWeight: 700, marginTop: 2 }}>{plan.equivalent}</p>}
                </div>
                {plan.badge && <span style={{ border: "1px solid rgba(216,168,95,.40)", borderRadius: 999, color: "var(--gold-2)", background: isLongPlan ? "rgba(216,168,95,.16)" : "rgba(216,168,95,.08)", padding: "5px 9px", fontSize: 10, fontWeight: 900, boxShadow: isLongPlan ? "0 0 12px rgba(216,168,95,.16)" : "none" }}>{plan.badge}</span>}
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
              {plan.billingNote && <p style={{ color: "var(--gold-2)", fontSize: 11, lineHeight: 1.45, fontWeight: 700, marginBottom: 10 }}>{plan.billingNote}</p>}
              <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                {(compact ? plan.includes.slice(0, 4) : plan.includes).map((item) => (
                  <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--text)", fontSize: 12, lineHeight: 1.35 }}>
                    <span style={{ color: "var(--gold-2)", flexShrink: 0 }}>✦</span>
                    <span>{item}</span>
                  </div>
                ))}
                {compact && <div style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.35 }}>Includes reports, saved history, and progress.</div>}
              </div>
              <button type="button" onClick={() => choosePlan(plan.id)} style={{ width: "100%", height: 44, borderRadius: 999, border: isFree ? "1px solid rgba(216,168,95,.30)" : "none", background: isFree ? "rgba(255,255,255,.05)" : "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: isFree ? "var(--gold-2)" : "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-ui)", cursor: "pointer", boxShadow: isFree ? "none" : "0 8px 24px rgba(90,32,144,.38)" }}>
                {plan.cta}
              </button>
            </article>
            </div>
          );
          })}
        </div>

        <section style={{ marginTop: 14, border: "1px solid rgba(216,168,95,.14)", borderRadius: 20, background: "rgba(255,255,255,.035)", padding: 14 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Why continue?</p>
          {["New daily guidance every day", "Unlock deeper parts of your Sky Map", "Build your practice streak", "Receive weekly and monthly soul reports"].map((item) => (
            <p key={item} style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45, marginTop: 5 }}>• {item}</p>
          ))}
          <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 12 }}>Your plan can be managed from your account settings.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            {["Terms of Use", "Billing Terms", "Money-Back Policy"].map((label) => (
              <span key={label} style={{ color: "var(--gold-2)", fontSize: 11, fontWeight: 700 }}>{label}</span>
            ))}
          </div>
          <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 12 }}>
            Need help with billing?{" "}
            <a href={SUPPORT_MAILTO} style={{ color: "var(--gold-2)", fontWeight: 800, textDecoration: "none" }}>
              {SUPPORT_EMAIL}
            </a>
          </p>
        </section>
      </section>
    </>
  );
}
