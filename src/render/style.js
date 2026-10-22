const WEIGHT = { 0: 100, 1: 200, 2: 300, 3: 300, 4: 400, 5: 400, 6: 500, 7: 500, 8: 600, 9: 700, 10: 800, 11: 900 }

function gradient(g) {
  const { type, from, to, stops } = g
  const list = stops.map(([p, c]) => `${c} ${(p * 100).toFixed(1)}%`).join(', ')
  if (type === 'Radial') {
    const r = Math.hypot(to.x - from.x, to.y - from.y) * 100
    return `radial-gradient(circle ${r.toFixed(1)}% at ${from.x * 100}% ${from.y * 100}%, ${list})`
  }
  if (type === 'Angular') return `conic-gradient(from 0deg at ${from.x * 100}% ${from.y * 100}%, ${list})`
  const deg = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI + 90
  return `linear-gradient(${deg.toFixed(1)}deg, ${list})`
}

export const fillImage = (f) => (f.gradient ? gradient(f.gradient) : null)
export const fillColor = (f) => f.color

export function radius(corners, w, h) {
  const r = corners.radii || []
  if (!r.length) return undefined
  const max = Math.min(w, h) / 2
  return r.map((v) => `${Math.min(v, max)}px`).join(' ')
}

/** Common visual style of a node as CSS properties. `ov` is the colour overrides of this node. */
export function boxStyle(node, ov = {}) {
  const st = node.style
  const css = {}
  if (st.opacity !== 1) css.opacity = st.opacity
  const fills = st.fills.map((f, i) => (i === 0 && ov['color:fill-0'] ? { color: ov['color:fill-0'] } : f))
  const layers = [...fills].reverse()
  const images = layers.map((f) => fillImage(f) || `linear-gradient(${f.color}, ${f.color})`)
  if (images.length) css.background = images.join(', ')
  const shadows = []
  st.borders.forEach((b, i) => {
    const color = i === 0 && ov['color:border-0'] ? ov['color:border-0'] : b.color
    if (b.position === 'Inside') shadows.push(`inset 0 0 0 ${b.thickness}px ${color}`)
    else if (b.position === 'Outside') shadows.push(`0 0 0 ${b.thickness}px ${color}`)
    else shadows.push(`0 0 0 ${b.thickness / 2}px ${color}`, `inset 0 0 0 ${b.thickness / 2}px ${color}`)
  })
  st.innerShadows.forEach((s) => shadows.push(`inset ${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`))
  st.shadows.forEach((s) => shadows.push(`${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`))
  if (shadows.length) css.boxShadow = shadows.join(', ')
  const blur = st.blurs[0]
  if (blur) {
    const f = [`blur(${blur.radius}px)`]
    if (blur.saturation != null && blur.saturation !== 1) f.push(`saturate(${blur.saturation})`)
    if (blur.brightness != null && blur.brightness !== 1) f.push(`brightness(${blur.brightness})`)
    css.backdropFilter = css.WebkitBackdropFilter = f.join(' ')
  }
  return css
}

export function textStyle(node, ov = {}) {
  const f = node.font
  const css = {
    fontFamily: f.family === 'Silica Symbols' ? `'Silica Symbols'` : `'${f.family}', system-ui, sans-serif`,
    fontSize: `${f.size}px`,
    fontWeight: f.family === 'Silica Symbols' ? WEIGHT[f.weight] : WEIGHT[f.weight] || 400,
    lineHeight: f.lineHeight ? `${f.lineHeight}px` : 'normal',
    color: ov.textColor || f.color,
    textAlign: { 0: 'left', 1: 'right', 2: 'center', 3: 'justify', left: 'left', right: 'right', center: 'center', justify: 'justify' }[f.align] || 'left',
    whiteSpace: node.fixedWidth ? 'pre-wrap' : 'pre',
    fontFeatureSettings: f.family === 'Silica Symbols' ? `'liga'` : undefined,
  }
  if (f.kerning) css.letterSpacing = `${f.kerning}px`
  return css
}

export const justify = (v) => ({ top: 'flex-start', 0: 'flex-start', center: 'center', 1: 'center', bottom: 'flex-end', 2: 'flex-end' })[v] || 'flex-start'

export function treeHasBlur(node) {
  if (node.type === 'Cross') return treeHasBlur(node.a) || treeHasBlur(node.b)
  return (node.style && node.style.blurs.length > 0) || (node.children || []).some(treeHasBlur)
}

/** Stage background: flat, or a colourful striped backdrop when the component has blurred (glass) layers. */
export function stageBackground(dark, glass) {
  if (!glass) return dark ? '#1b1c1f' : '#f1f2f4'
  const stripes = dark ? 'repeating-linear-gradient(45deg, #0004 0 12px, #fff1 12px 24px)' : 'repeating-linear-gradient(45deg, #0000000d 0 12px, #ffffff40 12px 24px)'
  const grad = dark ? 'linear-gradient(135deg, #3a1d6e, #0b2a55 50%, #064b4a)' : 'linear-gradient(135deg, #ffd29c, #f7a6cb 40%, #8ec2f5 70%, #9fe0b5)'
  return `${stripes}, ${grad}`
}
