"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { SkyNode } from "@/lib/sky/skyNodes";

type NodePreviewSheetProps = {
  node: SkyNode | null;
  onClose: () => void;
  onOpenSubscription: () => void;
};

const actionStyle: CSSProperties = {
  height: 48,
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff",
  fontSize: 14,
  fontWeight: 800,
  fontFamily: "var(--font-ui)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 8px 26px rgba(90,32,144,.42), inset 0 1px 0 rgba(255,255,255,.12)",
};

function statusLabel(node: SkyNode) {
  if (node.status === "active") return "Ready";
  if (node.status === "available") return "Available";
  if (node.status === "premium") return "Premium";
  if (node.status === "completed") return "Completed";
  return "Locked";
}

export function NodePreviewSheet({ node, onClose, onOpenSubscription }: NodePreviewSheetProps) {
  if (!node) return null;

  const isLocked = node.status === "locked";
  const isPremium = node.status === "premium";
  const primaryLabel = isPremium ? "Start 3-day trial" : isLocked ? "Continue today's path" : "Open node";
  const primaryHref = isLocked ? "/today" : node.route;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(4,2,14,.66)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", zIndex: 230 }} />
      <section role="dialog" aria-modal="true" aria-labelledby="node-preview-title" style={{ position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "min(100vw, 430px)", maxHeight: "88dvh", overflowY: "auto", zIndex: 231, borderRadius: "24px 24px 0 0", border: "1px solid rgba(216,168,95,.26)", borderBottom: "none", background: "rgba(10,6,28,.98)", boxShadow: "0 -14px 50px rgba(0,0,0,.62), 0 0 30px rgba(128,64,192,.16)", padding: "10px 20px calc(92px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,.12)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>{node.category}</p>
            <h2 id="node-preview-title" style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>{node.title}</h2>
            <span style={{ display: "inline-flex", border: "1px solid rgba(216,168,95,.28)", borderRadius: 999, color: isPremium ? "var(--gold-2)" : node.status === "locked" ? "var(--muted)" : "var(--gold-2)", background: "rgba(216,168,95,.08)", padding: "5px 10px", fontSize: 11, fontWeight: 900 }}>{statusLabel(node)}</span>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.06)", color: "var(--muted-2)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>x</button>
        </div>

        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{node.description}</p>

        <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
          <div style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.035)", padding: 13 }}>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>What you'll receive</p>
            <div style={{ display: "grid", gap: 6 }}>
              {node.previewBullets.map((item) => (
                <p key={item} style={{ color: "var(--text)", fontSize: 12, lineHeight: 1.45 }}><span style={{ color: "var(--gold-2)", fontWeight: 900 }}>✦</span> {item}</p>
              ))}
            </div>
          </div>
          <div style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 18, background: "rgba(255,255,255,.035)", padding: 13 }}>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Unlock requirement</p>
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>{node.requirement}</p>
          </div>
          <div style={{ border: "1px solid rgba(160,130,220,.14)", borderRadius: 18, background: "rgba(160,100,240,.05)", padding: 13 }}>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>How this fits your map</p>
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>{node.discipline}</p>
          </div>
        </div>

        {isPremium ? (
          <button type="button" onClick={() => { onClose(); onOpenSubscription(); }} style={{ ...actionStyle, width: "100%" }}>
            {primaryLabel}
          </button>
        ) : (
          <Link href={primaryHref} onClick={onClose} style={actionStyle}>
            {primaryLabel}
          </Link>
        )}
      </section>
    </>
  );
}
