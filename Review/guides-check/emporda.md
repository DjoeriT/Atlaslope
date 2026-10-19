# emporda: sentence check against emporda-pliego (pliego text as packed by Tools/guides/pack.py, 19 Oct 2026)

Counts: KEEP 40, FIX 31 (4 of them added sentences), CUT 1.

## Guide title and lede
- KEEP title "Why Empordà tastes the way it does" (general, no claim beyond the guide)
- KEEP p14 "fuerte viento del norte denominado Tramuntana, que sopla con rachas que a menudo superan los 120 kilómetros por hora"; p18 "extraordinariamente frío y seco"
- KEEP p18 "con un estado sanitario excelente hasta su recolección"; "a la hora de escoger variedades de uva con tallos más resistentes"

## corner (place)
- FIX title p13/p14 "situada en el extremo nordoriental de Cataluña": "A sheltered corner" widened "abrigada" (said only of the Alt Empordà) to the whole zone. Now "The far north-east corner of Catalonia".
- KEEP p13 "situada en el extremo nordoriental de Cataluña"
- FIX p13 "La zona de producción ... engloba un total de 55 municipios ... 35 municipios del Alt Empordà y 20 municipios del Baix Empordà ... dos zonas separadas geográficamente": "The vineyards cover" became "The production zone takes in".
- KEEP p14 "abrigada en la falda de las sierras de Rodes y de las Alberes, en un arco que va desde el Cap de Creus a la denominada Garrotxa d'Empordà"
- FIX p14 "Limita ... con los Pirineos en el norte, el Mediterráneo por levante y la plana propiamente dicha al mediodía": three-item list split into two sentences.
- KEEP p14 "delimitada en el norte por el macizo del Montgrí, en el suroeste por el macizo de las Gabarras"
- KEEP p14 "y al este, por el Mediterráneo"
- KEEP p14 "altitudes que se acercan a los 1500 m"; "llegan al punto más alto a 535 m"
- KEEP p14 "situados desde nivel del mar hasta un máximo de 260 m. de altitud"
- KEEP fly Cap de Creus p14 "un arco que va desde el Cap de Creus"; point [3.32, 42.32] vs OSM [3.3224, 42.3195], under 1 km.
- KEEP fly Montgrí p14 "delimitada en el norte por el macizo del Montgrí"; pack had no OSM hit; one Nominatim query ("Montgrí") gave Torroella de Montgrí [3.126, 42.041] and the Parc Natural del Montgrí [3.171, 42.081]; the point [3.13, 42.06] lies between them on the massif, within 3 km. Unchanged.

## tramuntana (weather)
- FIX title p18 "La Tramuntana ha marcado la orientación de los viñedos desde hace siglos": "The wind that does the farming" overclaims. Now "The wind that shaped the vineyards".
- KEEP p16 "clima mediterráneo, la pluviometría se sitúa en torno a los 600 mm anuales ... entre los 14ºC y los 16ºC"
- KEEP p14 "los inviernos son suaves con pocas heladas"
- KEEP p14 "los veranos calurosos, templados por las brisas marinas"
- FIX p14 "El rasgo climático más característico": "the region's signature" became "the most characteristic feature of the climate".
- FIX p18 "neutraliza los excesos de humedad que se pueden dar de manera puntual en las estaciones más lluviosas, evitando que se desarrollen problemas fitosanitarios ... estado sanitario excelente hasta su recolección": "blows away ... after wet spells" now carries "now and then in the wettest seasons" and the disease link.
- KEEP p18 "escoger variedades de uva con tallos más resistentes, como son la garnacha y cariñena, en sus distintas variantes (blanca, tinta y rosada)"
- KEEP p18 "aún hoy en día predominan en el viñedo del Empordà"
- KEEP p18 "plantación de altos cipreses, muchos de ellos centenarios, en el extremo norte de los campos, a modo de barrera contra el viento"
- KEEP p18 "aportan una biodiversidad única a los viñedos que influye específicamente en los aromas primarios de los vinos, impregnados de notas herbáceas y balsámicas"
- FIX p18 "En las zonas montañosas lo atestiguan las terrazas de piedra seca que recorren los montes del litoral": "follow the same logic" made explicit (the wind set the lie of the vineyards) and limited to the coastal hills.
- KEEP p18 "cartografiadas en documentos tan antiguos como La Carte de Cassini de 1747" (map named)
- KEEP p18 "se eviten las bajadas de temperatura excesivas en invierno ... se evita una subida pronunciada de las temperaturas"
- FIX p18 "propicia una maduración lenta que transferirá a los vinos una elegancia distintiva": "which the rules link to" (line about the source) removed.
- FIX p18 "el contraste térmico entre el día y la noche favorece la acumulación y el contenido de polifenoles y compuestos volátiles": "warm days and cool nights ... aromas" became "day and night temperatures ... aroma compounds".
- FIX p18 "vinos de color profundo, carácter y alto potencial de envejecimiento": "character" and "high" restored.
- KEEP p14 "se sitúa en la región III de la clasificación Winkler i Amerine"
- FIX p14 "idónea para el cultivo de variedades de ciclo medio y largo, y extraordinaria para la elaboración de vinos dulces naturales": "is described as" (source framing) removed.
- FIX fly caption p16 "Las viñas reciben la fuerte influencia del régimen de vientos ... sobre todo a la Tramuntana"; p18 cypresses: "blows across the whole of Empordà" widened; now "strongly marks the vineyards of Empordà", p16 added to cite.

