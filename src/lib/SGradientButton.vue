<script setup>
import SIcon from './SIcon.vue'

/** The add/remove pair under a list (Buttons/Gradient): a plus half and a minus half. Emits `add` and `remove`. */
defineProps({ disabled: Boolean, removeDisabled: Boolean, force: { type: String, default: '' } })
defineEmits(['add', 'remove'])
</script>

<template>
  <div class="s-gradient" :class="[force && `is-${force}`, { 'is-disabled': disabled }]" role="group">
    <button type="button" class="s-control s-gradient__half" :disabled="disabled" aria-label="Add" @click="$emit('add')"><SIcon name="plus" :size="16" /></button>
    <button type="button" class="s-control s-gradient__half" :disabled="disabled || removeDisabled" aria-label="Remove" @click="$emit('remove')"><SIcon name="minus" :size="16" /></button>
  </div>
</template>

<style>
.s-gradient { position: relative; display: inline-flex; flex: none; width: 56px; height: 24px; border-radius: 7px; background: var(--surface-control); box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1); color: var(--text-primary); transition: box-shadow var(--fade-quick); }
.s-gradient::after { content: ''; position: absolute; left: 28px; top: 6px; width: 1px; height: 12px; background: var(--line-separator); pointer-events: none; }
.s-gradient:has(:focus-visible), .s-gradient.is-focus { box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1), 0 0 0 3px var(--line-focus); }
.s-gradient__half { flex: 1; display: grid; place-items: center; padding: 0; border: 0; background: none; color: inherit; cursor: pointer; transition: background var(--fade-quick); outline: none; }
.s-gradient__half:first-child { border-radius: 7px 0 0 7px; } .s-gradient__half:last-child { border-radius: 0 7px 7px 0; }
.s-gradient__half:is(:hover):not(:disabled), .s-gradient.is-hover .s-gradient__half { background: var(--accent-amalfi-soft); }
.s-gradient__half:is(:active):not(:disabled) { background: var(--surface-control-pressed); }
.s-gradient.is-pressed { background: var(--surface-control-pressed); }
.s-gradient.is-disabled { opacity: 0.35; pointer-events: none; }
.s-gradient__half:disabled { opacity: 0.35; }
.s-gradient.is-disabled .s-gradient__half:disabled { opacity: 1; }
</style>
