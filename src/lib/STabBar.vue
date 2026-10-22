<script setup>
import { ref } from 'vue'
import STab from './STab.vue'
import SIconButton from './SIconButton.vue'

/**
 * The tab strip of a window (sunken track, 36 pt). `tabs` is [{ value, label, icon }]; `v-model` is the selected value, ←/→ move.
 * Emits `close(value)` and `new` (the + button, hide it with `new-tab=false`).
 */
const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  tabs: { type: Array, default: () => [] },
  newTab: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'close', 'new'])
const root = ref(null)
function onKey(e) {
  const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
  if (!dir) return
  const i = props.tabs.findIndex((t) => t.value === props.modelValue)
  const next = props.tabs[(i + dir + props.tabs.length) % props.tabs.length]
  if (next) { e.preventDefault(); emit('update:modelValue', next.value); requestAnimationFrame(() => root.value?.querySelector('.s-tab.is-selected')?.focus()) }
}
</script>

<template>
  <div ref="root" class="s-tabbar" role="tablist" @keydown="onKey">
    <STab v-for="t in tabs" :key="t.value" :label="t.label" :icon="t.icon" :selected="t.value === modelValue" @select="emit('update:modelValue', t.value)" @close="emit('close', t.value)" />
    <SIconButton v-if="newTab" shape="square" size="small" icon="plus" label="New tab" @click="emit('new')" />
  </div>
</template>

<style>
.s-tabbar { display: flex; align-items: center; gap: 4px; height: 36px; padding: 4px; box-sizing: border-box; border-radius: 12px; background: var(--surface-sunken); min-width: 0; }
.s-tabbar > .s-iconbutton { margin: 0 0 0 0; }
</style>
