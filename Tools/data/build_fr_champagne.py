#!/usr/bin/env python3
"""Adds Champagne's outline (feature id "champagne") to data/countries/fr/areas.geojson.

Why: INAO's parcel shapefile (build_fr_areas.py) has no Champagne rows, and the EU single document only cites the law of
6 May 1919. INAO's open list of communes per AOC/AOP does name them: the rows of "Champagne" (not Coteaux champenois, not
Rose des Riceys) are 635 communes in Marne, Aisne, Aube, Seine-et-Marne and Haute-Marne. Their boundaries come from IGN
ADMIN EXPRESS (Geoplateforme WFS; 19 communes merged since are its "communes deleguees"). The area is WHOLE COMMUNES: the AOC's own parcels are only a part of them, so the outline
is wider than the vines. Dissolved in Lambert-93, closed and simplified by size like build_fr_areas.py's places
(4 m per square root of km2, simplify capped at 300 m, close capped at 400 m), written in WGS84. Only the "champagne"
feature is added or replaced; every other feature is kept as it is.

Run: python3 Tools/data/build_fr_champagne.py   (needs ogr2ogr and network; raw files go to <raw folder>/countries/fr/,
Tools/rawdir.py: inao-communes-aires-ao.csv and ign-champagne-communes.geojson, fetched here if missing)
"""
import csv, json, subprocess, sys, tempfile, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW  # noqa: E402
RAW = RAW / "countries/fr"
OUT = ROOT / "data/countries/fr/areas.geojson"
UA = {"User-Agent": "Atlaslope data check"}
CSV_URL = "https://static.data.gouv.fr/resources/aires-geographiques-des-aoc-aop/20251009-122320/2025-10-09-comagri-communes-aires-ao.csv"
WFS = "https://data.geopf.fr/wfs/ows"
IDA = "54"  # INAO's id of the appellation "Champagne"


def get(url, dest):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
        dest.write_bytes(r.read())


def communes():
    csv_path = RAW / "inao-communes-aires-ao.csv"
    if not csv_path.exists():
        RAW.mkdir(parents=True, exist_ok=True)
        get(CSV_URL, csv_path)
    rows = csv.DictReader(csv_path.open(encoding="cp1252"), delimiter=";")
    return sorted({r["CI"] for r in rows if r["IDA"] == IDA})


def boundaries(codes):
    path = RAW / "ign-champagne-communes.geojson"
    if path.exists():
        return path
    feats = []
    # communes merged into a new commune since INAO's list (COG of its file) are IGN's "commune associee ou deleguee": same
    # code, own outline
    for layer in ("commune", "commune_associee_ou_deleguee"):
        todo = [c for c in codes if c not in {x["properties"]["code_insee"] for x in feats}]
        for i in range(0, len(todo), 100):
            cql = "code_insee IN (%s)" % ",".join(f"'{c}'" for c in todo[i:i + 100])
            q = urllib.parse.urlencode({"service": "WFS", "version": "2.0.0", "request": "GetFeature", "outputFormat": "application/json",
                                        "typeNames": f"ADMINEXPRESS-COG-CARTO.LATEST:{layer}", "srsName": "EPSG:4326", "cql_filter": cql})
            with urllib.request.urlopen(urllib.request.Request(f"{WFS}?{q}", headers=UA), timeout=180) as r:
                feats += json.load(r)["features"]
    path.write_text(json.dumps({"type": "FeatureCollection", "features": feats}, ensure_ascii=False))
    return path


def ogr(*args):
    return subprocess.run(["ogr2ogr", *args], check=True, capture_output=True, text=True).stdout


def main():
    codes = communes()
    src = boundaries(codes)
    with tempfile.TemporaryDirectory() as tmp:
        lam = Path(tmp) / "communes.geojson"
        ogr("-f", "GeoJSON", str(lam), str(src), "-t_srs", "EPSG:2154", "-nln", "communes")
        sql_area = f'SELECT SUM(ST_Area(geometry)) / 1e6 AS km2 FROM "communes"'
        raw_km2 = float(ogr("-f", "CSV", "/vsistdout/", str(lam), "-dialect", "sqlite", "-sql", sql_area).split()[-1])
        k = 4 * raw_km2 ** 0.5
        simplify, close = min(max(k, 80), 300), min(max(k, 150), 400)
        out = Path(tmp) / "cut.geojson"
        sql = (f"SELECT ST_Buffer(ST_Buffer(ST_Union(geometry), {close}), -{close}) AS geometry, "
               f"ST_Area(ST_Union(geometry)) / 1e6 AS km2, group_concat(nom_officiel, '|') AS communes FROM \"communes\"")
        ogr("-f", "GeoJSON", str(out), str(lam), "-dialect", "sqlite", "-sql", sql, "-simplify", str(simplify),
            "-t_srs", "EPSG:4326", "-lco", "COORDINATE_PRECISION=5")
        f = json.loads(out.read_text())["features"][0]
    pr = f["properties"]
    names = sorted(pr["communes"].split("|"))
    if len(names) != len(codes):
        raise SystemExit(f"IGN returned {len(names)} communes for {len(codes)} INSEE codes")
    f["properties"] = {"id": "champagne", "place": "champagne", "kind": "place", "parent": None, "app": "Champagne",
                       "denom": "Champagne", "km2": round(pr["km2"], 2), "communes": names,
                       "note": "Whole communes of the AOC's INAO commune list; the AOC's parcels are only a part of them"}
    data = json.loads(OUT.read_text())
    data["features"] = [x for x in data["features"] if x["properties"].get("id") != "champagne"] + [f]
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    print(f"champagne: {len(names)} communes, {f['properties']['km2']} km2, simplify {simplify:.0f} m, close {close:.0f} m; "
          f"{OUT.relative_to(ROOT)} {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
