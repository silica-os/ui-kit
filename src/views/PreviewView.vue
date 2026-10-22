<script setup>
import KitSymbol from '../render/KitSymbol.vue'

defineProps({ name: String, scale: { type: Number, default: 3 } })
</script>

<template>
  <div class="preview"><KitSymbol :name="name" :scale="scale" :padding="16" /></div>
</template>

<style scoped>.preview { padding: 16px; }</style>
