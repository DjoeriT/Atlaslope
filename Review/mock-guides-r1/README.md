# Guides page redesign, mock round 1 (22 Oct 2026)

Mock only: no app code, content or data touched. Four calmer versions of the live Guides page.
Output: `/Users/djoeri/Developer/Atlaslope/mocks/guides-r1/index.html` (git-ignored, ONE page, 189 KB, photos and map frames beside it in `img/`, `maps/`). Sticky switch A | B | C | D, Desktop | Phone per option, `index.html#solo=a` (b, c, d) opens one alone.
Build: `npm run build; npx vite preview --port 4173; node capture.mjs; node maps.mjs; python3 -I build.py`; check: `node shoot.mjs` (19 s). Build 2.3 s, build.py 0.5 s.

## Data (real)
`rows.ts` runs the app's own `guideRows()` (via vite-node); `capture.mjs` cross-checks it against the built page in Playwright: 54 shown cards match on name, kind, minutes, tour mark, photo and focus, 0 mismatches [V]. Focus is from `src/home/photoCrops.json` (all start-here photos are centre). 109 guides in 10 regions, 15 with a map tour, 83 with a photo.
Live page measured [V]: 54 region cards (the page caps each region at 6 and links "All N guides") + 15 in the tours section = 69 cards, 75 images in main, 16,697 px at 1440. So the 69 in the brief already includes the 15 repeats, not 69 + 15.

## Options (after the fix round and option E, 22 Oct 2026)
- **A Trim**: live structure, small squares (6, 4, 2 per row). Card = photo, name, "Map tour" mark right after the name, one line (kind unless DO, minutes). A guide without a photo gets no tile: it is named in a text line under the grid. No tours section, no showcase; the checkbox shows all 15 tours.
- **B Index**: one hand-picked square photo per region, then all guides, two columns read column-wise, a hairline per row, name + Map tour mark, kind (not DO) + minutes right. Phone rows 48 px, one line where it fits.
- **C Map first**: real map screenshot (sticky on desktop, readable labels: shot at 1000x800 and cropped to 640 square; on a phone zoomed 1.4x), regions open one at a time, the map follows. Phone meta "9 guides · 7 tours" on one line. No photos.
- **D Start here + index**: region links on top, then four photo cards (Rioja, Priorat, Ribeira Sacra, Getariako Txakolina; a swipe row on a phone, 78% wide cards), "All guides" with the checkbox, then B's index.
- **E Explore with the map + small squares (recommended, round 3)**: D and A combined. A black band "Explore with the map" with "15 guides" beside it, like the region headings. It shows 4 featured tours at about 270 px (4 per row at 1440, 2 on a tablet, a swipe row of 240 px tiles at 390): Rioja, Priorat, Ribeira Sacra, Getariako Txakolina (own square photos, checked focus; Rioja's, a grey sky over a vine post, is the weakest). One real button "Show all 15 map tours" / "Show fewer" (aria-expanded, aria-controls, focus ring, no animation) folds out the other 11 in the same band at about 210 px (5 per row; 2 per row on a phone). Folded by default. Then every region as small squares (8 per row, 5, 3 on a phone), names right under the squares, kind only when not DO. Every tour tile carries the champagne chip on the photo (folded-map glyph + "Map tour", the owner's exception to "no text on photos"). Guides without a photo: an "Also" line. All 109 guides. The checkbox filters in place. One Photos credit line.

## Region photos in B and D (picked by hand from a contact sheet of all 83 photos; checked focus from photoCrops.json; no face, glass or bottle; none of the four Start here photos)
Green Spain: txakoli-alava (mountains over the valley). Castilla y León: toro (snow range over vines). Rioja: rioja-alavesa (valley floor). Navarra and Aragón: somontano (village and vines). Cataluña: catalunya (canal and vines). Valencia and Murcia: jumilla (open valley). Meseta: vinos-de-madrid (old vines, hills). Andalucía: sierras-de-malaga (vine slope). Balearic Islands: pla-i-llevant (village from above). Canary Islands: lanzarote (volcanic pits).

## Measured (page height, px; live 16,697 at 1440, 47,000 at 390 from the brief)
| | 1440 | 390 | tours only 1440 / 390 |
|---|---|---|---|
| A | 4,770 | 9,095 | 3,244 / 4,568 |
| B | 4,607 | 7,391 | 2,408 / 2,347 |
| C (closed) | 1,087 | 1,425 | 1,117 / 1,548 |
| D | 5,087 | 7,975 | 2,888 / 2,931 |
| E (folded / unfolded) | 5,628 / 6,430 | 8,955 / 10,252 | 3,698 / 4,224 |
A shows 54 of 109 guides at the live cap; B, C, D, E show all.

## Checks
- [V] shoot.mjs (each option alone at 1440 and 390): 0 broken images, no horizontal scroll, 0 blank tiles, tours checkbox leaves 15 (D 19 with the 4 start cards), C map swaps on open, phone index rows 48 px minimum, A text-link tap targets 44 px.
- [V] Map tour mark ink #5A4524 on white 9.1:1 (computed), same style in A, B, C, D (inline after the name); E uses the champagne bar. Credit lines 0.8rem in #46403A (10.2:1).
- [V] Looked at: sheets a-e, first-*-*.png, frame-e-1440/390.png (E below the band).
- [A] I did not open the hub's iframes in a browser, only solo mode. Stills are a centre crop of the tour's first frame: some show the map's own place labels and a tour flag dot.
- Index lists read column-wise already (CSS columns); the review's "zig-zag" was a misread of the sheet.

## Left
- C outlines are not clickable (needs the map projection); no photos in C.
- E: a region with 9 guides leaves one orphan square on the second row at 1440 (8 per row).
- Files: `stills.mjs`, `pick.mjs`, `clip.mjs` (scripts), `data.json`, `measure.json`.
