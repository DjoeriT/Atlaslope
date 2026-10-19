# Fact sheets for the 30 places outside Study: source check (ReviewBot, Opus, 18-19 Oct 2026)

Each Sonnet draft was checked sentence by sentence against its official text; every one needed fixes. The parts below are the checkers' reports, in order.

---

## Fact-sheet source check (ReviewBot, 18 Oct 2026)

Scope: 19 drafts in scratchpad/drafts, checked sentence by sentence against the extract and, where cut, the full document in Review/sources/fetched. Corrected sheets in scratchpad/checked/<id>.json (drafts untouched).
Page rule used: in the 2014 'FICHA TÉCNICA N /M' documents the marker is a page header (top); in the 'Generado ... N/M' documents it is a footer (bottom). Both confirmed in the full files.
Common fix: the template says why is ONE sentence; most drafts had two. Rewritten to one, keeping only what the document gives as a cause.

## cava: fixed
- why: two sentences -> one. Sources: «temperaturas altas ... permiten una buena maduración» p6; «en torno a los 13/15ºC» p7.
- famous Paraje Calificado: 'fresh' was not in the text; the cut line reads «perfecto equilibrio en su estructura, cremosidad y acidez» (full doc l.158, p4).
- Note: Xarel·lo keeps the Catalan middle dot; the document has XARELLO (upper case). Accepted, noted.

## catalunya: fixed (owner may overrule kinds)
- kinds: 'sparkling' removed. Vino de aguja is EU category 8 («8. Vino de aguja», p1), «ligero cosquilleo», semi-sparkling, not espumoso. Calling it sparkling in a kinds filter misleads a learner; text and famous row still say "lightly sparkling".
- why: grape-range sentence dropped (not about taste); «La fuerte insolación ... colores profundos ... especialmente los negros» p6.
- grapes: all 35 checked, document order, CHENINI -> Chenin Blanc noted by writer. Pass.

## islas-canarias: fixed (owner may overrule kinds)
- kinds: 'sweet' removed. «Vinos de uvas sobremaduras»: «aspecto untuoso ... recuerdos a pasas» p3; no 'dulce' and no sugar figure anywhere in the document (searched). Sweet is inference.
- famous aguja: «burbuja evidente» = visible (not clear) bubbles; «neta picor» = clean/clear prickle (not sharp). p4.
- why one sentence: «cultivado a pie franco por la ausencia de filoxera» p7. Climate list split. 'picota red' -> 'cherry red (picota)'.
- grapes: 15 + 16, order and spelling match (pp6, 10-11). Pass.

## ayles: fixed
- tastes: said oak adds toast and smoke to young/barrel reds; the document gives that to crianza only: «Los vinos con madera tienen aromas de frutos rojos y los de crianza, con tostados y ahumados» p1.
- why and soil: four-item lists split. «ricos en carbonato cálcico ... arcilla inferior al 45%» p4.

## arinzano: fixed, owner question
- why one sentence: «veranos secos y calurosos y un gran diferencial térmico noche/día ... lenta pero buena maduración» p4.
- Owner/LeadBot: Review/sources/fetched holds two 2026 Official Journal amendments (C/2026/771, C/2026/4824); this sheet follows the 2014 document. Which text is current needs a decision.

## otazu: fixed, owner question
- why wrong cause: draft credited the Mediterranean climate with the long cycle. Document: «la incidencia de la influencia atlántica y su ubicación en fondo de valle la longitud de ciclo que aportará acidez, color y equilibrio» p3.
- soil: seven-item list split. Same 2026 amendment question (C/2026/3580).

## prado-de-irache: fixed
- why, soil, tastes: lists of three or more split. Aged colour from full doc l.34: «desde rojo granate a rojo rubí-teja» p1. Grape pages confirmed (p3 principal, p6 secondary).

## el-terrerazo: fixed
- why one sentence: «iluminado por el sol ... altitud del paraje de 870 metros ... maduración muy lenta» p3. Soil fragment list rewritten. Grapes p3/p6 confirmed.

## los-balagueses: fixed
- why: 'full sun' overstated; «optimiza la exposición de la planta al sol» p4. Grapes p4/p7 confirmed.

## calzadilla: fixed (blocker found)
- grapes: secondary list missing. Full doc p7: «5. UVAS DE VINIFICACIÓN SECUNDARIAS / CABERNET SAUVIGNON / SYRAH». Added. Synonym line bracketed.
- why and climate credited altitude/slope; the document: «El suelo altamente alcalino y la zona fresca hacen que la uva madure lenta y homogéneamente» p3.
- altitude: 'often' -> 'sometimes' («en ocasiones, en pendientes pronunciadas» p3).