## soils (ground)
- KEEP title p16 "en un área tan pequeña de terreno ... se concentra una gran tipología de suelos"
- KEEP p16/p19 "hecho que sucede en muy pocos lugares"
- KEEP p16/p19 "suelos pobres y ligeros, los cuales permiten un buen drenaje y son de naturaleza ácida o neutra"
- FIX p14 "mayoritariamente son de textura arenosa y pobres en materia orgánica": said of the terrenos, not the topsoil. Now "Most of the ground".
- FIX p14 "los suelos son graníticos y arenosos, otros de licorella y pizarra, con algunos núcleos calcáreos": unexplained term licorella (the pliego does not define it) dropped; "slate soils".
- KEEP p19 "expresan una gran tensión y acidez, con una intensidad polifenólica moderada" (grupo 1); "similares al grupo 1, expresando una gran tensión y acidez" (grupo 3); p17 "morfología suavemente inclinada"
- KEEP p19 "Suelos provenientes de rocas de tipo pizarroso y esquistoso"
- FIX p19 "un contenido de alcohol alto, son estructurados y de alta intensidad polifenólica": three-item list reworded.
- KEEP p19 "vinos tintos de largo envejecimiento que resultan minerales y especiados, vinos blancos de larga duración que son de graduación media y golosos"
- FIX p19 "vinos de licor de uvas ligeramente sobremaduradas, como la Garnacha y el Moscatel del Empordà": "slightly overripe" restored.
- KEEP p14 "zonas de la plana ampurdanesa, donde predominan los suelos de naturaleza aluvial"; p20 "margas, lutites y arcillas"; "conglomerados y areniscas"
- FIX p20 "los vinos tranquilos elaborados en estos terrenos de la plana ... ligeros, balsámicos y sedosos": limited to still wines.
- FIX p20 "Se elaboran excelentes blancos, rosados y tintos jóvenes, con una buena relación acidez y equilibrio, son afrutados y frescos": "good" became "excellent"; rosados explained.
- FIX p20 "han aprendido a complementar sus vinos procedentes de uva de parcelas situadas en los diferentes tipos de suelos": "blend" now the page's words.

