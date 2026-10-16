#!/usr/bin/env python3
"""Grape notes from Spanish Wikipedia, for places whose official document lists allowed grapes without saying which are main.

Runs in GitHub Actions (data-wiki workflow; es.wikipedia is blocked in the cloud container). Writes one short extract per quizzed
place to Review/sources/wikipedia/<id>.md: the article title, URL, revision id and date, and only the paragraphs that talk about
grape varieties (at most about 2500 characters). Writers cite these as «Wikipedia (es), <title>, revision <id>». Extracts are
working notes, not shipped data. The article is found by a search for the place's name with «denominación de origen»; the title
is written at the top so the writer (and the review) can reject a wrong article.
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
API = "https://es.wikipedia.org/w/api.php"
UA = "AtlaslopeDataBot/0.2 (https://github.com/DjoeriT/Atlaslope)"
OUT = ROOT / "Review/sources/wikipedia"
GRAPE = re.compile(r"variedad|varietal|uva|cepa|tempranillo|garnacha|albariño|verdejo|monastrell|palomino|bobal|airén|macabeo|viura|mencía", re.I)


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


def article(place):
    name = place["name"].split(" / ")[0]
    for q in (f'intitle:"{name}" denominación de origen vino', f'"{name}" denominación de origen vino'):
        hits = get({"action": "query", "list": "search", "srsearch": q, "srlimit": 5})["query"]["search"]
        hits = [h for h in hits if not h["title"].startswith(("Anexo:", "Vinos de España"))]
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
                rows.append((p["id"], "", "no article found")); continue
            r = get({"action": "query", "prop": "extracts|revisions|info", "explaintext": 1, "rvprop": "ids|timestamp", "inprop": "url", "titles": title, "redirects": 1})
            page = r["query"]["pages"][0]
            text = page.get("extract", "")
            paras = [s.strip() for s in re.split(r"\n+", text) if GRAPE.search(s) and len(s.strip()) > 40]
            keep, n = [], 0
            for s in paras:
                if n > 2500: break
                keep.append(s); n += len(s)
            rev = page["revisions"][0]
            (OUT / f"{p['id']}.md").write_text(
                f"# {p['name']}: Wikipedia (es)\n\nArticle: «{page['title']}», {page['fullurl']}, revision {rev['revid']} of {rev['timestamp'][:10]}. "
                f"Spanish, quoted as published. Cite as «Wikipedia (es), {page['title']}, revision {rev['revid']}». "
                f"Check the article is about this wine place before using it.\n\n## Paragraphs about grapes\n\n" + ("\n\n".join(keep) or "(none)") + "\n")
            rows.append((p["id"], page["title"], f"{len(keep)} paragraphs"))
            print(p["id"], page["title"], len(keep), flush=True)
        except Exception as e:
            rows.append((p["id"], "", f"error: {e}"))
        time.sleep(1)
    (OUT / "INDEX.md").write_text("# Wikipedia grape notes\n\nBuilt by `Tools/data/wiki_grapes.py`.\n\n| Place | Article | Kept |\n|---|---|---|\n"
                                  + "".join(f"| {a} | {b} | {c} |\n" for a, b, c in rows))


if __name__ == "__main__":
    sys.exit(main())
