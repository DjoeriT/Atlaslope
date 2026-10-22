# Sentence check: nizza (source nizza-disc, disciplinare DOCG "Nizza", Reg. UE 2019/953, mod. DM 15.03.2021)

## Title
KEEP p6-p7 "esprima le sue migliori caratteristiche" (generic "why it tastes" title)

## Lede
KEEP p6 "varietà molto esigente in termini di luce e temperatura ... al “Nizza” sono infatti riservate esclusivamente le esposizioni migliori"
FIX p7 "rosso rubino intenso ... Il corpo ... è senz'altro pronunciato, consentendo a questi vini una lunga vita in bottiglia": "deep ruby, plenty of body, made to live long" -> "intense ruby, pronounced body, a long life in bottle"

## hills (place)
KEEP title p6 "18 comuni ... limitrofi al comune di Nizza"; p7 "importante sede di mercato del vino"
KEEP p6 "comprende 18 comuni in Provincia di Asti, limitrofi al comune di Nizza"
KEEP p6 "Nizza zona tradizionale, di elezione per la coltivazione del vitigno Barbera"
KEEP p6 "totalmente collinare, con pendenze ... spesso molto rilevanti"
KEEP p2 "Sono esclusi i terreni di fondovalle"
FIX p2 "esclusivamente collinare con esposizione da +45° a +315°": dropped "mostly", explained that it rules out the north (next line p2 "versanti nord compresi fra -45° e +45°")
KEEP p2 "le sommità collinari e i versanti nord ... pendenze non superiori all'8%"
FIX p8 "Nizza ed il suo circondario, compreso tra i fiumi Tanaro, Belbo, ed il torrente Nizza": "the area" -> "Nizza and its surroundings" (the page does not say the whole DOCG)
ADD p8 "sembra l'area dove il vigneto di Barbera è consolidato da più tempo in purezza varietale" (hedge "seems" kept)
KEEP p7 "Nizza Monferrato ... è stata da sempre un'importante sede di mercato del vino in Piemonte"
FIX p7 "una lettera del 1609 ... appositi incaricati per assaggiare ... lo vino Barbera ... e di pagargli al giusto prezzo ... era giunta fino alla Corte Ducale di Mantova": the page says the fame reached Mantua, it does not say the envoys came for that court; split into two sentences
Fly Nizza Monferrato: KEEP p6/p7 "nucleo storico della produzione di vino Barbera"; point [8.3556, 44.7731] matches the town (OSM had no result, lookup not approved this run; town at about 44°46'N 8°21'E)

## climate (weather)
KEEP title p6 "inverni freddi ... estati calde e secche"
KEEP p6 "tipologia temperato-continentale"
FIX p6 "inverni freddi e poco piovosi (mentre non sono rare le precipitazioni nevose)": "cold and dry" -> "cold with little rain"
KEEP p6 "primavere e autunni ricchi di precipitazioni"
KEEP p6 "estati calde e secche, con scarse piogge di breve durata (principalmente a carattere temporalesco)"
FIX p6 "parzialmente mitigate dalle numerose colline": hedge "partly" restored
KEEP p6 "salendo di quota, le minime invernali risultano essere meno rigide rispetto ai fondovalle"
KEEP p6 "l'afa e le temperature estive, grazie alla maggiore ventilazione, sono sicuramente più miti"
FIX p6 "Per le forti pendenze e per le altitudini collinari è fondamentale quindi l'esposizione ... importante soprattutto per il vitigno Barbera": the page gives steep slopes as the reason aspect matters, not Barbera alone; rewritten
KEEP p6 "al “Nizza” sono infatti riservate esclusivamente le esposizioni migliori"
KEEP p6 "fascia altimetrica compresa tra i 150 e i 350 m s.l.m. ... alcuni vigneti ... dai 350 ai 500 m"; split into two sentences; cite p2 dropped (not used)

