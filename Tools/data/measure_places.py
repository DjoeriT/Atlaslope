#!/usr/bin/env python3
"""Measured rows for the fact sheets and the map's climate colours: altitude and Köppen climate inside each place's boundary
(every place with a boundary, quizzed or not; places still waiting for a boundary are skipped).

Writes data/place-measures.json. Needs shapely and Pillow, and network access to the Mapzen Terrarium tiles on AWS Open Data
(the same tiles the 3D map streams). Tiles are cached in ./.cache/terrarium (git-ignored).

Altitude: the land inside the boundary, sampled on a grid (about 1 km apart, at most 6000 points), elevation read from Terrarium
zoom 10 (about 115 m pixels at 40° N). We keep the 10th, 50th and 90th percentiles, rounded to 10 m. The boundary is the whole DO,
not only its vineyards, so the range describes the land, and the sheet says so.
Slope: at the same sample points, from the neighbouring Terrarium pixels (central differences, pixel size from the Mercator scale).
We keep the median slope in degrees and the share of land steeper than 30% (about 16.7°), the slope at which CERVIM counts
viticulture as "heroic" (steep-slope). Pixels are about 115 m, so narrow canyon walls read gentler than they are: compare places
with each other, not with a field survey.
Climate: the share of the boundary's area in each Köppen-Geiger class (Beck et al. 2023, 1991-2020), largest first, classes under
5% dropped.

Comparison rows, measured the same way: "country.spain" (all of Spain's land: spain-mask.json's "land" polygons (Spain only, not its "neighbours"), i.e. the mainland, the
Balearics, the Canaries, Ceuta and Melilla; natural-earth-spain.geojson also holds neighbours' land, so it is not used) and "regions.<id>"
(the union of the boundaries of the region's appellation-level places: parent "spain"; the Rioja zones, whose parent is another place,
are left out because they lie inside the Rioja DOCa).

Portugal (23 Oct 2026): the places with region pt-* are measured the same way, from their outlines in data/countries/pt/areas.geojson
(the feature whose id is the place id) against the Portuguese Köppen polygons <RAW>/build/koppen-portugal.geojson (made by
Tools/data/koppen_country.sh from the same Beck et al. 1 km raster; Tools/rawdir.py gives RAW). Spain's places keep koppen-spain.geojson,
so no Spanish number moves. "country.portugal" is Portugal's land: the union of the CAOP 2025 municipios (mainland, 278) and the two
Madeira islands (caop2025-ram-islands.geojson), both in <RAW>/countries/pt/; the Azores have no place and no climate data and are left out.
"regions.pt-*" are the unions of the pt-* places whose parent is "portugal".

France (23 Oct 2026): the same for the places with region fr-* (appellations and the Chablis zones), from data/countries/fr/areas.geojson
against <RAW>/build/koppen-france.geojson (Tools/data/koppen_country.sh france). "regions.fr-*" are the unions of the places whose parent is
"france". "country.france" is data/countries/fr/mask.json's "land" (the mainland and Corsica) and has Köppen only: its altitude would need
about 660 Terrarium tiles that are not cached here, and fetching them waits for the owner's word (KOPPEN_ONLY).

Usage: python3 Tools/data/measure_places.py [--offline]
(--offline: no fetching; sample points on uncached tiles are dropped and counted. The France run of 23 Oct 2026 used it: three tiles
were not cached and the owner had not okayed fetching, so regions fr-* lost 3 of about 2400 points.)
"""
import io, json, math, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW  # noqa: E402
from PIL import Image
from shapely.geometry import Point, shape
from shapely.ops import unary_union
from shapely.prepared import prep

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
CACHE = ROOT / ".cache" / "terrarium"
Z = 10
TILE = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
UA = "AtlaslopeDataBot/0.1 (https://github.com/DjoeriT/Atlaslope)"
# Rows measured for Köppen only: France's land needs ~660 uncached Terrarium tiles; fetching them waits for the owner's word (23 Oct 2026).
KOPPEN_ONLY = {"country:france"}
# --offline: read only cached tiles and drop the sample points on a tile that is not cached (counted per row on stderr).
OFFLINE = "--offline" in sys.argv


