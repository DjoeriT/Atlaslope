# France as a next country (issue #149)

AnalystBot, 21 Oct 2026. Tags: [V] verified today, [R] read in a search result or in the repo, [A] assumed. About 12 tool calls; ~45K tokens (mostly new, small re-read).

## Short answer
France has MORE official data than Spain where it matters most (parcel-level boundaries, free national imagery with one licence, one geology map set).
France has MUCH MORE structure to model: ~386 wine AOPs, nested (Bourgogne > Côte de Nuits > Gevrey-Chambertin > Premier Cru climat), plus Bordeaux classifications that are not boundaries at all.
Recommendation: pilot France with 2 places before deciding; Portugal remains the cheaper first country if the owner wants scale control.

## 1. France's wine map vs Spain's levels
- Spain in the app: DOCa/DO/VP/VC/DOP polygons (about 100 [R, brief]) from MAPA, with zones inside (Rioja Alta/Alavesa/Oriental).
- France, from broad to narrow [R, WSET L3 spec table, lines 289-324 and 591-596]:
  1. Vin de France (no origin). 2. IGP (about 75 [R, secondary, winewithseth.com]; e.g. Pays d'Oc). 3. Regional AOP (Bourgogne, Bordeaux). 4. Sub-regional (Côte de Nuits-Villages, Médoc, Haut-Médoc). 5. Village AOP (Pauillac, Gevrey-Chambertin). 6. Premier Cru / Grand Cru, which in Burgundy are named climats inside a village AOP, and in Alsace Grand Cru is its own AOP with 51 named sites [A].
- Total: 386 viticultural AOPs on 505,000 ha, per INAO via Vinetur, July 2026 [R, https://www.vinetur.com/fr/amp/20260706103813/inao-opens-a-new-fight-over-french-wine-appellation-boundaries.html]. Spain is ~4x smaller in count.
- Bordeaux classifications (1855 Médoc/Sauternes, Saint-Émilion, Graves, Cru Bourgeois) classify châteaux (producers), not land. They are not on any INAO polygon. Burgundy climats ARE land, and INAO's parcel data carries them [A, to check in the shapefile].
- Overlaps are heavy: a Pauillac vineyard is also inside Haut-Médoc, Médoc and Bordeaux, and Pays d'Oc IGP covers all of Languedoc. Architecture decision #42 (overlaps) already exists; France stresses it.

## 2. Source by source
| Need | Spain source (what we use) | France equivalent | URL | Format / licence | Verdict |
|---|---|---|---|---|---|
| Appellation list and rules | eAmbrosia + MAPA pliegos (PDF, Spanish) | eAmbrosia (EU-wide, same API) + INAO cahiers des charges (PDF/HTML, French) | https://www.inao.gouv.fr ; eAmbrosia register | EU register open [R]; INAO texts: official documents, reuse terms not read [A] | Same (EU), but INAO is French-only |
| Boundaries | MAPA OGC API Features, `dops.geojson`, municipalities from pliegos + IGN admin units | INAO "Délimitation parcellaire des AOC viticoles": shapefiles by parcel | https://www.data.gouv.fr/datasets/5aaf6b7ec751df67b0d7a87f | 2 ZIP shapefiles (1.8 MB + 254.9 MB), Licence Ouverte (Etalab), updated 19 Oct 2026 [V] | MORE. Caveat [V]: "for information only", official = plans at town halls/INAO, not all AOCs digitised. IGP polygons: not found in this search [A: INAO IGP data may be commune-level] |
| Legal weight of maps | Pliego text | INAO online plans portal, only legally binding source | https://inao.gouv.fr/sites/default/files/2024-10/CP%20INAO_nouveau_portail_des_plans_18-07-2023.pdf | portal, not a download | Less: our polygons would be "informative", say so on screen |
| Satellite close-in | PNOA via IGN (CC BY 4.0) + Esri | BD ORTHO on the Géoplateforme WMTS, layer `ORTHOIMAGERY.ORTHOPHOTOS` | https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetCapabilities | WMTS; capabilities say Fees: none, terms = cartes.gouv.fr/cgu [V]; BD ORTHO under Licence Ouverte 2.0 since 1 Jan 2021 [R, solutions-numeriques.com, acteurspublics.fr] | Same or better (full national coverage, key-free [V: no key in URL]) |
| Elevation | IGN MDT25 WCS | RGE ALTI 1 m / 5 m; Géoplateforme also offers elevation WMTS/WCS | https://geoservices.ign.fr (redirects to cartes.gouv.fr) | Licence Ouverte 2.0 [R] | More (1 m) |
| Names, rivers | IGN admin units OGC API | BD TOPO (hydrography, communes), ADMIN EXPRESS | geoservices.ign.fr / cartes.gouv.fr | Licence Ouverte 2.0 [R] | Same |
| Geology | IGME MAGNA 1:50,000 WMS | BRGM harmonised 1:50k (BD Charm-50) by département, plus WMS | https://www.data.gouv.fr/datasets/66631d4a67b5b112fafd0f8a | download + WMS; data.gouv says "Licence Not Specified" but site default Open Licence 2.0 [V, inconsistent]; printed notices are copyright-reserved [R] | Same, but ask BRGM about licence, and legend keys must be re-sampled (new `ROCK_KEY`) |
| Climate (map) | Köppen, Beck et al. 2023 cut to Spain | Same global dataset, cut to France | Scientific Data 10, 724 (already in SOURCES.md) | already licensed for reuse | Same, zero new cost |
| Climate (measured) | AEMET/other as in place-measures | Météo-France 1991-2020 normals, open data | https://donneespubliques.meteofrance.fr | Licence Ouverte [A; search did not confirm] | Same, to verify |
| Photos | Wikimedia Commons | Same | commons.wikimedia.org | per photo | More likely (Champagne, Bordeaux, Burgundy are well covered) [A, not measured] |
| Course badges | WSET L2/L3 spec place lists, `curriculum.json` | WSET L3 spec (already fetched, France section); Wine Scholar Guild French Wine Scholar | https://www.wsetglobal.com/media/11731/wset_l3wines_specification_en_highres_may2022_issue2.pdf ; https://winescholarguild.com/images/pdf-curriculums/fws_detailed_curriculum.pdf (PDF not text-readable by my tool) | structure only | MORE, see below |
| Text language | Spanish | French | | | Less comfortable: owner/writers read French pliegos; cost of check goes up [A] |

WSET L3 France list [V, text extracted from the PDF]: Bordeaux (Bordeaux, Médoc, Pauillac, Margaux, Saint-Émilion, Pomerol, Sauternes...), SW France, Burgundy (Chablis, Côte de Nuits, Côte de Beaune, Chalonnaise, Mâconnais), Beaujolais, Alsace, Loire, Rhône, Southern France, Champagne, Crémant. About 60 appellation names against Spain's 19 in `curriculum.json`. L2 France list not checked [A].
French Wine Scholar (WSG) is regional: Alsace, Champagne, Burgundy, Beaujolais, Jura, Savoie, Loire, Bordeaux, Languedoc-Roussillon, Rhône, Southwest, Provence, Corsica [R, ctgoodjobs.hk course page]. App would need a third course filter; the PDF text could not be read, so structure is [R] only.

## 3. More and less than Spain
MORE
- Parcel-level delimitation (Spain: municipality lists from pliegos, outlines from town borders). France gives vineyard-scale shapes, so Burgundy climats and Alsace Grand Cru sites are drawable.
- One national, key-free imagery service (Spain needed PNOA plus Esri; here the French Esri use becomes optional).
- 1 m elevation for hillshade.
- Study-course content is deeper (60 names).
LESS
- Polygons are "informative" and not fully digitised [V].
- Appellation texts: INAO cahiers des charges differ in structure; terroir passages are usually in section "lien avec la zone géographique" [A], similar to the pliego's link section, but French.
- Licence ambiguity on BRGM and INAO site texts.
- Bordeaux châteaux and classifications have no open polygon source; the app must not imply land boundaries for them [A].
- Scale: more places to write, check and keep current.

## 4. What the app must change (high level)
- Data model: nested appellation tree and parent-child overlap (a village AOP inside a regional AOP, climats inside villages). Ids per decision #41; one country level above region. Bordeaux "classifications" need a separate list type, not polygons.
- Size: INAO shapefile is 255 MB; we would simplify and split per region, load per country on first use (perf report section 4 already says this). Spain's `dops.geojson` is 1.6 MB; France at parcel level could be 10-40 MB before simplification [A]. A per-country size limit in `check.sh`.
- Home/Guides page: 386 AOPs cannot be a flat list; need region > sub-region grouping and a filter by course level.
- Map: bounds, imagery source switch per country (PNOA is Spain-only), IGN France as the equivalent; new geology legend keys; new Köppen cut.
- Pipeline: pliego extractor becomes cahier des charges extractor (French PDF/HTML); the checker and copy rules run on French sources, writers produce English; page cites `<source>:p<page>` still works.
- Course filter: add French Wine Scholar as third filter (decision for owner).
- Vocabulary: add "Premier Cru / Grand Cru / climat / château classification" to `docs/glossary.md`; "cru" is not a boundary level in Bordeaux.
- Tag [A] on all items above; none measured in the app.

## 5. Pilot: 2 places
Choose Chablis (small, Chardonnay, Grand Cru and Premier Cru climats inside it: tests nesting) and Pauillac (tests Bordeaux classification vs land, overlap with Médoc/Bordeaux, and heavy L3 content). A Rhône pick (Châteauneuf-du-Pape) is the alternative to Pauillac.
Steps:
1. Fetch INAO shapefile once (255 MB, to git-ignored `data/raw/`), cut the 2 AOPs and their climats, simplify; add a line to `data/SOURCES.md`.
2. Fetch the 2 cahiers des charges (INAO) and extract with an adapted `extract.py`; no text is stored beyond what Spain already stores.
3. Add BD ORTHO WMTS layer; BRGM WMS layer for 2 places; Köppen cut; place-measures.
4. Writers: one headless run each (pack, write, machine check, Opus check).
5. Show a rough map look to the owner (screenshots), then one PR.
Token estimate, from docs/PROJECT.md "Cost lessons": Ebro ~1.0M/guide all-in (10.4M re-read + 0.9M new for 11 guides); writers ~0.4M/guide; local route target 0.5-0.6M/guide [A, not yet measured]; Cataluña 3.1M/guide worst case.
- 2 guides: ~1.0-1.2M (2 x 0.5-0.6M) on the local route, 2M at Ebro's measure; add France-specific build: shapefile cut script, new layer wiring, extractor changes, French pliego handling. Estimate at 6-10 calls x ~100K context + new work = ~1M re-read + ~0.3M new for the engineering [A, calls x 100K rule]. Total pilot ~3M re-read + ~1.5M new, with ~1.5x cap = 6.5M. Splitting: re-read ~85%, new ~15% [A].
- Full-France (386 AOPs) at ~0.6-1.0M per guide would be 230-390M, i.e. roughly the whole 485M seen over 10 sessions on 19 Oct. Therefore a realistic scope is the ~60 appellations in the WSET L3 list: ~36-60M [A].

## 6. Open questions for the owner
1. France next, or Portugal first? Recommended: Portugal first for cost (fewer, flatter appellations, Spanish-like pliegos), France after a 2-place pilot. Alternative: France now because the data is richer and L3 content is deep.
2. Scope of France: (a) WSET L3 list, ~60 appellations, recommended; (b) all 386; (c) one region (Burgundy) first.
3. Polygons marked "informative only" on screen: yes, recommended, or hold until INAO's data is complete?
4. Third course filter (French Wine Scholar): add now, or after France places exist? Recommended: later.
5. Climats and Grand Crus as drawn zones inside villages? Recommended yes for Chablis pilot (tests the model).
6. Bordeaux classifications: show as a text list on the guide, no polygons. Recommended.
7. Licence check: ask BRGM and read INAO re-use terms before publish. Recommended: before the pilot ships, not before the pilot starts.

## URLs used
- https://www.data.gouv.fr/datasets/5aaf6b7ec751df67b0d7a87f (INAO parcels) [V]
- https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetCapabilities (IGN France capabilities) [V]
- https://www.data.gouv.fr/datasets/66631d4a67b5b112fafd0f8a (BRGM) [V]
- https://www.wsetglobal.com/media/11731/wset_l3wines_specification_en_highres_may2022_issue2.pdf [V]
- https://www.vinetur.com/fr/amp/20260706103813/inao-opens-a-new-fight-over-french-wine-appellation-boundaries.html [R]
- https://www.winewithseth.com/winewiki/french-wine-classification-system/ [R]
- https://www.solutions-numeriques.com/?p=75628 and https://www.acteurspublics.fr/articles/quatre-ans-apres-la-loi-lemaire-lign-libere-enfin-ses-donnees-geographiques [R]
- https://www2.ctgoodjobs.hk/Learning/1298047131/asia-wine-service-and-education-centre/french-wine-scholar-weekday-evening [R]
- https://inao.gouv.fr/sites/default/files/2024-10/CP%20INAO_nouveau_portail_des_plans_18-07-2023.pdf [R]
Not reached: eAmbrosia API (returned an HTML shell on three host tries, so France's entry count was not measured), Météo-France licence, RGE ALTI licence page, cartes.gouv.fr dataset page (empty).
