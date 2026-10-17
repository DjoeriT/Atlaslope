# Name shown as AtlaSlope (17 Oct 2026)

**Done.** Every name people read now says "AtlaSlope": the header wordmark and place-page wordmark (`strings.appName`), both tab
titles, the welcome dialog, menu and progress messages, the `<noscript>` line and the Home Screen name in `manifest.webmanifest`.
UI tests updated to match. `Tools/check.sh ui` passed (67 UI tests).

**Decided.** Owner, 17 Oct 2026, thread "Name shown as AtlaSlope": display casing only. Unchanged on purpose: repo, domain, URLs,
localStorage keys (`atlaslope-theme`, `atlaslope.quiz`, ...) and the saved progress file name (`atlaslope-progress-<date>.json`),
so nobody's stored progress or theme is lost.

**Open.** Goes live with the next publish. Other docs (README, scope) still write "Atlaslope" as the project name; left as is.
