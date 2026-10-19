# Condado de Huelva guide sentence check

Source: Pliego de condiciones DOP «Condado de Huelva», PDO-ES-A1485 (Review/sources/fetched/pliego-PDO-ES-A1485-condado-de-huelva.txt), version "consolidado de acuerdo con la Orden de 27 de febrero de 2026 (BOJA núm. 44 de 05/03/2026)". Page numbers are pages.py numbering. Checked 2026-10-19 against `content/guides/condado-de-huelva.json`. `check_guide.py`: 0 errors, 3 number warnings confirmed below.

## Lede
- FIX p9 "terrenos llanos o ligeramente ondulados"; p8 "lindando con el Parque Nacional de Doñana"; p9 "le agrega matices oceánicos que se perciben en sus vinos". "flat land" became "flat or gently rolling land" (hedge dropped). "Atlantic touches" became "oceanic touches".
- FIX p8 "acondicionada para mantener una temperatura entre 15-22 °C durante todo el año". "Its cellars ... for ageing wine in oak" became "The cellars ... while the wine ages": the sentence names no oak, and "Its" had no subject.

## place (donana)
- KEEP p8 "pertenece a la depresión del Guadalquivir, situada en el cuadrante Suroriental de la provincia de Huelva"
- KEEP p8 "desde las estribaciones de la Sierra de Aracena hasta la costa, lindando con el Parque Nacional de Doñana"
- FIX p8 "considerado como uno de los pulmones de Europa, y siendo la zona del Condado de Huelva denominada «Entorno de Doñana»". "called" became "considered". "the part of Condado next to it" became "the Condado de Huelva area" (the page names the whole zone). Term explained: "the surroundings of Doñana".
- KEEP p9 "pendiente nunca superiores al 17%"
- KEEP p9 "altitudes comprendidas entre los 50 y los 180 m de Sur a Norte"
- KEEP p7 "unidades geográficas más pequeñas, con características edáficas y microclimáticas únicas ... «pagos», son parajes o sitios rurales"
- KEEP p8 "hay que fecharlo en el siglo XIV" (number 14 confirmed as roman XIV)
- KEEP p8 "acreditado oficialmente desde el año 1932 ... siendo publicado su primer Reglamento en el año 1964"
- Flight Doñana National Park: KEEP p8 caption. Point moved from [-6.45, 37.0] to Nominatim [-6.4007, 36.968] (about 5 km off).
- Flight Sierra de Aracena: KEEP p8 "desde las estribaciones de la Sierra de Aracena hasta la costa". Point moved from [-6.55, 37.9] to Nominatim [-6.8584, 37.827] (about 28 km off).
- Missing flights: none added. The guide already flies to the two named features beyond the place.

## weather (atlantic)
- KEEP p9 "ámbito climático mediterráneo"
- FIX p9 "su apertura atlántica, facilitada por la disposición del relieve, le agrega matices oceánicos que se perciben en sus vinos". "can be perceived" became "show" (the page does not hedge).
- FIX p9 "Por tal motivo su clima es relativamente húmedo". "also relatively humid" became "For that reason ... relatively humid" (the page gives the cause).
- KEEP p9 "La temperatura media anual oscila entre los 15,8 ºC y 16,9 ºC"
- KEEP p9 "La media de las temperaturas máximas es bastante estable, 22,5 ºC"
- KEEP p9 "La media de las temperaturas mínimas oscila entre 9,8 ºC y 11,9 ºC"
- FIX p9 "El régimen pluviométrico es variable, oscilando entre 810 mm y los 716 mm". "varies from year to year" became "is variable" (the page does not say year to year).
- KEEP p9 "El índice de insolación medio es de 3.000 a 3.100 horas de sol efectivo"
- KEEP p9 "La humedad relativa oscila entre el 60% y el 80%"

## ground (soils)
- KEEP p4 three definitions "Albarizas", "Arenas", "Barros"
- FIX p4 "Suelos alcalinos arenosos de color blanquecino, ricos en caliza y de buena permeabilidad". "permeable" became "with good permeability".
- KEEP p4 "ácidos o neutros, generalmente silíceos con un porcentaje de arenas finas en torno al 75%. Son suelos de muy buena permeabilidad"
- KEEP p4 "suelos arcillo-arenosos, corresponden a los suelos rojos mediterráneos ... en torno al 45% de arcilla y alrededor del 42% de arenas finas"

