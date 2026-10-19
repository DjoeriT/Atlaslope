# ReviewBot: PR #111 home page refresh (read only, nothing run)
Verdict: merge after fixes. 0 blocking, 4 small, 3 taste.

## Findings, ranked
1. small - index.html:62-63 and tests/unit/home.test.ts. "106" places and "10" regions are typed in; no code fills them (grep data-count in src: only guideCount.ts). The PR removed the unit assertion that tied them to places.length / regions.length, so nothing now catches drift. Fix: keep an assertion that the two dt values equal the data counts (or fill them in the same Vite plugin).
2. small - hero credit, index.html (figcaption.map). "Card photos: Mentxuwiki, Basotxerri (CC BY-SA 4.0), Manuel Velazquez (CC BY 3.0), resized" has no links. CC asks for a licence link; the guide block's .credit line below does link author pages and licences, so the page is covered, the hero line alone is not. Fix: link the two licences in the figcaption (same markup as .credit).
3. small - the three .trio screenshots (index.html trio) show Esri imagery and, in guide-top.webp, Commons photos, with no credit line under them. Visual-style says every photo has an always-visible credit. Fix: one line under .trio: "Imagery: Esri, Maxar · Spain: PNOA © IGN", plus the Commons credit if guide-top shows one.
4. small - .gcard has overflow:hidden (home.css:59) and the global :focus-visible outline (3px, offset 3px, home.css:15) is likely clipped on the keyboard-focused card. Fix: `.gcard:focus-visible{outline-offset:-3px}`.
5. taste - lede (index.html, "Understand the wine."): "Each one is built on the wine's own rulebook, the pliego de condiciones and the EU single document." is an appositive list. Fix: "Each one is built on the wine's own rulebook.\nThat means the pliego de condiciones and the EU single document."
6. taste - "4 places to fly to": rioja.json has 4 top-level fly stops (2+1+1) but 7 stops with the 3 zone ones; I found no app text that prints the number. Confirm it matches what the guide page shows.
7. taste - tiny text: .gcard .kick .66rem, .go .75rem, hero figcaption .7rem (home.css:56,64,67). Raise to .75 to .8rem for phone and large text. Radii .4rem, .35rem, .2rem are near but not the 6px token. data/SOURCES.md share.jpg row still says about 120 KB and "Spain's wine regions" (file is 148 KB, shows Rioja).

## 1. Copy: facts traced (read, grep)
- "Mountains wall in 100 km of vines along the Ebro": rioja.json:18, 29. Confirmed.
- "Atlantic cool meets Mediterranean warmth in one valley": rioja.json:53, facts/rioja.json:7 ("mild"; "cool" is a gloss). Confirmed.
- "Clay-limestone terraces ... made to last": rioja.json:107, 119 (wines for ageing). Confirmed.
- "Five years ... two in oak ... Gran Reserva": facts/rioja.json:93 (60 months, 24 in barrel). Confirmed.
- "Purple when young, ruby-brick with age, then spice": facts/rioja.json:76. Confirmed.
- "Two climates meet in one sheltered valley": rioja.json:6. Confirmed. "4-minute read": "minutes": 4. Confirmed. Pliego p. 15 and 19: cites rioja-pliego:p15, p19. Confirmed.
- Lede: rioja, ribera-del-duero, rias-baixas exist in content/guides/; 29 json files = the 29 in the page (ran ls). Confirmed.
- Steps: one idea per line, no comma splices. WSET wording gone from page copy (fits "general wine reference"). Share-card line excluded as decided.

## 2. Licence and credits
- Hero card reuses three Commons photos and the figcaption names author, licence and "resized", always visible: meets the visible-line rule and the CC BY-SA 4.0 attribution items (author, licence, change note) except the licence links (finding 2). photos.json has author and licence for rioja-alavesa-2, rioja-2, rioja-3.
- SOURCES.md: `public/home/*.webp` row names hero, atlas-zoom, guide-top, guide-short and the imagery credit; `public/share.jpg` row exists. Covered, with the stale size note in finding 7.

## 3. Visual style
Light, black band, champagne, no new drawn art (step icons are the approved exception). No screenshots taken, so phone overlap of .gcard (bottom:4.6rem, home.css:182) with the two-line credit is unchecked.

## 4. Accessibility
- Card link name is its full text ("Why Rioja tastes ... Read the guide 4 min"): long but sensible. Its three images have alt="" (right, decorative inside the link).
- Headings: h1, h2, step h3s, trio h3s, guide h2, closer h2. OK. Alt texts describe content; trio back images alt="".
- Reduced motion: only one 0.15 s transition (home.css:39), no animation. OK.

## 5. Code
- guideCount.ts + vite.config.ts plugin: transformIndexHtml runs in dev and build for all html pages; the regex only matches data-count="guides">N<, so atlas/, about/, guides/ are untouched. Relies on cwd = repo root (normal). Test only checks > 0; a stray non-guide json would inflate the count (taste).
- Tests: ui spec swap (.reach to .closer plus card href) is fine.
- Dead CSS: none. Every home.css class is used by index.html, about/ or guides/ (scripted check; "cover" and "css" hits were comments).
- public/home/guide.webp removed; only docs/handoffs/2026-10-18-site-visual-fixes.md still names it (history, fine).

## LeadBot follow-up (same PR)
- Fixed: licence links in the hero card's credit; an imagery credit under the three screens; the card's focus ring drawn inside its clipped corners.
- No change: the place and region counts are still checked by `tests/unit/home.test.ts` (only the old meta-description line was dropped). "4 places to fly to" counts the guide's four main fly stops, as the live page already did ("4 places on the map").
