# Germany rest: go (23 Oct 2026, issue #149)
Owner, 23 Oct 2026, verbatim: "Finish Germany first: the 11 remaining Anbaugebiete, then Austria." Taken as the word for all three waves
below [A]; each wave is still its own session and PR. Austria (#81-#86) starts only after Germany passes parity.

## Read first (sections only)
`.claude/skills/new-country/SKILL.md` (sections 3-5); `Review/countries/germany-plan.md` ("Phases" 3); `Review/countries/germany-prep/README.md`
and `specs-outlines.md`; the Germany pilot PR #245 description; `docs/architecture-decisions.md` #71-#78, #93.

## Where Germany stands [V, `python3 Tools/countries/parity.py germany`, 23 Oct 2026]
- Places 2 of 13 (Mosel, Rheingau), both with guides, tile lines and 4 photos each.
- Gaps: Rheingau outline (Hessen and BKG refused scripts), altitude, slope, Köppen, regions and country measured, country tile line,
  country photo blocks, mask, Atlas cover. Map flags, tours and Study are gaps for every country, not this slice.

## Waves (one session and one PR each; guides on the local route, `Tools/countries/<cc>_batch.py` pattern)
1. Rheinland-Pfalz rest: Ahr, Mittelrhein, Nahe, Rheinhessen, Pfalz. Outlines from the LWK RLP `gu` layer (holds Mittelrhein, Nahe, Pfalz;
   not Ahr or Rheinhessen [V prep]: those two from their spec's Gemarkungen plus BKG VG250). Einzellagen zones per place (#74), on demand.
   Also the Rheingau outline from its 32 Gemarkungen (browser try for Hessen/BKG first).
2. South and Hessen: Hessische Bergstraße, Baden, Württemberg, Franken. BW portal blocked, Bayern has no Lagen layer [V prep]:
   Gemarkung route, "approximate" (#62). Bürgstadter Berg and Würzburger Stein-Berg as zones in Franken (#93).
3. East and parity: Saale-Unstrut, Sachsen. Then close the gaps above: `Tools/data/build_masks.py` Germany mask,
   `koppen_country.sh germany` + `measure_places.py` (other countries' values unchanged, key by key), country tile line draft,
   country photo blocks. Parity table in the PR.

## Budget [V rates, A scope]
Guides 11 x ~0.9M (Germany pilot 0.73-0.90M, Italy 0.97M) = ~10M; outlines ~0.1-0.2M a place = ~1-2M; parity ~1M. Total ~12-13M,
about 85% re-read. Per wave: ~5M, ~4M, ~3M; hard stop at 1.5x of the wave's figure and report the re-read/new split.

## Gates
Rough screenshots of new outlines to the owner before each PR; tile lines and the country intro are drafts he rewrites.
New copy: ReviewBot before merge, auto-merge after its report. After each merge: ask "publish release N" in one line.
