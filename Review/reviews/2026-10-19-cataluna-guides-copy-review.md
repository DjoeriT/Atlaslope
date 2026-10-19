# Copy review, PR #115: 12 new Cataluña guides + changed facts text
Verdict: pass with small fixes. 0 blockers, 6 should-fix, 5 notes. Facts not re-checked (per card).
Ran: grep exam/WSET/Scholar/remember/quiz/study/pliego/specification/according: 0 hits in the 12 guides and the facts diff. Email grep: 0 hits. Read all guide prose and the facts-diff text fields (diff read in part: the first ~60 text lines).
Licence: nothing resembling verbatim WSET/Wine Scholar text found (read; cannot prove a negative).

## Should fix
1. Unexplained technical words: "anthocyanins" (penedes), "polyphenols" (costers-del-segre, emporda, montsant, pla-de-bages), "pH" and "Winkler and Amerine index ... region III" (catalunya, emporda), "Miocene" (catalunya, penedes), "Quaternary alluvium" (catalunya), "Eocene and Oligocene" (pla-de-bages), "Paleozoic ... Devonian and Carboniferous" (priorat), "oxidatively" (alella, conca-de-barbera, pla-de-bages, priorat, tarragona), "dry extract", "one horizon" (priorat), "active limestone" (penedes, terra-alta), "lees"/"disgorging" (cava, emporda, penedes) -> plain wording or one short gloss each.
2. "X, Y and Z" lists in running text: montsant "Cabernet Sauvignon, Garnacha peluda, Merlot, Monastrell, Picapoll tinto and Syrah"; emporda "Syrah, Merlot, Monastrell, Chardonnay and Picapoll Blanco"; alella "Chardonnay, Macabeo, Parellada, Picapoll blanco, Syrah and Merlot"; conca "Miramar and Cogulló ... Tallat and Vilobí ... Montclar, Codony and Comalats"; terra-alta "almond, vine and olive"; pla-de-bages "rosemary, lavender and thyme" and the six-grape white list; tarragona "Mistela ... Moscatel ... Rancio"; catalunya/cava "Comtats de Barcelona ... five subzones" -> split, or keep the two or three that matter.
3. Hype, superlatives, loaded words: terra-alta lede "No wine region in the world has a higher concentration of Garnacha Blanca"; montsant "Reds are the kings of Montsant"; penedes "the unique climate", "come together only here"; emporda "outstanding for natural sweet wines", "excellent young whites"; costers "exceptionally low" (next line says minimums of 15ºC); priorat "one of the great virtues", "The vine suffers"; terra-alta "fields are dyed", "Possibly the clearest witness"; tarragona "very brilliant", "great aromatic power" -> neutral wording.
4. Source talk: penedes "The rules allow 18 white varieties"; montsant "The rules also allow rosado and brisado"; catalunya "The protected area is made up of the vineyard parcels in a listed set of municipalities" and "Catalunya allows a wide range"; tarragona "would explain" -> "Growers use", "grown here", or drop.
5. Facts repeated on one page: costers 25ºC swing (lede, climate p2, sparkling p); emporda Tramuntana (lede, climate p1, caption); priorat "10-15 cm" and "1 kg" (lede and ground); alella sauló and deep rooting (lede, ground p1 and p3); conca Francolí/Anguera (p1 and caption); costers Lleida 240 mm (p and caption); cava 1872 (p and caption); catalunya vino de aguja and vino de licor each in climate and wines beats -> say once.
6. Odd or unclear sentences: tarragona "Garnacha, from Garnacha grapes, and Clásico are liqueur wines" (reads as a loop; name what Garnacha liqueur wine is); montsant "average maximum stays under 20º C" sits beside "Dry hot summers" (looks like a contradiction; likely a yearly mean, say so).

## Notes
- Unit style mixed: "ºC", "°C", "º C", "14ºC", "14 and 15 degrees" (alella, catalunya, cava, conca, costers, montsant, priorat, terra-alta); pick "°C".
- Facts diff says "Muscat of Alexandria" while the guides say "Moscatel de Alejandría"; "a traditional-method history from the early 1900s" (costers) is clipped.
- Recommended/authorised grape talk is legal in tone; fine as label terms, softer in prose ("grown", "also used").
- Long multi-idea paragraphs worth splitting: alella grapes p2 and liqueur p, emporda liqueur p, montsant liqueur p, cava ageing p.
- Good: Spanish terms (sauló, marinada, comarca, licorella, brisado, vaso, glacis) are glossed once; titles are plain; no exam framing.

## Fixed (third thread, 19 Oct 2026)
All 6 should-fix items edited by hand in the 12 guide files, facts unchanged: jargon swapped for plain words or a short gloss with no new
numbers (geological ages, lees, disgorging, active limestone, polyphenols, dry extract, Winkler bands), flagged lists cut to two names,
hype and source talk reworded, repeats said once, the two unclear sentences rewritten from the pliego (montsant p11 yearly averages;
tarragona Garnacha liqueur wine from Garnacha Negra and Blanca, pliego p2). Note 1 done too: every temperature is now "N °C".
`check_guide.py` 0 errors; `npm test` 294 passed.
