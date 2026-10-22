<script setup>
import { computed, ref } from 'vue'

/**
 * Circular dial (Sliders/Circular/Dial, role="slider"): a ring that fills clockwise from the top, with a round thumb on it.
 * Drag the thumb or the ring (the pointer angle sets the value), arrows / PageUp / PageDown / Home / End move it. v-model is a number.
 * The kit shows no glass lens for the dial: the pressed state is the pressed round thumb, so nothing replaces it.
 */
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  disabled: Boolean,
  /** hover | pressed | focus */
  force: { type: String, default: '' },
  ariaLabel: { type: String, default: undefined },
})
const emit = defineEmits(['update:modelValue'])
const root = ref(null)
const dragging = ref(false)
const R = 22
const C = 2 * Math.PI * R
const frac = computed(() => (props.max === props.min ? 0 : (props.modelValue - props.min) / (props.max - props.min)))
// the kit's thumb centre sits 19.8 pt from the dial centre
const thumb = computed(() => {
  const a = frac.value * 2 * Math.PI
  return { left: 28 + 19.8 * Math.sin(a) - 10 + 'px', top: 28 - 19.8 * Math.cos(a) - 10 + 'px' }
})
const decimals = computed(() => (String(props.step).split('.')[1] || '').length)
const snap = (v) => Math.min(props.max, Math.max(props.min, Number((Math.round((v - props.min) / props.step) * props.step + props.min).toFixed(decimals.value))))
let last = 0

function setFromPointer(e) {
  const r = root.value.getBoundingClientRect()
  const dx = e.clientX - (r.left + r.width / 2)
  const dy = e.clientY - (r.top + r.height / 2)
  let f = Math.atan2(dx, -dy) / (2 * Math.PI)
  if (f < 0) f += 1
  // crossing the top stops at the end instead of jumping to the other end
  if (last > 0.75 && f < 0.25) f = 1
  else if (last < 0.25 && f > 0.75) f = 0
  last = f
  const v = snap(props.min + f * (props.max - props.min))
  if (v !== props.modelValue) emit('update:modelValue', v)
}
function onDown(e) {
  if (props.disabled) return
  last = frac.value
  dragging.value = true
  root.value.setPointerCapture(e.pointerId)
  root.value.focus({ preventScroll: true })
  setFromPointer(e)
}
function onMove(e) { if (dragging.value) setFromPointer(e) }
function onUp(e) {
  dragging.value = false
  if (root.value.hasPointerCapture?.(e.pointerId)) root.value.releasePointerCapture(e.pointerId)
}
function onKey(e) {
  const big = (props.max - props.min) / 10
  const d = { ArrowUp: props.step, ArrowRight: props.step, ArrowDown: -props.step, ArrowLeft: -props.step, PageUp: big, PageDown: -big }[e.key]
  let v
  if (d !== undefined) v = snap(props.modelValue + d)
  else if (e.key === 'Home') v = props.min
  else if (e.key === 'End') v = props.max
  else return
  e.preventDefault()
  if (v !== props.modelValue) emit('update:modelValue', v)
}
</script>

<template>
  <div
    ref="root" class="s-control s-dial" :class="[force && `is-${force}`, { 'is-dragging': dragging }]" role="slider" :tabindex="disabled ? -1 : 0"
    :aria-valuenow="modelValue" :aria-valuemin="min" :aria-valuemax="max" :aria-disabled="disabled || undefined" :aria-label="ariaLabel"
    @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp" @keydown="onKey"
  >
    <svg class="s-dial__ring" viewBox="0 0 56 56" width="56" height="56" aria-hidden="true">
      <circle class="s-dial__track" cx="28" cy="28" :r="R" />
      <circle class="s-dial__progress" cx="28" cy="28" :r="R" transform="rotate(-90 28 28)" :stroke-dasharray="`${frac * C} ${C}`" />
    </svg>
    <span class="s-dial__thumb" :style="thumb" />
  </div>
</template>

<style>
.s-dial { position: relative; display: inline-block; flex: none; width: 56px; height: 56px; border-radius: 50%; touch-action: none; cursor: pointer; outline: none; }
.s-dial[aria-disabled='true'] { opacity: 0.35; pointer-events: none; }
.s-dial__ring { position: absolute; inset: 0; overflow: visible; }
.s-dial__track, .s-dial__progress { fill: none; stroke-width: 4; }
.s-dial__track { stroke: var(--surface-sunken); }
.s-dial__progress { stroke: var(--accent-amalfi); }
.s-dial__thumb {
  position: absolute; width: 20px; height: 20px; border-radius: 10px; background: var(--surface-control);
  box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1); transition: background var(--fade-quick), box-shadow var(--fade-quick);
}
.s-dial__thumb::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; transition: background var(--fade-quick), box-shadow var(--fade-quick); }
.s-dial:is(:hover, .is-hover) .s-dial__thumb::after { background: var(--accent-amalfi-soft); }
.s-dial:is(:active, .is-pressed, .is-dragging) .s-dial__thumb { background: var(--surface-control-pressed); }
.s-dial:is(:active, .is-pressed, .is-dragging) .s-dial__thumb::after { background: none; }
.s-dial:is(:focus-visible, .is-focus) .s-dial__thumb::after { box-shadow: 0 0 0 3px var(--line-focus); }
</style>
