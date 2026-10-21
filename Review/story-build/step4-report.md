# Step 4 report: layers (BuilderBot, branch agent/builder/story-layers)
- Crops: five 3:2 crops set by eye (no face, glass or bottle near an edge), allowance deleted; story-format test 19 pass (0.7 s).

- Layers: tint, climate, geology, rivers, names, legend, fact markers, phone padding. Tint route: precomputed PNG per story (Tools/story/slope_tint.py, data/story/slope-*.png), MapLibre cannot compute slope in the client. vitest story-* 43 pass (<1 s), tsc clean, build 1.5 s.
