# Green Spain Terroir and flags: sentence-by-sentence source check (19 Oct 2026)

ReviewBot, Opus. Commit checked: a525ef8 (branch claude/project-thread-oge0zs).

## Totals

| Place | KEEP | FIX | CUT | not reproduced |
|---|---|---|---|---|
| Txakoli de Getaria | 33 | 10 | 0 | 0 |
| Txakoli de Bizkaia | 25 | 19 | 2 | 0 |
| Txakoli de Álava | 18 | 13 | 1 | 0 |
| Cangas | 37 | 5 | 2 | 0 |
| Rías Baixas | 43 | 10 | 0 | 0 |
| Ribeira Sacra | 48 | 4 | 0 | 0 |
| Valdeorras | 51 | 14 | 0 | 2 |
| Ribeiro | 42 | 9 | 0 | 7 |
| Monterrei | 24 | 8 | 2 | 2 |
| **All nine** | **321** | **92** | **7** | **11** |

Items are sentences, fly captions and label terms. Most FIXes (about 45) are meta lines such as "The pliego says/calls ...", which talk about the source instead of the place (card point 2). The worst findings:
1. Álava says the wine is "high in acidity". The page says the opposite (p5 "niveles bajos de acidez", p6 "vinos redondos, de baja acidez").
2. The four Rías Baixas flags cite p8. That is the AGACAL page number; in the DOG file the subzone table is on p10.
3. Bizkaia chapters[2] opens with "The pliego gives no soil description" (CUT). Its chapters[1] cite only p6, while sun hours, cool summers and the September foehn are on p7.
4. Label terms that only point to Real Decreto 1363/2011 or E-Ambrosia (Cangas Barrica; Monterrei Crianza... and Barrica): CUT.
5. Berezia in Bizkaia and Álava says "sold from 1 May". The page says certification ("calificación") starts on 1 May.
Also: "elegant" in Valdeorras (FIX). Rías Baixas puts "(2022 data)" on the wrong figure. The Ribeira Sacra pliego gives two different red-grape yield caps (p1 vs p10), for the owner to settle.

Method: every sentence of lede, chapter paras, fly captions and label terms was matched (grep + line read) against the pages its block cites in the matching `pliego-*.txt`. Cites are per block, not per sentence, so a sentence is KEEP when any cited page says it.

## Txakoli de Getaria (content/guides/txakoli-getaria.json, pliego-PDO-ES-A0741)

| File | Field | Verdict | Spanish on the page | Corrected text (FIX) |
|---|---|---|---|---|
| txakoli-getaria.json | lede s1 | FIX | p5 "el 95% de los viñedos a menos de 1 km. del mar" | "95% of the vineyards are less than 1 km from the sea." ("almost every" is a paraphrase of a number) |
| txakoli-getaria.json | lede s2 | FIX (meta) | p5 "un Txakoli fresco y ligero característico de esta zona" | "The wine is a fresh, light Txakoli, characteristic of this zone." |
| txakoli-getaria.json | chapters[0].paras[0] s2 | FIX (copy: X, Y and Z list) | p4 "En 2007 se amplia ... de los tres municipios iniciales de Aia, Getaria y Zarautz a toda la provincia" | "Before 2007 the zone was only three municipalities." |
| txakoli-getaria.json | chapters[0].paras[1] | FIX (meta) | p5 as above | "95% of the vineyards are less than 1 km from the sea." (also repeats lede and fly; consider cutting one) |
| txakoli-getaria.json | chapters[0].paras[2] s1 | FIX | p4 "prácticamente se refugia en la zona costera de Getaria y Zarautz" | "In the 19th century nearly all of the province's vines retreated to the coast at Getaria and Zarautz." |
| txakoli-getaria.json | chapters[1].paras[0] | FIX (meta) | p3 "Clima: atlántico suave de influencia marítima" | "The climate is mild Atlantic, with a maritime influence." |
| txakoli-getaria.json | chapters[1].paras[3] | FIX (meta) | p3 "Riesgo de heladas primaverales: inexistente" | "There is no risk of spring frost." |
| txakoli-getaria.json | chapters[1].fly[0].caption | FIX (copy: two ideas) | p3 "Pluviometría media anual: 1.600 mm" | "Rain averages 1,600 mm a year." |
| txakoli-getaria.json | chapters[2].paras[2] s2 | FIX | p3 "protege los suelos de la erosión y facilita la actividad biológica, enriqueciéndolos de materia orgánica" | "It protects the soil from erosion. It helps biological life, which enriches the soil with organic matter." |
| txakoli-getaria.json | chapters[3].paras[5] s1 | FIX (meta) | p5 "dando lugar a un Txakoli fresco y ligero" | "The result is a fresh, light Txakoli." |
| txakoli-getaria.json | all other 33 items | KEEP | p2 85%/50%/barricas/13.000/0,72/93 hl/varieties; p3 13,4/16,4/10,5 °C, 185 días, 1.800 h, calizas/margas, franco-arcillosas, pH neutro, pendientes 15-20%; p4 35 has, 80% parral, poda larga, lías, CO2; p5 viento sur/suroeste, 11,5º, 7 gr/l; p7 vendimia tardía 12%, espumosos | - |
| txakoli-getaria.json | chapters[1].title | note | "Mild, wet and maritime" is an X, Y and Z list in a heading | owner/LeadBot to reword |

