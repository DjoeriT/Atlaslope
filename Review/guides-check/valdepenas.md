# Valdepeñas sentence check
Source: valdepenas-doc (Documento único, Ref. Ares(2014)2125907, 27/06/2014, 12 pages)

## Title
- KEEP "Why Valdepeñas tastes the way it does" (standard title)

## Lede
- FIX p6 "El clima continental seco y el predominio de terrenos calizos pobres en materia orgánica ... provocan estrés hídrico": "chalky" made "limy" (calizo), "mostly" added for "predominio".
- FIX p6 "respondiendo ésta con bajas producciones y buena maduración ... Estos factores favorecen la obtención de vinos tintos bien estructurados complejos y elegantes": "that gives" made "which favours" (hedge restored), list broken up.

## south (place)
- FIX title: "The far south of Ciudad Real" to "The south of Ciudad Real"; p6 says "al sur", not far south.
- KEEP p6 "Situada al sur de la provincia de Ciudad Real"
- KEEP p6 "Valdepeñas, Santa Cruz de Mudela, Moral de Calatrava, Alcubillas, San Carlos del Valle, Torrenueva" (six whole municipalities)
- KEEP p6 "y parte de los siguientes municipios: Alhambra, Granátula de Calatrava, Montiel, Torre de Juan Abad"
- Flight label FIX: "Valdepeñas, the heart of the zone" to "Valdepeñas, inside the zone"; "heart" has no source. p6 names Valdepeñas in the zone.
- Flight caption KEEP p6 "Situada al sur de la provincia de Ciudad Real".
- Flight point: pack lookup returned no result; the flight uses the place id `valdepenas`, which is the named town. Not re-queried. No river, valley or range is named in the pliego, so no flight added.

## climate (weather)
- FIX title: "Hot summers that ease off late" to "High summer heat that softens late"; p7 "temperaturas altas se suavizan al final".
- KEEP p6 "El clima continental seco"
- KEEP p7 "En verano las temperaturas altas se suavizan al final"
- FIX p7 "propician un final de la maduración más lento": "makes ... slower" to "favours a slower end of ripening" (hedge restored).
- KEEP p7 "mayor desarrollo de compuestos polifenólicos y la conservación de los aromas" (wording kept closer: "polyphenolic compounds").

## chalk (ground)
- FIX title: "Chalk that holds the heat" to "Limy ground that stores the heat"; p6 "calizos" is limy, "almacenan su calor".
- FIX p6 "predominio de terrenos calizos pobres en materia orgánica ... (pH altos 7,5-8,5)": "chalky" to "limy".
- KEEP p6 "ofrecen poca resistencia a la penetración de las raíces"
- FIX p6 "reflejan la luz solar": "The pale ground" to "These limy soils"; "pale" has no source.
- KEEP p6 "almacenan su calor para el periodo nocturno"

## wines (rules)
- FIX title: "Low yields, four kinds of wine" to "Low yields, still and sparkling"; p1 has two categories ("Vino", "Vino espumoso de calidad") and five described wines, not four.
- FIX p6 "PRINCIPALES UVAS DE VINIFICACIÓN: CABERNET SAUVIGNON, AIREN, VERDEJO, TEMPRANILLO, CENCIBEL, TINTO DE TORO, SYRAH, MACABEO, VIURA": six-name list split into lines; synonyms kept.
- FIX added p11 "UVAS DE VINIFICACIÓN SECUNDARIAS: CHARDONNAY, GARNACHA TINTA, MERLOT ..." (secondary grapes were missing); cite p11 added.
- FIX p5 "Variedades tintas ... 6000 Kilogramos" / "Variedades blancas ... 7500 Kilogramos": "Yields stay low" to "Yields are capped"; split into two sentences.
- KEEP p1 "Ligeros en boca, de color amarillo pálido", "Su aroma es fino y limpio, discretamente afrutados" (list broken up, "fine, clean" added).
- FIX p1 "con tonalidades ambarinas y reflejos dorados si han pasado por barricas": "golden tones" to "amber tones with golden glints".
- FIX p2 "color rosáceo con matices rojos y violetas": "Rosados" explained as rosés; list split.
- KEEP p2 "limpio, fresco y afrutado, con recuerdo a frutos rojos ... acidez media-alta" ("recalling red fruit" added).
- FIX p2 "rojo picota a cereza violáceo o rubí": "cherry to ruby" to "picota cherry to violet cherry or ruby".
- KEEP p2 "su aroma es muy sutil y aumenta con el tiempo"
- KEEP p2 "En boca son vinos suaves, cálidos y largo postgusto"
- KEEP p3 "Color rojo violáceo – granate ... vinos francos, afrutados ... expresión tánica moderada" ("Tinto Tradicional" now explained).
- FIX p1 "Vino espumoso de calidad": "Sparkling wine is made too, as quality sparkling wine" tightened.
- KEEP p4 "tonos pálidos o dorados y brillantes, con burbuja fina y persistente. los aromas son limpios y frutales" (split into two sentences).
- Wine types swept: p1 categories Vino and Vino espumoso de calidad; descriptions Blanco, Rosado, Tinto, Tinto Tradicional, Espumoso. All named. No generoso, licor or named sweet style; "semisecos, semidulces y dulces" appear only as sulphur limits.
- Note: the tasting paragraphs overlap the fact sheet `tastes`; kept because the rules beat must name each type and the colour words are the page's own.

## label
- KEEP p7 "Los vinos espumosos de calidad ... pueden utilizar en el etiquetado las indicaciones "Premium" y "Reserva"" (both terms).
- Sweep: p11 lists traditional terms (Viejo, Superior, Reserva, Rancio, Noble, Gran reserva, Crianza, Añejo) with no rule of their own; p3 names crianza, reserva and gran reserva only in a volatile-acidity limit. None added. No famous style in `label`.

## Fact sheet
- why.text: sheet "chalky, humus-poor soil"; p6 "terrenos calizos" (limy). Sheet "Low yields give"; p6 "favorecen".
- grapes.main: sheet empty, all twelve in others; p6 names six "PRINCIPALES", p11 six "SECUNDARIAS" (unsure of sheet style).
- climate.text: sheet "slowing the end of ripening"; p7 "propician un final de la maduración más lento" (hedge).
- soil.text: sheet "Chalky"; p6 "calizos" (limy).
- tastes.text: sheet "golden after barrel"; p1 "tonalidades ambarinas y reflejos dorados si han pasado por barricas".
- famous.styles, styles.kinds: agree with p1, p3, p4.
