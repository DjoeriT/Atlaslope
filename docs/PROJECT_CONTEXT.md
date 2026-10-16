# Atlaslope: project context

Snapshot: **16 Oct 2026**, the restart commit. `CLAUDE.md` holds the rules; `README.md` the layout and commands; `docs/AGENT_ROLES.md` the agents.
This file holds what is true now, what is decided and where, what is broken, and what comes next. The pre-restart version is
`Review/archive/PROJECT_CONTEXT-before-restart.md`.

Tags: **[V]** verified in this working copy when this snapshot was written; **[O]** stated by the owner;
**[R]** from a report or earlier notes, not re-checked; **[A]** an assumption, treat it as a question.

## 1. What Atlaslope is
The wine atlas that quizzes you [O]. For passionate wine lovers first, exam students (WSET, Spanish Wine Scholar) second, then "show the
why". Spain first, on a world place tree (country, region, DO, zone). Free for the owner and friends; read-and-test only in v1 [O].
Renamed from Paraje on 16 Oct 2026; domain atlaslope.com bought by the owner [O]. The GitHub repo is still `DjoeriT/Paraje` (rename is the owner's call).
Full scope: `docs/scope.md`. Architecture: `docs/architecture-decisions.md`. Build plan and estimate: `Review/builder-brief.md`.

## 2. Architecture (decided, not built)
Static site, no server. Vite, TypeScript, React, MapLibre GL; satellite through a keyed Esri endpoint with the atlas drawn over it; 3D
terrain; place tree as data (`data/places.json`, from the data step); progress in the browser with save and load to a file; GitHub Pages
under atlaslope.com; CI on GitHub Actions. Details and tags: `docs/architecture-decisions.md`.

## 3. Data on main
`data/SOURCES.md` is the ledger. Kept through the restart [V]: `dops.geojson` (ministry 2014 layer, 90 DOPs), `dop-overrides.json`
(today's names, levels, study regions, 16 DOPs without a polygon), `rioja-zones.geojson`, `rioja-municipalities.json`,
`rioja-hillshade.tif`. `src/dops.ts` applies the overrides and is the only code kept; `tests/unit/dops.test.ts` pins it.
Still missing: polygons for Campo de Calatrava, Cebreros and 14 Pagos; Natural Earth base; Köppen-Geiger climate; the place tree; photo
candidates; the pliego source pack. All of that is the data step (brief, step 1).

## 4. What is built
Nothing of the new app yet. The site shows a placeholder page (`index.html`). The approved mocks are the visual reference:
`Review/mock-atlas-v3/` (round 3), `Review/mock-atlas-v2.2/` (quiz screens), `Review/mock-flow/` (every screen and how they connect).
They need `assets/data.js` and `assets/maplibre-gl.*` from the project files to run (see their README).

## 5. Release and deployment state
Live: release 2 (tag `release-2` on 3c270e0) at https://djoerit.github.io/Paraje/ [R]. The restart is not released; the next release is 3, the atlas.
Route from now on: one pull request per slice on a `claude/...` branch, merged after green CI and ReviewBot; releases through the `publish`
workflow after the owner's "publish release N" [O, cards 16 Oct 10:18 to 10:19Z]. Whether a cloud thread may start that workflow is untested [A];
the fallback is the owner's one tap in the GitHub app.

## 6. In flight
- Step 0, the restart: this commit.
- Step 1, the data step: needs the cloud environment with the source hosts allowed (added by the owner 16 Oct ~12:55Z [R]); runs in a
  fresh thread in that environment.
- Then releases 3 (atlas), 4 (reference), 5 (quiz), with a re-estimate after release 3. The owner's go (16 Oct 12:51Z) covers the
  restart, the data step and releases 3 to 5 [O]. Releases 6 to 8 need a new go.

## 7. Known problems
- The ministry DOP layer is from 2014; corrections live in `dop-overrides.json` [R].
- Rioja zone approximations: Santa Engracia del Jubera taken whole; Lodosa left out; 2.7% less area than the ministry's DOCa polygon, cause not traced.
- No open vineyard-soil polygons for Rioja; soil stays in the card text.
- The cause of release 2's black map on the owner's screen is unknown [A]; release 3 adds a post-deploy check of imagery and terrain.

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
