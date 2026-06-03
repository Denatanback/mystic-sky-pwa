# eLuna Pre-Stripe Product Audit

Date: June 4, 2026

Scope: main eLuna product only. No product code was changed during this audit. No deploy was performed.

Stack audited: Next.js App Router, Supabase Auth, Supabase schema file, Vercel deployment, legal pages, paywall UI, feature gating, local progress, PWA metadata, and security-sensitive references.

## Executive summary

Stripe readiness: No.

Risk level: High until entitlement and Stripe webhook architecture are implemented.

The product is no longer publicly exposing protected product routes to unauthenticated users in the tested Vercel domains. `/home`, `/settings`, and `/sky` redirect to `/login?returnTo=...` on `www.myeluna.com` and `dev.myeluna.com`. Google-only auth is wired in UI and Apple buttons are not present in production HTML.

The main blocker before Stripe is not visual paywall readiness. It is entitlement integrity. Premium/trial state is still read from `localStorage` in several product screens, premium-looking content can be reached through direct node routes after login, and no Stripe Checkout/webhook/server entitlement flow exists yet. If Stripe is connected before fixing this, paid access will be easy to spoof or bypass.

Important note: MVP cancellation/refund flow is support-based via `support@myeluna.com`. This is documented in Billing Terms, Money-Back Policy, Settings/Profile support, and SubscriptionModal. Missing Stripe Customer Portal is not a P0 blocker for MVP if support operations and webhook sync for manual Stripe changes are implemented.

## Baseline checks

Current commit:

- `b316ad5 (HEAD -> main, origin/main, origin/HEAD) Use Google-only social auth`

Recent commits:

- `b316ad5 Use Google-only social auth`
- `865b7b0 Add social auth and password update`
- `689d290 Fix legal pages return navigation`
- `581ef70 Fix subscription modal visibility`
- `d68525d Adjust subscription sheet position`
- `18e0037 Fix subscription modal positioning`
- `5b5298b Remove Russian locale branch from product UI`
- `814c9ee Force English UI copy`
- `d3b2d0f Update refund and billing support copy`
- `5b19410 Add legal pages and policy links`

Remotes:

- `origin`: `https://github.com/Denatanback/mystic-sky-pwa.git`
- `vercel`: `https://github.com/jozzef01/mystic-sky-pwa.git`

Environment:

- Node: `v24.15.0`
- npm: `11.12.1`

Build checks:

- `rm -rf .next`: completed.
- `npm run type-check`: passed.
- `npm run build`: passed.
- Build warning: Next.js reports a custom `.babelrc` that can be removed. This is not a Stripe blocker.

Domain header checks:

| URL | Observed | Status |
| --- | --- | --- |
| `https://myeluna.com/home` | `307` to `https://www.myeluna.com/home`, `server: Vercel` | OK, apex redirects to www |
| `https://www.myeluna.com/home` | `307` to `/login?returnTo=%2Fhome`, `server: Vercel` | OK, protected |
| `https://dev.myeluna.com/home` | `307` to `/login?returnTo=%2Fhome`, `server: Vercel` | OK, protected |
| `https://www.myeluna.com/settings` | `307` to `/login?returnTo=%2Fsettings`, `server: Vercel` | OK, protected |
| `https://www.myeluna.com/sky` | `307` to `/login?returnTo=%2Fsky`, `server: Vercel` | OK, protected |
| `https://www.myeluna.com/terms` | `200`, `server: Vercel`, prerendered | OK, public |
| `https://www.myeluna.com/privacy` | `200`, `server: Vercel`, prerendered | OK, public |
| `https://myeluna.com/terms` | `307` to `https://www.myeluna.com/terms`, `server: Vercel` | OK, apex to www |

Production points to Vercel, not nginx, based on headers. Apex and www behave consistently: apex redirects to www. `dev.myeluna.com` is also Vercel and has the same protected-route behavior. There is still a deployment governance risk because local git has both `origin` and `vercel` remotes pointing to different GitHub repositories.

Production HTML spot-check:

- `/login` contains `Continue with Google`.
- `/register` contains `Sign up with Google`.
- Apple social auth strings were not found in production HTML.

## P0 — must fix before Stripe

### P0-1 — No Stripe Checkout/webhook backend exists

Route/file:

- `src/app/api/places/search/route.ts`
- `package.json`
- `supabase/schema.sql`

Problem:

The only API route under `src/app/api` is Places search. `package.json` does not include `stripe`. There is no route to create Checkout Sessions, no webhook endpoint, no success/cancel routes, and no Stripe signature verification.

Risk:

