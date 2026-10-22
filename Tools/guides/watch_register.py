#!/usr/bin/env python3
"""Register watch (issue #157, option B): notice when the EU register entry behind a place changed. Costs no tokens.

Usage: watch_register.py [--json] [--no-write] [--from-file LIST.json] [--oj PLACE_ID ...] [--self-test]

Fetches the eAmbrosia list once (one GET, no key), keeps Spanish wine entries, maps them to our place ids (data/places.json
"euFile", else the protected name), and writes data/register-snapshot.json. It compares with the snapshot already there
and prints (1) the places whose register entry changed since then, (2) per covered place, whether the register changed after
the newest official source date in content/sources.json (keys "<id>-doc", "<id>-doc2", "<id>-pliego"), and the issue text it
would open. It opens no issue. modificationDate also moves for a contact edit: a flag is a prompt to look, not proof of change.
--oj PLACE_ID lists the Official Journal items dated after that place's newest source date, from the register data.
"""
import datetime
import json
import re
import sys
import unicodedata
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
URL = "https://webgate.ec.europa.eu/eambrosia-api/api/v1/geographical-indications"
UA = "Atlaslope data check"
SNAP = ROOT / "data" / "register-snapshot.json"
WATCHED = ("modificationDate", "ojCount", "amendmentInProgress", "status", "name")


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^a-z0-9]+", " ", re.sub(r"[̀-ͯ]", "", s)).strip()


def oj_date(text):
    """Date in an Official Journal item text such as 'Official Journal C 331, 20.9.2023' -> '2023-09-20'."""
    m = re.search(r"(\d{1,2})\.(\d{1,2})\.(\d{4})\s*$", text.strip())
    return f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}" if m else None


def pad_date(d):
    """Source dates may be a year or a month: pad to the end of the period, so a vague date never makes a false 'changed'."""
    if re.fullmatch(r"\d{4}", d):
        return d + "-12-31"
    if re.fullmatch(r"\d{4}-\d{2}", d):
        return d + "-31"
    return d


def entry(gi):
    ojs = [
        {"date": oj_date(p["text"]), "text": p["text"], "uri": p["uri"]}
        for p in gi.get("publications") or []
        if p["text"].startswith("Official Journal")
    ]
    return {
        "fileNumber": gi["fileNumber"],
        "name": (gi.get("protectedNames") or [""])[0],
        "giType": gi.get("giType"),
        "status": gi.get("status"),
        "removed": bool(gi.get("removedFlag")),
        "modificationDate": gi.get("modificationDate"),
        "ojCount": len(ojs),
        "amendmentInProgress": bool(gi.get("amendmentsInProgressFlag")),
        "ojItems": sorted(ojs, key=lambda o: o["date"] or ""),
        "placeId": None,
        "mappedBy": None,
    }


def map_places(entries, places):
    """Attach our place id: by file number first, then by protected name equal to the name of a place with no file number."""
    by_file = {p["euFile"]: p["id"] for p in places if p.get("euFile")}
    by_name = {}
    for p in places:
        if not p.get("euFile"):
            by_name.setdefault(norm(p.get("official") or p["name"]), p["id"])
    for e in entries:
        if e["fileNumber"] in by_file:
            e["placeId"], e["mappedBy"] = by_file[e["fileNumber"]], "fileNumber"
        elif norm(e["name"]) in by_name:
            e["placeId"], e["mappedBy"] = by_name[norm(e["name"])], "name"
    return entries


def compare(old, new):
    """Changes between two dicts of entries keyed by fileNumber: list of (fileNumber, name, placeId, [what])."""
    out = []
    for fn, n in new.items():
        o = old.get(fn)
        if o is None:
            out.append((fn, n["name"], n["placeId"], ["new entry"]))
            continue
        diffs = [f"{k}: {o.get(k)} -> {n.get(k)}" for k in WATCHED if o.get(k) != n.get(k)]
        if diffs:
            out.append((fn, n["name"], n["placeId"], diffs))
    for fn, o in old.items():
        if fn not in new:
            out.append((fn, o["name"], o.get("placeId"), ["gone from the list"]))
    return sorted(out, key=lambda c: c[1])


def source_dates(sources):
    """place id -> newest official source date (padded) among '<id>-doc', '<id>-doc2', '<id>-pliego'."""
    out = {}
    for key, s in sources.items():
        m = re.fullmatch(r"(.+)-(?:doc\d*|pliego\d*)", key)
        if m and s.get("kind") == "official" and s.get("date"):
            d = pad_date(s["date"])
            if d > out.get(m.group(1), ""):
                out[m.group(1)] = d
    return out


def coverage(entries, src):
    """Per covered place: register change date vs newest source date, and OJ items dated after it."""
    rows = []
    for e in entries:
        pid = e["placeId"]
        if not pid or pid not in src:
            continue
        mod = (e["modificationDate"] or "")[:10]
        later = [o for o in e["ojItems"] if o["date"] and o["date"] > src[pid]]
        rows.append({
            "placeId": pid, "name": e["name"], "fileNumber": e["fileNumber"], "sourceDate": src[pid],
            "modificationDate": mod, "changedAfterSource": mod > src[pid], "ojAfterSource": len(later),
            "amendmentInProgress": e["amendmentInProgress"],
        })
    return sorted(rows, key=lambda r: r["placeId"])


def table(headers, rows):
    w = [max(len(str(x)) for x in col) for col in zip(headers, *rows)]
    fmt = "  ".join(f"{{:<{n}}}" for n in w)
    return "\n".join([fmt.format(*headers), fmt.format(*("-" * n for n in w))] + [fmt.format(*map(str, r)) for r in rows])


