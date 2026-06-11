import { NextResponse } from "next/server";
import { getPaidPlan, getStripePriceIdForPlan } from "@/lib/subscription/plans";
import { getOrCreateStripeCustomerForUser, hasUserUsedIntroOffer, userHasActiveAccess } from "@/lib/subscription/stripePersistence";
import { getStripeServerClient } from "@/lib/stripe/server";
import { createRouteSupabaseClient, getSupabaseServiceRoleClient } from "@/lib/supabase/server";

function checkoutUrlFromEnv(key: "STRIPE_CHECKOUT_SUCCESS_URL" | "STRIPE_CHECKOUT_CANCEL_URL", fallbackPath: string) {
  const configured = process.env[key]?.trim();
  if (configured) return configured;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.myeluna.com";
  return `${siteUrl}${fallbackPath}`;
}

type CheckoutBody = {
  planId?: unknown;
  funnelId?: string;
  claimId?: string;
  claimType?: string;
  utmSource?: string;
  utmCampaign?: string;
  subid?: string;
  clickId?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createRouteSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = await request.json().catch(() => null) as CheckoutBody | null;
    const plan = getPaidPlan(typeof body?.planId === "string" ? body.planId : null);
    if (!plan) return NextResponse.json({ error: "Invalid plan." }, { status: 400 });

    const priceId = getStripePriceIdForPlan(plan);
    if (!priceId) {
      return NextResponse.json({ error: "Stripe price is not configured for this plan." }, { status: 500 });
    }

    // Guard: user must not already have active access
    const alreadyActive = await userHasActiveAccess(data.user.id);
    if (alreadyActive) {
      console.warn("[checkout] blocked: user already has active access", { userId: data.user.id, planId: plan.id });
      return NextResponse.json({ error: "You already have active access.", alreadyActive: true }, { status: 409 });
    }

    // Guard: intro offer is one-time only
    if (plan.id === "intro_3_day") {
      const introUsed = await hasUserUsedIntroOffer(data.user.id);
      if (introUsed) {
        console.warn("[checkout] blocked: intro offer already used", { userId: data.user.id });
        return NextResponse.json({ error: "Introductory offer has already been used for this account.", introAlreadyUsed: true }, { status: 409 });
      }
    }

    // Read pending claim from DB server-side for funnel metadata
    const service = getSupabaseServiceRoleClient();
    const { data: claimRow } = await service
      .from("pending_claims")
      .select("claim_type, claim_id, funnel, offer, payload")
      .eq("user_id", data.user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const funnelId = body?.funnelId ?? (claimRow?.funnel as string | undefined) ?? undefined;
    const claimId = body?.claimId ?? (claimRow?.claim_id as string | undefined) ?? undefined;
    const claimType = body?.claimType ?? (claimRow?.claim_type as string | undefined) ?? undefined;
    const utmSource = body?.utmSource ?? undefined;
    const utmCampaign = body?.utmCampaign ?? undefined;
    const subid = body?.subid ?? undefined;
    const clickId = body?.clickId ?? undefined;

    const stripe = getStripeServerClient();
    const customerId = await getOrCreateStripeCustomerForUser(data.user, stripe);

    const sessionMetadata: Record<string, string> = {
      userId: data.user.id,
      planId: plan.id,
      product: "eluna",
    };
    if (funnelId) sessionMetadata.funnelId = funnelId;
    if (claimId) sessionMetadata.claimId = claimId;
    if (claimType) sessionMetadata.claimType = claimType;
    if (utmSource) sessionMetadata.utm_source = utmSource;
    if (utmCampaign) sessionMetadata.utm_campaign = utmCampaign;
    if (subid) sessionMetadata.subid = subid;
    if (clickId) sessionMetadata.click_id = clickId;

    const successBase = checkoutUrlFromEnv("STRIPE_CHECKOUT_SUCCESS_URL", "/checkout/success");
    const cancelUrl = checkoutUrlFromEnv("STRIPE_CHECKOUT_CANCEL_URL", "/checkout/cancel");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${successBase}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: data.user.id,
      metadata: sessionMetadata,
      subscription_data: { metadata: sessionMetadata },
      allow_promotion_codes: false,
    });

    if (!session.url) {
      console.error("[checkout] session created but URL missing", { sessionId: session.id, userId: data.user.id, planId: plan.id });
      return NextResponse.json({ error: "Stripe Checkout URL was not created." }, { status: 500 });
    }

    console.info("[checkout] session created", { sessionId: session.id, userId: data.user.id, planId: plan.id, funnelId, claimId, livemode: session.livemode });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create Stripe Checkout session.";
    console.error("[checkout] unhandled error", { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
