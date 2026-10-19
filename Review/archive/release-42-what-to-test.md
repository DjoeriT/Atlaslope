# Release 42: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
1. **The Guides page is a landing page.** It opens with "Guides explain why each place tastes the way it does." Rioja is featured with three photos and its In short.
2. **Every region has a row.** Each row opens with a satellite view of the region. Every guide is a card with a photo and its opening line, and each card opens that guide in the atlas.
3. **The About page is your letter, under a big "About" title.** Your portrait sits beside your note, whole. Four of your wine photos follow in one row, each whole at its own shape.
4. **The home hero.** The Spain tag is back under the buttons. There are four numbers, including the guide count. "Free" reads "to use, no account". The map credit is one small line.
5. **"Where the facts come from" is a source chain.** One Rioja sentence, then the pliego page and the EU document page with the backing passage marked, then the satellite map with the boundary. The two page captions open the real documents.

## For you
PR #114 from `claude/guides-landing-1fy69k`. The Guides cards and both counts are filled in at build time from `content/guides/`, so a release that adds guides updates them with no extra step. A new region shows without a satellite view until one is added to `public/guides/`. Handoff `docs/handoffs/2026-10-19-guides-landing.md`. ReviewBot `Review/pr-114-review.md` and `Review/pr-114-review-2.md`.
Checks: CI (check, scope, UI tests in four parts) green on the PR head; the publish run reuses it for the merge commit. Earlier head 97e22e9 was green on all six.
Not verified: Safari, iPad, real phones.
