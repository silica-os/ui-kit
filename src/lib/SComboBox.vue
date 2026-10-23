<script setup>
import { computed, ref, watch } from 'vue'
import STextField from './STextField.vue'
import SIcon from './SIcon.vue'

/**
 * Combo box: an editable text field with a chevron button that opens a list of `options` (strings).
 * v-model is the text; picking an option fills it. Arrow keys move in the open list, Enter picks, Escape closes.
 */
const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  size: { type: String, default: 'regular', validator: (v) => ['small', 'regular', 'large'].includes(v) },
  placeholder: { type: String, default: '' },
  disabled: Boolean,
  error: Boolean,
  force: { type: String, default: '' },
  /** Render the list open (for documentation). */
  open: Boolean,
  /** index of the highlighted option while the list is open (documentation: the kit shows one) */
  highlight: { type: Number, default: -1 },
})
const emit = defineEmits(['update:modelValue'])
const isOpen = ref(props.open)
const active = ref(props.highlight)
const root = ref(null)
const field = ref(null)
const uid = `s-combo-${Math.random().toString(36).slice(2, 8)}`
watch(() => props.open, (v) => (isOpen.value = v))

const btn = computed(() => (props.size === 'large' ? 24 : 20))
function pick(o) {
  emit('update:modelValue', o)
  isOpen.value = false
  field.value?.focus()
}
function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  active.value = props.options.indexOf(props.modelValue)
  field.value?.focus()
}
function onKey(e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!isOpen.value) { isOpen.value = true; active.value = Math.max(0, props.options.indexOf(props.modelValue)); return }
    const n = props.options.length
    active.value = (active.value + (e.key === 'ArrowDown' ? 1 : -1) + n) % n
  } else if (e.key === 'Enter' && isOpen.value && active.value >= 0) {
    e.preventDefault()
    pick(props.options[active.value])
  } else if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault()
    isOpen.value = false
  }
}
function onFocusOut(e) {
  if (!props.open && !root.value.contains(e.relatedTarget)) isOpen.value = false
}
</script>

<template>
  <div ref="root" class="s-combo" :class="{ 's-combo--open': isOpen }" @focusout="onFocusOut">
    <STextField
      ref="field" :model-value="modelValue" :size="size" :placeholder="placeholder" :disabled="disabled" :error="error"
      :force="isOpen ? 'focus' : force" role="combobox" aria-autocomplete="list" :aria-expanded="isOpen" :aria-controls="uid" autocomplete="off"
      @update:model-value="emit('update:modelValue', $event)" @keydown="onKey"
    >
      <template #trailing>
        <button
          type="button" tabindex="-1" class="s-control s-combo__button" :class="{ 'is-pressed': isOpen }" :style="{ width: btn + 'px', height: btn + 'px' }"
          aria-label="Show options" @pointerdown.prevent @click="toggle"
        ><SIcon name="chevron-down" :size="16" /></button>
      </template>
    </STextField>
    <ul v-if="isOpen" :id="uid" class="s-combo__list" role="listbox">
      <li
        v-for="(o, i) in options" :key="o" role="option" :aria-selected="o === modelValue" class="s-combo__item"
        :class="{ 'is-active': i === active, 'is-checked': o === modelValue }" @pointerdown.prevent @click="pick(o)" @pointermove="active = i"
      >
        <span class="s-combo__check"><SIcon v-if="o === modelValue" name="checkmark" :size="12" /></span>{{ o }}
      </li>
    </ul>
  </div>
</template>

<style>
.s-combo { position: relative; display: inline-block; flex: none; }
.s-combo__button {
  flex: none; display: inline-grid; place-items: center; padding: 0; border: 0; border-radius: 50%; cursor: pointer;
  background: var(--surface-sunken); color: var(--text-secondary); transition: background var(--fade-quick);
}
.s-combo__button:is(:active, .is-pressed) { background: var(--surface-control-pressed); }
.s-combo__list {
  position: absolute; z-index: 20; left: 0; top: calc(100% + 4px); width: 100%; margin: 0; padding: 4px; list-style: none; border-radius: 12px;
  background: linear-gradient(var(--glass-tint), var(--glass-tint)), #ffffff03;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px #ffffff40, var(--elevation-glass);
  backdrop-filter: var(--s-fx-regular); -webkit-backdrop-filter: var(--s-fx-regular);
}
.s-combo__item {
  display: flex; align-items: center; gap: 4px; height: 24px; padding: 0 8px; border-radius: 7px; font: var(--font-body); color: var(--text-primary);
  cursor: default; user-select: none; -webkit-user-select: none;
}
.s-combo__item.is-active { background: var(--accent-amalfi); color: var(--text-on-accent); }
.s-combo__check { display: inline-grid; place-items: center; width: 12px; height: 12px; flex: none; }
</style>
