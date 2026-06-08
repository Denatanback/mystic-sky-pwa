# Human Design Depth Audit

Date: 2026-06-08

Scope:
- `/sky/humandesign`
- `/sky/humandesign/1`
- `/sky/humandesign/2`
- Human Design node progress via `src/lib/nodeProgress.ts`

No code changes were made for this audit.

## 1. Persistence Verification

### Files Reviewed

- `src/app/sky/humandesign/page.tsx`
  - Defines the 8 Human Design overview nodes and bodygraph coordinates.
  - Passes nodes to `NodePathPage`.

- `src/app/sky/humandesign/[nodeId]/page.tsx`
  - Implements detail content for node 1 and node 2 only.
  - Uses `startNode`, `completeNode`, `getNodeState`, and `isNodeLocked`.

- `src/components/sky/NodePathPage.tsx`
  - Reads node state on mount.
  - Converts completed nodes to `done`.
  - Converts the first unlocked incomplete node to `current`.
  - Shows path progress from completed node count.

- `src/lib/nodeProgress.ts`
  - Stores progress in `localStorage` under `eluna.nodeProgress`.
  - Keys are shaped as `{discipline}:{nodeId}`, for example `humandesign:1`.

### Live Browser Verification

Attempted full click-through verification with local mock auth:

1. Open `/sky/humandesign/1`.
2. Complete Energy Type quiz.
3. Reload.
4. Close/reopen browser context.
5. Navigate away and back.
6. Repeat for `/sky/humandesign/2`.

Result: blocked by `SkyNodeEntitlementGate`.

The local browser test account had no active plan, so `/sky/humandesign/1` rendered the premium gate instead of the quiz:

- `PREMIUM SKY MAP NODE`
- `Unlock this deeper insight`
- `Start 3-day introductory access for $1...`

Because of that, the full user-level completion flow could not be verified in this local environment without changing entitlement state or subscription logic.

### Code-Level Persistence Verification

Node 1 restoration:

- `HDNode1` reads `getNodeState("humandesign", 1)` on mount.
- If state is `completed` and `result.hdType` is a known Human Design type, it sets:
  - `result` to the saved `hdType`
  - `qIdx` to `TYPE_QUESTIONS.length`
- This causes the result screen to render instead of the intro/quiz.
- Existing completion payload is preserved as `{ hdType: result }`.

Node 2 restoration:

- `HDNode2` reads `getNodeState("humandesign", 2)` on mount.
- If state is `completed` and `result.hdAuthority` is a known authority, it sets:
  - `result` to the saved `hdAuthority`
  - `qIdx` to `AUTH_QUESTIONS.length`
- This causes the result screen to render instead of the intro/quiz.
- Existing completion payload is preserved as `{ hdAuthority: result }`.

### Simulated Progress Verification

Because premium gating blocked live quiz completion, progress state was simulated in `localStorage`:

```json
{
  "humandesign:1": {
    "status": "completed",
    "result": { "hdType": "Generator" }
  },
  "humandesign:2": {
    "status": "completed",
    "result": { "hdAuthority": "Sacral" }
  }
}
```

Observed overview result on `/sky/humandesign`:

- Path progress showed `2 of 8 nodes`.
- `Energy Type` and `Authority` were treated as completed.
- `Profile` became the current node.
- `Centers` appeared as the next locked node.

### Mismatch Findings

| Area | Finding | Severity |
|---|---|---|
| Local full-flow verification | Cannot complete node 1 or 2 in local mock auth because premium gating blocks quiz content. | Expected in free/no-plan state |
| Completed state with missing result | If `humandesign:1` or `humandesign:2` is marked `completed` but has no valid result payload, the overview can show completion while the detail page cannot restore a result. | Needs guard/recovery later |
| Nodes 3-8 detail pages | Overview shows 8 nodes, but dynamic detail page only defines metadata/content for nodes 1 and 2. Opening nodes 3-8 currently routes back to `/sky/humandesign`. | Important before deeper progression |

## 2. Human Design Progression Audit

