"use client";
import { useState } from "react";
import type { SectionGuide, QuickHelpItem } from "./guideGuides";

interface GuideSheetProps {
  guide:          SectionGuide;
  onClose:        () => void;
  onStartTutorial:() => void;
}

function FAQItem({ item }: { item: QuickHelpItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderRadius:   14,
        border:         `1px solid ${open ? "rgba(216,168,95,.28)" : "rgba(255,255,255,.08)"}`,
        overflow:       "hidden",
        transition:     "border-color .2s",
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width:          "100%",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          gap:            10,
          padding:        "12px 14px",
          background:     "transparent",
          border:         "none",
          cursor:         "pointer",
          textAlign:      "left",
          fontFamily:     "var(--font-sans)",
        }}
      >
        <span style={{ fontSize: 13, color: open ? "var(--gold-2)" : "var(--text)", fontWeight: 500, flex: 1 }}>
          {item.question}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="var(--muted-2)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 14px 12px", fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
          {item.answer}
        </div>
      )}
    </div>
  );
}

function GuideMark() {
  return (
    <div style={{
      width: 54, height: 54, borderRadius: "50%",
      border: "1px solid rgba(216,168,95,.34)",
      background: "radial-gradient(circle at 35% 30%, rgba(240,200,123,.28), rgba(128,64,192,.22) 55%, rgba(10,6,28,.82))",
      boxShadow: "0 0 24px rgba(128,64,192,.26), inset 0 1px 0 rgba(255,255,255,.08)",
      display: "grid", placeItems: "center", color: "var(--gold-2)",
      flexShrink: 0,
    }}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" />
        <path d="m5.8 5.8 2.4 2.4" /><path d="m15.8 15.8 2.4 2.4" />
        <path d="m18.2 5.8-2.4 2.4" /><path d="m8.2 15.8-2.4 2.4" />
      </svg>
    </div>
  );
}

export function GuideSheet({ guide, onClose, onStartTutorial }: GuideSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:   "fixed",
          inset:      0,
          background: "rgba(4,2,14,.6)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          zIndex:     200,
        }}
      />

      {/* Sheet panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${guide.title} guide`}
        style={{
          position:     "fixed",
          bottom:       0,
          left:         "50%",
          transform:    "translateX(-50%)",
          width:        "min(100vw, 430px)",
          maxHeight:    "88vh",
          zIndex:       201,
          background:   "rgba(10, 6, 28, 0.97)",
          border:       "1px solid rgba(216,168,95,.22)",
          borderBottom: "none",
          borderRadius: "24px 24px 0 0",
          boxShadow:    "0 -8px 40px rgba(0,0,0,.55)",
          display:      "flex",
          flexDirection:"column",
          overflow:     "hidden",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,.12)" }} />
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", padding: "12px 20px 32px", flex: 1 }}>

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 16 }}>
            <GuideMark />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>
                Guide
              </p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 400, color: "var(--text)", lineHeight: 1.1, marginBottom: 6 }}>
                {guide.title}
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
                {guide.intro}
              </p>
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                alignSelf:    "flex-start",
                width:        34,
                height:       34,
                borderRadius: "50%",
                background:   "rgba(255,255,255,.06)",
                border:       "1px solid rgba(255,255,255,.1)",
                color:        "var(--muted-2)",
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
                cursor:       "pointer",
                flexShrink:   0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            <button
              onClick={onStartTutorial}
              style={{
                height:       52,
                borderRadius: 999,
                background:   "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
                border:       "none",
                color:        "#fff",
                fontSize:     15,
                fontWeight:   600,
                fontFamily:   "var(--font-ui)",
                letterSpacing:".02em",
                cursor:       "pointer",
                boxShadow:    "0 6px 22px rgba(90,32,144,.4), inset 0 1px 0 rgba(255,255,255,.12)",
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
                gap:          8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Show me around
            </button>

            <button
              onClick={onClose}
              style={{
                height:       44,
                borderRadius: 999,
                background:   "rgba(255,255,255,.04)",
                border:       "1px solid rgba(255,255,255,.1)",
                color:        "var(--muted)",
                fontSize:     14,
                fontFamily:   "var(--font-sans)",
                cursor:       "pointer",
              }}
            >
              Not now
            </button>
          </div>

          {/* FAQ / Quick help */}
          {guide.quickHelp.length > 0 && (
            <>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>
                What can I do here?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {guide.quickHelp.map(item => (
                  <FAQItem key={item.question} item={item} />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
