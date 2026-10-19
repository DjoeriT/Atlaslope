# Abadía Retuerta guide sentence check

Page numbers are PDF pages. They were corrected down by one on 19 Oct 2026 after the check: the tools had counted an empty part before page 1.

Source: Pliego de condiciones DOP «Abadía Retuerta», PDO-ES-02481 (Review/sources/fetched/pliego-PDO-ES-02481-abadia-retuerta.txt), latest revision listed p1 (revision 2, normal amendment 11/7/2025, adds red varieties). Page numbers are pages.py numbering (pliego page + 1). Checked 2026-10-19 against `content/guides/abadia-retuerta.json`.

## Lede
- KEEP p9 "interfieren las corrientes de aire más frio que vienen del páramo ... con la humedad del río Duero"; p12 "en el estrecho valle del Duero, donde se acumula el aire frío y la humedad, junto a la protección que ofrecen el meandro"
- KEEP p12 "mayor salto térmico día-noche ... haciendo que el hollejo sea más grueso"; p11 "vinos de alta intensidad colorante ... estructurados". FIX cite: was p8, p11 (neither has the cold air or the skins); now p9, p11, p12.

## Place
- KEEP title p7 "formando un meandro"
- KEEP p7 "la cuenca más estrecha del valle que el río Duero conforma a su paso por la provincia de Valladolid, formando un meandro en cuya terraza de ribera se asienta"
- KEEP p7 "dos páramos calizo margosos de mayor cota (880 m) muy próximos entre sí, que delimitan el valle tanto en el norte como en el sur"
- KEEP p7 "masas arbóreas de bosque de encina y pino albar en el margen sur, este y oeste ... que actúan como regulador de la humedad"
- KEEP p6/p7 "560,49 hectáreas, constituyendo una superficie continua de terreno"; p7 "el río Duero hacia el norte y el Monte de “El Carrascal” hacia el sur, ambos parajes protegidos"
- KEEP p13 "solo hay un productor, y este es también el elaborador"
- CUT "That is why it can be a Vino de Pago, a single estate with its own rules." p13 ties the single producer to the single-applicant exception of art. 95, not to Vino de Pago status: invented cause.
- FIX p7 "las donaciones que recibían los monasterios ... constan desde el año 1.143": was "The land was already a monastery's by 1143", now "Gifts of land to the monastery are recorded from 1143".
- KEEP p14 "la Abadía de Santa María de Retuerta, que fue fundada en 1146" (1146 confirmed). FIX cite: p12 dropped (nothing used), p14 added.
- KEEP p14 "habiendo estado siempre el convento con su abadía dentro del propio pago vitícola"
- Flight "Abadía Retuerta": KEEP caption p7 "terraza de ribera ... dos páramos ... (880 m)". The place has `centroid: null` in data/places.json, so there is no point to check; Nominatim puts the estate at 41.6165, -4.4109 (Retuerta, Sardón de Duero).
- Added flight "The Duero valley", point [-4.434, 41.609] (Nominatim "Sardón de Duero"), zoom 11, caption from p7 "la cuenca más estrecha del valle que el río Duero conforma a su paso por la provincia de Valladolid ... dos páramos ... muy próximos entre sí".

## Weather
- KEEP title p8 "temperaturas son elevadas en verano y bajas en invierno, contando con una oscilación térmica importante"; p8 "riesgos de heladas"
- FIX p7-9 "marcado carácter continental, con influencia de la nubosidad del Atlántico, y pluviometría moderada, con veranos secos": "X, Y and Z" list split into two sentences.
- KEEP p8 "se han registrado máximas absolutas de 42º C y mínimas absolutas de -20º C"
- KEEP p9 "corrientes de aire más frio que vienen del páramo, situado a casi 900 m, con la humedad del río Duero situado en una cota de 725 m"
- KEEP p8 "son casi un grado más bajas que en el próximo municipio de Tudela de Duero"
- KEEP p8 "El ciclo vegetativo de la vid en «Abadía Retuerta» es por tanto el más corto"; "la estación limitante con más riesgo de hielo"
- KEEP p8 "la que más agua recoge con 4 90 mm al año" (neighbours about 450 mm)
- KEEP p8 "escasos aportes en la época veraniega, generando déficits hídricos acusados ya que la evapotranspiración potencial (ETP) es alta"
- FIX p12 "efecto orográfico de inversión térmica de fondo de valle, en el que se acumulan humedad y bolsas frías de aire, junto con el material arenoso ... hacen que se pierda más rápidamente temperatura": "sandy, gravelly soil" now "sandy soil" (gravel is named for the daytime warmth, not the night loss).
- KEEP p12 "Todo ello determina que se produzca un mayor salto térmico día-noche"
- KEEP p12 "haciendo que el hollejo sea más grueso que en otras zonas del entorno, incrementando su coloración mediante una mayor acumulación de los antocianos totales"
- KEEP p12 "una intensidad colorante (IC) alta, así como un índice de polifenoles totales (IPT) superior con respecto al resto de vinos producidos en el entorno"
- FIX p12 "la característica más destacada de los vinos tintos de Abadía Retuerta: su elevada estructura y persistencia en boca": "Their" widened to all wines, now "The reds'".
- FIX p12 "La temperatura media anual también varía respecto a zonas circundantes, lo que influye en una madurez más pausada, con un ciclo más largo y unos valores de acidez más compensados": "lower" is not on the page, now "differs from the land around".
- FIX cite: the night and ripening sentences are on p12, not p11; chapter cite now p7, p8, p9, p12.

