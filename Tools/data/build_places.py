#!/usr/bin/env python3
"""Builds data/places.json, the place tree, from the ministry's list of wine DOPs (Review/sources/mapa-listado-vinos-2026-07-02.txt),
the 2014 boundary layer (data/dops.geojson) with its corrections (data/dop-overrides.json) and the Rioja zones (data/rioja-zones.geojson).

Run: python3 Tools/data/build_places.py   (rewrites data/places.json; the unit tests in tests/unit/places.test.ts pin the counts)
"""
import json, re, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIST = ROOT / "Review/sources/mapa-listado-vinos-2026-07-02.txt"

# Spanish Wine Scholar chapters, in course order (Review/reviews/2026-10-16-taxonomy-check.md); islands split in two for the legend.
COURSE = ["green-spain", "castilla-y-leon", "rioja", "ebro", "cataluna", "mediterranean", "meseta", "andalucia", "baleares", "canarias"]

# Full chapter names where the short one shows (owner, 18 Oct 2026, "What's with the commas"); search still finds the full one.
CHAPTERS = {"meseta": "Meseta: Castilla-La Mancha, Madrid, Extremadura"}

# EU file numbers the ministry list gets wrong, corrected by hand when the guide was written (Mediterranean guides, 79ac795).
EU_FILES = {"tharsys": "PDO-ES-02980"}

# Study region for places that have no polygon in the 2014 layer (from dop-overrides.json "missing"), by EU file number.
# Kept out of the quiz pool (taxonomy check, finding 6 of the plan review): Cava and the generic Catalunya DO (they overlap
# other DOs), the all-islands Islas Canarias VC and every Vino de Pago. Urbezo, a single estate the ministry lists as DO, is quizzed (owner, 16 Oct 2026).
NOT_QUIZZED = {"PDO-ES-A1511": "Covers all the islands, over their own DOs."}
# Quizzed, but never as "find it" on the map: they overlap other DOs (owner, 21 Oct 2026: named at WSET Level 2 and 3). This was a
# hand edit of data/places.json until the France pilot's rebuild dropped it (22 Oct 2026); the build now carries it.
NO_FIND_IT = {"PDO-ES-A0735": "Overlaps other DOs across six regions, so Learn asks what is this and facts, never find it (owner, 21 Oct 2026: named at WSET Level 2 and 3).",
              "PDO-ES-A1549": "Covers most of the other Catalan DOs, so Learn asks what is this and facts, never find it (owner, 21 Oct 2026: named at WSET Level 2 and 3)."}
# Quizzed places that need a word of explanation in the tree.
QUIZ_NOTES = {"PDO-ES-02585": "A single estate (one cadastral polygon of Cariñena, surrounded by DO Cariñena) that the ministry lists as DO; quizzed as a core place on the owner's word (16 Oct 2026)."}

# Short stable ids where the slug of the name would be long or would clash (decision #41: short, never changes, no parent in it).
IDS = {"Jerez-Xérès-Sherry": "jerez", "Manzanilla-Sanlúcar de Barrameda": "manzanilla", "Cataluña / Catalunya": "catalunya",
       "Arabako Txakolina / Txakolí de Álava": "txakoli-alava", "Bizkaiko Txakolina / Txakolí de Bizkaia": "txakoli-bizkaia",
       "Getariako Txakolina / Txakolí de Getaria": "txakoli-getaria", "Priorat": "priorat", "Pago de Arínzano": "arinzano",
       "Pago de Otazu": "otazu", "Campo de La Guardia": "campo-de-la-guardia"}

