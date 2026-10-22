# Germany prep: WSET L3 German names and eAmbrosia PDOs (22 Oct 2026, #149)

Names and structure only. No WSET text is copied.

## Source and method
- [V] WSET Level 3 Award in Wines, Specification, May 2022, issue 2:
  https://www.wsetglobal.com/media/11731/wset_l3wines_specification_en_highres_may2022_issue2.pdf
  (281 KB, plain download, no login). Text extracted with `pdftotext -layout`.
- Raw files could not go to `data/raw/countries/de/`: `data/raw` in the main checkout is a symlink pointing at itself ("Too many
  levels of symbolic links"), so the worktree link is dead too. Files were kept in the session scratch folder instead. Needs a fix by LeadBot or the owner (not touched here).
- Where Germany appears in the spec (the file has no German names anywhere else):
  1. Regions list (a block of Anbaugebiet and village names).
  2. Grape lists (key varieties).
  3. Law list (quality and label terms).
  4. Sparkling list ("Deutscher Sekt").
  5. Tasting list (two wine styles; no new names).
- Not in the spec: any Bereich, any Grosslage, any Einzellage, "Erste Lage", "Grosse Lage", "trocken", "Qualitaetswein b.A." names.
  The word "Bereich" never appears.

## Count
**32 distinct German names** = 7 Anbaugebiete + 9 villages + 10 law and label terms + 1 sparkling term + 5 grape names.
27 without the grape names.

## Table (one row per name)

| # | Name | Type | Anbaugebiet | L3 level (where it sits in the spec) |
|---|------|------|-------------|--------------------------------------|
| 1 | Mosel | Anbaugebiet | Mosel | Regions list, top level |
| 2 | Nahe | Anbaugebiet | Nahe | Regions list, top level |
| 3 | Rheingau | Anbaugebiet | Rheingau | Regions list, top level |
| 4 | Rheinhessen | Anbaugebiet | Rheinhessen | Regions list, top level |
| 5 | Pfalz | Anbaugebiet | Pfalz | Regions list, top level |
| 6 | Baden | Anbaugebiet | Baden | Regions list, top level, no villages |
| 7 | Franken | Anbaugebiet | Franken | Regions list, top level, no villages |
| 8 | Bernkastel | Village | Mosel | Regions list, under Mosel |
| 9 | Wehlen | Village | Mosel | Regions list, under Mosel |
| 10 | Piesport | Village | Mosel | Regions list, under Mosel |
| 11 | Schlossböckelheim | Village | Nahe | Regions list, under Nahe |
| 12 | Rüdesheim | Village | Rheingau | Regions list, under Rheingau |
| 13 | Johannisberg | Village | Rheingau | Regions list, under Rheingau |
| 14 | Nierstein | Village | Rheinhessen | Regions list, under Rheinhessen |
| 15 | Forst | Village | Pfalz | Regions list, under Pfalz |
| 16 | Deidesheim | Village | Pfalz | Regions list, under Pfalz |
| 17 | Prädikatswein | Quality term | all | Law list |
| 18 | Kabinett | Prädikat | all | Law list; also tasting (with Spätlese) |
| 19 | Spätlese | Prädikat | all | Law list; also tasting |
| 20 | Auslese | Prädikat | all | Law list; also tasting (optional) |
| 21 | Beerenauslese | Prädikat | all | Law list; also tasting (optional) |
| 22 | Trockenbeerenauslese | Prädikat | all | Law list |
| 23 | Eiswein | Prädikat | all | Law list; also tasting (optional) |
| 24 | Qualitätswein | Quality term | all | Law list |
| 25 | VDP | Producer association | all | Law list; tasting ("VDP dry Riesling") |
| 26 | VDP.Grosses Gewächs (GG) | Vineyard classification | all | Law list |
| 27 | Deutscher Sekt | Sparkling term | all | Sparkling list |
| 28 | Riesling | Grape | all | Key variety, first grape of the two named as key |
| 29 | Spätburgunder (Pinot Noir) | Grape | all | Key variety |
| 30 | Silvaner | Grape | all | Other variety |
| 31 | Müller-Thurgau | Grape | all | Other variety |
| 32 | Dornfelder | Grape | all | Other variety |

"all" means a country-wide term, not tied to one Anbaugebiet.

## Gap against the 13 Anbaugebiete
- In the spec (7): Mosel, Nahe, Rheingau, Rheinhessen, Pfalz, Baden, Franken.
- Not in the spec (6): Ahr, Mittelrhein, Württemberg, Hessische Bergstraße, Saale-Unstrut, Sachsen.
- Villages exist only for Mosel (3), Nahe (1), Rheingau (2), Rheinhessen (1), Pfalz (2). Baden and Franken are listed with no villages.
- The Mosel+Rheingau pilot is fully covered by the spec: 3 + 2 villages.

## eAmbrosia: German wine PDOs
- [V] Working call (no key, no login):
  `https://webgate.ec.europa.eu/eambrosia-api/api/v1/geographical-indications` (whole register, one JSON file, 6.6 MB, plain GET).
  The URL given in the task (`ec.europa.eu/.../eambrosia-public/api/v1/...?countryCode=DE`) returns the web-app HTML, not data.
  Found via the register's own API page (https://webgate.ec.europa.eu/eambrosia-api/). Date filters `modifiedOnFrom/To` exist; no country filter.
  Filter used: `countries == ["DE"]`, `productType == "WINE"`, `giType == "PDO"`.
- [V] Result: 20 records. 19 are `registered`, 1 is `applied` (mittlere Havel, not yet a PDO). So the 19 holds.

### The 13 Anbaugebiete (all registered, protected 1973-09-18 unless noted)
| PDO | File number | eAmbrosia id |
|-----|-------------|--------------|
| Ahr | PDO-DE-A0867 | EUGI00000003386 |
| Baden | PDO-DE-A1264 | EUGI00000004643 |
| Franken | PDO-DE-A1267 | EUGI00000004645 |
| Hessische Bergstraße | PDO-DE-A1268 | EUGI00000004646 |
| Mittelrhein | PDO-DE-A1269 | EUGI00000004647 |
| Mosel | PDO-DE-A1270 | EUGI00000004648 |
| Nahe | PDO-DE-A1271 | EUGI00000004650 |
| Pfalz | PDO-DE-A1272 | EUGI00000004651 |
| Rheingau | PDO-DE-A1273 | EUGI00000004653 |
| Rheinhessen | PDO-DE-A1274 | EUGI00000004654 |
| Saale-Unstrut (1996-11-15) | PDO-DE-A1275 | EUGI00000004655 |
| Sachsen (1996-11-15) | PDO-DE-A1277 | EUGI00000004665 |
| Württemberg | PDO-DE-A1276 | EUGI00000004656 |

### The 6 extra PDOs (not Anbaugebiete)
All six are small single-vineyard (Einzellage) names with their own PDO. Which Anbaugebiet each sits in is [R] from the village names; the register record was not opened for it.

| PDO | File number | eAmbrosia id | Protected | Likely Anbaugebiet [R] |
|-----|-------------|--------------|-----------|------------------------|
| Bürgstadter Berg | PDO-DE-N1822 | EUGI00000010582 | 2014-04-16 | Franken |
| Monzinger Niederberg | PDO-DE-02363 | EUGI00000015112 | 2017-06-29 | Nahe |
| Uhlen Blaufüsser Lay (also "Uhlen Blaufüßer Lay") | PDO-DE-02081 | EUGI00000014254 | 2015-03-26 | Mosel |
| Uhlen Laubach | PDO-DE-02082 | EUGI00000014262 | 2015-03-26 | Mosel |
| Uhlen Roth Lay | PDO-DE-02083 | EUGI00000014263 | 2015-03-26 | Mosel |
| Würzburger Stein-Berg | PDO-DE-02403 | EUGI00000015827 | 2017-12-06 | Franken |

Also in the register, not a registered PDO: "mittlere Havel" PDO-DE-03277 (EUGI00000020348), status `applied`, application date 2024-07-01. Outside the 13; it is a new application, location [R] (Havel, Brandenburg).
The register also holds German wine PGIs (the Landwein names). Not counted here.

Consequence for the build: none of these six matter for the L3 list (no L3 name is among them). They only matter if a place list is built from eAmbrosia, where they must be separated from the 13.
