# Sentence check: granada

Source: granada-pliego, `Review/sources/fetched/pliego-PDO-ES-A1475-granada.txt` (PDO-ES-A1475, pliego de condiciones consolidado de acuerdo con la Orden de 9 de octubre de 2024, BOJA núm. 203 de 17/10/2024). Checked 19 Oct 2026.
Page numbers are the form-feed pages of `Tools/guides/pages.py`, as the guide cites them (they match the printed "PAGE n / 14").

## Lede
- KEEP p11 "un retraso en la época de brotación del viñedo ... maduración, que acontece entre finales de agosto y principios de octubre, mas lenta y uniforme"
- FIX p11 "el salto térmico entre las temperaturas máximas y las temperaturas mínimas durante el día ... favorece la maduración del hollejo y las semillas ... en éstos se acumulan los compuestos de la familia química de los polifenoles, moléculas responsables del color y estructura de los vinos": "Big swings between day and night" became "The gap between the day's highs and lows" (the page gives no size); "those hold the polyphenols" became "polyphenols ... build up in both".

## place
- KEEP p10 "esta provincia de Andalucía oriental"
- KEEP p8 "La zona delimitada para la producción de uva y la elaboración y crianza ... totalidad de los términos municipales de la provincia de Granada"; p9 "exclusivamente con uvas cultivadas en los términos municipales de la provincia de Granada"
- KEEP p8 "subzonas que se caracterizan por un medio geográfico homogéneo"
- KEEP p8 "«Geoparque-Norte» ... Baza ... Guadix"
- KEEP p8 "«Poniente» ... Almuñécar ... Granada ... Motril"
- KEEP p9 "«Contraviesa-Alpujarra» ... Albondón, Albuñol, Almegíjar, Cádiar, Cástaras, Lobras, Murtas, Polopos, Rubite, Sorvilán, Torvizcón, Turón y Ugíjar" (13 counted; machine warning confirmed)
- KEEP p10 "El cultivo de la vid en Granada tiene lugar desde tiempo inmemorial"
- KEEP p10 "restos arqueológicos hallados en la cercana Molvízar, referentes a una villa romana que disponía de lagar, y donde se elaboraban vinos en los primeros siglos de nuestra era"
- FIX p10 "el anónimo musulmán de la época, que describe la entrada de gran cantidad de provisiones a través de Sierra Nevada desde la Alpujarra, entre las que se encontraban las pasas, que paliaba la penuria provocada por el asentamiento del ejercito cristiano en la vega granadina": the account is a Muslim writer's, now said; "vega" (unexplained Spanish) became "the farmland plain around the city"; "besieged" dropped (the page says the army camped); "eased the shortage" added from "paliaba la penuria". Split into two sentences.
- KEEP p10 "la toma de la ciudad el 2 de enero de 1492"
- Fly "Sierra Nevada": KEEP p10 "provisiones a través de Sierra Nevada desde la Alpujarra, entre las que se encontraban las pasas". Nominatim "Sierra Nevada, Granada" 37.0955, -3.1425; guide point was about 15 km off, corrected.
- Fly "Molvízar's Roman wine villa": KEEP p10 "villa romana que disponía de lagar". Nominatim "Molvízar" 36.7910, -3.5949; guide point was about 5 km off, corrected.
- Missing flights: none added; the guide already flies to Sierra Nevada and the Contraviesa-Alpujarra beyond the province itself.

