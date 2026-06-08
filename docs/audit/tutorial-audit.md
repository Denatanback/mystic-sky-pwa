# eLuna — Tutorial & Onboarding Audit

**Date:** 2026-06-08  
**Scope:** All tutorial, onboarding, walkthrough, and guide systems in `src/`  
**Status:** Audit only — no code changes made

---

## 1. Systems Inventory

There are **two separate, independent systems**:

| System | Entry point | Trigger mechanism | Covers |
|---|---|---|---|
| **Onboarding flow** | `/onboarding/page.tsx` | `onboardingCompleted` profile/localStorage flag | Account setup only (birth data, focus areas, practices) |
| **Guide / Tutorial overlay** | `GuideProvider.tsx` + `GuideTutorialOverlay.tsx` | Manual user tap on `?` button | Home, Today, Sky, Path, Journal, Profile, Settings |

These systems do not communicate with each other. Completing onboarding does not trigger the guide. The guide has no awareness of onboarding state.

---

## 2. Onboarding Flow

### File
`src/app/onboarding/page.tsx`

### Trigger condition
- User logs in or registers via OAuth/email
- `onboardingCompleted` flag is `false` in localStorage OR in Supabase profile metadata
- Auth callback (`src/app/auth/callback/route.ts`) redirects to `/onboarding` when flag is missing
- Home, Profile, and Today pages independently check this flag and call `router.replace("/onboarding")` if false

### Steps
1. **Step 1 — Birth data**: Full name, birth date (DD.MM.YYYY), optional birth time, birth location  
2. **Step 2 — Focus areas**: Multi-select from ["Love & relationships", "Past life", "Money & abundance", "Purpose", "Intuition", "Body & energy", "Protection & grounding"]  
3. **Step 3 — Practice preferences**: Multi-select from ["Daily readings", "Affirmations", "Rituals", "Cards", "Reflection journal"]

### After completion
→ Saves data to Supabase, sets `onboardingCompleted: true`, redirects to `/home`

### Reachability
✅ **Reachable** — reliably triggered by the auth flow.

### Issues
- After onboarding, **no tutorial fires** — user lands on `/home` with no guidance
- Step 3 (practice preferences) collects data that is **not currently used anywhere** in the app
- `/onboarding?step=birth&mode=edit` is reachable from Profile → "Edit birth data" for re-entry
- No skip option in onboarding (user must complete all 3 steps)
- Focus area selection has no minimum (user can proceed without selecting anything in Step 2 on some builds — depends on validation)

---

## 3. Guide / Tutorial Overlay System

### Architecture

```
GuideProvider (wraps entire app in layout.tsx)
  ├── GuideSheet         — help panel (FAQ + "Start tutorial" button)
  ├── GuideTutorialOverlay — step-by-step overlay with highlight cutout
  └── guideGuides.ts     — content: steps, quickHelp, autoLaunchOnFirstVisit flag
```

### Trigger mechanism (actual)
1. User taps the `?` button (`GuideTopBarButton`) in the topbar
2. `openHelp()` fires → `GuideSheet` opens
3. User taps "Start tutorial" inside the sheet
4. `startTutorial()` fires → `GuideTutorialOverlay` shows step 0

### How the overlay works
- Each step has an `id` that maps to a DOM element via `data-tour="<id>"`
- The overlay scrolls to the element, highlights it, and shows a tooltip
- **If the `data-tour` element is NOT found**, the step is auto-skipped after 80ms (falls through to `onNext` or `onDone`)
- Progress bar and Back/Next/Skip/Done navigation

### Storage
- Key: `eluna:tours:v1:completed` in localStorage
- Tracks `{ seen, completed, skipped, lastOpenedAt }` per section
- **NOTE:** This storage is written but never read back to gate re-showing tutorials — users can always see tutorials again

---

## 4. Critical Bug: autoLaunchOnFirstVisit Is Never Called

### Finding
`guideGuides.ts` defines `autoLaunchOnFirstVisit: boolean` on 6 of 7 section guides — all set to `true`:

```
home:    autoLaunchOnFirstVisit: true
today:   autoLaunchOnFirstVisit: true
sky:     autoLaunchOnFirstVisit: true
path:    autoLaunchOnFirstVisit: true
journal: autoLaunchOnFirstVisit: true
profile: autoLaunchOnFirstVisit: true
settings: autoLaunchOnFirstVisit: false
```

