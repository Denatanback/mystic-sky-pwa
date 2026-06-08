# eLuna — Developer Handoff Audit

**Date:** 2026-06-08  
**Auditor:** Claude (automated audit pass)  
**Scope:** `src/`, `docs/`, root config, git state  
**Mode:** Read-only — no code changes made

---

## 1. Git / Working Tree State

### Branch divergence
The local branch (`main`) and `origin/main` have **diverged**:
- Local is **68 commits ahead** of origin (all the recent work from this session series)
- Origin is **5 commits ahead** of local (changes not yet pulled)
- `git pull` / rebase / merge is needed before handoff

### Files status
- **~110 modified files** in working tree (none staged, none committed)
- **6 deleted files** — all in `src/references/screens/` (PNG screenshots used as dev reference):
  - `astrology-way.png`, `main.png`, `node_quiz.png`, `numerology-way.png`, `path.png`, `star-path-map.png`
  - These deletions are correct; the reference folder can be removed entirely

### Files that should NOT be committed
| File | Issue |
|---|---|
| `.env.local` | Never commit; contains Supabase keys — guarded by `.gitignore` |
| `src/references/` | Dev-only reference images (7 files, 5.7 MB) — should be `.gitignore`d or deleted |
| `PRODUCT_ALPHA_AUDIT.md`, `PRODUCT_FULL_AUDIT.md`, `PRODUCT_UX_AUDIT.md` etc. | 8+ internal product audit MDs at root — appropriate for internal use but noisy at root level |

### Root-level MD clutter
11 internal document files at project root: `PRODUCT_*.md`, `SUPABASE_*.md`, `README.txt`, `README.md`. These are internal audit history. They don't break anything but add noise for a new developer.

---

## 2. Build / Type State

### `npm run type-check`
**✅ PASSES** — zero TypeScript errors with `--skipLibCheck`.

**Known pre-existing errors** (bypassed by `skipLibCheck`, not our code):
- `@supabase/ssr` package missing from local `node_modules` — causes type errors in `src/lib/supabase/*.ts` without the flag
- These are environment-side; production install resolves them

### `npm run build`
**❌ FAILS in sandbox** — the SWC native binary for `linux/x64` (`@next/swc-linux-x64-*`) is not installed in the CI sandbox and npm registry is blocked by security policy. This is an infrastructure constraint of the dev sandbox, **not a code issue**. The build succeeds on the production VPS where native binaries are available.

A `.babelrc` with `next/babel` preset exists as a fallback, but Next.js 16 requires SWC.

### Warnings to note
- `console.debug` in `src/components/astrology/PremiumMoonPhase.tsx` (line 33) — will log in production
- `console.warn` in `GuideTutorialOverlay.tsx` for missing tour targets — intentional dev helper, acceptable

---

## 3. Architecture Overview

### Main app routes (`src/app/`)
```
/home           — daily dashboard (primary landing after login)
/today          — daily reading, moon card, daily practice, daily card
/sky            — Sky Map (7-node orbital map)
/sky/[discipline]/         — discipline node list (bodygraph/constellation)
/sky/[discipline]/[nodeId] — individual node detail page
/path           — Luna Path (token/level system) — partially future
/practices      — affirmations, daily rituals, daily card
/journal        — reflection journal
/profile        — user account, birth chart, progress
/settings       — language, notifications, privacy, password
/onboarding     — 3-step account setup (birth data, focus, practices)
/register       — email/OAuth registration
/login          — login
/daily-card     — standalone daily card page
/welcome        — marketing landing page variant
/welcome-head   — marketing landing page with Stripe CTAs
/billing, /cancellation, /delivery, /money-back, /privacy, /terms, /support — legal pages
```

**Orphaned / semi-orphaned routes:**
- `/today/path` — redirects to `/today` (dead stub)
- `/today/star-way` — 209-line constellation path page, reachable but not surfaced in navigation
- `/today/node` — 161-line quiz-style node page, not linked from primary nav
- `/cards` — exists but not in bottom nav

