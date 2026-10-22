<script setup>
import { provide, ref } from 'vue'

/**
 * Sidebar panel (240 pt, the kit's sidebar surface): put <SSidebarGroup> / <SSidebarItem> in the default slot and a toolbar in
 * `footer`. `v-model` is the value of the selected item. `inactive` greys the selection like a sidebar in a background window.
 * ↑ ↓ move between rows.
 */
const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  inactive: Boolean,
})
const emit = defineEmits(['update:modelValue'])
const root = ref(null)
provide('s-sidebar', {
  get value() { return props.modelValue }, get inactive() { return props.inactive },
  select: (v) => emit('update:modelValue', v),
})
function onKey(e) {
  const dir = { ArrowDown: 1, ArrowUp: -1 }[e.key]
  if (!dir) return
  const rows = [...root.value.querySelectorAll('.s-sidebar__row:not(:disabled), .s-sidebar__header')]
  const i = rows.indexOf(document.activeElement)
  const next = rows[Math.max(0, Math.min(rows.length - 1, i + dir))]
  if (next) { e.preventDefault(); next.focus() }
}
</script>

<template>
  <nav ref="root" class="s-sidebar" :class="{ 'is-inactive': inactive }" @keydown="onKey">
    <div class="s-sidebar__body"><slot /></div>
    <div v-if="$slots.footer" class="s-sidebar__footer"><slot name="footer" /></div>
  </nav>
</template>

<style>
.s-sidebar { display: flex; flex-direction: column; width: 240px; min-height: 100%; box-sizing: border-box; padding: 12px 12px 0; background: var(--surface-sidebar); color: var(--text-primary); font: var(--font-sidebar); }
.s-sidebar__body { flex: 1; display: flex; flex-direction: column; gap: 0; }
.s-sidebar__footer { position: relative; display: flex; align-items: center; gap: 4px; height: 36px; margin: 0 -12px; padding: 0 12px; flex: none; }
.s-sidebar__footer::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: var(--line-separator); }
.s-sidebar__footer .s-spacer { flex: 1; }
</style>
