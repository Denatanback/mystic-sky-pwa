# Preland Claim Level 1 Flow

## 1. Overview

Funnel-origin users may complete a quiz before payment. After payment and first app open, the app must treat that preland result as the official Level 1 result for the matching Sky discipline.

The user experience should feel like:

> My paid result is ready.

It must not feel like:

> I need to take the same quiz again.

The claimed result must do more than display a card. It must update app progress so all existing restoration, Sky overview, discipline map, and unlock logic behave as if the user completed Level 1 inside the app.

## 2. Supported Funnel Types

Initial supported funnel types:

| Funnel type | Discipline | Node | App result |
|---|---:|---:|---|
| `past_life_role` | `pastlife` | `1` | Past Life Role |
| `soulmate_type` | `soulmate` | `1` | Soulmate Type |

Future funnel types:

| Funnel type | Discipline | Node | App result |
|---|---:|---:|---|
| `cosmic_archetype` | `astrology` | `1` | Cosmic Archetype |
| `destiny_code` | `numerology` | `1` | Destiny Code |
| `energy_type` | `humandesign` | `1` | Energy Type |
| `spiritual_path` | `spiritual` | `1` | Spiritual Path |

## 3. Claim Payload Mapping

### `past_life_role`

| Field | Value |
|---|---|
| Funnel type | `past_life_role` |
| Discipline | `pastlife` |
| Node id | `1` |
| Route | `/sky/pastlife/1` |
| Result screen | Past Life Role |
| Payload key | `pastLifeRole` |
| After continue | `/sky/pastlife` |

Expected saved node progress:

```ts
completeNode("pastlife", 1, {
  pastLifeRole: normalizedRoleId,
  source: "preland",
  claimId: claim.id,
});
```

Compatibility note: the current Past Life Level 1 app flow may still save legacy keys such as `soulAge`. The claim implementation should either update the app result restoration to accept `pastLifeRole` or save a compatibility key in addition to `pastLifeRole`. The canonical new claim key should be `pastLifeRole`.

### `soulmate_type`

| Field | Value |
|---|---|
| Funnel type | `soulmate_type` |
| Discipline | `soulmate` |
| Node id | `1` |
| Route | `/sky/soulmate/1` |
| Result screen | Soulmate Type |
| Payload key | `soulmateType` |
| After continue | `/sky/soulmate` |

Expected saved node progress:

```ts
completeNode("soulmate", 1, {
  soulmateType: normalizedTypeId,
  source: "preland",
  claimId: claim.id,
});
```

Compatibility note: the current Soulmate Level 1 app flow may still save legacy keys such as `venusSign`. The claim implementation should either update result restoration to accept `soulmateType` or save a compatibility key in addition to `soulmateType`. The canonical new claim key should be `soulmateType`.

## 4. UX Flow

### Entry

The app opens with funnel context, ideally:

```txt
/sky/pastlife/1?claim=TOKEN
/sky/soulmate/1?claim=TOKEN
```

An app-level claim handler can also accept:

```txt
/?claim=TOKEN
/welcome?claim=TOKEN
```

and route to the mapped Level 1 result after validation.

### Claim Loading State

Show a focused loading state:

- "Preparing your result"
- "Claiming your paid reading"
- no quiz UI
- no visible retake prompt

The user should understand the app is retrieving something already earned, not starting a new flow.

### Result Ready State

When claim validation succeeds:

1. Normalize the result id.
2. Complete the mapped discipline/node id.
3. Save the claim payload into node progress.
4. Render the Level 1 result screen immediately.
5. Show a clear Continue button.

### Result Screen

The claimed result screen should match the in-app Level 1 result screen as closely as possible:

- Past Life funnel shows Past Life Role result.
- Soulmate funnel shows Soulmate Type result.
- No quiz intro.
- No first-question state.
- No "take quiz" call to action.

Recommended button:

```txt
Continue
```

### Continue Behavior

After Continue:

- Past Life redirects to `/sky/pastlife`.
- Soulmate redirects to `/sky/soulmate`.
- Node 1 appears completed.
- Node 2 becomes next/current.
- Sky overview and discipline map read completed state from the normal progress system.

