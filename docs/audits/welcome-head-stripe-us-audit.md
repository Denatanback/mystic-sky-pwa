# eLuna Welcome Head Landing — Stripe & US Compliance Audit

Date: 2026-06-05 local workspace date / 2026-06-04 production response date  
Audited by: Codex  
Production URL: https://welcome-head.myeluna.com  
Repository branch/commit: main / cdd12a3

Revision note:
- This earlier audit mixed two layers: `welcome-head` as a public Stripe-facing storefront and the authenticated eLuna product as the place where registration, onboarding, paywall, checkout, and subscription management should live.
- For the architecture-correct readiness view, see `docs/audits/eluna-stripe-funnel-readiness.md`.

## 1. Executive Summary

Overall status:
- NOT READY / BLOCKERS

Short conclusion:
- The public `welcome-head` landing is substantially ready as a Stripe-facing website surface: product description, visible pricing, support contact, company details, policy links, refund/cancellation/delivery pages, and disclaimers are present.
- Production route checks for the landing and all required policy/support pages returned HTTP 200.
- Pricing on the landing and legal pages matches the requested public pricing structure in USD.
- Company details match the requested entity, registration number, website, and support email.
- The core blocker is Stripe/payment readiness: no live Stripe Checkout route, checkout API, webhook-backed activation, success flow, statement descriptor, or Customer Portal/self-service cancellation implementation was found.
- The subscription modal explicitly states that secure checkout is still being prepared, so paid plan purchase is not currently functional.
- US subscription risk remains high if paid checkout is enabled without online self-service cancellation or Stripe Customer Portal.
- App/paywall copy outside the landing used paid-intro wording inconsistently, which was risky because the actual offer is a paid $1 introductory access.
- Terms include an explicit note that governing law/dispute language needs legal counsel review before paid launch.
- Build and type-check pass, with one non-blocking Next/Babel warning.

Top blockers:
1. Stripe Checkout is not implemented; paid plan selection only shows "Payment checkout needs to be connected" (`src/components/subscription/SubscriptionModal.tsx:135-142`, `src/components/subscription/SubscriptionModal.tsx:223-227`).
2. No webhook-backed subscription activation/customer portal/success flow was found; Supabase docs state real activation must happen later through backend/webhook/payment provider (`SUPABASE_SETUP.md:59-71`).
3. Online self-service cancellation / Stripe Customer Portal is not implemented; cancellation is email-based only (`src/lib/legal/legalContent.ts:489-504`).

Top warnings:
1. Multiple app/paywall source strings used paid-intro wording inconsistently rather than "$1 introductory access" (`src/components/sky/SkyNodeEntitlementGate.tsx`, `src/lib/funnel/prelandExperiences.ts`, `src/components/sky/NodePreviewSheet.tsx`).
2. Terms intentionally defer governing law/dispute language to legal counsel before paid checkout (`src/lib/legal/legalContent.ts:287-290`).
3. Large PNG assets are rendered with raw `<img>` rather than Next Image/explicit intrinsic dimensions on the landing (`src/app/welcome-head/page.tsx:287`, `src/app/welcome-head/page.tsx:1409`).

## 2. Scope

What was checked:
- Landing page `https://welcome-head.myeluna.com`.
- Legal pages: Terms, Privacy, Billing, Refund, Cancellation, Fulfillment/Delivery.
- Support/contact page and footer/contact area.
- Pricing text and currency consistency.
- Subscription modal and checkout-related source code.
- Supabase subscription schema/docs for activation readiness.
- Mobile/desktop DOM layout and horizontal scroll checks.
- Copy risk for astrology/symbolic guidance/fortune-telling/medical/legal/financial/therapy claims.
- Production route status.
- `npm run type-check` and `npm run build`.

What was not checked:
- Actual Stripe Dashboard products, prices, statement descriptor, tax settings, customer portal settings, or webhook endpoint configuration.
- Live payment processing, because no implemented checkout flow was found in code.
- Legal validity of policies; this audit flags legal-review needs but is not legal advice.

## 3. Stripe Website Checklist

