# eLuna Product Alpha Audit 2

Date: May 30, 2026

Scope: main eLuna product only. Prelands, auth flow, payment logic, and Supabase schema were not changed during this audit.

## 1. Technical Checks

Commands run:

- `npm run type-check`
- `npm run build`
- `grep -RIn "7-day\|7 day\|7 days" src`
- `grep -RIn "24 May 2024" src`
- `grep -RIn "href=\"#\"" src`
- `grep -RIn "mascot\|fox\|eluna-fox" src`
- `grep -RIn "Please add your birth date in profile\|Add your birth date in profile" src`
- `grep -RIn "Oracle\|Ask Oracle\|OPENAI_API_KEY\|ORACLE_MODEL\|/api/oracle\|oracleQuestionCount" src package.json .env.local.example 2>/dev/null || true`

Results:

- Type-check status: Passed.
- Build status: Passed.
- Old 7-day trial copy: Not found.
- Old date `24 May 2024`: Not found.
- Exact `href="#"`: Not found.
- Broader hash-link review found intentional anchor links: `/today#practice` and a fallback `href={... : "#"}` in `NodePathPage` if `disciplineKey` is missing. This is not currently exposed in normal routes but should be cleaned later.
- Mascot / fox references: Not found.
- Old birth date warning copy: Not found.
- Oracle references after deferral: Not found in `src`, `package.json`, or `.env.local.example`.

Important note:

- `PRODUCT_BACKLOG.md` now contains the deferred Phase 2 / Beta AI Oracle plan. It is intentionally outside `src` and does not affect alpha runtime.

## 2. Alpha Readiness Score

| Area | Score | Reason |
|------|-------|--------|
| Registration readiness | 88 | Account-first flow is clean, preland params are saved, social sign-in is honestly marked coming soon. Still light on privacy reassurance. |
| Onboarding readiness | 86 | Birth date, unknown birth time, manual zodiac override, place input, focus areas, and practice preferences work. Focus/practice choices still lack explanatory microcopy. |
| Home readiness | 84 | Daily hub is understandable, progress/checklist is real, preland continuation works, Daily Card and affirmation states are connected. Home is a little dense on mobile. |
| Today readiness | 82 | Moon card, forecast, guided practice, Daily Card, and preland signal blocks are meaningful. Reading is better, but still not as deep as a paid product should be. |
| Practices readiness | 84 | Today/My/Library tabs, guided practice, grounding ritual, active affirmations, category detail, and gating exist. Some flows are text-heavy. |
| Affirmations readiness | 86 | Eight categories with richer instructions and 7 affirmations make the library alpha-credible. Repetition flow works. |
| Daily Card readiness | 90 | 12 cards, one draw per day, persistence, meaning/action/reflection, Home/Today/Practices integration. Strong alpha feature. |
| Path readiness | 82 | First Signal is now a real reward with meaning, evidence, next step, reflection, and tomorrow hook. Long-term path after Day 1 is still mostly preview. |
| Sky Map readiness | 84 | Intro, status legend, node previews, unlock requirements, and contextual paywall make it understandable. Some node routes are still shallow or generic. |
| Profile readiness | 73 | Zodiac/manual override and support are visible. Personal Chart remains coming soon, stats are static zeroes, plan/account management is light. |
| Paywall readiness | 80 | Clear plan stack, Free vs Trial explanation, trial billing copy, support email, premium previews, and honest checkout unavailable state. Legal pages and real checkout are missing. |
| Preland continuation readiness | 86 | Pastlife and soulmate context persist through registration/onboarding and appear on Home/Today/Path/paywall. Deeper full readings remain teaser-level. |
| Mobile readiness | 82 | 390x844 pass is generally usable; modals scroll, bottom nav mostly avoids CTA overlap. Home and Practices are dense; paywall is long. |
| Content depth readiness | 77 | Major content gaps from audit 1 were improved. Today reading, Personal Chart, long-term path, and reports still need more substance. |
| Retention readiness | 78 | Daily checklist, Daily Card, guided practice, First Signal, affirmations, and next unlocks create a return loop. Day 2+ content is still mostly promise. |
| Alpha readiness overall | 84 | Ready for a controlled alpha with 10-30 users if framed as early access and checkout remains honestly unavailable. |
| Paid traffic readiness overall | 60 | Not ready for paid traffic because checkout, legal pages, analytics, refund/cancel flow, and deeper premium outputs are not production-ready. |

