# Germany pilot: go (23 Oct 2026, issue #149)

Gate open: France pilot #228 and Italy pilot #231 merged (05:45Z) [V]; decision #71. Owner goal (22 Oct 2026): Germany live after
France and Italy, then Austria (#81-#86) and Greece (#87-#92). This is the brief for a fresh session: the planning session was too long to build in.

## Read first (sections only)
`Review/countries/germany-plan.md`; `Review/countries/germany-prep/README.md` (+ `specs-outlines.md` for the Mosel WFS layers);
`docs/architecture-decisions.md` #71-#78, #93; `docs/handoffs/2026-10-23-italy-first-wave.md` ("Done", "Numbers") for the Italy tooling
to copy: `Tools/countries/it_wset.py`, `it_batch.py`, `data/countries/it/places.json`, `photo_candidates.py it`, `IT_SHIP`.

## Scope
- Mosel and Rheingau at `/de/<place>/` (#73), Germany as the fifth country. English text from the German specs (BLE Mosel AM04;
  Rheingau 2019 spec + 2026 amendment) on the local route.
- Outlines: Mosel from the LWK RLP WFS `gu` layer, closed at 150 m, simplified 40 m (86 KB, "approximate"); Einzellagen from
  `weinlagen_recht` as zones (#74), with the 6 single-vineyard PDOs as zones too (#93). Rheingau: the 32 Gemarkungen of the
  2026 amendment; Hessen and BKG hosts refused scripts, so try a browser first [V refusals].
- First load has ~100 KB left (2.1 MB, #38): German outlines and zones load on demand. Raw files into `Tools/data/raw-manifest.json`
  (already in `~/Developer/Atlaslope-raw/countries/de/`).
- Layers: Esri imagery, state 1 m terrain for slope in the two places only, no geology (#77); Köppen only (#78).
- Credits: dl-de/by-2-0 lines ("©LGB-RLP (year), dl-de/by-2-0", LWK RLP, BKG) in `data/SOURCES.md` and the credits line.

## Budget [V Italy pilot rate]
Guides 2 x ~0.97M = ~1.9M; engineering ~5-8M [A] (country template now paid three times). Hard stop at 12M and report the re-read/new split.

## Gates
New screen and copy: rough screenshots to the owner first, ReviewBot before merge, merge on green after its report.
After merge: ask "publish release N" in one line; only his typed words publish.
