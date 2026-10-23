# Check: vernaccia-di-san-gimignano

Source: vernaccia-di-san-gimignano-disc (disciplinare DOCG, as modified DM 15.10.2024, rectified DM 30.10.2024, GUUE C/2025/1146). Checked 23 Oct 2026.

## Lede
- FIX p5 "suoli sono di origine pliocenica, risalenti a 6,8- 1,8 milioni di anni fa" / "depositi pliocenici marini": "one hill town" -> "one hilly commune" ("territorio collinare", the commune not the town).
- FIX p5-6 "La diversa combinazione percentuale tra sabbia, argilla, sostanza organica e scheletro ... determinante ... per l'esaltazione della sapidità, freschezza": lede dropped organic matter and listed "X, Y and Z"; now "each soil's own mix" brings out sapidity and freshness, detail left to the soils beat.

## Place
- KEEP title p5 "a metà strada tra la costa tirrenica e la dorsale appenninica".
- KEEP p5 "ricade interamente all'interno del Comune di San Gimignano, collocato nella parte nord-ovest della provincia di Siena".
- KEEP p5 "nel cuore della Toscana, a metà strada tra la costa tirrenica e la dorsale appenninica".
- KEEP p5 "territorio collinare collocato tra i 67 ed i 629 m s.l.m.".
- KEEP p6 "altitudine dei vigneti è compresa tra i 70 ed i 500 m s.l.m" + p2 "altitudine non superiore ai 500 metri s.l.m.".
- Flight San Gimignano [11.043, 43.468]: OSM lookup gave no result; point matches the town centre (about 43.468 N, 11.043 E), kept.
- FIX caption p7 "la cui storia si fonde con quella della città e del territorio di San Gimignano": "hill town" -> "town" (no page calls the town a hilltop).
- Missing flights: pliego names the Tyrrhenian coast and the Apennine ridge only as locators, no feature described; none added.

## Weather
- FIX title p6 "estati piuttosto siccitose ... picco in autunno": "Dry summers, rain in autumn" dropped the hedge and the second rain period; now "Fairly dry summers, rain peaking in autumn".
- KEEP p6 "clima sub-mediterraneo con estati piuttosto siccitose, inverni piuttosto freddi".
- KEEP p6 "piovosità concentrate in due periodi: tardo autunno-inizio inverno e fine inverno-inizio primavera".
- FIX p6 "si aggirano attorno ai 700 mm, mediamente distribuite in 83 giorni": added "on average".
- FIX p6 "un minimo relativo in estate e un picco in autunno": "Summer is the driest season" -> "Rain dips in summer" (relative low).
- FIX p6 "La zona beneficia in tutti i periodi dell'anno di una buona ventilazione. Rari gli episodi di nebbia.": "The hills" -> "The area".

## Ground
- KEEP title p5 "depositi pliocenici marini".
- KEEP p5 "formatisi sui depositi pliocenici marini".
- KEEP p5 "sabbie gialle (tufo) ed argille gialle e grigie".
- KEEP p5 "spesso stratificate su argille più compatte e presenti in profondità".
- KEEP p5 "fortemente caratterizzati dalla presenza di sabbia dotati di scheletro e scisti argillose".
- FIX p5 "crea condizioni favorevoli per la penetrazione delle radici": "makes it easy" -> "favours" (hedge kept).
- FIX p5 "generalmente dotati di sostanza organica grazie anche alle ripetute lavorazioni e avvicendamenti colturali": "rich in" -> "hold" (page says endowed, not rich).
- FIX p5-6 "combinazione percentuale tra sabbia, argilla, sostanza organica e scheletro ... elemento pedologico determinante ... sapidità, freschezza e capacità di invecchiamento, caratteristiche che accomunano e contestualmente distinguono le singole Vernacce": split the two four- and three-item lists into short lines; added the page's "shared yet set apart" point.

## Rules
- FIX title p7 "uno dei pochissimi vini bianchi italiani prodotti anche nella tipologia riserva": "A white that also makes a Riserva" -> "A white also made as a Riserva" (a wine does not make a Riserva).
- KEEP p1 "riservata al vino bianco" + p4 "Sapore: asciutto" + p1 "vitigno Vernaccia di San Gimignano".
- KEEP p1 "altri vitigni a bacca bianca non aromatici idonei alla coltivazione per la Regione Toscana, fino ad un massimo del 15%".
- KEEP p1 "Sauvignon blanc e Riesling ... da soli o congiuntamente, del 10%".
- CUT tasting paragraph (p4 colour, aroma, taste): KEEP-true on p4 but it repeats the fact sheet `tastes`; replaced by the change with age, which the sheet lacks: FIX p4 "rilessi dorati che sono più accentuati con l'invecchiamento" / "iniziali note fruttate; possono poi, con l'affinamento e l'invecchiamento, evolvere note minerali".
- KEEP p7 "uno dei pochissimi vini bianchi italiani prodotti anche nella tipologia riserva".
- KEEP p7 "maggiormente strutturata".
- FIX p3 "affinamento di almeno 11 mesi a decorrere dal 1° gennaio dell'anno successivo ... Prima dell'immissione al consumo ... tre mesi in bottiglia" + p4 "riserva 12,50% vol": "then 3 months in bottle" -> "plus 3 months in bottle before release" (page fixes the bottle time before sale, not its order).
- FIX p5 "menzione “vigna” a condizione che sia seguita dal relativo toponimo": explained "vigna" (vineyard). KEEP p5 "vinificazione e la conservazione del vino avvengano in recipienti separati".
- FIX (added, label sweep) p5 "deve figurare l'indicazione dell'annata" + p4 "E' obbligatorio riportare in etichetta il termine geografico “Toscana”": vintage and "Toscana" were missing.
- FIX p7 "uno dei vini più antichi d'Italia": "The wine has a long record" -> "one of Italy's oldest wines".
- FIX p7 "nel 1276 ... tassa di tre soldi per ogni soma di Vernaccia venduta fuori del territorio comunale, dal che si evince che la sua fama aveva già valicato le mura della città": "soma" left unexplained -> "load"; added the fame line the page draws from it.
- KEEP p8 "nel 1966 la Denominazione di Origine Controllata ... primo vino in Italia ... (DOCG) nel 1993" + p1 "DPR 03.03.1966", "DM 09.07.1993".
- Wine types: only white, base and "riserva" (p1, p7 "due tipologie di vino bianco"); both named. No label term needs a cut (no "legislación vigente"-type pointer).

## Fact sheet
- grapes.others: sheet "Sauvignon blanc and Riesling, together at most 10%"; pliego p1 "da soli o congiuntamente, del 10%" (alone or together).
- tastes.text: sheet "mineral notes when aged"; pliego p4 "possono poi ... evolvere note minerali" (can evolve, a hedge).
- climate.text: "rain in late autumn and late winter" is a shortening of p6's two periods; no edit.
