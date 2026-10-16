# Release 4.1, card 1: how it tastes, famous styles, famous producers (one run per batch of regions)

    Goal:        Every quizzed place in your regions gets the three new rows, each true to its cited source, or left empty.
    Task:        Add `tastes`, `famous` and `producers` to every sheet in content/facts/<region>.json for your batch's regions.
    Role/model:  BuilderBot (Sonnet)
    Budget:      80k; stop and report at ~70%
    Branch:      agent/builder/r41-write-<batch letter> (worktree, from claude/release-4-1-w86f4s)
    Batches:     A green-spain, castilla-y-leon · B rioja (incl. zones rioja-alta, rioja-alavesa, rioja-oriental), ebro, cataluna ·
                 C mediterranean, meseta, baleares · D andalucia, canarias
    Context:     Review/release-4.1-digest.md "Shape", "Files" and "Decisions that apply" only; per place:
                 Review/sources/places/<id>.md sections «Wine categories» and «Wine descriptions»;
                 Review/sources/wikipedia-notes/<id>.md section «Paragraphs naming producers or wines»
    May edit:    content/facts/<region>.json for your batch's regions; only the keys tastes, famous, producers
    Must not:    change any other key; read anything else under Review/, docs/ or src/; read a full document in
                 Review/sources/fetched/ whole (rg one section only); browse the web; write anything not in a source

    Rules
    - tastes: at most 40 words, our own English, only colour, nose and palate words the document gives. Lead with the place's main
      wines (the ones its styles row names first). Group by colour, e.g. «Reds: ruby to garnet; red fruit, vanilla and spice when
      aged; fresh acidity. Whites: pale straw, fruity and fresh.» Skip lab figures (acidity g/l, alcohol). Cite the page.
      No description in the extract: { "text": "", "cite": [] }.
    - famous: up to four named styles the document itself defines, using its own name in Spanish or the local language (Crianza,
      Reserva, Gran Reserva, Fino, Amontillado, Oloroso, Fondillón, Clarete, Rancio, Dulce Natural, Vino de licor, Espumoso,
      Noble, Añejo...). Prefer names peculiar to this place over generic ageing terms, and generic ageing terms over plain colours;
      never list a plain colour («Tinto», «Blanco») as a style. text: at most 15 words from the document's definition (ageing, grape,
      method). Cite the page. None: { "styles": [], "cite": [] }.
    - producers: only a producer or wine the article singles out as famous, notable, emblematic, historic, a reference or the best
      known (e.g. «destacan las bodegas X», «su vino más conocido es Y», «X, la bodega más antigua»). A name that merely appears
      (an anecdote, a list of all members, a cooperative in the history, a person) does not count. Name exactly as the article
      does; add wine only when the article names one for that producer. At most three, in the article's order. Cite
      ["<id>-wikinotes"]. Zones: only producers the article places in that zone. None or in doubt: { "items": [], "cite": [] }.
    - Put the three keys after "altitude" (or after "soil" when there is no altitude), in the order tastes, famous, producers.

    Steps
    1. List your places: jq -r '.places[] | select(.region=="<region>" and .quiz!="none") | .id' data/places.json
    2. Per place, read the two extract sections, write the three keys.
    3. Validate: npx vitest run tests/unit/facts.test.ts (must pass). Commit once per region.

    Done when:   every sheet in your regions has the three keys; the unit test passes; one commit per region
    Report:      250 words: per region the count of sheets with a tastes row, with famous styles, with producers; every producer you
                 rejected as a mere mention, with the article's wording in Spanish (so LeadBot and the owner can check); every place
                 whose extract has no wine description. [V]/[R]/[A]
    Stop and ask if: the rules do not settle a case
