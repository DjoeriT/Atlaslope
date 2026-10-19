# Guides page fills itself in, About reframed (19 Oct 2026)

## Done
- The Guides page (`guides/index.html`) said "4 of 79 places, all in Rioja" with 37 guides live. Its list, count, bar and region count are now
  filled in at build time from `content/guides/*.json` and `data/places.json` (`guideRows` and `fillGuideList` in `src/home/guideCount.ts`,
  wired in `vite.config.ts` next to the home page count). Order: study regions in course order, places in course order, zones after their place.
  A guide file with no place in `data/places.json` fails the build.
- Guides subline and the About page reworded for the 19 Oct positioning: a wine reference for anyone who loves wine; Study is one optional step.
  Facts, sources and the independence line kept; WSET and Wine Scholar named only there.
- Unit tests in `tests/unit/home.test.ts`. Release 41 tester note; release 40's moved to `Review/archive/`.

## Decided
- [O] Owner 19 Oct: a released guide must show up on the Guides page with no extra step.
- [A] Denominator is every place in `data/places.json` including Rioja's three zones (109), because zones have guides. The home page's "106 wine places" counts top-level places only.

## Open
- "Who made it" stays "coming soon" until the owner writes it. The home donation line still asks for money with no way to give.
- Website slice 3 (a static page per guide, sitemap) waits for his go.
