# Code review: claude/map-tour-guide (ReviewBot, Opus, 21 Oct 2026)

**Verdict: merge after fixes.** Blockers 0 · Should fix 6 · Notes 6.

Scope: `git diff origin/main...origin/claude/map-tour-guide` over src/, tests/, index.html, guides/, about/, public/, vite.config.ts, Tools/check.sh (no PNGs, mocks or geojson). Worked in a `git archive` copy.
Ran: `npx vitest run tests/unit/story-* tests/unit/pages-helpers.test.ts`: 7 files, 61 tests, all pass. No Playwright.

## Should fix

**S1. Focus is lost when the map opens and when it closes.** `src/pages/PlacePage.tsx:399` (the band and its "Open the map" link unmount when `tour` turns on) and `src/story/GuideMap.tsx:134` (the "Hide map" button unmounts when it turns off). `PlacePage` keeps the same key (`App.tsx`, `key={place.id}`), so the heading-focus effect (`PlacePage.tsx:63-66`, deps `[place.id]`) does not run again. Result: focus falls back to `<body>`, and keyboard and screen-reader users lose their place (WCAG 2.4.3). Fix: when `tour` changes, move focus. On open, send it to the map column's caption or the Hide map button. On close, send it to "Open the map" (or `#why-h`), with `preventScroll`. Add a check to the "Hide map" spec. *Inferred (read).*

**S2. On desktop the reading order does not match what you see.** `PlacePage.tsx:366-370` renders the `<aside class="pg-tourmap">` before `.pg-listing`, and `story.css:22` (`order:2`) moves it to the right. Keyboard and screen-reader order therefore goes: bar, then Hide map, the map canvas and every fact marker, and only then the crumb, title and guide (WCAG 1.3.2 / 2.4.3). On a phone the strip sits on top, so the DOM order is right there. Fix: put the aside after `.pg-listing` in the DOM and give it `order:-1` at the phone width. Alternatively, keep the DOM order and add a skip link, but moving the aside is simpler. *Inferred (read).*

**S3. Reopening the map replays the last fly link.** `flyAsk` lives in `PlacePage` (`PlacePage.tsx:109`) and survives Hide map, because the key does not change. When the map opens again, `GuideMap`'s fly effect (`GuideMap.tsx:112-121`) runs on mount with that old `fly`. It overrides the section-in-view step from `pick()` and flies to a stop the reader is not looking at. Fix: `setFlyAsk(undefined)` when `tour` turns false, or let GuideMap skip a `fly` whose `n` it saw at mount. *Inferred (read).*

**S4. The decorative still in the band can be reached by keyboard.** `src/story/TourStill.tsx:18-20` uses `createMap`, which makes an interactive MapLibre map (no `interactive:false` is passed; `createMap.ts:75-83`). Turning off the handlers does not take the canvas out of the tab order, and a screen reader still reads it as a "Map" region. This adds an empty tab stop inside the band before "Open the map". Fix: in TourStill, set `tabindex=-1` and `aria-hidden` on the canvas container, or add an `interactive` option to `createMap`. Keep the compact attribution control reachable, because that is the imagery credit. *Inferred (read; maplibre-gl.js not opened under the rules).*

**S5. Tests for the home "map tours" tile were dropped, not moved.** `tests/unit/story-list.test.ts` was deleted with the module. `storyCount`/`fillStoryCount` now live in `src/home/guideCount.ts:18-21`, and `vite.config.ts:26` still uses them, but no test covers them any more. Nothing checks the home links' new `guides/#map-tours` target (`index.html:66,150`) either (grep of tests/: no hits). This is lost coverage, not a loosened assert. Fix: move the three tile tests into `tests/unit/home.test.ts` and point them at `guides/#map-tours`. *Confirmed (read, grep ran).*