### Bug
`GuideProvider.tsx` **never reads `autoLaunchOnFirstVisit`**. The auto-launch timer that was presumably there previously was removed. The relevant `useEffect` now only clears a timer:

```ts
// GuideProvider.tsx — current state
useEffect(() => {
  if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
  return () => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
  };
}, [currentSection]);
```

No code path fires `startTutorial()` automatically. **All tutorials are currently user-initiated only.**

### Impact
A new user who just completed onboarding and arrives at `/home` will never see a tutorial unless they manually tap `?` and then tap "Start tutorial" inside the help sheet. Most users will not discover this.

---

## 5. data-tour Target Audit

The tutorial overlay highlights elements via `data-tour` attributes. Steps without a matching DOM element are silently auto-skipped.

### Present in DOM

| data-tour ID | File | Guide step |
|---|---|---|
| `today-moon-card` | `today/page.tsx` + `today/node/page.tsx` | Today step 1 ✅ |
| `today-recommended-actions` | `today/page.tsx` | Today step 2 ✅ |
| `sky-map-main` | `sky/page.tsx` | Sky step 1 ✅ |
| `sky-map-filters` | `sky/page.tsx` | Sky step 2 ✅ |
| `home-today-card` | `home/page.tsx` | Home step 1 ✅ |
| `home-recommendations` | `home/page.tsx` | Home step 4 ✅ |
| `profile-button` | `profile/page.tsx` | Profile step 1 ✅ |

### MISSING from DOM (steps will auto-skip)

| data-tour ID | Defined in guide | Present in DOM | Effect |
|---|---|---|---|
| `home-day-energy` | Home step 2 | ❌ MISSING | Step silently skipped |
| `home-card-today` | Home step 3 | ❌ MISSING | Step silently skipped |
| `path-1` | Path step 1 | ❌ MISSING | Entire tutorial skips instantly |
| `path-2` | Path step 2 | ❌ MISSING | — |
| `path-3` | Path step 3 | ❌ MISSING | — |
| `path-4` | Path step 4 | ❌ MISSING | — |
| `journal-1` | Journal step 1 | ❌ MISSING | Entire tutorial skips instantly |
| `journal-2` | Journal step 2 | ❌ MISSING | — |
| `journal-3` | Journal step 3 | ❌ MISSING | — |
| `settings-1` | Settings step 1 | ❌ MISSING | Entire tutorial skips instantly |
| `settings-2` | Settings step 2 | ❌ MISSING | — |
| `settings-3` | Settings step 3 | ❌ MISSING | — |

**Result:** Home tutorial shows only 2 of 4 steps. Path, Journal, and Settings tutorials complete instantly (all steps auto-skipped), showing no visible content to the user.

---

## 6. Guide Content Accuracy Audit

### Sky Map guide — outdated content

The sky guide quick-help says:
> "What is Astrology in the Sky Map? → It maps your sun sign, moon sign, and birth chart progressively through 8 nodes."

**Current reality:** The Sky Map has 7 nodes (not 8) with IDs: `sun-sign`, `life-path`, `energy-rhythm`, `past-life-signal`, `grounding-practice`, `soulmate-pattern`, `weekly-report`.  
Node labels now: Astrology, Numerology, Human Design, Past Life, Spiritual Practices, Soul Mate, Weekly Soul Report.  
The guide describes "Astrology" as a direction, but the node labelled "Astrology" in the map is actually the **Sun Sign / Astrology** node, not the entire discipline.

The Sky Map guide step text says:
> "This is where your personal directions live."

This is generic and accurate, but misses the new progression model (free/progress/premium unlock types) entirely.

### Home guide — partially outdated

Step 1 (`home-today-card`) text: "Your daily sky reading and emotional focus appear here."  
The card it targets (`data-tour="home-today-card"`) is the **continuation/signal card** with a CTA like "Open today's reading" — not a reading card itself. This is confusing.

Step 2 (`home-day-energy`) is orphaned — targets a "day energy" block that no longer exists on `/home` as a standalone `data-tour` element.

Step 3 (`home-card-today`) is orphaned — the two small action cards ("Today's reading" / "Daily card") have no `data-tour` attribute.

### Today guide — mostly accurate

Steps target `today-moon-card` and `today-recommended-actions` — both present. Content is generic but not wrong.

### Path guide — content is fine, DOM is broken