## soils (ground)
FIX title: "Marl, sandstone and good drainage" was an X, Y and Z list -> "Marl and sandstone on draining slopes" (p6 "garantisce lo smaltimento delle acque")
KEEP p6 "appartengono geologicamente al bacino pliocenico astigiano"
FIX p6 "origine per lo più sedimentaria con formazioni prevalentemente marnoso arenacee": "layers of" (not on page) -> "formed mainly of"
FIX p2 "terreni caratterizzati da marne argilloso – sabbiose e arenarie stratificate": line about the source ("the rules name") -> "Vineyards must be on ..."
KEEP p6 "elevato contenuto in carbonato di calcio e con sostanza organica generalmente ridotta"
KEEP p6 "elementi nutritivi ... in quantità contenuta, ma in equilibrio ideale tra di loro"
KEEP p6 "In quasi tutti i terreni ... la profondità del suolo e la profondità utile alle radici sono elevate"
KEEP p6 "Solo nella zona caratterizzata da suoli sabbioso-arenacei ... substrato fortemente cementato"
KEEP p6 "garantisce lo smaltimento delle acque anche nei terreni meno permeabili (suoli limoso-marnosi) evitando cosi il ristagno idrico"

## barbera (rules)
FIX title: "long in wood" (minimum is 6 or 12 months) -> "aged in wood" p4 "di cui in legno"
KEEP p1 "riservata ai vini rossi"; "vitigno Barbera al 100%"
FIX p7 "porterebbero a snaturare l'identità tradizionale": "water down" -> "distort"
KEEP p3 "non è consentita alcuna forma di arricchimento per l'aumento della gradazione" (cite p3 added to chapter)
FIX tasting paragraph: it repeated the fact sheet's tastes (colour, nose, "dry, full-bodied and round"); cut to what the wood adds, p7 "Grazie all'affinamento acquista complessità sviluppando le note balsamiche, di cacao, liquirizia e vaniglia in varie combinazioni a seconda delle dimensioni delle botti, dei legni e delle tostature"; "wood" added from the same words
KEEP p7 "l'acidità, tipica delle uve Barbera, che comunque si attenua dopo l'avvenuta fermentazione malolattica e l'affinamento"
KEEP p7 "Il corpo ... è senz'altro pronunciato, consentendo a questi vini una lunga vita in bottiglia"
FIX p4 ageing table: added "dal 1° gennaio dell'anno successivo alla vendemmia"; 18/6 and 30/12 months KEEP
KEEP p5 "menzione “vigna” seguita dal corrispondente toponimo"
FIX p2/p5/p8: X, Y and Z list split; "le uve provengano totalmente dallo stesso vigneto" (p5); yield 6,3 t vs 7 t (p2), lower for vines under seven years (p2 "vigneto, di età inferiore ai sette anni ... resa ... ulteriormente ridotta"); "titolo alcolometrico volumico minimo naturale di 13,50% vol." is the grapes' potential alcohol (p2); "esclusivamente l'uso del tappo di sughero" (p5)
Fly Mombaruzzo: KEEP p7 "Alcune tra le più antiche cantine cooperative d'Italia ... quella di Mombaruzzo, pluricentenaria"; point [8.4375, 44.74] was about 3.5 km south of the village, moved to [8.45, 44.7667] (village at about 44°46'N 8°27'E; OSM had no result and the lookup was not approved this run)

Wine types: p1 protects only red Nizza, also Riserva; p5 "vigna". All named. No label terms field.

## Fact sheet
- why.text: sheet "long oak ageing"; p4 asks wood "botti di qualsiasi dimensione" for 6 or 12 months, oak not named (p7 history names Slavonian oak and chestnut). Edit to "ageing in wood".
- tastes.text: sheet "fresh acidity"; p7 says Barbera's typical acidity "si attenua dopo ... fermentazione malolattica e l'affinamento", "fresh" not on the page.
- climate.text: sheet "cold, dry winters with some snow"; p6 "inverni freddi e poco piovosi (mentre non sono rare le precipitazioni nevose)", and the hills mitigate only "parzialmente".
