# Atlaslope v1: builder brief (draft, 16 Oct 2026)

**In the repo since the restart commit (16 Oct 2026).** This file is now the source; the project-files copy is superseded. Paths below that point at `/mnt/project-files/atlaslope/` for scope, decisions and handoffs now live at `docs/scope.md`, `docs/architecture-decisions.md` and `docs/handoffs/`; the mocks are in `Review/mock-atlas-v3/`, `Review/mock-atlas-v2.2/` and `Review/mock-flow/`.

**Status:** approved. The owner said go on 16 Oct 2026 12:51Z ("I think we're good to go") after walking through the plan; the go covers the restart, the data step and releases 3 to 5, with the re-estimate after release 3. Once building starts this file moves to `Review/builder-brief.md` in the repo, and each slice below becomes one issue and one or more task cards (format in `docs/AGENT_ROLES.md`). The cloud environment with the source hosts allowed was not yet added at 12:52Z [V, environment list]: the restart (step 0) does not need it; the data step (step 1) does, or falls back to the GitHub run.

## What we are building
Atlaslope is the wine study atlas for WSET and Wine Scholar students (owner, 17 Oct 2026; was "the wine atlas that quizzes you", wine lovers first; see `docs/scope.md` "Job"), starting with Spain. The quiz with memory is the spine. The atlas and the guides give the why.

## Sources of truth, in this order
1. **Scope:** `/mnt/project-files/atlaslope/scope.md`, the owner's decisions.
2. **Architecture:** `/mnt/project-files/atlaslope/architecture-decisions.md`, 47 decisions with their tags.
3. **Look and flow:** the round 3 mocks in `/mnt/project-files/atlaslope/mocks/atlas-v3/` (nine pages) and the quiz screens of round 2.2 in `../atlas-v2.2/` (setup, find it, choices, fact, results), placed inside the round 3 top bar and menus. The flow sketch `/mnt/project-files/atlaslope/mocks/flow/index.html` lists every screen and how they connect.
4. **Repo rules:** `CLAUDE.md` and `docs/AGENT_ROLES.md`.

Where these disagree, the higher one wins. Any gap goes to LeadBot. The builder does not invent behaviour.

