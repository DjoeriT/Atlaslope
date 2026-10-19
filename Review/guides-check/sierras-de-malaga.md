# Sentence check: sierras-de-malaga

Source: pliego DOP «Sierras de Málaga», PDO-ES-A1480, consolidated per Orden de 19 de agosto de 2024 (BOJA núm. 166 de 27/08/2024), `Review/sources/fetched/pliego-PDO-ES-A1480-sierras-de-malaga.txt` (source id `sierras-de-malaga-pliego`); pages in `pages.py` numbering, which here matches the printed page footers. Checked 2026-10-19.

## Lede
- FIX p5 "sierras más al sur de Europa", "prolonga sus estribaciones hacia el sur hasta el mar Mediterráneo": "reach almost to the sea" now "their spurs run south to the Mediterranean" (the page says they reach the sea).
- FIX p6 "característicamente moderado, con descensos nocturnos, siendo contrarrestada la calidez propia de la latitud": "Hot sun is held in check" was wrong (the page counters the warmth of the latitude, and praises the sun on the same page); "cooler nights" now "a drop at night".

## place
- KEEP p5 "latitud más baja del arco mediterráneo europeo, precisamente en su entrada desde el Atlántico"
- KEEP p5 "las sierras más al sur de Europa, que son las estribaciones meridionales de la cordillera Penibética, y que constituyen las Sierras de Málaga"
- KEEP p5 "Este conjunto montañoso ocupa la mayoría de la superficie de la provincia"
- KEEP p5 "el arco montañoso que discurre de este a oeste, desde la Serranía de Ronda hasta la Sierra de Tejeda y Almijara, prolonga sus estribaciones hacia el sur hasta el mar Mediterráneo"
- KEEP p5 "quedando reducida la orografía más llana a la Depresión de Antequera en el norte, la Depresión de Ronda al noroeste y de Jimena (en la zona de Manilva) al oeste, así como a los valles de los ríos, destacando principalmente el Valle del Guadalhorce" (a list of named places, left as content)
- KEEP p5 "el viñedo se encuentra disperso en masas de viñas más o menos extensas" (for "do not form one block")
- KEEP p5 "a lo largo y ancho de la provincia y las explotaciones vitícolas son generalmente de pequeña dimensión propiciada por la abrupta orografía"
- KEEP p3 "se distingue la subzona tradicionalmente designada «Serranía de Ronda»", "se distinguen las siguientes áreas": six areas counted (Axarquía, Montes de Málaga, Manilva, Costa Occidental, Norte de Málaga, Sierra de las Nieves).
- Flight Serranía de Ronda: KEEP p5 "desde la Serranía de Ronda", p3 "subzona"; Nominatim 36.6772, -5.1781, about 7 km from the guide's point, corrected to [-5.178, 36.677].
- Flight Montes de Málaga and Axarquía: KEEP p5 "el complejo de los Montes de Málaga-Axarquía al este"; Nominatim Montes de Málaga 36.8247, -4.3834 and La Axarquía 36.8665, -4.1110; the guide's point was 10 to 16 km from both, moved to their midpoint [-4.25, 36.85].
- Missing flights: none added; the guide already flies to named ranges and Manilva.

## weather
- KEEP p5 "clima general ... tipo mediterráneo", "una época estival seca", "escasos días de precipitación"
- FIX p5 "según el área, adquiere matices templados, continentales o subtropicales": "it can be" now "it takes on a ... character" (matices, a shade, not a different climate).
- KEEP p5 "media de precipitaciones anuales óptima para la vitivinicultura como consecuencia de su situación estratégica y orientación de las sierras para la recepción de los frentes atlánticos, pero con irregular reparto espacial y temporal"
- KEEP p5 "numerosas horas de insolación, propias de su latitud en el área más meridional de Europa"; p6 "insolación muy elevada"
- FIX p6 "favorece la producción de mostos de alta graduación natural necesarios para la elaboración de los vinos de uvas sobremaduradas": "the sweet wines" now "the wines from overripe grapes"; "high natural strength" now "high natural alcohol level"; split into two sentences.
- KEEP p6 "característicamente moderado, con descensos nocturnos"
- FIX p6 "tanto por su situación en área de transición climática, como por causas mesoclimáticas": "the climate transition" now "because the zone lies in a climatic transition".
- KEEP p5 "multitud de mesoclimas como consecuencia de la orografía montañosa y de la influencia del mar"
- KEEP p6 "El régimen de temperaturas en la maduración es de especial importancia, influyendo decisivamente en la variabilidad de matices aromáticos y la calidad polifenólica"