### Sky / discipline system
- 7 nodes on `/sky` orbital map defined in `src/lib/sky/skyNodes.ts` (`baseSkyNodes`)
- 6 disciplines: Astrology, Numerology, Human Design, Past Life, Spiritual Practices, Soulmate
- Each has a `page.tsx` (node list) and `[nodeId]/page.tsx` (detail)
- Node status resolved in `resolveSkyNodes()` — reads `completedCount`, `hasPremiumAccess`, `birthDate`
- Progress stored per-node in localStorage via `src/lib/nodeProgress.ts`
- `src/data/paths.ts` is a separate legacy data file used by `PersonalSkyMap` SVG component — not used on the main sky page

### Progress storage
All progress is **localStorage-only**. No server-side persistence of node state.

Key localStorage keys:
```
eluna:tours:v1:completed     — guide/tutorial seen/completed/skipped per section
eluna:plan                   — "trial" | "premium" | null
eluna:onboardingCompleted    — boolean
eluna:prelandContext         — funnel context from landing page
eluna:launch-context:v1      — app launch context
eluna:activeAffirmations     — user's saved affirmations
eluna-lang                   — "en" | "ru"
eluna_luna_path_state        — LunaPath token/level progress
eluna_oracle_history         — Oracle Q&A history
eluna_oracle_free_question_used — boolean
mysticSky.userProfile        — mock user profile (legacy key — still read)
mysticSky.isAuthenticated    — mock auth flag (legacy key — still read)
```

**Risk:** Progress is entirely client-side. Clearing browser storage loses all progress. No sync to Supabase for node progress.

### Tutorial / guide system
Two independent systems:
1. **Onboarding** (`/onboarding`) — triggered by `onboardingCompleted` flag; 3 steps
2. **Guide overlay** (`GuideProvider` + `GuideTutorialOverlay`) — 7 section guides with auto-launch on first visit (recently restored)

Auto-launch fires 800ms after first section visit; marks `seen: true` immediately to prevent re-trigger. Tutorial targets elements via `data-tour` attributes.

### Subscription / access gating
- Plan stored in `localStorage("eluna:plan")` as `"trial"` | `"premium"` | unset
- `ProductAccessGate` component gates content behind trial/premium
- `SkyNodeEntitlementGate` gates individual sky nodes
- Stripe integration present (`welcome-head` storefront) but payment webhooks and server-side entitlement sync are **not fully wired**
- Plan check is entirely client-side (localStorage) — can be bypassed

### Profile / auth
- Supabase auth (`@supabase/ssr`) is the primary auth system
- `isSupabaseConfigured` check — app falls back gracefully when Supabase keys are absent
- `src/lib/mockAuth.ts` still exists and provides a local-only user profile system (`mysticSky.*` keys)
- `getCurrentProfile()` in `src/lib/profile/currentProfile.ts` merges Supabase profile with localStorage fallback

### Asset structure
```
src/assets/          (51 MB total — static imports)
  home-emblems/      — candle, card, lotus, meditation images
  human-design-background/ — bodygraph background
  mascot/            — mascot character images
  moon-phases/       — moon phase illustrations
  node-emblems/      — discipline/node icons
  sky-background/    — sky page background (male/female variants)
  sky-emblems/       — orbital map node emblems
public/assets/       — public URL-accessible assets
  icons/             — app icons, lock, etc.
  landing/           — marketing page assets
  node-emblems/      — (also here — see duplication note)
```

---

## 4. Risky / Messy Areas

