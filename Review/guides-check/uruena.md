# Sentence check: uruena

Page numbers are PDF pages. They were corrected down by one on 19 Oct 2026 after the check: the tools had counted an empty part before page 1.

Source: uruena-pliego, `Review/sources/fetched/pliego-PDO-ES-02485-uruena.txt` (PDO-ES-02485, pliego de condiciones de la DOP «Urueña», revision 1: modificación PDO-ES-02485-AM01, BOCyL 12/01/2022, in force 25/02/2022). Checked 19 Oct 2026.
Page numbers are the form-feed pages of `Tools/guides/pages.py`, as the guide cites them: page n here is printed "Página n-1 de 15".

## Lede
- FIX p4/p6 "constituyendo una superficie continua de terreno" / "es una llanura": "a single estate" became "one continuous block" (the zone also takes in plots the applicant does not own, p4 "Las parcelas que son propiedad del solicitante son..."); "flat plain" became "plain"; p6 added to the cite.
- KEEP p11 "las variedades Syrah, Cabernet Sauvignon y Merlot suponen un 75% de la superficie total" ("vines" became "vineyard", "and" became "or").
- FIX p11 "En la DOP Rueda, la variedad predominante (con más del 98% de la superficie es la blanca Verdejo), las DOP Ribera del Duero, Toro y Cigales son prácticamente un monocultivo de la variedad Tempranillo": "Its neighbours grow mostly" became "The nearest appellations grow almost only ... the white Verdejo".
- FIX p11 "haciendo que el perfil organoléptico de los vinos sea muy diferente": the cause is Urueña's own grape mix, not the neighbours' ("so" link removed, split into its own sentence).

## estate (place)
- KEEP p4 "en el municipio de Urueña, en la provincia de Valladolid, contando con una superficie total de 78 ha, constituyendo una superficie continua de terreno"
- KEEP p4 "La vinificación ... se realizará en la bodega ubicada dentro de la zona delimitada"
- FIX p6 "la zona está definida por los cursos del río Sequillo, el arroyo de la Ermita y el regato del Veterinario" + p6 "isolíneas subparalelas al río Sequillo, al norte" + p8 "regato del Veterinario en el límite oeste y el arroyo de la Ermita que la limita por el este": "X, Y and Z" list split into sides; arroyo and regato explained.
- KEEP p6 "es una llanura que se encuentra entre los 710 y los 720 m de altitud sobre el nivel del mar"
- KEEP p8 "entre 710 y 720 metros de altitud (sólo el 1,8 % de la superficie de altitud de Castilla y León)"
- FIX p6 "concepto tradicional del pago vitícola (superficie continua de terreno con características edáficas y microclimáticas propias que lo diferencian y distinguen de otros colindantes, destinado de forma tradicional al cultivo de viñedo)": "plot of land" became "continuous piece of land"; the vine-growing half of the definition added.
- KEEP p11 "siendo la DOP Toro la más próxima y similar"
- Flight "The Urueña estate", caption FIX p4/p6: the "X, Y and Z" stream list became "on a plain at 710 to 720 m, with the river Sequillo to the north" ("superficie total de 78 ha" p4; "llanura ... entre los 710 y los 720 m", "río Sequillo, al norte" p6). Point is the place's own geometry (no point in the guide); Nominatim puts Urueña at 41.727, -5.204, with the zone just NW (p6 "La zona situada al noroeste de Urueña").
- Flight ADDED "The river Sequillo", point [-5.221, 41.76], zoom 10 (Nominatim OSM river line, nearest vertex to the zone at 41.7600, -5.2214). Caption p6 "Río Sequillo (afluente del Valderaduey)", "dentro de la cuenca del Duero"; p9 "de forma natural principalmente por el río Sequillo que recoge las aguas de los arroyos del Veterinario y de la Ermita".

