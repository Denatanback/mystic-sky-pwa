# eLuna Google Auth Setup

Google OAuth will not work until the provider is enabled in Supabase and the Google OAuth credentials are configured.

## Supabase Google Provider

1. Open Supabase Dashboard -> Authentication -> Providers -> Google.
2. Enable Google.
3. Add the Google Client ID.
4. Add the Google Client Secret.

## Supabase URL Configuration

Set the Site URL:

- `https://www.myeluna.com`

Add these Redirect URLs:

- `https://www.myeluna.com/auth/callback`
- `https://myeluna.com/auth/callback`
- `https://dev.myeluna.com/auth/callback`
- `http://localhost:3000/auth/callback`

## Google Cloud OAuth Client

Authorized JavaScript origins:

- `https://www.myeluna.com`
- `https://myeluna.com`
- `https://dev.myeluna.com`
- `http://localhost:3000`

Authorized redirect URI:

- `https://buvdbnkwcbfhuunubvqm.supabase.co/auth/v1/callback`

## Apple Auth

Apple auth is intentionally hidden for now. Do not show an Apple button in eLuna until Apple Developer setup is complete and the provider is enabled in Supabase.

## App Behavior

- `/login` shows one social auth button: `Continue with Google`.
- `/register` shows one social auth button: `Sign up with Google`.
- OAuth starts with `signInWithOAuth({ provider: "google" })`.
- The app sends users back to `/auth/callback` with a safe internal `returnTo` path.
- The callback rejects external return URLs and falls back to `/home`.