# Display names: the ministry's name, shortened the way the overrides already do (the layer's names win where it has the place).
SHORT = {"Jerez-Xérès-Sherry / Jerez / Xérès / Sherry": "Jerez-Xérès-Sherry", "Manzanilla-Sanlúcar de Barrameda / Manzanilla": "Manzanilla-Sanlúcar de Barrameda",
         "Priorat / Priorato": "Priorat", "Arabako Txakolina / Txakolí de Álava / Chacolí de Álava": "Arabako Txakolina / Txakolí de Álava",
         "Bizkaiko Txakolina / Chacolí de Bizkaia / Txakolí de Bizkaia": "Bizkaiko Txakolina / Txakolí de Bizkaia",
         "Getariako Txakolina / Chacolí de Getaria / Txakolí de Getaria": "Getariako Txakolina / Txakolí de Getaria",
         "Campo de La Guardia": "Campo de la Guardia"}

# Overlaps (decision #42): a place's home parent is Spain; "alsoWithin" names the places whose area contains it.
CATALAN = ["alella", "conca-de-barbera", "costers-del-segre", "emporda", "montsant", "penedes", "pla-de-bages", "priorat", "tarragona", "terra-alta"]
ALSO_WITHIN = {**{c: ["catalunya"] for c in CATALAN}, "manzanilla": ["jerez"]}

ZONES = [("rioja-alta", "Rioja Alta"), ("rioja-alavesa", "Rioja Alavesa"), ("rioja-oriental", "Rioja Oriental")]


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def slug(s):
    return norm(s).replace(" ", "-")


def ministry_rows():
    community, rows = None, []
    for line in LIST.read_text(encoding="utf-8").splitlines():
        m = re.match(r"\s{5,}([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ .,\-]+?)\s{5,}Total: \d+", line)
        if m:
            community = m.group(1).strip()
        m = re.match(r"\s+DOP (.+?)\s{2,}(DOCa|DO|VC|VP)\s+(PDO-ES-\S+)", line)
        if m:
            rows.append({"official": m.group(1), "kind": m.group(2), "euFile": m.group(3), "community": community})
    return rows


def centroid(geom):
    """Area-weighted centroid of the largest polygon (enough for ordering and photo search)."""
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    best, best_a = None, -1
    for p in polys:
        ring = p[0]; a = cx = cy = 0.0
        for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
            f = x1 * y2 - x2 * y1; a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f
        if abs(a) > best_a:
            best_a, best = abs(a), [round(cx / (3 * a), 4), round(cy / (3 * a), 4)]
    return best


# Portugal (issue #149, pilot): places are added one by one as their outline lands (Tools/data/build_pt_areas.py), from the EU
# register (data/countries/pt/register.json). Study groups follow the WSET Level 3 spec's Portugal list [A: grouped by the
# north-to-south order of the CVR regions]; Study for Portugal waits for its course, so the places are not quizzed yet.
PT_GROUPS = [("pt-north", "North"), ("pt-centre", "Centre"), ("pt-lisboa", "Lisboa"), ("pt-tejo", "Tejo"),
             ("pt-setubal", "Setúbal Peninsula"), ("pt-alentejo", "Alentejo"), ("pt-algarve", "Algarve"), ("pt-madeira", "Madeira")]
