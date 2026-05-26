# Product Baseline Fix Report

Project:
`/Users/mishaeremin/Desktop/eLuna_product`

Scope:
Technical stabilization only. Supabase was not connected. Product UI, mock auth behavior, payment logic, and preland projects were not intentionally changed.

## Errors Found

### Missing Playwright dependency

`npm run type-check` and `npm run build` failed because the project imports `@playwright/test` in:

- `playwright.config.ts`
- `tests/visual/today.spec.ts`

The lockfile already referenced Playwright, and the project contains a real visual test, so this was treated as an active test dependency rather than dead code.

### Broken lint script

`npm run lint` used:

```bash
next lint
```

With the current Next.js 16 setup this failed as:

```text
Invalid project directory provided, no such directory: /Users/mishaeremin/Desktop/eLuna_product/lint
```

### ESLint baseline errors

After switching to a working ESLint command, lint found:

- `react-hooks/set-state-in-effect` in `src/app/home/HomeGreeting.tsx`
- `react-hooks/set-state-in-effect` in `src/app/profile/page.tsx`
- unused `STEPS` in `src/app/register/page.tsx`
- unused `answers` state value in `src/app/today/node/page.tsx`

## What Was Fixed

### Playwright

Added `@playwright/test` as a dev dependency so existing Playwright config and tests can type-check.

### Lint

Changed lint script to:

```bash
eslint .
```

Added flat ESLint config:

```text
eslint.config.mjs
```

The config uses:

- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- standard ignores for `.next`, `node_modules`, `out`, `dist`, and `next-env.d.ts`

### React lint issues

Kept existing mockAuth behavior and UI, but changed synchronous effect state updates to microtasks:

- `src/app/home/HomeGreeting.tsx`
- `src/app/profile/page.tsx`

Removed/adjusted unused values:

- Removed unused `STEPS` constant in `src/app/register/page.tsx`
- Kept answer collection state setter in `src/app/today/node/page.tsx`, but removed the unused state value binding

## Files Changed

- `package.json`
- `package-lock.json`
- `eslint.config.mjs`
- `src/app/home/HomeGreeting.tsx`
- `src/app/profile/page.tsx`
- `src/app/register/page.tsx`
- `src/app/today/node/page.tsx`
- `SUPABASE_INTEGRATION_AUDIT.md`
- `PRODUCT_BASELINE_FIX_REPORT.md`

## Commands Run

```bash
npm install
npm run type-check
npm run lint
npm run build
npm audit --audit-level=moderate
npm run dev -- --hostname 127.0.0.1
curl -I http://127.0.0.1:3000/welcome
```

## Verification Results

### npm install

Status: successful.

Output notes:

- 368 packages audited.
- 2 moderate vulnerabilities remain.

### npm run type-check

Status: successful.

### npm run lint

Status: successful.

### npm run build

Status: successful.

Build notes:

- Next.js compiled successfully.
- TypeScript completed successfully.
- Static pages generated successfully.
- Warning remains: custom Babel config exists and Next says it can likely be removed. This was not changed because it is not blocking baseline stability.

### npm run dev

Status: successful.

Dev server started on:

```text
http://127.0.0.1:3000
```

Smoke check:

```bash
curl -I http://127.0.0.1:3000/welcome
```

returned:

```text
HTTP/1.1 200 OK
```

## Remaining Warnings / Vulnerabilities

`npm audit --audit-level=moderate` reports:

- `postcss <8.5.10`
- Source: transitive dependency under `next`
- Advisory: `GHSA-qx2v-qp2m-jg93`
- npm says the available fix requires `npm audit fix --force` and would install `next@9.3.3`, which is a breaking downgrade.

Decision:
No aggressive audit fix was applied. This should be handled by upgrading Next.js only when a compatible patched Next release is available, not by `--force`.

## Ready For Supabase Integration?

Yes, the product is now technically ready for the next Supabase integration step.

Recommended next step:

1. Create a new branch for Supabase work.
2. Add `.env.example`.
3. Add optional Supabase client with env fallback.
4. Add auth adapter over current `mockAuth`.
5. Keep mockAuth working when Supabase env vars are absent.

