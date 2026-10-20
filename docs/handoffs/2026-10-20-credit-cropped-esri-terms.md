# Handoff: "cropped and resized" credit, Esri terms check (20 Oct 2026)

## Done
- #154: Guides page photo credit now says "cropped and resized" for CC BY files (`creditLine`, `src/home/guideCount.ts`). Every photo
  there is cropped: square cards and the featured mosaic both use `object-fit:cover` (`src/home/guides.css`). Place pages too
  (`src/cards/Credit.tsx`): ReviewBot (Review/pr-161-credit-review.md, note B) found they also crop (cover, mosaic and 4:3 cards use
  `object-fit:cover`, `src/styles/app.css`, `pages.css`), so the issue's "other pages keep resized" did not hold. One wording everywhere;
  it slightly over-states in the lightbox (`object-fit:contain`). Tests updated (`tests/unit/home.test.ts`, `tests/ui/place-page.spec.ts`).
- #155: Esri terms read and recorded in `data/SOURCES.md`, section "Esri terms for the saved satellite screenshots".
  Screen captures of Esri maps on your own product's site are allowed with a credit near the image [V, Esri FAQ and Static maps page].

## Open (owner decisions)
1. Capture route: tiles were shot from the keyless public endpoint, while Esri's FAQ makes use conditional on Esri software or an account.
   A (recommended): allow localhost on the Esri key (or a second, local-only key) in his ArcGIS account, then retake the 10 tiles, hero,
   share image and About map once with the key. B: PNOA-only static images (Spain only). C: leave as is.
2. Credit wording: Esri's item now credits «Vantor» (formerly Maxar) and suggests an IP line. Options: «Imagery: Esri, Vantor · Spain:
   PNOA © IGN» (recommended, smallest change) or the full Esri sentence.
- Esri's full terms page (`links.esri.com/agol_tou`) returned 403; not read [A].
