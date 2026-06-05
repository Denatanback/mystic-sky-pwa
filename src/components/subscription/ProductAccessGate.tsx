"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { StarField } from "@/components/app-shell/StarField";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { useEntitlements } from "@/lib/subscription/entitlements";
import { getLockedProductPreview } from "./LockedProductPreviews";
import { LockedProductPreviewShell } from "./LockedProductPreviewShell";
import { PlanChip } from "./PlanChip";
import { SubscriptionModal } from "./SubscriptionModal";

type ProductAccessGateProps = {
  children: ReactNode;
  featureName?: string;
  description?: string;
  preview?: ReactNode;
};

export function ProductAccessGate({
  children,
  featureName = "eLuna",
  description = "Choose 3-day intro access or a subscription to activate product features.",
  preview,
}: ProductAccessGateProps) {
  const { entitlements, loading } = useEntitlements();
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const pathname = usePathname();

  if (entitlements.hasFullAccess) return <>{children}</>;

  const lockedPreview = preview ?? getLockedProductPreview(pathname);

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

        <LockedProductPreviewShell
          featureName={featureName}
          description={description}
          loading={loading}
          onChooseAccess={() => setSubscriptionOpen(true)}
        >
          {lockedPreview}
        </LockedProductPreviewShell>
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
