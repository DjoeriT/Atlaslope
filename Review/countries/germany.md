# Germany as a next country (issue #149)

Owner ask 21 Oct 2026. Read-only desk research by AnalystBot. Tags: [V] verified by me in a source this session, [R] reported by a search summary or memory (not opened), [A] assumed.
Research limit: web search was thin; I opened only one PDF (it was unreadable). Every licence and URL below marked [R] must be checked on the dataset's own metadata page before any build.

## 1. Germany's wine map vs Spain's levels
- Spain in Atlaslope: country > region > DO/DOCa/VP/zone (places.json, from MAPA's list and eAmbrosia). Polygons come from one national service (MAPA).
- Germany has 13 Anbaugebiete (PDOs, g.U.), each split into Bereiche, then Großlagen, then Einzellagen (single vineyard sites). The Weinbergsrolle is the official list of Bereich, Großlage and Einzellage names. In Rheinland-Pfalz the Landwirtschaftskammer keeps it; the state fixes the names. [R] https://namenkundliche-informationen.de/ni/article/download/596/585/577 and https://www.geoportal.rlp.de/spatial-objects/606?f=json
- 2021 wine law (in force 27 Jan 2021; Weinverordnung 8 May 2021): the pyramid is now by origin. Top level g.U. is split into g.U. wine (Gebiet), Regionalwein, Ortswein, Lagenwein. Smaller origins only for g.U. A ms-aktuell piece says the new pyramid applies from vintage 2026; check. [R] https://www.bundesregierung.de/breg-de/aktuelles/weingesetz-1777868 , https://ms-aktuell.de/?p=157804
- Landwein areas (26, [R]) are PGI and need a separate decision (skip at first).
- Mapping to our tree: country > Anbaugebiet (the "appellation" level, like a DO) > Bereich (like a Spanish zone, but weak) > Großlage (marketing umbrella, no real terroir; skip) > Einzellage (the real terroir unit). Gap: Spain stops at DO/zone; Germany's interesting level is BELOW the PDO.

## 2. Source table
| Spain uses | Germany equivalent | URL | Format | Licence | Verdict |
|---|---|---|---|---|---|
| MAPA OGC API, one national DO polygon set | No national polygon set for Anbaugebiete [A]. Rheinland-Pfalz publishes Weinlagen (Einzellagen) as WFS from the Landwirtschaftskammer; other states each have their own | https://www.geoportal.rlp.de/spatial-objects/606?f=json [R]; INSPIRE metadata via https://gdk.gdi-de.org/ [R] | WFS | dl-de/by-2-0 for the RLP Weinlagen layer [R] | More detail, but 13 areas in 8 states = patchwork |
| BOE/MAPA pliego (PDF), required for Terroir | PDO product specification and EU single document in eAmbrosia (German Produktspezifikation). Reform specs 2021 onward | https://ec.europa.eu/agriculture/eambrosia/ (list API as in Review/guides-current/report-first-principles.md s.2) | PDF in German | EU, reusable | Same, but German specs are shorter and often silent on soils/climate [A] |
| eAmbrosia change feed | Same register, same call, filter DE | as above | JSON | EU | Same (free) |
| places.json from MAPA list | BLE (Bundesanstalt fuer Landwirtschaft und Ernaehrung) wine pages; Weinbergsrolle per state (RLP: LWK) | https://www.ble.de (not opened) | PDF/web; state WFS | varies [A] | Less central: no single national Lagenrolle found [R] |
| Esri/IGN imagery | State DOP20 via WMS (e.g. Hessen "DOP rgb Info", HVBG) and BKG DOP | Hessen: https://gdk.gdi-de.org/geonetwork/srv/api/records/e735971a-8237-f20b-cd06-81be76808eab [R] | WMS | Hessen: dl-de/zero-2-0, free by HVGG s.24 [R]; BW: dl-de/by-2-0 [R] | More (20 cm open orthophotos) but per state; fits "closer than Esri" |
| IGN MDT25 terrain | State DGM1 (1 m) open data per state; BKG DGM | https://opengeodata.lgl-bw.de [R] (BW); Hessen DGM WMS [R] | GeoTIFF/XYZ tiles | dl-de/by-2-0 [R] | More (1 m vs 25 m): matters for steep slopes. Heavy downloads |
| IGME geology (MAGNA 50) | BGR GUEK250 national; states have 1:25k to 1:50k (LGRB BW, LGB RLP, HLNUG Hessen) | https://www.bgr.bund.de [A]; HLNUG site mapping of Hessian vineyards (print only) https://www.hlnug.de/fileadmin/shop/publikationen/geologie/geologische_abhandlungen/Geol.%20Abh.%20Hessen%20Band%20114%20Standortkartierung%20hess%20Weinbaugebiete.pdf [R] | WMS/PDF | varies [A] | More at state level; check each |
| Beck et al. Koppen | Same global dataset | already in SOURCES.md | GeoTIFF | CC BY 4.0 | Same. Most of Germany is Cfb; boring, share-in-boundary less telling |
| Climate (Spain: Koppen only) | DWD Climate Data Center: station and gridded data (temperature, rain, sun), free, no registration | https://opendata.dwd.de/climate_environment/CDC/ [R] | CSV/ASCII grid | DWD open terms, licence text not confirmed [R] | MORE: local 1 km grids would beat Koppen. New but optional |
| Natural Earth, rivers | Same global set; river lines from BKG/EU HydroRIVERS [A]. Mosel/Rhein/Nahe etc. are the story | https://naciscdn.org/naturalearth/ | | public domain | Same |
| Wikimedia Commons photos | Strong coverage of Mosel, Rheingau, Bernkastel, Kaub etc. [A, not checked] | https://commons.wikimedia.org | | CC | Same or more |
| WSET course filter (curriculum.json) | WSET L2 and L3 list Germany by named areas; L3 goes into Mosel, Rheingau, Pfalz, Rheinhessen, Nahe etc. and Pradikat levels [R, spec PDFs not opened] | specs already cited in content/curriculum.json | PDF | structure only | Same, one country entry |
| Wine Scholar Guild | WSG has a Germany course/ guide as in Spain [A, not checked] | https://www.winescholarguild.org | | structure only | Same, to verify |
| Classification (none for Spain) | VDP (Grosse Lage, Erste Lage, Ortswein, Gutswein): private association, Lagen maps on vdp.de | https://www.vdp.de | web | private, all rights reserved [A] | Missing as open data; do not copy, mention only if cited |
| Language | Spanish pliego; we read it | | | | German specs and state texts: our pipeline reads German fine [A], but check/quote rules need German cites |

## 3. More and less
MORE: (a) site-level (Einzellage) polygons, official, open (RLP confirmed by metadata [R]); (b) 1 m terrain and 20 cm orthophotos open by state; (c) DWD climate grids; (d) slope is the story (Mosel Calmont, Rheingau); (e) strong photo coverage [A].
LESS: (a) no single national polygon set, so 8 states = 8 portals, formats, licences, update cycles (BW, Hessen Weinlagen layers not found in my search [R]); (b) PDO specs are short, rarely give soils or climate, so the Terroir section ("why it tastes this way") would lean more on geology maps and measurement; (c) Großlagen are not real terroir and confuse users; (d) the best-known quality tier (VDP) is private; (e) Pradikat/Oechsle and the 2021 pyramid change names, old labels stay in shops; (f) Weinbergsrolle details in other states unknown.

## 4. What the app must change
- Place tree: add levels below PDO (Bereich optional, Einzellage). Today's tree stops at zone; a Lage is a polygon of 1 to 200 ha, so ids (#41) and overlaps (#42) must allow thousands of children per country [A: RLP alone has hundreds of Einzellagen].
- Map: fit Germany bounds; a Lage needs zoom 14 plus, so imagery and terrain must be state tiles, not a country raster. Relief at 25 m is too coarse; use 1 m DGM at least for pilot areas.
- Slope: our slope measure (#170) must use the finer DEM; show steepness as headline for Mosel.
- Guide format: a Lage guide is short (soil, slope, aspect, river, neighbours); decide if a Lage is a full guide or a card in the Anbaugebiet guide. Update docs/guides.md Format log.
- Language: UI stays English; German place names and umlauts in search (Mosel/Mosel, Pfalz/Palatinate).
- Learn mode: add a German entry to curriculum.json; Study questions on Pradikat and Oechsle are content, not map.
- Attribution: each state licence needs its own credit line (dl-de/by-2-0 asks for owner name and year).

## 5. Pilot: Mosel and Rheingau
Pick one state-level data hop each: Mosel (RLP, Weinlagen WFS) and Rheingau (Hessen, imagery and DGM open; Lagen layer not confirmed [R]).
Steps: (1) check the licence on the RLP Weinlagen and Hessen layers and list them in data/SOURCES.md; (2) fetch Anbaugebiet polygons plus the Lagen WFS for the two (script); (3) fetch eAmbrosia specs and add DE to the weekly feed; (4) state DOP/DGM tiles for the two; (5) geology from LGB-RLP and HLNUG; (6) run the existing region pipeline for 2 Anbaugebiete as full guides (no single Lage guides yet); (7) add a mock of a Lage card and a steep-slope view; (8) curriculum entry.
Token estimate [measured per place: Andalucia 2.6M, Cataluna ~3.1M all-in, packs ~25K (docs/PROJECT.md "Guide cost per place"; 12 Cataluna guides ~37M, write step 20.1M)]:
- 2 guides x ~3M = ~6M all-in; of that re-read ~90% [R, from the 19 Oct audit: 97% re-reads].
- New-country pilot overhead (source discovery, data script, tree/model change, UI for Lagen, mock): ~3M new, ~5M re-read [A, no measured per-unit figure for this yet].
- Total ~14M, of which ~1M new tokens in guides and ~3M new in setup. Under the 20M "wait for his word" line, so the pilot can start on his go. Hard stop at 1.5x = 21M.
- Full Germany later: 13 Anbaugebiete x 3M = ~39M, plus Lagen guides if wanted (at 3M each unaffordable: a Lage needs a card format, not a guide).

## 6. Open questions for the owner
1. Level of ambition: (A, recommended) Anbaugebiet guides only, Lagen as map layer and short cards; (B) full guide per top Lage; (C) only Anbaugebiete, no Lagen.
2. Country order: Germany after Portugal/France? Recommended: do not start before the sister reports are compared; Germany is the hardest data patchwork but gives the best slope story.
3. Pilot start with Mosel + Rheingau (recommended) or Mosel + Pfalz (RLP only, one portal, less work).
4. VDP: ignore (recommended) or mention by name with a link only.
5. Landwein/PGI areas: skip (recommended) or include.
6. Check the licences myself first (small task, recommended) before any download.
Sources I actually opened: only the RLP PDF (unreadable); all else from search summaries [R].
