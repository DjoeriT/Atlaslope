# Card 1: map-tour fixes (branch claude/map-tour-fixes)

Status: done. Not pushed.

| Fix | Result | Evidence |
|---|---|---|
| F1 scroll reaches every stop | done. Each step anchors on its own fly link / zone card; overviews keep chapter top, lede keeps lede. Links in one row are spread 12 px (`spreadRows`) so each is reachable. Header comment of steps.ts updated. | story.spec "stops 1 to 9 in order" at 1440 and 390; unit tests in story-steps.test.ts |
| F3 "Map tour" link at top | done. Sits right of "Show map" (also on phone, where Show map is hidden); scrolls to `#map-tour` band and focuses it. Copy `strings.story.jumpToTour`. | shots-1/top-link-1440.png, top-link-after-click-1440.png, top-link-390.png; story.spec |
| F7 labels beside pins | done. Town, range and peak labels anchor left with a 1.3-1.6 em offset; named-place markers 16 px. Checked on Laguardia, Elciego, Sierra de Cantabria, Alavesa. | rioja-1440-stop2-sierra.png, rioja-1440-pin-alavesa.png |
| F4 weak stops | done, JSON only. Rioja 2: centre -2.72/42.56, zoom 10.4, pitch 62; Rioja 8 holds the soils view (rioja-alavesa, same camera and focus); Rioja 9 centred on Haro, zoom 13.2, pitch 55; Priorat 1: zoom 10.9, pitch 55, gaps gone. No max-zoom field needed (fixed zoom), so format.ts and docs unchanged. | rioja-1440-stop2-sierra / stop8-barrel / stop9-haro, priorat-1440-stop1-montsant |
| F9 one tour file per guide | done. PlacePage loads only its story (`storyOf`), hands it to band, still and map. dist/story has separate rioja and priorat chunks. | build output |
| F10 guides/#map-tours | done: `scroll-margin-top` on `.gl .region` (src/home/guides.css, not guides/index.html). | shots-1/guides-map-tours-1440.png |

Caveats
- Headless shots show no PNOA imagery (no network in the run), so stop 9's sharpness at zoom 13.2 is a judgement from the framing, not seen. Owner or lead to eyeball on his Mac.
- A real-use note: a click on a link, if the page also scrolls, can be overridden by the scroll pick. Not changed.
- Changed an old test (story-view "takes the stop's point...") to use a synthetic step, since it used Haro's old camera as its example; mechanism still covered.
- Layout shifts from lazy images can move anchors after a scroll; the UI tests re-scroll with `toPass` for that.

Tests (counts, wall time)
- Tools/check.sh quick: 42 files, 383 tests pass, 3.8 s. (before final CSS tweak; rerun after: pass.)
- tests/ui/story.spec.ts: 9 pass, 21 s. npm run build: 1.6 s, per-tour data tiny (rioja 4 KB, priorat 3 KB).

Commits: bbbff82 (all code, content, tests); a later commit holds the Show-map-row link move, shots and this report.

Tokens: roughly 150K new-heavy, mostly re-read context (not measured).