## campo-de-la-guardia: fixed (blocker found)
- grapes: secondary list missing: «MALBEC / PETIT VERDOT» p8. Added. Synonym line bracketed.
- why: plateau was not a cause; «Los suelos muy salinos, alto nivel en potasio y baja humedad relativa provoca un menor engorde de las uvas» p5. Cite now p5 only.

## casa-del-blanco: fixed (blocker found)
- grapes: secondary list missing: «CABERNET FRANC / CHARDONNAY / MALBEC / SAUVIGNON BLANCO» p8. Added. Synonym line bracketed.
- why: plateau dropped; «concentración de iones Litio es de hasta 10 veces superior» p1. White taste line verified in full doc l.60-62 («ribetes dorados»).

## Corrected sheets (19 Oct 2026)
Script-checked: JSON parses, keys sheet/source/notes, all word limits, why one sentence (tools/val.py).
- cava: written, checked/cava.json
- catalunya: written, checked/catalunya.json
- islas-canarias: written, checked/islas-canarias.json
- ayles: written, checked/ayles.json
- arinzano: written, checked/arinzano.json
- otazu: written, checked/otazu.json
- prado-de-irache: written, checked/prado-de-irache.json
- el-terrerazo: written, checked/el-terrerazo.json
- los-balagueses: written, checked/los-balagueses.json
- calzadilla: written, checked/calzadilla.json
- campo-de-la-guardia: written, checked/campo-de-la-guardia.json
- casa-del-blanco: written, checked/casa-del-blanco.json
- Kinds decided by the document: catalunya drops 'sparkling' (categories 1, 3, 8: no vino espumoso). islas-canarias KEEPS 'sweet' under the caller's rule because category «3. Vino de licor» p1 says licor; no dulce/semidulce or sweet sugar level in the document. Owner may overrule.

---

## Fact-sheet source check, batch 2 (ReviewBot, 19 Oct 2026)

Scope: 7 drafts (dehesa-del-carrizal, dominio-de-valdepusa, finca-elez, guijoso, pago-florentino, rosalejo, vallegarcia). In progress.

Verdict: 7 of 7 fixed (none pass unchanged). Severity: 6 should fix (missing secondary grapes x3, wrong kind 'sweet', wrong cause in why x2), rest notes (lists split, wording).
Page rule: 'FICHA TÉCNICA N /M' is a page header (A0053, A0054, A0057, A0058); 'Generado ... N/4' is a footer (A0052). All cites re-checked against line positions in the full files. OJ notices (Rosalejo, Vallegarcía) have no pages; bare source ids kept.
Validation (script): all JSON loads; every row within its word limit; why is one sentence in all 7.

## dehesa-del-carrizal: fixed
- why: three-item cause list; rewritten to the document's link: «orientación en ladera a norte ... umbría ... a primeras horas de la tarde» p7, «composición silícea y su carácter ácido, producen un vino casi de carácter atlántico» p8, «ausencia de notas cálidas» p7.
- styles: 'aged 3 to 24 months in barrel' was applied to all reds; only the blends carry it: «Tinto (envejecimiento de 3 a 12 meses)» / «de 12 a 24 meses» p3. Barrel not stated for them; dropped.
- climate: «estancamiento de nieblas» p7 = fog lingers, not 'brings fog'.
- famous Syrah/Petit Verdot: 'plum-dark' wrong; «Rojo picota» / «Rojo picota oscuro» p3 = cherry red (picota). Chardonnay 'creamy' -> «untuoso, casi graso» p4 (almost oily). Lists split.
- grapes: no secondary list in this 2013 form (searched); order matches p6.

## dominio-de-valdepusa: fixed, LeadBot to confirm
- why: draft credited the climate; the document credits soil only: «La arcilla ... aporta poder, complejidad e intensidad ... el subsuelo de pura caliza confiere elegancia ... textura aterciopelada a sus taninos» p4.
- grapes: Merlot added: «la escasa producción de merlot se elabora con el syrah» and Merlot yields, p2. AM02 contains a full «II. DOCUMENTO ÚNICO», so othersPartial removed. If the owner prefers the four-grape list only, revert both.
- tastes: lists split (p1 nose, p2 palate; footer 1/4 sits between them, confirmed).
- source title/url/date match the header (2016-11-29, «Ref. Ares(2016)6675187 - 29/11/2016»).

