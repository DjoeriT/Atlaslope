# Code review: story guide build (`origin/main...claude/story-guide-mock`)

ReviewBot (Opus), code review, 21 Oct 2026. Scope: src/, tests/, index.html, read-with-the-map/, vite.config.ts, Tools/story/, data/story/ (no geojson, PNG or maplibre bundle opened).

**Verdict: merge after fixes.** Blockers 3 · Should fix 5 · Notes 7.

Ran: `npx vitest run tests/unit/story-*`: 5 files, 51 tests passed. No Playwright run (card). Secret scan of the added lines (api key, token, secret, bearer, AAPK): nothing found [ran].

## Blockers

**B1. Fact markers are announced as "Map marker", not "Fact: <place>".** `src/story/factMarkers.ts:63-65`. The button's `aria-label` is set before `new maplibregl.Marker({ element: b }).addTo(map)`. MapLibre 4.7.1 `Marker.addTo` then overwrites it: `node_modules/maplibre-gl/src/ui/marker.ts:319` `this._element.setAttribute('aria-label', map._getUIString('Marker.Title'))` ('Map marker', `default_locale.ts:10`). So every fact button gets the same generic name, and the card's accessibility check fails. Confirmed by reading the source; not run in a browser.
Fix: set the label after `addTo` (`const mk = new Marker(...).addTo(map); b.setAttribute('aria-label', strings.story.factLabel(f.label));`). Add `aria-hidden="true"` to the non-interactive `story-mk` and `story-dot` markers (`storyMap.ts:142-143`), which now also read "Map marker". Add a check in `tests/ui/story.spec.ts` that a button named `Fact: …` exists.

**B2. The geology credit does not use the wording the owner decided.** `src/strings.ts:474-475` (`'Geology: IGME MAGNA 50'`, short `'IGME MAGNA 50'`) and legend `:461`. The owner decision (handoff "Decided", 2A; cards.md header) is the credit "Source: IGME, MAGNA 50". That string is nowhere in the diff. Confirmed (read).
Fix: `geology: 'Source: IGME, MAGNA 50'`. For the phone short form, keep that text or ask the owner. Do not decide the wording here.

**B3. The listing page shows two photos in a square frame whose crop was only checked at 3:2.** `src/home/storyList.ts:137,143` passes `square = true` with the focus from `data/story/photo-focus.json` (the 3:2 story crops). `.gl .gcard-c .ct img` is `aspect-ratio:1/1` (`src/home/guides.css:33`). The covers `rioja-2` and `priorat-1` have no entry in `src/home/photoCrops.json` (grep count 0). Square frames are the photo hard rule's own case ("each crop checked against the original"), and `priorat-1`'s 50% 25% focus shows the subject is off-centre. `tests/unit/story-list.test.ts:37-43` calls the 3:2 focus "square-cropped", so the test follows the code rather than the rule. Confirmed (read).
Fix: make and check square crops for both covers (`Tools/guides/crop_sheet.mjs`, `photoCrops.json`). Use `photoCrops` focus for the listing cards. Make the test fail when a listing cover has no square crop.

## Should fix

**S1. The story overlay leaves the guide page under it reachable, and focus is not moved.** `src/app/App.tsx:68` keeps `PlacePage` mounted under the fixed `.story` (`story.css:2`, z-index 31). Only `#map` gets `inert` (`App.tsx` pageOpen effect). Tab and screen readers therefore go on into the hidden page. On open, focus stays on the button under the overlay. On "Back to <place>", focus is not returned to the button. There are also two `<main>` landmarks. Inferred from the code; not run.
Fix: while `sel.story`, set `inert` on the page's root. Focus the story's `h1` or the back link on mount, and the `.story-open` button on return. Render the story's `<main>` as a `div role="region"` or similar.

