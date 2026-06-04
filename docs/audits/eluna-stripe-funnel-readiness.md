# eLuna Stripe Funnel Readiness Audit

Date: 2026-06-05 local workspace date  
Audited by: Codex  
Public storefront URL: https://welcome-head.myeluna.com  
Architecture assumption: `welcome-head` is the public marketing and Stripe-facing storefront; the main eLuna product handles registration, onboarding, paywall, Stripe checkout, subscription state, and account billing.

## 1. Final Decision

Overall Stripe submission status:
- NOT READY / BLOCKERS

Layer status:
- `welcome-head` landing/storefront: READY WITH WARNINGS.
- Main product payment funnel: NOT READY / BLOCKERS.

Conclusion:
- Stripe Checkout does not need to live on `welcome-head`.
- `welcome-head` should route users into the product account flow and avoid pretending that payment happens on the landing.
- The current landing CTA architecture matches that model: Create account and pricing actions route to registration; Sign in routes to login; pricing is visible before account creation.
- The blocker is the authenticated product/payment layer: no implemented Stripe Checkout API route, webhook-backed activation, success/cancel flow, or customer portal/self-service cancellation route was found.

## 2. Correct Funnel Architecture

Expected flow:
1. Public user lands on `https://welcome-head.myeluna.com`.
2. User reads product, pricing, FAQ, support, and legal/policy links.
3. User clicks Create account or a pricing plan CTA.
4. User enters the main product via registration/login/onboarding.
5. Inside the authenticated product, paywall/subscription UI starts Stripe Checkout.
6. Stripe webhook activates, renews, cancels, or revokes subscription access server-side.
7. Account/settings/support expose subscription management and online cancellation, preferably Stripe Customer Portal.

Important boundary:
- `welcome-head` is not required to implement checkout.
- `welcome-head` must not show fake checkout buttons or imply that the landing itself processes payment.
- The product must still implement real checkout and cancellation before paid Stripe submission.

## 3. Welcome Head CTA Audit

Status:
- PASS for storefront routing.

Findings:
- Header Sign in routes to `https://www.myeluna.com/login`.
- Hero Create account routes to `https://www.myeluna.com/register`.
- Hero Sign in routes to `https://www.myeluna.com/login`.
- Pricing plan buttons route to `https://www.myeluna.com/register`.
- Final CTA Create account routes to `https://www.myeluna.com/register`.
- Contact/support/footer links route to policy/support/contact destinations, not checkout.

Landing copy adjustment:
- Pricing section now says: "Create an account first. Paid access is activated inside your account after subscription checkout is completed."
- This keeps the landing clear that payment activation happens inside the product account flow.

Navigation anchors:
- Product: `#product`
- How it works: `#how-it-works`
- Pricing: `#pricing`
- FAQ: `#faq`
- Contact: `#contact`

## 4. Landing Readiness

Status:
- READY WITH WARNINGS.

Passes:
- Product description, pricing, FAQ, support/contact, company/policy links, and safe astrology/self-reflection positioning are present.
- Pricing is visible before account creation.
- CTAs do not route to fake checkout.
- Landing pricing copy does not claim payment is processed on the landing.

Warnings:
- The landing depends on the main product registration/login destination being live and aligned with the same pricing/legal disclosures.
- The public site alone cannot make the whole Stripe submission ready if the authenticated checkout and cancellation flows are missing.

## 5. Main Product Payment Readiness

Status:
- NOT READY / BLOCKERS.

Evidence found:
- No `src/app/api/stripe/checkout/route.ts` route was found.
- No `src/app/api/stripe/webhook/route.ts` route was found.
- No success/cancel payment return route was found.
- No Stripe Customer Portal or equivalent self-service cancellation route was found.
- `src/components/subscription/SubscriptionModal.tsx` still shows checkout-unavailable behavior: "Secure checkout is being prepared" and "Payment checkout needs to be connected before this plan can be purchased."
- `SUPABASE_SETUP.md` states subscription activation must happen later through backend/webhook/payment provider logic.
- Supabase schema/migrations contain pre-Stripe subscription columns and RLS, but not a working Stripe integration.

Blockers before paid Stripe submission:
1. Implement server-side Stripe Checkout Session creation.
2. Map eLuna plan IDs to Stripe Price IDs and verify USD amounts/periods.
3. Add webhook handling for checkout completion, subscription updates/deletions, invoice failures, and relevant renewal events.
4. Add success and cancel return routes.
5. Add Stripe Customer Portal or an equivalent online cancellation flow.
6. Persist entitlement/subscription activation using trusted server/service-role logic only.

## 6. Cancellation Readiness

Status:
- NOT READY for paid US subscription launch.

Current state:
- Public legal/cancellation/support pages explain email-based cancellation.
- No in-account self-service cancellation or Stripe Customer Portal was found.

Required:
- Add online cancellation from account/settings/support before enabling paid online subscription checkout for US users.

## 7. Paid Intro Wording

Status:
- UPDATED in source copy checked during this pass.

Changes made:
- Replaced ambiguous paid-intro paywall copy with "3-day introductory access for $1" or "3-day access for $1".
- Updated Sky Map gate copy, node preview CTA, preland funnel paywall descriptions, practice paywall description, Sky Map paywall description, and support-related account copy.

Verification target:
- No source/doc matches should remain for the old ambiguous paid-intro phrases or legacy unrelated brand/contact strings requested in the task.

Technical note:
- Internal identifiers/statuses such as `trial_3_day_1_usd` or subscription status values may remain if they are not user-facing copy.

## 8. Wrong String Search

Command:
- Run the wrong-string `rg` search requested in the task against `src public docs`.

Expected result after this pass:
- No matches.

## 9. Implementation Plan If Checkout Is Missing

1. Add `src/app/api/stripe/checkout/route.ts` with server-side session creation and authenticated plan selection.
2. Add environment variables for Stripe secret key, webhook secret, price IDs, success URL, cancel URL, and portal return URL.
3. Add `src/app/api/stripe/webhook/route.ts` and update Supabase subscription rows only from trusted server-side code.
4. Add account/settings billing entry points for "Manage subscription" and online cancellation through Stripe Customer Portal.
5. Add success/cancel pages that explain subscription state and return users to the product.
6. Run Stripe test-mode coverage for intro purchase, conversion, renewal, failed payment, cancellation, refund request, and access revocation.

## 10. Verification

Commands to run:
- `npm run type-check`
- `npm run build`
- The requested wrong-string `rg` search against `src public docs`.

Results:
- `npm run type-check`: PASS.
- `npm run build`: PASS.
- Wrong-string search against `src public docs`: PASS, no matches.
- Build warning: Next.js reports an existing custom Babel configuration that can be removed. This did not block the build.
