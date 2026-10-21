# Fixes report (tour in guide)
Commits: 4956987 (code S1-S6, N1-N4), then the design commit. Not pushed.
- D1 fixed: guide column had auto margins, sized to widest child (668px at 390); now width 100% in tour mode. No overflow at 390 or 320 (measured). Chip bar opaque, headings get scroll-margin. Strip is first on phone (order -1).
- D3 fixed: legend wraps and stops short of the zoom control (tablet and phone).
- D4 fixed: band moved out of the 46rem lede header, spans the guide column.
- D6 fixed: credit line margin 1rem.
- D8 fixed: chip bar opaque (also on plain pages), no blur or mask in tour mode.
- S1 fixed: focus to Hide map on open, back to Open the map on hide; story.spec checks both.
- S2 fixed: map aside after the guide in the DOM; CSS order keeps it right (desktop) and on top (phone); spec checks.
- S3 fixed: Hide map clears the pending fly.
- S4 fixed: still is aria-hidden, inert, canvas tabindex -1; spec checks.
- S5 fixed: home.spec tests tile link and the map-tours section listing Priorat and Rioja.
- S6 fixed: :target hides other regions, "Show all guides" link; unit and UI tests.
- N1 fixed: protocols registered once, per-map health released on remove.
- N2 fixed: timer cleared on unmount.
- N3 fixed: modifier or non-primary clicks open normally.
- N4 fixed: unit test every fly link has a step.
Note: story.spec "opening the map" now scrolls to top before asserting step intro (opening from the band leaves the reader at the next chapter; the old assertion depended on layout).
Out of scope, untouched: phone top bar items, Atlas marked active on guide pages.
Tests: vitest 379 pass; UI story/guide/home/place-page 48 pass (37s); build 1.6s; check.sh passed, download 1941825 of 2000000 bytes gz, tours rioja 52589 and priorat 15737 of 150000.
Shots: build-shots/phone-climate, phone-climate-320, b3-desktop, guides-desktop-tours.
