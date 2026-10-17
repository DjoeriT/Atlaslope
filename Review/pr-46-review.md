# PR #46 review (share previews)
Verdict: merge after fixes. Blockers 0, should fix 3, notes 3.

## Should fix
1. public/robots.txt:3-8 - WhatsApp's fetcher is not named. It sends UA "WhatsApp/2.x", which falls under `User-agent: *` Disallow: /. WhatsApp says it does not obey robots.txt for link previews, so it probably still works, but the goal list names WhatsApp: add `User-agent: WhatsApp` (cheap, harmless). iMessage fetches with a spoofed Twitterbot/facebookexternalhit-style UA (Apple LinkPresentation), covered by existing tokens [inferred, not tested]. Also consider `meta-externalagent` (Meta's newer name; facebookexternalhit stays valid).
2. public/robots.txt:2 comment and handoff - `Allow: /` for these bots lets them crawl the whole site, not just the page. Harmless (SPA, noindex) but the comment says "read the page". Optional tighten: `Allow: /$` plus `Allow: /share.png`; not needed.
3. index.html:8-21 - noindex plus robots Disallow: / for Googlebot means Google never sees noindex; a link found elsewhere can still be listed URL-only. Pre-existing, but this PR is where the robots file is touched. Owner decision: keep as is, or drop the Disallow for Googlebot so noindex is honoured. Not a regression.

## Verified
- Tags (index.html:9-20): og:url, og:image absolute https://atlaslope.com/...; og:title/type/image/width/height/alt present; twitter:card summary_large_image; twitter:title/description/image fall back to og:* (X documents this). [read]
- Image: public/share.png is PNG 1200x630 RGB, 117 KB (well under WhatsApp's 300 KB hint and X's 5 MB). Opened and viewed: logo, wordmark, tagline and map legible, credit readable, no clipping. [ran]
- robots.txt syntax: consecutive User-agent lines sharing one group followed by Allow is valid per RFC 9309 s2.2.1; blank line separates groups; tokens Twitterbot, LinkedInBot, facebookexternalhit, Slackbot-LinkExpanding, Discordbot, TelegramBot are the published tokens (Slackbot-LinkExpanding correct for unfurl; `Slackbot` is for downloads). [read/inferred]
- Build/debug leak: only static tags, public/ files copied as-is, no src change; base './' unaffected since og URLs are absolute. No ?fixture/?fresh strings added. [read]
- Test: tests/ui/placeholder.spec.ts:12-13 asserts og:image and twitter:card; note it pins the production host, fine. [read]
- Licence: SOURCES.md share.png row cites dops.geojson and natural-earth-world.geojson, both listed; credit printed "Map: © MAPA · Natural Earth" matches MAPA attribution; Natural Earth is public domain, "Made with Natural Earth" is a courtesy credit, not required. Row says "Built by ... rendered with Playwright", consistent with script docstring. [read]
- .gitignore ignores generated Tools/share/share.html. [read]

## Notes
- Tools/share/make_share_image.py:3-4 the two-step command needs `file://$PWD`; script's own write path is relative to ROOT, fine. Fonts load from public/fonts via relative url; not re-run by me.
- og:image:alt wording ("Spain's wine regions") fine; description is owner copy, not judged.
- Not tested: real-device previews, ran no check.sh (card asked review only; handoff claims ui green).

## LeadBot follow-up
- Should-fix 1 and 2 done: robots.txt names WhatsApp and meta-externalagent and allows only `/`, `/index.html` and `/share.png`.
- Note 3 (Google can't read noindex behind `Disallow: /`): unchanged from before this PR; left as is.
