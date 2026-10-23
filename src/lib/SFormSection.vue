<script setup>
import SGlassPanel from './SGlassPanel.vue'
/** A titled group of form rows on a raised, rounded surface (Forms/Section). */
defineProps({ title: { type: String, default: '' } })
</script>

<template>
  <section class="s-formsection">
    <h3 v-if="title" class="s-formsection__title">{{ title }}</h3>
    <SGlassPanel raised flat smooth :radius="12" class="s-formsection__group"><slot /></SGlassPanel>
  </section>
</template>

<style>
.s-formsection { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.s-formsection__title { margin: 0; font: var(--font-headline); color: var(--text-secondary); }
.s-formsection__group { display: flex; flex-direction: column; gap: 12px; padding: 12px; }
</style>
