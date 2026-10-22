<script setup>
import { computed, ref } from 'vue'
import { groupsByCategory } from '../kit.js'
import { href, route } from '../router.js'
import { library } from '../showcase/registry.js'

const q = ref('')
const open = ref(new Set())
const foundations = [
  ['colors', 'Colors'], ['typography', 'Typography'], ['glass', 'Glass'], ['layout', 'Spacing, radii, shadows'], ['motion', 'Motion'], ['lab', 'Animation Lab'],
]
const cats = computed(() => {
  const query = q.value.trim().toLowerCase()
  const out = []
  for (const [cat, groups] of groupsByCategory) {
    const list = query ? groups.filter((g) => g.label.toLowerCase().includes(query) || cat.toLowerCase().includes(query)) : groups
    if (list.length) out.push({ cat, groups: list })
  }
  return out
})
const isOpen = (cat) => q.value.trim() || open.value.has(cat) || route.value.parts[1] === cat
const toggle = (cat) => {
  const s = new Set(open.value)
  s.has(cat) ? s.delete(cat) : s.add(cat)
  open.value = s
}
const active = (...parts) => route.value.path === '/' + parts.join('/')
</script>

<template>
  <aside class="side">
    <a class="brand" :href="href()"><b>Silica</b> UI Kit <small>Amalfi 1.0</small></a>
    <input v-model="q" type="search" placeholder="Search components" />
    <nav>
      <div class="label">Library <small>live components</small></div>
      <a v-for="e in library" :key="e.key" :href="href('lib', e.key)" :class="{ on: active('lib', e.key) }">{{ e.title }}</a>
      <div class="label">Foundations</div>
      <a v-for="[k, name] in foundations" :key="k" :href="href(k)" :class="{ on: active(k) }">{{ name }}</a>
      <div class="label">Kit <small>Sketch renders</small></div>
      <div v-for="{ cat, groups } in cats" :key="cat">
        <button class="cat" @click="toggle(cat)"><span>{{ isOpen(cat) ? '▾' : '▸' }}</span> {{ cat }} <small>{{ groups.length }}</small></button>
        <div v-if="isOpen(cat)" class="items">
          <a v-for="g in groups" :key="g.key" :href="href('components', cat, g.label)" :class="{ on: active('components', cat, g.label) }">{{ g.label }}</a>
        </div>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.side { width: 264px; flex: none; height: 100%; overflow: auto; background: var(--panel); border-right: 1px solid var(--line); padding: 16px 12px 32px; display: flex; flex-direction: column; gap: 12px; }
.brand { color: var(--text); font-size: 15px; padding: 0 8px; } .brand small { color: var(--muted); margin-left: 4px; }
input { width: 100%; }
nav { display: flex; flex-direction: column; gap: 1px; }
.label small { text-transform: none; letter-spacing: 0; font-weight: 400; margin-left: 4px; }
.label { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted); padding: 14px 8px 4px; }
a, .cat { display: flex; align-items: center; gap: 6px; padding: 5px 8px; border-radius: 7px; color: var(--text); border: 0; background: transparent; text-align: left; width: 100%; }
a:hover, .cat:hover { background: var(--bg); }
a.on { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
.cat span { width: 10px; color: var(--muted); font-size: 10px; } .cat small { margin-left: auto; color: var(--muted); }
.items { display: flex; flex-direction: column; margin: 1px 0 4px 16px; border-left: 1px solid var(--line); padding-left: 6px; }
</style>
