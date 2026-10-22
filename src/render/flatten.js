import { getMaster, masterNameBySymbolId } from '../kit.js'
import codepoints from '../../tokens/symbol-codepoints.json'

const cache = new Map()
const EMPTY = { opacity: 1, fills: [], borders: [], shadows: [], innerShadows: [], blurs: [], corners: { radii: [] } }
/** Resizing rules of a layer inside its parent (see tools/export-masters.js). */
const flags = (n) => ({ hs: n.hs, vs: n.vs, hp: n.hp, vp: n.vp, ignore: n.ignore })
const falsy = (v) => v === '0' || v === 'false'

function overridesOf(node, ovs) {
  const own = {}
  for (const o of ovs) if (o.path === node.id) own[o.property] = o.value
  return own
}

function flattenList(list, ovs) {
  return list.map((c) => flattenNode(c, ovs)).filter(Boolean)
}

function flattenNode(n, ovs) {
  const own = overridesOf(n, ovs)
  if (falsy(own.isVisible)) return null
  if (n.type === 'Text') {
    let text = own.stringValue ?? n.text
    if (n.font.family === 'Silica Symbols' && codepoints[text]) text = String.fromCodePoint(parseInt(codepoints[text], 16))
    return { ...n, text, font: { ...n.font, color: own.textColor || n.font.color } }
  }
  if (n.type === 'ShapePath') {
    const f0 = own['color:fill-0']
    const b0 = own['color:border-0']
    if (!f0 && !b0) return n
    return {
      ...n,
      style: {
        ...n.style,
        fills: n.style.fills.map((f, i) => (i === 0 && f0 ? { color: f0 } : f)),
        borders: n.style.borders.map((b, i) => (i === 0 && b0 ? { ...b, color: b0 } : b)),
      },
    }
  }
  if (n.type === 'Group') return { ...n, children: flattenList(n.children, ovs) }
  if (n.type === 'SymbolInstance') {
    let name = n.master
    if (own.symbolID) name = masterNameBySymbolId(own.symbolID) || name
    const master = name && getMaster(name)
    if (!master) return { type: 'Group', name: n.name, frame: n.frame, style: EMPTY, children: [], ...flags(n) }
    const nested = [...n.overrides, ...ovs.filter((o) => o.path.startsWith(n.id + '/')).map((o) => ({ ...o, path: o.path.slice(n.id.length + 1) }))]
    return {
      type: 'Group', name: n.name, component: name, frame: n.frame, orig: master.frame, stack: master.stack, style: master.style,
      transform: n.transform, ...flags(n),
      children: flattenList(master.children, nested),
    }
  }
  return n
}

/** A master as a plain tree: nested symbols inlined, overrides applied, hidden layers dropped. */
export function flattenMaster(name) {
  if (cache.has(name)) return cache.get(name)
  const m = getMaster(name)
  if (!m) return null
  const frame = { x: 0, y: 0, w: m.frame.w, h: m.frame.h }
  const tree = { type: 'Group', name, frame, orig: frame, stack: m.stack, style: m.style, children: flattenList(m.children, []) }
  cache.set(name, tree)
  return tree
}
