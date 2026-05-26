# eLuna Product Full Audit

Audit date: 2026-05-26  
Scope: main eLuna product only. Prelands, payment logic, Supabase schema and auth flow were not changed.  
Method: static product/code audit across the requested routes and shared components. `npm run type-check` and `npm run build` were run after the audit file was created.

## 1. Executive Summary

eLuna already has a recognizable visual direction: dark cosmic shell, gold/lavender accents, a premium logo system, mobile-first layout, daily dashboard, Sky Map, Today page, profile, and a guided tour structure. The recent font system and removal of the mascot make the product feel materially closer to premium.

The product still feels unfinished because several visible UI elements behave like placeholders: notification/mode buttons do nothing, profile "Personal Chart" points to `#`, journal archive points to `#`, some daily values are fixed, profile statistics are hardcoded, and important progress logic is stored only in `localStorage`. The user can see a beautiful shell, but the product value is not consistently backed by real personalization or durable state.

The most important launch blockers are not purely visual. They are trust and product logic issues: Supabase profile reads do not include birth data even though registration collects it, reset-password can show a success state without an actual Supabase recovery session, social login buttons are decorative, and locked/premium states do not have a clear payment/access path.

Before traffic, eLuna needs a focused readiness pass: remove or wire placeholder CTAs, make account/profile data consistent with registration, clarify locked content, verify reset-password with Supabase recovery links, and replace static product stats with real or transparently placeholder states.

Issue count in this audit: P0 = 8, P1 = 16, P2 = 12.

## 2. Critical Issues

### P0-1. Visible CTA links lead nowhere

- Problem: Several product CTAs look actionable but point to `#` or have no handler.
- Where: `src/app/profile/page.tsx` personal chart menu item, `src/app/journal/page.tsx` archive link, `src/app/cards/page.tsx` "All" link, topbar mode/notification buttons in `src/app/home/page.tsx`, `src/app/sky/page.tsx`, `src/app/profile/page.tsx`.
- Why it is bad: Premium products lose trust quickly when polished controls are decorative.
- Risk: Users click into dead ends after onboarding, reducing confidence and conversion.
- Recommended fix: Either wire each CTA to a real route/state or visually mark it as "Coming soon" with disabled semantics.
- Priority: P0.

### P0-2. Supabase profile mapping loses birth data

- Problem: Registration sends birth metadata to Supabase auth, but `getCurrentUser()` only reads `profiles.full_name` and `avatar_url`; returned Supabase profile has empty `gender`, `birthDate`, `birthTime`, and `birthPlace`.
- Where: `src/lib/auth/authAdapter.ts`.
- Why it is bad: `/today`, `/sky`, and future personalization depend on birth data, but Supabase users can receive generic/fallback readings.
- Risk: The product promises personal astrology and then silently degrades for real accounts.
- Recommended fix: Decide one source of truth for profile birth data, persist it there, and map it back in `getCurrentUser()`.
- Priority: P0.

### P0-3. Product pages still read mock/localStorage directly

- Problem: `/today` and `/sky` read `getMockUser()` instead of the auth adapter. This bypasses Supabase users.
- Where: `src/app/today/page.tsx`, `src/app/sky/page.tsx`.
- Why it is bad: Logged-in Supabase users may not see their real name, gender, birth date, or calculated forecast.
- Risk: Real production auth works technically, but the product value is inconsistent.
- Recommended fix: Use `getCurrentUser()` through a shared profile hook/provider and fall back to mock only when Supabase env is absent.
- Priority: P0.

### P0-4. Reset password route can appear successful without a valid recovery session

- Problem: `/reset-password` calls `updatePassword(password)`. In mock mode it always succeeds; in Supabase mode it depends on the recovery session existing in the browser.
- Where: `src/app/reset-password/page.tsx`, `src/lib/auth/authAdapter.ts`.
- Why it is bad: A user can open the route manually and receive a misleading success state in fallback mode.
- Risk: Password recovery can look complete while no real account password changed.
- Recommended fix: On `/reset-password`, detect Supabase recovery state/session and show a clear invalid/expired-link state; keep mock success only for local fallback with explicit copy.
- Priority: P0.

