# Docs and hygiene sweep (18 Oct 2026)

Thread "Docs and hygiene sweep", from the docs gap audit (`/mnt/project-files/atlaslope/reviews/2026-10-18-docs-gap-audit.md`).
Plan: `/mnt/project-files/atlaslope/plans/2026-10-18-docs-hygiene-plan.md`.

## Done
- PR #82 (merged, docs and config, no release): `docs/glossary.md`, `docs/operations.md` (rollback, incident template, Esri key,
  third-party hosts), `docs/privacy.md` (internal facts), `.github/dependabot.yml`, PR template, Playwright pinned to 1.56.1, phone width,
  reduced motion and WCAG in `Review/visual-style.md`, stale lines in architecture-decisions, scope, builder-brief, reviewer agent.
- PR #90 (this slice, small): one photo credit everywhere (`src/cards/Credit.tsx`): author to Commons, licence linked, ", resized" for
  CC BY and CC BY-SA; NOTICE.md (Wikipedia facts only, share-alike for CC BY-SA photos); card answers recorded; README and
  PROJECT_CONTEXT stale lines.

## Decided (owner cards, 18 Oct 15:30Z)
- Privacy: internal note only; a public page just before friends get the link. Draft: `/mnt/project-files/atlaslope/mocks/privacy-page/`
  (ship as its own route `privacy/index.html`; the home footer and About belong to the top bar thread, PR #85, link target `privacy/`).
- Rollback: the thread that published a release rolls back at once when the live check fails and tells him in one line.
- Sentry and PostHog: neither yet; revisit just before friends get the link.
- Licence: photo credits fixed; his writing stays all rights reserved.
- Checked [V]: no shipped text copies Wikipedia; four hosts see visitor IPs (Esri, IGN, OpenFreeMap, AWS Terrarium).

## Open
- Lint and format gate in CI (decision #38): no ESLint in the repo yet; adding it is its own slice (config, dependencies, fixing what it finds).
- CSP meta tag with an allowlist of the four tile hosts: own slice after PR #85 (touches `index.html`, `atlas/index.html`); needs a live check
  on atlaslope.com because satellite only loads there.
- `strings.photoCredit` (`src/strings.ts:135`) is unused since #90; remove it once #85 has merged (it owns `strings.ts`).
- Smaller audit items not done: backup of project files and memory outside the repo, SEO rules beyond noindex, a fact-check workflow, data refresh cadence.
