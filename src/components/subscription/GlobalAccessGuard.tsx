"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StarField } from "@/components/app-shell/StarField";

// Route classification (mirrors src/lib/supabase/middleware.ts)

const ACCESS_FREE_EXACT = new Set([
  "/",
  "/welcome",
  "/welcome-head",
  "/login",
  "/register",
  "/reset-password",
  "/auth/callback",
  "/onboarding",
  "/paywall",
  "/claim/paywall",
  "/checkout/success",
  "/checkout/cancel",
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

function isAccessFree(pathname: string): boolean {
  return (
    ACCESS_FREE_EXACT.has(pathname) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/checkout/")
  );
}

type AccessStatus = {
  active: boolean;
  pendingClaim: { id: string } | null;
};

type GateState =
  | "checking"    // access check in flight -- render overlay, NEVER children
  | "allowed"     // confirmed active access -- render children
  | "redirecting"; // redirecting to paywall -- render overlay, NEVER children

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
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Opening your path...</p>
      </div>
    </main>
  );
}

/**
 * GlobalAccessGuard -- secondary defence-in-depth client guard.
 *
 * The PRIMARY gate is middleware (src/lib/supabase/middleware.ts), which runs
 * server-side before any HTML is delivered. This component covers:
 *   1. Client-side navigations after session-level access was confirmed.
 *   2. Mid-session subscription expiry.
 *
 * Children are NEVER rendered while gateState is "checking" or "redirecting".
 */
export function GlobalAccessGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Initialise as "checking" for protected routes so the overlay is shown on
  // the very first render -- no flash of content before useEffect fires.
  const [gateState, setGateState] = useState<GateState>(() =>
    isAccessFree(pathname) ? "allowed" : "checking",
  );

  // Session-lifetime cache: once active access is confirmed, skip re-fetching
  // on subsequent client-side navigations. Resets on full page reload.
  const accessConfirmedRef = useRef(false);
  const activeCheckRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isAccessFree(pathname)) {
      setGateState("allowed");
      return;
    }

    // Access already confirmed this session -- allow immediately.
    if (accessConfirmedRef.current) {
      setGateState("allowed");
      return;
    }

    // Cancel any in-flight check from a previous navigation.
    activeCheckRef.current?.abort();
    const controller = new AbortController();
    activeCheckRef.current = controller;

    setGateState("checking");

    void fetch("/api/access/status", { signal: controller.signal })
      .then(async (res) => {
        if (controller.signal.aborted) return;

        // 401 -- unauthenticated; middleware / AuthRouteGuard handles redirect.
        if (res.status === 401) {
          setGateState("allowed");
          return;
        }

        // Non-OK server error -- fail open; middleware is the real gate.
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

        // No active access -- redirect to appropriate paywall.
        setGateState("redirecting");
        router.replace(json.pendingClaim ? "/claim/paywall" : "/paywall");
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        // Network error -- fail open (middleware is the real gate).
        setGateState("allowed");
      });

    return () => {
      controller.abort();
    };
  }, [pathname, router]);

  // NEVER render children while checking or redirecting.
  if (gateState === "checking" || gateState === "redirecting") {
    return <AccessCheckOverlay />;
  }

  return <>{children}</>;
}
