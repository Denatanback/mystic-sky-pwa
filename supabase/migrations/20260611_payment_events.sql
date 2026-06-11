-- payment_events: structured log of every Stripe payment/subscription event
-- Written by webhook; never written by client; used for attribution & ops audit.

CREATE TABLE IF NOT EXISTS public.payment_events (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_event_id         TEXT NOT NULL,                   -- Stripe event ID (e_...)
  event_type              TEXT NOT NULL,                   -- e.g. checkout.session.completed
  plan_id                 TEXT,
  amount_cents            INTEGER,
  currency                TEXT,
  status                  TEXT,                            -- subscription status or invoice status
  funnel_id               TEXT,
  claim_id                TEXT,
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT,
  livemode                BOOLEAN NOT NULL DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for per-user lookups
CREATE INDEX IF NOT EXISTS payment_events_user_id_idx ON public.payment_events (user_id);
-- Index for event deduplication / lookup by stripe event
CREATE INDEX IF NOT EXISTS payment_events_stripe_event_id_idx ON public.payment_events (stripe_event_id);

-- RLS: no client can read or write payment_events (service role only)
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Intentionally no SELECT policy for authenticated users — this is an ops/audit table.
-- Service role bypasses RLS automatically.
