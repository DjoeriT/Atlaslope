# Germany prep: Mosel and Rheingau specs and outline route (issue #149, 22 Oct 2026)

Tags: [V] verified by me today, [R] read in a source, [A] assumed. Scratch files are in `/private/tmp/claude-501/de/`.
Nothing is under `data/raw/countries/de/` (see Blockers). No tracked tool, source file or `data/SOURCES.md` row was changed.

## 1. Spec texts

Register (eAmbrosia list, one GET, 6.6 MB) [V]:

| | Mosel | Rheingau |
|---|---|---|
| File number | PDO-DE-A1270 | PDO-DE-A1273 |
| Register `modificationDate` | 2026-03-11 | 2018-06-08 |
| `amendmentsInProgressFlag` | true | false (but see below) |
| Attachment in register | summary sheet 11673: the 2011 "technische Unterlage" (12 pp, Ares(2011)1393672) | summary sheet 11677: the same kind of 2011 file (13 pp) |

The register attachments are the 2011 files, not the current specs. Use BLE (ble.de) instead.

**Mosel** [V]
- Current spec: BLE `Produktspezifikation_Mosel.pdf`, 12 pp, created 23 Sep 2025, 4,178 words. It is the text of standard amendment
  PDO-DE-A1270-AM04, approved 5 Dec 2025, notice OJ C/2026/1628 of 11 Mar 2026 (a "Mitteilung ueber eine genehmigte Standardaenderung").
- EU single document: inside that OJ notice (German, fetched from `publications.europa.eu/resource/oj/C_202601628.DEU`; the
  `eur-lex.europa.eu` route answers with a bot check, which I did not work around). 5,799 words after tag stripping.
- Amendment in progress: yes. The register flag is true and BLE lists "Mosel (g.U.) (Unionsaenderung)" among open applications [R].
- The AM04 notice says "Kontrollbehoerden und deren Aufgaben werden aus der Produktspezifikation gestrichen": the new text has no control section.
- Text extracts cleanly with `pdftotext -layout` [V].

**Rheingau** [V]
- Current approved spec: BLE `Produktspezifikation_Rheingau.pdf`, 16 pp, created 13 Dec 2011, modified 23 Apr 2019, 3,756 words.
  No OJ publication is listed in the register.
- Amendment in progress despite the register flag: BLE has "g.U. Rheingau (1. Standardaenderung)", Bekanntmachung BAnz AT 09.06.2026 B7
  (Antrag dated 20 Apr 2026, two months to object). Files: amended spec `Produktspezifikation_AeM.pdf` 19 pp, 4,891 words;
  single document `Einziges-Dokument.pdf` 18 pp, 4,427 words; the notice itself 29 pp.
- Decision for the writer: the current text is the 2019 one; the amended one is a proposal until the Commission/BLE publishes it [A].
- Text extracts cleanly [V].

## 2. Extractor test (`Tools/guides/extract.py`, unchanged)

| Text | Real pages | Kept | Words | Spanish/French marker |
|---|---|---|---|---|
| Mosel spec | 12 | all | 4,226 | none |
| Mosel OJ notice (single document) | 1 (HTML) | all | 5,803 | none |
| Rheingau spec (2019) | 16 | all | 3,820 | none |
| Rheingau single document (draft) | 18 | all | 4,499 | none |
| Rheingau amended spec (draft) | 19 | all | 4,967 | none |

Output says "pages 1-13 of 13" for a 12-page PDF: pdftotext ends with a form feed, so the splitter counts one empty page; harmless [V].
Neither START nor STOP matched on any page, so every page is kept (the "no section 1 found" fallback). Gazette preamble is not cut.