Stripe subscriptions cannot be connected safely. If client buttons are wired directly or access is granted after a success redirect, users can receive premium access without verified payment or keep access after failed/canceled subscriptions.

How to verify:

- `find src/app/api -maxdepth 3 -type f -print`
- `grep -RIn "stripe\|checkout\|webhook\|STRIPE_SECRET" src package.json`

Recommended fix:

Add server-only Stripe implementation:

- `POST /api/stripe/create-checkout-session`
- `POST /api/stripe/webhook`
- Use `stripe.checkout.sessions.create({ mode: "subscription" })`.
- Verify webhook signatures with `STRIPE_WEBHOOK_SECRET`.
- Do not grant access from the success page.
- Only webhook-confirmed subscription states should update Supabase entitlements.

### P0-2 — Premium entitlement is client/localStorage-based and spoofable

Route/file:

- `src/components/subscription/SubscriptionModal.tsx:108-119`
- `src/components/subscription/PlanChip.tsx:13-16`
- `src/app/sky/page.tsx:57-60`
- `src/app/practices/page.tsx:80-89`

Problem:

The UI determines plan access from `localStorage.getItem("eluna:plan")`. `trial` or `premium` values in localStorage are treated as paid access in Sky/Practices/UI chips.

Risk:

Any logged-in user can open browser devtools and set `localStorage.eluna:plan = "premium"` or `"trial"`. That can unlock premium UI client-side. This is unacceptable once Stripe is live.

How to reproduce:

1. Log in as a free user.
2. Open DevTools console.
3. Run `localStorage.setItem("eluna:plan", "premium")`.
4. Refresh `/sky` or `/practices`.
5. Premium UI state changes locally.

Recommended fix:

Replace all localStorage plan reads with a server-backed entitlement source:

- A Supabase `subscriptions` row updated only by Stripe webhook/server code.
- A shared `getEntitlements(userId)` helper.
- Client components may render cached entitlement state, but access decisions must come from server-verified subscription status.

### P0-3 — Premium node routes can be reached directly by logged-in free users

Route/file:

- `src/lib/nodeProgress.ts:44-48`
- `src/app/sky/pastlife/[nodeId]/page.tsx`
- `src/app/sky/soulmate/[nodeId]/page.tsx`
- `src/app/sky/humandesign/[nodeId]/page.tsx`
- `src/app/sky/spiritual/[nodeId]/page.tsx`

Problem:

`isNodeLocked()` returns `false` for `nodeId === 1` for every discipline. That means first nodes of premium-looking disciplines are open by direct route sequence logic, independent of Stripe/trial status. Some premium Sky Map nodes route to `/sky/pastlife/1` and `/sky/soulmate/1`, but those routes do not enforce subscription entitlement server-side.

Risk:

Logged-in users can bypass the paywall by entering URLs directly, for example `/sky/pastlife/1` or `/sky/soulmate/1`. This undermines subscription value and creates paid/free inconsistency.

How to reproduce:

1. Log in as a free user.
2. Directly open `/sky/pastlife/1`.
3. Directly open `/sky/soulmate/1`.
4. Compare route access with `/sky` premium node status.

Recommended fix:

Add route-level entitlement checks for premium disciplines/nodes:

- Define an entitlement matrix for each Sky discipline/node.
- On premium route mount/server wrapper, verify subscription status.
- If not entitled, show contextual paywall or redirect to `/sky`.
- Do not use localStorage node progress as the only lock source.

### P0-4 — Subscription database model is incomplete for Stripe MVP

Route/file:

- `supabase/schema.sql:23-36`
- `src/lib/subscription/subscriptionAccess.ts:1-24`

Problem:

There is a `subscriptions` table, but it uses generic `provider_customer_id`, `provider_subscription_id`, and `plan`; it does not explicitly include the planned Stripe fields from the product requirements such as `stripe_customer_id`, `stripe_subscription_id`, `plan_id`, `trial_end`, and clear entitlement flags. `subscriptionAccess.ts` reads active/trialing rows but is not integrated across the paywall/gating UI.

Risk:

Stripe implementation could become inconsistent or require rushed schema changes after checkout is connected. Without a clear subscription state model, manual cancellations/refunds in Stripe Dashboard may not reliably revoke access.

How to verify:

- Inspect `supabase/schema.sql`.
- Search: `grep -RIn "stripe_customer_id\|stripe_subscription_id\|plan_id\|trial_end\|current_period" src supabase`

Recommended fix:

Before Stripe launch, finalize schema and map events:

- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_status`
- `plan_id`
- `current_period_end`
- `trial_end`
- `cancel_at_period_end`
- Optional JSON entitlement flags.

Wire this model into the UI and webhook updates before payment buttons go live.

### P0-5 — No support operations sync process exists for manual cancellation/refund

Route/file:

- `src/lib/legal/legalContent.ts:258-269`
- `src/lib/legal/legalContent.ts:365-375`
- future Stripe webhook/admin process

Problem:

Support-based cancellation/refund copy is present and acceptable for MVP. However, there is no documented operational process or backend sync path for support actions performed in Stripe Dashboard.

Risk:

If support cancels/refunds manually in Stripe but Supabase entitlement is not updated by webhook or admin process, users may retain access after cancellation/refund or lose access incorrectly.

How to verify:

- No Stripe webhook route exists.
- No admin sync route exists.
- No operational doc exists for support handling.

Recommended fix:

Create a Stripe ops checklist before launch:

- Support receives request at `support@myeluna.com`.
- Support identifies user by email and Stripe customer.
- Support cancels/refunds in Stripe Dashboard.
- Stripe webhook updates Supabase subscription row.
- Support verifies user entitlement changed.
- Customer receives confirmation.

Customer Portal can be added later, but webhook sync for manual Stripe operations is required.

## P1 — should fix before traffic

### P1-1 — Mock auth fallback should be impossible in production Stripe mode

Route/file:

- `src/lib/auth/authAdapter.ts:95-111`
- `src/lib/mockAuth.ts`

Problem:

If Supabase env vars are missing, auth falls back to local mock auth. Middleware redirects protected routes when Supabase env is missing server-side, but client auth adapter still supports mock login/register.

Risk:

A misconfigured production environment could create local-only accounts or inconsistent auth behavior. For Stripe, mock auth should never be active on production domains.

How to verify:

- Remove Supabase env vars in a staging environment and test `/login` and `/register`.
- Search: `grep -RIn "mockAuth\|isSupabaseAuthEnabled" src`.

Recommended fix:

Gate mock auth behind an explicit local-only flag, for example `NEXT_PUBLIC_ENABLE_MOCK_AUTH=true`, and fail closed on production domains.

### P1-2 — User profile/onboarding data is partially stored in auth metadata/localStorage, not normalized DB fields

Route/file:

- `src/lib/profile/currentProfile.ts:82-126`
- `src/lib/profile/currentProfile.ts:136-214`
- `supabase/schema.sql:16-21`

Problem:

Onboarding data is stored in localStorage and Supabase auth user metadata. The `profiles` table only has `email`, `full_name`, and `avatar_url`.

Risk:

Paid users may lose personalization across devices or sessions if localStorage is cleared. Stripe support also becomes harder because profile and entitlement context are split across metadata/localStorage/subscription rows.

How to verify:

1. Complete onboarding on one device/browser.
2. Log in on another browser.
3. Check whether birth data, zodiac override, focus areas, and preferences persist consistently.

Recommended fix:

Add normalized profile fields or a `profile_settings` table for birth date, birth time, birth place, zodiac override/sign, focus areas, and practice preferences.

### P1-3 — Legal entity placeholders remain

Route/file:

- `src/lib/legal/legalContent.ts:14-15`
- `/privacy`
- `/terms`

Problem:

Legal pages still render `[LEGAL_ENTITY_NAME]` and `[LEGAL_ENTITY_ADDRESS]`.

Risk:

This is not a checkout-code blocker, but it is a paid-launch credibility and compliance risk.

How to verify:

- Open `/privacy` and `/terms`.
- Search: `grep -RIn "\[LEGAL_ENTITY_NAME\]\|\[LEGAL_ENTITY_ADDRESS\]" src`.

Recommended fix:

Replace placeholders with the correct legal entity and address before paid traffic. If unavailable for Stripe MVP, confirm with counsel whether placeholders can remain during private test mode.

### P1-4 — Paywall promises features that are only previews or not implemented

Route/file:

- `src/components/subscription/SubscriptionModal.tsx:20-35`
- `src/components/subscription/SubscriptionModal.tsx:72-95`
- `src/app/sky/page.tsx:124-129`
- `src/app/practices/page.tsx:430-443`

Problem:

Paywall promises full reports, personal chart insights, saved history, weekly reports, monthly reports, and deeper premium nodes. Some of these are previews, coming soon, or route to placeholders.

Risk:

Users may pay expecting complete premium functionality and request refunds or dispute charges when features feel absent.

How to verify:

1. Open SubscriptionModal.
2. Note promised benefits.
3. Click through Profile, Sky nodes, Practices, Journal, reports/history.
4. Compare actual product depth.

Recommended fix:

Before paid traffic, either implement one strong premium output or revise paywall copy to match current MVP. For Stripe MVP, avoid promising reports/history as fully delivered if they are only previews.

### P1-5 — Google OAuth requires dashboard/domain verification

Route/file:

- `src/app/login/page.tsx:51-58`
- `src/app/register/page.tsx:129-138`
- `src/app/auth/callback/route.ts:4-31`
- `docs/SOCIAL_AUTH_SETUP.md`

Problem:

The app is wired for Google OAuth and production HTML shows the correct buttons. Actual OAuth success depends on Supabase and Google Cloud dashboard configuration for `www.myeluna.com`, `myeluna.com`, `dev.myeluna.com`, and localhost.

Risk:

If redirect URLs or allowed origins are incomplete, users cannot sign up or log in with Google when Stripe traffic starts.

How to verify:

1. Open `/login`.
2. Click `Continue with Google`.
3. Complete Google OAuth.
4. Confirm callback returns to `/home` or safe `returnTo`.
5. Repeat `/login?returnTo=%2Fsettings`.

Recommended fix:

Complete and test the checklist in `docs/SOCIAL_AUTH_SETUP.md` on both dev and production domains.

### P1-6 — Support-based cancellation copy is clear, but account UI says “managed from settings” without actual plan management

Route/file:

- `src/components/subscription/SubscriptionModal.tsx:352`
- `src/app/settings/page.tsx:208`
- `src/app/profile/page.tsx:154-160`

Problem:

Billing/refund support copy is visible, but SubscriptionModal says “Your plan can be managed from your account settings.” Settings currently has support and password change, not actual subscription management.

Risk:

Users may look for a self-serve management area and not find one. Because MVP cancellation is support-based, the UI should make support the primary path.

How to verify:

1. Open SubscriptionModal.
2. Read bottom copy.
3. Open Settings.
4. Confirm whether there is a plan management section.

Recommended fix:

For MVP, replace “managed from account settings” with support-first text or add a Settings billing card that clearly says cancellation/refund/trial questions go to `support@myeluna.com`.

### P1-7 — Direct premium routes are client components; route protection is auth-only, not subscription-aware

Route/file:

- `src/app/sky/*/[nodeId]/page.tsx`
- `src/lib/nodeProgress.ts`
- `src/lib/subscription/subscriptionAccess.ts`

Problem:

Auth middleware protects `/sky/*`, but it does not distinguish free/trial/premium access. Entitlement checks are not enforced at route level.

Risk:

Even after adding Stripe, paid content can remain reachable unless each premium route is guarded.

How to verify:

- Inspect all `/sky/*/[nodeId]` routes.
- Test as a free logged-in user with direct URLs.

Recommended fix:

Add an entitlement-aware route wrapper or server component boundary for premium routes.

### P1-8 — Deployment remotes can point to different repositories

Route/file:

- Git configuration

Problem:

`origin` points to `Denatanback/mystic-sky-pwa.git`; `vercel` points to `jozzef01/mystic-sky-pwa.git`.

Risk:

The team may push to one repo while Vercel deploys from another, causing production to miss the latest fixes.

How to verify:

- `git remote -v`
- Vercel project Git settings.

Recommended fix:

Confirm Vercel’s Git integration watches the same repository and branch as `origin/main`, or remove/rename stale remotes.

### P1-9 — Product still contains dormant RU branches and romanized Russian content

Route/file:

- `src/lib/i18n.tsx:267-290`
- `src/app/sky/numerology/[nodeId]/page.tsx`
- `src/app/sky/humandesign/[nodeId]/page.tsx`
- `src/app/sky/pastlife/[nodeId]/page.tsx`
- `src/lib/astroCalc.ts`
- `src/lib/dailyCalc.ts`
- `src/lib/numerologyCalc.ts`

Problem:

Visible UI is forced English and Cyrillic grep is clean, but dormant `ru` data and `lang === "ru"` branches remain. `ENABLE_RU_LOCALE=false` currently prevents display.

Risk:

A future toggle or stored language edge case could reintroduce non-English UI. For US paid traffic, this is a QA risk.

How to verify:

- `grep -RIn "lang === \"ru\"\|ru:" src`
- Confirm `ENABLE_RU_LOCALE=false`.

Recommended fix:

Before paid traffic, remove dormant RU branches or isolate them outside production bundle.

## P2 — polish/post-Stripe

### P2-1 — Customer Portal is not present

Route/file:

- No customer portal route found.

Problem:

There is no Stripe Customer Portal implementation.

Risk:

More support workload and slower self-serve cancellation. This is not a P0 for MVP because support-based cancellation/refund is documented.

Recommended fix:

Add Customer Portal after MVP Stripe launch:

- `POST /api/stripe/create-portal-session`
- Settings billing card.
- Return URL back to `/settings`.

### P2-2 — PWA manifest metadata mismatch

Route/file:

- `src/app/layout.tsx:24`
- `src/app/manifest.ts`

Problem:

Metadata references `manifest: "/manifest.json"`, while public/protected route allowlists include `/manifest.webmanifest`, and Next metadata route normally serves `/manifest.webmanifest`.

Risk:

Install behavior may be inconsistent. Not a Stripe blocker, but it can affect PWA trust and cache behavior.

How to verify:

- Open `/manifest.json`.
- Open `/manifest.webmanifest`.
- Inspect browser Application tab.

Recommended fix:

Normalize manifest URL to the actual served route and ensure middleware public allowlist matches it.

### P2-3 — Custom `.babelrc` warning during Next build

Route/file:

- `.babelrc`
- build output

Problem:

Next build warns that custom Babel config can be removed.

Risk:

Not blocking, but custom Babel may reduce build predictability/performance.

Recommended fix:

Review and remove `.babelrc` if no longer needed.

### P2-4 — `dangerouslySetInnerHTML` usage for emoji

Route/file:

- `src/app/sky/pastlife/[nodeId]/page.tsx:240`

Problem:

`dangerouslySetInnerHTML` is used for `data.emoji`.

Risk:

If `data.emoji` ever becomes user-controlled, this is an XSS risk. Currently it appears to be internal data, so this is not immediate P0.

Recommended fix:

Render emoji as text or whitelist known values.

### P2-5 — Static prerendered product pages depend on middleware for privacy

Route/file:

- build output shows `/home`, `/today`, `/profile`, `/settings`, `/sky`, etc. are static.
- `src/lib/supabase/middleware.ts`

Problem:

Protected pages are statically generated, but Vercel middleware currently intercepts unauthenticated requests.

Risk:

If middleware matcher or deployment platform changes, protected static pages could become exposed.

Recommended fix:

Keep middleware tests in CI and consider server-auth wrappers for sensitive paid pages after Stripe.

## Auth & protected routes audit

Current status:

- Middleware exists: `middleware.ts` calls `updateSession()`.
- Protected routes are listed in `src/lib/supabase/middleware.ts:23-37`.
- Public routes are listed in `src/lib/supabase/middleware.ts:7-21`.
- Client AuthGuard exists in `src/components/auth/AuthRouteGuard.tsx:64-96`.
- Root layout wraps app in AuthRouteGuard at `src/app/layout.tsx`.
- `/onboarding` is protected in middleware and AuthGuard.

Observed production behavior:

- Incognito-style header checks for `/home`, `/settings`, `/sky` redirect to login with `returnTo`.
- Public legal pages return `200`.

Auth risks:

- Mock auth fallback remains in client auth adapter and should be disabled for production Stripe mode.
- Protected pages are static but guarded by middleware at edge/runtime.

No P0 unauthenticated access was observed in the tested domains.

## Google OAuth audit

Current status:

- `/login` uses `Continue with Google`.
- `/register` uses `Sign up with Google`.
- Apple buttons are removed from `src` and production HTML.
- `src/lib/auth/authAdapter.ts:129-145` uses Supabase `signInWithOAuth`.
- OAuth redirect includes `/auth/callback?returnTo=...`.
- `src/app/auth/callback/route.ts:4-9` validates `returnTo`.
- Callback redirects OAuth errors to `/login?error=oauth_failed`.
- Email/password login still exists.
- Forgot/reset password exists in `/login` and `/reset-password`.

Risks:

- Dashboard setup must be manually verified in Supabase and Google Cloud.
- Register Google default return is `/onboarding`, which is correct for incomplete profiles.

## Registration & onboarding audit

Expected sequence is implemented:

- `/register` creates account first.
- `/onboarding` collects birth date, optional unknown birth time, place, zodiac auto-detection/manual override, focus areas, and practice preferences.
- After onboarding completion, user is sent to `/home`.

Data map:

- Email/name: Supabase Auth user + `profiles` minimal table.
- Birth/zodiac/focus/preferences: localStorage + Supabase Auth user metadata.
- Onboarding completion: localStorage + metadata.
- Profile resolution: `src/lib/profile/currentProfile.ts`.

Risks:

- Paid users expect persistence across devices; localStorage-backed onboarding/progress is not enough for paid product quality.
- `profiles` table is too minimal for a paid product account model.

## Legal pages & return navigation audit

Current status:

- `/terms`, `/privacy`, `/billing`, `/money-back`, `/policy`, `/money` are public.
- Register legal links include `returnTo` via `src/app/register/page.tsx:125-127`.
- LegalPage validates returnTo in `src/components/legal/LegalPage.tsx:28-34`.
- Legal Back falls back to `/`, not `/home`, in `src/components/legal/LegalPage.tsx:90-103`.
- Support email is visible and clickable.

Support-based cancellation/refund:

- Money-Back Policy says cancellation/refund questions go to `support@myeluna.com`.
- Billing Terms say billing/cancellation/refund questions go to `support@myeluna.com`.
- Settings/Profile support copy mentions trial, billing, cancellation, and refund request.
- SubscriptionModal has billing/refund support copy.

Risks:

- Legal entity placeholders remain.
- Legal page header has a `Settings` link, which sends unauthenticated legal readers toward a protected route.

## Subscription/paywall UI audit

Current pricing UI:

- Free: `$0`.
- 3-day trial: `$1.00 today`.
- Monthly: `$29.99/month`.
- 3-month: `$59.99 every 3 months`, `$19.99/month equivalent`, save `$29.98`.
- 6-month: `$89.99 every 6 months`, `$14.99/month equivalent`, save `$89.95`.

What works:

- All expected plans are visible in code.
- Trial billing copy is clear: 3 days, then `$29.99/month` unless canceled.
- Long-plan savings are visible.
- Checkout is honest: `Secure checkout is being prepared`.
- No fake payment success was found.
- Modal uses portal, high z-index, `82dvh`, body scroll lock, and internal scroll.
- Support email is visible.

Main risk:

- The modal and feature gates still rely on localStorage plan state and do not call Stripe.

## Stripe integration readiness

Required env vars:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Stripe price IDs for:
  - 3-day trial / $1 setup or trial pricing model
  - Monthly `$29.99`
  - 3-month `$59.99`
  - 6-month `$89.99`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` only if client-side Stripe.js is used.
