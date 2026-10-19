# Release 48: what to test (Guides page fixes)

The Binissalem photo shows again, and Rioja opens the Guides page as the showcased guide over the home hero satellite view.

1. Open the Guides page (hard-reload). Under Baleares, the Binissalem card shows its photo, not a broken image.
2. Under Ebro or Green Spain, the Txakoli de Álava card with its second photo also loads.
3. At the top, Rioja sits under a "Showcased guide" label, with the satellite view of Rioja and its flags (Haro, Sierra de Cantabria, Ebro, Alfaro) and the line "Imagery: Esri, Maxar · Spain: PNOA © IGN" under it.
4. "Read the Rioja guide" opens the guide.

## For you
- Commits: PR #120 (merge of `claude/project-thread-ebo2uk`).
- Checks: CI on the PR head, reused by the publish run; ReviewBot copy check: Review/release-48-review-guides-showcase.md (0 P1).
- Decided: Rioja stays featured, labelled "Showcased guide"; only it gets the hero view (owner 19 Oct 2026, 13:50-13:57Z, preview approved).
- Not verified: Safari, iPad, real phones.
