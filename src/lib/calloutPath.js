// One closed outline for a bubble with an optional arrow, as the kit draws it (Popovers/Popover/*): a rectangle polygon whose
// arrow edge is split into base / tip / base points, every point rounded with its own radius (corner 16, arrow base 4, tip 3).
// edge: 'none' | 'top' | 'bottom' | 'leading' | 'trailing' (the edge that carries the arrow; the arrow adds `ah` to that side).
// pos: distance of the arrow tip from the start of that edge, or 'start' | 'center' | 'end' (kit: 30 pt from the nearer corner).
export function calloutPath({ w, h, radius = 16, edge = 'none', pos = 'center', aw = 20, ah = 8, ar = 4, tr = 3, ox = 0, oy = 0 }) {
  if (!(w > 0) || !(h > 0)) return ''
  const hasArrow = edge !== 'none' && ah > 0
  const horiz = edge === 'top' || edge === 'bottom'
  const x0 = hasArrow && edge === 'leading' ? ah : 0
  const y0 = hasArrow && edge === 'top' ? ah : 0
  const bw = w - (hasArrow && !horiz ? ah : 0)
  const bh = h - (hasArrow && horiz ? ah : 0)
  const R = Math.min(radius, bw / 2, bh / 2)
  const len = horiz ? bw : bh
  const lo = R + aw / 2
  let c = pos === 'start' ? 30 : pos === 'end' ? len - 30 : pos === 'center' ? len / 2 : +pos
  c = Math.max(lo, Math.min(len - lo, c))
  const x1 = x0 + bw, y1 = y0 + bh
  // clockwise from the top-left corner: [x, y, radius]
  const v = []
  const arrow = (dir, mk) => { // dir 1 reads the edge along the clockwise direction, -1 against it
    const pts = [[c - aw / 2, ar, 0], [c, tr, ah], [c + aw / 2, ar, 0]]
    if (dir < 0) pts.reverse()
    pts.forEach(([t, r, out]) => v.push(mk(t, r, out)))
  }
  const ARROWED = (e) => hasArrow && edge === e
  v.push([x0, y0, R])
  if (ARROWED('top')) arrow(1, (t, r, o) => [x0 + t, y0 - o, r])
  v.push([x1, y0, R])
  if (ARROWED('trailing')) arrow(1, (t, r, o) => [x1 + o, y0 + t, r])
  v.push([x1, y1, R])
  if (ARROWED('bottom')) arrow(-1, (t, r, o) => [x0 + t, y1 + o, r])
  v.push([x0, y1, R])
  if (ARROWED('leading')) arrow(-1, (t, r, o) => [x0 - o, y0 + t, r])
  v.forEach((p) => { p[0] += ox; p[1] += oy })
  const n = v.length
  const f = (k) => +k.toFixed(3)
  // per point: unit vectors to the neighbours, the tangent length d the radius asks for (r / tan(theta / 2))
  const geo = v.map(([x, y, r], i) => {
    const [px, py] = v[(i + n - 1) % n], [nx, ny] = v[(i + 1) % n]
    let ax = px - x, ay = py - y, bx = nx - x, by = ny - y
    const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by)
    ax /= la; ay /= la; bx /= lb; by /= lb
    const theta = Math.acos(Math.max(-1, Math.min(1, ax * bx + ay * by)))
    const tn = Math.tan(theta / 2)
    return { x, y, r, ax, ay, bx, by, la, lb, tn, d: r > 0 && tn > 0 ? r / tn : 0, cross: (x - px) * (ny - y) - (y - py) * (nx - x) }
  })
  // two neighbouring points share the edge between them: when both tangents do not fit, scale them down together (so a corner next to
  // the arrow keeps its full radius as long as the edge has room for both, as in the kit)
  const fit = geo.map(() => 1)
  geo.forEach((g, i) => {
    const nxt = geo[(i + 1) % n], len = g.lb, need = g.d + nxt.d
    if (need > len) { const k = len / need; fit[i] = Math.min(fit[i], k); fit[(i + 1) % n] = Math.min(fit[(i + 1) % n], k) }
  })
  const seg = geo.map((g, i) => {
    const d = g.d * fit[i]
    return { p1: [g.x + g.ax * d, g.y + g.ay * d], p2: [g.x + g.bx * d, g.y + g.by * d], rr: d * g.tn, sweep: g.cross > 0 ? 1 : 0, r: g.r }
  })
  let dstr = ''
  seg.forEach((s, i) => {
    dstr += (i ? 'L' : 'M') + `${f(s.p1[0])},${f(s.p1[1])}`
    if (s.r > 0 && s.rr > 0.01) dstr += `A${f(s.rr)},${f(s.rr)} 0 0 ${s.sweep} ${f(s.p2[0])},${f(s.p2[1])}`
    else dstr += `L${f(s.p2[0])},${f(s.p2[1])}`
  })
  return dstr + 'Z'
}
