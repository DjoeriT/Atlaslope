# Handoff: release 3 start (16 Oct 2026)

Thread "Release 3: the atlas". The build moved to the fresh thread "Build release 3", because npm never reached this session.

## Done
- Release 3 digest `Review/release-3-digest.md` and four cards `Review/release-3-card-1..4-*.md` (tree on Opus; shell, map, cards on Sonnet). No code yet.
- `.github/workflows/domain-check.yml`: a read-only check of DNS, the Pages domain and HTTPS state, and what the addresses answer. It runs on a push that changes the file, or by hand.

## Decided (defaults [A], in the digest)
- The place card has no facts, photos, guide or test-me buttons in release 3.
- Quiz and Progress are shown but disabled.
- The Canaries inset waits for a later release.
- Home is the map with the Spain card; the Today card arrives in release 5.

## Open
- **npm** [V 14:43Z]: registry.npmjs.org was refused in this session. The owner ticked "Allow package managers" about 14:42Z, which only reaches new sessions.
- **DNS** [V 14:44Z]: ns0.transip.net still serves only the parking records (A 37.97.254.27 plus an AAAA). The owner was given the steps: delete the parking A and AAAA, add four A records 185.199.108-111.153, and point www as a CNAME to djoerit.github.io.
- **Live site**: until the DNS is fixed, djoerit.github.io/Atlaslope redirects to the parking page, and /Paraje returns 404.
- **HTTPS**: Enforce HTTPS follows once GitHub has issued the certificate.

## Where things are
- Branch `claude/release-3-atlas-kupj5t` in DjoeriT/Atlaslope. Remote: https://github.com/djoerit/atlaslope.
