#!/usr/bin/env python3
"""Builds data/natural-earth-world.geojson: the world background map (land and country borders) the atlas draws everywhere.

Inside Spain's two clip boxes it keeps the 10 m detail of data/natural-earth-spain.geojson; outside them it uses Natural Earth 50 m.
Land is one feature, so there are no seams or box edges on the map. Needs shapely (pip install shapely) and network
access to raw.githubusercontent.com. Rerunnable: downloads land in data/raw/world/ (git-ignored).
Usage: python3 Tools/data/build_world.py
"""
import json
import os
import urllib.request

from shapely import set_precision
from shapely.geometry import MultiPolygon, Polygon, box, mapping, shape
from shapely.ops import unary_union

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
RAW = os.path.join(ROOT, 'data', 'raw', 'world')
NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/'
# Same boxes as Tools/data/remote_build.sh and LAND_BOXES in src/map/boundaries.ts.
BOXES = unary_union([box(-10.0, 35.0, 5.0, 44.5), box(-18.4, 27.5, -13.2, 29.5)])
SIMPLIFY = 0.02  # degrees, about 2 km: the world outside Spain is a backdrop, seen zoomed out (about 5 km a pixel at zoom 5)
MIN_AREA = 0.001  # square degrees, about 10 km²: smaller islands outside Spain are dropped
WORLD_GRID = 1e-3  # 3 decimals outside Spain
GRID = 1e-5  # 5 decimals inside the boxes, as the Spain file


def load(name):
    os.makedirs(RAW, exist_ok=True)
    path = os.path.join(RAW, name)
    if not os.path.exists(path):
        urllib.request.urlretrieve(NE + name, path)
    return [shape(f['geometry']) for f in json.load(open(path))['features'] if f['geometry']]


def outside(geoms, min_area=0.0):
    parts = [p for g in geoms for p in getattr(g, 'geoms', [g]) if p.area >= min_area or p.length > 0 and p.area == 0]
    g = unary_union([p.simplify(SIMPLIFY, preserve_topology=True) for p in parts]).difference(BOXES)
    return set_precision(g, WORLD_GRID)


def main():
    spain = json.load(open(os.path.join(ROOT, 'data', 'natural-earth-spain.geojson')))['features']
    spain_land = unary_union([shape(f['geometry']).buffer(0) for f in spain if f['properties']['layer'] == 'land'])
    spain_borders = [shape(f['geometry']) for f in spain if f['properties']['layer'] == 'border']

    land = unary_union([outside(load('ne_50m_land.geojson'), MIN_AREA), spain_land])
    # The app tints the sea by cutting each land outline out of one world rectangle, so an island inside a lake (the Caspian's)
    # would be a hole inside a hole. Drop those few islands.
    lakes = [Polygon(r) for p in land.geoms for r in p.interiors]
    land = MultiPolygon([p for p in land.geoms if not any(lake.contains(p.representative_point()) for lake in lakes)])
    borders = unary_union([outside(load('ne_50m_admin_0_boundary_lines_land.geojson')), *spain_borders])

    # No sea feature: the app cuts the land out of one world rectangle (oceanFromLand), which keeps the download small.
    feats = []
    for layer, geom in (('land', land), ('border', borders)):
        geom = set_precision(geom, GRID)
        feats.append({'type': 'Feature', 'properties': {'layer': layer}, 'geometry': mapping(geom)})
    out = os.path.join(ROOT, 'data', 'natural-earth-world.geojson')
    with open(out, 'w') as f:
        json.dump({'type': 'FeatureCollection', 'features': feats}, f, separators=(',', ':'))
    print('natural-earth-world:', os.path.getsize(out), 'bytes')


if __name__ == '__main__':
    main()
