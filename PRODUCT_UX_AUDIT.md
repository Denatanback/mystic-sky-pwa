# eLuna Product UX/UI Audit

## 1. Critical issues

- Password reset was decorative on login; it now has a real Supabase/mock-safe flow, but the email recovery link flow should still be tested against the production Supabase email template.
- Supabase server helpers previously assumed env values were always present; this can break mock/local development. Middleware and server client creation are now env-gated.
- Registration relied on free-form birth place input only; US-first onboarding now has local city suggestions while preserving manual entry.

## 2. UX issues

- Registration is a solid multi-step flow, but error copy is still terse and mostly field-level. Next pass should add clearer recovery hints for failed account creation and invalid reset links.
- Social login buttons on `/login` look interactive but do not have a connected flow yet.
- Some premium/locked content states explain availability visually, but the upgrade or unlock path is still not always obvious.

## 3. Visual polish

- Typography was inconsistent: buttons and stats used the display serif in several places. The first pass moves product UI toward Manrope and keeps Cormorant Garamond for titles.
- Focus states were browser-default blue in places. A unified gold/lavender focus-visible treatment is now global.
- Inline styles are still widespread, which makes consistent spacing, hover and disabled states harder to maintain.

## 4. Auth/account issues

- Login and register now continue to use the auth adapter, preserving Supabase when configured and mock/localStorage fallback otherwise.
- Forgot password now avoids account enumeration with a generic success message.
- `/reset-password` exists, but production should verify Supabase recovery redirects and update-session behavior end to end.

## 5. Mobile/desktop layout

- Mobile shell is coherent and focused, with a controlled max-width app frame on desktop.
- Auth pages have enough top spacing for the logo, but longer localized copy should be rechecked before RU locale is re-enabled.
- City autocomplete is constrained inside the registration card width and uses a mobile-friendly list height.

## 6. Suggested next steps

- Replace non-functional social buttons or hide them until providers are wired.
- Move repeated inline form/input/card styles into shared product components.
- Add explicit empty/loading/error states for profile data and locked path content.
- Add a small visual QA pass for desktop width, especially `/home`, `/today/node`, and deep sky node pages.
- Add Playwright smoke tests for login mock flow, register mock flow, city autocomplete, and reset-password form.
