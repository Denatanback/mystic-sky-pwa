# Sky Level 1 Migration Audit

Date: 2026-06-05

Scope: analysis only. Do not rename routes, change UI, alter access gates, rewrite subscription logic, change progress keys, or implement content in this pass.

Goal: identify the cheapest path to migrate the current first Sky node in each discipline into the approved hook-first Level 1 experience.

## Overview

The current Level 1 system already has stable discipline routes and progress calls:

- Astrology: `/sky/astrology/1`
- Numerology: `/sky/numerology/1`
- Human Design: `/sky/humandesign/1`
- Past Life: `/sky/pastlife/1`
- Soulmate: `/sky/soulmate/1`
- Spiritual Practices: `/sky/spiritual/1`

The cheapest migration path is to keep these routes and node ids exactly as-is, change only the display title/content inside each Level 1 page later, and preserve existing `startNode` / `completeNode` calls unless a new result payload is explicitly required.

## Astrology

### Current Implementation

- Current route: `/sky/astrology/1`
- Current node title: `The Sun`
- Current user flow: load current profile, require birth date, reveal Sun sign, show zodiac identity content, show trait cards, ask reflection question, complete node.
- Current inputs: profile birth date, profile zodiac override or stored zodiac sign if present.
- Current result: Sun sign key, zodiac symbol, element, quality, ruler, element traits, Sun trait cards.
- Current calculations/quizzes: `resolveUserZodiac(user)` with fallback to `getSunSign(user.birthDate)`. No quiz.

### New Approved Hook

- New title: `Cosmic Archetype`
- Expected user result: a fast archetype such as Visionary, Guardian, Creator, Mystic, Rebel, or Healer.
- Expected user experience: user enters or already has birth date, sees a clear archetype reveal first, then supporting zodiac evidence below it.
- Expected emotional payoff: "This app instantly sees my core energy and gives me a memorable identity."

### Reuse Analysis

| Block | Classification | Notes |
|---|---|---|
| Route `/sky/astrology/1` | Reuse directly | Keep route and node id unchanged. |
| Profile loading and birth-date requirement | Reuse directly | Birth date remains the right MVP input. |
| Zodiac resolution | Reuse directly | Sun sign can drive archetype mapping. |
| Current Sun sign result card | Reuse with content rewrite | Reframe Sun sign as supporting evidence after archetype reveal. |
| Element and trait chips | Reuse with small edits | Useful as proof points if labels are tightened. |
| Three flip trait cards | Reuse with content rewrite | Replace educational Sun-sign traits with archetype-specific traits. |
| Reflection prompt | Reuse with content rewrite | Keep interaction shape, rewrite around archetype recognition. |
| Completion payload `{ sign }` | Reuse with small edits | Can keep `sign`; later may add `cosmicArchetype` without breaking progress. |

### Technical Impact

- Routes affected: no route rename; update content inside `/sky/astrology/1` later.
- Node ids affected: none; keep astrology node `1`.
- Progress affected: minimal; keep `startNode("astrology", 1)` and `completeNode("astrology", 1, ...)`.
- Subscription affected: none visible in current Level 1; do not add a gate unless product policy changes.
- Profile data required: birth date, optional zodiac override.
- New calculations required: small mapping from zodiac sign/element/quality to `Cosmic Archetype`.
- New quiz required: no.

### Estimated Complexity

Easy.

## Numerology

### Current Implementation

- Current route: `/sky/numerology/1`
- Current node title: `Life Path`
- Current user flow: load current profile, require birth date, show birth-date calculation intro, user starts calculation, animated reduction steps reveal Life Path number, show number traits, complete node.
- Current inputs: profile birth date.
- Current result: Life Path number and existing `NUMBER_TRAITS` content.
- Current calculations/quizzes: `lifePathNumber(user.birthDate)`. No quiz.

### New Approved Hook

