"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { StarField } from "@/components/app-shell/StarField";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { useEntitlements } from "@/lib/subscription/entitlements";
import { PlanChip } from "./PlanChip";
import { SubscriptionModal } from "./SubscriptionModal";

type ProductAccessGateProps = {
  children: ReactNode;
  featureName?: string;
  description?: string;
};

export function ProductAccessGate({
  children,
  featureName = "eLuna",
  description = "Choose 3-day intro access or a subscription to activate product features.",
}: ProductAccessGateProps) {
  const { entitlements, loading } = useEntitlements();
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);

  if (entitlements.hasFullAccess) return <>{children}</>;

  return (
    <div className="app">
      <StarField />
      <div className="content" style={{ paddingBottom: "calc(132px + env(safe-area-inset-bottom))" }}>
        <header className="app-topbar">
          <div className="app-topbar__logo"><Logo variant="header" /></div>
          <div className="app-topbar__actions">
            <GuideTopBarButton />
            <PlanChip />
          </div>
        </header>

        <section style={{ border: "1px solid rgba(216,168,95,.24)", borderRadius: 24, background: "radial-gradient(circle at 16% 0%, rgba(216,168,95,.12), transparent 34%), rgba(12,8,28,.72)", boxShadow: "0 18px 44px rgba(0,0,0,.28)", padding: "22px 18px", marginTop: 18 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase", marginBottom: 8 }}>
            No active plan
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>
            Activate access to use {featureName}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
            {loading ? "Checking your access..." : description}
          </p>
          <button
            type="button"
            onClick={() => setSubscriptionOpen(true)}
            style={{ width: "100%", minHeight: 46, borderRadius: 999, border: "none", background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 14, fontWeight: 900, fontFamily: "var(--font-ui)", cursor: "pointer", boxShadow: "0 10px 28px rgba(90,32,144,.40)" }}
          >
            Choose access
          </button>
        </section>
      </div>
      <BottomNav />
      <SubscriptionModal
        isOpen={subscriptionOpen}
        onClose={() => setSubscriptionOpen(false)}
        contextTitle={`Unlock ${featureName}`}
        contextDescription={description}
      />
    </div>
  );
}