Markers, proposed, not applied:
- **Mosel**: none needed. No control section exists since AM04.
- **Rheingau amended spec**: STOP at `^\s*11\.\s+Namen und Anschrift der Beh[oö]rde, die die Einhaltung` (heading "11. Namen und Anschrift der Behörde, die die
  Einhaltung der Bestimmungen der Produktspezifikation kontrolliert, und ihre besonderen Aufgaben", PDF p18). It would cut only about 230 words.
- **Rheingau 2019 spec**: do not add a stop. The same heading is "10. Namen und Anschrift der Behörde ..." on PDF p9, but the
  single document (pp 11-16, with the Zusammenhang text) comes after it. A stop there would drop about 1,265 words that a guide needs
  (the Chianti Classico case in Italy).
- No START marker needed: German texts have no gazette preamble worth cutting.

## 3. How the area is delimited

- **Mosel spec** (PDF p5, heading "4 Abgrenzung des Gebietes"): lists Gemeinden with their Ortsteile and a four-digit Gemarkung code
  each (199 codes), e.g. "Alf (1599), Alken (1375), Ayl (Ayl (2740), Biebelhausen (2741))", plus the Saarland part "Perl (3570), Oberperl (3560), Perl/Nennig (3540), Perl/Sehndorf (3580)" [V].
  The single document (OJ item 9) adds: exact boundaries are in parcel maps of the vineyard areas at www.ble.de/eu-qualitaetskennzeichen-wein [R].
  Only the vineyard areas ("Rebflaechen") of those Gemeinden belong to the g.U.
- **Mosel Bereiche and Einzellagen**: the spec names the six Bereiche (Bernkastel, Burg Cochem, Ruwertal, Saar, Moseltor, Obermosel) in the rules for
  Einzellagen and says names in the Weinbergsrolle may be used (OJ item 10, Weinlagengesetz RLP). Einzellagen are not listed individually [V].
- **Rheingau 2019 spec** (PDF p4, heading "3. Abgrenzung des Gebietes"): names 12 towns and Gemeinden only: Eltville am Rhein, Felsberg,
  Flörsheim am Main, Frankfurt am Main, Geisenheim, Hochheim am Main, Kiedrich, Lorch, Oestrich-Winkel, Rüdesheim am Rhein, Walluf and Wiesbaden. "0 attached maps" [V].
- **Rheingau amended spec** (PDF p9, heading "4. Abgrenzung des Gebietes"): the same towns, now with Gemarkungen and codes (32 codes), e.g.
  "Eltville am Rhein (Eltville (0618), Erbach (0620), Hattenheim (0631), Martinsthal (0660), Rauenthal (0687))", "Frankfurt am Main (Seckbach (0512))",
  "Felsberg (Böddiger (1878))" [V]. So the draft is much tighter than the 2019 text; the whole of Frankfurt and Wiesbaden is not meant.
- **Rheingau Einzellagen**: the 2019 spec has none. The draft's single-Lage rules (item 10.5/10.56 "Einzellage") name no individual Lagen [V].
  Bereich "Johannisberg" is not in either text (0 hits on "Bereich") [V].
- BLE also publishes the official boundary as per-Gemarkung parcel maps (PDF): 203 files for Mosel, 56 for Rheingau [V]. Maps, not GIS data.

## 4. Outline route

### Mosel (Rheinland-Pfalz part): official layer found [V]

The germany.md pointer (`geoportal.rlp.de/spatial-objects/606`) is wrong: that id is the Basis-DLM landscape model. The service list there has no wine layer
except 611 BFD5W (soil of vineyards, LGB). The Weinlagen come from the Landwirtschaftskammer (LWK RLP):
`https://geodaten.lwk-rlp.de/wordpress/?page_id=872` ("Geodatendienste / Download") links a WFS 1.1.0 with GeoJSON output:
`https://geodaten.lwk-rlp.de/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/projects/gg_wfslvermgeo_lokal.qgs&SERVICE=WFS&VERSION=1.3.0&REQUEST=GetFeature&outputFormat=geojson&typeName=<layer>`
(layers `gu`, `gga`, `weinlagen_recht`, `weinlagen`; no key, no login). Licence: Datenlizenz Deutschland Namensnennung 2.0 (dl-de/by-2-0), credit
"(c) Landwirtschaftskammer RLP (year), dl-de/by-2-0, https://weinlagen.lwk-rlp.de [Daten bearbeitet]" [R, from the LGB service text]. The page says "Nutzungsbedingungen beachten": read them before use [A].

| Layer | Content | Features | File | Area (EPSG:3035) |
|---|---|---|---|---|
| `gu` | g.U. outlines for Mosel, Pfalz, Nahe, Mittelrhein (no Ahr, no Rheinhessen, no Rheingau) | 492; **Mosel 186** (one per Gemarkung) | 12.7 MB GeoJSON | Mosel: 152.2 km2 summed; **118.8 km2 dissolved** (5,304 parts: parcel-level vineyard polygons) |
| `weinlagen_recht` | Einzellagen with Bereich, Grosslage, Gemeinde, Gemarkung | 1,583; **Mosel 462 Einzellagen**, 18 Grosslagen, 133 Gemeinden | 13.4 MB GeoJSON, stamped 2026-08-11 | Mosel: 192.6 km2 (no overlaps) |
| `weinlagen` | cadastral version | 1,798 (all RLP) | 14.0 MB | not measured |

Einzellagen per Bereich (Mosel, RLP): Bernkastel 207, Burg Cochem 141, Saar 65, Obermosel 27, Ruwer 22 [V]. (Moseltor in the spec = Obermosel plus Burg Cochem areas in the layer; the layer uses the RLP Weinlagengesetz names [A].)

Caveats [V unless marked]:
- 48 of the 492 `gu` polygons are invalid (self-intersections); dissolving needs `ST_MakeValid` plus a 0.5 m buffer. Summed area is 152.2 km2, dissolved 118.8 km2: the difference is overlap or repair loss [A].
- The Einzellagen layer (192.6 km2) is bigger than the g.U. layer (118.8 km2). Not explained; I did not check whether Lagen lie outside vineyard parcels [A].
- Saarland's part (Perl, Nennig, Sehndorf) is not in the RLP data; the Saarland geoportal was not tried.
- Size for the app: dissolved and simplified to 40 m the Mosel outline is 610 KB GeoJSON (5 decimals) and loses 8% of its area (109.1 km2). Too heavy and too broken up
  for the other countries' standard (9 KB in Italy). A hull per Bereich or a buffered union would be needed [A].
- Official hectare figure in the spec: none (grep for "Hektar" finds only the yield 125 hl/ha). Nothing to check the area against.

### Rheingau (Hessen): no official outline layer found [V]

- LWK RLP covers RLP only; its `gu` layer has no Rheingau.
- Hessen: the free OGC services at `gds-srv.hessen.de` (WMS capabilities opened) list no wine layer; the WFS request was refused (400).
  The Hessen geoportal CSW answered 403 and the GDI-DE/Geodatenkatalog catalogue search was rejected by a web firewall ("Request Rejected").
  I did not try to get around either. So I cannot say whether Hessen publishes a Weinlagen layer; the catalogue is closed to scripts [A].
- BKG VG250 (the fallback): `daten.gdz.bkg.bund.de` and `sgx.geodatenzentrum.de` both answered "Request Rejected" from this network, with the
  atlaslope-research agent and with curl's default. So no Gemeinde area was computed. No number for Rheingau km2 and Rheingau Einzellagen.
- Fallback routes, untested: (1) trace the 56 BLE Gemarkung PDFs [R]; (2) Hessen ALKIS Gemarkung boundaries for the 32 Gemarkungen of the draft spec (Hessen
  open data, dl-de/zero 2.0 per germany.md [R]); (3) VG250 from the owner's browser. A Gemeinde-level outline using the 2019 text would take in all of Frankfurt and Wiesbaden and is wrong; use the draft's Gemarkungen.
- Einzellagen count for Rheingau: not found [A: ~120 from memory, unchecked].

## Blockers and notes
- `data/raw` in this worktree is a symlink to `/Users/djoeri/Developer/Atlaslope/data/raw`, which is itself a symlink to itself (loop, "Too many levels of
  symbolic links"). Removing it was refused by the permission check, so nothing is in `data/raw/countries/de/`. Everything is in the scratch folder
  above. Fix: the owner replaces the loop in the main checkout with a real folder.
- BKG and Hessen catalogue hosts reject scripted requests; EUR-Lex HTML gives a bot check (the Publications Office `.DEU` route works).
- Fetched hosts for a `SOURCES.md` row later: webgate.ec.europa.eu (register + attachments), publications.europa.eu (OJ), ble.de (specs), geodaten.lwk-rlp.de (WFS), mapserver.lgb-rlp.de (capabilities only).