## rules (solera)
- FIX p7 "De ellas se considera principal la variedad Zalema". The page names it principal among the white list, so "main grape" became "main white grape".
- KEEP p7 "La producción máxima por hectárea será de 12.000 kg de uva, excepto para la variedad Zalema ... 18.000 Kg"
- KEEP p7 "Zalema, Palomino Fino, Listán del Condado"
- KEEP p8 "vinos tintos y rosados ... Syrah, Tempranillo"
- FIX p2 "Los tipos de vinos Condado de Huelva Blanco, Tintos y Rosados ... pueden ser: «seco» ... o «dulce»". "white, red and rosado wines, from dry to sweet" became "Reds and rosados can be anything from dry to sweet, and so can the white type called Condado de Huelva". The X, Y and Z list is gone.
- FIX p1, p2 "Vinos generosos ... Condado Pálido o Fino, Condado Viejo u Oloroso"; "Condado Pálido o Fino 14-17 ≤4; Condado Viejo u Oloroso 16-22 ≤4". "fortified wines called generosos. Some are dry." became "Generosos are dry wines of 14 to 22% vol, such as ...". Generosos sit in category 1 as well as category 3, so "fortified" was not the page's word, and all generosos are ≤4 g/l, not "some".
- FIX p1 "Vinos generosos de licor ... Pale Dry, Pale Cream, Medium, Cream". Now reads "Generosos de licor are liqueur wines that run from Pale Dry to Cream".
- FIX p1 "Vinos de licor dulces ... Dulce, Mistela, Pedro Ximénez y Moscatel". "A fourth family" was dropped (the page sorts by category, not four families). The Spanish term is explained, and the three-item list is cut to two.
- CUT "There is no sparkling wine." No page says it. p1 lists the types and is silent on sparkling wine.
- FIX p4 "Velo de Flor: capa o película flotante de levaduras"; "Crianza Oxidativa: ... mediante la acción del oxígeno"; p5 "En los vinos generosos y generosos de licor, la crianza biológica y oxidativa". "through contact with air" became "through the action of oxygen".
- KEEP p3 "Condado Viejo u Oloroso: Color de oro viejo a caoba oscura. Aroma a frutos secos y madera ... pudiendo presentar notas a barniz"
- FIX p4 "Mistela: De color dorado a caoba intenso. Aromas frutales. En boca denso". "dense" became "dense on the palate".
- KEEP p8 "cachones de forma piramidal ... más cerca del suelo se denomina solera y es de donde se realizan las sacas ... primera criadera y así sucesivamente"
- KEEP p4 "Sistema dinámico de crianza en vinos: Denominado sistema de criaderas y soleras"
- KEEP p8 "botas o bocoyes de roble americano"; p4 "Bocoy: Barrica de madera de capacidad inferior a mil litros tradicional de la zona"
- FIX p8 "La penetración del oxígeno a través de la madera está calculada en 25 cm³ por litro en un año". "about 25" became "is calculated at 25".
- KEEP p5 "vejez promedia de al menos dos años", "capacidad máxima de 1000 litros"
- KEEP p8 "temperatura entre 15-22 °C durante todo el año, una humedad relativa ... entre el 60% y 80%"
- KEEP p8 "techos altos, ventanas bien orientadas"
- FIX p8 "un regado de los suelos de albero en las fechas de altas temperaturas". The unexplained term "albero" was dropped, so it now reads "the floors are watered".
- KEEP p5 "mosto obtenido de uvas pasificadas de la variedad Pedro Ximénez ... alcohol neutro ... procedente de la región «Montilla -Moriles» ... vasijas de madera de roble de capacidad igual o inferior a 1.000 litros durante un período mínimo de veinticuatro meses"
- FIX p6 "«Gran Reserva»: ... vinos tintos ... sesenta meses ... al menos dieciocho meses en barricas de roble cuya capacidad no exceda de 330 litros". "of the top tier" was dropped because the page does not rank the tiers. Added cite p1 to the beat.

