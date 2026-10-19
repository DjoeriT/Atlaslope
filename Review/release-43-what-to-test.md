# Release 43: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
1. **The Guides page is a landing page.** It opens with "Guides explain why each place tastes the way it does." Rioja is featured with three photos and its In short.
2. **Every region has a row.** Each row opens with a satellite view of the region. Every guide is a card with a photo and its opening line, and each card opens that guide in the atlas.
3. **The About page is your letter.** Your five photos sit beside your note. "Where the facts come from" and the independence small print follow.
4. **The home hero.** The Spain tag is back under the buttons. There are four numbers, including the guide count. "Free" reads "to use, no account". The map credit is one small line.

## For you
PR #114 from `claude/guides-landing-1fy69k`. The Guides cards and both counts are filled in at build time from `content/guides/`, so a release that adds guides updates them with no extra step. A new region shows without a satellite view until one is added to `public/guides/`. Handoff `docs/handoffs/2026-10-19-guides-landing.md`. ReviewBot `Review/pr-114-review.md`.
Not verified: Safari, iPad, real phones.