## Txakoli de Bizkaia (content/guides/txakoli-bizkaia.json, pliego-PDO-ES-A0746)

| File | Field | Verdict | Spanish on the page | Corrected text (FIX) |
|---|---|---|---|---|
| txakoli-bizkaia.json | lede s1 | FIX (cite) | p7 "cadenas montañosas de media altitud", "veranos frescos" (p7, not cited) | "Bizkaia has an Atlantic, humid, temperate climate, with cool summers and little sun." Add p7 to lede.cite. |
| txakoli-bizkaia.json | lede s2 | FIX (copy list; "dry" only on p1, not cited) | p1 "Serán vinos secos"; p10 "claramente inferiores a las de otras zonas próximas" | "The wines are lower in alcohol than in nearby zones, and higher in acidity." (add p1 to cite if "dry" stays) |
| txakoli-bizkaia.json | label.terms[0] Berezia | FIX (translation) | p4 "Su calificación se iniciará a partir del 1 de mayo del año siguiente" | "A txakoli aged at least 5 months in tanks of cement, ceramic, wood or other materials. Its certification starts on 1 May of the year after harvest." |
| txakoli-bizkaia.json | chapters[0].paras[1] s2 | FIX (added "between them") | p7 "la existencia de dos valles principales, de los ríos Ibaizabal y Butrón" | "There are two main valleys, of the Ibaizabal and the Butrón." |
| txakoli-bizkaia.json | chapters[0].fly[0].caption | FIX ("hills" for mountain ranges) | p7 "cadenas montañosas de media altitud (100 a 1000 m.)" | "Mountain ranges of 100 to 1,000 m, with two main valleys." |
| txakoli-bizkaia.json | chapters[1].paras[0] s1 | FIX (meta) | p6 "de tipo Atlántico, húmedo y templado" | "The climate is Atlantic, humid and temperate." |
| txakoli-bizkaia.json | chapters[1].paras[2] s2 | FIX (number + cite) | p7 "1.710 horas/año" | "The sun shines 1,710 hours a year." Add p7 to chapters[1].cite. |
| txakoli-bizkaia.json | chapters[1].paras[2] s3 | FIX (cite) | p7 "días cubiertos ... 145 ... despejados ... 47" | text KEEP; cite p7 |
| txakoli-bizkaia.json | chapters[1].paras[3] s1-s2 | FIX (cite) | p7 "veranos frescos ... moderadas por la proximidad al mar, que propician una lenta maduración" | text KEEP; cite p7 |
| txakoli-bizkaia.json | chapters[1].paras[4] s1-s2 | FIX (cite) | p7 "Septiembre ... más propio del verano ... efecto Foehn" | text KEEP; cite p7 |
| txakoli-bizkaia.json | chapters[1].paras[4] s3 | FIX (meta) | p7 "determina y condiciona la maduración final de la uva" | "This decides the final ripening of the grapes." |
| txakoli-bizkaia.json | chapters[1].fly[0].caption | FIX ("about"; two ideas; 1,710 is p7) | p6 "Precipitación Media Anual: 1.200 mm." | "Rain averages 1,200 mm a year." |
| txakoli-bizkaia.json | chapters[2].paras[0] s1-s2 | CUT x2 (meta) | - | Cut. The chapter opens on paras[1] (south-facing moderate slopes, p7). Title stays "South-facing slopes, grassed rows". |
| txakoli-bizkaia.json | chapters[2].paras[2] s1 | FIX ("always" overstates) | p6 "la planta tiene disponibilidad de agua de forma regular" | "Rain on 157 days a year gives the vines a regular supply of water." |
| txakoli-bizkaia.json | chapters[3].paras[0] s1 | FIX (copy list) | p5 "Hondarrabi Zuri, Hondarrabi Beltza y Hondarrabi Zuri Zerratia / Petit Courbu" | "The main white grape is Hondarrabi Zuri. The main red is Hondarrabi Beltza." then "Hondarrabi Zuri Zerratia (Petit Courbu) is also recommended." |
| txakoli-bizkaia.json | chapters[3].paras[1] | FIX (term) | p4 "variedades calificadas como recomendadas ... mínimo del 85 %" | "A wine sold under one grape's name must use a recommended grape for at least 85% of the blend." |
| txakoli-bizkaia.json | chapters[3].paras[3] s3 | FIX (meta) | p10 "suele oscilar ... entre los 10, 5º y los 11, 5º ... claramente inferiores a las de otras zonas próximas" | "Average strength is usually 10.5% to 11.5%. That is clearly lower than in nearby zones, because of the humid Atlantic climate with cool summers." |
| txakoli-bizkaia.json | chapters[3].paras[4] s2 | FIX (meta + list) | p10 "Notas de Fruta Blanca, Cítricos y Herbáceos: Son características asociadas con el factor anterior" | "Notes of white fruit, citrus and herbs go with this acidity." |
| txakoli-bizkaia.json | other 25 items | KEEP | p4 5 meses, aparta, 600 l, 85%; p5 11.500/9.500 kg, términos municipales aptos; p6 1.200 mm, 157 días, 12.4 ºC, 39%, 82%; p7 sur, mecanización; p10 amargor final; p13 60-150 g/l, 12%, 3 bar, 10% | - |
| txakoli-bizkaia.json | chapters[0].title | note | "Hills between two valleys": page says mountain ranges | LeadBot to reword |

