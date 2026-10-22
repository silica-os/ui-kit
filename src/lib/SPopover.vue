<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import SGlassPanel from './SGlassPanel.vue'

/**
 * Popover panel (glass, 16 pt corners, 16 pt padding, optional arrow).
 *  - Alone it is a plain block: put anything in the default slot.
 *  - With a `trigger` slot it anchors to it: `v-model:open` shows it at `placement` (the edge with the notch: top | bottom | leading | trailing,
 *    plus -start | -center | -end; the panel opens on the opposite side of the trigger), a click outside or Esc closes it.
 * `arrow` draws the 8 pt notch on the side that faces the trigger. `plain` drops the padding (lists use 8 pt).
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
    <SGlassPanel
      v-if="open" class="s-popover s-popover--anchored" :class="[`s-popover--${pos}`, `s-popover--align-${alignOf}`, { 's-popover--arrow': arrow }]"
      thick :radius="16" role="dialog" :style="{ '--s-pop-pad': pad, minWidth: width ? width + 'px' : null }"
    >
      <span v-if="arrow" class="s-popover__arrow" :class="`s-popover__arrow--${edge}`" :data-align="alignOf" />
      <slot />
    </SGlassPanel>
  </span>
  <SGlassPanel v-else class="s-popover" :class="{ 's-popover--arrow': arrow && placement !== 'detached', [`s-popover--edge-${edge}`]: arrow && placement !== 'detached' }" thick :radius="16" :style="{ '--s-pop-pad': pad, width: width ? width + 'px' : null }">
    <span v-if="arrow && placement !== 'detached'" class="s-popover__arrow" :class="`s-popover__arrow--${edge}`" :data-align="alignOf" />
    <slot />
  </SGlassPanel>
</template>

<style>
.s-popover-anchor { position: relative; display: inline-flex; }
.s-popover { padding: var(--s-pop-pad, 16px); box-sizing: border-box; width: max-content; max-width: 320px; color: var(--text-primary); font: var(--font-body); }
.s-popover--arrow.s-popover--edge-top { margin-top: 8px; }
.s-popover--arrow.s-popover--edge-bottom { margin-bottom: 8px; }
.s-popover--arrow.s-popover--edge-leading { margin-left: 8px; }
.s-popover--arrow.s-popover--edge-trailing { margin-right: 8px; }

.s-popover--anchored { position: absolute; z-index: 20; }
.s-popover--bottom { top: calc(100% + 8px); } .s-popover--top { bottom: calc(100% + 8px); }
.s-popover--leading { right: calc(100% + 8px); } .s-popover--trailing { left: calc(100% + 8px); }
.s-popover--bottom.s-popover--align-center, .s-popover--top.s-popover--align-center { left: 50%; transform: translateX(-50%); }
.s-popover--bottom.s-popover--align-start, .s-popover--top.s-popover--align-start { left: 0; }
.s-popover--bottom.s-popover--align-end, .s-popover--top.s-popover--align-end { right: 0; }
.s-popover--leading.s-popover--align-center, .s-popover--trailing.s-popover--align-center { top: 50%; transform: translateY(-50%); }
.s-popover--leading.s-popover--align-start, .s-popover--trailing.s-popover--align-start { top: 0; }
.s-popover--leading.s-popover--align-end, .s-popover--trailing.s-popover--align-end { bottom: 0; }

/* the notch: a triangle of the same glass, with a hairline outline, on the edge facing the trigger */
.s-popover__arrow { position: absolute; width: 16px; height: 8px; pointer-events: none; z-index: 2; filter: drop-shadow(0 -0.5px 0 var(--glass-rim-dark)); }
.s-popover__arrow::before {
  content: ''; position: absolute; inset: 0; backdrop-filter: blur(18px) saturate(1.7); -webkit-backdrop-filter: blur(18px) saturate(1.7);
  background: linear-gradient(var(--glass-tint-thick), var(--glass-tint-thick)), var(--surface-raised);
}
.s-popover__arrow--top { top: -7px; left: calc(50% - 8px); } .s-popover__arrow--top::before { clip-path: polygon(0 100%, 50% 0, 100% 100%); }
.s-popover__arrow--bottom { bottom: -7px; left: calc(50% - 8px); transform: scaleY(-1); } .s-popover__arrow--bottom::before { clip-path: polygon(0 100%, 50% 0, 100% 100%); }
.s-popover__arrow--leading { left: -7px; top: calc(50% - 8px); width: 8px; height: 16px; } .s-popover__arrow--leading::before { clip-path: polygon(100% 0, 0 50%, 100% 100%); }
.s-popover__arrow--trailing { right: -7px; top: calc(50% - 8px); width: 8px; height: 16px; } .s-popover__arrow--trailing::before { clip-path: polygon(0 0, 100% 50%, 0 100%); }
.s-popover__arrow[data-align='start'].s-popover__arrow--top, .s-popover__arrow[data-align='start'].s-popover__arrow--bottom { left: 24px; }
.s-popover__arrow[data-align='end'].s-popover__arrow--top, .s-popover__arrow[data-align='end'].s-popover__arrow--bottom { left: auto; right: 24px; }
.s-popover__arrow[data-align='start'].s-popover__arrow--leading, .s-popover__arrow[data-align='start'].s-popover__arrow--trailing { top: 24px; }
.s-popover__arrow[data-align='end'].s-popover__arrow--leading, .s-popover__arrow[data-align='end'].s-popover__arrow--trailing { top: auto; bottom: 24px; }
</style>
