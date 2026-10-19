# Manzanilla guide sentence check

Source: pliego de condiciones DOP «Manzanilla – Sanlúcar de Barrameda», PDO-ES-A1482, consolidated per Orden de 13 de mayo de 2026 (BOJA núm. 95 de 20/05/2026), file `Review/sources/fetched/pliego-PDO-ES-A1482-manzanilla.txt` (source id `manzanilla-pliego`). Pages read with `Tools/guides/pages.py`: 1 to 6. Checked 2026-10-19.

Counts: 43 KEEP, 20 FIX, 0 CUT (lede, 4 beats, 2 flight captions, 1 label term). `check_guide.py`: ok, 0 errors, 2 warnings, both confirmed below ("18" = "siglo XVIII" p5; "7" = "siete años" p3).

## Lede
- KEEP p5 "niveles superiores de humedad durante todo el año ... diferenciadas de las del resto de la Zona de Producción" (cellars in Sanlúcar, humidity higher all year)
- KEEP p1 "seco y de sensación salina en boca"

## place
- KEEP p4 "en el noroeste de la provincia de Cádiz, la más meridional de la España peninsular"
- KEEP p4 "enmarcada al norte por el río Guadalquivir"
- KEEP p4 "al oeste y el sur por el Océano Atlántico"
- KEEP p4 "al este por las estribaciones de la Sierra de Cádiz"
- KEEP p4 "horizontes abiertos, dominados por terrenos llanos o suavemente ondulados"
- KEEP p4 "con una pendiente variable, normalmente entre el 10 y el 15 %"
- FIX p4 "abundan las zonas de marismas, restos inundables de lo que fue el Lacus Ligustinus": "flooded marshes left from" became "many marismas, marshes that can flood, the remains of" (inundables = floodable, not flooded)
- FIX p4 "gran parte de la superficie de los términos de El Puerto de Santa María y de Puerto Real está conformado por salinas y esteros, parcialmente inundados por las mareas": Spanish term explained, "salt pans and tidal flats (esteros)"
- KEEP p3 ten municipalities listed in D.1 "Sanlúcar de Barrameda, Jerez de la Frontera, ... Lebrija y San José del Valle"
- KEEP p3 "Zona de Crianza ... constituida por el término municipal de Sanlúcar de Barrameda"
- KEEP p5 "elementos vertebradores de la comarca a lo largo de toda su milenaria historia, que se remonta a tiempos fenicios"
- Flight "The Guadalquivir marshes": FIX p4 caption as above (marshes that can flood, the remains of the Lacus Ligustinus), split into two sentences. Point moved from [-6.22, 36.92] to Nominatim "Marismas del Guadalquivir" [-6.326, 36.956] (about 10 km off).
- Flight "Sanlúcar de Barrameda": KEEP p3 "Zona de Crianza ... término municipal de Sanlúcar de Barrameda". Point within 0.2 km of Nominatim [-6.353, 36.776].
- Missing flights: none added; the guide already flies to the named river and the historic town.

## weather
- KEEP p4 "El clima ... es de carácter cálido"
- KEEP p4 "mínimas del invierno que giran alrededor de los 5 °C y las máximas del verano que se sitúan en torno a los 35 °C"
- KEEP p4 "El riesgo de heladas es mínimo"
- FIX p4 "el efecto regulador del mar hace que las viñas del interior alcancen valores algo más extremos": two linked clauses joined by "and" made into the page's own cause ("The regulating effect of the sea means that ...")
- KEEP p4 "más de 300 días de sol al año"
- KEEP p4 "la pluviometría media anual es de aproximadamente 600 litros por metro cuadrado"
- KEEP p4 "aporta intensos rocíos a la planta, con la consiguiente aminoración en la transpiración"
- KEEP p4 "los dos vientos predominantes"
- KEEP p4 "el viento de levante, proveniente del interior, seco y cálido"
- KEEP p4 "el viento de poniente, que por proceder del océano aporta un elevado grado de humedad"
- FIX p4 "actúa como importante factor moderador, especialmente en el verano": "moderates the heat" (heat added) became "is an important moderating factor"
- FIX p4 "Junto con las frecuentes brisas nocturnas procedentes del cercano océano, estos factores contribuyen al mantenimiento de los niveles de humedad": "raise humidity" became "help keep humidity levels up", with the marshes and salt pans the page names
- FIX p5 "condiciones microclimáticas diferenciadas de las del resto de la Zona de Producción ... humedad durante todo el año y temperaturas más moderadas, tanto en invierno como en verano": comparison with the rest of the zone restored, "where the cellars stand" added from "la ubicación de las bodegas"