## Txakoli de Álava (content/guides/txakoli-alava.json, pliego-PDO-ES-A0732)

Worst finding here: the guide says the wine is "high in acidity". The page says the opposite: p5 "aportando niveles bajos de acidez", p6 "vinos redondos, de baja acidez".

| File | Field | Verdict | Spanish on the page | Corrected text (FIX) |
|---|---|---|---|---|
| txakoli-alava.json | lede s2 | FIX (contradicts page) | p5 "la característica acidez ... ligeros tonos amargos en el regusto"; p6 "de baja acidez" | "Its txakoli has a characteristic acidity, with light bitter tones in the aftertaste." |
| txakoli-alava.json | label.terms[0] Berezia | FIX (translation) | p2 "Su calificación se iniciará a partir del 1 de mayo del año siguiente" | "An aged txakoli with at least 5 months of ageing. Its certification starts on 1 May of the year after harvest." |
| txakoli-alava.json | chapters[0].paras[1] | FIX (copy list) | p4 "los municipios de Artziniega, Ayala, Llodio, Amurrio y Okondo" | "The zone covers five municipalities." (names can go on the map) |
| txakoli-alava.json | chapters[0].paras[2] | FIX ("about" not on page) | p5 "en todos los casos próximas a las bodegas o en un radio de no más de 3 km" | "Vineyards are always close to the wineries, no more than 3 km away." |
| txakoli-alava.json | chapters[1].paras[0] s1 | FIX (meta) | p4 "a cuyo clima atlántico" | "The climate is Atlantic." |
| txakoli-alava.json | chapters[1].paras[1] s1 | FIX ("a day" inferred) | p5 "luminosidad media en el proceso vegetativo (abril-octubre) de 12,11 horas" | "From April to October, average light is 12.11 hours." |
| txakoli-alava.json | chapters[1].paras[1] s2 | FIX (translation; one idea) | p6 "170 días de media de viento sur, aportando oxigenación al proceso vegetativo foliar" | "The south wind blows on 170 days a year. It brings oxygen to the growing leaves." |
| txakoli-alava.json | chapters[1].paras[3] | FIX ("potential" added) | p5 "la uva se recolecte con una graduación entorno al 12º" | "This microclimate means the grapes are picked at around 12°." |
| txakoli-alava.json | chapters[2].paras[0] s1 | CUT (meta) | - | Cut. Open on the pH sentence. |
| txakoli-alava.json | chapters[2].paras[1] s1-s2 | FIX (meta "It links") | p5 "vamos a encontrar la característica acidez ... al aparecer ligeros tonos amargos en el regusto" | "This gives the wine its characteristic acidity. It also brings light bitter tones in the aftertaste." |
| txakoli-alava.json | chapters[3].paras[0] s1 | FIX (copy list) | p4 "Hondarrabi Zuri y Hondarrabi Beltza y Hondarrabi Zuri Zerratia/Petit Courbu ... recomendadas o principales" | "The main white grape is Hondarrabi Zuri. The main red is Hondarrabi Beltza." then "Hondarrabi Zuri Zerratia (Petit Courbu) is also a main grape." |
| txakoli-alava.json | chapters[3].paras[3] | FIX (meta + list) | p5 "Acidez Total Tartárica entre 9 y 12 g/l; Acidez Volátil Acética por debajo de 1 g/l y un pH de alrededor de 3" | "Total acidity is 9 to 12 g/l as tartaric." "Volatile acidity is under 1 g/l." "The pH is around 3." |
| txakoli-alava.json | chapters[3].paras[4] s1 | FIX (not on page; contradicts p6) | p6 "vinos redondos, de baja acidez, sabores cítricos y herbáceos adecuados" | "The wines are round and low in acidity." then "They have citrus and herbal flavours." |
| txakoli-alava.json | other 18 items | KEEP | p4 Ayala, septentrional, 899 l, 13.000 kg, 70 l/100 kg, 7 autorizadas; p5 pH 5,2-8,2, caliza 6,2-9,2, racimos prietos, mildiu; p6 13,1/18,7/7,5º, verde a amarillo pajizo; p8 >15% natural; p9 3 bar, 10% | - |

