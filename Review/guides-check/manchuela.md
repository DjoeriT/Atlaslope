# Manchuela guide check

Source: manchuela-doc (Documento Único, PDO-ES-A0046, Ares(2014)2126085, 27/06/2014). Checked 19 Oct 2026.

## Title
KEEP "Why Manchuela tastes the way it does" (standard title).

## Lede
FIX p7 "altas temperaturas, ausencia casi total de lluvias entre los meses de mayo y septiembre, y la gran cantidad de horas de sol": was "hot sunny summers"; the page puts high heat and sun on the place, not on summer only.
KEEP p7 "la variedad autóctona Bobal que dan lugar a unos vinos con buena y gran intensidad aromática ... gran intensidad colorante" ("local" now "native").

## place: Between the Júcar and the Cabriel
KEEP p6 title "entre los ríos Júcar y Cabriel".
KEEP p6 "al sureste de la provincia de Cuenca y noroeste de la provincia de Albacete".
KEEP p6 "entre los ríos Júcar y Cabriel".
FIX p8 "formada por 34 bodegas y 900 viticultores": the count is of the applicant producers' group (2014), not of the name in general; now says so.
Flight Júcar: KEEP p6; point [-1.43, 39.19] is Alcalá del Júcar on the river [A, from geography; pack lookup failed and a new lookup was not approved].
Flight Cabriel: KEEP p6; point moved from [-1.3, 39.3] to [-1.31, 39.33], Villatoya on the Cabriel (about 4 km) [A, same reason].
No missing flight: the pliego names no other river, range or town worth a flight.

## weather
FIX title: was "Hot, bright and dry in summer" (all three put on summer); now "High heat and an almost rainless summer", p7 "altas temperaturas, ausencia casi total de lluvias entre los meses de mayo y septiembre".
KEEP p7 "altas temperaturas".
KEEP p7 "ausencia casi total de lluvias entre los meses de mayo y septiembre".
KEEP p7 "la gran cantidad de horas de sol recibidas".

## ground
KEEP title p7 "suelos arcillosos con base calcárea".
KEEP p7 "suelos arcillosos con base calcárea".
KEEP p7 "de los sedimentos de ambos ríos".

## rules
FIX title: was "Bobal leads, and the range is wide"; "leads" has no source (the main-grape list starts with Cabernet Sauvignon). Now "Native Bobal and many kinds of wine".
FIX p7 "condicionan la ubicación de la variedad autóctona Bobal": was "the heat, sun, dry summers and clay soils fit it" (X, Y and Z list; "fit" is not the page's claim). Now "This setting decides where it is planted."
KEEP p7 "intensidad aromática, con notas frutales y florales, con una excelente acidez y gran intensidad colorante".
KEEP p7 "un color vivo y perdurable en el tiempo".
FIX p7 "debido a su excelente carga polifenólica y bajos ph (gran cantidad de IPT sin largas maceraciones": low pH was dropped; added.
KEEP p6-7 main grapes "CABERNET SAUVIGNON / BOBAL / VERDEJO / TEMPRANILLO / MACABEO / GARNACHA TINTA".
FIX p11 "UVAS DE VINIFICACIÓN SECUNDARIAS" (20 counted): "allowed" now "listed as secondary grapes"; example list cut to two to drop the X, Y and Z list.
CUT p1 whites "amarillo muy pálido, con reflejos verdes, llenos de aromas y muy frutados": true, but repeats the fact sheet `tastes`.
CUT p1 rosados "color fresa, frambuesa y muy brillantes ... gran frescura y armonía": true, but repeats `tastes`.
KEEP p1-2 "Vino Blanco, Blanco Fermentado en Barrica y Rosados, semisecos, semidulces y dulces" (now names the three grades).
Added p2 "En la fase visual y olfativa son semejantes a la de los vinos secos de la misma variedad".
CUT p2 reds "rojo cereza hasta el rojo rubí con tonos violáceos ... frutas silvestres rojas ... largo": repeats `tastes`.
FIX p2-3 "Vinos Tintos: Joven, Fermentación en Barrica, Roble y Maceración Carbónica, secos / semisecos, semidulces y dulces": split the X, Y and Z list; "Roble" explained as oak.
FIX p1 "Blanco Fermentado en Barrica y Rosados": was "Whites and rosados can also be fermented in barrel"; only the white is barrel-fermented. Now "Whites can also be fermented in barrel" (p5 "en barrica de roble" for whites).
FIX p4 "Los vinos envejecidos ... tanicidad media a alta, postgusto persistente y armónico": colour and aroma cut (repeat `tastes`); kept tannin, added the finish, and named Crianza, Reserva and Gran Reserva as the aged reds (the pliego gives them no months).
FIX p4 "Son vinos blancos ó rosados, pálidos y brillantes, con espuma compuesta por burbujas pequeñas y persistentes. Su aroma es afrutado y limpio. En boca resultan frescos y equilibrados": split the list; "Quality" added from p1 "Vino espumoso de calidad".
Wine types swept: still white, rosé, red (dry and three sweeter grades), barrel-fermented white and red, Roble, carbonic maceration, Crianza, Reserva, Gran Reserva, quality sparkling. No generoso or vino de licor. All named.

## label
CUT "Premium" p7 "De acuerdo con lo establecido en el artículo 3, letra c) de la Ley 24/2003, los vinos espumosos de calidad ... pueden utilizar en el etiquetado las indicaciones “Premium” y “Reserva”": the rule is left to national law. Same for sparkling "Reserva" (was missing).
Sweep: p10 traditional terms (Viejo, Superior, Reserva, Rancio, Noble, Gran reserva, Crianza, Añejo) are listed without rules; Crianza, Reserva and Gran Reserva are famous styles and stay in the rules beat. Label block removed.

## Fact sheet
- why.text: sheet "summers are hot and sunny" and "calcareous clay soils"; p7 "altas temperaturas ... horas de sol" (not summer only) and "suelos arcillosos con base calcárea" (clay on a limestone base).
- tastes.text: sheet "Aged reds: garnet to tile"; p4 "color granate o color rojo rubí con tonos tejas".
- famous.styles[1] (Crianza, Reserva y Gran Reserva): sheet "medium-high to high tannin"; p4 "tanicidad media a alta" (medium-high to high is the "intensidad" in the mouth).
- styles.text: sheet leaves out that reds (young, barrel-fermented, Roble, carbonic) also come semi-dry to sweet, p3, and that aged reds are Crianza to Gran Reserva, p4 (not sure: an omission, not a contradiction).

## Counts
KEEP 17, FIX 13, CUT 5.