### P0-5. Social login buttons are decorative

- Problem: Google and Apple buttons render on `/login` but have no auth behavior.
- Where: `src/app/login/page.tsx`.
- Why it is bad: Users expect OAuth to work; decorative social buttons are a high-trust failure.
- Risk: Login conversion loss and support confusion.
- Recommended fix: Remove social buttons until OAuth is configured, or wire Supabase OAuth providers.
- Priority: P0.

### P0-6. Static stats and streaks look like real user data

- Problem: Home and Profile show hardcoded progress/stats: 12-day streak, 18 cards, 9 entries, 2/8 path progress, 78% day energy.
- Where: `src/app/home/page.tsx`, `src/app/profile/page.tsx`, `src/app/sky/page.tsx`.
- Why it is bad: The product appears personalized but uses static values.
- Risk: Users notice fake metrics and lose trust in paid/personalized content.
- Recommended fix: Replace with real derived values or label unavailable states honestly.
- Priority: P0.

### P0-7. Premium/locked states have no payment or access explanation

- Problem: Sky Map marks Past Life and Soulmate as premium, but locked nodes still link to pages and no upgrade/access logic is explained.
- Where: `src/app/sky/page.tsx`, `src/lib/subscription/subscriptionAccess.ts`, `/sky/*` routes.
- Why it is bad: Monetization intent is visible but the path to unlock is unclear.
- Risk: Users hit confusing premium gates or access paid content without consistent logic.
- Recommended fix: Centralize access checks and add a premium explanation/CTA that respects current payment logic.
- Priority: P0.

### P0-8. `/today/node` is a Russian-only partial prototype

- Problem: `/today/node` contains only 2 question objects while the UI claims 7 questions, has Russian-only copy, and "Save progress" has no handler.
- Where: `src/app/today/node/page.tsx`.
- Why it is bad: This route looks production-facing but is incomplete.
- Risk: Users reach a broken flow and cannot finish the promised node experience.
- Recommended fix: Either finish the node flow, localize it, and persist answers, or hide it from production navigation.
- Priority: P0.

Checked required critical signals:

- Hardcoded `24 May 2024`: not found in `src`.
- Mascot/fox UI: `rg -n "mascot|fox|eluna-fox" src` returned no active source hits during the previous cleanup verification.
- Demo/mock data: still present in `src/data/user.ts`, `src/lib/mockAuth.ts`, hardcoded stats in Home/Profile/Sky, and localStorage node progress.
- Broken/decorative controls: present in profile, journal, cards, topbar and social login.

## 3. Page-by-page Audit

### /welcome

- UX: Clear entry point with Create Account and Sign In. The stats row communicates scope quickly.
- UI: Good premium direction. Logo, dark background, gold accents and Cormorant headings fit the brand.
- Copy/text: Copy is emotionally aligned but still generic. It does not clearly say what the user gets after registration.
- Product value: The value proposition is implied rather than concrete: daily insight, sky map, cards, practices, journal should be named explicitly.
- Technical issues: No obvious broken controls. Guest note should be checked for whether guest mode actually exists.
- Recommendations: Add one concrete promise under the headline, such as "Get your daily moon reading, personal sky map, and first practice in 3 minutes." If guest mode is not real, remove or rewrite the guest note.

### /register

- Onboarding flow: Four-step flow is strong: account, birth data, interests, ready. It feels intentional.
- Birth city autocomplete: Worldwide server route exists via `src/app/api/places/search/route.ts`; GeoNames/fallback is in `src/lib/locations/worldCitySearch.ts`; keyboard navigation is present.
- Validation: Name, email, password, birth date/time/place validation exist. Gender is optional and has no "prefer not to say" option.
- Mobile UX: Mobile-friendly overall, but Step 3 interest cards are tall and may make the flow feel long.
- Error states: Field-level errors exist. Network/API city failures silently show empty suggestions, which is acceptable for MVP but should be monitored.
- Supabase/auth behavior: Registration collects birth metadata but current Supabase profile read does not return it later.
- Recommendations: Preserve the flow, but make account creation and profile persistence consistent. Add a short "why we ask" hint for birth time/place. Add a nonbinary/prefer-not option or remove gender if it is not used meaningfully.

