<script setup>
import { computed, ref } from 'vue'
import './STextField.vue'
import SToken from './SToken.vue'

/**
 * Token field: an input that turns what you type into tokens. v-model is the array of strings. Enter, comma or Tab (with text) adds a token,
 * Backspace on empty text selects the last token and a second Backspace removes it, the glyph on a token removes it. Duplicates are ignored.
 */
defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Add tag' },
  error: Boolean,
  disabled: Boolean,
  force: { type: String, default: '' },
  /** index of a token shown selected (showcase) */
  selected: { type: Number, default: -1 },
})
const emit = defineEmits(['update:modelValue'])
const text = ref('')
const sel = ref(-1)
const input = ref(null)
const current = computed(() => (props.selected >= 0 ? props.selected : sel.value))

function add() {
  const v = text.value.trim().replace(/,$/, '')
  text.value = ''
  if (v && !props.modelValue.includes(v)) emit('update:modelValue', [...props.modelValue, v])
}
function remove(i) {
  emit('update:modelValue', props.modelValue.filter((_, j) => j !== i))
  sel.value = -1
  input.value?.focus()
}
function onKey(e) {
  if (e.key === 'Enter' || e.key === ',' || (e.key === 'Tab' && text.value.trim())) { e.preventDefault(); add() }
  else if (e.key === 'Backspace' && !text.value) {
    if (sel.value >= 0) remove(sel.value)
    else if (props.modelValue.length) sel.value = props.modelValue.length - 1
  } else if (e.key === 'ArrowLeft' && !text.value && props.modelValue.length) { sel.value = sel.value < 0 ? props.modelValue.length - 1 : Math.max(0, sel.value - 1) }
  else if (e.key === 'ArrowRight' && sel.value >= 0) sel.value = sel.value + 1 < props.modelValue.length ? sel.value + 1 : -1
  else if (sel.value >= 0 && e.key.length === 1) sel.value = -1
}
</script>

<template>
  <div
    class="s-field s-field--field s-tokenfield" :class="[force && `is-${force}`, $attrs.class, { 's-field--error': error, 's-field--disabled': disabled }]" :style="$attrs.style"
    @pointerdown.self.prevent="input?.focus()"
  >
    <SToken v-for="(t, i) in modelValue" :key="t" :label="t" :selected="i === current" @select="sel = i" @remove="remove(i)" />
    <input
      ref="input" v-model="text" class="s-control s-field__input s-tokenfield__input" :placeholder="placeholder" :disabled="disabled"
      :aria-invalid="error || undefined" @keydown="onKey" @blur="add(); sel = -1"
    />
  </div>
</template>

<style>
.s-field.s-tokenfield { --s-field-w: 260px; width: var(--s-field-w, 260px); height: auto; min-height: 28px; padding: 4px 8px 4px 4px; flex-wrap: wrap; row-gap: 4px; }
.s-tokenfield .s-field__input.s-tokenfield__input { flex: 1 1 60px; height: 18px; min-width: 60px; }
</style>
