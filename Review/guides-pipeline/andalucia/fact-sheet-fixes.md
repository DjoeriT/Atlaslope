# Andalucía fact sheet fixes (19 Oct 2026)

Corrections from the pliego check, applied to `content/facts/andalucia.json`. Each page was reopened with `Tools/guides/pages.py` on the pliego text in `manifest.json`. Changed fields now cite `<place>-pliego:pN`; untouched fields keep their `-doc` cites.

## jerez
- famous.styles[0].text: applied. At most 4 g/l sugar, up to 9 g/l for long-aged (vejez calificada) generosos (jerez-pliego:p2).
- grapes.others: applied. Now Palomino, Beba, Perruno, Vigiriega; Moscatel Grano Menudo removed (p7). Main grapes unchanged.
- styles.kinds: kinds kept (fortified, sweet). The kind list has no tag for an unfortified generoso, and the page does not call those wines "white". Text now says generosos come unfortified (vino) or fortified (vino de licor) and adds Dulce (p1, p2).
- climate.text: applied. Warm, about 5 °C winter lows and 35 °C summer highs, over 300 sunny days, about 600 mm of rain (p8).
- tastes.text: applied. Straw finos to ebony Pedro Ximénez; balanced, sapid, intense, persistent; chalky, sapid note (p9).

## manzanilla
- grapes.main: applied. Listán Blanco (Palomino Fino) and Palomino (manzanilla-pliego:p3).
- grapes.others: applied. Emptied; only those two varieties are allowed (p3).
- styles.kinds: kinds kept (fortified), for the same kind-list reason as Jerez. Text now says the wine is sold as vino or, fortified, as vino de licor (p1, p2).
- styles.text: applied. Straw yellow to amber, at least two years under flor (p1).
- tastes.text: applied. Straw yellow to amber; white flowers, nuts or yeast; dry and saline (p1).
- soil.text: applied. Albariza, barros, arenas (p4).
- climate.text / why.text: applied. Dropped "intense, lasting"; now higher humidity all year in Sanlúcar, and flor ageing gains greatly from it (p4, p5, p6).

## montilla-moriles
- famous Oloroso and tastes: applied. Old gold to dark mahogany; slightly unctuous and persistent (montilla-moriles-pliego:p3).
- famous Amontillado: applied. Gold to deep amber; nuts and wood, possible varnish; acidic and persistent (p3).
- famous Pedro Ximénez and tastes: applied. Old gold to deep mahogany or jet (p3).
- famous Fino and tastes: applied. Straw yellow to old gold; slightly bitter and saline (p3).
- tastes (whites): applied. Fruity and floral, noticeable acidity (p2).
- styles.text: applied. Adds Palo Cortado and Generoso de Licor, Pale Cream, Cream; Fino is unfortified or fortified (p1).
- climate: skipped. "Long, hot, dry summers" vs "veranos cálidos, largos y secos" is only a matter of wording. Cite moved to p9, p10.
- all cites: applied. Every field now cites montilla-moriles-pliego: grapes p8, styles p1, climate p9-p10, soil p7/p10, tastes p2-p3, famous p1/p3, why p10. The why text now says "ripen the grapes quickly" in place of "ripen Pedro Ximénez quickly", because p10 speaks of the fruit in general. Open: grapes.others still lists only the two Moscatels. P8 also has Layren, Baladí, Verdejo, Torrontés, Chardonnay, Sauvignon Blanc and Macabeo, but no correction asked for them.

## malaga
- grapes.others (Airén): applied. Removed (malaga-pliego:p9).
- grapes.others (spelling): applied. Now Lairén, Rome (p9).
- grapes.main: applied. Moscatel Morisco, with Moscatel de Grano Menudo as its usual name (p9).
- why: applied. The sun gives a high potential to ripen and overripen; nothing about natural alcohol. Asoleo in drier spots (p10, p11).
- styles.kinds / styles.text: applied. "white" removed from kinds; text says dry unfortified wine, yellow to amber with age. The tastes label "Dry white" is now "Dry wine", and tastes cite p2 (p1, p2).
- soil: applied. Slate (Axarquía, Montes), limestone (Serranía de Ronda), albariza (Manilva), brown-limestone (Norte) (p10, p11).

