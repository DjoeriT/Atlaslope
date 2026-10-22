# Build brief: Guides page as option E round 3 (owner, 22 Oct 2026)

Owner's words: "It's way too busy and full" (review); "a combination of D and A, where there's smaller squares and ... the map tour
element featured more prominently and visually"; chip "1: chip on photo"; band "their photos"; "Explore with the map and then have 4 of
them featured with an expansion list that folds out the rest"; "E round 3 it is; write the build brief and build it."

Target, exactly: `mocks/guides-r1/index.html#solo=e` (local, git-ignored), README.md "E", shots `shots/first-e-*.png`,
`frame-e-unfolded-1440.png`, `sheet-e.png`.

## What the page is
1. Headline and sources note as now (copy unchanged).
2. Black band (site black + champagne), heading "Explore with the map" with the count beside it ("15 guides", from the story files).
   Four featured tours, square photos about 270 px (4 per row at 1440, 2 on a tablet, a swipe row at 390): Rioja, Priorat, Ribeira
   Sacra, Getariako Txakolina. Rioja gets a stronger checked photo than the mock's grey-sky one (from its existing photos; crop checked).
3. One `<button>` "Show all 15 map tours" / "Show fewer" (aria-expanded, aria-controls, focus ring, no motion under reduce) folds out
   the other tour guides in the band at about 210 px (5 per row; 2 on a phone). Folded by default. Count and list from the story files.
4. Region links and the "Show only guides with a map tour" filter (filters in place) as in the mock.
5. Every region: heading with guide count, small square photos (8 per row at 1440, 5 on a tablet, 3 on a phone), name right under,
   kind only when not DO. All guides, not 6 per region. A guide without a photo gets no tile: one "Also: ..." line after the grid.
6. Every tour tile (band and grids) carries the champagne chip on the photo, top left: #E9D8B4, black folded-map glyph + "Map tour",
   6px corners, soft shadow, not a pill. Owner's one exception to "no text on photos" (credits still never on photos).
7. One always-visible "Photos: Name · licence · cropped and resized" credit line for the page's photo set.
8. Gone: the showcase (big map, facts, button), the repeated "Guides with a map tour" card section, the per-region satellite maps
   and per-region credit blocks, the summaries on cards.

## Rules
Square crops with the checked focus (`src/home/photoCrops.json`, unit test); no dark mode; 6px corners; no pills; copy one idea per
line; users see "AtlaSlope". Guide data from `guideRows()` (no hand-typed lists). Keep `guides/#map-tours` working (jumps to the band).
`docs/guides.md` if any guide-list rule changes. Records in the same PR: handoff, tester note `Review/release-66-what-to-test.md`
(release 65's note too, missed in #191), release-64 note to archive.

## Checks
Unit tests for the list builder (all guides, tour count from story files, Also line, chip only on tours); UI spec for the fold button
and the filter; `npm run shots` of the Guides page at 1440, 834, 390 next to the mock shots; page height measured against the mock
(E folded 5,628 / 8,955). ReviewBot (new screen): design and code. Merge on green, then ask about the release.
