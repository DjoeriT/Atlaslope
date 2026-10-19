# Sentence check: jerez

Source: pliego DOP «Jerez-Xérès-Sherry», PDO-ES-A1483, consolidated per Orden de 13 de mayo de 2026 (BOJA núm. 95 de 20/05/2026), `Review/sources/fetched/pliego-PDO-ES-A1483-jerez.txt` (source id `jerez-pliego`); pages in `pages.py` numbering. Checked 2026-10-19. Totals: KEEP 55, FIX 12, CUT 0.

## Lede
- FIX p8 "roca madre llamada «albariza», una marga blanda de color blanco" + p10 "frecuentes brisas nocturnas que soplan desde el océano Atlántico" / p7 "contribuyen al mantenimiento de los niveles de humedad": "a place cooled by night breezes" (cooling not on any page) now "a zone kept humid by frequent night breezes"; "mostly" added (suelos predominantes).
- FIX p10 "La crianza biológica ... se beneficia extraordinariamente ... de los altos niveles de humedad que propicia el aprovechamiento –gracias a la tradicional arquitectura bodeguera de la zona– de las frecuentes brisas nocturnas": "the humidity that the flor yeast needs" widened the page; now "benefits greatly from that humidity, which the traditional cellar architecture puts to use".

## place
- KEEP p7 "noroeste de la provincia de Cádiz, la más meridional de la España peninsular"
- KEEP p7 "enmarcada al norte por el río Guadalquivir, al oeste y el sur por el Océano Atlántico"
- KEEP p7 "al este por las estribaciones de la Sierra de Cádiz"
- KEEP p7 "horizontes abiertos, dominados por terrenos llanos o suavemente ondulados"
- KEEP p7 "zonas de marismas, restos inundables de lo que fue el Lacus Ligustinus, la antigua dársena del Guadalquivir"
- FIX p7 "salinas y esteros, parcialmente inundados por las mareas": Spanish term "esteros" was unexplained; now "esteros, tidal marsh inlets".
- KEEP p6 "«pagos», consistentes en parajes o sitios rurales con características edáficas y de microclima propias"
- fly "Guadalquivir marismas": KEEP p7 caption (same words as above). Point [-6.2, 36.85] is about 3 km from Nominatim "Trebujena" (36.869, -6.177), at the marsh edge; kept.
- fly "Salt pans of Puerto Real": FIX p7 caption, "esteros" explained. Point moved from [-6.15, 36.5] (about 5 km SE of Puerto Real, outside the salt pans) to Nominatim "Salinas Virgen de los Desamparados, Puerto Real" [-6.208, 36.570].

## weather
- KEEP p8 "El clima de la zona productora de los vinos de Jerez es de carácter cálido"
- KEEP p8 "mínimas del invierno que giran alrededor de los 5 °C y las máximas del verano que se sitúan en torno a los 35 °C"
- KEEP p8 "El riesgo de heladas es mínimo"
- KEEP p8 "el efecto regulador del mar hace que las viñas del interior alcancen valores algo más extremos"
- KEEP p8 "más de 300 días de sol al año ... A pesar de ello, la pluviometría media anual es de aproximadamente 600 litros por metro cuadrado"
- KEEP p8 "fundamentalmente en los meses de noviembre, diciembre y marzo"
- FIX p8 "capacidad de las tierras albarizas de retener la humedad y evitar la evapotranspiración": "limits evapotranspiration" now "can hold that moisture and avoid evapotranspiration".
- KEEP p8 "la proximidad del viñedo a la zona costera aporta intensos rocíos ... efecto regulador de las altas temperaturas"
- KEEP p8 "importante influencia climática de los dos vientos predominantes en la región"
- KEEP p8 "el viento de levante, proveniente del interior, seco y cálido"
- KEEP p8 "el viento de poniente, que por proceder del océano aporta un elevado grado de humedad y que actúa como importante factor moderador, especialmente en el verano"
- KEEP p8 "crianza biológica, para la que el mantenimiento de unas temperaturas moderadas en el interior de la bodega y unos altos niveles de humedad son fundamentales"