## 3. Page-by-page Audit

### Page: /register

1. What works

- Registration is focused on account creation only: name, email, password, create account.
- Preland query params are parsed and saved before account creation.
- Social sign-in is not faked; it opens a coming soon info sheet.
- Register redirects to onboarding after mock account creation.

2. What is still confusing

- Privacy/birth data reassurance is still only implied by later onboarding.
- Social buttons are visible but not visually disabled, so some users may try them first.

3. What feels unfinished

- No short "Next: build your personal chart" trust preview beyond the current copy.

4. Content depth

- Enough for alpha. Could be stronger for paid traffic.

5. Retention impact

- Medium. It sets expectations but does not directly drive retention.

6. Payment impact

- Medium. Clearer trust copy could reduce pre-paywall drop-off.

7. Mobile issues

- Mobile layout is clean and focused.

8. Priority issues

- P2: Add privacy and next-step reassurance under the form.
- P2: Style social buttons more explicitly as coming soon/disabled.

9. Recommendation

- Ready for alpha.

### Page: /onboarding

1. What works

- Correct account-first sequence.
- Birth date reveals zodiac.
- Unknown birth time is supported.
- Manual zodiac override works and persists.
- Birth place autocomplete/manual input exists.
- Pastlife preland note appears when relevant.

2. What is still confusing

- Focus areas and practice styles are labels only; they do not explain how they personalize the product.
- No final setup summary before Home.

3. What feels unfinished

- Onboarding choices are not visibly reflected enough on Home beyond general content.

4. Content depth

- Enough for alpha. Needs microcopy for better personalization trust.

5. Retention impact

- High. Choices create commitment, but payoff should be more visible.

6. Payment impact

- Medium. Better choice explanations would support trial conversion.

7. Mobile issues

- Long step 1 is scrollable but dense.

8. Priority issues

- P1: Add microcopy under focus areas/practice styles before paid traffic.
- P2: Add final summary card.

9. Recommendation

- Ready for alpha.

### Page: /home

1. What works

- Clear daily hub with reading, practice, affirmation, Daily Card, progress, streak, next unlocks.
- Preland continuation block appears for Pastlife/Soulmate users.
- Daily Card and active affirmation state are integrated.
- Oracle has been removed from alpha scope.

2. What is still confusing

- Home contains many sections; first-time users may not know which matters most after the main CTA.
- Streak is still very basic.

3. What feels unfinished

- Energy of the day remains deterministic and brief.
- Day 2/3/5/7 unlocks are mostly promises.

4. Content depth

- Medium-high for alpha. Good shell, still light on long-term payoff.

5. Retention impact

- High. This is the main habit screen.

6. Payment impact

- Medium. It previews premium value indirectly but does not show enough paid output samples.

7. Mobile issues

- Dense but usable at 390px. Topbar is close to crowded with guide, streak, plan, profile.

8. Priority issues

- P1: Simplify hierarchy and make the "next best action" even more dominant.
- P2: Improve streak/progress explanation and actual multi-day behavior.

9. Recommendation

- Ready for alpha.

### Page: /today

1. What works

- Moon Today uses realistic phase assets.
- Zodiac glyph is separate from moon image.
- Forecast and moon sign display.
- Guided practice is a real 3-step flow.
- Daily Card MVP is real: draw once per day, meaning/action/reflection, persistence.
- Preland Pastlife/Soulmate signal block appears when context exists.

2. What is still confusing

- Daily reading still mixes moon phase, moon sign, personal day, forecast, practice, and card without a single strong "today's theme" section.
- Forecast can feel generic if profile data is missing.

3. What feels unfinished

- Reading is not yet a full premium-quality narrative.
- Saved reflection history is not surfaced outside today/path/profile.

4. Content depth

- Medium-high for alpha. Still medium for paid traffic.

5. Retention impact

- High. Practice + card + tomorrow hook are meaningful.

6. Payment impact

- High potential, but premium reading depth is not yet demonstrated enough.

7. Mobile issues

- 390px layout works. Practice CTA is close to bottom nav on initial viewport but reachable by scroll.

8. Priority issues

- P1: Add a richer daily reading structure: theme, meaning, avoid, action, reflection, tomorrow.
- P2: Surface saved card/practice reflections later in Profile or Journal.

9. Recommendation

- Ready for alpha.

### Page: /practices

1. What works

