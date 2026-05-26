"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { updatePassword } from "@/lib/auth/authAdapter";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess("Your password has been updated.");
    window.setTimeout(() => router.push("/login"), 900);
  }

  return (
    <main className="app welcome-bg no-nav" style={{ padding: "0 18px 40px" }}>
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18 }}>
          <Link href="/login" style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)",
          }} aria-label="Back to login">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
            </svg>
          </Link>
        </div>

        <div className="auth-brand">
          <Logo variant="auth" priority />
        </div>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, color: "var(--text)", lineHeight: 1.15, marginBottom: 8 }}>
            Create new password
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            Choose a secure password for your eLuna account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(12,10,32,.82)",
            border: "1px solid rgba(216,168,95,.18)",
            borderRadius: 24,
            backdropFilter: "blur(12px)",
            padding: "22px 20px",
            boxShadow: "0 20px 50px rgba(0,0,0,.4)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {[
            { label: "New password", value: password, setter: setPassword },
            { label: "Confirm password", value: confirmPassword, setter: setConfirmPassword },
          ].map((field) => (
            <div key={field.label}>
              <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 6, letterSpacing: ".04em" }}>{field.label}</label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,.05)",
                border: "1px solid var(--line-soft)",
                borderRadius: "var(--radius-sm)",
                padding: "12px 14px",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  type="password"
                  value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "var(--text)", fontSize: 14, fontFamily: "var(--font-ui)",
                  }}
                />
              </div>
            </div>
          ))}

          {error && <p style={{ color: "var(--danger)", fontSize: 12, lineHeight: 1.4, margin: 0 }}>{error}</p>}
          {success && <p style={{ color: "var(--gold-2)", fontSize: 12, lineHeight: 1.45, margin: 0 }}>{success}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              height: 52, borderRadius: 999,
              background: loading ? "rgba(128,64,192,.5)" : "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
              color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "var(--font-ui)",
              border: "none", cursor: loading ? "default" : "pointer",
              boxShadow: loading ? "none" : "0 8px 28px rgba(90,32,144,.45), inset 0 1px 0 rgba(255,255,255,.12)",
            }}
          >
            {loading ? "Saving..." : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}
