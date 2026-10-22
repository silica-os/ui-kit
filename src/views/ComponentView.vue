<script setup>
import { computed, onMounted, provide, ref, watch } from 'vue'
import { depsOf, ensureMaster, getMaster, groupByKey, symbols } from '../kit.js'
import { flattenMaster } from '../render/flatten.js'
import { diff } from '../render/morph.js'
import { useMorph } from '../composables/useMorph.js'
import { metrics } from '../motion.js'
import { href } from '../router.js'
import tokens from '../../tokens/tokens.json'
import FlatStage from '../render/FlatStage.vue'
import KitSymbol from '../render/KitSymbol.vue'
import { stageBackground, treeHasBlur } from '../render/style.js'

const props = defineProps({ category: String, comp: String })
const group = computed(() => groupByKey.get(`${props.category}/${props.comp}`) || groupByKey.get(props.comp))

const STATES = ['Rest', 'Hover', 'Pressed', 'Focused', 'Disabled', 'Dragging', 'Active', 'Inactive', 'Default']
const VALUES = ['On', 'Off', 'Mixed', 'Checked', 'Unchecked', 'Expanded', 'Collapsed', 'Open', 'Closed', 'Selected', 'Unselected']
const SIZES = ['Mini', 'Small', 'Regular', 'Large']

function facetsOf(rest) {
  const f = {}
  let n = 0
  for (const seg of rest) {
    if (STATES.includes(seg) && !f.State) f.State = seg
    else if (VALUES.includes(seg) && !f.Value) f.Value = seg
    else if (SIZES.includes(seg) && !f.Size) f.Size = seg
    else f[n++ === 0 ? 'Variant' : `Variant ${n}`] = seg
  }
  return f
}
const LABEL_ORDER = ['Variant', 'Variant 2', 'Variant 3', 'Value', 'Size', 'State']
const masters = computed(() => [...group.value.masters].map((m) => ({ ...m, facets: facetsOf(m.rest) })).sort((a, b) => a.name.localeCompare(b.name)))
const appearances = computed(() => [...new Set(masters.value.map((m) => m.appearance).filter(Boolean))].sort((a, b) => (a === 'Light' ? -1 : b === 'Light' ? 1 : 0)))
const dims = computed(() => {
  const labels = [...new Set(masters.value.flatMap((m) => Object.keys(m.facets)))].sort((a, b) => LABEL_ORDER.indexOf(a) - LABEL_ORDER.indexOf(b))
  return labels.map((label) => {
    const values = [...new Set(masters.value.map((m) => m.facets[label]).filter(Boolean))]
    if (label === 'State') values.sort((a, b) => STATES.indexOf(a) - STATES.indexOf(b))
    if (label === 'Size') values.sort((a, b) => SIZES.indexOf(a) - SIZES.indexOf(b))
    return { label, values }
  })
})
const dimOf = (label) => dims.value.find((d) => d.label === label)

const sel = ref({})
const appearance = ref('Light')
const scale = ref(2)
const bg = ref('auto')
const motionKey = ref('spring.snappy')
const interactive = ref(true)

const same = (m, f) => dims.value.every((d) => (m.facets[d.label] ?? '') === (f[d.label] ?? ''))
function find(f, app) {
  return masters.value.find((m) => same(m, f) && m.appearance === app) || masters.value.find((m) => same(m, f))
}
const current = computed(() => find(sel.value, appearance.value))

function init() {
  const pool = masters.value.filter((m) => m.appearance === 'Light' || !m.appearance)
  const score = (m) => (m.facets.State === 'Rest' ? 4 : 0) + (m.facets.Size === 'Regular' ? 2 : 0) + (m.facets.Value === 'On' ? 1 : 0)
  const first = [...(pool.length ? pool : masters.value)].sort((a, b) => score(b) - score(a))[0]
  sel.value = { ...first.facets }
  appearance.value = appearances.value.includes('Light') || !appearances.value.length ? 'Light' : appearances.value[0]
  const w = symbols.find((x) => x.name === first.name)?.w || 100
  const preferred = w >= 600 ? 1 : w >= 300 ? 1.5 : 2
  scale.value = Math.max(0.5, Math.floor(Math.min(preferred, 680 / w) * 4) / 4)
}

