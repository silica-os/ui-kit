/**
 * The outline of the Dock's callouts (label bubble, tile menu) as ONE path, like the kit's ShapePath: a rounded rectangle of
 * w x (h - arrow) with a 12 x 6 arrow (corner radii 3 at the base, 2 at the tip) centred under it at `ax`.
 * Kit: label 64x34 (radius 8, arrow 26..38), menu 200x110 (radius 12, arrow 94..106).
 */
export const ARROW_W = 12
export const ARROW_H = 6

export function calloutPath(w, h, r = 8, ax = w / 2) {
  const b = h - ARROW_H
  const hw = ARROW_W / 2
  const pts = [
    [0, 0, r], [w, 0, r], [w, b, r],
    [ax + hw, b, 3], [ax, h, 2], [ax - hw, b, 3],
    [0, b, r],
  ]
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const [x, y, rad] = pts[i]
    const [px, py] = pts[(i + n - 1) % n]
    const [nx, ny] = pts[(i + 1) % n]
    const lp = Math.hypot(px - x, py - y), ln = Math.hypot(nx - x, ny - y)
    const dist = Math.min(rad, lp / 2, ln / 2)
    const a = [x + ((px - x) / lp) * dist, y + ((py - y) / lp) * dist]
    const c = [x + ((nx - x) / ln) * dist, y + ((ny - y) / ln) * dist]
    d += `${i ? 'L' : 'M'}${a[0].toFixed(2)},${a[1].toFixed(2)}Q${x},${y} ${c[0].toFixed(2)},${c[1].toFixed(2)}`
  }
  return d + 'Z'
}
