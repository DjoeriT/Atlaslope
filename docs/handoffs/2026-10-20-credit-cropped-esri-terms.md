# Handoff: "cropped and resized" credit, Esri terms check (20 Oct 2026)

## Done
- #154: Guides page photo credit now says "cropped and resized" for CC BY files (`creditLine`, `src/home/guideCount.ts`). Every photo
  there is cropped: square cards and the featured mosaic both use `object-fit:cover` (`src/home/guides.css`). Place pages keep "resized"
  (`src/cards/Credit.tsx`), their photos keep their ratio. Unit test updated (`tests/unit/home.test.ts`).
- #155: Esri terms read and recorded in `data/SOURCES.md`, section "Esri terms for the saved satellite screenshots".
  Screen captures of Esri maps on your own product's site are allowed with a credit near the image [V, Esri FAQ and Static maps page].

## Open (owner decisions)
1. Capture route: tiles were shot from the keyless public endpoint, while Esri's FAQ makes use conditional on Esri software or an account.
   A (recommended): allow localhost on the Esri key (or a second, local-only key) in his ArcGIS account, then retake the 10 tiles, hero,
   share image and About map once with the key. B: PNOA-only static images (Spain only). C: leave as is.
2. Credit wording: Esri's item now credits «Vantor» (formerly Maxar) and suggests an IP line. Options: «Imagery: Esri, Vantor · Spain:
   PNOA © IGN» (recommended, smallest change) or the full Esri sentence.
- Esri's full terms page (`links.esri.com/agol_tou`) returned 403; not read [A].
