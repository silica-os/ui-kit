<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import tokens from '../../tokens/tokens.json'
import { symbols } from '../kit.js'
import KitSymbol from '../render/KitSymbol.vue'
import { curvePath, metrics, progress, springDamping, springStiffness } from '../motion.js'

const springTokens = tokens.motion.springs
const fadeTokens = tokens.motion.fades

const targetName = ref('Toggles/Switch/On/Regular/Rest/Light')
const names = symbols.map((s) => s.name)
const target = computed(() => (names.includes(targetName.value) ? targetName.value : ''))

const driver = reactive({ preset: 'spring.snappy', kind: 'spring', response: 0.25, dampingRatio: 0.9, duration: 250, curve: [0.4, 0, 0.2, 1] })
const delay = ref(0)
const tracks = reactive({
  x: { on: false, from: -40, to: 0, unit: 'pt' },
  y: { on: false, from: 12, to: 0, unit: 'pt' },
  scale: { on: true, from: 0.9, to: 1, unit: '×' },
  rotate: { on: false, from: -12, to: 0, unit: '°' },
  opacity: { on: true, from: 0, to: 1, unit: '' },
})
const loop = ref(true)

watch(() => driver.preset, (p) => {
  if (p === 'custom-spring') driver.kind = 'spring'
  else if (p === 'custom-bezier') driver.kind = 'bezier'
  else if (p.startsWith('spring.')) Object.assign(driver, { kind: 'spring', response: springTokens[p.slice(7)].response, dampingRatio: springTokens[p.slice(7)].dampingRatio })
  else if (p.startsWith('fade.')) Object.assign(driver, { kind: 'bezier', duration: fadeTokens[p.slice(5)].duration, curve: [...fadeTokens[p.slice(5)].curve] })
})

const d = computed(() => (driver.kind === 'spring'
  ? { kind: 'spring', response: driver.response, dampingRatio: driver.dampingRatio }
  : { kind: 'bezier', duration: driver.duration, curve: driver.curve.map(Number) }))
const m = computed(() => metrics(d.value, 4000))
const horizon = computed(() => Math.max(200, Math.ceil((d.value.kind === 'spring' ? m.value.settleMs : d.value.duration) * 1.15)))

const t = ref(0)
const playing = ref(true)
let raf = 0
let start = 0
function tick(now) {
  if (!start) start = now
  let ms = now - start - delay.value
  if (ms > horizon.value + 400) {
    if (loop.value) { start = now; ms = -delay.value } else { playing.value = false; t.value = horizon.value; return }
  }
  t.value = Math.max(0, ms)
  raf = requestAnimationFrame(tick)
}
function play() { cancelAnimationFrame(raf); start = 0; playing.value = true; raf = requestAnimationFrame(tick) }
function scrub(e) { cancelAnimationFrame(raf); playing.value = false; t.value = Number(e.target.value) }
play()
onBeforeUnmount(() => cancelAnimationFrame(raf))
watch([d, delay, loop], play, { deep: true })

const p = computed(() => progress(d.value, t.value))
const style = computed(() => {
  const k = tracks
  const v = (n) => k[n].from + (k[n].to - k[n].from) * p.value
  const tf = []
  if (k.x.on || k.y.on) tf.push(`translate(${k.x.on ? v('x') : 0}px, ${k.y.on ? v('y') : 0}px)`)
  if (k.scale.on) tf.push(`scale(${v('scale')})`)
  if (k.rotate.on) tf.push(`rotate(${v('rotate')}deg)`)
  return { transform: tf.join(' ') || undefined, opacity: k.opacity.on ? Math.min(1, Math.max(0, v('opacity'))) : undefined }
})

