# Toro guide sentence check

Source: Pliego de condiciones DOP «Toro», PDO-ES-A0886 (Review/sources/fetched/pliego-PDO-ES-A0886-toro.txt), latest revision listed p2 (normal amendment after AM02, 2018/2019). Checked 2026-10-19 against `content/guides/toro.json`.

## Lede
- FIX p20 "extremado frío en invierno, gran número de horas de sol" — was "winters of extreme cold and a lot of sun"; sun is not a winter trait. Now "extremely cold winters and a great many hours of sun".
- FIX p20 "condicionan la fase aromática, la estructura y grado alcohólico de los vinos, que es elevado" — the old line tied high alcohol to old vines; the page ties it to climate and soils. Split into its own sentence.
- FIX p20 "el elevado componente férrico del suelo, junto con la elevada edad del viñedo influyen en la destacadísima cantidad de materia colorante" — "give" softened to "help give" (page says "influyen").

## Place
- KEEP title p15 "en el extremo occidental de la región de Castilla y León"
- KEEP p15 "en el extremo occidental de la región de Castilla y León, al sudeste de la provincia de Zamora"
- FIX p15 "Linda con los páramos de Tierra del Pan y Tierra de Campos, abarcando 62.000 hectáreas" — gloss "high limestone plateaus" cut to "high plateaus"; the page does not say limestone.
- KEEP p17 "una orografía suave"
- KEEP p17-18 "marcada por el río Duero, su afluente Talanda, y los ríos Guareña y Hornija, que moldean el terreno en valles y terrazas"
- KEEP p18 "entre los 620 m y los 840 m, encontrándose la mayor altitud en la zona suroeste"
- Flight "Toro": KEEP p15 "abarcando 62.000 hectáreas ... al sudeste de la provincia de Zamora". Place resolved by id; Nominatim "Toro, Zamora" = 41.522, -5.394.
- Flight "The Duero valley": KEEP caption; FIX cite p17 -> p17, p18 ("valles y terrazas" is on p18). Point [-5.4, 41.51] is about 1.3 km from Toro on the Duero below the town; within 3 km, kept. No missing flight: the guide already flies to the Duero.

## Weather
- FIX title "Hot sun, hard frost" -> "Many hours of sun, hard frost" (p18 "Horas de sol efectivas"; "hot" not said).
- FIX p18 "clima continental y extremado con influencias atlánticas" — dropped the added hedge "some".
- KEEP p18 "de carácter semiárido, con carencia de humedad y frecuentes heladas primaverales"
- KEEP p18 "Precipitaciones: 350-400 mm. Anuales."
- KEEP p18 "Temperatura Media Anual: 12-13º C. Oscilación Térmica: Entre -11 y 37º C."
- FIX p18 "Horas de sol efectivas: 2.600 (hasta 3.000)" — "about" dropped, "effective" added, subject is the zone.
- KEEP p18 "Fluctuaciones térmicas elevadas entre día y noche en maduración superior a 15º C."
- FIX p20 "Las condiciones climáticas descritas ... que limitan los rendimientos productivos de la vid" — "hard conditions hold yields down" now names the climate as the page does.

## Ground
- KEEP title p18 "franca-arenosa"; p18 "pobre en oligoelementos, excepto en hierro"
- KEEP p18 "es franca-arenosa, de escasa materia orgánica (< 1%)"
- KEEP p18 "un pH entre ligeramente acido a neutro 6-7, solamente en la zona suroeste se encuentran pH más básicos entorno al 8"
- KEEP p18 "pobre en oligoelementos, excepto en hierro"
- KEEP p18 "se plantan las variedades según el tipo de terreno"
- KEEP p18 "Tinta de Toro: Principalmente en terrenos cascajoso en superficie, con subsuelo arcilloso."
- KEEP p18 "Malvasía Castellana. Principalmente para terrenos más ligeros y arenosos. Garnacha Tinta. Igual que la Malvasía Castellana en terrenos arenosos."
- FIX p20 "el elevado componente férrico del suelo, junto con la elevada edad del viñedo influyen en la destacadísima cantidad de materia colorante" — "explain" widened "influyen"; now "influence the very large amount of colour".
- KEEP p19 "más de un 50% de viñedos con más de 40 años de edad, el viñedo prefiloxérico existente"

## Rules
- KEEP title p19 "de menor producción ... de vinos más concentrados y potentes"
- KEEP p19 "similar ampelográficamente y genéticamente a la variedad Tempranillo"
- FIX p19 "de menor producción, más tánica, ... menos ácida, ... y de vinos más concentrados y potentes" — split the three-part list into two sentences.
- KEEP p16 "Tinta de Toro 7.500 ... Garnacha Tinta 9.000 ... Variedades blancas ... 9.000"
- KEEP p13 "La formación de la cepa podrá ser en vaso o en espaldera"; "La densidad de plantación mínima será de 500 cepas por hectárea."
- KEEP p19 "En relación a otros vinos de las zonas colindantes con variedades similares, los vinos de la DOP «TORO» son más estructurados"
- FIX p19 "con mayor componente polifenólica y tánica. Menos ácidos y con pH más altos, y tonalidades de fruta más madura sensorialmente" — split the "X, Y and Z" list; "riper fruit" now "taste of riper fruit" (sensorialmente).
- Label terms: the guide has no `label` field; nothing to check. Famous style "Fermentado en barrica" is not repeated.

Counts: KEEP 24, FIX 12, CUT 0.

## Fact sheet (castilla-y-leon.json, "toro"; not edited)
- why: sheet "Old bush vines"; pliego p13 "La formación de la cepa podrá ser en vaso o en espaldera" (bush or wires). Sheet "hot sun"; p20 "gran número de horas de sol".
- grapes: sheet puts Verdejo under others; pliego p17 "Principales: Malvasía Castellana (sin. Doña Blanca) y Verdejo". Sheet others omit the secondaries Moscatel de Grano Menudo and Albillo Real (p17).
- styles.kinds: sheet white, rose, red only; pliego also has vino espumoso de calidad (p13, p19-20) and semiseco, semidulce and dulce wines (p19).
- soil: sheet "neutral pH"; pliego p18 "pH entre ligeramente acido a neutro 6-7", south-west about 8.
- tastes: sheet whites "straw yellow"; pliego p8 "amarillo pálido a amarillo dorado". Sheet rosés "strawberry to raspberry red"; pliego p9 "rosa pálido a asalmonado". Sheet reds "cherry-picota"; pliego p9 "rojo picota a rojo rubí" (aged: "a teja").
- Sheet cites "toro-doc" pages, not the pliego; the above compares against the pliego only.
