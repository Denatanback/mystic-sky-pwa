import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getPaidPlan } from "@/lib/subscription/plans";
import { markStripeEventProcessed, recordStripeEvent, stripeSubscriptionToUpsert, upsertStripeSubscription } from "@/lib/subscription/stripePersistence";
import { getStripeServerClient } from "@/lib/stripe/server";

async function retrieveSubscription(stripe: Stripe, subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId, { expand: ["items.data.price"] });
}

function subscriptionIdFromInvoice(invoice: Stripe.Invoice) {
  const subscription = (invoice as Stripe.Invoice & { subscription?: string | { id?: string } | null }).subscription;
  if (!subscription) return null;
  return typeof subscription === "string" ? subscription : subscription.id;
}

async function syncSubscription(stripe: Stripe, subscription: Stripe.Subscription, fallback?: { userId?: string | null; planId?: string | null }) {
  const input = stripeSubscriptionToUpsert(subscription, fallback);
  if (!input) throw new Error("Stripe subscription is missing required user or plan metadata.");
  await upsertStripeSubscription(input);
}

async function handleCheckoutSessionCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  const planId = getPaidPlan(session.metadata?.planId)?.id;
  const userId = session.metadata?.userId ?? session.client_reference_id;

  if (!subscriptionId) return;
  const subscription = await retrieveSubscription(stripe, subscriptionId);
  await syncSubscription(stripe, subscription, { userId, planId });
}

async function handleEvent(stripe: Stripe, event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(stripe, event.data.object as Stripe.Checkout.Session);
      return;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscription(stripe, event.data.object as Stripe.Subscription);
      return;
    case "invoice.payment_succeeded":
    case "invoice.payment_failed": {
      const subscriptionId = subscriptionIdFromInvoice(event.data.object as Stripe.Invoice);
      if (!subscriptionId) return;
      const subscription = await retrieveSubscription(stripe, subscriptionId);
      await syncSubscription(stripe, subscription);
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
    if (record.duplicate) return NextResponse.json({ received: true, duplicate: true });
    await handleEvent(stripe, event);
    await markStripeEventProcessed(event.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not process Stripe webhook.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