## Cangas (content/guides/cangas.json, pliego-PDO-ES-A0119)

| File | Field | Verdict | Spanish on the page | Corrected text (FIX) |
|---|---|---|---|---|
| cangas.json | lede s2 | FIX (comma splice + list of three ideas) | p5 "inviernos fríos ... veranos muy calurosos"; p4 "Siendo el Albarín Blanco la preferente" | "Winters are cold and summers are very hot." "Albarín Blanco is the preferred white grape." |
| cangas.json | label.terms[2] Barrica, Roble | CUT (points elsewhere) | p9 "...Real Decreto 1363/2011" | Cut; it states no rule a reader can use. |
| cangas.json | chapters[0].paras[1] s1 | FIX ("only" overstates) | p4 "con apenas más llanuras que las aluviales, situadas en el fondo de los valles" | "There is hardly any flat ground apart from alluvial land on the valley floors." |
| cangas.json | chapters[1].paras[1] s2 | CUT (meta + "unique") | p5 "otorga a la zona un microclima único en Asturias" | Cut. paras[2] states the facts (cold winters, hot summers). |
| cangas.json | chapters[1].fly[0].caption | FIX ("clearly more" is said of clear days, not hours) | p5 "los días despejados son claramente más numerosos, alcanzando hasta las 2.000 horas de sol en algunos de los concejos" | "Some municipalities in the zone reach 2,000 hours of sun." |
| cangas.json | chapters[2].paras[5] | FIX (meta) | p5 "los terrenos pizarrosos ... dan carácter propio a los vinos" | "The slate soils give the wines their own character." |
| cangas.json | chapters[3].paras[0] | FIX (meta) | p4 "se realizará exclusivamente con uvas de las siguientes variedades" | "Only the listed grape varieties may be used." |
| cangas.json | other 37 items | KEEP | p3 seven concejos + 9 Tineo parishes (Allande ... Pesoz; Arganza ... Tuña), vaso/espaldera; p2 3.000-6.000 cepas; p4 suroccidente, escarpadas, Narcea/Navia, paleozoicos y precámbricos, pH 6, 20-25 cm, 60-80 cm, permeabilidad, 8.000/10.000 kg, 56/70 hl, preferentes; p5 Cordillera Cantábrica, foehn, -10/30/40 ºC, 1.000 mm, 30%, orientaciones; p9 VC con IG, Crianza ... Noble, año de cosecha | - |

## Rías Baixas (content/guides/rias-baixas.json, DOG file pliego-PDO-ES-A1119-rias-baixas.txt)

Source-id mismatch (card point 1): every cite in rias-baixas.json matches the DOG file (I checked p6, p8, p9, p10-p15 and p17). The four Rías Baixas flags in content/flags.json (cambados, salvaterra, soutomaior, padron) cite `rias-baixas-pliego:p8`. That page number is from the AGACAL file, where the subzone table sits on p8. In the DOG file the table is on **p10**. Fix: change all four flag cites to `rias-baixas-pliego:p10`. Or give AGACAL its own source id. INDEX.md line 64 says its Rías Baixas page list uses AGACAL numbers, so whoever used INDEX.md got AGACAL pages.

