# Italy plan (draft for the owner, 22 Oct 2026, issue #149)

Source report: `Review/countries/italy.md` (21 Oct 2026). Data pulled: `Review/countries/coverage.md` (22 Oct 2026).
Built on the France plan (`Review/countries/france-plan.md`, decisions #52-#58). Decisions below are open until the owner answers.

## Context
- Order decided: Portugal, then France, then Italy [O, `docs/PROJECT.md`].
- Italy: 411 wine PDOs + 111 PGIs, 3.9x Spain [V, eAmbrosia]. Levels: DOCG (~77), DOC (~330), IGT (~111) [R].
- Already on disk: all 522 names, 514 EU single documents (Italian), ISTAT municipal limits, Piemonte's official DOC and DOCG areas [V, coverage.md].
- Missing: outlines outside Piemonte (354 PDOs); the national rulebooks (disciplinari): the MASAF page held no direct links [V], where they live is still to find.
- Missing too: TINITALY 10 m terrain (CC BY 4.0 [V]), a clean open orthophoto (none found; Esri only), geology with a clear licence.
- 197 names changed since their EU document [V]: current text must come from the national decree, not the 2014 transfer.
- WSET L3 lists about 40 Italian names in 14 regions [V, names only]; Italian Wine Scholar has two units, North and Centre-South [R].
- Italy has regions (regioni) as a real level; some appellations cross them (Prosecco, Delle Venezie, Lugana) [R].

## Phases
0. Gate: France pilot merged, with its tokens per guide logged. Italy reuses its lessons (nesting, zones, a third country file).
1. Data slice, no guides (scripts, no agent loops):
   find where MASAF publishes the disciplinari and fetch the two pilot texts;
   Barolo from the Piemonte file; Chianti Classico from its municipality list plus ISTAT, part-municipality limits noted;
   check both against the Candiago 2022 set (licence read first);
   TINITALY altitude and slope, Köppen cut to Italy;
   Italy in its own data file with its own size limit in `Tools/check.sh`;
   every source in `data/SOURCES.md`.
2. Pilot: Barolo and Chianti Classico guides on the local route, from the disciplinari (Italian sources, English text).
   Pages at `/it/<place>/` (#48). Rough map screenshots to the owner, then one PR. Tokens per guide logged (re-read and new).
3. Scale, one region per session, each on the owner's word:
   Piemonte; Tuscany; Veneto; Alto Adige, Trentino and Friuli; Centre (Marche, Umbria, Lazio, Abruzzo);
   South (Campania, Puglia, Basilicata); Sicily. About 7 sessions.
4. Later: Italian Wine Scholar filter (North, Centre-South); Guides page grouping for Italy (region first);
   map tours for the DOCG tier under the #148 rule.

## Decisions for the owner (one recommended each)
1. Timing.
   A (recommended): Italy pilot right after the France pilot, before France's regions. Two pilots first, then scale both.
   B: Italy waits until all ~60 French places are done.
2. Scope.
   A (recommended): the WSET L3 list, about 40 places, region by region.
   B: all DOCG, about 77. C: all 411 (not affordable).
3. Pilot pair.
   A (recommended): Barolo (official outline) and Chianti Classico (municipality outline). Tests both outline routes.
   B: Barolo and Prosecco (tests the cross-region case instead).
4. Outlines.
   A (recommended): official where a region publishes one (Piemonte, maybe Bolzano); else the municipality list plus ISTAT,
   with "approximate" in the credits line (same idea as #58).
   B: municipalities everywhere (loses Barolo's precision). C: official only (Piemonte alone).
5. Sub-zones (Barolo MGA, Chianti Classico UGA).
   A (recommended): zones inside the appellation, like France's climats (#55), where an outline exists; else a text list.
   B: a text list in the guide only.
6. Umbrella names on the L3 list (Toscana, Sicilia, Puglia, Terre Siciliane, Delle Venezie IGT/DOC).
   A (recommended): named in their region's text, no place of their own (as Castilla y León VdlT in Spain).
   B: full places with outlines.
7. Cross-region appellations (Prosecco, Delle Venezie, Lugana).
   A (recommended): home parent is the region with most of the area; "also within" the other (#42).
   B: a "multi-region" parent.
8. Map layers.
   A (recommended): Esri imagery only; TINITALY terrain; geology off in the pilot;
   LeadBot drafts an ISPRA licence email the owner sends (as the BRGM email, #57).
   B: also probe the AGEA 2012 orthophotos first (old, licence unclear).

## Upside
- Second-largest WSET list after France (about 40 vs Spain's 19) and its own Wine Scholar course.
- Piemonte's 1:10,000 outlines (CC BY 4.0) and a 10 m national terrain model beat Spain's sources [V].
- The pilot proves the municipality-outline route on one place before ~38 more are paid for.

## Risks
- No national outline layer: most places are approximate; part-municipality limits (Chianti Classico, Etna contrade) need hand work.
- The disciplinari are not yet found as direct links; if they sit only in the Gazzetta, each place needs a lookup [A].
- Many rulebooks changed since 2014 (197 names): a stale text is the main factual risk.
- Italian text through the pack and check scripts is untested [A]. Geology may stay missing for most places.

## Effort (tokens)
- Rate: Portugal guides 0.75M each [V, `docs/PROJECT.md`]; Meseta 0.55-0.62M [V]. Italy assumed at the Portugal rate [A];
  re-measure on the France pilot before Italy starts.
- Pilot guides: 2 x 0.75M = ~1.5M, about 90 percent re-read (Ebro split [V]).
- Pilot engineering (disciplinari source, outlines, regions level, layers): ~5-10M [A]; the Portugal pilot spent 18.9M re-read,
  mostly tooling [V]; the country model is paid, so Italy should be lower. Hard stop at 1.5x and report.
- WSET L3 list: 40 x 0.75M = ~30M [V rate, A scope], region by region, about 90 percent re-read.
- This plan: one session, ~0.3M so far, almost all re-read [A, no meter read].