| Item | Status | Evidence | Risk | Required action |
|---|---|---|---|---|
| Product description | PASS | Hero identifies "ELUNA DIGITAL SUBSCRIPTION APP" and self-reflection value (`src/app/welcome-head/page.tsx:1311-1317`); Product section states digital subscription app and no guaranteed predictions (`src/app/welcome-head/page.tsx:1343-1348`). | Low. Clear enough for reviewer. | Keep current safe positioning. |
| Pricing and currency | PASS | Landing plan constants include $0, $1.00, $29.99, $59.99, $89.99 in USD (`src/app/welcome-head/page.tsx:94-133`); Billing Terms match (`src/lib/legal/legalContent.ts:397-421`). | Low. Public pricing is consistent. | None before review, except checkout implementation must use the same prices. |
| Support contact | PASS | Landing trust/support/footer use `support@myeluna.com` (`src/app/welcome-head/page.tsx:39-44`, `src/app/welcome-head/page.tsx:1474-1487`, `src/app/welcome-head/page.tsx:1518-1522`); legal constants match (`src/lib/legal/legalContent.ts:18-22`). | Low. | None. |
| Refund Policy | PASS | `/money-back` returned HTTP 200; Refund Policy covers digital subscription, cancellation, support, case-by-case refund eligibility (`src/lib/legal/legalContent.ts:306-388`). | Low/medium; refund review is case-by-case, acceptable if checkout terms show clearly. | Ensure checkout links to Refund Policy before payment. |
| Cancellation Policy | WARNING | `/cancellation` returned HTTP 200; cancellation via email and response time are present (`src/lib/legal/legalContent.ts:481-524`). | Medium/high for US subscriptions because no self-service cancellation/customer portal was found. | Add online self-service cancellation or Stripe Customer Portal before paid US launch. |
| Digital Delivery/Fulfillment | PASS | `/delivery` returned HTTP 200; no physical goods, account-based access, delivery issue support present (`src/lib/legal/legalContent.ts:527-570`). | Low. | None. |
| Terms of Service | WARNING | `/terms` returned HTTP 200; Terms cover service, eligibility, billing, cancellation, no professional advice, liability, contact (`src/lib/legal/legalContent.ts:167-304`). | Medium: governing law/dispute section says legal counsel must confirm before live checkout (`src/lib/legal/legalContent.ts:287-290`). | Legal counsel should finalize governing law/dispute language before paid launch. |
| Privacy Policy | PASS | `/privacy` returned HTTP 200; includes account, birth data, quiz/profile, usage, payment provider, cookies, US and California notices, children/COPPA language (`src/lib/legal/legalContent.ts:40-145`). | Low/medium depending on real analytics/ad practices. | Keep policy aligned with actual analytics/ads before paid traffic. |
| Company details | PASS | Constants match EvoScale Company Limited, Hong Kong address, registration number, website, support (`src/lib/legal/legalContent.ts:14-23`); footer renders company strip (`src/app/welcome-head/page.tsx:1526-1546`). | Low. | None. |

## 4. US Subscription Compliance Risk

