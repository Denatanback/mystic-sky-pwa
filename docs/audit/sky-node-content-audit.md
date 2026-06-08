# Sky Node Content Audit

Date: 2026-06-05

Scope: `src/lib/sky`, `src/app/sky`, `src/components/sky`, and related calculation/progress files used by Sky node routes.

This is an analysis-only audit. No routes, access logic, UI, unlock rules, or content were changed.

## 1. Overview

### Files that define Sky nodes

- `src/lib/sky/skyNodes.ts`
  - Defines the top-level `/sky` map nodes through `baseSkyNodes`.
  - Defines `SkyNodeStatus`, `SkyUnlockType`, `SkyNode`, `disciplineDescriptions`, and `resolveSkyNodes`.
  - Owns top-level node ids, titles, category labels, `mapLabel`, descriptions, routes, requirements, unlock type, premium flags, emblem assets, orbital degrees, and preview bullets.
- `src/lib/sky/skyNodeAccess.ts`
  - Defines `SkyDisciplineKey`.
  - `canAccessSkyNode` currently returns `entitlements.hasFullAccess` for every gated discipline node.
- `src/lib/nodeProgress.ts`
  - LocalStorage progress store for deep discipline nodes.
  - First node is always unlocked; every later node is locked until the previous node is completed.

### Files that render the Sky map

- `src/app/sky/page.tsx`
  - Renders the main `/sky` page: header, filters, circular Sky Map, `Current point`, preview sheet, subscription modal, and bottom nav.
  - Calls `resolveSkyNodes({ completedCount, hasPremiumAccess, birthDate })`.
  - Uses `mapLabel` for labels on the circular map and `title` for preview/current-point labels.
  - Uses `NodePreviewSheet` for node click previews.
- `src/components/sky/NodePreviewSheet.tsx`
  - Renders preview drawer for top-level nodes.
  - Shows category, title, status label, description, preview bullets, unlock requirement, discipline text, and primary action.
  - Premium nodes open subscription; locked nodes link to `/today`; active/available nodes link to `node.route`.
- `src/components/sky/PersonalSkyMap.tsx`
  - Separate older/alternate personal sky map based on `src/data/paths.ts`.
  - Not the current `/sky` main renderer, but still related Sky content.

### Files that render node detail pages

- Discipline overview maps:
  - `src/app/sky/astrology/page.tsx`
  - `src/app/sky/numerology/page.tsx`
  - `src/app/sky/humandesign/page.tsx`
  - `src/app/sky/pastlife/page.tsx`
  - `src/app/sky/spiritual/page.tsx`
  - `src/app/sky/soulmate/page.tsx`
- Dynamic node detail routes:
  - `src/app/sky/astrology/[nodeId]/page.tsx`
  - `src/app/sky/numerology/[nodeId]/page.tsx`
  - `src/app/sky/humandesign/[nodeId]/page.tsx`
  - `src/app/sky/pastlife/[nodeId]/page.tsx`
  - `src/app/sky/spiritual/[nodeId]/page.tsx`
  - `src/app/sky/soulmate/[nodeId]/page.tsx`
- Shared wrappers:
  - `src/components/sky/NodePathPage.tsx`
  - `src/components/sky/NodePage.tsx`
  - `src/components/sky/SkyNodeEntitlementGate.tsx`

### Related content/calculation files

- `src/lib/astroCalc.ts`
  - Zodiac signs, sun sign ranges, approximate Venus sign, element traits, sun trait cards.
- `src/lib/astrology/resolveZodiac.ts`
  - Used by astrology node 1 to resolve user zodiac from profile data.
- `src/lib/numerologyCalc.ts`
  - Life Path calculation, Soul Number calculation, number trait content.
- `src/lib/profile/currentProfile.ts`
  - Used by main Sky page and some node pages for birth date, gender, onboarding state, and name.
- `src/lib/mockAuth.ts`
  - Used by soulmate node 1 for birth date instead of `getCurrentProfile`.
- `src/data/paths.ts`
  - Older/alternate path definitions for `PersonalSkyMap` and `SkyMiniProgress`.

### How ids, titles, statuses, routes, access gates, and map labels connect

