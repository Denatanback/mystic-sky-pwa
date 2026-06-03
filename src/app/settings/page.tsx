"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { useLang, type Lang, ENABLE_RU_LOCALE } from "@/lib/i18n";
import { GuideTopBarButton } from "@/components/guide/GuideTopBarButton";
import { FeatureInfoSheet, type FeatureInfoSheetProps } from "@/components/ui/FeatureInfoSheet";
import { updatePassword } from "@/lib/auth/authAdapter";

function IconChevron() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}
function IconGlobe() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function IconBell() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
function IconShield() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function IconSupport() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.5 1.2-1.9 1.7-2.5 2.7-.2.3-.3.7-.3 1.3"/><path d="M12 17h.01"/></svg>;
}

const SUPPORT_EMAIL = "support@myeluna.com";
const SUPPORT_MAILTO = "mailto:support@myeluna.com?subject=eLuna%20Support%20Request";

export default function SettingsPage() {
  const { t, lang, setLang } = useLang();
  const [featureInfo, setFeatureInfo] = useState<Omit<FeatureInfoSheetProps, "onClose"> | null>(null);
  const [legalReturnTo, setLegalReturnTo] = useState("/settings");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setLegalReturnTo(`${window.location.pathname}${window.location.search}${window.location.hash}`);
  }, []);

  function legalHref(path: string) {
    return `${path}?returnTo=${encodeURIComponent(legalReturnTo)}`;
  }

  const openNotifications = () => setFeatureInfo({
    title: "Soul reminders",
    description: "This section is being prepared for the full release. For alpha, return to Home to continue your daily path.",
    statusLabel: "Coming soon",
    primaryActionLabel: "Got it",
  });
  const openPrivacy = () => setFeatureInfo({
    title: "Privacy controls",
    description: "This section is being prepared for the full release. Account privacy, data export, and deeper controls should be connected before a wider launch.",
    statusLabel: "Coming soon",
    primaryActionLabel: "Got it",
  });
  async function handlePasswordUpdate(event: React.FormEvent) {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("Use at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation must match.");
      return;
    }

    setPasswordLoading(true);
    const result = await updatePassword(newPassword);
    setPasswordLoading(false);

    if (result.error) {
      setPasswordError("Could not update password. Please try again.");
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("Password updated successfully.");
  }

  const iconCircle: React.CSSProperties = {
    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
    background: "rgba(216,168,95,.10)", border: "1px solid rgba(216,168,95,.20)",
    display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)",
  };
  return (
    <div className="app">
      <StarField />
      <div className="content">
        <header className="header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/profile" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(216,168,95,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", textDecoration: "none", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <div className="screen-title">
              <h1>{t.settings.title}</h1>
              <p>{t.settings.subtitle}</p>
            </div>
          </div>
          <GuideTopBarButton />
        </header>

        {/* Language */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>{t.settings.language}</p>
          <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: "1px solid var(--line-soft)" }}>
              <div style={iconCircle}><IconGlobe /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t.settings.language}</div>
                <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2 }}>{t.settings.languageSub}</div>
              </div>
            </div>
            <div style={{ display: "flex", padding: "12px 16px", gap: 10 }}>
              {ENABLE_RU_LOCALE ? (
                (["en", "ru"] as Lang[]).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    flex: 1, padding: "12px 0", borderRadius: "var(--radius-md)", cursor: "pointer",
                    fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: lang === l ? 700 : 500,
                    border: `1.5px solid ${lang === l ? "rgba(216,168,95,.7)" : "rgba(255,255,255,.1)"}`,
                    background: lang === l ? "rgba(216,168,95,.12)" : "rgba(255,255,255,.03)",
                    color: lang === l ? "var(--gold)" : "var(--muted)",
                    transition: "all .2s",
                    boxShadow: lang === l ? "0 0 12px rgba(216,168,95,.2)" : "none",
                  }}>
                    {l === "en" ? t.settings.english : t.settings.russian}
                  </button>
                ))
              ) : (
                /* RU temporarily disabled — show read-only EN indicator */
                <div style={{
                  flex: 1, padding: "12px 0", borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700,
                  border: "1.5px solid rgba(216,168,95,.7)",
                  background: "rgba(216,168,95,.12)",
                  color: "var(--gold)",
                  textAlign: "center",
                  boxShadow: "0 0 12px rgba(216,168,95,.2)",
                }}>
                  {t.settings.english}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>{t.settings.notifications}</p>
          <button type="button" onClick={openNotifications} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "transparent", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-ui)" }}>
            <div style={iconCircle}><IconBell /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t.settings.notifications}</div>
              <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2 }}>{t.settings.notificationsSub}</div>
            </div>
            <span style={{ color: "var(--muted-2)" }}><IconChevron /></span>
          </button>
        </div>

        {/* Privacy */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>{t.settings.privacy}</p>
          <button type="button" onClick={openPrivacy} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "transparent", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-ui)" }}>
            <div style={iconCircle}><IconShield /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t.settings.privacy}</div>
              <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2 }}>{t.settings.privacySub}</div>
            </div>
            <span style={{ color: "var(--muted-2)" }}><IconChevron /></span>
          </button>
        </div>

        {/* Support */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>Legal</p>
          <div style={{ border: "1px solid rgba(216,168,95,.18)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            {[
              ["Privacy Policy", legalHref("/privacy")],
              ["Terms of Use", legalHref("/terms")],
              ["Billing Terms", legalHref("/billing")],
              ["Money-Back Policy", legalHref("/money-back")],
            ].map(([label, href], index) => (
              <Link key={label} href={href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 44, padding: "0 16px", color: "var(--text)", textDecoration: "none", borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,.06)" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
                <span style={{ color: "var(--muted-2)" }}><IconChevron /></span>
              </Link>
            ))}
          </div>
          <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.5, marginTop: 10 }}>
            eLuna guidance is for reflection and self-awareness. It is not medical, legal, financial, or crisis advice.
          </p>
        </div>

        <div>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>Account & billing</p>
          <a href={SUPPORT_MAILTO} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "transparent", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
            <div style={iconCircle}><IconSupport /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Support email</div>
              <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2 }}>Questions about your account, trial, billing, cancellation, or refund request.</div>
              <div style={{ fontSize: 12, color: "var(--gold-2)", marginTop: 4, fontWeight: 800 }}>{SUPPORT_EMAIL}</div>
            </div>
            <span style={{ color: "var(--muted-2)" }}><IconChevron /></span>
          </a>
        </div>

        <form onSubmit={handlePasswordUpdate} style={{ marginTop: 12, marginBottom: 12, border: "1px solid var(--line-soft)", borderRadius: "var(--radius-md)", padding: "16px", display: "grid", gap: 12, background: "rgba(255,255,255,.025)" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)", lineHeight: 1.1, marginBottom: 5 }}>Change password</h2>
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.55 }}>
              If your account was created with Google or Apple, you may not have a password yet. Setting a password lets you also sign in with email.
            </p>
          </div>

          <label style={{ display: "grid", gap: 6, color: "var(--muted)", fontSize: 12 }}>
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setPasswordError("");
                setPasswordMessage("");
              }}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              style={{ minHeight: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--line-soft)", background: "rgba(255,255,255,.05)", color: "var(--text)", padding: "0 13px", fontSize: 14, fontFamily: "var(--font-ui)" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6, color: "var(--muted)", fontSize: 12 }}>
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setPasswordError("");
                setPasswordMessage("");
              }}
              autoComplete="new-password"
              placeholder="Repeat new password"
              style={{ minHeight: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--line-soft)", background: "rgba(255,255,255,.05)", color: "var(--text)", padding: "0 13px", fontSize: 14, fontFamily: "var(--font-ui)" }}
            />
          </label>

          {passwordError && <p style={{ color: "var(--danger)", fontSize: 12, lineHeight: 1.45 }}>{passwordError}</p>}
          {passwordMessage && <p style={{ color: "var(--gold-2)", fontSize: 12, lineHeight: 1.45, fontWeight: 800 }}>{passwordMessage}</p>}

          <button
            type="submit"
            disabled={passwordLoading}
            style={{ minHeight: 44, borderRadius: 999, border: "none", background: passwordLoading ? "rgba(128,64,192,.5)" : "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 14, fontWeight: 800, fontFamily: "var(--font-ui)", cursor: passwordLoading ? "default" : "pointer" }}
          >
            {passwordLoading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
      <BottomNav />
      {featureInfo && <FeatureInfoSheet {...featureInfo} onClose={() => setFeatureInfo(null)} />}
    </div>
  );
}
