# Mediterranean guides (19 Oct 2026)

- Shipped (`claude/guides-mediterranean`): seven guides from current pliegos: Valencia, Utiel-Requena, Alicante, Los Balagueses, Yecla,
  Jumilla, Bullas. Also the Guides-page tile `public/guides/mediterranean.webp` (96 KB, view -1.00,38.78,7.6, Pillow WebP q72), the
  roster in `tests/unit/guides.test.ts`, and `tests/ui/guide.spec.ts` switched its "no guide" place from Jumilla/Navarra to La Mancha.
  The `content/tiles.json` Mediterranean lede now says "limy" (not "chalky") and cites yecla-pliego:p4 and bullas-pliego:p6.
- Sources (`Review/sources/fetched/`, rows in `data/SOURCES.md`): pliegos for Valencia (A0872, control-de-cambios text with struck words
  removed by `Tools/guides/unstrike.py`), Utiel-Requena (A0874), Alicante (A1526), Los Balagueses (A0941), Yecla (A0606, revisión 23,
  Mar 2023), Jumilla (A0109), Bullas (A0536, revisión 3 of July 2019, carm.es file misnamed "Octubre 2014"), Tharsys (02086, application
  text). EU amendments as `<id>-doc2`: Valencia C/2024/7448, Utiel-Requena OJ C 280 of 9.8.2023, Alicante C/2024/4680, Los Balagueses
  C/2025/510, Yecla C/2024/3268 (adds Viognier, cited as yecla-doc2), Jumilla C/2025/3208 (drops «Pie franco»; not used in the guide).
- Host note: Jumilla's pliego comes from the Consejo Regulador (jumilla.wine) because mapa.gob.es refuses; as with Ebro's INTIA copy, the
  host is the regulator, not a ministry. Valencia's pending espumoso amendment (eAmbrosia, in progress) is not used.
- Pipeline: `Review/guides-pipeline/mediterranean/` (manifest, extracts). Guide validation: 7 guides, 0 errors; number warnings
  (19, 16, 1970 etc.) are for the sentence check, as before.

## Held for the owner (open)
- **Tharsys**: guide drafted, held in `Review/guides-pipeline/mediterranean/held/tharsys.json`. Its pliego is the EU application text
  ("en tramitación"); eAmbrosia lists PDO-ES-02086 as applied, and OJ C/2025/3093 publishes it under PDO-ES-02980
  (`oj-PDO-ES-02980-C-2025-3093-tharsys.txt`). places.json uses 02086. Recommend: hold until registration.
- **El Terrerazo**: guide drafted, held in `.../held/el-terrerazo.json`. No pliego (portalagrari 404, MAPA refused); only the thin 2014
  EU technical sheet. `docs/guides.md` requires a pliego; the pagos exception covers only the four Navarra pagos. BOE-A-2011-20342
  (2010 recognition resolution) is reachable as a fallback. Needs an owner OK or a GitHub Actions fetch from mapa.gob.es.
- **Chozas Carrascal, Vera de Estenas**: not written. No pliego (portalagrari 404, MAPA refused); EU single documents only (OJ C 35,
  3.2.2020; OJ C 235, 12.7.2019). Same decision as El Terrerazo.

## Fact sheets (`content/facts/mediterranean.json`)
Sure edits applied (38): valencia 5, utiel-requena 4, alicante 2, los-balagueses 3, yecla 5, jumilla 7, bullas 5, vera-de-estenas 3,
el-terrerazo 4. Grape lists moved to `main` use `{local}` objects; sibling cites moved to the pliego pages. Three texts were shortened to
the word limits (valencia why, utiel-requena and jumilla Vino de licor). Most other rows still cite the old `-doc` attachments.

UNSURE, left for the owner:
- valencia: climate "wide day-night range" (p6 says only "amplitud térmica considerable"); espumoso aromático colour (pliego
  contradicts itself, p2/p3/p4); styles.text omits Petit Valencia (p2, p7, p9) and calls liqueur wines just "(Moscatel)"; valencia-doc
  page cites (p1-p13) unchecked; grapes.main empty (only Moscatel de Alejandría is singled out, p7).
- utiel-requena: climate "ripen fully ... harvested very late" not in the pliego (p6, p9); all utiel-requena-doc cites unchecked;
  styles.kinds has no vino de aguja (p2) or low-alcohol entry.
- alicante: Fondillón "slightly sweet", Vino noble "orange rims", why "fresher and subtler than inland", climate "drier and milder",
  soil "hard"/"rich", tastes "structured": none backed by the pliego; grapes.others misses Subirat Parent (main) and Cabernet Franc,
  Viognier, Verdejo, Garnacha blanca, Moscatel de grano menudo (p6); styles.text misses Vino Noble and the aromatic sparkling (p1-p2).
- los-balagueses: Tempranillo synonyms not in the pliego (p3); los-balagueses-doc cites unchecked; "helps ripening" kept (p4 close).
- tharsys: source status (above); sheet cites tharsys-doc, pack used tharsys-pliego; main/others split is a choice; no sure errors.
- yecla: rosé colour (p2: pale salmon to pink); reds "high extract", "fleshy" and why "fleshy" not in the pliego; espumoso rosé tints
  broader on p2; winters "very cold" vs "bastante crudos" (p4).
- jumilla: grapes.others misses Pedro Ximénez, Merseguera, Viognier and uses "Malvasía Aromática"/"Garnacha Tinta" (p4 names differ);
  grapes and why cites still on jumilla-doc (pliego p4, p7); styles.text omits blanc de noirs (p4).
- bullas: "dry whites" and whites "dry and clean" (p1, p2); climate could say "Mediterráneo continentalizado" (p4, p6); rainfall 365 mm
  (town, p5) vs 300 l/m2 (zone, p9); remap remaining bullas-doc cites to bullas-pliego pages?
- chozas-carrascal: grapes could move to main (p3 «Principales uvas»); multivarietal rules cover all reds (p2); rosado also «dulce» as a
  taste word (p2); `Review/fact-sheets-30-source-check.md` wrongly says there is no causal link (p3-p5 has one).
- vera-de-estenas: red yield 7 950 (p4) vs 7 850 kg/ha (p6), not on the sheet; "four ageing grades" counts madurado en barrica.
- el-terrerazo: "desnivel de apenas 1,5 km" likely a typo (p3); styles "Red wine only" not literal; p3 colour/acidity and soil/finesse
  links not on the sheet.

## Where
PR on `claude/guides-mediterranean`; release 49 note `Review/release-49-what-to-test.md` (release 48 note archived).
