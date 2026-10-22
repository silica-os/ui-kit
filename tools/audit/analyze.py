#!/usr/bin/env python3
"""Compare the live component with the kit render in every audited cell of a page screenshot.

usage: analyze.py <page.png> <page.png.json> <out-dir> [--top N]
Prints one line per cell, worst first: size difference (pt), pixel difference before and after the best 1-3 pt shift.
Writes a montage (live | kit | diff) of the worst cells into out-dir.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

png, js, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
top = int(sys.argv[sys.argv.index('--top') + 1]) if '--top' in sys.argv else 8
S = 2  # snapshot scale
img = Image.open(png).convert('RGB')
cells = json.loads(js.read_text())['cells']
W, H = img.size


def crop(r):
    x0, y0 = int(round(r['x'] * S)), int(round(r['y'] * S))
    x1, y1 = int(round((r['x'] + r['w']) * S)), int(round((r['y'] + r['h']) * S))
    x0, y0, x1, y1 = max(0, x0), max(0, y0), min(W, x1), min(H, y1)
    return np.asarray(img.crop((x0, y0, x1, y1)), dtype=np.int16)


def score(a, b, dx=0, dy=0):
    h = max(a.shape[0], b.shape[0]) + 24
    w = max(a.shape[1], b.shape[1]) + 24
    A = np.zeros((h, w, 3), np.int16) + 127
    B = np.zeros((h, w, 3), np.int16) + 127
    A[12:12 + a.shape[0], 12:12 + a.shape[1]] = a
    B[12 + dy:12 + dy + b.shape[0], 12 + dx:12 + dx + b.shape[1]] = b
    d = np.abs(A - B).sum(axis=2)
    return float((d > 60).mean()), d


rows = []
for c in cells:
    a, b = crop(c['live']), crop(c['ref'])
    if a.size == 0 or b.size == 0:
        continue
    raw, d = score(a, b)
    best, bs = raw, (0, 0)
    for dy in range(-6, 7, 2):
        for dx in range(-6, 7, 2):
            s, _ = score(a, b, dx, dy)
            if s < best:
                best, bs = s, (dx / S, dy / S)
    dw = round(c['live']['w'] - c['ref']['w'], 1)
    dh = round(c['live']['h'] - c['ref']['h'], 1)
    rows.append((raw, best, bs, dw, dh, c, a, b, d))

rows.sort(key=lambda r: -r[0])
out.mkdir(parents=True, exist_ok=True)
for raw, best, bs, dw, dh, c, *_ in rows:
    print(f"{raw:5.3f} best {best:5.3f} shift {bs} dsize {dw:+}x{dh:+}  {c['h2'][:28]:28} | {c['cell'][:36]:36} | {c['kit']}")
tiles = []
for raw, best, bs, dw, dh, c, a, b, d in rows[:top]:
    h = max(a.shape[0], b.shape[0], d.shape[0]) + 8
    tile = np.full((h, a.shape[1] + b.shape[1] + d.shape[1] + 50, 3), 255, np.uint8)
    tile[4:4 + a.shape[0], 4:4 + a.shape[1]] = a
    ox = a.shape[1] + 14
    tile[4:4 + b.shape[0], ox:ox + b.shape[1]] = b
    ox += b.shape[1] + 12
    dm = np.clip(d, 0, 255).astype(np.uint8)
    dd = np.stack([255 - dm[12:-12, 12:-12]] * 3, axis=2)
    tile[4:4 + dd.shape[0], ox:ox + dd.shape[1]] = dd
    tiles.append(Image.fromarray(tile))
if tiles:
    Wm = max(t.width for t in tiles)
    Hm = sum(t.height for t in tiles)
    m = Image.new('RGB', (Wm, Hm), (240, 240, 240))
    y = 0
    for t in tiles:
        m.paste(t, (0, y)); y += t.height
    m.save(out / (png.stem + '-worst.png'))