| File | Field | Verdict | Spanish on the page | Corrected text (FIX) |
|---|---|---|---|---|
| rias-baixas.json | lede s2 | FIX (two ideas; "unusual" paraphrase) | p14 "supuso más del 96 % del total de uva cosechada"; "lo que es excepcional, mantiene una riqueza en ácidos que muy pocas variedades alcanzan en todo el mundo" | "More than 96% of the grapes harvested are Albariño." "It makes a lot of sugar and keeps an acidity that very few grapes in the world reach." |
| rias-baixas.json | chapters[0].paras[1] s3 | FIX (copy list; also leaves out the Tea and the Louro) | p12 "tramos inferiores de los ríos Ulla, Umia, Oitavén, Xabriña y Miño con sus afluentes Tea y Louro" | "It follows the lower stretches of its rivers, from the Ulla in the north to the Miño in the south." (or name the rivers as fly targets, not in a sentence) |
| rias-baixas.json | chapters[0].paras[2] | FIX (copy list) | p12 "cinco subzonas ... Condado do Tea, O Rosal, Ribeira do Ulla, Soutomaior y Val do Salnés" | "The zone has five subzones." (names go on the map flights) |
| rias-baixas.json | chapters[0].paras[3] s2 | FIX (date put on the wrong figure) | p13 "las más de 4.300 ha ... 22.800 parcelas ... más de 5.000 viticultores"; "(datos de 2022)" goes with "4 o 5 parcelas" per holding | "More than 4,300 hectares are split into 22,800 plots, worked by more than 5,000 growers." |
| rias-baixas.json | chapters[1].paras[0] s1 | FIX (meta) | p12 "vocación climática marcadamente atlántica" | "The climate is markedly Atlantic." |
| rias-baixas.json | chapters[1].paras[1] s1 | FIX ("about" not on page) | p12 "amplia pluviometría durante todo el año (1.300 mm)" | "Rain is plentiful all year, 1,300 mm." |
| rias-baixas.json | chapters[1].fly[0].caption | FIX ("about") | same | "1,300 mm of rain a year, much less of it in summer." |
| rias-baixas.json | chapters[2].paras[0] s3 | FIX (translation) | p12 "aluviones continentales de origen cuaternario" | "There is also room for soils on schist and on continental alluvium from the Quaternary." |
| rias-baixas.json | chapters[3].paras[4] s1 | FIX (copy list) | p15 "la manzana, cítricos, florales (rosa), fruta madura y herbáceos" | "Its wines have many aromas. Apple stands out." |
| rias-baixas.json | chapters[3].paras[4] s2 | FIX (meta; "strength" mistranslates "concentración") | p12 "vinos más reconocidos por la concentración y variedad de su fracción ácida, así como por su aroma, que por su contenido alcohólico" | "The wines are known more for the concentration and range of their acidity, and for their aroma, than for alcohol." |
| rias-baixas.json | other 43 items | KEEP | p6 brut nature 0-3 g/l; p8 100% albariño, ≥70% Condado do Tea; p9 600 l, 2ª fermentación en botella; p11 42º/8º, 12.000/10.000/12.500 kg, 84 hl; p12 300 m, 10-25 ºC, hercínica, Mg Ca K, estrés hídrico; p13 emparrado/fúngicas; p14 30%, 1%, 13%, vigor; p17 subzone label rule | - |

Flights (Rías Baixas)
- Val do Salnés (flag point cambados): weather. "One of the five subzones; nearness to the sea gives each subzone its own shade of the climate." Cite p12.
- Condado do Tea (flag point salvaterra): rules. "Wine labelled Condado do Tea has at least 70% Albariño and Treixadura." Cite p8.
- Miño mouth: place. "The zone follows the lower stretches of the Miño and its tributaries, the Tea and the Louro." Cite p12. Needs a new OSM point.

## Ribeira Sacra (content/guides/ribeira-sacra.json, pliego-PDO-ES-A1128)

| File | Field | Verdict | Spanish on the page | Corrected text (FIX) |
|---|---|---|---|---|
| ribeira-sacra.json | lede s2 | FIX (two ideas in one sentence) | p11 "más continental que atlántico"; p12 "pasando de los de mayor presencia de granito a aquellos en los que la pizarra es predominante" | "The climate is more continental than Atlantic." "The soils range from granite to slate." |
| ribeira-sacra.json | chapters[0].paras[2] s3 | FIX (meta; the pliego reports the name, it does not coin it) | p11 "lo que hace que esta viticultura fuese cualificada como «viticultura heroica»" | "The slopes are very steep, so this has been called "heroic viticulture"." |
| ribeira-sacra.json | chapters[2].paras[4] s1 | FIX (meta) | p15 "sus suelos marcan la mineralidad del vino" | "The soils set the wine's minerality." |
| ribeira-sacra.json | chapters[3].paras[0] s1 | FIX (meta) | p11 "a) Principales (o preferentes) ... b) Secundarias (o autorizadas)" | "Only the listed grape varieties may be used." |
| ribeira-sacra.json | chapters[3].paras[1] s1 | note (source conflict) | p10 "Siete mil quinientos kilos ... tintas"; p1 "reducir ... uva tinta ... de los actuales 12.500 ... a 9.500 kilos por hectárea" | Text matches p10 (KEEP). The p1 amendment note gives other figures. Owner/analyst to confirm which one is in force. |
| ribeira-sacra.json | other 48 items | KEEP | p6 85% Súmmum/rosados, 70% Mencía; p7 6 m/500 l, 3 m/600 l, 7/4 meses, not acero/poliéster, 69 l; p10 12.000 kg; p11 Lugo/Ourense, Portomarín-A Peroxa, Os Peares-Quiroga, gargantas, bancales/muras, 5 subzonas; p12 700-800 mm, 100 días, 11,3/17,1/6,9 ºC, 70,6%, 166 h, Chantada/Amandi, acidez, portainjertos, umbría roble/castaño; p15 Mencía/Godello descriptions, orientación/altitud; p16 vendimia manual, natural probable; p19 subzone label | - |