| Item | Status | Evidence | Risk | Required action |
|---|---|---|---|---|
| Auto-renewal clarity | PASS | Landing states subscriptions renew automatically and prices are USD (`src/app/welcome-head/page.tsx:1437-1440`); Billing Terms authorize recurring charges (`src/lib/legal/legalContent.ts:424-435`); modal copy says $1 intro renews at $29.99/month unless canceled before day 3 (`src/components/subscription/SubscriptionModal.tsx:315-322`). | Low once checkout is implemented correctly. | Mirror the same disclosure in Stripe Checkout / pre-checkout consent. |
| Introductory access clarity | WARNING | Landing uses "Introductory access" and "$1.00 USD" (`src/app/welcome-head/page.tsx:102-108`); Billing Terms use introductory access (`src/lib/legal/legalContent.ts:405-421`). | Medium if app/paywall areas use paid-intro wording inconsistently. | Keep source/live paywall wording aligned with "$1 introductory access" before paid review. |
| Cancellation method | WARNING | Cancellation is email-based (`src/lib/legal/legalContent.ts:489-504`). | Medium/high for US subscriptions, especially if signup/payment are online. | Add in-account cancellation or Stripe Customer Portal. |
| Self-service cancellation | BLOCKER | No customer portal or account cancel route found; policy says account tools may become available later (`src/lib/legal/legalContent.ts:491`, `src/lib/legal/legalContent.ts:498`). | High. Many US auto-renewal regimes expect easy online cancellation if signup is online. | Implement and expose online cancellation before live paid launch. |
| Recurring billing consent | WARNING | Modal has recurring consent text (`src/components/subscription/SubscriptionModal.tsx:315-322`) but no actual checkout flow exists. | Medium until implemented in real payment flow. | Add explicit pre-payment consent and policy links in checkout flow. |
| Dark patterns | PASS | No pre-checked checkbox or hidden pricing found. Paid buttons currently show checkout-unavailable rather than fake purchase (`src/components/subscription/SubscriptionModal.tsx:135-142`, `src/components/subscription/SubscriptionModal.tsx:223-227`). | Low. | Keep no fake checkout behavior. |
| Misleading paid-intro language | WARNING | Multiple source strings previously used ambiguous intro wording (`src/components/sky/SkyNodeEntitlementGate.tsx`, `src/lib/funnel/prelandExperiences.ts`, `src/components/sky/NodePreviewSheet.tsx`). | Medium. Ambiguous trial wording can imply no upfront charge; offer is paid $1. | Standardize to "3-day introductory access for $1". |
| Hidden recurring billing | PASS now / WARNING before checkout | Landing, Billing Terms and modal disclose renewal. | Medium if checkout does not repeat disclosure. | Ensure checkout/product names repeat renewal timing and post-intro price. |

## 5. Stripe Checkout / Billing Readiness

Stripe Checkout consistency: FAIL / BLOCKER

Findings:
- Checkout exists: Not found in current implementation.
- Product names: Present in modal/landing copy only; no Stripe product/price mapping found in code.
- Price/currency consistency: Landing, Billing Terms, and SubscriptionModal match the requested USD prices (`src/app/welcome-head/page.tsx:94-133`, `src/lib/legal/legalContent.ts:397-421`, `src/components/subscription/SubscriptionModal.tsx:55-107`).
- Success page: Not found in current implementation.
- Subscription activation: Not implemented. Supabase docs state real subscription activation must happen later through backend/webhook/payment provider (`SUPABASE_SETUP.md:59-71`).
- Webhook: Not found in current implementation.
- Customer portal: Not found in current implementation.
- Cancellation flow: Policy/email flow exists, but no in-app/self-service cancellation or Stripe Customer Portal was found (`src/lib/legal/legalContent.ts:489-504`).
- Legal links in checkout: SubscriptionModal links to Terms, Billing, Refund, Cancellation, Privacy (`src/components/subscription/SubscriptionModal.tsx:356-365`), but this is not a real checkout.
- Visible recurring billing consent: Modal has consent copy for the intro plan (`src/components/subscription/SubscriptionModal.tsx:315-322`), but no actual payment step exists.
- Statement descriptor: Not found in current implementation.

Required before Stripe submission for a paid product:
1. Add a server-side Stripe Checkout Session route.
2. Map plan IDs to Stripe Price IDs and verify USD/period consistency.
3. Add webhook handler for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, failed payments, and invoice events.
4. Add success/cancel return routes.
5. Add Stripe Customer Portal or equivalent online cancellation.
6. Persist subscription activation with trusted server/service-role logic.

## 6. Content Risk Audit

