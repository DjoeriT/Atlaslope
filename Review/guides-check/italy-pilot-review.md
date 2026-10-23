# Italy pilot review (design/QA), branch claude/italy-pilot, 22 Oct 2026

Verdict: ship with fixes. 0 blockers, 3 should fix, 4 notes.
Shots: shots/italy-pilot/{it,barolo,chianti,home,guides}-{d,m}.png (d 1440x900, m 390x844, full page). fr-d/fr-m for comparison.
Viewed: it-d, it-m, fr-d, barolo-d, chianti-m, home-d, home-m, guides-d. Not viewed: barolo-m, chianti-d, guides-m, fr-m (horizontal overflow measured 0 on all 12) [ran].

## Should fix
1. Chianti guide: "Winters can fall below 4-5 C" (chianti-classico, climate chapter). Source (disc-chianti-classico.txt l.450) says "temperature anche molto basse in inverno, al di sotto dei 4-5 gradi" with the sign dropped; 4-5 C is not "very low". Reads as a trivial or wrong claim. Check the source PDF for "-4/-5" and fix, or drop the figure. [read]
2. Photo credit line differs from the card's rule format. /it/ shows "Photos from Wikimedia Commons, cropped and resized. CC BY 2.0: Megan Mallen (2), ..." (grouped by licence). Same pattern as /fr/ and Spain, so it is the existing house style, not an Italy regression. Guide hero line is "Photos: Name · licence · cropped and resized". Owner to confirm the grouped form is what he wants; no change if yes. [ran]
3. Home: the Italy card wraps alone onto a second row (3-column grid, 4th country). Looks orphaned with a big empty right side (home-d.png). Fix: 4 columns at desktop, or 2x2. [ran]

## Notes
- Map credit "Italy outlines: Regione Piemonte (CC BY 4.0); elsewhere approximate, from ISTAT municipal limits" is in src/map/createMap.ts l.90, exact wording, global customAttribution (same as PT/FR). Not screenshotted open on the map; the "i" starts folded by design. [read]
- Italy card counts "2 regions · 2 guides" on Home and Guides, and /it/ [ran]. Breadcrumb on guide: "ITALY > PIEMONTE" (Barolo) and "ITALY > TUSCANY" (Chianti) with the title below: matches France's pattern [ran].
- Photos: /it/ grids are square-cropped, no cut faces or bottles seen (vineyards, village, vine, grapes). Barolo tile crop shows the village well. Hero crops fine. [ran]
- Footer on /it/, Home and Guides still says "Spain and Portugal", and Guides footer links "The Rioja guide" only. Pre-existing, also on France. Owner copy. [ran]

## Copy for the owner to rewrite
- /it/ intro "From the Alps to Sicily." (mirrors France's "From Champagne to the Mediterranean."). Note Sicily has no guide yet; the line promises more than 2 regions. Tile lines likewise. Draft, his call.
- Tuscany/Piemonte "1 guide" sections and "Learn: Not yet for Italy." are the France pattern.

## Guide copy (content/guides/barolo.json, chianti-classico.json)
- Not exam-centric; spine is "why it tastes the way it does". No "X, Y and Z" list violations found beyond a few natural ones: "Barolo, Castiglione Falletto and Serralunga d'Alba" (a factual list of three communes; rewrite if rule is strict) and "Greve in Chianti, Castellina in Chianti, Radda in Chianti and Gaiole in Chianti".
- Spot check against fetched sources, confirmed: Barolo 170-540 m (l.117), 7.2 t and 13.00% vol (l.157), Riserva 62 months/18 wood (l.275), vigna letters at most 50% (l.401), chinato (l.331), Tertiary ~70 million years (l.430). Chianti: 71,800 ha, 30,400 Florence / 41,400 Siena (l.430), max 700 m (l.135), 800-900 mm rain (l.454), 35 C days (l.451), Sangiovese 80-100% (l.49), galestro/scisti (l.441), iris and violet (giaggiolo, mammola, l.530). Not found by grep: Barolo "38 months" (table layout; Riserva row matched, so likely fine). [ran]
- Mild: Barolo "Some scholars think Langhe comes from 'langues'" is in the rulebook per the text; kept as attributed. "Tufa-rich" is a literal rendering of "tufacea" (marl); fine.

## LeadBot follow-up (22 Oct 2026)
- Fixed: Chianti winter figure dropped (the rulebook says "below 4-5 degrees" with no sign); Home and Guides show four country cards in one row at 1200 px and up.
- Left for the owner: the credit line format (house style, same on /fr/ and Spain), the /it/ intro and tile lines, the footer's "Spain and Portugal" (also on France).
