# Austria prep: Wachau and Neusiedlersee (issue #149, decisions #81-#86, #94)

Data and research for the Wachau (sections 1-4 and Open points) and the Neusiedlersee (the section after them; decision #94 made it the second pilot place). Run 23 Oct 2026.
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

# Neusiedlersee (decision #94)
Build: the same `python3 -I Tools/data/build_at_areas.py` (15 s for both places; the Wachau numbers above are unchanged). Raw: `~/Developer/Atlaslope-raw/countries/at/` (manifest entries added).

## N1. The DAC regulation
- In force: BGBl. II 431/2020 Art. 2 (RIS HTML 70 KB; Art. 1 of that act is Ruster Ausbruch). The original is BGBl. II 90/2012 (amended 48/2013, and in 2014, 2017); the 2020 act re-issues the whole text (sweet wines added, the label and bottling rules shortened). No later amendment names Neusiedlersee (the 2020 to 2024 Sammelverordnungen do not list it) [V: titles in RIS search result].
- Plain text from Art. 2 on (`neusiedlersee-dac-431-2020.txt`): `extract.py` finds no section 1 and keeps the one page: **1,089 words** (the 1,085-word source plus the header). Unchanged `extract.py`.
- Area (§ 1): "Der politische Bezirk Neusiedl am See mit Ausnahme der Gemeinden Winden und Jois bildet das Weinbaugebiet Neusiedlersee." Whole Gemeinden: no KG, no Ried list. Grapes must be harvested in the area; made and bottled there (outside only with the Regionales Weinkomitee Burgenland's permission).
- Styles (§ 2 Z 5), four categories: (a) Neusiedlersee DAC, Zweigelt, 12.0% minimum, wood or steel, residual sugar up to 4 g/l, grape variety on the label; (b) Neusiedlersee DAC Reserve, Zweigelt (or Zweigelt cuvee), 13.0% minimum, large wood or barrique; (c) Neusiedlersee DAC fruchtsuess, white quality varieties, Spaetlese and Auslese, at least 45 g/l; (d) Neusiedlersee DAC Reserve edelsuess, white, Beerenauslese and Trockenbeerenauslese, at least 45 g/l. Sweet wines may name the narrower origin "Seewinkel" when the grapes come from Apetlon, Illmitz and or Podersdorf.
- Ried rule: **"die Angabe einer Riedenbezeichnung ist nicht zulässig"** for (a) and (b); nothing on (c) and (d). So Rieden are not a label feature here, unlike the Wachau.
- EU specification: the register (eAmbrosia, in the desk report's `eambrosia/gi.json`) holds PDO-AT-A0219 "Neusiedlersee", registered, modified 2023-02-24. The OJ notice and single document were not fetched [A: not needed for the area, which the regulation fixes].

## N2. Rieden (Land Burgenland "Weinbauriede", CC BY 4.0)
- Found: data.gv.at dataset dc49fa3f (publisher Land Burgenland, modified 2026-08-11), distribution = `geodaten.bgld.gv.at` download link, which serves a zip (shapefile, MGI Austria GK M34, export 2026-10-09). Licence **CC BY 4.0 on the catalogue entry**; the portal's own Nutzungsbedingungen page is a general disclaimer and names no licence. Credit "Land Burgenland".
- Whole Land: 2,209 polygons (Ried and Subried types), 9 Bezirke. Bezirk Neusiedl am See: 427; without Jois (63) and Winden (15): **349 polygons** (239 Ried, 110 Subried).
- Names: 130 distinct Ried names, 138 KG+Ried pairs in 24 KGs, 22 pairs with Subried names (86 Subried names). Subried polygons lie inside Ried polygons (the Ried-only union equals the union of both: 265.4 km2).
- Area: **265.4 km2** of Ried land (see N3). Seewinkel Rieden are large: Salzgruende (Apetlon) alone is 39 km2 of steppe, pasture and vines.
- Sizes: raw zip 2.7 MB, filtered GeoJSON 1,874 KB. Built zones (dissolved per KG+Ried, 40 m, 5 decimals): **138 zones, 75 KB (18 KB gzipped)**.

## N3. Outline
- Official outline: the regulation defines the area by Gemeinden, so the Statistik Austria Gemeinden union is the legal area, not a guess. No separate DAC polygon exists [A].
- Route A, Gemeinde union (25 Gemeinden, Statistik Austria 2026-01-01, CC BY 4.0), simplified 40 m: **998.9 km2**, 1 part, **10 KB**. It includes the Austrian part of the lake and all forest, steppe and towns.
- Route B, Ried land closed at 150 m (as Wachau): **272.2 km2** (Ried land 265.4 km2).
- Official hectare figure: none fetched. Vines are about 6,000 to 6,500 ha, so 60 to 65 km2 [A: from memory, to be checked against the Burgenland vine register]. Route B is 4 to 5 times the vines, Route A about 16 times; Route B is the closer, and the Wachau used the same method.
- **Chosen: Route A** (`route: gemeinden`, `approximate: false`), because the law fixes the area by Gemeinden and the Rieden miss vine land outside any Ried (and Seewinkel steppe is in them); the Ried closing is kept as `riedenClosedKm2`. Owner's call (see below): the closer-to-vines Route B would be a one-word change in the script. The lake is not clipped.

## N4. Licences
- Land Burgenland Rieden: CC BY 4.0 (catalogue entry). Statistik Austria Gemeinden: CC BY 4.0. RIS text: as above.

## N5. Open points
1. Outline route: A (legal Gemeinde union, 999 km2, includes the lake) or B (Rieden closed, 272 km2, approximate). Recommended A for the legal area; the map could add the lake clip or use B.
2. Whether the Neusiedlersee guide needs the Rieden at all, since the DAC bans Ried names on the dry reds. 138 zones are built; the pilot can drop them.
3. Vine hectares (6,000 to 6,500 ha) and the EU single document are not fetched.
4. Not copied into `data/added-boundaries.geojson` (the card did not ask).
5. `eambrosia/`, `web/`, `wset/` (desk report folders) are left out of the manifest: their URLs are not recorded and the build needs none of them.
