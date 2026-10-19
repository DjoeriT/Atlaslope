# el-vicario sentence check
Source: el-vicario-doc (pliego DOP El Vicario, rev. 1, 24/04/2020). Checked 19 Oct 2026.

## Title and lede
KEEP title (standard).
KEEP p11 "mesoclima más suave"; p12 "profundidad pequeña con unos contenidos de calcio altos" (lede s1).
KEEP p12 "En todos los vinos podemos señalar la finura ... equilibrio"; "sensaciones de vegetación de monte bajo" (lede s2).

## place: A strip beside the Guadiana
KEEP title p10 "junto al río Guadiana ... 2 km de ancho ... 7 km de longitud".
KEEP p10 "El Vicario es el nombre de un lugar junto al río Guadiana en referencia a la presa de El Vicario".
FIX p10 "unos 2 km de ancho desde el cauce del río y de 7 km de longitud": "vineyard zone" -> "zone" (the page describes the whole zone, not the vineyard).
KEEP p10 "perteneciendo todo el territorio al Término Municipal de Ciudad Real con una superficie útil de 1.252 hectáreas".
KEEP p11 "orografía con suaves ondulaciones generalmente decrecientes hasta el curso del río".
FIX p11 "entorno de monte bajo de encina y vegetación arbustiva": "vines grow among" -> the surroundings are holm oak scrub.
FIX p13 "rodeada por la DOP La Mancha, posee características sustancialmente diferentes": "set apart" -> "conditions substantially different".
ADD p13 "considerando las condiciones del medio (suelo calcáreo con altos contenidos en calcio e influencia del río)".
Flight: OSM had no result for the dam. A retry ("Embalse de El Vicario") was refused here (no permission for the request), so [-4.03, 38.95] is UNVERIFIED and needs a lookup. No missing flight: the Guadiana is this flight.

## weather: A river that calms the weather
KEEP title p11 "La presencia del río ... mesoclima más suave".
KEEP p11 "mesoclima más suave, limitando las situaciones climáticas extremas" (both sentences; term explained).
KEEP p12 "suavizan la maduración de la uva y contribuyen a caracterizar el perfil de aromas finos ... sensaciones de vegetación de monte bajo" (both sentences; hedge "helps" kept).

## ground
FIX title p11 "suelos calizos", p12 "calcáreo": "Thin, chalky" -> "Shallow, limy" (chalky upgrades calcáreo).
FIX p11 "suelos calizos de textura ligera y bien drenados, de fertilidad media"; p12 "profundidad pequeña": "limestone" -> "limy"; three-item list split.
KEEP p12 "Superan de media los 15 meq/100g (>3000 ppm) ... 8-10 meq/100g (1600-2000 ppm)" (both sentences).
FIX p12 "El calcio juega un papel primordial en la calidad de la piel de las uvas, que contribuye a la formación de los polifenoles y de las sustancias aromáticas": "matters for ... feed" -> "key part in the quality ... help form"; split.
KEEP p12 "siendo vinos con pH relativamente altos, resultan frescos debido a la finura y bondad de sus taninos".

## rules: Whites from red grapes, and a sweet red
KEEP title p4 "Vino blanco elaborado con uvas tintas"; p6 "Vino tinto dulce monovarietal".
FIX p10 "Blancas: Chardonnay y Sauvignon Blanc. Tintas: ..."; p5 "autóctonas ... Tempranillo, Graciano y Garnacha tinta ... foráneas Cabernet Sauvignon, Syrah, Merlot, y Petit verdot": cite p10 was missing (added); seven-name list split native/foreign.
FIX p1 "Vino blanco, blanco de uvas tintas, rosado y tinto"; p1 a.2 "Vinos blancos semidulces"; p2 a.4 "Vinos tintos dulces": rosado explained as rosé.
FIX p4 "Vino blanco de las variedades Chardonnay y Sauvignon Blanc"; "El 15% como mínimo del mosto obtenido fermentará en barricas ... permanecerá de 4 a 8 meses": grapes added; "goes into oak" -> "ferments in oak".
FIX p4 "podrá llevar en menor proporción alguno de los varietales Garnacha tinta y Tempranillo elaborados sin maceración": "a little ... pressed" -> "a smaller share ... made".
KEEP p4 "El mosto fermenta en depósitos de acero inoxidable ... entre 11ºC y 20ºC" (white from red grapes).
FIX p3 "De amarillo acerado a rosa pálido ... Mirando al trasluz puede apreciarse un tono rosado": hedge "puede" restored, colour range given.
KEEP p4 "Vino rosado elaborado con uva tinta de la variedad Petit verdot".
FIX p3 "Notas balsámicas de eucalipto y tonos anisados": raspberry and cherry-strawberry line repeated the fact sheet tastes; replaced with other p3 words.
ADD p4-p5 "Vino blanco semidulce de las variedades Chardonnay y Sauvignon Blanc"; "se baja la temperatura ... para parar la fermentación entre 12- 45 gr/l": the semi-sweet white had no rule.
KEEP p5 "ensamblaje ... autóctonas ... y ... foráneas"; "elaborado exclusivamente con uvas de las variedades autóctonas".
KEEP p5 "durante un mínimo de 3 meses, de un mínimo de un 30% del vino total. El resto permanece en depósito inertizado, para aportar frescura" (both red types).
KEEP p6 "monovarietal ... Merlot, vendimiada con más de 280 gr/l de azúcar".
FIX p6 "se baja la temperatura ... para parar la fermentación entre 46 - 90 gr/l ... Sin encabezado": "so it tastes of figs and jam" cut (cause-to-taste link not on the page, and it repeated the fact sheet tastes); chilling and no fortification added (p5 "Sin encabezado" for the semi-sweet too).
FIX p4 "sin sobrepasar 2 bares de presión, será de 70 litros por cada 100 kg de vendimia, para todas las variedades": 2-bar limit added.
Label terms: p13 «Vino de Pago», Crianza, Reserva, Gran Reserva point to Reg. 1308/2013 and RD 1363/2011 with no rule of their own in the pliego; none added. No other mención on any page.

## Fact sheet
- climate.text: sheet says "Milder than the surrounding area"; p11 says "un mesoclima más suave", with no comparison to the surrounding area.
Other fields agree with the pliego (grapes p10, styles.kinds, famous.styles p4-p6, soil p11-p12, tastes p3-p4).
