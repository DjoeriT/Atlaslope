# Map tour, clean slate: first principles (#148)

LeadBot, 21 Oct 2026. The owner reopened the tour design: the release 59 tour, the release 61 fold-in, the release 62 fixes and
mock option B did not give the feeling he wants. Goal, his words [O]: the tour must "feel special" and cinematic, the map in step
with the text, never jumping, each place with its own photo.

## Who opens a tour, and why
- A wine lover with a glass of Rioja, on a sofa, often on a phone. [A] They want to see where it comes from, and why it tastes like it does.
- They have a few minutes and no task. The tour is a treat, not a lookup. The guide's text is the lookup.
- So the tour can ask for attention, one place at a time. It must never make them work to keep up.

## What "cinematic" means here
- **Pace:** the reader sets it. One beat per screen. Nothing moves while they read; the camera moves between beats.
- **Framing:** wide, then close. An establishing shot of the valley, then each place tight and tilted, the way a film cuts in.
  Every stop has a composed view, not "the pin somewhere in the middle".
- **Motion:** one slow, eased move per beat, about 2 to 4 seconds. No zoom-out-then-in hops. Arriving matters more than flying.
- **Picture:** the photo is the close-up. The satellite shows where, the photo shows what it looks like on the ground.
- **Copy:** like a caption or a subtitle. One short sentence on screen, the rest in the guide. One idea per line.

## What broke it in releases 61-62 [V, Review/mock-tour-wow "0 · What changed"]
- The fold-in shrank the map from 61% to 46% of the width; it became a side panel, not a stage.
- The stop cards went, and with them every photo and the sentence by the pin.
- Release 62 moves the map whenever a stop link crosses the reading line: it flies mid-paragraph, so the map jumps while you read.
- Stop 1 stayed on all of northern Spain: no establishing shot of Rioja itself.
- Net: the map reacts to scrolling instead of telling the story. Motion without a cut is what reads as "jumping".

## Reference experiences (study, never copy)
1. **NYT, Snow Fall (2012)**: https://www.nytimes.com/projects/2012/snow-fall/index.html. Motion waits for the reader;
   full-bleed moments open each chapter, then the text takes over.
2. **NYT, The Russia Left Behind (2013)**: https://www.nytimes.com/newsgraphics/2013/10/13/russia/. A road trip told stop by
   stop: the route map advances with the text and each stop opens on its own photograph.
3. **The Guardian, Firestorm (2013)**: https://www.theguardian.com/world/interactive/2013/may/26/firestorm-bushfire-dunalley-holmes-family.
   Chapters as full screens, a big photo or film per chapter, very few words per screen.
4. **Google Earth, Voyager stories**: https://earth.google.com/web/. Tilted 3D flights between places, one card per stop,
   the viewer taps to go on; the arrival framing is the craft.
5. **Mapbox storytelling template**: https://github.com/mapbox/storytelling. The scroll-driven pattern release 62 is built on: one
   camera per chapter, fly on chapter enter. Good when chapters are long and few; it jumps when stops are many and close together.

Links opened 21 Oct 2026 (HTTP 200) [V].

## Four directions for round 1, subtle to bold
1. **Still guide.** The guide as it is, but the map holds one view per section; the stop you read lights up and its photo
   sits in the map corner. Moves only at a section turn or on a tapped link.
2. **Guide plus "Fly the tour" (option B, decided earlier, now one of four).** Direction 1 plus the release 59 full-screen tour
   behind a big photo entry at the top of the guide.
3. **Scenes.** The guide itself becomes the tour. Each section opens with a full-width establishing scene (tilted satellite,
   title, one line); the map then pins beside the text and changes only at the next scene. Each stop is a large photo card in the
   text column, with the map framed on it while that card is in view. One experience, no second mode.
4. **Film.** A full-screen tour you play: tap play, the camera glides stop to stop, a subtitle line and the photo fade in on
   arrival, pause or step any time. The guide text sits below as the reference.

Recommendation [A, before the mock]: **3, Scenes**. It is the only one where the map and the text are one story and there is no
second mode to find; the cut at each scene turn is what makes motion read as cinematic rather than jumpy. Round 1 tests it.
