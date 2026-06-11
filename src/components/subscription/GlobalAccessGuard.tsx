"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StarField } from "@/components/app-shell/StarField";

// ---------------------------------------------------------------------------
// Route classification
// ---------------------------------------------------------------------------

/**
 * Routes where global access gating is skipped entirely.
 * Includes public pages, auth flows, paywall pages, and checkout.
 */
const ACCESS_FREE_EXACT = new Set([
  "/",
  "/welcome",
  "/welcome-head",
  "/login",
  "/register",
  "/reset-password",
  "/auth/callback",
  "/onboarding",
  // Paywalls
  "/paywall",
  "/claim/paywall",
  // Checkout
  "/checkout/success",
  "/checkout/cancel",
  // Legal / info
  "/privacy",
  "/policy",
  "/terms",
  "/billing",
  "/money-back",
  "/money",
  "/cancellation",
  "/delivery",
  "/support",
  "/manifest.webmanifest",
]);

function isAccessFree(pathname: string) {
  return (
    ACCESS_FREE_EXACT.has(pathname) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/checkout/")
  );
}

// ---------------------------------------------------------------------------
// Access status response type
// ---------------------------------------------------------------------------

type AccessStatus = {
  active: boolean;
  pendingClaim: { id: string } | null;
};

// ---------------------------------------------------------------------------
// Loading overlay
// ---------------------------------------------------------------------------

function AccessCheckOverlay() {
  return (
    <main
      className="app no-nav"
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <StarField />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          justifyItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid rgba(216,168,95,.18)",
            borderTopColor: "var(--gold)",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Opening your path…</p>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// GlobalAccessGuard
// ---------------------------------------------------------------------------

/**
 * Global paywall gate. Wraps all routes in the root layout.
 *
 * - Access-free routes (paywall, auth, checkout, legal): rendered immediately.
 * - All other routes: check /api/access/status first.
 *   - active: render children.
 *   - inactive + pending claim: redirect → /claim/paywall.
 *   - inactive + no claim: redirect → /paywall.
 *   - unauthenticated (401): let AuthRouteGuard handle → redirect → /login.
 *   - network error: fail open (render children) — auth layers still protect.
 *
 * The check runs on every pathname change so client-side navigation is also
 * gated. Results are cached in a ref keyed by access state to avoid duplicate
 * fetches within the same session.
 */
export function GlobalAccessGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // "idle" before first render; then "checking", "allowed", "redirecting"
  const [gateState, setGateState] = useState<"checking" | "allowed" | "redirecting">(
    isAccessFree(pathname) ? "allowed" : "checking"
  );

  // Cache: once active access is confirmed, keep it for subsequent navigations.
  // Reset to false only when the component re-mounts (full page reload).
  const accessConfirmedRef = useRef(false);
  const activeCheckRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isAccessFree(pathname)) {
      setGateState("allowed");
      return;
    }

    // If access was already confirmed this session, allow immediately
    if (accessConfirmedRef.current) {
      setGateState("allowed");
      return;
    }

    // Cancel any in-flight check from a previous navigation
    activeCheckRef.current?.abort();
    const controller = new AbortController();
    activeCheckRef.current = controller;

    setGateState("checking");

    void fetch("/api/access/status", { signal: controller.signal })
      .then(async (res) => {
        if (controller.signal.aborted) return;

        // Unauthenticated — AuthRouteGuard handles the login redirect
        if (res.status === 401) {
          setGateState("allowed");
          return;
        }

        // Fail open on server errors
        if (!res.ok) {
          setGateState("allowed");
          return;
        }

        const json = (await res.json()) as AccessStatus;

        if (json.active) {
          accessConfirmedRef.current = true;
          setGateState("allowed");
          return;
        }

        // No active access — redirect to appropriate paywall
        setGateState("redirecting");
        if (json.pendingClaim) {
          router.replace("/claim/paywall");
        } else {
          router.replace("/paywall");
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        // Fail open — auth layers still protect
        setGateState("allowed");
      });

    return () => {
      controller.abort();
    };
  }, [pathname, router]);

  if (gateState === "checking" || gateState === "redirecting") {
    return <AccessCheckOverlay />;
  }

  return <>{children}</>;
}