### Summary Table

| Node | Name | Current implementation | Completion time | Perceived value | Retention value | Uniqueness | Depth mark |
|---:|---|---|---:|---|---|---|---|
| 1 | Energy Type | 5-question quiz, result, strategy/signature cards | 2-4 min | High | Medium | Medium | Acceptable |
| 2 | Authority | 3-question quiz, result, description, how-to-use card | 1-3 min | Medium-high | Medium | Medium | Acceptable |
| 3 | Profile | Overview node only; no implemented detail content | 0 min | Low until implemented | Low | Potentially high | Too short |
| 4 | Centers | Overview node only; no implemented detail content | 0 min | Low until implemented | Low | Potentially high | Too short |
| 5 | Channels | Overview node only; no implemented detail content | 0 min | Low until implemented | Low | Potentially high | Too short |
| 6 | Gates | Overview node only; no implemented detail content | 0 min | Low until implemented | Low | Potentially high | Too short |
| 7 | Cycles | Overview node only; no implemented detail content | 0 min | Low until implemented | Low-medium potential | Medium-high potential | Too short |
| 8 | Living Design | Overview node only; no implemented detail content | 0 min | Low until implemented | Medium-high potential | High potential | Too short |

### Node 1: Energy Type

Current:
- Intro.
- 5-question quiz.
- Result: Generator, Manifesting Generator, Projector, Manifestor, or Reflector.
- Shows description, strategy, and signature.
- Completion payload: `{ hdType }`.

Evaluation:
- Completion time: 2-4 minutes.
- Perceived value: high because the result is personalized and named.
- Retention value: medium; useful result, but limited follow-up.
- Uniqueness: medium; quiz-based MVP is common but emotionally useful.
- Mark: Acceptable.

Main depth gap:
- Result lacks reflection, behavioral examples, and a next-step teaser into Authority.

### Node 2: Authority

Current:
- Intro.
- 3-question quiz.
- Result: Sacral, Emotional, Splenic, Ego, Self, Mental, or Lunar Authority.
- Shows description and how-to-use card.
- Completion payload: `{ hdAuthority }`.

Evaluation:
- Completion time: 1-3 minutes.
- Perceived value: medium-high because it gives a decision-making hook.
- Retention value: medium; practical, but too short for a cooldown-gated step.
- Uniqueness: medium; the result is specific, but quiz depth is light.
- Mark: Acceptable.

Main depth gap:
- Needs a practical decision scenario or reflection to make the result feel earned.

### Node 3: Profile

Current:
- Present on overview only.
- No implemented detail metadata/content in `[nodeId]/page.tsx`.

Evaluation:
- Completion time: 0 minutes.
- Perceived value: low until implemented.
- Retention value: low.
- Uniqueness: potentially high if framed as the user's life role.
- Mark: Too short.

Main depth gap:
- No content path exists yet.

### Node 4: Centers

Current:
- Present on overview only.
- No implemented detail metadata/content in `[nodeId]/page.tsx`.

Evaluation:
- Completion time: 0 minutes.
- Perceived value: low until implemented.
- Retention value: low.
- Uniqueness: potentially high if tied to the bodygraph visual.
- Mark: Too short.

Main depth gap:
- The overview bodygraph makes users expect center-level meaning, but no center content exists.

### Node 5: Channels

Current:
- Present on overview only.
- No implemented detail metadata/content in `[nodeId]/page.tsx`.

Evaluation:
- Completion time: 0 minutes.
- Perceived value: low until implemented.
- Retention value: low.
- Uniqueness: potentially high, but depends on whether this stays quiz-based or becomes chart-based later.
- Mark: Too short.

Main depth gap:
- No explanation or result system exists.

### Node 6: Gates

Current:
- Present on overview only.
- No implemented detail metadata/content in `[nodeId]/page.tsx`.

Evaluation:
- Completion time: 0 minutes.
- Perceived value: low until implemented.
- Retention value: low.
- Uniqueness: potentially high but hard to make credible without birth-time/chart data.
- Mark: Too short.

