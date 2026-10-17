# Release 8 review (commit 72cacd2), ReviewBot, code plus design

Verdict: merge after fixes. Blockers 0, should-fix 2, notes 5. [R]=read, [V]=ran/computed.

Tokens: app.css light and dark match Review/visual-style.md (paper, ink, lines, accent, accent-ink, charts n/a) [R]. No #7A2E3B, cream (#faf7f0, #F3EEE4) or old dark greys left in src/ except the Rioja zone tint #AE4656 (a wine-region colour, allowed) [V grep]. The map basemap (style.ts #EFE9DC, borders #5B5048, hillshade browns) stays cream/brown: allowed ("map keeps its own colours") [R].

Contrast computed [V]: ok/white 6.38, bad/white 6.72, ok/dark 9.03, bad/dark 7.08, ink3 on fill light 4.63 (narrow), ink3 on fill dark 5.66, wine on fill 7.85, gold on #121212 well above 4.5, focus ring 6.46 light / 8.89 dark vs paper. All pass.

## Should fix
1. contrast.test.ts misses the pairs the card names: add ok/bad on paper and paper2, ink3/ink2 on fill, accent on fill, focus on paper, in both themes. ink3 on fill (4.63) is one tweak from failing and is unguarded.
2. Dark mode map labels (--label #fff, halo rgba(0,0,0,.75)) sit on the cream plain-atlas base (place-desktop-dark: "Arabako Txakolina", "Navarra"): heavy halo, hard to read. Fix: dark labels use the light-map label colour when the plain atlas is showing, or lighten the dark halo's reliance by using --label per basemap (satellite only gets white).

## Notes
3. manifest theme/background #ffffff, but dark theme is #121212 and index.html has no theme-color meta; add `<meta name="theme-color">` with light/dark media variants.
4. h2 is 1.15rem; style sheet says 1.6rem section heading. Check against the mock .pcard h2 before the photo pages release.
5. iPad dark (place-ipad-dark): the imagery notice overlaps the "Terrain: Mapzen" attribution pill at bottom right. Layout predates this commit; fix in a layout slice.
6. Card has no border now (border:0) and relies on shadow; in dark the card (#121212) is the same as the page colour, so on a dark map the edge is only the shadow. Consider 1px var(--line2) in dark.
7. Focus ring (3px --focus, 2px offset, :focus-visible) is intact; a ring on a wine/gold button is only visible because of the offset gap, which is fine. 44 px targets unchanged (.btn, .chip, .more, crumb links 2.75rem) [R]. Screenshots (place, region, quiz; desktop, iPad, dark, 125% text): no clipped text or overlap from this change.

## LeadBot follow-up (17 Oct)
- Should-fix 1, done: contrast test now also covers ink, ink2, ink3 and accent on `--fill`, plus ok, bad and focus on paper (30 checks).
- Should-fix 2, done: on the plain atlas, dark-mode map labels use dark ink with a white halo (`#map[data-base="atlas"]`); white with a black halo stays for satellite.
- Note, done: 1 px `--line2` border on the card in dark mode.
- Note, kept: section heading 1.15rem on the card follows the approved card mock (`.pcard h2`); 1.6rem is for the full page (release 9).
- Notes, not in this release: theme-color meta per theme, imagery note over the attribution on iPad (existed before).
