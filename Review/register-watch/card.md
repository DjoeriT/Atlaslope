# Register watch pilot (option B): report

Status: done. Branch `claude/register-watch`, not pushed.

## Result
- `Tools/guides/watch_register.py`: one GET (6.6 MB, 11.6 s wall), 152 Spanish wine entries, 106 mapped to our place ids (all by file number, `euFile` in `data/places.json`; 0 by name; 46 register entries have no place of ours).
- First snapshot `data/register-snapshot.json` (90 KB). A second run on the same data reports "none" changed.
- Register changed after the newest official source date we cite: 83 of 106 covered places. Upper bound only: a contact edit also moves `modificationDate`. Full table: `run-1.txt`.
- "Newest source date" = newest of `<id>-doc`, `<id>-doc2`, `<id>-pliego` (kind official) in `content/sources.json`; a year-only date counts as 31 Dec. Wikipedia and the shared `mapa-list` are not counted. Zones (no own source) are not covered.
- The snapshot keeps OJ items (text, date, link) as well as the count; "OJ item" = a publication whose text starts "Official Journal" (Ares references are dropped).
- Issue text is printed ("Title: Source changes: <date>"), no issue opened.

## Official Journal items after our cited source date (`oj-after-source.txt`; titles are only the register's citation text, no amended text read)
- Rioja (pliego 2023-06-07): 20.9.2023 (C 331), 30.10.2024 (C/2024/6466), 29.1.2026 (C/2026/565). Amendment in progress: yes.
- La Mancha (EU doc 2014-06-27): 25.2.2021 (C 65), 25.4.2022 (C 170), 19.6.2023 (C 215), 25.10.2023 (L 2023/2298), 10.4.2025 (C/2025/2240), 19.2.2026 (C/2026/1048). Amendment in progress: yes.
- Priorat (INCAVI pliego Nov 2021, which is newer than the 2014 doc the first-principles report assumed): 6.9.2022 (C 341) only. Register changed 25 Aug 2026 (nothing new in OJ list). Links are in the file.

## Steps
- Script, snapshot, SOURCES.md row, README line, run output, OJ list: one commit.
- Tests: `watch_register.py --self-test` (compare logic on two tiny snapshots, date parsing, source dates, coverage) ok; `Tools/check.sh quick` green (4.5 s wall; ledger accepts the new file).

## Notes
- The list endpoint's terms were not found; SOURCES.md says so and tags it [A]. Reuse of the same Commission register is already recorded for the attachments.
- No pagination, key or refusal.
