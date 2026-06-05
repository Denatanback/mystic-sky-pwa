"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { FeatureInfoSheet, type FeatureInfoSheetProps } from "@/components/ui/FeatureInfoSheet";
import { PlanChip } from "@/components/subscription/PlanChip";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { NodePreviewSheet } from "@/components/sky/NodePreviewSheet";
import { getCurrentProfile } from "@/lib/profile/currentProfile";
import { getPrelandContext, getPrelandExperience, type PrelandExperience } from "@/lib/funnel/prelandContext";
import { getTodayProgress } from "@/lib/progress/dailyProgress";
import { resolveSkyNodes, type SkyNode, type SkyNodeStatus } from "@/lib/sky/skyNodes";
import { useEntitlements } from "@/lib/subscription/entitlements";

const CW = 390;
const CH = 460;
const CX = 195;
const CY = 230;
const ORB = 132;
const OCX = (CX / CW) * 100;
const OCY = (CY / CH) * 100;
const ORX = (ORB / CW) * 100;
const ORY = (ORB / CH) * 100;

const orbitalNodePositions: Record<string, { x: number; y: number }> = {
  "sun-sign": { x: 50, y: 13 },
  "life-path": { x: 20, y: 29 },
  "energy-rhythm": { x: 80, y: 29 },
  "past-life-signal": { x: 20, y: 55 },
  "soulmate-pattern": { x: 80, y: 55 },
  "weekly-report": { x: 28, y: 79 },
  "grounding-practice": { x: 68, y: 79 },
};

const cardStyle = {
  border: "1px solid rgba(216,168,95,.20)",
  borderRadius: 22,
  background: "rgba(12,8,28,.62)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 14px 34px rgba(0,0,0,.24)",
};

function polar(deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: ((CX + ORB * Math.cos(rad)) / CW) * 100, y: ((CY + ORB * Math.sin(rad)) / CH) * 100 };
}

function getOrbitalPosition(node: SkyNode) {
  return orbitalNodePositions[node.id] ?? polar(node.deg);
}

function statusCopy(status: SkyNodeStatus) {
  if (status === "active") return { label: "Active", text: "Ready to open now" };
  if (status === "available") return { label: "Available", text: "Can be explored after your next step" };
  if (status === "premium") return { label: "Premium", text: "Available with Intro access or Premium" };
  if (status === "completed") return { label: "Completed", text: "Already opened" };
  return { label: "Locked", text: "Opens after more daily progress" };
}

function statusColor(status: SkyNodeStatus) {
  if (status === "active" || status === "available" || status === "completed") return "var(--gold-2)";
  if (status === "premium") return "var(--gold)";
  return "var(--muted-2)";
}

