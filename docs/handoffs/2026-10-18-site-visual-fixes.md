# Handoff: site visual fixes (18 Oct 2026)

## Done
Every P1 and P2 finding of the live-site review (`/mnt/project-files/atlaslope/reviews/2026-10-18-site-visual-review.md`), plus the
owner's 13:26Z ask for much smaller photo credits. One PR on `claude/site-visual-fixes-yemob9`.

- **Site bar** (P1.1): guides and region pages use the site bar as is (`src/pages/PageTop.tsx`): logo 16 px from the edge, Atlas current,
  Atlas goes back to the place on the map (keeps the old "Back to map" history step), no "Back to map" button. Search shows on phone pages too.
- **Map selection** (P1.2): the wine-brown was the Rioja zones layer, tinted `#AE4656` at 30% over the selected DOCa (`src/map/style.ts`).
  Zones now: no fill until hovered or selected (black), champagne lines. Home hero and `public/share.jpg` reshot.
- **Short citations** (P1.3, owner card "Go, short citations"): `SourceLine short` on the guide (`src/cards/PlaceFacts.tsx`), short names
  from `shortTitle` (`src/facts/format.ts`), `SourceList` in a new Sources section (last in the jump bar). Map cards keep full lines.
- **Type** (P1.4): every size snapped to the scale (scratch script, not kept), Newsreader 500 for headings, 300 only for the home display.
  Home tile titles are Newsreader.
- **Home tiles** (P1.5): `public/home/guide.webp` and `study.webp` are crops of one readable detail.
- **Photos** (P2.6): `rioja-1` and `rioja-2` swapped (data, sizes, files; noted in `data/SOURCES.md`); Spain card leads with Jerez;
  home guide photo is the Laguardia vines.
- **Alignment** (P2.7): sources strip left, footer on the tile grid, jump bar flush, one 38 rem measure for running text.
- **Welcome** (P2.8): `FirstRun` is a three-line note on moving the map, gone at the first touch; focus ring is black (`--focus`).
- **Study** (P2.9): flat door sections, 1 rem above buttons, full-width "Got it" with the link left.
- **Map chrome** (P2.10): attribution starts folded on every screen (`createMap.ts`), button column at 2.75 rem above it.
- **Labels** (P2.11): wine names win over town names (`src/map/labels.ts` filters town names whose estimated box touches a wine label,
  after each move); names also avoid the button column and legend.
- **Targets** (P2.12): glance "Source" links, breadcrumb links, the phone logo and the attribution "i" have 44 px tap areas.
- **Credits**: 0.7 rem white on 55% black, artist and licence only; contrast test added.
- `Review/visual-style.md` updated: zones, focus ring, scale and weights, credit tag, short source tags, one bar, tiles, first-run note.

## Decided
Owner card 13:25Z "Go, short citations"; owner 13:26Z "image source elements way smaller". Defaults taken here: short names as
listed in the style sheet; map cards keep full source lines; display weight 300 only on the home headline and numbers.

## Open
- Not verified: Safari, iPad, real phones, the town-name yielding on a real satellite map (cloud only), link preview caches.
- P3 findings (zones twice on Rioja, one-producer section, non-breaking units, footer About) are not in this slice.
- Release 22 only on the owner's "publish release 22".

## Where
Screens: `/mnt/project-files/atlaslope/reviews/2026-10-18-site-visual-fixes/`. Tester note `Review/release-22-what-to-test.md`.
