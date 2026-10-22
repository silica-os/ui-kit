#!/bin/sh
# usage: tools/audit/run.sh <slug> [light|dark]
# Expects the built app served on http://localhost:${AUDIT_PORT:-6120}; AUDIT_OUT picks the output dir (default /tmp/audit);
# PY must be a python with numpy and pillow; TOP = number of worst cells in the montage.
# Needs: swiftc -O tools/audit/snapaudit.swift -o /tmp/snapaudit ; the reference venv for numpy/pillow.
set -e
here=$(cd "$(dirname "$0")" && pwd)
slug=$1; theme=${2:-light}
out=${AUDIT_OUT:-/tmp/audit}; mkdir -p "$out"
cat "$here/setup.js" > "$out/setup-$theme.js"
sed -i '' "s|return 1|;[...document.querySelectorAll('.seg button')].find((b) => b.textContent.trim().toLowerCase() === '$theme')?.click(); return 1|" "$out/setup-$theme.js"
/tmp/snapaudit "http://localhost:${AUDIT_PORT:-6120}/#/lib/$slug" "$out/$slug-$theme.png" 1300 "$out/setup-$theme.js" "$here/measure.js"
${PY:-python3} "$here/analyze.py" "$out/$slug-$theme.png" "$out/$slug-$theme.png.json" "$out" --top ${TOP:-8}
