#!/usr/bin/env bash
# Köppen-Geiger polygons for Portugal, made the same way as data/koppen-spain.geojson (Tools/data/remote_build.sh): Beck et al. 2023,
# figshare article 21789074 (CC BY 4.0), 1991-2020, 1 km; polygonized, dissolved per class, simplified 0.006, 3 decimals, same legend.
# Raw output (not committed): $RAW/build/koppen-portugal.geojson, read by Tools/data/measure_places.py. Needs GDAL and python3.
# Boxes: mainland -9.6 36.9 -6.1 42.2 ("main"), Madeira -17.4 32.3 -16.2 33.2 ("madeira"). The mainland box takes in a strip of Spain; harmless,
# the measures only intersect it with Portuguese outlines.
set -euo pipefail
RAW=$(python3 -I -c "import sys; sys.path.insert(0, 'Tools'); from rawdir import RAW; print(RAW)")
T=$(mktemp -d)
mkdir -p "$RAW/build/kg"
KG="$RAW/build/kg"
if [ ! -f "$KG/kg.zip" ]; then
  url=$(curl -sSf https://api.figshare.com/v2/articles/21789074/files | python3 -I -c "import json,sys; fs=json.load(sys.stdin); print(next(f['download_url'] for f in fs if f['name'].endswith('.zip') and 'tif' in f['name'].lower()))")
  curl -sSfL -o "$KG/kg.zip" "$url"
fi
tif=$(unzip -Z1 "$KG/kg.zip" | grep -E '1991_2020/.*0p00833333\.tif$' | head -1)
unzip -oq "$KG/kg.zip" "$tif" -d "$KG"
for box in "main -9.6 36.9 -6.1 42.2" "madeira -17.4 32.3 -16.2 33.2"; do
  set -- $box
  gdalwarp -q -overwrite -te "$2" "$3" "$4" "$5" -dstnodata 0 "$KG/$tif" "$T/kg-$1.tif"
  gdal_polygonize.py -q "$T/kg-$1.tif" -f GPKG "$T/kg-$1.gpkg" kg class
  ogr2ogr -f GPKG "$T/kg-$1-d.gpkg" "$T/kg-$1.gpkg" -dialect sqlite -nln kg -sql \
    "SELECT class, '$1' AS box, ST_Union(geom) AS geom FROM kg WHERE class > 0 AND ST_Area(geom) > 0.00008 GROUP BY class"
  ogr2ogr -f GeoJSON "$T/kg-$1.json" "$T/kg-$1-d.gpkg" -simplify 0.006 -makevalid -lco COORDINATE_PRECISION=3 -lco RFC7946=YES
done
python3 -I - "$T/kg-main.json" "$T/kg-madeira.json" "$RAW/build/koppen-portugal.geojson" <<'PY'
import json, sys
# Legend of Beck et al. (2023), classes 1-30 (same as remote_build.sh).
L = ["Af Tropical, rainforest", "Am Tropical, monsoon", "Aw Tropical, savannah", "BWh Arid, desert, hot", "BWk Arid, desert, cold",
     "BSh Arid, steppe, hot", "BSk Arid, steppe, cold", "Csa Temperate, dry summer, hot summer", "Csb Temperate, dry summer, warm summer",
     "Csc Temperate, dry summer, cold summer", "Cwa Temperate, dry winter, hot summer", "Cwb Temperate, dry winter, warm summer",
     "Cwc Temperate, dry winter, cold summer", "Cfa Temperate, no dry season, hot summer", "Cfb Temperate, no dry season, warm summer",
     "Cfc Temperate, no dry season, cold summer", "Dsa Cold, dry summer, hot summer", "Dsb Cold, dry summer, warm summer",
     "Dsc Cold, dry summer, cold summer", "Dsd Cold, dry summer, very cold winter", "Dwa Cold, dry winter, hot summer",
     "Dwb Cold, dry winter, warm summer", "Dwc Cold, dry winter, cold summer", "Dwd Cold, dry winter, very cold winter",
     "Dfa Cold, no dry season, hot summer", "Dfb Cold, no dry season, warm summer", "Dfc Cold, no dry season, cold summer",
     "Dfd Cold, no dry season, very cold winter", "ET Polar, tundra", "EF Polar, frost"]
out = []
for src in sys.argv[1:3]:
    for f in json.load(open(src))["features"]:
        g = f["geometry"]
        if not g: continue
        if g["type"] == "GeometryCollection":  # makevalid can leave stray lines; keep the polygon parts
            polys = [p["coordinates"] for p in g["geometries"] if p["type"] == "Polygon"] + [c for p in g["geometries"] if p["type"] == "MultiPolygon" for c in p["coordinates"]]
            if not polys: continue
            f["geometry"] = {"type": "MultiPolygon", "coordinates": polys}
        code, name = L[int(f["properties"]["class"]) - 1].split(" ", 1)
        out.append({"type": "Feature", "properties": {"code": code, "name": name, "box": f["properties"]["box"]}, "geometry": f["geometry"]})
json.dump({"type": "FeatureCollection", "features": out}, open(sys.argv[3], "w"), separators=(",", ":"))
print("koppen-portugal:", sorted({(f["properties"]["box"], f["properties"]["code"]) for f in out}))
PY
rm -rf "$T"
