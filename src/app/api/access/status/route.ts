import { NextResponse } from "next/server";
import { createRouteSupabaseClient, getSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { entitlementsFromSubscription } from "@/lib/subscription/entitlements";

type FunnelDiscipline = "pastlife" | "soulmatev" | "soulmatew";
const disciplineRedirect: Record<string, string> = {
  pastlife: "/sky/pastlife",
  soulmatev: "/sky/soulmate",
  soulmatew: "/sky/soulmate",
};

// GET /api/access/status
// Returns whether the user currently has active subscription access,
// plus any pending claim details for post-payment redirect.
// Used by /checkout/success polling loop.
export async function GET() {
  const supabase = await createRouteSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Not configured." }, { status: 500 });

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const service = getSupabaseServiceRoleClient();

  // Check subscription access
  const { data: subRows, error: subError } = await service
    .from("subscriptions")
    .select("plan_id, subscription_status, entitlement_source, current_period_end, trial_end, status, plan, provider")
    .eq("user_id", authData.user.id)
    .order("updated_at", { ascending: false })
    .limit(10);

  if (subError) return NextResponse.json({ error: subError.message }, { status: 500 });

  const rows = (subRows ?? []) as Parameters<typeof entitlementsFromSubscription>[0][];
  const best = rows.length > 0
    ? rows.reduce((a, b) => {
        const scoreRow = (row: typeof a) => {
          const s = row?.subscription_status ?? row?.status;
          if (s === "internal") return 5;
          if (s === "active") return 4;
          if (s === "trialing") return 3;
          if (s === "past_due" || s === "unpaid" || s === "incomplete") return 2;
          return 0;
        };
        return scoreRow(b) > scoreRow(a) ? b : a;
      })
    : null;

  const entitlements = entitlementsFromSubscription(best);
  const active = entitlements.hasFullAccess;

  // Check pending claim
  const { data: claimRow } = await service
    .from("pending_claims")
    .select("id, claim_type, claim_id, funnel, offer, payload, status")
    .eq("user_id", authData.user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const funnel = (claimRow?.funnel as FunnelDiscipline | null) ?? null;
  const redirectTo = funnel ? (disciplineRedirect[funnel] ?? "/home") : "/home";

  return NextResponse.json({
    active,
    entitlements: {
      planId: entitlements.planId,
      status: entitlements.status,
      hasFullAccess: entitlements.hasFullAccess,
    },
    pendingClaim: claimRow
      ? {
          id: claimRow.id as string,
          claimType: claimRow.claim_type as string,
          claimId: claimRow.claim_id as string | null,
          funnel: claimRow.funnel as string | null,
          offer: claimRow.offer as string | null,
          payload: claimRow.payload as Record<string, unknown>,
        }
      : null,
    redirectTo: active ? redirectTo : null,
  });
}