PT_PLACES = [  # mainland PDOs plus Lisboa, a PGI (Vinho Regional) that WSET names; batch 1, owner option B, 22 Oct 2026
    ("douro", "PDO-PT-A1539", "pt-north"),
    ("vinho-verde", "PDO-PT-A1545", "pt-north"),
    ("porto", "PDO-PT-A1540", "pt-north"),
    ("tras-os-montes", "PDO-PT-A1466", "pt-north"),
    ("tavora-varosa", "PDO-PT-A1541", "pt-north"),
    ("dao", "PDO-PT-A1534", "pt-centre"),
    ("bairrada", "PDO-PT-A1537", "pt-centre"),
    ("beira-interior", "PDO-PT-A1546", "pt-centre"),
    ("lafoes", "PDO-PT-A1455", "pt-centre"),
    ("encostas-daire", "PDO-PT-A1470", "pt-centre"),
    ("lisboa", "PGI-PT-A1535", "pt-lisboa"),
    ("colares", "PDO-PT-A1461", "pt-lisboa"),
    ("carcavelos", "PDO-PT-A1462", "pt-lisboa"),
    ("bucelas", "PDO-PT-A1463", "pt-lisboa"),
    ("torres-vedras", "PDO-PT-A1465", "pt-lisboa"),
    ("alenquer", "PDO-PT-A1468", "pt-lisboa"),
    ("obidos", "PDO-PT-A1469", "pt-lisboa"),
    ("arruda", "PDO-PT-A1471", "pt-lisboa"),
    ("dotejo", "PDO-PT-A1544", "pt-tejo"),
    ("setubal", "PDO-PT-A1457", "pt-setubal"),
    ("palmela", "PDO-PT-A1460", "pt-setubal"),
    ("alentejo", "PDO-PT-A1542", "pt-alentejo"),
    ("lagos", "PDO-PT-A1454", "pt-algarve"),
    ("portimao", "PDO-PT-A1452", "pt-algarve"),
    ("lagoa", "PDO-PT-A1450", "pt-algarve"),
    ("tavira", "PDO-PT-A1449", "pt-algarve"),
    ("madeira", "PDO-PT-A0038", "pt-madeira"),  # owner, 22 Oct 2026: add Madeira and Madeirense
    ("madeirense", "PDO-PT-A0039", "pt-madeira"),
]
PT_QUIZ_NOTE = "Study covers Spain for now; Portugal joins when its WSET course is in Study."


def portugal_places():
    reg = {e["fileNumber"]: e for e in json.loads((ROOT / "data/countries/pt/register.json").read_text())["entries"]}
    areas = {f["properties"]["id"]: f for f in json.loads((ROOT / "data/countries/pt/areas.geojson").read_text())["features"]}
    out = []
    for pid, file, region in PT_PLACES:
        name = reg[file]["names"][0]
        out.append({"id": pid, "name": name, "official": name, "kind": "VR" if file.startswith("PGI") else "DOC", "level": "place", "parent": "portugal",
                    "region": region, "euFile": file, "layerCode": None, "boundary": "added",
                    "centroid": centroid(areas[pid]["geometry"]), "quiz": "none", "quizNote": PT_QUIZ_NOTE})
    located = sorted(out, key=lambda p: -p["centroid"][1])
    for i, p in enumerate(located, 1): p["northSouth"], p["courseOrder"] = i, i
    return out


# France (issue #149, pilot; decisions #52-#58): the WSET L3 list (data/countries/fr/wset-places.json, Tools/countries/fr_wset.py),
# its batches as Study groups, outlines from INAO (data/countries/fr/areas.geojson, Tools/data/build_fr_areas.py). Only shipped
# places enter the tree; each later batch extends FR_SHIP. Climats are zones inside their Premier or Grand Cru zone (#55), so
# France names two zone depths. Not in Study yet.
FR_GROUPS = [("fr-bordeaux", "Bordeaux"), ("fr-south-west", "South-West"), ("fr-burgundy", "Burgundy"), ("fr-beaujolais", "Beaujolais"),
             ("fr-alsace", "Alsace"), ("fr-loire", "Loire"), ("fr-rhone", "Rhône"), ("fr-south", "South"), ("fr-champagne", "Champagne")]
