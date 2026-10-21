# Italy as a next country (issue #149) - AnalystBot, 21 Oct 2026

Tags: [V] verified this session (fetched or computed), [R] report, search summary or memory, [A] assumed. Course structure only; no course text copied.
Not verified: ISTAT, ISPRA, AGEA, Toscana and Veneto licence texts (search summaries only), and whether any non-Piemonte region publishes wine polygons.

## 1. Italy's wine map in brief vs Spain's levels

- Spain in the app: 106 wine PDOs (DOCa, DO, VC, VP) [V, `data/SOURCES.md` places.json row] plus 43 PGIs not in the app. EU register today: Spain 106 PDO + 43 PGI [V, eAmbrosia, computed].
- Italy: 411 wine PDOs + 111 wine PGIs registered [V, eAmbrosia list, 4,021 entries, filtered on productType WINE, status registered, not removed]. That is 3.9x Spain's PDOs. For comparison, same register: France 366 + 74, Portugal 30 + 14, Germany 19 + 27 [V].
- Italian terms: DOCG (about 77-79), DOC (about 330), IGT (about 111-119). The counts differ by source (79/332/111 in one 2026 summary, 77/333/119 from ISMEA) [R: web search summaries, not MASAF itself]. eAmbrosia does not carry the DOCG/DOC split, so MASAF's lists are the only place for it.
- Levels Spain has: country > autonomous region > appellation > zone (decision #6). Italy fits: country > regione (20) > denominazione > zone/sottozone (e.g. Barolo MGA crus, Chianti Classico UGA, Valpolicella Classica). Italian "menzioni geografiche aggiuntive" (MGA, UGA) are an extra, deeper level than Spain's zones; Barolo alone has 181 MGA [R, memory, [A] for the app].
- Overlaps (#42) are heavier in Italy: Chianti Classico inside Toscana IGT, Barolo inside Langhe DOC, Prosecco DOC (9 provinces, 2 regions) over Conegliano-Valdobbiadene DOCG and Asolo DOCG, Soave over Soave Classico. Cross-region appellations (Prosecco, Delle Venezie, Lugana, Valpolicella Garda) break a region parent in the place tree [A].
- Course coverage: the WSET L3 specification lists about 40 Italian names across 14 regions: Alto Adige/Trentino, Friuli (Collio, Colli Orientali, Grave), Veneto (Valpolicella family, Soave, Pinot Grigio delle Venezie), Piemonte (Barolo, Barbaresco, Barbera d'Asti, Dolcetto d'Alba, Gavi), Tuscany (Chianti, Chianti Classico, Bolgheri, Brunello, Vino Nobile), Marche, Umbria, Lazio, Abruzzo, Campania (Taurasi, Fiano, Greco), Puglia, Basilicata, Sicily (Etna). Plus Asti and Prosecco under sparkling [V, read from the spec PDF, names only]. Spain's L3 list is 19 places in `content/curriculum.json` [V]. L2 lists Barolo, Barbaresco, Barbera d'Asti, Chianti, Chianti Classico, Brunello, Valpolicella family, Soave, Asti, Prosecco, Puglia [V, names only]. Several L3 names are umbrella or IGT-like (Toscana, Veneto, Sicilia, Puglia, Terre Siciliane): they would need "no pliego-style polygon" handling, like Spain's Castilla y Leon VdlT, which is listed but has no place [V, SOURCES.md curriculum row].
- Italian Wine Scholar (Wine Scholar Guild): two units, Unit 1 Northern Italy, Unit 2 Central and Southern Italy, each a 100-question exam; separate Italian Wine Essentials with 39 appellations in North/Central/South modules [R, Guild pages via search; no topic syllabus found].

## 2. Source by source

Spain's source from `data/SOURCES.md`. Verdict: same, less, more, missing.

| Need | Spain uses | Italy's equivalent | URL | Format | Licence | Verdict |
|---|---|---|---|---|---|---|
| List of places and legal level | MAPA PDF list of PDOs, 106 | MASAF lists (alphabetical DOP and IGP wine PDFs) and eAmbrosia | MASAF `https://www.masaf.gov.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/4625` [V]; eAmbrosia `https://webgate.ec.europa.eu/eambrosia-api/api/v1/geographical-indications` [V] | PDF lists; JSON | Public registers; facts | Same, 4x bigger |
| Rulebook (pliego) | Region/ministry PDFs, EU single document via Cellar | Disciplinari di produzione: MASAF page says zip archives of about 411 DOP and 111 IGP specifications [V]; Gazzetta Ufficiale publishes each decree; EU single documents through Cellar by CELEX | MASAF (above); Gazzetta `https://www.gazzettaufficiale.it` [R]; Cellar as in Spain | PDF in zip; Gazzetta HTML/PDF | Official legal texts, reusable [R, Italian law: acts of the state are not protected, art. 5 L.633/1941 [A]] | More: one national place, one zip. Italian text, not Spanish |
| Changes trigger | eAmbrosia weekly check (proposed) | Same eAmbrosia entries, Italy included (20 of 522 have amendments in progress today) [V] | as above | JSON | public | Same |
| Boundary polygons | MAPA OGC API Features, one national layer `CDZ_Vinos` (`wmts.mapama.gob.es`) | No national polygon layer found [V by absence in MASAF pages and searches; not exhaustive]. Regional only. Piemonte: "Aree di produzione dei vini DOC e DOCG", 1:10,000, shapefile, CC BY 4.0, revised 2025-10-14 | `https://www.geoportale.piemonte.it/geonetwork/srv/api/records/r_piemon:bb722e24-ed1e-4b00-8fb0-6a205fbbda67`; zip `https://www.datigeo-piem-download.it/direct/Geoportale/RegionePiemonte/AGRICOLTURA/Aree_vini_DOC_DOCG/aree_produzione_vini.zip`; WMS `https://geoservices.csi.it/ms/wms/agrigeo/rp-01/agrigeowms/wms_areevinidowms` [V metadata, zip not opened] | Shapefile, WMS | CC BY 4.0 [V] | LESS nationally, MORE detail where it exists. Bolzano publishes "Zone DOC e IGT" on INSPIRE (record `p_bz:Agriculture:DOCAndIGTZones`) [R, not opened]. Veneto, Toscana: no wine layer found in searches [R] |
| Boundary fallback | `added-municipalities.json` from pliego text + IGN administrative units | Municipality lists in each disciplinare + ISTAT municipal boundaries. Candiago et al. 2022 did exactly this for all Italian PDOs: 408 PDOs, 4,923 municipalities, GeoPackage `EU_PDO.gpkg`, figshare DOI 10.6084/m9.figshare.c.5877659.v1; article CC BY 4.0, dataset licence not read; state of 4 Nov 2021, later amendments missing | ISTAT `https://www.istat.it/it/archivio/222527` (generalised and detailed, shapefile, updated to 1 Jan 2026) [V page, licence text not seen]; Candiago `https://pmc.ncbi.nlm.nih.gov/articles/PMC9276794/` [V] | Shapefile; GeoPackage | ISTAT: CC BY [A, to check]; Candiago: check figshare | Same method as Spain's `added-*`, but it becomes the main route outside Piemonte. Coarse where a pliego names part-municipalities (Chianti Classico, Barolo edges, Etna contrade) |
| Satellite close-up | Esri World Imagery + PNOA (IGN, CC BY 4.0) | Esri only, at first. Option: AGEA orthophotos through the Geoportale Nazionale WMS (2009-2012 series, source must be cited; "public, no access restrictions" in the metadata) | `https://wms.pcn.minambiente.it` [R, metadata via search, endpoint not probed]; Lombardy notes AGEA 2018 is licensed for institutional use, not open [R] | WMS | Unclear for 2018; 2012 citation only | LESS: no clean CC BY national orthophoto; old (2012). Esri terms already checked (SOURCES.md 20 Oct) |
| Terrain / hillshade / slope | IGN MDT25 via WCS; slope tint from Mapzen Terrarium z12 | TINITALY 1.1, INGV, 10 m, whole country. Mapzen Terrarium works anywhere | `https://tinitaly.pi.ingv.it/` [V] | GeoTIFF tiles, UTM 32 | CC BY 4.0 [V] | Same or better (10 m vs 25 m) |
| Geology | IGME MAGNA 50 WMS (licence not stated) | ISPRA CARG 1:50,000 sheets (planned 652 sheets; Sardinia 20 of 58 published in May 2025). Geological map of Italy 1:100,000 as fallback; regional geology (Toscana has a regional geological database) | `https://progetto-carg.isprambiente.it` [R]; ISPRA SGI portal `portalesgi.isprambiente.it` [R] | WMS | Not found; ISPRA says printed maps are for sale [R] | LESS: patchy by sheet, licence unclear. Needs a coverage check per place |
| Climate normals | AEMET (lead, not fetched) and Köppen from Beck et al. | ISPRA 1991-2020 normals from SCIA; regional ARPA networks (fragmented) | `https://www.isprambiente.gov.it/en/publications/state-of-the-environment/temperature-and-precipitation-1991-2020-climatic-normals-over-italy` [V, licence not stated] | PDF tables/maps | Not stated | Similar to Spain (both unfetched). Köppen route unchanged |
| Köppen | Beck et al. 2023, Spain cut | Same dataset, cut to Italy | figshare, as in SOURCES.md | GeoTIFF | CC BY 4.0 | Same. Italy adds Cfa, Cfb, Csa, Csb, Dfb Alpine classes [A] |
| Rivers | IGN INSPIRE Hydrography WFS | Fragmented. National: ISPRA/Geoportale Nazionale hydrography; regional WFS; OSM (ODbL) as fallback | not probed | WFS | varies | LESS clean: no single WFS; OSM would add ODbL attribution |
| Place names | IGN NGBE INSPIRE WFS | IGM gazetteer is not open [A]; ISTAT municipality names; GeoNames or OSM | not probed | - | - | LESS: peaks/ranges need OSM or GeoNames [A] |
| Photos | Wikimedia Commons, per-file licence | Same. Commons counts: Category Vineyards in Piedmont 109 files, in Tuscany 105 files directly (plus subcategories) [V, API]. Spain not measured; Veneto, Sicily queries were rate-limited | `https://commons.wikimedia.org` | webp | per file | Probably same or more (Italy is photographed heavily) [A] |
| Course structure | WSET L2/L3 spec place lists | Same specs; Italian Wine Scholar for structure | WSET spec PDFs as in SOURCES.md [V]; Guild page `https://winescholarguild.com/certifications/scholar-programs/italian-wine-scholar` [R] | PDF | (c) WSET; names only | More names, ~2x Spain's L3 count |
| Producers / grapes | Wikipedia only for gaps | Same; Italian disciplinari have long grape lists with percentages | - | - | - | Same |

## 3. Where Italy gives MORE and where LESS

MORE
- Scale: 411 PDOs. Barolo and Chianti Classico alone have more sub-structure (MGA, UGA, frazioni) than most Spanish DOs.
- One national rulebook bundle (zip of all disciplinari) and a national ministry list, comparable to MAPA.
- Piemonte's official 1:10,000 polygons under CC BY 4.0 [V]: more precise than anything in Spain's municipal approach.
- 10 m national DEM, CC BY 4.0 [V]: better than MDT25.
- An existing research polygon set (Candiago, 408 PDOs) as a first draft for all places [V], with a 2021 vintage.
- More course names (WSET L3 about 40 vs Spain 19).

LESS
- No national polygon layer found. Spain gets all 106 from one OGC endpoint; Italy needs: Piemonte shapefile, other regions case by case, municipalities as default. Expect a "boundary quality" tag per place.
- Regional fragmentation: 20 regions, each its own geoportal, licence and format (Piemonte CC BY, Veneto IODL/CC BY datasets but no wine layer seen, Toscana CC BY typical but no wine layer found) [R].
- No national orthophoto with a clean open licence. Esri only; PNOA has no twin.
- Geology: CARG coverage and licence unclear.
- Names and rivers: no single IGN-like open service.
- Language: the disciplinari are in Italian (Spain: Spanish), some with German (Alto Adige) or Slovene (Friuli Carso) in the legal text. The sentence-cite checker and Opus checkers would be run in Italian [A].
- Pliego text is less uniform: older disciplinari are short; MGA and part-municipality limits are in annexes, sometimes as maps.
- Data weight: 4x polygons. Perf report 4 already says data scales with countries and needs per-country chunks [V, `Review/perf/report-first-principles.md` section 4].

## 4. What the app must change for Italy (high level)

1. Place tree and ids (#6, #41): add `country` (done as a model per scope.md line 15), regioni as the second level, cross-region appellations (Prosecco, Delle Venezie, Lugana) need `parents: []` or a "multi-region" parent. Id slugs: Italian short names.
2. Per-country data chunks, loaded on first use, with a per-country size limit in `check.sh` (perf report). `dops.geojson` 1.6 MB cannot just grow 4x.
3. Boundary pipeline: a new step "polygon source per place" (regional polygon / municipality list + ISTAT / Candiago draft) and a stored quality tag, shown on the guide and measured shares marked as approximate for municipal-only places.
4. Basemap: Esri only (no PNOA); a country config for imagery, DEM (TINITALY or Terrarium), geology (ISPRA where present, else none), bounds and flight start. Map tours already load layers by name, so a missing layer must degrade to "not shown".
5. Measures: `place-measures.json` altitude, slope and Köppen for Italian places from TINITALY and Beck.
6. Curriculum: `curriculum.json` gains an Italy block (WSET L2/L3, Wine Scholar units); the Study filter and badges need a country dimension. Zones/umbrella names rule as in Spain.
7. Guides: sources rule in `docs/guides.md` (Pliego required for Terroir) works unchanged; the pack/extract scripts need Italian text handling (`Tools/guides/extract.py`, pdf layout of Gazzetta/MASAF PDFs). `docs/guides.md` format log entry needed.
8. Copy, vocabulary and glossary: Italian terms (DOCG, DOC, IGT, Consorzio, MGA, UGA, Classico, Superiore, Riserva); one-idea-per-line copy rule applies to Italian names. "Green Spain" stays Spain-only; Home headline and site name are Spain-flavoured [A].
9. Sources file: new `data/SOURCES.md` rows per source; the fetch allow-list (only sources listed) needs MASAF, Piemonte geoportale, ISTAT, INGV, ISPRA first.
10. Photo hard rule: square crops and checked crops apply; Italian credits need the same "Photos: ..." line.
11. Release/CI: UI fixtures per country; test for missing layers.

## 5. Pilot: 2 places (Barolo and Chianti Classico)

Why these two: both are WSET L2 and L3 names [V]; Barolo has an official polygon (Piemonte CC BY, 1:10,000) so tests the best case; Chianti Classico has no regional wine layer found [R], so tests the municipality fallback and part-municipality limits. Together they cover the two boundary routes.

Measured Spain numbers (docs/PROJECT.md "Cost lessons") [V]:
- Ebro: 11 guides, ~10.4M re-read + 0.9M new, ~1.0M per guide all-in. Use ~1.0M per guide.
- Mediterranean 11 guides: 21.2M re-read + 1.0M new (prep agent alone 14.5M over 107 calls; writers ~0.4M per guide; ship 3.2M). Canarias ~1.2M per guide.
- Packs ~25K. Local route target 0.5-0.6M per guide [A until the Meseta pilot measures it].
- Estimate rule: calls x ~100K context + work.

Steps
1. Add Italy sources to `data/SOURCES.md` and the allow-list (1 PR, owner's go first): MASAF lists, eAmbrosia, Piemonte polygon, ISTAT, TINITALY.
2. Script (no agent): download the MASAF disciplinari zip, pick DOCG Barolo and DOCG Chianti Classico, extract text; fetch EU single documents by Cellar. Check the PDFs extract cleanly (one risk).
3. Script: Barolo polygon from the Piemonte zip (open it, check CRS and the DOCG Barolo feature); Chianti Classico from municipality list + ISTAT, with a note on part-municipality limits. Compare both against Candiago polygons as a sanity check.
4. Measure altitude, slope, Köppen share (TINITALY, Terrarium, Beck cut to Italy).
5. Packs (`pack.py`) for both, with Italian text handling.
6. Two headless writer runs (Sonnet), machine check, per-sentence Opus check (stays).
7. UI: add Italy as a second country behind a flag; per-country data chunk; fixtures; one satellite screenshot each; mock for the country switch (owner round) is a separate slice.
8. Handoff, PR, ReviewBot (new copy), measure with `Tools/guides/usage.py --budget`.

Token estimate [A, built from the numbers above]
- Guides: 2 places x ~1.0M (Ebro) = ~2.0M, of which ~1.8M re-read + ~0.2M new. On the 0.5-0.6M local route it would be ~1.1M, not yet proven.
- Italy data and pipeline slice (steps 1-5, 7): about 60 calls x ~100K = ~6.0M re-read + ~0.6M new [A, count: sources PR 6, scripts 20, polygons and measures 15, app country config 15, tests/PR 4].
- Total about 8M re-read + 0.8M new, say 9M. Below the 20M "wait for his word" line. Hard stop at 1.5x = ~13.5M. The pilot proves the polygon route and the pdf extraction before any region (Piemonte alone has 19 DOCG + 41 DOC [R, regione.piemonte.it], so a full Piemonte run is ~60 places).
- Whole-Italy projection at Ebro rate: 411 PDOs x 1.0M = ~411M; so Italy needs a selection rule (WSET L3 names about 40, plus the DOCGs) like the Map tours rule (#148). Selected 40 places at 1.0M = ~40M [A].

## 6. Open questions for the owner

1. Which country first, Italy or Portugal/France/Germany? Recommended: decide after the four reports; for Italy, the main issue is no national polygons. Options: (a) Italy first, (b) Portugal first (30 PDOs, small), (c) France first (366 PDOs, official INAO polygons per the sister report). Recommended (b) or (c) per sister reports; Italy third.
2. Boundary standard for Italy. Options: (A, recommended) official polygon where a region publishes one, otherwise municipalities + ISTAT, with a visible "approximate" tag; (B) municipalities for all, simpler but loses Barolo precision; (C) only places with official polygons, which is just Piemonte (and possibly Bolzano) for now.
3. Scope inside Italy. Options: (A, recommended) WSET L3 names only (about 40 places, ~40M tokens); (B) all DOCG (~79); (C) full 411 (not affordable at ~1.0M each).
4. Imagery. Options: (A, recommended) Esri only, with a "close-up imagery limited" note; (B) add AGEA 2012 WMS (needs licence confirmation and a probe); (C) wait.
5. Geology. Options: (A, recommended) skip geology tiles for Italy in the pilot, add per place where CARG sheet exists and licence is clarified; (B) use ISPRA 1:100,000 national map; (C) ask ISPRA about the licence now (outward contact, needs his go).
6. Language: guides in English with Italian terms (recommended, as for Spain); no Italian UI yet.
7. May I use the Candiago dataset as a draft polygon source? Needs the figshare licence read first (recommended: yes if CC BY, with credit).
8. Allow-list: add MASAF, Piemonte geoportale, ISTAT, INGV, ISPRA hosts to the fetchable sources (needed before any step; recommended yes).

## Sources fetched this session (all read-only)
MASAF `.../IDPagina/395` and `/4625` and `/3342` (oils page, not wine); Regione Veneto DOCG/DOC/IGT page (14 DOCG, 29 DOC, 10 IGT); Piemonte geoportale record; PMC Candiago 2022; TINITALY via search; WSET L2/L3 spec PDFs (names only); eAmbrosia list (one GET, 6.6 MB, kept only in the scratchpad); Wikimedia Commons API (two category counts). Nothing committed, nothing sent.