- New title: `Destiny Code`
- Expected user result: an archetype such as Builder, Teacher, Creator, Mystic, Leader, or Protector.
- Expected user experience: user taps into a quick calculation reveal and receives a named destiny identity, with Life Path math as backup context.
- Expected emotional payoff: "My birth date becomes a personal code with a clear role and direction."

### Reuse Analysis

| Block | Classification | Notes |
|---|---|---|
| Route `/sky/numerology/1` | Reuse directly | Keep stable. |
| Profile loading and birth-date requirement | Reuse directly | Birth date is still the correct input. |
| Life Path calculation | Reuse directly | This is the core Destiny Code engine. |
| Animated calculation steps | Reuse directly | Already creates perceived personalization. |
| Number result card | Reuse with content rewrite | Lead with archetype, keep number as detail. |
| Existing `NUMBER_TRAITS` | Reuse with content rewrite | Some names may map cleanly, but output should feel less generic. |
| Completion payload `{ lifePathNumber }` | Reuse with small edits | Later optional payload can include `destinyCode`. |

### Technical Impact

- Routes affected: no route rename; update content inside `/sky/numerology/1` later.
- Node ids affected: none; keep numerology node `1`.
- Progress affected: minimal; keep current progress calls.
- Subscription affected: none visible in current Level 1; do not add subscription logic.
- Profile data required: birth date.
- New calculations required: none beyond a mapping from Life Path number to Destiny Code archetype.
- New quiz required: no.

### Estimated Complexity

Very Easy.

## Human Design

### Current Implementation

- Current route: `/sky/humandesign/1`
- Current node title: `Type`
- Current user flow: intro screen, start button, five-question quiz, calculated type result, strategy/signature/not-self details, complete node.
- Current inputs: quiz answers.
- Current result: Generator, Manifesting Generator, Projector, Manifestor, or Reflector.
- Current calculations/quizzes: `TYPE_QUESTIONS` scored by `calcHDType(answers)`.

### New Approved Hook

- New title: `Energy Type`
- Expected user result: the same Human Design type result, presented as an energy identity.
- Expected user experience: short quiz, immediate Energy Type reveal, then practical "how your energy works" guidance.
- Expected emotional payoff: "This explains why my energy works differently from other people."

### Reuse Analysis

| Block | Classification | Notes |
|---|---|---|
| Route `/sky/humandesign/1` | Reuse directly | Keep stable. |
| `SkyNodeEntitlementGate` wrapper | Reuse directly | Premium/access behavior should remain unchanged. |
| Five-question quiz | Reuse directly | Current quiz already supports MVP hook. |
| `calcHDType` scoring | Reuse directly | Output already matches approved hook results. |
| Result taxonomy | Reuse directly | Approved result names match current implementation. |
| Intro/explanation copy | Reuse with content rewrite | Make it hook-first and less educational. |
| Result detail cards | Reuse with small edits | Strategy/signature/not-self are useful after reveal. |
| Completion payload `{ hdType }` | Reuse directly | Already correct. |

### Technical Impact

- Routes affected: no route rename; update content inside `/sky/humandesign/1` later.
- Node ids affected: none; keep Human Design node `1`.
- Progress affected: none expected.
- Subscription affected: none; preserve existing `SkyNodeEntitlementGate`.
- Profile data required: none for MVP.
- New calculations required: none.
- New quiz required: no.

### Estimated Complexity

Very Easy.

## Past Life

### Current Implementation

- Current route: `/sky/pastlife/1`
- Current node title: `Soul Age`
- Current user flow: intro card, shared quiz component, result reveal, trait list, complete node.
- Current inputs: quiz answers.
- Current result: Soul Age result such as infant, baby, young, mature, or old soul.
- Current calculations/quizzes: `SOUL_AGE_Q` scored by `calcSoulAge(answers)`.

### New Approved Hook

- New title: `Past Life Role`
- Expected user result: Healer, Warrior, Priest, Scientist, Artist, Explorer, Teacher, or Ruler.
- Expected user experience: answer a short intuitive quiz and receive a vivid past-life identity, with traits and a short role interpretation.
- Expected emotional payoff: "I just uncovered who I might have been before, and it feels specific."

