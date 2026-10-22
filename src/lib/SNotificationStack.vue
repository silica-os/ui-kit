<script setup>
import { ref } from 'vue'
import SNotification from './SNotification.vue'
import SGlassPanel from './SGlassPanel.vue'

/**
 * Notifications of one app grouped: the newest banner in front, two glass plates behind it. A click expands the list,
 * click on the header's close folds it. `items` are the props of <SNotification>. Emits `action(id, value)` and `close(id)`.
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  expanded: { type: Boolean, default: false },
})
const emit = defineEmits(['update:expanded', 'action', 'close'])
const inner = ref(props.expanded)
function set(v) { inner.value = v; emit('update:expanded', v) }
</script>

<template>
  <div class="s-nstack" :class="{ 'is-expanded': expanded || inner }">
    <template v-if="expanded || inner">
      <SNotification v-for="(n, i) in items" :key="n.id ?? i" v-bind="n" @action="emit('action', n.id ?? i, $event)" @close="emit('close', n.id ?? i)" />
      <button type="button" class="s-control s-nstack__fold" @click="set(false)">Show less</button>
    </template>
    <template v-else-if="items.length">
      <SGlassPanel v-if="items.length > 2" class="s-nstack__plate s-nstack__plate--2" :radius="18" />
      <SGlassPanel v-if="items.length > 1" class="s-nstack__plate s-nstack__plate--1" :radius="18" />
      <SNotification v-bind="items[0]" class="s-nstack__front" @click="items.length > 1 && set(true)" @action="emit('action', items[0].id ?? 0, $event)" @close="emit('close', items[0].id ?? 0)" />
    </template>
  </div>
</template>

<style>
.s-nstack { position: relative; width: 360px; display: flex; flex-direction: column; gap: 8px; }
.s-nstack:not(.is-expanded) { padding-bottom: 20px; }
.s-nstack__front { position: relative; z-index: 3; }
.s-nstack__plate { position: absolute; height: 76px; }
.s-nstack__plate--1 { left: 16px; right: 16px; top: 10px; z-index: 2; }
.s-nstack__plate--2 { left: 32px; right: 32px; top: 20px; z-index: 1; }
.s-nstack__fold { align-self: center; padding: 2px 10px; border: 0; background: none; color: var(--text-secondary); font: var(--font-label); cursor: default; }
</style>
