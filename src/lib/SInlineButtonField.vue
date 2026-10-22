<script setup>
import STextField from './STextField.vue'
import SButton from './SButton.vue'

/** A text field with a small push button inside its trailing edge (Fields/Inline Button), e.g. a path with "Choose…". Emits `action` on the button. */
defineOptions({ inheritAttrs: false })
defineProps({ modelValue: { type: String, default: '' }, button: { type: String, default: 'Browse' }, disabled: Boolean, force: { type: String, default: '' } })
defineEmits(['update:modelValue', 'action'])
</script>

<template>
  <STextField v-bind="$attrs" class="s-inlinefield" :model-value="modelValue" :disabled="disabled" :force="force" @update:model-value="$emit('update:modelValue', $event)">
    <template #trailing><SButton size="small" :disabled="disabled" @pointerdown.prevent @click="$emit('action')">{{ button }}</SButton></template>
  </STextField>
</template>

<style>
.s-field.s-inlinefield { --s-field-w: 260px; width: var(--s-field-w, 260px); }
.s-inlinefield .s-button { margin-right: 0; }
</style>
