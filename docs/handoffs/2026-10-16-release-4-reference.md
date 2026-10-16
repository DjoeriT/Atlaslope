# Handoff: release 4, the reference (16 Oct 2026)

## Done
- Fact sheets for all 79 quizzed places, every row cited (`content/facts/`, `content/sources.json`); build check `checkSheets` in Vitest.
- Measured altitude and Köppen rows (`Tools/data/measure_places.py`, `data/place-measures.json`).
- 149 open-licence photos for 77 places, picked from contact sheets, resized in Actions (`Tools/data/photo_ship.py`), credited in `data/photos.json` and `data/SOURCES.md`.
- Grapes in search; "and N more" for long grape lists.
- Rioja zones rewritten from the current pliego (Consejo Regulador copy, AM10, 2023).
- PRs #23 and #24 merged after green CI and ReviewBot (sheets, code, Rioja zones). Published as release 4 on b5c773b.

## Decided (owner, cards and words, 16 Oct)
- Main grapes: pliego, then Wikipedia; planted area for the gaps in release 4.1.
- "Report a mistake" left out for now (`strings.facts.reportAddress` = "").
- Release 4.1 right after: tasting row and famous styles from the official documents; producers in v1, up to three per place from Spanish Wikipedia, owner can swap (`docs/scope.md`).
- Rioja and the Canary Islands signed off ("for now").

## Open
- 30 sheets without a main grape; Jerez and Manzanilla without photos.
- MAPA's host refuses GitHub Actions; the DOP report's variety table is unconfirmed. Next try: a session on the owner's Mac.
- Code review nits not done (`Review/release-4-review-code.md`): photo_ship exit code, empty photo list, page-URL and source-id checks.

## Where things are
Digest `Review/release-4-digest.md`; cards `Review/release-4-card-*.md`; reviews `Review/release-4-review-*.md`; tester note
`Review/release-4-what-to-test.md (now in Review/archive/)`; spend `Review/agent-spend-log.md`; source scout `Review/sources/`; fetched texts `Review/sources/fetched/`.