**S6. "Show only guides with a map tour" does not filter.** `src/home/guideCount.ts` (`fillGuideList`, the `tourlink` line) is a plain `#map-tours` anchor jump. Every guide stays listed, and the label promises a filter. Fix: either a CSS `:target` rule on `.gl` that hides the other region sections while `#map-tours` is the target, or ask the owner for a new label. The wording is his decision, not this review's. *Confirmed (read).*

## Notes

- **N1.** Every visit to a guide with a tour now calls `createMap` for the still (`TourStill.tsx:18`), which calls `registerImagery` again (`createMap.ts:73`). That re-adds the global `pnoa`/`esri` protocols, with `onPnoaDown` bound to the still's map. After the still unmounts, a PNOA outage would call `setTiles` on a removed map instead of the atlas's. `storyMap.ts:50` already did this before this PR; the PR only makes it happen more often. Fix later: register once, and keep `onPnoaDown` per live map. *Inferred (read).*
- **N2.** The step-delay timer is not cleared on unmount (`GuideMap.tsx:97-109`). It is harmless, because `smap.current` is null by then. Add `return () => clearTimeout(timer.current)`. *Read.*
- **N3.** The fly-link click in tour mode (`PlacePage.tsx` `pill`) calls `preventDefault` even on Cmd/Ctrl/middle clicks, so "open the atlas in a new tab" does not work. Skip the handler when a modifier key is held or `button !== 0`. *Read.*
- **N4.** A guide fly link with no tour step does nothing in tour mode: `stepOfLink` returns -1, the effect returns, and the click was already prevented. Today every link has a step (ran: Rioja 7 of 7, Priorat 4 of 4). `story-steps.test.ts:30` only checks the other direction (step → link). Fix: add the link → step check, or fall back to the atlas `Link`. *Ran.*
- **N5.** The redirect pages (`public/map-tours/index.html`, `public/read-with-the-map/index.html`) are relative, static, `noindex`, and take no query input, so they cannot be used as an open redirect (confirmed, read). Their `rel=canonical` points at a fragment URL on a noindex page, which sends search engines mixed signals and does no harm; it could be dropped.
- **N6.** Chart colours: BSh and BWh share `#9E2A1B` in the chart on purpose. The legend tells them apart by name and %, and the unit test's regex case is the only loosened check (accepted on the card). Every Köppen code in `data/place-measures.json` belongs to one of the six groups (ran), so no grey `NO_CLIMATE_COLOR` shows in a chart. Mild Mediterranean `#D2D45A` and Other `#D9D3C7` are below 3:1 against white. The legend text carries the values and the new inset border helps, so this is a note only.

## Checked and fine
- Guide page with and without the map: no section is lost. The spec checks that the climate chart and `#taste` stay with the map open. The band is not rendered in tour mode, so the still's map and the tour map never coexist. *Read.*
- Clean-up: the map `remove()`, ResizeObserver, scroll/resize listeners, rAF (GuideMap), and the IntersectionObserver, rAF and map (TourStill) are all released in effect clean-ups. *Read.*
- Old address `#place=<id>&page&story`: `App.tsx` maps it to `tour` when `hasStory` is true and to the plain page otherwise. Covered in story.spec. *Read.*
- Lazy loading: `GuideMap` and `TourStill` are `lazy()`, and `load.ts` (the eager story glob) is reached only through them. `vite.config.ts:15` sends non-entry chunks with src/story or content/stories modules to `dist/story/`, which `Tools/check.sh` counts apart. *Read, build not run.*
- Climate names: a single word list. The test ties every single-code legend group to the chart name. *Ran.*
- Tests: no `.skip`, `.only`, `fixme` or allowlist in the diff (grep ran). The place-page spec switching from Rioja to Alella follows the owner's "Show on map only without a tour" decision; it is not a loosened check.
- Secrets: none in the diff (grep ran).

## Not checked
Built bundle contents (no build run), Playwright and visual layout, the `story.css` phone strip in a browser, `docs/` changes.
