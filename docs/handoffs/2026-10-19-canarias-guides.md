# Canarias guides (19 Oct 2026)

- Shipped (branch `claude/guides-canarias`, release 49 note `Review/release-49-what-to-test.md`): 11 guides: Lanzarote, La Palma,
  Tacoronte-Acentejo, Valle de Güímar, Valle de la Orotava, Ycoden-Daute-Isora, Islas Canarias, Abona, La Gomera, Gran Canaria and
  El Hierro. Plus the Guides-page tile `public/guides/canarias.webp` (22 KB, `Tools/guides/region_tile.mjs` view -15.80,28.45,7.35),
  the roster in `tests/unit/guides.test.ts`, and the "not quizzed, no guide" UI fixture in `tests/ui/facts.spec.ts` moved from
  Islas Canarias to Dominio de Valdepusa (Meseta, quiz none, no guide).
- Sources: all 11 pliegos from the ministry host www.mapa.gob.es, each the in-force file in MAPA's "Pliegos de condiciones en vigor"
  list (updated 3 Jul 2026), ids `<id>-pliego`. Four newer EU single documents from Cellar as `<id>-doc2`: Lanzarote C/2025/1678,
  Gran Canaria C/2025/4097, Tacoronte-Acentejo C/2025/1618, Islas Canarias OJ C 88/2022 (CELEX 52022XC0224(02), AM02; cited by its
  EUR-Lex CELEX link because the ELI form was not confirmed). All 15 files are in `Review/sources/fetched/` and `data/SOURCES.md`.
  Inputs: `Review/guides-pipeline/canarias/` (manifest, extracts).
- Seven pliegos date from 1 Jan 2011 (Abona, El Hierro, La Gomera, La Palma, Valle de Güímar, Valle de la Orotava, Ycoden-Daute-Isora).
  eAmbrosia lists no amendment, approved or in progress, for them, so they are the current texts.
- The Canarias government host (ICCA) only had the Islas Canarias pliego (plus a "modificado-1" PDF, not used; the MAPA 2021 text
  matches OJ AM02).
- MAPA's host sends an FNMT G2R root missing from the CA bundle; the cross-cert was verified against the system FNMT root and used with
  `curl --cacert`. TLS verification stayed on.

## Owner decision needed
- **Islas Canarias** is a VC with quiz "none" (outside Study). `docs/guides.md` lists it among the places outside Study, yet it now has a
  written Terroir section. Recommended: keep it (the pliego is current and full). If not, delete `content/guides/islas-canarias.json`
  and its roster entry.

## Fact sheet (`content/facts/canarias.json`)
Sure edits applied (21, from the checkers against the pliegos): lanzarote climate and why (rain "under 150 mm"); tacoronte-acentejo
main grapes (p7) and cite; valle-de-guimar styles (sparkling, aguja gasificado, partly fermented must) and climate (161 mm is the
coast; most sun hours is Izaña); ycoden-daute-isora others (8 reds), soil and why ("low fertility", not fertile); islas-canarias
others (Albillo Criollo, Breval, synonyms); abona main grape, soil and cites; la-gomera soil and styles (traditional white/rosado);
gran-canaria soil, others (Albillo Criollo, Bruñal, Breval), styles and the first famous style renamed "Vino de uvas sobremaduras
(Clásico)". One change from the given edit: the ycoden-daute-isora why line was 36 words, over the check's 25-word limit, so it was
shortened to "Vines climb from 50 to 1,400 m below Teide on deep, poor volcanic soil. Trade winds and the Atlantic current make countless
microclimates." (pliego p8, p9, p10).

UNSURE, left for the owner:
- lanzarote: others spell Brebal (pliego p6 and doc2: Breval), Albillo (p5, doc2: Albillo criollo); synonyms missing for Listán Negro
  (Almuñeco) and Vijariego Blanco (Diego); tastes "red in every shade" matches doc2 but p3 gives onion skin to raspberry rosado and purple
  to ruby red.