4 steps with good guidance content (continue from where you stopped, follow next node, reflect, use journal). None have DOM targets. All skip instantly.

### Profile guide — functional but thin

1 step, targets `profile-button` correctly. Only explains "this is where your account and progress live." No explanation of the chart data, progress ring, or subscription status.

### Settings guide — steps skip instantly

3 steps defined, none have DOM targets.

---

## 7. Onboarding Coverage Table

| Section | Has tutorial | Missing tutorial | Tutorial outdated | Tutorial broken | Tutorial never triggers |
|---|---|---|---|---|---|
| **Home** | Partial (2/4 steps show) | Steps 2–3 orphaned | Step 1 text mismatch | Steps 2–3 auto-skip | Auto-launch removed |
| **Sky** | ✅ 2 steps, targets present | No node-level guidance | Quick-help node count wrong | — | Auto-launch removed |
| **Astrology** | ❌ | ✅ Fully missing | — | — | — |
| **Numerology** | ❌ | ✅ Fully missing | — | — | — |
| **Human Design** | ❌ | ✅ Fully missing | — | — | — |
| **Past Life** | ❌ | ✅ Fully missing | — | — | — |
| **Soulmate** | ❌ | ✅ Fully missing | — | — | — |
| **Spiritual Practices** | ❌ | ✅ Fully missing | — | — | — |
| **Practices** | ❌ | ✅ Fully missing | — | — | — |
| **Today** | ✅ 2 steps work | No card/practice guidance | Generic but accurate | — | Auto-launch removed |
| **Path** | Defined but broken | — | Content OK | All 4 steps auto-skip | Auto-launch removed |
| **Journal** | Defined but broken | — | Content OK | All 3 steps auto-skip | Auto-launch removed |
| **Profile** | ✅ 1 step (thin) | Subscription/chart info | — | — | Auto-launch removed |
| **Settings** | Defined but broken | — | Content OK | All 3 steps auto-skip | Auto-launch removed |

---

## 8. Why Tutorials Are Currently Being Skipped — Root Cause Summary

Three independent causes:

1. **`autoLaunchOnFirstVisit` is defined but never consumed.** The `GuideProvider` removed the auto-launch timer. New users never see tutorials unless they manually tap `?` → "Start tutorial". The flag is dead code.

2. **12 of 19 guide step targets have no matching `data-tour` DOM element.** When the overlay finds no target, it auto-advances after 80ms. This silently collapses Path (4 steps), Journal (3 steps), and Settings (3 steps) to instant completion, and removes 2 of 4 Home steps.

3. **No discipline-level tutorials exist at all.** The 6 sky disciplines (Astrology, Numerology, Human Design, Past Life, Spiritual Practices, Soulmate) have no guide section, no `data-tour` attributes, and no tutorial content. Users entering a discipline's node path receive no orientation.

---

## 9. Recommended Onboarding Structure

> **This is a recommendation only. No code changes are included.**

### Principle
Onboarding should happen in context, not all upfront. The user should receive micro-guidance at the moment they encounter each new concept.

---

### Home — first visit
**When:** Immediately after completing the 3-step onboarding and arriving at `/home` for the first time.  
**What the user should learn:**
- The two small cards ("Today's reading", "Daily card") are their daily starting actions
- The continuation card/signal block shows their active reading
- The `?` button opens help anytime
- The bottom nav reaches Sky, Practices, and Profile

**Recommended:** 3-step tutorial auto-launched once on first post-onboarding visit:
1. Target the two action cards → "Start here every day"
2. Target the continuation/signal card → "Your current signal and reading"
3. Target the bottom nav → "Navigate between sections"

---

### Sky Map — first visit
**When:** First time user opens `/sky`.  
**What the user should learn:**
- The 7 orbital nodes represent 7 areas of personal insight
- Free nodes (Astrology, Numerology, Spiritual Practices) are open now
- Premium nodes require a trial or daily progress to unlock
- Tapping a node opens a preview before committing
- The filter tabs (All / Active / Available) narrow the view

**Recommended:** 2–3 step tutorial:
1. Target the map visual → "7 areas of your personal path — each one contains a series of insights"
2. Target a premium node → "Some areas unlock with daily progress or a trial"
3. Target filter tabs → "Filter to see only what's open to you now"

---