Main depth gap:
- Needs careful MVP framing if there is no real Human Design chart calculation.

### Node 7: Cycles

Current:
- Present on overview only.
- No implemented detail metadata/content in `[nodeId]/page.tsx`.

Evaluation:
- Completion time: 0 minutes.
- Perceived value: low until implemented.
- Retention value: medium-high potential because cycles naturally support return visits.
- Uniqueness: medium-high potential.
- Mark: Too short.

Main depth gap:
- This is the most natural cooldown/return-loop candidate, but no content exists yet.

### Node 8: Living Design

Current:
- Present on overview only.
- No implemented detail metadata/content in `[nodeId]/page.tsx`.

Evaluation:
- Completion time: 0 minutes.
- Perceived value: low until implemented.
- Retention value: medium-high potential as a synthesis node.
- Uniqueness: high potential if it summarizes prior results.
- Mark: Too short.

Main depth gap:
- Needs dependency on previous node outputs to feel like a final integration step.

## 3. Expansion Recommendations

Recommended structure for each node:

1. Intro
2. Quiz
3. Reveal
4. Interpretation
5. Reflection
6. Next-step teaser

This fits the current architecture because each node can remain one route:

- `/sky/humandesign/1`
- `/sky/humandesign/2`
- etc.

No nested routes are required.

### Node 1: Energy Type

Current:
- Intro -> Quiz -> Result.

Recommended:
- Intro: "Your energy has a natural way of moving."
- Quiz: keep 5 questions.
- Reveal: show type name and core phrase.
- Interpretation: include strategy, signature, not-self theme, and "when aligned / when drained".
- Reflection: one question such as "Where do you feel most energized without forcing?"
- Next-step teaser: "Next, discover how your body makes decisions: Authority."

Implementation fit:
- Reuse existing quiz and result taxonomy.
- Add one reflection input or local-only choice.
- No route or progress change required.

### Node 2: Authority

Current:
- Intro -> Quiz -> Result.

Recommended:
- Intro: "Your Authority is your decision rhythm."
- Quiz: keep 3 questions or expand to 5 for better confidence.
- Reveal: show authority name.
- Interpretation: what to trust, what to avoid, decision timing.
- Reflection: ask user to pick one current decision and apply the authority.
- Next-step teaser: "Next, your Profile shows the role you naturally play."

Implementation fit:
- Reuse existing authority taxonomy and result cards.
- Add scenario/reflection step.
- No route or progress change required.

### Node 3: Profile

Current:
- Overview only.

Recommended:
- Intro: explain Profile as "how your role is experienced by you and others."
- Quiz: MVP role quiz if birth-time chart is not available.
- Reveal: result examples such as Investigator, Guide, Experimenter, Messenger, Stabilizer.
- Interpretation: conscious role, relational role, growth edge.
- Reflection: "Where do people already come to you for this?"
- Next-step teaser: "Next, your Centers show where energy is consistent or open."

Implementation fit:
- Can be quiz-based until real chart calculation exists.
- Store result under a new payload key such as `{ hdProfile: ... }` later.

### Node 4: Centers

Current:
- Overview only.

Recommended:
- Intro: "Centers show where energy is consistent, open, or amplified."
- Quiz: ask about decision pressure, communication, emotion, willpower, instinct, and direction.
- Reveal: dominant center pattern, not a full chart.
- Interpretation: one defined-style strength and one open-center sensitivity.
- Reflection: "Which environment changes your energy most?"
- Next-step teaser: "Next, Channels show recurring pathways of expression."

Implementation fit:
- Can reuse bodygraph visual as context.
- Avoid claiming exact defined/undefined centers without birth data.

### Node 5: Channels

Current:
- Overview only.

Recommended:
- Intro: "Channels are recurring pathways in how your energy moves."
- Quiz: identify a dominant channel theme: creative flow, guidance, emotional depth, willpower, intuition.
- Reveal: one channel-style archetype.
- Interpretation: how it expresses, where it blocks, what supports it.
- Reflection: "What kind of work makes you lose track of time?"
- Next-step teaser: "Next, Gates reveal smaller recurring themes."

