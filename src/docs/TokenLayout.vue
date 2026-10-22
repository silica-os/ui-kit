<script setup>
import tokens from '../../tokens/tokens.json'

const num = (o) => Object.entries(o).filter(([, v]) => typeof v === 'number')
const spacing = num(tokens.spacing)
const controls = num(tokens.controlHeights)
const radii = num(tokens.radii)
const shadows = Object.entries(tokens.shadows.light)
</script>

<template>
  <div class="layout">
    <h3>Spacing <small>4 pt grid</small></h3>
    <div class="row"><div v-for="[k, v] in spacing" :key="k" class="item"><i class="bar" :style="{ width: v * 3 + 'px' }" /><b>{{ k }}</b><code>{{ v }} pt</code></div></div>
    <h3>Control heights</h3>
    <div class="row"><div v-for="[k, v] in controls" :key="k" class="item"><i class="ctl" :style="{ height: v + 'px' }" /><b>{{ k }}</b><code>{{ v }} pt</code></div></div>
    <h3>Radii <small>smooth corners, smoothing 0.6</small></h3>
    <div class="row"><div v-for="[k, v] in radii" :key="k" class="item"><i class="rad" :style="{ borderRadius: v + 'px' }" /><b>{{ k }}</b><code>{{ v }} pt</code></div></div>
    <h3>Shadows</h3>
    <div class="row"><div v-for="[k, s] in shadows" :key="k" class="item"><i class="sh" :style="{ boxShadow: `0 ${s.y}px ${s.blur}px #${s.color.slice(1)}` }" /><b>Shadow/{{ k }}</b><code>y {{ s.y }} · blur {{ s.blur }}</code></div></div>
  </div>
</template>

<style scoped>
.layout { font: 13px Inter, system-ui, sans-serif; padding: 8px; }
h3 { margin: 24px 0 12px; } h3 small { font-weight: 400; opacity: 0.55; }
.row { display: flex; flex-wrap: wrap; gap: 28px; align-items: flex-end; }
.item { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; } code { font: 11px ui-monospace, monospace; opacity: 0.6; }
.bar { height: 12px; background: #0e77e6; border-radius: 2px; display: block; }
.ctl { width: 96px; background: #0e77e633; border: 1px solid #0e77e6; border-radius: 8px; display: block; }
.rad { width: 72px; height: 72px; background: #0e77e633; border: 1px solid #0e77e6; display: block; }
.sh { width: 96px; height: 64px; background: #fff; border-radius: 12px; display: block; margin: 8px; }
</style>
