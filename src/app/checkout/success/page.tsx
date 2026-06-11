"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { applyClaimToProgress, validateClaim, type ValidPrelandClaim } from "@/lib/claims/claimFlow";

type AccessStatusResponse = {
  active: boolean;
  pendingClaim: {
    id: string;
    claimType: string;
    claimId: string | null;
    funnel: string | null;
    offer: string | null;
    payload: Record<string, unknown>;
  } | null;
  redirectTo: string | null;
};

const MAX_POLL_MS = 90_000; // wait up to 90 s for webhook
const POLL_INTERVAL_MS = 2_500;

function buildClaimFromPending(claim: AccessStatusResponse["pendingClaim"]): ValidPrelandClaim | null {
  if (!claim) return null;
  if (claim.claimType === "past_life_role") {
    const role = claim.payload?.role as string | undefined;
    return validateClaim({ claimType: "past_life_role", payload: { role: role ?? "" }, claimId: claim.claimId ?? undefined, source: "db" });
  }
  if (claim.claimType === "soulmate_type") {
    const soulmateType = claim.payload?.soulmateType as string | undefined;
    return validateClaim({ claimType: "soulmate_type", payload: { soulmateType: soulmateType ?? "" }, claimId: claim.claimId ?? undefined, source: "db" });
  }
  return null;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"polling" | "confirmed" | "timeout" | "error">("polling");
  const [dots, setDots] = useState(".");
  const startRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animated dots
  useEffect(() => {
    const iv = setInterval(() => setDots((d) => d.length >= 3 ? "." : d + "."), 600);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch("/api/access/status");
        if (!response.ok) throw new Error("status check failed");
        const json = await response.json() as AccessStatusResponse;

        if (cancelled) return;

        if (json.active) {
          // Apply pending claim to localStorage progress before navigating
          if (json.pendingClaim) {
            const validClaim = buildClaimFromPending(json.pendingClaim);
            if (validClaim) applyClaimToProgress(validClaim);
            // Mark claim as applied in DB
            await fetch("/api/claims/pending", { method: "DELETE" }).catch(() => null);
          }
          setPhase("confirmed");
          const dest = json.redirectTo ?? "/home";
          // Short delay so the user sees the success state
          timerRef.current = setTimeout(() => {
            if (!cancelled) router.replace(dest);
          }, 1800);
          return;
        }

        // Not active yet — check timeout
        const elapsed = Date.now() - startRef.current;
        if (elapsed >= MAX_POLL_MS) {
          setPhase("timeout");
          return;
        }

        // Keep polling
        timerRef.current = setTimeout(() => { if (!cancelled) void poll(); }, POLL_INTERVAL_MS);
      } catch {
        if (cancelled) return;
        const elapsed = Date.now() - startRef.current;
        if (elapsed >= MAX_POLL_MS) {
          setPhase("timeout");
        } else {
          timerRef.current = setTimeout(() => { if (!cancelled) void poll(); }, POLL_INTERVAL_MS * 2);
        }
      }
    }

    void poll();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router]);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 2,
    width: "min(100%, 460px)",
    margin: "0 auto",
    border: "1px solid rgba(216,168,95,.26)",
    borderRadius: 28,
    background: "radial-gradient(circle at 18% 0%, rgba(216,168,95,.14), transparent 36%), rgba(12,8,28,.86)",
    boxShadow: "0 22px 56px rgba(0,0,0,.42)",
    padding: "26px 20px",
    textAlign: "center",
  };

  return (
    <main className="app no-nav" style={{ minHeight: "100dvh", padding: "24px 18px 40px", display: "grid", alignItems: "center" }}>
      <StarField />
      <section style={containerStyle}>
        <div style={{ display: "grid", justifyItems: "center", marginBottom: 18 }}>
          <Logo variant="auth" />
        </div>

        {phase === "polling" && (
          <>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase", marginBottom: 9 }}>
              Confirming payment
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 30, fontWeight: 600, lineHeight: 1.05, marginBottom: 10 }}>
              Your payment is being confirmed{dots}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Access is activated as soon as Stripe confirms your subscription. This usually takes a few seconds.
            </p>
            <div style={{ width: 36, height: 36, margin: "0 auto", borderRadius: "50%", border: "3px solid rgba(216,168,95,.18)", borderTopColor: "var(--gold)", animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        )}

        {phase === "confirmed" && (
          <>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase", marginBottom: 9 }}>
              Access active
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 30, fontWeight: 600, lineHeight: 1.05, marginBottom: 10 }}>
              Welcome to eLuna ✦
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
              Your access is confirmed. Preparing your path now…
            </p>
          </>
        )}

        {phase === "timeout" && (
          <>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase", marginBottom: 9 }}>
              Still confirming
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 28, fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
              Taking a little longer than usual
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
              Payment confirmation sometimes takes a moment. Your access will activate as soon as Stripe confirms. You can safely close this tab and return later — your subscription will be waiting.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              <button
                onClick={() => { setPhase("polling"); startRef.current = Date.now(); }}
                style={{ minHeight: 46, borderRadius: 999, background: "linear-gradient(135deg,#8040c0,#5a2090)", color: "#fff", fontSize: 14, fontWeight: 900, border: "none", cursor: "pointer" }}
              >
                Check again
              </button>
              <button
                onClick={() => router.push("/home")}
                style={{ minHeight: 42, borderRadius: 999, border: "1px solid rgba(216,168,95,.24)", background: "rgba(216,168,95,.07)", color: "var(--gold-2)", fontSize: 13, fontWeight: 900, cursor: "pointer" }}
              >
                Go to eLuna
              </button>
              <a
                href="mailto:support@myeluna.com?subject=eLuna%20Payment%20Confirmation"
                style={{ color: "var(--muted-2)", fontSize: 12, textDecoration: "none", marginTop: 4 }}
              >
                Contact support
              </a>
            </div>
          </>
        )}

        {phase === "error" && (
          <>
            <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 28, fontWeight: 600, marginBottom: 10 }}>
              Something went wrong
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
              We could not confirm your payment status. Please contact support if you were charged.
            </p>
            <a href="mailto:support@myeluna.com?subject=eLuna%20Payment%20Issue" style={{ color: "var(--gold-2)", fontWeight: 900, fontSize: 13 }}>
              support@myeluna.com
            </a>
          </>
        )}
      </section>
    </main>
  );
}
