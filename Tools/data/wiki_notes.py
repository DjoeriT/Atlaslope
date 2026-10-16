#!/usr/bin/env python3
"""Producer and planted-area notes from Spanish Wikipedia, for release 4.1 (issue #27).

Runs in GitHub Actions (data-wiki-notes workflow; es.wikipedia is blocked in the cloud container). Reads the article titles
already checked in Review/sources/wikipedia/INDEX.md (built by wiki_grapes.py) and writes Review/sources/wikipedia-notes/<id>.md:
the article's current revision, then only the paragraphs that name producers, wineries or famous wines, and the paragraphs that
give planted area or shares by grape (each capped at about 3000 characters). Writers cite these as
«Wikipedia (es), <title>, revision <id>». Extracts are working notes, not shipped data.
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
API = "https://es.wikipedia.org/w/api.php"
UA = "AtlaslopeDataBot/0.3 (https://github.com/DjoeriT/Atlaslope)"
INDEX = ROOT / "Review/sources/wikipedia/INDEX.md"
OUT = ROOT / "Review/sources/wikipedia-notes"
PRODUCER = re.compile(r"bodega|productor|elaborador|cooperativa|marca|famos|célebre|conocid|prestigi|reconocid|emblem|icónic|"
                      r"château|castillo de|marqués|vega sicilia|pingus|clos |viña |finca ", re.I)
PRODUCER_SECTION = re.compile(r"bodega|productor|elaborador|vinos destacados|marcas", re.I)
AREA = re.compile(r"hectárea|\bha\b|superficie|plantad|cultivad|viñedo inscrito|% de", re.I)
AREA_SECTION = re.compile(r"superficie|viñedo|variedad|uva|cepa|estadístic|datos", re.I)
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


def titles():
    for line in INDEX.read_text(encoding="utf-8").splitlines():
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) == 3 and cells[1] and cells[0] not in ("Place", "---"):
            yield cells[0], cells[1]


def pick(text, line_re, section_re):
    keep, n, in_sec = [], 0, False
    for s in (x.strip() for x in re.split(r"\n+", text)):
        if s.startswith("=="):
            in_sec = bool(section_re.search(s)); continue
        if len(s) > 30 and (in_sec or line_re.search(s)) and n <= CAP:
            keep.append(s); n += len(s)
    return "\n\n".join(keep) or "(none)"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rows = []
    for pid, title in titles():
        try:
            r = get({"action": "query", "prop": "extracts|revisions|info", "explaintext": 1, "rvprop": "ids|timestamp",
                     "inprop": "url", "titles": title, "redirects": 1})
            page = r["query"]["pages"][0]
            text, rev = page.get("extract", ""), page["revisions"][0]
            prod, area = pick(text, PRODUCER, PRODUCER_SECTION), pick(text, AREA, AREA_SECTION)
            (OUT / f"{pid}.md").write_text(
                f"# {pid}: Wikipedia (es) notes\n\nArticle: «{page['title']}», {page['fullurl']}, revision {rev['revid']} of {rev['timestamp'][:10]}. "
                f"Spanish, quoted as published. Cite as «Wikipedia (es), {page['title']}, revision {rev['revid']}».\n\n"
                f"## Paragraphs naming producers or wines\n\n{prod}\n\n## Paragraphs about planted area\n\n{area}\n", encoding="utf-8")
            rows.append((pid, page["title"], str(rev["revid"]), rev["timestamp"][:10]))
            print(pid, page["title"], flush=True)
        except Exception as e:
            rows.append((pid, title, "", f"error: {e}"))
        time.sleep(1)
    (OUT / "INDEX.md").write_text("# Wikipedia producer and planted-area notes\n\nBuilt by `Tools/data/wiki_notes.py`.\n\n"
                                  "| Place | Article | Revision | Date |\n|---|---|---|---|\n"
                                  + "".join(f"| {a} | {b} | {c} | {d} |\n" for a, b, c, d in rows), encoding="utf-8")


if __name__ == "__main__":
    sys.exit(main())
