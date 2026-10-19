# Sentence check: malaga

Source: pliego DOP «Málaga», PDO-ES-A1481, approved by Orden de 30 de noviembre de 2011 (BOJA 249 of 22/12/2011), `Review/sources/fetched/pliego-PDO-ES-A1481-malaga.txt` (source id `malaga-pliego`); pages in `pages.py` numbering. Checked 2026-10-19. Totals: KEEP 54, FIX 14, CUT 0. `check_guide.py`: 0 errors, 0 warnings.

## Lede
- FIX p10 "numerosas horas de insolación propias de su latitud en el punto más meridional de la ribera mediterránea europea, lo que determina su elevado potencial cualitativo para la maduración y sobremaduración de la uva": "suit ripening and even overripening" (added "even") now "give a high potential for ripening and overripening grapes".
- FIX p10 "el tamponamiento de las temperaturas por la situación estratégica a la entrada del atlántico, por la topografía montañosa y la proximidad al mar, factores que gracias al saber hacer de los vinicultores origina una finura y conservación de aromas varietales": "buffer that sun" (the page buffers temperatures), "nearby Atlantic" (page: entrance to the Atlantic), "lasting" aromas (page: keeping them) and an X, Y and Z list; now "Mountains and the nearby sea buffer the temperatures, as does the position at the entrance to the Atlantic. With the growers' skill, that gives the wines finesse and keeps their varietal aromas."

## place
- KEEP p10 "todo el territorio se caracteriza en general por ser montañoso y estar articulado por numerosas sierras que son las estribaciones del macizo montañoso de Sierra Nevada"
- KEEP p10 "Las parcelas vitícolas están situadas en cotas que van desde el nivel del mar hasta los 1000 metros, lo que propicia numerosos microclimas"
- KEEP p9 "vinculados a la historia socioeconómica de la provincia de Málaga desde la colonización de sus costas por los fenicios en el siglo IX a.C."
- KEEP p9 "exportándose grandes cantidades de vino desde el puerto de Málaga"
- KEEP p10 "la superficie dedicada al viñedo que ocupaba 110.000 has y que estaba implantada en todos los municipios de la provincia de Málaga"
- KEEP p10 "la filoxera, que entra precisamente en España por Málaga en 1874"
- KEEP p10 "el viñedo se encuentra disperso en masas de viñas más o menos extensas a lo largo y ancho de la provincia"
- fly "Port of Málaga": KEEP p9 caption "exportándose grandes cantidades de vino desde el puerto de Málaga". Point [-4.415, 36.715] is about 1 km from Nominatim "Puerto de Málaga" (36.709, -4.423); kept.

## weather
- KEEP p10 "tipo Mediterráneo, caracterizado por la suavidad térmica invernal, una época estival seca y escasos días de precipitación"
- KEEP p10 "numerosas horas de insolación propias de su latitud en el punto más meridional de la ribera mediterránea europea"
- KEEP p10 "elevado potencial cualitativo para la maduración y sobremaduración de la uva"
- FIX p10 "por la situación estratégica a la entrada del atlántico, por la topografía montañosa y la proximidad al mar": X, Y and Z list split; now "The mountains and the nearness of the sea buffer the temperatures, as does the position at the entrance to the Atlantic."
- KEEP p10 "gracias al saber hacer de los vinicultores origina una finura y conservación de aromas varietales característicos"
- FIX p10 "entre los que se ha destacado por su fama secular el obtenido de la uva moscatel de Málaga": "The best known for centuries come from the Moscatel de Málaga grape" lost its referent (the aromas); now "Among these aromas, the one from the Moscatel de Málaga grape has been famous for centuries."