## ground
- KEEP p8 "Los suelos predominantes en el viñedo están formados por la roca madre llamada «albariza», una marga blanda de color blanco"
- KEEP p8 "cuando aflora en la superficie proporciona el tradicional paisaje de la viña jerezana"
- KEEP p8 "una tierra fácil de labrar, con una gran capacidad retentiva de la humedad"
- KEEP p8 "permite un excelente desarrollo del sistema radicular"
- KEEP p8 "carbonato cálcico (normalmente en concentraciones de al menos el 25% y hasta el 40%), la arcilla y la sílice"
- KEEP p8 "caparazones de diatomeas y radiolarios presentes en el mar que ocupaba la zona en el período oligocénico"
- FIX p8 "«barros» ... generalmente situados en las vaguadas y partes bajas de las colinas ... importante proporción de arcilla y arena, así como un mayor contenido en materia orgánica, lo que le da un color más oscuro y más fertilidad": "barros" was unexplained and the cause of colour and fertility dropped; now one sentence for place, one for clay, sand and organic matter.
- FIX p8 "Las arenas por su parte son terrenos predominantes en las viñas costeras, tienen menos de un 20% de caliza": "arenas" explained as sandy soils; "mostly in" now "predominate in".
- KEEP p9 "Los suelos de albarizas predominantes en la zona producen vinos con una clara expresión calcárea"
- KEEP p9 "elegantes, con cuerpo y sapidez y una gran capacidad de evolución a largo plazo"
- FIX p9 "permite la elaboración de «vinos generosos» con niveles de vejez muy elevada en algunos casos": "generosos" was used before the rules beat explains it; now "the dry vinos generosos".

## rules
- KEEP p10 "la principal variedad en términos cuantitativos, la Palomino Fino"
- KEEP p10 "da a los vinos una alta expresión del terreno y una gran capacidad de envejecimiento"
- KEEP p10 "la Moscatel de Alejandría y la Pedro Ximénez, por su mayor contenido en azúcares y acidez, son a su vez óptimas para la elaboración de los tradicionales «vinos dulces naturales»"
- KEEP p2 "Todos los «vinos generosos» se considerarán vinos secos"
- KEEP p1 "envejecimiento promedio mínimo de dos años" + p4 "fermentación alcohólica completa" + p5 "barricas de roble de capacidad no superior a 1.000 litros"
- KEEP p1 "Fino: vino de crianza exclusivamente biológica" + p5 "película de levaduras típicas que se desarrolla sobre la superficie libre del vino"
- KEEP p1 "Amontillado: ... una primera fase de crianza biológica seguida de una fase de crianza oxidativa"
- KEEP p1 "Oloroso: vino de crianza exclusivamente oxidativa, tras la desaparición del inicial velo de flor"
- KEEP p1 "Palo Cortado: vino de crianza predominantemente oxidativa, tras la desaparición del inicial velo de flor"
- KEEP p3 "Fino ... del amarillo pajizo al ámbar"
- FIX p3 "deberá presentar al menos dos de los siguientes aromas propios de la crianza biológica: manzana verde, frutos secos o levadura (masa fresca de pan)": hedge "at least two" dropped and "frutos secos" read as dried fruit; now "at least two aromas of biological ageing: green apple, nuts or yeast like fresh bread dough".
- KEEP p3 "Oloroso ... del oro viejo al caoba oscuro"
- KEEP p3 "frutos secos y maderas nobles envinadas"
- KEEP p1 "fortificación con alcohol de mostos de uva sobremadura o pasificada"
- KEEP p1 "al menos un 85% de mostos de uva pasificada de la variedad Pedro Ximénez"
- KEEP p3 "tonos ébano ... principalmente aromas de pasas"
- KEEP p1 "al menos un 85% de mostos de uva con o sin pasificación de la variedad Moscatel"
- KEEP p3 "flores blancas y/o notas cítricas"
- KEEP p4 "la práctica del «asoleo», consistente en la exposición de los racimos de uva al sol"
- KEEP p10 "mayor concentración tanto del azúcar como de la acidez ... fruta muy madura y una notable untuosidad"
- KEEP p10 "vinos obtenidos por cabeceos (combinación) de los vinos anteriores"
- FIX p2 "obtenidos de «vino generoso» ... al que se le ha añadido ... «vino dulce natural» y ofrecido al consumo con dos años de edad media de maduración en barricas de roble": "made from generosos" dropped the sweetening; now "start from a generoso that is then sweetened, for example with sweet natural wine" and "sold with an average of two years in oak".
- KEEP p9 "cuyo fin originario no era sino estabilizar vinos que habían de viajar" ("Largas travesías")
- KEEP p9 "tuvo un papel determinante en la aparición –por selección natural– de las levaduras de velo de flor"
- KEEP p9 "origen histórico que se remonta hasta el siglo XVIII ... vinos de una calidad mantenida en el tiempo, con independencia de las vicisitudes de cada cosecha" (warned number 18 = XVIII, confirmed)
- KEEP p5 "extracciones o «sacas» periódicas de parte del vino ... «rocíos» con vino de otra escala más joven" + p9 "notablemente favorecido por la realización periódica de «sacas»"
- fly "Jerez de la Frontera": FIX p8 "las Ordenanzas del Gremio de la Vinatería de Jerez en el siglo XVI" (warned number 16 = XVI, confirmed): "sits at the heart of the Marco de Jerez" was not on the page and left "Marco de Jerez" unexplained; now "Jerez's wine guild, the Gremio de la Vinatería, had ordinances in the 16th century to protect the area's wine". Point [-6.137, 36.686] vs Nominatim (36.682, -6.138): kept.
- No flight added: the guide already flies beyond the town (marismas, salt pans).

