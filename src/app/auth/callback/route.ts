import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function validateReturnTo(value: string | null) {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("http://") || value.includes("https://")) return null;
  return value;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const authError = requestUrl.searchParams.get("error");
  const returnTo = validateReturnTo(requestUrl.searchParams.get("returnTo")) ?? "/home";

  if (authError) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await (supabase?.auth.exchangeCodeForSession(code) ?? Promise.resolve({ error: null }));

    if (error) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }
  }

  return NextResponse.redirect(new URL(returnTo, request.url));
}
