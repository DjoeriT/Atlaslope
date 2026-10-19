# Cheaper guide writing: plan (19 Oct 2026)

Owner go 19 Oct 2026 05:40Z ("let's do it and be smart about it but I want to see how it looks differently first"), on the
"Running and content costs" thread's proposal. Proof region: **Castilla y León** (16 places).

## Context
- 4 of 79 places have a written Terroir section. Green Spain part 2 (9 guides) cost $22.62+ [V, get_session], most of it one long
  thread re-reading its own history (64M cached tokens) [R]. The writing itself is cents.
- The cost driver is context length, not the model: Sonnet re-reads at the same price as Opus [R, efficiency memo 17 Oct].
- So the fix is short, fresh contexts. The thread never reads a pliego. Every helper starts empty, does one job, and ends.
- Why Castilla y León: it is the next region in the 17 Oct fill plan, it has the big names (Ribera del Duero, Rueda, Toro, Bierzo),
  and its 16 places mix full DOs with thin Vino de Pago pliegos, so the proof covers both kinds. It shares no files with the Green
  Spain pilot or the page-shape slice.

## The pipeline (per region)
1. **Sources** (one Sonnet helper): find each place's current pliego, fetch it, turn it into text with `=== PAGE n / N ===` markers,
   write an index with URL, version date and page offsets, and add each to `content/sources.json` and `data/SOURCES.md`. Same
   format as the pilot's `sources/INDEX.md`.
2. **Extract** (a script, no model): cut each pliego to what a guide uses (the wines, the area, the link with the area, practices,
   label terms), keeping page markers. Kept in `Review/guides-pipeline/<region>/`.
3. **Write** (one fresh Sonnet helper per place, four at a time): extract + fact sheet + `docs/guides.md` rules + one finished guide
   as the example. Output: `content/guides/<id>.json` in shape C (four beats, `beat` tags, label terms, named-place flights).
4. **Machine check** (a script, every guide): the JSON fits the schema; every cite names a known source and a page that exists; every
   number in a sentence appears on a cited page; minutes match words. A failure goes back to step 3.
5. **Sentence check** (one fresh Opus helper per guide, **every sentence, not a sample**): it sees only the guide and its cited
   pages, and logs KEEP, FIX or CUT per sentence, caption and label term with the source words. It also logs where the fact sheet
   disagrees with the pliego. Short context makes Opus cheap here. Logs in `Review/guides-check/`.
6. **Sample** (the thread, Opus): read 3 of 16 guides end to end against the pliego, plus every FIX and CUT line. If the sample finds
   one error the checker missed, the whole region's check runs again with that miss added to its brief.

How the fact rule stays true: sampling never replaces the per-sentence check. Steps 4 and 5 look at every sentence. The sample
checks the checker.

## Upside (measured at the end)
- Target $0.50 to $1.50 per guide, against about $2.50 per guide in the pilot [A until measured]. Measured from each helper's
  token use plus the thread's own `get_session` cost, reported per step.
- Fewer usage-limit stalls: no single context goes past about 60K tokens except this thread, which stays under 150K.
- Before anything merges: one page with the new guides as they look, for the owner to see first.

## Risks
- Thin pliegos (the three Vinos de Pago) give short guides. That is the rule working, not a fault.
- A checker that is too lenient. The sample in step 6 is there to catch it.
- Sonnet drifts from the source words. Steps 4 and 5 catch it, at the cost of a rewrite.
- Shape C is not merged yet. The guides carry `beat` tags, which the current page ignores, so they read fine in either layout.
- Fact sheets cite EU single documents. Where the pliego says otherwise, the sheet is fixed in this PR (as the pilot did).
- Not in this slice: photos, map flags and Study flags for Castilla y León. They need their own slice.

## Effort
About 3 to 4 hours wall clock. Helpers: 1 sources run, 16 writers, 16 checkers, all Sonnet except the checkers (Opus).

## Result (19 Oct 2026)
16 guides written and checked. $1.48 per guide measured (session cost $23.66 [V]); the helpers were 2.1M tokens, the rest was the
thread re-reading itself between runs. 36% of Sonnet sentences needed a fix, so the per-sentence check stays. Hand sample of 3
guides found no missed fact. Next: a fixed script runs the helpers, so no long thread sits in the middle. Handoff:
`docs/handoffs/2026-10-19-cheaper-guide-writing.md`.
