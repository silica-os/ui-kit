<script setup>
import { ref } from 'vue'
import STextField from './STextField.vue'

/** Search field: the glass pill with a magnifier and a clear button. Enter emits `search`. Place it on a toolbar or any surface. */
defineProps({
  modelValue: { type: String, default: '' },
  size: { type: String, default: 'regular', validator: (v) => ['small', 'regular', 'large'].includes(v) },
  placeholder: { type: String, default: 'Search' },
  disabled: Boolean,
  force: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'search', 'clear'])
const field = ref(null)
defineExpose({ focus: () => field.value?.focus() })
</script>

<template>
  <STextField
    ref="field" variant="glass" type="search" icon="search" clearable :size="size" :model-value="modelValue" :placeholder="placeholder"
    :disabled="disabled" :force="force" role="searchbox" enterkeyhint="search" autocomplete="off"
    @update:model-value="emit('update:modelValue', $event)" @clear="emit('clear')" @enter="emit('search', modelValue)"
  />
</template>
