#!/usr/bin/env python3
"""Write kit/deps.json: for every component group (Category/Component) which other groups it is built
from ("uses") and which groups embed it ("usedBy"). Counts are the number of variants (masters) involved.
Run after tools/assemble-kit.py."""
import json
from pathlib import Path

kit = Path(__file__).resolve().parents[1] / "kit"
APP = {"Light", "Dark"}
INTERNAL = {"Status Bar"}


def group(name):
    p = name.split("/")
    if p[-1] in APP:
        p.pop()
    return "/".join(p[:2]) if len(p) > 2 else "/".join(p)


def nested(node, out):
    if node["type"] == "SymbolInstance" and node.get("master"):
        out.add(node["master"])
        for o in node.get("overrides", []):
            pass
    for c in node.get("children", []):
        nested(c, out)


known = set()
masters = []
for f in sorted(kit.glob("*.json")):
    if f.name in ("index.json", "deps.json"):
        continue
    for name, m in json.loads(f.read_text()).items():
        if name.split("/")[0] in INTERNAL:
            continue
        known.add(group(name))
        masters.append((name, m))

uses, used_by = {}, {}
for name, m in masters:
    refs = set()
    nested(m, refs)
    g = group(name)
    for r in {group(x) for x in refs}:
        if r == g or r not in known:
            continue
        uses.setdefault(g, {}).setdefault(r, 0)
        uses[g][r] += 1
        used_by.setdefault(r, {}).setdefault(g, 0)
        used_by[r][g] += 1

out = {k: {"uses": dict(sorted(uses.get(k, {}).items(), key=lambda x: -x[1])),
           "usedBy": dict(sorted(used_by.get(k, {}).items(), key=lambda x: -x[1]))} for k in sorted(known)}
(kit / "deps.json").write_text(json.dumps(out, separators=(",", ":")))
print(len(out), "groups;", sum(1 for v in out.values() if v["usedBy"]), "are reused by another component")
