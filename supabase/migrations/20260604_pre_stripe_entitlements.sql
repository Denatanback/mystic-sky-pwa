-- eLuna pre-Stripe entitlement foundation.
-- Safe to run repeatedly. Does not connect Stripe or grant public write access.

create extension if not exists "pgcrypto";

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions
  add column if not exists plan_id text,
  add column if not exists subscription_status text,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists trial_end timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists entitlement_source text not null default 'manual';

update public.subscriptions
set
  plan_id = coalesce(plan_id, plan, 'free'),
  subscription_status = coalesce(subscription_status, nullif(status, ''), 'free'),
  stripe_customer_id = coalesce(stripe_customer_id, provider_customer_id),
  stripe_subscription_id = coalesce(stripe_subscription_id, provider_subscription_id),
  entitlement_source = coalesce(entitlement_source, provider, 'manual')
where plan_id is null
   or subscription_status is null
   or stripe_customer_id is null
   or stripe_subscription_id is null
   or entitlement_source is null;

update public.subscriptions
set subscription_status = 'canceled'
where subscription_status = 'expired';

alter table public.subscriptions
  alter column plan_id set default 'free',
  alter column plan_id set not null,
  alter column subscription_status set default 'free',
  alter column subscription_status set not null;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'subscriptions_status_check'
      and conrelid = 'public.subscriptions'::regclass
  ) then
    alter table public.subscriptions drop constraint subscriptions_status_check;
  end if;
end $$;

alter table public.subscriptions
  drop constraint if exists subscriptions_plan_id_check,
  drop constraint if exists subscriptions_subscription_status_check,
  drop constraint if exists subscriptions_entitlement_source_check;

alter table public.subscriptions
  add constraint subscriptions_plan_id_check
  check (plan_id in (
    'free',
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
    'internal'
  ));

alter table public.subscriptions
  add constraint subscriptions_entitlement_source_check
  check (entitlement_source in ('stripe', 'manual', 'internal', 'support'));

create index if not exists subscriptions_user_id_idx
  on public.subscriptions(user_id);

create unique index if not exists subscriptions_active_internal_user_idx
  on public.subscriptions(user_id)
  where subscription_status in ('trialing', 'active', 'internal');

create unique index if not exists subscriptions_stripe_customer_id_uidx
  on public.subscriptions(stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists subscriptions_stripe_subscription_id_uidx
  on public.subscriptions(stripe_subscription_id)
  where stripe_subscription_id is not null;

alter table public.subscriptions enable row level security;

drop policy if exists "Users can select own subscriptions" on public.subscriptions;
create policy "Users can select own subscriptions"
on public.subscriptions for select
using (auth.uid() = user_id);

-- Intentionally no public insert/update/delete policies.
-- Internal, support, and future Stripe writes must happen from Supabase SQL
-- Editor, trusted backend code, or Stripe webhooks using server-side privileges.
