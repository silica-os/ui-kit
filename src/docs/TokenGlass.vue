<script setup>
import { computed, ref } from 'vue'
import tokens from '../../tokens/tokens.json'

const mode = ref('light')
const names = Object.keys(tokens.glass)
const css = (s) => {
  const f = s.fills.map((x) => x.color)
  const out = { background: f.length ? `linear-gradient(${f[0]}, ${f[0]})` : 'transparent' }
  const sh = []
  s.borders.forEach((b) => sh.push(`inset 0 0 0 ${b.thickness}px ${b.color}`))
  s.innerShadows.forEach((i) => sh.push(`inset ${i.x}px ${i.y}px ${i.blur}px ${i.spread}px ${i.color}`))
  s.shadows.forEach((i) => sh.push(`${i.x}px ${i.y}px ${i.blur}px ${i.spread}px ${i.color}`))
  out.boxShadow = sh.join(', ')
  const b = s.blurs[0]
  if (b) out.backdropFilter = `blur(${b.radius}px) saturate(${b.saturation ?? 1})`
  return out
}
const backdrop = computed(() => mode.value === 'light'
  ? 'linear-gradient(120deg, #ffb347, #e5338a 40%, #0e77e6 70%, #34a853)'
  : 'linear-gradient(120deg, #3d1f6b, #0b2a55 45%, #064b4a 80%)')
</script>

<template>
  <div class="glass" :style="{ background: backdrop }">
    <div class="bar">
      <button v-for="m in ['light', 'dark']" :key="m" :class="{ on: mode === m }" @click="mode = m">{{ m }}</button>
    </div>
    <div class="cards">
      <figure v-for="n in names" :key="n">
        <div class="stripes"><div class="pane" :style="css(tokens.glass[n][mode] || tokens.glass[n].light)">{{ n }}</div></div>
        <figcaption>
          Glass/{{ n }}
          <code v-for="(b, i) in (tokens.glass[n][mode] || tokens.glass[n].light).blurs" :key="i">blur {{ b.radius }} · sat {{ b.saturation }}</code>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<style scoped>
.glass { padding: 24px; border-radius: 16px; color: #fff; font: 13px Inter, sans-serif; }
.bar { margin-bottom: 16px; display: flex; gap: 8px; }
.bar button { padding: 4px 12px; border-radius: 6px; border: 1px solid #fff6; background: #0003; color: #fff; cursor: pointer; text-transform: capitalize; }
.bar button.on { background: #fff; color: #000; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
figure { margin: 0; }
.stripes { padding: 16px; border-radius: 12px; background: repeating-linear-gradient(45deg, #0004 0 8px, #fff4 8px 16px); }
.pane { height: 96px; border-radius: 20px; display: grid; place-items: center; color: #111; font-weight: 600; }
figcaption { margin-top: 8px; display: flex; flex-direction: column; } code { font: 11px ui-monospace, monospace; opacity: 0.8; }
</style>
