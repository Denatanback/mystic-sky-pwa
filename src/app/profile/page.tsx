"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { signOut } from "@/lib/auth/authAdapter";
import { useLang } from "@/lib/i18n";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { FeatureInfoSheet, type FeatureInfoSheetProps } from "@/components/ui/FeatureInfoSheet";
import { PlanChip } from "@/components/subscription/PlanChip";
import { getDeepPathState, getFirstSignalState, type DeepPathState, type FirstSignalState } from "@/lib/progress/dailyProgress";
import { getCurrentProfile, type CurrentProfile } from "@/lib/profile/currentProfile";
import { resolveUserZodiac } from "@/lib/astrology/resolveZodiac";

function IconMoon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a7 7 0 1 0 11.5 11.5Z"/></svg>; }
function IconJournal() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12v18H6z"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h4"/></svg>; }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>; }
function IconBell() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function IconChevron() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>; }
function IconLogout() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function IconSupport() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.5 1.2-1.9 1.7-2.5 2.7-.2.3-.3.7-.3 1.3"/><path d="M12 17h.01"/></svg>; }

const SUPPORT_EMAIL = "support@myeluna.com";
const SUPPORT_MAILTO = "mailto:support@myeluna.com?subject=eLuna%20Support%20Request";

function MenuItem({ icon, title, sub, href, onClick, danger=false }: { icon: React.ReactNode; title: string; sub: string; href?: string; onClick?: () => void; danger?: boolean; }) {
  const itemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: danger ? "rgba(206,116,109,.07)" : "transparent", border: `1px solid ${danger ? "rgba(206,116,109,.22)" : "var(--line-soft)"}`, borderRadius: "var(--radius-md)", cursor: "pointer", width: "100%", textAlign: "left" as const };
  const iconCircle: React.CSSProperties = { width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: danger ? "rgba(206,116,109,.15)" : "rgba(216,168,95,.10)", border: `1px solid ${danger ? "rgba(206,116,109,.30)" : "rgba(216,168,95,.20)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: danger ? "var(--danger)" : "var(--gold)" };
  const content = (<><div style={iconCircle}>{icon}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600, color: danger ? "var(--danger)" : "var(--text)" }}>{title}</div><div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2 }}>{sub}</div></div><span style={{ color: "var(--muted-2)", flexShrink: 0 }}><IconChevron /></span></>);
  if (href?.startsWith("mailto:")) return <a href={href} style={{ display: "block", textDecoration: "none" }}><div style={itemStyle}>{content}</div></a>;
  if (href) return <Link href={href} style={{ display: "block", textDecoration: "none" }}><div style={itemStyle}>{content}</div></Link>;
  return <button onClick={onClick} style={{ ...itemStyle, fontFamily: "inherit" }}>{content}</button>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLang();
  const [fullName, setFullName] = useState("...");
  const [userProfile, setUserProfile] = useState<CurrentProfile | null>(null);
  const [deepPathState, setDeepPathState] = useState<DeepPathState>(() => getDeepPathState());
  const [firstSignalState, setFirstSignalState] = useState<FirstSignalState>(() => getFirstSignalState());
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [featureInfo, setFeatureInfo] = useState<Omit<FeatureInfoSheetProps, "onClose"> | null>(null);
  const zodiac = resolveUserZodiac(userProfile);
  const zodiacLine = zodiac.key === "unknown" ? "Mystic profile" : `${zodiac.name} · ${zodiac.source === "manual" ? "selected manually" : zodiac.dateRange}`;
  const personalChartSub = zodiac.key === "unknown" ? "Complete setup to reveal your chart" : `Sun sign: ${zodiac.name}${zodiac.source === "manual" ? " · selected manually" : userProfile?.birthPlace ? ` · ${userProfile.birthPlace}` : ""}`;
  const openReminders = () => setFeatureInfo({
    title: "Soul reminders",
    description: "This section is being prepared for the full release. For alpha, return to Home to continue your daily path.",
    statusLabel: "Coming soon",
    primaryActionLabel: "Got it",
  });
  const openPersonalChart = () => setFeatureInfo({
    title: "Personal Chart",
    description: "This section is being prepared for the full release. For alpha, your zodiac sign, birth place, and setup are saved in Profile.",
    statusLabel: "Coming soon",
    primaryActionLabel: "Continue exploring",
  });
  useEffect(() => {
    let cancelled = false;
    void getCurrentProfile().then((user) => {
      if (!user) {
        router.push("/welcome");
        return;
      }
      if (!user.onboardingCompleted) {
        router.replace("/onboarding");
        return;
      }
      if (!cancelled && user) {
        setUserProfile(user);
        setDeepPathState(getDeepPathState());
        setFirstSignalState(getFirstSignalState());
        if (user.fullName) setFullName(user.fullName.trim());
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleLogout() {
    await signOut();
    router.push("/welcome");
    router.refresh();
  }

  return (
    <div className="app">
      <StarField />
      <div className="content">
        <header className="header" data-tour="profile-button">
          <div className="screen-title"><h1>{t.profile.title}</h1><p>{t.profile.subtitle}</p></div>
          <button className="icon-btn" aria-label="Soul reminders" title="Soul reminders" onClick={openReminders}><IconBell /></button>
          <GuideTopBarButton />
          <PlanChip />
        </header>

        {/* Avatar hero */}
        <div style={{ background: "transparent", border: "1px solid rgba(216,168,95,.22)", borderRadius: "var(--radius-xl)", padding: "28px 20px 24px", textAlign: "center", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", marginBottom: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(120,60,200,.20), transparent)" }} />
          <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
            <div style={{ position: "absolute", inset: -12, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,60,200,.22) 0%, transparent 70%)" }} />
            <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1px solid rgba(216,168,95,.25)" }} />
            <div style={{ width: 78, height: 78, borderRadius: "50%", background: "radial-gradient(circle at 35% 28%, rgba(247,217,139,.20), rgba(128,64,192,.52) 56%, rgba(28,14,58,.96))", border: "2px solid rgba(216,168,95,.44)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: zodiac.key === "unknown" ? 38 : 46, lineHeight: 1, color: "var(--gold-2)", position: "relative", zIndex: 1, boxShadow: "0 0 28px rgba(120,60,200,.42), inset 0 1px 0 rgba(255,255,255,.12)", textShadow: "0 0 18px rgba(247,217,139,.28)" }}>{zodiac.glyph}</div>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", letterSpacing: ".02em" }}>{fullName}</h2>
          <p style={{ fontSize: 12, color: "var(--gold-2)", marginTop: 5, fontWeight: 700 }}>{zodiacLine}</p>
          <p style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 4 }}>{userProfile?.email || t.profile.zodiac}</p>
          {userProfile?.birthPlace && (
            <p style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 3 }}>{userProfile.birthPlace}</p>
          )}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(216,168,95,.10)", border: "1px solid rgba(216,168,95,.25)", borderRadius: 20, padding: "4px 14px", marginTop: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 12 }}>&#127769;</span>
            <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 500 }}>Start your streak today</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, borderTop: "1px solid var(--line-soft)", paddingTop: 18 }}>
            {[{ val: "0", label: "days", color: "var(--gold)" }, { val: "0", label: "cards opened", color: "var(--rose)" }, { val: "0", label: "reflections", color: "var(--blue)" }].map((s, i) => (
              <div key={s.label} style={{ textAlign: "center", borderRight: i < 2 ? "1px solid var(--line-soft)" : "none" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "var(--font-ui)", lineHeight: 1.1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Path progress */}
        <div style={{ background: "transparent", border: "1px solid rgba(216,168,95,.18)", borderRadius: "var(--radius-lg)", padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
          <div style={{ flexShrink: 0, width: 60, height: 60, borderRadius: "50%", border: `1px solid ${deepPathState.firstSignalUnlocked ? "rgba(216,168,95,.54)" : "rgba(216,168,95,.28)"}`, background: deepPathState.firstSignalUnlocked ? "rgba(216,168,95,.14)" : "rgba(216,168,95,.08)", display: "grid", placeItems: "center", color: "var(--gold-2)", fontSize: 22, boxShadow: deepPathState.firstSignalUnlocked ? "0 0 18px rgba(216,168,95,.18)" : "none" }}>
            ✦
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{deepPathState.title}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{deepPathState.text}</div>
            <div style={{ fontSize: 11, color: "var(--gold)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", display: "inline-block", boxShadow: "0 0 4px var(--gold)" }}/>
              {firstSignalState.integrated ? "First signal integrated" : deepPathState.firstSignalUnlocked ? "First signal unlocked" : "Locked"}
            </div>
          </div>
          {deepPathState.firstSignalUnlocked && (
            <Link href="/path" style={{ border: "1px solid rgba(216,168,95,.32)", borderRadius: 999, color: "var(--gold-2)", padding: "8px 12px", fontSize: 12, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>
              {firstSignalState.integrated ? "View" : "Open"}
            </Link>
          )}
        </div>

        {/* Menu */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <MenuItem icon={<IconMoon />}     title={t.profile.personalChart}  sub={personalChartSub} onClick={openPersonalChart} />
          <MenuItem icon={<IconSettings />} title="Edit birth data" sub="Update your chart source" href="/onboarding?step=birth&mode=edit" />
          <MenuItem icon={<IconJournal />}  title={t.profile.journalMenu}    sub={t.profile.journalMenuSub}   href="/journal" />
          <MenuItem icon={<IconSettings />} title={t.profile.settings}       sub={t.profile.settingsSub}      href="/settings" />
          <MenuItem icon={<IconSupport />} title="Support" sub="Questions about your account, intro access, billing, cancellation, or refund request." href={SUPPORT_MAILTO} />
        </div>

        <div style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,.035)", padding: "12px 14px", marginBottom: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>
            Questions about your account, intro access, billing, cancellation, or refund request?{" "}
            <a href={SUPPORT_MAILTO} style={{ color: "var(--gold-2)", fontWeight: 800, textDecoration: "none" }}>
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>

        {/* Logout */}
        {!confirmLogout ? (
          <MenuItem icon={<IconLogout />} title={t.profile.signOut} sub={t.profile.signOutSub} onClick={() => setConfirmLogout(true)} danger />
        ) : (
          <div style={{ background: "rgba(206,116,109,.10)", border: "1px solid rgba(206,116,109,.30)", borderRadius: "var(--radius-md)", padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--text)", marginBottom: 12 }}>{t.profile.signOutConfirm}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmLogout(false)} style={{ flex: 1, height: 42, borderRadius: 999, border: "1px solid rgba(255,255,255,.15)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>{t.profile.cancel}</button>
              <button onClick={handleLogout} style={{ flex: 1, height: 42, borderRadius: 999, border: "none", background: "rgba(206,116,109,.25)", color: "#e87070", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>{t.profile.signOut}</button>
            </div>
          </div>
        )}

      </div>
      <BottomNav />
      {featureInfo && <FeatureInfoSheet {...featureInfo} onClose={() => setFeatureInfo(null)} />}
    </div>
  );
}
