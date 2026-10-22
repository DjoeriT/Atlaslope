# Italy outlines: 87 first-wave places (issue #149, 22 Oct 2026)

## Asked
- Owner goal: build the Italy guides after the France session is done; first the 30 WSET places, then (#80) every DOCG. Photos are part of the guides.
- "1 Yes" on Candiago for boundary-only rulebooks (#79), "You can merge it", "Keep going tonight".

## Done
- PR #220 (merged): outlines for the 30 WSET places; decision #79.
- PR #226: 57 more DOCG outlines; decision #80. `data/countries/it/areas.geojson` holds 87 outlines (631 KB), not loaded by the app.
- Routes: Piemonte official (20), MASAF art. 3 municipality lists + ISTAT (57), Candiago 2022 (10). The details and outliers vs Candiago are in `data/SOURCES.md`.
- `Tools/data/build_it_areas.py`: whole provinces, "Name (XX)" for duplicate municipality names, a `candiago` route, unioned Piemonte sub-zone rows.
- Issue #224: guide-a.spec flaky test (failed on main too).

## Open
- 87 places vs the owner's 96: MASAF's rulebooks give 78 DOCGs [V]; 21 sit inside the WSET places.
- Raw store lost: the main folder's `data/raw` became a self-symlink (#214), fixed by France's PR #223. Re-fetch Italy's raw files (ISTAT, Piemonte, MASAF 7z x3, Candiago, att/) after #223 merges. Committed data is safe.
- Approximate outlines to revisit in their region sessions:
  - inflated by partial municipalities taken whole: Frascati (Rome), Colli Bolognesi Pignoletto x2.1, Conero x1.6;
  - too small: Asolo Prosecco x0.41;
  - merged-municipality renames from memory [R]: Faedo, Trentino and Oltrepò.
- Not started: terrain/Köppen for Italy (the Köppen raster isn't on this Mac, a shared problem), and photos (`photo_candidates.py` needs Italian words and categories, after France is done with it).
- The Italy pilot (Barolo, Chianti Classico) waits for the France pilot merge (#59). France will send its tokens per guide and its lessons.

## Cost
- This stretch [A, no meter read]: about 6M re-read, 0.3M new; helpers 0.28M (two Sonnet runs).