## label
- KEEP p5 Roble "no inferior a tres meses en barricas de roble cuya capacidad no exceda de 330 litros ... deberá indicarse ... el periodo de tiempo"
- KEEP p5-6 Crianza "2 años para los vinos tintos y de 18 meses ... blancos y rosados, contados a partir del 1 de noviembre ... al menos 6 meses ... 330 litros"
- KEEP p6 Reserva "treinta y seis meses ... doce meses"; "veinticuatro meses ... seis meses" (numbers 36 and 24 confirmed in words)
- KEEP p11 Viejo "edad media mínima de 7 años ... capacidad máxima de 600 litros ... resto de vinos ... al menos 3 años"
- KEEP p3 Abocado "superior e igual a 4 gramos por litro e inferior a 50 gramos por litro"
- KEEP p11 de Pasas "uvas pasificadas ... contenido en azúcar sea superior a 190 gr/litro"
- KEEP p11 Naturalmente Dulce "vinos blancos elaborados sin aumento artificial ... natural superior a 15% vol. ... adquirido no inferior a 13% vol."
- KEEP p10 en rama "vinos que no hayan sido objeto de otra práctica de estabilización distinta al filtrado"
- No label term repeats a famous style.

## Fact sheet
The sheet cites `condado-de-huelva-doc` and `-wiki`, not the pliego. Where it disagrees with the pliego:
- styles.kinds / styles.text: the sheet says white, red, fortified and sweet, "Whites and reds". The pliego (p1) says "Vinos blancos, tintos y rosados", so rosado is missing.
- grapes.others: the sheet says "Listán B". The pliego (p7) says "Listán del Condado". The sheet also leaves out Moscatel de Grano Menudo, Verdejo, Malvasía Aromática, Albillo Mayor and Montúa (p7), plus Petit Verdot, Listán Prieto, Mollar Cano, Garnacha Tinta and Tintilla de Rota (p8).
- tastes (whites): the sheet says "pale straw with green tints ... fresh fruit and wild herbs; light yet intense". The pliego (p3) says Joven "amarillo pálido a dorado pálido. Aromas frutales como manzana verde y florales"; Condado de Huelva "amarillo pajizo a oro viejo ... fruta de hueso". It has no green tints, herbs or "light yet intense".
- tastes (reds): the sheet says "cherry with garnet rims; powerful, elegant aromas; tasty, concentrated". The pliego (p4) says "De color cereza a rojo teja. Intensidad olfativa y frutal perceptible ... astringencia y densidad perceptible".
- famous Condado Viejo: the sheet says "Liqueur wine from white varieties, amber to mahogany, toasted almond aroma". The pliego (p1, p3) says it is a vino generoso (category 1 and 3), "Color de oro viejo a caoba oscura. Aroma a frutos secos y madera ... notas a barniz".
- famous Mistela: the sheet says "Dark ... macerated fruit aromas, creamy on the palate". The pliego (p4) says "De color dorado a caoba intenso. Aromas frutales. En boca denso".
- famous Gran Reserva: the sheet says "dark cherry colour, mineral and complex aroma; fleshy and powerful". The pliego has no Gran Reserva tasting note. p6 sets only ageing (red: 60 months, 18 in oak ≤330 l). p4 gives reds in general "cereza a rojo teja".
- why: the sheet says "Many wines age in solera". The pliego (p5) says generosos and generosos de licor age in "criaderas y solera o por el sistema de añadas".

## Second check

Source: Pliego de condiciones DOP «Condado de Huelva», PDO-ES-A1485, version "consolidado de acuerdo con la Orden de 27 de febrero de 2026 (BOJA núm. 44 de 05/03/2026)". Fresh pass, 2026-10-19, pages 1 to 11 read with pages.py. Counts are this pass only: KEEP 50, FIX 20, CUT 1. `check_guide.py` after edits: 0 errors, 3 warnings (14 = "siglo XIV" p8; 36 = "treinta y seis" p6; 24 = "veinticuatro" p6, all confirmed).

