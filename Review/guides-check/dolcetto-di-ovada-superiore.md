# Check: dolcetto-di-ovada-superiore
Source: dolcetto-di-ovada-superiore-disc (disciplinare DOCG "Dolcetto di Ovada Superiore" o "Ovada", last mod. DM 07.03.2014). Checked 22 Oct 2026.

## Title
- KEEP "Why Dolcetto di Ovada Superiore tastes the way it does" (standard title)

## Lede
- FIX p1 "Dolcetto al 100%", p6 "forti pendenze e si snoda attorno al corso del fiume Orba": was "Dolcetto grows here on steep hills of clay, tufa and limestone", a repeat of the ground beat. Now "Pure Dolcetto from steep hills around the river Orba."
- FIX p6 "una delle zone più vocate del Piemonte meridionale": was a hedged repeat of the ground beat plus "ready to drink young" (p7 has no "young" and does not tie drinkability to the soils). Now "The zone is one of the best suited in southern Piedmont."

## place: Steep hills around the Orba
- KEEP title p6 "prevalentemente collinare con forti pendenze e si snoda attorno al corso del fiume Orba"
- KEEP p6 "La sua zona di produzione è il Monferrato e in particolare le colline che caratterizzano i territori dell'ovadese"
- KEEP p6 "22 Comuni in Provincia di Alessandria con epicentro Ovada"
- KEEP p6 "prevalentemente collinare con forti pendenze e si snoda attorno al corso del fiume Orba"
- FIX p2 "esclusi i terreni di fondovalle, umidi, pianeggianti e non sufficientemente soleggiati": split an "X, Y and Z" list into two sentences
- Flight "Ovada and the Orba hills" [8.642, 44.636]: KEEP. The pack's OSM lookup returned nothing; the point sits on Ovada town (about 44.638, 8.644), well under 3 km off. Caption KEEP p6. The Orba is in this flight's label and frame at zoom 10, so no extra flight.

## ground: Clay, tufa and limy soils up to 600 m
- FIX title p2 "argillosi, tufacei, calcarei": "limestone" -> "limy" (calcareo is limy)
- FIX p2 "terreni: argillosi, tufacei, calcarei e loro eventuali combinazioni, compresi quelli a medio impasto": "limestone" -> "limy"; "X, Y and Z" list split into two sentences
- KEEP p2 "giacitura: esclusivamente collinare", "altitudine: non superiore a 600 metri s.l.m."
- KEEP p6 "Le caratteristiche dei terreni esaltano le caratteristiche migliori delle uve dolcetto"
- KEEP p6 "permettendo di ottenere vini più profumati e di qualità"

## rules: Pure Dolcetto, dry and red
- KEEP title p1 "riservata ai vini rossi", p5 "Sapore: asciutto"
- KEEP p1 "vini rossi ... Dolcetto al 100%"
- FIX (added) p1 "“Dolcetto di Ovada Superiore” o “Ovada”": the second name was missing
- KEEP p6 "si è espansa in modo particolare a partire dall'800 anche se ha caratterizzato da sempre i vigneti della zona"
- KEEP p6 "definito Uva di Ovada, o, dai naturalisti, Uva Ovadensis"
- CUT p5 "rosso rubino tendente al granato", "vinoso, talvolta etereo ... talvolta con sentore di legno", "asciutto, con sentore mandorlato e/o sentore di frutta": the tasting paragraph (3 sentences) repeated the fact sheet's `tastes` word for word
- FIX p7 "Pur avendo caratteristiche atte all'invecchiamento, è un vino di pronta bevibilità e le moderate acidità totale e gradazione alcolica": "ready to drink young" -> "ready to drink" ("young" is not on the page)
- FIX p4 "12 mesi dal 1 novembre dell'anno di raccolta delle uve": "rests" -> "ages" (invecchiamento)
- KEEP p5 "le uve provengano totalmente dal medesimo vigneto"
- FIX p3 "purché tale vigneto abbia un'età d'impianto di almeno 7 anni. Se l'età di tale vigneto è inferiore, la produzione di uve per ettaro ammessa è pari ... 3,60": was "The vines must be at least 7 years old", but younger vineyards may carry Vigna at lower yields. Now the 6 t/ha cap (p2 "tonnellate 6 per ettaro") is for 7+ year vines and younger ones get less, down to 3.6 t/ha in year three. Also broke up the "X, Y and Z" list; added p2 to the cite.
- KEEP p4 "“vigna” 20 mesi dal 1 novembre"
- FIX (added) p5 "Titolo alcolometrico volumico totale minimo: 13,00% vol." and "talvolta con sentori di frutta e/o speziati": what the Vigna wine adds, in place of the cut tasting paragraph
- KEEP p6 "invecchiamento non inferiore a 24 mesi possono portare la menzione aggiuntiva “Riserva”"
- Wine types: only red wines (p1). Mentions on p1 (riserva, vigna) are both in the rules beat. No `label` field.

## Fact sheet
- why.text: sheet says the hills "give a fragrant, ready-to-drink Dolcetto"; p6 ties the soils only to more fragrant wines of quality, p7 states ready-to-drink with no cause. Also "limestone" vs p6 "calcarei" (limy).
- famous.styles Vigna: sheet says "single named vineyard of 7+ years"; p3 allows younger vineyards at lower yields (3.6 to 5.4 t/ha in years 3 to 6). The single-vineyard rule is on p5, missing from the cite.
- soil.text: "limestone" vs p2 "calcarei" (limy). Not sure: translation nuance.
