# Lebrija guide sentence check

Source: Pliego de condiciones del Vino de Calidad de «Lebrija», PDO-ES-A1478 (Review/sources/fetched/pliego-PDO-ES-A1478-lebrija.txt), version "modified by Orden de 1 de septiembre de 2021 (BOJA 177 of 14/09/2021)" per data/SOURCES.md (the text carries no version line). Page numbers are pages.py numbering. Checked 2026-10-19 against `content/guides/lebrija.json`. `check_guide.py`: 0 errors, 6 number warnings confirmed below.

## Lede
- KEEP p5 "Los viñedos de la zona delimitada se encuentran en la campiña adyacente a las marismas"; p6 "La práctica totalidad de los terrenos de la zona considerada son llanos"
- KEEP p6 "un matiz de aroma o sabor sutil y característico lebrijano, a veces descrito como salino"

## place
- FIX p5 "se haya enclavada dentro de la «Comarca del Bajo Guadalquivir» ... La comarca está situada en el extremo Suroeste de la Península Ibérica, en el margen derecho del Río Guadalquivir". The page places the comarca there, not Lebrija itself: the sentence now says Lebrija lies in the Bajo Guadalquivir district, which is there.
- FIX p5 "delimitada por el triángulo que forman la ciudad de Sevilla, El Parque Nacional de Doñana, y la fachada atlántica de la provincia de Cádiz". Split into three sentences to drop the "X, Y and Z" list.
- KEEP p5 "Los viñedos de la zona delimitada se encuentran en la campiña adyacente a las marismas"
- KEEP p5 "lo que condiciona su mesoclima y suelo"
- KEEP p4 "constituida por los términos municipales de Lebrija y El Cuervo, de la provincia de Sevilla"
- FIX p6 "la tradición vitivinícola de Lebrija es inmemorial". "Wine here is old" became "Lebrija's wine tradition goes back beyond memory".
- KEEP p6 "la fundación de Lebrija, como «Lepriptza», se atribuye los fenicios hacia el siglo VII antes de Cristo" (number 7 confirmed as roman VII)
- FIX p6 "estadísticas del siglo XIX (1844) que se dedicaban a viñas 324 aranzadas (145 ha.) en 137 parcelas. En 1856 había una extensión mayor que abastecía a 53 cosecheros de vino". "By 1844" became "In 1844"; split in two; "there were 53 wine producers" became "a larger area supplied 53 wine growers".
- Flight Doñana National Park: KEEP p5 caption "el triángulo que forman la ciudad de Sevilla, El Parque Nacional de Doñana, y la fachada atlántica". Point moved from [-6.44, 37.0] to Nominatim [-6.4007, 36.968] (about 5 km off).
- Missing flights: none added. The guide already flies to Doñana and the Sierra de Gibalbín.

