# val-di-cornia-rosso: sentence check
Source: val-di-cornia-rosso-disc (Disciplinare DOCG "Val di Cornia Rosso", DM 18.11.2011, mod. DM 07.03.2014). Checked 23 Oct 2026.

## Lede
FIX p5 "nel periodo primaverile favoriscono con la loro mitezza ... Le temperature estive e l'insolazione ... garantiscono sempre una ottima maturazione ... per tutte le varietà": "warm summers rarely bring frost" invented summer warmth and a frost link; "Tuscan coast" not said; the rain line repeated the body. Now: mild springs and summer sun ripen every grape.
FIX p6 "il colore è rosso rubino intenso ... Il sapore è caldo ed asciutto": "intense" was put on the wine as a whole; now warm, dry, intense ruby colour.

## Place
KEEP p1-2 "ricade nelle province di Livorno e Pisa"
KEEP p2 "tutto il territorio amministrativo dei comuni di Suvereto e Sassetta"
KEEP p2 "in provincia di Pisa: tutto il territorio amministrativo del comune di Monteverdi Marittimo"
KEEP p2 "parte del territorio amministrativo dei comuni di Piombino, San Vincenzo e Campiglia Marittima"
KEEP p2 "Detta zona si suddivide in due parti, zona sud-ovest e zona nord-est"
FIX p2 "Partendo da Piombino ... raggiunge il mare": the boundary starts and ends there, not the part.
FIX p2 "segue verso nord la ferrovia ... segue il corso di quest'ultimo [fiume Cornia]": the boundary follows the river only for a stretch.
FIX title "Two patches around the Cornia" -> "Two parts in the Cornia valley" ("due parti").
Flight "The Cornia valley near Venturina" [10.6, 43.03]: within about 1 km of Venturina (no OSM result in pack). FIX caption: river followed for a stretch, p2.
Flight "Populonia" [10.495, 42.989]: matches Populonia. KEEP p5 "in Populonia c'era una vite talmente grande da averci scolpito il volto di Giove".

## Weather
KEEP p5 "nel periodo primaverile favoriscono con la loro mitezza un equilibrato sviluppo vegetativo, una ottima fioritura ed allegagione"
KEEP p5 "Le temperature estive e l'insolazione ... garantiscono sempre una ottima maturazione ... per tutte le varietà di vite coltivate"
KEEP p5 "gelate primaverili e siccità prolungate ricadono solo raramente"
KEEP p5 "La temperatura media si attesta intorno ai 14 °"
KEEP p5 "la piovosità annuale non supera i 650 mm ... Marzo - Aprile ... Ottobre - Novembre"
KEEP p5 "Le zone più interne risultano avere anche una discreta escursione termica"
KEEP p5 "che favorisce la naturale esaltazione dei profumi e degli aromi del vino"
FIX title "Gentle springs, steady ripening" -> "Mild springs, good ripening" ("mitezza", "ottima maturazione").

## Ground
KEEP p4-5 "calcari cavernosi e calcari neri stratificati"
FIX p5 "estesi eventi intrusivi di rocce magmatiche": "pushed into it" (into the limestone) not said.
KEEP p5 "associati a mineralizzazioni a skarne 'solfuri metallici'" (now "metal sulphide ores")
KEEP p5 "buona parte della zona è rappresentata da terreni alluvionali ... profondi e freschi"
KEEP p5 "terreni alluvionali leggeri sabbio- limosi"
KEEP p5 "terreni alluvionali pesanti limosi e argillosi"
FIX p5 "medio impasto, dal medio impasto sabbioso e dal medio impasto argilloso": the three loam fractions now named.
KEEP p5 "La reazione del terreno è essenzialmente subalcalina"
KEEP p5 "sostanza organica è generalmente al di sotto della media come la dotazione di azoto totale"
KEEP p5 "Buona invece la dotazione di fosforo assimilabile e talvolta molto elevata quella di potassio"
FIX title "Limestone below, fresh alluvium above" -> "Limestone rock, deep alluvial soils" (no layering stated).

## Rules
KEEP p1/p6 "tipologie base e riserva" (red only)
KEEP p1 "Sangiovese: minimo il 40%"
KEEP p1 "Cabernet Sauvignon e Merlot: da soli o congiuntamente, fino ad un massimo del 60%"
KEEP p1 "uve a bacca nera ... idonei alla coltivazione per la regione Toscana, fino ad un massimo del 20% ad esclusione del vitigno Aleatico"
FIX p4 "colore: rosso rubino di buona intensità, brillante, tendente al granato; odore: vinoso, delicato; sapore: asciutto, vellutato, armonico, di buon corpo, con eventuale sentore di legno": the paragraph repeated the fact sheet's tastes (p6) and gave "some wood" to all wines (p6: wood only "nei prodotti invecchiati"). Now the art. 6 release rule.
CUT p6 "modesto tenore di acidità": part of the repeated tasting text; it stays in the fact sheet.
KEEP p4 "È obbligatoria l'indicazione dell'annata"
KEEP p3 "non può essere immesso al consumo prima del 1° maggio del secondo anno successivo"
KEEP p3 "«riserva» non può essere immesso al consumo prima del 1° gennaio del terzo anno"
FIX p3 "minimo di diciotto mesi in contenitori di legno e di sei mesi in bottiglia": "at least" added.
KEEP p4 "13,00% vol. la «riserva»"
FIX p4 "menzione 'vigna' ... seguita dal relativo toponimo ... superficie sia distintamente specificata nell'albo dei vigneti ... recipienti separati": register condition added.
Sweep: only types base and riserva (p1, p6); only menzioni riserva and vigna; "extra", "fine", "scelto", "selezionato" banned (p4). Guide has no label field.

## Fact sheet
- tastes.text: "with spice and wood notes" for all wines; p6 "sentore di legno nei prodotti invecchiati". Edit returned (sure).
- famous.styles Riserva: "18 months in wood, 6 in bottle"; p3 "minimo di diciotto mesi". Edit returned (sure).
- why.text: "Tuscan coast" not said, and soils "giving" ripening; p5 ties ripening to spring mildness and summer sun. Edit returned (not sure).