Flights (Ribeira Sacra)
- Canón do Sil (flag point canon-do-sil): place. "The Miño and the Sil run to their meeting through steep gorges or canyons." Cite p11.
- Os Peares, where the two rivers meet: place. "The zone runs along the Sil from Os Peares to Quiroga." Cite p11. Needs a new OSM point.
- Amandi: ground. "In Amandi the soils follow the type of eastern Galicia." Cite p12. Needs a new OSM point.
- Chantada: ground. "Here the soils look more like the granite soils of western Galicia." Cite p12. Needs a new OSM point.

## Valdeorras (content/guides/valdeorras.json, pliego-PDO-ES-A1132)

| File | Field | Verdict | Spanish on the page | Corrected text (FIX) |
|---|---|---|---|---|
| valdeorras.json | chapters[0].paras[0] s2 | FIX (meta) | p11 "en la puerta natural de entrada a Galicia" | "It is the natural gateway into Galicia." |
| valdeorras.json | chapters[0].paras[1] s3 | FIX (meta) | p11 "Se trata de tierras rojas y negras en las que crecen el castaño, la vid y el olivo" | "It is a land of red and black earth. Chestnut, vine and olive grow there." |
| valdeorras.json | chapters[0].paras[4] | FIX ("from ... to" invents a span) | p11 "O Bolo, Larouco, Petín, A Rúa, Vilamartín de Valdeorras, Rubiá, O Barco de Valdeorras, Carballeda y A Veiga. Todos ellos, con excepción del último" | "The zone covers eight municipalities of Ourense." |
| valdeorras.json | chapters[1].paras[0] s1 | FIX (meta) | p12 "mediterráneo-oceánico (con influencia atlántica)" | "The climate is Mediterranean-oceanic, with an Atlantic influence." |
| valdeorras.json | chapters[1].paras[3] | FIX (meta) | p12 "un clima ideal para vinos secos de primera calidad, con un óptimo por encima de los 450 m" | "The climate is ideal for first-quality dry wines, best above 450 m." |
| valdeorras.json | chapters[1].fly[0].caption | FIX (two ideas) | p12 "entre los 850 y los 1.000 mm anuales" | "850 to 1,000 mm of rain a year." |
| valdeorras.json | chapters[2].paras[0] | FIX (meta + list) | p11 "son de cinco tipos: pizarrosos, calizos, graníticos, arcillo-ferrosos y aluviales" | "There are five kinds of soil." (each gets its own sentence below already) |
| valdeorras.json | chapters[2].paras[1] s4 | FIX (meta) | p11 "proporcionan vinos con componentes aromáticos muy sutiles con marcado carácter mineral" | "Vineyards on these soils give wines with very subtle aromas and a marked mineral character." |
| valdeorras.json | chapters[2].paras[2] s3 | FIX (meta) | p12 "con potencial para el envejecimiento, que manifiestan intensamente los caracteres propios de la variedad" | "They give wines with ageing potential that show the grape's character strongly." |
| valdeorras.json | chapters[2].paras[5] s3 | FIX (meta) | p12 "producciones importantes, disminuyendo la calidad del vino" | "The plains are rich in nutrients and give big yields, which lowers the wine's quality." |
| valdeorras.json | chapters[3].paras[0] s1 | FIX (meta) | p10 list of varieties | "Only the listed grape varieties may be used." |
| valdeorras.json | chapters[3].paras[0] s2-s3 | not reproduced | the counts (8 whites, 11 reds, 7 + 7 preferred) | Count them on p10 before release. |
| valdeorras.json | chapters[3].paras[2] s1 | FIX (meta; "native" is "propia de la zona") | p14 "En los blancos destaca la variedad godello, propia de la zona" | "Among the whites, Godello stands out. It belongs to the zone." |
| valdeorras.json | chapters[3].paras[3] s2 | FIX (hype, card point 4: "elegant") | p14 "una acidez natural que los hace frescos y elegantes" | "Their natural acidity makes them fresh." |
| valdeorras.json | chapters[3].paras[4] s1 | FIX (meta) | p14 "entre las que destaca la variedad mencía" | "Among the reds, Mencía stands out." |
| valdeorras.json | label.terms[4] Tostado | note | p9 "Valdeorras «tostado» se elaborará con uvas tintas ... secado por pasificación natural bajo cubierta con un mínimo de 30 días" | 30 days is KEEP. The page says red grapes. "Naturally sweet, no added strength" was not reproduced on p9. |
| valdeorras.json | other 51 items | KEEP | p6 12,5% producción controlada; p10 15.000/12.500 kg, 90 hl; p11 asymmetric Sil, bancales, 30-50 cm, ordovícicas/silúricas; p12 O Barco/Rubiá, A Rúa/Petín/Larouco, 4-10 m terraces, 8/33/11 ºC, Winkler 1.300-1.500; p13 300-700 m, zona I; p14 amarillo pálido verdoso, picota/morado, acidez media; p15 estabilidad de color | - |

