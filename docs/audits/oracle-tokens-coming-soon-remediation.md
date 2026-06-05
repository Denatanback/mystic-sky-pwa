# eLuna Oracle & Tokens Coming Soon Remediation

Date: 2026-06-05 local workspace date  
Branch/commit: main / 366ea7d

## Summary

Oracle and Lunar Tokens are temporarily moved out of active product UI while server-side Oracle generation, token ledger, and entitlement-backed spending are not implemented.

Oracle remains visible as a premium future feature. Lunar Tokens are shown only as a future reward-system preview or hidden from active balances and ledger UI.

## What Changed

### Oracle

- Status: Coming Soon.
- Files:
  - `src/lib/productFeatureFlags.ts`
  - `src/components/lunaPath/OraclePracticeCard.tsx`
  - `src/components/lunaPath/OraclePreviewCard.tsx`
  - `src/components/lunaPath/shared.tsx`
- New UI:
  - Practices shows a premium glass Coming Soon card for eLuna Oracle.
  - Path shows a Coming Soon Oracle preview.
  - No textarea, question modes, token costs, answer history, delete action, or fake Oracle response are mounted while `oracleEnabled` is false.

### Lunar Tokens

- Status: Coming Soon / hidden.
- Files:
  - `src/lib/productFeatureFlags.ts`
  - `src/components/lunaPath/TokenEducationCard.tsx`
  - `src/components/lunaPath/TokenLedgerPreview.tsx`
  - `src/components/lunaPath/LunaPathStatusCard.tsx`
  - `src/components/lunaPath/DailyRituals.tsx`
  - `src/app/path/page.tsx`
- Hidden or Coming Soon:
  - Token balance is hidden.
  - Token ledger is not rendered.
  - Ritual reward labels no longer show token earnings while tokens are disabled.
  - Token education is replaced by a compact Coming Soon reward-system preview.
  - Path streak-repair copy no longer shows a token price.

### Path Preview

- Status: Coming Soon.
- Files:
  - `src/components/lunaPath/OraclePreviewCard.tsx`
  - `src/app/path/page.tsx`
- Result:
  - `Go to Oracle` active link was removed.
  - Path shows `Coming soon` for Oracle and no active token ledger.

### Practices

- Status: Coming Soon Oracle card.
- Files:
  - `src/app/practices/page.tsx`
  - `src/components/lunaPath/OraclePracticeCard.tsx`
- Result:
  - Practices shows eLuna Oracle as a premium future feature.
  - No active Oracle form, token balance, token modes, recent questions, or history are shown.

## Feature Flags

- `oracleEnabled`: `false`
- `lunarTokensEnabled`: `false`

Feature flags live in:

- `src/lib/productFeatureFlags.ts`

## Verification

- `npm run type-check`: PASS
- `npm run build`: PASS
- Free tariff search: no user-facing free tariff restored in product source; older audit docs still mention past findings.
- Active token UI search: active token strings remain only in disabled/future code paths or Coming Soon copy.
- Active Oracle UI search: active Oracle logic remains for future re-enable but is not mounted while `oracleEnabled` is false.

## Remaining Future Work

- Server-side Oracle API.
- Server-side token ledger.
- Stripe entitlement integration for Oracle and token access.
- Oracle history persistence.
- Server-side spend validation and rollback.
- Re-enable feature flags only after server-side implementation is ready.
