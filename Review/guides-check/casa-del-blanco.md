# Check: casa-del-blanco (source casa-del-blanco-doc, Documento Único, Ares(2014)2126113, 27/06/2014)

## Title and lede
- KEEP title "Why Casa del Blanco tastes the way it does" (standard guide title)
- FIX p3 "destacando la elevada concentración de litio, catión poco frecuente"; p1 "este metal": "lithium, a cation that is uncommon in soil" -> "a high level of lithium, an uncommon metal" (level was dropped; "cation" unexplained)
- KEEP p1 "la concentración de iones Litio es de hasta 10 veces superior a las concentraciones de los vinos del entorno"

## place (plateau)
- KEEP title p3 "altiplanicie mesetaria muy llana"
- KEEP p3 "La finca se encuentra ubicada en el término municipal de Manzanares (Ciudad Real)"
- KEEP p7 "Vino de pago" (p8 "reconocimiento del vino de pago"); term explained in the sentence
- KEEP p3 "altiplanicie mesetaria muy llana, pendientes medias por debajo del 2%"
- Flights: none. The pliego names no river, valley, range or historic town beyond the municipality; none added.

## ground (lithium)
- FIX title "Volcanic soil with lithium" -> "Basalt in the soil, lithium in the wine": p3 says volcanic material is found in the soil ("identificándose materiales volcánicos (basaltos)"), not that the soil is volcanic
- FIX p3 "textura franco-arenosa, identificándose materiales volcánicos (basaltos), presentando un Ph básico": split the X, Y and Z list into two sentences
- KEEP p3 "destacando la elevada concentración de litio"
- FIX p3 "alcanza un valor equivalente a los oligoelementos cinc y cobre de otros suelos rojos. Alcanza unos valores de 0,86 a 2,9 mg/Kg": number confirmed; comparison reworded so it reads as zinc or copper levels in other red soils
- FIX p3 "puede considerarse como un marcador efectivo": hedge restored ("works as a marker" -> "can be taken as a reliable marker")
- KEEP p3 "las parcelas con un mayor contenido en litio han dado lugar a vinos con una mayor concentración de este oligoelemento"

## rules (wines)
- FIX title "Red and white from international grapes" -> "A red and a white": "international" is not in the pliego (Tempranillo is listed)
- added p1 "Vino Tinto", p2 "Vino Blanco": the two protected wine types named
- KEEP p3 "PRINCIPALES UVAS DE VINIFICACIÓN ... CABERNET SAUVIGNON / TEMPRANILLO, CENCIBEL, TINTO DE TORO / SYRAH / PETIT VERDOT / MERLOT"
- FIX p8 "UVAS DE VINIFICACIÓN SECUNDARIAS ... CABERNET FRANC / CHARDONNAY / MALBEC / SAUVIGNON BLANCO": "allowed as well" -> "the secondary grapes"
- CUT p1 "color cereza o rojo intenso, de capa alta y aroma potente": repeats the fact sheet `tastes` word for word
- CUT p1 "son sabrosos, carnosos y potentes": repeats the fact sheet `tastes`
- FIX p2 "En los vinos tintos la fermentación alcohólica, individualizada por variedad, se realiza en presencia de los hollejos durante un periodo no inferior a 10 días y a una temperatura comprendida entre 22ºC y 32ºC": KEEP facts; "For the red" added, since the taste lead-in was cut
- FIX p2-p3 "El envejecimiento, individualizado por variedad, se realiza en barricas de roble francés y americano durante un tiempo no inferior a 12 meses, a su fin, se lleva a cabo el ensamblaje de los vinos y en botella al menos 12 meses": three-step list split into two sentences; "barrels" restored
- CUT p2 "limpios, cristalinos, amarillo pajizo con ribetes dorados": repeats the fact sheet `tastes`
- CUT p2 "aromas a frutas blancas y fresco, agradable de acidez bien compensada. Postgusto largo": repeats the fact sheet `tastes`
- KEEP p2 "se desfanga a una temperatura entre 10 y 15ºC durante un tiempo no inferior a 18 horas ... fermentación controlada a temperatura comprendida entre 13-21ºC" (split into two sentences, "For the white" added)
- KEEP p3 "7500 Kilogramos de uvas por hectárea", "52,5 Hectolitro por hectárea"
- Label: p7 lists traditional terms (Viejo, Superior, Reserva, Rancio, Noble, Gran reserva, Crianza, Añejo) with no rule of their own anywhere in the pliego; none added. No famous style.

## Fact sheet
- grapes.main: sheet [] ; pliego p3 "PRINCIPALES UVAS": Cabernet Sauvignon, Tempranillo (Cencibel, Tinto de Toro), Syrah, Petit Verdot, Merlot
- grapes.others: sheet lists all nine ; pliego p8 "SECUNDARIAS": Cabernet Franc, Chardonnay, Malbec, Sauvignon Blanco only (othersCite -> p8)
- Other fields agree with p1-p3. climate stays empty: the pliego says nothing on climate.
