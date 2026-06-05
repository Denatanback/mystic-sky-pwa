import type { CSSProperties } from "react";

export const lunaCardStyle: CSSProperties = {
  border: "1px solid rgba(216,168,95,.20)",
  borderRadius: 22,
  background: "rgba(12,8,28,.64)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 14px 34px rgba(0,0,0,.24)",
};

export const lunaPrimaryButtonStyle: CSSProperties = {
  minHeight: 44,
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 900,
  fontFamily: "var(--font-ui)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 16px",
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 8px 24px rgba(90,32,144,.38), inset 0 1px 0 rgba(255,255,255,.12)",
};

export const lunaSecondaryButtonStyle: CSSProperties = {
  minHeight: 40,
  borderRadius: 999,
  border: "1px solid rgba(216,168,95,.28)",
  background: "rgba(216,168,95,.08)",
  color: "var(--gold-2)",
  fontSize: 12,
  fontWeight: 900,
  fontFamily: "var(--font-ui)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 14px",
  textDecoration: "none",
  cursor: "pointer",
};

export const lunaInputStyle: CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid rgba(216,168,95,.20)",
  background: "rgba(255,255,255,.05)",
  color: "var(--text)",
  fontFamily: "var(--font-ui)",
  fontSize: 13,
  lineHeight: 1.5,
  padding: 12,
  resize: "vertical",
  outline: "none",
};

export function LunaGlyph() {
  return (
    <span aria-hidden="true" style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(216,168,95,.32)", background: "radial-gradient(circle at 36% 28%, rgba(247,217,139,.20), rgba(141,85,214,.20) 58%, rgba(10,6,28,.72))", color: "var(--gold-2)", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "0 0 18px rgba(141,85,214,.16)" }}>
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 14.2A7.2 7.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2Z" />
        <path d="M16 4.8v3.5" />
        <path d="M17.8 6.5h-3.6" />
      </svg>
    </span>
  );
}
