"use client";

import { useState } from "react";

type PlanId = "free" | "trial_3_day" | "premium_monthly";

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
  description: string;
  includes: string[];
  cta: string;
}> = [
  {
    id: "free",
    label: "Free",
    price: "$0",
    description: "Start your path and explore basic daily guidance.",
    includes: ["Basic daily guidance", "1 daily card preview", "Limited practices", "Basic Sky Map preview"],
    cta: "Current plan",
  },
  {
    id: "trial_3_day",
    label: "3-day trial",
    badge: "Best start",
    price: "$1.00 today",
    description: "Try the full eLuna experience and unlock your first deeper readings.",
    includes: ["Full daily readings", "Daily card and symbols", "Past-life signal preview", "Practices and affirmations", "Sky Map progression", "Weekly soul report preview"],
    cta: "Start 3-day trial",
  },
  {
    id: "premium_monthly",
    label: "Premium",
    price: "$29.99 / month",
    description: "Continue your path with deeper insights and monthly reports.",
    includes: ["Unlimited daily readings", "Full practice library", "Personal chart insights", "Past-life and relationship insights", "Weekly soul reports", "Monthly soul pattern report", "Saved history and progress"],
    cta: "Continue with Premium",
  },
];

export function SubscriptionModal({ isOpen, onClose, contextTitle }: SubscriptionModalProps) {
  const [notice, setNotice] = useState<"free" | "checkout-unavailable" | null>(null);
  if (!isOpen) return null;

  function choosePlan(planId: PlanId) {
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
      <section role="dialog" aria-modal="true" aria-labelledby="subscription-title" style={{ position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "min(100vw, 430px)", maxHeight: "92dvh", overflowY: "auto", zIndex: 241, borderRadius: "26px 26px 0 0", border: "1px solid rgba(216,168,95,.26)", borderBottom: "none", background: "rgba(10,6,28,.98)", boxShadow: "0 -16px 54px rgba(0,0,0,.62), 0 0 32px rgba(128,64,192,.16)", padding: "10px 18px 24px" }}>
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
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>Payment checkout needs to be connected before this plan can be purchased.</p>
          </div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {plans.map((plan) => (
            <article key={plan.id} style={{ border: `1px solid ${plan.id === "trial_3_day" ? "rgba(216,168,95,.46)" : "rgba(216,168,95,.18)"}`, borderRadius: 22, background: plan.id === "trial_3_day" ? "rgba(60,20,100,.28)" : "rgba(255,255,255,.04)", padding: 15 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)", lineHeight: 1.1 }}>{plan.label}</h3>
                  <p style={{ color: "var(--gold-2)", fontSize: 16, fontWeight: 800, marginTop: 3 }}>{plan.price}</p>
                </div>
                {plan.badge && <span style={{ border: "1px solid rgba(216,168,95,.32)", borderRadius: 999, color: "var(--gold-2)", background: "rgba(216,168,95,.08)", padding: "5px 9px", fontSize: 10, fontWeight: 800 }}>{plan.badge}</span>}
              </div>
              <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{plan.description}</p>
              <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                {plan.includes.map((item) => (
                  <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--text)", fontSize: 12, lineHeight: 1.35 }}>
                    <span style={{ color: "var(--gold-2)", flexShrink: 0 }}>✦</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => choosePlan(plan.id)} style={{ width: "100%", height: 44, borderRadius: 999, border: plan.id === "free" ? "1px solid rgba(216,168,95,.30)" : "none", background: plan.id === "free" ? "rgba(255,255,255,.05)" : "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: plan.id === "free" ? "var(--gold-2)" : "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-ui)", cursor: "pointer", boxShadow: plan.id === "free" ? "none" : "0 8px 24px rgba(90,32,144,.38)" }}>
                {plan.cta}
              </button>
            </article>
          ))}
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
        </section>
      </section>
    </>
  );
}
