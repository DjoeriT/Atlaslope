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
