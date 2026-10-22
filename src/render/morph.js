// Tweens between two flattened trees (flatten.js). Same structure -> every number and colour is
// interpolated; where the structure differs the two subtrees are cross-faded.

const lerp = (a, b, p) => a + (b - a) * p

function parseColor(c) {
  const h = c.replace('#', '')
  const f = h.length === 3 || h.length === 4 ? [...h].map((x) => x + x).join('') : h
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16), f.length >= 8 ? parseInt(f.slice(6, 8), 16) / 255 : 1]
}

export function lerpColor(a, b, p) {
  if (a === b) return a
  const x = parseColor(a)
  const y = parseColor(b)
  const ch = (i) => Math.round(Math.min(255, Math.max(0, lerp(x[i], y[i], p))))
  const al = Math.min(1, Math.max(0, lerp(x[3], y[3], p)))
  const hex = (v) => v.toString(16).padStart(2, '0')
  return `#${hex(ch(0))}${hex(ch(1))}${hex(ch(2))}${hex(Math.round(al * 255))}`
}

function lerpFrame(a, b, p) {
  return { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p) }
}

function lerpList(a, b, p, fn, zero) {
  if (a.length === b.length) return a.map((x, i) => fn(x, b[i], p))
  if (!zero) return p < 0.5 ? a : b
  // an entry that exists on one side only fades in or out
  return Array.from({ length: Math.max(a.length, b.length) }, (_, i) => fn(a[i] ?? zero(b[i]), b[i] ?? zero(a[i]), p))
}
const clear = (c) => c.slice(0, 7) + '00'
const zeroFill = (f) => (f.color ? { ...f, color: clear(f.color) } : { gradient: { ...f.gradient, stops: f.gradient.stops.map(([pos, c]) => [pos, clear(c)]) } })
const zeroBorder = (b) => ({ ...b, color: clear(b.color) })
const zeroShadow = (s) => ({ ...s, color: clear(s.color) })

const lerpFill = (a, b, p) => {
  if (a.color && b.color) return { ...a, color: lerpColor(a.color, b.color, p) }
  if (a.gradient && b.gradient && a.gradient.stops.length === b.gradient.stops.length) {
    return {
      gradient: {
        ...a.gradient,
        from: { x: lerp(a.gradient.from.x, b.gradient.from.x, p), y: lerp(a.gradient.from.y, b.gradient.from.y, p) },
        to: { x: lerp(a.gradient.to.x, b.gradient.to.x, p), y: lerp(a.gradient.to.y, b.gradient.to.y, p) },
        stops: a.gradient.stops.map(([pos, c], i) => [lerp(pos, b.gradient.stops[i][0], p), lerpColor(c, b.gradient.stops[i][1], p)]),
      },
    }
  }
  return p < 0.5 ? a : b
}
const lerpBorder = (a, b, p) => ({ ...a, color: lerpColor(a.color, b.color, p), thickness: lerp(a.thickness, b.thickness, p) })
const lerpShadow = (a, b, p) => ({ color: lerpColor(a.color, b.color, p), x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), blur: lerp(a.blur, b.blur, p), spread: lerp(a.spread, b.spread, p) })
const lerpBlur = (a, b, p) => ({ ...a, radius: lerp(a.radius, b.radius, p), saturation: lerp(a.saturation ?? 1, b.saturation ?? 1, p) })

function lerpStyle(a, b, p) {
  const ra = a.corners.radii
  const rb = b.corners.radii
  return {
    ...a,
    opacity: lerp(a.opacity, b.opacity, p),
    fills: lerpList(a.fills, b.fills, p, lerpFill, zeroFill),
    borders: lerpList(a.borders, b.borders, p, lerpBorder, zeroBorder),
    shadows: lerpList(a.shadows, b.shadows, p, lerpShadow, zeroShadow),
    innerShadows: lerpList(a.innerShadows, b.innerShadows, p, lerpShadow, zeroShadow),
    blurs: lerpList(a.blurs, b.blurs, p, lerpBlur),
    corners: { ...a.corners, radii: ra.length === rb.length ? ra.map((v, i) => lerp(v, rb[i], p)) : p < 0.5 ? ra : rb },
  }
}

