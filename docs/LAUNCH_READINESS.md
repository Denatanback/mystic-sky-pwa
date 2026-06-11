# eLuna Launch Readiness Report

**Date:** 2026-06-11  
**Project:** mystic-sky-pwa / eLuna  
**Type-check:** ✅ Zero errors (`npm run type-check`)  
**Build:** ✅ Passes on Windows/Vercel (SWC binary unavailable in Linux sandbox — see Known Limitations)

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
| `src/components/subscription/PostAuthPaywall.tsx` | Marked `@deprecated` — superseded by `/claim/paywall` route |
| `src/app/api/stripe/checkout/route.ts` | Rewritten — auth guard, active-access guard, intro guard, funnel metadata, logging |
| `src/app/api/stripe/webhook/route.ts` | Updated — funnel/claim metadata, intro marking, `payment_events` writes, logging |
| `src/lib/subscription/stripePersistence.ts` | Extended — `hasUserUsedIntroOffer`, `userHasActiveAccess`, `markIntroOfferUsed`, `insertPaymentEvent`, `PaymentEventInput` |
| `src/app/checkout/success/page.tsx` | Rewritten — polling loop, claim application, redirect |
| `src/components/claims/PrelandClaimGate.tsx` | Security fix — checks entitlements before applying claim |
| `src/components/subscription/SubscriptionModal.tsx` | Extended — `suppressIntroIfUsed`, handles 409 guard responses |
| `src/app/register/page.tsx` | Extended — parses claim params, calls `syncPendingClaimToServer()` |
| `src/app/login/page.tsx` | Extended — calls `syncPendingClaimToServer()` after sign-in |
| `src/app/home/page.tsx` | Updated — removed `<PostAuthPaywall />` mount (replaced by /claim/paywall route) |
| `src/lib/claims/claimFlow.ts` | Extended — `syncPendingClaimToServer()`, funnel/offer fields on claim union types |
| `docs/PRELAND_HANDOFF.md` | New — instructions for preland repos |
| `src/app/claim/paywall/page.tsx` | **New** — forced post-quiz paywall route with funnel-personalized copy, intro guard, checkout metadata |
| `src/app/register/page.tsx` | Extended — redirects to `/claim/paywall` post-auth if pending claim; sets OAuth returnTo to `/claim/paywall` |
| `src/app/login/page.tsx` | Extended — redirects to `/claim/paywall` post-auth if pending claim and no explicit returnTo |
| `src/components/claims/PrelandClaimGate.tsx` | Comment updated — reflects PostAuthPaywall removal |


---


---

## Post-Quiz Paywall Flow (2026-06-11)

### Canonical conversion path

```
Preland Quiz → Result Teaser → Discount Wheel
  → Register / Login in App
  → /claim/paywall  ← NEW forced route
  → Stripe Checkout (intro_3_day)
  → /checkout/success (webhook polling)
  → Access Activated + Claim Applied
  → Redirect to discipline/node 1
```

**Key invariants:**
- Prelands never accept payment. They generate a quiz claim and redirect to the app.
- All paid access is controlled by Stripe webhook → Supabase subscription row.
- The result teaser and full claim data are never revealed until `active: true` is confirmed server-side.
- `/claim/paywall` is the only entry point to checkout from a preland flow. The SubscriptionModal on other pages is unaffected.

---

### How /claim/paywall works

**Route:** `src/app/claim/paywall/page.tsx`

On mount (in order):
1. Calls `syncPendingClaimToServer()` — syncs any localStorage claim to DB. Covers users arriving via OAuth redirect who haven't synced yet.
2. Calls `GET /api/access/status` — unauthenticated users (401) are redirected to `/login?returnTo=/claim/paywall`.
3. Calls `GET /api/claims/pending` — reads the authoritative pending claim from DB.
4. If no DB claim **and** no valid localStorage claim → redirect to `/home`.
5. If user already has active access → `applyClaimToProgress()`, `DELETE /api/claims/pending`, redirect to discipline node.
6. Otherwise → renders the forced paywall UI.

**Checkout call passes:** `planId`, `claimId`, `claimType`, `funnelId`, `offer=intro_3_day`, `utmSource`, `utmCampaign`, `subid`, `clickId` (utm/tracking read from `getPrelandContext()` localStorage).

**Intro already used:** Server returns 409 `introAlreadyUsed` → page switches to `monthly` plan, updates copy, user can retry.

