# Austria desk report (23 Oct 2026, issue #149, decisions #81-#86)

Research only. Tags: [V] opened and read, [R] report or memory, [A] assumed. Raw files in `~/Developer/Atlaslope-raw/countries/at/`
(outside the repo). User-Agent "Atlaslope/0.2". WSET text not copied: names only.

## Verdict
Plan holds. No decision is overturned. Two assumptions need an edit: #84 (Rieden layers exist for Niederösterreich and Burgenland,
none found for Steiermark) and #86 (the 10 m national terrain is open but a 1.9 GB download).

## 1. eAmbrosia (whole register, 4,022 entries, filtered locally) [V]
32 Austrian wine entries: 29 PDO (27 live, 2 removed) and 3 PGI.
- PGI (3): Bergland, Steirerland, Weinland.
- Removed (2): Neusiedlersee-Hügelland, Südburgenland (flag `removedFlag`).
- Non-DAC live PDOs (9): the state PDOs Burgenland, Niederösterreich, Steiermark, Wien, Kärnten, Oberösterreich, Salzburg, Tirol, Vorarlberg.
- DAC PDOs (18 live): Carnuntum, Eisenberg, Kamptal, Kremstal, Leithaberg, Mittelburgenland, Neusiedlersee, Rosalia, Ruster Ausbruch,
  Südsteiermark, Thermenregion, Traisental, Vulkanland Steiermark, Wachau, Wagram, Weinviertel, Weststeiermark, Wiener Gemischter Satz.
  eAmbrosia does not mark which PDO is a DAC. The set was matched to the DAC-Verordnungen in RIS [V], which name all 18 (`Wagram` in the 2020
  Sammelverordnung; `Thermenregion` in 2024). Count 18 = decision #82's "about 18". Ruster Ausbruch is a sweet-wine DAC inside Rust/Neusiedlersee-Hügelland ground: a text-light place.
- Register has no product-specification PDF link; it lists OJ notices (Wachau: OJ C 68, 24.2.2023 p.41 and corrigendum C/2025/90060;
  Südsteiermark: OJ C 66, 23.2.2023 p.28; Ruster Ausbruch: OJ C/2024/673 and L 2024/1228). `eur-lex.europa.eu` answers a bot check (HTTP 202,
  empty). The Publications Office `resource/oj/` route returned the wrong item for the issue number; the German notice text was not fetched. [V]

## 2. WSET L3 (spec May 2022, issue 2, same PDF as Germany) [V]
Austria names, 13 in all, no Ried, no Prädikat level names beyond the law list:
- Regions: Niederösterreich (Wachau, Weinviertel), Burgenland. That is 2 DAC places in the L3 list.
- Grapes: Riesling, Grüner Veltliner (key white), Welschriesling, Blaufränkisch, Zweigelt, Saint Laurent.
- Law: Qualitätswein, Prädikat, DAC. Tasting list: Grüner Veltliner (essential white).
- Not in L3: Südsteiermark and every other DAC. Southern Styria is the owner's pick in #83, not an exam need.

## 3. Outlines and Rieden [V unless tagged]
- DACs are federal rules (Verordnungen des Bundesministers, BGBl. II), not state portals. No national DAC outline layer found.
- Niederösterreich Rieden: WFS `sdi.noe.gv.at/at.gv.noe.geoserver/OGD/wfs`, layer `OGD:RLF_WEINBAU_RIEDEN`, GeoJSON works. 3,342 polygons,
  15.9 MB, 15 districts, fields KGNAME, WEINBAUFLUR, WEINBAURIEDE1/2, status all "Verordnung", updated 17 Oct 2026. CC BY 4.0. Wachau Katastralgemeinden
  (Spitz to Mautern, 13 KGs) hold 135 polygons and 86 Ried names, 17 km2 (equal-area approximation; the layer is Ried land, ~795 km2 for the whole state, so
  it is wider than planted vines). The same service has `RLF_WEINBAU_FLUREN`. Covers Wachau, Kamptal, Kremstal, Wagram, Traisental, Weinviertel, Carnuntum, Thermenregion.
