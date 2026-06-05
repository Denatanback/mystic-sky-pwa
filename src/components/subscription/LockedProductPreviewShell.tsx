"use client";

import type { ReactNode } from "react";

type LockedProductPreviewShellProps = {
  children: ReactNode;
  featureName: string;
  description: string;
  loading?: boolean;
  onChooseAccess: () => void;
};

export function LockedProductPreviewShell({
  children,
  featureName,
  description,
  loading = false,
  onChooseAccess,
}: LockedProductPreviewShellProps) {
  return (
    <div style={{ position: "relative", marginTop: 10 }}>
      <div
        aria-hidden="true"
        style={{
          opacity: .46,
          filter: "grayscale(.2) blur(.5px)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {children}
      </div>

      <section
        aria-label={`Activate access to use ${featureName}`}
        style={{
          position: "absolute",
          top: 12,
          left: 0,
          right: 0,
          zIndex: 5,
          border: "1px solid rgba(216,168,95,.38)",
          borderRadius: 24,
          background: "radial-gradient(circle at 18% 0%, rgba(216,168,95,.16), transparent 36%), linear-gradient(145deg, rgba(23,12,52,.94), rgba(10,6,28,.91))",
          boxShadow: "0 22px 56px rgba(0,0,0,.48), inset 0 1px 0 rgba(255,255,255,.08)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "20px 18px",
        }}
      >
        <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase", marginBottom: 8 }}>
          No active plan
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>
          Activate access to use {featureName}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
          {loading ? "Checking your access..." : description}
        </p>
        <button
          type="button"
          onClick={onChooseAccess}
          style={{
            width: "100%",
            minHeight: 46,
            borderRadius: 999,
            border: "none",
            background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 900,
            fontFamily: "var(--font-ui)",
            cursor: "pointer",
            boxShadow: "0 10px 28px rgba(90,32,144,.40), inset 0 1px 0 rgba(255,255,255,.12)",
          }}
        >
          Choose access
        </button>
      </section>
    </div>
  );
}