### Each discipline (Astrology, Numerology, Human Design, Past Life, Soulmate, Spiritual Practices)
**When:** First time user opens a discipline's node list (e.g. `/sky/astrology`).  
**What the user should learn:**
- What this discipline covers specifically (not generic)
- What a "node" is and how to progress through them
- That completing nodes advances their Sky Map

**Recommended:** 1 inline callout card (not a full overlay tutorial) shown once on first visit, dismissed with a tap. Per discipline:

| Discipline | First-visit message |
|---|---|
| Astrology | "Your Sun sign, Moon sign, and ascendant — revealed progressively as you explore." |
| Numerology | "Your Life Path, personal year, and pattern matrix — start with the number that defines your direction." |
| Human Design | "Your energy type, strategy, and authority — how you're designed to make decisions." |
| Past Life | "Recurring emotional patterns that feel older than this life. Requires trial or 3 daily practices." |
| Soulmate | "Connection patterns and relationship mirrors. Available with trial or Premium." |
| Spiritual Practices | "Short daily rituals — grounding, intention-setting, moon practice." |

---

### Today — first visit
**When:** First time user opens `/today`.  
**What the user should learn:**
- The moon card shows today's emotional theme
- The guided practice is their main daily action
- The daily card (symbol) is a reflective prompt
- Completing the practice advances their Sky Map progress

**Recommended:** Inline banner shown once, auto-dismissed after 5 seconds or on first scroll. Does not block content.

---

### Practices — first visit
**When:** First time user opens `/practices`.  
**What the user should learn:**
- The "Today" tab has their daily actions (affirmation, reflection practice, grounding ritual, daily card)
- The "My" tab shows their saved affirmation set
- The "Library" tab lets them browse and activate affirmations

**Recommended:** 2-step tutorial:
1. Target the tab bar → "Three views — today's actions, your saved set, and the full library"
2. Target the first card → "Complete at least one action daily to keep your streak and open your map"

---

### Profile — first visit
**When:** First time user opens `/profile`.  
**What the user should learn:**
- Their progress ring reflects completed nodes across all disciplines
- Birth data drives their personal readings — can be edited anytime
- Subscription status and plan is visible here

**Recommended:** 1-step tooltip:
1. Target the progress ring → "Each completed node fills this ring. Your full Sky Map progress lives here."

---

## 10. Implementation Priority Recommendations

| Priority | Fix | Effort |
|---|---|---|
| 🔴 Critical | Restore `autoLaunchOnFirstVisit` logic in `GuideProvider` — read the flag and fire `startTutorial()` on first section visit | Small |
| 🔴 Critical | Add missing `data-tour` attributes: `home-day-energy`, `home-card-today` (or remove/rewrite those steps) | Small |
| 🔴 Critical | Fix Path, Journal, Settings tutorials by adding `data-tour` to their key elements | Medium |
| 🟡 High | Rewrite Sky Map quick-help with correct node count (7) and correct node names | Small |
| 🟡 High | Add first-visit inline cards for each discipline entry page | Medium |
| 🟡 High | Add `data-tour` to the two Home action cards and update step text | Small |
| 🟢 Medium | Add Practices section to `SECTION_GUIDES` with content and DOM targets | Medium |
| 🟢 Medium | Expand Profile guide to cover progress ring and subscription status | Small |
| 🟢 Low | Remove `autoLaunchOnFirstVisit: boolean` from the type if auto-launch is intentionally disabled | Trivial |
| 🟢 Low | Wire focus area and practice preference selections from onboarding into personalized home content | Large |

---

## Appendix: File Locations

| File | Role |
|---|---|
| `src/app/onboarding/page.tsx` | 3-step account setup flow |
| `src/app/auth/callback/route.ts` | Auth redirect logic (onboardingCompleted check) |
| `src/components/guide/GuideProvider.tsx` | Tutorial system controller, context provider |
| `src/components/guide/GuideTutorialOverlay.tsx` | Step overlay renderer + data-tour targeting |
| `src/components/guide/GuideSheet.tsx` | Help sheet (FAQ + "Start tutorial" entry) |
| `src/components/guide/GuideTopBarButton.tsx` | `?` button in topbar — only manual trigger |
| `src/components/guide/guideGuides.ts` | All guide content (steps, quickHelp, section config) |
| `src/components/guide/guideAssets.ts` | Tone type definition |
| `src/lib/sky/skyNodes.ts` | Sky Map node definitions (source of truth for labels/status) |
| `src/lib/profile/currentProfile.ts` | `onboardingCompleted` flag read/write |
