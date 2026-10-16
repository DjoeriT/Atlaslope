#!/usr/bin/env python3
"""Photo candidates from Wikimedia Commons for every quizzed place, and one contact sheet per study region to pick from.

Runs in GitHub Actions (data-photos workflow; Commons throttles the cloud container). Needs shapely and Pillow.
Writes Review/sources/photo-candidates.json and Review/sources/contact-sheets/<region>.jpg.

Second version (release 4). The first one searched by name and within 10 km of the centroid, which returned wine bottles from
other regions, a Chilean winery and space-station photos. This one:
- searches only files with coordinates **inside the place's boundary** (geosearch discs of 10 km laid over the boundary, then a
  point-in-polygon test), plus a name search that is kept only when the file is also inside the boundary or has no coordinates
  and names the place and a vineyard word;
- drops what can't be a landscape, vineyard or village photo (labels, bottles, maps, coats of arms, space-station and Mapillary
  frames, interiors, people);
- keeps public domain, CC0, CC BY and CC BY-SA only, at least 1600 px wide, JPEG or PNG;
- ranks vineyard words first, then Commons quality flags, then landscape shape and size; keeps the top 12, at most 3 per photographer.
"""
import io, json, math, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from shapely.geometry import Point, shape
from shapely.ops import unary_union
from shapely.prepared import prep

ROOT = Path(__file__).resolve().parents[2]
API = "https://commons.wikimedia.org/w/api.php"
UA = "AtlaslopeDataBot/0.2 (https://github.com/DjoeriT/Atlaslope)"
OUT = ROOT / "Review/sources/photo-candidates.json"
SHEETS = ROOT / "Review/sources/contact-sheets"
OK = re.compile(r"^(public domain|pd\b|cc0|cc by(-sa)? ?\d)", re.I)
VINE = re.compile(r"vi[ñn]edo|vi[ñn]a\b|vi[ñn]as|vineyard|vinya|vinyes|vides|cepa|parra|vendimia|verema|mahasti|vigne|wineyard|viñedos|terraza|bancal", re.I)
WINE = re.compile(r"vino|wine|bodega|celler|adega|txakol|uva|grape", re.I)
DROP = re.compile(r"ISS\d|View of Earth|Mapillary|etiqueta|label|bottle|botella|logo|escudo|coat of arms|mapa\b|\bmap\b|plano|interior|retablo|altar|"
                  r"capitel|portada|arquivolta|modill|lápida|placa|cartel|sign\b|señal|\btren\b|train|autobús|bus\b|estación|station|aeropuerto|"
                  r"retrato|portrait|concierto|fiesta|feria|futbol|fútbol|plaza de toros|colegio|instituto|hospital|cementerio|cemetery|"
                  r"ayuntamiento|town hall|casa consistorial|museo|museum|tapas|registro|\.png$", re.I)
FLAGS = {"Featured pictures on Wikimedia Commons": 3, "Quality images": 2, "Valued images sorted by promotion date": 1}


def get(params):
    params = {**params, "format": "json", "formatversion": "2"}
    url = API + "?" + urllib.parse.urlencode(params)
    for attempt in range(8):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 7: raise
            time.sleep(4 + 4 * attempt)


def boundaries(places):
    load = lambda n: json.loads((ROOT / "data" / n).read_text())
    dops = {}
    for f in load("dops.geojson")["features"]:
        dops.setdefault(f["properties"]["code"], []).append(shape(f["geometry"]))
    added = {f["properties"]["id"]: shape(f["geometry"]) for f in load("added-boundaries.geojson")["features"]}
    zones = {f["properties"]["zone"]: shape(f["geometry"]) for f in load("rioja-zones.geojson")["features"]}
    out = {}
    for p in places:
        b = p.get("boundary")
        if b == "mapa-2014": out[p["id"]] = unary_union(dops[p["layerCode"]])
        elif b == "added": out[p["id"]] = added[p["id"]]
        elif b == "rioja-zones": out[p["id"]] = zones[p["name"]]
    return out


def discs(geom, max_n=16):
    """Centres of 10 km geosearch discs covering the boundary, at most max_n (largest places get a sparse cover)."""
    minx, miny, maxx, maxy = geom.bounds
    lat = (miny + maxy) / 2
    step = 0.13  # about 14 km: discs of 10 km radius overlap
    for _ in range(6):
        dy, dx = step, step / math.cos(math.radians(lat))
        g = prep(geom.buffer(dy / 3))
        pts = [(minx + dx * (i + .5), miny + dy * (j + .5)) for i in range(int((maxx - minx) / dx) + 1) for j in range(int((maxy - miny) / dy) + 1)]
        pts = [p for p in pts if g.contains(Point(p))]
        if len(pts) <= max_n: break
        step *= 1.4
    c = geom.representative_point()
    return pts or [(c.x, c.y)]


def titles_for(place, geom):
    found = {}
    for lon, lat in discs(geom):
        r = get({"action": "query", "list": "geosearch", "gsnamespace": 6, "gslimit": 200, "gsradius": 10000, "gscoord": f"{lat}|{lon}"})
        for g in r["query"]["geosearch"]:
            found[g["title"]] = (g["lon"], g["lat"])
        time.sleep(.5)
    name = place["name"].split(" / ")[0].split("-")[0].strip()
    r = get({"action": "query", "list": "search", "srnamespace": 6, "srlimit": 50,
             "srsearch": f'"{name}" (viñedo OR viñedos OR vineyard OR vinyes OR viña OR mahastia)'})
    for s in r["query"]["search"]:
        found.setdefault(s["title"], None)
    return found


