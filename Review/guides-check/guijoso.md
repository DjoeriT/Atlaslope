# Guijoso sentence check: source guijoso-doc (Documento único, Ref. Ares(2014)2125388, 27/06/2014)

## Title
KEEP standard title "Why Guijoso tastes the way it does"

## Lede
FIX p4 "Situado a una altitud media de 960 metros ... inviernos muy fríos ... zona de mucho viento"; p3 "El pago se localiza en el término municipal de El Bonillo": "plateau" has no source, replaced by estate, altitude, cold and wind; old lede repeated the ground chapter word for word.
FIX p4 "capas altas debido a la alta concentración de sustancias que se dan gracias al lento desarrollo de las uvas": "ripen slowly" -> "develop slowly"; shortened so it no longer repeats the body.

## place: "One estate among the junipers"
KEEP p3 "El pago" / p4 "bosques de sabinas" (title)
KEEP p7 "Vino de pago" (term explained as a single-estate wine)
KEEP p3 "El pago se localiza en el término municipal de El Bonillo (Albacete)"
KEEP p4 "Situado a una altitud media de 960 metros"
FIX p4 "en un medio rural donde predominan los bosques de sabinas y encinas": "predominate" restored.

## weather: "Snow and wind"
KEEP p4 "registrándose varias nevadas. Es zona de mucho viento" (title)
KEEP p4 "El clima es seco y continental"
KEEP p4 "inviernos muy fríos dándose muchos días temperaturas por debajo de 0º C y registrándose varias nevadas"
KEEP p4 "Es zona de mucho viento"

## ground: "Pebbly and poor"
KEEP p4 "con guijarros, de baja fertilidad" (title)
KEEP p4 "El suelo es franco arenoso con guijarros, de baja fertilidad"
KEEP p4 "gracias al lento desarrollo de las uvas"
FIX p4 "Los vinos presentan aspectos pulidos y capas altas debido a la alta concentración de sustancias": the page's cause chain (slow development -> concentration -> polish and colour) made explicit.

## rules: "Blended reds, golden whites"
KEEP p1 "color amarillo oro"; p2 "Vinos tintos ensamblados" (title)
KEEP p4 "PRINCIPALES UVAS DE VINIFICACIÓN: CABERNET SAUVIGNON SYRAH MERLOT CHARDONNAY"
KEEP p7 "UVAS DE VINIFICACIÓN SECUNDARIAS: SAUVIGNON BLANCO / TEMPRANILLO, CENCIBEL, TINTO DE TORO"
CUT p1 white colour and aroma sentences ("amarillo oro", "frutas amarillas (plátano, mango...) y cítricos (pomelo)", "Buen recuerdo de fruta en boca"): repeated the fact sheet's `tastes`.
KEEP p2 "Vino blanco, maceración en frío entre 5 y 12 horas"
KEEP p2 "Fermentación en depósitos de acero inoxidable a temperatura comprendida entre 14 y 19º C"
FIX p2 "Vinos tintos ensamblados de intensidad de color alta ... Final largo con cierto amargor, sedosos y persistentes": colour, fruit, silky, persistent cut as a repeat of `tastes`; "The reds are blends" kept.
FIX p2 "Maceración comprendida entre 2 y 4 semanas. Fermentación a temperatura comprendida entre 25º y 30º C": fermentation temperature added.
KEEP p2-p3 "barricas de roble de 225 litros ... independientes para cada variedad y entre 6 y 36 meses" (cite p3 added for the end of the sentence)
KEEP p2 "con tiempo de uso no superior a 5 años"
KEEP p3 "posteriormente se realiza el coupage"
FIX p4 "La boca es amable y sabrosa por el perfecto equilibrio entre potencia y elegancia, con astringencias agradables": added (page's own cause-to-taste link), replaces the cut tasting lines.
FIX p4 "un final de cierto amargor consecuencia de taninos que se han desarrollado de forma singular": page says this of the wines, not only the reds; "unusual" -> "singular".

## Checks
- Wine types: p1 Vino Blanco, p2 Vino Tinto only. Both named.
- Label terms: p7 lists Vino de pago (explained) and Viejo, Superior, Reserva, Rancio, Noble, Gran reserva, Crianza, Añejo with no rule anywhere in the pliego: none added. Guide has no `label`.
- Flights: none. The pliego names no river, valley or range; El Bonillo is only named as the municipality.
- Numbers: 960, 0, 5-12, 14-19, 2-4, 25-30, 225, 6-36, 5 all confirmed on p2-p4.

## Fact sheet
- grapes.main: sheet says [] with all six in `others`; pliego p4 lists Cabernet Sauvignon, Syrah, Merlot, Chardonnay as "PRINCIPALES UVAS"; p7 lists Sauvignon Blanco and Tempranillo as "SECUNDARIAS".
- Other fields (why, styles, climate, soil, altitude, tastes, famous) agree with p1, p2, p4.
