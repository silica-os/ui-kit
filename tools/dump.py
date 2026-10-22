#!/usr/bin/env python3
"""Print a master's layer tree with the style facts needed to implement it (frames, fills with token names,
borders, shadows, blur, radii, fonts, stack and sizing). usage: dump.py "<master name>" [more names]"""
import json
import sys
from pathlib import Path

kit = Path(__file__).resolve().parents[1] / "kit"


def load(name):
    cat = name.split("/")[0]
    return json.loads((kit / f"{cat}.json").read_text())[name]


def sw(x):
    return x.get("swatch") or x.get("color") or "gradient"


def line(n, d):
    f = n["frame"]
    st = n.get("style", {})
    bits = []
    for fl in st.get("fills", []):
        bits.append("fill " + (sw(fl) if "color" in fl else "gradient"))
    for b in st.get("borders", []):
        bits.append(f"border {b['thickness']} {sw(b)} {b['position']}")
    for s in st.get("shadows", []):
        bits.append(f"shadow {s['x']},{s['y']} b{s['blur']} s{s['spread']} {s['color']}")
    for s in st.get("innerShadows", []):
        bits.append(f"inner {s['x']},{s['y']} b{s['blur']} {s['color']}")
    for b in st.get("blurs", []):
        bits.append(f"blur {b['radius']} sat {b.get('saturation')}")
    r = st.get("corners", {}).get("radii")
    if r:
        bits.append("r " + "/".join(str(v) for v in r))
    if st.get("opacity", 1) != 1:
        bits.append(f"opacity {st['opacity']}")
    if n["type"] == "Text":
        ft = n["font"]
        bits.append(f"font {ft['family']} {ft['size']}/{ft['lineHeight']} w{ft['weight']} {ft['align']} {ft['color']} {n.get('sharedStyle') or ''} '{n['text']}'")
    if n["type"] == "SymbolInstance":
        bits.append("→ " + str(n["master"]))
    if n.get("stack"):
        s = n["stack"]
        bits.append(f"stack {'row' if s['direction']==0 else 'col'} gap{s['gap']} pad{s['padding']} j{s['justify']} a{s['align']}")
    flags = "".join(f" {k}={n[k]}" for k in ("hs", "vs", "hp", "vp") if n.get(k) is not None) + (" IGNORE" if n.get("ignore") else "")
    print(f"{'  ' * d}{n['type'][:5]} {n['name']} [{f['x']:g},{f['y']:g} {f['w']:g}x{f['h']:g}]{flags} " + "; ".join(bits))
    for c in n.get("children", []):
        line(c, d + 1)


for name in sys.argv[1:]:
    print("##", name)
    line(load(name), 0)
