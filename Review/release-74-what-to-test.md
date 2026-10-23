# Release 74: what to test

Germany joins as the fifth country: a pilot with two guides. Hard-reload first (Cmd+Shift+R).

- Home and Guides: a Germany card with photos; "Open Germany" goes to `/de/`.
- `/de/`: "2 regions · 2 guides", Mosel and Rheingau, each with a photo.
- `/de/mosel/`: the guide; "Read the label" lists the Prädikat steps, the single-vineyard rule and Sekt.
- `/de/rheingau/`: the guide; it has no outline on the map yet.
- On the map: the Mosel outline is approximate (the official vineyard land with gaps closed), and the credits line names the
  Landwirtschaftskammer RLP.
- Known: the `/de/` intro and the card lines are draft copy for you to rewrite; the 462 Mosel single vineyards are not drawn yet;
  Germany's climate map is grey; the footer still says "Spain and Portugal".

## For you
- Commits: release-73..88b542df (PR #245 Germany pilot, merged on green CI after ReviewBot; plus other sessions' merges).
- Checks: the publish run reused main's green run on 88b542df (check, ui 1-4, scope); unit 595/595 and `Tools/check.sh` locally;
  first load about 2.04 MB of 2.1 MB. ReviewBot report `Review/countries/germany-pilot/review.md`, its two majors fixed.
- Live: `/de/mosel/` and `/de/rheingau/` load on atlaslope.com [V].
- Not verified: Safari, iPad, real phones; the map outline on the live site; guide text beyond 14 facts checked against the specs.
