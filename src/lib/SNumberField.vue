<script setup>
import { computed, ref, watch } from 'vue'
import STextField from './STextField.vue'
import SStepper from './SStepper.vue'

/**
 * Number field: a text field with an SStepper beside it (Steppers/With Field). v-model is a number clamped to `min`..`max`.
 * Type a value and press Enter or leave the field to commit it; ↑ ↓ in the field and the stepper move by `step`.
 * `stepper="false"` shows the value field alone (Steppers/Value Field).
 */
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 },
  size: { type: String, default: 'regular', validator: (v) => ['small', 'regular', 'large'].includes(v) },
  stepper: { type: Boolean, default: true },
  /** width of the value field in pt */
  width: { type: Number, default: 56 },
  disabled: Boolean,
  error: Boolean,
  force: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])
const decimals = computed(() => (String(props.step).split('.')[1] || '').length)
const fmt = (v) => String(Number(v.toFixed(decimals.value)))
const text = ref(fmt(props.modelValue))
watch(() => props.modelValue, (v) => (text.value = fmt(v)))

function clamp(v) { return Math.min(props.max, Math.max(props.min, Number(v.toFixed(decimals.value)))) }
function commit() {
  const n = parseFloat(text.value.replace(',', '.'))
  const v = Number.isFinite(n) ? clamp(n) : props.modelValue
  text.value = fmt(v)
  if (v !== props.modelValue) emit('update:modelValue', v)
}
function onKey(e) {
  const k = { ArrowUp: 1, ArrowDown: -1 }[e.key]
  if (!k) return
  e.preventDefault()
  const base = Number.isFinite(parseFloat(text.value)) ? parseFloat(text.value) : props.modelValue
  const v = clamp(base + k * props.step)
  text.value = fmt(v)
  emit('update:modelValue', v)
}
</script>

<template>
  <div class="s-number" :class="`s-number--${size}`">
    <STextField
      v-model="text" class="s-number__field" :size="size" :disabled="disabled" :error="error" :force="force" inputmode="decimal" :style="{ '--s-field-w': width + 'px' }"
      role="spinbutton" :aria-valuenow="modelValue" @keydown="onKey" @blur="commit" @enter="commit"
    />
    <SStepper v-if="stepper" :model-value="modelValue" :min="min" :max="max" :step="step" :size="size" :disabled="disabled" @update:model-value="emit('update:modelValue', $event)" />
  </div>
</template>

<style>
.s-number { display: inline-flex; align-items: center; gap: 8px; flex: none; }
.s-number__field .s-field__input { text-align: left; }
</style>