| Term | File | Context | Risk | Recommendation |
|---|---|---|---|---|
| paid-intro wording | `src/components/sky/SkyNodeEntitlementGate.tsx` | Introductory access gate copy. | Medium if wording implies no upfront charge despite $1 paid intro. | Use "Start 3-day introductory access for $1". |
| paid-intro wording | `src/lib/funnel/prelandExperiences.ts` | Funnel/paywall descriptions. | Medium if funnel/paywall copy mismatches paid intro access. | Standardize funnel copy before paid traffic/Stripe review. |
| paid-intro wording | `src/components/sky/NodePreviewSheet.tsx` | Premium CTA label. | Medium if CTA omits the $1 paid intro context. | Use "Start 3-day access for $1". |
| medical / psychological / legal / financial / crisis | `src/lib/legal/legalContent.ts:25` | Global disclaimer says eLuna does not provide those categories of professional advice. | Low: protective disclaimer. | Keep. |
| guaranteed / predictions | `src/lib/legal/legalContent.ts:182-185` | Terms state no guaranteed predictions and no guaranteed outcomes. | Low: protective. | Keep. |
| future events | `src/lib/legal/legalContent.ts:184` | Terms disclaim future events/outcomes. | Low: protective. | Keep. |
| Healing | `src/app/sky/astrology/[nodeId]/page.tsx:162`, `src/lib/astroCalc.ts:122` | "The Healing Moon", "gift for restoring order and wellbeing". | Low/medium outside landing; could be interpreted as wellness/healing claim. | Review in-app astrology copy if Stripe examines authenticated content. |
| prediction | `src/app/path/page.tsx:73` | "This signal is not a prediction." | Low: protective. | Keep. |
| fortune/psychic/gambling/casino/betting/lottery/prize | `rg` source search | No production source matches found for these terms in relevant app source. | Low. | None. |
| wrong emails/placeholders | `rg` source search | No matches found for legacy support emails, unrelated brand names, messenger references, or placeholder legal fields in `src public package.json supabase docs`. | Low. | Keep monitoring before launch. |

## 7. Legal Pages Audit

### Terms of Service
- Status: WARNING.
- URL: https://welcome-head.myeluna.com/terms
- HTTP result: 200.
- Present: entity/service description, eligibility, account terms, billing/renewal, cancellation/refund references, no professional advice disclaimer, prohibited conduct, limitation of liability, contact (`src/lib/legal/legalContent.ts:167-304`).
- Missing/concern: governing law/dispute language is intentionally not final and requires legal counsel (`src/lib/legal/legalContent.ts:287-290`).
- Placeholders: none found.
- Legal review needed: yes.

### Privacy Policy
- Status: PASS.
- URL: https://welcome-head.myeluna.com/privacy
- HTTP result: 200.
- Present: account data, birth data, quiz/profile data, usage data, payment provider handling, cookies/storage, US and California notices, children section (`src/lib/legal/legalContent.ts:40-145`).
- Missing/concern: update before adding new analytics/ad retargeting or data sharing.
- Placeholders: none found.
- Legal review needed: recommended for US targeting, not a technical blocker.

### Billing Terms
- Status: PASS.
- URL: https://welcome-head.myeluna.com/billing
- HTTP result: 200.
- Present: USD pricing, intro access conversion, recurring authorization, automatic renewal, cancellation, support, payment providers (`src/lib/legal/legalContent.ts:391-478`).
- Missing/concern: currently references checkout terms "when available"; real checkout is not yet available.
- Placeholders: none found.
- Legal review needed: recommended.

### Refund Policy
- Status: PASS.
- URL: https://welcome-head.myeluna.com/money-back
- HTTP result: 200.
- Present: digital subscription, no physical goods, cancellation instructions, refund request data, case-by-case eligibility, non-refundable situations, U.S. residents note (`src/lib/legal/legalContent.ts:306-388`).
- Missing/concern: checkout must show/route to this policy.
- Placeholders: none found.
- Legal review needed: recommended.

### Cancellation Policy
- Status: WARNING.
- URL: https://welcome-head.myeluna.com/cancellation
- HTTP result: 200.
- Present: how to cancel, support email, response time, future billing stops after processing, what does not cancel subscription (`src/lib/legal/legalContent.ts:481-524`).
- Missing/concern: no self-service cancellation/Customer Portal found. Email-only cancellation is high-risk for US online subscriptions.
- Placeholders: none found.
- Legal review needed: yes for US subscription launch.

### Fulfillment Policy
- Status: PASS.
- URL: https://welcome-head.myeluna.com/delivery
- HTTP result: 200.
- Present: no physical goods, online account delivery, paid access after subscription activation, delivery issue support (`src/lib/legal/legalContent.ts:527-570`).
- Missing/concern: none material.
- Placeholders: none found.
- Legal review needed: recommended.

