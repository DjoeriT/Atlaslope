# Review: claude/world-background-map-jo4a8v (9df2b21 vs b5c773b)

Verdict: merge. Blockers 0, should fix 0, notes 4.

Checked (ran): `Tools/check.sh quick` passes (typecheck, 89 unit tests, data ledger). World file 787,873 bytes, 275,537 gzipped (budget 2 MB, so the budget is met). Land is a valid MultiPolygon, one welded ring across both old box edges (consecutive vertices at the cut points, no gap), 1 hole (the Caspian), 486-line border feature. SOURCES.md entry present and complete.

Notes
1. oceanFromLand only takes each polygon's outer ring, so correctness depends on no island sitting inside a lake. The build drops those, but no test guards the data. Suggest a test that the world file has no land polygon inside another polygon's hole.
2. Land touching x=-180/180 (Chukotka, Fiji, Antarctica) becomes holes that share an edge with the world rectangle. Earcut normally copes; the UI run passed, but a seam at the antimeridian when panning there was not looked at (not screenshotted).
3. The 50 m coast (2 km simplification) meets the 10 m coast at the old box edges. The vertices line up, but a small change in detail level remains at the old box edges when zoomed in. This is expected, not a defect.
4. The new test "under 1 MB" is loose (actual 788 KB); fine. natural-earth-spain.geojson is no longer loaded by the app but is still the build input, so keep it.
