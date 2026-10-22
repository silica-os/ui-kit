<script>
// shared by every tooltip: after one has been visible, moving to the next one shows it at once
let lastHidden = 0
let uid = 0
</script>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import SCallout from './SCallout.vue'

/**
 * Tooltip around a trigger: `<STooltip text="Add to favourites"><SButton>…</SButton></STooltip>`. It shows on hover or keyboard
 * focus after `delay` ms (700 the first time, instantly when another tooltip was just visible) and hides on leave, blur,
 * Esc or click. `shortcut` adds the grey key text, long text wraps at 224 pt. `show` forces it open (showcase). `arrow` adds the popover-style
 * arrow on the edge facing the trigger (the kit's tooltips have none). The bubble is an SCallout: one outline for fill, border and shadow.
 */
const props = defineProps({
  text: { type: String, default: '' },
  shortcut: { type: String, default: '' },
  placement: { type: String, default: 'above', validator: (v) => ['above', 'below', 'leading', 'trailing'].includes(v) },
  delay: { type: Number, default: 700 },
  show: Boolean,
  disabled: Boolean,
  arrow: Boolean,
})
const visible = ref(false)
const id = `s-tip-${++uid}`
let timer = null
function enter() {
  if (props.disabled) return
  clearTimeout(timer)
  if (visible.value) return
  const wait = Date.now() - lastHidden < 400 ? 0 : props.delay
  if (wait === 0) visible.value = true
  else timer = setTimeout(() => (visible.value = true), wait)
}
function leave() {
  clearTimeout(timer)
  if (visible.value) { visible.value = false; lastHidden = Date.now() }
}
onBeforeUnmount(() => clearTimeout(timer))
const shown = computed(() => props.show || visible.value)
// the edge of the bubble that faces the trigger carries the arrow
const edge = computed(() => (props.arrow ? { above: 'bottom', below: 'top', leading: 'trailing', trailing: 'leading' }[props.placement] : 'none'))
const gap = computed(() => (props.arrow ? 0 : 8))
</script>

<template>
  <span class="s-tooltip-wrap" :aria-describedby="shown ? id : undefined" @pointerenter="enter" @pointerleave="leave" @focusin="enter" @focusout="leave" @pointerdown="leave" @keydown.esc="leave">
    <slot />
    <SCallout v-if="shown && (text || $slots.content)" :id="id" class="s-tooltip" :class="`s-tooltip--${placement}`" :edge="edge" :radius="8" :style="{ '--s-tip-gap': gap + 'px' }" role="tooltip">
      <span class="s-tooltip__text"><slot name="content">{{ text }}</slot></span>
      <span v-if="shortcut" class="s-tooltip__shortcut">{{ shortcut }}</span>
    </SCallout>
  </span>
</template>

<style>
.s-tooltip-wrap { position: relative; display: inline-flex; }
.s-tooltip {
  --s-callout-pad: 4px 8px; position: absolute; z-index: 30; width: max-content; max-width: 224px;
  font: var(--font-callout); font-weight: 500; color: var(--text-primary); pointer-events: none; animation: s-tooltip-in var(--fade-quick);
}
.s-tooltip .s-callout__body { display: flex; gap: 8px; }
.s-tooltip__shortcut { color: var(--text-secondary); flex: none; }
.s-tooltip--above { bottom: calc(100% + var(--s-tip-gap, 8px)); left: 50%; transform: translateX(-50%); }
.s-tooltip--below { top: calc(100% + var(--s-tip-gap, 8px)); left: 50%; transform: translateX(-50%); }
.s-tooltip--leading { right: calc(100% + var(--s-tip-gap, 8px)); top: 50%; transform: translateY(-50%); }
.s-tooltip--trailing { left: calc(100% + var(--s-tip-gap, 8px)); top: 50%; transform: translateY(-50%); }
@keyframes s-tooltip-in { from { opacity: 0; } to { opacity: 1; } }
</style>
