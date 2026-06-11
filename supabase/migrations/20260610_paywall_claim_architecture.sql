-- eLuna paywall + preland claim architecture
-- Adds pending_claims table, intro_offer_used flag, and funnel metadata columns.
-- Activation stays strictly server-side via Stripe webhook.

-- 1. Pending claims table
-- Stores preland quiz results that survive registration and wait for payment.
-- Only service-role code may insert/update/delete. Clients may read their own rows.
create table if not exists public.pending_claims (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  claim_type  text not null,
  claim_id    text,
  funnel      text,
  offer       text,
  payload     jsonb not null default '{}'::jsonb,
  status      text not null default 'pending',   -- 'pending' | 'applied' | 'expired'
  created_at  timestamptz not null default now(),
  applied_at  timestamptz,
  constraint  pending_claims_status_check check (status in ('pending','applied','expired'))
);

create index if not exists pending_claims_user_id_idx  on public.pending_claims(user_id);
create index if not exists pending_claims_claim_id_idx on public.pending_claims(claim_id);

alter table public.pending_claims enable row level security;

-- Clients can read their own pending claims (used to display paywall + result)
create policy "Users read own pending claims"
  on public.pending_claims for select
  using (auth.uid() = user_id);

-- No client insert/update/delete — all writes via service role from API routes

-- 2. Add funnel/claim metadata and intro_offer_used to subscriptions
alter table public.subscriptions
  add column if not exists intro_offer_used  boolean not null default false,
  add column if not exists funnel_id         text,
  add column if not exists claim_id          text,
  add column if not exists claim_type        text,
  add column if not exists utm_source        text,
  add column if not exists utm_campaign      text,
  add column if not exists subid             text,
  add column if not exists click_id          text;

create index if not exists subscriptions_user_intro_idx
  on public.subscriptions(user_id, intro_offer_used);

-- 3. RLS reminder: client cannot INSERT or UPDATE subscription rows.
--    The existing subscriptions RLS policies must NOT allow client-side writes.
--    Subscription state changes come only from the Stripe webhook via service role.
