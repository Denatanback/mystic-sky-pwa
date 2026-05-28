# eLuna Product Alpha QA Report

Date: May 27, 2026

Scope: main eLuna product only. Prelands, payment logic, Supabase schema, and auth flow were not changed.

## 1. Technical Status

| Check | Status | Notes |
|------|--------|-------|
| `npm run type-check` | Passed | `tsc --noEmit --skipLibCheck` completed successfully. |
| `npm run build` | Passed | Next.js production build completed successfully. Build warning only: custom Babel config can likely be removed later. |
| `grep -RIn "7-day\\|7 day\\|7 days" src` | No matches | No old 7-day trial copy found. |
| `grep -RIn "24 May 2024" src` | No matches | No stale hardcoded date found. |
| `grep -RIn "href=\\"#\\"" src` | No matches | No empty anchor CTAs found. |
| `grep -RIn "mascot\\|fox\\|eluna-fox" src` | No matches | No mascot/fox traces found. |
| `grep -RIn "Please add your birth date in profile\\|Add your birth date in profile" src` | No matches | Old birth-date prompt copy not found. |

Runtime smoke was performed with Playwright at mobile viewport `390x844` against local dev server.

## 2. New User Flow QA

Scenario: no preland context, fresh localStorage.

Result: Passed with notes.

- `/register` shows account creation only: name, email, password, create account.
- Registration routes to `/onboarding`.
- Onboarding accepts birth date and reveals zodiac.
- `I don’t know my birth time` works.
- Manual zodiac selector opens and can save selected sign.
- Birth place manual input works.
- Focus areas and practice styles save.
- User reaches `/home`.
- No preland continuation block appears for a no-context user.
- Profile uses selected zodiac and birth place.
- Sky and Today use the shared profile/zodiac resolver.

Note: full browser persistence was smoke-tested through localStorage/mock auth, not through live Supabase.

## 3. Preland Continuation QA

### Pastlife

URL tested:

`/register?source=pastlife&funnel=pastlife&result=guardian&utm_campaign=test`

Result: Passed.

- Query params are saved to `eluna:prelandContext`.
- Context remains after registration and onboarding.
- `/home` shows `Your Past Life reading is ready`.
- Result label appears: `Past-life archetype: The Guardian`.
- `/today?context=pastlife` shows the contextual guardian pattern copy.
- After guided practice, `/path?context=pastlife` shows `Your Past Life signal`.
- Practice `signalName` and `responseAction` appear in Path.
- Premium Sky node paywall context shows `Unlock your Past Life reading`.
- Refresh preserves context.

### Soulmate

URL tested:

`/register?source=soulmate&funnel=soulmate&result=mirror_bond`

Result: Passed.

- `/home` shows `Your Soulmate signal is ready`.
- Result label appears: `Connection pattern: Mirror Bond`.
- `/today?context=soulmate` shows soulmate contextual copy.
- After guided practice, `/path?context=soulmate` shows `Your Soulmate signal`.
- Path uses connection-oriented copy.

### No Context

Result: Passed.

- No preland block appears.
- Normal home/today/path flow still works.

## 4. Home QA

Result: Mostly passed.

- Home gives a clear daily hub with reading, practice, affirmation, daily card, progress, streak, and next unlocks.
- Daily progress supports 0/4, partial progress, and completed states.
- Practice completed state changes Home copy to `First signal unlocked`.
- Integrated signal state changes Home copy to `First signal integrated`.
- Plan chip opens SubscriptionModal.
- Streak chip is explainable by tap/click.
- Preland block appears when context exists.

Risk: preland users can see `Your Past Life reading is ready` and also `Day 3 · Past-life signal · Locked` in Next Unlocks. This is not broken, but the distinction between preland teaser and deeper Day 3 signal is not explained.

## 5. Today QA

Result: Passed with content-depth note.

- Today has moon/forecast, daily practice, daily card, numerology, and Sky progress.
- Manual zodiac override is routed through shared profile resolver.
- Practice is a guided 3-step flow, not one-click.
- Practice saves `signalName` and `responseAction`.
- After practice, Path opens First Signal.
- Daily Card can be drawn once per day.
- Daily Card persists after refresh.
- Card reflection saves and persists.
- Preland contextual block appears for pastlife/soulmate users.

Note: the reading is functional and clearer than before, but it still has room for stronger hierarchy and a more explicit daily takeaway before paid traffic.

## 6. Practices QA

Result: Passed.