### /login

- Forgot password: Reset form exists inline, pre-fills email, uses safe generic success copy, and calls `sendPasswordReset()`.
- Error states: Login error and reset error states exist, but messages mix Russian and English depending on adapter.
- Social login buttons: Google/Apple are visible but inactive.
- Recommendations: Remove or wire social buttons before launch. Normalize auth errors into the active locale. Keep forgot password, but validate the full recovery-session path.

### /home

- Daily insight: Strong hero card and clearer visual hierarchy after dynamic date work.
- Dynamic date: Uses `formatToday("en-US")` in `src/app/home/page.tsx`; hardcoded `24 May 2024` is not present.
- Cards: Visually attractive, but card of the day and energy are static.
- Recommendations: Good layout, but replace hardcoded `78%`, "Moon in Scorpio", and streak values with real daily/profile data or clear empty states.
- Navigation: Bottom nav is clear. Topbar notification/mode buttons are decorative.
- User personalization: `HomeGreeting` should be checked as part of personalization, but the page still has many non-user-derived values.
- Demo/mock data: Static streak and fixed recommendation content remain.
- Recommendations: Make the page's top three values truly dynamic: greeting, daily focus, one recommended action. Disable unused topbar controls.

### /sky

- Sky map clarity: The visual is distinctive and brand-aligned. Node labels and status chips are understandable at a glance.
- Locked/active states: Premium is visible, but access rules are not enforced or explained enough.
- Filters: All/Active/Available filters work, but Premium is not a filter option even though premium nodes are important.
- Onboarding hints: Guide targets exist for filters and map. Spotlight overlay can find real targets.
- Visual hierarchy: The map is strong, but the action "Dive in" competes with current path and locked panels.
- Recommendations: Add clear status logic: active, available, locked premium. Add a Premium/Locked filter or explanation. Use auth adapter user data for gender/background selection.

### /today

- Daily forecast: Uses daily calculation utilities and actual current date/moon state. This is one of the strongest product areas.
- Moon card: Good hierarchy, meaningful data, and guide target exists.
- Recommended actions: Looks useful, but "Ritual" links back to `/today`, creating a loop.
- Personal day number: Calculated if birth data is present; otherwise fallback can feel generic.
- Content freshness: Moon phase/planetary day is dynamic, but some recommended actions are static.
- Recommendations: Make each recommended action lead to a distinct task. Show a "complete today's practice" state and journal prompt after completion.

### /today/node

- Content depth: Currently too shallow for production. It promises 7 questions but only contains 2 unique question objects.
- Node explanation: The copy is thoughtful, but Russian-only and disconnected from the rest of the English-first shell.
- CTA logic: "Save progress" does nothing; Next stops after question 7 with no result screen.
- Navigation back/forward: Breadcrumbs exist, but the flow does not support previous answer review.
- Recommendations: Treat this as a prototype. Finish answer persistence, result screen, localization, and completion state before exposing.

### /profile

- Profile data: Uses `getCurrentUser()` for name, which is good. Other visible stats are hardcoded.
- Settings: Settings link exists. Personal Chart points to `#`.
- Subscription state: No clear subscription/plan state on profile even though premium nodes exist.
- Logout/account actions: Logout confirmation is present and sensible.
- Recommendations: Replace fake stats with real counts. Build or hide Personal Chart. Add plan/subscription state if premium content is visible elsewhere.

### /reset-password

- UX: Simple, aligned with auth visuals, and easy to understand.
- Validation: Password match and `minLength` exist.
- Success/error states: Present.
- Recommendations: Detect invalid/expired Supabase recovery links. Add password visibility toggles and active-locale copy. Do not show success for manual route visits in production Supabase mode.