def info(found, geom, name):
    g = prep(geom)
    titles = [t for t in found if not DROP.search(t)]
    out = []
    for i in range(0, len(titles), 40):
        r = get({"action": "query", "titles": "|".join(titles[i:i + 40]), "prop": "imageinfo|categories|coordinates", "clshow": "!hidden",
                 "cllimit": "max", "iiprop": "url|size|extmetadata|mime", "iiurlwidth": 480})
        for p in r["query"].get("pages", []):
            ii = (p.get("imageinfo") or [None])[0]
            if not ii or ii.get("mime") not in ("image/jpeg", "image/png"): continue
            m = ii.get("extmetadata", {})
            lic = m.get("LicenseShortName", {}).get("value", "")
            if not OK.match(lic) or ii["width"] < 1600: continue
            desc = re.sub("<[^>]+>", "", m.get("ImageDescription", {}).get("value", ""))[:300]
            cats = {c["title"].split(":", 1)[1] for c in p.get("categories", [])}
            text = p["title"] + " " + desc + " " + " ".join(cats)
            if DROP.search(p["title"] + " " + desc[:80]): continue
            xy = found.get(p["title"]) or ((p["coordinates"][0]["lon"], p["coordinates"][0]["lat"]) if p.get("coordinates") else None)
            inside = bool(xy) and g.contains(Point(xy))
            if xy and not inside: continue
            if not xy and not (name.lower() in text.lower() and VINE.search(text)): continue
            out.append({"title": p["title"], "page": ii["descriptionurl"], "thumb": ii.get("thumburl"), "url": ii["url"],
                        "width": ii["width"], "height": ii["height"], "licence": lic, "licenceUrl": m.get("LicenseUrl", {}).get("value"),
                        "artist": re.sub("<[^>]+>", "", m.get("Artist", {}).get("value", "")).strip()[:120],
                        "credit": re.sub("<[^>]+>", "", m.get("Credit", {}).get("value", "")).strip()[:200], "description": desc,
                        "coords": xy, "inside": inside, "quality": max([FLAGS.get(c, 0) for c in cats] or [0]),
                        "vine": bool(VINE.search(text)), "wine": bool(WINE.search(text))})
        time.sleep(.5)
    return out


def rank(cands):
    cands.sort(key=lambda c: (-c["vine"], -c["quality"], -c["wine"], -(c["width"] >= c["height"]), -c["width"] * c["height"]))
    per, kept = {}, []
    for c in cands:
        if per.get(c["artist"], 0) >= 3: continue
        per[c["artist"]] = per.get(c["artist"], 0) + 1
        kept.append(c)
        if len(kept) == 12: break
    return kept


def thumb(url):
    for attempt in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return Image.open(io.BytesIO(r.read())).convert("RGB")
        except Exception:
            time.sleep(3 + 3 * attempt)
    return None


def sheet(region, places, done):
    """One JPEG per study region: a row per place, up to 12 thumbnails, each labelled place-number."""
    W, H, PAD, LABEL = 240, 160, 6, 26
    rows = [p for p in places if done.get(p["id"], {}).get("candidates")]
    if not rows: return
    img = Image.new("RGB", (PAD + 12 * (W + PAD) + 160, PAD + len(rows) * (H + LABEL + PAD)), "white")
    d = ImageDraw.Draw(img)
    try: font = ImageFont.truetype("DejaVuSans-Bold.ttf", 15)
    except OSError: font = ImageFont.load_default()
    for r, p in enumerate(rows):
        y = PAD + r * (H + LABEL + PAD)
        d.text((PAD, y + H // 2), p["id"][:18], fill="black", font=font)
        for i, c in enumerate(done[p["id"]]["candidates"]):
            t = thumb(c["thumb"]) if c.get("thumb") else None
            x = 160 + PAD + i * (W + PAD)
            if t:
                t.thumbnail((W, H)); img.paste(t, (x + (W - t.width) // 2, y + (H - t.height) // 2))
            d.text((x, y + H + 4), f"{p['id'][:14]}-{i + 1}{' Q' if c['quality'] else ''}", fill="black", font=font)
            time.sleep(.2)
    SHEETS.mkdir(parents=True, exist_ok=True)
    img.save(SHEETS / f"{region}.jpg", quality=72, optimize=True)


def main():
    tree = json.loads((ROOT / "data/places.json").read_text())
    places = [p for p in tree["places"] if p["quiz"] != "none"]
    geoms = boundaries(places)
    done = json.loads(OUT.read_text()) if OUT.exists() else {}
    if done.get("$version") != 2: done = {"$version": 2}
    for p in places:
        if p["id"] in done: continue
        try:
            found = titles_for(p, geoms[p["id"]])
            cands = info(found, geoms[p["id"]], p["name"].split(" / ")[0].split("-")[0].strip())
        except Exception as e:  # keep what is done; a rerun retries this place
            print(p["id"], "error:", e, flush=True); continue
        done[p["id"]] = {"name": p["name"], "region": p["region"], "seen": len(found), "kept": len(cands), "candidates": rank(cands)}
        print(p["id"], len(found), len(cands), flush=True)
        OUT.write_text(json.dumps(done, ensure_ascii=False, indent=1) + "\n")
    for region in dict.fromkeys(p["region"] for p in places):
        sheet(region, [p for p in places if p["region"] == region], done)
        print("sheet", region, flush=True)


if __name__ == "__main__":
    sys.exit(main())