Implementation fit:
- MVP can be thematic/quiz-based.
- Keep language clear that it is a reflection pattern, not a calculated chart.

### Node 6: Gates

Current:
- Overview only.

Recommended:
- Intro: "Gates are specific themes that repeat in your choices and relationships."
- Quiz: ask about recurring emotional or behavioral motifs.
- Reveal: a small set of gate-like themes, for example Voice, Boundary, Devotion, Insight, Timing.
- Interpretation: gift, distortion, practice.
- Reflection: "Which pattern keeps repeating lately?"
- Next-step teaser: "Next, Cycles shows how your design changes with time."

Implementation fit:
- Requires careful content framing.
- Best implemented after Centers/Channels so the user has context.

### Node 7: Cycles

Current:
- Overview only.

Recommended:
- Intro: "Your design is lived through timing, not just traits."
- Quiz or profile-based input: current season, stress/energy rhythm, relationship/work focus.
- Reveal: current cycle theme.
- Interpretation: what to lean into, what to stop forcing, timing note.
- Reflection: "What would change if you trusted timing this week?"
- Next-step teaser: "Next, Living Design integrates your whole path."

Implementation fit:
- Strong candidate for weekly/monthly refresh later.
- Compatible with cooldowns once content exists.

### Node 8: Living Design

Current:
- Overview only.

Recommended:
- Intro: "This is your Human Design integration."
- Quiz: minimal, focused on what the user wants to practice.
- Reveal: synthesis of Energy Type, Authority, and any completed nodes.
- Interpretation: personal operating principle, relationship note, work/energy note.
- Reflection: choose one 7-day experiment.
- Next-step teaser: "Return to the Sky Map for the next discipline."

Implementation fit:
- Should read prior node results from `nodeProgress`.
- Best saved for after nodes 3-7 are implemented.

## 4. Cooldown Readiness

### Current Implementation

Cooldowns are not justified yet.

Reasons:

- Only nodes 1 and 2 have implemented content.
- Node 1 and node 2 are quick quiz/result experiences.
- Nodes 3-8 are visible in the map but not implemented as playable content.
- A cooldown after a 1-4 minute result would likely feel like artificial friction.
- Premium gating already blocks access for no-plan users, so adding cooldowns now would stack restrictions before the content depth supports them.

Current recommendation:

- Do not add cooldowns yet.
- First implement at least nodes 3 and 4, or expand nodes 1 and 2 with reflection and next-step sections.

### Expanded Implementation

Cooldowns can become justified after content depth is increased.

Conditions that would make cooldowns feel fair:

- Each node takes 5-8 minutes.
- Each node includes a reflection or practice.
- Each node gives a saved result.
- The next node is teased clearly.
- The user understands why waiting improves the experience.

Best cooldown candidates after expansion:

- After node 2: small cooldown before Profile, if Authority includes a real-life decision reflection.
- After node 4: cooldown before Channels, because Centers can ask the user to observe energy in real environments.
- After node 7: cooldown before Living Design, because Cycles can naturally ask for a short timing observation.

Avoid cooldowns:

- Before node 1.
- Immediately after a very short quiz.
- On nodes that do not store a meaningful result.

## 5. Release Readiness Notes

P0 before Human Design cooldowns:

- Implement content for nodes 3-8 or hide/lock them in a way that does not imply playable content.
- Add recovery behavior for completed nodes with missing/invalid result payloads.
- Verify node 1 and 2 restore behavior with a real full-access account, not only code review/localStorage inspection.

P1:

- Expand node 1 and 2 with reflection and next-step teaser.
- Add result summaries that can feed `Living Design`.
- Decide whether future Human Design content is quiz-based MVP or calculated chart-based.

P2:

- Add screenshots or lightweight visual state tests for completed/current/locked overview map states.
- Add a debug/test entitlement mode for local QA, if product/security constraints allow it.
