<script setup>
import { computed } from 'vue'
import { library } from '../showcase/registry.js'

const props = defineProps({ page: String })
const entry = computed(() => library.find((e) => e.key === props.page))
</script>

<template>
  <component :is="entry.doc" v-if="entry" />
  <div v-else class="nf"><h1>Not found</h1></div>
</template>

<style scoped>.nf { padding: 36px; }</style>