## weather
- FIX p5 "El clima es cálido de tipo continental mediterráneo, suavizado por las corrientes atlánticas". "hot, continental and Mediterranean" became "warm, of the continental Mediterranean type" (one type, not a list).
- KEEP p5 "Tanto en el otoño como en la primavera, las temperaturas son suaves"
- FIX p5 "el verano, el cual es largo y riguroso, con máximas que pueden sobrepasar los 40º, siendo el mes de agosto el más caluroso". Split in two (August is its own sentence).
- FIX p5 "la insolación media anual es del orden de 3000 horas anuales, lo que representa un 65 % de la insolación máxima posible". "Sun is plentiful" dropped (not the page's words).
- KEEP p5 "La distribución de las lluvias es irregular"
- FIX p5 "correspondiendo como meses más lluviosos del año octubre, diciembre y marzo". Reworded to avoid the "X, Y and Z" list.
- KEEP p5 "La media anual de la humedad relativa es del orden del 70 %" ("Humidity" became "Relative humidity")
- KEEP p5 "para descender a un mínimo entre 49 y 56 en el mes de julio, durante la maduración" ("drops to" became "drops to a low of")
- FIX p5 "La práctica carencia de heladas, lo moderado de las temperaturas mínimas mensuales, la corta duración del invierno, y con temperaturas medias siempre superiores a 10º". List split in two sentences; "always" restored.
- FIX p5 "las condiciones para la vegetación son excepcionales, y las condiciones para una buena maduración también, lo que permite obtener las características indicadas de los vinos con rendimientos relativamente elevados". "The same conditions allow relatively high yields" followed the cool-nights sentence, so it pointed at the wrong cause; it now follows the frost and winter lines and says growth and ripening conditions are exceptional and give the wines' character with relatively high yields.
- KEEP p6 "La disminución de las temperaturas nocturnas (mínimas mensuales bajas) durante la estación estival indica unas condiciones sobresalientes para la obtención de vinos de notable y característica aromaticidad"

## ground
- KEEP p6 "son llanos, es decir de una pendiente inferior al 3%"
- KEEP p6 "situados todos ellos en las estribaciones de la Sierra de Gibalbin, tienen una pendiente entre el 10 y el 20%"
- FIX p6 "Las tierras albarizas, con buen drenaje y profundidad, son las que predominan en los viñedos lebrijanos, consideradas como excelentes para dicho cultivo". Term explained ("whitish"); "considered excellent for vines" added from the same sentence. Chapter title "White chalky soil" became "Albariza soil" (the page never says chalky).
- KEEP p6 "destacándose entre las tierras adyacentes y salinas de las marismas"
- Flight Sierra de Gibalbín: KEEP p6 caption "los de pendiente más pronunciada, muy escasos y situados todos ellos en las estribaciones de la Sierra de Gibalbin, tienen una pendiente entre el 10 y el 20%". Point moved from [-6.0, 36.97] to Nominatim [-5.9561, 36.8318] (about 16 km off).

## rules (cite p1 added)
- FIX p1 "Categorías vitícolas de los productos: Vinos y vinos de licor"; p1 "Vino blanco ... Vino tinto". "white, red, fortified and sweet wines" (a list, cited to pages that do not list the types) became white and red wines, plus vinos de licor (fortified wines), dry and sweet; p1 added to the cite.
- KEEP p4 "De ellas son consideradas principales Palomino y Palomino Fino"
- KEEP p4 "Variedades blancas: Moscatel de Alejandría, Palomino, Palomino Fino y Sauvignon Blanc"
- KEEP p4 "Variedades tintas: Cabernet Sauvignon, Syrah, Tempranillo, Merlot, Petit Verdot y Tintilla de Rota" (six counted)
- FIX p2 "Blanco: Vino joven, muy pálido, de aroma afrutado característico, y en boca seco o abocado". List split in two sentences.
- KEEP p3 "con un mínimo del 60% de las variedades blancas clasificadas como principales"
- FIX p2 "Tintos jóvenes: Son de intenso y característico aroma afrutado. De color vivo e intenso". "vivid" belongs to the colour, not the aroma; young reds now their own sentence.
- FIX p2 "Tinto joven roble: De color rubí brillante ... fruta madura con recuerdos a vainilla y café". "oaked wines" became "young oaked reds (tinto joven roble)", bright ruby, ripe fruit with hints of vanilla and coffee (no list).
- FIX p2 "De color rojo cereza intensos y carnosos ... con gran cuerpo y vigor. Con final aterciopelado". Split in two sentences.
- FIX p3 "El envejecimiento de los vinos tintos amparados por la mención «Vino de Calidad de Lebrija» se efectuará durante, al menos, 18 meses, a contar desde el 1 de octubre". The rule covers all protected reds, not only aged reds.
- FIX p1 "Vino generoso: vino de licor elaborado bajo velo de flor, proceso biológico que, realizándose durante el desarrollo espontáneo de un velo de levaduras típicas sobre la superficie libre del vino". "The traditional wines are the generosos" dropped "traditional" (not on the page); flor gloss now the page's: a veil of yeasts that grows by itself on the wine's surface.
- FIX p3 "se emplearan exclusivamente uvas de Palomino o Palomino Fino". "only Palomino" became "only Palomino or Palomino Fino".
- FIX p2 "color amarillo pajizo, con reflejos verdosos en ocasiones, de aroma almendrado característico, punzante y delicado, ligero al paladar, seco ... crianza exclusivamente bajo velo de flor". Green glints and pungent, delicate restored; list split.
- KEEP p2 "«Lebrija Old Vino Seco», de color ámbar a caoba, de aroma muy acusado, que recuerda a la nuez, de mucho cuerpo"
- KEEP p1 "Vino generoso de licor: Es el vino de licor obtenido a partir de «vino generoso» ... Tipo de vino generoso de licor: «Lebrija old dulce»" (cite p1 added)
- KEEP p2 "Vino de cuerpo, de color ámbar a caoba oscuro, de aroma punzante característico y atenuado"
- FIX p3 "Todos los vinos generosos y generosos de licor deberán tener una edad promedio mínima de tres años para poder ser destinados al consumo". "age ... for an average of at least 3 years" became "need an average age of at least three years before sale".
- FIX p3 "será el clásico de criaderas y solera, o bien el de añadas". Own sentence; "añadas" shown with its meaning.
- FIX p3 "en botas de roble de capacidad máxima 600 litros para los generosos y generosos de licor". Term explained: casks (botas).
- KEEP p3 "deberán envejecer necesariamente en bodegas enclavadas en la zona de producción de Lebrija y El Cuervo" (now its own sentence)
- FIX p3 "se emplea, como mínimo, un 85 por ciento de uva de la variedad Moscatel". Term explained: natural sweet wine.
- FIX p3 "se utilizarán uvas sobremaduras ... para lo cual se podrá solear las uvas, o hacer una vendimia tardía". Hedge restored: the grapes "may be" sun-dried or picked late.
- KEEP p3 "con una riqueza inicial en azúcar de 212 g/l como mínimo"
- KEEP p3 "Este tipo de vino podrá denominarse «Moscatel»"
- FIX p2 "textura aterciopela y melosa, su aroma recuerda a la miel, al caramelo y a las uvas pasas, agradable en boca y glicérico, su color varía desde el color oro al color caoba". Split in two to drop the lists.
- FIX p3 "el mosto de uva previamente filtrado ... se le añadirá alcohol vínico, para parar parcial o totalmente la fermentación". "filtered" and "partly or fully" restored.
- KEEP p3 "obtener un grado de alcohol adquirido entre los 15% y 18% en volumen"
- KEEP p4 "Para las uvas blancas la producción máxima permitida por hectárea de viñedo es de 15.000 kg, excepto para la variedad Sauvignon Blanc que es de 10.000 kg"
- KEEP p4 "Para las uvas tintas ... 11.250 kg, excepto para las variedades Cabernet Sauvignon y Tintilla de Rota que es de 6.000 kg"

## label
- KEEP p4 "Para la indicación «Roble». Envejecimiento en vasijas de roble durante un periodo mínimo de 3 meses"
- KEEP p4 "«Crianza». Envejecimiento en barrica de roble de capacidad máxima 330 litros, y botella durante un periodo total de veinticuatro meses ... de roble de seis meses" (24 confirmed as words)
- KEEP p4 "«Reserva» ... treinta y seis meses ... de roble de doce meses" (36 and 12 confirmed as words)
- KEEP p4 "«Gran Reserva» ... sesenta meses ... de roble de veinticuatro meses" (60 and 24 confirmed as words)
- No term points to other law; none is a famous style on the fact sheet.

## Fact sheet (content/facts/andalucia.json, "lebrija"; not edited)
- grapes.main: sheet empty; pliego "De ellas son consideradas principales Palomino y Palomino Fino" (p4).
- grapes.others: sheet lists Palomino and Palomino Fino (the main grapes) and leaves out Petit Verdot; pliego "Cabernet Sauvignon, Syrah, Tempranillo, Merlot, Petit Verdot y Tintilla de Rota" (p4).
- soil: sheet empty; pliego "Las tierras albarizas, con buen drenaje y profundidad, son las que predominan en los viñedos lebrijanos" (p6).
- climate: sheet adds "almost all land is flat" cited to p5; that is ground, on p6 ("La práctica totalidad de los terrenos ... son llanos").
- why: sheet "A long, hard summer topping 40 °C shapes a traditional style"; pliego "máximas que pueden sobrepasar los 40º" (p5, hedge "can" dropped) and links no summer heat to a traditional style; "flat" is on p6, not the cited p5.
- cites: every sheet cite uses source id "lebrija-doc"; the pliego's id is "lebrija-pliego". grapes cite p5, the varieties are on p4; famous cites p2-p3, the style names are defined on p1-p2; tastes cite p1, the tasting notes are on p2.

## Second check

Fresh pass, 2026-10-19, same source and version as above (pages.py numbering, pages 1 to 6 read; whole pliego grepped for wine types). `check_guide.py` after edits: 0 errors, 6 number warnings (7 as roman VII on p6; 24, 36, 12, 60, 24 as words on p4), all confirmed. Counts for this pass only: 67 KEEP, 9 FIX, 0 CUT.

### Lede and guide title
- KEEP title "Why Lebrija tastes the way it does" (makes no claim beyond the guide)
- KEEP p5 "en la campiña adyacente a las marismas"; p6 "La práctica totalidad de los terrenos ... son llanos"
- KEEP p6 "un matiz de aroma o sabor sutil y característico lebrijano, a veces descrito como salino"

### place
- KEEP title p5 "la campiña adyacente a las marismas"
- KEEP p5 "se haya enclavada dentro de la «Comarca del Bajo Guadalquivir» ... en el extremo Suroeste de la Península Ibérica, en el margen derecho del Río Guadalquivir"
- KEEP p5 "delimitada por el triángulo" (3 sentences: triangle, Sevilla, Doñana and the fachada atlántica de Cádiz)
- KEEP p5 "Los viñedos de la zona delimitada se encuentran en la campiña adyacente a las marismas"
- KEEP p5 "lo que condiciona su mesoclima y suelo"
- KEEP p4 "los términos municipales de Lebrija y El Cuervo, de la provincia de Sevilla"
- KEEP p6 "la tradición vitivinícola de Lebrija es inmemorial"
- KEEP p6 "la fundación de Lebrija, como «Lepriptza», se atribuye los fenicios hacia el siglo VII antes de Cristo"
- KEEP p6 "(1844) que se dedicaban a viñas 324 aranzadas (145 ha.) en 137 parcelas"
- KEEP p6 "En 1856 había una extensión mayor que abastecía a 53 cosecheros de vino"
- Flight Doñana: KEEP caption p5 "el triángulo que forman la ciudad de Sevilla, El Parque Nacional de Doñana, y la fachada atlántica". Nominatim [-6.4007, 36.9680], matches the guide.
- Missing flights: none. The guide already flies to Doñana and the Sierra de Gibalbín, not only to the town.

### weather
- FIX title p5 "El clima es cálido ... suavizado por las corrientes atlánticas"; "el verano, el cual es largo y riguroso". The page softens the climate, not the summers: "Long, hard summers softened by the Atlantic" became "Long, hard summers in a climate softened by the Atlantic".
- KEEP p5 "El clima es cálido de tipo continental mediterráneo, suavizado por las corrientes atlánticas"
- KEEP p5 "Tanto en el otoño como en la primavera, las temperaturas son suaves"
- KEEP p5 "el verano, el cual es largo y riguroso, con máximas que pueden sobrepasar los 40º"
- KEEP p5 "siendo el mes de agosto el más caluroso"
- KEEP p5 "la insolación media anual es del orden de 3000 horas anuales, lo que representa un 65 %"
- KEEP p5 "La distribución de las lluvias es irregular"
- KEEP p5 "meses más lluviosos del año octubre, diciembre y marzo"
- KEEP p5 "La media anual de la humedad relativa es del orden del 70 %"
- KEEP p5 "para descender a un mínimo entre 49 y 56 en el mes de julio, durante la maduración"
- KEEP p5 "La práctica carencia de heladas ... la corta duración del invierno"
- KEEP p5 "con temperaturas medias siempre superiores a 10º"
- KEEP p5 "las condiciones para la vegetación son excepcionales, y las condiciones para una buena maduración también"
- FIX p5 "lo que permite obtener las características indicadas de los vinos con rendimientos relativamente elevados". The page says the conditions allow the character, not that they give it: "They give the wines their character" became "They let the wines reach their character with relatively high yields".
- FIX p5-p6 "La disminución de las temperaturas nocturnas (mínimas mensuales bajas) durante la estación estival indica unas condiciones sobresalientes para la obtención de vinos de notable y característica aromaticidad". "Summer nights are cooler, which suits" (cooler than what?) became "Night temperatures drop in summer, which gives outstanding conditions for wines of notable and characteristic aroma". Cite: the sentence starts on p5 and ends on p6, both cited.

### ground
- KEEP title p6 "Las tierras albarizas ... destacándose entre las tierras adyacentes y salinas de las marismas"
- KEEP p6 "son llanos, es decir de una pendiente inferior al 3%"
- KEEP p6 "muy escasos y situados todos ellos en las estribaciones de la Sierra de Gibalbin, tienen una pendiente entre el 10 y el 20%"
- KEEP p6 "Las tierras albarizas, con buen drenaje y profundidad, son las que predominan en los viñedos lebrijanos, consideradas como excelentes para dicho cultivo"
- KEEP p6 "destacándose entre las tierras adyacentes y salinas de las marismas"
- FIX flight Sierra de Gibalbín caption, p6 "los de pendiente más pronunciada, muy escasos y situados todos ellos en las estribaciones de la Sierra de Gibalbin". "The only hills near the vineyards" is not on the page: now "All of the zone's few steeper plots lie in these foothills, at slopes of 10 to 20%". Nominatim [-5.9561, 36.8318], matches the guide.

### rules
- FIX title p1 "Vino generoso ... Flor de Lebrija y Lebrija old vino seco"; p1 "Vino dulce natural ... podrá denominarse «Moscatel»". "Dry flor wines, sweet Moscatel and reds" was an "X, Y and Z" list: now "From dry flor wines to sweet Moscatel".
- KEEP p1 "a) Vino blanco ... b) Vino tinto"
- KEEP p1 "Categorías vitícolas de los productos: Vinos y vinos de licor"; p1 generoso (reductoras "inferior a 5 g/l") and generoso de licor ("no inferior a 5 g/l"), dulce natural: dry and sweet
- KEEP p4 "De ellas son consideradas principales Palomino y Palomino Fino"
- KEEP p4 "Variedades blancas: Moscatel de Alejandría, Palomino, Palomino Fino y Sauvignon Blanc"
- KEEP p4 "Variedades tintas: Cabernet Sauvignon, Syrah, Tempranillo, Merlot, Petit Verdot y Tintilla de Rota"
- KEEP p2 "Blanco: Vino joven, muy pálido, de aroma afrutado característico"
- KEEP p2 "y en boca seco o abocado"
- KEEP p3 "con un mínimo del 60% de las variedades blancas clasificadas como principales"
- KEEP p2 "Tintos jóvenes: Son de intenso y característico aroma afrutado. De color vivo e intenso"
- KEEP p2 "Tinto joven roble: De color rubí brillante ... fruta madura con recuerdos a vainilla y café"
- KEEP p2 "De color rojo cereza intensos y carnosos"
- KEEP p2 "con gran cuerpo y vigor. Con final aterciopelado"
- KEEP p3 "El envejecimiento de los vinos tintos amparados ... al menos, 18 meses, a contar desde el 1 de octubre"
- FIX p1 "Vino generoso: vino de licor elaborado bajo velo de flor". "aged under" became "made under" (the definition says elaborado); "fortified" now said in the sentence itself: "Generosos are fortified wines (vinos de licor) made under a velo de flor".
- KEEP p3 "se emplearan exclusivamente uvas de Palomino o Palomino Fino"
- KEEP p2 "color amarillo pajizo, con reflejos verdosos en ocasiones"
- KEEP p2 "de aroma almendrado característico, punzante y delicado, ligero al paladar, seco ... exclusivamente bajo velo de flor"
- KEEP p2 "«Lebrija Old Vino Seco», de color ámbar a caoba, de aroma muy acusado, que recuerda a la nuez, de mucho cuerpo"
- KEEP p1 "Es el vino de licor obtenido a partir de «vino generoso» ... «Lebrija old dulce»"
- FIX p2 "Vino de cuerpo, de color ámbar a caoba oscuro, de aroma punzante característico y atenuado". "full-bodied" widened "de cuerpo": now "It has body and runs from amber to dark mahogany".
- KEEP p3 "Todos los vinos generosos y generosos de licor deberán tener una edad promedio mínima de tres años"
- FIX p3 "será el clásico de criaderas y solera, o bien el de añadas". "criaderas y solera" was left unexplained: now "system of casks of different ages".
- KEEP p3 "en botas de roble de capacidad máxima 600 litros para los generosos y generosos de licor"
- FIX p3 "Los vinos amparados por la mención «Vino de Calidad de Lebrija», deberán envejecer necesariamente en bodegas enclavadas en la zona de producción de Lebrija y El Cuervo". "All wines of the zone" became "All protected wines".
- KEEP p3 "un 85 por ciento de uva de la variedad Moscatel"
- KEEP p3 "uvas sobremaduras ... se podrá solear las uvas, o hacer una vendimia tardía"
- KEEP p3 "con una riqueza inicial en azúcar de 212 g/l como mínimo"
- KEEP p3 "Este tipo de vino podrá denominarse «Moscatel»"
- KEEP p2 "agradable en boca y glicérico, su color varía desde el color oro al color caoba"; "textura aterciopela"
- KEEP p2 "su aroma recuerda a la miel, al caramelo y a las uvas pasas"
- KEEP p3 "el mosto de uva previamente filtrado ... se le añadirá alcohol vínico, para parar parcial o totalmente la fermentación"
- KEEP p3 "obtener un grado de alcohol adquirido entre los 15% y 18% en volumen"
- KEEP p4 "Para las uvas blancas ... 15.000 kg, excepto para la variedad Sauvignon Blanc que es de 10.000 kg"
- KEEP p4 "Para las uvas tintas ... 11.250 kg, excepto para las variedades Cabernet Sauvignon y Tintilla de Rota que es de 6.000 kg"
- Missing wine types: whole pliego grepped (blanco, tinto, generoso, generoso de licor, dulce natural/Moscatel, mistela; no espumoso, rosado or other named style). Every one is named in the rules beat.

### label
- KEEP p4 "Para la indicación «Roble». Envejecimiento en vasijas de roble durante un periodo mínimo de 3 meses" (tintos y blancos, p4 "los vinos tintos y blancos")
- KEEP p4 "«Crianza» ... 330 litros ... veinticuatro meses ... de roble de seis meses"
- KEEP p4 "«Reserva» ... treinta y seis meses ... de roble de doce meses"
- KEEP p4 "«Gran Reserva» ... sesenta meses ... de roble de veinticuatro meses"
- Each term has its own rule on p4; none points to other law; none is a fact sheet famous style.

### Fact sheet (second check; the sheet has changed since the first check: cites now use "lebrija-pliego", grapes.main is filled, Petit Verdot is listed. Not edited.)
- styles.text: sheet "Young whites"; pliego p3 "Vinos blancos ... Podrán ser sometidos envejecimiento" and p4 «Roble», «Crianza», «Reserva», «Gran Reserva» for "los vinos tintos y blancos" (whites may be aged).
- famous.styles "Dulce natural": sheet names the category as a style; the pliego's name for it on the label is "Este vino podrá denominarse «Moscatel»" (p2, p3).
- famous.styles "Lebrija Old Dulce": sheet "full-bodied"; pliego "Vino de cuerpo" (p2). Minor.
- No other field disagrees: why, grapes, styles.kinds (white, red, fortified, sweet), climate, soil and tastes match pages 1 to 6.
