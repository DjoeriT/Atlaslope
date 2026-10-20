# Handoff: "cropped and resized" credit, Esri terms check (20 Oct 2026)

## Done
- #154: Guides page photo credit now says "cropped and resized" for CC BY files (`creditLine`, `src/home/guideCount.ts`). Every photo
  there is cropped: square cards and the featured mosaic both use `object-fit:cover` (`src/home/guides.css`). Place pages too
  (`src/cards/Credit.tsx`): ReviewBot (Review/pr-161-credit-review.md, note B) found they also crop (cover, mosaic and 4:3 cards use
  `object-fit:cover`, `src/styles/app.css`, `pages.css`), so the issue's "other pages keep resized" did not hold. One wording everywhere;
  it slightly over-states in the lightbox (`object-fit:contain`). Tests updated (`tests/unit/home.test.ts`, `tests/ui/place-page.spec.ts`).
- #155: Esri terms read and recorded in `data/SOURCES.md`, section "Esri terms for the saved satellite screenshots".
  Screen captures of Esri maps on your own product's site are allowed with a credit near the image [V, Esri FAQ and Static maps page].

## Decided (owner, 20 Oct 2026)
1. Capture route: C, leave the keyless screenshots as they are (recorded in `data/SOURCES.md`).
2. Credit: «Esri, Vantor» replaces «Esri, Maxar» in `src/map/style.ts` (map), `src/home/guideCount.ts` (Guides tiles), `index.html`,
   `about/index.html` and `Tools/share/make_share_image.py`; `public/share.jpg` rebuilt (sips at quality 60, 162 KB; Pillow is not
   installed on the Mac). Mocks and old reviews under `Review/` keep "Maxar" (history).

## Released
- Release 56, tag on `7c784a3`, publish run 39381650049 green; live Guides page checked [V]. Tester note `Review/release-56-what-to-test.md`
  came late, in the docs PR (missed in PR 161).

## Next (owner order, 20 Oct 2026)
#83 flaky Study tests, then #126 "If you like this, try" cards (decide the place-page photo ratio there), then #127 + #148 as one big
slice: find why the Rioja flyby is gone, mock for Rioja, then a shortlist of other guides.

## Open
- A PostToolUse hook after `gh workflow run publish` asks for a "live: release-N on <hash>" line in memory and PROJECT_CONTEXT.md; CLAUDE.md
  forbids such lines (18 Oct). Not followed; the hook needs updating or removing (owner's call).
- Esri's full terms page (`links.esri.com/agol_tou`) returned 403; not read [A].
