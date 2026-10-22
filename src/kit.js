import index from '../kit/index.json'

const loaders = import.meta.glob('../kit/*.json', { import: 'default' })

export const symbols = index.symbols
export const categories = [...new Set(symbols.map((s) => s.category))]

const byName = new Map(symbols.map((s) => [s.name, s]))
const nameBySymbolId = new Map(symbols.map((s) => [s.symbolId, s.name]))
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