## weather
- KEEP p11 "alrededor del 50 % de su superficie, se encuentra por encima de los 1.000 metros de altitud ... lo que da lugar a bajas temperaturas medias anuales"
- KEEP p11 "La temperatura media anual en la provincia de Granada es de 15 a 16 ºC"
- KEEP p11 "valores medios para las temperaturas máximas absolutas de 39 ºC y de - 4 ºC para las mínimas"
- FIX p11 "La primera consecuencia de estas bajas temperaturas medias, es un retraso en la época de brotación del viñedo, lo que provoca, a su vez, un retraso de todo el ciclo vegetativo": "The cold" became "The low average temperatures".
- KEEP p11 "maduración, que acontece entre finales de agosto y principios de octubre"
- FIX p11 "mas lenta y uniforme, tanto de azúcares, como de polifenoles y de sustancias responsables del aroma varietal (terpenos y precursores)": X, Y and Z list split; "aroma compounds called terpenes" became "compounds behind varietal aroma (terpenes and their precursors)".
- FIX p11 "el salto térmico entre las temperaturas máximas y las temperaturas mínimas durante el día ... favorece la maduración del hollejo y las semillas": "daytime highs and night-time lows" became "the day's highs and lows".
- FIX p11 "en éstos se acumulan los compuestos de la familia química de los polifenoles, moléculas responsables del color y estructura de los vinos": "Both are rich in polyphenols" became "Polyphenols ... build up in both".
- KEEP p11 "la poca combustión que hace la planta de ácido tartárico"
- FIX p11 "una acidez total de los vinos correcta, sin necesidad de adicionar este ácido. Otra característica de la zona son unos pH bajos, óptimos para vinos con crianza importante en botella": low pH is a separate trait of the area, not a result of altitude; now its own sentence, with the page's point that it suits long bottle ageing; "added acid" became "added tartaric acid".
- FIX p11 "Se considera que una pluviométrica que oscile entre 350 y 600 mm es adecuada para la producción de vinos de calidad" / "unos 450 mm, con un promedio de 70 días lluviosos": hedge restored, "suits" became "considered right for".
- KEEP p11 "El «estrés hídrico moderado» y temporal de la vid, durante los meses estivales ... disminución del diámetro de los frutos ... aumento en la síntesis de polifenoles en variedades tintas"

## ground
- KEEP p11 "un asentamiento mayoritario de viñedo sobre terrenos paleozoicos, cuyo epipedión corresponde a tierras pardas meridionales sobre rocas metamórficas de naturaleza silicea"
- KEEP p11 "Son suelos muy erosionables"
- KEEP p11 "la capacidad de descomposición de pizarras y esquistos arcillosos compensa a veces las perdidas por erosión"
- KEEP p11 "Aunque no son profundos, retiene bien la humedad"
- FIX p11 "Son terrenos muy pobres en materia orgánica, fósforo y nitrógeno. Estas características son, en general, factores positivos para la obtención de caldos de calidad": X, Y and Z list reworded; split into two sentences.
- KEEP p11 "suelos pardo calizos sobre material no consolidado, con horizonte de humus muy poco desarrollado"
- FIX p11 "la aptitud de estos suelos para el viñedo depende de la topografía y naturaleza del material geológico": "slope" narrowed "topografía"; now "the lie of the land".

## rules
- FIX p1 "Vinos blancos, rosados y tintos: que podrán ser secos, semisecos, semidulces y dulces": X, Y and Z list reworded and "rosado" explained as "rosé" at first use.
- KEEP p6 "En los vinos rosados se empleará un mínimo del 25 % de uvas de las variedades tintas"
- KEEP p9 white list of 12 (Vigiriego (Vigiriega) ... Viognier) and red list of 10 (Tempranillo ... Petit Verdot), counted
- KEEP p9 "Vigiriego (Vigiriega), Sauvignon Blanc ..." / "Tempranillo, Garnacha Tinta ..."
- KEEP p6 "«método tradicional», con segunda fermentación en botella, con un periodo de maduración entre el tiraje y el degüelle no inferior a nueve meses"
- KEEP p1 "vino de uva sobremadurada ... con un grado alcohólico natural superior a 15 % vol. y un grado alcohólico volumétrico adquirido no inferior a 13 % vol."
- KEEP p1, p6, p9 (summary of the subzone rules below)
- FIX p1 "En la subzona «Contraviesa-Alpujarra», el grado alcohólico adquirido mínimo es de 11 % vol. en los vinos blancos, 12 % vol. en los rosados y 13 % vol. en los tintos": X, Y and Z list reworded.
- KEEP p6 "el rendimiento final no será superior a 65 litros de vino por cada 100 kilogramos" / "no sea superior a 70 litros"
- FIX p6 "en envases, de material impermeable, rígido, abiertos y de fácil limpieza, cuyo peso lleno no debe superar los 30 kg, quedando prohibida expresamente la utilización de sacos": "waterproof" and "when full" added.
- FIX p6 "no se podrán utilizar trozos de madera de roble en la elaboración ni en la crianza de cualquiera de sus vinos" / "exclusivamente a partir de alguna de las variedades establecidas Vigiriego (Vigiriega), Chardonnay y Pinot Noir, debiendo utilizarse ... al menos el 70 %": split into two sentences; the chip ban now says it covers making and ageing.
- KEEP p9 "8.000 kg para la uva tinta, de 9.000 kg para la uva blanca y de 12.000 kg para la uva con destino exclusivamente a espumosos"
- KEEP p9 "6.000 kg para las variedades tintas, salvo para la Tempranillo en la que será de 7.000 kg, y de 8.000 kg para las variedades blancas"
- Fly "Contraviesa-Alpujarra": FIX p6, p9: "The subzone with the tightest rules, from yields to oak chips" ("tightest" is not on the page) became "This subzone caps yields lower than the rest of the province and bans oak chips." Nominatim "Contraviesa" (Sierra de La Contraviesa) 36.8662, -3.2456; guide point was about 4 km off, corrected.

