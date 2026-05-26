# Supabase Setup

This product can run in two modes:

- Supabase mode, when public Supabase env vars are configured.
- Mock mode, when env vars are missing or empty.

The existing `mockAuth` localStorage flow remains as fallback, so the app should continue to work without `.env.local`.

## Environment Variables

Create `.env.local` from `.env.local.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Get real values from:

Supabase Project Settings -> API

Use only the public anon key in frontend code.

Never put a `service_role` key in this project frontend.

## Database Schema

Run this file in Supabase SQL Editor:

```text
supabase/schema.sql
```

It creates:

- `profiles`
- `subscriptions`
- updated_at trigger helper
- RLS policies
- auth user profile creation trigger

## Auth Behavior

When Supabase env vars are present:

- Login uses Supabase email/password auth.
- Register uses Supabase email/password auth.
- Register also creates or updates a row in `profiles`.
- Logout calls Supabase `signOut()`.

When Supabase env vars are absent:

- Login/register/profile continue using `mockAuth`.
- User data remains in browser `localStorage`.

## Subscription Behavior

`subscriptions` is read-only for users.

Users can select their own subscription rows, but cannot insert/update/delete subscription state from the frontend. Real subscription activation must happen in a later backend/webhook/payment provider stage.

Do not store card data in Supabase.

## Next Stage

The next integration stage should add:

- Payment provider checkout.
- Backend/webhook handler.
- Server-side subscription updates with service role.
- Route protection decisions for authenticated-only screens.