- Top-level `/sky` nodes are defined in `baseSkyNodes`.
- `id` controls orbital placement through `orbitalNodePositions` in `src/app/sky/page.tsx`.
- `num` controls rendered order and label prefix.
- `title` is used in preview sheets, current point, subscription context, image alt text, and detailed content identity.
- `mapLabel` is used only for circular map labels.
- `route` controls where `NodePreviewSheet` opens active/available nodes.
- Main map status is calculated by `resolveSkyNodes`:
  - `free`: keeps base status, except `life-path` becomes `active` when `birthDate` exists.
  - `premium`: becomes `available` when `hasPremiumAccess`; otherwise `premium`.
  - `progress`: uses `completedCount`, but no current top-level node uses `progress`.
  - `time`: returned unchanged; `weekly-report` remains `locked`.
- Deep node status is separate:
  - `NodePathPage` computes live node status from `src/lib/nodeProgress.ts`.
  - `[nodeId]` pages call `isNodeLocked(discipline, nodeId)`.
  - `SkyNodeEntitlementGate` can additionally block premium disciplines unless `entitlements.hasFullAccess` is true.

## 2. Sky Map Nodes Table

| # | id | mapLabel | title | category/theme | status logic | route | access requirement | icon / visual asset | short description | status type |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `sun-sign` | Astrology | Sun Sign | Astrology | Base `active`; free node remains active | `/sky/astrology/1` | Available now | `/assets/sky-emblems/sky-astrology-emblem.png` | Core solar identity and choice/meaning energy | Active/static free |
| 2 | `life-path` | Numerology | Life Path | Numerology | Base `available`; becomes `active` if profile has `birthDate` | `/sky/numerology/1` | Available after setup | `/assets/sky-emblems/sky-numerology-emblem.png` | Inner drive, recurring direction, life rhythm | Dynamic free |
| 3 | `energy-rhythm` | Human Design | Energy Rhythm | Human Design | `premium` unlock type; available only with premium access | `/sky/humandesign/1` | Available with Intro access or Premium | `/assets/sky-emblems/sky-humandesign-emblem-2.png` | Decision-making style and energy rhythm | Premium/dynamic |
| 4 | `past-life-signal` | Past Life | Past Life Signal | Soul Memory | `premium` unlock type; available only with premium access | `/sky/pastlife/1` | Available with Intro access or Premium | `/assets/sky-emblems/sky-pastlife-emblem.png` | Repeating emotional patterns that feel older than the present | Premium/dynamic |
| 5 | `grounding-practice` | Spiritual Practices | Grounding Practice | Spiritual Practices | `premium` unlock type; available only with premium access | `/sky/spiritual/1` | Available with Intro access or Premium | `/assets/sky-emblems/sky-soulpractice-emblem.png` | Practice-based integration of daily insight | Premium/dynamic |
| 6 | `soulmate-pattern` | Soul Mate | Soulmate Pattern | Soulmate | `premium` unlock type; available only with premium access | `/sky/soulmate/1` | Available with Intro access or Premium | `/assets/sky-emblems/sky-soulmate-emblem.png` | Attraction themes, relationship mirrors, repeating connection signals | Premium/dynamic |
| 7 | `weekly-report` | Weekly Soul Report | Weekly Soul Report | Reports | `time` unlock type, but `resolveSkyNodes` returns base `locked`; `availableOnDay: 7` is not used there | `/profile` | Return on Day 7 | `/assets/sky-emblems/sky-soulpractice-emblem.png` | Weekly synthesis of repeated readings/practices/signals | Locked/static time |

## 3. Node Content Summary

### Main `/sky` Page

- Path: `src/app/sky/page.tsx`
- Renders:
  - eLuna app header/topbar.
  - `All / Active / Available` filters.
  - Circular Sky Map with human figure image, node emblems, node labels, and status labels.
  - `Current point` block with active node title, Open button, and next locked/premium info.
  - `NodePreviewSheet`, `SubscriptionModal`, `FeatureInfoSheet`, bottom nav.
- Filter behavior:
  - `All`: all nodes full opacity.
  - `Active`: active and completed nodes full opacity; others dimmed and non-clickable.
  - `Available`: available nodes full opacity; others dimmed and non-clickable.
- Hardcoded text needing review:
  - `Current point` always says `Start here, then continue today's path to open deeper map areas.`
  - Next unlock chooses the first `locked` or `premium` node from top-level nodes, independent of deep path progress.
  - Preserved but unrendered onboarding helper still contains only the Node Status Legend JSX; other preserved text exists as a comment.

### Node Preview Sheet

