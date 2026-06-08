import { NextResponse } from "next/server";
import { getStripeServerClient } from "@/lib/stripe/server";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

function portalReturnUrl() {
  return process.env.STRIPE_CUSTOMER_PORTAL_RETURN_URL?.trim() || `${process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.myeluna.com"}/settings`;
}

export async function POST() {
  try {
    const supabase = await createRouteSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const subscription = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", data.user.id)
      .not("stripe_customer_id", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subscription.error) return NextResponse.json({ error: subscription.error.message }, { status: 500 });

    const customerId = subscription.data?.stripe_customer_id as string | null | undefined;
    if (!customerId) {
      return NextResponse.json({ error: "No active billing account was found for this profile. Contact support@myeluna.com if you need help." }, { status: 404 });
    }

    const stripe = getStripeServerClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: portalReturnUrl(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create billing portal session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
