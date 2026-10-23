<script setup>
import { provide, ref } from 'vue'
import SGlassPanel from './SGlassPanel.vue'

/**
 * A menu panel: a glass block of <SMenuItem> / <SMenuSeparator>. It is a plain block; where it appears is up to the caller
 * (put it in an <SPopover>, or position it yourself). ↑ ↓ Home End move, Enter activates (a click), Esc emits `close`.
 */
const props = defineProps({
  /** minimum width in pt (the kit has 200, 208 and 232 wide menus) */
  width: { type: [Number, String], default: 0 },
  sub: Boolean,
  /** no glass, no padding: the item list inside a popover that already is the surface */
  plain: Boolean,
})
const emit = defineEmits(['close'])
const root = ref(null)
const items = () => [...(root.value?.$el.querySelectorAll(':scope > .s-menu__row > .s-menu__item:not(:disabled)') ?? [])]
function onKey(e) {
  const list = items()
  const i = list.indexOf(document.activeElement)
  let next
  if (e.key === 'ArrowDown') next = list[(i + 1) % list.length]
  else if (e.key === 'ArrowUp') next = list[(i <= 0 ? list.length : i) - 1]
  else if (e.key === 'Home') next = list[0]
  else if (e.key === 'End') next = list[list.length - 1]
  else if (e.key === 'Escape') { emit('close'); return }
  else return
  e.preventDefault(); e.stopPropagation()
  next?.focus()
}
provide('s-menu', { activated: () => emit('close') })
defineExpose({ focusFirst: () => items()[0]?.focus() })
</script>

<template>
  <SGlassPanel ref="root" class="s-menu" :class="{ 's-menu--sub': sub, 's-menu--plain': plain }" thick smooth :radius="12" role="menu" :style="width ? { minWidth: typeof width === 'number' ? width + 'px' : width } : null" @keydown="onKey"><slot /></SGlassPanel>
</template>

<style>
.s-menu { display: flex; flex-direction: column; padding: 4px; box-sizing: border-box; min-width: 160px; width: max-content; color: var(--text-primary); font: var(--font-body); }
.s-menu--plain { padding: 0; min-width: 0; }
.s-menu--plain::before { display: none; }
.s-menu__cascade .s-menu { min-width: 180px; }
</style>