### Support
- Status: PASS.
- URL: https://welcome-head.myeluna.com/support
- HTTP result: 200.
- Present: support email, response time, what to include, digital subscription notice, company details (`src/lib/legal/legalContent.ts:572+`, verified by route 200).
- Missing/concern: none material.
- Placeholders: none found.
- Legal review needed: no technical blocker.

## 8. Bug / UX Audit

### Header/navigation
- Issue: none material found.
- Severity: PASS.
- Evidence: Production DOM includes anchors for `#product`, `#how-it-works`, `#pricing`, `#faq`, `#contact`; nav hrefs match.
- Recommended fix: none.

### Hero
- Issue: no production breakage found.
- Severity: PASS.
- Evidence: Production DOM hero image source is `/assets/landing/eluna-hero-phones-transparent.png`; desktop and mobile `scrollWidth` equals viewport width; hero has alt text.
- Recommended fix: none.

### Product section
- Issue: cards are informational and do not use obvious pointer cursor in audited code.
- Severity: PASS.
- Evidence: Product copy explains digital self-reflection and no guaranteed predictions (`src/app/welcome-head/page.tsx:1343-1348`).
- Recommended fix: none.

### Product proof
- Issue: Decorative proof phone screens use CSS/background images and no alt because they are `aria-hidden`.
- Severity: PASS.
- Evidence: `ScreenPhone` uses `aria-hidden="true"` (`src/app/welcome-head/page.tsx:240-246`).
- Recommended fix: none.

### How it works
- Issue: none material found.
- Severity: PASS.
- Evidence: digital access flow and no physical goods statement (`src/app/welcome-head/page.tsx:1379-1395`).
- Recommended fix: none.

### Testimonials
- Issue: no "Verified reviews" claim found; images loaded with square natural dimensions and one-column mobile grid.
- Severity: PASS.
- Evidence: testimonial section before pricing (`src/app/welcome-head/page.tsx:1398-1425`); production DOM image natural size 1254x1254 for all avatars.
- Recommended fix: none.

### Pricing
- Issue: pricing is readable and buttons lead to account creation; not a fake checkout on the landing.
- Severity: PASS for landing / BLOCKER for actual checkout readiness.
- Evidence: Pricing section at `#pricing` and recurring disclosure (`src/app/welcome-head/page.tsx:1425-1440`).
- Recommended fix: implement real checkout before asking Stripe to approve paid processing.

### FAQ
- Issue: native `<details>` accordion is functional.
- Severity: PASS.
- Evidence: production DOM found 7 details elements and summary cursor pointer.
- Recommended fix: none.

### CTA
- Issue: none material found; CTA creates account and does not duplicate phone mockup.
- Severity: PASS.
- Evidence: `FinalCta` uses astrology decoration and Create account only (`src/app/welcome-head/page.tsx:329-357`).
- Recommended fix: none.

### Contact/Footer
- Issue: none material found.
- Severity: PASS.
- Evidence: support email visible/clickable and company details rendered in footer (`src/app/welcome-head/page.tsx:1474-1546`).
- Recommended fix: none.

### Mobile
- Issue: none material found in DOM metrics.
- Severity: PASS.
- Evidence: Playwright mobile check: `clientWidth=390`, `scrollWidth=390`, testimonials grid one column.
- Recommended fix: none.

### Accessibility
- Issue: generally acceptable basics; raw images have alt where meaningful, decorative scenes use `aria-hidden`.
- Severity: WARNING.
- Evidence: hero image has alt; testimonial avatars have alt; FAQ uses native summary/details. Inline focus styles are not consistently customized, so browser defaults must carry focus.
- Recommended fix: add consistent visible focus styles before larger traffic launch.

### Performance/images
- Issue: large PNG assets are served via raw `<img>` and CSS backgrounds, not `next/image`; no explicit width/height attributes on hero/testimonial images.
- Severity: WARNING.
- Evidence: hero raw `<img>` (`src/app/welcome-head/page.tsx:287`); testimonial raw `<img>` (`src/app/welcome-head/page.tsx:1409`); hero PNG is about 1.6 MB, testimonial PNGs about 1.9-2.1 MB each from `git diff --stat` in previous commit.
- Recommended fix: consider optimized WebP/AVIF and Next Image or explicit dimensions/lazy loading.

