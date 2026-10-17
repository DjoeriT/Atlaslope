# Design check: travel-look mocks (travel-v1), 17 Oct 2026

Reviewer: ReviewBot, design mode, fresh eyes. Evidence: the screenshots in /tmp/review-shots-a/ (read), plus grep of the three mock files (alt text, aria-label, focus-visible, reduced-motion). I did not open the mocks in a browser, so hover, focus and keyboard behaviour are inferred from the code, not seen. Contrast figures are estimated by eye from the screenshots, not measured.

## Verdict: FIX FIRST
Counts: 3 blockers, 8 should fix, 6 notes.
The direction works. The cover photos, the serif-on-white page, the single wine-red accent and the sticky "at a glance" box feel much less like a database than today. Every section of the current card is still present on page 2 (level, grapes, other grapes, styles, famous styles, tasting, climate written and measured, altitude, soil, producers, photos, where it sits, zones). The blockers are one broken photo crop, one count that contradicts itself, and highlights that may add facts.

## Blockers

1. **Page 4, 1440 light (also 834): the Navarra tile photo is broken.** The image is letterboxed: a white band above the vines, the image does not fill the rounded frame, and the "DO" badge floats on white. The other five tiles fill their frame. Checklist: visual (photo crop). Fix: every tile image gets `object-fit: cover` in a fixed aspect ratio (4:3). Check the source image for a white or transparent top edge, and crop or swap it.

2. **Page 4, all sizes: the "11 PLACES IN THE COURSE" count contradicts the page.** The page shows six DO tiles, then "Also here: five Vinos de Pago. On the map, not in the quiz." The intro says "six places to learn, and five single estates". So 11 counts places the page itself says are not in the course. Checklist: plain words. Fix: show "6" as the number with "places to learn", and keep the five Pagos as a separate "On the map only" list. "Course" and "quiz" are insider terms; wording is the owner's call.

3. **Page 2, all sizes: the three highlights ("Atlantic meets Mediterranean", "Reds made for ageing", "Terraces up to about 700 m") and the lead paragraph carry no source link.** Rule: every fact keeps a visible source link, and headlines must not add facts. "Terraces up to about 700 m" and "Reds made for ageing" are rewordings of the altitude and crianza/reserva facts, and the reader cannot see which source each rests on. Fix: each highlight gets a small "Source" link to the same source as the section it summarises, or an anchor to that sourced section. Content check for the lead thread: each headline restates one sourced sentence and nothing more. The lead paragraph repeats the first highlight almost word for word (and the map card repeats it a third time); drop one.

## Should fix

4. **Page 2, 1440 and 834, light and dark: photo credit and licence are not visible for the cover and mosaic photos.** The credit is presumably behind "Show all 8 photos", a rare action. On the zone tiles the credit is printed on the photo and is unreadable (about 11 px, low contrast over a mid-tone image). The map card shows a credit pill, so the pattern exists. Fix: credit pill on the cover photo; under each zone tile a caption line in normal text ("Photo: name, licence"), never low-contrast text on the picture.

5. **Page 1, 1440x900 light: "Famous styles" is cut off by the button bar and zones are out of sight.** The heading is the last visible line, its chips clipped, with no scroll cue, so the card looks finished when it is not (no dead ends). At 834 large text, "Zones" has the same problem. Fix: a soft fade at the bottom of the scroll area and a scrollbar or "more below" cue; pad so a heading never sits alone above the bar.

6. **Page 4, 1440: the region hero title is hard to read in places.** The 100 px white title sits over bright red rock with no visible scrim. The breadcrumb "SPAIN > STUDY REGION" (about 11 px white on red rock, about 3:1 or lower) and the credit are worse. The title starts at x=155 while the content below starts at x=143, so the left edges do not line up. Fix: dark bottom-to-top gradient behind the title block, breadcrumb at 12-13 px on the scrim, title aligned to the content column.

7. **Page 4 (and zone tiles on page 2): descriptions are cut mid-sentence with "..."** ("gives...", "only...", "about 460 ..."). The reader gets half a fact, no way to see the rest, no source. Fix: clamp at a sentence end or drop the sentence on the tile and show one fact (altitude or soil) with the tile as one link to the place page. Each page-4 tile also has two actions (open the page, "Show on the map" over the photo): make the open action the whole tile and the map action a small secondary button with a visible focus state.

