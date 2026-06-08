-- eLuna Supabase schema
-- Run this file in Supabase SQL Editor.
-- Never expose the service_role key in frontend code.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text null,
  avatar_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_id text not null default 'free' check (plan_id in ('free', 'intro_3_day', 'monthly', 'three_month', 'six_month', 'trial_3_day_1_usd', 'premium_monthly_2999', 'premium_3_month_5999', 'premium_6_month_8999', 'internal_full_access')),
  subscription_status text not null default 'free' check (subscription_status in ('free', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'internal')),
  stripe_customer_id text null,
  stripe_subscription_id text null,
  stripe_price_id text null,
  current_period_end timestamptz null,
  trial_end timestamptz null,
  cancel_at_period_end boolean not null default false,
  entitlement_source text not null default 'manual' check (entitlement_source in ('stripe', 'manual', 'internal', 'support')),
  -- Legacy aliases retained for backward compatibility with older alpha data.
  status text null,
  plan text null,
  provider text null,
  provider_customer_id text null,
  provider_subscription_id text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.stripe_events enable row level security;

drop policy if exists "Users can select own profile" on public.profiles;
create policy "Users can select own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can select own subscriptions" on public.subscriptions;
create policy "Users can select own subscriptions"
on public.subscriptions for select
using (auth.uid() = user_id);

-- No public insert/update/delete policies are defined for subscriptions.
-- In production, subscription rows must be created and updated only from a
-- trusted backend, webhook, or payment provider integration using the service
-- role key on the server side. Never use service_role in frontend code.

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null)
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();