const spec = computed(() => ({
  name: 'my-animation',
  target: target.value || null,
  delayMs: delay.value,
  driver: driver.kind === 'spring'
    ? { type: 'spring', response: driver.response, dampingRatio: driver.dampingRatio, preset: driver.preset.startsWith('spring.') ? driver.preset : null }
    : { type: 'bezier', durationMs: driver.duration, curve: driver.curve.map(Number), preset: driver.preset.startsWith('fade.') ? driver.preset : null },
  tracks: Object.entries(tracks).filter(([, v]) => v.on).map(([prop, v]) => ({ prop, from: v.from, to: v.to })),
}))
const json = computed(() => JSON.stringify(spec.value, null, 2))
const propEnum = { x: 'TranslateX', y: 'TranslateY', scale: 'Scale', rotate: 'Rotate', opacity: 'Opacity' }
const rust = computed(() => {
  const s = spec.value
  const drv = s.driver.type === 'spring'
    ? (s.driver.preset ? `Driver::Spring(spring::${s.driver.preset.slice(7).toUpperCase()})` : `Driver::Spring(Spring::new(${s.driver.response}, ${s.driver.dampingRatio}))`)
    : (s.driver.preset ? `Driver::Fade(fade::${s.driver.preset.slice(5).toUpperCase()})` : `Driver::Bezier { duration_ms: ${s.driver.durationMs}, curve: [${s.driver.curve.map((x) => x.toFixed(2)).join(', ')}] }`)
  const tr = s.tracks.map((x) => `        Track { prop: Prop::${propEnum[x.prop]}, from: ${Number(x.from).toFixed(2)}, to: ${Number(x.to).toFixed(2)} },`).join('\n')
  return `pub const MY_ANIMATION: Animation = Animation {\n    name: "${s.name}",\n    delay_ms: ${s.delayMs},\n    driver: ${drv},\n    tracks: &[\n${tr}\n    ],\n};\n// sample: MY_ANIMATION.value(Prop::Scale, elapsed_ms)`
})
const copy = (x) => navigator.clipboard?.writeText(x)
const download = () => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([json.value], { type: 'application/json' }))
  a.download = `${spec.value.name}.json`
  a.click()
}
</script>

