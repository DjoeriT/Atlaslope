# Paraje: project context

Snapshot: **15 Oct 2026**. `CLAUDE.md` holds the rules; `README.md` the layout and commands; `docs/AGENT_ROLES.md` the agents.
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
`release-N` tags. Unit tests with Vitest, UI tests with Playwright against fixtures. [A] until the first build runs.

## 3. Data layers
See `Review/data-scouting.md` for sources and licences. Planned for the first slice: all Spanish DOP boundaries (MAPA), elevation (IGN MDT, CC BY 4.0),
municipalities (IGN) dissolved into the three Rioja zones, a schematic Rioja soil overlay, a few Wikimedia Commons photos. `data/SOURCES.md` is the ledger.

## 4. How the core logic works today
Nothing built yet. Planned: a quiz engine over the DO list (find X; what is this; which region, climate or soil), 10 questions a session,
misses shown on the map, per-DO right/wrong counts in the browser.

## 5. Release and deployment state
No release yet. No `release-N` tag. Site not published.

## 6. Implemented features
None.

## 7. In flight and parked
In flight: repo setup (this snapshot); the data download pass on the owner's Mac (the cloud thread cannot reach the Spanish government hosts).
Parked: Priorat deep dive (after Rioja); SIGPAC vineyard parcels (version two); personal notes (owner, 15 Oct 2026: read-and-test only in version one).

## 8. Known problems
- No open vineyard-soil polygons exist for Rioja; the soil layer will be schematic and labelled as such [R, scouting].
- The licence text of the MAPA DOP file has not been read yet (host blocked from the cloud thread) [R].

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

## 10. Next priorities (a proposal; the owner decides)
1. Push this setup to `DjoeriT/Paraje`; create labels and the board.
2. Data pass on the Mac: fetch, inspect, simplify, record licences.
3. Mock the atlas screen and the quiz screen; design check; owner review.
4. Build the first slice.

## 11. Where things are written down
Rules `CLAUDE.md`; this file; agents `docs/AGENT_ROLES.md`; brief and scouting in `Review/`; data ledger `data/SOURCES.md`; backlog in GitHub Issues.

## 12. What this snapshot did not verify
Nothing has been built or run: the stack in §2 and the commands in `README.md` are the plan, not a tested setup. No data file has been opened.
