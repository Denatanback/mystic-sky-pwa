# eLuna Launch Readiness Report

**Date:** 2026-06-10  
**Project:** mystic-sky-pwa / eLuna  
**Type-check:** ✅ Zero errors (`npm run type-check`)

---

## Critical Launch Requirements — Audit Results

### ✅ 1. Intro offer is one-time, enforced server-side

**Where:** `src/app/api/stripe/checkout/route.ts`

The checkout route calls `hasUserUsedIntroOffer(userId)` (service role Supabase query on `subscriptions.intro_offer_used`) **before** creating a Stripe session. If the flag is already set, it returns HTTP 409 `{ introAlreadyUsed: true }`. The client cannot bypass this — it never touches Stripe directly.

**When it gets set:** The webhook handler (`checkout.session.completed`) calls both `markIntroOfferUsed(userId)` (sets `intro_offer_used = true` on all user subscription rows) **and** `syncSubscription(..., { markIntroUsed: true })` which sets the column on the specific subscription row.

**Client-side suppression:** `SubscriptionModal` receives `suppressIntroIfUsed` and hides the intro plan from the plan list when the checkout route returns `introAlreadyUsed: true`.

---

### ✅ 2. Success page waits for webhook / DB confirmation

**Where:** `src/app/checkout/success/page.tsx`

The page polls `/api/access/status` every 2.5 seconds for up to 90 seconds. It does **not** trust any URL params or client state. Access is confirmed only when the server returns `{ active: true }` — which requires an `active` or `trialing` subscription row written by the webhook. On confirmation, it applies the pending claim to localStorage progress, marks the claim applied in DB (`DELETE /api/claims/pending`), then navigates to the correct discipline route.

Timeout (90s): shows "Check again" / "Go to eLuna" / support email.

---

### ✅ 3. Active subscription blocks new checkout

**Where:** `src/app/api/stripe/checkout/route.ts`

Before the intro guard, the route calls `userHasActiveAccess(userId)` (queries `subscriptions` rows with status `active`, `trialing`, or `internal` via service role). If any active row exists, it returns HTTP 409 `{ alreadyActive: true }`. The client cannot reach Stripe checkout at all.

`SubscriptionModal` surfaces this as a "You already have access" message and closes the modal.

---

### ✅ 4. No client-side paid access bypass

**Layered defence:**

| Layer | Location | What it does |
|---|---|---|
| `PrelandClaimGate` | `src/components/claims/PrelandClaimGate.tsx` | Calls `getEntitlements()` before applying claim. No access → claim stays in localStorage but result is NOT shown. |
| `SkyNodeEntitlementGate` | `src/components/sky/SkyNodeEntitlementGate.tsx` | Checks `useEntitlements()` (server-sourced) before rendering node content. |
| `/api/access/status` | `src/app/api/access/status/route.ts` | Service role Supabase query — client cannot fake an active subscription row (RLS blocks client INSERT/UPDATE on subscriptions). |
| Checkout route guards | `src/app/api/stripe/checkout/route.ts` | Auth required; active-access and intro-used guards run server-side. |
| Webhook as source of truth | `src/app/api/stripe/webhook/route.ts` | Stripe signature verified; event deduped via `stripe_events` PK; subscription written via service role only. |

`localStorage` plan flags are UX-only: `getEntitlements()` always re-fetches from Supabase and never trusts localStorage for access decisions.

---

## Files Created / Modified

| File | Change |
|---|---|
| `supabase/migrations/20260610_paywall_claim_architecture.sql` | New — `pending_claims` table, RLS, `subscriptions` funnel/claim/intro columns |
| `supabase/migrations/20260611_payment_events.sql` | New — `payment_events` audit table, service-role-only via RLS |
| `src/app/api/claims/pending/route.ts` | New — GET/POST/DELETE pending claim API |
| `src/app/api/access/status/route.ts` | New — server-side access + pending claim status |
| `src/components/subscription/PostAuthPaywall.tsx` | New — auto-shows paywall after login when pending claim + no access |
| `src/app/api/stripe/checkout/route.ts` | Rewritten — auth guard, active-access guard, intro guard, funnel metadata, logging |
| `src/app/api/stripe/webhook/route.ts` | Updated — funnel/claim metadata, intro marking, `payment_events` writes, logging |
| `src/lib/subscription/stripePersistence.ts` | Extended — `hasUserUsedIntroOffer`, `userHasActiveAccess`, `markIntroOfferUsed`, `insertPaymentEvent`, `PaymentEventInput` |
| `src/app/checkout/success/page.tsx` | Rewritten — polling loop, claim application, redirect |
| `src/components/claims/PrelandClaimGate.tsx` | Security fix — checks entitlements before applying claim |
| `src/components/subscription/SubscriptionModal.tsx` | Extended — `suppressIntroIfUsed`, handles 409 guard responses |
| `src/app/register/page.tsx` | Extended — parses claim params, calls `syncPendingClaimToServer()` |
| `src/app/login/page.tsx` | Extended — calls `syncPendingClaimToServer()` after sign-in |
| `src/app/home/page.tsx` | Extended — mounts `<PostAuthPaywall />` |
| `src/lib/claims/claimFlow.ts` | Extended — `syncPendingClaimToServer()`, funnel/offer fields on claim union types |
| `docs/PRELAND_HANDOFF.md` | New — instructions for preland repos |

