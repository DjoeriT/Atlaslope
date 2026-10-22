# Guide redesign, round 2 (22 Oct 2026)

Mock only: no app code, content or data touched. Three versions of round 1's option C for the whole Rioja guide page, map closed.
Output: `mocks/guide-redesign-r2/index.html` (git-ignored, one page, 15 MB, map tiles load live). Build: `python3 -I Review/mock-guide-redesign-r2/build.py` (14 s wall here).
Open one option alone: `index.html#solo=c1` (c2, c3). Hub: sticky switch, Desktop | Phone per option.
Round 1 (A, B, D dropped) stays untouched in `Review/mock-guide-redesign-r1/`.

## Shared by all three
- Hero: title and lede on the left, the "Read with the map" card on the right (under the title on a phone). `hero.css`, `mapcard()` in build.py.
- The card is one real button: the photo plus a solid champagne bar with the folded-map glyph, "Read with the map", "4 minutes · 9 places to fly to" and a black arrow square. Hover and keyboard focus invert the bar to black with a champagne arrow; cursor pointer; the whole photo is clickable. 6px corners.
- The button does the full unfold in all three (photo grows to full screen, cross-fades into the v4 map mode, flies to the first stop). "Close the map" folds back to the same paragraph. Reduced motion: fade and jump. Engine: `story.js`, unchanged from r1.
- Photos: the app's 800 px files, never wider than 33rem (528 px), so about 1.5x on a 2x screen. No full-bleed photos. One credit line per set.

## The options
- **C1 C, refined**: round 1's C with the card hero and photos capped. Beats open with their stop photo(s), caption beside a single photo; facts strip in a box; How it tastes band.
- **C2 C, calmer**: one smaller photo (28rem) opens every beat, the same size each time; prose in one column; facts strip without a box, hairlines between beats; quieter type. The sierra photo moves into the place facts strip.
- **C3 C + A blend (recommended)**: A's page (prose left, photos and facts in a second column, no boxes, hairlines) with C's hero card, the stop photos and the champagne How it tastes band.

## Checks
- [V] Build 14 s. `measure.mjs`: every `<img>` outside the map, naturalWidth / CSS width, 3 options x 1440 and 390: minimum 1.52 at 1440 (widest 528 px), 2.23 at 390; none below 1.45; all 800 px natural.
- [V] `shoot.mjs` (41 s): nine sections present, 0 broken images, no horizontal scroll, all six option/width combinations. Contact sheets `shots/sheet-c1..c3.png`.
- [V] `check-unfold.mjs` (2.5 min), 1440: unfold works, map at first stop (z 8.6); fold-back returns the same paragraph at the same height in all three (y 393 before and after, section c-ground). Reduced motion: map opens with no grow, in all three.
- [V] 390: unfold works (z 8.6) and "Close the map" folds back in all three. The probe picked a stop card, which the closed page has no copy of, so the same-paragraph match returned null; the fold lands in the same chapter [A]. Same as round 1.
- [V] Button close-ups `shots/button-c*-1440.png`, `-390.png`, hover `-1440-hover.png`. Unfold frames `unfold-c*-0/1/2.png` (phone: `-phone`).
- [A] The unfold timing and the cross-fade were checked in stills, not as video. Map imagery needs the network (the browser loads tiles).

## Left
- C1 two-photo rows leave air on the right of the page at 1440; C2 prose column leaves air on the right. Both are by design (smaller photos), the owner may prefer C3 for that reason.
- Jump bar starts at the page edge, not the text edge (as in round 1).
