"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NodePage } from "@/components/sky/NodePage";
import { useEntitlements } from "@/lib/subscription/entitlements";
import { canAccessSkyNode, type SkyDisciplineKey } from "@/lib/sky/skyNodeAccess";

export function SkyNodeEntitlementGate({
  children,
  discipline,
  nodeId,
  title,
  subtitle,
  totalNodes,
  backHref,
}: {
  children: ReactNode;
  discipline: SkyDisciplineKey;
  nodeId: number;
  title: string;
  subtitle: string;
  totalNodes: number;
  backHref: string;
}) {
  const { entitlements, loading } = useEntitlements();
  const router = useRouter();
  const allowed = canAccessSkyNode({ discipline, nodeId, entitlements });

  // Redirect unpaid users to paywall — GlobalAccessGuard is the primary guard;
  // this is a secondary defence for edge cases (e.g. entitlements expire mid-session).
  useEffect(() => {
    if (!loading && !allowed) {
      router.replace("/paywall");
    }
  }, [loading, allowed, router]);

  if (loading || !allowed) {
    return (
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeId} totalNodes={totalNodes} backHref={backHref}>
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <p style={{ color: "var(--muted)" }}>Checking access...</p>
        </div>
      </NodePage>
    );
  }

  return <>{children}</>;
}