## ground
- KEEP p4 "Los suelos predominantes en el viñedo están formados por la roca madre llamada «albariza», una marga blanda de color blanco"
- FIX p4 "fácil de labrar, con una gran capacidad retentiva de la humedad y que permite un excelente desarrollo del sistema radicular": "X, Y and Z" list split; "freely" became "excellently"
- KEEP p4 "carbonato cálcico (normalmente en concentraciones de al menos el 25% y hasta el 40%)"
- KEEP p4 "la arcilla y la sílice, procedente de los caparazones de diatomeas y radiolarios presentes en el mar que ocupaba la zona en el período oligocénico"
- FIX p4 "generalmente situados en las vaguadas y partes bajas de las colinas": hedge restored ("usually found in")
- FIX p4 "además de la caliza encontramos una importante proporción de arcilla y arena, así como un mayor contenido en materia orgánica, lo que le da un color más oscuro y más fertilidad": list split into two sentences
- FIX p4 "Las arenas ... son terrenos predominantes en las viñas costeras, tienen menos de un 20 % de caliza y predominio de arena y arcilla": "mostly sandy" dropped the clay; now "mostly sand and clay"
- FIX p6 "la práctica ausencia de precipitaciones durante la mayor parte del ciclo activo de la planta, el predominio de los vientos secos de levante y la capacidad retentiva ... aseguran vendimias sanas, de gran calidad, con una muy buena maduración": list split; "de gran calidad" restored
- FIX p6 "Los suelos calcáreos predominantes en la zona producen vinos elegantes, con cuerpo y sapidez, con una acidez moderada y una gran capacidad de evolución a largo plazo": list split into two sentences, wording kept to the source's taste words

## rules
- KEEP p3 "variedad Listán Blanco, también denominada Palomino Fino, o bien de la variedad Palomino"
- KEEP p6 "Los viticultores han seleccionado durante siglos la variedad mejor adaptada"
- KEEP p6 "dan a los vinos una alta expresión del terreno y una gran capacidad de envejecimiento"
- KEEP p1 "Categorías vitícolas de los productos: vino y vino de licor"
- FIX p4 "la diferencia entre unos y otros se reduce a la utilización o no de la práctica enológica tradicional de la fortificación": sentence right, cite was missing; p4 added to the beat's cites
- KEEP p2 "incremento de la graduación alcohólica natural de los vinos mediante la adición de alcohol ... admitida exclusivamente para los vinos protegidos de licor"
- KEEP p2 "el alcohol para la fortificación puede tener su origen fuera del Área de Producción"
- FIX p1 "son «vinos generosos» cuyas características son el resultado del particular proceso de crianza biológica": Spanish term "generoso" now explained from the page; one long list sentence split. Numbers p1 "entre 14 y 17 % vol." and "inferior a 4 g/L" confirmed.
- FIX p1 "tonalidades que van del amarillo pajizo al ámbar": "pale straw" became "straw yellow" (no "pale" on the page)
- KEEP p1 "al menos dos de los siguientes aromas propios de la crianza biológica: flores blancas, frutos secos o levadura (masa fresca de pan)"
- KEEP p1 "Puede presentar también notas de madera noble envinada"
- FIX p1 "de sensación salina en boca, pudiendo ser ligeramente ácido y amargo": "is salty" became "leaves a salty feel"; "sour" became the source's "acidic"
- KEEP p1 "crianza biológica que se desarrolla durante un mínimo de dos años en bodegas situadas en el término municipal de Sanlúcar de Barrameda"
- KEEP p2 "«velo de flor», que consiste en una película de levaduras típicas que se desarrolla sobre la superficie libre del vino" and "botas -nombre tradicional ... barricas de roble de capacidad no superior a 1.000 litros"
- FIX p6 "se beneficia extraordinariamente ... de los altos niveles de humedad que propicia el aprovechamiento –gracias a la tradicional arquitectura bodeguera de Sanlúcar– de las frecuentes brisas nocturnas": the cellar architecture the page credits was missing; added
- KEEP p2 "Los vinos podrán envejecerse bien mediante el sistema de «criaderas y solera»"
- KEEP p2 "extracciones o «sacas» periódicas de parte del vino ... y las correspondientes reposiciones o «rocíos» con vino de otra escala más joven"
- KEEP p2 "Se llama «Solera» a la escala final de envejecimiento, de la que se realiza la saca ... para su expedición"
- KEEP p5 "origen histórico que se remonta hasta el siglo XVIII y a la necesidad de satisfacer la demanda de los mercados con vinos de una calidad mantenida en el tiempo, con independencia de las vicisitudes de cada cosecha" (number warning "18" confirmed: XVIII)
- KEEP p2 "el sistema de Añada ... los vinos procedentes de cada una de las vendimias se envejecen separadamente, sin que se realicen mezclas"
- KEEP p5 "naves que partían tanto hacia las Américas como hacia los mercados del norte de Europa. Largas travesías que aconsejaban el «abrigado» (fortificación)"
- FIX p5 "tuvo un papel determinante en la aparición –por selección natural– de las levaduras de velo de flor": "a part" became "a decisive part in the appearance, by natural selection"
- KEEP p3 "tendrá el límite de 11.428 kilogramos"
- KEEP p1 "70 litros de vino por cada 100 kilogramos de uva"
- FIX p5 "la tradicional poda de vara y pulgar, una de las aportaciones más singulares de la zona a la viticultura": Spanish term explained (rod and spur); claim put as the page puts it (a practice growers developed)

