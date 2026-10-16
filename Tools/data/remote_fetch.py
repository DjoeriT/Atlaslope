#!/usr/bin/env python3
"""Fetch the URLs in a list from GitHub Actions, for hosts the cloud threads cannot reach.

Usage: remote_fetch.py LIST OUTDIR
LIST is tab-separated: name, url, kind. Kinds:
  text  save the body as is (HTML, JSON, XML, CSV); capped at 3 MB
  pdf   save only the text of the PDF (pdftotext -layout) as <name>.txt, never the PDF
  head  save only the status, final URL, type and size
Lines starting with # are skipped. A name already in OUTDIR/manifest.json with the same URL is not fetched again.
Writes OUTDIR/manifest.json: per name the url, final url, status, content type, bytes, sha256 and fetch time.
"""
import hashlib, json, os, subprocess, sys, tempfile, time, urllib.request
from datetime import datetime, timezone

UA = "AtlaslopeDataBot/0.1 (https://github.com/DjoeriT/Paraje)"
CAP = 3 * 1024 * 1024


def fetch(url):
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.status, r.geturl(), r.headers.get("Content-Type", ""), r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < 3:
                time.sleep(3 * (attempt + 1)); continue
            return e.code, url, e.headers.get("Content-Type", ""), e.read()[:CAP]
        except Exception as e:  # network error: record it, keep going
            if attempt < 3:
                time.sleep(2 * (attempt + 1)); continue
            return 0, url, "error: " + type(e).__name__ + ": " + str(e)[:200], b""


def main(list_path, out):
    os.makedirs(out, exist_ok=True)
    mpath = os.path.join(out, "manifest.json")
    manifest = json.load(open(mpath)) if os.path.exists(mpath) else {}
    for line in open(list_path, encoding="utf-8"):
        if not line.strip() or line.startswith("#"):
            continue
        name, url, kind = (line.rstrip("\n").split("\t") + ["text"])[:3]
        if "/" in name or ".." in name or name.startswith("."):
            raise SystemExit(f"bad name in fetch list: {name}")
        if manifest.get(name, {}).get("url") == url and 200 <= manifest[name].get("status", 0) < 300 and (manifest[name]["status"] == 200 or os.path.exists(os.path.join(out, name + ".txt"))):
            continue
        status, final, ctype, body = fetch(url)
        entry = {"url": url, "final_url": final, "status": status, "type": ctype, "bytes": len(body),
                 "sha256": hashlib.sha256(body).hexdigest(), "fetched": datetime.now(timezone.utc).isoformat(timespec="seconds")}
        if kind == "pdf" and 200 <= status < 300 and body[:4] == b"%PDF":
            with tempfile.NamedTemporaryFile(suffix=".pdf") as f:
                f.write(body); f.flush()
                txt = subprocess.run(["pdftotext", "-layout", f.name, "-"], capture_output=True).stdout
                pages = subprocess.run(["pdfinfo", f.name], capture_output=True, text=True).stdout
            entry["pages"] = next((int(l.split()[-1]) for l in pages.splitlines() if l.startswith("Pages:")), None)
            open(os.path.join(out, name + ".txt"), "wb").write(txt)
        elif kind == "text" and body:
            open(os.path.join(out, name), "wb").write(body[:CAP])
            entry["truncated"] = len(body) > CAP
        manifest[name] = entry
        print(status, name, len(body), flush=True)
    json.dump(manifest, open(mpath, "w"), indent=1, ensure_ascii=False, sort_keys=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
