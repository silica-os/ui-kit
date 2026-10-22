<script setup>
import SIcon from './SIcon.vue'

/** Round chevron button that expands or collapses something. v-model:expanded. */
defineProps({ expanded: Boolean, disabled: Boolean, force: { type: String, default: '' } })
defineEmits(['update:expanded'])
</script>

<template>
  <button class="s-control s-disclosure" :class="[force && `is-${force}`]" type="button" :aria-expanded="expanded" :disabled="disabled" @click="$emit('update:expanded', !expanded)">
    <SIcon :name="expanded ? 'chevron-up' : 'chevron-down'" :size="12" />
  </button>
</template>

<style>
.s-disclosure { position: relative; display: inline-grid; place-items: center; flex: none; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 11px; background: none; cursor: pointer; color: var(--text-primary); }
.s-disclosure::before, .s-disclosure::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; transition: background var(--fade-quick), box-shadow var(--fade-quick); }
.s-disclosure::before { background: var(--surface-control); box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1); }
.s-disclosure > * { position: relative; z-index: 1; }
.s-disclosure:is(:hover, .is-hover):not(:active, .is-pressed)::after { background: var(--accent-amalfi-soft); }
.s-disclosure:is(:active, .is-pressed)::before { background: var(--surface-control-pressed); }
.s-disclosure:is(:focus-visible, .is-focus)::after { box-shadow: 0 0 0 3px var(--line-focus); }
</style>
