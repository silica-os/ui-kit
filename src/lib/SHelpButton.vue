<script setup>
/** The round help button (a question mark). Emits the native `click`. */
defineProps({ disabled: Boolean, label: { type: String, default: 'Help' }, force: { type: String, default: '' } })
</script>

<template>
  <button type="button" class="s-control s-help" :class="force && `is-${force}`" :disabled="disabled" :aria-label="label"><span class="s-help__q">?</span></button>
</template>

<style>
.s-help { position: relative; display: inline-grid; place-items: center; flex: none; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 11px; background: none; cursor: pointer; color: var(--text-primary); font: var(--font-label); }
.s-help::before, .s-help::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; transition: background var(--fade-quick), box-shadow var(--fade-quick); }
.s-help::before { background: var(--surface-control); box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1); }
.s-help__q { position: relative; left: -1px; z-index: 1; } /* the kit sets the glyph 1 pt left of centre */
.s-help:is(:hover, .is-hover):not(:active, .is-pressed)::after { background: var(--accent-amalfi-soft); }
.s-help:is(:active, .is-pressed)::before { background: var(--surface-control-pressed); }
.s-help:is(:focus-visible, .is-focus)::after { box-shadow: 0 0 0 3px var(--line-focus); }
</style>