FR_SHIP = ["chablis", "pauillac",
           # Bordeaux batch (22 Oct 2026)
           "bordeaux", "bordeaux-superieur", "cotes-de-bordeaux", "entre-deux-mers", "medoc", "haut-medoc", "saint-estephe", "margaux",
           "saint-julien", "graves", "pessac-leognan", "saint-emilion", "saint-emilion-grand-cru", "pomerol", "sauternes", "barsac",
           # Burgundy batch (22 Oct 2026)
           "bourgogne", "cote-de-nuits-villages", "gevrey-chambertin", "vougeot", "vosne-romanee", "nuits-saint-georges",
           "cote-de-beaune-villages", "aloxe-corton", "beaune", "pommard", "volnay", "meursault", "puligny-montrachet",
           "chassagne-montrachet", "rully", "mercurey", "givry", "montagny", "macon", "pouilly-fuisse", "saint-veran",
           "cremant-de-bourgogne",
           # Loire batch (22 Oct 2026)
           "muscadet", "muscadet-sevre-et-maine", "anjou", "coteaux-du-layon", "savennieres", "saumur", "saumur-champigny", "vouvray",
           "touraine", "bourgueil", "chinon", "sancerre", "pouilly-fume", "menetou-salon", "rose-danjou", "cabernet-danjou",
           "rose-de-loire", "cremant-de-loire",
           # Rhône batch (23 Oct 2026)
           "cotes-du-rhone", "cotes-du-rhone-villages", "cote-rotie", "condrieu", "saint-joseph", "hermitage", "crozes-hermitage",
           "cornas", "chateauneuf-du-pape", "gigondas", "vacqueyras", "lirac", "tavel", "muscat-de-beaumes-de-venise",
           # South-West, Beaujolais, Alsace, South and Champagne (23 Oct 2026): the WSET L3 list complete, 94 places
           "bergerac", "monbazillac", "cahors", "madiran", "jurancon", "beaujolais", "brouilly", "fleurie", "morgon", "moulin-a-vent",
           "alsace", "cremant-dalsace", "languedoc", "minervois", "fitou", "corbieres", "picpoul-de-pinet", "cotes-du-roussillon",
           "cotes-du-roussillon-villages", "bandol", "cotes-de-provence", "champagne",
           # The two PGIs WSET names (23 Oct 2026; fr_wset.py had matched PDOs only): 96 places
           "cotes-de-gascogne", "pays-doc"]
FR_QUIZ_NOTE = "Study covers Spain for now; France joins when its WSET course is in Study."
FR_ZONE_NAMES = {"Chablis premier cru": "Chablis Premier Cru", "Chablis Grand Cru": "Chablis Grand Cru"}  # [A] the wine's name in title case


def france_places():
    wset = {p["id"]: p for p in json.loads((ROOT / "data/countries/fr/wset-places.json").read_text())["places"]}
    spec = json.loads((ROOT / "data/countries/fr/areas-spec.json").read_text())
    areas = {f["properties"]["id"]: f for f in json.loads((ROOT / "data/countries/fr/areas.geojson").read_text())["features"]}
    within = json.loads((ROOT / "data/countries/fr/within.json").read_text())["within"]
    group = {name: gid for gid, name in FR_GROUPS}
    shipped = set(FR_SHIP)
    out = []
    for pid in FR_SHIP:
        w, s = wset[pid], spec.get(pid, {})
        region = group[w["batch"]]
        place = {"id": pid, "name": w["name"], "official": w["registerName"], "kind": "IGP" if w["type"] == "PGI" else "AOC", "level": "place", "parent": "france",
                 "region": region, "euFile": w["fileNumber"], "layerCode": None, "boundary": "added",
                 "centroid": centroid(areas[pid]["geometry"]), "quiz": "none", "quizNote": FR_QUIZ_NOTE}
        # alsoWithin holds tree ids only: a wider AOC joins it once that AOC is shipped. Nesting is measured on the INAO outlines
        # (data/countries/fr/within.json, Tools/data/fr_within.py), nearest first.
        also = [wid for wid in within.get(pid, []) if wid in shipped]
        if also: place["alsoWithin"] = also
        out.append(place)
        for i, (zid, z) in enumerate(s.get("zones", {}).items(), 1):
            parent = z.get("parent", pid)
            name = FR_ZONE_NAMES.get(z["denom"]) or z["denom"].removeprefix(s["zones"][parent]["denom"] + " ")
            out.append({"id": zid, "name": name, "official": z["denom"], "kind": "zone", "level": "zone", "parent": parent, "region": region,
                        "boundary": "added", "centroid": centroid(areas[zid]["geometry"]), "quiz": "none", "quizNote": FR_QUIZ_NOTE, "courseOrder": i})
    located = sorted((p for p in out if p["level"] == "place"), key=lambda p: -p["centroid"][1])
    for i, p in enumerate(located, 1): p["northSouth"], p["courseOrder"] = i, i
    return out