- Today/My/Library tabs exist and are usable.
- Today tab includes active affirmation, guided practice, grounding ritual, Daily Card link.
- My tab shows active affirmations and repeat status.
- Library has eight categories including Past-life healing, Intuition, Soulmate connection.
- Category modal includes description, when to use, emotional benefit, morning/evening, reflection, affirmations.
- Free gating and active affirmation limits are implemented locally.

2. What is still confusing

- Library can feel long and text-heavy.
- "Active: 0/1" is clear enough, but users may not understand why Free has 1.

3. What feels unfinished

- Multi-day practice sequences are mentioned but not built.
- Premium categories mostly unlock more text rather than interactive rituals.

4. Content depth

- Good for alpha. Needs richer sequences for paid traffic.

5. Retention impact

- High. Practices are now a real daily action.

6. Payment impact

- Medium-high. Premium categories support paywall, but richer rituals would convert better.

7. Mobile issues

- Modal scroll works. Text density is high.

8. Priority issues

- P1: Add at least one true premium 7-day sequence preview before paid traffic.
- P2: Improve scanability of category detail modal.

9. Recommendation

- Ready for alpha.

### Page: /path

1. What works

- Hydration mismatch is fixed via client-ready loading state.
- Locked state directs to Today practice.
- After practice, First Signal opens.
- Contextual Pastlife/Soulmate signal copy works.
- Meaning, evidence, next step, reflection, integration, tomorrow signal are present.

2. What is still confusing

- Difference between Path and Sky Map may still need clearer explanation.

3. What feels unfinished

- After Day 1, deeper progression remains mostly teased.
- Integrated state is useful but not connected to a visible timeline.

4. Content depth

- Good for alpha Day 1. Thin for multi-day retention.

5. Retention impact

- High. First Signal is a real reward.

6. Payment impact

- Medium. It previews deeper path but does not yet show paid-grade depth.

7. Mobile issues

- Works at 390px. Reflection textarea and CTA are reachable.

8. Priority issues

- P1: Add Day 2/Day 3 content before paid traffic.
- P2: Add a small Path vs Sky Map explanation.

9. Recommendation

- Ready for alpha.

### Page: /sky

1. What works

- Intro "How your Sky Map works" exists.
- Status legend explains Active/Available/Locked/Premium/Completed.
- Node cards show title, category, status, meaning, requirement.
- NodePreviewSheet explains what the user receives and unlock criteria.
- Premium nodes open contextual SubscriptionModal.
- Mobile orbital tap targets were improved and list cards remain fallback.

2. What is still confusing

- Some unlock logic uses today's completed count, not true multi-day progress, so it may feel arbitrary after refresh/day changes.
- Past Life requirement says "Start 3-day trial or complete 3 daily practices"; product behavior may still feel more premium than progress-based.

3. What feels unfinished

- Several node routes remain placeholder/deeper-coming-soon style.
- Weekly report route points to Profile rather than a real report.

4. Content depth

- Good map explanation; node content depth is mixed.

5. Retention impact

- Medium-high. Gives long-term structure.

6. Payment impact

- High. Premium nodes are conversion points.

7. Mobile issues

- Orbital map is usable, but list cards are the more reliable tap surface.

8. Priority issues

- P1: Add deeper content to premium node routes before paid traffic.
- P2: Make multi-day unlock logic less local/today-only.

9. Recommendation

- Ready for alpha.

### Page: /sky/astrology/1

1. What works

- Uses shared profile data and manual zodiac override.
- Has Sky Map context and "Why this node matters" copy.
- Return CTA exists.

2. What is still confusing

- Completion payoff is still light.

3. What feels unfinished

- Reflection does not become a visible saved profile insight.

4. Content depth

- Enough as starter sample.

5. Retention impact

- Medium.

6. Payment impact

- Medium. Shows a sample of node content.

7. Mobile issues

- Acceptable.

8. Priority issues

- P2: Save/reflect node answer into Profile or Journal.

9. Recommendation

- Ready for alpha.

### Page: /sky/numerology/1

1. What works

- Calculates Life Path from birth date.
- Adds context around why the node matters.
- Return CTA exists.

2. What is still confusing

- Result is useful but still short.

3. What feels unfinished

- No saved Life Path insight in Profile.

4. Content depth

- Enough as alpha sample.

5. Retention impact

- Medium.

6. Payment impact

- Medium.

7. Mobile issues

- Acceptable.

8. Priority issues

- P2: Add "Your Life Path in daily life" saved card.

