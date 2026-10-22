# Country data coverage: Portugal, France, Italy (22 Oct 2026, issue #149)

Measured by `Tools/countries/coverage.py` on the pull of 22 Oct 2026 (`Tools/countries/pull.py`) [V], unless tagged.
Spain is the yardstick: what each Spanish guide and map layer uses today.

## At a glance

| | Portugal | France | Italy |
|---|---|---|---|
| EU wine names (PDO / PGI) | 44 (30 / 14) | 442 (368 / 74) | 522 (411 / 111) |
| EU single document fetched, with text | 40 | 421 | 514 |
| No single document in the register | 4 (all PGI) | 21 | 8 |
| Year of that document | 2011-2014 | 2011-2014 | 2011-2016, mostly 2014 |
| Names changed after it (later Official Journal items) | 23 | 313 | 197 |
| Official wine-area outlines | none | INAO parcels, 1,277 names in the file | Piemonte only (64 areas) |
| Register names found in the outline file | - | 339 of 442 | 57 (all in Piemonte) |
| PDOs without an outline | 30 (all) | 29 | 354 |
| Admin outlines (to build areas from lists) | CAOP2025: 3,049 parishes, 278 municipalities | INAO file is per commune already | ISTAT 2025 municipalities |
| Licences | all open, CC BY 4.0 [V] | Licence Ouverte [V] | CC BY 4.0 [V] |

## Portugal
- **Have:** all 44 names; 40 single documents in Portuguese with clean text; every mainland parish and municipality.
- **Don't have:**
  - official wine-area outlines;
  - the national specs (cadernos de especificações, from IVV and the regional commissions);
  - the islands' parishes, Madeira and Açores;
  - imagery (DGT OrtoSat), terrain, climate and geology. Geology's licence is unclear.
- **Extra effort:**
  - Each area must be built from the parish list in its spec, the way Rioja's zones were built.
  - About half the names (23) changed after their EU document, so the current spec has to be read too.

## France
- **Have:**
  - all 442 names and 421 single documents, in French;
  - INAO's parcel delimitation, per commune and per name: 11,764 shapes, 600 MB raw.
- **Don't have:**
  - the cahiers des charges, INAO's current national specs;
  - 21 single documents;
  - terrain (IGN RGE ALTI), imagery (IGN, open) and geology (BRGM, licence to ask).
- **Extra effort:**
  - **Nesting.** The INAO file names 1,277 denominations against 442 EU names: crus, villages and extra place names. The app needs a level for these before French data goes in. This is a design question for the country-model slice.
  - **Changed rules.** 313 of 442 names changed after their EU document.
  - **29 PDOs not matched.** Some are name variants (Crozes-Hermitage, Pouilly-Fumé). Some may be delimited by commune rather than parcel (Champagne, Hermitage) [A]. Some are a different product type: Pineau des Charentes and Floc de Gascogne are vins de liqueur. Each needs a hand check.
  - **Size.** The raw parcels must be simplified to commune-level outlines before anything ships.

## Italy
- **Have:** all 522 names; 514 single documents in Italian; every municipality; Piemonte's official DOC and DOCG areas.
- **Don't have:**
  - outlines outside Piemonte (354 PDOs);
  - the disciplinari, the national specs. The MASAF list page held no direct links when probed [V]; where they live is still to find [A];
  - terrain (TINITALY 10 m) and climate. Geology is patchy, and its licence unclear.
- **Extra effort:** this is the largest outline job of the three.
  - Every area outside Piemonte must be built from the municipality list in its disciplinare.
  - The documents are mostly 2014 transfers, and 197 names changed since.
  - Italy also has regions as a level, like Spain's study regions.

## Where extra resource goes, biggest first
1. **Current rule texts, all three countries.** 533 of 1,008 names changed after their EU document. Changes since 2019 can be read by script, the way Spain's pipeline already does with the EU Publications Office search. National specs need one source adapter per country, after a short research step to find where they are published. Do this per place, for guide places only.
2. **Outlines from lists:** Portugal (30) and Italy outside Piemonte (354). This is reading a municipality or parish list out of each spec. Do it only for places that get a guide: the WSET Level 3 lists are about 7 and 40 [R].
3. **France's nesting level and the parcel simplification:** a design step in the country-model slice, before French data goes in.
4. **Map layers per country** (imagery, terrain, climate, geology): one config each in the country-model slice. Geology licences need asking in all three.