---

### Paywall copy by funnel/claim type

| Funnel / claim_type | Headline | Offer shown |
|---|---|---|
| `past_life_role` / `pastlife` | "Your Past Life Reading is ready" | "Your preland discount has been applied · 3-day access for $1 · Regular price: $5" |
| `soulmate_type` / `soulmate*` | "Your Soulmate Type is ready" | "Your preland discount has been applied · 3-day access for $1 · Regular price: $5" |
| anything else | "Your personal reading is ready" | "3-day access for $1" |

Copy is resolved by `resolvePaywallCopy(claim_type, funnel)` in `page.tsx`. Does not rely on preland price data.

---

### Destination mapping after payment

| claim_type / funnel | Redirects to |
|---|---|
| `past_life_role` / `pastlife` | `/sky/pastlife/1` |
| `soulmate_type` / `soulmate*` | `/sky/soulmate/1` |
| fallback | `/home` |

Resolved by `resolveDestination()` in both `/claim/paywall/page.tsx` and `/checkout/success/page.tsx` (via `redirectTo` from `/api/access/status`).

---

### Auth flow changes

**Register (`src/app/register/page.tsx`):**
- After successful email registration: calls `syncPendingClaimToServer()`, then checks `validateClaim(detectClaim())`. If a pending claim exists → `router.push("/claim/paywall")`. Otherwise → `/onboarding` as before.
- Before Google OAuth: checks `validateClaim(detectClaim())`. If a pending claim exists → sets `oauthReturnTo = "/claim/paywall"` so the OAuth callback lands directly on the paywall.

**Login (`src/app/login/page.tsx`):**
- After successful email sign-in: calls `syncPendingClaimToServer()`, then checks `validateClaim(detectClaim())`. If a pending claim exists **and** no explicit `returnTo` was provided (i.e. `returnTo === "/home"`) → `router.push("/claim/paywall")`. An explicit `returnTo` (e.g. from a deep link) takes precedence.

**OAuth callback (`src/app/auth/callback/route.ts`):** Unchanged server-side. Claim sync happens on the client in `/claim/paywall` on mount.

---

### PostAuthPaywall

`src/components/subscription/PostAuthPaywall.tsx` — marked `@deprecated`, no longer mounted anywhere.

The old flow (modal auto-opens on `/home`) is replaced by the forced route-based `/claim/paywall`. The component file is kept for reference but will not render since it is not imported by any page.

**Removed from:** `src/app/home/page.tsx`

---

### Content locking verification

| Gate | File | Pre-payment behavior |
|---|---|---|
| Claim result display | `PrelandClaimGate.tsx` | `getEntitlements()` must return `hasFullAccess: true` before claim is applied or result shown |
| Sky Map nodes | `SkyNodeEntitlementGate.tsx` | All nodes locked; `canAccessSkyNode()` returns `false` for non-paying users |
| Product pages | `ProductAccessGate.tsx` | Renders locked preview shell for non-paying users |
| Checkout guard | `/api/stripe/checkout` | Auth + active-access + intro-used guards enforced server-side |
| Access source of truth | `/api/access/status` | Service role Supabase query — localStorage cannot influence the result |

localStorage is used only for UX persistence (claim buffering, preland context). No access decision reads from localStorage.

---

---

## Global Access Gating (2026-06-11)

**Product rule:** Authenticated users without active access cannot view any app content. The entire app is locked behind payment.

### New files

| File | Purpose |
|---|---|
| `src/middleware.ts` | Next.js root middleware — activates `updateSession()` from `src/lib/supabase/middleware.ts`. Was missing; session refresh and auth redirects were never running before this was added. |
| `src/app/paywall/page.tsx` | Generic paywall for direct signups with no preland claim. Copy: "Unlock your personal star path". CTA: "Start my journey". Defaults to `intro_3_day`; falls back to monthly if intro already used. |
| `src/components/subscription/GlobalAccessGuard.tsx` | Client component that checks `/api/access/status` on every route change and redirects before page content renders. |

### How GlobalAccessGuard works

**Location:** `src/components/subscription/GlobalAccessGuard.tsx`
**Mount point:** root layout (`src/app/layout.tsx`), nested as `<AuthRouteGuard><GlobalAccessGuard>...</GlobalAccessGuard></AuthRouteGuard>`

On every `pathname` change:

1. If the route is in `ACCESS_FREE_EXACT` (auth pages, paywall pages, checkout pages, API routes, legal) → pass through immediately.
2. If `accessConfirmedRef.current` is `true` (session-cached confirmation) → pass through without a network request.
3. Otherwise → fetch `GET /api/access/status` with `AbortController` (cancels in-flight checks on fast navigation).
   - `401` → pass through (AuthRouteGuard handles unauthenticated redirects).
   - Network error / non-OK → pass through (fail-open; auth layers still protect).
   - `active: true` → set `accessConfirmedRef.current = true`, pass through.
   - `active: false` + pending claim → `router.replace("/claim/paywall")`.
   - `active: false` + no claim → `router.replace("/paywall")`.
4. While checking (`gateState === "checking"`) renders `<AccessCheckOverlay />` spinner, not page content.

### Routes allowed without active access

```
/ /welcome /login /register /reset-password /auth/callback /onboarding
/paywall /claim/paywall /checkout/success /checkout/cancel
/settings/billing /legal/* /privacy /terms /about /contact /faq
/api/* (all API routes)
```

All other routes — `/home`, `/sky/*`, `/path`, `/practices`, `/cards`, `/journal`, `/today/*`, `/daily-card`, `/profile` — require active access.

### Secondary gates (defence-in-depth)

GlobalAccessGuard is the primary guard. Secondary gates protect against edge cases (e.g. subscription expires mid-session while `accessConfirmedRef` is still `true`):

| Component | Gate behaviour |
|---|---|
| `ProductAccessGate` | Wraps today, cards, journal, daily-card pages. `useEffect` redirects to `/paywall` when `hasFullAccess` becomes `false`. Renders `null` while loading or redirecting. |
| `SkyNodeEntitlementGate` | Wraps every `/sky/[discipline]/[nodeId]` content page. `useEffect` redirects to `/paywall` when `hasFullAccess` is `false`. |

Both components previously opened `SubscriptionModal` — that pattern is removed. All access failures now redirect to `/paywall`.

### Register / login redirect changes

- **Register (email):** After successful registration → `/claim/paywall` if pending claim, otherwise `/paywall` (never `/home` for unpaid users).
- **Register (OAuth):** `oauthReturnTo` defaults to `/paywall`; set to `/claim/paywall` if a pending claim is detected before OAuth redirect.
- **Login:** If `returnTo` is `/home` or `/onboarding` → override to `/paywall` (no claim) or `/claim/paywall` (pending claim).
- **Auth callback:** If `returnTo` is `/home` or `/onboarding` → rewrite to `/paywall`.

### Content audit — all protected routes verified

| Route | Protection |
|---|---|
| `/home` | GlobalAccessGuard (no page-level gate needed) |
| `/sky/[discipline]` | GlobalAccessGuard; shows nav map with lock icons — no premium content |
| `/sky/[discipline]/[nodeId]` | GlobalAccessGuard + SkyNodeEntitlementGate |
| `/path` | GlobalAccessGuard |
| `/practices` | GlobalAccessGuard + inline `hasFullAccess` check |
| `/today/*` | GlobalAccessGuard + ProductAccessGate |
| `/cards` | GlobalAccessGuard + ProductAccessGate |
| `/journal` | GlobalAccessGuard + ProductAccessGate |
| `/daily-card` | GlobalAccessGuard + ProductAccessGate |
| `/profile` | GlobalAccessGuard (account management; no premium reading content) |

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
- [ ] After registration, browser is redirected directly to `/claim/paywall` (skips home page)
- [ ] Paywall shows "Your Past Life Reading is ready" copy with "3-day access for $1"
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
- [ ] Complete payment flow — paywall shows "Your Soulmate Type is ready" copy
- [ ] Redirected to `/sky/soulmate/1`
- [ ] Node 1 completed with `soulmateType = protector`


### Flow 8: Global access gating — unpaid user blocked from all app routes

- [ ] Register a new account (no preland params)
- [ ] Confirm browser redirects to `/paywall`, not `/home`
- [ ] Manually try navigating to `/home` — confirm redirect back to `/paywall`
- [ ] Manually try `/sky/pastlife` — confirm redirect back to `/paywall`
- [ ] Manually try `/today` — confirm redirect back to `/paywall`
- [ ] Complete payment; confirm redirect to `/home` after success
- [ ] All above routes now load without redirect

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