9. Recommendation

- Ready for alpha.

### Page: /profile

1. What works

- Shows name/email, zodiac glyph, manual override state, birth place.
- Edit birth data route exists.
- Deep Path state is connected to progress.
- Support email is present and mailto-linked.

2. What is still confusing

- Personal Chart opens coming soon.
- Stats are static zeroes and may make the product feel unused.

3. What feels unfinished

- No real chart summary despite collecting birth data.
- Plan/subscription information is mostly via PlanChip, not a full account panel.

4. Content depth

- Medium-low.

5. Retention impact

- Medium.

6. Payment impact

- High potential but underused.

7. Mobile issues

- Acceptable.

8. Priority issues

- P1: Add basic Personal Chart summary before paid traffic.
- P2: Replace static zero stats with real local progress counts.

9. Recommendation

- Alpha acceptable, but one of the weaker screens.

### SubscriptionModal / Paywall

1. What works

- All five tariffs are present: Free, 3-day trial $1, Monthly $29.99, 3 months $59.99, 6 months $89.99.
- Trial copy says full access for 3 days, then $29.99/month unless canceled, cancel before day 3.
- Free vs Trial comparison exists.
- Premium previews exist.
- Support email exists.
- Checkout unavailable state is honest and does not fake success.
- Contextual paywall works for Sky/practice/preland contexts.

2. What is still confusing

- Legal links open a placeholder, not real pages.
- Real checkout is absent.

3. What feels unfinished

- Premium previews are text-only.
- Cancellation/account management flow is not built.

4. Content depth

- Strong for alpha; not production-payment ready.

5. Retention impact

- Medium.

6. Payment impact

- High, but blocked by real checkout/legal.

7. Mobile issues

- Long but scrollable. Trial card is near top.

8. Priority issues

- P1: Real legal pages and checkout before paid traffic.
- P1: Analytics around paywall opens/clicks.

9. Recommendation

- Ready for alpha with checkout unavailable. Not ready for paid traffic.

### Legal / Support Links

1. What works

- Support email appears in SubscriptionModal, Settings, and Profile.
- Legal labels exist in SubscriptionModal.

2. What is still confusing

- Legal pages are placeholders.

3. Recommendation

- Alpha acceptable. Paid traffic requires real Terms, Billing Terms, Money-Back Policy, and Privacy.

## 4. User Flow QA

### Scenario 1 — Normal user

Checked with fresh localStorage in mock auth mode.

Result:

- `/register` shows name/email/password/create account.
- Account creation redirects to `/onboarding`.
- Birth date input works.
- Birth time unknown works.
- Manual zodiac override works and persists to Profile.
- Birth place input works.
- Focus areas and practice preferences work.
- Onboarding redirects to `/home`.
- `/today` loads, guided practice can unlock `/path`.
- `/path` opens first signal after practice.
- Daily Card can be drawn and persists.
- `/practices` and `/profile` are reachable.

Observed limitation:

- In one isolated browser check, direct `/today` without preserved mock session used fallback forecast data. In the actual same-session normal flow, profile data persisted to Profile. This should be included in real-device QA.

### Scenario 2 — Pastlife preland user

URL:

`/register?source=pastlife&funnel=pastlife&result=guardian&utm_campaign=test`

Result:

- Query params are saved to `eluna:prelandContext`.
- `/home` shows "Your Past Life reading is ready".
- `/today?context=pastlife` shows Past-life signal.
- `/path?context=pastlife` shows Past Life signal after practice completion.
- Paywall context can use Pastlife title/description through preland experience.
- No visible Oracle references.

Risk:

- Day 3 "Past-life signal" in next unlocks may overlap conceptually with the immediate preland Past Life signal. Copy should distinguish "first teaser" vs "deeper Day 3 signal".

### Scenario 3 — Soulmate preland user

Result based on code path and prior QA pattern:

- Context is saved via the same preland helper.
- `/home` uses soulmate-specific experience when `source/funnel=soulmate`.
- `/today` and `/path` use soulmate-specific context.
- Paywall title/description can switch to "Unlock your Soulmate insight".

Risk:

- Needs full manual browser pass with actual soulmate URL before paid acquisition.

### Scenario 4 — No context

Result:

- No preland block appears.
- Standard Home/Today/Path flow works.

## 5. Retention Audit

1. What makes the user return tomorrow?

