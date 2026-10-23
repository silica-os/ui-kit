<script setup>
import { onBeforeUnmount, ref } from 'vue'
import SIcon from './SIcon.vue'

/**
 * Stepper (role="spinbutton"): the up/down pair. Click a half to step; hold it to repeat. Up/Down arrows, PageUp/PageDown,
 * Home and End work when focused. v-model is a number clamped to `min`..`max`, moved by `step`.
 * Put it beside an STextField to edit a value, or use it alone.
 */
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 },
  size: { type: String, default: 'regular', validator: (v) => ['mini', 'small', 'regular', 'large'].includes(v) },
  disabled: Boolean,
  /** hover-up | hover-down | pressed-up | pressed-down | focus */
  force: { type: String, default: '' },
  ariaLabel: { type: String, default: undefined },
})
const emit = defineEmits(['update:modelValue'])
const holding = ref('')
let timer = 0

function clamp(v) {
  const dec = (String(props.step).split('.')[1] || '').length
  return Math.min(props.max, Math.max(props.min, Number(v.toFixed(dec))))
}
function bump(dir) {
  const n = clamp(props.modelValue + dir * props.step)
  if (n !== props.modelValue) emit('update:modelValue', n)
}
function stop() {
  clearTimeout(timer)
  timer = 0
  holding.value = ''
}
function start(dir, e) {
  if (props.disabled || e.button > 0) return
  e.currentTarget.parentElement.focus({ preventScroll: true })
  holding.value = dir > 0 ? 'up' : 'down'
  bump(dir)
  const tick = () => { bump(dir); timer = setTimeout(tick, 60) }
  timer = setTimeout(() => { timer = setTimeout(tick, 60) }, 400)
  window.addEventListener('pointerup', stop, { once: true })
}
function onKey(e) {
  const k = { ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key]
  if (k !== undefined) bump(k)
  else if (e.key === 'Home' && isFinite(props.min)) emit('update:modelValue', props.min)
  else if (e.key === 'End' && isFinite(props.max)) emit('update:modelValue', props.max)
  else return
  e.preventDefault()
}
onBeforeUnmount(stop)
</script>

<template>
  <div
    class="s-control s-stepper" :class="[`s-stepper--${size}`, force && `is-${force}`, holding && `is-pressed-${holding}`]"
    role="spinbutton" :tabindex="disabled ? -1 : 0" :aria-valuenow="modelValue" :aria-valuemin="isFinite(min) ? min : undefined"
    :aria-valuemax="isFinite(max) ? max : undefined" :aria-disabled="disabled || undefined" :aria-label="ariaLabel" @keydown="onKey"
  >
    <span class="s-stepper__half s-stepper__up" @pointerdown.prevent="start(1, $event)"><SIcon name="chevron-up" :size="12" /></span>
    <span class="s-stepper__half s-stepper__down" @pointerdown.prevent="start(-1, $event)"><SIcon name="chevron-down" :size="12" /></span>
  </div>
</template>

<style>
.s-stepper {
  --w: 24px; --h: 28px; --r: 9px;
  position: relative; display: inline-flex; flex-direction: column; flex: none; width: var(--w); height: var(--h); border-radius: var(--r);
  isolation: isolate; color: var(--text-primary); transition: box-shadow var(--fade-quick);
}
/* Regular glass body (Steppers/Stepper: Glass/Regular + Fill/Glass/Tint, rim, shadow) */
.s-stepper::before {
  content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none;
  background: linear-gradient(var(--glass-tint), var(--glass-tint)), #ffffff03;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px var(--s-glow, #ffffff40), var(--elevation-glass);
  backdrop-filter: var(--s-fx-regular); -webkit-backdrop-filter: var(--s-fx-regular);
}
.s-stepper--mini { --w: 16px; --h: 20px; --r: 7px; }
.s-stepper--small { --w: 20px; --h: 24px; --r: 8px; }
.s-stepper--large { --w: 28px; --h: 32px; --r: 10px; }
.s-stepper:is(:focus-visible, .is-focus) { box-shadow: 0 0 0 3px var(--line-focus); }
.s-stepper[aria-disabled='true'] { pointer-events: none; }
/* opacity on the stepper would make it the backdrop root and hide what is behind the glass: dim the glass and the halves separately */
.s-stepper[aria-disabled='true']::before, .s-stepper[aria-disabled='true'] > *, .s-stepper[aria-disabled='true']::after { opacity: 0.35; }
.s-stepper::after { content: ''; position: absolute; left: 4px; right: 4px; top: calc(var(--h) / 2); height: 1px; background: var(--line-separator); pointer-events: none; }

.s-stepper__half { flex: 1 1 0; display: grid; place-items: center; cursor: default; transition: background var(--fade-quick); }
.s-stepper__up { border-radius: var(--r) var(--r) 0 0; }
.s-stepper__down { border-radius: 0 0 var(--r) var(--r); }
.s-stepper__half:hover, .is-hover-up .s-stepper__up, .is-hover-down .s-stepper__down { background: var(--accent-amalfi-soft); }
.s-stepper__half:active, .is-pressed-up .s-stepper__up, .is-pressed-down .s-stepper__down { background: var(--state-press-overlay); }
</style>