# Italy (issue #149, pilot; decisions #59-#66, #79, #80): WSET L3 regions as Study groups, outlines from Regione Piemonte or ISTAT
# municipal limits (data/countries/it/areas.geojson, Tools/data/build_it_areas.py). Only shipped places enter the tree; each later
# batch adds guides, and IT_SHIP follows them. No zones in the pilot (no MGA or UGA outlines). Not in Study yet.
IT_GROUPS = [("it-piemonte", "Piemonte"), ("it-lombardia", "Lombardia"), ("it-north-east", "Alto Adige, Trentino and Friuli"),
             ("it-veneto", "Veneto"), ("it-emilia-romagna", "Emilia-Romagna"), ("it-tuscany", "Tuscany"), ("it-centre", "Centre"),
             ("it-south", "South"), ("it-islands", "Sicily and Sardinia")]
IT_QUIZ_NOTE = "Study covers Spain for now; Italy joins when its WSET course is in Study."
# Per place: name, EU register name (data/countries/it/register.json), file number, class and group, from the first-wave list
# data/countries/it/places.json (Tools/countries/it_wset.py reads the same list).
IT_PLACES = {p["id"]: p for p in json.loads((ROOT / "data/countries/it/places.json").read_text())["places"]}
IT_REGISTER = {e["fileNumber"]: e for e in json.loads((ROOT / "data/countries/it/register.json").read_text())["entries"]}
# A place ships (enters the tree and the map) once its guide is written: each batch run (headless.py) adds guides, no list to edit.
IT_SHIP = [pid for pid in IT_PLACES if (ROOT / f"content/guides/{pid}.json").exists()]


def italy_places():
    areas = {f["properties"]["id"]: f for f in json.loads((ROOT / "data/countries/it/areas.geojson").read_text())["features"]}
    out = []
    for pid in IT_SHIP:
        p = IT_PLACES[pid]
        out.append({"id": pid, "name": p["name"], "official": IT_REGISTER[p["fileNumber"]]["names"][0], "kind": p["class"],
                    "level": "place", "parent": "italy", "region": p["group"], "euFile": p["fileNumber"], "layerCode": None, "boundary": "added",
                    "centroid": centroid(areas[pid]["geometry"]), "quiz": "none", "quizNote": IT_QUIZ_NOTE})
    for i, p in enumerate(sorted(out, key=lambda p: -p["centroid"][1]), 1): p["northSouth"], p["courseOrder"] = i, i
    return out


# Germany (issue #149, pilot; decisions #71-#78, #93): WSET L3 Anbaugebiete as Study groups. Mosel's outline is the union of the LWK RLP
# g.U. vineyard layer, closed at 150 m and marked approximate (data/countries/de/areas.geojson, Tools/data/build_de_areas.py). Outlines and
# the Einzellagen zones (zones-mosel.geojson) load on demand, not with the map's first load (#38), so boundary is "de-areas", not "added".
# Rheingau has no outline yet (Hessen and BKG refuse scripts): boundary "to-fetch". The Einzellagen are not in the tree (462 rows would
# weigh on the first load). Not in Study yet.
# Wave 1 (23 Oct 2026): the rest of Rheinland-Pfalz. A place ships once its guide exists (as IT_SHIP), so a half-run batch builds.
DE_GROUPS = [("de-mosel", "Mosel"), ("de-rheingau", "Rheingau"), ("de-ahr", "Ahr"), ("de-mittelrhein", "Mittelrhein"), ("de-nahe", "Nahe"),
             ("de-rheinhessen", "Rheinhessen"), ("de-pfalz", "Pfalz")]