## finca-elez: fixed
- kinds: 'sweet' removed. Late harvest: «aromas frutales, dulces y de crianza» p2, «equilibrio entre acidez y azúcar» p2-3; no 'dulce' wine and no sugar figure in the full document (searched). Famous text now says sweet notes on the nose only.
- grapes: secondary list missing: «5. UVAS DE VINIFICACIÓN SECUNDARIAS / MERLOT» p9, «SYRAH» p10 (after header 10/10). Added. Synonyms bracketed: «TEMPRANILLO, CENCIBEL, TINTO DE TORO» p6.
- why: three-item list and 'balanced, fresh wines that age well' trimmed: «buena acidez ... mejor adaptados para el envejecimiento» p6.
- styles: three-type list split. soil: four-adjective list split («arcillo-calcáreos, pobres, pedregosos y bien drenados» p6).
- tastes: garnet and tile only «con más crianza» p2; draft gave them to all aged reds.
- famous: name 'Barrel-fermented' -> 'Partly barrel-fermented' («Parcialmente Fermentado en Barrica» p2). Gran Reserva four-item list split; «sin ser agresiva» p3.

## guijoso: fixed
- grapes: secondary list missing: «SAUVIGNON BLANCO / TEMPRANILLO, CENCIBEL, TINTO DE TORO» p7 (before header 8/8). Added, synonyms bracketed.
- why: wind, cold and soil were given as causes; the document gives only slow development: «alta concentración de sustancias que se dan gracias al lento desarrollo de las uvas» p4.
- styles: 'ripe-fruit' belongs to the red; white is «frutas amarillas ... cítricos (pomelo)» p1.
- tastes: four-item bracket list cut to two examples; «Final largo con cierto amargor» p2.

## pago-florentino: fixed
- main Tempranillo kept: «Vino tinto que procede al menos del 90% de la variedad tempranillo» p1; it is the only principal grape (p3).
- grapes: secondary list missing: «PETIT VERDOT» p6, «SYRAH» p7. Added.
- why: 'fresh, very ripe fruit' merged two effects; document: «La orientación y la influencia de las lagunas produce unos aromas a fruta muy madura y una sensación de frescura en boca» p3.
- climate: 'lagoons add freshness' is a wine effect, not climate; replaced with «ubicada en solana», early ripening and «quince días antes» p3.
- tastes: lists split.

## rosalejo: fixed (minor)
- source date 2023-11-21 confirmed («21.11.2023» in the HTML); url and title match the header.
- styles: «los vinos Rosalejo sólo son secos ... máximo de 3 g/l» -> 'Dry reds only'.
- climate: 'milder than expected' not in text; «más templado, tanto en invierno como en verano» from Atlantic influence, altitude and the Cijara reservoir. Rain «650 litros anuales».
- soil: two three-item lists split; «uno de los suelos ... más antiguos de Europa», «pedregosidad del 50 %», «pH ácido, por debajo de 6».
- why, altitude, tastes, grapes: pass.

## vallegarcia: fixed
- why: wrong cause and three-item list. Tannins come from «La gran amplitud térmica ... unida a la elevada pluviometría ... favorece que la uva posea una estructura tánica sobresaliente» (link c); the river microclimate is credited with ripening, not tannin.
- styles: 'A white and a red' -> 'Whites and reds'.
- tastes: five-item lists split; «tanino ligeramente marcado» added for the red.
- soil, climate, grapes, source: pass.

---

## REPORT-3: source check (abadia-retuerta, dehesa-penalba, uruena, el-vicario, la-jaraba)

Scope: 5 drafts (abadia-retuerta, dehesa-penalba, uruena, el-vicario, la-jaraba). Official Journal texts have no pages: bare ids. Checked against the full fetched texts (HTML stripped to text with python -I).

## abadia-retuerta: fixed (amendment applied)
- Amendment PDO-ES-02481 (OJ C 4/12, 6.1.2023, oj-PDO-ES-02481-C_4_6_1_2023.html) is the current single document. It changes only section 4 (tasting); grapes (section 7), practices and link (8.5, «El clima extremo y la oscilación térmica acusada día noche, permiten una lenta y precisa maduración») are the same. Added source `abadia-retuerta-doc2` (EUR-Lex URL from ea-PDO-ES-02481.json, date 2023-01-06).
- tastes: rewritten to the amended text, cite doc2: «color pajizo-paja amarillo, amarillo verdoso o dorado», «frutas de hueso y/o árbol y/o tropical y/o cítricos»; reds «capa de intensidad media o alta, con tonalidad desde rojo violáceo a rojo teja», «en el caso de envejecimiento en madera, balsámicas y/o especiadas y/o tostados», «estructura y persistencia media a alta». Draft had the 2021 wording (ruby, «gran estructura»), now superseded.
- climate: three-part list split. Quotes: «marcado carácter continental, con influencia de la nubosidad del Atlántico, y pluviometría moderada, con veranos secos», «490 mm al año», «42 o C y mínimas absolutas de -20 o C».
- soil: three-adjective list split: «de alcalinidad débil, bajos niveles de materia orgánica, de textura arenosa a franco arcillosa»; «cobertura arenosa a menudo «oculta» suelos de una enorme diversidad».
- altitude: draft put the terrace at 725 m; the document gives 725 m for the river: «la humedad del río Duero situado en una cota de 725 m», plateaus «(880 m)». Reworded.
- why kept (one sentence, matches 8.5). Grapes: no secondary list in either text; main [] (form heading only). Synonyms: none given.

