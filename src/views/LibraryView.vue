<script setup>
import { computed } from 'vue'
import { pages } from '../showcase/pages.js'
import { theme } from '../showcase/theme.js'
import { groupByKey, groupsByCategory } from '../kit.js'
import { href } from '../router.js'
import DocPart from '../showcase/DocPart.vue'

const props = defineProps({ page: String })
const entry = computed(() => pages.find((p) => p.slug === props.page))

const kitLinks = computed(() => {
  const out = []
  for (const k of entry.value?.kit ?? []) {
    const [cat, comp] = k.split('/')
    const groups = comp === '*' ? groupsByCategory.get(cat) ?? [] : [groupByKey.get(k)].filter(Boolean)
    for (const g of groups) out.push({ label: g.label, to: href('components', g.category, g.label) })
  }
  return out
})
</script>

<template>
  <div v-if="entry" class="page">
    <header>
      <h1>{{ entry.name }}</h1>
      <div class="seg" role="group" aria-label="Preview theme">
        <button :class="{ on: theme === 'light' }" @click="theme = 'light'">Light</button>
        <button :class="{ on: theme === 'dark' }" @click="theme = 'dark'">Dark</button>
      </div>
    </header>
    <p v-if="kitLinks.length" class="kit">
      <span class="label">Sketch renders</span>
      <a v-for="l in kitLinks" :key="l.to" class="chip" :href="l.to">{{ l.label }}</a>
    </p>
    <DocPart v-for="(part, i) in entry.parts" :key="i" :doc="part.doc" :include="part.include ?? null" />
  </div>
  <div v-else class="page"><h1>Not found</h1></div>
</template>

<style scoped>
.page { padding: 36px; max-width: 1100px; }
header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.kit { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 10px 0 18px; }
.kit .label { margin-right: 4px; }
.chip { padding: 2px 10px; border-radius: 99px; border: 1px solid var(--line); background: var(--panel); color: var(--text); font-size: 12px; }
.chip:hover { border-color: var(--accent); }
</style>
