# Germany wave 1: Rheinland-Pfalz rest and the Rheingau outline (23 Oct 2026, issue #149)
Brief: `docs/handoffs/2026-10-23-germany-rest-go.md` (on PR #250's branch when this ran). Owner, 23 Oct 2026: "Run the whole thing" (goal set
before he left); the calls below were LeadBot's on the recommended option, to check.

## Done [V]
- Places 7 of 13: Ahr, Mittelrhein, Nahe, Rheinhessen and Pfalz added at `/de/<id>/`, each its own group `de-<id>` (as the pilot).
  A German place ships once its guide exists (as `IT_SHIP`); groups join with their first place.
- Guides on the local route, `Tools/countries/de_batch.py` (new; `de_wset.py` now takes ids). Sources: the BLE product specs (PDFs
  in the raw store, `raw-manifest.json`). Checker verdicts: Ahr keep 30 / fix 17 / cut 1; Mittelrhein 24/27/0; Nahe 28/18/2;
  Rheinhessen 29/20/2; Pfalz 34/14/0. Every number in the five fact sheets (43) found in its spec text.
- Outlines (`Tools/data/build_de_areas.py`, all closed 150 m, simplified 40 m, `approximate`):
  - Mittelrhein, Nahe, Pfalz from LWK `gu` (as Mosel; Mosel's output is byte-identical to before).
  - Ahr and Rheinhessen are not in `gu`: union of their Einzellagen in LWK `weinlagen_recht` (`route: lwk-wl`). Same service and
    licence; the brief's route (spec Gemarkungen + BKG VG250) was not needed and BKG still refuses. Einzellagen cover 1.5-1.9x the
    `gu` land where both exist, so these two are drawn more generously [V measured].
  - Rheingau: Hessen's ALKIS WFS answered scripts today. Vineyard land use ("Rebfläche") inside the amended spec's 32 Gemarkungen
    (`Tools/data/fetch_de_rheingau.py`), 33.4 km2 of vines (about the Rheingau's 3,200 ha), open by law (§ 18 HVGG). Felsberg-Böddiger (3 parcels near Kassel) is fetched, not drawn: it threw the map frame 150 km north (caught in the shots). No Rheingau
    zones: Hessen has no Lagen layer.
- Einzellagen zones per RLP place (#74): `zones-<id>.geojson`, 31-334 KB each, data only (not drawn yet, as Mosel's).
- Photos: 4 per place from Commons (BuilderBot picks, LeadBot checked the montage), square crops checked; only `-1` of each is shown
  square, so only those carry crop entries (as the pilot).
- Tile lines for the five places and groups: drafts from the fact sheets, for the owner to rewrite.
- Search: `names` in the plain-page index are deduplicated (official often equals the name). The index had reached 60,538 B against
  the test's 60,000 cap; the cap was not raised.
- First load 2,048,692 B (limit 2,100,000; pilot 2,036,287).

## Tokens [V, `Tools/guides/usage.py` per run dir]
| Place | New | Re-read | Total |
|---|---|---|---|
| Ahr | 0.16M | 0.90M | 1.08M |
| Mittelrhein | 0.17M | 0.77M | 0.95M |
| Nahe | 0.19M | 0.95M | 1.13M |
| Rheinhessen | 0.18M | 0.80M | 0.99M |
| Pfalz | 0.18M | 0.89M | 1.07M |
| Guides | 0.88M | 4.31M | 5.22M |
Photo helper 0.06M (Sonnet). This session (LeadBot) not metered here [A ~1M, mostly re-read]. Wave figure ~5M; under the 7.5M stop.
Nahe's first sheet run returned the wrong id ("de-nahe") and the guard stopped it; the re-run passed (that sheet run is not in the table).

## Open
- Ahr and Pfalz sheets have no main grapes: their specs list grapes only inside must-weight rules, no main-grape list. Left empty
  (facts from official sources); the guides name grapes from those rules.
- Monzinger Niederberg (Nahe single-vineyard PDO, #93) has no Einzellage in `wl`: noted, not drawn.
- Saarland Mosel and the NRW Mittelrhein (Siebengebirge) are not in the RLP layers: outlines cover the RLP parts.
- Mittelrhein-1 photo is mostly forest; the weakest of the 20.
- Gaps for wave 3 (parity): altitude, slope, Köppen, regions and country measured, country tile line, country photo blocks, mask,
  Atlas cover. Map flags, tours and Study are gaps for every country.
- Next: wave 2 (Hessische Bergstraße, Baden, Württemberg, Franken). Hessen's ALKIS route now works for Hessische Bergstraße too.
