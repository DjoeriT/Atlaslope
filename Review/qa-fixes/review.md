# ReviewBot: PR #177 (404 page, credit wording). Verdict: MERGE
Blockers 0, should fix 0, notes 3. Read the diff, the two 404 shots and public/fonts (ran: none; read/inferred).
- Copy [read]: one H1 "This page isn't here.", three links. One idea, no lists. Credit now "cropped and resized", matches the photo rule.
- Page [read]: lang=en, title "Page not here · AtlaSlope", noindex, one header, main, nav with aria-label, H1. Focus ring present, 48px targets. No external script or font; the inline script is the only one.
- Deep path [read, inferred]: base script gives /<repo>/ on github.io, / otherwise; relative ./, atlas/, guides/ and fonts/ then resolve at any depth. Font files exist in public/fonts.
- Note 1: with JavaScript off there is no base, so links break at depth (minor; a <noscript> is optional).
- Note 2: straight apostrophe in "isn't"; fine unless the house wants a curly one.
- Note 3: the test checks strings only; no test of the base logic. Acceptable for a static page.