- Path: `src/components/sky/NodePreviewSheet.tsx`
- Main sections:
  - Category/title/status.
  - Description.
  - `What you'll receive` bullets from `previewBullets`.
  - `Unlock requirement`.
  - `How this fits your map`.
  - Primary action.
- CTA behavior:
  - Premium: button text `Start 3-day access for $1`, opens subscription modal.
  - Locked: link to `/today` with `Continue today's path`.
  - Active/available/completed: link to `node.route` with `Open node`.
- Locked/premium behavior:
  - Status labels are local to preview sheet: active -> `Ready`, available -> `Available`, premium -> `Premium`, completed -> `Completed`, otherwise `Locked`.

### Discipline Overview Pages

All six discipline overview pages render `NodePathPage`, which shows:

- Back link to `/sky`.
- Title from i18n `t.nodePath.title`.
- Discipline name and subtitle.
- A constellation map of 8 nodes.
- Current node card with `Open node` CTA.
- Next node card.
- Path progress bar.
- Bottom nav.

Each overview page has hardcoded English node arrays and unreachable Russian arrays behind `false ? [...] : [...]`.

| Path | Discipline key | Nodes shown in overview |
|---|---|---|
| `/sky/astrology` | `astrology` | Sun, Moon, Aspects, Houses, Planets, Transits, Patterns, Synthesis |
| `/sky/numerology` | `numerology` | Life Path, Soul Number, Personality, Matrix, Cycles, Karma, Master Numbers, Personal Code |
| `/sky/humandesign` | `humandesign` | Type, Authority, Profile, Centers, Channels, Gates, Cycles, Living Design |
| `/sky/pastlife` | `pastlife` | Soul Age, Karma, Past Life Sign, Lunar Nodes, Karmic Debts, Soul Contracts, Talents, Integration |
| `/sky/spiritual` | `spiritual` | Meditation, Breathwork, Visualisation, Chakras, Mantras, Ritual, Shadow Work, Awakening |
| `/sky/soulmate` | `soulmate` | Venus, Heart Line, Synastry, Composite, Soul Contract, Twin Flame, Love Cycles, Sacred Union |

### Astrology Detail Pages

- Path: `src/app/sky/astrology/[nodeId]/page.tsx`
- Implemented node ids:
  - `1`: The Sun / Beginning of path.
  - `2`: The Moon / Emotions & intuition.
- Overview map contains 8 nodes, but detail page only defines `NODE_TITLES` for 1 and 2. Node ids 3-8 redirect to `/sky/astrology`.
- Shared detail structure:
  - `NodePage` wrapper with progress.
  - `Part of your Sky Map` card.
  - `Why this node matters`.
  - Specific node content.
  - Links: `Return to Sky Map`, `Continue today's path`.
- Node 1 content:
  - Requires profile birth date; otherwise shows `Complete your personal setup` and `Continue setup`.
  - Reveals Sun sign, element, quality, ruler.
  - Shows element trait chips.
  - Trait card interaction: `Explore your traits`, tap cards, `Open all cards`, `Continue`.
  - Reflection: `Which trait you just uncovered resonates with you most strongly?`
  - CTA: `Complete node`.
- Node 2 content:
  - Requires profile birth date.
  - Approximate Moon sign based on birth date day offset.
  - Intro text about Moon sign.
  - Reveal interaction: `Reveal Moon sign`.
  - Result card with archetype, `Moon in ...`, element, description.
  - `MOON & YOUR EMOTIONS` explanatory card.
  - CTA: `Complete node`.
- Locked behavior:
  - Uses local progress; node 2 locked until node 1 completed.
  - No `SkyNodeEntitlementGate` on astrology detail pages.

### Numerology Detail Pages

- Path: `src/app/sky/numerology/[nodeId]/page.tsx`
- Implemented node ids:
  - `1`: Life Path / Foundation.
  - `2`: Soul Number / Inner world.
- Overview map contains 8 nodes, but detail page only defines `NODE_TITLES` for 1 and 2. Node ids 3-8 redirect to `/sky/numerology`.
- Shared detail structure:
  - `Part of your Sky Map`.
  - `Why this node matters`.
  - Node-specific calculation.
  - Links: `Return to Sky Map`, `Continue today's path`.
- Node 1 content:
  - Requires profile birth date; otherwise shows `Complete your personal setup` and `Continue setup`.
  - Shows birth date.
  - Explains Life Path Number as the most important numerology number.
  - CTA `Start calculation`.
  - Animated reduction steps from birth date.
  - Result number and number trait cards from `NUMBER_TRAITS`.
  - CTA `Complete node`.