## label
- KEEP p4 «Crianza»: "dos años naturales, en el caso de los tintos y dieciocho meses en el caso de los blancos y rosados, contados a partir del 1 de noviembre ... seis meses, como mínimo, ... en barrica de roble de capacidad máxima de 330 litros" (2, 18, 6 confirmed in words)
- KEEP p4 «Reserva»: "veinticuatro meses ... seis meses" / "treinta y seis meses ... doce meses en barrica de roble de capacidad máxima de 330 litros" (24, 6, 36, 12 confirmed)
- KEEP p4 «Gran Reserva»: "cuarenta y ocho meses ... seis meses ... y en botella el resto" / "sesenta meses ... dieciocho meses ... seguida y completada de un envejecimiento en botella" (48, 60, 6, 18 confirmed)
- KEEP p4 «Fermentado en Barrica»: "barricas de madera de roble con capacidad máxima de 600 litros, permaneciendo en las mismas durante un periodo no inferior a tres meses"
- KEEP p4-5 «Barrica» o «Roble»: "envejecimiento mínimo de tres meses en barricas de madera de roble con una capacidad máxima de 600 litros"
- KEEP p5 «Premium»: "cuya crianza, contada desde el momento del tiraje hasta el degüelle, no sea inferior a doce meses" (12 confirmed)
- KEEP p5 «Nuevo»: "vinos no espumosos de la campaña ... embotellados y etiquetados antes del 1 de marzo del año siguiente"
- KEEP p5 «Joven»: "vinos no espumosos obtenidos en la misma campaña vitivinícola en la que se etiquetan"
- No famous style (Vino de uvas sobremaduradas, Vino espumoso de calidad) is in `label`. «Naturalmente Dulce» / «Vendimia tardía» is left out correctly: p5 leaves its conditions to "la legislación correspondiente".

## Fact sheet (content/facts/andalucia.json, "granada"; not edited)
- Cites: every field cites `granada-doc`, not `granada-pliego`; the page numbers below are the pliego's.
- why: sheet "poor, limy soil shape the wines"; pliego p11: most vineyards are on brown soils over siliceous metamorphic rock, and those are the ones "muy pobres en materia orgánica, fósforo y nitrógeno"; the limy soils are the minority, with little humus.
- grapes.others: sheet has "Vijariego Blanco" and "Baladí Verdejo"; pliego p9 has "Vigiriego (Vigiriega)" and no Baladí Verdejo. Sheet lacks Jaén Blanco, Torrontés, Blanca Gordal, Macabeo, Viognier and Monastrell, all on p9.
- climate: sheet "Large day-night swings; absolute highs of 39 °C and lows of -4 °C"; pliego p11 gives no size for the "salto térmico", and 39 / -4 ºC are "valores medios para las temperaturas máximas absolutas ... mínimas" (means of the absolute extremes).
- soil: sheet "Brown limy soil, poor in organic matter, phosphorus and nitrogen"; pliego p11 ties the poverty to the brown soils on siliceous metamorphic rock (the majority), not to the brown limy soils.
- tastes: sheet "Reds: bright cherry to deep red; red berries; full body, high astringency. Whites: greenish yellow to straw; fruity, intense aromas. Rosés: ... medium to intense fruit"; pliego p3: reds "desde rojo con tonos violeta hasta rojo con tonos caoba", "aromas francos y agradables", no berries, body or astringency; whites "desde amarillo verdoso hasta amarillo ámbar", "desde aromas frescos y agradables hasta aromas más evolucionados"; rosados the same aroma range. (Rojo picota appears only for overripe-grape reds, p4.)

## Second check
Source: granada-pliego, `Review/sources/fetched/pliego-PDO-ES-A1475-granada.txt` (same consolidated version, Orden de 9 de octubre de 2024). Checked 19 Oct 2026, fresh pass over every sentence, title, caption and label term. Counts below are this pass only: KEEP 58, FIX 9, CUT 0.

