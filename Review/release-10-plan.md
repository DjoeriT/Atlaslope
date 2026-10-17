# Plan: release 10, place guides

Mock: /mnt/project-files/atlaslope/mocks/guides-v1/ (also on the Mac in ~/Developer/Atlaslope/mocks/guides-v1/). Design and source check:
/mnt/project-files/atlaslope/reviews/2026-10-17-guide-mock-design-check.md (2 source must-fix, 4 should-fix, all applied except: the small
"On the map" label stays on every pill, since it says what the button does; aria-labels added instead).

## What gets built
- "The guide" section on the place page, after the overview, for Rioja and its three zones (scope: Rioja plus three zones [O, 16 Oct 12:34Z]).
  Text lives in content/guides/<id>.json: chapters, each with its source cites and fly-there targets (a place boundary or a named point).
- Fly-there: closes the page, flies the map, shows a caption card with its source and "Back to the guide" (returns to the same chapter).
- "Test me on X": starts a practise round on that place and its zones, on every place page (default [A]; places without a guide get only this box).
- Fix: "1 places to learn" plural slip on the region page.

## Context
Release 9 built the place page this section slots into; the quiz already supports a practise round on a chosen set of places.
All guide text comes from the Rioja pliego (pp. 15, 16, 19, 20) and the EU single document (p. 5). About 550 words for Rioja,
below the scope's 600 to 800, because the sources say no more.

## Upside (measured at the end)
- 4 places with a guide; every fly-there button (Rioja 7) lands on the place or point it names, checked by a UI test per button.
- Every guide sentence traced to a cited page by ReviewBot (sentence-by-sentence check, as on the mock: 2 of about 30 sentences failed and were fixed).
- "Test me" on all 109 place pages starts a round containing only that place and its zones (UI test on Rioja and on a place with no zones).

## Risks
- Fly-there over satellite only checkable on the live site (tiles blocked here).
- Named points (Sierra de Cantabria, Haro station quarter) are coordinates picked by hand [A]; the review checks them against the boundary data.
- Zone guides are short (about 150 words each); the pliego says little per zone.

## Effort (tokens, Sonnet unless named; anchors from Review/agent-spend-log.md)
| Part | Estimate | Anchor |
|---|---|---|
| Lead thread (Opus): mock, zone texts, cards, fixes | 150 to 250k | not measured before [A] |
| Design check on the mock (done) | 46k measured | release 7 check 46k |
| BuilderBot: guide section, data file, fly-there, Test me, plural fix, tests | 150 to 200k | release 9 card 1 189k, card 2 110k |
| ReviewBot: code plus source check | 60 to 90k | release 8 47k, release 9 64k, release 7 89k |
| **Total** | **about 0.4 to 0.6 M** | brake at 50% over: 0.9 M |
