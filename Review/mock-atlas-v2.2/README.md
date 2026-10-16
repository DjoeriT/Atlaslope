# Atlaslope mock-ups, round 2.2 (16 Oct 2026)

Open `index.html` and click through. Same stack as 2.1 (MapLibre, bundled type and geography; satellite and 3D terrain stream from the internet).

## New in 2.2, per the boundary decision: three screens only
- `03c-quiz-fact.html` Region, climate or soil. The map shows the place (others dimmed), the student answers the fact. After the answer: a short feedback line, three fact rows, "Open Rías Baixas" (comes back to the quiz) and "Next question". Reached from "What is this?" in the quiz chain.
- `05-lesson-rioja.html` Rioja lesson. Seven stops flown through in 3D, one structured card each (zone, altitude, soil, climate, grapes, why it matters), numbered markers that jump to a stop, arrow keys work. Ends in "Now find them": a recap list and a hand-off to the find-it quiz on Rioja.
- `06-explore-profile.html` Elevation profile. A line from the Sierra de Cantabria over the Ebro to the Sierra de la Demanda with the real ground under it (Mapzen terrain tiles sampled at 30 m, 53 km, 408 to 1,636 m). Zone bands, hover crosshair with a dot on the map, "Draw a new line" from the live terrain (3D relief on), "Back to the example line".
- Both are linked from the Rioja Explore card.

## Changed everywhere
- Study regions follow the course: ten regions from the repo's `data/dop-overrides.json` (Green Spain, Castilla y León, Rioja, Navarra and Aragón, Cataluña, Valencia and Murcia, Meseta, Andalucía, Balearic Islands, Canary Islands). Bierzo is now under Castilla y León. Legend, quiz areas and kickers updated. Check: `/mnt/project-files/atlaslope/reviews/2026-10-16-taxonomy-check.md`.
- Quiz pool: 68 core DOs and DOCas, five Vinos de Calidad only in an All of Spain quiz, Vinos de Pago not asked.
- Zone and DO fills fade when zoomed in, so the terrain shows at lesson zoom. Reduced-motion setting stops the fly-throughs.

## After the fresh-eyes review (fixed before you saw it)
Ways in from the Rioja card; quiz chain 03b to 03c to results; wrong answer marks the progress dot red; "Open Rías Baixas" always offered and returns to the quiz; the highlighted DO is the only one not dimmed; lesson recap list replaces the promise about quiz memory; stop markers sit above their labels; "why" row has a label for screen readers; profile panel taller on iPad, 44 px draw button, lowest and highest points labelled on a drawn line, hint about 3D relief shown before you click, hover readout announced, tap works on touch.

## Still schematic or open
- Lesson numbers (altitudes, dates) are the author's and need a source check against `data/SOURCES.md` material before build [A].
- Hand-off from the lesson: the find-it quiz is mocked for DOs; asking "tap where Haro is" is the same tap mechanic on places and needs a yes from the owner.
- Drawing a line is by map tap only; a keyboard route comes with the build.
- The ten-region palette is muted on purpose; regions are told apart by boundaries and labels, not colour alone.
- Rioja soil areas, photos, scores: placeholders as in 2.1.

## In the repo
Committed 16 Oct 2026 at the restart as the visual reference (approved mock; wordmark renamed to Atlaslope). `assets/data.js` (3.5 MB) and `assets/maplibre-gl.*` are not committed: to run a page, copy them from `/mnt/project-files/atlaslope/mocks/atlas-v2.2/assets/` (or `~/Developer/Atlaslope/mocks/atlas-v2.2/assets/` on the Mac) into `assets/`, then open the HTML in Chrome.
