# Handoff: release 6, tastes and producers (planned as 4.1, issue #27), 16 Oct 2026

## Done
- Three new fact-sheet rows, cited and checked by `checkSheets`: How it tastes (76 of 79), Famous styles (75), Famous producers (7).
  Types in `src/facts/types.ts`, rows in `src/cards/PlaceFacts.tsx`, taste lines split per colour (`tasteLines` in `src/facts/format.ts`).
- Sources: official extracts for tastes and styles; producers from English Wikipedia (`Review/sources/wikipedia-en/`, built by
  `Tools/data/wiki_en_notes.py` in the `data-wiki-en` workflow) and Spanish Wikipedia notes (`Review/sources/wikipedia-notes/`,
  `data-wiki-notes`). `build_fact_sources.py` now keeps the hand-added `rioja-pliego` and ships only cited 4.1 Wikipedia ids.
- MAPA DOP reports 2022-23 and 2023-24 fetched through the Wayback Machine (`Review/sources/fetched/wayback-*`).

## Decided (owner cards, 16 Oct)
- Ship without planted area if no source turns up (20:06Z). Producers from English Wikipedia (20:11Z).

## Open
- Planted-area main grapes for 30 sheets: issue #29 (the MAPA reports have no varieties).
- Producers are thin (7 places; Rioja has one). Owner (20:23Z): supplement later, issue #30. He may swap or add; each needs a citation.
- Jerez has no tasting row; Priorat, Sierras de Málaga and three others have no famous style (documents define none).
- `en.wikipedia` rate-limits the cloud container (429); fetch through Actions.

## Where things are
Digest `Review/release-4.1-digest.md`; writing card `Review/release-4.1-card-1-write.md`; review `Review/release-4.1-review.md`;
tester note `Review/release-6-what-to-test.md`; spend `Review/agent-spend-log.md`; screenshots in project files `atlaslope/release-4.1/`.