export default function SkyPage() {
  const [tab, setTab] = useState<"all" | "active" | "available">("all");
  const [gender, setGender] = useState<"female" | "male">("female");
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const { entitlements } = useEntitlements();
  const hasPremiumAccess = entitlements.canAccessPremiumNodes;
  const [howOpen, setHowOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SkyNode | null>(null);
  const [paywallContext, setPaywallContext] = useState<{ title: string; description: string } | null>(null);
  const [prelandExperience, setPrelandExperience] = useState<PrelandExperience | null>(null);
  const [featureInfo, setFeatureInfo] = useState<Omit<FeatureInfoSheetProps, "onClose"> | null>(null);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCompletedCount(getTodayProgress().completedCount);
    setPrelandExperience(getPrelandExperience(getPrelandContext()));
    void getCurrentProfile().then((profile) => {
      if (!cancelled && profile && !profile.onboardingCompleted) {
        window.location.assign("/onboarding");
        return;
      }
      if (!cancelled && profile?.gender === "male") setGender("male");
      if (!cancelled) setBirthDate(profile?.birthDate ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const nodes = useMemo(() => resolveSkyNodes({ completedCount, hasPremiumAccess, birthDate }), [completedCount, hasPremiumAccess, birthDate]);
  const visibleNodes = nodes.filter((node) => {
    if (tab === "all") return true;
    if (tab === "active") return node.status === "active" || node.status === "completed";
    return node.status === "available";
  });
  const activeNode = nodes.find((node) => node.status === "active") ?? nodes[0];
  const nextLocked = nodes.find((node) => node.status === "locked" || node.status === "premium") ?? nodes[1];
  const bgImage = gender === "male" ? "/assets/sky-background/sky-backroung-man.png" : "/assets/sky-background/sky-background-woman.png";

  const openReminders = () => setFeatureInfo({
    title: "Soul reminders",
    description: "This section is being prepared for the full release. For alpha, return to Home to continue your daily path.",
    statusLabel: "Coming soon",
    primaryActionLabel: "Got it",
  });
  const openMoonMode = () => setFeatureInfo({
    title: "Moon Mode",
    description: "This section is being prepared for the full release. It is not unlocked by payment in the current alpha build.",
    statusLabel: "Coming soon",
    primaryActionLabel: "Got it",
  });

  function openNodePaywall(node: SkyNode) {
    if (prelandExperience) {
      setPaywallContext({
        title: prelandExperience.paywallTitle,
        description: prelandExperience.paywallDescription,
      });
      setSubscriptionOpen(true);
      return;
    }
    setPaywallContext({
      title: `Unlock ${node.title}`,
      description: `Start 3-day introductory access for $1 to unlock this insight and continue your path. ${node.description}`,
    });
    setSubscriptionOpen(true);
  }

  function nodeVisible(node: SkyNode) {
    return visibleNodes.some((visible) => visible.id === node.id);
  }

  return (
    <div className="app sky-page">
      <StarField orbits={false} />
      <div className="content" style={{ paddingBottom: 100 }}>
        <header className="app-topbar">
          <div className="app-topbar__logo"><Logo variant="header" /></div>
          <div className="app-topbar__actions">
            <GuideTopBarButton />
            <PlanChip />
            <button className="icon-btn" aria-label="Soul reminders" title="Soul reminders" onClick={openReminders}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg></button>
            <button className="icon-btn" aria-label="Moon Mode" title="Moon Mode" onClick={openMoonMode}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"/></svg></button>
          </div>
        </header>

        <section style={{ ...cardStyle, padding: "18px 18px", marginBottom: 12 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", marginBottom: 8, lineHeight: 1.05 }}>Your Sky Map</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>This map shows the areas of your path. Complete daily practices to unlock deeper insights.</p>
          <Link href="/today" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: "0 18px", borderRadius: 999, background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-ui)", textDecoration: "none", boxShadow: "0 8px 24px rgba(90,32,144,.38)" }}>
            Continue today’s path
          </Link>
        </section>

        <section style={{ ...cardStyle, padding: 15, marginBottom: 12 }}>
          <button type="button" onClick={() => setHowOpen((value) => !value)} aria-expanded={howOpen} style={{ width: "100%", border: "none", background: "transparent", color: "inherit", padding: 0, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-ui)" }}>
            <div>
              <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>How your Sky Map works</p>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>Your Sky Map is the long-term map of your personal path. Daily readings, practices, cards, and reflections open new points over time.</p>
            </div>
            <span style={{ color: "var(--gold-2)", fontSize: 18, lineHeight: 1 }}>{howOpen ? "−" : "+"}</span>
          </button>
          <div style={{ display: "grid", gap: 7, marginTop: 12 }}>
            {["Complete daily actions to open signals.", "Signals unlock deeper nodes in your map.", "Premium nodes reveal past-life, relationship, and deeper chart insights."].map((item) => (
              <p key={item} style={{ color: "var(--text)", fontSize: 12, lineHeight: 1.45 }}><span style={{ color: "var(--gold-2)", fontWeight: 900 }}>✦</span> {item}</p>
            ))}
          </div>
          {howOpen && (
            <div style={{ border: "1px solid rgba(216,168,95,.14)", borderRadius: 16, background: "rgba(255,255,255,.035)", padding: 12, marginTop: 12 }}>
              <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800, marginBottom: 5 }}>Learn how unlocks work</p>
              <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>Free gives you a preview of your map. Intro access and Premium unlock deeper nodes, full readings, reports, and progress features.</p>
            </div>
          )}
        </section>

        <section style={{ ...cardStyle, padding: 13, marginBottom: 14 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>Node status legend</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            {(["active", "available", "locked", "premium", "completed"] as SkyNodeStatus[]).map((status) => {
              const copy = statusCopy(status);
              return (
                <div key={status} style={{ border: "1px solid rgba(216,168,95,.12)", borderRadius: 14, background: "rgba(255,255,255,.03)", padding: 9 }}>
                  <p style={{ color: statusColor(status), fontSize: 11, fontWeight: 900, marginBottom: 3 }}>{copy.label}</p>
                  <p style={{ color: "var(--muted-2)", fontSize: 10, lineHeight: 1.35 }}>{copy.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div data-tour="sky-map-filters" style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {([
            ["all", "All"],
            ["active", "Active"],
            ["available", "Available"],
          ] as const).map(([value, label]) => (
            <button key={value} onClick={() => setTab(value)} style={{ flex: 1, padding: "10px 0", borderRadius: 999, border: `1px solid ${tab === value ? "transparent" : "rgba(255,255,255,.12)"}`, background: tab === value ? "linear-gradient(135deg, #7030b0, #4a1880)" : "rgba(255,255,255,.04)", color: tab === value ? "#fff" : "var(--muted)", fontSize: 13, fontWeight: tab === value ? 700 : 500, fontFamily: "var(--font-ui)", cursor: "pointer", boxShadow: tab === value ? "0 4px 14px rgba(80,20,130,.4)" : "none", transition: "all .2s" }}>{label}</button>
          ))}
        </div>

        <div data-tour="sky-map-main" style={{ position: "relative", height: 460, borderRadius: 24, overflow: "hidden", border: "1px solid rgba(216,168,95,.15)", background: "#06040f", marginBottom: 16 }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", filter: "blur(28px)", opacity: .5 }}>
            <div style={{ position: "absolute", width: 240, height: 130, left: "50%", top: "35%", transform: "translate(-50%,-50%)", background: "rgba(90,40,180,.3)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", width: 160, height: 100, left: "20%", top: "65%", background: "rgba(50,70,200,.18)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", width: 160, height: 100, right: "10%", top: "25%", background: "rgba(160,40,120,.16)", borderRadius: "50%" }} />
          </div>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 268, height: 268, borderRadius: "50%", overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
            <Image src={bgImage} alt="Sky Map figure" fill style={{ objectFit: "cover", objectPosition: "center center" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 28%, rgba(6,4,15,.7) 65%, rgba(6,4,15,.97) 100%)" }} />
          </div>
          {[286, 246, 206].map((size, index) => <div key={size} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: size, height: size, borderRadius: "50%", border: `1px solid rgba(216,168,95,${0.05 + index * 0.03})`, pointerEvents: "none", zIndex: 2 }} />)}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 3, pointerEvents: "none" }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx={OCX} cy={OCY} rx={ORX} ry={ORY} fill="none" stroke="rgba(216,168,95,.28)" strokeWidth={0.35} strokeDasharray="1.2 1.2" />
            {nodes.map((node) => {
              const p = getOrbitalPosition(node);
              const dim = !nodeVisible(node);
              return <line key={node.id} x1={OCX} y1={OCY} x2={p.x} y2={p.y} stroke={dim ? "rgba(120,100,180,.1)" : "rgba(216,168,95,.18)"} strokeWidth={0.4} />;
            })}
          </svg>
          {nodes.map((node) => {
            const pos = getOrbitalPosition(node);
            const dim = !nodeVisible(node);
            const isActive = node.status === "active";
            const isPremium = node.status === "premium";
            const isLocked = node.status === "locked";
            const size = isActive ? 64 : 56;
            return (
              <div key={node.id} style={{ position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)", zIndex: isActive ? 8 : 4 + node.num, opacity: dim ? .22 : 1, transition: "opacity .25s", pointerEvents: dim ? "none" : "auto" }}>
                <button type="button" onClick={() => setSelectedNode(node)} aria-label={`${node.title} node preview`} style={{ border: "none", background: "transparent", padding: 0, width: 82, minHeight: 88, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", fontFamily: "var(--font-ui)", touchAction: "manipulation" }}>
                  <div style={{ width: size, height: size, borderRadius: "50%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    <Image src={node.emblem} alt={node.title} fill style={{ objectFit: "contain", opacity: isLocked || isPremium ? .56 : 1 }} />
                    {isActive && <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", background: "linear-gradient(135deg, #d8a85f, #8040c0)", border: "1.5px solid rgba(216,168,95,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, zIndex: 5, boxShadow: "0 0 8px rgba(216,168,95,.5)" }}>★</div>}
                    {(isLocked || isPremium) && <div style={{ position: "absolute", bottom: 4, right: 4, zIndex: 5, lineHeight: 0, filter: "drop-shadow(0 1px 3px rgba(0,0,0,.8))" }}><Image src="/assets/icons/icon-lock.png" alt="Locked" width={24} height={24} style={{ objectFit: "contain" }} /></div>}
                  </div>
                  <div style={{ textAlign: "center", lineHeight: 1.25 }}>
                    <div style={{ fontSize: isActive ? 10.5 : 9.5, fontWeight: isActive ? 800 : 700, color: isActive ? "var(--gold-2)" : isPremium ? "var(--muted-2)" : "var(--text)", textShadow: isActive ? "0 0 8px rgba(216,168,95,.5)" : "none", overflowWrap: "anywhere" }}>{node.num}. {node.title}</div>
                    <div style={{ fontSize: 8.5, color: statusColor(node.status), fontWeight: 800 }}>{statusCopy(node.status).label}</div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <section style={{ ...cardStyle, padding: 16, marginBottom: 14 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Map nodes</p>
          <div style={{ display: "grid", gap: 10 }}>
            {nodes.map((node) => (
              <button key={node.id} type="button" onClick={() => setSelectedNode(node)} style={{ border: "1px solid rgba(216,168,95,.14)", borderRadius: 18, background: "rgba(255,255,255,.035)", padding: 13, textAlign: "left", cursor: "pointer", fontFamily: "var(--font-ui)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>{node.title}</h2>
                    <p style={{ color: "var(--muted-2)", fontSize: 11, fontWeight: 800, marginTop: 4 }}>{node.category}</p>
                  </div>
                  <span style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 999, color: statusColor(node.status), background: "rgba(216,168,95,.07)", padding: "5px 9px", fontSize: 10, fontWeight: 900 }}>{statusCopy(node.status).label}</span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 7 }}>{node.meaning}</p>
                <p style={{ color: "var(--gold-2)", fontSize: 11, lineHeight: 1.4, fontWeight: 800 }}>{node.requirement}</p>
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, padding: 16 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", marginBottom: 10 }}>Current point</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", flexShrink: 0, position: "relative", overflow: "hidden" }}>
              <Image src={activeNode.emblem} alt={activeNode.title} fill style={{ objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 2 }}>{activeNode.title}</p>
              <p style={{ fontSize: 12, color: "var(--muted)" }}>Start here, then continue today's path to open deeper map areas.</p>
            </div>
            <button type="button" onClick={() => setSelectedNode(activeNode)} style={{ display: "flex", alignItems: "center", gap: 5, border: "1px solid rgba(216,168,95,.35)", borderRadius: 999, padding: "8px 14px", fontSize: 12, color: "var(--gold-2)", fontWeight: 800, background: "rgba(216,168,95,.06)", whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer" }}>
              Open
            </button>
          </div>
          {nextLocked && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", marginTop: 14, paddingTop: 14 }}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--muted)", marginBottom: 6 }}>Next unlock</p>
              <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 800 }}>{nextLocked.title}</p>
              <p style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 3 }}>{nextLocked.requirement}</p>
            </div>
          )}
        </section>
      </div>

      <BottomNav />
      {featureInfo && <FeatureInfoSheet {...featureInfo} onClose={() => setFeatureInfo(null)} />}
      <NodePreviewSheet node={selectedNode} onClose={() => setSelectedNode(null)} onOpenSubscription={openNodePaywall} />
      <SubscriptionModal isOpen={subscriptionOpen} onClose={() => setSubscriptionOpen(false)} contextTitle={paywallContext?.title ?? "Unlock this Sky Map node"} contextDescription={paywallContext?.description ?? "Start 3-day introductory access for $1 to unlock this insight and continue your path."} trialCtaLabel={prelandExperience ? "Unlock for $1" : undefined} />
    </div>
  );
}
