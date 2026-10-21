# Portugal as the next country (issue #149): first principles
AnalystBot, 21 Oct 2026. Tags: [V] fetched or read this run, [R] from a repo document, [A] assumed.
Short answer: Portugal is a smaller, easier wine map than Spain (44 EU wine names against 149), but its public geodata for wine areas is thinner. Rules and grape lists are as good (same EU register). Imagery is as good or better. The Douro adds a vineyard-level classification Spain has no match for. Recommended: pilot Douro and Vinho Verde, about 8M tokens, after one country-model slice.

## 1. Portugal's wine map in brief
- EU register today [V, eAmbrosia list API, 4,021 entries, wine and status "registered"]: Portugal 44 (30 PDO, 14 PGI). Spain 149 (106 PDO, 43 PGI). France 443. Italy 531.
- 30 PDO (called DOP; older term DOC; includes Port, Madeira and Madeirense, Setubal, Carcavelos, Colares, Bucelas): Alenquer, Alentejo, Arruda, Bairrada, Beira Interior, Biscoitos, Bucelas, Carcavelos, Colares, DoTejo, Douro, Dao, Encostas d'Aire, Graciosa, Lafoes, Lagoa, Lagos, Madeira, Madeirense, Palmela, Pico, Portimao, Porto, Setubal, Tavira, Torres Vedras, Tras-os-Montes, Tavora-Varosa, Vinho Verde, Obidos.
- 14 PGI (Vinho Regional / IG): Alentejano, Algarve, Acores, Beira Atlantico, Duriense, Lisboa, Minho, Peninsula de Setubal, Tejo, Terras Madeirenses, Terras da Beira, Terras de Cister, Terras do Dao, Transmontano.
- Levels versus Spain [R: our place tree is country > region > appellation > zone]: Portugal has no autonomous-community layer that matters for wine; the "regions" are the wine regions (CVRs, the regional commissions). PDO and PGI overlap heavily and geographically (Douro DOP lies inside Duriense IGP; Dao DOP inside Terras do Dao). Spain has Pago, DOCa, VP and VT tiers we model; Portugal has none of those tiers (Port and Douro are two separate DOPs on the same land; Madeira, Madeirense and Terras Madeirenses on one island).
- Sub-regions are not separate EU entries. They sit inside the specification text of the parent: Douro (Baixo Corgo, Cima Corgo, Douro Superior), Vinho Verde (nine sub-regions), Alentejo (eight sub-regions), Lisboa and Tejo areas [A from general knowledge; confirm in each caderno during the pilot]. So sub-regions = our "zone" level, as Rioja's Alta/Alavesa/Oriental are today [R].
- Fits our model: yes, as the "one place tree" says (#6). The only mismatch is Port/Madeira: a product DOP drawn on the same ground as a region DOP. Spain has Jerez/Manzanilla overlap, so the overlap rule (#42) probably covers it [A].
- Mainland plus two island groups (Madeira, Acores). Islands use separate CAOP and orthophoto sets [V: CAOP2025 has Continente, RAA, RAM datasets on dados.gov.pt]; the DGT orthophoto service covers mainland only [V].

## 2. Source by source
Spain column from `data/SOURCES.md` [R].

| Need | Spain uses | Portugal equivalent | URL | Format / licence | Verdict |
|---|---|---|---|---|---|
| Place list and levels | MAPA "Listado de denominaciones", plus eAmbrosia | IVV list of DOP/IGP and eAmbrosia | eAmbrosia: https://webgate.ec.europa.eu/eambrosia-api/api/v1/geographical-indications ; IVV: https://www.ivv.gov.pt (the page I guessed, /np4/vinhos_dop_igp/, gave 404; two searches found no direct IVV list page) | eAmbrosia JSON [V], EU data, free. IVV page not found [V] | Same, if we use eAmbrosia (44 names, ids PDO-PT-A15xx). IVV: unverified |
| Rules per place (specs) | MAPA pliegos (PDF) and OJ single documents | Caderno de especificacoes via eAmbrosia attachments and OJ; Port and Douro also at IVDP | eAmbrosia attachments `.../api/v1/attachments/<id>` (Port: id 11232 in a search hit); IVDP Port spec: https://www.ivdp.pt/media/pnwe55km/pdo-pt-a1540-porto.pdf ; Vinho Verde has an OJ notice 2024: http://data.europa.eu/eli/reg_impl/2024/2583/oj | PDF. EU Commission reuse terms; IVDP PDF reuse terms not stated [A: official texts, quote briefly] | Same (and the register calls them all the same way). Language: see section 3 |
| Appellation boundaries | MAPA OGC API Features, `CDZ_Vinos` (GeoJSON, 1.6 MB) | No wine-area polygon file found. eAmbrosia has no geometry. Areas are municipality/freguesia lists in the caderno | Searched dados.gov.pt, found none [V]. A 2012 OSM thread says IVV has no georeferenced maps [V, old] | - | LESS (missing). Build from CAOP freguesias plus the caderno list, as we already do for Rioja zones and `added-municipalities.json` |
| Admin boundaries | IGN "AU Unidades administrativas" (OGC API) | DGT CAOP2025: municipios, freguesias, distritos, NUTS | https://ogcapi.dgterritorio.gov.pt/collections/municipios ; https://ogcapi.dgterritorio.gov.pt/collections/freguesias ; dataset listing https://dados.gov.pt/en/datasets/?q=CAOP | OGC API Features (GeoJSON). DGT page says CC BY 4.0 [V]; the dados.gov.pt listing shows no licence and one old third-party catalogue said CC BY-NC [V, conflicting] | Same. Confirm CC BY on the CAOP page before use |
| Close-in imagery | PNOA (IGN), free WMTS, CC BY 4.0 [R] | DGT OrtoSat 30 cm 2023 (true colour and false colour); older 25 cm 2018 and 50 cm series | https://ogcapi.dgterritorio.gov.pt/ (collections `ortos-rgb`, `ortos2018-rgb`); manual https://dgterritorio.github.io/ogcapi-user/ | OGC API (Maps/Tiles); CC BY 4.0 [V for licence on https://www.dgterritorio.gov.pt/dados-abertos]. My tile call timed out once at the end [V], so uptime and tile speed are not measured | Same or MORE (30 cm is finer than PNOA's 25 to 50 cm in places). Mainland only; no SLA known; test speed |
| Terrain (hillshade, slope) | IGN MDT25 via WCS | Copernicus DEM GLO-30 (30 m, global). DGT/SNIG national DEM and LiDAR not confirmed | https://registry.opendata.aws/copernicus-dem/ ; licence https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/DEM/resources/license/License-COPDEM-30.pdf | GeoTIFF; free with credit [V]. One source notes a small set of withheld tiles for some countries, check Portugal is not among them | LESS (30 m vs 25 m) or SAME. Fine for relief shading; slope numbers a bit coarser. Same method works for any country |
| Geology | IGME MAGNA 50 | LNEG Carta Geologica de Portugal, 1:50 000 and 1:200 000 harmonised | https://geoportal.lneg.pt/en/ ; viewer: geoportal.lneg.pt/mapa/?mapa=INSPIRE_CGP50k&lang=en | Download, WMS and licence not stated on the page [V]. LNEG has an OGC API platform [V] | LESS until a licence is confirmed. The 1:500 000 asked for was not found; 1:200 000 exists |
| Climate | Beck et al. 2023 Koppen (1 km, global) | Same file covers Portugal. IPMA normals for local numbers | Beck et al. is already in `data/SOURCES.md`; IPMA https://www.ipma.pt [A, not fetched] | Existing file is CC BY 4.0 [R] | Same |
| Rivers | IGN/other [R, not checked] | APA (Agencia Portuguesa do Ambiente) via SNIG, or Natural Earth for big rivers | Not fetched | [A] | Unknown, small. Natural Earth is enough for a first pass |
| Land cover / vineyards | none | DGT COS 2018 to 2025 (land cover, has a vineyard class) and Cadastro Predial | https://ogcapi.dgterritorio.gov.pt/collections/cos2023v1 | OGC API, CC BY 4.0 [V] | MORE (Spain: SIGPAC/CORINE, not used by us) |
| Vineyard classes, Douro | none | IVDP: vineyard parcel classification A to F, set by a points method (Portaria 413/2001), with "beneficio" (the yearly Port quota) | https://areareservada.ivdp.pt/pt/docs/legislacao/111.pdf ; vintage notice https://www.ivdp.pt/pt/docs_juridico/CV%202004_IVDP.pdf ; explainer https://eco.sapo.pt/descodificador/afinal-o-que-e-o-beneficio-do-douro-vinhateiro-e-porque-gera-controversia-no-setor/ | Law texts, public. Parcel-level data is held in an IVDP vineyard system [V, search]; no open parcel download found | MORE in the story (a method we can explain); LESS in data (no open parcel layer found). I did not find the points table or the A-F cut-offs [V] |
| Photos | Wikimedia Commons per file | Same | Commons categories, direct counts only [V]: Vinho Verde 17 files, 5 subcats; Alentejo 98 files, 31 subcats; Vineyards in Portugal 103 files, 9 subcats; Alto Douro 23 files, 1 subcat; Wine regions of Portugal 0 files, 10 subcats | CC BY / CC BY-SA mix, per file, as for Spain | SAME in principle; Douro coverage must be checked in its subcategories. Not compared with Spain's counts |
| Course filter | WSET L2/L3 specs, Wine Scholar Spain [R] | WSET L3 spec names Portugal: Vinho Verde, Douro, Dao, Bairrada, Alentejo, Lisboa, Alentejano; Port (fortified); grapes Alvarinho, Loureiro, Arinto, Touriga Nacional, Tinta Roriz, Alfrocheiro, Jaen, Baga, Trincadeira, Alicante Bouschet; Port grapes Touriga Franca, Tinta Roriz, Touriga Nacional, Tinto Cao, Tinta Barroca; optional tasting red: Douro, Dao or Alentejo | https://www.wsetglobal.com/media/11731/wset_l3wines_specification_en_highres_may2022_issue2.pdf [V, read with pdftotext]. L2 spec: https://www.wsetglobal.com/media/19132/wset_l2wines_specification_en_april2026_issue21.pdf [not read] | Names only (structure, not text) | LESS than Spain for WSET depth (about 7 places). Madeira not seen in my grep of L3; check L2 in the pilot. Wine Scholar Guild: no Portugal programme, only France, Italy, Spain (and Germany) [V search, 2026 partner page]. So no WSG filter for Portugal |

## 3. Where Portugal gives MORE and LESS than Spain
MORE
- Small number of places (44 against 149): a full country could be reached in about 12 to 15 guides [A].
- Imagery: 30 cm OrtoSat, free, CC BY, from an OGC API [V]. Esri fallback not needed for the mainland if tiles prove fast.
- Land cover (COS) and cadastre as open OGC layers [V]: new map layers we have not had.
- Douro story: vineyard classification A to F, the benefit quota, Port as a controlled-output system. Strong content for "why it tastes the way it does". IVDP publishes regulations and yearly notices [V].
- One strong regulator per big place (IVDP for Port and Douro, also IVBAM for Madeira [A, not fetched]) keeps source lists short.
LESS
- Wine-area boundary files: none found. Each place needs its municipality or freguesia list read from the caderno (same method as Rioja zones; costs per place).
- Language: IVV/IVDP texts are Portuguese. eAmbrosia holds the PT-language caderno; English summaries exist only as the EU "single document" and OJ notices where an EU language version was published (Port's single document includes English names [V]). I did not verify English text for Douro or Vinho Verde. Plan on reading Portuguese; our writer agents can do that, but checkers (and the owner) cannot spot-check as easily. Owner reads English and Dutch [R].
- Courses: WSET depth is small; no Wine Scholar Portugal.
- Geology: licence unclear; scale coarser than IGME's 1:50 000 for some areas.
- DEM: 30 m global against Spain's 25 m national.
- Source breadth for sub-regions: they live inside specs and CVR sites (not separate register entries).
- Portal fragility: dados.gov.pt listing pages show no licence per dataset and my OrtoSat tile call timed out once [V].

## 4. What the app must change for a second country
Rests on `Review/perf/report-first-principles.md` section 4 [R]: data scales with countries, so load per-country chunks on first use, with a per-country size limit in `check.sh`, plus a light country index for the world view. PNOA is Spain-only, so each country needs its imagery rule; terrain and imagery cost does not grow with country count.
- Data model: country on every place; ids stay stable (#41). Do a design pass on whether `PDO-PT-A1539` style register ids can serve as the stable key (Spain already uses `PDO-ES-...` in fetched file names [R]).
- Data paths: `data/<country>/...` (`places`, `dops`, `koppen`, added municipalities, measures); today files are flat and Spain-named (`dops.geojson`, `spain-mask.json`, `natural-earth-spain.geojson`, `koppen-spain.geojson`) [V, `ls data`].
- Course model: `content/curriculum.json` has `wset` and presumably a `wsg` block [R, partial]; add country-keyed place lists and let a place have no WSG entry. Study filters must handle "WSET only".
- Imagery fallback: per-country base config: Spain PNOA, Portugal OrtoSat (mainland), islands and others Esri. The 128/512 px tile rule is per country.
- Terrain: use Copernicus GLO-30 where no national DEM is chosen; the relief tile builder must not assume IGN WCS.
- Place pages and URLs: country segment, or `/pt/douro` [A, owner decision]. Search: add country, accent-insensitive Portuguese names (Dao = Dão).
- Home page and Guides page: headline "Spain's wine places" copy becomes a country choice; Guides page cards stay square crops; add country switch or a second section. Copy for owner.
- Map tours: tours are per place; the Portugal pilot gets none at first.
- Mask, bounds and world base: Spain mask and bounds hard-coded [R, `spain-mask.json`]; add Portugal mask (Natural Earth) and per-country initial bounds. Islands are separate boxes.
- Pipeline: `Tools/guides/` assumes MAPA/IGN/pliego (Spanish) sources; add a Portugal source adapter (eAmbrosia caderno, CAOP list, IVDP). Writer brief in Portuguese source reading, English output.
- Docs: `docs/guides.md` format log, `data/SOURCES.md`, `docs/scope.md` line 15, positioning text. Photos: `photos.json` per country.

## 5. Rough plan: pilot Douro and Vinho Verde
Measured Spain numbers [R, docs/PROJECT.md "Cost lessons"]: ~1.0M tokens per guide all-in (Ebro, 11 guides: ~10.4M re-read + 0.9M new); Canarias ~1.2M per guide; Cataluña ~3.1M per place all-in at the time (since improved); writers ~0.4M per guide; packs ~25K. Estimate rule: calls x ~100K + work.
Steps
1. Country-model slice (small to medium): country field, paths, curriculum keys, imagery per country, Portugal mask, no content. About 40 calls x ~100K = 4.0M re-read + 0.4M new.
2. Source pack for 2 places (one prep per place, capped calls): eAmbrosia caderno, CAOP freguesia lists, IVDP texts, Commons photos. About 2 x 0.3M = 0.6M, plus Portuguese-reading overhead.
3. Write and check 2 guides (Douro is larger: sub-regions, Port, A to F). 2 x 1.2M = 2.4M.
4. Build, local screenshots, review of the new country pieces: 15 calls x 100K = 1.5M.
5. Ship and handoff: ~1.0M (Mediterranean ship step was 3.2M, so keep the PR small).
Total pilot: about 9.5M, of which ~8.5M re-read and ~1.0M new [A, from the Spain per-guide numbers; Portuguese sources add maybe 20 percent]. Below the 20M "wait for his word" line, but the model slice (step 1) is the main risk: Spain's overruns were 3 to 5 times when steps were left out (e.g. 5.8M against 1 to 1.5M for a 45-call fix) [R]. Hard stop at 1.5x = about 14M.
Then, full Portugal: about 12 more guides x ~1.0M = 12M, but only after the pilot gives a measured per-guide number.
Pilot choice: Douro (big, has Port and the A-F method, WSET named) and Vinho Verde (Atlantic, WSET named, different terroir, and its spec was amended in 2024 [V OJ]). Both are in the WSET L3 list.

## 6. Open questions for the owner
1. Portugal or France next? Options: A) Portugal (recommended: small, imagery good, 44 names, both WSET-heavy places in the Douro and Vinho Verde); B) France (443 names, huge, WSG France programme exists, much more work, courses much richer); C) Do neither until the Spain tours are done.
2. Course filters for Portugal? A) WSET only (recommended; WSG has no Portugal); B) also invent a "Portugal" tag with no course. Recommended A.
3. Boundaries: A) build zones from CAOP freguesia lists read out of each caderno (recommended, same as Rioja); B) ask IVV or IVDP for official polygons (slow, unsure); C) show simple shapes without borders.
4. Imagery: A) DGT OrtoSat 30 cm, with Esri fallback (recommended after a speed test); B) Esri only.
5. Language of source reading: A) writers read Portuguese, output English, with a source-quote note per fact (recommended); B) wait for English summaries only (too thin).
6. URL and home page: A) country in the path (`/pt/...`) and a country choice on the home page (recommended); B) one flat list, country as a filter.
7. Port and Madeira: A) treat each as its own place with overlap rule to Douro and Madeirense (recommended); B) merge into region pages.
8. Islands (Madeira, Acores): A) after the mainland (recommended); B) in the pilot.
9. Go on pilot scope above (about 9.5M tokens, 8.5M re-read, 1.0M new)? A) yes, start with the country-model slice; B) smaller: only the country-model slice first.

## Method and limits
Fetched: eAmbrosia list API once (6.6 MB, counts by country, no keys); DGT dados-abertos page; DGT OGC API collections list (once; a later tile call timed out); dados.gov.pt CAOP search; LNEG home and geoportal pages; WSET L3 spec PDF (pdftotext, Portugal lines only); Commons API category counts (direct file counts, not recursive). Searches (web) for IVV, IVDP, WSG, Copernicus DEM. Not verified: IVV list URL, IPMA, APA, IVBAM, the L2 spec's Portugal content, geology licence, Copernicus tile gaps for Portugal, Douro sub-region names in the caderno, English availability of Douro and Vinho Verde specs, ortho tile speed. Search summaries are second-hand [R-level] unless a primary page was fetched. Nothing else in the repo was edited.
