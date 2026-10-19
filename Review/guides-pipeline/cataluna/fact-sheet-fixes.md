# Cataluña fact sheets: pliego corrections (19 Oct 2026)

Each correction from the pliego check, checked against the cited page with `Tools/guides/pages.py` (sources in `manifest.json`) and
applied to `content/facts/cataluna.json`, or skipped with the reason. Cites now read `<place>-pliego:p<n>`. Texts were cut to the
sheet limits (why 25 words, tastes 40, four famous styles of 15 words each). `npm test -- tests/unit`: `facts.test.ts` passes; two
`guides.test.ts` failures come from the untracked `content/guides/*.json` drafts (Terroir list, `ebro` fly target), not from this sheet.

## Empordà
- why.text: applied. Poor, light, well-drained soils carry most vines; the alluvial plain gives light, silky, fresh wines (p17, p19, p20); old-vine Garnacha (p17, p18).
- grapes.main: applied. The eight recommended grapes: Garnacha Blanca, Roja, Tinta; Cariñena Blanca, Roja, Samsó; Macabeo; Moscatel de Alejandría (p13).
- grapes.others: applied. The authorised list: Malvasía and Ull de Llebre in place of Malvasía Aromática and Tempranillo; Cariñena Blanca and Roja are now main grapes (p13).
- styles.text: applied. Rancio (as a wine and as a liqueur wine), white and black mistela and vino dulce added (p3 to p7).
- climate: applied. Mediterranean, about 600 mm, 14 to 16 °C, the Tramuntana (p14, p16).
- soil.text: applied. Hill soils (granite, slate and schist, gravel and clay) and both plain groups (marls and clays, conglomerates and sandstones) (p16, p17).
- famous Moscatel: applied. "sweet, fleshy" becomes "sweet, velvety, intense and long" (p6).
- famous Rancio entry: skipped. The sheet already holds the limit of four famous styles, and the link section singles out Garnacha, Moscatel and the mistelas, not rancio (p17, p18); rancio is now in styles.text.

## Costers del Segre
- why: applied. Swings of up to 25 °C give aromatic, structured wines; cold nights give high acidity and intense flavours (p9, p11).
- grapes.main: applied. The eight recommended grapes (p8).
- grapes.others: applied. The 30 authorised grapes as the pliego lists them: no Alarije, "Sauvignon Blanc", recommended grapes moved to main, Godello, Verdejo, Cabernet Franc and the rest added (p8).
- styles.kinds / styles.text: applied in the text (wines from overripe or raisined grapes, p4). Kinds unchanged: the pliego calls neither wine dulce, and `docs/guides.md` gives "sweet" only where the text says so.
- climate.cite: applied. Now p9.
- soil: applied. Calcareous soils covered with sand and/or clay, poor in organic matter (p9).
- tastes: applied. High acidity and intense flavours (p11).
- famous Espumoso: applied. First or second fermentation, at least 3 bar, traditional method only as history; the nine-month rule removed (p2, p11).
- famous Vino de licor: applied. White, rosado or red, 15 to 22% vol; no sweetness or colour (p3).
- famous Vino de aguja: applied. Visible carbon dioxide at 1 to 2.5 bar; fruit or floral aromas (p3, p4).

## Pla de Bages
- tastes (rosado): applied. "usually light" (p4, p5).
- tastes (tinto): applied. Violet to ochre; from light and fresh to more structured and concentrated (p5).
- tastes (blanco): applied. Pale to deep gold yellow; fruity; usually light (p4).
- famous Espumoso: applied. Fruity, sometimes ageing aromas; fresh from the carbon dioxide (p5).
- famous Vino de aguja: applied. The acidity claim removed; fresh from the carbon dioxide (p5).
- famous Vino de licor: applied. Yellow to red or tawny; fresh or ripe fruit; unctuous, long; no noble rot (p5, p6).
- grapes.main: applied. The eight recommended grapes; Sumoll moved out of "others" (p9). Others keep only Ull de Llebre, still marked partial.
- why: applied. The light wines with a good acid core now come from the climate between Mediterranean and continental with Pyrenean influence (p11).
- soil: applied. Sedimentary rocks; deep, medium-textured, well-drained soils on the Pla; high carbonates (p9, p10).
- styles.kinds fortified: applied. "fortified" stays for rancio, mistela and vino dulce natural (liqueur wines); "sweet" added for the vino naturalmente dulce, whose alcohol is all from fermentation (p3, p4).