### Titles and lede
- KEEP guide title "Why Granada tastes the way it does" (standard guide title; p10 "su calidad y sus características se deben básicamente a un entorno geográfico particular").
- KEEP p11 "un retraso en la época de brotación del viñedo ... maduración, que acontece entre finales de agosto y principios de octubre, mas lenta y uniforme"
- KEEP p11 "el salto térmico entre las temperaturas máximas y las temperaturas mínimas durante el día ... favorece la maduración del hollejo y las semillas ... en éstos se acumulan los compuestos de la familia química de los polifenoles, moléculas responsables del color y estructura de los vinos"

### place
- FIX title: "A province with a snowy wall" became "A province with three subzones". No cited page mentions snow; p8 "se distinguen las siguientes subzonas que se caracterizan por un medio geográfico homogéneo".
- KEEP p10 "esta provincia de Andalucía oriental"
- KEEP p8 "producción de uva y la elaboración y crianza ... totalidad de los términos municipales de la provincia de Granada"; p9 "exclusivamente con uvas cultivadas en los términos municipales de la provincia de Granada"
- KEEP p8 "subzonas que se caracterizan por un medio geográfico homogéneo"
- KEEP p8 "«Geoparque-Norte» ... Baza ... Guadix"
- KEEP p8 "«Poniente» ... Almuñécar ... Granada ... Motril"
- KEEP p9 "«Contraviesa-Alpujarra» ... Albondón, Albuñol, Almegíjar, Cádiar, Cástaras, Lobras, Murtas, Polopos, Rubite, Sorvilán, Torvizcón, Turón y Ugíjar" (recounted: 13; machine warning confirmed)
- KEEP p10 "El cultivo de la vid en Granada tiene lugar desde tiempo inmemorial"
- KEEP p10 "una villa romana que disponía de lagar, y donde se elaboraban vinos en los primeros siglos de nuestra era"
- KEEP p10 "el anónimo musulmán de la época, que describe la entrada de gran cantidad de provisiones a través de Sierra Nevada desde la Alpujarra ... asentamiento del ejercito cristiano en la vega granadina"
- KEEP p10 "entre las que se encontraban las pasas, que paliaba la penuria"
- KEEP p10 "la toma de la ciudad el 2 de enero de 1492"
- Fly "Sierra Nevada": KEEP p10 "provisiones a través de Sierra Nevada desde la Alpujarra, entre las que se encontraban las pasas ... que desembocaría en la toma de la ciudad". Nominatim "Sierra Nevada, Granada" 37.0955, -3.1425: matches.
- Fly "Molvízar's Roman wine villa": KEEP p10 "restos arqueológicos hallados en la cercana Molvízar, referentes a una villa romana que disponía de lagar". Nominatim "Molvízar" 36.7910, -3.5949: matches.
- Missing flights: none added; the guide already flies beyond the province to Sierra Nevada and the Contraviesa.

### weather
- FIX title: "Half the province above 1,000 m" became "About half the province above 1,000 m"; p11 "alrededor del 50 % de su superficie, se encuentra por encima de los 1.000 metros" (hedge restored).
- KEEP p11 "alrededor del 50 % ... por encima de los 1.000 metros de altitud ... lo que da lugar a bajas temperaturas medias anuales"
- KEEP p11 "La temperatura media anual en la provincia de Granada es de 15 a 16 ºC"
- KEEP p11 "valores medios para las temperaturas máximas absolutas de 39 ºC y de - 4 ºC para las mínimas"
- KEEP p11 "estas bajas temperaturas medias, es un retraso en la época de brotación del viñedo, lo que provoca, a su vez, un retraso de todo el ciclo vegetativo"
- KEEP p11 "maduración, que acontece entre finales de agosto y principios de octubre"
- KEEP p11 "mas lenta y uniforme"
- KEEP p11 "tanto de azúcares, como de polifenoles y de sustancias responsables del aroma varietal (terpenos y precursores)"
- KEEP p11 "el salto térmico ... favorece la maduración del hollejo y las semillas"
- KEEP p11 "en éstos se acumulan los compuestos de la familia química de los polifenoles, moléculas responsables del color y estructura de los vinos"
- KEEP p11 "Otra consecuencia de la elevada altitud media ... es la poca combustión que hace la planta de ácido tartárico"
- KEEP p11 "una acidez total de los vinos correcta, sin necesidad de adicionar este ácido"
- KEEP p11 "Otra característica de la zona son unos pH bajos, óptimos para vinos con crianza importante en botella"
- KEEP p11 "unos 450 mm, con un promedio de 70 días lluviosos" / "Se considera que una pluviométrica que oscile entre 350 y 600 mm es adecuada para la producción de vinos de calidad"
- KEEP p11 "El «estrés hídrico moderado» y temporal de la vid, durante los meses estivales ... disminución del diámetro de los frutos ... aumento en la síntesis de polifenoles en variedades tintas"

