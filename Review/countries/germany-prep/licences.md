# Germany prep: licences (22 Oct 2026, #149)

Tags: [V] I opened the dataset's own metadata, licence or terms page (or the service's own capabilities file) and read it. [R] report or
memory, not opened. [A] assumed. Plain "blocked" says what stopped it. Not legal advice: dl-de/by-2-0 and CC0 are standard open licences.

## Summary
| Dataset | Licence | Usable? |
|---------|---------|---------|
| (a) RLP Weinlagen (BFD5W, LGB-RLP) | dl-de/by-2-0 (dataset metadata); CC0 on the open-data portal | Yes, with the stricter credit. Einzellagen only |
| (b) Hessen Weinlagen / Weinbaugebiet | none found | Open question (see b) |
| (b) Hessen DGM1, DOP20 (HVBG) | open by law, no conditions | Yes |
| (c) BKG VG250 | dl-de/by-2-0 (catalogue entry) | Yes, credit text partly [R] |
| (d) BGR GÜK250 | GeoNutzV (catalogue entry), credit line in service metadata | Yes, AGB text not read |
| (e) Baden-Württemberg Weinlagen | blocked | Unknown |
| (e) Bayern (Franken) Weinlagen | no layer found in Geoportal Bayern | No data found |

## (a) Rheinland-Pfalz Weinlagen
- [V] Dataset "BFD5W: Weinlagen", publisher is the **Landesamt für Geologie und Bergbau (LGB-RLP)**, not the Landwirtschaftskammer.
  The names and borders follow the Weinbergsrolle that the Landwirtschaftskammer keeps. Metadata id 8db62b4e-a29b-4029-a48f-1e07b5f00794, metadata date stamp 2024-10-15.
  Pages opened: https://open.rlp.de/de/suchergebnisse/dataset/bfd5w-weinlagen1 and the geoportal ISO 19139 record
  `https://www.geoportal.rlp.de/mapbender/php/mod_dataISOMetadata.php?outputFormat=iso19139&id=8db62b4e-a29b-4029-a48f-1e07b5f00794`.