## 4. UX Problems

- Decorative controls: Mode, notifications, social login, archive, personal chart and some card links look functional but are not.
- Navigation ambiguity: Bottom nav label for `/today` uses `path` as label key in `src/lib/routes.ts`, so the route meaning may be unclear if copy says "Path" while the page is "Today".
- No clear next step after key actions: `/today/node` does not finish; daily practices do not mark completion; Sky Map does not explain next unlock mechanics.
- Mobile shell is visually cohesive but heavily card-dense. Some screens may feel like many equal-weight panels rather than a guided primary action.
- Loading states are uneven: auth has loading, city search has loading, profile starts with `"..."`, but product data loading/empty states are not standardized.
- Empty states are missing for no journal entries, no profile data, no progress, no subscription plan, and unavailable locked content.
- Some controls rely only on icon meaning without tooltip/explanation: moon mode, notification, guide button.
- Forms are attractive but mostly inline-styled, making consistent focus/error behavior harder to guarantee.

## 5. UI / Visual Design Problems

- Fonts: Cormorant Garamond, Manrope and Lora are correctly wired in `src/app/layout.tsx`. Some components still reference `var(--font-serif)` and `var(--font-sans)` instead of the newer variables, which may be okay if tokens map them, but should be standardized.
- Headings: The premium display type works. `/today/node` uses a very large 52px title that may feel oversized in the mobile shell.
- Contrast: Most text is readable. Muted secondary text can become too low contrast on glass cards.
- Spacing: The product uses many 20-24px rounded cards. It looks lush, but can feel heavy and repetitive.
- Cards: Card system is visually strong but too many panels have equal emphasis. Primary action should stand out more consistently.
- Icons: Mix of inline SVG, PNG icons, emoji, and text symbols. This weakens the premium feeling.
- Mascot: No active fox/mascot source hits were found in `src`; guide now uses a sparkle-style icon.
- Premium feeling: Strong direction, but fake/static metrics and inactive buttons hurt premium perception more than color or typography.
- Consistency: Many pages use inline styles instead of shared primitives, creating small differences in buttons, cards, labels and focus.

Visual direction recommendation: keep dark cosmic + gold/lavender, but make it quieter. Reduce decorative controls, standardize one card/button/input system, use fewer emoji, and make dynamic data the hero rather than adding more ornament.

## 6. Copy / Content Audit

- Welcome copy is aligned but does not explain the exact product outcome after registration.
- Login/reset copy mixes English UI with Russian auth errors from `authAdapter`.
- Today content is more credible because it is calculated from date/moon utilities.
- Sky copy explains directions, but premium/locked copy lacks commercial clarity.
- Profile copy implies a personal chart exists, but the route is missing.
- `/today/node` copy is emotionally good but only Russian and incomplete.
- `src/data/today.ts` and `src/data/user.ts` contain Russian mock/demo copy and should not drive production UI unless explicitly intended.
- Some phrases are generic: "Recommended for today", "Your personal setup", "This is where your personal directions live." They are acceptable for hints but not enough for onboarding value.

Recommendations: Make copy more concrete and trust-building. Explain what is calculated, what is reflective, and what is user-entered. Avoid implying precise astrology where the calculation is simplified or static.

## 7. Product Logic Audit

- After registration, the user lands on `/home`, which is good.
- The immediate daily value is visible: hero forecast, Today page, cards, practices.
- Return reason exists conceptually through daily forecast, streak, journal and progress, but completion/progression is not durable enough.
- Progression/path exists through Sky Map and node pages, but status is partially hardcoded and partially localStorage.
- Locked/unlocked logic exists visually, but not consistently enforced across routes.
- Fake/static areas: Home streak, profile stats, path progress, Sky Map progress, premium unlock text, some card/practice recommendations.
- Personalization is incomplete for Supabase users because pages read mock data or incomplete profile data.

Recommendations: Define a simple v1 product loop:

