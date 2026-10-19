# Guides landing page, About page, home hero tweaks (19 Oct 2026)

## Done
- Guides page redesigned as an editorial landing page (owner pick C from round 1, mock /mnt/project-files/atlaslope/mocks/guides-landing-v1/): Rioja featured with three photos and its In short, then one row per region with a satellite tile and a card per guide (photo, kind, minutes, lede). Heading and subtitle are the owner's words (10:49Z).
- Still built from `content/guides/` at build time: `guideRows()` in `src/home/guideCount.ts` groups by region, picks the featured guide, carries photo credits. A region without `public/guides/<region>.webp` renders without a tile. Styles `src/home/guides.css`.
- About page rewritten as the owner's letter (round 3 after a first-principles review, /mnt/project-files/atlaslope/reviews/2026-10-19-about-first-principles.md): his note in his words, a five-photo mosaic of his own photos (`public/about/`, EXIF stripped), "Where the facts come from", independence small print. Styles `src/home/about.css`. Nothing on it repeats the home page (owner 10:40Z).
- Home hero: Spain tag back (dropped by accident in the release 40 refresh, commit 88ae1e6), guide count as a fourth number, "Free / to use, no account", map credit one line at 0.65rem (noted in `Review/visual-style.md`).

## Decided (owner)
- Guides option C. About: no repeat of the home page; his photo uncropped apart from a bystander at the edge; no selfie mosaic, his own wine photos instead; no "How a fact gets here" demo.

## Open
- Feedback address for "Feedback is very welcome" on About: owner said later. Marked in `about/index.html`.
- The "useful for WSET and Wine Scholar courses" line stays as small print (earlier open card).
- Satellite tiles for new regions (Cataluña next) need a render into `public/guides/`.

## Where
PR #114, branch `claude/guides-landing-1fy69k`. Mocks and photos in /mnt/project-files/atlaslope/mocks/ (guides-landing-v1, about-v1..v3, about-photos, home-tweaks-before-after.html).
