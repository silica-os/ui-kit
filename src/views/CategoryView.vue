<script setup>
import { computed } from 'vue'
import { groupsByCategory, symbols } from '../kit.js'
import { href } from '../router.js'
import KitSymbol from '../render/KitSymbol.vue'

const props = defineProps({ category: String })
const groups = computed(() => groupsByCategory.get(props.category) || [])
const size = new Map(symbols.map((s) => [s.name, s]))
const sample = (g) => g.masters.find((m) => m.rest.includes('Rest') && m.appearance === 'Light') || g.masters.find((m) => m.appearance === 'Light') || g.masters[0]
const scaleOf = (name) => {
  const s = size.get(name)
  return Math.min(1, 220 / s.w, 130 / s.h)
}
</script>

<template>
  <div class="page">
    <h1>{{ category }}</h1>
    <p class="muted">{{ groups.length }} components</p>
    <div class="grid">
      <a v-for="g in groups" :key="g.key" class="card tile" :href="href('components', category, g.label)">
        <div class="thumb"><KitSymbol :name="sample(g).name" :scale="scaleOf(sample(g).name)" :padding="12" /></div>
        <b>{{ g.label }}</b>
        <span class="muted">{{ g.masters.length }} variants</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.page { padding: 36px; max-width: 1200px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-top: 20px; }
.tile { display: flex; flex-direction: column; gap: 2px; padding: 12px; color: var(--text); }
.tile:hover { border-color: var(--accent); }
.thumb { height: 170px; display: grid; place-items: center; overflow: hidden; border-radius: 10px; background: var(--bg); margin-bottom: 8px; }
.tile span { font-size: 12px; }
</style>
