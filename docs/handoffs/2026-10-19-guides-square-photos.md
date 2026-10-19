# Guides page square photos (19 Oct 2026)

## Done
- Owner after release 54: mixed photo shapes "not great UX"; picked option A [O]: real squares, each crop checked.
- Card photos 1:1 with `object-fit: cover` and a per-photo `object-position` from `src/home/photoFocus.json` (missing key = centre;
  5 of 49 set: arlanza, arinzano, binissalem, lebrija, mentrida). Photo-less tiles 1:1. Featured block and region tiles unchanged.
- All 49 crops checked against the originals by LeadBot [V]; weakest: Ribera del Duero (trunk cut both sides), Valle de Güímar (palms lost).
- CLAUDE.md photo rule rewritten to match. A new guide photo shown on the page needs its crop checked (add a focus if centre cuts it).
- Release 55 tester note: `Review/release-55-what-to-test.md`.

## Open
- Same as `2026-10-19-guides-page-build.md` "Open" (Canarias tile, Rioja fill, Green Spain outlines, long phone page).
- No check stops an unchecked crop for a new guide photo [A]; a contact-sheet script could live in Tools/ if guides keep growing.

## Cost
- Builder ~57K [V]; LeadBot ~60K incl. 7 sheet images [A].
