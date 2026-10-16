#!/bin/bash
# Builds the data files that need GDAL and large downloads. Runs in GitHub Actions (.github/workflows/data-fetch.yml), not in the cloud
# container (no GDAL, no package registries). Rerunnable: downloads land in data/raw/ (git-ignored); outputs are committed.
#   data/natural-earth-spain.geojson   Natural Earth 10 m land, minor islands and land borders, clipped to Spain's two boxes
#   data/koppen-spain.geojson          Köppen-Geiger 1991-2020 at 1 km (Beck et al. 2023), Spain only, one feature per class and box
set -euo pipefail
cd "$(dirname "$0")/../.."
RAW=data/raw/build; mkdir -p "$RAW/ne" "$RAW/kg" "$RAW/tmp"
MAIN="-10.0 35.0 5.0 44.5"; CANA="-18.4 27.5 -13.2 29.5"
NE=https://naciscdn.org/naturalearth/10m

for f in physical/ne_10m_land physical/ne_10m_minor_islands cultural/ne_10m_admin_0_boundary_lines_land cultural/ne_10m_admin_0_countries; do
  n=$(basename $f); [ -f "$RAW/ne/$n.shp" ] || { curl -sSfL -o "$RAW/ne/$n.zip" "$NE/$f.zip"; unzip -oq "$RAW/ne/$n.zip" -d "$RAW/ne"; }
done

clip() {  # clip <src.shp> <layer> <box name> <bbox> <out.geojson> [simplify]
  ogr2ogr -f GeoJSON "$5" "$1" -clipsrc $4 -simplify "${6:-0.001}" -explodecollections -select "" \
    -lco COORDINATE_PRECISION=5 -lco RFC7946=YES -makevalid
  python3 - "$5" "$2" "$3" <<'PY'
import json, sys
p, layer, box = sys.argv[1:]
d = json.load(open(p)); d["features"] = [dict(f, properties={"layer": layer, "box": box}) for f in d["features"] if f["geometry"]]
json.dump(d, open(p, "w"))
PY
}
T=$RAW/tmp
for box in main canarias; do
  bb=$MAIN; [ $box = canarias ] && bb=$CANA
  clip $RAW/ne/ne_10m_land.shp land $box "$bb" $T/land-$box.json
  clip $RAW/ne/ne_10m_minor_islands.shp land $box "$bb" $T/islands-$box.json
  clip $RAW/ne/ne_10m_admin_0_boundary_lines_land.shp border $box "$bb" $T/border-$box.json
done
python3 - $T data/natural-earth-spain.geojson <<'PY'
import json, glob, sys
feats = [f for p in sorted(glob.glob(sys.argv[1] + "/*-*.json")) if not p.endswith("spain.json") for f in json.load(open(p))["features"]]
json.dump({"type": "FeatureCollection", "features": feats}, open(sys.argv[2], "w"), separators=(",", ":"))
print("natural-earth-spain:", len(feats), "features")
PY

# Spain's outline (mainland, Balearics, Canaries, Ceuta and Melilla dropped by the boxes) to mask the climate map.
ogr2ogr -f GeoJSON $T/spain.json $RAW/ne/ne_10m_admin_0_countries.shp -where "ADM0_A3 = 'ESP'" -makevalid

