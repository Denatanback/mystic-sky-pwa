# eLuna Stage 1 Product Cleanup Remediation

Date: 2026-06-05 local workspace date
Audited by: Codex
Scope: main product cleanup before Stripe implementation

## Summary

Stage 1 cleanup was completed for the main product without changing Stripe/payment logic, onboarding logic, legal pages, or route names.

Status:
- READY FOR VERIFICATION / DEPLOY

## Changes Made

### Daily Card Protection

`/daily-card` was added to both server and client protected route lists.

Files:
- `src/lib/supabase/middleware.ts`
- `src/components/auth/AuthRouteGuard.tsx`

Expected result:
- Anonymous users should be redirected to login with `returnTo=/daily-card`.

### Intro Access Wording

User-facing entitlement label `Trial` was replaced with `Intro access`.

Files:
- `src/lib/subscription/entitlements.ts`
- `src/components/subscription/PlanChip.tsx`
- `src/app/practices/page.tsx`

Notes:
- Existing internal subscription status `trialing` and the existing plan id are preserved because they are part of entitlement compatibility.
- The product UI no longer returns the `Trial` display label.

### Daily Card Route Link

Practices daily card CTA now routes to the dedicated Daily Card page.

File:
- `src/app/practices/page.tsx`

Change:
- `/today#daily-card` -> `/daily-card`

### Russian Branch Cleanup

User-facing `lang === "ru"` / `lang === 'ru'` rendering branches were disabled and simplified to English output across Today and Sky node pages.

Files:
- `src/app/today/page.tsx`
- `src/components/sky/NodePathPage.tsx`
- `src/app/sky/astrology/page.tsx`
- `src/app/sky/numerology/page.tsx`
- `src/app/sky/humandesign/page.tsx`
- `src/app/sky/pastlife/page.tsx`
- `src/app/sky/spiritual/page.tsx`
- `src/app/sky/soulmate/page.tsx`
- `src/app/sky/astrology/[nodeId]/page.tsx`
- `src/app/sky/numerology/[nodeId]/page.tsx`
- `src/app/sky/humandesign/[nodeId]/page.tsx`
- `src/app/sky/pastlife/[nodeId]/page.tsx`
- `src/app/sky/spiritual/[nodeId]/page.tsx`
- `src/app/sky/soulmate/[nodeId]/page.tsx`
- `src/lib/dailyCalc.ts`

Final search:
- `rg -n "/today#daily-card|lang === \"ru\"|lang === 'ru'" src/app src/components src/lib`: PASS, no matches.
- `rg -n "[А-Яа-яЁё]" src/app src/components src/lib`: PASS, no matches.

### Path / Tokens Labels

Path and token-facing labels were checked. Current visible labels are English:
- Moonlight
- Lunar Tokens
- Practice completed
- Mood checked in
- Daily card opened

Note:
- `src/lib/lunaPath/storage.ts` keeps legacy normalization for older stored local ledger strings. This is compatibility cleanup, not active UI copy.

### Bottom Navigation Polish

The centered Sky tab remains primary, but its glow and elevation were softened.

File:
- `src/components/app-shell/bottom-nav.css`

Changes:
- reduced glow size, blur, and opacity;
- reduced Sky vertical offset;
- reduced Sky circle and icon size;
- softened panel shadow and inactive tab colors.

### Paywall Benefit Copy

Paid benefit copy that implied server-backed saved progress/history was softened.

Files:
- `src/components/subscription/SubscriptionModal.tsx`
- `src/app/sky/page.tsx`

Examples:
- `Saved progress` -> `Progress features`
- `Saved history and progress` -> `Progress and reflection features`
- Sky unlock explainer now says `progress features`.

## Fake Clickability Check

No new fake checkout, fake payment, or fake subscription buttons were added. The existing subscription modal still keeps checkout unavailable instead of pretending to complete payment.

Decorative navigation and visual changes did not introduce independent fake-clickable image elements.

## Verification

Commands:
- `npm run type-check`: PASS
- `npm run build`: PASS

Build warning:
- Next.js still reports an existing custom Babel configuration. This is pre-existing and did not block the build.

Final wrong-string search:
- `rg -n -i "free trial|3-day trial|\bTrial\b|support@visage|visage-ai|azora|telegram" src/app src/components src/lib public`: PASS, no matches.

## Remaining Notes

- Stripe Checkout, webhook-backed entitlements, server-backed token/progress state, and customer portal remain separate launch blockers from the prior full audit.
- `/daily-card` protection must be confirmed on production after deploy.
