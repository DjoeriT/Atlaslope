# Step 3: story view (BuilderBot, Opus), 21 Oct 2026

State: partly done (see end)

## Commits
| Step | Commit | Tests |
|---|---|---|

## Timings

## What differs from the mock

## Open
| 1 pure parts: camera legs, step pick, fade, locator, credit, measures, story route | (this commit) | story-view 16/16, url-page+url-view pass; tsc clean |
| 2 StoryView, story map (createMap instance, fixed x1.5, focus + 25% fade, flights, locator, credit, photo credit), layers hook for card 4 | (this commit) | tsc clean (2 s); not yet mounted, no shots |

## Timings
- vitest story-view: 0.4 s; url tests: 0.15 s; tsc: 2 s. No build or full suite run yet.

## State at hand-back (turn 40 cap)
Partly done. Left: App.tsx route (render StoryView over PlacePage when sel.story, go() equality on story, Escape back to page), button C on PlacePage, full vitest + build, shots. No Esri key in .env.local here: local map is the atlas base.

## What differs from the mock
- MapLibre compact attribution kept (moved above the credit line); mock had it off.
- Photos without a photo-focus.json entry use their square-crop focus from src/home/photoCrops.json [A].
| 3 route: StoryView over PlacePage on #place=<id>&page&story; Escape and Back return to the page (history.back) | (this commit) | tsc clean |
| 4 button C under the guide lede, only for ids with a story file | (this commit) | tsc clean |
| 5 barrel chapter: its last paragraph moves to the Haro stop, as in the mock (rule: an overview step followed by a fly stop of the same chapter) | (this commit) | tsc clean |