def load(name):
    return json.loads((DATA / name).read_text())


def boundaries(places):
    dops = {}
    for f in load("dops.geojson")["features"]:
        dops.setdefault(f["properties"]["code"], []).append(shape(f["geometry"]))
    added = {f["properties"]["id"]: shape(f["geometry"]) for f in load("added-boundaries.geojson")["features"]}
    zones = {f["properties"]["zone"]: shape(f["geometry"]) for f in load("rioja-zones.geojson")["features"]}
    out = {}
    for p in places:
        if p["boundary"] == "mapa-2014":
            out[p["id"]] = unary_union(dops[p["layerCode"]])
        elif p["boundary"] == "added":
            out[p["id"]] = added[p["id"]]
        elif p["boundary"] == "rioja-zones":
            out[p["id"]] = zones[p["name"]]
    return out


def area_boundaries(code, places):
    """Outlines of a country's places (code "pt" or "fr"): the data/countries/<code>/areas.geojson feature whose id is the place id."""
    feats = {f["properties"]["id"]: shape(f["geometry"]) for f in json.loads((DATA / f"countries/{code}/areas.geojson").read_text())["features"]}
    return {p["id"]: feats[p["id"]] for p in places if p["id"] in feats}


def france_land():
    """mask.json's "land" polygons: the mainland and Corsica (Natural Earth, simplified to about 200 m), not the neighbours."""
    land = unary_union([shape({"type": "Polygon", "coordinates": rings}) for rings in load("countries/fr/mask.json")["land"]])
    assert -6 < land.bounds[0] and land.bounds[2] < 10 and 41 < land.bounds[1] and land.bounds[3] < 52, land.bounds
    return land


def portugal_land():
    """CAOP 2025 municipios (mainland) plus the Madeira islands. Lon/lat, like the rest."""
    geoms = []
    for name in ("caop2025-municipios.geojson", "caop2025-ram-islands.geojson"):
        geoms += [shape(f["geometry"]) for f in json.loads((RAW / "countries/pt" / name).read_text())["features"]]
    land = unary_union(geoms)
    assert -20 < land.bounds[0] and land.bounds[2] < -5 and 30 < land.bounds[1] and land.bounds[3] < 43, land.bounds
    return land


def spain_land():
    return unary_union([shape({"type": "Polygon", "coordinates": rings}) for rings in load("spain-mask.json")["land"]])


def tile_xy(lon, lat):
    n = 2 ** Z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y


_tiles = {}


