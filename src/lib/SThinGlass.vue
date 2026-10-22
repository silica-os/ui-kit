<script setup>
import SGlassPanel from './SGlassPanel.vue'

/** The thin glass of the shelf-like surfaces (dock, control tiles): the glass panel with the light tint and a 4 pt blur. */
defineProps({
  tag: { type: String, default: 'div' },
  radius: { type: [Number, String], default: 12 },
})
</script>

<template><SGlassPanel :tag="tag" :radius="radius" class="s-glass--thin"><slot /></SGlassPanel></template>

<style>
.s-glass.s-glass--thin::before {
  background: linear-gradient(var(--glass-tint-thin), var(--glass-tint-thin)), #ffffff03;
  backdrop-filter: blur(4px) saturate(1.5); -webkit-backdrop-filter: blur(4px) saturate(1.5);
}
</style>
