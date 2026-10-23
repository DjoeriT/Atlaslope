# Gavi sentence check

Source: gavi-disc (Disciplinare DOCG "Gavi" o "Cortese di Gavi", last modified DM 06.08.2021). Checked 22 Oct 2026.

## Lede
- KEEP p6 "si incontrano la grande pianura e la montagna"; p2 "vigneti collinari ... calcarea-argillosa-marnosa" (p2 added to cite)
- KEEP p6 "la stagione estiva ... rispetto alla vicina area sub-padana, è più fresca e ventilata"; p6 "vitigno autoctono ... adattamento plurisecolare"

## Place: "A corner where plain meets mountain"
- KEEP title p6 "si incontrano la grande pianura e la montagna"
- KEEP p6 "estremo angolo sud orientale del Piemonte"
- FIX p6 "frontiera fisica e geologica ... i terreni alluvionali e gli affioramenti di epoche remote": dropped "the great plain meets the mountains", which repeated the lede
- FIX p2 "vigneti collinari di giacitura ed orientamento adatti": "slope" now "lie" (giacitura)
- FIX (added) p2 "terreni ... di natura calcarea-argillosa-marnosa": the soil rule was missing; "limy", not "chalky"
- KEEP p2 "esclusione delle giaciture pianeggianti ed umide di fondovalle"
- KEEP p6 "esposizione generale è orientata verso nord-ovest e sud-est"; p7 "la pendenza che aumenta con l'approssimarsi della fascia appenninica"
- KEEP p7 "la primaria fonte di reddito della zona vocata ... gli 11 comuni della Denominazione"
- Flight "Gavi, the heart of the zone": FIX point [8.8417, 44.6867] to [8.8047, 44.6883]. The old point was about 3 km east of the town. The pack's OSM lookup returned nothing, and a new lookup needed approval, so the corrected point is from memory [A]. Confirm it before release.
- Caption FIX: "gives the wine its name" is not in the pliego; now p8 "Elenco dei Comuni: ... Gavi"
- Caption FIX p6 "affitto di vigne da parte del vescovo di Genova a due cittadini gaviesi": now says he rented them to two citizens of Gavi (was "vines here were rented out")
- Missing flight: the Apennines edge (p6, p7; frazione Capanne di Marcarolo, p8) is worth one. Not added because no point was verified. Left for the next run with a working lookup.

## Weather: "Hard winters, breezy summers" (was "Snowy winters, breezy summers")
- FIX title: the snow is "abbastanza frequenti ... quanto più ci si sposta verso l'area appenninica meridionale" (towards the south only), so "Snowy" widened it. Now "Hard winters" (p6 "inverni lunghi e rigidi"). "Breezy" = "ventilata", KEEP
- FIX p6 "Il clima può essere considerato di transizione, moderatamente continentale": restored the hedge "can be called"
- KEEP p6 "inverni lunghi e rigidi, con nevicate abbastanza frequenti ed abbondanti, quanto più ci sposta verso l'area appenninica meridionale"
- FIX p6 "in compenso, rispetto alla vicina area sub-padana, è più fresca e ventilata": "sub-Po area" was unexplained; now "lowlands of the Po plain", with "in return" restored

## Ground: "White earth and red earth"
- KEEP title p7 "dette localmente 'terre bianche', e 'terre rosse'"
- KEEP p6 "tre fasce: le terre rosse, un'alternanza di marne e arenarie, e una terza fascia nella parte meridionale, composta da marne argillose bianche"
- FIX p7 "marne argillose - dette localmente 'terre bianche', e 'terre rosse' caratterizzate da suoli bruni": split into two sentences, and dropped "of the red band", which the page does not tie to these soils
- FIX p7 "l'alternanza ... determinano la ricchezza pedologica che arricchisce di sfumature l'espressione del vitigno cortese": "mix" is now "alternation"
- KEEP p7 "mal si prestano all'utilizzazione intensiva di altre colture agrarie"
- FIX p7 "proprio in virtù di tali caratteristiche sono idonei ad una vitivinicoltura di qualità, con basse rese produttive, conferendo ai vini particolare vigore e complessità": "quality winegrowing" and "particular" restored
- Cite: dropped p2 (nothing in this chapter rests on it now)