## dehesa-penalba: fixed
- climate: «buena ventilación (oeste-este)» is good airflow, not 'steady'; three-item list split. «12 °C de media anual», «206 días (las zonas circundantes están por debajo de 200 días)».
- styles: multivarietal ageing is in «barricas de roble 225 l y/o 500 l y/o tinas de madera de 5 000 l», so 'in oak' -> 'in wood'.
- why: kept in substance, reworded to the document's cause: «terreno caliente y pobre, con alto nivel de arenas y elementos gruesos, cantos y gravas ... reflexión de la radiación solar, permite que se vea favorecida la maduración de la uva y ... la pigmentación de los hollejos ... antocianos totales y taninos»; shelter: «protegidos por dos formaciones en páramo ... efecto amortiguador».
- main Tempranillo confirmed: «Tempranillo: la variedad más importante del viñedo». Others order follows the list (Cabernet Sauvignon, Merlot, Syrah).
- tastes: draft came from 8.x («color sostenido ... tonalidad rojo-azulada ... tanino dulce y longevo ... cuerpo medio-alto»), not section 4; kept (official, accurate), note only.
- famous: confirmed («Maceración prefermentativa en frío», «depósitos de acero inoxidable», «mínima de 21 días»; «barricas de roble de 225 l durante mínimo de 12 a 24 meses»; «6 a 24 meses»).

## uruena: fixed (amendment applied)
- Amendment PDO-ES-02485-AM01 is OJ C 208/11 of 24.5.2022 (file title C_2022208ES.01001101; eAmbrosia link ...C_.2022.208.01.0011...), not 'C 208/24' as the draft notes say. It carries a full new single document; applied, added `uruena-doc2`.
- grapes: main Tempranillo removed. The document says «En Pago de Urueña, las variedades Syrah, Cabernet Sauvignon y Merlot suponen un 75 % de la superficie total», so Tempranillo is at most 25%; «variedad predominante en la zona» can only mean the wider area (next sentence: Ribera, Toro, Cigales «prácticamente un monocultivo de la variedad Tempranillo»). Syrah kept as main: «la variedad Syrah que es la variedad con mayor superficie». Synonym bracketed: «TEMPRANILLO - TINTA DEL PAIS» -> Tempranillo (Tinta del País). LeadBot to confirm (judgement call).
- styles/famous: AM01 «Eliminación del calificativo «envejecido» del vino tinto»: famous 'Vino tinto envejecido' -> 'Vino Tinto' with «maceración pre-fermentativa por debajo de 10 ° durante, al menos, 24 horas». Rosé colour now «de piel de cebolla a rosa frambuesa». 'Roble' entry dropped: a label mention («podrán hacer uso de las menciones «ENVEJECIDO EN ROBLE» o «ROBLE»»), not a wine the document defines.
- tastes: rewritten to the amended section 4 («de rojo púrpura a rojo teja», «cuando hayan sido envejecidas en madera, especiados y/o balsámicos», «cuerpo y persistencia media-alta»); 'picota' and 'garnet' are not in the current text (0 hits).
- climate: four-item list split; «Semiárido tipo mediterráneo», «total unos 410 mm», «11,4 grados», «2 650 horas», «4 meses secos (junio-septiembre)».
- why, soil, altitude confirmed in the 2022 text («suelos de media-baja fertilidad ... buena capacidad de drenaje dan lugar a vinos ricos en extracto y en antocianos»; «franco-arcillo-arenosa»; «material original es pedregoso»; «Alfisoles ... e Inceptisoles»; «entre los 710 y los 720 m»).

