#!/usr/bin/env python3
"""Austria pilot sources and empty fact sheets (issue #149, decisions #81-#86, #94). Costs no tokens.

Usage: at_wset.py --sources | --content     (both places: wachau, neusiedlersee)

The guide source per place is two or three texts in one file, so the guide tools see one source with pages:
  p1 the DAC regulation, German, from RIS (Wachau BGBl. II 200/2020; Neusiedlersee BGBl. II 431/2020 Art. 2),
  p2 the EU notice of the standard amendment AM01 with its single document, English, OJ C 68, 24 Feb 2023 (the part that describes
     climate, soil and the link to the wine; the DAC regulation has none of it),
  p3 (Wachau only) the corrigendum OJ C/2025/90060 (hand-picked grapes, the "DAC" term).
The texts are in $ATLASLOPE_RAW/countries/at/ (data/SOURCES.md; the EU ones through the Publications Office Cellar SPARQL on the CELEX
numbers 52023XC0224(09) Wachau, 52023XC0224(08) Neusiedlersee, as EUR-Lex blocks scripts). --sources writes Review/sources/fetched/
spec-<id>.txt (pages split by form feed), cuts it with Tools/guides/extract.py (every page stays) and lists "<id>-spec" in the group's
manifest.json. --content adds the source to content/sources.json and an empty fact sheet to content/facts/<group>.json.
"""
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = Path(os.environ.get("ATLASLOPE_RAW", Path.home() / "Developer/Atlaslope-raw")) / "countries/at"
PLACES = [
    {"id": "wachau", "name": "Wachau", "group": "at-wachau", "file": "PDO-AT-A0205",
     "parts": ["wachau-dac-200-2020.txt", "eu/wachau-oj-C-2023-68-12.txt", "eu/wachau-corrigendum-C-2025-90060.txt"],
     "url": "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2020_II_200/BGBLA_2020_II_200.html",
     "title": "Wachau PDO-AT-A0205: DAC-Verordnung Wachau, BGBl. II 200/2020 (RIS, German, p1); EU notice of amendment AM01 with single "
              "document, OJ C 68, 24.2.2023 (English, p2); corrigendum OJ C/2025/90060, 1.8.2025 (p3)"},
    {"id": "neusiedlersee", "name": "Neusiedlersee", "group": "at-neusiedlersee", "file": "PDO-AT-A0219",
     "parts": ["neusiedlersee-dac-431-2020.txt", "eu/neusiedlersee-oj-C-2023-68-11.txt"],
     "url": "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2020_II_431/BGBLA_2020_II_431.html",
     "title": "Neusiedlersee PDO-AT-A0219: DAC-Verordnung Neusiedlersee, BGBl. II 431/2020 Art. 2 (RIS, German, p1); EU notice of "
              "amendment AM01 with single document, OJ C 68, 24.2.2023 (English, p2)"},
]
STUB = {"why": {"text": "", "cite": []}, "grapes": {"main": [], "cite": [], "others": [], "othersCite": []},
        "styles": {"kinds": [], "text": "", "cite": []}, "climate": {"text": "", "cite": []}, "soil": {"text": "", "cite": []},
        "altitude": {"text": "", "cite": []}, "tastes": {"text": "", "cite": []}, "famous": {"styles": [], "cite": []},
        "producers": {"items": [], "cite": []}}


def dump(path: Path, doc) -> None:
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def sources() -> None:
    for p in PLACES:
        txt = ROOT / f"Review/sources/fetched/spec-{p['id']}.txt"
        txt.write_text("\f".join((RAW / f).read_text(encoding="utf-8").strip() + "\n" for f in p["parts"]), encoding="utf-8")
        gp = ROOT / "Review/guides-pipeline" / p["group"]
        gp.mkdir(parents=True, exist_ok=True)
        subprocess.run([sys.executable, str(ROOT / "Tools/guides/extract.py"), str(txt), str(gp / f"{p['id']}.extract.txt")],
                       check=True, capture_output=True)
        dump(gp / "manifest.json", {"sources": {f"{p['id']}-spec": str(txt.relative_to(ROOT))}})
        print(f"sources: {gp.relative_to(ROOT)}")


def content() -> None:
    src_path = ROOT / "content/sources.json"
    known = json.loads(src_path.read_text(encoding="utf-8"))
    for p in PLACES:
        known.setdefault(f"{p['id']}-spec", {"kind": "official", "url": p["url"], "date": "2026-10-23", "title": p["title"]})
        fp = ROOT / f"content/facts/{p['group']}.json"
        doc = json.loads(fp.read_text(encoding="utf-8")) if fp.exists() else {"region": p["group"], "sheets": []}
        if p["id"] not in {s["id"] for s in doc["sheets"]}:
            doc["sheets"].append({"id": p["id"], **json.loads(json.dumps(STUB))})
        dump(fp, doc)
        print(f"content: {p['id']} -> {fp.relative_to(ROOT)}")
    dump(src_path, known)


if __name__ == "__main__":
    {"--sources": sources, "--content": content}[sys.argv[1]]()
