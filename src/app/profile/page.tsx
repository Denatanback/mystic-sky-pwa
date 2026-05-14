"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";

function IconMoon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a7 7 0 1 0 11.5 11.5Z"/></svg>; }
function IconJournal() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12v18H6z"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h4"/></svg>; }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>; }
function IconBell() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function IconChevron() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>; }
function IconLogout() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }

function MenuItem({ icon, title, sub, href, onClick, danger=false }: { icon: React.ReactNode; title: string; sub: string; href?: string; onClick?: () => void; danger?: boolean; }) {
  const itemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: danger ? "rgba(206,116,109,.07)" : "transparent", border: `1px solid ${danger ? "rgba(206,116,109,.22)" : "var(--line-soft)"}`, borderRadius: "var(--radius-md)", cursor: "pointer", width: "100%", textAlign: "left" as const };
  const iconCircle: React.CSSProperties = { width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: danger ? "rgba(206,116,109,.15)" : "rgba(216,168,95,.10)", border: `1px solid ${danger ? "rgba(206,116,109,.30)" : "rgba(216,168,95,.20)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: danger ? "var(--danger)" : "var(--gold)" };
  const content = (<><div style={iconCircle}>{icon}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600, color: danger ? "var(--danger)" : "var(--text)" }}>{title}</div><div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2 }}>{sub}</div></div><span style={{ color: "var(--muted-2)", flexShrink: 0 }}><IconChevron /></span></>);
  if (href) return <Link href={href} style={{ display: "block", textDecoration: "none" }}><div style={itemStyle}>{content}</div></Link>;
  return <button onClick={onClick} style={{ ...itemStyle, fontFamily: "inherit" }}>{content}</button>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLang();
  const [fullName, setFullName] = useState("...");
  const [confirmLogout, setConfirmLogout] = useState(false);
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/welcome");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const name =
        profile?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "...";

      if (!cancelled) setFullName(name.trim());
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/welcome");
    router.refresh();
  }

  const pathProgress = 2 / 8, r = 26, circ = 2 * Math.PI * r;
  const dash = circ * pathProgress;

  return (
    <div className="app">
      <StarField />
      <div className="content">
        <header className="header">
          <div className="screen-title"><h1>{t.profile.title}</h1><p>{t.profile.subtitle}</p></div>
          <button className="icon-btn" aria-label="Notifications"><IconBell /></button>
        </header>

        {/* Avatar hero */}
        <div style={{ background: "transparent", border: "1px solid rgba(216,168,95,.22)", borderRadius: "var(--radius-xl)", padding: "28px 20px 24px", textAlign: "center", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", marginBottom: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(120,60,200,.20), transparent)" }} />
          <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
            <div style={{ position: "absolute", inset: -12, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,60,200,.22) 0%, transparent 70%)" }} />
            <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1px solid rgba(216,168,95,.25)" }} />
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, rgba(120,60,200,.6) 0%, rgba(80,40,160,.8) 100%)", border: "2px solid rgba(216,168,95,.40)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "relative", zIndex: 1, boxShadow: "0 0 24px rgba(120,60,200,.40)" }}>&#10022;</div>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-serif)", color: "var(--text)", letterSpacing: ".02em" }}>{fullName}</h2>
          <p style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 4 }}>{t.profile.zodiac}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(216,168,95,.10)", border: "1px solid rgba(216,168,95,.25)", borderRadius: 20, padding: "4px 14px", marginTop: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 12 }}>&#127769;</span>
            <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 500 }}>12 {t.profile.streak}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, borderTop: "1px solid var(--line-soft)", paddingTop: 18 }}>
            {[{ val: "12", label: t.profile.days, color: "var(--gold)" }, { val: "18", label: t.profile.cards, color: "var(--rose)" }, { val: "9", label: t.profile.entries, color: "var(--blue)" }].map((s, i) => (
              <div key={s.label} style={{ textAlign: "center", borderRight: i < 2 ? "1px solid var(--line-soft)" : "none" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "var(--font-serif)", lineHeight: 1.1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Path progress */}
        <div style={{ background: "transparent", border: "1px solid rgba(216,168,95,.18)", borderRadius: "var(--radius-lg)", padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
          <div style={{ flexShrink: 0, position: "relative", width: 60, height: 60 }}>
            <svg width="60" height="60" viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)" }}>
              <defs><linearGradient id="profileProgGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8040c0"/><stop offset="100%" stopColor="#d8a85f"/></linearGradient></defs>
              <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="4"/>
              <circle cx="30" cy="30" r={r} fill="none" stroke="url(#profileProgGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--gold)" }}>2/8</div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t.profile.deepPath}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>2 {t.nodePath.of} 8 {t.profile.nodesCompleted}</div>
            <div style={{ fontSize: 11, color: "var(--gold)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", display: "inline-block", boxShadow: "0 0 4px var(--gold)" }}/>
              {t.profile.next} {t.profile.mercury}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <MenuItem icon={<IconMoon />}     title={t.profile.personalChart}  sub={t.profile.personalChartSub} href="#" />
          <MenuItem icon={<IconJournal />}  title={t.profile.journalMenu}    sub={t.profile.journalMenuSub}   href="/journal" />
          <MenuItem icon={<IconSettings />} title={t.profile.settings}       sub={t.profile.settingsSub}      href="/settings" />
        </div>

        {/* Logout */}
        {!confirmLogout ? (
          <MenuItem icon={<IconLogout />} title={t.profile.signOut} sub={t.profile.signOutSub} onClick={() => setConfirmLogout(true)} danger />
        ) : (
          <div style={{ background: "rgba(206,116,109,.10)", border: "1px solid rgba(206,116,109,.30)", borderRadius: "var(--radius-md)", padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--text)", marginBottom: 12 }}>{t.profile.confirmSignOut}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmLogout(false)} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,.06)", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-sm)", color: "var(--muted)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{t.profile.stay}</button>
              <button onClick={handleLogout} style={{ flex: 1, padding: "10px", background: "rgba(206,116,109,.20)", border: "1px solid rgba(206,116,109,.40)", borderRadius: "var(--radius-sm)", color: "var(--danger)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.profile.signOut}</button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
