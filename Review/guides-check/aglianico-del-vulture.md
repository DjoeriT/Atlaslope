# aglianico-del-vulture: sentence check

Source: aglianico-del-vulture-disc (disciplinare DOC «Aglianico del Vulture», last change D.M. 07.03.2014, text with art. 10 per Reg. UE 34/2019). Checked 23 Oct 2026.

## Lede
- FIX p3/p4 "pendici del Monte Vulture, vulcano spento" "tufi ... riserva idrica nei siccitosi mesi estivi": first sentence kept.
- FIX p6 "salti termici (giorno/notte) estivi dovuti alle correnti d'aria richiamate dal massiccio ... maturare lentamente e completamente (sovente fino al mese di novembre)": was "Cool air slows the ripening, grapes often picked as late as November"; now day-night swings from drawn-in air let grapes ripen slowly, often into November (page speaks of ripening, not picking).

## Place (volcano)
- FIX title p3 "vulcano spento": "sleeping volcano" -> "extinct volcano".
- KEEP p3 "parte nord della Regione Basilicata, in Provincia di Potenza"
- KEEP p3 "territorio di alta e media collina, situato sulle pendici del Monte Vulture, vulcano spento, ma attivo fino al Pleistocene superiore"
- KEEP p3 "vetta maggiore a 1.327 mt s.l.m."
- KEEP p3 "degrada progressivamente verso ovest lungo il fiume Ofanto e verso Est verso la piana della Puglia"
- KEEP p3 "azione eruttiva originatasi a partire da circa 800.000 anni fa ... sbarramenti di fiumi, creazione di laghi poi prosciugatisi"
- KEEP p3 "rilievi difformi e diffusi sull'intero territorio"
- Flight Monte Vulture: KEEP p3; point [15.62, 40.95] within ~1.5 km of the summit (pack lookup returned nothing; a new Nominatim call was not approved in this run).
- Flight Ofanto valley: KEEP p3 caption. Point [15.75, 41.05] not verified (OSM no result, new lookup not approved); it may sit a few km south of the river. Owner or a later run should confirm.
- Flight Rionero in Vulture: point [15.675, 40.925] matches the town.

## Weather (climate)
- KEEP title p4 "decisamente arido nei mesi di luglio ed agosto ... subumido e/o umido nei mesi di ottobre e novembre ... vendemmiata"
- FIX p4 "decisamente arido ... temperato ... subumido e/o umido": one three-part list split into three sentences.
- KEEP p4 "la media annua risulta essere di 650-750 mm. concentrati prevalentemente nel periodo autunno vernino"
- FIX p4 "Le precipitazioni annue variano da un minimo di 650 mm ad un massimo di 1.300 mm": was "In the whole area it ranges"; the page gives a yearly range, not a spatial one.
- FIX p6 "scarse o addirittura nulle piogge estive (<100 mm)": was "often under 100 mm"; now "scarce or even nil, under 100 mm".
- KEEP p4 "temperature medie di 25 °C, ma con punte di 35 gradi per effetto di venti africani ... forte effetto disidratante sugli apparati fogliari"
- KEEP p4/p6 "correnti d'aria provenienti dalle coste orientali ed occidentali e per fenomeni di brezza", "richiamate dal massiccio del Vulture"
- FIX p4 "abbassamento sensibile delle temperature durante il periodo estivo con importanti riflessi sulla condizione vegetativa delle piante e la produzione fenolica sulle bucce": "affects the phenolics" -> "important effects on the vines and the phenolics in the skins".
- FIX p6 "sensibili salti termici (giorno/notte) estivi": added "In summer".
- KEEP p6 "maturare lentamente e completamente (sovente fino al mese di novembre)"
- KEEP p4 "Frequenti le gelate nel periodo primaverile che di norma non intaccano ... per il suo naturale ritardo nel germogliamento"
- FIX p4 "viene di norma vendemmiata", "(ottobre-novembre) quando la piovosità è già alta": added "usually".
- KEEP p4 "l'umidità diventa fattore di rischio sanitario e la neve può rendere difficile la raccolta"
- FIX p4 "solo una meticolosa preparazione dei vigneti consente all'uva di poter resistere al lungo ciclo vegetativo": "careful vineyard" -> "meticulous care of the vineyards ... long growing cycle".

