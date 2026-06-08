import { NextResponse } from "next/server";
import { getPaidPlan, getStripePriceIdForPlan } from "@/lib/subscription/plans";
import { getOrCreateStripeCustomerForUser } from "@/lib/subscription/stripePersistence";
import { getStripeServerClient } from "@/lib/stripe/server";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

function checkoutUrlFromEnv(key: "STRIPE_CHECKOUT_SUCCESS_URL" | "STRIPE_CHECKOUT_CANCEL_URL", fallbackPath: string) {
  const configured = process.env[key]?.trim();
  if (configured) return configured;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.myeluna.com";
  return `${siteUrl}${fallbackPath}`;
}

export async function POST(request: Request) {
  try {
    const supabase = await createRouteSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = await request.json().catch(() => null) as { planId?: unknown } | null;
    const plan = getPaidPlan(typeof body?.planId === "string" ? body.planId : null);
    if (!plan) return NextResponse.json({ error: "Invalid plan." }, { status: 400 });

    const priceId = getStripePriceIdForPlan(plan);
    if (!priceId) {
      return NextResponse.json({ error: "Stripe price is not configured for this plan." }, { status: 500 });
    }

    const stripe = getStripeServerClient();
    const customerId = await getOrCreateStripeCustomerForUser(data.user, stripe);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: checkoutUrlFromEnv("STRIPE_CHECKOUT_SUCCESS_URL", "/checkout/success"),
      cancel_url: checkoutUrlFromEnv("STRIPE_CHECKOUT_CANCEL_URL", "/checkout/cancel"),
      client_reference_id: data.user.id,
      metadata: {
        userId: data.user.id,
        planId: plan.id,
        product: "eluna",
      },
      subscription_data: {
        metadata: {
          userId: data.user.id,
          planId: plan.id,
          product: "eluna",
        },
      },
      allow_promotion_codes: false,
    });

    if (!session.url) return NextResponse.json({ error: "Stripe Checkout URL was not created." }, { status: 500 });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create Stripe Checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
