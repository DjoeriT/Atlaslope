# France plan (owner approved, 22 Oct 2026, issue #149)

Source report: `Review/countries/france.md` (21 Oct 2026). Decisions: `docs/architecture-decisions.md` #52-#58.
Start gate: the France pilot waits until Portugal's mainland is done and #205 (Portugal photos) is merged [O].

## Context
- Spain complete (106 places) [V]; Portugal pilot (Douro, Vinho Verde) merged at `/pt/` [V]; rest of Portugal open.
- France [R, report]: 386 wine AOPs, nested (Bourgogne > Côte de Nuits > Gevrey-Chambertin > Premier Cru climat).
- INAO parcel boundaries are open (data.gouv.fr, 255 MB shapefile); IGN BD ORTHO imagery is open with no key; BRGM geology licence is unclear.
- WSET L3 names about 60 places; Wine Scholar Guild has a French Wine Scholar course.
- Bordeaux classifications (1855 and others) rank châteaux, not land: no boundaries.

## Phases
1. Data slice, no guides: cut the 2 pilot AOPs plus Chablis Grand and Premier Cru climats from the INAO file, simplify,
   France in its own data file with its own size limit in `Tools/check.sh`; IGN BD ORTHO after a speed test, Esri fallback;
   BRGM geology layer; Köppen cut; every source in `data/SOURCES.md`.
2. Pilot: Chablis and Pauillac guides on the local route (`docs/PROJECT.md` "Run a region locally"), from the INAO cahiers des
   charges (French sources, English text); pages at `/fr/<place>/` (#48); rough map screenshots to the owner, then one PR.
   Log tokens per guide (re-read and new) in the handoff: the Portugal run files hold none.
3. Scale: the WSET L3 list, one region per session: Burgundy, Bordeaux, Rhône, Loire, Alsace, Champagne, South and South-West (about 8).
   Each region waits for the owner's word (above 20M in total).
4. Later: French Wine Scholar course filter; Guides page grouping for France (region, then sub-region).

## Decisions (owner, 22 Oct 2026, all on the recommended option)
1. Timing: after Portugal's mainland and #205.
2. Scope: WSET L3 list first (108 names, about 96 appellations), region by region; the other PDOs later (owner, kept 22 Oct 2026).
3. Pilot pair: Chablis and Pauillac.
4. Grand and Premier Cru climats drawn as zones inside the village AOP, in the pilot.
5. Bordeaux classifications: a text list in the guide, no map layer.
6. Licences: LeadBot reads INAO re-use terms and drafts a BRGM email the owner sends, before the pilot ships.
7. Outlines marked "for information" in the credits line (INAO's plans portal is the only binding map).

## Upside
- Best open data of the four countries compared [R, `Review/countries/compare.md`].
- Largest WSET country and its own Wine Scholar course.
- Nesting is tested on 2 places before 60 are paid for.

## Risks
- Outline size: 10-40 MB before simplification [A]; Spain's `dops.geojson` is 1.6 MB.
- Nesting is new for map, breadcrumbs and Guides page (overlap rule #42 covers the model).
- French sources slow the checks [A]; BRGM licence open.

## Effort (tokens)
- Rate: Portugal guides 0.75M each [V, `docs/PROJECT.md`]; Meseta 0.55-0.62M [V]. France assumed at the Portugal rate [A].
- Pilot guides: 2 x 0.75M = ~1.5M, about 90 percent re-read (Ebro split [V]).
- Pilot engineering (INAO cut, nesting, layers): ~5-10M [A]; the Portugal pilot session spent 18.9M re-read, mostly tooling [V],
  and the country model is now paid, so France should be lower. Hard stop at 1.5x and report.
- WSET L3 list: about 96 appellations x 0.75M = ~72M [V rate, A scope], region by region (Burgundy first, 28 names).
- All PDOs later: 368 guides ~276M, or ~286 ~215M with Grand Crus as zones [V counts, A scope]; each region asked first.
