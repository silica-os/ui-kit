<script setup>
import { theme } from './theme.js'

defineProps({ title: String, kit: String, lead: String })
</script>

<template>
  <div class="doc">
    <header>
      <div>
        <h1>{{ title }}</h1>
        <p v-if="lead" class="muted lead">{{ lead }}</p>
      </div>
      <div class="seg" role="group" aria-label="Preview theme">
        <button :class="{ on: theme === 'light' }" @click="theme = 'light'">Light</button>
        <button :class="{ on: theme === 'dark' }" @click="theme = 'dark'">Dark</button>
      </div>
    </header>
    <slot />
  </div>
</template>

<style scoped>
.doc { padding: 36px; max-width: 1100px; }
header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 8px; }
.lead { max-width: 620px; margin: 0; }
</style>
