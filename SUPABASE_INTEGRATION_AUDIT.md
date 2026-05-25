# Supabase Integration Audit — eLuna Product

Audit target:
`/Users/mishaeremin/Desktop/eLuna_product`

GitHub source:
`https://github.com/Denatanback/mystic-sky-pwa`

Important boundary:
This audit is for the main product only. The preland projects `eLuna` and `eLuna_past_life` must remain separate frontend-only funnels and must not receive Supabase integration.

## 1. Project Structure

### Stack

- Framework: Next.js 16.2.6
- Routing: Next.js App Router in `src/app`
- UI: React 19.2.6
- Language: TypeScript
- Styling: global CSS, Tailwind config present, inline component styles, design tokens in `src/styles/design-tokens.css`
- PWA: manifest in `src/app/manifest.ts`, icons in `public/icons`
- Tests: Playwright config and `tests/visual/today.spec.ts`

### Key files

- `src/app/layout.tsx`: root layout, global fonts, metadata, viewport.
- `src/app/page.tsx`: redirects `/` to `/welcome`.
- `src/app/welcome/page.tsx`: product welcome/onboarding entry.
- `src/app/login/page.tsx`: current login page using mock auth.
- `src/app/register/page.tsx`: current 4-step registration/onboarding using mock auth.
- `src/app/home/page.tsx`: main home/dashboard.
- `src/app/profile/page.tsx`: profile screen and logout.
- `src/lib/mockAuth.ts`: localStorage-based mock auth/profile storage.
- `src/lib/routes.ts`: bottom navigation routes.
- `src/data/user.ts`: static mock user/subscription copy.
- `src/lib/types.ts`: product domain types, including `UserProfile` and subscription label.

### App Router pages found

- `/welcome`
- `/login`
- `/register`
- `/home`
- `/profile`
- `/journal`
- `/sky`
- `/today`
- `/today/path`
- `/today/star-way`
- `/today/node`
- `/cards`

## 2. Current User Flow

Current flow:

1. `/` redirects to `/welcome`.
2. `/welcome` shows the Eluna product intro with CTA to `/register` and `/login`.
3. `/register` is a 4-step onboarding:
   - Account: name, email, password.
   - Birth data: birth date, birth time, birth place.
   - Interests/directions.
   - Start.
4. Registration calls `saveMockUser(...)`, `setMockAuthenticated()`, then routes to `/home`.
5. `/login` accepts email/password visually, but does not verify password against a backend. It creates or updates a mock user and routes to `/home`.
6. `/home` is the main dashboard with daily content, recommendations, profile link, and bottom nav.
7. `/profile` reads the mock user from localStorage and supports logout through `clearMockAuth()`, then routes to `/welcome`.

Important observation:
There is no real auth guard around `/home`, `/today`, `/profile`, etc. A user can open app pages directly even without mock auth. Supabase integration should not be added only to login/register; route protection strategy must be decided.

## 3. Current Auth Status

Auth exists only as a mock localStorage layer.

File:
`src/lib/mockAuth.ts`

Current localStorage keys:

- `mysticSky.userProfile`
- `mysticSky.isAuthenticated`

Functions:

- `saveMockUser(profile)`
- `getMockUser()`
- `setMockAuthenticated()`
- `isMockAuthenticated()`
- `clearMockAuth()`
- `setMockUser({ name, email })`

Where it is used:

- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/app/profile/page.tsx`
- `src/app/home/HomeGreeting.tsx`
- `src/components/auth/AuthForm.tsx`

Current limitations:

- Password is not verified.
- There is no server session.
- There is no persistent user ID.
- There is no auth middleware.
- There is no distinction between anonymous, logged-in, trial, and subscribed users.
- Existing app pages are not protected.

Recommended principle:
Keep `mockAuth` as fallback while Supabase env vars are absent. Add Supabase as a separate auth adapter instead of rewriting all screens in one step.

## 4. Payment / Subscription Logic Status

There is no real payment provider integration.

Found references:

- `src/lib/types.ts` has `subscriptionLabel`.
- `src/data/user.ts` has static label: `Mystic Plus активен`.
- `src/sky/page.tsx` marks some nodes as `premium: true` and `locked: true`.
- No Stripe, Paddle, payment API, checkout session, card form, webhook, or subscription table exists.

Current subscription/paywall is UI/static only.

Important:
Do not store card data in Supabase. If payment is added later, store only provider-safe metadata such as provider customer ID, subscription status, product/price ID, renewal dates, and webhook event IDs.

## 5. Backend / API / Storage Status

No backend API routes were found in `src/app/api`.

No current external storage was found.

No `.env`, `.env.local`, or `.env.example` files were found.

Current persisted state is browser-only:

- mock auth profile in localStorage.

Static product data lives in:

- `src/data/user.ts`
- `src/data/journal.ts`
- `src/data/magicCards.ts`
- `src/data/paths.ts`
- `src/data/today.ts`

## 6. Best Place To Connect Supabase Client

Recommended files for a first safe integration:

### Client-only Supabase browser client

Create later:
`src/lib/supabase/client.ts`

Purpose:

- Read `NEXT_PUBLIC_SUPABASE_URL`.
- Read `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Return a Supabase client only when both env vars are present.
- Return `null` or disabled state when env vars are missing.

