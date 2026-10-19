# Abadía Retuerta guide sentence check

Source: Pliego de condiciones DOP «Abadía Retuerta», PDO-ES-02481 (Review/sources/fetched/pliego-PDO-ES-02481-abadia-retuerta.txt), latest revision listed p2 (revision 2, normal amendment 11/7/2025, adds red varieties). Page numbers are pages.py numbering (pliego page + 1). Checked 2026-10-19 against `content/guides/abadia-retuerta.json`.

## Lede
- KEEP p10 "interfieren las corrientes de aire más frio que vienen del páramo ... con la humedad del río Duero"; p13 "en el estrecho valle del Duero, donde se acumula el aire frío y la humedad, junto a la protección que ofrecen el meandro"
- KEEP p13 "mayor salto térmico día-noche ... haciendo que el hollejo sea más grueso"; p12 "vinos de alta intensidad colorante ... estructurados". FIX cite: was p9, p12 (neither has the cold air or the skins); now p10, p12, p13.

## Place
- KEEP title p8 "formando un meandro"
- KEEP p8 "la cuenca más estrecha del valle que el río Duero conforma a su paso por la provincia de Valladolid, formando un meandro en cuya terraza de ribera se asienta"
- KEEP p8 "dos páramos calizo margosos de mayor cota (880 m) muy próximos entre sí, que delimitan el valle tanto en el norte como en el sur"
- KEEP p8 "masas arbóreas de bosque de encina y pino albar en el margen sur, este y oeste ... que actúan como regulador de la humedad"
- KEEP p7/p8 "560,49 hectáreas, constituyendo una superficie continua de terreno"; p8 "el río Duero hacia el norte y el Monte de “El Carrascal” hacia el sur, ambos parajes protegidos"
- KEEP p14 "solo hay un productor, y este es también el elaborador"
- CUT "That is why it can be a Vino de Pago, a single estate with its own rules." p14 ties the single producer to the single-applicant exception of art. 95, not to Vino de Pago status: invented cause.
- FIX p8 "las donaciones que recibían los monasterios ... constan desde el año 1.143": was "The land was already a monastery's by 1143", now "Gifts of land to the monastery are recorded from 1143".
- KEEP p15 "la Abadía de Santa María de Retuerta, que fue fundada en 1146" (1146 confirmed). FIX cite: p13 dropped (nothing used), p15 added.
- KEEP p15 "habiendo estado siempre el convento con su abadía dentro del propio pago vitícola"
- Flight "Abadía Retuerta": KEEP caption p8 "terraza de ribera ... dos páramos ... (880 m)". The place has `centroid: null` in data/places.json, so there is no point to check; Nominatim puts the estate at 41.6165, -4.4109 (Retuerta, Sardón de Duero).
- Added flight "The Duero valley", point [-4.434, 41.609] (Nominatim "Sardón de Duero"), zoom 11, caption from p8 "la cuenca más estrecha del valle que el río Duero conforma a su paso por la provincia de Valladolid ... dos páramos ... muy próximos entre sí".

## Weather
- KEEP title p9 "temperaturas son elevadas en verano y bajas en invierno, contando con una oscilación térmica importante"; p9 "riesgos de heladas"
- FIX p8-9 "marcado carácter continental, con influencia de la nubosidad del Atlántico, y pluviometría moderada, con veranos secos": "X, Y and Z" list split into two sentences.
- KEEP p9 "se han registrado máximas absolutas de 42º C y mínimas absolutas de -20º C"
- KEEP p10 "corrientes de aire más frio que vienen del páramo, situado a casi 900 m, con la humedad del río Duero situado en una cota de 725 m"
- KEEP p9 "son casi un grado más bajas que en el próximo municipio de Tudela de Duero"
- KEEP p9 "El ciclo vegetativo de la vid en «Abadía Retuerta» es por tanto el más corto"; "la estación limitante con más riesgo de hielo"
- KEEP p9 "la que más agua recoge con 4 90 mm al año" (neighbours about 450 mm)
- KEEP p9 "escasos aportes en la época veraniega, generando déficits hídricos acusados ya que la evapotranspiración potencial (ETP) es alta"
- FIX p13 "efecto orográfico de inversión térmica de fondo de valle, en el que se acumulan humedad y bolsas frías de aire, junto con el material arenoso ... hacen que se pierda más rápidamente temperatura": "sandy, gravelly soil" now "sandy soil" (gravel is named for the daytime warmth, not the night loss).
- KEEP p13 "Todo ello determina que se produzca un mayor salto térmico día-noche"
- KEEP p13 "haciendo que el hollejo sea más grueso que en otras zonas del entorno, incrementando su coloración mediante una mayor acumulación de los antocianos totales"
- KEEP p13 "una intensidad colorante (IC) alta, así como un índice de polifenoles totales (IPT) superior con respecto al resto de vinos producidos en el entorno"
- FIX p13 "la característica más destacada de los vinos tintos de Abadía Retuerta: su elevada estructura y persistencia en boca": "Their" widened to all wines, now "The reds'".
- FIX p13 "La temperatura media anual también varía respecto a zonas circundantes, lo que influye en una madurez más pausada, con un ciclo más largo y unos valores de acidez más compensados": "lower" is not on the page, now "differs from the land around".
- FIX cite: the night and ripening sentences are on p13, not p12; chapter cite now p8, p9, p10, p13.