- Supabase service role key on server only for webhook writes.

Required DB fields:

- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_status`
- `plan_id`
- `current_period_end`
- `trial_end`
- `cancel_at_period_end`
- `latest_invoice_status` or payment failure metadata
- Optional entitlement flags or derived entitlement view.

Required API routes:

- `POST /api/stripe/create-checkout-session`
- `POST /api/stripe/webhook`
- Optional later: `POST /api/stripe/create-portal-session`

Required webhook events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `charge.refunded` or refund-related events if refund state affects access

Required manual cancellation/refund process:

- User contacts `support@myeluna.com`.
- Support locates Stripe customer/subscription by account email.
- Support cancels/refunds in Stripe Dashboard.
- Stripe webhook updates Supabase subscription state.
- Support verifies access changed and replies to user.

Optional future Customer Portal:

- Recommended after MVP to reduce support burden.
- Not mandatory for Stripe MVP if support policy is clear and operationally staffed.

Required QA scenarios:

- New user starts $1 trial.
- Existing free user starts trial.
- Trial converts to monthly.
- 3-month and 6-month purchases grant correct entitlements.
- Payment failure revokes or downgrades correctly.
- Manual cancellation in Stripe Dashboard syncs to Supabase.
- Manual refund in Stripe Dashboard syncs to access/support state.
- Success page without webhook does not grant access.
- Direct premium route access is denied for free users.

## Feature gating audit

Current gate sources:

- Practices: localStorage plan via `src/app/practices/page.tsx:80-89`.
- Sky Map: localStorage plan via `src/app/sky/page.tsx:57-60`.
- Plan chip: localStorage plan via `src/components/subscription/PlanChip.tsx:13-16`.
- Node sequence: localStorage progress via `src/lib/nodeProgress.ts`.
- Supabase subscription helper exists but is not broadly used in UI.

Bypass risks:

- `localStorage.eluna:plan = "premium"` changes UI.
- `/sky/pastlife/1` and similar first-node routes can be directly opened by logged-in users.
- Premium promises are more robust than actual entitlement enforcement.

Proposed entitlement matrix:

| Feature | Free | Trial/Premium | Enforcement |
| --- | --- | --- | --- |
| Basic Today preview | Yes | Yes | Auth route only |
| Full daily reading | Preview only | Full | Server entitlement |
| Daily card | Basic/1 per day | Full/history | Server entitlement for history |
| Practices library | Limited categories/previews | Full | Server entitlement |
| Active affirmations | 1 | 3+ | Server entitlement |
| Sky free nodes | Yes | Yes | Auth route |
| Sky premium nodes | Preview/paywall | Full | Server entitlement + route guard |
| Path deeper signals | Day 1/free preview | Full progression | Server entitlement + progress DB |
| Reports/history | Preview only | Full | Server entitlement |

## Product content depth audit

Paid-value risk: Medium-high.

Strongest areas:

- Daily Card MVP has enough starter content.
- Guided practice has a real interaction loop.
- Affirmation library has multiple categories and usable instructions.
- Sky Map gives a credible long-term structure.

Weakest areas before Stripe:

- Weekly/monthly reports are promised but not implemented as full outputs.
- Profile/Personal Chart is still thin for a paid product.
- Path after Day 1 is still mostly promise.
- Journal/history value is light.
- Some premium node pages are shallow or direct-route accessible.

Quick wins before Stripe:

- Add one real premium sample output behind Trial/Premium.
- Revise paywall copy to avoid overpromising reports if not delivered.
- Add a basic paid “Personal Chart summary” using existing birth/zodiac data.
- Add visible saved card/reflection history if promising saved history.

Deeper roadmap after Stripe:

- Server-persisted journal/reflection history.
- Weekly report generated from actual user actions.
- Day 2/Day 3 Path content.
- Premium Sky node depth for Past Life/Soulmate.

## PWA/cache/deploy audit

Current state:

- `src/app/manifest.ts` exists.
- No service worker/workbox references were found.
- Build output includes `/manifest.webmanifest`.
- `src/app/layout.tsx` references `manifest: "/manifest.json"`.

Cache risk:

- No service worker means less stale JS risk.
- Manifest mismatch should be cleaned before serious PWA install testing.
- To avoid stale bundles after deploy, use Vercel immutable assets and ask testers to hard refresh if they saw old Russian UI before.

Deploy checklist:

- Confirm Vercel Git integration repo/branch.
- Run `npm run type-check`.
- Run `npm run build`.
- Verify `/home` protected on `www`, apex, and dev.
- Verify `/login` and `/register` Google-only UI.
- Verify legal pages public.

## DNS/domain/deployment audit

Observed:

- `myeluna.com` redirects to `www.myeluna.com`.
- `www.myeluna.com` serves Vercel.
- `dev.myeluna.com` serves Vercel.
- No nginx server header observed in tested routes.

Risks:

- `origin` and `vercel` remotes differ.
- Need confirm Vercel project production aliases include both apex and www for final paid launch, not only dev.

Recommended domain state:

- `myeluna.com` -> Vercel redirect to `www`.
- `www.myeluna.com` -> Vercel production.
- `dev.myeluna.com` -> Vercel preview/staging or clearly separate environment.
- OAuth redirect URLs must include all domains used for auth.

## Security & privacy audit

Search results:

- No `SUPABASE_SERVICE`, `SERVICE_ROLE`, `STRIPE_SECRET`, `sk_live`, `sk_test`, `GOOGLE_CLIENT_SECRET`, or `APPLE` secrets found in `src`, `docs`, `.env.local.example`, or `package.json`.
- `dangerouslySetInnerHTML` found once for emoji in Past Life node.
- Password fields are normal controlled UI values; no password logging found.
- No Stripe secret in frontend because Stripe is not implemented.
- ReturnTo validation exists in legal and OAuth callback.

Risks:

- Future Stripe service role key must never enter client bundle.
- `dangerouslySetInnerHTML` should be removed or whitelisted.
- Mock auth should not be active in production Stripe mode.

## Manual QA checklist

| Route | Scenario | Expected | Current | Status |
| --- | --- | --- | --- | --- |
| `/home` | Unauthenticated direct open | Redirect to `/login?returnTo=/home` | `307` on www/dev | Pass |
| `/settings` | Unauthenticated direct open | Redirect to `/login?returnTo=/settings` | `307` on www | Pass |
| `/sky` | Unauthenticated direct open | Redirect to `/login?returnTo=/sky` | `307` on www | Pass |
| `/terms` | Unauthenticated direct open | Page loads | `200` | Pass |
| `/privacy` | Unauthenticated direct open | Page loads | `200` | Pass |
| `/login` | Social auth UI | Google visible, Apple absent | Production HTML shows Google only | Pass |
| `/register` | Social auth UI | Google visible, Apple absent | Production HTML shows Google only | Pass |
| `/auth/callback?returnTo=https://evil.com` | External redirect attempt | Fallback safe route | Code rejects external URLs | Needs manual browser test |
| `/register?source=pwa-install&origin=us-apps` -> legal link -> Back | Return navigation | Returns to register with query | Code supports returnTo | Needs manual browser test |
| `/sky/pastlife/1` | Logged-in free direct route | Should show paywall/deny if premium | Likely opens first node due `nodeId === 1` unlock | Fail, P0 |
| `/sky/soulmate/1` | Logged-in free direct route | Should show paywall/deny if premium | Likely opens first node due `nodeId === 1` unlock | Fail, P0 |
| `/practices` | Spoof plan in localStorage | Should not unlock premium | localStorage controls plan | Fail, P0 |
| SubscriptionModal | Click paid plan before Stripe | No fake success | Shows checkout unavailable | Pass pre-Stripe |
| Settings/Profile support | Billing/cancel/refund support | support email visible | Present | Pass |