## el-vicario: fixed
- Pages: form feeds in pliego-PDO-ES-N1634-el-vicario.txt (15), consistent with the extract headings (area p6, grapes p10).
- tastes: cite p2 removed (p2 holds only the sweet-red analysis table); descriptions are p3-p4. Three-item lists cut: «Amarillo limón a oro», «Cítrica y frutal, recordando a la fruta tropical» p3; «rosa frambuesa vivo», «caramelo de cerezas o fresas» p3; «Color rojo cereza», «destaca la fruta ... aromas balsámicos» p3; sweet «higos, orejones y mermeladas» p4.
- styles: list split. «Vino blanco, blanco de uvas tintas, rosado y tinto» p1; «Vino rosado elaborado con uva tinta de la variedad Petit verdot» p4; «Vino blanco semidulce» p4; «Vino tinto dulce monovarietal ... Merlot» p6.
- famous 'Tinto coupage autóctonas con foráneas': draft said the blend gets 3 months in oak; only part does: «durante un mínimo de 3 meses, de un mínimo de un 30% del vino total. El resto permanece en depósito» p5. Fixed.
- famous 'Blanco de uvas tintas': 'without maceration' is said of the Garnacha/Tempranillo share in the barrel-fermented white (p4 «elaborados sin maceración (“blanc de noir”)»), not of this wine; its text is only «Vino blanco elaborado con uvas tintas ... depósitos de acero inoxidable ... entre 11ºC y 20ºC» p4. Fixed.
- why, climate, soil confirmed: «mesoclima más suave, limitando las situaciones climáticas extremas» p11; «suelos calizos de textura ligera y bien drenados, de fertilidad media» p11; «Superan de media los 15 meq/100g (>3000 ppm)» p12; «sensaciones de vegetación de monte bajo» p12; «finura ... equilibrio» p12. Grapes order matches «Blancas: Chardonnay y Sauvignon Blanc. Tintas: Tempranillo, Garnacha tinta, Graciano, Syrah, Cabernet Sauvignon, Merlot, Petit verdot» p10; no principal grape. Kinds incl. sweet confirmed («semidulces», «Azúcares totales ≥ 45» p1-2).

## la-jaraba: fixed
- why: reworded, same cause: «depresión fluvial, rellena de sedimento ... nivel de estroncio en suelos superiores a la media habitual, contribuye a producir unos vinos intensos, con marcadas notas minerales».
- soil: five-part list split; «alfisoles, con suelos rojos mediterráneos sobre material calizo», «texturas de franco arenosas a arcillosas», «rico en guijarros gruesos de aluvión».
- tastes: three-item lists cut: «rojo picota madura», «frutos rojos y fruta negra», «amplios y carnosos»; white «amarillo pajizo», «fruta blanca de hueso, toques florales», «Fresco, sedoso y equilibrado».
- famous 'Tinto de ensamblaje': draft gave fixed 3 and 1 months and dropped the Graciano variant; document: «Tempranillo, Cabernet Sauvignon, Merlot y Graciano» or «... y Merlot», «no inferior a 3 meses y en botella durante un mínimo de 1 meses». Now 'at least'.
- grapes confirmed: pliego section 6 in the amendment «Tintas: tempranillo, cabernet sauvignon, merlot, graciano. Blancas: Sauvignon Blanc»; synonym from SD 7 «TEMPRANILLO — CENCIBEL». No newer amendment in fetched/ (only 2019 and this 2021 text). Climate, altitude confirmed («14 o y 16 o C», «450 mm», «viento cálido y seco de Levante», «700 metros»).

## Summary
Verdict: 5 of 5 fixed (none pass unchanged). Severity: 6 should fix (Urueña amendment not applied and main grape Tempranillo contradicted by the 75% figure; Abadía amendment tasting text not applied; El Vicario coupage oak share overstated; El Vicario 'without maceration' on the wrong wine; La Jaraba blend ageing given as fixed), rest notes (lists split, 'steady' airflow, 'oak' vs wood, altitude 725 m is the river, wrong OJ page C 208/24 -> 208/11 in a note, tastes cite p2).
Tiles: abadia-retuerta "Wide day-night swing, slow ripening"; dehesa-penalba "Warm sandy soil deepens colour and tannin"; uruena "Poor, free-draining soil, rich in colour"; el-vicario "Calcium-rich lime soil, a milder climate"; la-jaraba "Strontium-rich soil, a mineral note".
Validation (script tools/fix3.py): all 5 JSON load; every row within its limit; famous ≤4 and ≤15 words; tile ≤7; why one sentence; every cited id has a source entry.
Open for LeadBot: Urueña main = Syrah only (judgement); doc2 URLs are the EUR-Lex links listed in ea-PDO-ES-02481.json / ea-PDO-ES-02485.json (no cellar URL in the fetched HTML).

