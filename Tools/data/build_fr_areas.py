#!/usr/bin/env python3
"""Builds France's pilot outlines (data/countries/fr/areas-spec.json) from INAO's parcel delimitation of wine AOCs.

INAO's shapefile holds one polygon per denomination and commune (Lambert-93, EPSG:2154). For each place and zone in the spec the
script dissolves the rows of its 'app' and 'denom', measures km2 in Lambert-93, simplifies (places 40 m, zones 10 m: climats are
small) and writes data/countries/fr/areas.geojson in WGS84: one feature per place and zone (id, place, zone, parent, app, denom,
communes, km2). Data only: nothing here feeds the app yet (France pilot waits, decision #52).

Run: python3 Tools/data/build_fr_areas.py   (needs data/raw/countries/fr/inao-delim-parcellaire-aoc-shp.zip from
Tools/countries/pull.py, and ogr2ogr; in a worktree set ATLASLOPE_RAW=<main checkout>/data/raw)
"""
import json, os, subprocess, tempfile, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = Path(os.environ.get("ATLASLOPE_RAW", ROOT / "data/raw")) / "countries/fr"  # a worktree points this at the main checkout
ZIP = RAW / "inao-delim-parcellaire-aoc-shp.zip"
SPEC = ROOT / "data/countries/fr/areas-spec.json"
OUT = ROOT / "data/countries/fr/areas.geojson"
SIMPLIFY = {"place": 40, "zone": 10}  # metres in Lambert-93


def shapefile():
    shp = next(RAW.glob("shp/*.shp"), None)
    if not shp:
        with zipfile.ZipFile(ZIP) as z:
            z.extractall(RAW / "shp")
        shp = next(RAW.glob("shp/*.shp"))
    return shp


def cut(shp, app, denom, simplify):
    q = lambda s: s.replace("'", "''")
    sql = (f"SELECT ST_Union(geometry) AS geometry, ST_Area(ST_Union(geometry)) / 1e6 AS km2, "
           f"group_concat(DISTINCT nomcom) AS communes FROM \"{shp.stem}\" "
           f"WHERE app = '{q(app)}' AND denom = '{q(denom)}'")
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp) / "cut.geojson"
        subprocess.run(["ogr2ogr", "-f", "GeoJSON", str(out), str(shp), "-dialect", "sqlite", "-sql", sql,
                        "-simplify", str(simplify), "-t_srs", "EPSG:4326", "-lco", "COORDINATE_PRECISION=5"],
                       check=True, capture_output=True)
        feats = json.loads(out.read_text())["features"]
    if not feats or not feats[0]["geometry"]:
        raise SystemExit(f"no INAO rows for app={app!r} denom={denom!r}")
    return feats[0]


def main():
    shp, spec, out = shapefile(), json.loads(SPEC.read_text()), []
    for place, p in spec.items():
        if place.startswith("$"):
            continue
        units = [(place, None, p)] + [(z, place, zs) for z, zs in p.get("zones", {}).items()]
        for uid, parent_place, u in units:
            kind = "zone" if parent_place else "place"
            f = cut(shp, u["app"], u["denom"], SIMPLIFY[kind])
            pr = f["properties"]
            f["properties"] = {"id": uid, "place": place, "kind": kind, "parent": u.get("parent", parent_place),
                               "app": u["app"], "denom": u["denom"], "km2": round(pr["km2"], 2),
                               "communes": sorted(pr["communes"].split(","))}
            out.append(f)
            print(f"{uid:22} {kind:5} {pr['km2']:8.2f} km2  {len(f['properties']['communes'])} communes")
    OUT.write_text(json.dumps({"type": "FeatureCollection", "features": out}, ensure_ascii=False, separators=(",", ":")))
    print(f"{OUT.relative_to(ROOT)}: {len(out)} features, {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
