# Check: dolcetto-d-alba (source dolcetto-d-alba-disc, disciplinare DOC "Dolcetto d'Alba", last change DM 17.04.2015)

## Lede
- FIX p6 "Le colline vitate del Piemonte Sud, soprattutto quelle di origine miocenica ... da secoli accolgono la vite di Dolcetto, che sugli stessi pendii ha tratto la propria origine": dropped hedge ("soprattutto") restored by moving the Miocene claim into the body. The lede no longer repeats body lines.
- FIX p6 "Nei terreni di Langa il Dolcetto trova il suo habitat ideale": the clay-marl line was repeated in the ground chapter. The lede now says "ideal home" instead.

## Title
- KEEP "Why Dolcetto d'Alba tastes the way it does" (standard title).

## hills (place)
- KEEP title "Hills around Alba" p6 "si estende su 35 comuni attorno ad Alba ... Le colline vitate".
- KEEP p6 "si estende su 35 comuni attorno ad Alba".
- FIX p6 "soprattutto quelle di origine miocenica (era terziaria) poste alla destra del fiume Tanaro": was "the hills are mostly Miocene"; the page says Dolcetto grows above all on the Miocene ones. "Grown for centuries" dropped here (now in lede).
- KEEP p6 "secondo alcuni studiosi deriverebbe da "Langues" che non sono altro che delle lingue di terra".
- FIX p6 "lingue di terra che si estendono in un vivace gioco di profili, modulati dal mutare delle stagioni": the tongues of land stretch out, not "the hills".
- KEEP p2 "giacitura: esclusivamente collinare".
- FIX p2 "Sono da escludere categoricamente i terreni di fondovalle, umidi, pianeggianti e non sufficientemente soleggiati": four-item list split over two lines.
- FIX p2 "altitudine: non superiore a 650 metri s.l.m.": the rule is on vineyards, not each vine.
- FIX p6 "La sua coltivazione si può dividere in due fasce principali": was "Two bands make two styles"; the page says the area can be split into two main bands.
- KEEP p6 "zona del Barolo e Barbaresco, dove si ottengono vini più strutturati".
- FIX p6 "l'altra che parte da Alba per salire verso la Valle Belbo dove la struttura geologica origine dolcetti più fini e leggeri": the page names the geology as the cause; added.
- Flight "Alba and its hills": KEEP p6 caption. Point [8.035, 44.7] is Alba town [A]: Nominatim not reachable from this run (request needed approval), pack lookup returned no result.
- Flight "Barolo": KEEP p6 caption, place link.
- Flight "Belbo valley": FIX caption to carry the geology cause (p6). Point moved from [8.25, 44.65] (open hills about 4-5 km east of the river) to Cossano Belbo [8.199, 44.668], a zone commune (p2) on the Belbo [A, not checked on Nominatim].
- Missing flights: none needed; the Tanaro is seen from the Alba flight.

## marl (ground)
- KEEP title "Blue-grey marl and sand" p6 "marne e sabbie ... grigio-bluastro".
- KEEP p6 "le Langhe hanno origine nell'Era Terziaria o Cenozoica, iniziata quasi 70 milioni di anni fa".
- KEEP p6 "nella sua massima parte appartiene ... "terreno tortoriano", uno dei 14 strati dai quali è formata la pila dei terreni sedimentari che compongono il bacino terziario del Piemonte".
- KEEP p6 "Il terreno Tortoniano è caratterizzato da marne e sabbie straterellate".
- KEEP p6 "marne sono di un colore grigio-bluastro, non molto resistenti".
- FIX p6 "colline biancheggiati piuttosto basse e rotondeggianti": hedge "piuttosto" restored ("fairly low"); split into two lines.
- KEEP p6 "sono molto favorevoli alla coltivazione della vite".
- FIX p6 "La marna tufacea bianca caratterizza il comprensorio di produzione, sulle colline alte a dominare il fiume Tanaro": "higher hills" to "high hills".
- FIX p2 "terreni: argillosi, calcarei, silicei e loro eventuali combinazioni": "X, Y or mixes" list split over two lines; "calcarei" is limy.
- KEEP p6 "Nei terreni di Langa ... le marne argillose donano un vino fresco ed elegante".
- KEEP p6 "colore rosso rubino più o meno intenso in relazione alla tipologia dei terreni".

## friend (rules)
- KEEP title "A dry red for every day" p6 "vino "quotidiano"", "decisamente secco e asciutto".
- KEEP p1 "riservata ai vini rossi ... vitigno Dolcetto".
- KEEP p1 "tipologie: -"Dolcetto d'Alba" -"Dolcetto d'Alba" Superiore".
- KEEP p2 "Resa uva t/ha 9,00".
- KEEP p2 "Titolo alcolom.vol.min-naturale 11,00% ... Superiore 12,00%".
- KEEP p4 "Superiore Mesi 12 Dal 1 novembre dell'anno di raccolta delle uve".
- KEEP p4 "immissione al consumo ... 1 novembre dell'anno successivo".
- FIX p5 "Superiore ... titolo alcolometrico volumico totale minimo: 12,50 % vol": split from the previous sentence, "when sold" added ("all'atto dell'immissione al consumo").
- FIX p2 "menzione aggiuntiva "vigna" seguita dal relativo toponimo o nome tradizionale": Italian term now explained.
- KEEP p3 "un'età d'impianto di almeno 7 anni"; p2 "deve essere di t 8,00".
- ADD p2 "titolo alcolometrico volumico minimo naturale di 11,50 % vol ... Superiore ... 12,50 % vol": the vigna rule was incomplete.
- ADD p6 "è obbligatoria l'indicazione dell'annata di produzione delle uve".
- CUT tasting paragraph (ruby, violet, vinous, cherry, plum, dry, almondy, modest acidity, bitter): it repeated the fact sheet's `tastes`. "Delicate bitter finish" also added "finish" to p6 "amarognolo delicato e invitante". Replaced with KEEP p6 "Il carattere è semplice e rustico".
- FIX p6 "Questo suo essere vino "quotidiano" lo porta ad essere giustamente considerato il vino dell'amicizia da bere a pieni bicchieri e con il cuore in mano": dropped "The zone describes it" (line about the source); "heart in hand" restored.
- Wine types: p1 protects red only, two tipologie; both named. No other mención beyond "vigna" and Superiore (p5 bans extra, fine, scelto and similar).

## Fact sheet
- why.text: sheet credits "marl and sand soils"; p6 credits the clay marls of Langa ("le marne argillose donano un vino fresco ed elegante"). Sand is not part of the cause.
- tastes.text: sheet says "low in acidity"; p6 says "di modesta acidità" (modest).
- No other disagreement: styles.kinds (red), famous.styles (Superiore p4/p5, Vigna p2/p3) and altitude match.
