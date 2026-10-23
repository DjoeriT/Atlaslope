#!/usr/bin/env python3
"""Builds Germany's pilot outlines (issue #149, decisions #71-#78, #93) from the LWK Rheinland-Pfalz wine layers.

Mosel: the union of the `gu` (geschuetzte Ursprungsbezeichnung) features whose BEZ names the Mosel, repaired (ST_MakeValid, polygons only: 23 of the 186 features are invalid in the source), closed at
CLOSE metres (buffer out, then back in) and simplified at SIMPLIFY metres, all in the source's EPSG:3035. The layer is the vineyard land
itself, in thousands of parcel-sized parts, not a municipal envelope, so the closed outline is larger than the vineyards and marked
approximate; `vineyardKm2` is the dissolved land, `km2` the closed outline. The Saarland part of the Mosel is not in the RLP layer.
Zones: the Mosel's Einzellagen from `weinlagen_recht` (layer wl), simplified to ZONE_SIMPLIFY metres. The six single-vineyard PDOs (#93)
are zones of their Anbaugebiet; only Uhlen (three PDOs) is in the Mosel, and the layer holds it as one Einzellage "Uhlen" (the three PDO
names have no outline of their own), so that zone carries them as `singleVineyardPdos`. Rheingau has no outline here: Hessen and BKG
refuse scripts (BKG VG250 has Gemeinden, not the 32 Gemarkungen of the spec), so the build does not invent one.
Raw inputs (outside the repo, <raw folder>/countries/de/m/, Tools/rawdir.py, Tools/data/raw-manifest.json): gu.gpkg, wl.gpkg.
Writes data/countries/de/areas.geojson and data/countries/de/zones-mosel.geojson. Both load on demand (first load is full, #38).
Run: python3 -I Tools/data/build_de_areas.py
"""
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW as RAW_ROOT  # noqa: E402  raw downloads live outside the repo (22 Oct 2026)
RAW = RAW_ROOT / "countries/de/m"
OUT_DIR = ROOT / "data/countries/de"
CLOSE = 150          # metres: gaps between vineyard parcels closed (buffer +CLOSE, -CLOSE); 86 KB, 208 parts measured 22 Oct 2026
SIMPLIFY = 40        # metres, as Portugal, France and Italy: the outline is read at region zoom
ZONE_SIMPLIFY = 40   # metres, as the outline: 462 Einzellagen in 2,027 parts; 368 KB (76 KB gzipped), 328 KB at 60 m, so not coarser
ZONE_DECIMALS = 4    # about 11 m, the size of the simplification; 5 decimals cost 418 KB
# The three Uhlen PDOs (decision #93) sit inside the Einzellage Uhlen (Winningen, Kobern-Gondorf). The other three single-vineyard PDOs
# (Buergstadter Berg, Monzinger Niederberg, Wuerzburger Stein-Berg) lie in Franken and Nahe: noted in the tree, not drawn.
UHLEN_PDOS = ["Uhlen Blaufüsser Lay", "Uhlen Laubach", "Uhlen Roth Lay"]


def ogr(*args):
    subprocess.run(["ogr2ogr", *args], check=True, capture_output=True)


def one(path):
    return json.loads(Path(path).read_text())["features"]


def write(path, feats):
    path.write_text(json.dumps({"type": "FeatureCollection", "features": feats}, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"wrote {path.relative_to(ROOT)}: {len(feats)} features, {path.stat().st_size / 1024:.0f} KB")


def ha(s):
    """The layer's area as text, "14,4" (hectares) or "k. A." (no figure)."""
    try:
        return float((s or "").replace(",", "."))
    except ValueError:
        return None


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        gu = RAW / "gu.gpkg"
        # Vineyard land, dissolved (area only), and the closed outline.
        raw = tmp / "raw.geojson"
        ogr("-f", "GeoJSON", str(raw), str(gu), "-dialect", "sqlite", "-sql",
            "SELECT ST_Area(ST_Union(ST_CollectionExtract(ST_MakeValid(geom), 3))) AS m2 FROM gu WHERE BEZ LIKE '%g.U. Mosel%'")
        closed = tmp / "closed.geojson"
        ogr("-f", "GeoJSON", str(closed), str(gu), "-dialect", "sqlite", "-sql",
            f"SELECT ST_Area(c) AS m2, c AS geometry FROM (SELECT ST_Buffer(ST_Buffer(ST_Union(ST_CollectionExtract(ST_MakeValid(geom), 3)), {CLOSE}), -{CLOSE}) AS c "
            f"FROM gu WHERE BEZ LIKE '%g.U. Mosel%')")
        feats = one(closed)
        if len(feats) != 1:
            raise SystemExit(f"Mosel: expected one outline, got {len(feats)}")
        wgs = tmp / "mosel.geojson"
        ogr("-f", "GeoJSON", str(wgs), str(closed), "-simplify", str(SIMPLIFY), "-t_srs", "EPSG:4326",
            "-lco", "COORDINATE_PRECISION=5", "-select", "")
        geom = one(wgs)[0]["geometry"]
        parts = len(geom["coordinates"]) if geom["type"] == "MultiPolygon" else 1
        props = {"id": "mosel", "place": "mosel", "route": "lwk-gu", "approximate": True, "closedMetres": CLOSE, "parts": parts,
                 "km2": round(feats[0]["properties"]["m2"] / 1e6, 1),
                 "vineyardKm2": round((one(raw)[0]["properties"]["m2"] or 0) / 1e6, 1)}
        write(OUT_DIR / "areas.geojson", [{"type": "Feature", "properties": props, "geometry": geom}])
        print(f"mosel: {props['km2']} km2 closed at {CLOSE} m ({props['vineyardKm2']} km2 vineyards), {parts} parts")

        zones = tmp / "zones.geojson"
        ogr("-f", "GeoJSON", str(zones), str(RAW / "wl.gpkg"), "-where", "anbaugebiet = 'Mosel'", "-simplify", str(ZONE_SIMPLIFY),
            "-t_srs", "EPSG:4326", "-lco", f"COORDINATE_PRECISION={ZONE_DECIMALS}", "-select", "wlg_nr,wlg_name,gemeinde,grosslage,bereich,rebflaeche")
        out = []
        for f in sorted(one(zones), key=lambda f: int(f["properties"]["wlg_nr"])):
            p = f["properties"]
            name = p["wlg_name"]
            zp = {"id": f"mosel-{p['wlg_nr']}", "name": name, "gemeinde": p["gemeinde"],
                  "grosslage": p["grosslage"], "bereich": p["bereich"].removeprefix("Bereich "),
                  "ha": ha(p["rebflaeche"])}
            if name == "Uhlen":
                zp["singleVineyardPdos"] = UHLEN_PDOS
            out.append({"type": "Feature", "properties": zp, "geometry": f["geometry"]})
        write(OUT_DIR / "zones-mosel.geojson", out)


if __name__ == "__main__":
    main()
