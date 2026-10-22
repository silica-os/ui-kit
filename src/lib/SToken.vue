<script setup>
import SIcon from './SIcon.vue'

/** A token (chip) inside a token field: label and remove glyph. `selected` is the filled accent look. Emits `remove`. */
defineProps({ label: { type: String, default: '' }, selected: Boolean, removable: { type: Boolean, default: true } })
defineEmits(['remove', 'select'])
</script>

<template>
  <span class="s-token" :class="{ 'is-selected': selected }" @pointerdown.prevent="$emit('select')">
    <span class="s-token__label"><slot>{{ label }}</slot></span>
    <button v-if="removable" type="button" tabindex="-1" class="s-control s-token__remove" aria-label="Remove" @pointerdown.stop.prevent @click.stop="$emit('remove')"><SIcon name="xmark" :size="16" /></button>
  </span>
</template>

<style>
.s-token { display: inline-flex; align-items: center; gap: 4px; flex: none; height: 20px; padding: 0 4px 0 8px; border-radius: 10px; background: var(--accent-amalfi-soft); color: var(--accent-amalfi); font: var(--font-label); white-space: nowrap; }
.s-token.is-selected { background: var(--accent-amalfi); color: var(--text-on-accent); }
.s-token__remove { display: inline-grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; background: none; color: inherit; cursor: pointer; }
</style>
