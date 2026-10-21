# Official map layers for the Rioja and Priorat story mock (2026-10-21)

Script: `Review/mock-story-guide-v3/fetch_layers.py` (python3, stdlib only; `python3 -I fetch_layers.py [rivers|names|all]`).
Output (git-ignored): `/Users/djoeri/Developer/Atlaslope/mocks/story-layers/`. Raw pages: `/Users/djoeri/Developer/Atlaslope/.cache/layers/` (re-runs reuse them).
Bboxes (lon/lat): rioja -3.15,42.05,-1.65,42.70; priorat 0.65,41.05,1.00,41.35. ogr2ogr not needed: the GML is parsed directly.
Not fetched, by instruction: SIGPAC, SIOSE, AEMET, soils.

## 1. Rivers [V]
- Endpoint: `https://servicios.idee.es/wfs-inspire/hidrografia`, WFS 2.0.0 GetFeature `typeNames=hy-p:Watercourse`, `bbox=<lat,lon,lat,lon>,urn:ogc:def:crs:EPSG::4326`, `count=500` paged by `startIndex` (falls back to 50; 502s retried 4 times with back-off; the first probe did hit a 502).
- Only segments with `hy-p:geographicalName//gn:text` kept; merged by name into one MultiLineString; Douglas-Peucker 0.0002 deg (~20 m); property `name`.
- Licence and attribution [A, as given on the card, not re-read from the service]: CC BY 4.0 scne.es. Attribution string: "Hidrografía: © Instituto Geográfico Nacional / CNIG, CC BY 4.0 scne.es".
- rivers-rioja.geojson: 17,621 segments, 1,778 named, 1,208,129 bytes (large because of many arroyos; filter by name in the mock, e.g. only "Río ...", if too heavy). Contains Río Ebro, Río Oja o Glera, Río Tirón, Río Najerilla, Río Iregua, Río Leza.
- rivers-priorat.geojson: 1,888 segments, 284 named, 191,901 bytes. Contains Riu de Siurana, Riu de Montsant, "L'Ebre/Río Ebro".
- Names are in the publisher's form (prefix "Río", "Riu", "Arroyo"); the Oja is "Río Oja o Glera".

## 2. Names [V]
- Endpoint: `https://www.ign.es/wfs-inspire/ngbe`, WFS 2.0.0 `typeNames=gn:NamedPlace`, `outputFormat=application/geo+json`, same bbox form, `count=2000` paged. GetCapabilities checked first (one feature type, CRS 4258 and 4326 offered).
- Kept local types: Montaña (peak), Alineación montañosa (range), Depresión (valley), Capital de municipio and Núcleos de población (town). Properties: name, type, local_type. The first listed name is used (can be Basque or Catalan); ranges named in the guides are forced in.
- Cap 60 per guide: 20 towns (those named in the guides first, then an even spread), 15 ranges, 20 peaks (even spread), 5 valleys.
- **No elevation field** in the INSPIRE NamedPlace output [V]: peaks carry no height, and they are spread out, not the highest. The "valley" class is mostly barrancos and clots, weak: drop it from the mock if it looks poor.
- names-rioja.geojson: 1,485 candidates, 60 kept, ~10 KB. names-priorat.geojson: 224 candidates, 60 kept, ~10 KB.
- Licence [A]: IGN CC BY 4.0 scne.es; attribution "Nomenclátor Geográfico Básico de España © Instituto Geográfico Nacional, CC BY 4.0 scne.es".

## 3. Geology: WMS only, works [V]
- Service: IGME "Mapa Geológico de España a escala 1:50.000 (MAGNA)", `https://mapas.igme.es/gis/services/Cartografia_Geologica/IGME_MAGNA_50/MapServer/WMSServer`. Layers: 0 Litologías color, 1 Litologías tramas, 2 Contactos y fallas, 3 Estructuras de plegamiento, and others. No WFS tried.
- MapLibre raster tile template (use `tileSize: 512`, `minzoom: 10`):
  `https://mapas.igme.es/gis/services/Cartografia_Geologica/IGME_MAGNA_50/MapServer/WMSServer?service=WMS&version=1.3.0&request=GetMap&layers=0&styles=&format=image/png&transparent=true&crs=EPSG:3857&width=512&height=512&bbox={bbox-epsg-3857}`
- **Scale limit [V]:** blank (white, 1-4 KB PNG) when coarser than about 70 m/px. The Priorat bbox at 768 px and a 40 km Rioja window at 768 px render (60 KB and 66 KB). A 39 km, 512 px tile renders (42 KB). A 78 km / 512 px tile, a 39 km / 256 px tile and the whole Rioja bbox at 768 px are blank. One image of the whole Rioja bbox would need about 2,500 px width [A, not tested].
- The Priorat render shows sheet seams at the top edge and a large grey area [V, viewed]. I did not check what the grey means (no data or a lithology class): check it against the legend before showing.
- Licence: the capabilities carry no licence. Only AccessConstraints: "No está permitido implementar un servicio de valor añadido no gratuito sin establecer contacto con el IGME" (no paid value-added service without contacting IGME) [V]. Fees empty. Attribution to show: "Fuente: IGME, Mapa Geológico de España 1:50.000 (MAGNA)" [A, no stated string]. A free mock fits that constraint; a paid product needs contact with IGME. Open question for the owner.
