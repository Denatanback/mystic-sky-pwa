-- eLuna Stripe Checkout foundation.
-- Safe to run repeatedly. Subscription activation must remain server-side via Stripe webhooks.

create extension if not exists "pgcrypto";

alter table public.subscriptions
  add column if not exists stripe_price_id text;

alter table public.subscriptions
  drop constraint if exists subscriptions_plan_id_check,
  drop constraint if exists subscriptions_subscription_status_check;

alter table public.subscriptions
  add constraint subscriptions_plan_id_check
  check (plan_id in (
    'free',
    'intro_3_day',
    'monthly',
    'three_month',
    'six_month',
    'trial_3_day_1_usd',
    'premium_monthly_2999',
    'premium_3_month_5999',
    'premium_6_month_8999',
    'internal_full_access'
  ));

alter table public.subscriptions
  add constraint subscriptions_subscription_status_check
  check (subscription_status in (
    'free',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'incomplete',
    'incomplete_expired',
    'internal'
  ));

create index if not exists subscriptions_stripe_price_id_idx
  on public.subscriptions(stripe_price_id);

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  livemode boolean not null default false,
  payload jsonb not null,
  processed_at timestamptz null,
  created_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

-- No public policies: Stripe events are written only by trusted webhook code using
-- the server-side Supabase service role key.
