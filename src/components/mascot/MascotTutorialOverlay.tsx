"use client";
import { Mascot } from "./Mascot";
import { MascotDisplay } from "./MascotDisplay";
import type { MascotMood } from "./mascotAssets";
import type { TutorialStep } from "./mascotGuides";

interface MascotTutorialOverlayProps {
  steps:       TutorialStep[];
  currentStep: number;
  sectionTitle:string;
  onNext:      () => void;
  onBack:      () => void;
  onSkip:      () => void;
  onDone:      () => void;
}

export function MascotTutorialOverlay({
  steps,
  currentStep,
  sectionTitle,
  onNext,
  onBack,
  onSkip,
  onDone,
}: MascotTutorialOverlayProps) {
  const step     = steps[currentStep];
  const isLast   = currentStep === steps.length - 1;
  const isFirst  = currentStep === 0;
  const mood: MascotMood = step?.mood ?? "calm";
  const progress = steps.length > 1 ? (currentStep + 1) / steps.length : 1;

  if (!step) return null;

  return (
    <>
      {/* Dimmed backdrop — not fully blocking so user can still see page */}
      <div
        style={{
          position:   "fixed",
          inset:      0,
          background: "rgba(4,2,14,.55)",
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
          zIndex:     198,
          pointerEvents: "none",
        }}
      />

      {/* Tutorial card — fixed above bottom nav */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tutorial"
        style={{
          position:   "fixed",
          bottom:     "calc(var(--nav-h, 84px) + 12px)",
          left:       "50%",
          transform:  "translateX(-50%)",
          width:      "min(calc(100vw - 24px), 406px)",
          zIndex:     199,
          background: "rgba(10,6,28,.97)",
          border:     "1px solid rgba(216,168,95,.28)",
          borderRadius: 24,
          boxShadow:  "0 8px 40px rgba(0,0,0,.6)",
          padding:    "20px 20px 16px",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 2, borderRadius: 99, background: "rgba(255,255,255,.08)", marginBottom: 16, overflow: "hidden" }}>
          <div
            style={{
              height:     "100%",
              width:      `${progress * 100}%`,
              background: "linear-gradient(90deg, #8040c0, #d8a85f)",
              borderRadius: 99,
              transition: "width .3s ease",
            }}
          />
        </div>

        {/* Mascot + content row */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 16 }}>
          {/* Mascot */}
          <MascotDisplay mood={mood} size={54} />

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Step counter */}
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>
              {sectionTitle} · {currentStep + 1} of {steps.length}
            </p>
            {/* Step title */}
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 400, color: "var(--text)", marginBottom: 6, lineHeight: 1.15 }}>
              {step.title}
            </h3>
            {/* Step body */}
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {step.text}
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Back */}
          <button
            onClick={onBack}
            disabled={isFirst}
            aria-label="Previous step"
            style={{
              width:        40,
              height:       40,
              borderRadius: "50%",
              background:   "rgba(255,255,255,.05)",
              border:       "1px solid rgba(255,255,255,.1)",
              color:        isFirst ? "rgba(255,255,255,.2)" : "var(--muted)",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              cursor:       isFirst ? "default" : "pointer",
              flexShrink:   0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>

          {/* Next / Done */}
          <button
            onClick={isLast ? onDone : onNext}
            style={{
              flex:         1,
              height:       40,
              borderRadius: 999,
              background:   isLast
                ? "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)"
                : "rgba(216,168,95,.14)",
              border:       isLast
                ? "none"
                : "1px solid rgba(216,168,95,.32)",
              color:        isLast ? "#fff" : "var(--gold-2)",
              fontSize:     14,
              fontWeight:   600,
              fontFamily:   "var(--font-sans)",
              cursor:       "pointer",
              boxShadow:    isLast ? "0 4px 16px rgba(90,32,144,.4)" : "none",
              transition:   "all .18s",
            }}
          >
            {isLast ? "Done ✓" : "Next →"}
          </button>

          {/* Skip — only show if not last step */}
          {!isLast && (
            <button
              onClick={onSkip}
              style={{
                padding:    "0 12px",
                height:     40,
                borderRadius: 999,
                background: "transparent",
                border:     "none",
                color:      "var(--muted-2)",
                fontSize:   12,
                fontFamily: "var(--font-sans)",
                cursor:     "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </>
  );
}
