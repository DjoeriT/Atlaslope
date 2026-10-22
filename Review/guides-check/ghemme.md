# Ghemme sentence check
Source: ghemme-disc (Disciplinare DOCG «Ghemme», as modified by Decreto 04.09.2025, G.U.U.E. C 26.02.2026). Pack: it-piemonte.

## Title
KEEP "Why Ghemme tastes the way it does" (standard title)

## Lede
KEEP p5 "i ghiacciai del Monte Rosa si propagavano fino alla pianura" / "Il ritiro dei ghiacciai ha creato una serie di morene"
FIX p5 "terreni ricchi di sali minerali disciolti ... aggiungono sapidità all'uva": "the Nebbiolo grapes" → "the grapes" (page does not name the variety)

## place: "Where the glaciers stopped" → "Between mountain and plain"
FIX title p5 "raccordo naturale tra la montagna e la pianura": page never says the glaciers stopped at Ghemme
KEEP p5 "nell'Alto Piemonte, ai confini con la Valsesia, nelle vicinanze del Monte Rosa"
KEEP p5 "con il Monte Fenera a nord ed i laghi Maggiore ed Orta a Nord Ovest"
KEEP p5 "In epoca glaciale i ghiacciai del Monte Rosa si propagavano fino alla pianura"
KEEP p5 "dove oggi si trovano estesi terreni irrigui coltivati a riso e a cereali"
KEEP p5 "Il ritiro dei ghiacciai ha creato una serie di morene costituenti un raccordo naturale tra la montagna e la pianura"
KEEP p1 "in provincia di Novara, in parte del territorio amministrativo del comune di Ghemme ed in parte ... Romagnano Sesia"; p2 "giacitura: collinare" (p2 added to cites)
KEEP p6 "il vino di Ghemme era già famoso ai tempi di Plinio il Vecchio"
Flight Monte Rosa: KEEP p5 caption. Point [7.867, 45.937] is the Dufourspitze massif; the OSM hit (Palencia, Spain) is a namesake, so the point stays.
Flight Ghemme and its hills: KEEP p5 "ai confini con la Valsesia, nelle vicinanze del Monte Rosa". OSM gave no result; point is within ~2 km of Ghemme town, kept.
Missing flights: guide already flies beyond the place (Monte Rosa); none added.

## ground: "Moraine hills, 220 to 400 m"
KEEP title p5 "morene", p2 "non inferiore a metri 220 s.l.m e non superiore ai 400"
KEEP p5 "Le colline che si sviluppano da nord a sud"
FIX p5 "terreni con rocce e detriti di diversa natura e composizione, con uno stato superficiale di argille, caolini e tufi": split, three-item list rewritten ("a layer of clay with kaolin and tuff")
KEEP p5 "Più compatti e profondi sull'Altopiano"
KEEP p5 "più sciolti e ciottolosi lungo il versante occidentale"
KEEP p5 "Sono terreni ricchi di sali minerali disciolti"
KEEP p5 "assorbiti dalle terminazioni radicali della vite aggiungono sapidità all'uva"
FIX p2 "terreni: argillosi, sabbiosi, limosi, ciottolosi e loro eventuali combinazioni": four-item list split into two lines
FIX p2 "Sono da escludere i terreni di fondovalle, umidi, e non sufficientemente soleggiati": page lists three exclusions, guide merged them into one ("damp valley floors without enough sun"); now valley floors, damp ground and sunless ground each excluded
KEEP p2 "con l'esclusione del versante nord"
KEEP p2 "non inferiore a metri 220 s.l.m e non superiore ai 400 s.l.m."

## rules: "Red only, aged long"
KEEP title p1 "riservata ai vini rossi"; p3 "durata mesi 34" / "mesi 46"
KEEP p1 "è riservata ai vini rossi"
KEEP p1 "dal vitigno Nebbiolo (Spanna)"
KEEP p1 "Vespolina ed Uva Rara da soli o congiuntamente fino ad un massimo del 15%"
KEEP p3 "Ghemme: durata mesi 34 di cui in legno 18 con decorrenza 1° novembre dell'anno di raccolta" (start date added)
KEEP p4 "1° settembre del terzo anno successivo alla vendemmia"
KEEP p3 "riserva: durata mesi 46 di cui in legno 24"
KEEP p4 "1° settembre del quarto anno successivo alla vendemmia"
FIX p2/p5 "menzione aggiuntiva "vigna" seguita dal relativo toponimo o nome tradizionale": "vigna" explained, "and a vineyard name" → "followed by the vineyard's name"
KEEP p2 "età di impianto di almeno 7 anni" / "t 7,20 per ha"
CUT p4 tasting paragraph (4 sentences: colour, aroma, taste, Riserva): repeats the fact sheet's `tastes` word for word; also its "fine, pleasant and ethereal" list
ADDED p5 "è obbligatoria l'indicazione dell'annata di produzione delle uve" → "Every bottle must show the vintage."
Wine types: p1 protects only red Ghemme and Ghemme riserva; both named. Label terms swept: riserva, vigna only (p2, p5); Art. 7 bans superiore, extra, fine, selezionato. No `label` field in this guide.

## Fact sheet
- why.text: sheet says "which the spec says add savoury taste to the Nebbiolo grapes"; p5 says "aggiungono sapidità all'uva" (the grapes, no variety), and the line talks about the source. Edit returned.
- soil.text "valley floors that are damp or too shady": p2 lists fondovalle, umidi, non sufficientemente soleggiati as separate exclusions; reading is not plain, no edit returned.
- tastes: Riserva colour on p4 is "rosso rubino tendente al granata" and "sottile"; sheet does not contradict, no edit.
