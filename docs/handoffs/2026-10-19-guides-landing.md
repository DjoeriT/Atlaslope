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

## About rework (second thread, 11:05-11:25Z)
- Done: his photos re-exported whole at their own ratio (only bystander slivers at the left edge trimmed), grid columns in each photo's width/height ratio so the row shares one height, no object-fit. Big "About" h1 like Guides. Guides tile credit is the tile's figcaption (ReviewBot P2 3).
- "Where the facts come from" = option B source chain (owner tap 11:12Z; mock https://claude.ai/artifact/5ej2NFVVCnFKSTmjaVBobZ, sources in /mnt/project-files/atlaslope/mocks/about-facts-v1/): guide sentence (content/guides/rioja.json), pliego p.15 and EU single document p.5 with the passage marked by overlay boxes, satellite map shot from the live site.
- ReviewBot round 2 `Review/pr-114-review-2.md`: P2s fixed (alt texts carry the passage, captions name the issuer and link the document, licence basis in data/SOURCES.md), P3 credit string, cite link, label size fixed. Open: owner to confirm the pliego page basis (art. 13 LPI, [A]). Step order (pliego before EU) kept: the rulebook comes first.
- Owner 11:20-11:22Z: photos B (two rows, real 14px gaps, eight of his photos incl. whites, valley, canal, lake); he rewrote the letter himself (three paragraphs, in about/index.html word for word). Rule: his letter is his text, never edit it without him.

## Next thread picks up here (11:05Z; this thread handed off at ~80K context)
Owner at 11:03Z on the built About page: "I don't like it. The photos are weirdly cropped in my case and the wine glass case, why the hell do you crop like this". At 11:04Z: "Where the facts come from needs visualisation instead of stupid lines". Second time he objected to cropping: HARD RULE, his photos keep their own aspect ratio.
- Cause: the build forced all five photos into equal square tiles (`public/about/*.webp` were cut square), so portrait photos lost the glass and the top of the frame. Fix: re-export each photo at its own ratio from the originals (/mnt/project-files/atlaslope/mocks/about-v1-owner-photo.jpg and about-photos/{3edb68e6,c606d5dc,5488394e,3a02ea17}.jpg). Only trims allowed: the seated man at the far left of his portrait, the person's sliver at the bottom left of the glass photo. Never cut a face, glass or bottle. Layout around real shapes: e.g. his portrait whole beside the note, the four wine photos as a justified row (equal height, widths from each ratio) below the letter; phone: castle full width, the three portrait photos in one row. No object-fit: cover crops. Check every tile against its original before showing him.
- "Where the facts come from" as a visual, not lines: real product only (no drawn diagrams). Idea to mock: the real source chain for one place, shown as real images: the app's map with the MAPA boundary, a thumbnail of the pliego page and of the EU single document page the guide cites, and the guide sentence they back. Round 1 subtle-to-bold in one Artifact page, via a one-shot helper.
- Owner 11:04Z: "We need an About title as well up big?" Yes: a visible page title at the top, same size and style as the Guides page h1 (today the h1 is visually hidden).
- ReviewBot `Review/pr-114-review.md`: P2 1 (credit wording) and P2 2 (hero credit scrim .55) fixed in this push; P2 3 (Guides tile credit as the tile's figcaption) still open; P3s listed there.
- Then: merge on green (release number: next free whole number after Cataluña's 42, tester note drafted as `Review/release-43-what-to-test.md`, rename if needed), ask him "publish release N".