- [V] **The two pages disagree.** open.rlp.de shows "Creative Commons CC Zero". The ISO record (LGB's own) says dl-de/by-2-0 with a credit line.
  The LGB terms page (https://www.lgb-rlp.de/karten-und-produkte/online-karten/nutzungsbedingungen-fuer-online-karten) also says dl-de/by-2-0
  for commercial and non-commercial use. Follow the stricter one: dl-de/by-2-0 and give credit.
- **Credit text [V]:** `©LGB-RLP (Jahr des Datenbezugs), dl-de/by-2-0, https://www.lgb-rlp.de [Daten bearbeitet]` and the licence name
  "Datenlizenz Deutschland – Namensnennung – Version 2.0" with link https://www.govdata.de/dl-de/by-2-0. The year is the year the data was taken.
  "Daten bearbeitet" applies when we change them (simplify, clip).
- [V] Layer: a **WMS** layer `weinlagen` ("BFD5W: Weinlagen", EPSG:25832 and others) in
  `https://mapserver.lgb-rlp.de/cgi-bin/mc_bfd5w?REQUEST=GetCapabilities&VERSION=1.1.1&SERVICE=WMS`. The abstract says "Namen und Grenzen der Einzellagen".
- **WFS: not found.** The LGB WFS for the BFD5W family (`https://mapserver.lgb-rlp.de/cgi-bin/mc_bfd5w?...SERVICE=WFS`, 26 feature types) lists soil
  layers only; no Weinlagen type. The geoportal.rlp.de WFS id 4221 is a soil layer (Bodenreaktion). The open.rlp.de record lists no download file.
  The LGB product page has "LGB-Downloads" links that I did not follow to a file. Blocked: the Weinlagen geometry is only confirmed as a WMS picture.
  Next step: LGB download page for BFD5W (shapefile), or ask LGB (office address on their site; not sent).
- [V] The LGB method sheet (https://www.lgb-rlp.de/fileadmin/service/lgb_downloads/boden/bfd5w_methodenbeschriebe/bfd5w_weinlagen.pdf):
  the map holds Einzellagen, names visible from 1:50,000. It names Bereiche and Grosslagen as part of the Weinbergsrolle but describes no separate layer for them.
- **Anbaugebiet or Bereich layer in RLP: none found.** [V] for this dataset (Einzellagen only); not found elsewhere in the govdata catalogue
  (a search for "Weinlagen" returns only this record). [V] The Landwirtschaftskammer's own viewer https://weinlagen.lwk-rlp.de ("Weinlagen-Online",
  1,600+ Einzellagen, open to everyone) is a viewer; the page I read gives no data licence. Use of its data is therefore not cleared.
- Also seen: the govdata record of "Landweingebiete im Saarland" (CC BY 4.0, Saarland). Not needed.

## (b) Hessen
- **Weinlagen or Weinbaugebiet layer: none found.** [V] The govdata catalogue search for "Weinlagen" and "Weinbaugebiet" returns no Hessen record.
  The Hessen geoportal's own search was refused (HTTP 403), and web search was rate-limited, so the Hessen portal itself is unchecked. Blocked on that point.
  Rheingau Einzellagen therefore have no confirmed open polygon source. Options (not tried): Hessen ministry or Hessisches Landesamt für Naturschutz, Umwelt und Geologie (HLNUG) layers, or LGB-RLP's data if it also covers the Rheingau (the dataset is named "Rheinland-Pfalz" and is [A] RLP only).
- [V] **DGM1 and DOP20 (HVBG):** https://gds.hessen.de/INTERSHOP/web/WFS/HLBG-Geodaten-Site/de_DE/-/EUR/ViewTemplate-View?Template=content%2Fmain_agb&SelectedMenuItem=Nutzungsbedingungen
  says that under the law on providing open Geobasisdaten of 30 Sep 2021 every use of the HVBG Geobasisdaten is allowed "without restriction or condition",
  since 1 Feb 2022. The HVBG open-data page (https://hvbg.hessen.de/geoinformation/open-data) lists DOP (orthophotos) and DGM (terrain) as free.
  I did not open a DGM1-specific or DOP20-specific product sheet; the grouping is by product family.
- **Credit text:** no required wording. [V] The HVBG page says only: if a source note is given, it must point out any change made to the data. Suggested line [A]:
  `© Hessische Verwaltung für Bodenmanagement und Geoinformation (HVBG), Daten bearbeitet`. Products built on third-party data (for example BKG) follow the source line shown on that product.

## (c) BKG VG250 (municipal limits)
- [V] Catalogue entry on govdata.de, "Verwaltungsgebiete 1:250 000 mit Einwohnerzahlen, Stand 31.12." (VG250-EW), publisher BKG, resource licence
  `dl-by-de/2.0`, access rights https://www.govdata.de/dl-de/by-2-0. Shapefile:
  https://daten.gdz.bkg.bund.de/produkte/vg/vg250-ew_ebenen_1231/aktuell/vg250-ew_12-31.utm32s.shape.ebenen.zip. Level covers state to Gemeinde.
- **Blocked:** BKG's own product pages (gdz.bkg.bund.de, 75 s timeout) and its WMS (sgx/sg.geodatenzentrum.de, "Request Rejected") did not answer from here. So the licence is from the catalogue, not BKG's own page.
- **Credit text:** not in the catalogue entry. [R] BKG's usual line: `© GeoBasis-DE / BKG (Jahr des Datenbezugs) dl-de/by-2-0`, with "Daten bearbeitet" if changed. Check on BKG's page before use.
- Scale caveat: VG250 is 1:250,000 and coarse for village boundaries. [A]

## (d) BGR GÜK250 (geology)
- [V] govdata.de catalogue entry "Geologische Übersichtskarte der Bundesrepublik Deutschland 1:250.000 (GÜK250)", publisher BGR, licence
  `geonutz/20130319` (the federal GeoNutzV: free use, also commercial, with a source note). Access rights: no limitations. Shapefile
  https://download.bgr.de/bgr/geologie/GUEK250/shp/GUEK250.zip (157 MB, responds 200, not downloaded). WMS https://services.bgr.de/wms/geologie/guek250/.
- [V] The WMS capabilities file says fees NONE and gives the citation: `Datenquelle: GÜK250 (WMS), (c) BGR, Hannover, 2019`. It points to the BGR terms at https://www.bgr.bund.de/AGB.
  For the shapefile the same form without "(WMS)" is [A].
- Blocked: the BGR page of the GÜK250 product returned 404 and the AGB link opens a product list, not terms. The GeoNutzV text itself I did not open.
- [A] GÜK250 shows only generalised surface geology, so it is a country-level backdrop, not a vineyard-scale soil map.

## (e) Baden-Württemberg and Bayern (Franken)
- **Bayern:** [V] Geoportal Bayern's catalogue service (https://geoportal.bayern.de/csw/bvv) was asked for "Weinlage": 0 records; "Wein": 3 records, all
  administrative atlases or courts, no vineyard layer. Result: **no Weinlagen layer found in Geoportal Bayern.** Not checked: LWG Veitshöchheim
  and the Fränkischer Weinbauverband pages (web search was rate-limited), so a layer held outside the geoportal may exist.
- **Baden-Württemberg:** blocked. The geoportal-bw catalogue answered 403/500, the govdata search for "Weinlagen" shows no BW record. Existence unknown. Likely holders [A]: LGL-BW, LUBW, or the Weinbauinstitut Freiburg.
- Licence: none to give for either, because no layer was found.

## Open points for LeadBot
1. `data/raw` in the main checkout is a symlink to itself (broken). Fix before any download step.
2. RLP Weinlagen geometry: find the shapefile download (LGB) or ask LGB. WFS is not available there.
3. Rheingau polygons: no open source found yet (see b). This is the main risk for the Mosel+Rheingau pilot map (the Mosel half is covered if the RLP download works).
4. Confirm the VG250 credit wording on BKG's page once reachable.
5. No email or form was sent.
