# Review: landscape fade (claude/project-thread-xkhjw7 vs origin/main)

Verdict: merge after fixes (0 blockers, 2 should-fix, 3 nits). Read-only review; I did not run the tests or the UI suite.

## Blocker
None.

## Should-fix
1. tests/unit/map.test.ts:46 pins only the selected value at zoom 6 (0.82). The default 0.6, hover 0.85 and dim 0.06 are not pinned, nor are the line opacity (0.7) and line width (1.6, 3, 2.8) at zoom 6. Those values are part of "exactly today's colours" too. Suggested fix: assert the whole zoom-6 stop equals the old `case` literal for fill, line opacity and line width.
2. src/map/layers.ts:53-55 (quiz, maxZoom 8.5, createMap.ts:356). At 8.5 the interpolated values are about 0.28 for a normal place and 0.47 for the selected one. That is readable, but the sel/normal gap shrinks, and hover (0.5) is above sel (0.4) at zoom 9. Quiz tapping still has the outline: 0.9 line opacity and 2.1 width at 8.5. The tester note and the handoff say "not checked on a real round". Run the quiz once over the photo before publishing.

## Nit
1. src/map/layers.ts:58-59 and :62: the line opacity has no `sel` branch (same as before), so selection stands out through width (3.2 against 2.2) and the burgundy colour. Fine, but the tester note's "wine outline, a bit more tint" is not quite the mechanism.
2. Tools/preview/map_shots.mjs:40: the ONLY split on commas is correct but does not trim spaces ("a, b" fails). Use `.split(',').map(s => s.trim())`. The deleted comment at line 30 duplicated the one below it, so that removal is harmless.
3. Review/release-15-what-to-test.md (For you section) says checks passed on 7402a78, but later commits changed the test. Re-run `Tools/check.sh ui` on the final HEAD and name the commit.

## Verified (read, inferred)
- Expression valid: stops 6 < 9 < 12 (fill) and 6 < 9 (line opacity, width) ascend; every `case` has the same branch order and a fallback; same pattern as the old 10/13 version [read]. MapLibre clamps below the first stop, so zoom 6 and out keeps today's values: 0.6, 0.82, 0.85, 0.06 [inferred].
- Plain atlas branch unchanged [read].
- Workflow: `only` input is declared optional, passed as env ONLY and consumed by the script; it also applies to the "live" run, which is fine [read].
- Records: numbering consistent (15 is this change, 16 mastery map, 17 ready for friends) in docs/PROJECT_CONTEXT.md:93-96, the handoff addendum and the tester note [read]. Older lines saying "14 and 15" or "15 and 16" are history. The "about a third" and "about 0.3" figures match my arithmetic.
