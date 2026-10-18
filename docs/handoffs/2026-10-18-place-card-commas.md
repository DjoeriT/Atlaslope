# Place card commas (18 Oct 2026)

Owner, 17:15Z, with a screenshot of the Vinos de Madrid card: "What's with the commas".

## Done
- Study region "Meseta: Castilla-La Mancha, Madrid, Extremadura" shows as **Meseta** everywhere (trail, tiles, region page, Study). The course's
  full chapter name stays in `data/places.json` as `chapter`: the Wine Scholar badge tooltip on guide pages shows it, and search finds
  Meseta by it ("Extremadura"). The other nine region names were already short; none changed.
- Trail: a step and its › stay together (no lone ›), even spacing (the 2.75rem min-width on crumb links padded short names like "Spain").
- All 78 place ledes (`content/facts/*.json`, `why.text`) rewritten to two short sentences: no comma splices, no "X, Y and Z" runs. Same
  sources, same pages, no new facts; some facts dropped from the lede (they stay in the sheet's own rows). Conca de Barberà was already fine.
  Three tile lines in `content/tiles.json` lost their three-adjective runs.
- Citations: "Title · 2014 · pp. 5–6" (was "Title, p. 5, p. 6, 2014"); page runs become ranges (`pageText` in `src/facts/format.ts`).
- Photo credits: "Name · CC BY 2.0 · resized" (was commas).
- Photo hover shows only the credit, never the alt: the alts are Commons file names ("P -24x15").

## Already fixed before this slice
The doubled "Vinos de Madrid · DO" kicker and "DO · Meseta…" sub line in the owner's screenshot were an old cached build; live release 30
had neither [V, atlaslope.com 17:20Z].

## Open
- Photo alt texts are Commons file names for many photos (`data/photos.json`); screen readers read them. Needs real descriptions, own slice
  (issue filed).
- Glance cells still list wine types with commas ("Red, white, rosé, sparkling, sweet"): data, not prose; left as is.
- txakoli-bizkaia sheet still contradicts itself on acidity (known, not this slice).

## Where
Before/after shots: `/mnt/project-files/atlaslope/reviews/2026-10-18-place-card-commas/`.