- Node 2 content:
  - Requires profile full name; otherwise shows `Add your name in profile`.
  - Uses first name only.
  - Explains Soul Number / Heart's Desire from vowels.
  - CTA `Find vowels`.
  - Highlights vowel letters and values.
  - Result number and number trait cards.
  - CTA `Complete node`.
- Locked behavior:
  - Uses local progress; node 2 locked until node 1 completed.
  - No `SkyNodeEntitlementGate` on numerology detail pages.

### Human Design Detail Pages

- Path: `src/app/sky/humandesign/[nodeId]/page.tsx`
- Implemented node ids:
  - `1`: Type / Foundation.
  - `2`: Authority / Decision making.
- Overview map contains 8 nodes, but detail page only defines `NODE_TITLES` for 1 and 2. Node ids 3-8 redirect to `/sky/humandesign`.
- Node 1 content:
  - Quiz: `Discover Your Type`.
  - 5 questions covering decision style, energy, social behavior, wrongness feeling, and resonant phrase.
  - Result types: Generator, Manifesting Generator, Projector, Manifestor, Reflector.
  - Result card includes description, strategy, signature.
  - CTA `Complete node`.
- Node 2 content:
  - Quiz: `Your Authority`.
  - 3 questions covering decision reliability, timing, and fast-decision failure mode.
  - Result authorities: Sacral, Emotional, Splenic, Ego, Self-Projected, Mental, Lunar.
  - Result card includes description and `HOW TO USE IT`.
  - CTA `Complete node`.
- Locked/premium behavior:
  - Wrapped in `SkyNodeEntitlementGate`.
  - If entitlement loading: shows `Checking access...`.
  - If no full access: shows `Premium Sky Map node`, `Unlock this deeper insight`, `View access options`, and subscription modal.
  - Also uses local progress; node 2 locked until node 1 completed.

### Past Life Detail Pages

- Path: `src/app/sky/pastlife/[nodeId]/page.tsx`
- Implemented node ids:
  - `1`: Soul Age / Beginning.
  - `2`: Karma / Patterns.
- Overview map contains 8 nodes, but detail page only defines `NODE_TITLES` for 1 and 2. Node ids 3-8 redirect to `/sky/pastlife`.
- Node 1 content:
  - Shared quiz component.
  - Soul-age quiz with questions such as worldview, recurring lesson, and attraction theme.
  - Results include Young Soul, Mature Soul, Old Soul, Ancient Soul.
  - Result card includes description and trait chips.
  - CTA `Complete node`.
- Node 2 content:
  - Shared quiz component.
  - Karma quiz covering relationship patterns, growth edge, and fear.
  - Results include Self-Worth, Trust, Self-Expression, Freedom, Love.
  - Result card includes lesson and gift.
  - CTA `Complete node`.
- Locked/premium behavior:
  - Wrapped in `SkyNodeEntitlementGate`.
  - Also uses local progress; node 2 locked until node 1 completed.

### Spiritual Practices Detail Pages

- Path: `src/app/sky/spiritual/[nodeId]/page.tsx`
- Implemented node ids:
  - `1`: Meditation / Foundation.
  - `2`: Breathwork / Energy.
- Overview map contains 8 nodes, but detail page only defines `NODE_TITLES` for 1 and 2. Node ids 3-8 redirect to `/sky/spiritual`.
- Node 1 content:
  - Choose duration: 3 min, 5 min, 10 min.
  - CTA `Begin meditation`.
  - Active timer with breath phases: Inhale, Hold, Exhale.
  - `Finish early` button.
  - Done state text: `Meditation complete`.
  - CTA `Complete node`.
- Node 2 content:
  - Breath techniques: 4-7-8 Calm, Box Breathing, Energizing Breath.
  - CTA `Begin practice`.
  - Active breathing cycle UI.
  - Result/done state and CTA `Complete node`.
- Locked/premium behavior:
  - Wrapped in `SkyNodeEntitlementGate`.
  - Also uses local progress; node 2 locked until node 1 completed.

### Soulmate Detail Pages

- Path: `src/app/sky/soulmate/[nodeId]/page.tsx`
- Implemented node ids:
  - `1`: Venus / Love nature.
  - `2`: Heart Line / Connection.
