<script setup>
import KitSymbol from './KitSymbol.vue'

defineProps({
  names: { type: Array, required: true },
  scale: { type: Number, default: 1 },
})
const label = (n) => n.split('/').slice(2).join(' / ')
</script>

<template>
  <div class="gallery">
    <figure v-for="n in names" :key="n">
      <KitSymbol :name="n" :scale="scale" />
      <figcaption>{{ label(n) }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.gallery { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
figure { margin: 0; }
figcaption { font: 11px/1.3 ui-monospace, monospace; color: #888; margin-top: 4px; max-width: 260px; }
</style>
