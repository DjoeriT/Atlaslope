# Check: ribera-del-jucar
Source: ribera-del-jucar-doc (Documento Único, Ref. Ares(2014)2126328, 27/06/2014, PDO-ES-A0049). Checked 19 Oct 2026, every sentence.

## Title and lede
- KEEP title "Why Ribera del Júcar tastes the way it does" (house format).
- FIX p5 "el río Júcar ha excavado un cañón que rompe la monotonía de dicha horizontalidad y provoca un régimen de lluvias superior al de los alrrededores": "very flat plain" upgraded "horizontalidad"; now "flat land", canyon named as the rain cause.
- FIX p5 "Depósitos lacustres sobre zonas pantanosas desecadas": "soils that were once marsh and lake" now "lake deposits laid over drained marsh".

## place ("A small corner of Cuenca")
- KEEP title p5 "suroeste de la provincia de Cuenca".
- KEEP p5 "Se ubica en el suroeste de la provincia de Cuenca en los siguientes terminos municipales" (seven listed).
- FIX p5 "ha excavado un cañón que rompe la monotonía de dicha horizontalidad": comma splice split into two sentences.
- KEEP p6 "formada por 10 bodegas, y 950 viticultores"; "16708 Pozoamargo (Cuenca)".
- Flight "The Júcar canyon": caption KEEP p5. Point FIX [-2.3, 39.35] -> [-2.1, 39.44], zoom 9 -> 10. The old point sits by Casas de Fernando Alonso, west of the river. New point is El Picazo, a zone municipality on the Júcar. [A] Not verified: the pack had no OSM result and the Nominatim call was not approved in this run. Needs one lookup before merge.
- Missing flights: none. The pliego names no other river, range or town worth a flight.

## weather ("Rain from the canyon")
- KEEP title p5 "provoca un régimen de lluvias superior".
- KEEP p5 "provoca un régimen de lluvias superior al de los alrrededores".

## ground ("Drained marsh and old lake beds")
- KEEP title p5 "Depósitos lacustres sobre zonas pantanosas desecadas".
- FIX p5 "Depósitos lacustres sobre zonas pantanosas desecadas": "The vines grow on" was not on the page; now "The zone has".
- FIX p5 "arenas limosas y arcillas saliníferas y materia orgánica": "salty clays" now "salt-bearing clays".
- FIX p5 "gravillas y cantos poligénicos poco rodados, de dolomía caliza principalmente, cementados por arcillas": "rounded stones" reversed "poco rodados". Now "fine gravel and barely rounded stones of mixed origin", split into two sentences.

## rules (title "Soft reds, fresh whites" -> "Soft reds, fruity whites")
- FIX title: "fresh" is not on the page. p1 "afrutados", p5 "suaves".
- KEEP p5 "PRINCIPALES UVAS ... CABERNET SAUVIGNON ... MACABEO, VIURA" (seven).
- KEEP p5 "TEMPRANILLO, CENCIBEL, TINTO DE TORO".
- KEEP p9 "UVAS DE VINIFICACIÓN SECUNDARIAS" (five).
- KEEP p5 "Los vinos tintos son poco astringentes, suaves y profundos".
- KEEP p5 "perfecto equilibrio acidez-tanicidad".
- KEEP p5 "el color oscila entre el rojo cereza y el rojo rubí con tonos azulados y violáceos".
- KEEP p2 "De color rojo picota ... sobresalen los aromas de frutas rojas" (young reds).
- KEEP p2 "Se muestra potente a la entrada en boca ... dejando un recuerdo de su redondez".
- FIX (added, missing wine type) p3 "Vino Tinto Tradición, Crianza y Reserva": Tradición was missing from the guide.
- FIX (added) p3 "Aromas intensos y francos".
- FIX (added) p3 "tanicidad media combinada con suavidad y aterciopelado. Postgusto largo e intenso".
- KEEP p3 "En Crianzas y Reservas desde el rojo rubí al rojo cereza, se descubren tonalidades rojas teja".
- FIX p3 "En vinos envejecidos notas de fruta roja madura": added. The old "Floral, spicy and balsamic notes mix with toast" was an X, Y and Z list. It also repeated the sheet's `tastes`, so it was cut.
- FIX p3 "En los vinos con permanencia en madera ... torrefactos y vainilla y los recuerdos a pimienta y cacao": toast now sits with wood, as on the page. The list is split as "toast and vanilla, with hints of pepper and cocoa".
- KEEP p1 "Los blancos son de color amarillo pálido pudiendo mostrar tonalidades verdosas o ambarinas".
- KEEP p1 "afrutados ... suaves" + p5 "los blancos mantiene equilibrio de acidez y armonía".
- FIX p1 "Los rosados son de color rosa en toda su gama ... cuerpo moderado": "rosados" was unexplained; now "Rosados, the rosé wines".
- KEEP p1 "Vino Blanco y Rosado, seco"; p2 "Vino Blanco y Rosado, dulce".
- KEEP p2 "En la fase visual y olfativa son semejantes a la de los vinos secos de la misma variedad".
- FIX p2 "equilibrados en relación a su graduación alcohólica, acidez y contenido de azúcares residuales": the X, Y and Z list is now "balance alcohol and acidity against residual sugar".
- KEEP p4 "periodo mínimo de 4 meses en depósitos de madera conocidos por "tinas" ... o durante un periodo mínimo de 2 meses en barrica de roble".
- Label: none. The traditional terms on p8-9 (DO, Viejo, Superior, Reserva, Rancio, Noble, Gran reserva, Crianza, Añejo) are only listed. No page gives them a rule here, so none goes in `label`.
- Wine types swept: dry white and rosado (p1), sweet white and rosado (p2), Tinto Joven (p2), Tradición, Crianza and Reserva (p3). There is no generoso, sparkling or liqueur wine. All are now named.

## Fact sheet
- why.text: the sheet links lake soils to "soft, balanced wines with good acidity". p5 makes no such link and says nothing of "good acidity".
- grapes: the sheet has `main` empty and all 12 grapes in `others`. p5 names seven "PRINCIPALES"; p9 names five "SECUNDARIAS".
- soil.text: "rounded dolomitic limestone"; p5 says "cantos poligénicos poco rodados" (barely rounded).
- styles.cite: lacks p3, where the Tradición, Crianza and Reserva reds are.
