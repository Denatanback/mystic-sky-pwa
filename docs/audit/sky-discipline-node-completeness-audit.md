# Sky Discipline Node Completeness Audit

Date: 2026-06-08

Scope:
- Astrology
- Numerology
- Past Life
- Soulmate
- Spiritual Practices

Human Design was excluded from this audit because nodes 3-8 were just implemented.

No code changes were made for this audit.

## Overview

The five audited Sky disciplines all expose 8 nodes in their discipline overview pages, but their detail routes currently implement only nodes 1 and 2.

In each detail route, `NODE_TITLES` only contains ids `"1"` and `"2"`. Any other node id fails metadata lookup and triggers a redirect back to the discipline overview:

```ts
if (!meta) { router.push("/sky/<discipline>"); return null; }
```

This means nodes 3-8 do not currently have playable detail content even though they are visible in the overview path.

## 1. Astrology

Files:
- `src/app/sky/astrology/page.tsx`
- `src/app/sky/astrology/[nodeId]/page.tsx`

### Overview Nodes

| Node | Label | Subtitle |
|---:|---|---|
| 1 | Cosmic Archetype | Beginning |
| 2 | Moon | Emotions & intuition |
| 3 | Aspects | Connections |
| 4 | Houses | Life areas |
| 5 | Planets | Energies |
| 6 | Transits | Future |
| 7 | Patterns | Structure |
| 8 | Synthesis | Wholeness |

### Implemented Detail Nodes

| Node | Implementation |
|---:|---|
| 1 | `AstroNode1` |
| 2 | `AstroNode2` |

### Missing / Redirecting Nodes

Nodes 3-8 are missing from `NODE_TITLES`.

Missing:
- 3 Aspects
- 4 Houses
- 5 Planets
- 6 Transits
- 7 Patterns
- 8 Synthesis

Behavior:
- Opening `/sky/astrology/3` through `/sky/astrology/8` redirects back to `/sky/astrology`.

### User Impact

Impact: broken path.

Reason:
- Astrology presents a complete 8-node learning path.
- After users complete Moon, the map suggests Aspects is next, but no Aspects detail route exists.
- The redirect makes the node feel broken rather than intentionally locked or future content.

### MVP Priority

Priority: P0.

Astrology is one of the core eLuna directions and likely carries high user expectation. Nodes 3-8 should either be implemented as MVP quiz/reflection content or temporarily hidden/marked future-only before release.

## 2. Numerology

Files:
- `src/app/sky/numerology/page.tsx`
- `src/app/sky/numerology/[nodeId]/page.tsx`

### Overview Nodes

| Node | Label | Subtitle |
|---:|---|---|
| 1 | Destiny Code | Foundation |
| 2 | Soul Number | Inner world |
| 3 | Personality | Outer image |
| 4 | Matrix | Potential |
| 5 | Cycles | Periods |
| 6 | Karma | Lessons |
| 7 | Master Numbers | Power |
| 8 | Personal Code | Wholeness |

### Implemented Detail Nodes

| Node | Implementation |
|---:|---|
| 1 | `NumNode1` |
| 2 | `NumNode2` |

### Missing / Redirecting Nodes

Nodes 3-8 are missing from `NODE_TITLES`.

Missing:
- 3 Personality
- 4 Matrix
- 5 Cycles
- 6 Karma
- 7 Master Numbers
- 8 Personal Code

Behavior:
- Opening `/sky/numerology/3` through `/sky/numerology/8` redirects back to `/sky/numerology`.

### User Impact

Impact: broken path.

Reason:
- Numerology is structurally well suited to progressive calculation nodes, so users will expect each next number to open.
- Node 3 is the immediate post-Soul Number progression point and currently dead-ends.

### MVP Priority

Priority: P0.

Numerology is likely one of the cheapest disciplines to complete because many nodes can use simple deterministic calculations or lightweight name/date inputs. Implementing nodes 3-8 should be high leverage.

## 3. Past Life

Files:
- `src/app/sky/pastlife/page.tsx`
- `src/app/sky/pastlife/[nodeId]/page.tsx`

### Overview Nodes

| Node | Label | Subtitle |
|---:|---|---|
| 1 | Past Life Role | Beginning |
| 2 | Karma | Patterns |
| 3 | Past Life Sign | Memory |
| 4 | Lunar Nodes | Direction |
| 5 | Karmic Debts | Lessons |
| 6 | Soul Contracts | Bonds |
| 7 | Talents | Gifts |
| 8 | Integration | Wholeness |

### Implemented Detail Nodes

| Node | Implementation |
|---:|---|
| 1 | `PLNode1` |
| 2 | `PLNode2` |

### Missing / Redirecting Nodes

Nodes 3-8 are missing from `NODE_TITLES`.

Missing:
- 3 Past Life Sign
- 4 Lunar Nodes
- 5 Karmic Debts
- 6 Soul Contracts
- 7 Talents
- 8 Integration

Behavior:
- Opening `/sky/pastlife/3` through `/sky/pastlife/8` redirects back to `/sky/pastlife`.

### User Impact

Impact: confusing to broken path.

Reason:
- Past Life content is more symbolic, so users may tolerate quiz/reflection MVPs.
- But once node 3 unlocks, a redirect back to overview will feel like a broken node.
- Some labels imply astrology-backed calculations, especially Past Life Sign and Lunar Nodes, but the app may not have enough chart infrastructure for those yet.

### MVP Priority

Priority: P1.