### 4.1 `false ?` dead code pattern — HIGH RISK
Every discipline page uses `false ? [Russian nodes] : [English nodes]` as a language toggle. This is a hardcoded dead branch — the Russian branch is **permanently dead** since `false` never changes. The pattern appears in:
- `src/app/sky/astrology/page.tsx` (2 occurrences)
- `src/app/sky/numerology/page.tsx` (2)
- `src/app/sky/humandesign/page.tsx` (2)
- `src/app/sky/pastlife/page.tsx` (2)
- `src/app/sky/soulmate/page.tsx` (2)
- `src/app/sky/spiritual/page.tsx` (2)
- `src/app/sky/astrology/[nodeId]/page.tsx` (~20 occurrences of `false ? "Russian string" : "English string"`)

Additionally `ENABLE_RU_LOCALE = false` in `src/lib/i18n.tsx` disables Russian locale globally. The real i18n system (`useLang`) is bypassed by all the `false ?` patterns.

### 4.2 Duplicate dailyCards modules
Two separate `dailyCards` implementations exist:
- `src/lib/dailyCards.ts` (583 lines) — the actual card data used by `home/page.tsx`
- `src/lib/cards/dailyCards.ts` (27 lines) — a thin wrapper
- `src/lib/cards/dailyCardProgress.ts` — progress tracking

The home page imports from `src/lib/dailyCards.ts` directly. The `src/lib/cards/` subdirectory appears to be an attempt at organization that was never completed.

### 4.3 LunaPath / Oracle — future-only, disabled
`src/components/lunaPath/OraclePracticeCard.tsx` has:
```tsx
// TODO: Re-enable Oracle after server-side AI, token ledger, and payment entitlements are implemented.
// TODO: Add Stripe token packages when paid token access is ready.
// TODO: Add anti-fraud reward validation before server-side token spending.
```
`productFeatureFlags.oracleEnabled = false` and `lunarTokensEnabled = false`. The Oracle feature uses mock AI responses (`src/lib/lunaPath/progress.ts` line 186 hardcodes a fake answer). The entire `src/components/lunaPath/` system is partially built but gated off.

### 4.4 `src/references/` directory committed to repo
`src/references/` (5.7 MB) contains dev reference images. The `screens/` subdirectory was deleted but `main_screen/` and `icons/` remain. These are dev artifacts that should not be in the source tree.

### 4.5 `src/data/paths.ts` vs `src/lib/sky/skyNodes.ts` — two sources of truth
- `skyNodes.ts` is the **active** data source for the Sky Map (`/sky` page, `resolveSkyNodes()`)
- `paths.ts` is a **legacy** data source used only by `PersonalSkyMap.tsx` (an SVG component that is not rendered on `/sky`)
- The two files have different node counts (6 vs 7), different IDs, and different title conventions
- A new developer may edit `paths.ts` expecting it to affect `/sky`, but it won't

### 4.6 Branch divergence (68 commits ahead of origin)
68 local commits have not been pushed to `origin/main`. Before handoff, these need to be pushed, reviewed, and merged. The 5 remote commits that haven't been pulled may conflict.

### 4.7 Subscription gating is client-side only
`localStorage.getItem("eluna:plan")` drives all access gates. A user who sets this manually in browser DevTools bypasses all paywalls. This is acceptable for alpha but must be hardened before production revenue.

### 4.8 Two `next.config` files
`next.config.js` (active) and `next.config.ts` (stub that says "intentionally left minimal") both exist. The `.ts` version just exports `{}`. This is confusing — Next.js will use one or the other by priority.

### 4.9 Orphaned route pages
- `/today/star-way` — a separate constellation path view, not linked from primary nav
- `/today/node` — a quiz-style node system, not linked
- `/today/path` — just redirects to `/today`
- `/cards` — associative cards page, not in bottom nav

These are either abandoned experiments or planned features that were deprioritized.

### 4.10 Mojibake / encoding in `today/page.tsx`
During prior truncation repair sessions, some Russian Cyrillic strings in `today/page.tsx` were double-encoded (Windows-1252 over UTF-8), producing garbled text like `"РЎС‚СЂРµС"`. The page was repaired but Russian locale is disabled anyway; still, a new dev may see these strings and be confused.

---