### Lede
- FIX p9 "La zona de elaboración y envejecimiento del vino se extiende sobre terrenos llanos o ligeramente ondulados"; p8 "lindando con el Parque Nacional de Doñana"; p9 "matices oceánicos que se perciben en sus vinos". "Vines grow on" became "The wine is made and aged on": the page describes the making and ageing zone, not the vines.
- KEEP p8 "acondicionada para mantener una temperatura entre 15-22 °C durante todo el año"

### place (donana)
- FIX title p9 "terrenos llanos o ligeramente ondulados". "Flat land beside Doñana" became "Flat to gently rolling land beside Doñana" (hedge dropped in the title).
- KEEP p8 "pertenece a la depresión del Guadalquivir, situada en el cuadrante Suroriental de la provincia de Huelva"
- KEEP p8 "desde las estribaciones de la Sierra de Aracena hasta la costa, lindando con el Parque Nacional de Doñana"
- KEEP p8 "considerado como uno de los pulmones de Europa, y siendo la zona del Condado de Huelva denominada «Entorno de Doñana»"
- KEEP p9 "pendiente nunca superiores al 17%"
- KEEP p9 "entre los 50 y los 180 m de Sur a Norte"
- KEEP p7 "unidades geográficas más pequeñas, con características edáficas y microclimáticas únicas ... «pagos», son parajes o sitios rurales"
- KEEP p8 "hay que fecharlo en el siglo XIV"
- KEEP p8 "acreditado oficialmente desde el año 1932 ... primer Reglamento en el año 1964"
- KEEP flight "Doñana National Park": Nominatim 36.9680, -6.4007 (national_park), matches the guide point.
- KEEP flight "Sierra de Aracena": Nominatim 37.8270, -6.8584 (mountain_range), matches the guide point.
- FIX caption p8 "lindando con el Parque Nacional de Doñana ... denominada «Entorno de Doñana»". "borders the vineyards and shapes the Entorno de Doñana" became "The national park the area borders. The Condado de Huelva area is known as the Entorno de Doñana." The page names the area, it does not say the park shapes it.
- FIX caption p8 "desde las estribaciones de la Sierra de Aracena hasta la costa". "The hills where the vineyard area begins" became "The Condado de Huelva runs from the foothills of this range down to the coast" (foothills, not the range itself).
- Missing flights: none added. The pliego names no other river, valley or historic town it describes (p7 only lists municipalities).

### weather (atlantic)
- FIX title p9 "su apertura atlántica". "with the Atlantic leaning in" became "open to the Atlantic".
- KEEP p9 "ámbito climático mediterráneo"
- KEEP p9 "su apertura atlántica, facilitada por la disposición del relieve, le agrega matices oceánicos que se perciben en sus vinos"
- KEEP p9 "Por tal motivo su clima es relativamente húmedo"
- KEEP p9 "La temperatura media anual oscila entre los 15,8 ºC y 16,9 ºC"
- KEEP p9 "La media de las temperaturas máximas es bastante estable, 22,5 ºC" / "mínimas oscila entre 9,8 ºC y 11,9 ºC"
- KEEP p9 "El régimen pluviométrico es variable, oscilando entre 810 mm y los 716 mm"
- KEEP p9 "3.000 a 3.100 horas de sol efectivo"
- KEEP p9 "La humedad relativa oscila entre el 60% y el 80%"

### ground (soils)
- FIX title p4 "Albarizas: Suelos alcalinos arenosos de color blanquecino"; "Barros ... suelos rojos mediterráneos ... 45% de arcilla". "White albariza, sand and red clay" (an X, Y and Z list; "white" and "clay" both widened) became "Three soils, from whitish albariza to red barro".
- CUT "Three soils are named." A line about the source, not the place.
- FIX p4 "Suelos alcalinos arenosos de color blanquecino, ricos en caliza y de buena permeabilidad". The "whitish, alkaline and sandy" list became "whitish alkaline sandy soils".
- KEEP p4 "ácidos o neutros, generalmente silíceos con un porcentaje de arenas finas en torno al 75%. Son suelos de muy buena permeabilidad"
- KEEP p4 "suelos arcillo-arenosos, corresponden a los suelos rojos mediterráneos ... en torno al 45% de arcilla y alrededor del 42% de arenas finas"