## Alella
- grapes.main (Pansa Blanca = Xarel·lo): skipped. The page does not settle it: p13 sets Pansa Blanca, Chardonnay, Moscatel and Garnacha against "Xarel·lo y Chardonnay" in Penedès, the same grape-for-grape comparison it makes for Garnacha in Priorat, so it does not deny the synonym. The pairing stays on `alella-wiki`.
- grapes.others: applied. Garnacha Blanca and Garnacha Tinta now main grapes (p7, p12); others are the full authorised list (p7, p8), no longer partial. Moscatel was not added: p7 reads "Moscatel o Pansa blanca" as one entry and p12 names only Pansa Blanca and Garnacha Blanca as preferred whites.
- styles.kinds / styles.text: applied in the text (needle wines, p2). Kinds unchanged: `docs/guides.md` says aguja is not sparkling.
- famous Rancio: applied. "or red Garnacha" added; at least a year in oak (p1).
- climate, tastes: applied. Climate from p9; tastes from p11 to p13 (mineral, bitter-citrus finish; elegant, broad reds; more acidity inland).

## Conca de Barberà
- tastes (reds): applied. "tertiary and even toasty notes"; no vanilla (p4).
- tastes (whites): applied. "fruity and/or floral" in place of "primary aromas" (p4).
- famous Vino de aguja: applied. White, rosado or red (p4, p5).
- famous Vino de licor: applied. Rancio dry and intense; dulce natural and mistela unctuous (p5).
- styles.kinds: applied in the text (skin-macerated brisado white, p1). Kinds unchanged: the schema has no kind for it.
- grapes.main: applied. Macabeo moved to "others", which now holds the authorised list (p10); Trepat stays main, singled out as native and nearly exclusive (p13, p14).
- why.cite / grapes.cite: applied. Now p13, p14.
- climate, soil: applied. Transitional Mediterranean climate (p10, p11); three soil types (p11).

## Cava
- grapes.main: applied. Macabeo, Xarel·lo and Parellada, about 85% of the grapes (p10).
- grapes.others: applied. Malvasía (Subirat Parent) and Monastrell added (p9).
- tastes (never violet): applied. "Rosé: shades of pink" (p2); "except violet" is for the base wine (p4).
- tastes (lightly acidic): applied. Removed; it describes the base wine (p4). Finished cava is "fresh and balanced" (p2).
- famous Paraje Calificado: applied. "Mineral hints" removed; nuts and toast, structure, creaminess, acidity (p2).
- cite (all fields): applied. Every cite now cava-pliego (p1 styles, p2 tastes and famous, p9 soil and others, p10 why, climate, main grapes).

## Penedès
- famous Espumoso: applied. Fifteen months from tirage to disgorging, traditional or ancestral (p2).
- grapes.others: applied. The pliego list: Malvasía de Sitges, Subirat Parent, Sumoll Blanco, Viognier, Xarel·lo Rosado, Forcada, Marina Rión, Ull de Llebre, Samsó, Petit Verdot, Moneu, Belat; no Alarije or Malvasía Aromática (p12).
- styles.text / famous.styles: applied. Dulce de frío and Vino dulce de Malvasía de Sitges in styles.text (p1, p2, p5); the famous entry is now "Vino dulce natural", where the 240 g/l of overripe grapes belongs (p5). No separate Malvasía entry: the sheet holds the limit of four famous styles.
- soil: applied. Active lime 5 to 10%, 40 to 120 cm deep, well drained, loam and silt-loam (p14).
- why: applied. Soil, climate and human work together (p15).

## Catalunya
- cite (all fields): applied. Every cite now catalunya-pliego (p1 to p4 types and tastes, p14 and p15 grapes, p15 and p16 climate, p16 to p18 why and soil).
- why / climate.text: applied. "favours deep colours" (p16, p18); climate filled from p15, p16.
- grapes.main: applied. The 20 recommended (R) grapes (p14, p15).
- grapes.others (Alarije): applied. "Malvasía (Subirat Parent)"; no Alarije or Malvasía Riojana (p15).
- grapes.others (Tempranillo): applied. Ull de Llebre (Tempranillo) is recommended, so it is now a main grape (p15).
- grapes.others (Mazuela): applied. Samsó (Cariñena) is recommended, so it is now a main grape (p15).
- grapes.others (missing): applied. Caladoc, Mandó (Garró), Marselán and Xarel·lo Rosado added (p15).
- styles.kinds: skipped. Kinds stay white, rosé, red, fortified: `docs/guides.md` says aguja is not sparkling and vino de licor is fortified (p1 to p3 name vino, vino de aguja and vino de licor).
- soil.text: applied. Miocene calcareous soils poor in organic matter, Quaternary alluvium near rivers, silt and clay (p16, p17).
- famous Vino de licor: applied. "Warm, unctuous and long" (p4).

