#!/usr/bin/env python3
"""Sets up a Portugal batch from build_places.PT_PLACES (batch 1, owner option B, 22 Oct 2026), so no agent does it by hand.

Per new place: copies its EU spec (eAmbrosia summary sheet, the last listed) from <raw folder>/countries/pt/att/ (Tools/countries/pull.py)
to Review/sources/fetched/att-<file>-<n>.{pdf,txt}, where sources.py finds it; adds "<id>-doc" to content/sources.json; adds an empty
sheet to content/facts/<group>.json; merges Review/sources/pt-areas/<id>.json (one spec fragment per place, read by helpers from
the spec's area section) into data/countries/pt/areas-spec.json. Porto takes Douro's area as one zone (same demarcated region).
Then run build_pt_areas.py, build_places.py and Tools/guides/sources.py <group> for each group. Re-running changes nothing already there.
"""
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "Tools/data"))
from build_places import PT_PLACES  # noqa: E402
from rawdir import RAW  # noqa: E402

RAW = RAW / "countries/pt/att"
FETCHED = ROOT / "Review/sources/fetched"
STUB = {"why": {"text": "", "cite": []}, "grapes": {"main": [], "cite": [], "others": [], "othersCite": []},
        "styles": {"kinds": [], "text": "", "cite": []}, "climate": {"text": "", "cite": []}, "soil": {"text": "", "cite": []},
        "altitude": {"text": "", "cite": []}, "tastes": {"text": "", "cite": []}, "famous": {"styles": [], "cite": []},
        "producers": {"items": [], "cite": []}}


def dump(path, doc):
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def main():
    reg = {e["fileNumber"]: e for e in json.loads((ROOT / "data/countries/pt/register.json").read_text())["entries"]}
    src_path, spec_path = ROOT / "content/sources.json", ROOT / "data/countries/pt/areas-spec.json"
    sources, spec = json.loads(src_path.read_text()), json.loads(spec_path.read_text())
    facts = {}
    for pid, file, group in PT_PLACES:
        e = reg[file]
        att = e["summarySheets"][-1]
        for ext in ("pdf", "txt"):
            dst = FETCHED / f"att-{file}-{att}.{ext}"
            if not dst.exists():
                shutil.copy(RAW / f"{att}.{ext}", dst)
        kind = "PGI" if file.startswith("PGI") else "PDO"
        sources.setdefault(f"{pid}-doc", {"kind": "official", "title": f"{e['names'][0]} {file}: EU single document / technical file ({kind}, Portuguese, eAmbrosia attachment {att})",
                                          "url": f"https://webgate.ec.europa.eu/eambrosia-api/api/v1/attachments/{att}",
                                          "date": (e["modificationDate"] or e["euProtectionDate"] or "")[:10]})
        fp = ROOT / f"content/facts/{group}.json"
        doc = facts.setdefault(group, json.loads(fp.read_text()) if fp.exists() else {"region": group, "sheets": []})
        if pid not in {s["id"] for s in doc["sheets"]}:
            doc["sheets"].append({"id": pid, **json.loads(json.dumps(STUB))})
        frag = ROOT / f"Review/sources/pt-areas/{pid}.json"
        if frag.exists():  # the fragment wins, so a redone fragment replaces the old one
            spec.update(json.loads(frag.read_text()))
    if "porto" not in spec:
        d = spec["douro"]["zones"]
        merged = {"municipalities": [], "parishes": {}}
        for z in d.values():
            merged["municipalities"] += z["municipalities"]
            for m, ps in z["parishes"].items():
                merged["parishes"].setdefault(m, []).extend(ps)
        spec["porto"] = {"source": "porto-doc; the same Região Demarcada do Douro as douro (Decreto 7934 of 1921), one zone",
                         "zones": {"porto": merged}, "notMapped": spec["douro"].get("notMapped", []), "aliases": spec["douro"].get("aliases", {})}
    for group, doc in facts.items():
        dump(ROOT / f"content/facts/{group}.json", doc)
    dump(src_path, sources)
    dump(spec_path, spec)
    missing = [pid for pid, _, _ in PT_PLACES if pid not in spec]
    print(f"{len(PT_PLACES)} places; groups {sorted(facts)}; areas still missing: {', '.join(missing) or 'none'}")


if __name__ == "__main__":
    main()