<template>
  <div class="lab">
    <div class="stage">
      <div class="canvas">
        <div class="target" :style="style">
          <KitSymbol v-if="target" :name="target" backdrop="transparent" />
          <div v-else class="box" />
        </div>
      </div>
      <div class="timeline">
        <button @click="play">{{ playing ? 'Restart' : 'Replay' }}</button>
        <input type="range" min="0" :max="horizon" step="1" :value="t" @input="scrub" />
        <code>{{ Math.round(t) }} ms · {{ (p * 100).toFixed(1) }} %</code>
        <label><input v-model="loop" type="checkbox" /> loop</label>
      </div>
      <svg viewBox="0 0 420 150" class="graph">
        <path :d="curvePath(d, 420, 150, horizon)" fill="none" stroke="#0e77e6" stroke-width="2" />
        <line :x1="8 + (t / horizon) * 404" :x2="8 + (t / horizon) * 404" y1="8" y2="142" stroke="#e5338a" />
        <line x1="8" x2="412" :y1="150 - 8 - (1.1 / 1.5) * 134" :y2="150 - 8 - (1.1 / 1.5) * 134" stroke="#8886" stroke-dasharray="3 3" />
      </svg>
      <div class="stats">
        settles in <b>{{ m.settleMs }} ms</b> · overshoot <b>{{ m.overshootPct.toFixed(1) }} %</b>
        <template v-if="d.kind === 'spring'"> · k {{ springStiffness(d).toFixed(1) }} · c {{ springDamping(d).toFixed(1) }}</template>
      </div>
    </div>

    <div class="panel">
      <label>Target (kit symbol, empty = box)
        <input v-model="targetName" list="kit-names" />
        <datalist id="kit-names"><option v-for="n in names" :key="n" :value="n" /></datalist>
      </label>
      <label>Driver
        <select v-model="driver.preset">
          <optgroup label="Springs"><option v-for="(_, k) in springTokens" :key="k" :value="'spring.' + k">spring.{{ k }}</option><option value="custom-spring">custom spring</option></optgroup>
          <optgroup label="Fades"><option v-for="(_, k) in fadeTokens" :key="k" :value="'fade.' + k">fade.{{ k }}</option><option value="custom-bezier">custom bezier</option></optgroup>
        </select>
      </label>
      <template v-if="driver.kind === 'spring'">
        <label>Response {{ driver.response }} s <input v-model.number="driver.response" type="range" min="0.1" max="1.2" step="0.01" @input="driver.preset = 'custom-spring'" /></label>
        <label>Damping ratio ζ {{ driver.dampingRatio }} <input v-model.number="driver.dampingRatio" type="range" min="0.2" max="1.4" step="0.01" @input="driver.preset = 'custom-spring'" /></label>
      </template>
      <template v-else>
        <label>Duration {{ driver.duration }} ms <input v-model.number="driver.duration" type="range" min="50" max="1500" step="10" @input="driver.preset = 'custom-bezier'" /></label>
        <div class="bz"><input v-for="i in 4" :key="i" v-model.number="driver.curve[i - 1]" type="number" step="0.05" @input="driver.preset = 'custom-bezier'" /></div>
      </template>
      <label>Delay {{ delay }} ms <input v-model.number="delay" type="range" min="0" max="1000" step="10" /></label>

      <h4>Tracks</h4>
      <div v-for="(tr, name) in tracks" :key="name" class="track">
        <label class="chk"><input v-model="tr.on" type="checkbox" /> {{ name }} <small>{{ tr.unit }}</small></label>
        <input v-model.number="tr.from" type="number" step="0.05" :disabled="!tr.on" />
        <span>→</span>
        <input v-model.number="tr.to" type="number" step="0.05" :disabled="!tr.on" />
      </div>

      <h4>Export <button @click="copy(rust)">Copy Rust</button> <button @click="copy(json)">Copy JSON</button> <button @click="download">Download JSON</button></h4>
      <pre>{{ rust }}</pre>
      <small>Save the JSON in <code>animations/</code> and run <code>python3 tools/gen-animations.py</code> to add it to <code>rust/animations.rs</code>.</small>
    </div>
  </div>
</template>

<style scoped>
.lab { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 24px; font: 13px Inter, system-ui, sans-serif; }
.canvas { min-height: 320px; border-radius: 12px; background: repeating-conic-gradient(#8881 0 25%, #0000 0 50%) 0 0 / 20px 20px; display: grid; place-items: center; overflow: hidden; }
.target { transform-origin: center; } .box { width: 96px; height: 96px; border-radius: 22px; background: #0e77e6; }
.timeline { display: flex; align-items: center; gap: 12px; margin: 12px 0; } .timeline input[type=range] { flex: 1; }
.graph { width: 100%; max-width: 420px; background: #8881; border-radius: 8px; } .stats { margin-top: 8px; opacity: 0.8; }
.panel { display: flex; flex-direction: column; gap: 10px; } .panel label { display: flex; flex-direction: column; gap: 4px; }
.panel input, .panel select { font: inherit; padding: 4px 6px; border-radius: 6px; border: 1px solid #8884; background: transparent; color: inherit; }
.panel input[type=range] { padding: 0; } .bz { display: flex; gap: 6px; } .bz input { width: 25%; }
.track { display: grid; grid-template-columns: 1fr 70px 16px 70px; align-items: center; gap: 6px; } .chk { flex-direction: row !important; align-items: center; gap: 6px !important; }
h4 { margin: 12px 0 0; display: flex; gap: 8px; align-items: center; } h4 button, .timeline button { padding: 3px 10px; border-radius: 6px; border: 1px solid #8884; background: transparent; color: inherit; cursor: pointer; font: inherit; }
pre { margin: 0; padding: 10px; background: #8881; border-radius: 8px; overflow: auto; font: 11px/1.5 ui-monospace, monospace; }
code { font: 11px ui-monospace, monospace; }
</style>