## label
- KEEP p3 "«Manzanilla Pasada» podrá utilizarse en aquellos vinos protegidos sometidos a un envejecimiento medio mínimo de siete años, que como consecuencia de su prolongada crianza presenten signos leves de oxidación" (number warning "7" confirmed: siete). The famous style "Manzanilla" is not in `label`. "Añada" (p3) not added: its rule is left to the Consejo Regulador's controls.

## Fact sheet
The sheet's cites point to `manzanilla-doc`, not to this pliego. Disagreements with the pliego:
- grapes.main: sheet empty; pliego p3 "Listán Blanco, también denominada Palomino Fino, o bien de la variedad Palomino".
- grapes.others: sheet lists Pedro Ximénez, Moscatel de Alejandría, Moscatel Grano Menudo; pliego p3 allows only Listán Blanco/Palomino Fino and Palomino.
- styles.kinds: sheet "fortified" only; pliego p1 two categories, "vino y vino de licor", and p2 fortification "exclusivamente a los vinos de licor".
- styles.text: sheet "Pale straw to pale gold"; pliego p1 "del amarillo pajizo al ámbar".
- tastes.text: sheet "Pale gold to straw yellow"; pliego p1 "del amarillo pajizo al ámbar", taste "seco y de sensación salina en boca".
- soil.text: sheet empty; pliego p4 albariza, barros and arenas.
- climate.text / why.text: sheet "intense, lasting activity of the flor yeast"; pliego p5/p6 say higher humidity all year and that biological ageing "se beneficia extraordinariamente" from humidity, with no "intense, lasting" wording.

## Second check
Fresh pass, 2026-10-19, same source and version (`manzanilla-pliego`, PDO-ES-A1482, Orden de 13 de mayo de 2026). Pages read: 1 to 6 (cited), 13 to 16 (grep for wine types and label terms). Counts for this pass only: 67 KEEP, 7 FIX (one of them an added sentence), 0 CUT. `check_guide.py`: ok, 0 errors, 2 warnings, both confirmed ("18" = p5 "siglo XVIII"; "7" = p3 "siete años").

### Titles
- KEEP "Why Manzanilla tastes the way it does" (no factual claim)
- KEEP p4 "enmarcada al norte por el río Guadalquivir, al oeste y el sur por el Océano Atlántico" ("Between a river and the ocean")
- FIX p4 "la proximidad del viñedo a la zona costera aporta intensos rocíos": "Sun, sea mist and two winds" became "Sun, coastal dew and two winds" (the page names dew, not mist)
- KEEP p4 "«albariza», una marga blanda de color blanco ... gran capacidad retentiva de la humedad"; p6 "suelos calcáreos" ("White chalky soil that holds water")
- KEEP p2 "«velo de flor», que consiste en una película de levaduras" ("Aged under a veil of yeast")

### Lede
- KEEP p5 "unos niveles superiores de humedad durante todo el año ... diferenciadas de las del resto de la Zona de Producción"
- KEEP p1 "seco y de sensación salina en boca"

