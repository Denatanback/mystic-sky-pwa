import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

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
  "/support",
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

function isPublicRoute(pathname: string) {
  return publicExactRoutes.has(pathname) || pathname.startsWith("/api/");
}

function isProtectedRoute(pathname: string) {
  return protectedExactRoutes.has(pathname) || pathname.startsWith("/sky/");
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(loginUrl);
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();

  if (host === "welcome-head.myeluna.com") {
    if (pathname === "/") {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = "/welcome-head";
      return NextResponse.rewrite(rewriteUrl);
    }

    if (pathname === "/welcome") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/login") {
      return NextResponse.redirect("https://www.myeluna.com/login");
    }

    if (pathname === "/register") {
      return NextResponse.redirect("https://www.myeluna.com/register");
    }
  }

  if (isPublicRoute(pathname)) {
    return response;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtectedRoute(pathname)) return redirectToLogin(request);
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  if (isProtectedRoute(pathname) && !data.user) {
    return redirectToLogin(request);
  }

  return response;
}
