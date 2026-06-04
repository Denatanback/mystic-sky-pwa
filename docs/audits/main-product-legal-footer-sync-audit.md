# eLuna Main Product Legal/Footer Sync Audit

Date: 2026-06-05 local workspace date  
Audited by: Codex  
Production URL: https://www.myeluna.com  
Branch/commit: main / this audit report commit

## 1. Executive Summary

Status:
- READY WITH WARNINGS

Summary:
- The main product public welcome/legal/support layer is aligned with the `welcome-head` Stripe-facing storefront legal/compliance data.
- Public legal pages use the shared eLuna legal content module with EvoScale Company Limited, the Hong Kong registered address, registration number, website, and `support@myeluna.com`.
- The `/welcome` screen now includes a compact legal/support footer with support email, company details, legal links, and the self-reflection disclaimer.
- Public legal pages do not expose Settings, dashboard, profile, or account-management controls.
- Remaining warnings are payment-funnel warnings, not legal/footer sync blockers.

## 2. What Was Updated

- Legal pages: shared legal content now uses `Terms of Service`, the EvoScale Company Limited registered address with `54–62 Lockhart Road`, and public legal footer navigation.
- Support page: includes the requested support prompt for payments, subscriptions, refunds, data usage, and account access.
- Welcome footer: added compact footer/legal/support block to `/welcome`.
- Support email: `support@myeluna.com` is visible on `/welcome` and all public legal/support pages.
- Company details: EvoScale Company Limited, registered address, website, and registration number are present in legal/support pages; compact welcome footer shows legal name, address, website, and support email.
- Trial wording: public paid copy remains standardized around `3-day introductory access for $1` / paid introductory access, not free trial.
- Legacy strings: no user-facing Visage/Azora/legacy email/Telegram/placeholders were found in the main public/legal source scope.

## 3. Main Welcome Footer Check

| Item | Status | Notes |
|---|---|---|
| Support email visible | PASS | `/welcome` shows `support@myeluna.com` as a mailto link. |
| Legal links visible | PASS | Terms, Privacy, Billing, Refund, Cancellation, Fulfillment, and Support links are visible. |
| Company details visible | PASS | EvoScale Company Limited, registered address, and `https://www.myeluna.com` are visible. |
| Disclaimer visible | PASS | Self-reflection / entertainment disclaimer is visible. |
| Mobile readable | PASS | Playwright mobile check reported `innerWidth: 390`, `scrollWidth: 390`, and no horizontal overflow. |

## 4. Legal Pages Check

| Page | Status | Uses eLuna/EvoScale data | Has support email | No Settings link | Notes |
|---|---|---|---|---|---|
| Terms | PASS | Yes | Yes | Yes | Title is now `Terms of Service`. |
| Privacy | PASS | Yes | Yes | Yes | Uses shared privacy policy. |
| Billing | PASS | Yes | Yes | Yes | Uses shared billing terms and paid-intro wording. |
| Refund | PASS | Yes | Yes | Yes | `/money-back` uses shared refund policy. |
| Cancellation | PASS | Yes | Yes | Yes | Uses shared cancellation policy. |
| Fulfillment | PASS | Yes | Yes | Yes | `/delivery` uses shared fulfillment / delivery policy. |
| Support | PASS | Yes | Yes | Yes | Includes requested contact/support wording. |

## 5. Routing Check

Confirm:
- Create account destination: `/register`.
- Sign in destination: `/login`.
- Legal links: `/terms`, `/privacy`, `/billing`, `/money-back`, `/cancellation`, `/delivery`, `/support`.
- Support link: `mailto:support@myeluna.com?subject=eLuna%20Support` and `/support`.
- No Settings links on public legal pages: PASS. Local DOM check found no Settings/dashboard/profile/account-management controls on `/terms`, `/privacy`, `/billing`, `/money-back`, `/cancellation`, `/delivery`, or `/support`.

## 6. Wrong String Search

Search command:
- `rg -n -i "visage|azora|support@visage|support@eluna|telegram|image generation|EL Software|azora-astro|visage-ai|\\[LEGAL|\\[ADDRESS|\\[COUNTRY|\\[PRICE" src public docs`

Results:
- PASS for active user-facing main product/legal/public source.
- Remaining matches are prior audit documentation references and auth/internal `legalReturnTo` state names, not public legacy brand/support copy.
- Targeted public legal Settings search returned no matches for `src/app/terms`, `src/app/privacy`, `src/app/billing`, `src/app/money-back`, `src/app/cancellation`, `src/app/delivery`, `src/app/support`, or `src/components/legal`.

## 7. Technical Verification

- `npm run type-check`: PASS.
- `npm run build`: PASS.
- Build warning: Next.js reports an existing custom Babel configuration that can be removed. This did not block the build.
- Local route checks: PASS. Local production build returned HTTP/DOM status 200 for `/welcome`, `/terms`, `/privacy`, `/billing`, `/money-back`, `/cancellation`, `/delivery`, and `/support`.
- Mobile route checks: PASS. `/welcome` and all legal/support routes reported `scrollWidth` equal to `innerWidth` at 390px viewport.

## 8. Remaining Warnings

Main product legal/footer warnings:
- The compact welcome footer should be rechecked if the welcome page layout or translations change.
- Public legal content depends on the shared legal module remaining synchronized with any future Stripe/checkout disclosures.

Payment funnel warnings:
- Stripe Checkout route was not part of this legal/footer sync.
- Stripe webhook-backed entitlement activation was not part of this legal/footer sync.
- Payment success/cancel return routes were not part of this legal/footer sync.
- Stripe Customer Portal or equivalent online cancellation was not part of this legal/footer sync.
- Missing Stripe Checkout/webhooks/customer portal are payment-funnel blockers, not legal/footer sync blockers.

## 9. Final Decision

Can the main product public welcome/legal/support layer be considered aligned with the Stripe-facing landing?

Answer:
- YES WITH WARNINGS

Can full paid funnel be considered ready?

Answer:
- NO
