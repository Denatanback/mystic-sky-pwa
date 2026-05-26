"use client";

import { useEffect, useState } from "react";
import { SubscriptionModal } from "./SubscriptionModal";

type PlanLabel = "Free" | "Trial" | "Premium";

export function PlanChip() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<PlanLabel>("Free");

  useEffect(() => {
    const stored = localStorage.getItem("eluna:plan");
    if (stored === "trial") setLabel("Trial");
    else if (stored === "premium") setLabel("Premium");
    else setLabel("Free");
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open subscription plans"
        title="Subscription plans"
        onClick={() => setOpen(true)}
        style={{
          height: 30,
          borderRadius: 999,
          border: "1px solid rgba(160,130,220,.24)",
          background: "rgba(160,100,240,.08)",
          color: label === "Free" ? "var(--muted)" : "var(--gold-2)",
          display: "inline-flex",
          alignItems: "center",
          padding: "0 9px",
          fontSize: 11,
          fontWeight: 800,
          fontFamily: "var(--font-ui)",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {label}
      </button>
      <SubscriptionModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
