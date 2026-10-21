# QA fixes card (S1, S3)
- S1: public/404.html (self-contained, band, one line, Home/Atlas/Guides, noindex, base set by script so it works at any depth and under /Atlaslope/); lands in dist/404.html. Check added in Tools/check.sh (file exists), unit test in tests/unit/home.test.ts.
- S3: hero credit in index.html now "cropped and resized".
- Shots: Review/qa-fixes/shots/ (404 and home credit at 1440 and 390). 390: scrollWidth 390; links resolve at /a/b/nonexistent.
- Tests: home.test.ts 25 pass (1s); build 1.9s.
