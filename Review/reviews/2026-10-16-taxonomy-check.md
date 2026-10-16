# Taxonomy check: mock macro-regions against the Spanish Wine Scholar contents

16 Oct 2026, mocks thread. Input for round 2.2, finding 5 of the first-principles review.

## What the course publishes
The public SWS curriculum PDF lists nine regional chapters [V, winescholarguild.com/images/pdf-curriculums/sws_detailed_curriculum.pdf]: Green Spain (Galicia, Cantabrian coast, País Vasco); The Duero River Valley (Castilla y León); La Rioja; The Ebro River Valley (Navarra, Aragón); Cataluña; The Central Mediterranean Coast (Valencia, Murcia); The Meseta (Castilla-La Mancha, Madrid, Extremadura); Andalucía; The Balearic and Canary Islands. The PDF names no individual DOs, so the per-DO list of the 330-page manual stays [R]: the chapters follow autonomous communities, and a DO's community is a public fact.

## What the mocks had (round 2.1)
Seven macro-regions of my own: Green Spain, Ebro Valley (with Rioja), Duero Valley, Mediterranean (Cataluña plus Valencia and Murcia), Central Plateau, Andalusia, Islands. Bierzo sat under Green Spain.

## Verdict and changes for round 2.2
1. Adopt the repo's ten study regions from `data/dop-overrides.json` (the setup thread already mapped every DO to its SWS chapter, issue #1 step one). They match the nine chapters, with the islands split in two so the map legend works. Mock and app then share one taxonomy.
2. Bierzo moves to Castilla y León [V: the Wine Scholar Guild's own Castilla y León wine map page names Ribera del Duero, Rueda, Toro and Bierzo as that region's appellations].
3. Rioja becomes its own region; Cataluña separates from Valencia and Murcia.
4. Pool weights for the quiz: core = every DO and DOCa (68 polygons once Cava, the generic Cataluña DO and the all-islands Islas Canarias VC are left out); secondary = the five Vinos de Calidad with a polygon (Cangas, Lebrija, Sierra de Salamanca, Valles de Benavente, Valtiendas), asked only in a full-Spain custom quiz; ignore = Vinos de Pago (points, not regions, and the layer has 14 of 26). Granada counts as a DO (2018). Default count becomes "DOs you can place: n of 68".
5. Not resolved here, needs the manual or the owner: whether the course treats Cava and the generic Cataluña DO as exam material (both left out of the pool for now), and whether León is named "León" or "Tierra de León" in the current manual (the ministry list says León since 2019 [R, overrides]).