## sierras-de-malaga
- why.text / climate.text: applied. "Cool nights" is now temperatures that drop at night; "close to the sea" is now running down to the Mediterranean. "Singular" removed from climate (sierras-de-malaga-pliego:p5, p6).
- grapes.main: applied. Rome; Moscatel de Grano Menudo (p4).
- grapes.others: applied. Airén removed; Laíren is now Lairen (p4). Open: the list is still shorter than the p4 list. No correction asked to complete it.
- styles.kinds / styles.text: applied. Adds "sweet" and the clearly sweet overripe-grape reds, at least 45 g/l (p1, p6).
- tastes.text: applied. Whites, rosés and reds now follow p1-p2. No earthy, tannin, green-glint or unctuous terms.

## condado-de-huelva
- styles.kinds / styles.text: applied. Adds "rose" and rosados; generosos are unfortified or fortified (condado-de-huelva-pliego:p1).
- grapes.others: applied. Listán B is now Listán del Condado. Adds Moscatel de Grano Menudo, Verdejo, Malvasía Aromática, Albillo Mayor, Montúa, Petit Verdot, Listán Prieto, Mollar Cano, Garnacha Tinta and Tintilla de Rota (p7, p8).
- tastes (whites): applied. Pale yellow to old gold; young ones green apple and floral, others stone fruit (p3).
- tastes (reds): applied. Cherry to brick red; perceptible fruit; astringency and density (p4). Rosés added from p4.
- famous Condado Viejo: applied. Generoso, old gold to dark mahogany; nuts, wood, varnish (p1, p3).
- famous Mistela: applied. Gold to deep mahogany, fruity, dense (p4).
- famous Gran Reserva: applied. Ageing only: at least 60 months, 18 in oak up to 330 l (p6).
- why: applied. Generosos age in criaderas and solera or añadas (p5). The first sentence keeps its -doc:p6 cite.
- Also: in the famous Generoso line, "pale yellow" is now "straw yellow", to match p3 now that famous cites the pliego.

## granada
- why: applied. Poor soils are the brown soils on siliceous rock; dropped "big" and "limy" (granada-pliego:p11).
- grapes.others: applied. Vigiriego in place of Vijariego Blanco; Baladí Verdejo removed. Adds Jaén Blanco, Torrontés, Blanca Gordal, Macabeo, Viognier and Monastrell: 12 white and 10 red (p9).
- climate: applied. A daily swing with no size given; 39 / -4 °C are the means of the absolute highs and lows (p11).
- soil: applied. The poverty belongs to the brown soils on siliceous metamorphic rock; the brown limy soils have little humus (p11).
- tastes: applied. Reds red with violet to mahogany tones; whites greenish yellow to amber; fresh to evolved aromas. No berries, body or astringency (p3).
- cites: applied. styles p1, famous p1-p3, tastes p3, grapes p9, why, climate, soil and altitude p11.

## lebrija
- grapes.main: applied. Palomino, Palomino Fino (lebrija-pliego:p4).
- grapes.others: applied. Palomino and Palomino Fino moved to main; Petit Verdot added (p4).
- soil: applied. Deep, well-drained albariza dominates (p6).
- climate: applied. "Almost all land is flat" moved to soil (p6). Climate keeps p5 facts and adds the warm continental Mediterranean climate, softened by Atlantic currents.
- why: applied. Dropped the summer-to-traditional-style link; now flat land, albariza, and highs that can top 40 °C (p5, p6).
- cites (all fields): applied. Grapes p4, styles and famous p1-p2, tastes p2, climate p5, soil p6. Producers keep lebrija-wikinotes.

## Test run
`npm test -- tests/unit`: 292 passed, 1 failed. The failure is `tests/unit/guides.test.ts`, which checks the list of guide ids. The eight new, uncommitted `content/guides/<andalucia place>.json` files make that list longer. This edit did not touch them. `tests/unit/facts.test.ts` passed.

## Second check
Second list of corrections, each page reopened with `Tools/guides/pages.py` on the pliego in `manifest.json`.

