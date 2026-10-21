# Read with the map: build cards (#127, #148), 21 Oct 2026

Owner go 21 Oct 2026 on the plan: 1A name "Read with the map" everywhere; 2A geology shipped with credit "Source: IGME, MAGNA 50";
3A its own listing page linked from home; 4A listing page and home count in the same PR. Build target `Review/mock-story-guide-v3/`.
Branch `claude/story-guide-mock`. One builder at a time. Reports in this folder.

| Step | Card | Model | Budget | State |
|---|---|---|---|---|
| 1 | Data: rivers, names, photos, SOURCES | Sonnet | 120K | done, 57K |
| 2 | Story format, loader, checks, guides.md | Sonnet | 100K | done, 69K |
| 3 | Story view on the app map, button C | Opus | 250K | done, 158K (one resume) |
| 4 | Layers: rivers, names, climate, geology, tint, fact markers | Sonnet | 125K | done, 118K (one resume) |
| 5 | Listing page and home count | Sonnet | 100K | ready |
| 6 | Unit tests, one Playwright spec (fixtures) | Sonnet | 80K | ready |
| 7 | ReviewBot design + Opus diff | Sonnet/Opus | 50K + 100K | after 6 |

## Card 2: story format
Goal: each story guide is one data file the app reads, its map stops drawn only from the guide's own text.
Do: `content/stories/rioja.json`, `content/stories/priorat.json`, transcribed from `Review/mock-story-guide-v3/build.py`
(`build_rioja`, `build_priorat`): ordered steps; each step names its chapter and either the guide's `fly` index or a card id, the camera
(center/zoom or a place's bounds, pitch, bearing, zoom shift), the focus outline (place id or `zones`), layers switched on (`koppen`,
`geology`, `zonelabels`), an optional photo id (from `data/photos.json`), an optional measure (`place`, kind `median|top|low|steep`),
and 0-3 fact markers (`at`: a name in `data/story/names-<id>.geojson` or `[lng,lat]`; `text` a guide sentence; `cite` from that
sentence's own cite list). Mark camera values as design choice in a `$comment`. Types and loader in `src/story/` (`format.ts`,
`load.ts`), `storyIds()` / `storyCount()` for the home count and listing page. `src/story/format.test.ts`: every step's chapter, fly
index and card exist in `content/guides/<id>.json`; every cite is in that guide's cite lists; every photo has a checked crop; every
measure place is in `data/place-measures.json`; every named marker exists. `docs/guides.md`: section on story files plus a Format log line.
May edit: `content/stories/`, `src/story/`, `docs/guides.md`. Must not: guide texts, `src/map/`, pages.

## Card 3: story view
Goal: a reader opens "Read with the map" on the Rioja or Priorat guide and the app's own map follows the text as they scroll.
Do: `src/story/StoryView.tsx` (+ `story.css`): text column left, sticky map right (phone: map on top, text below), reusing the
app map (`src/map/createMap.ts`, camera timing `src/map/flight.ts`, terrain x1.5 stated in the credit line). Scroll with
IntersectionObserver; no autoplay; `flyTo` per stop (two legs when > 3.5 zoom or > 150 km, as mock README "Changed from v2" 1),
`jumpTo` on first load and with prefers-reduced-motion. Focus: 3 px champagne over 5.5 px black at 60%, land outside faded with black
25%. Locator inset (120 px, 84 px phone) from `data/spain-mask.json`. "Back to the story view" bottom right. Credit line by layers
shown. Route: `#place=<id>&page&story` (extend `src/url.ts`); button C (solid black, champagne text, folded-map glyph on the right,
owner-approved exception) on `src/pages/PlacePage.tsx` only for ids with a story file. Mock CSS: `story.css`, `story-b.css`.
May edit: `src/story/`, `src/url.ts`, `src/pages/PlacePage.tsx`, `src/app/App.tsx` (route only), `src/strings.ts`.
Must not: change the main map's behaviour; no new deps.

## Card 4: layers
First: checked 3:2 story crops for rioja-2, rioja-3, rioja-alavesa-2, catalunya-2, priorat-1 in `data/story/photo-focus.json`
(crop sheet against the original), then delete the "known gaps" allowance in `tests/unit/story-format.test.ts` (rule: a shown photo
without a checked crop fails a test; an allowlist is tuning the test). Step 2 note: three mock facts are tightened guide sentences, as approved in the mock.
Rivers and names from `data/story/` (widths by zoom, main rivers labelled along the line, names within the visible half-width of
the stop, the app's own glyphs in `public/glyphs/`), Köppen at 36% with a one-line legend (colours from `src/map/climate.ts`), IGME
MAGNA 50 WMS layer 0 at 55%, tileSize 512, minzoom 10, only at steps with `geology`; light tint over 30% slope (see mock `tint.py`);
fact markers (champagne dot, black ring; click/Enter/Space opens a black card with the sentence and source; Escape returns focus).
Also: on phone the stop dot sits under the credit bar (shot `shots/story-rioja-haro-phone.png`): pad the camera by the bars' heights.
Shots after: Rioja soils (geology on), Rioja climate (Köppen), Priorat Siurana, phone climate, into `Review/story-build/shots/`.
May edit: `src/story/`, `data/story/photo-focus.json`, `tests/unit/story-*.test.ts`.

## Card 5: listing page and home count
Also: draw the `zonelabels` layer (Rioja climate step: the three zone names on the map, as mock shot `rioja-climate.png`); step 4 left it out.
`read-with-the-map/` page (built like `guides/`, one row per story guide with its photo and lede line), linked from the home
stats and footer; home tile `<n> guides to read with the map`, filled at build time like `data-count="guides"`
(`src/home/guideCount.ts`, `vite.config.ts`). Copy one idea per line. May edit: `index.html`, a new `read-with-the-map/index.html`,
`src/home/`, `vite.config.ts`.

## Card 6: tests
Unit tests per module; one Playwright spec with fixtures (no network): button shows on Rioja, not on a guide without a story; scroll
to the soils stop moves the camera and shows the geology credit; Escape closes a fact card.
