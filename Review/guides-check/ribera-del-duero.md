# Sentence check: ribera-del-duero

Source: pliego PDO-ES-A0626 Ribera del Duero, version PDO-ES-A0626-AM04 (`Review/sources/fetched/pliego-PDO-ES-A0626-ribera-del-duero.txt`; p<n> = PDF page n). Checked 2026-10-19.
Totals: KEEP 24, FIX 20, CUT 0. Machine check after edits: 0 errors, 8 number warnings, all confirmed below.

## Lede
- FIX p20,p24 "noches frías" / "veranos secos" / "elevada altitud media" / "Es habitual encontrar diferencias térmicas ... de 15 a 20ºC": "high, dry and cold at night" triple split into "sits high, with dry summers and cold nights"; hedge "often" restored for 15 to 20ºC.
- FIX p24 "lenta maduración ... excelente formación de compuestos de interés durante el día ... produce la dulcificación del tanino de forma natural": "builds deep colour" was a cause the page does not make (colour is tied to adaptation, p24 c.1); now "builds the compounds that matter by day and sweetens the tannin naturally".

## Place
- FIX p21 "meseta norte castellana ... gran meseta septentrional de la Península Ibérica": "the great plateau" -> "the great northern plateau".
- KEEP p21 "eje que une a más de 100 pueblos ... franja vitícola de unos 115 km de longitud y 35 de anchura"
- KEEP p21 "confluencia de cuatro provincias ...: Burgos, Segovia, Soria y Valladolid" (a list of names, kept as the content itself)
- KEEP p21 "valles, con una altura topográfica media situada entre los 750 y 850 metros"
- KEEP p21 "lomas interfluviales, con cotas de 1.014 metros"
- FIX p24 "El clima, debido especialmente a la elevada altitud media de la zona, ejerce una marcada influencia sobre las uvas": "This height strongly shapes the climate" -> "Because the land sits so high, the climate has a marked influence on the grapes."
- Fly "The Duero belt": KEEP label; KEEP caption p21 "más de 100 pueblos ... unos 115 km ... 35 de anchura".
- Fly Pintia: KEEP label p25 "ya desde el siglo IV a.C." (number 4 confirmed as roman IV); KEEP caption p25 "Yacimiento Vacceo-Romano de Pintia ... ya en el siglo IV a.C, estos recipientes se empleaban para el servicio y consumo del vino"; FIX point [-4.1, 41.62] -> [-4.167, 41.625] (Nominatim "Pintia", archaeological_site, Pesquera de Duero: 41.6253, -4.1668; old point about 5.5 km east).
- Missing flights: none added; the guide already flies to Pintia beyond the place itself.

## Weather
- FIX p19 "clima Mediterráneo con carácter principal de continentalidad e influencia Atlántica": "strongly continental ... some Atlantic influence" -> "mainly continental in character, with Atlantic influence" (degree words not in the page).
- KEEP p19 "oscilaciones anuales pueden considerarse claramente extremas (42ºC de máxima anual y - 20 º C de mínima)"
- KEEP p19 "riesgo de heladas se sitúa entre el 17 de septiembre y el 6 de junio, afectando a las vides en numerosas ocasiones durante su ciclo vegetativo"
- KEEP p20 "La pluviometría es de moderada a baja, con veranos secos"
- FIX p20 "en Aranda de Duero el promedio se sitúa en 435 mm- y existe un cierto gradiente creciente desde el Oeste hacia al Este": hedge "cierto" restored ("rises somewhat").
- FIX p20 "necesidades hídricas mayores a las precipitaciones en determinadas épocas del año –especialmente durante el estío-, así, aunque las lluvias pueden considerarse como suficientes a nivel global, el reparto ... potencia la importancia del papel del suelo como regulador de la humedad": "In summer ... so the soil has to act as the moisture store" widened and dropped the "rain is enough overall" point; split into two sentences that follow the page.
- KEEP p24 "superando las 2.400 horas anuales de sol"
- FIX p20 "temperaturas diurnas óptimas para el desarrollo de aquélla frente a noches frías ... Es habitual encontrar diferencias ... de 15 a 20ºC": "warm" -> "ideal for it"; hedge "often" restored.
- KEEP p24 "una excelente formación de compuestos de interés durante el día"
- FIX p20 "noches frías capaces de minimizar la destrucción metabólica de compuestos de interés": "stops the vine from burning them off" -> "keeps the vine from burning them off as fast" (minimise, not stop).
- KEEP p24 "Una maduración larga que además produce la dulcificación del tanino de forma natural."