1. Daily reading.
2. One recommended practice.
3. User completes or journals.
4. Progress updates.
5. Sky Map reflects that progress.

Then make every visible metric come from that loop.

## 8. Guided Tour / Hints Audit

- Mascot fox: No active source hits for `mascot`, `fox`, or `eluna-fox` were found in `src` after cleanup.
- Guide components: `src/components/guide/GuideProvider.tsx`, `GuideSheet.tsx`, `GuideTutorialOverlay.tsx`, `GuideTopBarButton.tsx`, `guideGuides.ts`.
- Guide behavior: Uses `localStorage` key `eluna:tours:v1:completed`; auto-launches first visit for Home, Today, Sky, Profile and others.
- Spotlight: `GuideTutorialOverlay` queries `[data-tour="..."]`, scrolls target into view, draws a gold/lavender highlight, and moves tooltip near target.
- Missing targets: The overlay skips missing targets in dev-safe fashion. However, some guide steps for journal/settings/path use ids like `journal-1` and `settings-1` that may not exist on those pages.
- Modal friction: Auto-launch on many pages can become noisy for returning users if storage is cleared or across devices.

Recommendations: Keep the premium guide pattern. Audit every `guideGuides.ts` step against actual `data-tour` attributes. Consider auto-launch only on `/home` after registration, and manual guide elsewhere.

## 9. Auth / Supabase Audit

- Sign up: `register()` supports Supabase and mock fallback. Supabase signUp stores metadata and upserts `profiles`.
- Profile creation: `upsertProfile()` only writes id, email, full_name, avatar_url. Birth data is not written to `profiles`.
- Login: `signIn()` works through Supabase when env exists, otherwise creates a mock user from email.
- Reset password: `sendPasswordReset()` uses Supabase when configured and safe generic copy. Recovery route needs stronger session validation.
- Duplicate email handling: Friendly error exists for "user already registered".
- Email confirmation: If Supabase requires email confirmation, `register()` may return a user but app routes to `/home`; UX should explain confirmation if session is not active.
- Env variables: Supabase browser client safely requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. GeoNames uses server-side `GEONAMES_USERNAME`.
- RLS risks: Not audited at schema level. Frontend assumes `profiles` select/upsert works. Verify policies for user-owned rows before launch.
- User profile loading: Profile route redirects unauthenticated users, but Home/Today/Sky do not consistently guard auth.
- Fallback states: Mock fallback is useful for local development but can mask production misconfiguration.

Recommendations: Add a central auth/profile provider or server boundary. Verify email confirmation UX. Ensure Supabase profile contains all fields the product needs.

## 10. Technical Audit

- Component structure: Many pages are large client components with extensive inline styles. This slows future product iteration.
- Duplication: Auth field styles, card styles, topbars, buttons and icon buttons are duplicated across pages.
- Hardcoded data: Home/Profile/Sky have hardcoded stats; `src/data/user.ts` is explicit mock data.
- Mock data: `src/lib/mockAuth.ts` and `src/lib/nodeProgress.ts` are localStorage-based. Good fallback, but risky as production product state.
- Route structure: Main routes exist. `/today/node` is a partial standalone prototype; `/cards`, `/journal`, `/settings` contain additional placeholders outside the requested core pages.
- Client/server boundaries: Most product pages are client components. Supabase browser auth is used from client adapter. Place search is correctly server-routed.
- Hydration risks: Home date is client-side, so no server mismatch; Today date is also client-rendered.
- localStorage usage: Guide completion, mock auth, language, node progress. This is fragile across devices and browsers.
- Env usage: Supabase and GeoNames env usage is safe. Mock fallback can hide missing production env.
- Performance: StarField/backgrounds and multiple PNG assets are used across pages; likely acceptable for MVP but should be measured.
- Image optimization: Many product assets use `next/image`, which is good. Background CSS PNGs are not optimized through `next/image`.

## 11. Mobile Audit

