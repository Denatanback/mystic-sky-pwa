import "server-only";

import type Stripe from "stripe";
import type { User } from "@supabase/supabase-js";
import { getPaidPlan, getPlanByStripePriceId, type PaidPlanId } from "@/lib/subscription/plans";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

type SubscriptionUpsertInput = {
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  planId: PaidPlanId | string;
  subscriptionStatus: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  funnelId?: string | null;
  claimId?: string | null;
  claimType?: string | null;
  utmSource?: string | null;
  utmCampaign?: string | null;
  subid?: string | null;
  clickId?: string | null;
  markIntroUsed?: boolean;
};

function toIsoFromUnix(seconds: number | null | undefined) {
  if (!seconds) return null;
  return new Date(seconds * 1000).toISOString();
}

function firstString(...values: unknown[]) {
  return values.find((v): v is string => typeof v === "string" && v.trim().length > 0)?.trim() ?? "";
}

function readSubscriptionPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price?.id ?? null;
}

export function stripeSubscriptionToUpsert(
  subscription: Stripe.Subscription,
  fallback?: {
    userId?: string | null;
    planId?: string | null;
    funnelId?: string | null;
    claimId?: string | null;
    claimType?: string | null;
    utmSource?: string | null;
    utmCampaign?: string | null;
    subid?: string | null;
    clickId?: string | null;
    markIntroUsed?: boolean;
  }
): SubscriptionUpsertInput | null {
  const periodEnd = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
  const userId = firstString(subscription.metadata?.userId, fallback?.userId);
  const stripeCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? null;
  const stripePriceId = readSubscriptionPriceId(subscription);
  const planFromMetadata = firstString(subscription.metadata?.planId, fallback?.planId);
  const planFromPrice = getPlanByStripePriceId(stripePriceId)?.id;
  const planId = getPaidPlan(planFromMetadata)?.id ?? planFromPrice;

  if (!userId || !stripeCustomerId || !planId) return null;

  return {
    userId,
    stripeCustomerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId,
    planId,
    subscriptionStatus: subscription.status,
    currentPeriodEnd: toIsoFromUnix(periodEnd),
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    funnelId: firstString(subscription.metadata?.funnelId, fallback?.funnelId) || null,
    claimId: firstString(subscription.metadata?.claimId, fallback?.claimId) || null,
    claimType: firstString(subscription.metadata?.claimType, fallback?.claimType) || null,
    utmSource: firstString(subscription.metadata?.utm_source, fallback?.utmSource) || null,
    utmCampaign: firstString(subscription.metadata?.utm_campaign, fallback?.utmCampaign) || null,
    subid: firstString(subscription.metadata?.subid, fallback?.subid) || null,
    clickId: firstString(subscription.metadata?.click_id, fallback?.clickId) || null,
    markIntroUsed: fallback?.markIntroUsed ?? false,
  };
}

export async function getOrCreateStripeCustomerForUser(user: User, stripe: Stripe) {
  const supabase = getSupabaseServiceRoleClient();

  const existing = await supabase
    .from("subscriptions")
    .select("id, stripe_customer_id")
    .eq("user_id", user.id)
    .not("stripe_customer_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!existing.error && existing.data?.stripe_customer_id) {
    return existing.data.stripe_customer_id as string;
  }

  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    metadata: { userId: user.id, product: "eluna" },
  });

  const latestRow = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    user_id: user.id,
    plan_id: "free",
    subscription_status: "free",
    stripe_customer_id: customer.id,
    entitlement_source: "stripe",
    status: "free",
    plan: "free",
    provider: "stripe",
    provider_customer_id: customer.id,
  };

  if (!latestRow.error && latestRow.data?.id) {
    const update = await supabase.from("subscriptions").update(payload).eq("id", latestRow.data.id);
    if (update.error) throw new Error(update.error.message);
  } else {
    const insert = await supabase.from("subscriptions").insert(payload);
    if (insert.error) throw new Error(insert.error.message);
  }

  return customer.id;
}

