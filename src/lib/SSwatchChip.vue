<script setup>
/** A colour chip (Wells/Swatch Chip): a 24 pt disc of `color` (any CSS colour, var(--token) too). `selected` draws the accent ring. A button when clickable. */
defineProps({ color: { type: String, default: '#0E77E6' }, selected: Boolean, label: { type: String, default: 'Colour' }, disabled: Boolean })
</script>

<template>
  <button type="button" class="s-control s-swatch" :class="{ 'is-selected': selected }" :style="{ '--c': color }" :disabled="disabled" :aria-label="label" :aria-pressed="selected" />
</template>

<style>
.s-swatch { position: relative; flex: none; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 12px; background: var(--c); box-shadow: inset 0 0 0 1px var(--line-border); cursor: pointer; transition: box-shadow var(--fade-quick); }
.s-swatch.is-selected { box-shadow: inset 0 0 0 1px var(--line-border), 0 0 0 2px var(--accent-amalfi); }
.s-swatch:focus-visible { box-shadow: inset 0 0 0 1px var(--line-border), 0 0 0 3px var(--line-focus); }
.s-swatch:disabled { opacity: 0.35; }
</style>
