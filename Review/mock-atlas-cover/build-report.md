# Atlas cover build report

**Verdict: done, with two flaws and one risk (below).** Unit tests, `Tools/check.sh quick`, the new UI spec and `npm run build` pass; desktop and phone screenshots are in `build-shots/` and were looked at.

## Steps
- Step 1 media: `Tools/atlas/cover_media.mjs`, `public/atlas/*` (commit 774e0e7). Build 2 s; each clip run about 40 s.
- Step 2 card (WIP 036b457, then the final commit): `src/cards/AtlasCard.tsx`, `src/cards/atlasCover.ts`, strings in `strings.atlas`, styles in `app.css`, `rioja-1` crop `50% 80%` in `photoCrops.json` (checked by eye in the real 16:7 frame; the Guides-page test now also allows the cover photo). Unit tests ~0.5 s: atlas-cover (new), cards, url-page, url-quiz, home, story-view. `Tools/check.sh quick` all passed. UI spec `tests/ui/atlas-cover.spec.ts` passed (2.6 s).
- Step 3 records: `data/SOURCES.md` row and Esri-terms line (clips flagged as a new kind of screen capture for ReviewBot); one line in `docs/PROJECT.md`.

## Spain address
`#country=spain` (parameter `country`, same style as `place` and `region`). The empty hash is the cover (`ATLAS`, a `country` selection with id `atlas`). Old `#place=` and `#region=` links are unchanged. An unknown place or region id still falls back to the Spain card. Changed old unit expectations (deliberate): empty hash and `#page`, `#study`, `#quiz` now parse to the cover, not Spain. No conflict with #198's `paths.ts` (it only touches place pages).

## Clips and sizes (public/atlas)
webm (VP8) only: no system ffmpeg, so no mp4 / H.264 (Safari older versions may show the poster only). atlas-tour.webm 499,463 B (~6.0 s); atlas-tilt.webm 549,809 B (~5.2 s); posters tour 82,380, tilt 28,906; stills borders 50,700, climate 94,484, guide 62,266. All under limits. Clips use `preload="none"`, play only while visible (IntersectionObserver), poster only under reduced motion. I did not set the `autoplay` attribute (it would play off-screen); the observer calls play().

## Not done / flaws
- Tour clip: loop is A to B to A; start/end match closely but timing varies by run (software GL); the first frame is slightly mid-flight.
- Tilt clip: small grey tile gaps at the top corners during the turn and a dark sky band (software-GL tile timing). A rerun on a real GPU Mac may be cleaner.
- Guide still is a screenshot of the Rioja guide page (interface included), not the mock's photo.
- **Risk: other UI specs.** Nine UI specs open `./` and expect the Spain card; the empty hash now opens the cover, so they will fail in CI until they open `#country=spain` (not run, not edited: outside this card's one-spec scope).
- Mobile phone sheet shows the hero at the top; the rest scrolls as other cards do.