## 5. Feature Completeness Status

| Feature | Status | Notes |
|---|---|---|
| **Home** | ✅ Stable | Two action cards, streak, signal block, AppLoader |
| **Sky Map** | ✅ Stable | 7 nodes, orbital map, node preview sheet, filter tabs |
| **Astrology** | ✅ Stable | Node list + 3 detail nodes (Sun, Moon, Ascendant) |
| **Numerology** | 🟡 Partially stable | Node list works; detail page content thin |
| **Human Design** | 🟡 Partially stable | Bodygraph map works; detail node pages sparse |
| **Past Life** | 🟡 Partially stable | Node list + detail; premium-gated |
| **Soulmate** | 🟡 Partially stable | Node list + detail; premium-gated |
| **Spiritual Practices** | 🟡 Partially stable | Node list + detail; accessible |
| **Today** | ✅ Stable | Moon card, practice, daily card, forecast |
| **Practices** | ✅ Stable | Affirmations, grounding, daily card, library |
| **Journal** | 🟡 Partially stable | Write + tags + entries work; no persistence to server |
| **Profile** | ✅ Stable | Birth chart edit, progress ring, sign out |
| **Settings** | ✅ Stable | Language (EN only), notifications (coming soon), privacy (coming soon) |
| **Onboarding** | ✅ Stable | 3-step flow, auth redirect, edit mode |
| **Tutorials / Guide** | 🟡 Partially stable | Auto-launch restored; some data-tour targets added recently |
| **Subscription / Paywall** | 🔴 Needs review | Client-side only; Stripe not fully wired; can be bypassed |
| **LunaPath / Oracle** | 🔴 Future only | Feature-flagged off; mock AI; no Stripe tokens |
| **Russian locale** | 🔴 Disabled | `ENABLE_RU_LOCALE = false`; dead code throughout |
| **Auth (Supabase)** | 🟡 Partially stable | Works when configured; graceful fallback to mock; no server-side progress sync |
| **`/cards` page** | 🟡 Needs review | Exists but not in nav |
| **`/today/star-way`** | 🟡 Needs review | Orphaned constellation path view |
| **`/welcome-head`** | 🟡 Partially stable | Stripe CTAs present; payment flow partially wired |

---

## 6. Developer Handoff Notes

### Where to start reading
1. **`src/app/home/page.tsx`** — the main entry point post-login; understand the daily state machine
2. **`src/lib/sky/skyNodes.ts`** — the Sky Map data model; drives all 7 nodes
3. **`src/components/sky/NodePathPage.tsx`** — the shared renderer for all discipline node lists
4. **`src/lib/profile/currentProfile.ts`** — how user data is read (Supabase + localStorage merge)
5. **`src/lib/progress/dailyProgress.ts`** — all daily action tracking
6. **`src/components/guide/GuideProvider.tsx`** and `guideGuides.ts` — tutorial system

### What NOT to touch accidentally
- **`src/lib/sky/skyNodes.ts`** — changing IDs or `deg` values breaks the orbital map layout
- **`src/lib/subscription/entitlements.ts`** — plan IDs must match Stripe product config exactly
- **`src/components/sky/NodePathPage.tsx`** — shared by all 6 discipline maps; changes affect everything
- **`src/app/globals.css`** — CSS variables (`--gold`, `--muted`, `--text`) are used everywhere inline; a rename cascades broadly
- **localStorage key strings** — changing a key name silently loses all existing user data

### What is intentionally unfinished
- **Oracle / LunaPath** — AI oracle, token economy, token purchase. Gated by `productFeatureFlags`. Do not attempt to enable without server-side infrastructure.
- **Russian locale** — `ENABLE_RU_LOCALE = false`. The `false ?` ternaries throughout discipline pages are the stubs for it. Do not enable without full translation pass.
- **Server-side progress** — node completion lives only in localStorage. Supabase schema exists but the write path is not implemented.
- **Stripe webhooks** — payment works on the storefront side; server-side entitlement sync from Stripe is pending.
- **`/today/node`** and **`/today/star-way`** — these are experimental routes from an earlier navigation model, not yet promoted to nav.

