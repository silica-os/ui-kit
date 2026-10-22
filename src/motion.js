// Motion maths shared by the token pages and the Animation Lab. The Rust twin is rust/silica_motion.rs:
// keep both in step, they must give the same numbers.

/** Progress 0 -> 1 of a spring (mass 1, response in s, damping ratio) released from rest. */
export function springProgress(t, { response, dampingRatio: z }) {
  if (t <= 0) return 0
  const w = (2 * Math.PI) / response
  if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z)
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t))
  }
  if (z === 1) return 1 - Math.exp(-w * t) * (1 + w * t)
  const s = w * Math.sqrt(z * z - 1)
  const r1 = -z * w + s
  const r2 = -z * w - s
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1)
}

export const springStiffness = ({ response }) => (2 * Math.PI / response) ** 2
export const springDamping = (s) => 2 * s.dampingRatio * Math.sqrt(springStiffness(s))

/** CSS cubic-bezier(x1, y1, x2, y2): progress for time fraction x in 0..1 (Newton + bisection). */
export function bezierProgress(x, [x1, y1, x2, y2]) {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const sx = (t) => ((ax * t + bx) * t + cx) * t
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx
  let t = x
  for (let i = 0; i < 8; i++) {
    const e = sx(t) - x
    if (Math.abs(e) < 1e-6) return ((ay * t + by) * t + cy) * t
    const d = dx(t)
    if (Math.abs(d) < 1e-6) break
    t -= e / d
  }
  let lo = 0
  let hi = 1
  t = x
  while (lo < hi) {
    const e = sx(t)
    if (Math.abs(e - x) < 1e-6) break
    if (x > e) lo = t
    else hi = t
    t = (hi - lo) / 2 + lo
    if (hi - lo < 1e-7) break
  }
  return ((ay * t + by) * t + cy) * t
}

/** driver: { kind: 'spring', response, dampingRatio } | { kind: 'bezier', duration (ms), curve: [4] } */
export function progress(driver, ms) {
  if (driver.kind === 'spring') return springProgress(ms / 1000, driver)
  return bezierProgress(ms / driver.duration, driver.curve)
}

/** Time (ms) after which the value stays within 0.5 % of the target, and the peak overshoot in %. */
export function metrics(driver, horizon = 3000) {
  let settle = 0
  let peak = 0
  for (let ms = 0; ms <= horizon; ms += 2) {
    const p = progress(driver, ms)
    peak = Math.max(peak, p)
    if (Math.abs(p - 1) > 0.005) settle = ms
  }
  return { settleMs: settle + 2, overshootPct: Math.max(0, (peak - 1) * 100) }
}

export function curvePath(driver, w, h, horizon, pad = 8) {
  const pts = []
  const lo = -0.1
  const hi = 1.4
  for (let ms = 0; ms <= horizon; ms += horizon / 160) {
    const p = progress(driver, ms)
    const x = pad + (ms / horizon) * (w - 2 * pad)
    const y = h - pad - ((p - lo) / (hi - lo)) * (h - 2 * pad)
    pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join('')
}

/** CSS easing for any driver over `ms`: cubic-bezier() as is, a spring as a sampled linear() function. */
export function cssEasing(driver, ms) {
  if (driver.kind === 'bezier') return `cubic-bezier(${driver.curve.join(',')})`
  const n = 60
  const pts = []
  for (let i = 0; i <= n; i++) pts.push(progress(driver, (i / n) * ms).toFixed(4))
  return `linear(${pts.join(',')})`
}
