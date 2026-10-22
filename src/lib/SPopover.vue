<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import SCallout from './SCallout.vue'

/**
 * Popover panel (glass, 16 pt corners, 16 pt padding, optional arrow).
 *  - Alone it is a plain block: put anything in the default slot.
 *  - With a `trigger` slot it anchors to it: `v-model:open` shows it at `placement` (the edge with the notch: top | bottom | leading | trailing,
 *    plus -start | -center | -end; the panel opens on the opposite side of the trigger), a click outside or Esc closes it.
 * `arrow` draws the kit's 20 x 8 pt arrow on the `placement` edge as part of the bubble's single outline (see SCallout). `plain` drops the padding (lists use 8 pt).
 */
const props = defineProps({
  open: { type: Boolean, default: false },
  placement: { type: String, default: 'bottom-center' },
  arrow: { type: Boolean, default: true },
  padding: { type: [Number, String], default: 16 },
  width: { type: [Number, String], default: 0 },
})
const emit = defineEmits(['update:open'])
const root = ref(null)
const sideOf = computed(() => props.placement.split('-')[0])
const alignOf = computed(() => props.placement.split('-')[1] || 'center')
// as in the kit, `placement` names the edge that carries the notch: bottom-center = notch on the bottom edge, so the panel sits above its trigger
const edge = computed(() => sideOf.value)
const pos = computed(() => ({ bottom: 'top', top: 'bottom', leading: 'trailing', trailing: 'leading' })[sideOf.value])

function close() { emit('update:open', false) }
function onDoc(e) { if (!root.value?.contains(e.target)) close() }
function onKey(e) { if (e.key === 'Escape') close() }
watch(() => props.open, (v) => {
  if (v) { setTimeout(() => document.addEventListener('pointerdown', onDoc)); document.addEventListener('keydown', onKey) }
  else { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey) }
}, { immediate: true })
onBeforeUnmount(() => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey) })
const pad = computed(() => (typeof props.padding === 'number' ? props.padding + 'px' : props.padding))
</script>

<template>
  <span v-if="$slots.trigger" ref="root" class="s-popover-anchor">
    <slot name="trigger" />
    <Transition name="s-popover">
      <SCallout
        v-if="open" class="s-popover s-popover--anchored" :class="[`s-popover--${pos}`, `s-popover--align-${alignOf}`, { 's-popover--arrow': arrow }]"
        :edge="arrow ? edge : 'none'" :align="alignOf" :radius="16" role="dialog" :style="{ '--s-callout-pad': pad, minWidth: width ? width + 'px' : null }"
      >
        <slot />
      </SCallout>
    </Transition>
  </span>
  <SCallout
    v-else class="s-popover" :edge="arrow && placement !== 'detached' ? edge : 'none'" :align="alignOf" :radius="16"
    :style="{ '--s-callout-pad': pad, width: width ? width + 'px' : null }"
  >
    <slot />
  </SCallout>
</template>

<style>
.s-popover-anchor { position: relative; display: inline-flex; }
.s-popover { width: max-content; max-width: 320px; color: var(--text-primary); font: var(--font-body); }
.s-popover--anchored { position: absolute; z-index: 20; }
/* the arrow is part of the bubble, so with an arrow its tip sits 0-1 pt from the trigger; without one keep the 8 pt gap */
.s-popover--bottom { top: calc(100% + 8px); } .s-popover--top { bottom: calc(100% + 8px); }
.s-popover--leading { right: calc(100% + 8px); } .s-popover--trailing { left: calc(100% + 8px); }
.s-popover--arrow.s-popover--bottom { top: 100%; } .s-popover--arrow.s-popover--top { bottom: 100%; }
.s-popover--arrow.s-popover--leading { right: 100%; } .s-popover--arrow.s-popover--trailing { left: 100%; }
.s-popover--bottom.s-popover--align-center, .s-popover--top.s-popover--align-center { left: 50%; transform: translateX(-50%); }
.s-popover--bottom.s-popover--align-start, .s-popover--top.s-popover--align-start { left: 0; }
.s-popover--bottom.s-popover--align-end, .s-popover--top.s-popover--align-end { right: 0; }
.s-popover--leading.s-popover--align-center, .s-popover--trailing.s-popover--align-center { top: 50%; transform: translateY(-50%); }
.s-popover--leading.s-popover--align-start, .s-popover--trailing.s-popover--align-start { top: 0; }
.s-popover--leading.s-popover--align-end, .s-popover--trailing.s-popover--align-end { bottom: 0; }

/* open / close (motion.md, assumption: popover open is unmeasured): fade + scale 0.96 -> 1 from the arrow with spring.panel; closes with fade.instant.
   `scale` (not transform) so it composes with the centring transform above. Nothing animates on first render. */
.s-popover-enter-active { transition: opacity var(--fade-instant), scale var(--spring-panel); }
.s-popover-leave-active { transition: opacity var(--fade-instant), scale var(--fade-instant); }
.s-popover-enter-from, .s-popover-leave-to { opacity: 0; scale: 0.96; }
.s-popover--bottom { transform-origin: 50% 0; } .s-popover--top { transform-origin: 50% 100%; }
.s-popover--leading { transform-origin: 100% 50%; } .s-popover--trailing { transform-origin: 0 50%; }
.s-popover--bottom.s-popover--align-start { transform-origin: 24px 0; } .s-popover--top.s-popover--align-start { transform-origin: 24px 100%; }
.s-popover--bottom.s-popover--align-end { transform-origin: calc(100% - 24px) 0; } .s-popover--top.s-popover--align-end { transform-origin: calc(100% - 24px) 100%; }
@media (prefers-reduced-motion: reduce) { .s-popover-enter-active, .s-popover-leave-active { transition: opacity var(--fade-quick); } .s-popover-enter-from, .s-popover-leave-to { scale: 1; } }
</style>
