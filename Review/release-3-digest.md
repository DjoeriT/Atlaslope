# Release 3 digest: the atlas (issue #11)

One page for every card in this release. Agents read this, the mock lines named here and their own card; never scope, decisions or the brief whole.

## What ships (brief, release 3 row)
The place tree model and loader. The map shell: satellite through the keyed Esri endpoint, the atlas base, 3D terrain, sea tint and coastline, one map menu (satellite, climate shown but off for now, relief, boundaries). The top bar: wordmark menu with the theme toggle, search, Explore · Quiz · Progress. The Spain card, region card and place card with breadcrumbs. Shareable URLs for a place and a view. Link-only (noindex, robots.txt). The first-run screen. The atlas fallback note when satellite fails. atlaslope.com pointed at Pages.

**Done when:** unit tests on the tree (ids, parents, levels, counts, a two-place fixture country with no app change); Playwright walks Spain › region › place and back with fixtures; a post-deploy workflow proves satellite and terrain load on the live site; the owner glances at it.

## Decisions that apply (tags from the source)
- React on Vite and TypeScript; MapLibre driven directly, no wrapper; the tree is plain TypeScript, no React in it (#39) [O].
- Strict TypeScript; all interface text in one strings file (#5) [A]. Desktop and iPad designed, phone works (#4) [A].
- Ids are short stable slugs, never containing the parent (#41); one home parent plus `alsoWithin`; study regions are a course grouping over the tree, not parents (#42) [A]. Level names belong to each country (`countries[].levels`).
- Navigation is the tree: Spain card › region card › place card, clickable breadcrumb on every card; no region dropdown; search finds regions and places (towns and grapes later: grapes in release 4) [O].
- Spain card lists the ten study regions in course order with their colour (the map legend). No known counts in release 3 (they arrive with progress) [A, brief defaults].
- Map default: satellite on, the atlas drawn over it, DO colours strong enough to read on imagery; one button to the plain atlas base [O]. Imagery: Esri World Imagery with the key from `VITE_ESRI_API_KEY` [O]. Imagery fails: atlas base plus a note, no second satellite source [O].
- Terrain: Mapzen Terrarium tiles on AWS Open Data, no key (#22). Labels are page elements in Newsreader and IBM Plex Sans, self-hosted; no glyph server (#25).
- Explore is tilted 3D; the quiz map is flat (release 5) [O].
- Shareable URLs carry the place and the map view [O]. Link-only: noindex tag and robots.txt [O].
- Speed: the map usable within 3 s on home Wi-Fi; a build check fails above about 2 MB compressed download, satellite and photos excluded [O].
- Light and dark follow the system, with a toggle under the wordmark [O].
- Debug-only flags (`?fixture=`, `?fresh=1`) live in `src/debug.ts` and are stripped from the production build; `check.sh` greps `dist/` (CLAUDE.md, Testing).
- Post-deploy live map check: a workflow opens the live site in a real browser on the real network and fails if satellite or terrain is blank (#31) [O].

## Defaults for gaps (LeadBot, [A]; the owner can reopen)
- **Place card in release 3:** name, level (DO, DOCa, VC), study region, "also within", breadcrumb. No facts, photos, "Read the guide" or "Test me" yet: they arrive in releases 4 to 6, so the card shows nothing that leads nowhere.
- **Quiz and Progress** in the top bar are visible but disabled with "Coming soon" as their tooltip and screen-reader label, so the bar keeps its final shape.
- **Not-quizzed places** (`quiz: "none"`) are on the map and in Explore like the rest.
- **Canary Islands:** the Canary Islands region card flies the map there; the drawn inset waits for a later release.
- **Today card** (home) waits for release 5; home is the Explore map with the Spain card open.
- **First-run screen:** as mock 17 but without the "where to start" quiz choice; it says what Atlaslope is and how to move, tilt and turn the map, shown once.

## Data (read with jq or a script, never open the geojson)
- `data/places.json`: `countries`, `courses[].groups` (ten SWS regions with `order`), `places[]` with `id, name, official, kind, level, parent, region, alsoWithin?, community, boundary, layerCode, centroid, quiz (core 69, vc 6, none 31, zone 3), northSouth, courseOrder`. Zones have `level: "zone"`, `parent: "rioja"`, `centroid: null`.
- Boundaries: `data/dops.geojson` through `applyOverrides()` in `src/dops.ts` (keyed by `layerCode`), `data/added-boundaries.geojson`, `data/rioja-zones.geojson`. Atlas base: `data/natural-earth-spain.geojson`. Climate: `data/koppen-spain.geojson` (layer off in release 3).
- Existing tests: `tests/unit/places.test.ts`, `dops.test.ts`, `data-layers.test.ts`. Keep them green.

## Mock references (approved look; `Review/mock-atlas-v3/`)
- `assets/app.js` lines 1 to 112: map setup, sea polygon over imagery, `applyBasemap`, `applyLayers`. Lines 113 to 153: DOM labels and collision. Lines 154 to 200: selection, dimming, card padding, framing. Lines 201 to 221: chrome.
- `assets/app.css` lines 1 to 93: tokens, glass chrome, floating card; 111 to 140: legend and labels; 186 to 249: round 3 (map menu, breadcrumbs, close card).
- Pages: `15-explore-spain.html` (Spain card), `16-region-castilla.html` (region card), `14-explore-region.html` (place card), `11-layers-climate.html` (map menu open), `17-first-run.html`. Fonts in `assets/fonts/`.

## Cards
| Card | Model | Files | Depends on |
|---|---|---|---|
| `release-3-card-1-tree.md` The tree model and search index | Opus | `src/tree/`, `tests/unit/tree*.test.ts` | – |
| `release-3-card-2-shell.md` App shell: React, top bar, theme, strings, first run, noindex, debug flags, size check, live map check workflow | Sonnet | `index.html`, `src/main.tsx`, `src/app/`, `src/strings.ts`, `src/debug.ts`, `public/robots.txt`, `Tools/check.sh`, `.github/workflows/live-map-check.yml`, `package.json` | – |
| `release-3-card-3-map.md` The map: satellite, atlas base, terrain, sea, boundaries, labels, map menu, fallback note | Sonnet | `src/map/` | 2 |
| `release-3-card-4-cards.md` Spain, region and place cards, breadcrumbs, URLs, Playwright walk | Sonnet | `src/cards/`, `src/url.ts`, `tests/ui/`, `tests/fixtures/` | 1, 3 |

One PR for the release; ReviewBot (Opus, code review) reviews it once before the merge.
