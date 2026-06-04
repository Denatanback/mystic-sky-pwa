# eLuna Welcome Head Final Storefront Audit

Date: 2026-06-05 local workspace date  
Audited by: Codex  
Production URL: https://welcome-head.myeluna.com  
Branch/commit: main / this audit report commit

## 1. Executive Summary

Landing/storefront status:
- READY WITH WARNINGS

Overall conclusion:
- `welcome-head` is suitable as the public marketing and Stripe-facing storefront landing.
- The landing presents product value, pricing, FAQ, support, legal links, digital delivery, cancellation/refund support, and safe self-reflection positioning.
- It does not implement or pretend to implement Stripe Checkout.
- Product entry points are limited to explicit account actions: `Create account` and `Sign in`.
- Remaining blockers are not landing blockers. They belong to the authenticated product/payment layer: Stripe Checkout, webhook-backed entitlement activation, success/cancel handling, and online subscription cancellation/customer portal.

## 2. What Was Fixed

- Product Proof: the phone visual was moved inward, reduced slightly, and kept inside the left visual scene so it no longer conflicts with the right text column.
- Mobile Product Proof: the phone layer is hidden on mobile; the section keeps the lighter dashboard/Sky Map style without horizontal overflow.
- CTA routing: storefront product-entry CTAs route only to registration or login.
- Legal pages Settings link: removed from the shared public legal page header.
- Footer/contact: footer displays eLuna, support@myeluna.com, EvoScale Company Limited, registered address, website, legal links, and support/contact.
- Trial wording: paid-intro copy is standardized around paid introductory access, not a free trial.
- Legacy strings: no Visage/Azora/legacy support email/Telegram/free-trial matches remain in the scoped storefront/legal/public search.

## 3. Link Routing Audit

| Area | Link/Button | Destination | Status | Notes |
|---|---|---|---|---|
| Header | Sign in | `https://www.myeluna.com/login` | PASS | Explicit auth CTA. |
| Hero | Create account | `https://www.myeluna.com/register` | PASS | Explicit account creation CTA. |
| Hero | Sign in | `https://www.myeluna.com/login` | PASS | Explicit auth CTA. |
| Header nav | Product | `#product` | PASS | Landing anchor. |
| Header nav | How it works | `#how-it-works` | PASS | Landing anchor. |
| Header nav | Pricing | `#pricing` | PASS | Landing anchor. |
| Header nav | FAQ | `#faq` | PASS | Landing anchor. |
| Header nav | Contact | `#contact` | PASS | Landing anchor. |
| Pricing cards | Create account | `https://www.myeluna.com/register` | PASS | Pricing action is account creation, not checkout. |
| Final CTA | Create account | `https://www.myeluna.com/register` | PASS | Explicit account creation CTA. |
| Contact | Support email | `mailto:support@myeluna.com` | PASS | Support/contact only. |
| Footer legal | Terms, Privacy, Billing, Refund, Cancellation, Delivery | Public legal pages | PASS | No product dashboard route. |
| Footer contact | Support / Contact | `/support` | PASS | Public support page. |
| Legal pages | Back control | Safe `returnTo`, referrer back, or `/` fallback | PASS | No Settings link. |

Explicit confirmations:
- Create account destination: `https://www.myeluna.com/register`.
- Sign in destination: `https://www.myeluna.com/login`.
- Pricing buttons destination: `https://www.myeluna.com/register`.
- Legal links destination: `/terms`, `/privacy`, `/billing`, `/money-back`, `/cancellation`, `/delivery`, `/support`.
- Support link destination: `/support` and `mailto:support@myeluna.com`.
- No Settings link on public legal pages.

## 4. Product Proof Visual Audit

- Desktop result: PASS. The proof visual and phone remain in the left column, with normal spacing from the right text and benefit rows.
- Mobile result: PASS. The phone layer is hidden and no horizontal scroll was detected.
- Assets used: existing `public/assets/landing/eluna-phone-sky-map.png`, CSS Sky Map mini visual, constellation overlay, and zodiac halo. The requested `eluna-product-proof-sky-map.png` and `eluna-product-proof-symbolic-card.png` were not present.
- Any remaining visual risks: low. The Product Proof section is decorative and should be rechecked if future asset swaps or layout changes are made.

