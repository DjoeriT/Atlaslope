# Atlaslope: project context

Snapshot: **16 Oct 2026**, the restart commit. `CLAUDE.md` holds the rules; `README.md` the layout and commands; `docs/AGENT_ROLES.md` the agents.
This file holds what is true now, what is decided and where, what is broken, and what comes next. The pre-restart version is
`Review/archive/PROJECT_CONTEXT-before-restart.md`.

Tags: **[V]** verified in this working copy when this snapshot was written; **[O]** stated by the owner;
**[R]** from a report or earlier notes, not re-checked; **[A]** an assumption, treat it as a question.

## 1. What Atlaslope is
The wine study atlas for WSET and Wine Scholar students [O, 17 Oct 2026; was "The wine atlas that quizzes you"]. For exam students (WSET, Spanish Wine Scholar) and passionate wine lovers, then "show the
why". Spain first, on a world place tree (country, region, DO, zone). Free for the owner and friends; read-and-test only in v1 [O].
Renamed from Paraje on 16 Oct 2026; domain atlaslope.com bought by the owner [O]. The owner renamed the GitHub repo to `DjoeriT/Atlaslope` on 16 Oct 2026 (14:07Z); the Pages project URL is now https://djoerit.github.io/Atlaslope/ until atlaslope.com is pointed at it.
Full scope: `docs/scope.md`. Architecture: `docs/architecture-decisions.md`. Build plan and estimate: `Review/builder-brief.md`.

## 2. Architecture (decided; built in release 3)
Static site, no server. Vite, TypeScript, React, MapLibre GL; satellite through a keyed Esri endpoint with the atlas drawn over it; 3D
terrain; place tree as data (`data/places.json`, from the data step); progress in the browser with save and load to a file; GitHub Pages
under atlaslope.com; CI on GitHub Actions. Details and tags: `docs/architecture-decisions.md`.

