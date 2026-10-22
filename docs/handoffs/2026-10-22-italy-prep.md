# Italy prep: rulebooks, licences, name table, pilot outlines (issue #149, 22 Oct 2026)

Plan: `Review/countries/italy-plan.md` (decisions #59-#66). This slice is data and research only: no app code, no `src/`, no
`content/`, no guide runs, nothing Portugal or France touch except one Italy block in `data/SOURCES.md` [V, git diff].

## Done
1. **Rulebooks (disciplinari).** MASAF page 4625 links four 7z archives (DOP A-D, E-N, O-Z, IGT), one PDF per name inside; the
   link hash lives only in the page HTML, so a script scrapes it, downloads, `bsdtar -xf` [V]. Barolo (9 pages) and Chianti Classico
   (21 pages) fetched to `data/raw/countries/it/disc/` (git-ignored), text clean [V, pdfinfo, pdftotext].
2. **Licences** (`Review/countries/italy-prep/sources-notes.md`): Piemonte areas CC BY 4.0 [V]; Candiago 2022 CC0 [V];
   TINITALY CC BY 4.0 with a named credit [V]; ISPRA 1:100,000 CC BY 4.0 [R]; ISTAT limits: no licence on the page [V], open.
3. **WSET L3 table** (`Review/countries/italy-prep/l3-table.md`): 42 names, all in the EU register; 7 umbrella (#64), Valpolicella
   (5 names) and Soave (3) families; 30 places to build (36 if every family name is its own place). Routes: 23 municipalities,
   6 Piemonte official, 1 Bolzano maybe. Crossing regions: Orvieto, Prosecco (Delle Venezie [A]). 7 have an EU amendment in progress.
4. **Outlines** (`Tools/data/build_it_areas.py`, `data/countries/it/areas-spec.json` -> `areas.geojson`, 9 KB, not loaded by the app):
   Barolo 70.9 km2 from the Piemonte file [V]; Chianti Classico 957.6 km2 from 9 ISTAT municipalities against an official 718 km2
   (EU file p4) [V]: 5 partial municipalities taken whole, so a third too big. The 4 whole municipalities alone give 478.6 km2.
5. **Italian text test.** `extract.py` finds no Spanish section marker in Italian texts and keeps every page [V]: Barolo 3,988 words,
   Chianti Classico 7,003 (about 10K tokens), including the control-body article and preamble. Keeping all is right for Italy: Chianti
   Classico's UGA annex (Allegato 3, pp. 18-21) comes after the control article, so a Spanish-style stop would cut it. No change made to
   shared tools. `pack.py` needs `content/facts/<region>.json`, which Italy does not have yet: untested [A].
6. **ISPRA email**: draft in `Review/countries/italy-prep/README.md`, for the owner to send (#66). Nothing sent.

## Decided (owner, 22 Oct 2026)
- #67: Chianti Classico is traced from the UGA annex in the pilot; the +33% municipality outline is not shipped.
- #68: Valpolicella and Soave are one place each, with styles: 30 Italian places.

## Open (owner)
- Franciacorta and Primitivo di Manduria are not in the L3 spec text; Recioto di Soave was kept though the helper did not find it there.

## Open (next session, the pilot)
- Barolo's PDF shows DM 17 Apr 2015 and the EU entry has an amendment in progress: look for a newer edition first.
- Barolo MGA: the disciplinare names the 181 MGA but their limits are not in this PDF; look for Piemonte's MGA layer or the annex.
- ISTAT licence (note legali); TINITALY tile names for the two places (browser look; download is by tile click).
- The other three MASAF archives (E-N, O-Z, IGT) are not fetched; fetch only when a region needs them.

## Cost
Helpers: rulebooks and licences ~0.10M, name table ~0.09M [V, task usage]. Main thread ~1.5M so far, mostly re-read [A, no meter read].
