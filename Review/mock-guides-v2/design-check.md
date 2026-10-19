# Design check: Guides mock v2 (ReviewBot, design mode)

Verdict: fix first. High 1, Medium 4, Low 3. Checked at 1320 and 390 wide [V screenshots + computed styles]; phone tile layout only partly viewed [A].

## High
1. Tile text under 1 rem and off the scale. Where: `.gl` tile fact line (`span.lede`, 14.08 px), meta `span` (14.4 px), `em` read time (13.6 px), kicker and credits (12.48 px). Wrong: body text for bulk reading is below 1.0 rem, and 14.08, 14.4 and 13.6 are three sizes that sit between steps. Fix: fact line 1rem (16 px), meta 0.9rem (14.4 px), credits and source tags 0.78rem (12.48 px, already right), kicker 0.72rem. Drop 13.6 and 14.08. Rule: Type scale, "No sizes between the steps"; body = 1.0 [V].

## Medium
2. Kicker repeats the fact below it. Where: typographic tiles (Prado de Irache, El Terrerazo, Los Balagueses): "VINO DE PAGO" in uppercase, then "Vino de Pago · 2-minute read" again. Fix: remove the `.kick` span from `.ct.typo`, keep the level in the meta line. Rule: Type, "never one that repeats the heading or the button".
3. Link and tap targets under 44 px. Where: `.jump a` (25 px tall), `.more a` "All n ... guides" (20 px), source links in the credit line. Fix: `.jump a{display:inline-flex;align-items:center;min-height:44px}` and `.gl .more a{display:inline-flex;align-items:center;min-height:44px}`; credit links are inline text, accept as a note. Rule: Space and shape, targets at least 44 px.
4. Tile rows are ragged. Where: `.gcard-c` rows. Photos keep their own ratio (accepted), but titles sit at different heights and a row has up to 120 px of difference in the text start. Fix (no cropping): `align-items:start` on the grid, and give the title a fixed top margin only; do not stretch the photo. Or sort tiles so similar ratios share a row [A]. Rule: Website pages, "one left edge per page"; photo rule unchanged.
5. Double rule and dead space under the header. Where: the hero's bottom line, then about 60 px of empty space, then the first region's top rule (Green Spain). Two lines and a gap with nothing between. Fix: drop one of the two rules (keep the region rule) and cut the gap to 2rem. Rule: Space and shape, "a 1 px line and 2 rem of space".

## Low
6. Count next to region name ("9 guides", 14.4 px, grey) is fine in tone, but "Green Spain 9 guides" and "All 9 Green Spain guides" repeat the count. Fix: leave the count in the heading, make the link "All Green Spain guides" [A]. Wording is the owner's call.
7. Region jump row on the phone wraps to 4 uneven lines with ragged right edge. Fix: `.jump{gap:0 1.5rem}` with 44 px links (see 3) so rows read as a list.
8. Credit line under each set runs to 2 lines at 1320 with underlined links; contrast is fine (#6F6860 on white, 5.1:1). Fix: none needed; optional `text-decoration-color` lighter. Rule: Photos credits, one visible line per set (met).

## Checked and fine [V]
Black band, champagne line, Guides current and underlined; radii 4.8 and 6.4 px, no pills; no horizontal scroll at 390; photos keep own ratio (`object-fit:contain`); white page; no icons; heading weight 500; one idea per line in the intro.