function pick(label, v) {
  const next = { ...sel.value, [label]: v }
  if (find(next, appearance.value) && same(find(next, appearance.value), next)) { sel.value = next; return }
  const score = (m) => dims.value.reduce((n, d) => n + (d.label !== label && (m.facets[d.label] ?? '') === (sel.value[d.label] ?? '') ? 1 : 0), 0)
  const best = masters.value.filter((m) => m.facets[label] === v).sort((a, b) => score(b) - score(a))[0]
  if (best) sel.value = { ...best.facets }
}

const driverOptions = [
  ...Object.keys(tokens.motion.springs).map((k) => `spring.${k}`),
  ...Object.keys(tokens.motion.fades).map((k) => `fade.${k}`),
  'none',
]
const driver = computed(() => {
  const k = motionKey.value
  if (k === 'none') return null
  if (k.startsWith('spring.')) {
    const s = tokens.motion.springs[k.slice(7)]
    return { kind: 'spring', response: s.response, dampingRatio: s.dampingRatio }
  }
  const f = tokens.motion.fades[k.slice(5)]
  return { kind: 'bezier', duration: f.duration, curve: f.curve }
})
const driverMetrics = computed(() => (driver.value ? metrics(driver.value, 3000) : null))
const endMs = computed(() => (driver.value ? (driver.value.kind === 'spring' ? driverMetrics.value.settleMs + 30 : driver.value.duration) : 0))

const loaded = ref(false)
const { shown, info, goTo, jump } = useMorph(null)

const tree = (m) => flattenMaster(m.name)
async function load() {
  loaded.value = false
  const seen = new Set()
  for (const m of masters.value) await ensureMaster(m.name, seen)
  loaded.value = true
  jump(tree(current.value))
}
onMounted(() => { init(); load() })
watch(() => group.value.key, () => { init(); load() })

watch(current, (m, old) => {
  if (!loaded.value || !m) return
  if (!driver.value || !old) jump(tree(m))
  else goTo(tree(m), driver.value, endMs.value)
})

function setState(state) {
  if (!interactive.value || !dimOf('State') || sel.value.State === 'Disabled') return
  const next = { ...sel.value, State: state }
  const m = find(next, appearance.value)
  if (m && same(m, next)) sel.value = next
}
function toggle() {
  const d = dimOf('Value')
  if (!interactive.value || !d || sel.value.State === 'Disabled') return
  pick('Value', d.values[(d.values.indexOf(sel.value.Value) + 1) % d.values.length])
}
const canInteract = computed(() => !!dimOf('State') && dimOf('State').values.some((s) => ['Hover', 'Pressed', 'Focused'].includes(s)))
const hint = computed(() => {
  const bits = []
  if (canInteract.value) bits.push('hover, press and focus the component')
  const d = dimOf('Value')
  if (d) bits.push('click to switch ' + d.values.join(' / '))
  return bits.length ? 'Try it: ' + bits.join('; ') + '.' : 'This component has no interactive states: use the controls.'
})

const stageBg = computed(() => {
  const dark = appearance.value === 'Dark'
  const glass = !!shown.value && treeHasBlur(shown.value)
  if (bg.value === 'checker') return 'repeating-conic-gradient(#8882 0 25%, #0000 0 50%) 0 0 / 20px 20px, ' + (dark ? '#1b1c1f' : '#f1f2f4')
  if (bg.value === 'glass') return stageBackground(dark, true)
  return stageBackground(dark, glass)
})