### ground
- FIX title: "Thin, hungry slate" became "Poor brown soil on Palaeozoic rock". The soil is not slate (p11 "tierras pardas meridionales sobre rocas metamórficas de naturaleza silicea"; slates only break down into it), and "hungry" is not the page's word; p11 "terrenos paleozoicos", "muy pobres en materia orgánica".
- KEEP p11 "asentamiento mayoritario de viñedo sobre terrenos paleozoicos, cuyo epipedión corresponde a tierras pardas meridionales sobre rocas metamórficas de naturaleza silicea"
- FIX p11 "Son suelos muy erosionables": "It erodes easily" became "It erodes very easily".
- KEEP p11 "la capacidad de descomposición de pizarras y esquistos arcillosos compensa a veces las perdidas por erosión"
- KEEP p11 "Aunque no son profundos, retiene bien la humedad"
- KEEP p11 "Son terrenos muy pobres en materia orgánica, fósforo y nitrógeno"
- KEEP p11 "Estas características son, en general, factores positivos para la obtención de caldos de calidad"
- KEEP p11 "suelos pardo calizos sobre material no consolidado, con horizonte de humus muy poco desarrollado"
- KEEP p11 "la aptitud de estos suelos para el viñedo depende de la topografía y naturaleza del material geológico"

### rules
- KEEP title "Still, sparkling and late-harvest wines": p1 "Vinos blancos, rosados y tintos" / "Vinos espumosos" / "Vinos naturalmente dulces o de vendimia tardía".
- KEEP p1 "Vinos blancos, rosados y tintos: que podrán ser secos, semisecos, semidulces y dulces"
- KEEP p6 "En los vinos rosados se empleará un mínimo del 25 % de uvas de las variedades tintas"
- KEEP p9 white list of 12 and red list of 10 (recounted)
- KEEP p9 "Vigiriego (Vigiriega), Sauvignon Blanc ..." / "Tempranillo, Garnacha Tinta ..."
- FIX (missing wine types) p1 "categoría 4.«Vino espumoso», categoría 5.«Vino espumoso de calidad»" / "brut nature, extra brut, brut, extra seco, seco, semiseco y dulce"; p2 "vino base blanco o rosado utilizado para la elaboración de los vinos espumosos y espumosos de calidad"; p3 sparkling colours given only "en los blancos ... y en los rosados": added two sentences naming both sparkling categories, that they are white or rosado, and their sugar range. Cite p2 added.
- KEEP p6 "El vino espumoso será el obtenido según el «método tradicional», con segunda fermentación en botella, con un periodo de maduración entre el tiraje y el degüelle no inferior a nueve meses"
- FIX p1 "Vinos naturalmente dulces o de vendimia tardía, aplicable al vino de uva sobremadurada elaborado sin aumento artificial de su graduación y con el alcohol procedente en su totalidad de la fermentación, con un grado alcohólico natural superior a 15 % vol. y un grado alcohólico volumétrico adquirido no inferior a 13 % vol.": the sentence now names naturalmente dulce / vendimia tardía (late harvest), and a new sentence says plainly the wine is not fortified, all its alcohol coming from fermentation. (No generoso or vino de licor is protected; grep of the whole pliego.)
- FIX p1 "En la subzona «Contraviesa-Alpujarra», el grado alcohólico adquirido mínimo es de 11 % vol. ...": "has stricter rules" (a judgment the page does not make) became "has rules of its own".
- KEEP p1 "11 % vol. en los vinos blancos, 12 % vol. en los rosados y 13 % vol. en los tintos"
- KEEP p6 "no será superior a 65 litros de vino por cada 100 kilogramos" / "no sea superior a 70 litros"
- KEEP p6 "en envases, de material impermeable, rígido, abiertos ... cuyo peso lleno no debe superar los 30 kg, quedando prohibida expresamente la utilización de sacos"
- KEEP p6 "no se podrán utilizar trozos de madera de roble en la elaboración ni en la crianza de cualquiera de sus vinos"
- KEEP p6 "exclusivamente a partir de alguna de las variedades establecidas Vigiriego (Vigiriega), Chardonnay y Pinot Noir, debiendo utilizarse ... al menos el 70 %"
- KEEP p9 "8.000 kg para la uva tinta, de 9.000 kg para la uva blanca y de 12.000 kg para la uva con destino exclusivamente a espumosos"
- KEEP p9 "6.000 kg para las variedades tintas, salvo para la Tempranillo en la que será de 7.000 kg, y de 8.000 kg para las variedades blancas"
- Cite: p7 dropped from the chapter cite (nothing in the beat comes from it).
- Fly "Contraviesa-Alpujarra": KEEP p9 caps / p6 "no se podrán utilizar trozos de madera de roble". Nominatim "Sierra de la Contraviesa" 36.8662, -3.2456: matches.

