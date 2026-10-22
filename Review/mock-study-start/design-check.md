# Design check: Study start card mock (ReviewBot, 21 Oct 2026)
Verdict: fix first. 0 blockers, 3 should fix, 4 notes. Ran: Playwright at 1440 and 390 (file://), crop of option D, DOM measure of D button and min font. Read: page text, content/guides for two claims.

## Pass
- House style: black band, champagne kicker/underline, white page, 6px-ish corners, no pills, no browser-blue controls (chooser rows are custom). Read and seen [V].
- No drawn icons or illustrations; map is a real crop, photos are real. Seen [V].
- Counts 75/72/19/8 match the README sources (not re-run). "Spain chapter" label consistent with WSET Level 3 text.
- Claims in D: "95% of the vineyards are less than 1 km from the sea" (content/guides/txakoli-getaria.json) backs "Most vines are within 1 km"; Ribeiro "shielded from the ocean by mountains" is in ribeiro.json. [V read]
- "Study" vocabulary used; "Review" not used as a heading.

## Should fix
1. D, 390: the button "Learn these 5 places" sits at y 835-883 inside the sheet (sheet starts at the top of an 844 viewport), so it is below the fold. Cause: 5 photo rows of about 49px plus 3 text lines above. Fix: (a) show 3 rows and "and 2 more" as a plain text link, or (b) make the "Learn these 5 places" button sticky at the sheet's bottom (safe-area padding), or (c) drop "No course needed. Just curiosity." and "Today: five places, and what shapes each wine." into one line. Recommend (b) plus (c): the five rows stay, the button always shows. Also needed on iPad portrait if the sheet is used there.
2. D, desktop 420 card: "Photos:" credit line is longer than the button area and wraps to 3 lines under the CTA; it competes with "Taking a course?". Fix: put the credit line as the last element of the sheet (below Practise any mix), keep CTA row clean. Also "Taking a course?" wraps to two lines next to the button at 420: shorten to "Course?" or stack the link under the button.
3. A, B, C, D, 390: "Practise any mix" block repeats in every option and its button is cut off at the bottom of the phone frame in D (clipped mid-button in the mock). Fix: extend the frame to show it whole or crop the frame with a visible fade; a clipped button reads as a bug to the owner.

## Notes
4. D: the question headline "Why does Albariño stay so fresh?" is hard-coded to a place the student may not have started; with a course set, the kicker "Spanish Wine Scholar · 0 of 72 known" is only described in text, not shown. Add one frame of that state so the owner can judge it (the README lists the headline as open: ok).
5. Min text is 11.5px (captions, credit line) at 390. Photo credit at 11.5px in grey #6F6860 on white is about 5:1, passes AA but is small; use 12px or more.
6. Thumbnails are 56px squares: crops cannot be checked for faces or glass at that size, and the shown photos need an entry in src/home/photoCrops.json before build (unit test). None of the five shows a person or bottle at that scale; verify against originals when built.
7. Copy: "Slate and granite along the Sil." and "Terraces on canyon walls." fine. "Any region, any time, 10 or 20 questions." is a three-part comma list; the rule bans "X, Y and Z" lists, so cut to "Any region, 10 or 20 questions." Credit line uses " / " between photographers while the rule says one "Photos: Name · licence" line per set; acceptable, flag for the owner.