// transition test
const label = (m) => (m.rest.join(' · ') || m.name) + (m.appearance ? '' : '')
const fromName = ref('')
const toName = ref('')
const options = computed(() => masters.value.filter((m) => m.appearance === appearance.value || !m.appearance))
watch([options, loaded], () => {
  if (!loaded.value) return
  const o = options.value
  const rest = o.find((m) => m.rest.includes('Rest')) || o[0]
  const hover = o.find((m) => m.rest.includes('Pressed')) || o.find((m) => m.rest.includes('Hover')) || o.find((m) => m.rest.join() !== rest.rest.join()) || o[0]
  fromName.value = rest.name
  toName.value = hover.name
}, { immediate: true })
const loop = ref(false)
let loopTimer = 0
function play() {
  clearTimeout(loopTimer)
  const a = masters.value.find((m) => m.name === fromName.value)
  const b = masters.value.find((m) => m.name === toName.value)
  if (!a || !b) return
  jump(tree(a))
  setTimeout(() => {
    if (driver.value) goTo(tree(b), driver.value, endMs.value)
    else jump(tree(b))
    if (loop.value) loopTimer = setTimeout(play, endMs.value + 700)
  }, 250)
}
watch(loop, (v) => { if (!v) clearTimeout(loopTimer) })
const changes = computed(() => {
  if (!loaded.value || !fromName.value || !toName.value) return []
  const a = flattenMaster(fromName.value)
  const b = flattenMaster(toName.value)
  return a && b ? diff(a, b) : []
})
const exportSpec = computed(() => ({
  component: group.value.key, from: fromName.value, to: toName.value,
  driver: motionKey.value, changes: changes.value,
}))
const copied = ref('')
const copy = (text, what) => { navigator.clipboard?.writeText(text); copied.value = what; setTimeout(() => (copied.value = ''), 1200) }
const rustSnippet = computed(() => {
  const k = motionKey.value
  if (k === 'none') return '// no animation'
  const mod = k.startsWith('spring.') ? 'spring' : 'fade'
  const driver = k.startsWith('spring.') ? `Driver::Spring(spring::${k.slice(7).toUpperCase()})` : `Driver::Fade(fade::${k.slice(5).toUpperCase()})`
  return `// ${group.value.key}: ${fromName.value.split('/').slice(2).join('/')} -> ${toName.value.split('/').slice(2).join('/')}\n// tokens::${mod}, see rust/silica_motion.rs\nlet driver = ${driver};\nlet p = driver.progress(elapsed_ms); // 0..1 (springs may overshoot)\n// value = from + (to - from) * p, for each change below`
})

const outline = ref(false)
provide('outlineComponents', outline)
const deps = computed(() => depsOf(group.value.key))
const link = (key) => {
  const g = groupByKey.get(key)
  return g ? href('components', g.category, g.label) : null
}
const parts = computed(() => {
  const m = current.value && getMaster(current.value.name)
  const rows = []
  const walk = (n, depth) => {
    for (const c of n.children || []) {
      if (c.type === 'SymbolInstance' && c.master) rows.push({ depth, layer: c.name, master: c.master, overrides: c.overrides.length })
      if (c.type === 'Group') walk(c, depth + 1)
    }
  }
  if (m) walk(m, 0)
  return rows
})
const groupKeyOf = (name) => {
  const p = name.split('/')
  if (['Light', 'Dark'].includes(p[p.length - 1])) p.pop()
  return p.length > 2 ? p.slice(0, 2).join('/') : p.join('/')
}

const showAll = ref(false)
const gallery = computed(() => (showAll.value ? options.value : options.value.slice(0, 24)))
</script>