Flights (Valdeorras)
- Sil (flag point sil): place. "The Sil crosses the area from east to west. Its left bank is steep." Cite p11.
- O Barco de Valdeorras (flag point o-barco): ground. "Limestone outcrops appear in the north, here and in Rubiá." Cite p12.
- A Rúa (flag point a-rua): ground. "Loose granite soils give more floral wines." Cite p12.
- Bibei valley: place. "Rivers such as the Bibei give slopes where vines grow, often on terraces." Cite p11. Needs a new OSM point.

## Ribeiro (content/guides/ribeiro.json, pliego-PDO-ES-A1123)

| File | Field | Verdict | Spanish on the page | Corrected text (FIX) |
|---|---|---|---|---|
| ribeiro.json | lede s2 | FIX (meta; two ideas; the page says this of the whites) | p22 "Se trata de una zona límite para la viticultura"; p21 "vinos blancos frescos y afrutados" | "It is a limit zone for viticulture." "The white wines are fresh and fruity." |
| ribeiro.json | chapters[0].paras[0] s1 | FIX (meta) | p16 "se sitúa en la denominada zona de transición de Galicia" | "Ribeiro lies in the transition zone of Galicia." |
| ribeiro.json | chapters[0].paras[4] s2 | FIX (meta) | p17 "en muchos casos, además de ser propicios, casi obligan al cultivo del viñedo debido a su agreste carácter" | "In many cases the rough soils and terrain all but force the land into vines." |
| ribeiro.json | chapters[1].paras[0] s1 | FIX (meta) | p15/p16 climate description | "The climate is temperate, with four clear seasons." |
| ribeiro.json | chapters[1].paras[2] s2 | FIX (meta) | p16 "favorece la lenta maduración, consiguiendo ... respetar el componente aromático y el frescor natural" | "That keeps the aroma and the natural freshness." |
| ribeiro.json | chapters[1].paras[4] s1 | FIX (meta) | p16 "una viticultura en situación casi marginal" | "Viticulture here is almost marginal." |
| ribeiro.json | chapters[1].paras[5] | FIX (leaves out half the page; reads as alarm) | p16 "índice hidrotérmico ... entorno a los 3.500, muy por debajo del máximo de 5.200 ... la viticultura en la zona estará supeditada a un control constante" | "The mildew index is well below its maximum. Even so, growing here depends on constant control of the disease." |
| ribeiro.json | chapters[2].paras[4] s2 | FIX (meta) | p18 "podríamos hablar de suelos antrópicos" | "They can be called man-made soils (anthropic soils)." |
| ribeiro.json | chapters[3].paras[0] s1 | FIX (meta) | p14/p15 variety list | "Only the listed grape varieties may be used." |
| ribeiro.json | chapters[3].paras[0] s2-s3, chapters[2].paras[4] s1 ("fertilised heavily"), all 4 label.terms | not reproduced | out of budget | Check p12-p15 and p18 before release. |
| ribeiro.json | other 42 items | KEEP | p13 nine ayuntamientos in full, then parishes; p14 93,60 hl; p16 Winkler II/I/III, 45 km, 450 m, tartaric over malic; p17 bases, fósforo; p18 abancalados; p21 Treixadura, violáceo-cereza, early 1980s espumosos, método tradicional, tostado in rooms with natural ventilation; p22 borrascas, cuajado | - |

Card point 6 (read, though the coordinator moved the flags check to another reviewer): **Pontevedra is confirmed.** p19 says "Pontevedra es el principal puerto para su transporte marítimo". **Carballeda de Avia "listed whole" is confirmed.** p13 lists it among the nine ayuntamientos given in full, before the part-municipality parishes. Carballeda de Avia is still only a listed municipality, so by the owner's rule (19 Oct) it is not worth a flag. Pontevedra lies about 40 km outside the DO, so its flag should say it is outside.

Flights (Ribeiro)
- Ribadavia (flag point ribadavia): rules. "Its ordinances of 1579 set out where vines could be grown, to guard the wine's quality." Cite p20.
- Miño basin at Castrelo de Miño: place. "Sea influence comes in mainly along the Miño basin." Cite p16. Needs a new OSM point.
- Pontevedra (flag point pontevedra, outside the zone): rules. "The main port for shipping the wine by sea." Cite p19.

## Monterrei (content/guides/monterrei.json, pliego-PDO-ES-A1114)