export function compatible(a, b) {
  if (a.type !== b.type) return false
  if (a.type === 'ShapePath') return a.shapeType === b.shapeType && (a.shapeType !== 'Custom' || a.svg === b.svg)
  if (a.type === 'Group') {
    const ca = a.children || []
    const cb = b.children || []
    return ca.length === cb.length
  }
  return true
}

export function morph(a, b, p) {
  if (p === 0) return a
  if (p === 1) return b
  if (!compatible(a, b)) return { type: 'Cross', a, b, t: Math.min(1, Math.max(0, p)), frame: lerpFrame(a.frame, b.frame, p) }
  const out = { ...a, frame: lerpFrame(a.frame, b.frame, p), style: lerpStyle(a.style, b.style, p) }
  if (a.type === 'Group') {
    out.children = a.children.map((c, i) => morph(c, b.children[i], p))
    if (a.scale || b.scale) {
      const sa = a.scale || [1, 1]
      const sb = b.scale || [1, 1]
      out.scale = [lerp(sa[0], sb[0], p), lerp(sa[1], sb[1], p)]
    }
  } else if (a.type === 'Text') {
    out.text = p < 0.5 ? a.text : b.text
    out.font = { ...a.font, size: lerp(a.font.size, b.font.size, p), color: lerpColor(a.font.color, b.font.color, p) }
  }
  return out
}

/** Property changes between two flattened trees, for the transition table. */
export function diff(a, b, path = '', out = []) {
  const here = path === '' ? 'Root' : path === 'Root' ? a.name : `${path} › ${a.name}`
  if (!compatible(a, b)) {
    out.push({ node: here, prop: 'structure', from: a.type, to: b.type })
    return out
  }
  for (const k of ['x', 'y', 'w', 'h']) if (Math.abs(a.frame[k] - b.frame[k]) > 0.001) out.push({ node: here, prop: k, from: round(a.frame[k]), to: round(b.frame[k]) })
  if (Math.abs(a.style.opacity - b.style.opacity) > 0.001) out.push({ node: here, prop: 'opacity', from: round(a.style.opacity), to: round(b.style.opacity) })
  for (const key of ['fills', 'borders', 'shadows', 'innerShadows', 'blurs']) {
    const la = a.style[key]
    const lb = b.style[key]
    if (JSON.stringify(la) === JSON.stringify(lb)) continue
    const name = { fills: 'fill', borders: 'border', shadows: 'shadow', innerShadows: 'inner shadow', blurs: 'blur' }[key]
    if (la.length !== lb.length) out.push({ node: here, prop: name, from: summary(key, la), to: summary(key, lb) })
    else la.forEach((x, i) => {
      if (JSON.stringify(x) !== JSON.stringify(lb[i])) out.push({ node: here, prop: `${name} ${i}`, from: summary(key, [x]), to: summary(key, [lb[i]]) })
    })
  }
  if (JSON.stringify(a.style.corners.radii) !== JSON.stringify(b.style.corners.radii)) out.push({ node: here, prop: 'radius', from: a.style.corners.radii.join(' ') || '0', to: b.style.corners.radii.join(' ') || '0' })
  if (a.type === 'Text') {
    if (a.font.color !== b.font.color) out.push({ node: here, prop: 'text color', from: a.font.color, to: b.font.color })
    if (a.text !== b.text) out.push({ node: here, prop: 'text', from: a.text, to: b.text })
  }
  if (a.type === 'Group') a.children.forEach((c, i) => diff(c, b.children[i], here, out))
  return out
}

const round = (v) => Math.round(v * 100) / 100
function summary(key, list) {
  if (!list.length) return 'none'
  return list.map((x) => {
    if (key === 'fills') return x.color || 'gradient'
    if (key === 'borders') return `${x.color} ${x.thickness}`
    if (key === 'blurs') return `blur ${x.radius}`
    return `${x.color} ${x.x},${x.y} blur ${x.blur}`
  }).join(' + ')
}
