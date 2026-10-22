<script setup>
import SPopUpButton from './SPopUpButton.vue'

/** Pull-down button: a label and one chevron; its menu holds actions. `@select` fires with the chosen option's value. */
defineProps({
  label: { type: String, default: 'Actions' },
  options: { type: Array, default: () => [] },
  size: { type: String, default: 'regular' },
  width: { type: Number, default: 0 },
  disabled: Boolean,
  force: { type: String, default: '' },
  open: Boolean,
})
defineEmits(['select'])
</script>

<template>
  <SPopUpButton pull-down :label="label" :options="options" :size="size" :width="width" :disabled="disabled" :force="force" :open="open" @select="$emit('select', $event)" />
</template>
