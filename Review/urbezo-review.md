# Review: claude/data-step-8glnhu (Urbezo as core quiz place)

Verdict: MERGE. Blockers 0, should fix 0, notes 4.

Checked by reading the diff and a short python3 -I script over the built files (no vitest; CI runs it).

- Parcel list [V]: data/added-parcels.json (51 numbers) equals pliego lines 172-182 when parsed by script; polygon 35, Cariñena, 232.0214 ha as stated.
- Boundary [V]: added-boundaries.geojson urbezo: MultiPolygon, 51 parcels, 2.3187 km2 (231.87 ha, 0.07% under the pliego, simplify 0.0005 and filled holes explain it). bbox lon -1.2548..-1.2289, lat 41.398..41.414; centroid (-1.2461, 41.4067). Cariñena town is about (-1.22, 41.34) [R, my own knowledge], so the place is about 7 km N and 2 km W of the town: plausible for polígono 35 bounded north by Alfamén.
- build_parcels.py [R]: refcat = 5-digit Catastro code + "A" + 3-digit polygon + 5-digit parcel = 14 chars, correct for rustic parcels. posList in EPSG:25830 is easting, northing, read as x y: correct (projected CRS, not lat/lon). Fails loudly on a missing parcel. Rings become separate polygons (holes filled, documented). remote_build.sh: ogr2ogr runs the SQL on the 25830 source, then reprojects, so km2 is really in m2/1e6: correct.
- Not verified [A]: live Catastro responses (needs network). The committed output is the evidence it ran.
- places.json [V]: urbezo quiz core, boundary added, centroid set, 70 core. 13 VP remain to-fetch.
- Tests [R]: places.test.ts (70 core, urbezo core, 13 to-fetch all VP, added = 3 ids) and data-layers.test.ts (id set, parcel count, area within 2%) can fail on regression.
- SOURCES.md rows [R]: accurate (origin, CC BY 4.0 for the Catastro, steps, counts).
- cut_extracts date 2024-10-25 [V]: matches the pliego header (DOUE L 25.10.2024).

Notes
1. Area test tolerance 2% is wide; the real gap is 0.07%. Fine, but 1% would still pass.
2. build_parcels.py does not itself compare against expected_ha; only the unit test does, after the fact.
3. Sector letter "A" is hard-coded in the refcat; fine for polígono 35, would need a parameter for other places.
4. Parcel geometry holes are filled (documented), so area is slightly overstated.