- la-palma: climate and why say wide swings over the year and day to night (doc p7); the pliego p11 says the yearly range is small (6 to
  8 ºC). Sources conflict; follow the pliego? main grapes empty though p9-p10 name preferred grapes; liqueur and aguja "traditional
  method" is said only of espumoso (p7), and aguja may be from black grapes (p5); styles text misses Negramoll, Malvasía seco and
  naturalmente dulce (p1, p6); soil is only "Volcanic soil." (p12 adds picón up to 5 m and a salty taste).
- tacoronte-acentejo: two rain figures (400 mm p7; 450 to 550 mm in the causal link); others spell Albillo, Brebal and add "(Malvasía de
  Sitges)" where p6 does not; taste colours come from the EU document, the pliego p3-4 says only "en toda su gama"; no separate aguja kind.
- valle-de-guimar: main may need Malvasía (p10 names "Listán Blanca y Malvasía"); "(Malvasía de Sitges)" not in p8; dulce clásico colour
  (p4: straw yellow only); "fortified" for vino de licor not stated by the pliego; why line puts porous soil from 300 m, p10 says 400 to
  800 m with vines 300 to 1,700 m.
- valle-de-la-orotava: Brebal vs Breval (p7; the EU doc also says Brebal); main empty though p7 names preferred grapes; others miss
  Güal, Bastardo negro, Listán prieto, Moscatel negro, Vijariego negro and six international grapes; "Tinto de maceración" is carbonic
  maceration (p4); "fortified" not stated (p1-p5); 37 °C and 7 °C are yearly means data (p8), not highs and lows.
- ycoden-daute-isora: soil and why cited doc p6 (unread); if the doc says fertile it conflicts with pliego p10; "(Malvasía de Sitges)"
  not in p8; Vijariego blanco missing synonym Diego; "sweet" kind probably right.
- islas-canarias: soil could add "generally" and "often" (p7); no sweet kind for vino de uvas sobremaduradas (p1, p10); why, climate and
  soil cite doc p7, not doc2 or pliego p7; the pack's Teide point is not on p13 (only the municipality), so no flight there.
- abona: altitude and why say vines from 300 m (doc p7); pliego p9 says 400 to 1,700 m; others miss Forastera Blanca (p7); "fortified"
  confirmed by p5, no change.
- la-gomera: famous styles could add the traditional white/rosado (p5); others spell Brebal (p7: Breval); the orange tint from Forastera
  (p9, p10); climate could add the three zones, 17/25 °C means and 370 mm (p8).
- gran-canaria: main is only Moscatel de Alejandría (wiki); p7 names 11 preferred whites and 5 reds; espumoso "Pale yellow" vs p4
  (white, red and rosado tones); check nothing references the old "Dulce clásico" name; Malvasía Rosada is a preferred red (p7).
- el-hierro: main empty, p7, p10, p11 name candidates (Listán Negro the main red); Brebal vs Breval (p5, p7); others miss Doradilla (p5,
  p7); climate line talks about the document, not the place (p7-p8 give 170 mm, 20.4 ºC, sea of clouds, trade winds); liqueur colour
  misses the rosé or reddish wines made as red (p4).

## Other notes
- check_guide.py: all 11 pass with 0 errors; warnings are numbers written as words in the source (for the sentence check) and La Gomera's
  flights all go to the place itself (its pliego names no features, so none is demanded).
- OSM caveats from the packs: no point for Las Cañadas del Teide; Gran Canaria's Caldera de Tejeda hit is a GC-60 road point and Pico de
  las Nieves a mirador.
- No Canarias map flags yet (`content/flags.json` has no Canarias set).
- Run locally: check_guide.py on the 11, Vitest guides, facts, facts-format, facts-measures and home, Playwright guide.spec and
  facts.spec (28 passed), tsc, and the data ledger. CI runs the rest.
