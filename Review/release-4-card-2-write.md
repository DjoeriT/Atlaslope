# Release 4, card 2: write the fact sheets (one run per batch of regions)

    Goal:        Every quizzed place in your regions has a fact sheet a wine lover can trust: each row true to its cited source.
    Task:        Write content/facts/<region>.json for each region in your batch, following the template exactly.
    Role/model:  BuilderBot (Sonnet)
    Budget:      100k; stop and report at ~70%
    Branch:      agent/builder/r4-write-<batch letter> (worktree, from claude/release-4-reference-lm0q2o)
    Batches:     A green-spain, castilla-y-leon (keep and check the Cebreros sheet already there) ·
                 B rioja (incl. the zones rioja-alta, rioja-alavesa, rioja-oriental), ebro, cataluna ·
                 C mediterranean, meseta, baleares · D andalucia, canarias
    Context:     Review/release-4-fact-sheet-template.md (the whole of it; it is short); Review/release-4-digest.md "Decisions that
                 apply" only; per place: Review/sources/places/<id>.md and, for main grapes only, Review/sources/wikipedia/<id>.md;
                 content/sources.json for the source ids (jq)
    May edit:    content/facts/<region>.json for your batch's regions only
    Must not:    read anything else under Review/, docs/ or src/; read a full document in Review/sources/fetched/ whole (search it
                 for one section only, as the template says); browse the web; write anything not in a source

    Steps
    1. List your places: jq '.places[] | select(.region=="<region>" and .quiz!="none") | [.id,.name,.kind,.quiz,.courseOrder]' data/places.json
       Write them in course order.
    2. For each place: read its extract, write the sheet, cite pages. Main grapes per the template's three-step rule; when you
       use Wikipedia, check the article title is this wine place.
    3. Validate before committing: python3 -c "import json;json.load(open('content/facts/<region>.json'))" for each file, and
       check by eye that every non-empty row has a cite. Commit once per region.

    Done when:   every quizzed place of your regions has a sheet; files parse; one commit per region
    Report:      300 words in the final message: per region the count of sheets, how many main-grape rows came from the official
                 document, from Wikipedia, or are empty; every place where the extract was thin or the Wikipedia article looked
                 wrong; every Wikipedia main grape the official document does not allow. [V]/[R]/[A]
    Stop and ask if: the template does not settle a case