## Priorat
- grapes.others (names): applied. Pansal, Ull de Llebre, Picapoll Tinto (p21).
- grapes.others (Viognier): applied. Added (p21).
- styles.text (pago): applied. "single-estate vino de finca" (p1, p28).
- styles.text (liqueur list): applied. Vino de licor dulce and wines from overripe grapes, among them Vimblanc, added (p1, p2).
- styles.kinds: applied in the text: "rancio (no added spirit)" (p1). "fortified" stays for the other liqueur wines, which take wine alcohol (p1, p2).
- climate.text: applied. "Mild" removed; cold winters, dry hot summers, day-night swings, 14 to 15 °C, 400 to 500 mm (p22, p23).
- cites: applied where a pliego page confirms the row: why p22, p23; grapes p21; styles p1, p2; climate p22, p23; soil p22; tastes p4, p5.

## Tarragona
- styles.text (light): applied. "Light" removed (p22, p7).
- styles.kinds: applied. "sweet" added for Vimblanc, unfortified and very sweet (p3, p7, p23); brisado and needle wines in the text (p1, p2, p5). No kind for brisado, and aguja is not sparkling (`docs/guides.md`).
- styles.text (liqueur list): applied. Garnacha, Clásico and Vino de Misa added (p1 to p3).
- tastes: applied. "Clean, bright"; "light" for rosado only (p7).
- tastes (sparkling): applied. "fruity, lightly acidic" (p7).
- tastes / famous (Mistela, Vimblanc, Moscatel): applied. Yellow or black-brown, alcohol well integrated, Vimblanc lightly sweet; liqueur colours left out of tastes for the word limit (p7).
- famous Rancio: applied. Amber, red or tawny, old gold its typical colour; nuts, toast, spice; dry (p3, p7).
- grapes.others: applied. No Alarije; Trepat, Xarel·lo Rosado, Sumoll Blanco, Subirat Parent, Vinyater, Malvasía de Sitges added; Ull de Llebre in place of Tempranillo (p19, p20).
- why: applied. Ribera d'Ebre reds join Cariñena's body and colour with Garnacha's richness (p22).
- soil.text: applied. Low fertility, chalky crust, calcareous materials, pH 7.1 to 8.6 (p20, p21).

## Montsant
- why.text: applied. "Partly shelter", marked swings; body from the ground and Garnacha and Cariñena, depth from old vines (p11, p13).
- famous Rancio: applied. "More or less sweet"; honey added (p2).
- famous Mistela: applied. Pale yellow to amber; orange to red-violet; honey, nuts (p3).
- famous Garnacha: applied. Orange to ruby; floral, fruity, honey, nuts; sweet, balanced; no oak (p3, p4).
- famous Vimblanc: applied. From authorised grapes without skin maceration (p4).
- tastes.text: applied. Reds violet-red to brown; whites greenish to coppery yellow; the rosado description removed (p1, p2).
- styles.kinds: applied in the text (skin-fermented brisado white, p1, p2). Kinds unchanged: the schema has no kind for it.

## Terra Alta
- grapes.main (Cariñena): applied. "Samsó" with Cariñena as its usual name (p7).
- grapes.others (Parellada): applied. Parellada is a recommended grape and now main (p7, p10).
- grapes.others (Viognier, Morenillo): applied. Added (p7).
- grapes.others (Tempranillo): applied. Ull de Llebre (p7).
- famous Mistela: applied. White or black grapes, no preferred grapes; at least 140 g/l sugar (p2).
- styles.kinds (aguja): skipped. styles.text already names needle wines, and `docs/guides.md` says aguja is not sparkling, so no kind fits (p3).
- cites (all fields): applied. Every cite now terra-alta-pliego (why p11, grapes p7 and p10, styles p2, p3, p11, climate p11, soil p8 and p11, tastes p5 and p6, famous p2 and p3).

## alella
- grapes.main (Pansa Blanca = Xarel·lo): skipped. The page does not settle it: p13 sets Alella's Pansa Blanca against "la variedad Xarel·lo ... en la DOP Penedès" in the same way it sets Alella's Garnacha against Priorat's, a comparison of the same grape across DOPs (p8: "la misma variedad de uva"), not a statement that they differ.
- grapes.main (Moscatel): applied. Moscatel added; recommended whites are "Garnacha blanca, Moscatel o Pansa blanca" (p7).
- grapes.others (Tempranillo): applied. Added; authorised for reds and rosado sparkling wines (p13, p14).
- grapes.others (Sumoll Tinto): skipped. Wording: the same grape, named "Sumoll Negre" on p8 and "Sumoll tinto" on p13 and p14.
- famous Mistela: applied. The wine is filtered at a natural minimum of 12% vol before the wine spirit is added (p1).

