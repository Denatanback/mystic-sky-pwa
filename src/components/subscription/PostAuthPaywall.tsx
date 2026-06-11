"use client";

import { useEffect, useState } from "react";
import { useEntitlements } from "@/lib/subscription/entitlements";
import { SubscriptionModal } from "./SubscriptionModal";

type PendingClaimInfo = {
  claimType: string;
  funnel: string | null;
  offer: string | null;
};

type AccessStatusResponse = {
  active: boolean;
  pendingClaim: PendingClaimInfo | null;
};

/**
 * @deprecated
 * PostAuthPaywall is no longer mounted anywhere in the app.
 * Pending-claim users are now redirected to /claim/paywall immediately
 * after authentication (register/login), which is the authoritative
 * forced paywall route. This component is kept for reference only and
 * will never render because it returns null when not forced by /claim/paywall.
 */
export function PostAuthPaywall() {
  const { entitlements, loading } = useEntitlements();
  const [open, setOpen] = useState(false);
  const [pendingClaim, setPendingClaim] = useState<PendingClaimInfo | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return; // wait for entitlements to resolve
    if (entitlements.hasFullAccess) {
      setChecked(true);
      return; // user already paid — do nothing
    }

    // Check for pending claim
    async function checkPendingClaim() {
      try {
        const response = await fetch("/api/access/status");
        if (!response.ok) return;
        const json = await response.json() as AccessStatusResponse;
        if (json.pendingClaim && !json.active) {
          setPendingClaim(json.pendingClaim);
          setOpen(true);
        }
      } catch {
        // silently ignore — paywall is an enhancement, not a blocker
      } finally {
        setChecked(true);
      }
    }

    void checkPendingClaim();
  }, [loading, entitlements.hasFullAccess]);

  if (!checked || entitlements.hasFullAccess || !open) return null;

  const disciplineLabel = pendingClaim?.funnel === "pastlife"
    ? "Your Past Life Result"
    : pendingClaim?.funnel === "soulmatev" || pendingClaim?.funnel === "soulmatew"
      ? "Your Soulmate Type"
      : "Your reading result";

  const showIntroFirst = pendingClaim?.offer === "intro_3_day";

  return (
    <SubscriptionModal
      isOpen={open}
      onClose={() => setOpen(false)}
      contextTitle={disciplineLabel}
      contextDescription={
        showIntroFirst
          ? "Unlock your full result with 3-day introductory access for $1.00 USD, or choose a longer subscription."
          : "Choose a subscription to unlock your full reading result and access eLuna."
      }
      trialCtaLabel="Unlock my result — 3-day access"
      suppressIntroIfUsed
    />
  );
}