DE_QUIZ_NOTE = "Study covers Spain for now; Germany joins when its WSET course is in Study."
DE_PLACES = [("mosel", "Mosel", "PDO-DE-A1270", "de-mosel"), ("rheingau", "Rheingau", "PDO-DE-A1273", "de-rheingau"),
             ("ahr", "Ahr", "PDO-DE-A0867", "de-ahr"), ("mittelrhein", "Mittelrhein", "PDO-DE-A1269", "de-mittelrhein"),
             ("nahe", "Nahe", "PDO-DE-A1271", "de-nahe"), ("rheinhessen", "Rheinhessen", "PDO-DE-A1274", "de-rheinhessen"),
             ("pfalz", "Pfalz", "PDO-DE-A1272", "de-pfalz")]
DE_PLACES = [p for p in DE_PLACES if (ROOT / f"content/guides/{p[0]}.json").exists()]


def germany_places():
    areas = {f["properties"]["id"]: f for f in json.loads((ROOT / "data/countries/de/areas.geojson").read_text())["features"]}
    out = []
    for pid, name, euFile, group in DE_PLACES:
        outline = areas.get(pid)
        out.append({"id": pid, "name": name, "official": name, "kind": "g.U.", "level": "place", "parent": "germany", "region": group,
                    "euFile": euFile, "layerCode": None, "boundary": "de-areas" if outline else "to-fetch",
                    "centroid": centroid(outline["geometry"]) if outline else None, "quiz": "none", "quizNote": DE_QUIZ_NOTE})
    for i, p in enumerate(out, 1): p["courseOrder"] = i
    return out