This keeps local mock flow working in development and for design review.

### Auth adapter layer

Create later:
`src/lib/auth/authClient.ts`

Purpose:

- Hide whether current auth is Supabase or mock.
- Export functions such as:
  - `isSupabaseEnabled()`
  - `signIn(email, password)`
  - `signUp(profile, password)`
  - `signOut()`
  - `getCurrentUser()`
  - `getCurrentProfile()`

This prevents Supabase-specific logic from spreading across every page.

### Route protection

Decision needed before implementation:

- Client-side redirect in page components, or
- Next middleware/server session route protection.

Because the project currently has client-heavy pages and no server auth, a safe first step is client-side protection only, then later migrate to middleware with server session support if needed.

## 7. Env Variables Needed

Add later in `.env.example` only:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not add:

```bash
SUPABASE_SERVICE_ROLE_KEY
```

The service role key must never be exposed to frontend code.

Possible future payment vars, not part of first Supabase auth pass:

```bash
NEXT_PUBLIC_APP_URL=
PAYMENT_PROVIDER_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=
```

Payment secret vars must stay server-side only.

## 8. Supabase Tables Likely Needed

Recommended first-pass tables:

### `profiles`

Purpose:
Canonical user profile linked to `auth.users`.

Fields:

- `id uuid primary key references auth.users(id)`
- `email text`
- `display_name text`
- `birth_date date`
- `birth_time text`
- `birth_time_unknown boolean default false`
- `birth_place text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Why:
Current registration collects name, email, birth date, birth time, birth place.

### `user_preferences`

Purpose:
Store registration step interests/directions and app preferences.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id)`
- `directions text[] default '{}'`
- `language text default 'ru'`
- `notifications_enabled boolean default false`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Why:
`/register` collects selected directions such as astrology, soulmate, practices, cards.

### `journal_entries`

Purpose:
Replace or supplement `src/data/journal.ts` with real user-owned entries.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id)`
- `type text not null`
- `title text not null`
- `description text`
- `content text`
- `metadata jsonb default '{}'`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### `user_progress`

Purpose:
Persist progress through sky paths, nodes, cards, streaks, and app habits.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id)`
- `path_id text`
- `node_id text`
- `status text default 'started'`
- `progress jsonb default '{}'`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### `subscription_status`

Purpose:
Store safe subscription state, not card data.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id)`
- `status text not null`
- `plan text`
- `provider text`
- `provider_customer_id text`
- `provider_subscription_id text`
- `current_period_end timestamptz`
- `cancel_at_period_end boolean default false`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Important:
Do not store card number, CVC, expiration date, or raw payment method data.

### `preland_attribution`

Purpose:
Receive attribution/query params from frontend-only prelands when user enters the product.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid nullable references auth.users(id)`
- `anonymous_id text`
- `funnel text`
- `source text`
- `email text`
- `utm_source text`
- `utm_medium text`
- `utm_campaign text`
- `utm_content text`
- `utm_term text`
- `created_at timestamptz default now()`

Why:
Prelands should remain frontend-only but can pass:
`funnel=past_life&source=preland&email=&utm_source=&utm_campaign=&utm_content=&utm_term=`

## 9. Safe First-Stage Integration

Can be connected safely first:

1. Add `@supabase/supabase-js`.
2. Add `.env.example` with public Supabase env names only.
3. Add `src/lib/supabase/client.ts` returning `null` when env is absent.
4. Add auth adapter that keeps mockAuth fallback.
5. Update `/login` and `/register` to use adapter, not direct Supabase calls in page code.
6. On Supabase signup, create `profiles` record.
7. On logout, call Supabase signOut when enabled, otherwise `clearMockAuth()`.
8. Keep all existing visual/UI structure.

Do not yet migrate:

- Journal persistence.
- Progress persistence.
- Subscription state.
- Route protection middleware.
- Payment provider integration.
- Storage uploads.

## 10. What Not To Touch Without Clarification

Do not change without product decision:

- Existing preland projects and archives.
- Current visual design / mobile canvas layout.
- Current Russian product copy.
- Locked/premium path behavior in `/sky`.
- Any payment/subscription claims.
- Any card/payment data handling.
- Whether app pages should be hard-protected or allow anonymous preview.
- Whether registration requires email confirmation before app access.
- Whether social login buttons should become real OAuth providers.
- Whether birth time/place should be required in production.

## 11. Supabase Integration Plan

### Phase 1 — Non-breaking foundation

Files likely affected:

- `package.json`
- `package-lock.json`
- `.env.example`
- `src/lib/supabase/client.ts`
- `src/lib/auth/authClient.ts`
- `README.md`

Actions:

- Install `@supabase/supabase-js`.
- Add public env example.
- Add optional Supabase client.
- Add auth adapter with mock fallback.
- Do not change app UI yet.

Expected risk:
Low, if adapter returns mock behavior when env is absent.

### Phase 2 — Login/register integration

Files likely affected:

- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/app/profile/page.tsx`
- `src/app/home/HomeGreeting.tsx`

Actions:

- Replace direct `mockAuth` calls with auth adapter calls.
- On Supabase signup:
  - `supabase.auth.signUp({ email, password })`
  - create/update `profiles`
  - create/update `user_preferences`
- On login:
  - `supabase.auth.signInWithPassword({ email, password })`
- On logout:
  - Supabase `signOut()` or mock fallback.

Expected risk:
Medium, because current login/register are fully client-side and may need error/loading UI states.

### Phase 3 — Profile and app session

Files likely affected:

- `src/app/profile/page.tsx`
- `src/app/home/HomeGreeting.tsx`
- optional `src/lib/auth/useCurrentUser.ts`

Actions:

- Read profile from Supabase when enabled.
- Fallback to mock profile when Supabase is disabled.
- Decide whether to require auth for app routes.

Expected risk:
Medium.

### Phase 4 — Product data persistence

Files likely affected:

- journal screens
- today/path/node screens
- `src/data/*` migration strategy

Actions:

- Persist journal entries.
- Persist node/path progress.
- Persist selected directions.
- Keep static data as content seed/config where appropriate.

Expected risk:
Medium to high because product behavior becomes stateful.

### Phase 5 — Subscription status

Files likely affected:

- `/sky` locked premium nodes
- profile subscription label
- future paywall/checkout routes

Actions:

- Add `subscription_status`.
- Gate premium features by subscription status.
- Integrate payment provider only through server-side APIs/webhooks.

Expected risk:
High. Requires payment provider architecture and legal/billing copy review.

## 12. Build / Commands

Commands run during audit:

```bash
npm install
npm run type-check
npm run lint
npm run build
npm run dev -- --hostname 127.0.0.1
curl -I http://127.0.0.1:3000/welcome
```

Actual results:

- `npm install`: completed successfully, but reported 2 moderate vulnerabilities via `npm audit`. The automatic `package-lock.json` churn caused by install was reverted because this audit should not change product code/dependencies.
- `npm run type-check`: failed because `@playwright/test` is imported by `playwright.config.ts` and `tests/visual/today.spec.ts`, but is not present in `package.json` dependencies/devDependencies.
- `npm run lint`: failed because the script is `next lint`, and with the current Next.js 16 setup it is interpreted as an invalid project directory `/Users/mishaeremin/Desktop/eLuna_product/lint`.
- `npm run build`: compiled successfully, then failed during TypeScript checking for the same missing `@playwright/test` dependency.
- `npm run dev -- --hostname 127.0.0.1`: started successfully on `http://127.0.0.1:3000`.
- `curl -I http://127.0.0.1:3000/welcome`: returned `HTTP/1.1 200 OK`.

Build status:

The production build is not currently successful because TypeScript cannot resolve `@playwright/test`.

Recommended pre-Supabase maintenance fix:

1. Add `@playwright/test` to `devDependencies`, or exclude Playwright config/tests from app type-check.
2. Replace `next lint` with an ESLint command compatible with the current Next.js version, for example an explicit `eslint` script after confirming the intended lint config.
3. Re-run `npm run type-check`, `npm run lint`, and `npm run build` before starting Supabase integration.

Notes:

- Build may require network for Google fonts during Next build, depending on local cache and environment.
