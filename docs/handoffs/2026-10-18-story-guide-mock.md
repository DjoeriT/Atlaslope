# Story guide mock (18 Oct 2026)

Thread "Story guide mock". Follows owner card 06:18Z ("Both, polish first"): after the polish pack (release 18), mock the story guide.

## Done
- `Review/mock-story-guide-v1/`: the Rioja guide as a story. Text left, sticky map right (map on top on iPad and phone);
  the map flies to each "on the map" point already in `content/guides/rioja.json` as you scroll. Normal scrolling, no scroll-jacking,
  jumps instead of flights under reduced motion, dims everything outside the place in focus, tilts into 3D for the Sierra de Cantabria,
  the Alavesa terraces and Haro. Generator `build.py` (+ `story.css`, `story.js`); README says what is mock-only.
- Design check (ReviewBot, design mode): `Review/story-guide-mock-design-check.md`. Both must-fixes (map dropped steps while tiles loaded;
  chapter links landed under the phone map) and the should-fixes fixed: per-step map buttons removed (one map control, "Back to the story view"),
  no blank step gaps, shorter phone map on short screens, type on the scale, labels in sentence case, zone labels as pills,
  keyboard map control off, skip link, aria-current on the active step.

## Decided
- Owner looked on his Mac (07:36Z, "Really cool"). Two fixes after: short sections hold their map view longer (PR #75),
  and the ending keeps the Haro view instead of pulling back out before Haro landed.
- Owner card 07:20Z: the story opens from a "Read with the map" button in the Terroir section; the section keeps its text.

## Open
- Text on the page that is not guide text (owner to confirm): map chips "Rioja in northern Spain", "Rioja's three zones", "Rioja";
  the end prompt "Can you place the three zones?"; Haro and Alfaro labels at approximate town coordinates [A].
- Rivers (Ebro) and villages are not drawn: no sourced layer in `data/` yet.
- Building it: a plan with Context, Upside, Risks, Effort when he asks. It would reuse the app's map (`src/map/`) and guide data unchanged.

## Where
Mock `Review/mock-story-guide-v1/index.html` (also `/mnt/project-files/atlaslope/mocks/story-guide-v1/`); first-look screenshots there too.
