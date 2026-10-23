# Release 72: what to test

Italy joins as the fourth country, with 87 guides. Hard-reload first (Cmd+Shift+R).

- Home and Guides: four country cards in one row on a wide screen: Spain, Portugal, France, Italy. "Open Italy" goes to `/it/`.
- `/it/`: photos (Barolo, Chianti Classico), "87 guides", then nine regions from Piemonte down to Sicily and Sardinia.
  34 places show "Photos soon": Commons had no usable vineyard photo for them.
- Open a few guides: `/it/barolo/`, `/it/chianti-classico/`, `/it/valpolicella/` (Amarone and Recioto are inside it),
  `/it/etna/`, `/it/franciacorta/`, `/it/alto-adige/`, `/it/taurasi/`.
- On the map: Barolo's outline is the official Piemonte area; most others are approximate (whole municipalities), and the
  credits line says so. Frascati looks large because part of Rome is in its zone.
- Known: the `/it/` intro and the card lines are draft copy for you to rewrite; Italy's climate map is grey (next slice);
  the footer still says "Spain and Portugal".

## For you
- Commits: release-71..2056c823 (PRs #231 pilot, #236 first wave; both merged on green CI).
- Checks: PR #236 head c2a6024e green in CI (check with size, ui 1-4, scope); unit 594/594 and `Tools/check.sh` locally; first load
  2,028,046 bytes of 2,100,000 (decision #38, option A).
- Two ReviewBot passes (pilot pages; eight guides spot-checked against the rulebooks), their fixes in.
- Not verified: Safari, iPad, real phones; the other 79 guides beyond the Opus sentence check; photos on the live site.
