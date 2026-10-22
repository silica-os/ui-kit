<script setup>
import KitRef from './KitRef.vue'

/** A live composite next to the kit's render of the same master, for big components where a matrix is too narrow. */
defineProps({ label: { type: String, default: '' }, kit: { type: String, required: true }, stack: Boolean })
</script>

<template>
  <div class="pair" :class="{ stack }">
    <div class="side"><div class="lab">Live{{ label ? `: ${label}` : '' }}</div><slot /></div>
    <div class="side"><div class="lab">Kit</div><KitRef :name="kit" /></div>
  </div>
</template>

<style scoped>
.pair { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; width: 100%; padding-bottom: 12px; }
.pair.stack { flex-direction: column; flex-wrap: nowrap; }
.side { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.lab { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-tertiary); }
</style>
