<script setup>
import { useId } from 'vue'

/**
 * One row of a form (Forms/Row): the label is right-aligned in a 112 pt column and the control, from the default slot, sits in the value
 * column. `help` adds a tertiary caption under the control, `error` a secondary one (give the control its own `error` prop). The label
 * column width follows `--s-form-label`.
 */
defineProps({ label: { type: String, default: '' }, help: { type: String, default: '' }, error: { type: String, default: '' }, forId: { type: String, default: undefined } })
const id = useId()
</script>

<template>
  <div class="s-formrow" role="group" :aria-labelledby="`${id}-l`">
    <div class="s-formrow__label"><label :id="`${id}-l`" :for="forId">{{ label }}</label></div>
    <div class="s-formrow__value">
      <slot />
      <p v-if="error" class="s-formrow__msg s-formrow__msg--error" role="alert">{{ error }}</p>
      <p v-else-if="help" class="s-formrow__msg">{{ help }}</p>
    </div>
  </div>
</template>

<style>
.s-formrow { display: flex; align-items: flex-start; gap: 12px; min-width: 0; }
.s-formrow__label { flex: none; display: flex; justify-content: flex-end; align-items: center; width: var(--s-form-label, 112px); min-height: 28px; text-align: right; font: var(--font-body); color: var(--text-primary); }
.s-formrow__value { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; justify-content: center; min-height: 28px; }
.s-formrow__value > .s-field, .s-formrow__value > .s-combo { align-self: stretch; width: auto; }
.s-formrow__msg { margin: 0; font: var(--font-caption); color: var(--text-tertiary); }
.s-formrow__msg--error { color: var(--text-secondary); }
</style>
