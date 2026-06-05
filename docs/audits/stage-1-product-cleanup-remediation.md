# Stage 1 Product Cleanup Remediation

Date: 2026-06-05 local workspace date
Production URL: https://www.myeluna.com
Scope: Stage 1 cleanup before Stripe payment integration.
Deployment checked: Vercel production deployment `https://mystic-sky-3lf7j5dg4-mikes-projects-ee51be40.vercel.app`, status `Ready`.

## Summary

Stage 1 cleanup has been completed as a follow-up to the main product audit. The remediation focused on user-facing product trust issues before Stripe work: authenticated Daily Card access, route policy consistency, paid-access wording, Sky Map unlock consistency, English-only visible labels, and paywall copy that does not overpromise server-backed saved history.

## Remediated Items

### Route protection and route policy

- `/daily-card` is included in the protected route set on both server middleware and client guard.
- `/support` is explicitly included in both server and client public route sets.
- Production route check after remediation: `/daily-card` returns `307` to `/login?returnTo=%2Fdaily-card` for anonymous requests.
- Production route check after remediation: `/support` returns `200`.

### User-facing paid access wording

- User-facing plan label uses `Intro access`, not `Trial`.
- Search for `free trial`, `3-day trial`, and user-facing `Trial` found no visible copy requiring replacement.
- Internal identifiers such as `trial_3_day_1_usd` remain as internal plan IDs only.

### Daily Card route consistency

- Search for `/today#daily-card` and `#daily-card` returned no matches in product source.
- Practices Symbol practice links to `/daily-card`.

### Sky Map unlock consistency

- Past Life Signal no longer promises a practice-progress unlock while the route gate requires premium/full access.
- Grounding Practice now starts as a premium node in base data.
- Premium node requirements now consistently say `Available with Intro access or Premium`.

### Path and token labels

- Visible reward labels are English:
  - `Practice completed`
  - `Mood checked in`
  - `Daily card opened`
- Legacy localStorage ledger reasons are normalized to the English labels before display.
- The remaining non-English strings in `src/lib/lunaPath/storage.ts` are escaped legacy migration keys, not visible labels.

### Language cleanup

- Cyrillic source search returned `0` matches for `src/app`, `src/components`, and `src/lib`.
- `ru:` branches and romanized RU data remain in calculators and Sky node data, but current UI forces English:
  - `ENABLE_RU_LOCALE = false`
  - stored `ru` preferences are migrated to `en`
  - `LanguageProvider` passes `T.en`
  - checked Sky UI branches use English-only runtime paths
- Remaining `ru:` data is not user-facing in the current product state.

### Paywall and saved-history wording

- Subscription modal checkout notice now explicitly says checkout is not connected and no charge/subscription is created.
- Subscription benefit wording avoids promising server-backed saved history while major history systems are still browser-local.
- Welcome-head and Journal copy were softened from saved/account-record language to reflection/progress space language.
- Remaining `account-based access` copy refers to account access/entitlement, not server-backed saved history.

### Fake clickability

- Checked disabled and `Soon` elements in the Stage 1 product areas.
- The Path `Soon` control is disabled and uses `cursor: default`.
- Completed ritual/practice buttons use disabled states and default cursor.
- No Stage 1 non-interactive chips/badges were left with active click affordance.

## Verification

- `npm run type-check`: PASS.
- `npm run build`: PASS. Existing Next.js custom Babel configuration warning remains.
- Production `/daily-card`: PASS, `307` to `/login?returnTo=%2Fdaily-card`.

## Remaining Notes

- The product is still not ready for live Stripe payments until server-backed checkout, entitlements, token ledger, progress validation, Oracle generation/spend, and customer portal/cancellation flows are implemented.
- Existing unrelated dirty files were not included in Stage 1 remediation commits.
