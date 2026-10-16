# Paraje: project context

Snapshot: **16 Oct 2026**, after release 1. `CLAUDE.md` holds the rules; `README.md` the layout and commands; `docs/AGENT_ROLES.md` the agents.
This file holds what is true now, what was decided and why, what is parked, what is broken, and what comes next.

Tags: **[V]** verified in this working copy when this snapshot was written; **[O]** stated by the owner;
**[R]** from a report or earlier notes, not re-checked; **[A]** an assumption, treat it as a question.

## 1. What Paraje is
The wine atlas that quizzes you. For wine nerds who finished WSET and are studying for Wine Scholar Guild certifications, Spanish Wine
Scholar first [O]. Zoom from country to village, toggle layers (DO boundaries, elevation, climate, soil, photos), click a DO for its facts,
then test yourself on the same map. Free for the owner and friends, not a business [O]. Full brief: `Review/product-brief.md`.

## 2. Architecture
Static site, no server [O, 15 Oct 2026]. Vite + TypeScript, MapLibre GL for the map, OpenFreeMap for base tiles (free, no key), layers as
GeoJSON files in `data/`, facts as JSON in `data/`, quiz progress in `localStorage`. Hosted on GitHub Pages, deployed by a workflow on
`release-N` tags. Unit tests with Vitest, UI tests with Playwright against fixtures. [V] first build and deploy ran for release 1. HTML mocks that should be reachable on the site live in `public/mocks/<topic>/`, with `Review/mock-<topic>` a symlink to them.