- Burgenland: "Weinbauriede Burgenland", data.gv.at id dc49fa3f, CC BY 4.0, download via geodaten.bgld.gv.at (page listed, file not opened) [R].
- Steiermark: no Rieden or vineyard layer found in data.gv.at (searches Weinbau, Weinbauriede, Weinbaukataster, Rebflächen). Stmk WFS guess failed (400). [V not found]
  Route: Gemeinde and KG lists in the Südsteiermark DAC regulation + Statistik Austria Gemeindegrenzen (CC BY 4.0, WFS/zip on data.statistik.gv.at) or BEV Katastralgrenzen [R].
- Wien: Wien WFS capabilities hold no wine layer [V]. Route: Wiener Gemischter Satz regulation (Bezirke, Rieden) [R].
- Vinea Wachau and ÖTW outlines are private: not used (#85).

## 4. Terrain and imagery [V metadata, files not downloaded]
- National 10 m DGM (airborne laser scan, EPSG:31287, GeoTIFF): data.gv.at ids b5de6975 / d88a1246 (Geoland.at), `gis.ktn.gv.at/OGD/Geographie_Planung/ogd-10m-at.zip`,
  1.94 GB, CC BY 4.0, last modified 2019. Per-state 10 m grids are smaller and also CC BY 4.0: Niederösterreich `DTM_10x10.zip`, Steiermark `ALS_DGM_10M_BMNM31.zip`, Burgenland.
- basemap.at Orthofoto: Open Government Data Austria, CC BY 4.0 (page text of basemap.at and data.gv.at metadata). Usable as a free fallback to Esri.

## 5. Specs
- DAC text: RIS (data.bka.gv.at/ris/api/v2.6, HTML at `ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_<year>_II_<n>/...html`), German only, plain HTML. Wachau: BGBl. II 200/2020; Südsteiermark: II 299/2018;
  amended in the Weinrecht-Sammelverordnungen 2020 to 2024. Wachau text 4,451 words, Südsteiermark 7,267 [V].
- Content: grapes, styles, Gebiets, Orts and Riedenwein rules, lists of Gemeinden, Katastralgemeinden and Rieden. No soils and no climate words [V].
  Soils and climate must come from other sources (as for Portugal/Germany); the Sammelverordnungen are the legal base for the guide's "official rules" line.

## 6. Pilot pair
- Wachau: DAC II 200/2020 + EU spec (OJ C 68/2023). Outline: NÖ Rieden WFS (above) plus the KG list from the regulation. Vines ~1,350 ha [R].
- Südsteiermark: DAC II 299/2018 + EU spec (OJ C 66/2023). Outline: municipality/KG lists + Statistik Austria limits; no Rieden layer. Vines ~2,700 ha [R].

## 7. Decisions checked
- #81 timing: no conflict.
- #82 scope: about 18 confirmed (18 DAC PDOs incl. Ruster Ausbruch). 9 state PDOs and 3 PGIs stay text.
- #83 pilot: holds; Südsteiermark is not named in WSET L3.
- #84 Rieden: partly contradicted. Layer exists for NÖ (Wachau) and Burgenland; none found for Steiermark, so Südsteiermark has no Rieden zones in the pilot.
- #85 private tiers: no conflict.
- #86 map layers: "national 10 m terrain" is real and open (CC BY 4.0) but a 1.9 GB zip; use per-state grids or cut it once. Not contradicted.
- Plan risk "nine states, nine portals": softer than feared. DAC rules are federal; only outlines/Rieden are state data (NÖ, Burgenland available).
- Not done: Burgenland Rieden file, EU single-document texts, KG polygon source check (all [R] above). Wien and Steiermark outlines remain the open item.
