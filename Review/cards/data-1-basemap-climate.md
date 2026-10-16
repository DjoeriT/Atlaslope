# Card data-1: atlas base and climate layer (data step, issue #10)

    Goal:        The atlas has its own base (land, sea edge, borders) and the climate layer has its data, both committed with their paper trail.
    Task:        Fetch Natural Earth and the Köppen-Geiger map, clip them to Spain (mainland, Balearics, Canaries), simplify, commit two GeoJSON files.
    Role/model:  BuilderBot (Sonnet)
    Budget:      150k tokens; stop and report at ~70% or after two failed tries
    Branch:      agent/builder/data-1 (worktree; LeadBot merges it into claude/data-step-8glnhu)
    Context:     data/SOURCES.md (the table format and the "Licence texts" section, read only those); Tools/check.sh "Data ledger" step
    May edit:    data/natural-earth-spain.geojson, data/koppen-spain.geojson, Tools/data/build_basemap.py, Tools/data/build_koppen.py,
                 tests/unit/basemap.test.ts, data/SOURCES.md (two new rows and their licence text only)
    Must not:    any other file; src/; data/places.json; never open data/*.geojson or *.tif with Read (scripts print summaries instead)
    Tests:       tests/unit/basemap.test.ts; `npx vitest run tests/unit/basemap.test.ts` and `Tools/check.sh quick` green
    Done when:   see "Steps"
    Report:      Review/cards/data-1-report.md; opens with done / partly done / blocked; tags [V]/[R]/[A]
    Stop and ask if: a source is unreachable, a licence is not open (public domain or CC BY), or a file would exceed its size cap

## Steps
1. **Natural Earth, 10 m** (public domain; host naciscdn.org answers from this container). Download `ne_10m_land`, `ne_10m_admin_0_boundary_lines_land`
   and `ne_10m_minor_islands` into `data/raw/` (git-ignored). Clip to two boxes: mainland and Balearics lon -10.0 to 5.0, lat 35.0 to 44.5 (keeps
   Portugal, southern France and the Moroccan coast for context); Canaries lon -18.4 to -13.2, lat 27.5 to 29.5. Write one FeatureCollection,
   `data/natural-earth-spain.geojson`, each feature with `layer` = `land` or `border` and `box` = `main` or `canarias`. 5-decimal coordinates,
   simplify about 100 m, RFC 7946, valid geometries. Cap 400 KB raw.
2. **Köppen-Geiger** (Beck et al. 2023, Scientific Data, "High-resolution (1 km) Köppen-Geiger maps for 1901–2099", figshare article 21789074,
   CC BY 4.0; check the licence on the article page and quote it). Take the 1991–2020 map at 1 km. Clip to the same two boxes and to Spain's land
   (mask with the Natural Earth land of step 1, Spain only via `ne_10m_admin_0_countries` ADM0_A3 = ESP). Polygonise per class, dissolve, drop
   pieces under 1 km², simplify about 500 m. Each feature: `code` (e.g. `Csa`), `name` (the paper's legend wording), `box`. Write
   `data/koppen-spain.geojson`. Cap 1.2 MB raw.
3. **Paper trail and tests.** One `data/SOURCES.md` row per file (source URL, fetched date, licence, processing steps as run) and the CC BY credit line
   for Köppen ("Beck et al. 2023, CC BY 4.0"). `tests/unit/basemap.test.ts`: both files parse; every feature has the fields above; both boxes are
   present; Köppen holds at least the classes Csa, Csb, BSk and Cfb; file sizes under the caps. Commit after each step.

## Notes
- Tools: no GDAL here. `python3 -m pip install shapely pyshp rasterio numpy` (rasterio wheels bundle GDAL). Install once.
- Downloads and extracted archives: each in its own new empty folder under `data/raw/`; scripts live in `Tools/data/`; run Python with `-I`.
- The build scripts must be rerunnable from a clean checkout (download if `data/raw/` lacks the file).