## Commands run

Baseline:

- `git status`: clean working tree before audit.
- `git log --oneline --decorate -10`: recorded above.
- `git remote -v`: recorded above.
- `node -v`: `v24.15.0`.
- `npm -v`: `11.12.1`.
- `rm -rf .next`: completed.
- `npm run type-check`: passed.
- `npm run build`: passed.

Curl checks:

- `curl -I https://myeluna.com/home`: `307` to `https://www.myeluna.com/home`, Vercel.
- `curl -I https://www.myeluna.com/home`: `307` to `/login?returnTo=%2Fhome`, Vercel.
- `curl -I https://dev.myeluna.com/home`: `307` to `/login?returnTo=%2Fhome`, Vercel.
- `curl -I https://www.myeluna.com/settings`: `307` to `/login?returnTo=%2Fsettings`, Vercel.
- `curl -I https://www.myeluna.com/sky`: `307` to `/login?returnTo=%2Fsky`, Vercel.
- `curl -I https://www.myeluna.com/terms`: `200`, Vercel.
- `curl -I https://www.myeluna.com/privacy`: `200`, Vercel.
- `curl -I https://myeluna.com/terms`: `307` to `https://www.myeluna.com/terms`, Vercel.
- `curl -L https://www.myeluna.com/login | grep ...`: found `Continue with Google`.
- `curl -L https://www.myeluna.com/register | grep ...`: found `Sign up with Google`.

