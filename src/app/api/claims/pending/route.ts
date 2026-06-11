import { NextResponse } from "next/server";
import { createRouteSupabaseClient, getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export type PendingClaimPayload = {
  claimType: "past_life_role" | "soulmate_type";
  claimId?: string | null;
  funnel?: string | null;
  offer?: string | null;
  payload: Record<string, unknown>;
};

function isValidClaimType(value: unknown): value is "past_life_role" | "soulmate_type" {
  return value === "past_life_role" || value === "soulmate_type";
}

// GET /api/claims/pending — fetch the user's current pending claim
export async function GET() {
  const supabase = await createRouteSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Not configured." }, { status: 500 });

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const service = getSupabaseServiceRoleClient();
  const { data, error } = await service
    .from("pending_claims")
    .select("id, claim_type, claim_id, funnel, offer, payload, status, created_at")
    .eq("user_id", authData.user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ claim: data ?? null });
}

// POST /api/claims/pending — upsert a pending claim for the authenticated user
export async function POST(request: Request) {
  const supabase = await createRouteSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Not configured." }, { status: 500 });

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const body = await request.json().catch(() => null) as PendingClaimPayload | null;
  if (!body || !isValidClaimType(body.claimType)) {
    return NextResponse.json({ error: "Invalid claim payload." }, { status: 400 });
  }

  const service = getSupabaseServiceRoleClient();

  // Expire any existing pending claims for this user first
  await service
    .from("pending_claims")
    .update({ status: "expired" })
    .eq("user_id", authData.user.id)
    .eq("status", "pending");

  const { error: insertError } = await service.from("pending_claims").insert({
    user_id: authData.user.id,
    claim_type: body.claimType,
    claim_id: body.claimId ?? null,
    funnel: body.funnel ?? null,
    offer: body.offer ?? null,
    payload: body.payload,
    status: "pending",
  });

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/claims/pending — mark the user's pending claims as applied
export async function DELETE() {
  const supabase = await createRouteSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Not configured." }, { status: 500 });

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const service = getSupabaseServiceRoleClient();
  const { error } = await service
    .from("pending_claims")
    .update({ status: "applied", applied_at: new Date().toISOString() })
    .eq("user_id", authData.user.id)
    .eq("status", "pending");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
