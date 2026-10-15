# Data scouting: Spain and Rioja (15 Oct 2026)

Verdict: **go, with one condition.** Every layer the first slice needs has a public source, and the three that matter most (DO boundaries, elevation, base map) are open-licensed. The condition: nothing was downloaded, because this cloud thread's network policy refuses the Spanish government hosts, OpenStreetMap's query API and Wikimedia Commons. The sources were checked by reading their catalogue pages and third-party descriptions, not by opening the files. So every row below is [R] unless marked otherwise, and the first build step is a download-and-inspect pass on a machine that can reach these hosts.

Tags: [V] read directly this session; [R] from a catalogue, article or search result, file not opened; [A] assumption.

## Sources per layer

| Layer | Source | What it is | Licence | Fit | Status |
|---|---|---|---|---|---|
| **DO boundaries, all Spain** | Ministry of Agriculture (MAPA) IDE, "Zonas de Calidad Diferenciada: Vinos" | Official polygons of every wine DOP and IGP, maintained by the ministry; the dataset behind the "official DOP map" updated in 2020 | Spanish public-sector reuse terms (Ley 37/2007); MAPA's IDE downloads are open for reuse with attribution [A: the exact licence text sits on the blocked host] | Exactly what the whole-Spain map needs: one file, one authority, matches the exam's list | [R] catalogue record found, download blocked here |
| DO boundaries, fallback | Regional open-data portals (e.g. Castilla y León's DOP/IGP dataset on datos.gob.es) | Per-region copies of the same thing | CC BY 4.0 typical | Only if the national file disappoints | [R] |
| DO boundaries, rejected | OpenStreetMap | OSM has no boundary relations for Spanish DOs; its `wine:region` tag is for shops and bars | – | Not usable | [V] OSM wiki read |
| DO boundaries, rejected | EU eAmbrosia register | Names, dates and product specs, no geometry | – | Useful for the fact panel (legal names, dates), not for the map | [R] |
| **Elevation, all Spain** | IGN / CNIG Centro de Descargas, MDT25 (25 m) or MDT05 (5 m) | National digital terrain model | **CC BY 4.0** [V on datos.gob.es] | Hillshade and contours for the whole country; 25 m is plenty for Spain, 5 m for the Rioja deep dive | [R] licence verified, files not opened |
| **Climate** | AEMET open data (station normals) | 30-year normals per station; no gridded Köppen product in the open catalogue | "free to use", attribution per file metadata [V on FAQ] | Enough for "Atlantic vs Mediterranean vs continental" shading per DO, derived by us from nearby stations. A ready-made zone map does not exist openly; we draw it ourselves from the normals [A] | [R] |
| **Rioja zones (Alta, Alavesa, Oriental)** | Reglamento DOCa Rioja (Orden APA/3465/2004, BOE) + municipality boundaries from IGN | The three zones are defined as lists of municipalities: 144 in all (118 La Rioja, 18 Álava, 8 Navarra) [V on euskadi.eus] | BOE text is public domain; IGN municipal boundaries CC BY 4.0 | Zones are built by dissolving municipality polygons per list. Clean and authoritative | [R] for La Rioja and Navarra lists (BOE PDF not opened); [V] the 18 Álava municipalities |
| **Rioja soils** | Consejo Regulador descriptions (three types: clay-calcareous, ferrous clay, alluvial) [V]; IGME GEODE 1:50,000 continuous geological map (WMS only) | No open soil-polygon dataset for Rioja vineyards exists. The classic 1972 Ruiz Hernández soil map is a scanned image under unknown copyright. GEODE gives geology, not vineyard soil, and only as a viewable layer under IGME's own reuse terms | IGME: own conditions page [R]; Ruiz Hernández map: unknown, treat as not reusable | The weakest layer. Realistic version one: soil type per zone and per sub-area from the Consejo's published descriptions, drawn by hand as a simplified overlay, clearly labelled "schematic" | [R] |
| **Vineyard parcels (nice to have)** | SIGPAC (La Rioja government download per municipality; Basque and Navarra equivalents) | Agricultural parcel registry with land use codes; vineyard = VI | Regional terms, public-sector reuse [A] | Shows where the vines actually are, which makes the map feel real. Big files. Version two | [R] |
| **Photos** | Wikimedia Commons categories for La Rioja vineyards, Haro, Laguardia, Sierra de Cantabria | Community photos | Mostly CC BY-SA, some public domain; each file carries its own licence | Fine for a free, non-commercial project with attribution. Quality varies; expect to pick 10 good ones from 200 | [R] host blocked here |
| **Base map** | OpenFreeMap (OSM vector tiles) with MapLibre | Free public tile host, no key, no stated limits; attribution added automatically by MapLibre [V] | OSM ODbL + OpenFreeMap credits | Zero cost, zero accounts. Fallback: self-hosted PMTiles on GitHub Pages | [V] |
| **Facts per DO** | Our own text from public sources (BOE regulations, Wikipedia, Consejo sites) | Grapes, climate, sub-zones, dates | Facts are not copyrightable; wording must be ours | WSG's maps and study guide are explicitly not reusable ("should not be reproduced or shared" [V]); we don't touch them | [V] |

Counts to design for [R, aprenderdevino.es, Jan 2025]: 104 DOPs (69 DO, 2 DOCa, 26 Vino de Pago, 7 VC) and 43 IGPs. The quiz should start with the 69 DOs plus the 2 DOCa; Pagos are tiny polygons and VCs are obscure, both later.

## What the syllabus says [V, WSG pages]
The Spanish Wine Scholar is organised by region, not by DO: Green Spain (Galicia, Asturias and Cantabria, País Vasco), Castilla y León, Rioja, Navarra, Aragón, Cataluña, Valencia, Balearics, Murcia, Castilla-La Mancha, Madrid, Extremadura, Andalucía, Canaries. Exam: 100 multiple-choice questions, pass at 75, no tasting. Each region is taught as geography, geology, climate, soils, grapes, law. So the atlas's grouping should follow those regions, and the quiz should ask the kinds of questions the exam does (which region, which climate, which DO is this) rather than pin-drop accuracy.

## Risks found
1. **Network from this thread.** Hosts refused: `www.mapa.gob.es`, `www.mapama.gob.es`, `overpass-api.de`, `commons.wikimedia.org`. This project runs on the built-in cloud environment, which has no settings to change. Options: add a cloud environment under Project settings with those hosts allowed, or do the downloads once on the owner's Mac and commit the processed files to the repo (the files are small once simplified: the DO layer is a few MB as GeoJSON).
2. **Soil is schematic, not measured.** No open vineyard-soil polygons exist for Rioja. Saying "schematic" on the layer is the honest fix; a student needs the pattern (calcareous clay on the Sierra de Cantabria slopes, alluvial along the Ebro, ferrous clay in the middle), not parcel precision.
3. **Licence text for the MAPA file not read.** Everything points to open reuse with attribution, but the actual terms are on the blocked host. Check before publishing, not before building.
4. **DO boundary accuracy.** Official polygons sometimes follow municipality lines rather than vineyard reality (a DO can "cover" a whole municipality with vines in one corner). For a study tool that's fine, and it's what the exam maps show too.

## Proposed first build steps (after the owner's OK on the setup)
1. Download pass (Mac or an allowed environment): MAPA wine DOP/IGP file, IGN municipality boundaries, IGN MDT25 for Spain and MDT05 tiles for Rioja. Inspect, record the licence text per file in `data/SOURCES.md`.
2. Process: simplify the DO polygons for the web (one GeoJSON, under 5 MB), dissolve the Rioja zones from the municipality lists, make a hillshade from the DEM.
3. Mock the atlas screen and the quiz screen as HTML, run the UX check, show the owner.
4. Build: static site, MapLibre, OpenFreeMap tiles, the two GeoJSON layers, the fact panel from a hand-written JSON file.

Effort for the first slice, given this scouting [A]: two to three weeks part-time. The data pass is one or two days, the mocks a day, the map and panel a week, the quiz and progress a week. Soil and photos add a few days each and can trail.