8. **Page 2, 834 dark: the accent changes to pale pink.** The "Show on the map" button, bars and legend go pink in dark mode, and white text on that pink is about 2.5:1, which fails AA for button text. Fix: keep wine red as the button in dark (a touch brighter is fine) with white text, or use pink with dark text. The two barrel bars (dark and light tint) differ only in lightness; add direct labels on the bars so colour is not the only cue.

9. **Controls that mean nearly the same.** Page 2 has "Map" in the top bar and "Show on the map" in the box. Page 4 has "< Map", the fixed "Show on the map" pill, and per-tile map buttons. Fix: one "Back to map" for leaving, and one "Show on the map" per page (zooms to this place). Remove the floating pill or make it the only one. The fixed round theme toggle also overlaps content on the right edge in the iPad dark shot (over the highlights); move it into the top bar.

10. **Page 2, 1440 light: wide dead gutter.** The text column is about 660 px in a 1440 canvas, and once the top of the page is past, the right side beside The land, Producers and Zones is empty (full-page shot; confirm in a browser that the sticky box stays in view). It looks template-like rather than Airbnb-like. Fix: widen the text column to 760-800 px, keep the box sticky for the whole scroll, or place the section charts in a two-column grid. At 834 the box moves above the highlights and works well.

11. **Page 2: a 3,500 px page with no way to jump.** Airbnb listing pages have a sticky section bar (Tasting, Grapes, Land, Zones, Sources). Without it, finding the soil is a long scroll. Fix: a row of anchor links under the photo mosaic, keyboard reachable, current section marked.

## Notes

12. Page 2, all: source lines are about 11 px, grey, underlined, long ("Pliego de condiciones DOCa Rioja (Consejo Regulador copy, amendments to AM10), p. 10; ..."). Contrast on white looks about 4:1. Fix: 12-13 px, 4.5:1 or better, and one shared "Source:" style so it reads as a pattern.
13. Page 2: the "Styles: Dry and semi-dry whites..." paragraph and "Also allowed: ... and 8 more" sit loose under Grapes. "Styles", "Famous styles" and the box row "Styles" are three near-identical labels. Suggest distinct labels; wording is the owner's, so propose only.
14. Page 2, "Where it sits": level and study region, as a plain two-column table, and it is the page end with no next step. Check "also within" shows for places that have it. Add links back to the region page and to the map.
15. Page 2: altitude chart labels (360 m, 890 m, "vineyards to ~700 m") about 10 px; raise to 12 px. "Famous producers" with one name leaves a lot of white space.
16. Accessibility (grep, read): the map card photo has alt="" and page 2 photos use Commons file titles ("Viñedos AR"), which are filenames, not descriptions. Only 7, 9 and 3 aria-labels across the three files; confirm close, theme, gallery and carousel controls each have one. The map card carousel shows a single 6 px dot and no previous/next buttons, so it is swipe-only and not keyboard reachable. "Show all 8 photos" and the theme toggle look about 40 px high (inferred), under 44 px.
17. Type scale and rhythm: heading sizes jump (card h1 about 36, page h1 about 34, region h1 about 100, section h2 about 22, "11" numeral about 48). Define one scale of about 6 steps and reuse it. Gaps differ between pages (tile grid 24 px, page-2 sections 40-60 px); pick one 8 px-based rhythm.

## What works (keep)
- Map card: photo, kicker, name, one sentence, three fact cells and one large red button; the common case is one click. At 834 with large text it still fits.
- Light and dark invert cleanly; the dark tiles on page 2 look polished.
- Strong photo choice; the region cover beats any list.
- One accent colour (wine red) in light mode; no stray hues.
- `:focus-visible` and `prefers-reduced-motion` are present in all three files (read).

## Not checked
Real keyboard order, hover states, measured contrast values, exact 44 px sizes, the large-text versions of pages 2 and 4 beyond a glance, phone width (not asked).