Past Life can be completed with careful MVP-safe language using symbolic quizzes and reflection results. It is slightly lower priority than Astrology/Numerology because fewer nodes can be safely framed as calculation-backed without additional data.

## 4. Soulmate

Files:
- `src/app/sky/soulmate/page.tsx`
- `src/app/sky/soulmate/[nodeId]/page.tsx`

### Overview Nodes

| Node | Label | Subtitle |
|---:|---|---|
| 1 | Soulmate Type | Love |
| 2 | Heart Line | Connection |
| 3 | Synastry | Compatibility |
| 4 | Composite | Union |
| 5 | Soul Contract | Bond |
| 6 | Twin Flame | Mirror |
| 7 | Love Cycles | Timing |
| 8 | Sacred Union | Wholeness |

### Implemented Detail Nodes

| Node | Implementation |
|---:|---|
| 1 | `SMNode1` |
| 2 | `SMNode2` |

Note:
- `SMNode1Legacy` also exists in the file but is not currently rendered by the route.

### Missing / Redirecting Nodes

Nodes 3-8 are missing from `NODE_TITLES`.

Missing:
- 3 Synastry
- 4 Composite
- 5 Soul Contract
- 6 Twin Flame
- 7 Love Cycles
- 8 Sacred Union

Behavior:
- Opening `/sky/soulmate/3` through `/sky/soulmate/8` redirects back to `/sky/soulmate`.

### User Impact

Impact: confusing to broken path.

Reason:
- Soulmate is likely a high-interest discipline.
- Nodes 3 and 4 imply two-person astrology chart calculations, which may not exist yet.
- If users unlock those nodes and are redirected, the mismatch will feel especially obvious because the labels are concrete and desirable.

### MVP Priority

Priority: P1.

Soulmate should be implemented soon, but labels like Synastry and Composite need careful MVP framing if there is no partner birth data or chart overlay. A quiz/reflection MVP can work, but the copy should avoid implying a real calculated compatibility chart until that exists.

## 5. Spiritual Practices

Files:
- `src/app/sky/spiritual/page.tsx`
- `src/app/sky/spiritual/[nodeId]/page.tsx`

### Overview Nodes

| Node | Label | Subtitle |
|---:|---|---|
| 1 | Spiritual Path | Foundation |
| 2 | Breathwork | Energy |
| 3 | Visualisation | Mind |
| 4 | Chakras | Centers |
| 5 | Mantras | Sound |
| 6 | Ritual | Intention |
| 7 | Shadow Work | Depth |
| 8 | Awakening | Wholeness |

### Implemented Detail Nodes

| Node | Implementation |
|---:|---|
| 1 | `SpiritNode1` |
| 2 | `SpiritNode2` |

Note:
- `SpiritNode1MeditationLegacy` also exists in the file but is not currently rendered by the route.

### Missing / Redirecting Nodes

Nodes 3-8 are missing from `NODE_TITLES`.

Missing:
- 3 Visualisation
- 4 Chakras
- 5 Mantras
- 6 Ritual
- 7 Shadow Work
- 8 Awakening

Behavior:
- Opening `/sky/spiritual/3` through `/sky/spiritual/8` redirects back to `/sky/spiritual`.

### User Impact

Impact: broken path, but easiest to fix.

Reason:
- Spiritual Practices nodes are naturally practice-based.
- Users will expect each node to open into an exercise, timer, reflection, or simple guided practice.
- A redirect from Visualisation or Chakras back to overview would feel like an unfinished feature.

### MVP Priority

Priority: P0.

This is likely the cheapest discipline to complete because nodes 3-8 can be practical, self-contained, and low-risk without external APIs or calculations.

## Cross-Discipline Pattern

All five audited disciplines currently have the same implementation gap:

- Overview path: 8 visible nodes.
- Detail route: only node ids 1 and 2.
- Missing ids: 3-8.
- Missing behavior: redirect to overview.

This creates an expectation mismatch after users complete node 2 in any discipline.

The route-level redirect is safe from a crash perspective, but product-wise it behaves like a dead end.

## MVP Implementation Priority

Recommended order:

1. Spiritual Practices
   - Lowest complexity.
   - Practice content can be implemented without precise calculations.
   - Strong retention value.

2. Numerology
   - Low complexity.
   - Can use existing profile/name/date data and simple calculations or symbolic MVPs.
   - High path-completion clarity.

3. Astrology
   - High importance.
   - Some nodes need chart data, but MVP reflection/calculation layers can be used carefully.

4. Past Life
   - Symbolic quiz-based MVP is feasible.
   - Needs careful language to avoid overclaiming.

5. Soulmate
   - High user interest, but some labels imply partner/chart compatibility features.
   - Needs careful MVP framing before implementation.

## Final Table

| Discipline | Overview nodes | Implemented detail nodes | Missing | Priority |
|---|---:|---|---|---|
| Astrology | 8 | 1-2 | 3-8 | P0 |
| Numerology | 8 | 1-2 | 3-8 | P0 |
| Past Life | 8 | 1-2 | 3-8 | P1 |
| Soulmate | 8 | 1-2 | 3-8 | P1 |
| Spiritual Practices | 8 | 1-2 | 3-8 | P0 |

## Release Risk

If users can unlock node 3 in any of these disciplines before nodes 3-8 are implemented, the path becomes a broken progression loop:

1. User completes node 2.
2. Overview marks node 3 as current.
3. User opens node 3.
4. Detail route redirects back to overview.
5. User cannot progress further.

This should be treated as a release-blocking issue for any discipline where node 3 can become available.
