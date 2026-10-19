# Almansa guide check
Source: almansa-doc (Documento Único, Ref. Ares(2014)2125898, 27/06/2014). Checked 19 Oct 2026.

## Lede
- FIX p7 "altiplano" / "inviernos muy fríos y secos acompañados de veranos muy calurosos": kept the first sentence as is.
- FIX p7 "El rendimiento por cepa 4.500 Kgr/ha, aumenta la concentración de color, taninos y riqueza aromática": "Vines are held to 4,500 kg/ha" read as a cap. The page states a yield, not a limit (the caps on p5-p6 are 6,430-11,430 kg/ha). Now "A yield of 4,500 kg/ha raises…".

## Place: "A plateau in eastern Albacete"
- KEEP title p6 "Se situa al Este de la provincia de Albacete"
- KEEP p6 "Se situa al Este de la provincia de Albacete"
- KEEP p7 "un altiplano pasando de 400 metros sobre el nivel del mar en la vecina población de Fuente La Higuera, a 700 metros en Almansa"
- KEEP p6 "Comprende los municipios de Almansa, Alpera, Bonete, Corral Rubio, Higueruela, Hoya Gonzálo, Pétrola y la pedanía de Villar de Chinchilla" (a list of names, not a style list)
- KEEP flight "Almansa, the high end" p7 "700 metros en Almansa". Point [-1.097, 38.869] matches Almansa town [A]: the pack's OSM lookup failed and the re-query was refused here.
- FIX flight "Fuente la Higuera, the low end" p7 "400 metros … Fuente La Higuera". Point [-0.795, 38.806] was ~8 km east of the town. Moved to [-0.883, 38.808] (38°48′N 0°53′W) [A], not checked against OSM, same reason. Please re-check.
- Missing flights: the page names no river, valley, range or historic town besides these two. None added.

## Weather
- FIX title "Frozen winters, scorching summers" p7 "inviernos muy fríos … veranos muy calurosos": upgraded words. Now "Very cold winters, very hot summers".
- KEEP p7 "El clima es continental extremo, con inviernos muy fríos y secos acompañados de veranos muy calurosos"
- FIX p7 "Las lluvias se concentran en la primavera y el final del verano, no superando de media los 250 mm anuales": split into two sentences. Kept the "de media".

## Ground
- KEEP title p7 "poco sustrato … mas arenosas y profundas"
- KEEP p7 "La tierra, en general es rica en caliza"
- KEEP p7 "zonas con poco sustrato y pedregosas"
- KEEP p7 "con otras mas arenosas y profundas"

## Rules
- FIX title "Three red-leaning grapes, every colour": no source, and Verdejo is a white grape (p6 lists Verdejo first). Now "Three main grapes, three colours" (white, rosado, red, p1-p4).
- KEEP p6 "PRINCIPALES UVAS DE VINIFICACIÓN VERDEJO MONASTRELL GARNACHA TINTORERA"
- KEEP p11 "UVAS DE VINIFICACIÓN SECUNDARIAS … TEMPRANILLO, CENCIBEL, TINTO DE TORO" (Tempranillo, Syrah, Cabernet Sauvignon, Merlot, Garnacha Tinta, Petit Verdot, Pinot Noir). Cite p11 added to the beat's cites.
- KEEP p11 "CHARDONNAY … MOSCATEL GRANO MENUDO … SAUVIGNON BLANCO"
- ADD p7 "al menos el 89 % de la uva corresponda a dicha variedad": the only labelling rule on the page. Cite p7 added.
- FIX "Almansa makes white, rosado and red wines. Each comes dry, and also semi-dry, semi-sweet and sweet.": widened. p2 and p4 give sweet versions only for "Vino Joven Blanco y Rosado" and "Vino Tinto Joven y 'roble'". There are no sweet versions of barrel whites or crianza reds. Now names the young wines and roble reds only. Also explained "rosado" and "roble" (p3 "Los que han pasado por roble").
- ADD p2/p4 "En la fase visual y olfativa son semejantes a la de los vinos secos de la misma variedad"
- ADD p5 "Se podrá interumpir su fermentación para que contengan azúcares residuales, o bien … mediante la edulcoración con mostos concentrados rectificados procedentes de la zona de producción"
- ADD p2 "Vino Blanco Fermentado en Barrica y Blanco Crianza": white crianza was missing.
- CUT "Young whites are light, moderately aromatic and a sustained yellow." (p1 says it, but it repeats the sheet's `tastes`)
- CUT "Young rosados run from strawberry to raspberry pink, and taste fresh and fruity." (p1, repeats `tastes`)
- CUT "Whites fermented in barrel are straw to gold, with toasty barrel aromas and a soft, fruity finish." (p2, repeats famous "Fermentado en barrica". It also skipped "Blanco Crianza", which shares the description.)
- CUT "Young reds are deep violet to garnet, fleshy and lightly tannic." (p3, repeats `tastes`)
- FIX "Those that have seen oak (roble) carry toasty touches." p3: the toast repeats famous "Roble". Kept only the term's meaning.
- ADD p3 "Su excelente acidez les hace muy aptos para su crianza y guarda prolongada"
- FIX "Reds can also be aged as crianza, reserva and gran reserva, for 18, 24 and 36 months in 330 l oak barrels." p5 "Los vinos podrán someterse a un periodo de envejecimiento, para los crianza, reserva y gran reserva será de 18,24 y 36 meses. Las barricas serán de madera de roble de 330 l". There were two problems. The page gives a total ageing period, not months in barrel. It also says "Los vinos", which is not reds only (white crianza exists, p2). Now "ageing grades of 18, 24 and 36 months. The barrels are 330-litre oak."
- CUT "They turn cherry red or garnet, with possible tile tones, and show fruit and oak well joined, or spice, with medium tannin." (p4, repeats `tastes` and famous "Crianza, Reserva y Gran Reserva")
- Traditional terms p10 (Viejo, Superior, Rancio, Noble, Añejo): no rule anywhere in this document. Not added.
- Wine-type sweep: there is no sparkling, generoso or vino de licor. The only category is "1. Vino" (p1).

## Fact sheet
- grapes.main is empty, but p6 lists "PRINCIPALES UVAS": Verdejo, Monastrell and Garnacha Tintorera. grapes.others should hold the p11 secondary grapes only.
- styles.text says "barrel-aged … rosados" and "dry to sweet" for all wines. p2/p4: only young wines and roble reds have sweet versions. p2: the barrel wines are whites (fermentado en barrica, crianza). No rosado is barrel-aged.
- tastes.text says "tile tones". p4 "posibles tonalidades teja": the hedge was dropped.
