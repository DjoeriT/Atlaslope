# Step 6 report: story tests

- Spec tests/ui/story.spec.ts: 4 tests pass (9.9s run, 20s with build). Network blocked for non-localhost hosts; asserts DOM state, not pixels.
- Unit: tests/unit/story-zonelabels.test.ts new; vitest 369 pass (1.8s). Listing (2 guides, #place=<id>&page&story links) is already covered by tests/unit/story-list.test.ts against built HTML (the UI suite serves only the atlas).
- Fix: zone names now one label point per zone (zoneLabelPoints, largest part centroid) in src/story/layers.ts.
- Bug found and fixed: Escape with an open fact card also left the story (card handler did not mark the key handled); factMarkers.ts now calls preventDefault when it closes a card. The spec covers it.
- Note: the URL carries a trailing &view=... after the story hash, so the spec allows it.
