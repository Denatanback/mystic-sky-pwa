# eLuna Locked Preview Paywall Remediation

Date: 2026-06-05 local workspace date  
Branch: main

## Summary

Registered users without active Intro or Premium access no longer see an almost-empty product route. `ProductAccessGate` now renders a dimmed, locked preview of the current product section with a premium paywall card above it.

The real product `children` are not mounted for no-active-plan users. This is the main safety guarantee: active route components, effects, forms, and action handlers do not run behind the overlay.

## What Changed

### Product Access Gate

- File: `src/components/subscription/ProductAccessGate.tsx`
- Result:
  - Users with `entitlements.hasFullAccess === true` still receive the real product page.
  - Users without full access receive a locked static preview chosen by pathname.
  - The old empty `No active plan` screen was replaced with a preview plus paywall card.
  - `Choose access` opens `SubscriptionModal`.
  - Guest users still go through `AuthRouteGuard` and redirect to `/login` before product pages render.

### Locked Preview Shell

- File: `src/components/subscription/LockedProductPreviewShell.tsx`
- Result:
  - Preview is visible but dimmed.
  - Preview layer uses reduced opacity, light grayscale/blur, `pointerEvents: "none"`, and `userSelect: "none"`.
  - Paywall card is positioned near the top of the mobile viewport.
  - Bottom nav remains mounted and usable visually.

### Static Product Previews

- File: `src/components/subscription/LockedProductPreviews.tsx`
- Static previews added for:
  - `/home`
  - `/daily-card`
  - `/sky`
  - `/path`
  - `/practices`
  - `/journal`
  - `/cards`

The previews are visual-only. They use static markup, spans, and inert preview cards instead of active route components.

## Side Effect Prevention

No-active-plan users do not mount the real product page `children`, so these actions are prevented by construction:

- Daily card reveal.
- Reflection save.
- Practice completion.
- Oracle form submit.
- Token balance display.
- Token ledger display.
- Progress writes.
- Path or Sky route actions.

## Local Verification

### Guest

- Guest route access still redirects to `/login`.

### Registered User Without Active Access

Verified locally at `390x844` viewport using a temporary registered Supabase test account with no subscription rows and no active Intro/Premium entitlement.

Routes checked:

- `/home`
- `/practices`
- `/path`
- `/sky`
- `/daily-card`

Expected result confirmed:

- Page is not empty.
- Dimmed locked preview is visible.
- Paywall card is visible near the top.
- `Choose access` opens `SubscriptionModal`.
- No horizontal scroll.
- No Oracle form is visible.
- No token balance is visible.
- No token ledger is visible.
- No progress/action localStorage writes occurred during route load or modal open.

## Copy Search

Command:

```bash
rg -n -i "free preview|free plan|free tier|free access|free trial|3-day trial|\$0|0 USD" src/app src/components src/lib public
```

Result:

- No restored user-facing free plan/tier/trial copy was found.
- Matches were `$1.00 USD` introductory-access pricing in legal/subscription/welcome copy, not free access copy.

## Verification Commands

- `npm run type-check`: PASS
- `npm run build`: PASS
- `npm run lint`: FAILED

Lint failure details:

```text
next lint
Invalid project directory provided, no such directory: /Users/mishaeremin/Desktop/eLuna_product/lint
```

This appears to be an existing Next lint script/tooling issue and was not a build blocker.

## Files

- `src/components/subscription/ProductAccessGate.tsx`
- `src/components/subscription/LockedProductPreviewShell.tsx`
- `src/components/subscription/LockedProductPreviews.tsx`
- `docs/audits/locked-preview-paywall-remediation.md`