## range (rules)
- KEEP title p18/p21 "Existen soleras fechadas con más de un siglo"
- FIX p16 "Lledoner negre para referirse a la Garnacha tinta ... Lledoner roig para designar una Garnacha rojiza propia del Empordà": "Garnacha leads here" is not on any page (p18 names Garnacha and Cariñena together as dominant). Now gives the local names.
- FIX p13 "Blancas recomendadas: Garnacha blanca ... Garnacha roja ... Cariñena Blanca ... Macabeo ... Moscatel de Alejandría / Tintas recomendadas: Cariñena tinta ... Cariñena roja ... Garnacha tinta": recommended list was incomplete ("white and red forms" left out Garnacha Tinta and the Cariñena forms).
- KEEP p13 "Tintas autorizadas: ... Merlot, Monastrell ... Syrah"; "Blancas autorizadas: Chardonnay ... Picapoll blanco"
- KEEP p1-p3 vino blanco / rosado / tinto, each "fermentado en barrica" or "envejecido ... en recipientes de madera"
- FIX p2 "fermentación alcohólica del mosto de uva con la totalidad de sus hollejos, pulpas y pepitas y, eventualmente, los escobajos, hasta como mínimo el fin de la fermentación alcohólica": the full brisado rule moved here from the label list.
- FIX p4 "sobrepresión no inferior a 1 bar ni superior en 2,5 bar medido a 20ºC": pressure added to "lightly fizzy".
- KEEP p4 "método tradicional ... permanecer un mínimo de nueve meses en la bodega en contacto con sus lías y en la misma botella donde se ha llevado a cabo la segunda fermentación"
- FIX p17 "productos muy arraigados en la zona": "the old heart of the region" became "deeply rooted here".
- FIX (added) p6 "se encabeza con alcohol vínico de primera calidad"; p6 "se paralizará la fermentación mediante la adición de alcohol vínico"; p5 "añadir ... alcohol vínico": says plainly the liqueur wines are fortified.
- KEEP p5 "como mínimo en un 90% de las variedades garnacha blanca, roja, negra o peluda"; "mínimo 15% vol, máximo 20% vol"
- FIX (added) p11 "se designará con la mención ámbar cuando se haya elaborado a partir de la variedad de uva garnacha blanca y/o garnacha roja, y se designará rubí cuando proceda de uva de la variedad garnacha tinta"
- KEEP p18 "El vino se suele criar por el sistema de soleras. Existen soleras fechadas con más de un siglo"
- FIX p6 "como mínimo un 90% provenga de las variedades moscatel de Alejandría y/o moscatel de grano menudo ... se paralizará la fermentación"; p5 mistela blanca/negra; p7 "sobremaduradaos hasta alcanzar un grado alcohólico volumétrico natural mínimo de 18% vol": the one-line "complete the group" list split, each type now carries its rule.
- FIX (added) p11 "se designarán con la mención de vino dulce natural cuando procedan de mostos de elevada riqueza en azúcar" (number left out: p11 says 270 g/L, p24 shows 270 struck for 252)
- FIX (added) p6 "VINO DULCE DE EL EMPORDÀ ... fermentado parcialmente y encabezado con alcohol vínico": a protected type the guide was missing.
- KEEP p4/p6 "El proceso oxidativo se tendrá que realizar durante un tiempo mínimo de 2 años"
- FIX p20 "Cenobio benedictino fundado en la cima del cabo de Creus a finales de siglo IX ... fue un promotor decidido de la viticultura en la costa ampurdanesa": "The monks ... founded in the late 9th century, planted Moscatel" (monks founded; planting not stated). Now the monastery was founded and promoted vines.
- FIX p21 "la cabrevación del monje bodeguero de 1420. En ella se relacionan distintos viñedos ubicados en el cabo de Creus, entre los que destacan los de uva moscatel, que son posicionados como los más apreciados": "among their most prized" became "the most prized".
- KEEP p21 "el Barón de Bourgoing que el 1779 ... lo describe como un vino generoso a medio camino entre el Jerez y el Frontignan"
- KEEP fly Sant Pere de Rodes p20/p21 as above; point [3.166, 42.32] vs OSM [3.1652, 42.3234], under 1 km.
- Missing types grep: vino blanco, brisado, rosado, tinto, rancio (cat. 1 and licor), aguja, espumoso de calidad, mistela blanca and negra, Garnacha, Moscatel, vino dulce, uvas sobremaduradas: all now named. Vino dulce was missing.
- Missing flights: not triggered (the guide flies to named points, not only the place).

## label
- KEEP Vino joven p10/p22 "únicamente podrán comercializarse con la indicación en la etiqueta del año de la cosecha. Se embotellarán durante el año de la campaña y/o a partir del 20 de diciembre"
- KEEP Vino de guarda p10/p22 "periodo mínimo de doce meses en barricas de madera de roble"
- KEEP Crianza p10/p22 "tintos ... 24 meses con una permanencia mínima ... de 6 meses"; "blancos y rosados ... 18 meses con una permanencia mínima de 6 meses"
- CUT Brisado from label: a style the rules beat describes is not repeated in label; its rule (p2) now sits in the rules beat. p2 dropped from the label cite, p22 added.