- jerez styles.kinds: skipped. P1 does list generosos as category 1 "vino", but the kind list has no tag for a dry unfortified wine and the page does not call them "white". The text already says generosos come unfortified or fortified.
- jerez styles.text: applied. Generosos de licor are now named: Pale Dry, Pale Cream, Medium and Cream (jerez-pliego:p2).
- manzanilla styles.kinds: skipped. Same kind-list reason as Jerez; the text already says vino or, fortified, vino de licor (p1, p2, p4).
- manzanilla famous.styles: applied. "Wholly" dropped; now aged at least two years under flor in Sanlúcar, and Pasada may show slight oxidation (the seven-year minimum did not fit the 15-word limit). Cite moved from manzanilla-doc:p1 to manzanilla-pliego:p1, p3.
- montilla-moriles why.text: applied. Quick ripening now comes from one of the world's hottest growing seasons, not from summers (montilla-moriles-pliego:p10).
- montilla-moriles climate.text: applied. Summers and winters kept; ripening now tied to the growing-season climate (p10). "Hot" for "cálidos" kept: wording only.
- montilla-moriles grapes.others: applied. All nine: Layren, Baladí, Verdejo, Moscatel de Grano Menudo, Moscatel de Alejandría, Torrontés, Chardonnay, Sauvignon Blanc, Macabeo (p8).
- montilla-moriles styles.text: applied. Whites are young (joven), unaged or aged, so aged whites are no longer called young; cite adds p6 (p1, p6).
- montilla-moriles styles.kinds: skipped. Same kind-list reason; the text already says Fino is unfortified or fortified (p1, p6).
- malaga grapes.main: applied. Local names «Pero Ximén» (Pedro Ximénez) and «Moscatel de Málaga» (Moscatel de Alejandría) (malaga-pliego:p9).
- malaga styles.kinds: skipped. Dry liqueur wines are already covered by "fortified"; the dry unfortified wine has no kind tag and the page does not call it white. The text already names both (p1).
- malaga why: applied. "Atlantic air temper the heat" is now "mountains, sea and the Atlantic gateway buffer temperatures" (p10).
- malaga climate: applied. Rewritten from p10: mild winters, dry summer, few rainy days, many hours of sun, temperatures buffered by mountains, sea and the Atlantic gateway. Cite moved from malaga-doc:p6 to malaga-pliego:p10.
- malaga famous Vino Naturalmente Dulce: applied. "Lively" dropped; now pale yellow to gold, fresh, unctuous and persistent. Famous cites add malaga-pliego:p3.
- malaga styles.text / famous.styles: applied to styles.text. Adds Pale Dry, Pale Cream, Pajarete, Cream and Sweet (p6) and the basic sweet types Dulce Natural, Maestro and Tierno (p5); cite adds p5, p6. Famous list left as is: which styles count as famous is not something the page settles.
- sierras-de-malaga styles.text: applied. "Fresh young wines" dropped; some are aged in oak vessels of up to 1,000 l, as Crianza, Reserva or Gran Reserva (sierras-de-malaga-pliego:p2).
- sierras-de-malaga grapes.main: applied. Main emptied and its wiki cite dropped, since p4 lists all varieties on equal terms (docs/guides.md: a main grape only where the text singles it out). Others now hold the full p4 list: 20 white and 19 red.
- condado-de-huelva why.text: applied. "Softens" dropped; now Mediterranean, with oceanic touches through its opening to the Atlantic; cite adds condado-de-huelva-pliego:p9. Doñana keeps its -doc:p6 cite. "(añadas)" dropped to stay within 25 words.
- condado-de-huelva famous Generoso: applied. Up to 4 g/l sugar, 9 g/l if oxidatively aged; Fino yeasty, the others nutty (p2, p3). Famous cites add p2. Colour range dropped to stay within 15 words.
- condado-de-huelva famous Gran Reserva: applied. Adds whites and rosados: at least 48 months, 6 in oak (p6). The 330 l cask size dropped to stay within 15 words.
- condado-de-huelva styles.text: skipped. P1 lists generosos under category 1 (vino) and category 3 (vino de licor); docs/guides.md reads vino de licor as fortified, so "unfortified or fortified" follows the page and the format rule.
- granada famous Vino espumoso de calidad: applied. White or rosé only, from a white or rosé base wine (granada-pliego:p2, p3).
- granada famous (Vino espumoso): applied. The entry is now "Vino espumoso, Vino espumoso de calidad", since p1 protects both and p3 describes them together.
- granada why: applied. "About half the area" (p11).
- granada altitude: applied. "About half of the area" (p11).
- granada famous.cite: applied. Adds granada-pliego:p4 for the overripe-grape wine.
- lebrija styles.text: applied. Whites, young or aged; Roble, Crianza, Reserva and Gran Reserva for reds and whites; cite adds p3, p4 (lebrija-pliego:p3, p4).
- lebrija famous Dulce natural: applied as a note, not a rename. P2 and p3 say the wine "podrá denominarse «Moscatel»", an optional label, so the name stays and the text adds "May be labelled «Moscatel»".
- lebrija famous Lebrija Old Dulce: skipped. "Full-bodied" for "vino de cuerpo" is wording only (p2).

Test run: `npm test -- tests/unit`, 293 passed. The first run caught why lines over 25 words and famous lines over 15; those were shortened as noted above.
