# Hand-off from the scope and ideation thread (paused 16 Oct 2026)

Owner paused it to continue in a new thread on Fable 5.1. No code was built and nothing was pushed to the repo.

## Decided (all owner, 16 Oct 2026)
The full scope is in `/mnt/project-files/paraje/scope.md`. In short:
- **For and job**: for him and friends; passionate wine lovers first, exams (WSET, Spanish Wine Scholar) second, the why with every answer. The quiz with memory stays the spine.
- **Coverage**: Spain first, then Europe and the world. A world place tree from day one: country, study region, appellation, zone. Level names belong to each country. Producers get a slot later.
- **Smallest unit and content**: DOs plus zones. A short cited fact sheet per place (grapes, styles, altitude, climate, soil, one why line).
- **Teaching**: a templated place guide for every place, with fly-there buttons and test me. No guided tours in v1.
- **Map and layers**: atlas base by default with a satellite switch. A Spain-wide climate layer. Soil stays in the guide.
- **Home and progress**: the map with a floating Today card. Progress is a mastery map.
- **Out of v1**, as `later` issues: elevation profile #3, Rioja tour #4, mock exam #7 (new), progress sync #8 (new).
- **Restart**: when building resumes, start from scratch. Keep only `data/`, `data/SOURCES.md`, the data tests and the repo rules. Bin the app code and the old development plan. Mocks are reference only.

## In progress: the flow sketch (owner chose "Flow sketch first")
- **What it is**: one static HTML page (it opens in the app preview) showing every screen as a card with a schematic thumbnail, a status tag (mocked in 2.2, changes, new), its ways on and where it's reached from, plus a later list and open gaps. Real fonts are inlined.
- **Files**: generator `/mnt/project-files/paraje/mocks/flow/src/gen.py`, with 11 screens defined and dead-end and reachability checks.
- **Done 16 Oct 2026 07:45Z** (thread "Continuing the system ideation on Fable 5.1"): `src/template.html` written, `index.html` rendered (11 screens, all reachable). Check fixes: Quiz start was unreachable, now opened by the Quiz tab; Home defined as the Explore map with the Today card open; the generator's reachability loop had a pop-in-generator bug, fixed. Regenerate with `cd src && python3 gen.py`. The four gap cards were posted to the owner in that thread.
- **Gaps to put to him as cards with the sketch**:
  1. The intake rule for new places (default: five new a session, in course order).
  2. What "known" and "solid" mean on the mastery map (default: right on the last two tries, and three spaced passes).
  3. Whether zones join the quiz pool, or only after the DOCa itself is known.
  4. The course order through the ten regions.

## Separate, not done
The live site shows a grey or black map, most likely a tile bug [A], separate from the missing atlas look. A look-only diagnosis on his Mac was offered and he hasn't asked for it.

Memory: `paraje-scope` in team memory carries the same decisions.
