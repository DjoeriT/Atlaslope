# Data sources

One entry per file in `data/`. `Tools/check.sh` fails if a committed data file has no entry here. Raw downloads live in `data/raw/` (git-ignored).

| File | Source and URL | Fetched | Licence | Processing |
|---|---|---|---|---|
| `dops.geojson` (1.6 MB) | MAPA, "Zonas de Calidad Diferenciada: Vinos", collection `alimentacion:CDZ_Vinos` on MAPA's OGC API Features service: `https://wmts.mapama.gob.es/sig-api/ogc/features/v1/collections/alimentacion:CDZ_Vinos/items?f=application%2Fgeo%2Bjson&limit=1000`. This service is listed in the dataset's official metadata record (uuid `17b70eca-5002-48c0-9552-c74dfc870360`). The shapefile on the download page (`descargafichero.aspx?f=calidaddiferenciada_vinos.zip`) sits behind a reCAPTCHA, so it was not used. | 2026-10-15 | MAPA. See "Licence texts" below: the download page and the metadata record say different things. Attribution: «© Ministerio de Agricultura, Pesca y Alimentación (MAPA)» | 96 features, EPSG:4326. Dissolved by `cal_ds_codigo`, which gives 90 DOPs (ogr2ogr, SQLite `ST_Union`). Simplified with `-simplify 0.0005` (about 50 m, topology-preserving per feature), 5-decimal coordinates, RFC 7946. All 90 geometries are valid. Fields: `code` (MAPA code, e.g. DO23), `name` (prefix removed), `kind` (DO / DOCa / DOP / VP / VC), `type` and `label` (MAPA's own text). |
| `dop-overrides.json` (8 KB) | Hand-written from: the ministry's list of indications with authorised varieties (`https://servicio.mapa.gob.es/en/dam/jcr:0249fe88-d47a-45eb-b3ac-9e902068ce39/top_vitis.pdf`, dated 9 Jul 2026, cites RD 683/2025; read, gives today's names [V]); categories and years from aprenderdevino.es (counts as of Jan 2025: 69 DO, 2 DOCa, 26 VP, 7 VC), the Court of Master Sommeliers 2024 list, and Wikipedia pages for Vino de Pago, Granada and Islas Canarias [R]; study regions from the Spanish Wine Scholar region list [R]. | 2026-10-16 | Facts, not copyrightable; wording ours | Per-code name, kind and region fixes applied by `src/dops.ts`; `missing` lists DOPs with no polygon in the 2014 layer. Years for Rosalejo, Tharsys and Río Negro are [A] (they appear in the 2026 ministry list but not in the Jan 2025 count). |
| `rioja-zones.geojson` (50 KB) | Zone lists: Pliego de condiciones DOCa Rioja, section 4 (MAPA PDF, `https://www.mapa.gob.es/es/alimentacion/temas/calidad-diferenciada/pliegodecondicionesdocarioja_tcm30-552276.pdf`, PDF dated 2025-10-31). The lists match Orden APA/3465/2004, art. 4.2 (BOE 259, 27 Oct 2004, `https://www.boe.es/boe/dias/2004/10/27/pdfs/A35560-35568.pdf`) name for name; the 2004 text calls Rioja Oriental "Rioja Baja". Polygons: IGN, "AU Unidades administrativas", OGC API `https://api-features.ign.es/collections/administrativeunit/items` (all 8,294 units, paged). | 2026-10-15 | Lists: official texts (BOE content is free to reuse; the pliego is a public specification). Polygons: IGN, CC BY 4.0 (see below). Attribution: «CC-BY 4.0 ign.es» | Each listed name was matched to an IGN municipality, some by hand: see `rioja-municipalities.json`. El Ternero is the 2.34 km² exclave of Miranda de Ebro (Burgos) that contains IGN's "Ternero" settlement point (-2.93667, 42.60293); only that part is used. Lodosa is left out (the pliego keeps only vineyards registered before 1991). Dissolved per zone with SQLite `ST_Union`, simplified `-simplify 0.0002` (about 20 m), WGS84, RFC 7946. Result: Rioja Alta 76 municipalities plus El Ternero, Rioja Oriental 49, Rioja Alavesa 15. Total area 3,583 km², against 3,682 km² for MAPA's own DOCa Rioja polygon (2.7% less). |
| `rioja-municipalities.json` (15 KB) | As for `rioja-zones.geojson` | 2026-10-15 | As above | One row per listed name: the name as listed, the INE code, the IGN name and a note where they differ. 144 listed names (77 Alta including El Ternero, 50 Oriental, 18 Alavesa) give 140 municipalities: Molinos de Ocón and Ocón (La Villa) are both in Ocón; Barriobusto, Labraza and Oyón are all in Oyón-Oion; Salinillas de Buradón is in Labastida. Santa Engracia del Jubera is listed as "zona Norte" only, but the whole municipality polygon is used. |
| `rioja-hillshade.tif` (6.7 MB) | IGN MDT25 (25 m digital terrain model) via IGN's WCS `https://servicios.idee.es/wcs-inspire/mdt`, coverage `Elevacion25830_25`. 35 tiles of 20 km covering ETRS89 UTM 30N x 485000–615000, y 4640000–4735000. | 2026-10-15 | IGN / CNIG, CC BY 4.0 (WCS capabilities: "CC BY 4.0 scne.es"). Attribution: «MDT25 CC-BY 4.0 scne.es»; product date per the scne.es product table [A: not looked up] | Tiles mosaicked (`gdalbuildvrt`), then `gdaldem hillshade -multidirectional -z 1.5 -compute_edges`. Warped to EPSG:3857 at 50 m with `-r average`, cropped to lon -3.17 to -1.64, lat 41.90 to 42.76, saved as a Byte GeoTIFF (DEFLATE, nodata 0). Elevation in the source box: 238 to 2,269 m. |

