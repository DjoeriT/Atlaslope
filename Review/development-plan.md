# Paraje development plan, v1

16 Oct 2026. Draft for the owner. Tags: [V] verified in files, [O] owner decision, [R] reported, not re-checked, [A] assumed.

## The boundary (owner, 16 Oct 2026)
- Mocks decide how a screen looks and reads; the app decides how it behaves. Round 2.1 is the frozen visual spec. [O]
- Only three new screens get a mock before build: the fact question ("region, climate or soil"), the Rioja lesson (#4), the elevation profile (#3). Quiz memory, leak fixes, skip rules and due counts go straight into the app on the 2.1 look. [O]
- Mocks are never updated again. Each one comes off the site in the release where its app screen ships. [O]
- The taxonomy check runs alongside the build. It is already done: ten study regions from `data/dop-overrides.json`, quiz pool of 65 core DOs plus six Vinos de Calidad, Vinos de Pago left out (`reviews/2026-10-16-taxonomy-check.md`). [V]
- Imagery under the map (owner, 16 Oct 2026): EOX Sentinel-2 cloudless at country and region scale, Esri World Imagery when zoomed in close, cross-faded around zoom 9 to 10 [O; the zoom level is a default to tune by eye]. First step of release 2 is reading Esri's terms for a free public site; if they require an account or forbid it, that comes back to the owner as a question, with Sentinel-2 cloudless (EOX) as the alternative.

## Milestones
Each ends in a release you can open at djoerit.github.io/Paraje. Releases need a session on your Mac for the tag [V, release 1].

### Release 2: the atlas, for real
What you see: the full-screen 3D map of Spain, satellite under it (EOX far out, Esri close in), the corrected DO layer coloured by the ten study regions, a DO card on tap (name, level, study region, neighbours), search, preset views (Spain, each study region, Rioja), light and dark.
Under it: `src/dops.ts` feeds the map; tests pin the counts (2 DOCa, 69 DO, 7 VC) and the card's fields; UI tests on a fixture with no tile requests.
Retires the mocks: 01 Explore Spain, 02 Explore Rioja (its zones come back in release 6).
Needs your OK: the imagery source and AWS terrain tiles (both networked services; terrain is what the mocks already use).

### Release 3: the quiz, honest
What you see: Quiz mode on the same map. Ten questions, "Find X" (tap the map) and "What is this?" (four choices). Results with misses circled on the map, each miss a link to its Explore card, and "Test me on this again" on the card.
Your decisions built in: no type-the-name field, keyboard users get choices; only DO names hidden, rivers, cities and ranges stay; no search box and no region hint before Confirm. Review fixes: skip counts as a miss and says so, a wrong find shows both the tapped and the right DO, "What is this?" varies zoom and dims neighbours (the Priorat-in-Montsant leak).
Under it: a quiz engine with no map code in it, tested first (question pool, no leak in the question text, scoring).
Retires: 00 setup, 03 find, 03b choices, 04 results.
Measured upside starts here: your session one score on 40 DOs is the baseline.

### Release 4: the quiz remembers
What you see: Start quiz says "12 due today" and asks those first; misses come back next session, known DOs fade out. Results say "DOs you can place: 31 of 71" (right on the last two tries), not a lifetime percentage.
Under it: Leitner boxes per DO in the browser (plain JSON in localStorage). Contract tests for the schedule before the code.
This is the release that should move your session three score. Smallest code, biggest effect [A].

### Mock round 2.2, in parallel with releases 2 to 4
Three pages on the 2.1 stack: fact question, Rioja lesson, elevation profile. ReviewBot design check, fixed in the mock, then you look. Owned by the mock-ups thread.

### Release 5: the fact question
What you see: "The highlighted DO: which climate (or soil, or study region) is it?" with four choices, map tilted, soil layer off until answered.
Under it: a fact table per DO (climate type, main soils, study region). This is the hard part: no open dataset has it [R, scouting]. Source: each DO's official pliego de condiciones (public, Spanish), every row cited in `data/SOURCES.md`, nothing from the Guild's own materials. You spot-check ten rows before release.

### Release 6: the Rioja lesson (#4)
What you see: a short guided tour of Rioja (three zones, the Ebro, the Sierra de Cantabria, the hillshade, the schematic soil layer labelled as schematic), ending in a five-question test that feeds the memory.

### Release 7: the elevation profile (#3)
What you see: draw a line across the map, get a height profile (for example Ebro valley floor up to Rioja Alta).
Under it: heights read from the same terrain tiles the map already uses, so no new dataset.

## Not in v1
Missing polygons for 16 DOPs and the 43 IGPs (issue #1 step two; the pool excludes the Pagos, so it does not block the quiz [A, check Cebreros and Campo de Calatrava against the pool]). Priorat deep dive. Sync or export of progress. World coverage.

## Who does what
The setup thread owns the repo and builds releases 2 to 7, one issue per release. The mock-ups thread owns mock round 2.2. Builders work in worktrees, ReviewBot checks each diff. You say "publish release N" each time.

## Context
Round 2.1 settled the look; the review settled that the quiz logic is the product. The app today is a bare map shell of 98 lines [V], with the corrected DO data and tests in place.

## Upside
Measured with the brief's own test: your score on 40 named DOs at session one (possible from release 3) versus session three (after release 4). Secondary: the four review leaks each get a test that fails if they come back, so the score stays honest. Nothing here is measured yet; the baseline comes from your first quiz session.

## Risks
1. Fact data (release 5) can teach wrong answers. The pliegos are long and inconsistent; one wrong soil row is worse than no question. Mitigation: cite every row, you spot-check, ship climate first if soils prove messy.
2. Imagery licence. Esri's terms for a public site without an account are unclear [R; a quick search on 16 Oct found only forum threads]. If they need an account or say no, release 2 waits on your call between a free Esri account and Sentinel-2.
3. Progress lives in one browser. Your iPad and your Mac will each have their own memory [O, your v1 choice]. Fine for you, confusing for friends; say so on the screen.
4. iPad performance with 3D terrain and 71 polygons is untested [A]. Release 2 gets an iPad check before it ships.
5. Every release needs your Mac for the tag. Cheap, but it means a release waits until you are near it.

## Effort [A, agent days, not tested]
Release 2: two days. Release 3: two to three. Release 4: one. Mock round: one, in parallel. Release 5: two build plus one to two for the fact data. Release 6: two. Release 7: one. Roughly two weeks of agent work to v1, with releases 2 to 4 (the core study loop) inside the first week.
