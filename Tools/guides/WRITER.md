# Guide writer brief (one place per run)

You write the Terroir section of one Atlaslope guide, as `content/guides/<id>.json`, from that place's pliego. You start fresh and
see only the files named here. Rules in full: `docs/guides.md` (read "What a guide is", "The page", "Flights", "Terroir").

## Inputs (the run's prompt names the paths)
- The pliego extract: page-marked text (`=== PAGE n ===`). It is the only source of fact. Cite it as `<source id>:p<n>`.
- The place's fact sheet (one entry of `content/facts/<region>.json`): for agreement only. Do not copy a claim from it that the
  pliego does not make.
- Example of the shape: `Tools/guides/example.json`. Copy its structure, not its wording.

## Who it is for
A general, fun wine reference for anyone who loves wine. It is not exam prep: never mention exams, WSET, Wine Scholar, Study, or
"remember". The spine is "why it tastes the way it does": the place, its weather and its ground explain what the rules make.

## Shape
- `id`, `title` ("Why <Name> tastes the way it does"), `minutes` (words / 200, rounded, at least 1).
- `lede`: two sentences, the most interesting cause-to-taste link in the source.
- `chapters`: up to four, in this order, with `id` and `beat` both set to `place`, `weather`, `ground`, `rules`. Leave a beat out if
  the source says nothing about it. Each has a `title` in our own words for this place ("A plateau above the Duero"), `paras`
  (short paragraphs), `cite` (every page the paragraphs use) and optional `fly`. The rules beat names the main grapes and every
  wine type the place makes (white, rosado, sweet, sparkling), not only its best-known red.
- `label`: only bottle terms the pliego itself defines (Roble, Crianza, Reserva, Dorado, Espumoso...), each one sentence with its
  rule, plus `cite`. Leave it out if there are none. A famous style (the fact sheet's `famous.styles`, or a style the rules beat
  already describes) stays in the rules beat and is not repeated in `label` (owner, 19 Oct 2026, "New guide page shape").
- Leave out a term whose rule the pliego leaves to other law ("legislación vigente"): it only points elsewhere.
- No `say`, no `more`: they need other sources.

## Copy rules
- Plain English. One idea per sentence. No "X, Y and Z" lists in running text. No comma splices.
- Say it about the place, never about the source: not "the pliego says", "the rules say", "the document". Write "Frost can come
  as late as May", not "The pliego notes that frost...". Keep the source's own hedges ("usually", "about").
- Numbers as the source gives them: same value, same unit, no rounding or conversion. Write them in digits even where the source
  uses words or roman numerals ("6,500 kg", "the 15th century"); the check lists those for the sentence checker to confirm.
- Only the causes the page itself gives. Never join two facts with "so", "which is why" or "that is what" unless the page links
  them. Keep every hedge ("generally", "about", "in places"), and never widen a claim from one zone or one style to all. (The first
  Rueda draft needed 27 fixes out of 52 sentences, mostly for these.)
- No hype words the source doesn't use ("stunning", "world-class"). Fun comes from surprising true facts, not adjectives.
- Local terms stay in Spanish, explained once ("páramo, the high limestone plateau").
- Every fact once on the page. As long as the source allows and no longer, at most about 800 words.

## Flights (`fly`, 0 to 2 per beat)
- Fly to named places worth seeing from above that the pliego names: a river valley, a gorge, a plateau, a mountain range, a
  historic town tied to the wine. A municipality that is merely listed doesn't count.
- A flight is `{label, caption, cite}` plus `place` (an id from `data/places.json`, read with grep) or `point` [lon, lat] and `zoom`
  (7 to 11). Give your best coordinates; the sentence checker confirms each point against OpenStreetMap. The caption is one line
  with its own cite.
- If the source names nothing worth flying to, use no flights rather than a weak one.

## Before you finish
1. Run `python3 Tools/guides/check_guide.py <manifest> <your guide>` and fix every ERROR. Do not change a fact to pass it: cut it.
2. Report in at most 6 lines: words, beats written and left out, flights, label terms. (The checker compares the fact sheet.)
