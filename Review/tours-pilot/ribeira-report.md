# Ribeira Sacra map tour (pilot 2, #148)
Status: done (one commit on agent/builder/tour-ribeira, not pushed).
- Qualifies: steep (18% of land over 30%, rank 18 of 96; top quarter = 24). Not a DOCa, not top 8 by area.
- Stops (7 incl. intro and closing): canyons (place fly 0), canon (fly 1, Canón do Sil), peares (fly 2), weather (fly 0), ground (Amandi fly 0), rules (closing view). 5 from the guide's own flies.
- Photos: 4 new (canon, Os Peares, Doade, weather; CC BY-SA 4.0 x3, CC BY-SA 2.0 x1) + ribeira-sacra-1/-2; crops checked (shots/ribeira-crops.jpg).
- Tour data 36 KB gz of 150 KB (own 26 + shared 9.5). npm test 1.7 s, build 2 s, check.sh 4 s (all pass).
- Turns: setup/checks 5, data fetch 10, photos 8, story+tests 10, shots 5.
- Shots: Review/tours-pilot/shots/ribeira-{phone,desktop}.jpg. Desktop canyons stop flagged "imagery did not load" (193 tiles; picture shows imagery).
- Open: no rock key for the geology stop (ROCK_KEY in app code); rules stop has no photo; Köppen legend reads "Mild Mediterranean" beside a guide sentence "continental".