## ground
- KEEP p10 "La Axarquía y los Montes se caracterizan por tener suelos pizarrosos, poco profundos"
- KEEP p10 "orografía abrupta, fuertes pendientes y diversas orientaciones"
- FIX p10 "Su proximidad al mar Mediterráneo propicia temperaturas estivales suaves, con un régimen de precipitaciones entre 300 y 700 mm": "falls in a year" is not on the page; now "rainfall is between 300 and 700 mm".
- KEEP p10-11 "que en las zonas más secas es ideal para la práctica tradicional del asoleo de la uva" + p4 "Asoleo: práctica ancestral de sobremaduración de las uvas por exposición directa al sol de los racimos tendidos al aire libre"
- KEEP p4 "manteniendo en todo caso la integridad de las bayas, que en estas condiciones naturales se sobremaduran sin sufrir podredumbres"
- KEEP p11 "En los Montes la diferencia de temperaturas entre el día y la noche es significativa durante el periodo de maduración de la uva"
- KEEP p11 "La Serranía de Ronda se caracteriza por tener suelos con sustrato calizo y pendientes medias ... altitudes de 600 a 1000 metros"
- KEEP p11 "con alta pluviometría anual, veranos secos y calurosos"
- KEEP p11 "con mayores diferencias de temperatura entre el día y la noche"
- KEEP p11 "Los suelos de la zona de Manilva son albarizos, de alto contenido en caliza, de pendiente suave"
- KEEP p11 "Su proximidad al Atlántico le confiere un subclima más húmedo y fresco"
- KEEP p11 "La zona Norte, ubicada en la altiplanicie de Antequera, a partir de 400 metros de altitud"
- KEEP p11 "tiene suelos pardo-calizos, profundos, y en general pendientes bajas"
- KEEP p11 "Al ser una zona situada en el interior de la provincia su clima es más continental, con temperaturas más extremas en verano e invierno"
- fly "Axarquía": FIX point. Caption KEEP p10 "suelos pizarrosos ... fuertes pendientes" / "proximidad al mar". Point moved from [-4.05, 36.85] (about 6 km off) to Nominatim "La Axarquía" [-4.111, 36.866].
- fly "Serranía de Ronda": FIX point. Caption KEEP p11 "sustrato calizo ... altitudes de 600 a 1000 metros, con mayores diferencias de temperatura entre el día y la noche". Point moved from [-5.17, 36.74] (about 7 km off) to Nominatim "Serranía de Ronda" [-5.178, 36.677].
- No missing flight added: the guide already flies beyond the place itself (port, Axarquía, Serranía de Ronda).

## rules
- KEEP p9 "de las que se consideran preferentes «Pero Ximén» y las «Moscateles»"
- KEEP p9 "«Moscatel de Málaga» (Moscatel de Alejandría), «Moscatel Morisco» (Moscatel de grano menudo)"
- KEEP p9 "Lairén, Doradilla y Rome"
- KEEP p8 "La producción máxima por hectárea será de 12.000 Kg"
- KEEP p1 "se clasifican en tres grupos"
- FIX p1 "Vinos de licor o encabezados, que son aquellos en cuya elaboración se ha adicionado alcohol vínico" + p4 "Encabezado: adición de alcohol de origen vínico": "vine alcohol" now "wine alcohol".
- KEEP p1 table "De licor  Seco ... 15-22" / "Dulce ... 15-22" (acquired % vol)
- KEEP p1 table "< 45" (seco) / "≥ 45" (dulce)
- KEEP p5 "Los vinos de licor dulces se elaboran a partir de mostos de uvas bien maduras, o asoleadas"
- KEEP p5 "empleando únicamente mostos de yema, cuya fermentación es muy lenta e incompleta"
- KEEP p5 "Vino Dulce Natural: obtenido de mostos procedentes de las variedades «Pero Ximén» y/o «Moscatel», con una riqueza natural inicial mínima de azúcares de 212 gramos por litro"
- KEEP p1 "Vinos dulces elaborados sin ningún aumento artificial del grado alcohólico natural"
- KEEP p7 "a partir de uva sobremadurada, exclusivamente de las variedades preferentes «Pero Ximén» y/o «Moscatel»"
- KEEP p7 "mostos con una riqueza natural inicial superior a 300 g/l de azúcares ... con el alcohol procedente en su totalidad de fermentación. El grado alcohólico volumétrico adquirido será como mínimo de 13 %"
- FIX p3 "«Naturalmente Dulce»: ... de color amarillo pálido a dorado ... en boca destaca su equilibrio ácido-dulce, resultando frescos, untuosos y persistentes": "lively" came from the general overripe-grape wine (p2), not this mention, and the line was an X, Y and Z list; now "The wine is pale yellow to gold. On the palate it balances acid and sweet, and it is fresh and unctuous."
- KEEP p2 table "De uvas pasificadas  Dulce ... >140"
- KEEP p2 "de amarillo pálido a oro viejo ... con matices de uva pasificada"
- KEEP p1 "Vino seco, no encabezado"
- KEEP p1 "se obtiene exclusivamente por fermentación natural" + p2 table "Vino seco  ≥ 15  ≥ 15  <4"
- KEEP p2 "De color amarillo a ámbar según vejez, de aroma penetrante, potente"
- FIX p5-6 "se emplea para dar los tonos de color característicos de los vinos «Málaga» de licor": "gives liqueur wines their colour" widened the page; now "gives Málaga liqueur wines their characteristic shades of colour".
- KEEP p5 "mosto de uva concentrado a un tercio del volumen inicial, obtenido por aplicación directa de calor"
- KEEP p6 "Si el «arrope», a su vez, se concentra hasta el 50% de su volumen, se denomina «pantomima»"
- FIX p7 "El envejecimiento o crianza de los vinos se efectuará por el sistema estático de «añadas» o por el sistema dinámico de «criaderas y soleras», exclusivamente en vasijas de madera de roble ... capacidad máxima de 1.000 litros": "All the wine ages" widened the rule (Pálido is not aged) and the Spanish terms were unexplained; now "Ageing takes place only in oak vessels of at most 1,000 litres. It follows either the static system of single vintages (añadas) or the dynamic system of criaderas and soleras."
- KEEP p8 "todos los vinos de licor «Málaga», a excepción de aquellos con la mención «Pálido», se someterán a envejecimiento por un periodo medio no inferior a seis meses"

