<script setup>
import { computed, ref } from 'vue'
import SIcon from './SIcon.vue'

/**
 * Slider (role="slider"): drag the thumb (a glass lens while dragging) or click the track; arrows, PageUp/PageDown, Home and End
 * work when focused. v-model is a number between `min` and `max`, snapped to `step`. `ticks` draws tick marks,
 * `minIcon` / `maxIcon` put symbols at the ends (volume), `vertical` turns it upright.
 */
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  ticks: Boolean,
  tickCount: { type: Number, default: 11 },
  minIcon: { type: String, default: '' },
  maxIcon: { type: String, default: '' },
  vertical: Boolean,
  disabled: Boolean,
  /** hover | pressed | focus | drag */
  force: { type: String, default: '' },
  ariaLabel: { type: String, default: undefined },
})
const emit = defineEmits(['update:modelValue', 'change'])
const body = ref(null)
const dragging = ref(false)

const span = computed(() => props.max - props.min || 1)
const p = computed(() => Math.min(1, Math.max(0, (props.modelValue - props.min) / span.value)))
const lens = computed(() => dragging.value || props.force === 'drag')

function snap(v) {
  const s = props.step > 0 ? Math.round((v - props.min) / props.step) * props.step + props.min : v
  const dec = (String(props.step).split('.')[1] || '').length
  return Math.min(props.max, Math.max(props.min, Number(s.toFixed(dec))))
}
function set(v) {
  const n = snap(v)
  if (n !== props.modelValue) emit('update:modelValue', n)
}
function fromPointer(e) {
  const r = body.value.getBoundingClientRect()
  const q = props.vertical ? 1 - (e.clientY - r.top - 10) / (r.height - 20) : (e.clientX - r.left - 10) / (r.width - 20)
  set(props.min + Math.min(1, Math.max(0, q)) * span.value)
}
function onDown(e) {
  if (props.disabled || e.button > 0) return
  body.value.setPointerCapture(e.pointerId)
  dragging.value = true
  body.value.focus({ preventScroll: true })
  fromPointer(e)
}
function onMove(e) { if (dragging.value) fromPointer(e) }
function onUp(e) {
  if (!dragging.value) return
  dragging.value = false
  body.value.releasePointerCapture?.(e.pointerId)
  emit('change', props.modelValue)
}
function onKey(e) {
  const big = Math.max(props.step, span.value / 10)
  const k = { ArrowRight: props.step, ArrowUp: props.step, ArrowLeft: -props.step, ArrowDown: -props.step, PageUp: big, PageDown: -big }[e.key]
  if (k !== undefined) set(props.modelValue + k)
  else if (e.key === 'Home') set(props.min)
  else if (e.key === 'End') set(props.max)
  else return
  e.preventDefault()
  emit('change', props.modelValue)
}
</script>

<template>
  <div class="s-slider" :class="{ 's-slider--vertical': vertical, 's-slider--ticks': ticks, 'is-disabled': disabled }">
    <SIcon v-if="minIcon && !vertical" class="s-slider__glyph" :name="minIcon" :size="16" />
    <div
      ref="body" class="s-control s-slider__body" :class="[force && force !== 'drag' && `is-${force}`, { 'is-dragging': lens }]" :style="{ '--p': p }"
      role="slider" :tabindex="disabled ? -1 : 0" :aria-valuemin="min" :aria-valuemax="max" :aria-valuenow="modelValue"
      :aria-orientation="vertical ? 'vertical' : 'horizontal'" :aria-disabled="disabled || undefined" :aria-label="ariaLabel"
      @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp" @keydown="onKey"
    >
      <span class="s-slider__track" />
      <span class="s-slider__fill" />
      <template v-if="ticks">
        <span v-for="i in tickCount" :key="i" class="s-slider__tick" :style="{ '--t': (i - 1) / (tickCount - 1) }" />
      </template>
      <span class="s-slider__thumb" />
    </div>
    <SIcon v-if="maxIcon && !vertical" class="s-slider__glyph" :name="maxIcon" :size="16" />
  </div>