<template>
  <div v-if="group" class="page">
    <nav class="crumb"><a :href="href('components', group.category)">{{ group.category }}</a> / {{ group.label }}</nav>
    <h1>{{ group.label }}</h1>
    <p class="muted">{{ masters.length }} masters · <code>{{ group.key }}/…</code></p>

    <div class="top">
      <section class="card stagecard">
        <div class="stage" :style="{ background: stageBg }">
          <div
            v-if="shown"
            class="hit"
            :class="{ live: interactive && (canInteract || !!dimOf('Value')) }"
            :tabindex="interactive && canInteract ? 0 : -1"
            @pointerenter="setState('Hover')"
            @pointerleave="setState('Rest')"
            @pointerdown="setState('Pressed')"
            @pointerup="setState('Hover')"
            @focus="setState('Focused')"
            @blur="setState('Rest')"
            @click="toggle"
          >
            <FlatStage :tree="shown" :scale="scale" />
          </div>
          <span v-else class="muted">Loading…</span>
        </div>
        <div class="statusline">
          <span>{{ hint }}</span>
          <code v-if="current">{{ current.name }}</code>
        </div>
      </section>

      <aside class="card controls">
        <div v-if="appearances.length > 1" class="field">
          <label>Appearance</label>
          <div class="seg"><button v-for="a in appearances" :key="a" :class="{ on: appearance === a }" @click="appearance = a">{{ a }}</button></div>
        </div>
        <div v-for="d in dims" :key="d.label" class="field">
          <label>{{ d.label }}</label>
          <div class="seg"><button v-for="v in d.values" :key="v" :class="{ on: sel[d.label] === v }" @click="pick(d.label, v)">{{ v }}</button></div>
        </div>
        <div class="field">
          <label>Motion</label>
          <select v-model="motionKey"><option v-for="k in driverOptions" :key="k" :value="k">{{ k }}</option></select>
          <small v-if="driverMetrics" class="muted">settles in {{ driverMetrics.settleMs }} ms · overshoot {{ driverMetrics.overshootPct.toFixed(1) }} %</small>
          <small v-else class="muted">Changes apply instantly.</small>
        </div>
        <div class="field">
          <label>Interactive</label>
          <div class="seg"><button :class="{ on: interactive }" @click="interactive = true">On</button><button :class="{ on: !interactive }" @click="interactive = false">Off</button></div>
        </div>
        <div class="field">
          <label>Zoom {{ scale }}×</label>
          <input v-model.number="scale" type="range" min="0.5" max="4" step="0.25" />
        </div>
        <div class="field">
          <label>Nested components</label>
          <div class="seg"><button :class="{ on: outline }" @click="outline = true">Outline</button><button :class="{ on: !outline }" @click="outline = false">Hide</button></div>
        </div>
        <div class="field">
          <label>Background</label>
          <div class="seg"><button v-for="b in ['auto', 'checker', 'glass']" :key="b" :class="{ on: bg === b }" @click="bg = b">{{ b }}</button></div>
        </div>
      </aside>
    </div>

    <h2>Composition</h2>
    <section class="card pad comp">
      <div>
        <div class="label">Built from</div>
        <p v-if="!parts.length" class="muted">Nothing: this component is drawn directly with shapes and text.</p>
        <ul v-else class="parts">
          <li v-for="(r, i) in parts" :key="i" :style="{ paddingLeft: r.depth * 14 + 'px' }">
            <a v-if="link(groupKeyOf(r.master))" :href="link(groupKeyOf(r.master))">{{ r.master }}</a>
            <span v-else>{{ r.master }}</span>
            <small class="muted"> · layer “{{ r.layer }}”<template v-if="r.overrides"> · {{ r.overrides }} overrides</template></small>
          </li>
        </ul>
      </div>
      <div>
        <div class="label">Used in <small class="muted">{{ Object.keys(deps.usedBy).length }} components</small></div>
        <p v-if="!Object.keys(deps.usedBy).length" class="muted">Not embedded in any other component.</p>
        <div v-else class="chips">
          <a v-for="(n, k) in deps.usedBy" :key="k" class="chip" :href="link(k)">{{ k }} <small>{{ n }}</small></a>
        </div>
      </div>
    </section>

    <h2>Transition</h2>
    <section class="card pad">
      <p class="muted">Pick two variants and play the change with the selected motion token. The table lists what changes: these are the values to animate in code.</p>
      <div class="trow">
        <div class="field"><label>From</label><select v-model="fromName"><option v-for="m in options" :key="m.name" :value="m.name">{{ label(m) }}</option></select></div>
        <div class="field"><label>To</label><select v-model="toName"><option v-for="m in options" :key="m.name" :value="m.name">{{ label(m) }}</option></select></div>
        <div class="field"><label>Motion</label><select v-model="motionKey"><option v-for="k in driverOptions" :key="k" :value="k">{{ k }}</option></select></div>
        <button class="btn primary" @click="play">Play</button>
        <label class="chk"><input v-model="loop" type="checkbox" /> loop</label>
      </div>
      <div v-if="changes.length" class="changes">
        <table>
          <thead><tr><th>Layer</th><th>Property</th><th>From</th><th>To</th></tr></thead>
          <tbody>
            <tr v-for="(c, i) in changes.slice(0, 80)" :key="i">
              <td>{{ c.node }}</td><td>{{ c.prop }}</td>
              <td><i v-if="String(c.from).startsWith('#')" class="sw" :style="{ background: c.from }" />{{ c.from }}</td>
              <td><i v-if="String(c.to).startsWith('#')" class="sw" :style="{ background: c.to }" />{{ c.to }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="changes.length > 80" class="muted">{{ changes.length - 80 }} more changes not shown.</p>
      </div>
      <p v-else class="muted">No property changes between these two variants.</p>
      <div class="exports">
        <button class="btn" @click="copy(JSON.stringify(exportSpec, null, 2), 'json')">{{ copied === 'json' ? 'Copied' : 'Copy changes as JSON' }}</button>
        <button class="btn" @click="copy(rustSnippet, 'rust')">{{ copied === 'rust' ? 'Copied' : 'Copy Rust driver' }}</button>
      </div>
    </section>

    <h2>All variants <small class="muted">{{ options.length }}</small></h2>
    <div class="variants">
      <button v-for="m in gallery" :key="m.name" class="variant" :class="{ on: current && current.name === m.name }" @click="sel = { ...m.facets }">
        <KitSymbol :name="m.name" :scale="1" />
        <span>{{ label(m) }}</span>
      </button>
    </div>
    <button v-if="options.length > 24" class="btn more" @click="showAll = !showAll">{{ showAll ? 'Show fewer' : `Show all ${options.length}` }}</button>
  </div>
  <div v-else class="page"><h1>Not found</h1><p class="muted">No component {{ category }}/{{ comp }}.</p></div>
</template>

<style scoped>
.page { padding: 28px 36px 64px; max-width: 1280px; }
.crumb { font-size: 12px; margin-bottom: 6px; }
.top { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 20px; align-items: start; }
.stagecard { overflow: hidden; }
.stage { min-height: 360px; display: grid; place-items: center; padding: 40px; outline: none; overflow: auto; }
.hit { outline: none; } .hit.live { cursor: pointer; }
.statusline { display: flex; justify-content: space-between; gap: 12px; padding: 10px 14px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }
.controls { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.controls select { width: 100%; }
.pad { padding: 16px; }
.trow { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; margin-bottom: 16px; }
.trow select { min-width: 200px; }
.chk { display: flex; gap: 6px; align-items: center; padding-bottom: 6px; }
.changes { max-height: 320px; overflow: auto; border: 1px solid var(--line); border-radius: 10px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th { text-align: left; font-weight: 600; color: var(--muted); padding: 6px 10px; position: sticky; top: 0; background: var(--panel); }
td { padding: 5px 10px; border-top: 1px solid var(--line); font-family: var(--mono); }
.sw { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; border: 1px solid #8884; vertical-align: -1px; }
.exports { display: flex; gap: 8px; margin-top: 12px; }
.variants { display: flex; flex-wrap: wrap; gap: 12px; }
.variant { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 8px; border-radius: 12px; border: 1px solid var(--line); background: var(--panel); text-align: left; max-width: 280px; }
.variant.on { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft); }
.variant span { font-size: 11px; color: var(--muted); }
.more { margin-top: 12px; }
.comp { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.parts { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; max-height: 260px; overflow: auto; font-size: 13px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; max-height: 260px; overflow: auto; }
.chip { padding: 3px 10px; border-radius: 99px; border: 1px solid var(--line); font-size: 12px; color: var(--text); } .chip small { color: var(--muted); margin-left: 4px; } .chip:hover { border-color: var(--accent); }
@media (max-width: 1000px) { .comp { grid-template-columns: 1fr; } }
@media (max-width: 1000px) { .top { grid-template-columns: 1fr; } }
</style>
