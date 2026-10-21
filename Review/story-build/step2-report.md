# Step 2 report (story format)

- 62aa861 story files, loader, tests: tests/unit/story-format.test.ts 19 green (0.5 s)
- docs commit: docs/guides.md section and Format log line

Notes
- Test sits in tests/unit/ (vite.config only runs that folder), not src/story/.
- Facts: San Vicente fact is the guide's full clay-limestone sentence (the mock's "also lies in the Sonsierra" used words the guide lacks). Other mock facts are tightened forms; "is" allowed as linking word.
- Photos without a checked crop (listed in the test as known): rioja-2, rioja-3, rioja-alavesa-2, catalunya-2, priorat-1. Owner/crop_sheet decision needed.
- Mock hard-coded Haro/Alfaro; story uses names from names-rioja.geojson (a few hundred metres off). Mock looked up 'Riu Siurana'; data has 'Riu de Siurana'.
