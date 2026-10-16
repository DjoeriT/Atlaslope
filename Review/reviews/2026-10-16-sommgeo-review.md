# SommGeo check: what to borrow, what to skip

Written 16 Oct 2026 for the owner. Tags: [V] verified (I queried their live data), [O] observed on their pages, [R] reported by their marketing copy, not checked, [A] my assumption.

How I looked: the container can't open sommgeo.com directly, but a page reader could. I read the launch page, the Spain Fast Map and Map Maker demos, the 3D Fast Map guide, Tours, Demos, Sign-up and Pricing. I also pulled the data behind their free Spain Fast Map from their public ArcGIS service. I did not click around inside the 3D apps, so anything about how they feel in the hand is [R].

## The short version

1. **They have no quiz at all.** No flashcards, no self-test, no "where is this?" on any page I read [O]. "Somm Education" on the sign-up page is a label, not a feature anyone describes [O]. Paraje's wedge, the atlas that tests you, is untouched.
2. **Their Spain boundaries are the same 2014 ministry layer we have, gaps and all.** Their free Spain Fast Map serves exactly 90 areas from a layer named `CalidadDiferen…` with the ministry's `CAL_DS_NOM` field [V]. Priorat is "D.O.Priorato", not DOCa, and there are no IGPs / Vinos de la Tierra in it [V]. Their page claims "both DOCa designations (Rioja and Priorat)" and Vino de la Tierra boundaries [O]. The data says otherwise. So issue #1 (current 104 DOPs, Priorat as DOCa, IGPs) is a real edge, not housekeeping.
3. **They are cheap and broad.** $5 a month or $60 a year early-adopter, 15-day trial, "100+ regions", 24 tours, 15 countries [O]. The atlas half of Paraje already exists for the price of two glasses of Rioja.

Blind spot to name plainly: if Paraje becomes "a prettier map of Spain", SommGeo already does that and covers the world. Paraje is only worth building for the quiz and for Rioja depth below DOCa level (sub-zones, villages, viñedos singulares), which they don't map [O: villages and viñedos singulares appear only as text in the Rioja popup].

## What they built (one line each)

| Tool | What it is | Tag |
|---|---|---|
| Globe | 3D map of world wine regions, search, zoom to "vineyard blocks" | [R] |
| Fast Maps | 2D searchable appellation maps, one per country, mobile-friendly. Spain demo is free | [O] |
| 3D Fast Maps | Same with terrain. Left sidebar on every 3D map: sun and shadows by date and time, draw-a-line elevation profile, weather presets | [O] from their guide |
| Map Maker | Build your own map: pick layers, labels, 40 basemaps, placemarks, measure | [O] |
| Tours | Click-through 3D fly-throughs, one stop per appellation, side panel with soils, classification, varieties, producers, climate. "As simple as running a slide deck." Spain tour covers about 70 DOs | [O] |
| Classic Maps | Static high-res maps for print and binders | [O] |
| Tools | Bar and restaurant calculators (pour cost, event pricing, diacritics fixer) | [O] |

Tech: off-the-shelf Esri ArcGIS Online apps embedded in WordPress [V for the Spain Fast Map, A for the rest]. Popup is one field: a title plus a ~150-word paragraph [V]. The Rioja paragraph covers history, 1925 and 1991, Tempranillo and Garnacha, the three sub-zones in passing and the 2017 village and single-vineyard categories. Nothing on soils, elevation or ageing rules [V]. It's written prose, not structured facts, which is why they can't quiz from it.

## Borrow, in priority order

1. **Elevation profile: draw a line, see altitude and slope.** Best study tool they have for "why does Rioja Alta taste different from Rioja Oriental". Cheap for us: MapLibre plus the IGN DEM we already have [A on effort]. Fits v1 Explore on Rioja.
2. **Tours as a guided lesson, then quiz the same stops.** Their tours end where ours should begin. A Rioja lesson: 6 to 8 stops (Haro, the Conchas del Haro, Sierra de Cantabria, Alavesa, Logroño, Oriental, Alfaro), each with a short card, then "now find them". This turns the quiz from cold testing into teach-then-test. Moderate effort, mostly content.
3. **Cycling overlapping areas: "1 of 3" in the card header.** When you click a point that sits in Rioja, Rioja Alavesa and a village, you can step through them. Small, and it solves a real problem our nested data will have.
4. **Bookmarks / preset views.** One-tap "fly to Rioja Alta". Doubles as quiz setup. Small.
5. **Sun and shadow by time of day.** Pretty and good for aspect, but second-tier for exam study. Later.

## Skip

- **The world.** Breadth is their game. Spain then Rioja stays ours.
- **Map Maker, Classic Maps, 40 basemaps.** Production tools for teachers and staff training, not for a student revising.
- **Weather presets.** Their own guide calls it "more of a visualization tool than live data" [O].
- **Prose popups.** Keep our card structured (classification, varieties, soils, elevation, ageing rules as fields). Structured facts are what make questions possible.
- **Beverage-ops calculators, business services.** Different customer.
- **Their marketing claims as facts.** "Only wine map of its kind" and their DOCa claim don't hold up against their own data [V].

## Three things to check later

- Whether their 3D Spain maps carry newer data than the 2D one. I only queried the 2D service [A].
- Licensing: they ask for credit on screenshots and sell embed licences [O]. We take ideas, never their maps, text or data.
- Whether the in-app "Somm Education" hides a quiz behind the trial. Nothing public says so [O]. Worth a 15-day trial from you if it matters.