- Tabs exist: Today, My, Library.
- Today tab shows active affirmation or prompts user to choose one.
- Reflection practice uses guided practice flow.
- Grounding ritual can be completed and saved.
- Library includes all 8 categories:
  - Self-worth & boundaries
  - Love & relationships
  - Money & abundance
  - Body & health
  - Protection & grounding
  - Past-life healing
  - Intuition
  - Soulmate connection
- Category detail includes description, when to use, emotional benefit, morning/evening instructions, reflection question, and 7 affirmations.
- My tab shows active affirmations.
- Repeat today marks affirmation completed.
- Home sees active affirmation.
- Free gating works conceptually: basic categories are available, preview/locked categories open SubscriptionModal.

## 7. Path QA

Result: Functionally passed, with one runtime warning.

- Without practice, `/path` shows locked state and CTA to `/today#practice`.
- After practice, First Signal opens.
- Signal name and response action display.
- Blocks are present:
  - Meaning
  - Where it appeared today / Where it may appear today
  - Next step
  - Tomorrow’s signal
- Reflection saves.
- `Complete next step` marks signal integrated.
- Home and Profile reflect integrated state.
- Preland context changes Path title/copy for Past Life and Soulmate.

Issue: React hydration mismatch appears on `/path` after localStorage says first signal is unlocked. The UI recovers, but the server first renders locked state and the client hydrates unlocked state.

## 8. Sky Map QA

Result: Passed with mobile interaction issue.

- `/sky` includes `How your Sky Map works`.
- Legend/status explanations are present.
- Node cards show title, category, status, meaning, and requirement.
- NodePreviewSheet opens from list cards.
- Locked/progress nodes explain requirement.
- Premium nodes open SubscriptionModal/contextual paywall.
- `/sky/astrology/1` uses shared profile/zodiac logic and includes context/explanation.
- `/sky/numerology/1` calculates Life Path and includes explanation/return CTA.

Issue: at `390x844`, orbital node buttons can overlap/intercept clicks. In Playwright, tapping the Past Life orbital node was intercepted by another node or bottom nav. The list-based node cards below worked as a fallback.

## 9. Paywall QA

Result: Alpha-ready, not paid-traffic-ready.

- Plan chip opens SubscriptionModal.
- All 5 plans are present:
  - Free
  - 3-day trial for $1
  - Monthly $29.99
  - 3 months $59.99
  - 6 months $89.99
- 3-month and 6-month savings are visible.
- Sections are present:
  - What you unlock today
  - Free preview includes
  - Trial unlocks
  - Premium previews
- Trial billing copy includes:
  - `Then $29.99/month unless canceled.`
  - `Cancel anytime before day 3.`
- Locked premium features can open contextual paywall.
- Checkout unavailable state is honest.
- No fake payment success was found.
- Support email is present: `support@myeluna.com`.

Limitations:

- No real checkout provider is connected.
- Legal links currently show an in-modal placeholder, not real legal pages.

## 10. Profile QA

Result: Mostly passed.

- Profile shows name, email, zodiac glyph, zodiac line, and birth place.
- Manual zodiac override is labeled `selected manually`.
- Edit birth data links to onboarding edit mode.
- Deep Path state is connected to progress.
- Support email is clickable.
- Plan information is accessible through Plan chip.

Limitations:

- Personal Chart still opens a coming-soon info sheet instead of showing a basic chart summary.
- Profile stats remain static zeroes and do not yet reflect cards/reflections/practice history.

## 11. Mobile QA

Viewport tested: `390x844`.

Result: Mostly passed with issues.

- `/register`, `/onboarding`, `/home`, `/today`, `/practices`, `/path`, `/sky`, `/profile`, and SubscriptionModal render on mobile.
- Modals/bottom sheets scroll.
- SubscriptionModal is readable and scrollable.
- Bottom nav generally does not block primary content.

Mobile issues:

- Sky orbital node hit targets overlap on 390px.
- Home topbar is dense with guide, streak, plan, and profile controls.
- Long bottom sheets are usable but heavy; paid-traffic QA should include a real device pass.

## 12. Alpha Readiness Scoring

| Area | Score |
------|-------|
| Registration readiness | 88 |
| Onboarding readiness | 84 |
| Home readiness | 82 |
| Today readiness | 82 |
| Practices readiness | 85 |
| Path readiness | 78 |
| Sky readiness | 76 |
| Paywall readiness | 78 |
| Profile readiness | 74 |
| Mobile readiness | 76 |
| Alpha readiness overall | 81 |
| Paid traffic readiness overall | 58 |

## 13. Bugs and Issues

