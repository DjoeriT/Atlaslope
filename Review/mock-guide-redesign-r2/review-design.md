# Design review, guide redesign r2 (C1, C2, C3), 22 Oct 2026

Verdict: ready after one fix pass. Blockers 0, should fix 4, notes 4. Read from shots (3 sheets, button shots, 7 singles); nothing re-shot, mock not opened live.

## Should fix
1. C1, C2 (1440), "empty right side" (owner's round-1 complaint): C1 section 1 puts two 528 px photos left and leaves ~200 px empty on the right (opt-c1-1440-01); C2 section 1 prose sits in a ~700 px column with the whole right half of the viewport blank (opt-c2-1440-02). Smaller photos do bring the white space back. Fix: drop C1 and C2 as final; if kept, centre the content block or fill the right column as C3 does. [V]
2. C3 (1440), uneven columns: left prose column ends well before the right chart/photo column, leaving a blank left block of ~250-420 px (opt-c3-1440-02 after the Climate chart; opt-c3-1440-04 under "On the map" next to the Altitude chart). Same effect on the left of the Level row (opt-c2-1440-02 pattern). Fix: top-align and accept, or let the chart/facts flow under the prose when the prose is shorter (single column below the photo). [V]
3. C3 (1440), mixed widths: photo column is 528 px in a ~604 px column (right edge ragged against the 1360 px text edge, opt-c3-1440-04), while the 3-province row is full width at 403 px each (opt-c3-1440-03). Fix: let the single photo fill its column (cap at the column, not 33rem) so right edges align; check natural/rendered stays above 1.45 (604 px of 800 gives 1.32: use 33rem on the image only if it left-aligns with the chart edge, otherwise keep and accept). [A]
4. All, button at 390: clickable read is good (solid champagne bar, glyph, black arrow square, shot button-c3-390), but the bar is the only cue: the photo above carries no hint and the card sits under the lede on the phone, near the fold (sheet phone row 1: card is below title, above lede, fine). No fault found; remaining risk is the hover state that does not exist on touch. Fix: none needed unless the owner wants a visible pressed state; add `:active` darken so the touch tap shows. [A]

## Notes
5. All: jump bar starts at the page edge (x 24), not the text edge (x 80), while text and cards align at 80. Fix: align to the text edge. Known from r1. [V]
6. All (1440 hero): the card has a drop shadow and the page has no other boxes. It reads as the one clickable thing, which is right; keep. [V]
7. C3 (1440): the Level row (label left, value, MAPA link) sits in a half-empty row between the "On the map" links and the Sierra photo (opt-c3-1440-01/c2-02). Fix: put Level into the hero meta line or the facts strip. [V]
8. C3 section 3 photo is a saturated blue sky (opt-c3-1440-03 and 04 region): next to the muted others it is the loudest element. Fix: swap or crop for more vine, less sky (crop is the owner's check). [V]

## Questions asked
- Does shrinking the photos bring back white space? Yes in C1 and C2 (finding 1); C3 avoids it by using the second column. [V]
- Button obvious at 390? Yes: solid bar, glyph, arrow square, full-width card. [V]
- Is C3 sound against the owner's words? Yes: "C" hero card and map tour plus A's calm; photos capped at 528 px (ratio 1.52 min) answers "blurry"; second column fills the width. Fix findings 2 and 3 first. Not checked: unfold animation (stills only), blur judged from measured ratios not at 100% view. [V/A]
