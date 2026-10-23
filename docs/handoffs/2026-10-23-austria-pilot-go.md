# Austria pilot: go (23 Oct 2026, issue #149)

Gate open: Germany pilot merged and live (release 74), decision #81. Pilot pair Wachau and Neusiedlersee (#94, amends #83).
Brief for a fresh session; the Germany planning session is too long to build in. Same steps as the Germany pilot
(`docs/handoffs/2026-10-23-germany-pilot.md`): data, wiring, guides, photos, ReviewBot, one PR, then ask for the release.

## Read first (sections only)
`Review/countries/austria-plan.md`; `Review/countries/austria.md` (desk report); `Review/countries/austria-prep/README.md`;
decisions #81-#86, #94; the Germany pilot PR #245 file list for the country wiring to copy (`de` -> `at`).

## Ready (this PR)
- `Tools/data/build_at_areas.py`; `data/countries/at/areas.geojson` (Wachau: Rieden closed at 150 m, 29.7 km2, approximate;
  Neusiedlersee: legal area, 25 Gemeinden, 998.9 km2 with the lake); zones `zones-wachau.geojson` (176, 100 KB),
  `zones-neusiedlersee.geojson` (138, 75 KB). Specs: Wachau BGBl. II 200/2020, Neusiedlersee BGBl. II 431/2020 Art. 2 (RIS, German).
- Licences: NÖ Rieden and Statistik Austria CC BY 4.0 [V]; Burgenland Rieden CC BY 4.0 on data.gv.at only [V catalogue].

## Decide in the pilot (screenshots to the owner)
- Neusiedlersee outline: legal area with the lake (999 km2) or Rieden closed (272 km2). Vine area ~60-65 km2 [A].
- Wachau KG mapping for "Spitzer Graben" and "Elsarn" [A]; Weinbaugebiet boundary regulation not fetched.

## Budget [V Germany rate 0.73-0.90M a guide]
Guides ~1.7M; engineering ~3-5M [A] (country template paid four times). Hard stop at 9M. First load: outlines and zones on demand.