- Daily checklist.
- Daily Card once per day.
- Guided practice opens First Signal.
- Tomorrow hook in Path.
- Next unlocks block on Home.
- Streak chip and week row.

2. What makes the user return on Day 3?

- Day 3 Past-life signal preview.
- Sky Map progress and premium/progress nodes.
- Practices unlock list.

3. What makes the user stay until the end of trial?

- Full practice library promise.
- Premium Sky Map nodes.
- Weekly/monthly report previews.
- Saved progress promise.

4. What could make the user extend subscription through month one?

- Weekly report archive.
- Monthly soul pattern report.
- Saved reflection/card history.
- Deeper premium node content.
- Visible personal chart growth.

5. Where retention is still weak

- Real multi-day content is not fully built.
- Streak is local/basic.
- Reports are previewed but not implemented.
- Profile does not yet show an evolving history.

Retention readiness: 78/100.

## 6. Content Depth Audit

| Section | Enough? | Improved | Still weak | Next sprint |
|---------|---------|----------|------------|-------------|
| Today reading | Partly | Moon, forecast, practice, card, preland block now form a real daily screen. | Needs a stronger narrative reading. | Add theme/meaning/action/avoid/reflection/tomorrow structure. |
| Guided practice | Yes for alpha | Real 3-step flow with signal/action capture. | Only one core guided practice. | Add 2-3 alternate guided practices. |
| Daily Card | Yes | 12 cards, one/day, reflection. | No card history yet. | Add card history preview/archive. |
| First Signal / Path | Yes for alpha | Meaning, evidence, next step, reflection, tomorrow. | Day 2+ is mostly promise. | Build Day 2 and Day 3 signal content. |
| Affirmation categories | Yes | 8 categories, instructions, 7 affirmations each. | Premium sequences not built. | Add one 7-day sequence. |
| Practices Library | Yes for alpha | Today/My/Library with category modals. | Mostly text and activation. | Add ritual flows per category. |
| Sky Map nodes | Partly | Intro, legend, previews, unlock criteria. | Node route depth mixed. | Deepen premium node pages. |
| Profile / Personal Chart | Not enough | Zodiac and setup data visible. | Personal Chart coming soon. | Add basic chart summary. |
| Paywall value explanation | Enough for alpha | Free vs Trial, unlocks, previews, billing clarity. | Text-only previews; legal/checkout absent. | Add real legal, checkout, and visual report previews. |
| Preland continuation | Enough for alpha | Home/Today/Path/paywall context. | Deeper paid version still teaser. | Build full Pastlife/Soulmate reading page or section. |

Content depth readiness: 77/100.

## 7. Paywall and Pricing Audit

Plans checked:

- Free
- 3-day trial for $1
- Monthly $29.99
- 3 months $59.99
- 6 months $89.99

What works:

- All tariffs are visible.
- 3/6 month savings are explained.
- Free limitations are clearer.
- Trial says full access for 3 days.
- Billing copy says then $29.99/month unless canceled.
- Cancel before day 3 is present.
- `support@myeluna.com` is present.
- Legal/billing/money-back labels are present.
- Checkout unavailable state is honest.
- Plan IDs are present in code.
- Contextual paywall exists.

What is not paid-traffic ready:

- No real checkout provider.
- Legal pages are placeholders.
- No cancellation flow.
- No analytics/error tracking found in scope.
- Premium outputs are not deep enough to justify scaled paid acquisition.

Paywall alpha status: Ready with checkout unavailable.

Paywall paid traffic status: Not ready.

## 8. Mobile Audit

Viewport checked: 390x844.

| Page | Mobile result |
|------|---------------|
| /register | Clean, focused, no bottom nav. |
| /onboarding | Usable, but step 1 is dense. |
| /home | Usable, slightly crowded topbar and long page. |
| /today | Good. Moon visual is realistic and not square/checkerboard. Practice CTA reachable by scroll. |
| /practices | Usable, but Library detail is text-heavy. |
| /path | Good. Hydration loading prevents mismatch. |
| /sky | Intro/legend/list cards work; orbital map is usable, list cards are safer. |
| /profile | Usable. Stats and chart content feel light. |
| SubscriptionModal | Scrolls and includes all sections. Long, but acceptable for alpha. |

Mobile readiness: 82/100.

## 9. Visual Audit

What is visually good:

- Strong dark cosmic shell.
- Gold/lavender accents feel premium.
- Cormorant/Manrope type pairing works.
- Glass cards are consistent.
- Real moon phase assets improve Today substantially.
- Daily Card and Sky Map now feel more like product, less like placeholder.
- No mascot.