### place
- KEEP p4 "en el noroeste de la provincia de Cádiz"
- KEEP p4 "la más meridional de la España peninsular"
- KEEP p4 "al norte por el río Guadalquivir"
- KEEP p4 "al oeste y el sur por el Océano Atlántico"
- KEEP p4 "al este por las estribaciones de la Sierra de Cádiz"
- FIX p4 "se caracteriza por horizontes abiertos, dominados por terrenos llanos o suavemente ondulados": "The land is open, flat or gently rolling" became "The landscape has open horizons, dominated by flat or gently rolling land" (the page's "dominated by" restored)
- KEEP p4 "colinas con una pendiente variable, normalmente entre el 10 y el 15 %"
- KEEP p4 "abundan las zonas de marismas, restos inundables de lo que fue el Lacus Ligustinus"
- KEEP p4 "salinas y esteros, parcialmente inundados por las mareas"
- KEEP p3 ten municipalities named in D.1, Sanlúcar de Barrameda to San José del Valle
- KEEP p3 "Zona de Crianza ... constituida por el término municipal de Sanlúcar de Barrameda"
- KEEP p5 "elementos vertebradores de la comarca a lo largo de toda su milenaria historia, que se remonta a tiempos fenicios"
- Flight "The Guadalquivir marshes": KEEP p4 caption (2 sentences, "al norte por el río Guadalquivir", "restos inundables de lo que fue el Lacus Ligustinus"). Nominatim "Marismas del Guadalquivir" [-6.3258, 36.9562]: point matches.
- Flight "Sanlúcar de Barrameda": KEEP p3 "Zona de Crianza". Nominatim [-6.3535, 36.7761]: point within 0.3 km.
- Missing flights: none; the guide flies to the named river's marshes as well as the town.

### weather
- KEEP p4 "es de carácter cálido"
- KEEP p4 "mínimas del invierno que giran alrededor de los 5 °C y las máximas del verano ... en torno a los 35 °C"
- KEEP p4 "El riesgo de heladas es mínimo"
- KEEP p4 "el efecto regulador del mar hace que las viñas del interior alcancen valores algo más extremos"
- KEEP p4 "más de 300 días de sol al año"
- KEEP p4 "la pluviometría media anual es de aproximadamente 600 litros por metro cuadrado"
- KEEP p4 "aporta intensos rocíos a la planta, con la consiguiente aminoración en la transpiración"
- KEEP p4 "los dos vientos predominantes"
- FIX p4 "el viento de levante, proveniente del interior, seco y cálido": "dry and hot" became "dry and warm" (cálido)
- KEEP p4 "el viento de poniente, que por proceder del océano aporta un elevado grado de humedad"
- KEEP p4 "actúa como importante factor moderador, especialmente en el verano"
- FIX p4 "Junto con las frecuentes brisas nocturnas procedentes del cercano océano, estos factores contribuyen al mantenimiento de los niveles de humedad": "X, Y and Z" list rewritten in the page's order ("Together with frequent night breezes ..., the marshes and salt pans help keep humidity levels up")
- KEEP p5 "humedad durante todo el año y temperaturas más moderadas, tanto en invierno como en verano"

### ground
- KEEP p4 "Los suelos predominantes en el viñedo están formados por la roca madre llamada «albariza», una marga blanda de color blanco"
- KEEP p4 "fácil de labrar"
- KEEP p4 "gran capacidad retentiva de la humedad y que permite un excelente desarrollo del sistema radicular"
- KEEP p4 "carbonato cálcico (normalmente en concentraciones de al menos el 25% y hasta el 40%)"
- KEEP p4 "la arcilla y la sílice, procedente de los caparazones de diatomeas y radiolarios ... período oligocénico"
- KEEP p4 "«barros» ... generalmente situados en las vaguadas y partes bajas de las colinas"
- KEEP p4 "además de la caliza encontramos una importante proporción de arcilla y arena"
- KEEP p4 "mayor contenido en materia orgánica, lo que le da un color más oscuro y más fertilidad"
- KEEP p4 "Las arenas por su parte son terrenos predominantes en las viñas costeras"
- KEEP p4 "menos de un 20 % de caliza y predominio de arena y arcilla"
- KEEP p6 "la práctica ausencia de precipitaciones durante la mayor parte del ciclo activo de la planta"
- KEEP p6 "el predominio de los vientos secos de levante y la capacidad retentiva ... aseguran vendimias sanas, de gran calidad, con una muy buena maduración"
- KEEP p6 "vinos elegantes, con cuerpo y sapidez"
- KEEP p6 "con una acidez moderada y una gran capacidad de evolución a largo plazo"

### rules
- KEEP p3 "variedad Listán Blanco, también denominada Palomino Fino, o bien de la variedad Palomino"
- KEEP p6 "Los viticultores han seleccionado durante siglos la variedad mejor adaptada"
- KEEP p6 "dan a los vinos una alta expresión del terreno y una gran capacidad de envejecimiento"
- KEEP p1 "Categorías vitícolas de los productos: vino y vino de licor"
- KEEP p4 "la diferencia entre unos y otros se reduce a la utilización o no de la práctica enológica tradicional de la fortificación"
- KEEP p2 "adición de alcohol ... admitida exclusivamente para los vinos protegidos de licor"
- KEEP p2 "el alcohol para la fortificación puede tener su origen fuera del Área de Producción"
- FIX p1 "son «vinos generosos» cuyas características son el resultado del particular proceso de crianza biológica": "a vino generoso, a wine whose character comes from biological ageing" defined generoso by this DOP's ageing; now "Both kinds are vinos generosos, so a generoso here may be fortified or not. Their character is the result of biological ageing." Next sentence's "It" became "Manzanilla".
- KEEP p1 "seco"; "entre 14 y 17 % vol."; "inferior a 4 g/L"
- KEEP p1 "del amarillo pajizo al ámbar"
- KEEP p1 "al menos dos de los siguientes aromas propios de la crianza biológica: flores blancas, frutos secos o levadura (masa fresca de pan)"
- KEEP p1 "Puede presentar también notas de madera noble envinada"
- KEEP p1 "de sensación salina en boca, pudiendo ser ligeramente ácido y amargo"
- KEEP p1 "crianza biológica que se desarrolla durante un mínimo de dos años en bodegas situadas en el término municipal de Sanlúcar de Barrameda"
- KEEP p2 "película de levaduras típicas que se desarrolla sobre la superficie libre del vino"; "botas ... capacidad no superior a 1.000 litros"
- KEEP p6 "se beneficia extraordinariamente ... de los altos niveles de humedad que propicia el aprovechamiento –gracias a la tradicional arquitectura bodeguera de Sanlúcar– de las frecuentes brisas nocturnas"
- KEEP p2 "sistema de «criaderas y solera»"
- KEEP p2 "«sacas» periódicas de parte del vino ... «rocíos» con vino de otra escala más joven"
- KEEP p2 "Se llama «Solera» a la escala final de envejecimiento, de la que se realiza la saca ... para su expedición"
- KEEP p5 "se remonta hasta el siglo XVIII ... vinos de una calidad mantenida en el tiempo, con independencia de las vicisitudes de cada cosecha"
- FIX p2 "se envejecen separadamente, sin que se realicen mezclas con vinos procedentes de vendimias diferentes": "never blended" widened the rule; now "never blended with wine from other harvests", and "añada (vintage)" explained
- KEEP p5 "naves que partían tanto hacia las Américas como hacia los mercados del norte de Europa ... «abrigado» (fortificación) ... para evitar su deterioro"
- KEEP p5 "tuvo un papel determinante en la aparición –por selección natural– de las levaduras de velo de flor"
- FIX (added) p13 "referencia a la categoría «Manzanilla Pasada», siempre y cuando esta circunstancia pueda ser debidamente acreditada ... podrá incluirse la referencia «Manzanilla Fina»": the rules beat named neither protected category; new paragraph added, p13 added to the beat's cites
- KEEP p3 "tendrá el límite de 11.428 kilogramos"
- KEEP p1 "70 litros de vino por cada 100 kilogramos de uva"
- KEEP p5 "la tradicional poda de vara y pulgar, una de las aportaciones más singulares de la zona a la viticultura"
- Missing wine types: grep of the whole pliego finds vino, vino de licor, vinos generosos (p1), Manzanilla Pasada and Manzanilla Fina (p3, p13), Añada (p2, p3). All are now named in the rules beat. No sparkling, dulce or other style is protected. Whether a generoso is fortified is now said plainly.

### label
- KEEP p3 "«Manzanilla Pasada» podrá utilizarse en aquellos vinos protegidos sometidos a un envejecimiento medio mínimo de siete años, que como consecuencia de su prolongada crianza presenten signos leves de oxidación" ("7" = siete). Not a famous style on the fact sheet, so it stays. Not added this pass (left for the owner): p14 Pale/Golden, Vieja (over 7 years)/Muy Vieja (over 10 years), Muy Seco/Extra Seco/Seco, pago (85% rule); p15 Single Barrel, Single Vineyard, En rama.

### Fact sheet (second check)
The sheet has been updated since the first check: grapes, soil, climate, tastes and why now agree with p1 to p6. Remaining disagreements:
- styles.kinds: sheet "fortified" only; pliego p1 "vino y vino de licor", p2 fortification "exclusivamente a los vinos de licor", p4 the two differ only in "la utilización o no ... de la fortificación". Unfortified vino is also protected.
- famous.styles: cite is `manzanilla-doc:p1`, not the pliego; text "aged wholly under flor" has no "wholly" in the pliego, which (p3) lets Manzanilla Pasada show "signos leves de oxidación" after long ageing. Pliego p1 says only that the wines' characteristics are "el resultado del particular proceso de crianza biológica".
