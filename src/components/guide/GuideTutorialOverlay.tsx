"use client";

import { useEffect, useMemo, useState } from "react";
import type { TutorialStep } from "./guideGuides";

interface GuideTutorialOverlayProps {
  steps: TutorialStep[];
  currentStep: number;
  sectionTitle: string;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onDone: () => void;
}

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function getTargetRect(targetId: string): Rect | null {
  const target = document.querySelector<HTMLElement>(`[data-tour="${targetId}"]`);
  if (!target) return null;

  const rect = target.getBoundingClientRect();
  return {
    top: Math.max(8, rect.top),
    left: Math.max(8, rect.left),
    width: rect.width,
    height: rect.height,
  };
}

export function GuideTutorialOverlay({
  steps,
  currentStep,
  sectionTitle,
  onNext,
  onBack,
  onSkip,
  onDone,
}: GuideTutorialOverlayProps) {
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;
  const progress = steps.length > 1 ? (currentStep + 1) / steps.length : 1;
  const [targetRect, setTargetRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (!step) return;

    const target = document.querySelector<HTMLElement>(`[data-tour="${step.id}"]`);
    if (!target) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[eLuna tour] Missing target: ${step.id}`);
      }
      const timeout = window.setTimeout(() => {
        if (isLast) onDone();
        else onNext();
      }, 80);
      return () => window.clearTimeout(timeout);
    }

    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    const updateRect = () => setTargetRect(getTargetRect(step.id));
    const first = window.setTimeout(updateRect, 280);
    updateRect();

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.clearTimeout(first);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [step, isLast, onDone, onNext]);

  const tooltipStyle = useMemo<React.CSSProperties>(() => {
    const width = "min(calc(100vw - 24px), 390px)";
    if (!targetRect) {
      return {
        position: "fixed",
        left: "50%",
        bottom: "calc(var(--nav-h, 84px) + 12px)",
        transform: "translateX(-50%)",
        width,
      };
    }

    const viewportHeight = window.innerHeight;
    const gap = 14;
    const belowTop = targetRect.top + targetRect.height + gap;
    const placeBelow = belowTop < viewportHeight - 230;
    const maxLeft = Math.max(12, window.innerWidth - 402);
    const left = Math.min(Math.max(12, targetRect.left + targetRect.width / 2 - 195), maxLeft);

    return {
      position: "fixed",
      left,
      top: placeBelow ? belowTop : undefined,
      bottom: placeBelow ? undefined : Math.max(12, viewportHeight - targetRect.top + gap),
      width,
    };
  }, [targetRect]);

  if (!step) return null;

  const highlight = targetRect
    ? {
        top: targetRect.top - 8,
        left: targetRect.left - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16,
      }
    : null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(4,2,14,.64)",
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
          zIndex: 198,
          pointerEvents: "none",
        }}
      />

      {highlight && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: highlight.top,
            left: highlight.left,
            width: highlight.width,
            height: highlight.height,
            borderRadius: 24,
            border: "1.5px solid rgba(247,217,139,.95)",
            boxShadow: "0 0 0 9999px rgba(4,2,14,.28), 0 0 0 6px rgba(128,64,192,.22), 0 0 30px rgba(247,217,139,.22)",
            zIndex: 199,
            pointerEvents: "none",
            transition: "all .24s ease",
          }}
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Product tour"
        style={{
          ...tooltipStyle,
          zIndex: 200,
          background: "rgba(10,6,28,.97)",
          border: "1px solid rgba(216,168,95,.32)",
          borderRadius: 22,
          boxShadow: "0 12px 42px rgba(0,0,0,.62), 0 0 30px rgba(128,64,192,.18)",
          padding: "18px 18px 16px",
        }}
      >
        <div style={{ height: 2, borderRadius: 99, background: "rgba(255,255,255,.08)", marginBottom: 14, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, #8040c0, #d8a85f)",
              borderRadius: 99,
              transition: "width .3s ease",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            border: "1px solid rgba(216,168,95,.34)",
            background: "rgba(216,168,95,.10)",
            color: "var(--gold-2)",
            display: "grid", placeItems: "center",
            flexShrink: 0,
          }}>
            ✦
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>
              {sectionTitle} · {currentStep + 1} of {steps.length}
            </p>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 6, lineHeight: 1.15 }}>
              {step.title}
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {step.text}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={onBack}
            disabled={isFirst}
            style={{
              height: 38,
              padding: "0 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.1)",
              color: isFirst ? "rgba(255,255,255,.22)" : "var(--muted)",
              cursor: isFirst ? "default" : "pointer",
              fontFamily: "var(--font-ui)",
              fontSize: 13,
            }}
          >
            Back
          </button>
          <button
            onClick={isLast ? onDone : onNext}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 999,
              background: isLast ? "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)" : "rgba(216,168,95,.14)",
              border: isLast ? "none" : "1px solid rgba(216,168,95,.32)",
              color: isLast ? "#fff" : "var(--gold-2)",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-ui)",
              cursor: "pointer",
            }}
          >
            {isLast ? "Done" : "Next"}
          </button>
          <button
            onClick={onSkip}
            style={{
              height: 38,
              padding: "0 12px",
              borderRadius: 999,
              background: "transparent",
              border: "none",
              color: "var(--muted-2)",
              fontSize: 13,
              fontFamily: "var(--font-ui)",
              cursor: "pointer",
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </>
  );
}