# Köppen-Geiger: Beck et al. 2023, figshare article 21789074 (CC BY 4.0). The archive holds every period; take 1991-2020 at 1 km.
if [ ! -f "$RAW/kg/kg.zip" ]; then
  url=$(curl -sSf https://api.figshare.com/v2/articles/21789074/files | python3 -c "import json,sys; fs=json.load(sys.stdin); print('\n'.join(f['name']+' '+str(f['size']) for f in fs), file=sys.stderr); print(next(f['download_url'] for f in fs if f['name'].endswith('.zip') and 'tif' in f['name'].lower()))")
  curl -sSfL -o "$RAW/kg/kg.zip" "$url"
fi
tif=$(unzip -Z1 "$RAW/kg/kg.zip" | grep -E '1991_2020/.*0p00833333\.tif$' | head -1)
echo "climate raster: $tif"
unzip -oq "$RAW/kg/kg.zip" "$tif" -d "$RAW/kg"
gdalwarp -q -overwrite -te -18.4 27.5 5.0 44.5 -cutline $T/spain.json -dstnodata 0 "$RAW/kg/$tif" $T/kg-spain.tif
gdal_polygonize.py -q $T/kg-spain.tif -f GPKG $T/kg.gpkg kg class
ogr2ogr -f GPKG $T/kg-dissolved.gpkg $T/kg.gpkg -dialect sqlite -nln kg -sql \
  "SELECT class, CASE WHEN MbrMinY(geom) < 30 THEN 'canarias' ELSE 'main' END AS box, ST_Union(geom) AS geom FROM kg WHERE class > 0 AND ST_Area(geom) > 0.00008 GROUP BY class, box"
ogr2ogr -f GeoJSON $T/kg.json $T/kg-dissolved.gpkg -simplify 0.006 -makevalid -lco COORDINATE_PRECISION=3 -lco RFC7946=YES
python3 - $T/kg.json data/koppen-spain.geojson <<'PY'
import json, sys
# Legend of Beck et al. (2023), classes 1-30.
L = ["Af Tropical, rainforest", "Am Tropical, monsoon", "Aw Tropical, savannah", "BWh Arid, desert, hot", "BWk Arid, desert, cold",
     "BSh Arid, steppe, hot", "BSk Arid, steppe, cold", "Csa Temperate, dry summer, hot summer", "Csb Temperate, dry summer, warm summer",
     "Csc Temperate, dry summer, cold summer", "Cwa Temperate, dry winter, hot summer", "Cwb Temperate, dry winter, warm summer",
     "Cwc Temperate, dry winter, cold summer", "Cfa Temperate, no dry season, hot summer", "Cfb Temperate, no dry season, warm summer",
     "Cfc Temperate, no dry season, cold summer", "Dsa Cold, dry summer, hot summer", "Dsb Cold, dry summer, warm summer",
     "Dsc Cold, dry summer, cold summer", "Dsd Cold, dry summer, very cold winter", "Dwa Cold, dry winter, hot summer",
     "Dwb Cold, dry winter, warm summer", "Dwc Cold, dry winter, cold summer", "Dwd Cold, dry winter, very cold winter",
     "Dfa Cold, no dry season, hot summer", "Dfb Cold, no dry season, warm summer", "Dfc Cold, no dry season, cold summer",
     "Dfd Cold, no dry season, very cold winter", "ET Polar, tundra", "EF Polar, frost"]
d = json.load(open(sys.argv[1])); out = []
for f in d["features"]:
    if not f["geometry"]: continue
    code, name = L[int(f["properties"]["class"]) - 1].split(" ", 1)
    out.append({"type": "Feature", "properties": {"code": code, "name": name, "box": f["properties"]["box"]}, "geometry": f["geometry"]})
json.dump({"type": "FeatureCollection", "features": out}, open(sys.argv[2], "w"), separators=(",", ":"))
print("koppen-spain:", sorted({f["properties"]["code"] for f in out}))
PY
ls -l data/natural-earth-spain.geojson data/koppen-spain.geojson

# Boundaries for the quizzed places the 2014 layer lacks (Campo de Calatrava, Cebreros): IGN municipalities, dissolved per place.
python3 -I Tools/data/build_boundaries.py
for f in $RAW/munis-*.geojson; do
  id=$(basename $f .geojson); id=${id#munis-}
  ogr2ogr -f GeoJSON $T/b-$id.json $f -dialect sqlite -makevalid \
    -sql "SELECT '$id' AS id, COUNT(*) AS municipalities, ST_Area(ST_Transform(ST_Union(geometry), 25830)) / 1e6 AS km2, ST_Union(geometry) AS geometry FROM \"munis-$id\""
done
ogrmerge.py -q -f GeoJSON -single -overwrite_ds -o $T/added.json $T/b-*.json
ogr2ogr -f GeoJSON data/added-boundaries.geojson $T/added.json -simplify 0.0005 -lco COORDINATE_PRECISION=5 -lco RFC7946=YES -select id,municipalities,km2
python3 -c "import json; [print(f['properties']) for f in json.load(open('data/added-boundaries.geojson'))['features']]"
