# Website slice 2: design check (commit 9059339)

Verdict: fix first. 0 blockers, 3 should fix, 4 notes. Read: site.css, home.css, TopBar.tsx, index.html, six screenshots. Not run: no live browser.

## Should fix
1. Home phone: search link has no accessible name. index.html line ~51: `.search span` is `display:none` at <=900px (home.css line ~109), and the svg is aria-hidden, so the link is empty for screen readers. Fix: add `aria-label="Search"` to `<a class="search">` in index.html.
2. Home desktop: the Search link overrides the bar's 44px target with `min-height:1.75rem` (home.css line 32), 28px high. Fix: set min-height 2.75rem and keep the divider with a pseudo-element or `align-self:stretch` margin. The atlas search box is 2.5rem (40px), slightly under 44; raise `.sitebar .search` min-height in site.css to 2.75rem.
3. Bar differs between home and atlas, so the jump from "Open the atlas" feels like a different bar. Home: search is a muted text link with a divider, logo inset to the 1200px column (x~145 at 1440). Atlas: boxed input, logo at x=16, full width. Fix: give the home search link the same boxed pill (border 30% foil, 8% fill, radius var(--rad), 17rem wide, label "Search places and regions") and the same horizontal padding. Or max-width the atlas bar content. Pick one; the pill is the cheaper change.

## Notes
4. Bar height is 3.25rem (52px) plus 1px line; the approved mock bar is 64px. A sound trade for map room, so keep it; update the mock README or tell the owner it is intentional.
5. sat-atlas.jpg: Rioja polygons and colours are missing on the desktop map (grey tiles, no climate fill, no outline) while the legend is shown. The phone shot and Study shot draw correctly, so likely a screenshot taken before tiles loaded. Retake before the owner sees it.
6. Phone atlas bar: search field is about 40% of the width, with Atlas and Study at the right. It fits and keeps the 44px targets. Wordmark is hidden at <=820px (mark only, aria-label "AtlaSlope home"). Acceptable.
7. Contrast: champagne #E9D8B4 on #141414 is about 13:1, muted #D8CDB4 about 11.5:1, so both pass AA and AAA. Focus ring in the bar is champagne on black (visible); on the page it is #2F5F9E. Fine.

## Checked, no finding
- Quiz vs Study: every visible label reads Study (strings.ts topBar.quiz, backToQuiz, crumbQuiz; index.html nav, card, footer, caption). "Quiz" remains only in code names, the `#quiz` hash redirect and a code comment.
- Active state: underline plus weight 600 on the current item on the atlas; home shows none, which is right.
- Home vs mock: structure, copy, sections and phone layout (quiz card hidden on phone) match.
- Favicon (public/favicon.svg) and share-card.jpg not opened in this pass; not checked.
