#!/usr/bin/env python3
"""Group the master JSON files exported from Sketch (silica-design/tools/export-symbols.js + build_kit.py master)
into kit/<Category>.json (one bundle per category) and kit/index.json.

usage: assemble-kit.py <stage-dir> <label>
"""
import json
import sys
from pathlib import Path

# Not part of the UI kit repo: app screens, brand art, full screens. Status Bar stays as an internal
# dependency (Menu Bar and Control Center embed it) and is hidden from the app.
EXCLUDE = {"Apps", "Brand", "Lock Screen", "Desktop"}
INTERNAL = {"Status Bar"}

stage, label = Path(sys.argv[1]), sys.argv[2]
kit = Path(__file__).resolve().parents[1] / "kit"
kit.mkdir(exist_ok=True)
for f in kit.glob("*.json"):
    f.unlink()

bundles = {}
for f in sorted(stage.rglob("*.json")):
    m = json.loads(f.read_text())
    cat = m["name"].split("/")[0]
    if cat in EXCLUDE:
        continue
    bundles.setdefault(cat, {})[m["name"]] = m

index = []
for cat, masters in sorted(bundles.items()):
    (kit / f"{cat}.json").write_text(json.dumps(masters, separators=(",", ":"), ensure_ascii=False))
    for name, m in sorted(masters.items()):
        index.append({"name": name, "category": cat, "id": m["id"], "symbolId": m["symbolId"], "w": m["frame"]["w"], "h": m["frame"]["h"],
                      **({"internal": True} if cat in INTERNAL else {})})
(kit / "index.json").write_text(json.dumps(
    {"source": "Silica 1.0 Amalfi UI Kit (DEB2F9E8-966A-4E25-A6AF-6BAF189DD87E)", "exported": label,
     "symbols": index}, separators=(",", ":"), ensure_ascii=False))
print(len(index), "masters in", len(bundles), "categories")
