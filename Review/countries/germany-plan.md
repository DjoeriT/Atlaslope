# Germany plan (owner approved, 22 Oct 2026, issue #149)

Source report: `Review/countries/germany.md` (21 Oct 2026; evidence weak, mostly search summaries [R]). Side by side: `Review/countries/compare.md`.
Built on the Portugal, France and Italy plans (`france-plan.md` #52-#58, `italy-plan.md` #59-#70) and their prep handoffs
(`docs/handoffs/2026-10-22-france-prep.md`, `-italy-prep.md`, `-portugal-pilot.md`). Decisions: `docs/architecture-decisions.md` #71-#78, all on the recommended option A [O].

## Context
- Order decided: Portugal, France, Italy [O, `docs/PROJECT.md`]; Germany fourth, "after a licence check" (`compare.md`).
- Germany: 19 PDOs + 27 PGIs [V, eAmbrosia count in `compare.md`]. 13 Anbaugebiete are the PDO level [R]; what the other 6 PDOs are is unchecked [A].
- Below the PDO: Bereich > Großlage (marketing umbrella, not terroir) > Einzellage (the real site, 1-200 ha) [R]. The interesting level sits below the place.
- 2021 wine law: pyramid by origin (Gebiet, Region, Ort, Lage); applies fully from vintage 2026 per one source [R, to check].
- Outlines: no national set [A]. Rheinland-Pfalz publishes Einzellagen as WFS, dl-de/by-2-0 [R]; other states unknown.
  Spec texts (Produktspezifikation) may list municipalities (Gemeinden) as Portugal's and Italy's do [A].
- Terrain: state 1 m DGM open [R]; imagery: state 20 cm DOP, Hessen open [R]. Geology: BGR national 1:250k, states finer, licences unknown [A].
- Climate: Köppen is almost all Cfb, so it says little; DWD 1 km grids would say more (terms unconfirmed) [R].
- WSET L3 German names: not counted. The spec PDF (Issue 2) is on disk in the France prep; its Germany section was not read [V that it exists, A content].
- VDP (Grosse Lage, Erste Lage) is a private classification, all rights reserved [A].

## Phases
0. Gate: Italy pilot merged (three pilots, then scale), unless the owner moves Germany earlier.
1. Prep slice, data and research only (as France and Italy prep: no `src/`, no `content/`, no guide runs; scripts, no agent loops):
   licences read on each dataset's own page: RLP Weinlagen, Hessen (Lagen, DOP, DGM), BW, Bavaria (Franken), BGR, DWD;
   the WSET L3 Germany name table and the 6 extra PDOs;
   Mosel and Rheingau specs from eAmbrosia or BLE, German text through `extract.py` (markers or keep-all, as Italy);
   pilot outlines (official layer, else municipality list plus the BKG municipal limits, "approximate" as #62);
   licence emails drafted for the owner to send where terms are unclear (as BRGM #57, ISPRA #66).
2. Pilot: Mosel and Rheingau guides on the local route, German sources, English text, pages at `/de/<place>/` (#48).
   Einzellagen as zones where a layer exists; slope from the finer terrain as a headline. Rough map screenshots first, ReviewBot, one PR.
   Tokens per guide logged (re-read and new).
3. Scale: the rest of the 13 by state, each on the owner's word: RLP rest (Ahr, Mittelrhein, Nahe, Rheinhessen, Pfalz);
   Hessische Bergstraße, Baden, Württemberg, Franken; East (Saale-Unstrut, Sachsen). About 3 sessions.
4. Later: Prädikat and Oechsle in Study; Lage cards if wanted; Landwein (PGI); Guides page grouping for Germany.

## Decisions (owner, 22 Oct 2026, all on option A)
1. Timing. A: prep slice now (data only, cheap, like France and Italy prep ran beside Portugal); pilot after the Italy pilot.
   B: nothing until France and Italy WSET waves are done.
2. Scope. A: all 13 Anbaugebiete as places (the whole country at about the WSET size). B: the WSET L3 names only (count unknown).
   C: also the 27 Landwein areas.
3. Pilot pair. A: Mosel and Rheingau (two states: tests the patchwork). B: Mosel and Pfalz (one state, one portal, less work).
4. Einzellagen. A: zones inside the place where an official layer exists (as climats #55, MGA #63); famous Lagen named in the guide; no guide each.
   B: a short Lage card format (new screen, new Format log entry). C: none, place outline only.
5. Bereiche and Großlagen. A: Bereiche named in the guide text; Großlagen explained once as marketing names, never drawn. B: Bereiche as zones.
6. VDP. A: named in the guide text as a private ranking, no map, no copied lists. B: left out.
7. Map layers. A: Esri imagery; state 1 m DGM for slope in pilot areas only; geology off in the pilot. B: also state DOP20 imagery (per-state credits).
8. Climate. A: Köppen as elsewhere, no new layer. B: DWD climate grid as a new layer (after its terms are read).

## Upside
- Best slope story of any country (Mosel, Rheingau); the finest open terrain and single-vineyard outlines of the five [R].
- Small: 13 places is the whole country, about Portugal's size, so Germany can be finished, not only started.
- Riesling and the Prädikat system are core WSET content.

## Risks
- Weak evidence: the report opened one PDF (unreadable); every licence and URL is [R] until the prep checks it.
- Per-state patchwork: 8 states, 8 portals and licences, each with its own credit line (dl-de/by-2-0 asks for owner and year).
- Specs are short and rarely give soil or climate [A]: the "why it tastes" text leans on geology and terrain sources.
- Einzellage counts (hundreds in RLP alone [A]) may blow the per-country data size limit in `Tools/check.sh`: simplify or load per place.
- German text through `extract.py`, `pack.py` and the checks is untested [A].

## Effort (tokens)
- Rate: Portugal guides 0.75M each [V, `docs/PROJECT.md`]; Meseta 0.55-0.62M [V]. Germany assumed at the Portugal rate [A];
  re-measure on the France and Italy pilots first. The report's ~3M a guide was from old whole-region runs: not used.
- Prep slice: ~0.3-0.5M, two Sonnet one-shot helpers (France and Italy prep helpers measured 0.09-0.12M each [V]); mostly re-read.
- Pilot: guides 2 x 0.75M = ~1.5M; engineering (per-state sources, Lagen zones, finer terrain) ~5-10M [A]. About 90 percent re-read
  (Ebro split [V]). Hard stop at 1.5x and report.
- Rest of Germany: 11 x 0.75M = ~8M plus outlines ~0.1-0.2M a place [A] = ~1-2M; about 90 percent re-read. Under the 20M line in total.
- This plan: one session, ~0.2M so far, almost all re-read [A, no meter read].
