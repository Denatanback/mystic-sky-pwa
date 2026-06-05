"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StarField } from "@/components/app-shell/StarField";
import { getCurrentUser } from "@/lib/auth/authAdapter";

const publicExactRoutes = new Set([
  "/",
  "/welcome",
  "/login",
  "/register",
  "/reset-password",
  "/auth/callback",
  "/privacy",
  "/policy",
  "/terms",
  "/billing",
  "/money-back",
  "/money",
  "/cancellation",
  "/delivery",
  "/welcome-head",
  "/manifest.webmanifest",
]);

const protectedExactRoutes = new Set([
  "/home",
  "/today",
  "/today/node",
  "/today/path",
  "/today/star-way",
  "/profile",
  "/settings",
  "/journal",
  "/cards",
  "/daily-card",
  "/sky",
  "/path",
  "/practices",
  "/onboarding",
]);

function isProtectedRoute(pathname: string) {
  return protectedExactRoutes.has(pathname) || pathname.startsWith("/sky/");
}

function isPublicRoute(pathname: string) {
  return publicExactRoutes.has(pathname) || pathname.startsWith("/api/");
}

function currentReturnTo() {
  if (typeof window === "undefined") return "/home";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function LoadingGate() {
  return (
    <main className="app no-nav" style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24 }}>
      <StarField />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
        Opening your path...
      </div>
    </main>
  );
}

export function AuthRouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(() => !isProtectedRoute(pathname));

  useEffect(() => {
    let cancelled = false;

    if (isPublicRoute(pathname) || !isProtectedRoute(pathname)) {
      setAllowed(true);
      return;
    }

    setAllowed(false);
    void getCurrentUser().then((user) => {
      if (cancelled) return;
      if (user) {
        setAllowed(true);
        return;
      }

      const loginUrl = `/login?returnTo=${encodeURIComponent(currentReturnTo())}`;
      router.replace(loginUrl);
    });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!allowed) return <LoadingGate />;

  return <>{children}</>;
}