### Reuse Analysis

| Block | Classification | Notes |
|---|---|---|
| Route `/sky/pastlife/1` | Reuse directly | Keep stable. |
| `SkyNodeEntitlementGate` wrapper | Reuse directly | Preserve premium/access behavior. |
| Shared quiz rendering component | Reuse directly | The current quiz shell is useful. |
| Current `SOUL_AGE_Q` questions | Replace completely | They score age/maturity, not role/archetype. |
| `calcSoulAge` scoring | Replace completely | Needs role scoring or a new generic scorer. |
| Current Soul Age result data | Replace completely | Role taxonomy and descriptions are different. |
| Completion payload `{ soulAge }` | Reuse with small edits | Later payload should likely become `{ pastLifeRole }`; preserve old handling if existing progress can contain `soulAge`. |
| Result card layout | Reuse with content rewrite | Keep visual shape, replace content. |

### Technical Impact

- Routes affected: no route rename; content update inside `/sky/pastlife/1`.
- Node ids affected: none; keep Past Life node `1`.
- Progress affected: moderate; result key changes from `soulAge` to a role-oriented key if implemented cleanly later.
- Subscription affected: none; preserve existing `SkyNodeEntitlementGate`.
- Profile data required: none for MVP.
- New calculations required: role scoring from quiz answers.
- New quiz required: yes.

### Estimated Complexity

Medium.

## Soulmate

### Current Implementation

- Current route: `/sky/soulmate/1`
- Current node title: `Venus`
- Current user flow: load mock user, calculate Venus sign from birth date, user taps reveal, show Venus love style, needs, and gift, complete node.
- Current inputs: mock user birth date.
- Current result: Venus sign and Venus love-style content such as Bold Lover, Sensual Devotee, or Playful Connector.
- Current calculations/quizzes: `getVenusSign(user.birthDate)` and `VENUS_LOVE` lookup. No quiz.

### New Approved Hook

- New title: `Soulmate Type`
- Expected user result: the type of soulmate/person the user most likely attracts, such as Protector, Mystic, Adventurer, Intellectual, Creator, or Healer.
- Expected user experience: short attraction-pattern quiz, then a direct reveal of the soulmate type they tend to draw in.
- Expected emotional payoff: "This names the person I keep looking for or attracting."

### Reuse Analysis

| Block | Classification | Notes |
|---|---|---|
| Route `/sky/soulmate/1` | Reuse directly | Keep stable. |
| `SkyNodeEntitlementGate` wrapper | Reuse directly | Preserve premium/access behavior. |
| Reveal interaction | Reuse with small edits | Reveal moment is useful, but should follow quiz or profile-based selection. |
| `getMockUser()` profile source | Replace completely | Later implementation should align with current profile handling if profile data is needed. |
| `getVenusSign` calculation | Reuse with content rewrite or move later | Venus can support attraction pattern, but approved hook is soulmate type, not Venus sign. |
| `VENUS_LOVE` content | Reuse with content rewrite | Some love-style language may inspire results, but the taxonomy changes. |
| Completion payload `{ venusSign }` | Reuse with small edits | Later payload should likely include `{ soulmateType }`; Venus can be kept as optional supporting data. |
| Result card layout | Reuse with content rewrite | Visual structure can remain. |

### Technical Impact

- Routes affected: no route rename; content update inside `/sky/soulmate/1`.
- Node ids affected: none; keep Soulmate node `1`.
- Progress affected: moderate; new result key should represent `soulmateType`, while avoiding breakage for existing `venusSign` progress.
- Subscription affected: none; preserve existing `SkyNodeEntitlementGate`.
- Profile data required: none if quiz-based; optional birth date if Venus is retained as supporting signal.
- New calculations required: quiz scoring for soulmate type, unless a birth-date/profile mapping is chosen.
- New quiz required: yes for the approved MVP direction.

### Estimated Complexity

Medium.

