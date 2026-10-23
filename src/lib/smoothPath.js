// Rounded polygons with the kit's continuous ("smooth") corners, as an SVG path string.
//
// Every rounded point is a Figma / Sketch style smoothed corner: a circular arc that turns by phi * (1 - smoothing) (phi = how much the
// outline turns at the point, 90 deg for a rectangle corner), joined to the two edges by a cubic Bezier each, which share the rest of
// the turn. The corner takes (1 + smoothing) * r / tan(theta / 2) of each edge (theta = the interior angle), so a 90 deg corner takes
// (1 + smoothing) * r. It works at any angle: arrow bases and tips get it too. smoothing 0 gives plain circular arcs.
//
// Neighbouring points share the edge between them. When their tangents do not fit, both are scaled down together; a point then loses
// smoothing first and only then radius (Figma's rule: the radius is the last thing to give).
//
// pts: [[x, y, r], ...] clockwise or anti-clockwise, r = 0 keeps a sharp point.

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

export function smoothPolygonPath(pts, smoothing = 0.6) {
  const n = pts.length
  if (n < 3) return ''
  const s = clamp(smoothing, 0, 1)
  const f = (k) => +k.toFixed(3)
  const g = pts.map(([x, y, r], i) => {
    const [px, py] = pts[(i + n - 1) % n], [nx, ny] = pts[(i + 1) % n]
    let ix = x - px, iy = y - py, ox = nx - x, oy = ny - y
    const li = Math.hypot(ix, iy), lo = Math.hypot(ox, oy)
    if (!li || !lo) return { x, y, r: 0, L: 0, lo }
    ix /= li; iy /= li; ox /= lo; oy /= lo
    const phi = Math.acos(clamp(ix * ox + iy * oy, -1, 1)) // how much the outline turns here
    const cross = ix * oy - iy * ox
    const t = Math.tan(phi / 2)
    const ok = r > 0 && phi > 1e-4 && phi < Math.PI - 1e-3 && cross !== 0
    return { x, y, r, ix, iy, phi, cross, t, lo, L: ok ? (1 + s) * r * t : 0 }
  })
  const fit = g.map(() => 1)
  g.forEach((p, i) => {
    const j = (i + 1) % n, need = p.L + g[j].L
    if (need > p.lo) { const k = p.lo / need; fit[i] = Math.min(fit[i], k); fit[j] = Math.min(fit[j], k) }
  })
  let d = ''
  g.forEach((p, i) => {
    const cmd = i ? 'L' : 'M'
    if (!p.L) { d += `${cmd}${f(p.x)},${f(p.y)}`; return }
    const B = p.L * fit[i] // tangent length this point may use
    let xi = s, r = p.r
    if ((1 + xi) * r * p.t > B) { xi = Math.max(0, B / (r * p.t) - 1); if (xi === 0 && r * p.t > B) r = B / p.t }
    const L = (1 + xi) * r * p.t
    // local frame: origin at the start S of the corner, x along the incoming edge, y towards the side the outline turns to
    const sg = Math.sign(p.cross), ex = p.ix, ey = p.iy, px = -ey * sg, py = ex * sg
    const Sx = p.x - ex * L, Sy = p.y - ey * L
    const W = ([u, v]) => [Sx + u * ex + v * px, Sy + u * ey + v * py]
    const sweep = p.cross > 0 ? 1 : 0
    const E = W([L + L * Math.cos(p.phi), L * Math.sin(p.phi)])
    d += `${cmd}${f(Sx)},${f(Sy)}`
    if (xi < 1e-3) { d += `A${f(r)},${f(r)} 0 0 ${sweep} ${f(E[0])},${f(E[1])}`; return }
    const beta = (p.phi * xi) / 2, phia = p.phi * (1 - xi)
    const h = r * Math.tan(beta / 2), c = h * Math.cos(beta), dd = h * Math.sin(beta)
    const k = r * Math.tan(phia / 2)
    const sh = Math.sin(p.phi / 2), ch = Math.cos(p.phi / 2) // bisector n = (-sh, ch) through the vertex V = (L, 0)
    const m = (dd + k * Math.sin(beta)) / ch
    const x1 = L - m * sh - k * Math.cos(beta)
    const b = (x1 - c) / 3, a = 2 * b
    if (!(b >= 0)) { d += `A${f(r)},${f(r)} 0 0 ${sweep} ${f(E[0])},${f(E[1])}`; return }
    const refl = ([u, v]) => { const du = u - L, dv = v, dot = du * -sh + dv * ch; return [L + 2 * dot * -sh - du, 2 * dot * ch - dv] }
    const P1 = [a, 0], P2 = [a + b, 0], P3 = [x1, dd]
    const Q0 = refl(P3), Q1 = refl(P2), Q2 = refl(P1)
    const pt = (q) => { const w = W(q); return `${f(w[0])},${f(w[1])}` }
    d += `C${pt(P1)} ${pt(P2)} ${pt(P3)}A${f(r)},${f(r)} 0 0 ${sweep} ${pt(Q0)}C${pt(Q1)} ${pt(Q2)} ${f(E[0])},${f(E[1])}`
  })
  return d + 'Z'
}

/** A rounded rectangle with smooth corners (SVG path, usable for an <svg> shape or `clip-path: path('…')`). */
export function smoothRectPath(w, h, r, smoothing = 0.6) {
  if (!(w > 0) || !(h > 0)) return ''
  return smoothPolygonPath([[0, 0, r], [w, 0, r], [w, h, r], [0, h, r]], smoothing)
}
