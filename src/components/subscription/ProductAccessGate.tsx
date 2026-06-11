"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEntitlements } from "@/lib/subscription/entitlements";

type ProductAccessGateProps = {
  children: ReactNode;
  /** @deprecated No longer rendered — gate now redirects to /paywall on access failure */
  featureName?: string;
  /** @deprecated No longer rendered — gate now redirects to /paywall on access failure */
  description?: string;
  /** @deprecated No longer rendered — gate now redirects to /paywall on access failure */
  preview?: ReactNode;
};

/**
 * Secondary access gate for feature pages (today, cards, journal, daily-card).
 *
 * GlobalAccessGuard is the primary guard and redirects unpaid users before they
 * reach these pages. This component is a defence-in-depth fallback for edge cases
 * (e.g. subscription expires while the user has an active session).
 *
 * On access failure it redirects to /paywall — SubscriptionModal is no longer used.
 */
export function ProductAccessGate({ children }: ProductAccessGateProps) {
  const { entitlements, loading } = useEntitlements();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !entitlements.hasFullAccess) {
      router.replace("/paywall");
    }
  }, [loading, entitlements.hasFullAccess, router]);

  if (entitlements.hasFullAccess) return <>{children}</>;

  // Show nothing while loading or while redirect is in flight.
  return null;
}
