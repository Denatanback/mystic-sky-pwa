# Sky Hook Levels Plan

Date: 2026-06-05

Scope: planning only. Do not change routes, UI, access logic, subscription logic, unlock rules, or current code yet.

Goal: redesign the first levels inside each Sky discipline so the first node gives a fast, emotionally strong personalized result instead of an educational explanation.

## Strategy

The first node in each discipline should answer: "What am I?" or "What is my pattern?" within one short interaction. Educational explanations can move after the result or into later nodes. For MVP, prioritize content that can be generated from existing profile data or short quizzes without adding new backend dependencies.

## Hook Level Matrix

### Astrology

| Field | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Discipline | Astrology | Astrology | Astrology |
| Level number | 1 | 2 | 3 |
| Current node name in code | The Sun / Sun | The Moon / Moon | Aspects currently occupies level 3 in overview; Venus is not currently an astrology detail node |
| Proposed new name | Cosmic Archetype | Personal Sky Map / Moon Insight | Love & Attraction / Venus |
| Hook result user receives | Archetype such as Visionary, Guardian, Creator, Mystic, Rebel, Healer | Moon-based emotional pattern, inner needs, private rhythm | Venus/love-attraction signature |
| Input needed | Birth date / zodiac data | Birth date; ideally birth time/place later | Birth date for MVP approximation; better ephemeris later |
| Content type | Calculation | Calculation / visual interactive | Calculation / future visual |
| Whether current code already supports it | Partly. Sun sign and traits exist, but result is educational zodiac rather than archetype-first | Partly. Moon insight exists as approximate Moon sign in node 2 | Partly elsewhere. Venus logic exists in Soulmate node 1 using `getVenusSign`, not Astrology |
| What needs to change later | Map zodiac signs/elements to emotional archetype results and lead with the archetype | Reframe Moon node around a personal sky map result rather than explanation | Decide whether Venus belongs in Astrology, Soulmate, or both; avoid duplicate Venus content |

### Numerology

| Field | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Discipline | Numerology | Numerology | Numerology |
| Level number | 1 | 2 | 3 |
| Current node name in code | Life Path | Soul Number | Personality currently occupies level 3 in overview; Personal Year is not implemented |
| Proposed new name | Destiny Code | Soul Number | Personal Year / Current Cycle |
| Hook result user receives | Archetype such as Builder, Teacher, Creator, Mystic, Leader, Protector | Inner desire / heart-drive number | Current-year theme and timing guidance |
| Input needed | Birth date | Full name, ideally full legal/birth name | Birth date plus current year |
| Content type | Calculation | Calculation | Calculation |
| Whether current code already supports it | Mostly. Life Path calculation and number traits exist | Mostly. Soul Number calculation exists from first name vowels | Not yet. Current cycle/personal year logic is not implemented |
| What needs to change later | Rename/reframe Life Path output as a fast `Destiny Code` archetype result | Improve name input handling and make missing-name flow actionable | Add Personal Year calculation and result content |

### Human Design

| Field | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Discipline | Human Design | Human Design | Human Design |
| Level number | 1 | 2 | 3 |
| Current node name in code | Type | Authority currently implemented as level 2 | Profile currently occupies level 3 in overview |
| Proposed new name | Energy Type | Body Map | Authority |
| Hook result user receives | Generator, Projector, Manifestor, Reflector, Manifesting Generator | Visual body chart / defined centers concept | Decision-making authority result |
| Input needed | Quiz for MVP; birth data later | Birth date/time/place later | Quiz for MVP; birth data later |
| Content type | Quiz | Visual interactive / future feature | Quiz / calculation later |
| Whether current code already supports it | Yes for quiz-based MVP | No. Overview has Centers later, but no body chart interaction | Yes, but currently implemented as node 2 |
| What needs to change later | Rename Type to Energy Type and make the result immediate | Move Authority from level 2 to level 3 when Body Map exists; add placeholder/locked body chart concept | Preserve current authority quiz but reposition it |

### Past Life

| Field | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Discipline | Past Life | Past Life | Past Life |
| Level number | 1 | 2 | 3 |
| Current node name in code | Soul Age | Karma | Past Life Sign currently occupies level 3 in overview |
| Proposed new name | Past Life Role | Past Life Story | Karmic Pattern |
| Hook result user receives | Role such as Healer, Warrior, Priest, Scientist, Artist, Explorer, Teacher, Ruler | Short narrative/result based on role and answers | Karmic theme/pattern |
| Input needed | Quiz | Quiz result plus optional follow-up prompt | Quiz |
| Content type | Quiz | Narrative result / future generated or templated story | Quiz |
| Whether current code already supports it | Partly. Soul Age quiz exists, but not role-based | No dedicated story node | Partly. Karma quiz exists as node 2 |
| What needs to change later | Replace/reframe Soul Age as role-first hook | Add a short templated Past Life Story node | Move current Karma content to level 3 and rename to Karmic Pattern |

### Soulmate

| Field | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Discipline | Soulmate | Soulmate | Soulmate |
| Level number | 1 | 2 | 3 |
| Current node name in code | Venus | Heart Line | Synastry currently occupies level 3 in overview |
| Proposed new name | Soulmate Archetype | Future Soulmate Sketch | Attraction Pattern |
| Hook result user receives | Archetype such as Protector, Mystic, Adventurer, Intellectual, Creator, Healer | Placeholder/concept for future visual soulmate sketch | Attachment/attraction pattern |
| Input needed | Quiz for MVP; profile data optional | Future feature; likely quiz + generated visual later | Quiz |
| Content type | Quiz | Future feature / visual placeholder | Quiz |
| Whether current code already supports it | Partly. Venus love style exists, but uses `getMockUser` and is not the requested archetype quiz | No | Partly. Heart Line attachment quiz exists as node 2 |
| What needs to change later | Replace Venus-first node with archetype quiz or move Venus to Astrology/Love later | Add locked placeholder that clearly says future feature | Move current Heart Line quiz to level 3 and rename/reframe |

