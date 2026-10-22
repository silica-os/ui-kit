<script setup>
import SIcon from './SIcon.vue'

/** The round chevron button that sits inside a field (Fields/Combo Button): opens a list. Sizes follow the field: small and regular are 20 pt, large 24. */
defineProps({ size: { type: String, default: 'regular' }, disabled: Boolean, force: { type: String, default: '' }, label: { type: String, default: 'Show options' } })
</script>

<template>
  <button type="button" class="s-control s-combobtn" :class="[`s-combobtn--${size}`, force && `is-${force}`]" :disabled="disabled" :aria-label="label"><SIcon name="chevron-down" :size="16" /></button>
</template>

<style>
.s-combobtn { flex: none; display: inline-grid; place-items: center; width: 20px; height: 20px; padding: 0; border: 0; border-radius: 10px; cursor: pointer; background: var(--surface-sunken); color: var(--text-secondary); transition: background var(--fade-quick); }
.s-combobtn--large { width: 24px; height: 24px; border-radius: 12px; }
.s-combobtn:is(:active, .is-pressed) { background: var(--surface-control-pressed); }
.s-combobtn:disabled { opacity: 0.35; }
</style>
