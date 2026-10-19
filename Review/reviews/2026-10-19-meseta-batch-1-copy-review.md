# Review: PR #132 Meseta batch 1 (f7349aa), code review, copy focus

**Verdict: merge after fixes. Blockers 0, major 0 (should fix: 1), minor/notes 3.**

## Checks
1. Copy [ran grep over all 12, read la-mancha, manchuela, dehesa-del-carrizal in full]
   - "Quiz", "Terroir guide", WSET, exam, dark mode: none found. confirmed [ran]
   - "chalk": only as internal chapter ids (`vinos-de-madrid.json` "sierra-and-chalk", `calzadilla.json` "chalk"); visible text says limestone/limy. confirmed [ran]. Note: ids could show in URLs/anchors; harmless but rename if ids are user-visible.
   - Positioning: no exam framing in the 3 read guides. confirmed [read]
   - Fact spot-checks (15 sentences against extracts) all confirmed [ran grep]:
     La Mancha: 300-350 mm, 3,000 h, Miocene limestone/marl/sand, 86%, 74 l, 22 C, 10,000/13,000 kg, Premium/Reserva (extract p7, p4, p5 lines 237-350).
     Manchuela: Júcar/Cabriel, May-Sept, clay over limestone, polyphenols/low pH, 34 wineries/900 growers (lines 289-371).
     Dehesa del Carrizal: 26.2764 ha, 25% of must/20 C, 60 days, Peñín "Atlantic", thyme/rosemary/heather/pine/eucalyptus (lines 199-329).
   - SHOULD FIX (copy rule "no X, Y and Z lists"): visible chapter titles use three-item lists: `la-mancha.json` "Dry, hot and bright"; `los-cerrillos.json` "Sun, frost and a late harvest". Body text has ~13 more (e.g. mondejar "fresh and harmonious" is a pair, but "fruity, fresh and ..." in ucles, mentrida "alcohol, acidity and leftover sugar", manchuela "Crianza, Reserva and Gran Reserva"). Grape names and the label terms are facts, so leave those; fix the titles and the descriptive adjective triples (ucles "pale yellow, fruity and fresh", "white, pale and bright"; la-mancha "limestone, marl and sand" is a source triple, acceptable). Fix: rewrite titles as one idea, e.g. "A dry, bright plain" / "A late harvest after frost". Wording is the owner's to approve. [ran grep, R on count]
   - Minor: dehesa lede "Critics find no warm notes" while source names one critic "entre ellos" (Peñín among others). Defensible; body names Peñín. note.
2. Fact sheet `content/facts/meseta.json`: all 25 sheets have main grapes as `{local, ...}` objects (0 bad). confirmed [ran]. Shortened why lines keep source facts: Mondéjar (40 C / -8 C, deep red potassium-rich soil, fruity and fresh, Malvar/Torrontés) matches extract lines 230-239; Manchuela (two valleys, hot, sunny, no rain May-Sept, clay over limestone, Bobal aromatic and deep colour) matches lines 307-319. confirmed [ran].
3. Code [read]
   - `src/facts/check.ts`: guard correct, rejects non-object and non-string `local`. Fine.
   - `Tools/guides/oneshot.py set_path`: for `famous.styles.2.text` the loop walks into list item 2 (a dict), writes `text`, and `cite` lands on that item (`styles[2].cite`), which is the right node. Note (minor): a path ending in a list index (e.g. `grapes.main.1`) returns early and drops `cite`; no non-numeric guard, so a bad index raises IndexError/ValueError (headless wraps it as NOT applied). Fix: acceptable; optionally set cite on the parent.
   - `headless.py apply_sheet`: wraps `grapes.main` names into objects and logs "NOT applied" instead of aborting. Fine. [read, not run]
4. Tests [read diff; ran vitest facts+guides: 21 passed]
   - guide.spec "no guide" tests now Valdepeñas: no guide file exists in content/guides; title/Test-me strings updated consistently. OK.
   - facts.spec Somontano: sheet has empty `main`, still tests "no main grape, shows Also allowed". OK. Vallegarcía: sheet exists, no guide, no measured climate assertions unchanged. OK. UI not run (per card); handoff claims 28 passed [R].
   - Note: both fixtures run out when Valdepeñas/Vallegarcía get guides (already listed in handoff Open).

## Findings
| # | Severity | Where | Fix |
|---|---|---|---|
| 1 | should fix | la-mancha.json chapter 2 title, los-cerrillos.json "Sun, frost and a late harvest", plus adjective triples in ucles/mentrida | rewrite as one idea per line |
| 2 | note | chapter ids "chalk", "sierra-and-chalk" | rename to "limestone" for consistency |
| 3 | note | oneshot.set_path list-index ending drops cite | optional |
| 4 | note | dehesa lede "Critics" vs one named critic | optional |
