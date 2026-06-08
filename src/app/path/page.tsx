"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { StarField } from "@/components/app-shell/StarField";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { ActivityCalendar } from "@/components/lunaPath/ActivityCalendar";
import { DailyRituals } from "@/components/lunaPath/DailyRituals";
import { LunaPathLevels } from "@/components/lunaPath/LunaPathLevels";
import { LunaPathStatusCard } from "@/components/lunaPath/LunaPathStatusCard";
import { OraclePreviewCard } from "@/components/lunaPath/OraclePreviewCard";
import { TokenEducationCard } from "@/components/lunaPath/TokenEducationCard";
import { TokenLedgerPreview } from "@/components/lunaPath/TokenLedgerPreview";
import { lunaCardStyle, lunaSecondaryButtonStyle } from "@/components/lunaPath/shared";
import { PlanChip } from "@/components/subscription/PlanChip";
import { readLunaPathState } from "@/lib/lunaPath/storage";
import type { LunaPathState } from "@/lib/lunaPath/types";

function PathShell({ children }: { children: ReactNode }) {
  return (
    <div className="app">
      <StarField />
      <div className="content" style={{ paddingBottom: "calc(132px + env(safe-area-inset-bottom))" }}>
        <header className="app-topbar">
          <Link href="/home" aria-label="Back home" className="icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div className="app-topbar__logo"><Logo variant="header" /></div>
          <div className="app-topbar__actions">
            <GuideTopBarButton />
            <PlanChip />
          </div>
        </header>
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

export default function PathPage() {
  const [state, setState] = useState<LunaPathState | null>(null);

  useEffect(() => {
    setState(readLunaPathState());
  }, []);

  if (!state) {
    return (
      <PathShell>
        <section style={{ ...lunaCardStyle, padding: "22px 20px", marginTop: 10 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Path</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 10 }}>Preparing Luna Path...</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>Loading your progress and rituals.</p>
        </section>
      </PathShell>
    );
  }

  return (
    <PathShell>
      <div style={{ display: "grid", gap: 14, marginTop: 10 }}>
        <div data-tour="path-1"><LunaPathStatusCard state={state} /></div>
        <TokenEducationCard />
        <LunaPathLevels state={state} />
        <div data-tour="path-2"><DailyRituals state={state} onStateChange={setState} /></div>
        <div data-tour="path-3"><ActivityCalendar state={state} /></div>

        <section style={{ ...lunaCardStyle, padding: 16 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Streak repair</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 7 }}>Restore continuity</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 12 }}>This continuity feature is being prepared for a future release.</p>
          <button type="button" disabled style={{ ...lunaSecondaryButtonStyle, opacity: .62, cursor: "default" }}>Soon</button>
        </section>

        <div data-tour="path-4"><OraclePreviewCard /></div>
        <TokenLedgerPreview state={state} />
      </div>
    </PathShell>
  );
}
