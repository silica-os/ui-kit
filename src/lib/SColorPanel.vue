<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SSwatchRow from './SSwatchRow.vue'
import STextField from './STextField.vue'
import SSlider from './SSlider.vue'
import { hsvToHex, parseHex, resolveColor, rgbToHex, rgbToHsv, watchTheme } from './color.js'

/**
 * Colour panel content (Wells/Color Panel): the 24 theme swatches and, unless `swatches-only`, a saturation/brightness pad, a hue slider
 * and a hex field. v-model is a hex string. It has no surface of its own: put it in an <SPopover :arrow="false" :padding="12">.
 */
const props = defineProps({
  modelValue: { type: String, default: '#0E77E6' },
  swatchesOnly: Boolean,
})
const emit = defineEmits(['update:modelValue'])

const SWATCHES = [
  [['Amalfi', 'var(--accent-amalfi)'], ['Limone', 'var(--palette-limone)'], ['Terracotta', 'var(--palette-terracotta)'], ['Bouganville', 'var(--palette-bouganville)'], ['Ulivo', 'var(--palette-ulivo)'], ['Mare', 'var(--palette-mare)']],
  [['Lavanda', 'var(--palette-lavanda)'], ['Amalfi Pressed', 'var(--accent-amalfi-pressed)'], ['Text Primary', 'var(--text-primary)'], ['Text Secondary', 'var(--text-secondary)'], ['Text Tertiary', 'var(--text-tertiary)'], ['Surface Sunken', 'var(--surface-sunken)']],
  [['Surface Sidebar', 'var(--surface-sidebar)'], ['Surface Raised', 'var(--surface-raised)'], ['Surface Window', 'var(--surface-window)'], ['Control Pressed', 'var(--surface-control-pressed)'], ['Line Border', 'var(--line-border)'], ['Glass Tint', 'var(--glass-tint)']],
  [['Amalfi Soft', 'var(--accent-amalfi-soft)'], ['Line Separator', 'var(--line-separator)'], ['Glass Rim Dark', 'var(--glass-rim-dark)'], ['Press Overlay', 'var(--state-press-overlay)'], ['Shadow', 'var(--shadow-soft)'], ['On Accent', 'var(--text-on-accent)']],
].map((row) => row.map(([name, color]) => ({ name, color })))

const hsv = ref({ h: 210, s: 0.9, v: 0.9 })
const hex = ref(props.modelValue)
const pad = ref(null)
const draggingPad = ref(false)
function sync(v) {
  const c = parseHex(v) || (/^(var|rgb|hsl)\(/.test(String(v).trim()) ? parseHex(resolveColor(null, v)) : null) // a var(--token) colour is resolved in the current theme
  if (!c) return
  const next = rgbToHsv(c[0], c[1], c[2])
  // keep the hue when the colour has none (black, white, grey)
  hsv.value = { h: next.s && next.v ? next.h : hsv.value.h, s: next.s, v: next.v }
  hex.value = rgbToHex(c[0], c[1], c[2])
}
sync(props.modelValue)
let stopTheme = () => {}
onMounted(() => { stopTheme = watchTheme(() => { if (!parseHex(props.modelValue)) sync(props.modelValue) }) })
onBeforeUnmount(() => stopTheme())
watch(() => props.modelValue, (v) => { if (v?.toUpperCase().slice(0, 7) !== hex.value) sync(v) })

function set(h, s, v) {
  hsv.value = { h, s, v }
  hex.value = hsvToHex(h, s, v)
  emit('update:modelValue', hex.value)
}
function fromPad(e) {
  const r = pad.value.getBoundingClientRect()
  const s = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  const v = 1 - Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
  set(hsv.value.h, s, v)
}
function padDown(e) { draggingPad.value = true; pad.value.setPointerCapture(e.pointerId); pad.value.focus(); fromPad(e) }
function padMove(e) { if (draggingPad.value) fromPad(e) }
function padUp(e) { draggingPad.value = false; pad.value.releasePointerCapture?.(e.pointerId) }
function padKey(e) {
  const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key]
  if (!d) return
  e.preventDefault()
  const k = e.shiftKey ? 0.1 : 0.02
  set(hsv.value.h, Math.min(1, Math.max(0, hsv.value.s + d[0] * k)), Math.min(1, Math.max(0, hsv.value.v + d[1] * k)))
}
function onHex(v) {
  hex.value = v
  const c = parseHex(v)
  if (c && /^#?[0-9a-f]{6}$/i.test(v.trim())) { sync(v); emit('update:modelValue', hex.value) }
}
const hueColor = computed(() => hsvToHex(hsv.value.h, 1, 1))
const padStyle = computed(() => ({ '--hue': hueColor.value, '--x': hsv.value.s * 100 + '%', '--y': (1 - hsv.value.v) * 100 + '%', '--cur': hex.value }))
function swatchPicked(v) { sync(v); emit('update:modelValue', v) }
</script>

<template>
  <div class="s-colorpanel">
    <div class="s-colorpanel__title">Swatches</div>
    <SSwatchRow v-for="(row, i) in SWATCHES" :key="i" :swatches="row" :model-value="hex" @update:model-value="swatchPicked" />
    <template v-if="!swatchesOnly">
      <div class="s-colorpanel__sep" />
      <div
        ref="pad" class="s-control s-colorpanel__pad" :style="padStyle" tabindex="0" role="slider" aria-label="Saturation and brightness"
        @pointerdown="padDown" @pointermove="padMove" @pointerup="padUp" @pointercancel="padUp" @keydown="padKey"
      ><span class="s-colorpanel__knob" /></div>
      <SSlider class="s-colorpanel__hue" :model-value="hsv.h" :min="0" :max="360" aria-label="Hue" @update:model-value="set($event, hsv.s, hsv.v)" />
      <div class="s-colorpanel__hex">
        <span class="s-colorpanel__chip" :style="{ background: hex }" />
        <STextField :model-value="hex" aria-label="Hex colour" spellcheck="false" :error="!parseHex(hex)" style="--s-field-w: 120px" @update:model-value="onHex" />
      </div>
    </template>
  </div>
</template>

<style>
.s-colorpanel { display: flex; flex-direction: column; width: 192px; padding-bottom: 4px; }
.s-colorpanel__title { padding: 2px 0 0; margin-bottom: 0; font: var(--font-headline); color: var(--text-primary); }
.s-colorpanel__sep { height: 1px; margin: 4px 4px 8px; background: var(--line-separator); }
.s-colorpanel__pad {
  position: relative; height: 96px; margin: 0 4px; border-radius: 8px; cursor: crosshair; touch-action: none; outline: none;
  background: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, var(--hue)); box-shadow: inset 0 0 0 1px var(--line-border);
}
.s-colorpanel__pad:focus-visible { box-shadow: inset 0 0 0 1px var(--line-border), 0 0 0 3px var(--line-focus); }
.s-colorpanel__knob { position: absolute; left: var(--x); top: var(--y); width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; background: var(--cur); box-shadow: 0 0 0 2px #fff, 0 1px 3px #0006; pointer-events: none; }
.s-colorpanel__hue { --s-slider-w: 184px; margin: 8px 4px 0; }
.s-colorpanel__hex { display: flex; align-items: center; gap: 8px; margin: 8px 4px 0; }
.s-colorpanel__chip { flex: none; width: 28px; height: 28px; border-radius: 9px; box-shadow: inset 0 0 0 1px var(--line-border); }
</style>
