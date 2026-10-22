"""Where the raw downloads live: outside the repo, so no checkout, pull or clean can touch them.

Default ~/Developer/Atlaslope-raw, or the folder in the ATLASLOPE_RAW environment variable. Scripts import RAW from here
and keep their sub-paths (RAW / "countries/pt/...", RAW / "mapa/cdz_vinos.geojson").

Incident (22 Oct 2026): a symlink named data/raw was committed with Portugal batch 1 (#214); checking out main swapped the
owner's ignored data/raw folder for that link and wiped the downloads (INAO, eAmbrosia, CAOP, IGN). Nothing in the repo may
be a symlink (Tools/check.sh), and what is missing is fetched again with `python3 Tools/data/refetch_raw.py`.
"""
import os
from pathlib import Path

RAW = Path(os.environ.get("ATLASLOPE_RAW") or Path.home() / "Developer/Atlaslope-raw")
