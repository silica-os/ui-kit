<script setup>
import SGlassPanel from './SGlassPanel.vue'
/** Form layout (Forms/Layout): a window-coloured card with a `title`, then SFormSection blocks and an SFormFooter. */
defineProps({ title: { type: String, default: '' } })
</script>

<template>
  <SGlassPanel tag="form" raised flat smooth :radius="18" class="s-form" @submit.prevent>
    <h2 v-if="title" class="s-form__title">{{ title }}</h2>
    <slot />
  </SGlassPanel>
</template>

<style>
.s-form { display: flex; flex-direction: column; gap: 20px; box-sizing: border-box; width: var(--s-form-w, 400px); padding: 26px 24px 24px; margin: 0; color: var(--text-primary); font: var(--font-body); }
.s-form__title { margin: 0; font: var(--font-title-3); color: var(--text-primary); }
.s-form .s-glass__fill { background: var(--surface-window); }
</style>