**S2. A two-leg flight takes the map back from the reader.** `src/story/storyMap.ts:157,162`. If the reader drags or pinches during leg 1, MapLibre stops the flight and fires `moveend`. The `once('moveend')` then starts leg 2 because the token has not changed. This is scroll-jacking in effect. Confirmed (read).
Fix: in the `movestart` handler with `originalEvent`, also `flight++`, so the pending leg is dropped.

**S3. A new story file still needs code edits to show its names, rivers and slope tint.** `src/story/StoryView.tsx:17-18,27` and `src/story/layers.ts:7-12,31-32` hard-code `rioja` and `priorat`. The build-time fill is correct: `vite.config.ts` and `storyList.ts` count and list from `content/stories/`, and `load.ts` uses `import.meta.glob`. So the home count, listing page and button need no edit [read]. The view itself does. Also, `rivers` is always credited (`layers.ts:177`), even for a story with no rivers file.
Fix: build the per-id URLs with `import.meta.glob('../../data/story/{names,rivers}-*.geojson', { query: '?url', import: 'default', eager: true })` and the same for `slope-*.png`. Credit `rivers` only when the story has a rivers file. Add a format test that every story id has its names and rivers files.

**S4. On a phone the credit line can be cut off.** `story.css:61` sets `white-space:nowrap; overflow:hidden` at .66rem. On a Köppen step the short parts are "Terrain ×1.5 · PNOA © IGN, Esri · Mapzen · Rivers, names IGN · Beck 2023", about 75 characters. At 375 px that likely clips the CC BY credits (Beck, IGN). Inferred; QA should check with a phone screenshot.
Fix: allow two lines (`white-space:normal`) and pad the camera by the bar's real height, which `padding()` already measures.

**S5. The imagery credit stays on after the imagery has failed.** `src/story/storyMap.ts:49`. `onImageryFailed` sets `imagery = false` but never calls `events.onLayers`. "Imagery PNOA © IGN, Esri" stays until the next step, and the first step is wrong when there is no key. Confirmed (read).
Fix: in `onImageryFailed`, re-emit `events.onLayers(layers.show(...))` or cache the last shown list and re-send it.

## Notes

- N1. `StoryView.tsx:239-251`: the dwell `setTimeout` is not cleared on unmount. It is harmless because `smap.current` is null by then. Add `return () => clearTimeout(timer.current)`. [read]
- N2. `StoryView.tsx:239-251`: when the names file lands after a step has been shown, that step's named markers and facts stay missing until the next step, because the effect returns when `shownStep === active`. The names file is also fetched twice (`StoryView.tsx:168`, `layers.ts:160`). [read, inferred effect]
- N3. `src/cards/nav.ts:22-26`: `#place=<id>&page&story` for a place with no story file keeps `story` in the selection. The page shows, and the first Escape only rewrites the address. Drop `story` in `validSelection` when `loadStory(id)` is undefined. [read]
- N4. Two MapLibre maps (two WebGL contexts) run while the story is open, because the main map stays mounted. Watch memory on an iPad in QA. [inferred]
- N5. The fact card (MapLibre Popup) has no accessible name or role. Escape and focus return work: `App.tsx` checks `defaultPrevented`, and `factMarkers.ts:41` prevents. [read]
- N6. `StoryView.tsx:220` comment says the scroll listener only moves the progress bar, but it also calls `pick()`. The behaviour is fine; the comment is wrong. [read]
- N7. The main map's behaviour is unchanged. `src/map/` is not in the diff. The `App.tsx` and `url.ts` changes are limited to the `story` flag: the same-page check now includes `story`, Escape steps story to page to card, `fromPage` history-back mirrors `fromCard`, and `story` is written bare and parsed only with `page`. Leaks: the map, resize listeners, the IntersectionObserver, the scroll listener, the rAF, the document keydown listener in facts, and the legend are all removed on unmount [read]. Tests: no `.skip`, `.only` or allowlist added. The cite "allowed" set is the guide's own lists [ran grep].
