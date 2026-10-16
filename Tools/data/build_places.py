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

# Study region for places that have no polygon in the 2014 layer (from dop-overrides.json "missing"), by EU file number.
# Kept out of the quiz pool (taxonomy check, finding 6 of the plan review): Cava and the generic Catalunya DO (they overlap
# other DOs), the all-islands Islas Canarias VC, every Vino de Pago, and Urbezo (a single estate the ministry lists as DO).
NOT_QUIZZED = {"PDO-ES-A0735": "Overlaps other DOs across six regions.", "PDO-ES-A1549": "Covers most of the other Catalan DOs.",
               "PDO-ES-A1511": "Covers all the islands, over their own DOs.",
               "PDO-ES-02585": "A single estate; the ministry lists it as DO, the 2024 registration calls it a pago. Kept with the Pagos until the owner decides."}

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


def main():
    layer = json.loads((ROOT / "data/dops.geojson").read_text())
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
                 "parent": "spain", "region": (hit or miss)["region"], "community": r["community"].title(), "euFile": r["euFile"],
                 "layerCode": hit["code"] if hit else None,
                 "boundary": "mapa-2014" if hit else "to-fetch", "centroid": hit["centroid"] if hit else None, "quiz": quiz}
        if not hit and pid in added: place["boundary"], place["centroid"] = "added", added[pid]
        if pid in ALSO_WITHIN: place["alsoWithin"] = ALSO_WITHIN[pid]
        if r["euFile"] in NOT_QUIZZED: place["quizNote"] = NOT_QUIZZED[r["euFile"]]
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

    ids = [p["id"] for p in places]
    assert len(ids) == len(set(ids)), "duplicate id"
    doc = {
        "$comment": "The place tree. Ids are stable (decision #41); home parent plus alsoWithin overlaps (#42). Study regions are a course grouping over the tree. Built by Tools/data/build_places.py; sources in data/SOURCES.md.",
        "version": 1,
        "countries": [{"id": "spain", "name": "Spain", "level": "country", "levels": ["country", "region", "place", "zone"]}],
        "courses": [{"id": "sws", "name": "Spanish Wine Scholar", "country": "spain",
                     "groups": [{"id": g, "name": over["regions"][g], "order": i + 1} for i, g in enumerate(COURSE)]}],
        "places": places,
    }
    out = ROOT / "data/places.json"
    out.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    from collections import Counter
    print(out.relative_to(ROOT), Counter(p["quiz"] for p in places), Counter(p["boundary"] for p in places))


if __name__ == "__main__":
    main()