## 5. Legal / Policy Pages Audit

| Page | Status | Settings link removed | Product link removed | Notes |
|---|---|---|---|---|
| Terms | PASS | Yes | Yes | Production returned HTTP 200. |
| Privacy | PASS | Yes | Yes | Production returned HTTP 200. |
| Billing | PASS | Yes | Yes | Production returned HTTP 200. |
| Refund | PASS | Yes | Yes | `/money-back` production returned HTTP 200. |
| Cancellation | PASS | Yes | Yes | Production returned HTTP 200. |
| Fulfillment | PASS | Yes | Yes | `/delivery` production returned HTTP 200. |
| Support | PASS | Yes | Yes | Production returned HTTP 200. |

## 6. Copy / Compliance Audit

Check results:
- No user-facing `free trial` wording in the scoped storefront/legal/public final search.
- No user-facing `3-day trial` wording in the scoped storefront/legal/public final search.
- $1 intro wording is clear as `3-day introductory access` / paid introductory access.
- Support email is `support@myeluna.com`.
- Company details use EvoScale Company Limited and the registered Hong Kong address.
- No Visage/Azora/legacy support email/Telegram matches in the scoped storefront/legal/public final search.
- Registration number remains in legal content and prior audit documentation only, which is acceptable for compliance records; it is not displayed in the visual welcome-head footer.

## 7. Mobile / UX Audit

- Horizontal scroll: PASS. Playwright mobile check reported `innerWidth: 390`, `scrollWidth: 390`, `bodyScrollWidth: 390`.
- Product proof mobile: PASS. Phone layer is hidden; dashboard/card visual remains.
- Footer mobile: PASS. Footer links and support email wrap/read normally.
- FAQ: PASS. Native `details` elements remain expandable.
- CTA buttons: PASS. Real links are used for real navigation.
- Fake clickability: PASS. Decorative phone/graphic layers are non-interactive and do not create fake checkout or fake phone UI actions.

## 8. Technical Verification

- `npm run type-check`: PASS.
- `npm run build`: PASS.
- Build warning: Next.js reports an existing custom Babel configuration that can be removed. This did not block the build.
- Wrong-string search: PASS for the scoped final command:
  - `rg -n -i "settings|support@visage|visage-ai|azora|telegram|free trial|3-day trial" src/app/welcome-head src/components/legal src/app/terms src/app/privacy src/app/billing src/app/money-back src/app/cancellation src/app/delivery src/app/support public`
- Route checks: PASS. Production returned HTTP 200 for:
  - `https://welcome-head.myeluna.com`
  - `https://welcome-head.myeluna.com/terms`
  - `https://welcome-head.myeluna.com/privacy`
  - `https://welcome-head.myeluna.com/billing`
  - `https://welcome-head.myeluna.com/money-back`
  - `https://welcome-head.myeluna.com/cancellation`
  - `https://welcome-head.myeluna.com/delivery`
  - `https://welcome-head.myeluna.com/support`

## 9. Remaining Warnings

Landing warnings:
- The storefront depends on `https://www.myeluna.com/register` and `https://www.myeluna.com/login` being live and aligned with the same pricing/legal disclosures.
- Any future changes to footer/legal navigation should preserve the no-Settings/no-dashboard boundary.

Main product/payment warnings:
- Stripe Checkout route was not found in the authenticated product layer during prior audit.
- Stripe webhook-backed entitlement activation was not found in the authenticated product layer during prior audit.
- Success/cancel payment return routes were not found in the authenticated product layer during prior audit.
- Stripe Customer Portal or equivalent online cancellation was not found in the authenticated product layer during prior audit.
- These are full payment-funnel blockers, not `welcome-head` storefront blockers.

## 10. Final Decision

Can `welcome-head` be used as the Stripe-facing storefront landing?

Answer:
- YES WITH WARNINGS

Can the full eLuna payment funnel be submitted for live Stripe payments?

Answer:
- NO

Reason:
- The public storefront landing is ready for review with normal dependency warnings on auth destination availability.
- The full paid funnel is not ready until the main product implements real Stripe Checkout, webhook-backed subscription state, success/cancel handling, and online cancellation/customer portal.
