#!/usr/bin/env python3
"""Measured rows for the fact sheets and the map's climate colours: altitude and Köppen climate inside each place's boundary
(every place with a boundary, quizzed or not; places still waiting for a boundary are skipped).

Writes data/place-measures.json. Needs shapely and Pillow, and network access to the Mapzen Terrarium tiles on AWS Open Data
(the same tiles the 3D map streams). Tiles are cached in ./.cache/terrarium (git-ignored).

Altitude: the land inside the boundary, sampled on a grid (about 1 km apart, at most 6000 points), elevation read from Terrarium
zoom 10 (about 115 m pixels at 40° N). We keep the 10th, 50th and 90th percentiles, rounded to 10 m. The boundary is the whole DO,
not only its vineyards, so the range describes the land, and the sheet says so.
Climate: the share of the boundary's area in each Köppen-Geiger class (Beck et al. 2023, 1991-2020), largest first, classes under
5% dropped.

Usage: python3 Tools/data/measure_places.py
"""
import io, json, math, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

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


def pct(vals, q):
    s = sorted(vals)
    return s[min(len(s) - 1, max(0, round(q * (len(s) - 1))))]


def r10(v):
    return int(round(v / 10.0) * 10)


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    every = load("places.json")["places"]
    places = [p for p in every if p["boundary"] in ("mapa-2014", "added", "rioja-zones")]
    geoms = boundaries(places)
    missing = [p["id"] for p in places if p["id"] not in geoms] + [p["id"] for p in every if p["quiz"] != "none" and p not in places]
    if missing:
        sys.exit(f"no boundary for {missing}")
    samples = {pid: points_in(g) for pid, g in geoms.items()}
    need = {(int(x), int(y)) for pts in samples.values() for lon, lat in pts for x, y in [tile_xy(lon, lat)]}
    print(f"{len(need)} tiles", file=sys.stderr)
    with ThreadPoolExecutor(8) as ex:
        tiles = dict(ex.map(fetch, sorted(need)))
    koppen = [(f["properties"]["code"], f["properties"]["name"], shape(f["geometry"])) for f in load("koppen-spain.geojson")["features"]]
    out = {}
    for p in places:
        pid, geom = p["id"], geoms[p["id"]]
        elev = []
        for lon, lat in samples[pid]:
            x, y = tile_xy(lon, lat)
            elev.append(elevation(tiles[(int(x), int(y))], x - int(x), y - int(y)))
        land = [e for e in elev if e > 0] or elev
        shares = {}
        for code, name, kg in koppen:
            if kg.intersects(geom):
                a = kg.intersection(geom).area
                if a > 0:
                    shares[code] = (shares.get(code, (name, 0))[0], shares.get(code, (name, 0))[1] + a)
        total = sum(a for _, a in shares.values()) or 1
        climate = sorted(({"code": c, "name": n, "share": round(a / total, 2)} for c, (n, a) in shares.items()), key=lambda d: -d["share"])
        out[pid] = {
            "altitude": {"p10": r10(pct(land, .1)), "median": r10(pct(land, .5)), "p90": r10(pct(land, .9)), "samples": len(land)},
            "koppen": [c for c in climate if c["share"] >= .05],
        }
    doc = {
        "$comment": "Measured rows for the fact sheets, built by Tools/data/measure_places.py. altitude: metres, percentiles of the land inside "
                    "the boundary (Mapzen Terrarium zoom 10). koppen: share of the boundary area per Köppen-Geiger class (Beck et al. 2023, "
                    "1991-2020), classes under 5% dropped. See data/SOURCES.md.",
        "places": out,
    }
    (DATA / "place-measures.json").write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {len(out)} places", file=sys.stderr)


if __name__ == "__main__":
    main()