## Ground
- FIX p21 "La cuenca ribereña, formada durante el Mioceno" / "zócalo antiguo arrasado y, en parte, recubierto por sedimentos terciarios": "is filled with sediment" -> "on an old plateau partly covered by Tertiary sediment".
- KEEP p21 "capas ... de arenas limosas o arcillosas destacando la alternancia de capas, tanto de calizas como de margas"
- KEEP p22 "Arcillas arenosas, ocres y rojizas (Terciario) y Terrazas medias y bajas del Duero (Cuaternario)"
- FIX p22 "Normalmente puede hablarse de suelos con una reacción de pH básica y con escasez de materia orgánica": hedge "usually" restored.

## Rules
- KEEP p18 "se considera como principal la Tempranillo (sinonimias admitidas: Tinto Fino o Tinta del País), para la elaboración de vinos tintos"; p22 "sinonimias locales e históricas"
- KEEP p14 "Vinos Tintos: Se elaborarán con un 75%, como mínimo, de la variedad Tempranillo"
- FIX p22 "debido a su adaptación al territorio, se comporta de forma diferente": "so many local names" (not said) -> "its own local names"; adaptation cause restored.
- FIX p24 "equilibrada acidez natural de los vinos, acompañada, en el caso de los tintos, por gran profusión fenólica en la que destacan los tonos azulados ... junto con un tanino de alta calidad polimérica": "X, Y and Z" list split; colour and tannin limited to reds as the page says; "that last" dropped (p23 says it of aged reds only).
- FIX p23 "la mayor parte de nuestros vinos se sometan a procesos de envejecimiento" / "vinos envejecidos, que se encuentran entre los más longevos de España": "aged reds" -> "aged wines" (the page does not limit it to reds).
- FIX p24 "zona límite, apta para vinos de calidad, pero en la que es necesario ajustar, tanto el lugar de plantación, como las variedades": "so the grower has to hold back" -> "fit for quality wine only if the grower suits site and variety to it".
- KEEP p24 "siempre que se limite la carga en los viñedos y no se empleen variedades tardías"
- KEEP p18 "La producción máxima admitida por hectárea será de 7.000 kilogramos de uva"
- KEEP p22 "los rendimientos históricos medios se sitúan levemente por encima de la mitad del rendimiento máximo permitido"
- KEEP p14 "Vinos Blancos: se elaborarán con un 75%, como mínimo, de la variedad Albillo Mayor"; p22 "conocida ... como Blanca del País"
- KEEP p18 "Albillo Mayor, que será de 9.500 Kg de uva por hectárea"
- FIX p23 "históricamente, siempre formó parte ... en mínimas proporciones tanto en los vinos tintos para aportarles frescor": "In small amounts it also goes into reds" -> "Historically it also went into reds in very small amounts".

## Label
- KEEP p13 "ROBLE/BARRICA ... envejecimiento en barrica cuya duración no será inferior a tres meses, habiendo o no fermentado en la misma" / "la capacidad máxima de tales recipientes podrá ser de 600 litros"
- FIX p12-13 "período mínimo de envejecimiento de veinticuatro meses, de los que, al menos, doce ... rosados/claretes y blancos ... dieciocho meses, de los que al menos seis": Crianza minimum hedge "at least" restored; 24, 12, 18, 6 confirmed in words.
- FIX p13 "treinta y seis meses de los que al menos doce ... en botella, el resto ... veinticuatro meses ... al menos seis ... en botella, el resto": Reserva "at least" restored; "rest in bottle" added for rosés and whites; 36, 24 confirmed in words.
- FIX p13 "sesenta meses de los que, al menos veinticuatro ... cuarenta y ocho meses ... al menos seis ... en botella el resto": Gran Reserva "at least" restored; "rest in bottle" added for rosés and whites; 60, 24, 48 confirmed in words.
- No term left to other law. Famous style "Tinto envejecido" is not in `label`.

## Fact sheet (not edited)
- grapes.main: sheet lists only Tinto Fino (Tempranillo); pliego p18 also names Albillo Mayor as main grape for whites.
- grapes.others: sheet lists Cabernet Sauvignon, Merlot, Malbec; pliego p18 also authorises Garnacha Tinta (and Albillo Mayor).
- styles.kinds: sheet has red and rose only; pliego p14 and p23 include white wines (Albillo Mayor, at least 75%).
- tastes: sheet has no whites; pliego p23 "vinos muy aromáticos con marcados tonos frutales y/o vegetales ... equilibrada acidez que les otorga frescor".
- soil: sheet empty; pliego p22 "Arcillas arenosas, ocres y rojizas (Terciario) y Terrazas medias y bajas del Duero", p22 "pH básica y con escasez de materia orgánica".
- climate: sheet "low rainfall"; pliego p20 "de moderada a baja".
