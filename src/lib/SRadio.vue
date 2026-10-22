<script setup>
/** Radio button: a native <input type="radio">. Give radios of one group the same `name` and v-model. */
defineProps({
  modelValue: { default: null },
  value: { default: true },
  name: String,
  size: { type: String, default: 'regular', validator: (v) => ['small', 'regular', 'large'].includes(v) },
  disabled: Boolean,
  force: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="s-control s-check s-radio" :class="[`s-check--${size}`, force && `is-${force}`, { 's-check--on': modelValue === value, 'is-disabled': disabled }]">
    <input type="radio" class="s-radio__input" :name="name" :checked="modelValue === value" :disabled="disabled" @change="$emit('update:modelValue', value)" />
    <span class="s-radio__box"><i v-if="modelValue === value" class="s-radio__dot" /></span>
    <span v-if="$slots.default" class="s-check__label"><slot /></span>
  </label>
</template>

<style>
.s-radio__box { border-radius: 50%; }
.s-check--large .s-radio__box { width: 20px; height: 20px; border-radius: 50%; }
.s-radio__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-on-accent); }
.s-radio.s-check--on .s-radio__box { background: var(--accent-amalfi); box-shadow: none; }
.s-radio.s-check--on:is(:hover, .is-hover):not(:active, .is-pressed) .s-radio__box { box-shadow: inset 0 0 0 20px var(--state-hover-overlay); }
.s-radio.s-check--on:is(:active, .is-pressed) .s-radio__box { background: var(--accent-amalfi-pressed); }
.s-radio:not(.s-check--on):is(:hover, .is-hover):not(:active, .is-pressed) .s-radio__box { box-shadow: inset 0 0 0 1px var(--accent-amalfi), var(--elevation-1); }
.s-radio:not(.s-check--on):is(:active, .is-pressed) .s-radio__box { background: var(--accent-amalfi-soft); box-shadow: inset 0 0 0 1px var(--accent-amalfi), var(--elevation-1); }
.s-radio:has(.s-radio__input:focus-visible) .s-radio__box, .s-radio.is-focus .s-radio__box { outline: 3px solid var(--line-focus); }
</style>
