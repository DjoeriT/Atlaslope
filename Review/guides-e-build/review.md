# ReviewBot: Guides E (claude/guides-e), 22 Oct 2026
Verdict: merge after fixes. Blocker 0, should fix 2, note 3.
Ran: build, vitest home+story-format (162 pass), HTML check of dist/guides/index.html.
Confirmed [V]: all 109 guides listed (11 tours twice, 4 featured 2-3x: band + region grid, as briefed); 15 tours = content/stories, all have guides; one button#morebtn aria-expanded=false, aria-controls=more-tours, text swaps, focus ring, reduced-motion rule; 30 chips (15 tours x2), square 6px, #E9D8B4 on #141414 (high contrast); 1 credit line, "cropped and resized", 0 title= tooltips; crop guard tests (missing/stale/extra) cover shown photos incl. rioja-2.
Should fix
1. tests/unit/home.test.ts: the 404-page test (public/404.html: noindex, copy, three links, sitebar) was deleted with the old Guides tests; it is unrelated to this slice and still guards. Restore it.
2. Filter needs :has() (guides.css, last rule): without it the checkbox does nothing silently. Fine for 2023+ browsers; either accept and say so, or hide .tourtoggle with @supports not selector(:has(*)).
Notes
- guides/index.html: the line "More regions are being written. ..." is gone; not in the mock (brief lists what is gone, this is not named). Confirm with owner.
- Phone chip font .66rem (about 10.5px) in .ecard .chip: small text on a 3-col tile.
- otazu-1 has artist "Unknown": credit prints "Wikimedia Commons" (tested); acceptable.
Not checked: visual shots, keyboard run in browser.
