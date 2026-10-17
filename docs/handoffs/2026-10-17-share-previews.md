# Share previews (17 Oct 2026)

**Done.** Links to atlaslope.com now carry Open Graph and X card tags (`index.html`) and one site-wide preview image (dark: gold on black, owner pick),
`public/share.png` (1200×630: the app's logo, "AtlaSlope", the tagline, Spain's DO map). `robots.txt` still shuts search
engines out but lets the preview fetchers (X, LinkedIn, Meta, WhatsApp, Slack, Discord, Telegram) read the page and the image only; without that, X and
LinkedIn showed no card at all. The page keeps `noindex`. The image is rebuilt with `Tools/share/make_share_image.py`
(command in its docstring). UI test checks the two key tags. `Tools/check.sh ui` green on the branch.

**Decided.** One card for every link (coordinator default): crawlers don't run the app, so a place link shows the same card.
Dark card (owner, 17 Oct 2026); `make_share_image.py light` still builds the light one. Preview line under the title: owner to pick a new one.

**Open.** Per-place previews ("Rioja" with its photo) would need a small HTML page per place at build time; not built.
WhatsApp sometimes shows a small square thumbnail cut from the middle of the image. Previews are cached by each app,
so a link already shared keeps its old (empty) preview for a while. Not verified on a real phone until the next publish.
The favicon and Home Screen icon still use the older three-row logo; the app and this card use the five-row one.