- Overview map contains 8 nodes, but detail page only defines `NODE_TITLES` for 1 and 2. Node ids 3-8 redirect to `/sky/soulmate`.
- Node 1 content:
  - Uses `getMockUser()` rather than `getCurrentProfile()`.
  - Requires mock user birth date; otherwise shows setup prompt.
  - Calculates approximate Venus sign from `getVenusSign`.
  - Intro: Venus reveals nature in love.
  - Reveal interaction: `Reveal Venus sign`.
  - Result includes love archetype, love style, what you need, gift in love.
  - CTA `Complete node`.
- Node 2 content:
  - Attachment-style quiz.
  - Questions cover relationship feeling, partner needing space, vulnerability, and conflict.
  - Results: Secure, Anxious, Avoidant, Disorganised.
  - Result includes description and growth guidance.
  - CTA `Complete node`.
- Locked/premium behavior:
  - Wrapped in `SkyNodeEntitlementGate`.
  - Also uses local progress; node 2 locked until node 1 completed.

### Weekly Soul Report

- Top-level route: `/profile`.
- There is no dedicated `/sky/weekly-report` or `/sky/report` detail page found.
- Top-level metadata contains description, requirement `Return on Day 7`, availableOnDay `7`, and preview bullets, but `resolveSkyNodes` does not currently activate it based on day.

## 4. Theme Fit Review

| Theme | Rating | What currently exists | What feels off / duplicated | Rename or move candidates |
|---|---|---|---|---|
| Astrology | OK | Top-level `Sun Sign`; overview path includes Sun, Moon, Aspects, Houses, Planets, Transits, Patterns, Synthesis; details implemented for Sun and Moon. | Top-level title is `Sun Sign`, while detail title is `The Sun` and overview label is `Sun`. Moon exists in deeper path but not top-level. Some astrology calculations are approximate. | Consider standardizing `Sun Sign` vs `The Sun` vs `Sun`. |
| Numerology | OK | Top-level `Life Path`; overview path includes 8 numerology concepts; details implemented for Life Path and Soul Number. | Top-level `Life Path` route goes to node 1 only, while overview suggests a broader numerology path. Soul Number requires name but only displays a non-actionable `Add your name in profile` message. | Consider aligning top-level preview bullets with the actual Life Path detail flow. |
| Human Design | Needs review | Top-level `Energy Rhythm` with map label `Human Design`; overview/detail actual first node is `Type`; second is `Authority`. | Top-level title does not match destination title. Human Design content is quiz-derived rather than chart-derived; may be fine for MVP but should be reviewed for product claims. | Rename top-level title or route description to `Type` / `Human Design Type`, or make node 1 truly `Energy Rhythm`. |
| Past Life | Needs review | Top-level `Past Life Signal`; overview first node is `Soul Age`; second is `Karma`; quiz-based archetypes and karmic themes. | Top-level category is `Soul Memory`, map label is `Past Life`, detail is `Soul Age`; three labels point at different framing. | Consider whether `Past Life Signal` should route to `Soul Age`, or whether the detail title should match the top-level promise. |
| Soulmate | Needs review | Top-level `Soulmate Pattern`; map label `Soul Mate`; overview first node `Venus`, second `Heart Line`; content covers Venus sign and attachment style. | Inconsistent spelling: `Soulmate` vs `Soul Mate`. Node 1 uses `getMockUser`, unlike current profile usage elsewhere. Top-level promise is relationship patterns, but first destination is Venus/love style. | Standardize `Soulmate`/`Soul Mate`. Replace mock profile dependency when content is ready to fix. |
| Spiritual Practices | Needs review | Top-level `Grounding Practice`; map label `Spiritual Practices`; overview first node `Meditation`, second `Breathwork`; implemented timers and breath practice. | Top-level title promises grounding, but route lands on Meditation. Implemented content is strong as practice content but not specifically grounding. | Rename top-level title to `Meditation` or make node 1 a grounding practice. |
| Weekly Soul Report | Missing | Top-level node metadata exists with preview bullets and route `/profile`. | No dedicated report detail page found. `availableOnDay` is present but not applied in `resolveSkyNodes`. Uses spiritual practice emblem. | Create a dedicated weekly report route or remove/mark as profile feature until implemented. |

## 5. UX / Product Issues Found