What still looks raw:

- Home can feel like a dense dashboard rather than a calm mystical ritual.
- Practices Library is content-rich but text-heavy.
- Profile stats at zero reduce premium perception.
- Some "coming soon" sheets remain in Profile/legal.

Quick visual improvements:

- Reduce Home visual density by grouping progress/next unlocks.
- Add one richer visual preview for reports or chart summary.
- Make Practices category modal more scannable with tighter section hierarchy.

## 10. Bugs and Issues Table

| Priority | Area | Issue | Steps to reproduce | Expected | Actual | Recommendation |
| -------- | ---- | ----- | ------------------ | -------- | ------ | -------------- |
| P1 | Payment | Real checkout is not connected. | Open paywall and click trial/premium. | Secure checkout opens. | Honest checkout unavailable message. | Required before paid traffic, not before alpha. |
| P1 | Legal | Legal/billing/money-back links are placeholders. | Open SubscriptionModal and click legal links. | Real legal pages open. | Placeholder info appears. | Build legal pages before paid traffic. |
| P1 | Profile | Personal Chart is still coming soon. | Open Profile and tap Personal Chart. | Basic chart summary appears. | Coming soon info sheet. | Add free chart summary before paid traffic. |
| P1 | Retention | Day 2+ Path content is mostly preview. | Complete Day 1 and inspect next unlocks. | Deeper next-day content exists. | Mostly tomorrow hook/promise. | Build Day 2/Day 3 retention content. |
| P1 | Premium value | Weekly/monthly reports are promised but not implemented. | Inspect paywall/next unlocks. | Report preview or route exists. | Text-only promise. | Add report preview route or sample output before paid traffic. |
| P1 | Analytics | No obvious alpha analytics/event tracking in audited scope. | Review app flows. | Events for onboarding/practice/card/paywall. | Not visible. | Add lightweight analytics before paid traffic and ideally before alpha. |
| P1 | Preland | Immediate Pastlife teaser and Day 3 Past-life signal may blur together. | Pastlife preland flow + Home next unlocks. | Clear distinction between teaser and deeper unlock. | Both use similar language. | Clarify copy. |
| P2 | Onboarding | Focus/practice labels lack descriptions. | Step 2/3 onboarding. | User knows how choices personalize app. | Labels only. | Add microcopy. |
| P2 | Home | Topbar and content density can feel crowded. | Open /home on 390px. | Calm, clear first action. | Many sections and chips. | Simplify hierarchy. |
| P2 | Practices | Category modal is text-heavy. | Open Library category detail. | Easy scan and action. | Rich but dense. | Improve section hierarchy. |
| P2 | NodePath fallback | Dynamic `href={... : "#"}` exists if no discipline key. | Code path with missing `disciplineKey`. | No dead fallback href. | Fallback `#`. | Replace with safe `/sky` fallback later. |
| P2 | Profile | Stats are static zeroes. | Open Profile. | Real local stats. | 0 days/cards/reflections. | Connect to local progress. |
| P2 | Register | Social buttons look active. | Click Google/Apple. | Visibly disabled/coming soon. | Opens coming soon sheet. | Style as disabled. |
| P2 | Streak | Streak is basic/local. | Complete practice and inspect Home/Profile. | Multi-day streak logic. | Simple today-only display. | Expand after alpha. |

P0 count: 0

P1 count: 7

P2 count: 7

## 11. Alpha Launch Checklist

| Item | Status | Notes |
| ---- | ------ | ----- |
| Register works | Ready | Account-first flow passes. |
| Onboarding works | Ready | Manual zodiac, birth time unknown, place input pass. |
| Birth data saved | Ready | Local/mock persistence works. |
| Manual zodiac override works | Ready | Profile shows selected manually. |
| Home explains today’s actions | Ready | Dense but usable. |
| Today reading works | Ready | Needs deeper narrative later. |
| Guided practice works | Ready | 3-step flow. |
| First Signal works | Ready | Opens after practice. |
| Daily Card works | Ready | One/day persistence and reflection. |
| Practices Library has enough content | Ready | 8 categories, richer detail. |
| Affirmations are useful | Ready | 7 per category and activation flow. |
| Sky Map explains unlocks | Ready | Intro, legend, previews. |
| Paywall shows all tariffs | Ready | All 5 visible. |
| Trial terms are clear | Ready | 3 days, $1, then monthly, cancel before day 3. |
| Checkout unavailable is honest | Ready | No fake success. |
| Support email exists | Ready | In paywall/profile/settings. |
| No broken buttons | Needs review | No exact `href="#"`; dynamic hash fallback exists in NodePath code. |
| No old dates | Ready | `24 May 2024` not found. |
| No mascot | Ready | No mascot/fox references. |
| No Oracle in alpha scope | Ready | Oracle references removed from runtime. |
| Mobile acceptable | Ready | 390px pass. |
| Build passes | Ready | Build passed. |