Grep checks:

- `grep -RIn "mock\|demo\|guest\|fakeUser\|defaultUser\|localStorage\|sessionStorage" src`
- `grep -RIn "getSession\|getUser\|onAuthStateChange\|AuthGuard\|middleware\|returnTo" src middleware.ts`
- `grep -RIn "router.push('/home')\|router.push(\"/home\")\|redirect('/home')\|redirect(\"/home\")" src middleware.ts`
- `grep -RIn "signInWithOAuth\|provider: 'google'\|provider: \"google\"\|Apple\|Continue with Apple\|Sign up with Apple\|auth/callback\|returnTo" src`
- `grep -RIn "returnTo\|router.back\|router.push\|href=\"/terms\|href=\"/privacy\|href=\"/billing\|href=\"/money-back\|support@myeluna.com\|refund\|cancel\|cancellation" src`
- `grep -RIn "SubscriptionModal\|trial\|29.99\|59.99\|89.99\|premium\|free\|paywall\|checkout\|stripe\|support@myeluna.com" src`
- `grep -RIn "stripe\|checkout\|customer_portal\|subscription_status\|plan_id\|trial_end\|current_period\|entitlement\|premium\|localStorage\|support@myeluna.com" src supabase .env.local.example .env.local package.json`
- `grep -RIn "locked\|unlock\|isPremium\|isFree\|plan\|subscription\|paywall\|premium\|entitlement" src`
- `grep -RIn "serviceWorker\|sw.js\|manifest\|cache\|workbox\|pwa" src public next.config.* package.json`
- `grep -RIn "SUPABASE_SERVICE\|SERVICE_ROLE\|STRIPE_SECRET\|sk_live\|sk_test\|dangerouslySetInnerHTML\|password\|console.log\|GOOGLE_CLIENT_SECRET\|APPLE" src .env.local.example package.json docs`
- `grep -RIn "lang === \"ru\"\|lang !== \"en\"\|ENABLE_RU_LOCALE\|eluna-lang\|ru:" src`

## Final recommendation

Do not connect live Stripe payments yet.

The product can proceed to a Stripe implementation sprint, but live payment buttons should remain disabled until:

1. Stripe Checkout and webhook routes exist.
2. Supabase subscription fields are finalized.
3. Entitlements are server-backed.
4. Premium direct-route bypasses are closed.
5. Support-based cancellation/refund operations are documented and webhook-synced.

Customer Portal is optional after MVP. The mandatory MVP requirement is that support-driven cancellations/refunds through `support@myeluna.com` reliably update Stripe and Supabase access state.
