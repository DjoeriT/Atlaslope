#!/usr/bin/env python3
"""Producer notes from English Wikipedia, for release 4.1 (issue #27), after the Spanish articles singled out almost no producer.

en.wikipedia is reachable from the cloud container, so this runs there or in Actions. For each quizzed place it searches for the
place's wine article, writes Review/sources/wikipedia-en/<id>.md with the title, revision and only the paragraphs that name
producers or call something famous, notable or respected (at most about 3000 characters). Writers cite «Wikipedia (en), <title>,
revision <id>» as `<id>-enwiki`. The title is written at the top so the writer and the review can reject a wrong article.
"""
import json, re, sys, time, unicodedata, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
API = "https://en.wikipedia.org/w/api.php"
UA = "AtlaslopeDataBot/0.3 (https://github.com/DjoeriT/Atlaslope)"
OUT = ROOT / "Review/sources/wikipedia-en"
SINGLE = re.compile(r"famous|notable|renowned|respected|best[- ]known|well[- ]known|leading|prominent|iconic|flagship|celebrated|"
                    r"acclaimed|prestig|cult|top producers|producers include|bodegas? (?:such as|include)|oldest", re.I)
WINE_WORD = re.compile(r"wine|bodega|vineyard|winer|grape|DO\b|DOP|DOCa|DOQ|sherry|cava", re.I)
OVERRIDES = {"jerez": "Sherry", "manzanilla": "Manzanilla (sherry)", "rioja-alta": "Rioja (wine)", "rioja-alavesa": "Rioja (wine)",
             "rioja-oriental": "Rioja (wine)", "rioja": "Rioja (wine)"}
CAP = 3000


def get(params):
    params = {**params, "format": "json", "formatversion": "2"}
    url = API + "?" + urllib.parse.urlencode(params)
    for attempt in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 5: raise
            time.sleep(4 + 4 * attempt)


def fold(s):
    return unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()


def article(place):
    if place["id"] in OVERRIDES: return OVERRIDES[place["id"]]
    name = place["name"].split(" / ")[0]
    key = fold(re.split(r"[ -]", name.replace("Txakoli de ", ""))[0])
    for q in (f'intitle:"{name}" wine', f'"{name}" Denominación de Origen wine'):
        hits = get({"action": "query", "list": "search", "srsearch": q, "srlimit": 5})["query"]["search"]
        hits = [h for h in hits if not h["title"].startswith(("List of", "Spanish wine")) and (key in fold(h["title"]) or "txakoli" in fold(h["title"]))
                and re.search(r"wine|\(DO|DOP|DOCa|DOQ|\(D\.O|txakoli|cava", h["title"] + " " + h.get("snippet", ""), re.I)]
        if hits: return hits[0]["title"]
    return None


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    places = [p for p in json.loads((ROOT / "data/places.json").read_text())["places"] if p["quiz"] in ("core", "vc")]
    rows = []
    for p in places:
        try:
            title = article(p)
            if not title:
                rows.append((p["id"], "", "", "no article found")); continue
            r = get({"action": "query", "prop": "extracts|revisions|info", "explaintext": 1, "rvprop": "ids|timestamp", "inprop": "url", "titles": title, "redirects": 1})
            page = r["query"]["pages"][0]
            text, rev = page.get("extract", ""), page["revisions"][0]
            keep, n = [], 0
            for s in (x.strip() for x in re.split(r"\n+", text)):
                if s.startswith("==") or len(s) < 40: continue
                if SINGLE.search(s) and WINE_WORD.search(s) and n <= CAP: keep.append(s); n += len(s)
            (OUT / f"{p['id']}.md").write_text(
                f"# {p['name']}: Wikipedia (en) notes\n\nArticle: «{page['title']}», {page['fullurl']}, revision {rev['revid']} of {rev['timestamp'][:10]}. "
                f"English, quoted as published. Cite as «Wikipedia (en), {page['title']}, revision {rev['revid']}». "
                f"Check the article is about this wine place before using it.\n\n## Paragraphs that single something out\n\n" + ("\n\n".join(keep) or "(none)") + "\n", encoding="utf-8")
            rows.append((p["id"], page["title"], str(rev["revid"]), f"{len(keep)} paragraphs"))
            print(p["id"], page["title"], len(keep), flush=True)
        except Exception as e:
            rows.append((p["id"], "", "", f"error: {e}"))
        time.sleep(0.5)
    (OUT / "INDEX.md").write_text("# Wikipedia (en) producer notes\n\nBuilt by `Tools/data/wiki_en_notes.py`.\n\n| Place | Article | Revision | Kept |\n|---|---|---|---|\n"
                                  + "".join(f"| {a} | {b} | {c} | {d} |\n" for a, b, c, d in rows), encoding="utf-8")


if __name__ == "__main__":
    sys.exit(main())
