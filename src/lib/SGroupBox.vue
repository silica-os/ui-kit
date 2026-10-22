<script setup>
/** A titled (or untitled) box that groups controls. Its content is the default slot; a stack with 8 pt gaps. */
defineProps({ title: String, disabled: Boolean })
</script>

<template>
  <section class="s-groupbox" :class="{ 'is-disabled': disabled }">
    <h3 v-if="title" class="s-groupbox__title">{{ title }}</h3>
    <div class="s-groupbox__box"><slot /></div>
  </section>
</template>

<style>
.s-groupbox { display: flex; flex-direction: column; gap: 6px; font: var(--font-body); color: var(--text-primary); }
.s-groupbox:not(:has(.s-groupbox__title)) { gap: 4px; }
.s-groupbox.is-disabled { opacity: 0.35; pointer-events: none; }
.s-groupbox__title { margin: 0; font: var(--font-headline); color: var(--text-secondary); }
.s-groupbox__box { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: var(--radius-menu); background: var(--surface-raised); box-shadow: inset 0 0 0 1px var(--line-border); }
</style>