## Licence texts (quoted; fetched 2026-10-15)

**MAPA, download page** `https://www.mapa.gob.es/es/cartografia-y-sig/ide/descargas/alimentacion/vinos`, "Condiciones":
> Esta información se puede usar de modo libre y gratuito siempre que se utilicen con fines divulgativos, informativos o de promoción de productos agroalimentarios, que no tengan como finalidad la promoción comercial/venta de alimentos y que no incluya información que vincule el consumo de los alimentos con la salud. Será necesario que se mencione al Ministerio de Agricultura, Pesca y Alimentación (MAPA) como autor y propietario de la información de la siguiente manera: «© Ministerio de Agricultura, Pesca y Alimentación (MAPA)».

The same page gives "Escala: 1:25.000" and "Actualización: marzo de 2014".

**MAPA, ISO metadata record** (`https://www.mapama.gob.es/ide/metadatos/srv/api/records/17b70eca-5002-48c0-9552-c74dfc870360/formatters/xml`), constraints: "CC BY 4.0", "Nombrar a la fuente: Ministerio de Agricultura, Pesca y Alimentación", "Sin limitaciones al acceso público". Creation date 2014-03-01.

The two MAPA texts disagree. Paraje is a free study tool, which fits both. We follow the stricter page conditions: no commercial food promotion, no health claims, and the © MAPA line shown with the map.

**IGN / CNIG**, `https://www.ign.es/resources/licencia/Condiciones_licenciaUso_IGN.pdf` (linked as `license` from the IGN OGC API): "el uso de los productos y servicios de información geográfica del IGN ... conlleva la aceptación por el usuario de una licencia CC-BY 4.0", with attribution in the form «<identificador del producto> <fecha> CC-BY 4.0 <atribución de productores>», shown "a pie de mapa". The municipality metadata record (`spaignLLM`) says "BDLJE CC-BY 4.0 ign.es".

## Raw downloads (not committed, in `data/raw/`)
- `mapa/cdz_vinos.geojson` (16.7 MB): the MAPA layer as served.
- `ign/au_administrativeunit.geojson` (261 MB): all IGN administrative units for Spain.
- `dem/mdt25_rioja/` (35 tiles, 43 MB): MDT25 over the Rioja box.
- `dem/mdt05_rioja/`: MDT05 (5 m, `Elevacion25830_5`) over the same box in 10 km tiles.
- `dem/mdt200_spain/` (4 tiles): 200 m DEM for mainland Spain and the Balearics (`Elevacion25830_200`, x -80000–1140000, y 3980000–4870000). The full-resolution MDT25 for all of mainland Spain was not fetched: it would be several GB, and 200 m is enough for a national hillshade.
- `boe/`: the 2004 Orden PDF and the current pliego PDF.

Leads not yet fetched: wine IGPs (not in MAPA's layer); AEMET station normals; Wikimedia Commons photos (per-file licence).

## Mock-only layers (`public/mocks/atlas-v2/assets/data.js`, not under `data/`)
The round 2.1 atlas mock bundles its own geography so it runs without a build. None of it is used by the app.

| Layer | Source and URL | Fetched | Licence |
|---|---|---|---|
| Countries, provinces, rivers, lakes, towns (clipped to lon -10.5 to 5, lat 34.5 to 45) | Natural Earth 10 m, `https://github.com/nvkelso/natural-earth-vector` (GeoJSON) | 2026-10-15 | Public domain |
| DO polygons and Rioja zones | This repo's `dops.geojson` and `rioja-zones.geojson` (entries above), renamed for display (e.g. "Vino de Rioja" to "Rioja"); Cava, Cataluña, Islas Canarias and Vinos de Pago left out | 2026-10-15 | As above |
| Rioja soil areas | Hand-drawn schematic, labelled as such in the mock | 2026-10-15 | Ours |
| Elevation profile sample (240 points, Sierra de Cantabria to Sierra de la Demanda) | Same Mapzen Terrarium tiles, zoom 12, sampled 2026-10-16 by the mocks thread | 2026-10-16 | As terrain below |
| 3D terrain (streamed at view time) | Mapzen Terrarium tiles on AWS Open Data, `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png` | at view time | Mapzen terms; SRTM, NED, EU-DEM and others, attribution in the map |
| Satellite (streamed at view time) | Esri World Imagery, `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer` | at view time | Esri terms of use, attribution in the map; mock use only, to be replaced before release [O] |
| Typefaces | Newsreader and IBM Plex Sans via `@fontsource` | 2026-10-15 | SIL Open Font Licence 1.1 |
| MapLibre GL JS 4.7.1 | `https://www.npmjs.com/package/maplibre-gl` | 2026-10-15 | BSD-3-Clause |