### rules (solera)
- FIX title. "Made to age in oak" is widened: Joven wines (p2) are not aged. Now "From Joven whites to solera-aged generosos" (p2 "Joven"; p8 "Los vinos generosos y generosos de licor se envejecen por el tradicional sistema de criaderas y soleras").
- KEEP p7 "De ellas se considera principal la variedad Zalema" (the list covers the white-wine, generoso and licor varieties)
- KEEP p7 "12.000 kg de uva, excepto para la variedad Zalema ... 18.000 Kg"
- KEEP p7 "Zalema, Palomino Fino, Listán del Condado"
- KEEP p8 "vinos tintos y rosados ... Syrah, Tempranillo"
- FIX (missing types) p2 "VINOS BLANCOS: Joven, Condado de Huelva, Tradicional, Vino de Pasto". Added "Whites come as Joven and Condado de Huelva, or as Tradicional and Vino de Pasto."
- FIX (missing type) p2 "VINOS TINTOS Y ROSADOS: Joven, Roble, Crianza, Reserva, Gran Reserva". Added "Reds and rosados come as Joven or with oak ageing."
- FIX (missing types) p5-6 Roble "tres meses", Crianza "2 años", Reserva "treinta y seis meses", Gran Reserva "sesenta meses". Added "Aged reds and rosados go from Roble, with the shortest time in oak, to Gran Reserva, with the longest; Crianza and Reserva sit between."
- KEEP p2 "Los tipos de vinos Condado de Huelva Blanco, Tintos y Rosados ... «seco» ... o «dulce»"
- FIX p2 "Condado Pálido o Fino 14-17 ≤4; Condado Viejo u Oloroso 16-22 ≤4"; p3 "podrá alcanzar un contenido de azúcares reductores de hasta 9 gramos por litro". "Generosos are dry wines of 14 to 22% vol" became "Generosos have 14 to 22% vol and at most 4 g/l of sugar". "Dry" is not the page's word.
- FIX (added) p3 "El tipo de vino «Condado Viejo» u «Oloroso», «Amontillado» y «Palo Cortado», como consecuencia de los procesos de concentración asociados a la crianza oxidativa podrá alcanzar ... hasta 9 gramos por litro". Added as two sentences (no X, Y and Z list).
- FIX (missing types) p1 "Condado Pálido o Fino, Condado Viejo u Oloroso, Amontillado y Palo Cortado". Amontillado and Palo Cortado were missing; the "such as" sentence now names all four.
- FIX (added, fortified question) p1 "Categoría vitícola 1, Vinos ... b) Vinos generosos"; "Categoría vitícola 3, Vinos de Licor ... a) Vinos generosos". Added "A generoso can be a plain wine or a liqueur wine." The pliego never says a generoso must be fortified: it defines «Encabezado» (p4) but uses it only for the Pedro Ximénez must (p5).
- FIX (added) p5 "Para los vinos generosos la graduación alcohólica volumétrica natural será como mínimo de 10,5% vol."; p2 "mínimo será de 14% vol. para los vinos «Finos» ... de la categoría 1 y de 15% vol. para la categoría 3, salvo la excepción ... prolongado envejecimiento ... 14% vol."
- KEEP p1 "Vinos generosos de licor" under "Categoría vitícola 3, Vinos de Licor"
- FIX (missing types) p1 "Pale Dry, Pale Cream, Medium, Cream"; p2 "Pale Dry 15-22 ≥4 < 50 ... Cream 15-22 ≥115 ≤140". "run from Pale Dry to Cream" now names Pale Cream and Medium, with the two end sugar ranges.
- FIX (missing types) p1 "Vinos de licor dulces ... Dulce, Mistela, Pedro Ximénez y Moscatel". Moscatel and Dulce added.
- KEEP p4 "Velo de Flor: capa o película flotante de levaduras"; "Crianza Oxidativa: ... mediante la acción del oxígeno"; p5 "la crianza biológica y oxidativa"
- KEEP p3 "Condado Viejo u Oloroso: Color de oro viejo a caoba oscura"
- KEEP p3 "Aroma a frutos secos y madera ... pudiendo presentar notas a barniz"
- KEEP p4 "Mistela: De color dorado a caoba intenso. Aromas frutales. En boca denso"
- KEEP p8 "botas o bocoyes de roble americano en cachones de forma piramidal"
- KEEP p8 "más cerca del suelo se denomina solera y es de donde se realizan las sacas"
- KEEP p8 "se reponen estas soleras con el vino que se encuentra en la hilera inmediatamente superior denominada primera criadera y así sucesivamente"
- KEEP p4 "Denominado sistema de criaderas y soleras"
- KEEP p8 "Las botas y bocoyes de roble americano utilizadas en el Condado de Huelva"; p4 "Bocoy: ... tradicional de la zona"
- KEEP p8 "La penetración del oxígeno a través de la madera está calculada en 25 cm³ por litro en un año"
- KEEP p5 "capacidad máxima de 1000 litros, durante un período de tiempo de vejez promedia de al menos dos años"
- KEEP p8 "temperatura entre 15-22 °C durante todo el año, una humedad relativa ... entre el 60% y 80%"
- KEEP p8 "techos altos, ventanas bien orientadas"
- KEEP p8 "un regado de los suelos de albero en las fechas de altas temperaturas"
- FIX p5 "alcohol neutro de origen vínico para prevenir la fermentación ... una vez encabezado ... vasijas de madera de roble de capacidad igual o inferior a 1.000 litros durante un período mínimo de veinticuatro meses". "fortified" became "with neutral wine alcohol added to stop fermentation", and the 1,000-litre limit was added.
- KEEP p6 "vinos tintos ... sesenta meses"
- KEEP p6 "al menos dieciocho meses en barricas de roble cuya capacidad no exceda de 330 litros"

