# Sentence check: valtiendas

Source: Pliego de condiciones D.O.P. «VALTIENDAS», PDO-ES-A0747 (Review/sources/fetched/pliego-PDO-ES-A0747-valtiendas.txt, 16 pages; cites are PDF pages). Checked 2026-10-19 against content/guides/valtiendas.json from main.

## Lede
- FIX p9 "altitud media sobre el nivel del mar, superior a los 800 metros" / "páramo (localización mayoritaria del viñedo)" / "grandes oscilaciones térmicas entre el día y la noche": "sits on a plateau more than 800 m" became "Most Valtiendas vineyards stand on a high plateau, at an average altitude above 800 m". The page gives an average altitude, and most vineyards (not all) are on the páramo.
- FIX p12 "incrementa los índices de acidez gracias a la amplitud térmica" + p11 "notable incremento de la acidez natural en relación a otras zonas próximas, obteniendo vinos más frescos y vivos": "keeps the acidity high" became "raises the acidity", and "taste fresher" became "are fresher". Added cite p12.

## north-segovia (place)
- FIX p7 "ubicada al Norte de la provincia de Segovia y tiene una superficie de 433,4 Kilómetros cuadrados": the 433.4 km² is the zone, not the vineyards. "The vineyards lie ... cover" became "The zone lies ... covers".
- KEEP p7 "Comprende los siguientes municipios todos ellos pertenecientes a la provincia de Segovia" (16 named; counted). Reworded to "It takes in" to follow the subject change.
- KEEP p7 "La zona de envejecimiento ... coincide con la zona de producción"
- KEEP p12 "La vid ha estado presente en la comarca de Valtiendas desde tiempo inmemorial"
- KEEP p12 "vestigios de viñedo desde el siglo XII aunque los más importantes indicios de viñedo datan del siglo XV" (machine warning "15" confirmed as XV)
- KEEP p13 "La región de Fuentidueña posee un viñedo bastante extenso (710 hectáreas en 1.751). Pero la producción de vino se destina sobre todo al consumo local."
- FIX p13 "Con el crecimiento de la vecina Denominación de Origen «Ribera del Duero» a primeros de la década de los noventa, se fomentan la realización de nuevas plantaciones, con sistemas modernos de cultivo": "The area took off" was a widening. The page says new plantings were encouraged. Now "As neighbouring Ribera del Duero grew in the early 1990s, new vineyards were planted here with modern growing methods." (machine warning "1990" confirmed as "década de los noventa")
- FIX p13 "y se construyen nuevas bodegas": split out of the "X, Y and Z" list into "New wineries were built too."
- FIX p13 "culmina en marzo de 2007 ... se reconoce el V.C.P.R.D. «Vino de Calidad de Valtiendas»": the Spanish term was unexplained. Now "In 2007 the zone was recognised as Vino de Calidad de Valtiendas, "quality wine of Valtiendas"."
- Fly "The Valtiendas vineyards": KEEP p7 "al Norte de la provincia de Segovia ... 433,4 Kilómetros cuadrados". Uses `place: valtiendas`, so it has no point to check.
- Fly added: "Fuentidueña", point [-3.9801, 41.4408] (Nominatim, Fuentidueña, Segovia), zoom 11. Caption cites p13 "La región de Fuentidueña posee un viñedo bastante extenso (710 hectáreas en 1.751)".

## climate (weather)
- KEEP p9 "El clima: es mediterráneo con influencias continentales"
- KEEP p9 "altitud media ... superior a los 800 metros. Como consecuencia los inviernos son largos y rigurosos y los veranos son suaves"
- KEEP p9 "grandes oscilaciones térmicas entre el día y la noche ... principalmente entre agosto y septiembre"
- KEEP p9 "la radiación solar se ve favorecida por la altura, así como los vientos que proporcionan una mayor sanidad de la uva"
- KEEP p9 "La precipitación anual no es elevada situándose entre los 400 – 500 milímetros"
- KEEP p9 "Pero compensada por la buena capacidad de retención de sus suelos"
- KEEP p12 "La maduración de la uva se desarrolla de forma lenta y progresiva"
- KEEP p12 "elevada concentración de los principales compuestos fenólicos de la uva, como son antocianos y taninos, que se refleja en el color y estructura del vino"
- FIX p12 "La síntesis de compuestos aromáticos volátiles se ve potenciada ... favorece una mayor intensidad aromática de los vinos" / "La altura aporta un efecto refrescante que incrementa los índices de acidez gracias a la amplitud térmica": "the cool nights add acidity" invented a cause. Now "Aroma compounds build up too, which makes the wines more aromatic. The height has a cooling effect, and the wide temperature swing raises acidity."

