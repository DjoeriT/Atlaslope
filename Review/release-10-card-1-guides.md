# Release 10, card 1: terroir section, fly-there, Test me (issue #14)

Builder: Sonnet. Budget 200k. Work in your own worktree on top of this branch; commit, never push.

## Read only
- This card, `Review/release-10-plan.md`, the mock HTML with images stripped:
  `sed -E 's/data:[^"'"'"')]{200,}/DATA/g' Review/mock-guides-v1/1-place-guide.html | grep -n -A90 'id="why"'` (and the `flycap` part of `2-fly-there.html`; the CSS is in `build_guide_mock.py` there).
- `src/pages/PlacePage.tsx`, `src/styles/pages.css`, `src/url.ts`, `src/app/App.tsx`, `src/map/` focus and framing code, `src/quiz-ui/QuizScreen.tsx` (`startReview`), `src/facts/index.ts` (how content JSON and cites load), `src/strings.ts`.
- Never open `data.js`, `maplibre-gl.js`, `data/*.geojson` or `*.tif`.

## Content (written, do not edit the text)
`content/guides/<id>.json` for `rioja`, `rioja-alta`, `rioja-alavesa`, `rioja-oriental`: `title`, `minutes`, `lede {text, cite}`,
`chapters[] {id, title, paras[], cite[], fly[]?, cards[]?}`; a card is `{title, climate, wine, fly}`; a fly target is
`{label, caption, cite, place}` (frame that place's boundary) or `{label, caption, cite, point [lng,lat], zoom}`. Cite keys use the
same `source:pN` form as the fact sheets and resolve through `content/sources.json`.

## Build
1. **Terroir section** on the place page, only when a guide exists for that place: after Overview, jump-bar label "Terroir",
   kicker "Terroir · N-minute read", h2 = guide title, lede in the `.read` style, chapters as h3 + sans paragraphs, the Rioja zone
   cards as three columns (one column under 1100 px), a source line per chapter (reuse `SourceLine`), fly pills as in the mock
   (pin icon, small "On the map", the label; aria-label "Show <label> on the map"; 44 px). In the title row's sub line add a link
   "terroir, N-minute read" to the section. Add guide JSON loading next to the facts loader, with a unit test that every cite key resolves
   and every `place` id exists in the tree.
2. **Fly-there**: a pill closes the page and moves the map (place: frame its boundary like "Show on the map"; point: fly to it at
   `zoom`, keep the current pitch). In place of the map card show the caption card from mock 2: kicker "From the <place> guide",
   h1 label, caption, source line, primary "Back to the guide", and a close button "Close and stay on the map" (it shows that place's
   card). Point targets get the pin with its label. "Back to the guide" reopens the page scrolled to the chapter the pill was in. Escape = close.
   The URL carries it, e.g. `#place=rioja&fly=valley.1` (chapter id and pill index), so it survives a reload.
3. **Test me** box at the end of the terroir section, and on every quizzed place page without a guide as the last thing in the
   main column before "Where it sits": "Test me on <name>" + "A short round on <name> and its zones: where they sit and what they
   are known for." (drop "and its zones" when there are none) + outline accent button "Test me". It starts a Review round of 10 on
   that place plus its quizzed zones via the existing `startReview` (add a route such as `#quiz=test&set=id,id` that starts it at once).
   Plus the region page plural fix: "1 place to learn" when the count is 1 (`strings.ts` `placesToLearn`).

## Done when
- `Tools/check.sh ui` green. New UI tests: Rioja page shows the section and 7 pills; each pill lands on its target (assert the caption
  text and the URL); Back returns to the chapter; Test me on Rioja starts a round whose places are only Rioja and its zones; a place with
  no zones and no guide shows Test me without "and its zones"; the region page says "1 place to learn" for a one-place region.
- Contrast unit test still passes for any new token pair. Download stays under the 2 MB check.
- Report in 300 words: what you built, files touched, tests, anything you could not do, tokens used.
