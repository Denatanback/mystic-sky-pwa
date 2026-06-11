import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getPaidPlan } from "@/lib/subscription/plans";
import {
  insertPaymentEvent,
  markStripeEventProcessed,
  markIntroOfferUsed,
  recordStripeEvent,
  stripeSubscriptionToUpsert,
  upsertStripeSubscription,
} from "@/lib/subscription/stripePersistence";
import { getStripeServerClient } from "@/lib/stripe/server";

async function retrieveSubscription(stripe: Stripe, subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId, { expand: ["items.data.price"] });
}

function subscriptionIdFromInvoice(invoice: Stripe.Invoice) {
  const sub = (invoice as Stripe.Invoice & { subscription?: string | { id?: string } | null }).subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

async function syncSubscription(
  stripe: Stripe,
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
) {
  const input = stripeSubscriptionToUpsert(subscription, fallback);
  if (!input) throw new Error("Stripe subscription is missing required user or plan metadata.");
  await upsertStripeSubscription(input);
}

async function handleCheckoutSessionCompleted(stripe: Stripe, session: Stripe.Checkout.Session, event: Stripe.Event) {
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  const planId = getPaidPlan(session.metadata?.planId)?.id;
  const userId = session.metadata?.userId ?? session.client_reference_id;
  const isIntro = planId === "intro_3_day";

  const funnelId = session.metadata?.funnelId ?? null;
  const claimId = session.metadata?.claimId ?? null;
  const claimType = session.metadata?.claimType ?? null;
  const utmSource = session.metadata?.utm_source ?? null;
  const utmCampaign = session.metadata?.utm_campaign ?? null;
  const subid = session.metadata?.subid ?? null;
  const clickId = session.metadata?.click_id ?? null;
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

  console.info("[webhook] checkout.session.completed", { sessionId: session.id, userId, planId, funnelId, claimId, livemode: event.livemode });

  if (!subscriptionId) {
    console.error("[webhook] checkout.session.completed: missing subscriptionId", { sessionId: session.id });
    return;
  }

  const subscription = await retrieveSubscription(stripe, subscriptionId);
  await syncSubscription(stripe, subscription, { userId, planId, funnelId, claimId, claimType, utmSource, utmCampaign, subid, clickId, markIntroUsed: isIntro });

  if (isIntro && userId) {
    await markIntroOfferUsed(userId);
  }

  await insertPaymentEvent({
    stripeEventId: event.id,
    eventType: event.type,
    livemode: event.livemode,
    userId: userId ?? null,
    planId: planId ?? null,
    amountCents: typeof session.amount_total === "number" ? session.amount_total : null,
    currency: session.currency ?? null,
    status: subscription.status,
    funnelId,
    claimId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
  });
}

async function handleEvent(stripe: Stripe, event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(stripe, event.data.object as Stripe.Checkout.Session, event);
      return;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId ?? null;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
      console.info("[webhook] " + event.type, { subscriptionId: sub.id, status: sub.status, userId, livemode: event.livemode });
      await syncSubscription(stripe, sub);
      await insertPaymentEvent({
        stripeEventId: event.id,
        eventType: event.type,
        livemode: event.livemode,
        userId,
        status: sub.status,
        stripeCustomerId: customerId,
        stripeSubscriptionId: sub.id,
      });
      return;
    }
    case "invoice.payment_succeeded":
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = subscriptionIdFromInvoice(invoice);
      const rawCustomer = invoice.customer;
      const customerId = typeof rawCustomer === "string" ? rawCustomer : (rawCustomer as { id?: string } | null)?.id ?? null;
      console.info("[webhook] " + event.type, { invoiceId: invoice.id, subscriptionId, amountDue: invoice.amount_due, livemode: event.livemode });
      if (!subscriptionId) return;
      const subscription = await retrieveSubscription(stripe, subscriptionId);
      await syncSubscription(stripe, subscription);
      await insertPaymentEvent({
        stripeEventId: event.id,
        eventType: event.type,
        livemode: event.livemode,
        amountCents: typeof invoice.amount_paid === "number" ? invoice.amount_paid : null,
        currency: invoice.currency ?? null,
        status: invoice.status ?? null,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
      });
      return;
    }
    default:
      return;
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not configured." }, { status: 500 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });

  const rawBody = await request.text();
  const stripe = getStripeServerClient();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  try {
    const record = await recordStripeEvent(event);
    if (record.duplicate) {
      console.info("[webhook] duplicate event ignored", { eventId: event.id, type: event.type });
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.info("[webhook] processing event", { eventId: event.id, type: event.type, livemode: event.livemode });
    await handleEvent(stripe, event);
    await markStripeEventProcessed(event.id);
    console.info("[webhook] event processed", { eventId: event.id, type: event.type });
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not process Stripe webhook.";
    console.error("[webhook] unhandled error", { eventId: event.id, type: event.type, error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
