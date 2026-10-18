# PR 94 review: Spain-only coverage line (claude/spain-only-badge-ba3jgw)
Verdict: merge after fixes. 0 blockers, 1 should fix, 3 notes. Read the diff and computed contrast; did not run Playwright or screenshots.

P2 (should fix)
- src/home/home.css:53 `border-radius:999px` makes a pill. Review/visual-style.md:15 and :36 say "no pills" (owner 18 Oct 11:49Z, "soft buttons"); radius is .3rem. Use `.3rem`. The handoff and tester note also say "pill"; reword. Note the owner did ask for a pill at 16:44Z, so if he wants it, record the exception in visual-style.md; otherwise use .3rem. [read]
P3 (notes)
- home.css:53 `.72rem` is off the type scale (visual-style.md:27: .7 credit tags, .78 small print). Use .7 or .78. Uppercase text at .72rem with a 600 weight is legible, but it is the smallest text on the page. [read]
- index.html:61 `<b>` has no meaning for a screen reader, and the text runs together as "SpainLive now..." (no space or separator in the markup; the flex gap hides it visually only). Use `<span class="tag">Spain</span> Live now. ...` or add a space after `</b>`. Not a WCAG failure. [read]
- Contrast, AA: ink3 #6F6860 on white 5.49:1 (.85rem); foil-ink #7D6540 on bg2 #F7F5F0 5.06:1 (.72rem). Both pass 4.5:1. The champagne border (#E9D8B4 on white 1.41:1) is decoration; the text carries the meaning, so no 3:1 issue. [ran]
Checked and fine
- Tokens: all five (--ink3, --foil, --foil-ink, --bg2) exist in :root (home.css:6-7). No hardcoded colours. [read]
- Class collision: `reach` appears nowhere else in src, index.html or tests; selectors are scoped `.hero .reach`, and `.hero .map figcaption b` does not match. The `.soon` avoidance is correct. [read]
- Phone 390px: the 900px media block adds no `.reach` rule; flex-wrap lets the line wrap under the tag, so it is one tag plus about 40 chars at .85rem. With the txt column (24px padding) there are ~342px, so it fits on one line or wraps cleanly. Tester note says "one line"; not measured. Margins: 1rem under .ctas, .nums keeps 2.75rem above. [inferred]
- Test: `toContainText('Live now. More countries coming soon.')` is correct. It is a substring match with whitespace normalised, and the text is a single text node after `<b>` (the locator text is "SpainLive now...", which still contains the substring). It does not assert the "Spain" tag; optionally use `toHaveText(/Spain\s*Live now/)`. [read]
- Copy: "coming soon" promises something while no next country is approved (handoff Open). Owner decision, not code.
- Docs: the tester note's "release 30" assumes 28 and 29 publish first; fine.