## Ground (tuff)
- KEEP title p4/p5 "tufo che svolge un'indispensabile azione di riserva idrica estiva"
- FIX p3 "alternanza di sottosuoli di diversa origine quali tufi vulcanici e tufi di deposito arenario": "layers" -> "subsoils", "sandstone tuff" -> "tuff from sandstone deposits".
- KEEP p4 "Tufi che ... svolgono un'importante azione di riserva idrica nei siccitosi mesi estivi"
- KEEP p4 "dal tipo sabbioso, sabbioso pozzolanico al limoso-argilloso"
- FIX p4 "abbondanti formazioni colloidali sicuro presupposto di fertilità": "sure sign" -> "sure basis" (presupposto is a precondition).
- KEEP p2/p5 "terreni collinari di origine prevalentemente vulcanica", "strati attivi abbastanza profondi che permettono risultati produttivi più che soddisfacenti"
- KEEP p4 "tra i 200 e i 700 m s.l.m. con pendenza variabile e l'esposizione generale è orientata verso est e sud-est"
- KEEP p5 "esclusi i terreni ubicati a quote troppo basse o troppo alte non adatti ad una viticoltura di qualità"

## Rules (wines)
- KEEP title p3 "giustamente tannico", "Spumante ... rosso rubino tendente al granato"
- KEEP p1 "Aglianico del Vulture N. e/o Aglianico N."
- KEEP p1/p4 "«Aglianico del Vulture»; «Aglianico del Vulture» spumante", "vini tranquilli ma strutturati"
- KEEP p3 "rosso rubino", "tipico, gradevole ed intenso", "dal secco all'abboccato, giustamente tannico e sapido ... non deve superare i 10 g per litro", "12,50% vol"
- KEEP p2 "immesso al consumo a partire dal 1° settembre dell'anno successivo"
- CUT p5 "buona acidità ... aromi prevalentemente fruttati (bacche e drupe), ma anche floreali ... accenno di amaro ... possibile residua astringenza ... ottima struttura ... grande longevità": the whole paragraph repeats the fact sheet's `tastes`, and "gives them great longevity" overstated the page's "contribuiscono ... ad evidenziare".
- KEEP p2 "esclusivamente per rifermentazione naturale in bottiglia ... non deve essere inferiore a mesi 9"
- KEEP p3 "rosso rubino tendente al granato; con l'evoluzione puo' assumere riflessi aranciati"
- FIX p3 "spuma: fine e persistente; odore: fruttato ... da brut a extra dry": three-part list split.
- KEEP p5 "ha poggiato molto della sua economia enologica sulla produzione degli spumanti"
- FIX p5 "Rionero, Ripacandiada, Rapolla e Barile commercializzavano fuori regione grandi quantità di vino spumante destinato a banchetti nuziali, feste patronali e festività religiose": four-name list cut to "such as Rionero and Barile"; "weddings and feast days" -> "wedding banquets and religious feasts".
- KEEP p5 "famose erano le richieste provenienti dal Vaticano ... con cadenza annuale"
- FIX p5 "raccolte a novembre, coma da tradizione consolidata ... grado zuccherino talmente elevato da non riuscire a svolgersi in alcol durante la prima fermentazione ... responsabile della rifermentazione in bottiglia": added "By tradition".
- FIX flight Rionero caption p5: dropped "on the slopes of Monte Vulture" (p5 does not place the town); now "sold large amounts of sparkling wine outside the region".
- Wine types: the pliego protects only the two types of art. 1; both are named. Spumante is natural refermentation, not fortified.

## Label
- KEEP p3 "l'indicazione in etichetta dell'annata di produzione dell'uva, è obbligatoria, ad eccezione della tipologia spumante"
- KEEP p3/p8 "unità geografiche corrispondenti a frazioni, comuni o zone amministrative definite ... riportate in allegato"; Allegato A lists them, so the term has its own rule here.
- Sweep: art. 7.1 bans qualifiers such as «extra», «fine», «scelto», «selezionato»; no mención to add. "Superiore" appears on p4 only as the name of another wine, not a term of this DOC. Spumante stays out of `label` (famous style).

## Fact sheet
- climate.text: sheet says "Vulture breezes cool the nights"; p4 says air currents and hill breezes lower summer temperatures, p6 speaks of summer day/night swings. Nights are not named.
- All other fields agree with the pliego (grapes p1, styles p1/p3, soil p3/p4, altitude p2/p4, tastes p3/p5, famous p2/p3).
