# Meseta pilot (19 Oct 2026)

Pilot of the local route ("Run a region locally", `docs/PROJECT.md`): 2 of 25 places, then (owner: "let's do it")
the fact sheet step moved into the checker + a script, measured on 2 more. 4 of 25 guides written. Nothing committed or pushed; the owner sees the
numbers first. Working tree of `claude/claude-md-split`.

## Done
- Prep fix (PROJECT.md "prep fixed first"): the sources step is a script, `Tools/guides/sources.py <region> [--fetch]`. It maps each
  fact sheet's `<id>-doc` to its text in `Review/sources/fetched/`, converts EUR-Lex/Cellar HTML to .txt once, cuts it with extract.py and
  writes `Review/guides-pipeline/meseta/manifest.json`. Meseta: 25/25 ready, all texts were already fetched, no agent needed [V].
  New files: 5 `oj-*.txt` (La Jaraba, Los Cerrillos, Rosalejo, Río Negro, Vallegarcía). The `--fetch` Cellar SPARQL path is untested.
- Runner: `Tools/guides/headless.py [--budget M] <region> <run dir> <id>...`, one fresh `claude -p` per helper (Sonnet writer, Opus
  sentence check, Opus fact sheet run when the check reports disagreements), prompts as in `region.workflow.js`. Transcripts land in the
  run dir for `usage.py`. Fixed after the pilot: the 1.5x stop counted only the places of the current call, so it stopped falsely after
  place 2 (1.86M against a limit it took as 1.2M; the real 2-place limit is 2.4M).
- Guides: `content/guides/mondejar.json` (430 words), `content/guides/rosalejo.json` (560 words); check_guide.py 0 errors [V]
  (Mondéjar: one number warning, "21", left for the sentence check). Check logs in `Review/guides-check/`. Fact sheet: 5 edits applied,
  1 skipped, in `content/facts/meseta.json` (logged in `Review/guides-pipeline/meseta/fact-sheet-fixes.md`).

## Measured [V, `usage.py --budget 0.8 --places 2`]
| | re-read | new | total |
|---|---|---|---|
| Mondéjar (write, check, sheet) | 0.63M | 0.20M | 0.83M |
| Rosalejo | 0.90M | 0.13M | 1.03M |
| Per guide, average | 0.77M | 0.17M | 0.93M |
| Fact sheet step alone, average | 0.33M | 0.04M | 0.37M |
| This session (setup + running, 46 calls) | 5.20M | 0.12M | 5.32M |

Projection for 25 [A, from 2 guides]: 25 x 0.93M = ~23M helpers, plus ~1.5-2M per batch session. Above the 20M approval line.
Cheaper: make the fact sheet edits by script (as `oneshot.py apply` does) instead of an Opus run: ~0.56M per guide, ~14M for 25 [A].

## Second pilot: fact sheet step by script [V, `usage.py --budget 0.6 --places 2`]
The checker now returns fact sheet fixes as ready edits (path, value, cite, sure); `headless.py` applies the sure ones with oneshot.py's
`set_path` and logs every one in `fact-sheet-fixes.md`. No Opus sheet run.
| | re-read | new | total |
|---|---|---|---|
| La Mancha (13-page source; 7 sheet edits applied) | 0.39M | 0.12M | 0.50M |
| Los Cerrillos (1-page EUR-Lex; 2 applied, 2 unsure) | 0.68M | 0.11M | 0.79M |
| Per guide, average | 0.53M | 0.12M | 0.65M |
| This session, all of it (59 calls) | 7.08M | 0.14M | 7.22M |

Projection [A, from 2 guides]: 21 places left x 0.65M = ~14M helpers, plus ~1.5-2M per batch session; all 25 ~16M + sessions.
Guides: la-mancha.json, los-cerrillos.json, 0 errors [V]. La Mancha warns "every flight goes to the place itself".

## Open
- Owner: go on with the 21 places left in batches of ~8 (route step 5), ~14M + batch sessions.
- Los Cerrillos: 2 unsure sheet edits not applied (move its four grapes from "others" to "main", pliego p1 "Principales"); in
  fact-sheet-fixes.md. Decide in batch 1.
- Not run: `npm test` (roster in `tests/unit/guides.test.ts`, "no guide" UI fixtures, satellite tile): batch work (route step 5).
- Run dirs with transcripts were in this session's scratchpad (temporary); the tables are the record.