### Error/Fallback State

If the token is invalid, expired, already claimed by another account, or cannot be validated:

- show a calm error state
- explain that the result could not be claimed
- provide a fallback action:
  - retry claim
  - contact support
  - continue to app

Do not silently drop the user into the same Level 1 quiz unless support/product explicitly chooses that fallback.

## 5. Progress Behavior

When claim succeeds:

1. Call the existing node progress completion logic.
2. Save completed state for the mapped discipline/node id.
3. Save normalized `resultPayload`.
4. Set `completedAt`.
5. Preserve `startedAt` if it already exists.
6. Do not reset previous progress.
7. If node 1 was already completed, merge or update the result idempotently.
8. Existing result restoration logic should show the claimed result on future visits.

Required app state after Past Life claim:

| Surface | Expected state |
|---|---|
| `/sky` | Past Life direction reflects progress from completed node 1 |
| `/sky/pastlife` | Node 1 completed, node 2 current/unlocked |
| `/sky/pastlife/1` | Past Life Role result restored, no retake required |
| Progress storage | `pastlife:1` completed with `pastLifeRole` payload |

Required app state after Soulmate claim:

| Surface | Expected state |
|---|---|
| `/sky` | Soulmate direction reflects progress from completed node 1 |
| `/sky/soulmate` | Node 1 completed, node 2 current/unlocked |
| `/sky/soulmate/1` | Soulmate Type result restored, no retake required |
| Progress storage | `soulmate:1` completed with `soulmateType` payload |

If cooldown rules exist later:

- node 1 should be completed immediately
- node 2 should become the next/current node
- node 2 cooldown/unlock timing should be initialized according to product rules
- cooldown must not block restoration of the claimed Level 1 result

## 6. Technical Flow

### Preferred Secure Flow

1. Preland stores quiz result server-side with a generated claim token.
2. User pays or signs up.
3. App receives `?claim=TOKEN`.
4. Client calls a server endpoint, for example:

```txt
POST /api/preland/claim
```

5. Server validates:
   - token exists
   - token is not expired
   - token belongs to the payment/session/email/account context
   - payment is complete or entitlement is valid
   - token has not been claimed by another user
6. Server returns normalized claim result:

```ts
type PrelandClaimResult = {
  claimId: string;
  funnelType: "past_life_role" | "soulmate_type";
  discipline: "pastlife" | "soulmate";
  nodeId: 1;
  payloadKey: "pastLifeRole" | "soulmateType";
  resultId: string;
  resultPayload: Record<string, unknown>;
  afterContinueHref: string;
  claimedAt: string;
};
```

7. Client maps result into node progress using the existing completion helper.
8. Client opens the correct result screen.
9. Continue redirects to the discipline overview.

### Temporary MVP Fallbacks

Use only if backend claim storage is not ready.

Option A: same-domain localStorage bridge

- Preland and app must share the same domain or storage scope.
- Preland writes a pending result payload to localStorage.
- App reads it once, completes node 1, then clears pending storage.
- Less secure. Can break across devices, domains, browsers, and privacy settings.

Option B: signed query payload

- Preland redirects with a compact signed payload.
- App or server verifies signature before accepting it.
- More portable than localStorage, but still less desirable than server-backed claim storage.

Temporary fallback rules:

- never trust unsigned raw query payloads
- mark payload source as `preland_mvp`
- clear one-time client storage after successful claim
- plan migration to server-backed claims before scale

## 7. Result Screen Reuse

Recommended approach:

1. Extract pure result display components from existing Level 1 nodes where possible.
2. Use those components in both:
   - normal quiz completion state
   - claimed result state
3. Keep quiz state and claim state separate from result rendering.

Possible component shape:

```ts
type ClaimedResultScreenProps = {
  discipline: "pastlife" | "soulmate";
  title: string;
  resultId: string;
  resultPayload: Record<string, unknown>;
  onContinue: () => void;
};
```

Past Life preferred reuse:

- reuse Past Life Role result card content
- render directly with claimed `pastLifeRole`
- skip quiz intro/questions

Soulmate preferred reuse:

- reuse Soulmate Type result card content
- render directly with claimed `soulmateType`
- skip quiz intro/questions