## Ground
- KEEP title p10 "la cobertera de arenas"
- KEEP p10 "la gran Meseta Septentrional española que consiste en un gran zócalo antiguo arrasado, y en parte recubierto por los sedimentos terciarios"
- FIX p10 "gran diversidad de tipos de rocas (conglomerados, arenas, margas con y sin yeso, arcillas y calizas)": list reworded as a range ("vary widely, from conglomerates and sands to marls, clays and limestones").
- KEEP p10 "la cobertera de arenas cuyo espesor puede variar desde centímetros hasta varios metros. Esta cobertura arenosa a menudo “oculta” suelos de una enorme diversidad"
- KEEP p10 "de alcalinidad débil, bajos niveles de materia orgánica, de textura arenosa a franco arcillosa"
- KEEP p10-11 "predominio en casi toda la superficie de alto nivel de porcentaje de arenas, aunque subiendo los niveles de arcilla conforme nos acercamos a la superficie de ladera"; p11 "bajos niveles de carbonatos totales y caliza activa, los cuales crecen conforme se sube la cota"
- KEEP p12 "La elaboración de vinos blancos es bastante inusual en la zona, debido a la altitud y el clima extremo"
- KEEP p12 "bien protegidas por la vegetación, próximas al río Duero y con suelos más sueltos y de grava nos permite el cultivo con éxito de variedades blancas"

## Rules
- KEEP title p7 "un máximo de 8.000 kg/ hectárea"; p15 "un conjunto de variedades"
- KEEP p15 "se pueden considerar prácticamente un monocultivo de la variedad Tempranillo"
- FIX p15 "(hasta nueve variedades tintas y cinco blancas)" is out of date: the variety list p7-8 (revision 2 added red varieties) names 14 red (Tempranillo ... Prieto Picudo y Touriga Nacional) and 6 white (Sauvignon Blanc ... Albillo Mayor, y Verdejo). Now "The estate's rules allow 14 red and 6 white varieties"; p8 added to cite. KEEP rest p15 "vinos de coupage o monovarietales de variedades distintas de Tempranillo".
- KEEP p7 "Variedades tintas, un máximo de 8.000 kg/ hectárea. Variedades blancas, un máximo de 8.000 kg/ hectárea ... un máximo de 60 hectólitros/hectárea"
- KEEP p11 "Se realiza la poda en verde ... los reales no superan los 40 Hl/Ha de media, debido a estas prácticas en el viñedo"
- KEEP p11 "Se realiza por gravedad, una forma de trabajo en la que se evita el uso se las bombas"
- KEEP p5 "Uso de levadura y bacteria autóctona" (reds), "Uso de levadura autóctona" (whites)
- FIX p12 "El uso de levaduras autóctonas ... desarrolla ... un complejo perfil aromático, limpio, tanto frutal como floral, fresco con notas muy singulares de monte bajo mediterráneo y balsámicos (hierbas aromáticas (tomillo, lavanda), jara)": dropped source framing "are described as", gave the cause the page names (native yeast), split the "thyme, lavender and jara" list.
- FIX p12 "El uso de la gravedad ... una estructura tánica más fina y menos rústica que los vinos del entorno": dropped "is said to".
- KEEP p5 "Vino Tinto Monovarietal: envejecimiento en barrica de roble mínimo de 12 meses"; p6 "Vino Tinto Multivarietal: ... mínimo de 6 meses"
- FIX p6 "Vino Blanco Multivarietal: maduración en depósito de acero o envejecimiento en barrica de roble mínimo de 3 meses": the 3-month minimum is tied to oak, now "mature in steel tank or spend at least 3 months in oak".
- KEEP p7 "La elaboración y envejecimiento ... se realizarán exclusivamente en la bodega enclavada en la zona delimitada"
- KEEP p17 "tal mención tradicional podrá utilizarse en el etiquetado de los vinos en lugar de la expresión «DENOMINACIÓN DE ORIGEN PROTEGIDA»" (term «VINO DE PAGO»). No `label` field in this guide.

## Fact sheet (castilla-y-leon.json, "abadia-retuerta"; not edited)
- grapes.others: sheet lists 16; pliego p7-8 lists 20. Sheet lacks Hondarrabi Beltza, Mencía, Prieto Picudo, Touriga Nacional (red, added in revision 2). Sheet says "Garnacha Tinta"; pliego "Garnacha".
- styles.text: sheet "Whites: blends"; pliego p5 heading "Vino blanco Mono varietal o Multivarietal" (single-variety whites also made). Sheet "steel tank or oak" omits the 3-month oak minimum (p6). famous.styles "Vino Blanco Multivarietal ... steel tank or at least 3 months in oak" agrees.
- altitude: sheet "plateaus at 880 m" agrees with p8; p10 says the páramo is "a casi 900 m".
- why: sheet "ripens the grapes slowly" agrees with p12 "lenta y precisa maduración".