| Priority | Area | Issue | Steps to reproduce | Expected | Actual | Recommendation |
|---------|------|-------|--------------------|----------|--------|----------------|
| P1 | Path | Hydration mismatch after practice/unlocked signal | Complete daily practice, open `/path` in dev console | Server/client render should match | React reports locked server state vs unlocked client state | Initialize Path from neutral loading state, then read localStorage in `useEffect`. |
| P1 | Sky Map mobile | Orbital node buttons overlap/intercept clicks on 390px | Open `/sky` at `390x844`, tap Past Life orbital node | Tapped node opens its preview | Click can be intercepted by another node or bottom nav | Adjust orbital positions/hit areas or disable pointer events for overlapping decorative layers; ensure each node has stable tap target. |
| P1 | Paywall | No real checkout provider | Click any paid plan | Secure checkout starts | Honest checkout-unavailable message appears | Required before paid traffic. Keep unavailable for alpha if payment is intentionally disabled. |
| P1 | Profile | Personal Chart is still coming soon | Open `/profile`, tap Personal Chart | Basic chart summary from saved data | Coming-soon sheet | Add basic free chart summary before paid traffic; acceptable for small alpha if disclosed. |
| P1 | Home / Preland | Past Life preland teaser can conflict with Day 3 locked copy | Use pastlife context and view `/home` Next Unlocks | User understands teaser vs deeper unlock | `Past Life reading is ready` and `Day 3 Past-life signal Locked` can feel contradictory | Rename Day 3 copy to `Deeper past-life signal` or explain it is the premium/deeper layer. |
| P2 | Profile | Stats are static zeroes | Draw card, save reflection, return to `/profile` | Stats reflect cards/reflections | Stats still show `0` | Wire stats to local progress/history. |
| P2 | Mobile | Home topbar feels crowded | View `/home` at 390px | Controls remain easy to scan/tap | Guide, streak, plan, profile are dense | Consider grouping secondary controls into menu after alpha. |
| P2 | Legal | Legal links are placeholders | Open SubscriptionModal, tap legal links | Real legal/support pages | Placeholder info appears | Add real Terms, Billing Terms, Money-Back Policy before paid traffic. |
| P2 | Content depth | Today reading still has mixed hierarchy | Open `/today` | Clear theme/action/reflection hierarchy | Moon, forecast, practice, card, numerology compete visually | Add stronger section hierarchy and daily takeaway in next content sprint. |

No P0 build/runtime blockers were found during this QA pass.

## 14. Scenario Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| Normal register → onboarding → home | Passed | Smoke-tested with fresh localStorage/mock auth. |
| Manual zodiac override | Passed | Visible in onboarding/profile and routed through resolver. |
| Pastlife preland continuation | Passed | Home/today/path/paywall context work. |
| Soulmate preland continuation | Passed | Home/today/path context work. |
| Daily practice → First Signal | Passed | Saves signal and response. |
| First Signal integration | Passed | Updates Path/Home/Profile state. |
| Daily Card draw once per day | Passed | Card persists after refresh. |
| Card reflection | Passed | Saves to localStorage. |
| Practices library/gating | Passed | 8 categories, free/locked behavior present. |
| Sky node preview | Passed via node list | Orbital map tap issue on mobile. |
| SubscriptionModal | Passed for alpha | Checkout intentionally unavailable. |

## 15. Final Recommendation

1. Alpha on 10–30 users: Yes. The product is now alpha-testable if users are told payment is not active yet and this is an early experience.

2. Paid traffic: Not yet. Checkout, legal pages, stronger profile/chart proof, and mobile Sky interaction should be fixed before paid acquisition.

3. Must fix before alpha: no P0 blocker found. Strongly recommended before alpha: fix `/path` hydration mismatch and Sky orbital node tap reliability, because both can affect tester confidence.

4. Must fix before paid traffic:
   - Connect real checkout or keep all paid CTAs clearly unavailable.
   - Add real Terms/Billing/Money-Back pages.
   - Add basic Personal Chart summary.
   - Fix Sky mobile orbital node hit targets.
   - Clarify preland teaser vs deeper locked Past Life/Soulmate unlocks.

5. Next 5 priority tasks:
   - Fix `/path` hydration mismatch with a client-loaded state.
   - Fix Sky Map orbital node tap targets at 390px.
   - Add basic Personal Chart summary in Profile.
   - Add real legal/billing pages and checkout integration plan.
   - Improve Today reading hierarchy with a clearer theme, action, and reflection takeaway.

## 16. Known QA Limitations

- Smoke testing used local dev server and mock/localStorage auth, not a live Supabase account.
- No real payment checkout was tested because checkout is intentionally unavailable.
- Mobile QA used Playwright viewport `390x844`; a real-device pass is still recommended before paid traffic.
- No product code was changed during this QA pass.
