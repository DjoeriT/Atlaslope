# Atlaslope: project context

Snapshot: **16 Oct 2026**, the restart commit. `CLAUDE.md` holds the rules; `README.md` the layout and commands; `docs/AGENT_ROLES.md` the agents.
This file holds what is true now, what is decided and where, what is broken, and what comes next. The pre-restart version is
`Review/archive/PROJECT_CONTEXT-before-restart.md`.

Tags: **[V]** verified in this working copy when this snapshot was written; **[O]** stated by the owner;
**[R]** from a report or earlier notes, not re-checked; **[A]** an assumption, treat it as a question.

## 1. What Atlaslope is
The wine atlas that quizzes you [O]. For passionate wine lovers first, exam students (WSET, Spanish Wine Scholar) second, then "show the
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
and place cards with breadcrumbs and hash URLs (`src/cards/`, `src/url.ts`). Quiz and Progress are shown but disabled. The approved mocks are the visual reference:
`Review/mock-atlas-v3/` (round 3), `Review/mock-atlas-v2.2/` (quiz screens), `Review/mock-flow/` (every screen and how they connect).
They need `assets/data.js` and `assets/maplibre-gl.*` from the project files to run (see their README).
Release 4, the reference (PRs #23, #24): a cited fact sheet for each of the 79 quizzed places (`content/facts/<region>.json`, sources in
`content/sources.json`, checked by `checkSheets` in Vitest), measured altitude and Köppen rows (`data/place-measures.json`), 149 credited
photos for 77 places (`public/photos/`, `data/photos.json`), grapes in search. The "Report a mistake" link is built but hidden (owner, no address).
Release 6, tastes and producers (planned as 4.1, issue #27): How it tastes (76 sheets), Famous styles (75) and Famous producers (7, from
English Wikipedia by the owner's card, Lebrija from Spanish) rows on the fact sheet.

## 5. Release and deployment state
Live: release 5, the world background map (tag `release-5` on 25a951e, 16 Oct) [V tag]; before it release 4 (tag `release-4` on b5c773b, 16 Oct 19:54Z, publish run 38958091012), at https://atlaslope.com/ over HTTPS; djoerit.github.io/Atlaslope/ redirects there.
Release 3 (tag on 6a78915) passed the post-deploy live map check with 85 satellite and 85 terrain tiles [V, run 38924845710]. Next release is 6 (tastes and producers, planned as 4.1); the publish workflow takes whole numbers only.
Route from now on: one pull request per slice on a `claude/...` branch, merged after green CI and ReviewBot; releases through the `publish`
workflow after the owner's "publish release N" [O, cards 16 Oct 10:18 to 10:19Z]. A cloud thread can start that workflow [V, release 3]. The Remote Control
session on his Mac also sees his thread messages and started a second publish run 7 s apart; the workflow's tag guard stopped it harmlessly.

## 6. In flight
- Restart, data step, releases 3 and 4 are done. Release 4 agents used 0.84 M tokens against a 0.5 to 0.7 M estimate (four writer
  batches over budget, plus follow-ups) [V, spend log]. Release 6 (planned as 4.1, owner cards 16 Oct 19:37Z):
  tastes, famous styles and producers, built; planted-area main grapes moved to issue #29. Then the quiz (planned as release 5, now
  release 7 by number). The owner's go (16 Oct 12:51Z) covers the restart, the data step, the atlas, the reference and the quiz [O]; the
  releases planned as 6 to 8 need a new go [A: the go named content, not numbers].

## 7. Known problems
- The ministry DOP layer is from 2014; corrections live in `dop-overrides.json` [R].
- Rioja zone approximations: Santa Engracia del Jubera taken whole; Lodosa left out; 2.7% less area than the ministry's DOCa polygon, cause not traced.
- No open vineyard-soil polygons for Rioja; soil stays in the card text.
- 30 of 79 fact sheets have no main grape (no source names one; planted area is issue #29, the MAPA DOP reports list no grapes [V]); Jerez and Manzanilla have no photos.
- Famous producers on only 7 places: Wikipedia singles out few; to be supplemented later (owner 20:23Z, issue #30).
- www.mapa.gob.es refused or failed TLS from GitHub Actions on 16 Oct 19:30 to 19:45Z (earlier the same day it worked).
- Release 2's black map: release 3's live check loads imagery and terrain in Chromium [V]; on his screen not yet confirmed.

## 8. Decisions log
The decisions now live in `docs/scope.md` and `docs/architecture-decisions.md`, each tagged and dated. Earlier log entries are in the
archived context file; the ones that changed:
- 2026-10-16 [O]: name Atlaslope (was Paraje). Code MIT; the owner's writing all rights reserved (`NOTICE.md`).
- 2026-10-16 [O]: restart from scratch on the scope; keep only data, `SOURCES.md`, the data tests and the repo rules.
- 2026-10-16 [O]: pull request per slice on a `claude/...` branch (replaces "push `main`"); `publish` workflow tags and deploys (replaces tag pushes from the Mac).
- 2026-10-16 [O]: threads close themselves with a handoff in `docs/handoffs/`; the owner's go on a plan covers the agents it names.
- 2026-10-16 [O]: the data step runs where the source hosts are reachable (cloud environment with them allowed, else GitHub Actions, else the Mac). Replaces "data on the owner's Mac".

## 9. Where things are written down
Rules `CLAUDE.md`; this file; scope and decisions in `docs/`; handoffs `docs/handoffs/`; brief, reviews, mocks, cards and digests in
`Review/`; old material in `Review/archive/`; data ledger `data/SOURCES.md`; backlog in GitHub Issues.

## 10. What this snapshot did not verify
The restart passed `Tools/check.sh ui` in the cloud container (see the restart pull request for the counts) [V]. The publish workflow has
never run [A]. Everything about imagery on the owner's screen is unverified [A].