def fetch(xy):
    x, y = xy
    path = CACHE / f"{Z}-{x}-{y}.png"
    if not path.exists():
        if OFFLINE:
            return xy, None
        req = urllib.request.Request(TILE.format(z=Z, x=x, y=y), headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            path.write_bytes(r.read())
    return xy, Image.open(io.BytesIO(path.read_bytes())).convert("RGB")


def points_in(geom):
    minx, miny, maxx, maxy = geom.bounds
    lat = (miny + maxy) / 2
    km2 = geom.area * 111.32 ** 2 * math.cos(math.radians(lat))
    step_km = max(1.0, math.sqrt(km2 / 6000))
    dy = step_km / 111.32
    dx = dy / math.cos(math.radians(lat))
    g = prep(geom)
    pts = []
    y = miny + dy / 2
    while y < maxy:
        x = minx + dx / 2
        while x < maxx:
            if g.contains(Point(x, y)):
                pts.append((x, y))
            x += dx
        y += dy
    if len(pts) < 20:  # tiny places (Urbezo): sample the representative point's neighbourhood densely
        c = geom.representative_point()
        pts = [(c.x, c.y)] + [(px, py) for px, py in points_dense(geom)]
    return pts


def points_dense(geom, n=400):
    minx, miny, maxx, maxy = geom.bounds
    g = prep(geom)
    side = int(math.sqrt(n)) + 1
    return [(minx + (maxx - minx) * (i + .5) / side, miny + (maxy - miny) * (j + .5) / side)
            for i in range(side) for j in range(side)
            if g.contains(Point(minx + (maxx - minx) * (i + .5) / side, miny + (maxy - miny) * (j + .5) / side))]


def elevation(img, fx, fy):
    r, g, b = img.getpixel((min(255, int(fx * 256)), min(255, int(fy * 256))))
    return r * 256 + g + b / 256 - 32768


def elevation_at(tiles, gx, gy):
    """Elevation at global pixel (gx, gy) of zoom Z; None if that tile is not loaded."""
    img = tiles.get((gx // 256, gy // 256))
    if img is None:
        return None
    r, g, b = img.getpixel((gx % 256, gy % 256))
    return r * 256 + g + b / 256 - 32768


def slope_pct(tiles, x, y, lat):
    """Slope in percent at tile coordinates (x, y), from the four neighbouring pixels."""
    gx, gy = int(x * 256), int(y * 256)
    e = [elevation_at(tiles, gx + dx, gy + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))]
    if None in e:
        return None
    px = 40075016.686 * math.cos(math.radians(lat)) / (256 * 2 ** Z)  # metres per pixel
    return 100 * math.hypot((e[0] - e[1]) / (2 * px), (e[2] - e[3]) / (2 * px))


def neighbours(x, y):
    gx, gy = int(x * 256), int(y * 256)
    return {((gx + dx) // 256, (gy + dy) // 256) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (0, 0))}


def pct(vals, q):
    s = sorted(vals)
    return s[min(len(s) - 1, max(0, round(q * (len(s) - 1))))]


def r10(v):
    return int(round(v / 10.0) * 10)


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    every = load("places.json")["places"]
    code_of = lambda p: p["region"][:2] if p["region"][:3] in ("pt-", "fr-") else "es"
    places = [p for p in every if p["boundary"] in ("mapa-2014", "added", "rioja-zones") and code_of(p) == "es"]
    geoms = boundaries(places)
    for code in ("pt", "fr"):
        mine = [p for p in every if code_of(p) == code and p["boundary"] == "added"]
        geoms.update(area_boundaries(code, mine))
        places += mine
    missing = [p["id"] for p in places if p["id"] not in geoms] + [p["id"] for p in every if p["quiz"] != "none" and p not in places]
    if missing:
        sys.exit(f"no boundary for {missing}")
    regions = {}
    for p in places:
        if p["parent"] in ("spain", "portugal", "france") and p["id"] in geoms:  # appellation level; zones have another place as parent
            regions.setdefault(p["region"], []).append(geoms[p["id"]])
    targets = dict(geoms)
    targets.update({f"region:{r}": unary_union(g) for r, g in regions.items()})
    targets["country:spain"] = spain_land()
    targets["country:portugal"] = portugal_land()
    targets["country:france"] = france_land()
    samples = {tid: points_in(g) for tid, g in targets.items() if tid not in KOPPEN_ONLY}
    need = {t for pts in samples.values() for lon, lat in pts for t in neighbours(*tile_xy(lon, lat))}
    print(f"{len(need)} tiles", file=sys.stderr)
    with ThreadPoolExecutor(8) as ex:
        tiles = {xy: img for xy, img in ex.map(fetch, sorted(need)) if img is not None}
    dropped = {}
    kop = lambda feats: [(f["properties"]["code"], f["properties"]["name"], shape(f["geometry"])) for f in feats]
    koppen = {"es": kop(load("koppen-spain.geojson")["features"])}
    for code, name in (("pt", "portugal"), ("fr", "france")):
        koppen[code] = kop(json.loads((RAW / f"build/koppen-{name}.geojson").read_text())["features"])
    code_by_target = {p["id"]: code_of(p) for p in places} | {f"region:{r}": code_of({"region": r}) for r in regions}
    code_by_target |= {"country:spain": "es", "country:portugal": "pt", "country:france": "fr"}
    rows = {}
    for tid, geom in targets.items():
        shares = {}
        for code, name, kg in koppen[code_by_target[tid]]:
            if kg.intersects(geom):
                a = kg.intersection(geom).area
                if a > 0:
                    shares[code] = (shares.get(code, (name, 0))[0], shares.get(code, (name, 0))[1] + a)
        total = sum(a for _, a in shares.values()) or 1
        climate = sorted(({"code": c, "name": n, "share": round(a / total, 2)} for c, (n, a) in shares.items()), key=lambda d: -d["share"])
        if tid in KOPPEN_ONLY:
            rows[tid] = {"koppen": [c for c in climate if c["share"] >= .05]}
            continue
        elev, slopes = [], []
        for lon, lat in samples[tid]:
            x, y = tile_xy(lon, lat)
            if (int(x), int(y)) not in tiles:  # --offline and the tile is not cached
                dropped[tid] = dropped.get(tid, 0) + 1
                continue
            e = elevation(tiles[(int(x), int(y))], x - int(x), y - int(y))
            elev.append(e)
            if e > 0:
                slopes.append(slope_pct(tiles, x, y, lat))
        land = [e for e in elev if e > 0] or elev
        slopes = [v for v in slopes if v is not None] or [0.0]
        rows[tid] = {
            "altitude": {"p10": r10(pct(land, .1)), "median": r10(pct(land, .5)), "p90": r10(pct(land, .9)), "samples": len(land)},
            "slope": {"medianDeg": round(math.degrees(math.atan(pct(slopes, .5) / 100)), 1),
                      "steepShare": round(sum(v > 30 for v in slopes) / len(slopes), 2)},
            "koppen": [c for c in climate if c["share"] >= .05],
        }
    for tid, n in sorted(dropped.items()):
        print(f"{tid}: {n} of {len(samples[tid])} points on uncached tiles, dropped", file=sys.stderr)
    # Rows in places.json order, Portugal's last (the order since they were added, so a re-run's diff shows only changed numbers).
    order = {p["id"]: i for i, p in enumerate(every)}
    out = {p["id"]: rows[p["id"]] for p in sorted(places, key=lambda p: (code_of(p) == "pt", order[p["id"]]))}
    doc = {
        "$comment": "Measured rows for the fact sheets, built by Tools/data/measure_places.py. altitude: metres, percentiles of the land inside "
                    "the boundary (Mapzen Terrarium zoom 10). slope: median slope in degrees and share of land steeper than 30% (CERVIM's "
                    "steep-slope mark), from the same tiles; ~115 m pixels read narrow slopes gentler. koppen: share of the boundary area per Köppen-Geiger class (Beck et al. 2023, "
                    "1991-2020), classes under 5% dropped. places: one row per place. country.spain: the same measures over all of Spain's land "
                    "(spain-mask.json); country.portugal: the same over Portugal's land (CAOP municipios and the Madeira islands); country.france: Köppen only, over "
                    "France's land (countries/fr/mask.json), its altitude not measured yet. Portuguese and French places use Köppen polygons made by "
                    "Tools/data/koppen_country.sh. regions: the same measures over the union of a study region's appellation-level places (parent "
                    "spain, portugal or france; zones excluded), for comparisons. See data/SOURCES.md.",
        "places": out,
        "country": {"spain": rows["country:spain"], "portugal": rows["country:portugal"], "france": rows["country:france"]},
        "regions": {r: rows[f"region:{r}"] for r in sorted(regions)},
    }
    (DATA / "place-measures.json").write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {len(out)} places, {len(regions)} regions, Spain", file=sys.stderr)


if __name__ == "__main__":
    main()
