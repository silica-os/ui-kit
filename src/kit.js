import index from '../kit/index.json'
import deps from '../kit/deps.json'

const loaders = import.meta.glob('../kit/*.json', { import: 'default' })

const all = index.symbols
/** Public symbols; internal ones (embedded by other components) stay loadable but are not listed. */
export const symbols = all.filter((s) => !s.internal)
export const categories = [...new Set(symbols.map((s) => s.category))]

const byName = new Map(all.map((s) => [s.name, s]))
const nameBySymbolId = new Map(all.map((s) => [s.symbolId, s.name]))
const registry = new Map()
const loading = new Map()

function loadCategory(cat) {
  if (!loading.has(cat)) {
    loading.set(
      cat,
      loaders[`../kit/${cat}.json`]().then((bundle) => {
        for (const [name, master] of Object.entries(bundle)) registry.set(name, master)
      }),
    )
  }
  return loading.get(cat)
}

function instances(node, out) {
  if (node.type === 'SymbolInstance') {
    if (node.master) out.push(node.master)
    for (const o of node.overrides) if (o.property === 'symbolID' && nameBySymbolId.has(o.value)) out.push(nameBySymbolId.get(o.value))
  }
  for (const c of node.children || []) instances(c, out)
}

/** Loads a master and every master it nests, so rendering can stay synchronous. */
export async function ensureMaster(name, seen = new Set()) {
  if (seen.has(name) || !byName.has(name)) return
  seen.add(name)
  await loadCategory(byName.get(name).category)
  const nested = []
  instances(registry.get(name), nested)
  for (const n of nested) await ensureMaster(n, seen)
}

export const getMaster = (name) => registry.get(name)
export const masterNameBySymbolId = (id) => nameBySymbolId.get(id)

/** "Buttons/Push/Regular/Primary/Rest/Light" -> { group: "Buttons/Push", variant: "Regular / Primary / Rest", appearance: "Light" } */
export function parts(name) {
  const p = name.split('/')
  const appearance = ['Light', 'Dark'].includes(p[p.length - 1]) ? p.pop() : null
  return { group: p.slice(0, 2).join('/'), variant: p.slice(2).join(' / '), appearance }
}

const APPEARANCES = ['Light', 'Dark']

/** Component groups: { category, key: "Buttons/Push", label: "Push", masters: [{ name, rest: [...], appearance }] }. */
export const groups = (() => {
  const map = new Map()
  for (const s of symbols) {
    const p = s.name.split('/')
    const appearance = APPEARANCES.includes(p[p.length - 1]) ? p.pop() : null
    const key = p.length > 2 ? p.slice(0, 2).join('/') : p.join('/')
    const rest = p.length > 2 ? p.slice(2) : []
    if (!map.has(key)) map.set(key, { category: s.category, key, label: p.length > 2 ? p[1] : p[0], masters: [] })
    map.get(key).masters.push({ name: s.name, rest, appearance })
  }
  return [...map.values()]
})()

export const groupsByCategory = (() => {
  const m = new Map()
  for (const g of groups) {
    if (!m.has(g.category)) m.set(g.category, [])
    m.get(g.category).push(g)
  }
  return m
})()

export const groupByKey = new Map(groups.map((g) => [g.key, g]))

export const depsOf = (key) => deps[key] || { uses: {}, usedBy: {} }
