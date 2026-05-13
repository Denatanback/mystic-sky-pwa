"use client";
import Link from "next/link";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  nodeNum: number;
  totalNodes: number;
  backHref: string;
  children: ReactNode;
  /** status badge shown next to node number */
  badge?: "started" | "completed";
}

export function NodePage({ title, subtitle, nodeNum, totalNodes, backHref, children, badge }: Props) {
  const pct = ((nodeNum - 1) / (totalNodes - 1)) * 100;

  return (
    <div className="app">
      <StarField orbits={false} />
      <div className="content" style={{ paddingBottom: 100 }}>

        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <Link href={backHref} style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(216,168,95,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", textDecoration: "none", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, lineHeight: 1.1, color: "var(--text)" }}>{title}</h1>
              {badge === "completed" && (
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "rgba(216,168,95,.15)", border: "1px solid rgba(216,168,95,.4)", color: "var(--gold)", fontWeight: 600, letterSpacing: ".08em", whiteSpace: "nowrap" }}>DONE</span>
              )}
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{subtitle}</p>
          </div>
        </header>

        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>
            <span>Node {nodeNum} of {totalNodes}</span>
            <span style={{ color: "var(--gold-2)" }}>{Math.round(pct)}% of path</span>
          </div>
          <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,.08)", overflow: "visible", position: "relative" }}>
            <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: "linear-gradient(90deg, #8040c0, #d8a85f)", transition: "width .5s ease" }} />
            {Array.from({ length: totalNodes }, (_, i) => (
              <div key={i} style={{ position: "absolute", top: "50%", left: `${(i / (totalNodes - 1)) * 100}%`, transform: "translate(-50%, -50%)", width: 6, height: 6, borderRadius: "50%", background: i < nodeNum ? "var(--gold)" : "rgba(255,255,255,.2)", border: "1px solid rgba(0,0,0,.3)" }} />
            ))}
          </div>
        </div>

        {/* Node content */}
        {children}

      </div>
      <BottomNav />
    </div>
  );
}