## 9. Route / Link Check

| URL/link | Status | Expected | Result | Issue |
|---|---|---|---|---|
| https://welcome-head.myeluna.com | 200 | Landing loads | HTTP/2 200, `x-matched-path: /welcome-head` | None |
| https://welcome-head.myeluna.com/terms | 200 | Terms page | HTTP/2 200, `x-matched-path: /terms` | None |
| https://welcome-head.myeluna.com/privacy | 200 | Privacy page | HTTP/2 200, `x-matched-path: /privacy` | None |
| https://welcome-head.myeluna.com/billing | 200 | Billing Terms | HTTP/2 200, `x-matched-path: /billing` | None |
| https://welcome-head.myeluna.com/money-back | 200 | Refund Policy | HTTP/2 200, `x-matched-path: /money-back` | None |
| https://welcome-head.myeluna.com/cancellation | 200 | Cancellation Policy | HTTP/2 200, `x-matched-path: /cancellation` | None |
| https://welcome-head.myeluna.com/delivery | 200 | Fulfillment/Delivery Policy | HTTP/2 200, `x-matched-path: /delivery` | None |
| https://welcome-head.myeluna.com/support | 200 | Support/Contact page | HTTP/2 200, `x-matched-path: /support` | None |
| Product nav | PASS | `#product` | Anchor exists in production DOM | None |
| How it works nav | PASS | `#how-it-works` | Anchor exists in production DOM | None |
| Pricing nav | PASS | `#pricing` | Anchor exists in production DOM | None |
| FAQ nav | PASS | `#faq` | Anchor exists in production DOM | None |
| Contact nav | PASS | `#contact` | Anchor exists in production DOM | None |

## 10. Build / Technical Check

Commands run:
- `npm run type-check`
- `npm run build`
- `curl -I` for landing/legal/support routes.
- Playwright DOM checks for mobile and desktop production layouts.
- Risky-term `rg` searches.

Results:
- `npm run type-check`: PASS.
- `npm run build`: PASS.
- Production route checks: PASS for all required routes.
- Mobile/desktop horizontal scroll check: PASS (`scrollWidth` equals viewport width on 390px mobile and 1600px desktop).

Errors/warnings:
- `npm run build` warning: Next.js reports a custom Babel configuration that can be removed. Non-blocking for Stripe readiness.
- No TypeScript errors.
- No production 404s found for required policy/support routes.

## 11. Final Decision

Can this be submitted to Stripe review now?

Answer:
- NO

Reason:
- The public website surface is close and mostly Stripe-review friendly, but the paid subscription implementation is not ready. A Stripe reviewer or internal pre-submit review would find no implemented checkout, no webhook-backed subscription activation, no success/cancel flow, no customer portal, and no online self-service cancellation. The code itself states checkout is still being prepared.

Required before submission:
1. Implement Stripe Checkout or equivalent payment flow with product names, USD prices, billing periods, intro access terms, recurring billing disclosure, and legal links.
2. Implement webhook-backed subscription activation and cancellation/renewal state updates using trusted server-side credentials.
3. Implement online self-service cancellation, preferably Stripe Customer Portal, and expose it from account/settings/support flows.
4. Keep paid-intro wording standardized as "$1 3-day introductory access" across paywall/funnel/in-app copy.
5. Finalize Terms governing law/dispute language with qualified legal counsel.

Recommended before submission:
1. Optimize hero/testimonial assets with explicit dimensions and compressed formats.
2. Add consistent visible focus states for keyboard navigation.
3. Re-run a full production payment test with Stripe test mode, including intro conversion, renewal, failed payment, cancellation, refund request, and access revocation.

Legal counsel review needed:
1. Governing law and dispute resolution language.
2. US auto-renewal/online cancellation requirements for targeted states.
3. Refund/cancellation wording for digital subscription and $1 introductory access conversion.