- Top-level node labels and detail page titles often mismatch:
  - `Energy Rhythm` -> `/sky/humandesign/1` -> `Type`.
  - `Past Life Signal` -> `/sky/pastlife/1` -> `Soul Age`.
  - `Grounding Practice` -> `/sky/spiritual/1` -> `Meditation`.
  - `Soulmate Pattern` -> `/sky/soulmate/1` -> `Venus`.
- There are two separate status/access systems:
  - Top-level map status from `resolveSkyNodes`.
  - Deep path status from `localStorage` in `nodeProgress.ts`.
  - Premium detail access from `SkyNodeEntitlementGate`.
- Free top-level nodes can be active/available, but deep path status can still lock node 2+ based on localStorage.
- Premium top-level nodes become `available` when `hasPremiumAccess`, but deep pages require `entitlements.hasFullAccess`. These entitlement fields may not mean the same thing.
- Weekly Soul Report has `availableOnDay: 7`, but there is no visible activation logic for it in `resolveSkyNodes`; its route is `/profile`.
- Most discipline overview pages list 8 nodes, but dynamic detail pages only implement node ids 1 and 2. Node ids 3-8 redirect back to the discipline overview.
- Top-level current point uses the first `active` node. If both Sun Sign and Life Path become active, the first node remains Sun Sign.
- Top-level filters dim and disable map nodes rather than removing them. This is reasonable visually, but should be intentional.
- `Soulmate` node 1 uses `getMockUser()` instead of the current profile system used by astrology/numerology and the main Sky page.
- Several files contain unreachable language branches using `false ? ru : en`, while `useLang()` variables are imported but unused for actual selection.
- Some files show mojibake/encoding artifacts in comments and some symbols in rendered strings, for example `вЂ”`, `в†’`, `вњ“`.
- `SkyMapOnboardingContent` in `src/app/sky/page.tsx` is preserved but not rendered. It currently preserves the legend JSX and comment text, not the full original UI structure.
- `PersonalSkyMap.tsx` and `src/data/paths.ts` appear to represent another Sky path model that may be stale or parallel to the current `/sky` system.
- `humandesign` top-level emblem path is `/assets/sky-emblems/sky-humandesign-emblem-2.png`, while listed assets include `sky-humandesign-emblem.png`; verify that `-2` exists.
- Weekly Soul Report reuses `/assets/sky-emblems/sky-soulpractice-emblem.png`, which may read as spiritual practices instead of report/synthesis.

## 6. Suggested Cleanup Plan

### P0: Must fix before release

- Decide the canonical access model for Sky nodes:
  - Align `hasPremiumAccess`, `hasFullAccess`, top-level `premium` statuses, and detail-page `SkyNodeEntitlementGate`.
- Fix or confirm `Soulmate` node 1 data source:
  - Replace `getMockUser()` with the same profile source used elsewhere, or explicitly mark it as mock-only.
- Resolve Weekly Soul Report:
  - Either implement the Day 7 route/content and activation logic or remove it from the active map until ready.
- Decide whether detail nodes 3-8 are launch content:
  - If not implemented, avoid presenting them as reachable current path depth beyond preview/locked concepts.
- Fix encoding/mojibake in rendered strings and comments before customer-facing release.

### P1: Should fix soon

- Standardize naming between top-level map nodes, preview sheets, overview nodes, and detail page titles.
- Pick one spelling: `Soulmate` or `Soul Mate`.
- Align top-level titles with actual first detail route:
  - `Energy Rhythm` vs `Type`.
  - `Past Life Signal` vs `Soul Age`.
  - `Grounding Practice` vs `Meditation`.
  - `Soulmate Pattern` vs `Venus`.
- Clarify whether top-level map nodes are categories or first lessons. Current `mapLabel` is category-level, but `title` is first-lesson-level.
- Remove or consolidate stale parallel Sky content (`PersonalSkyMap`, `src/data/paths.ts`) if it is no longer part of the product path.
- Review hardcoded explanatory copy in `NodePreviewSheet` to ensure it does not overpromise locked/unimplemented deeper nodes.

### P2: Later polish

- Replace approximate astrology/Human Design calculations with a clearer MVP disclaimer or a more accurate data pipeline.
- Make language selection real instead of `false ? ru : en`.
- Add a dedicated report emblem for Weekly Soul Report.
- Add a content inventory source of truth so top-level nodes, overview nodes, detail titles, preview bullets, and unlock requirements do not drift.
- Consider converting repeated quiz/timer/detail patterns into shared content-driven components once content direction is stable.