## Spiritual Practices

### Current Implementation

- Current route: `/sky/spiritual/1`
- Current node title: `Meditation`
- Current user flow: choose duration, begin meditation, breathe through a timed session, finish, receive completion message, complete node.
- Current inputs: selected duration of 3, 5, or 10 minutes.
- Current result: practice completion with selected meditation duration.
- Current calculations/quizzes: no identity calculation; timer and breath phase loop only.

### New Approved Hook

- New title: `Spiritual Path` preferred, or `Spiritual Element` if easier.
- Expected user result: a path/element identity such as Earth, Water, Fire, Air, or Aether if using element-based MVP.
- Expected user experience: short quiz or profile-based reveal that assigns a spiritual style, followed by a matched first practice.
- Expected emotional payoff: "I know what kind of spiritual practice fits me instead of receiving a generic meditation."

### Reuse Analysis

| Block | Classification | Notes |
|---|---|---|
| Route `/sky/spiritual/1` | Reuse directly | Keep stable. |
| `SkyNodeEntitlementGate` wrapper | Reuse directly | Preserve premium/access behavior. |
| Meditation timer | Reuse with content rewrite or move later | Strong practice mechanic, but not a Level 1 hook result. Best reused as Level 2 or post-result action. |
| Duration selector | Reuse with small edits | Could become a matched practice option after Spiritual Path/Element reveal. |
| Breath phase animation | Reuse with small edits | Useful if the resulting path recommends meditation/breathwork. |
| Current completion result `{ meditationMin }` | Reuse with small edits | Later should likely record `spiritualPath` or `spiritualElement`; duration can remain as secondary practice metadata. |
| Current content | Replace completely | It completes a practice, but does not classify the user. |
| New quiz/result data | Replace completely | Needed for hook-first identity result. |

### Technical Impact

- Routes affected: no route rename; content update inside `/sky/spiritual/1`.
- Node ids affected: none; keep Spiritual node `1`.
- Progress affected: moderate; new identity payload should be added while preserving meditation progress compatibility if needed.
- Subscription affected: none; preserve existing `SkyNodeEntitlementGate`.
- Profile data required: none if quiz-based; optional if matched from existing onboarding/preferences later.
- New calculations required: element/path scoring from quiz or profile fields.
- New quiz required: yes unless product chooses profile-based matching.

### Estimated Complexity

Medium.

## Recommended Implementation Order

1. Numerology - `Destiny Code`: cheapest win because Life Path calculation already produces a fast personalized result.
2. Human Design - `Energy Type`: approved hook already matches the current result taxonomy.
3. Astrology - `Cosmic Archetype`: needs only a sign-to-archetype mapping and content reframe.
4. Past Life - `Past Life Role`: quiz shell is reusable, but scoring and result content need replacement.
5. Soulmate - `Soulmate Type`: needs a new quiz/result model and should stop depending on `getMockUser()` for the core hook.
6. Spiritual Practices - `Spiritual Path`: largest conceptual shift because current Level 1 is a timed practice, not an identity result.

## Migration Notes

- Keep all six Level 1 routes unchanged.
- Keep all six node ids unchanged.
- Preserve current subscription wrappers where they already exist.
- Do not move locked/unlock logic as part of the hook migration.
- Prefer adding new result keys alongside old keys where progress compatibility matters.
- For the three quiz migrations, define result taxonomies first, then write questions against those taxonomies.

## Final Summary Table

| Discipline | Current Level 1 | New Level 1 | Reuse % | Complexity |
|---|---|---|---:|---|
| Astrology | The Sun | Cosmic Archetype | 70% | Easy |
| Numerology | Life Path | Destiny Code | 85% | Very Easy |
| Human Design | Type | Energy Type | 90% | Very Easy |
| Past Life | Soul Age | Past Life Role | 45% | Medium |
| Soulmate | Venus | Soulmate Type | 40% | Medium |
| Spiritual Practices | Meditation | Spiritual Path | 35% | Medium |

