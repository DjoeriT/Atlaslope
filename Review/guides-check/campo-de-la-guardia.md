# campo-de-la-guardia: sentence check

Source: campo-de-la-guardia-doc (Documento único, PDO-ES-A0055, Ref. Ares(2014)2125559, 27/06/2014). Checked 19 Oct 2026.

## Title
- KEEP "Why Campo de la Guardia tastes the way it does" (standard guide title, no claim)

## Lede
- FIX p4-p5 "páramo que queda colgado a más de cien metros sobre el valle del Tajo ... muy salino ... La humedad relativa es baja": was "Very salty soil and very dry air ..."; "very dry" upgraded "baja", and the lede repeated the soil chapter word for word. Now place + result, no repeat; cite p4 added.
- FIX p5 "propiciando que las mismas sean más pequeñas ... mayor concentración de aromas": hedge restored ("tend to stay small"); detail left to the soil chapter.

## plateau (place)
- KEEP title p4-p5 "páramo que queda colgado a más de cien metros sobre el valle del Tajo"
- KEEP p4 "El pago está ubicado en el término municipal de La Guardia provincia de Toledo"; p8 "Vino de pago"
- KEEP p4-p5 "Los viñedos están situados en un páramo que queda colgado a más de cien metros sobre el valle del Tajo"
- Flight label KEEP p4 "La Guardia"; caption KEEP p5 (same words).
- Flight point FIX: [-3.36, 39.72] was about 13 km SE of La Guardia town. Moved to the town, [-3.477, 39.789]. The pack's OSM lookup returned nothing and a new Nominatim request was not approved in this run, so the point is from known town coordinates [A]: confirm with a lookup of "La Guardia, Toledo".
- Missing flight: the Tagus valley is named (p5). Not added: no lookup was possible; the plateau flight's caption already carries it.

## air (weather)
- FIX title: was "Very dry air"; p5 says "La humedad relativa es baja". Now "Low humidity".
- KEEP p5 "La humedad relativa es baja, con una media del 15% durante todo el periodo vegetativo"

## soil (ground)
- FIX title: was "Salt, potassium and little else" (X, Y and Z, "little else" unsourced). Now "Salty, poor soil" (p5 "muy salino y muy pobre en nutrientes").
- FIX p5 "pH alcalino, calizo": "limestone-rich" → "limy".
- KEEP p5 "muy salino y muy pobre en nutrientes"
- FIX p5 "Los suelos muy salinos, alto nivel en potasio y baja humedad relativa provoca un menor engorde": X, Y and Z list rewritten.
- FIX p5 "propiciando que las mismas sean más pequeñas, con mayor relación hollejo/pulpa": hedge restored ("tends to").
- FIX p5 "un vino con mayor concentración de aromas y polifenoles, con volumen, estructura y elevado grado alcohólico": page says "un vino", not only the red; "greater concentration" kept comparative; list split.

## wines (rules)
- FIX title: was "Blends, a best-grape wine and a barrel white" (X, Y and Z). Now "Estate blends and a barrel white" (p1, p2-p3).
- KEEP p4 "PRINCIPALES UVAS ... CABERNET SAUVIGNON / TEMPRANILLO, CENCIBEL, TINTO DE TORO / SYRAH / MERLOT / CHARDONNAY"
- KEEP p8 "UVAS DE VINIFICACIÓN SECUNDARIAS MALBEC PETIT VERDOT"
- KEEP p1 "Son mayoritariamente vinos tintos"
- KEEP p1 "proceden del ensamblaje de los diferentes varietales del Pago, en proporciones variables"
- KEEP p1 "se elaborará el mejor varietal del año o en años excelentes los dos mejores varietales del año"
- CUT "Reds are medium-high in depth, bright and dense, with red and black fruit." Repeats the fact sheet's `tastes`; also dropped the hedge "dependiendo del vino".
- CUT "They are fresh and full, with a long finish." Repeats the fact sheet's `tastes`.
- FIX p2 "Vino Tinto. La fermentación alcohólica ... entre 22 y 32 ºC ... en condiciones normales, por las levaduras naturales propias de la uva": the rule is for red only; the guide said it for all wines.
- FIX p2 "Filtración mínima o nula": red only, as above.
- CUT "The white is bright, with fruit and tropical notes." Repeats the fact sheet's `tastes`.
- KEEP p3 "Entre un 10 y un 30% del mosto obtenido fermentará y permanecerá sobre sus lías en barricas nuevas de roble durante un periodo comprendido entre 1 y 3 meses"
- FIX p2 "Aromas propios de la barrica, tostados, frutos secos, y de la elaboración bajo lías, pastelería ... Recuerdos de la elaboración en barrica, con apuntes de mantequilla y ligeros humos": the guide gave all five to the barrel and listed them; pastry comes from the lees. Split by cause.
- KEEP p3 "El mosto restante fermentará en depósitos de acero inoxidable con control de temperatura, que será menor de 17 ºC"
- KEEP p2 "Redondo en boca, con volumen, debe dominar la fruta"
- KEEP p3 "Yields": "Rendimientos máximos" per grape
- FIX p3-p4: the scale showed two ends only. Now all five steps: 7500 (Cabernet Sauvignon), 9000 (Syrah y Malbec), 10000 (Merlot y Petit Verdot), 11000 (Tempranillo), 12000 (Chardonnay) kg/ha.

## Other checks
- Wine types: p1 Vino Tinto, p2 Vino Blanco only. Both named in the rules beat.
- Label terms: p8 lists "Vino de pago" (used, letter a) and Viejo, Superior, Reserva, Rancio, Noble, Gran reserva, Crianza, Añejo (letter b). The document gives none of them a rule, so none go into `label`.
- Numbers: 100 m (p4-5 "cien metros"), 15% (p5), 22-32 ºC (p2), 10-30%, 1-3 months, 17 ºC (p3), yields (p3-4) all confirmed.

## Fact sheet
- `grapes.main` is empty and `grapes.others` holds all seven. p4 lists five "PRINCIPALES UVAS"; p8 lists Malbec and Petit Verdot as secondary. Proposed: main = the five (cite p4), others = Malbec and Petit Verdot (cite p8). Unsure whether the sheet's `main` follows the pliego's "principales".
- `why.text` says the soils and humidity "keep the grapes small"; p5 hedges it ("propiciando que las mismas sean más pequeñas"). Proposed: "tend to keep".
