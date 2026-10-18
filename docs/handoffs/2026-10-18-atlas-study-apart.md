# Handoff: Atlas and Study apart, quick fixes (18 Oct 2026)

Slice 1 of the atlas overhaul (owner's 16 points, thread "the Atlas"; plan `/mnt/project-files/atlaslope/plans/2026-10-18-atlas-overhaul.md`).

## Done
- **Study out of the Atlas** (point 1): no Today card on the Spain card's spot, no "Start today's round" bar, no due counts on region and
  place rows (`src/app/App.tsx`, `src/cards/Cards.tsx`; `src/quiz-ui/TodayCard.tsx` removed). The Study doors still show what is due.
  This replaces the "Once a day" Today card (owner card, 18 Oct 2026 morning) on his later word "Now I see Study todos in the Atlas".
- **Climate labels** (point 2, recommended option of the card): Oceanic, Humid subtropical, Mild Mediterranean, Hot Mediterranean,
  Cold semi-arid, Hot semi-arid and desert, each with a short line from the Köppen definition; the code shows on hover (`src/map/climate.ts`).
- **Buttons** (point 13, recommended option): "Open the X page" became "Explore X"; the region page lede says "guide".
- **Hover text** (point 11, part): every icon-only button on the map and cards has a `title`.
- **Map credit** (point 4): already folded into its ⓘ since release 22 (`src/map/createMap.ts`); no change. Photo credit tag is 0.7 rem.

## Decided
Defaults taken on the recommended card options (climate names, "Explore X"); the owner can reopen either.

## Open
- Point 4: which element he still finds too big; asked in the thread.
- Points 3, 5, 10, 12, 14 (slice 2), 1 copy, 15, 16 (slice 3), 6, 7 (slice 4, thread "Relief and base map"), 8, 9 (slice 5).
- Page charts still use the full Köppen names ("Warm-summer Mediterranean"); align with the legend in slice 2.
- SEO: pages stay `noindex` until his Google decision; real per-guide addresses are website slice 3.

## Where
Branch `claude/atlas-overhaul-qmyz4g`; tests touched: map-colours, quiz-doors, place-page, region-page, ux-sweep, mobile, unit climate.
