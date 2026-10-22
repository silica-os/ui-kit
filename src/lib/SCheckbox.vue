<script setup>
import SIcon from './SIcon.vue'

/**
 * Checkbox: a native <input type="checkbox"> (keyboard, forms, labels) drawn as in the kit.
 * v-model is a Boolean; `mixed` shows the dash and is cleared by the first click.
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mixed: Boolean,
  size: { type: String, default: 'regular', validator: (v) => ['small', 'regular', 'large'].includes(v) },
  disabled: Boolean,
  force: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'update:mixed'])
function onChange(e) {
  emit('update:mixed', false)
  emit('update:modelValue', e.target.checked)
}
</script>

<template>
  <label class="s-control s-check" :class="[`s-check--${size}`, force && `is-${force}`, { 's-check--on': modelValue || mixed, 'is-disabled': disabled }]">
    <input type="checkbox" class="s-check__input" :checked="modelValue && !mixed" :indeterminate.prop="mixed" :disabled="disabled" @change="onChange" />
    <span class="s-check__box"><SIcon v-if="modelValue || mixed" :name="mixed ? 'minus' : 'checkmark'" :size="size === 'large' ? 16 : 12" /></span>
    <span v-if="$slots.default" class="s-check__label"><slot /></span>
  </label>
</template>

<style>
.s-check { position: relative; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font: var(--font-body); color: var(--text-primary); padding: 0; }
.s-check:has(.s-check__label) { padding: 0 4px; min-height: 20px; }
.s-check.is-disabled { opacity: 0.35; cursor: default; pointer-events: none; }
.s-check__input, .s-radio__input { position: absolute; opacity: 0; width: 0; height: 0; margin: 0; }

.s-check__box, .s-radio__box {
  position: relative; display: inline-grid; place-items: center; flex: none; width: 16px; height: 16px; border-radius: 5px; color: var(--text-on-accent);
  background: var(--surface-raised); box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1);
  transition: background var(--fade-quick), box-shadow var(--fade-quick);
}
.s-check--small .s-check__box { border-radius: 4px; }
.s-check--large .s-check__box { width: 20px; height: 20px; border-radius: 6px; }
.s-check--on .s-check__box { background: var(--accent-amalfi); box-shadow: none; }

/* states: hover and press tint the box; the focus halo follows keyboard focus on the hidden input */
.s-check:is(:hover, .is-hover):not(:active, .is-pressed) .s-check__box { box-shadow: inset 0 0 0 1px var(--accent-amalfi), var(--elevation-1); }
.s-check--on:is(:hover, .is-hover):not(:active, .is-pressed) .s-check__box { box-shadow: inset 0 0 0 20px var(--state-hover-overlay); }
.s-check:is(:active, .is-pressed) .s-check__box { background: var(--accent-amalfi-soft); box-shadow: inset 0 0 0 1px var(--accent-amalfi), var(--elevation-1); }
.s-check--on:is(:active, .is-pressed) .s-check__box { background: var(--accent-amalfi-pressed); box-shadow: none; }
.s-check:has(.s-check__input:focus-visible) .s-check__box, .s-check.is-focus .s-check__box { outline: 3px solid var(--line-focus); outline-offset: 0; }
</style>