## label
- FIX p3 Pálido "aromas primarios o varietales ... muy poco o nada evolucionado al no ser sometido a envejecimiento, ni tampoco a adición de arrope": "fresh" is not on the page; now "primary or varietal aromas that are little or not at all evolved".
- FIX p3/p5 Maestro "Vino dulce natural, con una riqueza alcohólica de 15-16% vol., y más de 100 g/l ... el encabezado hasta 8% vol. se realiza antes de iniciarse la fermentación, lo que da lugar a una fermentación muy lenta que se paraliza": "A sweet wine ... which stalls it" now "A Dulce Natural ... so fermentation runs very slowly and stops".
- FIX p3/p5 Tierno "Vino de licor dulce" + "uva largamente asoleada ... superior a 350 g/l" + "notas que recuerdan a las uvas pasas": "A sweet wine" now "A sweet liqueur wine".
- KEEP p6 Pajarete table "Sin adición  Mínimo de 2 años.  45 - 140  Dorado a ámbar oscuro" (p3 "Vino de licor")
- KEEP p7 Lágrima "sólo se ha empleado el mosto que sin presión mecánica alguna, una vez pisada la uva, fluye de ella"
- KEEP p7 Vendimia Asoleada "mostos obtenidos íntegramente a partir de uvas sometidas a asoleo, exclusivamente de las variedades «Moscatel» y/o «Pero Ximén»"
- KEEP p6-7 Dorado "En los vinos de licor sometidos a envejecimiento" + "«Dorado» o «Golden»  0%  Dorado a ámbar"
- KEEP p7 Negro "«Negro o Dunkel»  ≥15%  Desde ébano al negro"
- KEEP p8 Noble "mínimo de 2 años, e inferior a 3 años"
- KEEP p8 Añejo "mínimo de 3 años, e inferior a 5 años"
- KEEP p8 Trasañejo "superior a 5 años"
- No term points to other law; no famous style (Dulce Natural, Vino de uvas pasificadas, Vino Naturalmente Dulce) is in `label`.

## Fact sheet
`content/facts/andalucia.json`, entry `malaga` (not edited). It cites `malaga-doc` and `malaga-wiki`, not `malaga-pliego`.
- grapes.others: sheet "Airén"; pliego p9 lists only Lairén, Doradilla and Rome besides the preferred grapes. No Airén.
- grapes.others spelling: sheet "Laíren", "Romé"; pliego p9 "Lairén", "Rome".
- grapes.main: sheet "Moscatel Grano Menudo"; pliego p9 "«Moscatel Morisco» (Moscatel de grano menudo)" (sheet "Pedro Ximénez" is the pliego's gloss of "Pero Ximén").
- why: sheet "a strong Mediterranean sun that gives high natural alcohol"; pliego p10 says the sun gives "elevado potencial cualitativo para la maduración y sobremaduración de la uva", nothing on natural alcohol.
- styles.kinds / text: sheet "white", "Dry whites"; pliego p1-2 "Vino seco, no encabezado ... De color amarillo a ámbar según vejez", never called white.
- soil: sheet empty; pliego p10-11 gives slate (Axarquía, Montes), limestone (Serranía de Ronda), albariza (Manilva) and deep brown-limestone (Norte) soils.
