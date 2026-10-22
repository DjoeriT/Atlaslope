# Sentence check: barbera-del-monferrato-superiore (source barbera-del-monferrato-superiore-disc, disciplinare DOCG Barbera del Monferrato Superiore, last change DM 07.03.2014)

## Title
KEEP p6/p7 guide title (standard form)

## Lede
KEEP p7 "dei vini dell'Astigiano e del basso Monferrato, dove è indigeno e da lunghissimo tempo coltivato" (Leardi e Demaria, 1873)
KEEP p6 "La tipologia Superiore nasce dai grappoli più maturi e permane in cantina ad affinarsi per un periodo minimo di 14 mesi"

## hills (place)
KEEP title p6 "sistema collinare poco elevato"; p2 "Sono esclusi i terreni di fondovalle"
KEEP p6 "comprende la Provincia di Asti e parte della provincia di Alessandria"
KEEP p6 "compreso per lo più tra i 150 e i 400 metri di altitudine"
FIX p1-p2 "Provincia di Alessandria: a) Alto Monferrato ... b) Basso Monferrato": the split covers the Alessandria villages only, not the whole zone. Now "On the Alessandria side the villages are split into..."
KEEP p2 "giacitura: esclusivamente collinare"
KEEP p2 "Sono esclusi i terreni di fondovalle, quelli umidi e quelli non sufficientemente soleggiati"
KEEP p2 "altitudine: non superiore a 650 metri s.l.m."; p3 "Per i nuovi impianti è esclusa l'esposizione a nord"
KEEP fly "Casale Monferrato and the Po" p2 "la zona di produzione è limitata ai territori collinari posti sulla destra del fiume Po". Point [8.45, 45.13]: OSM gave no result for the label text; Casale Monferrato town centre is at about 8.45 E, 45.13 N (within 1 km). Kept.

## climate (weather)
FIX title "Mild, calm and moderately wet" -> "Temperate and not very windy": p6 "temperato", "poco ventoso"; "moderately wet" had no source word.
KEEP p6 "clima temperato o temperato-caldo (circa 1800 gradi giorno)"
KEEP p6 "poco ventoso"
KEEP p6 "piovosità annuale media intorno ai 700 millimetri"

## soils (ground)
FIX title "Limestone, sandstone and marl" -> "Limy soils on marly rock": X, Y and Z list; p7 "prevalentemente calcarei", "matrici rocciose calcareo-arenaceo.marnose".
KEEP p7 "si sovrappone in buona parte con quella del Barbera d'Asti, al centro del cosiddetto bacino terziario piemontese"
KEEP p7 "prevalentemente calcarei, di media profondità"
FIX p7 "poggianti su matrici rocciose calcareo-arenaceo.marnose": X, Y and Z list, now "rock that mixes limestone with sandstone and marl".
KEEP p7 "alcune piccole aree di paleosuoli o terre rosse a reazione acida"
FIX p7 "(Cassine, Mantovana, Quargnento, Masio) che non sono comprese nel disciplinare del Barbera d'Asti": four-name list and joined clause split; now "around villages such as Cassine and Masio" and a sentence of its own.

## red (rules)
KEEP title p1 "riservata ai vini rossi", "Barbera: minimo 85%"; p5 "periodo di invecchiamento"
KEEP p1 "Barbera: minimo 85%"
KEEP p1 "Freisa, Grignolino e Dolcetto, da soli o congiuntamente: massimo 15%"
KEEP p1 "Vini rossi: Barbera del Monferrato Superiore" (grep: no other wine type; no sparkling, sweet, rosé or fortified)
CUT p5 "rosso rubino tendente al rosso granato con l'invecchiamento": repeats the fact sheet `tastes`.
CUT p5 "intenso e caratteristico, tendente all'etereo": repeats the fact sheet `tastes`.
CUT p5 "asciutto, tranquillo, di corpo, con adeguato invecchiamento più armonico": repeats the fact sheet `tastes`.
KEEP p5 "titolo alcolometrico volumico totale minimo: 13,00% vol", "acidità totale minima: 4,5 g/l" (sentence now follows "Red is the only wine type")
KEEP p5 "minimo 14 mesi ... dal 1° novembre dell'anno di raccolta delle uve"
KEEP p5 "minimo 6 mesi" "(botti di rovere di qualsiasi dimensione)"
KEEP p3 "9000  12,50% vol"
FIX p3 "menzione aggiuntiva “vigna” seguita dal relativo toponimo o nome tradizionale": Italian term now explained ("meaning vineyard").
KEEP p3 "8.000 Kg per ettaro", "titolo alcolometrico volumico minimo naturale di 13,00%"
KEEP p6 "è obbligatoria l'indicazione dell'annata di produzione delle uve"

Label sweep: the only mención is "vigna" (p3, p5, p6), plus the Superiore type itself; both sit in the rules beat. No `label` field. Numbers 1873, 150, 400, 650, 1800, 700, 85, 15, 13.00, 4.5, 14, 6, 9,000, 12.50, 8,000 all confirmed on the cited pages.

## Fact sheet
- why.text: sheet says "Low calcareous clay hills"; p7 says the soils are "prevalentemente calcarei", no clay (clay is only one of the allowed soils on p2). Edit returned.
- famous.styles Superiore: "from 1 November after harvest"; p5 says "dal 1° novembre dell'anno di raccolta" (of the harvest year). Same in effect; not returned as an edit.
