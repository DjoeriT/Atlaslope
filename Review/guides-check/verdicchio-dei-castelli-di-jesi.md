# Check: verdicchio-dei-castelli-di-jesi
Source: verdicchio-dei-castelli-di-jesi-disc (disciplinare DOC, last change DM 23.09.2025 / DM 18.11.2025, EU C/2026/1160)

## Title
KEEP p8 "riflessi verdolini", "retrogusto di mandorla amara": the guide gives the why it promises.

## Lede
FIX p7 "colline poste attorno alla valle Esina", "alto contenuto in argille, alta percentuale di carbonato di calcio": "hills in the Esino valley" -> "hills around the Esino valley".
KEEP p8 "giallo paglierino con evidenti riflessi verdolini - da qui il nome Verdicchio", "retrogusto di mandorla amara".

## valley (place), title "The castles around Jesi"
KEEP title p6 "storicamente Castelli perché gravitanti nella politica e nell'economia di Jesi".
KEEP p6 "in parte del bacino geografico del fiume Esino, nei territori di 22 Comuni della Provincia di Ancona e 2 di Macerata".
KEEP p6 "storicamente Castelli perché gravitanti nella politica e nell'economia di Jesi".
KEEP p6 "Jesi che nel 1194 ha dato i natali a Federico II di Svevia".
KEEP p7 "L'area dista circa Km 20 dal mare e si sviluppa nelle colline poste attorno alla valle Esina".
KEEP p7 "in Jesi una quota di mt 96 s.l.m. fino ai 630 mt di Cingoli".
Flight Jesi: KEEP p6/p7. Point [13.2425, 43.5226] is Jesi town (pack OSM gave no result; within about 1 km of the centre).
Flight Cingoli: KEEP p7 "fino ai 630 mt di Cingoli". Point is Cingoli town.

## climate (weather), title "Sea, breezes and mountain shelter"
KEEP title p7 "influenza del mare ... delle brezze ... del riparo offerto dalle montagne".
FIX p7 "prodotto dell'influenza del mare, del sole, delle brezze, della piovosità e del riparo offerto dalle montagne che superano anche i 2000 mt": five-item list split into two sentences.
KEEP p7 "Ciò produce un clima temperato".
KEEP p7 "Le precipitazioni medie annue sono di 800 mm", "temperature medie inferiori ai 14 °C".
KEEP p7 "La temperatura media massima nella valle, raggiunge nei mesi di luglio-agosto i 30c".
KEEP p7 "sono frequenti le gelate invernali e primaverili ma non intaccano l'attività vegetativa in quanto non ancora iniziata".

## soils (ground), title "Clay, lime and altitude"
KEEP title p7 "argille", "carbonato di calcio"; p9 "risentono dell'altitudine".
KEEP p7 "alto contenuto in argille, alta percentuale di carbonato di calcio".
FIX p7 "scarsa permeabilità, erodibilità": "erode easily" -> "are prone to erosion".
FIX p7 "nella regione una differenziazione dei suoli ... con predominanza di dorsali calcaree": "Limestone ridges dominate the region's soils" -> "Across the Marche, limy ridges dominate the soils" (calcaree = limy; the page means the Marche).
KEEP p7 "La parte pianeggiante, di origine alluvionale, presenta suoli con materiali quasi sempre calcarei e pietrosi".
KEEP p7 "per il 70% compresa tra mt 80 e 280 s.l.m.. Il più alto vigneto è a quota 750 mt".
KEEP p9 "il vitigno posto tra i 300/500 mt s.l.m. presenta il miglior sviluppo e le migliori performance qualitative".
FIX p9 "segno che l'esposizione e la ventilazione influiscono sul prodotto uve alquanto significativamente": "clearly affect" -> "a sign that ... affect the grapes quite markedly" (the page's inference kept as inference).
KEEP p9 "la potatura che deve essere lunga per contenere un alto numero di gemme ... in quanto spesso le gemme prossimali ai tralci non germogliano".

## wines (rules)
FIX title p2: "One grape, four ways" has no source count (Art. 1 lists seven types) -> "One grape, from still to sweet".
KEEP p2 "uve del vitigno Verdicchio ... per un minimo dell'85%".
FIX p2 "altri vitigni a bacca bianca ... idonei alla coltivazione nella Regione Marche ... per un massimo del 15%": "grown in the Marche" -> "suited to growing in the Marche".
FIX p4/p8: the colour and aroma sentences repeated the fact sheet's tastes and the lede, and gave p8's green glints to the still wine whose p4 colour is only "giallo paglierino tenue". Replaced by the still wine's rule, p4 "sapore: asciutto, armonico, con retrogusto gradevolmente amarognolo".
FIX p8 "nella zona classica nella vallata sinistra del fiume Esino si percepiscono notevoli sensazioni minerali": "left bank" -> "left side of the Esino valley".
KEEP p8 "per passare ad una maggiore sapidità dei vini prodotti nella vallata opposta".
KEEP p3 "zona originaria più antica ... con l'esclusione dei territori posti alla sinistra del Fiume Misa e dei territori appartenenti ai comuni di Ostra e di Senigallia".
KEEP p3 "Superiore t. 11" against "t. 14"; p5 "titolo alcolometrico volumico totale minimo: 12,00% vol".
FIX (missing type) p2 "Classico Superiore (categoria Vino)", p3 "Classico Superiore t. 11": added "Classico Superiore meets both rules."
KEEP p4 "La tipologia Spumante può essere elaborata sia con il metodo Charmat che con il metodo Classico".
KEEP p4 "la menzione Riserva è riservata ai vini elaborati esclusivamente con il metodo classico ... non inferiore ai trentasei mesi".
FIX p3 "appassimento", p5 "sapore: da amabile a dolce", "15,00% vol": "a sweet wine" -> "ranges from medium-sweet to sweet". Not fortified (category Vino, p2).
KEEP p4 "L'immissione al consumo della tipologia Passito non può avvenire prima del 1° dicembre dell'anno successivo a quello di vendemmia".
Flight Cupramontana: FIX p7 "la centenaria sagra dell'uva di Cupramontana" means a century old, not "centuries old"; caption rewritten. Point [13.0959, 43.4333] is about 2 km from the town centre, within tolerance.
Wine type sweep (p2): Vino, Spumante, Spumante Riserva, Passito, Superiore, Classico, Classico Superiore: all named now. Label: the guide has no label field; "vigna" (p6) points to "normativa vigente" and would be cut.

## Fact sheet
- famous.styles[0] Classico: sheet leaves out Ostra and Senigallia; p3 also excludes "i territori appartenenti ai comuni di Ostra e di Senigallia".
- Otherwise consistent with the pliego (grapes.others empty is fair: p2 names no other variety).