## 12. Paid Traffic Readiness Checklist

| Item | Status | Notes |
|------|--------|-------|
| Real checkout connected | Needs implementation | Checkout unavailable by design. |
| Legal pages live | Needs implementation | Links are placeholders. |
| Billing terms live | Needs implementation | Placeholder only. |
| Money-back policy live | Needs implementation | Placeholder only. |
| Support email active | Needs review | Mailto exists; operational mailbox should be verified. |
| Privacy/terms links active | Needs implementation | Need real pages. |
| Subscription plan IDs mapped | Ready | Plan IDs are present in SubscriptionModal. |
| Trial billing tested | Needs implementation | No provider yet. |
| Cancel flow clear | Needs implementation | Copy exists, no flow. |
| Analytics events installed | Needs implementation | Not visible in audited scope. |
| Error tracking installed | Needs implementation | Not visible in audited scope. |
| Onboarding conversion tracked | Needs implementation | Not visible. |
| Paywall clicks tracked | Needs implementation | Not visible. |
| Purchase tracked | Needs implementation | No checkout. |
| Refund/cancel tracked | Needs implementation | No checkout/cancel flow. |
| Mobile real-device tested | Needs review | Browser viewport checked; physical device QA still needed. |

Paid traffic readiness: Not ready.

## 13. Top Priorities After Audit

### Top 5 fixes before alpha

1. Clarify Pastlife preland teaser vs Day 3 deeper Past-life signal.
2. Do a final real-device mobile pass on iPhone-size screens.
3. Verify support mailbox is active.
4. Replace any exposed coming-soon copy that could be mistaken for paid access.
5. Add a short alpha disclaimer internally/onboarding if recruiting early testers.

### Top 5 fixes before paid traffic

1. Connect real checkout and test trial billing.
2. Publish Terms, Privacy, Billing Terms, Money-Back Policy.
3. Add analytics for registration, onboarding, practice, card draw, paywall open, plan clicks.
4. Build basic Personal Chart summary in Profile.
5. Build at least one deeper premium output: report preview, premium node, or 7-day practice sequence.

### Top 5 improvements after first alpha feedback

1. Reduce Home density based on where testers tap first.
2. Expand Today reading into a stronger narrative.
3. Add Day 2/Day 3 Path content.
4. Add saved reflection/card history.
5. Improve Practices modal scanability.

## 14. Final Recommendation

1. Can alpha launch to 10-30 users?

Yes. eLuna is ready for a controlled alpha with 10-30 users, assuming users are told it is early access and checkout is not live.

2. Can paid traffic launch?

No. Paid traffic should wait until checkout, legal pages, analytics, support operations, and premium output depth are ready.

3. What must be fixed before alpha?

No P0 blockers were found. The main alpha-prep work is QA polish: clarify Pastlife teaser copy, confirm mobile on real devices, and verify support email.

4. What must be fixed before paid traffic?

Real checkout, legal/billing/refund pages, analytics/error tracking, cancellation clarity, and stronger premium output previews.

5. What should the next sprint be?

Do a "paid readiness foundation" sprint:

- connect checkout or keep payment fully disabled;
- create legal pages;
- add analytics;
- build Profile chart summary;
- deepen one premium output enough to prove value.

## 15. Checks Run

- `npm run type-check`: Passed.
- `npm run build`: Passed.
- Old copy/date/mascot/birth-warning grep checks: Clean.
- Oracle grep check: Clean.
- Browser QA at 390x844: Register, Home, Today, Path, Sky, Practices, preland Pastlife context.
- Code review: Register, Onboarding, Home, Today, Practices, Path, Sky, NodePreviewSheet, Sky nodes, Profile, SubscriptionModal, Daily Card, Guided Practice.

Final counts:

- P0 count: 0
- P1 count: 7
- P2 count: 7