## 3. Data on main
`data/SOURCES.md` is the ledger. Kept through the restart [V]: `dops.geojson` (ministry 2014 layer, 90 DOPs), `dop-overrides.json`
(today's names, levels, study regions, 16 DOPs without a polygon), `rioja-zones.geojson`, `rioja-municipalities.json`,
`rioja-hillshade.tif`. `src/dops.ts` applies the overrides and is the only code kept; `tests/unit/dops.test.ts` pins it.
The data step (PR #17) and Urbezo (PR #20) added the place tree (`places.json`: 70 core, 6 Vinos de Calidad, 30 not quizzed, 3 zones),
the Natural Earth base, Köppen-Geiger climate, Campo de Calatrava, Cebreros and Urbezo outlines, photo candidates and the source pack.
Still missing: the outlines of 13 Vinos de Pago (#18).

## 4. What is built
Release 3, the atlas (PR #21): place tree and search (`src/tree/`), React shell with theme, first run and strings (`src/app/`), the
MapLibre map with Esri satellite, atlas base, Terrarium terrain, map menu and the imagery-failure note (`src/map/`), the Spain, region
and place cards with breadcrumbs and hash URLs (`src/cards/`, `src/url.ts`). Quiz and Progress were shown but disabled (Quiz enabled in release 7). The approved mocks are the visual reference:
`Review/mock-atlas-v3/` (round 3), `Review/mock-atlas-v2.2/` (quiz screens), `Review/mock-flow/` (every screen and how they connect).
They need `assets/data.js` and `assets/maplibre-gl.*` from the project files to run (see their README).
Release 4, the reference (PRs #23, #24): a cited fact sheet for each of the 79 quizzed places (`content/facts/<region>.json`, sources in
`content/sources.json`, checked by `checkSheets` in Vitest), measured altitude and Köppen rows (`data/place-measures.json`), 149 credited
photos for 77 places (`public/photos/`, `data/photos.json`), grapes in search. The "Report a mistake" link is built but hidden (owner, no address).
Release 6, tastes and producers (planned as 4.1, issue #27): How it tastes (76 sheets), Famous styles (75) and Famous producers (6, from
English Wikipedia by the owner's card, Lebrija from Spanish) rows on the fact sheet.
Release 7, the quiz (PR #34, issue #13): engine `src/quiz/` (answer log, two memories per place, boxes, intake, rounds, store with
file save and load), map quiz mode `src/map/quiz.ts`, screens `src/quiz-ui/` (Study and Review doors, focus, practise, round, Today card).
Quiz is enabled; Progress (the mastery map) is still disabled. Handoff `docs/handoffs/2026-10-17-release-7-quiz.md`.

## 5. Release and deployment state
Live: release 17, the quiz highlight fix with 3D relief, quiz spacing and the address-bar race (PRs #67, #69, #70; tag `release-17` on db0c0d4, publish run 39067171750, 17 Oct). Release 16, the UX sweep (PR #63: view-transition motion, a three-stop phone sheet, one page bar, End round asks first, the one-place Rioja region skipped, Escape steps up, Progress tab hidden; tag `release-16` on 86d55ea, publish run 39054367454, 17 Oct). Release 15, landscape through the colours (PR #61: place fills thin from zoom 6 over the photo; tag `release-15` on f451d41,
publish run 39047992444; live map check run 39048373912 failed twice on 0 name tiles because it stopped waiting before the names were
asked for; with the fixed check (run 39048612822) all four kinds loaded, 9 name tiles, 17 Oct) at https://atlaslope.com/. Release 14, mobile check (PR #59: Explore without a reload, Back to map steps back, search above the card, folding legend and
fitting map menu on phones, 16 px search, quiz steps start at the top; tag `release-14` on 8526daf, publish run 39044219743, live map check run 39044664030 passed on its second attempt (the first loaded photo, relief and PNOA but no OpenFreeMap name tile), 17 Oct) at https://atlaslope.com/ over HTTPS; djoerit.github.io/Atlaslope/
redirects there. Release 13, sharper map close in (PR #56): tag on 4827bea. Release 12, polish (PR #53): tag on 51c5240. Release 11, QA round (PRs #49 and #51): tag on db26b9b. Release 10, place guides (PR #45): tag on f0eada5. Release 9 (pages, photos, border fix): tag on 0c185b9. Release 8 (new look): tag on c18b463. Release 7, the quiz (PR #34): tag
on 1f110ed, publish run 39010719099, live map check run 39010972212 passed; it also carries the logo and tab title (PR #32).
Release 6: tag on e8a3f78. Release 5, the world background map: tag on 25a951e. Release 4: tag on b5c773b.
Release 3 (tag on 6a78915) passed the post-deploy live map check with 85 satellite and 85 terrain tiles [V, run 38924845710].
Numbering: the publish workflow takes only the next whole number, so the slice called "release 4.1" ships as release 6 and the quiz
(planned as release 5) as release 7 [V, publish.yml; owner said "publish release 5" for the map, 16 Oct 20:05Z].
Route from now on: one pull request per slice on a `claude/...` branch, merged after green CI and ReviewBot; releases through the `publish`
workflow after the owner's "publish release N" [O, cards 16 Oct 10:18 to 10:19Z]. A cloud thread can start that workflow [V, release 3]. The Remote Control
session on his Mac also sees his thread messages and started a second publish run 7 s apart; the workflow's tag guard stopped it harmlessly.

## 6. In flight
- Restart, data step, releases 3, 4 and 5 (world background map) are done. Release 4 agents used 0.84 M tokens against a 0.5 to 0.7 M estimate (four writer
  batches over budget, plus follow-ups) [V, spend log]. Release 6 (planned as 4.1, owner cards 16 Oct 19:37Z): tastes, famous styles
  and producers, built (PR #31); planted-area main grapes moved to issue #29, more producers to #30. Then the quiz (planned as release 5,
  now numbered 7). The owner's go (16 Oct 12:51Z) covers the restart, the data step, releases 3 and 4 and the quiz (now release 7) [O];
  4.1 (now release 6) came from his cards at 19:37Z. The planned releases after the quiz (once 6 to 8, now 8 to 10) need a new go.
- Release 7, the quiz (17 Oct, issue #13): live 17 Oct (PR #34); mocks `Review/mock-quiz-v4/` approved
  (owner card 05:44Z); engine, store and screens in `src/quiz/` and `src/quiz-ui/`; agents 0.61 M tokens [V, spend log]. Handoff
  `docs/handoffs/2026-10-17-release-7-quiz.md`. Issues #14 to #16 renumbered as releases 8 to 10, then 10 to 12 (below).
- New look (owner's go, card 17 Oct 06:48Z): release 8 = new colours and type on every screen (#36, PR from
  `claude/release-8-new-look-4kufin`); release 9 = place page, map card teaser, region page and the photo pass (#37). Plan
  `Review/release-8-9-plan.md`, handoff `docs/handoffs/2026-10-17-release-8-new-look.md`. Guides, mastery map and ready for friends are now
  releases 10, 11 and 12 (#14 to #16). Release 8 live 17 Oct (tag `release-8` on c18b463). Release 9 (pages and photos) built,
  handoff `docs/handoffs/2026-10-17-release-9-travel-pages.md`; photo gaps in #42.
- Release 10, place guides (#14, owner kick-off 17 Oct 09:03Z): a "Terroir" section on the place page (owner cards 09:13Z: a section,
  named Terroir) for Rioja and its three zones (`content/guides/`), fly-there buttons with a caption card on the map, "Test me" on every
  quizzed place page, the "1 place to learn" plural fix. Mock `Review/mock-guides-v1/`, plan `Review/release-10-plan.md`, handoff
  `docs/handoffs/2026-10-17-release-10-guides.md`.

- QA round after release 10 (owner 17 Oct 09:03Z; findings `Review/qa-round-1.md`): Reset view button, hover lights places up
  (owner card 10:05Z "highlight only"), large-text layout on iPad, compass after a reload (PR #49, merged). Then (#50): places
  coloured by climate, six Köppen groups, with a legend and a "Colour places by: Climate / Study region" switch (owner 11:15Z, after
  "one wine tone" looked too uniform); Spain and region cards with photo rows, main grapes and "N due" (mock
  `Review/mock-cards-climate-v2/`, approved 11:25Z; design check `Review/qa-round-1-cards-design-check.md`). Both live in
  release 11 (17 Oct, owner "publish release 11" 11:53Z); tester note `Review/archive/release-11-what-to-test.md`. The mastery map and ready
  for friends then moved to 12 and 13; the polish slice took 12, so they became 13 and 14 (#15, #16).
- Polish slice (owner 17 Oct 11:58Z, "first going to polish"): favicon and Home Screen icon on the slope logo in today's colours
  (owner card 12:05Z "Mix"), install icons in the manifest, photos for Jerez, Manzanilla and Ribera del Guadiana (#42). Live as
  release 12 (owner "publish release 12" 12:50Z); the mastery map and ready for friends move to 13 and 14 (#15, #16). Handoff `docs/handoffs/2026-10-17-polish-icons-photos.md`.
- Sharper map close in (#55, owner 13:04Z, card "Full fix" 13:08Z, mock `Review/mock-zoom-detail/` approved 14:32Z): next zoom of
  imagery on 2x screens, IGN PNOA orthophoto inside Spain, OpenStreetMap place names in our fonts. Live as release 13 (owner "publish
  release 13" 14:52Z); the mastery map and ready for friends move to 14 and 15 (#15, #16). Handoff `docs/handoffs/2026-10-17-zoom-detail.md`,
  tester note `Review/archive/release-13-what-to-test.md`.
- Mobile check (owner 17 Oct 12:50Z, issue #57): Explore without a reload, Back to map steps back, search results above the card,
  folding legend and a fitting map menu on phones, 16 px search (iPhone zoom), quiz steps start at the top. Live as
  release 14 (owner "publish release 14" 15:14Z); the mastery map and ready for friends move to 15 and 16 (#15, #16). Handoff `docs/handoffs/2026-10-17-mobile-check.md`.
- Landscape through the colours (owner 15:17Z: close in the climate colour hides the satellite; card "Ship it" 15:57Z): over the photo
  the place fills keep the Spain-wide look up to zoom 6, thin by zoom 9 and nearly vanish by 12, outlines firm up from 6 to 9.
  Live as release 15 (owner "publish release 15" 16:03Z); the mastery map and ready for friends move to 16 and 17 (#15, #16). Tester note `Review/archive/release-15-what-to-test.md`;
  addendum in `docs/handoffs/2026-10-17-zoom-detail.md`.
- UX sweep (owner 17 Oct 15:26Z, cards 15:58Z "Full set", "Drag, 3 stops", "Skip it"; preview v2 "OK better" 16:44Z): see section 5.
  Live as release 16 (owner "publish release 16" 17:15Z); the mastery map and ready for friends move to 17 and 18 (#15, #16).
  Handoff `docs/handoffs/2026-10-17-ux-sweep.md`, tester note `Review/archive/release-16-what-to-test.md`, code review `Review/ux-sweep-1-code-review.md`.
- Quiz highlight fix (owner report 17 Oct 18:02Z, #66): with 3D relief on, highlights were cut off at tile edges and old ones stayed;
  feature state changes now clear the relief's texture cache. Takes release 17; the mastery map and ready for friends move to 18 and 19 (#15, #16).
  Handoff `docs/handoffs/2026-10-17-quiz-highlight.md`, tester note `Review/release-17-what-to-test.md` (also covers quiz spacing, PR #69).
- Polish pack (18 Oct, owner card 06:18Z "Both, polish first"): photo sizes with blur-up, Newsreader optical sizes and drop cap,
  scroll-linked page motion. Handoff `docs/handoffs/2026-10-18-polish-pack.md`, tester note `Review/release-19-what-to-test.md`.
  Next after it ships: the story-guide mock (new thread).

## 7. Known problems
- The ministry DOP layer is from 2014; corrections live in `dop-overrides.json` [R].
- Rioja zone approximations: Santa Engracia del Jubera taken whole; Lodosa left out; 2.7% less area than the ministry's DOCa polygon, cause not traced.
- No open vineyard-soil polygons for Rioja; soil stays in the card text.
- 30 of 79 fact sheets have no main grape (no source names one; planted area is issue #29, the MAPA DOP reports list no grapes [V]); Txakoli de Álava has no photo (Jerez, Manzanilla and Ribera del Guadiana got theirs in the polish slice).
- Famous producers on only 6 places: Wikipedia singles out few; to be supplemented later (owner 20:23Z, issue #30).
- www.mapa.gob.es refused or failed TLS from GitHub Actions on 16 Oct 19:30 to 19:45Z (earlier the same day it worked).
- 3D relief caches flat layers as textures (MapLibre 4.7.1) and does not redraw them after a paint change or late GeoJSON; the app takes the
  terrain off and back on once the world map has loaded (`redrape()` in `src/map/createMap.ts`, #40). Other layers changed
  without a menu change showed the same stale look: the quiz highlight cut off at tile edges (#66); feature state changes now
  clear the cache (`src/map/terrainCache.ts`) [V headless].
- Release 2's black map: release 3's live check loads imagery and terrain in Chromium [V]; on his screen not yet confirmed.

## 8. Decisions log
The decisions now live in `docs/scope.md` and `docs/architecture-decisions.md`, each tagged and dated. Earlier log entries are in the
archived context file; the ones that changed:
- 2026-10-16 [O]: name Atlaslope (was Paraje). Code MIT; the owner's writing all rights reserved (`NOTICE.md`).
- 2026-10-16 [O]: restart from scratch on the scope; keep only data, `SOURCES.md`, the data tests and the repo rules.
- 2026-10-16 [O]: pull request per slice on a `claude/...` branch (replaces "push `main`"); `publish` workflow tags and deploys (replaces tag pushes from the Mac).
- 2026-10-16 [O]: threads close themselves with a handoff in `docs/handoffs/`; the owner's go on a plan covers the agents it names.
- 2026-10-16 [O]: the data step runs where the source hosts are reachable (cloud environment with them allowed, else GitHub Actions, else the Mac). Replaces "data on the owner's Mac".
- 2026-10-17 [O]: logo is the vineyard slope (vine rows up a hill in an accent tile); favicon follows the browser theme; tab title names the place first ("Rioja · Atlaslope", home "Atlaslope · The wine atlas that quizzes you").
- 2026-10-17 [O]: link previews get a dark share card (PR #46); the line "The wine study atlas for WSET and Wine Scholar students" replaces "The wine atlas that quizzes you" in previews, welcome text and Home Screen description, home tab "AtlaSlope · The Wine Study Atlas" (PR #47). Exam students now come first.
- 2026-10-17 [O]: information screens get a travel look (Airbnb listing style): map card with a cover photo and "Read the full page",
  a full place page with a photo mosaic, highlights, small charts and an "at a glance" box, and a region page with photo tiles. Light is
  white and wine, dark is gold on black. Mocks `Review/mock-travel-v1/`, rules `Review/visual-style.md`. Colours and type built in
  release 8; the pages follow in release 9 (owner card 17 Oct 06:48Z: two releases; photos "fix and fill", three per place).
- 2026-10-17 [O]: place guides are a "Terroir" section of the place page, not a separate page; text only from sources (cards 09:13Z).
- 2026-10-17 [O]: a visual design check runs next to the UX and UI check on every new or changed screen, and built screens are compared
  with their approved mock before a release (`CLAUDE.md`).
- 2026-10-17 [O]: close in, Spain shows IGN's PNOA photo (cut to Spain in the browser) over Esri, 2x screens fetch the next zoom, and
  OpenStreetMap town, river and peak names are drawn in our fonts, smaller than the wine places (card "Full fix", mock approved 14:32Z).
- 2026-10-17 [O]: UX sweep (cards 15:58Z): motion between cards, pages and quiz steps; the phone card is a sheet with three stops; a
  study region holding only its namesake (Rioja) is skipped in trails and navigation. Progress tab hidden until the mastery map. Handoff
  `docs/handoffs/2026-10-17-ux-sweep.md`.
- 2026-10-17 [O]: quiz rounds fixed (cards 18:09 to 18:20Z): new places shown in a batch and asked later in the round, rounds shuffled,
  three screens at least between two about one place, known needs two rights a day apart, no level question. Handoff
  `docs/handoffs/2026-10-17-quiz-spacing.md`.
- 2026-10-17 [O]: the name is shown as "AtlaSlope" wherever people read it (wordmark, tab titles, interface text, Home Screen name); repo, domain, URLs, storage keys and file names stay lowercase "atlaslope".
- 2026-10-17 [O]: efficiency (owner cards 17:29-17:30Z, plan `Review/efficiency-plan-2026-10-17.md`): one slice per thread and a handoff
  at about 150K of context, noisy work to Sonnet helpers; publish reuses the green `main` checks for its commit; records go in the slice PR,
  no records PR after a release; `CLAUDE.md` cut from 10.9 KB to 5 KB with the detail in `docs/AGENT_ROLES.md`; threads stay on Opus 5.5.

## 9. Where things are written down
Rules `CLAUDE.md`; this file; scope and decisions in `docs/`; handoffs `docs/handoffs/`; brief, reviews, mocks, cards and digests in
`Review/`; old material in `Review/archive/`; data ledger `data/SOURCES.md`; backlog in GitHub Issues.

## 10. What this snapshot did not verify
The restart passed `Tools/check.sh ui` in the cloud container (see the restart pull request for the counts) [V]. The publish workflow has
never run [A]. Everything about imagery on the owner's screen is unverified [A].