## Ground
- KEEP title p9 "la cobertera de arenas"
- KEEP p9 "la gran Meseta Septentrional española que consiste en un gran zócalo antiguo arrasado, y en parte recubierto por los sedimentos terciarios"
- FIX p9 "gran diversidad de tipos de rocas (conglomerados, arenas, margas con y sin yeso, arcillas y calizas)": list reworded as a range ("vary widely, from conglomerates and sands to marls, clays and limestones").
- KEEP p9 "la cobertera de arenas cuyo espesor puede variar desde centímetros hasta varios metros. Esta cobertura arenosa a menudo “oculta” suelos de una enorme diversidad"
- KEEP p9 "de alcalinidad débil, bajos niveles de materia orgánica, de textura arenosa a franco arcillosa"
- KEEP p9-11 "predominio en casi toda la superficie de alto nivel de porcentaje de arenas, aunque subiendo los niveles de arcilla conforme nos acercamos a la superficie de ladera"; p10 "bajos niveles de carbonatos totales y caliza activa, los cuales crecen conforme se sube la cota"
- KEEP p11 "La elaboración de vinos blancos es bastante inusual en la zona, debido a la altitud y el clima extremo"
- KEEP p11 "bien protegidas por la vegetación, próximas al río Duero y con suelos más sueltos y de grava nos permite el cultivo con éxito de variedades blancas"

## Rules
- KEEP title p6 "un máximo de 8.000 kg/ hectárea"; p14 "un conjunto de variedades"
- KEEP p14 "se pueden considerar prácticamente un monocultivo de la variedad Tempranillo"
- FIX p14 "(hasta nueve variedades tintas y cinco blancas)" is out of date: the variety list p6-8 (revision 2 added red varieties) names 14 red (Tempranillo ... Prieto Picudo y Touriga Nacional) and 6 white (Sauvignon Blanc ... Albillo Mayor, y Verdejo). Now "The estate's rules allow 14 red and 6 white varieties"; p7 added to cite. KEEP rest p14 "vinos de coupage o monovarietales de variedades distintas de Tempranillo".
- KEEP p6 "Variedades tintas, un máximo de 8.000 kg/ hectárea. Variedades blancas, un máximo de 8.000 kg/ hectárea ... un máximo de 60 hectólitros/hectárea"
- KEEP p10 "Se realiza la poda en verde ... los reales no superan los 40 Hl/Ha de media, debido a estas prácticas en el viñedo"
- KEEP p10 "Se realiza por gravedad, una forma de trabajo en la que se evita el uso se las bombas"
- KEEP p4 "Uso de levadura y bacteria autóctona" (reds), "Uso de levadura autóctona" (whites)
- FIX p11 "El uso de levaduras autóctonas ... desarrolla ... un complejo perfil aromático, limpio, tanto frutal como floral, fresco con notas muy singulares de monte bajo mediterráneo y balsámicos (hierbas aromáticas (tomillo, lavanda), jara)": dropped source framing "are described as", gave the cause the page names (native yeast), split the "thyme, lavender and jara" list.
- FIX p11 "El uso de la gravedad ... una estructura tánica más fina y menos rústica que los vinos del entorno": dropped "is said to".
- KEEP p4 "Vino Tinto Monovarietal: envejecimiento en barrica de roble mínimo de 12 meses"; p5 "Vino Tinto Multivarietal: ... mínimo de 6 meses"
- FIX p5 "Vino Blanco Multivarietal: maduración en depósito de acero o envejecimiento en barrica de roble mínimo de 3 meses": the 3-month minimum is tied to oak, now "mature in steel tank or spend at least 3 months in oak".
- KEEP p6 "La elaboración y envejecimiento ... se realizarán exclusivamente en la bodega enclavada en la zona delimitada"
- KEEP p16 "tal mención tradicional podrá utilizarse en el etiquetado de los vinos en lugar de la expresión «DENOMINACIÓN DE ORIGEN PROTEGIDA»" (term «VINO DE PAGO»). No `label` field in this guide.

## Fact sheet (castilla-y-leon.json, "abadia-retuerta"; not edited)
- grapes.others: sheet lists 16; pliego p6-8 lists 20. Sheet lacks Hondarrabi Beltza, Mencía, Prieto Picudo, Touriga Nacional (red, added in revision 2). Sheet says "Garnacha Tinta"; pliego "Garnacha".
- styles.text: sheet "Whites: blends"; pliego p4 heading "Vino blanco Mono varietal o Multivarietal" (single-variety whites also made). Sheet "steel tank or oak" omits the 3-month oak minimum (p5). famous.styles "Vino Blanco Multivarietal ... steel tank or at least 3 months in oak" agrees.
- altitude: sheet "plateaus at 880 m" agrees with p7; p9 says the páramo is "a casi 900 m".
- why: sheet "ripens the grapes slowly" agrees with p11 "lenta y precisa maduración".