- The product is mobile-first with a max 430px shell, which fits the app concept.
- At 390px, cards likely fit because grids are constrained, but some text-heavy buttons can become cramped: Step 3 register cards, Sky node labels, Profile menu rows, Today recommended action cards.
- Bottom nav is always visible and simple, but five items can feel tight with long localized labels.
- Modals: Guide tooltip is mobile-aware and maxes to viewport width. Sheet bottom modal is appropriate.
- Vertical rhythm: Premium, but dense. Home and Today contain many stacked cards before a clear completion action.
- Tap targets: Most buttons are 40px or larger. Small text links like Forgot/See all/More need focus and hit-area checks.
- Risks: Large Sky Map at 460px height dominates small screens; useful, but may push explanation/CTA below fold.

Recommendations: Run a visual QA pass at 390x844 for all requested routes. Reduce equal-weight panels and surface one primary next step per page.

## 12. Performance / Assets

- Heavy images: `welcome-bg-notext.png`, Sky backgrounds, emblem PNGs and main screen PNGs drive visual quality but should be checked for file size.
- PNG optimization: Existing PNGs should be converted to WebP/AVIF where transparency is not required.
- Lazy loading: `next/image` defaults are good; hero images use priority where appropriate.
- CSS backgrounds: CSS background images do not get `next/image` optimization.
- StarField: Decorative animation appears on many pages. It should respect reduced-motion preferences and be profiled on low-end mobile devices.
- Guide overlay: Querying DOM and scroll listeners are reasonable, but should be tested for scroll performance.
- Fonts: Google fonts via `next/font` are good for performance and layout stability.

Recommendations: Add an asset budget and run Lighthouse/WebPageTest on production build. Convert large non-transparent assets to AVIF/WebP and add `prefers-reduced-motion` handling.

## 13. Prioritized Roadmap

| Priority | Task | Area | Why it matters | Estimated complexity |
|---------|------|------|----------------|---------------------|
| P0 | Wire or disable all `href="#"` and decorative CTAs | UX/trust | Prevents broken product moments | S |
| P0 | Make Supabase profile return birth data | Auth/product logic | Enables real personalization | M |
| P0 | Replace direct `getMockUser()` reads on product pages with auth adapter/profile provider | Auth/product logic | Makes Supabase users work correctly | M |
| P0 | Validate reset-password recovery session | Auth | Avoids misleading success states | M |
| P0 | Remove or wire social login buttons | Auth/conversion | Prevents false affordances | S/M |
| P0 | Replace hardcoded Home/Profile/Sky stats | Product trust | Avoids fake personalization | M |
| P0 | Clarify/enforce premium locked content | Monetization | Prevents access confusion | M |
| P0 | Finish or hide `/today/node` | Content/product | Avoids incomplete core flow | M |
| P1 | Standardize card/button/input primitives | UI system | Reduces inconsistent polish | M |
| P1 | Add real empty/loading/error states for profile/progress/journal | UX | Makes product robust | M |
| P1 | Add one clear primary next step per main page | Product UX | Improves activation and retention | S |
| P1 | Audit all guide targets against `data-tour` attrs | Guided tour | Prevents skipped/missing hints | S |
| P1 | Reduce auto-launch guide frequency | Guided tour | Avoids modal fatigue | S |
| P1 | Localize auth errors and `/today/node` | Copy/i18n | Prevents language mismatch | M |
| P1 | Add subscription/plan state on Profile | Monetization | Connects premium content to account | M |
| P1 | Add completion state for daily actions | Retention | Creates daily loop | M |
| P1 | Make Today recommended actions unique destinations | Navigation | Avoids circular routes | S |
| P1 | Add accessible labels/tooltips to icon-only topbar actions | Accessibility | Improves clarity | S |
| P1 | Review contrast of muted text on glass cards | Visual/accessibility | Improves readability | S |
| P1 | Make Sky premium filter or locked explanation | Sky Map UX | Clarifies access states | S |
| P1 | Add real Personal Chart page or remove entry | Profile | Aligns promise with product | M |
| P1 | Add reduced-motion styles for star/tour animations | Accessibility/performance | Supports sensitive users | S |
| P1 | Normalize route naming: Today vs Path | Navigation/copy | Reduces mental model confusion | S |
| P1 | Add production env misconfiguration warnings | Ops | Avoids silent mock fallback in prod | S |
| P2 | Replace emoji with consistent icon system | Visual polish | More premium, less toy-like | M |
| P2 | Move inline styles into reusable components/tokens | Frontend maintainability | Faster future iterations | L |
| P2 | Add analytics events for onboarding/dropoff | Product | Shows where users struggle | M |
| P2 | Add journal edit/delete/archive | Journal | Makes journal feel complete | M |
| P2 | Add cross-device progress persistence | Product logic | Improves retention | L |
| P2 | Improve Sky Map node details and previews | Content | Makes exploration clearer | M |
| P2 | Add richer onboarding value proof on Welcome | Conversion | Increases registration intent | S |
| P2 | Add account deletion/privacy controls | Trust | Needed for mature account product | M |
| P2 | Add responsive desktop layout beyond centered mobile shell | Desktop UX | Better use of larger screens | L |
| P2 | Add image asset budget and AVIF/WebP conversion | Performance | Faster loading | M |
| P2 | Build notification/reminder preferences | Retention | Supports daily habit | M |
| P2 | Add automated E2E smoke tests for core routes | QA | Prevents regressions | M |

