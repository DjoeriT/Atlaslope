# Check: castel-del-monte-rosso-riserva (source castel-del-monte-rosso-riserva-disc, disciplinare DOCG, DM 04.10.2011, mod. DM 07.03.2014)

## Lede
- KEEP p1/p4/p5 "Nero di Troia minimo 65%"; "altopiano ... rocce calcaree"; "modesta profondità ed elevate pietrosità"; "cospicua profondità della falda freatica" (cites p1, p4 added)
- FIX p3 "almeno due anni di cui almeno uno in legno": "one of them" -> "at least one of them"

## Title
- KEEP p3/p5 (standard guide title)

## plateau (place)
- FIX title p4 "L'area “Castel del Monte”, trae l'appellativo dal famoso castello": the area, not the plateau, is named for the castle -> "An area named for a castle"
- KEEP p4 "La parte centrale della Puglia è attraversata dall'altopiano delle Murge"
- FIX p4 "Il termine Murgia deriva ... da “murex”, pietra aguzza formata prevalentemente da rocce calcaree": "Its name" -> "The name Murgia"
- KEEP p4 "Monte Caccia, 680 m ... Torre Disperata 686 m"
- KEEP p4 "nelle Murge Sud Orientali l'altitudine non supera 500 metri"
- KEEP p4 "famoso castello federiciano oggi patrimonio dell'UNESCO"
- FIX p4 "porzione Nord Occidentale del bacino viticolo omogeneo “Murgia Centrale”, uno dei tre": Murgia Centrale explained as one of Puglia's three wine-growing zones; comma-joined sentence split
- KEEP p4-5 "parzialmente inclusa nel Parco Naturale dell'Alta Murgia"
- Flight Castel del Monte: KEEP p4; point [16.2706, 41.0846] matches the castle (OSM pack lookup returned nothing; new lookup not approved in this run)
- Flight Monte Caccia: KEEP p4 caption; point [16.1, 40.98] NOT verified (OSM no result, new lookup not approved). Flag for a manual check.

## climate (weather)
- FIX title p5 "punte minime sono spesso inferiori a 0 °C", "periodo arido": "cold Januaries" (mean 7 °C) -> "Dry summers, January lows below zero"
- KEEP p5 "Il clima è tipicamente sub-mediterraneo. La temperatura media annua varia tra circa 17,5 °C ad Andria (località più bassa e vicina al mare) e 14,4°C"
- KEEP p5 "più fredde ... in gennaio, con valore medio di circa 7 °C; le punte minime sono spesso inferiori a 0 °C"
- FIX p5 "in agosto o in anche in luglio": "sometimes July" (frequency invented) -> "August, or July"
- KEEP p5 "circa 560 mm ... autunno-vernino, in particolare nei mesi di novembre e dicembre"
- FIX p5 "da giugno ad agosto (periodo arido) ... circa 100 mm": added "the dry season" (the page's own word)
- KEEP p5 "precipitazioni nevose si verificano generalmente al di sopra di 500 m"
- KEEP p5 "denominazioni locali dei venti"
- KEEP p5 "“Serratina” da Nord, freddo e secco accompagnato da gelo"
- KEEP p5 "“Favonio” da Sud e Sud-Ovest, caldo e secco"

## stone (ground)
- KEEP title p4 "ricondotta al Cretaceo"; "assenza di acque superficiali"
- FIX p4 "L'emersione della piattaforma murgiana viene ricondotta al Cretaceo": "rose from the sea in the Cretaceous" (sea not on page, hedge dropped) -> "emergence is traced to the Cretaceous"
- FIX p4 "calcari dolomitici e dolomie, ben stratificati, spessi da qualche centimetro ... a pochi metri": dolomite was dropped -> "dolomitic limestone and dolomite"
- FIX p4 "Spesso le rocce si presentano fratturate e mostrano vario livello di “carsificazione”. La struttura fratturata e carsica rende ragione dell'assenza di acque superficiali": hedges "spesso", "vario livello" restored; split into two sentences
- KEEP p5 "calcari compatti dell'unità generale del calcare cretaceo di Bari e di Altamura"
- KEEP p5 "modesta profondità ed elevate pietrosità e rocciosità"
- KEEP p5 "in casi estremi, può anche non risultare idoneo alla messa a coltura"
- KEEP p5 "cospicua profondità della falda freatica ... elevato costo ... connesso all'estrazione idrica"
- FIX p5 "forme d'allevamento espanse ... indirizzate all'incremento delle rese ... generalmente confinate nelle zone più basse e fertili": "trained-up vine forms" mistranslated -> "Spread-out training forms, meant for higher yields"; split sentence

## riserva (rules)
- KEEP title p1/p3 "Nero di Troia minimo 65%"; "almeno due anni"
- KEEP p1 "Castel del Monte Rosso Riserva" (only wine of the DOCG; red per name and p3 "rosso rubino")
- KEEP p1 "Nero di Troia minimo 65%"
- KEEP p1 "massima del 35% ... altri vitigni a bacca nera non aromatici, idonei ... “Murgia Centrale”"
- KEEP p3 "almeno due anni di cui almeno uno in legno"
- KEEP p3 "decorre dal 1° novembre dell'anno di produzione delle uve"
- KEEP p2 "tonnellate 10 per ettaro"
- KEEP p2 "esclusivamente le forme di coltivazione ad alberello e controspalliera"
- KEEP p2 "almeno 4.000 viti per ettaro"
- CUT (tasting paragraph) p3/p6 "rosso rubino al rosso granato", "caratteristico, fine", "di corpo, armonico", "aromi del vitigno prevalente": accurate but repeats the fact sheet's `tastes` word for word; replaced by:
- ADD p3 "titolo alcolometrico volumico totale minimo: 13,00% vol"; "zucchero riduttore residuo non superiore a 10,0 g/l"
- ADD p4 "obbligatoria, su tutti i recipienti, l'indicazione dell'annata"; p3-4 "La menzione "vigna" seguita dal relativo toponimo è consentita" (label sweep: these are the only two mentions; "vendemmia" optional before the vintage)
- Cites: p6 dropped, p4 added

## Wine types
- One wine only: Castel del Monte Rosso Riserva (red, still). Named in the rules beat.

## Fact sheet
- why.text: says "a dry sub-Mediterranean climate"; p5 says "sub-mediterraneo" and "subumido", arid only June to August. Not sure enough to apply.
- grapes.others: empty; p1 allows up to 35% other non-aromatic black grapes but names none. No edit.
- Everything else (styles, climate, soil, altitude, tastes, famous.styles Riserva) matches p1, p3, p4, p5, p6.
