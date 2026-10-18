# Atlas copy and tiles (18 Oct 2026)

Slice 3 of the atlas overhaul (plan `/mnt/project-files/atlaslope/plans/2026-10-18-atlas-overhaul.md`), PR #93. Owner points 1 (evocative copy), 5 (card width), 15 (region tiles), 16 (place tiles).

## Done
- Spain and the 10 study regions open with a written lede. Under it, a line names the places whose documents it restates, each linked to its card.
- Regions and places are two-column photo tiles, each with a label (place count or kind), the name and a headline. An odd count puts the first tile at full width.
- All copy is in `content/tiles.json`: the Spain lede, 10 region titles and ledes, and 79 place titles, each with cites. `tests/unit/tiles.test.ts` checks coverage, ids and cites.
- Independent source checks passed all lines (round 1: 9 fixes; round 2 after the owner asked for less, one idea per line: 4 fixes) (`/mnt/project-files/atlaslope/reviews/2026-10-18-tile-copy-source-check.md`).
- Card width is `--card-w: clamp(25rem, 29vw, 27rem)`, so 400 to 432px. The benchmark measured map-first panels at 408 to 420px (`/mnt/project-files/atlaslope/reviews/2026-10-18-guide-page-benchmark.md` part B).
- Tile photo credits sit in one line under the tiles (visual-style "Photos").
- Round 1 mock (four directions, subtle to bold, with all copy): https://claude.ai/artifact/Df8Wm37xkkU8G6JMKSFg9m

## Decided
- Direction C (photo cards) was built on the recommended option while the owner's card waited.
- Copy rule: a place title restates only its own sheet's "why" row. A region or Spain line restates only the places listed in its `from`.
- The hover title on tiles stays (point 11), though ReviewBot suggested dropping it.

## Open
- Owner picked C (card 16:39Z) and OKed copy round 2 ("Yes way better", 16:46Z).
- 30 places without a fact sheet (the Vinos de Pago, Cava, Catalunya, Islas Canarias) show only their kind. They get headlines when their sheets exist.
- The txakoli-bizkaia sheet contradicts itself: its "why" row says high-acid, its styles row says lightly acidic. It needs a source check.
- Cover.tsx `sizes` still assumes a 25rem card. This is minor: the card is at most 27rem.

## Where
`content/tiles.json`, `src/facts/tiles.ts`, `src/cards/Cards.tsx` (`Tile`, `Lede`, `TileCredits`), `src/styles/app.css` (`.tiles`, `--card-w`, `.tile-credits`, `.ledesrc`).
- Card and guide-page trails now name only the levels above the title (owner 16:45Z: "Spain and Spain in one screen"). The place card's sub line shows the kind only.