## 14. Quick Wins

- Disable or relabel inactive topbar notification/mode buttons.
- Remove Google/Apple buttons until OAuth is wired.
- Replace Profile "Personal Chart" `href="#"` with a real route or "Coming soon".
- Replace Journal archive `href="#"` with disabled coming-soon copy.
- Change static Home/Profile stats to neutral empty states for new users.
- Add "Ritual" action destination that is not `/today` itself.
- Add an invalid/expired reset link message on `/reset-password`.
- Audit `guideGuides.ts` ids against real `data-tour` attributes.
- Add a Premium explanation panel in Sky Map.
- Normalize English/Russian auth error copy.
- Add `prefers-reduced-motion` handling for star/tour animation.
- Convert the largest background PNGs to WebP/AVIF after checking sizes.

## 15. Launch Readiness Checklist

- [ ] Auth works with Supabase env.
- [ ] Auth works with mock fallback only when Supabase env is absent.
- [ ] Registration works end-to-end.
- [ ] Supabase profile saves and reloads name, birth date, birth time, birth place and gender.
- [ ] Login works with correct error states.
- [ ] Reset password works from a real email recovery link.
- [ ] Profile saved and loaded across sessions/devices.
- [x] No hardcoded `24 May 2024` found in `src`.
- [ ] No production-visible fake stats or demo data.
- [x] No active fox/mascot source hits in `src`.
- [ ] Guided tour works on all pages with valid targets.
- [ ] Mobile 390px visual QA passed.
- [ ] Desktop centered shell visual QA passed.
- [ ] Main pages are filled and not prototype-only.
- [ ] No broken CTAs.
- [ ] Supabase env configured.
- [ ] GeoNames env `GEONAMES_USERNAME` configured or fallback accepted.
- [ ] Build passes.

## 16. Final Recommendation

The product is not launch-ready for paid or broad cold traffic yet. It is ready for internal QA, founder demos, and a small controlled test if users are told it is a beta.

The mandatory next order is:

1. Fix broken/decorative CTAs.
2. Make Supabase profile data consistent with registration.
3. Replace direct mock reads in core product pages.
4. Finish reset-password recovery validation.
5. Replace hardcoded stats with real or honest empty states.
6. Finish or hide `/today/node`.
7. Clarify premium/locked content before monetization.

After those P0 items, the product can move into a premium polish pass: shared UI primitives, clearer daily loop, better guide targeting, localization consistency, and performance/asset optimization.

## Checks

- `npm run type-check`: passed.
- `npm run build`: passed. Next.js generated all listed app routes successfully.
