#!/usr/bin/env python3
"""Country parity report (new-country skill, 23 Oct 2026): what Spain has, per country, from the repo's own files. Costs no tokens.

Usage: parity.py [country ...]   (default: every country in data/places.json)

One row per check, one column per country, Spain first as the yardstick. A cell is "have/of" for per-place checks, yes/no for
country-wide ones. A line under the table lists every gap (anything below Spain's share), so a session reads ~30 lines, not the files.
Checks cover the data behind the Home cards, the country page, the Guides page, the place page, the map (outlines, climate colours,
flags, tours), Study and the Atlas cover. Rendering is checked by the UI specs named in .claude/skills/new-country/SKILL.md, not here.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def load(rel):
    return json.loads((ROOT / rel).read_text())


def main(want):
    tree = load("data/places.json")
    countries = [c["id"] for c in tree["countries"]]
    if want:
        countries = ["spain"] + [c for c in want if c != "spain"]
    places = tree["places"]
    measures = load("data/place-measures.json")
    tiles = load("content/tiles.json")
    photos = load("data/photos.json")["photos"]
    crops = load("src/home/photoCrops.json")
    flags = load("content/flags.json")["sets"]
    sources = (ROOT / "data/SOURCES.md").read_text().lower()
    src_countries = (ROOT / "src/countries.ts").read_text()
    pages = (ROOT / "src/home/countryPages.ts").read_text()
    cover = re.search(r"COVER_COUNTRIES = \[([^\]]*)\]", (ROOT / "src/cards/atlasCover.ts").read_text()).group(1)
    stories = {p.stem for p in (ROOT / "content/stories").glob("*.json")}
    flagged = {pid for s in flags for pid in s["places"]}
    courses = {c.get("country"): c for c in tree["courses"]}

    rows, gaps = [], {}
    def row(name, per):
        rows.append((name, per))

    per = {c: [p for p in places if p["parent"] == c and p["level"] == "place"] for c in countries}
    groups = {c: sorted({p["region"] for p in per[c]}) for c in countries}

    def frac(test):
        return {c: (sum(1 for p in per[c] if test(p)), len(per[c])) for c in countries}

    row("places", {c: (len(per[c]), len(per[c])) for c in countries})
    row("guide written", frac(lambda p: (ROOT / f"content/guides/{p['id']}.json").exists()))
    row("outline drawn", frac(lambda p: p.get("boundary") not in (None, "to-fetch") and p.get("centroid")))
    row("photo (1+)", frac(lambda p: f"{p['id']}-1" in photos))
    row("photos (3+)", frac(lambda p: f"{p['id']}-3" in photos))
    row("crops checked", frac(lambda p: f"{p['id']}-1" not in photos or f"{p['id']}-1" in crops))
    row("tile line", frac(lambda p: p["id"] in tiles["places"]))
    m = measures["places"]
    row("altitude", frac(lambda p: "altitude" in m.get(p["id"], {})))
    row("slope", frac(lambda p: "slope" in m.get(p["id"], {})))
    row("climate (Köppen)", frac(lambda p: bool(m.get(p["id"], {}).get("koppen"))))
    row("map flags", frac(lambda p: p["id"] in flagged))
    row("map tour", frac(lambda p: p["id"] in stories))
    row("in Study", frac(lambda p: p.get("quiz") not in (None, "none")))
    row("regions with fact sheet", {c: (sum(1 for g in groups[c] if (ROOT / f"content/facts/{g}.json").exists()), len(groups[c])) for c in countries})
    row("regions with tile line", {c: (sum(1 for g in groups[c] if g in tiles["regions"]), len(groups[c])) for c in countries})
    row("regions measured", {c: (sum(1 for g in groups[c] if g in measures["regions"]), len(groups[c])) for c in countries})
    yes = lambda b: (1, 1) if b else (0, 1)
    row("country measured", {c: yes(c in measures["country"] and bool(measures["country"][c].get("koppen"))) for c in countries})
    row("country altitude", {c: yes("altitude" in measures["country"].get(c, {})) for c in countries})
    row("country tile line", {c: yes(c in tiles) for c in countries})
    row("countries.ts entry", {c: yes(re.search(rf"^\s*{c}: {{", src_countries, re.M)) for c in countries})
    row("country page entry", {c: yes(re.search(rf"^\s*{c}: {{", pages, re.M)) for c in countries})
    row("country photo blocks", {c: yes(re.search(rf"^\s*{c}: {{[^}}]*?blocks: \[\s*{{", pages, re.M | re.S)) for c in countries})
    row("Atlas cover", {c: yes(f"'{c}'" in cover) for c in countries})
    row("Study course", {c: yes(c in courses) for c in countries})
    row("mask", {c: yes(c == "spain" or (ROOT / f"data/countries/{(re.search(rf'{c}: {{ id: .{c}., code: .(..)', src_countries) or [None, '?'])[1]}/mask.json").exists()) for c in countries})
    row("named in SOURCES.md", {c: yes(c in sources) for c in countries})

    w = max(len(r[0]) for r in rows) + 2
    print("check".ljust(w) + "".join(c[:10].rjust(11) for c in countries))
    for name, cells in rows:
        print(name.ljust(w) + "".join(f"{cells[c][0]}/{cells[c][1]}".rjust(11) for c in countries))
        base = cells["spain"][0] / cells["spain"][1] if cells["spain"][1] else 0
        for c in countries[1:]:
            have, of = cells[c]
            if of and have / of < base:
                gaps.setdefault(c, []).append(name)
    for c in countries[1:]:
        print(f"gaps {c}: {', '.join(gaps.get(c, [])) or 'none'}")


if __name__ == "__main__":
    main(sys.argv[1:])