## ground
- KEEP p5 "Los suelos, en general, se caracterizan en fertilidad media a baja"
- KEEP p5 "al norte predominan los materiales blandos, arenas, margas, calizas y areniscas"
- KEEP p5 "al sur, mas compactos, principalmente esquistos, pizarras, filitas, gneises e incluso mármoles"
- KEEP p5 "las distintas áreas tienen matices variados"
- KEEP p5 "la Axarquía y los Montes de Málaga se caracterizan por tener suelos de pizarra"
- KEEP p5 "la Serranía de Ronda por suelos con sustrato calizo, generalmente con calcarenitas"
- KEEP p5 "en la zona de Manilva son albarizos, de alto contenido en caliza; la zona norte, tiene suelos pardo-calizos, profundos" (albarizos glossed by the page's own "high limestone content")
- KEEP p6 "Los suelos, por composición, textura y/o pendiente, se caracterizan en general por su buen drenaje"
- KEEP p6 "unido a una fertilidad de media a baja, potencian la concentración de componentes aromáticos y la finura de los vinos"
- Flight Manilva: KEEP p5 "en la zona de Manilva son albarizos, de alto contenido en caliza"; Nominatim 36.3770, -5.2490, under 1 km off, left as is.

## rules
- FIX p5 "fragmentación y reducción de la superficie dedicada al viñedo", "pérdida de la gran diversidad varietal": "wiped out much of the huge range" now "broke up and shrank the vineyards, and much of the province's great range ... was lost".
- FIX p5-6 "se mantuvieron las elaboraciones propias para estos tipos de uva, entre las que se encontraban las que daban lugar a los vinos tintos secos y dulces (en el primer Reglamento de la Denominación de Origen «Málaga», publicado el 23 de octubre de 1937, incluía los tipos de vino «Rome Tinto» y el «Tintillo de Málaga»)": the 1937 rules did not "list dry and sweet reds"; they were the first rules of the Málaga denomination and included the two named types. Split into two sentences.
- KEEP p6 "A principios de los años 80 se fue recuperando esta tradición ... rescatando e incorporando variedades blancas y tintas históricas, así como otras implantadas en la zona" (1980s confirmed by "años 80")
- KEEP p6 "la profusión de variedades empleadas"
- KEEP p4 "Blancas: Chardonnay, ... Moscatel de Alejandría, ... Pedro Ximénez (Pero Ximén), ... Sauvignon Blanc, Verdejo"
- FIX p4 "Tintas: ... Cabernet Sauvignon, ... Merlot, ... Rome, Tempranillo, ... Tintilla de Rota («Tintilla») y Syrah": "Romé" now "Rome", the pliego's spelling.
- FIX p1 "son blancos, rosados y tintos", "Vino de uvas sobremaduradas  Tinto"; p6 "resultando en este caso claramente dulces": rosado glossed as "(rosé)".
- FIX p1-2 "amarillo pálido hasta oro viejo", "piel de cebolla hasta rosado rojizo tonos rubí", "violáceo hasta rojo teja": the "X, Y and Z" clause list split into three sentences; "ruby-tinged red" now "a reddish pink with ruby tones".
- KEEP p6 "con acidez siempre patente"
- KEEP p6 "una concentración alcohólica de media a alta"
- KEEP p1 "Vino de uvas sobremaduradas  Tinto  ≥ 15 ... ≥ 45"
- FIX p2 "No está permitida la edulcoración, ni ningún incremento artificial del grado alcohólico natural, debiendo ser siempre naturales tanto el grado alcohólico adquirido como los azúcares residuales que puedan contener los vinos protegidos": the rule covers every protected wine, not just the sweet red; "adding alcohol" now "any artificial rise in natural alcohol"; the invented "so" became the page's "must".
- KEEP p4 "12.000 kg para las variedades blancas y de 9.000 kg para las tintas. Es decir, 84 hl de vino por ha para blancas y 63 hl de vino por ha para tintas"
- KEEP p4 "en la subzona «Serranía de Ronda», la producción máxima será de 9.000 kg para las variedades blancas y tintas"
- KEEP p2 "En la subzona «Serranía de Ronda» la recolección se realizará obligatoriamente de forma manual y en envases con un peso máximo de 30 kg"
- FIX p8 "Los vinos procedentes de bodegas situadas en las subzonas ... siempre que el 100 % de la uva ... proceda de dicha subzona", "bodegas situadas en las áreas ... siempre que el 85 % de la uva": the condition that the winery sits in the subzone or area was dropped; added.

## Fact sheet (`content/facts/andalucia.json`, "sierras-de-malaga"; not edited)
- why.text / climate.text: sheet "cool nights"; pliego p6 "con descensos nocturnos" (a drop at night, not "cool"). Sheet "sit close to the sea"; pliego p5 the spurs run "hasta el mar Mediterráneo".
- grapes.main: sheet "Romé"; pliego p4 "Rome". Sheet "Moscatel Grano Menudo"; pliego p4 "Moscatel de Grano Menudo (Moscatel Morisco)".
- grapes.others: sheet lists "Airén"; not among the varieties on pliego p4. Sheet "Laíren"; pliego p4 "Lairen".
- styles.kinds / styles.text: sheet white, rose, red only; pliego p1 also has the category "Vino de uvas sobremaduradas" (tinto, ≥ 45 g/l, "claramente dulces" p6).
- tastes.text: sheet "earthy", "structured, ripe tannins", "straw with green glints to gold", "unctuous in oak", reds "violet-red to ruby"; pliego p1-2 says whites "amarillo pálido hasta oro viejo", "frutales"; reds "violáceo hasta rojo teja", "frutales", "Con astringencia"; rosados "piel de cebolla hasta rosado rojizo tonos rubí", "frutales y florales". The earthy, tannin, green-glint and unctuous descriptors are not in the pliego.
- Cites: the sheet cites `sierras-de-malaga-doc`, not the pliego; the points above are checked against the pliego.

## Second check
Source: same pliego, consolidated per Orden de 19 de agosto de 2024 (BOJA núm. 166 de 27/08/2024); pages 1, 2, 3, 4, 5, 6 and 8 read with `pages.py`. Checked 2026-10-19, fresh pass. Counts for this pass only: KEEP 53, FIX 6, CUT 0.

### Titles and lede
- KEEP guide title (no claim beyond the place).
- KEEP p5 "las sierras más al sur de Europa", "prolonga sus estribaciones hacia el sur hasta el mar Mediterráneo" (lede 1).
- KEEP p6 "característicamente moderado, con descensos nocturnos, siendo contrarrestada la calidez propia de la latitud" (lede 2).
- KEEP p5 "las sierras más al sur de Europa" (title "Europe's southernmost mountains").
- KEEP p5 "numerosas horas de insolación"; p6 "característicamente moderado" (title "Sunny days, moderate ripening").
- KEEP p5 "la Axarquía y los Montes de Málaga se caracterizan por tener suelos de pizarra", "el complejo de los Montes de Málaga-Axarquía al este", "de Jimena (en la zona de Manilva) al oeste", "en la zona de Manilva son albarizos, de alto contenido en caliza", "la Serranía de Ronda por suelos con sustrato calizo" (title "Slate in the east, limestone in the west").
- KEEP p1 "Vino ... Blanco ... Rosado ... Tinto", "Vino de uvas sobremaduradas  Tinto"; p6 "la profusión de variedades empleadas" (title "Many grapes, four kinds of wine").

### place
- FIX p5 "esta denominación de origen se debe a su situación particular en la latitud más baja del arco mediterráneo europeo, precisamente en su entrada desde el Atlántico": the subject is the denomination's zone, not "Málaga" (the zone also takes in Benamejí and Palenciana in Córdoba, p3); now "The zone sits at...".
- KEEP p5 "topografía montañosa, constituida por las sierras más al sur de Europa, que son las estribaciones meridionales de la cordillera Penibética, y que constituyen las Sierras de Málaga"
- KEEP p5 "predomina la montaña abrupta", "Este conjunto montañoso ocupa la mayoría de la superficie de la provincia de Málaga"
- KEEP p5 "el arco montañoso que discurre de este a oeste, desde la Serranía de Ronda hasta la Sierra de Tejeda y Almijara, prolonga sus estribaciones hacia el sur hasta el mar Mediterráneo" (the page's own east-to-west wording kept)
- KEEP p5 "quedando reducida la orografía más llana a la Depresión de Antequera en el norte, la Depresión de Ronda al noroeste y de Jimena (en la zona de Manilva) al oeste, así como a los valles de los ríos, destacando principalmente el Valle del Guadalhorce" (named-place list, left as content)
- KEEP p5 "el viñedo se encuentra disperso en masas de viñas más o menos extensas"
- KEEP p5 "a lo largo y ancho de la provincia y las explotaciones vitícolas son generalmente de pequeña dimensión propiciada por la abrupta orografía"
- KEEP p3 "se distingue la subzona tradicionalmente designada «Serranía de Ronda»", "se distinguen las siguientes áreas": six named (Axarquía, Montes de Málaga, Manilva, Costa Occidental, Norte de Málaga, Sierra de las Nieves); number 6 confirmed.
- Flight Serranía de Ronda: FIX caption. p5 has the chain run "desde la Serranía de Ronda" and puts "en el extremo oeste, Sierra Bermeja", so "at the western end of the chain" was not on the page; now "where the chain begins". p3 "subzona" KEEP. Nominatim 36.6772, -5.1781: matches the point.
- Flight Montes de Málaga and Axarquía: KEEP p5 "el complejo de los Montes de Málaga-Axarquía al este". Nominatim Montes de Málaga 36.8247, -4.3834 and La Axarquía 36.8665, -4.1110; the point is their midpoint for a combined label, left as is.
- Missing flights: none added; the guide already flies to named ranges and an area beyond the zone as a whole.

### weather
- KEEP p5 "se encuadra en el tipo mediterráneo", "una época estival seca", "escasos días de precipitación"
- KEEP p5 "según el área, adquiere matices templados, continentales o subtropicales"
- FIX p5 "media de precipitaciones anuales óptima para la vitivinicultura como consecuencia de su situación estratégica y orientación de las sierras para la recepción de los frentes atlánticos, pero con irregular reparto espacial y temporal": "suits vines" now "optimal for vines"; the zone's position, which the page names beside the mountains' orientation, added as a cause.
- KEEP p5 "numerosas horas de insolación, propias de su latitud en el área más meridional de Europa"; p6 "la insolación muy elevada"
- KEEP p6 "favorece la producción de mostos de alta graduación natural"
- KEEP p6 "necesarios para la elaboración de los vinos de uvas sobremaduradas"
- KEEP p6 "característicamente moderado, con descensos nocturnos"
- FIX p6 "tanto por su situación en área de transición climática, como por causas mesoclimáticas": the broken "because ..., and by" sentence now "held back both by the zone's position in a climatic transition and by local mesoclimates".
- KEEP p5 "se generan multitud de mesoclimas como consecuencia de la orografía montañosa y de la influencia del mar"
- FIX p6 "influyendo decisivamente en la variabilidad de matices aromáticos y la calidad polifenólica": "shapes the range of aromas" now "decisively shapes the variety of aroma nuances".

### ground
- KEEP p5 "Los suelos, en general, se caracterizan en fertilidad media a baja"
- KEEP p5 "al norte predominan los materiales blandos, arenas, margas, calizas y areniscas"
- KEEP p5 "al sur, mas compactos, principalmente esquistos, pizarras, filitas, gneises e incluso mármoles"
- KEEP p5 "las distintas áreas tienen matices variados"
- KEEP p5 "la Axarquía y los Montes de Málaga se caracterizan por tener suelos de pizarra"
- KEEP p5 "la Serranía de Ronda por suelos con sustrato calizo, generalmente con calcarenitas"
- KEEP p5 "en la zona de Manilva son albarizos, de alto contenido en caliza" (albarizos glossed by the page's own words)
- KEEP p5 "la zona norte, tiene suelos pardo-calizos, profundos"
- KEEP p6 "Los suelos, por composición, textura y/o pendiente, se caracterizan en general por su buen drenaje"
- FIX p6 "unido a una fertilidad de media a baja, potencian la concentración de componentes aromáticos y la finura de los vinos": "concentrates the aroma compounds and adds finesse" now "enhances the concentration of aroma compounds and the finesse of the wines" (potencian).
- Flight Manilva: KEEP p5; Nominatim 36.3770, -5.2490, under 1 km off.

### rules
- KEEP p5 "esta plaga produjo la fragmentación y reducción de la superficie dedicada al viñedo", "una pérdida de la gran diversidad varietal"
- KEEP p5-6 "se mantuvieron las elaboraciones propias para estos tipos de uva, entre las que se encontraban las que daban lugar a los vinos tintos secos y dulces"
- KEEP p6 "en el primer Reglamento de la Denominación de Origen «Málaga», publicado el 23 de octubre de 1937, incluía los tipos de vino «Rome Tinto» y el «Tintillo de Málaga»"
- KEEP p6 "A principios de los años 80 se fue recuperando esta tradición ... rescatando e incorporando variedades blancas y tintas históricas, así como otras implantadas en la zona" (machine warning "1980" confirmed by "años 80")
- KEEP p6 "la profusión de variedades empleadas"
- KEEP p4 "Blancas: Chardonnay, ... Moscatel de Alejandría, ... Pedro Ximénez (Pero Ximén), ... Sauvignon Blanc, Verdejo"
- KEEP p4 "Tintas: ... Cabernet Sauvignon, ... Merlot, ... Rome, Tempranillo, ... Tintilla de Rota («Tintilla») y Syrah"
- KEEP p1 "son blancos, rosados y tintos", "Vino de uvas sobremaduradas  Tinto"; p6 "resultando en este caso claramente dulces"
- KEEP p1 "amarillo pálido hasta oro viejo"
- KEEP p1 "piel de cebolla hasta rosado rojizo tonos rubí"
- KEEP p2 "violáceo hasta rojo teja"
- KEEP p6 "con acidez siempre patente"
- KEEP p6 "una concentración alcohólica de media a alta"
- KEEP p1 "Vino de uvas sobremaduradas  Tinto  ≥ 15 ... ≥ 45"
- KEEP p2 "No está permitida la edulcoración, ni ningún incremento artificial del grado alcohólico natural"
- KEEP p2 "debiendo ser siempre naturales tanto el grado alcohólico adquirido como los azúcares residuales"
- KEEP p4 "12.000 kg para las variedades blancas y de 9.000 kg para las tintas. Es decir, 84 hl de vino por ha para blancas y 63 hl de vino por ha para tintas"
- KEEP p4 "en la subzona «Serranía de Ronda», la producción máxima será de 9.000 kg para las variedades blancas y tintas"
- KEEP p2 "la recolección se realizará obligatoriamente de forma manual y en envases con un peso máximo de 30 kg"
- KEEP p8 "bodegas situadas en las subzonas ... siempre que el 100 % de la uva ... proceda de dicha subzona"
- KEEP p8 "bodegas situadas en las áreas ... siempre que el 85 % de la uva ... proceda de dicha área"
- Missing wine types: the pliego protects only the category «Vino» (blanco, rosado, tinto) and «Vino de uvas sobremaduradas» (tinto), p1; all four are named. No sparkling, generoso or vino de licor. «Crianza», «Reserva» and «Gran Reserva» (p2) are left to "la normativa vigente" and are not in the guide.

### Fact sheet (second check; the sheet has changed since the first check; not edited)
- styles.text: sheet "from fresh young wines to oak-aged ones"; pliego p2 allows ageing in oak vessels of at most 1,000 litres, but says nothing of "fresh young" wines.
- grapes.main: sheet picks ten "main" grapes and cites `sierras-de-malaga-wiki`; pliego p4 lists all varieties on equal terms, with no main or secondary split.
- The earlier points (Romé, Airén, Laíren, missing sweet red, tasting words) are fixed in the current sheet: `styles.kinds` now has "sweet", tastes match p1-2, grape spellings match p4.