## paramo (ground)
- KEEP p9 "sobre todo aquellos situados en el páramo (localización mayoritaria del viñedo)". Páramo is glossed as "the high flat plateau".
- FIX p9 "En general los suelos se caracterizan por tener una textura media con alto contenido en arcilla, sobre todo aquellos situados en el páramo": the page describes soils in general, and the páramo above all. The guide had narrowed this to the páramo only. Now "Soils across the zone generally have a medium texture and a lot of clay, above all on the páramo."
- KEEP p9 "que les permite retener agua y macro-nutrientes como el potasio"
- KEEP p9 "una autentica cubierta de cantos rodados, guijarros"
- FIX p9 "además de facilitar el drenaje, mejorar las condiciones de maduración de los racimos y favorecer la formación de un mulching natural": split the "X, Y and Z" list into two sentences.
- KEEP p9 "confiere un perfil aromático mineral que diferencia a los vinos obtenidos". The subject is now "The stones".

## vines (rules)
- KEEP p8 "Variedad principal: Tempranillo" + p10 "la Tinta del País o Tempranillo"
- KEEP p6 "con un mínimo del 50% de la variedad Tempranillo" (both rosado and tinto)
- KEEP p8 "Variedades autorizadas: Garnacha Tinta, Cabernet-Sauvignon, Merlot y Syrah"
- KEEP p6 "El Vino Rosado se elaborará con las variedades Albillo Mayor, ..." + p8 "Variedades de uva blanca: ... Albillo Mayor"
- FIX p10-11 "Éstas variedades son más productivas y se busca en ellas un grado de acidez más elevado": "is picked for its higher acidity" read like harvest timing. Now "growers look to it for higher acidity". (The quote runs from p10 to p11. The sentence keeps the cite list, which has both pages.)
- KEEP p11 "que de frescura a los vinos rosados elaborados"
- KEEP p7 "Variedades tintas: 7.000 Kilogramos/hectárea" + p10 "en viñedos dispuestos en espaldera se están obteniendo unos rendimientos de alrededor de 7.000 Kilogramos/hectárea"
- FIX p7 "Variedades blancas: 10.000 Kilogramos/hectárea": added the missing "per hectare". Albillo Mayor is the only white allowed (p8).
- KEEP p5 "La densidad de plantación mínima será de 2.000 cepas por hectárea y la máxima de 4.000"
- FIX p11 "Fase visual: colores intensos de capa media-alta y bien estructurados, lo que favorece su envejecimiento": the page says this of the wines, not only the reds. "The reds" became "The wines", and "suits" became "favours".
- FIX p16 "para los vinos ... sometidos a envejecimiento, se podrán utilizar en el etiquetado los términos tradicionales: «CRIANZA», «RESERVA» y «GRAN RESERVA» ... los periodos de envejecimiento se contabilizarán a partir del 1 de noviembre del año de la vendimia": this is the famous style, so it stays in the rules beat, and it now carries the pliego's own rule. Now "Aged wines may carry Crianza, Reserva or Gran Reserva on the label, with ageing counted from 1 November of the harvest year." The detailed conditions point to E-Bacchus, and the guide does not repeat them. «ROBLE» (p16, "legislación vigente") is not in the guide, which is correct.
- KEEP p11 "los vinos rosados además de los aromas frutales propios de la variedad (frambuesa, mora, zarzamora, etc.) presentan aromas florales característicos"

Machine check: ok, 0 errors, 2 warnings (both confirmed above).

## Fact sheet (content/facts/castilla-y-leon.json, valtiendas; not edited)
- climate: the sheet says "warm dry summers". The pliego says "los veranos son suaves" (mild) (p9).
- grapes: the sheet lists `others: []`. The pliego authorises Garnacha Tinta, Cabernet-Sauvignon, Merlot and Syrah (red) and Albillo Mayor (white) (p8).
- tastes: the sheet says "Aged reds: wood well integrated". The pliego's aged-red description has no wood: "Color rojo intenso con tonalidades de envejecimiento ... Aromas francos, agradables e intensos ... Sabroso, equilibrado y con buena estructura" (p5).
- tastes: the sheet says "mineral tones in all reds". The pliego says "Más destacables en los vinos tintos, son los toques de aromas minerales", which means more notable in reds, not all reds (p11).
- famous.styles: the sheet's text "well-integrated wood" is not in the pliego (p5, p16).
- cites: every sheet cite points to "valtiendas-doc" / "valtiendas-wiki", not to this pliego. The grapes cite is Wikipedia.
