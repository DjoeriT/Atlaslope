#!/usr/bin/env python3
"""Builds Austria's Wachau data (issue #149, decisions #81-#86): the outline and the Rieden.

Source: Land Niederösterreich WFS layer OGD:RLF_WEINBAU_RIEDEN (CC BY 4.0), the Rieden of the Verordnung, filtered to the
Katastralgemeinden the Wachau DAC regulation (BGBl. II 200/2020, § 3 (2)) names as Gemeinde labels. The regulation lists no Ried and no
KG polygon; there is no official DAC outline (the Vinea Wachau and OeTW outlines are private, #85), so the outline is the union of the
Ried land, repaired, closed at CLOSE metres and simplified at SIMPLIFY metres in EPSG:3035, marked approximate. The Ried layer is Ried
land, wider than planted vines. `gemeindeKm2` is the other route, for comparison only: the union of the eight Gemeinden that hold those KGs
(Statistik Austria Gemeinden 2026-01-01, CC BY 4.0), which overshoots (whole municipalities, forest, Mautern town).
Zones: one per Ried name within a KG (a Ried name repeats across KGs; the label rule, § 5 (5), pairs them), simplified at ZONE_SIMPLIFY.
Raw inputs (outside the repo, <raw folder>/countries/at/m/, Tools/rawdir.py, Tools/data/raw-manifest.json): rieden.gpkg, gemeinden.gpkg.
Writes data/countries/at/areas.geojson and data/countries/at/zones-wachau.geojson. Both load on demand.
Run: python3 -I Tools/data/build_at_areas.py
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW as RAW_ROOT  # noqa: E402
RAW = RAW_ROOT / "countries/at/m"
OUT_DIR = ROOT / "data/countries/at"
CLOSE = 150          # metres, as Germany
SIMPLIFY = 40        # metres, as the other countries
DECIMALS = 5
ZONE_SIMPLIFY = 40
ZONE_DECIMALS = 5
# The eight Gemeinden holding the DAC's Katastralgemeinden (comparison route only).
GEMEINDEN = ["Aggsbach", "Bergern im Dunkelsteinerwald", "Dürnstein", "Mautern an der Donau", "Mühldorf", "Rossatz-Arnsdorf", "Spitz",
             "Weißenkirchen in der Wachau"]


def ogr(*args):
    subprocess.run(["ogr2ogr", *args], check=True, capture_output=True)


def one(path):
    return json.loads(Path(path).read_text())["features"]


def write(path, feats):
    path.write_text(json.dumps({"type": "FeatureCollection", "features": feats}, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"wrote {path.relative_to(ROOT)}: {len(feats)} features, {path.stat().st_size / 1024:.0f} KB")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rieden = str(RAW / "rieden.gpkg")
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        valid = "ST_CollectionExtract(ST_MakeValid(geom), 3)"
        raw = tmp / "raw.geojson"
        ogr("-f", "GeoJSON", str(raw), rieden, "-dialect", "sqlite", "-sql", f"SELECT ST_Area(ST_Union({valid})) AS m2 FROM rieden")
        closed = tmp / "closed.geojson"
        ogr("-f", "GeoJSON", str(closed), rieden, "-dialect", "sqlite", "-sql",
            f"SELECT ST_Area(c) AS m2, c AS geometry FROM (SELECT ST_Buffer(ST_Buffer(ST_Union({valid}), {CLOSE}), -{CLOSE}) AS c FROM rieden)")
        feats = one(closed)
        if len(feats) != 1:
            raise SystemExit(f"Wachau: expected one outline, got {len(feats)}")
        gem = tmp / "gem.geojson"
        ogr("-f", "GeoJSON", str(gem), str(RAW / "gemeinden.gpkg"), "-dialect", "sqlite", "-sql",
            "SELECT ST_Area(ST_Union(geom)) AS m2 FROM gemeinden WHERE g_name IN (%s)" % ",".join(f"'{n}'" for n in GEMEINDEN))
        wgs = tmp / "wachau.geojson"
        ogr("-f", "GeoJSON", str(wgs), str(closed), "-simplify", str(SIMPLIFY), "-t_srs", "EPSG:4326",
            "-lco", f"COORDINATE_PRECISION={DECIMALS}", "-select", "")
        geom = one(wgs)[0]["geometry"]
        parts = len(geom["coordinates"]) if geom["type"] == "MultiPolygon" else 1
        props = {"id": "wachau", "place": "wachau", "route": "noe-rieden", "approximate": True, "closedMetres": CLOSE, "parts": parts,
                 "km2": round(feats[0]["properties"]["m2"] / 1e6, 1),
                 "riedenKm2": round(one(raw)[0]["properties"]["m2"] / 1e6, 1),
                 "gemeindeKm2": round(one(gem)[0]["properties"]["m2"] / 1e6, 1)}
        write(OUT_DIR / "areas.geojson", [{"type": "Feature", "properties": props, "geometry": geom}])
        print(f"wachau: {props['km2']} km2 closed at {CLOSE} m (Rieden land {props['riedenKm2']} km2, Gemeinde union {props['gemeindeKm2']} km2), {parts} parts")

        zones = tmp / "zones.geojson"
        ogr("-f", "GeoJSON", str(zones), rieden, "-dialect", "sqlite", "-sql",
            f"SELECT KGNAME AS kg, PGNAME AS gemeinde, WEINBAURIEDE1 AS name, group_concat(DISTINCT WEINBAURIEDE2) AS subrieden, "
            f"count(*) AS parts, ST_Area(ST_Union({valid})) AS m2, ST_Union({valid}) AS geometry FROM rieden GROUP BY KGNAME, WEINBAURIEDE1",
            "-simplify", str(ZONE_SIMPLIFY), "-t_srs", "EPSG:4326", "-lco", f"COORDINATE_PRECISION={ZONE_DECIMALS}")
        out = []
        for f in sorted(one(zones), key=lambda f: (f["properties"]["kg"], f["properties"]["name"])):
            p = f["properties"]
            subs = sorted(s for s in (p["subrieden"] or "").split(",") if s and s != "keine Subriede")
            zp = {"id": f"wachau-{p['kg']}-{p['name']}".lower().replace(" ", "-").replace(".", ""), "name": p["name"], "kg": p["kg"],
                  "gemeinde": p["gemeinde"], "ha": round(p["m2"] / 1e4, 1)}
            if subs:
                zp["subrieden"] = subs
            out.append({"type": "Feature", "properties": zp, "geometry": f["geometry"]})
        write(OUT_DIR / "zones-wachau.geojson", out)


if __name__ == "__main__":
    main()
