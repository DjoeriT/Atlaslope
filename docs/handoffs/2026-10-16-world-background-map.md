# Handoff: world background map (2026-10-16)

**Done.** The atlas land, country borders and sea tint now cover the whole world instead of two boxes round Spain (PR #26).
`data/natural-earth-world.geojson` (Natural Earth 50 m outside the boxes, the 10 m Spain file inside, one merged land feature) is built by
`Tools/data/build_world.py` (shapely; reaches raw.githubusercontent.com from the cloud container). The app loads it in `src/map/createMap.ts`;
`oceanFromLand` cuts the land out of one world rectangle. Gzipped download 1.07 MB to 1.32 MB. ReviewBot: merge, 0 blockers
(`Review/world-map-review.md`); its suggested lake-island test was added.

**Decided.** Canaries shown in their real place on the world map, no inset (coordinator's default; the Spain overview is unchanged).
`data/natural-earth-spain.geojson` stays as the build input, no longer loaded by the app.

**Open.** Live only after the owner's next "publish release N". Not checked on screen: the antimeridian (±180°), far from Spain.
Screenshots before and after (public Esri endpoint swapped in locally): `/mnt/project-files/atlaslope/world-map/`.
