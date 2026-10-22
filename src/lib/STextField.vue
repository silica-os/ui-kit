<script setup>
import { computed, ref, useAttrs } from 'vue'
import SIcon from './SIcon.vue'

/**
 * Single-line text field: a native <input> drawn as in the kit. v-model is the string.
 * `variant="glass"` is the search look (used by SSearchField); `#leading` / `#trailing` slots put content inside the field.
 * `clearable` shows the clear button when there is text; `error` shows the terracotta border and the warning glyph.
 */
defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: String, default: '' },
  size: { type: String, default: 'regular', validator: (v) => ['small', 'regular', 'large'].includes(v) },
  variant: { type: String, default: 'field', validator: (v) => ['field', 'glass'].includes(v) },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  /** Symbol name drawn before the text (the magnifier for a search field). */
  icon: { type: String, default: '' },
  clearable: Boolean,
  error: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  force: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'clear', 'enter'])
const attrs = useAttrs()
const input = ref(null)

const inputAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs
  return rest
})
const iconSize = computed(() => (props.size === 'small' ? 16 : 20))
const showClear = computed(() => props.clearable && !props.disabled && !props.readonly && props.modelValue !== '')

function clear() {
  emit('update:modelValue', '')
  emit('clear')
  input.value?.focus()
}
defineExpose({ focus: () => input.value?.focus(), blur: () => input.value?.blur(), input })
</script>

<template>
  <div
    class="s-field" :class="[`s-field--${size}`, `s-field--${variant}`, force && `is-${force}`, attrs.class, { 's-field--error': error, 's-field--disabled': disabled }]"
    :style="attrs.style" @pointerdown.self.prevent="input?.focus()"
  >
    <SIcon v-if="icon" class="s-field__icon" :name="icon" :size="iconSize" />
    <slot name="leading" />
    <input
      ref="input" class="s-control s-field__input" :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled"
      :readonly="readonly" :aria-invalid="error || undefined" v-bind="inputAttrs"
      @input="emit('update:modelValue', $event.target.value)" @keydown.enter="emit('enter', $event)"
    />
    <button v-if="showClear" type="button" tabindex="-1" class="s-control s-field__clear" aria-label="Clear" @pointerdown.prevent @click="clear">
      <SIcon name="xmark" :size="16" />
    </button>
    <SIcon v-if="error" class="s-field__error" name="warning" :size="20" />
    <slot name="trailing" />
  </div>
</template>

<style>
.s-field {
  --r: 9px; --pad: 8px; --h: 28px;
  position: relative; display: inline-flex; align-items: center; gap: 4px; flex: none; isolation: isolate;
  width: var(--s-field-w, 200px); height: var(--h); padding: 0 var(--pad); border-radius: var(--r); cursor: text;
  font: var(--font-body); color: var(--text-primary);
}
.s-field--small { --r: 7px; --h: 24px; font: var(--font-callout); }
.s-field--large { --r: 10px; --pad: 12px; --h: 32px; }
.s-field--disabled { opacity: 0.35; cursor: default; pointer-events: none; }

.s-field--field { background: var(--surface-raised); box-shadow: inset 0 0 0 1px var(--line-border); transition: box-shadow var(--fade-quick); }
.s-field--field:is(:focus-within, .is-focus) { box-shadow: inset 0 0 0 1.5px var(--accent-amalfi), 0 0 0 3px var(--line-focus); }
.s-field--field.s-field--error { box-shadow: inset 0 0 0 1.5px var(--palette-terracotta); }
.s-field--field.s-field--error:is(:focus-within, .is-focus) { box-shadow: inset 0 0 0 1.5px var(--palette-terracotta), 0 0 0 3px color-mix(in srgb, var(--palette-terracotta) 30%, transparent); }

/* glass look of the search field */
.s-field--glass { --r: 14px; transition: box-shadow var(--fade-quick); }
.s-field--glass.s-field--small { --r: 12px; }
.s-field--glass.s-field--large { --r: 16px; }
.s-field--glass::before {
  content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none;
  background: linear-gradient(var(--glass-tint), var(--glass-tint)), #ffffff03;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px #ffffff40, var(--elevation-2);
  backdrop-filter: blur(10px) saturate(1.6) brightness(1.12); -webkit-backdrop-filter: blur(10px) saturate(1.6) brightness(1.12);
}
.s-field--glass:is(:focus-within, .is-focus) { box-shadow: 0 0 0 3px var(--line-focus); }

.s-field .s-field__input.s-field__input {
  flex: 1 1 0; min-width: 0; height: 100%; margin: 0; padding: 0; border: 0; background: none; outline: none; appearance: none; -webkit-appearance: none;
  font: inherit; color: inherit; caret-color: var(--accent-amalfi); text-overflow: ellipsis; user-select: text; -webkit-user-select: text;
}
.s-field .s-field__input:disabled { opacity: 1; }
.s-field__input::placeholder { color: var(--text-tertiary); opacity: 1; }
.s-field__input::-webkit-search-cancel-button { display: none; }
.s-field__icon { color: var(--text-secondary); }
.s-field__error { color: var(--palette-terracotta); }

.s-field__clear {
  flex: none; display: inline-grid; place-items: center; width: 20px; height: 20px; padding: 0; border: 0; border-radius: 50%;
  background: var(--text-tertiary); color: var(--text-on-accent); cursor: pointer;
}
.s-field__clear:is(:hover) { background: var(--text-secondary); }
</style>
