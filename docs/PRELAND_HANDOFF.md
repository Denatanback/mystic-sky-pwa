# Preland → App Handoff Notes

**Context:** The payment architecture has changed. Prelands no longer initiate or confirm payment directly. The app is the only place that creates Stripe checkout sessions and grants access.

---

## What Prelands Must Do

### 1. Remove preland Stripe checkout
Delete any Stripe checkout integration from preland pages. Prelands must not create checkout sessions, activate subscriptions, or grant app access.

### 2. Remove direct app access after quiz
After the quiz, do not redirect users to any deep app route that assumes access (e.g. `/sky/pastlife`). Always send them through registration first.

### 3. Keep the wheel / discount as an offer marker only
The "spin the wheel" or discount reveal is a visual hook. It sets the `offer=intro_3_day` URL parameter when sending users to the app, but does **not** activate any access or checkout. The discount offer is shown inside the app paywall.

### 4. Send users to app registration with claim params

After the quiz, redirect to:

```
https://app.myeluna.com/register?claimType=<TYPE>&role=<ROLE>&funnel=<FUNNEL>&offer=intro_3_day&claimId=<UUID>
```

Or for soulmate funnels:
```
https://app.myeluna.com/register?claimType=soulmate_type&soulmateType=<TYPE>&funnel=soulmatev&offer=intro_3_day&claimId=<UUID>
```

#### Supported claim types and required params

| Funnel     | claimType        | Result param              | funnel value           |
|-----------|-----------------|--------------------------|----------------------|
| Past Life  | `past_life_role` | `role=healer` (or other) | `funnel=pastlife`    |
| Soulmate V | `soulmate_type`  | `soulmateType=protector` | `funnel=soulmatev`   |
| Soulmate W | `soulmate_type`  | `soulmateType=protector` | `funnel=soulmatew`   |

#### Valid role values (past_life_role)
`healer`, `warrior`, `priestess`, `priest`, `scientist`, `artist`, `explorer`, `teacher`, `ruler`

#### Valid soulmateType values
`protector`, `adventurer`, `mystic`, `creator`, `intellectual`, `healer`

---

## Optional UTM / tracking params

Append these to the registration URL if available:

```
&utm_source=facebook&utm_campaign=pastlife_v3&subid=<SUBID>&click_id=<CLICK_ID>
```

The app passes these through to Stripe checkout metadata and stores them on the subscription record for attribution.

---

## What happens on the app side (no preland action needed)

1. User lands on `/register` — claim params are parsed from URL and saved to localStorage
2. User registers or logs in
3. Claim is persisted to Supabase `pending_claims` table
4. After onboarding, app detects pending claim + no active access → shows in-app paywall automatically
5. User picks a plan → Stripe checkout (created server-side)
6. Webhook confirms payment → access is activated
7. User is redirected to the correct discipline (`/sky/pastlife` or `/sky/soulmate`)
8. Node 1 is completed with the claim result; user does not retake the quiz

---

## What prelands must NOT do

- ❌ Create Stripe checkout sessions
- ❌ Redirect to app with `session_id` or payment tokens
- ❌ Redirect directly to discipline pages (`/sky/pastlife`, `/sky/soulmate`)
- ❌ Set any cookies or localStorage values that activate paid access in the app
- ❌ Show "your access is active" copy before the user has paid

---

## Testing the handoff

Use this URL to test the full flow locally or in staging:

```
/register?claimType=past_life_role&role=healer&funnel=pastlife&offer=intro_3_day&claimId=test-claim-001
```

Expected behavior:
1. Register page shows "Quiz result saved" UI element
2. After registration + onboarding → home page shows paywall automatically
3. After paying → /checkout/success polls until active → redirects to /sky/pastlife
4. /sky/pastlife/1 node is already completed with role=healer