## Fact sheet (content/facts/cataluna.json, "emporda"; not edited)
- why.text: sheet says poor, well-drained soils "on the Empordà plain" give light, fresh wines; pliego p16/p19 says poor, light soils carry most of the vineyard in both hills and plain, and p14/p20 says the plain soils are alluvial (marl, clay, conglomerate, sandstone).
- grapes.main: sheet lists only Garnacha Tinta; pliego p13 recommends Garnacha blanca, roja and tinta, Cariñena blanca, roja and tinta, Macabeo and Moscatel de Alejandría. Cariñena Blanca and Cariñena roja are missing from main and others.
- grapes.others: "Malvasía Aromática" where p13 says "Malvasía"; "Tempranillo" where p13 says "Ull de llebre".
- styles.text: omits rancio (p3-4, p6), mistelas (p5) and vino dulce del Empordà (p6).
- climate: empty; pliego p14/p16 gives Mediterranean climate, about 600 mm, 14 to 16 °C, Tramuntana.
- soil.text: sheet gives conglomerates and sandstones as the soil source; p20 makes these only one of two plain groups, and p14/p16-p19 add granite, slate and schist, gravel and clay.
- famous.styles Moscatel: sheet says "sweet, fleshy"; p6 says "dulce, aterciopelado, gusto intenso y persistente".
- famous.styles: no Rancio entry, though p3-p7 protect Vino Rancio del Empordà in two categories.
- All sheet cites point to "emporda-doc", not this pliego.

## Second check

Source emporda-pliego (tracked-changes text; where old and new figures sit side by side and the order is unclear, the figure is left out). Counts for this pass only: KEEP 64, FIX 16, CUT 0; label terms added 14.

### Title and lede
- KEEP title "Why Empordà tastes the way it does" (template).
- KEEP p14 "fuerte viento del norte denominado Tramuntana, que sopla con rachas que a menudo superan los 120 kilómetros por hora"; p18 "extraordinariamente frío y seco".
- KEEP p18 "estado sanitario excelente hasta su recolección"; "escoger variedades de uva con tallos más resistentes".

### corner (place)
- KEEP title p13 "situada en el extremo nordoriental de Cataluña".
- KEEP p13 "extremo nordoriental de Cataluña".
- KEEP p13 "55 municipios distribuidos en dos comarcas: 35 municipios del Alt Empordà y 20 ... dos zonas separadas geográficamente".
- KEEP p14 "abrigada en la falda de las sierras de Rodes y de las Alberes, en un arco que va desde el Cap de Creus a la denominada Garrotxa d'Empordà".
- KEEP p14 "con los Pirineos en el norte".
- KEEP p14 "el Mediterráneo por levante y la plana propiamente dicha al mediodía".
- KEEP p14 "delimitada en el norte por el macizo del Montgrí, en el suroeste por el macizo de las Gabarras".
- KEEP p14 "al este, por el Mediterráneo".
- KEEP p14 "altitudes que se acercan a los 1500 m ... llegan al punto más alto a 535 m".
- KEEP p14 "desde nivel del mar hasta un máximo de 260 m. de altitud".
- FIX fly Cap de Creus p14 "en un arco que va desde el Cap de Creus": the arc is the production zone, not "the vineyards". Point within 0.3 km of OSM.
- KEEP fly Montgrí p14 "macizo del Montgrí" (OSM no result; point sits on the Montgrí castle hill, within 3 km of the massif).