### Spiritual Practices

| Field | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Discipline | Spiritual Practices | Spiritual Practices | Spiritual Practices |
| Level number | 1 | 2 | 3 |
| Current node name in code | Meditation | Breathwork | Visualisation currently occupies level 3 in overview |
| Proposed new name | Spiritual Element | Grounding Practice | Breathwork / Meditation |
| Hook result user receives | Element such as Earth, Water, Fire, Air, Aether | Matched grounding ritual based on element | Breathwork or meditation practice |
| Input needed | Short quiz or profile-based MVP | Level 1 result | User choice / timer |
| Content type | Quiz or profile-based calculation | Practice | Practice |
| Whether current code already supports it | No dedicated element quiz | Partly. Top-level Sky node is `Grounding Practice`, but detail node is Meditation | Yes. Meditation and Breathwork timers exist as nodes 1 and 2 |
| What needs to change later | Add Spiritual Element quiz/result | Create matched grounding practice content | Reposition existing Meditation/Breathwork as level 3 or split later |

## Recommended MVP Implementation Order

1. Numerology Level 1: Destiny Code
   - Lowest risk because Life Path calculation and traits already exist.
   - Main work is renaming/reframing output into a fast archetype result.

2. Astrology Level 1: Cosmic Archetype
   - Birth date and zodiac data already exist.
   - Strong hook potential with minimal new mechanics.

3. Human Design Level 1: Energy Type
   - Current quiz already returns the desired core result.
   - Rename/reframe to hook-first, with education after result.

4. Past Life Level 1: Past Life Role
   - Quiz infrastructure exists, but result taxonomy needs new role mapping.
   - Strong emotional hook, good conversion value.

5. Soulmate Level 1: Soulmate Archetype
   - Needs a new quiz/result mapping and should stop depending on mock user data.
   - High conversion value, but more content work.

6. Spiritual Practices Level 1: Spiritual Element
   - Requires a new element quiz/result and matching practice structure.
   - Useful, but less directly tied to existing first node implementation.

7. Level 2/3 reshuffles
   - After Level 1 hooks are stable, reposition current Level 2 and Level 3 content.
   - Avoid moving routes until content and unlock model are reviewed.

## Which Current Nodes Should Be Renamed

Top-priority rename/reframe candidates:

- Astrology
  - `The Sun` / `Sun` -> `Cosmic Archetype`
  - `The Moon` / `Moon` -> `Personal Sky Map` or `Moon Insight`

- Numerology
  - `Life Path` -> `Destiny Code`
  - Keep `Soul Number` as Level 2.

- Human Design
  - `Type` -> `Energy Type`
  - `Authority` should eventually become Level 3 after Body Map exists.

- Past Life
  - `Soul Age` -> `Past Life Role`
  - `Karma` -> `Karmic Pattern`

- Soulmate
  - `Venus` -> likely replace with `Soulmate Archetype`
  - `Heart Line` -> `Attraction Pattern`

- Spiritual Practices
  - `Meditation` -> move later or reframe under `Breathwork / Meditation`
  - Add `Spiritual Element` as the new first hook.
  - Add `Grounding Practice` as Level 2.

## Which Nodes Should Stay Future / Locked

- Astrology Level 3: Love & Attraction / Venus
  - Keep future/locked until ownership between Astrology and Soulmate is clear.

- Numerology Level 3: Personal Year / Current Cycle
  - Keep future/locked until Personal Year calculation and copy exist.

- Human Design Level 2: Body Map
  - Keep future/locked or placeholder-only until interactive body chart concept is designed.

- Past Life Level 2: Past Life Story
  - Keep future/locked if it requires generated narrative or a larger story template system.

- Soulmate Level 2: Future Soulmate Sketch
  - Keep future/locked. This is a future feature and should not overpromise unless clearly labeled.

- Weekly Soul Report
  - Keep future-only until a dedicated route, content model, and unlock logic exist.

- Existing discipline nodes 4-8
  - Keep locked/future until detail pages are implemented. Current overview maps list many nodes that do not have corresponding detail content.

## Risks / Product Notes

- Route stability:
  - Current routes can remain unchanged while labels and content framing change.
  - Example: `/sky/astrology/1` can display `Cosmic Archetype` without changing the route.

- Naming drift:
  - Top-level Sky labels, discipline overview nodes, detail page titles, preview sheets, and progress labels currently drift from one another.
  - Future implementation should define one content source of truth per discipline.

- Conversion vs accuracy:
  - Hook nodes should feel personal, but Astrology, Venus, Moon, and Human Design calculations are approximate in MVP.
  - Avoid claims that imply precise chart calculation unless birth time/place and reliable chart logic are added.

- Premium expectations:
  - High-conversion labels like `Future Soulmate Sketch` and `Body Map` can create strong expectations.
  - Keep future/locked states explicit until these features are real.

- Duplicate Venus ownership:
  - Venus can belong to Astrology, Soulmate, or a Love path.
  - Avoid duplicating the same Venus result in two places unless the framing is intentionally different.

- Existing local progress:
  - Renaming nodes should not reset progress.
  - Keep node ids and route params stable unless a migration plan exists.

- Content tone:
  - Each Level 1 should lead with a result name and short emotional interpretation.
  - Educational explanations should come after the result, not before it.

- Implementation note:
  - Prefer adding display/content metadata instead of renaming internal ids.
  - Keep underlying ids/routes such as `astrology/1`, `numerology/1`, `humandesign/1`, `pastlife/1`, `soulmate/1`, and `spiritual/1` stable for MVP.
