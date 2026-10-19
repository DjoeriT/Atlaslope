# Sentence check: montilla-moriles

Source: pliego DOP «Montilla-Moriles», PDO-ES-A1479 (modification approved in BOJA n.º 234, 3 Dec 2020), `Review/sources/fetched/pliego-PDO-ES-A1479-montilla-moriles.txt`; pages in `pages.py` numbering (equal to the PDF's "PAGE n / 15"). Checked 2026-10-19.

## Lede
- KEEP p10 "En esta zona central de Andalucía se registran las temperaturas más elevadas en los meses de julio y agosto de toda la península ibérica, con máximas históricas que superan los 46ºC"
- FIX p10 "marcando tanto el estilo ... como los vinos generosos con su elevada graduación alcohólica natural ... los vinos dulces a partir del asoleo": "generosos" was unexplained; now "the generosos, wines of high natural alcohol,".

## place
- KEEP p9 "al sur de la provincia de Córdoba", "área de la campiña del Valle del Guadalquivir", "entre 125 y 600 metros"
- KEEP p9 "terrenos ondulados poco montañosos con pendientes suaves"
- KEEP p9 "En la parte Sur-Este se encuentra delimitada por la Cordillera de la Subbética"
- KEEP p7 "en su totalidad: Montilla, Moriles, Doña Mencía, Montalbán, Monturque, Puente Genil y Nueva Carteya" (seven)
- KEEP p7 "y en parte de los siguientes términos: Aguilar de la Frontera, ... Montemayor y Santaella" (ten)
- KEEP p8 "La zona de crianza ... incluye la zona de elaboración ... y Córdoba capital"
- Flight Montilla: KEEP p9 caption; Nominatim 37.581, -4.641, about 1 km from the guide's point, left as is.
- Flight Cordillera de la Subbética: KEEP p9 caption; Nominatim (Parque Natural Sierras Subbéticas) 37.438, -4.336, under 1 km off, left as is.

## weather
- KEEP p9-10 "se clasifica en general como semi-continental mediterráneo"
- FIX p10 "veranos cálidos, largos y secos e inviernos cortos y relativamente suaves": "X, Y and Z" adjective list split into "Summers are long and warm, and they are dry. Winters are short and relatively mild."
- KEEP p10 "Las horas de sol efectivo se sitúan en torno a las 3000 por año"
- KEEP p10 "La pluviometría anual oscila entre 500 y 1000 mm, caracterizada por su irregularidad"
- KEEP p10 "se clasifica entre los más cálidos del mundo durante el ciclo vegetativo"
- KEEP p10 "la rápida maduración del fruto que marca su composición y las características de los todos los vinos resultantes"
- FIX p10 "El efecto directo de esta climatología tan severa durante la maduración ... marcando tanto el estilo de los vinos blancos jóvenes o con envejecimiento, como los vinos generosos ... los vinos dulces a partir del asoleo": "whites, generosos and sweet wines" list replaced with "marks the style of every wine here, down to the generosos ... and the sweet wines"; "during ripening" restored.

## ground
- KEEP p10 "Las albarizas son suelos ricos en carbonato cálcico, con suelo y subsuelo formados margas blandas"
- FIX p10 "pobres en materia orgánica natural, poco fértiles": comma-joined list split into its own sentence.
- KEEP p10 "alto poder retentivo de la humedad"
- KEEP p10 "las raíces ... principalmente en los primeros setenta centímetros", "la raíz principal puede llegar a sobrepasar los cuatro metros" (machine warnings on 70 and 4 confirmed in words)
- KEEP p10 "Se consideran los suelos de mejor calidad para los vinos generosos y de licor ..., basándose en la larga experiencia"
- KEEP p10 "siendo el existente en los viñedos de la subzona denominada “Superior”"; p7 "subzona “Superior” ... que comprende los terrenos de albarizas"
- KEEP p10 "Fuera de la subzona superior ... suelos con alto contenido en sílice"
- KEEP p10 "que potencian la reverberación de la radiación solar, pudiendo adelantar en varios días la madurez"
- KEEP p10 "mostos que desde finales agosto suelen superar ya los 15 grados de alcohol en potencia"

## rules
- KEEP p8 "Pedro Ximénez, Layren, Baladí, ..." (listed first)
- FIX p8 "Layren, Baladí, Verdejo, Moscatel de grano menudo, Moscatel de Alejandría, Torrontés, Chardonnay, Sauvignon Blanc y Macabeo": the page does not call them white; "white" dropped. Two Moscatels KEEP.
- FIX p1 "Categoría vitícola de los productos: vinos y vinos de licor": "white wines and liqueur wines" now "two categories, wines and liqueur wines"; p1 added to the beat's cites.
- FIX p8 "es de 13.714 kilogramos" + "no podrá superar el 25% del límite citado": number kept, dropped hedge restored (Consejo Regulador may raise it in some years by no more than 25%; the body explained).
- KEEP p2 "Blanco joven", "Blanco sin envejecimiento", "Blanco con envejecimiento"
- KEEP p6 "no permitiendo que se excedan los 22ºC"
- CUT (no page) "The generosos are the zone's famous wines." Replaced with p2 table (Fino 14,5-17; Amontillado, Oloroso, Palo Cortado 16-22) and p6 "solo se exige el encabezado en aquellos que no alcancen de forma natural la graduación alcohólica adquirida mínima": "run from 14.5 to 22% alcohol. Wine alcohol is added only to those that do not reach their minimum strength naturally."
- KEEP p4-5 "velo de levaduras ... se desarrolla espontáneamente en la zona ..., alcanzando su máxima actividad en primavera y otoño"
- KEEP p6 "Fino ... crianza biológica mediante el sistema de criaderas y solera durante un periodo mínimo de dos años"; p3 "ligeramente amargo y salino"
- KEEP p6 "Amontillado: se obtiene a partir de vino «Fino» con una crianza biológica mínima de cinco años, seguidos de al menos tres años con crianza oxidativa"
- FIX p6 "envejecimiento durante al menos dos años, con crianza predominantemente oxidativa" KEEP; p3 Oloroso "Sabor: ligeramente untuoso y persistente": taste word "velvety" was not the source's, now "slightly unctuous and persistent".
- KEEP p7 "Palo cortado ... una primera fase de crianza biológica, y la segunda de crianza oxidativa"
- KEEP p5 "extracción parcial o “saca” del vino de cada una de las botas ... y la reposición o “rocío” con vino de otra escala o criadera más joven"
- KEEP p5 "en las vasijas de roble tradicionales en la zona, con capacidad máxima de 1.000 litros"
- KEEP p7 "el 95% de la uva sea de la variedad “Pedro Ximénez”", "el 85% de la uva sea de la variedad “Moscatel”"
- FIX p7 "Pedro Ximénez: se obtiene partiendo del proceso de asoleo", Moscatel "Puede emplearse el proceso de asoleo": added which wine must and which may use asoleo.
- KEEP p4 "La vendimia será manual", "exposición directa de la uva al sol una vez cortada, extendida en terrenos ligeramente inclinados", "deshidratación parcial de las bayas"
- KEEP p4 "como mínimo de 450 gramos por litro"; "no podrá superar en ningún caso los 40 litros de vino por cada 100 kilogramos"
- KEEP p3 Pedro Ximénez "aromas a pasificación", "muy denso"
- FIX p7 "se obtienen a partir de los vinos generosos ..., a los que se adiciona mosto de uva pasificada ..., mosto de uva concentrado ... o vino dulce natural": "sweetened generosos" made specific.

## label
- KEEP p13 "Vino de tinaja" / "Vino nuevo de tinaja" "siempre y cuando se demuestre que este sistema tradicional haya sido utilizado en cualquiera de las fases"
- KEEP p13 "Los vinos con envejecimiento podrán etiquetarse con la mención “Vino de pasto”"
- KEEP p13 "Pasado" "vejez promedio igual o superior a 10 años"
- FIX p13 "“Viejo”, con una vejez promedio igual o superior a 15 años" + "deberán comercializarse embotellados": the bottling rule applies to both terms, now on Viejo too; three-item list reworded.
- FIX p13 "“Viejísimo”, ... igual o superior a 25 años": "they too must be sold in bottle".
- KEEP p13 "Flor", "Yema" "no supere un rendimiento de extracción de 60 litros por cada 100 kilos"
- KEEP p13 "no hayan sido objeto de otra práctica de estabilización distinta al filtrado"; p3 "no podrá superar 20 NTU"
- KEEP p13 "Superior" "siempre que sólo se utilice en su fabricación mosto de uva pasificada Pedro Ximénez y alcohol"
- No famous style (Fino, Amontillado, Oloroso, Pedro Ximénez) appears as a label term.

## Fact sheet
The sheet cites a different source id (`montilla-moriles-doc`), not this pliego. Disagreements with the pliego:
- famous.styles Oloroso / tastes: sheet "mahogany ... full and velvety"; pliego "oro viejo hasta caoba oscuro", "ligeramente untuoso y persistente" (p3).
- famous.styles Amontillado: sheet "Amber to old gold, pungent, nutty, dry or nearly off-dry"; pliego "dorado hasta ámbar intenso", "frutos secos y madera ... notas a barniz", "ácido y persistente" (p3); sugars ≤4 g/L, up to 9 g/L under the acidity condition (p2).
- famous.styles Pedro Ximénez / tastes: sheet "amber to deep mahogany"; pliego "de oro viejo a caoba intenso o azabache" (p3).
- famous.styles Fino / tastes: sheet "straw to gold ... light and fragrant"; pliego "amarillo pajizo hasta oro viejo", "ligeramente amargo y salino", no "light and fragrant" (p3).
- tastes whites: sheet "light, with Pedro Ximénez character"; pliego only "Aromas frutales y florales", "Acidez perceptible" (p2).
- styles.text: sheet omits Palo Cortado and the generosos de licor (Generoso de Licor, Pale Cream, Cream); pliego B.2 lists them (p1).
- climate: sheet "long, hot, dry summers"; pliego "veranos cálidos, largos y secos" (p10). Close; "hot" vs "cálidos" (warm).

## Second check

Source: pliego DOP «Montilla-Moriles», PDO-ES-A1479 (BOJA n.º 234, 3 Dec 2020), `Review/sources/fetched/pliego-PDO-ES-A1479-montilla-moriles.txt`; pages 1-10 and 13 read with `pages.py`. Checked 2026-10-19. Counts this pass only: KEEP 53, FIX 11, CUT 0.

### Title and lede
- KEEP (guide title) general claim, backed by p10 "determinante para poder obtener los vinos de la DOP con sus características específicas"
- KEEP p10 "En esta zona central de Andalucía se registran las temperaturas más elevadas en los meses de julio y agosto de toda la península ibérica, con máximas históricas que superan los 46ºC"
- KEEP p10 "marcando tanto el estilo ... como los vinos generosos con su elevada graduación alcohólica natural ... los vinos dulces a partir del asoleo"

### place
- FIX p9 "al sur de la provincia de Córdoba": title "Rolling farmland south of Córdoba" read as south of the city; now "Rolling farmland in southern Córdoba province".
- KEEP p9 "al sur de la provincia de Córdoba", "área de la campiña del Valle del Guadalquivir", "entre 125 y 600 metros"
- KEEP p9 "terrenos ondulados poco montañosos con pendientes suaves"
- KEEP p9 "En la parte Sur-Este se encuentra delimitada por la Cordillera de la Subbética"
- KEEP p7 "en su totalidad: Montilla, Moriles, Doña Mencía, Montalbán, Monturque, Puente Genil y Nueva Carteya" (seven)
- KEEP p7 "y en parte de los siguientes términos: Aguilar de la Frontera, ... Montemayor y Santaella" (ten)
- KEEP p8 "La zona de crianza ... incluye la zona de elaboración ... y Córdoba capital"
- KEEP p9 caption Montilla; Nominatim "Montilla, Córdoba" 37.581, -4.641, about 1 km from the point, left.
- KEEP p9 caption Subbética; Nominatim "Parque Natural Sierras Subbéticas" 37.438, -4.336, under 1 km off, left. No missing flight: the guide already flies beyond the town.

### weather
- FIX p10 "se clasifica entre los más cálidos del mundo durante el ciclo vegetativo": title "One of the hottest summers in the vineyard world" moved the claim from the growing cycle to summers (the page calls summers only "cálidos"); now "Among the hottest climates in the world for vines".
- KEEP p9-10 "se clasifica en general como semi-continental mediterráneo"
- KEEP p10 "veranos cálidos, largos y secos" (summers long and warm, and dry)
- KEEP p10 "inviernos cortos y relativamente suaves"
- FIX p10 "Las horas de sol efectivo se sitúan en torno a las 3000 por año": number kept; broken "sun shine" sentence rewritten.
- KEEP p10 "La pluviometría anual oscila entre 500 y 1000 mm, caracterizada por su irregularidad"
- KEEP p10 "se clasifica entre los más cálidos del mundo durante el ciclo vegetativo"
- FIX p10 "la rápida maduración del fruto que marca su composición y las características de los todos los vinos": the make-up marked is the fruit's; now "which marks its make-up and the character of all the wines".
- FIX p10 "El efecto directo de esta climatología tan severa durante la maduración, así como su influencia a través de las características de los suelos": the soils half of the cause was dropped; now "together with its effect through the soils".

### ground
- FIX (title) p10 "suelos ricos en carbonato cálcico", "alto poder retentivo de la humedad": no cited page calls albariza white; "White chalky soil" now "Lime-rich soil that holds water".
- FIX p10 "Las albarizas son suelos ricos en carbonato cálcico": "the best-known soils here" is on no page (the page says best quality, which para 2 carries); cut and merged into "Albarizas are soils rich in calcium carbonate".
- KEEP p10 "con suelo y subsuelo formados margas blandas"
- KEEP p10 "pobres en materia orgánica natural, poco fértiles"
- KEEP p10 "alto poder retentivo de la humedad"
- KEEP p10 "principalmente en los primeros setenta centímetros", "la raíz principal puede llegar a sobrepasar los cuatro metros" (machine warnings 70 and 4 confirmed in words)
- KEEP p10 "Se consideran los suelos de mejor calidad para los vinos generosos y de licor ..., basándose en la larga experiencia"
- KEEP p10 "siendo el existente en los viñedos de la subzona denominada “Superior”"; p7 "subzona “Superior” ... que comprende los terrenos de albarizas"
- KEEP p10 "Fuera de la subzona superior ... suelos con alto contenido en sílice"
- KEEP p10 "potencian la reverberación de la radiación solar, pudiendo adelantar en varios días la madurez"
- KEEP p10 "mostos que desde finales agosto suelen superar ya los 15 grados de alcohol en potencia"

### rules
- FIX (title) "A white-grape zone with a cellar tradition": no cited page calls the grapes white (the first check dropped "white" from the grape sentence for the same reason) and "cellar tradition" sits on p9, outside the beat's cites; now "Pedro Ximénez, flor and the solera" (p8, p4-5).
- KEEP p8 "Pedro Ximénez, Layren, Baladí, ..." (listed first)
- KEEP p8 nine others, "Moscatel de grano menudo, Moscatel de Alejandría"
- KEEP p1 "Categoría vitícola de los productos: vinos y vinos de licor"
- KEEP p8 "La producción máxima admitida por hectárea para elaboración de vinos blancos protegidos es de 13.714 kilogramos"
- FIX p8 "Los límites establecidos podrán ser modificados ... no podrá superar el 25%": "raise" narrowed "modificados"; now "change".
- KEEP p1-2 "Joven, Blanco sin envejecimiento, Blanco con envejecimiento"
- KEEP p6 "no permitiendo que se excedan los 22ºC"
- KEEP p2 Fino "14,5-17", Amontillado, Oloroso, Palo Cortado "16-22"
- FIX p6 "solo se exige el encabezado en aquellos que no alcancen de forma natural la graduación alcohólica adquirida mínima"; Fino "generalmente se alcanza de forma natural, sin necesidad de encabezado. No obstante, ... puede ajustarse ... mediante encabezado"; Amontillado, Oloroso, Palo Cortado "puede ajustarse mediante encabezado": "added only to those" said more than "only required"; now required only for those, a Fino usually reaches it without, any generoso may be adjusted, so a generoso may or may not be fortified.
- KEEP p4-5 "velo de levaduras ... se desarrolla espontáneamente en la zona ..., alcanzando su máxima actividad en primavera y otoño"
- KEEP p6 Fino "crianza biológica mediante el sistema de criaderas y solera durante un periodo mínimo de dos años"; p3 "ligeramente amargo y salino"
- KEEP p6 "Amontillado: se obtiene a partir de vino «Fino» con una crianza biológica mínima de cinco años, seguidos de al menos tres años con crianza oxidativa"
- KEEP p6 Oloroso "al menos dos años, con crianza predominantemente oxidativa"; p3 "ligeramente untuoso y persistente"
- KEEP p7 Palo cortado "una primera fase de crianza biológica, y la segunda de crianza oxidativa"
- KEEP p5 "extracción parcial o “saca” ... y la reposición o “rocío” con vino de otra escala o criadera más joven"
- KEEP p5 "en las vasijas de roble tradicionales en la zona, con capacidad máxima de 1.000 litros"
- KEEP p1/p7 "al menos el 95%" Pedro Ximénez, "al menos el 85%" Moscatel
- KEEP p7 Pedro Ximénez "se obtiene partiendo del proceso de asoleo"; Moscatel "Puede emplearse el proceso de asoleo"
- KEEP p4 "La vendimia será manual", "extendida en terrenos ligeramente inclinados", "deshidratación parcial de las bayas"
- KEEP p4 "como mínimo de 450 gramos por litro"; "no podrá superar en ningún caso los 40 litros de vino por cada 100 kilogramos"
- KEEP p3 Pedro Ximénez "aromas a pasificación", "muy denso"
- FIX (added) p7 "al mosto se le añade alcohol de origen vínico para impedir o interrumpir la fermentación"; Moscatel "El mosto puede someterse a fermentación parcial y encabezado": the beat never said the sweet wines are fortified; added "Wine alcohol is added to the Pedro Ximénez must to stop it fermenting. Moscatel must may be partly fermented and then fortified."
- KEEP p7 "«Vino generoso de licor», «Pale Cream» y «Cream» ... a los que se adiciona mosto de uva pasificada ..., mosto de uva concentrado ... o vino dulce natural"
- Wine types: every type in p1 B.2 is named (Joven, Blanco sin/con envejecimiento, Fino, Amontillado, Oloroso, Palo Cortado, Pedro Ximénez, Moscatel, Generoso de Licor, Pale Cream, Cream). No sparkling or red in the pliego.

### label
- KEEP p13 "Vino de tinaja" / "Vino nuevo de tinaja" "siempre y cuando se demuestre que este sistema tradicional haya sido utilizado en cualquiera de las fases" (the pliego never says what a tinaja is, so it stays unexplained)
- KEEP p13 "Los vinos con envejecimiento podrán etiquetarse con la mención “Vino de pasto”"
- KEEP p13 "Pasado" "vejez promedio igual o superior a 10 años"
- KEEP p13 "“Viejo”, con una vejez promedio igual o superior a 15 años", "deberán comercializarse embotellados"
- KEEP p13 "“Viejísimo”, con una vejez promedio igual o superior a 25 años"
- KEEP p13 "Flor", "Yema" "no supere un rendimiento de extracción de 60 litros por cada 100 kilos"
- KEEP p13 "no hayan sido objeto de otra práctica de estabilización distinta al filtrado"; p3 "no podrá superar 20 NTU"
- KEEP p13 "Superior" "siempre que sólo se utilice en su fabricación mosto de uva pasificada Pedro Ximénez y alcohol"
- No term leans on "legislación vigente"; no famous style is a label term.

### Fact sheet (second check)
The sheet now cites this pliego. Remaining disagreements:
- why.text: sheet "Hot, dry summers ripen the grapes quickly"; pliego "veranos cálidos, largos y secos" (warm), and quick ripening comes from the climate "durante el ciclo vegetativo, con escasas precipitaciones, y una elevada insolación" (p10).
- climate.text: sheet "long, hot, dry summers ... which speed up ripening"; pliego "veranos cálidos" and the growing-cycle climate, not summers, behind "la rápida maduración" (p10).
- grapes.others: sheet lists only the two Moscatels; pliego allows nine others: Layren, Baladí, Verdejo, Moscatel de grano menudo, Moscatel de Alejandría, Torrontés, Chardonnay, Sauvignon Blanc, Macabeo (p8).
- styles.text: sheet "Young whites, unaged or aged"; pliego has three white types, "Joven, Blanco sin envejecimiento, Blanco con envejecimiento", so the aged white is not a young wine (p1, p6).
- styles.kinds: sheet "fortified" for the generosos; pliego Fino is also a category-1 wine reached "de forma natural, sin necesidad de encabezado", and encabezado is required only for generosos that fall short (p1, p2 note 2, p6).