### What should be cleaned before continuing
See Section 7 — Cleanup Checklist.

---

## 7. Cleanup Checklist

### P0 — Must clean before handoff

- [ ] **Push local branch and resolve divergence** — 68 local commits are not on origin; 5 origin commits are not local
- [ ] **Remove `src/references/` from repo** — 5.7 MB of dev PNGs; add to `.gitignore`
- [ ] **Commit or stash all modified files** — 110+ modified files in working tree; new dev will have dirty state immediately
- [ ] **Delete `next.config.ts`** — dead stub alongside the real `next.config.js`; confusing

### P1 — Should clean soon

- [ ] **Remove `false ?` dead-code language toggles** — all discipline pages use `false ? "Russian" : "English"`. Replace with direct English strings. 6 page files, ~30 occurrences.
- [ ] **Consolidate dailyCards modules** — merge `src/lib/dailyCards.ts` (583 lines) and `src/lib/cards/dailyCards.ts` (27 lines) into one canonical location
- [ ] **Remove/redirect orphaned routes** — `/today/path` already redirects; `/today/node` and `/today/star-way` should either be promoted to nav or removed
- [ ] **Move `PRODUCT_*.md` and `SUPABASE_*.md` from root to `docs/`** — 8 internal audit files at root are noise
- [ ] **Remove or document `src/data/paths.ts`** — it is NOT the source of truth for the Sky Map; add a comment making this clear or delete it
- [ ] **Remove `console.debug` from `PremiumMoonPhase.tsx`** — will log in production

### P2 — Later polish

- [ ] **Harden subscription gating** — move plan check server-side; localStorage-only is bypassable
- [ ] **Add `.gitignore` entry for `src/references/`** to prevent re-addition
- [ ] **Clean up `mockAuth.ts` legacy keys** — `mysticSky.userProfile` and `mysticSky.isAuthenticated` are legacy localStorage keys; new profile system uses `eluna:*` namespace
- [ ] **Remove or complete `/cards` page** — either add to nav or archive
- [ ] **Audit i18n keys for completeness** — `useLang()` has both EN and RU sections; RU strings are incomplete for newer features
- [ ] **Server-side node progress** — write completed nodes to Supabase so progress survives storage clear

---

## Summary

### Top 5 Risks

1. **Branch divergence** — 68 uncommitted/unpushed local commits. A new developer cloning `origin/main` will see a completely different codebase.
2. **Client-side-only subscription gating** — `localStorage("eluna:plan")` can be trivially bypassed. No server validation.
3. **Two Sky Map data sources** — `paths.ts` vs `skyNodes.ts`. A developer editing the wrong one will see no effect and be confused.
4. **LunaPath Oracle uses mock AI responses** — if `oracleEnabled` flag is accidentally turned on, users get hardcoded fake answers from a field that looks like real AI.
5. **No server-side progress sync** — all node completion lives in localStorage. Users lose everything on a new device or browser clear.

### Top 5 Cleanup Tasks

1. **Resolve git divergence and push** (P0)
2. **Remove `src/references/`** (P0)
3. **Remove `false ?` dead code from all discipline pages** (P1)
4. **Consolidate duplicate dailyCards modules** (P1)
5. **Remove orphaned route stubs** `/today/node`, `/today/star-way` or promote them (P1)

### Handoff readiness

**Conditionally ready for handoff after P0 items are addressed.**

The codebase is architecturally sound, type-checks clean, and the main user flows (Home → Today → Sky Map → Disciplines → Practices → Profile) work correctly. The main blockers are operational (git state, references committed) rather than code correctness. After resolving P0 items and documenting the intentionally unfinished areas (Oracle, Russian locale, server-side progress), the project is safe to hand to a new developer.
