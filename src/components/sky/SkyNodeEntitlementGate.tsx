"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { NodePage } from "@/components/sky/NodePage";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
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
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const allowed = canAccessSkyNode({ discipline, nodeId, entitlements });

  if (loading) {
    return (
      <NodePage title={title} subtitle={subtitle} nodeNum={nodeId} totalNodes={totalNodes} backHref={backHref}>
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <p style={{ color: "var(--muted)" }}>Checking access...</p>
        </div>
      </NodePage>
    );
  }

  if (!allowed) {
    return (
      <>
        <NodePage title={title} subtitle={subtitle} nodeNum={nodeId} totalNodes={totalNodes} backHref={backHref}>
          <div style={{ textAlign: "center", padding: "38px 16px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128274;</div>
            <p style={{ color: "var(--gold-2)", fontSize: 13, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>
              Premium Sky Map node
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 27, fontWeight: 600, color: "var(--text)", lineHeight: 1.12, marginBottom: 8 }}>
              Unlock this deeper insight
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 18 }}>
              Start your 3-day trial or use an account with full access to open this node.
            </p>
            <button
              type="button"
              onClick={() => setSubscriptionOpen(true)}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 999,
                border: "none",
                background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                fontFamily: "var(--font-ui)",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(90,32,144,.38)",
              }}
            >
              View access options
            </button>
          </div>
        </NodePage>
        <SubscriptionModal
          isOpen={subscriptionOpen}
          onClose={() => setSubscriptionOpen(false)}
          contextTitle={`Unlock ${title}`}
          contextDescription="Start your 3-day trial to unlock premium Sky Map nodes, deeper practices, and full readings."
        />
      </>
    );
  }

  return <>{children}</>;
}
