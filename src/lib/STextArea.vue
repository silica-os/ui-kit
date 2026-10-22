<script setup>
import { computed, ref, useAttrs } from 'vue'
import './STextField.vue'

/** Multi-line text field: a native <textarea> in the text field's frame (same border, focus, error and disabled looks). v-model is the string. */
defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  /** visible lines (the kit's area is 4 lines tall) */
  rows: { type: Number, default: 4 },
  error: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  force: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const area = ref(null)
const rest = computed(() => { const { class: _c, style: _s, ...r } = attrs; return r })
defineExpose({ focus: () => area.value?.focus(), area })
</script>

<template>
  <div
    class="s-field s-field--field s-textarea" :class="[force && `is-${force}`, attrs.class, { 's-field--error': error, 's-field--disabled': disabled }]"
    :style="[{ '--rows': rows }, attrs.style]" @pointerdown.self.prevent="area?.focus()"
  >
    <textarea
      ref="area" class="s-control s-field__input s-textarea__input" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
      :aria-invalid="error || undefined" v-bind="rest" @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style>
.s-field.s-textarea { --h: calc(var(--rows) * 18px + 16px); --pad: 8px; width: var(--s-field-w, 240px); height: var(--h); padding: 8px; align-items: stretch; }
.s-field .s-textarea__input.s-textarea__input { resize: none; height: 100%; line-height: 18px; text-overflow: clip; }
</style>
