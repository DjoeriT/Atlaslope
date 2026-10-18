# ReviewBot: PR #95 (claude/atlas-motion-k1e4fa) code and UX review. All findings from reading; nothing run (no UI suite, per card).

Verdict: merge after fixes. Blockers 0, should-fix 4, nit 4.

Answers to the card
- Two elements with name 'hero' at once: refuted (read). Old state: tapped tile photo has inline 'hero'; header imgs get none via motion.css:10 (specificity ties ux.css:8 at 0,2,2 and wins by order: main.tsx:5-6). Callback clears the inline name before the new state. ux.css:8 also names `.card .cover img`, but no card shows under a page. Fragile, see nit 1.
- reduced motion: confirmed respected (motion.css reveal, charts, arrive, lightbox are inside no-preference; withMotion/scrollToSection/useSeen check reduceMotion; map duration 0).
- Content left invisible if scroll-driven animation never runs: refuted (reveal is inside @supports). If IntersectionObserver never fires: confirmed risk, S1.
- img.ph-fade animation overridden: refuted. Reveal targets `section > *`, `aside > *`, `.rgrid > li`, not the imgs; pages.css:229 keeps its own animation list.
- createMap: pitch/bearing/resetCamera/padding preserved (`keep` unchanged; easeTo no-boundary branch unchanged). Only change is duration and easing.

Should-fix
S1 src/app/motion.ts:78 (useSeen) + motion.css:42,45,47: the chart stays at scaleX(0) and opacity 0 until IO fires. rootMargin '0 0 -12% 0' is against the viewport, and .pg is fixed full-screen (pages.css:9), so a chart in the last 12% of the page at max scroll never intersects and stays blank (also tab hidden, print). Fix: margin '0px' with threshold 0, or add a fallback `setTimeout(()=>setSeen(true),2500)` in the effect, and `@media print{.pg-chart *{...none}}` reset.
S2 src/pages/Charts.tsx (Stack onMouseEnter/onMouseLeave): on touch the emulated mouseenter sets data-hover and it can stay, dimming the chart and legend to .28 opacity (motion.css:65, text contrast below AA). Fix: use onPointerEnter/Leave and ignore pointerType !== 'mouse'; also clear on svg pointercancel.
S3 Charts.tsx hover info: rect <title> and highlight are mouse only; the svg is role=img so its children are hidden from screen readers. Content is still reachable through aria-label and the legend, so acceptable, but make the legend li hover/focus drive setHover too (li tabindex not needed; onMouseEnter plus keep text), or state in the PR that the legend is the keyboard path.
S4 motion.ts:67-71 scrollToSection: two quick jumps leave the first call's setTimeout(...,1400) which removes data-arrived early from the second jump; and a scroll listener stays on .pg until its own land. Fix: keep a module-level `arrivedTimer` and clearTimeout it, and store/remove the previous settle listener at the start of each call.

Nits
N1 motion.css:10 relies on equal specificity plus file order. Fix: add `:is()` doubled class or `!important`-free `html[data-vt-from="tile"][data-motion] ...` (0,3,2) to make the win explicit.
N2 motion.ts:41 if startViewTransition throws synchronously after the name was set, the inline name and data-vtFrom leak; wrap in try/catch and clear.
N3 motion.ts:121 useJumpMarker only re-measures on current change and window resize; webfont load or phone rotation of a nav-only change can leave the marker misplaced. Add a ResizeObserver on the nav.
N4 App.tsx moveOf: place to place (same depth) gives 'page-step' (slide right) both directions; going back to a sibling via the browser back button also slides forward. Fine as spec'd, but say so in motion-spec.md. key={place.id} (App.tsx) remounts correctly; no state is lost that mattered (useSectionInView takes `page`).

Checked OK: focus lands on heading after scroll (preventScroll), tabbing into an opacity-0 revealed block scrolls it into reveal; jump links keep real hrefs; aria-current="true" on the current tab; phone: the marker ::after sits inside the scrolling nav so it scrolls with the tabs, and the tab is scrolled into sight. Not checked: visual look at 390/768/1280 px, the motion-level debug flag, tests/ui/motion.spec.ts execution.
