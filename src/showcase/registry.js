/** Pages of the live component library: every docs/*Doc.vue, sorted by `export const meta = { title, order }`. */
const modules = import.meta.glob('./docs/*Doc.vue', { eager: true })

export const library = Object.entries(modules)
  .map(([path, m]) => ({ key: path.replace('./docs/', '').replace('Doc.vue', '').toLowerCase(), title: m.meta.title, order: m.meta.order ?? 100, doc: m.default }))
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