Avoid:

- duplicating result copy in multiple places
- creating a separate visual style for claimed results
- hiding completion side effects inside the UI component

## 8. Edge Cases

### Invalid Token

Behavior:

- show "We could not verify this result"
- do not complete node 1
- provide retry/support/continue options

### Expired Token

Behavior:

- show "This result link has expired"
- do not complete node 1 automatically
- offer support or account-based recovery if available

### Already Claimed Token

If claimed by same user:

- treat as idempotent success
- restore the saved result
- continue to result screen or discipline map

If claimed by another user:

- block claim
- show support path
- do not overwrite current user progress

### User Opens App on Different Device

Server-backed claim should work if the user signs in with the same email/payment identity.

LocalStorage bridge will not work across devices and should be treated as temporary only.

### User Already Completed Node 1

Behavior:

- do not reset node progress
- merge claim metadata/result if safe
- keep node 1 completed
- show claimed result if it is newer or explicitly tied to purchase
- avoid downgrading or clearing existing progress

### User Has No Active Plan Yet

The claim endpoint should validate entitlement/payment before completing progress.

If payment is not active:

- show access/purchase recovery state
- do not complete node 1
- do not show premium-only result as claimed

### User Closes Result Screen Before Continuing

Because progress is completed before the screen renders:

- reopening `/sky/pastlife/1` restores Past Life Role result
- reopening `/sky/soulmate/1` restores Soulmate Type result
- `/sky/pastlife` or `/sky/soulmate` still shows node 1 completed
- no retake is required

### Existing Local Progress Conflicts

If localStorage progress says node 1 is started but not completed:

- claim completion should upgrade it to completed
- keep existing `startedAt`
- set `completedAt`

If localStorage progress says node 1 is completed with a different result:

- server claim should be authoritative for a paid preland result
- merge claim metadata
- consider preserving previous result under `previousResult` only if product needs auditability

## 9. Implementation Stages

### P0

Goal: make paid preland users land in the app without retaking Level 1.

Tasks:

- create claim mapping for `past_life_role` and `soulmate_type`
- support `?claim=TOKEN` app entry
- validate or temporarily parse claim result
- auto-complete discipline node 1
- save canonical result payload:
  - `pastLifeRole`
  - `soulmateType`
- update Level 1 restoration to read claimed payload keys
- show claimed result screen immediately
- Continue redirects to:
  - `/sky/pastlife`
  - `/sky/soulmate`
- verify:
  - Sky overview updates
  - discipline map updates
  - node 2 becomes current/unlocked
  - result restores after reload

### P1

Goal: make claims secure and recoverable.

Tasks:

- add Supabase-backed claim storage
- store preland quiz result server-side
- match claim to Stripe checkout/payment session
- match claim to user email/account
- mark claims as claimed with timestamp and user id
- support same-user idempotent reclaims
- add support tooling for failed claims

### P2

Goal: improve measurement and lifecycle recovery.

Tasks:

- analytics events:
  - claim started
  - claim succeeded
  - claim failed
  - result viewed
  - continue clicked
- abandoned quiz recovery
- abandoned checkout recovery
- multi-device restore
- result resend email
- support additional funnel types:
  - `cosmic_archetype`
  - `destiny_code`
  - `energy_type`
  - `spiritual_path`

## 10. Acceptance Criteria

Past Life funnel:

- claim opens Past Life Role result without quiz
- `pastlife:1` is completed
- result payload includes `pastLifeRole`
- Continue routes to `/sky/pastlife`
- Past Life node 1 is completed
- Past Life node 2 is next/current
- reopening `/sky/pastlife/1` restores the claimed result

Soulmate funnel:

- claim opens Soulmate Type result without quiz
- `soulmate:1` is completed
- result payload includes `soulmateType`
- Continue routes to `/sky/soulmate`
- Soulmate node 1 is completed
- Soulmate node 2 is next/current
- reopening `/sky/soulmate/1` restores the claimed result

Global:

- no existing progress is reset
- invalid/expired claims do not complete progress
- premium/access logic remains authoritative
- claimed result becomes the official Level 1 result for the discipline
