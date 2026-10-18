# Handoff: one guide page (atlas overhaul slice 2), 18 Oct 2026

Owner points 3, 4, 5, 10, 12, 14 of his 16-point atlas message. Thread "Atlas guide page". Plan: atlas overhaul slice 2.

## Done
- 14, one guide: Terroir is a section of the guide in the page's own type (no kicker, no drop cap, fly-there pills became plain links).
  "Page" left the wording: "The Rioja guide", "In this guide". Reading time moved to the label row under the title.
- 3, photos: guide header is a hero plus up to two photos (`src/pages/Mosaic.tsx`), "All N photos" button; map card cover is the same
  small mosaic (`src/cards/Cover.tsx`). Arrows only in the full-screen viewer (`src/pages/Lightbox.tsx`, a `<dialog>`, arrow keys, Escape).
- 4, credits: every on-photo credit is a 1.1 rem © tag that opens to the full credit on hover, focus or tap (`CreditTag` in
  `src/cards/Credit.tsx`, one component). "Photos:" lines under mosaics went from 0.78 to 0.7 rem.
- 10, comparisons: `data/place-measures.json` gained `country.spain` (from `spain-mask.json`) and `regions.<id>` (union of a region's
  appellations, zones left out), same method. Charts show the place, the zone's appellation or the study region (when it differs), and all
  of Spain on one scale (`src/pages/Charts.tsx`). Rule in `Review/visual-style.md` "Content".
- 12, labels: solid level badge (full name on hover), "Wine Scholar · <region>", "WSET Level 2 and 3" from `content/curriculum.json`
  (names from WSET L3 spec Issue 2, May 2022, and L2 Issue 2.1, Apr 2026; 19 places at L3, 8 at L2; zones and VP get none).
- 5, card width: benchmark [V] Google Maps 408 px, Apple Maps web 420, Komoot 420; Airbnb ~47%, Zillow ~52% of 1440. Keep 400 px; any
  change is the "Atlas copy and tiles" thread's (tiles drive it). Benchmark: /mnt/project-files/atlaslope/reviews/2026-10-18-guide-page-benchmark.md.

## Open
- Owner's pick of the look (subtle, recommended, bold, recommended + numbered chapters); built on recommended.
- "Read with the map" story mode (accepted mock) not built; its own slice on his word.
- Home hero map credit (`src/home/home.css`) still the old text tag: not a photo, owned by the home files.

## Where
Screens: /mnt/project-files/atlaslope/mocks/guide-page-v1/ (1-9 the range, 10-14 credits before and after).
