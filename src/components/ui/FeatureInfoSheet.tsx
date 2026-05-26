"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export type FeatureInfoSheetProps = {
  title: string;
  description: string;
  statusLabel?: string;
  primaryActionLabel?: string;
  primaryHref?: string;
  onClose: () => void;
  icon?: ReactNode;
};

function DefaultIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="m5.8 5.8 2.4 2.4" />
      <path d="m15.8 15.8 2.4 2.4" />
      <path d="m18.2 5.8-2.4 2.4" />
      <path d="m8.2 15.8-2.4 2.4" />
    </svg>
  );
}

export function FeatureInfoSheet({
  title,
  description,
  statusLabel,
  primaryActionLabel = "Got it",
  primaryHref,
  onClose,
  icon,
}: FeatureInfoSheetProps) {
  const actionStyle: CSSProperties = {
    height: 48,
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "var(--font-ui)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    cursor: "pointer",
    boxShadow: "0 8px 26px rgba(90,32,144,.42), inset 0 1px 0 rgba(255,255,255,.12)",
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(4,2,14,.62)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          zIndex: 220,
        }}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-info-title"
        style={{
          position: "fixed",
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          width: "min(100vw, 430px)",
          zIndex: 221,
          borderRadius: "24px 24px 0 0",
          border: "1px solid rgba(216,168,95,.24)",
          borderBottom: "none",
          background: "rgba(10,6,28,.97)",
          boxShadow: "0 -12px 46px rgba(0,0,0,.58), 0 0 30px rgba(128,64,192,.16)",
          padding: "10px 20px 24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,.12)" }} />
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "1px solid rgba(247,217,139,.34)",
              background: "radial-gradient(circle at 35% 30%, rgba(247,217,139,.20), rgba(128,64,192,.22) 58%, rgba(10,6,28,.82))",
              boxShadow: "0 0 22px rgba(128,64,192,.20), inset 0 1px 0 rgba(255,255,255,.08)",
              color: "var(--gold-2)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            {icon ?? <DefaultIcon />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {statusLabel && (
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>
                {statusLabel}
              </p>
            )}
            <h2 id="feature-info-title" style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 8 }}>
              {title}
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,.1)",
              background: "rgba(255,255,255,.06)",
              color: "var(--muted-2)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div style={{ marginTop: 20 }}>
          {primaryHref ? (
            <Link href={primaryHref} onClick={onClose} style={actionStyle}>
              {primaryActionLabel}
            </Link>
          ) : (
            <button type="button" onClick={onClose} style={{ ...actionStyle, width: "100%" }}>
              {primaryActionLabel}
            </button>
          )}
        </div>
      </section>
    </>
  );
}