| File | Field | Verdict | Spanish on the page | Corrected text (FIX) |
|---|---|---|---|---|
| monterrei.json | lede s1 | FIX (X, Y and Z list) | p14 "Sus veranos son calurosos y secos mientras que sus inviernos son fríos ... oscilaciones térmicas, de hasta 30º" | "Summers are hot and dry, and winters are cold." "Temperature swings reach 30 degrees during ripening." |
| monterrei.json | lede s2 | FIX (meta) | p14 "suponen unas condiciones óptimas para el desarrollo de las variedades de vid utilizadas" | "The climate and soils give the local grapes optimal conditions." |
| monterrei.json | label.terms[1] Crianza, Reserva, Gran Reserva | CUT (points elsewhere: E-Ambrosia) | p10 "... E-Ambrosia de la Unión Europea para estas menciones" | Cut. Or state the ageing months if a page gives them. |
| monterrei.json | label.terms[2] Barrica | CUT (points elsewhere: Real Decreto 1363/2011) | p17 | Cut. |
| monterrei.json | chapters[0].paras[1] | FIX (meta) | p11 subzones | "The zone has two subzones, the Monterrei valley and the Monterrei hillside." |
| monterrei.json | chapters[1].paras[0] | FIX (meta) | p14 "clima mediterráneo templado con tendencia continental, influenciado por el océano atlántico" | "The climate is temperate Mediterranean, leaning continental, with an Atlantic influence." |
| monterrei.json | chapters[1].paras[3] s2 | FIX (meta) | p14 "con valores para ambos parámetros bastante diferentes a los de otras zonas vitivinícolas de Galicia" | "Both are quite different from other Galician wine zones." |
| monterrei.json | chapters[2].paras[1] s2 | FIX (meta) | p13 "proporcionan aromas en los vinos tintos" | "They give aromas to the red wines." |
| monterrei.json | chapters[2].paras[2] s2 | FIX (meta) | p13 "presentan pH bajos, adecuados para vinos blancos" | "Their pH is low, which suits white wines." |
| monterrei.json | chapters[3].paras[2] s2 | FIX (meta + list) | p14 "destacan por su gran riqueza aromática, por ser frescos y corpulentos y por tener un buen equilibrio entre alcohol y acidez" | "The wines are rich in aroma, fresh and full-bodied." "Alcohol and acidity are well balanced." |
| monterrei.json | chapters[3].paras[0], chapters[3].paras[3] | not reproduced | variety counts; hand picking | Check p11-p12 before release. |
| monterrei.json | other 24 items | KEEP | p10 85% tintas rosado; p11 13.200 kg, 97,68 hl; p13 three soil types, sedimentarios, espaldera a doble cordón; p14 Duero/Támega N-S, 30º, autóctonas adaptadas, correcciones de fertilidad | - |

Flights (Monterrei)
- Támega: place. "The Támega crosses the zone from north to south, into the Duero basin." Cite p14. Needs a new OSM point.
- Monterrei castle hill (flag point monterrei): rules or history. "The wines of the Monterrei valley rivalled those of Porto." Cite p12.
- The Verín, Oímbra and Vilardevós flags only list parishes. By the owner's rule they are not worth a flight.

## Flights for the first four places

- **Getaria:** Getaria (flag getaria): place, "In the 19th century it kept 35 ha of vines in sheltered spots", p4. Zarautz (flag zarautz): place, "It kept 4 ha of vines under Santa Bárbara", p4. Donostia (flag donostia): history, "A charter of 1180 for the city already mentions vines", p3. Aia is only a listed municipality, so it is not worth a flight.
- **Bizkaia:** Ibaizabal valley (flag ibaizabal): place, "One of the two main valleys", p7. Butrón valley: place, the other main valley, p7. Needs a new OSM point. Lekeitio (flag lekeitio): rules, "Its ordinances of 1338 exempted from tax the timber used to train vines", p7. Bakio (flag bakio): fix its line to "In the mid-20th century txakoli survived mainly here", p8. The page says "a mediados del siglo XX ... sobrevive ... principalmente en Bakio".
- **Álava:** Ayala valley (flag ayala): place, "Vines were grown for wine in the Tierra de Ayala in 964", p5. Artziniega / Retes de Tudela (flag artziniega): history, "Vines are recorded at Retes de Tudela in 864", p5. Laudio/Llodio (flag llodio): history, "A gift of vineyards to the lost monastery of San Víctor", p5.
- **Cangas:** Narcea (flag narcea): place, "With the Navia, one of the two main rivers; alluvial land lines the valley floors", p4. Navia river: place, p4. Needs a new OSM point. Monasterio de Corias (flag corias): history, "The vine spread widely after it was founded in the early 11th century", p5. The Cangas del Narcea flag says only "one of the seven municipalities", so it is not worth a flight by the owner's rule.

## Not done

- The map flags check was moved to another reviewer by the coordinator. Only card points 1 (Rías Baixas page numbers) and 6 (Pontevedra and Carballeda de Avia) are answered above.
- The "not reproduced" rows were left unchecked because of budget.
- The draft logs in Review/guides-check/<place>.md were not compared line by line.
