"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { GLOBAL_DISCLAIMER } from "@/lib/legal/legalContent";
import { paidPlans, type PaidPlanId } from "@/lib/subscription/plans";
import { useEntitlements } from "@/lib/subscription/entitlements";

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
  ["Progress features", "Continue readings, reflections, daily cards, and path signals while server-backed history is being prepared."],
  ["Reports", "Unlock weekly soul reports and monthly pattern previews."],
];

const introUnlocks = ["Full daily readings", "Premium Sky Map nodes", "Full affirmation and practice library", "Past-life and relationship insights", "Weekly and monthly report previews", "Progress and reflection features"];

const premiumPreviews = [
  ["Past-life signal", "See the repeating emotional pattern your path keeps returning to."],
  ["Weekly soul report", "At the end of your first week, eLuna summarizes your recurring signs, practices, and emotional themes."],
  ["Monthly soul pattern", "Your monthly report connects your readings, reflections, cards, and Sky Map progress."],
];

const planDetails: Record<PaidPlanId, {
  badge?: string;
  equivalent?: string;
  valueLabel?: string;
  savingsText?: string;
  comparison?: { monthly: string; price: string; savings: string };
  includes: string[];
  cta: string;
}> = {
  intro_3_day: {
    badge: "Best start",
    includes: ["Full daily readings", "Daily card and symbols", "Past-life signal preview", "Practices and affirmations", "Sky Map progression", "Weekly soul report preview"],
    cta: "Start 3-day access",
  },
  monthly: {
    equivalent: "Flexible monthly access",
    includes: ["Unlimited daily readings", "Full practice library", "Personal chart insights", "Past-life and relationship insights", "Weekly soul reports", "Monthly soul pattern report", "Progress and reflection features"],
    cta: "Choose Monthly",
  },
  three_month: {
    badge: "Best value",
    equivalent: "$19.99 USD/month equivalent",
    valueLabel: "Save 33%",
    savingsText: "Save $29.98 vs monthly",
    comparison: { monthly: "$89.97 USD", price: "$59.99 USD", savings: "$29.98 USD" },
    includes: ["Full daily readings", "Full practice library", "Personal chart insights", "Past-life insights", "Relationship insights", "Weekly soul reports", "Monthly soul pattern report", "Progress and reflection features"],
    cta: "Choose 3 Months",
  },
  six_month: {
    badge: "Maximum savings",
    equivalent: "$14.99 USD/month equivalent",
    valueLabel: "Save 50%",
    savingsText: "Save $89.95 vs monthly",
    comparison: { monthly: "$179.94 USD", price: "$89.99 USD", savings: "$89.95 USD" },
    includes: ["Full daily readings", "Full practice library", "Personal chart insights", "Past-life insights", "Relationship insights", "Weekly soul reports", "Monthly soul pattern report", "Progress and reflection features"],
    cta: "Choose 6 Months",
  },
};

const displayOrder: PaidPlanId[] = ["intro_3_day", "six_month", "three_month", "monthly"];

