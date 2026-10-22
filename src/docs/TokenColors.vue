<script setup>
import { computed, ref } from 'vue'
import tokens from '../../tokens/tokens.json'

const mode = ref('light')
const filter = ref('')
const groups = computed(() => {
  const g = {}
  for (const [k, v] of Object.entries(tokens.colors[mode.value])) {
    if (filter.value && !k.toLowerCase().includes(filter.value.toLowerCase())) continue
    const [group, ...rest] = k.split('/')
    ;(g[group] ||= []).push({ name: rest.join('/'), full: k, hex: v })
  }
  return g
})
const cssVar = (full) => '--' + full.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const copy = (t) => navigator.clipboard?.writeText(t)
</script>

<template>
  <div :class="['colors', mode]">
    <div class="bar">
      <button v-for="m in ['light', 'dark']" :key="m" :class="{ on: mode === m }" @click="mode = m">{{ m }}</button>
      <input v-model="filter" placeholder="Filter tokens" />
    </div>
    <section v-for="(items, group) in groups" :key="group">
      <h3>{{ group }} <small>{{ items.length }}</small></h3>
      <div class="grid">
        <button v-for="c in items" :key="c.full" class="chip" :title="`Copy var(${cssVar(c.full)})`" @click="copy(`var(${cssVar(c.full)})`)">
          <span class="sw"><i :style="{ background: c.hex }" /></span>
          <b>{{ c.name }}</b>
          <code>{{ c.hex }}</code>
          <code class="var">{{ cssVar(c.full) }}</code>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.colors { padding: 16px; border-radius: 12px; font: 13px/1.4 Inter, system-ui, sans-serif; }
.colors.light { background: #fff; color: #1d1e21; }
.colors.dark { background: #17181a; color: #ececee; }
.bar { display: flex; gap: 8px; margin-bottom: 8px; }
.bar button { padding: 4px 12px; border-radius: 6px; border: 1px solid #8884; background: transparent; color: inherit; cursor: pointer; text-transform: capitalize; }
.bar button.on { background: #0e77e6; color: #fff; border-color: #0e77e6; }
.bar input { flex: 1; max-width: 240px; padding: 4px 8px; border-radius: 6px; border: 1px solid #8884; background: transparent; color: inherit; }
h3 { margin: 20px 0 8px; font-size: 13px; } h3 small { opacity: 0.5; font-weight: 400; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
.chip { text-align: left; display: flex; flex-direction: column; gap: 2px; padding: 8px; border: 1px solid #8883; border-radius: 10px; background: transparent; color: inherit; cursor: pointer; font: inherit; }
.chip:hover { border-color: #0e77e6; }
.sw { height: 44px; border-radius: 6px; margin-bottom: 4px; background: repeating-conic-gradient(#8884 0 25%, #0000 0 50%) 0 0 / 10px 10px; overflow: hidden; }
.sw i { display: block; height: 100%; }
code { font: 11px ui-monospace, monospace; opacity: 0.7; } .var { opacity: 0.45; }
</style>
