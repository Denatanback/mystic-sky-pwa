# eLuna Stage 1.5 No Active Plan Gating

Date: 2026-06-05 local workspace date
Scope: registered user without active Intro access or Premium after Free tariff removal.

## Summary

Registered users without active subscription are now treated as `No active plan`.

They can create an account and sign in, but product surfaces are gated until `hasFullAccess` is true.

## Allowed Without Active Plan

- `/welcome`
- `/welcome-head`
- `/register`
- `/login`
- `/support`
- Legal pages: `/terms`, `/privacy`, `/policy`, `/billing`, `/money-back`, `/money`, `/cancellation`, `/delivery`
- Account/profile support and sign-out controls
- Subscription/paywall choose-access screen

## Gated Product Surfaces

The shared `ProductAccessGate` now blocks product usage without `hasFullAccess` on:

- `/home`
- `/today`
- `/daily-card`
- `/path`
- `/practices`
- `/sky`
- `/journal`
- `/cards`

Profile remains available as an account screen, but product widgets are gated:

- Path progress is hidden without active access.
- Personal chart and journal links are hidden without active access.
- A `No active plan` choose-access card is shown instead.

## Feature Restrictions

Without active access:

- Home product actions are not mounted.
- Today readings, reflections, cards, and practice actions are not mounted.
- Daily Card reveal/reflection/journal actions are not mounted.
- Daily Card no longer marks `cardOpened` unless `hasFullAccess` is true.
- Luna Path token/progress actions are not mounted.
- Oracle entry points and Oracle card are not mounted through Path/Practices gates.
- Sky Map is gated.
- Direct Sky node route entitlement now requires `hasFullAccess`; previous first-node exceptions were removed.
- Journal write/archive actions are not mounted.
- Cards/spread actions are not mounted.

## Paywall Location

The shared choose-access state is implemented in:

- `src/components/subscription/ProductAccessGate.tsx`

It displays:

- `No active plan`
- `Choose access`
- Subscription modal with Intro access / paid subscription options

## User-Facing Free / Trial Check

User-facing Free tariff copy was not found after Stage 1.5 targeted search.

Remaining `free` matches are internal compatibility enums/keys:

- `EntitlementPlan` / `SubscriptionStatus` legacy values
- `OracleMode` legacy value
- `SkyUnlockType` legacy unlock type

These remain so existing stored data and older entitlement rows can normalize safely. They are not shown as a user-facing plan label.

User-facing `Trial` is not used as a plan label. Active intro access is labeled `Intro access`.

## After Register / Onboarding

Registration and onboarding can still route to `/onboarding` or `/home` as technical account flow.

If the user has no active access, `/home` renders the `No active plan` choose-access state rather than active product actions.

If the user has active access, product routes render normally.

## Before Stripe

Before live Stripe launch, replace the current placeholder selection behavior with:

- Stripe Checkout session creation.
- Success/cancel return routes.
- Webhook-backed subscription rows.
- Server-side entitlement checks for product routes and API actions.
- Server-side token/progress/Oracle persistence and spend validation.

## Verification

- `npm run type-check`: PASS
- `npm run build`: PASS
- Build warning: existing Next.js custom Babel configuration warning remains.

## Commit / Deploy

- Commit hash: pending
- Production deploy status: pending
