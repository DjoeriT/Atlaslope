# Home mock v4 design check (ReviewBot). Shots: desk, ipad, phone, large .png in this folder.
Verdict: FIX FIRST. 0 blockers on layout (no overflow at 390/834/1440/125%), 2 must-fix, 5 should-fix, 3 nit. Owner decisions untouched.
Contrast (ran): #6F6860 on #FFF 5.49:1, on #F7F5F0 5.04:1, #7D6540 on #F7F5F0 5.06:1: all pass 4.5. White caption over map: not measurable, see M1.

## Must-fix
M1 "Never small text printed over the picture" / "credit ... readable text". .hero .map figcaption (.78rem white, text-shadow) over bright orange/green satellite, all sizes; phone caption crosses a light patch. Fix: move the caption and "Imagery: Esri, Maxar, PNOA IGN" credit out of the image into a line under the map (ink3 .78rem on white), or a solid pill rgba(20,20,20,.82) with foil/white text. Keep it on phone too (it is hidden there now: .hero .map figcaption span:last-child{display:none}, so the credit disappears; licence needs to stay visible).
M2 "Targets are at least 44 px". Footer links 22px high (footer a), top-bar nav links 23px, "Search" 22px, "Browse the guides" link 25px, brand 32px, phone/iPad "Menu" 36x35. Fix: footer a, .bar nav a, .bar .search, .brand, .menu {display:inline-flex;align-items:center;min-height:44px}; .menu{min-width:44px;padding:.4rem .5rem}; .btn.link{min-height:44px;border-bottom:0} with underline via text-decoration (underline-offset 4px). Keeps visual size, grows hit area. (Mock-only Square/Soft/Pill buttons ignored.)

## Should-fix
S1 Source logos are illegible: .logos img{opacity:.62;height:40px}, EU mark is a faint dotted ring, Gobierno/IGN wordmarks unreadable at 1440 and 390. Fix: opacity:1 (keep grayscale), height:48px, EU width 44px, gap 3rem; make each logo a link to Sources and credits (min 44px) so they are verifiable; alt text already there.
S2 "Black #141414 is the band (page top bar, brand)". .bar is white with 1px ink line. Fix: .bar{background:#141414;border-bottom:1px solid #E9D8B4}, brand and nav in #E9D8B4, hover #fff (nav on 141414 with foil is 12:1). If owner wants the white bar, it is a card to him, not a silent drift.
S3 "Photos ... object-fit cover at fixed ratio: cover 16:11". Guardaviñas crop is portrait ~4:5 (desk and phone), and trio screenshots are 4:3. Fix: .guide .ph{aspect-ratio:16/11} on phone/iPad; on desktop keep half-width but use 4:3 (zone ratio) or crop to 1:1 tile. Pick one, state it.
S4 Type scale: .fact .s .75rem, .eyebrow .72rem with .16em (rule: 0.78 small print, kicker .72 at .14em). Fix: .fact .s and .guide .credit font-size:.78rem; .eyebrow letter-spacing:.14em; .nums dd .82rem and .src .82rem to .9rem (labels).
S5 Radius: "1rem for photos and tiles" vs --r-img:.25rem on trio images and guide photo (look sharp next to .4rem buttons). Fix: --r-img:1rem (trio, guide photo), hero card and quiz card .4rem; hero map stays full bleed.

## Nit
N1 Stats row "106 / 10 / Every": third is a word at the same size, reads as a gap. Use "100%" is a content call: leave to owner; or set .nums dt min-width so baseline matches.
N2 iPad portrait (834) gets the phone layout (breakpoint 900): hero map falls below the CTA, so the map is not the hero on first screen. Fix: raise map before text only if wanted; or put map above fold: .hero .txt padding-block 2rem and map aspect-ratio 4/3 at 700-900px.
N3 Focus ring #2F5F9E is off-palette but visible (contrast ok on white and 141414 needs foil ring on a dark bar after S2: :focus-visible outline-color:#E9D8B4 inside .bar). Large text (125%): no overflow, h1 breaks to 4 lines, fine.

## Outcome (LeadBot, 18 Oct)
Fixed in the mock: M1 caption and credit in solid pills, credit on every size; M2 all targets 44 px; S1 logos full strength, 48 px, linked to
credits; S2 black band with champagne (as the app and the plan); S3 guide photo 4:3; S4 sizes on the scale; S5 radius `.3rem` (the style sheet's
old 1 rem photo rule was stale, now corrected); N1 third number is "€0, no account needed"; N3 champagne focus ring on the band.
Left: N2, the iPad portrait layout stacks like a phone (map under the text); judged fine for a mock, revisit in slice 2.