---

## Remaining Blockers

### ⚠️ Must do before launch

1. **Run migrations in production Supabase**  
   Apply both migration files in order:
   - `20260610_paywall_claim_architecture.sql`
   - `20260611_payment_events.sql`

2. **Set environment variables in production**  
   - `STRIPE_WEBHOOK_SECRET` — from Stripe Dashboard → Webhooks → your endpoint  
   - `STRIPE_SECRET_KEY` — production key (starts with `sk_live_`)  
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — production publishable key  
   - `STRIPE_CHECKOUT_SUCCESS_URL` — `https://app.myeluna.com/checkout/success`  
   - `STRIPE_CHECKOUT_CANCEL_URL` — `https://app.myeluna.com/home`  
   - `NEXT_PUBLIC_SITE_URL` — `https://app.myeluna.com`

3. **Register Stripe webhook endpoint**  
   In Stripe Dashboard, add `https://app.myeluna.com/api/stripe/webhook` and subscribe to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. **Notify preland teams**  
   Share `docs/PRELAND_HANDOFF.md`. Prelands must remove their Stripe checkout integration before go-live.

### ℹ️ Known limitations (acceptable at launch)

- **Build in CI (Linux):** `npm run build` cannot run in this sandbox because `@next/swc-linux-x64-gnu` is not installed in the workspace. The build works normally on the Windows dev machine and in Vercel/CI. Type-check passes cleanly (zero errors).
- **No RLS SELECT policy on `payment_events`:** Intentional — this is an ops-only table. Add a policy later if you need admin dashboards to query it via the anon client.

---

## Manual Test Checklist

Run these end-to-end before going live. Use Stripe test mode.

### Flow 1: Preland → Register → Pay → Access

- [ ] Navigate to `/register?claimType=past_life_role&role=healer&funnel=pastlife&offer=intro_3_day&claimId=test-001`
- [ ] Register a new account
- [ ] After onboarding, home page shows in-app paywall automatically
- [ ] Select intro plan ($1/3 days) → redirected to Stripe Checkout
- [ ] Complete payment with test card `4242 4242 4242 4242`
- [ ] `/checkout/success` shows "Confirming payment…" spinner
- [ ] Page transitions to "Welcome to eLuna ✦" and redirects to `/sky/pastlife`
- [ ] `/sky/pastlife/1` node is already completed with `role = healer`
- [ ] User does NOT need to retake the quiz

### Flow 2: Intro offer one-time enforcement

- [ ] Attempt to open paywall modal again for the same user
- [ ] Intro plan is hidden from the plan list
- [ ] Attempting to POST `intro_3_day` to `/api/stripe/checkout` returns 409 `introAlreadyUsed: true`

### Flow 3: Active subscription blocks checkout

- [ ] With an active subscription, attempt to create checkout via `/api/stripe/checkout`
- [ ] Returns 409 `alreadyActive: true`
- [ ] Modal shows "You already have access" messaging

### Flow 4: Webhook deduplication

- [ ] Replay a `checkout.session.completed` event from the Stripe Dashboard
- [ ] Webhook returns `{ received: true, duplicate: true }`
- [ ] No duplicate subscription row created
- [ ] `payment_events` table has only one row for the event

### Flow 5: Customer portal

- [ ] POST to `/api/stripe/customer-portal` with a logged-in user who has a Stripe customer
- [ ] Returns `{ url: "https://billing.stripe.com/..." }`
- [ ] Portal opens and allows plan management / cancellation

### Flow 6: No access — Sky Map gate

- [ ] Log in as a user with no subscription
- [ ] Navigate to any `/sky/*/[nodeId]` beyond the free tier
- [ ] Gate renders with "Unlock this deeper insight" paywall
- [ ] Paying via the gate leads to access being granted without retaking any quiz

### Flow 7: Soulmate funnel

- [ ] Navigate to `/register?claimType=soulmate_type&soulmateType=protector&funnel=soulmatev&offer=intro_3_day&claimId=test-002`
- [ ] Complete payment flow
- [ ] Redirected to `/sky/soulmate`
- [ ] Node 1 completed with `soulmateType = protector`

---

## Webhook Log Reference

All webhook events emit structured `console.info` / `console.error` entries with the prefix `[webhook]`. Checkout events use `[checkout]`. Payment event rows land in the `payment_events` table for every handled Stripe event type.

| Log prefix | Meaning |
|---|---|
| `[checkout] session created` | Successful checkout session, includes sessionId, planId, funnelId |
| `[checkout] blocked: user already has active access` | 409 guard hit |
| `[checkout] blocked: intro offer already used` | 409 intro guard hit |
| `[checkout] unhandled error` | Unexpected server error during checkout creation |
| `[webhook] processing event` | Event received, signature valid, not a duplicate |
| `[webhook] checkout.session.completed` | Subscription synced, claim metadata attached |
| `[webhook] duplicate event ignored` | Stripe delivered same event twice — safely skipped |
| `[webhook] event processed` | Full processing completed successfully |
| `[webhook] unhandled error` | Unexpected error during event handling |
| `[payment_events] insert failed` | Non-fatal — event was processed but audit row failed to insert |
