<script setup>
import { computed, ref } from 'vue'

/**
 * Switch (role="switch"). Click or Space toggles; press and drag moves the thumb, shown as a glass lens
 * while dragging, and the position on release decides the value.
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  size: { type: String, default: 'regular', validator: (v) => ['mini', 'small', 'regular'].includes(v) },
  disabled: Boolean,
  force: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const SIZES = { mini: { w: 24, h: 16, t: 12, lens: 20 }, small: { w: 32, h: 20, t: 16, lens: 24 }, regular: { w: 40, h: 24, t: 20, lens: 32 } }
const INSET = 2
const root = ref(null)
const dragging = ref(false)
const lensX = ref(0)
let startX = 0
let moved = false

const dim = computed(() => SIZES[props.size])
const left = computed(() => (props.modelValue ? dim.value.w - dim.value.t - INSET : INSET))
const stretch = computed(() => (props.force === 'pressed' ? 4 : 0))
// `force="drag"` shows the lens on the resting thumb (documentation)
const lens = computed(() => dragging.value || props.force === 'drag')
const thumbStyle = computed(() => {
  const d = dim.value
  if (dragging.value) return { left: lensX.value - d.lens / 2 + 'px' }
  if (lens.value) return { left: left.value + d.t / 2 - d.lens / 2 + 'px' }
  return { left: left.value - (props.modelValue ? stretch.value : 0) + 'px', width: `calc(var(--t) + ${stretch.value}px)` }
})
const on = computed(() => (dragging.value ? lensX.value > dim.value.w / 2 : props.modelValue))

function onDown(e) {
  if (props.disabled) return
  startX = e.clientX
  moved = false
  root.value.setPointerCapture(e.pointerId)
}
function onMove(e) {
  if (!root.value.hasPointerCapture?.(e.pointerId)) return
  if (!moved && Math.abs(e.clientX - startX) > 3) { moved = true; dragging.value = true }
  if (moved) {
    const r = root.value.getBoundingClientRect()
    const d = dim.value
    lensX.value = Math.min(d.w - d.t / 2 - INSET, Math.max(d.t / 2 + INSET, e.clientX - r.left))
  }
}
function onUp(e) {
  if (root.value.hasPointerCapture?.(e.pointerId)) root.value.releasePointerCapture(e.pointerId)
  if (moved) {
    const v = lensX.value > dim.value.w / 2
    dragging.value = false
    if (v !== props.modelValue) emit('update:modelValue', v)
  }
}
function onClick() {
  if (moved || props.disabled) { moved = false; return }
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
    ref="root" type="button" role="switch" :aria-checked="modelValue" :disabled="disabled"
    class="s-control s-switch" :class="[`s-switch--${size}`, force && `is-${force}`, { 's-switch--on': on, 'is-dragging': lens }]"
    :style="{ '--w': dim.w + 'px', '--h': dim.h + 'px', '--t': dim.t + 'px', '--lens': dim.lens + 'px' }"
    @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @click="onClick"
  >
    <span class="s-switch__track" />
    <span class="s-switch__thumb" :class="{ 'is-lens': lens }" :style="thumbStyle" />
  </button>
</template>

<style>
.s-switch { position: relative; display: inline-block; flex: none; padding: 0; border: 0; background: none; width: var(--w); height: var(--h); cursor: pointer; }
.s-switch__track {
  position: absolute; inset: 0; border-radius: calc(var(--h) / 2 - 0.5px); background: var(--surface-sunken); box-shadow: inset 0 0 0 1px var(--line-border);
  transition: background var(--fade-quick), box-shadow var(--fade-quick);
}
.s-switch--on .s-switch__track { background: var(--accent-amalfi); box-shadow: none; }
.s-switch__track::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; transition: background var(--fade-quick), box-shadow var(--fade-quick); }
.s-switch:is(:hover, .is-hover):not(:active, .is-pressed, .is-dragging) .s-switch__track::after { background: var(--accent-amalfi-soft); }
.s-switch--on:is(:hover, .is-hover):not(:active, .is-pressed, .is-dragging) .s-switch__track::after { background: var(--state-hover-overlay); }
.s-switch--on:is(:active, .is-pressed) .s-switch__track { background: var(--accent-amalfi-pressed); }
.s-switch:is(:focus-visible, .is-focus) .s-switch__track::after { box-shadow: 0 0 0 3px var(--line-focus); }

.s-switch__thumb {
  position: absolute; top: 2px; height: var(--t); border-radius: calc(var(--t) / 2); background: var(--text-on-accent);
  box-shadow: 0 0 0 0 transparent, inset 0 0 0 0 transparent, var(--elevation-1);
  backdrop-filter: blur(0px) saturate(1); -webkit-backdrop-filter: blur(0px) saturate(1);
  transition: left var(--spring-snappy), width var(--spring-snappy), height var(--spring-snappy), top var(--spring-snappy),
    border-radius var(--spring-snappy), background-color var(--spring-snappy), box-shadow var(--spring-snappy), backdrop-filter var(--spring-snappy);
}
.s-switch:is(:active, .is-pressed):not(.is-dragging) .s-switch__thumb { width: calc(var(--t) + 4px) !important; }
.s-switch--on:is(:active, .is-pressed):not(.is-dragging) .s-switch__thumb { left: calc(var(--w) - var(--t) - 6px) !important; }
/* dragging: the thumb itself becomes a Clear glass lens (same element, animated), and follows the pointer without lag */
.s-switch__thumb.is-lens {
  top: calc((var(--h) - var(--lens)) / 2); width: var(--lens); height: var(--lens); border-radius: calc(var(--lens) / 2);
  background-color: transparent; background-image: none;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px #ffffff40;
  backdrop-filter: var(--s-fx-lens); -webkit-backdrop-filter: var(--s-fx-lens);
  transition: top var(--spring-snappy), width var(--spring-snappy), height var(--spring-snappy), border-radius var(--spring-snappy),
    background-color var(--spring-snappy), box-shadow var(--spring-snappy), backdrop-filter var(--spring-snappy);
}

/* reduced motion: springs become the short fade (same as --fade-quick), no overshoot or scale */
@media (prefers-reduced-motion: reduce) {
  .s-switch__thumb, .s-switch__thumb.is-lens { transition-duration: 150ms !important; transition-timing-function: cubic-bezier(0.2, 0, 0, 1) !important; }
}
</style>
