import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

// =============================================================================
// Environment
// =============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

// =============================================================================
// Short-lived access cache cookie (HMAC-SHA256 signed, httpOnly)
//
// Only caches active=true. "No access" is never cached so newly-paid users
// are never blocked by a stale negative result.
// =============================================================================

const ACCESS_CACHE_COOKIE = "eluna_access_v1";
const ACCESS_CACHE_TTL_S = 120; // 2 minutes

type AccessCachePayload = {
  uid: string;
  access: true;
  exp: number;
};

async function hmacSha256(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function readAccessCache(
  cookieValue: string | undefined,
  userId: string,
): Promise<true | null> {
  if (!cookieValue || !SERVICE_ROLE_KEY) return null;
  try {
    const dot = cookieValue.lastIndexOf(".");
    if (dot < 0) return null;
    const payloadB64 = cookieValue.slice(0, dot);
    const sig = cookieValue.slice(dot + 1);
    const expectedSig = await hmacSha256(payloadB64, SERVICE_ROLE_KEY);
    if (expectedSig !== sig) return null;
    const payload = JSON.parse(atob(payloadB64)) as AccessCachePayload;
    if (payload.uid !== userId) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.access) return null;
    return true;
  } catch {
    return null;
  }
}

async function buildAccessCache(userId: string): Promise<string | null> {
  if (!SERVICE_ROLE_KEY) return null;
  const payload: AccessCachePayload = {
    uid: userId,
    access: true,
    exp: Math.floor(Date.now() / 1000) + ACCESS_CACHE_TTL_S,
  };
  const payloadB64 = btoa(JSON.stringify(payload));
  const sig = await hmacSha256(payloadB64, SERVICE_ROLE_KEY);
  return `${payloadB64}.${sig}`;
}

// =============================================================================
// Edge-compatible Supabase service client (lazy singleton per Edge worker)
// =============================================================================

let _edgeServiceClient: ReturnType<typeof createClient> | null = null;

function getEdgeServiceClient(): ReturnType<typeof createClient> | null {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return null;
  if (!_edgeServiceClient) {
    _edgeServiceClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _edgeServiceClient;
}

// =============================================================================
// Subscription access check (inline -- avoids importing "use client" files)
// =============================================================================

type SubRow = {
  subscription_status?: string | null;
  status?: string | null;
  plan_id?: string | null;
  trial_end?: string | null;
};

function rowHasFullAccess(row: SubRow): boolean {
  const s = row.subscription_status ?? row.status ?? "";
  const planId = row.plan_id ?? "";
  if (s === "active") return true;
  if (s === "internal" && planId === "internal_full_access") return true;
  if (s === "trialing") {
    if (!row.trial_end) return true;
    return new Date(row.trial_end) > new Date();
  }
  return false;
}

type AccessCheckResult =
  | { ok: true; hasAccess: boolean }
  | { ok: false };

async function queryHasActiveAccess(userId: string): Promise<AccessCheckResult> {
  const service = getEdgeServiceClient();
  if (!service) return { ok: false };
  try {
    const { data, error } = await service
      .from("subscriptions")
      .select("plan_id, subscription_status, status, trial_end")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(10);
    if (error) return { ok: false };
    const hasAccess = (data as SubRow[] | null)?.some(rowHasFullAccess) ?? false;
    return { ok: true, hasAccess };
  } catch {
    return { ok: false };
  }
}

async function queryHasPendingClaim(userId: string): Promise<boolean> {
  const service = getEdgeServiceClient();
  if (!service) return false;
  try {
    const { data } = await service
      .from("pending_claims")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();
    return data !== null;
  } catch {
    return false;
  }
}

// =============================================================================
// Route classification
// =============================================================================

const PUBLIC_EXACT = new Set([
  "/",
  "/welcome",
  "/welcome-head",
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
  "/support",
  "/manifest.webmanifest",
  "/paywall",
  "/claim/paywall",
  "/checkout/success",
  "/checkout/cancel",
  "/onboarding",
]);

function isPublicRoute(pathname: string): boolean {
  return (
    PUBLIC_EXACT.has(pathname) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/checkout/")
  );
}

function requiresPaidAccess(pathname: string): boolean {
  return (
    pathname === "/home" ||
    pathname === "/path" ||
    pathname === "/practices" ||
    pathname === "/profile" ||
    pathname === "/journal" ||
    pathname === "/cards" ||
    pathname === "/daily-card" ||
    pathname.startsWith("/sky") ||
    pathname.startsWith("/today") ||
    pathname.startsWith("/home/")
  );
}

// =============================================================================
// Response helpers
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PendingCookie = { name: string; value: string; options: any };

function makeRedirect(
  request: NextRequest,
  to: string,
  pendingCookies: PendingCookie[],
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = to;
  url.search = "";
  const r = NextResponse.redirect(url);
  for (const { name, value, options } of pendingCookies) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    r.cookies.set(name, value, options);
  }
  return r;
}

