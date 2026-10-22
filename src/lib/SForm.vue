<script setup>
/** Form layout (Forms/Layout): a window-coloured card with a `title`, then SFormSection blocks and an SFormFooter. */
defineProps({ title: { type: String, default: '' } })
</script>

<template>
  <form class="s-form" @submit.prevent>
    <h2 v-if="title" class="s-form__title">{{ title }}</h2>
    <slot />
  </form>
</template>

<style>
.s-form { display: flex; flex-direction: column; gap: 20px; box-sizing: border-box; width: var(--s-form-w, 400px); padding: 26px 24px 24px; margin: 0; border-radius: 18px; background: var(--surface-window); box-shadow: inset 0 0 0 1px var(--line-border); color: var(--text-primary); font: var(--font-body); }
.s-form__title { margin: 0; font: var(--font-title-3); color: var(--text-primary); }
</style>