### tramuntana (weather)
- KEEP title p18 "La Tramuntana ha marcado la orientación de los viñedos desde hace siglos".
- KEEP p16 "clima mediterráneo ... 600 mm anuales ... entre los 14ºC y los 16ºC".
- KEEP p14 "inviernos son suaves con pocas heladas".
- KEEP p14 "veranos calurosos, templados por las brisas marinas".
- KEEP p14 "El rasgo climático más característico".
- KEEP p18 "frío y seco ... neutraliza los excesos de humedad que se pueden dar de manera puntual en las estaciones más lluviosas".
- KEEP p18 "evitando que se desarrollen problemas fitosanitarios ... estado sanitario excelente hasta su recolección".
- KEEP p18 "Desde antiguo el viticultor se ha adaptado ... tallos más resistentes, como son la garnacha y cariñena, en sus distintas variantes (blanca, tinta y rosada)".
- KEEP p18 "aún hoy en día predominan en el viñedo".
- KEEP p18 "altos cipreses, muchos de ellos centenarios, en el extremo norte de los campos, a modo de barrera".
- FIX p18 "notas herbáceas y balsámicas": "herbal" -> "herbaceous" (source's taste word).
- KEEP p18 "terrazas de piedra seca que recorren los montes del litoral".
- KEEP p18 "La Carte de Cassini de 1747".
- KEEP p18 "se eviten las bajadas de temperatura excesivas en invierno ... se evita una subida pronunciada".
- FIX p18 "Este hecho propicia una maduración lenta": hedge restored, "brings" -> "favours".
- FIX p18 "favorece la acumulación ... de polifenoles y compuestos volátiles": hedge restored, "builds" -> "favours the build-up of", "volatile (aroma) compounds".
- KEEP p18 "vinos de color profundo, carácter y alto potencial de envejecimiento".
- FIX p14 "Con respecto a la temperatura y a la insolación ... región III de la clasificación Winkler i Amerine": "Winkler scale" -> "Winkler and Amerine classification", basis named.
- KEEP p14 "idónea para el cultivo de variedades de ciclo medio y largo, y extraordinaria para la elaboración de vinos dulces naturales".
- KEEP fly caption p16 "Las viñas reciben la fuerte influencia del régimen de vientos".
- KEEP fly caption p18 "cipreses ... en el extremo norte de los campos".

### soils (ground)
- KEEP title p16 "en un área tan pequeña ... se concentra una gran tipología de suelos".
- KEEP p16 "hecho que sucede en muy pocos lugares".
- KEEP p16 "suelos pobres y ligeros, los cuales permiten un buen drenaje y son de naturaleza ácida o neutra".
- KEEP p14 "mayoritariamente son de textura arenosa y pobres en materia orgánica".
- FIX p14 "zonas de montaña y las planas de montaña ... con algunos núcleos calcáreos": "pockets of limestone" -> "limy (calcareous) patches"; "plateaus" -> "plains".
- KEEP p17 "grupos 1 i 3 expresan una mayor tensión, mayor acidez, y menor intensidad polifenólica"; p19 "intensidad polifenólica moderada".
- KEEP p19 group 2 (contrast sentence).
- KEEP p19 "contenido de alcohol alto, son estructurados y de alta intensidad polifenólica".
- FIX p19 "vinos blancos de larga duración que son de graduación media y golosos": "medium strength" -> "medium alcohol".
- KEEP p19 "vinos de licor de uvas ligeramente sobremaduradas, como la Garnacha y el Moscatel del Empordà".
- KEEP p14 "predominan los suelos de naturaleza aluvial"; p20 "margas, lutites y arcillas" / "conglomerados y areniscas".
- KEEP p20 "ligeros, balsámicos y sedosos".
- KEEP p20 "excelentes blancos, rosados y tintos jóvenes, con una buena relación acidez y equilibrio, son afrutados y frescos".
- KEEP p20 "han aprendido a complementar sus vinos procedentes de uva de parcelas situadas en los diferentes tipos de suelos".

### range (rules)
- KEEP title p18 "soleras fechadas con más de un siglo"; p1 "fresco".
- KEEP p16 "Lledoner negre para referirse a la Garnacha tinta" (local name).
- KEEP p16 "Lledoner roig para designar una Garnacha rojiza propia del Empordà".
- KEEP p13 recommended list (Garnacha blanca/roja/tinta, Cariñena blanca/roja/tinta, Macabeo, Moscatel de Alejandría).
- KEEP p13 authorised list.
- KEEP "The range is wide" (p1 to p7 categories).
- FIX p2/p3 "fermentado y/o envejecido, total o parcialmente en recipientes de madera ... como mínimo, un 25%": the wood options apply to whites, rosados and reds alike, not only whites and rosados; "oak" -> "wood"; 25% rule added; cite p3 added.
- KEEP p2 brisado "totalidad de sus hollejos, pulpas y pepitas y, eventualmente, los escobajos, hasta como mínimo el fin de la fermentación alcohólica".
- KEEP p4 "sobrepresión no inferior a 1 bar ni superior en 2,5 bar".
- KEEP p4 "método Tradicional ... mínimo de nueve meses en la bodega en contacto con sus lías y en la misma botella".
- KEEP p17 "productos muy arraigados en la zona".
- KEEP p5 to p7 "alcohol vínico" added in every liqueur wine.
- KEEP p5 "uvas sobremaduradas, como mínimo en un 90% de las variedades garnacha ... mínimo 15% vol, máximo 20% vol".
- KEEP p11 "ámbar ... garnacha blanca y/o garnacha roja ... rubí ... garnacha tinta".
- FIX p18 "se suele criar por el sistema de soleras"; p7 "la media de las diferentes fracciones": solera explained.
- FIX p6 Moscatel "uvas sobremaduradas ... moscatel de Alejandría y/o moscatel de grano menudo ... 15% vol. y máximo de 18%": overripe grapes, both Moscatels and strength added.
- KEEP p11 "vino dulce natural cuando procedan de mostos de elevada riqueza en azúcar" (term glossed; figure left out, p24 shows 270 and 252 side by side).
- FIX p5 mistela "añadir acto seguido alcohol vínico" / negra "sin que se haya iniciado la fermentación, se añade alcohol vinico": method stated, Spanish term explained.
- KEEP p6 "fermentado parcialmente y encabezado con alcohol vínico".
- KEEP p7 "sobremaduradaos hasta alcanzar un grado alcohólico volumétrico natural mínimo de 18% vol".
- FIX p3/p4, p6/p7 rancio: missing type, Rancio del Empordà is both a still wine (category 1) and a liqueur wine with "alcohol vínico" (category 4); both "tiempo mínimo de 2 años".
- KEEP p20 "fundado en la cima del cabo de Creus a finales de siglo IX".
- KEEP p20 "promotor decidido de la viticultura en la costa ampurdanesa".
- KEEP p21 "cabrevación del monje bodeguero de 1420 ... moscatel ... los más apreciados".
- FIX p21 "deja constancia de la exquisitez de sus vinos dulces ... lo describe como un vino generoso a medio camino entre el Jerez y el Frontignan": he praised the sweet wines and described the wine of Empordà (not "the local sweet wine").
- KEEP fly Sant Pere de Rodes p20/p21 (point 0.4 km from OSM).

### label
- FIX Vino joven p22 "únicamente podrán comercializarse con la indicación en la etiqueta del año de la cosecha. Se embotellarán durante el año de la campaña y/o a partir del 20 de diciembre": "sold with only its harvest year" misread the rule.
- FIX Vino de guarda p22 "periodo mínimo de doce meses en barricas de madera de roble ... inferior o igual a 330 litros": barrel size added.
- FIX Crianza p22 (24/6 reds, 18/6 whites and rosados, 330 litres): barrel size added.
- Added from a full sweep of menciones and indicaciones: Vino nuevo/novell p22; Reserva p22/p23; Gran reserva p22/p23 (reds from the clean 60/18 paragraph); Garnacha del Empordà crianza, reserva, gran reserva, vieja reserva p23; Solera p23; Fermentado en barrica p23 (600 l); Barrica and roble p23/p24 (capacity left out, 330 and 600 shown side by side); Vino dulce natural p24; Rancio and rancio dulce p24; sparkling and needle sweetness scale p8 (all seven steps); other wines' sweetness p8; Lledoner p25; grape and vintage 85% p24/p25; Embotellado en la propiedad p24. Ámbar and Rubí stay in the rules beat only (famous style Garnacha).
- Cite now p8, p10, p22, p23, p24, p25.

### Fact sheet
No field disagrees with the pliego. Notes: `styles.text` leaves out the brisado white (p2); `soil.text` leaves out the limy patches (p14). Both are omissions, not errors.