## Decisions interview (16 Oct 2026, 10:30 to 10:54Z)
All key decisions were cleared by angle before building: hosting and accounts, product, usability, content and data, code and platform, privacy, cost and growth. They are in scope.md ("Build decisions" rounds 1 to 6) and architecture-decisions.md (#31, #33 to #40). Interface code is React. What still waits on the owner is listed at the end of scope.md.

## Step 0: the restart (one commit, LeadBot)
- Rename Paraje to Atlaslope (owner, 16 Oct 12:08Z): wordmark in the reference mocks, strings, README, package name; ask the owner before renaming the GitHub repo (GitHub redirects the old URL).
- Add a content notice: MIT covers code only; the owner's writing is all rights reserved (owner, 16 Oct 10:59Z).
- Remove `src/`, the old UI tests and `public/mocks/atlas-v2/`. The mocks move to `Review/mock-atlas-v3/` as the visual reference.
- Keep `data/`, `data/SOURCES.md`, the data tests, `Tools/check.sh`, the CI and deploy workflows, `.claude/` and the docs.
- Rewrite `CLAUDE.md`, `docs/AGENT_ROLES.md` and the release skill from `/mnt/project-files/atlaslope/way-of-working.md`, and add the `publish` workflow (workflow_dispatch: tags `release-N` and deploys) [O, cards 10:18 to 10:19Z; review 16 Oct].
- Move scope, decisions, this brief and the handoffs into the repo (`docs/`, `docs/handoffs/`). Open one issue per slice below.
- Don't commit the mocks' `data.js` (4.3 MB) or their MapLibre copy; `Review/mock-atlas-v3/` keeps the HTML, CSS and fonts only and points at `/mnt/project-files/atlaslope/mocks/atlas-v3/` for the rest.

## Step 1: data before code (a GitHub Actions workflow; the owner's Mac only if GitHub can't reach the hosts)
Cloud threads could not reach any content source on 16 Oct [V, review 16 Oct]; the network was opened on 18 Oct, so try a host directly first and fall back to this run only when refused. The hosts were: mapa.gob.es, boe.es, eAmbrosia, ign.es, Wikimedia and Wikipedia, naciscdn.org and both Esri hosts. So this one run fetches everything the build and the writing need, and commits it or its extracts.
- Fetch boundaries for Campo de Calatrava and Cebreros (both quizzed) and the 14 Vinos de Pago (never asked). The source is the ministry service or each pliego's municipality list, done the way the Rioja zones were.
- Bundle Natural Earth for the atlas base, extended to cover the Canary Islands for the inset.
- Bundle the Köppen-Geiger climate map, clipped to Spain.
- **Commit the place tree as data** (`data/places.json` with its SOURCES.md entry): 68 core places and 5 Vinos de Calidad, stable ids (#41), home parent and also-within links (#42), quiz weight, course order and north-to-south order. Release 3's tree model is code over this file.
- **Photo candidates**: the Commons query (token discipline 3) runs here and keeps about three ranked candidates per photo slot, with licence and credit.
- Each new file gets its `data/SOURCES.md` entry before it is committed. Data tests pin the counts: 68 core places, all with a boundary.
- **Source pack for the writing** (token cut, 16 Oct): the same run downloads the 68 core pliegos once and a script cuts each (73: the 68 core places and the 5 Vinos de Calidad) into a short extract (grapes, styles, altitude, soil, climate, with page numbers) in `Review/sources/<place>.md`. Writers read only the extract for their place, never the full pliego (20 to 60 pages, roughly 15k to 40k tokens each) and never browse for it. Extracts are working notes, not shipped data.

## The slices (each one a separate release)
| Release | What ships | Done when |
|---|---|---|
| **3. The atlas** | The place tree model and loader. The map shell: satellite through the keyed Esri endpoint, the atlas base, 3D terrain, sea tint and coastline, and one map menu (satellite, climate off for now, relief, boundaries). The top bar: wordmark menu with the theme toggle, search, Explore · Quiz · Progress. The Spain card, region card and place card with breadcrumbs. Shareable URLs for a place and a view. Link-only (noindex). atlaslope.com pointed at Pages when the ArcGIS key is created (bought 12:19Z; the owner does the DNS step). The first-run screen. The atlas fallback note when satellite fails. | Unit tests on the tree (ids, parents, levels, counts). Playwright walks Spain › region › place and back with fixtures. **A post-deploy workflow proves satellite and terrain load on the live site with real network; the owner glances at it.** |
| **4. The reference** (owner, 12:43Z: Explore is a full reference before the quiz) | Fact sheets for all 68 core places, every row cited, grapes as "local (main)". Up to three open-licence photos per place, credited, each in SOURCES.md. "Report a mistake" email link. Facts on the place card. A build check that fails on a row without a source. | The check is green. The owner has spot-checked two regions, one of them written last, and signed them off (owner, card, 16 Oct 12:49Z). |
| **5. The quiz** | The fact question (grapes, styles, level, climate only), asked from known. The quiz engine, working on any set of place ids (daily round, practice and intake are sets from the tree; owner, 12:39Z): rounds of 20 with Keep going, "Learn 5 more", question type by box, boxes, intake of five a session, the known and solid rules, zones after the parent. Find it (flat north-up map, about 44 px margin) and what is this. Right answers flow, misses wait with the why line; one "That was a slip" undo. Results with misses linking to the place. The Today card with something due and with nothing due. Progress in the browser, versioned, with save and load to a file and a Home Screen manifest. Also everything in scope.md "Quiz first principles" and "Learning engine": the new-place intro, the Study and Review doors, practise any mix, focus, two memories per place, a miss re-asked at the end of the round; built from the mock round below. Mixed-up pairs and the Study include list move after v1 (owner, card, 16 Oct 12:49Z); the answer log keeps what pairs will need. | The engine is unit-tested without a map: due dates, intake, state changes, zone unlock, migration from an empty and from an older record. Playwright runs a ten-question round end to end. |
| **6. The guides** | The guide template with the at-a-glance strip, fly-there buttons, zones, neighbours, sources and next place. Guides for Rioja and its three zones (owner, card, 16 Oct 12:34Z; Green Spain and Castilla y León follow as the first content releases). Places without a guide yet show the template with facts and fly-there only. | Every guide's fly-there buttons land on what the text says. Owner spot-check. |
| **7. Progress and climate** | The mastery map: four shades, due rings, zones once the parent is known, counts per region, reset with confirm and undo. The climate layer switched on in the map menu. | Playwright checks the shades from a fixture progress record. The climate legend names its source. |
| **8. Ready for friends** (owner, 16 Oct 11:02Z) | Moved from releases 3 and 4: Sentry error reports (EU), PostHog analytics (EU; retention question revisited), the privacy note in About, and the offline shell (service worker). Then friends are invited. | Playwright's offline test passes. Sentry receives a test error. The privacy note names both services. |

The remaining guides follow as content releases: Green Spain and Castilla y León first, then region by region in course order.

## Defaults written in from the first-principles review (16 Oct) [A unless tagged]
- Intake is five new places per day, not per session.
- Release 3 shows no known counts on the Spain card or the Today card; counts arrive with progress in release 5.
- Grapes join search in release 4, with the fact data.
- "What is this" distractors are three other places from the same study region.
- Vinos de Calidad unlock when all core places of their region are known.
- Cava and the generic DO Cataluña stay out of the quiz pool (on the map and in Explore); the place is named "León" (ministry name), not "Tierra de León" (open in the taxonomy check, default from the plan review, finding 6).
- The "Report a mistake" address is needed before release 4 (it ships with the fact sheets), not release 5.
- The 2 MB download budget means compressed transfer size (`dops.geojson` alone is 1.6 MB raw, 0.5 MB gzipped [V, review]).
- Release 3: point atlaslope.com at Pages when the ArcGIS key is created, so the key gets one referrer from the start (the owner does the DNS step).
- iPad: the first-run screen says "Add to Home Screen before your first quiz" (Safari and the Home Screen app keep separate storage), and the app nudges a save-to-file after each week of answers. Verify on his iPad in release 5.
- Quiz first principles (owner, 12:37 to 12:38Z, in scope.md): every answer reveals the place with one fact from day one; the fact question starts at known; a new place gets a short intro before its first question; "Practise any mix" (whole regions or single places, 10 or 20 questions) sits next to the daily round; the engine works on sets of places, so course order is a default, not a rail (owner, 12:39Z); a focus setting makes new places come from chosen areas first (owner, 12:39Z); the Quiz screen has two doors on that one engine, Study (curriculum, daily round, with an include list of areas; owner 12:41Z) and Review (any mix) (owner, 12:40Z); no points, streaks or reminders; goal 1 is 40 known after three weeks.
- Learning engine (owner, 12:41 to 12:42Z, in scope.md): boxes with fixed gaps for v1, every answer logged; two memories per place (where and what); right or wrong only; a miss drops one step and is re-asked at the end of the round; mixed-up pairs come back together.
- Release order (owner, 12:43Z): atlas (3), then reference (4: all 68 fact sheets, photos, facts on the place card, the source check), then quiz (5). The quiz has every fact from day one.
- Before release 5 (the quiz) is built, one mock round (with its UX and UI check): the new-place intro, the answer reveal with the fact, the setup screen reworked into the "Practise any mix" picker, and the focus setting.

## How every slice is built
- LeadBot writes the task card. BuilderBot builds it in its own worktree: Sonnet 5.5 by default, Opus only for complex work such as the quiz engine and the tree model (owner, 16 Oct). The builder thread itself runs on Opus 5.5. ReviewBot reviews the diff with fresh eyes. `Tools/check.sh ui` must be green before the merge.
- Cards hold at most three steps or one concern, and each ends in a working, committed state.

### Token discipline (added 16 Oct after the owner asked to bring the estimate down; none of it changes a settled decision)
1. **Writing goes to Sonnet agents, not the lead.** Fact sheets and guides are written by Sonnet 5.5 builder agents, one region per card, from the source pack and a fixed template. The Opus lead checks a sample against the extracts; the build check and the owner's spot-check stay. A Sonnet token costs half an Opus token at list price [V, Anthropic price list: $2 vs $4 per M input, $10 vs $20 output].
2. **One release digest, no whole-file reads.** At the start of each release the lead writes one page, `Review/release-N-digest.md`: the scope and decision lines that apply, the mock files and line ranges, the files to touch. Cards point at the digest. Agents never read scope.md, architecture-decisions.md or this brief whole, and never open `data.js`, `maplibre-gl.js`, `data/*.geojson` or `*.tif`. The restart commit adds those paths to `.claude/hooks/narrow-read.sh`.
3. **Photos by script.** It runs where the data step runs (GitHub Actions, or the Mac), since cloud threads cannot reach Wikimedia Commons. A script queries Wikimedia Commons near each place, keeps only public domain, CC BY and CC BY-SA, ranks by Commons quality flags and size, and writes credits and licence for `data/SOURCES.md`. Claude picks from one contact sheet per region (a single image of the candidates), not by reading pages one by one. The owner can still swap any photo.
4. **One review per release PR, sized to risk.** ReviewBot reviews each slice's PR once (not each card): Sonnet for routine diffs and writing (it checks a random sample of rows against the extracts), Opus for the tree model (release 3) and the quiz engine (release 5).
5. **A fresh lead thread per release.** Each release starts from the previous handoff and the digest, not from a long thread that carries every earlier release. The lead reads agents' 300-word reports, not their diffs.
6. **Measure, then re-estimate.** After release 3 the lead re-runs this estimate with the measured figures from the spend log and tells the owner before release 4 starts. The 50% brake stays.
- Releases go out only on the owner's words "publish release N". The thread then starts the `publish` workflow, which tags and deploys; if the platform refuses, the owner gets the one tap in the GitHub app.

## Context
The owner paused building on 16 Oct to settle the whole system in mocks first. Release 2 felt "less than a mock-up" and showed him a black map. Today the scope, the flow, the place tree navigation, the quiz rules, the imagery, the writing plan and the architecture are settled, and the round 3 mocks have his approval ("I like the mock-up").

## Upside (measured, not described)
- **The spine works.** Goal 1 (owner, 12:38Z): 40 of the 68 core places known after three weeks of use, read from the answer log. Re-run it on the owner himself, comparing session one with session three, once release 5 (the quiz) ships.
- **The look matches the mock.** Named cases: the owner opens home, Rioja's guide and the mastery map on his Mac and sees satellite with strong DO colours, not a black map. Release 2 failed exactly this case.
- **The world scaffold holds.** Adding a second country means new data files only. Test it with a two-place fixture country in the tree tests, with no app change.

## Risks
1. **Writing is the real cost.** 68 cited fact sheets plus guides, and a wrong fact teaches a wrong answer. Mitigation: the source check, the owner's spot-checks, and guides in course order.
2. **Imagery on his screen.** The cause of the release 2 black map is still unknown [A]. Mitigation: the post-deploy workflow proves satellite and terrain load on the live site in release 3, and the owner glances at it, before anything else ships.
3. **The data fetch** depends on Spanish government and other hosts that cloud threads cannot reach and that may change. Mitigation: one GitHub Actions run fetches everything first (the Mac only as fallback), and the result is committed data.
4. **Over-built scaffolding.** World-ready only means the tree and per-country level names. Nothing else gets built for France.

## Effort (re-run 16 Oct 12:45Z, estimate [A]; measured cost goes in `Review/agent-spend-log.md`)
Unit: the token figure each agent run reports, as in the spend log. It is a planning unit, not a bill. Anchors: release 2 measured an Opus build card at 92k plus 117k for its fix round and an Opus review at 54k [R, spend log]; Vintro measured Sonnet cards at 45k to 125k, Opus cards at 330k to 360k, Sonnet reviews at 20k to 70k [R].

**What the old figure (3.8 to 6.2 M) missed.** Its rows add up to 3.6 to 6.15 M, not 3.8. It had no line for the Opus lead thread that runs each release (about 0.8 to 1.5 M over seven long threads [A]). It put the fact sheets on the Opus lead and did not count reading 68 pliegos (15k to 40k tokens each, 1 to 2.7 M if read whole). It sized 18 guides of 700 words as two cards. Counted honestly, the old plan was about **4.5 to 7.5 M**.

| Part | Model | Tokens after the process cuts |
|---|---|---|
| Restart commit and data step (incl. 14 Pago boundaries) | Sonnet | 0.2 to 0.35 M |
| Source pack (pliego extracts, one run) | Sonnet | 0.1 to 0.15 M |
| Release 3, atlas (tree model on Opus; live map check) | 1 Opus, 3 Sonnet cards | 0.45 to 0.7 M |
| Mock round before release 5 (quiz): intro, fact reveal, practice setup | lead | 0.05 to 0.1 M |
| Release 5, quiz (engine on Opus in two cards: sets, focus, two memories; pairs and include list moved after v1 at 12:49Z, saving about 0.1 to 0.15 M [A], not yet taken off this row; screens on Sonnet: intro, fact reveal, Study and Review doors) | 2 Opus, 3 Sonnet | 0.8 to 1.15 M |
| Release 4, reference: fact sheets for 68 places and the source check | Sonnet, 4 to 5 cards | 0.35 to 0.5 M |
| Release 4, reference: photos by script and contact sheets | Sonnet | 0.1 to 0.15 M |
| Release 6, guide template and Rioja plus its three zones (owner chose Rioja only, 12:34Z; the other 17 guides move to content releases) | Sonnet, 1 to 2 cards | 0.15 to 0.2 M |
| Release 7, mastery map and climate layer (climate about 0.1 to 0.15 of it) | Sonnet | 0.25 to 0.4 M |
| Release 8, offline shell, Sentry, PostHog, privacy note | Sonnet | 0.2 to 0.3 M |
| Reviews, one per release PR (Opus for the atlas and the quiz) | mixed | 0.35 to 0.55 M |
| Lead thread, fresh per release | Opus | 0.55 to 0.85 M |
| **Total to v1** (Rioja-only guides, the quiz and engine picks of 12:37 to 12:42Z) | | **about 3.6 to 5.5 M** |

Scope options put to the owner on 16 Oct 12:34Z [O]: guides at launch for Rioja only, **taken** (saves 0.3 to 0.45 M from v1, moved to content releases, not removed); climate layer after v1, **declined** (stays in release 7); Pago boundaries after v1, **declined** (fetched in the data step). Before the first re-estimate (after release 3) the go commits about 1.0 to 1.6 M: restart, data step, source pack and release 3, with their share of lead and review [A, sum of the rows above].

**Scope of the go** (owner, cards, 16 Oct 12:34Z and 12:43Z): when he says go, it covers the restart, the data step and releases 3 to 5: atlas, reference, quiz (incl. the source pack and the mock round before the quiz). About 2.5 to 3.8 M (was 1.6 to 2.5 M before the quiz, engine and reference picks). Releases 6 to 8 wait on the re-run estimate and a new go. The re-estimate after release 3 still comes before release 4 starts. [O]

Brake (owner, 16 Oct): a release that runs 50% over its estimate pauses and asks the owner.
