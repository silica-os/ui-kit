// Colour helpers for the wells and the colour panel. Colours travel as "#RRGGBB" (or "#RRGGBBAA") strings.
const h2 = (n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0').toUpperCase()

export function rgbToHex(r, g, b, a = 1) {
  return `#${h2(r)}${h2(g)}${h2(b)}${a < 1 ? h2(a * 255) : ''}`
}

/** "#RGB", "#RRGGBB", "#RRGGBBAA" (with or without #) to [r, g, b, a], or null when it is not a colour. */
export function parseHex(s) {
  let v = String(s ?? '').trim().replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(v)) v = v.replace(/./g, (c) => c + c)
  if (!/^([0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return null
  const n = (i) => parseInt(v.slice(i, i + 2), 16)
  return [n(0), n(2), n(4), v.length === 8 ? n(6) / 255 : 1]
}

/** Any CSS colour (including var(--token)) to a hex string, resolved in the context of `el`. */
export function resolveColor(el, css) {
  const hex = parseHex(css)
  if (hex) return rgbToHex(...hex)
  const probe = document.createElement('span')
  probe.style.color = css
  ;(el || document.body).appendChild(probe)
  const m = getComputedStyle(probe).color.match(/[\d.]+/g)
  probe.remove()
  if (!m) return '#000000'
  return rgbToHex(+m[0], +m[1], +m[2], m[3] === undefined ? 1 : +m[3])
}

/** Calls `cb` whenever the page theme flips (data-theme on <html>); returns the function that stops listening. */
export function watchTheme(cb) {
  if (typeof MutationObserver === 'undefined') return () => {}
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => mo.disconnect()
}

export function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b)
  const d = max - Math.min(r, g, b)
  let h = 0
  if (d) h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return { h: h * 60, s: max ? d / max : 0, v: max }
}

export function hsvToHex(h, s, v) {
  const f = (n) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)) }
  return rgbToHex(f(5) * 255, f(3) * 255, f(1) * 255)
}