## climate (weather)
- KEEP p7 "las mayores precipitaciones se dan en la estación otoñal y las menores en el verano (orden O-P-I-V), total unos 410 mm"
- KEEP p7 "4 meses secos (junio-septiembre)"
- KEEP p7 "Las temperaturas medias anuales son de unos 11,4 grados" / "un valor medio anual de 2650 horas al año"
- FIX p7 "región libre de obstáculos montañosos que permite la influencia oceánica con la entrada de aire húmedo": "Atlantic" (not named) became "the ocean".
- KEEP p7 "el resguardo y abrigo oriental que supone el páramo cercano (>110 m)"; limestone from p8 "el derrame de las calizas desde el Páramo" (p8 added to the cite).
- KEEP p11 "un ciclo largo de madurez a partir del envero, con importantes saltos térmicos entre el día y la noche"
- FIX p11 "posibilita una mejor fijación y complejidad aromática derivada del control natural de la acidez en la uva": "keeps the acidity naturally in balance and fixes aromas and colour" became natural acidity control helping fix aromas and add complexity (colour is tied to acidity in the next sentence).
- FIX p11 "Derivado de esa buena acidez natural de la uva, la fijación y estabilidad del color es mucho mayor ..., aportando vinos con una mayor posibilidad de conservación en el largo plazo después de haber sido embotellados": cause (acidity) restored; "can be kept a long time" became "can keep for longer" (comparative hedge kept).
- KEEP p9 "riesgo medio de heladas que existe preferentemente desde octubre hasta finales de abril"
- KEEP p9 "con un período mayor en los años extremos (desde finales de septiembre hasta finales de mayo)"
- KEEP p9 "la poda se realiza al final del invierno, y las labores en verde comienzan a finales de mayo, cuando el riesgo de heladas ya es mínimo"

## soils (ground)
- FIX p7/p8 "dos tipos de materiales terciarios (los conglomerados Rojos de Belver y la Facies Tierra de Campos s.l.) y por rellenos cuaternarios (terrazas y fondos de valle)": only one of the two Tertiary materials is a conglomerate; both now named.
- FIX p8 "El material original es pedregoso y aporta abundantes elementos gruesos tanto a la superficie (incrementada por el derrame de las calizas desde el Páramo)": "more limestone spills down" became limestone washing down adding more stones at the surface.
- KEEP p8 "lo que en relación con el producto final constituye un factor de calidad"
- KEEP p8 "media-baja fertilidad. La materia orgánica media-baja (0,75-1,5%) y un suelo pobre en nitrógeno"
- KEEP p8 "predominio de la clase franco-arcillo-arenosa. No existen texturas contrastantes. La homogeneidad del perfil ... regula la humedad (al disminuir la escorrentía)"
- KEEP p9 "Los suelos presentan buena capacidad de drenaje ... principalmente por el río Sequillo"
- KEEP p10 "Los suelos de media-baja fertilidad ... junto con la buena capacidad de drenaje dan lugar a vinos ricos en extracto y en antocianos"

## rules (rules)
- FIX cites: p2 (analytical table, unused) removed; p4 added (cold soak, ageing, 70 L were cited to no page that says them). Machine-check warnings on "24" and "70" cleared: p4 "al menos 24 h", "70 litros por cada 100 kg de uva".
- KEEP p5 "Tempranillo (sin. Tinta del país y Tinta de Toro). Cabernet Sauvignon. Merlot. Syrah."
- KEEP p10 "la variedad Syrah que es la variedad con mayor superficie"
- KEEP p11 "la Tempranillo ... que tiene importantes notas frutales y envejece muy bien en barrica"
- KEEP p4 "maceración pre-fermentativa por debajo de 10 ºC durante, al menos 24 h"
- KEEP p4 "En el proceso de elaboración del vino rosado, se realizará una maceración pre-fermentativa en frío"
- KEEP p9/p10 "La maceración prefermentativa a bajas temperaturas permite fijar los aromas afrutados y varietales"
- KEEP p10 "continuos bazuqueos que proporcionan una gran extracción polifenólica y cromática"
- KEEP p3 "tonalidades de piel de cebolla a rosa frambuesa" + p10 "notas azuladas de la variedad Syrah"
- KEEP p3 "rojo púrpura a rojo teja ... frutas rojas y/o frutas negras y, cuando hayan sido envejecidos en madera, especiados y/o balsámicos"
- KEEP p4 "en barricas de roble francés y americano"
- KEEP p5 "será de 8.000 Kg de uva para todas las variedades. No pudiendo obtenerse más de 56 hectólitros por hectárea"
- KEEP p4 "El rendimiento máximo de extracción será de 70 litros por cada 100 kg de uva"
- Label: the guide has no `label` field; nothing to check.

## Fact sheet
- grapes.main: sheet says Syrah alone; pliego p10 says Syrah has the largest area, but p11 calls Tempranillo "variedad predominante en la zona" (probably the wider region; ambiguous).
- grapes.others: sheet "Tempranillo (Tinta del País)"; pliego p5 also lists the synonym Tinta de Toro.
- styles.text: sheet "young or oak-aged"; the pliego defines no young category, only ageing in French and American oak (p4).
- tastes: sheet rosé "fresh fruit and floral notes" leaves out "acarameladas" (p3); otherwise agrees.
- Cites: every sheet field cites "uruena-doc2", not the pliego; values otherwise agree with p3 to p8.
