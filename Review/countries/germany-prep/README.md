# Germany prep (22 Oct 2026, issue #149, decisions #71-#78)

Data and research only: no `src/`, `content/`, shared tools or guide runs. Two Sonnet one-shot helpers (~0.11M and ~0.10M [V, task usage]).
Detail: `l3-table.md` (WSET names, eAmbrosia), `licences.md`, `specs-outlines.md` (Mosel and Rheingau).

## Findings
- WSET L3 names 32 German terms [V]: 7 Anbaugebiete (no Ahr, Mittelrhein, Württemberg, Hessische Bergstraße, Saale-Unstrut, Sachsen),
  9 villages, law terms, grapes. No Bereich or Einzellage. #72 (all 13) stands: the other 6 are text-light places.
- eAmbrosia: 19 German wine PDOs [V]; the 6 beyond the 13 are single-vineyard PDOs (Bürgstadter Berg, Monzinger Niederberg,
  Uhlen Blaufüsser Lay, Uhlen Laubach, Uhlen Roth Lay, Würzburger Stein-Berg). Zones inside their Anbaugebiet (#93) [O].
- Mosel: spec BLE AM04 (approved 5 Dec 2025, OJ C/2026/1628), 12 pp, delimited by 199 Gemarkungen [V]. Outline: LWK RLP WFS
  (geodaten.lwk-rlp.de, dl-de/by-2-0) layer `gu`, 118.8 km2 dissolved, 48 invalid polygons to repair; `weinlagen_recht` 462 Einzellagen [V].
  Raw 12.7 MB; simplified 40 m = 610 KB and -8% area: too heavy and too lossy, needs a per-place file or a better simplify.
- RLP Einzellagen also as LGB-RLP dataset BFD5W, dl-de/by-2-0 per its metadata (open.rlp.de says CC0: take the stricter) [V].
- Rheingau: 2019 spec (12 towns), first amendment BAnz 9 Jun 2026 lists 32 Gemarkungen [V]. No official outline found; Hessen and
  BKG hosts refused the helpers (403) [V]. Route: the 32 Gemarkungen from Hessen's ALKIS or BKG once reachable.
- `extract.py` keeps every page of all German texts [V]; Rheingau amended spec could STOP at "11. Namen und Anschrift der Behörde" (p18).
- Licences: Hessen DGM/DOP open by law [V, family]; BKG VG250 dl-de/by-2-0 [R credit]; BGR GÜK250 GeoNutzV [V metadata]; BW blocked; Bayern no Lagen layer.

## Open
- Raw downloads (93 MB, 54 files) copied to `~/Developer/Atlaslope-raw/countries/de/`, the out-of-repo store from #229;
  add them to its re-download manifest in the pilot, once #229 is merged.
- Pilot: Rheingau outline source; Mosel outline size; Hessen and BKG hosts from a browser.

## Mosel outline: size options (LeadBot, 22 Oct 2026, measured on the LWK `gu` layer, EPSG:3035) [V]
The `gu` layer is the vineyard land itself (118.8 km2 in 5,304 bits), not a municipal envelope like Portugal's or Italy's outlines.
It also holds Mittelrhein, Nahe and Pfalz (not Ahr or Rheinhessen). Ways to make it app-sized (Portugal's whole file is 368 KB):
| Route | km2 | Parts | Size |
|---|---|---|---|
| Union, simplify 40 m (helper) | ~109 (-8%) | 5,304 | 610 KB |
| Close gaps 50 m, simplify 20 m | 173.7 | 528 | 216 KB |
| Close gaps 150 m, simplify 40 m | 215.7 | 208 | 86 KB |
| Close gaps 300 m, simplify 40 m | 276.5 | 83 | 54 KB |
Recommended for the pilot [A]: 150 m (86 KB) as the place outline, marked "approximate" (as #62), with the Einzellagen as zones (#74)
carrying the precise shapes per place. To decide in the pilot, with screenshots.
