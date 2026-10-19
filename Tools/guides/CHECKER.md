# Guide sentence check brief (one guide per run)

You check one Atlaslope guide against its pliego, sentence by sentence. You start fresh. Fact rule: a guide says only what the
pliego says, on the page it cites. Every sentence, caption, label term and the lede is checked: nothing is sampled.

## Inputs (the run's prompt names the paths)
- The guide: `content/guides/<id>.json`.
- The pliego text, split into pages on form feeds. Read only the pages the guide cites, with `Tools/guides/pages.py <file> <n>...`.
- The fact sheet entry for the place.

## For each sentence
- **KEEP** when the cited page says it. Quote the Spanish words that say it, with the page.
- **FIX** when the page says something close but not the same (a hedge dropped, a number changed, a cause invented, a claim
  widened from one zone to all). Edit the guide so it says what the page says, and quote the words.
- **CUT** when no cited page says it. Look on the other pages first; if another page says it, FIX the cite instead.
Also FIX: lines about the source instead of the place ("the pliego says"), exam framing, Spanish terms left unexplained, comma
splices, "X, Y and Z" lists, and a cause-to-taste link the page does not make. Taste words must be the source's.

## Also check
- Flights: the pliego names the place, and the point is that place. Look each point up on OpenStreetMap Nominatim
  (`https://nominatim.openstreetmap.org/search?q=...&format=json&limit=1`, a User-Agent header, one request a second) and correct
  coordinates more than about 3 km off.
- Missing flights: if the guide only flies to the place itself but the pliego describes a named river, valley, mountain range or
  historic town worth seeing from above, add one flight for it (label, caption with cite, Nominatim point, zoom 8 to 11).
- Numbers: every number the machine check warns about is confirmed against the page (words and roman numerals count) or fixed.
- Label terms: the pliego defines the term, and the sentence carries its rule. A term whose rule the pliego leaves to other law
  ("legislación vigente") is CUT, since it only points elsewhere. A famous style (fact sheet `famous.styles`, or a style
  the rules beat describes) is not repeated in `label`: keep it in the rules beat and drop it from `label`.
- The fact sheet: list each field where it disagrees with the pliego (sheet says, pliego says, page). Do not edit the sheet.

## Output
1. The guide file, edited in place with your FIX and CUT changes. Then run `python3 Tools/guides/check_guide.py <manifest> <guide>`
   and fix every ERROR.
2. A log `Review/guides-check/<id>.md`: a header line (source, version), then per beat one line per sentence:
   `KEEP|FIX|CUT p<n> "<Spanish words>"` and for FIX/CUT what changed. Then "Fact sheet" with the disagreements.
3. A report in at most 6 lines: counts of KEEP, FIX, CUT, and the most serious problem you found.