### label
- KEEP p5 Roble "no inferior a tres meses en barricas de roble cuya capacidad no exceda de 330 litros ... el periodo de tiempo"
- KEEP p5-6 Crianza "2 años para los vinos tintos y de 18 meses ... contados a partir del 1 de noviembre ... al menos 6 meses"
- KEEP p6 Reserva "treinta y seis meses ... doce meses"; "veinticuatro meses ... seis meses"
- FIX p11 Viejo "en los vinos generosos y vinos generosos de licor amparados, encuadrados en la categoría vitícola 3 (vinos de licor) ... 7 años ... 600 litros". The 7-year rule is only for those classed as liqueur wines; the text now says so.
- KEEP p3 Abocado "superior e igual a 4 gramos por litro e inferior a 50 gramos por litro"
- KEEP p11 de Pasas "vinos de licor ... uvas pasificadas ... superior a 190 gr/litro"
- KEEP p11 Naturalmente Dulce "vinos blancos elaborados sin aumento artificial ... natural superior a 15% vol. ... adquirido no inferior a 13% vol."
- KEEP p10 en rama "no hayan sido objeto de otra práctica de estabilización distinta al filtrado"
- No label term repeats a famous style (Condado Viejo, Generoso, Mistela, Gran Reserva). No sparkling wine is protected (grep "espum" finds nothing), so none is named.

### Fact sheet (second check)
The sheet has been revised since the first check; earlier disagreements on rosado, Listán and the tasting notes are gone. Remaining:
- why.text: sheet says "Atlantic influence softens a Mediterranean climate". Pliego p9 says the Atlantic opening "le agrega matices oceánicos" and makes the climate "relativamente húmedo"; it does not say "softens".
- famous.styles Generoso: sheet says "Dry ... straw yellow to dark mahogany, nutty". Pliego p3 lets Condado Viejo, Amontillado and Palo Cortado reach 9 g/l of sugar, and gives Fino yeast aromas ("Aromas propios de la crianza como puede ser la levadura"), not nuts.
- famous.styles Gran Reserva: sheet says "Red aged at least 60 months, 18 in oak". Pliego p6 also has white and rosado Gran Reserva (48 months, at least 6 in oak ≤330 l).
- styles.text: sheet says generosos are "unfortified or fortified". Pliego p1 puts generosos in category 1 (vinos) and category 3 (vinos de licor) and never uses or requires fortification for them.