export function SubscriptionModal({ isOpen, onClose, contextTitle, contextDescription, trialCtaLabel }: SubscriptionModalProps) {
  const [checkoutError, setCheckoutError] = useState("");
  const [loadingPlanId, setLoadingPlanId] = useState<PaidPlanId | null>(null);
  const [mounted, setMounted] = useState(false);
  const { entitlements } = useEntitlements();
  const hasPaidAccess = entitlements.hasFullAccess;
  const hasInternalAccess = entitlements.planId === "internal_full_access" && entitlements.status === "internal";
  const orderedPlans = useMemo(() => displayOrder.map((id) => paidPlans.find((plan) => plan.id === id)).filter(Boolean) as typeof paidPlans, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setCheckoutError("");
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  async function choosePlan(planId: PaidPlanId) {
    setCheckoutError("");
    setLoadingPlanId(planId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const payload = await response.json().catch(() => ({})) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setCheckoutError(payload.error ?? "Could not start checkout. Please try again.");
        setLoadingPlanId(null);
        return;
      }

      window.location.href = payload.url;
    } catch {
      setCheckoutError("Could not start checkout. Please try again.");
      setLoadingPlanId(null);
    }
  }

  const sectionStyle = {
    border: "1px solid rgba(216,168,95,.14)",
    borderRadius: 20,
    background: "rgba(255,255,255,.035)",
    padding: 14,
  };

  function legalHref(path: string) {
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    return `${path}?returnTo=${encodeURIComponent(returnTo)}`;
  }

  return createPortal(
    <div
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        overflow: "hidden",
        background: "rgba(4,2,14,.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        padding: "0 10px",
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-title"
        style={{
          position: "relative",
          zIndex: 1001,
          width: "min(100%, 430px)",
          maxHeight: "82dvh",
          flexShrink: 0,
          overflowY: "auto",
          overscrollBehavior: "contain",
          pointerEvents: "auto",
          borderRadius: "28px 28px 0 0",
          border: "1px solid rgba(216,168,95,.26)",
          borderBottom: "none",
          background: "rgba(10,6,28,.98)",
          boxShadow: "0 -16px 54px rgba(0,0,0,.62), 0 0 32px rgba(128,64,192,.16)",
          padding: "10px 18px calc(32px + env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,255,255,.12)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, marginBottom: 14 }}>
          <div>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>{contextTitle ?? "Subscription"}</p>
            <h2 id="subscription-title" style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 8 }}>{contextTitle ?? "Unlock your full eLuna path"}</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>
              {contextDescription ?? "$1.00 USD for 3-day introductory access, or choose a subscription for longer full access to deeper readings, premium practices, and Sky Map features."}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.06)", color: "var(--muted-2)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>×</button>
        </div>

        {hasInternalAccess && (
          <div style={{ border: "1px solid rgba(216,168,95,.28)", borderRadius: 18, background: "rgba(216,168,95,.10)", padding: 13, marginBottom: 12 }}>
            <p style={{ color: "var(--gold-2)", fontSize: 13, fontWeight: 900, marginBottom: 4 }}>You already have full access.</p>
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>Internal full access is active for this account. No checkout is needed.</p>
          </div>
        )}

        {checkoutError && (
          <div style={{ border: "1px solid rgba(255,120,120,.32)", borderRadius: 18, background: "rgba(255,120,120,.08)", padding: 13, marginBottom: 12 }}>
            <p style={{ color: "#ffb3b3", fontSize: 13, fontWeight: 800, lineHeight: 1.45 }}>{checkoutError}</p>
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
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Account setup</p>
              {["Create your account", "Choose intro access or a subscription", "Paid access activates product features", "No physical goods are shipped"].map((item) => <p key={item} style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.45, marginTop: 5 }}>• {item}</p>)}
            </div>
            <div>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Intro access unlocks</p>
              {introUnlocks.map((item) => <p key={item} style={{ color: "var(--text)", fontSize: 11, lineHeight: 1.45, marginTop: 5 }}>• {item}</p>)}
            </div>
          </div>
        </section>

        <div style={{ display: "grid", gap: 12 }}>
          {orderedPlans.map((plan, index) => {
            const details = planDetails[plan.id];
            const isIntro = plan.id === "intro_3_day";
            const compact = index > 0;
            const isSixMonth = plan.id === "six_month";
            const isLongPlan = plan.id === "six_month" || plan.id === "three_month";
            const borderColor = isIntro ? "rgba(216,168,95,.56)" : isSixMonth ? "rgba(247,217,139,.62)" : isLongPlan ? "rgba(216,168,95,.42)" : "rgba(216,168,95,.18)";
            const background = isIntro
              ? "linear-gradient(135deg, rgba(60,20,100,.40), rgba(216,168,95,.10))"
              : isSixMonth
                ? "linear-gradient(145deg, rgba(216,168,95,.15), rgba(80,30,140,.25), rgba(255,255,255,.04))"
                : isLongPlan
                  ? "linear-gradient(145deg, rgba(216,168,95,.10), rgba(255,255,255,.04))"
                  : "rgba(255,255,255,.04)";
            const disabled = loadingPlanId !== null;

            return (
              <div key={plan.id} style={{ display: "grid", gap: 8 }}>
                {index === 0 && <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", margin: "2px 0 0" }}>All plans</p>}
                {index === 1 && <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", margin: "4px 0 0" }}>Longer access options</p>}
                <article style={{ border: `1px solid ${borderColor}`, borderRadius: isIntro || isLongPlan ? 22 : 18, background, padding: compact ? 13 : 15, boxShadow: isSixMonth ? "0 0 22px rgba(216,168,95,.14)" : isLongPlan || isIntro ? "0 0 16px rgba(216,168,95,.08)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                    <div>
                      {details.valueLabel && <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 5 }}>{details.valueLabel}</p>}
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: compact ? 21 : 24, fontWeight: 600, color: "var(--text)", lineHeight: 1.1 }}>{plan.name}</h3>
                      <p style={{ color: "var(--gold-2)", fontSize: compact ? 14 : 16, fontWeight: 800, marginTop: 3 }}>{plan.priceLabel}</p>
                      <p style={{ color: "var(--muted-2)", fontSize: 12, fontWeight: 700, marginTop: 2 }}>{details.equivalent ?? plan.billingLabel}</p>
                    </div>
                    {details.badge && <span style={{ border: "1px solid rgba(216,168,95,.40)", borderRadius: 999, color: "var(--gold-2)", background: isLongPlan || isIntro ? "rgba(216,168,95,.16)" : "rgba(216,168,95,.08)", padding: "5px 9px", fontSize: 10, fontWeight: 900, boxShadow: isLongPlan ? "0 0 12px rgba(216,168,95,.16)" : "none" }}>{details.badge}</span>}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{plan.description}</p>
                  {isIntro && <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 900, marginBottom: 9 }}>$1.00 USD for 3-day introductory access.</p>}
                  {details.savingsText && <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 900, marginBottom: 9 }}>{details.savingsText}</p>}
                  {details.comparison && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, border: "1px solid rgba(216,168,95,.18)", borderRadius: 14, background: "rgba(8,6,22,.34)", padding: "9px 8px", marginBottom: 10 }}>
                      {[
                        ["Monthly price", details.comparison.monthly],
                        ["Your price", details.comparison.price],
                        ["Savings", details.comparison.savings],
                      ].map(([label, value]) => (
                        <div key={label} style={{ minWidth: 0 }}>
                          <p style={{ color: "var(--muted-2)", fontSize: 9, lineHeight: 1.2 }}>{label}</p>
                          <p style={{ color: label === "Savings" ? "var(--gold-2)" : "var(--text)", fontSize: 11, fontWeight: 900, marginTop: 3 }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                    {(compact ? details.includes.slice(0, 4) : details.includes).map((item) => (
                      <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--text)", fontSize: 12, lineHeight: 1.35 }}>
                        <span style={{ color: "var(--gold-2)", flexShrink: 0 }}>✦</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button type="button" disabled={disabled} onClick={() => choosePlan(plan.id)} style={{ width: "100%", height: 44, borderRadius: 999, border: "none", background: disabled ? "rgba(128,64,192,.52)" : "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-ui)", cursor: disabled ? "default" : "pointer", boxShadow: "0 8px 24px rgba(90,32,144,.38)" }}>
                    {loadingPlanId === plan.id ? "Opening checkout..." : isIntro && trialCtaLabel ? trialCtaLabel : details.cta}
                  </button>
                  {isIntro && (
                    <p style={{ color: "var(--muted-2)", fontSize: 10.5, lineHeight: 1.45, textAlign: "center", marginTop: 8 }}>
                      Introductory access terms are shown by Stripe before purchase. Terms are governed by{" "}
                      <Link href={legalHref("/billing")} target="_blank" style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none" }}>
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
            <button type="button" disabled={loadingPlanId !== null} onClick={() => choosePlan("intro_3_day")} style={{ width: "100%", height: 42, borderRadius: 999, border: "1px solid rgba(216,168,95,.30)", background: "rgba(216,168,95,.08)", color: "var(--gold-2)", fontSize: 13, fontWeight: 900, fontFamily: "var(--font-ui)", cursor: loadingPlanId ? "default" : "pointer", marginTop: 12 }}>
              {loadingPlanId === "intro_3_day" ? "Opening checkout..." : "Unlock with 3-day access"}
            </button>
          )}
        </section>

        <section style={{ ...sectionStyle, marginTop: 14 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Why continue?</p>
          {["New daily guidance every day", "Unlock deeper parts of your Sky Map", "Build your practice streak", "Receive weekly and monthly soul reports"].map((item) => (
            <p key={item} style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45, marginTop: 5 }}>• {item}</p>
          ))}
          <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 12 }}>Digital subscription. No physical goods are shipped. Manage billing and cancellation through Stripe Customer Portal when available for your account.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            {[
              ["Terms of Use", legalHref("/terms")],
              ["Billing Terms", legalHref("/billing")],
              ["Refund Policy", legalHref("/money-back")],
              ["Cancellation Policy", legalHref("/cancellation")],
              ["Privacy Policy", legalHref("/privacy")],
            ].map(([label, href]) => (
              <Link key={label} href={href} target="_blank" style={{ color: "var(--gold-2)", fontSize: 11, fontWeight: 800, textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
          <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.45, marginTop: 12 }}>
            Billing or refund question? Contact{" "}
            <a href={SUPPORT_MAILTO} style={{ color: "var(--gold-2)", fontWeight: 800, textDecoration: "none" }}>
              {SUPPORT_EMAIL}
            </a>
            {" "}for support.
          </p>
          <p style={{ color: "var(--muted-2)", fontSize: 10.5, lineHeight: 1.45, marginTop: 10 }}>
            {GLOBAL_DISCLAIMER}
          </p>
        </section>
      </section>
    </div>,
    document.body
  );
}
