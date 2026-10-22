<script setup>
import { ref } from 'vue'
import tokens from '../../tokens/tokens.json'
import { cssEasing, curvePath, metrics } from '../motion.js'

const springs = Object.entries(tokens.motion.springs).map(([name, s]) => {
  const d = { kind: 'spring', response: s.response, dampingRatio: s.dampingRatio }
  return { name: 'spring.' + name, d, m: metrics(d), use: s.use, line: `response ${s.response} s · ζ ${s.dampingRatio} · k ${s.stiffness} · c ${s.damping}` }
})
const fades = Object.entries(tokens.motion.fades).map(([name, f]) => {
  const d = { kind: 'bezier', duration: f.duration, curve: f.curve }
  return { name: 'fade.' + name, d, m: metrics(d, f.duration + 100), use: f.use, line: `${f.duration} ms · cubic-bezier(${f.curve.join(', ')})` }
})
const all = [...springs, ...fades].map((t) => {
  const ms = t.d.kind === 'spring' ? t.m.settleMs + 50 : t.d.duration
  return { ...t, ms, easing: cssEasing(t.d, ms) }
})
const played = ref(0)
const replay = () => { played.value++ }
</script>

<template>
  <div class="motion">
    <button class="play" @click="replay">Replay</button>
    <div v-for="t in all" :key="t.name" class="row">
      <div class="info">
        <b>{{ t.name }}</b>
        <code>{{ t.line }}</code>
        <span>settles in {{ t.m.settleMs }} ms · overshoot {{ t.m.overshootPct.toFixed(1) }} %</span>
        <em>{{ t.use }}</em>
      </div>
      <svg viewBox="0 0 260 110" class="graph">
        <line x1="8" x2="252" :y1="110 - 8 - (1.1 / 1.5) * 94" :y2="110 - 8 - (1.1 / 1.5) * 94" stroke="#8885" stroke-dasharray="3 3" />
        <path :d="curvePath(t.d, 260, 110, t.d.kind === 'spring' ? 1500 : t.d.duration + 100)" fill="none" stroke="#0e77e6" stroke-width="2" />
      </svg>
      <div class="track">
        <i :key="played" class="dot" :style="{ '--d': t.ms + 'ms', '--c': t.easing }" />
      </div>
    </div>
    <p class="note">{{ tokens.motion.reducedMotion }}</p>
  </div>
</template>

<style scoped>
.motion { font: 13px Inter, system-ui, sans-serif; }
.play { padding: 4px 12px; border-radius: 6px; border: 1px solid #8884; background: transparent; cursor: pointer; margin-bottom: 8px; }
.row { display: grid; grid-template-columns: 300px 260px 1fr; gap: 16px; align-items: center; padding: 12px 0; border-top: 1px solid #8883; }
.info { display: flex; flex-direction: column; gap: 2px; } code, span { font: 11px ui-monospace, monospace; opacity: 0.65; } em { font-style: normal; opacity: 0.8; }
.graph { width: 260px; height: 110px; background: #8881; border-radius: 8px; }
.track { height: 24px; background: #8881; border-radius: 12px; position: relative; overflow: hidden; }
.dot { position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; border-radius: 50%; background: #0e77e6; animation: slide var(--d) var(--c) forwards; }
@keyframes slide { to { left: calc(100% - 20px); } }
.note { opacity: 0.6; }
</style>
