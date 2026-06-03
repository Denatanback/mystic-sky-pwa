# eLuna Social Auth Setup

OAuth will not work until the providers are enabled in Supabase and the provider credentials are added.

## Google

1. Open Supabase Dashboard -> Authentication -> Providers -> Google.
2. Enable Google.
3. Add the Google Client ID and Client Secret.
4. In Google Cloud Console, set the OAuth redirect URL:
   - `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
5. Add allowed app URLs where applicable:
   - `https://www.myeluna.com`
   - `https://myeluna.com`
   - `https://dev.myeluna.com`
   - `http://localhost:3000`

## Apple

1. Open Supabase Dashboard -> Authentication -> Providers -> Apple.
2. Enable Apple.
3. Add the Apple Services ID / Client ID, Team ID, Key ID, and private key as required by the Supabase dashboard.
4. Set the Apple redirect URL:
   - `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
5. Configure web domains:
   - `myeluna.com`
   - `www.myeluna.com`
   - `dev.myeluna.com`

## Supabase URL Configuration

Set the Site URL:

- `https://www.myeluna.com`

Add these Additional Redirect URLs:

- `https://www.myeluna.com/auth/callback`
- `https://myeluna.com/auth/callback`
- `https://dev.myeluna.com/auth/callback`
- `http://localhost:3000/auth/callback`

## Notes

- eLuna starts OAuth from the browser with `signInWithOAuth`.
- The app sends users back to `/auth/callback` with a safe internal `returnTo` path.
- The callback rejects external return URLs and falls back to `/home`.
- No API keys are exposed to the client beyond the standard Supabase public URL and anon key already used by Supabase Auth.