---

## REPORT-4: Opus source check (los-cerrillos, rio-negro, bolandin, chozas-carrascal, tharsys)

**Verdict: all five corrected and written to `checked/<id>.json`. One open item: Bolandin's 2026 publication was not fetched.**
Counts: blocker 1 (Bolandin's later publication is unread), should fix 14 (fixed in the checked files), note 3.
Validation (ran, one script `tools/fix4.py`): all JSON loads; every row is within its word limit; famous ≤4 and ≤15 words each; why is one sentence; tile ≤7 words.
OJ texts have no pages, so the cites are the bare `<id>-doc` (correct as drafted). Source entries (url, date, title) match the extract headers for all five.

## los-cerrillos (PDO-ES-02228, OJ C 65, 25.2.2021, AM01 text). Verdict: fixed
- Register: no amendment after AM01, so the text is current (read, ea-search).
- styles: "from 30 days to 24 months" read as a range. They are minimums: «al menos 30 días en barrica», «al menos durante 24 meses». Now "minimum barrel time runs from 30 days to 24 months".
- famous Familia: «Ha envejecido al menos durante 24 meses en barrica»: added "at least".
- soil: «una mezcla de arcilla y caliza sin consolidar»: "unconsolidated mix of clay and limestone" (the draft had "loose limestone").
- climate: «soliendo sobrepasar las 2 500 horas» = usually over. The list of four is split into short sentences.
- why: «compuestos fenólicos» = phenolic compounds (the draft had "colour compounds"). It is still one sentence and keeps the document's cause («rodeado de cerros que hacen que sea una zona fresca»).
- tastes: «fruta con fragancias florales» = fruit with floral scents; «carnoso ... cremosos matices de crianza» = fleshy, creamy oak notes.
- Tile: "Ringed by hills, a cool riverside site".

## rio-negro (PDO-ES-03003, OJ C/2024/7000). Verdict: fixed
- Register: C/2024/7000, then registration L 2025/522. No later amendment.
- styles and famous: ageing times are minimums («Envejecimiento mínimo de 11 meses ... mínimo en botella de 6 meses»; «un mínimo de 3 meses y al menos 1 mes más en botella»): now written as "11+", "6+", "3+" and "1+".
- tastes: «Amarillo pajizo» is straw yellow, not "pale straw".
- soil: «enmiendas calizas periódicas que compensen parcialmente»: liming "partly" offsets the acidity. The list is split.
- climate: "More rain than the neighbours" was an inferred comparison. It is replaced by what the document gives: «las tormentas que se producen a partir de la segunda quincena de agosto, también contribuyen a refrescar».
- Main [] agreed: Tinto Fragoso is «endémica», but the document does not single it out as the base of the wines.
- Tile: "High plateau, slow ripening, acidity kept".

## bolandin (PDO-ES-N1876, OJ C 504, 14.12.2021). Verdict: fixed, with one blocker open
- BLOCKER (open): the register lists a later publication, **OJ C/2026/713 (30.1.2026)**. It is not in `fetched/` (the manifest shows status 202 and 0 bytes). EUR-Lex returned 202 to me again (ran, 19 Oct 2026). It may change grapes, styles or the link, so fetch it from a host EUR-Lex answers and re-check before publishing.
- why: «Tintos de mayor color y mayor índice de polifenoles totales» is said of reds, so the line now says "reds" (the draft had "wines").
- sweet kept: the table «BLANCOS DE VENDIMIA TARDÍA O UVAS SOBREMADURADAS ... AZUCARES TOTALES (g/l): ≥ 45 ≥ 60». 60 is Bolandin's figure and 45 is the Navarra PDO's. The draft note's «dulzor» is a sensation from high alcohol, so I removed it as evidence.
- climate and soil: the lists are split. The climate type is shortened to "Extreme continental" for length.
- Tile: "Hot south slope, deep-coloured reds".

## chozas-carrascal (PDO-ES-N1637, OJ C 35, 3.2.2020). Verdict: fixed (lists only)
- Register: no amendment after L 148 (11.5.2020).
- Practices confirmed in the full source: «mínimo de 14 días», «mínimo de cinco meses», «mínimo de tres semanas en barricas de roble».
- styles: now in rows (Reds / White / Rosado).
- soil: the list of four is split: "Alkaline loam (pH 8 to 9), about 1% organic matter. Active limestone 7 to 21%. Limestone layer at 30 cm."
- Note: the document has no causal-link paragraph, so the why line is a plain statement from «uno de los parajes más fríos de toda la comarca por su altura, 720 m».
- Tile: "Height and north winds keep it cold".

## tharsys (single document PDO-ES-02980, OJ C/2025/3093). Verdict: fixed
- Register (read, `ea-search-PDO-ES-02086.json`): the EU register now uses **PDO-ES-02980**. It is status "registered", protected from 27.7.2023, registered by OJ L 2025/1994 (2.10.2025). PDO-ES-02086 is "applied" with removedFlag true. `data/places.json:2120` still says `"euFile": "PDO-ES-02086"`. NOTE for LeadBot: change it to PDO-ES-02980 (not done here, since this check writes only its own files). The extract header also names 02086.
- soil: «pH 8,2–8,3» (the draft had 8.2).
- famous Vino tinto: «notas lácteas» = dairy notes.
- styles and climate: the lists of three are split. The mean 14 °C was dropped for length.
- Tile: "Airy microclimate, loose limestone, slow ripening".

## bolandin addendum: AM01 (OJ C/2026/713, 30.1.2026) read. The blocker is closed
- I read the amendment (`oj-PDO-ES-N1876-C_C_2026_713_30_1_2026.html`). It makes two changes: «CAMBIOS EN LA DESCRIPCIÓN ORGANOLÉPTICA» (single document point 6) and a phone number (pliego only).
- Applied the current text, cited as `bolandin-doc2` (Cellar d7065b83-fd7e-11f0-8da5-01aa75ed71a1, 2026-01-30):
  - famous Vinos tintos: «Capa media-alta» (it was «capa alta»), so "Full-bodied reds of medium-high colour; young or aged, with barrel notes."
  - tastes, overripe whites: «redondo, glicérico» is gone. The text is now «Aromas a fruta madura (de miel, membrillo maduro, higo…)» and «Cuerpo medio o alto y serán equilibrados». Now "ripe fruit such as honey, quince, fig; balanced."
- Unchanged in the amended text: the grapes (point 8, same seven), the categories (Vino; Vino de uvas sobremaduradas), the why line («Esto produce tintos de mayor color y mayor índice de polifenales totales»), and the climate and soil.
- Sweet kept: doc2 also names «blancos dulces de uvas botritizadas».
- Re-validated: JSON loads; tastes 34 words; famous ≤15 words each.
- Counts now: 0 blockers, 16 should fix (all fixed), 3 notes.

---

## REPORT-5: source check, vera-de-estenas

Verdict: fixed (draft usable after 7 changes; 0 blockers left). Counts: blocker 0, should fix 7 (all applied), note 3.
Source: OJ C 235, 12.7.2019, Documento único PDO-ES-N1665 (read, full HTML). Cites stay the bare id `vera-de-estenas-doc` (OJ text, no pages). Source entry url and date match the extract header.
Output: checked/vera-de-estenas.json. Validated by script: JSON ok, why 16 words and 1 sentence, styles 16/20, climate 21/25, soil 14/20, tile 6/7.

## Changes (should fix, applied)
1. why: "keeps the ground moister ... giving ripe grapes and balanced acidity" -> "A shallow water table softens day-night swings and keeps humidity higher, which keeps the acidity balanced." Doc ties the water table to acidity: «acidez que es posible gracias a la influencia del manto freático ... que atempera las temperaturas entre el día y la noche ... manteniendo la humedad más elevada». Ripeness the doc credits to all factors together, and it speaks of humidity, not ground moisture.
2. styles: prose list of four reds -> "Oak-aged reds in four ageing grades; white Chardonnay fermented in new oak; rosado mostly from Bobal." («Los vinos blancos Chardonnay fermentarán en barricas nuevas», «mayoritariamente la uva tinta Bobal»).
3. climate: list of four figures cut to rain and sun; 130 clear days dropped. «precipitaciones medias de unos 430 mm ... días lluviosos de 52», «horas de sol es de 2 600».
4. soil: overstated "on Miocene ground" -> "mostly"; list of four figures cut to limestone and pH. «predominante ... suelos pardocalizos», «principalmente en terrenos miocenos, y en menor proporción sobre cuaternarios», «38 % en caliza total», «pH ... sobre 8,5».
5. tastes: Reserva colour was "tile tones" -> "sour-cherry red with tile hints" («color rojo guinda, con tonos suaves entre cereza y teja»); Crianza "scrub" -> "Mediterranean scrub" («monte bajo Mediterráneo»); Gran Reserva list trimmed.
6. famous: four texts rewritten without three-item lists; facts unchanged («inferior a seis meses», «mínimo de seis / doce / dieciocho meses»; «frutas rojas, aromas de bosque y madera»).
7. tile added: "Shallow water table keeps acidity balanced".

## Notes
- Grapes: others match doc order (Cabernet Sauvignon, Bobal, Tempranillo, Merlot, Chardonnay) under the form heading «Principales uvas de vinificación»; no secondary list; no Wikipedia extract; main [] kept. Bobal is «mayoritariamente» only for rosado: taste call for the owner whether that makes it main.
- Kinds red, white, rose supported; no sweet («golosa» is a taste word), no sparkling or fortified.
- Amendment check: eAmbrosia lists OJ L 290, 11.11.2019 = the registration act, no amendment in progress; no doc2.

---

## REPORT-6: 2026 Official Journal amendments, Arínzano and Otazu (ReviewBot, 19 Oct 2026)

Verdict: both sheets updated to the current text. Blockers 0, should fix 0 (fixed in place), notes 3.
Validation [V, ran]: JSON loads; all rows within limits; why one sentence; tiles 6 and 7 words; every cite has a source entry and every source is cited.
OJ texts have no pages, so the new cites are the id alone.

## arinzano (current text: C/2026/4824, AM03; descriptions from C/2026/771, AM02)
- Source added `arinzano-doc2`: "Modificación normal PDO-ES-A0183-AM02 (EU Official Journal C/2026/771, Pago de Arínzano)", https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=OJ:C_202600771, 2026-02-05.
- styles: «Vinos blancos (Varietal Chardonnay)», «Vinos tintos», «Tratándose de vinos monovarietales». Now "Reds, some single-variety, and Chardonnay whites; both young or aged." '(dry)' dropped: the 2026 text does not say seco.
- tastes: rewritten from the new descriptors, e.g. «desde el amarillo pálido al amarillo dorado», «pudiendo aparecer notas cítricas», «desde rojo con tonos violáceos hasta rojo rubí», «notas especiadas, tostadas y/o balsámicas». The 2014 'exotic fruit, fresh nut, stony minerality' is gone.
- famous: «Vinos jóvenes / envejecidos» are no longer described (only in the volatile-acidity limit). Replaced by the four named varietals (Varietal Chardonnay, Merlot, Cabernet Sauvignon, Tempranillo).
- grapes: section 8 lists «CABERNET SAUVIGNON, CHARDONNAY, MERLOT, TEMPRANILLO» with no synonyms: 'Cencibel, Tinto de Toro' dropped. main stays [].
- why, climate, soil: link («veranos secos y calurosos y un gran diferencial térmico noche/día … lenta pero buena maduración») is unchanged; doc2 added to the 2014 p4 cite.
- C/2026/4824 (AM03): it changes only 7.1 winemaking («fermentación alcohólica se realiza en barricas y cubas»; ageing «en depósitos y barricas de diferentes materiales»). Its sections 6, 8 and 10 match 771 (diff ran), so no row changes. `arinzano-doc3` is not cited and has no entry (no orphan source). Note: add it if LeadBot wants the newest text cited too.
- tile: "Hot days, cool nights, slow ripening".

## otazu (current text: C/2026/3580, AM02)
- Source added `otazu-doc2`: "Modificación normal PDO-ES-A0184-AM02 (EU Official Journal C/2026/3580, Pago de Otazu)", https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=OJ:C_202603580, 2026-07-13.
- styles: «Vinos blancos y tintos secos», so 'dry' now covers both. Whites young or «fermentado en barrica»; reds young or «con envejecimiento en barrica».
- famous: was empty. Now the four named styles: Vino blanco joven, Vino blanco fermentado en barrica, Vinos tintos jóvenes, Vinos tintos con envejecimiento en barrica.
- tastes: rewritten, e.g. «rojo cereza pudiendo tener matices violáceos», «fruta roja y negra incluso especiado», «sedoso», «amarillo verde incluso pajizo … dorado», «fruta blanca, cítricos o florales».
- grapes: the same four, with no synonyms: 'Cencibel, Tinto de Toro' dropped. main stays [].
- why, climate, soil: the link is unchanged; doc2 added to the 2014 p3 cite.
- tile: "Valley floor, Atlantic air, long growing cycle".
- Note: the why says 'acidity and colour in balance' for «acidez, color y equilibrio». Kept as already checked; LeadBot may want "acidity, colour and balance" (that would be a list of three).

## Notes
- Chardonnay is the only white at both estates (Arínzano «Varietal Chardonnay»; Otazu «la variedad blanca»). Under the template's «wine description built on the grape» rule it could be read as main. I kept main [] because the descriptions name every grape. This needs a LeadBot call.
- I did not check: other places, the analytic rows, or the yields.