def issue_text(changes, rows, today):
    covered = [c for c in changes if c[2]]
    lines = [f"Title: Source changes: {today}", "", f"{len(covered)} covered place(s) changed in the EU register since the last snapshot."]
    if covered:
        lines += ["", "| Place | Register change |", "|---|---|"] + [f"| {c[2]} | {'; '.join(c[3])} |" for c in covered]
    stale = [r for r in rows if r["changedAfterSource"]]
    lines += ["", f"{len(stale)} of {len(rows)} covered places: register changed after the newest source date we cite "
              "(upper bound: a contact edit also moves the date).",
              "", "Not covered by this check: photo credits and licences, link rot, MAPA/IGN boundaries, Koppen, Terrarium."]
    return "\n".join(lines)


def fetch():
    req = urllib.request.Request(URL, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def self_test():
    def mk(fn, name, **k):
        return {"fileNumber": fn, "name": name, "placeId": name.lower(), "modificationDate": "2026-01-01", "ojCount": 1,
                "amendmentInProgress": False, "status": "registered", **k}
    old = {"A": mk("A", "Aa"), "B": mk("B", "Bb"), "C": mk("C", "Cc")}
    new = {"A": mk("A", "Aa"), "B": mk("B", "Bb", ojCount=2, amendmentInProgress=True), "D": mk("D", "Dd")}
    got = {c[0]: c[3] for c in compare(old, new)}
    assert set(got) == {"B", "C", "D"}, got
    assert got["B"] == ["ojCount: 1 -> 2", "amendmentInProgress: False -> True"], got["B"]
    assert got["C"] == ["gone from the list"] and got["D"] == ["new entry"]
    assert oj_date("Official Journal C 331, 20.9.2023") == "2023-09-20" and oj_date("Ares(2023)7776604") is None
    assert pad_date("2014") == "2014-12-31"
    src = source_dates({"x-doc": {"kind": "official", "date": "2014"}, "x-pliego": {"kind": "official", "date": "2023-06-07"},
                        "x-wiki": {"kind": "wikipedia", "date": "2026-01-01"}})
    assert src == {"x": "2023-06-07"}, src
    e = {"placeId": "x", "name": "X", "fileNumber": "F", "modificationDate": "2026-01-29T10:00:00Z", "amendmentInProgress": True,
         "ojItems": [{"date": "2023-01-01"}, {"date": "2024-10-30"}, {"date": "2026-01-29"}]}
    r = coverage([e], src)[0]
    assert r["changedAfterSource"] and r["ojAfterSource"] == 2
    print("self-test ok")


def main(argv):
    if "--self-test" in argv:
        return self_test()
    as_json, no_write = "--json" in argv, "--no-write" in argv
    if "--from-file" in argv:
        raw = json.loads(Path(argv[argv.index("--from-file") + 1]).read_text())
    else:
        raw = fetch()
    today = datetime.date.today().isoformat()
    places = json.loads((ROOT / "data/places.json").read_text())["places"]
    sources = json.loads((ROOT / "content/sources.json").read_text())
    entries = [entry(g) for g in raw if "ES" in (g.get("countries") or []) and g.get("productType") == "WINE"]
    entries = sorted(map_places(entries, places), key=lambda e: e["fileNumber"])
    old = {}
    if SNAP.exists():
        old = {e["fileNumber"]: e for e in json.loads(SNAP.read_text())["entries"]}
    changes = compare(old, {e["fileNumber"]: e for e in entries}) if old else []
    src = source_dates(sources)
    rows = coverage(entries, src)
    if "--oj" in argv:
        for pid in argv[argv.index("--oj") + 1:]:
            e = next((x for x in entries if x["placeId"] == pid), None)
            print(f"\n{pid}: Official Journal items after our newest official source ({src.get(pid)})")
            for o in (e["ojItems"] if e else []):
                if o["date"] and o["date"] > src[pid]:
                    print(f"  {o['date']}  {o['text']}  {o['uri']}")
        return
    if not no_write:
        SNAP.write_text(json.dumps({
            "$comment": "EU register (eAmbrosia) snapshot of Spanish wine entries, written by Tools/guides/watch_register.py. Source in data/SOURCES.md.",
            "source": URL, "fetched": today, "entries": entries}, ensure_ascii=False, indent=1) + "\n")
    if as_json:
        print(json.dumps({"fetched": today, "entries": len(entries), "mapped": sum(1 for e in entries if e["placeId"]),
                          "firstSnapshot": not old,
                          "changes": [{"fileNumber": c[0], "name": c[1], "placeId": c[2], "what": c[3]} for c in changes],
                          "coverage": rows}, ensure_ascii=False, indent=1))
        return
    print(f"{len(entries)} Spanish wine entries, {sum(1 for e in entries if e['placeId'])} mapped to a place id "
          f"({sum(1 for e in entries if e['mappedBy'] == 'name')} by name).")
    print("\nChanged since the previous snapshot:" if old else "\nFirst snapshot: nothing to compare.")
    if changes:
        print(table(("file", "name", "place", "what"), [(c[0], c[1], c[2] or "-", "; ".join(c[3])) for c in changes]))
    elif old:
        print("none")
    stale = [r for r in rows if r["changedAfterSource"]]
    print(f"\nCovered places: {len(rows)}; register changed after our newest official source date: {len(stale)}.")
    print(table(("place", "source", "register", "after?", "OJ after", "amending"),
                [(r["placeId"], r["sourceDate"], r["modificationDate"], "yes" if r["changedAfterSource"] else "no",
                  r["ojAfterSource"], "yes" if r["amendmentInProgress"] else "no") for r in rows]))
    print(f"\nRegister entries with no place of ours: {sum(1 for e in entries if not e['placeId'])}")
    print("\n--- issue text (not opened) ---\n" + issue_text(changes, rows, today))


if __name__ == "__main__":
    main(sys.argv[1:])