def main():
    layer =json.loads((ROOT / "data/dops.geojson").read_text())
    over = json.loads((ROOT / "data/dop-overrides.json").read_text())
    by_name = {}
    for f in layer["features"]:
        p = f["properties"]; fix = over["byCode"].get(p["code"], {})
        name = fix.get("name", p["name"])
        by_name[norm(name)] = {"code": p["code"], "name": name, "region": fix.get("region", p.get("region")), "centroid": centroid(f["geometry"])}
    missing = {norm(m["name"]): m for m in over["missing"]}
    added = {f["properties"]["id"]: centroid(f["geometry"]) for f in json.loads((ROOT / "data/added-boundaries.geojson").read_text())["features"]}

    places = []
    for r in ministry_rows():
        name = SHORT.get(r["official"], r["official"])
        hit = by_name.get(norm(name))
        miss = missing.get(norm(name))
        if not hit and not miss:
            raise SystemExit(f"no layer feature or 'missing' entry for {name}")
        pid = IDS.get(name, slug(name))
        kind = r["kind"]
        quiz = "none" if (kind == "VP" or r["euFile"] in NOT_QUIZZED) else ("core" if kind in ("DO", "DOCa") else "vc")
        place = {"id": pid, "name": hit["name"] if hit else name, "official": r["official"], "kind": kind, "level": "place",
                 "parent": "spain", "region": (hit or miss)["region"], "community": re.sub(r" (De|Del|Y) ", lambda m: f" {m.group(1).lower()} ", r["community"].title()), "euFile": r["euFile"],
                 "layerCode": hit["code"] if hit else None,
                 "boundary": "mapa-2014" if hit else "to-fetch", "centroid": hit["centroid"] if hit else None, "quiz": quiz}
        if not hit and pid in added: place["boundary"], place["centroid"] = "added", added[pid]
        if pid in EU_FILES: place["euFile"] = EU_FILES[pid]
        if pid in ALSO_WITHIN: place["alsoWithin"] = ALSO_WITHIN[pid]
        if r["euFile"] in NOT_QUIZZED: place["quizNote"] = NOT_QUIZZED[r["euFile"]]
        if r["euFile"] in NO_FIND_IT: place["quizFindIt"], place["quizNote"] = False, NO_FIND_IT[r["euFile"]]
        if r["euFile"] in QUIZ_NOTES: place["quizNote"] = QUIZ_NOTES[r["euFile"]]
        places.append(place)

    zones_geo = json.loads((ROOT / "data/rioja-zones.geojson").read_text())
    zc = {norm(f["properties"].get("name", "")): centroid(f["geometry"]) for f in zones_geo["features"]}
    for zid, zname in ZONES:
        places.append({"id": zid, "name": zname, "kind": "zone", "level": "zone", "parent": "rioja", "region": "rioja",
                       "community": "La Rioja", "boundary": "rioja-zones", "centroid": zc.get(norm(zname)), "quiz": "zone"})

    # North-to-south rank over everything with a centroid (places without one get it when their boundary lands).
    located = sorted((p for p in places if p["centroid"]), key=lambda p: -p["centroid"][1])
    for i, p in enumerate(located, 1): p["northSouth"] = i
    # Course order [A]: chapter order, then north to south inside a chapter. The manual's own order within a chapter is not public.
    def key(p): return (COURSE.index(p["region"]), p.get("northSouth", 10_000), p["name"])
    for i, p in enumerate(sorted((p for p in places if p["level"] == "place"), key=key), 1): p["courseOrder"] = i

    places += portugal_places()
    places += france_places()
    places += italy_places()
    places += germany_places()

    ids = [p["id"] for p in places]
    assert len(ids) == len(set(ids)), "duplicate id"
    doc = {
        "$comment": "The place tree. Ids are stable (decision #41); home parent plus alsoWithin overlaps (#42). Study regions are a course grouping over the tree. Built by Tools/data/build_places.py; sources in data/SOURCES.md.",
        "version": 1,
        "countries": [{"id": "spain", "name": "Spain", "level": "country", "levels": ["country", "region", "place", "zone"]},
                      {"id": "portugal", "name": "Portugal", "level": "country", "levels": ["country", "region", "place", "zone"]},
                      # Two zone depths: Chablis Premier Cru, then its climats (#55).
                      {"id": "france", "name": "France", "level": "country", "levels": ["country", "region", "place", "zone", "zone"]},
                      {"id": "italy", "name": "Italy", "level": "country", "levels": ["country", "region", "place", "zone"]},
                      {"id": "germany", "name": "Germany", "level": "country", "levels": ["country", "region", "place", "zone"]}],
        "courses": [{"id": "sws", "name": "Spanish Wine Scholar", "country": "spain",
                     "groups": [{"id": g, "name": over["regions"][g], **({"chapter": CHAPTERS[g]} if g in CHAPTERS else {}), "order": i + 1}
                                for i, g in enumerate(COURSE)]},
                    {"id": "wset-pt", "name": "WSET", "country": "portugal",
                     "groups": [{"id": g, "name": n, "order": i + 1} for i, (g, n) in enumerate(PT_GROUPS)]},
                    {"id": "wset-fr", "name": "WSET", "country": "france",
                     # A group joins with its first shipped place (an empty one would show as a region with no guides).
                     "groups": [{"id": g, "name": n, "order": i + 1} for i, (g, n) in enumerate(FR_GROUPS)
                                if any(p["region"] == g for p in places)]},
                    {"id": "wset-it", "name": "WSET", "country": "italy",
                     "groups": [{"id": g, "name": n, "order": i + 1} for i, (g, n) in enumerate(IT_GROUPS)
                                if any(p["region"] == g for p in places)]},
                    {"id": "wset-de", "name": "WSET", "country": "germany",
                     "groups": [{"id": g, "name": n, "order": i + 1} for i, (g, n) in enumerate(DE_GROUPS)
                                if any(p["region"] == g for p in places)]}],
        "places": places,
    }
    out = ROOT / "data/places.json"
    out.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    from collections import Counter
    print(out.relative_to(ROOT), Counter(p["quiz"] for p in places), Counter(p["boundary"] for p in places))


if __name__ == "__main__":
    main()
