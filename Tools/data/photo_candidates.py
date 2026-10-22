#!/usr/bin/env python3
"""Photo candidates from Wikimedia Commons for every quizzed place, and one contact sheet per study region to pick from.

Runs in GitHub Actions (data-photos workflow; Commons throttles the cloud container). Needs shapely and Pillow.
Writes Review/sources/photo-candidates.json and Review/sources/contact-sheets/<region>.jpg.

Fill pass (release 9): `photo_candidates.py fill` runs only for places that have no shipped photo or whose first photo is off-topic
(NEEDS_NEW), adds more search words (bodega, winery, vendimia, cepas), works without a boundary for Vinos de Pago that have none yet
(a file then has to name the place and a vineyard word), and writes Review/sources/photo-candidates-fill.json and
contact-sheets/fill-<region>.jpg. The first-pass candidates stay untouched.

Category pass (polish slice, issue #42): `photo_candidates.py cats` walks hand-picked Commons categories (and their direct
subcategories) for the quizzed places the fill pass left empty, because their files rarely carry coordinates or the place's DO name.
A file is kept when its coordinates fall inside the boundary (2 km margin) or, without coordinates, when it names one of the place's
towns and a vine or wine word. Writes Review/sources/photo-candidates-cats.json and contact-sheets/cats-<place>.jpg.

Portugal pass (photo round, 22 Oct 2026, owner: "we need a lot of pictures"): `photo_candidates.py pt` runs for the places in a
`pt-` region with Portuguese vine words, a denser disc cover, the name search and a category walk (PT_CATS), keeps 20 per place
(at most 2 per photographer; all kept files under "all") and writes Review/sources/photo-candidates-pt.json and contact-sheets/pt-<place>.jpg (5 across).

France pass (photo round, 22 Oct 2026, issue #149): `photo_candidates.py fr [<id> ...]` runs for the France WSET places in
data/countries/fr/wset-places.json (or the ids given; FR_PLACES overrides the file) with French vine words (vigne, vignoble, vendange,
domaine, château, coteau, cave, grand cru, premier cru), the disc cover, name search and licence/size filters as the Portugal pass.
Outlines come from data/countries/fr/areas.geojson (kind "place"); a place without one is searched by name plus a vine word, as in the
fill pass. FR_CATS holds Commons categories for the pilot places. Keeps 20 per place (at most 2 per photographer) and writes
Review/sources/photo-candidates-fr.json and contact-sheets/fr-<place>.jpg (5 across).

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
import io, json, math, os, re, sys, time, urllib.parse, urllib.request
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
VINE = re.compile(r"vi[ñn]edo|vi[ñn]a\b|vi[ñn]as|vineyard|vinya|vinyes|vides|cepas?\b|parra|vendimia|verema|mahasti|vigne|wineyard|viñedos|terraza|bancal|vinhas?\b|vinhedos?|socalcos?|vindimas?|latadas?|ramadas?\b", re.I)
WINE = re.compile(r"vino|wine|bodega|celler|adega|txakol|uva|grape|vinho|quinta|alvarinho|loureiro", re.I)
DROP = re.compile(r"ISS\d|View of Earth|Mapillary|etiqueta|label|bottle|botella|logo|escudo|coat of arms|mapa\b|\bmap\b|plano|interior|retablo|altar|"
                  r"capitel|portada|arquivolta|modill|lápida|placa|cartel|sign\b|señal|\btren\b|train|autobús|bus\b|estación|station|aeropuerto|"
                  r"retrato|portrait|concierto|fiesta|feria|futbol|fútbol|plaza de toros|colegio|instituto|hospital|cementerio|cemetery|"
                  r"ayuntamiento|town hall|casa consistorial|museo|museum|tapas|registro|\.png$", re.I)
FILL_OUT = ROOT / "Review/sources/photo-candidates-fill.json"
# Places whose shipped first photo is not vines, a vineyard landscape or a wine village (audit 2026-10-17, no better candidate in the
# first pass); places with no shipped photo at all are added by fill_places().
NEEDS_NEW = ("lebrija", "calatayud", "binissalem", "abona", "ycoden-daute-isora", "valle-de-la-orotava", "almansa", "bullas", "cangas",
             "valdeorras", "txakoli-alava", "campo-de-calatrava", "mondejar", "ribera-del-jucar", "valdepenas", "ribera-del-guadiana",
             "utiel-requena", "valles-de-benavente")
FLAGS = {"Featured pictures on Wikimedia Commons": 3, "Quality images": 2, "Valued images sorted by promotion date": 1}


def get(params):
    params = {**params, "format": "json", "formatversion": "2"}
    url = API + "?" + urllib.parse.urlencode(params)
    for attempt in range(8):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
                out = json.load(r)
            # Commons sometimes answers 200 with an error body (seen in the Portugal pass): retry, then fail loudly
            if "error" not in out: return out
            print("api error:", str(out["error"])[:200], flush=True)
            if attempt == 7: raise RuntimeError(out["error"].get("code"))
            time.sleep(4 + 4 * attempt)
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
        if b == "mapa-2014" and p["layerCode"] in dops: out[p["id"]] = unary_union(dops[p["layerCode"]])
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


def short_name(place):
    """The name searched for: first part before ' / ' or '-', without a leading 'Pago de'."""
    name = place["name"].split(" / ")[0].split("-")[0].strip()
    return re.sub(r"^Pago (de |del )", "", name) if place["kind"] == "VP" else name


def queries(name, fill=False):
    q = [f'"{name}" (viñedo OR viñedos OR vineyard OR vinyes OR viña OR mahastia)']
    if fill: q.append(f'"{name}" (bodega OR bodegas OR winery OR vendimia OR viñas OR cepas)')
    return q


def titles_for(place, geom, fill=False):
    found = {}
    for lon, lat in (discs(geom) if geom is not None else []):
        r = get({"action": "query", "list": "geosearch", "gsnamespace": 6, "gslimit": 200, "gsradius": 10000, "gscoord": f"{lat}|{lon}"})
        for g in r["query"]["geosearch"]:
            found[g["title"]] = (g["lon"], g["lat"])
        time.sleep(.5)
    for q in queries(short_name(place) if fill else place["name"].split(" / ")[0].split("-")[0].strip(), fill):
        r = get({"action": "query", "list": "search", "srnamespace": 6, "srlimit": 50, "srsearch": q})
        for s in r["query"]["search"]:
            found.setdefault(s["title"], None)
        time.sleep(.5)
    return found


def info(found, geom, name, vine=VINE):
    g = prep(geom) if geom is not None else None  # no boundary yet: a file must name the place and a vineyard word
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
            inside = bool(xy) and g is not None and g.contains(Point(xy))
            named = name.lower() in text.lower() and bool(vine.search(text))
            if g is None:
                if not named: continue
            elif xy and not inside: continue
            elif not xy and not named: continue
            out.append({"title": p["title"], "page": ii["descriptionurl"], "thumb": ii.get("thumburl"), "url": ii["url"],
                        "width": ii["width"], "height": ii["height"], "licence": lic, "licenceUrl": m.get("LicenseUrl", {}).get("value"),
                        "artist": re.sub("<[^>]+>", "", m.get("Artist", {}).get("value", "")).strip()[:120],
                        "credit": re.sub("<[^>]+>", "", m.get("Credit", {}).get("value", "")).strip()[:200], "description": desc,
                        "coords": xy, "inside": inside, "quality": max([FLAGS.get(c, 0) for c in cats] or [0]),
                        "vine": bool(vine.search(text)), "wine": bool(WINE.search(text))})
        time.sleep(.5)
    return out


def rank(cands, n=12, per_artist=3):
    cands.sort(key=lambda c: (-c["vine"], -c["quality"], -c["wine"], -(c["width"] >= c["height"]), -c["width"] * c["height"]))
    per, kept = {}, []
    for c in cands:
        if per.get(c["artist"], 0) >= per_artist: continue
        per[c["artist"]] = per.get(c["artist"], 0) + 1
        kept.append(c)
        if len(kept) == n: break
    return kept


def thumb(url):
    for attempt in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return Image.open(io.BytesIO(r.read())).convert("RGB")
        except Exception:
            time.sleep(3 + 3 * attempt)
    return None


def sheet(region, places, done, prefix="", cols=12):
    """One JPEG per study region: a row per place (wrapped at cols), thumbnails labelled place-number."""
    W, H, PAD, LABEL = 240, 160, 6, 26
    rows = [p for p in places if done.get(p["id"], {}).get("candidates")]
    if not rows: return
    lines = [math.ceil(len(done[p["id"]]["candidates"]) / cols) for p in rows]
    img = Image.new("RGB", (PAD + cols * (W + PAD) + 160, PAD + sum(lines) * (H + LABEL + PAD)), "white")
    d = ImageDraw.Draw(img)
    try: font = ImageFont.truetype("DejaVuSans-Bold.ttf", 15)
    except OSError: font = ImageFont.load_default()
    for r, p in enumerate(rows):
        y0 = PAD + sum(lines[:r]) * (H + LABEL + PAD)
        d.text((PAD, y0 + H // 2), p["id"][:18], fill="black", font=font)
        for i, c in enumerate(done[p["id"]]["candidates"]):
            t = thumb(c["thumb"]) if c.get("thumb") else None
            x, y = 160 + PAD + (i % cols) * (W + PAD), y0 + (i // cols) * (H + LABEL + PAD)
            if t:
                t.thumbnail((W, H)); img.paste(t, (x + (W - t.width) // 2, y + (H - t.height) // 2))
            d.text((x, y + H + 4), f"{p['id'][:14]}-{i + 1}{' Q' if c['quality'] else ''}", fill="black", font=font)
            time.sleep(.2)
    SHEETS.mkdir(parents=True, exist_ok=True)
    img.save(SHEETS / f"{prefix}{region}.jpg", quality=72, optimize=True)


def fill_places(places, shipped):
    """Places to search in the fill pass: listed in NEEDS_NEW, or without any shipped photo."""
    return [p for p in places if p["id"] in NEEDS_NEW or f"{p['id']}-1" not in shipped]


def fill():
    tree = json.loads((ROOT / "data/places.json").read_text())
    shipped = json.loads((ROOT / "data/photos.json").read_text())["photos"]
    places = fill_places(tree["places"], shipped)
    geoms = boundaries([p for p in places if p["boundary"] != "to-fetch"])
    done = json.loads(FILL_OUT.read_text()) if FILL_OUT.exists() else {}
    for p in places:
        if p["id"] in done: continue
        g = geoms.get(p["id"])
        try:
            found = titles_for(p, g, fill=True)
            cands = info(found, g, short_name(p))
        except Exception as e:  # keep what is done; a rerun retries this place
            print(p["id"], "error:", e, flush=True); continue
        done[p["id"]] = {"name": p["name"], "region": p["region"], "seen": len(found), "kept": len(cands), "candidates": rank(cands)}
        print(p["id"], len(found), len(cands), flush=True)
        FILL_OUT.write_text(json.dumps(done, ensure_ascii=False, indent=1) + "\n")
    for region in dict.fromkeys(p["region"] for p in places):
        sheet(region, [p for p in places if p["region"] == region], done, "fill-")
        print("sheet", region, flush=True)


CATS_OUT = ROOT / "Review/sources/photo-candidates-cats.json"
# Place: (categories to walk, towns a file without coordinates must name). Category names are guesses; missing ones are skipped.
CATS = {
    "jerez": (["Vineyards in Jerez de la Frontera", "Vineyards in the Province of Cádiz", "Vineyards in Cádiz Province", "Sherry",
               "Albariza", "Wine of Jerez", "Viñedos de Jerez", "Vineyards in Andalusia", "Bodegas in Jerez de la Frontera",
               "Vineyards in El Puerto de Santa María", "Vineyards in Trebujena", "Vineyards in Chipiona"],
              r"jerez|xer[eè]s|sherry|trebujena|chipiona|puerto de santa mar|rota\b|chiclana|lebrija|albariza|macharnudo|carrascal|balbaína|a[ñn]ina"),
    "manzanilla": (["Vineyards in Sanlúcar de Barrameda", "Manzanilla (wine)", "Manzanilla sherry", "Bodegas in Sanlúcar de Barrameda",
                    "Wine of Sanlúcar de Barrameda", "Sanlúcar de Barrameda"],
                   r"sanl[uú]car|manzanilla|miraflores|el hornillo|barbadillo"),
    "ribera-del-guadiana": (["Vineyards in the Province of Badajoz", "Vineyards in Badajoz Province", "Vineyards in Extremadura",
                             "Vineyards in the Province of Cáceres", "Tierra de Barros", "Almendralejo", "Wine of Extremadura",
                             "Ribera del Guadiana (DO)", "Vineyards in Almendralejo"],
                            r"extremadura|badajoz|almendralejo|tierra de barros|villafranca de los barros|guare[ñn]a|montánchez|ca[ñn]amero|matanegra|ribera alta|ribera baja|cáceres|zafra|fuente del maestre|azuaga"),
    "txakoli-alava": (["Vineyards in Álava", "Txakoli", "Txakoli de Álava", "Arabako Txakolina", "Ayala, Álava", "Amurrio",
                       "Okondo", "Laudio/Llodio", "Artziniega", "Aiara"],
                      r"aiara|ayala|amurrio|okondo|llodio|laudio|artziniega|arabako txakolin|txakol[ií] de [aá]lava|menagarai|respaldiza|quejana"),
}


def members(cat, depth=1):
    titles, subs = [], []
    cont = {}
    while True:
        r = get({"action": "query", "list": "categorymembers", "cmtitle": "Category:" + cat, "cmtype": "file|subcat", "cmlimit": 500, **cont})
        for m in r.get("query", {}).get("categorymembers", []):
            (subs if m["ns"] == 14 else titles).append(m["title"])
        if "continue" not in r: break
        cont = {"cmcontinue": r["continue"]["cmcontinue"]}
        time.sleep(.5)
    if depth:
        for sc in subs[:25]:
            titles += members(sc.split(":", 1)[1], depth - 1)
            time.sleep(.3)
    return titles


def cats():
    tree = {p["id"]: p for p in json.loads((ROOT / "data/places.json").read_text())["places"]}
    geoms = boundaries([tree[i] for i in CATS])
    done = json.loads(CATS_OUT.read_text()) if CATS_OUT.exists() else {}
    for pid, (cat_list, towns) in CATS.items():
        if pid in done: continue
        g = prep(geoms[pid].buffer(0.02)) if pid in geoms else None
        hint = re.compile(towns, re.I)
        found = {}
        for c in cat_list:
            try: found.update({t: c for t in members(c)})
            except Exception as e: print(pid, c, "error:", e, flush=True)
            time.sleep(.5)
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
                cl = {c["title"].split(":", 1)[1] for c in p.get("categories", [])}
                text = p["title"] + " " + desc + " " + " ".join(cl)
                if DROP.search(p["title"] + " " + desc[:80]): continue
                if not (VINE.search(text) or WINE.search(text)): continue
                xy = (p["coordinates"][0]["lon"], p["coordinates"][0]["lat"]) if p.get("coordinates") else None
                inside = bool(xy) and g is not None and g.contains(Point(xy))
                if xy and g is not None and not inside: continue
                if not xy and not hint.search(text): continue
                out.append({"title": p["title"], "page": ii["descriptionurl"], "thumb": ii.get("thumburl"), "url": ii["url"],
                            "width": ii["width"], "height": ii["height"], "licence": lic, "licenceUrl": m.get("LicenseUrl", {}).get("value"),
                            "artist": re.sub("<[^>]+>", "", m.get("Artist", {}).get("value", "")).strip()[:120],
                            "credit": re.sub("<[^>]+>", "", m.get("Credit", {}).get("value", "")).strip()[:200], "description": desc,
                            "coords": xy, "inside": inside, "quality": max([FLAGS.get(c, 0) for c in cl] or [0]),
                            "vine": bool(VINE.search(text)), "wine": bool(WINE.search(text)), "category": found.get(p["title"])})
            time.sleep(.5)
        done[pid] = {"name": tree[pid]["name"], "region": tree[pid]["region"], "seen": len(found), "kept": len(out), "candidates": rank(out)}
        print(pid, len(found), len(out), flush=True)
        CATS_OUT.write_text(json.dumps(done, ensure_ascii=False, indent=1) + "\n")
    for pid in CATS:
        sheet(pid, [tree[pid]], done, "cats-")
        print("sheet", pid, flush=True)


PT_OUT = ROOT / "Review/sources/photo-candidates-pt.json"
# Place: (name searches, categories to walk). Category names are guesses; missing ones are skipped.
PT_CATS = {
    "douro": (['"Douro" (vinha OR vinhas OR vinhedo OR socalcos OR vineyard OR vineyards OR quinta OR vindima)',
               '"Alto Douro" (wine OR vinho OR terraces OR socalcos)'],
              ["Alto Douro Wine Region", "Douro Wine Region", "Vineyards in the Douro", "Vineyards in Douro", "Douro wine",
               "Quintas in the Douro Valley", "Port wine vineyards", "Socalcos do Douro", "Vineyards in Vila Real District",
               "Pinhão", "Peso da Régua", "Vineyards in Portugal"]),
    "vinho-verde": (['"Vinho Verde" (vinha OR vinhas OR vinhedo OR vineyard OR quinta OR uvas)',
                     '(Minho OR Monção OR Melgaço OR Lima) (vinha OR vinhas OR ramada OR alvarinho OR loureiro)'],
                    ["Vinho Verde", "Vinho Verde wine region", "Alvarinho", "Loureiro (grape)", "Vineyards in Minho",
                     "Vineyards in Braga District", "Vineyards in Viana do Castelo District", "Vineyards in Porto District",
                     "Vineyards in Monção", "Vineyards in Melgaço", "Ramadas", "Vineyards in Portugal"]),
}


def pt():
    places = [p for p in json.loads((ROOT / "data/places.json").read_text())["places"] if p["region"].startswith("pt-")]
    geoms = boundaries(places)
    done = json.loads(PT_OUT.read_text()) if PT_OUT.exists() else {}
    for p in places:
        if p["id"] in done or p["id"] == "porto": continue  # Porto is Douro's land: its photos are picked from Douro's candidates
        g = geoms[p["id"]]
        searches, cat_list = PT_CATS.get(p["id"], ([], []))
        found = {}
        try:
            for lon, lat in discs(g, max_n=40):
                r = get({"action": "query", "list": "geosearch", "gsnamespace": 6, "gslimit": 500, "gsradius": 10000, "gscoord": f"{lat}|{lon}"})
                for x in r["query"]["geosearch"]: found[x["title"]] = (x["lon"], x["lat"])
                time.sleep(.5)
            for q in searches:
                r = get({"action": "query", "list": "search", "srnamespace": 6, "srlimit": 100, "srsearch": q})
                for x in r["query"]["search"]: found.setdefault(x["title"], None)
                time.sleep(.5)
            for c in cat_list:
                for t in members(c): found.setdefault(t, None)
                time.sleep(.5)
            # files from a category or a search without coordinates must name the place and a vine word (info() rule)
            cands = [c for c in info(found, g, p["name"]) if c["vine"] or c["wine"]]
            # a file that names a neighbouring Portuguese place is that place's photo (Douro panoramas fell inside Vinho Verde)
            # (batch 1, 22 Oct 2026: only places whose outline does not touch this one; Lisboa holds Colares, Setúbal and Palmela share one)
            other = [q["name"].lower() for q in places if q["id"] != p["id"] and not geoms[q["id"]].intersects(g)]
            cands = [c for c in cands if not any(o in (c["title"] + " " + c["description"]).lower() for o in other)]
        except Exception as e:  # keep what is done; a rerun retries this place
            print(p["id"], "error:", e, flush=True); continue
        done[p["id"]] = {"name": p["name"], "region": p["region"], "seen": len(found), "kept": len(cands), "candidates": rank(list(cands), 20, 2), "all": cands}
        print(p["id"], len(found), len(cands), flush=True)
        PT_OUT.write_text(json.dumps(done, ensure_ascii=False, indent=1) + "\n")
    for p in [p for p in places if p["id"] in done]:
        sheet(p["id"], [p], done, "pt-", cols=5)
        print("sheet", p["id"], flush=True)


FR_OUT = ROOT / "Review/sources/photo-candidates-fr.json"
VINE_FR = re.compile(VINE.pattern + r"|vignobles?|vignes?\b|vendanges?|domaine|ch[âa]teau|coteau|coteaux|\bcave\b|grand cru|premier cru", re.I)
FR_VINE_Q = "(vigne OR vignes OR vignoble OR vendange OR domaine OR château OR coteau OR cave OR \"grand cru\" OR \"premier cru\")"
# Place: (name searches, categories to walk). Only categories checked to exist on Commons (22 Oct 2026); "Chablis (wine)" and
# "Vineyards in Chablis" do not exist. Files without coordinates must still name the place and a vine word (info() rule).
FR_CATS = {
    "chablis": (['"Chablis" (vigne OR vignes OR vignoble OR vendange OR domaine OR "grand cru" OR "premier cru")'],
                ["Chablis (Yonne)", "Vineyards in Yonne"]),
    "pauillac": (['"Pauillac" (vigne OR vignes OR vignoble OR vendange OR château OR domaine OR "grand cru")'],
                 ["Pauillac", "Vineyards in Pauillac", "Vineyards in Gironde"]),
}


def fr_outlines():
    f = ROOT / "data/countries/fr/areas.geojson"
    if not f.exists(): return {}
    return {x["properties"]["id"]: shape(x["geometry"]) for x in json.loads(f.read_text())["features"] if x["properties"].get("kind") == "place"}


def fr(ids):
    src = Path(os.environ.get("FR_PLACES") or ROOT / "data/countries/fr/wset-places.json")
    places = [p for p in json.loads(src.read_text())["places"] if not ids or p["id"] in ids]
    geoms = fr_outlines()
    done = json.loads(FR_OUT.read_text()) if FR_OUT.exists() else {}
    for p in places:
        if p["id"] in done: continue
        g = geoms.get(p["id"])
        searches, cat_list = FR_CATS.get(p["id"], ([f'"{p["name"]}" ' + FR_VINE_Q], []))
        found = {}
        try:
            for lon, lat in (discs(g, max_n=40) if g is not None else []):
                r = get({"action": "query", "list": "geosearch", "gsnamespace": 6, "gslimit": 500, "gsradius": 10000, "gscoord": f"{lat}|{lon}"})
                for x in r["query"]["geosearch"]: found[x["title"]] = (x["lon"], x["lat"])
                time.sleep(.5)
            for q in searches:
                r = get({"action": "query", "list": "search", "srnamespace": 6, "srlimit": 100, "srsearch": q})
                for x in r["query"]["search"]: found.setdefault(x["title"], None)
                time.sleep(.5)
            for c in cat_list:
                for t in members(c): found.setdefault(t, None)
                time.sleep(.5)
            cands = [c for c in info(found, g, p["name"], VINE_FR) if c["vine"] or c["wine"]]
        except Exception as e:  # keep what is done; a rerun retries this place
            print(p["id"], "error:", e, flush=True); continue
        done[p["id"]] = {"name": p["name"], "batch": p.get("batch"), "outline": g is not None, "seen": len(found), "kept": len(cands),
                         "candidates": rank(list(cands), 20, 2), "all": cands}
        print(p["id"], len(found), len(cands), len(done[p["id"]]["candidates"]), flush=True)
        FR_OUT.write_text(json.dumps(done, ensure_ascii=False, indent=1) + "\n")
    for p in [p for p in places if p["id"] in done]:
        sheet(p["id"], [p], done, "fr-", cols=5)
        print("sheet", p["id"], flush=True)


def main():
    if sys.argv[1:] == ["pt"]: return pt()
    if sys.argv[1:2] == ["fr"]: return fr(sys.argv[2:])
    if sys.argv[1:] == ["fill"]: return fill()
    if sys.argv[1:] == ["cats"]: return cats()
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
