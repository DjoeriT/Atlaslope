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
