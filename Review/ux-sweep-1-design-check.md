# Design check: Atlaslope working preview "mock v1" (17 Oct 2026, ReviewBot design mode)

Verdict: FIX FIRST. Counts: 0 blocker, 5 should fix, 5 nice. The look matches visual-style.md well (wine/gold accent, Newsreader titles,
photo-led cards, "Open the X page" as the one main action). Gaps are in phone landscape, the sheet's keyboard use and a few overlaps.
Checked: ~12 screenshots (desk dark place, phone light place/placepage/region-cyl, phone dark quiz, land place, ipad quiz/regionpage-cyl) and
the code. NOT checked: large text (no 125% shots supplied), the motion itself (stills only), most dark/iPad variants, contrast numbers.

## Should fix
1. **Phone landscape, place card (land-light-place)** [V]. The cover shrinks to a ~50 px strip: the credit pill sits on top of it, is cut off
   at the card edge and overlaps the close button; title and opening line are cropped to two lines; the page's top row is crowded.
   Fix: in `ux.css`, for `(orientation:landscape) and (max-height:30rem)` hide `.card .cover` (or cap at 5rem and drop the credit pill
   there, putting the credit in the page), and give the card `max-height:calc(100% - 5rem)` with the body scrolling.
2. **Sheet handle is not keyboard-operable** [V code, Sheet.tsx onKey]. Only ArrowUp/ArrowDown work. Enter/Space (the normal button keys)
   do nothing, because tap-to-toggle lives in `onPointerUp`. Fix: add an `onClick` for keyboard (detail===0) that cycles the stop, or handle
   Enter/Space in `onKey`. Also give the handle `aria-expanded` (stop !== 'peek') so screen readers know it changes.
3. **Peek stop hides content but keeps it focusable** [A, Sheet/ux.css `[data-stop=peek] ... overflow:hidden`]. Tab can land on links
   that are out of sight. Fix: set `inert` on `.scroll` when stop is peek (or `visibility:hidden` on it).
4. **Phone, region card with several photos (phone-light-region-cyl)** [V]. The previous/next arrows (about 88 px, round) sit 13 px under
   the close button and nearly touch it; the dots (about 6 px) sit left of the credit pill. A mis-tap on the arrow can hit Close. Fix: on
   `.sheet.phone .cover` move the arrows to the lower third (`top:auto; bottom:2.5rem`) or shrink to 44 px and add 8 px gap below `.close`.
5. **Phone quiz, dark (phone-dark-quiz)** [V]. A leftover dark bar shows under the layers button, half hidden by the sheet edge: the map
   buttons stack ends below the `--sheet-h` offset (the fit button is cut). Likely the quiz sheet is taller than `--sheet-h`, or a mid-transition
   frame. Fix: confirm after the transition settles; if real, set `--sheet-h` from the sheet's measured `offsetHeight` (ResizeObserver) not heightOf(stop).

## Nice
6. **Phone, imagery note (all phone shots)** [V]. The note takes four lines and sits over the map right above the sheet, touching the button
   column. Test artefact in part, but the real "map unavailable" state would look the same: cap it at two lines on phones (`font-size:.9rem`,
   shorter copy is the owner's call) so it does not cover regions.
7. **iPad quiz (ipad-light-quiz)** [V]. Search box placeholder clips ("Search places ar") beside the Explore/Quiz tabs. Fix: on iPad portrait
   use the phone's icon-only width, or placeholder "Search" below 52 rem.
8. **Phone place page (phone-light-placepage)** [V]. Subtitle breaks "4-" / "minute read" in the link; use `white-space:nowrap` on the link or a
   non-breaking hyphen. Page tabs clip "Famous style" at the right edge: fine as a scroll hint, but add a fade or `scroll-snap` so it reads as scrollable.
   Phone page bar has no search (hidden) and no app name: acceptable, but check it is hidden with `display:none`, not only visually.
9. **iPad region page (ipad-dark-regionpage-cyl)** [V]. The "13 PLACES TO LEARN" stat is right-aligned with a wrapping two-line label that floats
   away from the intro sentence. Fix: put number and label on one baseline (`white-space:nowrap`) or align it left under the sentence.
10. **Credit pills on covers** [V]. On the phone card the credit is a pill on the photo (allowed by the style sheet) but is not a link there
    while the page's "Photos:" line is; fine. Check the pill text keeps 4.5:1 on bright skies (land-light-place: white on semi-dark, looks ok).

## Held up well [V]
Welcome/quiz card stays one-primary-button ("Learn 5 new places" wine/gold, "Practise any mix" secondary). Close button on the region card is
present (X at 44+ px). Page bar is the same on place and region pages (logo, search, Back to map). Dark mode uses gold on #121212 as specified.
Reduced-motion is honoured in ux.css. Sheet has an aria-label for the stop. "Escape" and the end-round confirm were not seen (code only, not tested).