## Rules: "One grape, white and sometimes sparkling"
- KEEP title p2 "riservata ai vini bianchi ... frizzante ... spumante"
- KEEP p2 "composti dal solo vitigno Cortese"; p6 "vitigno autoctono di antico provato stanziamento nella zona"
- KEEP p6 "Il primo riferimento a impianti di 'viti tutte di cortese' ... nel 1659"
- FIX p6 "il conte Nuvolone, vicedirettore della Società Agraria di Torino ... fa buon vino, è abbondante e si conserva": named the count and his society; "keeps well" is now "keeps" ("well" was not on the page)
- KEEP p1-p2 "riservata ai vini bianchi"; p2 the five types: tranquillo, frizzante, spumante, Riserva, Riserva Spumante metodo classico. Grep: no other type, no generoso or sweet wine
- CUT "Still Gavi is straw yellow, delicate, dry and fresh": it repeated the fact sheet `tastes`
- KEEP p4 "spuma: fine ed evanescente" (frizzante)
- FIX (added) p5 "spuma: fine e persistente; sapore: da brut nature a extra dry" (spumante and Riserva Spumante)
- FIX p5 "In relazione all'eventuale conservazione in recipienti di legno ... può rivelare sentore di legno": now conditional ("if kept in wood ... may show a hint")
- FIX p3 "non deve essere superiore a 9,5 tonnellate ... 6,50 tonnellate": "standard wines" is now "still and fizzy wines"; split into two sentences
- FIX p4 "minimo di 6 mesi per la fermentazione in recipienti chiusi ... (metodo charmat) e minimo di 9 mesi per la fermentazione in bottiglia (metodo classico)": charmat and classic method explained
- KEEP p4 "un anno di invecchiamento, di cui sei mesi di affinamento in bottiglia"
- KEEP p4 "due anni di invecchiamento ... di cui diciotto mesi di permanenza sui lieviti in bottiglia"

## Label
- FIX Vigna. p6 "Nella designazione dei vini ... di cui all'art.1 può essere utilizzata la menzione 'vigna'" allows it on every type, not only three. The yield and alcohol rules are kept for the three types p3 names ("8,50 tonnellate"; "10,5 % vol"). Added p6 "caratteri di dimensione inferiore o uguale al 50%"
- FIX Del comune di. KEEP p5 "Per le tipologie 'tranquillo', 'frizzante', 'spumante' ... 'del comune di ...'"; p6 "inferiore o uguale al 50%". Added the translation and p6 "Per le tipologie 'Riserva' e 'Riserva Spumante metodo classico' è vietato l'uso di indicazioni geografiche inerenti comuni"
- FIX (added) Data di sboccatura: p6 "Per la tipologia 'Spumante metodo classico' deve essere indicata in etichetta la data di sboccatura"; p6 "Riserva Spumante metodo classico deve essere riportata ... la data di sboccatura e l'indicazione del millesimo"
- Sweep: the pliego names no other mention. The vintage required on still wine (p6 item 6) is a plain rule, not a term, and is left out. Riserva and the spumante styles stay in the rules beat only.

## Fact sheet
- styles.text: the sheet says "Riserva metodo classico" and "Dry white Gavi". The pliego (p2) says "Riserva Spumante metodo classico", and the spumante runs "da brut nature a extra dry" (p5), so not every wine is dry.
- climate.text: the sheet says "Transitional ... frequent snow". The pliego (p6) says "può essere considerato di transizione" and "nevicate abbastanza frequenti ed abbondanti".
- No other disagreements: the sheet's why, grapes, soil, tastes and famous.styles match p2 to p7. styles.kinds (white, sparkling) matches p2.
