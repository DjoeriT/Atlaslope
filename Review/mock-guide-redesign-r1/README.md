# Guide redesign, round 1 (21 Oct 2026)

Mock only: no app code, content or data touched. Four designed versions (A-D) of the whole Rioja guide page, map closed, each topped by the big photo button.
Output: `mocks/guide-redesign-r1/index.html` (git-ignored, one page, 6.6 MB, map tiles load live). Build: `python3 -I Review/mock-guide-redesign-r1/build.py` (13 s wall here).
Open an option alone at natural scrolling: `index.html#solo=a` (b, c, d).

## The options
- **A subtle**: today's order. Each beat gets a second column (stop photos, facts), the boxes are gone, type and photos larger.
- **B magazine**: a full-width photo opens each beat, prose in one calm column, facts as a quiet rail, no boxes.
- **C photo-led (recommended)**: photo hero, each beat opens with its stop photo(s), facts as one strip under the beat, How it tastes as a champagne band. The only one with the working unfold.
- **D bold**: black, champagne and white bands, very large photos and type, facts as a few big numbers (restated from the beat text: 100 km, 400 mm, a quarter, 1857 ...).

## The unfold (option C)
Button click: its photo grows from its box to the full screen (WAAPI on the clone, 0.9 s), the v4 map mode shows under it, the photo cross-fades out, the text scrolls to chapter 1 and the map flies to the first stop. "Close the map" folds back to the same paragraph (v4 matching, reused) with a cross-fade. prefers-reduced-motion: no grow, 0.25 s fade, the map jumps. A, B, D: the button takes you to C and presses its button.
Changes to v4's story.js: starts closed, no storage, unfold/fold, message hook.

## Checks
- [V] Build: 13 s. All four options: nine sections present at 1440 and 390, 0 broken images (C shows 1: a lazy image in the hidden map layer), no horizontal scroll at 390.
- [V] Unfold (check-unfold.mjs): start closed; after the click the map is at the valley stop (zoom 8.6); reduced motion: no grow element, same stop. Paragraph "Most of Rioja's soil..." at y 393 with the map open and y 393 after closing, in section c-ground.
- [V] Shots: `shots/opt-<a-d>-<1440|390>-NN.png`, `sheet-<a-d>.png`, `unfold-0/1/2.png`, `fold-back.png` (+ `-phone`).
- [A] D at 1440 measured 15 px of sideways overflow before the last fix (`overflow-x:clip`), not re-shot.
- [A] Phone fold-back landed on a stop card (no text twin), so it uses the view fallback, not a paragraph y.
- [A] Photos are the app's 800 px files: full-bleed at 1440 is soft. Sierra photo appears twice (button and the beat 1 stop).
- [A] The tour's "9 places" and "4 minutes" copy is taken from the live card and v3 button.