## label
- KEEP p6 "Fino Viejo. Fino sometido a un envejecimiento medio mínimo de siete años ... presenta signos leves de oxidación" (warned number 7 = siete, confirmed)
- FIX p6 "Vinos con Vejez Calificada ... Vinos de más de 12 años. Vinos de más de 15 años. Vinos de más de 20 años o V.O.S. ... de más de 30 años o V.O.R.S.": text implied only two steps; now adds that V.O.S. and V.O.R.S. are its two oldest steps.
- KEEP p6 "Vinos de más de 20 años o V.O.S. («Vinum Optimum Signatum» / «Very Old Sherry»)"
- KEEP p6 "Vinos de más de 30 años o V.O.R.S. («Vinum Optimum Rare Signatum» / «Very Old Rare Sherry»)"
- KEEP p5 "los vinos procedentes de cada una de las vendimias se envejecen separadamente, sin que se realicen mezclas con vinos procedentes de vendimias diferentes"
- KEEP p2 "Cream. Vinos obtenidos a partir de «vinos generosos» y con un contenido en azúcar entre 115 y 140 g/L"
- Famous styles (Fino, Amontillado, Oloroso, Palo Cortado) are not in `label`: correct.

## Fact sheet
Entry `jerez` in `content/facts/andalucia.json` (cites `jerez-doc`/`jerez-wiki`, not the pliego). Not edited.
- famous.styles text: sheet "dry: no more than 5 g/l reducing sugars"; pliego "≤4" g/l sugar (glucose and fructose) for Fino, Amontillado, Oloroso, Palo cortado, up to 9 g/l for vejez calificada (p2).
- grapes.others: sheet "Moscatel Grano Menudo", "Palomino"; pliego authorises "Palomino, Listán Blanco o Palomino Fino, Pedro Ximénez, Moscatel de Alejandría, Beba, Perruno y Vigiriega" (p7). Moscatel Grano Menudo is not authorised; Beba, Perruno, Vigiriega are missing.
- styles.kinds: sheet "fortified", "sweet"; pliego also has category "vino" (unfortified vinos generosos, point 1) beside "vino de licor" (p1).
- climate and tastes: sheet empty; pliego has both (p8 "carácter cálido", p9 "equilibrados, sápidos, de gran intensidad y persistencia en boca").
