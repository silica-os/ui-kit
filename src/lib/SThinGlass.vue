<script setup>
import SGlassPanel from './SGlassPanel.vue'

/** The thin glass of the shelf-like surfaces (dock, control tiles): the glass panel with the light tint and a 4 pt blur. */
defineProps({
  tag: { type: String, default: 'div' },
  radius: { type: [Number, String], default: 12 },
  /** continuous corners (the default); false = a plain rounded box */
  smooth: { type: Boolean, default: true },
})
</script>

<template><SGlassPanel :tag="tag" :radius="radius" :smooth="smooth" class="s-glass--thin"><slot /></SGlassPanel></template>

<style>
.s-glass.s-glass--thin::before {
  background: linear-gradient(var(--glass-tint-thin), var(--glass-tint-thin)), #ffffff03;
  backdrop-filter: var(--s-fx-thin); -webkit-backdrop-filter: var(--s-fx-thin);
}
.s-glass--thin .s-glass__fill { background: linear-gradient(var(--glass-tint-thin), var(--glass-tint-thin)), #ffffff03; backdrop-filter: var(--s-fx-thin); -webkit-backdrop-filter: var(--s-fx-thin); }
</style>
