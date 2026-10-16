# Release 4.1 review (ReviewBot, Sonnet 5.5), commit dc3108c

**Verdict: merge after fixes.** Blocker 0, should fix 4, note 7.
Tags: [V] ran, [R] read, [I] inferred.

Ran: `python3 Tools/data/build_fact_sources.py` (161 sources, `content/sources.json` unchanged, git clean) [V]; `npx vitest run tests/unit/facts.test.ts tests/unit/facts-format.test.ts` (23 passed) [V]. Not run: UI tests, screenshots (not asked).

## Check 1: sample (seed 41, 79 sheets)
Sample: ribera-del-guadiana, pla-i-llevant, lebrija, gran-canaria, ribera-del-jucar, valle-de-la-orotava, monterrei, valdepenas, mondejar, valles-de-benavente, alella, malaga [V].
Every `tastes` claim and every `famous` style is in the extract, in our own English, within 40 / 15 words, page cites plausible (page markers read as headers: «FICHA TÉCNICA n/N» starts page n) [R]. Exceptions are below. Alella tastes is empty and the extract has no description: correct [R]. All 79 sheets: no tastes over 40 words, no famous text over 15, no plain colour as a style [V]. The four Rioja sheets: zone tastes match pliego p20 and the Crianza/Reserva/Gran Reserva rules match the pliego [R].

### Should fix
1. **alella, `famous.cite` = `alella-doc:p1`.** The extract puts «Wine descriptions» on p. 2 (Rancio, Mistela and Dulce natural on p3 by footers 2/7 and 3/7; Espumoso p3). p1 cannot hold them. Cite `p2`/`p3`. [R] `Review/sources/places/alella.md`, `content/facts/cataluna.json`.
2. **Identical definition repeated on every style of a sheet.** Seven sheets: jerez (4x «Vino Generoso type, dry: no more than 5 g/l reducing sugars.»), monterrei (4x), valles-de-benavente (3x), valtiendas (3x), tierra-del-vino-de-zamora (3x), tarragona (3x), campo-de-borja (3x). The document defines these only as a group (jerez: it lists Fino, Amontillado, Oloroso and Palo cortado inside one sentence), so the card shows the same line 3-4 times, and monterrei's «Oak-aged… spice and toast» for «Barrica» is not a definition either. Fix: one combined entry (as ribera-del-guadiana does: «Crianza, Reserva y Gran Reserva») or names with empty `text` (PlaceFacts already drops empty text). The jerez line is also a lab figure that the tastes rule excludes. [V] script over `content/facts/*.json`.
3. **bierzo producers are two people, not producers.** «Álvaro Palacios» («prestigious Rioja winemaker») and «Raúl Pérez» (one of five «young winemakers» who «became prominent»; the article also names Amancio Fernández, Alfredo Marqués, and others equally). The card rule says «a person does not count», and the pick of Pérez among five equals is arbitrary. The article names no Bierzo bodega. Fix: `{items: [], cite: []}`, or ask the owner whether people count. [R] `Review/sources/wikipedia-en/bierzo.md` lines 11-13.
4. **`check.ts` does not enforce the 15-word limit of famous `text`** that the card and `types.ts` state. Data passes today [V], but the limit can silently break. Add a check and a test line. [R]

## Check 2: producers (7 non-empty rows)
- alella: «Alella Vinícola» (Marfil). Article: «cooperative… renowned for its traditional Marfil brand». Name and wine right. OK [R].
- penedes: Bodegas Torres (Sangre de Toro), Pinord, Jean León. «Most famous… Bodegas Torres… Other notable houses include Pinord, Jean León». Right, in article order [R].
- ribera-del-duero: Vega Sicilia, Alejandro Fernández (Tinto Pesquera), Viña Sastre. Article names «world-renowned Vega Sicilia easily the most famous», «Viña Sastre… respected», «the famous Tinto Pesquera, grown by Alejandro Fernández». Supported [R].
- rioja: Marqués de Murrieta. Article: «One notable example» of long ageing (1942 gran reserva released in 1983). Thin, passes «notable» [R].
- rueda: Bodega Martinsancho. Article: the grower who saved Verdejo and got an agricultural-merit cross. Singled out for his work, not called famous or notable. Borderline [R].
- lebrija: Bodegas González Palacios (`lebrija-wikinotes`, Spanish). The article says it is the only winery in the denomination, not famous. The owner agreed to keep one from Spanish Wikipedia, so OK as an owner decision [R].
- bierzo: see Should fix 3.

### Notes
5. ribera-del-duero lists Vega Sicilia first; the article mentions Pesquera first (rule: article's order). Also «Alejandro Fernández (Tinto Pesquera)» names the grower and the wine; the article names the wine as famous, not the bodega. Acceptable, but a reader might expect «Pesquera». Rueda and Rioja (above) are the weakest «singled out» cases; the owner can swap them. [R]

## Check 3: code
Correct and small. Row order matches the digest (famous styles, tastes after styles; producers last) [R]. `<dl>` rows with `<ul class="named">` lists and `<strong>` labels; links keep the existing `.src` pattern; no new colour or size, so contrast is inherited [R, I]. `tasteLines` gives the right lines on all 76 non-empty rows: only zone/one-sentence rows (manzanilla, tarragona first clause, rioja zones) stay unlabelled, which is intended [V, python port of the regex].
Notes:
6. `tasteLines` uses a lookbehind regex; Safari before 16.4 (older iPads) throws a SyntaxError when the module loads, which would break the whole app, not just the row. tsconfig target ES2022 does not transpile it. Easy to avoid (split on `/\.\s+/` then test the label). [I]
7. Stale comments: `src/facts/types.ts` («Spanish Wikipedia article») and `src/facts/check.ts` («only from the place's Spanish Wikipedia article… 19:37Z») are out of date after the English-Wikipedia decision; the check itself only requires `kind: wikipedia`, which fits both. [R]
8. `PlaceFacts.tsx` uses `key={f.name}`; two styles with the same name would warn. `checkSheets` does not test for duplicate names (none exist today [V]). [R]
9. `list-style:none` on the new lists drops list semantics in Safari/VoiceOver; the existing grape lists have the same pattern, so consistent. [I]
10. UI test covers Rioja famous/tastes only; no test shows the producers row (the unit test covers the check). [R]

## Check 4: Tools/data/build_fact_sources.py
Keeps every cited source: re-run reproduces `content/sources.json` byte for byte (161 entries) and the facts test passes, which checks every cite resolves [V]. The `cited` regex over the raw JSON text is loose (it also matches any quoted id-like string such as a name) but it only decides which Wikipedia ids ship, so a false positive ships one extra source. Wikipedia ids are only dropped when no sheet cites them [R]. No fix needed.