## 3. Data layers
`data/SOURCES.md` is the ledger; `Review/data-scouting.md` has the leads. Committed in d1acea5 (15 Oct 2026, data pass on the owner's Mac):
- `data/dops.geojson`: 90 wine DOPs from MAPA's OGC API Features service (the shapefile sits behind a captcha). [V] 90 valid features, fields code/name/kind/type/label.
  Known gap: the layer dates from March 2014 [R]: Priorat is labelled "D.O. Priorato" (not DOCa), 14 of 26 Vinos de Pago, 6 of 7 VC, no IGPs, and DOs created since 2014 are missing. See §8.
- `data/rioja-zones.geojson`: Alta (76 municipalities plus the El Ternero exclave), Alavesa (15), Oriental (49), dissolved from IGN municipalities using the current pliego's lists. [V] counts.
- `data/rioja-municipalities.json`: the 144 names from the regulation matched to 140 IGN municipalities (merged villages noted).
- `data/rioja-hillshade.tif`: 50 m hillshade from IGN MDT25, Rioja only (6.7 MB). Mainland MDT25 was not fetched (several GB); a 200 m grid and MDT05 tiles for Rioja sit in `data/raw/` on the owner's Mac, uncommitted.
Licences: MAPA layer "libre y gratuito … con fines divulgativos, informativos" with the credit «© Ministerio de Agricultura, Pesca y Alimentación (MAPA)» (the metadata record says CC BY 4.0; the stricter page terms are followed); IGN municipalities and elevation CC BY 4.0. Both fit a free, non-commercial study tool.

## 4. How the core logic works today
Nothing built yet. Planned: a quiz engine over the DO list (find X; what is this; which region, climate or soil), 10 questions a session,
misses shown on the map, per-DO right/wrong counts in the browser.

## 5. Release and deployment state
Release 1 (16 Oct 2026): tag `release-1` on 216256c, live at https://djoerit.github.io/Paraje/ [V deploy workflow green]. Contents: the app shell (base map of Spain, nothing else) and the round 2.1 atlas mock-ups at `/mocks/atlas-v2/` (PR #2). The tag was pushed from the owner's Mac: the cloud proxy refuses tag pushes and tag creation through the API, so every release needs a session on his Mac for that one step [V, 16 Oct 2026].

## 6. Implemented features
App: a base map of Spain with a status word; no layers, panel or quiz yet. Mocks (not app features): seven atlas and quiz screens, round 2.1, on a real MapLibre map with the official DO boundaries, Rioja zones, satellite and 3D terrain; see `public/mocks/atlas-v2/README.md`.

## 7. In flight and parked
In flight: owner review of the round 2.1 mocks on the live site; then building the atlas screen. Done: repo setup (f18ce6e), first data pass (d1acea5), DOP overrides (issue #1 step one), mocks round 2.1 (PR #2), release 1.
Parked: Priorat deep dive (after Rioja); SIGPAC vineyard parcels (version two); personal notes (owner, 15 Oct 2026: read-and-test only in version one).

## 8. Known problems
- The MAPA DOP layer is from 2014 [R]. Names, levels and study regions are corrected by `data/dop-overrides.json` via `src/dops.ts` (16 Oct 2026, issue #1 step one): Priorat DOCa, Granada DO, León, official spellings, and 16 DOPs listed without a polygon (Campo de Calatrava, Cebreros, 14 Pagos). Still missing: polygons for those 16 and all 43 IGPs (issue #1 step two).
- Rioja zone approximations: Santa Engracia del Jubera is listed as "zona Norte" only but the whole municipality is used; Lodosa is left out; the dissolved zones cover 2.7% less area than MAPA's DOCa polygon, cause not traced.
- No open vineyard-soil polygons exist for Rioja; the soil layer will be schematic and labelled as such [R, scouting].

## 9. Decisions log
- 2026-10-15 [O]: the name is Paraje (a named vineyard site, the word behind viñedo singular and vi de paratge). Working title was Wine World; rejected as generic and already a shop chain's name.
- 2026-10-15 [O]: the app is a web atlas plus quiz, not an iOS app. Reason: a zoomable atlas is a desk or iPad experience; a web build runs everywhere and needs no App Store.
- 2026-10-15 [O]: Spain first (Spanish Wine Scholar), Rioja as the deep region, Priorat next.
- 2026-10-15 [O]: free for the owner and friends; no accounts, payments or sharing.
- 2026-10-15 [O]: read-and-test only in version one; no personal notes.
- 2026-10-15 [O]: atlas and quiz together from day one; the goal is a study tool that beats flashcards.
- 2026-10-15 [O]: standing exceptions kept: push `main` after a commit; tag and push `release-N` after the owner says "publish release N".
- 2026-10-15 [O]: small CI on pushes to `main`; HTML mocks; labels `ui`, `logic`, `data`, `release`, `security`, `docs`.
- 2026-10-15 [O]: the data download pass runs on the owner's Mac, not in a cloud environment.
- 2026-10-16 [O]: release 1 published with the mock-ups and the bare app shell, chosen on a card ("Merge and publish") in the mocks thread. Reason: the only way to see satellite imagery and 3D terrain on a link.
- 2026-10-15 [O]: the repo is public. Reason: GitHub Pages on a private repo needs a paid plan; the code is harmless and the data is open. Consequence: every data credit line must be visible, and the code needs a licence file (open).

## 10. Next priorities (a proposal; the owner decides)
1. Owner reviews the round 2.1 mocks on the live site; feedback becomes the first build cards.
2. Build the first slice: map with DO layer, atlas panel, quiz, progress.
3. Patch DO names and levels to today's law (Priorat DOCa, new DOs); then missing polygons.

## 11. Where things are written down
Rules `CLAUDE.md`; this file; agents `docs/AGENT_ROLES.md`; brief and scouting in `Review/`; data ledger `data/SOURCES.md`; backlog in GitHub Issues.

## 12. What this snapshot did not verify
The stack in §2 passed `Tools/check.sh ui` on f18ce6e in the cloud container and in CI [V]. Data counts in §3 were re-checked in the cloud clone of d1acea5 [V]; the 2014 date of the MAPA layer and the licence wording are as reported by the Mac session [R].
