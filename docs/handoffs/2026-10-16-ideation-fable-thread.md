# Hand-off from "Continuing the system ideation" (closed by the owner, 16 Oct 2026 10:14Z)

Nothing was built or pushed to the repo. Building is still paused until the owner says **go**.

## Settled in this thread (all owner decisions, recorded in /mnt/project-files/paraje/scope.md)
- **Flow sketch**: /mnt/project-files/paraje/mocks/flow/index.html. It lists every screen and how they connect.
- **Quiz rules**: five new places a session, in course order. Known means right the last two times; solid means three spaced passes in a row. Zones join once their parent is known. Course order follows the Spanish Wine Scholar sequence.
- **Map**: satellite on by default with the atlas drawn over it. DO colours are strong on imagery. The sea is tinted, the coastline solid. One map menu bottom right, satellite first.
- **Navigation is the place tree**: Spain card › region card › place card › guide, with breadcrumbs. No region dropdown. The theme toggle sits under the wordmark. The mastery map shows due rings and zones.
- **Imagery**: Esri World Imagery with a free ArcGIS key. The owner still has to create the key.
- **Boundaries before v1**: of the 16 places missing from the 2014 layer, only Campo de Calatrava and Cebreros are quizzed; 14 are Vinos de Pago. Cava and the Canaries are in the layer, and the Canaries get an inset. The fetch needs a session on his Mac.
- **Writing**: fact sheets for all 68 core places at launch. Guides go first to Green Spain, Castilla y León and Rioja.

## Deliverables
- **Mocks, round 3**: nine pages in /mnt/project-files/paraje/mocks/atlas-v3/, also on his Mac at ~/Developer/Paraje/mocks/atlas-v3/. The generator is /mnt/project-files/paraje/mocks/atlas-v3/src/gen3.py. The owner said "I like the mock-up".
- **First-principles review of round 3**: /mnt/project-files/paraje/reviews/2026-10-16-first-principles-review-mocks-3.md. All its items are applied.
- **Architecture and services decisions** (32): /mnt/project-files/paraje/architecture-decisions.md.
- **Builder brief draft**: /mnt/project-files/paraje/builder-brief.md. It covers the restart commit, the data step on his Mac, and releases 3 to 7, at an estimated 3 to 5 M tokens.

## Waiting on the owner
1. **"Go"** to start building from the brief.
2. **Yes or no on the new rule** (decision 31): satellite and terrain must be proven to load on his Mac before every release. The incident behind it is release 2's black map.
3. **The ArcGIS key**: the steps are given when release 3 needs it.

## Unresolved [A]
- The release 2 black map was never diagnosed. Satellite loaded fine in the round 3 mocks on his Mac, which use Esri's public endpoint.
