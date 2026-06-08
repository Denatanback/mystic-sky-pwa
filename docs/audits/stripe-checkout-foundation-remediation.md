# eLuna Stripe Checkout Foundation Remediation

Date: 2026-06-05 local workspace date  
Branch/commit: main / pending commit

## Summary

Stripe Checkout foundation was added in test-ready mode. The frontend no longer shows checkout-unavailable copy or fake activation. Paid access is not activated by the checkout route or client UI; access is activated only when Stripe webhook events are verified and written server-side to Supabase subscription state.

Live payments are not enabled by this code alone. Stripe Dashboard products/prices, webhook signing secret, Vercel env vars, and Supabase service role env must be configured before real test payments can be completed.

## Routes added

- `/api/stripe/checkout`: POST route requiring an authenticated user. Validates `planId`, reads price IDs only from server env, creates a Stripe Checkout Session in `subscription` mode, and returns `{ url }`.
- `/api/stripe/webhook`: POST route using raw body and `STRIPE_WEBHOOK_SECRET` signature verification. Handles subscription and invoice events and updates Supabase through the service-role client.
- `/api/stripe/customer-portal`: POST route requiring an authenticated user. Finds the user's Stripe customer id and creates a Stripe Billing Portal session, or returns the no-billing-account support message.
- `/checkout/success`: Confirmation page. Does not activate access client-side.
- `/checkout/cancel`: Checkout-canceled page with `Choose access` and `Back to eLuna` actions.

## Plan config

Plan config lives in `src/lib/subscription/plans.ts`.

| Plan | Stripe env key | Price label | Status |
|---|---|---|---|
| `intro_3_day` | `STRIPE_PRICE_INTRO_3_DAY` | `$1.00 USD` | Checkout-ready after env setup |
| `monthly` | `STRIPE_PRICE_MONTHLY` | `$29.99 USD/month` | Checkout-ready after env setup |
| `three_month` | `STRIPE_PRICE_3_MONTH` | `$59.99 USD every 3 months` | Checkout-ready after env setup |
| `six_month` | `STRIPE_PRICE_6_MONTH` | `$89.99 USD every 6 months` | Checkout-ready after env setup |

There is no `free` paid plan id. Legacy/internal `free` remains only in entitlement normalization and fallback subscription state.

## Database / Supabase changes

- Tables:
  - Existing `public.subscriptions` stores Stripe customer/subscription state.
  - New `public.stripe_events` stores processed Stripe event ids for idempotency.
- Columns:
  - Added `subscriptions.stripe_price_id`.
  - Existing columns used: `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `plan_id`, `subscription_status`, `current_period_end`, `cancel_at_period_end`, `created_at`, `updated_at`.
- Migrations:
  - `supabase/migrations/20260605_stripe_checkout_foundation.sql`
- Schema:
  - `supabase/schema.sql` updated for fresh installs.
- Service role required:
  - `SUPABASE_SERVICE_ROLE_KEY` is required server-side for checkout customer persistence and webhook activation.
  - Service role is never imported into client components.

## Subscription status mapping

| Stripe status | eLuna access |
|---|---|
| `active` | Full access |
| `trialing` | Full access, for compatibility if Stripe status appears |
| `past_due` | No active access |
| `unpaid` | No active access |
| `canceled` | No active access |
| `incomplete` | No active access until confirmed |
| `incomplete_expired` | No active access |

The paid intro product is treated as introductory access, not a user-facing free trial.

## SubscriptionModal changes

- Plan buttons now call `/api/stripe/checkout`.
- Loading state is shown per selected plan.
- Checkout errors are displayed in the modal.
- Successful checkout-session creation redirects to Stripe Checkout.
- No frontend access activation occurs.
- Legal links remain visible: Terms, Billing, Refund, Cancellation, Privacy.
- Removed user-facing `checkout is not connected` / `secure checkout is being prepared` copy.

## Customer Portal / cancellation

- `/settings` now has a `Manage billing and cancellation` button.
- The button calls `/api/stripe/customer-portal` and redirects to Stripe Billing Portal when a customer exists.
- If no Stripe customer exists, the route returns:
  - `No active billing account was found for this profile. Contact support@myeluna.com if you need help.`
- Support email remains as a fallback.

## Required Stripe Dashboard setup

- Products:
  - 3-day introductory access.
  - Monthly Premium.
  - 3-Month Premium.
  - 6-Month Premium.
- Prices:
  - Create recurring Stripe prices matching the four env vars.
  - If intro access should convert or renew after 3 days, configure that behavior in Stripe and verify copy before launch. The app code does not promise auto-conversion.
- Webhook endpoint:
  - `https://www.myeluna.com/api/stripe/webhook`
- Events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Customer Portal:
  - Enable subscription cancellation.
  - Enable payment method management.
  - Enable invoice history.

## Required Vercel env vars

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_SITE_URL=https://www.myeluna.com

STRIPE_PRICE_INTRO_3_DAY=
STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_3_MONTH=
STRIPE_PRICE_6_MONTH=

STRIPE_CUSTOMER_PORTAL_RETURN_URL=https://www.myeluna.com/settings
STRIPE_CHECKOUT_SUCCESS_URL=https://www.myeluna.com/checkout/success
STRIPE_CHECKOUT_CANCEL_URL=https://www.myeluna.com/checkout/cancel
```

## Verification

- `npm run type-check`: PASS
- `npm run build`: PASS
- Search checks:
  - No `free preview`, `free plan`, `free trial`, `3-day trial`, `checkout is not connected`, or `secure checkout is being prepared` product-source matches remain.
  - The requested regex still matches approved `$1.00 USD` intro price copy because `0 USD` matches the tail of `$1.00 USD`; these are not free-access offers.
  - Stripe env search confirms env placeholders and server-side usage.
- Route checks with dummy test env (`STRIPE_SECRET_KEY=sk_test_dummy`, `STRIPE_WEBHOOK_SECRET=whsec_dummy`):
  - Unauthenticated checkout route rejected with `401 Authentication required.`
  - Authenticated checkout route returned `500 Stripe price is not configured for this plan.` when price env was missing.
  - Success page rendered confirmation copy.
  - Cancel page rendered checkout-not-completed copy and `Choose access` CTA.
  - Customer portal route returned no-billing-account support message for a user without Stripe customer.
  - Webhook route rejected invalid signature with `400 Invalid Stripe webhook signature.`

## Remaining blockers before live payments

- Configure Stripe test products/prices and set all `STRIPE_PRICE_*` env vars in Vercel.
- Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel test/prod environment.
- Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel. Without it, webhook activation and checkout customer persistence cannot work.
- Apply `supabase/migrations/20260605_stripe_checkout_foundation.sql` to Supabase.
- Configure Stripe webhook endpoint and required events.
- Configure Stripe Customer Portal cancellation/payment-method/invoice settings.
- Run a full Stripe test payment and webhook replay before live payments.