## catalunya
- styles.kinds (aguja, fortified): skipped. The sheet already matches the page: p1 names vino, vino de aguja and vino de licor in white, rosado or red, and p2 sets vino de licor at 15 to 22% vol; `docs/guides.md` says vino de licor is fortified and aguja is not sparkling, so "fortified" stays and aguja, which has no kind, is already named in styles.text.
- tastes (red colour): skipped. Wording: the page's "cereza intenso con ribete violáceo al rubí tenue con ribete ocre" is cherry to pale ruby; the rim colours add detail but do not make the sheet wrong (p4).
- grapes.others (Mandó / Garró, Marselán, Xarel·lo rosado): skipped. The page does not settle it: p14 says the wines are made "exclusivamente" from the varieties listed, and p15 lists all three among them, so they are allowed; "others" means also allowed, not marked (A), and the sheet makes no (A) claim. The missing marks and the undefined (T) (p14 classes Xarel·lo rosado as a red grape) leave nothing to change.

## conca-de-barbera
- grapes.others (Chenin Blanc): skipped. Wording: p10 lists "Chenin", the same grape the sheet names Chenin Blanc.
- soil.text (licorella): applied. "Slate soils with abundant «licorella»" in the southeast, as the page puts it, no longer equating the two (p11).
- famous.cite: applied. conca-de-barbera-doc:p1 removed; the vino de licor, espumoso and aguja descriptions are all on the pliego (p4, p5).
- styles.kinds (espumoso, aguja, brisado): skipped. p1 does list vino espumoso de calidad and vino de aguja as separate products and brisado under vino, but styles.text already names sparkling wines, needle wines and brisado whites; `docs/guides.md` says aguja is not sparkling and the schema has no kind for aguja or brisado, so "sparkling" (for the espumoso) stays and no kind changes.

## costers-del-segre
- why.text (25 °C swing): applied. p9 gives the 25 ºC differential as "estacional y diurno", especially at ripening; the line now reads "Seasonal and day-night swings of up to 25 °C, strongest at ripening" (p9).
- climate.text: applied. p9 says "clima continental seco" with an "elevado diferencial térmico ... estacional y diurno"; now "Dry continental climate with a wide temperature range, both seasonal and between day and night" (p9).
- styles.kinds (aguja, sobremaduradas, pasificadas): skipped. p3-p4 do list them, and styles.text already names needle wines and wines from overripe or raisined grapes; `docs/guides.md` says aguja is not sparkling, the schema has no kind for aguja, and p4 gives no dulce wording or sweet residual sugar level (272 g/l is the natural sugar alternative for pasificadas), so "sweet" is not settled and no kind changes.
- grapes.main (Xarel·lo vs Xarelo): skipped. Spelling only: p8 writes "Xarelo", the same grape every Cataluña sheet names Xarel·lo.
- grapes.others (Picapoll Blanco): applied. p8 lists "Picapoll Blanc"; the sheet now uses the page's name (p8).

## montsant
- grapes.cite / grapes.othersCite / climate.cite / soil.cite: applied. montsant-doc:p7 replaced with the pliego: the varieties are listed on montsant-pliego:p10, climate and soils on montsant-pliego:p11.
- why.text (marked swings, rugged ground give body): skipped. Wording: p11 gives a "contraste bastante acusado" at ripening and says terrain and grapes "contribuyen a dibujar vinos con mucho cuerpo"; "marked" and "give body" carry the same facts, only a softer degree.
- climate.text (cold winters, strong day-night contrast): skipped. Wording: p11 says "En general, los inviernos son fríos" and "contraste bastante acusado"; the sheet states the same facts without the hedges (its cite now points to p11).
- famous.styles (vino dulce natural): skipped. The page settles it (p1 lists dulce natural among the vinos de licor, p4 describes it, p17 lists it as a mención tradicional), but the schema allows at most 4 famous styles and the sheet already has 4; which to drop is the owner's call. styles.text already names vino dulce natural (p1).

## pla-de-bages
- why.text: applied. p11 ties the light wines with "un buen núcleo ácido" to "esta climatología" (midway between Mediterranean and continental), while the Pyrenean influence marks white aromas with "la parte más fresca" of each variety; the herbs are "hierbas aromáticas" (not wild), naming "el romero, el espliego, el tomillo", so lavender is added and "wild" dropped; the line is kept within the 25-word why limit (p11).
- climate.text: applied. p11 says altitude "es un aspecto favorecedor" and that distance from the sea and the "barrera prelitoral" put the climate "a medio camino" between Mediterranean and inland continental, and it is that climate that gives "vinos ligeros, marcados por un buen núcleo ácido"; cite moved from pla-de-bages-doc:p6 to pla-de-bages-pliego:p11.
- styles.cite: applied. pla-de-bages-doc:p6 removed; p1-p4 define every style listed (blanco incl. brisado, rosado, tinto, aguja, espumoso de calidad, rancio, mistela, vino dulce natural, vino naturalmente dulce). "(a long local tradition)" after sparkling wines was dropped with it, as p1-p4 do not say it.
