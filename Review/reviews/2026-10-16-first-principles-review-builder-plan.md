# First-principles review of the builder plan (16 Oct 2026, 12:30Z)

Reviewed: `builder-brief.md` (as of 12:08Z) against `scope.md`, `architecture-decisions.md` (#1 to #47), `way-of-working.md`, the round 3 and 2.2 mocks and the handoffs. The thread "Cutting the build cost" owns the brief; nothing here edits it. Tags: [V] checked now, [O] owner said so, [R] from a file or memory, [A] my judgement.

## Verdict
The shape is right: data before code, a pure quiz engine with the most tests, one release per slice, a live map check after deploy, a token brake. It would still stall in three places, in this order: the writing and photo work can't reach its sources from the cloud threads that are meant to do it; the main success goal can't be reached by the quiz rules as decided; and the quiz setup mock the builder is told to follow contradicts the quiz rules. The rest is stale wording that a builder would trip over.

## Findings, most important first

### 1. Content sources are unreachable from cloud threads (blocks releases 5 and the photos)
- [V] From this cloud thread, these hosts fail: www.mapa.gob.es, www.boe.es, ec.europa.eu (eAmbrosia, where the EU product specs live), www.ign.es, commons.wikimedia.org, upload.wikimedia.org, en.wikipedia.org, naciscdn.org (Natural Earth), server.arcgisonline.com and ibasemaps-api.arcgis.com (Esri). Only npm and the AWS terrain tiles answer.
- The brief routes only the boundary fetch around this (step 1). But release 5 has LeadBot writing 68 fact sheets from the pliegos, and the photo card has Claude picking about 200 Wikimedia photos. Neither can happen in a cloud thread as configured. Natural Earth and Köppen bundling in step 1 hit the same wall.
- Fix options: (a) the owner adds a cloud environment for this project with those hosts allowed (one dialog in Project settings, then every later thread can fetch, read and test); (b) step 1 also fetches the 73 pliegos (68 core plus 5 VC), Natural Earth, Köppen and the photo candidates through GitHub Actions or his Mac, and commits text extracts so the writing works from the repo; (c) a Mac session per fetch. Recommendation: (a), with (b) as the record: whatever is fetched is committed, so no later step depends on network luck. Card 1.

### 2. The headline goal can't be met by the decided quiz rules
- Goal [O]: after three sessions the owner places 40 of the 68 core places. Rules [O]: five new places a session; known means right on the last two tries.
- Three sessions at five new is 15 places introduced, so at most 15 can be placed, and fewer can be "known" because known needs two right answers on separate asks. Reaching 40 needs about 15 new a session via "Learn 5 more" twice each time, which is the opposite of the default.
- There is also no way to measure "places 40": the quiz only asks what is due or new, so nothing tests all 68 at once. The answer log (#43) measures what was asked, not what he could place.
- Fix: restate the goal in the engine's own terms. Recommendation: "40 of the 68 core places known after three weeks of use", read from the answer log; weekly use stays goal two. Card 2.

### 3. The quiz setup mock contradicts the quiz rules
- The brief points the builder at the round 2.2 quiz screens, setup included. That setup screen [V, `atlas-v2.2/00-quiz-setup.html`] lets you pick area, question types ("Region, climate or soil") and 10 or 20 questions, and says Vinos de Calidad are asked only in an All of Spain quiz.
- The rules decided since [O]: question type follows the box, rounds of 20, intake in course order, the fact question asks grapes, styles, level and climate (not soil), and the Vinos de Calidad join once their region's core places are known.
- Release 4 does not list a setup screen at all, while the guide's "Test me on this" and the region card imply quizzing a chosen place or region. So the builder must either build a screen that breaks the rules or invent one, and "the builder does not invent behaviour".
- What's missing is a decision: is there a practice quiz next to the daily memory round, and does it touch memory? Recommendation: keep "Practise a region" (area and 10 or 20 only, question type by box); a practice miss drops the place, a practice right answer before it is due doesn't move it up. Trim the setup mock to that and LeadBot checks it. Card 3.

### 4. Release 5 is under-estimated; the brake will trip [A]
- 0.4 to 0.7 M tokens for 68 cited fact sheets. A pliego runs to roughly 15 to 40 pages, say 10 to 25 k tokens; reading 73 of them whole is about 1 to 2 M before a word is written. Photo picking means looking at several candidates per slot, about 200 slots.
- Cut that cost by design rather than by trimming the estimate: in the data step a script extracts only the sections the fact sheet needs (grape varieties, wine types, geographic area, the link with the area) from each pliego, and the photo step pre-filters Commons by licence and size so Claude looks at a shortlist of about three per slot. Then 0.4 to 0.7 M becomes plausible.

### 5. Step 0 is missing the way-of-working rewrite, and the brief contradicts it
- [O, cards 10:18 to 10:19Z] Git is the record; scope, decisions, brief and handoffs move into the repo at the restart; one PR per slice on a claude/ branch; a publish workflow (workflow_dispatch) tags `release-N` and deploys. None of this is in step 0.
- The brief says "He runs `git tag` himself, as learned at release 2". That contradicts the publish workflow and the project instructions.
- The repo's `CLAUDE.md` [V] still describes LeadBot on his Mac pushing `main` and tags, and `deploy.yml` [V] runs on a pushed tag. Step 0 should rewrite `CLAUDE.md`, `docs/AGENT_ROLES.md` and the release skill from `way-of-working.md`, and add the publish workflow.

### 6. The place list itself is not data yet
- [V] `data/dops.geojson` has 90 features with code, name, kind, type and label; `data/dop-overrides.json` maps codes to the ten regions. The 68-place core pool, the 5 Vinos de Calidad, course order and north-to-south order exist only in the taxonomy review, not in `data/`.
- Step 1 should commit the place tree as data (stable ids per #41, home parent, also-within links per #42, quiz weight, course order) with its SOURCES.md entry. The data test "68 core places" needs it; release 3's tree model is code over this file.
- Two open items from the taxonomy check are still unanswered: whether Cava and the generic Cataluña DO are exam material, and "León" versus "Tierra de León". The builder needs a default; I'd keep both out of the pool and use "León" (ministry name), as now.

### 7. Behaviour gaps the builder will hit (defaults proposed, no card needed)
- "Session" is undefined, and the files disagree: scope says five new "a session", decision #15 refined says "a day". Default: a day, since the intervals are in days.
- Spain card known counts and the Today card need progress, which arrives in release 4. Default: release 3 shows no counts.
- Search on grapes in release 3 needs fact data from release 5. Default: grapes join search in release 5.
- Solid places get the fact question, which ships in release 5. Default: until then solid asks find it. In practice nothing reaches solid before about day 11 (1 + 3 + 7).
- "What is this" distractors are not specified. Default: three other places from the same study region, so the choice teaches neighbours.
- Vinos de Calidad unlock "once the region's core places are known": all of them? Default: all.

### 8. iPad storage, a risk to the spine [R, not tested here]
- On iPadOS a Home Screen web app keeps storage separate from Safari tabs, and Safari can clear a site's storage after seven days without a visit. Progress made in a Safari tab doesn't follow him into the Home Screen app.
- Default: the first-run screen on iPad says "Add to Home Screen before your first quiz", and the app nudges a save-to-file after each week of answers. Verify both behaviours on his iPad in release 4.

### 9. Address and key: connect the domain earlier [A]
- The Esri key is to be referrer-locked to `djoerit.github.io` (#21) and moved to atlaslope.com from release 4 (#47). The domain is already bought [R, memory 12:19Z].
- Pointing atlaslope.com at Pages during release 3, when he creates the ArcGIS key anyway, means one referrer, one base path and one post-deploy URL from the start. Progress doesn't exist before release 4, so nothing is lost either way; this just saves a second key edit and a second round of checks.

### 10. Size budget needs a definition
- "Fails above about 2 MB download" should say compressed transfer. [V] `dops.geojson` is 1.6 MB raw and 0.50 MB gzipped, before Natural Earth, Köppen, React and MapLibre. Raw, the budget is gone on boundaries alone.

### 11. Stale lines a builder would trip over
- Brief: "32 decisions" (there are 47); risk 2 "prove it on his Mac" and risk 3 "needs his Mac" (replaced by #31 and the Actions data step).
- Architecture: #21 referrer `djoerit.github.io`; #27 says the fetch runs on his Mac; #40 says Sentry from release 3 and PostHog from release 4 (moved to release 8 by #46); "Still open" says no domain.
- Scope: "Waiting on the owner" says he still buys the domain; the boundaries section says the fetch runs on his Mac.
- Step 0 moves the round 3 mocks into `Review/mock-atlas-v3/`. Their `data.js` and MapLibre copy are about 4.3 MB, which stays in git history forever under the no-rewrite rule (the reason behind #44). Commit the HTML, CSS and generator only, and have the generator read `data/`.

## What I would not change
- Data first, engine without a map, Playwright on the built site with fixtures, the post-deploy live check, release 8 as the friends gate.
- Opus only for the engine and the tree, Sonnet for the rest.
- World scaffolding kept to the tree and per-country level names.

## Context, Upside, Risks, Effort
- **Context:** the owner asked for one first-principles pass over the full plan before he says go.
- **Upside:** findings 1 to 3 each name a point where the build would otherwise stop and wait on him mid-release: release 5 (no sources), release 4 (no setup rule) and the release 4 success test (no reachable target).
- **Risks:** findings 4 and 8 rest on estimates and platform behaviour I couldn't test from here [A, R].
- **Effort:** none of the fixes adds a release. Findings 1 and 6 add work to step 1; finding 5 adds work to step 0; the rest are wording.
