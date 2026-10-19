# Home page refresh (19 Oct 2026, PR #111, release 40)

## Done
- Round 3 of option B built (mock https://claude.ai/artifact/Ek78Z4TFGcCN96sazrjAMN), with the owner's 09:31Z picks: the Rioja guide card on the hero map and line icons on the five steps.
- Hero: a tall real shot of Rioja with its four flags (`public/home/hero.webp`, 1400x1540, `#view=-2.62,42.17,8.95,0,0`, Esri imagery). The hero keeps today's shape (big headline, near-square map), not the mock's wide map.
- Tiles are real app crops laid over their screens (`public/home/atlas-zoom.webp`, `guide-top.webp`, `guide-short.webp`). The old `guide.webp` is gone.
- The guide count is filled in at build time from `content/guides/` (`src/home/guideCount.ts`, a Vite `transformIndexHtml` plugin).
- Share card (`public/share.jpg`, `Tools/share/make_share_image.py`): the subline layout with today's line, logo 1.5x, no black strip.
- First look of the real build: https://claude.ai/artifact/AqW9HezSfWs7o1dNbVFgHo. ReviewBot: `Review/pr-111-review.md` (0 blocking; small findings fixed).

## Decided (owner)
- Option B; the headline stays; subline "Spain's wine places from above, and why each one tastes the way it does."
- 09:31Z "Card + icons". 09:36Z share card: "I like the Subline but then with the subline that we have today".
- The closer's donation line is copy only. No donation setup without his go.

## Open
- The donation line asks for money with no way to give it (flagged to him).
- The About page body still says "study atlas for WSET and Wine Scholar students" (flagged, not changed).
- The share card line is study-framed while the home subline is not (his choice; flagged as an open positioning question in memory).
- Not verified: Safari, iPad, real phones.