export async function findStripeCustomerIdForUser(userId: string) {
  const supabase = getSupabaseServiceRoleClient();
  const result = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .not("stripe_customer_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (result.error) throw new Error(result.error.message);
  return (result.data?.stripe_customer_id as string | null | undefined) ?? null;
}

export async function recordStripeEvent(event: Stripe.Event) {
  const supabase = getSupabaseServiceRoleClient();
  const insert = await supabase.from("stripe_events").insert({
    id: event.id,
    type: event.type,
    livemode: event.livemode,
    payload: event as unknown as Record<string, unknown>,
  });

  if (!insert.error) return { duplicate: false };
  if (insert.error.code === "23505") return { duplicate: true };
  throw new Error(insert.error.message);
}

export async function markStripeEventProcessed(eventId: string) {
  const supabase = getSupabaseServiceRoleClient();
  const update = await supabase
    .from("stripe_events")
    .update({ processed_at: new Date().toISOString() })
    .eq("id", eventId);
  if (update.error) throw new Error(update.error.message);
}

export async function hasUserUsedIntroOffer(userId: string): Promise<boolean> {
  const supabase = getSupabaseServiceRoleClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("intro_offer_used")
    .eq("user_id", userId)
    .eq("intro_offer_used", true)
    .limit(1)
    .maybeSingle();
  return Boolean(data);
}

export async function userHasActiveAccess(userId: string): Promise<boolean> {
  const supabase = getSupabaseServiceRoleClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("subscription_status, trial_end")
    .eq("user_id", userId)
    .in("subscription_status", ["active", "trialing", "internal"])
    .limit(5);

  if (!data?.length) return false;
  return data.some((row) => {
    if (row.subscription_status === "active" || row.subscription_status === "internal") return true;
    if (row.subscription_status === "trialing") {
      const end = row.trial_end ? new Date(row.trial_end as string).getTime() : Infinity;
      return end > Date.now();
    }
    return false;
  });
}

export async function markIntroOfferUsed(userId: string): Promise<void> {
  const supabase = getSupabaseServiceRoleClient();
  await supabase.from("subscriptions").update({ intro_offer_used: true }).eq("user_id", userId);
}

export type PaymentEventInput = {
  stripeEventId: string;
  eventType: string;
  livemode: boolean;
  userId?: string | null;
  planId?: string | null;
  amountCents?: number | null;
  currency?: string | null;
  status?: string | null;
  funnelId?: string | null;
  claimId?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
};

export async function insertPaymentEvent(input: PaymentEventInput): Promise<void> {
  const supabase = getSupabaseServiceRoleClient();
  const payload: Record<string, unknown> = {
    stripe_event_id: input.stripeEventId,
    event_type: input.eventType,
    livemode: input.livemode,
  };
  if (input.userId) payload.user_id = input.userId;
  if (input.planId) payload.plan_id = input.planId;
  if (input.amountCents != null) payload.amount_cents = input.amountCents;
  if (input.currency) payload.currency = input.currency;
  if (input.status) payload.status = input.status;
  if (input.funnelId) payload.funnel_id = input.funnelId;
  if (input.claimId) payload.claim_id = input.claimId;
  if (input.stripeCustomerId) payload.stripe_customer_id = input.stripeCustomerId;
  if (input.stripeSubscriptionId) payload.stripe_subscription_id = input.stripeSubscriptionId;

  const { error } = await supabase.from("payment_events").insert(payload);
  if (error) {
    console.error("[payment_events] insert failed", { eventType: input.eventType, stripeEventId: input.stripeEventId, error: error.message });
  }
}

export async function upsertStripeSubscription(input: SubscriptionUpsertInput) {
  const supabase = getSupabaseServiceRoleClient();
  const payload: Record<string, unknown> = {
    user_id: input.userId,
    plan_id: input.planId,
    subscription_status: input.subscriptionStatus,
    stripe_customer_id: input.stripeCustomerId,
    stripe_subscription_id: input.stripeSubscriptionId,
    stripe_price_id: input.stripePriceId,
    current_period_end: input.currentPeriodEnd,
    cancel_at_period_end: input.cancelAtPeriodEnd,
    entitlement_source: "stripe",
    status: input.subscriptionStatus,
    plan: input.planId,
    provider: "stripe",
    provider_customer_id: input.stripeCustomerId,
    provider_subscription_id: input.stripeSubscriptionId,
  };

  if (input.funnelId) payload.funnel_id = input.funnelId;
  if (input.claimId) payload.claim_id = input.claimId;
  if (input.claimType) payload.claim_type = input.claimType;
  if (input.utmSource) payload.utm_source = input.utmSource;
  if (input.utmCampaign) payload.utm_campaign = input.utmCampaign;
  if (input.subid) payload.subid = input.subid;
  if (input.clickId) payload.click_id = input.clickId;
  if (input.markIntroUsed) payload.intro_offer_used = true;

  if (input.stripeSubscriptionId) {
    const existingBySub = await supabase
      .from("subscriptions")
      .select("id")
      .eq("stripe_subscription_id", input.stripeSubscriptionId)
      .limit(1)
      .maybeSingle();

    if (existingBySub.error) throw new Error(existingBySub.error.message);
    if (existingBySub.data?.id) {
      const update = await supabase.from("subscriptions").update(payload).eq("id", existingBySub.data.id);
      if (update.error) throw new Error(update.error.message);
      return;
    }
  }

  const existingByCustomer = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", input.userId)
    .eq("stripe_customer_id", input.stripeCustomerId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingByCustomer.error) throw new Error(existingByCustomer.error.message);
  if (existingByCustomer.data?.id) {
    const update = await supabase.from("subscriptions").update(payload).eq("id", existingByCustomer.data.id);
    if (update.error) throw new Error(update.error.message);
    return;
  }

  const insert = await supabase.from("subscriptions").insert(payload);
  if (insert.error) throw new Error(insert.error.message);
}
