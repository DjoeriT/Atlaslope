# Privacy: what the site does with visitors' data

Internal facts sheet, kept true by every slice that adds storage or a third-party host (PR template). The public privacy page is
written from it; its wording waits for the owner's card (18 Oct 2026). Atlaslope is run from the EU, so GDPR applies. This is a
record of facts, not legal advice. Checked [V] 18 Oct 2026 against `src/`.

## What we collect
Nothing on a server we run. No accounts, no cookies, no analytics, no error service (Sentry and PostHog were decided on 16 Oct,
`docs/architecture-decisions.md` #20, #40, #46, and are not built).

## What stays in the visitor's browser (localStorage, never sent anywhere)
| Key | What | Where in code |
|-----|------|---------------|
| `atlaslope.quiz` | Study progress | `src/quiz-ui/` |
| `atlaslope.quiz.backup`, `atlaslope.quiz.damaged` | A backup copy, and a copy kept aside if progress fails to load | `src/quiz-ui/` |
| `atlaslope.quiz.filesaved` | When progress was last saved to a file | `src/quiz-ui/ProgressFile.tsx` |
| `atlaslope-first-run` | The first-run note was seen | `src/app/FirstRun.tsx` |
| `atlaslope.today-closed` | Today's card was closed | `src/app/App.tsx` |

This is storage strictly needed for what the visitor asked for (their own progress), so no consent banner is needed for it [A, common
reading of the ePrivacy rule]. Clearing site data removes it. The "save progress" file goes only where the visitor saves it.

## Who sees a visitor's IP address
The browser loads map tiles straight from these hosts, which see the IP address and the area viewed:
| Host | What | Their terms |
|------|------|-------------|
| `ibasemaps-api.arcgis.com` (Esri, US) | Satellite imagery outside Spain | Esri privacy statement |
| `www.ign.es` (IGN, Spain) | PNOA orthophoto inside Spain | IGN / CNIG |
| `tiles.openfreemap.org` (OpenFreeMap) | The atlas base map | OpenFreeMap |
| `s3.amazonaws.com` (AWS, Terrarium tiles) | Elevation for 3D terrain | AWS Open Data |

Self-hosted, so no third party sees them: the app, data, photos (resized copies of Commons files) and fonts. GitHub Pages serves the
site and keeps its own access logs (GitHub's privacy statement).

## Keep it true
A slice that adds a storage key, a third-party host or a service updates this file, `docs/operations.md` and the CSP in the same PR.