### label
- KEEP p4 «Crianza»: "dos años naturales ... dieciocho meses ... a partir del 1 de noviembre ... seis meses, como mínimo, ... en barrica de roble de capacidad máxima de 330 litros" (2, 18, 6 confirmed in words)
- FIX p4 «Reserva» "veinticuatro meses ... seis meses" / "treinta y seis meses ... doce meses" (24, 6, 36, 12 confirmed), plus p5 "la indicación «Reserva», únicamente se podrá emplear en la presentación de un espumoso, cuya crianza, contada desde el momento del tiraje hasta el degüelle, no sea inferior a dieciocho meses": the sparkling rule was missing, now added.
- KEEP p4 «Gran Reserva»: "cuarenta y ocho meses ... seis meses ... en botella el resto" / "sesenta meses ... dieciocho meses" (48, 60, 6, 18 confirmed)
- KEEP p4 «Fermentado en Barrica»: "barricas de madera de roble con capacidad máxima de 600 litros, permaneciendo en las mismas durante un periodo no inferior a tres meses"
- KEEP p4-5 «Barrica» o «Roble»: "envejecimiento mínimo de tres meses en barricas de madera de roble con una capacidad máxima de 600 litros"
- KEEP p5 «Premium»: "cuya crianza, contada desde el momento del tiraje hasta el degüelle, no sea inferior a doce meses"
- KEEP p5 «Nuevo»: "vinos no espumosos de la campaña ... embotellados y etiquetados antes del 1 de marzo del año siguiente"
- KEEP p5 «Joven»: "vinos no espumosos obtenidos en la misma campaña vitivinícola en la que se etiquetan"
- FIX (restored) «Naturalmente Dulce» / «Vendimia tardía»: the first check cut it because p5 points to "la legislación correspondiente", but p1 gives it its own rule ("sin aumento artificial de su graduación ... grado alcohólico natural superior a 15 % vol. y ... adquirido no inferior a 13 % vol.") and p13 makes it compulsory ("En el caso del vino de uvas sobremaduras, se incluirá obligatoriamente la mención «naturalmente dulce» o «vendimia tardía»"). Term added with that rule; label cite now p1, p4, p5, p13. It is the label mention, not the famous style name (Vino de uvas sobremaduradas), which stays in the rules beat.

### Fact sheet, second check (content/facts/andalucia.json, "granada"; not edited)
The sheet has been revised since the first check (cites now `granada-pliego`; grapes, soil, climate and tastes now match p9, p11, p3). Remaining disagreements:
- famous.styles «Vino espumoso de calidad»: sheet "White, rosé or red sparkling wine"; pliego p2 "vino base blanco o rosado utilizado para la elaboración de los vinos espumosos y espumosos de calidad", p3 colours only "en los blancos ... y en los rosados". No red sparkling.
- famous.styles: lists only Vino espumoso de calidad; pliego p1 also protects category 4 «Vino espumoso».
- why: sheet "Half the area lies above 1,000 m"; pliego p11 "alrededor del 50 %" (hedge dropped).
- altitude: sheet "Half of the area lies above 1,000 m above sea level"; pliego p11 "alrededor del 50 % de su superficie" (hedge dropped).
- famous.cite: sheet p1, p2, p3; the overripe-grape style is described on p4 ("Vino de uvas sobremaduradas: Fase visual ..."), which is not cited.
