# Austria prep: Wachau (issue #149, decisions #81-#86)

Data and research for the Wachau; the second Austria pilot place is the owner's choice and is not prepared here. Run 23 Oct 2026.
Build: `python3 -I Tools/data/build_at_areas.py` (1 s). Raw files: `~/Developer/Atlaslope-raw/countries/at/` (manifest entries added).

## 1. The DAC regulation (BGBl. II 200/2020)
- Fetched from RIS as HTML (`BGBLA_2020_II_200.html`, 58 KB), plain text 1,272 words. `Tools/guides/extract.py` finds no section 1 and keeps every page:
  **1,276 kept words** (one page, header added). The desk report's 4,451 words is not this text [A: it counted the consolidated text or amendments];
  the 2020 regulation is short. The RIS HTML repeats some sentences (once as "Absatz 2," and once as "Paragraph 3, (2)"); the text file keeps them.
- Area rule (§ 1): grapes hand-picked in the Weinbaugebiet Wachau; made and bottled in the Wachau, or in neighbouring Kremstal or Traisental
  with the notification rules (July 31, parcel and KG numbers).
- The regulation lists **no Gemeinden for the area, no KG polygons and no Rieden**. It lists the permitted **Gemeinde labels** (§ 3 (2)): Loiben
  (= KG Oberloiben + Unterloiben), Dürnstein, Weißenkirchen, Joching, Wösendorf, St. Michael, Spitz, Gut am Steg, Viessling, Elsarn, Mühldorf,
  Spitzer Graben (a Grosslage, no KG), Schwallenbach, Willendorf, Groisbach, Aggsbach, Arnsdorf (= Oberarnsdorf + Mitterarnsdorf), Rührsdorf,
  Rossatz (= Rührsdorf + Rossatz, as printed), Unterbergern, Mauternbach, Mautern, Baumgarten. That is 27 KGs in the NÖ layer once the labels are resolved.
- Ried rules (§ 5): Riedenwein only from Grüner Veltliner or Riesling (15% other quality varieties tolerated), no chaptalisation, glass bottles
  only, no 1.0 and 2.0 l. The Gemeinde, Ortsteil or KG of the Ried must be on the front label, from the § 3 (2) list but not "Spitzer Graben".
  So a Ried name is only meaningful together with its KG: names repeat across KGs (176 KG+Ried pairs, 119 distinct names).
- The boundary of the Weinbaugebiet Wachau itself is not in this regulation (it sits in the Weinbaugebiete regulation, not fetched).

## 2. Rieden (NÖ WFS OGD:RLF_WEINBAU_RIEDEN, CC BY 4.0, stamp 2026-10-17)
- Filter: the 27 KGs above, Bezirke Krems-Land and Melk (Aggsbach also exists in Melk; excluded). Result: **216 polygons**, 27 KGs, 176 KG+Ried
  pairs, 119 distinct Ried names, all status "Verordnung", **25.2 km2** of Ried land.
- Sizes: raw filtered GeoJSON 1,072 KB (full state 16 MB). Built zones (dissolved per KG+Ried, 40 m, 5 decimals): **176 zones, 100 KB (21 KB gzipped)**.
- Assumption [A]: "Elsarn" is Elsarn am Jauerling (Gemeinde Mühldorf; Elsarn im Straßertal is Kremstal); "Spitzer Graben" is taken to be the
  Mühldorf valley KGs Niederranna, Oetz and Povat (each holds one Ried), not confirmed by a source. "Aggsbach" is KG Aggsbach in Gemeinde Aggsbach (Krems-Land).
- Not in the layer: KGs Viessling etc. are present as "Vießling". Every one of the 27 KGs has at least one Ried.

## 3. Outline
- No official DAC outline: the regulation has none; Vinea Wachau and ÖTW maps are private (#85).
- Route A, Rieden closed at 150 m (as Germany), simplified 40 m: **29.7 km2**, 10 parts, **7 KB (2.4 KB gzipped)**. The Ried land itself is 25.2 km2.
- Route B, union of the eight Gemeinden holding the KGs (Statistik Austria 2026-01-01, CC BY 4.0): **191.1 km2**. This overshoots six-fold (whole
  municipalities including Dunkelsteinerwald forest and Mautern town); not usable as an outline. Kept only as `gemeindeKm2`.
- Official hectare figure: none fetched. Vines are about 1,350 ha = 13.5 km2 [R: desk report, from Vinea Wachau]. The closed outline is 2.2 times
  the vines, in line with Germany's note that a Ried layer is land, not plantings; hence `approximate: true`.
- Not copied into `data/added-boundaries.geojson` (the card did not ask; Germany's `to_map` does it): add when the pilot is built.

## 4. Licences
- NÖ Rieden: CC BY 4.0, credit Land Niederösterreich. Statistik Austria Gemeinden: CC BY 4.0. RIS text: Austrian legal text, reused with source credit [A: no explicit licence line checked].

## Open points
1. Confirm the Spitzer Graben KGs and the Aggsbach/Elsarn readings with the Wachau committee text or the Weinbaugebiete regulation.
2. The Weinbaugebiet Wachau boundary (Gemeinde list) lives in another regulation; fetch if an official hectare or Gemeinde list is wanted.
3. Whether the outline should be tightened (e.g. close at 100 m) is a look-and-feel choice; no map screenshot was taken (data only).
4. Raw folder `countries/at/` also holds the desk report's `eambrosia/`, `web/`, `wset/`: not in the manifest, not touched.
