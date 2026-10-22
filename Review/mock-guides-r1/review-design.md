# Design review, Guides mock r1 (read from the sheets only, no Playwright)
Verdict: ready after fixes. Blockers 0, should fix 6, notes 4.

## Q1 busy/full vs dull list
- A: halves the page but stays 10 identical photo grids (54 of 109 guides). Still busy by repetition. Not dull.
- B: calm; risk of dull. One photo per region is arbitrary ("first guide with a photo"), Meseta is a 25-row wall.
- C: calmest (997 px) but no photos: breaks "prefer visuals". Dull on the list side.
- D: calm, 4 photos then a plain list. Photos only in the top 4, so below that it is B without the picture.
## Q2 visuals, calm: D, then A. (B is the fallback if D's list feels bare.)
## Fixes, ranked
1. A: blank cream squares (Prado de Irache, El Terreranzo, Los Balagueses, Dominio de Valdepusa and more) read as broken images. Hide the tile or pick guides that have a photo. [should fix]
2. C: left column empty under the map on desktop (map ends ~600 px, list runs on). Make the map sticky. Map is not clickable; map labels are tiny. [should fix]
3. C and all phone: "9 guides · 7 with a map tour" wraps to two lines at 390; shorten to "9 · 7 tours" or drop on phone. [should fix]
4. D: the region chip row sits below the Start here cards, away from the hero. It also repeats the page headings; consider dropping it (index is one scroll) or moving above. Phone: 2x2 start cards are small; make them full-width or a 2-col with larger type. [should fix]
5. Map-tour mark: small champagne-brown text "Map tour", right-aligned far from the name, weak contrast at small size (check 4.5:1 for WCAG 2.2 AA) and easy to miss in a two-column list. Put it directly after the name or in darker ink. [should fix]
6. Phone row height in B/D: name plus a second line "DO · 3 min" gives ~32 px rows, tap target under 44 px (A: 24 px min target ok but tight). Raise row padding to 44 px; keep one line (name left, kind right) if it fits. [should fix]
7. B: choose the region photo by hand (best of region), not first with photo; phone 72 px square is fine. [note]
8. Credit line: single line at page end in all options; it is tiny grey, keep but raise size/contrast; A's is the longest block (about 12 lines on phone). [note]
9. Desktop two-column index: zig-zag reading order (row-wise) mixes two lists; column-wise order is easier to scan. [note]
10. Hierarchy: region count "9 guides" is faint next to the region name; fine, but kind label (DO / Vino de Pago) repeated on every row is noise; consider showing only non-DO. [note]
## Pick: D. Real photos where it counts, calm index, one credit line, closest to the owner's two rules. Add A's photo-per-row idea only if the owner wants more pictures.
Not checked: live hub frames, keyboard focus, large text, reduced motion.
