#!/usr/bin/env python3
"""Builds Austria's Wachau and Neusiedlersee data (issue #149, decisions #81-#86, #94): the outlines and the Rieden.

Source: Land Niederösterreich WFS layer OGD:RLF_WEINBAU_RIEDEN (CC BY 4.0), the Rieden of the Verordnung, filtered to the
Katastralgemeinden the Wachau DAC regulation (BGBl. II 200/2020, § 3 (2)) names as Gemeinde labels. The regulation lists no Ried and no
KG polygon; there is no official DAC outline (the Vinea Wachau and OeTW outlines are private, #85), so the outline is the union of the
Ried land, repaired, closed at CLOSE metres and simplified at SIMPLIFY metres in EPSG:3035, marked approximate. The Ried layer is Ried
land, wider than planted vines. `gemeindeKm2` is the other route, for comparison only: the union of the eight Gemeinden that hold those KGs
(Statistik Austria Gemeinden 2026-01-01, CC BY 4.0), which overshoots (whole municipalities, forest, Mautern town).
Zones: one per Ried name within a KG (a Ried name repeats across KGs; the label rule, § 5 (5), pairs them), simplified at ZONE_SIMPLIFY.
Neusiedlersee: the DAC regulation (BGBl. II 431/2020, Art. 2, § 1) defines the area as the Bezirk Neusiedl am See without the Gemeinden Winden
and Jois, so the outline is the union of those 25 Gemeinden (Statistik Austria 2026-01-01, CC BY 4.0), the legal area, not approximate. The
Rieden (Land Burgenland "Weinbauriede", CC BY 4.0, Ried and Subried polygons) are zones only: one per Ried name within a KG, Subried names
listed. The Ried land closed at CLOSE metres is kept as `riedenClosedKm2` for comparison (it is Ried land, not planted vines).
Raw inputs (outside the repo, <raw folder>/countries/at/m/, Tools/rawdir.py, Tools/data/raw-manifest.json): rieden.gpkg, gemeinden.gpkg
(Wachau); nsl-rieden.gpkg, gemeinden-nsl.gpkg (Neusiedlersee).
Writes data/countries/at/areas.geojson (both places) and data/countries/at/zones-wachau.geojson, zones-neusiedlersee.geojson. All load on demand.
Run: python3 -I Tools/data/build_at_areas.py   (then the outlines are copied into data/added-boundaries.geojson;
     with --map only that copy, no raw files needed)
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
# Neusiedlersee DAC § 1: the Bezirk Neusiedl am See without these two Gemeinden.
NSL_EXCLUDED = ["Jois", "Winden am See"]
# Outline shown for Neusiedlersee: "rieden" (Ried land closed, approximate, interim) or "gemeinden" (the legal area).
NSL_OUTLINE = "rieden"


def ogr(*args):
    subprocess.run(["ogr2ogr", *args], check=True, capture_output=True)


def one(path):
    return json.loads(Path(path).read_text())["features"]


def write(path, feats):
    path.write_text(json.dumps({"type": "FeatureCollection", "features": feats}, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"wrote {path.relative_to(ROOT)}: {len(feats)} features, {path.stat().st_size / 1024:.0f} KB")


def wachau():
    """Returns the Wachau outline feature; writes zones-wachau.geojson."""
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
        area = {"type": "Feature", "properties": props, "geometry": geom}
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
    return area


def neusiedlersee():
    """Returns the Neusiedlersee outline feature; writes zones-neusiedlersee.geojson."""
    rieden = str(RAW / "nsl-rieden.gpkg")
    gem = str(RAW / "gemeinden-nsl.gpkg")
    valid = "ST_CollectionExtract(ST_MakeValid(geom), 3)"
    excluded = ",".join(f"'{n}'" for n in NSL_EXCLUDED)
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        legal = tmp / "legal.geojson"
        ogr("-f", "GeoJSON", str(legal), gem, "-dialect", "sqlite", "-sql",
            f"SELECT ST_Area(ST_Union(geom)) AS m2, count(*) AS n, ST_Union(geom) AS geometry FROM gemeinden WHERE g_name NOT IN ({excluded})")
        feats = one(legal)
        if len(feats) != 1:
            raise SystemExit(f"Neusiedlersee: expected one outline, got {len(feats)}")
        wgs = tmp / "nsl.geojson"
        ogr("-f", "GeoJSON", str(wgs), str(legal), "-simplify", str(SIMPLIFY), "-t_srs", "EPSG:4326",
            "-lco", f"COORDINATE_PRECISION={DECIMALS}", "-select", "")
        geom = one(wgs)[0]["geometry"]
        parts = len(geom["coordinates"]) if geom["type"] == "MultiPolygon" else 1
        closed = tmp / "closed.geojson"
        ogr("-f", "GeoJSON", str(closed), rieden, "-dialect", "sqlite", "-sql",
            f"SELECT ST_Area(c) AS m2 FROM (SELECT ST_Buffer(ST_Buffer(ST_Union({valid}), {CLOSE}), -{CLOSE}) AS c FROM rieden WHERE RIEDTYP = 'Ried')")
        raw = tmp / "raw.geojson"
        ogr("-f", "GeoJSON", str(raw), rieden, "-dialect", "sqlite", "-sql", f"SELECT ST_Area(ST_Union({valid})) AS m2 FROM rieden WHERE RIEDTYP = 'Ried'")
        props = {"id": "neusiedlersee", "place": "neusiedlersee", "route": "gemeinden", "approximate": False, "parts": parts,
                 "gemeinden": feats[0]["properties"]["n"], "km2": round(feats[0]["properties"]["m2"] / 1e6, 1),
                 "riedenKm2": round(one(raw)[0]["properties"]["m2"] / 1e6, 1),
                 "riedenClosedKm2": round(one(closed)[0]["properties"]["m2"] / 1e6, 1)}
        if NSL_OUTLINE == "rieden":
            # Interim (owner decides with screenshots): the shown outline is the Ried land closed at CLOSE metres, approximate. The legal
            # area (Gemeinde union, with the lake) stays in the properties as legalKm2.
            shape = tmp / "closed-shape.geojson"
            ogr("-f", "GeoJSON", str(shape), rieden, "-dialect", "sqlite", "-sql",
                f"SELECT ST_Buffer(ST_Buffer(ST_Union({valid}), {CLOSE}), -{CLOSE}) AS geometry FROM rieden WHERE RIEDTYP = 'Ried'")
            geom = tmp / "closed-wgs.geojson"
            ogr("-f", "GeoJSON", str(geom), str(shape), "-simplify", str(SIMPLIFY), "-t_srs", "EPSG:4326",
                "-lco", f"COORDINATE_PRECISION={DECIMALS}", "-select", "")
            geom = one(geom)[0]["geometry"]
            parts = len(geom["coordinates"]) if geom["type"] == "MultiPolygon" else 1
            props.update({"route": "rieden-closed", "approximate": True, "parts": parts, "legalKm2": props["km2"],
                          "km2": props["riedenClosedKm2"]})
        area = {"type": "Feature", "properties": props, "geometry": geom}
        print(f"neusiedlersee: {props['km2']} km2 Gemeinde union ({props['gemeinden']} Gemeinden), {parts} parts "
              f"(Rieden land {props['riedenKm2']} km2, closed at {CLOSE} m {props['riedenClosedKm2']} km2)")

        # Ried polygons hold the land; Subried polygons lie inside them and only add names.
        zones = tmp / "zones.geojson"
        ogr("-f", "GeoJSON", str(zones), rieden, "-dialect", "sqlite", "-sql",
            f"SELECT KGNAME AS kg, GEMNAME AS gemeinde, Riedname AS name, count(*) AS parts, ST_Area(ST_Union({valid})) AS m2, "
            f"ST_Union({valid}) AS geometry FROM rieden WHERE RIEDTYP = 'Ried' AND GEMNAME NOT IN ({excluded}) GROUP BY KGNAME, Riedname",
            "-simplify", str(ZONE_SIMPLIFY), "-t_srs", "EPSG:4326", "-lco", f"COORDINATE_PRECISION={ZONE_DECIMALS}")
        subs = tmp / "subs.json"
        ogr("-f", "GeoJSON", str(subs), rieden, "-dialect", "sqlite", "-sql",
            f"SELECT DISTINCT KGNAME AS kg, Riedname AS name, SubRname AS sub FROM rieden WHERE RIEDTYP = 'Subried' AND GEMNAME NOT IN ({excluded})")
        subried = {}
        for f in one(subs):
            p = f["properties"]
            subried.setdefault((p["kg"], p["name"]), set()).add(p["sub"])
        out = []
        for f in sorted(one(zones), key=lambda f: (f["properties"]["kg"], f["properties"]["name"])):
            p = f["properties"]
            zp = {"id": f"neusiedlersee-{p['kg']}-{p['name']}".lower().replace(" ", "-").replace(".", ""), "name": p["name"], "kg": p["kg"],
                  "gemeinde": p["gemeinde"], "ha": round(p["m2"] / 1e4, 1)}
            if subried.get((p["kg"], p["name"])):
                zp["subrieden"] = sorted(subried[(p["kg"], p["name"])])
            out.append({"type": "Feature", "properties": zp, "geometry": f["geometry"]})
        write(OUT_DIR / "zones-neusiedlersee.geojson", out)
    return area


def to_map():
    """The outlines go into the map's outline file, as Germany's do (split per country by the build, loaded on demand)."""
    sys.path.insert(0, str(Path(__file__).parent))  # -I leaves the script's folder off the path
    from build_pt_areas import put_added
    feats = json.loads((OUT_DIR / "areas.geojson").read_text())["features"]
    put_added(feats, {f["properties"]["id"] for f in feats})
    print("data/added-boundaries.geojson:", len(feats), "Austria outlines")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    write(OUT_DIR / "areas.geojson", [wachau(), neusiedlersee()])
    to_map()


if __name__ == "__main__":
    to_map() if "--map" in sys.argv else main()