</template>

<style>
.s-slider { display: inline-flex; align-items: center; gap: 8px; flex: none; }
.s-slider.is-disabled { opacity: 0.35; pointer-events: none; }
.s-slider .s-slider__body[aria-disabled='true'] { opacity: 1; }
.s-slider__glyph { color: var(--text-secondary); }
.s-slider__body { position: relative; flex: none; width: var(--s-slider-w, 200px); height: 20px; cursor: pointer; touch-action: none; }
.s-slider--ticks .s-slider__body { height: 36px; }
.s-slider__track { position: absolute; left: 0; right: 0; top: 8px; height: 4px; border-radius: 2px; background: var(--surface-sunken); box-shadow: inset 0 0 0 1px var(--line-separator); }
.s-slider__fill { position: absolute; left: 0; top: 8px; height: 4px; width: calc(var(--p) * 100%); border-radius: 2px; background: var(--accent-amalfi); }
.s-slider__tick { position: absolute; top: 20px; width: 2px; height: 8px; left: calc(9px + var(--t) * (100% - 20px)); background: var(--text-tertiary); }

.s-slider__thumb {
  position: absolute; top: 0; left: calc(var(--p) * (100% - 20px)); width: 20px; height: 20px; border-radius: 10px;
  background-color: var(--surface-control); box-shadow: inset 0 0 0 1px var(--line-border), inset 0 1px 1px transparent, inset 0 0 3px transparent, var(--elevation-1);
  backdrop-filter: blur(0px) saturate(1); -webkit-backdrop-filter: blur(0px) saturate(1);
  transition: background-color var(--spring-snappy), box-shadow var(--spring-snappy), width var(--spring-snappy), height var(--spring-snappy),
    margin var(--spring-snappy), border-radius var(--spring-snappy), backdrop-filter var(--spring-snappy);
}
.s-slider__thumb::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; transition: background var(--fade-quick), box-shadow var(--fade-quick); }
.s-slider__body:is(:hover, .is-hover) .s-slider__thumb::after { background: var(--accent-amalfi-soft); }
.s-slider__body:is(:active, .is-pressed) .s-slider__thumb { background: var(--surface-control-pressed); }
.s-slider__body:is(:active, .is-pressed) .s-slider__thumb::after { background: none; }
.s-slider__body:is(:focus-visible, .is-focus) .s-slider__thumb::after { box-shadow: 0 0 0 3px var(--line-focus); }

/* dragging: the thumb itself becomes the 36 x 28 glass lens (same element, animated from the solid thumb) */
.s-slider__body.is-dragging .s-slider__thumb {
  margin: -4px 0 0 -8px; width: 36px; height: 28px; border-radius: 14px; background-color: transparent;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px #ffffff40, 0 0 0 transparent;
  backdrop-filter: blur(1px) saturate(1.2); -webkit-backdrop-filter: blur(1px) saturate(1.2);
}
.s-slider__body.is-dragging .s-slider__thumb::after { display: none; }

/* vertical */
.s-slider--vertical .s-slider__body { width: 20px; height: var(--s-slider-w, 160px); }
.s-slider--vertical .s-slider__track { left: 8px; right: auto; top: 0; bottom: 0; width: 4px; height: auto; }
.s-slider--vertical .s-slider__fill { left: 8px; top: auto; bottom: 0; width: 4px; height: calc(var(--p) * 100%); }
.s-slider--vertical .s-slider__thumb { left: 0; top: auto; bottom: calc(var(--p) * (100% - 20px)); }
.s-slider--vertical .s-slider__body.is-dragging .s-slider__thumb { margin: 0 0 -4px -8px; }
.s-slider--vertical .s-slider__tick { display: none; }

/* reduced motion: springs become the short fade (same as --fade-quick), no overshoot or scale */
@media (prefers-reduced-motion: reduce) {
  .s-slider__thumb { transition-duration: 150ms !important; transition-timing-function: cubic-bezier(0.2, 0, 0, 1) !important; }
}
</style>
