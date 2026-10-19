# Release 46: what to test (Show map button on guide pages)

On a computer, the way back to the map at the top of a guide is now a "Show map" button with the map icon, instead of a small "‹ Map".

1. Open any guide (for example Rioja) on a wide screen. Top left, under the black bar: an outlined "Show map" button.
2. Tap it. The map opens and flies in onto the place.
3. Open a region page (for example Andalucía). The same button sits on the photo with its dark backing.
4. On a phone nothing changes: the floating black "Show map" button at the bottom stays.

## For you
- Commits: PR #118 (an earlier try that turned the in-text place links into buttons is reverted in the same PR, so they look as before).
- Checks: CI on the PR head, reused by the publish run.
- Not verified: Safari, iPad, real phones; the region page button by eye.