function makeLoginRedirect(
  request: NextRequest,
  pendingCookies: PendingCookie[],
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("returnTo", request.nextUrl.pathname);
  const r = NextResponse.redirect(url);
  for (const { name, value, options } of pendingCookies) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    r.cookies.set(name, value, options);
  }
  return r;
}

// =============================================================================
// Main middleware export
// =============================================================================

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  // Host-specific rewrites
  if (host === "welcome-head.myeluna.com") {
    if (pathname === "/") {
      const u = request.nextUrl.clone();
      u.pathname = "/welcome-head";
      return NextResponse.rewrite(u);
    }
    if (pathname === "/welcome") return NextResponse.redirect(new URL("/", request.url));
    if (pathname === "/login")    return NextResponse.redirect("https://www.myeluna.com/login");
    if (pathname === "/register") return NextResponse.redirect("https://www.myeluna.com/register");
  }

  // Clear access cache on /checkout/success so the first post-payment request
  // to a protected route always re-checks Supabase immediately.
  if (pathname === "/checkout/success") {
    const r = NextResponse.next({ request });
    r.cookies.delete(ACCESS_CACHE_COOKIE);
    return r;
  }

  // Public routes -- skip all auth + access logic
  if (isPublicRoute(pathname)) {
    return NextResponse.next({ request });
  }

  // Supabase not configured -- degrade gracefully
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (requiresPaidAccess(pathname)) {
      return makeLoginRedirect(request, []);
    }
    return NextResponse.next({ request });
  }

  // Session refresh + user resolution
  // pendingCookies collects any Supabase auth token renewals so they are
  // forwarded even when we return a redirect response.
  const pendingCookies: PendingCookie[] = [];
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
          pendingCookies.push({ name, value, options: options ?? {} });
        });
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user ?? null;

  // "/" -- redirect authenticated users based on access status.
  // (page.tsx at "/" unconditionally redirects to /welcome, so we intercept
  // here before the page component runs.)
  if (pathname === "/") {
    if (!user) return response;
    console.info("[access_guard_check]", { pathname, userId: user.id });
    const result = await queryHasActiveAccess(user.id);
    if (!result.ok) {
      console.warn("[access_guard_db_error]", { pathname, userId: user.id });
      return makeRedirect(request, "/paywall?reason=access_check_failed", pendingCookies);
    }
    if (result.hasAccess) {
      console.info("[access_guard_allow_active]", { pathname, userId: user.id });
      return makeRedirect(request, "/home", pendingCookies);
    }
    const hasClaim = await queryHasPendingClaim(user.id);
    const dest = hasClaim ? "/claim/paywall" : "/paywall";
    console.info("[access_guard_redirect_" + (hasClaim ? "claim_paywall" : "paywall") + "]", { pathname, userId: user.id });
    return makeRedirect(request, dest, pendingCookies);
  }

  // Paid-access gate
  if (requiresPaidAccess(pathname)) {
    if (!user) return makeLoginRedirect(request, pendingCookies);

    const userId = user.id;
    const cacheValue = request.cookies.get(ACCESS_CACHE_COOKIE)?.value;
    const cached = await readAccessCache(cacheValue, userId);

    if (cached === true) {
      console.info("[access_guard_cache_hit]", { pathname, userId });
      console.info("[access_guard_allow_active]", { pathname, userId });
      return response;
    }

    console.info("[access_guard_cache_miss]", { pathname, userId });
    console.info("[access_guard_check]", { pathname, userId });
    const result = await queryHasActiveAccess(userId);

    if (!result.ok) {
      console.warn("[access_guard_db_error]", { pathname, userId });
      return makeRedirect(request, "/paywall?reason=access_check_failed", pendingCookies);
    }

    if (!result.hasAccess) {
      const hasClaim = await queryHasPendingClaim(userId);
      const dest = hasClaim ? "/claim/paywall" : "/paywall";
      console.info("[access_guard_redirect_" + (hasClaim ? "claim_paywall" : "paywall") + "]", { pathname, userId });
      return makeRedirect(request, dest, pendingCookies);
    }

    // Active access -- write cache and allow
    console.info("[access_guard_allow_active]", { pathname, userId });
    const newCacheValue = await buildAccessCache(userId);
    if (newCacheValue) {
      response.cookies.set(ACCESS_CACHE_COOKIE, newCacheValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ACCESS_CACHE_TTL_S,
        path: "/",
      });
    }
    return response;
  }

  return response;
}
